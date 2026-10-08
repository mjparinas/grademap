import { shuffle } from "../random";
import type { Question, Subject } from "../types";
import { fromBank, sortQuestion, type BankItem } from "./bank";

// ---------- Needs & Wants ----------

const NEEDS_SORT = {
  prompt: "Is it a need or a want? Tap an item, then tap its basket.",
  hint: "Needs are things we must have to live and be healthy. Wants are nice to have, but we can live without them.",
  bins: [
    { id: "need", label: "need", emoji: "🏠" },
    { id: "want", label: "want", emoji: "🎁" },
  ],
  items: [
    { label: "water", emoji: "💧", bin: "need" },
    { label: "healthy food", emoji: "🥕", bin: "need" },
    { label: "a home", emoji: "🏠", bin: "need" },
    { label: "warm clothes", emoji: "🧥", bin: "need" },
    { label: "medicine when sick", emoji: "🩹", bin: "need" },
    { label: "video game", emoji: "🎮", bin: "want" },
    { label: "candy", emoji: "🍭", bin: "want" },
    { label: "toy robot", emoji: "🤖", bin: "want" },
    { label: "skateboard", emoji: "🛹", bin: "want" },
    { label: "ice cream", emoji: "🍦", bin: "want" },
  ],
};

const NEEDS_BANK: BankItem[] = [
  {
    prompt: "Which one is a need?",
    right: { label: "clean water", emoji: "💧" },
    wrong: [
      { label: "a new toy", emoji: "🧸" },
      { label: "a lollipop", emoji: "🍭" },
    ],
    hint: "A need is something we must have to live.",
  },
  {
    prompt: "Which one is a want?",
    right: { label: "a video game", emoji: "🎮" },
    wrong: [
      { label: "food", emoji: "🍎" },
      { label: "a warm coat", emoji: "🧥" },
    ],
    hint: "A want is nice to have, but we can live without it.",
  },
  {
    prompt: "Where can families buy food in a community?",
    right: { label: "a grocery store", emoji: "🛒" },
    wrong: [
      { label: "a library", emoji: "📚" },
      { label: "a fire hall", emoji: "🚒" },
    ],
    hint: "Grocery stores, markets and farms help people get food.",
  },
  {
    prompt: "Who helps people when they are sick?",
    right: { label: "a doctor or nurse", emoji: "🧑‍⚕️" },
    wrong: [
      { label: "a bus driver", emoji: "🚌" },
      { label: "a painter", emoji: "🎨" },
    ],
    hint: "Doctors and nurses help us stay healthy.",
  },
  {
    prompt: "Everyone needs a safe place to live. What is that called?",
    right: { label: "shelter", emoji: "🏠" },
    wrong: [
      { label: "a playground", emoji: "🛝" },
      { label: "a store", emoji: "🏪" },
    ],
    hint: "Shelter keeps us safe, warm and dry.",
  },
  {
    prompt: "Where does a lot of our food come from?",
    right: { label: "farms", emoji: "🚜" },
    wrong: [
      { label: "the moon", emoji: "🌙" },
      { label: "the toy store", emoji: "🧸" },
    ],
    hint: "Farmers grow fruit, vegetables and grain, and raise animals.",
  },
];

function needsWants(): Question[] {
  return shuffle([sortQuestion(NEEDS_SORT, 3), ...fromBank(NEEDS_BANK, 6)]);
}

// ---------- Communities in Canada ----------

const CANADA_BANK: BankItem[] = [
  {
    prompt: "Which province has tall mountains, big forests and the Pacific Ocean?",
    right: { label: "British Columbia", emoji: "🏔️" },
    wrong: [
      { label: "Saskatchewan", emoji: "🌾" },
      { label: "Nunavut", emoji: "❄️" },
    ],
    hint: "That's our province! BC is on the west coast of Canada.",
  },
  {
    prompt: "Which part of Canada has wide, flat land with lots of wheat farms?",
    right: { label: "the Prairies", emoji: "🌾" },
    wrong: [
      { label: "the Rocky Mountains", emoji: "🏔️" },
      { label: "the Arctic", emoji: "🧊" },
    ],
    hint: "The Prairies (Alberta, Saskatchewan and Manitoba) are flat and great for farming.",
  },
  {
    prompt: "In the Arctic, in the far north of Canada, winters are…",
    right: { label: "very long and cold", emoji: "❄️" },
    wrong: [
      { label: "hot and sunny", emoji: "☀️" },
      { label: "short and warm", emoji: "🌴" },
    ],
    hint: "The Arctic is near the North Pole. Winter is long, dark and very cold.",
  },
  {
    prompt: "Canada has two official languages. They are…",
    right: "English and French",
    wrong: ["English and Spanish", "French and German"],
    hint: "Canada's two official languages are English and French. Bonjour!",
    emoji: "🍁",
  },
  {
    prompt: "A big community with lots of people and tall buildings is called a…",
    right: { label: "city", emoji: "🏙️" },
    wrong: [
      { label: "farm", emoji: "🚜" },
      { label: "campsite", emoji: "🏕️" },
    ],
    hint: "Vancouver and Toronto are big cities.",
  },
  {
    prompt: "People in a community by the ocean might work as…",
    right: { label: "fishers", emoji: "🎣" },
    wrong: [
      { label: "desert guides", emoji: "🐪" },
      { label: "ski instructors on the beach", emoji: "🎿" },
    ],
    hint: "Communities near the ocean often have jobs that use the sea, like fishing.",
    emoji: "🌊",
  },
  {
    prompt: "Who were the first people to live on the land we now call Canada?",
    right: "Indigenous peoples, like First Nations and Inuit",
    wrong: ["Settlers from France", "Settlers from England"],
    hint: "Indigenous peoples have lived here for thousands of years, long before settlers came.",
    emoji: "🌲",
  },
  {
    prompt: "People in Canada come from many cultures. What can we share with each other?",
    right: { label: "foods, languages and celebrations", emoji: "🎉" },
    wrong: [
      { label: "nothing at all", emoji: "🚫" },
      { label: "only homework", emoji: "📝" },
    ],
    hint: "Learning about each other's cultures makes our communities stronger.",
    emoji: "🌍",
  },
];

function canada(): Question[] {
  return fromBank(CANADA_BANK, 8);
}

// ---------- Caring Citizens ----------

const EARTH_SORT = {
  prompt: "Does it help the Earth or harm it? Tap an item, then tap its basket.",
  hint: "Small actions add up! What we do here can help or harm the whole planet.",
  bins: [
    { id: "help", label: "helps", emoji: "💚" },
    { id: "harm", label: "harms", emoji: "💔" },
  ],
  items: [
    { label: "recycle", emoji: "♻️", bin: "help" },
    { label: "plant a tree", emoji: "🌳", bin: "help" },
    { label: "walk or bike", emoji: "🚲", bin: "help" },
    { label: "pick up litter", emoji: "🧤", bin: "help" },
    { label: "leave lights on all day", emoji: "💡", bin: "harm" },
    { label: "drop litter on the ground", emoji: "🥤", bin: "harm" },
    { label: "leave the car running", emoji: "🚗", bin: "harm" },
  ],
};

const CARING_BANK: BankItem[] = [
  {
    prompt: "Which is a responsibility at school?",
    right: { label: "cleaning up after yourself", emoji: "🧹" },
    wrong: [
      { label: "taking someone's snack", emoji: "🍪" },
      { label: "yelling during story time", emoji: "📢" },
    ],
    hint: "A responsibility is something we should do to help others and ourselves.",
  },
  {
    prompt: "All children have the right to…",
    right: { label: "go to school and learn", emoji: "🏫" },
    wrong: [
      { label: "drive a car", emoji: "🚗" },
      { label: "stay up all night", emoji: "🌙" },
    ],
    hint: "Every child has the right to learn, to be safe, and to have food and clean water.",
  },
  {
    prompt: "Turning off the lights when you leave a room helps…",
    right: { label: "save energy for the planet", emoji: "🌍" },
    wrong: [
      { label: "make the room hotter", emoji: "🔥" },
      { label: "nobody at all", emoji: "🤷" },
    ],
    hint: "Saving energy at home helps the whole world.",
    emoji: "💡",
  },
  {
    prompt: "What does a firefighter do?",
    right: { label: "puts out fires and keeps us safe", emoji: "🚒" },
    wrong: [
      { label: "delivers the mail", emoji: "📬" },
      { label: "bakes bread", emoji: "🍞" },
    ],
    hint: "Firefighters are community helpers who keep us safe.",
    emoji: "🧑‍🚒",
  },
  {
    prompt: "How can you be a good friend at school?",
    right: { label: "share and include others", emoji: "🤝" },
    wrong: [
      { label: "leave someone out", emoji: "🙅" },
      { label: "grab toys", emoji: "✊" },
    ],
    hint: "Being kind and including others makes our community strong.",
  },
  {
    prompt: "A librarian helps people…",
    right: { label: "find books to read", emoji: "📚" },
    wrong: [
      { label: "fix cars", emoji: "🔧" },
      { label: "fly planes", emoji: "✈️" },
    ],
    hint: "Libraries are community places where everyone can borrow books.",
    emoji: "🏛️",
  },
  {
    prompt: "If everyone in our town recycles, what happens?",
    right: { label: "less garbage for the whole planet", emoji: "♻️" },
    wrong: [
      { label: "more garbage", emoji: "🗑️" },
      { label: "nothing changes", emoji: "😐" },
    ],
    hint: "Local actions have global effects. When many people help, it makes a big difference!",
  },
];

function caring(): Question[] {
  return shuffle([sortQuestion(EARTH_SORT, 3), ...fromBank(CARING_BANK, 7)]);
}

export const world: Subject = {
  id: "world",
  title: "Our World",
  emoji: "🌎",
  colour: "#ff9636",
  colourDark: "#e57a12",
  colourSoft: "#fff1e2",
  tagline: "Communities & caring",
  bigIdeas: [
    "Local actions have global consequences, and global actions have local consequences.",
    "Canada is made up of many diverse regions and communities.",
    "Individuals have rights and responsibilities as global citizens.",
    "Our rights, roles, and responsibilities are important for building strong communities.",
  ],
  units: [
    {
      id: "needs-and-wants",
      title: "Needs & Wants",
      emoji: "🏠",
      blurb: "What do we really need?",
      standard: "How people's needs and wants are met in communities",
      parentNote: "Telling needs from wants and how communities help meet people's needs.",
      generate: needsWants,
    },
    {
      id: "communities-in-canada",
      title: "Communities in Canada",
      emoji: "🍁",
      blurb: "Mountains, prairies and the Arctic",
      standard: "Diverse characteristics of communities and cultures in Canada; features of the environment in other parts of Canada",
      parentNote: "Canada's regions, cities and rural communities, official languages, and Indigenous peoples as the first peoples of this land.",
      generate: canada,
    },
    {
      id: "caring-citizens",
      title: "Caring Citizens",
      emoji: "🤝",
      blurb: "Rights and responsibilities",
      standard: "Rights, roles and responsibilities of individuals and communities; local actions with global consequences",
      parentNote: "Rights and responsibilities, community helpers, and how small local actions help the planet.",
      generate: caring,
    },
  ],
};
