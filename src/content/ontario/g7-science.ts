import { sortQuestion, type SortSet } from "../bank";
import { pick, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { type Item, levelled, orderQuestion, perBin } from "./g7-bank";
import { levelOf, on, spaced, typeIn } from "./kit";

// Ontario Grade 7 Science and Technology (2022). Units are written for the Ontario expectations
// (Life Systems, Matter and Energy, Structures and Mechanisms, Earth and Space Systems). BC's climate
// and elements units are shared where they fit. The STEM skills strand (A) is practised through the
// reasoning in these questions, not as units of its own.

// ---------- Ecosystems ----------

const BIOTIC_SORT: SortSet = {
  prompt: "Biotic or abiotic? Sort each part of an ecosystem.",
  hint: "Biotic parts are living things (plants, animals, fungi, bacteria). Abiotic parts are the non-living things, such as sunlight, water, air, rock and temperature.",
  bins: [
    { id: "biotic", label: "biotic (living)", emoji: "🌱" },
    { id: "abiotic", label: "abiotic (non-living)", emoji: "🪨" },
  ],
  items: [
    { label: "a maple tree", emoji: "🌳", bin: "biotic" },
    { label: "a mushroom", emoji: "🍄", bin: "biotic" },
    { label: "a beaver", emoji: "🦫", bin: "biotic" },
    { label: "bacteria in the soil", emoji: "🦠", bin: "biotic" },
    { label: "a frog", emoji: "🐸", bin: "biotic" },
    { label: "sunlight", emoji: "☀️", bin: "abiotic" },
    { label: "a boulder", emoji: "🪨", bin: "abiotic" },
    { label: "the temperature", emoji: "🌡️", bin: "abiotic" },
    { label: "water in a stream", emoji: "💧", bin: "abiotic" },
    { label: "wind", emoji: "🌬️", bin: "abiotic" },
  ],
};

const ECOSYSTEM_BANK: Item[] = [
  { prompt: "What is an ecosystem?", right: "A network of interactions among living things and their non-living surroundings", wrong: ["A group of animals of the same species", "Only the plants that grow in one place", "All the carnivores in a region"], hint: "An ecosystem includes both the living (biotic) and non-living (abiotic) parts, and the ways they affect each other." },
  { prompt: "Which of these is an abiotic component of a forest ecosystem?", right: "the amount of sunlight", wrong: ["a woodpecker", "moss on a log", "bacteria in the soil"], hint: "Abiotic means non-living. Light, water, air, soil minerals and temperature are abiotic." },
  { prompt: "Which of these is a biotic component of a pond ecosystem?", right: "algae", wrong: ["water temperature", "dissolved oxygen", "sunlight"], hint: "Biotic parts are living things. Algae are living; the others are non-living conditions." },
  { prompt: "A beaver builds a dam and floods a meadow. What does this show?", right: "A living thing can change the non-living parts of its ecosystem", wrong: ["Only abiotic factors can change an ecosystem", "Energy is created by animals", "Producers have eaten the consumers"], hint: "The beaver (biotic) changed the water level and land (abiotic)." },
  { prompt: "Which is an interaction between a biotic and an abiotic component?", right: "A maple tree takes in water from the soil", wrong: ["A fox hunts a rabbit", "A bee visits a flower", "A wolf howls to its pack"], hint: "Look for one living thing and one non-living thing. Water and soil are non-living." },
  { prompt: "A group of wolves of the same species living in a park is a…", right: "population", wrong: ["community", "habitat", "decomposer"], hint: "A population is all the members of one species in an area." },
  { prompt: "What is a habitat?", right: "The place where an organism lives and finds what it needs", wrong: ["The food an organism eats", "A group of the same species", "The energy from the Sun"], hint: "A habitat provides food, water, shelter and space." },
  { prompt: "What is a limiting factor?", right: "Something that restricts how many organisms an ecosystem can support", wrong: ["A rule that limits hunting", "The biggest animal in an ecosystem", "A food that all organisms eat"], hint: "Food, water, space, shelter, disease and predators can all limit a population." },
  { prompt: "Which is a biotic limiting factor for a population of rabbits?", right: "predators such as foxes", wrong: ["the air temperature", "the amount of rainfall", "the hours of daylight"], hint: "Biotic limiting factors are living things, such as predators, disease and competitors." },
  { prompt: "Which abiotic factor most limits plant growth in a desert?", right: "the lack of water", wrong: ["too much shade", "deep snow", "strong ocean tides"], hint: "Plants need water. Deserts get very little rain." },
  { prompt: "What does carrying capacity mean?", right: "The largest population an ecosystem can support over time", wrong: ["The heaviest animal in the ecosystem", "The number of species that live there", "How much food one animal eats in a day"], hint: "Beyond this number, there is not enough food, water or space for everyone." },
  { prompt: "A deer population grows larger than its food supply. What is most likely to happen next?", right: "Some deer starve and the population drops", wrong: ["The food supply grows to match the deer", "The deer stop needing food", "The population keeps rising forever"], hint: "When a population passes the carrying capacity, limiting factors push it back down." },
  { prompt: "Which statement is true about the parts of an ecosystem?", right: "A change in one part can affect many other parts", wrong: ["Each part acts on its own", "Only large animals affect other parts", "The non-living parts never change"], hint: "Ecosystems are networks, so a change in one place spreads along the connections." },
  { prompt: "A disease kills many trees in a forest. What is a likely effect?", right: "Animals that depend on those trees lose food or shelter", wrong: ["Nothing else in the ecosystem changes", "Only abiotic factors are affected", "More sunlight stops reaching the forest floor"], hint: "Trees are producers and also give shelter. Losing them affects the animals that use them.", hard: true },
  { prompt: "An invasive plant crowds out native plants. Why does this change the ecosystem?", right: "Native plants lose light, space and nutrients, and the animals that eat them may be affected", wrong: ["Native plants gain more sunlight", "Invasive plants never compete with others", "The abiotic parts of the ecosystem disappear"], hint: "Invasive species compete with native ones for the same limited resources.", hard: true },
  { prompt: "Why can a small pond support fewer fish than a large lake?", right: "It has less space, food and dissolved oxygen", wrong: ["Fish need less food in ponds", "Ponds have no producers", "Pond fish are always larger"], hint: "A bigger ecosystem has more of the resources that limit a population.", hard: true },
  { prompt: "Lake water warms during a heat wave and holds less dissolved oxygen. How might this affect fish?", right: "Fish that need a lot of oxygen may struggle to survive", wrong: ["Fish breathe more easily", "Fish are not affected at all", "All fish grow faster"], hint: "Warm water holds less dissolved oxygen, an abiotic factor that fish need.", hard: true },
  { prompt: "When snowshoe hare numbers rise, lynx numbers usually…", right: "rise a little later, because there is more food", wrong: ["fall at the same time", "stay exactly the same", "rise first, then the hares rise"], hint: "Predator numbers follow prey numbers, with a delay. Records of the two populations rise and fall in linked cycles.", hard: true },
  { prompt: "Which is the best example of a limiting factor that is not about food?", right: "a shortage of nesting sites for cavity-nesting birds", wrong: ["an increase in plant growth", "a long, warm summer with plenty of rain", "more insects hatching in spring"], hint: "Space and shelter limit populations as well as food.", hard: true },
];

function ecosystems(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(BIOTIC_SORT, perBin(d)), ...levelled(ECOSYSTEM_BANK, 7, d)]);
}

// ---------- Food chains and energy ----------

const ROLE_SORT: SortSet = {
  prompt: "Producer, consumer or decomposer? Sort each organism.",
  hint: "Producers make their own food from sunlight (plants, algae). Consumers eat other living things. Decomposers break down dead matter (many fungi and bacteria).",
  bins: [
    { id: "producer", label: "producer", emoji: "🌿" },
    { id: "consumer", label: "consumer", emoji: "🐇" },
    { id: "decomposer", label: "decomposer", emoji: "🍄" },
  ],
  items: [
    { label: "grass", emoji: "🌾", bin: "producer" },
    { label: "algae in a pond", emoji: "🟢", bin: "producer" },
    { label: "a maple tree", emoji: "🍁", bin: "producer" },
    { label: "a rabbit", emoji: "🐇", bin: "consumer" },
    { label: "a hawk", emoji: "🦅", bin: "consumer" },
    { label: "a grasshopper", emoji: "🦗", bin: "consumer" },
    { label: "a mushroom on a log", emoji: "🍄", bin: "decomposer" },
    { label: "bread mould", emoji: "🍞", bin: "decomposer" },
    { label: "bacteria in a compost pile", emoji: "🦠", bin: "decomposer" },
  ],
};

const CHAIN: { id: string; label: string; emoji: string }[] = [
  { id: "grass", label: "grass", emoji: "🌾" },
  { id: "grasshopper", label: "grasshopper", emoji: "🦗" },
  { id: "frog", label: "frog", emoji: "🐸" },
  { id: "snake", label: "snake", emoji: "🐍" },
  { id: "hawk", label: "hawk", emoji: "🦅" },
];

function energyTransfer(d: 1 | 2 | 3): Question {
  const start = pick([1000, 2000, 5000, 10000, 20000, 50000]);
  const steps = d === 1 ? 1 : pick([1, 2]);
  const end = steps === 1 ? start / 10 : start / 100;
  const who = steps === 1 ? "the grasshoppers that eat the grass" : "the frogs that eat the grasshoppers";
  return typeIn(
    `Grass stores ${spaced(start)} units of energy. About 10% of the energy at each feeding level is passed on to the next. How many units reach ${who}?`,
    end,
    steps === 1 ? "10% of the energy is passed on, so divide by 10." : "Two steps: grass to grasshoppers (divide by 10), then grasshoppers to frogs (divide by 10 again).",
    undefined,
    { suffix: "units" },
  );
}

const FOODCHAIN_BANK: Item[] = [
  { prompt: "What do producers do?", right: "Make their own food using energy from the Sun", wrong: ["Eat other organisms", "Break down dead matter", "Hunt for food"], hint: "Plants and algae use sunlight to make food by photosynthesis." },
  { prompt: "What is a consumer?", right: "An organism that gets energy by eating other organisms", wrong: ["An organism that makes food from sunlight", "A non-living resource", "A rock that stores heat"], hint: "Consumers cannot make their own food, so they eat producers or other consumers." },
  { prompt: "What do decomposers do?", right: "Break down dead organisms and wastes, returning nutrients to the soil", wrong: ["Make food from sunlight", "Hunt live prey", "Store energy as fat for winter"], hint: "Fungi and bacteria recycle the nutrients from dead matter." },
  { prompt: "Which animal is a herbivore?", right: "a deer", wrong: ["a wolf", "a hawk", "a lynx"], hint: "Herbivores eat only plants. Wolves, hawks and lynx eat other animals." },
  { prompt: "A black bear eats berries, fish and insects. It is an…", right: "omnivore", wrong: ["herbivore", "carnivore", "decomposer"], hint: "Omnivores eat both plants and animals." },
  { prompt: "In a food chain, what do the arrows show?", right: "The direction that energy flows", wrong: ["Which animal is larger", "Where each organism lives", "How old each organism is"], hint: "An arrow points from the organism that is eaten to the one that eats it." },
  { prompt: "Where does the energy in most food chains first come from?", right: "the Sun", wrong: ["the soil", "decomposers", "the wind"], hint: "Producers capture the Sun's energy, and consumers get it by eating." },
  { prompt: "A grasshopper eats grass. A frog eats the grasshopper. The frog is a…", right: "secondary consumer", wrong: ["primary consumer", "producer", "decomposer"], hint: "A primary consumer eats producers. A secondary consumer eats primary consumers." },
  { prompt: "Mushrooms growing on a fallen log are…", right: "decomposers", wrong: ["producers", "primary consumers", "herbivores"], hint: "They break down the dead wood and release nutrients." },
  { prompt: "What is a food web?", right: "Many food chains linked together", wrong: ["A food chain with only one organism", "A list of producers", "A spider's web full of insects"], hint: "Most organisms eat more than one thing and are eaten by more than one thing." },
  { prompt: "What does an energy pyramid show?", right: "How much energy is available at each feeding level", wrong: ["How tall each organism grows", "How many species live in a place", "Where mountains are found"], hint: "The bottom (producers) is widest because it holds the most energy." },
  { prompt: "Only about 10% of the energy passes to the next feeding level. What happens to the rest?", right: "Most is used for life processes or lost as heat", wrong: ["It is stored for the next level to use later", "It turns into producers", "It disappears for no reason"], hint: "Organisms use energy to move, grow and stay warm, and much leaves as heat." },
  { prompt: "Frogs eat insects, and snakes eat frogs. A chemical spray kills most of the insects. What may happen to the frogs?", right: "Frog numbers may drop because they have less food", wrong: ["Frog numbers will definitely rise", "Snakes will become producers", "Nothing in the food chain will change"], hint: "Removing the food of one level can affect the levels above it." },
  { prompt: "Why is a food web often more stable than a single food chain?", right: "Consumers can switch to another food source if one declines", wrong: ["Each animal eats only one thing", "It has no producers to run out", "It has no top predators"], hint: "More links mean more backup options.", hard: true },
  { prompt: "Sea otters eat sea urchins, and urchins eat kelp. What can happen if the otters are removed from a coast?", right: "Urchins increase and the kelp forest can shrink", wrong: ["Kelp grows faster and covers the coast", "Urchins disappear", "The otters become producers"], hint: "Without a predator, urchin numbers rise and they eat more kelp.", hard: true },
  { prompt: "Why are there usually fewer top predators than plants in an ecosystem?", right: "Energy is lost at each step, so less is available higher up", wrong: ["Top predators eat only once a year", "Plants are always larger", "Predators are born less often by choice"], hint: "With about 10% passing on each time, the top level has very little energy to share.", hard: true },
  { prompt: "In a food chain, which organism has the smallest amount of available energy?", right: "the top consumer", wrong: ["the producer", "the primary consumer", "the Sun"], hint: "Energy shrinks at every step, so the last level has the least.", hard: true },
  { prompt: "How do decomposers help producers?", right: "They return nutrients from dead matter to the soil for plants to use", wrong: ["They provide sunlight", "They make water for plants", "They hunt animals that eat plants"], hint: "Plants take up nutrients that decomposers release.", hard: true },
  { prompt: "Fewer wolves live in an area. What might happen to the deer, and then to the plants they eat?", right: "Deer may increase, and the plants may be eaten more", wrong: ["Deer decrease, and the plants grow more", "Nothing changes in either group", "The plants stop needing sunlight"], hint: "With fewer predators, prey numbers can rise and eat more of their food.", hard: true },
];

function foodChains(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([
    sortQuestion(ROLE_SORT, 2),
    orderQuestion("Put this food chain in order, from the organism that makes food to the last to eat.", "Energy flows from the producer (grass) to the grasshopper, frog, snake and then hawk.", CHAIN, d),
    energyTransfer(d),
    ...levelled(FOODCHAIN_BANK, 5, d),
  ]);
}

// ---------- Cycles and succession ----------

const SUCCESSION_SORT: SortSet = {
  prompt: "Primary or secondary succession? Sort each situation.",
  hint: "Primary succession starts on bare rock or new land with no soil. Secondary succession starts where soil and seeds are still there, such as after a fire or when a field is left alone.",
  bins: [
    { id: "primary", label: "primary succession", emoji: "🪨" },
    { id: "secondary", label: "secondary succession", emoji: "🌱" },
  ],
  items: [
    { label: "a new island formed by a volcano", emoji: "🌋", bin: "primary" },
    { label: "bare rock exposed by a melting glacier", emoji: "🧊", bin: "primary" },
    { label: "cooled lava with no soil", emoji: "🪨", bin: "primary" },
    { label: "a new sand dune", emoji: "🏖️", bin: "primary" },
    { label: "a forest regrowing after a wildfire", emoji: "🔥", bin: "secondary" },
    { label: "an abandoned farm field", emoji: "🌾", bin: "secondary" },
    { label: "a logged forest left to regrow", emoji: "🪵", bin: "secondary" },
    { label: "woodland growing back after a storm", emoji: "🌪️", bin: "secondary" },
  ],
};

const WATER_CYCLE = [
  { id: "evap", label: "Water evaporates from lakes and oceans", emoji: "♨️" },
  { id: "cond", label: "Water vapour cools and condenses into clouds", emoji: "☁️" },
  { id: "precip", label: "Rain or snow falls", emoji: "🌧️" },
  { id: "collect", label: "Water runs off or soaks in and collects in lakes and oceans", emoji: "🌊" },
];

const SUCCESSION_STEPS = [
  { id: "rock", label: "Bare rock", emoji: "🪨" },
  { id: "lichen", label: "Lichens and mosses grow", emoji: "🌿" },
  { id: "grass", label: "Soil builds up and grasses grow", emoji: "🌾" },
  { id: "shrubs", label: "Shrubs and small trees take over", emoji: "🌱" },
  { id: "forest", label: "A mature forest develops", emoji: "🌲" },
];

const CYCLE_BANK: Item[] = [
  { prompt: "Why do we say matter is cycled in an ecosystem?", right: "The same atoms are used again and again", wrong: ["New matter is created by producers", "Matter leaves Earth in food", "Decomposers destroy matter"], hint: "Matter is not created or destroyed. It moves between living things and the environment." },
  { prompt: "Which process takes carbon dioxide out of the air?", right: "photosynthesis", wrong: ["respiration", "evaporation", "condensation"], hint: "Plants take in carbon dioxide and use it to make sugars." },
  { prompt: "Which process puts carbon dioxide into the air?", right: "respiration by living things", wrong: ["photosynthesis", "evaporation", "condensation"], hint: "Plants and animals release carbon dioxide when they use food for energy. Burning fuels does too." },
  { prompt: "Water vapour cools and turns into tiny droplets in clouds. This is called…", right: "condensation", wrong: ["evaporation", "precipitation", "runoff"], hint: "A gas turning into a liquid is condensation." },
  { prompt: "Plants release water vapour through their leaves. This process is called…", right: "transpiration", wrong: ["precipitation", "condensation", "runoff"], hint: "Trans means across or through. Water moves up the plant and out of the leaves." },
  { prompt: "How do decomposers help cycle matter?", right: "They break down dead matter and return nutrients to the soil", wrong: ["They make new nutrients from nothing", "They remove nutrients from the ecosystem for good", "They turn nutrients into energy"], hint: "Fungi and bacteria release nutrients so plants can use them again." },
  { prompt: "Primary succession begins with…", right: "bare rock or new land with no soil", wrong: ["a mature forest", "soil full of seeds", "a recently burned forest floor"], hint: "Primary means first. No soil has formed yet." },
  { prompt: "Which are usually the first living things to grow on bare rock?", right: "lichens", wrong: ["oak trees", "deer", "tall shrubs"], hint: "Lichens and mosses are pioneer species that can live where there is almost no soil." },
  { prompt: "How do pioneer species such as lichens help build soil?", right: "They slowly break down rock, and when they die they add organic matter", wrong: ["They turn rock into water", "They carry soil in from far away", "They stop other plants from growing"], hint: "Rock bits plus dead plant matter make the first thin soil." },
  { prompt: "A farm field is no longer mowed. After a few years it is covered with tall grass and young shrubs. This is…", right: "secondary succession", wrong: ["primary succession", "a nutrient cycle", "an energy pyramid"], hint: "The soil and seeds were already there, so the change is secondary succession." },
  { prompt: "Why is secondary succession usually faster than primary succession?", right: "Soil, roots and seeds are already present", wrong: ["Fewer plants are needed", "There is more bare rock", "Animals plant all the seeds first"], hint: "Primary succession must build soil from rock first." },
  { prompt: "Why do pioneer species usually come first?", right: "They can survive harsh conditions with little soil and few nutrients", wrong: ["They are the largest plants", "They need rich soil", "Animals plant them on purpose"], hint: "Tough, small species are able to start where others cannot." },
  { prompt: "Which would take longer to turn into a forest?", right: "a bare rock surface", wrong: ["an abandoned farm field", "a burned forest with soil left behind"], hint: "Soil has to be built on rock. In the other two, soil is already there." },
  { prompt: "Which statement about succession is true?", right: "Communities change over time in a fairly predictable pattern", wrong: ["It happens only in water", "It never happens after fires", "It always ends in a desert"], hint: "Simple, fast-growing species come first and are later replaced by larger, longer-lived ones." },
  { prompt: "Why does cycling matter help keep an ecosystem sustainable?", right: "Nutrients are reused, so the supply does not run out", wrong: ["New nutrients fall from space each day", "Producers create extra matter as they grow", "Cycling removes all waste from Earth"], hint: "Atoms of carbon, nitrogen and water are used again and again.", hard: true },
  { prompt: "Some soil bacteria change nitrogen from the air into a form plants can use. Why does this matter?", right: "Plants need nitrogen to grow, and animals get it by eating plants", wrong: ["Nitrogen is the gas plants breathe out", "Bacteria make sunlight for plants", "Animals can use nitrogen straight from the air"], hint: "Nitrogen is cycled between air, soil, plants and animals.", hard: true },
  { prompt: "Burning coal and oil mainly moves carbon from…", right: "underground deposits into the atmosphere", wrong: ["the atmosphere into the ocean floor", "plants into the soil", "the Sun into the Earth"], hint: "Fossil fuels hold carbon from ancient living things. Burning releases it as carbon dioxide.", hard: true },
  { prompt: "A wildfire burns a forest. The next spring, fireweed is already growing. Why so soon?", right: "Roots, seeds and soil survived the fire", wrong: ["The fire created new soil from rock", "Fireweed seeds fall from clouds", "Succession cannot happen after a fire"], hint: "This is secondary succession, which starts with soil and seeds already in place.", hard: true },
  { prompt: "A farmer plants a different crop in a field each year. How can this keep the soil healthy?", right: "Different crops use and return different nutrients", wrong: ["It adds new matter to Earth", "It stops the water cycle", "It removes all decomposers"], hint: "Crop rotation helps keep nutrients in balance.", hard: true },
];

function cycles(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const order = pick([
    () => orderQuestion("Put the steps of the water cycle in order.", "Water evaporates, condenses into clouds, falls as precipitation and then collects, ready to evaporate again.", WATER_CYCLE, d),
    () => orderQuestion("Put the stages of primary succession in order.", "Bare rock, then lichens and mosses, then soil and grasses, then shrubs, then forest.", SUCCESSION_STEPS, d),
  ])();
  return shuffle([sortQuestion(SUCCESSION_SORT, perBin(d)), order, ...levelled(CYCLE_BANK, 6, d)]);
}

// ---------- Human impact on ecosystems ----------

const BALANCE_SORT: SortSet = {
  prompt: "Does it harm an ecosystem's balance or help restore it? Sort each action.",
  hint: "Draining wetlands, overfishing and clearing forests without replanting can harm balance. Restoring habitats, setting limits and rotating crops can help.",
  bins: [
    { id: "harm", label: "can harm balance", emoji: "⚠️" },
    { id: "help", label: "helps restore balance", emoji: "🌱" },
  ],
  items: [
    { label: "draining a wetland for a parking lot", emoji: "🅿️", bin: "harm" },
    { label: "catching fish faster than they can reproduce", emoji: "🎣", bin: "harm" },
    { label: "clear-cutting a slope and not replanting", emoji: "🪓", bin: "harm" },
    { label: "growing one crop on the same field every year", emoji: "🌽", bin: "harm" },
    { label: "letting fertilizer wash into a lake", emoji: "🧪", bin: "harm" },
    { label: "restoring a wetland", emoji: "🦆", bin: "help" },
    { label: "setting a limit on how many fish can be caught", emoji: "📏", bin: "help" },
    { label: "planting native trees along a stream", emoji: "🌳", bin: "help" },
    { label: "rotating crops from year to year", emoji: "🔄", bin: "help" },
    { label: "building wildlife crossings over a highway", emoji: "🌉", bin: "help" },
  ],
};

const IMPACT_BANK: Item[] = [
  { prompt: "What is monoculture?", right: "Growing a single crop over a large area", wrong: ["Raising many animals in a barn", "Planting a mix of native flowers", "Fishing for one species only"], hint: "Mono means one." },
  { prompt: "Why can monoculture make crops risky?", right: "One pest or disease can spread quickly through the whole field", wrong: ["Crops need less sunlight", "It adds many new species to the soil", "It makes the soil richer every year"], hint: "When every plant is the same, they are all open to the same threats." },
  { prompt: "Overfishing happens when…", right: "fish are caught faster than they can reproduce", wrong: ["fish are caught only in winter", "fish are returned to the water", "too many fish are born at once"], hint: "If the catch is bigger than the new fish being born, the population falls." },
  { prompt: "A fishing quota is…", right: "a limit on how many fish can be caught", wrong: ["a fee paid by fish", "a type of net", "a way of counting boats"], hint: "Limits give fish populations time to recover." },
  { prompt: "Fertilizer from fields washes into a lake. What can happen?", right: "Algae grow too much, then use up oxygen as they die and decay", wrong: ["The lake gets clearer and cooler", "Fish gain extra oxygen", "Decomposers disappear from the lake"], hint: "Extra nutrients cause an algae bloom. Decomposing algae use up the oxygen that fish need." },
  { prompt: "How do wildlife crossings (bridges or tunnels) help animals?", right: "They let animals cross a road safely", wrong: ["They make roads wider", "They keep animals out of forests", "They give drivers more speed"], hint: "Roads cut habitats in two. Crossings reconnect them and reduce collisions." },
  { prompt: "Zebra mussels reached the Great Lakes in the 1980s, often carried in ships' ballast water. What kind of species are they?", right: "invasive", wrong: ["native", "endangered", "extinct"], hint: "An invasive species arrives from somewhere else and spreads quickly, harming native species." },
  { prompt: "Boaters wash their boats before moving to a new lake. Why?", right: "To stop invasive species from spreading", wrong: ["To make the lake warmer", "To feed the fish", "To remove the lake's native plants"], hint: "Tiny plants, eggs and mussels can ride on boats." },
  { prompt: "A farmer plants cover crops and leaves old plant stalks on the field in fall. This helps because…", right: "roots and plant cover hold soil in place", wrong: ["bare soil dries out faster", "it makes the wind stronger", "it removes nutrients from the soil"], hint: "Bare soil blows or washes away. Plant cover protects it." },
  { prompt: "A farmer plants flowers at the edge of a field to attract insects that eat crop pests. This is…", right: "using natural predators to protect crops", wrong: ["planting a monoculture", "draining a wetland", "overgrazing"], hint: "Helpful insects reduce the need for chemical sprays." },
  { prompt: "Restoring a wetland can help an ecosystem because wetlands…", right: "filter water and provide habitat for birds, frogs and insects", wrong: ["always increase flooding", "cannot support any wildlife", "use up all the water in a region"], hint: "Wetland plants trap sediment and many species depend on them." },
  { prompt: "Selective logging removes only some trees, while clear-cutting removes them all. Which does less damage to habitat and soil?", right: "selective logging", wrong: ["clear-cutting", "They do exactly the same damage", "Neither one affects soil"], hint: "Leaving trees standing keeps shade, roots and shelter for wildlife." },
  { prompt: "A fish ladder helps migrating fish. How?", right: "It lets them get past a dam", wrong: ["It catches them for food", "It keeps them out of rivers", "It warms the water"], hint: "Dams block rivers. A ladder is a series of small steps that fish can swim up." },
  { prompt: "How can a town best tell whether a pollution-control program is working?", right: "Compare measurements of the ecosystem before and after the program", wrong: ["Count how many posters were printed", "Ask only the people who started it", "Check how much money it cost"], hint: "Evidence about the ecosystem shows the effect, not the effort.", hard: true },
  { prompt: "Why is harvesting wild plants from a forest sustainably important?", right: "Leaving enough plants lets the population regrow", wrong: ["Taking every plant helps the others", "Plants only grow back if all are removed", "Wild plants do not affect other species"], hint: "Taking only part of a stand leaves seeds and roots to renew it.", hard: true },
  { prompt: "Drip irrigation delivers water slowly to plant roots. What is one environmental benefit?", right: "It uses less water than spraying a whole field", wrong: ["It adds more fertilizer to rivers", "It removes soil from fields", "It dries out the groundwater faster"], hint: "Less water is lost to evaporation and runoff.", hard: true },
  { prompt: "A bigger harvest of fish this year means the fishery is healthy and no limit is needed. What is wrong with this thinking?", right: "A big catch can mean heavy fishing pressure, and stocks can still fall later", wrong: ["Nothing is wrong with it", "Fish never run out", "Big catches always mean more fish were born"], hint: "Sustainability depends on how many fish remain and reproduce, not only on this year's catch.", hard: true },
];

const PHOSPHORUS_TABLE: Visual = {
  type: "table",
  title: "Phosphorus in a lake (mg/L). A limit on phosphorus in detergents began in 2002.",
  headers: ["Year", "Phosphorus"],
  rows: [
    ["2001", "0.09"],
    ["2006", "0.06"],
    ["2011", "0.04"],
    ["2016", "0.03"],
  ],
};

function phosphorus(): Question {
  return textChoice(
    "What does the data suggest?",
    "Phosphorus has fallen since the limit began, so the limit may be helping",
    ["Phosphorus has risen since the limit began", "Phosphorus has not changed", "The data prove that nothing else could be involved"],
    "Compare 2001, before the limit, with the later years. Data can suggest a link, but other causes should be ruled out before saying for sure.",
    PHOSPHORUS_TABLE,
  );
}

function humanImpact(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(BALANCE_SORT, perBin(d)), ...(d === 1 ? [] : [phosphorus()]), ...levelled(IMPACT_BANK, d === 1 ? 7 : 6, d)]);
}

// ---------- Particle theory, pure substances and mixtures ----------

const PURE_SORT: SortSet = {
  prompt: "Pure substance or mixture? Sort each one.",
  hint: "A pure substance is one kind of matter (an element like gold, or a compound like water). A mixture is two or more substances physically combined.",
  bins: [
    { id: "pure", label: "pure substance", emoji: "💎" },
    { id: "mixture", label: "mixture", emoji: "🥣" },
  ],
  items: [
    { label: "distilled water", emoji: "💧", bin: "pure" },
    { label: "a gold bar", emoji: "🟡", bin: "pure" },
    { label: "oxygen gas", emoji: "💨", bin: "pure" },
    { label: "pure table salt", emoji: "🧂", bin: "pure" },
    { label: "a copper wire", emoji: "🟠", bin: "pure" },
    { label: "air", emoji: "🌬️", bin: "mixture" },
    { label: "salt water", emoji: "🌊", bin: "mixture" },
    { label: "garden soil", emoji: "🪴", bin: "mixture" },
    { label: "vegetable soup", emoji: "🍲", bin: "mixture" },
    { label: "trail mix", emoji: "🥜", bin: "mixture" },
  ],
};

const HOMO_SORT: SortSet = {
  prompt: "Homogeneous or heterogeneous? Sort each mixture.",
  hint: "In a homogeneous mixture the parts are evenly mixed and look like one substance. In a heterogeneous mixture you can see different parts.",
  bins: [
    { id: "homo", label: "homogeneous (looks the same throughout)", emoji: "🥛" },
    { id: "hetero", label: "heterogeneous (different parts show)", emoji: "🍕" },
  ],
  items: [
    { label: "salt dissolved in water", emoji: "🧂", bin: "homo" },
    { label: "clear apple juice", emoji: "🍎", bin: "homo" },
    { label: "vinegar", emoji: "🫙", bin: "homo" },
    { label: "air in a clean room", emoji: "🌬️", bin: "homo" },
    { label: "tea with no leaves in it", emoji: "🍵", bin: "homo" },
    { label: "a salad", emoji: "🥗", bin: "hetero" },
    { label: "a pizza", emoji: "🍕", bin: "hetero" },
    { label: "cereal in milk", emoji: "🥣", bin: "hetero" },
    { label: "muddy water", emoji: "🟤", bin: "hetero" },
    { label: "iron filings mixed with sand", emoji: "🏖️", bin: "hetero" },
  ],
};

const PARTICLE_BANK: Item[] = [
  { prompt: "According to the particle theory, all matter is made of…", right: "tiny particles", wrong: ["smooth material with no gaps", "only atoms of metal", "heat and light"], hint: "Everything is made of very small particles too small to see." },
  { prompt: "In the particle theory, the particles of matter are…", right: "always moving", wrong: ["still when matter is cold", "moving only in gases", "moving only when you look at them"], hint: "Particles move all the time. They move more slowly when it is colder and faster when it is warmer." },
  { prompt: "In which state of matter are the particles farthest apart?", right: "gas", wrong: ["solid", "liquid"], hint: "Gas particles move freely with large spaces between them." },
  { prompt: "Which state of matter has particles that vibrate in fixed positions?", right: "solid", wrong: ["liquid", "gas"], hint: "Solid particles are held close together and can only jiggle in place." },
  { prompt: "Why can a liquid flow?", right: "Its particles can slide past one another", wrong: ["Its particles are locked in place", "Its particles have no forces between them", "Its particles are very far apart"], hint: "Liquid particles stay close but are not fixed in position." },
  { prompt: "Why can a gas be squeezed into a smaller space more easily than a liquid?", right: "There are large spaces between gas particles", wrong: ["Gas particles are very small", "Gas particles are not moving", "Gas particles cannot touch"], hint: "Particles in a liquid are already close together." },
  { prompt: "A drop of food colouring spreads through still water. Why?", right: "The particles of both substances are moving and mixing", wrong: ["Water particles stop moving", "The colouring turns into water", "Gravity pulls the colour sideways"], hint: "Moving particles slowly spread out evenly." },
  { prompt: "Which state of matter has the strongest attraction between its particles?", right: "solid", wrong: ["liquid", "gas"], hint: "Strong attractions hold solid particles in place." },
  { prompt: "What is a pure substance?", right: "Matter made of only one kind of particle", wrong: ["Any clear liquid", "Any substance that is safe to drink", "A mixture of two clean liquids"], hint: "Gold and water are pure substances because each has one kind of particle." },
  { prompt: "What is a mixture?", right: "Two or more substances physically combined, each keeping its own properties", wrong: ["A new substance with new properties", "Matter with only one kind of particle", "A gas that cannot be seen"], hint: "In trail mix, the nuts and raisins are still nuts and raisins." },
  { prompt: "Which of these is a pure substance?", right: "distilled water", wrong: ["salt water", "orange juice with pulp", "air"], hint: "Distilled water has been purified to leave only water particles." },
  { prompt: "Which of these is a mixture?", right: "air", wrong: ["oxygen", "gold", "distilled water"], hint: "Air is mostly nitrogen and oxygen, with small amounts of other gases." },
  { prompt: "A diagram shows only one kind of particle, all identical. This is probably…", right: "a pure substance", wrong: ["a mixture", "a heterogeneous mixture", "a solution"], hint: "One kind of particle means one pure substance." },
  { prompt: "A diagram shows two different kinds of particles mixed together but not joined. This is…", right: "a mixture", wrong: ["a pure substance", "an element", "a single atom"], hint: "Two or more kinds of particles mixed together make a mixture." },
  { prompt: "Which would be a homogeneous mixture?", right: "sugar dissolved in water", wrong: ["sand and water", "a salad", "gravel"], hint: "Dissolved sugar is evenly mixed and cannot be seen as separate parts." },
  { prompt: "Why is a pizza a heterogeneous mixture?", right: "You can see different parts in it", wrong: ["It is made of one kind of particle", "It cannot be separated", "It is always cooked"], hint: "Heterogeneous means made of different, visible parts." },
  { prompt: "A bottle of perfume is opened at one end of a room, and soon people at the other end can smell it. Why?", right: "Gas particles move randomly and spread out", wrong: ["The gas gets pushed by gravity", "Smell particles are heavier than air", "The perfume turns into a solid"], hint: "Particles of a gas move in every direction until they are spread throughout the room." },
  { prompt: "Brass is copper and zinc mixed evenly throughout a solid. It is a…", right: "homogeneous mixture", wrong: ["pure substance because it is a solid metal", "heterogeneous mixture", "gas"], hint: "Brass is an alloy: a mixture that looks the same throughout.", hard: true },
  { prompt: "Water as ice, as liquid water and as water vapour has the same kind of particle. What differs in each state?", right: "How the particles are arranged and how they move", wrong: ["The kind of particle", "The number of different substances", "Whether the water is pure"], hint: "Changing state changes the arrangement and motion, not the kind of particle.", hard: true },
  { prompt: "Cooking oil and water do not stay mixed. Both are pure, but together they form…", right: "a heterogeneous mixture", wrong: ["a homogeneous mixture", "a new pure substance", "a single element"], hint: "Oil floats in a separate layer, so different parts are visible.", hard: true },
  { prompt: "Which of these is NOT part of the particle theory of matter?", right: "Particles can be created from nothing when matter is heated", wrong: ["All matter is made of particles", "Particles are always moving", "There are spaces between particles"], hint: "Heating changes motion, not the number of particles.", hard: true },
];

function particles(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(PURE_SORT, perBin(d)), sortQuestion(HOMO_SORT, 3), ...levelled(PARTICLE_BANK, 6, d)]);
}

// ---------- Solutions and separating mixtures ----------

const SEPARATE_SORT: SortSet = {
  prompt: "Which method best separates each mixture?",
  hint: "Filter a solid out of a liquid it has not dissolved in. Evaporate the water to get back a dissolved solid. Use a magnet to pull out iron or steel.",
  bins: [
    { id: "filter", label: "filter", emoji: "☕" },
    { id: "evaporate", label: "evaporate", emoji: "♨️" },
    { id: "magnet", label: "magnet", emoji: "🧲" },
  ],
  items: [
    { label: "coffee grounds in water", emoji: "☕", bin: "filter" },
    { label: "tea leaves in water", emoji: "🍵", bin: "filter" },
    { label: "salt dissolved in water (to collect the salt)", emoji: "🧂", bin: "evaporate" },
    { label: "sea water (to collect sea salt)", emoji: "🌊", bin: "evaporate" },
    { label: "iron filings mixed with sand", emoji: "🏖️", bin: "magnet" },
    { label: "iron nails mixed with plastic beads", emoji: "🔩", bin: "magnet" },
  ],
};

function concentration(d: 1 | 2 | 3): Question {
  const per100 = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]);
  const mult = d === 1 ? 2 : pick(d === 2 ? [2, 3, 4] : [2, 3, 4, 5]);
  return typeIn(
    `A ${100 * mult} mL sample of a sugar solution contains ${per100 * mult} g of sugar. How many grams of sugar are in each 100 mL?`,
    per100,
    `Divide the mass by the number of 100 mL portions: ${per100 * mult} ÷ ${mult}.`,
    undefined,
    { suffix: "g" },
  );
}

function saturation(d: 1 | 2 | 3): Question {
  const sol = pick([20, 36, 50, 60, 80]);
  const over = d === 1 ? false : pick([true, false]);
  const below = sol - pick([5, 10]);
  const above = sol + pick([10, 15, 20]);
  const added = over ? above : below;
  const note = "At 20 °C, at most " + sol + " g of Substance X dissolves in 100 mL of water.";
  if (d >= 2 && over && pick([true, false])) {
    return typeIn(`${note} You stir ${added} g of Substance X into 100 mL of water at 20 °C. How many grams stay undissolved?`, added - sol, `Only ${sol} g can dissolve. ${added} − ${sol} stays at the bottom.`, undefined, { suffix: "g" });
  }
  const unsat = "an unsaturated solution";
  const satExtra = "a saturated solution with solid left at the bottom";
  const satNone = "a saturated solution with nothing left undissolved";
  return textChoice(
    `${note} You stir ${added} g of Substance X into 100 mL of water at 20 °C. What do you get?`,
    over ? satExtra : unsat,
    over ? [unsat, satNone] : [satExtra, satNone],
    over ? `${added} g is more than the ${sol} g that can dissolve, so the water is saturated and the extra solid stays at the bottom.` : `${added} g is less than the ${sol} g limit, so more could still dissolve: the solution is unsaturated.`,
  );
}

const SOLUTION_BANK: Item[] = [
  { prompt: "In salt water, which part is the solute?", right: "the salt", wrong: ["the water", "both the salt and the water", "neither of them"], hint: "The solute is what dissolves. The solvent, water here, does the dissolving." },
  { prompt: "What is a solvent?", right: "The substance that does the dissolving in a solution", wrong: ["The substance that gets dissolved", "A solid that stays at the bottom", "A mixture you can filter"], hint: "Water is the solvent when sugar dissolves in it." },
  { prompt: "What does solubility mean?", right: "How much of a substance can dissolve in a given amount of solvent", wrong: ["How fast a substance melts", "How much a substance weighs", "How hot a substance gets"], hint: "A substance with high solubility dissolves in large amounts." },
  { prompt: "Which change makes sugar dissolve faster in water?", right: "stirring", wrong: ["using one big sugar cube instead of grains", "using colder water", "not stirring"], hint: "Stirring, smaller pieces and warmer water all speed up dissolving." },
  { prompt: "Why does sugar dissolve faster in hot water than in cold water?", right: "The particles move faster and hit the sugar more often", wrong: ["Heat makes the sugar lighter", "Hot water has more kinds of particles", "Heat destroys the sugar particles"], hint: "Faster-moving water particles pull sugar particles away from the crystal sooner." },
  { prompt: "Which will NOT dissolve in water?", right: "cooking oil", wrong: ["salt", "sugar", "food colouring"], hint: "Oil floats in a separate layer instead of mixing." },
  { prompt: "What does saturated mean?", right: "No more solute can dissolve at that temperature", wrong: ["The solution is very cold", "There is no solute in the water", "The solvent has been removed"], hint: "A saturated solution is full." },
  { prompt: "A drink mix is made with a little water. Another uses the same mix with more water. Which is more concentrated?", right: "the one with less water", wrong: ["the one with more water", "They are equally concentrated", "Neither has any solute"], hint: "More solute in the same amount of liquid means a higher concentration." },
  { prompt: "Why is water called the universal solvent?", right: "It dissolves many substances, more than most other liquids", wrong: ["It dissolves every substance", "It is the only liquid on Earth", "It never changes state"], hint: "It is not able to dissolve everything (oil, for example) but it dissolves a very wide range." },
  { prompt: "Why does water being a good solvent matter for living things?", right: "It carries nutrients and wastes in blood and cells", wrong: ["It keeps cells from needing food", "It turns food into sunlight", "It stops all chemical reactions"], hint: "Nutrients dissolve in water and are carried around the body." },
  { prompt: "Water dissolves many pollutants. Why does this make water pollution a challenge?", right: "Dissolved pollutants spread easily and are hard to see or remove", wrong: ["Pollutants always sink to the bottom", "Pollutants cannot enter water", "Water destroys all pollutants"], hint: "A dissolved substance is mixed through the whole liquid." },
  { prompt: "Which method separates an undissolved solid from a liquid?", right: "filtration", wrong: ["distillation", "chromatography", "using a magnet"], hint: "A filter lets liquid pass and catches the solid." },
  { prompt: "Which method separates dissolved salt from salt water and also collects the pure water?", right: "distillation", wrong: ["filtration", "using a magnet", "sieving"], hint: "The water is boiled off, then cooled and condensed. The salt stays behind." },
  { prompt: "What does evaporating salt water leave behind?", right: "the salt", wrong: ["only water", "sand", "sugar"], hint: "Water leaves as vapour. Salt does not evaporate." },
  { prompt: "What does chromatography do?", right: "It separates dissolved substances, such as the dyes in ink, as they travel at different speeds", wrong: ["It changes a liquid into a solid", "It removes magnetic metals", "It makes mixtures more concentrated"], hint: "A solvent carries the parts along paper, and each part travels a different distance." },
  { prompt: "A sieve separates a mixture by…", right: "the size of the pieces", wrong: ["the colour of the pieces", "the temperature of the pieces", "whether the pieces dissolve"], hint: "Smaller pieces pass through the holes, larger ones are caught." },
  { prompt: "A scientist spins a tube of a mixture quickly in a centrifuge. What happens?", right: "The heavier parts move to the bottom", wrong: ["The parts dissolve", "The mixture turns into one substance", "All the liquid evaporates"], hint: "Spinning pushes heavier parts outward and down faster than lighter ones." },
  { prompt: "How can you make a saturated solution of a solid in water able to dissolve more of the solid?", right: "Warm the water", wrong: ["Cool the water", "Add more of the same solid", "Stop stirring"], hint: "For most solids, solubility rises with temperature.", hard: true },
  { prompt: "Warm cola loses its fizz faster than cold cola. What does this suggest about gases in liquids?", right: "Gases are less soluble in warmer liquids", wrong: ["Gases are more soluble in warmer liquids", "Gases cannot dissolve in liquids", "Temperature has no effect on gases"], hint: "The warmer liquid holds less dissolved carbon dioxide, so bubbles escape.", hard: true },
  { prompt: "Oil is heated and separated into gasoline, diesel and other products in a tall tower. What is this process?", right: "fractional distillation, because the parts boil at different temperatures", wrong: ["filtration, because the parts have different sizes", "magnetic separation", "evaporation of a dissolved salt"], hint: "Each part of the oil turns to vapour and condenses at a different temperature.", hard: true },
  { prompt: "Mining leaves 'tailings', waste rock and water kept in ponds after the valuable minerals are separated. Why must tailings ponds be monitored?", right: "They can leak harmful substances into water and soil", wrong: ["They make the ground magnetic", "They remove all pollutants from water", "They turn into fuel"], hint: "Chemicals used to separate minerals can stay in the waste.", hard: true },
  { prompt: "Desalination plants turn sea water into fresh water. What is one environmental concern?", right: "The very salty leftover water must be handled carefully so it does not harm sea life", wrong: ["They make the ocean fresher everywhere", "They create no waste at all", "They remove all salt from every ocean"], hint: "The waste stream, called brine, is much saltier than sea water.", hard: true },
  { prompt: "A sand filter at a water treatment plant mainly removes…", right: "small undissolved particles", wrong: ["dissolved salt", "all dissolved gases", "all colours from the water"], hint: "Filtering catches undissolved particles. Dissolved substances pass through.", hard: true },
];

function solutions(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(SEPARATE_SORT, 2), concentration(d), saturation(d), ...levelled(SOLUTION_BANK, 5, d)]);
}

// ---------- Structures and forces ----------

const STRUCTURE_SORT: SortSet = {
  prompt: "Solid, frame or shell structure? Sort each one.",
  hint: "A solid structure is mostly filled with material. A frame structure is made of connected parts (beams and columns) with space between. A shell structure holds its shape with a thin outer layer.",
  bins: [
    { id: "solid", label: "solid", emoji: "🧱" },
    { id: "frame", label: "frame", emoji: "🏗️" },
    { id: "shell", label: "shell", emoji: "🥚" },
  ],
  items: [
    { label: "a concrete gravity dam", emoji: "🧱", bin: "solid" },
    { label: "a brick", emoji: "🧱", bin: "solid" },
    { label: "a stone pyramid", emoji: "🔺", bin: "solid" },
    { label: "a bridge truss", emoji: "🌉", bin: "frame" },
    { label: "a bicycle frame", emoji: "🚲", bin: "frame" },
    { label: "a radio tower", emoji: "📡", bin: "frame" },
    { label: "an egg", emoji: "🥚", bin: "shell" },
    { label: "a bicycle helmet", emoji: "⛑️", bin: "shell" },
    { label: "a tin can", emoji: "🥫", bin: "shell" },
  ],
};

const SYMMETRY: { shape: string; lines: number }[] = [
  { shape: "square", lines: 4 },
  { shape: "rectangle that is not a square", lines: 2 },
  { shape: "equilateral triangle", lines: 3 },
  { shape: "regular hexagon", lines: 6 },
  { shape: "regular pentagon", lines: 5 },
  { shape: "isosceles triangle that is not equilateral", lines: 1 },
];

function symmetryLines(): Question {
  const s = pick(SYMMETRY);
  const wrong = sample(
    [1, 2, 3, 4, 5, 6, 8].filter((n) => n !== s.lines),
    2,
  );
  return textChoice(
    `How many lines of symmetry does a ${s.shape} have?`,
    String(s.lines),
    wrong.map(String),
    "A line of symmetry splits a shape into two halves that mirror each other. Fold it in your mind and see where the halves match.",
  );
}

const FORCES_BANK: Item[] = [
  { prompt: "What is the centre of gravity of an object?", right: "The point where its weight seems to be concentrated", wrong: ["The point where it is warmest", "Its heaviest outer edge", "The place where it touches the ground"], hint: "You can balance an object on its centre of gravity." },
  { prompt: "Which change makes a structure more stable?", right: "Lowering its centre of gravity", wrong: ["Raising its centre of gravity", "Making its base narrower", "Moving its centre of gravity outside its base"], hint: "Low and wide structures resist tipping." },
  { prompt: "A tall, narrow bookshelf tips over when it is loaded on top. What changed?", right: "Its centre of gravity became higher and moved outside its base when tilted", wrong: ["Its base became wider", "Gravity became stronger", "It lost all its weight"], hint: "A structure tips when its centre of gravity moves past the edge of its base." },
  { prompt: "Why are race cars built low and wide?", right: "A low centre of gravity and a wide base resist tipping in turns", wrong: ["It makes them heavier", "It lets them carry more luggage", "It makes the engine quieter"], hint: "Stable shapes are low and wide." },
  { prompt: "A truck driver loads heavy crates on the bottom and light ones on top. Why?", right: "It keeps the centre of gravity low", wrong: ["It makes the load look neat", "It lets the load roll more easily", "It makes the truck lighter"], hint: "Heavy things near the ground lower the centre of gravity." },
  { prompt: "A rope in a tug-of-war is being…", right: "stretched (under tension)", wrong: ["squeezed (under compression)", "twisted (under torsion)", "slid sideways (under shear)"], hint: "Tension is a pulling force that stretches." },
  { prompt: "A column holding up a roof is being…", right: "squeezed (under compression)", wrong: ["stretched (under tension)", "twisted (under torsion)", "cut (under shear)"], hint: "Compression pushes material together." },
  { prompt: "Wringing out a wet towel puts it under…", right: "torsion", wrong: ["compression", "tension", "shear"], hint: "Torsion is a twisting force." },
  { prompt: "Scissors cutting paper apply which kind of force to the paper?", right: "shear", wrong: ["compression", "tension", "torsion"], hint: "Shear forces push parts of a material in opposite directions along a surface." },
  { prompt: "In '800 newtons downward at the top of a post', what does 800 newtons tell you?", right: "the magnitude (size) of the force", wrong: ["the direction of the force", "the point of application", "the colour of the post"], hint: "Magnitude means how strong the force is." },
  { prompt: "In '800 newtons downward at the top of a post', what does 'downward' tell you?", right: "the direction of the force", wrong: ["the magnitude of the force", "the mass of the post", "the point of application"], hint: "Direction is the way the force pushes or pulls." },
  { prompt: "You push a door with the same strength, first near the handle and then near the hinges. What have you changed?", right: "the point of application", wrong: ["the magnitude of the force", "the mass of the door", "the direction of Earth's rotation"], hint: "Where a force is applied matters. The door is much harder to open near the hinges." },
  { prompt: "What is symmetry in a structure?", right: "One half is a mirror image of the other half", wrong: ["Every part is a different size", "The structure has no weight", "The structure is made of one material"], hint: "Many bridges and towers are symmetrical." },
  { prompt: "How can symmetry help a structure?", right: "It helps spread the load evenly", wrong: ["It makes the structure heavier", "It removes all forces", "It stops the structure from needing a base"], hint: "Balanced halves share the forces more evenly." },
  { prompt: "The weight of a bridge itself is called its…", right: "dead load", wrong: ["live load", "torsion load", "wind load"], hint: "A dead load does not change. Live loads, like traffic, do change." },
  { prompt: "People and vehicles crossing a bridge are an example of a…", right: "live load", wrong: ["dead load", "fixed load", "frame load"], hint: "Live loads move and change over time." },
  { prompt: "Which of these is a shell structure?", right: "an eggshell", wrong: ["a brick wall made of solid brick", "a hockey stick", "a pile of stones"], hint: "A shell structure gets its strength from a thin outer layer that carries the load." },
  { prompt: "Triangles are often used in bridge trusses. Why?", right: "A triangle holds its shape when forces push on it", wrong: ["Triangles are lighter than all other shapes", "Triangles have no corners", "A triangle can bend without breaking"], hint: "Triangles cannot be pushed out of shape without changing the length of a side.", hard: true },
  { prompt: "A dancer on a tightrope holds a long pole. How does it help?", right: "It helps keep the centre of gravity over the rope", wrong: ["It makes the rope longer", "It adds heat to the dancer", "It removes the force of gravity"], hint: "The pole lets the performer shift weight and keep balance over the support.", hard: true },
  { prompt: "A beam bends under a load. The top edge is squeezed and the bottom edge is stretched. The top is under…", right: "compression", wrong: ["tension", "torsion", "no force"], hint: "The outside of a bend stretches (tension) and the inside is squeezed (compression).", hard: true },
  { prompt: "Why do many roofs in snowy regions slope?", right: "Snow can slide off, so the load on the roof stays smaller", wrong: ["Slopes make snow heavier", "Slopes attract more snow", "Flat roofs have no weight"], hint: "Snow adds a heavy load. A slope lets some of it slide off.", hard: true },
];

function structures(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(STRUCTURE_SORT, 2), symmetryLines(), ...levelled(FORCES_BANK, 6, d)]);
}

// ---------- Designing safe structures ----------

const FACTOR_SORT: SortSet = {
  prompt: "Social, economic or environmental factor? Sort each consideration for a new community building.",
  hint: "Social: how it affects people and community. Economic: cost and money. Environmental: effects on nature, materials and energy.",
  bins: [
    { id: "social", label: "social", emoji: "👥" },
    { id: "economic", label: "economic", emoji: "💰" },
    { id: "environmental", label: "environmental", emoji: "🌍" },
  ],
  items: [
    { label: "ramps and wide doors for wheelchairs", emoji: "♿", bin: "social" },
    { label: "space where neighbours can gather", emoji: "🧑‍🤝‍🧑", bin: "social" },
    { label: "the cost of materials", emoji: "🧱", bin: "economic" },
    { label: "the cost of repairs over 50 years", emoji: "🔧", bin: "economic" },
    { label: "habitat lost on the building site", emoji: "🦉", bin: "environmental" },
    { label: "using recycled or local materials", emoji: "♻️", bin: "environmental" },
  ],
};

const DESIGN_STEPS = [
  { id: "need", label: "Identify the need or problem", emoji: "❓" },
  { id: "research", label: "Research and brainstorm ideas", emoji: "💡" },
  { id: "build", label: "Plan and build a prototype", emoji: "🛠️" },
  { id: "test", label: "Test the prototype", emoji: "🧪" },
  { id: "improve", label: "Improve the design and share it", emoji: "📣" },
];

const DESIGN_BANK: Item[] = [
  { prompt: "A bridge is designed for 20 tonnes, but 35-tonne trucks cross it every day. What is the main risk?", right: "Overloading beyond what the structure was designed to carry", wrong: ["The bridge becomes more symmetrical", "The bridge gets a lower centre of gravity", "The bridge becomes lighter"], hint: "A structure can fail when the load is greater than its strength." },
  { prompt: "Repeated loading and unloading can slowly weaken metal. What is this called?", right: "fatigue", wrong: ["symmetry", "buoyancy", "evaporation"], hint: "Like bending a paper clip back and forth, metal can weaken over time." },
  { prompt: "Why does rust weaken a steel bridge?", right: "Corrosion eats away the steel, making it thinner and weaker", wrong: ["Rust adds extra strength", "Rust makes steel lighter than air", "Rust removes the bridge's weight"], hint: "Paint, coatings and repairs slow corrosion." },
  { prompt: "Water gets into a crack in a road, freezes and expands. What happens?", right: "The crack gets wider", wrong: ["The crack closes", "The road becomes stronger", "The water becomes a metal"], hint: "Freeze-thaw cycles break up roads in Canadian winters." },
  { prompt: "Why must a flat roof in Canada be designed for snow loads?", right: "Snow adds a lot of weight on the roof", wrong: ["Snow makes the roof lighter", "Snow only matters in summer", "Snow has no weight"], hint: "Wet, heavy snow can bring down a roof that was not designed for it." },
  { prompt: "Concrete is strong when squeezed but weak when stretched. Why is steel rebar put inside it?", right: "Steel is strong in tension", wrong: ["Steel is lighter than air", "Steel is weaker than concrete", "Steel makes concrete dissolve"], hint: "Combining materials uses the strengths of each." },
  { prompt: "A tent pole needs to be light and strong. Which material is the best choice?", right: "aluminum alloy", wrong: ["solid concrete", "glass", "clay brick"], hint: "Check the properties needed: low mass and strength." },
  { prompt: "Wood is a renewable material and steel is not. Which kind of factor is this?", right: "environmental", wrong: ["social", "economic only", "symmetry"], hint: "Renewable materials can regrow, which affects the environment." },
  { prompt: "A community hall is built from local stone. What is one advantage?", right: "It reduces transport costs and emissions", wrong: ["It makes the building weightless", "It ends the need for foundations", "It removes the need for maintenance"], hint: "Local materials travel less." },
  { prompt: "An engineer inspects a bridge every two years. Why?", right: "To find cracks and rust before they become dangerous", wrong: ["To make the bridge look new", "To count the cars on it", "To make it lighter"], hint: "Regular inspections help keep a structure safe." },
  { prompt: "What are building codes?", right: "Rules that set minimum safety standards for design and construction", wrong: ["Passwords for opening doors", "Colours for painting buildings", "Names of famous buildings"], hint: "Codes help make sure structures are safe for the people who use them." },
  { prompt: "Why are sensors placed on some bridges?", right: "To measure vibration and movement and warn of problems", wrong: ["To make the bridge heavier", "To produce sunlight", "To change the bridge's colour"], hint: "Monitoring gives early warning." },
  { prompt: "A designer builds a bridge to carry much more than the expected load. This extra margin is a…", right: "safety factor", wrong: ["live load", "torsion", "centre of gravity"], hint: "A safety factor leaves room for the unexpected." },
  { prompt: "How do computer simulations help engineers?", right: "They test designs without building them", wrong: ["They make buildings stronger by themselves", "They replace all inspections", "They remove the need for materials"], hint: "Digital models can show how forces act on a design.", hard: true },
  { prompt: "The Quebec Bridge collapsed during construction in 1907. The inquiry found the designers had underestimated the weight of the bridge itself. This was a failure caused by…", right: "an underestimated dead load", wrong: ["a heavy snowfall", "too many cars crossing it", "a lack of symmetry"], hint: "The structure's own weight is the dead load. Stricter standards and inspections followed.", hard: true },
  { prompt: "A building in an earthquake zone has flexible joints so that it can sway. Why?", right: "Swaying lets it absorb shaking without breaking", wrong: ["Swaying makes it taller", "Swaying removes gravity", "Swaying stops all earthquakes"], hint: "A rigid structure may crack, but one that flexes can survive shaking.", hard: true },
  { prompt: "Which desk setup is best ergonomically?", right: "Feet flat on the floor, screen at eye level, elbows near 90 degrees", wrong: ["Feet tucked under the chair, screen on the floor", "Screen far above eye level, arms stretched out", "Leaning forward with the screen on a lap"], hint: "Ergonomics means designing for comfort, safety and efficiency.", hard: true },
  { prompt: "What is the safest way to lift a heavy box?", right: "Bend your knees, keep your back straight and hold the box close", wrong: ["Bend at the waist and twist while lifting", "Hold the box at arm's length", "Jerk it up quickly"], hint: "Using your legs and keeping the load close protects your back.", hard: true },
];

function design(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([
    sortQuestion(FACTOR_SORT, 2),
    orderQuestion("Put the steps of the engineering design process in order.", "Start with the need, research and brainstorm, build a prototype, test it, then improve and share the design.", DESIGN_STEPS, d),
    ...levelled(DESIGN_BANK, 6, d),
  ]);
}

// ---------- Heat and particles ----------

const HEAT_SORT: SortSet = {
  prompt: "How is the heat made? Sort each example.",
  hint: "Friction makes heat when surfaces rub. Electricity can heat a wire. Burning (combustion) is a chemical reaction that releases heat.",
  bins: [
    { id: "friction", label: "friction", emoji: "🤲" },
    { id: "electricity", label: "electricity", emoji: "🔌" },
    { id: "burning", label: "burning", emoji: "🔥" },
  ],
  items: [
    { label: "rubbing your hands together", emoji: "🤲", bin: "friction" },
    { label: "brake pads slowing a bicycle", emoji: "🚲", bin: "friction" },
    { label: "an electric kettle", emoji: "🫖", bin: "electricity" },
    { label: "a toaster", emoji: "🍞", bin: "electricity" },
    { label: "a campfire", emoji: "🔥", bin: "burning" },
    { label: "a gas stove", emoji: "🍳", bin: "burning" },
  ],
};

interface Substance {
  name: string;
  mp: number;
  bp: number;
  temps: number[];
}

const SUBSTANCES: Substance[] = [
  { name: "water", mp: 0, bp: 100, temps: [-10, 25, 60, 130] },
  { name: "ethanol", mp: -114, bp: 78, temps: [-130, 20, 90] },
  { name: "mercury", mp: -39, bp: 357, temps: [-60, 20, 400] },
  { name: "oxygen", mp: -218, bp: -183, temps: [-230, -200, 20] },
  { name: "nitrogen", mp: -210, bp: -196, temps: [-220, -200, 25] },
];

const sign = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));

function stateAtTemperature(d: 1 | 2 | 3): Question {
  const s = d === 1 ? SUBSTANCES[0] : pick(SUBSTANCES);
  const t = pick(s.temps);
  const state = t < s.mp ? "solid" : t < s.bp ? "liquid" : "gas";
  return textChoice(
    `At ${sign(t)} °C, what state is ${s.name}?`,
    state,
    ["solid", "liquid", "gas"].filter((x) => x !== state),
    `Below the melting point it is a solid. Between the melting and boiling points it is a liquid. Above the boiling point it is a gas.`,
    { type: "table", title: s.name, headers: ["Melting point", "Boiling point"], rows: [[`${sign(s.mp)} °C`, `${sign(s.bp)} °C`]] },
  );
}

function temperatureRise(): Question {
  const from = pick([5, 10, 12, 15, 18, 20, 22]);
  const rise = pick([20, 25, 30, 35, 40, 45, 50]);
  return typeIn(`A pot of water is heated from ${from} °C to ${from + rise} °C. By how many degrees did its temperature rise?`, rise, `Subtract: ${from + rise} − ${from}.`, undefined, { suffix: "°C" });
}

const HEAT_BANK: Item[] = [
  { prompt: "What happens to the particles of a substance when it is heated?", right: "They move faster", wrong: ["They stop moving", "They disappear", "They turn into a different substance"], hint: "Heat is energy that makes particles move faster." },
  { prompt: "Heat flows naturally from…", right: "warmer objects to cooler objects", wrong: ["cooler objects to warmer objects", "heavier objects to lighter ones", "larger objects to smaller ones"], hint: "Heat moves from a place with faster-moving particles to one with slower-moving particles." },
  { prompt: "Temperature is a measure of…", right: "how fast the particles are moving, on average", wrong: ["how many particles there are", "how big the particles are", "how much space the substance fills"], hint: "A hotter object has particles with more motion energy on average." },
  { prompt: "Why do most solids expand when heated?", right: "Their particles vibrate more and take up more room", wrong: ["Their particles grow larger", "New particles are created", "Their particles stop moving"], hint: "Bigger vibrations push particles slightly farther apart." },
  { prompt: "Why do bridges have gaps called expansion joints?", right: "They give the material room to expand in hot weather", wrong: ["They keep traffic quiet", "They make the bridge heavier", "They let water freeze"], hint: "Without gaps, expanding steel and concrete could buckle." },
  { prompt: "How does a liquid thermometer work?", right: "The liquid expands when heated and rises in the tube", wrong: ["The liquid disappears when cooled", "The tube grows when heated", "The liquid turns into a solid"], hint: "A warmer liquid takes up more space, so it climbs higher." },
  { prompt: "Why does a hot air balloon rise?", right: "Heated air expands and becomes less dense than the cooler air outside", wrong: ["Heat makes air heavier", "Hot air has no particles", "The balloon is pushed up by the flame"], hint: "A less dense balloon of air floats upward." },
  { prompt: "An inflated balloon is put in a freezer and shrinks. Why?", right: "The air particles slow down and take up less space", wrong: ["Air particles are destroyed by cold", "The balloon loses its weight", "The particles grow smaller"], hint: "Cooling a gas reduces its volume." },
  { prompt: "A solid absorbs enough heat to change into a liquid. What is this change called?", right: "melting", wrong: ["freezing", "condensation", "evaporation"], hint: "Solid to liquid is melting." },
  { prompt: "Water vapour in the air turns into droplets on a cold glass. This is…", right: "condensation", wrong: ["melting", "freezing", "evaporation"], hint: "Gas to liquid is condensation." },
  { prompt: "As a solid melts, its particles…", right: "gain energy and move more freely", wrong: ["lose all their energy", "stop vibrating", "become different particles"], hint: "The particles still stay close but are no longer fixed in place." },
  { prompt: "Rubbing your hands together makes them warm because…", right: "friction changes motion energy into heat", wrong: ["your hands lose their particles", "cold flows out of your hands", "the air creates heat"], hint: "Rubbing surfaces make particles move faster." },
  { prompt: "A compost pile can feel warm inside because…", right: "microorganisms break down material and release heat", wrong: ["the compost is full of ice", "the Sun is inside the pile", "particles stop moving"], hint: "Chemical reactions in decomposition release energy." },
  { prompt: "Which source of heat does NOT involve burning?", right: "heat from deep inside Earth (geothermal)", wrong: ["a wood stove", "a gas furnace", "a candle"], hint: "Geothermal heat comes from Earth's interior." },
  { prompt: "Your body makes heat mainly from…", right: "chemical reactions that release energy from food", wrong: ["friction in your shoes", "burning fuel inside your stomach", "absorbing cold air"], hint: "Cells use food for energy, and some of it is released as heat." },
  { prompt: "Water expands when it freezes. Why can this crack a pipe?", right: "Ice takes up more space than liquid water", wrong: ["Ice is hotter than water", "Water particles shrink", "Ice has no particles"], hint: "A pipe full of freezing water has nowhere to put the extra volume." },
  { prompt: "A bathtub of warm water and a cup of boiling water. Which has more total thermal energy?", right: "the bathtub, because it has many more particles", wrong: ["the cup, because it is hotter", "They have the same", "Neither has any"], hint: "Temperature is an average. Total thermal energy also depends on how much matter there is.", hard: true },
  { prompt: "The Sun produces heat and light by…", right: "nuclear reactions in its core", wrong: ["burning wood and coal", "friction with space", "electricity from a power plant"], hint: "In the Sun's core, atoms join together and release huge amounts of energy.", hard: true },
  { prompt: "Which statement correctly describes heat and temperature?", right: "Heat is energy that moves from warmer to cooler; temperature measures average particle motion", wrong: ["Heat and temperature mean exactly the same thing", "Temperature is the energy moving between objects", "Heat measures how fast something is moving overall"], hint: "Heat is a transfer of energy. Temperature is a measure of an object's particles.", hard: true },
  { prompt: "Gas particles in a sealed rigid container are heated. What happens to the pressure inside?", right: "It increases because the particles hit the walls more often and harder", wrong: ["It decreases because the particles slow down", "It stays the same", "The particles disappear"], hint: "Faster particles hit the walls with more force.", hard: true },
];

function heatParticles(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(HEAT_SORT, 2), stateAtTemperature(d), temperatureRise(), ...levelled(HEAT_BANK, 5, d)]);
}

// ---------- Heat transfer and energy use ----------

const TRANSFER_SORT: SortSet = {
  prompt: "Conduction, convection or radiation? Sort each example.",
  hint: "Conduction: heat passes through direct contact. Convection: heat is carried by moving liquid or gas. Radiation: heat travels as waves, even through empty space.",
  bins: [
    { id: "conduction", label: "conduction", emoji: "🥄" },
    { id: "convection", label: "convection", emoji: "🌬️" },
    { id: "radiation", label: "radiation", emoji: "☀️" },
  ],
  items: [
    { label: "a metal spoon warming in hot soup", emoji: "🥄", bin: "conduction" },
    { label: "bare feet heated by hot sand", emoji: "🏖️", bin: "conduction" },
    { label: "warm air rising from a radiator", emoji: "♨️", bin: "convection" },
    { label: "water circulating in a boiling pot", emoji: "🍲", bin: "convection" },
    { label: "warmth from the Sun on your face", emoji: "☀️", bin: "radiation" },
    { label: "warmth from a campfire felt at a distance", emoji: "🔥", bin: "radiation" },
  ],
};

const TRANSFER_BANK: Item[] = [
  { prompt: "How does energy from the Sun reach Earth?", right: "radiation", wrong: ["conduction", "convection"], hint: "Space is almost empty, so heat there can only travel as radiation." },
  { prompt: "Which type of heat transfer can happen through empty space?", right: "radiation", wrong: ["conduction", "convection"], hint: "Conduction and convection need particles to carry the heat. Radiation does not." },
  { prompt: "Why does metal feel colder than wood at the same room temperature?", right: "Metal conducts heat away from your hand faster", wrong: ["Metal is always colder", "Wood makes heat", "Metal has no particles"], hint: "A good conductor pulls heat from your skin quickly, so it feels cold." },
  { prompt: "Which material is the best heat insulator?", right: "foam", wrong: ["copper", "aluminum", "steel"], hint: "Insulators slow heat transfer. Metals are good conductors." },
  { prompt: "Why do many pots have plastic or wooden handles?", right: "Those materials conduct heat poorly, so the handles stay cooler", wrong: ["They make the pot heavier", "They conduct heat better than metal", "They help the pot cool faster"], hint: "Poor conductors protect your hand." },
  { prompt: "Why does warm air rise?", right: "It expands and is less dense than the cooler air around it", wrong: ["It is heavier than cooler air", "Cold air pulls it up", "Gravity does not affect warm air"], hint: "Less dense fluid floats up through denser fluid." },
  { prompt: "A convection current in a pot of water moves…", right: "warm water up and cooler water down", wrong: ["warm water down and cooler water up", "all the water sideways", "no water at all"], hint: "Water at the bottom warms, rises, cools at the top and sinks again." },
  { prompt: "Which surface absorbs the most radiation from the Sun?", right: "dark pavement", wrong: ["fresh snow", "a white roof", "a mirror"], hint: "Dark surfaces absorb more. Light and shiny ones reflect more." },
  { prompt: "A black car and a white car sit in the Sun. Why does the black car get hotter?", right: "Dark colours absorb more of the Sun's radiation", wrong: ["Black paint makes heat", "White cars give off cold", "Black reflects more light"], hint: "Absorbed radiation turns into heat." },
  { prompt: "Why are double-pane windows used in cold climates?", right: "The trapped air or gas between the panes is a poor conductor, so less heat escapes", wrong: ["Two panes make the room darker", "They let more cold in", "They give off heat"], hint: "Reducing heat loss saves energy and lowers heating costs." },
  { prompt: "Weatherstripping seals gaps around doors. How does it save energy?", right: "It stops warm air from leaking out and cold air from leaking in", wrong: ["It makes the door heavier", "It heats the house", "It stops light entering"], hint: "Moving air carries heat by convection." },
  { prompt: "Light-coloured roof coatings keep buildings cooler in summer. How?", right: "They reflect more of the Sun's radiation", wrong: ["They absorb more of the Sun's heat", "They make heat", "They add more insulation inside"], hint: "Reflected radiation does not become heat in the building." },
  { prompt: "Better insulation in homes reduces heat loss. What is one environmental benefit?", right: "Less energy is needed for heating, so fewer greenhouse gases are released", wrong: ["Homes need more fuel", "Homes make their own heat", "Insulation removes carbon from the air"], hint: "If heating uses fossil fuels, using less reduces emissions." },
  { prompt: "A lid on a cup of hot chocolate helps it stay warm. How?", right: "It reduces heat lost by evaporation and by moving air", wrong: ["It makes heat in the cup", "It lets more heat escape", "It stops conduction through the table only"], hint: "The lid traps hot vapour and blocks rising warm air." },
  { prompt: "A lizard lies on a sun-warmed rock and warms up. Which type of heat transfer is warming it from below?", right: "conduction", wrong: ["radiation only", "convection", "evaporation"], hint: "Heat passes directly from the rock to the lizard where they touch." },
  { prompt: "During the day near a big lake, the land warms faster than the water. What happens to the air over the land?", right: "It warms and rises, and cooler air from the lake moves in", wrong: ["It cools and sinks", "It stops moving", "It changes into water"], hint: "This convection current is called a lake or sea breeze.", hard: true },
  { prompt: "A thermos keeps drinks hot using a vacuum gap between two shiny walls. What does the vacuum do?", right: "It stops conduction and convection across the gap", wrong: ["It adds heat to the drink", "It stops radiation completely by itself", "It makes the walls thicker"], hint: "There are no particles in a vacuum to carry heat. The shiny walls reflect radiation.", hard: true },
  { prompt: "Fresh snow is bright white. How does this affect Earth's heating?", right: "Snow reflects much of the Sun's radiation back toward space", wrong: ["Snow absorbs most radiation", "Snow produces its own heat", "Snow has no effect on radiation"], hint: "Light surfaces reflect more radiation, so snow-covered ground stays cooler.", hard: true },
  { prompt: "Earth's mantle is hot rock that very slowly flows. Which kind of heat transfer helps move it?", right: "convection", wrong: ["radiation through empty space", "conduction only", "evaporation"], hint: "Hotter, less dense rock rises and cooler rock sinks over millions of years.", hard: true },
  { prompt: "Which action would NOT reduce heat loss from a house in winter?", right: "opening windows to let in fresh air for hours", wrong: ["adding attic insulation", "sealing gaps around doors", "installing double-pane windows"], hint: "Open windows let warm air escape and cold air in.", hard: true },
  { prompt: "Which is an example of heat transfer by conduction?", right: "A pan handle becoming hot on a stove", wrong: ["The Sun warming Earth", "Warm air rising from a heater", "Smoke rising in a chimney"], hint: "Conduction needs direct contact." },
  { prompt: "Which is an example of convection?", right: "Hot air rising from a heater and cool air sinking", wrong: ["A spoon heating in soup", "Light from a lamp", "Heat moving through a metal rod"], hint: "Convection moves heat by flowing fluids." },
  { prompt: "Why does a down jacket keep you warm?", right: "It traps air, which is a poor conductor", wrong: ["It makes heat", "It conducts heat away from you", "It blocks the Sun"], hint: "Trapped air is an insulator." },
  { prompt: "A metal bike seat feels hotter than a cloth one after sitting in the Sun. What explains this?", right: "Metal is a good conductor, and it passes heat to your skin quickly", wrong: ["Metal is a good insulator", "Cloth is hotter", "The Sun heats only metal"], hint: "Conductors move heat fast." },
  { prompt: "Which kind of heat transfer makes you feel warm when you stand near a campfire without touching it?", right: "radiation", wrong: ["conduction", "convection only", "evaporation"], hint: "Heat travels as waves through the air." },
  { prompt: "Where would you put a window air conditioner in a room to cool it best, and why?", right: "High up, because cool air sinks and circulates", wrong: ["On the floor, because cool air rises", "Anywhere, because cool air stays put", "Only outside"], hint: "Cool air is denser and sinks." },
];

function heatTransfer(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(TRANSFER_SORT, 2), ...levelled(TRANSFER_BANK, 7, d)]);
}

// ---------- The units ----------

export const units: Unit[] = [
  {
    id: "ecosystems-7",
    title: "Ecosystems",
    emoji: "🌲",
    blurb: "Living and non-living parts",
    parentNote: "Biotic and abiotic parts of an ecosystem, how they interact, and the limiting factors and carrying capacity that decide how many organisms an ecosystem can support.",
    standards: on("B2.1, B2.2, B2.7", "ecosystems, biotic and abiotic components, and limiting factors"),
    generate: ecosystems,
  },
  {
    id: "food-chains-7",
    title: "Food Chains & Energy",
    emoji: "🦊",
    blurb: "Who eats whom, and the energy",
    parentNote: "Producers, consumers and decomposers, food chains and webs, how energy shrinks as it passes up a chain (about 10% each step), and what happens when part of a chain changes.",
    standards: on("B2.3, B2.4", "producers, consumers and decomposers; energy transfer in food chains"),
    generate: foodChains,
  },
  {
    id: "cycles-succession-7",
    title: "Cycles & Succession",
    emoji: "♻️",
    blurb: "Matter cycles; land regrows",
    parentNote: "How water, carbon and nitrogen are cycled through ecosystems, why cycling supports sustainability, and the difference between primary and secondary succession.",
    standards: on("B2.5, B2.6", "cycling of matter; primary and secondary succession"),
    generate: cycles,
  },
  {
    id: "human-impact-7",
    title: "People & Ecosystems",
    emoji: "🐟",
    blurb: "Farming, fishing and balance",
    parentNote: "How agriculture, harvesting and technologies affect ecosystems, such as monoculture, overfishing, invasive species and runoff, and ways to protect and restore balance. Includes reading simple data about an environmental measure.",
    standards: on("B1.1, B1.2, B2.8", "impacts of human activities and technologies on ecosystems, and ways to restore balance"),
    generate: humanImpact,
  },
  {
    id: "particles-mixtures-7",
    title: "Particles & Mixtures",
    emoji: "🥣",
    blurb: "Pure substances and mixtures",
    parentNote: "The particle theory of matter, the states of matter, pure substances versus mixtures, and homogeneous versus heterogeneous mixtures.",
    standards: on("C2.1–C2.3", "particle theory, pure substances and mixtures, homogeneous and heterogeneous mixtures"),
    generate: particles,
  },
  {
    id: "solutions-separation-7",
    title: "Solutions & Separating",
    emoji: "🧪",
    blurb: "Dissolving and splitting mixtures",
    parentNote: "Solutes, solvents and solubility, what makes things dissolve faster, saturated and unsaturated solutions, concentration, why water is called the universal solvent, ways to separate mixtures, and some environmental effects of industrial separation.",
    standards: on("C1.2, C2.4–C2.7", "solubility, concentration, water as a solvent, and separating mixtures"),
    generate: solutions,
  },
  {
    id: "structures-forces-7",
    title: "Structures & Forces",
    emoji: "🌉",
    blurb: "Shapes, balance and forces",
    parentNote: "Solid, frame and shell structures, centre of gravity and stability, symmetry, and the size, direction and point of application of forces, including tension, compression, torsion and shear.",
    standards: on("D2.1–D2.4", "classifying structures; centre of gravity; forces; symmetry"),
    generate: structures,
  },
  {
    id: "safe-structures-7",
    title: "Safe Structures",
    emoji: "🏗️",
    blurb: "Why they fail, how to keep safe",
    parentNote: "Why structures fail (overloading, fatigue, corrosion, freeze-thaw), choosing materials, how engineers assess and maintain safety, the engineering design process, and social, economic and environmental factors in design, including ergonomics.",
    standards: on("D1.1, D1.2, D2.5–D2.7", "structure failure, materials, safety, design factors and ergonomics"),
    generate: design,
  },
  {
    id: "heat-particles-7",
    title: "Heat & Particles",
    emoji: "🌡️",
    blurb: "Heat, motion and changing state",
    parentNote: "Heat as energy linked to particle motion, temperature, expansion and contraction, changes of state, and the ways heat is generated (friction, electricity, burning, chemical reactions and the Sun).",
    standards: on("E2.1–E2.3", "heat and particle motion; heat generation; expansion and changes of state"),
    generate: heatParticles,
  },
  {
    id: "heat-transfer-7",
    title: "Moving Heat",
    emoji: "♨️",
    blurb: "Conduction, convection, radiation",
    parentNote: "How heat is transmitted by conduction, convection and radiation, how the Sun's radiation heats different surfaces, and technologies such as insulation and double-pane windows that reduce heat loss.",
    standards: on("E1.1, E2.4–E2.6", "conduction, convection, radiation, and technologies that reduce heat loss"),
    generate: heatTransfer,
  },
];
