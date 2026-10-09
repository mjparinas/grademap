import { chance, pick, sample, shuffle, textChoice } from "../../random";
import type { Choice, ChoiceQuestion, Course, GenerateOptions, Question, Visual } from "../../types";

// Kindergarten early literacy: short prompts, mostly 3 picture choices.
//
// Read-aloud reads the prompt and every choice label. Where hearing the labels
// would give the answer away (finding a letter or a word by sight), choices get
// `speak: ""` so read-aloud says nothing for them.

type Level = NonNullable<GenerateOptions["difficulty"]>;
type Opt = Omit<Choice, "id">;
interface Pic {
  word: string;
  emoji: string;
}

const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

/** A picture choice with its word as the label. */
const pic = (p: Pic): Opt => ({ label: p.word, emoji: p.emoji });

/** A choice that read-aloud skips, so hearing it can't give the answer away. */
const quiet = (label: string): Opt => ({ label, speak: "" });

/** A choice question; the first option is correct. */
function ask(
  prompt: string,
  right: Opt | string,
  wrong: (Opt | string)[],
  hint: string,
  visual?: Visual,
  speak?: string,
): ChoiceQuestion {
  const q = textChoice(prompt, right, wrong, hint, visual);
  if (speak) q.speak = speak;
  return q;
}

/** `count` distinct items, taken from `preferred` first and topped up from `fallback`. */
function pickSome<T>(preferred: readonly T[], fallback: readonly T[], count: number): T[] {
  const out = sample(preferred, count);
  for (const item of shuffle(fallback)) {
    if (out.length >= count) break;
    if (!out.includes(item)) out.push(item);
  }
  return out;
}

// ---------- Letter Partners (big and small letters) ----------

const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
/** Small letters that look like a smaller big letter. */
const SAME_SHAPE = ["c", "k", "o", "p", "s", "u", "v", "w", "x", "z"];
/** Small letters that look different from their big partner. */
const TRICKY = ["a", "b", "d", "e", "f", "g", "h", "m", "n", "q", "r", "t"];

const SMALL_LOOKALIKES: Record<string, string[]> = {
  a: ["o", "e", "d"],
  b: ["d", "p", "h"],
  d: ["b", "p", "q"],
  e: ["c", "o", "a"],
  f: ["t", "j", "r"],
  g: ["q", "p", "y"],
  h: ["n", "b", "k"],
  m: ["n", "w", "u"],
  n: ["m", "h", "u"],
  q: ["p", "g", "d"],
  r: ["n", "f", "v"],
  t: ["f", "j", "i"],
};

const BIG_LOOKALIKES: Record<string, string[]> = {
  A: ["H", "R", "V"],
  B: ["D", "P", "R"],
  D: ["B", "O", "P"],
  E: ["F", "B", "H"],
  F: ["E", "P", "T"],
  G: ["C", "O", "Q"],
  H: ["N", "A", "K"],
  M: ["N", "W", "H"],
  N: ["M", "H", "W"],
  Q: ["O", "G", "C"],
  R: ["P", "B", "K"],
  T: ["F", "Y", "J"],
};

const LETTER_TIPS: Record<string, string> = {
  a: "Small a is round with a short line on its right side.",
  b: "Small b has a tall line with a round tummy on the right.",
  d: "Small d has a round tummy on the left and a tall line.",
  e: "Small e has a little line across its middle.",
  f: "Small f has a hook at the top and a line across.",
  g: "Small g has a round top and a tail that hangs down.",
  h: "Small h has a tall line and one hump.",
  m: "Small m is short with two humps.",
  n: "Small n is short with one hump.",
  p: "Small p looks like big P, but it hangs below the line.",
  q: "Small q has a round tummy and a tail that hangs straight down.",
  r: "Small r is short with one little arm.",
  t: "Small t has a line that crosses near the top.",
};

/** Letter names for read-aloud (Canadian "zed"). */
const LETTER_NAMES: Record<string, string> = {
  a: "ay", b: "bee", c: "see", d: "dee", e: "ee", f: "eff", g: "gee", h: "aitch", i: "eye",
  j: "jay", k: "kay", l: "el", m: "em", n: "en", o: "oh", p: "pee", q: "cue", r: "ar",
  s: "ess", t: "tee", u: "you", v: "vee", w: "double you", x: "ex", y: "why", z: "zed",
};

/** Show a big letter; find its small partner. */
function findSmall(small: string, level: Level): Question {
  const big = small.toUpperCase();
  // Small "l" looks like big "I", so it's never a wrong answer.
  const others = ALL_LETTERS.filter((l) => l !== small && l !== "l");
  const alike = SMALL_LOOKALIKES[small] ?? [];
  const wrong =
    level === 3 ? pickSome(alike, others, 3) : sample(others.filter((l) => !alike.includes(l)), 2);
  const tip =
    LETTER_TIPS[small] ??
    (SAME_SHAPE.includes(small) ? `Small ${small} looks just like big ${big}, only smaller!` : "They have the same name.");
  return ask(
    "Find the small letter that matches.",
    quiet(small),
    wrong.map(quiet),
    `Big ${big} and small ${small} are partners. ${tip}`,
    { type: "letter", text: big },
    `Find the small letter that matches big ${LETTER_NAMES[small]}.`,
  );
}

/** Show a small letter; find its big partner. */
function findBig(small: string, level: Level): Question {
  const big = small.toUpperCase();
  const others = ALL_LETTERS.map((l) => l.toUpperCase()).filter((l) => l !== big);
  const alike = BIG_LOOKALIKES[big] ?? [];
  const wrong =
    level === 3 ? pickSome(alike, others, 3) : sample(others.filter((l) => !alike.includes(l)), 2);
  return ask(
    "Find the big letter that matches.",
    quiet(big),
    wrong.map(quiet),
    `Small ${small} and big ${big} are partners with the same name. Look for big ${big}!`,
    { type: "letter", text: small },
    `Find the big letter that matches small ${LETTER_NAMES[small]}.`,
  );
}

function letterPartners(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const pool = level === 1 ? SAME_SHAPE : level === 3 ? TRICKY : ALL_LETTERS;
  const bigFirst = level === 1 ? 6 : level === 2 ? 5 : 4;
  const targets = sample(pool, 8);
  // A small "l" shown on its own looks like a big "I", so only ask big L → small l.
  const l = targets.indexOf("l");
  if (l >= bigFirst) [targets[0], targets[l]] = [targets[l], targets[0]];
  return shuffle(targets.map((t, i) => (i < bigFirst ? findSmall(t, level) : findBig(t, level))));
}

// ---------- First Sounds ----------

interface SoundGroup {
  letter: string;
  /** How read-aloud says the sound. */
  sound: string;
  pics: Pic[];
  /** Short vowels: a word that starts with the same sound (not one of the pictures). */
  vowelKey?: string;
}

// Every picture is a word a 5-year-old would say, and no picture has a common
// other name that starts with a different letter in this list.
const SOUND_GROUPS: SoundGroup[] = [
  {
    letter: "b",
    sound: "buh",
    pics: [
      { word: "bee", emoji: "🐝" },
      { word: "bus", emoji: "🚌" },
      { word: "bear", emoji: "🐻" },
      { word: "bed", emoji: "🛏️" },
      { word: "bell", emoji: "🔔" },
      { word: "banana", emoji: "🍌" },
      { word: "butterfly", emoji: "🦋" },
      { word: "bike", emoji: "🚲" },
    ],
  },
  {
    letter: "d",
    sound: "duh",
    pics: [
      { word: "dog", emoji: "🐕" },
      { word: "duck", emoji: "🦆" },
      { word: "door", emoji: "🚪" },
      { word: "dolphin", emoji: "🐬" },
      { word: "dinosaur", emoji: "🦕" },
    ],
  },
  {
    letter: "f",
    sound: "fff",
    pics: [
      { word: "fish", emoji: "🐟" },
      { word: "fox", emoji: "🦊" },
      { word: "fire", emoji: "🔥" },
      { word: "foot", emoji: "🦶" },
      { word: "feather", emoji: "🪶" },
    ],
  },
  {
    letter: "g",
    sound: "guh",
    pics: [
      { word: "goat", emoji: "🐐" },
      { word: "guitar", emoji: "🎸" },
    ],
  },
  {
    letter: "h",
    sound: "huh",
    pics: [
      { word: "hat", emoji: "🎩" },
      { word: "house", emoji: "🏠" },
      { word: "hippo", emoji: "🦛" },
      { word: "hammer", emoji: "🔨" },
    ],
  },
  {
    letter: "l",
    sound: "lll",
    pics: [
      { word: "lion", emoji: "🦁" },
      { word: "lemon", emoji: "🍋" },
      { word: "lock", emoji: "🔒" },
      { word: "leg", emoji: "🦵" },
    ],
  },
  {
    letter: "m",
    sound: "mmm",
    pics: [
      { word: "moon", emoji: "🌙" },
      { word: "mouse", emoji: "🐭" },
      { word: "monkey", emoji: "🐵" },
      { word: "milk", emoji: "🥛" },
      { word: "map", emoji: "🗺️" },
      { word: "mushroom", emoji: "🍄" },
    ],
  },
  {
    letter: "p",
    sound: "puh",
    pics: [
      { word: "pig", emoji: "🐷" },
      { word: "pizza", emoji: "🍕" },
      { word: "pear", emoji: "🍐" },
      { word: "penguin", emoji: "🐧" },
      { word: "pencil", emoji: "✏️" },
      { word: "pie", emoji: "🥧" },
      { word: "popcorn", emoji: "🍿" },
    ],
  },
  {
    letter: "r",
    sound: "rrr",
    pics: [
      { word: "rainbow", emoji: "🌈" },
      { word: "ring", emoji: "💍" },
      { word: "robot", emoji: "🤖" },
      { word: "rocket", emoji: "🚀" },
      { word: "raccoon", emoji: "🦝" },
    ],
  },
  {
    letter: "s",
    sound: "sss",
    pics: [
      { word: "sun", emoji: "☀️" },
      { word: "sock", emoji: "🧦" },
      { word: "sandwich", emoji: "🥪" },
      { word: "seal", emoji: "🦭" },
      { word: "soap", emoji: "🧼" },
      { word: "salad", emoji: "🥗" },
    ],
  },
  {
    letter: "t",
    sound: "tuh",
    pics: [
      { word: "tiger", emoji: "🐯" },
      { word: "turtle", emoji: "🐢" },
      { word: "tomato", emoji: "🍅" },
      { word: "tent", emoji: "⛺" },
      { word: "tooth", emoji: "🦷" },
      { word: "taco", emoji: "🌮" },
      { word: "turkey", emoji: "🦃" },
    ],
  },
  {
    letter: "v",
    sound: "vvv",
    pics: [
      { word: "violin", emoji: "🎻" },
      { word: "volcano", emoji: "🌋" },
    ],
  },
  {
    letter: "w",
    sound: "wuh",
    pics: [
      { word: "watermelon", emoji: "🍉" },
      { word: "worm", emoji: "🪱" },
      { word: "window", emoji: "🪟" },
      { word: "watch", emoji: "⌚" },
    ],
  },
  {
    letter: "a",
    sound: "a",
    vowelKey: "at",
    pics: [
      { word: "apple", emoji: "🍎" },
      { word: "ambulance", emoji: "🚑" },
    ],
  },
  {
    letter: "e",
    sound: "e",
    vowelKey: "end",
    pics: [
      { word: "egg", emoji: "🥚" },
      { word: "elephant", emoji: "🐘" },
    ],
  },
  {
    letter: "o",
    sound: "o",
    vowelKey: "on",
    pics: [
      { word: "octopus", emoji: "🐙" },
      { word: "otter", emoji: "🦦" },
    ],
  },
];

/** Sounds that are easy to mix up. Kept apart on easy questions, mixed in on stretch ones. */
const CLOSE_SOUNDS: Record<string, string[]> = {
  b: ["p", "d"],
  p: ["b"],
  d: ["t", "b"],
  t: ["d"],
  f: ["v"],
  v: ["f"],
  w: ["r"],
  r: ["w", "l"],
  l: ["r"],
  a: ["e", "o"],
  e: ["a"],
  o: ["a"],
};

const EASY_SOUNDS = ["b", "f", "h", "l", "m", "p", "r", "s", "t"];

function startsHint(g: SoundGroup, word: string): string {
  return g.vowelKey
    ? `Say it slowly: ${word}. It starts with the ${g.letter} sound you hear in “${g.vowelKey}”.`
    : `Say it slowly: ${word}. It starts with ${g.sound}, the sound of ${g.letter}.`;
}

/** Groups to take wrong answers from. */
function soundRivals(g: SoundGroup, level: Level, count: number): SoundGroup[] {
  const close = CLOSE_SOUNDS[g.letter] ?? [];
  const others = SOUND_GROUPS.filter(
    (o) =>
      o !== g &&
      (level === 3 || !o.vowelKey || !!g.vowelKey) &&
      (level !== 1 || !close.includes(o.letter)),
  );
  const preferred =
    level === 3
      ? sample(others.filter((o) => close.includes(o.letter)), 1)
      : g.vowelKey
        ? others.filter((o) => o.vowelKey)
        : [];
  return pickSome(preferred, others, count);
}

/** "Which one starts with b?" with picture choices. */
function whichPicture(g: SoundGroup, level: Level): Question {
  const right = pick(g.pics);
  const wrong = soundRivals(g, level, level === 3 ? 3 : 2).map((o) => pick(o.pics));
  return ask(
    `Which one starts with “${g.letter}”?`,
    pic(right),
    wrong.map(pic),
    startsHint(g, right.word),
    undefined,
    g.vowelKey
      ? `Which picture starts with the same sound as ${g.vowelKey}?`
      : `Which picture starts with the sound ${g.sound}?`,
  );
}

/** A picture with its first letter missing; choose the letter. */
function whichLetter(g: SoundGroup, level: Level): Question {
  const p = pick(g.pics);
  const wrong = soundRivals(g, level, level === 3 ? 3 : 2).map((o) => o.letter);
  return ask(
    "Which letter does it start with?",
    quiet(g.letter),
    wrong.map(quiet),
    startsHint(g, p.word),
    { type: "emoji", emoji: p.emoji, caption: `_${p.word.slice(1)}` },
    `Which letter does ${p.word} start with?`,
  );
}

function firstSounds(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const pool =
    level === 1
      ? SOUND_GROUPS.filter((g) => EASY_SOUNDS.includes(g.letter))
      : level === 2
        ? SOUND_GROUPS.filter((g) => !g.vowelKey)
        : SOUND_GROUPS;
  return shuffle(
    sample(pool, 8).map((g, i) => (i < 5 ? whichPicture(g, level) : whichLetter(g, level))),
  );
}

// ---------- Rhyme Time ----------

interface RhymeGroup {
  /** Groups with the same vowel sound almost rhyme (fox, sock), so they're never mixed. */
  vowel: string;
  pics: Pic[];
}

const RHYME_GROUPS: RhymeGroup[] = [
  { vowel: "a", pics: [{ word: "cat", emoji: "🐱" }, { word: "hat", emoji: "🎩" }, { word: "bat", emoji: "🦇" }] },
  { vowel: "o", pics: [{ word: "dog", emoji: "🐶" }, { word: "frog", emoji: "🐸" }, { word: "log", emoji: "🪵" }] },
  {
    vowel: "ee",
    pics: [
      { word: "bee", emoji: "🐝" },
      { word: "tree", emoji: "🌳" },
      { word: "key", emoji: "🔑" },
      { word: "three", emoji: "3️⃣" },
    ],
  },
  { vowel: "ar", pics: [{ word: "star", emoji: "⭐" }, { word: "car", emoji: "🚗" }] },
  { vowel: "ay", pics: [{ word: "cake", emoji: "🎂" }, { word: "snake", emoji: "🐍" }] },
  { vowel: "oo", pics: [{ word: "moon", emoji: "🌙" }, { word: "spoon", emoji: "🥄" }] },
  { vowel: "o", pics: [{ word: "fox", emoji: "🦊" }, { word: "box", emoji: "📦" }] },
  { vowel: "oh", pics: [{ word: "goat", emoji: "🐐" }, { word: "boat", emoji: "⛵" }, { word: "coat", emoji: "🧥" }] },
  { vowel: "ow", pics: [{ word: "mouse", emoji: "🐭" }, { word: "house", emoji: "🏠" }] },
  { vowel: "air", pics: [{ word: "bear", emoji: "🐻" }, { word: "chair", emoji: "🪑" }, { word: "pear", emoji: "🍐" }] },
  {
    vowel: "o",
    pics: [
      { word: "clock", emoji: "🕐" },
      { word: "sock", emoji: "🧦" },
      { word: "rock", emoji: "🪨" },
      { word: "lock", emoji: "🔒" },
    ],
  },
  { vowel: "e", pics: [{ word: "bed", emoji: "🛏️" }, { word: "sled", emoji: "🛷" }, { word: "bread", emoji: "🍞" }] },
  { vowel: "u", pics: [{ word: "sun", emoji: "☀️" }, { word: "one", emoji: "1️⃣" }] },
  { vowel: "ay", pics: [{ word: "snail", emoji: "🐌" }, { word: "whale", emoji: "🐳" }] },
  { vowel: "e", pics: [{ word: "ten", emoji: "🔟" }, { word: "pen", emoji: "🖊️" }] },
  { vowel: "or", pics: [{ word: "four", emoji: "4️⃣" }, { word: "door", emoji: "🚪" }] },
  { vowel: "oo", pics: [{ word: "two", emoji: "2️⃣" }, { word: "shoe", emoji: "👟" }] },
  { vowel: "oh", pics: [{ word: "nose", emoji: "👃" }, { word: "rose", emoji: "🌹" }] },
];

/** Pictures that clearly don't rhyme with this group. */
function nonRhymes(g: RhymeGroup): Pic[] {
  return RHYME_GROUPS.filter((o) => o.vowel !== g.vowel).flatMap((o) => o.pics);
}

/** "Which one rhymes with cat?" */
function rhymesWith(g: RhymeGroup, level: Level): Question {
  const [target, right] = sample(g.pics, 2);
  const pool = nonRhymes(g);
  // Stretch: wrong answers that start the same way (cat → car, cake) are more tempting.
  const sameStart = level === 3 ? pool.filter((p) => p.word[0] === target.word[0]) : [];
  const wrong = pickSome(sample(sameStart, 1), pool, level === 3 ? 3 : 2);
  return ask(
    `Which one rhymes with “${target.word}”?`,
    pic(right),
    wrong.map(pic),
    `Rhymes end with the same sound. Say them: ${target.word}… ${right.word}!`,
    { type: "emoji", emoji: target.emoji, caption: target.word },
  );
}

/** "Do cat and hat rhyme?" Yes or no. */
function doTheyRhyme(g: RhymeGroup): Question {
  const yes = chance(0.5);
  const [a, partner] = sample(g.pics, 2);
  const b = yes ? partner : pick(nonRhymes(g));
  return {
    kind: "choice",
    prompt: `Do “${a.word}” and “${b.word}” rhyme?`,
    hint: yes
      ? `Say them: ${a.word}, ${b.word}. They end with the same sound, so they rhyme!`
      : `Say them: ${a.word}, ${b.word}. Their endings sound different, so they don't rhyme.`,
    visual: { type: "emojiRow", items: [a.emoji, b.emoji] },
    answer: yes ? "yes" : "no",
    choices: [
      { id: "yes", label: "Yes", emoji: "👍" },
      { id: "no", label: "No", emoji: "👎" },
    ],
  };
}

/** Two rhyming pictures and one that doesn't rhyme. */
function oddOneOut(g: RhymeGroup): Question {
  const [a, b] = sample(g.pics, 2);
  const odd = pick(nonRhymes(g));
  return ask(
    "Which one does not rhyme?",
    pic(odd),
    [pic(a), pic(b)],
    `“${a.word}” and “${b.word}” rhyme, but “${odd.word}” has a different ending sound.`,
  );
}

function rhymeTime(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const groups = sample(RHYME_GROUPS, 8);
  const plan: ("rhyme" | "yesno" | "odd")[] =
    level === 1
      ? ["rhyme", "rhyme", "rhyme", "rhyme", "rhyme", "yesno", "yesno", "yesno"]
      : level === 2
        ? ["rhyme", "rhyme", "rhyme", "rhyme", "rhyme", "yesno", "yesno", "odd"]
        : ["rhyme", "rhyme", "rhyme", "rhyme", "rhyme", "odd", "odd", "odd"];
  return shuffle(
    groups.map((g, i) =>
      plan[i] === "rhyme" ? rhymesWith(g, level) : plan[i] === "yesno" ? doTheyRhyme(g) : oddOneOut(g),
    ),
  );
}

// ---------- Clap the Beat (syllables) ----------

/** Words split into syllables with "-". */
const CLAP_WORDS: { say: string; emoji: string }[] = [
  { say: "dog", emoji: "🐶" },
  { say: "cat", emoji: "🐱" },
  { say: "sun", emoji: "☀️" },
  { say: "fish", emoji: "🐟" },
  { say: "bee", emoji: "🐝" },
  { say: "moon", emoji: "🌙" },
  { say: "house", emoji: "🏠" },
  { say: "cake", emoji: "🎂" },
  { say: "bus", emoji: "🚌" },
  { say: "duck", emoji: "🦆" },
  { say: "star", emoji: "⭐" },
  { say: "frog", emoji: "🐸" },
  { say: "ap-ple", emoji: "🍎" },
  { say: "pen-cil", emoji: "✏️" },
  { say: "rain-bow", emoji: "🌈" },
  { say: "mon-key", emoji: "🐵" },
  { say: "tur-tle", emoji: "🐢" },
  { say: "ti-ger", emoji: "🐯" },
  { say: "ze-bra", emoji: "🦓" },
  { say: "piz-za", emoji: "🍕" },
  { say: "ro-bot", emoji: "🤖" },
  { say: "rock-et", emoji: "🚀" },
  { say: "pump-kin", emoji: "🎃" },
  { say: "cook-ie", emoji: "🍪" },
  { say: "pen-guin", emoji: "🐧" },
  { say: "car-rot", emoji: "🥕" },
  { say: "lem-on", emoji: "🍋" },
  { say: "can-dle", emoji: "🕯️" },
  { say: "ba-na-na", emoji: "🍌" },
  { say: "but-ter-fly", emoji: "🦋" },
  { say: "el-e-phant", emoji: "🐘" },
  { say: "di-no-saur", emoji: "🦕" },
  { say: "to-ma-to", emoji: "🍅" },
  { say: "po-ta-to", emoji: "🥔" },
  { say: "kan-ga-roo", emoji: "🦘" },
  { say: "oc-to-pus", emoji: "🐙" },
  { say: "um-brel-la", emoji: "☂️" },
  { say: "pine-ap-ple", emoji: "🍍" },
];

interface ClapWord {
  word: string;
  parts: string[];
  emoji: string;
}

const CLAPS: ClapWord[] = CLAP_WORDS.map(({ say, emoji }) => ({
  word: say.replace(/-/g, ""),
  parts: say.split("-"),
  emoji,
}));

const withClaps = (n: number) => CLAPS.filter((c) => c.parts.length === n);
const clapsText = (n: number) => `${n} clap${n === 1 ? "" : "s"}`;
const capitalize = (word: string) => word[0].toUpperCase() + word.slice(1);
const clapHint = (c: ClapWord) =>
  `Clap each part as you say it: ${c.parts.join(" · ")}. That's ${clapsText(c.parts.length)}!`;

function howManyClaps(c: ClapWord): Question {
  const n = c.parts.length;
  return {
    kind: "choice",
    prompt: `Clap “${c.word}”. How many claps?`,
    speak: `Say ${c.word} and clap. How many claps?`,
    hint: clapHint(c),
    visual: { type: "emoji", emoji: c.emoji, caption: c.word },
    answer: String(n),
    choices: [1, 2, 3].map((k) => ({ id: String(k), label: String(k) })),
  };
}

/** Three pictures with 1, 2 and 3 claps; find the one with `n`. */
function whichHasClaps(n: number, words: ClapWord[]): Question {
  const right = words[n - 1];
  return ask(
    `Which word has ${clapsText(n)}?`,
    { label: right.word, emoji: right.emoji },
    words.filter((w) => w !== right).map((w) => ({ label: w.word, emoji: w.emoji })),
    `Clap each word. ${capitalize(right.word)} has ${clapsText(n)}: ${right.parts.join(" · ")}.`,
  );
}

function clapTheBeat(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  // How many 1-, 2- and 3-clap words to ask about, and how many "which word" questions.
  const [ones, twos, threes, finds] =
    level === 1 ? [3, 3, 0, 2] : level === 2 ? [2, 2, 2, 2] : [1, 2, 2, 3];
  const asked = [...sample(withClaps(1), ones), ...sample(withClaps(2), twos), ...sample(withClaps(3), threes)];
  const unused = (n: number) => withClaps(n).filter((c) => !asked.includes(c));
  const findQs: Question[] = Array.from({ length: finds }, () => {
    const n = level === 1 ? pick([1, 3]) : level === 3 ? pick([2, 2, 3]) : pick([1, 2, 3]);
    return whichHasClaps(n, [pick(unused(1)), pick(unused(2)), pick(unused(3))]);
  });
  return shuffle([...asked.map(howManyClaps), ...findQs]);
}

// ---------- Sight Words ----------

const SIGHT_WORDS = [
  "the", "a", "I", "see", "can", "go", "and", "is", "it",
  "to", "me", "my", "we", "you", "up", "look", "in", "like",
  "at", "on", "do", "no", "so",
];

/** Real words that look a lot like each sight word. */
const SIGHT_LOOKALIKES: Record<string, string[]> = {
  the: ["to", "me", "we"],
  a: ["and", "I", "at"],
  I: ["it", "is", "in"],
  see: ["we", "me", "the"],
  can: ["and", "an", "at"],
  go: ["to", "so", "no"],
  and: ["a", "can", "an"],
  is: ["it", "in", "I"],
  it: ["is", "in", "to"],
  to: ["go", "the", "it"],
  me: ["my", "we", "see"],
  my: ["me", "we", "you"],
  we: ["me", "see", "the"],
  you: ["up", "my", "go"],
  up: ["you", "us", "my"],
  look: ["like", "book", "to"],
  in: ["is", "it", "I"],
  like: ["look", "it", "is"],
  at: ["a", "it", "an"],
  on: ["no", "in", "an"],
  do: ["go", "to", "so"],
  no: ["on", "go", "so"],
  so: ["go", "no", "to"],
};

/** Sight words that a picture can show. */
const PICTURE_WORDS: { word: string; emoji: string; group: string }[] = [
  { word: "red", emoji: "🔴", group: "colour" },
  { word: "blue", emoji: "🔵", group: "colour" },
  { word: "yellow", emoji: "🟡", group: "colour" },
  { word: "green", emoji: "🟢", group: "colour" },
  { word: "one", emoji: "1️⃣", group: "number" },
  { word: "two", emoji: "2️⃣", group: "number" },
  { word: "three", emoji: "3️⃣", group: "number" },
  { word: "up", emoji: "⬆️", group: "way" },
  { word: "down", emoji: "⬇️", group: "way" },
  { word: "run", emoji: "🏃", group: "action" },
  { word: "look", emoji: "👀", group: "action" },
  { word: "orange", emoji: "🟠", group: "colour" },
  { word: "purple", emoji: "🟣", group: "colour" },
  { word: "black", emoji: "⚫", group: "colour" },
  { word: "four", emoji: "4️⃣", group: "number" },
  { word: "five", emoji: "5️⃣", group: "number" },
  { word: "jump", emoji: "🤸", group: "action" },
];

const spell = (word: string) => word.split("").join("-");

function findSightWord(word: string, level: Level): Question {
  const others = SIGHT_WORDS.filter((w) => w !== word);
  const wrong =
    level === 1
      ? sample(
          others.filter((w) => w[0].toLowerCase() !== word[0].toLowerCase() && w.length !== word.length),
          2,
        )
      : level === 2
        ? sample(others, 2)
        : SIGHT_LOOKALIKES[word];
  return ask(
    "Find this word.",
    quiet(word),
    wrong.map(quiet),
    word.length === 1
      ? `This word is just one letter: ${word}. Find it by itself!`
      : `Check each letter, one at a time: ${spell(word)}.`,
    { type: "letter", text: word },
    `Find the word: ${word}.`,
  );
}

function readPictureWord(p: (typeof PICTURE_WORDS)[number], level: Level): Question {
  const others = PICTURE_WORDS.filter((o) => o !== p);
  const sameGroup = others.filter((o) => o.group === p.group);
  const wrong =
    level === 1
      ? sample(others.filter((o) => o.group !== p.group), 2)
      : pickSome(sameGroup, others, level === 3 ? 3 : 2);
  return ask(
    "Which word goes with the picture?",
    quiet(p.word),
    wrong.map((o) => quiet(o.word)),
    `The picture shows ${p.word}. Find the word ${spell(p.word)}.`,
    { type: "emoji", emoji: p.emoji },
  );
}

function sightWords(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle([
    ...sample(SIGHT_WORDS, 5).map((w) => findSightWord(w, level)),
    ...sample(PICTURE_WORDS, 3).map((p) => readPictureWord(p, level)),
  ]);
}

// ---------- Story Order ----------

interface Step {
  label: string;
  emoji: string;
}

const SEQUENCES: Step[][] = [
  [
    { emoji: "🥚", label: "An egg" },
    { emoji: "🐣", label: "It hatches" },
    { emoji: "🐥", label: "A little chick" },
  ],
  [
    { emoji: "🥚", label: "A tiny egg" },
    { emoji: "🐛", label: "A caterpillar" },
    { emoji: "🦋", label: "A butterfly" },
  ],
  [
    { emoji: "❄️", label: "Snow falls" },
    { emoji: "⛄", label: "We make a snowman" },
    { emoji: "☀️", label: "The sun melts it" },
  ],
  [
    { emoji: "☁️", label: "Clouds come" },
    { emoji: "🌧️", label: "Rain falls" },
    { emoji: "🌈", label: "A rainbow comes out" },
  ],
  [
    { emoji: "⏰", label: "Wake up" },
    { emoji: "🥣", label: "Eat breakfast" },
    { emoji: "🎒", label: "Go to school" },
  ],
  [
    { emoji: "🛁", label: "Take a bath" },
    { emoji: "📖", label: "Read a story" },
    { emoji: "😴", label: "Go to sleep" },
  ],
  [
    { emoji: "🍞", label: "Get some bread" },
    { emoji: "🥪", label: "Make a sandwich" },
    { emoji: "😋", label: "Eat it up" },
  ],
  [
    { emoji: "📄", label: "Get some paper" },
    { emoji: "🖌️", label: "Paint a picture" },
    { emoji: "🖼️", label: "Hang it up" },
  ],
  [
    { emoji: "🧦", label: "Put on socks" },
    { emoji: "👢", label: "Put on boots" },
    { emoji: "⛄", label: "Play in the snow" },
  ],
  [
    { emoji: "👶", label: "A baby" },
    { emoji: "🧒", label: "A kid" },
    { emoji: "🧑", label: "A grown-up" },
  ],
  [
    { emoji: "✏️", label: "Write a card" },
    { emoji: "✉️", label: "Put it in an envelope" },
    { emoji: "📮", label: "Mail it" },
  ],
];

const LONG_SEQUENCES: Step[][] = [
  [
    { emoji: "🥚", label: "An egg" },
    { emoji: "🐣", label: "It hatches" },
    { emoji: "🐥", label: "A little chick" },
    { emoji: "🐔", label: "A big hen" },
  ],
  [
    { emoji: "👶", label: "A baby" },
    { emoji: "🧒", label: "A kid" },
    { emoji: "🧑", label: "A grown-up" },
    { emoji: "🧓", label: "A grandparent" },
  ],
  [
    { emoji: "🌅", label: "The sun comes up" },
    { emoji: "☀️", label: "We play all day" },
    { emoji: "🌇", label: "The sun goes down" },
    { emoji: "🌙", label: "The moon comes out" },
  ],
  [
    { emoji: "❄️", label: "Snow falls" },
    { emoji: "⛄", label: "We make a snowman" },
    { emoji: "☀️", label: "The sun comes out" },
    { emoji: "💧", label: "The snowman melts" },
  ],
  [
    { emoji: "☀️", label: "It is sunny" },
    { emoji: "☁️", label: "Clouds come" },
    { emoji: "🌧️", label: "Rain falls" },
    { emoji: "🌈", label: "A rainbow comes out" },
  ],
];

interface MiniStory {
  lines: string[];
  /** Beginning, middle and end. */
  events: [Step, Step, Step];
}

const MINI_STORIES: MiniStory[] = [
  {
    lines: ["Leo lost his ball.", "He looked under his bed.", "He found it in the garden!"],
    events: [
      { emoji: "😟", label: "Leo lost his ball" },
      { emoji: "🛏️", label: "He looked under the bed" },
      { emoji: "⚽", label: "He found the ball" },
    ],
  },
  {
    lines: ["Maya planted a seed.", "She watered it every day.", "A big sunflower grew!"],
    events: [
      { emoji: "🌱", label: "Maya planted a seed" },
      { emoji: "💧", label: "She watered it" },
      { emoji: "🌻", label: "A sunflower grew" },
    ],
  },
  {
    lines: ["Snow fell all night.", "In the morning, Kenji made a snowman.", "Then the sun came out and it melted."],
    events: [
      { emoji: "❄️", label: "Snow fell" },
      { emoji: "⛄", label: "Kenji made a snowman" },
      { emoji: "💧", label: "The snowman melted" },
    ],
  },
  {
    lines: ["Priya and her dad mixed a cake.", "They baked it in the oven.", "Then they shared it with friends."],
    events: [
      { emoji: "🥣", label: "They mixed the cake" },
      { emoji: "⏲️", label: "They baked it" },
      { emoji: "🍰", label: "They shared it" },
    ],
  },
  {
    lines: ["Ana's dog jumped in the mud.", "Ana gave him a bath.", "Now he is clean and happy!"],
    events: [
      { emoji: "🐾", label: "The dog got muddy" },
      { emoji: "🛁", label: "He had a bath" },
      { emoji: "🐶", label: "He is clean and happy" },
    ],
  },
  {
    lines: ["Dark clouds filled the sky.", "Rain fell on Amir's umbrella.", "Then a rainbow came out!"],
    events: [
      { emoji: "☁️", label: "Clouds filled the sky" },
      { emoji: "☔", label: "Rain fell" },
      { emoji: "🌈", label: "A rainbow came out" },
    ],
  },
  {
    lines: ["Zoe went to the library.", "She picked a book about bugs.", "At bedtime, her mom read it to her."],
    events: [
      { emoji: "📚", label: "Zoe went to the library" },
      { emoji: "🐞", label: "She picked a bug book" },
      { emoji: "🌙", label: "Mom read it at bedtime" },
    ],
  },
];

const STORY_PARTS = [
  { prompt: "What happened first?", hint: "Think back to the very start of the story." },
  { prompt: "What happened in the middle?", hint: "The middle comes after the start and before the end." },
  { prompt: "What happened at the end?", hint: "Think about how the story finished." },
];

function putInOrder(steps: Step[]): Question {
  return {
    kind: "order",
    prompt: steps.length > 3 ? "Tap the pictures in order, from first to last." : "Tap the pictures in order: first, next, last.",
    hint: `What has to happen first? “${steps[0].label}” comes first.`,
    items: steps.map((s, i) => ({ id: `e${i}`, label: s.label, emoji: s.emoji })),
  };
}

function storyPart(story: MiniStory, part: number): Question {
  return ask(
    STORY_PARTS[part].prompt,
    story.events[part],
    story.events.filter((_, i) => i !== part),
    STORY_PARTS[part].hint,
    { type: "story", lines: story.lines },
  );
}

function storyOrder(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const sequences = level === 3 ? [...sample(SEQUENCES, 2), ...sample(LONG_SEQUENCES, 2)] : sample(SEQUENCES, 4);
  const stories = sample(MINI_STORIES, 4).map((s) => storyPart(s, level === 1 ? pick([0, 2]) : pick([0, 1, 2])));
  return shuffle([...sequences.map(putInOrder), ...stories]);
}

// ---------- Book Detectives (concepts of print) ----------

type PrintKind = "letter" | "number" | "word" | "sentence";

// Letters and numbers that can't be mistaken for each other (no O/0, S/5, B/8, l/1).
const PRINT_EXAMPLES: Record<PrintKind, string[]> = {
  letter: ["D", "F", "H", "K", "M", "N", "P", "R", "W", "h", "m", "n", "r"],
  number: ["2", "3", "4", "6", "7", "9"],
  word: ["cat", "dog", "sun", "mom", "dad", "run", "big", "red", "hat", "pig"],
  sentence: ["I see a dog.", "We can run.", "The cat is big.", "I like my hat.", "Look at me."],
};

const PRINT_HINTS: Record<PrintKind, string> = {
  letter: "A letter is one of the ABCs, like m or R.",
  number: "A number tells how many, like 3 or 7.",
  word: "A word is a group of letters that means something, like dog.",
  sentence: "A sentence is a group of words. It starts with a capital and ends with a period.",
};

function whichKind(kind: PrintKind): Question {
  const others: PrintKind[] = kind === "sentence" ? ["word", "letter"] : (["letter", "number", "word"] as PrintKind[]).filter((k) => k !== kind);
  return ask(
    `Which one is a ${kind}?`,
    quiet(pick(PRINT_EXAMPLES[kind])),
    others.map((k) => quiet(pick(PRINT_EXAMPLES[k]))),
    PRINT_HINTS[kind],
  );
}

interface PrintFact {
  prompt: string;
  right: Opt;
  wrong: Opt[];
  hint: string;
  easy?: boolean;
}

const PRINT_FACTS: PrintFact[] = [
  {
    prompt: "In English, which way do we read?",
    right: { emoji: "➡️", label: "Left to right" },
    wrong: [
      { emoji: "⬅️", label: "Right to left" },
      { emoji: "⬆️", label: "Bottom to top" },
    ],
    hint: "In English, we start on the left and move our finger to the right.",
    easy: true,
  },
  {
    prompt: "Where do we start reading a page?",
    right: { emoji: "⬆️", label: "At the top" },
    wrong: [
      { emoji: "⬇️", label: "At the bottom" },
      { emoji: "🎯", label: "In the middle" },
    ],
    hint: "We start at the top of the page and read down.",
    easy: true,
  },
  {
    prompt: "Where does an English book start?",
    right: { emoji: "📕", label: "At the front" },
    wrong: [
      { emoji: "🔚", label: "At the back" },
      { emoji: "🎯", label: "In the middle" },
    ],
    hint: "We open a book at the front cover, then turn the pages.",
    easy: true,
  },
  {
    prompt: "What goes between two words?",
    right: { label: "A space" },
    wrong: [{ label: "A number" }, { label: "A picture" }],
    hint: "We leave a little space between words so we can see where each one ends.",
    easy: true,
  },
  {
    prompt: "At the end of a line, where do we read next?",
    right: { emoji: "↙️", label: "The next line down" },
    wrong: [
      { emoji: "⬆️", label: "Back to the top" },
      { emoji: "⬅️", label: "The same line again" },
    ],
    hint: "Sweep back to the left and go down to the next line.",
  },
  {
    prompt: "What do we call the person who writes the words?",
    right: { emoji: "✍️", label: "The author" },
    wrong: [
      { emoji: "🎨", label: "The illustrator" },
      { emoji: "👀", label: "The reader" },
    ],
    hint: "The author is the person who writes the words in a book.",
  },
  {
    prompt: "What do we call the person who draws the pictures?",
    right: { emoji: "🎨", label: "The illustrator" },
    wrong: [
      { emoji: "✍️", label: "The author" },
      { emoji: "👀", label: "The reader" },
    ],
    hint: "The illustrator draws or paints the pictures in a book.",
  },
  {
    prompt: "What do we call the name of a book?",
    right: { emoji: "🏷️", label: "The title" },
    wrong: [
      { emoji: "📄", label: "A page" },
      { emoji: "🔢", label: "A number" },
    ],
    hint: "The title is the name of the book. You can find it on the front cover.",
  },
];

const COUNT_SENTENCES: Record<Level, string[]> = {
  1: ["Dogs can run.", "Look at me.", "We can hop.", "Birds fly.", "Fish can swim.", "Cats nap."],
  2: ["I see a cat.", "We like to play.", "My hat is red.", "The sun is hot.", "Look at the moon."],
  3: ["I can see a big bus.", "We go to the park.", "My dog likes to run.", "The cat is on the mat.", "Can you see the red ball?"],
};

function countWords(sentence: string): Question {
  const n = sentence.split(" ").length;
  return {
    kind: "choice",
    prompt: "How many words are in this sentence?",
    hint: "Point to each word as you read. The spaces show where one word ends.",
    visual: { type: "story", lines: [sentence] },
    answer: String(n),
    choices: [n - 1, n, n + 1].map((k) => ({ id: String(k), label: String(k) })),
  };
}

function firstOrLastWord(sentence: string): Question {
  const words = sentence.replace(/[.?!]/g, "").split(" ");
  const last = chance(0.5);
  const target = last ? words[words.length - 1] : words[0];
  const others = words.filter(
    (w, i) =>
      w.toLowerCase() !== target.toLowerCase() &&
      words.findIndex((x) => x.toLowerCase() === w.toLowerCase()) === i,
  );
  return ask(
    last ? "Which word comes last?" : "Which word comes first?",
    quiet(target),
    sample(others, 2).map(quiet),
    last
      ? "The last word is at the end of the sentence, on the right."
      : "Start on the left. The first word begins with a capital letter.",
    { type: "story", lines: [sentence] },
  );
}

function bookDetectives(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const easyFacts = PRINT_FACTS.filter((f) => f.easy);
  const hardFacts = PRINT_FACTS.filter((f) => !f.easy);
  const facts =
    level === 1 ? sample(easyFacts, 3) : level === 2 ? sample(PRINT_FACTS, 3) : pickSome(hardFacts, PRINT_FACTS, 3);
  const kinds: PrintKind[] =
    level === 1
      ? ["letter", "number", "word"]
      : level === 2
        ? sample(["letter", "number", "word"] as PrintKind[], 2)
        : ["sentence", pick(["letter", "number", "word"] as PrintKind[])];
  const sentences = sample(COUNT_SENTENCES[level], 3);
  const counting = level === 1 ? [sentences[0], sentences[1]] : level === 2 ? [sentences[0], sentences[1]] : [sentences[0]];
  const firstLast = level === 1 ? [] : level === 2 ? [sentences[2]] : [sentences[1], sentences[2]];
  return shuffle([
    ...kinds.map(whichKind),
    ...facts.map((f) => ask(f.prompt, f.right, f.wrong, f.hint)),
    ...counting.map(countWords),
    ...firstLast.map(firstOrLastWord),
  ]);
}

// ---------- Picture Clues ----------

interface ClueWord {
  word: string;
  emoji: string;
  /** Words that look alike (rhymes, or the same first letters). */
  alike: string[];
}

const CLUE_WORDS: ClueWord[] = [
  { word: "dog", emoji: "🐶", alike: ["log", "fog"] },
  { word: "cat", emoji: "🐱", alike: ["hat", "mat"] },
  { word: "pig", emoji: "🐷", alike: ["wig", "pin"] },
  { word: "sun", emoji: "☀️", alike: ["bun", "run"] },
  { word: "bed", emoji: "🛏️", alike: ["sled", "red"] },
  { word: "fox", emoji: "🦊", alike: ["box", "fog"] },
  { word: "bus", emoji: "🚌", alike: ["bug", "bun"] },
  { word: "hat", emoji: "🎩", alike: ["cat", "bat"] },
  { word: "fish", emoji: "🐟", alike: ["dish", "wish"] },
  { word: "cake", emoji: "🎂", alike: ["lake", "rake"] },
  { word: "moon", emoji: "🌙", alike: ["spoon", "noon"] },
  { word: "car", emoji: "🚗", alike: ["jar", "star"] },
  { word: "duck", emoji: "🦆", alike: ["luck", "truck"] },
  { word: "bee", emoji: "🐝", alike: ["tree", "beet"] },
  { word: "box", emoji: "📦", alike: ["fox", "boy"] },
  { word: "sock", emoji: "🧦", alike: ["rock", "lock"] },
  { word: "bear", emoji: "🐻", alike: ["pear", "bean"] },
  { word: "goat", emoji: "🐐", alike: ["boat", "coat"] },
  { word: "frog", emoji: "🐸", alike: ["dog", "log"] },
  { word: "bat", emoji: "🦇", alike: ["cat", "hat"] },
  { word: "map", emoji: "🗺️", alike: ["cap", "nap"] },
];

const FRAMES = ["Look at the ___!", "I like the ___.", "I can see the ___.", "Here is the ___."];

function clueDistractors(c: ClueWord, level: Level): string[] {
  if (level === 3) return c.alike;
  const others = CLUE_WORDS.filter((o) => o !== c).map((o) => o.word);
  return sample(level === 1 ? others.filter((w) => w[0] !== c.word[0]) : others, 2);
}

/** Point to the first letter, or to every letter when the wrong words start the same way. */
function clueTip(c: ClueWord, wrong: string[]): string {
  return wrong.every((w) => w[0] !== c.word[0])
    ? `Look for the word that starts with ${c.word[0]}.`
    : `Check every letter: ${spell(c.word)}.`;
}

function wordInBlank(c: ClueWord, level: Level): Question {
  const wrong = clueDistractors(c, level);
  return ask(
    "Use the picture. Which word fits?",
    quiet(c.word),
    wrong.map(quiet),
    `The picture shows a ${c.word}. ${clueTip(c, wrong)}`,
    { type: "emoji", emoji: c.emoji, caption: pick(FRAMES) },
    "Use the picture to help. Which word goes in the blank?",
  );
}

function sentenceForPicture(c: ClueWord, level: Level): Question {
  const wrong = clueDistractors(c, level);
  const frame = pick(FRAMES);
  const fill = (w: string) => frame.replace("___", w);
  return ask(
    "Which sentence matches the picture?",
    quiet(fill(c.word)),
    wrong.map((w) => quiet(fill(w))),
    `The picture shows a ${c.word}. Find the sentence with the word “${c.word}”.`,
    { type: "emoji", emoji: c.emoji },
  );
}

function pictureClues(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle(
    sample(CLUE_WORDS, 8).map((c, i) => (i < 5 ? wordInBlank(c, level) : sentenceForPicture(c, level))),
  );
}

// ---------- Course ----------

export const course: Course = {
  grade: "k",
  subject: "language",
  bigIdeas: {
    "ca-bc": [
      "Language and story can be a source of creativity and joy.",
      "Stories and other texts help us learn about ourselves and our families.",
      "Stories and other texts can be shared through pictures and words.",
      "Everyone has a unique story to share.",
      "Through listening and speaking, we connect with others and share our world.",
      "Playing with language helps us discover how language works.",
      "Curiosity and wonder lead us to new discoveries about ourselves and the world around us.",
    ],
  },
  units: [
    {
      id: "letter-partners",
      title: "Letter Partners",
      emoji: "🔤",
      blurb: "Match big and small letters",
      parentNote:
        "Matching capital (big) letters with their lowercase (small) partners, including look-alikes such as b, d, p and q.",
      standards: { "ca-bc": "Letter knowledge: upper- and lowercase letters" },
      generate: letterPartners,
    },
    {
      id: "first-sounds",
      title: "First Sounds",
      emoji: "👂",
      blurb: "What sound does it start with?",
      parentNote:
        "Hearing the first sound in a word (b in bus) and linking it to its letter. Say the words out loud together and stretch out the first sound.",
      standards: {
        "ca-bc": "Phonological awareness: beginning sounds; letter–sound relationships (sound-symbol correspondence)",
      },
      generate: firstSounds,
    },
    {
      id: "rhyme-time",
      title: "Rhyme Time",
      emoji: "🎵",
      blurb: "Words that sound alike",
      parentNote:
        "Hearing rhymes (cat, hat) and spotting a word that doesn't rhyme. Rhyming games build the listening skills behind reading.",
      standards: { "ca-bc": "Phonological awareness: rhyming" },
      generate: rhymeTime,
    },
    {
      id: "clap-the-beat",
      title: "Clap the Beat",
      emoji: "👏",
      blurb: "Clap the parts of words",
      parentNote:
        "Breaking words into syllables (ba-na-na) by clapping. Clap along out loud: one clap for each part you hear.",
      standards: { "ca-bc": "Phonological awareness: syllables" },
      generate: clapTheBeat,
    },
    {
      id: "sight-words",
      title: "Sight Words",
      emoji: "👀",
      blurb: "Words we know by sight",
      parentNote:
        "Recognizing common words such as the, see, can and my, plus colour and number words, by looking closely at their letters.",
      standards: { "ca-bc": "High-frequency (sight) words; concepts of print" },
      generate: sightWords,
    },
    {
      id: "story-order",
      title: "Story Order",
      emoji: "📖",
      blurb: "First, next and last",
      parentNote:
        "Putting events in order, and listening to short stories to tell what happened at the beginning, middle and end.",
      standards: { "ca-bc": "Story/text: story structure (beginning, middle, end); oral language: listening" },
      generate: storyOrder,
    },
    {
      id: "book-detectives",
      title: "Book Detectives",
      emoji: "📚",
      blurb: "Letters, words and books",
      parentNote:
        "How print works: telling letters, numbers, words and sentences apart, reading left to right and top to bottom, counting words, and what authors and illustrators do.",
      standards: { "ca-bc": "Concepts of print: letters, words, sentences, directionality and parts of a book" },
      generate: bookDetectives,
    },
    {
      id: "picture-clues",
      title: "Picture Clues",
      emoji: "🖼️",
      blurb: "Use pictures to read words",
      parentNote:
        "Using the picture and the first letter to read a word or a short sentence, a key early reading strategy.",
      standards: {
        "ca-bc": "Reading strategies: using pictures and first letters to make meaning; sound-symbol correspondence",
      },
      generate: pictureClues,
    },
  ],
};
