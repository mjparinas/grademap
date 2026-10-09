import { numberChoice, randInt, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { levelOf, on } from "./kit";
import { e, order, q, sorter, unitOf, type Item } from "./k-g2-kit";

// Ontario Kindergarten science and technology, from the Kindergarten Curriculum (2026):
// B11 coding, B12 scientific investigation and engineering design, B13 exploring environments.
// BC's living-things, animal, materials, push-and-pull and weather units are shared (see k.ts).

// ---------- Be a Scientist ----------

const SCIENTIST: Item[] = [
  q("Before a test, we guess what will happen. That guess is a…", "prediction", ["tool", "snack"], "A prediction is what you think will happen before you try it.", { emoji: "🤔" }),
  q("Which one is a prediction?", "I think the ball will roll.", ["The ball is red.", "The ball is round."], "A prediction says what you think will happen. The other two tell what you see."),
  q("Which one is something you see, or an observation?", "The leaf is green.", ["I think it will fall.", "Let's go outside."], "An observation tells what you notice with your senses."),
  q("Which tool helps you see tiny things up close?", e("magnifying glass", "🔍"), [e("ruler", "📏"), e("measuring cup", "🥛")], "A magnifying glass makes small things look bigger."),
  q("Which tool tells you how long a pencil is?", e("ruler", "📏"), [e("magnifying glass", "🔍"), e("measuring cup", "🥛")], "We use a ruler to measure length."),
  q("Which tool helps you find how much water is in a jug?", e("measuring cup", "🥛"), [e("ruler", "📏"), e("magnifying glass", "🔍")], "A measuring cup tells how much liquid there is."),
  q("Which tool helps you find out which rock is heavier?", e("balance scale", "⚖️"), [e("ruler", "📏"), e("magnifying glass", "🔍")], "A balance scale compares how heavy things are."),
  q("Which one is a good science question?", "Will a rock float?", ["Is it lunchtime yet?", "Do you like my shirt?"], "A science question is something we can find out by trying or looking."),
  q("Which body part do you use to hear a bird sing?", e("ears", "👂"), [e("eyes", "👀"), e("nose", "👃")], "We hear with our ears.", { emoji: "🐦" }),
  q("Which body part do you use to smell a flower?", e("nose", "👃"), [e("ears", "👂"), e("eyes", "👀")], "We smell with our nose.", { emoji: "🌸" }),
  q("What can you do to remember what you saw?", "Draw a picture", ["Cover the thing up", "Close your eyes"], "Scientists draw, write or tell about what they see.", { emoji: "✏️" }),
  q("After a test, what do scientists do?", "Tell what they found out", ["Hide the results", "Never look at it again"], "Sharing what we found out is how we learn from a test."),
  q("We want to know if a sponge soaks up water. What do we do?", "Try it and watch", ["Just guess", "Ask a pet"], "Scientists test things and watch what happens.", { emoji: "🧽", d: 2 }),
  q("You guessed the paper would float. It sank. What do you do?", "Say what really happened", ["Say it floated", "Throw the paper away"], "Scientists share what really happened, even when the guess was not right.", { d: 2 }),
  q("You want to find out which toy is the heaviest. What do you pick?", e("balance scale", "⚖️"), [e("ruler", "📏"), e("magnifying glass", "🔍")], "A balance scale shows which side is heavier.", { d: 2 }),
  q("Which words tell what you see?", "big, round, red", ["I want a snack", "Let's go inside"], "Describing words such as big, round and red tell what you observe.", { d: 3 }),
];

// ---------- Build and Test ----------

const BUILD: Item[] = [
  q("A tower keeps falling over. What can you try?", "Make the bottom wider", ["Make it taller", "Push it harder"], "A wide base helps a tower stand up.", { emoji: "🧱" }),
  q("Which tower is the steadiest?", "wide at the bottom", ["wide at the top", "very thin all the way"], "Structures with a wide bottom are harder to knock over."),
  q("What is a model?", "A small copy of something", ["A kind of food", "A loud noise"], "A model shows how something looks or works, like a toy house."),
  q("Which one is a model of a car?", e("a toy car", "🚗"), [e("a real tree", "🌳"), e("a cloud", "☁️")], "A toy car is a small copy of a real one."),
  q("Which material is best for a tall, steady tower?", "wooden blocks", ["cooked noodles", "tissue paper"], "Blocks are firm and stack well.", { emoji: "🪵" }),
  q("Which material keeps rain out of a model shelter?", "a plastic sheet", ["paper", "a cotton ball"], "Plastic keeps water out. Paper and cotton soak it up.", { emoji: "🌧️" }),
  q("Which one will fasten two pieces of paper together?", "tape", ["a feather", "a puddle"], "Tape sticks things together.", { emoji: "📎" }),
  q("Which tool is safe for cutting paper in class?", "safety scissors", ["a hammer", "a saw"], "Safety scissors are made for kids to use with care."),
  q("Your bridge bends when a toy car crosses. What next?", "Try a stronger design", ["Give up", "Do not tell anyone"], "Builders test, then make the design better.", { d: 2 }),
  q("Which block is best for the bottom of a tower?", "the biggest block", ["the smallest block", "a feather"], "Big, flat blocks make a good base.", { d: 2 }),
  q("You want to build a boat that floats. Which is a good material?", "foam", ["a rock", "a metal key"], "Foam is light and floats on water.", { emoji: "⛵", d: 2 }),
  q("A fence keeps toys from rolling away. What does a fence do?", "It holds things in", ["It makes things fly", "It makes things hot"], "Structures like fences and walls have a job to do.", { d: 2 }),
  q("You test a model and it works! What can you do?", "Share it with the class", ["Hide it", "Break it right away"], "Sharing what we made helps others learn too.", { d: 3 }),
  q("Why do we test a model before using it?", "To see if it works", ["To make it dirty", "To make it disappear"], "Testing shows what works and what to fix.", { d: 3 }),
  q("Which has a stronger shape for a bridge: flat paper or paper folded in pleats?", "folded in pleats", ["flat paper", "They are the same"], "Folding paper makes it stronger. Try it with a few books on top!", { d: 3 }),
];

const BUILD_STEPS = order("Put the steps in order. What do you do first?", "Plan first, build, test it, then make it better.", [
  ["Draw a plan", "✏️"],
  ["Build it", "🧱"],
  ["Test it", "🔬"],
  ["Make it better", "🔧"],
]);

// ---------- Safe Scientists ----------

const SAFE: Item[] = [
  q("What do you do if you see broken glass?", "Tell a grown-up", ["Pick it up", "Step on it"], "Never touch broken glass. Tell a grown-up right away.", { emoji: "⚠️" }),
  q("What do you wear on your head to ride a bike?", e("a helmet", "⛑️"), [e("a scarf", "🧣"), e("mittens", "🧤")], "A helmet protects your head."),
  q("You bump your head hard. What should you do?", "Tell a grown-up right away", ["Keep playing", "Hide it"], "A bump to the head can hurt your brain. Always tell a grown-up, even if you feel okay."),
  q("What do you wear to protect your eyes in an experiment?", e("goggles", "🥽"), [e("a hat", "🧢"), e("boots", "🥾")], "Safety goggles keep your eyes safe."),
  q("Do we taste things in a science experiment?", "No, never", ["Yes, every time", "Only if it smells good"], "We do not taste science materials. They might not be safe to eat."),
  q("Water spills on the floor. What do you do?", "Tell a grown-up so no one slips", ["Run through it", "Leave it for a surprise"], "Wet floors are slippery. A grown-up can help clean up."),
  q("When do we wash our hands?", "After touching soil or animals", ["Never", "Only on holidays"], "Washing hands keeps germs away.", { emoji: "🧼" }),
  q("A grown-up says, “Stop!” What do you do?", "Stop and listen", ["Run faster", "Close my ears"], "Stopping fast can keep you out of danger."),
  q("Which is a safe way to move in the classroom?", "Walk", ["Run", "Jump on the tables"], "Walking helps keep everyone safe."),
  q("Which is safe to put in your mouth?", "Only food from a grown-up", ["Small beads", "Soil"], "Never put science materials or small things in your mouth.", { d: 2 }),
  q("Why do we keep long hair tied back near machines or crafts?", "So it will not get caught", ["So it looks fancy", "So it gets wet"], "Loose hair can get caught.", { d: 2 }),
  q("You feel dizzy after a fall at recess. What do you do?", "Tell a grown-up", ["Say nothing", "Play more"], "Dizzy or sleepy after a bump means you need a grown-up to check on you.", { d: 2 }),
  q("When we play outside in the snow, why do we wear boots and mittens?", "To stay warm and safe", ["To make noise", "To go faster"], "The right clothes keep us safe from the cold.", { emoji: "❄️", d: 2 }),
  q("Sliding down a slide, which is the safe way?", "Sit down, feet first", ["Head first", "Standing up"], "Feet first and sitting keeps your head safe.", { d: 3 }),
  q("Why do we follow safety rules?", "To help everyone stay safe", ["To spoil the fun", "Only the teacher needs them"], "Safety rules help prevent injuries, including to your head.", { d: 3 }),
];

const SAFE_SORT = sorter({
  prompt: "Safe or not safe? Tap a picture, then its basket.",
  hint: "Think: could someone get hurt?",
  bins: [
    { id: "safe", label: "Safe", emoji: "✅" },
    { id: "unsafe", label: "Not safe", emoji: "🚫" },
  ],
  items: [
    { label: "wearing a helmet", emoji: "⛑️", bin: "safe" },
    { label: "walking inside", emoji: "🚶", bin: "safe" },
    { label: "washing hands", emoji: "🧼", bin: "safe" },
    { label: "wearing goggles", emoji: "🥽", bin: "safe" },
    { label: "telling a grown-up about a bump", emoji: "🗣️", bin: "safe" },
    { label: "running with scissors", emoji: "✂️", bin: "unsafe" },
    { label: "tasting soil", emoji: "🪱", bin: "unsafe" },
    { label: "climbing on a table", emoji: "🪑", bin: "unsafe" },
    { label: "touching broken glass", emoji: "💥", bin: "unsafe" },
    { label: "riding a bike with no helmet", emoji: "🚲", bin: "unsafe" },
  ],
});

// ---------- Follow the Steps (coding) ----------

const ARROWS = [
  { emoji: "⬆️", word: "up" },
  { emoji: "⬇️", word: "down" },
  { emoji: "⬅️", word: "left" },
  { emoji: "➡️", word: "right" },
];

const CODE_BANK: Item[] = [
  q("Which arrow points up?", e("up", "⬆️"), [e("down", "⬇️"), e("left", "⬅️")], "Up points toward the sky."),
  q("Which arrow points left?", e("left", "⬅️"), [e("right", "➡️"), e("up", "⬆️")], "Left is the same side as your left hand."),
  q("Which word is the opposite of forward?", "backward", ["above", "yesterday"], "Forward and backward are opposites."),
  q("Which word is the opposite of up?", "down", ["forward", "sideways"], "Up and down are opposites."),
  q("Which word is the opposite of left?", "right", ["under", "behind"], "Left and right are opposites."),
  q("A set of steps for a robot to follow is called…", "code", ["a snack", "a sound"], "Steps that tell a robot or computer what to do are called code.", { emoji: "🤖" }),
  q("A bird is above a tree. Where is the bird?", "higher than the tree", ["lower than the tree", "inside the tree"], "Above means higher up.", { emoji: "🐦" }),
  q("A mouse is under the table. Where is the mouse?", "below the table", ["on top of the table", "beside the table"], "Under means below something.", { emoji: "🐭" }),
  q("Which word tells you where the door is? “The door is beside the window.”", "beside", ["quickly", "yellow"], "Beside tells where. It means next to.", { d: 2 }),
  q("A robot's steps did not work. What do you do?", "Test it, find the mistake and fix it", ["Give up", "Do the same steps again"], "Coders test their steps and fix mistakes. This is called debugging.", { emoji: "🔧", d: 2 }),
  q("Why do we put steps in the right order?", "So the robot does the job right", ["So it gets lost", "So it falls asleep"], "A robot does the steps one at a time, in order.", { d: 2 }),
  q("Which way is 'turn around'?", "Face the other way", ["Jump up", "Sit down"], "Turning around means facing the opposite way.", { d: 2 }),
  q("You tell a friend: “Take 2 steps forward.” Where do you end up?", "2 steps in front of where you started", ["2 steps behind", "Right where you started"], "Forward means in the direction you are facing.", { d: 3 }),
  q("Which is a clear instruction?", "Take two steps forward", ["Go over there", "Do that thing"], "Clear instructions use exact words, like numbers and directions.", { d: 3 }),
];

const WASH_STEPS = order("Put the steps for washing hands in order.", "Wet, soap, scrub, rinse, then dry.", [
  ["Wet your hands", "💧"],
  ["Add soap", "🧼"],
  ["Scrub", "🫧"],
  ["Rinse", "🚿"],
  ["Dry", "🧻"],
]);

function robotPath(d: 1 | 2 | 3): Question {
  const len = d === 1 ? 3 : 4;
  const steps = Array.from({ length: len }, () => ARROWS[randInt(0, 3)]);
  const visual = { type: "emojiRow" as const, items: steps.map((s) => s.emoji) };
  const kind = d === 1 ? 0 : randInt(0, 2);
  if (kind === 0) {
    const first = steps[0].word;
    return textChoice("A robot follows the arrows. Which way does it go first?", first, sample(ARROWS.map((a) => a.word).filter((w) => w !== first), 2), "Start at the first arrow on the left.", visual);
  }
  if (kind === 1) {
    const last = steps[len - 1].word;
    return textChoice("A robot follows the arrows. Which way does it go last?", last, sample(ARROWS.map((a) => a.word).filter((w) => w !== last), 2), "The last arrow is the one on the right.", visual);
  }
  return numberChoice("How many steps does the robot take?", len, "Count each arrow. Each arrow is one step.", visual, { min: 1, max: 6 });
}

// ---------- Natural and Built ----------

const ENV: Item[] = [
  q("Which one was built by people?", e("a bridge", "🌉"), [e("a mountain", "⛰️"), e("a river", "🏞️")], "People make buildings, bridges and roads."),
  q("Which one is part of nature?", e("a tree", "🌳"), [e("a school", "🏫"), e("a road", "🛣️")], "Nature is the plants, animals, water and land that were not made by people."),
  q("Which one is a built place?", e("a library", "📚"), [e("a forest", "🌲"), e("a pond", "🪷")], "A library is a building people made."),
  q("Which one happens in nature?", "Rain falls from the clouds", ["A bus drives by", "A TV show starts"], "Rain, snow and wind happen in nature.", { emoji: "🌧️" }),
  q("What happens to snow when it gets warm?", "It melts", ["It turns green", "It barks"], "Warm air melts snow into water.", { emoji: "☃️" }),
  q("What do many leaves do in the fall?", "Change colour and fall", ["Turn into birds", "Grow bigger"], "In the fall, many leaves turn red, orange and yellow, and then fall.", { emoji: "🍁" }),
  q("A spider's web has a pattern. What is it made of?", "lines and circles", ["bricks", "windows"], "A web has lines from the middle and circles around them.", { emoji: "🕸️" }),
  q("A honeycomb has a pattern of…", "six-sided shapes", ["triangles only", "circles only"], "Bees build wax rooms with six sides called hexagons.", { emoji: "🐝", d: 2 }),
  q("A brick wall has a pattern. It is…", "the same bricks again and again", ["a different shape every time", "no pattern"], "Bricks are laid in a repeating pattern.", { emoji: "🧱", d: 2 }),
  q("Which natural thing has spots in a pattern?", e("a ladybug", "🐞"), [e("a rock", "🪨"), e("a spoon", "🥄")], "A ladybug's back has dots.", { d: 2 }),
  q("A zebra has stripes. Which built thing also has stripes?", "a crosswalk", ["a ball", "a plate"], "Both a zebra and a crosswalk have a pattern of stripes.", { emoji: "🦓", d: 2 }),
  q("A pond dries up in summer. What do the frogs need?", "a new place with water", ["more sand", "a bigger hat"], "Animals look for water when their pond dries up.", { emoji: "🐸", d: 3 }),
  q("You drop a stone in a pond. What shape are the ripples?", "circles that spread out", ["squares", "one straight line"], "Ripples are a pattern of rings that grow bigger.", { d: 3 }),
  q("Which is a pattern you see in a garden fence?", "pickets side by side", ["one big rock", "a cloud"], "A fence often has the same board again and again.", { d: 3 }),
  q("What do we call the plants and animals in a forest?", "living things", ["buildings", "tools"], "Plants and animals are living things.", { emoji: "🌲" }),
];

const ENV_SORT = sorter({
  prompt: "Natural or built? Tap a picture, then its basket.",
  hint: "Nature was not made by people. Built things were.",
  bins: [
    { id: "nature", label: "Nature", emoji: "🌿" },
    { id: "built", label: "Built", emoji: "🏗️" },
  ],
  items: [
    { label: "lake", emoji: "🏞️", bin: "nature" },
    { label: "tree", emoji: "🌳", bin: "nature" },
    { label: "mountain", emoji: "⛰️", bin: "nature" },
    { label: "flower", emoji: "🌼", bin: "nature" },
    { label: "bridge", emoji: "🌉", bin: "built" },
    { label: "house", emoji: "🏠", bin: "built" },
    { label: "school", emoji: "🏫", bin: "built" },
    { label: "road", emoji: "🛣️", bin: "built" },
  ],
});

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "be-a-scientist",
    title: "Be a Scientist",
    emoji: "🔬",
    blurb: "Ask, guess, look and tell",
    standards: on("B12.1–B12.4", "asking questions, making predictions and observations, choosing tools and sharing what we find out"),
    parentNote: "Asking a science question, predicting, observing with the senses, picking a tool such as a ruler or magnifying glass, and telling what was found out.",
    generate: unitOf(SCIENTIST),
  },
  {
    id: "build-and-test",
    title: "Build & Test",
    emoji: "🏗️",
    blurb: "Plan it, make it, test it",
    standards: on("B12.3, B12.5", "choosing materials and tools, and designing, building and testing models and structures"),
    parentNote: "Making a plan, choosing the right materials, building a model or structure, testing it and making it better.",
    generate: unitOf(BUILD, [BUILD_STEPS]),
  },
  {
    id: "safe-scientists",
    title: "Safe Scientists",
    emoji: "🥽",
    blurb: "Stay safe when we explore",
    standards: on("B12.6", "following safety rules to help prevent injuries, including concussion"),
    parentNote: "Safety rules for exploring and playing, such as wearing a helmet, telling a grown-up after a bump to the head, and never tasting science materials.",
    generate: unitOf(SAFE, [SAFE_SORT]),
  },
  {
    id: "follow-the-steps",
    title: "Follow the Steps",
    emoji: "🤖",
    blurb: "Directions, order and code",
    standards: on("B11.1–B11.3", "using directional and positional words, putting steps in order, and testing and fixing instructions"),
    parentNote: "Unplugged coding: words like up, down, left, right, above and below, following arrow instructions in order, and fixing mistakes in a set of steps.",
    generate: (opts?: GenerateOptions) => {
      const d = levelOf(opts);
      return shuffle([robotPath(d), robotPath(d), WASH_STEPS(d), ...unitOf(CODE_BANK)(opts).slice(0, 5)]);
    },
  },
  {
    id: "natural-and-built",
    title: "Natural & Built Places",
    emoji: "🌉",
    blurb: "Nature, buildings and patterns",
    standards: on("B13.1, B13.3", "describing natural occurrences and comparing patterns in natural and built environments"),
    parentNote: "Telling natural places from built ones, noticing what happens in nature (rain, melting, falling leaves) and spotting patterns such as stripes, spots and bricks.",
    generate: unitOf(ENV, [ENV_SORT]),
  },
];
