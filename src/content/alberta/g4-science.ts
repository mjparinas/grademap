import type { SortSet } from "../bank";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import type { Unit } from "../types";
import { ab } from "./kit";

// Alberta Grade 4 science (K–6 curriculum, 2023). Written for the Alberta outcomes on waste, non-contact
// forces (gravity and magnetism), Earth's systems, conservation, objects in space, design and evidence.
// First Nations, Métis and Inuit knowledge is mentioned lightly and in the present tense.

// ---------- Waste and dangerous materials (4M 1.1, 4M 1.2) ----------

const WASTE_SORT: SortSet = {
  prompt: "Is it reducing, reusing or recycling? Tap an item, then tap its basket.",
  hint: "Reduce means use less. Reuse means use it again. Recycle means a material is made into something new.",
  bins: [
    { id: "reduce", label: "reduce", emoji: "➖" },
    { id: "reuse", label: "reuse", emoji: "🔁" },
    { id: "recycle", label: "recycle", emoji: "♻️" },
  ],
  items: [
    { label: "bringing a refillable water bottle", emoji: "🚰", bin: "reduce" },
    { label: "choosing a toy with less packaging", emoji: "🎁", bin: "reduce" },
    { label: "printing on both sides of paper", emoji: "🖨️", bin: "reduce" },
    { label: "keeping crayons in an old jar", emoji: "🫙", bin: "reuse" },
    { label: "passing outgrown boots to a cousin", emoji: "🥾", bin: "reuse" },
    { label: "using a cloth bag again and again", emoji: "👜", bin: "reuse" },
    { label: "putting a cardboard box in the recycling bin", emoji: "📦", bin: "recycle" },
    { label: "taking pop cans to a bottle depot", emoji: "🥫", bin: "recycle" },
    { label: "sorting paper into the paper bin", emoji: "📰", bin: "recycle" },
  ],
};

const RECYCLE_STEPS = order("Put the steps of recycling an aluminum can in order.", "The can is collected, sorted, melted and made into something new.", [
  ["collect the used can", "🥫"],
  ["sort it with other metal", "🧺"],
  ["melt it down", "🔥"],
  ["make new products", "🏭"],
]);

const COMPOST_STEPS = order("Put the steps of making compost in order.", "Food scraps are collected, mixed, broken down, and then the finished compost goes on the soil.", [
  ["collect fruit and vegetable scraps", "🍎"],
  ["mix them with leaves", "🍂"],
  ["decomposers break them down", "🍄"],
  ["add the compost to garden soil", "🌱"],
]);

const WASTE: Item[] = [
  q("What is waste?", "materials that are no longer wanted or used", ["only things that are alive", "only things made of metal", "only things in the ocean"], "Waste can be solid, liquid or gas.", "🗑️"),
  q("Where does most household garbage go in many communities?", "to a landfill", ["into the clouds", "back to the store", "into the sea"], "A landfill is a place where garbage is buried.", "🚛"),
  q("What is one problem with landfills?", "they take up land and can pollute soil and water", ["they make the air cleaner", "they grow food", "they use no space"], "Waste in a landfill can leak or give off gases if it is not managed well.", "🏞️"),
  q("What does it mean to reduce waste?", "to make less of it", ["to burn it", "to bury it deeper", "to hide it"], "Using less means there is less to throw away.", "➖"),
  q("What is compost?", "a soil-like material made when food scraps break down", ["a kind of plastic", "a type of metal", "melted glass"], "Decomposers like worms and fungi turn scraps into rich soil.", "🌱"),
  q("Which item can go in a compost bin?", "apple core", ["plastic bag", "glass jar", "battery"], "Compost is made of plant and food materials that rot.", "🍎"),
  q("What is recycling?", "making old materials into new products", ["throwing things in the lake", "burying things in a yard", "burning things in a campfire"], "Recycling saves materials and energy.", "♻️"),
  q("In Alberta, what do you get back when you return an empty drink container to a bottle depot?", "some of your deposit money", ["a new container", "nothing", "a free drink"], "The deposit encourages people to recycle containers.", "🥤"),
  q("What is it called when you find a new use for something, like making a planter out of an old boot?", "repurposing", ["littering", "burning", "wasting"], "Repurposing gives an item a second life.", "🥾"),
  q("Which way of cutting down waste is best for a lunch?", "use a reusable container", ["use a new plastic bag each day", "throw out half the lunch", "wrap each item twice"], "Reusable containers make less garbage.", "🥪"),
  q("A skull and crossbones on a label warns about…", "poison", ["a sale", "something sweet", "a recycling bin"], "Never touch or taste a product with this symbol.", "☠️"),
  q("A flame on a label means the product is…", "flammable, which means it can catch fire", ["frozen", "tasty", "safe to touch with a candle"], "Keep flammable things away from heat and sparks.", "🔥"),
  q("What should you do if you find a bottle at home with a hazard symbol?", "leave it and tell an adult", ["open it to smell it", "pour it down the sink", "play with it"], "Dangerous materials must be handled by adults.", "🧴"),
  q("Which is a dangerous material that may be found at home?", "bleach", ["milk", "sand", "water"], "Cleaners, paints and some batteries are hazardous.", "🧪"),
  q("Where should old paint or used batteries be taken?", "a household hazardous waste drop-off", ["the kitchen sink", "any garbage can", "a river"], "These materials can harm the environment if they are thrown away with regular garbage.", "🔋"),
  q("Which could you do to start a personal plan to cut waste?", "pack a litter-less lunch", ["buy more packaged snacks", "use a new bag every day", "throw cans in the trash"], "A plan names small steps you can do every day.", "🥕"),
  q("Why does making more things often mean more waste?", "making things uses materials and leaves leftovers", ["things get made out of air", "waste disappears when things are made", "nobody makes things"], "More production and more packaging means more to throw away later.", "🏭"),
  hq("Burning garbage can release gases into the air. Which sphere of Earth does this affect most directly?", "the atmosphere", ["the lithosphere only", "the moon", "the sun"], "Gases from smoke go into the air.", "💨"),
  hq("A community starts a program to collect food scraps for compost. How can this help the environment?", "less waste goes to the landfill", ["more garbage is made", "more land is needed for landfills", "nothing changes"], "Food scraps can be turned into compost instead of being buried.", "🏘️"),
  hq("A label has a picture of a liquid eating through a hand. What does it warn about?", "the product is corrosive and can burn skin", ["the product is good to drink", "the product is a recycling item", "the product is cold"], "Corrosive products can damage skin, eyes and materials.", "⚠️"),
];

// ---------- Gravity and magnets (4E 1.1, 4E 1.2) ----------

const MAGNET_SORT: SortSet = {
  prompt: "Would a magnet pull it? Tap an item, then tap its basket.",
  hint: "Magnets pull things made of iron or steel. Plastic, wood, glass and aluminum are not pulled.",
  bins: [
    { id: "pull", label: "pulled by a magnet", emoji: "🧲" },
    { id: "no", label: "not pulled", emoji: "🚫" },
  ],
  items: [
    { label: "a steel paper clip", emoji: "📎", bin: "pull" },
    { label: "an iron nail", emoji: "🔩", bin: "pull" },
    { label: "a steel screw", emoji: "🔧", bin: "pull" },
    { label: "a steel thumbtack", emoji: "📌", bin: "pull" },
    { label: "a plastic spoon", emoji: "🥄", bin: "no" },
    { label: "a wooden block", emoji: "🪵", bin: "no" },
    { label: "a glass marble", emoji: "🔮", bin: "no" },
    { label: "a ball of aluminum foil", emoji: "⚪", bin: "no" },
  ],
};

const FORCES: Item[] = [
  q("Gravity and magnetism are called non-contact forces. What does that mean?", "they can act without touching", ["they only work when you touch", "they only work in water", "they only work at night"], "Contact forces need touching. Non-contact forces work across a gap.", "🧲"),
  q("What does gravity do?", "pulls objects toward Earth", ["pushes objects into space", "makes objects glow", "makes objects hot"], "That is why things fall when you let go.", "🍎"),
  q("You let go of a ball. What force pulls it down?", "gravity", ["magnetism", "friction only", "wind"], "Gravity pulls things toward the ground.", "⚽"),
  q("Why does a ball you throw straight up come back down?", "gravity pulls it toward Earth", ["it gets tired", "the sky pushes it", "magnets pull it"], "Gravity keeps acting on the ball the whole time.", "🏀"),
  q("What is a magnet?", "an object that attracts some metals", ["a type of rock that floats", "a glowing light", "a kind of battery"], "Magnets pull things made of iron or steel.", "🧲"),
  q("Which two poles do magnets have?", "north and south", ["hot and cold", "up and down", "red and blue"], "Every magnet has a north pole and a south pole.", "🧭"),
  q("What happens when two north poles are brought close together?", "they push apart", ["they pull together", "they melt", "nothing happens at all"], "Like poles repel. Unlike poles attract.", "↔️"),
  q("What happens when a north pole is brought close to a south pole?", "they pull together", ["they push apart", "they turn to gold", "they fall asleep"], "Opposite poles attract.", "🧲"),
  q("What does it mean when we say a magnet repels?", "it pushes away", ["it pulls toward", "it breaks", "it grows"], "Repel means push away. Attract means pull toward.", "↔️"),
  q("Where is a magnet's pull the strongest?", "at its poles", ["in the middle", "far away", "the same everywhere"], "The poles are the ends where the pull is strongest.", "🧲"),
  q("Which material is attracted to a magnet?", "iron", ["wood", "plastic", "paper"], "Iron and steel are magnetic.", "🔩"),
  q("Which test shows if an object is magnetic?", "see if a magnet pulls it", ["weigh it", "paint it", "smell it"], "Test the object with a magnet.", "🔍"),
  q("A magnet can pull a paper clip through a sheet of paper. This shows magnetism…", "works without touching and through some materials", ["only works on paper", "only works under water", "needs electricity"], "The force passes through thin paper.", "📎"),
  q("A magnet picks up a paper clip from 1 cm away but not from 30 cm away. Why?", "the force gets weaker as the distance grows", ["the paper clip got heavier", "the magnet turned off", "gravity stopped"], "Non-contact forces act less as objects get farther apart.", "📏"),
  q("A compass needle points north because…", "Earth acts like a giant magnet", ["the wind blows it", "gravity points north", "the Sun pushes it"], "The needle is a small magnet that lines up with Earth's magnetism.", "🧭"),
  q("Which is a use of magnets?", "holding a fridge door shut", ["growing plants", "making rain", "making sound only"], "The magnet in the door seal sticks to the steel frame.", "🚪"),
  q("What can you do to make a steel nail into a magnet?", "stroke it in one direction with a magnet", ["leave it in the dark", "paint it", "put it in the freezer"], "Rubbing a magnet along the nail lines up its tiny parts.", "🔩"),
  hq("As two objects move farther apart, what happens to the pull of gravity or of a magnet between them?", "it gets weaker", ["it gets stronger", "it stays exactly the same", "it turns into a push"], "Non-contact forces act less as objects get farther apart.", "🌍"),
  hq("On the Moon, a rock would weigh less than on Earth. Why?", "the Moon's gravity is weaker", ["the Moon has more air", "the rock gets smaller", "magnets pull it up"], "The Moon is smaller than Earth and pulls with less force.", "🌙"),
  hq("Two magnets push apart when you try to push them together. What can you say about the poles that face each other?", "they are the same kind of pole", ["they are opposite poles", "they are not magnets", "they have no poles"], "Like poles repel.", "🧲"),
];

// ---------- Earth's systems (4ES 1.1 to 1.3) ----------

const SPHERE_SORT: SortSet = {
  prompt: "Which part of Earth is it? Tap an item, then tap its basket.",
  hint: "The lithosphere is rock and soil. The hydrosphere is water. The atmosphere is the layer of air.",
  bins: [
    { id: "litho", label: "lithosphere", emoji: "⛰️" },
    { id: "hydro", label: "hydrosphere", emoji: "🌊" },
    { id: "atmo", label: "atmosphere", emoji: "💨" },
  ],
  items: [
    { label: "a Rocky Mountain peak", emoji: "🏔️", bin: "litho" },
    { label: "prairie soil", emoji: "🌾", bin: "litho" },
    { label: "gravel in a riverbed", emoji: "🪨", bin: "litho" },
    { label: "the North Saskatchewan River", emoji: "🏞️", bin: "hydro" },
    { label: "a glacier", emoji: "🧊", bin: "hydro" },
    { label: "a lake", emoji: "🌊", bin: "hydro" },
    { label: "the air we breathe", emoji: "🌬️", bin: "atmo" },
    { label: "wind over a field", emoji: "💨", bin: "atmo" },
    { label: "oxygen", emoji: "🫁", bin: "atmo" },
  ],
};

const EARTH: Item[] = [
  q("What are Earth's spheres?", "its main systems: land, air, water and living things", ["the planets in space", "round balls on the ground", "the layers of the Sun"], "The spheres are the lithosphere, atmosphere, hydrosphere and biosphere.", "🌍"),
  q("What is the biosphere?", "all the living things on Earth and where they live", ["only the oceans", "only the air", "only the rocks"], "Bio means life.", "🌳"),
  q("Which sphere is made of rocks, soil and minerals?", "lithosphere", ["atmosphere", "hydrosphere", "biosphere"], "Litho means rock.", "🪨"),
  q("Which sphere is the layer of gases around Earth?", "atmosphere", ["lithosphere", "hydrosphere", "biosphere"], "The atmosphere has the air we breathe.", "💨"),
  q("Which sphere includes all the water on Earth?", "hydrosphere", ["atmosphere", "lithosphere", "biosphere"], "Hydro means water.", "💧"),
  q("Which gas in the atmosphere do we need to breathe?", "oxygen", ["gravel", "salt", "rock"], "Oxygen is part of the air.", "🫁"),
  q("What does the atmosphere do for Earth?", "helps keep temperatures from getting too hot or too cold", ["stops the Sun from shining", "makes the ground flat", "makes water disappear"], "It warms Earth's surface and evens out temperature.", "🌡️"),
  q("Rain falls from clouds into a lake. Which two spheres are interacting?", "atmosphere and hydrosphere", ["lithosphere and biosphere only", "hydrosphere and the Moon", "atmosphere and the Sun only"], "Clouds are in the air. A lake is water.", "🌧️"),
  q("A tree's roots grow into the soil. Which two spheres are interacting?", "biosphere and lithosphere", ["atmosphere and hydrosphere", "hydrosphere only", "the Moon and the Sun"], "The tree is living. The soil is part of the land.", "🌲"),
  q("What gives Earth's surface most of its warmth?", "the Sun", ["the Moon", "the wind", "the clouds"], "Without the Sun, Earth would be too cold for life.", "☀️"),
  q("Sunlight is more direct near the equator than near the poles. What does this mean for the temperature?", "the equator is warmer on average", ["the poles are warmer", "they are the same", "the equator is colder"], "More direct sunlight warms the ground more.", "🌡️"),
  q("In Alberta, which season has the longest daylight?", "summer", ["winter", "fall", "none of them"], "Longer days give plants and animals more sunlight.", "🌞"),
  q("Why do plants and animals need sunlight and warmth?", "they need energy and warmth to live and grow", ["to make sounds", "to travel", "to sleep"], "Plants use sunlight to make food. Animals need warmth too.", "🌻"),
  q("Why do plants and animals need water?", "to meet their basic needs", ["to hide from the Sun", "to make noise", "to grow rocks"], "All living things use water in many ways.", "💧"),
  q("Which is a way to show respect for water in your community?", "keep litter out of rivers and lakes", ["leave the tap running", "pour paint into a stream", "throw trash in the lake"], "Caring for water is a shared responsibility.", "🏞️"),
  q("Many First Nations, Métis and Inuit communities teach that water must be…", "respected and cared for", ["wasted", "ignored", "used up"], "Water is important for all living things, and many communities have teachings about caring for it.", "💧"),
  q("Which is a plant or animal that lives in a body of water?", "a fish", ["a camel", "a rabbit", "a cactus"], "Fish, ducks and pond plants all live in or near water.", "🐟"),
  hq("Snow on Rocky Mountain peaks melts in spring and flows into rivers. Which spheres are part of this?", "atmosphere, lithosphere and hydrosphere", ["only the biosphere", "only the atmosphere", "none of them"], "Snow falls from the air, rests on mountains and becomes river water.", "🏔️"),
  hq("Why is the atmosphere important to the biosphere?", "it has the oxygen living things breathe", ["it is made of rocks", "it has no gas", "it is all water"], "Many living things need oxygen from the air.", "🌍"),
  hq("Why does sunlight warm the poles less than the equator?", "the rays hit at a slant and spread over a bigger area", ["the Sun is smaller there", "the poles are closer to the Sun", "the Sun never shines on the Earth's middle"], "A slanting ray spreads over a bigger area, so each part gets less warmth.", "🧊"),
];

// ---------- Natural resources and conservation (4ES 1.4 to 1.7) ----------

const RESOURCE_SORT: SortSet = {
  prompt: "Where does the resource come from? Tap an item, then tap its basket.",
  hint: "Oil and gravel come from the ground. Lumber and canola come from living things. Drinking water comes from rivers and lakes.",
  bins: [
    { id: "ground", label: "from the ground", emoji: "⛏️" },
    { id: "living", label: "from living things", emoji: "🌾" },
    { id: "water", label: "from water", emoji: "💧" },
  ],
  items: [
    { label: "oil", emoji: "🛢️", bin: "ground" },
    { label: "natural gas", emoji: "🔥", bin: "ground" },
    { label: "gravel", emoji: "🪨", bin: "ground" },
    { label: "lumber from spruce trees", emoji: "🌲", bin: "living" },
    { label: "canola seed", emoji: "🌼", bin: "living" },
    { label: "wheat", emoji: "🌾", bin: "living" },
    { label: "drinking water from a river", emoji: "🚰", bin: "water" },
    { label: "water for irrigating crops", emoji: "💦", bin: "water" },
    { label: "water for a hydroelectric dam", emoji: "⚡", bin: "water" },
  ],
};

const CONSERVE: Item[] = [
  q("What is a natural resource?", "a material from nature that people use to meet needs", ["anything made in a factory", "only gold and silver", "only things in a store"], "Water, soil, trees, oil and minerals are natural resources.", "🌲"),
  q("What is conservation?", "protecting and wisely using Earth's systems and resources", ["using as much as possible", "ignoring nature", "building on every park"], "Conservation helps resources last.", "🌍"),
  q("Which natural resource do Alberta farmers grow that makes fields bright yellow in summer?", "canola", ["rice", "bananas", "cotton"], "Canola is grown on the Prairies for its seeds, which are pressed for oil.", "🌼"),
  q("Which of these is an Alberta natural resource found underground?", "oil", ["lumber", "wheat", "salmon"], "Oil and natural gas are found under the ground in parts of Alberta.", "🛢️"),
  q("Which of these is a natural resource found in northern Alberta forests?", "trees for lumber", ["seashells", "coral", "pineapples"], "Forests give wood and shelter for animals.", "🌲"),
  q("Which was Canada's first national park, created in 1885?", "Banff National Park", ["Elk Island National Park", "Jasper National Park", "Waterton Lakes National Park"], "Banff is in the Rocky Mountains.", "🏔️"),
  q("Which Alberta national park, east of Edmonton, helps protect bison?", "Elk Island National Park", ["Banff National Park", "Jasper National Park", "Waterton Lakes National Park"], "Elk Island is home to herds of plains bison and wood bison.", "🦬"),
  q("Who looks after Canada's national parks?", "Parks Canada", ["a toy company", "a bank", "a TV station"], "Parks Canada works with communities, including First Nations, Métis and Inuit communities.", "🍁"),
  q("Why do some highways near Banff have wildlife overpasses and underpasses?", "so animals can cross safely", ["to make roads longer", "to stop cars from moving", "to hide the highway"], "Crossings protect animals and drivers.", "🐻"),
  q("Which action helps conserve electricity?", "turn off lights when you leave a room", ["leave every light on", "open the fridge for fun", "run every device all night"], "Using less electricity saves resources.", "💡"),
  q("Which action helps conserve water?", "take shorter showers", ["let the tap run while you brush", "water the sidewalk", "leave a hose running"], "Using less water leaves more for people, plants and animals.", "🚿"),
  q("Which action helps reduce waste?", "use reusable containers instead of single-use packaging", ["use a new bag every time", "throw out leftovers", "buy things you do not need"], "Less packaging means less garbage.", "🥕"),
  q("Many First Nations, Métis and Inuit communities practise conservation by…", "taking only what is needed", ["taking as much as possible", "leaving nothing behind", "never using the land"], "Taking only what is needed helps resources last.", "🪶"),
  q("What is irrigation?", "supplying water to crops", ["building a road", "mining coal", "cutting trees"], "Many southern Alberta farms use irrigation.", "💦"),
  q("Solar panels are one way a community can…", "use the Sun's energy to make electricity", ["make rain", "stop the wind", "bury waste"], "Using the Sun's energy can reduce other fuel use.", "☀️"),
  q("A community recycling program helps conservation by…", "saving materials so they can be used again", ["using more raw materials", "burying more items", "making more trash"], "Recycling is a community action.", "♻️"),
  q("If a river is dammed, what might change downstream?", "the water flow and the animals that live there", ["nothing at all", "only the colour of the sky", "the Moon's orbit"], "Changes to water systems affect other systems, like living things.", "🌊"),
  hq("A forest on a hillside burns. Later, heavy rain washes soil into a river. What does this show?", "changes in one system can affect other systems", ["systems never affect each other", "forests cannot burn", "rivers never change"], "Land, water and living things are connected.", "🔥"),
  hq("Why is it important for governments, conservation groups and Indigenous communities to work with Parks Canada?", "they share knowledge and care for the land together", ["so there are no parks", "so nobody can visit", "so animals are removed"], "Working together helps protect natural and cultural places.", "🤝"),
  hq("What makes a good plan to conserve something in your neighbourhood?", "it names a problem, an action and who will do it", ["it only says 'be nice'", "it has no steps", "it asks others to do all the work"], "Plans need clear steps.", "📝"),
];

// ---------- Objects in space (4S 1.1 to 1.3) ----------

const LIGHT_SORT: SortSet = {
  prompt: "Does it make its own light or reflect sunlight? Tap an item, then tap its basket.",
  hint: "Stars, including the Sun, make their own light. Planets and the Moon only shine because they reflect sunlight.",
  bins: [
    { id: "own", label: "makes its own light", emoji: "☀️" },
    { id: "reflect", label: "reflects sunlight", emoji: "🌙" },
  ],
  items: [
    { label: "the Sun", emoji: "☀️", bin: "own" },
    { label: "the North Star", emoji: "⭐", bin: "own" },
    { label: "a star in the Big Dipper", emoji: "✨", bin: "own" },
    { label: "Sirius, the brightest night star", emoji: "🌟", bin: "own" },
    { label: "the Moon", emoji: "🌙", bin: "reflect" },
    { label: "Mars", emoji: "🔴", bin: "reflect" },
    { label: "Jupiter", emoji: "🪐", bin: "reflect" },
    { label: "Venus", emoji: "💫", bin: "reflect" },
  ],
};

const OBSERVE_STEPS = order("Put the steps of observing the night sky in order.", "Choose a safe spot, let your eyes adjust, record what you see, then compare.", [
  ["choose a dark, safe spot", "🌌"],
  ["let your eyes adjust", "👀"],
  ["draw what you see with the date and time", "✏️"],
  ["compare to a star chart", "🗺️"],
]);

const SPACE: Item[] = [
  q("What is the Sun?", "a star", ["a planet", "a moon", "a comet"], "The Sun is the star closest to Earth.", "☀️"),
  q("Why can we see the Moon?", "it reflects light from the Sun", ["it makes its own light", "it is on fire", "it is a lamp"], "The Moon does not make light of its own.", "🌙"),
  q("Why can we not see the stars in the daytime?", "the Sun's bright light fills the sky", ["the stars disappear", "the stars are asleep", "the Moon blocks them"], "The stars are still there. The Sun is much brighter.", "🌞"),
  q("What can you sometimes see in the daytime sky besides the Sun?", "the Moon", ["all the stars", "a comet every day", "the planet Earth"], "The Moon is often visible during the day.", "🌙"),
  q("How can you look at the Sun safely?", "use a certified solar viewer or project its image", ["stare at it for a moment", "use sunglasses only", "look through binoculars"], "Never look straight at the Sun. It can harm your eyes.", "🕶️"),
  q("What is a constellation?", "a pattern of stars that people have named", ["a kind of planet", "a type of moon", "a space rock"], "People have grouped stars into pictures for a very long time.", "✨"),
  q("Which of these is a constellation?", "Orion", ["Venus", "the Moon", "Earth"], "A constellation is a pattern of stars. Orion is easy to spot in winter evenings.", "✨"),
  q("What is special about the North Star?", "it stays in nearly the same place in the northern sky", ["it moves all over the sky", "it is the closest star", "it is a planet"], "Other stars seem to move across the sky as Earth turns.", "⭐"),
  q("The North Star shows which direction?", "north", ["south", "east", "up"], "Travellers have used it to find north.", "🧭"),
  q("Why do the stars seem to move across the night sky?", "Earth is turning", ["the stars are flying around us", "the Sun is pulling them", "the Moon is pushing them"], "Earth spins once a day.", "🌌"),
  q("Which tool helps you see faraway objects in space?", "a telescope", ["a ruler", "a scale", "a thermometer"], "A telescope collects more light so faraway objects look bigger and brighter.", "🔭"),
  q("Which tool can show a model of the night sky indoors?", "a planetarium", ["a microscope", "a spoon", "a compass"], "A planetarium projects stars on a dome.", "🏛️"),
  q("Which of these can you see with your eyes in the night sky?", "stars, the Moon and some planets", ["only the Sun", "only clouds", "nothing at all"], "Bright planets such as Venus and Jupiter can be seen without a telescope.", "🪐"),
  q("How often does the Moon go through all its shapes (phases)?", "about once a month", ["every day", "every year", "every hour"], "A cycle of Moon phases takes about 29 days.", "🌓"),
  q("A calendar that follows the phases of the Moon is called a…", "lunar calendar", ["solar flare", "space calendar", "weather calendar"], "Lunar means having to do with the Moon.", "📅"),
  q("Many cultures have their own names for the stars and the Moon. This shows…", "people have watched the sky for a very long time", ["nobody has looked up", "only one culture knows the stars", "stars have no names"], "People around the world have stories and names for the sky.", "🌌"),
  q("In the fall, days get shorter and many geese fly south. What does this show?", "changes in the sky and seasons are connected to plants and animals", ["geese cause the seasons", "the Moon makes the geese fly", "nothing is connected"], "Animals and plants respond to changes in light and temperature.", "🪿"),
  q("Why is it a good idea to record the date and time when you observe the sky?", "so you can compare it with other nights", ["so you can skip some nights", "so the stars stay still", "it does not matter"], "Recording helps you notice patterns.", "📝"),
  hq("Both Venus and the Moon shine in our sky. What do they have in common?", "they reflect light from the Sun", ["they are both stars", "they both make their own light", "they are both comets"], "Planets and moons are lit by the Sun.", "💫"),
  hq("How is our standard calendar different from a lunar calendar?", "it is based on Earth's trip around the Sun, not the Moon's phases", ["it has no days", "it counts the stars", "it is only for farmers"], "A year is about one trip around the Sun. A lunar month is one cycle of the Moon.", "📅"),
  hq("Why can a star be used for navigation?", "its position in the sky helps show direction", ["it tells the time only", "it sings", "it changes colour for each city"], "The North Star shows north.", "🧭"),
];

// ---------- Design process (4CS 1.1) ----------

const DESIGN_STEPS = order("Put the design process steps in order.", "Start with a problem, think of ideas, build a model, test it and improve it.", [
  ["name the problem", "❓"],
  ["brainstorm ideas", "💡"],
  ["build a model (prototype)", "🛠️"],
  ["test it", "🧪"],
  ["improve it", "🔁"],
]);

const ALGORITHM_STEPS = order("A robot makes a sandwich. Put its instructions in order.", "Instructions must be in the right order for the task to work.", [
  ["take out two slices of bread", "🍞"],
  ["spread butter on one slice", "🧈"],
  ["add the filling", "🧀"],
  ["put the other slice on top", "🥪"],
]);

const DESIGN: Item[] = [
  q("What is a design problem?", "a need that people can solve by making or improving something", ["a mistake in spelling", "a rule that cannot change", "a prize"], "Design starts with a need.", "💡"),
  q("What is a prototype?", "a first model that you build and test", ["the final product only", "a picture only", "a warning"], "Prototypes help you find what works.", "🛠️"),
  q("After you test a prototype and find a problem, what comes next?", "improve the design and test again", ["give up", "hide the results", "paint it"], "Designers test and improve again and again.", "🔁"),
  q("What are criteria in a design task?", "the things your design must do", ["the colours you like", "the names of the builders", "the price of the table"], "For example, a bridge must hold 5 books.", "✅"),
  q("What is a constraint?", "a limit, like time, cost or materials", ["a free gift", "an extra tool", "a prize"], "You cannot always use everything you want.", "⛓️"),
  q("A paper bridge is supposed to hold 10 books but holds 6. What should the designer do?", "change the design and test it again", ["say the test was wrong", "add 10 more books", "stop designing"], "Testing shows what to improve.", "🌉"),
  q("Why do designers brainstorm many ideas?", "the best idea may not be the first one", ["so they can skip testing", "so they can copy others", "to waste time"], "More ideas mean more choices.", "🧠"),
  q("What is an algorithm?", "a set of step-by-step instructions", ["a computer virus", "a kind of battery", "a drawing tool"], "A recipe is an algorithm for cooking.", "📋"),
  q("What does it mean to debug a program?", "to find and fix a mistake", ["to make it longer", "to turn it off forever", "to paint it"], "Bugs are mistakes in the instructions.", "🐞"),
  q("A robot must “step forward, clap” four times. Which instruction uses a loop?", "repeat 4 times: step forward, clap", ["step forward, clap, step forward, clap, step forward, clap", "clap, clap, clap, clap", "step forward 4"], "A loop repeats the same steps so you do not have to write them out each time.", "🤖"),
  q("Why should design instructions be exact?", "a computer follows them exactly as written", ["computers guess what you mean", "computers ignore steps", "computers write their own steps"], "Computers need clear steps.", "💻"),
  q("Which of these is technology that solves a problem?", "a bicycle helmet", ["a rainbow", "a cloud", "a rock in a field"], "Technology is something people design to meet a need.", "⛑️"),
  q("Why is it a good idea to draw a plan before you build?", "it helps you think through your design", ["it makes the project last longer", "it hides mistakes", "it skips testing"], "A plan helps you see problems early.", "✏️"),
  q("A tower falls over in a test. What does that tell you?", "the design needs to change", ["the test is not allowed", "the tower is perfect", "towers cannot be tested"], "A failed test is useful information.", "🗼"),
  q("Which is a good way to share a finished design?", "explain what it does and how you tested it", ["hide it", "say nothing", "only show the picture"], "Sharing helps others learn from your work.", "🎤"),
  q("Breaking a big problem into smaller parts is called…", "decomposing the problem", ["ignoring the problem", "adding more problems", "painting the problem"], "Small parts are easier to solve one at a time.", "🧩"),
  hq("A design must be light, strong and cheap. Which of these is a trade-off?", "making it stronger may make it heavier or cost more", ["making it cheaper always makes it stronger", "weight does not matter", "there are no trade-offs"], "Good designers balance what matters most.", "⚖️"),
  hq("A sensor turns on a light when it gets dark. Which sequence describes the algorithm?", "if it is dark, turn the light on", ["turn the light on forever", "if it is bright, turn the light off and on", "ignore the sensor"], "An 'if' step checks a condition.", "💡"),
  hq("Which result best shows that a new design is better than the old one?", "it did the job better in the same test", ["it looks bigger", "it has more colours", "its builder likes it more"], "Fair tests give evidence about which design is better.", "📊"),
  q("A design must be safe. What does that mean?", "it will not hurt people when they use it", ["it is painted red", "it costs a lot", "it is very small"], "Safety is an important design requirement.", "🦺"),
  q("A group builds a model car. Why do they test it more than once?", "to see if it works every time", ["to use up the materials", "because they forgot", "to make it slower"], "Repeated tests give more trustworthy results.", "🚗"),
  q("Which question could guide a designer?", "Who will use this and what do they need?", ["What colour is my pen?", "What time is lunch?", "How tall is the door?"], "Good design starts with the user's needs.", "🧑‍🤝‍🧑"),
  q("A designer changes one thing at a time when testing. Why?", "to know which change made the difference", ["to make it slower", "so there is less to write", "because changing two is not allowed"], "A fair test changes only one thing.", "⚖️"),
  q("In a loop, instructions are…", "repeated", ["deleted", "skipped", "hidden"], "A loop repeats steps, so you do not write them again and again.", "🔁"),
  q("A robot is told to go forward 2 steps, turn right, go forward 2 steps. If it ends up in the wrong place, what do you do?", "look for the bug and fix the instructions", ["blame the floor", "say the robot is bad", "give up on robots"], "Debugging means checking each step.", "🤖"),
  q("Which material would be best to test a tall tower made of paper tubes?", "tape and paper", ["a bowl of water", "a pillow", "ice cream"], "Choose materials that fit the design.", "🗼"),
  q("Why are drawings and labels useful in a design?", "others can see how it works", ["they make the model heavier", "they are required in every game", "they hide mistakes"], "Labelled sketches share your thinking.", "✏️"),
  q("A sequence in a program is…", "steps done in order", ["steps done at random", "steps never done", "steps done backwards by accident"], "Order matters in an algorithm.", "📋"),
  q("When designers test, they should record…", "what happened, honestly", ["only the good results", "nothing", "only their guess"], "Honest records help you improve.", "📓"),
  q("After building a prototype of a bird feeder, the designer notices the seed spills. A good next step is…", "change the design so seed stays inside", ["throw out the seed", "stop designing", "paint it blue"], "Use what you learn from testing to make it better.", "🐦"),
  hq("A team tests a boat, and it tips over. Which statement is a helpful improvement idea?", "make the bottom wider so it is more stable", ["make it taller", "add more weight on one side", "remove the bottom"], "A wide base helps boats stay steady.", "⛵"),
];

// ---------- Evidence and data (4SM 1.1, 4SM 1.2) ----------

const OBSERVE_SORT: SortSet = {
  prompt: "Is it an observation or an inference? Tap an item, then tap its basket.",
  hint: "An observation is what you see, hear, feel or measure. An inference is a sensible idea about why.",
  bins: [
    { id: "obs", label: "observation", emoji: "👀" },
    { id: "inf", label: "inference", emoji: "💭" },
  ],
  items: [
    { label: "the plant is 12 cm tall", emoji: "🌱", bin: "obs" },
    { label: "the soil feels dry", emoji: "🪴", bin: "obs" },
    { label: "the magnet picked up 5 paper clips", emoji: "🧲", bin: "obs" },
    { label: "the water measured 20 degrees", emoji: "🌡️", bin: "obs" },
    { label: "the plant needs more water", emoji: "💧", bin: "inf" },
    { label: "a rabbit made these tracks", emoji: "🐇", bin: "inf" },
    { label: "the magnet must be strong", emoji: "💪", bin: "inf" },
    { label: "it was cold in the night", emoji: "❄️", bin: "inf" },
  ],
};

const EVIDENCE: Item[] = [
  q("What is evidence in science?", "information from observations or measurements", ["a guess with no data", "an opinion only", "a rumour"], "Evidence helps show whether an idea is true.", "🔍"),
  q("What is an observation?", "something you notice with your senses or tools", ["a guess about the future", "a wish", "a rule"], "You can see, hear, touch or measure.", "👀"),
  q("What is an inference?", "an idea you work out from what you observed", ["a measurement", "a photo", "a recipe"], "Inferences go beyond what you directly saw.", "💭"),
  q("You see small paw prints in the snow. Which is an inference?", "a fox walked here", ["the prints are small", "the snow is white", "there are four toe marks"], "An inference uses clues to make an idea.", "🐾"),
  q("What makes a test fair?", "change only one thing and keep the rest the same", ["change everything at once", "use different tools each time", "test only once"], "A fair test lets you see what caused the result.", "⚖️"),
  q("Why do scientists repeat a test several times?", "to check the results are reliable", ["to make it longer", "to hide mistakes", "to change the question"], "Repeating gives more evidence.", "🔁"),
  q("Which tool measures length?", "a ruler", ["a thermometer", "a stopwatch", "a measuring cup"], "Choose the tool that fits what you measure.", "📏"),
  q("Which tool measures temperature?", "a thermometer", ["a ruler", "a scale", "a clock"], "A thermometer shows how warm or cold something is.", "🌡️"),
  q("A group grew bean plants in light and in the dark. Which result is the best evidence that plants need light?", "the plants in the dark were pale and short", ["all plants grew the same", "the plants in light were in a bigger pot", "nobody measured"], "The evidence supports the claim.", "🌱"),
  q("Why is a data table useful?", "it keeps measurements neat so you can compare", ["it hides the numbers", "it makes the test unfair", "it replaces the experiment"], "Tables and graphs show patterns.", "📊"),
  q("What can a bar graph show?", "how amounts compare", ["only the date", "a person's age", "the weather forecast only"], "Taller bars mean bigger amounts.", "📊"),
  q("Why do scientists share their evidence?", "so others can check it and learn from it", ["to win a prize only", "to keep it secret", "because nobody cares"], "Shared evidence helps everyone.", "🤝"),
  q("Which source of information is more reliable?", "a measurement taken with a tool and written down", ["a guess from memory", "a rumour", "a story with no source"], "Careful measurements are better evidence.", "📏"),
  q("A scientist finds new evidence that does not match an idea. What may happen?", "the idea can change", ["the evidence is thrown away", "science stops", "nobody listens"], "Science changes when new evidence is found.", "🔄"),
  q("Many First Nations, Métis and Inuit communities hold knowledge built from…", "careful observation over many generations", ["guessing", "one afternoon", "reading one book"], "Elders and knowledge keepers share what they have observed over a very long time.", "🪶"),
  q("A student measures plant height every week. What should they record each time?", "the date and the measurement", ["only the colour of the pot", "only the person's name", "nothing"], "A record lets you see change over time.", "📅"),
  q("Which is a good question for an investigation?", "Does the amount of water change how tall a bean plant grows?", ["Is it nice?", "What is magic?", "Who is the best?"], "A good question can be tested.", "❓"),
  hq("Two groups tested paper towels. One used 100 mL of water and the other used 50 mL. Why is this unfair?", "the amount of water was not the same", ["both groups used paper towels", "both groups wrote notes", "both used a table"], "Everything except the thing you test must stay the same.", "🧻"),
  hq("A claim says: 'Heavier objects fall faster.' A test drops a heavy ball and a light ball together and they land at the same time. What does the evidence suggest?", "weight alone does not decide how fast they fall", ["the claim is proved", "the test is useless", "gravity is turned off"], "Evidence can show that a claim is not fully correct.", "🏀"),
  hq("Why is one measurement not always enough?", "it could be a mistake, so repeating helps", ["measuring is not allowed", "numbers cannot be trusted at all", "scientists never repeat"], "Repeating checks that results are consistent.", "🔬"),
];

export const units: Unit[] = [
  {
    id: "waste-and-materials-ab",
    title: "Waste & Dangerous Materials",
    emoji: "♻️",
    blurb: "Reduce, reuse, recycle and stay safe around hazards",
    standards: ab("4M 1.1, 4M 1.2", "managing waste, its environmental effects, and dangerous materials and their symbols"),
    parentNote: "Children compare ways to manage waste (landfills, recycling, composting, repairing and reusing), plan to cut their own waste, and learn hazard symbols and why dangerous household materials need an adult and safe disposal.",
    generate: bankUnit(WASTE, { sorts: [WASTE_SORT], orders: [RECYCLE_STEPS, COMPOST_STEPS] }),
  },
  {
    id: "gravity-and-magnets-ab",
    title: "Gravity & Magnets",
    emoji: "🧲",
    blurb: "Forces that work without touching",
    standards: ab("4E 1.1, 4E 1.2", "non-contact forces: gravity and magnetism, magnetic poles and magnetic materials"),
    parentNote: "Gravity pulls objects toward Earth. Magnets have a north and south pole; like poles repel and unlike poles attract. Children learn which materials are magnetic and that non-contact forces get weaker with distance.",
    generate: bankUnit(FORCES, { sorts: [MAGNET_SORT] }),
  },
  {
    id: "earth-systems-ab",
    title: "Earth's Systems",
    emoji: "🌍",
    blurb: "Land, air, water and living things work together",
    standards: ab("4ES 1.1, 4ES 1.2, 4ES 1.3", "Earth's four spheres, the Sun's warmth and light, and the importance of water"),
    parentNote: "Earth's land (lithosphere), air (atmosphere), water (hydrosphere) and living things (biosphere) interact. Children learn how the Sun warms Earth, why sunlight differs by place and season, and why water matters to every living thing.",
    generate: bankUnit(EARTH, { sorts: [SPHERE_SORT] }),
  },
  {
    id: "conservation-ab",
    title: "Resources & Conservation",
    emoji: "🌲",
    blurb: "Alberta's natural resources and how we care for them",
    standards: ab("4ES 1.4, 4ES 1.5, 4ES 1.6, 4ES 1.7", "interconnections among Earth's systems, Alberta's natural resources, parks and conservation actions"),
    parentNote: "Natural resources such as water, soil, trees, oil and farm crops meet human needs. Children learn how changes in one system affect others, how parks protect land and animals, and how people, communities and Indigenous communities conserve resources.",
    generate: bankUnit(CONSERVE, { sorts: [RESOURCE_SORT] }),
  },
  {
    id: "space-and-sky-ab",
    title: "Space & the Sky",
    emoji: "🔭",
    blurb: "Watch the Sun, Moon, planets and stars",
    standards: ab("4S 1.1, 4S 1.2, 4S 1.3", "observing the Sun, Moon, planets and stars, constellations and navigation, and calendars"),
    parentNote: "The Sun is a star; the Moon and planets reflect its light. Children learn safe sky watching, constellations, the North Star, tools for viewing space, and how lunar and standard calendars differ.",
    generate: bankUnit(SPACE, { sorts: [LIGHT_SORT], orders: [OBSERVE_STEPS] }),
  },
  {
    id: "design-process-ab",
    title: "Design & Computational Thinking",
    emoji: "🛠️",
    blurb: "Plan, build, test and improve a solution",
    standards: ab("4CS 1.1", "the design process, prototypes, testing and step-by-step instructions"),
    parentNote: "Children practise the steps of design (name a problem, brainstorm, build a prototype, test, improve) and basic computer-science ideas such as algorithms, loops and debugging.",
    generate: bankUnit(DESIGN, { orders: [DESIGN_STEPS, ALGORITHM_STEPS] }),
  },
  {
    id: "evidence-and-data-ab",
    title: "Evidence & Data",
    emoji: "📊",
    blurb: "Observe, measure and decide what the evidence shows",
    standards: ab("4SM 1.1, 4SM 1.2", "observations, inferences, fair tests and using data as evidence"),
    parentNote: "Children tell observations from inferences, plan fair tests, record data, and see how evidence supports or changes an idea. This also builds the skills used in every other science unit.",
    generate: bankUnit(EVIDENCE, { sorts: [OBSERVE_SORT] }),
  },
];
