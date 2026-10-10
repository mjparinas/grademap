import { shuffle } from "../../random";
import type { Question, Course } from "../../types";
import { fromBank, sortQuestion, type BankItem } from "../../bank";

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
  {
    prompt: "Which ocean is on the east side of Canada?",
    right: { label: "the Atlantic Ocean", emoji: "🌊" },
    wrong: [
      { label: "the Pacific Ocean", emoji: "🌊" },
      { label: "the Indian Ocean", emoji: "🌊" },
    ],
    hint: "Canada has the Pacific Ocean on the west, the Atlantic on the east and the Arctic Ocean in the north.",
    emoji: "🗺️",
  },
  {
    prompt: "Which ocean is on the west side of Canada?",
    right: { label: "the Pacific Ocean", emoji: "🌊" },
    wrong: [
      { label: "the Atlantic Ocean", emoji: "🌊" },
      { label: "the Southern Ocean", emoji: "🌊" },
    ],
    hint: "British Columbia is on the west coast, beside the Pacific Ocean.",
    emoji: "🗺️",
  },
  {
    prompt: "What is the capital city of Canada?",
    right: { label: "Ottawa", emoji: "🏛️" },
    wrong: [
      { label: "Victoria", emoji: "🏛️" },
      { label: "Winnipeg", emoji: "🏛️" },
    ],
    hint: "Ottawa is where the federal government meets. Each province has its own capital too.",
  },
  {
    prompt: "What colours are on the Canadian flag?",
    right: { label: "red and white", emoji: "🍁" },
    wrong: [
      { label: "blue and yellow", emoji: "🔵" },
      { label: "green and orange", emoji: "🟢" },
    ],
    hint: "Canada's flag is red and white with a red maple leaf in the middle.",
  },
  {
    prompt: "Which tree's leaf is on the Canadian flag?",
    right: { label: "maple", emoji: "🍁" },
    wrong: [
      { label: "palm", emoji: "🌴" },
      { label: "pine", emoji: "🌲" },
    ],
    hint: "The red leaf on the flag is a maple leaf.",
  },
  {
    prompt: "People in Canada make maple syrup from the sap of…",
    right: { label: "maple trees", emoji: "🍁" },
    wrong: [
      { label: "apple trees", emoji: "🍎" },
      { label: "cactus plants", emoji: "🌵" },
    ],
    hint: "In early spring, sap is collected from maple trees and boiled into syrup.",
  },
  {
    prompt: "Farms with lots of grain are most often found in…",
    right: { label: "the Prairies", emoji: "🌾" },
    wrong: [
      { label: "the Arctic", emoji: "🧊" },
      { label: "the middle of a big city", emoji: "🏙️" },
    ],
    hint: "Wide, flat land with good soil is great for growing wheat and other grains.",
  },
  {
    prompt: "Which place in Canada has the most snow and ice all year?",
    right: { label: "the Arctic", emoji: "🧊" },
    wrong: [
      { label: "the Prairies", emoji: "🌾" },
      { label: "a coastal city", emoji: "🏙️" },
    ],
    hint: "The Arctic is far north, so it stays cold for most of the year.",
  },
  {
    prompt: "A small community with farms and open fields is called a…",
    right: { label: "rural community", emoji: "🚜" },
    wrong: [
      { label: "big city", emoji: "🏙️" },
      { label: "space station", emoji: "🚀" },
    ],
    hint: "Rural means out in the country, where there are fewer people and more open land.",
  },
  {
    prompt: "A community with many people, busy streets and lots of buses is an…",
    right: { label: "urban community", emoji: "🏙️" },
    wrong: [
      { label: "rural community", emoji: "🚜" },
      { label: "empty field", emoji: "🌾" },
    ],
    hint: "Urban means in a city, where lots of people live close together.",
  },
  {
    prompt: "Which would you most likely see in a rural community?",
    right: { label: "a barn and open fields", emoji: "🚜" },
    wrong: [
      { label: "skyscrapers", emoji: "🏙️" },
      { label: "a subway station", emoji: "🚇" },
    ],
    hint: "Rural communities have more farms and open land than tall buildings.",
  },
  {
    prompt: "Which would you most likely see in a big city?",
    right: { label: "tall buildings and many buses", emoji: "🚌" },
    wrong: [
      { label: "a field of cows", emoji: "🐄" },
      { label: "a hay barn", emoji: "🌾" },
    ],
    hint: "Cities are busy places with many buildings and lots of transportation.",
  },
  {
    prompt: "Ravi's family celebrates Diwali. This is part of their…",
    right: { label: "culture", emoji: "🪔" },
    wrong: [
      { label: "weather", emoji: "☁️" },
      { label: "address", emoji: "📮" },
    ],
    hint: "Culture is the way a group of people live, including their celebrations, foods and languages.",
  },
  {
    prompt: "Many communities in Canada hold festivals. What do festivals help us do?",
    right: { label: "enjoy and learn about each other's cultures", emoji: "🎉" },
    wrong: [
      { label: "keep everyone apart", emoji: "🚧" },
      { label: "make everyone the same", emoji: "👥" },
    ],
    hint: "Festivals let us share music, food and traditions with our neighbours.",
  },
  {
    prompt: "Canada is a country. British Columbia is a…",
    right: "province",
    wrong: ["city", "continent"],
    hint: "Canada has ten provinces and three territories. BC is one of the provinces.",
    emoji: "🗺️",
  },
  {
    prompt: "Yukon, Nunavut and the Northwest Territories are called…",
    right: "territories",
    wrong: ["oceans", "cities"],
    hint: "Canada has three territories in the north and ten provinces.",
    emoji: "🧭",
  },
  {
    prompt: "Why do many people in Canada wear warm coats and boots in winter?",
    right: { label: "Winters can be very cold in many places", emoji: "🧥" },
    wrong: [
      { label: "It is always hot", emoji: "☀️" },
      { label: "Because they like swimming", emoji: "🏊" },
    ],
    hint: "Our clothes change with the weather. Many parts of Canada have cold, snowy winters.",
  },
  {
    prompt: "Which animal lives in many forests and lakes across Canada?",
    right: { label: "beaver", emoji: "🦫" },
    wrong: [
      { label: "kangaroo", emoji: "🦘" },
      { label: "camel", emoji: "🐪" },
    ],
    hint: "The beaver is a national symbol of Canada. It builds dams in rivers and streams.",
  },
  {
    prompt: "Which language do many people speak at home in Québec?",
    right: { label: "French", emoji: "💬" },
    wrong: [
      { label: "Japanese", emoji: "💬" },
      { label: "Italian", emoji: "💬" },
    ],
    hint: "Québec is a province where French is the main language, and people also speak English and many other languages.",
  },
  {
    prompt: "Many people in Canada speak a language other than English or French at home. This shows our…",
    right: { label: "many cultures", emoji: "🌍" },
    wrong: [
      { label: "same culture", emoji: "👥" },
      { label: "weather", emoji: "☁️" },
    ],
    hint: "Canada is home to people from all over the world, so we hear many languages.",
  },
  {
    prompt: "Indigenous peoples live in communities across Canada today. This means they…",
    right: { label: "are part of our communities now, not only long ago", emoji: "🌲" },
    wrong: [
      { label: "only lived here long ago", emoji: "⏳" },
      { label: "all live in one place", emoji: "📍" },
    ],
    hint: "First Nations, Métis and Inuit have strong, living communities today.",
  },
  {
    prompt: "Which job would be common in a community near a big forest?",
    right: { label: "forest worker or park ranger", emoji: "🌲" },
    wrong: [
      { label: "ship captain in a desert", emoji: "🚢" },
      { label: "wheat farmer in a rainforest", emoji: "🌾" },
    ],
    hint: "The land around a community shapes the jobs people do.",
  },
  {
    prompt: "A fishing boat is most likely to be found in a community…",
    right: { label: "beside the ocean or a big lake", emoji: "⛵" },
    wrong: [
      { label: "in the middle of a dry field", emoji: "🌾" },
      { label: "on top of a mountain", emoji: "🏔️" },
    ],
    hint: "People who fish need water nearby.",
  },
  {
    prompt: "In winter, which sport can children play on frozen ponds in many parts of Canada?",
    right: { label: "hockey", emoji: "🏒" },
    wrong: [
      { label: "surfing", emoji: "🏄" },
      { label: "beach volleyball", emoji: "🏐" },
    ],
    hint: "Cold weather freezes ponds and rinks, so skating and hockey are popular.",
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
  {
    prompt: "A right is something every person is allowed to have. Which is a right?",
    right: { label: "to be safe", emoji: "🛡️" },
    wrong: [
      { label: "to hurt others", emoji: "✊" },
      { label: "to break things", emoji: "🔨" },
    ],
    hint: "Everyone has the right to be safe, be treated fairly and be cared for.",
  },
  {
    prompt: "Which is a responsibility at home?",
    right: { label: "helping to set the table", emoji: "🍽️" },
    wrong: [
      { label: "leaving toys all over the floor", emoji: "🧸" },
      { label: "hiding when someone needs help", emoji: "🙈" },
    ],
    hint: "A responsibility is a job we do to help our family and community.",
  },
  {
    prompt: "What does a doctor or nurse do?",
    right: { label: "helps people stay healthy", emoji: "🩺" },
    wrong: [
      { label: "drives a school bus", emoji: "🚌" },
      { label: "puts out fires", emoji: "🚒" },
    ],
    hint: "Doctors and nurses are helpers who look after our health.",
  },
  {
    prompt: "What does a bus driver do?",
    right: { label: "takes people safely where they need to go", emoji: "🚌" },
    wrong: [
      { label: "grows our food", emoji: "🚜" },
      { label: "fixes teeth", emoji: "🦷" },
    ],
    hint: "Bus drivers help people get to school and work.",
  },
  {
    prompt: "What does a garbage and recycling collector do?",
    right: { label: "keeps our streets clean and takes away waste", emoji: "🚛" },
    wrong: [
      { label: "teaches reading", emoji: "📖" },
      { label: "builds a house", emoji: "🏠" },
    ],
    hint: "Collectors are community helpers who take away garbage and recycling.",
  },
  {
    prompt: "Your classmate drops all their crayons. A caring citizen would…",
    right: { label: "help pick them up", emoji: "🖍️" },
    wrong: [
      { label: "laugh and walk away", emoji: "😆" },
      { label: "kick them away", emoji: "🦶" },
    ],
    hint: "A caring citizen helps others when they can.",
  },
  {
    prompt: "A new student joins your class. How can you help them feel welcome?",
    right: { label: "say hello and invite them to play", emoji: "👋" },
    wrong: [
      { label: "ignore them", emoji: "🙅" },
      { label: "say they can't sit with you", emoji: "🚫" },
    ],
    hint: "Welcoming others makes our community friendlier.",
  },
  {
    prompt: "Why do we have rules on the playground?",
    right: { label: "to keep everyone safe and fair", emoji: "📋" },
    wrong: [
      { label: "to stop all fun", emoji: "😠" },
      { label: "just because", emoji: "🤷" },
    ],
    hint: "Rules help everyone play safely and fairly.",
  },
  {
    prompt: "You find a lost mitten on the playground. What is a kind thing to do?",
    right: { label: "give it to a teacher so the owner can find it", emoji: "🧤" },
    wrong: [
      { label: "keep it hidden", emoji: "🙈" },
      { label: "throw it in the trash", emoji: "🗑️" },
    ],
    hint: "Being honest and helpful is part of being a good citizen.",
  },
  {
    prompt: "Taking turns on the swings is a way to be…",
    right: { label: "fair", emoji: "⚖️" },
    wrong: [
      { label: "bossy", emoji: "😤" },
      { label: "sneaky", emoji: "🦊" },
    ],
    hint: "Fair means everyone gets a chance.",
  },
  {
    prompt: "A community garden is a place where neighbours can…",
    right: { label: "grow vegetables and flowers together", emoji: "🥕" },
    wrong: [
      { label: "park their cars", emoji: "🚗" },
      { label: "keep their trash", emoji: "🗑️" },
    ],
    hint: "Working together on something is a great way to care for a community.",
  },
  {
    prompt: "Which is a way to save water at home?",
    right: { label: "turn off the tap while brushing your teeth", emoji: "🚰" },
    wrong: [
      { label: "leave the tap running all day", emoji: "💦" },
      { label: "fill the tub for no reason", emoji: "🛁" },
    ],
    hint: "Water is precious. Using less helps people and nature all over the world.",
  },
  {
    prompt: "Why is it important to put litter in a bin?",
    right: { label: "It keeps parks and streams clean for animals and people", emoji: "🌳" },
    wrong: [
      { label: "It makes more garbage on the ground", emoji: "🗑️" },
      { label: "Nobody cares about parks", emoji: "😐" },
    ],
    hint: "Litter can hurt animals and spoil places we enjoy.",
  },
  {
    prompt: "What can you do with a clean empty cardboard box to help the Earth?",
    right: { label: "recycle it or use it again", emoji: "📦" },
    wrong: [
      { label: "throw it in a river", emoji: "🏞️" },
      { label: "burn it outside", emoji: "🔥" },
    ],
    hint: "Reuse and recycle help us use fewer new things.",
    emoji: "♻️",
  },
  {
    prompt: "A crossing guard helps children…",
    right: { label: "cross the street safely", emoji: "🚸" },
    wrong: [
      { label: "bake a cake", emoji: "🎂" },
      { label: "read a map in space", emoji: "🚀" },
    ],
    hint: "Crossing guards are community helpers who watch for traffic.",
  },
  {
    prompt: "A person who brings letters and parcels to your home is a…",
    right: { label: "mail carrier", emoji: "📬" },
    wrong: [
      { label: "dentist", emoji: "🦷" },
      { label: "baker", emoji: "🍞" },
    ],
    hint: "Mail carriers help connect people in the community.",
  },
  {
    prompt: "Voting is one way adults help decide things for their community. Who gets to vote?",
    right: { label: "adult citizens of Canada", emoji: "🗳️" },
    wrong: [
      { label: "only kittens", emoji: "🐱" },
      { label: "nobody", emoji: "🚫" },
    ],
    hint: "Adults who are citizens can vote for the people who make decisions for us.",
  },
  {
    prompt: "In your classroom, you can help make a decision by…",
    right: { label: "listening to others and sharing your idea politely", emoji: "🗣️" },
    wrong: [
      { label: "shouting your idea over everyone", emoji: "📢" },
      { label: "refusing to listen", emoji: "🙉" },
    ],
    hint: "A good citizen listens and shares ideas respectfully.",
  },
  {
    prompt: "Respecting others means…",
    right: { label: "treating them kindly, even when they are different from us", emoji: "🤝" },
    wrong: [
      { label: "teasing people who are different", emoji: "😝" },
      { label: "only playing with people who look like us", emoji: "👥" },
    ],
    hint: "Respect is one of the best things we can show in our community.",
  },
  {
    prompt: "Zoe sees a classmate who is sad. A kind thing to do is…",
    right: { label: "ask if they want to talk or play", emoji: "💛" },
    wrong: [
      { label: "pretend not to see", emoji: "🙈" },
      { label: "tell them to go away", emoji: "🚫" },
    ],
    hint: "Kindness helps people feel they belong.",
  },
  {
    prompt: "Our local park belongs to…",
    right: { label: "everyone in the community", emoji: "🌳" },
    wrong: [
      { label: "only one person", emoji: "🧍" },
      { label: "only people who are tall", emoji: "📏" },
    ],
    hint: "Public places like parks and libraries are for everyone to share and take care of.",
  },
  {
    prompt: "What is a good way to help your community stay healthy?",
    right: { label: "wash your hands and stay home when sick", emoji: "🧼" },
    wrong: [
      { label: "share your cold on purpose", emoji: "🤧" },
      { label: "never wash your hands", emoji: "🙅" },
    ],
    hint: "Looking after our health also helps the people around us.",
  },
  {
    prompt: "Adults pay taxes and use the money to pay for things like…",
    right: { label: "roads, schools and parks", emoji: "🛣️" },
    wrong: [
      { label: "candy for every child", emoji: "🍬" },
      { label: "a private rocket", emoji: "🚀" },
    ],
    hint: "Everyone shares the cost of things the whole community uses.",
  },
];

function caring(): Question[] {
  return shuffle([sortQuestion(EARTH_SORT, 3), ...fromBank(CARING_BANK, 7)]);
}

export const course: Course = {
  grade: "2",
  subject: "social",
  bigIdeas: {
    "ca-bc": [
    "Local actions have global consequences, and global actions have local consequences.",
    "Canada is made up of many diverse regions and communities.",
    "Individuals have rights and responsibilities as global citizens.",
    "Our rights, roles, and responsibilities are important for building strong communities.",
    ],
  },
  units: [
    {
      id: "needs-and-wants",
      title: "Needs & Wants",
      emoji: "🏠",
      blurb: "What do we really need?",
      standards: { "ca-bc": "How people's needs and wants are met in communities" },
      parentNote: "Telling needs from wants and how communities help meet people's needs.",
      generate: needsWants,
    },
    {
      id: "communities-in-canada",
      title: "Communities in Canada",
      emoji: "🍁",
      blurb: "Mountains, prairies and the Arctic",
      standards: { "ca-bc": "Diverse characteristics of communities and cultures in Canada; features of the environment in other parts of Canada" },
      parentNote: "Canada's regions, cities and rural communities, official languages, and Indigenous peoples as the first peoples of this land.",
      generate: canada,
    },
    {
      id: "caring-citizens",
      title: "Caring Citizens",
      emoji: "🤝",
      blurb: "Rights and responsibilities",
      standards: { "ca-bc": "Rights, roles and responsibilities of individuals and communities; local actions with global consequences" },
      parentNote: "Rights and responsibilities, community helpers, and how small local actions help the planet.",
      generate: caring,
    },
  ],
};
