import { bankUnit, type Q } from "../own";

// Kindergarten (Primary) science: exploring sand and water with the senses.

const SAND_WATER: Q[] = [
  ["Which one is wet?", "a dripping sponge", ["a dry rock", "a pile of dry sand"], "Wet things have water on them or in them."],
  ["Which one is dry?", "a pile of dry sand", ["a puddle", "a dripping sponge"], "Dry things have no water on them."],
  ["You pour water from a cup. Where does it go?", "down", ["up", "it stays in the air"], "Water falls down when we pour it."],
  ["Sand is poured from a cup. It falls…", "down", ["up", "sideways and stops"], "Sand falls down, just like water."],
  ["What can you use to scoop sand?", "a shovel", ["a feather", "a sheet of paper"], "A shovel or a cup can hold sand."],
  ["Which one can you pour?", "water", ["a rock", "a block"], "Water flows, so we can pour it."],
  ["A small rock goes into a bucket of water. It…", "sinks", ["floats", "flies"], "Heavy things like rocks sink to the bottom."],
  ["A leaf goes onto a puddle. It…", "floats", ["sinks fast", "turns to sand"], "Light things like leaves float on top."],
  ["Which one floats on water?", "a cork", ["a rock", "a coin"], "A cork is light, so it floats."],
  ["Which one sinks in water?", "a rock", ["a leaf", "a cork"], "A rock is heavy, so it sinks."],
  ["A sponge is put in water. It soaks up water. We say it…", "absorbs water", ["is a rock", "is a shovel"], "Absorb means to soak up."],
  ["A raincoat keeps you dry. The water…", "rolls off", ["soaks right in", "turns to sand"], "A raincoat keeps water out."],
  ["Which one soaks up water best?", "a towel", ["a plastic bag", "a raincoat"], "Towels are soft and soak up water."],
  ["Dry sand feels…", "gritty and loose", ["sticky and sloppy", "cold like ice"], "Dry sand is made of tiny grains that slide apart."],
  ["Wet sand is easy to…", "shape and build with", ["blow away", "pour like water"], "Wet sand sticks together, so it makes good castles."],
  ["Which sound does water make when it pours?", "splash", ["crunch", "crackle"], "Splash, splash! Water makes a splashing sound."],
  ["You pour lots of water on dry sand. The sand turns…", "darker", ["pink", "dry"], "Wet sand looks darker than dry sand."],
  ["Which container is the best for carrying water?", "a bucket with no holes", ["a basket", "a net"], "Water leaks out of holes."],
  ["Which container holds more water?", "a big bucket", ["a tiny cup", "a spoon"], "A bigger container can hold more.", true],
  ["You pour water through a strainer. The water…", "runs through the holes", ["stays in the strainer", "turns into sand"], "A strainer has little holes. Water goes through them.", true],
  ["You pour sand through a strainer. What can the holes catch?", "big rocks", ["all of the water", "the wind"], "Little holes let tiny sand grains through but hold bigger things.", true],
  ["A block of wood is put in water. It floats. This tells us the wood is…", "light enough to float", ["too heavy to float", "made of sand"], "Some wood floats because it is light for its size.", true],
  ["Tall cup of water is poured into a wide bowl. How much water is there?", "the same", ["more", "less"], "Pouring water into a new shape does not make more or less.", true],
  ["What happens to a puddle on a sunny day?", "it dries up", ["it gets bigger", "it turns into sand"], "The warm sun dries water away.", true],
  ["A wet sandcastle stays up. A dry sand pile…", "slides apart", ["stays up better", "turns to water"], "Wet sand sticks together. Dry sand slides.", true],
];

export const sandAndWater = bankUnit({
  id: "ns-sand-and-water",
  title: "Sand & Water",
  emoji: "🏖️",
  blurb: "Pour it, scoop it, float it and sink it!",
  parentNote:
    "Practises exploring sand and water with the senses: wet and dry, pouring and scooping, sinking and floating, and soaking up water. It follows the Primary physical science outcome on sand and water in the Nova Scotia curriculum.",
  standards: ["Physical Science: Sand and water", "Explore sand and water with the senses: wet and dry, pour and scoop, sink and float"],
  items: SAND_WATER,
});
