import type { Unit } from "../types";
import { e, order, q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";
import { ab } from "./kit";

// Alberta Kindergarten science (KM, KE, KES, KCS). Materials, movement, living things and weather are shared
// with BC and Ontario (see k.ts). These four units cover the senses, natural and made things, caring for the
// environment, and following instructions.

// ---------- My Five Senses ----------

const SENSES: Item[] = [
  q("Which body part do you use to see a rainbow?", e("eyes", "👀"), [e("nose", "👃"), e("ears", "👂")], "We see with our eyes.", { emoji: "🌈" }),
  q("Which body part do you use to hear a drum?", e("ears", "👂"), [e("eyes", "👀"), e("tongue", "👅")], "We hear with our ears.", { emoji: "🥁" }),
  q("Which sense do you use to smell fresh bread?", e("smell", "👃"), [e("sight", "👀"), e("hearing", "👂")], "We smell with our nose.", { emoji: "🍞" }),
  q("Which sense do you use to taste a lemon?", e("taste", "👅"), [e("smell", "👃"), e("touch", "✋")], "We taste with our tongue.", { emoji: "🍋" }),
  q("Which sense tells you that ice is cold?", e("touch", "✋"), [e("hearing", "👂"), e("sight", "👀")], "We feel hot and cold with our skin, such as our hands.", { emoji: "🧊" }),
  q("How many senses do we have?", "5", ["2", "9"], "We have five senses: sight, hearing, smell, taste and touch.", { d: 2 }),
  q("Which word tells how a pillow feels?", "soft", ["loud", "sour"], "Soft is a touch word. Loud is for hearing, sour is for taste.", { emoji: "🛏️" }),
  q("Which word tells how a siren sounds?", "loud", ["rough", "sweet"], "Loud and quiet tell about sounds.", { emoji: "🚨" }),
  q("Which word tells how a lemon tastes?", "sour", ["quiet", "smooth"], "Sweet, sour and salty tell about taste.", { emoji: "🍋" }),
  q("Which word tells how sandpaper feels?", "rough", ["sweet", "loud"], "Rough and smooth tell about touch.", { d: 2 }),
  q("Which object is round?", e("a ball", "⚽"), [e("a box", "📦"), e("a book", "📘")], "Round things have no corners.", { d: 2 }),
  q("Which object is the longest?", e("a snake", "🐍"), [e("a snail", "🐌"), e("a button", "🔘")], "Long means a lot of length from end to end.", { d: 2 }),
  q("Which two senses do you use to enjoy a cookie?", "taste and smell", ["hearing and sight only", "no senses at all"], "Taste, smell, sight and touch all help us explore food.", { emoji: "🍪", d: 3 }),
  q("You want to find out if a rock is rough. What do you use?", "touch", ["hearing", "taste"], "We feel texture with our hands.", { emoji: "🪨", d: 3 }),
  q("Two balls are the same shape but not the same colour. What is different?", "colour", ["shape", "size"], "Properties are things such as colour, shape, size and texture.", { d: 3 }),
];

const SENSE_SORT = sorter({
  prompt: "Which sense? Tap a picture, then its basket.",
  hint: "We hear with our ears and see with our eyes.",
  bins: [
    { id: "hear", label: "Hear", emoji: "👂" },
    { id: "see", label: "See", emoji: "👀" },
  ],
  items: [
    { label: "bell", emoji: "🔔", bin: "hear" },
    { label: "drum", emoji: "🥁", bin: "hear" },
    { label: "bird song", emoji: "🐦", bin: "hear" },
    { label: "thunder", emoji: "⛈️", bin: "hear" },
    { label: "rainbow", emoji: "🌈", bin: "see" },
    { label: "kite", emoji: "🪁", bin: "see" },
    { label: "flower", emoji: "🌷", bin: "see" },
    { label: "stars", emoji: "⭐", bin: "see" },
  ],
});

// ---------- Natural or Made ----------

const NATURAL: Item[] = [
  q("Which one was made by people?", e("a bridge", "🌉"), [e("a mountain", "⛰️"), e("a river", "🏞️")], "People build bridges. Mountains and rivers are natural.", { emoji: "🔍" }),
  q("Which one is found in nature?", e("a pine tree", "🌲"), [e("a car", "🚗"), e("a chair", "🪑")], "Trees grow by themselves in nature.", { emoji: "🌲" }),
  q("Which is in our environment and made by people?", e("a school", "🏫"), [e("a lake", "🏞️"), e("a bird", "🐦")], "Buildings are made by people."),
  q("Which place is a natural part of the environment?", "a meadow", ["a parking lot", "a swimming pool"], "A meadow grows without being built.", { emoji: "🌾" }),
  q("What are the living things in an environment?", "plants, people and other animals", ["only cars", "only rocks"], "Plants and animals, including people, are living things in an environment.", { d: 2 }),
  q("Which is a part of the surrounding environment?", "the sky", ["a dream", "a thought"], "The environment is what is around us, like sky, land, water and air.", { emoji: "☁️", d: 2 }),
  q("You walk to a park. What can you see that is natural?", "trees", ["swings", "benches"], "Trees are natural. Swings and benches are made.", { emoji: "🌳" }),
  q("What can we ask about our environment?", "Why are the leaves turning yellow?", ["Where is my sock?", "What is for lunch?"], "A good science question is about what we see around us.", { d: 2 }),
  q("You visit a forest. How should you treat it?", "with respect", ["by breaking branches", "by shouting"], "We look, listen and leave things as we found them.", { emoji: "🌲", d: 2 }),
  q("Which one is made by people?", e("a swing", "🛝"), [e("a cloud", "☁️"), e("a bee", "🐝")], "People made swings for play."),
  q("A beaver builds a dam. A dam in a stream is…", "made by an animal", ["made by a rock", "made by the wind"], "Beavers build dams from sticks and mud.", { emoji: "🦫", d: 3 }),
  q("A road, a house and a fence are all…", "made by people", ["natural", "alive"], "People build roads, houses and fences.", { d: 3 }),
  q("Which one is natural?", e("a hill", "⛰️"), [e("a building", "🏢"), e("a road", "🛣️")], "Hills were not built by people."),
  q("Which is the best way to learn about a pond?", "look, listen and ask questions", ["throw rocks in it", "ignore it"], "We explore the environment with our senses and careful questions.", { emoji: "🪷", d: 3 }),
];

const NATURAL_SORT = sorter({
  prompt: "Natural or made? Tap a picture, then its basket.",
  hint: "Natural things were not made by people. Made things were.",
  bins: [
    { id: "natural", label: "Natural", emoji: "🌿" },
    { id: "made", label: "Made", emoji: "🏗️" },
  ],
  items: [
    { label: "tree", emoji: "🌲", bin: "natural" },
    { label: "mountain", emoji: "🏔️", bin: "natural" },
    { label: "river", emoji: "🏞️", bin: "natural" },
    { label: "rock", emoji: "🪨", bin: "natural" },
    { label: "house", emoji: "🏠", bin: "made" },
    { label: "bridge", emoji: "🌉", bin: "made" },
    { label: "bus", emoji: "🚌", bin: "made" },
    { label: "swing", emoji: "🛝", bin: "made" },
  ],
});

// ---------- Care for Our Earth ----------

const CARE: Item[] = [
  q("Which word means using something again?", "reuse", ["throw", "break"], "To reuse is to use something again, like a jar for pencils.", { emoji: "♻️" }),
  q("What does it mean to reduce waste?", "make less garbage", ["make more garbage", "paint the garbage"], "Reducing waste means using less so there is less to throw away.", { emoji: "🗑️" }),
  q("Where does an empty paper box go to be recycled?", e("recycling bin", "♻️"), [e("a hole in the ground", "🕳️"), e("the playground", "🛝")], "Recycling turns old things into new things."),
  q("Where does litter belong?", "in a garbage bin", ["on the ground", "in a river"], "Putting litter in a bin keeps our places clean.", { emoji: "🧹" }),
  q("You finish a snack. What do you do with the wrapper?", "put it in the bin", ["drop it on the grass", "toss it in a puddle"], "Not littering is a way to respect nature."),
  q("Which is a way to reuse?", "draw on both sides of paper", ["throw the paper away right away", "tear paper into bits and drop it"], "Using both sides is using something again.", { emoji: "📄", d: 2 }),
  q("Which helps reduce waste at lunch?", "a lunch box you can use again", ["a new plastic bag each day", "a wrapper for every item"], "Things we can use again make less garbage.", { emoji: "🥪", d: 2 }),
  q("Which one can go in a recycling bin?", e("a clean can", "🥫"), [e("a banana peel", "🍌"), e("a dirty tissue", "🤧")], "Clean metal cans can be recycled.", { d: 2 }),
  q("Why should we protect nature?", "plants, animals and people need it", ["it is boring", "nobody lives there"], "Plants, animals and people all need clean air, water and land.", { d: 2 }),
  q("You see a plant bending. What is a kind thing to do?", "water it gently", ["step on it", "pull it out"], "Caring for plants helps them grow.", { emoji: "🪴" }),
  q("Which is a way to care for nature?", "take only what you need", ["pick all the flowers", "break the nests"], "Taking only what we need leaves enough for others.", { emoji: "🌼", d: 3 }),
  q("A park is full of litter. What can a class do?", "pick it up with a grown-up", ["leave it", "add more"], "Working together helps care for our places. Always have a grown-up help.", { d: 3 }),
  q("You spend time at a quiet lake. How might you feel?", "calm and happy", ["angry", "afraid of the water"], "Being in nature can make people feel calm and connected.", { emoji: "🏞️", d: 3 }),
  q("Which is a way to show respect for animals outside?", "watch them from far away", ["chase them", "feed them junk food"], "Watching quietly keeps animals safe.", { emoji: "🦌", d: 2 }),
];

const CARE_SORT = sorter({
  prompt: "Helps nature or hurts nature? Tap a picture, then its basket.",
  hint: "Picking up litter and planting help nature. Littering and breaking plants hurt it.",
  bins: [
    { id: "help", label: "Helps", emoji: "💚" },
    { id: "hurt", label: "Hurts", emoji: "💔" },
  ],
  items: [
    { label: "recycle a can", emoji: "♻️", bin: "help" },
    { label: "plant a tree", emoji: "🌳", bin: "help" },
    { label: "reuse a jar", emoji: "🫙", bin: "help" },
    { label: "pick up litter", emoji: "🧹", bin: "help" },
    { label: "drop litter", emoji: "🗑️", bin: "hurt" },
    { label: "break a branch", emoji: "🌿", bin: "hurt" },
    { label: "waste paper", emoji: "📄", bin: "hurt" },
    { label: "leave the tap on", emoji: "🚰", bin: "hurt" },
  ],
});

// ---------- Follow the Steps ----------

const STEPS: Item[] = [
  q("What are instructions?", "steps that tell us what to do", ["a kind of snack", "a loud song"], "Instructions tell us what to do and in what order.", { emoji: "📋" }),
  q("Why do we follow instructions?", "to do something safely and right", ["to waste time", "to be silent"], "Instructions help us do things the right way."),
  q("Which one has instructions?", e("a game's rules", "🎲"), [e("a cloud", "☁️"), e("a rock", "🪨")], "Games come with rules and steps."),
  q("A sign shows a hand and says STOP. What do you do?", "stop walking", ["run faster", "close your eyes"], "A stop sign tells us to stop.", { emoji: "🛑" }),
  q("A traffic light is green. What does it mean?", "you can go when it is safe", ["you must sit down", "you must jump"], "Green means go, red means stop, when a grown-up says it is safe.", { emoji: "🚦", d: 2 }),
  q("Your teacher says, “Wash your hands, then dry them.” What is first?", "wash your hands", ["dry them", "leave the sink"], "Do the steps in the order they are said.", { emoji: "🧼" }),
  q("A recipe says: stir, then bake. What do you do first?", "stir", ["bake", "eat"], "A recipe has steps in order.", { emoji: "🥣", d: 2 }),
  q("You have a toy to build. Where do you find the steps?", "on the instruction sheet", ["in the garbage", "under the bed"], "Building sets come with steps and pictures.", { emoji: "🧩", d: 2 }),
  q("Which is a clear instruction?", "Put the blue block on top.", ["Put the thing there.", "Do it."], "Clear instructions use exact words.", { d: 2 }),
  q("A robot toy needs steps: forward, turn, forward. Which is the middle step?", "turn", ["forward", "stop"], "Follow the steps in order: first forward, next turn, last forward.", { emoji: "🤖", d: 3 }),
  q("An arrow points right. Where do you go?", "to the right", ["to the left", "up in the air"], "Arrows and signs give directions without words.", { d: 3 }),
  q("You skipped a step in a game. What can you do?", "go back and try again", ["quit forever", "hide"], "It is okay to try again and fix a step.", { d: 3 }),
];

const STEPS_ORDER = order("Brush your teeth. Tap the steps in order.", "Think about what you do first, next and last.", [
  ["put paste on the brush", "🪥"],
  ["brush your teeth", "😁"],
  ["rinse your mouth", "💧"],
]);

const STEPS_ORDER2 = order("Make a sandwich. Tap the steps in order.", "Begin with the bread.", [
  ["take two slices of bread", "🍞"],
  ["add a filling", "🧀"],
  ["put the slices together", "🥪"],
]);

export const units: Unit[] = [
  {
    id: "five-senses-ab",
    title: "My Five Senses",
    emoji: "👃",
    blurb: "See, hear, smell, taste and touch",
    standards: ab("KM 1, KES 1.1", "exploring objects and the environment with the five senses, and describing what we notice"),
    parentNote: "Take a sensory walk and name what you see, hear, smell and feel. Sort household objects by how they feel, such as rough and smooth.",
    generate: unitOf(SENSES, [SENSE_SORT]),
  },
  {
    id: "natural-or-made-ab",
    title: "Natural or Made",
    emoji: "🏞️",
    blurb: "What is in our environment?",
    standards: ab("KES 1.1, KES 1.2", "describing the environment, including living things, and telling natural objects from objects made by people"),
    parentNote: "On a walk, point out natural things (trees, rocks, water) and things people made (benches, roads). Ask your child to wonder about what they see.",
    generate: unitOf(NATURAL, [NATURAL_SORT]),
  },
  {
    id: "care-for-earth-ab",
    title: "Care for Our Earth",
    emoji: "♻️",
    blurb: "Reduce, reuse, recycle and respect nature",
    standards: ab("KES 1.4, KES 1.5", "protecting the environment by reducing waste, reusing and recycling, and feeling connected to and caring for nature"),
    parentNote: "Show how your family reuses and recycles. Spend time outside, and talk about taking only what you need and leaving nature as you found it.",
    generate: unitOf(CARE, [CARE_SORT]),
  },
  {
    id: "follow-the-steps-ab",
    title: "Follow the Steps",
    emoji: "📋",
    blurb: "Why instructions matter",
    standards: ab("KCS 1.1, KCS 1.2", "understanding the purpose of instructions, and following steps in the right order"),
    parentNote: "Instructions are the first idea behind computer coding. Cook, build or play a game together and say the steps out loud in order.",
    generate: unitOf(STEPS, [STEPS_ORDER, STEPS_ORDER2]),
  },
];
