import { chance, pick, randInt, sample, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, Visual } from "../../types";
import { NAMES, ROUND_NOTE, fmt, fracText, gcd, levelOf, lin, numQ, piAnswer, sup, textQ, typed, type Concept, type Level } from "../kit";

// Grade 9 maths. Expressions are built from whole numbers and formatted by helpers, so
// distractors are generated from the same numbers and can be checked against the answer.

/** `count` different questions from a concept bank, offered at this level. */
function conceptsQ(bank: Concept[], level: Level, count: number): Question[] {
  return sample(
    bank.filter((b) => b.levels.includes(level)),
    count,
  ).map((c) => textChoice(c.prompt, c.right, c.wrong, c.hint));
}

const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
const minus = (n: number): string => (n < 0 ? `−${-n}` : String(n));
/** Signed text with brackets for use inside an expression: -3 → "(−3)". */
const paren = (n: number): string => (n < 0 ? `(−${-n})` : String(n));

// ---------- 1. Rational Numbers ----------

function rationalOrder(level: number): OrderQuestion {
  const pool: { value: number; label: string }[] = [
    { value: -1.5, label: "−1.5" },
    { value: -3 / 4, label: "−3/4" },
    { value: -0.2, label: "−0.2" },
    { value: 0.25, label: "1/4" },
    { value: 0.6, label: "0.6" },
    { value: 5 / 4, label: "5/4" },
    { value: 1.75, label: "1.75" },
    { value: 2 / 3, label: "2/3" },
    { value: -2, label: "−2" },
  ];
  const chosen = sample(pool, level + 2).sort((a, b) => a.value - b.value);
  return {
    kind: "order",
    prompt: "Put these rational numbers in order from least to greatest.",
    hint: `Change each to a decimal if it helps: ${chosen.map((c) => `${c.label} ≈ ${fmt(Number(c.value.toFixed(2)))}`).join(", ")}. Negative numbers farther from zero are smaller.`,
    items: chosen.map((c, i) => ({ id: `r${i}`, label: c.label })),
  };
}

const RATIONAL_CONCEPTS: Concept[] = [
  { levels: [1, 2, 3], prompt: "Which fraction is a repeating decimal?", right: "1/3", wrong: ["1/4", "3/8", "7/20"], hint: "1 ÷ 3 = 0.333… and never ends. Fractions with denominators 4, 8 and 20 end (terminate)." },
  { levels: [2, 3], prompt: "Which fraction gives a non-terminating (repeating) decimal?", right: "5/12", wrong: ["3/5", "7/8", "9/20"], hint: "A fraction in lowest terms ends only if its denominator's prime factors are just 2s and 5s. 12 has a factor of 3." },
  { levels: [1, 2, 3], prompt: "Which number is NOT a rational number?", right: "π", wrong: ["0.25", "−7", "1/3"], hint: "A rational number can be written as a fraction of two integers. π cannot, because its decimal never ends or repeats." },
  { levels: [1, 2], prompt: "What is the opposite of −3.5?", right: "3.5", wrong: ["−3.5", "−0.35", "0"], hint: "The opposite has the same size but the other sign." },
  { levels: [1, 2, 3], prompt: "What is the absolute value of −7/2?", right: "7/2", wrong: ["−7/2", "2/7", "−2/7"], hint: "Absolute value is the distance from 0, so it is never negative." },
  { levels: [2, 3], prompt: "Which is between −1/2 and 0?", right: "−0.25", wrong: ["−0.75", "0.25", "−1.25"], hint: "Picture a number line: −0.25 lies between −0.5 and 0." },
];

function rationalNumbers(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // Add or subtract fractions with a negative.
  {
    const dens = [2, 3, 4, 5, 6, 8];
    const d1 = pick(dens);
    let d2 = pick(dens);
    if (d2 === d1) d2 = d1 === 2 ? 3 : 2;
    const n1 = randInt(1, d1 - 1) * (chance(0.5) ? -1 : 1);
    const n2 = randInt(1, d2 - 1);
    const L = lcm(d1, d2);
    const num = (n1 * L) / d1 + (n2 * L) / d2;
    const wrongs = [
      fracText(n1 + n2, d1 + d2),
      fracText((n1 * L) / d1 - (n2 * L) / d2, L),
      fracText(-num, L),
      fracText(num + 1, L),
    ];
    const right = num === 0 ? "0" : fracText(num, L);
    if (num !== 0) {
      qs.push(
        textQ(
          `${minus(n1)}/${d1} + ${n2}/${d2} = ?`,
          right,
          wrongs,
          `Use the common denominator ${L}: ${(n1 * L) / d1}/${L} + ${(n2 * L) / d2}/${L} = ${num}/${L}, which is ${right} in lowest terms.`,
        ),
      );
    }
  }

  // Multiply or divide fractions with signs.
  {
    const a = randInt(1, 5);
    const b = randInt(2, 7);
    const c = randInt(1, 5);
    const d = randInt(2, 7);
    const neg = chance(0.5);
    const divide = chance(0.5);
    const numA = neg ? -a : a;
    const num = divide ? numA * d : numA * c;
    const den = divide ? b * c : b * d;
    const sym = divide ? "÷" : "×";
    const right = fracText(num, den);
    qs.push(
      textQ(
        `${minus(numA)}/${b} ${sym} ${c}/${d} = ?`,
        right,
        [fracText(-num, den), fracText(den, num), fracText(num + 1, den), fracText(num, den + 1)],
        divide
          ? `Multiply by the reciprocal: ${minus(numA)}/${b} × ${d}/${c} = ${minus(numA * d)}/${b * c}. A ${neg ? "negative ÷ positive is negative" : "positive ÷ positive is positive"}. Lowest terms: ${right}.`
          : `Multiply across: ${minus(numA)} × ${c} = ${minus(numA * c)} and ${b} × ${d} = ${b * d}. ${neg ? "A negative times a positive is negative" : "Positive times positive is positive"}. Lowest terms: ${right}.`,
      ),
    );
  }

  // Decimals with a positive answer (typed).
  {
    const a = randInt(11, 99) / 10;
    const b = randInt(11, 99) / 10;
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    qs.push(
      typed(
        `Calculate: ${fmt(big)} − ${fmt(small)} + ${fmt(small)} × 2`,
        fmt(Math.round((big - small + small * 2) * 100) / 100),
        `Multiply first: ${fmt(small)} × 2 = ${fmt(small * 2)}. Then ${fmt(big)} − ${fmt(small)} = ${fmt(Math.round((big - small) * 10) / 10)}, and add: ${fmt(Math.round((big - small + small * 2) * 100) / 100)}.`,
        "decimal",
      ),
    );
  }

  // Negative decimals.
  {
    const a = randInt(11, 89) / 10;
    let b = randInt(11, 89) / 10;
    if (b === a) b += 0.1;
    const sum = Math.round((-a + b) * 10) / 10;
    qs.push(
      numQ(
        `${minus(-a)} + ${fmt(Math.round(b * 10) / 10)} = ?`,
        sum,
        [-(a + b), a + b, -sum, sum + 0.1],
        a > b
          ? `Different signs: subtract the sizes, ${fmt(a)} − ${fmt(b)} = ${fmt(Math.round((a - b) * 10) / 10)}, and keep the sign of the number farther from zero (−${fmt(a)}). The answer is ${fmt(sum)}.`
          : `Different signs: subtract the sizes, ${fmt(b)} − ${fmt(a)} = ${fmt(sum)}. The positive number is farther from zero, so the answer is positive.`,
        undefined,
        { step: 0.1 },
      ),
    );
  }

  // Fraction → decimal (typed).
  {
    const d = pick([2, 4, 5, 8, 10, 20]);
    const n = randInt(1, d - 1);
    const dec = n / d;
    qs.push(
      typed(
        `Write ${n}/${d} as a decimal.`,
        fmt(dec),
        `Divide the numerator by the denominator: ${n} ÷ ${d} = ${fmt(dec)}.`,
        "decimal",
        { visual: { type: "fraction", numerator: n, denominator: d } },
      ),
    );
  }

  // Order of operations with integers (typed, checked by the equation visual).
  {
    const a = randInt(2, 9);
    const b = randInt(-9, -2);
    const c = randInt(2, 6);
    const d = randInt(2, 5);
    const expr = `${a} + ${paren(b)} × ${c} − ${d * c} ÷ ${d}`;
    const value = a + b * c - c;
    qs.push(
      typed(`What is the value of this expression? Remember BEDMAS.`, String(value), `Multiply and divide first: ${paren(b)} × ${c} = ${b * c} and ${d * c} ÷ ${d} = ${c}. Then ${a} + ${paren(b * c)} − ${c} = ${value}.`, "integer", {
        visual: { type: "equation", text: `${expr.replace(/−(\d)/g, "-$1")} = ?` },
      }),
    );
  }

  qs.push(rationalOrder(level), ...conceptsQ(RATIONAL_CONCEPTS, level, 1));
  return qs.slice(0, 10);
}

// ---------- 2. Exponent Laws ----------

const EXPONENT_CONCEPTS: Concept[] = [
  { levels: [1, 2, 3], prompt: "Any non-zero number to the power of 0 equals…", right: "1", wrong: ["0", "the number itself", "undefined"], hint: "a⁰ = 1 for any a ≠ 0, because a³ ÷ a³ = a⁰, and any number divided by itself is 1." },
  { levels: [2, 3], prompt: "What does 4⁻² mean?", right: "1/4²", wrong: ["−4²", "4 × (−2)", "−8"], hint: "A negative exponent means the reciprocal: 4⁻² = 1/4² = 1/16." },
  { levels: [1, 2], prompt: "In 3⁵, the number 5 is called the…", right: "exponent", wrong: ["base", "product", "coefficient"], hint: "The base (3) is the number being multiplied. The exponent (5) says how many times." },
];

function exponentLaws(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // Evaluate a power.
  {
    const base = randInt(2, level === 1 ? 5 : 9);
    const e = randInt(2, base > 5 ? 3 : 4);
    qs.push(typed(`What is ${base}${sup(e)}?`, String(base ** e), `${base}${sup(e)} = ${Array(e).fill(base).join(" × ")} = ${base ** e}.`, "number"));
  }

  // Negative base.
  {
    const base = randInt(2, 5);
    const e = pick([2, 3, 4]);
    const val = (-base) ** e;
    qs.push(
      typed(
        `What is (−${base})${sup(e)}?`,
        String(val),
        `Multiply −${base} by itself ${e} times. ${e % 2 === 0 ? "An even number of negatives gives a positive answer" : "An odd number of negatives gives a negative answer"}: ${val}.`,
        "integer",
      ),
    );
  }

  // Product law.
  {
    const b = randInt(2, 9);
    const m = randInt(2, 8);
    const n = randInt(2, 8);
    qs.push(
      textQ(
        `Simplify: ${b}${sup(m)} × ${b}${sup(n)}`,
        `${b}${sup(m + n)}`,
        [`${b}${sup(m * n)}`, `${b * b}${sup(m + n)}`, `${b}${sup(Math.abs(m - n) || m + n + 1)}`, `${b * b}${sup(m * n)}`],
        `When you multiply powers with the same base, add the exponents: ${m} + ${n} = ${m + n}.`,
      ),
    );
  }

  // Quotient law.
  {
    const b = randInt(2, 9);
    const n = randInt(2, 6);
    const m = n + randInt(1, 6);
    qs.push(
      textQ(
        `Simplify: ${b}${sup(m)} ÷ ${b}${sup(n)}`,
        `${b}${sup(m - n)}`,
        [`${b}${sup(m + n)}`, `${b}${sup(Math.round(m / n))}`, "1", `${b}${sup(m - n + 1)}`],
        `When you divide powers with the same base, subtract the exponents: ${m} − ${n} = ${m - n}.`,
      ),
    );
  }

  // Power of a power.
  {
    const b = randInt(2, 7);
    const m = randInt(2, 5);
    const n = randInt(2, 5);
    qs.push(
      textQ(
        `Simplify: (${b}${sup(m)})${sup(n)}`,
        `${b}${sup(m * n)}`,
        [`${b}${sup(m + n)}`, `${b}${sup(m ** n)}`, `${b * n}${sup(m)}`, `${b}${sup(m * n + 1)}`],
        `For a power of a power, multiply the exponents: ${m} × ${n} = ${m * n}.`,
      ),
    );
  }

  // Variable form.
  {
    const m = randInt(2, 7);
    const n = randInt(2, 7);
    qs.push(
      textQ(
        `Simplify: x${sup(m)} · x${sup(n)}`,
        `x${sup(m + n)}`,
        [`x${sup(m * n)}`, `2x${sup(m + n)}`, `x${sup(Math.abs(m - n) + 1)}`, `(2x)${sup(m + n)}`],
        `Same base, so add the exponents: ${m} + ${n} = ${m + n}.`,
      ),
    );
  }

  // Negative exponent.
  {
    const b = pick([2, 3, 4, 5, 10]);
    const e = pick([1, 2, 3]);
    if (b === 10 && chance(0.5)) {
      qs.push(typed(`Write 10${sup(-e)} as a decimal.`, fmt(10 ** -e), `10${sup(-e)} = 1/10${sup(e)} = 1/${10 ** e} = ${fmt(10 ** -e)}.`, "decimal"));
    } else {
      qs.push(
        typed(
          `Write ${b}${sup(-e)} as a fraction in lowest terms.`,
          `1/${b ** e}`,
          `A negative exponent means the reciprocal: ${b}${sup(-e)} = 1/${b}${sup(e)} = 1/${b ** e}.`,
          "fraction",
        ),
      );
    }
  }

  // Scientific notation.
  {
    const coeff = pick([1.2, 2.5, 3.6, 4.5, 6.4, 7.8, 9.1]);
    const e = randInt(3, level === 1 ? 5 : 8);
    if (chance(0.5)) {
      const value = Math.round(coeff * 10 ** e);
      const text = value.toLocaleString("en-CA").replace(/[,  ]/g, " ");
      qs.push(
        textQ(
          `Write ${text} in scientific notation.`,
          `${fmt(coeff)} × 10${sup(e)}`,
          [`${fmt(coeff)} × 10${sup(e + 1)}`, `${fmt(coeff)} × 10${sup(e - 1)}`, `${fmt(coeff)} × 10${sup(-e)}`],
          `Move the decimal point until one non-zero digit is left of it: ${fmt(coeff)}. You moved it ${e} places, so the power of 10 is ${e}.`,
        ),
      );
    } else {
      const e2 = randInt(3, 5);
      qs.push(
        typed(
          `What number is ${fmt(coeff)} × 10${sup(e2)}?`,
          String(Math.round(coeff * 10 ** e2)),
          `Move the decimal point ${e2} places to the right: ${fmt(coeff)} × ${10 ** e2} = ${Math.round(coeff * 10 ** e2)}.`,
          "number",
        ),
      );
    }
  }

  qs.push(...conceptsQ(EXPONENT_CONCEPTS, level, 1));
  return qs.slice(0, 10);
}

// ---------- 3. Polynomials ----------

/** Coefficients from the constant up: [5, -2, 3] is 3x² − 2x + 5. */
function poly(cs: number[], v = "x"): string {
  const terms: string[] = [];
  for (let i = cs.length - 1; i >= 0; i--) {
    const c = cs[i];
    if (c === 0) continue;
    const size = Math.abs(c);
    const body = i === 0 ? String(size) : `${size === 1 ? "" : size}${v}${i === 1 ? "" : sup(i)}`;
    terms.push(terms.length === 0 ? `${c < 0 ? "−" : ""}${body}` : `${c < 0 ? "−" : "+"} ${body}`);
  }
  return terms.length ? terms.join(" ") : "0";
}

const randPoly = (degree: number, max = 9): number[] =>
  Array.from({ length: degree + 1 }, (_, i) => (i === degree ? (chance(0.5) ? -1 : 1) * randInt(1, max) : randInt(-max, max)));

/** Wrong answers made by nudging one coefficient. */
function nudged(cs: number[], right: string, count = 4): string[] {
  const out = new Set<string>();
  for (let tries = 0; tries < 40 && out.size < count; tries++) {
    const copy = [...cs];
    const i = randInt(0, copy.length - 1);
    copy[i] += pick([-2, -1, 1, 2]) + (chance(0.3) ? -2 * copy[i] : 0);
    const text = poly(copy);
    if (text !== right) out.add(text);
  }
  return [...out];
}

function polynomials(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const max = level === 1 ? 5 : 9;
  const qs: Question[] = [];

  // Classify.
  {
    const kind = pick([1, 2, 3] as const);
    const terms = kind === 1 ? [0, 0, randInt(2, 9)] : kind === 2 ? [randInt(1, 9), 0, randInt(2, 9)] : [randInt(1, 9), randInt(2, 9), randInt(2, 9)];
    const names = ["monomial", "binomial", "trinomial"];
    qs.push(
      textQ(
        `Classify the polynomial ${poly(terms)} by its number of terms.`,
        names[kind - 1],
        names.filter((_, i) => i !== kind - 1).concat(["quadrinomial"]),
        `Count the terms: ${poly(terms)} has ${kind}. One term is a monomial, two a binomial, three a trinomial.`,
      ),
    );
  }

  // Degree.
  {
    const deg = randInt(1, 4);
    const cs = randPoly(deg, max);
    qs.push(typed(`What is the degree of ${poly(cs)}?`, String(deg), "The degree is the highest exponent on the variable.", "number"));
  }

  // Combine like terms.
  {
    const a = randPoly(2, max);
    const b = randPoly(2, max);
    const sum = a.map((c, i) => c + b[i]);
    const right = poly(sum);
    qs.push(
      textQ(
        `Add: (${poly(a)}) + (${poly(b)})`,
        right,
        nudged(sum, right),
        `Add the like terms: ${[2, 1, 0]
          .map((i) => `${a[i]} + ${paren(b[i])} = ${sum[i]}`)
          .join(", ")}. The result is ${right}.`,
      ),
    );
  }

  // Subtract.
  {
    const a = randPoly(2, max);
    const b = randPoly(2, max);
    const diff = a.map((c, i) => c - b[i]);
    const right = poly(diff);
    const forgot = a.map((c, i) => (i === 2 ? c - b[i] : c + b[i]));
    qs.push(
      textQ(
        `Subtract: (${poly(a)}) − (${poly(b)})`,
        right,
        [poly(forgot), poly(a.map((c, i) => c + b[i])), ...nudged(diff, right, 2)],
        `Subtracting a polynomial changes the sign of every term in it: ${poly(a)} + (${poly(b.map((c) => -c))}). Then combine like terms to get ${right}.`,
      ),
    );
  }

  // Multiply by a constant.
  {
    const k = randInt(2, 6) * (chance(0.3) ? -1 : 1);
    const a = randPoly(2, 6);
    const prod = a.map((c) => k * c);
    const right = poly(prod);
    qs.push(
      textQ(
        `Expand: ${minus(k)}(${poly(a)})`,
        right,
        [poly(a.map((c, i) => (i === 2 ? k * c : c))), poly(a.map((c, i) => (i === 0 ? c : k * c))), poly(a.map((c) => k + c)), ...nudged(prod, right, 1)],
        `Multiply every term inside the brackets by ${minus(k)}: ${right}.`,
      ),
    );
  }

  // Divide by a constant.
  {
    const k = randInt(2, 5);
    const a = randPoly(2, 6);
    const dividend = a.map((c) => c * k);
    qs.push(
      textQ(
        `Divide: (${poly(dividend)}) ÷ ${k}`,
        poly(a),
        [poly(a.map((c, i) => (i === 2 ? c : c * k))), poly(a.map((c, i) => (i === 0 ? c : c * k))), ...nudged(a, poly(a), 2)],
        `Divide every term by ${k}: ${dividend.map((c) => c).join(", ")} ÷ ${k}. The result is ${poly(a)}.`,
      ),
    );
  }

  // Evaluate.
  {
    const cs = randPoly(2, 5);
    const x = pick([-3, -2, -1, 1, 2, 3]);
    const val = cs[2] * x * x + cs[1] * x + cs[0];
    qs.push(
      typed(
        `Evaluate ${poly(cs)} when x = ${minus(x)}.`,
        String(val),
        `Substitute x = ${minus(x)}: ${cs[2]}(${minus(x)})² + ${paren(cs[1])}(${minus(x)}) + ${paren(cs[0])} = ${cs[2] * x * x} + ${paren(cs[1] * x)} + ${paren(cs[0])} = ${val}.`,
        "integer",
      ),
    );
  }

  // Like terms.
  {
    const c = randInt(2, 9);
    const k = pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== c));
    qs.push(
      textQ(
        `Which term is a like term of ${c}x²?`,
        `${k}x²`,
        [`${c}x`, `${c}x³`, `${c}y²`],
        "Like terms have exactly the same variable raised to the same power. Only the coefficients can differ.",
      ),
    );
  }
  return qs;
}

// ---------- 4. Multi-Step Equations ----------

function multiStepEquations(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];
  const solution = (): number => {
    const x = randInt(1, level === 1 ? 8 : 12) * (chance(level === 1 ? 0.2 : 0.4) ? -1 : 1);
    return x;
  };

  // Brackets, one side.
  {
    const x = solution();
    const a = randInt(2, 7);
    const b = randInt(1, 9);
    const c = a * (x + b);
    qs.push(
      typed(
        `Solve for x: ${a}(x + ${b}) = ${minus(c)}`,
        String(x),
        `Divide both sides by ${a}: x + ${b} = ${minus(x + b)}. Subtract ${b}: x = ${minus(x)}.`,
        "integer",
      ),
    );
  }

  // Variable on both sides.
  {
    const x = solution();
    let a = randInt(2, 9);
    const c = randInt(1, 8);
    if (a === c) a += 1;
    let b = randInt(-9, 9) || 4;
    let d = (a - c) * x + b;
    if (d === 0) {
      b += 1;
      d = (a - c) * x + b;
    }
    qs.push(
      typed(
        `Solve for x: ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}`,
        String(x),
        `Collect the x terms: ${a}x − ${c}x = ${d} − ${paren(b)}, so ${a - c}x = ${d - b}. Divide by ${a - c}: x = ${minus(x)}.`,
        "integer",
      ),
    );
  }

  // Brackets on both sides.
  {
    const x = solution();
    const c = randInt(1, 5);
    const a = c + randInt(1, 4);
    const p = randInt(1, 6);
    const r = randInt(1, 6);
    // a(x + p) = c(x − r) + k  →  k chosen so x is the solution
    const k = a * (x + p) - c * (x - r);
    qs.push(
      typed(
        `Solve for x: ${a}(x + ${p}) = ${c === 1 ? "" : c}(x − ${r}) ${k < 0 ? "−" : "+"} ${Math.abs(k)}`,
        String(x),
        `Expand: ${a}x + ${a * p} = ${c}x − ${c * r} ${k < 0 ? "−" : "+"} ${Math.abs(k)}. Collect: ${a - c}x = ${-c * r + k - a * p}. Divide by ${a - c}: x = ${minus(x)}.`,
        "integer",
      ),
    );
  }

  // Fraction coefficient.
  {
    const n = pick([2, 3, 4, 5]);
    const x = randInt(1, 9) * n * (chance(0.3) ? -1 : 1);
    const b = randInt(1, 9);
    const c = x / n + b;
    qs.push(
      typed(
        `Solve for x: x/${n} + ${b} = ${minus(c)}`,
        String(x),
        `Subtract ${b}: x/${n} = ${minus(c - b)}. Multiply both sides by ${n}: x = ${minus(x)}.`,
        "integer",
      ),
    );
  }

  // Two fractions.
  {
    const p = pick([2, 3, 4]);
    const q = pick([3, 5, 6]);
    const L = lcm(p, q);
    const m = randInt(1, 5);
    const x = L * m;
    const total = x / p + x / q;
    qs.push(
      typed(
        `Solve for x: x/${p} + x/${q} = ${total}`,
        String(x),
        `Use a common denominator of ${L}: ${L / p}x/${L} + ${L / q}x/${L} = ${total}, so ${(L / p + L / q)}x = ${total * L}. Then x = ${x}.`,
        "integer",
      ),
    );
  }

  // Word problem.
  {
    const who = pick(NAMES);
    const feeA = randInt(10, 40);
    const perB = randInt(1, 5);
    const perA = perB + randInt(1, 5);
    const n = randInt(3, 12);
    const feeB = feeA + (perA - perB) * n;
    qs.push(
      typed(
        `${who}'s gym charges $${feeA} to join plus $${perA} per visit. Another gym charges $${feeB} to join plus $${perB} per visit. After how many visits do the two gyms cost the same?`,
        String(n),
        `Set the costs equal: ${feeA} + ${perA}n = ${feeB} + ${perB}n. Then ${perA - perB}n = ${feeB - feeA}, so n = ${n}.`,
        "number",
      ),
    );
  }

  // Check a solution.
  {
    const x = solution();
    const a = randInt(2, 6);
    const b = randInt(1, 9);
    const c = a * x - b;
    const guess = chance(0.5) ? x : x + pick([-2, -1, 1, 2]);
    qs.push(
      textQ(
        `Is x = ${minus(guess)} the solution of ${a}x − ${b} = ${minus(c)}?`,
        guess === x ? "Yes" : "No",
        [guess === x ? "No" : "Yes"],
        `Substitute: ${a}(${minus(guess)}) − ${b} = ${minus(a * guess - b)}, which ${a * guess - b === c ? "equals" : "does not equal"} ${minus(c)}.`,
      ),
    );
  }

  // Write an equation.
  {
    const a = randInt(2, 5);
    const b = randInt(2, 9);
    const c = randInt(10, 40);
    qs.push(
      textQ(
        `Twice a number, decreased by ${b}, is the same as ${a} times the number plus ${c}. Which equation matches?`,
        `2n − ${b} = ${a}n + ${c}`,
        [`2(n − ${b}) = ${a}n + ${c}`, `2n + ${b} = ${a}n + ${c}`, `2n − ${b} = ${a}(n + ${c})`, `${b} − 2n = ${a}n + ${c}`],
        `“Twice a number, decreased by ${b}” is 2n − ${b}. “${a} times the number plus ${c}” is ${a}n + ${c}. “Is the same as” means =.`,
      ),
    );
  }
  return qs.slice(0, 10);
}

// ---------- 5. Linear Relations ----------

function gridVisual(p1: [number, number], p2: [number, number]): Visual {
  const size = Math.max(5, ...[...p1, ...p2].map(Math.abs));
  return { type: "grid", size: Math.min(size, 10), min: -Math.min(size, 10), points: [{ x: p1[0], y: p1[1], label: "A" }, { x: p2[0], y: p2[1], label: "B" }] };
}

const LINE_CONCEPTS: Concept[] = [
  { levels: [1, 2, 3], prompt: "What is the slope of a horizontal line?", right: "0", wrong: ["1", "undefined", "−1"], hint: "A horizontal line doesn't rise at all, so rise ÷ run = 0 ÷ run = 0." },
  { levels: [2, 3], prompt: "What is the slope of a vertical line?", right: "undefined", wrong: ["0", "1", "−1"], hint: "A vertical line has run = 0, and dividing by zero is undefined." },
  { levels: [1, 2, 3], prompt: "In y = mx + b, what does b represent?", right: "the y-intercept, where the line crosses the y-axis", wrong: ["the slope", "the x-intercept", "the number of points"], hint: "When x = 0, y = b. That's the point (0, b) on the y-axis." },
  { levels: [1, 2, 3], prompt: "Two lines are parallel when they have…", right: "the same slope", wrong: ["the same y-intercept", "slopes that are opposites", "no slope"], hint: "Lines with the same steepness never meet, unless they are the same line." },
  { levels: [2, 3], prompt: "A line goes down as you move right. Its slope is…", right: "negative", wrong: ["positive", "zero", "undefined"], hint: "Falling from left to right means a negative rise." },
  { levels: [2, 3], prompt: "A relation is discrete when…", right: "its graph is separate points (like whole numbers of items)", wrong: ["its graph is a smooth line", "it has no rule", "its slope is zero"], hint: "Counting whole items such as tickets gives separate points. Measuring time or distance gives a continuous line." },
];

function linearRelations(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // Slope from two points (integer slope, typed).
  {
    const m = randInt(1, level === 1 ? 3 : 5) * (chance(0.4) ? -1 : 1);
    const run = randInt(1, Math.min(3, Math.floor(8 / Math.abs(m))));
    const x1 = randInt(-4, 2);
    const y1 = m > 0 ? randInt(-4, 1) : randInt(-1, 4);
    const x2 = x1 + run;
    const y2 = y1 + m * run;
    qs.push(
      typed(
        `What is the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2})?`,
        String(m),
        `slope = rise ÷ run = (${y2} − ${paren(y1)}) ÷ (${x2} − ${paren(x1)}) = ${minus(y2 - y1)} ÷ ${x2 - x1} = ${minus(m)}.`,
        "integer",
        { visual: gridVisual([x1, y1], [x2, y2]) },
      ),
    );
  }

  // Fractional slope (multiple choice).
  {
    const run = randInt(2, 5);
    let rise = randInt(1, 7);
    if (gcd(rise, run) !== 1) rise = 1;
    const sign = chance(0.5) ? -1 : 1;
    const x1 = randInt(-3, 1);
    const y1 = randInt(-3, 3);
    const ans = fracText(sign * rise, run);
    qs.push(
      textQ(
        `Find the slope of the line through (${x1}, ${y1}) and (${x1 + run}, ${y1 + sign * rise}).`,
        ans,
        [fracText(-sign * rise, run), fracText(run, sign * rise), fracText(-run, sign * rise)].filter((w) => w !== ans),
        `rise = ${minus(sign * rise)}, run = ${run}, so slope = ${ans}.`,
        gridVisual([x1, y1], [x1 + run, y1 + sign * rise]),
      ),
    );
  }

  // y-intercept from an equation (typed).
  {
    const m = randInt(1, 7) * (chance(0.3) ? -1 : 1);
    const b = randInt(-9, 9) || 5;
    qs.push(typed(`What is the y-intercept of y = ${lin(m, b, "x")}?`, String(b), `In y = mx + b, the y-intercept is b. Here b = ${minus(b)}.`, "integer"));
  }

  // Equation from slope and intercept.
  {
    const m = randInt(2, 6) * (chance(0.4) ? -1 : 1);
    const b = randInt(-8, 8) || 2;
    const right = `y = ${lin(m, b, "x")}`;
    qs.push(
      textQ(
        `Which equation has slope ${minus(m)} and a y-intercept of ${minus(b)}?`,
        right,
        [`y = ${lin(b, m, "x")}`, `y = ${lin(-m, b, "x")}`, `y = ${lin(m, -b, "x")}`].filter((w) => w !== right),
        `Use y = mx + b with m = ${minus(m)} and b = ${minus(b)}: ${right}.`,
      ),
    );
  }

  // Point on a line.
  {
    const m = randInt(2, 5);
    const b = randInt(-5, 5);
    const x = randInt(1, 6);
    const on = chance(0.5);
    const y = m * x + b + (on ? 0 : pick([-2, -1, 1, 2]));
    qs.push(
      textQ(
        `Is the point (${x}, ${minus(y)}) on the line y = ${lin(m, b, "x")}?`,
        on ? "Yes" : "No",
        [on ? "No" : "Yes"],
        `Substitute x = ${x}: y = ${m}(${x}) ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${minus(m * x + b)}. ${on ? "This matches" : "This is not"} ${minus(y)}.`,
      ),
    );
  }

  // x-intercept.
  {
    const x = randInt(1, 8);
    const m = randInt(1, 5);
    const b = -m * x;
    qs.push(
      typed(
        `What is the x-intercept of y = ${lin(m, b, "x")}?`,
        String(x),
        `At the x-intercept, y = 0. Solve ${m}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = 0, so x = ${x}.`,
        "integer",
      ),
    );
  }

  // Rate-of-change story.
  {
    const start = randInt(5, 20);
    const rate = randInt(2, 8);
    const w = randInt(4, 12);
    qs.push(
      typed(
        `A plant is ${start} cm tall and grows ${rate} cm each week. How tall is it after ${w} weeks?`,
        String(start + rate * w),
        `Height = ${rate}w + ${start}. For w = ${w}: ${rate} × ${w} + ${start} = ${rate * w + start} cm.`,
        "number",
        { suffix: "cm" },
      ),
    );
  }

  // Parallel lines.
  {
    const m = randInt(2, 6) * (chance(0.4) ? -1 : 1);
    const b = randInt(-6, 6);
    const par = `y = ${lin(m, b + pick([-3, 2, 4]), "x")}`;
    qs.push(
      textQ(
        `Which line is parallel to y = ${lin(m, b, "x")}?`,
        par,
        [`y = ${lin(-m, b, "x")}`, `y = ${lin(m + 1, b, "x")}`, `y = ${lin(m + 2, b - 1, "x")}`],
        `Parallel lines have the same slope, ${minus(m)}. Only ${par} has that slope.`,
      ),
    );
  }

  qs.push(...conceptsQ(LINE_CONCEPTS, level, 1));
  return qs.slice(0, 10);
}

// ---------- 6. Similarity & Scale ----------

const SIMILAR_CONCEPTS: Concept[] = [
  { levels: [1, 2, 3], prompt: "What is true about corresponding angles in similar triangles?", right: "They are equal.", wrong: ["They add up to 90°.", "They are always 60°.", "They are different."], hint: "Similar shapes have the same angles and proportional sides." },
  { levels: [1, 2, 3], prompt: "What is true about corresponding sides in similar figures?", right: "They are in the same ratio.", wrong: ["They are equal.", "They add to 180.", "They are always parallel."], hint: "Every side is multiplied by the same scale factor." },
  { levels: [2, 3], prompt: "Figures that have the same shape AND size are called…", right: "congruent", wrong: ["similar only", "parallel", "proportional only"], hint: "Congruent figures match exactly. Similar figures have the same shape but may be different sizes." },
  { levels: [2, 3], prompt: "A scale factor less than 1 makes a figure…", right: "smaller (a reduction)", wrong: ["larger (an enlargement)", "the same size", "negative"], hint: "Multiplying by a number below 1 shrinks lengths." },
];

function similarityAndScale(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // Scale factor.
  {
    const k = randInt(2, level === 1 ? 4 : 6);
    const a = randInt(2, 9);
    qs.push(
      typed(
        `Triangle B is an enlargement of triangle A. A side of ${a} cm on triangle A matches a side of ${a * k} cm on triangle B. What is the scale factor?`,
        String(k),
        `Scale factor = new length ÷ original length = ${a * k} ÷ ${a} = ${k}.`,
        "number",
      ),
    );
  }

  // Missing side in similar rectangles.
  {
    const k = randInt(2, 5);
    const w = randInt(2, 8);
    const l = randInt(w + 1, 12);
    qs.push(
      typed(
        `Two rectangles are similar. The small one is ${l} cm by ${w} cm. The large one is ${l * k} cm long. How wide is the large rectangle?`,
        String(w * k),
        `The scale factor is ${l * k} ÷ ${l} = ${k}. Multiply the width by ${k}: ${w} × ${k} = ${w * k} cm.`,
        "number",
        { suffix: "cm" },
      ),
    );
  }

  // Similar triangles.
  {
    const k = randInt(2, 4);
    const [a, b] = [randInt(3, 8), randInt(4, 9)];
    qs.push(
      typed(
        `△ABC ~ △DEF. AB = ${a} cm, BC = ${b} cm and DE = ${a * k} cm. How long is EF?`,
        String(b * k),
        `The sides are in proportion: DE/AB = EF/BC, so EF = ${b} × (${a * k}/${a}) = ${b} × ${k} = ${b * k} cm.`,
        "number",
        { suffix: "cm" },
      ),
    );
  }

  // Shadow problem.
  {
    const stick = randInt(1, 3);
    const stickShadow = randInt(2, 4);
    const k = randInt(3, 9);
    qs.push(
      typed(
        `A ${stick} m stick casts a ${stickShadow} m shadow. At the same time, a tree casts a ${stickShadow * k} m shadow. How tall is the tree?`,
        String(stick * k),
        `The triangles are similar, so height ÷ shadow stays the same: tree = ${stick} × ${k} = ${stick * k} m.`,
        "number",
        { suffix: "m" },
      ),
    );
  }

  // Scale drawing.
  {
    const per = pick([2, 5, 10, 20, 50]);
    const cm = randInt(3, 15);
    qs.push(
      typed(
        `A scale drawing uses 1 cm for every ${per} cm in real life. A wall measures ${cm} cm on the drawing. How long is the real wall in centimetres?`,
        String(cm * per),
        `Multiply by the scale: ${cm} × ${per} = ${cm * per} cm.`,
        "number",
        { suffix: "cm" },
      ),
    );
  }

  // Areas and volumes.
  {
    const k = randInt(2, 4);
    if (chance(0.5)) {
      qs.push(
        typed(
          `A shape is enlarged by a scale factor of ${k}. By what factor does its area grow?`,
          String(k * k),
          `Area uses two lengths, so it grows by ${k}² = ${k * k}.`,
          "number",
        ),
      );
    } else {
      qs.push(
        typed(
          `A cube is enlarged by a scale factor of ${k}. By what factor does its volume grow?`,
          String(k ** 3),
          `Volume uses three lengths, so it grows by ${k}³ = ${k ** 3}.`,
          "number",
        ),
      );
    }
  }

  // Are they similar?
  {
    const k = randInt(2, 4);
    const [a, b] = [randInt(3, 6), randInt(7, 10)];
    const similar = chance(0.5);
    const a2 = a * k;
    const b2 = similar ? b * k : b * k + pick([1, 2]);
    qs.push(
      textQ(
        `Rectangle 1 is ${a} cm by ${b} cm and Rectangle 2 is ${a2} cm by ${b2} cm. Are they similar?`,
        similar ? "Yes" : "No",
        [similar ? "No" : "Yes"],
        `Compare the ratios: ${a2} ÷ ${a} = ${k} and ${b2} ÷ ${b} = ${fmt(b2 / b)}. ${similar ? "Both sides are multiplied by the same number" : "The ratios are different"}, so they are ${similar ? "" : "not "}similar.`,
      ),
    );
  }

  qs.push(...conceptsQ(SIMILAR_CONCEPTS, level, 1));
  return qs;
}

// ---------- 7. Solids ----------

const SOLID_CONCEPTS: Concept[] = [
  { levels: [1, 2, 3], prompt: "A cone and a cylinder have the same base and height. The cone's volume is…", right: "one third of the cylinder's", wrong: ["half of the cylinder's", "the same as the cylinder's", "double the cylinder's"], hint: "Three cones of water fill one cylinder with the same base and height." },
  { levels: [1, 2, 3], prompt: "A pyramid and a prism have the same base and height. The pyramid's volume is…", right: "one third of the prism's", wrong: ["half of the prism's", "the same as the prism's", "a quarter of the prism's"], hint: "V(pyramid) = ⅓ × base area × height." },
  { levels: [2, 3], prompt: "Which formula gives the surface area of a sphere?", right: "4πr²", wrong: ["(4/3)πr³", "2πr", "πr²"], hint: "(4/3)πr³ is the volume. Surface area is 4πr²." },
  { levels: [2, 3], prompt: "The slant height of a pyramid is measured…", right: "along a triangular face, from the base edge to the top", wrong: ["straight down from the top", "around the base", "along a base edge"], hint: "Slant height runs up the face. The height runs straight up from the centre of the base." },
];

function solids(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // Pyramid volume.
  {
    const b = randInt(3, level === 1 ? 8 : 12);
    const h = 3 * randInt(1, 6);
    qs.push(
      typed(
        `A square pyramid has a base of ${b} cm by ${b} cm and a height of ${h} cm. What is its volume?`,
        String((b * b * h) / 3),
        `V = ⅓ × base area × height = ⅓ × ${b * b} × ${h} = ${(b * b * h) / 3} cm³.`,
        "number",
        { suffix: "cm³", visual: { type: "shape", shape: "pyramid" } },
      ),
    );
  }

  // Cone volume.
  {
    const r = randInt(2, 8);
    const h = 3 * randInt(1, 5);
    const p = piAnswer((r * r * h) / 3);
    qs.push(
      typed(
        `A cone has a radius of ${r} cm and a height of ${h} cm. What is its volume? ${ROUND_NOTE}`,
        p.answer,
        `V = ⅓ × π × r² × h ≈ ⅓ × 3.14 × ${r * r} × ${h} = 3.14 × ${(r * r * h) / 3} = ${fmt(p.exact)}. Rounded: ${p.answer} cm³.`,
        "decimal",
        { accept: p.accept, suffix: "cm³", visual: { type: "shape", shape: "cone" } },
      ),
    );
  }

  // Sphere volume with r a multiple of 3.
  {
    const r = pick([3, 6]);
    const k = (4 * r ** 3) / 3;
    const p = piAnswer(k);
    qs.push(
      typed(
        `What is the volume of a sphere with radius ${r} cm? ${ROUND_NOTE}`,
        p.answer,
        `V = (4/3)πr³ ≈ (4/3) × 3.14 × ${r}³ = 3.14 × ${k} = ${fmt(p.exact)}. Rounded: ${p.answer} cm³.`,
        "decimal",
        { accept: p.accept, suffix: "cm³", visual: { type: "shape", shape: "sphere" } },
      ),
    );
  }

  // Sphere surface area.
  {
    const r = randInt(2, 9);
    const p = piAnswer(4 * r * r);
    qs.push(
      typed(
        `What is the surface area of a sphere with radius ${r} cm? ${ROUND_NOTE}`,
        p.answer,
        `SA = 4πr² ≈ 4 × 3.14 × ${r * r} = 3.14 × ${4 * r * r} = ${fmt(p.exact)}. Rounded: ${p.answer} cm².`,
        "decimal",
        { accept: p.accept, suffix: "cm²", visual: { type: "shape", shape: "sphere" } },
      ),
    );
  }

  // Cone surface area using a Pythagorean triple.
  {
    const [r, h, l] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]);
    const p = piAnswer(r * r + r * l);
    qs.push(
      typed(
        `A cone has a radius of ${r} cm and a height of ${h} cm. Its slant height is ${l} cm. What is its total surface area? ${ROUND_NOTE}`,
        p.answer,
        `SA = πr² + πrs = π(${r * r} + ${r * l}) ≈ 3.14 × ${r * r + r * l} = ${fmt(p.exact)}. Rounded: ${p.answer} cm².`,
        "decimal",
        { accept: p.accept, suffix: "cm²", visual: { type: "shape", shape: "cone" } },
      ),
    );
  }

  // Square pyramid surface area.
  {
    const b = 2 * randInt(2, 8);
    const s = randInt(b / 2 + 1, 15);
    qs.push(
      typed(
        `A square pyramid has a base edge of ${b} cm and a slant height of ${s} cm. What is its total surface area?`,
        String(b * b + 2 * b * s),
        `Base: ${b} × ${b} = ${b * b}. Four triangles: 4 × (½ × ${b} × ${s}) = ${2 * b * s}. Total = ${b * b + 2 * b * s} cm².`,
        "number",
        { suffix: "cm²", visual: { type: "shape", shape: "pyramid" } },
      ),
    );
  }

  // Missing height.
  {
    const b = randInt(3, 9);
    const h = 3 * randInt(1, 5);
    qs.push(
      typed(
        `A square pyramid has a base edge of ${b} cm and a volume of ${(b * b * h) / 3} cm³. How tall is it?`,
        String(h),
        `V = ⅓ × ${b * b} × h = ${(b * b * h) / 3}. Multiply by 3: ${b * b} × h = ${b * b * h}. So h = ${b * b * h} ÷ ${b * b} = ${h} cm.`,
        "number",
        { suffix: "cm", visual: { type: "shape", shape: "pyramid" } },
      ),
    );
  }

  qs.push(...conceptsQ(SOLID_CONCEPTS, level, 1));
  return qs;
}

// ---------- Course ----------

export const course: Course = {
  grade: "9",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "The principles and processes underlying operations with numbers apply equally to algebra.",
      "Computational fluency and flexibility with numbers extend to operations with rational numbers and exponents.",
      "Algebraic reasoning, linear relations and polynomials describe patterns and change.",
      "Proportional reasoning applies to similar figures, scale and the measurement of three-dimensional objects.",
    ],
  },
  units: [
    {
      id: "rational-numbers",
      title: "Rational Numbers",
      emoji: "➗",
      blurb: "Fractions and decimals, positive and negative",
      standards: { "ca-bc": "Operations with rational numbers: fractions, decimals and integers, including order of operations" },
      parentNote:
        "Adding, subtracting, multiplying and dividing fractions and decimals that may be negative, converting between fractions and decimals, ordering rational numbers, and using BEDMAS.",
      generate: rationalNumbers,
    },
    {
      id: "exponent-laws",
      title: "Exponents & Powers",
      emoji: "🚀",
      blurb: "Exponent laws and scientific notation",
      standards: { "ca-bc": "Exponents: integer exponents, exponent laws and scientific notation" },
      parentNote:
        "Evaluating powers, using the product, quotient and power laws, understanding zero and negative exponents, and writing very large or small numbers in scientific notation.",
      generate: exponentLaws,
    },
    {
      id: "polynomials",
      title: "Polynomials",
      emoji: "🧩",
      blurb: "Add, subtract, expand and evaluate",
      standards: { "ca-bc": "Polynomials: add and subtract; multiply and divide by a constant; evaluate" },
      parentNote:
        "Naming polynomials by terms and degree, combining like terms, subtracting polynomials, multiplying and dividing by a constant, and substituting values for x.",
      generate: polynomials,
    },
    {
      id: "multi-step-equations",
      title: "Multi-Step Equations",
      emoji: "⚖️",
      blurb: "Brackets, fractions and both sides",
      standards: { "ca-bc": "Multi-step one-variable linear equations, including brackets, fractions and variables on both sides" },
      parentNote:
        "Solving linear equations with brackets, fractions and variables on both sides, checking solutions, and turning word problems into equations.",
      generate: multiStepEquations,
    },
    {
      id: "linear-relations",
      title: "Linear Relations",
      emoji: "📈",
      blurb: "Slope, intercepts and graphs",
      standards: { "ca-bc": "Linear relations: slope, intercepts, equations of lines, discrete and continuous relations" },
      parentNote:
        "Finding slope from points and graphs, reading y = mx + b, finding intercepts, deciding whether a point is on a line, spotting parallel lines, and using rates of change in stories.",
      generate: linearRelations,
    },
    {
      id: "similarity-and-scale",
      title: "Similarity & Scale",
      emoji: "🔭",
      blurb: "Scale factors and similar figures",
      standards: { "ca-bc": "Spatial proportional reasoning: similar figures, scale factors and scale drawings" },
      parentNote:
        "Using scale factors to find missing sides, solving shadow and scale-drawing problems, and seeing how enlarging a shape changes its area and volume.",
      generate: similarityAndScale,
    },
    {
      id: "solids",
      title: "Pyramids, Cones & Spheres",
      emoji: "🔺",
      blurb: "Surface area and volume",
      standards: { "ca-bc": "Surface area and volume of pyramids, cones and spheres" },
      parentNote:
        "Finding the volume and surface area of pyramids, cones and spheres, and linking each volume to the cylinder or prism with the same base and height.",
      generate: solids,
    },
  ],
};
