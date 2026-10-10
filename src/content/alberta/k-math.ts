import { numberChoice, pick, randInt, sample, textChoice } from "../random";
import type { Question, Unit } from "../types";
import { order, q, unitOf, type Item } from "../ontario/k-g2-kit";
import { ab, buildSet, levelOf } from "./kit";

// Alberta Kindergarten mathematics (KN, KG, KM, KP, KT). Most units are shared with BC and Ontario (see k.ts);
// these two cover outcomes the others do not: seeing small quantities at a glance and the sequence of events.

// ---------- See It Fast (subitizing to 5) ----------

const DOTS = ["🔵", "🟢", "🟡", "🟣", "🔴", "⭐"];
const dotsLabel = (n: number, emoji: string) => emoji.repeat(n);

function seeItFast(opts?: { difficulty?: 1 | 2 | 3 }): Question[] {
  const d = levelOf(opts);
  const hi = d === 1 ? 3 : 5;
  const glance = (): Question => {
    const n = randInt(1, hi);
    const em = pick(DOTS);
    return numberChoice("How many? Try not to count one by one.", n, "Small groups are easy to see all at once. Look for 2s and 3s.", { type: "dots", count: n, emoji: em }, { min: 1, max: 6 });
  };
  const which = (): Question => {
    const n = randInt(2, hi);
    const em = pick(DOTS);
    const others = sample([1, 2, 3, 4, 5].filter((x) => x !== n && Math.abs(x - n) >= 1), 2);
    const q = textChoice(`Which group has ${n}? Look fast.`, dotsLabel(n, em), others.map((x) => dotsLabel(x, em)), "Look at the whole group. You can see 2 and 3 without counting.");
    q.speak = `Which group has ${n}? Look fast.`;
    return q;
  };
  const together = (): Question => {
    const a = randInt(1, 3);
    const b = randInt(1, Math.min(3, 5 - a));
    const em = pick(DOTS);
    return numberChoice(`${a} and ${b} together. How many?`, a + b, "Put the two small groups together and say how many in all.", { type: "equation", text: `${dotsLabel(a, em)}   ${dotsLabel(b, em)}` }, { min: 1, max: 6 });
  };
  const matchNumber = (): Question => {
    const n = randInt(1, hi);
    const em = pick(DOTS);
    const q = numberChoice(`Which number matches ${dotsLabel(n, em)}?`, n, "Look at the group, then pick the number that says how many.", undefined, { min: 1, max: 6 });
    q.speak = `Which number matches this group of ${n}?`;
    return q;
  };
  return buildSet([glance, glance, glance, which, which, together, matchNumber, glance]);
}

// ---------- First, Next, Today ----------

const TIME: Item[] = [
  q("You put on your shoes. What do you do first?", "put on socks", ["go outside", "tie a bow"], "Socks go on before shoes. First socks, next shoes.", { emoji: "🧦" }),
  q("You plant a seed. What happens next?", "it sprouts", ["it is a tree already", "it turns into a rock"], "First a seed, next a sprout, then a plant.", { emoji: "🌱" }),
  q("You brush your teeth. When do you do this?", "in the morning and at bedtime", ["only on holidays", "only in the park"], "We brush our teeth every day.", { emoji: "🪥" }),
  q("What do you do first at lunch?", "wash your hands", ["throw away your food", "go to bed"], "First we wash our hands, next we eat.", { emoji: "🧼" }),
  q("The sun comes up. Is it morning or night?", "morning", ["night", "bedtime"], "When the sun comes up, a new day begins in the morning.", { emoji: "🌅" }),
  q("You see the Moon and stars. Is it day or night?", "night", ["day", "lunchtime"], "Stars and the Moon show at night.", { emoji: "🌙" }),
  q("Today is Monday. What day is tomorrow?", "Tuesday", ["Sunday", "Friday"], "Tomorrow is the day after today. After Monday comes Tuesday.", { d: 2 }),
  q("Today is Wednesday. What day was yesterday?", "Tuesday", ["Thursday", "Saturday"], "Yesterday is the day before today. Before Wednesday is Tuesday.", { d: 2 }),
  q("Today is Friday. What day is tomorrow?", "Saturday", ["Thursday", "Monday"], "Tomorrow is the next day. After Friday comes Saturday.", { d: 2 }),
  q("Which one happened yesterday?", "the day before today", ["the day after today", "later today"], "Yesterday is the day before today.", { d: 2 }),
  q("Which one will happen tomorrow?", "the next day after today", ["the day before today", "right now"], "Tomorrow is the day after today.", { d: 2 }),
  q("A snowman is built, then the sun shines all day. What comes last?", "it melts", ["it grows taller", "it gets a bigger scarf"], "First we build, next the sun shines, last it melts.", { emoji: "⛄", d: 3 }),
  q("A baker mixes, bakes and then…", "eats the bread", ["makes the flour", "buys the oven"], "First mix, next bake, last eat.", { emoji: "🍞", d: 3 }),
  q("Rin drew a picture, then showed it to the class. What came first?", "drawing the picture", ["showing the class", "going home"], "First means before the other things.", { d: 3 }),
  q("Today is Thursday. What day is tomorrow?", "Friday", ["Wednesday", "Monday"], "Tomorrow is the day after today. After Thursday comes Friday.", { d: 2 }),
  q("Today is Sunday. What day was yesterday?", "Saturday", ["Monday", "Friday"], "Yesterday is the day before today. Before Sunday is Saturday.", { d: 2 }),
  q("Today is Tuesday. What day was yesterday?", "Monday", ["Wednesday", "Friday"], "Yesterday is the day before today. Before Tuesday is Monday.", { d: 2 }),
  q("Today is Saturday. What day is tomorrow?", "Sunday", ["Friday", "Monday"], "Tomorrow is the next day. After Saturday comes Sunday.", { d: 2 }),
  q("You go to bed. What do you do just before?", "put on pyjamas", ["eat breakfast", "go to school"], "Bedtime comes at the end of the day.", { emoji: "🛏️" }),
  q("You read a book. What do you do first?", "open the book", ["close the book", "put it away"], "You open a book before you read it.", { emoji: "📖" }),
  q("Which happens last in a day?", "bedtime", ["waking up", "breakfast"], "A day starts with waking up and ends with bedtime.", { emoji: "🌙" }),
  q("Which happens first in a day?", "waking up", ["bedtime", "a night snack"], "A day starts with waking up.", { emoji: "⏰" }),
  q("You paint a picture. What do you do first?", "get your paints", ["hang it up", "say all done"], "First we get ready, next we paint, last we show it.", { emoji: "🎨" }),
  q("A caterpillar becomes a butterfly. What comes next?", "it makes a chrysalis", ["it hatches from an egg", "it flies right away"], "First an egg, next a caterpillar, then a chrysalis, then a butterfly.", { emoji: "🐛", d: 3 }),
  q("Yesterday it rained. Did the rain happen now or before?", "before", ["later", "right now"], "Yesterday is the day before today.", { d: 2 }),
  q("Tomorrow is your party. Has it happened yet?", "not yet", ["yes, it is done", "it is happening now"], "Tomorrow has not come yet.", { emoji: "🎈", d: 2 }),
  q("Which word means the day we are in right now?", "today", ["yesterday", "tomorrow"], "Today is now. Yesterday was before. Tomorrow is next."),
  q("You put on a coat, then play in the snow. What came first?", "putting on the coat", ["playing in the snow", "going back inside"], "First means before the other things.", { emoji: "🧥", d: 3 }),
];

const HANDS = order("Wash your hands. Tap the pictures in order.", "Turn on the water first, then soap, then dry.", [
  ["turn on the water", "🚰"],
  ["rub with soap", "🧼"],
  ["dry your hands", "🧻"],
]);

const CHICK = order("A chick grows up. Tap the pictures in order.", "First an egg, next a chick, last a hen.", [
  ["egg", "🥚"],
  ["chick", "🐥"],
  ["hen", "🐔"],
]);

const MORNING = order("Put the morning in order: first, next, last.", "Think about what you do when you wake up.", [
  ["wake up", "⏰"],
  ["eat breakfast", "🥣"],
  ["go to school", "🚌"],
]);

const GROW = order("A seed grows. Tap the pictures in order.", "First a seed, next a sprout, last a flower.", [
  ["seed", "🌰"],
  ["sprout", "🌱"],
  ["flower", "🌻"],
]);

export const units: Unit[] = [
  {
    id: "see-it-fast-ab",
    title: "See It Fast",
    emoji: "👀",
    blurb: "How many? Look and know",
    standards: ab("KN1.3", "seeing small quantities to 5 at a glance without counting one by one (subitizing)"),
    parentNote: "Subitizing means knowing how many are in a small group without counting. Practise with dice, dominoes and fingers: show a number and ask how many.",
    generate: seeItFast,
  },
  {
    id: "first-next-today-ab",
    title: "First, Next, Today",
    emoji: "📅",
    blurb: "Before, after and the days",
    standards: ab("KT1.1", "putting events in order, and using first, next, today, yesterday and tomorrow"),
    parentNote: "Talk about the order of things at home: what you do first, next and last, and what happened yesterday or will happen tomorrow.",
    generate: unitOf(TIME, [MORNING, GROW, HANDS, CHICK]),
  },
];
