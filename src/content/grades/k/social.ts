import { shuffle } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question } from "../../types";
import { fromBank, sortQuestion, type BankItem, type SortSet } from "../../bank";

// Kindergarten social studies: short prompts, 3 picture choices, small sorts.

type Level = NonNullable<GenerateOptions["difficulty"]>;

/** Mix easy and stretch bank items by difficulty (1: all easy, 3: mostly stretch). */
function leveled(easy: BankItem[], hard: BankItem[], count: number, difficulty: Level = 2): Question[] {
  const hardCount = difficulty === 1 ? 0 : difficulty === 2 ? 2 : 4;
  return [...fromBank(easy, count - hardCount), ...fromBank(hard, hardCount)];
}

/** Smaller sorts for easier play. */
function sortFor(set: SortSet, difficulty: Level = 2) {
  return sortQuestion(set, difficulty === 1 ? 2 : 3);
}

// ---------- All About Me ----------

const KIND_SORT: SortSet = {
  prompt: "Kind or not kind? Tap a picture, then its basket.",
  hint: "Kind choices help others feel happy and safe.",
  bins: [
    { id: "kind", label: "kind", emoji: "👍" },
    { id: "unkind", label: "not kind", emoji: "👎" },
  ],
  items: [
    { label: "share toys", emoji: "🧸", bin: "kind" },
    { label: "help a friend", emoji: "🤝", bin: "kind" },
    { label: "say thank you", emoji: "🙏", bin: "kind" },
    { label: "take turns", emoji: "🔄", bin: "kind" },
    { label: "ask someone to play", emoji: "👋", bin: "kind" },
    { label: "grab a toy", emoji: "✊", bin: "unkind" },
    { label: "say mean words", emoji: "🗯️", bin: "unkind" },
    { label: "leave someone out", emoji: "🙅", bin: "unkind" },
    { label: "make fun of someone", emoji: "😝", bin: "unkind" },
    { label: "cut in line", emoji: "🚶", bin: "unkind" },
  ],
};

const ME_EASY: BankItem[] = [
  {
    prompt: "Maya's friend shared a toy with her. How might she feel?",
    right: { label: "happy", emoji: "😊" },
    wrong: [
      { label: "sad", emoji: "😢" },
      { label: "scared", emoji: "😨" },
    ],
    hint: "When someone shares with us, it can make us feel happy.",
    emoji: "🧸",
  },
  {
    prompt: "Jay dropped his ice cream. How might he feel?",
    right: { label: "sad", emoji: "😢" },
    wrong: [
      { label: "happy", emoji: "😄" },
      { label: "sleepy", emoji: "😴" },
    ],
    hint: "Losing something we like can make us feel sad. That's okay!",
    emoji: "🍦",
  },
  {
    prompt: "Sam hears a very loud BOOM. How might Sam feel?",
    speak: "Sam hears a very loud boom. How might Sam feel?",
    right: { label: "scared", emoji: "😨" },
    wrong: [
      { label: "sleepy", emoji: "😴" },
      { label: "bored", emoji: "😑" },
    ],
    hint: "A sudden loud noise can make us feel scared or surprised.",
    emoji: "⛈️",
  },
  {
    prompt: "Which one is a kind thing to do?",
    right: { label: "help a friend", emoji: "🤝" },
    wrong: [
      { label: "grab a toy", emoji: "✊" },
      { label: "say mean words", emoji: "🗯️" },
    ],
    hint: "Kind choices help others feel good.",
  },
  {
    prompt: "A friend falls down. What can you do?",
    right: { label: "ask if they're okay", emoji: "🤗" },
    wrong: [
      { label: "laugh at them", emoji: "😝" },
      { label: "walk away", emoji: "🚶" },
    ],
    hint: "Kind friends check on each other.",
  },
  {
    prompt: "How are all people the same?",
    right: { label: "We all have feelings", emoji: "❤️" },
    wrong: [
      { label: "We all have the same hair", emoji: "💇" },
      { label: "We all like the same food", emoji: "🍕" },
    ],
    hint: "People look different, but everyone has feelings.",
  },
  {
    prompt: "Ana and Leo look different. Is that okay?",
    right: { label: "Yes! Everyone is special", emoji: "🌈" },
    wrong: [{ label: "No, we should all look the same", emoji: "🚫" }],
    hint: "We are all different, and everyone deserves respect.",
  },
  {
    prompt: "You feel angry. What can help you calm down?",
    right: { label: "take deep breaths", emoji: "🌬️" },
    wrong: [
      { label: "yell at a friend", emoji: "📢" },
      { label: "grab a friend's toy", emoji: "✊" },
    ],
    hint: "Slow, deep breaths help our bodies feel calm.",
    emoji: "😠",
  },
];

const ME_HARD: BankItem[] = [
  {
    prompt: "Zoe is new and alone at recess. What can you do?",
    right: { label: "ask her to play", emoji: "👋" },
    wrong: [
      { label: "pretend not to see her", emoji: "🙈" },
      { label: "tell others to leave her out", emoji: "🙅" },
    ],
    hint: "Asking someone to play is a kind way to include them.",
  },
  {
    prompt: "Everyone has the right to be…",
    speak: "Everyone has the right to be what?",
    right: { label: "treated with respect", emoji: "🤝" },
    wrong: [
      { label: "left out", emoji: "🙅" },
      { label: "teased", emoji: "😝" },
    ],
    hint: "We are all unique, and everyone deserves to be treated kindly.",
  },
  {
    prompt: "Kenji is good at drawing. Priya is good at running. So…",
    speak: "Kenji is good at drawing. Priya is good at running. What does that show?",
    right: { label: "we are good at different things", emoji: "⭐" },
    wrong: [
      { label: "only Kenji is special", emoji: "🖍️" },
      { label: "only Priya is special", emoji: "🏃" },
    ],
    hint: "Everyone has their own strengths. That makes each of us special!",
  },
  {
    prompt: "You feel sad. Who can you talk to?",
    right: { label: "a grown-up you trust", emoji: "🤗" },
    wrong: [{ label: "no one at all", emoji: "🚫" }],
    hint: "Talking to a grown-up you trust can help you feel better.",
    emoji: "😢",
  },
  {
    prompt: "Lena's block tower fell down. What can help?",
    right: { label: "take a breath and try again", emoji: "🧱" },
    wrong: [
      { label: "knock over other towers", emoji: "💥" },
      { label: "never build again", emoji: "🚫" },
    ],
    hint: "Calm down, then try again. Mistakes help us learn!",
  },
  {
    prompt: "Amir speaks two languages. That is…",
    speak: "Amir speaks two languages. What is that?",
    right: { label: "something special about him", emoji: "⭐" },
    wrong: [{ label: "not allowed", emoji: "🚫" }],
    hint: "Speaking more than one language is a great thing!",
    emoji: "💬",
  },
  {
    prompt: "Noah uses a wheelchair. How can you be a good friend?",
    right: { label: "include him in games", emoji: "🤝" },
    wrong: [{ label: "leave him out", emoji: "🙅" }],
    hint: "Everyone wants to be included. Friends find ways to play together.",
    emoji: "♿",
  },
];

function aboutMe({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortFor(KIND_SORT, difficulty), ...leveled(ME_EASY, ME_HARD, 7, difficulty)]);
}

// ---------- Families ----------

const GROWING_UP: OrderQuestion = {
  kind: "order",
  prompt: "Put these in order, from youngest to oldest.",
  hint: "Everyone starts as a baby. Then we grow into a child, a grown-up and a grandparent.",
  items: [
    { id: "baby", label: "baby", emoji: "👶" },
    { id: "child", label: "child", emoji: "🧒" },
    { id: "adult", label: "grown-up", emoji: "🧑" },
    { id: "elder", label: "grandparent", emoji: "🧓" },
  ],
};

const HELP_SORT: SortSet = {
  prompt: "Does it help at home? Tap a picture, then its basket.",
  hint: "Helping at home means doing small jobs that make things nicer for everyone.",
  bins: [
    { id: "help", label: "helps", emoji: "👍" },
    { id: "nohelp", label: "doesn't help", emoji: "👎" },
  ],
  items: [
    { label: "set the table", emoji: "🍽️", bin: "help" },
    { label: "put toys away", emoji: "🧸", bin: "help" },
    { label: "feed the pet", emoji: "🐕", bin: "help" },
    { label: "water the plants", emoji: "🪴", bin: "help" },
    { label: "match the socks", emoji: "🧦", bin: "help" },
    { label: "leave toys on the floor", emoji: "🧩", bin: "nohelp" },
    { label: "jump on the couch", emoji: "🛋️", bin: "nohelp" },
    { label: "leave the water running", emoji: "🚰", bin: "nohelp" },
  ],
};

const FAMILY_EASY: BankItem[] = [
  {
    prompt: "Families are different. What do all families do?",
    right: { label: "care for each other", emoji: "❤️" },
    wrong: [
      { label: "live in the same kind of home", emoji: "🏠" },
      { label: "eat the same food", emoji: "🍝" },
    ],
    hint: "Families look different, but they love and care for each other.",
  },
  {
    prompt: "Which is a way to help at home?",
    right: { label: "set the table", emoji: "🍽️" },
    wrong: [
      { label: "leave toys out", emoji: "🧩" },
      { label: "jump on the bed", emoji: "🛏️" },
    ],
    hint: "Small jobs like setting the table help the whole family.",
  },
  {
    prompt: "There is a baby in your family. How can you help?",
    right: { label: "hand the baby a toy", emoji: "🧸" },
    wrong: [
      { label: "take the baby's toy", emoji: "✊" },
      { label: "be loud at nap time", emoji: "📢" },
    ],
    hint: "Being gentle and kind helps babies feel safe.",
    emoji: "👶",
  },
  {
    prompt: "Which job can a kid do at home?",
    right: { label: "put toys away", emoji: "🧸" },
    wrong: [
      { label: "drive the car", emoji: "🚗" },
      { label: "cook at the hot stove", emoji: "🍳" },
    ],
    hint: "Kids can help with small, safe jobs. Grown-ups do the driving and cooking.",
  },
  {
    prompt: "Who can tell you stories about when you were a baby?",
    right: { label: "your family", emoji: "👪" },
    wrong: [
      { label: "a cartoon", emoji: "📺" },
      { label: "a stranger", emoji: "🚶" },
    ],
    hint: "Your family remembers when you were little. Ask them for a story!",
  },
  {
    prompt: "Ravi's family makes the same special food each year. That's a…",
    speak: "Ravi's family makes the same special food each year. What is that called?",
    right: { label: "tradition", emoji: "🎉" },
    wrong: [
      { label: "chore", emoji: "🧹" },
      { label: "mistake", emoji: "❌" },
    ],
    hint: "A tradition is something a family does again and again, like a special meal.",
    emoji: "🍲",
  },
  {
    prompt: "Kenji's family speaks two languages at home. Is that okay?",
    right: { label: "Yes, that's great!", emoji: "👍" },
    wrong: [{ label: "No", emoji: "👎" }],
    hint: "Families speak many languages. Every language is special!",
    emoji: "💬",
  },
  {
    prompt: "Grandpa shows you old family photos. What can you learn?",
    right: { label: "about your family long ago", emoji: "📷" },
    wrong: [
      { label: "tomorrow's weather", emoji: "🌦️" },
      { label: "how to tie shoes", emoji: "👟" },
    ],
    hint: "Old photos show what your family did a long time ago.",
    emoji: "👴",
  },
];

const FAMILY_HARD: BankItem[] = [
  {
    prompt: "Some kids live with a grandma. Some live with two dads. Families are…",
    speak: "Some kids live with a grandma. Some live with two dads. What are families like?",
    right: { label: "different, and all special", emoji: "🌈" },
    wrong: [{ label: "all the same", emoji: "🔁" }],
    hint: "Families come in many shapes and sizes. Every family is special.",
    emoji: "👨‍👨‍👧",
  },
  {
    prompt: "What is a tradition?",
    right: { label: "something a family does again and again", emoji: "🔁" },
    wrong: [
      { label: "a kind of animal", emoji: "🐾" },
      { label: "a kind of weather", emoji: "🌦️" },
    ],
    hint: "Traditions are things we do again and again, like special meals, songs or visits.",
  },
  {
    prompt: "How can you learn about your family long ago?",
    right: { label: "ask an older family member", emoji: "👵" },
    wrong: [
      { label: "watch a cartoon", emoji: "📺" },
      { label: "look at the clouds", emoji: "☁️" },
    ],
    hint: "Grandparents and older family members remember stories from long ago.",
  },
  {
    prompt: "In many First Peoples communities, who shares stories and teachings?",
    right: { label: "Elders", emoji: "🧓" },
    wrong: [
      { label: "babies", emoji: "👶" },
      { label: "pets", emoji: "🐕" },
    ],
    hint: "Elders are respected people who share stories, history and knowledge.",
  },
  {
    prompt: "How have you changed since you were a baby?",
    right: { label: "I am bigger and can do more", emoji: "📏" },
    wrong: [{ label: "I have not changed at all", emoji: "🚫" }],
    hint: "You have grown taller and learned lots of new things!",
    emoji: "👶",
  },
  {
    prompt: "A friend's family celebrates in a different way. You should…",
    speak: "A friend's family celebrates in a different way. What should you do?",
    right: { label: "be curious and respectful", emoji: "🤝" },
    wrong: [
      { label: "laugh at it", emoji: "😝" },
      { label: "say it's wrong", emoji: "👎" },
    ],
    hint: "Every family's traditions are special. We can learn about them kindly.",
    emoji: "🎉",
  },
];

function families({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [GROWING_UP, ...shuffle([sortFor(HELP_SORT, difficulty), ...leveled(FAMILY_EASY, FAMILY_HARD, 6, difficulty)])];
}

// ---------- Needs & Wants ----------

const NEEDS_SORT: SortSet = {
  prompt: "Need or want? Tap a picture, then its basket.",
  hint: "We need things to live and be healthy. Wants are nice, but we can live without them.",
  bins: [
    { id: "need", label: "need", emoji: "🏠" },
    { id: "want", label: "want", emoji: "🎁" },
  ],
  items: [
    { label: "water", emoji: "💧", bin: "need" },
    { label: "healthy food", emoji: "🥕", bin: "need" },
    { label: "a home", emoji: "🏡", bin: "need" },
    { label: "a warm coat", emoji: "🧥", bin: "need" },
    { label: "a bed to sleep in", emoji: "🛏️", bin: "need" },
    { label: "a video game", emoji: "🎮", bin: "want" },
    { label: "candy", emoji: "🍭", bin: "want" },
    { label: "a balloon", emoji: "🎈", bin: "want" },
    { label: "ice cream", emoji: "🍦", bin: "want" },
    { label: "a skateboard", emoji: "🛹", bin: "want" },
  ],
};

const NEEDS_EASY: BankItem[] = [
  {
    prompt: "Which one is a need?",
    right: { label: "water", emoji: "💧" },
    wrong: [
      { label: "a yo-yo", emoji: "🪀" },
      { label: "a lollipop", emoji: "🍭" },
    ],
    hint: "A need is something we must have to live.",
  },
  {
    prompt: "Which one is a want?",
    right: { label: "a video game", emoji: "🎮" },
    wrong: [
      { label: "food", emoji: "🍎" },
      { label: "water", emoji: "💧" },
    ],
    hint: "A want is nice to have, but we can live without it.",
  },
  {
    prompt: "Which one helps you grow strong and healthy?",
    right: { label: "healthy food", emoji: "🥦" },
    wrong: [
      { label: "candy", emoji: "🍬" },
      { label: "a balloon", emoji: "🎈" },
    ],
    hint: "Healthy food gives our bodies what they need to grow.",
  },
  {
    prompt: "It is cold outside. What do you need?",
    right: { label: "a warm coat", emoji: "🧥" },
    wrong: [
      { label: "a kite", emoji: "🪁" },
      { label: "ice cream", emoji: "🍦" },
    ],
    hint: "Warm clothes keep our bodies safe in the cold.",
    emoji: "❄️",
  },
  {
    prompt: "Why do we need a home?",
    right: { label: "to be safe and warm", emoji: "🏠" },
    wrong: [
      { label: "to watch TV", emoji: "📺" },
      { label: "to keep toys", emoji: "🧸" },
    ],
    hint: "A home keeps us safe, warm and dry.",
  },
  {
    prompt: "Leo wants a new toy. Is a toy a need or a want?",
    right: { label: "want", emoji: "🎁" },
    wrong: [{ label: "need", emoji: "🏠" }],
    hint: "We can live without toys, so a toy is a want.",
    emoji: "🧸",
  },
  {
    prompt: "You are thirsty. What do you need?",
    right: { label: "water", emoji: "💧" },
    wrong: [
      { label: "a teddy bear", emoji: "🧸" },
      { label: "a ball", emoji: "⚽" },
    ],
    hint: "When we are thirsty, our bodies need water.",
  },
  {
    prompt: "Why do we need sleep?",
    right: { label: "to rest our bodies", emoji: "😴" },
    wrong: [
      { label: "to get new toys", emoji: "🧸" },
      { label: "to make it rain", emoji: "🌧️" },
    ],
    hint: "Sleep gives our bodies and brains a rest, so we can grow.",
    emoji: "🛏️",
  },
];

const NEEDS_HARD: BankItem[] = [
  {
    prompt: "Where can families get food?",
    right: { label: "grocery store", emoji: "🛒" },
    wrong: [
      { label: "library", emoji: "📚" },
      { label: "fire hall", emoji: "🚒" },
    ],
    hint: "Grocery stores, markets and farms help families get food.",
  },
  {
    prompt: "Who grows food for us to eat?",
    right: { label: "farmer", emoji: "🧑‍🌾" },
    wrong: [
      { label: "firefighter", emoji: "🧑‍🚒" },
      { label: "dentist", emoji: "🦷" },
    ],
    hint: "Farmers grow fruit, vegetables and grain.",
  },
  {
    prompt: "Can we live without candy?",
    right: { label: "Yes, candy is a want", emoji: "🍬" },
    wrong: [{ label: "No, candy is a need", emoji: "🍭" }],
    hint: "Candy is a treat. We don't need it to live.",
  },
  {
    prompt: "A family has a little money. What should they buy first?",
    right: { label: "food", emoji: "🍞" },
    wrong: [
      { label: "a toy", emoji: "🧸" },
      { label: "candy", emoji: "🍬" },
    ],
    hint: "Needs come first. Wants can wait.",
  },
  {
    prompt: "What do all people need?",
    right: { label: "food, water and a home", emoji: "🏠" },
    wrong: [
      { label: "toys and games", emoji: "🎮" },
      { label: "sweets", emoji: "🍭" },
    ],
    hint: "Everyone needs food, water, clothes and a safe home.",
  },
  {
    prompt: "What does a pet dog need?",
    right: { label: "food and water", emoji: "🦴" },
    wrong: [
      { label: "a fancy hat", emoji: "🎩" },
      { label: "a video game", emoji: "🎮" },
    ],
    hint: "Pets need food, water and a safe place to live, just like us.",
    emoji: "🐕",
  },
  {
    prompt: "Wants are things that are…",
    speak: "Wants are things that are what?",
    right: { label: "nice to have", emoji: "🎈" },
    wrong: [{ label: "needed to live", emoji: "💧" }],
    hint: "Wants are fun, but we can live without them.",
  },
];

function needsWants({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortFor(NEEDS_SORT, difficulty), ...leveled(NEEDS_EASY, NEEDS_HARD, 7, difficulty)]);
}

// ---------- Helpers & Rules ----------

const RULES_SORT: SortSet = {
  prompt: "Does it follow the class rules? Tap a picture, then its basket.",
  hint: "Rules help everyone stay safe and be fair.",
  bins: [
    { id: "follow", label: "follows the rules", emoji: "👍" },
    { id: "break", label: "breaks the rules", emoji: "👎" },
  ],
  items: [
    { label: "walk inside", emoji: "🚶", bin: "follow" },
    { label: "raise your hand", emoji: "✋", bin: "follow" },
    { label: "take turns", emoji: "🔄", bin: "follow" },
    { label: "clean up", emoji: "🧹", bin: "follow" },
    { label: "wash your hands", emoji: "🧼", bin: "follow" },
    { label: "run in the hall", emoji: "🏃", bin: "break" },
    { label: "grab a toy", emoji: "✊", bin: "break" },
    { label: "shout at story time", emoji: "📢", bin: "break" },
    { label: "leave toys out", emoji: "🧩", bin: "break" },
  ],
};

const HELPERS_EASY: BankItem[] = [
  {
    prompt: "Who puts out fires?",
    right: { label: "firefighter", emoji: "🧑‍🚒" },
    wrong: [
      { label: "cook", emoji: "🧑‍🍳" },
      { label: "teacher", emoji: "🧑‍🏫" },
    ],
    hint: "Firefighters put out fires and keep us safe.",
    emoji: "🚒",
  },
  {
    prompt: "Who helps you when you are sick?",
    right: { label: "doctor", emoji: "🧑‍⚕️" },
    wrong: [
      { label: "farmer", emoji: "🧑‍🌾" },
      { label: "bus driver", emoji: "🚌" },
    ],
    hint: "Doctors and nurses help us get better.",
  },
  {
    prompt: "Who helps you learn at school?",
    right: { label: "teacher", emoji: "🧑‍🏫" },
    wrong: [
      { label: "firefighter", emoji: "🧑‍🚒" },
      { label: "farmer", emoji: "🧑‍🌾" },
    ],
    hint: "Teachers help us learn new things every day.",
    emoji: "🏫",
  },
  {
    prompt: "Who brings letters and packages?",
    right: { label: "mail carrier", emoji: "📬" },
    wrong: [
      { label: "dentist", emoji: "🦷" },
      { label: "cook", emoji: "🧑‍🍳" },
    ],
    hint: "A mail carrier brings letters and packages to homes.",
  },
  {
    prompt: "Two kids want the same swing. What can they do?",
    right: { label: "take turns", emoji: "🔄" },
    wrong: [
      { label: "grab it", emoji: "✊" },
      { label: "yell", emoji: "📢" },
    ],
    hint: "Taking turns is fair, so everyone gets a chance.",
  },
  {
    prompt: "Inside the classroom, we…",
    speak: "Inside the classroom, do we walk or run?",
    right: { label: "walk", emoji: "🚶" },
    wrong: [{ label: "run", emoji: "🏃" }],
    hint: "Walking inside keeps everyone safe.",
    emoji: "🏫",
  },
  {
    prompt: "You want to talk at circle time. What do you do?",
    right: { label: "raise your hand and wait", emoji: "✋" },
    wrong: [{ label: "shout over others", emoji: "📢" }],
    hint: "Waiting for your turn lets everyone be heard.",
  },
  {
    prompt: "Where can you borrow books?",
    right: { label: "library", emoji: "📚" },
    wrong: [
      { label: "fire hall", emoji: "🚒" },
      { label: "grocery store", emoji: "🛒" },
    ],
    hint: "A library is a community place where anyone can borrow books.",
  },
  {
    prompt: "Why do we have rules?",
    right: { label: "to keep us safe and fair", emoji: "🛡️" },
    wrong: [
      { label: "to make us sad", emoji: "😢" },
      { label: "to stop all fun", emoji: "🚫" },
    ],
    hint: "Rules help everyone be safe and treated fairly.",
  },
];

const HELPERS_HARD: BankItem[] = [
  {
    prompt: "Who helps keep your teeth healthy?",
    right: { label: "dentist", emoji: "🦷" },
    wrong: [
      { label: "mail carrier", emoji: "📬" },
      { label: "firefighter", emoji: "🧑‍🚒" },
    ],
    hint: "A dentist checks and cleans our teeth.",
  },
  {
    prompt: "Who takes care of sick animals?",
    right: { label: "vet", emoji: "🐾" },
    wrong: [
      { label: "teacher", emoji: "🧑‍🏫" },
      { label: "cook", emoji: "🧑‍🍳" },
    ],
    hint: "A vet is a doctor for animals.",
    emoji: "🐕",
  },
  {
    prompt: "A crossing guard helps kids…",
    speak: "A crossing guard helps kids do what?",
    right: { label: "cross the street safely", emoji: "🚸" },
    wrong: [
      { label: "read books", emoji: "📚" },
      { label: "cook lunch", emoji: "🍳" },
    ],
    hint: "Crossing guards help us cross busy streets safely.",
  },
  {
    prompt: "You spilled your water. What is the responsible thing to do?",
    right: { label: "help clean it up", emoji: "🧽" },
    wrong: [
      { label: "walk away", emoji: "🚶" },
      { label: "blame a friend", emoji: "👉" },
    ],
    hint: "Being responsible means fixing our own mistakes.",
    emoji: "💧",
  },
  {
    prompt: "Every child has the right to…",
    speak: "Every child has the right to what?",
    right: { label: "be safe", emoji: "🛡️" },
    wrong: [
      { label: "drive a car", emoji: "🚗" },
      { label: "stay up all night", emoji: "🌙" },
    ],
    hint: "Every child has the right to be safe, to learn and to play.",
  },
  {
    prompt: "Who were the first people to live on the land we call Canada?",
    right: "Indigenous peoples",
    wrong: ["people who just moved here"],
    hint: "Indigenous peoples have lived here for thousands of years, and still do today.",
  },
  {
    prompt: "Where can you play outside in your community?",
    right: { label: "park", emoji: "🌳" },
    wrong: [
      { label: "post office", emoji: "📮" },
      { label: "bank", emoji: "🏦" },
    ],
    hint: "Parks are community places for everyone to play and have fun.",
  },
  {
    prompt: "What is your job in the classroom?",
    right: { label: "listen and help clean up", emoji: "🧹" },
    wrong: [
      { label: "drive the school bus", emoji: "🚌" },
      { label: "make the lunch for everyone", emoji: "🍳" },
    ],
    hint: "Kids help by listening, being kind and cleaning up.",
  },
];

function helpersRules({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return shuffle([sortFor(RULES_SORT, difficulty), ...leveled(HELPERS_EASY, HELPERS_HARD, 7, difficulty)]);
}

export const course: Course = {
  grade: "k",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
      "Our rights, roles, and responsibilities are important for building strong communities.",
      "Stories and traditions about ourselves and our families reflect who we are and where we are from.",
      "We are all unique and have the right to be respected.",
    ],
  },
  units: [
    {
      id: "all-about-me",
      title: "All About Me",
      emoji: "😊",
      blurb: "Feelings, kindness and being me",
      standards: { "ca-bc": "Ways in which individuals differ and are the same; rights and responsibilities of individuals" },
      parentNote:
        "Naming feelings, noticing how we are the same and different, and choosing kind actions so everyone feels respected.",
      generate: aboutMe,
    },
    {
      id: "families",
      title: "Families",
      emoji: "👨‍👩‍👧",
      blurb: "Every family is special",
      standards: {
        "ca-bc": "Ways in which families differ and are the same; personal and family history and traditions",
      },
      parentNote:
        "Seeing that families come in many shapes and sizes, growing up from baby to grandparent, family stories and traditions, and helping at home.",
      generate: families,
    },
    {
      id: "needs-and-wants",
      title: "Needs & Wants",
      emoji: "🏠",
      blurb: "What do we really need?",
      standards: { "ca-bc": "Needs and wants of individuals and families" },
      parentNote:
        "Sorting needs (food, water, a home, warm clothes) from wants (toys and treats), and how families meet their needs.",
      generate: needsWants,
    },
    {
      id: "helpers-and-rules",
      title: "Helpers & Rules",
      emoji: "🧑‍🚒",
      blurb: "Community helpers and taking turns",
      standards: {
        "ca-bc":
          "Rights, roles, and responsibilities of individuals and groups; people and places in the local community and in local First Peoples communities",
      },
      parentNote:
        "Community helpers and places, classroom rules like taking turns, being responsible, and learning that Indigenous peoples were the first people of this land.",
      generate: helpersRules,
    },
  ],
};
