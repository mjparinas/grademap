import type { SortSet } from "../bank";
import { fromParts, orderOf, q, type Item, type Level, type UnitParts } from "../grades/kit";
import { pick, randInt, sample, shuffle } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { levelOf, on, typeIn } from "./kit";

// Ontario Grade 8 science and technology (2022): STEM skills, cells, fluids, systems in action and
// water systems. BC's cells unit is shared (see g8.ts); these units cover the rest. All content is original.

/** A unit from a bank of items, with typed-answer calculations mixed in. */
function withCalc(parts: UnitParts, calcs: ((level: Level) => Question)[], count: number) {
  return (opts?: GenerateOptions): Question[] => {
    const level = levelOf(opts);
    const base = fromParts(parts, opts);
    const keep = [...base];
    for (let removed = 0; removed < count; removed++) {
      const i = keep.findIndex((x) => x.kind === "choice");
      if (i >= 0) keep.splice(i, 1);
    }
    const extra = sample(calcs, count).map((make) => make(level));
    return shuffle([...keep, ...extra]);
  };
}

const plain = (parts: UnitParts) => (opts?: GenerateOptions): Question[] => fromParts(parts, opts);

// ---------- STEM skills, coding and careers ----------

const STEM: Item[] = [
  q(1, "In a fair test, how many variables do you change at a time?", "one", ["all of them", "none", "as many as you like"], "Change one thing and keep the rest the same, so you know what caused the result."),
  q(1, "You test how the amount of water affects how tall bean plants grow. Which is the variable you change on purpose?", "the amount of water", ["the height of the plants", "the type of bean", "the size of the pot"], "The variable you change is the independent variable. Here it is the water."),
  q(1, "In that same test, which is the variable you measure?", "the height of the plants", ["the amount of water", "the type of bean", "the amount of light"], "The measured result is the dependent variable."),
  q(1, "Which should you wear to protect your eyes when heating a liquid in a science lab?", "safety goggles", ["sunglasses", "a baseball cap", "oven mitts"], "Splashes can hurt eyes, so goggles are essential."),
  q(1, "What should you do first if a glass beaker breaks in the lab?", "Tell your teacher and do not pick up the pieces yourself", ["Sweep it up with your hands", "Hide the pieces in the garbage", "Keep working and ignore it"], "Broken glass can cut you. Your teacher will clean it up safely."),
  q(1, "Which tool measures the volume of a liquid?", "a graduated cylinder", ["a balance", "a stopwatch", "a metre stick"], "A graduated cylinder has a scale marked in millilitres."),
  q(1, "What is a hypothesis?", "a testable prediction about what will happen and why", ["a final conclusion", "a list of materials", "a safety rule"], "A hypothesis is made before the experiment and is then tested."),
  q(2, "Why do scientists repeat their trials?", "to check that the results are reliable", ["to make the experiment longer", "to change the variables each time", "to avoid writing down data"], "If the same result keeps happening, we can trust it more."),
  q(2, "A student wants to find out how the angle of a ramp affects how far a toy car rolls. Which should stay the same in every trial?", "the car and the ramp surface", ["the angle of the ramp", "the distance the car rolls", "the number of trials"], "Only the angle should change. Keep everything else fixed."),
  q(2, "Which is an example of a controlled variable in a plant-growth test about light?", "the amount of water given to each plant", ["the hours of light each plant gets", "the height of each plant", "the number of leaves counted at the end"], "Controlled variables are kept the same so the test is fair."),
  q(2, "Which step of the engineering design process involves making and trying out a model of your solution?", "build and test a prototype", ["define the problem", "research other designs", "present the final results"], "A prototype is a first working model. Testing shows what to improve."),
  q(2, "A team's bridge model breaks at the joints. What should they do next in the design process?", "improve the design and test again", ["stop and call it finished", "hide the broken joints", "change the problem to an easier one"], "Engineers use test results to make the design better."),
  q(2, "Which question is best answered with a research process rather than a classroom experiment?", "How has a distant glacier changed over the last 100 years?", ["Does sugar dissolve faster in hot or cold water?", "Do bean plants grow taller with more light?", "How does ramp angle change a toy car's distance?"], "Some questions cannot be tested directly in class, so we gather information from reliable sources."),
  q(2, "Which of these best describes a reliable source for a research project?", "a science museum website with named experts and references", ["an unsigned post with no sources", "an advertisement for a product", "a rumour passed on in a chat group"], "Check who wrote it, what evidence they give and whether it is current."),
  q(2, "What is coding?", "writing instructions that a computer can follow", ["a way to make food last longer", "a kind of microscope", "a rule about lab safety"], "Code is a set of instructions, often called a program."),
  q(2, "A program controls a greenhouse. If the temperature is above 28 °C, it opens the vents. What is this an example of?", "a condition that triggers an action", ["a hypothesis", "a controlled variable", "a prototype"], "If-then rules let a computer system respond automatically."),
  q(2, "Why do skilled trades workers such as electricians and millwrights use science and technology?", "They apply ideas about forces, energy and materials to install and repair real systems.", ["They only use science in school.", "They do not need to follow safety rules.", "Machines do all of their thinking."], "Trades combine science knowledge with hands-on skill."),
  q(3, "Artificial intelligence (AI) systems are being used in many workplaces. Which is the best question to ask about their impact?", "Who benefits, who might be harmed and how can it be used fairly?", ["What colour is the computer?", "Is the new system faster than every old one?", "Can it be installed on Fridays?"], "Good questions look at benefits, risks and fairness for different people."),
  q(3, "Why is it important to include diverse people in science and technology work?", "Different experiences lead to new questions and better solutions.", ["Everyone must reach the same conclusion.", "It makes tests shorter.", "It removes the need for evidence."], "People bring different knowledge and ideas, and this strengthens science."),
  q(3, "Two-Eyed Seeing, described by Mi'kmaw Elder Albert Marshall, means…", "learning to see with the strengths of Indigenous knowledges and Western science together", ["using only one microscope eyepiece", "ignoring Indigenous knowledges", "replacing science with stories"], "It is a way to bring two ways of knowing together to solve problems."),
  q(3, "A student's graph shows plant height rising as light hours increase. Which conclusion is best supported?", "In this test, plants given more light grew taller.", ["More light always makes every plant grow taller.", "Light is the only thing plants need.", "Water has no effect on plants."], "A conclusion should match the evidence and not claim more than the test shows."),
  q(3, "A drone is used to spray crops only where sensors detect pests. How can this technology help the environment?", "It can reduce the amount of pesticide used.", ["It makes plants need no sunlight.", "It removes the need for any farmers.", "It stops all pests forever."], "Targeted spraying uses less chemical than covering a whole field."),
];

const DESIGN_ORDER = orderOf(
  "Put the steps of the engineering design process in order.",
  "Engineers define the need first, then research, design, build and test, and improve the solution.",
  [
    { id: "define", label: "Define the problem", emoji: "❓" },
    { id: "research", label: "Research and brainstorm ideas", emoji: "💡" },
    { id: "design", label: "Plan and design a solution", emoji: "📐" },
    { id: "build", label: "Build and test a prototype", emoji: "🔧" },
    { id: "improve", label: "Improve and share the result", emoji: "📣" },
  ],
);

const SAFETY_SORT: SortSet = {
  prompt: "Safe lab habit, or unsafe? Sort each action.",
  hint: "Safe habits protect you and others: goggles, tied-back hair, reporting spills. Unsafe habits include tasting materials and running.",
  bins: [
    { id: "safe", label: "Safe", emoji: "✅" },
    { id: "unsafe", label: "Unsafe", emoji: "⚠️" },
  ],
  items: [
    { label: "tie back long hair near a flame", emoji: "💇", bin: "safe" },
    { label: "report a spill right away", emoji: "🗣️", bin: "safe" },
    { label: "wear goggles when pouring liquids", emoji: "🥽", bin: "safe" },
    { label: "wash hands after the investigation", emoji: "🧼", bin: "safe" },
    { label: "taste a chemical to identify it", emoji: "👅", bin: "unsafe" },
    { label: "run between lab stations", emoji: "🏃", bin: "unsafe" },
    { label: "leave a hot plate on and walk away", emoji: "🔥", bin: "unsafe" },
    { label: "mix unknown liquids to see what happens", emoji: "🧪", bin: "unsafe" },
  ],
};

// ---------- Cells: organisms, technology and cell theory ----------

const CELL_TECH: Item[] = [
  q(1, "How many cells does a unicellular organism have?", "one", ["two", "thousands", "none"], "Uni- means one."),
  q(1, "Which of these is a unicellular organism?", "an amoeba", ["a maple tree", "an earthworm", "a frog"], "An amoeba is a single cell that lives in water."),
  q(1, "Which of these is multicellular?", "a maple tree", ["an amoeba", "a bacterium", "a yeast cell"], "Multicellular organisms are made of many cells."),
  q(1, "Which tool lets us see cells that are too small to see with our eyes alone?", "a microscope", ["a thermometer", "a barometer", "a balance"], "Microscopes make tiny things look larger."),
  q(1, "Who used the word “cell” in 1665 after looking at thin slices of cork under a microscope?", "Robert Hooke", ["Charles Darwin", "Louis Pasteur", "Isaac Newton"], "The little boxes in the cork reminded him of the small rooms called cells."),
  q(1, "Which statement is part of the cell theory?", "All living things are made of one or more cells.", ["Only animals are made of cells.", "Cells can form from non-living matter.", "Cells never divide."], "The cell theory also says cells are the basic unit of life and come from other cells."),
  q(2, "Which statement completes the cell theory? Cells are the basic unit of life, and…", "all cells come from other cells", ["all cells are the same size", "all cells have a cell wall", "all cells are visible without a microscope"], "New cells are made when existing cells divide."),
  q(2, "A group of similar cells that work together to do one job is called a…", "tissue", ["organelle", "organism", "membrane"], "Muscle tissue is made of muscle cells working together."),
  q(2, "Several tissues working together to do a job make up an…", "organ", ["organelle", "organism", "atom"], "The heart is an organ made of muscle, nerve and other tissues."),
  q(2, "How does a unicellular organism such as a paramecium meet its basic needs?", "Its one cell takes in food, removes waste and reproduces.", ["It uses a heart and lungs.", "It shares jobs among many specialized cells.", "It does not need food or energy."], "Everything a living thing needs must be done by the one cell."),
  q(2, "How do multicellular organisms meet their needs differently from unicellular ones?", "Specialized cells, tissues and organs share the jobs.", ["Each cell must do every job alone.", "They do not need food.", "They have no cell membranes."], "Specialization lets the body work efficiently."),
  q(2, "Which cell is matched with the correct job?", "muscle cell: contracts to cause movement", ["nerve cell: stores water for a leaf", "root hair cell: carries signals to the brain", "red blood cell: makes sugar from sunlight"], "A cell's structure suits its job."),
  q(2, "Yeast is used in baking bread. What kind of organism is yeast?", "a unicellular fungus", ["a multicellular plant", "a virus", "a mineral"], "Each yeast is a single cell."),
  q(2, "Why is a stain or dye sometimes added to a microscope slide?", "to make parts of the cell easier to see", ["to keep the cell alive forever", "to make the cell larger", "to remove the nucleus"], "Many cell parts are nearly clear until they are stained."),
  q(2, "An electron microscope compared with a light microscope can…", "show much smaller structures in greater detail", ["only show objects the size of a coin", "work without any sample", "only show colours"], "Better technology revealed organelles that light microscopes could not."),
  q(2, "The order from smallest to largest is cell, tissue, organ and then…", "organ system", ["organelle", "atom", "molecule"], "Organ systems, such as the digestive system, work together in an organism."),
  q(3, "Stem cells are important in medical research because they…", "can develop into different types of specialized cells", ["can only become skin cells", "do not divide", "are found only in plants"], "This ability may help repair damaged tissues."),
  q(3, "In 1961, Toronto scientists Ernest McCulloch and James Till provided the first evidence of…", "stem cells", ["the nucleus", "the cell wall", "antibiotics"], "Their work at the Ontario Cancer Institute began modern stem cell research."),
  q(3, "Which is an ethical question about gene editing in humans?", "Who should decide which changes to human genes are acceptable?", ["How many cells are in a drop of blood?", "What is the power of a microscope?", "Which organelle makes energy?"], "Ethical questions ask what is right and fair, not just what is possible."),
  q(3, "A farmer grows a crop with a gene added to resist insects. Which benefit is most likely?", "Fewer insecticide sprays may be needed.", ["The crop will need no water.", "The crop will not have any cells.", "The crop will grow without soil or light."], "Resistant crops can reduce chemical use, but people also study other effects."),
  q(3, "Which person would be most likely to raise an environmental concern about releasing gene-edited insects outdoors?", "an ecologist who studies wild populations", ["a patient waiting for a new medicine", "a company that makes the insects", "a student who likes microscopes"], "Different groups have different perspectives, and environmental scientists study effects on ecosystems."),
  q(3, "Which finding would best support the claim that two organisms are both multicellular?", "Both are made of many cells that have different specialized forms.", ["Both live in water.", "Both are green.", "Both are smaller than a pencil."], "Multicellular organisms have specialized cells working together."),
];

const CELL_ORDER = orderOf(
  "Order these from smallest to largest.",
  "Cells form tissues, tissues form organs, organs form organ systems, and systems make up an organism.",
  [
    { id: "cell", label: "Cell", emoji: "🔬" },
    { id: "tissue", label: "Tissue", emoji: "🧫" },
    { id: "organ", label: "Organ", emoji: "🫀" },
    { id: "system", label: "Organ system", emoji: "🧠" },
    { id: "organism", label: "Organism", emoji: "🧍" },
  ],
);

const ORGANISM_SORT: SortSet = {
  prompt: "Is each organism unicellular or multicellular?",
  hint: "Bacteria, amoebas, paramecia and yeast are single cells. Plants, fish and mushrooms are made of many cells.",
  bins: [
    { id: "uni", label: "Unicellular", emoji: "⚪" },
    { id: "multi", label: "Multicellular", emoji: "🧬" },
  ],
  items: [
    { label: "amoeba", emoji: "🦠", bin: "uni" },
    { label: "bacterium", emoji: "🔬", bin: "uni" },
    { label: "yeast", emoji: "🍞", bin: "uni" },
    { label: "paramecium", emoji: "💧", bin: "uni" },
    { label: "oak tree", emoji: "🌳", bin: "multi" },
    { label: "trout", emoji: "🐟", bin: "multi" },
    { label: "mushroom", emoji: "🍄", bin: "multi" },
    { label: "chickadee", emoji: "🐦", bin: "multi" },
  ],
};

const calcMagnify = (level: Level): Question => {
  const obj = pick(level === 1 ? [4, 10] : [4, 10, 40]);
  return typeIn(`A microscope has a 10× eyepiece and a ${obj}× objective lens. What is the total magnification?`, 10 * obj, "Multiply the eyepiece magnification by the objective magnification.", undefined, { suffix: "×" });
};
const calcCellWidth = (level: Level): Question => {
  const w = pick(level === 1 ? [100, 200] : [50, 100, 200, 250, 400]);
  const n = pick([4, 5, 8, 10]);
  return typeIn(`Under a microscope, the field of view is ${w * n} µm wide and ${n} identical cells fit across it in a row. How wide is one cell in µm?`, w, "Divide the width of the field of view by the number of cells.", undefined, { suffix: "µm" });
};

// ---------- Fluids: viscosity and flow ----------

const VISCOSITY: Item[] = [
  q(1, "What is viscosity?", "how much a fluid resists flowing", ["how much a fluid weighs", "how cold a fluid is", "how much light a fluid reflects"], "Thick fluids such as honey have a high viscosity."),
  q(1, "Which of these is a fluid?", "air", ["a rock", "a wooden block", "an iron nail"], "Fluids are materials that can flow, which means liquids and gases."),
  q(1, "Which fluid has the highest viscosity?", "honey", ["water", "rubbing alcohol", "air"], "Honey flows very slowly, so it resists flowing the most."),
  q(1, "Which fluid has the lowest viscosity?", "water", ["honey", "molasses", "peanut butter"], "Water flows quickly and easily."),
  q(1, "What usually happens to the viscosity of a liquid like syrup when it is warmed?", "It decreases, so it flows more easily.", ["It increases, so it flows more slowly.", "It stays exactly the same.", "It turns into a solid."], "Warmer particles move faster and slide past each other more easily."),
  q(1, "Which of these is a gas?", "oxygen", ["milk", "olive oil", "syrup"], "Gases flow and spread out to fill their container."),
  q(2, "Maya times how long it takes equal amounts of four liquids to flow down a ramp. Which liquid has the highest viscosity?", "the one that takes the longest", ["the one that takes the shortest", "the one with the lightest colour", "the one that is coldest"], "A more viscous liquid flows more slowly."),
  q(2, "Volumetric flow rate tells you…", "how much volume of fluid moves past a point each second", ["how heavy a fluid is", "how hot a fluid is", "how clear a fluid is"], "Flow rate = volume ÷ time, for example mL/s or L/min."),
  q(2, "Which change would make cold maple syrup flow faster?", "warming it", ["cooling it more", "putting it in a taller jar only", "stirring in nothing"], "Heating lowers the viscosity of most liquids."),
  q(2, "Why does paint get thinner and easier to spread when a little thinner is added?", "Its viscosity decreases.", ["Its viscosity increases.", "Its density becomes zero.", "It becomes a solid."], "Diluting a fluid makes it flow more easily."),
  q(2, "Which factor does NOT directly change how fast a liquid flows through a pipe?", "the colour of the liquid", ["the width of the pipe", "the viscosity of the liquid", "the length of the pipe"], "Narrow, long pipes and thick fluids slow flow. Colour does not matter."),
  q(2, "Which pipe lets the most water flow in the same time, if the pressure is the same?", "a wide pipe", ["a narrow pipe", "a pipe full of gravel", "a pipe that is pinched shut"], "There is more room for fluid to move through a wider opening."),
  q(2, "Which is a liquid that flows much more slowly than water?", "motor oil", ["rubbing alcohol", "air", "steam"], "Motor oil is more viscous than water."),
  q(2, "Why do engineers choose a lubricating oil with the right viscosity for an engine?", "It must flow to every part and still coat moving surfaces.", ["It must be a solid to protect the engine.", "It should be as thin as air.", "Viscosity does not matter for oil."], "Oil that is too thick flows poorly, and oil that is too thin does not protect the parts."),
  q(3, "A tap fills a 6 L bucket in 30 seconds. Another tap fills a 4 L bucket in 10 seconds. Which tap has the greater flow rate?", "the second tap, at 0.4 L/s", ["the first tap, at 0.2 L/s", "the first tap, at 0.4 L/s", "They have the same rate."], "Divide each volume by its time: 6 ÷ 30 = 0.2 L/s and 4 ÷ 10 = 0.4 L/s."),
  q(3, "Two liquids are poured down the same ramp. Liquid A takes 12 s and liquid B takes 4 s. What can you conclude?", "Liquid A has the higher viscosity.", ["Liquid B has the higher viscosity.", "Liquid A has the lower density.", "Both have the same viscosity."], "The slower liquid resists flowing more, so it is more viscous."),
  q(3, "Why is a pipeline moving thick crude oil often heated?", "Warming lowers the viscosity so the oil flows more easily.", ["Warming raises the viscosity so the oil flows faster.", "Warming turns the oil into a gas.", "Heating makes the pipeline wider."], "Thick fluids flow better when warm."),
];

const calcFlow = (level: Level): Question => {
  const rate = pick(level === 1 ? [5, 10, 20] : [5, 10, 15, 20, 25, 50]);
  const t = pick([10, 20, 30, 40]);
  return typeIn(`A pump moves ${rate * t} mL of water in ${t} s. What is the flow rate in mL/s?`, rate, "Flow rate = volume ÷ time.", undefined, { suffix: "mL/s" });
};
const calcFlowVolume = (level: Level): Question => {
  const rate = pick(level === 1 ? [5, 10] : [5, 10, 15, 20, 25]);
  const t = pick([4, 6, 8, 10]);
  return typeIn(`A tap has a flow rate of ${rate} mL/s. How many mL flow out in ${t} s?`, rate * t, "Volume = flow rate × time.", undefined, { suffix: "mL" });
};

// ---------- Fluids: density and buoyancy ----------

const DENSITY: Item[] = [
  q(1, "Density compares an object's mass with its…", "volume", ["colour", "speed", "temperature"], "Density is how much mass is packed into a given volume."),
  q(1, "Which formula gives density?", "mass ÷ volume", ["volume ÷ mass", "mass × volume", "mass + volume"], "Density = mass ÷ volume."),
  q(1, "Which unit could be used for density?", "g/cm³", ["g", "cm³", "N"], "Grams per cubic centimetre is mass divided by volume."),
  q(1, "A block of wood floats on water. What does this tell you about the wood?", "It is less dense than water.", ["It is more dense than water.", "It has no mass.", "It has no volume."], "Things float in a fluid when they are less dense than the fluid."),
  q(1, "A rock sinks in water. What does this tell you about the rock?", "It is more dense than water.", ["It is less dense than water.", "It is a gas.", "It has no mass."], "Things sink in a fluid when they are denser than the fluid."),
  q(1, "Vegetable oil floats on water. Which has the greater density?", "water", ["vegetable oil", "They are the same.", "Neither has density."], "The less dense liquid floats on top of the denser one."),
  q(1, "Which state of matter usually has the lowest density?", "gas", ["liquid", "solid", "They are all the same."], "Gas particles are very far apart."),
  q(2, "Why is a solid usually denser than the same substance as a gas?", "Its particles are packed much closer together.", ["Its particles are larger.", "Its particles do not move.", "It has fewer particles in every volume."], "The particle theory says closer particles mean more mass in each volume."),
  q(2, "Ice floats in liquid water. What does this tell you?", "Ice is less dense than liquid water.", ["Ice has more mass than the same volume of water.", "Ice is a gas.", "Water particles do not move."], "Water is unusual because its solid form is less dense than its liquid form."),
  q(2, "Two cubes have the same volume. Cube A has a mass of 100 g and cube B has a mass of 200 g. Which is denser?", "cube B", ["cube A", "They have the same density.", "It cannot be known."], "With equal volumes, the greater mass means the greater density."),
  q(2, "A large steel ship floats even though steel is denser than water. Why?", "The hull encloses a lot of air, so the ship's overall density is less than water's.", ["Steel becomes lighter in water.", "The engines hold the ship up.", "Only small objects sink."], "Overall density includes all the air inside the hull."),
  q(2, "A hot-air balloon rises because the heated air inside it is…", "less dense than the cooler air around it", ["more dense than the cooler air around it", "made of a different gas", "not made of particles"], "Warm air expands, so the same mass takes up more volume and is less dense."),
  q(2, "A block of aluminum is cut in half. What is the density of each half?", "the same as the original block", ["half the original", "double the original", "zero"], "Mass and volume both halve, so their ratio stays the same."),
  q(2, "Water has a density of 1.00 g/cm³. Which of these would float in it?", "cork (0.24 g/cm³)", ["aluminum (2.7 g/cm³)", "iron (7.9 g/cm³)", "gold (19.3 g/cm³)"], "An object floats if its density is less than the density of the fluid."),
  q(2, "Water has a density of 1.00 g/cm³. Which of these would sink in it?", "aluminum (2.7 g/cm³)", ["cork (0.24 g/cm³)", "pine wood (0.5 g/cm³)", "vegetable oil (0.92 g/cm³)"], "An object sinks if its density is greater than the density of the fluid."),
  q(3, "A solid floats in seawater (1.03 g/cm³) but sinks in vegetable oil (0.92 g/cm³). Which could be its density?", "0.98 g/cm³", ["0.85 g/cm³", "1.10 g/cm³", "2.00 g/cm³"], "It must be less than 1.03 to float in seawater and more than 0.92 to sink in oil."),
  q(3, "Why does a person float more easily in the very salty Dead Sea than in a freshwater lake?", "Salty water is denser, so it holds a person up more.", ["Salt makes people lighter.", "Salty water has no particles.", "Freshwater is thicker."], "Dissolved salt adds mass to the water, raising its density."),
  q(3, "A submarine fills its ballast tanks with water to dive. What happens to its overall density?", "It increases, so the submarine sinks.", ["It decreases, so the submarine sinks.", "It stays the same, so the submarine sinks.", "It becomes zero."], "Adding water adds mass without adding volume."),
  q(3, "A lake freezes from the top down. Which fact about density helps explain this?", "Ice is less dense than liquid water, so it stays at the top.", ["Ice is denser than water, so it sinks.", "Cold water has no particles.", "Ice has no volume."], "The ice layer floats and protects the water below it."),
  q(3, "Two liquids do not mix. Liquid X floats on liquid Y. What do you know?", "Liquid X is less dense than liquid Y.", ["Liquid X is more dense than liquid Y.", "Liquid X is a gas.", "Liquid X has more volume."], "The less dense fluid rests on top of the denser one."),
  q(3, "A metal sphere has a density of 7.9 g/cm³. It is placed in a pool of mercury (13.6 g/cm³). What happens?", "It floats.", ["It sinks.", "It dissolves.", "It turns into a gas."], "Compare densities: 7.9 is less than 13.6, so the sphere floats."),
];

const LAYER_ORDER = orderOf(
  "Pour these liquids into a tall jar. Order them from the bottom layer to the top layer.",
  "The densest liquid sinks to the bottom and the least dense floats on top.",
  [
    { id: "mercury", label: "Mercury (13.6 g/cm³)", emoji: "⚪" },
    { id: "honey", label: "Honey (1.42 g/cm³)", emoji: "🍯" },
    { id: "water", label: "Water (1.00 g/cm³)", emoji: "💧" },
    { id: "oil", label: "Vegetable oil (0.92 g/cm³)", emoji: "🫒" },
  ],
);

const FLOAT_SORT: SortSet = {
  prompt: "Water has a density of 1.00 g/cm³. Does each material float or sink in water?",
  hint: "A material floats if its density is less than 1.00 g/cm³ and sinks if it is greater.",
  bins: [
    { id: "float", label: "Floats", emoji: "🛟" },
    { id: "sink", label: "Sinks", emoji: "⚓" },
  ],
  items: [
    { label: "cork (0.24 g/cm³)", emoji: "🍾", bin: "float" },
    { label: "pine wood (0.5 g/cm³)", emoji: "🪵", bin: "float" },
    { label: "ice (0.92 g/cm³)", emoji: "🧊", bin: "float" },
    { label: "vegetable oil (0.92 g/cm³)", emoji: "🫒", bin: "float" },
    { label: "aluminum (2.7 g/cm³)", emoji: "🥫", bin: "sink" },
    { label: "iron (7.9 g/cm³)", emoji: "🔩", bin: "sink" },
    { label: "copper (8.9 g/cm³)", emoji: "🪙", bin: "sink" },
    { label: "lead (11.3 g/cm³)", emoji: "🎣", bin: "sink" },
  ],
};

const calcDensity = (level: Level): Question => {
  const d = pick(level === 1 ? [2, 3, 5] : [2, 3, 4, 5, 6, 8, 9]);
  const v = randInt(2, level === 1 ? 6 : 10);
  return typeIn(`A block has a mass of ${d * v} g and a volume of ${v} cm³. What is its density in g/cm³?`, d, "Density = mass ÷ volume.", undefined, { suffix: "g/cm³" });
};
const calcMass = (level: Level): Question => {
  const d = pick([2, 3, 4, 5, 8]);
  const v = randInt(3, level === 1 ? 6 : 12);
  return typeIn(`A metal has a density of ${d} g/cm³. What is the mass of ${v} cm³ of it, in g?`, d * v, "Mass = density × volume.", undefined, { suffix: "g" });
};
const calcVolume = (level: Level): Question => {
  const d = pick([2, 3, 4, 5]);
  const v = randInt(3, level === 1 ? 6 : 12);
  return typeIn(`A sample of a liquid has a density of ${d} g/mL and a mass of ${d * v} g. What is its volume in mL?`, v, "Volume = mass ÷ density.", undefined, { suffix: "mL" });
};

// ---------- Fluids: compressibility, pressure and Pascal's law ----------

const PRESSURE: Item[] = [
  q(1, "Compressibility is how easily a fluid can be…", "squeezed into a smaller volume", ["heated", "poured", "frozen"], "Gases compress easily. Liquids hardly compress at all."),
  q(1, "Compared with gases, liquids are…", "much harder to compress", ["much easier to compress", "impossible to pour", "always colder"], "The particles in a liquid are already close together."),
  q(1, "You push the plunger of a sealed syringe full of air. What happens to the air?", "It is squeezed into a smaller space.", ["It disappears.", "It turns into a liquid at once.", "Its particles are crushed."], "The particles move closer together."),
  q(1, "You push the plunger of a sealed syringe full of water. The water's volume…", "hardly changes", ["is cut in half", "doubles", "becomes zero"], "Liquids are nearly incompressible."),
  q(1, "Which technology depends on compressed air?", "a scuba tank", ["a wooden ladder", "a paper clip", "a brick wall"], "A lot of air can be squeezed into a small tank."),
  q(2, "Pressure is the amount of force acting on each…", "unit of area", ["unit of time", "unit of mass", "unit of volume"], "Pressure = force ÷ area."),
  q(2, "A sharp knife cuts better than a dull one with the same push. Why?", "The force acts on a smaller area, so the pressure is greater.", ["The force is larger.", "The knife is heavier.", "The pressure is zero."], "A smaller area makes the same force produce more pressure."),
  q(2, "Snowshoes help you walk on deep snow. Why?", "They spread your weight over a larger area, so the pressure is lower.", ["They make you lighter.", "They make the snow colder.", "They increase the pressure on the snow."], "More area means less pressure for the same weight."),
  q(2, "Pascal's law says that pressure applied to a confined fluid is…", "transmitted equally in all directions", ["lost right away", "sent only upward", "sent only to the nearest side"], "Pressure spreads evenly through an enclosed fluid."),
  q(2, "A sealed rigid container of gas is heated. What happens to the pressure inside?", "It increases.", ["It decreases.", "It stays the same.", "It becomes zero."], "Faster particles hit the walls harder and more often."),
  q(2, "A sealed syringe of air is squeezed to half its volume at a constant temperature. What happens to the pressure?", "It increases.", ["It decreases.", "It stays the same.", "It becomes zero."], "The same particles hit the walls more often in a smaller space."),
  q(2, "Why are liquids hard to compress?", "Their particles are already close together.", ["Their particles are very far apart.", "Their particles do not exist.", "Their particles are all frozen in place."], "There is very little empty space to squeeze out."),
  q(2, "A hydraulic jack lifts a car. Which property of liquids makes this possible?", "They are almost incompressible and transmit pressure.", ["They are easy to compress.", "They have no mass.", "They expand when pushed."], "Pressure goes through the liquid to the larger piston."),
  q(2, "A balloon is moved from a warm room to a freezer. If the pressure stays the same, what happens to its volume?", "It decreases.", ["It increases.", "It stays the same.", "It becomes a liquid at once."], "Cooling slows the particles, so the gas takes up less space."),
  q(3, "In a hydraulic system, the pressure on the small piston is 50 kPa. If friction is ignored, what is the pressure on the large piston?", "50 kPa", ["500 kPa", "5 kPa", "0 kPa"], "By Pascal's law, the pressure is the same everywhere in the fluid."),
  q(3, "Why can a hydraulic lift produce a larger output force than the input force?", "The same pressure acts over a larger piston area.", ["The liquid creates extra energy.", "The large piston is lighter.", "The fluid is compressed."], "Force = pressure × area, so a larger area gives a larger force."),
  q(3, "A diver feels more pressure at 30 m than at 5 m. Why?", "There is more water above pushing down.", ["Water gets colder near the surface.", "The air above is thicker.", "The diver's mass changes."], "Pressure in a fluid increases with depth."),
  q(3, "A weather balloon expands as it rises through the atmosphere. Why?", "The air pressure outside is lower, so the gas inside expands.", ["The gas inside is being squeezed.", "The outside air gets denser.", "The gas particles get bigger."], "Lower outside pressure lets the gas spread out."),
  q(3, "A bicycle pump becomes warm when you pump quickly. What is one reason?", "Compressing the air gives its particles more energy.", ["Air particles stop moving.", "The air becomes a liquid.", "The pump creates matter."], "Squeezing a gas can raise its temperature."),
];

const COMPRESS_SORT: SortSet = {
  prompt: "Is each fluid easy to compress, or very hard to compress?",
  hint: "Gases are easy to compress because their particles are far apart. Liquids are very hard to compress.",
  bins: [
    { id: "easy", label: "Easy to compress", emoji: "🎈" },
    { id: "hard", label: "Very hard to compress", emoji: "🧱" },
  ],
  items: [
    { label: "air in a bicycle pump", emoji: "🚲", bin: "easy" },
    { label: "gas in a scuba tank", emoji: "🤿", bin: "easy" },
    { label: "helium in a balloon", emoji: "🎈", bin: "easy" },
    { label: "steam", emoji: "♨️", bin: "easy" },
    { label: "brake fluid", emoji: "🛞", bin: "hard" },
    { label: "water in a sealed bottle", emoji: "💧", bin: "hard" },
    { label: "hydraulic oil", emoji: "🛢️", bin: "hard" },
    { label: "cooking oil", emoji: "🫒", bin: "hard" },
  ],
};

const calcPascal = (level: Level): Question => {
  const f1 = pick(level === 1 ? [10, 20, 30] : [10, 20, 25, 40, 50]);
  const a1 = pick([2, 4, 5]);
  const k = pick(level === 1 ? [2, 3, 5] : [2, 3, 4, 5, 6, 8]);
  return typeIn(`A hydraulic press has a small piston with an area of ${a1} cm² and a large piston with an area of ${a1 * k} cm². A force of ${f1} N pushes on the small piston. What force does the large piston exert, in N? Ignore friction.`, f1 * k, "The pressure is the same on both pistons, so the force grows by the same ratio as the area.", undefined, { suffix: "N" });
};
const calcPressure = (level: Level): Question => {
  const a = pick(level === 1 ? [2, 5] : [2, 4, 5, 10]);
  const p = pick([20, 50, 100, 200]);
  return typeIn(`A force of ${a * p} N pushes on an area of ${a} m². What is the pressure in Pa (N/m²)?`, p, "Pressure = force ÷ area.", undefined, { suffix: "Pa" });
};

// ---------- Fluids: hydraulic and pneumatic systems ----------

const HYDRAULICS: Item[] = [
  q(1, "A hydraulic system uses a…", "liquid, usually oil", ["compressed gas", "solid rod only", "magnet"], "Hydraulic systems transmit force through a liquid."),
  q(1, "A pneumatic system uses a…", "compressed gas, usually air", ["liquid, usually oil", "wooden lever", "battery"], "Pneumatic comes from a Greek word for air."),
  q(1, "Which part of a car uses a hydraulic system to stop the car?", "the brakes", ["the headlights", "the radio", "the seat covers"], "Pressing the pedal pushes brake fluid to the wheels."),
  q(1, "Which tool is powered by compressed air?", "a jackhammer", ["a hydraulic excavator arm", "a bicycle chain", "a hand saw"], "Air pressure drives the hammer up and down."),
  q(1, "In your body, which fluid flows through blood vessels?", "blood", ["air", "oil", "lymph only"], "The heart pumps blood through the body."),
  q(2, "Why do hydraulic systems use liquids instead of gases?", "Liquids are almost incompressible, so force is passed on strongly and quickly.", ["Liquids are lighter than gases.", "Liquids can be squeezed easily.", "Gases cannot be used in machines."], "Compressing a gas wastes some of the force."),
  q(2, "Why do pneumatic systems often have a cushioned, springy action?", "Compressed gas squeezes and then expands again.", ["The gas is a solid.", "The gas cannot move.", "The gas is hot."], "A compressible fluid acts a bit like a spring."),
  q(2, "A pneumatic system leaks. Compared with a hydraulic leak, what is likely true?", "Air escapes without leaving oil on the ground.", ["It always leaves a mess of oil.", "It can only lift the heaviest loads.", "It makes water."], "Air leaks are noisy and waste energy, but they do not spill oil."),
  q(2, "A valve in a hydraulic or pneumatic system is used to…", "regulate or direct the flow of the fluid", ["make the fluid colder", "change the fluid into a solid", "store the fluid forever"], "Valves open, close or redirect the flow."),
  q(2, "Which part of the heart has a job like a valve in a machine?", "the heart valves that keep blood flowing one way", ["the skin of the heart", "the blood itself", "the ribs"], "Valves stop fluid flowing backward."),
  q(2, "How does the heart act like the pump in a hydraulic system?", "It pushes fluid through a network of tubes.", ["It stores air in tanks.", "It changes the fluid into a solid.", "It removes all pressure."], "Both pumps create the pressure that moves a fluid."),
  q(2, "When you breathe in, your diaphragm moves down. What happens to the pressure in your chest?", "It decreases, so air flows in.", ["It increases, so air flows in.", "It stays the same, so air flows in.", "It increases, so air flows out."], "Air flows from higher pressure outside to lower pressure inside."),
  q(2, "A tap is turned to let more water through. How is the tap regulating flow?", "By changing the size of the opening", ["By changing the colour of the water", "By changing the density of the water", "By removing the pressure"], "A wider opening lets more fluid pass."),
  q(3, "An excavator lifts a very heavy load. Why is a hydraulic system a good choice?", "Liquids transmit large forces with little loss.", ["Liquids are compressible, which saves energy.", "Hydraulic fluid is lighter than air.", "No pump is needed."], "The incompressible liquid passes pressure to a large piston."),
  q(3, "Why can a hydraulic leak be a bigger environmental concern than an air leak?", "Hydraulic oil can pollute soil and water.", ["Air leaks are always hotter.", "Oil is lighter than air.", "Hydraulic systems do not leak."], "Oil can spread and be hard to clean."),
  q(3, "Large trucks and buses often use air brakes. What is one advantage of air as the working fluid?", "Air is free, plentiful and does not spill.", ["Air is denser than oil.", "Air cannot be compressed.", "Air is more viscous than brake fluid."], "A leak in an air system simply releases air."),
  q(3, "In plants, water moves from roots to leaves through tiny tubes. How is this like a fluid system in a machine?", "Fluid moves through pipe-like channels to where it is needed.", ["Plants use hydraulic oil.", "Plants use compressed air tanks.", "Water in plants does not flow."], "Living things also use fluid flow, though their 'pumps' and 'valves' are biological."),
];

const HYDRAULIC_SORT: SortSet = {
  prompt: "Does each machine mainly use a hydraulic system or a pneumatic system?",
  hint: "Hydraulic systems use a liquid such as oil. Pneumatic systems use compressed air.",
  bins: [
    { id: "hydraulic", label: "Hydraulic (liquid)", emoji: "🛢️" },
    { id: "pneumatic", label: "Pneumatic (air)", emoji: "💨" },
  ],
  items: [
    { label: "a car's brakes", emoji: "🚗", bin: "hydraulic" },
    { label: "an excavator arm", emoji: "🏗️", bin: "hydraulic" },
    { label: "a garage car lift", emoji: "🔧", bin: "hydraulic" },
    { label: "an airplane's landing gear", emoji: "✈️", bin: "hydraulic" },
    { label: "a jackhammer", emoji: "🔨", bin: "pneumatic" },
    { label: "an air-powered nail gun", emoji: "🪛", bin: "pneumatic" },
    { label: "air brakes on a transport truck", emoji: "🚛", bin: "pneumatic" },
    { label: "an air-powered tire wrench", emoji: "🛞", bin: "pneumatic" },
  ],
};

// ---------- Fluids and society ----------

const FLUID_SOCIETY: Item[] = [
  q(1, "What is a fluid spill?", "an accidental release of a liquid or gas into the environment", ["a planned science experiment", "a type of weather", "a kind of cleaning tool"], "Oil, fuel and chemical spills are examples."),
  q(1, "What can oil on the surface of the water do to birds and mammals?", "coat feathers and fur so they cannot stay warm", ["make them grow faster", "turn the water into a solid", "help them swim better"], "Oil damages the natural protection that feathers and fur give."),
  q(1, "Which tool is used to keep a floating oil spill from spreading?", "a floating boom", ["a sponge mop", "a fishing net", "a fan"], "A boom is a floating barrier."),
  q(1, "Hydroelectric dams use which fluid to make electricity?", "flowing water", ["compressed air", "natural gas only", "mercury"], "Moving water turns turbines."),
  q(2, "Why can cleaning up a spill on water be difficult?", "The spill can spread quickly, and weather and remote locations make cleanup hard.", ["Water absorbs all spills.", "Oil is always easy to see.", "Spills clean themselves in a day."], "Cleanup needs trained crews and special equipment."),
  q(2, "Which is an economic impact of a large spill near the coast?", "lost income from fishing and tourism", ["new fish grow overnight", "the price of the oil drops to zero", "all businesses benefit"], "Closed beaches and fishing areas mean lost work."),
  q(2, "A spill happens in a river used by a First Nation for drinking water and fishing. What is a likely impact?", "Safe water and traditional foods may be put at risk.", ["The river becomes cleaner.", "Fishing is not affected at all.", "No community is affected."], "People who depend on the land and water can be affected first."),
  q(2, "Which technology uses the properties of fluids to deliver clean water to homes?", "a pumping station and water tower", ["a bicycle chain", "a wooden fence", "a paperclip"], "Pumps and elevated tanks create the pressure that pushes water through pipes."),
  q(2, "A pipeline moves liquids over long distances. Which action best helps prevent leaks?", "regular inspections and maintenance", ["ignoring small cracks", "removing all valves", "making the pipe thinner"], "Prevention is usually easier and cheaper than cleanup."),
  q(2, "Which is an environmental impact of a hydroelectric dam?", "It can flood land and change fish habitat.", ["It always removes all rivers.", "It makes more oil.", "It has no effect on water."], "Dams change how rivers flow."),
  q(2, "What is a benefit of hydroelectric power?", "It makes electricity without burning fuel.", ["It never affects ecosystems.", "It is free to build.", "It works without water."], "Operating a dam produces few greenhouse gases, though building it has impacts."),
  q(3, "What does “remediation” mean after a spill?", "cleaning up and restoring the damaged area", ["causing a second spill", "measuring the density of oil", "making a map"], "Remediation can take years and be very costly."),
  q(3, "Why might Indigenous knowledge help when planning for spill response?", "Communities who have lived on the land and water for generations know local conditions and what needs protecting.", ["Indigenous knowledge is never relevant to science.", "Every nation has identical knowledge.", "Only visitors know the area."], "Local knowledge holders can help identify places of concern, though each nation's knowledge and priorities are its own."),
  q(3, "People disagree about a new pipeline. Which approach best considers different points of view?", "Listen to community members, workers, businesses and Indigenous nations before deciding.", ["Ask only the company that wants to build it.", "Ask nobody and decide quickly.", "Only count the number of pipes."], "A fair decision includes the people most affected."),
  q(3, "Which is a long-term cost of a large spill that is not paid right away?", "monitoring the area and restoring habitat for years", ["buying one boom", "a single day of cleaning", "printing a poster"], "Recovery and monitoring continue long after the spill."),
  q(3, "Which innovation reduces the chance of spills from tanker ships?", "double-hulled ships", ["single thin hulls", "ships without maps", "ships with no crew training"], "A second hull adds protection if the outer one is damaged."),
  q(3, "Why is it important to have emergency plans before a spill happens?", "Quick action limits how far the fluid spreads.", ["Plans make spills impossible.", "Plans make fluids lighter.", "Plans remove the need for cleanup crews."], "Speed matters during a spill."),
];

// ---------- Systems in action ----------

const SYSTEMS: Item[] = [
  q(1, "A system is a set of parts that…", "work together to do a job", ["never change", "all look the same", "work alone"], "In a system, each part has a role."),
  q(1, "Which is an example of a mechanical system?", "a bicycle", ["a pond ecosystem", "the water cycle", "the circulatory system"], "A bicycle's parts move and transfer force."),
  q(1, "Which is an example of a biological system?", "the digestive system", ["a toaster", "a bridge", "a drone"], "Living things have organ systems."),
  q(1, "What is an input of a system?", "something that goes into the system, such as energy or materials", ["the final product", "the waste only", "the name of the system"], "Outputs are what come out."),
  q(1, "A blender takes in electrical energy. Which is a useful output?", "chopped and mixed food", ["a plugged-in cord", "the on switch", "the lid"], "The output is what the system produces."),
  q(1, "Why do machines have warning labels and manuals?", "to help people use them safely", ["to make them look bigger", "to slow them down", "to make them cost less"], "Information helps consumers keep systems safe."),
  q(2, "A dairy plant takes in raw milk and gives out packaged milk. What is the purpose of this system?", "to turn raw milk into safe, packaged food", ["to make milk colder only", "to make plastic", "to measure rainfall"], "A system's purpose is the job it does."),
  q(2, "Why is milk pasteurized?", "Heating kills harmful micro-organisms.", ["It makes milk less white.", "It makes milk freeze.", "It removes all the water."], "Pasteurization makes milk safer without changing it much."),
  q(2, "Why are canned foods heated after being sealed?", "to kill micro-organisms so the food does not spoil", ["to make the can lighter", "to turn the food into a gas", "to make labels stick"], "Heat and a tight seal keep food safe for a long time."),
  q(2, "A thermostat has a sensor. What does the sensor do?", "measures temperature so the furnace can turn on or off", ["heats the room directly", "makes the furnace quieter", "cleans the air"], "Sensors give a system information it can respond to."),
  q(2, "Which component helps a system stay safe if too much electricity flows?", "a fuse or circuit breaker", ["a paint coat", "a larger label", "a shiny cover"], "It cuts off the electricity before wires overheat."),
  q(2, "Regular oiling of moving parts helps a machine because it…", "reduces friction and wear", ["makes the machine heavier", "adds more friction", "stops it from working"], "Less friction means less wasted energy and longer life."),
  q(2, "Automation means that…", "machines or computers do tasks with little direct human control", ["people do all the work by hand", "machines never use energy", "no system needs inputs"], "Automated systems follow programmed instructions."),
  q(2, "Which is a benefit of automation on a factory line?", "Work can be fast and consistent.", ["Machines never need repairs.", "Automation uses no energy.", "No one needs any skills."], "Machines can repeat a task the same way many times."),
  q(2, "Which skilled trade works on automated machines?", "a millwright or industrial electrician", ["a photographer", "a poet", "a bus passenger"], "Skilled tradespeople install, repair and program equipment."),
  q(2, "Many cities are buying electric buses. Which social factor helped push this change?", "concern about air pollution and climate change", ["a rule that buses must be loud", "less need to move people", "the cost of horses"], "People's values and laws help shape how systems change."),
  q(3, "A farm installs an automatic milking system. Which is a likely social impact?", "Less manual work but a need for new technical skills", ["Cows are no longer needed", "No electricity is needed", "No one needs to monitor the animals"], "Automation changes the kind of work people do."),
  q(3, "A town replaces a bus route with an app-based, on-demand service. Whose views should be heard before deciding?", "riders such as seniors and people without smartphones, drivers and the town", ["only the app company", "no one", "only people who already drive"], "Alternative systems affect different people in different ways."),
  q(3, "Which is an environmental benefit that automation can sometimes bring?", "less wasted material because of precise control", ["more waste in every case", "no energy use at all", "no need for materials"], "Precise machines can cut and fill with less waste."),
  q(3, "A robot sorts apples using a camera. Which is an output of this system?", "sorted apples", ["unsorted apples", "the camera's lens cap", "the sorting rules typed in earlier"], "Inputs go in, outputs come out."),
  q(3, "Why do sensors and regular inspections matter in an automated system?", "They help catch wear or faults before they cause harm.", ["They make the system run with no energy.", "They replace all safety rules.", "They are needed only when a system is new."], "Systems wear out and must be monitored."),
  q(3, "Self-checkout machines in stores reduce the need for some cashiers. What is one way communities can respond?", "offer retraining for new jobs", ["ban all machines", "ignore the change", "stop using electricity"], "People can learn new skills when systems evolve."),
];

const MILK_ORDER = orderOf(
  "Put the steps of milk processing in order.",
  "Raw milk is collected, tested, pasteurized, packaged and then shipped.",
  [
    { id: "collect", label: "Raw milk is collected from farms", emoji: "🚜" },
    { id: "test", label: "The milk is tested for quality", emoji: "🧪" },
    { id: "pasteurize", label: "The milk is heated to pasteurize it", emoji: "♨️" },
    { id: "package", label: "The milk is packaged in cartons", emoji: "🥛" },
    { id: "ship", label: "Cartons are shipped to stores", emoji: "🚚" },
  ],
);

const INPUT_SORT: SortSet = {
  prompt: "For a washing machine, is each item an input or an output?",
  hint: "Inputs go into the system. Outputs come out of it.",
  bins: [
    { id: "input", label: "Input", emoji: "⬇️" },
    { id: "output", label: "Output", emoji: "⬆️" },
  ],
  items: [
    { label: "dirty clothes", emoji: "👕", bin: "input" },
    { label: "electrical energy", emoji: "🔌", bin: "input" },
    { label: "fresh water", emoji: "🚿", bin: "input" },
    { label: "laundry soap", emoji: "🧴", bin: "input" },
    { label: "clean clothes", emoji: "✨", bin: "output" },
    { label: "used soapy water", emoji: "🪣", bin: "output" },
    { label: "noise", emoji: "🔊", bin: "output" },
    { label: "waste heat", emoji: "🌡️", bin: "output" },
  ],
};

// ---------- Work, energy and efficiency ----------

const WORK: Item[] = [
  q(1, "In science, work is done when a force…", "moves an object through a distance", ["is thought about", "is applied but nothing moves", "is read in a book"], "Work needs both a force and movement."),
  q(1, "Which unit is used to measure work and energy?", "joule (J)", ["newton (N)", "metre (m)", "kilogram (kg)"], "One joule is one newton of force moving an object one metre."),
  q(1, "Which unit is used to measure force?", "newton (N)", ["joule (J)", "metre (m)", "second (s)"], "Forces are measured in newtons."),
  q(1, "Which is an example of work in the science sense?", "lifting a box onto a shelf", ["pushing hard on a wall that does not move", "holding a box still", "wishing a box would move"], "Work needs the object to move in the direction of the force."),
  q(1, "Energy is the…", "ability to do work", ["force of gravity", "distance travelled", "speed of light"], "When work is done, energy is transferred."),
  q(1, "Displacement is…", "the distance an object moves in a certain direction", ["how heavy it is", "how hot it is", "how fast it spins"], "Displacement is measured in metres."),
  q(2, "Which formula gives work?", "work = force × displacement", ["work = force ÷ displacement", "work = force + displacement", "work = displacement ÷ force"], "Multiply the force by the distance moved."),
  q(2, "The force on a cart doubles and the distance stays the same. What happens to the work?", "It doubles.", ["It halves.", "It stays the same.", "It becomes zero."], "Work is proportional to the force."),
  q(2, "Efficiency compares…", "useful energy output with total energy input", ["force with distance", "mass with volume", "speed with time"], "Efficiency = useful output ÷ total input."),
  q(2, "Where does much of the “lost” energy go in a bicycle chain?", "to heat from friction", ["to a new type of matter", "to the ground as mass", "nowhere; energy is created"], "Friction changes some energy into heat."),
  q(2, "How does oiling a bicycle chain help efficiency?", "Less friction means less energy lost as heat.", ["More friction means more energy is useful.", "The chain gets heavier.", "The energy disappears."], "Lubricants reduce friction."),
  q(2, "An LED bulb is more efficient than an incandescent bulb because it…", "turns more of the electrical energy into light", ["uses no electricity", "produces more heat", "is made of glass"], "An incandescent bulb gives off most of its energy as heat."),
  q(2, "When we say energy dissipates from a machine, we mean it…", "spreads out as less useful energy, such as heat and sound", ["is destroyed", "is stored forever", "turns into mass"], "Energy is conserved, but it can spread out in forms that are hard to use."),
  q(3, "A student pushes with a force of 300 N against a wall that does not move. How much work is done on the wall?", "0 J", ["300 J", "600 J", "150 J"], "No displacement means no work."),
  q(3, "Why can no real machine be 100% efficient?", "Some energy is always lost as heat and sound through friction.", ["Machines have no energy.", "Efficiency only applies to living things.", "Friction adds energy."], "Moving parts always rub against something."),
  q(3, "Which innovation recovers energy that would otherwise be lost as heat when a vehicle slows down?", "regenerative braking", ["thicker paint", "larger mirrors", "heavier tires"], "Electric and hybrid vehicles can turn some braking energy back into stored electrical energy."),
  q(3, "Ball bearings are used in wheels and fans. How do they improve efficiency?", "They reduce friction between moving parts.", ["They increase friction.", "They make the wheel heavier.", "They change the force into mass."], "Rolling balls rub less than surfaces sliding together."),
  q(3, "A machine takes in 800 J and has an efficiency of 75%. Which statement is true?", "600 J of the input energy becomes useful output.", ["75 J becomes useful output.", "800 J becomes useful output.", "All the energy is lost."], "Multiply 800 by 0.75."),
  q(3, "A streamlined shape helps a cyclist go farther on the same energy because it…", "reduces air resistance", ["adds weight", "adds friction", "removes gravity"], "Less drag means less energy is wasted pushing through air."),
];

const calcWork = (level: Level): Question => {
  const f = pick(level === 1 ? [10, 20, 30] : [10, 15, 20, 25, 40, 50]);
  const d = randInt(2, level === 1 ? 5 : 10);
  return typeIn(`A force of ${f} N moves a crate ${d} m in the direction of the force. How much work is done, in J?`, f * d, "Work = force × displacement.", undefined, { suffix: "J" });
};
const calcForce = (level: Level): Question => {
  const f = pick([5, 10, 20, 25]);
  const d = randInt(2, level === 1 ? 5 : 8);
  return typeIn(`A machine does ${f * d} J of work moving a load ${d} m. What force did it apply, in N?`, f, "Force = work ÷ displacement.", undefined, { suffix: "N" });
};
const calcDistance = (level: Level): Question => {
  const f = pick([10, 20, 25, 50]);
  const d = randInt(2, level === 1 ? 5 : 9);
  return typeIn(`A force of ${f} N does ${f * d} J of work. How far, in m, did the object move?`, d, "Displacement = work ÷ force.", undefined, { suffix: "m" });
};
const calcEfficiency = (level: Level): Question => {
  const input = pick(level === 1 ? [100, 200] : [100, 200, 250, 400, 500]);
  const pcts = [20, 25, 40, 50, 60, 75, 80, 90].filter((p) => (input * p) % 100 === 0);
  const pct = pick(level === 1 ? [50, 25].filter((p) => (input * p) % 100 === 0) : pcts);
  return typeIn(`A motor takes in ${input} J of energy and gives ${(input * pct) / 100} J of useful energy. What is its efficiency, in %?`, pct, "Efficiency = useful output ÷ total input × 100.", undefined, { suffix: "%" });
};

// ---------- Simple machines and mechanical advantage ----------

const MACHINES: Item[] = [
  q(1, "A seesaw is an example of a…", "lever", ["pulley", "wedge", "screw"], "A lever turns on a pivot called a fulcrum."),
  q(1, "A wheelchair ramp is an example of an…", "inclined plane", ["lever", "wheel and axle", "pulley"], "An inclined plane is a slope."),
  q(1, "An axe blade is a…", "wedge", ["lever", "pulley", "wheel and axle"], "A wedge is two inclined planes back to back."),
  q(1, "A flagpole rope runs over a…", "pulley", ["wedge", "screw", "inclined plane"], "A pulley is a wheel with a rope in a groove."),
  q(1, "A doorknob is an example of a…", "wheel and axle", ["wedge", "inclined plane", "lever only"], "Turning the large knob turns the small axle."),
  q(1, "The thread of a screw is like…", "an inclined plane wrapped around a rod", ["a lever around a wall", "a pulley with no rope", "a wheel with no axle"], "A screw turns an inclined plane into a spiral."),
  q(2, "Mechanical advantage is the ratio of…", "output force to input force", ["input force to time", "mass to volume", "work to energy"], "Mechanical advantage = output force ÷ input force."),
  q(2, "A machine has a mechanical advantage of 4. What does this mean?", "The output force is 4 times the input force.", ["The machine is 4 times as fast.", "The machine uses 4 times as much energy.", "The output force is 4 N."], "A machine with a mechanical advantage greater than 1 multiplies force."),
  q(2, "How do most simple machines make a job easier?", "They reduce the force needed, but the force acts over a greater distance.", ["They create extra energy.", "They reduce the work needed to nothing.", "They make the load lighter."], "You trade a smaller force for a longer distance."),
  q(2, "A longer ramp of the same height needs…", "less force over a longer distance", ["more force over a longer distance", "more force over a shorter distance", "no force"], "A gentler slope means less effort."),
  q(2, "Which part of a lever is the pivot?", "the fulcrum", ["the load", "the effort", "the wheel"], "The load and the effort act on either side of the fulcrum, depending on the lever."),
  q(2, "In a wheelbarrow, the load sits between the wheel and the handles. The wheel acts as the…", "fulcrum", ["effort", "load", "axle only"], "The wheel is the pivot point."),
  q(2, "Do simple machines reduce the amount of work you must do?", "No; they change the force and distance but cannot give out more work than they take in.", ["Yes, they always cut the work in half.", "Yes, they create energy.", "No; they make the work larger by 100%."], "Work out is never more than work in."),
  q(2, "Why does a bike have gears?", "to change the balance between force and speed for hills and flat ground", ["to add mass", "to make the bike use no energy", "to remove friction completely"], "Low gears give more force for climbing."),
  q(2, "Which is a technology that increased farm productivity?", "the combine harvester, which cuts and separates grain in one pass", ["the hand sickle only", "the wooden spoon", "the paper map"], "One machine can harvest much more grain per hour than hand tools."),
  q(3, "A 100 N force on a lever lifts a 400 N load. What is the mechanical advantage?", "4", ["0.25", "40", "500"], "Divide the output force (400 N) by the input force (100 N)."),
  q(3, "Tweezers have a mechanical advantage less than 1. Why are they still useful?", "They give precise control over small objects.", ["They multiply force a lot.", "They never touch anything.", "They are a kind of pulley."], "Some tools trade force for control and speed."),
  q(3, "Why is a real machine's actual mechanical advantage less than its ideal one?", "Friction wastes some of the input force.", ["Friction adds force.", "The machine has no mass.", "Gravity stops."], "Ideal values ignore friction."),
  q(3, "A pulley system has 4 rope segments supporting the load. Ignoring friction, its ideal mechanical advantage is about…", "4", ["1", "2", "16"], "Each supporting segment shares the load."),
  q(3, "How have robotic arms in car factories changed productivity?", "They can weld and assemble the same part quickly and repeatedly.", ["They make every car different by hand.", "They need no electricity.", "They are never programmed."], "Automation raises output but also changes the jobs people do."),
  q(3, "A claw hammer pulls out a nail. Which simple machine is it?", "a lever", ["a wedge only", "a pulley", "an inclined plane"], "The hammer's head pivots on the wood, which acts as the fulcrum."),
];

const MACHINE_SORT: SortSet = {
  prompt: "Which type of simple machine is each tool?",
  hint: "Levers pivot on a fulcrum. Inclined planes and wedges are slopes. Wheels and axles and pulleys turn.",
  bins: [
    { id: "lever", label: "Lever", emoji: "⚖️" },
    { id: "slope", label: "Inclined plane or wedge", emoji: "📐" },
    { id: "wheel", label: "Wheel and axle or pulley", emoji: "⚙️" },
  ],
  items: [
    { label: "seesaw", emoji: "🎠", bin: "lever" },
    { label: "crowbar", emoji: "🔧", bin: "lever" },
    { label: "claw hammer pulling a nail", emoji: "🔨", bin: "lever" },
    { label: "wheelchair ramp", emoji: "♿", bin: "slope" },
    { label: "axe blade", emoji: "🪓", bin: "slope" },
    { label: "doorstop", emoji: "🚪", bin: "slope" },
    { label: "doorknob", emoji: "🔘", bin: "wheel" },
    { label: "flagpole rope and wheel", emoji: "🚩", bin: "wheel" },
    { label: "bicycle wheel", emoji: "🚲", bin: "wheel" },
  ],
};

const calcMA = (level: Level): Question => {
  const fin = pick(level === 1 ? [20, 25] : [20, 25, 40, 50]);
  const ma = pick(level === 1 ? [2, 3] : [2, 3, 4, 5]);
  return typeIn(`An input force of ${fin} N lifts a load that needs ${fin * ma} N. What is the mechanical advantage?`, ma, "Mechanical advantage = output force ÷ input force.", undefined);
};
const calcOutput = (level: Level): Question => {
  const fin = pick([10, 20, 25, 30]);
  const ma = pick(level === 1 ? [2, 3] : [2, 3, 4, 5, 6]);
  return typeIn(`A machine has a mechanical advantage of ${ma}. You apply an input force of ${fin} N. What output force does it give, in N?`, fin * ma, "Output force = input force × mechanical advantage.", undefined, { suffix: "N" });
};
const calcRamp = (level: Level): Question => {
  const h = pick(level === 1 ? [1, 2] : [1, 2, 3]);
  const k = pick(level === 1 ? [2, 3] : [2, 3, 4, 5]);
  return typeIn(`A ramp is ${h * k} m long and rises ${h} m. Ignoring friction, what is its ideal mechanical advantage?`, k, "For a ramp, ideal mechanical advantage = length of the slope ÷ height.", undefined);
};

// ---------- Water systems ----------

const WATER: Item[] = [
  q(1, "About how much of Earth's surface is covered by water?", "about 70%", ["about 30%", "about 10%", "about 99%"], "Oceans cover most of the planet."),
  q(1, "Most of Earth's water is…", "salt water in the oceans", ["fresh water in lakes", "groundwater", "water vapour"], "About 97% of Earth's water is salty."),
  q(1, "Where is most of Earth's fresh water stored?", "in glaciers and ice caps", ["in rivers", "in clouds", "in swimming pools"], "Frozen water holds roughly two thirds of the fresh water."),
  q(1, "Water vapour is water in the form of a…", "gas", ["solid", "liquid", "plasma"], "Evaporation changes liquid water into a gas."),
  q(1, "Which process changes water vapour into liquid droplets in clouds?", "condensation", ["evaporation", "melting", "freezing"], "Cooling vapour condenses."),
  q(1, "A watershed is…", "an area of land where all the water drains to the same river, lake or ocean", ["a building that stores water", "a kind of rain gauge", "a place with no water"], "Rain and snowmelt flow downhill within a watershed."),
  q(2, "What is groundwater?", "water stored underground in soil and rock", ["water in clouds", "water frozen in glaciers only", "water in a bottle"], "Groundwater fills the spaces between soil and rock particles."),
  q(2, "Which Great Lakes border Ontario?", "Superior, Huron, Erie and Ontario", ["Superior, Huron, Michigan and Erie", "Huron, Erie, Michigan and Ontario", "Superior, Michigan, Erie and Ontario"], "Lake Michigan is entirely in the United States."),
  q(2, "The Great Lakes drain east through the St. Lawrence River into which ocean?", "the Atlantic Ocean", ["the Pacific Ocean", "the Arctic Ocean", "the Indian Ocean"], "The river flows through Quebec to the Gulf of St. Lawrence."),
  q(2, "Rain that falls in much of northern Ontario drains toward…", "Hudson Bay and James Bay", ["Lake Erie", "the Gulf of Mexico", "the Pacific Ocean"], "North of the height of land, rivers flow toward the bays."),
  q(2, "Why is a watershed useful for water planning?", "What happens upstream, such as pollution, affects everyone downstream.", ["Water stays inside the watershed forever.", "It stops water from moving.", "Only the biggest city is affected."], "Water flows downhill, so people share it."),
  q(2, "Why do cities near the Great Lakes often have milder winters than inland places at the same latitude?", "Large bodies of water cool slowly and release stored heat.", ["Lakes make the air colder.", "Lakes remove all snow.", "Water has no effect on air."], "Water holds heat longer than land."),
  q(2, "Lake-effect snow forms when…", "cold air crosses warmer lake water, picks up moisture and drops it as snow downwind", ["hot air dries the lake", "snow rises from the lake bed", "winds stop blowing"], "The lake adds moisture to cold air."),
  q(2, "Conservation authorities in Ontario manage natural resources by…", "watershed", ["city block", "postal code", "phone area code"], "Their boundaries follow the land that drains to the same rivers."),
  q(2, "The water table is the top of the…", "zone where the ground is saturated with water", ["clouds", "highest mountain", "ocean floor"], "Below it the spaces between soil and rock are filled with groundwater."),
  q(3, "Which human activity is most likely to lower the water table in a region?", "pumping large amounts of groundwater for irrigation", ["restoring a wetland", "building a rain garden", "installing permeable pavement"], "Taking water out faster than it is replaced lowers the level."),
  q(3, "How does covering a large area with pavement affect the water table?", "Less rain soaks in, so groundwater is replaced more slowly.", ["More rain soaks in.", "The water table rises at once.", "Nothing changes."], "Water runs off hard surfaces instead of soaking in."),
  q(3, "After a long drought, heavy rain soaks into the ground. What usually happens to the water table?", "It rises.", ["It falls.", "It disappears.", "It freezes."], "Water seeps down and recharges the groundwater."),
  q(3, "Wetlands help protect water resources because they…", "store water, filter some pollutants and help recharge groundwater", ["remove all rain", "cause floods", "stop water from moving"], "They act like sponges and filters."),
  q(3, "The Great Lakes hold about one fifth of the world's surface fresh water. What does this suggest?", "Protecting them matters for many people and ecosystems.", ["They can never be harmed.", "Other lakes do not matter.", "Water use does not need to be managed."], "A large supply still needs care."),
];

const CYCLE_ORDER = orderOf(
  "Put the stages of the water cycle in order.",
  "Water evaporates, condenses into clouds, falls as precipitation and then collects in oceans, lakes, rivers and groundwater.",
  [
    { id: "evap", label: "Water evaporates from oceans and lakes", emoji: "☀️" },
    { id: "cond", label: "Water vapour condenses into clouds", emoji: "☁️" },
    { id: "precip", label: "Precipitation falls as rain or snow", emoji: "🌧️" },
    { id: "collect", label: "Water collects in rivers, lakes and groundwater", emoji: "🏞️" },
  ],
);

const STATES_SORT: SortSet = {
  prompt: "Which state of water is each example?",
  hint: "Glaciers and snowpack are solid. Rivers and groundwater are liquid. Invisible water vapour in the air is a gas.",
  bins: [
    { id: "solid", label: "Solid", emoji: "🧊" },
    { id: "liquid", label: "Liquid", emoji: "💧" },
    { id: "gas", label: "Gas", emoji: "💨" },
  ],
  items: [
    { label: "a glacier", emoji: "🏔️", bin: "solid" },
    { label: "the snowpack on a mountain", emoji: "❄️", bin: "solid" },
    { label: "sea ice in the Arctic", emoji: "🧊", bin: "solid" },
    { label: "a river", emoji: "🏞️", bin: "liquid" },
    { label: "groundwater in an aquifer", emoji: "🕳️", bin: "liquid" },
    { label: "Lake Huron", emoji: "🌊", bin: "liquid" },
    { label: "invisible water vapour in humid air", emoji: "🌫️", bin: "gas" },
    { label: "water vapour released by evaporation", emoji: "☀️", bin: "gas" },
    { label: "water vapour released by plants", emoji: "🌿", bin: "gas" },
  ],
};

const calcFresh = (level: Level): Question => {
  const total = pick(level === 1 ? [100, 200] : [100, 200, 300, 500]);
  return typeIn(`Suppose 3% of all Earth's water is fresh water. If the total is ${total} mL, how many mL are fresh water?`, (total * 3) / 100, "Find 3% of the total: multiply by 3 and divide by 100.", undefined, { suffix: "mL" });
};
const calcDrip = (level: Level): Question => {
  const lph = pick(level === 1 ? [2, 3] : [2, 3, 4, 5]);
  return typeIn(`A leaking tap wastes ${lph} L of water every hour. How many litres does it waste in 24 hours?`, lph * 24, "Multiply the litres per hour by 24 hours.", undefined, { suffix: "L" });
};

// ---------- Water stewardship ----------

const STEWARD: Item[] = [
  q(1, "Why is fresh water called a limited resource?", "Only a small share of Earth's water is fresh and easy to reach.", ["Fresh water is made in factories.", "Most of Earth's water is fresh.", "Nobody needs it."], "Most water is salty or frozen."),
  q(1, "Which action saves water at home?", "turning off the tap while brushing your teeth", ["leaving a tap dripping", "washing a car every day with a hose", "running half-empty loads"], "Small habits add up."),
  q(1, "What does turbidity tell you about water?", "how cloudy it is", ["how salty it is", "how warm it is", "how deep it is"], "Cloudy water has more particles in it."),
  q(1, "Why do fish need dissolved oxygen in the water?", "They take in oxygen to breathe.", ["It makes the water hot.", "It makes water salty.", "It turns water into ice."], "Cold, flowing water holds more dissolved oxygen."),
  q(1, "Why is drinking water treated before it reaches your tap?", "to remove harmful substances and germs", ["to add colour", "to make it a gas", "to make it saltier"], "Treatment makes water safe to drink."),
  q(2, "What does the disinfection step of water treatment do?", "kills disease-causing micro-organisms, for example with chlorine or ultraviolet light", ["removes all dissolved minerals", "adds mud", "freezes the water"], "Disinfection protects people from illness."),
  q(2, "Fertilizer washes into a lake and causes an algae bloom. Why does this harm fish?", "When the algae die and decompose, the process uses up dissolved oxygen.", ["Algae turn the water into ice.", "Algae make more oxygen than fish need.", "Algae remove the fish's gills."], "Low oxygen can cause fish kills."),
  q(2, "How can winter road salt affect streams?", "It can raise salt levels that harm aquatic life.", ["It makes streams freeze more slowly everywhere.", "It always makes water cleaner.", "It has no effect."], "Salty runoff reaches streams and lakes."),
  q(2, "Mayfly nymphs live only in clean, oxygen-rich streams. If scientists find many, what does it suggest?", "The water quality is probably good.", ["The water is badly polluted.", "The stream is dry.", "There is too much fertilizer."], "Sensitive organisms are used as indicators of water quality."),
  q(2, "A high count of E. coli bacteria in a lake is a sign of…", "contamination, for example from sewage or animal waste", ["pure water", "low oxygen only", "warm weather only"], "E. coli in water can mean waste has entered it."),
  q(2, "What is wastewater treatment?", "cleaning used water from homes and industry before returning it to lakes and rivers", ["making rain", "bottling lake water", "moving a river"], "Treatment protects the environment and drinking water sources."),
  q(2, "How do water meters help a municipality?", "They measure how much water people use so it can be managed.", ["They make water free.", "They remove salt.", "They make rain."], "Measuring use helps manage supply and find leaks."),
  q(2, "Climate change is warming the planet. What is one effect on glaciers and polar ice?", "More ice melts, which adds water to the oceans and raises sea level.", ["More ice forms everywhere.", "Ice turns to rock.", "There is no effect."], "Melting land ice adds water to the sea."),
  q(2, "Changes in Arctic sea ice affect Inuit communities because…", "people travel and hunt on the ice, so thinner or later ice affects safety and food", ["sea ice has no use", "the ice is the same every year", "all communities have moved away"], "Many Inuit communities depend on sea ice for travel and harvesting."),
  q(3, "In 2000, E. coli in the drinking water of Walkerton, Ontario made many people ill. What did this lead to?", "stricter rules for testing and treating drinking water", ["the end of all water use", "less testing", "no changes at all"], "Public health events often lead to better protection."),
  q(3, "Some First Nations communities have lived under long-term drinking water advisories. What does this show?", "Not everyone in Canada has had reliable access to safe drinking water.", ["Everyone has equal access.", "Water treatment is never needed.", "Advisories only occur in cities."], "Safe water is a matter of health and fairness."),
  q(3, "Which statement best matches the teachings of many First Nations, Métis and Inuit communities about water?", "Water is life-giving, and people have a responsibility to care for it.", ["Water is only a product to be sold.", "Water has no link to people.", "Water belongs only to cities."], "Each nation has its own teachings, and many share this view of respect and responsibility."),
  q(3, "Josephine Mandamin, an Anishinaabe grandmother, walked around the Great Lakes to…", "draw attention to protecting the water", ["break a speed record", "sell water", "measure lake depth"], "She spoke about the need to care for the water for future generations."),
  q(3, "Which farming innovation helps conserve fresh water?", "drip irrigation, which delivers water to roots", ["flooding the whole field", "using sprinklers at midday only", "pumping water onto roads"], "Targeted watering wastes less."),
  q(3, "Desalination makes fresh water from sea water. What is one challenge?", "It needs a lot of energy.", ["Sea water has no salt.", "It produces more salt water.", "It works with no equipment."], "Removing salt takes energy and creates salty waste water to manage."),
  q(3, "A town wants to protect its water supply. Which plan is the strongest?", "Fix leaks, protect the source watershed and set watering rules for dry periods", ["Ignore leaks", "Build only parking lots", "Use water without measuring it"], "A good plan reduces losses, protects the source and manages demand."),
];

const TREATMENT_ORDER = orderOf(
  "Put the steps of municipal drinking water treatment in order.",
  "Water is screened, particles clump together and settle, the water is filtered, and finally it is disinfected.",
  [
    { id: "screen", label: "Screening removes large debris", emoji: "🗑️" },
    { id: "coag", label: "Particles clump together", emoji: "🫧" },
    { id: "settle", label: "Clumps settle to the bottom", emoji: "⬇️" },
    { id: "filter", label: "Water passes through filters", emoji: "🧽" },
    { id: "disinfect", label: "Disinfection kills germs", emoji: "🦠" },
  ],
);

const QUALITY_SORT: SortSet = {
  prompt: "Is each sign more likely to show healthy water or poor water quality?",
  hint: "Healthy water is clear and well supplied with oxygen, and has sensitive organisms. Poor quality water may have algae blooms, very low oxygen or bacteria from waste.",
  bins: [
    { id: "healthy", label: "Healthy water", emoji: "💚" },
    { id: "poor", label: "Poor water quality", emoji: "⚠️" },
  ],
  items: [
    { label: "mayfly nymphs under rocks", emoji: "🪲", bin: "healthy" },
    { label: "high dissolved oxygen", emoji: "🫧", bin: "healthy" },
    { label: "clear water with low turbidity", emoji: "💧", bin: "healthy" },
    { label: "low levels of E. coli bacteria", emoji: "✅", bin: "healthy" },
    { label: "thick green algae bloom", emoji: "🟢", bin: "poor" },
    { label: "very low dissolved oxygen", emoji: "💨", bin: "poor" },
    { label: "high E. coli bacteria count", emoji: "🦠", bin: "poor" },
    { label: "dead fish floating at the surface", emoji: "🐟", bin: "poor" },
  ],
};

// ---------- The units ----------

export const units: Unit[] = [
  {
    id: "stem-skills-8",
    title: "Think Like a Scientist",
    emoji: "🧪",
    blurb: "Fair tests, design, coding and careers",
    standards: on("A1.1–A1.5, A2.1, A2.2, A3.1–A3.3", "research and experiment skills, the engineering design process, safety, coding and emerging technology, and careers and contributions in science and technology"),
    parentNote: "Planning fair tests with variables and controls, following lab safety, using the engineering design process, understanding how coding and AI are used, and seeing how science connects to skilled trades and to people of many backgrounds.",
    generate: plain({ items: STEM, sorts: [SAFETY_SORT], orders: [DESIGN_ORDER] }),
  },
  {
    id: "cells-organisms-8",
    title: "Cells, Organisms & Technology",
    emoji: "🔬",
    blurb: "One cell or many, and the tools that reveal them",
    standards: on("B1.1, B1.2, B2.1, B2.5, B2.6", "technologies that help us understand cells, the cell theory, unicellular and multicellular organisms, and cells, tissues, organs and systems"),
    parentNote: "How microscopes and newer technologies such as stem cell research and gene editing have changed our understanding of cells, how single-celled and many-celled organisms meet their needs, and the benefits and concerns of cell biology developments.",
    generate: withCalc({ items: CELL_TECH, sorts: [ORGANISM_SORT], orders: [CELL_ORDER] }, [calcMagnify, calcCellWidth], 1),
  },
  {
    id: "viscosity-flow-8",
    title: "Viscosity & Flow",
    emoji: "🍯",
    blurb: "Why some fluids flow fast and others creep",
    standards: on("C2.1, C2.8", "viscosity, volumetric flow rate and factors that affect the flow of fluids"),
    parentNote: "What viscosity is, how temperature and other factors change how fluids flow, and how to find a flow rate by dividing volume by time.",
    generate: withCalc({ items: VISCOSITY }, [calcFlow, calcFlowVolume], 2),
  },
  {
    id: "density-buoyancy-8",
    title: "Density & Buoyancy",
    emoji: "🛟",
    blurb: "Mass, volume, floating and sinking",
    standards: on("C2.2, C2.3, C2.5", "the relationship between mass, volume and density, density and the particle theory, and buoyancy in different fluids"),
    parentNote: "Calculating density from mass and volume, explaining why solids, liquids and gases differ in density using the particle theory, and predicting whether objects float or sink in different fluids.",
    generate: withCalc({ items: DENSITY, sorts: [FLOAT_SORT], orders: [LAYER_ORDER] }, [calcDensity, calcMass, calcVolume], 2),
  },
  {
    id: "pressure-pascal-8",
    title: "Pressure & Pascal's Law",
    emoji: "🧯",
    blurb: "Squeezing, heating and passing on force",
    standards: on("C2.4, C2.6, C2.7", "compressibility of liquids and gases, how pressure, volume and temperature are related, and Pascal's law"),
    parentNote: "Why gases compress easily and liquids do not, how heating or compressing a fluid changes its pressure and volume, and how a hydraulic press uses Pascal's law to multiply a force.",
    generate: withCalc({ items: PRESSURE, sorts: [COMPRESS_SORT] }, [calcPascal, calcPressure], 2),
  },
  {
    id: "hydraulics-pneumatics-8",
    title: "Hydraulics & Pneumatics",
    emoji: "🏗️",
    blurb: "Machines and bodies that move fluids",
    standards: on("C2.8–C2.10", "factors that affect fluid flow, hydraulic and pneumatic systems, and how fluids are used and regulated in living things and in machines"),
    parentNote: "How hydraulic systems (liquids) and pneumatic systems (compressed air) work, where each is used, and how valves, pumps and tubes in machines compare with the heart, lungs and blood vessels.",
    generate: plain({ items: HYDRAULICS, sorts: [HYDRAULIC_SORT] }),
  },
  {
    id: "fluids-society-8",
    title: "Fluids, Spills & Society",
    emoji: "🛢️",
    blurb: "Technologies, spills and who is affected",
    standards: on("C1.1, C1.2", "environmental, social and economic impacts of fluid technologies and of fluid spills, including impacts on First Nations, Métis and Inuit communities"),
    parentNote: "The benefits and risks of technologies that use fluids, such as pipelines and hydroelectric dams, how spills affect wildlife, the economy and communities (including Indigenous communities who rely on the land and water), and why cleanup is costly and difficult.",
    generate: plain({ items: FLUID_SOCIETY }),
  },
  {
    id: "systems-8",
    title: "Systems in Action",
    emoji: "⚙️",
    blurb: "Inputs, outputs, safety and automation",
    standards: on("D1.1, D1.2, D2.1–D2.3, D2.8, D2.10", "types of systems, inputs, outputs and components, safe and efficient operation, consumer information, automation and social factors that change systems"),
    parentNote: "Identifying inputs, outputs and purposes of systems including food processing, what makes systems safe and efficient, how automation changes work, and why people's needs and values change systems over time.",
    generate: plain({ items: SYSTEMS, sorts: [INPUT_SORT], orders: [MILK_ORDER] }),
  },
  {
    id: "work-energy-8",
    title: "Work, Energy & Efficiency",
    emoji: "⚡",
    blurb: "Force, distance and wasted energy",
    standards: on("D2.4, D2.5, D2.7", "displacement, force, work, energy and efficiency, and how energy dissipates from mechanical systems"),
    parentNote: "Using the scientific terms force, displacement, work, energy and efficiency, calculating work as force times displacement, finding efficiency, and how friction and design affect the energy lost from machines.",
    generate: withCalc({ items: WORK }, [calcWork, calcForce, calcDistance, calcEfficiency], 3),
  },
  {
    id: "machines-8",
    title: "Simple Machines & Advantage",
    emoji: "🔧",
    blurb: "Levers, ramps, pulleys and mechanical advantage",
    standards: on("D2.6, D2.9", "input and output forces, mechanical advantage of simple machines and technological innovations that increased productivity"),
    parentNote: "Identifying the six simple machines, finding mechanical advantage from input and output forces, understanding that machines trade force for distance, and how innovations such as combine harvesters and robotics raised productivity.",
    generate: withCalc({ items: MACHINES, sorts: [MACHINE_SORT] }, [calcMA, calcOutput, calcRamp], 2),
  },
  {
    id: "water-systems-8",
    title: "Water Systems of Earth",
    emoji: "🌊",
    blurb: "Where water is, how it moves and watersheds",
    standards: on("E2.1, E2.2, E2.3, E2.5", "states, distribution and circulation of water, watersheds, changes in the water table, and how bodies of water change the atmosphere"),
    parentNote: "Where Earth's water is found and in what form, the water cycle, watersheds and the Great Lakes, how groundwater and the water table change, and how large lakes shape local weather.",
    generate: withCalc({ items: WATER, sorts: [STATES_SORT], orders: [CYCLE_ORDER] }, [calcFresh, calcDrip], 1),
  },
  {
    id: "water-stewardship-8",
    title: "Caring for Water",
    emoji: "🚰",
    blurb: "Water quality, treatment and stewardship",
    standards: on("E1.1–E1.3, E2.4, E2.6, E2.7", "fresh water sustainability, Indigenous knowledges and values about water, technology and water systems, melting ice, water quality indicators and municipal water treatment"),
    parentNote: "Why fresh water must be managed with care, how water quality is measured, how drinking water and wastewater are treated, the effects of melting glaciers and sea ice, and the many teachings of First Nations, Métis and Inuit communities about caring for water.",
    generate: plain({ items: STEWARD, sorts: [QUALITY_SORT], orders: [TREATMENT_ORDER] }),
  },
];

