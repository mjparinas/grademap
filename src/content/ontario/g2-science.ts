import type { Unit } from "../types";
import { pick } from "../random";
import { on } from "./kit";
import { e, order, q, sorter, unitOf, type Item } from "./k-g2-kit";

// Ontario Grade 2 science and technology (2022): Life Systems (growth and changes in animals),
// Matter and Energy (properties of liquids and solids), Structures and Mechanisms (simple machines
// and movement) and Earth and Space Systems (air and water in the environment). BC's solids and
// liquids, push and pull, and water units are shared (see g2.ts). BC's life-cycles unit is not,
// because it names BC salmon; Ontario has its own animal life-cycle unit.

// ---------- Think Like a Scientist ----------

const SKILLS: Item[] = [
  q("A scientist tests one thing at a time. Why?", "So they know what caused the result", ["So it takes longer", "So the room is quiet"], "A fair test changes only one thing so we know what made the difference."),
  q("Which tool measures the temperature of water?", e("thermometer", "🌡️"), [e("ruler", "📏"), e("clock", "⏰")], "A thermometer measures how hot or cold something is."),
  q("Which tool would you use to measure how much juice is in a jug?", e("measuring cup", "🥛"), [e("thermometer", "🌡️"), e("ruler", "📏")], "A measuring cup measures liquids."),
  q("What should you do before starting an experiment?", "Read the safety rules", ["Taste the materials", "Run to the sink"], "Health and safety rules come first in every investigation."),
  q("What is an algorithm?", "A set of clear steps", ["A kind of plant", "A loud noise"], "An algorithm is the exact steps a computer or person follows.", { d: 2 }),
  q("A robot's code says: forward, forward, turn right, forward. How many times does it move forward?", "3", ["2", "4"], "Count each “forward”: two, then one more after the turn.", { d: 2 }),
  q("A robot must repeat “step, step” three times. How many steps in all?", "6", ["3", "5"], "Three times 2 is 6.", { d: 2 }),
  q("Your code has a mistake and the robot bumps the wall. What do you do?", "Find and fix the mistake", ["Delete everything", "Hope it works next time"], "Coders test, find bugs and fix them.", { emoji: "🤖" }),
  q("Which one is an emerging technology that changes how we live?", "A robot that vacuums the floor", ["A wooden spoon", "A rock"], "New technologies like robots and smart devices change daily life.", { d: 2 }),
  q("A map app uses coding to…", "find the best way to go", ["grow plants", "make rain"], "Code lets apps work out routes, times and distances.", { d: 2 }),
  q("An engineer builds a bridge model. It breaks. What next?", "Redesign it and test again", ["Say the idea is bad", "Hide the bridge"], "The engineering design process: plan, build, test and improve."),
  q("Which job uses science to solve a real problem?", "A doctor finding out why someone is sick", ["A cloud floating", "A coin falling"], "Science and technology help solve real-world problems.", { d: 2 }),
  q("How can you share what you found in an investigation?", "With a chart, drawing or short talk", ["Keep it secret", "Only whisper it to a rock"], "Scientists tell others in ways that suit the audience.", { d: 2 }),
  q("You are using a hot plate with a grown-up. What should you wear?", "safety goggles and tie back long hair", ["a scarf over your face", "flip-flops only"], "Protect your eyes, hair and clothes around heat.", { d: 3 }),
  q("Which is a good way to use science at home?", "Using a thermometer to check if soup is cool", ["Guessing", "Tasting it hot right away"], "Measuring helps us be safe and accurate.", { d: 3 }),
  q("Different people have invented tools. Why is it good to hear many ideas?", "Different people see different solutions", ["It is faster to copy one", "It is quieter"], "Contributions from many people help science and technology grow.", { d: 3 }),
];

// ---------- Animal Life Cycles ----------

const BUTTERFLY = order("Put the butterfly's life cycle in order.", "Egg, then a caterpillar (larva), then a chrysalis (pupa), then a butterfly.", [
  ["egg", "🥚"],
  ["caterpillar", "🐛"],
  ["chrysalis"],
  ["butterfly", "🦋"],
]);

const FROG = order("Put the frog's life cycle in order.", "Frog eggs hatch into tadpoles. Tadpoles grow legs and become frogs.", [
  ["frog eggs", "🫧"],
  ["tadpole"],
  ["tadpole with legs"],
  ["adult frog", "🐸"],
]);

const CHICKEN = order("Put the chicken's life cycle in order.", "A hen lays an egg. A chick hatches, grows up and becomes a hen or rooster.", [
  ["egg", "🥚"],
  ["chick", "🐣"],
  ["young chicken"],
  ["adult chicken", "🐔"],
]);

const LIFE: Item[] = [
  q("What does a caterpillar turn into?", e("a butterfly", "🦋"), [e("a bee", "🐝"), e("a spider", "🕷️")], "A caterpillar makes a chrysalis and becomes a butterfly."),
  q("What does a tadpole turn into?", e("a frog", "🐸"), [e("a fish", "🐟"), e("a snake", "🐍")], "Tadpoles grow legs and lose their tails."),
  q("A puppy grows up to be a…", e("dog", "🐕"), [e("cat", "🐈"), e("horse", "🐎")], "Mammals look like smaller versions of their parents."),
  q("Which animal hatches from an egg?", e("a robin", "🐦"), [e("a puppy", "🐶"), e("a calf", "🐮")], "Birds lay eggs. Most mammals are born alive."),
  q("Which animal is born alive and drinks its mother's milk?", e("a kitten", "🐱"), [e("a chick", "🐥"), "a tadpole"], "Mammals feed their young with milk."),
  q("A bird looks very different from its egg. What do we call the baby bird?", "a chick or hatchling", ["a larva", "a tadpole"], "Baby birds hatch from eggs and are often called chicks.", { d: 2 }),
  q("A butterfly's first stage is a…", "egg", ["chrysalis", "adult"], "A butterfly starts as an egg on a leaf.", { d: 2 }),
  q("Which animal changes its shape a lot as it grows up?", "a frog", ["a dog", "a rabbit"], "A frog begins as a tadpole in water and ends up a land-and-water animal.", { d: 2 }),
  q("A caterpillar eats leaves and a butterfly sips nectar. What is different?", "their food and body", ["nothing", "only their name"], "Animals can change in looks and behaviour as they grow.", { d: 2 }),
  q("Which stage of a butterfly cannot fly yet and rests inside a case?", "chrysalis (pupa)", ["egg", "adult"], "The chrysalis is the resting stage before the adult.", { d: 3 }),
  q("A ladybug starts as an egg, becomes a larva, then a pupa, then…", "an adult ladybug", ["a tadpole", "a chick"], "Insects like ladybugs also go through stages.", { emoji: "🐞", d: 3 }),
  q("Which two animals start life in water?", "a frog and a fish", ["a robin and a dog", "a cat and a horse"], "Frogs and most fish begin as eggs in water.", { d: 3 }),
  q("A baby mammal looks like its parents but smaller. Which one is that?", "a kitten", ["a tadpole", "a caterpillar"], "Some animals look like small adults. Others change a lot.", { d: 2 }),
];

// ---------- How Animals Move ----------

const MOVE: Item[] = [
  q("How does a fish move?", "It swims", ["It flies", "It hops"], "Fish use fins and tails to swim.", { emoji: "🐟" }),
  q("How does a bird usually move?", "It flies", ["It swims underground", "It slithers"], "Many birds fly with wings.", { emoji: "🐦" }),
  q("How does a snake move?", "It slithers", ["It hops", "It flies"], "A snake moves its long body in curves.", { emoji: "🐍" }),
  q("How does a frog move on land?", "It hops", ["It slithers", "It glides"], "Frogs use strong back legs to hop.", { emoji: "🐸" }),
  q("How does a snail move?", "It glides slowly on one foot", ["It gallops", "It flies"], "A snail slides on a muscle called a foot.", { emoji: "🐌" }),
  q("Which animal gallops?", e("a horse", "🐎"), [e("a snail", "🐌"), e("a fish", "🐟")], "Horses gallop on four legs."),
  q("Which animal walks on two legs?", e("a person", "🚶"), [e("a dog", "🐕"), e("a cat", "🐈")], "People and many birds walk on two legs.", { d: 2 }),
  q("Which animal swings from branch to branch?", e("a monkey", "🐒"), [e("a fish", "🐟"), e("a snail", "🐌")], "Monkeys climb and swing with arms and tails.", { d: 2 }),
  q("A worm moves by…", "wriggling", ["flying", "galloping"], "Worms stretch and squeeze their bodies to move.", { emoji: "🪱", d: 2 }),
  q("Which body part helps a duck swim?", "webbed feet", ["long ears", "sharp claws"], "Webbed feet push water like paddles.", { emoji: "🦆" }),
  q("A bat can…", "fly", ["gallop", "slither"], "A bat is a mammal with wings made of skin.", { emoji: "🦇", d: 2 }),
  q("An animal that has fins and a tail moves by…", "swimming", ["hopping", "climbing trees"], "Fins and tails push water to swim.", { d: 2 }),
  q("Which animals can both swim and walk?", "ducks and frogs", ["fish and whales", "worms only"], "Ducks and frogs move well in water and on land.", { d: 3 }),
  q("A caterpillar and a butterfly move in different ways. How?", "The caterpillar crawls and the butterfly flies", ["Both swim", "Both gallop"], "An animal can move in different ways at different stages of its life.", { d: 3 }),
];

const MOVE_SORT = sorter({
  prompt: "How does it move? Tap an animal, then its basket.",
  hint: "Think about where it moves and what body parts it uses.",
  bins: [
    { id: "swim", label: "Swims", emoji: "🌊" },
    { id: "fly", label: "Flies", emoji: "☁️" },
    { id: "crawl", label: "Crawls or slithers", emoji: "🐛" },
  ],
  items: [
    { label: "salmon", emoji: "🐟", bin: "swim" },
    { label: "dolphin", emoji: "🐬", bin: "swim" },
    { label: "eagle", emoji: "🦅", bin: "fly" },
    { label: "owl", emoji: "🦉", bin: "fly" },
    { label: "snake", emoji: "🐍", bin: "crawl" },
    { label: "caterpillar", emoji: "🐛", bin: "crawl" },
  ],
});

// ---------- Animal Adaptations ----------

const ADAPT: Item[] = [
  q("A polar bear has thick fur and fat. This helps it…", "stay warm in the cold", ["swim in a hot spring", "hide in a green forest"], "An adaptation is a body feature or behaviour that helps an animal survive.", { emoji: "🐻‍❄️" }),
  q("A rabbit has long ears. What does this help it do?", "hear danger", ["swim faster", "dig for fish"], "Long ears help a rabbit hear predators.", { emoji: "🐇" }),
  q("A duck's webbed feet help it…", "swim", ["climb trees", "dig tunnels"], "Webbed feet work like paddles.", { emoji: "🦆" }),
  q("An owl has big eyes. This helps it…", "see in the dark", ["hear underwater", "dig"], "Big eyes let in more light for night hunting.", { emoji: "🦉" }),
  q("A porcupine has sharp quills. They help it…", "stay safe from predators", ["fly", "swim"], "Quills are a defence.", { emoji: "🦔" }),
  q("A beaver has big front teeth. They help it…", "cut down trees", ["fly", "swim underground only"], "Beavers gnaw wood to build dams and lodges.", { emoji: "🦫" }),
  q("A tree frog is green and sits on a leaf. Why is it hard to see?", "Its colour matches the leaf", ["It is invisible", "It is very tiny"], "Camouflage is a colour or pattern that matches the surroundings.", { d: 2 }),
  q("A snowshoe hare turns white in winter. This is…", "camouflage in snow", ["a way to swim", "a way to climb"], "A white coat matches snow so predators cannot see it as easily.", { d: 2 }),
  q("Many bears sleep through much of the winter. This behaviour is called…", "hibernating", ["migrating", "hunting"], "Hibernating saves energy when food is hard to find.", { d: 2 }),
  q("Geese fly south in the fall. This behaviour is called…", "migrating", ["hibernating", "swimming"], "Migrating means moving to find better weather or food.", { d: 2 }),
  q("Which is a physical adaptation (a body part)?", "A bird's beak", ["A bird flying south", "A squirrel burying nuts"], "A physical adaptation is part of an animal's body. A behaviour is something an animal does.", { d: 2 }),
  q("Which is a behavioural adaptation (something an animal does)?", "A squirrel burying nuts", ["A moose's antlers", "A fish's scales"], "Hiding food for later is something an animal does.", { d: 2 }),
  q("Which of these does an animal keep its whole life (constant)?", "Its number of legs", ["Its baby fur", "Its egg shell"], "Some features stay the same and others change as an animal grows.", { d: 3 }),
  q("A cub grows from small to big. This is a feature that…", "changes", ["never changes", "is the same as a rabbit's"], "Size changes as animals grow. Many features such as the number of legs stay the same.", { d: 3 }),
  q("A moose has long legs. How could this help it live in a snowy forest?", "It can walk through deep snow", ["It can swim like a fish", "It can fly"], "Long legs help a moose step over snow and logs.", { d: 3 }),
];

// ---------- Animals and People ----------

const ANIMALS_PEOPLE: Item[] = [
  q("Bees visit flowers and help plants make seeds and fruit. This is a…", "positive impact", ["negative impact", "no impact"], "Bees carry pollen from flower to flower, which helps food crops grow.", { emoji: "🐝" }),
  q("Mosquito bites can make people itchy. This is a…", "negative impact", ["positive impact", "kind of food"], "Some animals bother people. Wearing long sleeves can help.", { d: 2 }),
  q("A guide dog helps a person who cannot see. This is a…", "positive impact", ["negative impact", "weather"], "Animals can help people in many ways.", { emoji: "🦮" }),
  q("Raccoons get into garbage bins. How can people help prevent this?", "Use bins with tight lids", ["Leave bins open", "Feed the raccoons"], "Securing garbage keeps wild animals safe and our streets clean.", { emoji: "🦝" }),
  q("A new road is built through a forest. What might happen to animals?", "They may lose their homes", ["Nothing", "They get taller"], "Building can take away places where animals live.", { d: 2 }),
  q("Some roads have a wildlife crossing. Why?", "So animals can cross safely", ["To grow flowers", "To park trucks"], "Bridges and tunnels help animals cross roads without being hit.", { d: 2 }),
  q("Which action helps animals that live near a pond?", "Keep the water clean", ["Throw garbage in", "Pour oil in"], "Clean water keeps animals healthy."),
  q("Which action can harm birds?", "Leaving litter such as fishing line", ["Putting up a bird house", "Planting native flowers"], "Litter can tangle or hurt birds.", { emoji: "🐦" }),
  q("A wetland is a home to frogs and birds. Why should we protect it?", "Many animals need it to live", ["It is a place to dump trash", "It is useless"], "Wetlands also help clean water and hold floods.", { d: 3 }),
  q("People feed ducks bread. Why is it not a good idea?", "It is not healthy food for ducks", ["Ducks do not eat", "Bread is too heavy"], "Wild animals do best with the natural food they eat.", { d: 2 }),
  q("A farm raises cows and chickens. How do people depend on them?", "for food such as milk and eggs", ["for flying", "for building bridges"], "Farm animals give food and other materials.", { d: 2 }),
  q("Bats eat many insects, including mosquitoes. How can bats help people?", "by eating insects that bother us", ["by making honey", "by growing trees"], "Bats eat large numbers of insects each night.", { emoji: "🦇", d: 3 }),
  q("Why is it better to watch wild animals from far away?", "It keeps them and us safe", ["They cannot see us", "It makes them sleepy"], "Getting too close can scare or hurt wild animals.", { d: 2 }),
  q("Cutting down forests can lead to…", "animals needing new homes", ["more animals right away", "no change at all"], "Habitat loss affects many kinds of animals.", { d: 3 }),
];

// ---------- Mixtures and Materials ----------

const MIXTURES: Item[] = [
  q("Salt is stirred into water. What happens?", "It dissolves and seems to disappear", ["It turns into a rock", "It stays in a lump and never mixes"], "Dissolving means the salt mixes in with the water.", { emoji: "🧂" }),
  q("Which one makes a mixture of a liquid and a solid?", "Orange juice with pulp", ["Plain water only", "An empty cup"], "A mixture has more than one kind of matter.", { d: 2 }),
  q("When oil and water are mixed, what happens?", "They stay separate", ["They become one smooth liquid", "They turn solid"], "Oil floats on top of water."),
  q("Which will sink in water?", e("a rock", "🪨"), ["a cork", "a leaf"], "Heavy, dense solids sink. Light ones float."),
  q("Which will float in water?", e("a wooden stick", "🪵"), [e("a rock", "🪨"), e("a coin", "🪙")], "Wood is less dense than water, so it floats."),
  q("Which absorbs water?", e("a sponge", "🧽"), [e("a plastic cup", "🥤"), e("a rain boot", "🥾")], "Absorb means to soak up."),
  q("Which one repels water (water rolls off)?", e("a raincoat", "🧥"), [e("a sponge", "🧽"), e("a paper towel", "🧻")], "Repel means to push away. Raincoats keep you dry."),
  q("A liquid always takes the shape of…", "its container", ["a cube", "nothing"], "Liquids flow and fill the shape of the container.", { d: 2 }),
  q("A solid, like a block, keeps its…", "own shape", ["container's shape", "sound"], "Solids have their own shape.", { d: 2 }),
  q("Why does a boat made of heavy steel float?", "Its shape holds a lot of air", ["Steel is very light", "Because of its colour"], "The big hollow shape spreads out its weight.", { d: 3 }),
  q("You want to dry a spill. Which is best?", "a paper towel", ["a plastic bag", "a metal spoon"], "Paper towels absorb liquids.", { d: 2 }),
  q("Which keeps your feet dry in a puddle?", "rubber boots", ["cotton socks", "paper shoes"], "Rubber repels water.", { emoji: "🥾" }),
  q("Lemonade is made from water, lemon juice and sugar. It is a…", "mixture", ["solid", "rock"], "Mixtures are made when different things are combined.", { emoji: "🍋", d: 2 }),
  q("Which mixture can you separate with a strainer?", "pasta and water", ["salt dissolved in water", "juice and water"], "A strainer catches solid pieces and lets liquid through.", { d: 3 }),
  q("When you add cereal to milk, you make…", "a mixture", ["a new kind of animal", "a solid block"], "A mixture is useful for foods and drinks.", { d: 2 }),
];

// ---------- Safety Symbols ----------

const SAFETY: Item[] = [
  q("A bottle has a skull and crossbones. What does it mean?", "Poison. Do not eat or drink it.", ["Safe to drink", "Food"], "The skull and crossbones means poison.", { emoji: "☠️" }),
  q("A container has a flame symbol. What does it mean?", "It can catch fire easily", ["It is cold", "It is food"], "The flame symbol means flammable.", { emoji: "🔥" }),
  q("A container shows a burst or explosion. What does it mean?", "It can explode", ["It is a toy", "It is a rainbow"], "An explosive symbol warns the container can burst.", { emoji: "💥" }),
  q("A bottle shows a liquid eating a hand and metal. What does it mean?", "It can burn skin or damage things", ["It is a juice", "It is soap for toys"], "That symbol means corrosive.", { d: 2 }),
  q("Why do we need safety symbols on products?", "To warn us about danger", ["To decorate them", "To make them heavy"], "Symbols give information even to people who cannot read the words."),
  q("You find a bottle with a poison symbol. What do you do?", "Do not touch it and tell an adult", ["Open it", "Taste it"], "Leave it alone and tell a grown-up."),
  q("Where should household cleaners be kept?", "Up high or locked away, closed tightly", ["Open on the floor", "In a lunch box"], "Store dangerous liquids safely out of reach of young children.", { d: 2 }),
  q("A bottle of paint thinner has a flame symbol. Keep it away from…", "heat and fire", ["ice cubes", "paper"], "Flammable things can catch fire from heat or sparks.", { d: 2 }),
  q("Why do we not mix cleaning products?", "They can make dangerous fumes", ["They taste bad", "It takes too long"], "Mixing chemicals can be harmful.", { d: 3 }),
  q("What should you do with an old can of paint?", "Take it to a household hazardous waste drop-off", ["Pour it down the drain", "Throw it in a river"], "Some liquids need special disposal so they do not harm water and living things.", { d: 3 }),
  q("Which liquid is safe to drink?", "water from a clean tap", ["window cleaner", "gasoline"], "Never drink products from cleaning or car supplies.", { emoji: "🚰" }),
  q("Safe or not? A bottle that looks like juice has a poison symbol.", "Not safe", ["Safe", "Maybe safe"], "A bottle that looks like a drink can still be dangerous. Always check the symbol.", { d: 2 }),
];

// ---------- Simple Machines ----------

const MACHINES: Item[] = [
  q("A seesaw is a…", "lever", ["pulley", "screw"], "A lever is a bar that turns on a point.", { emoji: "⚖️" }),
  q("A ramp is an…", "inclined plane", ["wheel and axle", "pulley"], "An inclined plane is a slope that helps move things up or down.", { emoji: "🛝" }),
  q("A wheel on a wagon is a…", "wheel and axle", ["wedge", "lever"], "A wheel turns around an axle.", { emoji: "🛞" }),
  q("A flagpole uses a…", "pulley", ["wedge", "lever"], "A pulley uses a wheel and rope to lift things.", { emoji: "🚩" }),
  q("An axe or a knife is a…", "wedge", ["pulley", "wheel and axle"], "A wedge cuts or splits things.", { emoji: "🪓" }),
  q("A jar lid turns on a…", "screw", ["wedge", "pulley"], "A screw is an inclined plane wrapped around a post.", { d: 2 }),
  q("Which one is NOT one of the six simple machines?", "a battery", ["a lever", "a wedge"], "The six: lever, inclined plane, wedge, pulley, wheel and axle, screw."),
  q("Why is it easier to roll a heavy box up a ramp than to lift it?", "A ramp takes less force", ["The ramp is magic", "It gets lighter"], "An inclined plane makes you push over a longer distance with less force.", { d: 2 }),
  q("A child uses a wheelbarrow to move soil. What does the wheel do?", "makes it easier to move", ["makes it heavier", "makes it float"], "A wheel and axle makes moving heavy things easier.", { emoji: "🛒", d: 2 }),
  q("A bottle opener is a…", "lever", ["screw", "wedge"], "A bottle opener is a lever that pries off the cap.", { d: 2 }),
  q("Which machine would you use to raise a bucket from a well?", "pulley", ["wedge", "screw"], "A rope over a wheel lets you pull down to lift.", { d: 2 }),
  q("A doorstop is a…", "wedge", ["lever", "wheel and axle"], "A wedge is thick at one end and thin at the other.", { d: 3 }),
  q("Why do simple machines help?", "They make jobs easier", ["They make jobs harder", "They make noise"], "A machine can reduce the effort needed or change the direction of a force."),
  q("A bike has wheels. Which simple machine is this?", "wheel and axle", ["wedge", "screw"], "Wheels turn around axles.", { emoji: "🚲", d: 2 }),
  q("People use ramps at buildings. Who do ramps help the most?", "a person using a wheelchair or a stroller", ["only birds", "no one"], "Ramps make buildings easier for many people to enter.", { d: 3 }),
];

// ---------- Air and Water ----------

const AIRWATER: Item[] = [
  q("Which one is true about air?", "It takes up space", ["It has no effect on anything", "It is a solid"], "A balloon fills up and gets bigger because air takes up space.", { emoji: "🎈" }),
  q("Can you see air?", "No, but you can feel wind", ["Yes, always blue", "Yes, always white"], "Air is invisible, but we feel it move as wind."),
  q("What do all living things need?", "air and water", ["only toys", "only sand"], "People, plants and animals depend on air and water."),
  q("Which is a state of water?", "ice, liquid and vapour (gas)", ["rock and metal", "red and blue"], "Water can be a solid (ice), a liquid, or a gas (water vapour).", { d: 2 }),
  q("What happens to water when it gets very cold?", "It freezes into ice", ["It turns to sand", "It disappears forever"], "Below 0 °C, water freezes."),
  q("What happens to puddle water on a hot day?", "It evaporates into the air", ["It turns to stone", "It moves to the Moon"], "Heat turns liquid water into water vapour.", { d: 2 }),
  q("Which one is a source of fresh water?", "a lake", ["the ocean", "a sandbox"], "Lakes, rivers and groundwater are mostly fresh water.", { d: 2 }),
  q("Which action wastes water?", "Leaving the tap running", ["Turning off the tap", "Using a rain barrel"], "Using less water is a good habit.", { d: 2 }),
  q("Which action uses less water?", "A short shower", ["A very long shower", "Leaving the hose on"], "Short showers save water.", { emoji: "🚿" }),
  q("Trees and plants take in carbon dioxide and give out…", "oxygen", ["smoke", "sand"], "Plants help make the air healthy to breathe.", { d: 3 }),
  q("Smoke from a factory or car fumes can make air…", "dirty", ["cleaner", "colder than ice"], "Pollution affects air quality and our health.", { d: 2 }),
  q("In some places people must carry water from a well or river. Why?", "They may not have water pipes at home", ["They like carrying", "Water is not needed there"], "Clean drinking water is not available everywhere in the world.", { d: 3 }),
  q("Which is NOT a way people use water at home?", "to build a rocket", ["to drink", "to wash"], "People use water for drinking, cooking, washing and more.", { d: 2 }),
  q("Why do we need to keep rivers and lakes clean?", "People, plants and animals need clean water", ["To keep fish out", "To make it freeze"], "Pollution in water can harm every living thing that uses it.", { d: 2 }),
  q("How much of Earth's water is fresh water we can drink?", "A small amount", ["All of it", "None"], "Most of Earth's water is salty ocean water.", { d: 3 }),
];

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "think-like-a-scientist",
    title: "Think Like a Scientist",
    emoji: "🔬",
    blurb: "Tools, fair tests, safety and code",
    standards: on("A1.1–A1.5, A2.1, A2.2, A3.1", "investigation skills, fair tests, safety, sharing findings, simple code and how science helps us"),
    parentNote: "How scientists and engineers work: tools for measuring, fair tests, safety, sharing results, simple algorithms and how new technology changes everyday life.",
    generate: unitOf(SKILLS),
  },
  {
    id: "animal-life-cycles",
    title: "Animal Life Cycles",
    emoji: "🦋",
    blurb: "Eggs, larvae, tadpoles and chicks",
    standards: on("B2.3, B2.4", "life cycles of insects, amphibians, birds and mammals, and how appearance and behaviour change"),
    parentNote: "Life cycles of butterflies, frogs, chickens and mammals, and how some animals change a lot while others look like small adults.",
    generate: unitOf(LIFE, [(d) => pick([BUTTERFLY, FROG, CHICKEN])(d)]),
  },
  {
    id: "how-animals-move",
    title: "How Animals Move",
    emoji: "🐍",
    blurb: "Swim, fly, hop, slither",
    standards: on("B2.2", "the ways different animals move (locomotion)"),
    parentNote: "How animals swim, fly, hop, slither, crawl and gallop, and the body parts that help them move.",
    generate: unitOf(MOVE, [MOVE_SORT]),
  },
  {
    id: "animal-adaptations",
    title: "Animal Adaptations",
    emoji: "🦉",
    blurb: "Features and behaviours that help",
    standards: on("B2.1, B2.5", "features that stay the same or change, and adaptations that help animals survive"),
    parentNote: "Body features (fur, quills, beaks, camouflage) and behaviours (hibernating, migrating, storing food) that help animals survive, and which features change as animals grow.",
    generate: unitOf(ADAPT),
  },
  {
    id: "animals-and-people",
    title: "Animals & People",
    emoji: "🐝",
    blurb: "How we affect each other",
    standards: on("B1.1, B1.2", "impacts animals have on people and the environment, and human activities that affect animals and their homes"),
    parentNote: "Helpful and bothersome ways animals affect us, and how building, litter and clean water affect animals and the places they live.",
    generate: unitOf(ANIMALS_PEOPLE),
  },
  {
    id: "mixtures-and-materials",
    title: "Mixtures & Materials",
    emoji: "🧪",
    blurb: "Dissolve, sink, float, absorb",
    standards: on("C2.2, C2.5, C2.6", "properties of liquids and solids, useful mixtures, and whether solids sink, float, absorb or repel water"),
    parentNote: "Mixing liquids and solids (dissolving, separating), what sinks or floats, and which materials soak up or push away water.",
    generate: unitOf(MIXTURES),
  },
  {
    id: "safety-symbols",
    title: "Safety Symbols",
    emoji: "☠️",
    blurb: "Warnings on everyday products",
    standards: on("C1.1, C2.7", "using, storing and disposing of liquids at home safely, and the meaning of international safety symbols"),
    parentNote: "Reading hazard symbols (poison, flammable, explosive, corrosive) on household products, and storing and throwing out dangerous liquids safely.",
    generate: unitOf(SAFETY),
  },
  {
    id: "simple-machines",
    title: "Simple Machines",
    emoji: "⚙️",
    blurb: "Levers, ramps, wedges and more",
    standards: on("D1.1, D2.3–D2.5", "the six simple machines, where we use them, and how they make jobs easier"),
    parentNote: "The six simple machines (lever, inclined plane, wedge, pulley, wheel and axle, screw), where we see them every day, and how they make a job take less effort.",
    generate: unitOf(MACHINES),
  },
  {
    id: "air-and-water-for-life",
    title: "Air & Water for Life",
    emoji: "💧",
    blurb: "Properties, states and using wisely",
    standards: on("E1.1, E1.3, E2.1, E2.4, E2.5", "properties of air and water, states of water, how living things depend on them, and using clean water wisely"),
    parentNote: "Air takes up space, the three states of water, why all living things need clean air and water, and how people can protect and share water.",
    generate: unitOf(AIRWATER),
  },
];
