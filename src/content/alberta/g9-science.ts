import { pick, randInt, textChoice } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { ab, levelOf, spaced, typeIn, type Maker } from "./kit";
import { q, unitSet, type Item } from "../ontario/g9-science";

// Alberta Grade 9 science (Science 7-9, 2003). Reproduction, atoms and the periodic table, properties of
// materials and the electricity units are shared with BC and Ontario. The units below are written for the
// parts of Units A, B, C and E that no existing unit covers: biological diversity and heredity, chemical
// change, environmental chemistry and space exploration.

// ---------- Unit A: Biological Diversity ----------

const DIVERSITY: Item[] = [
  q(1, "What is a species?", "a group of living things that can reproduce with one another and have fertile offspring", ["any group of animals living in the same place", "all the living things in a forest", "one single living thing"], "Members of the same species can breed together and produce young that can also reproduce."),
  q(1, "What is a niche?", "the role a species plays in its ecosystem, including what it eats and where it lives", ["the smallest part of a cell", "a place where only plants grow", "the number of animals in a herd"], "A niche is a species' \"job\" in an ecosystem: its food, home and relationships with other living things."),
  q(1, "Which is an example of variation within a species?", "Different individual dogs have different coat colours", ["A fish lives in water and a bird lives in the air", "A cactus grows in a desert", "A wolf eats meat and a deer eats plants"], "Variation within a species means the individuals differ from one another, even though they are the same kind of living thing."),
  q(1, "Why is high biological diversity good for an ecosystem?", "If conditions change, some species are likely to survive", ["Every species can live anywhere", "It means all species look alike", "It stops all change"], "Many different species and many different traits give an ecosystem more ways to cope with change."),
  q(1, "Which type of reproduction needs only one parent?", "asexual reproduction", ["sexual reproduction", "fertilization", "pollination"], "In asexual reproduction one parent produces offspring that are identical to it."),
  q(1, "Yeast reproduces by growing a small bump that breaks off to become a new cell. What is this called?", "budding", ["binary fission", "fertilization", "pollination"], "Budding is a form of asexual reproduction in which a new organism grows out of the parent."),
  q(1, "A bacterium splits into two identical cells. What is this called?", "binary fission", ["budding", "pollination", "meiosis"], "In binary fission one cell divides into two identical cells."),
  q(1, "Strawberry plants send out runners that grow into new plants. What kind of reproduction is this?", "asexual", ["sexual", "neither", "fertilization by pollen"], "The new plants grow from part of one parent and are identical to it."),
  q(1, "Which trait is inherited?", "eye colour", ["a scar from a fall", "a haircut", "knowing how to ride a bike"], "Inherited (heritable) traits are passed from parents to offspring through genes. Scars, haircuts and skills are not."),
  q(2, "A tick feeds on the blood of a moose and harms it. What kind of symbiotic relationship is this?", "parasitism", ["mutualism", "commensalism", "competition"], "In parasitism one organism benefits and the other is harmed."),
  q(2, "A bee gets nectar from a flower and carries pollen to other flowers. What kind of relationship is this?", "mutualism", ["parasitism", "commensalism", "predation"], "In mutualism both organisms benefit."),
  q(2, "Barnacles attach to a whale. The barnacles get a place to live and food, and the whale is not noticeably helped or harmed. What kind of relationship is this?", "commensalism", ["mutualism", "parasitism", "competition"], "In commensalism one organism benefits and the other is not affected."),
  q(2, "Aspen trees can sprout new stems from their roots (suckers), so a stand of aspens may all be one clone. What is the main drawback of this for the stand?", "The trees are genetically identical, so one disease could harm them all", ["The trees cannot grow tall", "The trees need two parents", "The trees cannot get nutrients"], "Offspring from asexual reproduction are identical, so there is little variation to help if conditions change."),
  q(2, "Hand clasping (which thumb is on top) is an example of…", "discrete variation", ["continuous variation", "no variation", "an acquired trait"], "Discrete variation has separate categories. Continuous variation, like height, has a whole range of values."),
  q(2, "The height of Grade 9 students ranges from short to tall with every value in between. This is…", "continuous variation", ["discrete variation", "a trait that is not inherited at all", "asexual reproduction"], "Continuous variation shows a smooth range of values."),
  q(2, "After fertilization, the first cell formed is called the…", "zygote", ["embryo", "spore", "gamete"], "A sperm and an egg join to make a zygote, which divides and grows into an embryo."),
  q(2, "What is a gamete?", "a sex cell, such as a sperm or an egg", ["a type of body cell", "a tiny plant", "a gene"], "Gametes carry half the usual number of chromosomes."),
  q(2, "Which best describes the relationship between DNA, genes and chromosomes?", "Chromosomes are made of DNA, and genes are sections of DNA that carry instructions for traits", ["Genes are made of chromosomes, and DNA is a trait", "DNA is a gene made of chromosomes", "Chromosomes are found only in sex cells"], "DNA is the molecule that stores the instructions. A gene is a short section of it. Long strands of DNA make up chromosomes."),
  q(2, "Which kind of cell division produces sex cells (gametes)?", "meiosis", ["mitosis", "binary fission", "budding"], "Meiosis makes cells with half the usual number of chromosomes."),
  q(2, "Which kind of cell division produces two identical body cells?", "mitosis", ["meiosis", "fertilization", "pollination"], "Mitosis copies the chromosomes so each new cell has the same set as the parent cell."),
  q(2, "Which is true about a dominant trait?", "It shows in the offspring even when only one parent passes it on", ["It is always the most common trait", "It is always better for survival", "It can never be passed on"], "Dominant and recessive traits only partly explain variation: many traits are controlled by more than one gene."),
  q(3, "A person's height depends on both heredity and diet. What does this show?", "Some characteristics are affected by both heredity and environment", ["Height is not inherited at all", "Only the environment matters", "Only genes matter"], "Some traits are shaped by both the genes we inherit and the conditions we grow up in."),
  q(3, "The plains bison was nearly gone by the late 1800s. Why does a very small herd have a higher risk of dying out?", "There is little variation, so one disease or change could affect all of them", ["Small herds cannot reproduce", "Small herds never need food", "Variation is harmful"], "Low genetic diversity means fewer traits that might help some survive a new disease or a changing environment."),
  q(3, "Plant breeders in Canada developed canola from rapeseed by repeatedly choosing plants with the traits they wanted. What is this called?", "artificial selection", ["natural selection", "mutation only", "asexual reproduction"], "In artificial selection, people choose which organisms breed so that desired traits become more common."),
  q(3, "Which is an example of natural selection?", "Insects with a resistance to a pesticide survive and pass this trait on", ["A farmer chooses the largest seeds to plant", "A breeder crosses two dog breeds", "A gardener clones a rose"], "In natural selection the environment, not people, determines which individuals survive and reproduce."),
  q(3, "Which human activity is a major cause of lost biodiversity?", "destroying and breaking up habitat", ["planting native flowers", "setting up wildlife corridors", "protecting wetlands"], "When habitat is destroyed or divided, species lose the food, shelter and space they need."),
  q(3, "A seed bank stores seeds from many varieties of crops. How does this protect biodiversity?", "It keeps a variety of genetic traits that could be needed in the future", ["It makes every crop identical", "It stops all plant diseases", "It makes seeds bigger"], "Stored varieties are a backup if a crop disease or a changing climate harms the common varieties."),
];

function bacteria(): Question {
  const minutes = pick([20, 30, 15]);
  const rounds = randInt(2, 4);
  const total = 2 ** rounds;
  return typeIn(
    `One bacterium divides by binary fission every ${minutes} minutes. How many bacteria are there after ${minutes * rounds} minutes, starting with one?`,
    total,
    `Each division doubles the number. After ${rounds} divisions: 2 × 2${rounds > 2 ? " × 2" : ""}${rounds > 3 ? " × 2" : ""} = ${total}.`,
  );
}

function sexCells(): Question {
  const [name, n] = pick<[string, number]>([["human", 46], ["fruit fly", 8], ["dog", 78], ["corn", 20], ["pea plant", 14]]);
  return textChoice(
    `A ${name} body cell has ${n} chromosomes. How many chromosomes are in one of its sex cells (gametes)?`,
    String(n / 2),
    [String(n), String(n * 2), String(n / 2 + 2)],
    `Meiosis halves the number of chromosomes, so a sex cell has ${n} ÷ 2 = ${n / 2}. When two sex cells join, the full number is restored.`,
  );
}

function diversity(opts?: GenerateOptions): Question[] {
  const makers: Maker[] = [bacteria, sexCells];
  return unitSet(DIVERSITY, levelOf(opts), makers);
}

// ---------- Unit B: Matter and Chemical Change ----------

const REACTIONS: Item[] = [
  q(1, "In a chemical reaction, what are the reactants?", "the starting substances", ["the new substances formed", "the energy released", "the container"], "Reactants are what you start with. Products are what you end up with."),
  q(1, "In a chemical reaction, what are the products?", "the new substances formed", ["the starting substances", "the catalysts", "the equipment"], "Reactants change into products."),
  q(1, "Which is a sign that a chemical change may have happened?", "Gas bubbles form when two liquids are mixed", ["A solid is cut into pieces", "Ice melts", "Sugar dissolves in water"], "Bubbles of a new gas, a colour change, a new solid, or heat and light can all suggest a new substance has formed."),
  q(1, "Which is a physical change?", "ice melting", ["wood burning", "iron rusting", "milk turning sour"], "In a physical change no new substance forms."),
  q(1, "Which is a chemical change?", "iron rusting", ["water freezing", "sugar dissolving in tea", "paper being torn"], "Rust is a new substance (iron oxide) formed when iron reacts with oxygen and water."),
  q(1, "What does a WHMIS symbol on a container warn you about?", "a hazard of the product inside", ["the price of the product", "the name of the store", "how old the product is"], "WHMIS (Workplace Hazardous Materials Information System) symbols show the hazards of a product so people can handle it safely."),
  q(1, "Which two things must be present for a fuel to burn (combustion)?", "oxygen and heat (a high enough temperature)", ["nitrogen and water", "carbon dioxide and ice", "helium and light"], "Fire needs fuel, oxygen and heat. Taking away any one of them puts it out."),
  q(2, "A reaction gives off heat to the surroundings. It is called…", "exothermic", ["endothermic", "neutral", "physical"], "Exothermic reactions release energy, so the surroundings get warmer. Burning is an example."),
  q(2, "A cold pack gets cold when the chemicals inside are mixed. This is an example of…", "an endothermic reaction", ["an exothermic reaction", "a physical change only", "combustion"], "Endothermic reactions take in energy from the surroundings, so the surroundings get cooler."),
  q(2, "Baking soda is added to vinegar and bubbles appear. A student weighs everything in an open container before and after, and the mass goes down. Why?", "The gas that formed escaped into the air", ["Mass is destroyed in reactions", "The vinegar turned into energy", "The container got lighter"], "Mass is conserved. If the gas had been trapped in a closed container, the mass would not change."),
  q(2, "What does the law of conservation of mass say?", "The total mass of the reactants equals the total mass of the products", ["Mass is lost when a gas forms", "Products always have more mass", "Mass can be created by heat"], "Atoms are rearranged in a reaction, not made or destroyed."),
  q(2, "Which is a way to make a reaction go faster?", "raise the temperature", ["lower the temperature", "use bigger lumps instead of powder", "make the reactants more dilute"], "Particles collide more often and with more energy when it is warmer."),
  q(2, "Why does powdered sugar dissolve faster than a sugar cube?", "Powder has more surface area exposed to the water", ["Powder is a different substance", "A cube is hotter", "A cube has more mass than powder"], "Smaller pieces have more surface area, so more particles can react or dissolve at once."),
  q(2, "A catalyst is a substance that…", "speeds up a reaction without being used up", ["slows a reaction down", "is always a gas", "turns into a product"], "A catalyst makes a reaction faster and is still there at the end."),
  q(2, "What is the chemical name of NaCl?", "sodium chloride", ["sodium chlorine", "sodium chlorate", "nitrogen chloride"], "The metal comes first, and the non-metal name ends in -ide."),
  q(2, "What is the chemical name of MgO?", "magnesium oxide", ["magnesium oxygen", "manganese oxide", "magnesium dioxide"], "Name the metal, then the non-metal with the ending -ide: oxygen becomes oxide."),
  q(2, "What is the chemical name of CaCl₂?", "calcium chloride", ["calcium dichloride", "chlorine calcium", "calcium chlorate"], "For ionic compounds of a metal and non-metal, the name is the metal followed by the non-metal with -ide."),
  q(2, "In the word equation methane + oxygen → carbon dioxide + water, which are the products?", "carbon dioxide and water", ["methane and oxygen", "methane and water", "oxygen and carbon dioxide"], "Products are on the right side of the arrow."),
  q(2, "The word equation magnesium + oxygen → magnesium oxide describes…", "magnesium burning in air", ["magnesium melting", "magnesium dissolving", "water boiling"], "Magnesium reacts with oxygen to form the white solid magnesium oxide, giving off bright light."),
  q(2, "Rusting of iron needs which substances?", "oxygen and water", ["only nitrogen", "helium and sand", "only carbon dioxide"], "Iron, oxygen and water react to make iron oxide (rust). Painting or oiling iron keeps oxygen and water away."),
  q(3, "A solution of hydrochloric acid is poured on zinc, and a gas forms that burns with a small pop. What is the gas most likely to be?", "hydrogen", ["oxygen", "nitrogen", "helium"], "Many metals react with acids to give off hydrogen gas."),
  q(3, "Which pair would make a new substance (a chemical change) rather than a mixture?", "iron filings heated with sulphur", ["sugar stirred into water", "sand mixed with salt", "oil shaken with vinegar"], "Heating iron and sulphur makes iron sulphide, which is not attracted to a magnet the way iron is."),
  q(3, "Which statement about a balanced chemical equation is correct?", "The same number of each kind of atom appears on both sides", ["The same number of molecules always appears on both sides", "Products always have more atoms", "Only the reactants have atoms"], "Atoms are conserved, so each element must balance."),
  q(3, "Why should a lab never use a corrosive or an explosive chemical without checking its WHMIS label and Safety Data Sheet first?", "They tell how to store, handle and respond to the hazards safely", ["They show the price", "They show the colour of the chemical only", "They are only for adults"], "Labels and Safety Data Sheets give hazard and first-aid information."),
  q(3, "A student heats baking soda and sees bubbles, and the solid left behind is different. What is the best evidence that a chemical change took place?", "A new gas and a different solid formed", ["The container got warm from the hot plate", "The solid broke into smaller pieces", "The student saw it move"], "Evidence of new substances (a gas, a different solid) is stronger than a change in appearance or temperature alone."),
];

function massConserved(): Question {
  const a = randInt(2, 40);
  const b = randInt(2, 40);
  return textChoice(
    `${a} g of one substance reacts completely with ${b} g of another in a closed container to form one product. What is the mass of the product?`,
    `${a + b} g`,
    [`${Math.abs(a - b) === 0 ? a * 2 + 1 : Math.abs(a - b)} g`, `${a + b + 5} g`, `${a + b - 3} g`],
    `Mass is conserved, so the product has the same total mass as the reactants: ${a} + ${b} = ${a + b} g.`,
  );
}

function countAtoms(): Question {
  const cases: [string, string, number, string][] = [
    ["2H₂ + O₂ → 2H₂O", "hydrogen", 4, "2 molecules of H₂, each with 2 hydrogen atoms, is 2 × 2 = 4."],
    ["2H₂ + O₂ → 2H₂O", "oxygen", 2, "One O₂ molecule has 2 oxygen atoms."],
    ["CH₄ + 2O₂ → CO₂ + 2H₂O", "oxygen", 4, "2 molecules of O₂, each with 2 oxygen atoms, is 4."],
    ["CH₄ + 2O₂ → CO₂ + 2H₂O", "hydrogen", 4, "CH₄ has 4 hydrogen atoms (the 2 in front of H₂O is on the other side)."],
    ["2Mg + O₂ → 2MgO", "magnesium", 2, "The coefficient 2 in front of Mg means 2 magnesium atoms."],
    ["N₂ + 3H₂ → 2NH₃", "hydrogen", 6, "3 molecules of H₂, each with 2 hydrogen atoms, is 3 × 2 = 6."],
  ];
  const [eqn, element, n, hint] = pick(cases);
  return typeIn(`In ${eqn}, how many ${element} atoms are on the left side (reactants)?`, n, hint);
}

function reactions(opts?: GenerateOptions): Question[] {
  return unitSet(REACTIONS, levelOf(opts), [massConserved, countAtoms]);
}

// ---------- Unit C: Environmental Chemistry ----------

const ENVIRONMENT: Item[] = [
  q(1, "A solution has a pH of 3. What is it?", "an acid", ["a base", "neutral", "pure water"], "A pH below 7 is acidic, 7 is neutral and above 7 is basic."),
  q(1, "A solution has a pH of 10. What is it?", "a base", ["an acid", "neutral", "a gas"], "A pH above 7 is basic (alkaline)."),
  q(1, "What is the pH of pure water at room temperature?", "7", ["0", "1", "14"], "Pure water is neutral."),
  q(1, "Blue litmus paper turns red in a solution. What does this tell you?", "The solution is an acid", ["The solution is a base", "The solution is neutral", "The solution is a mixture"], "Acids turn blue litmus red. Bases turn red litmus blue."),
  q(1, "Which of these is essential for strong bones and teeth?", "calcium", ["mercury", "lead", "chlorine gas"], "Calcium is a mineral the body needs for bones and teeth."),
  q(1, "Plants often need nitrogen and phosphorus from the soil. How can farmers supply more?", "by adding fertilizer", ["by adding sand", "by removing all water", "by covering the soil with plastic"], "Fertilizers contain the nutrients that crops use up as they grow."),
  q(1, "Which is a common source of acid rain?", "burning fossil fuels, which releases sulphur dioxide and nitrogen oxides", ["planting trees", "wind turbines", "recycling paper"], "These gases combine with water in the air to make acids."),
  q(2, "What can happen to a lake that receives acid rain over many years?", "Its pH drops and fish and other living things may die", ["It becomes saltier", "It gets more fish", "Its water becomes neutral"], "Many aquatic animals cannot survive when the water becomes too acidic."),
  q(2, "An acid reacts with a base. What forms?", "a salt and water", ["only a gas", "a stronger acid", "an element"], "This is called neutralization."),
  q(2, "Why is crushed limestone (a base) sometimes added to an acidified lake?", "to neutralize some of the acid", ["to make the lake warmer", "to add oxygen", "to attract fish"], "The base reacts with the acid and raises the pH."),
  q(2, "Each step down on the pH scale means the solution is…", "10 times more acidic", ["2 times more acidic", "1 unit more basic", "twice as basic"], "The pH scale is logarithmic: pH 4 is 10 times more acidic than pH 5."),
  q(2, "Which is an organic substance?", "a carbohydrate such as starch", ["table salt", "water", "sand"], "Organic substances come from living things and are built around carbon, like carbohydrates, proteins and lipids."),
  q(2, "Fertilizer from fields runs off into a lake and the water turns green with algae. This is caused mainly by too much…", "phosphorus and nitrogen", ["oxygen", "helium", "ice"], "These nutrients let algae grow fast. When the algae die and decay, they use up the oxygen that fish need."),
  q(2, "Mayfly and stonefly larvae are found in a stream. Scientists use them as indicator species for…", "clean, well-oxygenated water", ["very polluted water", "water with no oxygen", "salt water"], "Some living things are sensitive to pollution, so their presence is a sign of good water quality. This is biological monitoring."),
  q(2, "DDT and mercury are hard for living things to break down. What happens to them in a food chain?", "They build up in the bodies of animals higher in the chain", ["They disappear at each step", "They are found only in plants", "They are all passed to the producers"], "This build-up is called biomagnification, and top predators may have the highest amounts."),
  q(2, "Why does a substance that is not biodegradable cause a bigger problem in the environment?", "It stays for a long time and can build up", ["It disappears quickly", "It is always safe", "It makes the soil neutral"], "Biodegradable substances are broken down by living things. Others persist."),
  q(2, "On Canada's Air Quality Health Index (AQHI), which reading means a low health risk?", "1 to 3", ["4 to 6", "7 to 10", "10 or higher"], "The AQHI scale is low risk at 1 to 3, moderate at 4 to 6, high at 7 to 10 and very high above 10."),
  q(2, "Why is wildfire smoke a concern for air quality?", "It carries fine particles that can irritate lungs", ["It makes the air more nutritious", "It adds oxygen", "It removes carbon dioxide"], "Small particles in smoke are breathed deep into the lungs, and people with asthma or heart disease are affected the most."),
  q(3, "A little phosphate helps plants grow, but a lot can harm a river. What does this show?", "The amount of a substance matters as well as what it is", ["Phosphate is always safe", "Phosphate is never useful", "Plants do not need nutrients"], "Many substances are helpful in small amounts and harmful in large amounts."),
  q(3, "Why is a river sample tested several times in different places and seasons?", "Concentrations of substances can change with place and time", ["Water never changes", "One test is always enough", "To use up the sample"], "Monitoring many samples reduces uncertainty."),
  q(3, "Which question is most important in deciding how much of a chemical can safely be released into a river?", "How much harm does it cause to living things at different concentrations?", ["What colour is the chemical?", "Who sells the chemical?", "How many bottles do we have?"], "Decisions about safe levels depend on evidence about toxicity and about how the substance spreads and builds up."),
  q(3, "Dilution can reduce a pollutant's concentration. Why is it not a complete solution?", "The substance is still in the environment and can build up in living things", ["Dilution destroys the substance", "Dilution makes it more toxic", "Dilution makes it a gas"], "Spreading a substance out makes it less concentrated, but it does not make it go away."),
];

function concentration(): Question {
  const litres = pick([2, 4, 5, 10]);
  const per = randInt(2, 9);
  const mg = per * litres;
  return typeIn(`A ${litres} L water sample contains ${mg} mg of nitrate. What is the concentration, in mg per litre?`, per, `Concentration is amount divided by volume: ${mg} ÷ ${litres} = ${per} mg/L.`, undefined, { suffix: "mg/L" });
}

function phCompare(): Question {
  const low = randInt(2, 5);
  const gap = randInt(1, 2);
  const high = low + gap;
  return textChoice(
    `Which is more acidic, a solution with pH ${low} or a solution with pH ${high}?`,
    `pH ${low}`,
    [`pH ${high}`, "They are equally acidic"],
    `The lower the pH, the more acidic the solution. A pH of ${low} is ${gap === 1 ? "10" : "100"} times more acidic than a pH of ${high}.`,
  );
}

function environment(opts?: GenerateOptions): Question[] {
  return unitSet(ENVIRONMENT, levelOf(opts), [concentration, phCompare]);
}

// ---------- Unit E: Space Exploration ----------

const SPACE: Item[] = [
  q(1, "Which model puts the Sun at the centre of the solar system?", "heliocentric", ["geocentric", "geographic", "galactic"], "In the heliocentric model the planets orbit the Sun. In the geocentric model everything orbits Earth."),
  q(1, "Who used a telescope to see moons orbiting Jupiter in the early 1600s?", "Galileo", ["Newton", "Darwin", "Einstein"], "Galileo's observations supported the idea that not everything orbits Earth."),
  q(1, "What is the main job of an optical telescope?", "to collect and focus visible light from distant objects", ["to make sounds", "to cool stars", "to measure the wind"], "Larger mirrors and lenses collect more light, so fainter objects can be seen."),
  q(1, "Why are some telescopes placed in space?", "Earth's atmosphere blurs and blocks some light", ["Space is closer to the stars by a few kilometres", "Telescopes work only in cold weather", "Gravity is stronger in space"], "Above the atmosphere a telescope gets a sharper view and can detect light that never reaches the ground."),
  q(1, "What is a satellite?", "an object that orbits a larger object", ["a very large star", "a type of rocket fuel", "a kind of planet"], "Moons are natural satellites. Humans launch artificial satellites."),
  q(1, "Which of these is a use of artificial satellites?", "weather observation", ["growing food on Mars", "making gravity", "melting asteroids"], "Satellites are used for communication, GPS, weather observation and remote sensing."),
  q(1, "Which Canadian-built robotic arm is used on the International Space Station?", "Canadarm2", ["Skylab", "Voyager", "Sputnik"], "Canadarm2 moves equipment and helps astronauts working outside the station."),
  q(1, "What does a light-year measure?", "distance", ["time", "brightness", "speed"], "A light-year is the distance light travels in one year, about 9.5 trillion kilometres."),
  q(2, "What do radio telescopes detect?", "radio waves from objects in space", ["only visible light", "sounds travelling through space", "heat on Earth"], "Radio waves pass through dust clouds and show features optical telescopes cannot see."),
  q(2, "What can spectral analysis of starlight tell scientists?", "which elements are in a star", ["how old the observers are", "how many moons it has", "what colour Earth is"], "Each element absorbs or gives off light at certain wavelengths, creating a pattern like a fingerprint."),
  q(2, "A star seems to shift slightly against distant stars when viewed from opposite sides of Earth's orbit. What is this effect, used to estimate distance, called?", "parallax", ["Doppler effect", "an eclipse", "reflection"], "Closer stars show a larger shift."),
  q(2, "Light from a distant galaxy is shifted towards the red end of the spectrum. What does this suggest?", "The galaxy is moving away from us", ["The galaxy is moving towards us", "The galaxy is standing still", "The galaxy is very small"], "This is the Doppler effect for light."),
  q(2, "A satellite in geostationary orbit stays above the same spot on Earth. Why is this useful?", "A fixed dish on the ground can always point at it for communication or weather images", ["It needs no energy to stay up", "It moves faster than Earth", "It escapes gravity"], "A geostationary satellite orbits once every 24 hours, in step with Earth's rotation."),
  q(2, "A GPS receiver finds its position by using signals from…", "several satellites at known positions", ["one lighthouse", "the Moon only", "a compass needle"], "Distances from at least three satellites (in practice, four) pin down the location."),
  q(2, "Which Canadian satellites observe Earth with radar, for example to map ice, floods and crops?", "RADARSAT", ["Hubble", "Sputnik", "Apollo"], "Remote sensing from space helps with wildfire, flood and crop monitoring across Canada."),
  q(2, "Why do rockets often have multiple stages?", "Empty stages can be dropped to reduce the mass that must keep accelerating", ["It makes the rocket look bigger", "Stages make gravity weaker", "It keeps the rocket cold"], "Dropping the heavy empty parts means the remaining fuel pushes less mass."),
  q(2, "Which is a challenge of living on the Moon?", "no atmosphere to breathe or to protect from radiation", ["too much oxygen", "thick clouds", "oceans"], "Astronauts need life-support systems that supply air, pressure and protection."),
  q(2, "Which technology on the International Space Station reduces the amount of water that must be sent from Earth?", "systems that recycle water, including from air moisture", ["a nearby lake", "rain collection", "ocean pumps"], "Recycling air and water is essential for long missions."),
  q(2, "Which is a risk of space exploration?", "space junk that can collide with spacecraft", ["too many comets to visit", "excess breathable air", "more shade"], "Millions of pieces of debris orbit Earth at high speeds."),
  q(2, "An astronaut's tool has a mass of 12 kg on Earth. What is its mass on the Moon?", "12 kg", ["2 kg", "72 kg", "0 kg"], "Mass is the amount of matter and does not change with location. Weight depends on gravity."),
  q(3, "A 600 N astronaut stands on the Moon, where gravity is about one sixth of Earth's. About what is the astronaut's weight there?", "100 N", ["600 N", "3600 N", "0 N"], "600 ÷ 6 = 100 N. Weight depends on gravity; mass stays the same."),
  q(3, "Two stars both appear equally bright from Earth, but one is much farther away. What must be true?", "The farther star gives off much more light", ["They give off the same light", "The nearer star is much bigger", "The farther star is cooler"], "Apparent brightness depends on both the star's output and its distance."),
  q(3, "Meteor showers can be predicted in general, but not exactly. Why?", "The amount of debris and its exact path are uncertain", ["Meteors do not exist", "The Moon blocks them", "Scientists do not observe them"], "Predictions come from earlier observations, so they have uncertainty."),
  q(3, "Which argument about mining the Moon or asteroids is an ethical or political issue?", "Who should own and benefit from resources found in space", ["What colour the rocks are", "How the rocks smell", "How many rocks fit on a table"], "Decisions about space resources involve costs, benefits, ownership and the environment."),
  q(3, "Many ideas used in everyday life, like medical imaging and satellite navigation, came from space research. What are such benefits called?", "spinoffs", ["black holes", "orbits", "eclipses"], "Technologies developed for space can find new uses on Earth."),
];

function lightYears(): Question {
  const ly = pick([4, 8, 12, 25, 40, 100]);
  return typeIn(`A star is ${ly} light-years from Earth. About how many years does its light take to reach us?`, ly, `A light-year is the distance light travels in a year, so light from a star ${ly} light-years away travels for ${ly} years.`);
}

function signal(): Question {
  const sec = randInt(2, 9);
  const km = sec * 300000;
  return typeIn(`Radio signals travel about 300 000 km every second. A probe sends a signal that is received ${sec} s later. How far away is the probe, in thousands of km?`, sec * 300, `${sec} s × 300 000 km/s = ${spaced(km)} km, which is ${sec * 300} thousand km.`, undefined, { suffix: "thousand km" });
}

function space(opts?: GenerateOptions): Question[] {
  return unitSet(SPACE, levelOf(opts), [lightYears, signal]);
}

export const units: Unit[] = [
  {
    id: "biodiversity-ab",
    title: "Biodiversity & Heredity",
    emoji: "🧬",
    blurb: "Variation, reproduction and genes",
    standards: ab("Unit A: Biological Diversity", "species and niches, variation, how traits are passed on, and what puts diversity at risk"),
    parentNote: "Why variety within and between species helps living things survive, how symbiosis works, sexual and asexual reproduction, the basics of DNA, genes and chromosomes, and how people and nature influence which traits are passed on.",
    generate: diversity,
  },
  {
    id: "chemical-change-ab",
    title: "Chemical Change",
    emoji: "⚗️",
    blurb: "Reactions, mass and chemical names",
    standards: ab("Unit B: Matter and Chemical Change", "evidence of chemical change, reactants and products, conservation of mass, reaction rates and names of simple compounds"),
    parentNote: "Telling a chemical change from a physical change, reading simple word and symbol equations, why mass is conserved, what speeds a reaction up, exothermic and endothermic changes, and WHMIS safety.",
    generate: reactions,
  },
  {
    id: "environmental-chemistry-ab",
    title: "Chemistry & the Environment",
    emoji: "🌊",
    blurb: "pH, pollutants and water quality",
    standards: ab("Unit C: Environmental Chemistry", "acids and bases, nutrients and pollutants, air and water quality, and how substances build up in living things"),
    parentNote: "The pH scale, acid rain and neutralization, nutrients and fertilizer runoff, indicator species, how substances such as mercury build up in food chains, and why the amount of a substance matters for safety.",
    generate: environment,
  },
  {
    id: "space-exploration-ab",
    title: "Space Exploration",
    emoji: "🛰️",
    blurb: "Telescopes, satellites and living in space",
    standards: ab("Unit E: Space Exploration", "telescopes, satellites, remote sensing and the challenges of living and working in space"),
    parentNote: "How optical and radio telescopes work, how scientists measure distance and motion in space, what satellites are used for, life-support needs for space travel, Canada's part in space exploration, and the risks and issues of using space.",
    generate: space,
  },
];
