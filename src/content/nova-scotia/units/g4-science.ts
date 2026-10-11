import { bankUnit, type Q } from "../own";

// Grade 4 science, Nova Scotia: habitats and how living and non-living things in them depend on each other.
// Mi'kmaw content (Netukulimk) is light, in the present tense, and needs partner review.

const HABITATS: Q[] = [
  ["A habitat is…", "the place where a plant or animal lives and finds what it needs", ["a kind of weather", "a type of rock"], "A habitat gives food, water, shelter and space."],
  ["Which of these is a habitat you could find in Nova Scotia?", "salt marsh", ["desert", "rainforest"], "Salt marshes grow where the sea tide reaches the land."],
  ["What do living things need from their habitat?", "food, water, air and shelter", ["video games and toys", "paved roads"], "All living things need these basics to survive."],
  ["Which of these is non-living in a forest habitat?", "soil", ["spruce tree", "moose"], "Soil, water, air and sunlight are non-living parts of a habitat."],
  ["Which of these is a living part of a pond habitat?", "frog", ["rock", "water"], "Frogs are animals, so they are living things."],
  ["Which tree stays green all year and has needles?", "spruce", ["maple", "birch"], "Spruce is an evergreen. Maple leaves change colour and fall in autumn."],
  ["Which tree has leaves that turn red and fall off in autumn?", "maple", ["spruce", "fir"], "Maple is a broad-leaf tree that drops its leaves."],
  ["Moose eat leaves, twigs and water plants. They are…", "herbivores", ["carnivores", "decomposers"], "Herbivores eat only plants."],
  ["White-tailed deer eat plants such as grasses, buds and leaves. Deer are…", "herbivores", ["carnivores", "producers"], "Animals that eat plants are herbivores."],
  ["An osprey dives to catch fish. An osprey is a…", "carnivore", ["herbivore", "producer"], "Carnivores eat other animals."],
  ["Plants make their own food using sunlight. They are called…", "producers", ["consumers", "decomposers"], "Producers make food. Consumers eat food."],
  ["Which of these is a decomposer?", "mushroom", ["osprey", "salmon"], "Mushrooms are fungi that break down dead plants and animals."],
  ["What do decomposers do?", "break down dead things and return nutrients to the soil", ["hunt other animals", "make food from sunlight"], "Decomposers help recycle nutrients so plants can grow."],
  ["Which is a food chain?", "grass → deer → bobcat", ["bobcat → deer → grass", "deer → grass → sunlight"], "Arrows show food moving from what is eaten to what eats it."],
  ["In a food chain, where does the energy start?", "with the sun", ["with the predator", "with the soil only"], "The sun helps plants make food, and animals get energy from plants or other animals."],
  ["Eelgrass grows underwater near the coast. Why is it useful?", "Small fish and crabs hide and feed in it", ["It is used to build roads", "It keeps the ocean from moving"], "Many young sea animals use eelgrass as a nursery."],
  ["Where does a piping plover (a small shorebird) nest?", "on sandy beaches", ["in tall spruce trees", "in a pond"], "Piping plovers lay eggs in shallow dents in the sand, so people should keep away from their nests."],
  ["What helps hold sand in place on a sand dune?", "the roots of dune grass", ["big rocks", "ocean waves"], "Dune grass roots help stop the wind from blowing the dune away."],
  ["Which animal lives on the rocky ocean floor near the coast?", "lobster", ["moose", "white-tailed deer"], "Lobsters hide in rocky spaces on the sea floor."],
  ["Atlantic salmon spend part of their lives in rivers and part in the ocean. This shows that…", "habitats can be connected", ["fish do not need water", "rivers and oceans are the same"], "Animals may use more than one habitat during their lives."],
  ["At low tide, a tidal flat shows…", "wet mud and sand where birds look for food", ["deep forest", "fresh snow"], "Many shorebirds search the tidal flats for small creatures."],
  ["Which pair is a predator and its prey?", "osprey and fish", ["moose and maple tree", "spruce and soil"], "A predator hunts another animal, called its prey.", true],
  ["The predators that eat deer are removed from a forest. What may happen to the deer?", "There may be too many, and they might eat too many plants", ["They will stop eating", "Nothing will change"], "A habitat stays balanced when each part has its place.", true],
  ["A pond becomes polluted. Which animals could be harmed?", "the fish and also the animals that eat the fish", ["only the fish", "no animals at all"], "Pollution can move up a food chain.", true],
  ["Why do many animals in a habitat depend on each other?", "They share food, shelter and space", ["They never meet each other", "They do not need anything"], "Living things in a habitat are connected.", true],
  ["A bald eagle, a deer, a mushroom and a spruce tree live in the same forest. Which one is a decomposer?", "mushroom", ["bald eagle", "spruce tree"], "Decomposers break down dead plants and animals.", true],
  ["The Mi’kmaq teach that everything in nature is connected. Which idea matches this?", "A change in one part can affect many other parts", ["Each plant lives alone", "Animals do not need plants"], "Many Mi’kmaw families and communities teach respect for all living things.", true],
  ["Netukulimk (nay-DOO-gool-imk) is the Mi’kmaw approach of taking what you need from the land and sea so that…", "there is enough for the future", ["no one can use it again", "you can take as much as possible"], "It is about care and balance, not taking more than needed.", true],
  ["Which action shows care for a habitat?", "taking only what you need and leaving the rest", ["picking every berry from a bush", "leaving garbage at the beach"], "Caring for habitats helps living things for a long time.", true],
];

export const interconnectedHabitats = bankUnit({
  id: "ns-interconnected-habitats-4",
  title: "Habitats Working Together",
  emoji: "🦅",
  blurb: "See how living and non-living things in Nova Scotia habitats depend on each other.",
  parentNote:
    "Practises how plants, animals and non-living things in local habitats such as forests, salt marshes, ponds and dunes depend on each other, including food chains and decomposers. It follows the Grade 4 Nova Scotia science outcome on habitats and touches on the Mi’kmaw idea of Netukulimk.",
  standards: ["Life Science: Habitat", "living and non-living parts of Nova Scotia habitats and how they depend on each other"],
  items: HABITATS,
});
