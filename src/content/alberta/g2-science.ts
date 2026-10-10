import type { Unit } from "../types";
import { ab } from "./kit";
import { order, q, sorter, unitOf, type Item } from "../ontario/k-g2-kit";

// Alberta Grade 2 science (2023): Materials, Light and Sound, Earth (landforms, water, the Sun), Growth and
// Development of Plants and Animals, Computer Science (instructions), and the nature of science.
// BC and Ontario units that fit are shared in g2.ts; the units below cover the rest.
// First Nations, Métis and Inuit examples are kept light, in the present tense, and name specific peoples.

// ---------- Materials ----------

const MATERIAL_SORT = {
  prompt: "Is it a natural or a processed material? Tap an item, then tap its basket.",
  hint: "Natural materials come from plants, animals, the land or the sky. Processed materials are made by people, starting from natural ones.",
  bins: [
    { id: "natural", label: "natural", emoji: "🌿" },
    { id: "processed", label: "processed", emoji: "🏭" },
  ],
  items: [
    { label: "wood from a tree", emoji: "🪵", bin: "natural" },
    { label: "wool from a sheep", emoji: "🐑", bin: "natural" },
    { label: "clay from the ground", emoji: "🟤", bin: "natural" },
    { label: "cotton from a plant", emoji: "☁️", bin: "natural" },
    { label: "plastic", emoji: "🧴", bin: "processed" },
    { label: "glass", emoji: "🥛", bin: "processed" },
    { label: "paper", emoji: "📄", bin: "processed" },
    { label: "metal sheeting", emoji: "🥫", bin: "processed" },
  ],
};

const MATERIALS: Item[] = [
  q("Where do natural materials come from?", "plants, animals, the land or the sky", ["only from factories", "only from stores"], "Wood, wool, stone and clay are all natural."),
  q("Which one is a processed material?", "plastic", ["a pebble", "a feather"], "People make plastic. A pebble and a feather are natural.", { emoji: "🧴" }),
  q("Paper is made from wood. Paper is…", "a processed material", ["a natural material", "not a material"], "People turn trees into paper, so paper is processed."),
  q("All processed materials started as…", "natural materials", ["nothing at all", "toys"], "Glass starts as sand. Plastic starts from oil. Paper starts from trees.", { d: 2 }),
  q("Glass lets light pass through it. This property is called…", "transparent", ["bendy", "soft"], "A transparent material lets you see through it.", { emoji: "🪟" }),
  q("Which material is transparent?", "a clear window", ["a wooden door", "a metal pot"], "You can see through a window.", { d: 2 }),
  q("Which material soaks up water?", "a sponge", ["a plastic cup", "a glass jar"], "Absorbent materials take in water."),
  q("Which material would be best for a raincoat?", "plastic that water cannot soak into", ["a paper towel", "a sponge"], "A raincoat needs to keep water out.", { d: 2 }),
  q("Which material is best for a cozy winter hat?", "wool", ["glass", "metal"], "Wool is soft and warm.", { emoji: "🧶" }),
  q("A clay pot can be shaped when it is wet. This property is called being…", "easy to shape", ["see-through", "very bouncy"], "Clay can be pressed and shaped.", { d: 2 }),
  q("A canoe can be made from wood. Can it also be made from aluminium?", "Yes", ["No", "Only from paper"], "One kind of object can be made from different materials.", { d: 2 }),
  q("A boat needs to float. Which material is a good choice?", "wood", ["a rock", "a solid iron bar"], "Wood floats on water.", { d: 2 }),
  q("You want to make a window for a bird house. Which material is best?", "clear plastic", ["wood", "foil"], "You need to see through a window.", { d: 3 }),
  q("A teacher, a carpenter and an engineer all use knowledge about…", "which materials are best for a job", ["only the weather", "only music"], "People in many jobs choose materials carefully.", { d: 3 }),
  q("Some Dene people make baskets from birchbark. Birchbark is…", "a natural material", ["a processed material", "a plastic"], "Birchbark comes from a tree.", { d: 2 }),
  q("An ulu is a knife with a curved blade that some Inuit use for cutting and scraping. The blade can be made of…", "metal or stone", ["paper only", "jelly"], "A cutting tool needs a hard, strong material.", { d: 3 }),
  q("Which two properties help you pick a material for a rain boot?", "waterproof and bendy", ["see-through and heavy", "sticky and sweet"], "Boots must keep water out and bend as you walk.", { d: 3 }),
  q("You want to measure a pencil with paper clips. This is…", "non-standard measuring", ["not measuring", "standard measuring"], "Everyday objects can be used to measure length. Rulers use standard units.", { d: 2 }),
  q("Which is the best way to find out if a material is waterproof?", "put a few drops of water on it", ["look at it only", "smell it"], "Test the material to find out."),
];

// ---------- Light and sound ----------

const SOURCE_SORT = {
  prompt: "Does it make light or sound? Tap an item, then tap its basket.",
  hint: "A light source gives off light. A sound source makes a sound by vibrating.",
  bins: [
    { id: "light", label: "light source", emoji: "💡" },
    { id: "sound", label: "sound source", emoji: "🔊" },
  ],
  items: [
    { label: "the Sun", emoji: "☀️", bin: "light" },
    { label: "a campfire", emoji: "🔥", bin: "light" },
    { label: "a lamp that is on", emoji: "💡", bin: "light" },
    { label: "a firefly", emoji: "✨", bin: "light" },
    { label: "a drum being hit", emoji: "🥁", bin: "sound" },
    { label: "a barking dog", emoji: "🐕", bin: "sound" },
    { label: "a guitar string", emoji: "🎸", bin: "sound" },
    { label: "a speaker", emoji: "🔊", bin: "sound" },
  ],
};

const LIGHT_SOUND: Item[] = [
  q("What makes a sound?", "something vibrating", ["something very still", "something cold"], "Vibration is a rapid back-and-forth movement.", { emoji: "🔔" }),
  q("A drum is hit. The drum skin moves back and forth fast. This is called…", "vibrating", ["freezing", "melting"], "Vibrations make sound.", { d: 2 }),
  q("The Sun is…", "a source of light", ["a source of sound", "not a source of anything"], "The Sun gives off light.", { emoji: "☀️" }),
  q("Which one is a source of light?", "a campfire", ["a rock", "a blanket"], "Fire gives off light.", { emoji: "🔥" }),
  q("Which one is NOT a source of light?", "the Moon", ["the Sun", "a flashlight"], "The Moon only reflects light from the Sun. It does not make its own.", { d: 2 }),
  q("Fireflies make their own light. Is a firefly a source of light?", "Yes", ["No", "Only at noon"], "Some living things make light, like fireflies.", { d: 2 }),
  q("Which is a sound made by an animal?", "a wolf's howl", ["a wind chime", "a ringing phone"], "Animals use their bodies to make sounds.", { emoji: "🐺" }),
  q("Light usually travels in…", "straight lines", ["zigzags", "circles"], "Light goes straight from its source until it hits something."),
  q("A mirror makes light…", "bounce off it", ["disappear", "turn into sound"], "Light bounces off shiny surfaces. This is called reflection.", { d: 2, emoji: "🪞" }),
  q("You shine a flashlight at a wooden block. What happens behind the block?", "A shadow forms", ["It gets brighter", "Nothing changes at all"], "The block blocks the light's path, so a shadow forms.", { d: 2 }),
  q("Which material makes a shadow?", "a book", ["clear glass", "clean air"], "Light cannot pass through a book. Shadows form where light is blocked.", { d: 3 }),
  q("You hear a sound from far away. The sound travelled through…", "the air", ["a wall of light", "nothing at all"], "Sound travels from its source through air and other things.", { d: 2 }),
  q("A soft pillow over a loud bell makes the sound…", "quieter", ["louder", "higher"], "Soft materials absorb sound.", { d: 3 }),
  q("When you shout in an empty gym, you hear an echo. The sound…", "bounces off the walls", ["gets stuck in the floor", "turns into light"], "Sound can bounce off hard surfaces.", { d: 3 }),
  q("Put your fingers on your throat and hum. You feel…", "a vibration", ["a freeze", "a magnet"], "Your vocal cords vibrate to make sound.", { d: 2 }),
  q("Which one makes a loud sound?", "a drum", ["a pillow", "a cloud"], "Hitting a drum makes it vibrate strongly."),
  q("Which is a safe way to look at light?", "Never look right at the Sun", ["Stare at the Sun", "Use a magnifier on the Sun"], "The Sun can hurt your eyes. Stay safe.", { d: 2 }),
];

// ---------- Landforms and Earth ----------

const LANDFORM_SORT = {
  prompt: "Is it a landform or a body of water? Tap an item, then tap its basket.",
  hint: "A landform is a natural shape of the land, such as a hill. A body of water is water such as a lake or a river.",
  bins: [
    { id: "land", label: "landform", emoji: "⛰️" },
    { id: "water", label: "body of water", emoji: "💧" },
  ],
  items: [
    { label: "a mountain", emoji: "🏔️", bin: "land" },
    { label: "a valley", emoji: "🏞️", bin: "land" },
    { label: "a hill", emoji: "⛰️", bin: "land" },
    { label: "a prairie", emoji: "🌾", bin: "land" },
    { label: "a lake", emoji: "🏞️", bin: "water" },
    { label: "a river", emoji: "🌊", bin: "water" },
    { label: "a wetland", emoji: "🦆", bin: "water" },
    { label: "an ocean", emoji: "🐳", bin: "water" },
  ],
};

const LANDFORMS: Item[] = [
  q("A landform is…", "a natural feature of Earth's surface", ["a toy", "a kind of weather"], "Mountains, hills and valleys are landforms."),
  q("Which is a landform?", "a mountain", ["a bridge", "a school"], "People build bridges and schools. A mountain is a natural feature.", { emoji: "🏔️" }),
  q("Which landform is very high, steep and rocky?", "a mountain", ["a valley", "a prairie"], "Alberta's Rocky Mountains are in the west.", { d: 2 }),
  q("A valley is…", "low land between hills or mountains", ["the top of a mountain", "a kind of lake"], "Valleys lie between higher land.", { d: 2 }),
  q("Which landform is mostly flat, with grass?", "a prairie", ["a mountain", "a glacier"], "The prairies stretch across southern and central Alberta.", { emoji: "🌾" }),
  q("A hill is like a small…", "mountain", ["lake", "river"], "Hills are rounded and not as tall as mountains.", { d: 2 }),
  q("Which words could describe a landform?", "hilly, rocky, steep or flat", ["loud, quiet or soft", "sweet or sour"], "Landforms can be described by how they look and feel.", { d: 2 }),
  q("Where in Alberta would you find the Rocky Mountains?", "in the west", ["in the middle of a lake", "at the very top of the sky"], "The Rockies run along Alberta's western edge, next to British Columbia.", { d: 2 }),
  q("Banff and Jasper are national parks in the…", "Rocky Mountains", ["Arctic", "ocean"], "Both are in the Rocky Mountains of Alberta.", { d: 2 }),
  q("Dinosaur Provincial Park is a UNESCO World Heritage Site. It is known for…", "dinosaur fossils and badlands", ["glaciers", "sandy beaches"], "Many dinosaur fossils have been found in its dry hills.", { d: 3 }),
  q("Wood Buffalo National Park is a UNESCO World Heritage Site that is home to…", "wild bison", ["penguins", "palm trees"], "It is a big park in northern Alberta and the Northwest Territories.", { d: 3 }),
  q("Head-Smashed-In Buffalo Jump is a UNESCO World Heritage Site in southern Alberta. It is a…", "special place near a cliff where people hunted bison", ["beach resort", "space station"], "It is an important place to the Blackfoot people.", { d: 3 }),
  q("Earth has land, water, air, plants, animals and…", "people", ["only rocks", "only ice"], "All the parts of Earth work together to support life."),
  q("Which part of Earth do we breathe?", "air", ["water", "land"], "We need air to breathe.", { d: 2 }),
  q("Which part of Earth do plants grow in?", "land", ["air only", "ice only"], "Plants root in soil on the land.", { d: 2 }),
  q("A flat, high area of land is called a…", "plateau", ["valley", "river"], "A plateau is flat on top and higher than the land around it.", { d: 3 }),
  q("Why is it good to keep landforms clean?", "so plants, animals and people can enjoy them", ["so garbage can pile up", "so nothing lives there"], "Caring for the land helps living things.", { d: 2 }),
  q("When you look at a map of Alberta, mountains are in the…", "west", ["east", "centre"], "Mountains are on Alberta's western border. Prairies spread across the south and east.", { d: 3 }),
];

// ---------- Bodies of water ----------

const WATERS_SORT = {
  prompt: "Fresh water or salt water? Tap an item, then tap its basket.",
  hint: "Oceans and seas have salt water. Rivers, most lakes, wetlands and glaciers have fresh water.",
  bins: [
    { id: "fresh", label: "fresh water", emoji: "🥤" },
    { id: "salt", label: "salt water", emoji: "🧂" },
  ],
  items: [
    { label: "the Pacific Ocean", emoji: "🌊", bin: "salt" },
    { label: "the Atlantic Ocean", emoji: "🌊", bin: "salt" },
    { label: "a sea", emoji: "🐠", bin: "salt" },
    { label: "a glacier", emoji: "🧊", bin: "fresh" },
    { label: "a river", emoji: "🏞️", bin: "fresh" },
    { label: "a wetland", emoji: "🦆", bin: "fresh" },
    { label: "Lake Louise", emoji: "🏔️", bin: "fresh" },
  ],
};

const FLOW_ORDER = order("Put the water's trip in order, from the smallest to the biggest.", "Small creeks join to make streams. Streams join to make rivers. Big rivers flow to the ocean.", [
  ["a small creek", "💧"],
  ["a stream", "🏞️"],
  ["a river", "🌊"],
  ["the ocean", "🐳"],
]);

const WATERS: Item[] = [
  q("Which one is a body of water?", "a lake", ["a hill", "a prairie"], "Lakes are bodies of water.", { emoji: "🏞️" }),
  q("Most of Earth's surface is covered by…", "water", ["land", "glaciers only"], "Water covers more of Earth than land does."),
  q("Which of these is a body of water in Alberta?", "the Bow River", ["the Pacific Ocean", "the Nile"], "The Bow River flows through Calgary.", { d: 2 }),
  q("The North Saskatchewan River flows through which Alberta city?", "Edmonton", ["Lethbridge", "Jasper"], "Edmonton sits along the North Saskatchewan River valley.", { d: 3 }),
  q("Which body of water is a big river of ice?", "a glacier", ["a wetland", "an ocean"], "Glaciers are huge, slow-moving masses of ice. Alberta's Athabasca Glacier is in the Rockies.", { d: 2 }),
  q("Which has salt water?", "an ocean", ["a river", "a glacier"], "Oceans and seas have salty water.", { emoji: "🌊" }),
  q("Which has fresh water?", "most lakes", ["the ocean", "a sea"], "Most lakes, rivers and wetlands have fresh water.", { d: 2 }),
  q("Water on land flows…", "downhill", ["uphill", "only sideways"], "Gravity pulls water downhill."),
  q("Small streams that join together make…", "a larger stream or river", ["a mountain", "a desert"], "Water from many streams meets in bigger rivers.", { d: 2 }),
  q("Rivers usually flow into a larger body of water, such as a lake or…", "an ocean", ["a hill", "a field"], "Rivers carry water downhill to larger bodies of water.", { d: 2 }),
  q("A wetland is a place where…", "land is soaked with water and many animals live", ["there is no water", "only sand grows"], "Wetlands are home to ducks, frogs and many plants.", { d: 2 }),
  q("Ducks, frogs and reeds are often found in…", "a wetland", ["a mountain peak", "a desert"], "Wetlands give shelter and food to many living things.", { d: 3 }),
  q("Why should we keep our rivers clean?", "People, plants and animals need clean water", ["Rivers are only for garbage", "No one uses rivers"], "Clean water helps living things stay healthy."),
  q("Lake Louise is in the…", "Rocky Mountains", ["Arctic Ocean", "Sahara"], "Lake Louise is a beautiful mountain lake in Banff National Park.", { d: 3 }),
  q("Which body of water is usually the biggest?", "an ocean", ["a creek", "a pond"], "Oceans are huge and hold salt water.", { d: 2 }),
  q("Which is NOT a body of water?", "a plateau", ["a lake", "a river"], "A plateau is a landform.", { d: 3 }),
  q("On a map, bodies of water are usually drawn in…", "blue", ["red", "black"], "Blue is the colour usually used for water."),
];

// ---------- Day and year ----------

const DAYNIGHT: Item[] = [
  q("What gives Earth light and warmth?", "the Sun", ["the Moon", "the stars"], "The Sun is our nearest star.", { emoji: "☀️" }),
  q("When your part of Earth faces the Sun, it is…", "day", ["night", "winter"], "Daytime is when our side of Earth faces the Sun."),
  q("When your part of Earth faces away from the Sun, it is…", "night", ["day", "summer"], "Night happens on the side facing away from the Sun."),
  q("Earth spins around once about every…", "24 hours", ["1 hour", "7 days"], "One full spin is one day.", { d: 2 }),
  q("A day is the time it takes Earth to…", "spin once", ["fly around the Moon", "stop moving"], "Earth rotates (spins) once in one day.", { d: 2 }),
  q("A year is the time it takes Earth to…", "go all the way around the Sun", ["spin once", "stop moving"], "Earth revolves around the Sun once a year.", { d: 2 }),
  q("How many days are in a year?", "about 365", ["about 30", "about 100"], "There are 365 days in most years.", { d: 2 }),
  q("When it is night in Alberta, the Sun is…", "shining on the other side of Earth", ["gone forever", "behind the Moon"], "It is daytime on the opposite side of Earth.", { d: 3 }),
  q("Why do we have day and night?", "Earth spins", ["The Sun goes out", "The Moon blocks the Sun every day"], "As Earth rotates, our side turns toward and away from the Sun.", { d: 2 }),
  q("In Alberta, the sun seems to rise in the…", "east", ["west", "south"], "The Sun appears to rise in the east and set in the west.", { d: 3 }),
  q("Earth's trip around the Sun takes…", "one year", ["one day", "one week"], "One year equals one trip around the Sun.", { d: 2 }),
  q("Which is longer: a day or a year?", "a year", ["a day", "They are the same"], "A year has about 365 days."),
  q("Your shadow is longest in…", "the early morning and late afternoon", ["the middle of the night", "the middle of the day only"], "When the Sun is low, shadows are long.", { d: 3 }),
];

// ---------- Instructions ----------

const INSTR_SORT = {
  prompt: "Planting a seed: is the step near the start or the end? Tap an item, then tap its basket.",
  hint: "You get ready first. Watering and watching come after the seed is in the soil.",
  bins: [
    { id: "first", label: "start", emoji: "1️⃣" },
    { id: "last", label: "end", emoji: "🏁" },
  ],
  items: [
    { label: "get a pot", emoji: "🪴", bin: "first" },
    { label: "fill it with soil", emoji: "🟤", bin: "first" },
    { label: "make a small hole", emoji: "⛏️", bin: "first" },
    { label: "water the seed", emoji: "💧", bin: "last" },
    { label: "put the pot in the sun", emoji: "☀️", bin: "last" },
    { label: "watch it grow", emoji: "🌱", bin: "last" },
  ],
};

const TOOTH_ORDER = order("Put the steps for brushing teeth in order.", "You need the toothpaste on the brush before you brush.", [
  ["Put toothpaste on the brush", "🪥"],
  ["Brush your teeth", "😁"],
  ["Spit and rinse", "🚰"],
  ["Put the brush away", "🧼"],
]);

const PLANT_ORDER = order("Put the steps for planting a seed in order.", "You have to dig before you can plant, and you plant before you water.", [
  ["Dig a small hole", "⛏️"],
  ["Drop in the seed", "🌱"],
  ["Cover it with soil", "🟤"],
  ["Water it", "💧"],
]);

const INSTRUCTIONS: Item[] = [
  q("Good instructions have steps that are…", "clear and in the right order", ["mixed up", "very long"], "Clear steps in order help others follow along."),
  q("Which word helps make instructions clear?", "first, next, then", ["maybe, perhaps", "never"], "Order words show what comes when."),
  q("Which is a better step for a sandwich?", "Spread the jam on the bread.", ["Do the jam thing.", "Maybe jam."], "A good step uses an action word and says exactly what to do.", { d: 2 }),
  q("Which word is an action word in this step? “Cut the paper.”", "cut", ["the", "paper"], "Action words (verbs) tell what to do.", { d: 2 }),
  q("Which is a precise (exact) step?", "Hop three times.", ["Hop some times.", "Maybe hop."], "A number tells exactly how many.", { d: 2 }),
  q("Why do we use pictures or diagrams in instructions?", "They help show what to do", ["They make the steps longer", "They hide the steps"], "Pictures can make steps easier to follow."),
  q("A robot toy walks forward and turns. It does this 4 times. How many turns is that?", "4", ["2", "8"], "It turns once each time, so 4 times is 4 turns.", { d: 3 }),
  q("“Clap, stomp.” Repeat 3 times. How many claps are there?", "3", ["6", "2"], "There is one clap in each pair, and 3 pairs.", { d: 3 }),
  q("Instead of writing “hop, hop, hop, hop,” you could write…", "hop 4 times", ["hop 3 times", "do not hop"], "Repeating a step can make instructions shorter.", { d: 2 }),
  q("You brush your teeth in the morning and at night. Brushing is an example of…", "a job we repeat", ["a job we do once", "a toy"], "Many daily jobs are repeated.", { d: 2 }),
  q("Your friend follows your instructions but gets a different result. What can you do?", "Check that each step is clear and in order", ["Say your friend is wrong", "Throw away the steps"], "Testing instructions helps us improve them.", { d: 2 }),
  q("How many steps are in these instructions? Get a cup. Fill it. Drink.", "3", ["2", "4"], "Count each action.", { d: 2 }),
  q("Which instruction repeats a step?", "Stir 5 times.", ["Add a spoon.", "Open the lid."], "Repeating a step means doing it again and again.", { d: 3 }),
  q("Two friends work together to make steps for building a snowman. Why is that a good idea?", "They can share ideas to make better steps", ["It always takes more time", "They must use the same words"], "Working together helps us think of better ideas.", { d: 3 }),
];

export const units: Unit[] = [
  {
    id: "materials-ab",
    title: "Materials and Their Uses",
    emoji: "🧱",
    blurb: "Natural and processed materials, and picking the right one",
    standards: ab("2M 1.1, 2M 1.2, 2M 1.3, 2M 1.4, 2M 1.5", "natural and processed materials, their properties and choosing materials for a purpose"),
    parentNote: "Natural materials come from plants, animals, the land or the sky; processed materials are made by people from natural ones. Children test properties such as see-through, absorbent and bendy, and choose the best material for a job.",
    generate: unitOf(MATERIALS, [sorter(MATERIAL_SORT)]),
  },
  {
    id: "light-and-sound-ab",
    title: "Light and Sound",
    emoji: "🔊",
    blurb: "Where light and sound come from and how they move",
    standards: ab("2E 1.1, 2E 1.2", "sources of light and sound, vibration, shadows, reflection and echoes"),
    parentNote: "Sound is made by vibrations and can bounce, travel and be absorbed. Light comes from sources such as the Sun, fire and electricity, travels in straight lines and bounces off surfaces. Children also learn to protect their eyes and ears.",
    generate: unitOf(LIGHT_SOUND, [sorter(SOURCE_SORT)]),
  },
  {
    id: "landforms-ab",
    title: "Landforms and Earth",
    emoji: "🏔️",
    blurb: "Mountains, prairies and the parts of Earth",
    standards: ab("2ES 1.1, 2ES 1.2", "the parts of Earth, and Alberta landforms such as mountains, valleys, hills, prairies and plateaus"),
    parentNote: "Earth is made of land, water and air, and holds plants, animals and people. Alberta has mountains, hills, valleys, plateaus and prairies, and UNESCO World Heritage Sites such as Dinosaur Provincial Park, Wood Buffalo National Park and Head-Smashed-In Buffalo Jump.",
    generate: unitOf(LANDFORMS, [sorter(LANDFORM_SORT)]),
  },
  {
    id: "waters-ab",
    title: "Lakes, Rivers and Oceans",
    emoji: "🌊",
    blurb: "Bodies of water, fresh and salty",
    standards: ab("2ES 1.3", "bodies of water, how water flows from creeks to the ocean, and fresh and salt water"),
    parentNote: "Most of Earth's surface is covered by water. Children name oceans, glaciers, lakes, wetlands and rivers, follow water as it flows downhill from small creeks to the ocean, and tell fresh water from salt water.",
    generate: unitOf(WATERS, [sorter(WATERS_SORT), FLOW_ORDER]),
  },
  {
    id: "day-and-year-ab",
    title: "Earth and the Sun",
    emoji: "🌞",
    blurb: "Day, night and the year",
    standards: ab("2ES 1.4", "Earth spins to make day and night and goes around the Sun in a year"),
    parentNote: "A day is one spin of Earth. A year is one trip of Earth around the Sun. When our side of Earth faces the Sun it is day, and when it faces away it is night.",
    generate: unitOf(DAYNIGHT),
  },
  {
    id: "instructions-ab",
    title: "Clear Instructions",
    emoji: "📝",
    blurb: "Steps in order, exact words and repeats",
    standards: ab("2CS 1.1, 2CS 1.2, 2CS 1.3", "designing clear steps in order, using exact words, and repeating steps"),
    parentNote: "Children build three- to four-step instructions with action words, put steps in order, and see how repeating a step can make instructions shorter. This is a first step into computational thinking, with no screen needed.",
    generate: unitOf(INSTRUCTIONS, [sorter(INSTR_SORT), TOOTH_ORDER, PLANT_ORDER]),
  },
];
