import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { withSort, type Item } from "../ontario/g56-bank";
import { ab } from "./kit";

// Alberta Grade 5 science (2023 curriculum): Matter (the particle model, mass, volume, density, compressibility)
// and Energy and forces (flight, buoyancy, energy resources). Ontario's states-of-matter, changes-of-state and
// energy-sources units are shared (see g5.ts); these three are written for the Alberta outcomes they leave out.

// ---------- Flight: thrust, drag, lift and weight (5E 1.1) ----------

const FLIGHT: Item[] = [
  { prompt: "Which force pulls a flying bird or plane toward the ground?", right: "weight (gravity)", wrong: ["lift", "thrust", "drag"], hint: "Weight is a force caused by gravity that acts downward." , emoji: "🐦" },
  { prompt: "Which force holds a plane up in the air?", right: "lift", wrong: ["weight", "drag", "friction with the ground"], hint: "Lift is an upward force that acts to overcome weight.", emoji: "✈️" },
  { prompt: "Which force pushes a plane forward?", right: "thrust", wrong: ["drag", "weight", "lift"], hint: "Thrust acts in the direction of movement. Engines or flapping wings can make it.", emoji: "🚀" },
  { prompt: "Which force acts against the direction a bird flies?", right: "drag", wrong: ["thrust", "lift", "gravity pulling it up"], hint: "Drag is the force of air pushing back against a moving thing.", emoji: "💨" },
  { prompt: "Thrust and drag are…", right: "opposing forces", wrong: ["the same force", "forces that never act together", "forces that act only on the ground"], hint: "Thrust pushes forward and drag pulls back, so they oppose each other." },
  { prompt: "Lift and weight are…", right: "opposing forces", wrong: ["both forces that point down", "forces that only act in water", "the same force"], hint: "Lift pushes up and weight pulls down." },
  { prompt: "A paper plane flies straight and level at a steady height. What is true about lift and weight?", right: "They are balanced", wrong: ["Lift is much bigger", "Weight is much bigger", "There is no weight"], hint: "At a steady height, the up and down forces are balanced." },
  { prompt: "A glider keeps losing height because its weight is greater than its lift. What would help?", right: "Make the wings larger to produce more lift", wrong: ["Add heavy clay to the nose", "Remove its wings", "Fold the wings in"], hint: "Bigger wings make more lift. More mass makes more weight." },
  { prompt: "Which change would make a paper plane have less drag?", right: "Make the nose pointed and the surface smooth", wrong: ["Add crumpled paper to the front", "Hang tape in the wind", "Make it as wide as possible"], hint: "Streamlined shapes let air flow around them more easily." },
  { prompt: "A bird flaps its wings down and back. Which force does this help make?", right: "thrust", wrong: ["drag", "weight", "friction with the road"], hint: "Flapping pushes air backward, and the bird is pushed forward." },
  { prompt: "A kite rises when the wind blows. Which force pushes the kite up?", right: "lift", wrong: ["weight", "thrust from a motor", "friction"], hint: "Moving air flowing past the kite's surface makes lift.", emoji: "🪁" },
  { prompt: "Which of these is a traditional technology that uses forces in flight?", right: "an arrow shot from a bow", wrong: ["a refrigerator", "a toaster", "a bicycle bell"], hint: "A bow gives an arrow thrust, then lift, weight and drag act on it. A slingshot and a fishing spear are other examples.", emoji: "🏹" },
  { prompt: "A heavier plane needs more of which force to stay up?", right: "lift", wrong: ["drag", "less weight", "less thrust"], hint: "To stay up, lift must equal weight. More weight needs more lift." },
  { prompt: "Which design feature of a bird helps it have strong lift?", right: "broad, curved wings", wrong: ["short, straight claws", "thick, heavy bones", "a flat belly"], hint: "Wing shape affects how much lift air produces.", hard: true },
  { prompt: "A pilot wants to climb higher. What must be greater than the weight for a moment?", right: "lift", wrong: ["drag", "friction", "thrust only"], hint: "To climb, lift must be larger than weight.", hard: true },
  { prompt: "A skydiver opens a parachute. What happens to drag?", right: "Drag increases, so falling slows down", wrong: ["Drag disappears", "Weight disappears", "Thrust increases"], hint: "A wide parachute catches more air, so air pushes back harder.", hard: true },
  { prompt: "An eagle holds its wings out and glides without flapping. Which force keeps it from falling right away?", right: "lift from air moving over its wings", wrong: ["thrust from its beak", "its weight", "drag"], hint: "Gliding birds use rising air and lift.", hard: true },
];

const FLIGHT_SORT: SortSet = {
  prompt: "Does the force help flight or work against it? Tap an item, then tap its basket.",
  hint: "Lift (up) and thrust (forward) help a plane fly. Weight (down) and drag (backward) work against it.",
  bins: [
    { id: "help", label: "Helps flight", emoji: "⬆️" },
    { id: "against", label: "Works against flight", emoji: "⬇️" },
  ],
  items: [
    { label: "lift from the wings", emoji: "🪽", bin: "help" },
    { label: "thrust from an engine", emoji: "🚀", bin: "help" },
    { label: "a bird flapping forward", emoji: "🐦", bin: "help" },
    { label: "air pushing up under a kite", emoji: "🪁", bin: "help" },
    { label: "weight pulling a plane down", emoji: "🪨", bin: "against" },
    { label: "air pushing back against a plane", emoji: "💨", bin: "against" },
    { label: "gravity on a glider", emoji: "🌍", bin: "against" },
    { label: "air rubbing on a parachute", emoji: "🪂", bin: "against" },
  ],
};

// ---------- Floating and sinking: buoyant force (5E 1.2) ----------

const BUOYANCY: Item[] = [
  { prompt: "Buoyant force is…", right: "an upward force from a fluid on an object in it", wrong: ["a downward force from gravity", "a force that pushes sideways", "the weight of the object"], hint: "A fluid, such as water, pushes up on anything placed in it." },
  { prompt: "Which of these is a fluid?", right: "water", wrong: ["a rock", "a wooden block", "a steel bar"], hint: "Fluids include liquids and gases. Solids are not fluids." },
  { prompt: "Air is a…", right: "fluid, because gases are fluids too", wrong: ["solid", "liquid", "force"], hint: "Fluids are liquids and gases." },
  { prompt: "An object floats when…", right: "the buoyant force is greater than its weight", wrong: ["its weight is greater than the buoyant force", "there is no gravity", "it is made of metal"], hint: "If the upward push is bigger than the weight, the object rises or floats." },
  { prompt: "An object sinks when…", right: "the buoyant force is less than its weight", wrong: ["the buoyant force is greater than its weight", "it has no mass", "it is in the air"], hint: "If weight wins over the upward push, it sinks." },
  { prompt: "A small steel nail is put in a bowl of water. What happens?", right: "It sinks", wrong: ["It floats", "It bounces", "It melts"], hint: "The nail's weight is greater than the buoyant force on it.", emoji: "🔩" },
  { prompt: "A cork is put in a bowl of water. What happens?", right: "It floats", wrong: ["It sinks", "It dissolves", "It turns into a gas"], hint: "A cork is light for its size, so the buoyant force beats its weight." },
  { prompt: "A huge steel ship floats. Why?", right: "Its hollow shape gives it a large buoyant force", wrong: ["Steel is lighter than water", "Ships are never affected by gravity", "The ship has no weight"], hint: "The ship's shape pushes aside a lot of water, so the water pushes up a lot.", emoji: "🚢" },
  { prompt: "A ball of modelling clay sinks. How could you make a clay boat that floats?", right: "Shape it like a bowl with high sides", wrong: ["Squeeze it into a tight ball", "Add more clay to the bottom", "Roll it into a cylinder"], hint: "A wide hollow shape pushes aside more water, so more buoyant force acts on it." },
  { prompt: "A student wants a fair test of whether different objects float. What should stay the same?", right: "the kind of liquid and the amount of water", wrong: ["the objects", "the colours of the objects", "the number of tries only"], hint: "In a controlled experiment, only one thing changes. The liquid stays the same." },
  { prompt: "A life jacket helps a swimmer float because it…", right: "adds buoyant force without adding much weight", wrong: ["adds a lot of weight", "removes gravity", "makes the water disappear"], hint: "It is filled with light material that displaces water." },
  { prompt: "Which usually floats higher: a boat carrying one person or the same boat carrying ten?", right: "the boat carrying one person", wrong: ["the boat carrying ten", "both float exactly the same", "neither floats"], hint: "More weight makes the boat sink deeper until the buoyant force matches it." },
  { prompt: "A hot air balloon rises. Which statement is true?", right: "The buoyant force from the cooler air around it is greater than its weight", wrong: ["The balloon has no weight", "Gravity stops working on it", "Water pushes it up"], hint: "Air is a fluid, so it can push objects up too.", hard: true },
  { prompt: "A sealed empty plastic bottle floats but a bottle full of sand sinks. Why?", right: "The bottle of sand has greater weight than the buoyant force on it", wrong: ["Sand is lighter than air", "The sealed bottle has no mass", "Water cannot touch sand"], hint: "Compare weight with the buoyant force for each bottle.", hard: true },
  { prompt: "Fresh water or salt water: in which does a boat float higher?", right: "salt water, because it pushes up more", wrong: ["fresh water, because it is lighter", "neither, it makes no difference", "only in a lake"], hint: "Salt water is denser, so the buoyant force is greater.", hard: true },
];

const BUOYANCY_SORT: SortSet = {
  prompt: "In fresh water, will it float or sink? Tap an item, then tap its basket.",
  hint: "Think about whether the object is heavy for its size, like a rock, or light for its size, like wood.",
  bins: [
    { id: "float", label: "Floats", emoji: "🛟" },
    { id: "sink", label: "Sinks", emoji: "⚓" },
  ],
  items: [
    { label: "a piece of wood", emoji: "🪵", bin: "float" },
    { label: "a cork", emoji: "🍾", bin: "float" },
    { label: "an ice cube", emoji: "🧊", bin: "float" },
    { label: "a rubber duck", emoji: "🐤", bin: "float" },
    { label: "a rock", emoji: "🪨", bin: "sink" },
    { label: "a steel nail", emoji: "🔩", bin: "sink" },
    { label: "a coin", emoji: "🪙", bin: "sink" },
    { label: "a marble", emoji: "🔮", bin: "sink" },
  ],
};

// ---------- Measuring matter: mass, volume, density, compressibility (5M 1.2) ----------

const PROPS: Item[] = [
  { prompt: "Mass is the amount of…", right: "matter in something", wrong: ["space something takes up", "heat in something", "force on something"], hint: "Mass is the amount of matter in a solid, liquid or gas." },
  { prompt: "Which tool measures mass?", right: "a balance scale", wrong: ["a measuring cup", "a thermometer", "a ruler"], hint: "A balance compares masses. It gives grams or kilograms.", emoji: "⚖️" },
  { prompt: "Which unit is used to measure the mass of an apple?", right: "grams (g)", wrong: ["millilitres (mL)", "metres (m)", "litres (L)"], hint: "Grams and kilograms are SI units of mass." },
  { prompt: "Volume is…", right: "the amount of space something takes up", wrong: ["the amount of matter in something", "how hot something is", "how heavy something feels"], hint: "A liquid in a jug takes up space. That space is its volume." },
  { prompt: "Which tool is best for measuring the volume of 80 mL of juice?", right: "a graduated cylinder", wrong: ["a balance", "a thermometer", "a metre stick"], hint: "A graduated cylinder has marks showing millilitres." },
  { prompt: "SI units for the volume of a liquid include…", right: "millilitres and litres", wrong: ["grams and kilograms", "metres and centimetres", "degrees Celsius"], hint: "Millilitres (mL) and litres (L) measure liquid volume." },
  { prompt: "A liquid is poured from a tall glass into a wide bowl. What happens to its volume?", right: "It stays the same", wrong: ["It gets bigger", "It gets smaller", "It becomes a gas"], hint: "The shape of a liquid can change but the amount of liquid does not." },
  { prompt: "Two cubes are the same size. One is lead and one is wood. Which has greater density?", right: "the lead cube", wrong: ["the wood cube", "they are the same", "neither has any"], hint: "Density compares mass to volume. Lead packs more mass into the same space." },
  { prompt: "Oil floats on water. What does this tell you about the density of oil?", right: "Oil is less dense than water", wrong: ["Oil is more dense than water", "Oil has no mass", "Oil is a solid"], hint: "A less dense liquid floats on a denser liquid." },
  { prompt: "Which of these can be squeezed into a smaller space the easiest?", right: "air in a bike pump", wrong: ["water in a bottle", "a rock", "a wooden block"], hint: "Gas particles have large spaces between them, so a gas is compressible." },
  { prompt: "Why can air be compressed more than water?", right: "Gas particles are far apart, so they can be pushed closer together", wrong: ["Water particles are bigger", "Air particles do not move", "Water has no particles"], hint: "The particle model of matter says gases have large spaces between particles." },
  { prompt: "In a solid, the particles are…", right: "close together and vibrate in place", wrong: ["far apart and moving in all directions", "separated and sliding past each other", "stopped completely"], hint: "Solid particles are packed tightly and shake in place.", emoji: "🧊" },
  { prompt: "In a liquid, the particles…", right: "slide past each other and have small spaces between them", wrong: ["stay locked in place", "are very far apart", "do not move"], hint: "Liquid particles are close but can slide, so a liquid pours.", emoji: "💧" },
  { prompt: "In a gas, the particles…", right: "are far apart and move in all directions", wrong: ["are packed tightly together", "vibrate in place", "do not have any space between them"], hint: "Gas particles have the largest spaces between them.", emoji: "💨" },
  { prompt: "All matter is made up of…", right: "tiny particles that are always moving", wrong: ["smooth, solid blocks", "particles that never move", "empty space only"], hint: "The particle model says all matter is made of tiny moving particles." },
  { prompt: "A student wants to find out which of two liquids is denser. What should be the same for both?", right: "the volume of each liquid", wrong: ["the colour of each liquid", "the name on the bottle", "the room's air"], hint: "To compare density fairly, measure the mass of the same volume of each.", hard: true },
  { prompt: "A 100 mL sample of liquid A has a mass of 90 g. A 100 mL sample of liquid B has a mass of 120 g. Which is denser?", right: "liquid B", wrong: ["liquid A", "they are the same", "it cannot be known"], hint: "Same volume, more mass means more dense.", hard: true },
  { prompt: "Why are the attractive forces between particles strongest in solids?", right: "The particles are closest together", wrong: ["The particles are farthest apart", "The particles move fastest", "Solids have no particles"], hint: "Close particles attract each other more strongly than far-apart ones.", hard: true },
];

const COMPRESS_SORT: SortSet = {
  prompt: "Is it easy to squeeze into a smaller space? Tap an item, then tap its basket.",
  hint: "Gases have large spaces between their particles, so they can be squeezed. Solids and liquids are hard to compress.",
  bins: [
    { id: "easy", label: "Easy to compress", emoji: "🫁" },
    { id: "hard", label: "Hard to compress", emoji: "🧱" },
  ],
  items: [
    { label: "air in a bike pump", emoji: "🚲", bin: "easy" },
    { label: "air in a balloon", emoji: "🎈", bin: "easy" },
    { label: "air in a syringe", emoji: "💉", bin: "easy" },
    { label: "air in a soccer ball", emoji: "⚽", bin: "easy" },
    { label: "water in a bottle", emoji: "💧", bin: "hard" },
    { label: "a steel block", emoji: "🔩", bin: "hard" },
    { label: "a rock", emoji: "🪨", bin: "hard" },
    { label: "milk in a jug", emoji: "🥛", bin: "hard" },
  ],
};

export const units: Unit[] = [
  {
    id: "flight-forces-ab",
    title: "Forces in Flight",
    emoji: "🪁",
    blurb: "Lift, weight, thrust and drag",
    standards: ab("5E 1.1", "how thrust, drag, lift and weight affect flying living things and objects"),
    parentNote: "The four forces of flight (lift and weight, thrust and drag) and how they balance for a bird, a kite or a plane, plus examples of technologies, including traditional ones, that use them.",
    generate: ({ difficulty = 2 } = {}) => withSort(FLIGHT, FLIGHT_SORT, difficulty),
  },
  {
    id: "buoyancy-ab",
    title: "Float or Sink?",
    emoji: "🛟",
    blurb: "Buoyant force in water and air",
    standards: ab("5E 1.2", "buoyant force, weight, and why things float or sink in a fluid"),
    parentNote: "Buoyant force as the upward push of a fluid, comparing it with weight to explain floating and sinking, and why shape matters for ships and boats.",
    generate: ({ difficulty = 2 } = {}) => withSort(BUOYANCY, BUOYANCY_SORT, difficulty),
  },
  {
    id: "measuring-matter-ab",
    title: "Measuring Matter",
    emoji: "⚖️",
    blurb: "Mass, volume, density and particles",
    standards: ab("5M 1.2", "mass, volume, density and compressibility, explained with the particle model"),
    parentNote: "Measuring mass (grams, kilograms) and volume (millilitres, litres), comparing density, why gases compress and solids do not, and how the particle model explains it.",
    generate: ({ difficulty = 2 } = {}) => withSort(PROPS, COMPRESS_SORT, difficulty),
  },
];

