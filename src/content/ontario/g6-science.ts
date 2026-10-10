import type { SortSet } from "../bank";
import { shuffle } from "../random";
import type { OrderQuestion, Question, Unit } from "../types";
import { levelled, withSort, type Item, type Level } from "./g56-bank";
import { on } from "./kit";

// Ontario Grade 6 Science and Technology (2022). BC's Our Solar System unit is shared (Space).
// These units cover Biodiversity (Life Systems), Electrical Phenomena, Energy and Devices (Matter
// and Energy), Flight (Structures and Mechanisms), the Earth-Moon-Sun system and space exploration
// (Earth and Space Systems), and the STEM skills strand.

function withOrder(bank: Item[], order: OrderQuestion, d: Level): Question[] {
  return shuffle([...levelled(bank, 7, d), order]);
}

// ---------- Classifying living things (B2.1) ----------

const CLASSIFY: Item[] = [
  { prompt: "What do all mammals have in common?", right: "They feed their young with milk", wrong: ["They lay eggs on land", "They have gills"], hint: "Mammals are also covered in some hair or fur and breathe air." },
  { prompt: "A bat can fly, but it is a mammal. Why?", right: "It has fur and feeds its young milk", wrong: ["It has feathers", "It lays eggs"], hint: "Flying does not make an animal a bird. Look at the body features." },
  { prompt: "A whale lives in the ocean. Why is it classified as a mammal and not a fish?", right: "It breathes air with lungs and nurses its young", wrong: ["It lives in water", "It has fins"], hint: "Fish breathe with gills." },
  { prompt: "Which group of animals has feathers?", right: "Birds", wrong: ["Reptiles", "Amphibians"], hint: "All birds have feathers, and most can fly." },
  { prompt: "Which group has dry skin covered with scales and is cold-blooded?", right: "Reptiles", wrong: ["Mammals", "Birds"], hint: "Snakes, lizards and turtles are reptiles." },
  { prompt: "Which animals spend part of their lives in water and part on land, with moist skin?", right: "Amphibians", wrong: ["Reptiles", "Birds"], hint: "Frogs and salamanders begin life in water." },
  { prompt: "What is a vertebrate?", right: "An animal with a backbone", wrong: ["An animal with six legs", "An animal that lives only in water"], hint: "'Vertebra' is a bone of the backbone." },
  { prompt: "Which is an invertebrate?", right: "A snail", wrong: ["A frog", "A robin"], hint: "Invertebrates have no backbone." },
  { prompt: "How many legs and body parts does an insect have?", right: "Six legs and three body parts", wrong: ["Eight legs and two body parts", "Four legs and one body part"], hint: "Insects have a head, thorax and abdomen." },
  { prompt: "A spider has eight legs and two body parts. Which group is it in?", right: "Arachnids", wrong: ["Insects", "Mammals"], hint: "Spiders, scorpions and ticks are arachnids." },
  { prompt: "A mushroom belongs to which kingdom?", right: "Fungi", wrong: ["Plants", "Animals"], hint: "Fungi cannot make their own food as plants do." },
  { prompt: "Which tree reproduces using seeds in cones?", right: "A spruce", wrong: ["A maple", "A fern"], hint: "Conifers such as spruce and pine are cone-bearing." },
  { prompt: "Ferns and mosses reproduce using…", right: "spores", wrong: ["seeds in cones", "flowers and fruit"], hint: "Spores are tiny cells that grow into new plants.", hard: true },
  { prompt: "Bacteria are different from other living things because they are…", right: "single-celled and have no nucleus", wrong: ["always large and made of many cells", "plants that make seeds"], hint: "A bacterium is a single tiny cell.", hard: true },
  { prompt: "Which are the levels of classification from largest group to smallest?", right: "Kingdom, class, genus, species", wrong: ["Species, genus, class, kingdom", "Genus, kingdom, species, class"], hint: "A kingdom includes many classes. A species is the smallest group.", hard: true },
  { prompt: "A dichotomous key helps identify an organism by using…", right: "a series of paired choices, such as yes or no", wrong: ["a single guess", "its age only"], hint: "'Dichotomous' means divided into two.", hard: true },
  { prompt: "Which is a trait of the fungi kingdom?", right: "They absorb nutrients from dead or living matter", wrong: ["They make food using sunlight", "They have backbones"], hint: "Fungi break things down and absorb nutrients.", hard: true },
  { prompt: "Which group of vertebrates has gills when young and lives in water?", right: "Fish", wrong: ["Birds", "Mammals"], hint: "Fish take oxygen from water with gills." },
  { prompt: "A snake has dry scales and lays eggs on land. Which group is it?", right: "Reptiles", wrong: ["Amphibians", "Mammals"], hint: "Reptiles are cold-blooded with dry scaly skin." },
  { prompt: "A salamander begins life in water and lives on land as an adult. Which group is it?", right: "Amphibians", wrong: ["Reptiles", "Fish"], hint: "Amphibians live a double life, in water and on land." },
  { prompt: "Which of these is an invertebrate?", right: "An earthworm", wrong: ["A trout", "A sparrow"], hint: "It has no backbone." },
  { prompt: "A beetle has three body parts and six legs. Which group is it in?", right: "Insects", wrong: ["Arachnids", "Mammals"], hint: "Insects have a head, thorax and abdomen." },
  { prompt: "Which kingdom do mosses and ferns belong to?", right: "Plants", wrong: ["Fungi", "Animals"], hint: "They make food from sunlight, but reproduce by spores." },
  { prompt: "Which kingdom are mushrooms and yeast in?", right: "Fungi", wrong: ["Bacteria", "Plants"], hint: "Fungi are not plants or animals." },
  { prompt: "A key asks: 'Does it have fur?' What kind of question is this?", right: "A yes-or-no question that helps sort organisms", wrong: ["A question with many answers", "A question about colour only"], hint: "A dichotomous key uses two choices at each step." },
  { prompt: "Which is the smallest group in the classification system?", right: "Species", wrong: ["Kingdom", "Class"], hint: "A species is a single kind of organism." },
  { prompt: "A sunflower makes seeds in its flower. Which plant group is it?", right: "Flowering plants", wrong: ["Conifers", "Mosses"], hint: "Flowering plants reproduce using flowers and fruit." },
];

const CLASSIFY_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put these levels of classification in order from the largest group to the smallest.",
  hint: "A kingdom is the biggest group. A species is the smallest of these.",
  items: [
    { id: "kingdom", label: "Kingdom", emoji: "🌍" },
    { id: "class", label: "Class", emoji: "📂" },
    { id: "genus", label: "Genus", emoji: "📁" },
    { id: "species", label: "Species", emoji: "🔬" },
  ],
};

// ---------- Biodiversity (B1.1, B2.2–B2.5) ----------

const BIODIVERSITY: Item[] = [
  { prompt: "What is biodiversity?", right: "The variety of life on Earth", wrong: ["The number of people in a city", "The size of a forest"], hint: "It includes variety within species, among species and among habitats." },
  { prompt: "Dogs of the same breed that are slightly different from one another show diversity…", right: "within a species", wrong: ["among communities", "among habitats"], hint: "Differences between individuals of one species are variation within the species." },
  { prompt: "A pond, a forest and a wetland near each other show diversity of…", right: "habitats and communities", wrong: ["genes in one species", "only insects"], hint: "Different places support different communities of living things." },
  { prompt: "Why is variation within a species important?", right: "Some individuals may survive if conditions change", wrong: ["It makes every animal identical", "It stops all disease"], hint: "A varied group is more likely to include survivors when something changes." },
  { prompt: "A forest with many different kinds of plants and animals is likely to be…", right: "more resilient to change", wrong: ["less able to recover from storms", "unable to support insects"], hint: "More variety gives an ecosystem more ways to adjust." },
  { prompt: "Bees get nectar from flowers, and flowers get pollinated. This relationship is called…", right: "mutualism", wrong: ["parasitism", "competition"], hint: "Both sides benefit." },
  { prompt: "A tick feeds on a dog's blood and harms it. This relationship is called…", right: "parasitism", wrong: ["mutualism", "pollination"], hint: "One organism benefits and the other is harmed." },
  { prompt: "Two plants in the same patch compete for sunlight and water. This is…", right: "competition", wrong: ["mutualism", "predation"], hint: "Both need the same limited resources." },
  { prompt: "A wolf hunts a deer. This relationship is called…", right: "predation (predator and prey)", wrong: ["mutualism", "parasitism"], hint: "The predator catches and eats the prey." },
  { prompt: "Beavers build dams that create ponds where many species live. Why is the beaver called a keystone species?", right: "Many other species depend on what it does", wrong: ["It is the largest animal", "It eats all the fish"], hint: "A keystone species affects many others in its ecosystem." },
  { prompt: "Which is a benefit of biodiversity for people?", right: "Food, medicines and clean air and water", wrong: ["More litter", "Fewer insects pollinating crops"], hint: "Healthy natural systems provide services people rely on." },
  { prompt: "What does it mean when a species becomes extinct?", right: "No living members of the species remain", wrong: ["It moves to a new habitat", "It becomes common"], hint: "Extinct species are gone forever." },
  { prompt: "In a food web, what could happen if a main plant food disappears?", right: "Animals that eat it may decline, and so may their predators", wrong: ["Nothing changes", "All the predators increase"], hint: "Species in a community are linked.", hard: true },
  { prompt: "Birds build nests in a tree without hurting it. The birds benefit and the tree is unaffected. This is called…", right: "commensalism", wrong: ["mutualism", "parasitism"], hint: "One benefits and the other is neither helped nor harmed.", hard: true },
  { prompt: "Why does a community with many species recover better after a disaster, such as a fire?", right: "More kinds of organisms can fill different roles", wrong: ["It has fewer plants", "Nothing can live there"], hint: "Diversity gives resilience.", hard: true },
  { prompt: "When a wetland is drained, what happens to the biodiversity it supported?", right: "It decreases", wrong: ["It increases", "It stays the same for all species"], hint: "Habitat loss removes homes and food.", hard: true },
  { prompt: "Which pair shows diversity within a species?", right: "Different colours of the same type of butterfly", wrong: ["A frog and a fish", "A pine and a maple"], hint: "Look for variation inside one species.", hard: true },
  { prompt: "A meadow has grasses, wildflowers, insects, mice and hawks. What does this show?", right: "Diversity among species", wrong: ["Diversity within one species", "No diversity"], hint: "Many different species live there." },
  { prompt: "Which is an example of mutualism?", right: "A clownfish and an anemone protecting each other", wrong: ["A tick on a dog", "Two trees competing for light"], hint: "Both partners benefit." },
  { prompt: "A cuckoo bird lays eggs in another bird's nest, and the other bird raises the chick at its own cost. This is closest to…", right: "parasitism", wrong: ["mutualism", "commensalism"], hint: "One benefits and the other is harmed." },
  { prompt: "What is a habitat?", right: "The place where an organism finds food, water and shelter", wrong: ["A kind of food", "A weather forecast"], hint: "A habitat meets a living thing's needs." },
  { prompt: "A farmer grows many crop types on one farm. How does this support biodiversity?", right: "It provides different foods and homes for different organisms", wrong: ["It lowers variety", "It has no effect on insects"], hint: "More variety supports more kinds of life." },
  { prompt: "Why do scientists protect large areas of habitat?", right: "Many species need room and connected spaces to survive", wrong: ["To make parks bigger for no reason", "So no one can visit"], hint: "Habitat size matters for animals that travel." },
  { prompt: "A food chain shows…", right: "how energy passes from one organism to another", wrong: ["where organisms live", "how organisms look"], hint: "Plants make food, and animals eat plants or each other." },
  { prompt: "Which pair is a producer and a consumer?", right: "A maple tree and a deer", wrong: ["A deer and a wolf", "A mushroom and a fern"], hint: "Producers make their own food. Consumers eat other organisms." },
  { prompt: "What do decomposers such as fungi do?", right: "Break down dead matter and return nutrients to the soil", wrong: ["Make food from sunlight", "Hunt prey"], hint: "Decomposers recycle nutrients." },
  { prompt: "A pond has frogs, fish, dragonflies and reeds. If all the frogs disappeared, what might happen?", right: "Insect numbers could rise and the food web would change", wrong: ["Nothing would change", "The pond would dry up at once"], hint: "Each species links to others." },
];

// ---------- Risks to biodiversity (B1, B2.6–B2.8) ----------

const RISKS: Item[] = [
  { prompt: "What is an invasive species?", right: "A non-native species that spreads and harms its new environment", wrong: ["Any species that is rare", "A species that is native and helpful"], hint: "Invasive species do not belong in the area and spread quickly." },
  { prompt: "Zebra mussels arrived in the Great Lakes in ships' ballast water. They are an example of…", right: "an invasive species", wrong: ["a keystone species", "an endangered native species"], hint: "They came from outside and spread widely." },
  { prompt: "Emerald ash borer beetles kill ash trees in Ontario. What kind of species is this beetle?", right: "Invasive", wrong: ["Native", "Extinct"], hint: "It came from Asia and has no natural enemies here." },
  { prompt: "Why can invasive species spread so quickly?", right: "They often have no natural predators in the new area", wrong: ["They are always larger", "They need no food"], hint: "Nothing in the new place keeps their numbers down." },
  { prompt: "What should you do if you no longer want an aquarium pet?", right: "Never release it into a lake or river", wrong: ["Release it in a nearby pond", "Flush it down the toilet"], hint: "A released pet can become an invasive species." },
  { prompt: "Which human activity most directly causes habitat loss?", right: "Clearing forests and draining wetlands", wrong: ["Planting native trees", "Creating a park"], hint: "Animals lose homes and food." },
  { prompt: "How does climate change threaten some Arctic animals such as polar bears?", right: "Sea ice melts earlier, so they have less time to hunt seals", wrong: ["The Arctic is getting colder", "They can no longer swim"], hint: "Polar bears hunt from sea ice." },
  { prompt: "Rising ocean temperatures harm coral reefs because…", right: "corals can lose their food-making algae and turn white", wrong: ["corals dissolve in fresh water", "reefs need cold water"], hint: "This is called coral bleaching." },
  { prompt: "What is a protected area, such as a national park, meant to do?", right: "Keep habitats and the species that live in them safe", wrong: ["Hold events for tourists only", "Remove the animals"], hint: "Protected areas conserve nature." },
  { prompt: "Which action helps protect biodiversity in your neighbourhood?", right: "Planting native flowers that pollinators need", wrong: ["Dumping garbage in a ditch", "Using lots of pesticide"], hint: "Native plants support native insects and birds." },
  { prompt: "A community plans to protect a local wetland. Which first step is best?", right: "Learn who uses it and what lives there", wrong: ["Pave it", "Decide without asking anyone"], hint: "Gather information and perspectives before acting." },
  { prompt: "Why do farmers grow many varieties of a crop?", right: "If a disease hits one variety, others may survive", wrong: ["Because all varieties are identical", "To make the crop worse"], hint: "More variety makes agriculture more secure.", hard: true },
  { prompt: "Indigenous farmers in the Andes grew thousands of kinds of potatoes. What does this show?", right: "Careful crop diversity can protect food supplies", wrong: ["Potatoes cannot be grown", "Only one potato is ever needed"], hint: "Different varieties grow in different soils and climates.", hard: true },
  { prompt: "Growing only one crop variety over a large area is risky because…", right: "one disease or pest could destroy it all", wrong: ["it always grows faster", "it is not allowed in Canada"], hint: "The Irish potato famine was made worse because many farmers relied on a few varieties.", hard: true },
  { prompt: "Which law helps protect plants and animals at risk of disappearing in Canada?", right: "The Species at Risk Act", wrong: ["The Highway Traffic Act", "The Criminal Code"], hint: "SARA was passed in 2002.", hard: true },
  { prompt: "The Atlantic cod fishery collapsed in 1992. What does this show?", right: "Taking too much of a species can threaten it and the people who rely on it", wrong: ["Cod are an invasive species", "The fishery grew in 1992"], hint: "Overharvesting can harm both wildlife and communities.", hard: true },
  { prompt: "Purple loosestrife is a plant that spreads through wetlands and crowds out native plants. What kind of species is it?", right: "An invasive species", wrong: ["A keystone species", "A native species"], hint: "It spreads fast where it does not belong." },
  { prompt: "Which action can slow the spread of invasive species?", right: "Cleaning boats and boots before moving to a new place", wrong: ["Moving firewood across the country", "Releasing pets in the wild"], hint: "Seeds and small organisms hitch rides." },
  { prompt: "Which is a result of habitat loss?", right: "Animals may have less food, shelter and space", wrong: ["Animals always move easily", "Plants grow faster"], hint: "Habitat provides everything a species needs." },
  { prompt: "A species at risk is one that…", right: "may disappear if nothing is done to help it", wrong: ["has too many members", "is always an insect"], hint: "Laws like SARA aim to protect these species." },
  { prompt: "How can planting native trees help biodiversity?", right: "They provide food and shelter for local wildlife", wrong: ["They stop all rain", "They remove all insects"], hint: "Native species fit with the local ecosystem." },
  { prompt: "Why might warmer winters allow some pests to spread farther north?", right: "More of them survive the winter", wrong: ["They need snow to live", "They cannot move"], hint: "Cold winters can limit the number of pests." },
  { prompt: "Why is it important to keep pollinators such as bees safe?", right: "Many crops and wild plants need them to make seeds and fruit", wrong: ["They make the sky blue", "They stop all weeds"], hint: "Pollinators carry pollen from flower to flower." },
  { prompt: "A shop sells a plant that spreads easily. What could a gardener choose instead?", right: "A native plant suited to the region", wrong: ["Any plant from overseas", "A plant that is known to be invasive"], hint: "Native plants are less likely to become invasive." },
  { prompt: "Overfishing means…", right: "catching fish faster than the population can recover", wrong: ["catching fish only with nets", "never fishing"], hint: "Populations need time to rebuild." },
  { prompt: "Which is an example of a community working to protect biodiversity?", right: "Volunteers removing invasive plants from a park", wrong: ["Building a parking lot on a wetland", "Dumping garbage in a river"], hint: "People can restore habitats." },
  { prompt: "Many First Nations use land and water stewardship practices. What is a good way to learn about them?", right: "Listen to and learn from the local community's knowledge keepers", wrong: ["Assume all nations have the same practices", "Ignore local voices"], hint: "Respect each community's own knowledge.", hard: true },
];

// ---------- Static electricity (C2.1, C2.2) ----------

const STATIC: Item[] = [
  { prompt: "Static electricity is…", right: "a buildup of electric charge on an object", wrong: ["electricity that flows constantly through a wire", "the energy of the Sun"], hint: "Static means 'not moving'." },
  { prompt: "Which tiny particles move when objects become charged by rubbing?", right: "Electrons", wrong: ["Protons", "Atoms of gas"], hint: "Electrons are the charged particles that can move from one material to another." },
  { prompt: "An object that gains extra electrons becomes…", right: "negatively charged", wrong: ["positively charged", "neutral"], hint: "Electrons have a negative charge." },
  { prompt: "What happens when two objects with the same type of charge are brought close together?", right: "They repel each other", wrong: ["They attract each other", "Nothing ever happens"], hint: "Like charges repel." },
  { prompt: "What happens when a negatively charged object is brought near a positively charged one?", right: "They attract each other", wrong: ["They repel each other", "They both become neutral without moving"], hint: "Opposite charges attract." },
  { prompt: "You rub a balloon on your hair, and your hair stands up. Why?", right: "Each strand has the same charge, so they repel", wrong: ["The balloon sucks air in", "Your hair becomes magnetic"], hint: "Strands with the same charge push away from each other." },
  { prompt: "A charged balloon sticks to a wall. What explains this?", right: "The charged balloon attracts the neutral wall", wrong: ["The wall is sticky", "The balloon is lighter than the wall"], hint: "Charge in the wall shifts slightly, creating attraction." },
  { prompt: "Which is an example of static discharge?", right: "A spark when you touch a metal doorknob after walking on carpet", wrong: ["A flashlight shining", "A fan spinning"], hint: "The built-up charge jumps to the metal." },
  { prompt: "How is lightning related to static electricity?", right: "It is a huge static discharge between clouds and the ground", wrong: ["It is a current flowing in a circuit", "It is not electrical"], hint: "Charge builds up in clouds and then jumps." },
  { prompt: "Which is a safety rule when there is lightning?", right: "Go inside a building or a hard-topped vehicle", wrong: ["Stand under a tall tree", "Swim in the lake"], hint: "Stay away from open spaces, tall objects and water." },
  { prompt: "What is the main difference between current electricity and static electricity?", right: "Current electricity flows continuously, but static charge stays in one place until discharged", wrong: ["Static electricity is stronger", "Current electricity is not made of electrons"], hint: "Current needs a complete path to flow.", hard: true },
  { prompt: "A lightning rod on a tall building is useful because…", right: "it gives lightning a safe path to the ground", wrong: ["it attracts clouds", "it makes the building lighter"], hint: "The charge flows safely down a metal conductor.", hard: true },
  { prompt: "A student rubs a plastic rod with wool and the rod becomes negative. What happened to the wool?", right: "It lost electrons and became positively charged", wrong: ["It gained protons", "It became negative too"], hint: "Electrons moved from the wool to the rod.", hard: true },
  { prompt: "Clothes in the dryer stick together. Why?", right: "Rubbing against each other builds up opposite charges", wrong: ["The clothes melt together", "The dryer makes them magnetic"], hint: "Friction transfers electrons between materials.", hard: true },
  { prompt: "An electroscope's leaves move apart when it is charged. What does this show?", right: "The leaves have the same charge and repel", wrong: ["The leaves attract", "The leaves are heavier"], hint: "Same charges push apart.", hard: true },
  { prompt: "Which particles move when two materials are rubbed together to make static charge?", right: "Electrons", wrong: ["Neutrons only", "Molecules of water"], hint: "Electrons are the small charged particles that can move between materials." },
  { prompt: "A plastic comb rubbed on wool picks up small bits of paper. Why?", right: "The charged comb attracts the neutral paper", wrong: ["The comb is magnetic", "The paper is heavy"], hint: "A charged object can attract a neutral object." },
  { prompt: "A neutral object has…", right: "equal amounts of positive and negative charge", wrong: ["only positive charge", "only negative charge"], hint: "The charges balance out." },
  { prompt: "An object that loses electrons becomes…", right: "positively charged", wrong: ["negatively charged", "neutral"], hint: "Losing negative charges leaves more positive ones." },
  { prompt: "Why do static shocks happen more often on dry winter days?", right: "Dry air lets charge build up instead of leaking away", wrong: ["Winter air is magnetic", "Wool makes lightning"], hint: "Moist air helps charge escape." },
  { prompt: "A positively charged rod is brought near another positively charged rod. They will…", right: "repel", wrong: ["attract", "stay neutral"], hint: "Like charges repel." },
  { prompt: "Which of these is a conductor that lets charge move easily?", right: "Metal", wrong: ["Plastic", "Dry wood"], hint: "Metals let electrons move through them." },
  { prompt: "A car can build up static charge as it drives. Why do some fuel stations ask you to touch metal before pumping?", right: "To safely release static charge", wrong: ["To warm the pump", "To check the oil"], hint: "A spark near fuel could be dangerous." },
  { prompt: "How is static electricity different from current electricity?", right: "Static charge stays in one place until it is released", wrong: ["Static electricity needs a battery", "Static electricity always powers lights"], hint: "Current electricity flows continuously in a circuit." },
  { prompt: "A student charges a balloon and touches it to a wall. After a while it falls. Why?", right: "The charge slowly leaks away", wrong: ["The wall becomes a magnet", "The balloon gets heavier"], hint: "Charge escapes to the air or wall over time." },
  { prompt: "Which is an example of static electricity at work?", right: "A photocopier attracting toner to paper", wrong: ["A flashlight", "A battery-powered toy"], hint: "Static charge pulls small particles toward a charged surface.", hard: true },
  { prompt: "When a negatively charged rod touches a neutral metal ball, what happens?", right: "Some electrons move onto the ball", wrong: ["Protons move onto the ball", "The ball loses all its charge"], hint: "Electrons are the charges that move.", hard: true },
];

// ---------- Circuits (C2.3, C2.6, C2.7) ----------

const CIRCUITS: Item[] = [
  { prompt: "Which material is a good conductor of electric current?", right: "Copper", wrong: ["Rubber", "Glass"], hint: "Metals such as copper let current flow easily." },
  { prompt: "Which material is a good insulator?", right: "Plastic", wrong: ["Aluminum", "Iron"], hint: "Insulators do not let current flow easily." },
  { prompt: "Why are electrical wires covered in plastic?", right: "Plastic is an insulator, so it keeps people and parts safe", wrong: ["Plastic makes electricity stronger", "Plastic is a conductor"], hint: "The metal inside carries current. The coating protects." },
  { prompt: "What is the function of the battery in a circuit?", right: "To provide the energy that pushes current through the circuit", wrong: ["To control which wire is used", "To make light only"], hint: "It's the energy source." },
  { prompt: "What does a switch do?", right: "Opens or closes the circuit", wrong: ["Makes electricity", "Stores electrical energy"], hint: "An open switch breaks the path so current stops." },
  { prompt: "What does a light bulb do in a circuit?", right: "Changes electrical energy into light (and heat)", wrong: ["Stores electrical energy", "Makes electrons"], hint: "It is a load, which uses the energy." },
  { prompt: "A circuit where the switch is open is a…", right: "open circuit", wrong: ["closed circuit", "short circuit"], hint: "There is a gap, so current cannot flow." },
  { prompt: "For a bulb to light, the circuit must be…", right: "a complete, closed loop", wrong: ["open", "made only of insulators"], hint: "Current needs a continuous path." },
  { prompt: "In a series circuit, what happens if one bulb is unscrewed?", right: "All the bulbs go out", wrong: ["The other bulbs stay lit", "The others get brighter"], hint: "A series circuit has only one path." },
  { prompt: "In a parallel circuit, what happens if one bulb is unscrewed?", right: "The other bulbs stay lit", wrong: ["All the bulbs go out", "The other bulbs explode"], hint: "A parallel circuit has more than one path." },
  { prompt: "The outlets in a home are wired in…", right: "parallel", wrong: ["series", "no kind of circuit"], hint: "Each device can be switched on and off alone." },
  { prompt: "What does a fuse or circuit breaker do?", right: "Stops the current if it becomes too large", wrong: ["Makes the current larger", "Replaces the battery"], hint: "It helps prevent overheating and fires." },
  { prompt: "Why are two bulbs in a series circuit with one battery dimmer than one bulb?", right: "The energy is shared between the bulbs", wrong: ["Each bulb gets a new battery", "The wires become insulators"], hint: "The same energy source has to light both.", hard: true },
  { prompt: "Why is a parallel circuit often a good choice for home wiring?", right: "Each device works on its own and gets full voltage", wrong: ["It uses no wires", "It only works with one device"], hint: "Branches let devices operate independently.", hard: true },
  { prompt: "A string of old holiday lights goes completely dark when one bulb burns out. What type of circuit is it?", right: "Series", wrong: ["Parallel", "Open only"], hint: "One break stops the whole path.", hard: true },
  { prompt: "A short circuit is dangerous because…", right: "current takes an easy path and can overheat the wires", wrong: ["the battery becomes empty", "the bulb gets brighter safely"], hint: "Too much current can heat wires quickly.", hard: true },
];

const CIRCUITS_SORT: SortSet = {
  prompt: "Conductor or insulator? Tap an item, then tap its basket.",
  hint: "Conductors, such as most metals, let current flow. Insulators stop it.",
  bins: [
    { id: "conductor", label: "Conductor", emoji: "🔌" },
    { id: "insulator", label: "Insulator", emoji: "🧤" },
  ],
  items: [
    { label: "Copper wire", emoji: "🔌", bin: "conductor" },
    { label: "Steel nail", emoji: "📌", bin: "conductor" },
    { label: "Aluminum foil", emoji: "🪙", bin: "conductor" },
    { label: "Salty water", emoji: "💧", bin: "conductor" },
    { label: "Rubber glove", emoji: "🧤", bin: "insulator" },
    { label: "Plastic ruler", emoji: "📏", bin: "insulator" },
    { label: "Drinking glass", emoji: "🥃", bin: "insulator" },
    { label: "Dry wooden spoon", emoji: "🥄", bin: "insulator" },
  ],
};

// ---------- Electrical energy (C1, C2.4, C2.5) ----------

const ELECTRICAL: Item[] = [
  { prompt: "A solar cell changes light energy into…", right: "electrical energy", wrong: ["sound energy", "chemical energy"], hint: "Solar panels make electricity from sunlight." },
  { prompt: "A battery changes stored chemical energy into…", right: "electrical energy", wrong: ["light energy only", "sound energy only"], hint: "A chemical reaction inside makes current flow." },
  { prompt: "In a generator, what kind of energy is changed into electrical energy?", right: "Kinetic (motion) energy", wrong: ["Sound energy", "Nuclear energy only"], hint: "Spinning turbines drive generators." },
  { prompt: "A hydroelectric station changes the energy of moving water into…", right: "electrical energy", wrong: ["chemical energy", "heat energy only"], hint: "Water turns a turbine that turns a generator." },
  { prompt: "A toaster changes electrical energy mostly into…", right: "heat", wrong: ["sound", "chemical energy"], hint: "The wires get hot." },
  { prompt: "A fan changes electrical energy into…", right: "motion (kinetic energy)", wrong: ["only light", "only heat"], hint: "A motor spins the blades." },
  { prompt: "A speaker changes electrical energy into…", right: "sound", wrong: ["heat", "chemical energy"], hint: "It vibrates to make sound." },
  { prompt: "Which is a renewable way to generate electricity?", right: "Wind turbines", wrong: ["Burning coal", "Burning natural gas"], hint: "Wind will keep blowing." },
  { prompt: "Burning coal to make electricity can harm the environment because it…", right: "releases carbon dioxide and air pollutants", wrong: ["uses no fuel", "makes no heat"], hint: "Burning fossil fuels adds greenhouse gases." },
  { prompt: "Which choice reduces your personal use of electricity?", right: "Turning off lights and electronics when not in use", wrong: ["Leaving the TV on while you are out", "Running the dishwasher half-empty"], hint: "Using less electricity saves energy." },
  { prompt: "Which appliance feature helps save electricity?", right: "An energy-efficiency label", wrong: ["A bright colour", "A longer cord"], hint: "Energy-efficient appliances use less electricity for the same job." },
  { prompt: "Why might students run an 'energy audit' of their school?", right: "To find where electricity is wasted and plan ways to save", wrong: ["To make the lights brighter", "To sell electricity"], hint: "Measuring use helps people find ways to cut it.", hard: true },
  { prompt: "Some hydroelectric dams have flooded land that is part of First Nations, Métis or Inuit territory. What is one possible effect?", right: "Changes to hunting, fishing and travel on the land", wrong: ["No effects on the land or water", "Only effects in other countries"], hint: "Flooding can change land and water that communities use.", hard: true },
  { prompt: "Nuclear power plants do not burn fuel, but they have what challenge?", right: "Radioactive waste must be stored safely for a very long time", wrong: ["They produce acid rain by burning coal", "They cannot make any electricity"], hint: "Every energy source has tradeoffs.", hard: true },
  { prompt: "Wind and solar power make electricity without burning fuel. What is one challenge?", right: "They only produce power when the wind blows or the Sun shines", wrong: ["They create lots of carbon dioxide while running", "They use up the wind"], hint: "Storage or backup power is needed.", hard: true },
  { prompt: "Which is a way to advocate for responsible electricity use at your school?", right: "Make posters and lead a 'lights off' challenge", wrong: ["Ask for more lights", "Keep computers on overnight"], hint: "Action and awareness help a whole community.", hard: true },
  { prompt: "A light bulb changes electrical energy into…", right: "light and heat", wrong: ["chemical energy", "only sound"], hint: "A bulb glows and also gets warm." },
  { prompt: "A microwave oven changes electrical energy mostly into…", right: "heat in the food", wrong: ["sound", "stored chemical energy"], hint: "The food gets hot." },
  { prompt: "A wind turbine changes the energy of moving air into…", right: "electrical energy", wrong: ["chemical energy", "sound energy"], hint: "The wind spins the blades, which turn a generator." },
  { prompt: "Which is a non-renewable energy source?", right: "Natural gas", wrong: ["Sunlight", "Wind"], hint: "Fossil fuels take millions of years to form." },
  { prompt: "In Ontario, much electricity comes from which low-carbon source?", right: "Nuclear and hydroelectric stations", wrong: ["Coal only", "Candles"], hint: "Ontario closed its last coal plant in 2014." },
  { prompt: "What does a rechargeable battery do?", right: "It can store electrical energy and be used again", wrong: ["It makes energy from nothing", "It never wears out"], hint: "Charging puts energy back into the battery." },
  { prompt: "Why are LED bulbs more efficient than older bulbs?", right: "They turn more electrical energy into light and less into heat", wrong: ["They need more electricity", "They have no wires"], hint: "Less wasted energy means a lower bill." },
  { prompt: "Which action saves electricity at home?", right: "Washing laundry in cold water", wrong: ["Leaving a computer on all night", "Opening the fridge often"], hint: "Heating water uses a lot of energy." },
  { prompt: "A solar farm covers many hectares. What is one possible impact?", right: "It uses land that might be used for other things", wrong: ["It makes coal", "It produces no electricity"], hint: "Every energy source has costs and benefits." },
  { prompt: "What does a transformer help do on the power grid?", right: "Change voltage so electricity can be sent safely and used", wrong: ["Store the electricity forever", "Make the wires thicker"], hint: "Power lines carry high voltage over long distances.", hard: true },
];

const COAL_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the energy changes in a coal power plant in order.",
  hint: "Coal's chemical energy becomes heat, which makes steam that spins a turbine and generator.",
  items: [
    { id: "chem", label: "Chemical energy stored in coal", emoji: "🪨" },
    { id: "heat", label: "Thermal energy boils water into steam", emoji: "♨️" },
    { id: "motion", label: "Steam spins a turbine (kinetic energy)", emoji: "🌀" },
    { id: "elec", label: "A generator makes electrical energy", emoji: "⚡" },
  ],
};

// ---------- Flight (D1, D2) ----------

const FLIGHT: Item[] = [
  { prompt: "Which are the four forces of flight?", right: "Lift, weight, thrust and drag", wrong: ["Lift, mass, speed and wind", "Thrust, gravity, wind and rain"], hint: "Lift opposes weight and thrust opposes drag." },
  { prompt: "Which force pulls an aircraft toward the ground?", right: "Weight (gravity)", wrong: ["Lift", "Thrust"], hint: "Gravity acts on the mass of everything." },
  { prompt: "Which force moves an aircraft forward?", right: "Thrust", wrong: ["Drag", "Weight"], hint: "Engines or propellers provide thrust." },
  { prompt: "Which force is caused by air resistance and slows an aircraft?", right: "Drag", wrong: ["Lift", "Thrust"], hint: "Air pushes back against anything that moves through it." },
  { prompt: "What does lift do?", right: "It pushes the aircraft upward against its weight", wrong: ["It pushes the aircraft backward", "It pulls the aircraft down"], hint: "Wings are shaped to create lift." },
  { prompt: "An airplane flies level at a steady speed. What is true of the forces?", right: "They are balanced: lift equals weight and thrust equals drag", wrong: ["Thrust is always bigger than drag", "Lift is always smaller than weight"], hint: "Balanced forces mean no change in motion." },
  { prompt: "To take off, the airplane's lift must become…", right: "greater than its weight", wrong: ["smaller than its weight", "zero"], hint: "Unbalanced forces lift it off the ground." },
  { prompt: "Which property of air do wings use to create lift?", right: "Faster air above the wing means lower pressure above than below", wrong: ["Air has no mass", "Air cannot move"], hint: "Higher pressure below pushes the wing upward." },
  { prompt: "A hot air balloon rises because the hot air inside is…", right: "less dense than the cooler air around it", wrong: ["heavier than the surrounding air", "made of helium"], hint: "Warm air rises." },
  { prompt: "A parachute slows a falling person by increasing…", right: "drag", wrong: ["thrust", "lift"], hint: "A large surface catches more air." },
  { prompt: "A glider has no engine. Which force is missing?", right: "Thrust", wrong: ["Lift", "Weight"], hint: "It gets forward motion by gliding downward." },
  { prompt: "Which animal flies with wings made of skin stretched over long fingers?", right: "A bat", wrong: ["A robin", "A dragonfly"], hint: "Bats are the only mammals that truly fly." },
  { prompt: "Which adaptation helps a bird fly?", right: "Hollow bones and feathers", wrong: ["Thick scales", "Gills"], hint: "Light bodies and wing feathers help lift." },
  { prompt: "How can a pilot make an airplane slow down in the air?", right: "Reduce thrust or increase drag", wrong: ["Increase thrust a lot", "Reduce weight to zero"], hint: "The forces change the plane's motion.", hard: true },
  { prompt: "A paper airplane is folded with wider wings. What is the likely effect?", right: "More lift, but also more drag", wrong: ["No change", "Less lift and less weight"], hint: "Wing size changes both forces.", hard: true },
  { prompt: "A bird tilts its tail feathers to turn. This is similar to a plane using…", right: "its rudder or other control surfaces", wrong: ["its landing gear", "its fuel tank"], hint: "Control surfaces change the forces on the aircraft.", hard: true },
  { prompt: "Aviation has benefits, such as connecting remote communities. What is one environmental concern?", right: "Burning fuel produces greenhouse gases", wrong: ["Planes make the air colder", "Planes remove carbon dioxide"], hint: "Weigh benefits and costs from local and global perspectives.", hard: true },
  { prompt: "Which pair are the forces that must be balanced for a plane to stay at a steady height?", right: "Lift and weight", wrong: ["Thrust and weight", "Lift and drag"], hint: "Up and down forces must be equal.", hard: true },
];

const FLIGHT_SORT: SortSet = {
  prompt: "Balanced or unbalanced forces? Tap an item, then tap its basket.",
  hint: "Balanced forces keep an object's motion the same. Unbalanced forces change it.",
  bins: [
    { id: "balanced", label: "Balanced forces", emoji: "⚖️" },
    { id: "unbalanced", label: "Unbalanced forces", emoji: "💨" },
  ],
  items: [
    { label: "A plane cruising at a steady speed and height", emoji: "✈️", bin: "balanced" },
    { label: "A helicopter hovering in one spot", emoji: "🚁", bin: "balanced" },
    { label: "A parked airplane", emoji: "🛬", bin: "balanced" },
    { label: "A balloon floating at a steady height", emoji: "🎈", bin: "balanced" },
    { label: "A plane speeding up on the runway", emoji: "🛫", bin: "unbalanced" },
    { label: "A rocket lifting off", emoji: "🚀", bin: "unbalanced" },
    { label: "A skydiver speeding up as they fall", emoji: "🪂", bin: "unbalanced" },
    { label: "A plane starting to climb", emoji: "📈", bin: "unbalanced" },
  ],
};

// ---------- Earth, Moon and Sun (E2.4, E2.5) ----------

const SKY: Item[] = [
  { prompt: "Which body in space gives off its own light?", right: "The Sun", wrong: ["The Moon", "Earth"], hint: "Stars make their own light." },
  { prompt: "Why do we see the Moon?", right: "It reflects light from the Sun", wrong: ["It makes its own light", "It is lit by the planets"], hint: "The Moon is not a star." },
  { prompt: "What causes day and night on Earth?", right: "Earth rotating on its axis", wrong: ["Earth orbiting the Sun", "The Moon blocking the Sun"], hint: "One full rotation takes about 24 hours." },
  { prompt: "About how long does Earth take to orbit the Sun once?", right: "One year (about 365 days)", wrong: ["One day", "One month"], hint: "That's what we call a year." },
  { prompt: "What causes the seasons on Earth?", right: "Earth's tilted axis as it orbits the Sun", wrong: ["Earth being closer to the Sun in summer", "The Moon changing size"], hint: "Tilt changes how directly sunlight strikes each hemisphere." },
  { prompt: "When it is summer in Canada, which hemisphere is tilted toward the Sun?", right: "The Northern Hemisphere", wrong: ["The Southern Hemisphere", "Neither hemisphere"], hint: "More direct sunlight and longer days." },
  { prompt: "When it is summer in Canada, what season is it in Australia?", right: "Winter", wrong: ["Summer", "Spring"], hint: "The Southern Hemisphere is tilted away from the Sun." },
  { prompt: "What causes the phases of the Moon?", right: "We see different amounts of its sunlit half as it orbits Earth", wrong: ["Earth's shadow covers part of it", "Clouds hide parts of it"], hint: "Half of the Moon is always lit. Our view of it changes." },
  { prompt: "About how long does the Moon take to orbit Earth?", right: "About a month", wrong: ["About a day", "About a year"], hint: "That is where the word month comes from." },
  { prompt: "During a solar eclipse, which body is between the other two?", right: "The Moon", wrong: ["Earth", "The Sun"], hint: "The Moon blocks the Sun's light from reaching part of Earth." },
  { prompt: "During a lunar eclipse, which body is between the other two?", right: "Earth", wrong: ["The Moon", "Mars"], hint: "Earth's shadow falls on the Moon." },
  { prompt: "Tides are mainly caused by the pull of the…", right: "Moon's gravity", wrong: ["Sun's light", "Wind"], hint: "The Moon's gravity pulls on the oceans." },
  { prompt: "Which is not a luminous object?", right: "A planet", wrong: ["The Sun", "A star"], hint: "Planets reflect light." },
  { prompt: "At the equator, days and nights are about equal all year. Why?", right: "Its day length changes very little because of how Earth is tilted", wrong: ["It is closer to the Moon", "It is always cloudy"], hint: "Tilt matters most farther from the equator.", hard: true },
  { prompt: "In the Northern Hemisphere, when is the shortest day of the year?", right: "In December, when the hemisphere is tilted away from the Sun", wrong: ["In June", "In September"], hint: "Less direct sunlight and fewer daylight hours.", hard: true },
  { prompt: "A full Moon happens when…", right: "the whole sunlit side of the Moon faces Earth", wrong: ["Earth's shadow covers the Moon", "The Moon is between Earth and the Sun"], hint: "The Moon is on the far side of Earth from the Sun.", hard: true },
  { prompt: "Why do we always see the same side of the Moon?", right: "The Moon rotates once in the time it orbits Earth once", wrong: ["The Moon does not rotate at all", "Earth hides the other side"], hint: "Its rotation and orbit match.", hard: true },
  { prompt: "Which direction does Earth rotate?", right: "West to east", wrong: ["East to west", "North to south"], hint: "The Sun appears to rise in the east because Earth spins eastward." },
  { prompt: "How long does Earth take to rotate once on its axis?", right: "About 24 hours", wrong: ["About one year", "About one week"], hint: "That is one day." },
  { prompt: "A new Moon happens when…", right: "the sunlit side of the Moon faces away from Earth", wrong: ["Earth's shadow covers the Moon", "The Moon is closest to the Sun"], hint: "We see little or none of the lit half." },
  { prompt: "How many main phases does the Moon cycle through in about 29.5 days?", right: "Eight", wrong: ["Two", "Twelve"], hint: "From new Moon to full Moon and back, there are eight phases." },
  { prompt: "Which is correct?", right: "The Moon reflects sunlight", wrong: ["The Moon is a star", "The Moon makes light by burning"], hint: "Only luminous objects make their own light." },
  { prompt: "On the first day of summer in Canada, daylight hours are…", right: "the longest of the year", wrong: ["the shortest", "exactly 12 hours"], hint: "The Northern Hemisphere is tilted toward the Sun." },
  { prompt: "A solar eclipse can happen only during which Moon phase?", right: "New Moon", wrong: ["Full Moon", "Crescent Moon"], hint: "The Moon must be between Earth and the Sun." },
  { prompt: "Why are there two high tides and two low tides most days?", right: "The Moon's gravity pulls on Earth's oceans as Earth rotates", wrong: ["Wind blows twice a day", "The Sun turns off"], hint: "Ocean water bulges toward and away from the Moon." },
  { prompt: "Which of these takes the longest?", right: "Earth orbiting the Sun once", wrong: ["Earth rotating once", "The Moon orbiting Earth once"], hint: "One orbit of the Sun is a year." },
  { prompt: "Why does the Sun look much bigger and brighter than other stars?", right: "It is much closer to Earth", wrong: ["It is the only star", "It is a planet"], hint: "Other stars are very far away." },
];

const MOON_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put these Moon phases in order, starting from the New Moon.",
  hint: "After the New Moon, the lit part grows to a first quarter, then full, then shrinks to the last quarter.",
  items: [
    { id: "new", label: "New Moon", emoji: "🌑" },
    { id: "first", label: "First quarter", emoji: "🌓" },
    { id: "full", label: "Full Moon", emoji: "🌕" },
    { id: "last", label: "Last quarter", emoji: "🌗" },
  ],
};

// ---------- Weight, gravity and space technology (E1, E2.2, E2.3, E2.6) ----------

const SPACE: Item[] = [
  { prompt: "What is mass?", right: "The amount of matter in an object", wrong: ["How strongly gravity pulls on an object", "How big an object looks"], hint: "Mass is measured in kilograms." },
  { prompt: "What is weight?", right: "The force of gravity on an object", wrong: ["The amount of matter in an object", "The volume of an object"], hint: "Weight is a force measured in newtons." },
  { prompt: "Which unit measures weight (a force)?", right: "Newton", wrong: ["Kilogram", "Litre"], hint: "Mass is in kilograms. Force is in newtons." },
  { prompt: "An astronaut has a mass of 70 kg on Earth. What is her mass on the Moon?", right: "70 kg", wrong: ["About 12 kg", "About 420 kg"], hint: "Mass does not change with location." },
  { prompt: "Why does an astronaut weigh less on the Moon?", right: "The Moon's gravity is weaker than Earth's", wrong: ["The astronaut has less mass there", "The Moon has no gravity"], hint: "Weight depends on the strength of gravity." },
  { prompt: "On the Moon, a person weighs about how much compared with on Earth?", right: "About one-sixth", wrong: ["About six times more", "The same"], hint: "The Moon's gravity is about one-sixth of Earth's." },
  { prompt: "Which planet's gravity would make you weigh the most: Mars, Earth or Jupiter?", right: "Jupiter", wrong: ["Mars", "Earth"], hint: "Jupiter is far more massive, so its gravity is stronger." },
  { prompt: "Which tool lets astronomers see faint, faraway objects in space?", right: "A telescope", wrong: ["A thermometer", "A microscope"], hint: "Telescopes collect light." },
  { prompt: "What do satellites in orbit help scientists do on Earth?", right: "Observe weather, ice, oceans and climate change", wrong: ["Grow food", "Make rain"], hint: "They collect images and data from above." },
  { prompt: "Which Canadian-built robotic arm works on the International Space Station?", right: "Canadarm2", wrong: ["Hubble", "Voyager"], hint: "Canada contributed it to the station." },
  { prompt: "Marc Garneau was the first Canadian to...", right: "travel in space (1984)", wrong: ["land on the Moon", "find Pluto"], hint: "He flew on the space shuttle Challenger." },
  { prompt: "Astronauts exercise for hours each day in space. Why?", right: "Without gravity's pull, muscles and bones weaken", wrong: ["To stay cool", "Because they get bored"], hint: "Bodies need weight-bearing work to stay strong." },
  { prompt: "Astronauts on the International Space Station float. What is the best reason?", right: "They and the station are constantly falling around Earth", wrong: ["There is no gravity at that height", "The air pushes them up"], hint: "Gravity still acts there; they are in free fall.", hard: true },
  { prompt: "Why do astronauts need contact with family and time for rest and hobbies in space?", right: "Social and emotional well-being matters as much as physical health", wrong: ["It makes the rocket lighter", "It is only for fun"], hint: "Long trips are hard on mental health.", hard: true },
  { prompt: "How can space technology help us understand climate change?", right: "Satellites measure sea ice, temperature and forests over time", wrong: ["Rockets reduce clouds", "They stop storms"], hint: "Long-term data show patterns of change.", hard: true },
  { prompt: "Rocket launches bring jobs but also noise and pollution. Why might people have different views?", right: "They weigh benefits and costs differently", wrong: ["Everyone agrees", "Nobody is affected"], hint: "Perspectives depend on what people value.", hard: true },
  { prompt: "A rock has a mass of 6 kg on Earth. On the Moon it has…", right: "6 kg of mass but weighs less", wrong: ["1 kg of mass", "36 kg of mass"], hint: "Only the weight changes.", hard: true },
  { prompt: "Which planet has the strongest gravity in our solar system?", right: "Jupiter", wrong: ["Mercury", "Mars"], hint: "The more massive the planet, the stronger its gravity." },
  { prompt: "Your weight on Earth is 400 N. On a planet with weaker gravity, your weight would be…", right: "less than 400 N", wrong: ["more than 400 N", "exactly 400 N"], hint: "Weaker gravity means a smaller weight." },
  { prompt: "A bag of rice has a mass of 2 kg on Earth. On the Moon its mass is…", right: "2 kg", wrong: ["0 kg", "12 kg"], hint: "Mass stays the same wherever the object is." },
  { prompt: "What do astronauts need to bring to live in space?", right: "Air, water, food and a way to stay warm", wrong: ["Only a map", "Only a camera"], hint: "In space there is no air to breathe or water to drink." },
  { prompt: "Why do astronauts wear spacesuits outside a spacecraft?", right: "Space has no air, and it has extreme temperatures", wrong: ["To look bright", "To fly faster"], hint: "The suit gives air and protection." },
  { prompt: "The International Space Station is used for…", right: "research in microgravity", wrong: ["farming fish", "holding the Olympics"], hint: "Scientists do experiments there." },
  { prompt: "Roberta Bondar is known as…", right: "Canada's first woman astronaut in space", wrong: ["the first person on Mars", "the builder of Canadarm"], hint: "She flew on the space shuttle in 1992." },
  { prompt: "Chris Hadfield is a Canadian astronaut who…", right: "commanded the International Space Station", wrong: ["landed on Mars", "built the first satellite"], hint: "He has also shared space life with many people online." },
  { prompt: "A rover on Mars sends back pictures. What kind of technology is this?", right: "A robotic explorer", wrong: ["A cargo ship", "A weather balloon"], hint: "Robots can explore where people cannot yet go." },
  { prompt: "A satellite dish on Earth can receive signals from a satellite. Why do satellites help with phone and GPS service?", right: "They send signals across long distances", wrong: ["They dig tunnels", "They produce gravity"], hint: "Satellites relay signals from space." },
];

// ---------- STEM skills (A1–A3) ----------

const SKILLS6: Item[] = [
  { prompt: "A hypothesis is…", right: "a testable prediction about what will happen", wrong: ["a measurement", "a conclusion you already know"], hint: "It's an educated guess you can test." },
  { prompt: "In a fair test, which variables should stay the same (be controlled)?", right: "All except the one you are changing", wrong: ["All of them change together", "None of them"], hint: "Only change one thing." },
  { prompt: "A student tests how the height of a ramp affects how far a toy car rolls. What is the variable she changes?", right: "The height of the ramp", wrong: ["The distance the car rolls", "The colour of the car"], hint: "The changed variable is the independent variable." },
  { prompt: "In that ramp test, the distance the car rolls is the…", right: "measured (dependent) variable", wrong: ["changed (independent) variable", "controlled variable"], hint: "It depends on the ramp." },
  { prompt: "Why should a data table be neat and labelled with units?", right: "So others can read and check the data", wrong: ["To make it longer", "To hide mistakes"], hint: "Clear communication helps." },
  { prompt: "Which safety rule is correct in a science lab?", right: "Tie back long hair and wear goggles near heat", wrong: ["Taste samples to identify them", "Run to get supplies"], hint: "Always follow safety rules." },
  { prompt: "What are the criteria in a design challenge?", right: "What the design must do to succeed", wrong: ["The cost of the prototype", "Who wins"], hint: "Criteria describe success. Constraints describe limits." },
  { prompt: "A constraint in a design challenge is…", right: "a limit, such as only 20 craft sticks", wrong: ["a goal", "a prize"], hint: "Constraints limit materials, time or size." },
  { prompt: "An 'if … then … else' block in code is used to…", right: "make a decision based on a condition", wrong: ["repeat forever", "draw a picture"], hint: "A conditional chooses which steps to run." },
  { prompt: "What is a variable in a program?", right: "A named place to store a value", wrong: ["A kind of loop", "A mistake in the code"], hint: "The value can change." },
  { prompt: "A robot vacuum uses sensors and code. How do they help?", right: "Sensors gather data and the code decides how to move", wrong: ["The robot guesses randomly", "Humans steer from inside"], hint: "Sensors and code work together." },
  { prompt: "Which trade uses science of heat, pipes and pressure?", right: "A plumber or HVAC technician", wrong: ["A librarian", "A pianist"], hint: "Many skilled trades apply science." },
  { prompt: "Why is it important to include scientists from many communities?", right: "Different knowledge and experiences lead to new ideas", wrong: ["Only one group is needed", "Everyone knows the same things"], hint: "Contributions come from people everywhere.", hard: true },
  { prompt: "A student repeats an experiment 5 times and gets very different results each time. What could she do?", right: "Check for uncontrolled variables and measure more carefully", wrong: ["Pick her favourite result", "Stop the experiment"], hint: "Results should be consistent if the test is fair.", hard: true },
  { prompt: "Which would be the best way to show how 4 plants' heights compare on one day?", right: "A bar graph", wrong: ["A line graph", "A circle graph"], hint: "Bar graphs compare separate groups.", hard: true },
  { prompt: "A chatbot or AI tool gives an answer. What should a scientist do?", right: "Check the answer against reliable sources", wrong: ["Assume it's always correct", "Never use any tools"], hint: "Emerging technologies are useful, but results should be checked.", hard: true },
  { prompt: "A student wants to test if warm water dissolves sugar faster. What should she keep the same?", right: "The amount of sugar and water", wrong: ["The temperature of the water", "The result she hopes to see"], hint: "Only the temperature should change." },
  { prompt: "A student measures a plant's height every week. Which tool is best?", right: "A metric ruler", wrong: ["A clock", "A thermometer"], hint: "Length is measured with a ruler." },
  { prompt: "Why do scientists repeat a test several times?", right: "To check that the results are reliable", wrong: ["To make the test longer", "To pick the best result"], hint: "Similar results each time build trust." },
  { prompt: "A loop in code is used to…", right: "repeat a set of steps", wrong: ["store a value", "stop the program for good"], hint: "A loop saves writing the same steps again and again." },
  { prompt: "A design team builds a first model to test its idea. This is a…", right: "prototype", wrong: ["hypothesis", "constraint"], hint: "Prototypes can be improved after testing." },
  { prompt: "What should you do first if you spill something in the lab?", right: "Tell your teacher", wrong: ["Hide it", "Wipe it with your hand"], hint: "Report spills right away so they can be cleaned up safely." },
  { prompt: "Which graph is best for showing how temperature changes over a week?", right: "A line graph", wrong: ["A circle graph", "A pictograph with one picture"], hint: "Line graphs show change over time." },
  { prompt: "A student's results do not match her hypothesis. What does that mean?", right: "She learned something, and she can make a new hypothesis", wrong: ["She failed", "She must change the data"], hint: "A surprising result is still a result." },
  { prompt: "What is an input in a simple program?", right: "Information that the program receives", wrong: ["The final picture", "A bug"], hint: "Examples are a key press or a sensor reading." },
  { prompt: "Which career uses science to keep water clean for a city?", right: "A water treatment technician", wrong: ["A baker", "A pilot"], hint: "Many careers use science." },
  { prompt: "A bug in a program is…", right: "a mistake that stops the program from working as planned", wrong: ["a type of loop", "an insect in the computer"], hint: "Fixing bugs is called debugging.", hard: true },
  { prompt: "Which is the best reason to share your results and methods?", right: "Others can check and build on your work", wrong: ["So no one repeats your test", "So your results seem true"], hint: "Science grows when people share and review.", hard: true },
];

export const units: Unit[] = [
  {
    id: "classifying-life-6",
    title: "Sorting Living Things",
    emoji: "🦎",
    blurb: "Animals, plants, fungi and keys",
    standards: on("B2.1", "the characteristics of groups of organisms and a classification system"),
    parentNote: "Telling mammals, birds, reptiles, amphibians and fish apart, vertebrates from invertebrates, the kingdoms, and the levels of classification.",
    generate: ({ difficulty = 2 } = {}) => withOrder(CLASSIFY, CLASSIFY_ORDER, difficulty),
  },
  {
    id: "biodiversity-6",
    title: "Biodiversity",
    emoji: "🌳",
    blurb: "Variety makes life strong",
    standards: on("B1.1, B2.2–B2.5", "biodiversity within species, among species and among habitats, and how living things depend on one another"),
    parentNote: "Why a variety of life makes species and communities more resilient, how species depend on each other, and why biodiversity matters to people.",
    generate: ({ difficulty = 2 } = {}) => levelled(BIODIVERSITY, 8, difficulty),
  },
  {
    id: "biodiversity-risks-6",
    title: "Protecting Biodiversity",
    emoji: "🦫",
    blurb: "Invasive species and climate change",
    standards: on("B1.1, B1.2, B2.6–B2.8", "invasive species, climate change, agriculture and Indigenous crop diversity, and protecting biodiversity"),
    parentNote: "How invasive species, habitat loss and climate change reduce biodiversity, why farmers rely on crop diversity, and what people can do to protect it.",
    generate: ({ difficulty = 2 } = {}) => levelled(RISKS, 8, difficulty),
  },
  {
    id: "static-electricity-6",
    title: "Static Electricity",
    emoji: "⚡",
    blurb: "Charges that attract and repel",
    standards: on("C2.1, C2.2", "static electricity, and how it compares with current electricity"),
    parentNote: "How rubbing moves electrons, why like charges repel and opposite charges attract, static sparks and lightning, and how static differs from current electricity.",
    generate: ({ difficulty = 2 } = {}) => levelled(STATIC, 8, difficulty),
  },
  {
    id: "circuits-6",
    title: "Circuits",
    emoji: "🔌",
    blurb: "Conductors, series and parallel",
    standards: on("C2.3, C2.6, C2.7", "conductors and insulators, parts of a circuit, and series and parallel circuits"),
    parentNote: "Conductors and insulators, what each part of a circuit does, and how series and parallel circuits behave and where each is used.",
    generate: ({ difficulty = 2 } = {}) => withSort(CIRCUITS, CIRCUITS_SORT, difficulty),
  },
  {
    id: "electrical-energy-6",
    title: "Making and Using Electricity",
    emoji: "🔋",
    blurb: "Where it comes from, how to save it",
    standards: on("C1.1, C1.2, C2.4, C2.5", "how electrical energy is generated and used, its impacts, and using it responsibly"),
    parentNote: "How electrical energy is made from other energy forms and changed back, the impacts of different ways of making it in Canada, and ways to use less.",
    generate: ({ difficulty = 2 } = {}) => withOrder(ELECTRICAL, COAL_ORDER, difficulty),
  },
  {
    id: "flight-6",
    title: "Flight",
    emoji: "✈️",
    blurb: "Lift, weight, thrust and drag",
    standards: on("D1.1, D2.1–D2.5", "the four forces of flight, flying machines and organisms, and the impacts of aviation"),
    parentNote: "The four forces of flight and how balanced and unbalanced forces change motion, how air makes flight possible, how birds, bats and insects fly, and the impacts of aviation.",
    generate: ({ difficulty = 2 } = {}) => withSort(FLIGHT, FLIGHT_SORT, difficulty),
  },
  {
    id: "earth-moon-sun-6",
    title: "Earth, Moon and Sun",
    emoji: "🌙",
    blurb: "Days, seasons, phases and eclipses",
    standards: on("E2.4, E2.5", "light from the Sun and the Moon, and the effects of how Earth, the Moon and the Sun move"),
    parentNote: "Why we have day and night, seasons, Moon phases, eclipses and tides, and which bodies give off light and which reflect it.",
    generate: ({ difficulty = 2 } = {}) => withOrder(SKY, MOON_ORDER, difficulty),
  },
  {
    id: "weight-and-space-tech-6",
    title: "Gravity and Space Tech",
    emoji: "🚀",
    blurb: "Mass, weight and exploring space",
    standards: on("E1.1–E1.3, E2.2, E2.3, E2.6", "mass and weight, gravity, life in space and space technology"),
    parentNote: "The difference between mass and weight, how gravity changes weight, how astronauts meet their needs in space, and how space technology helps us understand Earth and space.",
    generate: ({ difficulty = 2 } = {}) => levelled(SPACE, 8, difficulty),
  },
  {
    id: "science-skills-6",
    title: "Think Like a Scientist",
    emoji: "🔬",
    blurb: "Fair tests, design and coding",
    standards: on("A1.1–A1.5, A2.1, A2.2, A3.1, A3.3", "investigation skills, design challenges, coding, careers and diverse contributions"),
    parentNote: "Planning a fair test, working safely, design criteria and constraints, simple coding ideas such as conditions and variables, and how science and technology connect to careers and communities.",
    generate: ({ difficulty = 2 } = {}) => levelled(SKILLS6, 8, difficulty),
  },
];
