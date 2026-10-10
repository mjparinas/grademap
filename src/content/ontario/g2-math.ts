import { COIN_NAMES } from "../money";
import { chance, pick, randInt, sample, shuffle, textChoice } from "../random";
import type { BuildQuestion, CoinsQuestion, GenerateOptions, OrderQuestion, Question, ShapeName, SortQuestion, Unit, Visual } from "../types";
import { buildSet, eq, levelOf, on, others, numQ, range, THINGS } from "./kit";

// Ontario Grade 2 mathematics (2020 curriculum). Whole numbers go up to 200.

// ---------- Numbers to 200 ----------

function numbersTo200(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const hi = d === 1 ? 100 : 200;
  const read = (): Question => {
    const n = randInt(21, hi);
    return numQ("What number is shown?", n, "Count the hundreds, then the tens, then the ones.", { type: "blocks", hundreds: Math.floor(n / 100), tens: Math.floor((n % 100) / 10), ones: n % 10 }, 200, 0);
  };
  const build = (): BuildQuestion => {
    const target = randInt(30, hi);
    return { kind: "build", prompt: `Build the number ${target}.`, hint: `${target} is ${Math.floor(target / 100)} hundreds, ${Math.floor((target % 100) / 10)} tens and ${target % 10} ones.`, target, hundreds: true };
  };
  const skip = (): Question => {
    const by = d === 1 ? pick([2, 5, 10]) : pick([20, 25, 50]);
    const start = by * randInt(0, 2);
    const seq = [0, 1, 2, 3].map((i) => start + by * i);
    const answer = start + by * 4;
    return numQ(`Count by ${by}s: ${seq.join(", ")}, ?`, answer, `Each number is ${by} more than the one before it.`, undefined, 220, 0);
  };
  const compare = (): Question => {
    const nums = sample(range(30, hi), 3);
    const most = chance(0.5);
    const answer = most ? Math.max(...nums) : Math.min(...nums);
    return textChoice(`Which number is the ${most ? "greatest" : "least"}?`, String(answer), nums.filter((n) => n !== answer).map(String), "Compare the hundreds first, then the tens, then the ones.");
  };
  const order = (): OrderQuestion => {
    const nums = sample(range(30, hi), 4).sort((a, b) => a - b);
    const down = d === 3;
    const list = down ? [...nums].reverse() : nums;
    return { kind: "order", prompt: down ? "Tap the numbers from biggest to smallest." : "Tap the numbers from smallest to biggest.", hint: `Start with ${list[0]}.`, items: list.map((n) => ({ id: String(n), label: String(n) })) };
  };
  const parts = (): Question => {
    const n = randInt(101, hi);
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;
    return numQ(`${n} = ${h} hundred, ${t} tens and how many ones?`, o, "Take off the hundreds and the tens. The ones are what is left.", undefined, 9, 0);
  };
  const evenOdd = (): Question => {
    const n = randInt(11, hi);
    const even = n % 2 === 0;
    return textChoice(`Is ${n} even or odd?`, even ? "even" : "odd", [even ? "odd" : "even"], "Look at the ones digit. If it is 0, 2, 4, 6 or 8 the number is even. An even number can be shared into pairs with none left over.");
  };
  return buildSet([read, read, build, skip, skip, compare, order, d === 1 ? evenOdd : pick([parts, evenOdd])]);
}

// ---------- Sharing fairly ----------

function sharingFairly(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const CASES = [
    { items: 6, sharers: 2, text: "3" },
    { items: 8, sharers: 4, text: "2" },
    { items: 9, sharers: 3, text: "3" },
    { items: 12, sharers: 6, text: "2" },
    { items: 5, sharers: 2, text: "2 and a half" },
    { items: 7, sharers: 2, text: "3 and a half" },
    { items: 3, sharers: 2, text: "1 and a half" },
    { items: 5, sharers: 4, text: "1 and a fourth" },
    { items: 9, sharers: 4, text: "2 and a fourth" },
    { items: 7, sharers: 3, text: "2 and a third" },
    { items: 4, sharers: 3, text: "1 and a third" },
    { items: 9, sharers: 6, text: "1 and a half" },
  ];
  const easy = CASES.filter((c) => !c.text.includes("and"));
  const pool = d === 1 ? easy : d === 2 ? CASES.filter((c) => c.sharers <= 4) : CASES;
  const share = (): Question => {
    const c = pick(pool);
    const t = pick(THINGS);
    const wrong = others([...new Set(CASES.map((x) => x.text))], c.text, 3);
    const q = textChoice(`${c.items} ${t.emoji} are shared fairly by ${c.sharers} friends. How much does each get?`, c.text, wrong.slice(0, 2), "Share them out one at a time. Cut what is left into equal parts.", { type: "dots", count: c.items, emoji: t.emoji });
    q.speak = `${c.items} ${t.word} are shared fairly by ${c.sharers} friends. How much does each get?`;
    return q;
  };
  const equal = (): Question =>
    pick([
      () => textChoice("Which is the same amount as one third?", "two sixths", ["one sixth", "three sixths"], "Cut each third in half and you get two sixths.", { type: "fraction", numerator: 2, denominator: 6, shape: "bar" }),
      () => textChoice("Which is the same amount as one half?", "two fourths", ["one fourth", "three fourths"], "Two fourths fill the same space as one half.", { type: "fraction", numerator: 2, denominator: 4, shape: "bar" }),
      () => textChoice("Which is the same amount as one half?", "three sixths", ["one sixth", "two sixths"], "Three sixths fill the same space as one half.", { type: "fraction", numerator: 3, denominator: 6, shape: "circle" }),
    ])();
  const compare = (): Question => {
    const a = pick([2, 3, 4]);
    const b = pick([4, 6, 8].filter((x) => x !== a));
    const small = Math.min(a, b);
    const big = Math.max(a, b);
    return textChoice(`The same pizza is shared by ${small} friends or by ${big} friends. Where is a share bigger?`, `shared by ${small}`, [`shared by ${big}`], "The more friends who share, the smaller each share is.", { type: "emoji", emoji: "🍕" });
  };
  const part = (): Question => {
    const den = pick([3, 4, 6] as const);
    const num = randInt(1, den - 1);
    const label = (n: number) => `${n}/${den}`;
    const wrong = others(range(1, den - 1), num, 2).map(label);
    return textChoice("What fraction of the shape is shaded?", label(num), wrong, "The bottom number says how many equal parts. The top number says how many are shaded.", { type: "fraction", numerator: num, denominator: den, shape: pick(["bar", "circle"] as const) });
  };
  return buildSet([share, share, share, equal, equal, compare, part, d === 1 ? compare : part]);
}

// ---------- Groups and sharing: the start of multiplying and dividing ----------

function groupsAndSharing(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const top = d === 1 ? 10 : 20;
  const groups = (): Question => {
    const g = randInt(2, 5);
    const each = randInt(2, Math.max(2, Math.floor(top / g)));
    const t = pick(THINGS);
    const q = numQ(`There are ${g} groups of ${each} ${t.emoji}. How many in all?`, g * each, "Count each group, or add the same number again and again.", { type: "array", rows: g, cols: each, emoji: t.emoji }, 30);
    q.speak = `There are ${g} groups of ${each} ${t.word}. How many in all?`;
    return q;
  };
  const repeated = (): Question => {
    const g = randInt(2, 5);
    const each = randInt(2, 6);
    return numQ(`${Array(g).fill(each).join(" + ")} = ?`, g * each, `This is ${g} groups of ${each}.`, undefined, 40);
  };
  const share = (): Question => {
    const sharers = pick([2, 3, 4, 5]);
    const each = randInt(2, Math.floor(12 / sharers) || 2);
    const t = pick(THINGS);
    const total = sharers * each;
    const q = numQ(`${total} ${t.emoji} are shared equally by ${sharers} friends. How many does each get?`, each, "Deal them out one at a time until none are left.", { type: "dots", count: total, emoji: t.emoji }, 12);
    q.speak = `${total} ${t.word} are shared equally by ${sharers} friends. How many does each get?`;
    return q;
  };
  const arrayQ = (): Question => {
    const r = randInt(2, 4);
    const c = randInt(3, 5);
    return numQ(`How many are there? Think of ${r} rows of ${c}.`, r * c, "Count one row, then count the same amount for every row.", { type: "array", rows: r, cols: c, emoji: "🟦" }, 24);
  };
  const halves = (): Question => {
    const unit = pick(["half", "fourth"] as const);
    const per = unit === "half" ? 2 : 4;
    const wholes = randInt(1, 3);
    return numQ(`${wholes * per} groups, and each group is one ${unit} of a pizza. How many whole pizzas is that?`, wholes, unit === "half" ? "Two halves make one whole." : "Four fourths make one whole.", { type: "emoji", emoji: "🍕" }, 6, 1);
  };
  const missingGroups = (): Question => {
    const each = randInt(2, 5);
    const g = randInt(2, 5);
    return numQ(`There are ${g * each} stickers. Each page holds ${each}. How many pages?`, g, "Think: how many groups of " + each + " make " + g * each + "?", { type: "emoji", emoji: "📒" }, 10);
  };
  return buildSet([groups, groups, repeated, share, share, arrayQ, d === 3 ? halves : missingGroups, d === 1 ? groups : pick([halves, missingGroups])]);
}

// ---------- Balance the equation ----------

function balance(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const top = d === 1 ? 20 : 100;
  const bothSides = (): Question => {
    const a = randInt(5, top / 2);
    const b = randInt(2, top / 2);
    const c = randInt(2, a + b - 1);
    return numQ("What number makes both sides equal?", a + b - c, `The left side is ${a + b}. What do you add to ${c} to get ${a + b}?`, eq(`${a} + ${b} = ${c} + ☐`), top * 2, 0);
  };
  const symbol = (): Question => {
    const sym = pick(["★", "♦", "●", "▲"]);
    const a = randInt(3, 12);
    const b = randInt(2, 12);
    return numQ(`In ${sym} + ${a} = ${a + b}, what number does ${sym} stand for?`, b, "A symbol can stand for a number we don't know yet. What goes with " + a + " to make " + (a + b) + "?", undefined, 30, 0);
  };
  const trueFalse = (): Question => {
    const a = randInt(5, 30);
    const b = randInt(2, 20);
    const c = randInt(2, a + b - 3);
    const isTrue = chance(0.5);
    const rhs = a + b - c + (isTrue ? 0 : pick([1, 2, 5]));
    return textChoice("Is this number sentence true or false?", isTrue ? "true" : "false", [isTrue ? "false" : "true"], "Work out both sides. They must be the same amount to be true.", eq(`${a} + ${b} = ${c} + ${rhs}`));
  };
  const equivalent = (): Question => {
    const total = randInt(10, top);
    const a = randInt(2, total - 2);
    const b = randInt(2, total - 2);
    const first = `${a} + ${total - a}`;
    const wrong = [`${b} + ${total - b + 1}`, `${a} + ${total - a - 1}`];
    return textChoice(`Which is equal to ${total}?`, first, wrong, "Add each choice. Only one makes " + total + ".");
  };
  const patternNum = (): Question => {
    const start = randInt(1, 20);
    const step = pick([2, 5, 10]);
    const seq = [0, 1, 2, 3].map((i) => start + step * i);
    return numQ(`Look at the pattern: ${seq.join(", ")}, ?. What number comes next?`, start + step * 4, `Each number is ${step} more than the last.`, undefined, 100, 0);
  };
  return buildSet([bothSides, bothSides, symbol, symbol, trueFalse, equivalent, patternNum, d === 1 ? symbol : bothSides]);
}

// ---------- Graphs and mode ----------

const TOPICS = [
  { title: "Our favourite lunch", cats: ["pizza", "pasta", "soup", "salad"] },
  { title: "Our favourite sport", cats: ["soccer", "hockey", "swimming", "tag"] },
  { title: "Our favourite colour", cats: ["red", "blue", "green", "purple"] },
  { title: "Our favourite animal", cats: ["dog", "cat", "bear", "owl"] },
];

function graphsAndMode(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const setup = () => {
    const t = pick(TOPICS);
    const counts = sample(range(2, 12), t.cats.length);
    return { title: t.title, bars: t.cats.map((label, i) => ({ label, value: counts[i] })) };
  };
  const read = (): Question => {
    const g = setup();
    const b = pick(g.bars);
    return numQ(`How many chose ${b.label}?`, b.value, "Follow the top of the bar across to the number.", { type: "bars", title: g.title, bars: g.bars }, 14);
  };
  const mode = (): Question => {
    const g = setup();
    const top = [...g.bars].sort((x, y) => y.value - x.value)[0];
    return textChoice("The mode is the choice picked most often. What is the mode?", top.label, others(g.bars.map((b) => b.label), top.label, 2), "Find the tallest bar. That is the mode.", { type: "bars", title: g.title, bars: g.bars });
  };
  const diff = (): Question => {
    const g = setup();
    const [a, b] = sample(g.bars, 2);
    const hi = a.value > b.value ? a : b;
    const lo = hi === a ? b : a;
    return numQ(`How many more chose ${hi.label} than ${lo.label}?`, hi.value - lo.value, "Subtract the smaller bar from the bigger bar.", { type: "bars", title: g.title, bars: g.bars }, 14);
  };
  const total = (): Question => {
    const g = setup();
    return numQ("How many children answered in all?", g.bars.reduce((s, b) => s + b.value, 0), "Add the numbers for all the bars.", { type: "bars", title: g.title, bars: g.bars }, 50);
  };
  const twoWay = (): Question => {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(2, 9);
    const dd = randInt(2, 9);
    const table: Visual = { type: "table", title: "Pets in our class", headers: ["", "Grade 2A", "Grade 2B"], rows: [["Dogs", a, c], ["Cats", b, dd]] };
    const which = pick([
      { q: "How many dogs are there in Grade 2A?", v: a },
      { q: "How many cats are there in Grade 2B?", v: dd },
      { q: "How many dogs are there in both classes?", v: a + c },
      { q: "How many pets are in Grade 2A?", v: a + b },
    ]);
    return numQ(which.q, which.v, "Find the row for the pet and the column for the class.", table, 40);
  };
  const sortQ = (): SortQuestion => {
    const sets = [
      { prompt: "Sort the animals by how many legs they have.", bins: [{ id: "two", label: "2 legs", emoji: "2️⃣" }, { id: "four", label: "4 legs", emoji: "4️⃣" }], items: [["bird", "🐦", "two"], ["duck", "🦆", "two"], ["chicken", "🐔", "two"], ["penguin", "🐧", "two"], ["dog", "🐶", "four"], ["cow", "🐮", "four"], ["pig", "🐷", "four"], ["horse", "🐴", "four"]] },
      { prompt: "Sort the foods by where they grow.", bins: [{ id: "tree", label: "Trees", emoji: "🌳" }, { id: "ground", label: "Ground", emoji: "🌱" }], items: [["apple", "🍎", "tree"], ["pear", "🍐", "tree"], ["orange", "🍊", "tree"], ["cherry", "🍒", "tree"], ["carrot", "🥕", "ground"], ["potato", "🥔", "ground"], ["corn", "🌽", "ground"], ["lettuce", "🥬", "ground"]] },
    ];
    const set = pick(sets);
    const items = set.bins.flatMap((b) => sample(set.items.filter((i) => i[2] === b.id), 2));
    return { kind: "sort", prompt: set.prompt, hint: "Look at each one and decide which basket it belongs in.", bins: set.bins, items: shuffle(items).map((it, i) => ({ id: `s${i}`, label: it[0], emoji: it[1], bin: it[2] })) };
  };
  return buildSet([read, read, mode, mode, diff, total, d === 1 ? read : twoWay, d === 3 ? sortQ : pick([twoWay, sortQ])]);
}

// ---------- Chance: complementary events ----------

const PAIRS = [
  { a: "Winter follows fall.", b: "Winter does not follow fall.", ans: ["certain", "impossible"] },
  { a: "A dog will bark tomorrow.", b: "No dog will bark tomorrow.", ans: ["possible", "possible"] },
  { a: "A cat will fly to the moon.", b: "A cat will not fly to the moon.", ans: ["impossible", "certain"] },
  { a: "You will have lunch today.", b: "You will not have lunch today.", ans: ["possible", "possible"] },
  { a: "A square has four sides.", b: "A square does not have four sides.", ans: ["certain", "impossible"] },
  { a: "It will snow in July in Ontario.", b: "It will not snow in July in Ontario.", ans: ["impossible", "certain"] },
];

function chanceTwo(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const word = (): Question => {
    const p = pick(PAIRS);
    const first = chance(0.5);
    const text = first ? p.a : p.b;
    const ans = first ? p.ans[0] : p.ans[1];
    return { kind: "choice", prompt: text, hint: { impossible: "Impossible means it can never happen.", possible: "Possible means it might or might not happen.", certain: "Certain means it will always happen." }[ans]!, answer: ans, choices: shuffle(["impossible", "possible", "certain"]).map((id) => ({ id, label: id })) };
  };
  const complement = (): Question => {
    const p = pick(PAIRS.filter((x) => x.ans[0] !== "possible"));
    return textChoice(`It is ${p.ans[0]} that: “${p.a}” How likely is the opposite: “${p.b}”`, p.ans[1], others(["impossible", "possible", "certain"], p.ans[1], 2), "If one thing is certain, its opposite is impossible. If one is impossible, its opposite is certain.");
  };
  const spinner = (): Question => {
    const colours = [{ n: "red", h: "#ef4444", e: "🔴" }, { n: "blue", h: "#3b82f6", e: "🔵" }, { n: "green", h: "#22c55e", e: "🟢" }];
    const [m, o1, o2] = sample(colours, 3);
    const count = randInt(4, 6);
    const segments = shuffle([...Array(count).fill(m.h), o1.h, o2.h]);
    return textChoice("Which colour will the spinner most likely land on?", { label: m.n, emoji: m.e }, [o1, o2].map((c) => ({ label: c.n, emoji: c.e })), "The colour with the most space is the most likely.", { type: "spinner", segments });
  };
  const predict = (): Question => {
    const red = randInt(6, 8);
    const blue = 10 - red;
    return textChoice(`In 10 picks, ${red} were red and ${blue} were blue. Which colour is the next pick most likely?`, "red", ["blue"], "The colour picked more often so far is more likely next time.", { type: "emojiRow", items: [...Array(red).fill("🔴"), ...Array(blue).fill("🔵")].slice(0, 10) });
  };
  return buildSet([word, word, word, complement, spinner, spinner, predict, d === 1 ? word : complement]);
}

// ---------- Shapes and symmetry ----------

const SHAPES: { shape: ShapeName; name: string; sides: number; lines: number }[] = [
  { shape: "square", name: "square", sides: 4, lines: 4 },
  { shape: "rectangle", name: "rectangle", sides: 4, lines: 2 },
  { shape: "pentagon", name: "pentagon", sides: 5, lines: 5 },
  { shape: "hexagon", name: "hexagon", sides: 6, lines: 6 },
  { shape: "octagon", name: "octagon", sides: 8, lines: 8 },
  { shape: "rhombus", name: "rhombus", sides: 4, lines: 2 },
  { shape: "parallelogram", name: "parallelogram", sides: 4, lines: 0 },
];

function shapesAndSymmetry(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const sides = (): Question => {
    const s = pick(SHAPES);
    return numQ("How many sides does this shape have?", s.sides, "Touch each straight side as you count.", { type: "shape", shape: s.shape }, 10, 2);
  };
  const lines = (): Question => {
    const s = pick(SHAPES.filter((x) => x.lines > 0 && x.lines <= 8 && (d > 1 || x.lines <= 4)));
    return numQ("How many lines of symmetry does this shape have?", s.lines, "A line of symmetry cuts a shape into two halves that match exactly when folded.", { type: "shape", shape: s.shape }, 9, 0);
  };
  const name = (): Question => {
    const s = pick(SHAPES);
    return textChoice("What is this shape called?", s.name, others(SHAPES.map((x) => x.name), s.name, 3).slice(0, d === 1 ? 2 : 3), `This shape has ${s.sides} sides.`, { type: "shape", shape: s.shape });
  };
  const noSym = (): Question => textChoice("Which shape has no lines of symmetry?", "parallelogram", ["square", "rectangle"], "A slanted parallelogram doesn't fold into two matching halves.", undefined);
  const congruent = (): Question =>
    pick<() => Question>([
      () => textChoice("Two squares each have sides of 5 cm. Are they congruent?", "yes", ["no"], "Congruent shapes match exactly: same size and same shape.", { type: "emoji", emoji: "🟦🟦" }),
      () => textChoice("A square with sides of 3 cm and a square with sides of 6 cm. Are they congruent?", "no", ["yes"], "Congruent shapes have to be exactly the same size.", { type: "emoji", emoji: "🟨" }),
      () => textChoice("You trace a rectangle and cut out the tracing. Is the tracing congruent to the rectangle?", "yes", ["no"], "It matches exactly, so it is congruent.", { type: "emoji", emoji: "✂️" }),
      () => textChoice("A rectangle that is 2 cm by 6 cm and a rectangle that is 3 cm by 4 cm. Are they congruent?", "no", ["yes"], "The sides don't match, so the shapes are not congruent.", { type: "emoji", emoji: "▭" }),
    ])();
  const regroup = (): Question =>
    pick<() => Question>([
      () => textChoice("You cut a rectangle into two pieces and slide them into a new shape. Does the area change?", "no, it stays the same", ["yes, it gets bigger"], "The same pieces cover the same space, even in a new arrangement.", { type: "emoji", emoji: "✂️" }),
      () => textChoice("Two triangles of the same size can fit together to make which shape?", "a rectangle", ["a circle", "a hexagon"], "Two matching right triangles can make a rectangle.", { type: "emoji", emoji: "📐" }),
      () => textChoice("A square is cut along a diagonal. What two shapes do you get?", "two triangles", ["two circles", "two squares"], "A diagonal goes from one corner to the opposite corner.", { type: "emoji", emoji: "🟦" }),
    ])();
  const angles = (): Question => {
    const s = pick(SHAPES.filter((x) => x.shape === "square" || x.shape === "rectangle"));
    return numQ(`How many square corners (right angles) does a ${s.name} have?`, 4, "Squares and rectangles have 4 corners that look like the corner of a book.", { type: "shape", shape: s.shape }, 8, 0);
  };
  return buildSet([sides, sides, lines, lines, name, congruent, regroup, d === 1 ? noSym : pick([angles, noSym])]);
}

// ---------- Simple maps ----------

function simpleMaps(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const PLACES = [
    { letter: "S", name: "school" },
    { letter: "P", name: "park" },
    { letter: "L", name: "library" },
    { letter: "H", name: "home" },
    { letter: "M", name: "market" },
  ];
  type Layout = { letter: string; name: string; x: number; y: number }[];
  /** Four places at different columns and rows, so "farthest left" and "farthest up" have one answer. */
  const layout = (near?: boolean): Layout => {
    for (let tries = 0; tries < 200; tries++) {
      const xs = sample(range(0, 4), 4);
      const ys = sample(range(0, 4), 4);
      const places = sample(PLACES, 4).map((p, i) => ({ ...p, x: xs[i], y: ys[i] }));
      const dx = Math.abs(places[1].x - places[0].x);
      const dy = Math.abs(places[1].y - places[0].y);
      if (!near || (dx + dy <= (d === 1 ? 3 : 5) && dx + dy >= 2)) return places;
    }
    return sample(PLACES, 4).map((p, i) => ({ ...p, x: i, y: i }));
  };
  const visual = (ps: Layout): Visual => ({ type: "grid", size: 5, points: ps.map((p) => ({ x: p.x, y: p.y, label: p.letter })) });
  const legend = (ps: Layout) => ps.map((p) => `${p.letter} is the ${p.name}`).join(", ");
  const go = (): Question => {
    const ps = layout(true);
    const [a, target] = ps;
    const dx = target.x - a.x;
    const dy = target.y - a.y;
    const dir = [dx ? `${Math.abs(dx)} ${dx > 0 ? "right" : "left"}` : "", dy ? `${Math.abs(dy)} ${dy > 0 ? "up" : "down"}` : ""].filter(Boolean).join(" and ");
    return textChoice(`${legend(ps)}. Start at the ${a.name}. Go ${dir}. Where do you stop?`, target.name, ps.slice(2).map((p) => p.name), "Move one square at a time along the grid lines.", visual(ps));
  };
  const leftQ = (): Question => {
    const ps = layout();
    const sorted = [...ps].sort((p, q) => p.x - q.x);
    return textChoice(`${legend(ps)}. Which place is farthest to the left?`, sorted[0].name, sorted.slice(1, 3).map((p) => p.name), "On a map, left is toward the left edge.", visual(ps));
  };
  const higher = (): Question => {
    const ps = layout();
    const top = [...ps].sort((p, q) => q.y - p.y)[0];
    return textChoice(`${legend(ps)}. Which place is farthest up (north)?`, top.name, others(ps.map((p) => p.name), top.name, 2), "Up on the map is toward the top.", visual(ps));
  };
  const direction = (): Question =>
    pick<() => Question>([
      () => textChoice("On a map, which way is the top of the map?", "north", ["south", "east"], "Maps usually have north at the top.", { type: "emoji", emoji: "🗺️" }),
      () => textChoice("You face north. Which way is your right hand?", "east", ["west", "south"], "When you face north, east is on your right and west is on your left.", { type: "emoji", emoji: "🧭" }),
      () => textChoice("Which direction is opposite of north?", "south", ["east", "west"], "North and south are opposites.", { type: "emoji", emoji: "🧭" }),
    ])();
  return buildSet([go, go, go, leftQ, higher, direction, direction, d === 1 ? leftQ : go]);
}

// ---------- How long does it take? ----------

function howLong(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const unitFor = (): Question => {
    const items = [
      { act: "blink your eyes", unit: "seconds" },
      { act: "tie your shoe", unit: "seconds" },
      { act: "eat a snack", unit: "minutes" },
      { act: "brush your teeth", unit: "minutes" },
      { act: "walk to school", unit: "minutes" },
      { act: "watch a movie", unit: "hours" },
      { act: "sleep at night", unit: "hours" },
      { act: "play at the park all afternoon", unit: "hours" },
    ];
    const it = pick(items);
    return textChoice(`Which unit is best to measure how long it takes to ${it.act}?`, it.unit, others(["seconds", "minutes", "hours"], it.unit, 2), "Seconds are very short. Minutes are longer. Hours are longest.");
  };
  const longer = (): Question => {
    const pairs = [["a minute", "an hour"], ["a second", "a minute"], ["an hour", "a second"], ["a minute", "a second"]];
    const [a, b] = pick(pairs);
    const order = ["a second", "a minute", "an hour"];
    const longerOne = order.indexOf(a) > order.indexOf(b) ? a : b;
    const shorter = longerOne === a ? b : a;
    return textChoice(`Which is longer: ${a} or ${b}?`, longerOne, [shorter], "There are 60 seconds in a minute and 60 minutes in an hour.");
  };
  const facts = (): Question =>
    pick<() => Question>([
      () => numQ("How many seconds are in one minute?", 60, "One minute is 60 seconds.", undefined, 100, 0),
      () => numQ("How many minutes are in one hour?", 60, "One hour is 60 minutes.", undefined, 100, 0),
      () => numQ("How many minutes are in half an hour?", 30, "Half of 60 is 30.", undefined, 100, 0),
      () => numQ("How many hours are in one day?", 24, "A day is 24 hours.", undefined, 40, 0),
    ])();
  const nonStandard = (): Question => {
    const a = randInt(8, 14);
    const b = a + randInt(3, 6);
    const aFirst = chance(0.5);
    return textChoice(`Song A takes ${aFirst ? a : b} claps of time. Song B takes ${aFirst ? b : a} claps. Which song is shorter?`, aFirst ? "Song A" : "Song B", [aFirst ? "Song B" : "Song A"], "Fewer claps of time means less time.", { type: "emoji", emoji: "👏" });
  };
  const timeline = (): OrderQuestion => {
    const sets = [
      { items: ["wake up", "eat breakfast", "go to school", "eat dinner", "go to bed"] },
      { items: ["plant a seed", "water it", "a sprout grows", "a flower blooms"] },
    ];
    const s = pick(sets);
    return { kind: "order", prompt: "Tap these in the order they happen.", hint: "Think about what happens first, next and last.", items: s.items.map((label, i) => ({ id: `t${i}`, label })) };
  };
  return buildSet([unitFor, unitFor, unitFor, longer, longer, facts, d === 1 ? nonStandard : facts, d === 3 ? facts : pick([nonStandard, timeline])]);
}

// ---------- Money to $200 ----------

function moneyTo200(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const dollars = (c: number) => (c % 100 === 0 ? `$${c / 100}` : `$${(c / 100).toFixed(2)}`);
  const value = (c: number) => (c < 100 ? `${c}¢` : dollars(c));
  const count = (): Question => {
    const coinSet = d === 1 ? [5, 10, 25] : [5, 10, 25, 100, 200];
    const picks = sample(coinSet, randInt(2, 3)).concat(chance(0.5) ? [pick(coinSet)] : []);
    const total = picks.reduce((s, c) => s + c, 0);
    const wrong = [total + 5, total + 10, Math.max(5, total - 10), total + 25].filter((w) => w !== total);
    return textChoice("How much money is this?", value(total), sample([...new Set(wrong)], 2).map(value), "Start with the biggest coin and count on.", { type: "coins", coins: picks });
  };
  const make = (): CoinsQuestion => {
    const target = d === 1 ? pick([35, 45, 60, 85, 100, 120]) : pick([115, 140, 165, 180, 195, 240].filter((x) => x <= 200));
    return { kind: "coins", prompt: `Show ${value(target)} with coins.`, hint: "Use the biggest coins first, then smaller ones to fill the rest.", target, coins: [5, 10, 25, 100, 200] };
  };
  const same = (): Question => {
    const options = [
      { q: "Which is worth the same as a toonie?", right: "2 loonies", wrong: ["3 quarters", "1 loonie and 1 dime"], hint: "A loonie is $1. Two loonies make $2." },
      { q: "Which is worth the same as a loonie?", right: "4 quarters", wrong: ["3 quarters", "9 dimes"], hint: "A quarter is 25¢. Four quarters make 100¢, or $1." },
      { q: "Which is worth the same as a loonie?", right: "10 dimes", wrong: ["8 dimes", "5 nickels"], hint: "A dime is 10¢. Ten dimes make 100¢." },
      { q: "Which is worth the same as a $5 bill?", right: "5 loonies", wrong: ["4 loonies", "2 toonies"], hint: "A loonie is $1. Five loonies make $5." },
      { q: "Which is worth the same as a $10 bill?", right: "2 $5 bills", wrong: ["3 $5 bills", "4 toonies"], hint: "Two fives make ten." },
      { q: "Which is worth the same as a $20 bill?", right: "2 $10 bills", wrong: ["3 $5 bills", "4 $2 coins"], hint: "Two tens make twenty." },
    ];
    const o = pick(options);
    return textChoice(o.q, o.right, o.wrong, o.hint);
  };
  const bills = (): Question => {
    const b = pick([500, 1000, 2000, 5000, 10000]);
    const names: Record<number, string> = { 500: "$5 bill", 1000: "$10 bill", 2000: "$20 bill", 5000: "$50 bill", 10000: "$100 bill" };
    return textChoice("How much is this bill worth?", `$${b / 100}`, others([5, 10, 20, 50, 100], b / 100, 2).map((x) => `$${x}`), `The ${names[b]} is worth $${b / 100}.`, b === 10000 ? { type: "emoji", emoji: "💵", caption: "$100 bill" } : { type: "coins", coins: [b] });
  };
  const compare = (): Question => {
    const [a, b] = sample([25, 100, 200, 500, 1000, 2000], 2);
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    return textChoice("Which is worth more?", { label: COIN_NAMES[hi], coin: hi }, [{ label: COIN_NAMES[lo], coin: lo }], "Think about how many dollars or cents each one is worth.");
  };
  return buildSet([count, count, make, make, same, same, d === 1 ? compare : bills, compare]);
}

export const units: Unit[] = [
  {
    id: "numbers-to-200",
    title: "Numbers to 200",
    emoji: "🔢",
    blurb: "Hundreds, tens and ones",
    standards: on("B1.1–B1.5", "reading, composing, comparing and counting whole numbers up to 200, and even and odd"),
    parentNote: "Place value to 200, counting by 20s, 25s and 50s, comparing and ordering numbers, and knowing what makes a number even or odd.",
    generate: numbersTo200,
  },
  {
    id: "sharing-fairly",
    title: "Fair Shares",
    emoji: "🍕",
    blurb: "Halves, thirds, fourths and sixths",
    standards: on("B1.6, B1.7", "sharing up to 10 items fairly, and equal fractions such as one third and two sixths"),
    parentNote: "Sharing items fairly among 2, 3, 4 or 6 people, including leftovers cut into halves, thirds and fourths, and seeing that different fractions can be equal.",
    generate: sharingFairly,
  },
  {
    id: "groups-and-sharing",
    title: "Groups & Sharing",
    emoji: "🧺",
    blurb: "Equal groups and equal shares",
    standards: on("B2.1, B2.5, B2.6", "multiplication as equal groups and division as equal sharing"),
    parentNote: "Seeing multiplication as repeated equal groups and division as sharing equally, with arrays, pictures and short stories.",
    generate: groupsAndSharing,
  },
  {
    id: "balance-the-equation",
    title: "Balance It",
    emoji: "⚖️",
    blurb: "Make both sides equal",
    standards: on("C1.4, C2.1–C2.3", "symbols as unknown numbers, equal expressions and number patterns"),
    parentNote: "Finding the unknown number that makes both sides of an equation equal, using symbols for unknowns, and spotting number patterns.",
    generate: balance,
  },
  {
    id: "graphs-and-mode",
    title: "Graphs & Mode",
    emoji: "📊",
    blurb: "Read bar graphs and tables",
    standards: on("D1.1–D1.5", "sorting data, reading bar graphs and two-way tables, and finding the mode"),
    parentNote: "Sorting by two features, reading bar graphs and two-way tables, and finding the mode (the most common choice).",
    generate: graphsAndMode,
  },
  {
    id: "chance-2",
    title: "Chance & Opposites",
    emoji: "🎲",
    blurb: "Impossible, possible, certain",
    standards: on("D2.1, D2.2", "likelihood of events and their opposites, and making predictions"),
    parentNote: "Describing how likely an event is, and how its opposite compares, and using results so far to predict what is likely next.",
    generate: chanceTwo,
  },
  {
    id: "shapes-and-symmetry",
    title: "Shapes & Symmetry",
    emoji: "🔷",
    blurb: "Sides, symmetry and congruent shapes",
    standards: on("E1.1–E1.3", "sorting 2D shapes by sides and symmetry, putting shapes together, and congruent shapes"),
    parentNote: "Counting sides and right angles, finding lines of symmetry, putting shapes together and apart, and knowing when two shapes match exactly.",
    generate: shapesAndSymmetry,
  },
  {
    id: "simple-maps",
    title: "Simple Maps",
    emoji: "🗺️",
    blurb: "Read and follow a map",
    standards: on("E1.4, E1.5", "reading simple maps and describing positions and movements"),
    parentNote: "Reading a map of a familiar place, saying where things are, and describing the moves from one place to another.",
    generate: simpleMaps,
  },
  {
    id: "how-long",
    title: "How Long?",
    emoji: "⏱️",
    blurb: "Seconds, minutes and hours",
    standards: on("E2.4", "units of time to describe how long things take"),
    parentNote: "Choosing seconds, minutes or hours for different events, comparing units of time and knowing how they connect.",
    generate: howLong,
  },
  {
    id: "money-to-200",
    title: "Money to $200",
    emoji: "💵",
    blurb: "Coins and bills",
    standards: on("F1.1", "different ways to make the same amount, up to 200¢ and up to $200"),
    parentNote: "Counting coins and bills, making the same amount in different ways, and knowing which coins and bills are worth more.",
    generate: moneyTo200,
  },
];
