import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 3 Science, Earth and Space Science: Soils in the Environment (ES3.1, ES3.2).

// ---------- What soil is made of, and the types of soil ----------

const SOIL_SORT: SortSet = {
  prompt: "Is it a part of soil that was once alive, or was it never alive? Tap an item, then its basket.",
  hint: "Soil has bits of rock and minerals that were never alive, and humus made from plants and animals that died.",
  bins: [
    { id: "alive", label: "once alive", emoji: "🍂" },
    { id: "never", label: "never alive", emoji: "🪨" },
  ],
  items: [
    { label: "rotting leaves", emoji: "🍂", bin: "alive" },
    { label: "dead roots", emoji: "🌿", bin: "alive" },
    { label: "bits of old plants", emoji: "🌱", bin: "alive" },
    { label: "dead worms", emoji: "🪱", bin: "alive" },
    { label: "grains of sand", emoji: "🏖️", bin: "never" },
    { label: "tiny pebbles", emoji: "🪨", bin: "never" },
    { label: "bits of clay", emoji: "🧱", bin: "never" },
    { label: "water", emoji: "💧", bin: "never" },
  ],
};

const WATER_ORDER = order("Put the soils in order, from the water draining fastest to slowest.", "Sand lets water through fastest. Clay holds water and lets it through slowest.", [
  ["sand", "🏖️"],
  ["loam", "🌱"],
  ["clay", "🧱"],
]);

const SIZE_ORDER = order("Put the soil bits in order, from the biggest to the smallest.", "Sand grains are biggest, silt is in the middle, and clay is the smallest.", [
  ["sand", "🏖️"],
  ["silt", "🟤"],
  ["clay", "🧱"],
]);

const SOIL_TYPES: Item[] = [
  q("What is soil made of?", "bits of rock, air, water and humus", ["only sand", "only water", "only leaves"], "Soil is a mix of rock bits, humus, air and water.", "🌍"),
  q("What is humus?", "rotted plants and animals in soil", ["a kind of metal", "pure sand", "a type of rock"], "Humus is dark and helps plants grow.", "🍂"),
  q("What colour is soil that is rich in humus?", "dark brown", ["bright white", "light blue", "pale yellow"], "Humus makes soil dark and rich.", "🟤"),
  q("Which soil has the biggest grains?", "sand", ["silt", "clay", "humus"], "You can see and feel sand grains.", "🏖️"),
  q("Which soil has the smallest grains?", "clay", ["sand", "silt", "gravel"], "Clay bits are so tiny they feel smooth.", "🧱"),
  q("Which soil feels gritty?", "sand", ["clay", "loam", "humus"], "The big grains feel rough and scratchy.", "🏖️"),
  q("Which soil feels sticky when wet?", "clay", ["sand", "gravel", "silt"], "Wet clay can be shaped like modelling clay.", "🧱"),
  q("Which soil feels soft and smooth like flour?", "silt", ["sand", "gravel", "pebbles"], "Silt grains are smaller than sand.", "🟤"),
  q("What is loam?", "a mix of sand, silt, clay and humus", ["only clay", "only sand", "a kind of rock"], "Loam is the best soil for most plants.", "🌱"),
  q("Which soil is best for growing most crops?", "loam", ["pure sand", "pure clay", "gravel"], "Loam holds water and also drains well.", "🌾"),
  q("What happens when you pour water on sand?", "it drains through quickly", ["it stays on top for days", "it turns to rock", "it turns to clay"], "The big gaps between the grains let water drain.", "💧"),
  q("What happens when you pour water on clay?", "it drains through slowly", ["it drains very fast", "it disappears at once", "nothing, it is dry"], "Clay's tiny grains pack close together.", "💧"),
  q("Which soil holds the most water?", "clay", ["sand", "gravel", "none of them"], "Clay holds water for a long time.", "🪣"),
  q("Which soil dries out fastest after rain?", "sand", ["clay", "loam", "humus"], "Water runs right through sand.", "☀️"),
  q("Why do plants need water in soil?", "to drink and make food", ["to build a nest", "to make noise", "to keep warm"], "Roots take in water for the plant.", "🌱"),
  q("A sandy garden dries out fast. What could a gardener add?", "compost", ["more sand", "gravel", "plastic"], "Compost holds water in sandy soil.", "🪴"),
  q("What can you use to see what is in a soil sample?", "a hand lens", ["a thermometer", "a clock", "a ruler only"], "A hand lens makes tiny grains look bigger.", "🔍"),
  q("A soil sample is shaken in water and left to sit. What settles first?", "the biggest grains", ["the smallest grains", "the water", "the humus only"], "Big grains are heavy and sink fast.", "🫙"),
  q("In a jar of settled soil, what is found on the bottom?", "sand and gravel", ["clay", "humus", "air"], "Heavier bits sink to the bottom.", "🫙"),
  q("In a jar of settled soil, what floats near the top?", "bits of humus", ["gravel", "big stones", "sand"], "Light plant bits float.", "🫙"),
  q("What is the topsoil?", "the top layer of soil", ["the bottom layer", "a kind of rock", "a type of cloud"], "Topsoil is rich in humus. Most roots grow there.", "🌱"),
  q("What is the layer under topsoil called?", "subsoil", ["sky soil", "topsoil", "wallpaper"], "Subsoil has less humus than topsoil.", "⬇️"),
  q("Which layer of soil has the most humus?", "topsoil", ["subsoil", "bedrock", "none of them"], "Topsoil is dark because of humus.", "🌱"),
  q("Much of Saskatchewan's farmland has dark soil. Why is it good for crops?", "it is rich in humus", ["it is pure sand", "it is mostly stone", "it has no water"], "Prairie grasses added humus over many years.", "🌾"),
  q("How can you tell sand from clay by touch?", "sand feels gritty, clay feels smooth", ["both feel gritty", "both feel sticky", "they feel the same"], "Test by rubbing a bit between your fingers.", "✋"),
  q("Why do we test many soil samples from one place?", "to be fair and see what is common", ["to use up soil", "to make mud", "because one is too heavy"], "More samples give better answers.", "🔬"),
  hq("Which soil would make a puddle that stays for a long time?", "clay", ["sand", "gravel", "all drain the same"], "Water cannot soak down through clay quickly.", "💦"),
  hq("Soil A drains in 10 seconds. Soil B drains in 3 minutes. Which is more sandy?", "soil A", ["soil B", "both the same", "neither"], "Sand drains faster than clay.", "⏱️"),
  hq("Why can roots grow well in loam?", "it holds water and has air spaces", ["it has no water", "it is solid rock", "it has no air"], "Roots need both water and air.", "🌱"),
  hq("Why is pure sand poor for most crops?", "water drains away too fast", ["it holds too much water", "it has too much humus", "it is too dark"], "Plants cannot use water that drains away.", "🏖️"),
  hq("Why do some farms in Saskatchewan struggle with heavy clay soil?", "it stays wet and hard to work", ["it drains too fast", "it has no grains", "it is too light"], "Wet clay is sticky, and dry clay can crack.", "🚜"),
];

// ---------- Soil and living things ----------

const USE_SORT: SortSet = {
  prompt: "Does it help protect soil or harm soil? Tap an item, then its basket.",
  hint: "Roots, mulch and cover crops hold soil in place. Bare ground and heavy trampling let it blow or wash away.",
  bins: [
    { id: "help", label: "protects soil", emoji: "🛡️" },
    { id: "harm", label: "harms soil", emoji: "⚠️" },
  ],
  items: [
    { label: "planting grass", emoji: "🌿", bin: "help" },
    { label: "adding compost", emoji: "🪴", bin: "help" },
    { label: "planting trees as a shelterbelt", emoji: "🌳", bin: "help" },
    { label: "leaving stubble on a field", emoji: "🌾", bin: "help" },
    { label: "leaving the ground bare", emoji: "🏜️", bin: "harm" },
    { label: "dumping garbage on soil", emoji: "🗑️", bin: "harm" },
    { label: "walking on the same patch every day", emoji: "👣", bin: "harm" },
    { label: "pouring oil on the ground", emoji: "🛢️", bin: "harm" },
  ],
};

const COMPOST_ORDER = order("Put the steps of making compost in order.", "Collect scraps, pile them up, let them rot, then use the rich compost on soil.", [
  ["Collect fruit and vegetable scraps", "🥕"],
  ["Pile them with leaves in a bin", "🪣"],
  ["Worms and tiny living things break them down", "🪱"],
  ["Rich dark compost is ready", "🟤"],
  ["Spread it on the garden", "🌻"],
]);

const SOIL_LIFE: Item[] = [
  q("Which living things make their home in soil?", "worms, insects and tiny living things", ["only fish", "only birds", "nothing lives there"], "Soil is a busy home underground.", "🪱"),
  q("What do earthworms do for soil?", "make tunnels and mix it", ["make it sticky", "turn it to rock", "take away all the air"], "Their tunnels let air and water in.", "🪱"),
  q("How does a gopher use soil?", "it digs a burrow in it", ["it eats the sand", "it paints it", "it flies over it"], "Richardson's ground squirrels, or gophers, live in burrows on the prairies.", "🐿️"),
  q("Where do plants get most of their water?", "from the soil", ["from the wind", "from rocks", "from clouds only"], "Roots take in water from the soil.", "🌱"),
  q("What do plant roots do besides take in water?", "hold the plant in the soil", ["make seeds", "make leaves", "make flowers"], "Roots anchor a plant.", "🌿"),
  q("What do plants take from the soil to grow well?", "nutrients", ["sunlight", "wind", "noise"], "Nutrients are like plant food.", "🥬"),
  q("What do we call food that grows in soil, like carrots and potatoes?", "root crops", ["sea crops", "sky crops", "stone crops"], "They grow underground.", "🥔"),
  q("Which of these grows in prairie soil in Saskatchewan?", "wheat", ["bananas", "coconuts", "cacao"], "Saskatchewan grows a lot of wheat, canola and lentils.", "🌾"),
  q("Why is soil important to people?", "we grow food in it", ["we can't use it", "it makes noise", "it hides the sky"], "Almost all of our food depends on soil.", "🍞"),
  q("What can happen to bare soil when strong wind blows?", "the soil blows away", ["it grows taller", "it gets thicker", "it turns to ice"], "This is called wind erosion.", "💨"),
  q("What can heavy rain do to bare soil on a hill?", "wash it away", ["make it stick", "harden it", "grow it"], "This is called water erosion.", "🌧️"),
  q("How do plant roots protect soil?", "they hold it in place", ["they dig it up", "they dry it out", "they make it blow"], "Roots work like a net under the ground.", "🌿"),
  q("What is a shelterbelt?", "rows of trees that slow the wind", ["a type of tent", "a belt for clothes", "a kind of soil"], "Many prairie farms plant trees to protect soil and homes.", "🌳"),
  q("Why do some farmers leave stubble on a field after harvest?", "it helps stop the soil blowing away", ["it makes more wind", "to hide the seeds", "it is a mistake"], "Stubble holds snow and soil.", "🌾"),
  q("What is compost?", "rotted food scraps and plants used to feed soil", ["fresh pizza", "plastic", "melted snow"], "Compost makes soil richer.", "🪴"),
  q("Which can you add to a compost bin?", "apple cores and leaves", ["plastic bags", "glass jars", "metal cans"], "Only things that were once alive rot.", "🍎"),
  q("Which should not go in a compost bin?", "plastic wrappers", ["banana peels", "grass clippings", "coffee grounds"], "Plastic does not rot.", "🚫"),
  q("What helps break down a compost pile?", "worms and tiny living things", ["only plastic", "metal", "stones"], "They turn scraps into rich humus.", "🪱"),
  q("Why is compost good for a garden?", "it adds nutrients to the soil", ["it makes the soil blue", "it takes away plants", "it stops rain"], "Compost feeds the plants.", "🌻"),
  q("What is one way to waste less food and help soil?", "compost food scraps", ["throw them in a lake", "bury plastic", "leave them in the sun"], "Compost turns scraps into a useful gift.", "♻️"),
  q("Why should we not litter on the ground?", "garbage can harm soil and living things", ["it helps plants", "it makes soil richer", "worms like it"], "Litter can make soil unhealthy.", "🗑️"),
  q("A farmer rests a field for a year and grows grass. What does this do?", "it gives the soil a chance to recover", ["it uses up the soil", "it dries the soil", "it makes the soil blow"], "Grass roots and plant bits feed the soil.", "🌿"),
  q("What happens to dead leaves that fall on the ground?", "they rot and become humus", ["they turn to metal", "they float away", "they last forever"], "Rotting leaves enrich the soil.", "🍂"),
  q("Which animal burrows in Saskatchewan grassland soil and eats insects?", "a badger", ["a penguin", "a whale", "a monkey"], "Badgers dig dens in the prairie soil.", "🦡"),
  q("Prairie grasses have very long roots. How does this help soil?", "it holds soil and adds humus", ["it takes all the water", "it makes sand", "it blows the soil"], "Native grasslands keep soil in place for a long time.", "🌾"),
  q("Many First Nations and Métis people in Saskatchewan care for the land. Why?", "healthy soil feeds people, plants and animals", ["soil is useless", "soil is only a toy", "only for decoration"], "Caring for soil means caring for all living things.", "🤝"),
  hq("Why do living things in the soil depend on plants?", "dead plants give them food", ["plants eat them", "plants drink them", "plants have no use"], "Rotting plants are food for worms and tiny living things.", "🔗"),
  hq("Why do plants depend on living things in the soil?", "they break down matter into nutrients", ["they eat the roots only", "they make sunlight", "they block water"], "Soil life returns nutrients to the soil.", "🔗"),
  hq("Dust storms hit farms in the 1930s on the prairies. What was a cause?", "dry, bare soil blew away", ["too much snow", "too many trees", "too many lakes"], "Drought and bare fields let the wind carry soil away.", "🌪️"),
  hq("Why is soil called a resource that takes a very long time to make?", "it takes hundreds of years to form a thin layer", ["it forms in a day", "it forms in a week", "it is made in factories"], "We must protect the soil we have.", "⏳"),
];

export const units: Unit[] = [
  {
    id: "sk-soil-types",
    title: "Types of Soil",
    emoji: "🪱",
    blurb: "Sand, silt, clay, loam and how water drains",
    standards: { "ca-sk": sk("ES3.1", "the makeup of soils and how different types, such as sand, silt, clay and loam, absorb water") },
    parentNote: "What soil is made of (rock bits, humus, air, water), how sand, silt, clay and loam look, feel and drain, how to sort and test samples fairly, and why dark prairie topsoil suits crops.",
    generate: bankUnit(SOIL_TYPES, { sorts: [SOIL_SORT], orders: [WATER_ORDER, SIZE_ORDER] }),
  },
  {
    id: "sk-soil-life",
    title: "Soil and Living Things",
    emoji: "🌾",
    blurb: "Farming, compost and taking care of soil",
    standards: { "ca-sk": sk("ES3.2", "how soil and living things depend on each other, and why soil matters to people and the environment") },
    parentNote: "How plants, worms and other animals depend on soil, how soil depends on them, farming and compost on the prairies, and ways to protect soil from wind and water.",
    generate: bankUnit(SOIL_LIFE, { sorts: [USE_SORT], orders: [COMPOST_ORDER] }),
  },
];
