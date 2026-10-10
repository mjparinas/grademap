import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { levelled, withSort, type Item } from "../ontario/g56-bank";
import { ab } from "./kit";

// Alberta Grade 6 Science: Matter (the particle model, heating and cooling) and Energy (forces and
// interactions, energy resources). Written for the Alberta learning outcomes 6M 1.1–1.3 and
// 6E 1.1–2.2. Units about forces and electricity that BC and Ontario already have are shared.

// ---------- Particles and heating (6M 1.1) ----------

const PARTICLES: Item[] = [
  { prompt: "What happens to the particles of a substance when it is heated?", right: "They move faster", wrong: ["They stop moving", "They disappear"], hint: "Heat gives particles more movement energy." },
  { prompt: "What happens to the particles of a substance when it is cooled?", right: "They move slower", wrong: ["They move faster", "They get bigger"], hint: "Cooling takes movement energy away." },
  { prompt: "All matter is made of…", right: "tiny particles", wrong: ["empty space only", "air"], hint: "The particle model of matter explains how matter behaves." },
  { prompt: "In a solid, the particles…", right: "are close together and vibrate in place", wrong: ["are far apart and fly around", "slide past each other freely"], hint: "Solids keep their shape." },
  { prompt: "In a liquid, the particles…", right: "are close but can slide past each other", wrong: ["are locked in place", "are far apart"], hint: "Liquids flow." },
  { prompt: "In a gas, the particles…", right: "are far apart and move in all directions", wrong: ["are locked in place", "stay in a pile"], hint: "Gases spread out to fill their container." },
  { prompt: "What is melting?", right: "A solid changing to a liquid", wrong: ["A liquid changing to a gas", "A gas changing to a liquid"], hint: "Heating a solid makes the particles move more." },
  { prompt: "What is freezing?", right: "A liquid changing to a solid", wrong: ["A solid changing to a liquid", "A gas changing to a liquid"], hint: "Cooling slows particles down until they stay in place." },
  { prompt: "What is evaporation?", right: "A liquid changing to a gas", wrong: ["A gas changing to a liquid", "A solid changing to a liquid"], hint: "A puddle dries as liquid water becomes water vapour." },
  { prompt: "What is condensation?", right: "A gas changing to a liquid", wrong: ["A liquid changing to a solid", "A solid changing to a gas"], hint: "Water drops form on a cold glass on a warm day." },
  { prompt: "What is a phase change?", right: "A change from one state of matter to another", wrong: ["A change in colour only", "A change in size only"], hint: "Examples are melting, freezing, evaporating and condensing." },
  { prompt: "When a solid is heated, the attractive forces between its particles…", right: "get weaker as the particles move faster", wrong: ["get stronger", "stay exactly the same"], hint: "Faster particles pull apart from each other more easily." },
  { prompt: "Which state of matter has the strongest attractive forces between particles?", right: "Solid", wrong: ["Liquid", "Gas"], hint: "That is why solids keep their shape." },
  { prompt: "A 100 g ice cube melts. What is the mass of the water?", right: "100 g", wrong: ["50 g", "200 g"], hint: "During a phase change the mass stays the same.", hard: true },
  { prompt: "During a phase change, which of these may change?", right: "Volume", wrong: ["Mass", "The number of particles"], hint: "The particles are rearranged, so the space they take up can change.", hard: true },
  { prompt: "Why does a balloon get smaller when it is put in a freezer?", right: "The gas particles slow down and move closer together", wrong: ["Some particles disappear", "The particles get smaller"], hint: "Cooling slows particles, so they take up less space.", hard: true },
  { prompt: "A pot of water boils on a stove. Where do the bubbles come from?", right: "Water changing to gas (water vapour)", wrong: ["Air melting", "Water changing to ice"], hint: "Boiling is fast evaporation throughout the liquid.", hard: true },
  { prompt: "Why does water vapour form drops on the cold bathroom mirror?", right: "The vapour loses heat and condenses into liquid", wrong: ["The mirror makes water", "The vapour freezes into ice"], hint: "Cooling a gas can change it to a liquid.", hard: true },
  { prompt: "A student heats a metal rod. How could the particle model explain what happens?", right: "The particles vibrate faster and push slightly farther apart", wrong: ["The particles melt first", "The particles shrink"], hint: "Heated particles move more.", hard: true },
];

// ---------- Temperature and thermometers (6M 1.2) ----------

const THERMOMETERS: Item[] = [
  { prompt: "What tool measures temperature?", right: "A thermometer", wrong: ["A ruler", "A balance"], hint: "It shows how hot or cold something is." },
  { prompt: "What unit do scientists in Canada use for temperature?", right: "Degrees Celsius (°C)", wrong: ["Kilograms", "Litres"], hint: "The symbol is °C." },
  { prompt: "At what temperature does water freeze or ice melt?", right: "0 °C", wrong: ["100 °C", "20 °C"], hint: "The Celsius scale is based on water." },
  { prompt: "At what temperature does water boil?", right: "100 °C", wrong: ["0 °C", "37 °C"], hint: "The top of the Celsius scale is water's boiling point." },
  { prompt: "A liquid thermometer works because the liquid inside…", right: "expands when heated and contracts when cooled", wrong: ["turns into a gas", "always stays the same size"], hint: "The liquid moves up and down the tube." },
  { prompt: "When a liquid thermometer is put in warm water, what happens to the liquid?", right: "It rises up the tube", wrong: ["It sinks to the bottom", "It stays still"], hint: "Heating makes liquids expand." },
  { prompt: "When a thermometer is moved from warm water to ice water, the liquid in it…", right: "falls", wrong: ["rises", "stays at the same level"], hint: "Cooling makes liquids contract." },
  { prompt: "Which temperature is closest to a comfortable room?", right: "20 °C", wrong: ["50 °C", "−20 °C"], hint: "Rooms feel comfortable at about 20 °C." },
  { prompt: "A cold winter day in Calgary might be −20 °C. Is this above or below the freezing point of water?", right: "Below", wrong: ["Above", "Exactly the same"], hint: "Negative degrees Celsius are below 0 °C." },
  { prompt: "Which temperature is closest to normal human body temperature?", right: "37 °C", wrong: ["10 °C", "100 °C"], hint: "It is a little above room temperature." },
  { prompt: "Why do many thermometers have a scale printed beside the tube?", right: "To read the temperature from the height of the liquid", wrong: ["To weigh the liquid", "To measure the volume of the room"], hint: "Each mark stands for a degree." },
  { prompt: "Which is the safest way to handle a glass thermometer?", right: "Hold it gently and never use it to stir", wrong: ["Swing it around", "Bite it to hold it"], hint: "Glass can break." },
  { prompt: "Which is hotter: 25 °C or 15 °C?", right: "25 °C", wrong: ["15 °C", "They are the same"], hint: "A larger number on the Celsius scale means warmer." },
  { prompt: "Temperature is related to…", right: "how fast the particles are moving", wrong: ["the colour of the object", "the object's shape"], hint: "Faster particles mean a higher temperature.", hard: true },
  { prompt: "Why does the Celsius scale use 0 and 100?", right: "They were set at water's freezing and boiling points", wrong: ["They are the temperatures of Mars", "They are two random numbers"], hint: "Anders Celsius based the scale on water.", hard: true },
  { prompt: "Water is at 40 °C. What is its state of matter?", right: "Liquid", wrong: ["Solid", "Gas"], hint: "It is above freezing and below boiling.", hard: true },
  { prompt: "A student wants to design a tool to measure temperature. Which idea uses a property of matter?", right: "A liquid that expands in a thin tube", wrong: ["A bigger ruler", "A louder bell"], hint: "Expansion and contraction are the basis of many thermometers.", hard: true },
  { prompt: "Water's temperature changes from 90 °C to 70 °C. What happened?", right: "It cooled by 20 degrees", wrong: ["It heated by 20 degrees", "It froze"], hint: "Subtract 70 from 90.", hard: true },
];

// ---------- Expansion, contraction and water (6M 1.3) ----------

const EXPANSION: Item[] = [
  { prompt: "What does expansion mean?", right: "Taking up more space", wrong: ["Taking up less space", "Disappearing"], hint: "Most materials expand when heated." },
  { prompt: "What does contraction mean?", right: "Taking up less space", wrong: ["Taking up more space", "Becoming heavier"], hint: "Most materials contract when cooled." },
  { prompt: "What do most materials do when they are heated?", right: "Expand", wrong: ["Contract", "Disappear"], hint: "The particles move faster and take up more room." },
  { prompt: "What do most materials do when they are cooled?", right: "Contract", wrong: ["Expand", "Turn red"], hint: "The particles move slower and get closer." },
  { prompt: "Why do bridges have small gaps called expansion joints?", right: "So the metal can expand in hot weather without bending", wrong: ["So cars can jump", "So birds can land"], hint: "The gaps leave room for expansion." },
  { prompt: "Why are sidewalks poured in sections with small gaps?", right: "To allow for expansion and contraction as the temperature changes", wrong: ["To make walking harder", "To save concrete only"], hint: "Without gaps they could crack." },
  { prompt: "What is unusual about water compared with most liquids?", right: "It expands when it freezes", wrong: ["It never changes state", "It cannot be heated"], hint: "Ice takes up more space than the same mass of liquid water." },
  { prompt: "Why does ice float on liquid water?", right: "Ice is less dense than liquid water", wrong: ["Ice is heavier", "Ice is made of air"], hint: "Water's volume is greater when it is solid." },
  { prompt: "A full bottle of water is left in a freezer. What may happen?", right: "The bottle may crack because the water expands as it freezes", wrong: ["The water shrinks and leaves a gap", "Nothing at all"], hint: "Ice takes up more room than liquid water." },
  { prompt: "In winter, a lake in Alberta freezes. Where does the ice form first?", right: "On the surface", wrong: ["At the bottom", "In the middle"], hint: "Ice floats, so it stays on top." },
  { prompt: "How does a layer of ice on a lake help fish?", right: "It acts like a blanket and keeps the water below from freezing solid", wrong: ["It heats the water", "It feeds the fish"], hint: "The ice sheet insulates the water.", hard: true },
  { prompt: "If ice were denser than liquid water, what would happen to lakes?", right: "They would freeze from the bottom up, harming aquatic life", wrong: ["Nothing would change", "They would never freeze"], hint: "Dense ice would sink.", hard: true },
  { prompt: "Why might engineers leave gaps in railway tracks or use special joints?", right: "Metal expands in summer heat and contracts in cold", wrong: ["Because gaps look nice", "To keep trains slow"], hint: "Materials change size with temperature.", hard: true },
  { prompt: "Potholes often form in spring. Water seeps into cracks in the road, freezes, then…", right: "expands and breaks the pavement apart", wrong: ["shrinks and fills the crack", "turns to oil"], hint: "Freezing water pushes on the pavement.", hard: true },
  { prompt: "Power lines sag more on a hot summer day than on a cold winter day. Why?", right: "The wires expand when heated", wrong: ["The wires get heavier", "The poles shrink"], hint: "Expansion makes the wires longer.", hard: true },
  { prompt: "Water pipes can burst in very cold weather. Why?", right: "The water inside expands as it freezes", wrong: ["The water contracts as it freezes", "The pipes get hotter"], hint: "Water is unusual because it expands when it freezes.", hard: true },
  { prompt: "A metal lid is stuck on a glass jar. Running hot water over the lid may help. Why?", right: "The metal expands more quickly and loosens", wrong: ["The jar turns to liquid", "The lid disappears"], hint: "Heating makes the metal expand.", hard: true },
  { prompt: "A solid block of ice and a block of liquid water have the same mass. Which has the greater volume?", right: "The ice", wrong: ["The liquid water", "They have the same volume"], hint: "Water expands as it freezes.", hard: true },
];

// ---------- Forces and interactions (6E 1.1, 6E 1.3) ----------

const FORCES: Item[] = [
  { prompt: "A force that comes from outside an object is called…", right: "an external force", wrong: ["an internal force", "a particle force"], hint: "A push from a hand is an external force." },
  { prompt: "A force inside an object that resists being changed is called…", right: "an internal force", wrong: ["an external force", "a gravity force"], hint: "External forces can cause internal forces." },
  { prompt: "Pulling on a rope or string creates which force?", right: "Tension", wrong: ["Compression", "Torsion"], hint: "Tension stretches and pulls." },
  { prompt: "A force that squeezes or squashes an object is…", right: "compression", wrong: ["tension", "torsion"], hint: "Think of squeezing a sponge." },
  { prompt: "A force that twists an object is…", right: "torsion", wrong: ["shear", "compression"], hint: "Wringing out a towel twists it." },
  { prompt: "A force that pushes parts of an object in opposite directions, bending or breaking it, is…", right: "shear", wrong: ["tension", "friction"], hint: "Scissors use shear to cut paper." },
  { prompt: "A force exerted on an object by a person or another object is a…", right: "applied force", wrong: ["gravity force", "magnetic force"], hint: "Pushing a door is an applied force." },
  { prompt: "A force that opposes the movement of surfaces that touch is…", right: "friction", wrong: ["tension", "thrust"], hint: "Friction slows a sliding sled." },
  { prompt: "A stretched rubber band pulls back. Which force is this?", right: "Elastic (spring) force", wrong: ["Friction", "Shear"], hint: "Springs and elastic objects push or pull back." },
  { prompt: "Stretching a spring shows which force at work?", right: "Elastic (spring) force", wrong: ["Torsion", "Compression only"], hint: "The spring tries to return to its shape." },
  { prompt: "Pressing down on a stack of foam blocks mainly causes…", right: "compression", wrong: ["tension", "shear"], hint: "The blocks are squeezed." },
  { prompt: "A child pulls a wagon with a rope. Which force is in the rope?", right: "Tension", wrong: ["Torsion", "Compression"], hint: "The rope is pulled tight." },
  { prompt: "For every action force there is…", right: "an equal and opposite reaction force", wrong: ["no other force", "a smaller force always"], hint: "This is Newton's third law." },
  { prompt: "You push on a wall with your hand. What happens to your hand?", right: "The wall pushes back on it", wrong: ["Nothing happens", "The wall pulls you in"], hint: "Action and reaction forces act on different objects." },
  { prompt: "A swimmer pushes backwards on the water. What is the reaction force?", right: "The water pushes the swimmer forward", wrong: ["The water pulls the swimmer backward", "The swimmer pushes the water forward"], hint: "The reaction force acts on the swimmer.", hard: true },
  { prompt: "When air rushes out of a balloon in one direction, the balloon moves in the opposite direction. Why?", right: "The air pushes back on the balloon (action and reaction)", wrong: ["The balloon floats in the air", "The air is lighter than the balloon"], hint: "The balloon pushes the air, and the air pushes the balloon.", hard: true },
  { prompt: "In an action–reaction pair, the two forces act on…", right: "two different objects", wrong: ["the same object", "no objects"], hint: "One object exerts the action. The other exerts the reaction.", hard: true },
  { prompt: "A skater pushes off a wall and glides away. Which force acts on the skater?", right: "The wall's reaction force on the skater", wrong: ["Nothing pushes the skater", "Only gravity acts"], hint: "The skater pushes the wall, so the wall pushes back.", hard: true },
  { prompt: "A bridge cable that holds the bridge is stretched. Which force acts in the cable?", right: "Tension", wrong: ["Torsion", "Shear"], hint: "The cable is pulled at both ends.", hard: true },
];

const FORCES_SORT: SortSet = {
  prompt: "Push-like or pull-like? Tap an item, then tap its basket.",
  hint: "Compression squeezes. Tension pulls.",
  bins: [
    { id: "compression", label: "Compression (squeezes)", emoji: "🗜️" },
    { id: "tension", label: "Tension (pulls)", emoji: "🪢" },
  ],
  items: [
    { label: "Squeezing a sponge", emoji: "🧽", bin: "compression" },
    { label: "Sitting on a cushion", emoji: "🛋️", bin: "compression" },
    { label: "Stepping on a spring", emoji: "🪜", bin: "compression" },
    { label: "A column holding up a roof", emoji: "🏛️", bin: "compression" },
    { label: "Tug of war rope", emoji: "🪢", bin: "tension" },
    { label: "A stretched rubber band", emoji: "🎀", bin: "tension" },
    { label: "A cable on a bridge", emoji: "🌉", bin: "tension" },
    { label: "A kite string", emoji: "🪁", bin: "tension" },
  ],
};

// ---------- Changes in shape (6E 1.2) ----------

const SHAPES: Item[] = [
  { prompt: "What is elasticity?", right: "The property that lets an object return to its shape", wrong: ["The property of staying bent forever", "The property of floating"], hint: "A rubber band is elastic." },
  { prompt: "What is plasticity?", right: "The property that makes a shape change permanent", wrong: ["The ability to bounce back", "The ability to glow"], hint: "Bending a paper clip leaves it bent." },
  { prompt: "A rubber band is stretched and let go. What happens?", right: "It returns to its shape", wrong: ["It stays stretched", "It melts"], hint: "That is a temporary change." },
  { prompt: "A paper clip is bent open and stays bent. This is a…", right: "permanent change", wrong: ["temporary change", "change of state"], hint: "The shape does not return." },
  { prompt: "Modelling clay is squished. The clay stays squished. What property is this?", right: "Plasticity", wrong: ["Elasticity", "Buoyancy"], hint: "It does not spring back." },
  { prompt: "A spring is stretched, then released. What property is this?", right: "Elasticity", wrong: ["Plasticity", "Density"], hint: "It springs back." },
  { prompt: "Which material is most elastic?", right: "A rubber band", wrong: ["A rock", "A piece of clay"], hint: "It stretches and returns." },
  { prompt: "Which material is most plastic (it keeps a new shape)?", right: "Modelling clay", wrong: ["A spring", "A rubber ball"], hint: "Clay holds a new shape." },
  { prompt: "A foam sponge is pressed and then released. This is a…", right: "temporary change", wrong: ["permanent change", "state change"], hint: "It goes back to its shape." },
  { prompt: "A tin can is crushed under a boot. This is a…", right: "permanent change", wrong: ["temporary change", "tension"], hint: "It stays crushed." },
  { prompt: "A trampoline is stretched when someone jumps on it. Which property helps it work?", right: "Elasticity", wrong: ["Plasticity", "Friction"], hint: "It returns to its flat shape." },
  { prompt: "Why do engineers choose steel springs for car seats?", right: "Steel springs are elastic and return to shape", wrong: ["Steel is plastic", "Steel is soft like clay"], hint: "A spring needs to go back to its shape." },
  { prompt: "A bicycle helmet crushes in a crash and absorbs the force. Why is this useful?", right: "The crushed foam takes energy from the impact", wrong: ["The helmet never changes", "It breaks the bicycle"], hint: "Permanent change can absorb force.", hard: true },
  { prompt: "If you stretch a rubber band too far, what might happen?", right: "It may break or stay stretched", wrong: ["It becomes stronger", "It disappears"], hint: "Every elastic material has a limit.", hard: true },
  { prompt: "A student bends a ruler slightly and lets go. It straightens. What is true?", right: "The change was temporary because the ruler is elastic", wrong: ["The change was permanent", "The ruler is plastic"], hint: "A small bend can be temporary.", hard: true },
  { prompt: "A student bends the same ruler too far, and it stays bent. What does this show?", right: "The force was large enough to cause a permanent change", wrong: ["The ruler gained mass", "The ruler became elastic"], hint: "Too much force can exceed the elastic limit.", hard: true },
  { prompt: "Which test would show whether a material is elastic?", right: "Stretch it and see if it returns to its original shape", wrong: ["Weigh it", "Colour it"], hint: "Elastic materials return.", hard: true },
  { prompt: "A plastic bag is stretched and stays thin and long. What does this show?", right: "Plasticity, a permanent change in shape", wrong: ["Elasticity", "Friction"], hint: "It does not return to its shape.", hard: true },
];

// ---------- Energy resources (6E 2.1, 6E 2.2) ----------

const RESOURCES: Item[] = [
  { prompt: "What is a renewable energy resource?", right: "One that can be naturally replaced", wrong: ["One that can only be used once", "One that is always a fossil fuel"], hint: "Sunlight and wind keep coming." },
  { prompt: "What is a non-renewable energy resource?", right: "One that will not be replaced for thousands or millions of years", wrong: ["One that never runs out", "One that comes only from the Sun"], hint: "Fossil fuels take millions of years to form." },
  { prompt: "Which of these is a renewable energy resource?", right: "Wind", wrong: ["Coal", "Natural gas"], hint: "Wind keeps blowing." },
  { prompt: "Which of these is a non-renewable energy resource?", right: "Oil", wrong: ["Sunlight", "Moving water"], hint: "Fossil fuels are non-renewable." },
  { prompt: "Which of these is a fossil fuel?", right: "Coal", wrong: ["Wind", "Solar"], hint: "Fossil fuels come from ancient plants and animals." },
  { prompt: "Hydro energy comes from…", right: "moving water", wrong: ["burning coal", "the heat of the Earth"], hint: "Dams use falling water to turn turbines." },
  { prompt: "Biomass energy comes from…", right: "plant or animal material, such as wood", wrong: ["uranium", "the Moon"], hint: "Burning wood is biomass energy." },
  { prompt: "Geothermal energy comes from…", right: "heat inside the Earth", wrong: ["wind", "the Moon's light"], hint: "Geo means Earth." },
  { prompt: "Which of these energy resources does Alberta use?", right: "Both renewable and non-renewable resources", wrong: ["Only wind", "Only coal"], hint: "Alberta uses fossil fuels, hydro, wind and biomass." },
  { prompt: "Which fossil fuel is found in Alberta's oil sands?", right: "Oil (bitumen)", wrong: ["Wood", "Wind"], hint: "Alberta has some of the world's largest oil reserves." },
  { prompt: "Which of these can be used before processing?", right: "Firewood burned for heat", wrong: ["Electricity", "Gasoline"], hint: "Wood can be burned just as it is." },
  { prompt: "Which of these needs processing before use?", right: "Crude oil made into gasoline", wrong: ["A breeze that fills a sail", "Sunlight on your face"], hint: "Oil is refined into fuels." },
  { prompt: "Wind can be used before processing to move a sailboat. How is it used after processing?", right: "To make electricity", wrong: ["To dig a mine", "To plant crops"], hint: "A turbine turns wind into electricity." },
  { prompt: "Which is a factor in choosing an energy resource?", right: "How much it costs and how it affects the environment", wrong: ["What colour it is", "Which country invented it"], hint: "Availability, society, the economy and the environment all matter.", hard: true },
  { prompt: "A community has a lot of strong, steady wind. What might they consider?", right: "Using wind turbines", wrong: ["Burning more coal", "Ignoring energy"], hint: "Available resources influence choices.", hard: true },
  { prompt: "Which is an advantage of renewable energy?", right: "It is not used up over time", wrong: ["It always costs nothing", "It works the same everywhere"], hint: "Some renewable sources depend on weather or place.", hard: true },
  { prompt: "Which is a disadvantage of burning fossil fuels?", right: "It releases gases that add to climate change", wrong: ["It makes ice", "It makes no heat"], hint: "Environmental impact is a factor.", hard: true },
  { prompt: "Responsible energy management after mining or drilling includes…", right: "restoring the land and managing waste", wrong: ["leaving the area as it is", "burying the waste anywhere"], hint: "Restoration and waste management reduce harm.", hard: true },
  { prompt: "What does it mean to say energy resources are 'processed'?", right: "They are changed into a form people can use, like electricity or fuel", wrong: ["They are left alone", "They are thrown away"], hint: "Many resources become electricity.", hard: true },
];

const RESOURCES_SORT: SortSet = {
  prompt: "Renewable or non-renewable? Tap an item, then tap its basket.",
  hint: "Renewable resources can be naturally replaced. Fossil fuels and nuclear fuel cannot.",
  bins: [
    { id: "renewable", label: "Renewable", emoji: "♻️" },
    { id: "non", label: "Non-renewable", emoji: "⛽" },
  ],
  items: [
    { label: "Wind", emoji: "🌬️", bin: "renewable" },
    { label: "Sunlight", emoji: "☀️", bin: "renewable" },
    { label: "Moving water", emoji: "💧", bin: "renewable" },
    { label: "Wood (biomass)", emoji: "🪵", bin: "renewable" },
    { label: "Coal", emoji: "⛏️", bin: "non" },
    { label: "Natural gas", emoji: "🔥", bin: "non" },
    { label: "Oil", emoji: "🛢️", bin: "non" },
    { label: "Uranium (nuclear)", emoji: "⚛️", bin: "non" },
  ],
};

export const units: Unit[] = [
  {
    id: "particles-heat-ab",
    title: "Particles and Heat",
    emoji: "🔥",
    blurb: "How heating and cooling change matter",
    standards: ab("6M 1.1", "the particle model, how particles move when heated or cooled, and phase changes"),
    parentNote: "Solids, liquids and gases in the particle model, faster particles when heated and slower when cooled, melting, freezing, evaporation and condensation, and why mass stays the same in a phase change.",
    generate: ({ difficulty = 2 } = {}) => levelled(PARTICLES, 8, difficulty),
  },
  {
    id: "thermometers-ab",
    title: "Measuring Temperature",
    emoji: "🌡️",
    blurb: "Thermometers and the Celsius scale",
    standards: ab("6M 1.2", "how liquid thermometers work, the Celsius scale and safe measuring"),
    parentNote: "Degrees Celsius, the freezing and boiling points of water, everyday temperatures, how a liquid thermometer works by expansion and contraction, and safe handling.",
    generate: ({ difficulty = 2 } = {}) => levelled(THERMOMETERS, 8, difficulty),
  },
  {
    id: "expansion-water-ab",
    title: "Expanding, Shrinking and Freezing Water",
    emoji: "🧊",
    blurb: "Why ice floats and roads need gaps",
    standards: ab("6M 1.3", "expansion and contraction, water's unusual property and how structures are designed for temperature change"),
    parentNote: "Most matter expands when heated and contracts when cooled, water expands when it freezes so ice floats, an icy surface insulates lakes, and engineers plan for sidewalks, bridges and roads.",
    generate: ({ difficulty = 2 } = {}) => levelled(EXPANSION, 8, difficulty),
  },
  {
    id: "forces-interactions-ab",
    title: "Forces in Interactions",
    emoji: "💪",
    blurb: "Pushes, pulls, tension and reaction",
    standards: ab("6E 1.1, 6E 1.3", "internal and external forces, tension, compression, shear, torsion, friction, and action and reaction forces"),
    parentNote: "External forces (applied, friction, elastic) and internal forces (tension, compression, shear, torsion), and that every action force has an equal and opposite reaction force.",
    generate: ({ difficulty = 2 } = {}) => withSort(FORCES, FORCES_SORT, difficulty),
  },
  {
    id: "shape-changes-ab",
    title: "Changing Shape",
    emoji: "🧲",
    blurb: "Elastic and plastic materials",
    standards: ab("6E 1.2", "plasticity, elasticity, and temporary and permanent changes in an object's shape"),
    parentNote: "Elasticity (a shape returns) and plasticity (a shape stays changed), temporary versus permanent changes, and how the properties of a material suit it to a job.",
    generate: ({ difficulty = 2 } = {}) => levelled(SHAPES, 8, difficulty),
  },
  {
    id: "energy-resources-ab",
    title: "Energy Resources",
    emoji: "🔋",
    blurb: "Renewable, non-renewable and Alberta",
    standards: ab("6E 2.1, 6E 2.2", "renewable and non-renewable energy resources, what influences their use, and using them before or after processing"),
    parentNote: "Renewable and non-renewable resources, the ones Alberta uses (fossil fuels, hydro, wind, biomass), factors like cost and environmental impact, processed and unprocessed resources, and responsible management.",
    generate: ({ difficulty = 2 } = {}) => withSort(RESOURCES, RESOURCES_SORT, difficulty),
  },
];
