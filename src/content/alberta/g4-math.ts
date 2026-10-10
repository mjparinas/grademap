import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { Question, Unit } from "../types";
import { NAMES, ab, buildSet, eq, levelOf, numQ, range, times, typeIn, type Level } from "./kit";

// Alberta Grade 4 mathematics (K–6 curriculum, outcomes 4N, 4A, 4G, 4M, 4P, 4T). These units are written for
// Alberta outcomes that the BC and Ontario courses do not cover at Grade 4: prime and composite numbers,
// the order of operations, fractions, decimals and percents, and triangle, quadrilateral and angle relationships.

const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};
const factorsOf = (n: number): number[] => range(1, n).filter((d) => n % d === 0);
const maxFor = (d: Level) => (d === 1 ? 30 : d === 2 ? 50 : 100);

// ---------- Prime and composite numbers (4N3.1) ----------

function classify(d: Level): Question {
  const n = pick(range(2, maxFor(d)));
  const prime = isPrime(n);
  const hint = prime
    ? `${n} has only two factors, 1 and ${n}, so it is prime.`
    : `${n} has more than two factors (${factorsOf(n).join(", ")}), so it is composite.`;
  return textChoice(`Is ${n} prime or composite?`, prime ? "prime" : "composite", [prime ? "composite" : "prime", "neither prime nor composite"], hint);
}

function whichPrime(d: Level): Question {
  const max = maxFor(d);
  const prime = pick(range(2, max).filter(isPrime));
  const looksPrime = range(9, max).filter((n) => n % 2 === 1 && !isPrime(n));
  const wrong = sample(looksPrime, 3);
  return textChoice("Which number is prime?", String(prime), wrong.map(String), `A prime number has only two factors: 1 and itself. ${wrong[0]} has factors ${factorsOf(wrong[0]).join(", ")}.`);
}

function whichComposite(d: Level): Question {
  const max = maxFor(d);
  const composite = pick(range(9, max).filter((n) => n % 2 === 1 && !isPrime(n)));
  const wrong = sample(range(3, max).filter(isPrime), 3);
  return textChoice("Which number is composite?", String(composite), wrong.map(String), `A composite number has more than two factors. ${composite} has factors ${factorsOf(composite).join(", ")}.`);
}

function factorCount(d: Level): Question {
  const n = pick(range(4, d === 1 ? 24 : 40));
  const count = factorsOf(n).length;
  return numQ(`How many factors does ${n} have?`, count, `List the factors in pairs: ${factorsOf(n).join(", ")}.`, undefined, 12, 1);
}

function isFactor(d: Level): Question {
  const n = pick(range(12, d === 1 ? 30 : 60).filter((x) => !isPrime(x)));
  const right = pick(factorsOf(n).filter((f) => f > 1 && f < n));
  const wrong = sample(range(2, n - 1).filter((x) => n % x !== 0), 3);
  return textChoice(`Which number is a factor of ${n}?`, String(right), wrong.map(String), `A factor divides ${n} with nothing left over. ${right} × ${n / right} = ${n}.`);
}

function missingFactor(d: Level): Question {
  const a = randInt(2, d === 1 ? 6 : 9);
  const b = randInt(3, d === 3 ? 12 : 9);
  return typeIn("What number goes in the box?", b, `Think of the related division: ${a * b} ÷ ${a} = ${b}.`, eq(`${a} × ☐ = ${a * b}`));
}

const PRIME_FACTS: Array<[string, string, string[], string]> = [
  ["Which is the only even prime number?", "2", ["4", "6", "8"], "Every other even number is divisible by 2, so it has at least three factors."],
  ["Is 1 prime, composite or neither?", "neither", ["prime", "composite", "both"], "1 has only one factor, itself. Prime numbers need exactly two factors."],
  ["Which statement is true?", "Every even number greater than 2 is composite", ["Every even number is prime", "Every odd number is prime", "Every number greater than 1 is prime"], "Even numbers greater than 2 have 1, 2 and themselves as factors, so they have more than two factors."],
];

function primeFact(): Question {
  const [prompt, right, wrong, hint] = pick(PRIME_FACTS);
  return textChoice(prompt, right, wrong, hint);
}

// ---------- Order of operations (4A1.1) ----------

interface Expr {
  text: string;
  value: number;
  /** The value you get by working strictly left to right (when it is a whole number and different). */
  trap?: number;
  /** For multiply/divide kinds: the operation to do first, and the tempting wrong one. */
  first?: string;
  other?: string;
}

function expression(d: Level, multOnly = false): Expr {
  const easy = ["a+bxc", "axb+c", "a-bxc"];
  const mid = [...easy, "a+b/c", "a/bxc"];
  const hard = ["a+bxc-d", "axb+cxd", "a-bxc", "a/bxc", "a+b/c"];
  const kinds = d === 1 ? easy : d === 2 ? [...mid, ...(multOnly ? [] : ["a-b+c"])] : hard;
  const kind = pick(kinds);
  const small = d === 1;
  switch (kind) {
    case "a+bxc": {
      const a = randInt(2, small ? 10 : 20), b = randInt(2, small ? 5 : 9), c = randInt(2, small ? 5 : 9);
      return { text: `${a} + ${b} × ${c}`, value: a + b * c, trap: (a + b) * c, first: `${b} × ${c}`, other: `${a} + ${b}` };
    }
    case "axb+c": {
      const a = randInt(2, small ? 5 : 9), b = randInt(2, small ? 5 : 9), c = randInt(2, small ? 10 : 20);
      return { text: `${a} × ${b} + ${c}`, value: a * b + c, trap: a * (b + c), first: `${a} × ${b}`, other: `${b} + ${c}` };
    }
    case "a-bxc": {
      const b = randInt(2, small ? 4 : 6), c = randInt(2, small ? 4 : 6), a = b * c + randInt(1, 15);
      return { text: `${a} − ${b} × ${c}`, value: a - b * c, trap: (a - b) * c, first: `${b} × ${c}`, other: `${a} − ${b}` };
    }
    case "a+b/c": {
      const c = randInt(2, 5), k = randInt(2, 9), a = randInt(2, 20), b = c * k;
      return { text: `${a} + ${b} ÷ ${c}`, value: a + k, trap: (a + b) % c === 0 ? (a + b) / c : undefined, first: `${b} ÷ ${c}`, other: `${a} + ${b}` };
    }
    case "a/bxc": {
      const b = randInt(2, 6), k = randInt(2, 9), c = randInt(2, 6), a = b * k;
      return { text: `${a} ÷ ${b} × ${c}`, value: k * c, trap: a % (b * c) === 0 ? a / (b * c) : undefined, first: `${a} ÷ ${b}`, other: `${b} × ${c}` };
    }
    case "a-b+c": {
      const a = randInt(12, 30), b = randInt(2, 9), c = randInt(2, 9);
      return { text: `${a} − ${b} + ${c}`, value: a - b + c, trap: a - (b + c) };
    }
    case "a+bxc-d": {
      const a = randInt(2, 15), b = randInt(2, 9), c = randInt(2, 9), d2 = randInt(1, Math.min(10, a + b * c - 1));
      return { text: `${a} + ${b} × ${c} − ${d2}`, value: a + b * c - d2, trap: (a + b) * c - d2 };
    }
    default: {
      const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 9), d2 = randInt(2, 9);
      return { text: `${a} × ${b} + ${c} × ${d2}`, value: a * b + c * d2, trap: (a * b + c) * d2 };
    }
  }
}

const ORDER_HINT = "Multiply and divide first (left to right), then add and subtract (left to right).";

function evalInput(d: Level): Question {
  const e = expression(d);
  return typeIn("Use the order of operations to solve.", e.value, ORDER_HINT, eq(`${e.text} = ?`));
}

function evalChoice(d: Level): Question {
  const e = expression(d);
  const wrong = new Set<number>();
  if (e.trap !== undefined && e.trap !== e.value && e.trap >= 0) wrong.add(e.trap);
  for (const off of shuffle([1, -1, 2, -2, 3, -3, 10, -10, 4, -4])) {
    if (wrong.size >= 3) break;
    const n = e.value + off;
    if (n >= 0 && n !== e.value) wrong.add(n);
  }
  return textChoice("What is the value of this expression?", String(e.value), [...wrong].map(String), ORDER_HINT, eq(e.text));
}

function firstStep(d: Level): Question {
  const e = expression(d === 1 ? 1 : 2, true);
  if (!e.first || !e.other) return firstStep(d);
  return textChoice(`In ${e.text}, which step do you do first?`, e.first, [e.other, "it does not matter"], "Multiplication and division come before addition and subtraction.");
}

function wordExpression(): Question {
  const name = pick(NAMES);
  const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 9);
  if (pick([0, 1]) === 0) {
    return textChoice(
      `${name} buys ${a} packs with ${b} stickers in each pack, and ${c} single stickers. Which expression shows the total?`,
      `${a} × ${b} + ${c}`,
      [`${a} + ${b} × ${c}`, `${a} × ${b} × ${c}`, `${a} + ${b} + ${c}`],
      `The packs make ${a} × ${b} stickers. Then add the ${c} singles.`,
    );
  }
  return textChoice(
    `${name} has ${a} marbles. ${name} then gets ${b} bags with ${c} marbles in each bag. Which expression shows the total?`,
    `${a} + ${b} × ${c}`,
    [`${a} × ${b} + ${c}`, `${a} × ${b} × ${c}`, `${a} + ${b} + ${c}`],
    `The bags make ${b} × ${c} marbles. Add the ${a} marbles ${name} already had.`,
  );
}

function findMistake(): Question {
  const name = pick(NAMES);
  const a = randInt(2, 9), b = randInt(2, 9), c = randInt(2, 9);
  return textChoice(
    `${name} says ${a} + ${b} × ${c} = ${(a + b) * c}. What went wrong?`,
    `${name} added before multiplying`,
    [`${name} multiplied before adding`, `${name} subtracted by mistake`, `${name} did nothing wrong`],
    `Multiplication comes before addition, so find ${b} × ${c} first.`,
  );
}

// ---------- Fractions, decimals and percent (4N5.2, 4N6.1) ----------

const dec = (hundredths: number): string => String(hundredths / 100);

function gridPercent(): Question {
  const n = randInt(3, 97);
  return typeIn(`A grid has 100 squares. ${n} of them are shaded. What percent is shaded?`, n, "Percent means out of 100.", undefined, { suffix: "%" });
}

function fracToPercent(): Question {
  const n = randInt(11, 97);
  const wrong = new Set<string>([`${n / 10}%`, `${100 - n}%`]);
  const rev = Number(String(n).split("").reverse().join(""));
  if (rev !== n && rev < 100) wrong.add(`${rev}%`);
  wrong.add(`${n}0%`);
  wrong.delete(`${n}%`);
  return textChoice(`What percent is the same as ${n}/100?`, `${n}%`, [...wrong].slice(0, 3), "Percent means out of 100, so 100 parts becomes 100%.");
}

function decToPercent(d: Level): Question {
  const hundredths = d === 1 ? randInt(1, 9) * 10 : randInt(11, 98);
  return typeIn(`Write ${dec(hundredths)} as a percent.`, hundredths, "Move the decimal point two places to the right: 0.01 is 1%.", undefined, { suffix: "%" });
}

function percentToDec(): Question {
  const n = randInt(11, 98);
  const right = dec(n);
  const wrong = new Set<string>([String(n / 10), String(n / 1000), dec(Number(String(n).split("").reverse().join("")))]);
  wrong.delete(right);
  wrong.add(String(n));
  return textChoice(`Which decimal is the same as ${n}%?`, right, [...wrong].slice(0, 3), `${n}% is ${n} out of 100, or ${right}.`);
}

const BENCHMARKS: Array<[number, string]> = [
  [10, "1/10"],
  [20, "1/5"],
  [25, "1/4"],
  [30, "3/10"],
  [40, "2/5"],
  [50, "1/2"],
  [60, "3/5"],
  [70, "7/10"],
  [75, "3/4"],
  [80, "4/5"],
  [90, "9/10"],
];

function benchmark(d: Level): Question {
  const pool = d === 1 ? BENCHMARKS.filter(([p]) => [10, 25, 50, 75].includes(p)) : BENCHMARKS;
  const [p, f] = pick(pool);
  const wrong = sample(BENCHMARKS.filter(([, g]) => g !== f), 3).map(([, g]) => g);
  return textChoice(`Which fraction is the same as ${p}%?`, f, wrong, `${p}% is ${p}/100. Share the top and bottom by the same number to get ${f}.`);
}

function fracToDec(d: Level): Question {
  if (d === 1 || pick([0, 1]) === 0) {
    const k = randInt(1, 9);
    return typeIn(`Write ${k}/10 as a decimal.`, `0.${k}`, "Tenths: 1/10 is 0.1.", undefined, { keypad: "decimal" });
  }
  const n = randInt(11, 99);
  const answer = n % 10 === 0 ? `0.${n / 10}` : `0.${n}`;
  return typeIn(`Write ${n}/100 as a decimal.`, answer, "Hundredths: 1/100 is 0.01, so 27/100 is 0.27.", undefined, { keypad: "decimal" });
}

function decToFrac(): Question {
  const k = pick([1, 2, 3, 4, 6, 7, 8]);
  const wrong = [`${k}/100`, `${10 - k}/10`, `1/${k + 1}`];
  return textChoice(`Which fraction is equal to 0.${k}?`, `${k}/10`, wrong, `0.${k} is ${k} tenths, which is ${k}/10.`);
}

function greatest(): Question {
  const values = sample(range(1, 19).map((n) => n * 5), 3);
  const forms = shuffle([(v: number) => `${v}%`, (v: number) => dec(v), (v: number) => `${v}/100`]);
  const labels = values.map((v, i) => forms[i](v));
  const best = labels[values.indexOf(Math.max(...values))];
  return textChoice("Which one is the greatest?", best, labels.filter((l) => l !== best), "Write each one as a number out of 100, then compare.");
}

function percentStory(): Question {
  const [denominator, factor] = pick([[4, 25], [5, 20], [10, 10], [20, 5], [25, 4], [50, 2]]);
  const count = randInt(1, denominator - 1);
  const name = pick(NAMES);
  return typeIn(
    `${name} answered ${count} of ${denominator} questions correctly. What percent is that?`,
    count * factor,
    `Make the bottom number 100: multiply top and bottom by ${factor}.`,
    undefined,
    { suffix: "%" },
  );
}

// ---------- Triangles, quadrilaterals and angles (4G1.1) ----------

function triangleBySides(): Question {
  const type = pick(["equilateral", "isosceles", "scalene"]);
  let sides: number[];
  if (type === "equilateral") {
    const a = randInt(3, 9);
    sides = [a, a, a];
  } else if (type === "isosceles") {
    const a = randInt(4, 9);
    let b = randInt(2, 2 * a - 1);
    while (b === a) b = randInt(2, 2 * a - 1);
    sides = shuffle([a, a, b]);
  } else {
    sides = pick([[3, 4, 5], [4, 5, 6], [5, 6, 7], [6, 7, 9], [5, 7, 9], [4, 6, 8], [7, 8, 10], [6, 9, 10]]);
  }
  const hints: Record<string, string> = {
    equilateral: "Equilateral means all 3 sides are equal.",
    isosceles: "Isosceles means exactly 2 sides are equal.",
    scalene: "Scalene means no sides are equal.",
  };
  return textChoice(`A triangle has sides ${sides[0]} cm, ${sides[1]} cm and ${sides[2]} cm. What kind of triangle is it, by its sides?`, type, ["equilateral", "isosceles", "scalene"].filter((t) => t !== type), hints[type]);
}

function triangleByAngles(): Question {
  const type = pick(["acute", "right", "obtuse"]);
  let angles: number[] = [];
  if (type === "right") {
    const a = randInt(20, 70);
    angles = [90, a, 90 - a];
  } else if (type === "acute") {
    while (angles.length === 0) {
      const a = randInt(40, 80), b = randInt(40, 80), c = 180 - a - b;
      if (c >= 30 && c <= 80) angles = [a, b, c];
    }
  } else {
    const o = randInt(95, 140), a = randInt(10, 180 - o - 10);
    angles = [o, a, 180 - o - a];
  }
  const hints: Record<string, string> = {
    acute: "An acute triangle has 3 angles that are all less than 90°.",
    right: "A right triangle has one 90° angle.",
    obtuse: "An obtuse triangle has one angle greater than 90°.",
  };
  const shuffled = shuffle(angles);
  return textChoice(`A triangle has angles ${shuffled[0]}°, ${shuffled[1]}° and ${shuffled[2]}°. What kind of triangle is it, by its angles?`, type, ["acute", "right", "obtuse"].filter((t) => t !== type), hints[type]);
}

function complementOrSupplement(): Question {
  const complementary = pick([true, false]);
  const total = complementary ? 90 : 180;
  const a = complementary ? randInt(10, 80) : randInt(20, 160);
  return typeIn(
    `Two angles are ${complementary ? "complementary" : "supplementary"}. One angle is ${a}°. What is the other angle?`,
    total - a,
    complementary ? "Complementary angles add to 90°." : "Supplementary angles add to 180°.",
    undefined,
    { suffix: "°" },
  );
}

function pairQuestion(): Question {
  const complementary = pick([true, false]);
  const total = complementary ? 90 : 180;
  const a = pick(range(4, 14).map((n) => n * 5));
  const pair = (x: number, y: number) => `${x}° and ${y}°`;
  const other = complementary ? 180 : 90;
  const wrong = new Set<string>([pair(a, total + 10 - a), pair(a, total - 10 - a)]);
  if (other - a > 0) wrong.add(pair(a, other - a));
  return textChoice(
    `Which pair of angles is ${complementary ? "complementary" : "supplementary"}?`,
    pair(a, total - a),
    [...wrong].slice(0, 3),
    `${complementary ? "Complementary" : "Supplementary"} angles add to ${total}°.`,
  );
}

const QUADRILATERALS: Array<[string, string, string[], string]> = [
  ["Which quadrilateral has exactly one pair of parallel sides?", "trapezoid", ["square", "rectangle", "rhombus"], "Squares, rectangles and rhombuses all have two pairs of parallel sides."],
  ["Which quadrilateral always has 4 equal sides?", "rhombus", ["rectangle", "trapezoid", "parallelogram"], "A rhombus has 4 equal sides. A rectangle or parallelogram can have long and short sides."],
  ["Which quadrilateral has 4 right angles but sides that are not all equal?", "rectangle", ["rhombus", "trapezoid", "parallelogram"], "A rectangle has 4 right angles. Its sides come in two lengths."],
  ["How many right angles does a square have?", "4", ["0", "2", "3"], "A square has 4 equal sides and 4 right angles."],
  ["How many sides does every quadrilateral have?", "4", ["3", "5", "6"], "Quad means four."],
  ["Which has opposite sides that are parallel and equal?", "parallelogram", ["trapezoid", "triangle", "pentagon"], "A parallelogram has two pairs of parallel sides, and opposite sides are equal."],
  ["Which of these is NOT a quadrilateral?", "triangle", ["rhombus", "trapezoid", "rectangle"], "A quadrilateral has 4 sides. A triangle has 3."],
  ["Two sides of a shape are parallel and the other two are not. The shape has 4 sides. It is a…", "trapezoid", ["square", "rectangle", "rhombus"], "A trapezoid has only one pair of parallel sides."],
];

function quadrilateral(): Question {
  const [prompt, right, wrong, hint] = pick(QUADRILATERALS);
  return textChoice(prompt, right, wrong, hint);
}

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "primes-composites-ab",
    title: "Prime & Composite",
    emoji: "🔢",
    blurb: "Count factors to sort numbers into prime and composite",
    standards: ab("4N3.1", "factors, and explaining prime and composite numbers using multiplication and division"),
    parentNote: "A prime number has exactly two factors, 1 and itself (like 7). A composite number has more than two (like 12). 1 is neither. Children find factors with multiplication and division facts.",
    generate: (opts) => {
      const d = levelOf(opts);
      return buildSet([
        ...times(2, () => classify(d)),
        () => whichPrime(d),
        () => whichComposite(d),
        () => factorCount(d),
        () => isFactor(d),
        () => missingFactor(d),
        primeFact,
      ]);
    },
  },
  {
    id: "order-of-operations-ab",
    title: "Order of Operations",
    emoji: "🧮",
    blurb: "Which step comes first? Multiply and divide before add and subtract",
    standards: ab("4A1.1", "evaluating expressions using the order of operations"),
    parentNote: "Multiplication and division are done before addition and subtraction, and equal steps go left to right. For example, 3 + 4 × 2 is 11, not 14. Brackets come in Grade 5.",
    generate: (opts) => {
      const d = levelOf(opts);
      return buildSet([...times(3, () => evalInput(d)), ...times(2, () => evalChoice(d)), () => firstStep(d), wordExpression, findMistake]);
    },
  },
  {
    id: "fractions-decimals-percent-ab",
    title: "Fractions, Decimals & Percent",
    emoji: "💯",
    blurb: "One amount, three ways to write it",
    standards: ab("4N5.2, 4N6.1", "converting between fractions with tenths and hundredths, decimals, and percent"),
    parentNote: "The same part of a whole can be written as a fraction (35/100), a decimal (0.35) or a percent (35%). Children learn that percent means out of 100 and link tenths and hundredths to decimals.",
    generate: (opts) => {
      const d = levelOf(opts);
      return buildSet([gridPercent, fracToPercent, () => decToPercent(d), percentToDec, () => benchmark(d), () => fracToDec(d), d === 1 ? decToFrac : greatest, percentStory]);
    },
  },
  {
    id: "shapes-angles-ab",
    title: "Triangles, Quadrilaterals & Angles",
    emoji: "📐",
    blurb: "Name shapes by their sides and angles, and find missing angles",
    standards: ab("4G1.1", "classifying triangles and quadrilaterals, and complementary and supplementary angles"),
    parentNote: "Triangles are named by their sides (equilateral, isosceles, scalene) and by their angles (acute, right, obtuse). Quadrilaterals include squares, rectangles, rhombuses, parallelograms and trapezoids. Complementary angles add to 90° and supplementary angles add to 180°.",
    generate: () => buildSet([triangleBySides, triangleByAngles, complementOrSupplement, complementOrSupplement, pairQuestion, quadrilateral, quadrilateral, quadrilateral]),
  },
];
