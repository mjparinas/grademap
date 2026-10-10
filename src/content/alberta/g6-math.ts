import type { GenerateOptions, Question, Unit } from "../types";
import { chance, pick, randInt, sample, textChoice } from "../random";
import { ab, buildSet, eq, levelOf, numQ, others, range, typeIn } from "./kit";

// Alberta Grade 6 Math units written for outcomes that BC and Ontario do not cover in this grade:
// adding and subtracting integers (6N1), exponents and common factors (6N3, 6A1) and symmetry and
// congruence (6G1). Other Grade 6 outcomes reuse existing units (see g6.ts).

const minus = (n: number): string => (n < 0 ? `−${-n}` : String(n));
const op = (n: number): string => (n < 0 ? `(−${-n})` : String(n));
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n: number): string => String(n).replace(/\d/g, (c) => SUP[Number(c)]);
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// ---------- Integers: adding and subtracting ----------

function integers(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const hi = d === 1 ? 8 : d === 2 ? 12 : 20;
  const nz = (): number => {
    const n = randInt(-hi, hi);
    return n === 0 ? 3 : n;
  };
  const add = (): Question => {
    const a = nz();
    const b = nz();
    return typeIn("Add.", a + b, "Use a number line. Adding a positive moves right, adding a negative moves left.", eq(`${minus(a)} + ${op(b)} = ?`), { keypad: "integer" });
  };
  const subtract = (): Question => {
    const a = nz();
    const b = d === 1 ? randInt(1, hi) : nz();
    return typeIn("Subtract.", a - b, "Subtracting a number is the same as adding its opposite.", eq(`${minus(a)} − ${op(b)} = ?`), { keypad: "integer" });
  };
  const temperature = (): Question => {
    const city = pick(["Edmonton", "Calgary", "Fort McMurray", "Red Deer", "Lethbridge"]);
    const start = randInt(-20, -2);
    const change = randInt(3, 15);
    const rises = chance(0.5);
    const end = rises ? start + change : start - change;
    return typeIn(
      `At 6 a.m. in ${city} it is ${minus(start)}°C. By noon the temperature ${rises ? "rises" : "drops"} ${change}°C. What is it at noon, in °C?`,
      end,
      rises ? "Rising means adding. Count up from the starting temperature." : "Dropping means subtracting. Count down from the starting temperature.",
      undefined,
      { keypad: "integer", suffix: "°C" },
    );
  };
  const inverse = (): Question => {
    const n = nz();
    return typeIn(`What number added to ${op(n)} makes 0?`, -n, "The additive inverse is the opposite number: the two add to zero.", undefined, { keypad: "integer" });
  };
  const zeroSum = (): Question => {
    const n = randInt(2, 15);
    const wrong = [`${minus(-n)} + ${op(-n)}`, `${n} + ${n + 1}`, `${minus(-n)} + ${op(n + 2)}`];
    return textChoice("Which sum is equal to 0?", `${minus(-n)} + ${n}`, wrong, "Two opposite integers add to zero.");
  };
  const compare = (): Question => {
    const [a, b] = sample(range(-hi, hi), 2);
    return textChoice(`Which is greater, ${minus(a)} or ${minus(b)}?`, minus(Math.max(a, b)), [minus(Math.min(a, b))], "On a number line, the number farther to the right is greater.");
  };
  const distance = (): Question => {
    const a = randInt(-10, -1);
    const b = randInt(1, 10);
    return typeIn(`How many steps along a number line from ${minus(a)} to ${b}?`, b - a, "Count the steps to 0, then count on to the other number.", undefined, { keypad: "number" });
  };
  return buildSet([add, add, subtract, subtract, temperature, inverse, d === 1 ? zeroSum : distance, pick([compare, zeroSum])]);
}

// ---------- Exponents and common factors ----------

const FACTORED: [number, number][][] = [
  [[2, 2], [3, 1]],
  [[2, 1], [3, 2]],
  [[2, 2], [5, 1]],
  [[2, 3], [3, 1]],
  [[2, 2], [7, 1]],
  [[2, 3], [5, 1]],
  [[3, 2], [5, 1]],
  [[2, 1], [5, 2]],
  [[2, 1], [3, 3]],
  [[2, 3], [3, 2]],
  [[3, 1], [5, 2]],
];

const power = (b: number, e: number): string => (e === 1 ? String(b) : `${b}${sup(e)}`);

function exponents(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const value = (): Question => {
    const base = pick(d === 1 ? [2, 3, 4, 5] : [2, 3, 4, 5, 6, 7, 10]);
    const exp = base === 10 ? randInt(2, 4) : d === 1 ? 2 : randInt(2, 4);
    return typeIn(`What is the value of ${base}${sup(exp)}?`, base ** exp, `${base}${sup(exp)} means ${Array(exp).fill(base).join(" × ")}.`);
  };
  const asPower = (): Question => {
    const base = randInt(2, 9);
    let exp = randInt(3, 5);
    if (exp === base) exp = 6;
    const right = `${base}${sup(exp)}`;
    return textChoice(`Write ${Array(exp).fill(base).join(" × ")} as a power.`, right, [`${exp}${sup(base)}`, `${base} × ${exp}`], "The base is the number multiplied. The exponent tells how many times it is used.");
  };
  const meaning = (): Question => {
    const base = randInt(5, 9);
    const exp = randInt(3, 4);
    const rep = Array(exp).fill(base).join(" × ");
    return textChoice(`What does ${base}${sup(exp)} mean?`, rep, [`${base} × ${exp}`, `${Array(base).fill(exp).join(" × ")}`, `${base} + ${exp}`], "The exponent tells how many copies of the base to multiply.");
  };
  const parts = (): Question => {
    const base = randInt(2, 9);
    let exp = randInt(2, 6);
    if (exp === base) exp = 1 + base;
    const asked = pick(["base", "exponent"]);
    return textChoice(`In ${base}${sup(exp)}, which number is the ${asked}?`, String(asked === "base" ? base : exp), [String(asked === "base" ? exp : base), String(base ** exp > 9999 ? base * exp : base ** exp)].filter((w) => w !== String(asked === "base" ? base : exp)), "The base is the larger number written on the line. The exponent is the small raised number.");
  };
  const order = (): Question => {
    const base = randInt(2, 6);
    const add = randInt(1, 9);
    const mult = chance(0.5);
    const k = randInt(2, 5);
    const ans = mult ? k * base ** 2 : add + base ** 2;
    return typeIn("Evaluate. Do the power first.", ans, "Order of operations: brackets, powers, then multiply or divide, then add or subtract.", eq(mult ? `${k} × ${base}² = ?` : `${add} + ${base}² = ?`));
  };
  const primePowers = (): Question => {
    const f = pick(FACTORED);
    const n = f.reduce((p, [b, e]) => p * b ** e, 1);
    const right = f.map(([b, e]) => power(b, e)).join(" × ");
    const swapped = [[f[0][0], f[1][1]], [f[1][0], f[0][1]]] as [number, number][];
    const wrong1 = swapped.map(([b, e]) => power(b, e)).join(" × ");
    const wrong2 = [[f[0][0], f[0][1] + 1], f[1]].map(([b, e]) => power(b, e)).join(" × ");
    const wrong3 = [f[0], [f[1][0], f[1][1] + 1]].map(([b, e]) => power(b, e)).join(" × ");
    const wrong = [...new Set([wrong1, wrong2, wrong3])].filter((w) => w !== right);
    return textChoice(`Which shows the prime factorization of ${n} using powers?`, right, wrong.slice(0, d === 1 ? 2 : 3), "Count how many times each prime factor appears, then write that count as the exponent.");
  };
  const greatest = (): Question => {
    const g = pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
    const [x, y] = sample([2, 3, 4, 5, 7, 9, 11], 2);
    const a = g * x;
    const b = g * y;
    return typeIn(`What is the greatest common factor of ${a} and ${b}?`, gcd(a, b), "List the factors of each number. The biggest one they share is the greatest common factor.");
  };
  const common = (): Question => {
    const pairs: [number, number][] = [[12, 18], [24, 36], [20, 30], [16, 40], [18, 27], [28, 42], [30, 45]];
    const [a, b] = pick(pairs);
    const g = gcd(a, b);
    const wrongPool = range(2, 20).filter((n) => a % n !== 0 || b % n !== 0);
    return textChoice(`Which number is a common factor of ${a} and ${b}?`, String(g), others(wrongPool, g, 3).slice(0, 2).map(String), "A common factor divides both numbers with nothing left over.");
  };
  return buildSet([value, value, d === 1 ? meaning : asPower, meaning, d === 1 ? parts : order, primePowers, greatest, pick([common, order])]);
}

// ---------- Symmetry and congruence ----------

const LINES: { name: string; lines: number; turn?: number }[] = [
  { name: "equilateral triangle", lines: 3, turn: 3 },
  { name: "square", lines: 4, turn: 4 },
  { name: "regular pentagon", lines: 5, turn: 5 },
  { name: "regular hexagon", lines: 6, turn: 6 },
  { name: "rectangle that is not a square", lines: 2, turn: 2 },
  { name: "isosceles triangle", lines: 1 },
];

const VERTICAL = ["A", "M", "T", "U", "V", "W", "Y"];
const NO_VERTICAL = ["B", "C", "D", "E", "F", "G", "J", "L", "P", "R"];

function symmetry(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const lineCount = (): Question => {
    const shapes = LINES.filter((s) => !s.name.startsWith("isosceles"));
    const s = pick(d === 1 ? shapes.slice(0, 4) : shapes);
    return numQ(`How many lines of symmetry does a ${s.name} have?`, s.lines, "A line of symmetry folds the shape so both halves match exactly.", undefined, 8, 0);
  };
  const turnOrder = (): Question => {
    const s = pick(LINES.filter((l) => l.turn));
    return numQ(`A ${s.name} has rotational symmetry. How many times does it match itself in one full turn?`, s.turn ?? 0, "Count the number of turns that make the shape look the same until you are back at the start.", undefined, 8, 2);
  };
  const smallestTurn = (): Question => {
    const n = pick([3, 4, 5, 6, 8]);
    const name = { 3: "equilateral triangle", 4: "square", 5: "regular pentagon", 6: "regular hexagon", 8: "regular octagon" }[n]!;
    const ans = 360 / n;
    const pool = [30, 45, 60, 72, 90, 120, 180].filter((x) => x !== ans);
    return textChoice(`What is the smallest turn, in degrees, that makes a ${name} look the same?`, `${ans}°`, sample(pool, 3).map((x) => `${x}°`), "Divide a full turn, 360°, by the number of matching positions.");
  };
  const letter = (): Question => textChoice("Which capital letter has a vertical line of symmetry?", pick(VERTICAL), sample(NO_VERTICAL, 3), "Fold the letter down the middle from top to bottom. Do the sides match?");
  const congruent = (): Question =>
    textChoice("What makes two shapes congruent?", "They have exactly the same size and shape", ["They have the same colour", "They only have the same number of sides", "They only have the same perimeter"], "Congruent shapes match perfectly if one is placed on the other.");
  const keeps = (): Question =>
    textChoice("Which move does NOT give a congruent image?", "Enlarging it (dilation)", ["Sliding it (translation)", "Flipping it (reflection)", "Turning it (rotation)"], "Slides, flips and turns keep size and shape the same.");
  const tile = (): Question =>
    textChoice("Which regular shape can NOT tile a flat surface by itself with no gaps?", "Regular pentagon", ["Equilateral triangle", "Square", "Regular hexagon"], "Shapes tile when their angles fit together to make 360° around a point.");
  const regularIrregular = (): Question =>
    textChoice("A regular polygon has…", "all sides equal and all angles equal", ["only equal sides", "only equal angles", "at least one right angle"], "Regular polygons are perfectly even all the way around.");
  return buildSet([lineCount, lineCount, d === 1 ? congruent : turnOrder, smallestTurn, letter, pick([keeps, tile]), d === 1 ? regularIrregular : pick([keeps, tile, regularIrregular]), congruent]);
}

export const units: Unit[] = [
  {
    id: "integer-moves-ab",
    title: "Adding and Subtracting Integers",
    emoji: "➖",
    blurb: "Positive, negative and zero",
    standards: ab("6N1.2, 6N1.3", "adding and subtracting integers, opposites that add to zero, and comparing integers"),
    parentNote: "Using a number line to add and subtract positive and negative integers, additive inverses, comparing integers and winter temperature changes.",
    generate: integers,
  },
  {
    id: "exponents-ab",
    title: "Powers and Common Factors",
    emoji: "⚡",
    blurb: "Exponents and prime factorization",
    standards: ab("6N3.1, 6N3.2, 6A1.1", "exponents, prime factorization with powers, common factors and evaluating expressions with powers"),
    parentNote: "Reading and writing powers such as 3⁴, evaluating them, order of operations with powers, writing prime factorizations with exponents, and finding common factors and the greatest common factor.",
    generate: exponents,
  },
  {
    id: "symmetry-ab",
    title: "Symmetry and Congruence",
    emoji: "🪞",
    blurb: "Mirror lines, turns and matching shapes",
    standards: ab("6G1.1, 6G1.2", "reflection and rotational symmetry, regular polygons, congruent shapes and tessellations"),
    parentNote: "Lines of symmetry in regular and irregular polygons, rotational symmetry and turn angles, congruent shapes, which moves keep a shape congruent, and tiling a surface.",
    generate: symmetry,
  },
];
