import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "./g3-4-kit";
import { on } from "./kit";

// Ontario Grade 3 Science and Technology (2022): Growth and Changes in Plants, Forces and Motion,
// Strong and Stable Structures, and Soils in the Environment, plus STEM skills.

// ---------- Plant parts and needs ----------

const PLANT_PARTS_SORT: SortSet = {
  prompt: "Is it above the ground or below the ground? Tap an item, then tap its basket.",
  hint: "Roots grow down in the soil. Stems, leaves, flowers and fruit grow up in the air.",
  bins: [
    { id: "above", label: "above ground", emoji: "☀️" },
    { id: "below", label: "below ground", emoji: "🕳️" },
  ],
  items: [
    { label: "leaf", emoji: "🍃", bin: "above" },
    { label: "flower", emoji: "🌼", bin: "above" },
    { label: "stem", emoji: "🌿", bin: "above" },
    { label: "fruit", emoji: "🍎", bin: "above" },
    { label: "tree roots", emoji: "🌳", bin: "below" },
    { label: "root hairs", emoji: "🌱", bin: "below" },
    { label: "carrot (a root)", emoji: "🥕", bin: "below" },
    { label: "radish (a root)", emoji: "🌱", bin: "below" },
  ],
};

const PLANT_NEEDS_SORT: SortSet = {
  prompt: "Does a plant need it to live and grow? Tap an item, then tap its basket.",
  hint: "Plants need air, water, light, heat, nutrients and space. Music, candy and toys do nothing for them.",
  bins: [
    { id: "need", label: "a plant needs it", emoji: "🌱" },
    { id: "not", label: "a plant does not need it", emoji: "🚫" },
  ],
  items: [
    { label: "water", emoji: "💧", bin: "need" },
    { label: "light", emoji: "💡", bin: "need" },
    { label: "air", emoji: "💨", bin: "need" },
    { label: "space to grow", emoji: "↔️", bin: "need" },
    { label: "candy", emoji: "🍬", bin: "not" },
    { label: "loud music", emoji: "🎵", bin: "not" },
    { label: "toys", emoji: "🧸", bin: "not" },
    { label: "a hat", emoji: "🎩", bin: "not" },
  ],
};

const PLANT_PARTS: Item[] = [
  q("Which part of a plant takes in water from the soil?", "the roots", ["the leaves", "the flower", "the fruit"], "Roots grow down into the soil. They soak up water and hold the plant in place.", "🌱"),
  q("Which part of a plant holds it up and carries water to the leaves?", "the stem", ["the roots", "the seed", "the flower"], "The stem is like a straw with a frame around it. It holds the plant up and carries water.", "🌿"),
  q("Which part of a plant makes food using sunlight?", "the leaves", ["the roots", "the seeds", "the stem"], "Leaves catch sunlight. A plant uses that energy to make its food.", "🍃"),
  q("Which part of a flowering plant makes seeds?", "the flower", ["the root", "the stem", "the leaf"], "After a flower is pollinated, it makes seeds.", "🌼"),
  q("What part of an apple tree holds the seeds?", "the fruit", ["the roots", "the bark", "the leaves"], "A fruit grows from the flower and holds the seeds inside.", "🍎"),
  q("Which part of a flower makes pollen?", "the stamen", ["the pistil", "the petal", "the stem"], "The stamen makes the yellow pollen. The pistil is in the middle of the flower.", "🌼"),
  q("Which part of a flower has the tiny parts that become seeds?", "the pistil", ["the stamen", "the petal", "the leaf"], "The pistil is in the middle of the flower. Seeds grow inside it after pollination.", "🌷"),
  q("A pine tree makes its seeds in…", "cones", ["flowers", "roots", "leaves"], "Pine trees are cone-bearing trees. Their seeds grow inside cones.", "🌲"),
  q("Which of these does a plant NOT need?", "a loud radio", ["water", "light", "air"], "Plants need air, water, light, heat, nutrients and space.", "🌱"),
  q("Plants take in nutrients from the…", "soil", ["moonlight", "wind", "clouds"], "Nutrients are like vitamins for plants. They are in the soil.", "🪴"),
  q("A plant is left in a dark closet for two weeks. What happens to it?", "it turns pale and weak", ["it grows stronger", "it makes more flowers", "nothing changes"], "Plants need light to make food. Without it they get weak.", "🌑"),
  q("Which of these could threaten a plant's survival?", "a long drought with no rain", ["gentle spring rain", "warm sunny days", "rich, dark soil"], "A drought means almost no water, and plants need water to live.", "🏜️"),
  q("Why do gardeners plant seeds with space between them?", "each plant gets enough light, water and nutrients", ["so the roots can't reach water", "so the plants block each other's sun", "so the seeds feel lonely"], "Plants that are crowded have to share, and may not get enough of what they need.", "🌱"),
  q("Roots help a plant by…", "holding it in the soil and taking in water", ["making the flowers", "catching sunlight", "carrying seeds away"], "Roots are the plant's anchor and its drinking straws.", "🌱"),
  hq("Leaves have tiny openings. What do they let in?", "air (carbon dioxide)", ["soil", "rocks", "seeds"], "Leaves take in a gas from the air called carbon dioxide.", "🍃"),
  hq("A seed has a hard coat. What does it do?", "protects the baby plant inside", ["makes pollen", "drinks water for the plant", "catches sunlight"], "The seed coat keeps the tiny plant safe until it is ready to sprout.", "🌰"),
  hq("The stamen and the pistil are both parts of a…", "flower", ["root", "seed", "leaf"], "Both are inside the flower, in the middle of the petals.", "🌺"),
  hq("A tree's roots spread out far under the ground. How does that help the tree?", "it takes in lots of water and stays upright in wind", ["it makes more leaves", "it lets the tree fly seeds", "it keeps the tree warm"], "Long roots collect water and anchor a big tree against wind.", "🌳"),
];

// ---------- Plant life cycles, adaptation and photosynthesis ----------

const SEED_TRAVEL_SORT: SortSet = {
  prompt: "How does the seed travel? Tap an item, then tap its basket.",
  hint: "Light fluffy or winged seeds ride the wind. Sticky burrs and tasty fruits travel with animals.",
  bins: [
    { id: "wind", label: "carried by the wind", emoji: "🌬️" },
    { id: "animal", label: "carried by animals", emoji: "🐿️" },
  ],
  items: [
    { label: "maple key (a seed with a wing)", emoji: "🍁", bin: "wind" },
    { label: "dandelion fluff", emoji: "🌼", bin: "wind" },
    { label: "milkweed fluff", emoji: "🌿", bin: "wind" },
    { label: "cottonwood fluff", emoji: "🌳", bin: "wind" },
    { label: "burdock burr stuck in fur", emoji: "🐕", bin: "animal" },
    { label: "raspberry eaten by a bear", emoji: "🐻", bin: "animal" },
    { label: "acorn buried by a squirrel", emoji: "🐿️", bin: "animal" },
    { label: "berry eaten by a bird", emoji: "🐦", bin: "animal" },
  ],
};

const PLANT_LIFE: Item[] = [
  q("What is the first stage in the life cycle of most plants?", "a seed", ["a flower", "a fruit", "a leaf"], "Most plant life cycles start with a seed.", "🌰"),
  q("When a seed starts to grow into a new plant, it is…", "germinating", ["pollinating", "migrating", "hibernating"], "Germination is when a seed sprouts.", "🌱"),
  q("What do most seeds need to germinate?", "water and warmth", ["loud noises", "snow", "sunlight only, with no water"], "A seed wakes up when it gets water and the right temperature.", "💧"),
  q("What carries pollen from flower to flower?", "bees, other insects and the wind", ["the plant's roots", "the phases of the Moon", "melting snow"], "Pollinators like bees move pollen as they visit flowers.", "🐝"),
  q("A plant on a windowsill bends toward the window. Why?", "it grows toward the light", ["it is trying to escape", "the glass pulls it", "it is thirsty for noise"], "Plants react to their surroundings. They grow toward light so they can make food.", "🪟"),
  q("Why do maple trees drop their leaves in the fall?", "to get ready for winter", ["because they are sick", "because the Moon is full", "to make new roots"], "Leaves would freeze and cannot make food in winter, so the tree rests until spring.", "🍁"),
  q("A cactus has a thick stem. How does that help it survive?", "it stores water for dry times", ["it catches rain from the clouds", "it keeps the cactus cold", "it holds the seeds"], "Deserts get little rain. A cactus saves water in its stem.", "🌵"),
  q("Why do many evergreen trees have thin needles instead of wide leaves?", "they lose less water and snow slides off", ["they make seeds faster", "they sing in the wind", "they need less sunlight to be green"], "Needles are covered in wax, and snow slides off the branches.", "🌲"),
  q("Most plants make their food using energy from…", "the Sun", ["the soil", "the Moon", "the rain"], "Plants use sunlight to make food. This is called photosynthesis.", "☀️"),
  q("Which gas do plants release that people need to breathe?", "oxygen", ["helium", "smoke", "steam"], "Plants release oxygen when they make food in their leaves.", "💨"),
  q("What gas do plants take in from the air to make food?", "carbon dioxide", ["oxygen", "helium", "smoke"], "Plants take in carbon dioxide and release oxygen.", "🍃"),
  q("Why do flowers have bright colours and sweet smells?", "to attract pollinators like bees", ["to scare the rain away", "to cool the plant", "to hide from the Sun"], "Bees and butterflies visit flowers for nectar. They carry pollen as they go.", "🦋"),
  q("Squirrels bury acorns and forget some. What can happen?", "some acorns grow into oak trees", ["the acorns turn into mushrooms", "the squirrels grow roots", "nothing can ever happen"], "A buried acorn with water and warmth can germinate.", "🐿️"),
  q("A burdock burr sticks to a dog's fur. How does this help the plant?", "the seeds travel to a new place", ["the plant makes more nectar", "the plant gets more sunlight", "the dog waters the plant"], "Seeds that travel can grow away from the parent plant, where there is more space.", "🐕"),
  hq("Chlorophyll gives leaves their green colour. What else does it do?", "helps the leaf capture sunlight", ["makes the leaf smell sweet", "pulls water up from the roots", "stops the leaf from falling"], "Chlorophyll catches sunlight so the plant can make food.", "🍃"),
  hq("During photosynthesis, what does a plant do?", "takes in carbon dioxide and releases oxygen", ["takes in oxygen and releases carbon dioxide", "takes in soil and releases water", "takes in nectar and releases pollen"], "Plants use sunlight, water and carbon dioxide to make food, and release oxygen.", "🌳"),
  hq("A sunflower turns to face the Sun during the day. This is an example of a plant…", "reacting to its environment", ["changing its life cycle", "making seeds", "being pollinated"], "The plant responds to light by moving.", "🌻"),
  hq("In spring, snow melts and the soil warms up. What do many seeds do?", "begin to germinate", ["turn into stones", "fly away", "stop being seeds forever"], "Warmth and water tell seeds it is time to sprout.", "🌷"),
];

const BEAN_ORDER = order("Put the life cycle of a bean plant in order. Tap the first stage first.", "A seed sprouts into a seedling, grows leaves, flowers, and makes new seeds.", [
  ["seed", "🌰"],
  ["seed sprouts", "🌱"],
  ["seedling with leaves", "🌿"],
  ["plant with flowers", "🌼"],
  ["pods with new seeds", "🫘"],
]);

// ---------- Plants and people ----------

const PLANT_USES_SORT: SortSet = {
  prompt: "Which plant part do we eat? Tap an item, then tap its basket.",
  hint: "Carrots, beets and radishes are roots. Spinach and lettuce are leaves. Tomatoes and apples are fruits.",
  bins: [
    { id: "root", label: "root", emoji: "🥕" },
    { id: "leaf", label: "leaf", emoji: "🥬" },
    { id: "fruit", label: "fruit", emoji: "🍎" },
  ],
  items: [
    { label: "carrot", emoji: "🥕", bin: "root" },
    { label: "beet", emoji: "🟣", bin: "root" },
    { label: "radish", emoji: "🌱", bin: "root" },
    { label: "spinach", emoji: "🥬", bin: "leaf" },
    { label: "lettuce", emoji: "🥗", bin: "leaf" },
    { label: "kale", emoji: "🥬", bin: "leaf" },
    { label: "tomato", emoji: "🍅", bin: "fruit" },
    { label: "apple", emoji: "🍎", bin: "fruit" },
    { label: "cucumber", emoji: "🥒", bin: "fruit" },
  ],
};

const HELP_HARM_SORT: SortSet = {
  prompt: "Does it help plants or harm plants? Tap an item, then tap its basket.",
  hint: "Protecting habitat and caring for gardens helps plants. Paving over meadows and spreading invasive plants harms them.",
  bins: [
    { id: "help", label: "helps plants", emoji: "💚" },
    { id: "harm", label: "harms plants", emoji: "⚠️" },
  ],
  items: [
    { label: "planting native trees", emoji: "🌳", bin: "help" },
    { label: "starting a compost bin", emoji: "♻️", bin: "help" },
    { label: "protecting a wetland", emoji: "🦆", bin: "help" },
    { label: "watering a school garden", emoji: "🚿", bin: "help" },
    { label: "paving over a meadow", emoji: "🅿️", bin: "harm" },
    { label: "dumping garden waste in a forest", emoji: "🗑️", bin: "harm" },
    { label: "littering in a park", emoji: "🍬", bin: "harm" },
    { label: "clearing a forest and not replanting", emoji: "🪓", bin: "harm" },
  ],
};

const PLANT_NEED_SORT: SortSet = {
  prompt: "How do people use these plants? Tap an item, then tap its basket.",
  hint: "People use plants for food, to build shelters and to make clothing.",
  bins: [
    { id: "food", label: "food", emoji: "🍽️" },
    { id: "shelter", label: "shelter", emoji: "🏠" },
    { id: "clothing", label: "clothing", emoji: "👕" },
  ],
  items: [
    { label: "strawberries", emoji: "🍓", bin: "food" },
    { label: "wild rice", emoji: "🌾", bin: "food" },
    { label: "pine boards", emoji: "🪵", bin: "shelter" },
    { label: "cedar shingles", emoji: "🏠", bin: "shelter" },
    { label: "cotton socks", emoji: "🧦", bin: "clothing" },
    { label: "linen shirt (from flax)", emoji: "👕", bin: "clothing" },
  ],
};

const PLANT_PEOPLE: Item[] = [
  q("Cotton shirts are made from the fibres of which plant?", "the cotton plant", ["the potato plant", "the rice plant", "the tomato plant"], "Cotton fibres grow in fluffy bolls on the cotton plant.", "👕"),
  q("Wood from trees is used by people to build…", "houses and furniture", ["glass windows", "plastic toys", "metal tools"], "Lumber comes from trees. It is used for houses, furniture and more.", "🪵"),
  q("In Ontario, many people tap maple trees in early spring and boil the sap. What do they make?", "maple syrup", ["maple cotton", "maple flour", "maple glue"], "Many Indigenous communities and families in the Great Lakes region make maple syrup. Maple trees are a plant used for food.", "🍁"),
  q("Wild rice, called manoomin by Anishinaabe people, grows in lakes and rivers. People harvest it for…", "food", ["clothing", "building a bridge", "making paint"], "Many Anishinaabe communities in Ontario harvest manoomin today. It is a plant used for food.", "🌾"),
  q("Corn, beans and squash are grown together in many gardens, including by Haudenosaunee communities. They are called…", "the Three Sisters", ["the Berry Family", "the Root Crops", "the Garden Trio"], "The Three Sisters are planted together because the plants help each other.", "🌽"),
  q("In a Three Sisters garden, what do the corn stalks give the bean vines?", "something to climb", ["extra water", "darkness", "new roots"], "Bean vines wind up the tall corn stalks.", "🌽"),
  q("One good thing about eating locally grown food is that it…", "travels a shorter distance to get to you", ["never needs water", "grows in every season outdoors", "has no seeds"], "Food that is grown near you uses less fuel to get to a store.", "🥕"),
  q("One limit of eating only local food in an Ontario winter is that…", "fewer fresh fruits and vegetables grow outdoors", ["there is too much sunshine", "plants grow too fast", "farmers have no soil"], "Ontario winters are cold, so fewer crops grow outside.", "❄️"),
  q("Cutting down a whole forest to build a parking lot can…", "destroy the habitat of plants and animals", ["make more habitats", "give plants more room", "help the soil"], "Plants and animals live in forests. Taking away the forest takes away their homes.", "🌲"),
  q("Which action helps protect native plants?", "planting native plants in a garden", ["dumping garden waste in a forest", "paving the whole yard", "picking all the wildflowers"], "Native plants belong in the local habitat and help the animals that live there.", "🌼"),
  q("Garlic mustard is an invasive plant in Ontario. Why is it a problem?", "it crowds out native plants", ["it makes too much oxygen", "it has no leaves", "it only grows in the winter"], "Invasive plants spread fast and take space, light and nutrients from native plants.", "🌿"),
  q("Planting wildflowers in a yard helps bees because the flowers give them…", "nectar and pollen", ["rocks and soil", "wool", "shade only"], "Bees feed on nectar and pollen.", "🐝"),
  q("Birds build nests in trees. This shows that animals depend on plants for…", "shelter", ["electricity", "paint", "wheels"], "Plants give animals places to live as well as food.", "🪺"),
  q("A caterpillar eats leaves, and a bird eats the caterpillar. Which is true?", "the bird depends on plants, even though it eats the caterpillar", ["the bird does not depend on plants at all", "the leaves depend on the bird", "only the caterpillar depends on plants"], "The caterpillar gets its food from the plant, and the bird gets food from the caterpillar.", "🐛"),
  hq("A farmer wants to turn a wetland into a field. A nature group wants to protect it. These are different…", "perspectives", ["recipes", "seasons", "seeds"], "People can see the same place in different ways, depending on what matters to them.", "👥"),
  hq("A pharmacist uses a plant to make a medicine. This is an example of using plants for…", "medicine", ["clothing", "shelter", "toys only"], "People around the world use many plants for medicine.", "🌿"),
  hq("Strawberries grown on a farm near your town are a good example of…", "locally grown food", ["a wild plant that only grows in the desert", "an invasive plant", "plant clothing"], "Local food is grown close to where it is eaten.", "🍓"),
  hq("Why can planting trees along a stream protect a plant habitat?", "the roots hold the soil and the shade keeps the water cool", ["they make the water warmer", "they stop it from raining", "they make the stream dry up"], "Trees on the bank hold soil in place and help animals and plants in the water.", "🌳"),
];

// ---------- Forces and motion ----------

const CONTACT_SORT: SortSet = {
  prompt: "Does the force need touching? Tap an item, then tap its basket.",
  hint: "A contact force happens when things touch. Gravity, magnetism and static electricity can act from a distance.",
  bins: [
    { id: "contact", label: "contact force", emoji: "🤝" },
    { id: "non", label: "non-contact force", emoji: "🧲" },
  ],
  items: [
    { label: "kicking a ball", emoji: "⚽", bin: "contact" },
    { label: "pushing a door open", emoji: "🚪", bin: "contact" },
    { label: "pulling a wagon", emoji: "🛒", bin: "contact" },
    { label: "rubbing your hands together (friction)", emoji: "🤲", bin: "contact" },
    { label: "an apple falling from a tree (gravity)", emoji: "🍎", bin: "non" },
    { label: "a magnet pulling a paper clip", emoji: "🧲", bin: "non" },
    { label: "a balloon sticking to a wall (static)", emoji: "🎈", bin: "non" },
    { label: "two magnets pushing apart", emoji: "🧲", bin: "non" },
  ],
};

const FRICTION_BARS = (a: string, av: number, b: string, bv: number, c: string, cv: number) => ({
  type: "bars" as const,
  title: "How far the toy car rolled (cm)",
  bars: [
    { label: a, value: av },
    { label: b, value: bv },
    { label: c, value: cv },
  ],
});

const FORCES: Item[] = [
  q("A force is a…", "push or a pull", ["colour or a smell", "sound or a taste", "shadow or a light"], "Every force is a push or a pull on an object.", "💪"),
  q("What force pulls everything toward the Earth?", "gravity", ["friction", "pollen", "electricity"], "Gravity is why things fall down when you drop them.", "🍎"),
  q("Which force can act without touching?", "magnetism", ["friction", "pushing a swing", "kicking a ball"], "Magnets can push or pull things from a distance, so magnetism is a non-contact force.", "🧲"),
  q("A goalie catches a soccer ball. The force makes the ball…", "stop", ["speed up", "grow bigger", "float away"], "A force can start, stop or change the way an object is moving.", "🥅"),
  q("A hockey player hits a moving puck from the side. What changes?", "its direction", ["its colour", "its temperature only", "its weight"], "A force from the side makes the puck go in a new direction.", "🏒"),
  q("When you squeeze a sponge, the force changes its…", "shape", ["colour", "name", "smell"], "Forces can change the shape of an object.", "🧽"),
  q("A soccer ball is kicked harder. What happens?", "it goes faster and farther", ["it goes slower", "it turns green", "it stays still"], "A bigger force makes a bigger change in motion.", "⚽"),
  q("Which needs a bigger force to push: an empty wagon or a wagon full of rocks?", "the wagon full of rocks", ["the empty wagon", "they need the same force", "neither needs a force"], "Heavier things need a larger force to start moving.", "🛒"),
  q("Opening a jar lid uses which kind of force?", "a twist", ["a stretch", "a spin in the air", "a hang"], "You turn the lid, which is a twisting force.", "🫙"),
  q("Squeezing toothpaste out of the tube uses which kind of force?", "a squeeze", ["a pull", "a twist", "a stretch"], "Your hand squeezes the tube.", "🪥"),
  q("Which surface has the most friction?", "sandpaper", ["ice", "polished glass", "a wet bar of soap"], "Rough surfaces grip and slow things down. Slippery surfaces have little friction.", "🧱"),
  q("Why do we put sand on an icy sidewalk?", "to add friction so people don't slip", ["to make the ice melt in a second", "to make it slipperier", "to make it brighter"], "Sand makes the surface rough, so shoes can grip.", "🧂"),
  q("A bike helmet helps keep you safe in a crash because it…", "cushions and spreads out the force", ["makes the bike faster", "stops the bike from falling", "takes away gravity"], "The helmet slows down the force on your head so it hurts less.", "⛑️"),
  q("A seat belt holds you in place when a car stops suddenly. This keeps you from…", "being thrown forward", ["floating up", "growing taller", "turning around"], "Your body keeps moving forward when the car stops, so the belt gives you a force to stop with.", "🚗"),
  q("Which uses a pull?", "opening a drawer", ["closing a door by pushing it", "kicking a ball", "pressing a button"], "To open a drawer, you pull it toward you.", "🗄️"),
  q("Strong winds in a storm can knock down trees. What kind of force is the wind?", "a push", ["a pull", "a twist only", "no force at all"], "Moving air pushes on whatever is in its way.", "🌪️"),
  hq("A ball rolls across the grass and slowly stops. What force slows it down?", "friction", ["magnetism", "a push from the Moon", "static electricity"], "Friction between the ball and the grass slows it.", "⚽"),
  hq("Two magnets push each other apart without touching. This shows a…", "non-contact force", ["contact force", "friction", "twisting force"], "The magnets act from a distance.", "🧲"),
  hq("To reduce damage from flooding along a river, people can…", "build barriers and keep homes away from the riverbank", ["cut down trees on the bank", "pour more water on the banks", "remove all dams"], "Flood forces from fast water are hard to stop; planning where to build helps keep people safe.", "🌊"),
  hq("Which kind of force can change a flat piece of clay into a ball?", "squeezing and pushing", ["gravity only", "a magnet", "a smell"], "Pushing and squeezing change shape.", "🧱"),
  q("Which surface had the most friction?", "carpet", ["tile", "wood floor"], "The car rolled the shortest distance on carpet, so carpet had the most friction.", undefined, FRICTION_BARS("carpet", 35, "tile", 130, "wood floor", 95)),
  q("Which surface had the least friction?", "tile", ["carpet", "wood floor"], "The car rolled farthest on tile, so tile had the least friction.", undefined, FRICTION_BARS("carpet", 40, "tile", 140, "wood floor", 90)),
];

// ---------- Structures ----------

const STRUCTURE_SORT: SortSet = {
  prompt: "Who built it? Tap an item, then tap its basket.",
  hint: "Animals build nests, dams and webs. People build bridges, towers and houses.",
  bins: [
    { id: "animal", label: "built by animals", emoji: "🐾" },
    { id: "people", label: "built by people", emoji: "👷" },
  ],
  items: [
    { label: "beaver dam", emoji: "🦫", bin: "animal" },
    { label: "bird nest", emoji: "🪺", bin: "animal" },
    { label: "spider web", emoji: "🕸️", bin: "animal" },
    { label: "wasp nest", emoji: "🐝", bin: "animal" },
    { label: "bridge", emoji: "🌉", bin: "people" },
    { label: "tent", emoji: "⛺", bin: "people" },
    { label: "tower", emoji: "🗼", bin: "people" },
    { label: "house", emoji: "🏠", bin: "people" },
  ],
};

const STRUCTURES: Item[] = [
  q("A structure is something that…", "holds a load and has a size, shape and job", ["always moves", "is always made of wood", "is always very tall"], "Bridges, nests, tents and chairs are all structures. They hold weight.", "🏗️"),
  q("A bird nest is shaped like a bowl. Why?", "to hold eggs and keep them from rolling out", ["to catch rain", "to look pretty", "to keep the eggs cold"], "The shape of a structure fits its job. This is form and function.", "🪺"),
  q("A bridge has a flat surface on top. Why?", "so people and vehicles can cross", ["to hold water", "to look like a mountain", "so it can float"], "The bridge's job is to carry traffic across a gap.", "🌉"),
  q("A chair has a seat, legs and a back. What is its job?", "to hold a person who is sitting", ["to keep the room cold", "to hold water", "to carry people across a river"], "The chair's form (legs, seat, back) fits its function.", "🪑"),
  q("Why do houses in snowy places often have steep roofs?", "so snow slides off", ["to catch more snow", "to make rooms warmer", "to look taller"], "A steep slope lets snow slide to the ground instead of piling up.", "🏠"),
  q("A tent is held up by poles. The poles are the tent's…", "framework", ["roof", "load", "floor"], "A framework is the part of a structure that holds it up.", "⛺"),
  q("A spider web is a natural structure. What is its job?", "to catch food", ["to hold water", "to keep the spider cold", "to cross a river"], "Insects stick to the sticky silk.", "🕸️"),
  q("A beaver builds a dam across a stream. What happens?", "a pond forms behind the dam", ["the stream flows faster", "the stream turns into a road", "the trees grow in the water"], "The dam stops the flowing water and makes a pond. A pond becomes a habitat for many animals.", "🦫"),
  q("A highway cuts through a forest. How can this hurt wildlife?", "it can block animals' paths", ["it gives animals more food", "it makes the trees taller", "it plants flowers"], "Animals can be hurt crossing roads. Some places build wildlife bridges or tunnels to help.", "🦌"),
  q("Why do tall buildings have a steel framework inside?", "to hold up their weight", ["to make them look shiny", "to make them lighter than air", "to keep out the wind and rain only"], "Steel is strong, so it is used for the frame that holds up the load.", "🏙️"),
  q("A wide bridge across a river helps a town because it…", "lets people and goods cross", ["stops all boats", "makes the river dry", "keeps out snow"], "Structures meet the needs of communities.", "🌉"),
  q("An anthill is built by…", "ants", ["wind", "beavers", "birds"], "Ants dig and pile soil to make their nest.", "🐜"),
  hq("A tree trunk is wider at the bottom than at the top. Why does that help?", "it gives the tree a strong, stable base", ["it makes the tree lighter", "it keeps rain out", "it makes seeds fall"], "A wide base supports more weight and is harder to tip.", "🌳"),
  hq("A pyramid has a wide base and a pointed top. What does the wide base give it?", "stability", ["speed", "heat", "flexibility"], "A wide base keeps a structure from tipping over.", "🔺"),
  hq("A dam holds back water, but it can also change a river's habitat. This is an example of a structure's…", "effect on the environment", ["colour", "price", "speed"], "Structures can help people and also change habitats.", "🏞️"),
  hq("Which structure's form best fits holding up a roof in the middle of a room?", "a post", ["a rope", "a sheet of paper", "a sponge"], "A post is stiff and strong. It can hold weight from above.", "🏛️"),
  q("A human-made structure like a park bridge can give people a way to enjoy nature. This is one…", "benefit to people", ["harm to the soil", "danger to birds", "type of habitat"], "Structures can have positive effects on the people who use them.", "🌲"),
];

// ---------- Strength and stability ----------

const STRUT_SORT: SortSet = {
  prompt: "Is it a strut (pushed on) or a tie (pulled on)? Tap an item, then tap its basket.",
  hint: "A strut is squeezed and holds something up. A tie is stretched, like a rope or cable that holds something from above.",
  bins: [
    { id: "strut", label: "strut (pushed)", emoji: "⬇️" },
    { id: "tie", label: "tie (pulled)", emoji: "⬆️" },
  ],
  items: [
    { label: "tent pole holding up the tent", emoji: "⛺", bin: "strut" },
    { label: "table leg", emoji: "🪑", bin: "strut" },
    { label: "brick pillar", emoji: "🧱", bin: "strut" },
    { label: "post under a deck", emoji: "🏡", bin: "strut" },
    { label: "rope on a tent", emoji: "🪢", bin: "tie" },
    { label: "bridge cable", emoji: "🌉", bin: "tie" },
    { label: "chain on a swing", emoji: "⛓️", bin: "tie" },
    { label: "string holding a kite", emoji: "🪁", bin: "tie" },
  ],
};

const STABLE_SORT: SortSet = {
  prompt: "Does it make a structure more stable or less stable? Tap an item, then tap its basket.",
  hint: "A wide base, a low centre and being fixed to the ground make a structure more stable.",
  bins: [
    { id: "more", label: "more stable", emoji: "✅" },
    { id: "less", label: "less stable", emoji: "⚠️" },
  ],
  items: [
    { label: "a wide base", emoji: "⬛", bin: "more" },
    { label: "heavy things at the bottom", emoji: "📚", bin: "more" },
    { label: "fixing it to the ground", emoji: "⚓", bin: "more" },
    { label: "legs spread far apart", emoji: "🪑", bin: "more" },
    { label: "a narrow base", emoji: "🔻", bin: "less" },
    { label: "heavy things on the top shelf", emoji: "📦", bin: "less" },
    { label: "legs close together", emoji: "🦵", bin: "less" },
    { label: "a wobbly, round bottom", emoji: "🥚", bin: "less" },
  ],
};

const STRONG: Item[] = [
  q("The strength of a structure is its ability to…", "support a load", ["move quickly", "change colour", "float away"], "A strong structure can hold a lot of weight without breaking.", "💪"),
  q("A flat sheet of paper cannot hold a book. If you fold it into a tube, it holds more. What did folding do?", "made it stronger", ["made it lighter", "made it wetter", "made it shorter"], "Changing the shape of a material can make a structure stronger.", "📄"),
  q("Which shape is very strong in frameworks, like the sides of a bridge?", "triangle", ["circle", "oval", "curve"], "Triangles do not bend out of shape easily when pushed.", "🔺"),
  q("The stability of a structure is its ability to…", "stay balanced and keep its shape", ["hold a lot of weight", "change shape quickly", "stay hot"], "A stable structure doesn't tip over or slide when a force acts on it.", "⚖️"),
  q("Which is more stable?", "a pyramid", ["a tall thin pole standing on its end", "a ball on a table", "a stack of one coin on a pin"], "A wide base keeps a pyramid steady.", "🔺"),
  q("A bookshelf is safest if you put the heaviest books…", "on the bottom shelf", ["on the top shelf", "only on the side", "in a pile on the edge"], "Heavy things low down make the shelf harder to tip.", "📚"),
  q("A rope holds a lamp up from the ceiling. The rope is a…", "tie", ["strut", "load", "roof"], "A tie is pulled or stretched. A strut is pushed or squeezed.", "💡"),
  q("A wooden post holds up a roof. The post is a…", "strut", ["tie", "cable", "tent"], "A strut is pushed on. It stops something from being squashed.", "🏠"),
  q("Which property is most important for the material in a boat's hull?", "it keeps water out and floats", ["it dissolves in water", "it is very soft", "it is see-through"], "A boat has to stay afloat and not leak.", "⛵"),
  q("Why is glass used for windows?", "light can pass through it", ["it is very soft", "it is a good building frame", "it is cheap and bendy"], "Glass is transparent, so we can see through it.", "🪟"),
  q("Heavy snow piles on a flat roof. What could the force of the snow do?", "bend or break the roof", ["make it taller", "make it hotter", "make it lighter"], "A large load can change the shape of a structure.", "❄️"),
  q("Wind pushes on a tall sign. What could happen?", "the sign could tip over", ["the sign could float", "the sign could grow", "the sign could turn to snow"], "Forces like wind can affect balance and position.", "🌬️"),
  q("A builder wants a table that does not break. Which is a way to make it stronger?", "add a support under the middle", ["make the legs thinner", "make the top thinner", "remove one leg"], "More supports help carry the load.", "🪑"),
  q("A kite is held to the ground by a string. When the wind pulls, the string is being…", "stretched", ["squeezed", "folded", "wetted"], "A tie is pulled so it is stretched.", "🪁"),
  hq("A paper bridge holds 2 books when flat, 6 books when folded in an accordion shape and 12 books when rolled into a tube. Which shape was strongest?", "the tube", ["flat", "the accordion fold"], "The tube held the most books.", "🌉"),
  hq("Plywood is made of thin layers of wood glued together. Why is it strong?", "layers glued together add strength", ["it is thinner than wood", "it is lighter than air", "it has no grain"], "Joining layers can make a material stronger than a single layer.", "🪵"),
  hq("What is the best way to keep a tall tower stable in strong wind?", "a wide base fixed to the ground", ["a narrow base", "heavy weights on top", "no foundation"], "Stability comes from a wide, firm base.", "🗼"),
  hq("Struts and ties together help a bridge because they…", "share the load by being pushed and pulled", ["make the bridge lighter than air", "make water flow under it", "change its colour"], "Some parts are squeezed and some are stretched, so the load is spread out.", "🌉"),
];

// ---------- Soils ----------

const SOIL_LIVING_SORT: SortSet = {
  prompt: "Is it a living or non-living part of soil? Tap an item, then tap its basket.",
  hint: "Worms, roots, insects and fungi are living. Sand, clay, water, air and small stones are not.",
  bins: [
    { id: "living", label: "living", emoji: "🪱" },
    { id: "non", label: "non-living", emoji: "🪨" },
  ],
  items: [
    { label: "earthworm", emoji: "🪱", bin: "living" },
    { label: "plant roots", emoji: "🌱", bin: "living" },
    { label: "beetle", emoji: "🪲", bin: "living" },
    { label: "fungus threads", emoji: "🍄", bin: "living" },
    { label: "sand", emoji: "🏖️", bin: "non" },
    { label: "clay", emoji: "🧱", bin: "non" },
    { label: "water", emoji: "💧", bin: "non" },
    { label: "small stones", emoji: "🪨", bin: "non" },
  ],
};

const DRAIN_BARS = (sand: number, loam: number, clay: number) => ({
  type: "bars" as const,
  title: "Water that drained through in 1 minute (mL)",
  bars: [
    { label: "sandy soil", value: sand },
    { label: "loam", value: loam },
    { label: "clay soil", value: clay },
  ],
});

const SOILS: Item[] = [
  q("Which of these is a living part of soil?", "an earthworm", ["sand", "a small stone", "air"], "Worms, bugs, roots and fungi live in soil.", "🪱"),
  q("Which of these is a non-living part of soil?", "sand", ["an ant", "a root hair", "a fungus"], "Sand, clay, water and air are non-living parts of soil.", "🏖️"),
  q("The dark top layer of soil, full of nutrients, is called…", "topsoil", ["bedrock", "gravel", "snow"], "Topsoil is the best layer for plants.", "🌱"),
  q("Which soil is healthier?", "dark, crumbly soil with worms", ["hard, packed dirt with nothing living in it", "pale dust with no air", "frozen mud only"], "Healthy soil has lots of living things, air and nutrients.", "🪱"),
  q("Water drains through sandy soil…", "quickly", ["very slowly", "never", "upward"], "Sand has big gaps, so water runs through fast.", "🏖️"),
  q("Which soil feels sticky when wet and can be rolled into a ball?", "clay", ["sand", "gravel", "air"], "Clay particles are tiny and stick together.", "🧱"),
  q("Which soil is best for growing most crops?", "loam", ["pure sand", "pure clay", "bare rock"], "Loam is a mix of sand, silt, clay and humus. It holds water and lets in air.", "🥕"),
  q("Earthworm tunnels help soil because they…", "let air and water in", ["make the soil heavy", "remove all nutrients", "stop plants from growing"], "Tunnels loosen the soil and let roots breathe.", "🪱"),
  q("Humus is made from…", "rotted plants and animals", ["crushed glass", "rock only", "plastic"], "When plants and animals die, they break down and add nutrients to soil.", "🍂"),
  q("The Niagara region in Ontario has warm summers and well-drained soil. It is known for growing…", "grapes and peaches", ["bananas", "oranges", "cacao"], "Fruit farms in Niagara grow grapes, peaches and other tender fruits.", "🍇"),
  q("In much of northern Ontario, the land is mostly bare rock with only a thin layer of soil. This makes farming…", "harder", ["easier", "unnecessary", "the same everywhere"], "Thin soil can't hold much water or nutrients, so it is harder to farm.", "🪨"),
  q("Which of these does soil do for the environment?", "it gives plants a place to grow", ["it makes the wind blow", "it makes rain", "it makes the Moon bright"], "Soil is a home for living things and plants get water and nutrients from it.", "🌍"),
  q("Which fact about soil is true?", "farmers need healthy soil to grow food", ["soil is only dust", "soil has nothing living in it", "all soil is the same everywhere"], "Our food depends on healthy soil.", "🌾"),
  q("You pour water through three cups of soil. Which soil will drain the fastest?", "sandy soil", ["clay soil", "wet mud", "frozen soil"], "Sand has big spaces for water.", "🧪"),
  hq("Farmers in Ontario's Holland Marsh grow vegetables such as carrots and onions in dark, rich soil. Why is this soil good for farming?", "it is full of nutrients from rotted plants", ["it is made of pure sand", "it has no water", "it is mostly stones"], "Marsh soil is rich in humus.", "🥕"),
  hq("Clay soil holds water but drains slowly. What could this mean for a garden?", "plants might get too wet", ["plants will always get too dry", "plants will get no nutrients", "water will rise into the sky"], "Water stays a long time in clay, so roots can get too wet.", "🌧️"),
  hq("Why do soil scientists dig up samples and look at them closely?", "to learn what the soil is made of and how healthy it is", ["to find buried treasure", "to make the Sun brighter", "to count the stars"], "Careful observation tells us about soil types.", "🔍"),
  q("Which soil let the least water through?", "clay soil", ["sandy soil", "loam"], "Clay drained 30 mL, the least.", undefined, DRAIN_BARS(180, 100, 30)),
  q("Which soil drained the most water in a minute?", "sandy soil", ["loam", "clay soil"], "Sand drained 170 mL, the most.", undefined, DRAIN_BARS(170, 90, 40)),
];

// ---------- Caring for soil ----------

const COMPOST_SORT: SortSet = {
  prompt: "Can it go in a compost bin? Tap an item, then tap its basket.",
  hint: "Fruit and vegetable scraps, leaves, eggshells and coffee grounds break down. Plastic, glass and metal do not.",
  bins: [
    { id: "yes", label: "compost it", emoji: "♻️" },
    { id: "no", label: "not for compost", emoji: "🚫" },
  ],
  items: [
    { label: "apple core", emoji: "🍎", bin: "yes" },
    { label: "dry leaves", emoji: "🍂", bin: "yes" },
    { label: "eggshells", emoji: "🥚", bin: "yes" },
    { label: "coffee grounds", emoji: "☕", bin: "yes" },
    { label: "plastic wrapper", emoji: "🍬", bin: "no" },
    { label: "glass jar", emoji: "🫙", bin: "no" },
    { label: "metal can", emoji: "🥫", bin: "no" },
    { label: "foam cup", emoji: "🥤", bin: "no" },
  ],
};

const SOIL_HEALTH_SORT: SortSet = {
  prompt: "Does it help soil or hurt it? Tap an item, then tap its basket.",
  hint: "Compost, cover crops and tree roots protect soil. Spills, bare ground and too much salt hurt it.",
  bins: [
    { id: "help", label: "helps soil", emoji: "💚" },
    { id: "hurt", label: "hurts soil", emoji: "⚠️" },
  ],
  items: [
    { label: "adding compost", emoji: "♻️", bin: "help" },
    { label: "planting a cover crop", emoji: "🌱", bin: "help" },
    { label: "planting trees on a slope", emoji: "🌳", bin: "help" },
    { label: "spreading mulch on a garden", emoji: "🍂", bin: "help" },
    { label: "pouring oil on the ground", emoji: "🛢️", bin: "hurt" },
    { label: "leaving a field bare all winter", emoji: "🟫", bin: "hurt" },
    { label: "piling road salt near a garden", emoji: "🧂", bin: "hurt" },
    { label: "too much fertilizer", emoji: "🧪", bin: "hurt" },
  ],
};

const EROSION_ORDER = order("Put the steps of soil erosion in order.", "Rain falls on bare soil, flows downhill and carries soil to a stream.", [
  ["heavy rain falls on bare soil", "🌧️"],
  ["water runs downhill", "⛰️"],
  ["soil is carried away", "🟫"],
  ["muddy water flows into a stream", "🏞️"],
]);

const COMPOST_ORDER = order("Put the steps of making compost in order.", "Collect scraps, put them in the bin, mix, wait, then use the finished compost.", [
  ["collect fruit and vegetable scraps", "🍎"],
  ["put them in a bin with dry leaves", "🗑️"],
  ["stir it now and then", "🥄"],
  ["wait while decomposers do their work", "🪱"],
  ["spread the dark, crumbly compost on a garden", "🌱"],
]);

const SOIL_CARE: Item[] = [
  q("What does a compost bin turn food scraps into?", "dark, crumbly, nutrient-rich material", ["plastic", "sand", "a new kind of rock"], "Compost is rotted plant matter that feeds the soil.", "♻️"),
  q("Who does most of the work in a compost bin?", "worms, bugs, fungi and bacteria", ["the wind", "magnets", "the Moon"], "These tiny living things break food scraps down.", "🪱"),
  q("One good thing about composting is that it…", "turns food scraps into plant food instead of garbage", ["makes more plastic", "stops plants from growing", "makes the soil heavier"], "Compost keeps scraps out of the landfill and helps gardens.", "🌱"),
  q("Fertilizer adds nutrients to soil. What can happen if too much washes into a lake?", "algae grow too much and harm water life", ["the lake gets bigger", "the fish grow wings", "the water disappears"], "Extra nutrients make lots of algae, which use up oxygen in the water.", "🧪"),
  q("In winter, road salt can wash into the soil beside the road. What can it do?", "make it hard for plants to grow", ["help the plants grow faster", "turn the soil into sand", "make flowers bloom"], "Too much salt hurts plants and soil life.", "🧂"),
  q("Erosion is when…", "wind or water moves soil to a new place", ["soil turns to glass", "soil becomes sand", "worms eat soil"], "Bare ground can be washed or blown away.", "🌧️"),
  q("Which helps stop soil from washing away on a hillside?", "planting trees and grass", ["removing all plants", "digging up the roots", "smoothing the ground until it is bare"], "Roots hold soil in place.", "🌳"),
  q("A line of trees along the edge of a field is called a windbreak. What does it do?", "slows the wind so it carries less soil", ["makes the wind stronger", "stops the rain", "makes the field bare"], "Tree rows slow the wind and keep the soil in place.", "🌬️"),
  q("A parking lot covers soil with pavement. What happens to rain?", "it can't soak in, so it runs off", ["it soaks in even faster", "it turns into snow", "it makes more soil"], "Pavement stops water from soaking into the ground.", "🅿️"),
  q("Which action by one person helps soil?", "starting a compost bin", ["pouring oil on the ground", "stripping all grass from the yard", "throwing trash in the garden"], "Compost feeds the soil.", "♻️"),
  q("A leaf pile left under a tree slowly turns into rich soil. This shows that…", "dead plants add nutrients to soil", ["leaves turn into rocks", "leaves stop plants from growing", "soil does not change"], "Rotting leaves feed the soil.", "🍂"),
  q("Why do farmers plant a cover crop, like clover, after harvest?", "to protect the bare soil and feed it", ["to hide the soil from the Sun", "to use up all the nutrients", "to keep earthworms away"], "Cover crops hold the soil and add nutrients.", "🍀"),
  hq("A farmer grows beans one year and corn the next in the same field. This is called…", "crop rotation", ["compost", "erosion", "pollination"], "Changing crops each year helps keep soil healthy.", "🌽"),
  hq("What does the word 'erosion' describe: a hill losing soil to a stream, or a worm digging a tunnel?", "a hill losing soil to a stream", ["a worm digging a tunnel", "a seed sprouting", "a plant growing toward light"], "Erosion carries soil away from where it was.", "🏞️"),
  hq("Why can too much plastic in soil be a problem?", "it does not break down and can harm soil life", ["it feeds the earthworms", "it turns into compost", "it makes the soil sweeter"], "Plastic stays in the soil for a very long time.", "🧴"),
  hq("Conservation authorities in Ontario plant trees along streams. How does this help the soil?", "roots hold the bank in place", ["the leaves melt the soil", "it makes the stream flow uphill", "it removes the topsoil"], "Plant roots hold soil so it doesn't wash into the water.", "🌳"),
  hq("In cities, grass and gardens soak up rain. What can happen if they are replaced with pavement?", "more water runs off and can erode soil elsewhere", ["less water runs off", "the pavement grows roots", "the soil gets healthier"], "Runoff can carry soil away.", "🌧️"),
  hq("Mulch is a layer of leaves or wood chips spread on a garden. How does it help?", "keeps moisture in and protects the soil", ["makes the soil dry out", "blocks all the air", "kills all the worms"], "Mulch covers the soil like a blanket.", "🍂"),
];

// ---------- Science and technology skills ----------

const SAFE_SORT: SortSet = {
  prompt: "Is it a safe or an unsafe way to do science? Tap an item, then tap its basket.",
  hint: "Wear safety gear, follow directions and tell an adult about spills. Never taste experiments.",
  bins: [
    { id: "safe", label: "safe", emoji: "✅" },
    { id: "unsafe", label: "unsafe", emoji: "⚠️" },
  ],
  items: [
    { label: "wearing goggles when mixing", emoji: "🥽", bin: "safe" },
    { label: "washing hands after an experiment", emoji: "🧼", bin: "safe" },
    { label: "telling the teacher about a spill", emoji: "🙋", bin: "safe" },
    { label: "tying back long hair near a flame", emoji: "💇", bin: "safe" },
    { label: "tasting a science mixture", emoji: "👅", bin: "unsafe" },
    { label: "running with scissors", emoji: "✂️", bin: "unsafe" },
    { label: "leaving a spill on the floor", emoji: "💦", bin: "unsafe" },
    { label: "skipping the directions", emoji: "📋", bin: "unsafe" },
  ],
};

const DESIGN_ORDER = order("Put the engineering design steps in order.", "Engineers define the problem, plan, build, test and then improve.", [
  ["define the problem", "❓"],
  ["plan and draw a design", "✏️"],
  ["build a model", "🔨"],
  ["test it", "🧪"],
  ["improve it and share", "💡"],
]);

const SKILLS: Item[] = [
  q("You want to know if warm water melts ice faster than cold water. What should you change in a fair test?", "only the water temperature", ["the size of the cup, the ice and the temperature", "nothing at all", "only the colour of the cup"], "In a fair test, change one thing and keep everything else the same.", "🧊"),
  q("In a fair test about how fast a car rolls, you keep the ramp, the car and the floor the same. What do you change?", "one thing, like the slope", ["everything", "nothing", "the ramp, car and floor"], "One changed thing lets you tell what caused the result.", "🏎️"),
  q("A prediction is…", "a guess about what will happen, based on what you know", ["what you did", "the final answer", "a list of tools"], "You make a prediction before the test.", "🔮"),
  q("Which is an observation?", "the plant has three green leaves", ["the plant probably likes the window", "the plant is happy", "the plant will grow tomorrow"], "An observation uses your senses, and is what you see, hear or measure.", "👀"),
  q("What tool measures the temperature of water?", "a thermometer", ["a ruler", "a balance", "a hand lens"], "A thermometer measures temperature.", "🌡️"),
  q("What tool would you use to look closely at a leaf's tiny parts?", "a hand lens", ["a ruler", "a stopwatch", "a measuring cup"], "A hand lens makes small things look bigger.", "🔍"),
  q("What tool measures how long a pencil is?", "a ruler", ["a thermometer", "a stopwatch", "a balance"], "Rulers measure length in centimetres.", "📏"),
  q("What should you wear to protect your eyes when pouring or mixing?", "safety goggles", ["a sun hat", "mittens", "a scarf"], "Goggles protect your eyes from splashes.", "🥽"),
  q("A graph shows the results of an experiment. Why is a graph helpful?", "it makes it easier to see patterns", ["it hides the results", "it makes the experiment longer", "it is only for decoration"], "Graphs and tables help us communicate findings.", "📊"),
  q("A computer program does not work the way you planned. What is finding and fixing the mistake called?", "debugging", ["pollinating", "composting", "germinating"], "A bug is a mistake in code. Debugging means fixing it.", "💻"),
  q("A robot is programmed: forward, forward, turn right, forward. It must reach a spot but goes the wrong way. What should you do?", "test the program and fix the step that is wrong", ["throw the robot away", "never change the code", "run it faster"], "Test, find the bug and refine the code.", "🤖"),
  q("Which job might use science and technology to keep people safe?", "an electrician checking wiring", ["a person who only sleeps", "a person who never works", "a scarecrow"], "Many jobs use science ideas to solve real problems, including skilled trades.", "⚡"),
  q("Scientists from many communities have made discoveries. Why is it important to learn from people with different experiences?", "they bring different ideas and knowledge", ["only one person can have good ideas", "all people think the same", "it slows down every project"], "Different perspectives help solve problems in new ways.", "🌍"),
  q("After a test, you find the tower fell over. What should you do next in the design process?", "improve the design and test again", ["give up", "never test again", "hide the tower"], "Engineers test, find problems and then improve.", "🏗️"),
  hq("Why do scientists repeat a test several times?", "to be more sure of the results", ["to make it take longer", "because the first result is always wrong", "so they can change the question"], "More trials make results more reliable.", "🔁"),
  hq("A student writes: 'Plants grow best in the sun.' What would be the best way to check this idea?", "grow the same plant in sun and in shade and compare", ["ask a friend what they think", "just look at pictures", "water one plant more"], "A fair test compares plants that differ in only one way.", "🌱"),
  hq("An engineer designs a bridge from straws. Which is a good way to communicate the design?", "a labelled drawing", ["a blank page", "a single word", "a loud noise"], "Labelled diagrams help others understand a design.", "✏️"),
  hq("Smart thermostats use technology to control a home's heat. What is one impact?", "they can help save energy", ["they make the home colder in every case", "they stop all winters", "they need no electricity"], "Emerging technologies can change everyday life.", "🌡️"),
];

export const units: Unit[] = [
  {
    id: "plant-parts",
    title: "Plant Parts & Needs",
    emoji: "🌱",
    blurb: "Roots, stems, leaves, flowers and what plants need",
    standards: on("B2.1, B2.2", "the basic needs of plants, and the parts of plants and what each part does"),
    parentNote: "Roots, stems, leaves, flowers (with the stamen and pistil), fruit, seeds and cones, plus what plants need to live: air, water, light, heat, nutrients and space.",
    generate: bankUnit(PLANT_PARTS, { sorts: [PLANT_PARTS_SORT, PLANT_NEEDS_SORT] }),
  },
  {
    id: "plant-life",
    title: "How Plants Grow & Change",
    emoji: "🌻",
    blurb: "Life cycles, seeds, and making food from sunlight",
    standards: on("B2.3, B2.4, B2.5", "life cycles, how plants adapt and react to their surroundings, and photosynthesis"),
    parentNote: "From seed to flower and back to seed, how seeds travel, how plants react to light and seasons, and how they use sunlight, water and carbon dioxide to make food and release oxygen.",
    generate: bankUnit(PLANT_LIFE, { sorts: [SEED_TRAVEL_SORT], orders: [BEAN_ORDER] }),
  },
  {
    id: "plants-people",
    title: "Plants & People",
    emoji: "🌽",
    blurb: "Food, shelter, local plants and protecting habitats",
    standards: on("B1.1–B1.3, B2.6–B2.8", "how people use plants, local and Indigenous plant foods, and how people can protect plants and plant habitats"),
    parentNote: "How people and animals depend on plants for food, shelter, clothing and medicine, including plants grown and harvested by First Nations in Ontario today, local food, and simple ways to protect native plants.",
    generate: bankUnit(PLANT_PEOPLE, { sorts: [PLANT_USES_SORT, HELP_HARM_SORT, PLANT_NEED_SORT] }),
  },
  {
    id: "forces-3",
    title: "Pushes, Pulls & Forces",
    emoji: "🧲",
    blurb: "Gravity, magnets, friction and changing motion",
    standards: on("C1.1, C1.2, C2.1–C2.4", "contact and non-contact forces, how forces change motion and shape, and how safety devices reduce harm"),
    parentNote: "Forces as pushes and pulls, contact and non-contact forces (gravity, magnetism, static electricity), friction, how bigger forces change motion more, and helmets and seat belts as safety devices.",
    generate: bankUnit(FORCES, { sorts: [CONTACT_SORT] }),
  },
  {
    id: "structures-3",
    title: "Structures & Their Jobs",
    emoji: "🏗️",
    blurb: "Natural and built structures, form and function",
    standards: on("D1.1, D1.2, D2.1, D2.2", "structures in nature and the built world, form and function, and how structures affect society and the environment"),
    parentNote: "What makes something a structure, how its shape fits its job (a bowl-shaped nest, a sloped roof), structures built by animals and by people, and how they change the environment.",
    generate: bankUnit(STRUCTURES, { sorts: [STRUCTURE_SORT] }),
  },
  {
    id: "strong-stable",
    title: "Strong & Stable",
    emoji: "🌉",
    blurb: "Strength, stability, struts and ties",
    standards: on("D2.3–D2.7", "strength and stability, materials, forces on structures, and struts and ties"),
    parentNote: "Strength as holding a load and stability as staying balanced, how shape, a wide base and materials help, and how struts (pushed) and ties (pulled) work in a frame.",
    generate: bankUnit(STRONG, { sorts: [STRUT_SORT, STABLE_SORT] }),
  },
  {
    id: "soil-3",
    title: "What Soil Is Made Of",
    emoji: "🪱",
    blurb: "Living and non-living parts, and soil types",
    standards: on("E1.1, E2.1, E2.3", "the living and non-living parts of soil, healthy soil, and soil types in Ontario"),
    parentNote: "Living and non-living parts of soil, humus and topsoil, sandy, clay and loam soils and how fast water drains through them, and how soils across Ontario suit different crops.",
    generate: bankUnit(SOILS, { sorts: [SOIL_LIVING_SORT] }),
  },
  {
    id: "soil-care",
    title: "Caring for Soil",
    emoji: "♻️",
    blurb: "Compost, erosion and healthy soil",
    standards: on("E1.1, E1.2, E2.2, E2.4–E2.6", "things added to soil, erosion, composting, and ways to keep soil healthy in Ontario"),
    parentNote: "Composting, how fertilizer and road salt affect soil, how erosion happens and how plants, windbreaks and cover crops protect soil.",
    generate: bankUnit(SOIL_CARE, { sorts: [COMPOST_SORT, SOIL_HEALTH_SORT], orders: [EROSION_ORDER, COMPOST_ORDER] }),
  },
  {
    id: "skills-3",
    title: "Science Skills & Safety",
    emoji: "🥽",
    blurb: "Fair tests, safety, design and coding",
    standards: on("A1.1–A1.5, A2.1, A2.2, A3.1–A3.3", "investigating, safety, the design process, coding and debugging, and science in everyday life"),
    parentNote: "Making predictions and observations, running a fair test that changes one thing, using simple tools safely, the engineering design steps, debugging a simple program, and how science helps solve real problems.",
    generate: bankUnit(SKILLS, { sorts: [SAFE_SORT], orders: [DESIGN_ORDER] }),
  },
];
