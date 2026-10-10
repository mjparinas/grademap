import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { ab } from "./kit";

// Alberta Grade 3 science (2023 curriculum): materials and changes of state, the water cycle, simple
// machines, changes to Earth's surface (including fossils and farming), soil, how plants and animals
// interact, and computational thinking. Food chains, wind, water and ice, forces and science skills are
// shared from existing units.

// ---------- States of matter ----------

const STATES_SORT: SortSet = {
  prompt: "Is it a solid, a liquid or a gas? Tap an item, then tap its basket.",
  hint: "A solid keeps its own shape. A liquid takes the shape of its container. A gas spreads out to fill the space.",
  bins: [
    { id: "solid", label: "solid", emoji: "🧊" },
    { id: "liquid", label: "liquid", emoji: "💧" },
    { id: "gas", label: "gas", emoji: "💨" },
  ],
  items: [
    { label: "a rock", emoji: "🪨", bin: "solid" },
    { label: "an ice cube", emoji: "🧊", bin: "solid" },
    { label: "a pencil", emoji: "✏️", bin: "solid" },
    { label: "milk", emoji: "🥛", bin: "liquid" },
    { label: "juice", emoji: "🧃", bin: "liquid" },
    { label: "rain", emoji: "🌧️", bin: "liquid" },
    { label: "steam", emoji: "♨️", bin: "gas" },
    { label: "air in a balloon", emoji: "🎈", bin: "gas" },
  ],
};

const STATES: Item[] = [
  q("Matter is anything that…", "takes up space and has weight", ["is hot", "is alive", "can be seen only at night"], "Everything around you, even air, is matter.", "🌍"),
  q("What are the three common states of matter?", "solid, liquid and gas", ["hot, warm and cold", "red, blue and green", "big, small and tiny"], "Solids, liquids and gases are the states of matter.", "🧪"),
  q("A solid has…", "its own shape and volume", ["no volume", "no shape and no volume", "no weight"], "A solid keeps its shape unless something changes it.", "🧊"),
  q("A liquid…", "flows and takes the shape of its container", ["keeps its own shape", "floats away as air", "never changes shape"], "Pour water into a different cup and it takes the new shape.", "💧"),
  q("A gas…", "spreads out to fill the space it is in", ["keeps a fixed shape", "is always hard", "cannot move"], "Air fills a balloon completely.", "🎈"),
  q("An ice cube melts into water. This change of state is called…", "melting", ["freezing", "evaporation", "condensation"], "Melting is solid to liquid.", "🧊"),
  q("Water in a freezer turns into ice. This is called…", "freezing", ["melting", "evaporation", "condensation"], "Freezing is liquid to solid.", "🥶"),
  q("A puddle dries up on a warm sunny day. This is called…", "evaporation", ["freezing", "melting", "condensation"], "Evaporation is liquid to gas.", "☀️"),
  q("Drops form on the outside of a cold glass on a hot day. This is called…", "condensation", ["melting", "evaporation", "freezing"], "Condensation is gas to liquid.", "🥤"),
  q("What can make an ice cube melt faster?", "heating it", ["cooling it", "putting it in the freezer", "wrapping it in ice"], "Heat makes solids melt.", "🔥"),
  q("Water freezes and melts at the same temperature. This temperature is…", "0 °C", ["50 °C", "100 °C", "−100 °C"], "Water changes between ice and liquid water at 0 degrees Celsius.", "🌡️"),
  q("Water boils at about…", "100 °C", ["0 °C", "20 °C", "50 °C"], "Boiling water turns into a gas quickly.", "🫖"),
  q("A chocolate bar melts in a hot car. What changes?", "its state, from solid to liquid", ["it becomes a gas", "it becomes heavier", "nothing"], "Heat makes the chocolate melt.", "🍫"),
  hq("Which of these changes is condensation?", "steam from a kettle turns into drops on a cold window", ["a puddle dries", "ice melts", "water freezes in a lake"], "Condensation is when a gas cools into a liquid.", "🪟"),
  hq("The temperature at which a solid becomes a liquid is called its…", "melting point", ["boiling point", "freezing room", "cooling zone"], "Each substance has its own melting point.", "🌡️"),
  hq("Why do Alberta lakes freeze in winter?", "the water cools to its freezing point", ["the sun gets bigger", "the air turns to ice", "the water gets saltier"], "When water reaches 0 °C it can freeze.", "❄️"),
];

// ---------- Water cycle ----------

const CYCLE_ORDER = order("Put the water cycle in order, starting with the Sun warming water.", "The Sun warms water, it evaporates, forms clouds, falls as precipitation and collects again.", [
  ["Sun warms water in a lake", "☀️"],
  ["Water evaporates", "♨️"],
  ["Clouds form", "☁️"],
  ["Rain or snow falls", "🌧️"],
  ["Water collects in rivers and lakes", "🏞️"],
]);

const CYCLE: Item[] = [
  q("The water cycle is…", "water moving between bodies of water, land and the air", ["water that stays still", "the way we wash dishes", "a kind of bicycle"], "Water keeps moving around Earth.", "🔄"),
  q("What gives the energy that makes water evaporate?", "the Sun", ["the Moon", "the wind only", "the stars"], "The Sun heats water so it turns into water vapour.", "☀️"),
  q("Evaporation is when liquid water changes into…", "water vapour, a gas", ["ice", "rock", "soil"], "Water vapour is a gas you cannot see.", "♨️"),
  q("Clouds form when water vapour…", "cools and condenses into tiny drops", ["warms up and disappears", "turns into soil", "freezes into rock"], "Condensation makes clouds.", "☁️"),
  q("Rain, snow and hail are called…", "precipitation", ["evaporation", "condensation", "melting"], "Precipitation is water falling from clouds.", "🌨️"),
  q("In the Rocky Mountains, snow falls and collects on glaciers. When it melts, the water…", "flows into streams and rivers", ["goes back to the Sun", "stays frozen forever", "turns into gas only"], "Melting glaciers feed many Alberta rivers.", "🏔️"),
  q("Which step of the water cycle is a puddle drying in the Sun?", "evaporation", ["condensation", "precipitation", "collection"], "The water becomes a gas.", "💧"),
  q("Which step happens when drops form on a cold window?", "condensation", ["evaporation", "precipitation", "melting"], "Gas cools and turns to liquid.", "🪟"),
  q("Where does most precipitation end up?", "in rivers, lakes, oceans and the ground", ["in space", "only in clouds", "in the Sun"], "It collects and the cycle begins again.", "🌊"),
  q("The water you drink has been moving through the water cycle…", "for a very long time", ["never", "for only one day", "only in books"], "The water on Earth keeps moving and being reused.", "🚰"),
  q("Why is it important to keep rivers and lakes clean?", "all living things use water", ["clouds need chemicals", "water likes to be dirty", "it does not matter"], "People, plants and animals depend on clean water.", "🐟"),
  q("A farmer in southern Alberta hopes for rain. Rain is part of…", "the water cycle", ["a machine", "a food chain only", "a landform"], "Rain is precipitation, a step in the cycle.", "🌾"),
  hq("When the Sun warms a lake, the lake does not run out of water. Why?", "water returns as precipitation and flows back in", ["lakes cannot evaporate", "the Sun cools water", "water is made new every day"], "The water cycle keeps water moving and returning.", "🏞️"),
  hq("Snow on a mountain melts in spring. Which change of state is this?", "solid to liquid", ["liquid to gas", "gas to liquid", "gas to solid"], "Melting turns solid snow into liquid water.", "🏔️"),
  hq("Which describes why we should not waste water?", "clean fresh water is limited in each place", ["water disappears forever", "rain only falls in cities", "water is made in taps"], "Respecting water helps everyone.", "🚿"),
];

// ---------- Materials and how they change ----------

const MATERIAL_SORT: SortSet = {
  prompt: "Natural material or processed material? Tap an item, then tap its basket.",
  hint: "Natural materials come from nature as they are. Processed materials are made from natural ones and changed by people.",
  bins: [
    { id: "natural", label: "natural", emoji: "🌳" },
    { id: "processed", label: "processed", emoji: "🏭" },
  ],
  items: [
    { label: "wood from a tree", emoji: "🪵", bin: "natural" },
    { label: "wool from a sheep", emoji: "🐑", bin: "natural" },
    { label: "clay", emoji: "🧱", bin: "natural" },
    { label: "stone", emoji: "🪨", bin: "natural" },
    { label: "paper", emoji: "📄", bin: "processed" },
    { label: "glass", emoji: "🥛", bin: "processed" },
    { label: "plastic", emoji: "🧴", bin: "processed" },
    { label: "bricks", emoji: "🏠", bin: "processed" },
  ],
};

const CHANGE_SORT: SortSet = {
  prompt: "Can the change be undone? Tap an item, then tap its basket.",
  hint: "A reversible change can be undone, like melting and freezing. A permanent change cannot be undone, like baking a cake.",
  bins: [
    { id: "rev", label: "reversible", emoji: "🔁" },
    { id: "perm", label: "permanent", emoji: "🚫" },
  ],
  items: [
    { label: "ice melting", emoji: "🧊", bin: "rev" },
    { label: "water freezing", emoji: "❄️", bin: "rev" },
    { label: "chocolate melting", emoji: "🍫", bin: "rev" },
    { label: "folding paper", emoji: "📄", bin: "rev" },
    { label: "baking a cake", emoji: "🎂", bin: "perm" },
    { label: "cooking an egg", emoji: "🍳", bin: "perm" },
    { label: "burning wood", emoji: "🔥", bin: "perm" },
    { label: "a nail rusting", emoji: "🔩", bin: "perm" },
  ],
};

const MATERIALS: Item[] = [
  q("Paper is made from wood. This makes paper a…", "processed material", ["natural material", "gas", "living thing"], "People change wood into paper.", "📄"),
  q("Which is a natural material?", "wool from a sheep", ["plastic", "glass", "paper"], "Natural materials come from plants, animals or the ground.", "🐑"),
  q("Which material comes from sand?", "glass", ["paper", "wool", "wood"], "Sand is heated to make glass.", "🪟"),
  q("Which material is processed from oil?", "plastic", ["wool", "stone", "clay"], "Many plastics are made from oil.", "🧴"),
  q("Why do people process natural materials?", "to make them useful for a purpose", ["to make them disappear", "to make them wild", "to hide them"], "Processed materials are designed for a specific job.", "🏭"),
  q("Bricks are made by shaping and baking…", "clay", ["wool", "water", "snow"], "Clay is a natural material that becomes hard when baked.", "🧱"),
  q("A cotton shirt starts out as…", "cotton plants", ["wool", "oil", "sand"], "Cotton fibres are spun into thread and cloth.", "👕"),
  q("A snowman melts in a warm spring day. This change is…", "reversible", ["permanent", "a burning", "a baking"], "If the water freezes again you can get ice back.", "⛄"),
  q("Baking a cake is a permanent change because…", "you cannot turn the cake back into batter", ["you can freeze it again", "it melts", "it changes shape only"], "Some changes cannot be undone.", "🎂"),
  q("Cooking an egg is…", "a permanent change", ["a reversible change", "melting", "freezing"], "A cooked egg cannot go back to raw.", "🍳"),
  q("Which is a reversible change?", "water freezing into ice", ["wood burning to ash", "an egg being fried", "a cake being baked"], "Ice can melt to water again.", "🧊"),
  q("Many First Nations, Métis and Inuit people have long used natural materials from the land with care. This shows…", "respect for the land", ["a wish to waste", "no interest in nature", "that only one way exists"], "Living in balance with the land is important in many communities.", "🌿"),
  hq("A piece of wood turns to ashes in a fire. What kind of change is it?", "permanent", ["reversible", "melting", "freezing"], "You cannot turn ashes back into wood.", "🔥"),
  hq("Why can an old plastic bottle be recycled into a new product?", "processed materials can sometimes be changed again", ["plastic grows back", "bottles turn into trees", "it becomes a natural material"], "Recycling can give materials a new use.", "♻️"),
  hq("Rusting turns a shiny nail into reddish flakes. This is a…", "permanent change", ["reversible change", "state change to a gas", "freezing"], "Rust is a new material and the nail will not go back.", "🔩"),
];

// ---------- Simple machines ----------

const MACHINES: Item[] = [
  q("A simple machine helps us…", "do work with less effort", ["use more electricity", "make noise", "stop moving"], "Simple machines make a job easier.", "🔧"),
  q("A seesaw is a kind of…", "lever", ["ramp", "wheel", "gear"], "A lever turns on a point called a fulcrum.", "🛝"),
  q("A ramp is also called an…", "inclined plane", ["axle", "lever", "pulley"], "An inclined plane is a slanted surface.", "📐"),
  q("Why is it easier to push a heavy box up a ramp than to lift it straight up?", "the ramp spreads the work over a longer path", ["the box gets lighter", "ramps make boxes disappear", "ramps pull the box"], "A longer path takes less push.", "📦"),
  q("A wheel and axle helps things…", "roll", ["freeze", "melt", "grow"], "Wheels roll with less rubbing than sliding.", "🛞"),
  q("A bicycle wheel turns on a bar called an…", "axle", ["fulcrum", "ramp", "wedge"], "The axle goes through the middle of the wheel.", "🚲"),
  q("A canoe paddle works like a…", "lever", ["ramp", "wheel", "screw"], "You push on one place while a part of the paddle pivots in the water.", "🛶"),
  q("A wheelbarrow carries heavy loads. Which simple machines does it use?", "a wheel and a lever", ["a ramp only", "a magnet", "a screw"], "The wheel rolls and the handles lift like a lever.", "🛒"),
  q("A playground slide is an example of…", "an inclined plane", ["a lever", "a wheel", "a pulley"], "A slide is a slanted surface.", "🛝"),
  q("Which tool is a lever?", "a crowbar", ["a ramp", "a wheel", "a ball"], "A crowbar pries by turning on a fulcrum.", "🔨"),
  q("A wheelchair ramp helps people…", "get up a step with less effort", ["go faster in a straight line only", "fly", "get taller"], "Ramps make steps easier to climb.", "♿"),
  q("A pair of scissors uses…", "two levers working together", ["a ramp", "a magnet", "a balloon"], "The blades pivot like two levers.", "✂️"),
  hq("A simple machine can change a force's…", "strength or direction", ["colour", "taste", "weight of the Earth"], "Machines can make a force bigger or point it somewhere else.", "➡️"),
  hq("Many First Nations, Métis and Inuit peoples designed tools such as the paddle and the antler wedge. This shows…", "people have long used simple machines", ["machines were invented last year", "no tools were used", "only one community used tools"], "Simple machines have been used and improved for a very long time.", "🪓"),
  hq("You want to roll a heavy log. Which can help?", "put round logs underneath as rollers", ["wrap it in paper", "add water to it", "tie it with ribbon"], "Rolling reduces rubbing, like a wheel.", "🪵"),
];

// ---------- Changes to Earth's surface ----------

const EARTH: Item[] = [
  q("Earth's surface changes over…", "a very long time and also in sudden events", ["no time at all", "one hour only", "never"], "Some changes are slow and some are fast.", "🌍"),
  q("Over thousands of years, mountains can slowly…", "wear down", ["grow taller from rain", "turn into lakes", "disappear in a day"], "Wind, water and ice break rock apart.", "🏔️"),
  q("A river can change course by…", "wearing away one bank and building up another", ["jumping over the land", "freezing in summer", "turning into rock"], "Flowing water moves soil and rock.", "🏞️"),
  q("Which natural event can change Earth's surface quickly?", "a flood", ["a night of sleep", "a sunrise", "a school bell"], "Floods move soil and rock quickly.", "🌊"),
  q("A volcano erupting changes the land by…", "adding new rock", ["making it flat", "freezing it", "making it grow"], "Lava cools into new rock.", "🌋"),
  q("An earthquake can…", "shake and move parts of Earth's surface", ["make mountains disappear", "change the Moon", "melt rock"], "Earthquakes are sudden changes.", "📳"),
  q("Glaciers are…", "very thick, slow-moving sheets of ice", ["fast rivers", "lakes of milk", "clouds"], "Glaciers can carve valleys.", "🧊"),
  q("A glacier moving down a mountain valley can…", "carve a wide valley", ["make the valley smaller", "turn into a desert", "melt the mountains at once"], "The ice carries and grinds rock.", "🏔️"),
  q("Many lakes in Alberta were left by…", "melting glaciers long ago", ["volcanoes", "falling stars", "flooded cities"], "As ice melted, water filled hollows.", "🏞️"),
  q("Which describes a lake drying out?", "water evaporates faster than it comes in", ["water turns to stone", "the lake moves away", "birds drink it all"], "Lakes can shrink in dry times.", "☀️"),
  q("Many First Nations, Métis and Inuit communities hold knowledge about the land that was passed down by Elders over many generations. This knowledge is…", "important for understanding landscapes", ["not useful", "only for books", "the same for every Nation"], "Each community has its own knowledge of its own land.", "🧓"),
  q("A landslide can happen after heavy rain because…", "wet soil and rock can slip down a slope", ["rain makes rocks fly", "the Moon pulls rocks", "wind turns to rock"], "Water makes the ground heavier and looser.", "⛰️"),
  hq("Slow changes and sudden changes both shape the land. Which pair is correct?", "weathering is slow; a landslide is fast", ["both are always slow", "both are always fast", "weathering is fast; erosion never happens"], "Weathering takes a long time; landslides happen quickly.", "⏳"),
  hq("Why can a river carry more soil after heavy rain?", "fast, deep water has more energy to move material", ["rain turns soil into water", "the river stops", "soil floats away on its own"], "Fast water picks up and carries more sediment.", "🌧️"),
  hq("Why do scientists study layers of rock in a cliff?", "the layers hold clues about Earth's past", ["to find out what to eat", "to paint pictures", "to count clouds"], "Layers were laid down over a long time.", "🔍"),
];

// ---------- Soil ----------

const SOIL: Item[] = [
  q("Soil is made of…", "rock bits, air, water and dead and living things", ["only sand", "only water", "only air"], "Soil mixes living and non-living parts.", "🌱"),
  q("Humus is the dark part of soil. It comes from…", "decaying plants and animals", ["crushed glass", "plastic", "salt"], "Decayed material gives soil nutrients.", "🍂"),
  q("Which animal lives in soil?", "an earthworm", ["a bison", "an eagle", "a salmon"], "Worms tunnel and mix the soil.", "🪱"),
  q("A habitat is…", "a place where a plant or animal lives and finds what it needs", ["a kind of rock", "a river", "a seed"], "Soil is a habitat for many small animals.", "🏡"),
  q("How do earthworms help soil?", "they loosen it and mix in air and nutrients", ["they turn it to stone", "they make it dry", "they take away water"], "Their tunnels let air and water in.", "🪱"),
  q("Which is a non-living part of soil?", "rock particles", ["worms", "roots", "beetles"], "Rock bits come from weathered rock.", "🪨"),
  q("Plant roots help soil because they…", "hold it together", ["wash it away", "make it hot", "turn it blue"], "Roots help keep soil from blowing or washing away.", "🌿"),
  q("Rich, dark soil is good for farming because it has…", "lots of nutrients", ["too many rocks", "no water", "no air"], "Plants take nutrients from soil.", "🌾"),
  q("Which can change soil over time?", "plants, animals, wind and water", ["only magnets", "only the Moon", "only paper"], "Soil is always changing.", "🔄"),
  q("When leaves fall and rot, they…", "add nutrients to the soil", ["make soil dry", "turn into rock", "stop worms"], "Rotting leaves become humus.", "🍁"),
  q("Which soil holds water best?", "soil with lots of humus", ["pure dry sand", "gravel only", "bare rock"], "Humus acts like a sponge.", "💧"),
  q("Soil is a thin layer on…", "the surface of Earth", ["the Moon", "the inside of the Sun", "the sea floor only"], "It is the top layer where plants grow.", "🌍"),
  hq("A gardener adds compost to soil. Why?", "it adds nutrients and helps hold water", ["to make it hard", "to remove plants", "to lower the temperature"], "Compost is rotted plant material.", "🧑‍🌾"),
  hq("Why do Alberta's prairies have some of the best farm soil?", "grasses added dark, rich humus over many years", ["there are no plants", "it is all clay", "it never rains"], "Prairie grasses have deep roots and added organic matter for thousands of years.", "🌾"),
  hq("Which action protects soil?", "planting grass or crops to cover bare ground", ["leaving land bare", "removing all roots", "burning everything"], "Plant cover helps stop wind and water erosion.", "🛡️"),
];

// ---------- Fossils ----------

const FOSSILS: Item[] = [
  q("A fossil is…", "the preserved remains or marks of a living thing from long ago", ["a new bone", "a kind of soil", "a toy"], "Fossils can be bones, shells, footprints or leaves.", "🦴"),
  q("Dinosaurs lived…", "millions of years ago", ["last year", "when your grandparents were young", "only in movies"], "Scientists learn about them from fossils.", "🦕"),
  q("A scientist who studies fossils is called a…", "paleontologist", ["chef", "pilot", "pharmacist"], "Paleontologists study life from long ago.", "🔬"),
  q("Many dinosaur fossils are found in Alberta, in places such as…", "Dinosaur Provincial Park", ["downtown shopping malls", "the middle of lakes", "the top of the Rockies"], "The park has the badlands where bones are exposed.", "🏜️"),
  q("The Royal Tyrrell Museum, where you can see dinosaur skeletons, is in…", "Drumheller", ["Calgary Zoo", "Banff", "Red Deer"], "The museum is in Drumheller, Alberta.", "🏛️"),
  q("Millions of years ago, part of Alberta was covered by…", "a shallow inland sea and lush forests", ["a desert only", "a huge city", "a glacier only"], "The climate was warmer and wetter.", "🌴"),
  q("Rock layers near the bottom of a cliff are usually…", "older than the layers above them", ["newer than the layers above", "the same age", "made of ice"], "Layers build up over time, so older ones are underneath.", "🧱"),
  q("How do fossils form?", "remains are buried and slowly turn to rock", ["bones turn into plastic", "a bone dries out in an hour", "a volcano makes them"], "Over time, minerals replace the living material.", "⏳"),
  q("A fossil of a fish is found high in the mountains. What does it tell us?", "the land was once under water", ["fish can climb", "someone dropped it", "the mountain is new"], "Rocks high up were once sea floor.", "🐟"),
  q("Which could be a fossil?", "a footprint pressed into mud that turned to rock", ["today's footprint on the beach", "a bone from last night's dinner", "a plastic toy"], "Fossils are very old.", "👣"),
  q("When a fossil is found in the badlands, scientists should…", "report it and leave digging to experts", ["break it into pieces", "take it home", "paint it"], "Fossils are protected and easily damaged.", "🛡️"),
  q("Which dinosaur's name honours Alberta?", "Albertosaurus", ["Triceratops", "Stegosaurus", "Diplodocus"], "Albertosaurus was named after the province.", "🦖"),
  hq("Why do scientists study layers of rock?", "each layer holds clues about the past", ["layers are colourful", "layers keep rocks warm", "layers make noise"], "Fossils and rock layers tell stories about Earth's history.", "🔍"),
  hq("Fossils help us learn…", "what plants and animals lived long ago and where", ["what we will eat tomorrow", "how fast clouds move", "who won a game"], "They are evidence of past life.", "🦴"),
  hq("Why can erosion in Alberta's badlands show dinosaur bones?", "wind and water wear away the rock and uncover them", ["dinosaurs walk up through the ground", "bones grow", "farmers plant them"], "Erosion exposes buried fossils.", "🌬️"),
];

// ---------- Farming and the land ----------

const FARMING: Item[] = [
  q("Which crop do many Alberta farmers grow, with yellow flowers in summer?", "canola", ["bananas", "coffee", "pineapples"], "Canola fields look like bright yellow carpets.", "🌼"),
  q("Which grain do Alberta farmers grow to make bread flour?", "wheat", ["rice", "bananas", "cocoa"], "Wheat is grown across the Prairies.", "🌾"),
  q("Farming changes Earth's surface by…", "turning grassland into fields", ["building mountains", "creating oceans", "making volcanoes"], "Farmers plough, plant and harvest.", "🚜"),
  q("Why do farmers rotate crops from year to year?", "to keep the soil healthy", ["to make the soil blue", "to stop rain", "to hide the crops"], "Different plants use and add different nutrients.", "🔄"),
  q("What can happen if soil is left bare on a windy day?", "wind may blow the soil away", ["it will grow plants", "it will freeze", "it will turn to metal"], "Plant cover protects soil.", "💨"),
  q("Which action is stewardship, caring for the land?", "planting trees as a windbreak", ["dumping garbage", "cutting all trees", "burning plastic"], "Stewardship means looking after something for the future.", "🌳"),
  q("Building a new town changes the land by…", "covering it with roads and buildings", ["turning it into a lake", "making it taller", "growing it"], "People change the surface when they build.", "🏘️"),
  q("The mountain pine beetle harms forests because…", "it kills pine trees", ["it plants pine trees", "it cleans the air", "it eats rocks"], "A tree-killing insect can change a whole forest.", "🪲"),
  q("An animal such as a gopher changes the land by…", "digging burrows", ["building cities", "painting rocks", "making clouds"], "Burrowing mixes soil.", "🐿️"),
  q("Beavers change the land by…", "building dams that make ponds", ["breaking mountains", "making volcanoes", "turning rock to sand"], "Dams hold back water and create wetlands.", "🦫"),
  q("Pollution can harm the land because it…", "spoils soil and water for plants and animals", ["makes soil healthier", "cleans rivers", "feeds crops"], "Keeping garbage out of nature protects living things.", "🗑️"),
  q("Alberta farmers use fields for crops and for grazing animals such as…", "cattle", ["penguins", "camels", "whales"], "Ranching is a big part of southern Alberta.", "🐄"),
  hq("A farmer plants shelterbelts of trees around a field. How does it help?", "it slows the wind so soil does not blow away", ["it stops the sun", "it makes the soil harder", "it hides the field"], "Trees block the wind.", "🌲"),
  hq("Why is growing food for people important to protect soil?", "healthy soil grows healthy crops for many years", ["soil is not needed", "food grows without soil", "soil is only for gardens"], "Good soil is the base of farming.", "🧺"),
  hq("Which activity best connects people's responsibility and the land?", "using land carefully so it stays healthy for the future", ["using land without thinking", "taking everything at once", "never using land"], "Responsibility means looking after the land for future generations.", "🤲"),
];

// ---------- Senses and responding ----------

const SENSE_SORT: SortSet = {
  prompt: "Which one needs a response from a plant, and which from an animal? Tap an item, then tap its basket.",
  hint: "Plants respond to light, water and temperature. Animals use senses to find food and avoid danger.",
  bins: [
    { id: "plant", label: "plant", emoji: "🌱" },
    { id: "animal", label: "animal", emoji: "🐾" },
  ],
  items: [
    { label: "leaves turn toward the Sun", emoji: "🌻", bin: "plant" },
    { label: "roots grow toward water", emoji: "💧", bin: "plant" },
    { label: "a flower closes at night", emoji: "🌷", bin: "plant" },
    { label: "a tree drops leaves in fall", emoji: "🍂", bin: "plant" },
    { label: "a deer lifts its ears at a sound", emoji: "🦌", bin: "animal" },
    { label: "a bear smells food", emoji: "🐻", bin: "animal" },
    { label: "a bird flies south in fall", emoji: "🐦", bin: "animal" },
    { label: "a rabbit freezes at a shadow", emoji: "🐇", bin: "animal" },
  ],
};

const SENSES: Item[] = [
  q("A plant on a windowsill bends toward the window. It is responding to…", "light", ["sound", "music", "a touch"], "Plants grow toward light.", "🪟"),
  q("An animal smells smoke and runs away. It used its sense of…", "smell", ["sight", "taste", "touch"], "Smell warns animals of danger.", "👃"),
  q("A deer lifts its head when a twig snaps. It used its sense of…", "hearing", ["taste", "smell", "touch"], "Many animals hear danger.", "🦌"),
  q("Why do many animals have a strong sense of smell?", "to find food and sense danger", ["to see colours", "to hear music", "to feel cold"], "Smell helps animals survive.", "🐺"),
  q("A bear in fall eats a lot of food. This is a response to…", "the coming cold winter", ["noise", "a school bell", "a lamp"], "Bears get ready for winter sleep.", "🐻"),
  q("A flower closes at night. It is responding to…", "less light", ["more water", "more sound", "less soil"], "Some flowers close when it gets dark.", "🌷"),
  q("The roots of a plant grow toward…", "water", ["the sky", "a window", "a cloud"], "Roots find water in the soil.", "💧"),
  q("An owl hunts at night. Which sense helps it most?", "hearing and sight in the dark", ["taste", "touch only", "smell only"], "Owls have excellent hearing and large eyes.", "🦉"),
  q("A rabbit freezes when it sees a big shadow overhead. It is responding to…", "a possible danger", ["rain", "snow", "music"], "Animals respond to threats to stay alive.", "🐇"),
  q("Many birds fly south before winter. This is a response to…", "colder temperatures and less food", ["a loud clap", "a sunny day", "a new moon"], "Migration helps birds find food.", "🦆"),
  q("Which is a stimulus, something a living thing senses?", "light, water or temperature", ["a book", "a pencil", "an eraser"], "Stimuli are things in the environment that a living thing responds to.", "🌡️"),
  q("Why do trees lose their leaves in fall in Alberta?", "daylight and temperature change", ["birds take them", "the leaves are bored", "it gets too hot"], "Trees respond to shorter days and cold.", "🍂"),
  hq("A sunflower follows the Sun across the sky. This helps it…", "get more light to make food", ["get more water", "scare animals", "grow roots"], "Light gives a plant energy to make food.", "🌻"),
  hq("Why does a mother moose smell the air often?", "to sense danger and food nearby", ["to practise breathing", "to smell flowers only", "to make sounds"], "Smell helps moose protect their calves.", "🫎"),
  hq("An animal has fur that turns white in winter. This helps it…", "blend in with snow", ["catch fish", "fly", "make a nest"], "Camouflage helps with hiding from predators.", "❄️"),
];

// ---------- Protecting plants and animals ----------

const PROTECT: Item[] = [
  q("What is a respectful way to watch wildlife?", "stay at a safe distance and be quiet", ["chase it", "feed it your lunch", "throw stones"], "Wild animals need space.", "🔭"),
  q("Why should we not feed wild animals such as bears or squirrels?", "human food can harm them and make them lose their fear", ["they love our food", "they forget how to sleep", "it makes them grow"], "Wild animals should find their own food.", "🐻"),
  q("Which action protects plants and animals?", "stay on the trail", ["pick all the flowers", "trample plants", "litter"], "Trails keep people from trampling habitats.", "🥾"),
  q("A wildlife crossing over a highway helps animals…", "cross the road safely", ["drive cars", "build roads", "find houses"], "Alberta has crossings, for example in Banff National Park.", "🌉"),
  q("Why do we keep our dog on a leash in some parks?", "to keep wildlife and plants safe", ["to make the dog tired", "to teach tricks", "because dogs cannot run"], "Dogs can scare or harm wild animals.", "🐕"),
  q("Counting the animals in a place, with permission and care, helps because…", "it shows if their numbers are growing or shrinking", ["it makes more animals", "it scares animals", "it tells the weather"], "Tracking populations helps protect them.", "📋"),
  q("Which is an example of a plant that depends on an animal?", "a plant whose seeds are spread by birds", ["a rock", "a puddle", "a cloud"], "Animals can carry seeds.", "🐦"),
  q("Which is an example of an animal that depends on a plant?", "a deer eating leaves", ["a fish eating a rock", "a bird eating sand", "a bear eating clouds"], "Many animals eat plants.", "🦌"),
  q("Bees help plants by…", "carrying pollen from flower to flower", ["eating roots", "making soil", "cutting grass"], "Pollination helps plants make seeds.", "🐝"),
  q("Why is it important to put garbage in a bin?", "animals can be hurt by litter", ["litter is food", "it makes parks pretty", "it feeds plants"], "Litter can trap or poison animals.", "🗑️"),
  q("Many First Nations, Métis and Inuit communities teach respect for plants and animals. One way to show respect is to…", "take only what you need and give thanks", ["take as much as possible", "waste food", "ignore nature"], "Respect for living things is part of many teachings.", "🌿"),
  q("A sign says “Do not pick the flowers.” Why?", "so the plants can make seeds and grow again", ["flowers do not need seeds", "the sign is old", "flowers are made of paper"], "Picking all the flowers leaves no seeds.", "🌸"),
  hq("Beavers build dams that create ponds. Which animals might use the pond?", "ducks, fish and frogs", ["only camels", "only penguins", "no animals"], "A pond becomes a habitat for other living things.", "🦫"),
  hq("Which is a good way to help pollinators near your home?", "plant flowers that bloom at different times", ["cover the yard with pavement", "spray all flowers", "cut all the flowers"], "Pollinators need food all season long.", "🌼"),
  hq("Why can a fence or road split an animal's home range?", "animals may not be able to get to food, water or mates", ["animals like fences", "roads are food", "fences help flying animals"], "Habitat that is cut in pieces is harder to use.", "🚧"),
];

// ---------- Computational thinking ----------

const CODE_ORDER = order("Put these steps for making a sandwich in a sensible order.", "Steps must be in a clear order for the instructions to work.", [
  ["Wash your hands", "🧼"],
  ["Put two slices of bread on a plate", "🍞"],
  ["Spread filling on one slice", "🧈"],
  ["Put the slices together", "🥪"],
  ["Cut the sandwich in half", "🔪"],
]);

const CODE_SORT: SortSet = {
  prompt: "Which part of computational thinking is it? Tap an item, then tap its basket.",
  hint: "Breaking a task into steps is decomposing. Finding the same thing again and again is spotting a pattern.",
  bins: [
    { id: "break", label: "breaking it down", emoji: "🧩" },
    { id: "pattern", label: "finding a pattern", emoji: "🔁" },
  ],
  items: [
    { label: "split a big job into small tasks", emoji: "🧩", bin: "break" },
    { label: "make a to-do list for a party", emoji: "📋", bin: "break" },
    { label: "plan each step of a recipe", emoji: "🍳", bin: "break" },
    { label: "design the parts of a robot", emoji: "🤖", bin: "break" },
    { label: "notice a dance repeats every 4 beats", emoji: "💃", bin: "pattern" },
    { label: "see that stairs go up the same way", emoji: "🪜", bin: "pattern" },
    { label: "spot the same shape again and again", emoji: "🔷", bin: "pattern" },
    { label: "notice the days of the week repeat", emoji: "📅", bin: "pattern" },
  ],
};

const CODE: Item[] = [
  q("An algorithm is…", "a set of clear steps to solve a problem", ["a kind of computer", "a loud noise", "a type of food"], "Instructions that can be followed by a person or machine.", "📜"),
  q("Why must instructions be in the right order?", "so the task works the way you want", ["so they look neat", "so they are loud", "so they are long"], "Putting socks on after shoes does not work.", "🔢"),
  q("A robot is told to walk forward 3 steps, turn right, then walk forward 2 steps. What is the first step?", "walk forward 3 steps", ["turn right", "walk forward 2 steps", "stop"], "Follow the instructions in order.", "🤖"),
  q("A bug in a program is…", "a mistake that makes it not work as planned", ["a small insect", "a kind of battery", "a loud sound"], "Finding and fixing bugs is called debugging.", "🐞"),
  q("If a robot goes the wrong way, what should you do?", "check the steps to find the mistake", ["throw the robot", "ignore it", "make it faster"], "Work backward to find the mistake.", "🔍"),
  q("A loop is when a program…", "repeats the same steps", ["stops forever", "deletes itself", "turns off"], "Instead of writing the same step 4 times, a loop can repeat it.", "🔁"),
  q("There are many ways to get to school. This shows that…", "one task can be done in different ways", ["there is only one way", "walking is wrong", "buses are wrong"], "Creativity means finding several solutions.", "🏫"),
  q("Which is a creative way to solve a problem?", "think of more than one idea before choosing", ["use the first idea always", "give up", "ask someone to do it"], "Thinking of many ideas is divergent thinking.", "💡"),
  q("Breaking a big job into smaller parts makes it…", "easier to do", ["harder to do", "impossible", "longer to start"], "Small steps make big jobs manageable.", "🧩"),
  q("A program uses commands such as “move” and “turn.” These are…", "instructions for the computer", ["pictures", "songs", "snacks"], "Computers follow instructions exactly.", "💻"),
  q("A map app suggests a few different routes. This is an example of…", "more than one way to reach the same place", ["only one way", "a broken route", "a game"], "Different solutions can reach the same goal.", "🗺️"),
  q("Which job might use creativity and computer programming?", "making a video game", ["tying shoes only", "sleeping", "peeling an orange"], "Programming can be a creative job.", "🎮"),
  hq("You give a friend instructions to draw a house, but they draw something different. What might help?", "make the instructions clearer and more exact", ["draw faster", "say them louder", "use fewer words only"], "Clear, exact steps make results match.", "🏠"),
  hq("You want a robot to take 4 steps. Which is faster to write?", "repeat the step 4 times", ["write the step 4 separate times", "write the step 40 times", "do not write it"], "A loop saves time.", "🔁"),
  hq("Why might two groups write different instructions for the same dance?", "there are many ways to do the same thing", ["one group is wrong", "dances cannot be written", "instructions are not needed"], "Creativity means different ideas are fine.", "💃"),
];

export const units: Unit[] = [
  {
    id: "states-matter-ab",
    title: "Solids, Liquids & Gases",
    emoji: "🧊",
    blurb: "Melting, freezing, evaporation and condensation.",
    parentNote: "States of matter and the changes of state caused by heating and cooling, including melting and freezing points of water.",
    standards: ab("3M1.2, 3M1.3, 3M1.4", "solids, liquids, gases, and changes of state such as melting, freezing, evaporation and condensation"),
    generate: bankUnit(STATES, { sorts: [STATES_SORT] }),
  },
  {
    id: "water-cycle-ab",
    title: "The Water Cycle",
    emoji: "🌧️",
    blurb: "How water moves from lakes to clouds and back.",
    parentNote: "The water cycle: evaporation, condensation, precipitation and collection, with Alberta examples such as glacier melt feeding rivers.",
    standards: ab("3M1.5", "the water cycle and how water changes state as it moves"),
    generate: bankUnit(CYCLE, { orders: [CYCLE_ORDER] }),
  },
  {
    id: "materials-change-ab",
    title: "Materials & Changes",
    emoji: "🏭",
    blurb: "Natural and processed materials, and changes that can or cannot be undone.",
    parentNote: "Natural and processed materials, and the difference between reversible and permanent changes.",
    standards: ab("3M1.1, 3M1.6", "natural and processed materials, and reversible and permanent changes"),
    generate: bankUnit(MATERIALS, { sorts: [MATERIAL_SORT, CHANGE_SORT] }),
  },
  {
    id: "simple-machines-ab",
    title: "Simple Machines",
    emoji: "⚙️",
    blurb: "Levers, wheels and ramps make work easier.",
    parentNote: "How levers, wheels and axles, and inclined planes change the strength or direction of a force, including tools designed and used by First Nations, Métis and Inuit communities.",
    standards: ab("3E1.2", "simple machines such as levers, wheels and inclined planes"),
    generate: bankUnit(MACHINES),
  },
  {
    id: "earth-changes-ab",
    title: "How Earth's Surface Changes",
    emoji: "🏔️",
    blurb: "Mountains, rivers, glaciers and sudden events.",
    parentNote: "Slow and fast changes to Earth's surface, with Alberta examples such as glaciers and rivers. Many First Nations, Métis and Inuit communities hold knowledge about the land passed down over generations.",
    standards: ab("3ES1.1", "changes to Earth's surface over long and short times"),
    generate: bankUnit(EARTH),
  },
  {
    id: "soil-habitat-ab",
    title: "Soil Is Alive",
    emoji: "🪱",
    blurb: "What soil is made of and who lives in it.",
    parentNote: "Soil as a mix of rock particles, air, water and once-living material, and as a habitat that plants and animals change.",
    standards: ab("3ES1.7", "what soil is made of, who lives in it and how it changes"),
    generate: bankUnit(SOIL),
  },
  {
    id: "fossils-ab",
    title: "Fossils & Rock Layers",
    emoji: "🦴",
    blurb: "Dinosaurs of Alberta and what rock layers tell us.",
    parentNote: "Fossils and rock layers as evidence of the past, with Alberta places such as Dinosaur Provincial Park and Drumheller.",
    standards: ab("3ES1.6", "rock layers, fossils and dinosaurs of Alberta"),
    generate: bankUnit(FOSSILS),
  },
  {
    id: "land-use-ab",
    title: "Farming & Changing the Land",
    emoji: "🌾",
    blurb: "How plants, animals and people change the land.",
    parentNote: "How farming, building, plants and animals change Earth's surface, and how stewardship protects it. Alberta examples include canola, wheat and ranching.",
    standards: ab("3ES1.5", "how plants, animals and people, including farmers, change Earth's surface"),
    generate: bankUnit(FARMING),
  },
  {
    id: "senses-ab",
    title: "Senses & Surviving",
    emoji: "👃",
    blurb: "How plants and animals respond to light, water and danger.",
    parentNote: "How plants and animals sense their surroundings and respond in ways that help them survive.",
    standards: ab("3LS1.3", "how plants and animals sense and respond to their environment"),
    generate: bankUnit(SENSES, { sorts: [SENSE_SORT] }),
  },
  {
    id: "protect-nature-ab",
    title: "Caring for Plants & Animals",
    emoji: "🌿",
    blurb: "Protect the plants and animals near you.",
    parentNote: "How plants and animals in local places depend on each other, and respectful, safe ways to watch and protect them.",
    standards: ab("3LS1.4", "protecting plants and animals in local environments"),
    generate: bankUnit(PROTECT),
  },
  {
    id: "coding-thinking-ab",
    title: "Computational Thinking",
    emoji: "🤖",
    blurb: "Break a task into steps, spot patterns and fix bugs.",
    parentNote: "Computational thinking: breaking tasks into steps, finding patterns, writing clear instructions, fixing mistakes, and thinking of several creative solutions. No screen or coding experience is needed.",
    standards: ab("3CS1.1, 3CS1.2", "computational thinking, clear instructions and creative problem solving"),
    generate: bankUnit(CODE, { sorts: [CODE_SORT], orders: [CODE_ORDER] }),
  },
];
