import { bankUnit, type Q } from "../own";

// Grade 3 science: basic needs and life cycles (SCI.3.E.12, SCI.3.E.13) and speed and motion (SCI.3.E.9 to SCI.3.E.11).

const LIFE: Q[] = [
  ["Which is a basic need of all living things?", "Food or energy", ["A toy", "A television"], "Living things need food, water and air."],
  ["Plants make their own food using sunlight, air and…", "water", ["milk", "sand only"], "Plants use sunlight, air and water to make food."],
  ["Animals get their food by…", "eating plants or other animals", ["making it from sunlight", "drinking only air"], "Animals cannot make their own food."],
  ["Which is NOT a basic need of a pet fish?", "A video game", ["Clean water", "Food"], "Fish need water, food and a safe place to live."],
  ["A habitat is…", "the place where an organism lives", ["a type of food", "a kind of weather"], "A habitat meets an organism's needs."],
  ["A bird builds a nest for…", "shelter and raising young", ["playing games", "making tools for school"], "Shelter protects animals and their young."],
  ["Most living things need air because…", "they need gas to live", ["they like wind", "it makes them tall"], "Plants and animals use air in different ways."],
  ["A plant kept in a dark cupboard would…", "grow weak without light", ["grow stronger", "make extra food"], "Plants need light to make food."],
  ["A life cycle is…", "the stages a living thing goes through during its life", ["a bicycle path", "a kind of food chain"], "Life cycles describe how a living thing grows and changes."],
  ["A butterfly starts life as an…", "egg", ["adult", "cocoon"], "The cycle is egg, larva, pupa, adult."],
  ["A caterpillar is the _____ stage of a butterfly.", "larva", ["egg", "adult"], "The caterpillar is the larva."],
  ["What stage comes after the caterpillar?", "pupa (chrysalis)", ["egg", "adult hatching"], "Larva, then pupa, then the adult butterfly."],
  ["Which animal changes shape completely as it grows (metamorphosis)?", "frog", ["dog", "cat"], "Frogs change from tadpoles to adults."],
  ["A baby frog that lives in water and has a tail is a…", "tadpole", ["chick", "pup"], "Tadpoles grow legs and lose their tails."],
  ["A chick hatches from an…", "egg", ["seed", "pupa"], "Birds hatch from eggs."],
  ["Which has a life cycle that starts as a seed?", "A bean plant", ["A frog", "A butterfly"], "Plants begin as seeds."],
  ["A seed grows into a…", "seedling", ["egg", "tadpole"], "A seedling is a young plant."],
  ["Which is the right order for a plant?", "seed, seedling, adult plant, seeds", ["adult plant, seed, seedling", "seedling, seed, adult plant"], "A plant grows from seed to adult and makes more seeds."],
  ["Which pair grows up looking like smaller adults?", "puppy and dog", ["caterpillar and butterfly", "tadpole and frog"], "Puppies look like small dogs."],
  ["An organism that stops getting food will eventually…", "become weak or die", ["grow faster", "get younger"], "All organisms need food."],
  ["Why do plants need roots?", "To take in water and hold the plant", ["To fly", "To play"], "Roots absorb water and anchor the plant."],
  ["Why do animals need water?", "To stay alive", ["To make noise", "To build tunnels"], "All living things need water."],
  ["A polar bear's thick fur helps it meet the need for…", "warmth", ["food from the Sun", "water in a stream"], "Fur is an adaptation for keeping warm."],
  ["The adult stage of a life cycle can…", "make new young", ["only sleep", "turn into rock"], "Adults reproduce so the life cycle can start again."],
  ["Many seeds are carried by wind, animals or…", "water", ["glass", "metal"], "Seeds travel in different ways."],
  ["A drought (no rain) is hard for plants because they lack…", "water", ["sunlight", "air"], "Plants need water to live.", true],
  ["Two different animals both live in a pond. They share the pond to meet their…", "needs", ["homework", "toys"], "Animals meet needs in their habitat.", true],
  ["A puppy and a butterfly are different because the butterfly…", "changes form in its life cycle", ["has no life cycle", "never eats"], "Butterflies go through metamorphosis.", true],
];

export const life = bankUnit({
  id: "mb-needs-life-cycles",
  title: "Basic Needs & Life Cycles",
  emoji: "🦋",
  blurb: "What living things need, and the stages of their lives.",
  parentNote:
    "Practises the basic needs of organisms (food, water, air, shelter) and the life cycles of plants and animals, including metamorphosis in butterflies and frogs.",
  standards: ["SCI.3.E.12, SCI.3.E.13", "the basic needs of organisms and the life cycles of plants and animals"],
  items: LIFE,
});

const SPEED: Q[] = [
  ["Speed tells us…", "how fast something moves", ["how heavy it is", "what colour it is"], "Speed is the distance an object travels in a certain time."],
  ["A cyclist goes 10 m in 1 second. A runner goes 5 m in 1 second. Who is faster?", "the cyclist", ["the runner", "they are the same"], "More distance in the same time means faster."],
  ["A car travels 60 km in one hour. A bike travels 15 km in one hour. Which has greater speed?", "the car", ["the bike", "they are the same"], "The car goes farther in the same time."],
  ["Which unit could measure how far something travels?", "metres", ["seconds", "kilograms"], "Distance is measured in metres or kilometres."],
  ["Which unit could measure the time something takes?", "seconds", ["metres", "litres"], "Time is measured in seconds, minutes and hours."],
  ["Two toy cars start together. After 5 seconds Car A has gone 20 cm and Car B has gone 35 cm. Which is faster?", "Car B", ["Car A", "They are equal"], "Car B travelled farther in the same time."],
  ["A snail goes slowly because it…", "travels a short distance in a long time", ["has no body", "is heavy like a rock"], "Slow means little distance in a lot of time."],
  ["An object at rest stays at rest unless…", "a force acts on it", ["it is tired", "it gets hungry"], "This idea is called inertia."],
  ["Inertia means objects…", "keep doing what they are doing until a force changes it", ["always speed up", "always stop"], "Moving things keep moving; still things stay still."],
  ["You are in a car that suddenly stops. Your body leans forward because of…", "inertia", ["hunger", "cold weather"], "Your body wants to keep moving."],
  ["A ball rolls on grass and stops sooner than on ice. This is because of…", "friction", ["magnets", "gravity only"], "Friction slows moving objects."],
  ["Which surface has the most friction?", "Rough carpet", ["Smooth ice", "Wet glass"], "Rough surfaces have more friction."],
  ["How quickly an object speeds up depends on the size of the force and its…", "mass", ["colour", "name"], "A bigger mass needs a bigger force."],
  ["Which is easier to speed up with a push?", "An empty cart", ["A full cart", "A cart full of bricks"], "Less mass is easier to move."],
  ["To make a toy car go faster, you should push…", "harder", ["more softly", "in the opposite direction"], "A stronger push gives more speed."],
  ["Speed is found by thinking about distance and…", "time", ["colour", "price"], "Speed describes distance over time."],
  ["Which describes a fast-moving object?", "Covers a lot of distance in a short time", ["Covers a little distance in a long time", "Does not move"], "Fast means more distance in less time."],
  ["Which would be a good way to compare the speed of two toy cars?", "Time how long each takes to go the same distance", ["Colour them", "Weigh the track"], "A fair test keeps the distance the same."],
  ["In a fair test of speed, you should keep the track…", "the same for each car", ["different each time", "wet for one car only"], "Only one thing should change."],
  ["A ramp that is steeper makes a toy car go…", "faster", ["slower", "backwards"], "A steeper ramp gives a bigger pull from gravity."],
  ["After you stop pedalling, a bike slows down because of…", "friction and air", ["more energy", "it getting younger"], "Forces slow it down."],
  ["A rolling ball keeps going until a force…", "slows or stops it", ["thanks it", "gives it a name"], "Forces change motion."],
  ["A heavier shopping cart needs a ___ push to start moving than a light one.", "bigger", ["smaller", "no"], "More mass needs more force."],
  ["Which object is moving at constant speed?", "An elevator moving 1 floor every 2 seconds the whole way", ["A ball being dropped and speeding up", "A car braking"], "Constant speed means the speed does not change.", true],
  ["Runner A goes 100 m in 20 s. Runner B goes 100 m in 25 s. Who is faster?", "Runner A", ["Runner B", "Same"], "Less time for the same distance is faster.", true],
  ["Two equal pushes are given to a small and a large box. The large box speeds up…", "less", ["more", "the same"], "More mass means less change in motion for the same push.", true],
];

export const speed = bankUnit({
  id: "mb-speed-and-motion",
  title: "Speed & Motion",
  emoji: "🏎️",
  blurb: "Fast and slow, why things keep moving, and what changes how quickly motion changes.",
  parentNote:
    "Practises speed as the distance an object travels in a certain time, inertia (objects keep doing what they are doing until a force acts), and how mass and force affect how quickly motion changes.",
  standards: ["SCI.3.E.9, SCI.3.E.10, SCI.3.E.11", "speed, inertia, and how mass and force affect how quickly motion changes"],
  items: SPEED,
});
