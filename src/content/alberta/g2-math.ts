import { chance, pick, randInt, sample, shuffle, textChoice } from "../random";
import type { BuildQuestion, GenerateOptions, Question, Unit, Visual } from "../types";
import { ab, buildSet, eq, levelOf, numQ } from "./kit";
import { q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";

// Alberta Grade 2 mathematics (2022 K-6 curriculum). New units here cover what BC and Ontario do not teach at
// Grade 2: numbers to 1000, unit fractions, slides/flips/turns and standard units of time.
// The units shared from BC and Ontario are listed in g2.ts.

// ---------- Numbers to 1000 ----------

const blocksOf = (n: number): Visual => ({ type: "blocks", hundreds: Math.floor(n / 100), tens: Math.floor((n % 100) / 10), ones: n % 10 });

function numbersTo1000(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const hi = d === 1 ? 300 : 999;
  const read = (): Question => {
    const n = randInt(101, hi);
    return numQ("What number do the blocks show?", n, "Count the hundreds, then the tens, then the ones.", blocksOf(n), 999, 100);
  };
  const build = (): BuildQuestion => {
    const target = randInt(101, hi);
    return { kind: "build", prompt: `Build the number ${target}.`, hint: `${target} is ${Math.floor(target / 100)} hundreds, ${Math.floor((target % 100) / 10)} tens and ${target % 10} ones.`, target, hundreds: true };
  };
  const worth = (): Question => {
    // Three different digits, none of them 0, so only one place has the chosen digit.
    let digits: number[] = [];
    while (new Set(digits).size < 3) digits = [randInt(1, 9), randInt(1, 9), randInt(1, 9)];
    const n = digits[0] * 100 + digits[1] * 10 + digits[2];
    const place = randInt(0, 2);
    const digit = digits[place];
    const value = digit * [100, 10, 1][place];
    const options = [digit, digit * 10, digit * 100];
    return textChoice(`In ${n}, what is the ${digit} worth?`, String(value), options.filter((o) => o !== value).map(String), "Look at which place the digit is in: hundreds, tens or ones.", eq(String(n)));
  };
  const skip = (): Question => {
    const set = d === 1 ? [10] : d === 2 ? [10, 100, 10] : [25, 50, 20];
    const by = pick(set);
    const down = d !== 1 && by <= 100 && by !== 25 && chance(0.4);
    let start: number;
    if (by === 100) start = randInt(1, 5) * 100 + (down ? 300 : 0);
    else if (by === 10) start = randInt(1, 60) * 10 + (chance(0.5) ? randInt(1, 9) : 0) + (down ? 60 : 0);
    else start = 0;
    const seq = [0, 1, 2, 3].map((i) => (down ? start - by * i : start + by * i));
    const answer = down ? start - by * 4 : start + by * 4;
    return numQ(`Count by ${by}s${down ? " backwards" : ""}: ${seq.join(", ")}, ?`, answer, `${down ? "Take away" : "Add"} ${by} each time.`, undefined, 1000, 0);
  };
  const moreLess = (): Question => {
    const by = pick([10, 100]);
    const more = chance(0.5);
    const n = randInt(120, 880);
    const answer = more ? n + by : n - by;
    return numQ(`What is ${by} ${more ? "more" : "less"} than ${n}?`, answer, by === 10 ? "The tens digit changes by one." : "The hundreds digit changes by one.", undefined, 1000, 0);
  };
  const evenOdd = (): Question => {
    const n = randInt(101, 999);
    const even = n % 2 === 0;
    return textChoice(`Is ${n} even or odd?`, even ? "even" : "odd", [even ? "odd" : "even"], "Look at the ones digit. 0, 2, 4, 6 and 8 make an even number. An even number can be shared into pairs with none left over.");
  };
  const sign = (): Question => {
    const a = randInt(101, 999);
    const b = chance(0.2) ? a : Math.max(101, Math.min(999, a + pick([-1, 1]) * randInt(1, 120)));
    const answer = a < b ? "<" : a > b ? ">" : "=";
    return textChoice("Which sign goes in the box?", answer, ["<", ">", "="].filter((s) => s !== answer), "Compare the hundreds first, then the tens, then the ones. The open side of < or > faces the bigger number.", eq(`${a} ☐ ${b}`));
  };
  const benchmark = (): Question => {
    const h = randInt(1, 8);
    let r = randInt(1, 99);
    if (r === 50) r = 49;
    const n = h * 100 + r;
    const near = r < 50 ? h * 100 : (h + 1) * 100;
    const far = r < 50 ? (h + 1) * 100 : h * 100;
    return textChoice(`Is ${n} closer to ${h * 100} or ${(h + 1) * 100}?`, String(near), [String(far)], `Halfway between ${h * 100} and ${(h + 1) * 100} is ${h * 100 + 50}. ${n} is ${r < 50 ? "less" : "more"} than that.`, undefined);
  };
  const makers = d === 1 ? [read, read, build, skip, skip, moreLess, sign, evenOdd] : [read, build, worth, skip, moreLess, sign, benchmark, pick([evenOdd, worth, benchmark])];
  return buildSet(makers);
}

// ---------- Unit fractions ----------

const FRACTION_NAMES: Record<number, string> = { 2: "half", 3: "third", 4: "fourth", 5: "fifth", 6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth" };

function unitFractions(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const maxDen = d === 1 ? 4 : d === 2 ? 8 : 10;
  const den = () => randInt(2, maxDen);
  const shape = () => pick(["bar", "circle"] as const);
  const fractionLabels = (n: number, dd: number): string[] => {
    // Wrong answers keep the shaded count or the number of parts of the right one, so they look believable.
    const out = new Set<string>();
    const wrong = shuffle([`${n}/${dd + 1}`, `${n + 1}/${dd}`, `${Math.max(1, n - 1)}/${dd}`, `${n}/${Math.max(2, dd - 1)}`, `${dd}/${n + dd}`]);
    for (const w of wrong) if (w !== `${n}/${dd}` && !out.has(w)) out.add(w);
    return [...out].slice(0, 2);
  };
  const shaded = (): Question => {
    const dd = den();
    const n = d === 1 ? 1 : randInt(1, dd - 1);
    return textChoice("What fraction of the shape is shaded?", `${n}/${dd}`, fractionLabels(n, dd), `Count all the equal parts: ${dd}. Then count the shaded ones: ${n}.`, { type: "fraction", numerator: n, denominator: dd, shape: shape() });
  };
  const parts = (): Question => {
    const dd = den();
    return textChoice(`1/${dd} means one of how many equal parts?`, String(dd), [String(dd + 1), String(dd - 1 < 2 ? dd + 2 : dd - 1)], `The bottom number tells how many equal parts make the whole.`, { type: "fraction", numerator: 1, denominator: dd, shape: shape() });
  };
  const bigger = (): Question => {
    const a = den();
    let b = den();
    while (a === b) b = den();
    const fewer = Math.min(a, b);
    return textChoice(`Which is the bigger piece: 1/${a} or 1/${b}?`, `1/${fewer}`, [`1/${fewer === a ? b : a}`], "The same whole cut into fewer equal parts gives bigger parts.");
  };
  const word = (): Question => {
    const dd = randInt(2, Math.min(maxDen, 8));
    const name = (n: number) => FRACTION_NAMES[n];
    const others = Object.keys(FRACTION_NAMES).map(Number).filter((n) => n !== dd && n <= 8);
    const wrong = sample(others, 2);
    return textChoice(`Which fraction is one ${name(dd)}?`, `1/${dd}`, wrong.map((w) => `1/${w}`), `One ${name(dd)} is 1 of ${dd} equal parts.`);
  };
  const whole = (): Question => {
    const dd = den();
    return textChoice(`A pizza is cut into ${dd} equal slices. What fraction is one slice?`, `1/${dd}`, [`1/${dd + 1}`, `${dd}/1`], "One slice is one of the equal parts.", { type: "emoji", emoji: "🍕" });
  };
  const equalParts = (): Question =>
    textChoice(
      "Which shape is cut into equal parts?",
      "a square cut into 4 parts that are all the same size",
      ["a square cut into 4 parts of different sizes", "a square with no lines"],
      "Fractions need equal parts: every part is the same size.",
      { type: "emoji", emoji: "✂️" },
    );
  const left = (): Question => {
    const dd = randInt(3, maxDen);
    const n = randInt(1, dd - 1);
    return textChoice(`${n}/${dd} of a bar is shaded. What fraction is NOT shaded?`, `${dd - n}/${dd}`, fractionLabels(dd - n, dd), `${dd} parts in all, and ${n} are shaded. The rest are ${dd - n}.`, { type: "fraction", numerator: n, denominator: dd, shape: "bar" });
  };
  return buildSet(d === 1 ? [shaded, shaded, parts, bigger, word, whole, equalParts, shaded] : [shaded, shaded, parts, bigger, word, whole, left, pick([equalParts, left])]);
}

// ---------- Slides, flips and turns ----------

const MOVES_SORT = {
  prompt: "Is it a slide, a flip or a turn? Tap an item, then tap its basket.",
  hint: "A slide moves a shape along without turning it. A flip makes a mirror image. A turn spins it around a point.",
  bins: [
    { id: "slide", label: "slide", emoji: "➡️" },
    { id: "flip", label: "flip", emoji: "🪞" },
    { id: "turn", label: "turn", emoji: "🔄" },
  ],
  items: [
    { label: "pushing a puzzle piece across the table", emoji: "🧩", bin: "slide" },
    { label: "a sled sliding straight down a hill", emoji: "🛷", bin: "slide" },
    { label: "a drawer pulled straight out", emoji: "🗄️", bin: "slide" },
    { label: "a pancake flipped over", emoji: "🥞", bin: "flip" },
    { label: "your face in a mirror", emoji: "🪞", bin: "flip" },
    { label: "turning a book over like a page", emoji: "📖", bin: "flip" },
    { label: "the hands of a clock going round", emoji: "🕒", bin: "turn" },
    { label: "a doorknob being twisted", emoji: "🚪", bin: "turn" },
    { label: "a playground roundabout spinning", emoji: "🎠", bin: "turn" },
  ],
};

const MOVES: Item[] = [
  q("A shape moves along a line to a new spot. It does not turn or flip. This is a…", "slide", ["flip", "turn"], "A slide is also called a translation. The shape looks the same, just in a new place."),
  q("A shape is flipped over a line, like a mirror image. This is a…", "flip", ["slide", "turn"], "A flip is also called a reflection."),
  q("A shape spins around a point. This is a…", "turn", ["slide", "flip"], "A turn is also called a rotation."),
  q("Another word for a slide is a…", "translation", ["reflection", "rotation"], "Translation means moving a shape without turning it or flipping it.", { d: 2 }),
  q("Another word for a flip is a…", "reflection", ["translation", "rotation"], "A reflection is a mirror image.", { d: 2 }),
  q("Another word for a turn is a…", "rotation", ["translation", "reflection"], "A rotation spins a shape around a point.", { d: 2 }),
  q("When you slide a shape, does its size change?", "No", ["Yes, it gets bigger", "Yes, it gets smaller"], "Slides, flips and turns only change where the shape is, not how big it is."),
  q("When you flip a shape, does its size change?", "No", ["Yes, it gets bigger", "Yes, it gets smaller"], "A flipped shape is the same size. It faces the other way."),
  q("Which one makes a mirror image of a triangle?", "a flip", ["a slide", "a turn"], "A flip across a line gives a mirror image.", { d: 2 }),
  q("A tile moves 3 squares to the right on a grid. This is a…", "slide", ["flip", "turn"], "It moved along without turning or flipping.", { d: 2 }),
  q("A game piece spins a quarter turn around its centre. This is a…", "turn", ["slide", "flip"], "It stays in the same place and spins.", { d: 2 }),
  q("You look at a butterfly's two wings. One wing looks like a flip of the other. This is…", "a mirror image", ["a slide", "a turn"], "The two sides match like a reflection.", { d: 3 }),
  q("A car on a straight road drives forward. The movement is most like a…", "slide", ["flip", "turn"], "It moves along without turning.", { d: 2 }),
  q("A skater spins on the ice in one spot. The movement is most like a…", "turn", ["slide", "flip"], "Spinning around a point is a turn.", { d: 2 }),
  q("You use a stamp to print a picture, then print it again beside the first. The second print is a…", "slide of the first", ["flip of the first", "turn of the first"], "The stamp moved over and was not turned.", { d: 3 }),
  q("After a full turn, a shape faces…", "the same way it started", ["the opposite way", "sideways"], "A full turn goes all the way around.", { d: 3 }),
];

// ---------- Time ----------

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function timeUnits(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const daysLater = (): Question => {
    const start = randInt(0, 4);
    const gap = randInt(1, d === 1 ? 2 : 3);
    const target = start + gap;
    return numQ(`The class trip is on ${DAYS[target]}. Today is ${DAYS[start]}. How many days until the trip?`, gap, "Count the days one at a time, starting with tomorrow.", undefined, 7, 1);
  };
  const dayAfter = (): Question => {
    const i = randInt(0, 6);
    const answer = DAYS[(i + 1) % 7];
    return textChoice(`Which day comes after ${DAYS[i]}?`, answer, others(DAYS, answer, 2), "Say the days of the week in order.");
  };
  const monthAfter = (): Question => {
    const i = randInt(0, 11);
    const answer = MONTHS[(i + 1) % 12];
    return textChoice(`Which month comes right after ${MONTHS[i]}?`, answer, others(MONTHS, answer, 2), "Say the months in order. There are 12 of them in a year.");
  };
  const howMany = (): Question => {
    const facts: { prompt: string; answer: number; hint: string }[] = [
      { prompt: "How many days are in one week?", answer: 7, hint: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday." },
      { prompt: "How many months are in one year?", answer: 12, hint: "January to December makes 12 months." },
      { prompt: "How many weeks are in a month, about?", answer: 4, hint: "A month is a bit more than 4 weeks." },
      { prompt: "How many minutes are in one hour?", answer: 60, hint: "A clock's minute hand goes all the way around in one hour: 60 minutes." },
    ];
    const f = pick(facts);
    const choices = f.answer === 60 ? [60, 100, 30] : f.answer === 12 ? [12, 10, 7] : f.answer === 7 ? [7, 5, 10] : [4, 2, 7];
    return textChoice(f.prompt, String(f.answer), choices.filter((c) => c !== f.answer).map(String), f.hint);
  };
  const longer = (): Question => {
    const pairs: [string, string, string][] = [
      ["a week", "a day", "A week has 7 days."],
      ["a month", "a week", "A month has about 4 weeks."],
      ["a year", "a month", "A year has 12 months."],
      ["an hour", "a minute", "An hour has 60 minutes."],
      ["a day", "an hour", "A day has 24 hours."],
    ];
    const [big, small, hint] = pick(pairs);
    const askLonger = chance(0.5);
    return textChoice(`Which is ${askLonger ? "longer" : "shorter"}: ${big} or ${small}?`, askLonger ? big : small, [askLonger ? small : big], hint);
  };
  const bestUnit = (): Question => {
    const cases: [string, string, string][] = [
      ["how long it takes to brush your teeth", "minutes", "It takes a few minutes, not days."],
      ["how long it takes a bean seed to sprout", "days", "Seeds take days, not minutes."],
      ["how long a summer holiday lasts", "weeks", "A summer holiday is many weeks."],
      ["how old your grandmother is", "years", "Age is counted in years."],
      ["how long it takes to eat a snack", "minutes", "A snack takes minutes."],
      ["how long it takes a baby tooth to grow in", "months", "Teeth take months to grow in."],
    ];
    const [what, unit, hint] = pick(cases);
    return textChoice(`Which unit is best for ${what}?`, unit, others(["minutes", "days", "weeks", "months", "years"], unit, 2), hint);
  };
  const longerEvent = (): Question => {
    const pairs: [string, string][] = [
      ["a movie", "a song"],
      ["a school day", "a recess"],
      ["a winter holiday", "a weekend"],
      ["getting dressed", "a bus trip across a province"],
    ];
    const [big, small] = pick(pairs);
    const askLonger = chance(0.5);
    const longerOne = big;
    return textChoice(`Which takes ${askLonger ? "longer" : "less time"}: ${big} or ${small}?`, askLonger ? longerOne : small, [askLonger ? small : longerOne], "Think about how long each one lasts.");
  };
  const makers = d === 1 ? [daysLater, dayAfter, monthAfter, howMany, longer, bestUnit, longerEvent, howMany] : [daysLater, daysLater, monthAfter, howMany, longer, bestUnit, longerEvent, pick([dayAfter, howMany, bestUnit])];
  return buildSet(makers);
}

function others<T>(pool: readonly T[], right: T, n: number): T[] {
  return sample(pool.filter((x) => x !== right), n);
}

export const units: Unit[] = [
  {
    id: "numbers-to-1000-ab",
    title: "Numbers to 1000",
    emoji: "💯",
    blurb: "Hundreds, tens and ones",
    standards: ab("2N1.1, 2N1.2, 2N1.3, 2N1.4, 2N1.5", "numbers to 1000: place value, counting by 10s and 100s, even and odd, estimating and comparing"),
    parentNote: "Reading and building numbers up to 1000 with hundreds, tens and ones, counting forwards and backwards by 10s and 100s, even and odd numbers, estimating with 100s as benchmarks, and comparing with <, > and =.",
    generate: numbersTo1000,
  },
  {
    id: "unit-fractions-ab",
    title: "Fractions of a Whole",
    emoji: "🍕",
    blurb: "Equal parts: halves, thirds, fourths and more",
    standards: ab("2N3.1", "unit fractions with 10 or fewer equal parts, and how many parts of the whole are shaded"),
    parentNote: "A fraction names equal parts of one whole. Children read unit fractions such as 1/4 and 1/8, learn that more equal parts means smaller parts, and name fractions like 3/4 from a picture. All wholes are cut into 10 or fewer equal parts.",
    generate: unitFractions,
  },
  {
    id: "slides-flips-turns-ab",
    title: "Slides, Flips and Turns",
    emoji: "🔄",
    blurb: "How shapes can move",
    standards: ab("2G1.2", "translations (slides), reflections (flips) and rotations (turns) of shapes"),
    parentNote: "Moving a shape by sliding it, flipping it over a line or turning it around a point. The shape stays the same size and form; only its position or direction changes.",
    generate: unitOf(MOVES, [sorter(MOVES_SORT)]),
  },
  {
    id: "time-ab",
    title: "Days, Weeks, Months and Years",
    emoji: "📅",
    blurb: "How long things take",
    standards: ab("2T1.1, 2T1.2", "how long events last and how many days, weeks, months, years and minutes make longer times"),
    parentNote: "Comparing how long things take, counting days until an event, and knowing that 7 days make a week, about 4 weeks a month, 12 months a year and 60 minutes an hour.",
    generate: timeUnits,
  },
];
