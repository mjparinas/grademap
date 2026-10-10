import { chance, pick, sample, shuffle, textChoice } from "../../random";
import type { Question, Course } from "../../types";

// ---------- Rhyme Time ----------

const RHYMES: { word: string; emoji: string; rhymes: { word: string; emoji: string }[] }[] = [
  { word: "cat", emoji: "🐱", rhymes: [{ word: "hat", emoji: "🎩" }, { word: "bat", emoji: "🦇" }] },
  { word: "dog", emoji: "🐶", rhymes: [{ word: "frog", emoji: "🐸" }, { word: "log", emoji: "🪵" }] },
  { word: "bee", emoji: "🐝", rhymes: [{ word: "tree", emoji: "🌳" }, { word: "key", emoji: "🔑" }] },
  { word: "star", emoji: "⭐", rhymes: [{ word: "car", emoji: "🚗" }, { word: "jar", emoji: "🫙" }] },
  { word: "cake", emoji: "🎂", rhymes: [{ word: "snake", emoji: "🐍" }, { word: "lake", emoji: "🏞️" }] },
  { word: "moon", emoji: "🌙", rhymes: [{ word: "spoon", emoji: "🥄" }, { word: "balloon", emoji: "🎈" }] },
  { word: "fox", emoji: "🦊", rhymes: [{ word: "box", emoji: "📦" }, { word: "ox", emoji: "🐂" }] },
  { word: "goat", emoji: "🐐", rhymes: [{ word: "boat", emoji: "⛵" }, { word: "coat", emoji: "🧥" }] },
  { word: "mouse", emoji: "🐭", rhymes: [{ word: "house", emoji: "🏠" }] },
  { word: "bear", emoji: "🐻", rhymes: [{ word: "chair", emoji: "🪑" }, { word: "pear", emoji: "🍐" }] },
  { word: "fish", emoji: "🐟", rhymes: [{ word: "dish", emoji: "🍽️" }] },
  { word: "clock", emoji: "🕐", rhymes: [{ word: "sock", emoji: "🧦" }, { word: "rock", emoji: "🪨" }] },
  { word: "bed", emoji: "🛏️", rhymes: [{ word: "sled", emoji: "🛷" }, { word: "bread", emoji: "🍞" }] },
];

const FAMILIES: Record<string, string[]> = {
  at: ["cat", "hat", "mat", "sat", "bat"],
  ig: ["pig", "dig", "big", "wig"],
  op: ["hop", "top", "mop", "pop"],
  un: ["sun", "run", "fun", "bun"],
  ake: ["cake", "make", "lake", "bake"],
  ell: ["bell", "shell", "tell", "well"],
};

function rhymes(): Question[] {
  const groups = sample(RHYMES, 5);
  const rhymeQs: Question[] = groups.map((g) => {
    const right = pick(g.rhymes);
    const others = sample(
      RHYMES.filter((o) => o !== g).flatMap((o) => [{ word: o.word, emoji: o.emoji }, ...o.rhymes]),
      2,
    );
    return textChoice(
      `Which word rhymes with “${g.word}”?`,
      { label: right.word, emoji: right.emoji },
      others.map((o) => ({ label: o.word, emoji: o.emoji })),
      `Rhyming words end with the same sound. Say them out loud: ${g.word}… ${right.word}!`,
      { type: "emoji", emoji: g.emoji, caption: g.word },
    );
  });

  const familyQs: Question[] = sample(Object.keys(FAMILIES), 3).map((fam) => {
    const otherWords = Object.entries(FAMILIES)
      .filter(([f]) => f !== fam)
      .flatMap(([, words]) => words);
    return textChoice(
      `Which word is in the “-${fam}” family?`,
      pick(FAMILIES[fam]),
      sample(otherWords, 2),
      `Words in the -${fam} family all end with “${fam}”, like ${FAMILIES[fam].slice(0, 2).join(" and ")}.`,
      { type: "equation", text: `-${fam}` },
    );
  });

  return shuffle([...rhymeQs, ...familyQs]);
}

// ---------- Sound Detectives ----------

const DIGRAPHS: Record<string, { word: string; emoji: string }[]> = {
  sh: [
    { word: "ship", emoji: "🚢" },
    { word: "shell", emoji: "🐚" },
    { word: "sheep", emoji: "🐑" },
    { word: "shoe", emoji: "👟" },
    { word: "shark", emoji: "🦈" },
  ],
  ch: [
    { word: "chair", emoji: "🪑" },
    { word: "cheese", emoji: "🧀" },
    { word: "chick", emoji: "🐤" },
    { word: "cherries", emoji: "🍒" },
  ],
  th: [
    { word: "thumb", emoji: "👍" },
    { word: "three", emoji: "3️⃣" },
    { word: "thread", emoji: "🧵" },
  ],
  wh: [
    { word: "whale", emoji: "🐳" },
    { word: "wheat", emoji: "🌾" },
  ],
};

const VOWEL_TEAMS: Record<string, { word: string; emoji: string }[]> = {
  ee: [
    { word: "tree", emoji: "🌳" },
    { word: "bee", emoji: "🐝" },
    { word: "feet", emoji: "🦶" },
    { word: "sheep", emoji: "🐑" },
  ],
  ai: [
    { word: "rain", emoji: "🌧️" },
    { word: "snail", emoji: "🐌" },
    { word: "train", emoji: "🚆" },
    { word: "mail", emoji: "📬" },
  ],
  oa: [
    { word: "boat", emoji: "⛵" },
    { word: "goat", emoji: "🐐" },
    { word: "soap", emoji: "🧼" },
    { word: "road", emoji: "🛣️" },
  ],
};

const SYLLABLES: { word: string; emoji: string; count: number }[] = [
  { word: "dog", emoji: "🐶", count: 1 },
  { word: "sun", emoji: "☀️", count: 1 },
  { word: "apple", emoji: "🍎", count: 2 },
  { word: "pencil", emoji: "✏️", count: 2 },
  { word: "rainbow", emoji: "🌈", count: 2 },
  { word: "banana", emoji: "🍌", count: 3 },
  { word: "butterfly", emoji: "🦋", count: 3 },
  { word: "elephant", emoji: "🐘", count: 3 },
  { word: "dinosaur", emoji: "🦕", count: 3 },
  { word: "watermelon", emoji: "🍉", count: 4 },
  { word: "caterpillar", emoji: "🐛", count: 4 },
];

function blankOut(word: string, part: string): string {
  const i = word.indexOf(part);
  return word.slice(0, i) + "_".repeat(part.length) + word.slice(i + part.length);
}

function sounds(): Question[] {
  const starts: Question[] = sample(Object.keys(DIGRAPHS), 3).map((dg) => {
    const right = pick(DIGRAPHS[dg]);
    const wrong = sample(
      Object.entries(DIGRAPHS)
        .filter(([d]) => d !== dg)
        .flatMap(([, ws]) => ws),
      2,
    );
    return textChoice(
      `Which word starts with the “${dg}” sound?`,
      { label: right.word, emoji: right.emoji },
      wrong.map((w) => ({ label: w.word, emoji: w.emoji })),
      `Say each word slowly. “${right.word}” starts with ${dg}.`,
    );
  });

  const teams: Question[] = sample(Object.keys(VOWEL_TEAMS), 3).map((team) => {
    const w = pick(VOWEL_TEAMS[team]);
    return textChoice(
      "Which letters are missing?",
      team,
      Object.keys(VOWEL_TEAMS).filter((t) => t !== team),
      `Say “${w.word}” slowly. The middle sound is spelled ${team}.`,
      { type: "emoji", emoji: w.emoji, caption: blankOut(w.word, team) },
    );
  });

  const claps: Question[] = sample(SYLLABLES, 2).map((s) =>
    textChoice(
      `Clap the word “${s.word}”. How many claps (syllables)?`,
      String(s.count),
      [1, 2, 3, 4].filter((n) => n !== s.count).slice(0, 2).map(String),
      `Clap as you say it: ${s.word}. Each clap is one syllable. That's ${s.count}.`,
      { type: "emoji", emoji: s.emoji, caption: s.word },
    ),
  );

  return shuffle([...starts, ...teams, ...claps]);
}

// ---------- Super Sentences ----------

const GOOD_SENTENCES = [
  "My cat likes to nap.",
  "We went to the park.",
  "The sun is hot today.",
  "I have a red kite.",
  "Can you see the moon?",
  "Look at that big whale!",
  "Ollie can swim fast.",
  "Do you like apples?",
  "Zoe feeds the ducks.",
  "What is your name?",
  "The baby is sleeping.",
  "I love my new boots!",
  "We can build a fort.",
  "Is it time for lunch?",
];

const END_MARKS: { text: string; mark: "." | "?" | "!" }[] = [
  { text: "Where is my hat", mark: "?" },
  { text: "Do you like pizza", mark: "?" },
  { text: "What time is it", mark: "?" },
  { text: "Can we play outside", mark: "?" },
  { text: "Watch out", mark: "!" },
  { text: "Hooray, it is snowing", mark: "!" },
  { text: "Ouch, that hurts", mark: "!" },
  { text: "I like apples", mark: "." },
  { text: "The bus is yellow", mark: "." },
  { text: "My dog is brown", mark: "." },
  { text: "We read a book at school", mark: "." },
  { text: "Who is at the door", mark: "?" },
  { text: "How old are you", mark: "?" },
  { text: "Are we there yet", mark: "?" },
  { text: "Wow, that rocket is fast", mark: "!" },
  { text: "Stop, the light is red", mark: "!" },
  { text: "Yay, we won the game", mark: "!" },
  { text: "Jay has two cats", mark: "." },
  { text: "The moon is bright tonight", mark: "." },
  { text: "Lena likes to paint", mark: "." },
];

const NAMES = ["maya", "kelowna", "monday", "canada", "ollie", "vancouver", "sam", "friday", "amir", "toronto"];
const PLAIN_WORDS = ["park", "dog", "apple", "school", "happy", "river", "chair", "jump"];

function sentences(): Question[] {
  const correct: Question[] = sample(GOOD_SENTENCES, 3).map((s) =>
    textChoice(
      "Which sentence is written the right way?",
      s,
      [s[0].toLowerCase() + s.slice(1), s.slice(0, -1)],
      "A sentence starts with a capital letter and ends with a . or ? or !",
    ),
  );

  const marks: Question[] = [
    pick(END_MARKS.filter((e) => e.mark === "?")),
    pick(END_MARKS.filter((e) => e.mark === "!")),
    pick(END_MARKS.filter((e) => e.mark === ".")),
  ].map((e) => ({
    kind: "choice",
    prompt: "Which mark goes at the end?",
    hint: {
      "?": "Is it asking something? Use a question mark ?",
      "!": "Does it show a big feeling? Use an exclamation mark !",
      ".": "Is it just telling something? Use a period .",
    }[e.mark],
    visual: { type: "equation", text: `${e.text} ☐` },
    answer: e.mark,
    choices: [
      { id: ".", label: "." },
      { id: "?", label: "?" },
      { id: "!", label: "!" },
    ],
  }));

  const caps: Question[] = sample(NAMES, 2).map((name) =>
    textChoice(
      "Which word should always start with a capital letter?",
      name,
      sample(PLAIN_WORDS, 2),
      `Names of people, places and days start with a capital letter. ${name[0].toUpperCase() + name.slice(1)}!`,
    ),
  );

  return shuffle([...correct, ...marks, ...caps]);
}

// ---------- Story Builders ----------

interface Story {
  lines: string[];
  character: { label: string; emoji: string };
  notCharacters: { label: string; emoji: string }[];
  setting: { label: string; emoji: string };
  notSettings: { label: string; emoji: string }[];
  think: { prompt: string; right: { label: string; emoji: string }; wrong: { label: string; emoji: string }[]; hint: string };
  events: string[];
}

const STORIES: Story[] = [
  {
    lines: [
      "Ollie the otter lost a shiny shell at the beach.",
      "Ollie looked under every rock.",
      "A little crab found the shell and gave it back.",
      "Ollie said thank you and shared a snack with the crab.",
    ],
    character: { label: "Ollie the otter", emoji: "🦦" },
    notCharacters: [
      { label: "a whale", emoji: "🐳" },
      { label: "a bear", emoji: "🐻" },
    ],
    setting: { label: "at the beach", emoji: "🏖️" },
    notSettings: [
      { label: "at school", emoji: "🏫" },
      { label: "in space", emoji: "🚀" },
    ],
    think: {
      prompt: "How did Ollie feel when the crab gave the shell back?",
      right: { label: "happy and thankful", emoji: "😊" },
      wrong: [
        { label: "angry", emoji: "😠" },
        { label: "sleepy", emoji: "😴" },
      ],
      hint: "Ollie said thank you and shared a snack. That's what we do when we feel thankful!",
    },
    events: ["Ollie lost a shell.", "Ollie looked under rocks.", "A crab found the shell.", "Ollie shared a snack."],
  },
  {
    lines: [
      "Maya planted a seed in a pot in her garden.",
      "She watered it every day.",
      "Soon a tiny green sprout poked up.",
      "In the summer, a big yellow sunflower bloomed.",
    ],
    character: { label: "Maya", emoji: "👧" },
    notCharacters: [
      { label: "a farmer", emoji: "🧑‍🌾" },
      { label: "a bee", emoji: "🐝" },
    ],
    setting: { label: "in a garden", emoji: "🪴" },
    notSettings: [
      { label: "on a boat", emoji: "⛵" },
      { label: "at the zoo", emoji: "🦁" },
    ],
    think: {
      prompt: "Why did the sunflower grow?",
      right: { label: "Maya watered it every day", emoji: "💧" },
      wrong: [
        { label: "Maya forgot about it", emoji: "🤷" },
        { label: "It was magic", emoji: "✨" },
      ],
      hint: "Look at the second sentence. What did Maya do every day?",
    },
    events: ["Maya planted a seed.", "She watered it.", "A sprout came up.", "A sunflower bloomed."],
  },
  {
    lines: [
      "It was a snowy day in the mountains.",
      "Jay put on a warm coat and boots.",
      "Jay built a snowman with a carrot nose.",
      "Then Jay drank hot cocoa by the fire.",
    ],
    character: { label: "Jay", emoji: "🧒" },
    notCharacters: [
      { label: "a snowplow driver", emoji: "🚜" },
      { label: "a penguin", emoji: "🐧" },
    ],
    setting: { label: "in the snowy mountains", emoji: "🏔️" },
    notSettings: [
      { label: "at a sunny beach", emoji: "🏖️" },
      { label: "in a desert", emoji: "🏜️" },
    ],
    think: {
      prompt: "Why did Jay put on a warm coat?",
      right: { label: "Because it was cold and snowy", emoji: "❄️" },
      wrong: [
        { label: "Because it was hot", emoji: "🔥" },
        { label: "Because it was bedtime", emoji: "🛏️" },
      ],
      hint: "The story starts on a snowy day. Snow is cold!",
    },
    events: ["It was a snowy day.", "Jay put on a coat.", "Jay built a snowman.", "Jay drank hot cocoa."],
  },
  {
    lines: [
      "Sam's class went to the aquarium.",
      "They watched the jellyfish glow.",
      "A sea lion splashed everyone!",
      "On the bus home, Sam drew a picture of the sea lion.",
    ],
    character: { label: "Sam", emoji: "🧑" },
    notCharacters: [
      { label: "a pilot", emoji: "🧑‍✈️" },
      { label: "a dragon", emoji: "🐉" },
    ],
    setting: { label: "at the aquarium", emoji: "🐠" },
    notSettings: [
      { label: "at a farm", emoji: "🐄" },
      { label: "at the library", emoji: "📚" },
    ],
    think: {
      prompt: "What do you think was Sam's favourite part?",
      right: { label: "The sea lion", emoji: "🦭" },
      wrong: [
        { label: "The bus seats", emoji: "🚌" },
        { label: "Doing homework", emoji: "📝" },
      ],
      hint: "Sam drew a picture of something on the way home. People often draw what they liked best!",
    },
    events: ["The class went to the aquarium.", "They saw jellyfish.", "A sea lion splashed them.", "Sam drew a picture."],
  },
  {
    lines: [
      "Priya and her dad went to the library on Saturday.",
      "Priya picked a book about frogs.",
      "She read it quietly in a cosy corner.",
      "Then she borrowed the book to take home.",
    ],
    character: { label: "Priya", emoji: "👧" },
    notCharacters: [
      { label: "a librarian", emoji: "🧑‍🏫" },
      { label: "a frog", emoji: "🐸" },
    ],
    setting: { label: "at the library", emoji: "📚" },
    notSettings: [
      { label: "at the park", emoji: "🌳" },
      { label: "on a farm", emoji: "🐄" },
    ],
    think: {
      prompt: "Why did Priya read quietly?",
      right: { label: "Because she was in a library", emoji: "🤫" },
      wrong: [
        { label: "Because she was angry", emoji: "😠" },
        { label: "Because the book was heavy", emoji: "📕" },
      ],
      hint: "Libraries are calm places where people read. We use quiet voices there.",
    },
    events: ["Priya went to the library.", "Priya picked a book.", "She read in a cosy corner.", "She borrowed the book."],
  },
  {
    lines: [
      "Leo's puppy Biscuit dug a hole in the yard.",
      "Leo found Biscuit covered in mud.",
      "Leo gave Biscuit a bath with soap and warm water.",
      "Soon Biscuit was clean and fluffy.",
    ],
    character: { label: "Leo", emoji: "🧒" },
    notCharacters: [
      { label: "a gardener", emoji: "🧑‍🌾" },
      { label: "a cat", emoji: "🐈" },
    ],
    setting: { label: "at Leo's home", emoji: "🏡" },
    notSettings: [
      { label: "on the moon", emoji: "🌙" },
      { label: "in a store", emoji: "🛒" },
    ],
    think: {
      prompt: "Why did Leo give Biscuit a bath?",
      right: { label: "Biscuit was covered in mud", emoji: "🐕" },
      wrong: [
        { label: "Biscuit wanted to swim", emoji: "🏊" },
        { label: "It was Biscuit's birthday", emoji: "🎂" },
      ],
      hint: "Look at the second sentence. What did Leo find?",
    },
    events: ["Biscuit dug a hole.", "Leo found Biscuit muddy.", "Leo gave Biscuit a bath.", "Biscuit was clean and fluffy."],
  },
  {
    lines: [
      "Amir and his sister made a lemonade stand.",
      "They squeezed lemons and added sugar and water.",
      "Neighbours stopped by to buy a cup.",
      "At the end, they counted their coins.",
    ],
    character: { label: "Amir", emoji: "🧒" },
    notCharacters: [
      { label: "a baker", emoji: "🧑‍🍳" },
      { label: "a lemon tree", emoji: "🍋" },
    ],
    setting: { label: "outside near their home", emoji: "🏘️" },
    notSettings: [
      { label: "under the sea", emoji: "🌊" },
      { label: "inside a castle", emoji: "🏰" },
    ],
    think: {
      prompt: "What did Amir and his sister do first?",
      right: { label: "They made lemonade", emoji: "🍋" },
      wrong: [
        { label: "They counted coins", emoji: "🪙" },
        { label: "They sold the cups", emoji: "🥤" },
      ],
      hint: "The story tells what happened in order. Find the first thing they did.",
    },
    events: ["They set up a stand.", "They made lemonade.", "Neighbours bought cups.", "They counted coins."],
  },
  {
    lines: [
      "Lena had a loose tooth.",
      "She wiggled it with her tongue all day.",
      "At dinner, the tooth came out in her apple!",
      "Lena put it under her pillow and smiled.",
    ],
    character: { label: "Lena", emoji: "👧" },
    notCharacters: [
      { label: "a dentist", emoji: "🦷" },
      { label: "a monkey", emoji: "🐒" },
    ],
    setting: { label: "at home", emoji: "🏡" },
    notSettings: [
      { label: "at a pool", emoji: "🏊" },
      { label: "in a forest", emoji: "🌲" },
    ],
    think: {
      prompt: "How did Lena feel at the end?",
      right: { label: "happy", emoji: "😊" },
      wrong: [
        { label: "scared", emoji: "😨" },
        { label: "bored", emoji: "😑" },
      ],
      hint: "The last sentence says Lena smiled.",
    },
    events: ["Lena had a loose tooth.", "She wiggled it.", "The tooth came out in an apple.", "She put it under her pillow."],
  },
  {
    lines: [
      "A little rabbit named Pip lived in a burrow.",
      "One night, Pip heard a loud noise outside.",
      "Pip peeked out and saw it was only the wind.",
      "Pip hopped back in and fell asleep.",
    ],
    character: { label: "Pip the rabbit", emoji: "🐇" },
    notCharacters: [
      { label: "the wind", emoji: "💨" },
      { label: "an owl", emoji: "🦉" },
    ],
    setting: { label: "in a burrow at night", emoji: "🌙" },
    notSettings: [
      { label: "at a busy mall", emoji: "🏬" },
      { label: "on a beach at noon", emoji: "🏖️" },
    ],
    think: {
      prompt: "What was the noise?",
      right: { label: "The wind", emoji: "💨" },
      wrong: [
        { label: "A monster", emoji: "👹" },
        { label: "A truck", emoji: "🚚" },
      ],
      hint: "Pip peeked out and saw what it was.",
    },
    events: ["Pip lived in a burrow.", "Pip heard a noise.", "Pip saw it was the wind.", "Pip fell asleep."],
  },
  {
    lines: [
      "Kenji's class had a pet fish named Bubbles.",
      "Every morning, Kenji sprinkled in some fish food.",
      "One day, Bubbles swam up to the top to say hello.",
      "Kenji felt proud to be a good helper.",
    ],
    character: { label: "Kenji", emoji: "🧒" },
    notCharacters: [
      { label: "a mermaid", emoji: "🧜" },
      { label: "a whale", emoji: "🐳" },
    ],
    setting: { label: "in a classroom", emoji: "🏫" },
    notSettings: [
      { label: "at a supermarket", emoji: "🛒" },
      { label: "on a mountain", emoji: "🏔️" },
    ],
    think: {
      prompt: "Why did Kenji feel proud?",
      right: { label: "He took good care of the fish", emoji: "🐠" },
      wrong: [
        { label: "He won a race", emoji: "🏁" },
        { label: "He ate the fish food", emoji: "🍽️" },
      ],
      hint: "Kenji fed Bubbles every morning. That is being a good helper.",
    },
    events: ["The class had a fish.", "Kenji fed the fish every morning.", "Bubbles swam up to say hello.", "Kenji felt proud."],
  },
  {
    lines: [
      "Noah and Zoe built a fort out of blankets.",
      "They put pillows inside to make it soft.",
      "Then it started to rain outside.",
      "The two friends read stories in their cosy fort.",
    ],
    character: { label: "Noah and Zoe", emoji: "🧒" },
    notCharacters: [
      { label: "a builder", emoji: "👷" },
      { label: "a raindrop", emoji: "💧" },
    ],
    setting: { label: "inside a blanket fort", emoji: "🏕️" },
    notSettings: [
      { label: "in a swimming pool", emoji: "🏊" },
      { label: "at a bus stop", emoji: "🚏" },
    ],
    think: {
      prompt: "Why did Noah and Zoe stay inside?",
      right: { label: "It was raining", emoji: "🌧️" },
      wrong: [
        { label: "It was sunny", emoji: "☀️" },
        { label: "They had no friends", emoji: "😢" },
      ],
      hint: "Read the third sentence to find what started outside.",
    },
    events: ["They built a fort.", "They added pillows.", "It started to rain.", "They read stories."],
  },
  {
    lines: [
      "Ana's grandmother taught her how to bake bread.",
      "They mixed flour, water and yeast.",
      "The dough rose in a warm bowl.",
      "Ana's whole family ate fresh bread for dinner.",
    ],
    character: { label: "Ana", emoji: "👧" },
    notCharacters: [
      { label: "a farmer", emoji: "🧑‍🌾" },
      { label: "a toaster", emoji: "🍞" },
    ],
    setting: { label: "in a kitchen", emoji: "🍳" },
    notSettings: [
      { label: "at a playground", emoji: "🛝" },
      { label: "on a boat", emoji: "⛵" },
    ],
    think: {
      prompt: "Who showed Ana how to bake?",
      right: { label: "Her grandmother", emoji: "👵" },
      wrong: [
        { label: "Her teacher", emoji: "🧑‍🏫" },
        { label: "A neighbour", emoji: "🧑" },
      ],
      hint: "The first sentence tells you who taught Ana.",
    },
    events: ["Ana learned to bake.", "They mixed the dough.", "The dough rose.", "The family ate the bread."],
  },
  {
    lines: [
      "Maya's team was playing soccer in the park.",
      "Maya kicked the ball, but it rolled into a puddle.",
      "Her teammate Ravi helped her dry the ball.",
      "They both laughed and kept on playing.",
    ],
    character: { label: "Maya", emoji: "👧" },
    notCharacters: [
      { label: "a referee", emoji: "🧑‍⚖️" },
      { label: "a goalpost", emoji: "🥅" },
    ],
    setting: { label: "at the park", emoji: "🌳" },
    notSettings: [
      { label: "at a restaurant", emoji: "🍽️" },
      { label: "in a museum", emoji: "🏛️" },
    ],
    think: {
      prompt: "How did Ravi show he was a good teammate?",
      right: { label: "He helped Maya dry the ball", emoji: "🤝" },
      wrong: [
        { label: "He took the ball home", emoji: "🏠" },
        { label: "He laughed at Maya in a mean way", emoji: "😝" },
      ],
      hint: "Look for what Ravi did to help.",
    },
    events: ["Maya's team played soccer.", "The ball rolled into a puddle.", "Ravi helped dry the ball.", "They kept playing."],
  },
  {
    lines: [
      "Sam found a feather on the trail.",
      "It was blue with a black stripe.",
      "Sam showed it to a park ranger.",
      "The ranger said it came from a Steller's jay.",
    ],
    character: { label: "Sam", emoji: "🧑" },
    notCharacters: [
      { label: "a jay", emoji: "🐦" },
      { label: "a tree", emoji: "🌲" },
    ],
    setting: { label: "on a trail", emoji: "🥾" },
    notSettings: [
      { label: "in a theatre", emoji: "🎭" },
      { label: "at a bakery", emoji: "🥐" },
    ],
    think: {
      prompt: "What did the ranger help Sam learn?",
      right: { label: "Which bird the feather came from", emoji: "🐦" },
      wrong: [
        { label: "How to bake a cake", emoji: "🎂" },
        { label: "How to count to ten", emoji: "🔢" },
      ],
      hint: "The last sentence tells what the ranger said.",
    },
    events: ["Sam found a feather.", "It was blue.", "Sam showed a ranger.", "The ranger named the bird."],
  },
  {
    lines: [
      "Jay was nervous about the school play.",
      "Jay practised the lines in front of the mirror.",
      "On the big night, Jay said every line clearly.",
      "Everyone clapped, and Jay took a big bow.",
    ],
    character: { label: "Jay", emoji: "🧒" },
    notCharacters: [
      { label: "the audience", emoji: "👏" },
      { label: "a mirror", emoji: "🪞" },
    ],
    setting: { label: "at school", emoji: "🏫" },
    notSettings: [
      { label: "at the beach", emoji: "🏖️" },
      { label: "at the zoo", emoji: "🦁" },
    ],
    think: {
      prompt: "What helped Jay do well in the play?",
      right: { label: "Practising the lines", emoji: "🪞" },
      wrong: [
        { label: "Skipping the practice", emoji: "🙅" },
        { label: "Staying home", emoji: "🏠" },
      ],
      hint: "Practice helps us get better. What did Jay do in front of the mirror?",
    },
    events: ["Jay felt nervous.", "Jay practised the lines.", "Jay said every line.", "Everyone clapped."],
  },
  {
    lines: [
      "A bear cub named Juniper woke up from a long winter sleep.",
      "Juniper was very hungry.",
      "Juniper found berries and fish near the river.",
      "Soon the little cub felt strong again.",
    ],
    character: { label: "Juniper the bear cub", emoji: "🐻" },
    notCharacters: [
      { label: "a fish", emoji: "🐟" },
      { label: "a hunter", emoji: "🧑" },
    ],
    setting: { label: "near a river in the forest", emoji: "🌲" },
    notSettings: [
      { label: "in a big city", emoji: "🏙️" },
      { label: "at an airport", emoji: "✈️" },
    ],
    think: {
      prompt: "Why did Juniper look for food?",
      right: { label: "Juniper was hungry", emoji: "🍓" },
      wrong: [
        { label: "Juniper was playing a game", emoji: "🎮" },
        { label: "Juniper wanted to go to school", emoji: "🏫" },
      ],
      hint: "The second sentence says how Juniper felt.",
    },
    events: ["Juniper woke up.", "Juniper felt hungry.", "Juniper found berries and fish.", "Juniper felt strong."],
  },
];

function storyQuestions(story: Story): Question[] {
  const visual = { type: "story" as const, lines: story.lines };
  return [
    textChoice(
      "Who is the main character in this story?",
      story.character,
      story.notCharacters,
      "The main character is who the story is mostly about.",
      visual,
    ),
    textChoice(
      "Where does this story happen? (the setting)",
      story.setting,
      story.notSettings,
      "The setting is where a story happens. Look for clues in the first sentence.",
      visual,
    ),
    textChoice(story.think.prompt, story.think.right, story.think.wrong, story.think.hint, visual),
    {
      kind: "order",
      prompt: "Tap what happened, from the beginning to the end.",
      hint: "Read the story again from the top. What happened first?",
      visual,
      items: story.events.map((e, i) => ({ id: `e${i}`, label: e })),
    },
  ];
}

function story(): Question[] {
  return sample(STORIES, 2).flatMap(storyQuestions);
}

// ---------- Word Power ----------

const COMPOUNDS = [
  { a: "rain", b: "bow", word: "rainbow", emoji: "🌈" },
  { a: "star", b: "fish", word: "starfish", emoji: "⭐" },
  { a: "cup", b: "cake", word: "cupcake", emoji: "🧁" },
  { a: "snow", b: "man", word: "snowman", emoji: "⛄" },
  { a: "butter", b: "fly", word: "butterfly", emoji: "🦋" },
  { a: "pop", b: "corn", word: "popcorn", emoji: "🍿" },
  { a: "sun", b: "flower", word: "sunflower", emoji: "🌻" },
  { a: "foot", b: "ball", word: "football", emoji: "🏈" },
];

const OPPOSITES: [string, string][] = [
  ["hot", "cold"],
  ["big", "small"],
  ["up", "down"],
  ["happy", "sad"],
  ["fast", "slow"],
  ["day", "night"],
  ["open", "closed"],
  ["full", "empty"],
];

const PLURALS = [
  { one: "cat", many: "cats", wrong: "cates", emoji: "🐱" },
  { one: "dog", many: "dogs", wrong: "doges", emoji: "🐶" },
  { one: "box", many: "boxes", wrong: "boxs", emoji: "📦" },
  { one: "fox", many: "foxes", wrong: "foxs", emoji: "🦊" },
  { one: "bus", many: "buses", wrong: "buss", emoji: "🚌" },
  { one: "dish", many: "dishes", wrong: "dishs", emoji: "🍽️" },
];

function words(): Question[] {
  const compounds: Question[] = sample(COMPOUNDS, 3).map((c) =>
    textChoice(
      "Put the two words together. What new word do you make?",
      { label: c.word, emoji: c.emoji },
      sample(COMPOUNDS.filter((o) => o !== c), 2).map((o) => ({ label: o.word, emoji: o.emoji })),
      `A compound word is two words stuck together: ${c.a} + ${c.b} = ${c.word}.`,
      { type: "equation", text: `${c.a} + ${c.b}` },
    ),
  );

  const opposites: Question[] = sample(OPPOSITES, 3).map(([word, opp]) => {
    const [ask, answer] = chance(0.5) ? [word, opp] : [opp, word];
    return textChoice(
      `What is the opposite of “${ask}”?`,
      answer,
      sample(
        OPPOSITES.filter(([w]) => w !== word).flat(),
        2,
      ),
      `Opposites mean very different things, like ${ask} and ${answer}.`,
    );
  });

  const plurals: Question[] = sample(PLURALS, 2).map((p) =>
    textChoice(
      `One ${p.one}, two…`,
      p.many,
      [p.wrong, p.one],
      p.many.endsWith("es")
        ? `Words ending in s, x, sh or ch add -es: ${p.many}.`
        : `Most words just add -s: ${p.many}.`,
      { type: "emoji", emoji: `${p.emoji} ${p.emoji}` },
    ),
  );

  return shuffle([...compounds, ...opposites, ...plurals]);
}

export const course: Course = {
  grade: "2",
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
      id: "rhyme-time",
      title: "Rhyme Time",
      emoji: "🎵",
      blurb: "Words that sound alike",
      standards: { "ca-bc": "Language features: word patterns and word families; phonological awareness" },
      parentNote: "Hearing rhymes and spotting word families (-at, -ig, -op). Both help with reading and spelling new words.",
      generate: rhymes,
    },
    {
      id: "sound-detectives",
      title: "Sound Detectives",
      emoji: "🔍",
      blurb: "sh, ch, ee, ai and more",
      standards: { "ca-bc": "Phoneme manipulation and sound-symbol correspondence; reading strategies" },
      parentNote: "Letter teams that make one sound (sh, ch, th, wh, ee, ai, oa) and clapping syllables.",
      generate: sounds,
    },
    {
      id: "super-sentences",
      title: "Super Sentences",
      emoji: "✏️",
      blurb: "Capitals and end marks",
      standards: { "ca-bc": "Language features, structures and conventions: capital letters and end punctuation" },
      parentNote: "Starting sentences and names with capitals, and choosing a period, question mark or exclamation mark.",
      generate: sentences,
    },
    {
      id: "story-builders",
      title: "Story Builders",
      emoji: "📖",
      blurb: "Characters, settings and order",
      standards: { "ca-bc": "Story/text: elements of story (character, setting, sequence); comprehension strategies" },
      parentNote: "Reading short stories, then naming the character and setting, explaining why things happened, and retelling events in order.",
      generate: story,
    },
    {
      id: "word-power",
      title: "Word Power",
      emoji: "💪",
      blurb: "Compound words and opposites",
      standards: { "ca-bc": "Language features: word patterns, vocabulary and plurals" },
      parentNote: "Building compound words, finding opposites and spelling plurals (-s and -es).",
      generate: words,
    },
  ],
};
