import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 4 Science, Earth and Space Science: Rocks, Minerals and Erosion (RM4.1 to RM4.3).

// ---------- Rocks and minerals, and how we use them ----------

const ROCK_SORT: SortSet = {
  prompt: "Which kind of rock is it? Tap a rock, then tap its basket.",
  hint: "Igneous rock forms from cooled melted rock. Sedimentary rock forms in layers. Metamorphic rock is changed by heat and pressure.",
  bins: [
    { id: "ig", label: "igneous", emoji: "🌋" },
    { id: "sed", label: "sedimentary", emoji: "🏜️" },
    { id: "meta", label: "metamorphic", emoji: "🔥" },
  ],
  items: [
    { label: "granite (Canadian Shield)", emoji: "🪨", bin: "ig" },
    { label: "basalt", emoji: "🌋", bin: "ig" },
    { label: "sandstone", emoji: "🏜️", bin: "sed" },
    { label: "shale", emoji: "📚", bin: "sed" },
    { label: "limestone", emoji: "🐚", bin: "sed" },
    { label: "gneiss", emoji: "🔥", bin: "meta" },
    { label: "marble", emoji: "🏛️", bin: "meta" },
    { label: "slate", emoji: "🧱", bin: "meta" },
  ],
};

const MINE_SORT: SortSet = {
  prompt: "What do we use it for? Tap a resource, then tap its basket.",
  hint: "Potash helps crops grow. Uranium is used to make electricity. Gold is used for jewellery and electronics.",
  bins: [
    { id: "farm", label: "growing food", emoji: "🌾" },
    { id: "energy", label: "making electricity", emoji: "⚡" },
    { id: "jewel", label: "jewellery and electronics", emoji: "💍" },
  ],
  items: [
    { label: "potash fertilizer", emoji: "🌾", bin: "farm" },
    { label: "fertilizer for a wheat field", emoji: "🚜", bin: "farm" },
    { label: "uranium fuel", emoji: "⚡", bin: "energy" },
    { label: "power plant fuel", emoji: "🔌", bin: "energy" },
    { label: "a gold ring", emoji: "💍", bin: "jewel" },
    { label: "a gold wire in a phone", emoji: "📱", bin: "jewel" },
  ],
};

const HARD_ORDER = order("Put the minerals in order, from softest to hardest.", "Talc is the softest mineral. Gypsum, calcite and quartz are harder. Diamond is the hardest.", [
  ["talc", "🤍"],
  ["gypsum", "⚪"],
  ["calcite", "🔶"],
  ["quartz", "💎"],
]);

const MINING_ORDER = order("Put the steps of a mine's life in order.", "A mine is found, built, operated, and then the land is cleaned up and restored.", [
  ["Geologists find a mineral deposit", "🔍"],
  ["A mine is built", "🏗️"],
  ["Workers dig out the ore", "⛏️"],
  ["The mine closes", "🔒"],
  ["The land is cleaned up and restored", "🌱"],
]);

const ROCKS: Item[] = [
  q("What is a rock?", "a solid made of one or more minerals", ["a liquid", "a living thing", "a cloud"], "Rocks are the hard parts of Earth's crust.", "🪨"),
  q("What is a mineral?", "a solid that forms naturally in the ground", ["a type of plant", "a man-made plastic", "a type of water"], "Minerals are the building blocks of rocks.", "💎"),
  q("Which is a property used to describe a mineral?", "its hardness", ["its birthday", "its favourite song", "its price tag"], "Hardness, colour, lustre and streak are mineral properties.", "🔎"),
  q("What is lustre?", "how a mineral shines in light", ["how heavy it is", "how hot it is", "how old it is"], "Lustre may be shiny like metal or dull like clay.", "✨"),
  q("What is a streak test?", "the colour of a mineral's powder on a tile", ["how far a rock rolls", "how loud it is", "how it tastes"], "Rub a mineral on a white tile to see its streak.", "🧪"),
  q("Which tool is used to test hardness by scratching?", "a steel nail", ["a spoon of soup", "a feather", "a paper bag"], "A harder material scratches a softer one.", "🔩"),
  q("A mineral scratches glass. What does this tell you?", "it is harder than glass", ["it is softer than glass", "it is liquid", "it is alive"], "Only a harder material can scratch glass.", "🪟"),
  q("Which mineral is the hardest?", "diamond", ["talc", "gypsum", "calcite"], "Diamond is the hardest known natural mineral.", "💎"),
  q("Which mineral is so soft you can scratch it with a fingernail?", "talc", ["quartz", "diamond", "granite"], "Talc is used to make baby powder.", "🤍"),
  q("What are the three main kinds of rock?", "igneous, sedimentary and metamorphic", ["red, blue and green", "big, small and tiny", "hot, warm and cold"], "Each forms in a different way.", "🪨"),
  q("How does igneous rock form?", "melted rock cools and hardens", ["layers of mud press together", "plants rot", "wind blows sand"], "Igneous rock forms from magma or lava.", "🌋"),
  q("How does sedimentary rock form?", "layers of sediment press together", ["lava cools quickly", "heat melts it all", "it falls from space"], "Sandstone and shale are examples.", "📚"),
  q("How does metamorphic rock form?", "heat and pressure change other rock", ["rain washes it", "frost cracks it", "plants grow on it"], "Marble comes from limestone changed by heat and pressure.", "🔥"),
  q("The Canadian Shield in northern Saskatchewan is mostly…", "very old hard rock", ["soft soil only", "water", "sand dunes"], "The Shield has some of the oldest rock in North America.", "🪨"),
  q("Which kind of rock is granite?", "igneous", ["sedimentary", "metamorphic", "a mineral"], "Granite cooled slowly underground.", "🪨"),
  q("Which kind of rock often has layers you can see?", "sedimentary", ["igneous", "metamorphic", "lava"], "The layers form as sediment piles up.", "📚"),
  q("Which kind of rock is likely to hold fossils?", "sedimentary", ["igneous", "metamorphic", "none of them"], "Fossils are buried in layers of mud and sand.", "🦴"),
  q("Where in Saskatchewan can you find sand dunes in the north?", "the Athabasca Sand Dunes", ["the Rocky Mountains", "the Pacific coast", "the Great Lakes"], "They are huge sand dunes beside Lake Athabasca.", "🏜️"),
  q("What is potash used for?", "fertilizer for crops", ["fuel for cars", "making glass windows", "making toys"], "Saskatchewan has some of the largest potash reserves in the world.", "🌾"),
  q("What is uranium used for?", "making electricity in nuclear power plants", ["making bread", "making paper", "making bricks"], "Northern Saskatchewan has rich uranium mines.", "⚡"),
  q("Which mined material from northern Saskatchewan is used to make nuclear power?", "uranium", ["sand", "gravel", "salt"], "Uranium is mined in northern Saskatchewan.", "⚛️"),
  q("What is a mine?", "a place where minerals are dug from the ground", ["a kind of lake", "a toy store", "a type of field"], "Some mines are open pits, and some are underground.", "⛏️"),
  q("Why do mines help people?", "they give jobs and materials", ["they make the weather", "they stop rain", "they add trees"], "Mining supports towns and families.", "👷"),
  q("What is one bad effect of mining?", "it can harm land, water or habitat", ["it grows more forest", "it cleans rivers", "it adds fish"], "Mining must be done carefully.", "⚠️"),
  q("How can a mining company help the land after a mine closes?", "clean it up and plant native plants", ["leave the pits as they are", "pour in oil", "bury garbage"], "This is called reclamation.", "🌱"),
  q("Why must workers wear hard hats and safety gear in a mine?", "to stay safe from falling rock and dust", ["to look funny", "to keep warm only", "because rocks are hot"], "Safety rules protect workers.", "⛑️"),
  q("Why do we recycle metals like aluminum?", "to use fewer new resources from mines", ["to make mines bigger", "to make more mud", "to fill landfills"], "Recycling saves resources and energy.", "♻️"),
  q("Which of these is made from rock or mineral products?", "a brick", ["an apple", "a cotton shirt", "a wool sock"], "Bricks are made from clay.", "🧱"),
  q("Which of these comes from a mineral?", "salt", ["wood", "milk", "wool"], "Table salt is a mineral called halite.", "🧂"),
  hq("Why are some minerals called non-renewable resources?", "they take millions of years to form", ["they grow back in a week", "they come from plants", "they appear every spring"], "Once a mineral is used up, it will not form again in our lifetime.", "⏳"),
  hq("A rock is shiny, hard and scratches glass. What other test helps identify it?", "its streak", ["its smell", "its age in years", "its price"], "More than one test is better than just one.", "🔎"),
  hq("Why do scientists test a mineral in many ways, and not just by colour?", "colour can be the same in different minerals", ["colour never changes", "colour does not exist", "it takes less time"], "Some minerals come in many colours.", "🎨"),
  hq("A mine company wants to build near a First Nation. What is a fair first step?", "talk and listen to the community", ["start digging at night", "tell no one", "stop all talks"], "Communities have a say about land use.", "🤝"),
];

// ---------- Weathering, erosion and fossils ----------

const FORCE_SORT: SortSet = {
  prompt: "Is it weathering or erosion? Tap an item, then tap its basket.",
  hint: "Weathering breaks rock into smaller pieces. Erosion moves the pieces from one place to another.",
  bins: [
    { id: "weather", label: "weathering (breaks rock)", emoji: "🔨" },
    { id: "erode", label: "erosion (moves pieces)", emoji: "🚚" },
  ],
  items: [
    { label: "ice cracks a rock", emoji: "🧊", bin: "weather" },
    { label: "roots split a rock", emoji: "🌳", bin: "weather" },
    { label: "acid rain wears rock", emoji: "🌧️", bin: "weather" },
    { label: "hot sun and cold nights crack a rock", emoji: "🌡️", bin: "weather" },
    { label: "a river carries sand away", emoji: "🌊", bin: "erode" },
    { label: "wind blows dust away", emoji: "💨", bin: "erode" },
    { label: "a glacier drags rocks along", emoji: "🏔️", bin: "erode" },
    { label: "rain washes soil down a hill", emoji: "🌦️", bin: "erode" },
  ],
};

const FOSSIL_ORDER = order("Put the steps of how a fossil forms in order.", "An animal dies, is buried in sediment, the sediment hardens, and the fossil is later uncovered.", [
  ["An animal dies", "🦖"],
  ["Mud and sand bury it", "🏖️"],
  ["Layers press and harden into rock", "🪨"],
  ["Erosion uncovers the fossil", "💨"],
  ["Scientists dig it up", "🧑‍🔬"],
]);

const LANDFORM_ORDER = order("Put these in order, from the fastest change to the slowest.", "A flood can change land in a day. A river takes years to carve a valley, and a canyon takes millions.", [
  ["a flood washes away a bank", "🌊"],
  ["a gully forms after many rains", "🌧️"],
  ["a river carves a deep valley", "🏞️"],
]);

const EROSION: Item[] = [
  q("What is weathering?", "breaking rock into smaller pieces", ["moving rock away", "making new rock", "melting rock"], "Weathering breaks down rock where it sits.", "🔨"),
  q("What is erosion?", "moving bits of rock and soil from place to place", ["breaking rock where it is", "making a fossil", "adding soil"], "Wind, water and ice move sediment.", "🚚"),
  q("Which of these can cause weathering?", "freezing and thawing water", ["clapping", "rolling a ball", "talking"], "Water expands when it freezes and cracks rock.", "🧊"),
  q("How can tree roots weather a rock?", "they grow into cracks and split it", ["they melt the rock", "they paint the rock", "they make it soft"], "Roots push the crack wider.", "🌳"),
  q("How does ice break a rock?", "water freezes in a crack and expands", ["ice makes the rock hot", "ice eats the rock", "ice makes the rock heavy"], "Frost wedging happens often in Saskatchewan winters.", "🧊"),
  q("How does moving water cause erosion?", "it carries sediment away", ["it makes new rock", "it stops sediment moving", "it freezes mud"], "Rivers carry sand and silt downstream.", "🌊"),
  q("How does wind cause erosion?", "it blows dust and sand away", ["it makes the rock bigger", "it grows soil", "it heats rock"], "Wind erosion is common on dry prairie fields.", "💨"),
  q("What is deposition?", "sediment settling down in a new place", ["rock breaking apart", "a river drying up", "a volcano erupting"], "Rivers drop sediment where they slow down.", "⬇️"),
  q("Where does a river usually drop its sand and mud?", "where it slows down", ["where it speeds up", "at the top of a hill only", "nowhere"], "Slow water cannot carry heavy sediment.", "🏞️"),
  q("A river bank has lost a lot of soil over many years. What is the cause?", "erosion by moving water", ["a volcano", "frost on the Moon", "a magnet"], "Fast water wears the bank away.", "🌊"),
  q("What can a glacier do to land?", "scrape and move rock and soil", ["make deserts", "grow mountains in a day", "stop all rain"], "Glaciers shaped much of Saskatchewan thousands of years ago.", "🏔️"),
  q("What are the Cypress Hills in Saskatchewan?", "high ground that stayed above the glaciers", ["a flat desert", "a huge lake", "a volcano"], "The hills were high enough to avoid being covered by ice.", "⛰️"),
  q("Which landform did glaciers leave behind on the prairies?", "flat plains and many small lakes", ["tall volcanoes", "sea cliffs", "coral reefs"], "Glaciers left behind sediment and shaped the land.", "🏞️"),
  q("What is a fossil?", "the remains or trace of a living thing from long ago", ["a living plant", "a new toy", "a piece of metal"], "Fossils are found in rock.", "🦴"),
  q("Which could be a fossil?", "a shell print in rock", ["a leaf on a tree", "a bone in a dog", "a flower in a vase"], "A fossil is old and preserved in rock.", "🐚"),
  q("Where are most fossils found?", "in sedimentary rock", ["in lava", "in clouds", "in new plastic"], "Soft sediment can bury and keep a body or print.", "🪨"),
  q("What is a paleontologist?", "a scientist who studies fossils", ["a person who studies weather", "a person who studies stars", "a farmer"], "They learn about life long ago.", "🧑‍🔬"),
  q("Scotty is a famous fossil from Eastend, Saskatchewan. What is Scotty?", "a Tyrannosaurus rex", ["a woolly mammoth", "a fish", "a bird"], "Scotty is one of the largest T. rex skeletons ever found.", "🦖"),
  q("About how long ago did T. rex live?", "about 66 million years ago", ["last week", "about 100 years ago", "about 1000 years ago"], "It lived at the end of the age of dinosaurs.", "🦖"),
  q("The T. rex Discovery Centre in Eastend teaches people about…", "dinosaur fossils", ["space travel", "cooking", "ocean ships"], "It shows how fossils help us learn about the past.", "🏛️"),
  q("What can a fossil of a sea animal found in Saskatchewan tell us?", "the land was once under a sea", ["it was always a desert", "the animal flew here", "it is a modern lake"], "A shallow sea once covered the prairies.", "🌊"),
  q("What can a fern fossil in coal tell us?", "plants grew there long ago", ["the plant is alive", "it was just bought", "it fell from space"], "Fossils show what lived in a place.", "🌿"),
  q("Why are older rock layers usually found below younger ones?", "new layers settle on top", ["old layers float up", "rock layers move at night", "they are all the same age"], "Sediment piles up over time.", "📚"),
  q("A fossil lies in a deep layer of rock. Compared to a fossil near the top, it is…", "older", ["younger", "the same age", "alive"], "The bottom layer was laid down first.", "⏳"),
  q("Where might erosion uncover fossils?", "on a cliff or badland slope", ["inside a closed jar", "in a bathtub", "on a plastic toy"], "Wind and water wear away layers and reveal bones.", "🏜️"),
  q("What is a gully?", "a small channel cut by running water", ["a type of fossil", "a tall mountain", "a kind of cloud"], "Gullies form on slopes during heavy rain.", "🌧️"),
  q("How can people slow down soil erosion?", "plant grass and trees", ["clear all plants", "pave every field", "dig deep holes"], "Roots hold soil in place.", "🌳"),
  q("Why is erosion a problem for farmers?", "it can carry away good topsoil", ["it makes more fields", "it grows crops", "it adds rain"], "Topsoil takes hundreds of years to form.", "🚜"),
  hq("Why do landforms such as canyons take a very long time to form?", "weathering and erosion work very slowly", ["they appear overnight", "they are drawn by scientists", "they only form in winter"], "Small changes add up over millions of years.", "⏳"),
  hq("A seashell fossil is found on the prairie. What does it show?", "an ocean once covered this land", ["shells grow in fields", "the shell was lost last year", "oceans never change"], "Fossils are evidence of how Earth has changed.", "🐚"),
  hq("Why can't we see a river carve a valley in one lifetime?", "the change happens too slowly", ["rivers don't move", "water has no force", "valleys never change"], "Scientists use evidence to learn about slow changes.", "🏞️"),
  hq("Why do scientists look at many fossils and not just one?", "more evidence gives a better story", ["one is enough always", "fossils never help", "it takes less time"], "Many pieces of evidence show a clearer picture.", "🔬"),
];

export const units: Unit[] = [
  {
    id: "sk-rocks-minerals",
    title: "Rocks, Minerals & Mining",
    emoji: "⛏️",
    blurb: "Hardness, kinds of rock, potash and uranium",
    standards: { "ca-sk": sk("RM4.1, RM4.2", "physical properties of rocks and minerals, and how human uses such as mining affect people, society and the environment") },
    parentNote: "Mineral properties (hardness, lustre, streak), igneous, sedimentary and metamorphic rock, the Canadian Shield, and how Saskatchewan's potash, uranium and gold mining helps and affects people and the land.",
    generate: bankUnit(ROCKS, { sorts: [ROCK_SORT, MINE_SORT], orders: [HARD_ORDER, MINING_ORDER] }),
  },
  {
    id: "sk-erosion-fossils",
    title: "Erosion & Fossils",
    emoji: "🦖",
    blurb: "How land changes, and what fossils tell us",
    standards: { "ca-sk": sk("RM4.3", "how weathering, erosion and fossils are evidence of how landforms on Earth formed") },
    parentNote: "Weathering and erosion by water, wind, ice and glaciers, deposition, how fossils form, the T. rex Scotty from Eastend, and how fossils are evidence of Earth's long history.",
    generate: bankUnit(EROSION, { sorts: [FORCE_SORT], orders: [FOSSIL_ORDER, LANDFORM_ORDER] }),
  },
];
