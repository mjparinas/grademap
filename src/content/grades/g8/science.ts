import type { SortSet } from "../../bank";
import type { Course, GenerateOptions, Question } from "../../types";
import { fromParts, orderOf, q, type Item } from "../kit";

// Grade 8 science: cells and life processes, microbes and the immune system, particles and
// matter, light and radiation, and plate tectonics (with a BC focus on the Cascadia region).

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

// ---------- Microbes & the Immune System ----------

const MICROBES: Item[] = [
  q(1, "Which of these is a characteristic of all living things?", "They grow and respond to their environment.", ["They are always green.", "They live in water.", "They never change."], "Living things are made of cells, use energy, grow, reproduce, respond to stimuli and get rid of wastes."),
  q(1, "What are micro-organisms?", "Living things too small to see without a microscope", ["Tiny rocks", "Parts of a cell", "Dust"], "Bacteria, many fungi and protists are micro-organisms."),
  q(1, "Are all bacteria harmful?", "No, many are helpful, like those that help digest food", ["Yes, all of them cause disease", "Yes, all bacteria are viruses", "No, none of them live in people"], "Many bacteria live in our gut and help us. Only some cause disease."),
  q(1, "Why does washing your hands with soap help prevent illness?", "It removes and breaks up germs so they are not spread", ["It makes germs stronger", "It adds good bacteria", "It stops you from touching things"], "Soap lifts germs off skin so water can rinse them away."),
  q(2, "Which is true about viruses?", "They need to infect a living cell to reproduce.", ["They are made of many cells.", "They can be treated with antibiotics.", "They make their own food."], "Viruses are not made of cells and can only copy themselves inside a host cell."),
  q(2, "Which is true about bacteria?", "They are single-celled living organisms that can reproduce on their own.", ["They are always viruses.", "They can never be killed.", "They have no cell parts."], "Bacteria are cells, and antibiotics can treat many bacterial infections."),
  q(2, "What is the body's first line of defence against germs?", "skin and mucus", ["antibodies", "vaccines", "fever"], "Barriers like skin, tears, stomach acid and mucus keep many germs out."),
  q(2, "What do white blood cells do?", "Find and destroy germs", ["Carry oxygen", "Make sugar", "Break food apart"], "White blood cells are part of the immune system."),
  q(2, "What are antibodies?", "Proteins made by the immune system that attach to specific germs", ["Medicines made from fungi", "Types of red blood cells", "Parts of the skin"], "Antibodies mark germs so white blood cells can destroy them."),
  q(2, "How does a vaccine help protect you?", "It trains the immune system to recognize a germ before you are exposed to the real thing.", ["It kills all germs in the body immediately.", "It replaces your white blood cells.", "It removes the need for hand washing."], "A vaccine uses a safe piece or weakened form of a germ so the body can make memory cells."),
  q(2, "What is herd immunity?", "When enough people in a community are immune that diseases spread poorly", ["When animals get sick", "When a vaccine is stored", "When only one person is immune"], "It helps protect people who can't be vaccinated, such as newborns."),
  q(2, "Antibiotics are used to treat infections caused by…", "bacteria", ["viruses", "allergies", "dust"], "Antibiotics do not work on viruses such as those that cause colds and flu."),
  q(3, "Why is it important to finish a prescribed course of antibiotics?", "Stopping early can leave the toughest bacteria alive, which can lead to resistance.", ["Antibiotics are tasty.", "They work only when taken for a day.", "They are vaccines."], "Antibiotic resistance happens when bacteria survive treatment and multiply."),
  q(3, "What is the difference between an epidemic and a pandemic?", "An epidemic is widespread in a region; a pandemic spreads across many countries or the world.", ["There is no difference.", "A pandemic is only in one town.", "An epidemic is always harmless."], "COVID-19 was declared a pandemic in March 2020."),
  q(3, "The Black Death in the 1300s and the 1918 influenza are examples of…", "pandemics that had huge impacts on societies", ["vaccines", "antibiotics", "plate tectonics"], "Pandemics can change population, economies and daily life."),
  q(3, "Which public health action slows the spread of a contagious disease?", "Vaccination, hand washing and staying home when sick", ["Sharing drinks", "Ignoring symptoms", "Avoiding all doctors"], "These steps reduce the number of people who become infected."),
  q(3, "A fever during an infection can be helpful because…", "a higher body temperature can slow some germs and boost the immune response", ["it kills the person's own cells", "it cures every illness", "it replaces antibodies"], "Fever is one of the body's defence responses, though very high fevers need medical care."),
];

const LIFE_SORT: SortSet = {
  prompt: "Living or non-living? Sort each item.",
  hint: "Living things are made of cells, use energy, grow, reproduce and respond to their environment. Non-living things don't do these on their own, even if they move or change.",
  bins: [
    { id: "living", label: "Living", emoji: "🌱" },
    { id: "nonliving", label: "Non-living", emoji: "🪨" },
  ],
  items: [
    { label: "a cedar tree", emoji: "🌲", bin: "living" },
    { label: "bread mould", emoji: "🍞", bin: "living" },
    { label: "bacteria in yogurt", emoji: "🥛", bin: "living" },
    { label: "a sea star", emoji: "⭐", bin: "living" },
    { label: "a rock", emoji: "🪨", bin: "nonliving" },
    { label: "a flame", emoji: "🔥", bin: "nonliving" },
    { label: "a cloud", emoji: "☁️", bin: "nonliving" },
    { label: "a river", emoji: "🌊", bin: "nonliving" },
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

// ---------- Light & Radiation ----------

const LIGHT: Item[] = [
  q(1, "Light is a form of…", "electromagnetic radiation", ["sound energy", "heat only", "matter"], "Light is part of the electromagnetic spectrum, which travels as waves."),
  q(1, "Which travels fastest?", "light", ["sound", "a car", "a jet plane"], "Light travels about 300 000 km every second, far faster than sound."),
  q(1, "A mirror shows your image because light…", "reflects off it", ["is absorbed", "bends through it", "disappears"], "Reflection is when light bounces off a surface."),
  q(1, "When light bends as it passes from air into water, this is called…", "refraction", ["reflection", "absorption", "radiation"], "Refraction makes a straw look bent in a glass of water."),
  q(1, "Which material lets light pass through easily so you can see clearly through it?", "transparent", ["opaque", "translucent", "reflective"], "Transparent materials like clear glass let almost all light through. Opaque ones block it."),
  q(2, "Which has the longest wavelength?", "radio waves", ["visible light", "ultraviolet", "X-rays"], "In order from longest to shortest: radio, microwave, infrared, visible, ultraviolet, X-ray, gamma."),
  q(2, "Which has the shortest wavelength?", "gamma rays", ["microwaves", "infrared", "visible light"], "Gamma rays have the shortest wavelength and the most energy."),
  q(2, "Which part of the electromagnetic spectrum do we feel as heat?", "infrared", ["ultraviolet", "X-rays", "radio waves"], "Warm objects give off infrared radiation."),
  q(2, "Which type of radiation causes sunburn?", "ultraviolet (UV)", ["infrared", "radio", "microwave"], "UV rays damage skin cells, so sunscreen, hats and shade are important."),
  q(2, "Which type of radiation is used to take images of bones?", "X-rays", ["radio waves", "microwaves", "infrared"], "X-rays pass through soft tissue but are blocked by bone."),
  q(2, "Which type of radiation is used to heat food in a microwave oven?", "microwaves", ["X-rays", "ultraviolet", "gamma rays"], "Microwaves make water molecules in food vibrate, producing heat."),
  q(2, "A wave's wavelength is…", "the distance from one crest to the next", ["the height of the wave", "the number of waves in a second", "the speed of the wave"], "Frequency is the number of waves per second. Amplitude is the height."),
  q(2, "As the frequency of a wave increases, its wavelength…", "decreases", ["increases", "stays the same", "disappears"], "For electromagnetic waves travelling at the same speed, higher frequency means shorter wavelength."),
  q(2, "Why do we see white light split into colours in a prism?", "Different colours bend by different amounts when they refract.", ["The prism adds paint.", "The prism makes new light.", "Light changes into sound."], "Red bends least and violet bends most."),
  q(3, "Why is a red shirt red?", "It reflects red light and absorbs most other colours.", ["It makes red light.", "It absorbs red light.", "It reflects all colours."], "We see the colour of light that an object reflects."),
  q(3, "Light can act as both a wave and a stream of particles. What are the particles called?", "photons", ["protons", "electrons", "neutrons"], "Photons are packets of light energy. Light shows behaviour of both waves and particles."),
  q(3, "Sound needs matter to travel. Light…", "can travel through empty space", ["cannot travel through space", "needs air", "needs water"], "That is how sunlight reaches Earth."),
  q(3, "What is the safest choice when working with a laser pointer?", "Never aim it at anyone's eyes", ["Look into the beam", "Point it at windows", "Shine it at vehicles"], "Concentrated light can damage eyes."),
];

const SPECTRUM_ORDER = orderOf(
  "Put these types of electromagnetic radiation in order from the longest wavelength to the shortest.",
  "The order is radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays.",
  [
    { id: "radio", label: "Radio waves", emoji: "📻" },
    { id: "micro", label: "Microwaves", emoji: "🍿" },
    { id: "ir", label: "Infrared", emoji: "🌡️" },
    { id: "vis", label: "Visible light", emoji: "🌈" },
    { id: "uv", label: "Ultraviolet", emoji: "☀️" },
    { id: "xray", label: "X-rays", emoji: "🩻" },
  ],
);

const WAVE_SORT: SortSet = {
  prompt: "Longer or shorter wavelength than visible light? Sort each radiation.",
  hint: "Radio waves, microwaves and infrared have longer wavelengths than visible light. Ultraviolet, X-rays and gamma rays have shorter wavelengths.",
  bins: [
    { id: "longer", label: "Longer than visible light", emoji: "〰️" },
    { id: "shorter", label: "Shorter than visible light", emoji: "⚡" },
  ],
  items: [
    { label: "radio waves", emoji: "📻", bin: "longer" },
    { label: "microwaves", emoji: "🍿", bin: "longer" },
    { label: "infrared", emoji: "🌡️", bin: "longer" },
    { label: "Wi-Fi signals", emoji: "📶", bin: "longer" },
    { label: "ultraviolet", emoji: "☀️", bin: "shorter" },
    { label: "X-rays", emoji: "🩻", bin: "shorter" },
    { label: "gamma rays", emoji: "☢️", bin: "shorter" },
    { label: "UV from a tanning lamp", emoji: "🪫", bin: "shorter" },
  ],
};

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
      "Energy can be transferred as both a particle and a wave.",
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
      id: "microbes-and-immunity",
      title: "Microbes & the Immune System",
      emoji: "🦠",
      blurb: "Germs, vaccines and pandemics",
      standards: { "ca-bc": "Characteristics of life; micro-organisms; basic functions of the immune system; vaccination, antibiotics, epidemics and pandemics" },
      parentNote:
        "What makes something alive, helpful and harmful micro-organisms, how the immune system defends the body, how vaccines and antibiotics work, and the impact of epidemics and pandemics.",
      generate: unit(MICROBES, [LIFE_SORT]),
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
      id: "light-and-radiation",
      title: "Light & Radiation",
      emoji: "🌈",
      blurb: "Waves, the spectrum and how light behaves",
      standards: { "ca-bc": "Electromagnetic radiation: types and effects; light as a wave and a particle; reflection and refraction" },
      parentNote:
        "Wavelength and frequency, the electromagnetic spectrum from radio waves to gamma rays and what each is used for, reflection, refraction and colour, and staying safe from UV radiation.",
      generate: unit(LIGHT, [WAVE_SORT], [SPECTRUM_ORDER]),
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
