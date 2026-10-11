import { bankUnit, type Q } from "../own";

// Grade 3 science, New Brunswick: weather and climate, habitats, plants and animals of the local natural world.

const WEATHER: Q[] = [
  ["What is weather?", "what the air outside is like at a certain time and place", ["the average of 30 years", "a kind of map", "the name of a season"], "Weather can change from hour to hour."],
  ["What is climate?", "the usual weather of a place over many years", ["the weather right now", "a storm", "a kind of cloud"], "New Brunswick has cold, snowy winters and warm summers."],
  ["Which tool measures temperature?", "a thermometer", ["a rain gauge", "a wind vane", "a compass"], "Temperature is measured in degrees Celsius (°C) in Canada."],
  ["Which tool measures how much rain has fallen?", "a rain gauge", ["a thermometer", "a ruler", "a clock"], "A rain gauge collects rain in a tube with a scale."],
  ["Which tool shows the direction the wind is blowing from?", "a wind vane", ["a rain gauge", "a thermometer", "a stopwatch"], "A wind vane points into the wind."],
  ["A wind that blows from the north is called…", "a north wind", ["a south wind", "an east wind", "a west wind"], "Winds are named for where they come from."],
  ["At what temperature does water freeze?", "0 °C", ["10 °C", "50 °C", "100 °C"], "Water boils at 100 °C and freezes at 0 °C."],
  ["Which is the correct order of the four seasons that follow summer?", "autumn, winter, spring", ["winter, autumn, spring", "spring, winter, autumn", "autumn, spring, winter"], "Seasons repeat in the same order every year."],
  ["Which season usually has the most snow in New Brunswick?", "winter", ["summer", "spring", "autumn"], "Winter is the coldest season."],
  ["In which season do many trees in New Brunswick change colour and drop their leaves?", "autumn", ["spring", "summer", "winter"], "Maple leaves turn red and orange."],
  ["What is precipitation?", "water that falls from clouds, such as rain or snow", ["fog on the ground", "wind", "a kind of cloud"], "Rain, snow, sleet and hail are precipitation."],
  ["Which is a kind of precipitation?", "snow", ["fog", "wind", "sunshine"], "Snowflakes are ice crystals."],
  ["When water turns into a gas and rises into the air, it is called…", "evaporation", ["condensation", "precipitation", "collection"], "Heat from the Sun makes water evaporate."],
  ["When water vapour cools and turns into tiny drops to make clouds, it is called…", "condensation", ["evaporation", "melting", "freezing"], "Condensation also makes dew on grass."],
  ["Which part of the water cycle gives us rain and snow?", "precipitation", ["evaporation", "condensation", "sunshine"], "The water then collects in rivers, lakes and oceans."],
  ["What gives energy to the water cycle?", "the Sun", ["the Moon", "the wind", "the ocean floor"], "The Sun warms the water so it evaporates."],
  ["Which type of cloud is low, grey and covers the whole sky?", "stratus", ["cirrus", "cumulus", "volcano"], "Stratus clouds can bring drizzle."],
  ["Which type of cloud is high, thin and wispy?", "cirrus", ["stratus", "cumulus", "nimbus"], "Cirrus clouds are made of ice crystals."],
  ["Which type of cloud looks puffy like cotton?", "cumulus", ["cirrus", "stratus", "fog"], "Cumulus clouds are common on fair days."],
  ["What is fog?", "a cloud close to the ground", ["a kind of wind", "a kind of snow", "a kind of thunder"], "Fog is common near the Bay of Fundy in summer."],
  ["Why is it often foggy near the Bay of Fundy?", "Warm air meets cold ocean water", ["The sun is too hot", "There are no clouds there", "The wind never blows"], "Cool water cools the moist air, and fog forms.", true],
  ["Why is it a good idea to check the weather before going outside?", "to know what to wear and stay safe", ["to see the future", "to change the weather", "to learn the date"], "Dress for the weather."],
  ["What should you do during a lightning storm?", "go indoors", ["stand under a tall tree", "go swimming", "fly a kite"], "Lightning is dangerous outdoors."],
  ["Freezing rain is dangerous because it…", "coats roads and trees with ice", ["makes the air hot", "makes the sun shine", "dries up puddles"], "Ice makes roads slippery and can break branches.", true],
  ["Which tool collects and measures wind speed?", "an anemometer", ["a rain gauge", "a thermometer", "a compass"], "Wind speed is often measured in kilometres per hour.", true],
  ["A weather forecast tells us…", "what the weather is likely to be", ["what the weather was last year", "what rocks are made of", "how deep a lake is"], "Forecasts use data from many instruments."],
  ["What is the best way to record weather over a week?", "write down the temperature and sky each day", ["guess at the end", "ask a friend to remember", "draw a random picture"], "Keeping data helps us find patterns.", true],
];

const HABITATS: Q[] = [
  ["What is a habitat?", "the place where a plant or animal lives and finds what it needs", ["a kind of food", "a weather report", "a type of rock"], "A pond, a forest and a meadow are habitats."],
  ["What do all animals need from their habitat?", "food, water, shelter and space", ["toys and games", "TV and music", "coats and boots"], "Without these, animals cannot survive."],
  ["Which of these is a habitat in New Brunswick?", "a forest", ["a desert", "a coral reef", "a rainforest"], "Most of New Brunswick is covered by forest."],
  ["Which animal lives in New Brunswick forests?", "moose", ["camel", "penguin", "kangaroo"], "Moose eat leaves, twigs and water plants."],
  ["Which animal builds dams on streams and rivers?", "beaver", ["moose", "chickadee", "puffin"], "Beavers cut trees with their strong teeth."],
  ["Which bird is New Brunswick’s provincial bird?", "the black-capped chickadee", ["the bald eagle", "the penguin", "the ostrich"], "It stays all winter."],
  ["Which seabird nests on Machias Seal Island and Grand Manan?", "the Atlantic puffin", ["the penguin", "the owl", "the crow"], "Puffins have colourful beaks in summer."],
  ["Which large mammal visits the Bay of Fundy each summer and is very rare?", "the North Atlantic right whale", ["the African elephant", "the polar bear", "the giraffe"], "Right whales need protection."],
  ["Which fish returns from the ocean to rivers in New Brunswick to lay eggs?", "Atlantic salmon", ["goldfish", "clownfish", "tuna"], "Salmon swim upstream to spawn."],
  ["What is a wetland?", "a habitat where land is covered by water for part of the year", ["a dry desert", "a bare mountain", "a concrete road"], "Marshes and bogs are wetlands."],
  ["Why are wetlands important?", "They clean water and give homes to many plants and animals", ["They are always dry", "They have no plants", "They are only for people"], "They also soak up flood water."],
  ["What do herbivores eat?", "plants", ["only meat", "rocks", "plastic"], "Deer and moose are herbivores."],
  ["What do carnivores eat?", "other animals", ["only plants", "only seeds", "only fruit"], "Foxes and owls are carnivores."],
  ["What do omnivores eat?", "both plants and animals", ["only plants", "only animals", "only seeds"], "Black bears are omnivores."],
  ["Which animal hibernates in winter in New Brunswick?", "the black bear", ["the chickadee", "the snowshoe hare", "the moose"], "Bears sleep in dens when food is scarce."],
  ["Why do some birds fly south in autumn?", "to find food and warmth", ["to find snow", "to see friends", "to visit museums"], "This trip is called migration."],
  ["What is camouflage?", "colours or patterns that help an animal blend in", ["a loud noise", "a kind of food", "a type of nest"], "The snowshoe hare turns white in winter."],
  ["Why does the snowshoe hare’s coat turn white in winter?", "to blend in with the snow", ["to stay warm in a lake", "to scare away bears", "to look fancy"], "White fur helps it hide from predators."],
  ["Which of these is a predator?", "a red fox", ["a rabbit", "a deer", "a snail"], "Predators hunt other animals for food."],
  ["Which of these is prey?", "a rabbit", ["a fox", "a hawk", "a bear"], "Prey are hunted by predators."],
  ["A simple food chain starts with…", "the Sun’s energy captured by plants", ["a bear", "a wolf", "an owl"], "Plants make food using sunlight."],
  ["Which food chain is in the right order?", "grass → rabbit → fox", ["fox → rabbit → grass", "rabbit → grass → fox", "grass → fox → rabbit"], "Arrows show the way energy moves."],
  ["What can people do to protect habitats?", "avoid littering and stay on trails", ["cut down all trees", "dump waste in rivers", "pick all the flowers"], "Small actions help wildlife."],
  ["What happens if a habitat is destroyed?", "animals lose their homes and food", ["animals build bigger homes", "nothing changes", "more animals appear"], "Habitat loss is a main reason animals become endangered.", true],
  ["What does endangered mean?", "at risk of disappearing from Earth", ["very large", "very fast", "very common"], "Many groups work to protect endangered animals.", true],
  ["Which animal in New Brunswick is a species at risk because its habitat is shrinking?", "the piping plover", ["the squirrel", "the crow", "the house sparrow"], "Piping plovers nest on beaches.", true],
];

const LIVING: Q[] = [
  ["What do plants need to grow?", "light, water, air and space", ["music and toys", "snow only", "salt only"], "Plants use sunlight to make food."],
  ["What part of a plant takes in water from the soil?", "the roots", ["the leaves", "the flower", "the fruit"], "Roots also hold the plant in place."],
  ["What part of a plant makes food using sunlight?", "the leaves", ["the roots", "the seeds", "the bark"], "Leaves take in light and air."],
  ["What part of a plant carries water up to the leaves?", "the stem", ["the seed", "the flower", "the fruit"], "The stem also holds the plant up."],
  ["What is the job of a flower?", "to help the plant make seeds", ["to hold the plant in soil", "to drink water", "to make shade"], "Insects visit flowers to carry pollen."],
  ["What does a seed grow into?", "a new plant", ["a rock", "an animal", "a cloud"], "Seeds need water and warmth to sprout."],
  ["Which tree is the provincial tree of New Brunswick?", "the balsam fir", ["the palm", "the baobab", "the cactus"], "The balsam fir stays green all year."],
  ["Which trees keep their needles in winter?", "evergreens", ["maples", "birches", "oaks"], "Spruce, fir and pine are evergreens."],
  ["Which tree’s sap is used to make maple syrup?", "the sugar maple", ["the spruce", "the apple tree", "the pine"], "Sap is collected in early spring."],
  ["What happens to the leaves of maple trees in autumn?", "they change colour and fall", ["they grow larger", "they stay green", "they turn to ice"], "Less sunlight changes how trees make food."],
  ["Which of these is an insect?", "a bee", ["a spider", "a snail", "a worm"], "Insects have six legs and three body parts."],
  ["How many legs does an insect have?", "six", ["four", "eight", "ten"], "Spiders have eight legs, so they are not insects."],
  ["What are animals that carry pollen from flower to flower called?", "pollinators", ["predators", "decomposers", "herbivores"], "Bees, butterflies and hummingbirds are pollinators."],
  ["Which animal group has fur or hair and feeds its babies milk?", "mammals", ["birds", "fish", "insects"], "Moose and bears are mammals."],
  ["Which animal group has feathers and lays eggs?", "birds", ["mammals", "fish", "reptiles"], "Chickadees are birds."],
  ["Which animals have gills and live in water?", "fish", ["birds", "mammals", "insects"], "Salmon are fish."],
  ["What is a life cycle?", "the stages a living thing goes through during its life", ["a kind of bicycle", "a type of cycle path", "a story"], "A butterfly goes from egg to caterpillar to chrysalis to adult."],
  ["What stage comes after an egg in a butterfly’s life?", "caterpillar", ["adult butterfly", "chrysalis", "seed"], "The caterpillar eats and grows."],
  ["What is an adaptation?", "a body part or behaviour that helps a living thing survive", ["a kind of food", "a game", "a house"], "A thick coat is an adaptation to cold."],
  ["How do trees and plants help animals?", "they give food, shelter and oxygen", ["they make noise", "they are not helpful", "they stop the wind only"], "Many animals live in trees."],
  ["What does the 3Rs slogan stand for?", "reduce, reuse, recycle", ["run, read, rest", "rake, rinse, repeat", "rock, roll, rest"], "The 3Rs help the environment."],
  ["Which action helps the environment?", "putting recyclables in the recycling bin", ["throwing litter in a river", "leaving taps running", "picking wild flowers"], "Recycling saves resources."],
  ["Why is it important to turn off lights when you leave a room?", "it saves energy", ["it makes the room colder", "it grows plants", "it makes the sun rise"], "Saving energy helps the environment.", true],
  ["What is a good way to care for a stream near your school?", "pick up garbage and keep soaps out of it", ["throw stones at fish", "dump paint", "leave bottles"], "Clean water is needed by living things.", true],
  ["How do people in New Brunswick use forests wisely?", "they plant new trees after cutting some", ["they cut all trees and leave", "they never use wood", "they burn all trees"], "Sustainable forestry replants and protects habitats.", true],
  ["Why is it good to plant native plants in a garden?", "they suit the climate and help local wildlife", ["they never need water", "they have no flowers", "they attract only pests"], "Native plants grow well where they belong.", true],
];

export const weatherClimate = bankUnit({
  id: "nb-weather-climate-3",
  title: "Weather & Seasons in New Brunswick",
  emoji: "🌦️",
  blurb: "Instruments, clouds, the water cycle and the seasons.",
  parentNote:
    "Practises how to observe and collect data about weather and climate, with the tools and the water cycle, using New Brunswick's seasons as examples. It follows the Grade 3 science skill descriptors on investigating the local natural world in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Investigation", "planning investigations and collecting data about weather and climate in the local natural world"],
  items: WEATHER,
});

export const habitatsNb = bankUnit({
  id: "nb-habitats-3",
  title: "Habitats of New Brunswick",
  emoji: "🦫",
  blurb: "Forests, wetlands, coasts and the animals that live there.",
  parentNote:
    "Practises habitats and the animals that live in them in New Brunswick, food chains, adaptations and protecting species at risk. It follows the Grade 3 science skill descriptors on habitats and animals in the New Brunswick curriculum.",
  standards: ["Scientific Literacy: Sensemaking", "explanations about habitats and animals based on evidence from inquiry into the local natural world"],
  items: HABITATS,
});

export const livingThings = bankUnit({
  id: "nb-living-things-3",
  title: "Plants, Animals & Caring for Nature",
  emoji: "🌱",
  blurb: "Plant parts, life cycles and everyday sustainable choices.",
  parentNote:
    "Practises plants and animals of the local natural world and responsible, sustainable actions such as reducing, reusing and recycling. It follows the Grade 3 science skill descriptor on applying scientific knowledge to sustainable practices in the New Brunswick curriculum.",
  standards: ["Learning & Living Sustainably: Responsible and Sustainable Application", "applying knowledge of plants and animals to sustainable practices in the local natural world"],
  items: LIVING,
});
