import type { Unit } from "../types";
import { on } from "./kit";
import { e, order, q, sorter, unitOf, type Item } from "./k-g2-kit";

// Ontario Grade 1 science and technology (2022): Life Systems (needs and characteristics of living
// things), Matter and Energy (energy in our lives), Structures and Mechanisms (everyday materials,
// objects and structures), and Earth and Space Systems (daily and seasonal changes). BC's living
// things, animal survival, materials and sky-and-seasons units are shared (see g1.ts).

// ---------- Think Like a Scientist ----------

const SKILLS: Item[] = [
  q("We make a plan, test it and watch what happens. This is called an…", "experiment", ["accident", "argument"], "In an experiment we test an idea and observe the results.", { emoji: "🧪" }),
  q("A scientist wants to learn about frogs. Where could they look?", "In a book or on a trusted website", ["Only in a dream", "In a shoe"], "Research means looking for information in good sources.", { emoji: "🐸" }),
  q("Which tool measures how long a leaf is?", e("ruler", "📏"), [e("thermometer", "🌡️"), e("magnifier", "🔍")], "A ruler measures length."),
  q("Which tool tells how hot or cold it is?", e("thermometer", "🌡️"), [e("ruler", "📏"), e("magnifier", "🔍")], "A thermometer measures temperature."),
  q("Which tool helps you see the tiny parts of a flower?", e("magnifier", "🔍"), [e("thermometer", "🌡️"), e("ruler", "📏")], "A magnifier makes small things look bigger."),
  q("Which one is a safe way to work in science?", "Follow the safety rules", ["Taste the materials", "Run around the room"], "Safety rules keep everyone safe."),
  q("Why do we wear safety goggles in some tests?", "To protect our eyes", ["To look funny", "To hear better"], "Goggles keep splashes and bits out of our eyes."),
  q("A scientist measures a plant each week. What can they show?", "How much it grew", ["How loud it is", "What it dreams"], "Measuring over time shows change.", { d: 2 }),
  q("After a test, what is a good way to share what you found?", "Draw and tell about it", ["Say nothing", "Hide your notes"], "Pictures, charts and words help share results.", { d: 2 }),
  q("What do we call the steps a computer follows?", "code", ["a snack", "a leaf"], "Code is a set of clear steps a computer can follow.", { emoji: "💻" }),
  q("A robot must go to the plant. Which steps are clear?", "Forward, forward, turn left", ["Go over there", "Do the thing"], "Code needs exact steps, one at a time.", { d: 2 }),
  q("You build a model boat. It tips over. What next?", "Change the design and test again", ["Throw it away", "Never try again"], "Engineers test and improve their designs.", { emoji: "⛵", d: 2 }),
  q("An engineer designs a tool. What do they do before building?", "Make a plan", ["Eat lunch", "Close the window"], "Designers plan and draw first.", { d: 3 }),
  q("Scientists keep the test fair. Why change just one thing?", "So we know what caused the result", ["It is faster", "It is louder"], "Changing one thing at a time shows what matters.", { d: 3 }),
  q("People use science to solve problems. Which is an example?", "A bike helmet protects our heads", ["A cloud is fluffy", "A dog barks"], "Many tools and ideas from science help people every day.", { d: 3 }),
];

// ---------- What Living Things Need ----------

const NEEDS: Item[] = [
  q("Which one do plants need to grow?", "water, light and air", ["candy and toys", "TV and games"], "Plants need water, light, air and a place to grow.", { emoji: "🌱" }),
  q("A dog needs food, water and…", e("shelter", "🏠"), [e("a hat", "🎩"), e("a TV", "📺")], "Animals need shelter, air, water, food and space.", { emoji: "🐶" }),
  q("What do we breathe in to stay alive?", "air", ["sand", "paint"], "People and animals need air.", { emoji: "🌬️" }),
  q("A houseplant sits in a dark closet. What will happen?", "It will not grow well", ["It will grow faster", "It will make music"], "Plants need light to make their own food.", { emoji: "🪴" }),
  q("Which is NOT a basic need of a living thing?", "a video game", ["water", "food"], "Needs are things living things must have to stay alive."),
  q("Why do living things need food?", "It gives them energy to grow", ["It makes them sleepy forever", "It makes them invisible"], "Food gives living things energy."),
  q("Where does a fish find the air it needs?", "In the water around it", ["From a tree", "From the sun"], "Fish take in the air that is mixed in water.", { emoji: "🐟", d: 2 }),
  q("A bird builds a nest. What need does it meet?", "shelter", ["water", "air"], "A nest is a home that keeps eggs safe.", { emoji: "🪹" }),
  q("Why do plants in a crowded pot grow poorly?", "They need space", ["They are bored", "They need a TV"], "Living things need space to grow.", { d: 2 }),
  q("A squirrel stores nuts for winter. What need is it planning for?", "food", ["a hat", "a toy"], "Animals find and store food.", { emoji: "🐿️", d: 2 }),
  q("Many animals have thick fur in winter. What need does it help meet?", "heat (staying warm)", ["water", "space"], "Living things need the right heat to stay alive.", { d: 2 }),
  q("A bee visits flowers. What do flowers give the bee?", "food (nectar)", ["a house", "a bed"], "Living things help meet each other's needs.", { emoji: "🐝", d: 2 }),
  q("A farmer plants vegetables for people. What do the plants give?", "food", ["clothes", "toys"], "Plants give food to people and animals.", { d: 3 }),
  q("Cows eat grass. What do cows get from the grass?", "food and energy", ["only water", "only light"], "Animals get energy from food.", { d: 3 }),
  q("A tree gives birds a place to build a nest. What does the tree give?", "shelter", ["water", "heat"], "Plants can provide shelter for animals.", { d: 3 }),
];

const NEEDS_ORDER = order("Put it in order. What does a seed need to become a plant?", "A seed needs water and warmth to sprout, then light to grow.", [
  ["Seed in soil", "🌰"],
  ["Add water", "💧"],
  ["Sprout grows", "🌱"],
  ["Plant grows tall", "🪴"],
]);

// ---------- Our Bodies and Senses ----------

const BODY: Item[] = [
  q("Which body part do you use to see?", e("eyes", "👀"), [e("ears", "👂"), e("nose", "👃")], "Our eyes let us see."),
  q("Which body part do you use to hear?", e("ears", "👂"), [e("eyes", "👀"), e("tongue", "👅")], "Our ears let us hear."),
  q("Which body part do you use to smell?", e("nose", "👃"), [e("ears", "👂"), e("hands", "🤲")], "Our nose helps us smell."),
  q("Which body part do you use to taste?", e("tongue", "👅"), [e("nose", "👃"), e("eyes", "👀")], "Taste buds on our tongue help us taste."),
  q("Which body part helps you feel if something is hot?", e("skin", "🤚"), [e("ears", "👂"), e("eyes", "👀")], "Our skin lets us feel hot, cold, soft and rough."),
  q("Which part of the body pumps blood?", e("heart", "❤️"), [e("lungs", "🫁"), e("brain", "🧠")], "The heart pumps blood all around the body.", { d: 2 }),
  q("Which body part helps you breathe?", e("lungs", "🫁"), [e("heart", "❤️"), e("stomach", "🍽️")], "Lungs take in air.", { d: 2 }),
  q("Which part of your body helps you think?", e("brain", "🧠"), [e("heart", "❤️"), e("knee", "🦵")], "The brain controls our thinking and body.", { d: 2 }),
  q("Which body part do we use to chew food?", "teeth", ["ears", "elbows"], "Teeth help us chew food.", { emoji: "🦷" }),
  q("Which sense tells you a lemon is sour?", "taste", ["hearing", "sight"], "Our tongue tastes sweet, sour, salty and bitter.", { emoji: "🍋" }),
  q("You hear a bell ring. Which sense are you using?", "hearing", ["smell", "touch"], "Hearing uses our ears.", { emoji: "🔔" }),
  q("A dog sniffs the air for a smell. Which body part is it using?", "its nose", ["its tail", "its paws"], "Many animals smell with a nose.", { emoji: "🐕", d: 3 }),  q("Which body part helps you walk and run?", e("legs", "🦵"), [e("ears", "👂"), e("eyes", "👀")], "Our legs help us walk, run and jump.", { d: 3 }),  q("Which part of the body holds up your body and protects it?", "bones", ["hair", "teeth only"], "Bones hold up our body.", { emoji: "🦴", d: 3 }),
  q("Which part of your body helps you eat and digest food?", e("stomach", "🍽️"), [e("ears", "👂"), e("eyes", "👀")], "Food goes to the stomach, where it is broken down.", { d: 3 }),
];

// ---------- A Healthy Environment ----------

const ENVIRO: Item[] = [
  q("Which one makes a healthy environment?", "clean air and water", ["lots of litter", "dirty water"], "Living things need clean air and water."),
  q("What can you do with an empty paper?", "Put it in the recycling bin", ["Throw it in a pond", "Leave it on the grass"], "Recycling paper keeps it out of the garbage.", { emoji: "♻️" }),
  q("What does reuse mean?", "Use it again", ["Throw it away", "Break it"], "Reusing means using something more than once.", { emoji: "🔄" }),
  q("What does reduce mean?", "Use less", ["Use more", "Hide it"], "Reducing means making less waste."),
  q("Which choice makes less garbage?", "a water bottle you refill", ["a new plastic bottle every time", "a paper cup every time"], "Refillable bottles make less waste."),
  q("What would happen if a pond had no clean water?", "Fish and frogs would be in trouble", ["Nothing would change", "More toys would grow"], "Living things in the pond need clean water.", { emoji: "🐸", d: 2 }),
  q("If all the trees in a forest were gone, what would happen?", "Many animals would lose their homes", ["Nothing", "More snow"], "Many living things depend on trees.", { emoji: "🌲", d: 2 }),
  q("Which action helps the environment?", "Pick up litter", ["Drop litter", "Feed ducks plastic"], "Picking up litter keeps animals safe."),
  q("Which is a natural, non-living part of a pond?", "water", ["a frog", "a fish"], "Water, rocks and air are non-living. Frogs and fish are living.", { d: 2 }),
  q("In a garden, bees help flowers by…", "carrying pollen", ["eating them all", "making the soil hot"], "Living things help each other in nature.", { emoji: "🐝", d: 2 }),
  q("Worms live in soil and help it. This is an example of…", "living things helping each other", ["a toy", "a machine"], "Worms mix the soil so plants can grow.", { emoji: "🪱", d: 3 }),
  q("You eat an apple. What goes in the compost bin?", "the core", ["the plate", "the fork"], "Food scraps can go in the compost or green bin.", { emoji: "🍎", d: 2 }),  q("Where does a plastic water bottle belong after you finish it?", "in the recycling bin", ["in a river", "in a tree"], "Recycling lets us make new things.", { d: 2 }),
  q("Why should we walk or bike when we can?", "It makes less air pollution", ["It is magic", "It makes more garbage"], "Cars give off fumes. Walking and biking keep the air cleaner.", { d: 3 }),
  q("The school yard has a garden. Why is it good for the environment?", "It gives food and homes to small living things", ["It makes litter", "It uses up all the air"], "Gardens help insects, birds and plants.", { d: 3 }),
];

const ENV_SORT = sorter({
  prompt: "Living or non-living in a pond? Tap, then tap a basket.",
  hint: "Living things grow, need food and air, and have young.",
  bins: [
    { id: "living", label: "Living", emoji: "🌱" },
    { id: "non", label: "Non-living", emoji: "🪨" },
  ],
  items: [
    { label: "frog", emoji: "🐸", bin: "living" },
    { label: "fish", emoji: "🐟", bin: "living" },
    { label: "water lily", emoji: "🪷", bin: "living" },
    { label: "duck", emoji: "🦆", bin: "living" },
    { label: "rock", emoji: "🪨", bin: "non" },
    { label: "water", emoji: "💧", bin: "non" },
    { label: "sand", emoji: "🏖️", bin: "non" },
    { label: "air bubbles", emoji: "🫧", bin: "non" },
  ],
});

// ---------- Energy in Our Lives ----------

const ENERGY: Item[] = [
  q("What is the biggest source of energy for Earth?", e("the Sun", "☀️"), [e("the Moon", "🌙"), e("a lamp", "💡")], "The Sun gives Earth light and heat."),
  q("Energy lets something move or change. Which uses energy?", "a ball rolling", ["a rock sitting still", "a closed book"], "Energy is the ability to move or change something.", { d: 2 }),
  q("Where do living things get energy from?", "food", ["TV", "plastic"], "People and animals get energy from the food they eat.", { emoji: "🍎" }),
  q("Which one needs electricity?", e("a lamp", "💡"), [e("a spoon", "🥄"), e("a rock", "🪨")], "Lamps, TVs and fridges use electrical energy."),
  q("Which one needs electricity to work?", e("a fridge", "🧊"), [e("a pillow", "🛏️"), e("a book", "📚")], "Electricity powers many things at home."),
  q("The Sun warms the air, water and land. What does it give us?", "heat and light", ["only wind", "only sound"], "The Sun warms Earth and lights the day.", { emoji: "🌞" }),
  q("What can you do to use less electricity?", "Turn off lights when you leave", ["Leave every light on", "Open the fridge all day"], "Saving energy is a responsible choice.", { emoji: "💡" }),
  q("What if there were no electricity for a day?", "Lights and fridges would stop working", ["Nothing would change", "The Sun would go out"], "We use electricity for many jobs at home.", { d: 2 }),
  q("Which of these uses the Sun's energy?", "a solar panel", ["a spoon", "a bookshelf"], "Solar panels change sunlight into electricity.", { d: 2 }),
  q("In winter, what do we use more to keep the house warm?", "heat from a furnace", ["a fan", "a sprinkler"], "We use more energy for heat in cold seasons.", { d: 2 }),
  q("In summer, which might we use more?", "a fan or air conditioner", ["a snow shovel", "a toque"], "We use different energy in different seasons.", { d: 2 }),
  q("Which gives light at night?", "a lamp", ["a rock", "a sponge"], "Lamps turn electrical energy into light.", { d: 1 }),
  q("A car uses fuel to go. What does the fuel give the car?", "energy", ["paint", "wheels"], "Fuel gives the car energy to move.", { d: 3 }),
  q("Wind pushes a sailboat. What is the wind giving?", "energy", ["paint", "weight"], "Moving air has energy that can push things.", { emoji: "⛵", d: 3 }),
  q("Why is it good to turn off a TV when no one is watching?", "It saves energy", ["It makes it taller", "It makes the sun set"], "Using less energy helps the planet.", { d: 3 }),
];

// ---------- Objects and Structures ----------

const STRUCT: Item[] = [
  q("Which one is made of wood?", e("a pencil", "✏️"), [e("a glass", "🥛"), e("a coin", "🪙")], "Many pencils are made of wood."),
  q("A structure holds something up. Which one is a structure?", e("a bridge", "🌉"), [e("a leaf", "🍃"), e("a cloud", "☁️")], "A bridge holds up cars, people and trains."),
  q("Which one is a structure?", e("a tent", "⛺"), [e("a puddle", "💧"), e("a shadow", "🌑")], "A tent has a frame that holds it up."),
  q("What is the job of a chair?", "to hold you up", ["to tell time", "to make light"], "Objects and structures have a purpose.", { emoji: "🪑" }),
  q("What is the job of a fence?", "to keep things in or out", ["to cook food", "to fly"], "A fence marks a space."),
  q("Which one fastens two papers together?", "a staple", ["a pencil", "a sponge"], "Staples, tape and glue are fasteners.", { emoji: "📎" }),
  q("Which one fastens a button on a coat?", "a thread", ["a magnet", "a rock"], "Sewing with a thread keeps a button in place.", { d: 2 }),
  q("Which one closes a coat?", "a zipper", ["a nail", "a staple"], "A zipper fastens two sides of a coat.", { emoji: "🧥", d: 2 }),  q("Which fastener holds a board to a wall?", "a screw or nail", ["glue on the floor", "a feather"], "Nails and screws hold wood together.", { d: 2 }),
  q("Where does wood come from?", "trees", ["clouds", "oceans"], "Wood comes from trees.", { emoji: "🌲" }),
  q("Where does wool come from?", "sheep", ["fish", "trees"], "Sheep grow wool, which can be made into yarn.", { emoji: "🐑" }),
  q("A roof must keep rain out. Which property helps most?", "waterproof", ["fluffy", "sweet"], "A waterproof material keeps water out.", { d: 2 }),
  q("A bridge must hold cars. Which property helps most?", "strong", ["soft", "see-through"], "Strong materials can hold a load.", { emoji: "🌉", d: 2 }),
  q("Which bag can you use again and again to carry groceries?", "a strong cloth bag", ["a thin tissue", "a paper napkin"], "Reusable bags help make less garbage.", { d: 3 }),  q("A boot and a sandal both cover feet. What is different?", "The boot keeps feet warm and dry", ["The sandal is better in snow", "They are the same"], "Objects with a similar job can be made of different materials.", { d: 3 }),
];

// ---------- Day, Night and Seasons ----------

const SEASON: Item[] = [
  q("What makes day and night?", "Earth turns", ["The Sun goes out", "The Moon blows it away"], "Earth spins, so the Sun lights one side at a time.", { emoji: "🌍" }),
  q("When is it brightest outside?", "in the middle of the day", ["at midnight", "just before sunrise"], "The Sun is high in the sky around the middle of the day.", { d: 2 }),  q("In which season is it usually the coldest in Ontario?", "winter", ["summer", "spring"], "Winter has the coldest weather and shortest days.", { emoji: "❄️" }),
  q("In which season do many trees grow new leaves?", "spring", ["winter", "fall"], "Buds and leaves appear in spring.", { emoji: "🌳" }),
  q("What do many animals do to get ready for winter?", "Grow thicker fur or store food", ["Go to the beach", "Plant flowers"], "Many animals prepare for winter.", { d: 2 }),
  q("In winter, what do we wear to stay warm?", "a coat, mittens and a toque", ["a swimsuit", "sandals"], "We dress for the weather.", { emoji: "🧣" }),
  q("A cycle is a series of events that…", "repeat", ["happen only once", "never happen"], "Seasons, day and night and a plant's life are all cycles.", { d: 2 }),
  q("Which is a cycle?", "spring, summer, fall, winter", ["Monday only", "a rock"], "The four seasons come back again and again.", { d: 2 }),
  q("In summer, what might we do outside?", "swim and play at the park", ["go sledding", "shovel snow"], "Summer is warm.", { emoji: "🏊" }),
  q("In fall, what do many people do to leaves?", "rake them", ["plant them", "paint them blue"], "Fall is when many leaves drop.", { emoji: "🍂" }),
  q("What is a good way to stay safe in the hot Sun?", "Wear a hat and sunscreen", ["Wear a snowsuit", "Stay in the sun all day"], "Hats, shade and sunscreen protect our skin.", { d: 2 }),
  q("People make skates and skis. What season are they for?", "winter", ["summer", "fall"], "Skates and skis help us play on ice and snow.", { d: 2 }),
  q("A bear sleeps through much of winter. Why?", "There is less food", ["It dislikes toys", "It has a job"], "Animals change what they do when seasons change.", { emoji: "🐻", d: 3 }),
  q("Geese fly south in the fall. Why?", "to find warmer weather and food", ["to find the sea", "to catch a bus"], "Many birds migrate when the weather cools.", { d: 3 }),
  q("In fall, daylight gets shorter. What happens to the temperature?", "It gets colder", ["It gets hotter", "It turns blue"], "Less sunlight means less heat.", { d: 3 }),
];

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "think-like-a-scientist",
    title: "Think Like a Scientist",
    emoji: "🔬",
    blurb: "Tools, tests, safety and code",
    standards: on("A1.1, A1.2, A1.4, A1.5, A2.1", "using a research process and experiments, working safely, sharing findings and writing simple code"),
    parentNote: "How scientists and engineers work: choosing tools, running fair tests, following safety rules, sharing findings, and giving clear step-by-step instructions (code).",
    generate: unitOf(SKILLS),
  },
  {
    id: "what-living-things-need",
    title: "What Living Things Need",
    emoji: "🌱",
    blurb: "Air, water, food, heat, shelter, space",
    standards: on("B2.2, B2.6", "the basic needs of living things and how living things help meet each other's needs"),
    parentNote: "The six basic needs of living things (air, water, food, heat, shelter and space) and how plants, animals and people help each other.",
    generate: unitOf(NEEDS, [NEEDS_ORDER]),
  },
  {
    id: "our-bodies-and-senses",
    title: "Our Bodies & Senses",
    emoji: "👀",
    blurb: "Eyes, ears, nose and more",
    standards: on("B2.3, B2.4", "physical characteristics of plants and animals including humans, and the parts and jobs of the human body and senses"),
    parentNote: "The five senses, the body part linked to each, and the jobs of the heart, lungs, brain, bones and stomach.",
    generate: unitOf(BODY),
  },
  {
    id: "a-healthy-environment",
    title: "A Healthy Environment",
    emoji: "🌎",
    blurb: "Clean air, clean water, less waste",
    standards: on("B1.1, B1.2, B2.1, B2.5, D1.1", "living and non-living things in nature, what a healthy environment needs, and how to reduce waste"),
    parentNote: "Living and non-living things in a natural place, why clean air, water and food matter, and simple ways to reduce, reuse and recycle.",
    generate: unitOf(ENVIRO, [ENV_SORT]),
  },
  {
    id: "energy-in-our-lives",
    title: "Energy in Our Lives",
    emoji: "💡",
    blurb: "Sun, food and electricity",
    standards: on("C1.1, C1.2, C2.1–C2.4, C2.6", "what energy is, the Sun and food as sources, everyday uses of energy, and using energy responsibly"),
    parentNote: "Energy as the ability to move or change something, the Sun and food as sources of energy, everyday uses of electricity, and ways to use less.",
    generate: unitOf(ENERGY),
  },
  {
    id: "objects-and-structures",
    title: "Objects & Structures",
    emoji: "🌉",
    blurb: "Jobs, materials and fasteners",
    standards: on("D1.2, D2.2, D2.4, D2.5, D2.7, D2.8", "the purpose of objects and structures, how they are built, fasteners, and where common materials come from"),
    parentNote: "Structures that hold up a load, what everyday objects are for, how fasteners join things, and where materials such as wood and wool come from.",
    generate: unitOf(STRUCT),
  },
  {
    id: "day-night-and-seasons",
    title: "Day, Night & Seasons",
    emoji: "🍁",
    blurb: "Cycles and how living things respond",
    standards: on("E1.1, E1.2, E2.2, E2.5, E2.6", "cycles, and how people and other living things respond to daily and seasonal changes"),
    parentNote: "Day and night and the four seasons as cycles, and how people dress, play and prepare while animals and plants change with the seasons.",
    generate: unitOf(SEASON),
  },
];
