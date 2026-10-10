import { COIN_NAMES } from "../money";
import { numberChoice, pick, randInt, sample, shuffle, textChoice } from "../random";
import type { Course, Question } from "../types";
import { K_LANGUAGE, K_MATH } from "./overall";
import { K_SCIENCE, K_SOCIAL } from "./k-overall-ss";
import { units as scienceUnits } from "./k-science";
import { units as socialUnits } from "./k-social";
import { buildSet, levelOf, on, THINGS, times } from "./kit";

// Ontario Kindergarten (the Kindergarten Curriculum, 2026). Most of the maths and the
// early-reading units are the same lessons BC children use; they are listed under `shares`
// with the Ontario expectations they practise. The units written here are Ontario's own.

// ---------- Math: Numbers to 20 ----------

function numbersTo20(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  const d = levelOf(opts);
  const hi = [10, 15, 20][d - 1];
  const countDots = (): Question => {
    const t = pick(THINGS);
    const n = randInt(Math.max(3, hi - 8), hi);
    const q = numberChoice(`How many ${t.emoji}?`, n, n > 10 ? "Touch each one as you count. Keep going past 10!" : "Touch each one as you count. Say the numbers out loud!", { type: "dots", count: n, emoji: t.emoji }, { min: 0, max: 20 });
    q.speak = `How many ${t.word}?`;
    return q;
  };
  const subitize = (): Question => {
    const n = randInt(1, 5);
    return numberChoice("How many dots? Try not to count them one by one.", n, "Small groups of dots are easy to see all at once. Look for 2s and 3s.", { type: "dots", count: n, emoji: "🔵" }, { min: 1, max: 6 });
  };
  const next = (): Question => {
    const n = randInt(1, hi - 1);
    return numberChoice(`Count forward. What comes after ${n}?`, n + 1, "When we count forward, the number gets bigger by 1.", { type: "numberLine", min: Math.max(0, n - 4), max: Math.min(20, n + 4), step: 1, blankAt: n + 1, marks: [n] }, { min: 0, max: 20 });
  };
  const back = (): Question => {
    const n = randInt(2, hi);
    return numberChoice(`Count backward. What comes before ${n}?`, n - 1, "When we count backward, the number gets smaller by 1.", { type: "numberLine", min: Math.max(0, n - 4), max: Math.min(20, n + 4), step: 1, blankAt: n - 1, marks: [n] }, { min: 0, max: 20 });
  };
  const startAnywhere = (): Question => {
    const n = randInt(1, hi - 3);
    return numberChoice(`Start at ${n}. Count on 3 more. Where do you stop?`, n + 3, "Say the number you start on, then hop forward one number at a time.", { type: "numberLine", min: Math.max(0, n - 1), max: Math.min(20, n + 5), step: 1, marks: [n] }, { min: 0, max: 20 });
  };
  const compare = (): Question => {
    const a = randInt(1, hi);
    let b = randInt(1, hi);
    while (b === a) b = randInt(1, hi);
    const more = chooseMore();
    return textChoice(`Which number is ${more ? "more" : "less"}?`, String(more ? Math.max(a, b) : Math.min(a, b)), [String(more ? Math.min(a, b) : Math.max(a, b))], "Think about counting: the number you say later is more.", { type: "equation", text: `${a}   ${b}` });
  };
  const oneMore = (): Question => {
    const n = randInt(1, hi - 1);
    const more = chooseMore();
    const base = more ? n : n + 1;
    return numberChoice(`What is 1 ${more ? "more" : "less"} than ${base}?`, more ? base + 1 : base - 1, more ? "One more means the next number when we count forward." : "One less means the number just before when we count backward.", { type: "dots", count: base, emoji: "🔵" }, { min: 0, max: 20 });
  };
  const tenFrame = (): Question => {
    const n = randInt(11, hi);
    return numberChoice("How many dots are there?", n, "A full ten frame is 10. Count the rest on from 10.", { type: "tenFrame", filled: 10, extra: n - 10 }, { min: 8, max: 20 });
  };
  const extra: (() => Question)[] = [startAnywhere, hi > 10 ? tenFrame : subitize];
  return buildSet([...times(2, countDots), subitize, next, back, compare, oneMore, pick(extra)]);
}

function chooseMore(): boolean {
  return randInt(0, 1) === 1;
}

// ---------- Math: Coins and bills ----------

const COIN_VALUE_HINT: Record<number, string> = {
  5: "A nickel is worth 5 cents. It is silver and has a beaver on it.",
  10: "A dime is the smallest coin, but it is worth 10 cents.",
  25: "A quarter is worth 25 cents. It is a big silver coin.",
  100: "A loonie is gold with 11 sides. It is worth 1 dollar, or 100 cents.",
  200: "A toonie has two colours. It is worth 2 dollars.",
  500: "The blue bill is worth 5 dollars.",
  1000: "The purple bill is worth 10 dollars.",
};

const coinValue = (c: number) => (c >= 100 ? `$${c / 100}` : `${c}¢`);

function coinsAndBills(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  const d = levelOf(opts);
  const small = [5, 10, 25];
  const dollars = [100, 200, 500, 1000];
  const pool = d === 1 ? small : d === 2 ? [...small, 100, 200] : [...small, ...dollars];
  const worth = (): Question => {
    const c = pick(pool);
    const others = sample(pool.filter((x) => x !== c), 2);
    return textChoice("What is this worth?", coinValue(c), others.map(coinValue), COIN_VALUE_HINT[c], { type: "coins", coins: [c] });
  };
  const whichWorth = (): Question => {
    const c = pick(pool);
    const others = sample(pool.filter((x) => x !== c), 2);
    return textChoice(`Which one is worth ${coinValue(c)}?`, { label: COIN_NAMES[c], coin: c }, others.map((o) => ({ label: COIN_NAMES[o], coin: o })), COIN_VALUE_HINT[c]);
  };
  const worthMore = (): Question => {
    const [a, b] = sample(pool, 2);
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    return textChoice("Which one is worth more?", { label: COIN_NAMES[hi], coin: hi }, [{ label: COIN_NAMES[lo], coin: lo }], "Bigger coins are not always worth more. A dime is smaller than a nickel but worth more.");
  };
  const most = (): Question => {
    const three = sample(pool, 3).sort((x, y) => y - x);
    return textChoice("Which one is worth the most?", { label: COIN_NAMES[three[0]], coin: three[0] }, three.slice(1).map((c) => ({ label: COIN_NAMES[c], coin: c })), "Think about how many cents or dollars each one is worth.");
  };
  const roleplay = (): Question => {
    const price = pick([5, 10, 25]);
    return textChoice(`A sticker costs ${price}¢. Which coin pays for it?`, { label: COIN_NAMES[price], coin: price }, sample(small.filter((x) => x !== price), 2).map((c) => ({ label: COIN_NAMES[c], coin: c })), "Find the coin that is worth exactly the price.");
  };
  return buildSet([worth, worth, whichWorth, whichWorth, worthMore, most, roleplay, d === 1 ? worth : whichWorth]);
}

// ---------- Language: Build a word ----------

const CVC: { word: string; emoji: string }[] = [
  { word: "cat", emoji: "🐱" },
  { word: "dog", emoji: "🐶" },
  { word: "sun", emoji: "☀️" },
  { word: "bus", emoji: "🚌" },
  { word: "pig", emoji: "🐷" },
  { word: "bed", emoji: "🛏️" },
  { word: "fox", emoji: "🦊" },
  { word: "hen", emoji: "🐔" },
  { word: "van", emoji: "🚐" },
  { word: "web", emoji: "🕸️" },
  { word: "mop", emoji: "🧹" },
  { word: "bat", emoji: "🦇" },
  { word: "bug", emoji: "🐛" },
  { word: "log", emoji: "🪵" },
  { word: "hat", emoji: "🎩" },
];

const spell = (w: string) => w.split("").join(" – ");

const SOUND_COUNT: { word: string; n: number }[] = [
  { word: "at", n: 2 },
  { word: "up", n: 2 },
  { word: "go", n: 2 },
  { word: "me", n: 2 },
  { word: "sun", n: 3 },
  { word: "cat", n: 3 },
  { word: "bed", n: 3 },
  { word: "ship", n: 3 },
  { word: "frog", n: 4 },
  { word: "jump", n: 4 },
  { word: "stop", n: 4 },
  { word: "flag", n: 4 },
];

function blendAWord(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  const d = levelOf(opts);
  const blend = (): Question => {
    const [w, ...others] = sample(CVC, 3);
    const q = textChoice(
      `Blend the sounds: ${spell(w.word)}. Which word is it?`,
      { label: w.word, emoji: w.emoji },
      others.map((o) => ({ label: o.word, emoji: o.emoji })),
      `Say each sound slowly, then push them together: ${w.word}.`,
    );
    q.speak = `Blend the sounds ${spell(w.word)}. Which word is it?`;
    return q;
  };
  const firstSound = (): Question => {
    const w = pick(CVC);
    const others = sample(CVC.filter((o) => o.word[0] !== w.word[0]), 2);
    return textChoice(
      `Which word begins with “${w.word[0]}”?`,
      { label: w.word, emoji: w.emoji },
      others.map((o) => ({ label: o.word, emoji: o.emoji })),
      `Say each word out loud. Listen for the first sound: ${w.word[0]}.`,
    );
  };
  const count = (): Question => {
    const s = pick(SOUND_COUNT.filter((x) => d > 1 || x.n < 4));
    const options = shuffle([2, 3, 4].filter((n) => n !== s.n)).slice(0, 2);
    return textChoice(`How many sounds do you hear in “${s.word}”?`, String(s.n), options.map(String), `Say the word slowly and tap once for each sound: ${s.word}.`);
  };
  return buildSet([...times(3, blend), ...times(2, firstSound), ...times(3, count)].slice(0, 8));
}

// ---------- Courses ----------

export const courses: Course[] = [
  {
    grade: "k",
    subject: "math",
    bigIdeas: { "ca-on": K_MATH },
    units: [
      {
        id: "numbers-to-20",
        title: "Numbers to 20",
        emoji: "🔢",
        blurb: "Count, read and compare numbers",
        standards: on("A6.2–A6.4, A6.7, A6.8, A6.10", "counting forward and back, reading numbers to 20, and comparing them"),
        parentNote: "Counting to 20 forward and back from any number, recognizing small groups at a glance, and comparing two numbers.",
        generate: numbersTo20,
      },
      {
        id: "coins-and-bills",
        title: "Coins & Bills",
        emoji: "🪙",
        blurb: "How much is each one worth?",
        standards: on("A6.13", "the value of Canadian coins to 25¢ and of coins and bills to $10"),
        parentNote: "Knowing what a nickel, dime and quarter are worth, and what a loonie, toonie, $5 bill and $10 bill are worth.",
        generate: coinsAndBills,
      },
    ],
    shares: {
      "make-5-and-10": { standards: on("A6.5, A6.11", "composing and decomposing numbers to 10") },
      "add-and-take-away": { standards: on("A6.11, A6.12", "adding and taking away to 10 with objects") },
      "more-less-same": { standards: on("A6.6, A8.2, A8.3", "more, less and the same, and reading simple graphs") },
      patterns: { standards: on("A7.1–A7.4", "repeating patterns and their core") },
      "shapes-and-sizes": { standards: on("A9.1, A9.2, A10.1, A10.2", "2D shapes, 3D objects and comparing length, mass and capacity") },
      "likely-or-unlikely": { standards: on("A8.4", "how likely familiar events are") },
    },
    order: {
      "ca-on": ["numbers-to-20", "make-5-and-10", "add-and-take-away", "more-less-same", "patterns", "shapes-and-sizes", "coins-and-bills", "likely-or-unlikely"],
    },
  },
  {
    grade: "k",
    subject: "language",
    bigIdeas: { "ca-on": K_LANGUAGE },
    units: [
      {
        id: "blend-a-word",
        title: "Blend a Word",
        emoji: "🔤",
        blurb: "Push the sounds together",
        standards: on("A2.3–A2.5", "blending and segmenting sounds to read and spell simple words"),
        parentNote: "Listening for the sounds in a word, blending them to read it, and counting the sounds in words.",
        generate: blendAWord,
      },
    ],
    shares: {
      "letter-partners": { standards: on("A2.1, A2.4", "naming upper- and lowercase letters and the sounds they make") },
      "first-sounds": { standards: on("A2.3, A2.4", "hearing the first sound in a word and matching it to a letter") },
      "rhyme-time": { standards: on("A2.3", "hearing rhymes as part of phonological awareness") },
      "clap-the-beat": { standards: on("A2.3", "hearing the parts (syllables) in words") },
      "sight-words": { standards: on("A2.6", "reading simple sentences with explicitly taught words") },
      "story-order": { standards: on("A3.3, A3.5", "understanding a simple text and what happens next") },
      "book-detectives": { standards: on("A3.1, A3.4, A3.6", "why we read, and sharing thoughts and connections about books") },
      "picture-clues": { standards: on("A3.3, A3.5", "using pictures and what we know to understand and predict") },
    },
    order: {
      "ca-on": ["letter-partners", "first-sounds", "rhyme-time", "clap-the-beat", "blend-a-word", "sight-words", "story-order", "picture-clues", "book-detectives"],
    },
  },
  {
    grade: "k",
    subject: "science",
    bigIdeas: { "ca-on": K_SCIENCE },
    units: scienceUnits,
    shares: {
      "living-things-need": { standards: on("B13.2", "sorting and classifying living and non-living things") },
      "animal-features": { standards: on("B13.1, B13.2", "describing animals and plants and sorting them by what we observe") },
      materials: { standards: on("B12.3, B13.2", "describing and sorting materials and choosing them for a job") },
      "push-and-pull": { standards: on("B12.2", "making predictions and observations while exploring how things move") },
      "weather-and-seasons": { standards: on("B13.1, B13.3", "describing weather, seasons and day and night as natural occurrences and patterns") },
    },
    order: {
      "ca-on": ["be-a-scientist", "safe-scientists", "living-things-need", "animal-features", "natural-and-built", "materials", "push-and-pull", "weather-and-seasons", "build-and-test", "follow-the-steps"],
    },
  },
  {
    grade: "k",
    subject: "social",
    bigIdeas: { "ca-on": K_SOCIAL },
    units: socialUnits,
    shares: {
      "all-about-me": { standards: on("D19.3, D21.2", "sharing feelings and experiences, and acting with kindness") },
      families: { standards: on("D20.1, D20.3", "belonging to families and groups, and respecting how others do things") },
      "helpers-and-rules": { standards: on("D22.1, D22.2", "people and places in the community and what they do") },
    },
    order: {
      "ca-on": ["i-am-me", "all-about-me", "families", "we-belong", "fair-and-kind", "helpers-and-rules", "places-near-me", "caring-for-nature"],
    },
  },
];
