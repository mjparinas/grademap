import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { ChoiceQuestion, Course, GenerateOptions, InputQuestion, Question, Visual } from "../../types";

// Grade 7 maths for the "big" age band: direct prompts, real-world contexts and
// plenty of typed answers. Anything that needs exact decimal maths is built from
// whole-number units (tenths, hundredths, cents) and only turned into a decimal
// for display, so floating-point noise never reaches a student.

type Level = 1 | 2 | 3;
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

// ---------- Shared helpers ----------

/** Tidy number text: 0.1 + 0.2 → "0.3", −0 → "0". Negatives use "-" so keypads and tests can read them. */
function fmt(x: number): string {
  const v = Number(x.toFixed(6));
  return String(v === 0 ? 0 : v);
}

/** A number placed inside an expression: negatives get brackets, e.g. 5 − (-3). */
function br(x: number): string {
  return x < 0 ? `(${fmt(x)})` : fmt(x);
}

/** Round half up to `dp` decimal places (for positive measurements). */
function roundTo(x: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(x * f + 1e-7) / f;
}

/** Cents → "$12.50". */
function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Cents → keypad answer text, e.g. 4250 → "42.50". */
function dollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** A non-zero integer whose size is between min and max, with a random sign. */
function signed(min: number, max: number): number {
  const n = randInt(min, max);
  return chance(0.5) ? -n : n;
}

/** A random integer in [min, max] that isn't a multiple of 10 (so decimals don't end in 0). */
function notRound(min: number, max: number): number {
  let n: number;
  do n = randInt(min, max);
  while (n % 10 === 0);
  return n;
}

const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n: number, word: string): string => `${n} ${word}${Math.abs(n) === 1 ? "" : "s"}`;

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** A fraction in lowest terms: (6, 8) → "3/4". */
function fraction(n: number, d: number): string {
  const g = gcd(n, d);
  return `${n / g}/${d / g}`;
}

const xy = (x: number, y: number): string => `(${x}, ${y})`;

/** A linear expression: lin(3, 2) → "3n + 2", lin(-2, -5, "x") → "-2x − 5", lin(1, 0) → "n". */
function lin(m: number, b: number, v = "n"): string {
  const term = m === 1 ? v : m === -1 ? `-${v}` : `${m}${v}`;
  if (b === 0) return term;
  return `${term} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`;
}

/** " + 4" or " − 4", for writing the constant part of a calculation. */
const plusConst = (b: number): string => (b === 0 ? "" : ` ${b < 0 ? "−" : "+"} ${Math.abs(b)}`);

/** Show an expression as a big visual only when it fits comfortably on a phone. */
function exprVisual(text: string): Visual | undefined {
  return text.length <= 16 ? { type: "equation", text } : undefined;
}

interface NumOpts {
  unit?: string;
  format?: (n: number) => string;
  step?: number;
  min?: number;
  count?: number;
}

/**
 * Multiple choice with number answers. Wrong answers that clash with the answer
 * (or each other) are skipped; any gaps are filled with nearby values.
 */
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

/** A typed-answer question. */
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

/** π × k using 3.14, rounded to one decimal place, plus sensible rounding variants. */
function piAnswer(k: number): { exact: number; answer: string; accept: string[] } {
  const exact = Number((3.14 * k).toFixed(6));
  const answer = roundTo(exact, 1).toFixed(1);
  const accept = [fmt(exact), fmt(roundTo(exact, 2)), fmt(roundTo(Math.PI * k, 1)), fmt(roundTo(Math.PI * k, 2))];
  return { exact, answer, accept };
}

interface Concept {
  levels: Level[];
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
}

function conceptQ(bank: Concept[], d: Level): ChoiceQuestion {
  const c = pick(bank.filter((b) => b.levels.includes(d)));
  return textChoice(c.prompt, c.right, c.wrong, c.hint);
}

// ---------- 1. Adding & Subtracting Integers ----------

function addHint(a: number, b: number): string {
  const s = a + b;
  if (a === -b) return `${a} and ${br(b)} are opposites (a zero pair), so the sum is 0.`;
  if (a < 0 === b < 0) {
    return `Same signs: add the sizes, ${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(s)}, and keep the sign. The answer is ${s}.`;
  }
  const big = Math.abs(a) > Math.abs(b) ? a : b;
  return `Different signs: subtract the sizes, ${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(s)}. Keep the sign of ${big}, the number farther from zero. The answer is ${s}.`;
}

function integerAddSub(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const R = d === 1 ? 10 : d === 2 ? 20 : 40;
  const qs: Question[] = [];

  // Jumps on a number line.
  {
    const a = signed(1, d === 1 ? 8 : 12);
    const b = signed(2, d === 1 ? 8 : 12);
    const end = a + b;
    let lo = Math.min(a, end, 0) - 1;
    let hi = Math.max(a, end, 0) + 1;
    let labelEvery = 1;
    if (hi - lo > 12) {
      labelEvery = 5;
      lo = Math.floor(lo / 5) * 5;
      hi = Math.ceil(hi / 5) * 5;
    }
    qs.push(
      numQ(
        `Start at ${a} and add ${br(b)}. Where do you land?`,
        end,
        [a - b, -end, end + Math.sign(b)],
        b > 0
          ? `Adding a positive number moves right. From ${a}, jump ${b} to the right to land on ${end}.`
          : `Adding a negative number moves left. From ${a}, jump ${-b} to the left to land on ${end}.`,
        { type: "numberLine", min: lo, max: hi, step: 1, labelEvery, jumps: [{ from: a, to: end }], blankAt: end },
      ),
    );
  }

  // Sums (three terms for a stretch).
  if (d < 3) {
    const a = signed(1, R);
    let b = signed(1, R);
    if (a > 0 && b > 0) b = -b;
    qs.push(
      numQ(`What is ${a} + ${br(b)}?`, a + b, [a - b, -(a + b), b - a], addHint(a, b), {
        type: "equation",
        text: `${a} + ${br(b)} = ?`,
      }),
    );
  } else {
    const a = signed(5, R);
    const b = signed(5, R);
    const c = signed(5, R);
    const v = a + b - c;
    qs.push(
      numQ(
        `What is ${a} + ${br(b)} − ${br(c)}?`,
        v,
        [a + b + c, -v, a - b - c],
        `Change the subtraction to adding the opposite: ${a} + ${br(b)} + ${br(-c)}. Then work left to right: ${a} + ${br(b)} = ${a + b}, and ${a + b} + ${br(-c)} = ${v}.`,
      ),
    );
  }

  // Subtraction.
  {
    const a = signed(1, R);
    const b = chance(0.65) ? -randInt(2, R) : randInt(2, R);
    qs.push(
      typed(
        `What is ${a} − ${br(b)}?`,
        fmt(a - b),
        `Subtracting is the same as adding the opposite: ${a} − ${br(b)} = ${a} + ${br(-b)} = ${a - b}.`,
        "integer",
        { visual: { type: "equation", text: `${a} − ${br(b)} = ?` } },
      ),
    );
  }

  // Same value as…
  {
    let a: number, b: number;
    do {
      a = signed(2, R);
      b = signed(2, R);
    } while (a === b);
    qs.push(
      textChoice(
        `Which expression has the same value as ${a} − ${br(b)}?`,
        `${a} + ${br(-b)}`,
        [`${a} + ${br(b)}`, `${-a} + ${br(b)}`, `${b} − ${br(a)}`],
        `Subtracting a number is the same as adding its opposite. The opposite of ${b} is ${-b}, so ${a} − ${br(b)} = ${a} + ${br(-b)} = ${a - b}.`,
      ),
    );
  }

  // Temperature change.
  {
    const t0 = d === 3 ? signed(1, 15) : -randInt(2, d === 1 ? 10 : 20);
    const rise = randInt(3, d === 1 ? 15 : 25);
    const visual: Visual = { type: "emoji", emoji: "🌡️", caption: `${t0}°C` };
    if (d < 3) {
      const t1 = t0 + rise;
      qs.push(
        typed(
          `At 6 a.m. the temperature was ${t0}°C. By noon it had risen ${rise}°C. What was the temperature at noon?`,
          fmt(t1),
          `Rising means adding: ${t0} + ${rise} = ${t1}. On a thermometer, count up ${rise} degrees from ${t0}.`,
          "integer",
          { suffix: "°C", visual },
        ),
      );
    } else {
      const fall = randInt(10, 30);
      const t2 = t0 + rise - fall;
      qs.push(
        typed(
          `At 6 a.m. it was ${t0}°C. The temperature rose ${rise}°C by noon, then fell ${fall}°C by midnight. What was the temperature at midnight?`,
          fmt(t2),
          `Rises add and falls subtract: ${t0} + ${rise} − ${fall} = ${t0 + rise} − ${fall} = ${t2}.`,
          "integer",
          { suffix: "°C", visual },
        ),
      );
    }
  }

  // Distance between two integers.
  if (chance(0.5)) {
    const half = R / 2;
    const hi = randInt(1, half);
    const lo = -randInt(1, half);
    qs.push(
      typed(
        `The high today was ${hi}°C and the low was ${lo}°C. How many degrees warmer was the high than the low?`,
        fmt(hi - lo),
        `Find high − low: ${hi} − ${br(lo)} = ${hi} + ${-lo} = ${hi - lo}. On the number line that's ${plural(-lo, "step")} from ${lo} up to 0, plus ${hi} more up to ${hi}.`,
        "integer",
        {
          suffix: "°C",
          visual: { type: "numberLine", min: Math.floor(lo / 5) * 5, max: Math.ceil(hi / 5) * 5, step: 1, labelEvery: 5, marks: [lo, hi] },
        },
      ),
    );
  } else {
    const up = randInt(2, R) * (d === 1 ? 1 : 5);
    const down = randInt(2, R);
    qs.push(
      typed(
        `A hiker is ${up} m above sea level. A scuba diver is ${down} m below sea level. How far apart are they, measured straight up and down?`,
        fmt(up + down),
        `Write them as integers: ${up} and ${-down}. The difference is ${up} − ${br(-down)} = ${up} + ${down} = ${up + down} m.`,
        "integer",
        { suffix: "m" },
      ),
    );
  }

  // A diver moving up and down.
  {
    const name = pick(NAMES);
    const start = -randInt(d === 1 ? 6 : 10, d === 1 ? 15 : R);
    const up = randInt(2, -start - 1);
    const down = randInt(2, d === 1 ? 8 : 15);
    let end = start + up - down;
    let moves = `swims up ${up} m, then down ${down} m`;
    let calc = `${start} + ${up} − ${down}`;
    if (d === 3) {
      const up2 = randInt(1, -end - 1);
      moves = `swims up ${up} m, down ${down} m, then up ${up2} m`;
      calc += ` + ${up2}`;
      end += up2;
    }
    qs.push(
      typed(
        `${name} is scuba diving at ${start} m (below the surface). ${name} ${moves}. What integer gives ${name}'s new position?`,
        fmt(end),
        `Up is + and down is −: ${calc} = ${end}. Work left to right.`,
        "integer",
        { suffix: "m" },
      ),
    );
  }

  // Ordering.
  {
    const n = d === 1 ? 4 : 5;
    let nums: number[];
    do nums = sample(range(-R, R), n);
    while (nums.filter((x) => x < 0).length < 2);
    nums.sort((p, q) => p - q);
    const negs = nums.filter((x) => x < 0);
    qs.push({
      kind: "order",
      prompt: "Put these integers in order from least to greatest.",
      hint: `Picture a number line: the farther left, the less. Every negative is less than zero, and a negative farther from zero is less, so ${negs[0]} < ${negs[1]}. The least here is ${nums[0]}.`,
      items: nums.map((x) => ({ id: `n${x}`, label: String(x) })),
    });
  }

  return shuffle(qs);
}

// ---------- 2. Multiplying & Dividing Integers (with facts and BEDMAS) ----------

function factHint(a: number, b: number): string {
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  if (big === 10) return `Multiplying by 10 puts a zero on the end: ${small} × 10 = ${small * 10}.`;
  if (big > 5) {
    return `Split ${big} into 5 + ${big - 5}: ${small} × 5 = ${small * 5} and ${small} × ${big - 5} = ${small * (big - 5)}. Add them: ${small * big}.`;
  }
  return `Count ${small} groups of ${big}: ${Array.from({ length: small }, (_, i) => big * (i + 1)).join(", ")}.`;
}

const signWord = (x: number, y: number, what: string): string =>
  x < 0 === y < 0 ? `Same signs give a positive ${what}` : `Different signs give a negative ${what}`;

interface Expr {
  text: string;
  value: number;
  wrong: number[];
  hint: string;
}

/** An order-of-operations expression with whole-number steps. */
function bedmas(d: Level): Expr {
  if (d === 1) {
    const x = randInt(2, 20);
    const y = randInt(2, 9);
    const z = randInt(2, 9);
    if (chance(0.5)) {
      return {
        text: `${x} + ${y} × ${z}`,
        value: x + y * z,
        wrong: [(x + y) * z, x * y + z],
        hint: `Multiply before you add: ${y} × ${z} = ${y * z}. Then ${x} + ${y * z} = ${x + y * z}.`,
      };
    }
    return {
      text: `${x} − ${y} × ${z}`,
      value: x - y * z,
      wrong: [(x - y) * z, y * z - x],
      hint: `Multiply before you subtract: ${y} × ${z} = ${y * z}. Then ${x} − ${y * z} = ${x - y * z}.`,
    };
  }
  if (d === 2) {
    const form = randInt(0, 2);
    if (form === 0) {
      const x = signed(2, 15);
      const y = randInt(2, 9);
      const z = -randInt(2, 9);
      const v = x - y * z;
      return {
        text: `${x} − ${y} × ${br(z)}`,
        value: v,
        wrong: [(x - y) * z, x + y * z],
        hint: `Multiply first: ${y} × ${br(z)} = ${y * z}. Then ${x} − ${br(y * z)} = ${x} + ${-y * z} = ${v}.`,
      };
    }
    if (form === 1) {
      const x = signed(2, 12);
      const y = signed(2, 12);
      const z = signed(2, 6);
      const v = (x + y) * z;
      return {
        text: `(${x} + ${br(y)}) × ${br(z)}`,
        value: v,
        wrong: [x + y * z, -v],
        hint: `Brackets first: ${x} + ${br(y)} = ${x + y}. Then ${br(x + y)} × ${br(z)} = ${v}.`,
      };
    }
    const y = signed(2, 9);
    const q = signed(2, 9);
    const z = signed(2, 12);
    const x = y * q;
    const v = q - z;
    return {
      text: `${x} ÷ ${br(y)} − ${br(z)}`,
      value: v,
      wrong: [q + z, -v, x / (y - z)],
      hint: `Divide first: ${x} ÷ ${br(y)} = ${q}. Then ${q} − ${br(z)} = ${v}.`,
    };
  }
  if (chance(0.5)) {
    const w = randInt(2, 5);
    const m = signed(1, 4);
    const z = signed(1, 9);
    const x = signed(2, 6);
    const y = z + w * m;
    const v = x * m;
    return {
      text: `${x} × (${y} − ${br(z)}) ÷ ${w}`,
      value: v,
      wrong: [x * y - z, -v, x * (y - z)],
      hint: `Brackets first: ${y} − ${br(z)} = ${y - z}. Then work left to right: ${x} × ${br(y - z)} = ${x * (y - z)}, and ${br(x * (y - z))} ÷ ${w} = ${v}.`,
    };
  }
  const x = signed(2, 20);
  const y = signed(2, 6);
  const z = signed(2, 6);
  const u = randInt(2, 5);
  const k = signed(1, 6);
  const w = u * k;
  const v = x - y * z + k;
  return {
    text: `${x} − ${br(y)} × ${br(z)} + ${br(w)} ÷ ${u}`,
    value: v,
    wrong: [(x - y) * z + k, x - y * z - k, ((x - y) * z + w) / u],
    hint: `Do × and ÷ first: ${br(y)} × ${br(z)} = ${y * z} and ${br(w)} ÷ ${u} = ${k}. Then add and subtract from left to right: ${x} − ${br(y * z)} + ${br(k)} = ${v}.`,
  };
}

function integerMulDiv(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const lo = d === 1 ? 2 : d === 2 ? 3 : 4;
  const hi = d === 1 ? 9 : d === 2 ? 10 : 12;
  const qs: Question[] = [];

  // Fact fluency.
  {
    const a = randInt(lo, hi);
    const b = randInt(lo, hi);
    qs.push(typed(`What is ${a} × ${b}?`, fmt(a * b), factHint(a, b), "integer", { visual: { type: "equation", text: `${a} × ${b} = ?` } }));
  }

  // Division facts with signs.
  {
    const q = randInt(lo, hi);
    const v = randInt(lo, hi);
    let sq = 1;
    let sv = 1;
    if (d === 1) {
      if (chance(0.5)) sq = -1;
    } else {
      sq = pick([1, -1]);
      sv = sq === 1 ? -1 : pick([1, -1]);
    }
    const divisor = sv * v;
    const ans = sq * q;
    const dividend = ans * divisor;
    qs.push(
      numQ(
        `What is ${dividend} ÷ ${br(divisor)}?`,
        ans,
        [-ans, ans + 1, ans - 1],
        `Use the fact ${v} × ${q} = ${q * v}. ${signWord(dividend, divisor, "answer")}, so the answer is ${ans}.`,
        { type: "equation", text: `${dividend} ÷ ${br(divisor)} = ?` },
      ),
    );
  }

  // Products with negatives.
  {
    let a = d === 1 ? -randInt(lo, hi) : signed(lo, hi);
    let b = d === 1 ? randInt(lo, hi) : signed(lo, hi);
    if (a > 0 && b > 0) b = -b;
    if (chance(0.5)) [a, b] = [b, a];
    qs.push(
      typed(
        `What is ${a} × ${br(b)}?`,
        fmt(a * b),
        `${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(a * b)}. ${signWord(a, b, "product")}, so the answer is ${a * b}.`,
        "integer",
        { visual: { type: "equation", text: `${a} × ${br(b)} = ?` } },
      ),
    );
  }

  // Sign of a long product.
  {
    const k = d === 1 ? 3 : d === 2 ? 4 : 5;
    const factors = Array.from({ length: k }, () => signed(2, 9));
    if (d === 3 && chance(0.25)) factors[randInt(0, k - 1)] = 0;
    const negs = factors.filter((f) => f < 0).length;
    const hasZero = factors.includes(0);
    const right = hasZero ? "Zero" : negs % 2 === 0 ? "Positive" : "Negative";
    const options = d === 3 ? ["Positive", "Negative", "Zero"] : ["Positive", "Negative"];
    const hint = hasZero
      ? "One of the factors is 0, and anything times 0 is 0."
      : negs === 0
        ? "None of the factors is negative, so the product is positive."
        : `Count the negative factors: there ${negs === 1 ? "is 1" : `are ${negs}`}. An even number of negatives gives a positive product; an odd number gives a negative product.`;
    qs.push(
      textChoice(
        `Without multiplying it out, is this product ${d === 3 ? "positive, negative or zero" : "positive or negative"}?  ${factors.map(br).join(" × ")}`,
        right,
        options.filter((o) => o !== right),
        hint,
      ),
    );
  }

  // Missing factor.
  {
    const a = d === 1 ? randInt(lo, hi) : signed(lo, hi);
    const b = signed(lo, hi);
    const p = a * b;
    qs.push(
      typed("What number goes in the box?", fmt(b), `Divide: ${p} ÷ ${br(a)} = ${b}. Check: ${br(a)} × ${br(b)} = ${p}.`, "integer", {
        visual: { type: "equation", text: `${br(a)} × ☐ = ${p}` },
      }),
    );
  }

  // In context.
  {
    const ctx = randInt(0, 2);
    if (ctx === 0) {
      const r = randInt(2, d === 1 ? 5 : 9);
      const h = randInt(3, d === 1 ? 6 : 10);
      qs.push(
        typed(
          `The temperature dropped ${r}°C every hour for ${h} hours. What integer shows the total change in temperature?`,
          fmt(-r * h),
          `A drop is negative, so multiply: ${h} × ${br(-r)} = ${-r * h}.`,
          "integer",
          { suffix: "°C" },
        ),
      );
    } else if (ctx === 1) {
      const per = randInt(2, 9);
      const days = randInt(3, d === 1 ? 6 : 9);
      qs.push(
        typed(
          `A pond's water level dropped ${per * days} cm over ${days} days, by the same amount each day. What integer shows the change each day?`,
          fmt(-per),
          `The total change is ${-per * days} cm. Share it over ${days} days: ${-per * days} ÷ ${days} = ${-per}.`,
          "integer",
          { suffix: "cm" },
        ),
      );
    } else {
      const r = randInt(2, d === 1 ? 6 : 12);
      const t = randInt(3, 9);
      qs.push(
        typed(
          `A submarine dives ${r} m deeper every minute. What integer shows its change in depth after ${t} minutes?`,
          fmt(-r * t),
          `Going deeper is negative: ${t} × ${br(-r)} = ${-r * t}.`,
          "integer",
          { suffix: "m" },
        ),
      );
    }
  }

  // Order of operations (typed).
  {
    const e = bedmas(d);
    qs.push(typed(`Use the order of operations (BEDMAS) to evaluate:  ${e.text}`, fmt(e.value), e.hint, "integer", { visual: exprVisual(e.text) }));
  }

  // Order of operations (choice).
  {
    const e = bedmas(d);
    qs.push(numQ(`What is the value of  ${e.text}?`, e.value, e.wrong.filter(Number.isInteger), e.hint, exprVisual(e.text)));
  }

  return shuffle(qs);
}

// ---------- 3. Decimal Operations ----------

function decimalOps(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];

  // Addition (in hundredths).
  {
    let parts: number[];
    if (d === 1) parts = [notRound(11, 99) * 10, notRound(11, 99) * 10];
    else if (d === 2) parts = [notRound(101, 2999), notRound(11, 299) * 10];
    else parts = [notRound(101, 4999), notRound(11, 299) * 10, randInt(2, 30) * 100];
    const sum = parts.reduce((s, p) => s + p, 0);
    const shown = parts.map((p) => fmt(p / 100));
    const hint =
      d === 1
        ? `Line up the decimal points. Add the tenths, then the ones (regroup 10 tenths as 1 one): ${shown.join(" + ")} = ${fmt(sum / 100)}.`
        : `Line up the decimal points and give every number two decimal places: ${parts.map((p) => (p / 100).toFixed(2)).join(" + ")}. Add column by column: ${fmt(sum / 100)}.`;
    qs.push(
      typed(`What is ${shown.join(" + ")}?`, fmt(sum / 100), hint, "decimal", {
        visual: d < 3 ? { type: "equation", text: `${shown.join(" + ")} = ?` } : undefined,
      }),
    );
  }

  // Subtraction (in hundredths).
  {
    let a: number, b: number;
    if (d === 1) {
      const A = randInt(30, 150);
      a = A * 10;
      b = notRound(11, A - 5) * 10;
    } else if (d === 2) {
      a = notRound(50, 300) * 10;
      b = notRound(101, a - 50);
    } else {
      a = randInt(5, 50) * 100;
      b = notRound(101, a - 1);
    }
    qs.push(
      typed(
        `What is ${fmt(a / 100)} − ${fmt(b / 100)}?`,
        fmt((a - b) / 100),
        `Line up the decimal points and fill in zeros so both numbers have the same places: ${(a / 100).toFixed(2)} − ${(b / 100).toFixed(2)}. Subtract, regrouping where you need to: ${fmt((a - b) / 100)}.`,
        "decimal",
        { visual: { type: "equation", text: `${fmt(a / 100)} − ${fmt(b / 100)} = ?` } },
      ),
    );
  }

  // Multiplication.
  {
    let A: number, B: number, dpA: number, dpB: number;
    if (d === 1) {
      A = notRound(11, 99);
      dpA = 1;
      B = randInt(3, 9);
      dpB = 0;
    } else if (d === 2) {
      A = notRound(11, 99);
      dpA = 1;
      B = randInt(2, 9);
      dpB = 1;
    } else {
      A = notRound(101, 999);
      dpA = 2;
      B = notRound(11, 29);
      dpB = 1;
    }
    const dp = dpA + dpB;
    const prod = (A * B) / 10 ** dp;
    const a = A / 10 ** dpA;
    const b = B / 10 ** dpB;
    const placed = prod.toFixed(dp);
    qs.push(
      numQ(
        `What is ${fmt(a)} × ${fmt(b)}?`,
        prod,
        [prod * 10, prod / 10, d === 1 ? prod * 100 : prod / 100],
        `Multiply as if there were no decimal points: ${A} × ${B} = ${A * B}. The factors have ${plural(dp, "decimal place")} in total, so the product does too: ${placed}${placed === fmt(prod) ? "" : ` = ${fmt(prod)}`}.`,
        { type: "equation", text: `${fmt(a)} × ${fmt(b)} = ?` },
      ),
    );
  }

  // Division.
  {
    let dividend: number, divisor: number, quotient: number, shift: number;
    if (d === 1) {
      const Q = notRound(11, 99);
      const w = randInt(2, 9);
      quotient = Q / 10;
      divisor = w;
      dividend = (Q * w) / 10;
      shift = 0;
    } else if (d === 2) {
      const q = randInt(2, 12);
      const D = randInt(2, 9);
      quotient = q;
      divisor = D / 10;
      dividend = (q * D) / 10;
      shift = 1;
    } else if (chance(0.5)) {
      const Q = notRound(11, 99);
      const D = randInt(2, 9);
      quotient = Q / 10;
      divisor = D / 10;
      dividend = (Q * D) / 100;
      shift = 1;
    } else {
      const q = randInt(2, 12);
      const D = pick([12, 15, 16, 24, 25, 35, 45]);
      quotient = q;
      divisor = D / 100;
      dividend = (q * D) / 100;
      shift = 2;
    }
    const f = 10 ** shift;
    const hint =
      shift === 0
        ? `Divide as you would with whole numbers and keep the decimal point lined up: ${fmt(dividend)} ÷ ${divisor} = ${fmt(quotient)}. Check: ${divisor} × ${fmt(quotient)} = ${fmt(dividend)}.`
        : `Multiply both numbers by ${f} so you divide by a whole number: ${fmt(dividend * f)} ÷ ${fmt(divisor * f)} = ${fmt(quotient)}.`;
    qs.push(
      typed(`What is ${fmt(dividend)} ÷ ${fmt(divisor)}?`, fmt(quotient), hint, "decimal", {
        visual: { type: "equation", text: `${fmt(dividend)} ÷ ${fmt(divisor)} = ?` },
      }),
    );
  }

  // Estimation.
  {
    const W = d === 1 ? randInt(3, 9) : d === 2 ? randInt(2, 9) * 10 : randInt(2, 9) * 100;
    const V = randInt(2, 9);
    const wiggle = d === 3 ? randInt(5, 30) : randInt(1, 4);
    const a = (W * 10 + (chance(0.5) ? wiggle : -wiggle)) / 10;
    const b = (V * 10 + (chance(0.5) ? 1 : -1) * randInt(1, 2)) / 10;
    const E = W * V;
    qs.push(
      numQ(
        `Which is the best estimate for ${fmt(a)} × ${fmt(b)}?`,
        E,
        [E * 10, E / 10, W + V],
        `Round each number to a friendly one: ${fmt(a)} ≈ ${W} and ${fmt(b)} ≈ ${V}. Then ${W} × ${V} = ${E}.`,
      ),
    );
  }

  // Money.
  if (d === 1) {
    const item = pick(["pens", "notebooks", "juice boxes", "erasers", "granola bars"]);
    const p = randInt(5, 40) * 5;
    const n = randInt(3, 9);
    qs.push(
      typed(
        `${cap(item)} cost ${money(p)} each. How much do ${n} ${item} cost, in dollars?`,
        dollars(p * n),
        `Multiply: ${n} × ${money(p)}. Think in cents: ${n} × ${p}¢ = ${p * n}¢, which is ${money(p * n)}.`,
        "decimal",
      ),
    );
  } else if (d === 2) {
    const u = randInt(15, 60) * 10;
    const M = notRound(11, 49);
    const total = (u * M) / 10;
    qs.push(
      typed(
        `Apples cost ${money(u)} per kilogram. How much do ${fmt(M / 10)} kg of apples cost, in dollars?`,
        dollars(total),
        `Multiply the price by the mass: ${fmt(u / 100)} × ${fmt(M / 10)}. Without decimals that's ${u / 10} × ${M} = ${(u / 10) * M}; there are 2 decimal places in total, so the cost is ${money(total)}.`,
        "decimal",
      ),
    );
  } else {
    const u = randInt(15, 80) * 10;
    const M = notRound(11, 49);
    const total = (u * M) / 10;
    qs.push(
      typed(
        `A ${fmt(M / 10)} kg bag of rice costs ${money(total)}. What is the price per kilogram, in dollars?`,
        dollars(u),
        `Divide the cost by the mass: ${(total / 100).toFixed(2)} ÷ ${fmt(M / 10)}. Multiply both by 10 first: ${fmt(total / 10)} ÷ ${M} = ${(u / 100).toFixed(2)}.`,
        "decimal",
      ),
    );
  }

  // Order of operations with decimals (in tenths).
  {
    const nice = (x: number) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
    const form = d === 1 ? 0 : d === 2 ? randInt(0, 1) : randInt(1, 2);
    let text: string, v: number, wrong: number[], hint: string;
    if (form === 0) {
      const a = notRound(11, 99);
      const b = notRound(11, 49);
      const c = randInt(2, 9);
      v = (a + b * c) / 10;
      text = `${fmt(a / 10)} + ${fmt(b / 10)} × ${c}`;
      wrong = [((a + b) * c) / 10, (a * c + b) / 10];
      hint = `Multiply before adding: ${fmt(b / 10)} × ${c} = ${fmt((b * c) / 10)}. Then ${fmt(a / 10)} + ${fmt((b * c) / 10)} = ${fmt(v)}.`;
    } else if (form === 1) {
      let a: number, b: number, c: number;
      do {
        a = notRound(11, 99);
        b = randInt(2, 9);
        c = notRound(11, 99);
      } while (a * b <= c + 10);
      v = (a * b - c) / 10;
      text = `${fmt(a / 10)} × ${b} − ${fmt(c / 10)}`;
      wrong = [(a * (b * 10 - c)) / 100, (a * b + c) / 10];
      hint = `Multiply before subtracting: ${fmt(a / 10)} × ${b} = ${fmt((a * b) / 10)}. Then ${fmt((a * b) / 10)} − ${fmt(c / 10)} = ${fmt(v)}.`;
    } else {
      const c = randInt(2, 5);
      const r = notRound(11, 49);
      const b = notRound(5, 30);
      const a = r * c + b;
      v = r / 10;
      text = `(${fmt(a / 10)} − ${fmt(b / 10)}) ÷ ${c}`;
      wrong = [a / 10 - b / 10 / c, (a - b) / 10, r / 100];
      hint = `Brackets first: ${fmt(a / 10)} − ${fmt(b / 10)} = ${fmt((a - b) / 10)}. Then ${fmt((a - b) / 10)} ÷ ${c} = ${fmt(v)}.`;
    }
    qs.push(numQ(`Use the order of operations: what is ${text}?`, v, wrong.filter(nice), hint, exprVisual(text), { min: 0, step: 0.1 }));
  }

  // Ordering decimals (in thousandths).
  {
    const a = randInt(1, 8);
    let b: number;
    do b = randInt(1, 9);
    while (b === a);
    const c = randInt(1, 9);
    const pool = [...new Set([a * 100, a * 100 + b * 10, a * 10, b * 100 + a * 10, a * 100 + b, a * 100 + b * 10 + c, b * 10 + a])];
    const vals = (d === 1 ? pool.filter((v) => v % 10 === 0) : sample(pool, 5)).sort((p, q) => p - q);
    qs.push({
      kind: "order",
      prompt: "Put these decimals in order from least to greatest.",
      hint: `Compare tenths first, then hundredths, then thousandths. Writing them with the same number of places helps: ${vals
        .map((v) => (v / 1000).toFixed(3))
        .join(", ")}.`,
      items: vals.map((v) => ({ id: `d${v}`, label: fmt(v / 1000) })),
    });
  }

  return shuffle(qs);
}

// ---------- 4. Fractions, Decimals, Percents & Ratios ----------

const REPEATING: { n: number; d: number; label: string; short: string; digits: string }[] = [
  { n: 1, d: 3, label: "0.333…", short: "0.3", digits: "3" },
  { n: 2, d: 3, label: "0.666…", short: "0.6", digits: "6" },
  { n: 1, d: 9, label: "0.111…", short: "0.1", digits: "1" },
  { n: 2, d: 9, label: "0.222…", short: "0.2", digits: "2" },
  { n: 4, d: 9, label: "0.444…", short: "0.4", digits: "4" },
  { n: 5, d: 9, label: "0.555…", short: "0.5", digits: "5" },
  { n: 7, d: 9, label: "0.777…", short: "0.7", digits: "7" },
  { n: 8, d: 9, label: "0.888…", short: "0.8", digits: "8" },
  { n: 1, d: 6, label: "0.1666…", short: "0.16", digits: "6" },
  { n: 5, d: 6, label: "0.8333…", short: "0.83", digits: "3" },
  { n: 1, d: 11, label: "0.0909…", short: "0.09", digits: "09" },
  { n: 2, d: 11, label: "0.1818…", short: "0.18", digits: "18" },
  { n: 3, d: 11, label: "0.2727…", short: "0.27", digits: "27" },
  { n: 5, d: 11, label: "0.4545…", short: "0.45", digits: "45" },
];

const BENCHMARKS: [number, number][] = [
  [1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10],
  [7, 20], [9, 20], [11, 20], [13, 20], [17, 20], [1, 8], [3, 8], [5, 8], [7, 8],
];

/** Write n/d as a fraction over a power of ten, for hints. */
function overPowerOfTen(n: number, den: number): string {
  for (const p of [10, 100, 1000, 10000]) {
    if (p % den === 0) return `${n}/${den} = ${(n * p) / den}/${p} = ${fmt(n / den)}`;
  }
  return `${n} ÷ ${den} = ${fmt(n / den)}`;
}

function fractionsDecimalsPercents(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];

  // Fraction → decimal.
  {
    const dens = d === 1 ? [2, 4, 5, 10] : d === 2 ? [4, 5, 8, 20, 25] : [8, 16, 20, 25, 40];
    const den = pick(dens);
    let n: number;
    do n = randInt(1, d === 3 ? 2 * den - 1 : den - 1);
    while (gcd(n, den) !== 1);
    qs.push(
      typed(`Write ${n}/${den} as a decimal.`, fmt(n / den), `Make the denominator a power of ten (10, 100, 1000…): ${overPowerOfTen(n, den)}. (Or divide ${n} ÷ ${den}.)`, "decimal", {
        visual: den <= 24 ? { type: "fraction", numerator: n, denominator: den, shape: "bar" } : undefined,
      }),
    );
  }

  // Percent → decimal, or repeating decimals.
  if (d === 1) {
    const p = randInt(2, 99);
    qs.push(
      numQ(
        `Write ${p}% as a decimal.`,
        p / 100,
        [p / 10, p / 1000, p],
        `Percent means "out of 100": ${p}% = ${p}/100 = ${fmt(p / 100)}. Move the decimal point two places to the left.`,
        { type: "letter", text: `${p}%` },
      ),
    );
  } else {
    const pool = REPEATING.filter((r) => (d === 2 ? r.d === 3 || r.d === 9 : true));
    const r = pick(pool);
    const others = sample(
      REPEATING.filter((o) => o !== r && o.label !== r.label),
      2,
    ).map((o) => o.label);
    qs.push(
      textChoice(
        `Which decimal is equal to ${r.n}/${r.d}? (… means the digits keep repeating.)`,
        r.label,
        [r.short, ...others],
        `Divide ${r.n} ÷ ${r.d}. The division never ends: the digit${r.digits.length > 1 ? "s" : ""} ${r.digits} repeat${r.digits.length > 1 ? "" : "s"} forever, so ${r.n}/${r.d} = ${r.label}. ${r.short} stops too soon.`,
        r.d <= 12 ? { type: "fraction", numerator: r.n, denominator: r.d, shape: "circle" } : undefined,
      ),
    );
  }

  // Percent → fraction.
  {
    const pool =
      d === 1
        ? [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]
        : d === 2
          ? range(1, 19).map((k) => k * 5)
          : [2, 4, 6, 8, 12, 15, 35, 45, 120, 125, 150, 175, 12.5, 37.5, 62.5, 87.5];
    const p = pick(pool);
    const whole = Number.isInteger(p);
    const top = whole ? p : p * 10;
    const bottom = whole ? 100 : 1000;
    const g = gcd(top, bottom);
    const ans = fraction(top, bottom);
    qs.push(
      typed(
        `Write ${p}% as a fraction. (Simplify it if you can.)`,
        ans,
        whole
          ? `${p}% means ${p} out of 100, so it's ${p}/100. Divide the top and bottom by ${g}: ${ans}.`
          : `${p}% = ${p}/100 = ${top}/1000. Divide the top and bottom by ${g}: ${ans}.`,
        "fraction",
        { accept: [`${top}/${bottom}`], visual: { type: "letter", text: `${p}%` } },
      ),
    );
  }

  // Percent of a number.
  {
    let p: number, N: number;
    if (d === 1) {
      p = pick([10, 20, 25, 50]);
      N = 20 * randInt(1, 20);
    } else if (d === 2) {
      p = pick([5, 15, 30, 35, 40, 60, 75]);
      N = 20 * randInt(2, 25);
    } else {
      p = pick([12.5, 6, 2.5, 150, 120, 8, 0.5]);
      N = 40 * randInt(1, 25);
    }
    const ans = (N * p * 10) / 1000;
    const tenth = N / 10;
    const extra =
      p === 10
        ? ""
        : p === 20
          ? ` 20% is double that: ${fmt(ans)}.`
          : p === 25
            ? ` 25% is one quarter: ${N} ÷ 4 = ${fmt(ans)}.`
            : p === 50
              ? ` 50% is half: ${N} ÷ 2 = ${fmt(ans)}.`
              : "";
    qs.push(
      typed(
        `What is ${p}% of ${N}?`,
        fmt(ans),
        d === 1
          ? `10% of ${N} is ${fmt(tenth)}.${extra || ` So ${p}% of ${N} is ${fmt(ans)}.`}`
          : `Change the percent to a decimal and multiply: ${p}% = ${fmt(p / 100)}, and ${fmt(p / 100)} × ${N} = ${fmt(ans)}.`,
        "decimal",
      ),
    );
  }

  // Ratios in simplest form.
  {
    const pairs = [
      [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [1, 5], [5, 6], [1, 6],
    ];
    let [a, b] = pick(pairs);
    if (chance(0.5)) [a, b] = [b, a];
    const k = randInt(2, d === 1 ? 4 : 9);
    const ctx = pick([
      { setup: `A class has ${k * a} girls and ${k * b} boys.`, A: "girls", B: "boys" },
      { setup: `An animal shelter has ${k * a} cats and ${k * b} dogs.`, A: "cats", B: "dogs" },
      { setup: `A bag holds ${k * a} red marbles and ${k * b} blue marbles.`, A: "red marbles", B: "blue marbles" },
      { setup: `A team won ${k * a} games and lost ${k * b} games.`, A: "wins", B: "losses" },
    ]);
    qs.push(
      textChoice(
        `${ctx.setup} What is the ratio of ${ctx.A} to ${ctx.B} in simplest form?`,
        `${a}:${b}`,
        [`${b}:${a}`, `${a}:${a + b}`, `${b}:${a + b}`],
        `Write the ratio in order, ${ctx.A} first: ${k * a}:${k * b}. Divide both terms by ${k}, their greatest common factor: ${a}:${b}.`,
      ),
    );
  }

  // Ratio → percent, or an equivalent-ratio table.
  if (chance(0.5)) {
    if (d < 3) {
      const n = pick(d === 1 ? [4, 5, 10, 20, 25, 50] : [8, 16, 20, 25, 40]);
      const w = randInt(1, n - 1);
      const pct = (w * 100) / n;
      qs.push(
        typed(
          `A team won ${w} of its ${n} games. What percent of its games did it win?`,
          fmt(pct),
          `Write it as a fraction and change it to hundredths: ${w}/${n} = ${fmt(w / n)} = ${fmt(pct)}%.`,
          "decimal",
          { suffix: "%" },
        ),
      );
    } else {
      const s = pick([4, 5, 8, 10]);
      const r = randInt(1, s - 1);
      const pct = (r * 100) / s;
      qs.push(
        typed(
          `The ratio of red to blue marbles in a bag is ${r}:${s - r}. What percent of the marbles are red?`,
          fmt(pct),
          `For every ${r} red there are ${s - r} blue, so ${r} out of every ${s} marbles are red. ${r}/${s} = ${fmt(r / s)} = ${fmt(pct)}%.`,
          "decimal",
          { suffix: "%" },
        ),
      );
    }
  } else {
    const a = randInt(2, 5);
    let b: number;
    do b = randInt(2, 5);
    while (b === a);
    const k = randInt(3, d === 1 ? 5 : 9);
    qs.push(
      typed(
        `A pancake recipe uses ${a} cups of flour for every ${b} cups of milk. How many cups of flour go with ${b * k} cups of milk?`,
        fmt(a * k),
        `The milk went from ${b} to ${b * k} cups, which is × ${k}. Multiply the flour by ${k} too: ${a} × ${k} = ${a * k} cups.`,
        "decimal",
        {
          suffix: "cups",
          visual: { type: "table", title: "Pancake recipe", headers: ["Flour (cups)", "Milk (cups)"], rows: [[a, b], [a * 2, b * 2], ["?", b * k]] },
        },
      ),
    );
  }

  // Comparing forms.
  {
    const allowed = d === 1 ? [2, 4, 5, 10] : d === 2 ? [2, 4, 5, 10, 20] : [2, 4, 5, 8, 10, 20];
    const picks = sample(
      BENCHMARKS.filter(([, den]) => allowed.includes(den)),
      4,
    );
    const forms = shuffle(["fraction", "decimal", "percent", pick(["fraction", "decimal", "percent"])]);
    const items = picks.map(([n, den], i) => {
      const pct = (n * 100) / den;
      const form = forms[i];
      const label = form === "fraction" ? `${n}/${den}` : form === "decimal" ? fmt(n / den) : `${fmt(pct)}%`;
      return { label, pct, form };
    });
    const greatest = chance(0.5);
    const sorted = [...items].sort((p, q) => p.pct - q.pct);
    const target = greatest ? sorted[sorted.length - 1] : sorted[0];
    const conversions = items
      .filter((i) => i.form !== "percent")
      .map((i) => `${i.label} = ${fmt(i.pct)}%`)
      .join(", ");
    qs.push(
      textChoice(
        `Which is the ${greatest ? "greatest" : "least"}?`,
        target.label,
        items.filter((i) => i !== target).map((i) => i.label),
        `Change them all to the same form, like percents: ${conversions}. The ${greatest ? "greatest" : "least"} is ${target.label}.`,
      ),
    );
  }

  // Shaded bar → percent.
  {
    const den = pick(d === 1 ? [2, 4, 5, 10] : d === 2 ? [4, 5, 10, 20] : [8, 16, 20]);
    const n = randInt(1, den - 1);
    const pct = (n * 100) / den;
    qs.push(
      typed(
        "What percent of the bar is shaded?",
        fmt(pct),
        `${n} of the ${den} equal parts are shaded: ${n}/${den}. ${overPowerOfTen(n, den)} = ${fmt(pct)}%.`,
        "decimal",
        { suffix: "%", visual: { type: "fraction", numerator: n, denominator: den, shape: "bar" } },
      ),
    );
  }

  return shuffle(qs);
}

// ---------- 5. Tax, Tips & Discounts ----------

const ITEMS = ["jacket", "pair of shoes", "backpack", "skateboard", "board game", "pair of headphones", "hoodie", "tent", "bike helmet"];

/** A price in cents where `rate`% of it is a whole number of cents. */
function exactCents(rate: number, min: number, max: number): number {
  const exact = 100 / gcd(rate, 100);
  const step = (exact * 5) / gcd(exact, 5); // also a multiple of 5¢, so prices look natural
  return step * randInt(Math.ceil(min / step), Math.floor(max / step));
}

function taxText(rate: number): string {
  if (rate === 12) return "12% (5% GST plus 7% PST)";
  if (rate === 5) return "5% GST";
  return `${rate}% HST`;
}

function financialPercent(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];

  // Sale price after a discount.
  {
    const item = pick(ITEMS);
    let P: number, pct: number;
    if (d === 1) {
      pct = pick([10, 25, 50]);
      P = 1000 * randInt(2, 20);
    } else if (d === 2) {
      pct = pick([15, 20, 30, 35, 40]);
      P = 100 * randInt(15, 150);
    } else {
      pct = pick([15, 25, 35, 45]);
      P = exactCents(pct, 2000, 20000);
    }
    const disc = (P * pct) / 100;
    const sale = P - disc;
    qs.push(
      typed(
        `A ${item} regularly costs ${money(P)}. It's on sale for ${pct}% off. What is the sale price, in dollars?`,
        dollars(sale),
        `Discount: ${pct}% of ${money(P)} = ${money(disc)}. Sale price: ${money(P)} − ${money(disc)} = ${money(sale)}. (Or pay ${100 - pct}%: ${fmt((100 - pct) / 100)} × ${money(P)}.)`,
        "decimal",
        { visual: { type: "emoji", emoji: "🏷️", caption: `${pct}% off` } },
      ),
    );
  }

  // Sales tax.
  {
    const item = pick(ITEMS);
    let rate: number, P: number;
    if (d === 1) {
      rate = 5;
      P = 100 * randInt(10, 100);
    } else if (d === 2) {
      rate = pick([12, 13, 15]);
      P = 100 * randInt(10, 200);
    } else {
      rate = pick([5, 12, 13]);
      P = exactCents(rate, 1000, 15000);
    }
    const tax = (P * rate) / 100;
    qs.push(
      typed(
        `A ${item} costs ${money(P)}. Sales tax is ${taxText(rate)}. What is the total cost, in dollars?`,
        dollars(P + tax),
        `Tax: ${rate}% of ${money(P)} = ${fmt(rate / 100)} × ${(P / 100).toFixed(2)} = ${money(tax)}. Total: ${money(P)} + ${money(tax)} = ${money(P + tax)}. (Or multiply by ${fmt(1 + rate / 100)}.)`,
        "decimal",
      ),
    );
  }

  // Tips.
  {
    const name = pick(NAMES);
    if (d < 3) {
      const pct = d === 1 ? pick([10, 20]) : pick([15, 18, 20]);
      const M = 100 * randInt(d === 1 ? 12 : 20, d === 1 ? 90 : 120);
      const tip = (M * pct) / 100;
      const hint =
        pct === 10
          ? `10% of ${money(M)}: move the decimal point one place left to get ${money(tip)}.`
          : pct === 20
            ? `10% of ${money(M)} is ${money(M / 10)}. 20% is double that: ${money(tip)}.`
            : pct === 15
              ? `10% of ${money(M)} is ${money(M / 10)}, and 5% is half of that, ${money(M / 20)}. Together: ${money(tip)}.`
              : `${pct}% = ${fmt(pct / 100)}, and ${fmt(pct / 100)} × ${(M / 100).toFixed(2)} = ${money(tip)}.`;
      qs.push(
        typed(`${name}'s family has a restaurant bill of ${money(M)} and leaves a ${pct}% tip. How much is the tip, in dollars?`, dollars(tip), hint, "decimal"),
      );
    } else {
      const pct = pick([15, 18, 20]);
      const M = exactCents(pct, 2000, 12000);
      const tip = (M * pct) / 100;
      qs.push(
        typed(
          `${name}'s family has a restaurant bill of ${money(M)} and adds a ${pct}% tip. What is the total, including the tip?`,
          dollars(M + tip),
          `Tip: ${fmt(pct / 100)} × ${(M / 100).toFixed(2)} = ${money(tip)}. Total: ${money(M)} + ${money(tip)} = ${money(M + tip)}.`,
          "decimal",
        ),
      );
    }
  }

  // Simple interest.
  {
    const name = pick(NAMES);
    let P: number, r: number, t: number;
    if (d === 1) {
      P = 100 * randInt(1, 10);
      r = randInt(2, 5);
      t = randInt(1, 3);
    } else if (d === 2) {
      P = 50 * randInt(4, 40);
      r = randInt(2, 6);
      t = randInt(2, 5);
    } else {
      P = 25 * randInt(8, 80);
      r = randInt(2, 8);
      t = randInt(2, 6);
    }
    const I = P * r * t; // cents: P dollars × r/100 × t = P·r·t cents
    const base = `I = P × r × t = ${money(P * 100)} × ${fmt(r / 100)} × ${t} = ${money(I)}.`;
    if (d < 3) {
      qs.push(
        typed(
          `${name} puts ${money(P * 100)} in a savings account that pays ${r}% simple interest per year. How much interest will it earn in ${plural(t, "year")}?`,
          dollars(I),
          `Simple interest: ${base}`,
          "decimal",
        ),
      );
    } else {
      qs.push(
        typed(
          `${name} puts ${money(P * 100)} in a savings account that pays ${r}% simple interest per year. How much will be in the account after ${plural(t, "year")}?`,
          dollars(P * 100 + I),
          `First the interest: ${base} Then add it to the deposit: ${money(P * 100)} + ${money(I)} = ${money(P * 100 + I)}.`,
          "decimal",
        ),
      );
    }
  }

  // Better deal.
  {
    const pcts = d === 1 ? [10, 20, 25, 50] : [10, 15, 20, 25, 30, 40];
    const gap = d === 3 ? 50 : 100;
    let PA: number, PB: number, pa: number, pb: number, sa: number, sb: number;
    do {
      PA = 10 * randInt(3, 12);
      PB = d === 1 ? 10 * randInt(3, 12) : PA + 10 * randInt(-3, 3);
      pa = pick(pcts);
      pb = pick(pcts);
      sa = PA * (100 - pa);
      sb = PB * (100 - pb);
    } while (Math.abs(sa - sb) < gap || PA === PB || pa === pb);
    const cheaper = sa < sb ? "Store A" : "Store B";
    qs.push(
      textChoice(
        "Two stores sell the same scooter. Which store has the lower sale price?",
        cheaper,
        [cheaper === "Store A" ? "Store B" : "Store A", "They cost the same"],
        `Store A: pay ${100 - pa}% of ${money(PA * 100)} = ${money(sa)}. Store B: pay ${100 - pb}% of ${money(PB * 100)} = ${money(sb)}. ${cheaper} is cheaper.`,
        {
          type: "table",
          headers: ["Store", "Regular price", "Sale"],
          rows: [
            ["A", money(PA * 100), `${pa}% off`],
            ["B", money(PB * 100), `${pb}% off`],
          ],
        },
      ),
    );
  }

  // Mental maths with 10%.
  {
    const p = pick(d === 1 ? [5, 20, 30] : [5, 15, 20, 30]);
    let P: number;
    do P = 10 * randInt(2, 20);
    while (P === 100);
    const right = P * p; // cents
    const how =
      p === 5
        ? `5% is half of that: ${money(right)}.`
        : p === 15
          ? `5% is half of 10%, ${money(P * 5)}. 10% + 5% = ${money(right)}.`
          : `${p}% is ${p / 10} × 10%: ${money(right)}.`;
    qs.push(
      numQ(
        `What is ${p}% of ${money(P * 100)}?`,
        right,
        [P * 10, P * 100 - right, p * 100, (P * p) / 10],
        `Start with 10%: move the decimal point one place left to get ${money(P * 10)}. ${how}`,
        undefined,
        { format: money, step: 100, min: 5 },
      ),
    );
  }

  // Percent discount.
  {
    const item = pick(ITEMS);
    let pct: number, P: number;
    if (d === 1) {
      pct = pick([10, 20, 25, 50]);
      P = 2000 * randInt(1, 10);
    } else if (d === 2) {
      pct = pick([5, 15, 30, 35, 40, 60]);
      P = 100 * randInt(10, 150);
    } else {
      pct = pick([15, 35, 45, 12, 8]);
      P = exactCents(pct, 2000, 15000);
    }
    const sale = (P * (100 - pct)) / 100;
    const disc = P - sale;
    qs.push(
      typed(
        `A ${item} regularly costs ${money(P)}. It's on sale for ${money(sale)}. What percent is the discount?`,
        fmt(pct),
        `The discount is ${money(P)} − ${money(sale)} = ${money(disc)}. Divide by the regular price: ${(disc / 100).toFixed(2)} ÷ ${(P / 100).toFixed(2)} = ${fmt(pct / 100)} = ${pct}%.`,
        "decimal",
        { suffix: "%" },
      ),
    );
  }

  // Two steps.
  if (d === 1) {
    const M = 100 * randInt(20, 80);
    const t = pick([10, 15, 20]);
    const tip = (M * t) / 100;
    qs.push(
      numQ(
        `Lunch for a group costs ${money(M)}, and they add a ${t}% tip. What is the total, including the tip?`,
        M + tip,
        [tip, M + t * 100, M - tip],
        `Tip: ${t}% of ${money(M)} = ${money(tip)}. Total: ${money(M)} + ${money(tip)} = ${money(M + tip)}.`,
        undefined,
        { format: money, step: 100, min: 5 },
      ),
    );
  } else if (d === 2) {
    const item = pick(ITEMS);
    let P: number, dp: number, sale: number;
    do {
      P = 100 * randInt(20, 120);
      dp = pick([10, 20, 25, 50]);
      sale = (P * (100 - dp)) / 100;
    } while (sale % 20 !== 0);
    const total = sale + sale / 20;
    qs.push(
      numQ(
        `A ${item} costs ${money(P)}. It's ${dp}% off, and then 5% GST is added to the sale price. What is the final price?`,
        total,
        [sale, sale + P / 20, (P * (105 - dp)) / 100],
        `Sale price: ${money(P)} − ${dp}% = ${money(sale)}. Tax: 5% of ${money(sale)} = ${money(sale / 20)}. Final price: ${money(total)}.`,
        undefined,
        { format: money, step: 100, min: 5 },
      ),
    );
  } else {
    const item = pick(ITEMS);
    const P = 100 * randInt(20, 150);
    const d1 = pick([20, 25, 30, 40]);
    const d2 = pick([10, 20]);
    const final = (P * (100 - d1) * (100 - d2)) / 10000;
    qs.push(
      numQ(
        `A ${item} costs ${money(P)}. It's ${d1}% off, and then there's an extra ${d2}% off the sale price. What is the final price?`,
        final,
        [(P * (100 - d1 - d2)) / 100, (P * (100 - d1)) / 100, (P * (100 - d2)) / 100],
        `Take the discounts one at a time. After ${d1}% off: ${money((P * (100 - d1)) / 100)}. Then ${d2}% off that: ${fmt((100 - d2) / 100)} × ${money((P * (100 - d1)) / 100)} = ${money(final)}. That's less of a discount than ${d1 + d2}% off the original.`,
        undefined,
        { format: money, step: 100, min: 5 },
      ),
    );
  }

  return shuffle(qs);
}

// ---------- 6. Coordinates & Transformations ----------

type Pt = [number, number];
interface Move {
  label: string;
  f: (p: Pt) => Pt;
}

const REFLECT_X: Move = { label: "Reflection in the x-axis", f: ([x, y]) => [x, -y] };
const REFLECT_Y: Move = { label: "Reflection in the y-axis", f: ([x, y]) => [-x, y] };
const ROTATE_180: Move = { label: "Rotation of 180° about the origin", f: ([x, y]) => [-x, -y] };

function moveText(dx: number, dy: number): string {
  const parts: string[] = [];
  if (dx) parts.push(`${plural(Math.abs(dx), "unit")} ${dx > 0 ? "right" : "left"}`);
  if (dy) parts.push(`${plural(Math.abs(dy), "unit")} ${dy > 0 ? "up" : "down"}`);
  return parts.join(" and ");
}

const translation = (dx: number, dy: number): Move => ({ label: `Translation ${moveText(dx, dy)}`, f: ([x, y]) => [x + dx, y + dy] });

/** A point off both axes, with |x| ≠ |y| so its reflections all look different. */
function randPt(max: number): Pt {
  let x: number, y: number;
  do {
    x = signed(1, max);
    y = signed(1, max);
  } while (Math.abs(x) === Math.abs(y));
  return [x, y];
}

const fourQuadrants = (points: { x: number; y: number; label?: string }[]): Visual => ({ type: "grid", size: 6, min: -6, points });
const ptText = (p: Pt): string => xy(p[0], p[1]);
const samePt = (a: Pt, b: Pt): boolean => a[0] === b[0] && a[1] === b[1];

/** Multiple choice with coordinate-pair answers. */
function pointQ(prompt: string, right: Pt, wrong: Pt[], hint: string, visual?: Visual): ChoiceQuestion {
  const used = new Set([ptText(right)]);
  const out: string[] = [];
  const near: Pt[] = [
    [right[0] + 1, right[1]],
    [right[0], right[1] + 1],
    [right[0] - 1, right[1]],
    [right[0], right[1] - 1],
  ];
  for (const p of [...wrong, ...near]) {
    if (out.length >= 3) break;
    const k = ptText(p);
    if (!used.has(k)) {
      used.add(k);
      out.push(k);
    }
  }
  return textChoice(prompt, ptText(right), out, hint, visual);
}

function moveHint(m: Move, p: Pt): string {
  const rule =
    m === REFLECT_X
      ? "Reflecting in the x-axis keeps x the same and changes the sign of y"
      : m === REFLECT_Y
        ? "Reflecting in the y-axis keeps y the same and changes the sign of x"
        : "A 180° rotation about the origin changes the sign of both coordinates";
  return `${rule}: ${ptText(p)} → ${ptText(m.f(p))}.`;
}

function quadrantOf(x: number, y: number): string {
  if (x === 0 || y === 0) return "On an axis";
  if (x > 0) return y > 0 ? "Quadrant I" : "Quadrant IV";
  return y > 0 ? "Quadrant II" : "Quadrant III";
}

function coordinatesTransformations(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];

  // Reading a point.
  {
    const [x, y] = randPt(5);
    qs.push(
      pointQ(
        "What are the coordinates of point A?",
        [x, y],
        [
          [y, x],
          [-x, y],
          [x, -y],
        ],
        `Start at the origin (0, 0). Move ${Math.abs(x)} ${x > 0 ? "right" : "left"} along the x-axis, so x = ${x}. Then move ${Math.abs(y)} ${y > 0 ? "up" : "down"}, so y = ${y}. Write x first: ${xy(x, y)}.`,
        fourQuadrants([{ x, y, label: "A" }]),
      ),
    );
  }

  // Quadrants.
  {
    const max = d === 1 ? 9 : d === 2 ? 15 : 25;
    let x = signed(1, max);
    let y = signed(1, max);
    if (d === 3 && chance(0.2)) {
      if (chance(0.5)) x = 0;
      else y = 0;
    }
    const right = quadrantOf(x, y);
    const options = ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV", ...(d === 3 ? ["On an axis"] : [])];
    qs.push(
      textChoice(
        `Where is the point ${xy(x, y)}?`,
        right,
        options.filter((o) => o !== right),
        "Quadrant I is (+, +), II is (−, +), III is (−, −) and IV is (+, −), going counterclockwise from the top right. A point with a 0 coordinate sits on an axis.",
      ),
    );
  }

  // Translation image.
  {
    const [x, y] = randPt(4);
    let dx = signed(1, 4);
    let dy = signed(1, 4);
    if (d === 1) {
      if (chance(0.5)) dx = 0;
      else dy = 0;
    }
    qs.push(
      pointQ(
        `Point P${xy(x, y)} is translated ${moveText(dx, dy)}. What are the coordinates of its image, P′?`,
        [x + dx, y + dy],
        [
          [x - dx, y - dy],
          [x + dy, y + dx],
          [x + dx, y - dy],
          [x - dx, y + dy],
        ],
        `Right adds to x and left subtracts from x. Up adds to y and down subtracts from y. So P′ = ${xy(x + dx, y + dy)}.`,
        fourQuadrants([{ x, y, label: "P" }]),
      ),
    );
  }

  // Reflections, rotations and combinations.
  {
    const p = randPt(5);
    const moves = d === 1 ? [REFLECT_X, REFLECT_Y] : [REFLECT_X, REFLECT_Y, ROTATE_180];
    const m = pick(moves);
    const others = [REFLECT_X, REFLECT_Y, ROTATE_180].filter((o) => o !== m);
    const verb = m === REFLECT_X ? "reflected in the x-axis" : m === REFLECT_Y ? "reflected in the y-axis" : "rotated 180° about the origin";
    if (d < 3) {
      qs.push(
        pointQ(
          `Point P${ptText(p)} is ${verb}. What are the coordinates of its image, P′?`,
          m.f(p),
          [...others.map((o) => o.f(p)), [p[1], p[0]]],
          moveHint(m, p),
          fourQuadrants([{ x: p[0], y: p[1], label: "P" }]),
        ),
      );
    } else {
      const k = signed(1, 4);
      const t = chance(0.5) ? translation(k, 0) : translation(0, k);
      const back = chance(0.5) ? translation(-k, 0) : translation(0, -k);
      const final = t.f(m.f(p));
      qs.push(
        pointQ(
          `Point P${ptText(p)} is ${verb}, then translated ${t.label.replace("Translation ", "")}. Where does it end up?`,
          final,
          [m.f(p), ...others.map((o) => t.f(o.f(p))), back.f(m.f(p))],
          `Do one step at a time. ${cap(verb)}: ${ptText(p)} → ${ptText(m.f(p))}. Then translate: ${ptText(m.f(p))} → ${ptText(final)}.`,
          fourQuadrants([{ x: p[0], y: p[1], label: "P" }]),
        ),
      );
    }
  }

  // Distance along a grid line.
  {
    let a = signed(1, 5);
    let b = signed(1, 5);
    if (d > 1) {
      a = -randInt(1, 5);
      b = randInt(1, 5);
    }
    while (a === b) b = signed(1, 5);
    const c = signed(1, 5);
    const across = chance(0.5);
    const A: Pt = across ? [a, c] : [c, a];
    const B: Pt = across ? [b, c] : [c, b];
    const dist = Math.abs(b - a);
    const [hiV, loV] = b > a ? [b, a] : [a, b];
    qs.push(
      typed(
        `How many units apart are A${ptText(A)} and B${ptText(B)}?`,
        fmt(dist),
        `They have the same ${across ? "y" : "x"}-coordinate, so count ${across ? "across" : "up and down"}: ${hiV} − ${br(loV)} = ${dist} units.`,
        "integer",
        {
          suffix: "units",
          visual: fourQuadrants([
            { x: A[0], y: A[1], label: "A" },
            { x: B[0], y: B[1], label: "B" },
          ]),
        },
      ),
    );
  }

  // Naming a transformation.
  {
    const A = randPt(5);
    const types = d === 1 ? ["x", "y", "t"] : ["x", "y", "r", "t"];
    const kind = pick(types);
    let actual: Move;
    if (kind === "x") actual = REFLECT_X;
    else if (kind === "y") actual = REFLECT_Y;
    else if (kind === "r") actual = ROTATE_180;
    else {
      let dx: number, dy: number;
      do {
        dx = randInt(-4, 4);
        dy = randInt(-4, 4);
      } while ((dx === 0 && dy === 0) || Math.abs(A[0] + dx) > 6 || Math.abs(A[1] + dy) > 6);
      actual = translation(dx, dy);
    }
    const image = actual.f(A);
    const candidates: Move[] = [REFLECT_X, REFLECT_Y, ROTATE_180, translation(signed(1, 4), 0), translation(0, signed(1, 4)), translation(signed(1, 3), signed(1, 3))];
    const wrong = shuffle(candidates.filter((c) => c.label !== actual.label && !samePt(c.f(A), image)))
      .filter((c, i, arr) => arr.findIndex((o) => o.label === c.label) === i)
      .slice(0, 3);
    const hint =
      actual === REFLECT_X
        ? `A and A′ have the same x-coordinate, and their y-coordinates are opposites (${A[1]} and ${-A[1]}). That's a reflection in the x-axis.`
        : actual === REFLECT_Y
          ? `A and A′ have the same y-coordinate, and their x-coordinates are opposites (${A[0]} and ${-A[0]}). That's a reflection in the y-axis.`
          : actual === ROTATE_180
            ? `Both coordinates changed sign: ${ptText(A)} → ${ptText(image)}. That's a rotation of 180° about the origin.`
            : `A slid without flipping or turning: x changed by ${image[0] - A[0]} and y by ${image[1] - A[1]}. That's a ${actual.label.toLowerCase()}.`;
    qs.push(
      textChoice(
        "Which single transformation moves point A to A′?",
        actual.label,
        wrong.map((w) => w.label),
        hint,
        fourQuadrants([
          { x: A[0], y: A[1], label: "A" },
          { x: image[0], y: image[1], label: "A′" },
        ]),
      ),
    );
  }

  // One coordinate of an image.
  {
    const p = randPt(5);
    const askX = chance(0.5);
    let img: Pt, story: string, hint: string;
    if (d === 1) {
      const k = signed(2, 6);
      img = askX ? [p[0] + k, p[1]] : [p[0], p[1] + k];
      story = `is translated ${askX ? moveText(k, 0) : moveText(0, k)}`;
      hint = askX
        ? `Moving ${k > 0 ? "right adds to" : "left subtracts from"} x: ${p[0]} ${k > 0 ? "+" : "−"} ${Math.abs(k)} = ${img[0]}.`
        : `Moving ${k > 0 ? "up adds to" : "down subtracts from"} y: ${p[1]} ${k > 0 ? "+" : "−"} ${Math.abs(k)} = ${img[1]}.`;
    } else if (d === 2) {
      const dx = signed(1, 6);
      const dy = signed(1, 6);
      img = [p[0] + dx, p[1] + dy];
      story = `is translated ${moveText(dx, dy)}`;
      hint = `x: ${p[0]}${plusConst(dx)} = ${img[0]}. y: ${p[1]}${plusConst(dy)} = ${img[1]}.`;
    } else {
      const m = pick([REFLECT_X, REFLECT_Y]);
      const dx = signed(1, 5);
      const dy = signed(1, 5);
      const mid = m.f(p);
      img = [mid[0] + dx, mid[1] + dy];
      story = `is reflected in the ${m === REFLECT_X ? "x" : "y"}-axis, then translated ${moveText(dx, dy)}`;
      hint = `Reflect first: ${ptText(p)} → ${ptText(mid)}. Then translate: ${ptText(mid)} → ${ptText(img)}.`;
    }
    qs.push(
      typed(`Point A${ptText(p)} ${story}. What is the ${askX ? "x" : "y"}-coordinate of its image, A′?`, fmt(askX ? img[0] : img[1]), hint, "integer"),
    );
  }

  // A rectangle on the grid.
  {
    const x1 = -randInt(1, 5);
    const x2 = randInt(1, 5);
    const y1 = -randInt(1, 5);
    const y2 = randInt(1, 5);
    const w = x2 - x1;
    const h = y2 - y1;
    const area = d === 3 || (d === 2 && chance(0.5));
    const sides = `Width: ${x2} − ${br(x1)} = ${w}. Height: ${y2} − ${br(y1)} = ${h}.`;
    qs.push(
      typed(
        `Rectangle ABCD has vertices A${xy(x1, y2)}, B${xy(x2, y2)}, C${xy(x2, y1)} and D${xy(x1, y1)}. What is its ${area ? "area" : "perimeter"}?`,
        fmt(area ? w * h : 2 * (w + h)),
        area ? `${sides} Area = ${w} × ${h} = ${w * h} square units.` : `${sides} Perimeter = 2 × (${w} + ${h}) = ${2 * (w + h)} units.`,
        "integer",
        {
          suffix: area ? "sq. units" : "units",
          visual: fourQuadrants([
            { x: x1, y: y2, label: "A" },
            { x: x2, y: y2, label: "B" },
            { x: x2, y: y1, label: "C" },
            { x: x1, y: y1, label: "D" },
          ]),
        },
      ),
    );
  }

  return shuffle(qs);
}

// ---------- 7. Linear Relations ----------

/** Wrong (slope, constant) pairs for "which rule matches?" questions. */
function wrongRules(m: number, b: number): [number, number][] {
  const raw: [number, number][] = [
    [b, m],
    [m, 0],
    [m, -b],
    [m + 1, b],
    [m, b + 1],
    [-m, b],
    [1, m + b],
    [m + b, 0],
    [m, m + b],
  ];
  const seen = new Set<string>([`${m},${b}`]);
  return shuffle(raw).filter(([a, c]) => {
    const k = `${a},${c}`;
    if (a === 0 || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const MEANINGS = [
  {
    eq: (m: number, b: number) => `C = ${m}h + ${b}`,
    about: "the cost C, in dollars, to rent a kayak for h hours",
    rate: "The cost for each hour",
    fixed: "A flat fee paid no matter how many hours",
    vari: "The number of hours",
    total: "The total cost",
    step: "hour",
  },
  {
    eq: (m: number, b: number) => `H = ${m}w + ${b}`,
    about: "a plant's height H, in centimetres, after w weeks",
    rate: "How much the plant grows each week",
    fixed: "The plant's height at the start",
    vari: "The number of weeks",
    total: "The plant's height",
    step: "week",
  },
  {
    eq: (m: number, b: number) => `S = ${m}w + ${b}`,
    about: "the money S, in dollars, in a savings jar after w weeks",
    rate: "The amount added each week",
    fixed: "The amount in the jar at the start",
    vari: "The number of weeks",
    total: "The total in the jar",
    step: "week",
  },
];

const RATE_CONTEXTS = [
  {
    forward: (m: number, b: number, x: number) => `A bike rental costs $${b} plus $${m} for each hour. What is the cost, in dollars, for ${plural(x, "hour")}?`,
    reverse: (m: number, b: number, t: number) => `A bike rental costs $${b} plus $${m} for each hour. A bill came to $${t}. For how many hours was the bike rented?`,
  },
  {
    forward: (m: number, b: number, x: number) => `A phone plan costs $${b} a month plus $${m} for each gigabyte of data. What is the bill, in dollars, for a month with ${x} GB?`,
    reverse: (m: number, b: number, t: number) => `A phone plan costs $${b} a month plus $${m} for each gigabyte of data. One month's bill was $${t}. How many gigabytes were used?`,
  },
  {
    forward: (m: number, b: number, x: number) => `A tank holds ${b} L of water and is being filled at ${m} L per minute. How many litres are in the tank after ${plural(x, "minute")}?`,
    reverse: (m: number, b: number, t: number) => `A tank holds ${b} L of water and is being filled at ${m} L per minute. After how many minutes will it hold ${t} L?`,
  },
];

function linearRelations(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];
  const slope = () => (d === 1 ? randInt(2, 5) : d === 2 ? randInt(2, 9) : pick([-4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]));
  const constant = () => (d === 1 ? randInt(0, 6) : d === 2 ? randInt(-5, 12) : randInt(-10, 15));

  // A table with a missing value.
  {
    const m = slope();
    const b = constant();
    const xs = d === 1 ? [1, 2, 3, 4, 5] : d === 2 ? [1, 2, 3, 4, randInt(8, 12)] : [0, 2, 4, 6, randInt(10, 20)];
    const blank = d === 1 ? randInt(1, 4) : 4;
    const X = xs[blank];
    const Y = m * X + b;
    const step = xs[1] - xs[0];
    qs.push(
      typed(
        "The table follows a pattern. What number belongs where the ? is?",
        fmt(Y),
        `Each time x goes up by ${step}, y changes by ${m * step}, so y changes by ${m} for each 1 in x. The rule is y = ${lin(m, b, "x")}. When x = ${X}: ${m} × ${X}${plusConst(b)} = ${Y}.`,
        "integer",
        { visual: { type: "table", headers: ["x", ...xs.map(String)], rows: [["y", ...xs.map((x, i) => (i === blank ? "?" : m * x + b))]] } },
      ),
    );
  }

  // Which expression matches the table?
  {
    const m = d === 3 ? pick([-3, -2, 2, 3, 4, 5, 6]) : randInt(2, d === 1 ? 5 : 8);
    let b: number;
    do b = d === 1 ? randInt(1, 6) : randInt(-6, 10);
    while (b === 0 || b === m);
    const ns = [1, 2, 3, 4];
    qs.push(
      textChoice(
        "Which expression gives the value for any term number n?",
        lin(m, b),
        wrongRules(m, b)
          .slice(0, 3)
          .map(([a, c]) => lin(a, c)),
        `The value changes by ${m} each time n goes up by 1, so the rule starts with ${m}n. At n = 1, ${m}n is ${m} but the table shows ${m + b}, so ${b > 0 ? `add ${b}` : `subtract ${-b}`}: ${lin(m, b)}.`,
        { type: "table", headers: ["n", ...ns.map(String)], rows: [["value", ...ns.map((n) => m * n + b)]] },
      ),
    );
  }

  // Graph → rule.
  {
    let m: number, b: number, xs: number[], visual: Visual;
    if (d < 3) {
      m = randInt(1, d === 1 ? 2 : 3);
      b = randInt(0, m === 3 ? 1 : 2);
      xs = m === 3 ? [0, 1, 2, 3] : [0, 1, 2, 3, 4];
      visual = { type: "grid", size: 10, points: xs.map((x) => ({ x, y: m * x + b })) };
    } else {
      do {
        m = pick([-3, -2, -1, 1, 2, 3]);
        b = randInt(-2, 2);
      } while (Math.abs(m) * 2 + Math.abs(b) > 6);
      xs = [-2, -1, 0, 1, 2];
      visual = fourQuadrants(xs.map((x) => ({ x, y: m * x + b })));
    }
    qs.push(
      textChoice(
        "Which equation matches the points on the graph?",
        `y = ${lin(m, b, "x")}`,
        wrongRules(m, b)
          .slice(0, 3)
          .map(([a, c]) => `y = ${lin(a, c, "x")}`),
        `At x = 0 the point is at y = ${b}. Each step right, y goes ${m > 0 ? "up" : "down"} ${Math.abs(m)}. So y = ${lin(m, b, "x")}. Check another point: x = 1 gives y = ${m + b}.`,
        visual,
      ),
    );
  }

  // Rate in context.
  {
    const ctx = pick(RATE_CONTEXTS);
    const m = randInt(2, 9);
    const b = randInt(5, 30);
    const x = randInt(3, 12);
    const total = m * x + b;
    if (d < 3) {
      qs.push(typed(ctx.forward(m, b, x), fmt(total), `Start amount + rate × number: ${b} + ${m} × ${x} = ${b} + ${m * x} = ${total}.`, "integer"));
    } else {
      qs.push(
        typed(
          ctx.reverse(m, b, total),
          fmt(x),
          `Write an equation: ${m}x + ${b} = ${total}. Subtract ${b}: ${m}x = ${total - b}. Divide by ${m}: x = ${x}.`,
          "integer",
        ),
      );
    }
  }

  // Evaluating an expression.
  {
    const m = d === 3 ? signed(2, 9) : randInt(2, 9);
    const b = constant();
    const n = d === 1 ? randInt(2, 9) : signed(1, 9);
    const v = m * n + b;
    qs.push(
      typed(
        `What is the value of ${lin(m, b)} when n = ${n}?`,
        fmt(v),
        `Replace n with ${br(n)}: ${m} × ${br(n)}${plusConst(b)} = ${m * n}${plusConst(b)} = ${v}.`,
        "integer",
        { visual: { type: "equation", text: lin(m, b) } },
      ),
    );
  }

  // Growing pattern.
  {
    const m = randInt(2, d === 1 ? 4 : 6);
    const b = randInt(d === 3 ? -1 : 0, 4);
    const thing = pick(["tiles", "toothpicks", "dots", "chairs"]);
    const lines = [1, 2, 3, 4].map((f) => `Figure ${f}: ${m * f + b} ${thing}`);
    if (d < 3) {
      const F = d === 1 ? 10 : randInt(15, 50);
      qs.push(
        typed(
          `This pattern keeps growing the same way. How many ${thing} are in Figure ${F}?`,
          fmt(m * F + b),
          `Each figure adds ${m} ${thing}, so the rule is ${lin(m, b)} for figure n. Figure ${F}: ${m} × ${F}${plusConst(b)} = ${m * F + b}.`,
          "integer",
          { visual: { type: "story", lines } },
        ),
      );
    } else {
      const F = randInt(15, 40);
      const T = m * F + b;
      qs.push(
        typed(
          `This pattern keeps growing the same way. Which figure has ${T} ${thing}?`,
          fmt(F),
          `The rule is ${lin(m, b)}. Solve ${lin(m, b)} = ${T}: ${b === 0 ? "" : `${b > 0 ? "subtract" : "add"} ${Math.abs(b)} to get ${m}n = ${T - b}, then `}divide by ${m} to get n = ${F}.`,
          "integer",
          { visual: { type: "story", lines } },
        ),
      );
    }
  }

  // Which point is on the line?
  {
    const m = d === 1 ? randInt(1, 4) : signed(1, 4);
    const b = d === 1 ? randInt(0, 5) : randInt(-5, 5);
    const x0 = d === 1 ? randInt(1, 5) : randInt(-3, 4);
    const y0 = m * x0 + b;
    const onLine = ([x, y]: Pt) => y === m * x + b;
    const pool: Pt[] = shuffle([
      [y0, x0],
      [x0, y0 + 1],
      [x0, y0 - 1],
      [x0 + 1, y0],
      [-x0, y0],
      [x0, -y0],
      [x0 + 1, y0 - m],
    ]);
    const wrong = pool.filter((p) => !onLine(p));
    qs.push(
      pointQ(
        `Which point is on the graph of y = ${lin(m, b, "x")}?`,
        [x0, y0],
        wrong,
        `Substitute each x into the rule and see if you get the y. For x = ${x0}: y = ${m} × ${br(x0)}${plusConst(b)} = ${y0}, so ${xy(x0, y0)} is on the line.`,
        { type: "equation", text: `y = ${lin(m, b, "x")}` },
      ),
    );
  }

  // What do the numbers mean?
  {
    const ctx = pick(MEANINGS);
    let m: number, b: number;
    do {
      m = randInt(2, 9);
      b = randInt(5, 40);
    } while (m === b);
    const askRate = chance(0.5);
    const right = askRate ? ctx.rate : ctx.fixed;
    qs.push(
      textChoice(
        `The equation ${ctx.eq(m, b)} gives ${ctx.about}. What does the ${askRate ? m : b} tell you?`,
        right,
        [askRate ? ctx.fixed : ctx.rate, ctx.vari, ctx.total],
        `The number multiplied by the variable (${m}) is the rate: it's added again for every ${ctx.step}. The number added on its own (${b}) is the starting amount.`,
        { type: "equation", text: ctx.eq(m, b) },
      ),
    );
  }

  return shuffle(qs);
}

// ---------- 8. Two-Step Equations ----------

const NUMBER_WORDS = ["", "", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

function twoStepEquations(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];
  const coef = () => randInt(2, d === 1 ? 5 : d === 2 ? 9 : 12);
  const sol = () => randInt(d === 1 ? 1 : 2, d === 1 ? 10 : d === 2 ? 15 : 25);
  const cst = () => randInt(1, d === 1 ? 12 : d === 2 ? 30 : 60);

  // ax + b = c
  {
    const a = coef();
    const x = sol();
    const b = cst();
    const c = a * x + b;
    qs.push(
      typed(
        "Solve for x.",
        fmt(x),
        `Undo the + ${b} first: subtract ${b} from both sides to get ${a}x = ${c - b}. Then undo the × ${a}: divide both sides by ${a} to get x = ${x}.`,
        "integer",
        { visual: { type: "equation", text: `${a}x + ${b} = ${c}` } },
      ),
    );
  }

  // an − b = c
  {
    const a = coef();
    const x = sol();
    let b: number;
    do b = cst();
    while (b >= a * x);
    const c = a * x - b;
    qs.push(
      numQ(
        `Solve:  ${a}n − ${b} = ${c}`,
        x,
        [(c - b) / a, c + b, c / a + b].filter((v) => Number.isInteger(v) && v >= 0),
        `Undo the − ${b} first: add ${b} to both sides to get ${a}n = ${c + b}. Then divide both sides by ${a}: n = ${x}.`,
        undefined,
        { min: 0 },
      ),
    );
  }

  // Which step?
  {
    const a = coef();
    const x = sol();
    const b = cst();
    const form = d === 1 ? 0 : randInt(0, 2);
    if (form === 0) {
      qs.push(
        textChoice(
          `To solve ${a}x + ${b} = ${a * x + b}, how do you undo the + ${b}?`,
          `Subtract ${b} from both sides`,
          [`Add ${b} to both sides`, `Divide both sides by ${b}`, `Subtract ${b} from the left side only`],
          `Use the opposite operation, and keep the equation balanced by doing it to both sides. The opposite of adding ${b} is subtracting ${b}.`,
        ),
      );
    } else if (form === 1) {
      const bb = Math.min(b, a * x - 1);
      qs.push(
        textChoice(
          `To solve ${a}x − ${bb} = ${a * x - bb}, how do you undo the − ${bb}?`,
          `Add ${bb} to both sides`,
          [`Subtract ${bb} from both sides`, `Multiply both sides by ${bb}`, `Add ${bb} to the left side only`],
          `Use the opposite operation, on both sides so the equation stays balanced. The opposite of subtracting ${bb} is adding ${bb}: ${a}x = ${a * x}.`,
        ),
      );
    } else {
      qs.push(
        textChoice(
          `Solving ${a}x + ${b} = ${a * x + b}, you reach ${a}x = ${a * x}. Which step gets x by itself?`,
          `Divide both sides by ${a}`,
          [`Multiply both sides by ${a}`, `Subtract ${a} from both sides`, `Divide only the left side by ${a}`],
          `${a}x means ${a} × x. Undo multiplying by dividing, on both sides: x = ${a * x} ÷ ${a} = ${x}.`,
        ),
      );
    }
  }

  // Word problems.
  {
    const name = pick(NAMES);
    const kind = randInt(0, 3);
    if (kind === 3) {
      const w = randInt(2, d === 1 ? 10 : 20);
      const L = randInt(w + 1, d === 1 ? 20 : 40);
      const P = 2 * L + 2 * w;
      qs.push(
        typed(
          `A rectangle has a perimeter of ${P} cm and a width of ${w} cm. What is its length?`,
          fmt(L),
          `Perimeter = 2L + 2w, so 2L + ${2 * w} = ${P}. Subtract ${2 * w}: 2L = ${P - 2 * w}. Divide by 2: L = ${L} cm.`,
          "integer",
          { suffix: "cm" },
        ),
      );
    } else {
      const a = coef();
      const x = sol();
      const b = cst() + 5;
      const c = a * x + b;
      const prompt =
        kind === 0
          ? `${name} has $${b} saved and adds $${a} each week. After how many weeks will ${name} have $${c}?`
          : kind === 1
            ? `A climbing gym charges a $${b} membership fee plus $${a} per visit. ${name} paid $${c} in total. How many visits was that?`
            : `${name} buys some packs of stickers at $${a} each and a $${b} sticker album. The total is $${c}. How many packs did ${name} buy?`;
      qs.push(
        typed(
          prompt,
          fmt(x),
          `Write an equation: ${a}x + ${b} = ${c}. Subtract ${b} from both sides: ${a}x = ${c - b}. Divide both sides by ${a}: x = ${x}.`,
          "integer",
        ),
      );
    }
  }

  // Sentence → equation.
  {
    const a = coef();
    let b: number;
    do b = randInt(2, 12);
    while (b === a);
    const x = sol();
    const word = NUMBER_WORDS[a];
    const form = d === 3 ? randInt(0, 2) : randInt(0, 1);
    if (form === 0) {
      const c = a * x + b;
      qs.push(
        textChoice(
          `Which equation matches this sentence? "${word} times a number, plus ${b}, equals ${c}."`,
          `${a}n + ${b} = ${c}`,
          [`${a}(n + ${b}) = ${c}`, `${b}n + ${a} = ${c}`, `${a}n − ${b} = ${c}`],
          `"${word} times a number" is ${a}n. "Plus ${b}" adds ${b} after multiplying: ${a}n + ${b}. "Equals ${c}" finishes it: ${a}n + ${b} = ${c}.`,
        ),
      );
    } else if (form === 1) {
      const xx = Math.max(x, Math.ceil((b + 1) / a));
      const c = a * xx - b;
      qs.push(
        textChoice(
          `Which equation matches this sentence? "${word} times a number, minus ${b}, equals ${c}."`,
          `${a}n − ${b} = ${c}`,
          [`${a}n + ${b} = ${c}`, `${a}(n − ${b}) = ${c}`, `${b}n − ${a} = ${c}`],
          `"${word} times a number" is ${a}n. "Minus ${b}" subtracts ${b} after multiplying: ${a}n − ${b}. "Equals ${c}" finishes it: ${a}n − ${b} = ${c}.`,
        ),
      );
    } else {
      const c = a * (x + b);
      qs.push(
        textChoice(
          `Which equation matches this sentence? "${word} times the sum of a number and ${b} equals ${c}."`,
          `${a}(n + ${b}) = ${c}`,
          [`${a}n + ${b} = ${c}`, `${b}(n + ${a}) = ${c}`, `${a}(n − ${b}) = ${c}`],
          `"The sum of a number and ${b}" is (n + ${b}). ${word} times that whole sum needs brackets: ${a}(n + ${b}) = ${c}.`,
        ),
      );
    }
  }

  // Checking a solution.
  {
    const a = coef();
    const x = sol();
    const b = cst();
    const k = chance(0.5) ? x : Math.max(0, x + pick([-1, 1, 2]));
    let text: string, lhs: number, c: number, sub: string;
    if (d === 1) {
      c = a * x + b;
      lhs = a * k + b;
      text = `${a}x + ${b} = ${c}`;
      sub = `${a} × ${k} + ${b} = ${lhs}`;
    } else if (d === 2) {
      const bb = Math.min(b, a * x - 1);
      c = a * x - bb;
      lhs = a * k - bb;
      text = `${a}x − ${bb} = ${c}`;
      sub = `${a} × ${k} − ${bb} = ${lhs}`;
    } else {
      const bb = randInt(1, 9);
      c = a * (x + bb);
      lhs = a * (k + bb);
      text = `${a}(x + ${bb}) = ${c}`;
      sub = `${a} × (${k} + ${bb}) = ${lhs}`;
    }
    const works = lhs === c;
    qs.push(
      textChoice(
        `Is x = ${k} a solution of ${text}?`,
        works ? "Yes" : "No",
        [works ? "No" : "Yes"],
        `Substitute x = ${k}: ${sub}. ${works ? `That equals ${c}, so x = ${k} works.` : `That isn't ${c}, so x = ${k} is not a solution.`}`,
        { type: "equation", text },
      ),
    );
  }

  // Other shapes of two-step equations.
  {
    const a = coef();
    const x = sol();
    const b = cst();
    if (d === 1) {
      const c = b + a * x;
      qs.push(
        typed("Solve for x.", fmt(x), `Subtract ${b} from both sides: ${a}x = ${c - b}. Then divide both sides by ${a}: x = ${x}.`, "integer", {
          visual: { type: "equation", text: `${b} + ${a}x = ${c}` },
        }),
      );
    } else if (d === 2) {
      const plus = chance(0.5) || b >= a * x;
      const c = plus ? a * x + b : a * x - b;
      qs.push(
        typed(
          "Solve for x.",
          fmt(x),
          `The x can be on either side. ${plus ? `Subtract ${b}` : `Add ${b}`} on both sides: ${a * x} = ${a}x. Then divide by ${a}: x = ${x}.`,
          "integer",
          { visual: { type: "equation", text: `${c} = ${a}x ${plus ? "+" : "−"} ${b}` } },
        ),
      );
    } else {
      const bb = randInt(1, 15);
      const c = a * (x + bb);
      qs.push(
        typed(
          "Solve for x.",
          fmt(x),
          `Divide both sides by ${a} first: x + ${bb} = ${c / a}. Then subtract ${bb}: x = ${x}. (Or expand: ${a}x + ${a * bb} = ${c}.)`,
          "integer",
          { visual: { type: "equation", text: `${a}(x + ${bb}) = ${c}` } },
        ),
      );
    }
  }

  // Balance or number puzzle.
  {
    const a = coef();
    const x = sol();
    if (d < 3) {
      const b = randInt(2, d === 1 ? 10 : 20);
      const c = a * x + b;
      qs.push(
        typed(
          `On a balance scale, ${a} identical bags of marbles plus ${b} loose marbles balance ${c} loose marbles. How many marbles are in each bag?`,
          fmt(x),
          `Take ${b} marbles off both sides: ${a} bags balance ${c - b} marbles. Share them among ${a} bags: ${c - b} ÷ ${a} = ${x}.`,
          "integer",
          { visual: { type: "emoji", emoji: "⚖️", caption: `${a}x + ${b} = ${c}` } },
        ),
      );
    } else {
      const name = pick(NAMES);
      let b: number;
      do b = cst();
      while (b >= a * x);
      const c = a * x - b;
      qs.push(
        typed(
          `${name} thinks of a number, multiplies it by ${a}, then subtracts ${b}. The result is ${c}. What was the number?`,
          fmt(x),
          `The equation is ${a}n − ${b} = ${c}. Work backwards: add ${b} to get ${c + b}, then divide by ${a} to get ${x}.`,
          "integer",
        ),
      );
    }
  }

  return shuffle(qs);
}

// ---------- 9. Circles ----------

const CIRCLE_CONCEPTS: Concept[] = [
  {
    levels: [1, 2],
    prompt: "What is the diameter of a circle?",
    right: "The distance across the circle through its centre",
    wrong: ["The distance from the centre to the edge", "The distance around the circle", "The space inside the circle"],
    hint: "Dia- means \"across\". The diameter goes all the way across through the centre, so it's twice the radius.",
  },
  {
    levels: [1, 2, 3],
    prompt: "What is π (pi)?",
    right: "The circumference divided by the diameter, about 3.14",
    wrong: ["The distance around a circle", "Half of the diameter", "The radius times 2"],
    hint: "For every circle, circumference ÷ diameter is the same number, π ≈ 3.14.",
  },
  {
    levels: [1, 2],
    prompt: "About how many times longer is a circle's circumference than its diameter?",
    right: "A little more than 3 times",
    wrong: ["Exactly 2 times", "About 4 times", "A little less than 3 times"],
    hint: "C ÷ d = π ≈ 3.14, which is a little more than 3.",
  },
  {
    levels: [2, 3],
    prompt: "If you double a circle's diameter, what happens to its circumference?",
    right: "It doubles",
    wrong: ["It stays the same", "It becomes 4 times as long", "It grows by 3.14"],
    hint: "C = π × d. Double the d and you double the C.",
  },
  {
    levels: [2, 3],
    prompt: "Which formula gives the area of a circle?",
    right: "A = π × r × r",
    wrong: ["A = π × d", "A = 2 × π × r", "A = π × d × d"],
    hint: "Area uses the radius twice: A = πr². Both π × d and 2 × π × r give the circumference.",
  },
  {
    levels: [3],
    prompt: "If you double a circle's radius, what happens to its area?",
    right: "It becomes 4 times as big",
    wrong: ["It doubles", "It stays the same", "It becomes 3.14 times as big"],
    hint: "A = π × r × r. Doubling r doubles both r's, and 2 × 2 = 4.",
  },
  {
    levels: [3],
    prompt: "A circle has a radius of 5 cm. Which is closest to its circumference?",
    right: "About 31 cm",
    wrong: ["About 16 cm", "About 79 cm", "About 25 cm"],
    hint: "C = 2 × π × r ≈ 2 × 3.14 × 5 = 31.4 cm. (78.5 is the area in cm², not the circumference.)",
  },
];

const ROUND_NOTE = "Use 3.14 for π and round to one decimal place.";

function circles(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];

  // Radius and diameter.
  if (d === 1 || chance(0.5)) {
    const D = 2 * randInt(2, 20);
    qs.push(
      numQ(
        `A circle has a diameter of ${D} cm. What is its radius?`,
        D / 2,
        [2 * D, D, D / 4],
        `The radius goes from the centre to the edge: half the diameter. ${D} ÷ 2 = ${D / 2} cm.`,
        { type: "emoji", emoji: "⭕", caption: `d = ${D} cm` },
        { unit: " cm", min: 0.5 },
      ),
    );
  } else {
    const r = d === 3 ? randInt(3, 30) + 0.5 : randInt(3, 30);
    qs.push(
      numQ(
        `A circle has a radius of ${fmt(r)} cm. What is its diameter?`,
        2 * r,
        [r / 2, r, 4 * r],
        `The diameter is two radii laid end to end: 2 × ${fmt(r)} = ${fmt(2 * r)} cm.`,
        { type: "emoji", emoji: "⭕", caption: `r = ${fmt(r)} cm` },
        { unit: " cm", min: 0.5 },
      ),
    );
  }

  // Circumference from the diameter.
  {
    const D = d === 1 ? randInt(2, 20) : d === 2 ? randInt(5, 50) : randInt(5, 30) + 0.5;
    const p = piAnswer(D);
    qs.push(
      typed(
        `A circle has a diameter of ${fmt(D)} cm. What is its circumference? ${ROUND_NOTE}`,
        p.answer,
        `C = π × d ≈ 3.14 × ${fmt(D)} = ${fmt(p.exact)}. Rounded to one decimal place: ${p.answer} cm.`,
        "decimal",
        { accept: p.accept, suffix: "cm", visual: { type: "emoji", emoji: "⭕", caption: `d = ${fmt(D)} cm` } },
      ),
    );
  }

  // Circumference from the radius.
  {
    const r = d === 1 ? randInt(1, 10) : d === 2 ? randInt(3, 25) : randInt(2, 20) + 0.5;
    const p = piAnswer(2 * r);
    qs.push(
      typed(
        `A circle has a radius of ${fmt(r)} m. What is its circumference? ${ROUND_NOTE}`,
        p.answer,
        `C = 2 × π × r ≈ 2 × 3.14 × ${fmt(r)} = ${fmt(p.exact)}. Rounded: ${p.answer} m. (Or double the radius to get d = ${fmt(2 * r)}, then 3.14 × d.)`,
        "decimal",
        { accept: p.accept, suffix: "m", visual: { type: "emoji", emoji: "⭕", caption: `r = ${fmt(r)} m` } },
      ),
    );
  }

  // Area from the radius.
  {
    const r = d === 1 ? randInt(1, 6) : d === 2 ? randInt(3, 12) : pick([randInt(1, 9) + 0.5, randInt(13, 20)]);
    const p = piAnswer(r * r);
    qs.push(
      typed(
        `A circle has a radius of ${fmt(r)} cm. What is its area? ${ROUND_NOTE}`,
        p.answer,
        `A = π × r × r ≈ 3.14 × ${fmt(r)} × ${fmt(r)} = 3.14 × ${fmt(r * r)} = ${fmt(p.exact)}. Rounded: ${p.answer} cm².`,
        "decimal",
        { accept: p.accept, suffix: "cm²", visual: { type: "emoji", emoji: "⭕", caption: `r = ${fmt(r)} cm` } },
      ),
    );
  }

  // Area from the diameter.
  {
    const D = 2 * randInt(3, d === 1 ? 8 : 15);
    const r = D / 2;
    const A = (314 * r * r) / 100;
    qs.push(
      numQ(
        `A circle has a diameter of ${D} cm. Using 3.14 for π, what is its area?`,
        A,
        [(314 * D * D) / 100, (314 * D) / 100, (314 * r) / 100],
        `First find the radius: ${D} ÷ 2 = ${r}. Then A = 3.14 × ${r} × ${r} = ${fmt(A)} cm². (Using the diameter instead of the radius makes the area 4 times too big.)`,
        { type: "emoji", emoji: "⭕", caption: `d = ${D} cm` },
        { unit: " cm²", step: 3.14, min: 1 },
      ),
    );
  }

  // Concepts.
  qs.push(conceptQ(CIRCLE_CONCEPTS, d));

  // Working backwards from the circumference.
  {
    if (d < 3) {
      const D = d === 1 ? randInt(2, 10) : randInt(10, 40);
      const C = (314 * D) / 100;
      qs.push(
        typed(
          `A circle's circumference is ${fmt(C)} cm. What is its diameter? (Use 3.14 for π.)`,
          fmt(D),
          `C = 3.14 × d, so d = C ÷ 3.14 = ${fmt(C)} ÷ 3.14 = ${D} cm.`,
          "decimal",
          { suffix: "cm" },
        ),
      );
    } else {
      const r = randInt(2, 25);
      const C = (628 * r) / 100;
      qs.push(
        typed(
          `A circle's circumference is ${fmt(C)} cm. What is its radius? (Use 3.14 for π.)`,
          fmt(r),
          `C = 2 × 3.14 × r = 6.28 × r, so r = ${fmt(C)} ÷ 6.28 = ${r} cm. (Or find d = C ÷ 3.14 = ${2 * r}, then halve it.)`,
          "decimal",
          { suffix: "cm" },
        ),
      );
    }
  }

  // Real-world circles.
  {
    const kind = randInt(0, 2);
    if (kind === 0) {
      const D = 10 * randInt(4, 8);
      const turns = d === 3 ? randInt(2, 10) : 1;
      const p = piAnswer(D * turns);
      qs.push(
        typed(
          `A bike wheel has a diameter of ${D} cm. How far does the bike roll in ${turns === 1 ? "one full turn of the wheel" : `${turns} full turns of the wheel`}? ${ROUND_NOTE}`,
          p.answer,
          `One turn rolls one circumference: 3.14 × ${D} = ${fmt((314 * D) / 100)} cm.${turns > 1 ? ` For ${turns} turns: ${fmt((314 * D) / 100)} × ${turns} = ${fmt(p.exact)} cm.` : ""}`,
          "decimal",
          { accept: p.accept, suffix: "cm", visual: { type: "emoji", emoji: "🚲", caption: `d = ${D} cm` } },
        ),
      );
    } else if (kind === 1) {
      const D = 2 * randInt(d === 1 ? 5 : 8, d === 1 ? 10 : 20);
      const r = D / 2;
      const p = piAnswer(r * r);
      qs.push(
        typed(
          `A round pizza has a diameter of ${D} cm. What is the area of its top? ${ROUND_NOTE}`,
          p.answer,
          `Radius = ${D} ÷ 2 = ${r} cm. A = 3.14 × ${r} × ${r} = ${fmt(p.exact)}. Rounded: ${p.answer} cm².`,
          "decimal",
          { accept: p.accept, suffix: "cm²", visual: { type: "emoji", emoji: "🍕", caption: `d = ${D} cm` } },
        ),
      );
    } else {
      const r = d === 1 ? randInt(2, 6) : randInt(3, 15);
      const p = piAnswer(2 * r);
      qs.push(
        typed(
          `A circular garden has a radius of ${r} m. How much fencing is needed to go all the way around it? ${ROUND_NOTE}`,
          p.answer,
          `The fence is the circumference: C = 2 × 3.14 × ${r} = ${fmt(p.exact)}. Rounded: ${p.answer} m.`,
          "decimal",
          { accept: p.accept, suffix: "m", visual: { type: "emoji", emoji: "🌻", caption: `r = ${r} m` } },
        ),
      );
    }
  }

  return shuffle(qs);
}

// ---------- 10. Volume ----------

const VOLUME_CONCEPTS: Concept[] = [
  {
    levels: [1],
    prompt: "Which unit could measure the volume of a box?",
    right: "Cubic centimetres (cm³)",
    wrong: ["Square centimetres (cm²)", "Centimetres (cm)", "Degrees (°)"],
    hint: "Volume is the space inside a 3-D object, so it's measured in cubes: cm³ or m³. cm² is for area and cm is for length.",
  },
  {
    levels: [1, 2],
    prompt: "What does the volume of a container tell you?",
    right: "How much space is inside it",
    wrong: ["How far it is around the outside", "How much area its base covers", "How tall it is"],
    hint: "Volume measures the space a 3-D object takes up or holds, in cubic units.",
  },
  {
    levels: [2],
    prompt: "A container has a volume of 1 cm³. How much water can it hold?",
    right: "1 mL",
    wrong: ["1 L", "10 mL", "100 mL"],
    hint: "1 cm³ holds exactly 1 mL, so 1000 cm³ holds 1 L.",
  },
  {
    levels: [2, 3],
    prompt: "Which formula gives the volume of a cylinder?",
    right: "V = π × r × r × h",
    wrong: ["V = 2 × π × r × h", "V = π × d × h", "V = l × w × h"],
    hint: "Volume = area of the base × height. A cylinder's base is a circle with area π × r × r.",
  },
  {
    levels: [3],
    prompt: "How many cubic centimetres are in 1 cubic metre?",
    right: "1 000 000 cm³",
    wrong: ["100 cm³", "1000 cm³", "10 000 cm³"],
    hint: "1 m = 100 cm, so 1 m³ = 100 × 100 × 100 = 1 000 000 cm³.",
  },
  {
    levels: [3],
    prompt: "If you double the height of a cylinder and keep the radius the same, what happens to its volume?",
    right: "It doubles",
    wrong: ["It becomes 4 times as big", "It stays the same", "It grows by 3.14"],
    hint: "V = base area × height. The base doesn't change, so doubling the height doubles the volume.",
  },
];

function volume(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];

  // Rectangular prism.
  {
    let l = randInt(d === 1 ? 2 : 3, d === 1 ? 6 : 12);
    const w = randInt(d === 1 ? 2 : 3, d === 1 ? 6 : 12);
    const h = randInt(d === 1 ? 2 : 3, d === 1 ? 6 : 12);
    if (d === 3) l += 0.5;
    const V = l * w * h;
    const u = d === 3 ? "m" : "cm";
    qs.push(
      typed(
        `${u === "m" ? "A storage unit" : "A box"} is ${fmt(l)} ${u} long, ${w} ${u} wide and ${h} ${u} high. What is its volume?`,
        fmt(V),
        `V = l × w × h = ${fmt(l)} × ${w} × ${h} = ${fmt(l * w)} × ${h} = ${fmt(V)} ${u}³.`,
        "decimal",
        { suffix: `${u}³`, visual: { type: "shape", shape: "rectangular-prism" } },
      ),
    );
  }

  // Cube.
  {
    const e = randInt(2, d === 1 ? 5 : 10);
    qs.push(
      numQ(
        `A cube has edges ${e} cm long. What is its volume?`,
        e ** 3,
        [e * e, 6 * e * e, 12 * e, 3 * e],
        `All three dimensions are ${e} cm: V = ${e} × ${e} × ${e} = ${e ** 3} cm³. (${e * e} is the area of one face.)`,
        { type: "shape", shape: "cube" },
        { unit: " cm³", min: 1 },
      ),
    );
  }

  // Cylinder.
  {
    let r: number, h: number, given: string;
    if (d === 1) {
      r = randInt(1, 4);
      h = randInt(2, 10);
      given = `a radius of ${r} cm`;
    } else if (d === 2) {
      r = randInt(2, 8);
      h = randInt(3, 15);
      given = `a radius of ${r} cm`;
    } else {
      r = randInt(2, 8);
      h = randInt(5, 25);
      given = `a diameter of ${2 * r} cm`;
    }
    const p = piAnswer(r * r * h);
    qs.push(
      typed(
        `A cylinder has ${given} and a height of ${h} cm. What is its volume? ${ROUND_NOTE}`,
        p.answer,
        `${d === 3 ? `Radius = ${2 * r} ÷ 2 = ${r} cm. ` : ""}V = π × r × r × h ≈ 3.14 × ${r} × ${r} × ${h} = 3.14 × ${r * r * h} = ${fmt(p.exact)}. Rounded: ${p.answer} cm³.`,
        "decimal",
        { accept: p.accept, suffix: "cm³", visual: { type: "shape", shape: "cylinder" } },
      ),
    );
  }

  // A missing dimension.
  if (d < 3) {
    const l = randInt(2, d === 1 ? 6 : 12);
    const w = randInt(2, d === 1 ? 6 : 12);
    const h = randInt(2, d === 1 ? 8 : 15);
    const V = l * w * h;
    qs.push(
      typed(
        `A box has a volume of ${V} cm³. It is ${l} cm long and ${w} cm wide. How tall is it?`,
        fmt(h),
        `V = l × w × h, so ${V} = ${l} × ${w} × h = ${l * w} × h. Divide: h = ${V} ÷ ${l * w} = ${h} cm.`,
        "decimal",
        { suffix: "cm", visual: { type: "shape", shape: "rectangular-prism" } },
      ),
    );
  } else {
    const r = randInt(2, 6);
    const h = randInt(3, 15);
    const B = (314 * r * r) / 100;
    const V = (314 * r * r * h) / 100;
    qs.push(
      typed(
        `A cylinder has a base area of ${fmt(B)} cm² and a volume of ${fmt(V)} cm³. How tall is it?`,
        fmt(h),
        `V = base area × height, so h = V ÷ base area = ${fmt(V)} ÷ ${fmt(B)} = ${h} cm.`,
        "decimal",
        { suffix: "cm", visual: { type: "shape", shape: "cylinder" } },
      ),
    );
  }

  // Base area × height.
  if (d === 1) {
    const B = randInt(6, 40);
    const h = randInt(2, 12);
    qs.push(
      numQ(
        `A prism has a base area of ${B} cm² and a height of ${h} cm. What is its volume?`,
        B * h,
        [B + h, 2 * B * h, B * h * 10],
        `Volume = base area × height = ${B} × ${h} = ${B * h} cm³.`,
        { type: "shape", shape: "rectangular-prism" },
        { unit: " cm³", min: 1 },
      ),
    );
  } else {
    const r = randInt(2, 6);
    const h = randInt(2, 12);
    const B = (314 * r * r) / 100;
    const V = (314 * r * r * h) / 100;
    qs.push(
      numQ(
        `A cylinder's circular base has an area of ${fmt(B)} cm². The cylinder is ${h} cm tall. What is its volume?`,
        V,
        [B + h, roundTo(V * 3.14, 2), V / 2],
        `Volume = base area × height = ${fmt(B)} × ${h} = ${fmt(V)} cm³. The base area already includes π, so don't multiply by 3.14 again.`,
        { type: "shape", shape: "cylinder" },
        { unit: " cm³", min: 1, step: 3.14 },
      ),
    );
  }

  // Concepts.
  qs.push(conceptQ(VOLUME_CONCEPTS, d));

  // Which holds more?
  {
    let r: number, h: number, l: number, w: number, hb: number, V1: number, V2: number;
    const [gapMin, gapMax] = d === 1 ? [0.25, 1] : d === 2 ? [0.1, 0.4] : [0.04, 0.2];
    do {
      r = randInt(2, 5);
      h = randInt(5, 15);
      l = randInt(3, 10);
      w = randInt(3, 10);
      hb = randInt(5, 15);
      V1 = (314 * r * r * h) / 100;
      V2 = l * w * hb;
    } while (Math.abs(V1 - V2) / Math.max(V1, V2) < gapMin || Math.abs(V1 - V2) / Math.max(V1, V2) > gapMax);
    const right = V1 > V2 ? "The can" : "The box";
    qs.push(
      textChoice(
        "Which container holds more? (Use 3.14 for π.)",
        right,
        [right === "The can" ? "The box" : "The can", "They hold the same amount"],
        `Can: 3.14 × ${r} × ${r} × ${h} = ${fmt(V1)} cm³. Box: ${l} × ${w} × ${hb} = ${V2} cm³. ${right} holds more.`,
        {
          type: "table",
          headers: ["Container", "Shape", "Size"],
          rows: [
            ["Can", "Cylinder", `r = ${r} cm, h = ${h} cm`],
            ["Box", "Rectangular prism", `${l} cm × ${w} cm × ${hb} cm`],
          ],
        },
      ),
    );
  }

  // Capacity.
  if (d === 1) {
    const l = randInt(2, 10);
    const w = randInt(2, 10);
    const h = randInt(2, 10);
    qs.push(
      typed(
        `1 cm³ holds 1 mL. How many millilitres of water fill a box ${l} cm × ${w} cm × ${h} cm?`,
        fmt(l * w * h),
        `Volume: ${l} × ${w} × ${h} = ${l * w * h} cm³, and each cm³ holds 1 mL, so ${l * w * h} mL.`,
        "decimal",
        { suffix: "mL" },
      ),
    );
  } else if (d === 2) {
    const l = 5 * randInt(2, 8);
    const w = 5 * randInt(2, 8);
    const h = 5 * randInt(2, 8);
    const V = l * w * h;
    qs.push(
      typed(
        `1000 cm³ holds 1 L. How many litres of water fill a fish tank ${l} cm × ${w} cm × ${h} cm?`,
        fmt(V / 1000),
        `Volume: ${l} × ${w} × ${h} = ${V} cm³. Divide by 1000 to change to litres: ${fmt(V / 1000)} L.`,
        "decimal",
        { suffix: "L", visual: { type: "shape", shape: "rectangular-prism" } },
      ),
    );
  } else {
    const r = pick([5, 10, 15]);
    const h = randInt(10, 40);
    const p = piAnswer((r * r * h) / 1000);
    qs.push(
      typed(
        `A cylindrical water jug has a radius of ${r} cm and a height of ${h} cm. How many litres does it hold? (1000 cm³ = 1 L.) ${ROUND_NOTE}`,
        p.answer,
        `V = 3.14 × ${r} × ${r} × ${h} = ${fmt((314 * r * r * h) / 100)} cm³. Divide by 1000: ${fmt(p.exact)} L, or about ${p.answer} L.`,
        "decimal",
        { accept: p.accept, suffix: "L", visual: { type: "shape", shape: "cylinder" } },
      ),
    );
  }

  return shuffle(qs);
}

// ---------- 11. Circle Graphs ----------

const SURVEYS = [
  { title: "How students get to school", cats: ["Walk", "Bus", "Car", "Bike"] },
  { title: "Favourite sport", cats: ["Soccer", "Hockey", "Basketball", "Swimming"] },
  { title: "Favourite fruit", cats: ["Apples", "Bananas", "Grapes", "Mangoes"] },
  { title: "Favourite season", cats: ["Spring", "Summer", "Fall", "Winter"] },
  { title: "Favourite pet", cats: ["Dogs", "Cats", "Fish", "Birds"] },
];

/** Four different percents, each a multiple of `unit`, that add to 100. */
function splitPercents(unit: number): number[] {
  const slots = 100 / unit;
  for (let tries = 0; tries < 50; tries++) {
    const cuts = sample(range(1, slots - 1), 3).sort((a, b) => a - b);
    const marks = [...cuts, slots];
    const parts = marks.map((c, i) => (c - (i ? marks[i - 1] : 0)) * unit);
    if (new Set(parts).size === 4) return parts;
  }
  return shuffle([10, 20, 30, 40]);
}

const CIRCLE_GRAPH_CONCEPTS: Concept[] = [
  {
    levels: [1, 2, 3],
    prompt: "Which data would be best shown in a circle graph?",
    right: "How 30 students split among 4 favourite sports",
    wrong: ["A puppy's mass each month for a year", "The daily high temperature for two weeks", "The height of each of 5 trees"],
    hint: "Circle graphs show the parts of one whole. Data that changes over time fits a line graph better.",
  },
  {
    levels: [1, 2],
    prompt: "In a circle graph, all the sectors together add up to…",
    right: "100%, or 360°",
    wrong: ["50%, or 180°", "100%, or 180°", "The number of categories"],
    hint: "The whole circle is the whole data set: 100% of the data and a full 360° turn.",
  },
  {
    levels: [1],
    prompt: "A sector takes up one quarter of a circle graph. What percent is it?",
    right: "25%",
    wrong: ["4%", "40%", "75%"],
    hint: "One quarter is 1/4, and 1/4 = 25/100 = 25%.",
  },
  {
    levels: [2, 3],
    prompt: "Why might you choose a circle graph instead of a bar graph?",
    right: "To compare each part with the whole",
    wrong: ["To show how something changes over time", "To show amounts that don't make up one whole", "To show the order events happened in"],
    hint: "A circle graph's strength is showing what fraction of the whole each category is.",
  },
  {
    levels: [3],
    prompt: "In Class A (20 students) and Class B (30 students), 50% of each class walks to school. What can you say?",
    right: "More students walk in Class B",
    wrong: ["The same number of students walk in each class", "More students walk in Class A", "You can't compare the classes at all"],
    hint: "50% of 20 is 10, but 50% of 30 is 15. The same percent of a bigger group is more people.",
  },
];

function circleGraphs(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];
  const unit = d === 1 ? 10 : 5;

  // Percent → number of people.
  {
    const s = pick(SURVEYS);
    const pcts = splitPercents(unit);
    const N = d === 1 ? pick([100, 200]) : 20 * randInt(d === 2 ? 2 : 3, d === 2 ? 15 : 20);
    const table: Visual = { type: "table", title: `${s.title} (${N} students)`, headers: ["Choice", "Percent"], rows: s.cats.map((c, i) => [c, `${pcts[i]}%`]) };
    if (d < 3) {
      const i = randInt(0, 3);
      const n = (N * pcts[i]) / 100;
      qs.push(
        typed(
          `A circle graph shows these survey results. How many of the ${N} students chose ${s.cats[i]}?`,
          fmt(n),
          `${pcts[i]}% of ${N} = ${fmt(pcts[i] / 100)} × ${N} = ${fmt(n)} students.`,
          "integer",
          { visual: table },
        ),
      );
    } else {
      const [i, j] = sample([0, 1, 2, 3], 2);
      const n = (N * (pcts[i] + pcts[j])) / 100;
      qs.push(
        typed(
          `A circle graph shows these survey results. How many of the ${N} students chose ${s.cats[i]} or ${s.cats[j]}?`,
          fmt(n),
          `Add the percents first: ${pcts[i]}% + ${pcts[j]}% = ${pcts[i] + pcts[j]}%. Then ${pcts[i] + pcts[j]}% of ${N} = ${fmt(n)} students.`,
          "integer",
          { visual: table },
        ),
      );
    }
  }

  // Sector angles.
  if (d < 3) {
    const p = d === 1 ? pick([10, 20, 25, 40, 50, 75]) : 5 * randInt(1, 19);
    const deg = (360 * p) / 100;
    qs.push(
      typed(
        `In a circle graph, how many degrees is the sector for a category that is ${p}% of the data?`,
        fmt(deg),
        `A full circle is 360°. ${p}% of 360° = ${fmt(p / 100)} × 360 = ${fmt(deg)}°.`,
        "decimal",
        { suffix: "°", visual: { type: "fraction", numerator: p / 5, denominator: 20, shape: "circle" } },
      ),
    );
  } else {
    const N = pick([20, 24, 30, 36, 40, 45, 60, 72, 90, 120]);
    const k = randInt(1, N - 1);
    const cat = pick(pick(SURVEYS).cats);
    const deg = (360 * k) / N;
    qs.push(
      typed(
        `In a survey, ${k} of ${N} students chose ${cat}. How many degrees should the ${cat} sector of a circle graph be?`,
        fmt(deg),
        `${cat} is ${k}/${N} of the data, so it gets ${k}/${N} of 360°: ${k} × 360 ÷ ${N} = ${fmt(deg)}°.`,
        "decimal",
        { suffix: "°", visual: N <= 24 ? { type: "fraction", numerator: k, denominator: N, shape: "circle" } : undefined },
      ),
    );
  }

  // Missing sector.
  {
    const s = pick(SURVEYS);
    const pcts = splitPercents(unit);
    const blank = randInt(0, 3);
    if (d < 3) {
      const known = pcts.filter((_, i) => i !== blank);
      qs.push(
        typed(
          `The table lists the sectors of a circle graph. What percent is missing?`,
          fmt(pcts[blank]),
          `All the sectors add up to 100%. ${known.join(" + ")} = ${known.reduce((a, b) => a + b, 0)}, and 100 − ${known.reduce((a, b) => a + b, 0)} = ${pcts[blank]}%.`,
          "decimal",
          { suffix: "%", visual: { type: "table", title: s.title, headers: ["Choice", "Percent"], rows: s.cats.map((c, i) => [c, i === blank ? "?" : `${pcts[i]}%`]) } },
        ),
      );
    } else {
      const degs = pcts.map((p) => (360 * p) / 100);
      const known = degs.filter((_, i) => i !== blank);
      const sum = known.reduce((a, b) => a + b, 0);
      qs.push(
        typed(
          `The table lists the sector angles of a circle graph. What angle is missing?`,
          fmt(degs[blank]),
          `All the sectors make a full turn of 360°. ${known.join(" + ")} = ${sum}, and 360 − ${sum} = ${degs[blank]}°.`,
          "decimal",
          { suffix: "°", visual: { type: "table", title: s.title, headers: ["Choice", "Angle"], rows: s.cats.map((c, i) => [c, i === blank ? "?" : `${degs[i]}°`]) } },
        ),
      );
    }
  }

  // Shaded sector → percent.
  {
    const den = pick(d === 1 ? [2, 4, 5, 10] : d === 2 ? [4, 5, 10, 20] : [8, 16, 20]);
    const n = randInt(1, den - 1);
    const pct = (n * 100) / den;
    const cat = pick(pick(SURVEYS).cats);
    qs.push(
      numQ(
        `The shaded sector of this circle graph shows the students who chose ${cat}. What percent is that?`,
        pct,
        [100 - pct, n, 100 / den, pct + 10],
        `The circle is cut into ${den} equal parts and ${n} are shaded: ${n}/${den} = ${fmt(n / den)} = ${fmt(pct)}%.`,
        { type: "fraction", numerator: n, denominator: den, shape: "circle" },
        { unit: "%", min: 0.5, step: 5 },
      ),
    );
  }

  // Angle → percent.
  {
    const p = d === 1 ? pick([10, 20, 25, 50, 75]) : d === 2 ? 5 * randInt(1, 19) : pick(range(1, 99).filter((x) => x % 5 !== 0));
    const deg = (360 * p) / 100;
    const cat = pick(pick(SURVEYS).cats);
    qs.push(
      numQ(
        `In a circle graph, the "${cat}" sector has an angle of ${fmt(deg)}°. What percent of the data does that sector show?`,
        p,
        [100 - p, p + 10, deg, p - 10],
        `Divide by the full turn: ${fmt(deg)} ÷ 360 = ${fmt(p / 100)} = ${p}%.`,
        { type: "angle", degrees: deg },
        { unit: "%", min: 1, step: 5 },
      ),
    );
  }

  // Concepts.
  qs.push(conceptQ(CIRCLE_GRAPH_CONCEPTS, d));

  // Comparing two sectors.
  {
    const s = pick(SURVEYS);
    const pcts = splitPercents(unit);
    const N = d === 1 ? 100 : 20 * randInt(3, 20);
    const [i, j] = sample([0, 1, 2, 3], 2).sort((a, b) => pcts[b] - pcts[a]);
    const diff = (N * (pcts[i] - pcts[j])) / 100;
    qs.push(
      typed(
        `${N} students answered this survey. How many more chose ${s.cats[i]} than ${s.cats[j]}?`,
        fmt(diff),
        `${s.cats[i]}: ${pcts[i]}% of ${N} = ${(N * pcts[i]) / 100}. ${s.cats[j]}: ${pcts[j]}% of ${N} = ${(N * pcts[j]) / 100}. Difference: ${fmt(diff)}. (Or ${pcts[i] - pcts[j]}% of ${N}.)`,
        "integer",
        { visual: { type: "table", title: s.title, headers: ["Choice", "Percent"], rows: s.cats.map((c, k) => [c, `${pcts[k]}%`]) } },
      ),
    );
  }

  // Counts → percent, or part → whole.
  if (d === 1) {
    const N = pick([10, 20, 25, 50]);
    const k = randInt(1, N - 1);
    const cat = pick(pick(SURVEYS).cats);
    qs.push(
      typed(
        `In a survey, ${k} of ${N} students chose ${cat}. What percent of the circle graph is the ${cat} sector?`,
        fmt((k * 100) / N),
        `${k}/${N} = ${k * (100 / N)}/100 = ${fmt((k * 100) / N)}%.`,
        "decimal",
        { suffix: "%" },
      ),
    );
  } else {
    const p = pick([5, 10, 15, 20, 25, 30, 40]);
    const stepT = 100 / gcd(p, 100);
    let T: number;
    do T = stepT * randInt(1, Math.floor(400 / stepT));
    while (T < 20);
    const part = (T * p) / 100;
    const cat = pick(pick(SURVEYS).cats);
    qs.push(
      typed(
        `In a circle graph of survey results, the ${cat} sector is ${p}% and stands for ${part} students. How many students were surveyed in all?`,
        fmt(T),
        `${p}% of the total is ${part}, so the total is ${part} ÷ ${fmt(p / 100)} = ${T}. Check: ${p}% of ${T} = ${part}.`,
        "integer",
      ),
    );
  }

  return shuffle(qs);
}

// ---------- 12. Probability ----------

const SPIN_COLOURS = [
  { name: "red", hex: "#ef4444" },
  { name: "blue", hex: "#3b82f6" },
  { name: "green", hex: "#22c55e" },
  { name: "yellow", hex: "#facc15" },
  { name: "purple", hex: "#8b5cf6" },
  { name: "orange", hex: "#f97316" },
];

interface Ev {
  setup: string;
  text: string;
  count: number;
  total: number;
  segments?: string[];
}

const DIE_EVENTS = [
  { text: "a 6", count: 1 },
  { text: "a 1", count: 1 },
  { text: "an even number", count: 3 },
  { text: "an odd number", count: 3 },
  { text: "a number greater than 4", count: 2 },
  { text: "a number less than 3", count: 2 },
  { text: "a multiple of 3", count: 2 },
];

const coinEv = (): Ev => ({ setup: "flip a coin", text: pick(["heads", "tails"]), count: 1, total: 2 });

function dieEv(simple: boolean): Ev {
  const e = pick(simple ? DIE_EVENTS.filter((x) => x.count === 1) : DIE_EVENTS);
  return { setup: "roll a standard die (1 to 6)", text: e.text, count: e.count, total: 6 };
}

function spinnerEv(k: number): Ev {
  const cols = sample(SPIN_COLOURS, k);
  const target = pick(cols);
  return { setup: `spin a spinner with ${k} equal sections`, text: target.name, count: 1, total: k, segments: cols.map((c) => c.hex) };
}

const PROBABILITY_CONCEPTS: Concept[] = [
  {
    levels: [1, 2, 3],
    prompt: "As you do more and more trials, the experimental probability usually…",
    right: "gets closer to the theoretical probability",
    wrong: ["gets farther from the theoretical probability", "always equals exactly 1/2", "stops changing after 10 trials"],
    hint: "Small experiments can be lopsided. With many trials, results tend to settle near the theoretical probability.",
  },
  {
    levels: [1, 2],
    prompt: "Two events are independent when…",
    right: "the result of one doesn't change the chances of the other",
    wrong: ["they always happen at the same time", "they can never both happen", "one event causes the other"],
    hint: "Flipping a coin doesn't affect a die roll. That's what independent means.",
  },
  {
    levels: [1],
    prompt: "You roll a die and flip a coin. Does rolling a 6 change the chance of getting heads?",
    right: "No, it's still 1/2",
    wrong: ["Yes, heads becomes more likely", "Yes, heads becomes less likely", "No, but it becomes 1/6"],
    hint: "The coin can't \"see\" the die. The events are independent, so P(heads) stays 1/2.",
  },
  {
    levels: [2, 3],
    prompt: "Which pair of events is independent?",
    right: "Flipping a coin, then rolling a die",
    wrong: [
      "Taking a marble from a bag, then taking another without putting the first back",
      "Drawing a card, then drawing a second card without replacing the first",
      "Picking a team captain, then picking a co-captain from the students left",
    ],
    hint: "When the first item isn't put back, the second pick has different chances, so those events depend on each other.",
  },
  {
    levels: [2, 3],
    prompt: "Sam flips a coin 10 times and gets 7 heads. What does this show?",
    right: "Experimental results can differ from the theoretical probability",
    wrong: ["The coin will land heads 70% of the time from now on", "The next flip is more likely to be tails", "The theoretical probability of heads is 7/10"],
    hint: "Theoretical P(heads) is still 1/2. Ten flips is a small experiment, so 7 heads isn't surprising, and the coin has no memory.",
  },
  {
    levels: [3],
    prompt: "A spinner landed on red 30 times in 100 spins. The theoretical probability of red is 1/4. Which statement is true?",
    right: "The experimental probability (30%) is a bit higher than the theoretical (25%)",
    wrong: ["The spinner must be broken", "The experimental probability is 1/4", "The theoretical probability should change to 30%"],
    hint: "30/100 = 30% and 1/4 = 25%. Experiments often differ a little from theory.",
  },
];

function probability(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const qs: Question[] = [];

  // Counting outcomes.
  {
    let A: Ev, B: Ev, prompt: string;
    if (d === 1) {
      A = coinEv();
      B = pick([dieEv(true), spinnerEv(randInt(3, 4))]);
      prompt = `You ${A.setup} and ${B.setup}. How many different outcomes are possible?`;
    } else if (d === 2) {
      A = dieEv(true);
      B = spinnerEv(randInt(3, 5));
      prompt = `You ${A.setup} and ${B.setup}. How many different outcomes are possible?`;
    } else {
      A = dieEv(true);
      B = chance(0.5) ? { ...dieEv(true), setup: "roll a second die" } : spinnerEv(randInt(5, 6));
      prompt = `You ${A.setup} and ${B.setup}. How many different outcomes are possible?`;
    }
    const seg = A.segments ?? B.segments;
    qs.push(
      typed(
        prompt,
        fmt(A.total * B.total),
        `Each of the ${A.total} results of the first event can pair with each of the ${B.total} results of the second: ${A.total} × ${B.total} = ${A.total * B.total} outcomes. A tree diagram or table shows them all.`,
        "integer",
        { visual: seg ? { type: "spinner", segments: seg } : { type: "emoji", emoji: "🎲" } },
      ),
    );
  }

  // Theoretical probability of two events.
  {
    let A: Ev, B: Ev;
    if (d === 1) {
      A = coinEv();
      B = pick([dieEv(true), spinnerEv(4)]);
    } else if (d === 2) {
      A = coinEv();
      B = dieEv(false);
    } else {
      A = dieEv(false);
      B = spinnerEv(randInt(3, 6));
    }
    const num = A.count * B.count;
    const den = A.total * B.total;
    const ans = fraction(num, den);
    const raw = `${num}/${den}`;
    qs.push(
      typed(
        `You ${A.setup} and ${B.setup}. What is the probability of getting ${A.text} and ${B.text}? Give a fraction.`,
        ans,
        `The events are independent, so multiply: P(${A.text}) × P(${B.text}) = ${A.count}/${A.total} × ${B.count}/${B.total} = ${raw}${raw === ans ? "" : ` = ${ans}`}.`,
        "fraction",
        { accept: [raw], visual: B.segments ? { type: "spinner", segments: B.segments } : undefined },
      ),
    );
  }

  // Experimental probability from a table.
  {
    const N = d === 1 ? pick([20, 40]) : d === 2 ? pick([40, 50, 60]) : pick([80, 100, 120]);
    const noise = Math.max(1, Math.round(N / 20));
    const hh = Math.round(N / 4) + randInt(-noise, noise);
    const mixed = Math.round(N / 2) + randInt(-2 * noise, 2 * noise);
    const tt = N - hh - mixed;
    const outcomes = [
      { label: "Two heads", count: hh },
      { label: "One head, one tail", count: mixed },
      { label: "Two tails", count: tt },
    ];
    const o = pick(outcomes);
    const ans = fraction(o.count, N);
    qs.push(
      typed(
        `Two coins were flipped together ${N} times. Based on these results, what is the experimental probability of "${o.label.toLowerCase()}"? Give a fraction.`,
        ans,
        `Experimental probability = times it happened ÷ total trials = ${o.count}/${N}${ans === `${o.count}/${N}` ? "" : ` = ${ans}`}.`,
        "fraction",
        { accept: [`${o.count}/${N}`], visual: { type: "table", title: `${N} flips of two coins`, headers: ["Result", "Count"], rows: outcomes.map((x) => [x.label, x.count]) } },
      ),
    );
  }

  // Expected results.
  {
    const roundTrials = (pd: number): number => {
      const step = (pd * 10) / gcd(pd, 10);
      const options = range(1, 30)
        .map((k) => k * step)
        .filter((n) => n >= 20 && n <= 300);
      return options.length ? pick(options) : pd * randInt(3, 10);
    };
    if (d === 1) {
      const side = pick(["heads", "tails"]);
      const N = roundTrials(4);
      qs.push(
        typed(
          `Suppose you flip two coins together, and repeat this ${N} times. About how many times would you expect both coins to land ${side}?`,
          fmt(N / 4),
          `P(both ${side}) = 1/2 × 1/2 = 1/4. Expected: 1/4 × ${N} = ${N / 4} times.`,
          "integer",
        ),
      );
    } else {
      const A = d === 2 ? coinEv() : dieEv(false);
      const B = d === 2 ? dieEv(false) : spinnerEv(randInt(3, 5));
      const [pn, pd] = fraction(A.count * B.count, A.total * B.total).split("/").map(Number);
      const N = roundTrials(pd);
      const E = (N * pn) / pd;
      qs.push(
        typed(
          `Suppose you ${A.setup} and ${B.setup}, and repeat this ${N} times. About how many times would you expect to get ${A.text} and ${B.text}?`,
          fmt(E),
          `P(${A.text} and ${B.text}) = ${A.count}/${A.total} × ${B.count}/${B.total} = ${pn}/${pd}. Expected: ${pn}/${pd} × ${N} = ${E} times.`,
          "integer",
          { visual: B.segments ? { type: "spinner", segments: B.segments } : undefined },
        ),
      );
    }
  }

  // Spinner and coin.
  {
    const k = d === 3 ? pick([4, 6]) : randInt(3, 5);
    const c = d === 3 ? randInt(1, 2) : 1;
    const cols = sample(SPIN_COLOURS, k - c + 1);
    const target = cols[0];
    const segments = [...Array.from({ length: c }, () => target.hex), ...cols.slice(1).map((x) => x.hex)];
    const side = pick(["heads", "tails"]);
    const right = fraction(c, 2 * k);
    const pSpin = fraction(c, k);
    const value = (f: string) => {
      const [a, b] = f.split("/").map(Number);
      return a / b;
    };
    const candidates = [pSpin, fraction(2 * c + k, 2 * k), `${c + 1}/${k + 2}`, `1/${2 * k}`, `${c}/${k + 2}`, `1/${k + 2}`];
    const seen = new Set<number>([value(right)]);
    const wrong = candidates
      .filter((o) => {
        const v = value(o);
        if (v >= 1 || seen.has(v)) return false;
        seen.add(v);
        return true;
      })
      .slice(0, 3);
    qs.push(
      textChoice(
        `You spin this spinner (${k} equal sections) and flip a coin. What is P(${target.name} and ${side})?`,
        right,
        wrong,
        `P(${target.name}) = ${c}/${k}${pSpin === `${c}/${k}` ? "" : ` = ${pSpin}`} and P(${side}) = 1/2. The events are independent, so multiply: ${c}/${k} × 1/2 = ${c}/${2 * k}${right === `${c}/${2 * k}` ? "" : ` = ${right}`}.`,
        { type: "spinner", segments },
      ),
    );
  }

  // Concepts.
  qs.push(conceptQ(PROBABILITY_CONCEPTS, d));

  // Reading an outcome table.
  if (d < 3) {
    const faces = [1, 2, 3, 4, 5, 6];
    const asks = [
      { text: "heads and an even number", cells: ["H2", "H4", "H6"] },
      { text: "tails and a number greater than 4", cells: ["T5", "T6"] },
      { text: "heads and a number less than 3", cells: ["H1", "H2"] },
      { text: "tails and an odd number", cells: ["T1", "T3", "T5"] },
      { text: "a 5 or a 6 (with either coin side)", cells: ["H5", "H6", "T5", "T6"] },
      { text: "heads and a multiple of 3", cells: ["H3", "H6"] },
    ];
    const a = pick(asks);
    qs.push(
      typed(
        `The table shows every outcome of flipping a coin (H or T) and rolling a die. How many outcomes show ${a.text}?`,
        fmt(a.cells.length),
        `Find the matching cells: ${a.cells.join(", ")}. That's ${a.cells.length} of the 12 outcomes.`,
        "integer",
        { visual: { type: "table", headers: ["Coin", ...faces.map(String)], rows: ["H", "T"].map((s) => [s, ...faces.map((f) => `${s}${f}`)]) } },
      ),
    );
  } else {
    const s = randInt(2, 12);
    const count = 6 - Math.abs(s - 7);
    const ans = fraction(count, 36);
    qs.push(
      typed(
        `The table shows every sum when you roll two dice. What is the probability of rolling a sum of ${s}? Give a fraction.`,
        ans,
        `There are 36 equally likely outcomes. Count the cells showing ${s}: ${count}. P(sum of ${s}) = ${count}/36${ans === `${count}/36` ? "" : ` = ${ans}`}.`,
        "fraction",
        {
          accept: [`${count}/36`],
          visual: { type: "table", headers: ["+", "1", "2", "3", "4", "5", "6"], rows: [1, 2, 3, 4, 5, 6].map((r) => [r, ...[1, 2, 3, 4, 5, 6].map((c) => r + c)]) },
        },
      ),
    );
  }

  // Experimental probability as a percent.
  {
    const name = pick(NAMES);
    const N = d === 1 ? 100 : d === 2 ? pick([20, 25, 50, 200]) : pick([40, 250, 500]);
    const spread = Math.max(1, Math.round(N / 20));
    const k = Math.max(1, Math.round(N / 4) + randInt(-spread, spread));
    const pct = (k * 100) / N;
    qs.push(
      typed(
        `Two spinners are each half red and half blue. ${name} spun both ${N} times, and both landed on red ${k} times. What is the experimental probability of "both red" as a percent?`,
        fmt(pct),
        `Experimental probability = ${k}/${N} = ${fmt(k / N)} = ${fmt(pct)}%. Compare it with the theoretical probability: 1/2 × 1/2 = 1/4 = 25%.`,
        "decimal",
        { suffix: "%", visual: { type: "spinner", segments: ["#ef4444", "#3b82f6"] } },
      ),
    );
  }

  return shuffle(qs);
}

// ---------- Course ----------

export const course: Course = {
  grade: "7",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Decimals, fractions, and percents are used to represent and describe parts and wholes of numbers.",
      "Computational fluency and flexibility with numbers extend to operations with integers and decimals.",
      "Linear relations can be represented in many connected ways to identify regularities and make generalizations.",
      "The constant ratio between the circumference and diameter of circles can be used to describe, measure, and compare spatial relationships.",
      "Data from circle graphs can be used to illustrate proportion and to make comparisons among categories.",
    ],
  },
  units: [
    {
      id: "integer-add-subtract",
      title: "Add & Subtract Integers",
      emoji: "🌡️",
      blurb: "Positives, negatives and zero pairs",
      standards: { "ca-bc": "Operations with integers: addition and subtraction" },
      parentNote:
        "Adding and subtracting positive and negative numbers with number lines, temperatures and elevations, including the idea that subtracting a number is the same as adding its opposite.",
      generate: integerAddSub,
    },
    {
      id: "integer-multiply-divide",
      title: "Multiply & Divide Integers",
      emoji: "✖️",
      blurb: "Sign rules, facts and BEDMAS",
      standards: {
        "ca-bc": "Multiplication and division facts to 100; operations with integers: multiplication, division and order of operations",
      },
      parentNote:
        "Keeping multiplication and division facts fluent, applying the sign rules for negative numbers, and evaluating expressions in the right order (brackets, then × and ÷, then + and −).",
      generate: integerMulDiv,
    },
    {
      id: "decimal-operations",
      title: "Decimal Operations",
      emoji: "🧮",
      blurb: "Add, subtract, multiply, divide decimals",
      standards: { "ca-bc": "Operations with decimals: addition, subtraction, multiplication, division and order of operations" },
      parentNote:
        "All four operations with decimals, estimating to check answers, ordering decimals, and money problems such as unit prices.",
      generate: decimalOps,
    },
    {
      id: "fractions-decimals-percents",
      title: "Fractions, Decimals & Percents",
      emoji: "💯",
      blurb: "Convert, compare and use ratios",
      standards: { "ca-bc": "Relationships between decimals, fractions, ratios and percents" },
      parentNote:
        "Moving between fractions, decimals (including repeating decimals) and percents, finding a percent of a number, and simplifying and scaling ratios.",
      generate: fractionsDecimalsPercents,
    },
    {
      id: "tax-tips-discounts",
      title: "Tax, Tips & Discounts",
      emoji: "🏷️",
      blurb: "Percents with real money",
      standards: { "ca-bc": "Financial literacy: financial percentage (sales tax, discounts, tips and simple interest)" },
      parentNote:
        "Everyday money percents: sale prices, sales tax (with the rates given), restaurant tips, comparing deals and simple interest on savings.",
      generate: financialPercent,
    },
    {
      id: "coordinates-transformations",
      title: "Coordinates & Transformations",
      emoji: "🗺️",
      blurb: "Plot, slide, flip and turn",
      standards: { "ca-bc": "Cartesian coordinates and graphing; combinations of transformations" },
      parentNote:
        "Reading and plotting points in all four quadrants, and describing translations, reflections, 180° rotations and combinations of them.",
      generate: coordinatesTransformations,
    },
    {
      id: "linear-relations",
      title: "Linear Relations",
      emoji: "📈",
      blurb: "Patterns in tables and graphs",
      standards: { "ca-bc": "Discrete linear relationships, using expressions, tables and graphs" },
      parentNote:
        "Finding the rule behind growing patterns, writing expressions like 3n + 2, and connecting tables, graphs and real situations such as rental costs.",
      generate: linearRelations,
    },
    {
      id: "two-step-equations",
      title: "Two-Step Equations",
      emoji: "⚖️",
      blurb: "Undo, undo, solve for x",
      standards: { "ca-bc": "Two-step equations with whole-number coefficients, constants and solutions" },
      parentNote:
        "Solving equations like 3x + 5 = 26 by undoing each step on both sides, writing equations from word problems and checking solutions.",
      generate: twoStepEquations,
    },
    {
      id: "circles",
      title: "Circles",
      emoji: "⭕",
      blurb: "Circumference, area and π",
      standards: { "ca-bc": "Circumference and area of circles" },
      parentNote:
        "Using radius, diameter and π (about 3.14) to find the distance around a circle and the area inside it, including real objects like wheels and pizzas.",
      generate: circles,
    },
    {
      id: "volume",
      title: "Volume",
      emoji: "📦",
      blurb: "Boxes, cubes and cylinders",
      standards: { "ca-bc": "Volume of rectangular prisms and cylinders" },
      parentNote:
        "Finding volume as base area × height for boxes and cylinders, working backwards to a missing dimension, and linking cm³ to millilitres and litres.",
      generate: volume,
    },
    {
      id: "circle-graphs",
      title: "Circle Graphs",
      emoji: "🥧",
      blurb: "Percents and angles of a whole",
      standards: { "ca-bc": "Circle graphs" },
      parentNote:
        "Reading and building circle graphs: turning percents into numbers of people and sector angles (out of 360°), and comparing categories.",
      generate: circleGraphs,
    },
    {
      id: "probability",
      title: "Probability",
      emoji: "🎲",
      blurb: "Chances of two events",
      standards: { "ca-bc": "Experimental probability with two independent events" },
      parentNote:
        "Listing outcomes of two independent events (like a coin and a die), finding theoretical probabilities by multiplying, and comparing them with experimental results.",
      generate: probability,
    },
  ],
};
