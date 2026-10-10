import { fmt, frac, lin, numQ, piAnswer, ROUND_NOTE, textQ, typed } from "../grades/kit";
import { pick, randInt, sample } from "../random";
import type { Question, Unit, Visual } from "../types";
import { ab, buildSet, levelOf, NAMES, type Level } from "./kit";
import { fromItems, q } from "./g8-bank";

// Alberta Grade 8 math units written for the Alberta K–9 Mathematics Program of Studies (2007).
// BC and Ontario units that fit are shared in g8.ts; these cover outcomes those units don't
// (whole-number square roots without cubes, GST-only percent problems, linear relations,
// nets and views, congruence, graph critique and independent events). All questions are original.

const sgn = (n: number): string => (n < 0 ? `− ${-n}` : `+ ${n}`);

// ---------- Perfect squares and square roots (N1, N2) ----------

function squaresRoots(opts?: { difficulty?: Level }): Question[] {
  const l = levelOf(opts);
  const [lo, hi] = l === 1 ? [2, 10] : l === 2 ? [4, 15] : [8, 25];
  const n = () => randInt(lo, hi);
  const sq = (): Question => {
    const k = n();
    return typed(`What is ${k}²?`, String(k * k), `${k}² means ${k} × ${k} = ${k * k}.`, "number");
  };
  const root = (): Question => {
    const k = n();
    return typed(`What is √${k * k}?`, String(k), `Which number multiplied by itself makes ${k * k}? ${k} × ${k} = ${k * k}, so √${k * k} = ${k}.`, "number");
  };
  const perfect = (): Question => {
    const k = randInt(Math.max(3, lo), hi);
    const s = k * k;
    return textQ("Which of these is a perfect square?", String(s), [String(s + 1), String(s + 2), String(s - 1)], `A perfect square is a whole number times itself. ${k} × ${k} = ${s}.`);
  };
  const between = (): Question => {
    const k = randInt(Math.max(3, lo), hi);
    const m = k * k + randInt(1, 2 * k);
    return textQ(
      `√${m} is between which two whole numbers?`,
      `${k} and ${k + 1}`,
      [`${k - 1} and ${k}`, `${k + 1} and ${k + 2}`, `${k + 2} and ${k + 3}`],
      `${k}² = ${k * k} and ${k + 1}² = ${(k + 1) * (k + 1)}. Since ${m} is between them, √${m} is between ${k} and ${k + 1}.`,
    );
  };
  const closest = (): Question => {
    const k = randInt(Math.max(4, lo), hi);
    const j = randInt(1, k - 1);
    const up = randInt(0, 1) === 1;
    const m = up ? (k + 1) * (k + 1) - j : k * k + j;
    const ans = up ? k + 1 : k;
    return numQ(
      `Which whole number is closest to √${m}?`,
      ans,
      [ans - 1, ans + 1, ans + 2],
      `${k}² = ${k * k} and ${k + 1}² = ${(k + 1) * (k + 1)}. ${m} is ${up ? `just under ${(k + 1) * (k + 1)}` : `just over ${k * k}`}, so √${m} is closest to ${ans}.`,
    );
  };
  const area = (): Question => {
    const k = n();
    return typed(`A square garden has an area of ${k * k} m². How long is each side?`, String(k), `Area = side × side, so the side is √${k * k} = ${k} m.`, "number", { suffix: "m" });
  };
  const calc = (): Question => {
    const m = pick([20, 30, 40, 50, 60, 70, 80, 90, 150]);
    return textQ(
      `A calculator shows √${m} ≈ ${Math.sqrt(m).toFixed(7)}. Why is this only an approximation?`,
      `${m} is not a perfect square, so its square root is a decimal that never ends or repeats.`,
      [`The calculator can only show whole numbers.`, `${m} is a perfect square, so the answer is exact.`, `Square roots are always rounded to one decimal place.`],
      `Only perfect squares have whole-number square roots. For other numbers the calculator shows a rounded value.`,
    );
  };
  const rangeNum = (): Question => {
    const k = randInt(4, Math.min(hi, 14));
    const right = k * k + randInt(1, 2 * k);
    return numQ(
      `Which number has a square root between ${k} and ${k + 1}?`,
      right,
      [k * k - 2, (k + 1) * (k + 1) + 2, k * k - 6],
      `Square ${k} and ${k + 1}: ${k * k} and ${(k + 1) * (k + 1)}. The number must be between them.`,
    );
  };
  return buildSet([sq, sq, root, root, perfect, between, closest, () => pick([area, calc, rangeNum])()]);
}

// ---------- Percents, including fractions of a percent and more than 100% (N3) ----------

function percents(opts?: { difficulty?: Level }): Question[] {
  const l = levelOf(opts);
  const percentOf = (): Question => {
    const p = pick(l === 1 ? [10, 20, 25, 50] : l === 2 ? [5, 15, 30, 35, 40, 60, 75] : [5, 15, 35, 125, 150, 175]);
    const N = pick(l === 1 ? [20, 40, 60, 80, 100, 200] : [20, 40, 60, 80, 100, 120, 200, 300]);
    const a = (p * N) / 100;
    return typed(`What is ${p}% of ${N}?`, fmt(a), `${p}% = ${p}/100. ${p}/100 × ${N} = ${fmt(a)}.`, "number");
  };
  const fractionalPercent = (): Question => {
    const [p, N] = pick<[number, number]>([[0.5, 2000], [0.5, 600], [0.25, 800], [0.1, 3000], [0.2, 1500], [0.75, 400], [0.3, 1000]]);
    const a = Number(((p * N) / 100).toFixed(4));
    return typed(`What is ${p}% of ${N}?`, fmt(a), `${p}% is less than 1%. As a decimal it is ${fmt(p / 100)}, and ${fmt(p / 100)} × ${N} = ${fmt(a)}.`, "decimal");
  };
  const over100 = (): Question => {
    const base = pick([20, 40, 60, 80]);
    const p = pick([125, 150, 175, 200]);
    const a = (base * p) / 100;
    return typed(`A club has ${base} members. Next year it hopes to have ${p}% of that number. How many members is that?`, fmt(a), `${p}% is more than the whole. ${p}% = ${fmt(p / 100)}, and ${base} × ${fmt(p / 100)} = ${fmt(a)}.`, "number");
  };
  const conv = pick([
    { pct: "7.5%", dec: "0.075", wrong: ["0.75", "7.5", "0.0075"] },
    { pct: "0.5%", dec: "0.005", wrong: ["0.05", "0.5", "5"] },
    { pct: "125%", dec: "1.25", wrong: ["12.5", "0.125", "125"] },
    { pct: "250%", dec: "2.5", wrong: ["25", "0.25", "250"] },
    { pct: "0.8%", dec: "0.008", wrong: ["0.08", "0.8", "8"] },
    { pct: "3.5%", dec: "0.035", wrong: ["0.35", "3.5", "0.0035"] },
  ]);
  const convDec = (): Question => textQ(`Which decimal is equal to ${conv.pct}?`, conv.dec, conv.wrong, `Divide the percent by 100: move the decimal point two places to the left.`);
  const fp = pick([
    { f: "3/8", p: "37.5%", wrong: ["0.375%", "3.75%", "62.5%"] },
    { f: "5/8", p: "62.5%", wrong: ["0.625%", "6.25%", "37.5%"] },
    { f: "7/8", p: "87.5%", wrong: ["8.75%", "0.875%", "12.5%"] },
    { f: "1/8", p: "12.5%", wrong: ["1.25%", "0.125%", "87.5%"] },
    { f: "1/20", p: "5%", wrong: ["20%", "0.5%", "2%"] },
    { f: "9/4", p: "225%", wrong: ["22.5%", "94%", "2.25%"] },
    { f: "7/5", p: "140%", wrong: ["70%", "14%", "1.4%"] },
  ]);
  const fracToPct = (): Question => textQ(`Which percent is equal to ${fp.f}?`, fp.p, fp.wrong, `Divide the top by the bottom to get a decimal, then multiply by 100.`);
  const gst = (): Question => {
    const N = pick(l === 1 ? [20, 40, 60, 100, 200] : [30, 50, 70, 90, 150, 250]);
    const t = Number((N * 1.05).toFixed(2));
    return typed(
      `In Alberta there is 5% GST and no provincial sales tax. A jacket costs $${N} before tax. What is the total price, in dollars?`,
      fmt(t),
      `5% of ${N} is ${fmt((N * 5) / 100)}. Add it to ${N}, or multiply by 1.05: ${fmt(t)}.`,
      "decimal",
      { accept: [t.toFixed(2)] },
    );
  };
  const combined = (): Question => {
    const s = pick([200, 400]);
    const r1 = pick([10, 20, 50]);
    const r2 = pick([10, 20, 25]);
    const total = (s * (100 + r1) * (100 + r2)) / 10000;
    return typed(
      `A town of ${s} people grows by ${r1}% one year. The next year it grows by ${r2}% of the new total. How many people live there now?`,
      fmt(total),
      `After year one: ${s} × ${fmt(1 + r1 / 100)} = ${fmt((s * (100 + r1)) / 100)}. After year two: that × ${fmt(1 + r2 / 100)} = ${fmt(total)}. It is not a ${r1 + r2}% increase, because the second percent is taken from a bigger number.`,
      "number",
    );
  };
  return buildSet([percentOf, percentOf, fractionalPercent, over100, convDec, fracToPct, gst, combined]);
}

// ---------- Linear relations (PR1) ----------

function linearRelations(opts?: { difficulty?: Level }): Question[] {
  const l = levelOf(opts);
  const mAny = () => (l === 3 && randInt(0, 2) === 0 ? -randInt(2, 5) : randInt(2, 6));
  const bAny = () => randInt(-5, 9);
  const xAny = () => (l === 1 ? randInt(1, 6) : l === 2 ? randInt(-3, 8) : randInt(-8, 8));
  const missY = (): Question => {
    const m = mAny(), b = bAny(), x = xAny();
    const y = m * x + b;
    return typed(`For the relation y = ${lin(m, b, "x")}, what is y when x = ${x}?`, String(y), `Replace x with ${x}: ${m} × ${x < 0 ? `(${x})` : x} ${sgn(b)} = ${y}.`, "integer");
  };
  const missX = (): Question => {
    const m = randInt(2, 5), b = bAny(), x = randInt(-4, 8);
    const y = m * x + b;
    return typed(`The ordered pair (?, ${y}) is on the line y = ${lin(m, b, "x")}. What is the missing x-value?`, String(x), `Put y = ${y} in the equation: ${y} = ${lin(m, b, "x")}. Undo the ${b < 0 ? "subtraction" : "addition"}, then divide by ${m}: x = ${x}.`, "integer");
  };
  const tableMissing = (): Question => {
    const m = randInt(2, 6), b = bAny();
    const xs = [0, 1, 2, 3, 4];
    const hide = randInt(2, 4);
    const visual: Visual = { type: "table", title: "Table of values", headers: ["x", "y"], rows: xs.map((x) => [x, x === hide ? "?" : m * x + b]) };
    return typed(`The table shows a linear relation. What number goes in place of the ?`, String(m * hide + b), `Look at how y changes each time x goes up by 1. It changes by ${m}, so y = ${m * hide + b} when x = ${hide}.`, "integer", { visual });
  };
  const matchEq = (): Question => {
    const m = randInt(2, 5), b = randInt(1, 6);
    if (m === b) b += 1;
    const visual: Visual = { type: "table", headers: ["x", "y"], rows: [1, 2, 3, 4].map((x) => [x, m * x + b]) };
    return textQ(
      "Which equation matches the table of values?",
      `y = ${m}x + ${b}`,
      [`y = ${m}x − ${b}`, `y = ${m + 1}x + ${b}`, `y = ${b}x + ${m}`],
      `Test the first row: x = 1 gives y = ${m + b}. Only y = ${m}x + ${b} works for every row.`,
      visual,
    );
  };
  const onLine = (): Question => {
    const m = randInt(2, 5), b = randInt(1, 8), x = randInt(1, 7);
    const y = m * x + b;
    return textQ(
      `Which ordered pair is on the graph of y = ${m}x + ${b}?`,
      `(${x}, ${y})`,
      [`(${x}, ${y + 1})`, `(${x}, ${y - 1})`, `(${x}, ${m * x})`],
      `Substitute x = ${x}: ${m} × ${x} + ${b} = ${y}.`,
    );
  };
  const changeBy = (): Question => {
    const m = mAny(), b = bAny();
    return typed(`In the relation y = ${lin(m, b, "x")}, by how much does y change each time x increases by 1?`, String(m), `The number multiplying x is ${m}, so y changes by ${m} for each step of 1 in x.`, "integer");
  };
  const discrete = (): Question => {
    const [item, what] = pick([
      ["tickets", "total cost"],
      ["notebooks", "total cost"],
      ["team shirts", "total cost"],
    ]);
    return textQ(
      `A graph shows the number of ${item} bought (1, 2, 3 and so on) and the ${what}. Should the points be joined with a line?`,
      `No. You can only buy a whole number of ${item}, so only separate points make sense.`,
      [`Yes. Every point on the line is a possible number of ${item}.`, `Yes. Graphs of linear relations must always be joined.`, `No. A linear relation cannot be graphed.`],
      `Discrete data counts whole items, so values between the points are not possible.`,
    );
  };
  return buildSet([missY, missY, missX, tableMissing, matchEq, onLine, changeBy, discrete]);
}

// ---------- Equations with brackets and division (PR2) ----------

function bracketEquations(opts?: { difficulty?: Level }): Question[] {
  const l = levelOf(opts);
  const xv = () => {
    const x = l === 1 ? randInt(1, 9) : randInt(-8, 10);
    return x === 0 ? 3 : x;
  };
  const bracket = (): Question => {
    const a = randInt(2, 6);
    let b = randInt(-5, 6);
    if (b === 0) b = 2;
    const x = xv();
    const c = a * (x + b);
    return typed(`Solve for x: ${a}(x ${sgn(b)}) = ${c}`, String(x), `Divide both sides by ${a}: x ${sgn(b)} = ${c / a}. Then ${b < 0 ? "add" : "subtract"} ${Math.abs(b)}: x = ${x}. Check: ${a}(${x} ${sgn(b)}) = ${c}.`, "integer");
  };
  const divide = (): Question => {
    const a = randInt(2, 8);
    let v = l === 1 ? randInt(1, 9) : randInt(-6, 9);
    if (v === 0) v = 4;
    return typed(`Solve for x: x ÷ ${a} = ${v}`, String(a * v), `Multiply both sides by ${a}: x = ${v} × ${a} = ${a * v}.`, "integer");
  };
  const mult = (): Question => {
    const a = randInt(2, 9);
    const x = xv();
    return typed(`Solve for x: ${a}x = ${a * x}`, String(x), `Divide both sides by ${a}: x = ${a * x} ÷ ${a} = ${x}.`, "integer");
  };
  const twoStep = (): Question => {
    const a = randInt(2, 7);
    let b = randInt(-9, 12);
    if (b === 0) b = 5;
    const x = xv();
    const c = a * x + b;
    return typed(`Solve for x: ${a}x ${sgn(b)} = ${c}`, String(x), `Undo the ${b < 0 ? "subtraction" : "addition"} first: ${a}x = ${c - b}. Then divide by ${a}: x = ${x}.`, "integer");
  };
  const verify = (): Question => {
    const a = randInt(2, 6), b = randInt(1, 9), x = randInt(1, 9);
    return numQ(`Which value of x makes ${a}x + ${b} = ${a * x + b} true?`, x, [x + 1, x - 1, x + 2], `Substitute each value. Only x = ${x} gives ${a} × ${x} + ${b} = ${a * x + b}.`);
  };
  const equivalent = (): Question => {
    const a = randInt(2, 6);
    let b = randInt(2, 7);
    if (b === a) b += 1;
    const c = randInt(10, 40);
    return textQ(
      `Which equation is equivalent to ${a}(x + ${b}) = ${c}?`,
      `${a}x + ${a * b} = ${c}`,
      [`${a}x + ${b} = ${c}`, `x + ${a * b} = ${c}`, `${a}x + ${a} = ${c}`],
      `Use the distributive property: ${a}(x + ${b}) = ${a}x + ${a} × ${b} = ${a}x + ${a * b}.`,
    );
  };
  const word = (): Question => {
    const name = pick(NAMES);
    const a = randInt(2, 6), p = randInt(2, 9), b = randInt(2, 9);
    return typed(`${name} buys ${a} notebooks that cost the same, plus a pen for $${b}. The total is $${a * p + b}. How much does one notebook cost, in dollars?`, String(p), `Let n be the price of a notebook: ${a}n + ${b} = ${a * p + b}. Subtract ${b}, then divide by ${a}: n = ${p}.`, "number");
  };
  const error = (): Question => {
    const a = randInt(2, 6);
    const b = randInt(2, 7);
    const c = a * randInt(4, 9);
    return textQ(
      `Dev wrote ${a}(x + ${b}) = ${c} as ${a}x + ${b} = ${c}. What went wrong?`,
      `He multiplied only x by ${a}. The ${b} must be multiplied by ${a} too.`,
      [`He should have divided by x first.`, `Nothing. The two equations are equivalent.`, `He should have subtracted ${a} from both sides.`],
      `The ${a} outside the brackets multiplies everything inside: ${a}(x + ${b}) = ${a}x + ${a * b}.`,
    );
  };
  return buildSet([bracket, bracket, divide, mult, twoStep, verify, equivalent, () => pick([word, error])()]);
}

// ---------- Nets and views of 3-D objects (SS2, SS5) ----------

const NETS = [
  q(1, "A net of a cylinder has two circles and one…", "rectangle", ["triangle", "square", "circle"], "A cylinder's curved side unrolls into a rectangle."),
  q(1, "A net of a triangular prism has how many triangles?", "2", ["1", "3", "4"], "The two triangular bases are the only triangles."),
  q(1, "Which 3-D object folds from a net of six identical squares?", "a cube", ["a triangular prism", "a cylinder", "a cone"], "A cube has six square faces that are all the same size."),
  q(1, "What is a net?", "a flat pattern that folds up to make a 3-D object", ["a picture of an object from above", "a measure of the space inside an object", "a pattern of tiles with no gaps"], "Unfold a box and lay it flat: that flat pattern is a net."),
  q(1, "A cylinder stands on its base. What does its top view look like?", "a circle", ["a rectangle", "a triangle", "a square"], "Looking straight down at a can, you see its round top."),
  q(1, "A cylinder stands on its base. What does its front view look like?", "a rectangle", ["a circle", "a triangle", "an oval"], "From the side, a can looks like a rectangle."),
  q(2, "A net of a triangular prism has how many rectangles?", "3", ["2", "4", "5"], "One rectangle covers each side of the triangle."),
  q(2, "In a net of a rectangular prism, opposite rectangles are…", "the same size", ["always squares", "always different sizes", "triangles"], "Opposite faces of a rectangular prism match."),
  q(2, "In a net of a cylinder, the length of the rectangle matches the…", "circumference of the circle", ["diameter of the circle", "area of the circle", "radius of the circle"], "The rectangle wraps once around the circle's edge."),
  q(2, "In a net of a cylinder, the width of the rectangle matches the…", "height of the cylinder", ["radius of the circle", "circumference of the circle", "area of the circle"], "The rectangle's other side runs from the bottom to the top of the cylinder."),
  q(2, "How many faces does a rectangular prism have in all?", "6", ["4", "5", "8"], "Top, bottom, front, back and two sides make 6 faces."),
  q(2, "A square pyramid's net has how many triangles?", "4", ["1", "2", "5"], "One triangle rises from each side of the square base."),
  q(3, "Three cubes sit in a row, and a fourth cube sits on top of the left end cube. What does the top view look like?", "a row of 3 squares", ["an L-shape of 4 squares", "a single square", "a column of 2 squares"], "From above, the cube on top hides the cube below it, so you still see 3 squares in a row."),
  q(3, "Three cubes sit in a row, and a fourth cube sits on top of the left end cube. What does the front view look like?", "an L-shape: 3 squares along the bottom and 1 above the left end", ["a row of 3 squares", "a single square", "a column of 4 squares"], "From the front you see the row of 3 and the extra cube sitting above the left one."),
  q(3, "Three cubes sit in a row, and a fourth cube sits on top of the left end cube. You look at it from the right-hand side. What do you see?", "a column of 2 squares", ["a column of 4 squares", "a row of 3 squares", "a single square"], "From the end, the rows line up behind each other. The tallest stack is 2 cubes high."),
  q(3, "A solid has a square top view and a triangular front view. Which solid is it?", "a square pyramid", ["a cube", "a triangular prism", "a cylinder"], "A square pyramid looks like a triangle from the side and a square from above."),
  q(3, "You turn a block structure 90° on its base. What stays the same?", "the number of cubes in the structure", ["the front view", "the top view", "the side view"], "Turning changes which views you see, but not how many blocks there are."),
];

const netsViews = fromItems(NETS, [
  (l) => {
    const d = randInt(2, l === 1 ? 6 : 12);
    const p = piAnswer(d);
    return typed(`A can has a diameter of ${d} cm. In its net, one side of the rectangle wraps around the circle. How long is that side? ${ROUND_NOTE}`, p.answer, `Circumference = π × diameter ≈ 3.14 × ${d} = ${fmt(p.exact)}, which is ${p.answer} cm to one decimal place.`, "decimal", { suffix: "cm", accept: p.accept });
  },
  () => {
    const n = randInt(3, 8);
    return typed(`A prism has a base with ${n} sides. How many faces does it have in all?`, String(n + 2), `${n} rectangles go around the sides, plus 2 bases: ${n} + 2 = ${n + 2}.`, "number");
  },
]);

// ---------- Congruence and transformations (SS6) ----------

const CONGRUENCE = [
  q(1, "Congruent shapes have the same…", "size and shape", ["colour only", "size only", "number of sides only"], "Congruent shapes match exactly, so one could sit exactly on top of the other."),
  q(1, "Which of these keeps a shape congruent?", "sliding it", ["enlarging it to double its size", "stretching it taller", "shrinking it to half its size"], "Slides, flips and turns move a shape without changing its size or shape."),
  q(1, "A triangle is flipped over a line. Is the image congruent to the original?", "yes", ["no, it is a different size", "no, it has different angles", "only if it is a square"], "A reflection (flip) makes a mirror image the same size and shape."),
  q(1, "A turn about a point is called a…", "rotation", ["translation", "reflection", "dilation"], "Rotation means turning. Translation is a slide and reflection is a flip."),
  q(2, "A 4 cm by 6 cm rectangle and a 6 cm by 4 cm rectangle are…", "congruent", ["not congruent, because they point different ways", "not congruent, because 4 ≠ 6", "similar but never congruent"], "Turn one rectangle a quarter turn and it fits exactly on the other."),
  q(2, "Two triangles have sides 3 cm, 4 cm, 5 cm and 3 cm, 4 cm, 6 cm. Are they congruent?", "no, one pair of sides is different", ["yes, two sides match", "yes, they are both triangles", "only if their angles are 90°"], "All three pairs of matching sides must be equal."),
  q(2, "Polygon ABCD is congruent to polygon PQRS, with A matching P, B matching Q and so on. If AB = 5 cm, which side must also be 5 cm?", "PQ", ["QR", "RS", "SP"], "Corresponding sides are in the same position: AB matches PQ."),
  q(2, "In congruent polygons, matching angles and sides are called…", "corresponding", ["opposite", "adjacent", "parallel"], "Corresponding parts are in the same position in each shape."),
  q(3, "A shape is reflected, then rotated. Is the final image congruent to the original?", "yes, each move keeps the size and shape", ["no, a reflection changes the size", "no, only one move can be used", "only if the rotation is 180°"], "A combination of slides, flips and turns still gives a congruent image."),
  q(3, "Triangle ABC is translated to make triangle A′B′C′. Which statement is true?", "∠A = ∠A′ and AB = A′B′", ["∠A is larger than ∠A′", "AB is shorter than A′B′", "the triangles have different areas"], "A translation moves every point the same way, so lengths and angles do not change."),
];

const transformPoint = (kind: "translate" | "reflect" | "rotate", l: Level): Question => {
  const x = randInt(2, l === 1 ? 5 : 8) * (randInt(0, 1) ? 1 : -1);
  let y = randInt(1, l === 1 ? 4 : 7) * (randInt(0, 1) ? 1 : -1);
  if (Math.abs(x) === Math.abs(y)) y = y > 0 ? y + 1 : y - 1;
  const pt = (a: number, b: number) => `(${a}, ${b})`;
  if (kind === "translate") {
    const dx = randInt(1, 5), dy = randInt(1, 5);
    const rx = randInt(0, 1) ? dx : -dx, ry = randInt(0, 1) ? dy : -dy;
    return textQ(
      `Point A${pt(x, y)} is translated ${Math.abs(rx)} unit${Math.abs(rx) === 1 ? "" : "s"} ${rx > 0 ? "right" : "left"} and ${Math.abs(ry)} unit${Math.abs(ry) === 1 ? "" : "s"} ${ry > 0 ? "up" : "down"}. What are the coordinates of A′?`,
      pt(x + rx, y + ry),
      [pt(x - rx, y - ry), pt(x + rx, y - ry), pt(x - rx, y + ry)],
      `Right and up add to a coordinate. Left and down subtract. x changes by ${rx} and y changes by ${ry}.`,
    );
  }
  if (kind === "reflect") {
    const axis = pick(["x-axis", "y-axis"]);
    const right = axis === "x-axis" ? pt(x, -y) : pt(-x, y);
    return textQ(
      `Point A${pt(x, y)} is reflected in the ${axis}. What are the coordinates of A′?`,
      right,
      [pt(-x, -y), axis === "x-axis" ? pt(-x, y) : pt(x, -y), pt(y, x)],
      `A reflection in the ${axis} flips the point across it. ${axis === "x-axis" ? "The y-coordinate changes sign." : "The x-coordinate changes sign."}`,
    );
  }
  const turn = pick(["180°", "90° clockwise", "90° counterclockwise"]);
  const right = turn === "180°" ? pt(-x, -y) : turn === "90° clockwise" ? pt(y, -x) : pt(-y, x);
  const wrongs = turn === "180°" ? [pt(x, -y), pt(-x, y), pt(y, x)] : [pt(-x, -y), turn === "90° clockwise" ? pt(-y, x) : pt(y, -x), pt(x, -y)];
  return textQ(
    `Point A${pt(x, y)} is rotated ${turn} about the origin. What are the coordinates of A′?`,
    right,
    wrongs,
    turn === "180°" ? "A half turn changes the sign of both coordinates." : "A quarter turn swaps the coordinates and changes the sign of one of them. Picture the point turning on a grid.",
  );
};

const congruence = fromItems(CONGRUENCE, [(l) => transformPoint(pick(["translate", "reflect", "rotate"]), l), (l) => transformPoint(l === 1 ? "translate" : pick(["reflect", "rotate"]), l)]);

// ---------- Critiquing graphs (SP1) ----------

const GRAPHS = [
  q(1, "Which graph is best for comparing the number of students in each school club?", "a bar graph", ["a circle graph", "a line graph", "a scatter plot"], "A bar graph compares amounts for separate categories."),
  q(1, "Which graph is best for showing how the temperature changed through one day?", "a line graph", ["a bar graph", "a circle graph", "a pictograph"], "A line graph shows change over time."),
  q(1, "Which graph is best for showing how a family budget is divided into parts of a whole?", "a circle graph", ["a line graph", "a bar graph", "a pictograph"], "A circle graph shows parts of a whole."),
  q(1, "The sectors of a circle graph add up to…", "100%", ["50%", "360%", "10%"], "The whole circle is 100%, or 360 degrees."),
  q(1, "A graph has no title and no labels on its axes. What is the problem?", "Readers cannot tell what the data means.", ["The data must be wrong.", "It must be a circle graph.", "Nothing, graphs never need titles."], "A good graph has a title, labels, units and a source."),
  q(2, "A bar graph's vertical axis starts at 90 instead of 0. What effect can this have?", "Small differences look much bigger than they are.", ["Large differences look smaller.", "It makes the bars wider.", "It changes the data."], "When the axis does not start at 0, the bars are cut short and the gaps look exaggerated."),
  q(2, "A survey about favourite sports asks only the members of the school hockey team. What is the problem?", "The sample is biased toward hockey.", ["The sample is too large.", "The survey has too many questions.", "Nothing, it is a fair sample."], "A fair sample should represent the whole group, not only one part of it."),
  q(2, "Which survey question is the least biased?", "What is your favourite lunch?", ["Don't you agree that pizza is the tastiest lunch?", "Wouldn't you say salad is boring?", "Pizza is great, so which kind do you want?"], "Fair questions do not push people toward an answer."),
  q(2, "A pictograph uses bigger and bigger pictures to show bigger amounts. Why can this mislead readers?", "A larger picture covers more area, so it looks like a much larger amount.", ["Pictures are always accurate.", "Readers cannot see the pictures.", "It makes all the amounts the same."], "Compare heights or counts of equal-sized symbols, not areas of different-sized pictures."),
  q(2, "Five students out of a school of 600 are surveyed. Why is the conclusion weak?", "The sample is too small to represent the school.", ["Five is too many.", "The school is too small.", "Surveys can never be used."], "A larger, fairly chosen sample gives more reliable results."),
  q(3, "A radio station surveys visitors at the Calgary Stampede about their favourite Alberta event. Can the results describe all Albertans?", "No, the visitors are not a fair sample of everyone in Alberta.", ["Yes, visitors come from everywhere.", "Yes, because the survey is about Alberta.", "Yes, if the graph is in colour."], "People at one event may not share the views of everyone in the province."),
  q(3, "A line graph shows sales rising from 40 to 44 over 6 months, with the axis running from 39 to 45. A headline says 'Sales skyrocket!'. What is the problem?", "The narrow scale makes a small rise look huge.", ["The line graph shows the wrong kind of data.", "Sales can never rise.", "The months are in the wrong order."], "The scale choice stretched a change of 4 into a steep line."),
  q(3, "A circle graph shows 'Other' as the biggest sector, taking 45% of the data. What does this suggest?", "The categories should be broken down further.", ["The data is perfect.", "The graph needs a bigger title.", "The percents must add to more than 100%."], "A very large 'Other' sector hides information. Splitting it up makes the graph more useful."),
  q(3, "Which source is the most reliable for the population of Alberta?", "a national statistics agency", ["a post by an unknown account", "an advertisement", "a friend's guess"], "Reliable data comes from a trustworthy organization that explains how it counted."),
  q(3, "A graph shows that ice cream sales and sunburns both rise in July. A writer says ice cream causes sunburn. What is wrong?", "Both are linked to hot, sunny weather. One does not cause the other.", ["Ice cream is made of sunscreen.", "Graphs cannot show July.", "There is nothing wrong with the claim."], "Two things changing together does not mean one causes the other."),
];

const graphCritique = fromItems(GRAPHS, [
  (l) => {
    const N = pick(l === 1 ? [80, 200] : [80, 120, 200, 500]);
    const p = pick(l === 1 ? [25, 50] : [15, 30, 35, 45]);
    const a = (N * p) / 100;
    return typed(`In a circle graph of ${N} survey responses, the 'walk to school' sector is ${p}%. How many responses is that?`, fmt(a), `${p}% of ${N} = ${p}/100 × ${N} = ${fmt(a)}.`, "number");
  },
  () => {
    const parts = pick([[40, 25, 20], [35, 30, 15], [50, 20, 10], [45, 25, 5]]);
    const rest = 100 - parts[0] - parts[1] - parts[2];
    return typed(`A circle graph has three sectors of ${parts[0]}%, ${parts[1]}% and ${parts[2]}%. One sector is left. What percent is it?`, String(rest), `The whole circle is 100%. 100 − ${parts[0]} − ${parts[1]} − ${parts[2]} = ${rest}.`, "number", { suffix: "%" });
  },
]);

// ---------- Probability of independent events (SP2) ----------

function independentEvents(opts?: { difficulty?: Level }): Question[] {
  const l = levelOf(opts);
  const f = (n: number, d: number) => {
    const ans = frac(n, d);
    return { ans, accept: [`${n}/${d}`] };
  };
  const coinDie = (): Question => {
    const side = pick(["heads", "tails"]);
    const [ev, ne] = pick<[string, number]>(l === 1 ? [["a 6", 1], ["an even number", 3]] : [["a 6", 1], ["an even number", 3], ["a number greater than 4", 2], ["a 1 or a 2", 2]]);
    const { ans, accept } = f(ne, 12);
    return typed(`A coin is tossed and a die is rolled. What is P(${side} and ${ev})? Type a fraction in lowest terms.`, ans, `P(${side}) = 1/2 and P(${ev}) = ${frac(ne, 6)}. For independent events, multiply: 1/2 × ${frac(ne, 6)} = ${ans}.`, "fraction", { accept });
  };
  const bag = (): Question => {
    const r = randInt(2, 5), b = randInt(2, 5), t = r + b;
    const { ans, accept } = f(r * r, t * t);
    return typed(`A bag has ${r} red and ${b} blue marbles. A marble is drawn, put back, and then a second marble is drawn. What is P(red both times)? Type a fraction in lowest terms.`, ans, `The marble is put back, so the draws are independent. P(red) = ${frac(r, t)}, and ${frac(r, t)} × ${frac(r, t)} = ${ans}.`, "fraction", { accept });
  };
  const spinners = (): Question => {
    const a = randInt(3, 6), b = randInt(3, 8);
    return typed(`Spinner A has ${a} equal sections numbered 1 to ${a}. Spinner B has ${b} equal sections numbered 1 to ${b}. Both are spun. What is P(1 on A and 1 on B)? Type a fraction.`, `1/${a * b}`, `P(1 on A) = 1/${a} and P(1 on B) = 1/${b}. Multiply: 1/${a} × 1/${b} = 1/${a * b}.`, "fraction");
  };
  const dice = (): Question => {
    const [ev, n] = pick<[string, number]>(l === 1 ? [["an even number", 3]] : [["an even number", 3], ["a 5 or a 6", 2], ["a number greater than 2", 4]]);
    const { ans, accept } = f(n * n, 36);
    return typed(`A die is rolled twice. What is P(${ev} both times)? Type a fraction in lowest terms.`, ans, `P(${ev}) = ${frac(n, 6)} each time. Multiply: ${frac(n, 6)} × ${frac(n, 6)} = ${ans}.`, "fraction", { accept });
  };
  const decimals = (): Question => {
    const [a, b] = pick<[number, number]>([[0.2, 0.5], [0.3, 0.4], [0.5, 0.5], [0.6, 0.5], [0.1, 0.5], [0.4, 0.25]]);
    const p = Number((a * b).toFixed(4));
    return typed(`Events A and B are independent. P(A) = ${a} and P(B) = ${b}. What is P(A and B)?`, fmt(p), `Multiply: ${a} × ${b} = ${fmt(p)}.`, "decimal");
  };
  const which = (): Question =>
    textQ(
      "Which pair of events is independent?",
      "tossing a coin and rolling a die",
      ["drawing two cards from a deck, one after the other, without putting the first back", "choosing two students from a team, one after the other, with no repeats", "it rains today and the school cancels outdoor recess"],
      "Events are independent when the first one does not change the chances of the second.",
    );
  const rule = (): Question =>
    textQ(
      "For two independent events A and B, how do you find P(A and B)?",
      "multiply P(A) × P(B)",
      ["add P(A) + P(B)", "subtract P(B) from P(A)", "divide P(A) by P(B)"],
      "Both events must happen, so you multiply their probabilities.",
    );
  const tree = (): Question => {
    const n = pick([2, 3]);
    return numQ(`A coin is tossed ${n} times. A tree diagram shows every possible outcome. How many outcomes are there?`, 2 ** n, [2 * n, 2 ** n + 2, 2 ** n - 1], `Each toss has 2 outcomes, so there are ${Array(n).fill(2).join(" × ")} = ${2 ** n} outcomes.`, undefined, { min: 1 });
  };
  const makers = sample([coinDie, bag, spinners, dice, decimals], 4);
  return buildSet([...makers, which, rule, tree, () => pick([coinDie, dice, spinners, bag])()]);
}

export const units: Unit[] = [
  {
    id: "squares-roots-ab",
    title: "Squares & Square Roots",
    emoji: "🟦",
    blurb: "Perfect squares, their roots and in-between roots",
    standards: ab("N1, N2", "perfect squares and square roots of whole numbers, and estimating square roots of numbers that are not perfect squares"),
    parentNote: "Finding squares and square roots of whole numbers, spotting perfect squares, and estimating the square root of other numbers by placing it between two whole numbers.",
    generate: squaresRoots,
  },
  {
    id: "percents-ab",
    title: "Percents & GST",
    emoji: "💯",
    blurb: "Percents less than 1% and more than 100%, plus GST",
    standards: ab("N3", "percents from fractions of 1% to more than 100%, converting between fractions, decimals and percents, GST, and combined percents"),
    parentNote: "Percents of all sizes, including 0.5% and 150%, moving between fractions, decimals and percents, adding the 5% GST (Alberta has no provincial sales tax), and why two percent changes in a row do not simply add.",
    generate: percents,
  },
  {
    id: "linear-relations-ab",
    title: "Tables, Graphs & Linear Relations",
    emoji: "📈",
    blurb: "Find missing values in y = mx + b",
    standards: ab("PR1", "ordered pairs, tables of values and graphs of linear relations with whole-number data"),
    parentNote: "Using an equation like y = 3x + 2 to build a table of values, find a missing x or y, and describe how the variables change together.",
    generate: linearRelations,
  },
  {
    id: "bracket-equations-ab",
    title: "Equations with Brackets",
    emoji: "🧮",
    blurb: "Solve ax = b, x ÷ a = b, ax + b = c and a(x + b) = c",
    standards: ab("PR2", "solving linear equations of the forms ax = b, x/a = b, ax + b = c and a(x + b) = c, and checking the solution"),
    parentNote: "Solving one-variable equations, including ones with brackets and negative numbers, checking by substitution, and spotting a common mistake with the distributive property.",
    generate: bracketEquations,
  },
  {
    id: "nets-views-ab",
    title: "Nets & Views",
    emoji: "📦",
    blurb: "Fold nets into solids and picture top, front and side views",
    standards: ab("SS2, SS5", "nets of right prisms and cylinders, and top, front and side views of objects built from rectangular prisms"),
    parentNote: "Matching flat nets to prisms and cylinders, working out what the parts of a net measure, and picturing an object from above, the front and the side.",
    generate: netsViews,
  },
  {
    id: "congruence-ab",
    title: "Congruent Shapes",
    emoji: "🔷",
    blurb: "Slides, flips and turns that keep a shape the same",
    standards: ab("SS6", "congruence of polygons and the coordinates of images after translations, reflections and rotations"),
    parentNote: "Recognizing congruent shapes, matching corresponding sides and angles, and finding the coordinates of a point after a slide, flip or turn.",
    generate: congruence,
  },
  {
    id: "graph-critique-ab",
    title: "Reading Graphs Critically",
    emoji: "📊",
    blurb: "Pick the right graph and spot misleading ones",
    standards: ab("SP1", "choosing and critiquing circle graphs, line graphs, bar graphs and pictographs, including bias and misleading scales"),
    parentNote: "Choosing the best graph for a set of data and noticing when a graph or survey could mislead: a squeezed scale, a biased sample or a loaded question.",
    generate: graphCritique,
  },
  {
    id: "independent-events-ab",
    title: "Independent Events",
    emoji: "🎲",
    blurb: "Multiply probabilities of events that don't affect each other",
    standards: ab("SP2", "the probability of two independent events, and verifying with a tree diagram"),
    parentNote: "Finding the chance that two separate events both happen, such as a coin toss and a die roll, by multiplying their probabilities.",
    generate: independentEvents,
  },
];
