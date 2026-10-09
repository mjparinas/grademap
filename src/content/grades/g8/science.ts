import type { SortSet } from "../../bank";
import type { Course, GenerateOptions, Question } from "../../types";
import { fromParts, orderOf, q, type Item } from "../kit";

// Grade 8 science: cells and life processes, reproduction, particles and matter,
// energy, and plate tectonics (with a BC focus on the Cascadia region).

// ---------- Cells & Life Processes ----------

const CELLS: Item[] = [
  q(1, "What is the basic unit of life?", "the cell", ["the atom", "the organ", "the tissue"], "All living things are made of one or more cells."),
  q(1, "Which of these is part of the cell theory?", "All living things are made of cells.", ["All cells are the same size.", "Cells only exist in animals.", "Cells appear from non-living matter."], "The cell theory: living things are made of cells, cells are the basic unit of life, and all cells come from existing cells."),
  q(1, "Which organelle controls the cell's activities and holds its DNA?", "nucleus", ["mitochondrion", "vacuole", "cell wall"], "The nucleus is like the control centre of the cell."),
  q(1, "Which organelle releases energy from food for the cell?", "mitochondria", ["nucleus", "chloroplast", "cell membrane"], "Mitochondria carry out cellular respiration, releasing usable energy."),
  q(1, "What does the cell membrane do?", "Controls what enters and leaves the cell", ["Makes sugar from sunlight", "Stores the cell's DNA", "Gives plant cells their green colour"], "The membrane is a flexible boundary that lets some materials in and out."),
  q(1, "Which structure is found in plant cells but NOT animal cells?", "cell wall", ["nucleus", "cell membrane", "mitochondria"], "Plant cells have a rigid cell wall outside the membrane, plus chloroplasts."),
  q(2, "Where does photosynthesis happen in a plant cell?", "chloroplasts", ["mitochondria", "nucleus", "ribosomes"], "Chloroplasts contain chlorophyll, which captures light energy."),
  q(2, "What are the inputs of photosynthesis?", "carbon dioxide, water and light energy", ["oxygen and sugar", "oxygen and water", "sugar and light"], "Plants use CO₂, water and light to make glucose (sugar) and oxygen."),
  q(2, "What are the products of photosynthesis?", "glucose (sugar) and oxygen", ["carbon dioxide and water", "carbon dioxide and oxygen", "water and energy"], "Glucose stores energy for the plant, and oxygen is released."),
  q(2, "What are the products of cellular respiration?", "energy, carbon dioxide and water", ["glucose and oxygen", "only oxygen", "only sugar"], "Cells use glucose and oxygen to release energy, making carbon dioxide and water."),
  q(2, "How are photosynthesis and cellular respiration related?", "The products of one are the inputs of the other.", ["They are the same process.", "They happen only at night.", "They happen only in animals."], "Photosynthesis makes glucose and oxygen. Respiration uses glucose and oxygen."),
  q(2, "Which is the correct order from smallest to largest?", "cell → tissue → organ → organ system", ["organ → cell → tissue → organ system", "tissue → cell → organ system → organ", "organ system → organ → tissue → cell"], "Cells form tissues, tissues form organs, and organs work together in organ systems."),
  q(3, "Why do large organisms have many small cells instead of a few giant ones?", "Small cells have more surface area compared to their volume, so materials move in and out efficiently.", ["Small cells never die.", "Large cells cannot have nuclei.", "Cell size is random."], "As a cell grows, its volume increases faster than its surface area, so it struggles to supply itself."),
  q(3, "Osmosis is the movement of…", "water across a membrane", ["glucose out of the nucleus", "light into a leaf", "DNA into a cell"], "Water moves through a semi-permeable membrane, usually toward higher solute concentration."),
  q(3, "A plant cell placed in salty water loses water. What happens to the cell?", "It shrinks as water leaves.", ["It swells and bursts.", "It makes more chloroplasts.", "Nothing changes."], "Water moves from the dilute inside to the concentrated salty outside by osmosis."),
  q(3, "What is the job of the large central vacuole in a plant cell?", "Store water and help the cell keep its shape", ["Make DNA", "Release energy", "Capture sunlight"], "The vacuole holds water, nutrients and wastes; full vacuoles keep the plant firm."),
];

const CELL_SORT: SortSet = {
  prompt: "Found only in plant cells, or in both plant and animal cells? Sort each cell part.",
  hint: "Chloroplasts, the cell wall and the large central vacuole are only in plant cells. The nucleus, mitochondria, cell membrane, cytoplasm and ribosomes are in both.",
  bins: [
    { id: "plant", label: "Plant cells only", emoji: "🌿" },
    { id: "both", label: "Plant and animal cells", emoji: "🐾" },
  ],
  items: [
    { label: "chloroplasts", emoji: "🟢", bin: "plant" },
    { label: "cell wall", emoji: "🧱", bin: "plant" },
    { label: "large central vacuole", emoji: "💧", bin: "plant" },
    { label: "nucleus", emoji: "🎯", bin: "both" },
    { label: "mitochondria", emoji: "🔋", bin: "both" },
    { label: "cell membrane", emoji: "🫧", bin: "both" },
    { label: "cytoplasm", emoji: "🥣", bin: "both" },
    { label: "ribosomes", emoji: "⚙️", bin: "both" },
  ],
};

// ---------- Reproduction ----------

const REPRO: Item[] = [
  q(1, "What is asexual reproduction?", "Making offspring from one parent", ["Making offspring from two parents", "Making offspring from eggs only", "Making offspring without cells"], "Asexual reproduction needs only one parent, and the offspring are genetically identical."),
  q(1, "Which is an example of asexual reproduction?", "A strawberry plant growing a runner", ["A bird laying eggs after mating", "A human baby being born", "A frog laying eggs that are fertilized"], "Runners grow new plants from the parent without seeds or a second parent."),
  q(1, "Offspring from asexual reproduction are…", "genetically identical to the parent", ["completely different from the parent", "a mix of two parents' genes", "always female"], "One parent's cells copy themselves, so the genes are the same."),
  q(1, "What is a gamete?", "A sex cell, such as an egg or sperm", ["A body cell", "A kind of bacteria", "A plant leaf"], "Gametes are the reproductive cells that join in sexual reproduction."),
  q(2, "What is fertilization?", "When a sperm cell and an egg cell join", ["When a cell divides in two", "When a seed is planted", "When a plant makes sugar"], "Fertilization combines genetic material from two parents into a new cell."),
  q(2, "Why does sexual reproduction increase variety within a species?", "Offspring get a new mix of genes from two parents.", ["Offspring are copies of one parent.", "Mutations never happen.", "Parents choose which genes to pass on."], "Variation helps a species survive when conditions change."),
  q(2, "Budding in yeast and hydra is a type of…", "asexual reproduction", ["sexual reproduction", "fertilization", "photosynthesis"], "A bud grows off the parent and breaks off as a new organism."),
  q(2, "Which is a way flowering plants reproduce sexually?", "Pollen from one flower fertilizes another flower's ovule", ["A leaf grows into a new plant", "A tuber sprouts", "A branch is cut and planted"], "Pollination moves pollen to the female part of a flower so seeds can form."),
  q(2, "In plants, what are the male parts of a flower called (together)?", "stamens", ["pistils", "petals", "sepals"], "Stamens (anther + filament) make pollen. The pistil is the female part."),
  q(2, "What is the role of the ovary in a flower?", "It holds the ovules, which may become seeds.", ["It makes pollen.", "It attracts pollinators.", "It holds the flower up."], "After fertilization, the ovary can become a fruit that protects the seeds."),
  q(3, "A farmer wants every apple tree to produce the exact same apples. Which method is best?", "Grafting a cutting from the parent tree", ["Planting seeds from the parent's apples", "Crossing two different trees", "Letting bees pollinate freely"], "Apple seeds carry a mix of genes, so seeds give different apples. A graft is a clone."),
  q(3, "Which is an advantage of asexual reproduction?", "Organisms can reproduce quickly without finding a mate.", ["It creates lots of genetic variety.", "It prevents all diseases.", "It requires two parents."], "Asexual reproduction is fast and needs only one parent."),
  q(3, "Which is a disadvantage of asexual reproduction?", "Little genetic variety, so one disease can harm the whole population.", ["It needs two parents.", "It is slow.", "Offspring are always different."], "Identical organisms share the same weaknesses."),
  q(3, "Meiosis is the type of cell division that produces…", "gametes with half the usual number of chromosomes", ["identical body cells", "two identical nuclei", "new organelles"], "Gametes have half the chromosomes so that fertilization restores the full number."),
];

const REPRO_SORT: SortSet = {
  prompt: "Asexual or sexual reproduction? Sort each example.",
  hint: "Asexual reproduction involves one parent and produces identical copies. Sexual reproduction joins sex cells from two parents.",
  bins: [
    { id: "asexual", label: "Asexual", emoji: "1️⃣" },
    { id: "sexual", label: "Sexual", emoji: "2️⃣" },
  ],
  items: [
    { label: "a potato eye grows into a new plant", emoji: "🥔", bin: "asexual" },
    { label: "bacteria split in two", emoji: "🦠", bin: "asexual" },
    { label: "a hydra grows a bud", emoji: "🪸", bin: "asexual" },
    { label: "a spider plant sends out a plantlet", emoji: "🪴", bin: "asexual" },
    { label: "a salmon's egg is fertilized by a sperm", emoji: "🐟", bin: "sexual" },
    { label: "a bee carries pollen to an apple flower", emoji: "🐝", bin: "sexual" },
    { label: "a bird lays fertilized eggs", emoji: "🐦", bin: "sexual" },
    { label: "a seed grows from a pollinated flower", emoji: "🌻", bin: "sexual" },
  ],
};

// ---------- Particles & Matter ----------

const MATTER: Item[] = [
  q(1, "According to the kinetic molecular theory, all matter is made of…", "tiny particles that are always moving", ["solid blocks that never move", "particles that only move in gases", "particles that stop at 0 °C"], "Particles are always in motion. They move faster when the matter is hotter."),
  q(1, "In which state are the particles packed closely and only vibrate in place?", "solid", ["liquid", "gas", "plasma"], "In solids, particles are held in fixed positions and vibrate."),
  q(1, "In which state of matter do particles move freely and spread out to fill their container?", "gas", ["solid", "liquid", "crystal"], "Gas particles are far apart and move quickly in all directions."),
  q(1, "What happens to the particles of a substance when it is heated?", "They move faster.", ["They stop moving.", "They shrink.", "They disappear."], "Heat adds energy, so particles move faster."),
  q(1, "Melting is when a…", "solid changes to a liquid", ["liquid changes to a gas", "gas changes to a liquid", "liquid changes to a solid"], "Melting happens when particles gain enough energy to slide past each other."),
  q(1, "Which change is condensation?", "gas to liquid", ["liquid to gas", "solid to liquid", "liquid to solid"], "Water vapour cooling on a cold glass is condensation."),
  q(2, "Which is a physical change?", "Ice melting", ["Wood burning", "Iron rusting", "Milk turning sour"], "In a physical change, no new substance forms."),
  q(2, "Which is a chemical change?", "Iron rusting", ["Water freezing", "Sugar dissolving", "Paper being torn"], "Rust is a new substance, iron oxide, formed when iron reacts with oxygen."),
  q(2, "Which is a sign that a chemical change has happened?", "A gas is produced and a new substance forms", ["The substance changes shape", "The substance changes size", "The substance gets wet"], "Gas bubbles, a colour change, light or heat, and a new substance are clues."),
  q(2, "An atom's centre is called the…", "nucleus", ["electron", "shell", "molecule"], "The nucleus holds protons and neutrons."),
  q(2, "Which particle has a negative charge?", "electron", ["proton", "neutron", "nucleus"], "Electrons are negative, protons positive and neutrons have no charge."),
  q(2, "The atomic number of an element tells you its number of…", "protons", ["neutrons", "electrons only", "shells"], "Each element has a unique number of protons."),
  q(2, "What is a pure substance made of only one kind of atom called?", "an element", ["a mixture", "a solution", "a compound"], "Elements like oxygen, iron and gold contain one kind of atom."),
  q(2, "A compound is…", "two or more elements chemically joined", ["a mix of two liquids", "any metal", "a gas"], "Water (H₂O) joins hydrogen and oxygen in a fixed ratio."),
  q(3, "Why does a drop of food colouring spread faster in hot water than in cold water?", "Hot water particles move faster and collide more.", ["Hot water is heavier.", "Cold water has no particles.", "Food colouring dissolves only in cold water."], "More particle motion means faster mixing (diffusion)."),
  q(3, "Why does a gas get compressed more easily than a solid?", "There is lots of empty space between gas particles.", ["Gas particles are heavier.", "Gas particles are stuck together.", "Gas particles have no mass."], "Particles in a gas are far apart, so they can be pushed closer."),
  q(3, "At the boiling point, added heat energy is used to…", "pull the particles apart into a gas", ["raise the temperature of the liquid", "make the particles smaller", "make the liquid heavier"], "During a change of state, the temperature stays constant while energy breaks attractions between particles."),
  q(3, "Who first proposed a model of the atom with a dense, positive nucleus surrounded by electrons?", "Ernest Rutherford", ["Isaac Newton", "Marie Curie", "Charles Darwin"], "Rutherford's gold foil experiment showed that atoms have a small, dense nucleus."),
];

const MATTER_SORT: SortSet = {
  prompt: "Physical change or chemical change? Sort each example.",
  hint: "In a physical change the substance stays the same (just a different shape or state). In a chemical change a new substance forms.",
  bins: [
    { id: "physical", label: "Physical change", emoji: "🧊" },
    { id: "chemical", label: "Chemical change", emoji: "🔥" },
  ],
  items: [
    { label: "ice melts", emoji: "🧊", bin: "physical" },
    { label: "a glass is smashed", emoji: "🥛", bin: "physical" },
    { label: "salt dissolves in water", emoji: "🧂", bin: "physical" },
    { label: "water boils into steam", emoji: "♨️", bin: "physical" },
    { label: "a log burns", emoji: "🪵", bin: "chemical" },
    { label: "an iron nail rusts", emoji: "🔩", bin: "chemical" },
    { label: "baking soda fizzes in vinegar", emoji: "🫧", bin: "chemical" },
    { label: "an egg cooks", emoji: "🍳", bin: "chemical" },
  ],
};

// ---------- Energy ----------

const ENERGY: Item[] = [
  q(1, "Energy can be…", "transformed from one form to another", ["created from nothing", "destroyed completely", "stored only in batteries"], "The law of conservation of energy: energy is never created or destroyed, only transformed."),
  q(1, "What energy change happens in a toaster?", "electrical → thermal (heat)", ["thermal → electrical", "chemical → sound", "light → kinetic"], "The toaster's wires get hot as electrical energy becomes heat."),
  q(1, "A moving bicycle has which form of energy?", "kinetic energy", ["gravitational potential energy only", "chemical energy only", "nuclear energy"], "Kinetic energy is the energy of motion."),
  q(1, "A book sitting on a high shelf has…", "gravitational potential energy", ["kinetic energy", "sound energy", "no energy"], "Higher objects have more stored energy because of gravity."),
  q(1, "Food stores energy in which form?", "chemical energy", ["electrical energy", "sound energy", "magnetic energy"], "Food holds chemical energy that our bodies release."),
  q(2, "A solar panel changes…", "light energy into electrical energy", ["electrical energy into light", "heat into sound", "chemical energy into motion"], "Photovoltaic cells convert sunlight into electricity."),
  q(2, "Which is a renewable energy source?", "wind", ["coal", "natural gas", "oil"], "Renewable sources like wind, solar and hydro are replaced naturally."),
  q(2, "Most of the electricity in British Columbia comes from…", "hydroelectric dams", ["coal plants", "nuclear reactors", "diesel generators"], "BC Hydro generates most of its electricity from water flowing through dams."),
  q(2, "Heat moves through a metal spoon in a hot soup mainly by…", "conduction", ["convection", "radiation", "evaporation"], "Conduction transfers heat through direct contact of particles in a solid."),
  q(2, "Warm air rising and cool air sinking is an example of…", "convection", ["conduction", "radiation", "insulation"], "Convection is heat transfer by the movement of fluids (liquids and gases)."),
  q(2, "How does the Sun's energy reach Earth through empty space?", "radiation", ["conduction", "convection", "evaporation"], "Radiation transfers energy as waves and does not need matter."),
  q(2, "A light bulb is “inefficient” when…", "much of its energy becomes heat instead of light", ["it uses no electricity", "it lasts forever", "it only works outdoors"], "Efficiency is the useful energy output divided by the total input."),
  q(3, "A roller coaster car is at the top of a hill. As it rolls down, its potential energy…", "decreases while its kinetic energy increases", ["increases while its kinetic energy increases", "stays the same while it stops", "decreases while its kinetic energy decreases"], "Gravitational potential energy changes into kinetic energy as the car speeds up."),
  q(3, "A lamp is 20% efficient: it turns 100 J of electrical energy into 20 J of light. Where does the other 80 J go?", "It becomes heat, which spreads into the surroundings.", ["It disappears.", "It turns into mass.", "It stays in the bulb as electricity."], "Energy is conserved. The rest is transformed into unwanted thermal energy."),
  q(3, "Which choice would reduce a home's energy use the most?", "Adding insulation to the walls and attic", ["Leaving lights on all day", "Opening windows in winter", "Using a bigger furnace"], "Insulation slows heat transfer so less energy is needed for heating."),
  q(3, "Burning fossil fuels transforms…", "chemical energy into thermal energy and releases carbon dioxide", ["thermal energy into chemical energy", "gravitational energy into light", "electrical energy into food"], "Stored chemical energy is released as heat, with CO₂ as a by-product."),
];

const FORM_ORDER = orderOf(
  "Order the energy changes in a hydroelectric dam, starting with the water high above the dam.",
  "Water high up has gravitational potential energy. As it falls it gains kinetic energy, spins a turbine, and a generator changes that motion into electrical energy.",
  [
    { id: "pot", label: "Gravitational potential energy of the water in the reservoir", emoji: "🏔️" },
    { id: "kin", label: "Kinetic energy of the falling water", emoji: "🌊" },
    { id: "turb", label: "Kinetic energy of the spinning turbine", emoji: "🌀" },
    { id: "elec", label: "Electrical energy from the generator", emoji: "⚡" },
    { id: "light", label: "Light energy in a home", emoji: "💡" },
  ],
);

// ---------- Plate Tectonics ----------

const TECTONICS: Item[] = [
  q(1, "The Earth's rigid outer layer, broken into pieces, is called the…", "lithosphere", ["asthenosphere", "outer core", "atmosphere"], "The lithosphere (crust plus the top of the mantle) is broken into tectonic plates."),
  q(1, "Tectonic plates move because…", "heat inside the Earth drives slow movements in the mantle", ["the Moon pulls them", "winds push them", "rivers carry them"], "Convection in the hot mantle drags and pushes the plates, a few centimetres per year."),
  q(1, "About how fast do tectonic plates move?", "a few centimetres a year", ["a few metres a day", "a few kilometres an hour", "they don't move"], "Plates move about as fast as fingernails grow."),
  q(1, "Where plates push toward each other, the boundary is called…", "convergent", ["divergent", "transform", "stable"], "Convergent boundaries are collisions. Divergent boundaries pull apart."),
  q(1, "Where plates move apart, the boundary is called…", "divergent", ["convergent", "transform", "subduction"], "At divergent boundaries, new crust forms as magma rises."),
  q(1, "Where plates slide past each other sideways, the boundary is called…", "transform", ["convergent", "divergent", "subduction"], "The San Andreas Fault in California is a transform boundary."),
  q(2, "What happens at a subduction zone?", "One plate slides beneath another into the mantle.", ["Two plates move apart.", "Two plates slide sideways.", "A plate melts above ground."], "Denser oceanic crust usually sinks beneath lighter continental crust."),
  q(2, "Which plate is sliding beneath the North American plate off the coast of BC?", "the Juan de Fuca plate", ["the Pacific plate only", "the Eurasian plate", "the African plate"], "This subduction zone is the Cascadia Subduction Zone."),
  q(2, "Why are the coast mountains and volcanoes near Vancouver Island related to plate tectonics?", "They form where an oceanic plate subducts beneath a continental plate.", ["They form because of ocean tides.", "They were made by glaciers only.", "They formed from meteorites."], "Subduction causes melting and uplift, building mountains and volcanoes along the margin."),
  q(2, "Where do most earthquakes and volcanoes occur?", "near plate boundaries", ["only in deserts", "only near equators", "in the middle of oceans only"], "The Pacific “Ring of Fire” is a belt of earthquakes and volcanoes around plate boundaries."),
  q(2, "Mid-ocean ridges are found at…", "divergent boundaries", ["convergent boundaries", "transform boundaries", "hot spots only"], "New oceanic crust forms where plates pull apart."),
  q(2, "The point inside the Earth where an earthquake starts is the…", "focus", ["epicentre", "fault line", "crater"], "The epicentre is the point on the surface directly above the focus."),
  q(3, "Alfred Wegener proposed continental drift. What evidence supported it?", "Matching fossils and rock layers on different continents", ["Weather maps", "Satellite photos taken in 1900", "Ocean tides"], "Similar fossils and matching coastlines suggested the continents were once joined."),
  q(3, "Why can the Cascadia subduction zone produce very large earthquakes?", "The plates can stick for hundreds of years, then slip suddenly.", ["The plates are moving apart quickly.", "There are no faults in the region.", "The ocean floor is flat."], "Stored strain energy is released all at once when the locked plates slip."),
  q(3, "What is a tsunami?", "A series of large ocean waves caused by a sudden movement of the sea floor", ["A very high tide", "A storm wave caused by wind", "A wave caused by the Moon"], "Undersea earthquakes can lift or drop the sea floor, pushing huge amounts of water."),
  q(3, "Which is the best way to prepare for an earthquake at home?", "Practise drop, cover and hold on, and secure heavy furniture", ["Run outside during shaking", "Stand in a doorway", "Wait for an alert before acting"], "Drop, cover and hold on protects you from falling objects while shaking lasts."),
  q(3, "Rocks on the sea floor get younger as you get closer to a mid-ocean ridge. This supports the idea of…", "sea-floor spreading", ["continental drift ending", "volcanoes cooling", "tides"], "New crust forms at the ridge and moves outward, so the oldest rock is farthest away."),
];

const TECTONICS_SORT: SortSet = {
  prompt: "Which type of plate boundary is it? Sort each description.",
  hint: "Divergent boundaries pull apart (new crust). Convergent boundaries push together (mountains, subduction). Transform boundaries slide past each other.",
  bins: [
    { id: "divergent", label: "Divergent", emoji: "↔️" },
    { id: "convergent", label: "Convergent", emoji: "➡️⬅️" },
    { id: "transform", label: "Transform", emoji: "↕️" },
  ],
  items: [
    { label: "new crust forms at a mid-ocean ridge", emoji: "🌊", bin: "divergent" },
    { label: "plates pull apart in a rift valley", emoji: "🏜️", bin: "divergent" },
    { label: "an oceanic plate sinks under a continent", emoji: "🌋", bin: "convergent" },
    { label: "two continents collide to build mountains", emoji: "🏔️", bin: "convergent" },
    { label: "plates grind sideways past each other", emoji: "⚡", bin: "transform" },
    { label: "the San Andreas Fault", emoji: "🌉", bin: "transform" },
  ],
};

// ---------- Unit builders ----------

const unit = (items: Item[], sorts?: SortSet[], orders?: Parameters<typeof fromParts>[0]["orders"]) => (opts?: GenerateOptions): Question[] =>
  fromParts({ items, sorts, orders }, opts);

// ---------- Course ----------

export const course: Course = {
  grade: "8",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Life processes are performed at the cellular level.",
      "The behaviour of matter can be explained by the kinetic molecular theory and by the atomic theory.",
      "Energy is conserved, and its transformation can affect living things and the environment.",
      "The theory of plate tectonics is the unifying theory that explains Earth’s geological processes.",
    ],
  },
  units: [
    {
      id: "cells-and-life",
      title: "Cells & Life Processes",
      emoji: "🔬",
      blurb: "Organelles, photosynthesis and respiration",
      standards: { "ca-bc": "Cells: cell theory, organelles, photosynthesis, cellular respiration and the organization of living things" },
      parentNote:
        "The cell theory, what organelles do in plant and animal cells, how photosynthesis and respiration are connected, osmosis, and how cells form tissues, organs and organ systems.",
      generate: unit(CELLS, [CELL_SORT]),
    },
    {
      id: "reproduction",
      title: "Reproduction",
      emoji: "🌱",
      blurb: "Asexual and sexual reproduction",
      standards: { "ca-bc": "Asexual and sexual reproduction in plants and animals; fertilization and genetic variety" },
      parentNote:
        "How organisms reproduce with one parent or two, why sexual reproduction creates variety, the parts of a flower, and the strengths and weaknesses of each approach.",
      generate: unit(REPRO, [REPRO_SORT]),
    },
    {
      id: "particles-and-matter",
      title: "Particles & Matter",
      emoji: "⚛️",
      blurb: "Kinetic theory and the atom",
      standards: { "ca-bc": "Kinetic molecular theory and atomic theory; states of matter, physical and chemical changes" },
      parentNote:
        "How the movement of particles explains solids, liquids and gases and changes of state, the parts of an atom, elements and compounds, and telling physical from chemical changes.",
      generate: unit(MATTER, [MATTER_SORT]),
    },
    {
      id: "energy",
      title: "Energy & Its Changes",
      emoji: "⚡",
      blurb: "Forms, transfers and efficiency",
      standards: { "ca-bc": "Energy forms, transformations and transfer; conservation of energy; efficiency and energy sources" },
      parentNote:
        "Kinetic, potential, chemical, thermal and electrical energy, how energy changes form while being conserved, the three ways heat travels, efficiency, and renewable energy in BC.",
      generate: unit(ENERGY, undefined, [FORM_ORDER]),
    },
    {
      id: "plate-tectonics",
      title: "Plate Tectonics",
      emoji: "🌋",
      blurb: "Moving plates, quakes and volcanoes",
      standards: { "ca-bc": "Plate tectonics: evidence, plate boundaries, earthquakes, volcanoes and the Cascadia subduction zone" },
      parentNote:
        "Earth's layers and moving plates, the three kinds of plate boundaries, the evidence for continental drift and sea-floor spreading, and earthquake and tsunami safety on the BC coast.",
      generate: unit(TECTONICS, [TECTONICS_SORT]),
    },
  ],
};
