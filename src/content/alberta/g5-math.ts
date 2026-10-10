import { numberChoice, pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { ab, buildSet, eq, levelOf, others, range, spaced, times, typeIn } from "./kit";

// Alberta Grade 5 mathematics (2022 curriculum). Units BC and Ontario already have are shared (see g5.ts).
// These three cover outcomes that neither of them teaches in Grade 5: divisibility tests (5N3), adding and
// subtracting fractions with a common denominator (5N6), and symmetry (5G1).

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// ---------- Divisibility ----------

const RULES: Record<number, string> = {
  2: "the last digit is 0, 2, 4, 6 or 8",
  3: "the digits add up to a number divisible by 3",
  4: "the number made by the last two digits is divisible by 4",
  5: "the last digit is 0 or 5",
  6: "it is divisible by both 2 and 3",
  8: "the number made by the last three digits is divisible by 8",
  9: "the digits add up to a number divisible by 9",
  10: "the last digit is 0",
};

const divisors = (d: 1 | 2 | 3): number[] => (d === 1 ? [2, 5, 10] : d === 2 ? [2, 3, 4, 5, 9, 10] : [3, 4, 6, 8, 9]);
const bounds = (d: 1 | 2 | 3): [number, number] => (d === 1 ? [20, 400] : d === 2 ? [100, 2000] : [1000, 30000]);

function distinctNumbers(d: 1 | 2 | 3, want: number, divisible: boolean, by: number): number[] {
  const [lo, hi] = bounds(d);
  const out = new Set<number>();
  let guard = 0;
  while (out.size < want && guard++ < 2000) {
    const n = randInt(lo, hi);
    if ((n % by === 0) === divisible) out.add(n);
  }
  return [...out];
}

function whichDivisible(d: 1 | 2 | 3) {
  return (): Question => {
    const by = pick(divisors(d));
    const [right] = distinctNumbers(d, 1, true, by);
    const wrong = distinctNumbers(d, 3, false, by);
    return textChoice(`Which number is divisible by ${by}?`, spaced(right), wrong.map(spaced), `Test each number: ${RULES[by]}.`);
  };
}

function yesNo(d: 1 | 2 | 3) {
  return (): Question => {
    const by = pick(divisors(d));
    const yes = pick([true, false]);
    const [n] = distinctNumbers(d, 1, yes, by);
    return textChoice(`Is ${spaced(n)} divisible by ${by}?`, yes ? "Yes" : "No", [yes ? "No" : "Yes"], `A number is divisible by ${by} if ${RULES[by]}.`);
  };
}

function bothTests(d: 1 | 2 | 3) {
  return (): Question => {
    const [a, b] = pick([[2, 3], [2, 5], [3, 5], [3, 9]]);
    const [lo, hi] = bounds(d);
    const all = range(lo, Math.min(hi, lo + 600));
    const right = pick(all.filter((n) => n % a === 0 && n % b === 0));
    const wrong = sample(all.filter((n) => (n % a === 0) !== (n % b === 0)), 3);
    return textChoice(`Which number is divisible by both ${a} and ${b}?`, spaced(right), wrong.map(spaced), `Check ${a} first, then ${b}. The answer must pass both tests.`);
  };
}

function ruleQuestion(): Question {
  const by = pick([2, 3, 4, 5, 9, 10]);
  const wrong = others([2, 3, 4, 5, 9, 10], by, 3).map((o) => RULES[o]);
  return textChoice(`Which test shows that a number is divisible by ${by}?`, `Check if ${RULES[by]}.`, wrong.map((w) => `Check if ${w}.`), `Think about what is special about numbers you can divide by ${by}.`);
}

function zeroQuestion(): Question {
  const by = pick([3, 5, 7, 8, 9]);
  return textChoice(`Is 0 divisible by ${by}?`, `Yes, 0 ÷ ${by} = 0 with nothing left over`, [`No, you cannot divide 0 by ${by}`, `No, 0 is not a number`], `Divisible means no remainder. 0 ÷ ${by} = 0, so there is no remainder.`);
}

function makeNumber(d: 1 | 2 | 3) {
  return (): Question => {
    // The digit sum shortcut: build a number that is, or is not, divisible by 3 or 9.
    const by = pick([3, 9]);
    const n = distinctNumbers(d === 1 ? 2 : d, 1, true, by)[0];
    const sum = String(n).split("").reduce((s, c) => s + Number(c), 0);
    return textChoice(`The digits of ${spaced(n)} add up to ${sum}. Is ${spaced(n)} divisible by ${by}?`, "Yes", ["No"], `${sum} ÷ ${by} has no remainder, so the number is divisible by ${by}.`);
  };
}

function divisibility(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return buildSet([...times(3, whichDivisible(d)), ...times(2, yesNo(d)), bothTests(d), d === 1 ? zeroQuestion : makeNumber(d), ruleQuestion]);
}

// ---------- Adding and subtracting fractions ----------

type Frac = [number, number];
const f = ([n, den]: Frac) => `${n}/${den}`;

function denominator(d: 1 | 2 | 3): number {
  return pick(d === 1 ? [4, 5, 6, 8, 10] : d === 2 ? [3, 4, 5, 6, 8, 10, 12] : [6, 7, 8, 9, 10, 12]);
}

function distinctFractions(right: Frac, candidates: Frac[], n: number): string[] {
  const seen = new Set<string>([f(right)]);
  const out: string[] = [];
  for (const c of shuffle(candidates)) {
    if (c[0] <= 0 || c[1] <= 0) continue;
    if (c[0] * right[1] === c[1] * right[0]) continue; // equal in value to the answer
    if (seen.has(f(c))) continue;
    seen.add(f(c));
    out.push(f(c));
    if (out.length === n) break;
  }
  return out;
}

function addFractions(d: 1 | 2 | 3) {
  return (): Question => {
    const den = denominator(d);
    const a = randInt(1, den - 1);
    const b = randInt(1, d === 1 ? Math.max(1, den - a) : den - 1);
    const sum = a + b;
    if (sum === den) return addFractions(d)();
    const right: Frac = [sum, den];
    const wrong = distinctFractions(right, [[sum, den * 2], [sum + 1, den], [sum - 1, den], [a * b, den], [sum, den + den - 1]], 3);
    return textChoice(`What is ${f([a, den])} + ${f([b, den])}?`, f(right), wrong, "The denominators match, so add only the numerators. The denominator stays the same.", eq(`${f([a, den])} + ${f([b, den])}`));
  };
}

function subtractFractions(d: 1 | 2 | 3) {
  return (): Question => {
    const den = denominator(d);
    const a = randInt(2, d === 3 ? den + 4 : den - 1);
    const b = randInt(1, a - 1);
    const diff = a - b;
    if (diff === den) return subtractFractions(d)();
    const right: Frac = [diff, den];
    const wrong = distinctFractions(right, [[diff, den * 2], [diff + 1, den], [diff - 1, den], [a + b, den], [diff + 2, den]], 3);
    return textChoice(`What is ${f([a, den])} − ${f([b, den])}?`, f(right), wrong, "The denominators match, so subtract only the numerators. The denominator stays the same.", eq(`${f([a, den])} − ${f([b, den])}`));
  };
}

function missingNumerator(d: 1 | 2 | 3) {
  return (): Question => {
    const den = denominator(d);
    const total = randInt(3, den - 1);
    const a = randInt(1, total - 1);
    const b = total - a;
    return numberChoice(`${f([a, den])} + ☐/${den} = ${f([total, den])}. What number goes in the box?`, b, `${total} − ${a} tells you how many more ${den}ths are needed.`, eq(`${a}/${den} + ☐/${den} = ${total}/${den}`), { min: 1, max: den });
  };
}

const STORY_FOODS = ["pizza", "pan of lasagna", "loaf of banana bread", "tray of brownies"];

function storyAdd(): Question {
  const den = pick([6, 8, 10, 12]);
  for (let tries = 0; tries < 200; tries++) {
    const a = randInt(1, den - 3);
    const b = randInt(1, den - 2 - a);
    if (b < 1) continue;
    const sum = a + b;
    if (sum >= den || gcd(sum, den) !== 1) continue;
    const names = shuffle(["Amir", "Priya", "Mateo", "Zoe", "Kenji", "Lena"]);
    const food = pick(STORY_FOODS);
    return typeIn(`${names[0]} ate ${f([a, den])} of a ${food} and ${names[1]} ate ${f([b, den])} of it. What fraction did they eat together?`, f([sum, den]), "Add the numerators and keep the denominator.", undefined, { keypad: "fraction" });
  }
  return typeIn("Amir ate 1/6 of a pizza and Priya ate 2/6 of it. What fraction did they eat together?", "3/6", "Add the numerators and keep the denominator.", undefined, { keypad: "fraction", accept: ["1/2"] });
}

function storyLeft(): Question {
  const den = pick([4, 5, 8, 10, 12]);
  const used = randInt(1, den - 2);
  const right: Frac = [den - used, den];
  const wrong = distinctFractions(right, [[den - used, den * 2], [used + 1, den], [den - used + 1, den], [den - used - 1, den]], 3);
  return textChoice(
    `A water bottle holds ${den} equal sips when full. ${used} of those sips have been drunk. What fraction of the bottle is left?`,
    f(right),
    wrong,
    `Subtract the sips drunk from the whole bottle: ${den} − ${used}. The denominator stays ${den}.`,
  );
}

function improperSum(d: 1 | 2 | 3) {
  return (): Question => {
    const den = pick(d === 1 ? [4, 5] : [4, 5, 6, 8]);
    const a = randInt(Math.ceil(den / 2) + 1, den - 1);
    const b = randInt(den - a + 1, den - 1);
    const sum = a + b;
    const right: Frac = [sum, den];
    const wrong = distinctFractions(right, [[sum, den * 2], [sum - 1, den], [sum + 1, den], [a * b, den]], 3);
    return textChoice(`What is ${f([a, den])} + ${f([b, den])}? The answer is more than 1.`, f(right), wrong, "Add the numerators. The answer can have a numerator bigger than the denominator.", eq(`${f([a, den])} + ${f([b, den])}`));
  };
}

function typedAdd(d: 1 | 2 | 3) {
  return (): Question => {
    for (let tries = 0; tries < 200; tries++) {
      const den = pick(d === 1 ? [5, 7, 9] : [5, 7, 9, 11]);
      const a = randInt(1, den - 2);
      const b = randInt(1, den - 1 - a);
      const sum = a + b;
      if (sum < den && gcd(sum, den) === 1) return typeIn(`${f([a, den])} + ${f([b, den])} = ?`, f([sum, den]), "Add the numerators and keep the denominator.", eq(`${f([a, den])} + ${f([b, den])}`), { keypad: "fraction" });
    }
    return typeIn("3/7 + 2/7 = ?", "5/7", "Add the numerators and keep the denominator.", eq("3/7 + 2/7"), { keypad: "fraction" });
  };
}

function fractionAddSub(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return buildSet([
    addFractions(d),
    addFractions(d),
    subtractFractions(d),
    subtractFractions(d),
    d === 1 ? storyLeft : storyAdd,
    missingNumerator(d),
    typedAdd(d),
    d === 1 ? addFractions(d) : improperSum(d),
  ]);
}

// ---------- Symmetry ----------

const POLYGONS: { name: string; n: number; shape: "triangle" | "square" | "pentagon" | "hexagon" | "octagon" }[] = [
  { name: "triangle", n: 3, shape: "triangle" },
  { name: "square", n: 4, shape: "square" },
  { name: "pentagon", n: 5, shape: "pentagon" },
  { name: "hexagon", n: 6, shape: "hexagon" },
  { name: "octagon", n: 8, shape: "octagon" },
];

function linesOfSymmetry(): Question {
  const p = pick(POLYGONS);
  return numberChoice(`How many lines of symmetry does a regular ${p.name} have?`, p.n, "A regular polygon has one line of symmetry for each of its sides (or corners).", { type: "shape", shape: p.shape }, { min: 1, max: 10 });
}

function rotationalOrder(): Question {
  const p = pick(POLYGONS);
  return numberChoice(`A regular ${p.name} turns around its centre. In one full turn, how many times does it look exactly the same as it started (counting the start)?`, p.n, "This number is the order of rotational symmetry. A regular polygon has as many as it has sides.", { type: "shape", shape: p.shape }, { min: 1, max: 10 });
}

function turnAngle(): Question {
  const n = pick([3, 4, 5, 6, 8, 9, 10]);
  const name = ({ 3: "triangle", 4: "square", 5: "pentagon", 6: "hexagon", 8: "octagon", 9: "9-sided polygon", 10: "10-sided polygon" } as Record<number, string>)[n];
  const angle = 360 / n;
  return numberChoice(`What is the smallest turn that moves a regular ${name} onto itself?`, angle, `A full turn is 360°. Divide it by the ${n} matching positions: 360 ÷ ${n}.`, eq(`360° ÷ ${n}`), { min: 20, max: 180 });
}

function generalLines(): Question {
  const n = pick([7, 9, 10, 12]);
  return numberChoice(`How many lines of symmetry does a regular polygon with ${n} sides have?`, n, "A regular polygon has the same number of lines of symmetry as sides.", undefined, { min: 3, max: 14 });
}

const SYMMETRY_FACTS: { prompt: string; right: string; wrong: string[]; hint: string; shape?: "rectangle" | "rhombus" | "parallelogram" | "trapezoid" | "circle" }[] = [
  { prompt: "How many lines of symmetry does a rectangle that is not a square have?", right: "2", wrong: ["0", "1", "4"], hint: "Fold it in half from side to side, or from top to bottom. The diagonals do not work.", shape: "rectangle" },
  { prompt: "How many lines of symmetry does a rhombus that is not a square have?", right: "2", wrong: ["0", "1", "4"], hint: "The two diagonals of a rhombus are its lines of symmetry.", shape: "rhombus" },
  { prompt: "A slanted parallelogram has no corners that are square. How many lines of symmetry does it have?", right: "0", wrong: ["1", "2", "4"], hint: "No fold makes the two halves match, but a half turn does.", shape: "parallelogram" },
  { prompt: "An isosceles trapezoid has two equal slanted sides. How many lines of symmetry does it have?", right: "1", wrong: ["0", "2", "4"], hint: "Fold it from the middle of the top to the middle of the bottom.", shape: "trapezoid" },
  { prompt: "What does it mean when a shape has a line of symmetry?", right: "Folding along the line makes the two halves match exactly", wrong: ["The shape has equal sides", "The shape has no corners", "The shape is a regular polygon"], hint: "Reflection symmetry means one half is the mirror image of the other half." },
  { prompt: "A shape looks the same after a half turn (180°) around its centre. What kind of symmetry is this?", right: "rotational symmetry of order 2", wrong: ["reflection symmetry only", "no symmetry", "rotational symmetry of order 4"], hint: "A half turn fits the shape onto itself, and a full turn does it a second time. That makes 2 positions." },
  { prompt: "Which shape has rotational symmetry but no line of symmetry?", right: "a slanted parallelogram", wrong: ["a square", "an isosceles triangle", "a rectangle"], hint: "A slanted parallelogram fits onto itself after a half turn, but folding never matches its halves.", shape: "parallelogram" },
  { prompt: "A circle has…", right: "an endless number of lines of symmetry", wrong: ["exactly 1 line of symmetry", "exactly 4 lines of symmetry", "no lines of symmetry"], hint: "Any line through the centre of a circle works as a fold line." },
  { prompt: "A scalene triangle has three different side lengths. How many lines of symmetry does it have?", right: "0", wrong: ["1", "2", "3"], hint: "No fold can match all the sides, since none of them are equal." },
  { prompt: "How many lines of symmetry does an isosceles triangle (not equilateral) have?", right: "1", wrong: ["0", "2", "3"], hint: "The line runs from the corner between the two equal sides to the middle of the opposite side." },
];

function symmetryFact(): Question {
  const fact = pick(SYMMETRY_FACTS);
  return textChoice(fact.prompt, fact.right, fact.wrong, fact.hint, fact.shape ? { type: "shape", shape: fact.shape } : undefined);
}

function symmetry(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return buildSet([
    linesOfSymmetry,
    rotationalOrder,
    symmetryFact,
    symmetryFact,
    ...(d === 1 ? [linesOfSymmetry, symmetryFact, rotationalOrder, symmetryFact] : d === 2 ? [turnAngle, symmetryFact, generalLines, linesOfSymmetry] : [turnAngle, turnAngle, generalLines, symmetryFact]),
  ]);
}

export const units: Unit[] = [
  {
    id: "divisibility-ab",
    title: "Divisibility Tests",
    emoji: "➗",
    blurb: "Can it be shared with nothing left?",
    standards: ab("5N3.1", "using divisibility tests (including for 0) to decide if a number can be divided evenly"),
    parentNote: "Tests for divisibility by 2, 3, 4, 5, 6, 8, 9 and 10, such as adding the digits for 3 and 9 or checking the last digit for 5 and 10, and the idea that 0 is divisible by every whole number.",
    generate: divisibility,
  },
  {
    id: "fraction-add-subtract-ab",
    title: "Add & Subtract Fractions",
    emoji: "🍕",
    blurb: "Same denominator, add the parts",
    standards: ab("5N6.1", "adding and subtracting fractions with a common denominator"),
    parentNote: "Adding and subtracting fractions that already share a denominator: the number of equal parts stays the same and only the number of parts changes. Sums can be larger than 1.",
    generate: fractionAddSub,
  },
  {
    id: "symmetry-ab",
    title: "Symmetry",
    emoji: "🦋",
    blurb: "Mirror lines and turns",
    standards: ab("5G1.1, 5G1.2", "reflection and rotational symmetry in 2D shapes and regular polygons"),
    parentNote: "Lines of reflection symmetry, the order of rotational symmetry and how both work for regular polygons (a regular polygon with n sides has n lines of symmetry and rotational symmetry of order n).",
    generate: symmetry,
  },
];
