import { chance, pick, sample, shuffle, textChoice } from "../../random";
import type { Choice, Course, GenerateOptions, OrderQuestion, Question } from "../../types";

type Level = 1 | 2 | 3;
type Option = Omit<Choice, "id">;

const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

/** Set what read-aloud says for a question. */
function withSpeak<T extends Question>(q: T, speak: string): T {
  q.speak = speak;
  return q;
}

/** A choice that read-aloud skips, so hearing the choices doesn't give the answer away. */
const silent = (label: string): Option => ({ label, speak: "" });

// ---------- Shared picture words ----------

type Vowel = "a" | "e" | "i" | "o" | "u";
const VOWELS: Vowel[] = ["a", "e", "i", "o", "u"];

interface Pic {
  word: string;
  emoji: string;
  /** One entry per sound (phoneme), spelled the way it's written in the word. */
  sounds: string[];
  level: Level;
  /** The picture alone clearly names the word (needed when the word isn't shown). */
  clear: boolean;
  /** A vowel never offered in the gap: it would spell a sound-alike (s_n → "son") or an unkind word. */
  avoid?: Vowel;
}

const P = (word: string, emoji: string, sounds: string, level: Level, clear = true, avoid?: Vowel): Pic => ({
  word,
  emoji,
  sounds: sounds.split("-"),
  level,
  clear,
  avoid,
});

const PICS: Pic[] = [
  // short a
  P("cat", "🐱", "c-a-t", 1),
  P("hat", "🎩", "h-a-t", 1),
  P("bat", "🦇", "b-a-t", 1),
  P("map", "🗺️", "m-a-p", 1),
  P("van", "🚐", "v-a-n", 2),
  P("can", "🥫", "c-a-n", 2),
  P("hand", "✋", "h-a-n-d", 2),
  P("crab", "🦀", "c-r-a-b", 3),
  // short e
  P("bed", "🛏️", "b-e-d", 1),
  P("pen", "🖊️", "p-e-n", 1),
  P("ten", "🔟", "t-e-n", 1),
  P("web", "🕸️", "w-e-b", 2),
  P("bell", "🔔", "b-e-ll", 2),
  P("tent", "⛺", "t-e-n-t", 2),
  P("sled", "🛷", "s-l-e-d", 3),
  P("vest", "🦺", "v-e-s-t", 3, false),
  // short i
  P("pig", "🐷", "p-i-g", 1),
  P("six", "6️⃣", "s-i-x", 1, true, "e"),
  P("fish", "🐟", "f-i-sh", 1),
  P("milk", "🥛", "m-i-l-k", 2),
  P("ship", "🚢", "sh-i-p", 2),
  P("chick", "🐤", "ch-i-ck", 3, false),
  // short o
  P("dog", "🐶", "d-o-g", 1),
  P("fox", "🦊", "f-o-x", 1),
  P("box", "📦", "b-o-x", 1),
  P("sock", "🧦", "s-o-ck", 2, true, "u"),
  P("lock", "🔒", "l-o-ck", 2),
  P("rock", "🪨", "r-o-ck", 2),
  P("frog", "🐸", "f-r-o-g", 3),
  P("clock", "🕐", "c-l-o-ck", 3),
  // short u
  P("sun", "☀️", "s-u-n", 1, true, "o"),
  P("bus", "🚌", "b-u-s", 1),
  P("bug", "🐛", "b-u-g", 1, false),
  P("duck", "🦆", "d-u-ck", 2, true, "i"),
  P("drum", "🥁", "d-r-u-m", 2),
  P("truck", "🚚", "t-r-u-ck", 3),
  P("plug", "🔌", "p-l-u-g", 3),
  P("skunk", "🦨", "s-k-u-n-k", 3),
];

const pic = (p: { word: string; emoji: string }): Option => ({ label: p.word, emoji: p.emoji });
const vowelOf = (p: Pic): Vowel | undefined => p.sounds.find((s): s is Vowel => VOWELS.includes(s as Vowel));
const lastOf = <T>(items: T[]): T => items[items.length - 1];

// ---------- Blend It ----------

/** How read-aloud says each sound when we stretch a word out. */
const SAY: Record<string, string> = {
  a: "ah",
  e: "eh",
  i: "ih",
  o: "aw",
  u: "uh",
  b: "buh",
  c: "kuh",
  k: "kuh",
  ck: "kuh",
  d: "duh",
  f: "fff",
  g: "guh",
  h: "huh",
  l: "lll",
  ll: "lll",
  m: "mmm",
  n: "nnn",
  p: "puh",
  r: "rrr",
  s: "sss",
  t: "tuh",
  v: "vvv",
  w: "wuh",
  sh: "shhh",
  ch: "chuh",
};

const TWO_SOUNDS: Pic[] = [
  P("bee", "🐝", "b-ee", 1),
  P("key", "🔑", "k-ey", 1),
  P("cow", "🐄", "c-ow", 1),
  P("pie", "🥧", "p-ie", 1),
  P("tie", "👔", "t-ie", 1),
  P("egg", "🥚", "e-gg", 1),
];

const simpleSounds = (p: Pic) => !p.sounds.includes("x") && p.word !== "skunk";
const rimeOf = (p: Pic) => p.sounds.slice(1).join("");

/** Wrong pictures; harder levels share a first sound or an ending with the answer. */
function blendDistractors(t: Pic, count: number, level: Level): Pic[] {
  const others = PICS.filter((o) => o !== t && simpleSounds(o));
  if (level === 1) return sample(others.filter((o) => o.sounds[0] !== t.sounds[0]), count);
  const similar = sample(
    others.filter((o) => o.sounds[0] === t.sounds[0] || rimeOf(o) === rimeOf(t)),
    count,
  );
  return [...similar, ...sample(others.filter((o) => !similar.includes(o)), count - similar.length)];
}

const LAST_LETTERS = ["b", "d", "f", "g", "m", "n", "p", "s", "t"];
const LOOK_ALIKE: Record<string, string> = { b: "d", d: "b", m: "n", n: "m" };

function blendIt(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);

  const blendPool = PICS.filter(
    (p) =>
      simpleSounds(p) &&
      (level === 1
        ? p.level === 1 && p.sounds.length === 3
        : level === 2
          ? p.level <= 2 && p.sounds.length === 3
          : p.sounds.length === 4 || p.level >= 2),
  );
  const blends: Question[] = sample(blendPool, 4).map((t) =>
    withSpeak(
      textChoice(
        "Blend the sounds. Which picture is it?",
        pic(t),
        blendDistractors(t, level === 3 ? 3 : 2, level).map(pic),
        `Say the sounds faster and faster: ${t.sounds.join("-")}… ${t.word}!`,
        { type: "equation", text: t.sounds.join(" - ") },
      ),
      `Blend the sounds. ${t.sounds.map((s) => SAY[s] ?? s).join("... ")}. Which picture is it?`,
    ),
  );

  const countPool = [
    ...TWO_SOUNDS,
    ...PICS.filter(
      (p) =>
        simpleSounds(p) &&
        (level === 1 ? p.level === 1 && p.sounds.every((s) => s.length === 1) : level === 2 ? p.level <= 2 : true),
    ),
  ];
  const counts: Question[] = sample(countPool, 2).map((p) => {
    const n = p.sounds.length;
    const options = level === 3 ? [2, 3, 4, 5] : [2, 3, 4];
    return withSpeak(
      textChoice(
        `How many sounds do you hear in “${p.word}”?`,
        String(n),
        options.filter((o) => o !== n).map(String),
        `Say it slowly and hold up a finger for each sound: ${p.sounds.join("-")}.`,
        { type: "emoji", emoji: p.emoji, caption: p.word },
      ),
      `Say ${p.word} slowly. How many sounds do you hear in ${p.word}?`,
    );
  });

  const lastPool = PICS.filter((p) => {
    const last = lastOf(p.sounds);
    return p.clear && p.level <= level && (LAST_LETTERS.includes(last) || last === "k");
  });
  const lasts: Question[] = sample(lastPool, 2).map((p) => {
    const letter = lastOf(p.sounds);
    const partner = LOOK_ALIKE[letter];
    const rest = LAST_LETTERS.filter((l) => l !== letter && l !== partner);
    const wrong =
      level === 3 && partner
        ? [partner, ...sample(rest, 2)]
        : sample(level === 1 ? rest : LAST_LETTERS.filter((l) => l !== letter), level === 3 ? 3 : 2);
    return withSpeak(
      textChoice(
        "Which letter makes the last sound?",
        letter,
        wrong,
        `Say “${p.word}” slowly and listen to the very end.`,
        { type: "emoji", emoji: p.emoji, caption: p.sounds.slice(0, -1).join("") + "_" },
      ),
      "Say the name of the picture. Which letter makes the last sound?",
    );
  });

  return shuffle([...blends, ...counts, ...lasts]);
}

// ---------- Short Vowels ----------

const VOWEL_KEY: Record<Vowel, string> = { a: "apple", e: "elephant", i: "igloo", o: "octopus", u: "umbrella" };

// In many accents short a and short e sound close (bed / bad), so they never compete in one question.
const VOWEL_CLASH: Partial<Record<Vowel, Vowel>> = { a: "e", e: "a" };
const vowelRivals = (v: Vowel): Vowel[] => VOWELS.filter((x) => x !== v && x !== VOWEL_CLASH[v]);

function shortVowels(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const extra = level === 3 ? 3 : 2;
  const pool = PICS.filter((p) => p.level <= level);
  const withVowel = (v: Vowel) => pool.filter((p) => vowelOf(p) === v);

  const hear: Question[] = sample(VOWELS, 4).map((v) => {
    const right = pick(withVowel(v));
    const wrong = sample(vowelRivals(v), extra).map((w) => pick(withVowel(w)));
    return textChoice(
      `Which word has the short ${v} sound, like “${VOWEL_KEY[v]}”?`,
      pic(right),
      wrong.map(pic),
      `Say each word slowly; “${right.word}” has short ${v}: ${right.sounds.join("-")}.`,
    );
  });

  const gaps: Question[] = sample(
    pool.filter((p) => p.clear && p.sounds.length <= 4),
    4,
  ).map((p) => {
    const v = vowelOf(p)!;
    const wrong = sample(
      vowelRivals(v).filter((x) => x !== p.avoid),
      extra,
    );
    return withSpeak(
      textChoice(
        "Which letter is missing?",
        v,
        wrong,
        `Say “${p.word}” slowly. Listen for the sound in the middle!`,
        { type: "emoji", emoji: p.emoji, caption: p.sounds.map((s) => (s === v ? "_" : s)).join("") },
      ),
      "Say the name of the picture. Which letter is missing in the middle?",
    );
  });

  return shuffle([...hear, ...gaps]);
}

// ---------- Word Families ----------

const FAMILIES: Record<string, string[]> = {
  at: ["cat", "hat", "bat", "mat", "sat", "rat"],
  an: ["can", "van", "man", "pan", "fan", "ran"],
  ig: ["pig", "big", "dig", "wig", "fig"],
  op: ["hop", "top", "mop", "pop", "stop", "shop"],
  ug: ["bug", "hug", "mug", "rug", "jug", "tug"],
  en: ["hen", "pen", "ten", "men", "den"],
};

const FAMILY_PICS: Record<string, { word: string; emoji: string }[]> = {
  at: [
    { word: "cat", emoji: "🐱" },
    { word: "hat", emoji: "🎩" },
    { word: "bat", emoji: "🦇" },
  ],
  an: [
    { word: "can", emoji: "🥫" },
    { word: "van", emoji: "🚐" },
    { word: "man", emoji: "👨" },
  ],
  ug: [
    { word: "bug", emoji: "🐛" },
    { word: "mug", emoji: "☕" },
    { word: "plug", emoji: "🔌" },
  ],
  en: [
    { word: "pen", emoji: "🖊️" },
    { word: "ten", emoji: "🔟" },
  ],
  ig: [{ word: "pig", emoji: "🐷" }],
  op: [{ word: "stop", emoji: "🛑" }],
};

// -an and -en can sound alike (pan / pen), so they never compete in one question.
const FAMILY_CLASH: Record<string, string> = { an: "en", en: "an" };
const otherFamilies = (fam: string) => Object.keys(FAMILIES).filter((f) => f !== fam && f !== FAMILY_CLASH[fam]);
const wordsOutside = (fam: string) => otherFamilies(fam).flatMap((f) => FAMILIES[f]);
const onsetOf = (word: string, fam: string) => word.slice(0, word.length - fam.length);

function wordFamilies(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const extra = level === 3 ? 3 : 2;
  const [nFamily, nRhyme, nBuild, nOdd] = level === 1 ? [3, 3, 2, 0] : [2, 2, 2, 2];

  const family: Question[] = sample(Object.keys(FAMILIES), nFamily).map((fam) => {
    const right = pick(FAMILIES[fam]);
    const examples = sample(
      FAMILIES[fam].filter((w) => w !== right),
      2,
    );
    return textChoice(
      `Which word is in the “-${fam}” family?`,
      right,
      sample(wordsOutside(fam), extra),
      `Words in the -${fam} family end with “${fam}”, like ${examples.join(" and ")}.`,
      { type: "equation", text: `-${fam}` },
    );
  });

  const rhyme: Question[] = sample(
    Object.keys(FAMILY_PICS).filter((f) => FAMILY_PICS[f].length >= 2),
    nRhyme,
  ).map((fam) => {
    const [target, right] = sample(FAMILY_PICS[fam], 2);
    const wrong = sample(
      otherFamilies(fam).flatMap((f) => FAMILY_PICS[f]),
      extra,
    );
    return textChoice(
      `Which one rhymes with “${target.word}”?`,
      pic(right),
      wrong.map(pic),
      `Rhyming words sound the same at the end: ${target.word}, ${right.word}!`,
      { type: "emoji", emoji: target.emoji, caption: target.word },
    );
  });

  // Level 3 swaps the first sound; levels 1–2 put a first sound and an ending together.
  const build: Question[] = sample(Object.keys(FAMILIES), nBuild).map((fam) => {
    const singles = FAMILIES[fam].filter((w) => onsetOf(w, fam).length === 1);
    const [w1, w2] = sample(singles, 2);
    const o1 = onsetOf(w1, fam);
    const o2 = onsetOf(w2, fam);
    const outside = wordsOutside(fam);
    if (level === 3) {
      const sameStart = outside.filter((w) => w.startsWith(o2));
      return textChoice(
        `Change “${o1}” to “${o2}” in “${w1}”. What new word?`,
        w2,
        [w1, sameStart.length ? pick(sameStart) : pick(outside)],
        `Keep the ending “${fam}” and put “${o2}” in front: ${o2} + ${fam}.`,
        { type: "equation", text: w1 },
      );
    }
    const sameStart = outside.filter((w) => w.startsWith(o1));
    return textChoice(
      "Put the sounds together. What word is it?",
      w1,
      [w2, sameStart.length ? pick(sameStart) : pick(outside)],
      `Say the first sound, then the ending: ${o1}… ${fam}… ${w1}!`,
      { type: "equation", text: `${o1} + ${fam}` },
    );
  });

  const odd: Question[] = sample(Object.keys(FAMILIES), nOdd).map((fam) => {
    const members = sample(FAMILIES[fam], extra);
    return textChoice(
      "Which word does not rhyme with the others?",
      pick(wordsOutside(fam)),
      members,
      `${members.join(", ")} all end with “${fam}”. Which one doesn't?`,
    );
  });

  return shuffle([...family, ...rhyme, ...build, ...odd]);
}

// ---------- Sh, Ch, Th ----------

type Digraph = "sh" | "ch" | "th";
const DIGRAPHS: Digraph[] = ["sh", "ch", "th"];

const STARTS: Record<Digraph, { word: string; emoji: string }[]> = {
  sh: [
    { word: "ship", emoji: "🚢" },
    { word: "shell", emoji: "🐚" },
    { word: "sheep", emoji: "🐑" },
    { word: "shark", emoji: "🦈" },
    { word: "shorts", emoji: "🩳" },
  ],
  ch: [
    { word: "chair", emoji: "🪑" },
    { word: "cheese", emoji: "🧀" },
    { word: "chick", emoji: "🐤" },
    { word: "cherries", emoji: "🍒" },
    { word: "chocolate", emoji: "🍫" },
  ],
  th: [
    { word: "thumb", emoji: "👍" },
    { word: "three", emoji: "3️⃣" },
    { word: "thread", emoji: "🧵" },
  ],
};

const ENDS: Record<Digraph, { word: string; emoji: string }[]> = {
  sh: [
    { word: "fish", emoji: "🐟" },
    { word: "paintbrush", emoji: "🖌️" },
  ],
  ch: [
    { word: "peach", emoji: "🍑" },
    { word: "beach", emoji: "🏖️" },
    { word: "sandwich", emoji: "🥪" },
    { word: "couch", emoji: "🛋️" },
  ],
  th: [
    { word: "tooth", emoji: "🦷" },
    { word: "bath", emoji: "🛁" },
    { word: "mouth", emoji: "👄" },
  ],
};

/** Words that start with just the first letter of the pair (s, c, t): a stretch trap. */
const SINGLES: Record<Digraph, { word: string; emoji: string }[]> = {
  sh: [
    { word: "sun", emoji: "☀️" },
    { word: "sock", emoji: "🧦" },
    { word: "seal", emoji: "🦭" },
  ],
  ch: [
    { word: "cat", emoji: "🐱" },
    { word: "car", emoji: "🚗" },
    { word: "cake", emoji: "🎂" },
  ],
  th: [
    { word: "tent", emoji: "⛺" },
    { word: "tiger", emoji: "🐯" },
    { word: "turtle", emoji: "🐢" },
  ],
};

const SPELL: Record<Digraph, string> = { sh: "s h", ch: "c h", th: "t h" };
const START_LIKE: Record<Digraph, string> = { sh: "shop", ch: "chin", th: "think" };
const END_LIKE: Record<Digraph, string> = { sh: "wash", ch: "lunch", th: "math" };
const digraphChoices = (): Option[] => DIGRAPHS.map((d) => ({ label: d, speak: SPELL[d] }));

function shChTh(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const [nStart, nLetters, nEnd] = level === 1 ? [4, 4, 0] : level === 2 ? [3, 3, 2] : [3, 2, 3];

  const startWords = shuffle(DIGRAPHS.flatMap((dg) => STARTS[dg].map((w) => ({ dg, ...w }))));
  const startQs = startWords.slice(0, nStart);
  const letterQs = startWords.slice(nStart, nStart + nLetters);
  const endWords = shuffle(DIGRAPHS.flatMap((dg) => ENDS[dg].map((w) => ({ dg, ...w }))));

  const starts: Question[] = startQs.map((t) => {
    const others = DIGRAPHS.filter((d) => d !== t.dg).flatMap((d) => STARTS[d]);
    const wrong = level === 3 ? [pick(SINGLES[t.dg]), ...sample(others, 2)] : sample(others, 2);
    return withSpeak(
      textChoice(
        `Which word starts with “${t.dg}”?`,
        pic(t),
        wrong.map(pic),
        `Say each word slowly. “${t.word}” starts with ${t.dg}.`,
      ),
      `Which word starts with ${SPELL[t.dg]}, like ${START_LIKE[t.dg]}?`,
    );
  });

  // At level 3, some "which letters" questions use the end of the word.
  const letterTargets = letterQs.map((t) => ({ ...t, atEnd: false }));
  if (level === 3 && chance(0.5)) {
    const e = endWords.pop()!;
    letterTargets[0] = { ...e, atEnd: true };
  }
  const letterQuestions: Question[] = letterTargets.map((t) => {
    const choices = digraphChoices();
    const where = t.atEnd ? "end" : "start";
    return withSpeak(
      textChoice(
        `Which two letters ${where} this word?`,
        choices.find((c) => c.label === t.dg)!,
        choices.filter((c) => c.label !== t.dg),
        `Say “${t.word}” slowly. Listen to the ${where}!`,
        { type: "emoji", emoji: t.emoji, caption: t.atEnd ? t.word.slice(0, -2) + "__" : "__" + t.word.slice(2) },
      ),
      `Say the name of the picture. Which two letters does it ${where} with?`,
    );
  });

  const ends: Question[] = endWords.slice(0, nEnd).map((t) => {
    const others = DIGRAPHS.filter((d) => d !== t.dg).flatMap((d) => ENDS[d]);
    const wrong = level === 3 ? [pick(STARTS[t.dg]), ...sample(others, 2)] : sample(others, 2);
    return withSpeak(
      textChoice(
        `Which word ends with “${t.dg}”?`,
        pic(t),
        wrong.map(pic),
        `Listen to the very end of each word. “${t.word}” ends with ${t.dg}.`,
      ),
      `Which word ends with ${SPELL[t.dg]}, like ${END_LIKE[t.dg]}?`,
    );
  });

  return shuffle([...starts, ...letterQuestions, ...ends]);
}

// ---------- Sight Words ----------

interface SightWord {
  word: string;
  level: Level;
  /** Real words that look a lot like it. */
  lookAlikes: string[];
  /** Common misspellings. */
  misspell: string[];
}

const SIGHT: SightWord[] = [
  { word: "the", level: 1, lookAlikes: ["then", "she", "he"], misspell: ["teh", "thu"] },
  { word: "was", level: 1, lookAlikes: ["saw", "has", "way"], misspell: ["wuz", "wos"] },
  { word: "said", level: 1, lookAlikes: ["sad", "side", "sand"], misspell: ["sed", "siad"] },
  { word: "they", level: 1, lookAlikes: ["then", "them", "the"], misspell: ["thay", "tehy"] },
  { word: "have", level: 1, lookAlikes: ["has", "had", "hive"], misspell: ["hav", "haev"] },
  { word: "like", level: 1, lookAlikes: ["lake", "look", "lick"], misspell: ["lik", "liek"] },
  { word: "with", level: 1, lookAlikes: ["wish", "will", "wit"], misspell: ["wiht", "wif"] },
  { word: "come", level: 2, lookAlikes: ["came", "some", "cone"], misspell: ["kum", "coem"] },
  { word: "here", level: 2, lookAlikes: ["her", "hare", "there"], misspell: ["heer", "hier"] },
  { word: "there", level: 2, lookAlikes: ["three", "these", "where"], misspell: ["thar", "ther"] },
  { word: "what", level: 2, lookAlikes: ["that", "want", "wait"], misspell: ["wat", "whut"] },
  { word: "where", level: 2, lookAlikes: ["were", "there", "here"], misspell: ["wher", "whare"] },
  { word: "who", level: 2, lookAlikes: ["how", "why", "two"], misspell: ["hoo", "woh"] },
  { word: "could", level: 3, lookAlikes: ["cold", "cloud", "would"], misspell: ["cud", "culd"] },
  { word: "would", level: 3, lookAlikes: ["world", "could", "word"], misspell: ["wud", "wuld"] },
];

const CLOZE: { text: string; right: string; wrong: [string, string] }[] = [
  { text: "I can ☐ the moon.", right: "see", wrong: ["was", "the"] },
  { text: "☐ is my hat?", right: "Where", wrong: ["They", "Said"] },
  { text: "I ☐ a big dog.", right: "have", wrong: ["of", "they"] },
  { text: "Can you ☐ to my house?", right: "come", wrong: ["here", "said"] },
  { text: "Look at ☐ big bird!", right: "the", wrong: ["was", "who"] },
  { text: "☐ is at the door?", right: "Who", wrong: ["Have", "Said"] },
  { text: "I ☐ to play.", right: "like", wrong: ["the", "where"] },
  { text: "They ☐ my friends.", right: "are", wrong: ["of", "said"] },
  { text: "I play ☐ my friend.", right: "with", wrong: ["what", "they"] },
  { text: "Mom ☐, “Time for bed.”", right: "said", wrong: ["have", "where"] },
  { text: "The cat ☐ asleep.", right: "was", wrong: ["they", "come"] },
  { text: "☐ do you like to eat?", right: "What", wrong: ["Here", "They"] },
  { text: "☐ went to the park.", right: "They", wrong: ["Was", "Said"] },
];

const spellOut = (w: string) => w.split("").join("-");

function sightWords(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const [nFind, nCloze, nSpell] = level === 1 ? [4, 2, 2] : level === 2 ? [3, 3, 2] : [2, 3, 3];
  const pool = SIGHT.filter((s) => s.level <= level);
  const targets = sample(pool, nFind + nSpell);

  const find: Question[] = targets.slice(0, nFind).map((s) => {
    const wrong =
      level === 1
        ? sample(
            SIGHT.filter((o) => o.word[0] !== s.word[0]).map((o) => o.word),
            2,
          )
        : sample(s.lookAlikes, level === 3 ? 3 : 2);
    return textChoice(
      `Find the word “${s.word}”.`,
      silent(s.word),
      wrong.map(silent),
      `Look at each letter in order: ${spellOut(s.word)}.`,
    );
  });

  const spell: Question[] = targets.slice(nFind).map((s) =>
    textChoice(
      `Which is the right way to spell “${s.word}”?`,
      silent(s.word),
      s.misspell.map(silent),
      `“${s.word}” is spelled ${spellOut(s.word)}. Try writing it in the air!`,
    ),
  );

  const cloze: Question[] = sample(CLOZE, nCloze).map((c) =>
    textChoice(
      `Which word fits? ${c.text}`,
      c.right,
      c.wrong,
      "Read the sentence with each word. Which one makes sense?",
    ),
  );

  return shuffle([...find, ...cloze, ...spell]);
}

// ---------- Sentences ----------

const GOOD_SENTENCES = [
  "The cat is big.",
  "I can run fast.",
  "We like to play.",
  "My hat is red.",
  "Sam has a pet fish.",
  "The sun is hot.",
  "I see a bug.",
  "We go to the park.",
  "The fish can swim.",
  "Ana has a red ball.",
  "Leo can hop.",
  "Mom and I sit.",
];

const TELLING = ["The dog can run", "I like my hat", "We sat on the rug", "The bus is big", "Dad made a cake", "Jay has a red cap"];
const ASKING = ["Can you hop", "Is the cat asleep", "Where is my sock", "Do you like jam", "What is in the box", "Who is at the door"];

const COMPLETE: { right: string; wrong: [string, string] }[] = [
  { right: "The dog runs fast.", wrong: ["The big dog.", "Runs very fast."] },
  { right: "Maya reads a book.", wrong: ["A red book.", "Reads a book."] },
  { right: "We play in the snow.", wrong: ["In the snow.", "The cold snow."] },
  { right: "The bird sings.", wrong: ["The little bird.", "Up in the tree."] },
  { right: "Leo eats an apple.", wrong: ["A big red apple.", "Eats an apple."] },
  { right: "The fish swims.", wrong: ["In the pond.", "The orange fish."] },
  { right: "I like my hat.", wrong: ["My new hat.", "On my head."] },
  { right: "Ravi has a kite.", wrong: ["A blue kite.", "Up in the sky."] },
];

const COUNT_WORDS = [
  "I like my cat.",
  "We can play.",
  "The dog is big.",
  "Sam has a red hat.",
  "I see the sun.",
  "My mom can sing.",
  "We go to the big park.",
  "Ana can hop.",
  "Leo and I like to swim.",
  "The bug is on the rug.",
];

const NOUNS = ["cat", "girl", "tree", "apple", "school", "house", "car", "chair", "teacher", "pencil", "horse", "frog"];
const VERBS = ["sit", "eat", "sing", "hop", "clap", "go", "see", "swim"];
const ADJECTIVES = ["big", "happy", "soft", "tall", "little", "funny", "sleepy", "wet"];
const NAMES = ["maya", "leo", "zoe", "kenji", "priya", "ana", "noah", "ravi", "sam", "amir", "lena", "jay"];
const PLAIN_WORDS = ["cat", "ball", "tree", "park", "book", "apple", "house", "run"];

function sentences(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);

  const rightWay: Question[] = sample(GOOD_SENTENCES, 2).map((s) => {
    const lower = s[0].toLowerCase() + s.slice(1);
    const wrong = [lower, s.slice(0, -1)];
    if (level === 3) wrong.push(lower.slice(0, -1));
    return textChoice(
      "Which sentence is written the right way?",
      silent(s),
      wrong.map(silent),
      "A sentence starts with a capital letter and ends with a period.",
    );
  });

  const marks = [
    { label: ".", speak: "period" },
    { label: "?", speak: "question mark" },
    { label: ",", speak: "comma" },
  ];
  const endMarks: Question[] = [
    { text: pick(TELLING), mark: "." },
    { text: pick(ASKING), mark: "?" },
  ].map((e) => {
    const options = level === 1 ? marks.slice(0, 2) : marks;
    return withSpeak(
      textChoice(
        "Which mark goes at the end?",
        options.find((m) => m.label === e.mark)!,
        options.filter((m) => m.label !== e.mark),
        e.mark === "."
          ? "This sentence tells something, so it ends with a period."
          : "This sentence asks something, so it ends with a question mark.",
        { type: "equation", text: `${e.text} ☐` },
      ),
      `Read it: ${e.text}. Which mark goes at the end?`,
    );
  });

  const c = pick(COMPLETE);
  const complete = textChoice(
    "Which one is a whole sentence?",
    c.right,
    c.wrong,
    "A whole sentence tells who or what, and what they do.",
  );

  const s = pick(COUNT_WORDS);
  const n = s.split(" ").length;
  const countWords = textChoice(
    "How many words are in this sentence?",
    String(n),
    (level === 3 ? [n - 1, n + 1, n + 2] : [n - 1, n + 1]).map(String),
    "Touch each word as you read it, and count as you go.",
    { type: "story", lines: [s] },
  );

  const naming = textChoice(
    "Which word is a naming word?",
    pick(NOUNS),
    level === 3 ? [...sample(VERBS, 2), pick(ADJECTIVES)] : [pick(VERBS), pick(ADJECTIVES)],
    "A naming word names a person, animal, place or thing.",
  );

  const capital = textChoice(
    "Which word needs a capital letter?",
    pick(NAMES),
    sample(PLAIN_WORDS, level === 3 ? 3 : 2),
    "People's names always start with a capital letter.",
  );

  return shuffle([...rightWay, ...endMarks, complete, countWords, naming, capital]);
}

// ---------- Story Time ----------

interface Ask {
  prompt: string;
  right: Option;
  wrong: Option[];
  hint: string;
}

interface Story {
  lines: string[];
  who: Ask;
  where: Ask;
  /** A thinking question (feelings, why, details) for the stretch level. */
  think: Ask;
  /** Three events, in order. */
  events: { label: string; emoji: string }[];
}

const STORIES: Story[] = [
  {
    lines: [
      "Kenji went to the park with his dad.",
      "He had a big red kite.",
      "The wind took the kite up high.",
      "Kenji and his dad had lots of fun.",
    ],
    who: {
      prompt: "Who had a red kite?",
      right: { label: "Kenji", emoji: "👦" },
      wrong: [
        { label: "a bird", emoji: "🐦" },
        { label: "Zoe", emoji: "👧" },
      ],
      hint: "Look at the first two lines. Who went to the park?",
    },
    where: {
      prompt: "Where did Kenji go?",
      right: { label: "to the park", emoji: "🌳" },
      wrong: [
        { label: "to the beach", emoji: "🏖️" },
        { label: "to the store", emoji: "🏪" },
      ],
      hint: "The first line tells where Kenji went.",
    },
    think: {
      prompt: "How did Kenji feel?",
      right: { label: "happy", emoji: "😄" },
      wrong: [
        { label: "sad", emoji: "😢" },
        { label: "scared", emoji: "😨" },
      ],
      hint: "Kenji had lots of fun, and fun feels happy!",
    },
    events: [
      { label: "Kenji went to the park.", emoji: "🌳" },
      { label: "The wind took the kite up.", emoji: "🪁" },
      { label: "They had lots of fun.", emoji: "😄" },
    ],
  },
  {
    lines: [
      "Zoe played in the snow.",
      "She lost her red mitten.",
      "Her dog, Pip, dug in the snow and found it!",
      "Zoe gave Pip a big hug.",
    ],
    who: {
      prompt: "Who found the mitten?",
      right: { label: "Pip the dog", emoji: "🐶" },
      wrong: [
        { label: "Zoe", emoji: "👧" },
        { label: "a cat", emoji: "🐱" },
      ],
      hint: "Look at line three. Who dug in the snow?",
    },
    where: {
      prompt: "Where did Zoe play?",
      right: { label: "in the snow", emoji: "❄️" },
      wrong: [
        { label: "at the beach", emoji: "🏖️" },
        { label: "in a pool", emoji: "🏊" },
      ],
      hint: "The first line tells where Zoe played.",
    },
    think: {
      prompt: "How did Zoe feel when Pip found it?",
      right: { label: "happy", emoji: "😄" },
      wrong: [
        { label: "sad", emoji: "😢" },
        { label: "angry", emoji: "😠" },
      ],
      hint: "Zoe gave Pip a big hug, and we hug when we feel happy!",
    },
    events: [
      { label: "Zoe played in the snow.", emoji: "❄️" },
      { label: "Pip found the mitten.", emoji: "🧤" },
      { label: "Zoe hugged Pip.", emoji: "🤗" },
    ],
  },
  {
    lines: [
      "Amir and his grandma made a cake in the kitchen.",
      "Amir mixed the eggs and flour.",
      "Grandma put the cake in the hot oven.",
      "Then the whole family ate the cake.",
    ],
    who: {
      prompt: "Who made a cake with Amir?",
      right: { label: "his grandma", emoji: "👵" },
      wrong: [
        { label: "his friend Leo", emoji: "👦" },
        { label: "a cat", emoji: "🐱" },
      ],
      hint: "Look at the first line. Amir made a cake with…",
    },
    where: {
      prompt: "Where did they make the cake?",
      right: { label: "in the kitchen", emoji: "🍳" },
      wrong: [
        { label: "at the park", emoji: "🌳" },
        { label: "at school", emoji: "🏫" },
      ],
      hint: "The first line tells where they made the cake.",
    },
    think: {
      prompt: "Why did the cake go in the oven?",
      right: { label: "to bake it", emoji: "🎂" },
      wrong: [
        { label: "to hide it", emoji: "🙈" },
        { label: "to make it cold", emoji: "🧊" },
      ],
      hint: "An oven is hot, and the heat bakes the cake.",
    },
    events: [
      { label: "Amir mixed eggs and flour.", emoji: "🥚" },
      { label: "The cake went in the oven.", emoji: "🔥" },
      { label: "The family ate the cake.", emoji: "🍰" },
    ],
  },
  {
    lines: [
      "Priya sat by the pond.",
      "A green frog hopped onto a log.",
      "Splash! The frog jumped into the water.",
      "Priya laughed and waved bye-bye.",
    ],
    who: {
      prompt: "Who hopped onto a log?",
      right: { label: "a frog", emoji: "🐸" },
      wrong: [
        { label: "Priya", emoji: "👧" },
        { label: "a duck", emoji: "🦆" },
      ],
      hint: "Look at line two. Who was green?",
    },
    where: {
      prompt: "Where did Priya sit?",
      right: { label: "by the pond", emoji: "🏞️" },
      wrong: [
        { label: "in a tree", emoji: "🌳" },
        { label: "on a bus", emoji: "🚌" },
      ],
      hint: "The first line tells where Priya sat.",
    },
    think: {
      prompt: "Why did Priya laugh?",
      right: { label: "The frog made a splash.", emoji: "💦" },
      wrong: [
        { label: "She was cold.", emoji: "🥶" },
        { label: "She lost her hat.", emoji: "🎩" },
      ],
      hint: "Splash! The frog's big jump was funny.",
    },
    events: [
      { label: "Priya sat by the pond.", emoji: "🏞️" },
      { label: "The frog jumped into the water.", emoji: "💦" },
      { label: "Priya waved bye-bye.", emoji: "👋" },
    ],
  },
  {
    lines: [
      "Ravi went to the library with his mom.",
      "He found a book about sharks.",
      "He read it in a big, soft chair.",
      "Then he took the book home to share with his sister.",
    ],
    who: {
      prompt: "Who went to the library with Ravi?",
      right: { label: "his mom", emoji: "👩" },
      wrong: [
        { label: "his dad", emoji: "👨" },
        { label: "his dog", emoji: "🐶" },
      ],
      hint: "Look at the first line. Ravi went with his…",
    },
    where: {
      prompt: "Where did Ravi find a book?",
      right: { label: "at the library", emoji: "📚" },
      wrong: [
        { label: "at the beach", emoji: "🏖️" },
        { label: "at the zoo", emoji: "🦁" },
      ],
      hint: "The first line tells where Ravi went.",
    },
    think: {
      prompt: "What was Ravi's book about?",
      right: { label: "sharks", emoji: "🦈" },
      wrong: [
        { label: "trucks", emoji: "🚚" },
        { label: "cats", emoji: "🐱" },
      ],
      hint: "Look at line two. Ravi found a book about…",
    },
    events: [
      { label: "Ravi went to the library.", emoji: "📚" },
      { label: "He read in a soft chair.", emoji: "🪑" },
      { label: "He took the book home.", emoji: "🏠" },
    ],
  },
];

function storyQuestions(story: Story, level: Level): Question[] {
  const visual = { type: "story" as const, lines: story.lines };
  const ask = (a: Ask) => textChoice(a.prompt, a.right, a.wrong, a.hint, visual);
  const [first, ...later] = story.events;
  const order: OrderQuestion = {
    kind: "order",
    prompt: "Tap what happened, from first to last.",
    hint: "Read the story again from the top. What happened first?",
    visual,
    items: story.events.map((e, i) => ({ id: `e${i}`, ...e })),
  };
  return [
    ask(story.who),
    ask(story.where),
    level === 3
      ? ask(story.think)
      : textChoice("What happened first?", first, later, "Look at the top of the story to see how it starts.", visual),
    order,
  ];
}

function storyTime(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return sample(STORIES, 2).flatMap((s) => storyQuestions(s, level));
}

// ---------- Describing Words ----------

const OPPOSITES: [{ word: string; emoji: string }, { word: string; emoji: string }][] = [
  [
    { word: "hot", emoji: "🔥" },
    { word: "cold", emoji: "🧊" },
  ],
  [
    { word: "big", emoji: "🐘" },
    { word: "small", emoji: "🐭" },
  ],
  [
    { word: "happy", emoji: "😀" },
    { word: "sad", emoji: "😢" },
  ],
  [
    { word: "up", emoji: "⬆️" },
    { word: "down", emoji: "⬇️" },
  ],
  [
    { word: "day", emoji: "☀️" },
    { word: "night", emoji: "🌙" },
  ],
  [
    { word: "fast", emoji: "🐇" },
    { word: "slow", emoji: "🐢" },
  ],
  [
    { word: "loud", emoji: "📢" },
    { word: "quiet", emoji: "🤫" },
  ],
  [
    { word: "open", emoji: "📖" },
    { word: "closed", emoji: "📕" },
  ],
];

const DESCRIBE: { emoji: string; caption?: string; right: string; wrong: [string, string, string] }[] = [
  { emoji: "🧊", caption: "ice", right: "cold", wrong: ["hot", "fuzzy", "loud"] },
  { emoji: "🔥", caption: "fire", right: "hot", wrong: ["cold", "wet", "fluffy"] },
  { emoji: "🐢", caption: "turtle", right: "slow", wrong: ["fast", "fluffy", "loud"] },
  { emoji: "🍋", caption: "lemon", right: "sour", wrong: ["sweet", "fluffy", "loud"] },
  { emoji: "🐘", caption: "elephant", right: "big", wrong: ["tiny", "spiky", "fluffy"] },
  { emoji: "🐜", caption: "ant", right: "tiny", wrong: ["huge", "fluffy", "loud"] },
  { emoji: "🌵", caption: "cactus", right: "spiky", wrong: ["soft", "fluffy", "loud"] },
  { emoji: "🧸", caption: "teddy bear", right: "soft", wrong: ["spiky", "hot", "sour"] },
  { emoji: "🦒", caption: "giraffe", right: "tall", wrong: ["short", "spiky", "tiny"] },
  { emoji: "❄️", caption: "snowflake", right: "cold", wrong: ["hot", "loud", "furry"] },
  { emoji: "🍭", caption: "lollipop", right: "sweet", wrong: ["salty", "furry", "loud"] },
  { emoji: "⚽", caption: "ball", right: "round", wrong: ["square", "spiky", "furry"] },
  { emoji: "😴", right: "sleepy", wrong: ["angry", "loud", "fast"] },
  { emoji: "🐰", caption: "bunny", right: "fluffy", wrong: ["spiky", "huge", "slimy"] },
];

const FIND_DESCRIBING: { text: string; right: string; wrong: [string, string, string] }[] = [
  { text: "Ana has a soft cat.", right: "soft", wrong: ["Ana", "has", "cat"] },
  { text: "Leo sees a red bus.", right: "red", wrong: ["Leo", "sees", "bus"] },
  { text: "Sam ate a sweet plum.", right: "sweet", wrong: ["Sam", "ate", "plum"] },
  { text: "Zoe hugs her little dog.", right: "little", wrong: ["Zoe", "hugs", "dog"] },
  { text: "Jay drank cold milk.", right: "cold", wrong: ["Jay", "drank", "milk"] },
  { text: "Maya found a tiny bug.", right: "tiny", wrong: ["Maya", "found", "bug"] },
  { text: "Noah kicks the big ball.", right: "big", wrong: ["Noah", "kicks", "ball"] },
  { text: "Priya has a happy puppy.", right: "happy", wrong: ["Priya", "has", "puppy"] },
  { text: "Ravi wore his blue hat.", right: "blue", wrong: ["Ravi", "wore", "hat"] },
];

function describingWords(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const extra = level === 3 ? 3 : 2;

  const opposites: Question[] = sample(OPPOSITES, 3).map((pair) => {
    const [ask, answer] = chance(0.5) ? pair : [pair[1], pair[0]];
    const wrong = sample(
      OPPOSITES.filter((p) => p !== pair).flat(),
      extra,
    );
    return textChoice(
      `What is the opposite of “${ask.word}”?`,
      pic(answer),
      wrong.map(pic),
      `Opposites are as different as can be, like ${ask.word} and ${answer.word}.`,
      { type: "emoji", emoji: ask.emoji, caption: ask.word },
    );
  });

  const pictures: Question[] = sample(DESCRIBE, 3).map((d) =>
    textChoice(
      "Which word tells about the picture?",
      d.right,
      sample(d.wrong, extra),
      "Think about how it looks, feels, tastes or sounds.",
      { type: "emoji", emoji: d.emoji, caption: d.caption },
    ),
  );

  const inSentence: Question[] = sample(FIND_DESCRIBING, 2).map((f) =>
    textChoice(
      `Find the describing word: “${f.text}”`,
      f.right,
      sample(f.wrong, extra),
      "A describing word tells what something is like, such as big, red or soft.",
    ),
  );

  return shuffle([...opposites, ...pictures, ...inSentence]);
}

// ---------- More Than One ----------

const PLURALS: { one: string; emoji: string }[] = [
  { one: "cat", emoji: "🐱" },
  { one: "dog", emoji: "🐶" },
  { one: "hat", emoji: "🎩" },
  { one: "pig", emoji: "🐷" },
  { one: "duck", emoji: "🦆" },
  { one: "frog", emoji: "🐸" },
  { one: "ball", emoji: "⚽" },
  { one: "star", emoji: "⭐" },
  { one: "tree", emoji: "🌳" },
  { one: "car", emoji: "🚗" },
  { one: "apple", emoji: "🍎" },
  { one: "egg", emoji: "🥚" },
  { one: "bee", emoji: "🐝" },
  { one: "kite", emoji: "🪁" },
  { one: "cake", emoji: "🎂" },
  { one: "book", emoji: "📕" },
  { one: "bird", emoji: "🐦" },
  { one: "drum", emoji: "🥁" },
];

const ES_PLURALS: { one: string; many: string; wrong: string; emoji: string }[] = [
  { one: "box", many: "boxes", wrong: "boxs", emoji: "📦" },
  { one: "fox", many: "foxes", wrong: "foxs", emoji: "🦊" },
  { one: "bus", many: "buses", wrong: "buss", emoji: "🚌" },
  { one: "peach", many: "peaches", wrong: "peachs", emoji: "🍑" },
  { one: "watch", many: "watches", wrong: "watchs", emoji: "⌚" },
];

const NUMBER_WORDS: [string, number][] = [
  ["two", 2],
  ["three", 3],
  ["four", 4],
];

const FRAMES = ["I see ☐.", "We have ☐.", "There are ☐."];

const repeat = (emoji: string, n: number) => Array.from({ length: n }, () => emoji);

function moreThanOne(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const [nTwo, nOneMore, nWhich, nFill, nEs] =
    level === 1 ? [4, 2, 2, 0, 0] : level === 2 ? [3, 2, 1, 2, 0] : [2, 1, 1, 2, 2];
  const words = sample(PLURALS, nTwo + nOneMore + nWhich + nFill);
  let used = 0;
  const take = (n: number) => words.slice(used, (used += n));
  const otherPlural = (one: string) => `${pick(PLURALS.filter((p) => p.one !== one)).one}s`;

  const twos: Question[] = take(nTwo).map((w) => {
    const wrong = [w.one, otherPlural(w.one)];
    if (level === 3 && !w.one.endsWith("e")) wrong.push(`${w.one}es`);
    return textChoice(
      `One ${w.one}, two ☐. Which word?`,
      `${w.one}s`,
      wrong,
      `For more than one, add -s to the end: ${w.one} → ${w.one}s.`,
      { type: "emojiRow", items: repeat(w.emoji, 2) },
    );
  });

  const oneOrMore: Question[] = take(nOneMore).map((w) => {
    const plural = chance(0.5);
    const word = plural ? `${w.one}s` : w.one;
    const one = { label: "one", emoji: w.emoji };
    const more = { label: "more than one", emoji: w.emoji + w.emoji };
    return textChoice(
      `Does “${word}” mean one or more than one?`,
      plural ? more : one,
      [plural ? one : more],
      plural
        ? `The -s at the end of “${word}” means more than one.`
        : `“${word}” has no -s at the end, so it means just one.`,
    );
  });

  const which: Question[] = take(nWhich).map((w) =>
    textChoice(
      "Which word means more than one?",
      `${w.one}s`,
      sample(
        PLURALS.filter((p) => p.one !== w.one).map((p) => p.one),
        level === 3 ? 3 : 2,
      ),
      "Look for a naming word with -s added to the end.",
    ),
  );

  const fills: Question[] = take(nFill).map((w) => {
    const [numberWord, n] = pick(NUMBER_WORDS);
    const frame = pick(FRAMES).replace("☐", `${numberWord} ☐`);
    return textChoice(
      `Which word fits? “${frame}”`,
      `${w.one}s`,
      [w.one, otherPlural(w.one)],
      `There is more than one ${w.one}, so add -s: ${w.one}s.`,
      { type: "emojiRow", items: repeat(w.emoji, n) },
    );
  });

  const es: Question[] = sample(ES_PLURALS, nEs).map((w) =>
    textChoice(
      `One ${w.one}, two ☐. Which word?`,
      w.many,
      [w.wrong, w.one],
      `Words that end in s, x, ch or sh add -es, like ${w.one} → ${w.many}.`,
      { type: "emojiRow", items: repeat(w.emoji, 2) },
    ),
  );

  return shuffle([...twos, ...oneOrMore, ...which, ...fills, ...es]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "1",
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
      id: "blend-it",
      title: "Blend It",
      emoji: "🧩",
      blurb: "Put sounds together",
      parentNote:
        "Blending sounds into words (s-u-n makes sun), counting the sounds in a word and hearing the last sound. These listening skills are the base of reading and spelling.",
      standards: { "ca-bc": "Phonological awareness: phoneme blending and segmenting; letter–sound relationships" },
      generate: blendIt,
    },
    {
      id: "short-vowels",
      title: "Short Vowels",
      emoji: "🍎",
      blurb: "a, e, i, o, u",
      parentNote:
        "Hearing the short vowel in the middle of words like cat, bed, pig, dog and sun, and filling in the missing vowel to spell the word.",
      standards: { "ca-bc": "Letter–sound relationships: short vowels; spelling of simple words" },
      generate: shortVowels,
    },
    {
      id: "word-families",
      title: "Word Families",
      emoji: "🏠",
      blurb: "-at, -ig, -op and more",
      parentNote:
        "Words that share an ending, like cat, hat and bat. Once children know one word in a family, they can read and spell many more by changing the first sound.",
      standards: { "ca-bc": "Word patterns and word families; phonological awareness (rhyme, onset and rime)" },
      generate: wordFamilies,
    },
    {
      id: "sh-ch-th",
      title: "Sh, Ch, Th",
      emoji: "🐑",
      blurb: "Two letters, one sound",
      parentNote: "Letter pairs that make one sound (sh, ch, th) at the start and end of words like ship, cheese and tooth.",
      standards: { "ca-bc": "Letter–sound relationships: consonant digraphs sh, ch and th" },
      generate: shChTh,
    },
    {
      id: "sight-words",
      title: "Sight Words",
      emoji: "👀",
      blurb: "Words to know by heart",
      parentNote:
        "Common words like said, was, they and where that are tricky to sound out. Children practise finding, using and spelling them so they can read them at a glance.",
      standards: { "ca-bc": "High-frequency words; spelling of simple words" },
      generate: sightWords,
    },
    {
      id: "sentences",
      title: "Sentences",
      emoji: "✏️",
      blurb: "Capitals, periods and more",
      parentNote:
        "Starting sentences and names with a capital letter, ending with a period or question mark, telling whole sentences from parts, counting words and finding naming words.",
      standards: {
        "ca-bc": "Language features and conventions: capital letters and periods; concepts of print; naming words",
      },
      generate: sentences,
    },
    {
      id: "story-time",
      title: "Story Time",
      emoji: "📖",
      blurb: "Who, where and what happened",
      parentNote:
        "Reading short stories, then naming who is in them and where they happen, and putting the events in order. Reading the story aloud together and talking about it helps a lot!",
      standards: { "ca-bc": "Story elements: characters, setting and events; reading strategies" },
      generate: storyTime,
    },
    {
      id: "describing-words",
      title: "Describing Words",
      emoji: "🎨",
      blurb: "Opposites and describing words",
      parentNote:
        "Opposites (hot and cold) and describing words that tell how something looks, feels, tastes or sounds, including finding the describing word in a sentence.",
      standards: { "ca-bc": "Language features: vocabulary, opposites and describing words" },
      generate: describingWords,
    },
    {
      id: "more-than-one",
      title: "More Than One",
      emoji: "🧦",
      blurb: "Add -s for more",
      parentNote:
        "Plurals: adding -s to a naming word means more than one (one cat, two cats). Stretch questions add -es to words like box and fox.",
      standards: { "ca-bc": "Language features and conventions: plurals; spelling of simple words" },
      generate: moreThanOne,
    },
  ],
};
