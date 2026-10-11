import { bankUnit, type Q } from "../own";

// Grade 7 science, Nova Scotia: interconnected life and Netukulimk (Environmental Action), and changing coastlines
// (Geological Evolution). Indigenous content is light, in the present tense, and needs partner review.

const LIFE: Q[] = [
  ["Which living things make their own food using sunlight?", "producers", ["consumers", "decomposers"], "Plants and algae are producers. They use sunlight, water and air to make food."],
  ["Which of these is a producer?", "kelp", ["a seal", "a mushroom"], "Kelp is a seaweed that makes its own food with sunlight."],
  ["An animal that eats other living things is a…", "consumer", ["producer", "decomposer"], "Consumers cannot make their own food, so they eat plants or other animals."],
  ["Which living things break down dead plants and animals?", "decomposers", ["producers", "predators"], "Fungi and bacteria are decomposers. They return nutrients to the soil."],
  ["Where does the energy in most food webs first come from?", "the Sun", ["the soil", "the wind"], "Producers capture the Sun’s energy, and it moves to everything that eats them."],
  ["In a food web, an arrow points…", "toward the living thing that eats", ["toward the Sun only", "away from the eater"], "The arrow shows the direction that energy moves."],
  ["A rabbit eats grass and a fox eats the rabbit. Which is the predator?", "the fox", ["the rabbit", "the grass"], "A predator hunts and eats other animals."],
  ["A food web differs from a food chain because it shows…", "many connected feeding links", ["only one path", "no animals"], "Most living things eat, and are eaten by, more than one kind of other living thing."],
  ["Which is a limiting factor for a population?", "the amount of food", ["the colour of the sky", "the name of a species"], "Food, water, space and shelter can limit how many living things survive."],
  ["If a deer population has too little food, the population will probably…", "get smaller", ["grow forever", "turn into a different animal"], "When resources run short, fewer animals can survive."],
  ["Two bird species both need the same nesting holes. This is…", "competition", ["mutualism", "decomposing"], "Competition happens when living things need the same limited resource."],
  ["Bees collect nectar from flowers and carry pollen between them. Both benefit. This is…", "mutualism", ["predation", "competition"], "In mutualism, both partners gain something."],
  ["Predation is when…", "one animal hunts and eats another", ["two plants share a pot", "a fungus grows on a log"], "Predators and prey affect each other’s numbers."],
  ["What does Netukulimk mean in the Mi’kmaw way of life?", "using what is needed from the land and sea in a way that keeps them healthy", ["taking as much as possible", "never using anything from nature"], "Netukulimk is about caring for the community, the environment and future generations."],
  ["Which people use the word Netukulimk?", "the Mi’kmaq", ["the Vikings", "the Loyalists"], "Netukulimk is a Mi’kmaw approach to living with the land and sea."],
  ["Netukulimk is meant to keep healthy…", "the community, the environment and future generations", ["only tomorrow’s supper", "only one season"], "Taking only what you need helps everyone, now and later.", true],
  ["Which is a sustainable way to harvest fish?", "take only what you need and leave enough to reproduce", ["catch every fish you see", "catch the smallest fish first and waste them"], "Sustainable means resources can last for a long time.", true],
  ["Overfishing happens when…", "fish are caught faster than they can reproduce", ["too many fish eat plants", "the ocean freezes"], "Fish populations can shrink when too many are taken.", true],
  ["What can happen if one species in a food web disappears?", "other species that depend on it may be affected", ["nothing changes at all", "every species grows bigger"], "Living things are connected, so one change can ripple through a web.", true],
  ["Which is an example of stewardship?", "planting trees along a stream", ["leaving trash on a beach", "using more water than needed"], "Stewardship means looking after the environment.", true],
  ["Which action would reduce human impact on local ecosystems?", "reducing waste and picking up litter", ["dumping chemicals in a stream", "cutting down all the forest"], "Small actions can protect habitats.", true],
  ["An animal that eats only plants is called a…", "herbivore", ["carnivore", "decomposer"], "Herb- is about plants. A moose is a herbivore."],
  ["A black bear eats berries, insects and fish. It is an…", "omnivore", ["herbivore", "decomposer"], "Omnivores eat both plants and animals."],
  ["Which is a nonliving part of an ecosystem?", "water", ["moss", "bacteria"], "Water, air, soil and sunlight are nonliving. Moss and bacteria are living."],
  ["All the members of one species living in the same area make up a…", "population", ["food chain", "habitat"], "A population is a group of the same kind of living thing in one place."],
  ["The place where a living thing finds food, water and shelter is its…", "habitat", ["species", "predator"], "A habitat is a living thing's home in nature."],
  ["A fox is removed from a meadow. What might happen to the rabbits at first?", "They could increase in number", ["They disappear at once", "They turn into foxes"], "With fewer predators, more rabbits may survive.", true],
  ["An invasive species is…", "a non-native species that spreads and harms its new ecosystem", ["a species that is dying out", "a pet that lives indoors"], "Invasive species can crowd out the plants and animals that already live there.", true],
];

const COAST: Q[] = [
  ["Nova Scotia has a very long…", "coastline", ["mountain range", "desert"], "Nova Scotia is almost surrounded by the Atlantic Ocean, the Bay of Fundy and the Gulf of St. Lawrence."],
  ["Erosion is…", "the wearing away of rock and soil", ["the building of new rock", "the freezing of water"], "Waves, wind and ice can slowly wear away the shore."],
  ["Which of these can erode a coastline?", "waves", ["fresh air", "starlight"], "Moving water carries away small pieces of rock and soil."],
  ["Deposition is when…", "material is dropped and builds up in a new place", ["rock is worn away", "the tide goes out"], "Sand dropped by waves can build a beach."],
  ["A beach is usually formed by…", "deposition of sand or small stones", ["volcanoes", "glaciers only"], "Waves carry sand and leave it on the shore."],
  ["A long narrow strip of sand or gravel that sticks out from land into the water is a…", "spit", ["cliff", "bay"], "Spits form when waves and currents drop sand along a shoreline."],
  ["A point of land that sticks out into the sea is a…", "headland", ["bay", "dune"], "Headlands often stand where the rock is hard and resists erosion."],
  ["A curved opening of the sea into the land is a…", "bay", ["headland", "sea stack"], "Bays often form where softer rock has worn away."],
  ["A tall, steep face of rock beside the sea is a…", "cliff", ["spit", "dune"], "Cliffs form as waves cut into rock."],
  ["A column of rock left standing in the sea after the rest has eroded is a…", "sea stack", ["spit", "salt marsh"], "Waves cut away a headland, leaving stacks behind."],
  ["Sand hills piled up by wind are called…", "dunes", ["dykes", "stacks"], "Dunes are built by wind and held by grasses."],
  ["Which rock erodes faster?", "soft sandstone", ["hard granite", "very hard quartz"], "Rock type affects how quickly a coast changes."],
  ["Tides are mostly caused by the pull of the…", "Moon", ["wind", "clouds"], "The Moon’s gravity (with the Sun’s) pulls the ocean."],
  ["Which bay in the Maritimes has the highest tides in the world?", "the Bay of Fundy", ["Hudson Bay", "Chaleur Bay"], "The Bay of Fundy’s tides can rise and fall more than 10 metres."],
  ["About how often does the tide rise and fall at a coast?", "twice a day", ["once a year", "once a month"], "There are usually two high tides and two low tides each day."],
  ["A storm surge is…", "a temporary rise in sea level caused by a storm", ["a type of rock", "a very low tide"], "Strong winds push water onto shore during storms.", true],
  ["Why is sea level rising around the world?", "warming oceans expand and glaciers melt", ["the Moon is moving away", "rivers stopped flowing"], "More water and warmer water mean higher seas.", true],
  ["What is a salt marsh?", "low land flooded by salty tides, full of grasses", ["a mountain lake", "a sand dune"], "Salt marshes are flooded by tides and are home to many plants and animals.", true],
  ["Acadians built dykes to…", "keep the sea water out so they could farm marsh land", ["make beaches", "build cliffs"], "Dykes are walls of earth that hold back tides.", true],
  ["How can salt marshes protect a coast?", "their plants soak up wave energy and hold the soil", ["they make waves bigger", "they have no effect"], "Marsh grasses slow water and keep soil in place.", true],
  ["A living shoreline protects a coast by using…", "plants and natural materials", ["only concrete", "only steel"], "Living shorelines work with nature to reduce erosion.", true],
  ["What is a seawall?", "a hard wall built to block waves", ["a type of tide", "a type of marsh"], "Seawalls protect land but can be costly and change nearby beaches.", true],
  ["Moving buildings back from a shrinking shoreline is called…", "managed retreat", ["deposition", "a storm surge"], "Sometimes moving away is the safest way to protect people.", true],
  ["Which coastal landform is made by erosion?", "sea cave", ["dune", "beach"], "Waves can carve into a cliff and leave a cave. Dunes and beaches are built by deposition."],
  ["Waves crashing against a cliff over many years are most likely to…", "wear the rock away", ["build the cliff taller", "freeze the sea"], "Waves carry away small pieces of rock each time they hit."],
  ["At low tide, the shore usually…", "shows more land or sea floor", ["is always underwater", "turns into rock"], "When the water is low, more of the shore is uncovered."],
  ["Which weather event can speed up coastal erosion?", "a strong storm with big waves", ["a calm sunny day", "a light breeze"], "Bigger waves carry more energy and wear away more shore."],
  ["Longshore drift moves sand…", "along the shore in a zigzag path", ["straight inland", "down to the deep sea floor"], "Waves hit at an angle, so sand shifts sideways along the beach.", true],
];

export const netukulimk = bankUnit({
  id: "ns-netukulimk-7",
  title: "Netukulimk & Interconnected Life",
  emoji: "🌿",
  blurb: "How living things depend on each other, and how we can care for them.",
  parentNote:
    "Practises how living things and their environment are connected: food webs, energy flow, populations, relationships and human impact. It includes Netukulimk, the Mi’kmaw approach of taking what is needed from the land and sea in a way that keeps everything healthy for the future. Indigenous content is light and will be reviewed with community partners.",
  standards: [
    "Environmental Action",
    "food webs, producers, consumers, decomposers, relationships, human impact, Netukulimk and stewardship",
  ],
  items: LIFE,
  size: 8,
});

export const coastlines = bankUnit({
  id: "ns-coastlines-7",
  title: "Changing Coastlines",
  emoji: "🌊",
  blurb: "How waves, tides and storms shape the shore, and how people protect it.",
  parentNote:
    "Practises how Nova Scotia’s coastlines are shaped by erosion and deposition, the tides of the Bay of Fundy, storm surges and sea-level rise, and how people protect the shore with salt marshes, dykes, living shorelines and seawalls.",
  standards: [
    "Geological Evolution",
    "erosion, deposition, coastal landforms, tides, sea-level rise and ways to protect the coast",
  ],
  items: COAST,
});
