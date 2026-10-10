import { numberChoice, pick, randInt, sample, shuffle, textChoice } from "../random";
import type { BuildQuestion, ChoiceQuestion, OrderQuestion, Question, Unit } from "../types";
import { q, unitOf } from "../ontario/k-g2-kit";
import { ab, buildSet, levelOf, range, THINGS } from "./kit";

// Alberta Grade 1 mathematics (2022 K-6 curriculum). The units that BC and Ontario already have are shared in
// g1.ts; the four here cover what they don't: quantities to 100, counting patterns and subitizing, one half,
// and days and months.

const choice = (prompt: string, answer: number, hint: string, visual?: ChoiceQuestion["visual"], max = 100, min = 0): ChoiceQuestion =>
  numberChoice(prompt, answer, hint, visual, { min, max });

// ---------- Numbers to 100 ----------

function numbersTo100(opts?: Parameters<typeof levelOf>[0]): Question[] {
  const d = levelOf(opts);
  const lo = d === 1 ? 11 : 21;
  const hi = d === 1 ? 49 : d === 2 ? 79 : 99;
  const readBlocks = (): Question => {
    const n = randInt(lo, hi);
    return choice("What number is shown?", n, "Count the tens first, then the ones.", { type: "blocks", tens: Math.floor(n / 10), ones: n % 10 });
  };
  const build = (): BuildQuestion => {
    const target = randInt(lo, hi);
    return { kind: "build", prompt: `Build the number ${target}.`, hint: `${target} is ${Math.floor(target / 10)} tens and ${target % 10} ones.`, target };
  };
  const compare = (): Question => {
    const a = randInt(lo, hi);
    let b = randInt(lo, hi);
    while (b === a || Math.floor(b / 10) === Math.floor(a / 10)) b = randInt(lo, hi);
    const most = randInt(0, 1) === 1;
    const answer = most ? Math.max(a, b) : Math.min(a, b);
    const other = answer === a ? b : a;
    return textChoice(`Which number is ${most ? "greater" : "less"}: ${a} or ${b}?`, String(answer), [String(other)], "Look at the tens first. More tens means a bigger number.");
  };
  const partition = (): Question => {
    const n = randInt(lo, hi);
    const tens = Math.floor(n / 10);
    return choice(`${n} is ${tens} tens and how many ones?`, n % 10, "Take away the tens. What is left is the ones.", { type: "blocks", tens, ones: n % 10 }, 9);
  };
  const tensWords = (): Question => {
    const t = randInt(2, 9);
    return choice(`How many tens make ${t * 10}?`, t, "Count by 10s until you reach the number.", { type: "blocks", tens: t, ones: 0 }, 9, 1);
  };
  const nearTen = (): Question => {
    const n = randInt(lo, hi - 1);
    const dir = randInt(0, 1) === 1;
    const next = n + 1;
    const ans = dir ? next : n - 1;
    if (ans < 1 || ans > 99) return readBlocks();
    return choice(`What number comes ${dir ? "after" : "before"} ${n}?`, ans, dir ? "Count on one more." : "Count back one.", undefined, 99, 1);
  };
  const equalNot = (): Question => {
    const t = randInt(1, 7);
    const o = randInt(1, 9);
    const n = t * 10 + o;
    const same = randInt(0, 1) === 1;
    const text = same ? `${t} tens and ${o} ones` : `${t + 1} tens and ${o} ones`;
    return textChoice(`Is ${n} equal to ${text}?`, same ? "Yes, equal (=)" : "No, not equal (≠)", [same ? "No, not equal (≠)" : "Yes, equal (=)"], "Count the tens and the ones. Do both match?");
  };
  const ordering = (): OrderQuestion => {
    const nums = sample(range(lo, hi), 4).sort((a, b) => a - b);
    return { kind: "order", prompt: "Tap the numbers from smallest to biggest.", hint: `Start with the smallest number, ${nums[0]}.`, items: nums.map((n) => ({ id: String(n), label: String(n) })) };
  };
  return buildSet([readBlocks, readBlocks, build, compare, partition, tensWords, d === 1 ? nearTen : equalNot, ordering]);
}

export const numbersTo100Unit: Unit = {
  id: "numbers-to-100-ab",
  title: "Numbers to 100",
  emoji: "💯",
  blurb: "Tens, ones and big numbers!",
  parentNote: "Reading and building numbers to 100 with tens and ones, comparing them, and seeing that two names can mean the same amount.",
  standards: ab("1N1.1, 1N1.3, 1N1.5", "showing quantities to 100 with tens and ones, splitting numbers into parts, and telling equal from not equal"),
  generate: numbersTo100,
};

// ---------- Counting patterns ----------

function counting(opts?: Parameters<typeof levelOf>[0]): Question[] {
  const d = levelOf(opts);
  const missingSkip = (): Question => {
    const by = d === 1 ? pick([2, 10]) : pick([2, 5, 10]);
    const max = by === 2 ? 20 : 100;
    const len = max / by;
    const gap = randInt(2, Math.min(len - 1, 7));
    const seq = range(0, gap + 1).map((i) => i * by);
    const shown = seq.map((n, i) => (i === gap - 1 ? "☐" : String(n)));
    return choice(`Count by ${by}s. What number is missing?`, seq[gap - 1], `Each number is ${by} more than the one before it.`, { type: "equation", text: shown.join(", ") }, max);
  };
  const countOn = (): Question => {
    const start = randInt(1, d === 1 ? 20 : d === 2 ? 60 : 95);
    const shown = range(start, start + 2).map(String).concat("☐");
    return choice("Count on. What number comes next?", start + 3, "Counting on goes up by 1 each time.", { type: "equation", text: shown.join(", ") }, 100, 1);
  };
  const countBack = (): Question => {
    const start = randInt(5, 20);
    const shown = [start, start - 1, start - 2].map(String).concat("☐");
    return choice("Count back. What number comes next?", start - 3, "Counting back goes down by 1 each time.", { type: "equation", text: shown.join(", ") }, 20, 0);
  };
  const quickLook = (): Question => {
    const t = pick(THINGS);
    const n = randInt(3, d === 1 ? 6 : 10);
    const ques = choice(`Take a quick look. How many ${t.emoji}?`, n, "Look for small groups you know, like 2 and 3.", { type: "dots", count: n, emoji: t.emoji }, 10, 1);
    ques.speak = `Take a quick look. How many ${t.word}?`;
    return ques;
  };
  const skipEnd = (): Question => {
    const by = pick([5, 10]);
    const start = by * randInt(0, 3);
    const seq = range(0, 3).map((i) => start + by * i);
    return choice(`Count by ${by}s: ${seq.join(", ")}, ?`, start + by * 3, `Each number is ${by} more than the one before it.`, undefined, 100, 0);
  };
  const groups = (): Question => {
    const k = randInt(2, 6);
    return choice(`${k} bags with 10 each. Count by 10s. How many in all?`, k * 10, "Count by 10s: 10, 20, 30…", { type: "blocks", tens: k, ones: 0 }, 100, 10);
  };
  const twos = (): Question => {
    const n = randInt(2, 7);
    return choice(`${n} pairs of mittens. Count by 2s. How many mittens?`, n * 2, "Count by 2s: 2, 4, 6…", { type: "emoji", emoji: "🧤", caption: `${n} pairs` }, 20, 2);
  };
  return buildSet([missingSkip, missingSkip, countOn, countBack, quickLook, quickLook, d === 1 ? skipEnd : groups, d === 3 ? twos : skipEnd]);
}

export const countingUnit: Unit = {
  id: "counting-patterns-ab",
  title: "Count It Up",
  emoji: "🔢",
  blurb: "Count on, count back and skip count!",
  parentNote: "Counting forward within 100, back from 20, by 2s to 20, and by 5s and 10s to 100, plus seeing small amounts at a glance (subitizing).",
  standards: ab("1N1.2, 1N1.4", "counting forward within 100, back from 20, by 2s, 5s and 10s, and seeing how many at a glance"),
  generate: counting,
};

// ---------- One half ----------

const HALF_BANK = [
  q("Cut a sandwich into 2 equal parts. Each part is one…", "half", ["whole", "double"], "Two equal parts are called halves. Each one is a half.", { emoji: "🥪" }),
  q("Two halves put together make…", "one whole", ["two wholes", "nothing"], "Join 2 halves to get 1 whole.", { emoji: "🍕" }),
  q("Two friends share a pizza fairly. How many equal parts?", "2", ["1", "5"], "Sharing between 2 means 2 equal parts.", { emoji: "🍕" }),
  q("Is this a fair way to cut a pizza in half?", "Two equal parts", ["One big part and one tiny part", "Three parts"], "Halves must be the same size.", { emoji: "🍕", d: 2 }),
  q("Which words mean the same as “half”?", "one of two equal parts", ["one of five parts", "two wholes"], "Half means 1 of 2 equal parts.", { d: 2 }),
  q("You eat one half of a bun. How much is left?", "one half", ["the whole bun", "no bun"], "The bun was 2 halves. You ate 1, so 1 half is left.", { emoji: "🍞", d: 2 }),
  q("A sheet of paper is folded exactly in half. How many parts?", "2 equal parts", ["3 equal parts", "10 equal parts"], "Folding in half makes 2 equal parts.", { emoji: "📄" }),
  q("Which one can be shared fairly between 2 people with none left over?", "8 grapes", ["7 grapes", "9 grapes"], "Even numbers split into 2 equal groups.", { emoji: "🍇", d: 3 }),
  q("A ribbon is cut into 2 pieces. When are they halves?", "when both pieces are the same length", ["when one piece is longer", "when there are 3 pieces"], "Halves must be equal.", { emoji: "🎀", d: 3 }),
];

function shareFairly(opts?: Parameters<typeof levelOf>[0]): Question[] {
  const d = levelOf(opts);
  const share = (): Question => {
    const t = pick(THINGS.filter((x) => x.word !== "fish"));
    const each = randInt(2, d === 1 ? 5 : 10);
    const ques = choice(`${each * 2} ${t.emoji} are shared fairly by 2 friends. How many each?`, each, "Make 2 equal groups. Deal them out one at a time.", { type: "dots", count: each * 2, emoji: t.emoji }, 12, 1);
    ques.speak = `${each * 2} ${t.word} are shared fairly by 2 friends. How many each?`;
    return ques;
  };
  const halfOf = (): Question => {
    const n = pick([2, 4, 6, 8, 10, 12, 14, 16, 18, 20].filter((x) => (d === 1 ? x <= 10 : true)));
    return choice(`What is half of ${n}?`, n / 2, `Half of ${n} is the number you get when you split ${n} into 2 equal groups.`, undefined, 10, 1);
  };
  const shaded = (): Question =>
    textChoice("What part is shaded?", "one half", ["the whole thing", "none of it"], "The shape has 2 equal parts and 1 is shaded.", { type: "fraction", numerator: 1, denominator: 2, shape: pick(["circle", "bar"] as const) });
  const evenBin = (): Question => {
    const n = pick([5, 7, 9, 11, 13]);
    return textChoice(`${n} cookies are shared by 2 friends. How many are left over?`, "1", ["0", "2"], "Make 2 equal groups. One cookie cannot be shared fairly.", { type: "dots", count: n, emoji: "🍪" });
  };
  const bank = unitOf(HALF_BANK)({ difficulty: d }).slice(0, 3);
  return shuffle([shaded(), share(), share(), halfOf(), d === 1 ? share() : evenBin(), ...bank]);
}

export const halvesUnit: Unit = {
  id: "halves-ab",
  title: "One Half",
  emoji: "🍕",
  blurb: "Share fairly and find one half!",
  parentNote: "One half means 1 of 2 equal parts. Children share items fairly between two people and see that two halves make a whole.",
  standards: ab("1N3.1", "one half as one of two equal parts and fair sharing between two"),
  generate: shareFairly,
};

// ---------- Days and months ----------

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function daysAndMonths(opts?: Parameters<typeof levelOf>[0]): Question[] {
  const d = levelOf(opts);
  const afterDay = (): Question => {
    const i = randInt(0, 6);
    const ans = DAYS[(i + 1) % 7];
    return textChoice(`What day comes after ${DAYS[i]}?`, ans, sample(DAYS.filter((x) => x !== ans && x !== DAYS[i]), 2), "The days go in a circle: Sunday, Monday, Tuesday…");
  };
  const beforeDay = (): Question => {
    const i = randInt(0, 6);
    const ans = DAYS[(i + 6) % 7];
    return textChoice(`What day comes before ${DAYS[i]}?`, ans, sample(DAYS.filter((x) => x !== ans && x !== DAYS[i]), 2), "Think about the day just before.");
  };
  const tomorrow = (): Question => {
    const i = randInt(0, 6);
    const ans = DAYS[(i + 1) % 7];
    return textChoice(`Today is ${DAYS[i]}. What day is tomorrow?`, ans, sample(DAYS.filter((x) => x !== ans && x !== DAYS[i]), 2), "Tomorrow is the day after today.");
  };
  const yesterday = (): Question => {
    const i = randInt(0, 6);
    const ans = DAYS[(i + 6) % 7];
    return textChoice(`Today is ${DAYS[i]}. What day was yesterday?`, ans, sample(DAYS.filter((x) => x !== ans && x !== DAYS[i]), 2), "Yesterday is the day before today.");
  };
  const afterMonth = (): Question => {
    const i = randInt(0, 11);
    const ans = MONTHS[(i + 1) % 12];
    return textChoice(`What month comes after ${MONTHS[i]}?`, ans, sample(MONTHS.filter((x) => x !== ans && x !== MONTHS[i]), 2), "The months go in a circle. After December comes January.");
  };
  const beforeMonth = (): Question => {
    const i = randInt(0, 11);
    const ans = MONTHS[(i + 11) % 12];
    return textChoice(`What month comes before ${MONTHS[i]}?`, ans, sample(MONTHS.filter((x) => x !== ans && x !== MONTHS[i]), 2), "Think about the month just before.");
  };
  const counts = (): Question =>
    pick([
      textChoice("How many days are in one week?", "7", ["5", "10"], "Sunday to Saturday is 7 days."),
      textChoice("How many months are in one year?", "12", ["7", "10"], "January to December is 12 months."),
    ]);
  const dayOrder = (): OrderQuestion => {
    const start = randInt(0, 3);
    const items = DAYS.slice(start, start + 4);
    return { kind: "order", prompt: "Tap the days in order, first to last.", hint: `Start with ${items[0]}.`, items: items.map((n) => ({ id: n, label: n })) };
  };
  const monthOrder = (): OrderQuestion => {
    const start = randInt(0, 7);
    const items = MONTHS.slice(start, start + 4);
    return { kind: "order", prompt: "Tap the months in order, first to last.", hint: `Start with ${items[0]}.`, items: items.map((n) => ({ id: n, label: n })) };
  };
  return buildSet(
    d === 1
      ? [afterDay, tomorrow, yesterday, beforeDay, counts, dayOrder, afterMonth, counts]
      : d === 2
        ? [afterDay, tomorrow, yesterday, beforeDay, counts, dayOrder, monthOrder, afterMonth]
        : [afterDay, yesterday, counts, dayOrder, monthOrder, afterMonth, beforeMonth, beforeDay],
  );
}

export const daysUnit: Unit = {
  id: "days-and-months-ab",
  title: "Days & Months",
  emoji: "🗓️",
  blurb: "Today, tomorrow and all year round!",
  parentNote: "The days of the week and months of the year as cycles that start over, with words like yesterday, today and tomorrow.",
  standards: ab("1T1.1", "days of the week and months of the year as repeating cycles"),
  generate: daysAndMonths,
};

export const units: Unit[] = [numbersTo100Unit, countingUnit, halvesUnit, daysUnit];
