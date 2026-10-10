import type { Unit } from "../types";
import { ab } from "./kit";
import { e, order, q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";

// Alberta Grade 1 science (2023): properties of objects (Matter), movement (Energy), seasonal changes (Earth
// and Space), plants and animals and what they need (Living Systems), following instructions (Computer
// Science). BC and Ontario units that fit are shared in g1.ts; the units below are new.

// ---------- Properties of Objects ----------

const PROPERTIES: Item[] = [
  q("Which property tells how long something is?", "length", ["weight", "colour"], "Length is how long or short an object is.", { emoji: "📏" }),
  q("Which tool can compare how heavy two things are?", e("balance scale", "⚖️"), [e("magnifying glass", "🔍"), e("clock", "🕒")], "A balance scale tips down on the heavier side."),
  q("Weight tells us how…", "heavy something is", ["tall something is", "loud something is"], "Weight is the heaviness of an object.", { emoji: "⚖️" }),
  q("How much flat space an object covers is its…", "area", ["weight", "temperature"], "Area is the flat space something covers, like a rug on a floor.", { emoji: "🟦" }),
  q("A balance scale tips down on the left. What is heavier?", "the left side", ["the right side", "They are the same"], "The heavier side goes down.", { emoji: "⚖️" }),
  q("Both start at the same line. The pencil sticks out. Which is longer?", "the pencil", ["the crayon", "They are the same"], "Line up one end, then see which sticks out more.", { d: 2 }),
  q("Which has more area, a sticker or a poster?", "a poster", ["a sticker", "They are the same"], "The poster covers more flat space.", { d: 2 }),
  q("Which is heavier?", "a rock", ["a feather", "a leaf"], "A rock feels heavier than a feather or a leaf.", { emoji: "🪨" }),
  q("To compare two lengths fairly, the objects should start…", "at the same line", ["far apart", "at different places"], "Line up the starts so the comparison is fair.", { d: 2 }),
  q("You squish a ball of clay flat. What changed?", "its shape", ["it turned into water", "nothing at all"], "You can change an object's shape by squishing it.", { emoji: "🧱" }),
  q("You stretch an elastic band. What happens to its length?", "it gets longer", ["it gets shorter", "it turns heavy"], "Stretching makes an object longer.", { emoji: "🪢" }),
  q("You cut a ribbon in two. Each piece is…", "shorter than before", ["longer than before", "the same as before"], "Cutting makes shorter pieces.", { emoji: "🎀" }),
  q("You fold a piece of paper in half. It is still…", "paper", ["cloth", "a rock"], "Folding changes the shape, but it is still paper.", { emoji: "📄", d: 2 }),
  q("What happens to a dry sponge when it soaks up water?", "it gets heavier", ["it gets lighter", "it disappears"], "Water adds weight.", { emoji: "🧽", d: 2 }),
  q("Which action can make a tower of blocks taller?", "adding more blocks", ["taking blocks away", "tipping it over"], "More blocks make a taller tower.", { emoji: "🧱", d: 2 }),
  q("Which action makes a piece of string shorter?", "cutting it", ["stretching it", "adding string"], "Cutting takes away length.", { d: 3 }),
  q("A pencil is lighter than a brick. Which tips a scale down?", "the brick", ["the pencil", "Neither"], "The heavier object tips the scale down.", { d: 3 }),
  q("Why do we handle tools like scissors carefully?", "so nobody gets hurt", ["so they get lost", "so they get wet"], "We use tools safely and with an adult's help.", { d: 3 }),
];

const HEAVY = sorter({
  prompt: "Heavy or light? Tap an item, then tap its basket.",
  hint: "Think about how it feels when you pick it up.",
  bins: [
    { id: "heavy", label: "Heavy", emoji: "🏋️" },
    { id: "light", label: "Light", emoji: "🪶" },
  ],
  items: [
    { label: "feather", emoji: "🪶", bin: "light" },
    { label: "leaf", emoji: "🍂", bin: "light" },
    { label: "balloon", emoji: "🎈", bin: "light" },
    { label: "paper clip", emoji: "📎", bin: "light" },
    { label: "rock", emoji: "🪨", bin: "heavy" },
    { label: "brick", emoji: "🧱", bin: "heavy" },
    { label: "bowling ball", emoji: "🎳", bin: "heavy" },
    { label: "watermelon", emoji: "🍉", bin: "heavy" },
  ],
});

export const propertiesUnit: Unit = {
  id: "properties-ab",
  title: "Length, Area & Weight",
  emoji: "⚖️",
  blurb: "Compare things and change them!",
  parentNote: "Objects have properties we can measure: how long, how much flat space they cover (area) and how heavy they are. Children compare objects directly and see how bending, cutting, stretching and squishing change an object.",
  standards: ab("1M 1.1, 1M 1.2", "length, area and weight of objects, comparing them directly, and ways to change them"),
  generate: unitOf(PROPERTIES, [HEAVY]),
};

// ---------- Movement ----------

const MOTION: Item[] = [
  q("Which word tells where something is going?", "direction", ["colour", "weight"], "Direction tells which way something moves, like up, down or left.", { emoji: "🧭" }),
  q("A ball rolls from the top of a hill to the bottom. Which way does it go?", "down", ["up", "nowhere"], "It rolls downhill.", { emoji: "⚽" }),
  q("A bird flies from the ground to the top of a tree. Which way does it go?", "up", ["down", "sideways only"], "Higher means up.", { emoji: "🐦" }),
  q("The path an object takes is its…", "pathway", ["shadow", "weight"], "A pathway can be straight, curved or zigzag.", { emoji: "🛤️" }),
  q("Which pathway is a straight line?", "an arrow shot straight ahead", ["a snake wiggling", "a swing going back and forth"], "A straight line does not bend.", { d: 2 }),
  q("A snake slides side to side, bending as it goes. That is a…", "curved pathway", ["straight pathway", "no pathway"], "Bendy paths are curves.", { emoji: "🐍" }),
  q("A ski runs left, right, left, right down a hill. That is a…", "zigzag", ["straight line", "circle"], "A zigzag goes sharply from side to side.", { emoji: "⛷️" }),
  q("A merry-go-round goes…", "in a circle", ["in a straight line", "up and down only"], "A circle path goes around and around.", { emoji: "🎠" }),
  q("A swing moves…", "back and forth", ["in a zigzag", "straight up"], "A swing goes forward, then back.", { emoji: "🛝" }),
  q("Which is fast?", e("a race car", "🏎️"), [e("a snail", "🐌"), e("a sleeping cat", "😺")], "Fast things cover a lot of space quickly.", { d: 1 }),
  q("Speed tells us how…", "fast something moves", ["heavy something is", "bright something is"], "Fast or slow is the speed.", { d: 2 }),
  q("You push a toy car gently. How fast does it go?", "slowly", ["very fast", "it jumps"], "A small push makes a slow roll.", { emoji: "🚗" }),
  q("You push a toy car hard. What happens?", "it goes faster", ["it goes slower", "it stops"], "A bigger push makes it go faster.", { emoji: "🚗", d: 2 }),
  q("A toy car rolls on a smooth floor and on a rough rug. Where does it go farther?", "on the smooth floor", ["on the rough rug", "the same on both"], "Rough surfaces slow things down.", { d: 2 }),
  q("Which helps a wagon move easily?", "wheels", ["glue", "a blanket on top"], "Wheels roll and help things move.", { emoji: "🛞", d: 2 }),
  q("A steeper ramp makes a ball roll…", "faster", ["slower", "backwards"], "A steeper slope makes more speed.", { d: 3 }),
  q("You want a marble to go to the left. Which way do you push?", "to the left", ["to the right", "up"], "Push the way you want it to go.", { emoji: "🔵", d: 3 }),
  q("A hockey puck slides on ice. Why does it go far?", "ice is smooth", ["ice is sticky", "ice is bumpy"], "Smooth ice does not slow it much.", { emoji: "🏒", d: 3 }),
  q("Why do animals move?", "to find food or stay safe", ["to count stars", "to read books"], "Animals move to eat, drink, play and escape danger.", { d: 2 }),
];

const FASTSLOW = sorter({
  prompt: "Fast or slow? Tap an item, then tap its basket.",
  hint: "Think about how quickly each one moves.",
  bins: [
    { id: "fast", label: "Fast", emoji: "💨" },
    { id: "slow", label: "Slow", emoji: "🐢" },
  ],
  items: [
    { label: "cheetah", emoji: "🐆", bin: "fast" },
    { label: "race car", emoji: "🏎️", bin: "fast" },
    { label: "airplane", emoji: "✈️", bin: "fast" },
    { label: "rocket", emoji: "🚀", bin: "fast" },
    { label: "snail", emoji: "🐌", bin: "slow" },
    { label: "turtle", emoji: "🐢", bin: "slow" },
    { label: "sloth", emoji: "🦥", bin: "slow" },
    { label: "caterpillar", emoji: "🐛", bin: "slow" },
  ],
});

export const motionUnit: Unit = {
  id: "movement-ab",
  title: "How Things Move",
  emoji: "🛝",
  blurb: "Fast, slow, up, down and zigzag!",
  parentNote: "Children describe how objects and animals move: the direction, the pathway (straight, curved, zigzag, circle) and the speed. They see that a push, a surface or a ramp changes the movement.",
  standards: ab("1E 1.1, 1E 1.2", "direction, pathway and speed of moving things, and what changes how they move"),
  generate: unitOf(MOTION, [FASTSLOW]),
};

// ---------- Seasons in Alberta ----------

const SEASONS: Item[] = [
  q("How many seasons does Alberta have?", "four", ["two", "six"], "Alberta has summer, autumn, winter and spring.", { emoji: "🍁" }),
  q("Which season comes after winter in Alberta?", "spring", ["autumn", "summer"], "The year goes spring, summer, autumn, winter.", { emoji: "🌱" }),
  q("In Alberta, snow covers the ground most in…", "winter", ["summer", "spring"], "Winter is the coldest and snowiest season.", { emoji: "❄️" }),
  q("When does snow usually start to melt?", "spring", ["autumn", "winter"], "It gets warmer in spring, so snow melts.", { emoji: "🌷" }),
  q("Many leaves change colour and fall in…", "autumn", ["spring", "winter"], "Autumn is also called fall.", { emoji: "🍂" }),
  q("When might a lake be frozen in Alberta?", "winter", ["summer", "autumn"], "Cold winter weather can freeze lakes.", { emoji: "🧊" }),
  q("Which clothes are best for a snowy winter day?", e("warm coat and mittens", "🧤"), [e("swimsuit", "🩱"), e("sandals", "🩴")], "Dress for the weather."),
  q("Which activity do many people do in a winter in Alberta?", "skating", ["swimming at the lake", "picking ripe berries"], "Many outdoor rinks and trails are for winter fun.", { emoji: "⛸️", d: 2 }),
  q("Which activity do many families enjoy on a hot summer day?", "swimming", ["building a snow fort", "skating on a pond"], "Summer is warm, so swimming is fun.", { emoji: "🏊" }),
  q("Many flowers and trees grow new buds in…", "spring", ["winter", "midwinter nights"], "Plants wake up when it gets warmer.", { emoji: "🌸", d: 2 }),
  q("Geese fly south in the fall. This is called…", "migration", ["hibernation", "melting"], "Migration is a regular trip many animals take with the seasons.", { emoji: "🪿", d: 2 }),
  q("A black bear sleeps most of the winter. This is called…", "hibernation", ["migration", "sunbathing"], "Hibernating animals sleep for a long time when food is hard to find.", { emoji: "🐻", d: 2 }),
  q("Why do some animals migrate or hibernate?", "it is hard to find food in winter", ["they like the snow", "they are tired of summer"], "Winter makes food harder to find.", { d: 3 }),
  q("A storm brings strong wind and heavy rain. Is this a sudden change?", "yes", ["no, it takes a whole year", "no, it never happens"], "Storms, floods and fires can change an environment quickly.", { emoji: "⛈️", d: 3 }),
  q("In southern Alberta, a chinook is a warm wind that can…", "melt snow in winter", ["make leaves fall", "freeze a lake"], "A chinook can make winter days suddenly warm.", { emoji: "🌬️", d: 3 }),
  q("You smell fresh rain on the grass. Which body part helps you smell?", "your nose", ["your ears", "your elbow"], "We use our senses to notice our environment.", { d: 2 }),
  q("You see snow and feel cold air. Which season might it be?", "winter", ["summer", "spring"], "Snow and cold are signs of winter.", { d: 1 }),
  q("Some places in the world have only two seasons: rainy and…", "dry", ["snowy", "frosty"], "Not every place has four seasons.", { emoji: "🌍", d: 3 }),
];

const SEASON_ORDER = order("Put the seasons in order. Start with spring.", "After spring comes summer, then autumn, then winter.", [
  ["Spring", "🌷"],
  ["Summer", "☀️"],
  ["Autumn", "🍂"],
  ["Winter", "❄️"],
]);

const SEASON_SORT = sorter({
  prompt: "Summer or winter? Tap an item, then tap its basket.",
  hint: "Think about when you wear it or do it.",
  bins: [
    { id: "summer", label: "Summer", emoji: "☀️" },
    { id: "winter", label: "Winter", emoji: "❄️" },
  ],
  items: [
    { label: "sandals", emoji: "🩴", bin: "summer" },
    { label: "sunhat", emoji: "👒", bin: "summer" },
    { label: "swimming", emoji: "🏊", bin: "summer" },
    { label: "ice cream", emoji: "🍦", bin: "summer" },
    { label: "mittens", emoji: "🧤", bin: "winter" },
    { label: "snowman", emoji: "⛄", bin: "winter" },
    { label: "toboggan", emoji: "🛷", bin: "winter" },
    { label: "skates", emoji: "⛸️", bin: "winter" },
  ],
});

export const seasonsUnit: Unit = {
  id: "seasons-alberta-ab",
  title: "Seasons in Alberta",
  emoji: "🍁",
  blurb: "Snow, flowers, sun and falling leaves!",
  parentNote: "The four seasons in Alberta, signs of change in the local environment, how plants and animals respond (migration and hibernation), and how seasons shape clothing and activities.",
  standards: ab("1ES 1.1, 1ES 1.3, 1ES 1.4", "the four seasons in Alberta, noticing changes with our senses, and how seasons affect what we wear and do"),
  generate: unitOf(SEASONS, [SEASON_ORDER, SEASON_SORT]),
};

// ---------- Following instructions ----------

const STEPS: Item[] = [
  q("Instructions tell you…", "what to do and in what order", ["what you ate", "how tall you are"], "Instructions are directions to follow.", { emoji: "📋" }),
  q("Why do we follow safety instructions?", "to stay safe", ["to be slow", "to lose things"], "Safety instructions help keep people from getting hurt.", { emoji: "🦺" }),
  q("Instructions can be given with…", "words, pictures or gestures", ["only smells", "only tastes"], "A person can say them, draw them or show them.", { d: 2 }),
  q("The steps are: clap, stomp, clap. What is the second step?", "stomp", ["clap", "jump"], "Count the steps in order.", { emoji: "👏" }),
  q("The steps are: hop, spin, wave. What is the last step?", "wave", ["hop", "spin"], "The last step comes at the end.", { emoji: "🙋" }),
  q("The steps are: wash your hands, then dry them. What comes first?", "wash your hands", ["dry them", "nothing"], "You must wash before you dry.", { emoji: "🧼" }),
  q("Put on your socks, then shoes. What if you switch the order?", "it does not work well", ["it works the same", "your shoes disappear"], "The order of steps matters.", { emoji: "🧦", d: 2 }),
  q("To plant a seed, which step comes after digging a hole?", "put in the seed", ["pick the flower", "eat the plant"], "Dig a hole, then put in the seed.", { emoji: "🌱", d: 2 }),
  q("A robot is told: forward, forward, turn. How many steps is that?", "3", ["1", "5"], "Count each step: forward, forward, turn.", { emoji: "🤖", d: 2 }),
  q("Which instruction is clear?", "Walk to the door, then stop", ["Do the thing", "Go over there"], "Clear instructions say exactly what to do.", { d: 2 }),
  q("A game says: roll the dice, then move. What is the first step?", "roll the dice", ["move", "win"], "Follow steps one at a time, in order.", { emoji: "🎲" }),
  q("You skip a step in a recipe. What might happen?", "the food may not turn out", ["it will taste perfect", "nothing can change"], "Missing a step changes the result.", { emoji: "🍪", d: 3 }),
  q("An instruction has 2 steps. If you do only 1, you have…", "not finished", ["finished", "done twice"], "Do every step to finish.", { d: 3 }),
  q("Someone says: go 3 steps forward, then 1 step back. Where do you end up?", "2 steps from the start", ["4 steps from the start", "right at the start"], "3 forward and 1 back leaves you 2 steps ahead.", { emoji: "👣", d: 3 }),
];

const BRUSH = order("Put the steps in order. What comes first?", "Wet the brush, add paste, brush, then rinse.", [
  ["Wet the brush", "🚿"],
  ["Add toothpaste", "🪥"],
  ["Brush your teeth", "😁"],
  ["Rinse your mouth", "💧"],
]);

const SANDWICH = order("Make a sandwich. Put the steps in order.", "Start with bread, add the filling, then close it and enjoy.", [
  ["Get two slices of bread", "🍞"],
  ["Spread on the filling", "🧈"],
  ["Put the slices together", "🥪"],
  ["Eat it", "😋"],
]);

export const stepsUnit: Unit = {
  id: "follow-steps-ab",
  title: "Follow the Steps",
  emoji: "📋",
  blurb: "Do each step in the right order!",
  parentNote: "Instructions have steps, and the order of the steps matters. Children follow and order simple steps, as a first look at the thinking behind coding.",
  standards: ab("1CS 1.1, 1CS 1.2, 1CS 1.3", "following instructions with one or more steps, and noticing that the order of the steps matters"),
  generate: unitOf(STEPS, [BRUSH, SANDWICH]),
};

// ---------- Plants and animals in Alberta ----------

const HABITATS: Item[] = [
  q("Plants and animals need food, water, air and…", "shelter", ["a phone", "a toy"], "Shelter is a safe place to live.", { emoji: "🏠" }),
  q("Which animal lives in the Rocky Mountains?", e("bighorn sheep", "🐏"), [e("sea turtle", "🐢"), e("camel", "🐪")], "Bighorn sheep climb rocky slopes in the mountains."),
  q("Which animal builds a dam in a river or creek in Alberta?", e("beaver", "🦫"), [e("owl", "🦉"), e("bighorn sheep", "🐏")], "Beavers cut trees and build dams in water."),
  q("A moose lives in a forest. What does the forest give it?", "food and shelter", ["a swimming pool", "a bus"], "Trees and plants give food and cover.", { emoji: "🫎" }),
  q("A pronghorn runs across the prairie. A prairie is a big area of…", "grassland", ["ice", "desert sand only"], "Prairies are wide, open grasslands.", { emoji: "🌾" }),
  q("A plant gets water from…", "the soil and rain", ["a TV", "a shoe"], "Roots take in water.", { emoji: "🌻" }),
  q("A plant needs sunlight to…", "make its own food", ["buy food", "hunt"], "Leaves use sunlight to make food.", { emoji: "☀️", d: 2 }),
  q("A loon swims and dives in a northern Alberta lake. A lake gives it…", "water and fish", ["snow only", "a nest of cement"], "Lakes give water, fish and a place to live.", { emoji: "💧", d: 2 }),
  q("How can you help a houseplant?", "water it and give it light", ["hide it in a closet", "tie it in a knot"], "Plants need water and light.", { emoji: "🪴" }),
  q("How can you help a pet dog?", "give it food, water and walks", ["leave it outside all night", "ignore it"], "Pets depend on people.", { emoji: "🐕" }),
  q("How can we respect wild animals?", "watch from far away", ["chase them", "feed them snacks"], "Wild animals need space and their own food.", { emoji: "🔭", d: 2 }),
  q("Wool from a sheep can be used to make…", "a warm hat", ["a glass", "a brick"], "Animals give us things like wool and food.", { emoji: "🧶", d: 2 }),
  q("Wheat from a farm field is made into…", "bread", ["glass", "paper clips"], "Plants give us food.", { emoji: "🌾", d: 2 }),
  q("Trees give animals…", "a home and food", ["television", "pizza"], "Birds nest in trees and squirrels eat their seeds.", { emoji: "🌲", d: 2 }),
  q("Why is it good to not drop litter in a park?", "animals can get hurt", ["it makes flowers grow", "litter is food"], "Litter can harm animals and plants.", { emoji: "🗑️", d: 3 }),
  q("A bee visits a flower for food. The flower gets…", "help making seeds", ["a haircut", "a home"], "Bees carry pollen from flower to flower.", { emoji: "🐝", d: 3 }),
];

const WHERE = sorter({
  prompt: "Where does it live in Alberta? Tap an item, then tap its basket.",
  hint: "Think about the place each animal calls home.",
  bins: [
    { id: "mountain", label: "Mountains", emoji: "🏔️" },
    { id: "prairie", label: "Prairie", emoji: "🌾" },
    { id: "water", label: "Lakes & rivers", emoji: "💧" },
  ],
  items: [
    { label: "bighorn sheep", emoji: "🐏", bin: "mountain" },
    { label: "mountain goat", emoji: "🐐", bin: "mountain" },
    { label: "pronghorn", emoji: "🦌", bin: "prairie" },
    { label: "burrowing owl", emoji: "🦉", bin: "prairie" },
    { label: "beaver", emoji: "🦫", bin: "water" },
    { label: "trout", emoji: "🐟", bin: "water" },
  ],
});

export const habitatsUnit: Unit = {
  id: "alberta-habitats-ab",
  title: "Alberta Plants & Animals",
  emoji: "🦫",
  blurb: "Who lives where, and what do they need?",
  parentNote: "Plants and animals live in many places in Alberta, such as mountains, prairies, forests, and lakes and rivers. Each needs food, water, air and shelter, and people can help meet those needs.",
  standards: ab("1LS 1.2, 1LS 1.3", "plants and animals in Alberta environments, what they need, and how people help meet those needs"),
  generate: unitOf(HABITATS, [WHERE]),
};

export const units: Unit[] = [propertiesUnit, motionUnit, seasonsUnit, stepsUnit, habitatsUnit];
