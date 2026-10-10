import { pick, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { bankUnit, hq, q, type Item } from "../ontario/g3-4-kit";
import { ab, buildSet, levelOf, numQ, others, range, spaced, times, typeIn } from "./kit";

// Alberta Grade 3 mathematics (2022 K–6 curriculum). The units below cover outcomes the BC and Ontario
// Grade 3 units do not: whole numbers to 100 000, polygons and right angles, comparing angles, moves of
// shapes, length with perimeter, and statistics with dot plots. Addition and subtraction, multiplication
// and division, fractions, patterns and equations, and time are shared from existing units.

// ---------- Numbers to 100 000 ----------

const ONES_WORDS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function below100(n: number): string {
  if (n < 20) return ONES_WORDS[n];
  const t = TENS_WORDS[Math.floor(n / 10)];
  return n % 10 === 0 ? t : `${t}-${ONES_WORDS[n % 10]}`;
}

function below1000(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h === 0) return below100(r);
  return r === 0 ? `${ONES_WORDS[h]} hundred` : `${ONES_WORDS[h]} hundred ${below100(r)}`;
}

/** Words for a whole number below 100 000, such as "forty-two thousand, three hundred five". */
function words(n: number): string {
  const th = Math.floor(n / 1000);
  const r = n % 1000;
  if (th === 0) return below1000(r);
  return r === 0 ? `${below1000(th)} thousand` : `${below1000(th)} thousand, ${below1000(r)}`;
}

const PLACES = ["ones", "tens", "hundreds", "thousands", "ten thousands"];

/** A number with all different digits, so "the value of the 7" has one answer. */
function distinctNumber(digits: number): number {
  const first = randInt(1, 9);
  const rest = sample(range(0, 9).filter((x) => x !== first), digits - 1);
  return Number([first, ...rest].join(""));
}

function numbers100000(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const digits = d === 1 ? 4 : 5;
  const value = (): Question => {
    const n = distinctNumber(digits);
    const s = String(n);
    const pos = randInt(0, digits - 1);
    const digit = Number(s[pos]);
    const place = digits - 1 - pos;
    const right = digit * 10 ** place;
    const wrongPlaces = shuffle(range(0, digits - 1).filter((p) => p !== place));
    const wrong = wrongPlaces.slice(0, 3).map((p) => spaced(digit * 10 ** p));
    if (digit === 0) return value();
    return textChoice(`In ${spaced(n)}, what is the value of the digit ${digit}?`, spaced(right), wrong, "Look at which place the digit is in. A 7 in the thousands place is worth 7 000.");
  };
  const placeName = (): Question => {
    const n = distinctNumber(digits);
    const s = String(n);
    const place = randInt(0, digits - 1);
    const digit = s[digits - 1 - place];
    const wrong = s.split("").filter((c) => c !== digit).slice(0, 3);
    return textChoice(`In ${spaced(n)}, which digit is in the ${PLACES[place]} place?`, digit, wrong, "Count places from the right: ones, tens, hundreds, thousands, ten thousands.");
  };
  const expanded = (): Question => {
    const n = distinctNumber(digits);
    const s = String(n);
    const parts = s.split("").map((c, i) => Number(c) * 10 ** (digits - 1 - i)).filter((p) => p > 0);
    const text = parts.map(spaced).join(" + ");
    const swap = (k: number) => {
      const a = s.split("");
      const i = randInt(0, digits - 2);
      [a[i], a[i + 1]] = [a[i + 1], a[i]];
      return k >= 0 ? Number(a.join("")) : n;
    };
    const wrongs = new Set<number>();
    for (let t = 0; t < 30 && wrongs.size < 3; t++) {
      const w = swap(1);
      if (w !== n && String(w).length === digits) wrongs.add(w);
    }
    return textChoice(`Which number is ${text}?`, spaced(n), [...wrongs].map(spaced), "Add up the parts. Each part tells the value of one digit.");
  };
  const compare = (): Question => {
    const a = distinctNumber(digits);
    const s = String(a).split("");
    const i = randInt(1, digits - 1);
    const t = s.slice();
    t[i] = String((Number(t[i]) + randInt(1, 8)) % 10);
    let b = Number(t.join(""));
    if (b === a) b = a + 10 ** (digits - 1 - i);
    const right = a > b ? ">" : "<";
    return textChoice(`Which sign makes this true? ${spaced(a)} ○ ${spaced(b)}`, right, [a > b ? "<" : ">", "="], "Compare the digits from the left. The first place that is different decides.");
  };
  const order5 = (): Question => {
    const nums = sample(range(digits === 4 ? 1000 : 10000, digits === 4 ? 9999 : 99999), 4).sort((x, y) => x - y);
    return { kind: "order", prompt: "Tap the numbers from smallest to biggest.", hint: "Compare the left-most digits first.", items: nums.map((n) => ({ id: String(n), label: spaced(n) })) };
  };
  const named = (): Question => {
    const n = distinctNumber(5);
    const th = Math.floor(n / 1000);
    const rest = n % 1000;
    const wrongs = [th * 100 + rest, (th + 1) * 1000 + rest, th * 1000 + Math.floor(rest / 10) * 10 + ((rest + 1) % 10)].filter((w) => w !== n && w >= 10000);
    const set = [...new Set(wrongs)].map(spaced).slice(0, 3);
    return textChoice(`Which is the numeral for ${words(n)}?`, spaced(n), set, "Say the thousands part first, then the rest.");
  };
  const moreLess = (): Question => {
    const n = randInt(11, 89) * 1000 + randInt(0, 9) * 100 + randInt(1, 9) * 10 + randInt(1, 9);
    const step = pick([10, 100, 1000, 10000]);
    const more = step === 10000 ? n < 80000 : true;
    const ans = more ? n + step : n - step;
    return typeIn(`What is ${spaced(step)} ${more ? "more" : "less"} than ${spaced(n)}?`, ans, `Only one digit changes. Add or take away ${spaced(step)}.`);
  };
  const blocksWords = (): Question => {
    const n = randInt(2, 9) * 1000 + randInt(1, 9) * 100 + randInt(1, 9) * 10 + randInt(1, 9);
    return textChoice(`How do you say ${spaced(n)}?`, words(n), others([words(n + 100), words(n - 1000 >= 1000 ? n - 1000 : n + 1000), words(n + 10)], words(n), 3), "Read the thousands, then the hundreds, tens and ones.");
  };
  const dollar = (): Question => {
    const n = randInt(11, 89) * 1000 + randInt(0, 9) * 100;
    const right = Math.floor(n / 10000);
    return textChoice(`A car costs $${spaced(n)}. Which digit is in the ten thousands place?`, String(right), sample(range(0, 9).filter((x) => x !== right), 3).map(String), "The ten thousands place is the fifth place from the right.");
  };
  const makers = [value, value, placeName, expanded, compare, order5, d === 1 ? blocksWords : named, d === 3 ? moreLess : d === 2 ? blocksWords : moreLess];
  if (d === 3) makers[2] = dollar;
  return buildSet(makers);
}

// ---------- Polygons, parallel and perpendicular lines ----------

const POLY_SORT = {
  prompt: "Does the shape have exactly four sides? Tap a shape, then tap its basket.",
  hint: "A quadrilateral has 4 straight sides. Triangles have 3, pentagons 5, hexagons 6 and octagons 8.",
  bins: [
    { id: "four", label: "4 sides", emoji: "⬜" },
    { id: "other", label: "not 4 sides", emoji: "🔺" },
  ],
  items: [
    { label: "square", emoji: "⬜", bin: "four" },
    { label: "rectangle", emoji: "▭", bin: "four" },
    { label: "rhombus", emoji: "◆", bin: "four" },
    { label: "trapezoid", emoji: "⏢", bin: "four" },
    { label: "triangle", emoji: "🔺", bin: "other" },
    { label: "pentagon", emoji: "⬟", bin: "other" },
    { label: "hexagon", emoji: "⬢", bin: "other" },
    { label: "octagon", emoji: "🛑", bin: "other" },
  ],
};

const POLYGONS: Item[] = [
  q("How many sides does a hexagon have?", "6", ["5", "8", "4"], "Hex means six.", undefined, { type: "shape", shape: "hexagon" }),
  q("How many sides does an octagon have?", "8", ["6", "10", "7"], "Think of a stop sign. It has 8 straight sides.", undefined, { type: "shape", shape: "octagon" }),
  q("How many sides does a pentagon have?", "5", ["6", "4", "8"], "Penta means five.", undefined, { type: "shape", shape: "pentagon" }),
  q("A polygon with 3 sides is called a…", "triangle", ["quadrilateral", "pentagon", "hexagon"], "Tri means three.", undefined, { type: "shape", shape: "triangle" }),
  q("A polygon with 4 sides is called a…", "quadrilateral", ["triangle", "pentagon", "octagon"], "Quad means four.", undefined, { type: "shape", shape: "rectangle" }),
  q("Which of these is NOT a polygon?", "a circle", ["a triangle", "a square", "a hexagon"], "A polygon is a closed shape made only of straight sides. A circle is curved.", undefined, { type: "shape", shape: "circle" }),
  q("Which is a quadrilateral?", "a rectangle", ["a triangle", "an octagon", "a pentagon"], "Count the sides. A quadrilateral has 4.", undefined, { type: "shape", shape: "rectangle" }),
  q("A regular polygon has…", "all sides equal and all angles equal", ["no straight sides", "only 3 sides", "one long side"], "In a regular polygon, every side and every angle match.", "🔷"),
  q("A stop sign is a regular octagon. Why?", "all 8 sides and all 8 angles are equal", ["it has only 4 sides", "it is curved", "its sides are different lengths"], "A regular polygon has equal sides and equal angles.", "🛑", { type: "shape", shape: "octagon" }),
  q("Two lines that always stay the same distance apart and never meet are…", "parallel", ["perpendicular", "curved", "equal"], "Think of railway tracks.", "🚂"),
  q("Two lines that meet to make a right angle (a square corner) are…", "perpendicular", ["parallel", "regular", "irregular"], "Think of the corner of a page.", "📐"),
  q("The top and bottom of a rectangle are…", "parallel", ["perpendicular", "irregular", "curved"], "They never meet, no matter how far they go.", undefined, { type: "shape", shape: "rectangle" }),
  q("The top side and the left side of a rectangle are…", "perpendicular", ["parallel", "curved", "equal in length"], "They meet at a square corner.", undefined, { type: "shape", shape: "rectangle" }),
  q("How many right angles does a square have?", "4", ["2", "0", "3"], "Every corner of a square is a square corner.", undefined, { type: "shape", shape: "square" }),
  q("How many right angles does a rectangle have?", "4", ["2", "1", "0"], "All four corners are square corners.", undefined, { type: "shape", shape: "rectangle" }),
  hq("How many pairs of parallel sides does a rectangle have?", "2", ["1", "4", "0"], "Top and bottom are one pair. Left and right are another.", undefined, { type: "shape", shape: "rectangle" }),
  hq("Which quadrilateral has exactly one pair of parallel sides?", "a trapezoid", ["a square", "a rectangle", "a rhombus"], "A trapezoid has just one pair.", undefined, { type: "shape", shape: "trapezoid" }),
  hq("A triangle has no right angles and sides of different lengths. Is it regular?", "No, a regular triangle has equal sides and angles", ["Yes, every triangle is regular", "Yes, because it has 3 sides", "No, because triangles are not polygons"], "Regular means all sides and angles are equal.", "🔺"),
  hq("Which shape is a regular polygon?", "a square", ["a rectangle that is not a square", "a trapezoid", "a long thin triangle"], "A square has 4 equal sides and 4 equal angles.", undefined, { type: "shape", shape: "square" }),
  hq("Which is an irregular polygon?", "a rectangle that is not a square", ["a square", "a stop sign", "an equilateral triangle"], "A rectangle's sides are not all equal.", undefined, { type: "shape", shape: "rectangle" }),
  hq("Where might you see perpendicular lines?", "where a wall meets the floor", ["on the rails of a train track", "on the two edges of a straight road", "on two lanes of a highway"], "Perpendicular lines meet at a square corner. The others are parallel.", "🏠"),
];

// ---------- Angles ----------

function angleSet(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const classify = (): Question => {
    const deg = pick(d === 1 ? [45, 90, 135] : [30, 45, 60, 90, 120, 135, 150]);
    const right = deg < 90 ? "smaller than a right angle" : deg === 90 ? "the same as a right angle" : "bigger than a right angle";
    const all = ["smaller than a right angle", "the same as a right angle", "bigger than a right angle"];
    return textChoice("Look at the angle. Compare it with a right angle (a square corner).", right, all.filter((a) => a !== right), "A right angle is a square corner. Smaller angles are narrower. Bigger angles are wider.", { type: "angle", degrees: deg });
  };
  const rightCount = (): Question => {
    const shapes: [string, number, string][] = [["square", 4, "square"], ["rectangle", 4, "rectangle"], ["triangle", 0, "triangle"]];
    const [name, n, shape] = pick(shapes);
    return textChoice(`How many of this shape's corners are right angles? (A ${name} is shown.)`, String(n === 0 ? 0 : n), others(["0", "1", "2", "3", "4"], String(n), 3), name === "triangle" ? "This triangle has no square corners." : "Every corner is a square corner.", { type: "shape", shape: shape as never });
  };
  return buildSet([...times(5, classify), rightCount, ...times(2, () => pick(ANGLE_BANK_FN)())]);
}

const ANGLE_BANK: Item[] = [
  q("An angle is made where two lines or sides…", "meet at a point", ["are parallel", "never touch", "are curved"], "The point where they meet is the corner of the angle.", "📐"),
  q("Which is the best tool to check for a right angle?", "the corner of a sheet of paper", ["a cup", "a ball", "a string"], "Paper corners are right angles, so you can lay one against an angle.", "📄"),
  q("The corner of a book is a…", "right angle", ["wide angle", "narrow angle", "curved angle"], "It is a square corner.", "📖"),
  q("Which is wider: a right angle or an angle that looks like a sharp point?", "the right angle", ["the sharp point", "they are the same", "you cannot tell"], "The sharper the point, the smaller the angle.", "📐"),
  q("The hands of a clock at 3 o'clock make a…", "right angle", ["straight line", "very small angle", "full circle"], "The hands point to 12 and 3, like a square corner.", "🕒"),
  q("An open door opens a little. Is the angle at the hinge bigger or smaller than a right angle?", "smaller", ["bigger", "the same"], "A door open a crack makes a narrow angle.", "🚪"),
  q("A folding chair is opened wide. Its back and seat make an angle that is…", "bigger than a right angle", ["smaller than a right angle", "exactly one point"], "Wide open means a bigger angle.", "🪑"),
  q("Two angles are drawn. The first is a narrow slice, the second is a wide opening. Which is larger?", "the wide opening", ["the narrow slice", "they are equal"], "The more the lines open up, the larger the angle.", "📐"),
  q("You can compare two angles by…", "tracing one and laying it over the other", ["counting their sides", "measuring their colour", "weighing them"], "If one fits inside the other, it is the smaller angle.", "✏️"),
  q("A triangle has 3 corners. Which describes its angles?", "3 angles", ["1 angle", "4 angles", "no angles"], "A polygon has as many angles as it has sides.", "🔺"),
  q("A square corner is also called…", "a right angle", ["a parallel angle", "a regular angle", "a flat angle"], "Square corners are right angles.", "📐"),
  q("The corner of a slice of pizza at the pointy tip is usually…", "smaller than a right angle", ["bigger than a right angle", "a right angle", "a straight line"], "A pointy tip is a narrow angle.", "🍕"),
  hq("The corner of a stop sign (a regular octagon) is…", "bigger than a right angle", ["smaller than a right angle", "exactly a right angle"], "It opens wider than a square corner.", "🛑", { type: "shape", shape: "octagon" }),
  hq("A rectangle's four angles are…", "all right angles", ["all smaller than a right angle", "all bigger than a right angle", "two right angles and two others"], "Every corner of a rectangle is square.", "▭", { type: "shape", shape: "rectangle" }),
];

const ANGLE_BANK_FN = ANGLE_BANK.slice(0, 11).map((b) => () => textChoice(b.prompt, b.right as string, b.wrong as string[], b.hint, b.emoji ? { type: "emoji", emoji: b.emoji } : undefined));

// ---------- Slides, flips and turns ----------

const MOVES: Item[] = [
  q("A shape slides across a table without turning. This move is a…", "translation", ["reflection", "rotation"], "A translation is a slide.", "➡️"),
  q("A shape is flipped over a line, like in a mirror. This move is a…", "reflection", ["translation", "rotation"], "A reflection is a flip.", "🪞"),
  q("A shape turns around a point, like a wheel. This move is a…", "rotation", ["translation", "reflection"], "A rotation is a turn.", "🔄"),
  q("A drawer slides open. Which move is it?", "translation", ["reflection", "rotation"], "It slides in a straight line.", "🗄️"),
  q("The hands of a clock move round. Which move is it?", "rotation", ["translation", "reflection"], "They turn around the middle of the clock.", "🕐"),
  q("Your face in a still lake looks the same but upside down. Which move is it?", "reflection", ["translation", "rotation"], "A mirror image is a reflection.", "🏞️"),
  q("A ferris wheel moves round and round. Which move is it?", "rotation", ["translation", "reflection"], "It turns around its centre.", "🎡"),
  q("A chair is pushed straight along the floor. Which move is it?", "translation", ["rotation", "reflection"], "Sliding in a line is a translation.", "🪑"),
  q("After a slide, flip or turn, the shape is…", "the same size and shape", ["bigger", "smaller", "a different shape"], "These moves do not stretch or shrink a shape.", "🔷"),
  q("A butterfly's left wing looks like its right wing flipped. This is like a…", "reflection", ["translation", "rotation"], "The two sides are mirror images.", "🦋"),
  q("A spinner on a game board goes round. Which move is it?", "rotation", ["translation", "reflection"], "It turns around a point.", "🎯"),
  q("A toy train moves along a straight track. Which move is it?", "translation", ["reflection", "rotation"], "It slides in a line.", "🚂"),
  hq("A letter “b” is flipped over a vertical line. Which letter does it look like?", "d", ["p", "q", "b"], "A flip left-to-right swaps b and d.", "🔤"),
  hq("A triangle is turned a quarter turn. Does it change size?", "No, it stays the same size", ["Yes, it gets bigger", "Yes, it gets smaller"], "Turning does not change the size.", "🔺"),
  hq("Which move could you do by tracing a shape and flipping the tracing paper over?", "reflection", ["translation", "rotation"], "Flipping the paper makes a mirror image.", "📄"),
  hq("A square slides to the right, then slides down. Which moves are these?", "two translations", ["a reflection and a rotation", "two rotations", "two reflections"], "Each slide is a translation.", "⬜"),
];

// ---------- Length and perimeter ----------

function lengthPerimeter(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const perimeterRect = (): Question => {
    const a = randInt(2, d === 1 ? 8 : 15);
    let b = randInt(2, d === 1 ? 8 : 15);
    if (b === a) b++;
    return typeIn(`A rectangle is ${a} cm long and ${b} cm wide. What is its perimeter in cm?`, 2 * (a + b), "Add all four sides: length + width + length + width.", undefined, { suffix: "cm" });
  };
  const perimeterTri = (): Question => {
    const a = randInt(3, 12);
    const b = randInt(3, 12);
    const c = randInt(Math.abs(a - b) + 1, a + b - 1);
    return typeIn(`A triangle has sides of ${a} cm, ${b} cm and ${c} cm. What is its perimeter in cm?`, a + b + c, "The perimeter is the distance around. Add all the sides.", undefined, { suffix: "cm" });
  };
  const missingSide = (): Question => {
    const a = randInt(3, 12);
    return typeIn(`A square garden has a perimeter of ${a * 4} m. How long is one side in m?`, a, "A square has 4 equal sides. Share the perimeter into 4 equal parts.", undefined, { suffix: "m" });
  };
  const convert = (): Question => {
    const m = randInt(2, 9);
    const cmToM = pick([true, false]);
    return cmToM
      ? typeIn(`${m} m is how many cm?`, m * 100, "1 m is 100 cm.", undefined, { suffix: "cm" })
      : numQ(`${m * 100} cm is how many m?`, m, "100 cm make 1 m.", undefined, 12, 1);
  };
  const dm = (): Question => {
    const n = randInt(2, 9);
    return typeIn(`${n} dm is how many cm?`, n * 10, "1 decimetre (dm) is 10 cm.", undefined, { suffix: "cm" });
  };
  const mm = (): Question => {
    const n = randInt(2, 9);
    return typeIn(`${n} cm is how many mm?`, n * 10, "1 cm is 10 mm.", undefined, { suffix: "mm" });
  };
  const unit = (): Question => {
    const items: [string, string, string[]][] = [
      ["the length of a classroom", "metres", ["millimetres", "kilograms"]],
      ["the width of a fingernail", "millimetres", ["metres", "kilometres"]],
      ["the length of a pencil", "centimetres", ["kilometres", "metres"]],
      ["the height of a door", "metres", ["millimetres", "litres"]],
      ["the thickness of a coin", "millimetres", ["metres", "centimetres"]],
      ["the length of your foot", "centimetres", ["millimetres", "metres"]],
    ];
    const [what, right, wrong] = pick(items);
    return textChoice(`Which unit is best for measuring ${what}?`, right, wrong, "Pick a unit that gives a number that is not too big and not too small.");
  };
  const ruler = (): Question => {
    const len = randInt(3, 12);
    const emoji = pick(["✏️", "🖍️", "🥕", "🪥"]);
    return numQ("How long is the object in cm?", len, "Line up the start with 0. Read the number at the other end.", { type: "ruler", length: len, emoji }, 14, 1);
  };
  const imperial = (): Question => {
    const feet = randInt(2, 6);
    return typeIn(`${feet} feet is how many inches?`, feet * 12, "1 foot is 12 inches.", undefined, { suffix: "in" });
  };
  const yards = (): Question => {
    const y = randInt(2, 5);
    return typeIn(`${y} yards is how many feet?`, y * 3, "1 yard is 3 feet.", undefined, { suffix: "ft" });
  };
  const benchmark = (): Question => {
    const items: [string, string, string[]][] = [
      ["the width of your hand", "about 8 cm", ["about 80 cm", "about 8 m"]],
      ["the height of a classroom door", "about 2 m", ["about 20 cm", "about 20 m"]],
      ["the length of a new pencil", "about 18 cm", ["about 180 cm", "about 2 m"]],
      ["the length of a school bus", "about 12 m", ["about 12 cm", "about 120 m"]],
      ["the width of a fingertip", "about 1 cm", ["about 10 cm", "about 1 m"]],
    ];
    const [what, right, wrong] = pick(items);
    return textChoice(`About how long is ${what}?`, right, wrong, "Use something you know as a measuring stick. A doorway is about 2 m tall.");
  };
  const set = d === 1 ? [perimeterRect, perimeterRect, perimeterTri, convert, unit, ruler, benchmark, mm] : [perimeterRect, perimeterTri, missingSide, convert, d === 2 ? dm : imperial, unit, benchmark, d === 2 ? ruler : yards];
  return buildSet(set);
}

// ---------- Data, dot plots and bar graphs ----------

const DATA_BANK: Item[] = [
  q("Which is a statistical question?", "How many pets does each student in our class have?", ["How old is my teacher?", "What is 6 + 6?", "What day is it today?"], "A statistical question can have different answers from different people.", "📊"),
  q("Which question would collect data from a classmate?", "What is your favourite sport?", ["How tall is the CN Tower?", "What is the capital of Alberta?", "How many days are in a week?"], "First-hand data comes from asking or measuring yourself.", "🗣️"),
  q("You ask 20 classmates their favourite fruit. This is…", "first-hand data", ["second-hand data", "a pattern", "a polygon"], "You collected it yourself.", "🍎"),
  q("You read how many people visited Elk Island National Park last year in a book. This is…", "second-hand data", ["first-hand data", "a guess", "a pattern"], "Someone else collected it.", "📚"),
  q("You count the cars that pass your school in 10 minutes. This is…", "first-hand data", ["second-hand data", "a bar graph", "a sign"], "You collected the data yourself.", "🚗"),
  q("Every title, label and scale on a bar graph helps readers…", "understand the graph", ["colour it in", "make it longer", "forget it"], "A title tells what the graph is about. Labels tell what each bar is.", "📈"),
  q("In a bar graph with one-to-one correspondence, each square or unit of a bar stands for…", "1 item", ["10 items", "100 items", "no items"], "One-to-one means 1 unit for 1 item.", "📊"),
  q("A dot plot shows data using…", "dots above a number line", ["bars with pictures", "a pie chart", "a map"], "Each dot stands for one piece of data.", "⚫"),
  q("In a dot plot, a tall stack of dots above 3 means…", "more people have 3", ["fewer people have 3", "3 is not allowed", "nobody has 3"], "More dots mean more of that answer.", "⚫"),
  q("Which graph would show favourite pizza toppings with a bar for each topping?", "a bar graph", ["a map", "a number line", "a clock"], "A bar graph compares groups.", "🍕"),
  q("Why do we put a title on a graph?", "to tell what the data is about", ["to make it longer", "so it cannot be read", "to hide the numbers"], "A title helps readers know what they are looking at.", "📝"),
  q("Which survey question is clear?", "Which is your favourite season?", ["Do you like stuff?", "Is it good?", "What?"], "A clear question has clear answers.", "🍂"),
];

function graphs(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const topics = [
    { title: "Favourite lunch", labels: ["Pasta", "Sandwich", "Soup", "Salad"], emoji: ["🍝", "🥪", "🍲", "🥗"] },
    { title: "How we get to school", labels: ["Walk", "Bus", "Car", "Bike"], emoji: ["🚶", "🚌", "🚗", "🚲"] },
    { title: "Favourite winter activity", labels: ["Skating", "Skiing", "Sledding", "Snowshoeing"], emoji: ["⛸️", "⛷️", "🛷", "🥾"] },
    { title: "Favourite animal", labels: ["Bison", "Moose", "Beaver", "Owl"], emoji: ["🦬", "🫎", "🦫", "🦉"] },
  ];
  const makeBars = () => {
    const t = pick(topics);
    const vals = sample(range(2, d === 1 ? 9 : 14), 4);
    return { t, bars: t.labels.map((label, i) => ({ label, value: vals[i], emoji: t.emoji[i] })) };
  };
  const read = (): Question => {
    const { t, bars } = makeBars();
    const b = pick(bars);
    return numQ(`How many students chose ${b.label}?`, b.value, "Find the bar for this choice and read its height.", { type: "bars", title: t.title, bars }, 16, 1);
  };
  const most = (): Question => {
    const { t, bars } = makeBars();
    const top = [...bars].sort((x, y) => y.value - x.value)[0];
    return textChoice("Which choice got the most votes?", top.label, bars.filter((b) => b !== top).map((b) => b.label).slice(0, 3), "The tallest bar is the most popular.", { type: "bars", title: t.title, bars });
  };
  const diff = (): Question => {
    const { t, bars } = makeBars();
    const [a, b] = sample(bars, 2);
    const hi = a.value > b.value ? a : b;
    const lo = hi === a ? b : a;
    return numQ(`How many more students chose ${hi.label} than ${lo.label}?`, hi.value - lo.value, "Take the shorter bar from the taller bar.", { type: "bars", title: t.title, bars }, 14, 1);
  };
  const total = (): Question => {
    const { t, bars } = makeBars();
    return numQ("How many students answered in all?", bars.reduce((s, b) => s + b.value, 0), "Add the numbers on all the bars.", { type: "bars", title: t.title, bars }, 60, 1);
  };
  const dot = (): Question => {
    const counts = sample(range(1, 7), 5);
    const labels = [0, 1, 2, 3, 4];
    const rows = labels.map((n, i) => [`${n} pets`, "●".repeat(counts[i])]);
    const k = randInt(0, 4);
    return numQ(`This dot plot shows how many pets each student has. Each dot is one student. How many students have ${labels[k]} pets?`, counts[k], "Count the dots next to the number of pets.", { type: "table", title: "Pets (each ● is one student)", headers: ["Pets", "Students"], rows }, 10, 1);
  };
  const dotMost = (): Question => {
    const counts = sample(range(1, 8), 5);
    const rows = [0, 1, 2, 3, 4].map((n, i) => [`${n} pets`, "●".repeat(counts[i])]);
    const topIdx = counts.indexOf(Math.max(...counts));
    return textChoice("Each dot is one student. How many pets do the most students have?", `${topIdx} pets`, [0, 1, 2, 3, 4].filter((n) => n !== topIdx).slice(0, 3).map((n) => `${n} pets`), "The longest row of dots is the most common answer.", { type: "table", title: "Pets (each ● is one student)", headers: ["Pets", "Students"], rows });
  };
  const bank = (): Question => {
    const b = pick(DATA_BANK);
    return textChoice(b.prompt, b.right as string, b.wrong as string[], b.hint, b.emoji ? { type: "emoji", emoji: b.emoji } : undefined);
  };
  return buildSet(d === 1 ? [read, read, most, diff, dot, bank, bank, bank] : [read, most, diff, total, dot, dotMost, bank, bank]);
}

export const units: Unit[] = [
  {
    id: "numbers-100000-ab",
    title: "Numbers to 100 000",
    emoji: "🔢",
    blurb: "Place value, comparing and ordering big numbers.",
    parentNote: "Reading and writing whole numbers up to 100 000, the value of each digit, comparing and ordering them, and adding or taking away 10, 100, 1 000 or 10 000.",
    standards: ab("3N1.1", "place value of whole numbers within 100 000, comparing and ordering them"),
    generate: numbers100000,
  },
  {
    id: "polygons-ab",
    title: "Polygons & Right Angles",
    emoji: "🔷",
    blurb: "Name polygons and spot parallel and perpendicular lines.",
    parentNote: "Triangles, quadrilaterals, pentagons, hexagons and octagons; regular and irregular polygons; parallel and perpendicular lines; and right angles.",
    standards: ab("3G1.1", "polygons, regular and irregular shapes, parallel and perpendicular lines and right angles"),
    generate: bankUnit(POLYGONS, { sorts: [POLY_SORT] }),
  },
  {
    id: "angles-ab",
    title: "Comparing Angles",
    emoji: "📐",
    blurb: "Is it smaller than, equal to or bigger than a square corner?",
    parentNote: "Children learn what an angle is and compare angles directly (laying one over another) and with a right angle, such as the corner of a page. Degrees come later, in Grade 4.",
    standards: ab("3M2.1, 3M2.2", "interpreting angles and comparing them directly or indirectly"),
    generate: angleSet,
  },
  {
    id: "moves-ab",
    title: "Slides, Flips & Turns",
    emoji: "🔄",
    blurb: "Translations, reflections and rotations of shapes.",
    parentNote: "Telling a slide (translation), a flip (reflection) and a turn (rotation) apart, and knowing the shape stays the same size.",
    standards: ab("3G1.2", "translations, reflections and rotations of polygons"),
    generate: bankUnit(MOVES),
  },
  {
    id: "length-perimeter-ab",
    title: "Length & Perimeter",
    emoji: "📏",
    blurb: "Metres, centimetres and the distance around a shape.",
    parentNote: "Measuring length in millimetres, centimetres, decimetres and metres, the imperial units inch, foot and yard, estimating with benchmarks, and finding the perimeter of polygons.",
    standards: ab("3M1.1, 3M1.2, 3M1.3", "length in metric and imperial units, perimeter of polygons and estimating with benchmarks"),
    generate: lengthPerimeter,
  },
  {
    id: "data-ab",
    title: "Data, Dot Plots & Bar Graphs",
    emoji: "📊",
    blurb: "Ask a question, collect data and read graphs.",
    parentNote: "Statistical questions, first-hand and second-hand data, dot plots, and bar graphs where one square stands for one item.",
    standards: ab("3ST1.1, 3ST1.2", "statistical questions, first-hand and second-hand data, dot plots and bar graphs"),
    generate: graphs,
  },
];
