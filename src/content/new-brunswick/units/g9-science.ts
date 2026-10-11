import { bankUnit, type Q } from "../own";

// Grade 9 science, New Brunswick: the solar system, ecosystems, and molecules and organisms. These units cover the
// solar system and ecosystems.

const SOLAR: Q[] = [
  ["What is at the centre of our solar system?", "the Sun", ["Earth", "the Moon", "Jupiter"], "The Sun is a star."],
  ["How many planets are in our solar system?", "eight", ["seven", "nine", "ten"], "Pluto is now classified as a dwarf planet."],
  ["Which planet is closest to the Sun?", "Mercury", ["Venus", "Earth", "Mars"], "It is the smallest planet."],
  ["Which planet is the largest?", "Jupiter", ["Saturn", "Earth", "Neptune"], "Jupiter is a gas giant."],
  ["Which planet is known for its bright rings?", "Saturn", ["Mars", "Venus", "Mercury"], "The rings are made of ice and rock."],
  ["Which planet is called the Red Planet?", "Mars", ["Venus", "Jupiter", "Mercury"], "Iron oxide gives it its red colour."],
  ["What are the four inner planets called?", "terrestrial (rocky) planets", ["gas giants", "dwarf planets", "ice moons"], "They are Mercury, Venus, Earth and Mars."],
  ["What are Jupiter and Saturn mostly made of?", "hydrogen and helium", ["rock and metal", "water only", "sand"], "They are gas giants."],
  ["Where is the asteroid belt?", "between Mars and Jupiter", ["beyond Neptune", "between Earth and Mars", "around the Sun"], "It has millions of rocky objects."],
  ["What is a comet?", "a ball of ice and dust that grows a tail near the Sun", ["a burning planet", "a small star", "a satellite"], "The tail points away from the Sun."],
  ["What causes day and night?", "Earth rotating on its axis", ["Earth orbiting the Sun", "the Moon blocking the Sun", "clouds"], "One rotation takes about 24 hours."],
  ["How long does it take Earth to orbit the Sun?", "about 365 days", ["about 30 days", "about 24 hours", "about 10 years"], "This is a year."],
  ["What causes the seasons?", "the tilt of Earth’s axis as it orbits the Sun", ["Earth being closer to the Sun in summer", "the Moon's phases", "changes in the Sun's brightness"], "Earth is tilted about 23.5°."],
  ["When it is summer in Canada, it is…", "winter in Australia", ["summer in Australia", "spring in Australia", "autumn in Australia"], "The hemispheres tilt opposite ways."],
  ["What causes the Moon’s phases?", "we see different amounts of its sunlit half as it orbits Earth", ["Earth's shadow on the Moon each night", "the Moon changes size", "clouds cover it"], "The Moon always has a lit half."],
  ["What is a lunar eclipse?", "Earth passes between the Sun and the Moon", ["the Moon passes between Earth and the Sun", "the Sun goes out", "the Moon explodes"], "The Moon moves into Earth's shadow."],
  ["What is a solar eclipse?", "the Moon passes between the Sun and Earth", ["Earth passes between the Sun and the Moon", "the Sun hides in clouds", "the Sun sets early"], "Never look at the Sun without proper eye protection."],
  ["What is a light-year?", "the distance light travels in one year", ["a year of daylight", "a speed", "the age of a star"], "It's about 9.5 trillion kilometres."],
  ["What is the Milky Way?", "the galaxy that contains our solar system", ["a planet", "a candy", "a comet"], "It has hundreds of billions of stars."],
  ["What holds the planets in orbit around the Sun?", "gravity", ["magnetism", "wind", "friction"], "The Sun's gravity keeps planets circling it."],
  ["What is a dwarf planet?", "a round object that orbits the Sun but has not cleared its path", ["a tiny star", "a large moon", "a comet"], "Pluto is one."],
  ["Which planet has the longest year?", "Neptune", ["Mercury", "Earth", "Mars"], "It takes about 165 Earth years to orbit.", true],
  ["Why is Venus hotter than Mercury even though it is farther from the Sun?", "its thick atmosphere traps heat", ["it is closer to Earth", "it spins faster", "it has more moons"], "This is a runaway greenhouse effect.", true],
  ["Which two planets spin on their sides or backwards compared with the others?", "Uranus and Venus", ["Earth and Mars", "Jupiter and Saturn", "Mercury and Neptune"], "Venus rotates backwards.", true],
  ["How do scientists study planets that are far away?", "with telescopes and space probes", ["by walking there", "by asking friends", "by looking at maps"], "Probes send data back to Earth."],
  ["What is the Sun’s energy source?", "nuclear fusion", ["burning coal", "electricity", "chemical batteries"], "Hydrogen fuses into helium.", true],
];

const ECO: Q[] = [
  ["What is an ecosystem?", "living things and their non-living surroundings interacting in an area", ["only the animals in a zoo", "a city", "a kind of weather"], "A pond is an ecosystem."],
  ["Which of these is a biotic (living) factor?", "a tree", ["sunlight", "water", "temperature"], "Biotic means living."],
  ["Which of these is an abiotic (non-living) factor?", "sunlight", ["a fox", "a fern", "a fungus"], "Abiotic factors include soil, water and temperature."],
  ["What are producers?", "organisms that make their own food, usually using sunlight", ["animals that eat plants", "animals that hunt", "organisms that break down waste"], "Plants and algae are producers."],
  ["What are consumers?", "organisms that eat other organisms", ["plants that make food", "rocks", "water"], "Consumers can be herbivores, carnivores or omnivores."],
  ["What are decomposers?", "organisms that break down dead material and return nutrients", ["animals that hunt", "plants that make food", "water"], "Fungi and bacteria are decomposers."],
  ["In a food chain, what do the arrows show?", "the flow of energy", ["who is bigger", "which one is faster", "who lives longer"], "Arrows point from food to the eater."],
  ["Which is a primary consumer?", "a deer", ["a wolf", "grass", "a fungus"], "Primary consumers eat producers."],
  ["Which is a secondary consumer?", "a fox that eats a mouse", ["a mouse that eats seeds", "grass", "a mushroom"], "Secondary consumers eat primary consumers."],
  ["Which statement about energy in a food chain is true?", "about 10% passes from one level to the next", ["100% passes", "no energy passes", "all energy is gained"], "Most energy is used or lost as heat."],
  ["Why are there fewer top predators than herbivores?", "there is less energy available at higher levels", ["predators are shy", "predators live in zoos", "there's no food for herbivores"], "Energy decreases at each level."],
  ["What is a food web?", "many connected food chains in an ecosystem", ["one food chain", "a type of spider web", "a set of plants"], "Webs show more complete relationships."],
  ["What is a niche?", "the role an organism plays in its ecosystem", ["its address", "its colour", "its size"], "It includes what it eats and where it lives."],
  ["What is biodiversity?", "the variety of living things in an area", ["the number of rocks", "the weather", "a kind of soil"], "High biodiversity makes ecosystems more stable."],
  ["What is an invasive species?", "a species that is not native and harms the ecosystem", ["a native plant", "a farm animal", "a pet"], "Invasive species can crowd out native ones."],
  ["Which of these is an invasive species harming forests in New Brunswick?", "emerald ash borer", ["moose", "beaver", "chickadee"], "It kills ash trees, which Wabanaki basket makers rely on.", true],
  ["What is a limiting factor?", "something that limits how many organisms can live in an ecosystem", ["a rule", "a fence", "a map"], "Food, water, space and shelter can be limiting."],
  ["What is carrying capacity?", "the largest population an ecosystem can support", ["the weight a truck can carry", "the size of an animal", "the number of seeds"], "It depends on resources."],
  ["In the carbon cycle, plants take in carbon dioxide during…", "photosynthesis", ["respiration only", "decomposition", "evaporation"], "Plants use carbon dioxide and light to make sugar."],
  ["Which process releases carbon dioxide?", "respiration and burning fuel", ["photosynthesis", "planting trees", "condensation"], "Living things and engines give off carbon dioxide."],
  ["What is succession?", "gradual change in the species in an area over time", ["a sudden flood", "the end of a season", "a food chain"], "A burned forest slowly regrows."],
  ["What is a keystone species?", "a species with a big effect on its ecosystem", ["the biggest animal", "the oldest plant", "a pet"], "Beavers change wetlands and streams.", true],
  ["How do beavers change ecosystems?", "their dams create ponds and wetlands", ["they remove all trees", "they destroy rivers forever", "they have no effect"], "Many species benefit from beaver ponds.", true],
  ["Why are the mudflats of the Bay of Fundy important?", "migrating shorebirds feed there on tiny shrimp-like animals", ["they have no life", "they are deserts", "they are only used by people"], "Hundreds of thousands of sandpipers stop there each year.", true],
  ["How does human activity affect ecosystems?", "by changing habitat, adding pollution and using resources", ["it never affects ecosystems", "only makes them bigger", "only helps them"], "People can also restore ecosystems."],
  ["Which action helps restore an ecosystem?", "planting native species and protecting wetlands", ["draining all wetlands", "dumping waste", "introducing invasive species"], "Restoration helps wildlife return."],
];

export const solarSystem = bankUnit({
  id: "nb-solar-system-9",
  title: "Our Solar System",
  emoji: "🪐",
  blurb: "Planets, the Moon, seasons and eclipses.",
  parentNote:
    "Practises the solar system, Earth's motions, seasons, Moon phases and eclipses. It follows the Grade 9 science skill descriptors on the solar system in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Sensemaking", "explanations about the solar system based on evidence from inquiry"],
  items: SOLAR,
});

export const ecosystems9 = bankUnit({
  id: "nb-ecosystems-9",
  title: "Ecosystems in Balance",
  emoji: "🌲",
  blurb: "Food webs, energy flow, cycles and human impact.",
  parentNote:
    "Practises ecosystems: food chains and webs, energy flow, population limits, cycles and how people affect and can restore them, with examples from New Brunswick. It follows the Grade 9 science skill descriptors on ecosystems in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Sensemaking, Learning and Living Sustainably: Responsible and Sustainable Application", "explanations about ecosystems and responsible, sustainable actions"],
  items: ECO,
});
