import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, Question, Visual } from "../../types";
import { NAMES, ROUND_NOTE, conceptQ, fmt, frac, gcd, levelOf, mixed, numQ, piAnswer, roundTo, textQ, typed, type Concept } from "../kit";

// Grade 8 maths for the "big" age band. Anything that needs exact decimal maths is built
// from whole numbers and only turned into a decimal for display, so floating-point noise
// never reaches a student. Fraction answers are typed in lowest terms.

const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
const isSquare = (n: number): boolean => Number.isInteger(Math.sqrt(n));

// ---------- 1. Fraction Operations ----------

/** A proper fraction with a denominator from the list. */
function properFraction(dens: number[]): [number, number] {
  const d = pick(dens);
  return [randInt(1, d - 1), d];
}

function fractionOps(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const dens = level === 1 ? [2, 3, 4, 5, 6] : level === 2 ? [3, 4, 5, 6, 8, 9, 10] : [4, 5, 6, 7, 8, 9, 10, 12];
  const qs: Question[] = [];

  // Add unlike fractions.
  {
    let a: [number, number], b: [number, number];
    do {
      a = properFraction(dens);
      b = properFraction(dens);
    } while (a[1] === b[1]);
    const L = lcm(a[1], b[1]);
    const n = (a[0] * L) / a[1] + (b[0] * L) / b[1];
    qs.push(
      typed(
        `Add: ${a[0]}/${a[1]} + ${b[0]}/${b[1]}. Type the answer as a fraction in lowest terms.`,
        frac(n, L),
        `Use a common denominator of ${L}: ${(a[0] * L) / a[1]}/${L} + ${(b[0] * L) / b[1]}/${L} = ${n}/${L}. Lowest terms: ${frac(n, L)}.`,
        "fraction",
        { accept: [`${n}/${L}`] },
      ),
    );
  }

  // Subtract unlike fractions.
  {
    let a: [number, number], b: [number, number];
    do {
      a = properFraction(dens);
      b = properFraction(dens);
    } while (a[1] === b[1] || a[0] * b[1] <= b[0] * a[1]);
    const L = lcm(a[1], b[1]);
    const n = (a[0] * L) / a[1] - (b[0] * L) / b[1];
    qs.push(
      typed(
        `Subtract: ${a[0]}/${a[1]} − ${b[0]}/${b[1]}. Type the answer in lowest terms.`,
        frac(n, L),
        `Common denominator ${L}: ${(a[0] * L) / a[1]}/${L} − ${(b[0] * L) / b[1]}/${L} = ${n}/${L}, which is ${frac(n, L)} in lowest terms.`,
        "fraction",
        { accept: [`${n}/${L}`] },
      ),
    );
  }

  // Multiply.
  {
    const a = properFraction(dens);
    const b = properFraction(dens);
    const n = a[0] * b[0];
    const m = a[1] * b[1];
    qs.push(
      typed(
        `Multiply: ${a[0]}/${a[1]} × ${b[0]}/${b[1]}. Type the answer in lowest terms.`,
        frac(n, m),
        `Multiply the numerators and the denominators: ${a[0]} × ${b[0]} = ${n} and ${a[1]} × ${b[1]} = ${m}. ${n}/${m} simplifies to ${frac(n, m)}.`,
        "fraction",
        { accept: [`${n}/${m}`] },
      ),
    );
  }

  // Divide.
  {
    const a = properFraction(dens);
    const b = properFraction(dens);
    const n = a[0] * b[1];
    const m = a[1] * b[0];
    qs.push(
      typed(
        `Divide: ${a[0]}/${a[1]} ÷ ${b[0]}/${b[1]}. Type the answer in lowest terms.`,
        frac(n, m),
        `Dividing by a fraction means multiplying by its reciprocal: ${a[0]}/${a[1]} × ${b[1]}/${b[0]} = ${n}/${m}, which is ${frac(n, m)}.`,
        "fraction",
        { accept: [`${n}/${m}`] },
      ),
    );
  }

  // Mixed number ↔ improper fraction.
  {
    const c = pick(dens);
    const whole = randInt(1, level === 1 ? 3 : 6);
    const rem = randInt(1, c - 1);
    if (chance(0.5)) {
      const imp = whole * c + rem;
      qs.push(
        textQ(
          `Write ${whole} ${rem}/${c} as an improper fraction.`,
          `${imp}/${c}`,
          [`${whole + rem}/${c}`, `${whole * rem}/${c}`, `${imp + 1}/${c}`, `${imp}/${c + 1}`],
          `Multiply the whole number by the denominator and add the numerator: ${whole} × ${c} + ${rem} = ${imp}. Keep the denominator ${c}.`,
        ),
      );
    } else {
      const imp = whole * c + rem;
      qs.push(
        textQ(
          `Write ${imp}/${c} as a mixed number.`,
          `${whole} ${rem}/${c}`,
          [`${whole + 1} ${rem}/${c}`, `${whole} ${c - rem}/${c}`, `${rem} ${whole}/${c}`, `${whole - 1 || whole + 2} ${rem}/${c}`],
          `Divide ${imp} by ${c}: ${whole} whole groups with ${rem} left over. The answer is ${whole} ${rem}/${c}.`,
        ),
      );
    }
  }

  // Add mixed numbers.
  {
    const a: [number, number, number] = [randInt(1, 4), ...properFraction(dens)];
    const b: [number, number, number] = [randInt(1, 4), ...properFraction(dens)];
    const L = lcm(a[2], b[2]);
    const total = a[0] * L + (a[1] * L) / a[2] + b[0] * L + (b[1] * L) / b[2];
    const right = mixed(total, L);
    const wrong = [mixed(total + 1, L), mixed(total - 1, L), mixed(total + L, L), `${a[0] + b[0]} ${frac(a[1] + b[1], a[2] + b[2])}`];
    qs.push(
      textQ(
        `${a[0]} ${a[1]}/${a[2]} + ${b[0]} ${b[1]}/${b[2]} = ?`,
        right,
        wrong,
        `Add the whole numbers (${a[0]} + ${b[0]}) and the fractions (${a[1]}/${a[2]} + ${b[1]}/${b[2]}, using a denominator of ${L}), then carry if the fraction part is 1 or more. Total: ${right}.`,
      ),
    );
  }

  // A fraction of an amount.
  {
    const [n, d] = properFraction([2, 3, 4, 5, 6, 8]);
    const k = randInt(2, level === 1 ? 6 : 12);
    const total = d * k;
    const who = pick(NAMES);
    qs.push(
      typed(
        `${who} has ${total} stickers and gives away ${n}/${d} of them. How many stickers does ${who} give away?`,
        String(n * k),
        `Find one share: ${total} ÷ ${d} = ${k}. Then take ${n} of them: ${n} × ${k} = ${n * k}.`,
        "number",
      ),
    );
  }

  // Which is greatest?
  {
    const set = new Map<string, [number, number]>();
    while (set.size < 4) {
      const f = properFraction([2, 3, 4, 5, 6, 8, 10]);
      set.set(String(f[0] / f[1]), f);
    }
    const list = [...set.values()];
    const best = list.reduce((m, f) => (f[0] / f[1] > m[0] / m[1] ? f : m));
    const L = list.reduce((m, f) => lcm(m, f[1]), 1);
    qs.push(
      textQ(
        "Which fraction is the greatest?",
        `${best[0]}/${best[1]}`,
        list.filter((f) => f !== best).map((f) => `${f[0]}/${f[1]}`),
        `Rewrite each over ${L}: ${list.map((f) => `${f[0]}/${f[1]} = ${(f[0] * L) / f[1]}/${L}`).join(", ")}. The largest numerator wins.`,
      ),
    );
  }

  return qs;
}

// ---------- 2. Perfect Squares & Square Roots ----------

function squaresAndRoots(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const max = level === 1 ? 12 : level === 2 ? 15 : 25;
  const qs: Question[] = [];

  {
    const n = randInt(3, max);
    qs.push(typed(`What is ${n}²?`, String(n * n), `${n}² means ${n} × ${n} = ${n * n}.`, "number"));
  }
  {
    const n = randInt(3, max);
    qs.push(typed(`What is √${n * n}?`, String(n), `Which number multiplied by itself makes ${n * n}? ${n} × ${n} = ${n * n}, so √${n * n} = ${n}.`, "number"));
  }
  {
    const n = randInt(4, max);
    const nonSquares = [n * n + 1, n * n - 1, n * n + 2, n * n + n].filter((x) => !isSquare(x));
    qs.push(
      textChoice(
        "Which of these numbers is a perfect square?",
        String(n * n),
        nonSquares.slice(0, 3).map(String),
        `A perfect square is a whole number times itself. ${n} × ${n} = ${n * n}.`,
      ),
    );
  }
  {
    const k = randInt(3, Math.min(max, 20));
    const j = randInt(1, 2 * k);
    const N = k * k + j;
    qs.push(
      textQ(
        `√${N} is between which two whole numbers?`,
        `${k} and ${k + 1}`,
        [`${k - 1} and ${k}`, `${k + 1} and ${k + 2}`, `${k - 2} and ${k - 1}`],
        `${k}² = ${k * k} and ${k + 1}² = ${(k + 1) * (k + 1)}. Since ${N} is between them, √${N} is between ${k} and ${k + 1}.`,
      ),
    );
  }
  {
    const s = randInt(3, max);
    const who = pick(NAMES);
    if (chance(0.5)) {
      qs.push(typed(`${who}'s square garden has an area of ${s * s} m². How long is each side?`, String(s), `The area of a square is side × side, so the side is √${s * s} = ${s} m.`, "number", { suffix: "m" }));
    } else {
      qs.push(typed(`A square floor tile has sides of ${s} cm. What is its area?`, String(s * s), `Area of a square = side × side = ${s} × ${s} = ${s * s} cm².`, "number", { suffix: "cm²" }));
    }
  }
  {
    const k = randInt(4, Math.min(max, 14));
    const j = randInt(1, 2 * k);
    const N = k * k + j;
    const near = j <= k ? k : k + 1;
    qs.push(
      numQ(
        `√${N} is closest to which whole number?`,
        near,
        [k - 1, k + 1, k + 2, k],
        `${k}² = ${k * k} and ${(k + 1) * (k + 1)} = ${k + 1}². ${N} is closer to ${near * near}, so √${N} is closest to ${near}.`,
        undefined,
        { min: 1 },
      ),
    );
  }
  {
    const a = randInt(4, 12);
    const N = a * a + randInt(1, a);
    qs.push(
      textQ(
        `Which is greater, √${N} or ${a}?`,
        `√${N}`,
        [`${a}`, `They are equal`],
        `${a}² = ${a * a}, and ${N} is more than ${a * a}. So √${N} is a little more than ${a}.`,
      ),
    );
  }
  {
    const n = randInt(2, level === 1 ? 5 : 10);
    if (chance(0.5)) {
      qs.push(typed(`What is ${n}³?`, String(n ** 3), `${n}³ means ${n} × ${n} × ${n} = ${n * n} × ${n} = ${n ** 3}.`, "number"));
    } else {
      qs.push(typed(`What is the cube root of ${n ** 3}? (∛${n ** 3})`, String(n), `Which number multiplied by itself three times makes ${n ** 3}? ${n} × ${n} × ${n} = ${n ** 3}, so ∛${n ** 3} = ${n}.`, "number"));
    }
  }
  {
    const n = randInt(2, 9);
    const near = [n ** 3 + 1, n ** 3 - 1, n * n + n, 3 * n * n].filter((x) => !Number.isInteger(Math.cbrt(x)) && x > 0);
    qs.push(
      textChoice(
        "Which of these numbers is a perfect cube?",
        String(n ** 3),
        near.slice(0, 3).map(String),
        `A perfect cube is a whole number multiplied by itself three times. ${n} × ${n} × ${n} = ${n ** 3}.`,
      ),
    );
  }
  return qs;
}

// ---------- 3. Ratios, Rates & Proportions ----------

function ratiosAndRates(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // Simplify a ratio.
  {
    const g = randInt(2, level === 1 ? 4 : 8);
    let a: number, b: number;
    do {
      a = randInt(1, 6);
      b = randInt(1, 7);
    } while (a === b || gcd(a, b) !== 1);
    const [x, y] = [a * g, b * g];
    qs.push(
      textQ(
        `A bag has ${x} red marbles and ${y} blue marbles. What is the ratio of red to blue in lowest terms?`,
        `${a}:${b}`,
        [`${b}:${a}`, `${x}:${y}`, `${a}:${a + b}`, `${a + 1}:${b + 1}`],
        `Divide both parts by their greatest common factor, ${g}: ${x} ÷ ${g} = ${a} and ${y} ÷ ${g} = ${b}.`,
      ),
    );
  }

  // Missing term of an equivalent ratio.
  {
    const a = randInt(2, 7);
    const b = randInt(a + 1, 9);
    const k = randInt(2, level === 1 ? 5 : 9);
    qs.push(
      typed(
        `${a} : ${b} = ${a * k} : ?`,
        String(b * k),
        `${a} was multiplied by ${k} to get ${a * k}, so multiply ${b} by ${k} too: ${b} × ${k} = ${b * k}.`,
        "number",
      ),
    );
  }

  // Unit price.
  {
    const n = pick([2, 4, 5, 8, 10]);
    const unitCents = randInt(1, 24) * 5;
    const total = n * unitCents;
    qs.push(
      typed(
        `${n} notebooks cost $${(total / 100).toFixed(2)}. What is the price of one notebook, in dollars?`,
        (unitCents / 100).toFixed(2),
        `Divide the total by the number of notebooks: $${(total / 100).toFixed(2)} ÷ ${n} = $${(unitCents / 100).toFixed(2)}.`,
        "decimal",
      ),
    );
  }

  // Speed.
  {
    const speed = randInt(4, level === 1 ? 12 : 30) * (level === 1 ? 5 : 4);
    const t = randInt(2, 6);
    qs.push(
      typed(
        `A cyclist rides ${speed * t} km in ${t} hours at a steady pace. What is the speed in km per hour?`,
        String(speed),
        `Speed is distance ÷ time: ${speed * t} ÷ ${t} = ${speed} km/h.`,
        "number",
        { suffix: "km/h" },
      ),
    );
  }

  // Best buy.
  {
    const baseCents = randInt(4, 12) * 5;
    const n1 = pick([4, 6, 8]);
    const n2 = n1 * pick([2, 3]);
    const total1 = n1 * baseCents;
    const total2 = Math.round(n2 * baseCents * pick([0.8, 0.85, 0.9, 1.1]));
    const u1 = total1 / n1;
    const u2 = total2 / n2;
    const better = u1 < u2 ? "Pack A" : "Pack B";
    if (u1 !== u2) {
      qs.push(
        textQ(
          `Pack A: ${n1} juice boxes for $${(total1 / 100).toFixed(2)}. Pack B: ${n2} juice boxes for $${(total2 / 100).toFixed(2)}. Which pack is the better buy?`,
          better,
          [better === "Pack A" ? "Pack B" : "Pack A", "They cost the same per box"],
          `Compare the price per box: Pack A is about ${(u1 / 100).toFixed(2)} each and Pack B is about ${(u2 / 100).toFixed(2)} each. The lower unit price is the better buy.`,
        ),
      );
    } else {
      qs.push(typed(`${n1} juice boxes cost $${(total1 / 100).toFixed(2)}. How much is 1 box, in dollars?`, (u1 / 100).toFixed(2), `Divide: $${(total1 / 100).toFixed(2)} ÷ ${n1}.`, "decimal"));
    }
  }

  // Scaling a recipe.
  {
    const cups = pick([2, 3, 4, 5, 6]);
    const batches = pick([2, 3, 4, 5]);
    const people = pick([4, 6]);
    qs.push(
      typed(
        `A recipe for ${people} people uses ${cups} cups of rice. How many cups are needed for ${people * batches} people?`,
        String(cups * batches),
        `${people * batches} people is ${batches} times as many as ${people}, so use ${batches} times the rice: ${cups} × ${batches} = ${cups * batches} cups.`,
        "number",
        { suffix: "cups" },
      ),
    );
  }

  // Map scale.
  {
    const per = pick([2, 5, 10, 20, 50]);
    const cm = randInt(2, 12);
    qs.push(
      typed(
        `On a map, 1 cm stands for ${per} km. Two towns are ${cm} cm apart on the map. How far apart are they in real life?`,
        String(cm * per),
        `Each centimetre is ${per} km, so ${cm} cm × ${per} km = ${cm * per} km.`,
        "number",
        { suffix: "km" },
      ),
    );
  }

  // Part to percent.
  {
    const whole = pick([20, 25, 40, 50, 80, 100, 200]);
    const pct = pick([5, 10, 15, 20, 25, 30, 40, 60, 75]);
    const part = (whole * pct) / 100;
    if (Number.isInteger(part)) {
      qs.push(
        typed(
          `${part} out of ${whole} students walk to school. What percent walk?`,
          String(pct),
          `Part ÷ whole = ${part} ÷ ${whole} = ${fmt(part / whole)}, which is ${pct}%.`,
          "number",
          { suffix: "%" },
        ),
      );
    } else {
      qs.push(typed(`What is 10% of ${whole * 10}?`, String(whole), `10% means one tenth: ${whole * 10} ÷ 10 = ${whole}.`, "number"));
    }
  }
  return qs;
}

// ---------- 4. Percents & Money ----------

function percentsAndMoney(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];
  const dollars = (cents: number): string => (cents / 100).toFixed(2);

  // A percent of a number.
  {
    const pct = pick([5, 10, 15, 20, 25, 30, 40, 60, 75]);
    const base = pick([20, 40, 60, 80, 120, 200]);
    const ans = (pct * base) / 100;
    if (Number.isInteger(ans)) {
      qs.push(typed(`What is ${pct}% of ${base}?`, String(ans), `${pct}% = ${pct}/100. ${pct}/100 × ${base} = ${ans}.`, "number"));
    }
  }

  // A part as a percent.
  {
    const whole = pick([20, 25, 40, 50, 80, 200]);
    const pct = pick([10, 20, 30, 40, 60, 75, 80]);
    const part = (whole * pct) / 100;
    if (Number.isInteger(part)) {
      qs.push(typed(`${part} out of ${whole} students walk to school. What percent walk?`, String(pct), `Part ÷ whole = ${part} ÷ ${whole} = ${fmt(part / whole)}, which is ${pct}%.`, "number", { suffix: "%" }));
    } else {
      qs.push(typed(`What is 10% of ${whole * 10}?`, String(whole), `10% is one tenth: ${whole * 10} ÷ 10 = ${whole}.`, "number"));
    }
  }

  // Percents beyond the usual range.
  {
    const k = pick([150, 200, 250]);
    const base = pick([20, 40, 60, 80]);
    if (chance(0.5)) {
      qs.push(typed(`What is ${k}% of ${base}?`, String((k * base) / 100), `${k}% is more than the whole: ${k}/100 × ${base} = ${(k * base) / 100}.`, "number"));
    } else {
      const base2 = pick([1000, 2000, 4000, 5000]);
      qs.push(typed(`What is 0.5% of ${base2}?`, String(base2 / 200), `0.5% is half of 1%. 1% of ${base2} is ${base2 / 100}, so 0.5% is ${base2 / 200}.`, "number"));
    }
  }

  // Fraction, decimal and percent.
  {
    const pairs: [string, string, string][] = [["3/4", "0.75", "75%"], ["1/5", "0.2", "20%"], ["3/8", "0.375", "37.5%"], ["7/10", "0.7", "70%"], ["1/8", "0.125", "12.5%"], ["2/5", "0.4", "40%"]];
    const [f, d, p] = pick(pairs);
    const others = pairs.filter((x) => x[2] !== p).map((x) => x[2]);
    qs.push(textQ(`Which percent is equal to ${f}?`, p, sample(others, 3), `${f} = ${d} as a decimal, and ${d} × 100 = ${p}.`));
  }

  // Discount.
  {
    const price = pick([20, 40, 60, 80, 120, 200]);
    const off = pick([10, 20, 25, 50]);
    const sale = price - (price * off) / 100;
    qs.push(
      typed(
        `A jacket costs $${price}. It is on sale for ${off}% off. What is the sale price, in dollars?`,
        fmt(sale),
        `${off}% of ${price} is ${(price * off) / 100}. Subtract: ${price} − ${(price * off) / 100} = ${sale}.`,
        "decimal",
      ),
    );
  }

  // Tax.
  {
    const price = pick([25, 50, 75, 100, 150, 200]);
    const rate = 12;
    const tax = (price * rate) / 100;
    qs.push(
      typed(
        `A bike helmet costs $${price} before tax. The tax rate is ${rate}% (GST 5% plus PST 7%). How much is the total, in dollars?`,
        fmt(price + tax),
        `Tax = ${rate}% of ${price} = ${tax}. Total = ${price} + ${tax} = ${price + tax}.`,
        "decimal",
      ),
    );
  }

  // Budget.
  {
    const income = pick([200, 250, 300, 400]);
    const a = pick([40, 50, 60]);
    const b = pick([30, 45, 55]);
    const c = pick([20, 25, 35]);
    qs.push(
      typed(
        `Ana earns $${income} a month. She budgets $${a} for transit, $${b} for food and $${c} for fun. How much is left to save, in dollars?`,
        String(income - a - b - c),
        `Add the spending: ${a} + ${b} + ${c} = ${a + b + c}. Savings = ${income} − ${a + b + c} = ${income - a - b - c}.`,
        "number",
      ),
    );
  }

  // Transaction and change.
  {
    const n = randInt(2, 4);
    const unit = randInt(2, 9) * 50 + (chance(0.5) ? 25 : 0);
    const paid = 5000;
    const total = n * unit;
    qs.push(
      typed(
        `Leo buys ${n} notebooks at $${dollars(unit)} each and pays with a $50 bill. How much change does he get, in dollars?`,
        dollars(paid - total),
        `Cost = ${n} × $${dollars(unit)} = $${dollars(total)}. Change = $50.00 − $${dollars(total)} = $${dollars(paid - total)}.`,
        "decimal",
        { accept: [fmt((paid - total) / 100)] },
      ),
    );
  }

  // Which is more?
  {
    const pct = pick([30, 45, 60, 70]);
    const fr: [number, number] = pick<[number, number]>([[1, 3], [2, 5], [3, 4], [5, 8], [1, 2]]);
    const frPct = (fr[0] / fr[1]) * 100;
    if (Math.abs(frPct - pct) > 1) {
      const bigger = frPct > pct ? `${fr[0]}/${fr[1]}` : `${pct}%`;
      qs.push(
        textQ(
          `Which is greater, ${fr[0]}/${fr[1]} or ${pct}%?`,
          bigger,
          [frPct > pct ? `${pct}%` : `${fr[0]}/${fr[1]}`, "They are equal"],
          `Write ${fr[0]}/${fr[1]} as a percent: ${fr[0]} ÷ ${fr[1]} = ${fmt(Math.round(frPct * 10) / 10)}%. Compare it with ${pct}%.`,
        ),
      );
    }
  }
  void level;
  return qs;
}

// ---------- 5. Discrete Patterns & Two-Step Equations ----------

function linearEquations(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // ax + b = c, and ax − b = c.
  {
    const a = randInt(2, level === 1 ? 5 : 9);
    const x = randInt(-6, 12) || 3;
    const b = randInt(1, 15);
    const sign = chance(0.5) ? 1 : -1;
    const c = a * x + sign * b;
    qs.push(
      typed(
        `Solve for x: ${a}x ${sign > 0 ? "+" : "−"} ${b} = ${c < 0 ? `−${-c}` : c}`,
        String(x),
        `Undo the ${sign > 0 ? "addition" : "subtraction"} first: ${a}x = ${c} ${sign > 0 ? "−" : "+"} ${b} = ${c - sign * b}. Then divide by ${a}: x = ${x}.`,
        "integer",
      ),
    );
  }

  // Division form.
  {
    const n = randInt(2, 6);
    const x = randInt(2, 9) * n;
    const b = randInt(1, 9);
    qs.push(typed(`Solve for x: x ÷ ${n} + ${b} = ${x / n + b}`, String(x), `Subtract ${b}: x ÷ ${n} = ${x / n}. Multiply both sides by ${n}: x = ${x}.`, "integer"));
  }

  // Another two-step.
  {
    const a = randInt(2, 7);
    const x = randInt(1, 10);
    const c = randInt(2, 6) * a;
    qs.push(
      typed(
        `Solve for n: ${a * x + c} = ${a}n + ${c}`,
        String(x),
        `Subtract ${c} from both sides: ${a * x} = ${a}n. Divide by ${a}: n = ${x}.`,
        "integer",
      ),
    );
  }

  // Evaluate an expression.
  {
    const m = randInt(2, 7);
    const b = randInt(1, 9);
    const n = randInt(2, 9);
    qs.push(typed(`Evaluate ${m}n + ${b} when n = ${n}.`, String(m * n + b), `Replace n with ${n}: ${m} × ${n} + ${b} = ${m * n} + ${b} = ${m * n + b}.`, "number"));
  }

  // Write an expression.
  {
    const a = randInt(2, 6);
    const b = randInt(2, 9);
    qs.push(
      textQ(
        `Which expression means “${b} more than ${a} times a number n”?`,
        `${a}n + ${b}`,
        [`${a + b}n`, `${a}(n + ${b})`, `${b}n + ${a}`, `${a}n − ${b}`],
        `“${a} times a number” is ${a}n. “${b} more than” that means add ${b}: ${a}n + ${b}.`,
      ),
    );
  }

  // Write the equation.
  {
    const a = randInt(2, 6);
    const b = randInt(2, 15);
    const x = randInt(2, 9);
    const c = a * x + b;
    qs.push(
      textQ(
        `I think of a number, multiply it by ${a} and add ${b}. The result is ${c}. Which equation matches?`,
        `${a}n + ${b} = ${c}`,
        [`${a}(n + ${b}) = ${c}`, `${a} + ${b}n = ${c}`, `n + ${a * b} = ${c}`, `${a}n − ${b} = ${c}`],
        `"Multiply by ${a}" gives ${a}n, then "add ${b}" gives ${a}n + ${b}, and that equals ${c}.`,
      ),
    );
  }

  // A discrete relation: whole numbers of items.
  {
    const fee = randInt(2, 6);
    const each = randInt(3, 9);
    const k = randInt(4, 12);
    qs.push(
      typed(
        `A school play charges a $${fee} booking fee plus $${each} per ticket. How much do ${k} tickets cost, in dollars?`,
        String(fee + each * k),
        `Cost = ${each} × ${k} + ${fee} = ${each * k} + ${fee} = ${fee + each * k}. (You can only buy whole tickets, so this is a discrete relation.)`,
        "number",
      ),
    );
  }

  // Pattern table and rule.
  {
    const m = randInt(2, 5);
    const b = randInt(1, 6);
    const visual: Visual = { type: "table", headers: ["Figure number (n)", "Number of tiles"], rows: [1, 2, 3, 4].map((n) => [n, m * n + b]) };
    qs.push(
      typed(
        `A growing pattern of tiles follows the rule in the table. How many tiles are in figure 10?`,
        String(m * 10 + b),
        `The tiles go up by ${m} each figure and figure 1 has ${m + b}. The rule is ${m}n + ${b}. For n = 10: ${m * 10} + ${b} = ${m * 10 + b}.`,
        "number",
        { visual },
      ),
    );
  }

  // Is it a solution?
  {
    const a = randInt(2, 6);
    const x = randInt(2, 9);
    const b = randInt(1, 9);
    const c = a * x + b;
    const guess = chance(0.5) ? x : x + randInt(1, 3);
    qs.push(
      textQ(
        `Is x = ${guess} a solution of ${a}x + ${b} = ${c}?`,
        guess === x ? "Yes" : "No",
        [guess === x ? "No" : "Yes"],
        `Substitute x = ${guess}: ${a} × ${guess} + ${b} = ${a * guess + b}. That ${a * guess + b === c ? "equals" : "does not equal"} ${c}.`,
      ),
    );
  }
  return qs.slice(0, 10);
}

// ---------- 6. Pythagorean Theorem ----------

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
];

function pythagorean(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];
  const triple = (): [number, number, number] => {
    const [a, b, c] = pick(level === 1 ? TRIPLES.slice(0, 2) : TRIPLES);
    const k = level === 1 ? randInt(1, 3) : randInt(1, 4);
    return chance(0.5) ? [a * k, b * k, c * k] : [b * k, a * k, c * k];
  };

  // Hypotenuse.
  {
    const [a, b, c] = triple();
    qs.push(
      typed(
        `A right triangle has legs of ${a} cm and ${b} cm. How long is the hypotenuse?`,
        String(c),
        `c² = a² + b² = ${a * a} + ${b * b} = ${c * c}, so c = √${c * c} = ${c} cm.`,
        "number",
        { suffix: "cm", visual: { type: "shape", shape: "triangle" } },
      ),
    );
  }

  // A missing leg.
  {
    const [a, b, c] = triple();
    qs.push(
      typed(
        `The hypotenuse of a right triangle is ${c} cm and one leg is ${a} cm. How long is the other leg?`,
        String(b),
        `b² = c² − a² = ${c * c} − ${a * a} = ${b * b}, so b = √${b * b} = ${b} cm.`,
        "number",
        { suffix: "cm", visual: { type: "shape", shape: "triangle" } },
      ),
    );
  }

  // Is it a right triangle?
  {
    const [a, b, c] = triple();
    const right = chance(0.5);
    const sides = right ? [a, b, c] : [a, b, c + randInt(1, 2)];
    const sorted = [...sides].sort((x, y) => x - y);
    const [s, t, u] = sorted;
    qs.push(
      textQ(
        `A triangle has sides ${s} cm, ${t} cm and ${u} cm. Is it a right triangle?`,
        right ? "Yes" : "No",
        [right ? "No" : "Yes"],
        `Check whether ${s}² + ${t}² = ${u}²: ${s * s} + ${t * t} = ${s * s + t * t}, and ${u}² = ${u * u}. They ${right ? "match" : "do not match"}.`,
      ),
    );
  }

  // Ladder.
  {
    const [a, b, c] = triple();
    qs.push(
      typed(
        `A ladder leans against a wall. Its foot is ${a} m from the wall and it reaches ${b} m up the wall. How long is the ladder?`,
        String(c),
        `The wall, ground and ladder make a right triangle. c² = ${a}² + ${b}² = ${a * a + b * b}, so c = ${c} m.`,
        "number",
        { suffix: "m" },
      ),
    );
  }

  // Rectangle diagonal.
  {
    const [a, b, c] = triple();
    qs.push(
      typed(
        `A rectangular field is ${a} m by ${b} m. How long is the diagonal across the field?`,
        String(c),
        `The diagonal is the hypotenuse of a right triangle with legs ${a} m and ${b} m: √(${a * a} + ${b * b}) = √${c * c} = ${c} m.`,
        "number",
        { suffix: "m" },
      ),
    );
  }

  // Not a whole number.
  {
    let a: number, b: number, c: number;
    do {
      a = randInt(2, 9);
      b = randInt(2, 9);
      const raw = Math.sqrt(a * a + b * b) * 10;
      c = Math.round(raw) / 10;
      if (Math.abs(raw - Math.floor(raw) - 0.5) < 0.05) c = -1;
    } while (c < 0 || Number.isInteger(c * c) || Number.isInteger(Math.sqrt(a * a + b * b)));
    qs.push(
      numQ(
        `The legs of a right triangle are ${a} cm and ${b} cm. What is the hypotenuse, rounded to 1 decimal place?`,
        c,
        [roundTo(a + b, 1), roundTo(Math.sqrt(Math.abs(b * b - a * a)) || c + 1, 1), c + 0.1, c - 0.1],
        `c² = ${a}² + ${b}² = ${a * a + b * b}. √${a * a + b * b} ≈ ${c.toFixed(1)}.`,
        undefined,
        { unit: " cm", step: 0.1, min: 0.1, format: (n) => n.toFixed(1) },
      ),
    );
  }

  // Squares on the sides.
  {
    const [a, b, c] = triple();
    qs.push(
      typed(
        `The squares drawn on the two legs of a right triangle have areas of ${a * a} cm² and ${b * b} cm². What is the area of the square on the hypotenuse?`,
        String(c * c),
        `The Pythagorean theorem says the two smaller squares add up to the largest: ${a * a} + ${b * b} = ${c * c} cm².`,
        "number",
        { suffix: "cm²" },
      ),
    );
  }

  // Concept.
  qs.push(
    textQ(
      "In a right triangle, the hypotenuse is…",
      "the longest side, opposite the right angle",
      ["the shortest side", "any side next to the right angle", "the side that is always 90°"],
      "The hypotenuse faces the right angle, and it is always the longest side.",
    ),
  );
  return qs;
}

// ---------- 7. Surface Area & Volume ----------

const SOLIDS_CONCEPTS: Concept[] = [
  {
    levels: [1, 2, 3],
    prompt: "Which is measured in cubic units, like cm³?",
    right: "volume",
    wrong: ["surface area", "perimeter", "the length of an edge"],
    hint: "Volume is the space inside a solid, counted in cubes. Surface area is measured in square units.",
  },
  {
    levels: [1, 2, 3],
    prompt: "How many faces does a rectangular prism have?",
    right: "6",
    wrong: ["4", "5", "8"],
    hint: "A box has a top, a bottom, a front, a back and two sides: 6 faces.",
  },
  {
    levels: [1, 2, 3],
    prompt: "How many faces does a triangular prism have?",
    right: "5",
    wrong: ["3", "4", "6"],
    hint: "Two triangles (the ends) and three rectangles (the sides) make 5 faces.",
  },
  {
    levels: [2, 3],
    prompt: "A net of a cylinder is made of…",
    right: "2 circles and 1 rectangle",
    wrong: ["1 circle and 2 rectangles", "3 circles", "2 circles and 2 rectangles"],
    hint: "Unroll a can: the label is a rectangle, and the top and bottom are circles.",
  },
  {
    levels: [1, 2, 3],
    prompt: "Looking straight down at the top of a cylinder, which shape do you see?",
    right: "a circle",
    wrong: ["a rectangle", "a triangle", "an oval with no edge"],
    hint: "The top face of a cylinder is a circle. The side view is a rectangle.",
  },
  {
    levels: [2, 3],
    prompt: "Which 3D object has a net made of one square and four triangles?",
    right: "a square pyramid",
    wrong: ["a cube", "a triangular prism", "a cone"],
    hint: "A square pyramid has a square base and four triangular faces that meet at the top.",
  },
  {
    levels: [2, 3],
    prompt: "A front view of a cone, seen from the side, is a…",
    right: "triangle",
    wrong: ["circle", "rectangle", "square"],
    hint: "From the side, a cone looks like a triangle. From above, it looks like a circle.",
  },
  {
    levels: [2, 3],
    prompt: "1 cm³ holds exactly how much water?",
    right: "1 mL",
    wrong: ["1 L", "10 mL", "100 mL"],
    hint: "A cube 1 cm on each side holds 1 millilitre. 1000 cm³ holds 1 litre.",
  },
];

function surfaceAreaVolume(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const hi = level === 1 ? 6 : level === 2 ? 10 : 15;
  const qs: Question[] = [];

  {
    const l = randInt(2, hi);
    const w = randInt(2, hi);
    const h = randInt(2, hi);
    const sa = 2 * (l * w + l * h + w * h);
    qs.push(
      typed(
        `A box is ${l} cm long, ${w} cm wide and ${h} cm tall. What is its surface area?`,
        String(sa),
        `Add the areas of the 3 pairs of faces: 2 × (${l}×${w} + ${l}×${h} + ${w}×${h}) = 2 × ${l * w + l * h + w * h} = ${sa} cm².`,
        "number",
        { suffix: "cm²", visual: { type: "shape", shape: "rectangular-prism" } },
      ),
    );
  }
  {
    const e = randInt(2, hi);
    qs.push(typed(`A cube has edges of ${e} cm. What is its surface area?`, String(6 * e * e), `A cube has 6 identical square faces: 6 × ${e}² = 6 × ${e * e} = ${6 * e * e} cm².`, "number", { suffix: "cm²", visual: { type: "shape", shape: "cube" } }));
  }
  {
    const b = 2 * randInt(2, hi);
    const h = randInt(2, hi);
    const len = randInt(3, hi + 3);
    const area = (b * h) / 2;
    qs.push(
      typed(
        `A triangular prism has a triangle base of ${b} cm and height ${h} cm. The prism is ${len} cm long. What is its volume?`,
        String(area * len),
        `Area of the triangle = ½ × ${b} × ${h} = ${area} cm². Volume = base area × length = ${area} × ${len} = ${area * len} cm³.`,
        "number",
        { suffix: "cm³" },
      ),
    );
  }
  {
    const r = randInt(2, level === 1 ? 5 : 9);
    const h = randInt(3, level === 1 ? 10 : 20);
    const p = piAnswer(r * r * h);
    qs.push(
      typed(
        `A cylinder has a radius of ${r} cm and a height of ${h} cm. What is its volume? ${ROUND_NOTE}`,
        p.answer,
        `V = π × r² × h ≈ 3.14 × ${r * r} × ${h} = ${fmt(p.exact)}. Rounded: ${p.answer} cm³.`,
        "decimal",
        { accept: p.accept, suffix: "cm³", visual: { type: "shape", shape: "cylinder" } },
      ),
    );
  }
  {
    const r = randInt(2, level === 1 ? 5 : 9);
    const h = randInt(3, level === 1 ? 10 : 20);
    const p = piAnswer(2 * r * (r + h));
    qs.push(
      typed(
        `What is the surface area of a closed cylinder with radius ${r} cm and height ${h} cm? ${ROUND_NOTE}`,
        p.answer,
        `SA = 2πr² + 2πrh = 2π × ${r} × (${r} + ${h}) ≈ 3.14 × ${2 * r * (r + h)} = ${fmt(p.exact)}. Rounded: ${p.answer} cm².`,
        "decimal",
        { accept: p.accept, suffix: "cm²", visual: { type: "shape", shape: "cylinder" } },
      ),
    );
  }
  {
    const l = randInt(2, 10);
    const w = randInt(2, 10);
    const h = randInt(2, 12);
    qs.push(
      typed(
        `A box with a volume of ${l * w * h} cm³ is ${l} cm long and ${w} cm wide. How tall is it?`,
        String(h),
        `Volume = l × w × h, so h = ${l * w * h} ÷ (${l} × ${w}) = ${l * w * h} ÷ ${l * w} = ${h} cm.`,
        "number",
        { suffix: "cm" },
      ),
    );
  }
  {
    const v = randInt(2, 9) * 500;
    qs.push(
      typed(
        `A fish tank holds ${v} cm³ of water. How many millilitres is that?`,
        String(v),
        "1 cm³ holds exactly 1 mL, so the number stays the same.",
        "number",
        { suffix: "mL" },
      ),
    );
  }
  qs.push(conceptQ(SOLIDS_CONCEPTS, level));
  return qs;
}

// ---------- 8. Probability & Data ----------

function probabilityAndData(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const qs: Question[] = [];

  // Sample space.
  {
    const a = randInt(2, level === 1 ? 4 : 6);
    const b = randInt(2, level === 1 ? 4 : 6);
    const c = level === 3 ? randInt(2, 3) : 1;
    qs.push(
      typed(
        `${c > 1 ? `A lunch menu has ${a} sandwiches, ${b} drinks and ${c} desserts. How many different lunches` : `A shop sells ${a} kinds of shirts and ${b} kinds of pants. How many different outfits`} can you make with one of each?`,
        String(a * b * c),
        `Multiply the choices: ${a} × ${b}${c > 1 ? ` × ${c}` : ""} = ${a * b * c}.`,
        "number",
      ),
    );
  }

  // Theoretical probability.
  {
    const red = randInt(1, 6);
    const blue = randInt(1, 6);
    const green = randInt(1, 6);
    const total = red + blue + green;
    qs.push(
      typed(
        `A bag has ${red} red, ${blue} blue and ${green} green marbles. What is the probability of picking a blue marble? Type it as a fraction in lowest terms.`,
        frac(blue, total),
        `P(blue) = favourable ÷ total = ${blue}/${total}, which is ${frac(blue, total)} in lowest terms.`,
        "fraction",
        { accept: [`${blue}/${total}`] },
      ),
    );
    qs.push(
      typed(
        `A bag has ${red} red, ${blue} blue and ${green} green marbles. What is the probability of NOT picking blue? Type a fraction in lowest terms.`,
        frac(total - blue, total),
        `Not blue means red or green: ${red} + ${green} = ${total - blue} marbles out of ${total}. That is ${frac(total - blue, total)}. (Or 1 − ${blue}/${total}.)`,
        "fraction",
        { accept: [`${total - blue}/${total}`] },
      ),
    );
  }

  // Experimental probability.
  {
    const trials = pick([20, 25, 40, 50]);
    const hits = randInt(3, trials - 3);
    qs.push(
      typed(
        `Sam spins a spinner ${trials} times and it lands on green ${hits} times. What is the experimental probability of green? Type a fraction in lowest terms.`,
        frac(hits, trials),
        `Experimental probability = successes ÷ trials = ${hits}/${trials} = ${frac(hits, trials)}.`,
        "fraction",
        { accept: [`${hits}/${trials}`] },
      ),
    );
  }

  // Expected number.
  {
    const d = pick([2, 3, 4, 5, 6, 10]);
    const n = randInt(1, d - 1);
    const times = d * randInt(3, 10);
    qs.push(
      typed(
        `A spinner lands on blue with probability ${n}/${d}. About how many blue spins do you expect in ${times} spins?`,
        String((n * times) / d),
        `Expected number = probability × trials = ${n}/${d} × ${times} = ${(n * times) / d}.`,
        "number",
      ),
    );
  }

  // Mean.
  {
    const len = level === 1 ? 4 : 5;
    const mean = randInt(5, 20);
    const data: number[] = [];
    for (let i = 0; i < len - 1; i++) data.push(mean + randInt(-4, 4));
    const last = mean * len - data.reduce((s, v) => s + v, 0);
    data.push(last);
    if (last > 0) {
      qs.push(
        typed(
          `What is the mean of these numbers? ${data.join(", ")}`,
          String(mean),
          `Add them up: ${data.join(" + ")} = ${mean * len}. Divide by ${len}: ${mean * len} ÷ ${len} = ${mean}.`,
          "number",
        ),
      );
    }
  }

  // Median.
  {
    const set = sample([3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 20, 22], 5);
    const sorted = [...set].sort((a, b) => a - b);
    qs.push(
      typed(
        `What is the median of ${set.join(", ")}?`,
        String(sorted[2]),
        `Put them in order: ${sorted.join(", ")}. The middle number is ${sorted[2]}.`,
        "number",
      ),
    );
  }

  // Outlier.
  qs.push(
    textQ(
      "A data set has one extremely large value (an outlier). Which measure changes the most because of it?",
      "the mean",
      ["the median", "the mode", "the number of values"],
      "The mean uses every value, so one huge number pulls it up. The median only cares about the middle position.",
    ),
  );

  // Mode.
  {
    const m = randInt(3, 15);
    const rest = sample([2, 4, 5, 6, 8, 9, 11, 12, 16, 18].filter((n) => n !== m), 4);
    const set = shuffle([m, m, m, ...rest.slice(0, 3)]);
    qs.push(typed(`What is the mode of ${set.join(", ")}?`, String(m), `The mode is the value that appears most often. ${m} appears 3 times.`, "number"));
  }

  // Range.
  {
    const set = sample([4, 7, 9, 12, 15, 18, 21, 25, 30], 5);
    qs.push(typed(`What is the range of ${set.join(", ")}?`, String(Math.max(...set) - Math.min(...set)), `Range = greatest − least = ${Math.max(...set)} − ${Math.min(...set)} = ${Math.max(...set) - Math.min(...set)}.`, "number"));
  }
  return qs.slice(0, 10);
}

// ---------- Course ----------

export const course: Course = {
  grade: "8",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
      "Number represents, describes, and compares the quantities of ratios, rates, and percents.",
      "Computational fluency and flexibility with numbers extend to operations with fractions.",
      "Discrete linear relations can be represented in many connected ways and used to identify and make generalizations.",
      "The Pythagorean theorem and the surface area and volume of 3D objects can be used to describe, measure, and compare spatial relationships.",
      "Analyzing data by determining averages is one way to make sense of large data sets and enables us to compare and interpret.",
    ],
  },
  units: [
    {
      id: "fraction-operations",
      title: "Fraction Operations",
      emoji: "🍕",
      blurb: "Add, subtract, multiply and divide",
      standards: { "ca-bc": "Operations with fractions: addition, subtraction, multiplication and division, including mixed numbers" },
      parentNote:
        "Adding and subtracting fractions with unlike denominators, multiplying and dividing fractions, switching between mixed numbers and improper fractions, and finding a fraction of an amount.",
      generate: fractionOps,
    },
    {
      id: "squares-and-roots",
      title: "Squares, Cubes & Roots",
      emoji: "🟦",
      blurb: "Perfect squares and cubes, and their roots",
      standards: { "ca-bc": "Perfect squares and cubes; square and cube roots; estimating square roots" },
      parentNote:
        "Knowing perfect squares and cubes, finding square roots and cube roots, estimating where a square root falls between whole numbers, and linking squares to the area of a square.",
      generate: squaresAndRoots,
    },
    {
      id: "ratios-and-rates",
      title: "Ratios, Rates & Proportions",
      emoji: "⚖️",
      blurb: "Unit rates, best buys and scale",
      standards: { "ca-bc": "Numerical proportional reasoning: ratios, rates and proportions" },
      parentNote:
        "Simplifying ratios, finding missing terms in equivalent ratios, comparing unit prices, working with speed, scaling recipes and map distances, and turning a part of a whole into a percent.",
      generate: ratiosAndRates,
    },
    {
      id: "percents-and-money",
      title: "Percents & Money",
      emoji: "💯",
      blurb: "Discounts, tax, budgets and change",
      standards: { "ca-bc": "Percents (including greater than 100% and less than 1%); financial literacy: simple budgets and transactions" },
      parentNote:
        "Finding a percent of a number, moving between fractions, decimals and percents, sale prices and sales tax (BC's 12%), simple monthly budgets, and making change.",
      generate: percentsAndMoney,
    },
    {
      id: "linear-equations",
      title: "Patterns & Two-Step Equations",
      emoji: "📈",
      blurb: "Expressions, patterns and solving for x",
      standards: { "ca-bc": "Discrete linear relations; expressions; two-step equations" },
      parentNote:
        "Writing and evaluating expressions like 3n + 2, solving two-step equations, and finding the rule for a growing pattern or a cost made of whole items such as tickets.",
      generate: linearEquations,
    },
    {
      id: "pythagorean-theorem",
      title: "Pythagorean Theorem",
      emoji: "📐",
      blurb: "Right triangles and a² + b² = c²",
      standards: { "ca-bc": "Pythagorean theorem: finding side lengths and testing for right triangles" },
      parentNote:
        "Finding a missing side of a right triangle, checking whether a triangle is a right triangle, and using the theorem for ladders and diagonals.",
      generate: pythagorean,
    },
    {
      id: "surface-area-volume",
      title: "Surface Area & Volume",
      emoji: "📦",
      blurb: "Prisms, cylinders, nets and views",
      standards: { "ca-bc": "Surface area and volume of right prisms and cylinders; nets and views of 3D objects" },
      parentNote:
        "Finding surface area and volume of boxes, cubes, triangular prisms and cylinders, working backwards to a missing dimension, linking cm³ to millilitres, and recognizing nets and views of 3D objects.",
      generate: surfaceAreaVolume,
    },
    {
      id: "probability-and-data",
      title: "Probability & Data",
      emoji: "🎲",
      blurb: "Chance, mean, median and mode",
      standards: { "ca-bc": "Theoretical probability; central tendency: mean, median and mode" },
      parentNote:
        "Counting outcomes, finding theoretical and experimental probabilities, predicting how often something will happen, and summarizing data with the mean, median and range.",
      generate: probabilityAndData,
    },
  ],
};
