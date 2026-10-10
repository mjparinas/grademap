import type { SortSet } from "../bank";
import { numberChoice, pick, randInt } from "../random";
import type { Question, Unit, Visual } from "../types";
import { bankUnit, hq, order, q, type Item } from "./g3-4-kit";
import { on } from "./kit";

// Ontario Grade 4 Science and Technology (2022): Habitats and Communities, Light and Sound, Machines
// and Their Mechanisms, and Rocks, Minerals, and Geological Processes. First Nations, Métis and Inuit
// geological knowledges (E2.6) are not written here and need review with partners.

// ---------- Habitats and communities ----------

const IMPACT_SORT: SortSet = {
  prompt: "Does it help a habitat or harm it? Tap an item, then tap its basket.",
  hint: "Restoring wetlands and putting up nest boxes help. Pollution and clearing habitat harm.",
  bins: [
    { id: "help", label: "helps habitats", emoji: "💚" },
    { id: "harm", label: "harms habitats", emoji: "⚠️" },
  ],
  items: [
    { label: "restoring a wetland", emoji: "🦆", bin: "help" },
    { label: "planting native trees", emoji: "🌳", bin: "help" },
    { label: "building a wildlife crossing over a highway", emoji: "🌉", bin: "help" },
    { label: "putting up bird nest boxes", emoji: "🪺", bin: "help" },
    { label: "dumping chemicals into a river", emoji: "🛢️", bin: "harm" },
    { label: "draining a wetland for a parking lot", emoji: "🅿️", bin: "harm" },
    { label: "letting invasive plants spread", emoji: "🌿", bin: "harm" },
    { label: "clearing a forest and leaving it bare", emoji: "🪓", bin: "harm" },
  ],
};

const HABITATS: Item[] = [
  q("A habitat is…", "a place that gives living things food, water, shelter and space", ["a kind of food", "a type of weather", "a tool"], "Every plant and animal needs a habitat that meets its needs.", "🏞️"),
  q("A rotting log can be a habitat for…", "beetles, fungi and salamanders", ["whales", "camels", "sharks"], "Many small living things use a log for food and shelter.", "🪵"),
  q("A community in nature is…", "all the plants and animals living and interacting in one habitat", ["a single animal", "a pile of rocks", "all the water in a lake"], "A pond community includes frogs, fish, cattails and dragonflies.", "🦆"),
  q("Which is a necessity of life for a rabbit?", "food, water, shelter and space", ["a TV", "a computer", "a toy"], "All animals need these four things.", "🐇"),
  q("A wetland is a habitat that…", "is covered with shallow water for much of the year", ["is always dry", "is always frozen", "is under the ocean"], "Marshes and swamps are wetlands. They are home to many species.", "🦆"),
  q("Why can a forest support only so many deer?", "food, water, shelter and space are limited", ["deer don't eat anything", "forests are always empty", "the Moon decides"], "A habitat has limits.", "🦌"),
  q("Too many rabbits live in a meadow. What is likely to happen?", "the food runs out and some rabbits go hungry or leave", ["the meadow grows bigger", "the rabbits turn into deer", "nothing changes"], "When the population grows past what the habitat can support, there is not enough food for all.", "🐇"),
  q("A drought dries up a pond. What happens to the animals that live there?", "many have to move or may not survive", ["they grow gills", "they get more food", "nothing changes"], "Water is a necessity for pond life.", "🏜️"),
  q("A new invasive species takes over a lake. How might this change the community?", "native species may have less food and space", ["more native species will arrive", "the lake will disappear", "the lake will get warmer"], "Invasive species compete with native species.", "🐟"),
  q("Monarch caterpillars only eat milkweed. If milkweed disappears, what happens to monarchs?", "they lose their food and numbers fall", ["they eat grass instead", "they grow wings", "nothing changes"], "When a species loses what it depends on, it can disappear too.", "🦋"),
  q("What can people do to help monarch butterflies?", "plant milkweed and protect meadows", ["pave over meadows", "pick all the flowers", "spray more chemicals"], "Gardens with milkweed give caterpillars food.", "🌼"),
  q("A town wants to drain a wetland to build homes. A nature group wants to keep it. Why is this hard?", "people have different needs and viewpoints", ["wetlands are boring", "no one cares", "wetlands are not real"], "Different perspectives often have to be weighed.", "👥"),
  q("Which of these is a way people damage a habitat?", "clearing land for buildings", ["planting trees", "restoring a wetland", "building nest boxes"], "Building on natural land removes habitat.", "🏗️"),
  q("Wildlife overpasses over highways help animals by…", "letting them cross safely", ["making cars faster", "making roads wider", "hiding the animals"], "Roads can split a habitat in two.", "🌉"),
  hq("Why might one species disappearing hurt other species in its community?", "other species depend on it for food or shelter", ["nothing depends on any species", "every species disappears together", "the habitat grows"], "Everything in a community is connected.", "🔗"),
  hq("Which action would best prevent a species from disappearing?", "protecting its habitat", ["building over the habitat", "polluting the water", "cutting down more trees"], "Species need habitats to survive.", "🛡️"),
  hq("The number of animals a habitat can support depends on…", "the amount of food, water, shelter and space", ["the day of the week", "the colour of the animals", "the number of people nearby"], "Habitat limits affect populations.", "⚖️"),
  hq("A beaver dam floods a meadow and creates a pond. How does this affect the community?", "some species lose habitat and others gain a new one", ["no species are affected", "every species gains", "every species loses"], "Changes can help some species and harm others.", "🦫"),
  hq("A conservation group wants to protect a wetland for birds. A farmer wants to use the land. This shows…", "different perspectives about land", ["that wetlands have no value", "only one view matters", "a map problem"], "Each side has reasons.", "👥"),
];

// ---------- Food webs ----------

const ROLE_SORT: SortSet = {
  prompt: "Is it a producer, a consumer or a decomposer? Tap an item, then tap its basket.",
  hint: "Producers make their own food from sunlight. Consumers eat other living things. Decomposers break down dead things.",
  bins: [
    { id: "producer", label: "producer", emoji: "🌿" },
    { id: "consumer", label: "consumer", emoji: "🦌" },
    { id: "decomposer", label: "decomposer", emoji: "🍄" },
  ],
  items: [
    { label: "grass", emoji: "🌾", bin: "producer" },
    { label: "maple tree", emoji: "🍁", bin: "producer" },
    { label: "pond algae", emoji: "🟢", bin: "producer" },
    { label: "deer", emoji: "🦌", bin: "consumer" },
    { label: "wolf", emoji: "🐺", bin: "consumer" },
    { label: "frog", emoji: "🐸", bin: "consumer" },
    { label: "mushroom", emoji: "🍄", bin: "decomposer" },
    { label: "bread mould", emoji: "🦠", bin: "decomposer" },
    { label: "bacteria", emoji: "🔬", bin: "decomposer" },
  ],
};

const DIET_SORT: SortSet = {
  prompt: "What does it eat? Tap an item, then tap its basket.",
  hint: "Herbivores eat plants. Carnivores eat animals. Omnivores eat both.",
  bins: [
    { id: "herb", label: "herbivore", emoji: "🌿" },
    { id: "carn", label: "carnivore", emoji: "🍖" },
    { id: "omni", label: "omnivore", emoji: "🍽️" },
  ],
  items: [
    { label: "moose", emoji: "🫎", bin: "herb" },
    { label: "rabbit", emoji: "🐇", bin: "herb" },
    { label: "beaver", emoji: "🦫", bin: "herb" },
    { label: "wolf", emoji: "🐺", bin: "carn" },
    { label: "great horned owl", emoji: "🦉", bin: "carn" },
    { label: "lynx", emoji: "🐈", bin: "carn" },
    { label: "black bear", emoji: "🐻", bin: "omni" },
    { label: "raccoon", emoji: "🦝", bin: "omni" },
    { label: "crow", emoji: "🐦‍⬛", bin: "omni" },
  ],
};

const CHAIN_A = order("Put the food chain in order. Start with the producer.", "A food chain starts with a producer. Each arrow shows energy moving to the animal that eats it.", [
  ["grass", "🌾"],
  ["grasshopper", "🦗"],
  ["frog", "🐸"],
  ["heron", "🦢"],
]);
const CHAIN_B = order("Put the food chain in order. Start with the producer.", "Start with the plant, then the animal that eats it, then the animals that eat that animal.", [
  ["maple leaves", "🍁"],
  ["caterpillar", "🐛"],
  ["chickadee", "🐦"],
  ["hawk", "🦅"],
]);
const CHAIN_C = order("Put the pond food chain in order. Start with the producer.", "Algae make food from sunlight. Small animals eat algae, and bigger animals eat them.", [
  ["algae", "🟢"],
  ["tadpole", "🐸"],
  ["dragonfly larva", "🪲"],
  ["fish", "🐟"],
]);

const WEBS: Item[] = [
  q("The first link in every food chain is a…", "producer", ["consumer", "decomposer", "predator"], "Producers are usually plants. They use energy from the Sun.", "🌿"),
  q("Which of these is a producer?", "a maple tree", ["a wolf", "a mushroom", "a frog"], "Plants make their own food using sunlight.", "🍁"),
  q("Which of these is a decomposer?", "a mushroom growing on a log", ["a deer", "a blade of grass", "a chickadee"], "Decomposers break down dead plants and animals.", "🍄"),
  q("What do decomposers do for the soil?", "return nutrients from dead things to it", ["take away all nutrients", "make rocks", "make rain"], "Nutrients get used again by plants.", "🪱"),
  q("A deer eats leaves and grass. A deer is a…", "herbivore", ["carnivore", "omnivore", "decomposer"], "Herbivores eat only plants.", "🦌"),
  q("A wolf eats deer and rabbits. A wolf is a…", "carnivore", ["herbivore", "producer", "decomposer"], "Carnivores eat only other animals.", "🐺"),
  q("A black bear eats berries, fish and insects. A bear is an…", "omnivore", ["herbivore", "carnivore", "producer"], "Omnivores eat both plants and animals.", "🐻"),
  q("In a food chain, the arrows show…", "which way the energy goes", ["which animal is faster", "which is bigger", "the colours"], "The arrow points from the food to the eater.", "➡️"),
  q("What is a food web?", "many food chains connected together", ["a spider's trap", "a type of weather", "a single food chain"], "Animals usually eat more than one thing, so chains link up.", "🕸️"),
  q("Why is a food web a better picture of nature than one food chain?", "most animals eat more than one kind of food", ["it is smaller", "it has fewer animals", "it is only for plants"], "Real communities have many links.", "🕸️"),
  q("An owl eats mice and snakes. If all the mice disappear, what might happen to the owls?", "they may have less food", ["they will eat more grass", "nothing at all", "they will grow bigger"], "Owls depend on their prey.", "🦉"),
  q("Where does a plant get the energy to make food?", "from the Sun", ["from the soil", "from the wind", "from the rain"], "Plants turn light energy into food.", "☀️"),
  q("A producer, like grass, is eaten by a grasshopper. The grasshopper is a…", "consumer", ["producer", "decomposer", "tree"], "Consumers eat other living things.", "🦗"),
  q("Which animal is an herbivore?", "a moose", ["a lynx", "a wolf", "a great horned owl"], "Moose eat plants, like twigs and water plants.", "🫎"),
  hq("The fish in a pond eat insects, and a heron eats the fish. If all the frogs disappear, what might also happen?", "insects that frogs eat may increase", ["the pond turns into a forest", "the heron grows wings", "algae stop growing"], "Everything in a web is connected.", "🐸"),
  hq("Why do decomposers matter to a food web?", "they recycle nutrients back to producers", ["they eat only rocks", "they are not part of the web", "they make the Sun shine"], "Without them, dead matter would pile up.", "♻️"),
  hq("A hawk eats a chickadee that ate a caterpillar. What is the hawk called?", "a top consumer in that chain", ["a producer", "a decomposer", "a seed"], "It is at the end of the chain.", "🦅"),
  hq("If a disease wipes out most of the grass in a meadow, which animals are affected first?", "the ones that eat the grass", ["only the animals that eat meat", "nobody", "only the decomposers"], "Producers are the base of the food web.", "🌾"),
  hq("A crow eats seeds, insects and small animals. Why is the crow's diet an advantage?", "it can find food in many places", ["it needs only one food", "it cannot eat plants", "it is a producer"], "Eating many foods helps survival.", "🐦‍⬛"),
];

// ---------- Adaptations ----------

const ADAPT_SORT: SortSet = {
  prompt: "Which place does the adaptation help in? Tap an item, then tap its basket.",
  hint: "Thick fur and blubber keep animals warm in cold places. Large ears and water-storing stems help in hot, dry places.",
  bins: [
    { id: "cold", label: "cold place", emoji: "❄️" },
    { id: "hot", label: "hot, dry place", emoji: "🏜️" },
  ],
  items: [
    { label: "thick fur coat", emoji: "🐻‍❄️", bin: "cold" },
    { label: "thick layer of blubber", emoji: "🦭", bin: "cold" },
    { label: "small rounded ears (arctic fox)", emoji: "🦊", bin: "cold" },
    { label: "white winter coat", emoji: "🐇", bin: "cold" },
    { label: "large ears to release heat (fennec fox)", emoji: "🦊", bin: "hot" },
    { label: "thick stem that stores water (cactus)", emoji: "🌵", bin: "hot" },
    { label: "shallow roots that soak up rare rain", emoji: "🌱", bin: "hot" },
    { label: "pale fur that reflects sunlight", emoji: "🐪", bin: "hot" },
  ],
};

const ADAPTATIONS: Item[] = [
  q("An adaptation is…", "a body part or feature that helps a living thing survive in its habitat", ["a type of habitat", "a plant's seed", "a kind of weather"], "Structural adaptations are parts of the body, like beaks and fur.", "🧬"),
  q("A beaver has a flat tail and webbed back feet. How do they help?", "they help it swim", ["they help it fly", "they help it climb trees", "they help it dig tunnels in the desert"], "A flat tail and webbed feet push water.", "🦫"),
  q("A woodpecker has a strong, sharp beak. How does this help it?", "it can peck into trees to find insects", ["it can swim", "it can run fast", "it can carry water"], "The beak is made to drill into wood.", "🐦"),
  q("A moose has long legs. How do they help in winter?", "it can walk through deep snow", ["it can fly", "it can swim in the ocean", "it can hide in a burrow"], "Long legs lift its body above the snow.", "🫎"),
  q("A snowshoe hare turns white in winter. Why does this help?", "it blends in with snow so predators can't see it", ["it makes the hare warmer than a fox", "it helps it swim", "it makes it faster"], "Blending in is called camouflage.", "🐇"),
  q("A snowshoe hare has big, furry back feet. How do they help?", "they work like snowshoes on deep snow", ["they help it dig underground", "they help it swim", "they keep it cool"], "Wide feet spread out the weight.", "🐇"),
  q("A loon has solid, heavy bones. How does this help it?", "it can dive under water for fish", ["it can fly higher", "it can stay on land", "it can hibernate"], "Heavy bones help it dive.", "🦆"),
  q("A great horned owl has big eyes and soft feathers. How do they help?", "it can see in the dark and fly quietly", ["it can swim", "it can dig", "it can glide on ice"], "Owls are night hunters.", "🦉"),
  q("A pitcher plant in an Ontario bog traps insects. Why?", "bog soil has few nutrients, so the plant gets some from insects", ["it likes the taste of sunlight", "it needs to cool down", "it has no leaves"], "The insects give it the nutrients the soil can't.", "🌿"),
  q("A cactus has spines instead of wide leaves. How do spines help?", "they lose less water and protect the plant", ["they catch more rain", "they make flowers", "they keep it cold"], "Spines are a plant's way to survive in the desert.", "🌵"),
  q("A water lily has wide, flat leaves that float. How does this help?", "they catch sunlight at the water's surface", ["they let the plant swim", "they keep the roots dry", "they sing"], "Floating leaves sit in the light.", "🪷"),
  q("A polar bear has thick fur and a layer of fat. This helps it stay…", "warm in the Arctic", ["cool in the desert", "dry in a forest", "hidden in a river"], "Cold places call for warm adaptations.", "🐻‍❄️"),
  q("A duck has webbed feet. They help it…", "paddle in water", ["climb trees", "dig in sand", "run on ice"], "Webbed feet are like paddles.", "🦆"),
  q("A porcupine has sharp quills. How do they help?", "they protect it from predators", ["they help it swim", "they help it fly", "they keep it cool"], "Predators learn to leave it alone.", "🦔"),
  hq("Why do many conifers like pine and spruce have thin needles and flexible branches?", "snow slides off and they lose less water", ["to attract more bees", "to make seeds heavier", "to hide from owls"], "Needles are waxy and branches bend without breaking.", "🌲"),
  hq("A fennec fox has huge ears. They help it by…", "releasing body heat in the desert", ["keeping it warm in snow", "helping it swim", "helping it fly"], "Big ears have lots of blood vessels that give off heat.", "🦊"),
  hq("Which adaptation would help an animal live in a cold place?", "a thick layer of fat", ["large ears", "thin skin", "a bare body"], "Fat acts like a blanket.", "🦭"),
  hq("A plant's roots spread out wide just under the soil in a desert. Why?", "to soak up water from a short rain", ["to hold up a tall trunk", "to find shade", "to catch insects"], "Shallow, wide roots catch rain quickly.", "🌵"),
];

// ---------- Light ----------

const SOURCE_SORT: SortSet = {
  prompt: "Does it make its own light or reflect light? Tap an item, then tap its basket.",
  hint: "The Sun, lamps and fireflies make their own light. The Moon, mirrors and books only reflect light from other sources.",
  bins: [
    { id: "emit", label: "makes its own light", emoji: "💡" },
    { id: "reflect", label: "reflects light", emoji: "🪞" },
  ],
  items: [
    { label: "the Sun", emoji: "☀️", bin: "emit" },
    { label: "a firefly", emoji: "✨", bin: "emit" },
    { label: "a lit lamp", emoji: "💡", bin: "emit" },
    { label: "a flashlight", emoji: "🔦", bin: "emit" },
    { label: "the Moon", emoji: "🌙", bin: "reflect" },
    { label: "a mirror", emoji: "🪞", bin: "reflect" },
    { label: "a bicycle reflector", emoji: "🚲", bin: "reflect" },
    { label: "a book", emoji: "📕", bin: "reflect" },
  ],
};

const MATERIAL_SORT: SortSet = {
  prompt: "How does light go through it? Tap an item, then tap its basket.",
  hint: "Transparent: you see clearly through. Translucent: light gets through but things look blurry. Opaque: no light gets through.",
  bins: [
    { id: "transparent", label: "transparent", emoji: "🔍" },
    { id: "translucent", label: "translucent", emoji: "🌫️" },
    { id: "opaque", label: "opaque", emoji: "🧱" },
  ],
  items: [
    { label: "clear window glass", emoji: "🪟", bin: "transparent" },
    { label: "clear plastic wrap", emoji: "🧻", bin: "transparent" },
    { label: "wax paper", emoji: "📄", bin: "translucent" },
    { label: "frosted glass", emoji: "🪟", bin: "translucent" },
    { label: "a wooden door", emoji: "🚪", bin: "opaque" },
    { label: "a metal pan", emoji: "🍳", bin: "opaque" },
  ],
};

const HEAT_SORT: SortSet = {
  prompt: "Does it give off a lot of heat with its light? Tap an item, then tap its basket.",
  hint: "The Sun, flames and old-style bulbs give off lots of heat. LEDs, glow sticks and fireflies give off light with very little heat.",
  bins: [
    { id: "hot", label: "light and lots of heat", emoji: "🔥" },
    { id: "cool", label: "light and little heat", emoji: "🧊" },
  ],
  items: [
    { label: "the Sun", emoji: "☀️", bin: "hot" },
    { label: "a campfire", emoji: "🔥", bin: "hot" },
    { label: "a candle flame", emoji: "🕯️", bin: "hot" },
    { label: "an old-style bulb", emoji: "💡", bin: "hot" },
    { label: "a firefly", emoji: "✨", bin: "cool" },
    { label: "a glow stick", emoji: "🟢", bin: "cool" },
    { label: "an LED bulb", emoji: "💡", bin: "cool" },
    { label: "a computer screen", emoji: "🖥️", bin: "cool" },
  ],
};

const HEAT_BARS = (b: number, w: number, f: number): Visual => ({
  type: "bars",
  title: "Temperature after 10 minutes in the Sun (°C)",
  bars: [
    { label: "black paper", value: b },
    { label: "white paper", value: w },
    { label: "foil", value: f },
  ],
});

const LIGHT: Item[] = [
  q("Which of these is a natural source of light?", "lightning", ["a lamp", "a TV", "a flashlight"], "Natural sources are not made by people.", "⚡"),
  q("Which of these is an artificial source of light?", "a flashlight", ["the Sun", "a firefly", "lightning"], "Artificial sources are made by people.", "🔦"),
  q("Why can we see the Moon?", "it reflects light from the Sun", ["it makes its own light", "it glows in the dark by itself", "it is on fire"], "The Moon does not make light. It bounces sunlight toward Earth.", "🌙"),
  q("Light travels…", "in a straight path", ["in zigzags only", "only around corners", "only in curves"], "That's why shadows have sharp edges.", "➡️"),
  q("A shadow forms when…", "an opaque object blocks light", ["light bends", "light disappears", "the Moon is full"], "Light cannot pass through an opaque object.", "🌑"),
  q("When are shadows the longest?", "when the Sun is low in the sky, in the morning or evening", ["at noon", "never", "only at midnight"], "A low Sun makes a long shadow.", "🌅"),
  q("What does a mirror do to light?", "reflects it", ["absorbs all of it", "makes it colder", "turns it into sound"], "A smooth, shiny surface reflects light.", "🪞"),
  q("A pencil in a glass of water looks bent. This happens because light…", "bends as it passes from water into air", ["gets absorbed", "is made by the pencil", "stops moving"], "Light bending as it moves between materials is called refraction.", "✏️"),
  q("What is it called when light bends as it goes from one material to another?", "refraction", ["reflection", "absorption", "evaporation"], "Lenses use refraction.", "🔍"),
  q("A black T-shirt gets hotter in the sun than a white one. Why?", "black absorbs more light energy", ["black reflects more light", "white absorbs more light", "black makes light"], "Dark colours absorb more light.", "👕"),
  q("What colour of clothing would keep you coolest in the sun?", "white", ["black", "dark blue", "dark brown"], "White reflects most of the light.", "👕"),
  q("Rainbows form when sunlight is bent and split by…", "raindrops", ["clouds only", "mirrors", "snowflakes only"], "Light separates into colours as it passes through water drops.", "🌈"),
  q("You see an object when light from it…", "enters your eyes", ["leaves your eyes", "is turned off", "is absorbed by the floor"], "Eyes sense light.", "👁️"),
  q("What do glasses and telescopes use to help us see better?", "lenses", ["magnets", "batteries only", "sound"], "Lenses bend light.", "🔭"),
  q("Too many outdoor lights at night can confuse…", "migrating birds", ["fish in deep oceans", "polar bears", "worms"], "Some cities turn off lights during bird migration.", "🐦"),
  hq("Which light source gives off light but very little heat?", "a glow stick", ["a campfire", "the Sun", "a candle"], "A glow stick makes light with a chemical change, not by burning.", "🟢"),
  hq("Frosted glass lets light through but you can't see clearly. It is…", "translucent", ["transparent", "opaque", "reflective"], "Translucent materials scatter light.", "🪟"),
  hq("Which surface absorbed the most light energy?", "black paper", ["white paper", "foil"], "It got the warmest.", "🌡️", HEAT_BARS(36, 24, 22)),
  hq("Which surface reflected the most light?", "foil", ["black paper", "white paper"], "It stayed the coolest.", "🌡️", HEAT_BARS(35, 25, 21)),
  hq("Light travels in a straight path. How does this explain why you can't see around a corner?", "light from behind the corner cannot bend to reach you", ["light stops at corners", "corners make light", "light turns green"], "You need light to travel straight to your eye.", "🧱"),
];

// ---------- Sound ----------

const PITCH_SORT: SortSet = {
  prompt: "Is the sound high or low in pitch? Tap an item, then tap its basket.",
  hint: "Small, short, tight things vibrate fast and make a high pitch. Big, long, loose things vibrate slowly and make a low pitch.",
  bins: [
    { id: "high", label: "high pitch", emoji: "🔼" },
    { id: "low", label: "low pitch", emoji: "🔽" },
  ],
  items: [
    { label: "a whistle", emoji: "🪈", bin: "high" },
    { label: "a bird chirp", emoji: "🐦", bin: "high" },
    { label: "a mosquito buzz", emoji: "🦟", bin: "high" },
    { label: "a piccolo", emoji: "🎶", bin: "high" },
    { label: "a tuba", emoji: "🎺", bin: "low" },
    { label: "a bass drum", emoji: "🥁", bin: "low" },
    { label: "thunder", emoji: "⛈️", bin: "low" },
    { label: "a bear's growl", emoji: "🐻", bin: "low" },
  ],
};

const ABSORB_SORT: SortSet = {
  prompt: "Does it absorb sound or reflect it? Tap an item, then tap its basket.",
  hint: "Soft things like carpet and curtains soak up sound. Hard, smooth things like tile and glass bounce it back.",
  bins: [
    { id: "absorb", label: "absorbs sound", emoji: "🧸" },
    { id: "reflect", label: "reflects sound", emoji: "📣" },
  ],
  items: [
    { label: "thick curtains", emoji: "🪟", bin: "absorb" },
    { label: "a carpet", emoji: "🟫", bin: "absorb" },
    { label: "foam panels", emoji: "🟦", bin: "absorb" },
    { label: "a pillow", emoji: "🛏️", bin: "absorb" },
    { label: "a tile floor", emoji: "⬜", bin: "reflect" },
    { label: "a brick wall", emoji: "🧱", bin: "reflect" },
    { label: "a window", emoji: "🪟", bin: "reflect" },
    { label: "a metal sheet", emoji: "🔩", bin: "reflect" },
  ],
};

const HEARING_ORDER = order("Put the steps of hearing in order.", "Sound waves enter the ear, the eardrum vibrates, tiny bones vibrate, and a nerve sends a message to the brain.", [
  ["sound waves enter your ear", "👂"],
  ["your eardrum vibrates", "🥁"],
  ["tiny bones in your ear vibrate", "🦴"],
  ["a nerve sends a message to your brain", "🧠"],
]);

const SOUND: Item[] = [
  q("What causes sound?", "vibrations", ["light", "magnets", "colours"], "When something vibrates (moves back and forth quickly), it makes sound.", "🎸"),
  q("When you pluck a guitar string, it…", "vibrates", ["glows", "melts", "freezes"], "The vibration makes the air vibrate too.", "🎸"),
  q("Sound travels through a medium as a…", "wave", ["beam of light", "magnet", "cloud"], "Sound waves travel through air, water and solids.", "🌊"),
  q("Which of these can sound travel through?", "air, water and solid materials", ["only air", "only a vacuum", "only empty space"], "Sound needs matter to travel through.", "🔊"),
  q("Why can't you hear sounds in outer space?", "there is no air for sound waves to travel through", ["space is too bright", "space is too cold to hear", "sound travels too fast"], "Space is mostly empty.", "🚀"),
  q("Sound travels fastest through which of these?", "a steel rail", ["air", "a vacuum"], "Sound travels faster through solids than through air.", "🚂"),
  q("A bigger vibration makes a…", "louder sound", ["quieter sound", "higher pitch only", "silent sound"], "Volume depends on how big the vibration is.", "🔊"),
  q("A shorter, tighter guitar string makes a…", "higher pitch", ["lower pitch", "quieter sound", "silent sound"], "Short, tight strings vibrate faster.", "🎸"),
  q("An echo is…", "sound that bounces off a surface and comes back", ["a very loud sound", "sound that stops", "a type of light"], "Hard surfaces reflect sound.", "🏔️"),
  q("Why do you see lightning before you hear thunder?", "light travels much faster than sound", ["thunder is made first", "lightning is quieter", "sound is faster than light"], "Light reaches you almost instantly.", "⛈️"),
  q("Bats find insects in the dark by listening for echoes. This is called…", "echolocation", ["refraction", "migration", "hibernation"], "They send out sounds and listen to the echoes.", "🦇"),
  q("A stethoscope helps a doctor…", "listen to sounds inside the body", ["see in the dark", "make things louder outside", "measure temperature"], "It carries sound from the body to the doctor's ears.", "🩺"),
  q("Why do concert halls hang soft curtains?", "to absorb sound and stop echoes", ["to reflect more sound", "to make the room hotter", "to hide the audience"], "Soft materials absorb sound.", "🎭"),
  q("Loud noises for a long time can…", "damage your hearing", ["make you taller", "help you see better", "make you stronger"], "Ear protection helps when it is loud.", "🎧"),
  q("Noise barriers along highways help people by…", "reducing the sound of traffic", ["making cars faster", "making the road shorter", "making the highway wider"], "They absorb and block sound.", "🛣️"),
  hq("Ship noise in the ocean can make it harder for whales to talk to each other. This is an effect of sound on…", "the environment", ["the weather", "light", "magnets"], "Sound can affect animals that use sound to communicate.", "🐋"),
  hq("A drum is hit softly, then hard. What changes?", "the volume", ["the pitch of every sound", "the colour", "the speed of sound in air"], "A harder hit makes a bigger vibration.", "🥁"),
  hq("Why do you hear your voice echo in an empty gym but not in a room full of furniture?", "hard, empty surfaces reflect sound, and soft things absorb it", ["sound turns into light in the gym", "furniture makes sound louder", "the gym is colder"], "Furniture absorbs sound.", "🏟️"),
  hq("Hearing aids help people by…", "making sounds easier to hear", ["making light brighter", "making sound travel in a vacuum", "changing colours"], "Technology can help people with hearing loss.", "🦻"),
  hq("A fire alarm uses a loud, high-pitched sound. Why?", "it is easy to notice and warns people of danger", ["it is quiet", "it makes the fire go out", "it is pretty"], "Sound is a useful warning signal.", "🚨"),
];

// ---------- Machines ----------

const MACHINE_SORT: SortSet = {
  prompt: "Which simple machine is it? Tap an item, then tap its basket.",
  hint: "A lever turns on a pivot. A wheel and axle spins. An inclined plane is a slope.",
  bins: [
    { id: "lever", label: "lever", emoji: "⚖️" },
    { id: "wheel", label: "wheel and axle", emoji: "🛞" },
    { id: "incline", label: "inclined plane (ramp)", emoji: "📐" },
  ],
  items: [
    { label: "seesaw", emoji: "⚖️", bin: "lever" },
    { label: "crowbar", emoji: "🔧", bin: "lever" },
    { label: "bottle opener", emoji: "🍾", bin: "lever" },
    { label: "steering wheel", emoji: "🛞", bin: "wheel" },
    { label: "doorknob", emoji: "🚪", bin: "wheel" },
    { label: "skateboard wheel", emoji: "🛹", bin: "wheel" },
    { label: "wheelchair ramp", emoji: "♿", bin: "incline" },
    { label: "playground slide", emoji: "🛝", bin: "incline" },
    { label: "loading ramp", emoji: "🚚", bin: "incline" },
  ],
};

const MACHINES: Item[] = [
  q("A machine is…", "a device that makes work easier", ["a kind of animal", "a type of weather", "a food"], "Machines help us push, pull, lift or move things.", "⚙️"),
  q("A ramp is an example of which simple machine?", "an inclined plane", ["a lever", "a pulley", "a gear"], "A ramp is a slope that helps you move things up.", "📐"),
  q("A seesaw is an example of which simple machine?", "a lever", ["a wheel and axle", "an inclined plane", "a screw"], "A seesaw turns on a pivot called a fulcrum.", "⚖️"),
  q("The fulcrum of a lever is…", "the point it pivots on", ["the heaviest part", "the load", "the handle you push"], "The fulcrum is the turning point.", "⚖️"),
  q("A flagpole uses a rope and wheel to lift a flag. This is a…", "pulley", ["gear", "wedge", "ramp"], "A pulley uses a wheel and a rope.", "🚩"),
  q("A doorknob is an example of a…", "wheel and axle", ["lever", "ramp", "wedge"], "The knob is the wheel and the shaft is the axle.", "🚪"),
  q("An axe splits wood. The blade is a…", "wedge", ["pulley", "lever", "gear"], "A wedge is two inclined planes joined.", "🪓"),
  q("Gears have…", "teeth that fit together", ["magnets", "mirrors", "springs"], "The teeth of gears mesh to pass motion.", "⚙️"),
  q("Why is it easier to move a heavy box up a ramp than lift it?", "a ramp lets you use less force over a longer path", ["a ramp makes the box lighter", "a ramp removes gravity", "a ramp uses magnets"], "You push for a longer distance with less force.", "📦"),
  q("Which of these is a machine used in daily life?", "a bicycle", ["a rock", "a cloud", "a puddle"], "Machines have parts that work together.", "🚲"),
  q("A can opener is a machine. Its job is to…", "cut open a can", ["bake bread", "make music", "water plants"], "A machine's purpose is what it was designed to do.", "🥫"),
  q("A wheelbarrow helps move a heavy load because it…", "has a wheel and a lever to share the weight", ["makes the load float", "makes the load lighter", "runs on batteries"], "It combines a wheel and a lever.", "🛒"),
  q("A bike path and a car lane are different ways to travel. Which has less impact on the environment?", "riding a bike", ["driving a car", "riding a bus", "all are the same"], "A bike uses no fuel.", "🚲"),
  hq("An elevator, a dishwasher and a washing machine have changed daily life by…", "saving people time and effort", ["making work harder", "making work disappear", "making meals bigger"], "Machines make work easier.", "🛗"),
  hq("An electric lawn mower and a gas lawn mower do the same job. Which usually makes less air pollution while running?", "the electric one", ["the gas one", "they are the same", "neither does anything"], "Gas engines burn fuel and release exhaust.", "🌱"),
  hq("A crowbar is a lever. Where is the fulcrum when you pry up a board?", "the point it rests on", ["the end you push", "the board", "the nail"], "The fulcrum is the pivot point.", "🔧"),
  hq("Mechanics, welders and electricians use machines and tools. These jobs are called…", "skilled trades", ["games", "seasons", "maps"], "Skilled trades use science and technology to solve real problems.", "🧰"),
  hq("Why do some machines have more than one simple machine in them?", "parts work together to do a bigger job", ["to look more complicated", "to be noisier", "to be slower"], "A bicycle has wheels, gears and levers.", "🚲"),
];

// ---------- Mechanisms ----------

function gearQuestion(): Question {
  const small = pick([8, 10, 12, 16]);
  const ratio = pick([2, 3]);
  const big = small * ratio;
  const turns = randInt(1, 4);
  if (pick([true, false])) {
    // small gear drives the big one
    return numberChoice(
      `A gear with ${small} teeth turns a gear with ${big} teeth. The small gear makes ${turns * ratio} full turns. How many turns does the big gear make?`,
      turns,
      `The big gear has ${ratio} times as many teeth, so it turns ${ratio} times slower. Divide ${turns * ratio} by ${ratio}.`,
      undefined,
      { min: 1, max: 14 },
    );
  }
  return numberChoice(
    `A gear with ${big} teeth turns a gear with ${small} teeth. The big gear makes ${turns} full turns. How many turns does the small gear make?`,
    turns * ratio,
    `The small gear has ${ratio} times fewer teeth, so it turns ${ratio} times as often. Multiply ${turns} by ${ratio}.`,
    undefined,
    { min: 1, max: 14 },
  );
}

const BIKE_ORDER = order("Put the steps of how a bicycle moves in order.", "Your legs turn the pedals, the pedals turn the chain, the chain turns the back wheel, and the bike moves.", [
  ["your legs push the pedals", "🦵"],
  ["the pedals turn the chain", "⛓️"],
  ["the chain turns the back wheel", "🛞"],
  ["the bicycle moves forward", "🚲"],
]);

const MOTION_SORT: SortSet = {
  prompt: "Is the motion rotary (spinning) or linear (in a straight line)? Tap an item, then tap its basket.",
  hint: "Rotary motion turns around a centre. Linear motion goes in a straight line.",
  bins: [
    { id: "rotary", label: "rotary (spinning)", emoji: "🔄" },
    { id: "linear", label: "linear (straight line)", emoji: "➡️" },
  ],
  items: [
    { label: "a spinning fan blade", emoji: "🌀", bin: "rotary" },
    { label: "a turning doorknob", emoji: "🚪", bin: "rotary" },
    { label: "a merry-go-round", emoji: "🎠", bin: "rotary" },
    { label: "a bicycle wheel", emoji: "🛞", bin: "rotary" },
    { label: "a drawer sliding open", emoji: "🗄️", bin: "linear" },
    { label: "an elevator going up", emoji: "🛗", bin: "linear" },
    { label: "a train on straight track", emoji: "🚆", bin: "linear" },
    { label: "a ball rolling straight down a hallway", emoji: "⚽", bin: "linear" },
  ],
};

const MECHANISMS: Item[] = [
  q("When two gears mesh, how do they turn?", "in opposite directions", ["in the same direction", "not at all", "up and down"], "Teeth push each other around.", "⚙️"),
  q("A small gear drives a big gear. The big gear turns…", "more slowly", ["faster", "at the same speed", "backward faster"], "The big gear has more teeth, so it takes longer to turn once.", "⚙️"),
  q("A big gear drives a small gear. The small gear turns…", "faster", ["more slowly", "not at all", "in the same direction"], "The small gear has fewer teeth, so it turns more times.", "⚙️"),
  q("A bicycle chain connects the pedals to the…", "back wheel", ["handlebars", "seat", "front brake"], "The chain passes the turning motion along.", "🚲"),
  q("A belt and pulleys turn a second wheel. The two wheels turn…", "in the same direction", ["in opposite directions", "not at all", "up and down"], "A belt carries the motion around both pulleys.", "🔄"),
  q("The motion of a swing going back and forth is…", "oscillating", ["rotary", "stationary", "random only"], "It swings back and forth.", "🎠"),
  q("A sewing machine needle going up and down is…", "reciprocating (back and forth) motion", ["rotary motion", "no motion", "rolling motion"], "It moves back and forth in a line.", "🧵"),
  q("A pulley on a flagpole changes the…", "direction of the force", ["colour of the flag", "weight of the flag", "wind"], "You pull down, but the flag goes up.", "🚩"),
  q("A lever with the fulcrum closer to the load makes it…", "easier to lift the load", ["harder to lift the load", "impossible to move", "heavier"], "The farther your hand is from the fulcrum, the less force you need.", "⚖️"),
  q("A longer wrench makes it easier to turn a bolt because…", "you apply the force farther from the turning point", ["it weighs more", "it is shinier", "bolts like long tools"], "A longer lever means less effort.", "🔧"),
  q("When you pedal a bike up a hill, why use a low gear?", "it takes less force to pedal, but you pedal more", ["it makes the bike heavier", "it makes the hill smaller", "it turns the bike backward"], "Low gears trade speed for force.", "🚲"),
  q("A crank turns a wheel and winds up a rope. This changes the motion from…", "turning to straight-line (pulling)", ["straight-line to turning", "up to down only", "nothing at all"], "A well crank turns, and the bucket moves in a line.", "🪣"),
  q("A cam is a shaped wheel that pushes on a rod as it spins. What does the rod do?", "moves up and down", ["spins in circles", "stays still", "flies away"], "A cam changes turning into up and down motion.", "🔁"),
  hq("A linkage joins levers so that moving one makes another move. What can linkages do?", "change the direction of motion", ["stop all motion", "make a machine disappear", "turn forces into light"], "Windshield wipers use linkages.", "🔗"),
  hq("A pulley system with two pulleys can make a load easier to lift. This changes the…", "force you need to use", ["weight of the load", "colour of the rope", "direction of gravity"], "More pulleys can mean less force.", "🏗️"),
  hq("A drill spins its bit, which moves forward into wood. The motion starts as…", "rotary", ["linear", "oscillating", "none"], "The motor makes rotary motion.", "🔩"),
  hq("Why do bicycle gears sometimes have different sizes?", "to change how much force and speed you get", ["to make noise", "to look better", "to make the bike heavier"], "Gear sizes change speed and force.", "🚲"),
  hq("A wheel with 10 teeth drives a wheel with 30 teeth. Compared to the driver, the driven wheel turns…", "three times slower", ["three times faster", "at the same speed", "twice as fast"], "It has three times as many teeth.", "⚙️"),
];

// ---------- Rocks and minerals ----------

const ROCK_SORT: SortSet = {
  prompt: "Which type of rock is it? Tap an item, then tap its basket.",
  hint: "Igneous rock forms from cooled melted rock. Sedimentary rock forms from layers pressed together. Metamorphic rock is changed by heat and pressure.",
  bins: [
    { id: "igneous", label: "igneous", emoji: "🌋" },
    { id: "sedimentary", label: "sedimentary", emoji: "🏖️" },
    { id: "metamorphic", label: "metamorphic", emoji: "🔥" },
  ],
  items: [
    { label: "granite", emoji: "🪨", bin: "igneous" },
    { label: "basalt", emoji: "🌋", bin: "igneous" },
    { label: "obsidian", emoji: "⚫", bin: "igneous" },
    { label: "pumice", emoji: "🫧", bin: "igneous" },
    { label: "sandstone", emoji: "🏖️", bin: "sedimentary" },
    { label: "limestone", emoji: "🐚", bin: "sedimentary" },
    { label: "shale", emoji: "📚", bin: "sedimentary" },
    { label: "conglomerate", emoji: "🪨", bin: "sedimentary" },
    { label: "marble", emoji: "🏛️", bin: "metamorphic" },
    { label: "slate", emoji: "📝", bin: "metamorphic" },
    { label: "gneiss", emoji: "🪨", bin: "metamorphic" },
    { label: "quartzite", emoji: "💎", bin: "metamorphic" },
  ],
};

const SEDIMENT_ORDER = order("Put the steps of making sedimentary rock in order.", "Rock is weathered, then carried away, dropped in layers, and finally pressed and cemented into rock.", [
  ["rocks are broken into pieces (weathering)", "🔨"],
  ["wind and water carry the pieces away (erosion)", "🌊"],
  ["pieces settle in layers at the bottom of a lake or sea", "🏞️"],
  ["layers are pressed and cemented into rock", "🪨"],
]);

const ROCKS: Item[] = [
  q("Igneous rocks form when…", "melted rock cools and hardens", ["layers of sand are pressed together", "a rock is changed by heat and pressure", "fossils are dug up"], "Igneous means 'fire-made'. Magma or lava cools.", "🌋"),
  q("Sedimentary rocks form when…", "layers of sediment are pressed together over a long time", ["lava cools quickly", "a rock melts", "a mountain is moved"], "Sediment is bits of rock, sand, mud and shells.", "🏖️"),
  q("Metamorphic rocks form when…", "heat and pressure change an existing rock", ["lava cools", "sand settles in water", "fossils form"], "Metamorphic means 'changed form'.", "🔥"),
  q("Granite is a rock made of minerals such as quartz and feldspar. It is…", "igneous", ["sedimentary", "metamorphic", "a fossil"], "Granite forms when magma cools slowly underground.", "🪨"),
  q("Which rock often contains fossils?", "sedimentary rock", ["igneous rock", "metamorphic rock", "lava"], "Plants and animals are buried in sediment, which can become rock.", "🦴"),
  q("Marble forms from limestone that is changed by heat and pressure. Marble is…", "metamorphic", ["igneous", "sedimentary", "a mineral"], "It has been changed from another rock.", "🏛️"),
  q("Obsidian looks like black glass. It forms when…", "lava cools very quickly", ["sand is pressed", "limestone melts", "a river dries"], "It's an igneous rock.", "⚫"),
  q("Pumice is full of holes and can float on water. It forms when…", "frothy lava cools", ["fossils are pressed", "marble melts", "sand is cemented"], "Gas bubbles in the lava leave holes behind.", "🫧"),
  q("A rock is made of…", "one or more minerals", ["only water", "only air", "only plants"], "A mineral is a solid, natural substance with a certain make-up.", "💎"),
  q("The softest mineral, talc, can be scratched by…", "a fingernail", ["nothing at all", "water", "a feather"], "A fingernail can scratch minerals that are soft.", "💅"),
  q("A mineral that can scratch glass is…", "harder than glass", ["softer than glass", "the same as glass", "made of air"], "Hardness is tested by scratching.", "🔬"),
  q("In the streak test, you rub a mineral on a white tile. What do you look at?", "the colour of the powder it leaves", ["how loud it is", "how heavy it is", "how warm it is"], "Streak is the colour of a mineral's powder.", "🧪"),
  q("A shiny surface on a mineral is called its…", "lustre", ["streak", "layer", "echo"], "Lustre describes how a mineral reflects light.", "✨"),
  q("Much of the Canadian Shield in northern Ontario is made of…", "very old igneous and metamorphic rock", ["new sedimentary mud", "ice", "sand dunes"], "The Shield has some of the oldest rock on Earth.", "🪨"),
  q("A rock has layers, feels gritty and has a seashell print in it. It is most likely…", "sedimentary", ["igneous", "metamorphic", "a mineral crystal"], "Layers and fossils are clues.", "🐚"),
  q("A rock has glassy black pieces and no layers. It is most likely…", "igneous", ["sedimentary", "metamorphic", "a fossil"], "Glassy rock formed from cooling lava.", "🌋"),
  hq("A rock has curved bands of crystals and looks squeezed. It is most likely…", "metamorphic", ["igneous", "sedimentary", "a mineral"], "Heat and pressure make bands.", "🔥"),
  hq("Marble starts as limestone. What changes it?", "heat and pressure deep in the Earth", ["rain", "wind", "a flood"], "It becomes metamorphic rock.", "🏛️"),
  hq("Why is colour not a reliable way to identify a mineral?", "the same mineral can come in different colours", ["minerals have no colour", "colours never change", "colour is the same as weight"], "Streak and hardness are better tests.", "🎨"),
  hq("The rock cycle shows that…", "rocks change from one type to another over a long time", ["rocks never change", "rocks appear overnight", "rocks come from animals"], "Heat, pressure, weathering and erosion all keep changing rocks.", "♻️"),
];

// ---------- Rocks, fossils and people ----------

const FOSSIL_ORDER = order("Put the steps of how a fossil forms in order.", "An organism dies and is buried in sediment. The sediment hardens, minerals replace the hard parts, and erosion can later reveal the fossil.", [
  ["a living thing dies", "🦴"],
  ["it is buried quickly in mud or sand", "🏖️"],
  ["layers pile up and harden into rock", "🪨"],
  ["minerals replace the hard parts", "💎"],
  ["erosion uncovers the fossil", "🌧️"],
]);

const USES_SORT: SortSet = {
  prompt: "Does it come from a rock or mineral? Tap an item, then tap its basket.",
  hint: "Salt, pencil lead (graphite), copper wire, gravel and concrete come from rocks and minerals. Wool, wood and cotton come from living things.",
  bins: [
    { id: "rock", label: "comes from rocks and minerals", emoji: "🪨" },
    { id: "living", label: "comes from living things", emoji: "🌿" },
  ],
  items: [
    { label: "table salt", emoji: "🧂", bin: "rock" },
    { label: "copper wire", emoji: "🔌", bin: "rock" },
    { label: "gravel on a road", emoji: "🛣️", bin: "rock" },
    { label: "pencil lead (graphite)", emoji: "✏️", bin: "rock" },
    { label: "a wool sweater", emoji: "🧶", bin: "living" },
    { label: "a wooden chair", emoji: "🪑", bin: "living" },
    { label: "a cotton shirt", emoji: "👕", bin: "living" },
    { label: "a paper book", emoji: "📚", bin: "living" },
  ],
};

const HISTORY: Item[] = [
  q("What is a fossil?", "the remains or imprint of a living thing from long ago, preserved in rock", ["a modern bone", "a kind of flower", "a type of metal"], "Fossils help us learn about life in the past.", "🦴"),
  q("Where are fossils most often found?", "in sedimentary rock", ["in lava", "in melted rock", "on the Moon"], "Sediment can bury and keep remains.", "🪨"),
  q("A seashell fossil is found on a mountain top. What does this suggest?", "the place was once covered by sea", ["shellfish climb mountains", "the shell fell from the sky", "someone left it there yesterday"], "Fossils can show how places changed over a long time.", "🐚"),
  q("In undisturbed layers of sedimentary rock, which layer is usually the oldest?", "the bottom layer", ["the top layer", "the middle layer", "all are the same age"], "Layers pile up, so older ones are lower.", "📚"),
  q("Ontario has large salt mines near Windsor and Goderich. Salt is a…", "mineral", ["plant", "animal", "fossil fuel"], "Salt is mined for food, roads and factories.", "🧂"),
  q("Sudbury, Ontario is known for mining which metal?", "nickel", ["silver", "aluminum", "ice"], "Nickel comes from rocks and minerals in the ground.", "⛏️"),
  q("Which everyday object is made using a mineral?", "a pencil with graphite", ["a wool sweater", "a paper book", "a wooden chair"], "Pencil lead is graphite, a soft mineral.", "✏️"),
  q("Roads are often built with…", "gravel and crushed stone", ["marshmallows", "feathers", "paper"], "Crushed rock is strong and cheap.", "🛣️"),
  q("A volcano erupts near a town. What can happen to people?", "homes can be damaged and ash can fall", ["it rains candy", "nothing at all", "the sky turns to ice"], "Geological processes can affect society.", "🌋"),
  q("Volcanic ash can also make the soil…", "richer in nutrients over time", ["poisonous forever", "pure sand", "invisible"], "Farms near volcanoes often have rich soil.", "🌱"),
  q("Buildings in earthquake zones are designed with flexible frames. Why?", "to sway instead of break", ["to look taller", "to float", "to stay hot"], "People can plan for geological events.", "🏢"),
  q("Mining can create jobs but can also…", "harm habitats and water if not managed carefully", ["make everything cleaner", "help animals", "remove all rocks"], "Mining has costs and benefits.", "⛏️"),
  q("After a mine closes, companies can plant trees and clean up the land. This is called…", "rehabilitation", ["erosion", "extinction", "refraction"], "Repairing damaged land helps the environment.", "🌲"),
  q("Why does recycling metal cans help the environment?", "it takes less energy than mining and making new metal", ["it makes more mines", "it uses more energy", "it hides the cans"], "Recycling aluminum takes much less energy than making new aluminum.", "♻️"),
  hq("Fossils tell scientists about…", "what lived long ago and what the environment was like", ["the price of food", "today's weather only", "next year's holidays"], "Fossils are clues to Earth's history.", "🔍"),
  hq("Why do scientists say the rock layers can be a 'record' of Earth's history?", "each layer holds clues about when and how it formed", ["they are all the same", "they have no information", "they are made by people"], "Layers and fossils tell a story.", "📖"),
  hq("An open-pit mine takes land away from a forest. A community wants the jobs, but others worry about wildlife. This shows…", "different perspectives", ["no one cares", "the rock cycle", "a food web"], "People can see the same issue in different ways.", "👥"),
  hq("Which of these has the greatest impact on the environment when made from new material?", "a metal can made from newly mined ore", ["a can made from recycled metal", "a reused bottle", "a refilled bottle"], "Mining and refining take energy and can harm land.", "⛏️"),
  hq("Why can a fossil not form if a dead animal is eaten and broken apart quickly?", "it needs to be buried quickly to be preserved", ["fossils never form from animals", "the sun makes fossils", "wind makes fossils"], "Quick burial protects remains.", "🦴"),
];

export const units: Unit[] = [
  {
    id: "habitats-4",
    title: "Habitats & Communities",
    emoji: "🦆",
    blurb: "Homes for living things and what limits them",
    standards: on("B1.1, B1.2, B2.1, B2.2, B2.7", "habitats and communities, what limits their size, and how people affect them"),
    parentNote: "Habitats as places that meet the needs of living things, communities of interacting species, why habitats have limits, how species depend on each other, and how human actions can help or harm.",
    generate: bankUnit(HABITATS, { sorts: [IMPACT_SORT] }),
  },
  {
    id: "food-webs-4",
    title: "Food Chains & Webs",
    emoji: "🕸️",
    blurb: "Producers, consumers and decomposers",
    standards: on("B2.3, B2.4, B2.5", "producers, consumers and decomposers, food chains and webs, and animal diets"),
    parentNote: "Producers, consumers and decomposers, herbivores, carnivores and omnivores, how energy moves along a food chain, and why a food web is a more complete picture.",
    generate: bankUnit(WEBS, { sorts: [ROLE_SORT, DIET_SORT], orders: [CHAIN_A, CHAIN_B, CHAIN_C] }),
  },
  {
    id: "adaptations-4",
    title: "Adaptations",
    emoji: "🦉",
    blurb: "How bodies help living things survive",
    standards: on("B2.6", "structural adaptations of plants and animals that help them survive in their habitats"),
    parentNote: "Features such as webbed feet, thick fur, camouflage, big ears and water-storing stems, and how each helps a plant or animal survive in a particular habitat.",
    generate: bankUnit(ADAPTATIONS, { sorts: [ADAPT_SORT] }),
  },
  {
    id: "light-4",
    title: "Light",
    emoji: "💡",
    blurb: "Sources, shadows, reflection and refraction",
    standards: on("C1.1, C1.2, C2.1–C2.3, C2.6–C2.8", "light sources, how light travels, reflects, is absorbed and bends, and how technology uses light"),
    parentNote: "Natural and artificial light, things that make light and things that reflect it, shadows, transparent, translucent and opaque materials, mirrors, refraction, and how light technology affects people and wildlife.",
    generate: bankUnit(LIGHT, { sorts: [SOURCE_SORT, MATERIAL_SORT, HEAT_SORT] }),
  },
  {
    id: "sound-4",
    title: "Sound",
    emoji: "🔊",
    blurb: "Vibrations, pitch, echoes and hearing",
    standards: on("C1.1, C1.2, C2.4, C2.5, C2.8", "how vibrations make sound waves that travel through a medium, and how technology uses sound"),
    parentNote: "Vibrations and sound waves, pitch and volume, how sound travels through different materials but not through empty space, echoes and absorbing sound, how we hear, and how noise and sound devices affect people and animals.",
    generate: bankUnit(SOUND, { sorts: [PITCH_SORT, ABSORB_SORT], orders: [HEARING_ORDER] }),
  },
  {
    id: "machines-4",
    title: "Machines in Our Lives",
    emoji: "🛠️",
    blurb: "Simple machines, their parts and their effects",
    standards: on("D1.1, D1.2, D2.1, D2.2", "machines and their parts, and how machines affect people and the environment"),
    parentNote: "Levers, wheels and axles, pulleys, gears, ramps and wedges, naming a mechanism's parts (such as the fulcrum), and comparing the effects of machines on daily life and the environment.",
    generate: bankUnit(MACHINES, { sorts: [MACHINE_SORT] }),
  },
  {
    id: "motion-4",
    title: "Gears, Levers & Motion",
    emoji: "⚙️",
    blurb: "How mechanisms change speed, force and direction",
    standards: on("D2.3, D2.4, D2.5", "how mechanisms transfer and change motion, speed, direction and force"),
    parentNote: "Rotary, linear and back-and-forth motion, how gears of different sizes change speed, how pulleys and levers change force and direction, and how a bicycle moves.",
    generate: bankUnit(MECHANISMS, { sorts: [MOTION_SORT], orders: [BIKE_ORDER], makers: [() => gearQuestion()] }),
  },
  {
    id: "rocks-4",
    title: "Rocks & Minerals",
    emoji: "🪨",
    blurb: "Igneous, sedimentary and metamorphic rock",
    standards: on("E2.1–E2.3", "the three kinds of rock and how they form, rock and mineral properties, and sorting by tests"),
    parentNote: "How igneous, sedimentary and metamorphic rocks form, the rock cycle, and testing minerals for hardness, streak and lustre. Many Ontario rocks, like those of the Canadian Shield, are igneous and metamorphic.",
    generate: bankUnit(ROCKS, { sorts: [ROCK_SORT], orders: [SEDIMENT_ORDER] }),
  },
  {
    id: "earth-history-4",
    title: "Fossils, Mining & Earth Processes",
    emoji: "🦴",
    blurb: "How fossils form and how people use the Earth",
    standards: on("E1.1, E1.2, E2.4, E2.5", "everyday uses of rocks and minerals, fossils, and how geological processes and mining affect people and the environment"),
    parentNote: "How fossils form and what they tell us, everyday uses of rocks and minerals, mining in Ontario (nickel at Sudbury, salt near Windsor and Goderich), recycling, and how earthquakes, volcanoes and mining affect people and the environment. First Nations, Métis and Inuit geological knowledge is not covered here.",
    generate: bankUnit(HISTORY, { sorts: [USES_SORT], orders: [FOSSIL_ORDER] }),
  },
];
