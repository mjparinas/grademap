import {
  chance,
  nearbyNumbers,
  numberChoice,
  pick,
  randInt,
  sample,
  shuffle,
  textChoice,
} from "../../random";
import { fromBank, type BankItem } from "../../bank";
import { COIN_NAMES } from "../../money";
import type { ChoiceQuestion, Question, ShapeName, Course } from "../../types";

const tensOnes = (n: number) => ({ tens: Math.floor(n / 10), ones: n % 10 });

// ---------- Tens & Ones ----------

function placeValue(): Question[] {
  const builds: Question[] = [0, 1, 2].map(() => {
    const n = randInt(11, 99);
    const { tens, ones } = tensOnes(n);
    return {
      kind: "build",
      prompt: `Build the number ${n}.`,
      hint: `${n} is ${tens} tens and ${ones} ones.`,
      target: n,
    };
  });

  const reads: Question[] = [0, 1, 2].map(() => {
    const n = randInt(12, 99);
    const { tens, ones } = tensOnes(n);
    return numberChoice(
      "What number do the blocks show?",
      n,
      `Count the tens: ${tens} tens is ${tens * 10}. Then add ${ones} ones to get ${n}.`,
      { type: "blocks", tens, ones },
      { min: 10, max: 99 },
    );
  });

  const digits: Question[] = [0, 1].map(() => {
    let tens: number, ones: number;
    do {
      tens = randInt(2, 9);
      ones = randInt(1, 9);
    } while (tens === ones);
    const n = tens * 10 + ones;
    return textChoice(
      `In ${n}, what is the ${tens} worth?`,
      String(tens * 10),
      [String(tens), String(ones * 10)],
      `The ${tens} is in the tens place, so it means ${tens} tens. That's ${tens * 10}.`,
      { type: "equation", text: String(n) },
    );
  });

  return shuffle([...builds, ...reads, ...digits]);
}

// ---------- Bigger or Smaller ----------

function compare(): Question[] {
  const bigger: Question[] = [0, 1, 2].map((i) => {
    let a: number, b: number;
    do {
      a = randInt(10, 99);
      // Sometimes keep the same tens digit so kids look at the ones.
      b = i === 0 ? Math.floor(a / 10) * 10 + randInt(0, 9) : randInt(10, 99);
    } while (a === b);
    const big = Math.max(a, b);
    return textChoice(
      "Which number is bigger?",
      String(big),
      [String(Math.min(a, b))],
      Math.floor(a / 10) === Math.floor(b / 10)
        ? "The tens are the same, so look at the ones."
        : "Look at the tens first. More tens means a bigger number.",
    );
  });

  const a = randInt(10, 99);
  const b = chance(0.25) ? a : nearbyNumbers(a, 1, 10, 99)[0];
  const sign = a < b ? "<" : a > b ? ">" : "=";
  const symbol: ChoiceQuestion = {
    kind: "choice",
    prompt: "Which sign goes in the box?",
    hint:
      sign === "="
        ? "Both numbers are the same, so they are equal."
        : `${Math.max(a, b)} is bigger. The open side of < or > faces the bigger number.`,
    visual: { type: "equation", text: `${a} ☐ ${b}` },
    answer: sign,
    choices: [
      { id: "<", label: "<" },
      { id: "=", label: "=" },
      { id: ">", label: ">" },
    ],
  };

  const x = randInt(2, 8);
  const y = randInt(2, 9);
  const equalSum = chance(0.5);
  const p = randInt(1, x + y - 1);
  let q = x + y - p + (equalSum ? 0 : pick([1, -1]));
  if (q < 1) q = x + y - p + 1;
  const equality = textChoice(
    `Is ${x} + ${y} the same as ${p} + ${q}?`,
    equalSum ? "Yes, they are equal (=)" : "No, not equal (≠)",
    [equalSum ? "No, not equal (≠)" : "Yes, they are equal (=)"],
    `${x} + ${y} = ${x + y} and ${p} + ${q} = ${p + q}.`,
    { type: "equation", text: `${x} + ${y}  ?  ${p} + ${q}` },
  );

  let close: number;
  do close = randInt(46, 54);
  while (close === 50);
  const benchmark = textChoice(
    "Which number is close to 50?",
    String(close),
    [String(randInt(15, 30)), String(randInt(75, 95))],
    "Numbers just a little more or a little less than 50 are close to 50.",
  );

  const orders: Question[] = [0, 1].map(() => {
    const nums = sample(Array.from({ length: 99 }, (_, i) => i + 1), 4).sort((m, n) => m - n);
    return {
      kind: "order",
      prompt: "Tap the numbers from smallest to biggest.",
      hint: `Find the smallest first. Look at the tens! The smallest is ${nums[0]}.`,
      items: nums.map((n) => ({ id: String(n), label: String(n) })),
    };
  });

  return shuffle([...bigger, symbol, equality, benchmark, ...orders]);
}

// ---------- Facts to 20 ----------

function addHint(a: number, b: number): string {
  const toTen = 10 - a;
  if (a < 10 && a + b > 10 && toTen > 0) {
    return `Make a ten! ${a} + ${toTen} = 10, then add ${b - toTen} more to get ${a + b}.`;
  }
  return `Start at ${a} and count up ${b} more.`;
}

function facts20(): Question[] {
  const adds: Question[] = [0, 1, 2].map((i) => {
    const a = randInt(3, 9);
    const b = randInt(2, 9);
    return numberChoice(
      `What is ${a} + ${b}?`,
      a + b,
      addHint(a, b),
      i === 0 ? { type: "tenFrame", filled: a, extra: b } : { type: "equation", text: `${a} + ${b} = ?` },
      { min: 0, max: 20 },
    );
  });

  const subs: Question[] = [0, 1, 2].map(() => {
    const a = randInt(8, 20);
    const b = randInt(2, Math.min(9, a));
    return numberChoice(
      `What is ${a} − ${b}?`,
      a - b,
      `Think addition: ${b} + ? = ${a}. Or start at ${a} and count back ${b}.`,
      { type: "equation", text: `${a} − ${b} = ?` },
      { min: 0, max: 20 },
    );
  });

  const missing: Question[] = [0, 1].map(() => {
    const a = randInt(3, 10);
    const sum = randInt(a + 2, 18);
    return numberChoice(
      "What number is missing?",
      sum - a,
      `Count up from ${a} to ${sum}. How many jumps did you make?`,
      { type: "equation", text: `${a} + ☐ = ${sum}` },
      { min: 0, max: 20 },
    );
  });

  return shuffle([...adds, ...subs, ...missing]);
}

// ---------- Adding to 100 ----------

function addSub100(): Question[] {
  const out: Question[] = [];

  for (let i = 0; i < 2; i++) {
    const a = randInt(11, 59);
    const t = randInt(1, 3) * 10;
    out.push(
      numberChoice(
        `What is ${a} + ${t}?`,
        a + t,
        `Adding tens? Only the tens change: ${Math.floor(a / 10)} tens + ${t / 10} tens = ${Math.floor(a / 10) + t / 10} tens.`,
        { type: "equation", text: `${a} + ${t} = ?` },
      ),
    );
  }

  for (let i = 0; i < 2; i++) {
    const aT = randInt(1, 6), aO = randInt(0, 5);
    const bT = randInt(1, 8 - aT), bO = randInt(0, 9 - aO);
    const a = aT * 10 + aO, b = bT * 10 + bO;
    out.push(
      numberChoice(
        `What is ${a} + ${b}?`,
        a + b,
        `Add the tens: ${aT * 10} + ${bT * 10} = ${(aT + bT) * 10}. Add the ones: ${aO} + ${bO} = ${aO + bO}. Together: ${a + b}.`,
        i === 0 ? { type: "blocks", tens: aT + bT, ones: aO + bO } : { type: "equation", text: `${a} + ${b} = ?` },
      ),
    );
  }

  {
    const aO = randInt(5, 9), bO = randInt(10 - aO, 9);
    const aT = randInt(1, 5), bT = randInt(1, 8 - aT);
    const a = aT * 10 + aO, b = bT * 10 + bO;
    out.push(
      numberChoice(
        `What is ${a} + ${b}?`,
        a + b,
        `The ones make a new ten! ${aO} + ${bO} = ${aO + bO}. So ${(aT + bT) * 10} + ${aO + bO} = ${a + b}.`,
        { type: "equation", text: `${a} + ${b} = ?` },
      ),
    );
  }

  {
    const a = randInt(41, 99);
    const t = randInt(1, Math.floor(a / 10) - 1) * 10;
    out.push(
      numberChoice(
        `What is ${a} − ${t}?`,
        a - t,
        `Taking away tens? Only the tens change. ${a} take away ${t / 10} tens is ${a - t}.`,
        { type: "equation", text: `${a} − ${t} = ?` },
      ),
    );
  }

  {
    const aT = randInt(3, 9), aO = randInt(3, 9);
    const bT = randInt(1, aT - 1), bO = randInt(0, aO);
    const a = aT * 10 + aO, b = bT * 10 + bO;
    out.push(
      numberChoice(
        `What is ${a} − ${b}?`,
        a - b,
        `Take away the tens: ${aT * 10} − ${bT * 10} = ${(aT - bT) * 10}. Take away the ones: ${aO} − ${bO} = ${aO - bO}.`,
        { type: "equation", text: `${a} − ${b} = ?` },
      ),
    );
  }

  {
    const story = pick([
      { thing: "shells", emoji: "🐚", verb: "finds" },
      { thing: "stickers", emoji: "⭐", verb: "gets" },
      { thing: "blueberries", emoji: "🫐", verb: "picks" },
    ]);
    const a = randInt(12, 45);
    const b = randInt(11, 40);
    out.push(
      numberChoice(
        `Ollie has ${a} ${story.thing}. He ${story.verb} ${b} more. How many ${story.thing} now?`,
        a + b,
        `Add them together: ${a} + ${b}. Add the tens, then the ones.`,
        { type: "emoji", emoji: story.emoji, caption: `${a} + ${b}` },
      ),
    );
  }

  return shuffle(out);
}

// ---------- Patterns ----------

const PATTERN_SETS: { emoji: string; name: string }[][] = [
  [{ emoji: "🍎", name: "apple" }, { emoji: "🍌", name: "banana" }, { emoji: "🍇", name: "grapes" }],
  [{ emoji: "🔴", name: "red" }, { emoji: "🔵", name: "blue" }, { emoji: "🟡", name: "yellow" }],
  [{ emoji: "⭐", name: "star" }, { emoji: "🌙", name: "moon" }, { emoji: "☀️", name: "sun" }],
  [{ emoji: "🐟", name: "fish" }, { emoji: "🐚", name: "shell" }, { emoji: "🦀", name: "crab" }],
  [{ emoji: "🌲", name: "tree" }, { emoji: "🍄", name: "mushroom" }, { emoji: "🌸", name: "flower" }],
];

const CORES = [
  [0, 1],
  [0, 1, 2],
  [0, 0, 1],
  [0, 1, 1],
];

function repeatingPattern(): ChoiceQuestion {
  const set = pick(PATTERN_SETS);
  const core = pick(CORES);
  const shown = randInt(core.length * 2, core.length * 2 + 2);
  const seq = Array.from({ length: shown }, (_, i) => set[core[i % core.length]]);
  const next = set[core[shown % core.length]];
  const others = set.filter((s) => s !== next);
  return textChoice(
    "What comes next?",
    { label: next.name, emoji: next.emoji },
    others.map((o) => ({ label: o.name, emoji: o.emoji })),
    `Say the pattern out loud: ${core.map((c) => set[c].name).join(", ")}… What part repeats?`,
    { type: "emojiRow", items: seq.map((s) => s.emoji), showBlank: true },
  );
}

function corePattern(): ChoiceQuestion {
  const set = pick(PATTERN_SETS);
  const core = pick(CORES.slice(1));
  const seq = Array.from({ length: core.length * 3 }, (_, i) => set[core[i % core.length]].emoji);
  const coreText = core.map((c) => set[c].emoji).join(" ");
  const wrong1 = core.slice(0, 2).map((c) => set[c].emoji).join(" ");
  const wrong2 = [...core].reverse().map((c) => set[c].emoji).join(" ");
  return textChoice(
    "Which part keeps repeating?",
    coreText,
    [wrong1, wrong2].filter((w) => w !== coreText),
    "Find where the pattern starts over again. The part before that is the core.",
    { type: "emojiRow", items: seq },
  );
}

function increasingNumbers(): ChoiceQuestion {
  const step = pick([2, 5, 10, 3]);
  const start = step === 10 ? randInt(0, 5) * 10 + pick([0, 0, 3]) : randInt(1, 6) * (step === 5 ? 5 : 1);
  const seq = [0, 1, 2, 3].map((i) => start + i * step);
  const next = start + 4 * step;
  return numberChoice(
    "What number comes next?",
    next,
    `Each number goes up by ${step}. ${seq[3]} + ${step} = ${next}.`,
    { type: "equation", text: `${seq.join(", ")}, ☐` },
    { min: 0, max: 100 },
  );
}

function towerPattern(): ChoiceQuestion {
  const step = pick([1, 2]);
  const start = randInt(1, 2);
  const heights = [0, 1, 2].map((i) => start + i * step);
  const next = start + 3 * step;
  return numberChoice(
    "How many blocks will the next tower have?",
    next,
    `Each tower grows by ${step} block${step > 1 ? "s" : ""}. ${heights[2]} + ${step} = ${next}.`,
    { type: "towers", heights, showBlank: true },
    { min: 1, max: 12 },
  );
}

function patterns(): Question[] {
  return shuffle([
    repeatingPattern(),
    repeatingPattern(),
    repeatingPattern(),
    corePattern(),
    increasingNumbers(),
    increasingNumbers(),
    increasingNumbers(),
    towerPattern(),
  ]);
}

// ---------- Coins ----------


function centsChoice(prompt: string, answer: number, hint: string, coins?: number[]): ChoiceQuestion {
  const wrong = shuffle([5, -5, 10, -10, 25, -25])
    .map((d) => answer + d)
    .filter((n) => n > 0 && n <= 100)
    .slice(0, 2);
  const options = shuffle([answer, ...wrong]);
  return {
    kind: "choice",
    prompt,
    hint,
    visual: coins ? { type: "coins", coins } : undefined,
    answer: String(answer),
    choices: options.map((n) => ({ id: String(n), label: `${n}¢` })),
  };
}

function randomCoins(maxTotal: number): number[] {
  const coins: number[] = [];
  let total = 0;
  const count = randInt(2, 5);
  for (let i = 0; i < count; i++) {
    const options = [25, 10, 5].filter((c) => total + c <= maxTotal);
    if (!options.length) break;
    const c = pick(options);
    coins.push(c);
    total += c;
  }
  return coins.sort((a, b) => b - a);
}

function money(): Question[] {
  const counts: Question[] = [0, 1].map(() => {
    const coins = randomCoins(100);
    const total = coins.reduce((s, c) => s + c, 0);
    return centsChoice(
      "How much money is this?",
      total,
      `Start with the biggest coin and count on: ${coins.map((c) => `${c}¢`).join(" + ")} = ${total}¢.`,
      coins,
    );
  });

  const makes: Question[] = [0, 1].map(() => {
    const target = randInt(3, 19) * 5;
    return {
      kind: "coins",
      prompt: `Make ${target}¢.`,
      hint: "A quarter is 25¢, a dime is 10¢ and a nickel is 5¢. Try the biggest coin that fits first.",
      target,
      coins: [5, 10, 25],
    };
  });

  const coin = pick([5, 10, 25, 100]);
  const nameCoin = textChoice(
    `Which coin is worth ${coin === 100 ? "$1 (100¢)" : `${coin}¢`}?`,
    { label: COIN_NAMES[coin], coin },
    [5, 10, 25, 100].filter((c) => c !== coin).slice(0, 3).map((c) => ({ label: COIN_NAMES[c], coin: c })),
    "Nickel = 5¢, dime = 10¢, quarter = 25¢, loonie = $1.",
  );

  const howMany = pick([
    { q: "How many nickels make 25¢?", a: 5, hint: "Count by 5s: 5, 10, 15, 20, 25. That's 5 nickels." },
    { q: "How many quarters make $1?", a: 4, hint: "Count by 25s: 25, 50, 75, 100. That's 4 quarters." },
    { q: "How many dimes make $1?", a: 10, hint: "Count by 10s up to 100. That's 10 dimes." },
    { q: "How many nickels make a dime?", a: 2, hint: "5¢ + 5¢ = 10¢. That's 2 nickels." },
  ]);
  const howManyQ = numberChoice(howMany.q, howMany.a, howMany.hint, undefined, { min: 1, max: 12 });

  const have = randInt(4, 10) * 10;
  const cost = randInt(1, have / 10 - 1) * 10;
  const item = pick([
    { name: "sticker", emoji: "⭐" },
    { name: "apple", emoji: "🍎" },
    { name: "pencil", emoji: "✏️" },
  ]);
  const spend = centsChoice(
    `You have ${have}¢. A ${item.name} costs ${cost}¢. How much is left after you buy it?`,
    have - cost,
    `Take away what you spend: ${have}¢ − ${cost}¢ = ${have - cost}¢.`,
  );
  spend.visual = { type: "emoji", emoji: item.emoji, caption: `${cost}¢` };

  const saving = textChoice(
    "What does saving money mean?",
    { label: "Keeping it to use later", emoji: "🐷" },
    [
      { label: "Spending it all right away", emoji: "🛍️" },
      { label: "Giving it to a stranger", emoji: "🚶" },
    ],
    "When you save, you put money away (like in a piggy bank) so you can use it later.",
  );

  return shuffle([...counts, ...makes, nameCoin, howManyQ, spend, saving]);
}

// ---------- Measuring ----------

const MEASURE_OBJECTS = [
  { name: "pencil", emoji: "✏️" },
  { name: "crayon", emoji: "🖍️" },
  { name: "carrot", emoji: "🥕" },
  { name: "caterpillar", emoji: "🐛" },
  { name: "spoon", emoji: "🥄" },
  { name: "key", emoji: "🔑" },
  { name: "paintbrush", emoji: "🖌️" },
];

function measuring(): Question[] {
  const rulers: Question[] = sample(MEASURE_OBJECTS, 4).map((obj) => {
    const length = randInt(3, 12);
    return numberChoice(
      `How long is the ${obj.name}?`,
      length,
      `Start at 0. Count the centimetres to the end of the ${obj.name}.`,
      { type: "ruler", length, emoji: obj.emoji },
      { min: 1, max: 15, suffix: " cm" },
    );
  });

  const big = [
    { name: "school bus", emoji: "🚌" },
    { name: "playground", emoji: "🛝" },
    { name: "swimming pool", emoji: "🏊" },
    { name: "hallway", emoji: "🚪" },
  ];
  const small = [
    { name: "ladybug", emoji: "🐞" },
    { name: "book", emoji: "📕" },
    { name: "leaf", emoji: "🍃" },
    { name: "crayon", emoji: "🖍️" },
  ];
  const units: Question[] = [
    ...sample(big, 1).map((t) => ({ ...t, ans: "metres" })),
    ...sample(small, 2).map((t) => ({ ...t, ans: "centimetres" })),
  ].map((t) =>
    textChoice(
      `Would you measure a ${t.name} in centimetres or metres?`,
      t.ans,
      [t.ans === "metres" ? "centimetres" : "metres"],
      "Small things: centimetres (cm). Big things: metres (m). 1 metre is 100 centimetres.",
      { type: "emoji", emoji: t.emoji },
    ),
  );

  const metre = numberChoice(
    "How many centimetres make 1 metre?",
    100,
    "A metre stick has 100 centimetres on it.",
    { type: "emoji", emoji: "📏" },
    { min: 10, max: 100 },
  );

  return shuffle([...rulers, ...units, metre]);
}

// ---------- Shapes ----------

const SIDES: Partial<Record<ShapeName, number>> = {
  triangle: 3,
  square: 4,
  rectangle: 4,
  pentagon: 5,
  hexagon: 6,
};

const SHAPE_EXTRAS: BankItem[] = [
  {
    prompt: "Which shape has no straight sides?",
    right: { label: "circle", shape: "circle" },
    wrong: [
      { label: "triangle", shape: "triangle" },
      { label: "hexagon", shape: "hexagon" },
    ],
    hint: "A circle is round all the way. Triangles and hexagons have straight sides.",
  },
  {
    prompt: "Which shape has exactly 3 corners?",
    right: { label: "triangle", shape: "triangle" },
    wrong: [
      { label: "pentagon", shape: "pentagon" },
      { label: "hexagon", shape: "hexagon" },
    ],
    hint: "Tri means three. A triangle has 3 sides and 3 corners.",
  },
  {
    prompt: "Which shape has exactly 5 sides?",
    right: { label: "pentagon", shape: "pentagon" },
    wrong: [
      { label: "triangle", shape: "triangle" },
      { label: "hexagon", shape: "hexagon" },
    ],
    hint: "Penta means five. Count the sides: 1, 2, 3, 4, 5.",
  },
  {
    prompt: "Which shape has exactly 6 sides?",
    right: { label: "hexagon", shape: "hexagon" },
    wrong: [
      { label: "pentagon", shape: "pentagon" },
      { label: "square", shape: "square" },
    ],
    hint: "Hexa means six. A hexagon has 6 sides and 6 corners.",
  },
  {
    prompt: "A square has 4 sides that are all…",
    right: "the same length",
    wrong: ["different lengths", "curved"],
    hint: "Look at a square. Every side is the same length.",
    emoji: "🟦",
  },
  {
    prompt: "How many corners does a triangle have?",
    right: "3",
    wrong: ["4", "5"],
    hint: "Put your finger on each corner and count: 1, 2, 3.",
    emoji: "🔺",
  },
  {
    prompt: "A rectangle has 4 sides. How many are long sides?",
    right: "2",
    wrong: ["1", "4"],
    hint: "A rectangle has 2 long sides and 2 short sides.",
  },
  {
    prompt: "Which 3D shape can roll AND stack?",
    right: { label: "cylinder", shape: "cylinder" },
    wrong: [
      { label: "sphere", shape: "sphere" },
      { label: "cube", shape: "cube" },
    ],
    hint: "A cylinder has flat circles on the ends to stack, and a curved side to roll. A sphere rolls but won't stack.",
  },
  {
    prompt: "Which 3D shape has 1 flat face and 1 point at the top?",
    right: { label: "cone", shape: "cone" },
    wrong: [
      { label: "cylinder", shape: "cylinder" },
      { label: "sphere", shape: "sphere" },
    ],
    hint: "A cone has a flat circle on the bottom and a point on top.",
  },
  {
    prompt: "A cylinder has 2 flat faces. What shape are they?",
    right: { label: "circle", shape: "circle" },
    wrong: [
      { label: "square", shape: "square" },
      { label: "triangle", shape: "triangle" },
    ],
    hint: "Think of the top and bottom of a can. Both are circles.",
    emoji: "🥫",
  },
  {
    prompt: "Which 3D shape has 6 square faces that are all the same?",
    right: { label: "cube", shape: "cube" },
    wrong: [
      { label: "cone", shape: "cone" },
      { label: "cylinder", shape: "cylinder" },
    ],
    hint: "A cube is like a dice. All 6 faces are matching squares.",
  },
  {
    prompt: "Which shape has 4 sides and 4 corners?",
    right: { label: "rectangle", shape: "rectangle" },
    wrong: [
      { label: "triangle", shape: "triangle" },
      { label: "hexagon", shape: "hexagon" },
    ],
    hint: "Count the sides and corners. Only the rectangle has 4 of each here.",
  },
];

function shapes(): Question[] {
  const flat = Object.keys(SIDES) as ShapeName[];
  const sideQs: Question[] = sample(flat, 2).map((shape) =>
    numberChoice(
      "How many sides does this shape have?",
      SIDES[shape]!,
      `Touch each straight side and count. A ${shape} has ${SIDES[shape]} sides.`,
      { type: "shape", shape },
      { min: 3, max: 8 },
    ),
  );

  const cornerShape = pick(flat);
  const cornerQ = numberChoice(
    "How many corners (vertices) does this shape have?",
    SIDES[cornerShape]!,
    `A corner is where two sides meet. A ${cornerShape} has ${SIDES[cornerShape]} corners.`,
    { type: "shape", shape: cornerShape },
    { min: 3, max: 8 },
  );

  const findQs: Question[] = sample(["triangle", "hexagon", "pentagon", "rectangle"] as ShapeName[], 2).map(
    (target) =>
      textChoice(
        `Which one is a ${target}?`,
        { label: target, shape: target },
        sample(
          // A square is also a rectangle, so never offer it as a wrong rectangle.
          (["circle", "square", "triangle", "hexagon", "pentagon", "rectangle"] as ShapeName[]).filter(
            (s) => s !== target && !(target === "rectangle" && s === "square"),
          ),
          2,
        ).map((s) => ({ label: s, shape: s })),
        `A ${target} has ${SIDES[target]} sides.`,
      ),
  );

  const real = pick([
    { thing: "basketball", emoji: "🏀", answer: "sphere" as ShapeName },
    { thing: "can of soup", emoji: "🥫", answer: "cylinder" as ShapeName },
    { thing: "dice", emoji: "🎲", answer: "cube" as ShapeName },
    { thing: "ice cream cone", emoji: "🍦", answer: "cone" as ShapeName },
    { thing: "globe", emoji: "🌍", answer: "sphere" as ShapeName },
    { thing: "marble", emoji: "🔮", answer: "sphere" as ShapeName },
    { thing: "party hat", emoji: "🎉", answer: "cone" as ShapeName },
    { thing: "drum", emoji: "🥁", answer: "cylinder" as ShapeName },
  ]);
  const solids: ShapeName[] = ["sphere", "cylinder", "cube", "cone"];
  const realQ = textChoice(
    `A ${real.thing} is shaped like a…`,
    { label: real.answer, shape: real.answer },
    sample(solids.filter((s) => s !== real.answer), 2).map((s) => ({ label: s, shape: s })),
    "Think about the faces. Is it round all over, or does it have flat faces?",
    { type: "emoji", emoji: real.emoji },
  );

  const faces = numberChoice(
    "How many flat faces does a cube have?",
    6,
    "A cube has a top, a bottom and 4 sides. 1 + 1 + 4 = 6 faces.",
    { type: "shape", shape: "cube" },
    { min: 2, max: 10 },
  );

  const roll = textChoice(
    "Which 3D shape has no flat faces at all?",
    { label: "sphere", shape: "sphere" },
    [
      { label: "cube", shape: "cube" },
      { label: "cylinder", shape: "cylinder" },
    ],
    "A sphere is round all over, like a ball. It has no flat faces.",
  );

  const extraQs = fromBank(SHAPE_EXTRAS, 2);

  return shuffle([...sideQs, cornerQ, ...findQs, realQ, faces, roll, ...extraQs]);
}

// ---------- Graphs ----------

const GRAPH_TOPICS = [
  {
    title: "Our favourite fruit",
    rows: [
      { label: "apples", emoji: "🍎" },
      { label: "bananas", emoji: "🍌" },
      { label: "strawberries", emoji: "🍓" },
      { label: "grapes", emoji: "🍇" },
    ],
  },
  {
    title: "Pets in our class",
    rows: [
      { label: "dogs", emoji: "🐶" },
      { label: "cats", emoji: "🐱" },
      { label: "fish", emoji: "🐠" },
      { label: "rabbits", emoji: "🐰" },
    ],
  },
  {
    title: "Weather this month",
    rows: [
      { label: "sunny days", emoji: "☀️" },
      { label: "rainy days", emoji: "🌧️" },
      { label: "cloudy days", emoji: "☁️" },
      { label: "snowy days", emoji: "❄️" },
    ],
  },
];

function makeGraph() {
  const topic = pick(GRAPH_TOPICS);
  const rows = sample(topic.rows, 3);
  const counts = sample([1, 2, 3, 4, 5, 6, 7, 8], 3);
  return {
    title: topic.title,
    rows: rows.map((r, i) => ({ ...r, count: counts[i] })),
  };
}

function graphs(): Question[] {
  const out: Question[] = [];
  for (let i = 0; i < 3; i++) {
    const g = makeGraph();
    const row = pick(g.rows);
    out.push(
      numberChoice(
        `How many ${row.label}?`,
        row.count,
        `Find the ${row.emoji} row and count each picture.`,
        { type: "pictograph", ...g },
        { min: 0, max: 10 },
      ),
    );
  }
  for (const mode of ["most", "most", "fewest"] as const) {
    const g = makeGraph();
    const sorted = [...g.rows].sort((a, b) => b.count - a.count);
    const target = mode === "most" ? sorted[0] : sorted[sorted.length - 1];
    out.push(
      textChoice(
        `Which has the ${mode}?`,
        { label: target.label, emoji: target.emoji },
        g.rows.filter((r) => r !== target).map((r) => ({ label: r.label, emoji: r.emoji })),
        mode === "most" ? "Look for the longest row." : "Look for the shortest row.",
        { type: "pictograph", ...g },
      ),
    );
  }
  for (let i = 0; i < 2; i++) {
    const g = makeGraph();
    const [a, b] = [...g.rows].sort((x, y) => y.count - x.count);
    out.push(
      numberChoice(
        `How many more ${a.label} than ${b.label}?`,
        a.count - b.count,
        `${a.count} ${a.label} and ${b.count} ${b.label}. ${a.count} − ${b.count} = ${a.count - b.count}.`,
        { type: "pictograph", ...g },
        { min: 0, max: 8 },
      ),
    );
  }
  return shuffle(out);
}

// ---------- Likely or Not ----------

const CHANCE_WORDS = {
  certain: { label: "certain", emoji: "✅" },
  likely: { label: "likely", emoji: "👍" },
  unlikely: { label: "unlikely", emoji: "🤏" },
  impossible: { label: "impossible", emoji: "🚫" },
};
type Chance = keyof typeof CHANCE_WORDS;

const EVENTS: { text: string; emoji: string; answer: Chance }[] = [
  { text: "Tomorrow will come after today.", emoji: "📅", answer: "certain" },
  { text: "Monday will come after Sunday.", emoji: "🗓️", answer: "certain" },
  { text: "It will rain in Vancouver sometime in November.", emoji: "🌧️", answer: "likely" },
  { text: "You will eat lunch today.", emoji: "🥪", answer: "likely" },
  { text: "It will snow in Vancouver in July.", emoji: "❄️", answer: "unlikely" },
  { text: "You will see a whale in your bathtub.", emoji: "🐋", answer: "impossible" },
  { text: "A dog will drive the school bus.", emoji: "🐕", answer: "impossible" },
  { text: "You will find a dinosaur at the grocery store.", emoji: "🦖", answer: "impossible" },
  { text: "Your teacher will turn into a pumpkin.", emoji: "🎃", answer: "impossible" },
  { text: "You will meet a real dragon at recess.", emoji: "🐉", answer: "impossible" },
  { text: "A bird will land on your head today.", emoji: "🐦", answer: "unlikely" },
];

const COLOURS = [
  { name: "red", emoji: "🔴", hex: "#ef4444" },
  { name: "blue", emoji: "🔵", hex: "#3b82f6" },
  { name: "green", emoji: "🟢", hex: "#22c55e" },
  { name: "yellow", emoji: "🟡", hex: "#facc15" },
];

function likelihood(): Question[] {
  const certain = EVENTS.filter((e) => e.answer === "certain");
  const likely = EVENTS.filter((e) => e.answer === "likely");
  const unlikely = EVENTS.filter((e) => e.answer === "unlikely");
  const impossible = EVENTS.filter((e) => e.answer === "impossible");
  const events = [pick(certain), pick(likely), pick(unlikely), ...sample(impossible, 2)];

  const eventQs: Question[] = events.map((e) => ({
    kind: "choice",
    prompt: e.text,
    hint: {
      certain: "Certain means it will happen for sure.",
      likely: "Likely means it will probably happen, but not for sure.",
      unlikely: "Unlikely means it probably won't happen, but it could.",
      impossible: "Impossible means it can never happen.",
    }[e.answer],
    visual: { type: "emoji", emoji: e.emoji, caption: "How likely is it?" },
    answer: e.answer,
    choices: (Object.keys(CHANCE_WORDS) as Chance[]).map((k) => ({ id: k, ...CHANCE_WORDS[k] })),
  }));

  const spinnerQs: Question[] = [0, 1, 2].map(() => {
    const [main, other1, other2] = sample(COLOURS, 3);
    const mainCount = randInt(4, 6);
    const segments = shuffle([
      ...Array(mainCount).fill(main.hex),
      other1.hex,
      ...(chance(0.5) ? [other2.hex] : [other1.hex]),
    ]);
    const uses2 = segments.includes(other2.hex);
    const wrong = uses2 ? [other1, other2] : [other1];
    return textChoice(
      "Which colour will the spinner most likely land on?",
      { label: main.name, emoji: main.emoji },
      wrong.map((c) => ({ label: c.name, emoji: c.emoji })),
      `The colour with the most space is most likely. ${main.name[0].toUpperCase() + main.name.slice(1)} has the most!`,
      { type: "spinner", segments },
    );
  });

  return shuffle([...eventQs, ...spinnerQs]);
}

export const course: Course = {
  grade: "2",
  subject: "math",
  bigIdeas: {
    "ca-bc": [
    "Numbers to 100 represent quantities that can be decomposed into 10s and 1s.",
    "Development of computational fluency in addition and subtraction with numbers to 100 requires an understanding of place value.",
    "The regular change in increasing patterns can be identified and used to make generalizations.",
    "Objects and shapes have attributes that can be described, measured, and compared.",
    "Concrete graphs help us to compare and interpret data and show one-to-one correspondence.",
    ],
  },
  units: [
    {
      id: "tens-and-ones",
      title: "Tens & Ones",
      emoji: "🧱",
      blurb: "Build numbers to 100",
      standards: { "ca-bc": "Number concepts to 100" },
      parentNote: "Seeing 47 as 4 tens and 7 ones. This place-value idea underpins all Grade 2 adding and subtracting.",
      generate: placeValue,
    },
    {
      id: "bigger-or-smaller",
      title: "Bigger or Smaller",
      emoji: "⚖️",
      blurb: "Compare and order numbers",
      standards: { "ca-bc": "Benchmarks of 25, 50 and 100; symbolic representation of equality and inequality" },
      parentNote: "Comparing and ordering numbers, using <, > and =, and noticing numbers close to 50.",
      generate: compare,
    },
    {
      id: "facts-to-20",
      title: "Facts to 20",
      emoji: "➕",
      blurb: "Add and take away",
      standards: { "ca-bc": "Addition and subtraction facts to 20 (emerging computational fluency); change in quantity to 20" },
      parentNote: "Fluent facts to 20 using strategies like making ten and thinking addition to subtract.",
      generate: facts20,
    },
    {
      id: "adding-to-100",
      title: "Adding to 100",
      emoji: "💯",
      blurb: "Bigger adding and take-aways",
      standards: { "ca-bc": "Addition and subtraction to 100" },
      parentNote: "Two-digit adding and subtracting by working with tens and ones, including making a new ten.",
      generate: addSub100,
    },
    {
      id: "patterns",
      title: "Patterns",
      emoji: "🔁",
      blurb: "What comes next?",
      standards: { "ca-bc": "Repeating and increasing patterns" },
      parentNote: "Finding the repeating core of a pattern and describing how increasing patterns grow (skip counting).",
      generate: patterns,
    },
    {
      id: "coins",
      title: "Coins",
      emoji: "🪙",
      blurb: "Count Canadian money",
      standards: { "ca-bc": "Financial literacy: coin combinations to 100 cents, and spending and saving" },
      parentNote: "Counting nickels, dimes, quarters and loonies to 100¢, and talking about spending and saving.",
      generate: money,
    },
    {
      id: "measuring",
      title: "Measuring",
      emoji: "📏",
      blurb: "Centimetres and metres",
      standards: { "ca-bc": "Direct linear measurement, using standard units (centimetres, metres)" },
      parentNote: "Measuring with a ruler from zero and choosing between centimetres and metres.",
      generate: measuring,
    },
    {
      id: "shapes",
      title: "Shapes",
      emoji: "🔺",
      blurb: "Sides, corners and faces",
      standards: { "ca-bc": "Multiple attributes of 2D shapes and 3D objects" },
      parentNote: "Describing shapes by their sides, corners (vertices) and faces, and spotting 3D shapes in real life.",
      generate: shapes,
    },
    {
      id: "graphs",
      title: "Graphs",
      emoji: "📊",
      blurb: "Read picture graphs",
      standards: { "ca-bc": "Pictorial representation of concrete graphs, using one-to-one correspondence" },
      parentNote: "Reading picture graphs: how many, which has the most or fewest, and how many more.",
      generate: graphs,
    },
    {
      id: "likely-or-not",
      title: "Likely or Not",
      emoji: "🎲",
      blurb: "Certain, likely or impossible?",
      standards: { "ca-bc": "Likelihood of familiar life events, using comparative language" },
      parentNote: "Using words like certain, likely, unlikely and impossible to describe everyday events and spinners.",
      generate: likelihood,
    },
  ],
};
