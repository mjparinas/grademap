import { chance, pick, randInt, sample, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, Visual } from "../../types";
import { NAMES, fmt, fracText, gcd, levelOf, lin, numQ, sup, textQ, typed, type Concept, type Level } from "../kit";

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
  { levels: [2, 3], prompt: "What is the value of −3² (the negative of 3 squared)?", right: "−9", wrong: ["9", "−6", "6"], hint: "The exponent applies only to 3: 3² = 9, then the negative sign gives −9. Compare (−3)² = 9." },
  { levels: [1, 2], prompt: "Any number to the power of 1 equals…", right: "the number itself", wrong: ["1", "0", "double the number"], hint: "a¹ = a. For example, 7¹ = 7." },
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

  // Power of a product.
  {
    const a2 = randInt(2, 5);
    const n = randInt(2, 3);
    qs.push(
      textQ(
        `Which expression is equal to (${a2}x)${sup(n)}?`,
        `${a2 ** n}x${sup(n)}`,
        [`${a2}x${sup(n)}`, `${a2 * n}x${sup(n)}`, `${a2}${sup(n)}x`, `${a2 ** n}x`],
        `Both the ${a2} and the x are raised to the power ${n}: (${a2}x)${sup(n)} = ${a2}${sup(n)} × x${sup(n)} = ${a2 ** n}x${sup(n)}.`,
      ),
    );
  }

  // Power of a fraction.
  {
    const n = pick([2, 3]);
    const a2 = randInt(1, 3);
    const b2 = a2 + randInt(1, 3);
    qs.push(
      typed(
        `Write (${a2}/${b2})${sup(n)} as a fraction in lowest terms.`,
        `${a2 ** n / gcd(a2 ** n, b2 ** n)}/${b2 ** n / gcd(a2 ** n, b2 ** n)}`,
        `Raise the numerator and the denominator to the power ${n}: ${a2}${sup(n)}/${b2}${sup(n)} = ${a2 ** n}/${b2 ** n}, which is ${a2 ** n / gcd(a2 ** n, b2 ** n)}/${b2 ** n / gcd(a2 ** n, b2 ** n)} in lowest terms.`,
        "fraction",
        { accept: [`${a2 ** n}/${b2 ** n}`] },
      ),
    );
  }

  // Order of operations with exponents.
  {
    const a2 = randInt(2, 9);
    const b2 = randInt(2, 5);
    const c2 = randInt(2, 4);
    qs.push(
      typed(
        `Evaluate ${a2} + ${b2} × ${c2}${sup(2)}.`,
        String(a2 + b2 * c2 * c2),
        `Exponents come before multiplication: ${c2}${sup(2)} = ${c2 * c2}, then ${b2} × ${c2 * c2} = ${b2 * c2 * c2}, then add ${a2}: ${a2 + b2 * c2 * c2}.`,
        "number",
      ),
    );
  }

  // Compare powers.
  {
    const base = randInt(2, 4);
    const e = randInt(3, 5);
    const left = base ** e;
    const right = e ** base;
    if (left !== right) {
      qs.push(
        textQ(
          `Which is greater, ${base}${sup(e)} or ${e}${sup(base)}?`,
          left > right ? `${base}${sup(e)}` : `${e}${sup(base)}`,
          [left > right ? `${e}${sup(base)}` : `${base}${sup(e)}`, "They are equal"],
          `${base}${sup(e)} = ${left} and ${e}${sup(base)} = ${right}.`,
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
    const deg = randInt(1, 2);
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

  // Interpolation and extrapolation.
  {
    const m = randInt(2, 6);
    const b = randInt(1, 10);
    const xs = [2, 4, 6, 8];
    const visual: Visual = { type: "table", headers: ["Hours (h)", "Cost ($)"], rows: xs.map((x) => [x, m * x + b]) };
    const inside = chance(0.5);
    const x = inside ? pick([3, 5, 7]) : pick([10, 12, 15]);
    qs.push(
      typed(
        `The table shows a linear relation. Estimate the cost for ${x} hours. This is ${inside ? "interpolation (between known values)" : "extrapolation (beyond known values)"}.`,
        String(m * x + b),
        `The cost rises by ${m} per hour, with a start of ${b}: cost = ${m}h + ${b}. For h = ${x}: ${m * x + b}.`,
        "number",
        { visual },
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

// ---------- 7. Statistics in Society ----------

const STATS_CONCEPTS: Concept[] = [
  { levels: [1, 2, 3], prompt: "In statistics, the population is…", right: "the whole group you want to learn about", wrong: ["the people who answered", "the number of questions", "the average of the data"], hint: "A sample is a smaller part of the population that you actually survey." },
  { levels: [1, 2, 3], prompt: "A sample is…", right: "a smaller group chosen to represent the population", wrong: ["the whole population", "a type of graph", "the mean"], hint: "Surveying everyone is often impossible, so we study a sample." },
  { levels: [1, 2, 3], prompt: "Which sample is most likely to represent all students at a school?", right: "50 students chosen at random from the school list", wrong: ["the 50 students on the basketball team", "50 students at the lunch table nearest the gym", "50 students who volunteered online"], hint: "A random sample gives every student an equal chance to be chosen." },
  { levels: [2, 3], prompt: "A survey about screen time asks, “Don't you agree that too much screen time is harmful?” What is the problem?", right: "The question is leading and may bias the answers.", wrong: ["The question is too short.", "Nobody uses screens.", "The sample is too random."], hint: "Fair questions use neutral wording that doesn't suggest the “right” answer." },
  { levels: [2, 3], prompt: "A graph's vertical axis starts at 90 instead of 0, making a small change look huge. This is…", right: "a misleading graph", wrong: ["a reliable graph", "a random sample", "a larger sample"], hint: "A truncated axis exaggerates differences. Always check the scale." },
  { levels: [2, 3], prompt: "Ice cream sales and sunburns both rise in summer. What can we conclude?", right: "They are related to the season, but one does not necessarily cause the other.", wrong: ["Ice cream causes sunburn.", "Sunburn causes ice cream sales.", "Nothing is related."], hint: "Correlation is not causation. A third factor, hot sunny weather, affects both." },
  { levels: [2, 3], prompt: "A result is reliable if…", right: "repeating the study gives similar results", wrong: ["it was published online", "many people liked it", "it was fast"], hint: "Reliability is about consistency. Validity is about measuring what you intend to measure." },
  { levels: [2, 3], prompt: "A poll is conducted by phoning only landlines on weekday mornings. Who might be missing?", right: "people who work during the day or only use cell phones", wrong: ["nobody", "only teachers", "people who answer the phone"], hint: "Who is left out of the sample can bias the result." },
  { levels: [1, 2, 3], prompt: "Which is a primary source of data?", right: "a survey you conducted yourself", wrong: ["a newspaper article about a survey", "a textbook summary", "an online comment"], hint: "Primary data is collected by you. Secondary data comes from someone else." },
  { levels: [3], prompt: "A news story says “Most teens prefer app X” based on 20 people at one mall. What is the best response?", right: "Ask how large and how random the sample was before trusting it.", wrong: ["Accept it, since it's in the news.", "Ignore every survey.", "Assume the sample is perfect."], hint: "Small, non-random samples may not represent all teens." },
];

function statisticsInSociety(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // Sampling fraction.
  {
    const pop = pick([200, 400, 600, 800, 1000]);
    const n = pop / pick([10, 20, 5, 4]);
    qs.push(
      typed(
        `A school has ${pop} students. A survey asks ${n} of them. What fraction of the students were surveyed? Type it in lowest terms.`,
        `${n / gcd(n, pop)}/${pop / gcd(n, pop)}`,
        `Fraction = ${n}/${pop}, which is ${n / gcd(n, pop)}/${pop / gcd(n, pop)} in lowest terms.`,
        "fraction",
        { accept: [`${n}/${pop}`] },
      ),
    );
  }

  // Predicting from a sample.
  {
    const pop = pick([400, 600, 800, 1200]);
    const n = pick([20, 40, 50]);
    const yes = pick([2, 3, 4, 5, 6]) * (n / 10);
    qs.push(
      typed(
        `In a random sample of ${n} students, ${yes} said they walk to school. Based on this sample, about how many of ${pop} students walk?`,
        String((yes * pop) / n),
        `The sample proportion is ${yes}/${n}. Multiply by the population: ${yes}/${n} × ${pop} = ${(yes * pop) / n}.`,
        "number",
      ),
    );
  }

  // Mean from a sample.
  {
    const set = [randInt(4, 9), randInt(4, 9), randInt(4, 9), randInt(4, 9), randInt(4, 9)];
    const total = set.reduce((a, b) => a + b, 0);
    const mean = total / set.length;
    if (Number.isInteger(mean)) {
      qs.push(typed(`Five students report hours of sleep: ${set.join(", ")}. What is the mean?`, String(mean), `Add them: ${total}. Divide by 5: ${mean}.`, "number"));
    } else {
      qs.push(typed(`Four students report hours of sleep: 7, 8, 9, 8. What is the mean?`, "8", "Add them: 32. Divide by 4: 8.", "number"));
    }
  }

  qs.push(...conceptsQ(STATS_CONCEPTS, level, 6));
  return qs.slice(0, 10);
}

// ---------- 8. Budgets & Transactions ----------

function budgetsAndTransactions(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];
  const d = (cents: number): string => (cents / 100).toFixed(2);
  const who = pick(NAMES);

  // Monthly budget left over.
  {
    const income = pick([320, 400, 480, 560]);
    const rent = pick([100, 120, 150]);
    const food = pick([60, 80, 90]);
    const fun = pick([25, 30, 40]);
    qs.push(
      typed(
        `${who} earns $${income} a month at a part-time job. Expenses: $${rent} for phone and transit, $${food} for food and $${fun} for fun. How much is left to save, in dollars?`,
        String(income - rent - food - fun),
        `Total spending = ${rent} + ${food} + ${fun} = ${rent + food + fun}. Left over = ${income} − ${rent + food + fun} = ${income - rent - food - fun}.`,
        "number",
      ),
    );
  }

  // Percent of income.
  {
    const income = pick([400, 500, 600, 800]);
    const pct = pick([10, 20, 25, 30]);
    qs.push(
      typed(
        `${who} saves ${pct}% of $${income} each month. How many dollars is that?`,
        String((income * pct) / 100),
        `${pct}% of ${income} = ${pct}/100 × ${income} = ${(income * pct) / 100}.`,
        "number",
      ),
    );
  }

  // Savings goal.
  {
    const perWeek = pick([15, 20, 25, 30]);
    const weeks = randInt(4, 12);
    qs.push(
      typed(
        `${who} wants to buy a $${perWeek * weeks} bike. ${who} saves $${perWeek} a week. How many weeks will it take?`,
        String(weeks),
        `Weeks = goal ÷ savings per week = ${perWeek * weeks} ÷ ${perWeek} = ${weeks}.`,
        "number",
      ),
    );
  }

  // Transaction with tax.
  {
    const price = pick([20, 40, 60, 80, 100]);
    const total = price * 1.12;
    qs.push(
      typed(
        `A hoodie costs $${price}. Tax is 12% (GST 5% plus PST 7%). What is the total price, in dollars?`,
        fmt(Math.round(total * 100) / 100),
        `Tax = 12% of ${price} = ${fmt((price * 12) / 100)}. Total = ${price} + ${fmt((price * 12) / 100)} = ${fmt(Math.round(total * 100) / 100)}.`,
        "decimal",
      ),
    );
  }

  // Change.
  {
    const unit = randInt(3, 12) * 25 + 50;
    const n = randInt(2, 4);
    const total = unit * n;
    const bill = total <= 2000 ? 2000 : 5000;
    qs.push(
      typed(
        `${who} buys ${n} snacks at $${d(unit)} each and pays with a $${bill / 100} bill. How much change should ${who} get, in dollars?`,
        d(bill - total),
        `Total = ${n} × $${d(unit)} = $${d(total)}. Change = $${d(bill)} − $${d(total)} = $${d(bill - total)}.`,
        "decimal",
        { accept: [fmt((bill - total) / 100)] },
      ),
    );
  }

  // Better phone plan.
  {
    const fee1 = pick([20, 25, 30]);
    const per1 = pick([2, 3, 4]);
    const fee2 = fee1 + pick([10, 15]);
    const per2 = per1 - 1;
    const gb = randInt(3, 10);
    const c1 = fee1 + per1 * gb;
    const c2 = fee2 + per2 * gb;
    if (c1 !== c2) {
      qs.push(
        textQ(
          `Plan A: $${fee1} plus $${per1} per GB. Plan B: $${fee2} plus $${per2} per GB. For ${gb} GB of data, which plan costs less?`,
          c1 < c2 ? "Plan A" : "Plan B",
          [c1 < c2 ? "Plan B" : "Plan A", "They cost the same"],
          `Plan A costs ${fee1} + ${per1} × ${gb} = ${c1}. Plan B costs ${fee2} + ${per2} × ${gb} = ${c2}. The lower total is cheaper.`,
        ),
      );
    }
  }

  // Needs vs wants.
  qs.push(
    textQ(
      "In a budget, which is the best example of a “need”?",
      "rent or food",
      ["concert tickets", "a new game console", "designer shoes"],
      "Needs are things you must have, like housing and food. Wants are nice to have.",
    ),
  );
  qs.push(
    textQ(
      "Why is it useful to compare your actual spending with your budget each month?",
      "To see where your plan and your spending differ, and adjust",
      ["To spend more", "To avoid saving", "To ignore receipts"],
      "Tracking spending shows whether your plan is working.",
    ),
  );
  void level;
  return qs;
}

// ---------- Course ----------

export const course: Course = {
  grade: "9",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "The principles and processes underlying operations with numbers apply equally to algebraic situations and can be described and analyzed.",
      "Computational fluency and flexibility with numbers extend to operations with rational numbers.",
      "Continuous linear relationships can be identified and represented in many connected ways to identify regularities and make generalizations.",
      "Similar shapes have proportional relationships that can be described, measured, and compared.",
      "Analyzing the validity, reliability, and representation of data enables us to compare and interpret.",
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
      standards: { "ca-bc": "Exponents and exponent laws with whole-number exponents" },
      parentNote:
        "Evaluating powers, using the product, quotient and power laws, working with powers of products and fractions, and order of operations with exponents.",
      generate: exponentLaws,
    },
    {
      id: "polynomials",
      title: "Polynomials",
      emoji: "🧩",
      blurb: "Add, subtract, expand and evaluate",
      standards: { "ca-bc": "Operations with polynomials of degree 2 or less: add, subtract, multiply and divide by a constant" },
      parentNote:
        "Naming polynomials by terms and degree, combining like terms, subtracting polynomials, multiplying and dividing by a constant, and substituting values for x.",
      generate: polynomials,
    },
    {
      id: "multi-step-equations",
      title: "Multi-Step Equations",
      emoji: "⚖️",
      blurb: "Brackets, fractions and both sides",
      standards: { "ca-bc": "One-variable linear equations (multi-step), including brackets, fractions and variables on both sides" },
      parentNote:
        "Solving linear equations with brackets, fractions and variables on both sides, checking solutions, and turning word problems into equations.",
      generate: multiStepEquations,
    },
    {
      id: "linear-relations",
      title: "Linear Relations",
      emoji: "📈",
      blurb: "Slope, intercepts and graphs",
      standards: { "ca-bc": "Two-variable linear relations: graphing, slope, intercepts, interpolation and extrapolation" },
      parentNote:
        "Finding slope from points and graphs, reading y = mx + b, finding intercepts, deciding whether a point is on a line, spotting parallel lines, and using rates of change in stories.",
      generate: linearRelations,
    },
    {
      id: "similarity-and-scale",
      title: "Similarity & Scale",
      emoji: "🔭",
      blurb: "Scale factors and similar figures",
      standards: { "ca-bc": "Spatial proportional reasoning: similar shapes, scale factors and scale drawings" },
      parentNote:
        "Using scale factors to find missing sides, solving shadow and scale-drawing problems, and seeing how enlarging a shape changes its area and volume.",
      generate: similarityAndScale,
    },
    {
      id: "statistics-in-society",
      title: "Statistics in Society",
      emoji: "📊",
      blurb: "Samples, bias and misleading graphs",
      standards: { "ca-bc": "Statistics in society: sampling, bias, validity and reliability of data, and how data is represented" },
      parentNote:
        "Telling a population from a sample, spotting bias in who is asked and how, predicting from a sample, noticing misleading graphs, and why correlation is not causation.",
      generate: statisticsInSociety,
    },
    {
      id: "budgets-and-transactions",
      title: "Budgets & Transactions",
      emoji: "💰",
      blurb: "Plan, spend, save and compare",
      standards: { "ca-bc": "Financial literacy: simple budgets and transactions" },
      parentNote:
        "Making and checking a simple monthly budget, working out savings goals and percent of income, adding BC's 12% tax, making change, and comparing two plans.",
      generate: budgetsAndTransactions,
    },
  ],
};
