import { pick, sample, shuffle, textChoice } from "../random";
import type { OrderQuestion, Question, Unit } from "../types";
import { ab, buildSet } from "./kit";

// Alberta Grade 1 language arts. The phonics, reading and sentence units that BC and Ontario already have
// are shared in g1.ts; this unit covers putting ideas in order and building complete sentences.

const SENTENCES: string[][] = [
  ["The", "dog", "runs", "fast."],
  ["We", "like", "to", "sing."],
  ["My", "cat", "sleeps", "here."],
  ["Birds", "fly", "in", "the", "sky."],
  ["I", "can", "see", "a", "moose."],
  ["Zoe", "plays", "in", "the", "snow."],
  ["Our", "class", "reads", "a", "book."],
  ["Amir", "kicks", "the", "big", "ball."],
];

const STORIES: string[][] = [
  ["Maya plants a seed.", "The seed grows a sprout.", "Now it is a tall sunflower."],
  ["Sam puts on his coat.", "He walks out into the snow.", "He builds a snowman."],
  ["Ana mixes the batter.", "The cake bakes in the oven.", "Everyone eats a slice."],
  ["Jay finds a lost kitten.", "He gives it some milk.", "He finds its family."],
  ["The sun comes up.", "Leo eats breakfast.", "Leo walks to school."],
  ["Priya packs her bag.", "She rides the bus.", "She waves to her teacher."],
];

const JOINS: { first: string; second: string; right: string; wrong: string[] }[] = [
  { first: "I like apples.", second: "I like pears.", right: "I like apples and pears.", wrong: ["I like apples pears and.", "Apples I like pears and."] },
  { first: "The dog is big.", second: "The dog is brown.", right: "The dog is big and brown.", wrong: ["The dog big brown is.", "Is the dog and big brown."] },
  { first: "Sam has a hat.", second: "Sam has mittens.", right: "Sam has a hat and mittens.", wrong: ["Sam has hat mittens and a.", "Mittens and Sam a hat has."] },
  { first: "We sing songs.", second: "We play games.", right: "We sing songs and play games.", wrong: ["We sing and games songs play.", "Songs games we and sing play."] },
];

const WHOLE: { right: string; wrong: string[] }[] = [
  { right: "The fox runs fast.", wrong: ["The fox", "Runs fast and"] },
  { right: "Lena paints a picture.", wrong: ["Lena paints", "A picture of"] },
  { right: "Birds sing in the morning.", wrong: ["Birds sing in", "In the morning"] },
  { right: "My friend has a red kite.", wrong: ["My friend has", "A red kite and"] },
];

const SENSE: { right: string; wrong: string[] }[] = [
  { right: "The cat drinks milk.", wrong: ["The milk drinks cat.", "Drinks the milk cat."] },
  { right: "A bird sits on the fence.", wrong: ["The fence sits on a bird.", "On sits a fence bird."] },
  { right: "We read a book.", wrong: ["Book a read we.", "A we book read."] },
  { right: "Kenji rides his bike.", wrong: ["His bike rides Kenji.", "Rides bike his Kenji."] },
];

function buildSentences(): Question[] {
  const wordOrder = (): OrderQuestion => {
    const words = pick(SENTENCES);
    return {
      kind: "order",
      prompt: "Tap the words to build a sentence.",
      hint: "A sentence starts with a capital letter and ends with a period.",
      items: words.map((w, i) => ({ id: `w${i}`, label: w })),
    };
  };
  const storyOrder = (): OrderQuestion => {
    const lines = pick(STORIES);
    return {
      kind: "order",
      prompt: "Tap what happens, from first to last.",
      hint: "Think about what must happen first, next and last.",
      items: lines.map((w, i) => ({ id: `l${i}`, label: w })),
    };
  };
  const join = (): Question => {
    const j = pick(JOINS);
    return textChoice(`Which sentence joins these ideas? ${j.first} ${j.second}`, j.right, j.wrong, "Use the word “and” to join two ideas.");
  };
  const whole = (): Question => {
    const w = pick(WHOLE);
    return textChoice("Which one is a whole sentence?", w.right, w.wrong, "A whole sentence tells a full idea: who and what happens.");
  };
  const sense = (): Question => {
    const s = pick(SENSE);
    return textChoice("Which sentence makes sense?", s.right, s.wrong, "Read it in your head. Does it sound right?");
  };
  const first = (): Question => {
    const lines = pick(STORIES);
    const others = sample(lines.slice(1), 2);
    return textChoice("Which sentence begins the story?", lines[0], others, "The beginning tells who and what starts the story.");
  };
  return shuffle(buildSet([wordOrder, wordOrder, storyOrder, storyOrder, join, whole, sense, first]));
}

export const buildSentencesUnit: Unit = {
  id: "build-sentences-ab",
  title: "Build a Sentence",
  emoji: "🧩",
  blurb: "Put words and ideas in order!",
  parentNote: "Putting words in the right order to make a sentence that begins with a capital letter and ends with a period, joining two ideas, and putting a short story's events in order.",
  standards: ab(
    "Combine ideas in logical sequences to speak and write in complete sentences; Organize ideas to create stories and poems or to record factual information.",
    "building complete sentences, joining ideas, and putting story events in order",
  ),
  generate: buildSentences,
};

export const units: Unit[] = [buildSentencesUnit];
