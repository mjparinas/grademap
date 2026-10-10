import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 9 Science, Earth and Space Science: Exploring our Universe (EU9.1–EU9.4).

// ---------- Motion and characteristics of astronomical bodies ----------

const PLANET_SORT: SortSet = {
  prompt: "Is it a rocky planet or a giant planet? Tap a planet, then tap its basket.",
  hint: "The four inner planets are small and rocky. The four outer planets are much larger and made mostly of gas and ice.",
  bins: [
    { id: "rocky", label: "rocky planet", emoji: "🪨" },
    { id: "giant", label: "giant planet", emoji: "🪐" },
  ],
  items: [
    { label: "Mercury", emoji: "⚫", bin: "rocky" },
    { label: "Venus", emoji: "🟡", bin: "rocky" },
    { label: "Earth", emoji: "🌍", bin: "rocky" },
    { label: "Mars", emoji: "🔴", bin: "rocky" },
    { label: "Jupiter", emoji: "🟠", bin: "giant" },
    { label: "Saturn", emoji: "🪐", bin: "giant" },
    { label: "Uranus", emoji: "🔵", bin: "giant" },
    { label: "Neptune", emoji: "🌀", bin: "giant" },
  ],
};

const SCALE_ORDER = order("Put these in order from the smallest to the largest.", "Earth is in the solar system, which is in the Milky Way galaxy, which is one of many galaxies in the universe.", [
  ["Earth", "🌍"],
  ["the solar system", "☀️"],
  ["the Milky Way galaxy", "🌌"],
  ["the universe", "✨"],
]);

const PLANET_ORDER = order("Put these planets in order from closest to the Sun to farthest from the Sun.", "Mercury, Venus, Earth, Mars, then the asteroid belt, then Jupiter, Saturn, Uranus and Neptune.", [
  ["Mercury", "⚫"],
  ["Earth", "🌍"],
  ["Mars", "🔴"],
  ["Jupiter", "🟠"],
  ["Neptune", "🔵"],
]);

const MOTION: Item[] = [
  q("What does a planet orbit in our solar system?", "the Sun", ["the Moon", "Earth", "Jupiter"], "All eight planets travel around the Sun in paths called orbits.", "☀️"),
  q("What force keeps the planets in orbit around the Sun?", "gravity", ["magnetism", "friction", "wind"], "The Sun's gravity pulls on the planets and keeps them circling it.", "🪐"),
  q("What shape is the orbit of a planet?", "an ellipse (a stretched circle)", ["a perfect square", "a straight line", "a triangle"], "Planet orbits are ellipses, and most are close to circular.", "🛰️"),
  q("How long does Earth take to orbit the Sun once?", "about one year", ["about one day", "about one month", "about ten years"], "One orbit is about 365 days.", "🌍"),
  q("What causes day and night on Earth?", "Earth rotating on its axis", ["Earth orbiting the Sun in one day", "the Sun turning off", "the Moon blocking the Sun each night"], "Earth spins once about every 24 hours, so each place turns toward and then away from the Sun.", "🌗"),
  q("What causes the seasons on Earth?", "the tilt of Earth's axis as it orbits the Sun", ["Earth getting closer to and farther from the Sun", "the Moon's phases", "clouds blocking the Sun"], "The tilt changes how directly sunlight strikes each part of Earth during the year.", "🍁"),
  q("In Saskatchewan, why is it warmer in July than in January?", "the northern half of Earth is tilted toward the Sun in July", ["Earth is much closer to the Sun in July", "the Moon is brighter in July", "the Sun is a different star in July"], "Tilted toward the Sun, we get more direct sunlight and longer days.", "☀️"),
  q("What is the Moon?", "a natural satellite that orbits Earth", ["a star", "a planet", "a comet"], "A natural satellite is a body that orbits a planet.", "🌙"),
  q("About how long does the Moon take to go through all its phases?", "about a month", ["about a day", "about a week", "about a year"], "From one new Moon to the next takes about 29.5 days.", "🌙"),
  q("What causes the phases of the Moon?", "we see different amounts of its sunlit half as it orbits Earth", ["Earth's shadow covers the Moon each night", "the Moon gives off its own changing light", "clouds cover part of the Moon"], "Half of the Moon is always lit by the Sun, but from Earth we see more or less of that half.", "🌓"),
  q("What happens in a solar eclipse?", "the Moon passes between the Sun and Earth", ["Earth passes between the Sun and the Moon", "the Sun burns out for a moment", "a planet crosses the Moon"], "The Moon's shadow falls on part of Earth.", "🌑"),
  q("What happens in a lunar eclipse?", "Earth's shadow falls on the Moon", ["the Moon's shadow falls on the Sun", "the Sun goes dark", "Mars hides the Moon"], "Earth is between the Sun and the Moon.", "🌕"),
  q("Which planet is closest to the Sun?", "Mercury", ["Venus", "Mars", "Neptune"], "Mercury is the innermost planet.", "⚫"),
  q("Which planet is the largest in our solar system?", "Jupiter", ["Earth", "Mars", "Mercury"], "Jupiter is a giant planet more massive than all the other planets put together.", "🟠"),
  q("Which planet is famous for its bright system of rings?", "Saturn", ["Mercury", "Earth", "Mars"], "Other giant planets have rings too, but Saturn's are the brightest and easiest to see.", "🪐"),
  q("Which planet is the hottest, even though it is not the closest to the Sun?", "Venus", ["Mars", "Neptune", "Jupiter"], "Venus has a thick atmosphere of carbon dioxide that traps heat.", "🟡"),
  q("Where is the asteroid belt?", "between Mars and Jupiter", ["between Earth and Mars", "beyond Neptune", "between Mercury and Venus"], "It holds many rocky bodies that orbit the Sun.", "☄️"),
  q("What is a comet mostly made of?", "ice, dust and rock", ["pure iron", "hot gas like the Sun", "liquid water only"], "A comet develops a glowing tail as it nears the Sun and its ice warms.", "☄️"),
  q("Pluto is now classified as a…", "dwarf planet", ["star", "moon of Neptune", "comet"], "Pluto is round but has not cleared its orbit of other objects.", "❄️"),
  q("What is a star?", "a huge ball of hot gas that gives off its own light", ["a planet that reflects light", "a burning rock", "a large moon"], "Stars make light and heat by nuclear fusion in their cores.", "⭐"),
  q("What kind of object is the Sun?", "a star", ["a planet", "a moon", "a comet"], "The Sun is the star at the centre of our solar system.", "☀️"),
  q("Why do planets shine in the night sky?", "they reflect sunlight", ["they are burning", "they make their own light by fusion", "they are lit by the Moon"], "Unlike stars, planets do not make their own light.", "✨"),
  q("What is a galaxy?", "a huge group of stars, gas and dust held together by gravity", ["a very large planet", "a cloud of rain", "the path of a comet"], "A galaxy can hold hundreds of billions of stars.", "🌌"),
  q("What is the name of the galaxy that contains our solar system?", "the Milky Way", ["Andromeda", "the Big Dipper", "Orion"], "From Earth we see the Milky Way as a pale band of stars across the sky.", "🌌"),
  q("What is a light-year?", "the distance light travels in one year", ["one year of travel time by rocket", "the brightness of a star in one year", "a year on a distant planet"], "A light-year measures distance, not time.", "💡"),
  q("Why do astronomers use light-years?", "distances between stars are far too large for kilometres to be convenient", ["stars are very close together", "light-years are shorter than kilometres", "they measure how hot a star is"], "Even the nearest stars are trillions of kilometres away.", "📏"),
  hq("Light from a star is 10 light-years away. What does that tell you about what you see?", "you see the star as it was 10 years ago", ["you see the star as it is right now", "the star is 10 years old", "the star will die in 10 years"], "Light takes 10 years to reach us, so we see the past.", "🔭"),
  hq("Two planets have the same mass, but one is twice as far from the Sun. How does the Sun's pull on the farther planet compare?", "it is weaker", ["it is stronger", "it is exactly the same", "it is zero"], "Gravity gets weaker as distance increases.", "⚖️"),
  hq("Why do planets farther from the Sun take longer to complete an orbit?", "they have farther to travel and move more slowly", ["they are lighter", "they are hotter", "the Sun spins faster for them"], "Weaker gravity at greater distance means slower orbital speed, over a longer path.", "🪐"),
  hq("Why can Venus be hotter than Mercury, which is closer to the Sun?", "Venus has a thick atmosphere that traps heat", ["Venus is larger than the Sun", "Mercury is made of ice", "Venus spins faster"], "A thick atmosphere can matter more than distance.", "🌡️"),
];

// ---------- Origins of the solar system and universe, and cultural views of the sky ----------

const STAR_SORT: SortSet = {
  prompt: "Where does the star end up? Tap an item, then tap its basket.",
  hint: "A star like our Sun swells into a red giant and ends as a white dwarf. A much more massive star explodes as a supernova.",
  bins: [
    { id: "sun", label: "star like the Sun", emoji: "☀️" },
    { id: "massive", label: "very massive star", emoji: "💥" },
  ],
  items: [
    { label: "red giant", emoji: "🔴", bin: "sun" },
    { label: "planetary nebula", emoji: "🫧", bin: "sun" },
    { label: "white dwarf", emoji: "⚪", bin: "sun" },
    { label: "burns for billions of years", emoji: "⏳", bin: "sun" },
    { label: "supernova", emoji: "💥", bin: "massive" },
    { label: "neutron star", emoji: "🌟", bin: "massive" },
    { label: "black hole", emoji: "⚫", bin: "massive" },
    { label: "red supergiant", emoji: "🔴", bin: "massive" },
  ],
};

const STAR_ORDER = order("Put the life cycle of a star like our Sun in order.", "A star begins in a nebula, shines for billions of years, swells into a red giant and ends as a white dwarf.", [
  ["nebula (cloud of gas and dust)", "🌫️"],
  ["protostar", "🔥"],
  ["main sequence star", "☀️"],
  ["red giant", "🔴"],
  ["white dwarf", "⚪"],
]);

const UNIVERSE_ORDER = order("Put these events in order, from the earliest to the most recent.", "The universe began with the Big Bang, then stars and galaxies formed, and later our Sun and planets formed.", [
  ["the Big Bang", "💥"],
  ["the first stars and galaxies form", "🌌"],
  ["our Sun and solar system form", "☀️"],
  ["life appears on Earth", "🦠"],
]);

const ORIGINS: Item[] = [
  q("About how old do scientists say the universe is?", "about 13.8 billion years", ["about 6000 years", "about 4.6 million years", "about 100 years"], "This estimate comes from measurements of the expansion of the universe and the oldest light we can see.", "🌌"),
  q("What is the Big Bang theory?", "the universe began extremely hot and dense and has been expanding ever since", ["a huge explosion inside an empty room of space", "the Sun exploded and made the planets", "a galaxy collided with Earth"], "The Big Bang was an expansion of space itself, not an explosion into empty space.", "💥"),
  q("What did Edwin Hubble's observations show about distant galaxies?", "most are moving away from us", ["all are moving toward us", "none are moving", "they are all the same size"], "Their light is stretched to longer wavelengths, called redshift, so the universe is expanding.", "🔭"),
  q("Which observation supports the Big Bang theory?", "distant galaxies are moving away from each other", ["the Moon has phases", "Earth has seasons", "comets have tails"], "An expanding universe suggests it was once much smaller and denser.", "🔭"),
  q("The cosmic microwave background is…", "faint radiation left over from the early universe", ["light from the Sun at night", "radio from a nearby planet", "energy from the Moon"], "It is evidence that the early universe was hot and dense.", "📡"),
  q("About how old is our solar system?", "about 4.6 billion years", ["about 13.8 billion years", "about 4600 years", "about 460 million years"], "The solar system formed much later than the universe itself.", "☀️"),
  q("According to the nebular theory, how did the solar system form?", "from a spinning cloud of gas and dust that collapsed under gravity", ["from a single huge rock that split", "from a comet hitting the Moon", "from a galaxy that burst open"], "Most of the material formed the Sun, and the rest flattened into a disk that formed the planets.", "🌫️"),
  q("What is a nebula?", "a giant cloud of gas and dust in space", ["a type of planet", "a very bright comet", "a small moon"], "Stars are born inside nebulae.", "🌫️"),
  q("What process powers a star like the Sun?", "nuclear fusion of hydrogen into helium", ["burning coal", "chemical burning of oxygen", "friction with space dust"], "Fusion in the core releases huge amounts of energy.", "☀️"),
  q("Which two elements are the most common in stars?", "hydrogen and helium", ["iron and gold", "oxygen and carbon", "nitrogen and neon"], "These were the main elements formed soon after the Big Bang.", "⚛️"),
  q("What stage of its life is our Sun in now?", "a main sequence star", ["a protostar", "a white dwarf", "a supernova"], "The Sun is fusing hydrogen in its core and will do so for billions of years more.", "☀️"),
  q("What will our Sun become at the end of its life?", "a white dwarf", ["a black hole", "a supernova", "a new planet"], "The Sun is not massive enough to become a supernova or black hole.", "⚪"),
  q("What is a supernova?", "the explosion of a very massive star at the end of its life", ["the birth of a star", "a very bright planet", "a large comet"], "A supernova can outshine a whole galaxy for a short time.", "💥"),
  q("What can be left behind after a very massive star explodes?", "a neutron star or a black hole", ["a new nebula only", "a planet", "a comet"], "The remaining core collapses into one of these dense objects.", "⚫"),
  q("What is a black hole?", "a region where gravity is so strong that not even light can escape", ["a hole in the surface of the Moon", "an empty space with no matter around it", "a dark planet"], "A black hole forms when a massive core collapses.", "⚫"),
  q("Where were the heavier elements, such as the iron in our blood, made?", "inside stars and in supernova explosions", ["in Earth's volcanoes", "in the Big Bang alone", "in the Moon"], "Many atoms in our bodies were made in earlier generations of stars.", "✨"),
  q("What happened to stars as they used up their hydrogen fuel?", "they changed, swelling or collapsing depending on their mass", ["they always stayed the same", "they turned into planets", "they began to spin backward"], "The star's mass decides how it ends.", "⭐"),
  q("Which star ends its life more quickly?", "a very massive star", ["a star like the Sun", "a small red dwarf", "all stars end at the same time"], "Massive stars burn their fuel faster and live much shorter lives.", "💥"),
  q("What is a scientific theory?", "a well-tested explanation supported by lots of evidence", ["a guess made without any testing", "a belief that can never change", "an opinion"], "A theory can be changed if new evidence is found.", "🧪"),
  q("Who proposed that the Sun, not Earth, is at the centre of the planets' orbits?", "Nicolaus Copernicus", ["Isaac Newton", "Chris Hadfield", "Edwin Hubble"], "This idea is called the heliocentric model.", "☀️"),
  q("Galileo used a telescope to see four moons orbiting Jupiter. Why was this important?", "it showed that not everything orbits Earth", ["it showed that Jupiter is a star", "it proved the Moon is made of rock", "it showed that Earth is flat"], "It was evidence against the idea that everything circled Earth.", "🔭"),
  q("Which statement about how people understand the sky is true?", "many cultures, past and present, have their own ways of explaining and mapping the sky", ["only one culture has ever studied the sky", "no culture used the stars before telescopes", "all cultures have the same stories about the stars"], "People everywhere have watched the sky for many thousands of years.", "🌠"),
  q("How have many cultures used the stars and the Moon?", "to keep track of time, seasons and direction", ["only to decorate clothing", "to measure the weight of the Sun", "to predict the price of food"], "Sky patterns repeat, which makes them useful for calendars and navigation.", "🧭"),
  q("Which star has helped travellers in the northern hemisphere find north?", "Polaris, the North Star", ["Betelgeuse", "the Sun at midnight", "Sirius"], "Polaris stays almost fixed in the sky above the north pole.", "🧭"),
  q("What is a constellation?", "a pattern of stars that people have named", ["a type of galaxy", "a group of planets", "a single very large star"], "Different cultures see different pictures in the same stars.", "🌟"),
  q("Why can two cultures tell different stories about the same stars?", "each group sees the sky through its own history, land and ways of knowing", ["the stars change depending on who looks", "only one story can be told", "one of the groups has not looked at the stars"], "Star stories carry knowledge and values.", "📖"),
  q("Some First Nations and Métis communities share star and sky knowledge. How is this knowledge often passed on?", "through stories and teachings from Elders and knowledge keepers", ["only through textbooks", "it is not passed on any more", "through computer programs only"], "Oral teachings are a way knowledge is carried across generations, and they continue today.", "🪶"),
  hq("Why can a scientific theory be both well supported and open to change?", "new evidence may improve or replace the explanation", ["theories are never tested", "theories cannot be wrong", "scientists do not use evidence"], "Science works by testing ideas against evidence.", "🧪"),
  hq("Why is the Sun’s light today useful evidence that stars are not eternal?", "the Sun is a star that is using up its hydrogen fuel", ["the Sun has no fuel", "the Sun is a planet", "the Sun never changes"], "Stars like the Sun have long but limited lives.", "☀️"),
  hq("Why is it respectful to ask Elders or knowledge keepers before sharing a community’s sky teachings?", "the knowledge belongs to the community and is shared with care", ["the teachings are not real", "scientists forbid it", "star stories are always secret from everyone"], "Respect means asking, listening and sharing the way the community wishes.", "🤝"),
];

// ---------- Human capabilities for exploring the universe ----------

const TOOL_SORT: SortSet = {
  prompt: "Does it stay near Earth or travel far away? Tap an item, then tap its basket.",
  hint: "Satellites and the space station circle Earth. Probes and rovers are sent to other worlds.",
  bins: [
    { id: "near", label: "stays near Earth", emoji: "🌍" },
    { id: "far", label: "travels to other worlds", emoji: "🚀" },
  ],
  items: [
    { label: "Hubble Space Telescope", emoji: "🔭", bin: "near" },
    { label: "International Space Station", emoji: "🛰️", bin: "near" },
    { label: "weather satellite", emoji: "🌦️", bin: "near" },
    { label: "GPS satellite", emoji: "📍", bin: "near" },
    { label: "Mars rover", emoji: "🤖", bin: "far" },
    { label: "Voyager probe", emoji: "🚀", bin: "far" },
    { label: "lunar lander", emoji: "🌙", bin: "far" },
    { label: "probe that flew past Pluto", emoji: "❄️", bin: "far" },
  ],
};

const SPACE_ORDER = order("Put these space firsts in order, from the earliest to the most recent.", "Sputnik 1 (1957), then the first Moon landing (1969), then the Hubble Space Telescope (1990).", [
  ["Sputnik 1 is the first satellite launched", "🛰️"],
  ["humans first land on the Moon", "🌙"],
  ["the Hubble Space Telescope is launched", "🔭"],
]);

const EXPLORE: Item[] = [
  q("What does a telescope do?", "it makes distant objects look closer and brighter", ["it makes space warmer", "it measures the wind", "it makes stars move"], "Telescopes collect light so faint, faraway objects can be seen.", "🔭"),
  q("A refracting telescope uses…", "lenses to bend and focus light", ["a mirror only", "a camera only", "magnets"], "A reflecting telescope uses mirrors instead.", "🔭"),
  q("A reflecting telescope uses…", "a curved mirror to collect and focus light", ["only a magnifying glass", "a rocket engine", "sound waves"], "Large research telescopes use mirrors.", "🔭"),
  q("What does a radio telescope detect?", "radio waves from objects in space", ["only visible light", "sound from space", "wind in space"], "Radio telescopes can see things that cannot be seen with ordinary light.", "📡"),
  q("Why are some telescopes placed in orbit above Earth?", "Earth's atmosphere blurs and blocks some light", ["there is no light on Earth", "space is warmer than Earth", "telescopes only work in a vacuum of sound"], "From space, the view is not disturbed by the air.", "🛰️"),
  q("The Hubble Space Telescope orbits…", "Earth", ["the Sun between Mars and Jupiter", "Saturn", "the Moon"], "It has sent back detailed pictures of space since 1990.", "🔭"),
  q("The James Webb Space Telescope mainly observes in which kind of light?", "infrared", ["X-rays only", "sound", "radio only"], "Infrared light lets it see through dust and view very distant galaxies.", "🔭"),
  q("Why do astronomers build large telescopes in dark places far from cities?", "to avoid light pollution", ["to be closer to the Sun", "because stars are bright only in the country", "to keep telescopes cool in the day"], "City lights make faint objects hard to see.", "🌃"),
  q("What is a satellite?", "an object that orbits a larger body", ["a kind of planet", "a very large star", "a rocket's fuel"], "The Moon is a natural satellite; many human-made satellites orbit Earth too.", "🛰️"),
  q("Which job do satellites do for us?", "weather forecasting, communication and navigation", ["making seasons", "changing the Moon's phases", "moving the clouds"], "Satellites send back images and signals used every day.", "📡"),
  q("What is a space probe?", "an uncrewed spacecraft sent to explore space", ["a spacecraft carrying many tourists", "a telescope on Earth", "a kind of rocket fuel"], "Probes carry cameras and instruments instead of people.", "🚀"),
  q("What are the Voyager probes known for?", "visiting the outer planets and travelling out toward interstellar space", ["landing on Mars", "being the first crewed Moon mission", "orbiting Earth only"], "They were launched in 1977 and are still sending signals.", "🚀"),
  q("What is a rover?", "a vehicle that drives on the surface of another world", ["a telescope in orbit", "a type of comet", "a cargo ship"], "Rovers have explored the surface of Mars.", "🤖"),
  q("Why do we send robots to places such as Mars before sending people?", "it is safer, cheaper and gives us information first", ["robots never break", "people cannot work with robots", "Mars has people already"], "Uncrewed missions reduce risk and cost.", "🤖"),
  q("What was Sputnik 1?", "the first human-made satellite in orbit", ["the first telescope", "a Moon rover", "a space station"], "It was launched in 1957.", "🛰️"),
  q("What is the International Space Station?", "a research laboratory orbiting Earth where astronauts live and work", ["a base on the Moon", "a telescope on Mars", "a very large satellite dish on Earth"], "Several countries, including Canada, work together on it.", "🛰️"),
  q("What is the Canadarm?", "a robotic arm built in Canada for handling objects in space", ["a Canadian rocket engine", "a type of space helmet", "a satellite dish"], "The first Canadarm flew on the Space Shuttle.", "🦾"),
  q("What is Canadarm2 used for?", "building and servicing the International Space Station", ["landing on the Moon", "taking pictures of Earth only", "launching rockets"], "Canadarm2 moves along the station to capture supply craft and move equipment.", "🦾"),
  q("Who was the first Canadian in space?", "Marc Garneau", ["Roberta Bondar", "Chris Hadfield", "Jeremy Hansen"], "He flew on the Space Shuttle in 1984.", "👨‍🚀"),
  q("Who was the first Canadian woman in space?", "Roberta Bondar", ["Marc Garneau", "Chris Hadfield", "Julie Payette"], "She is a neurologist who studied how space affects the human body.", "👩‍🚀"),
  q("Which Canadian astronaut commanded the International Space Station?", "Chris Hadfield", ["Marc Garneau", "Roberta Bondar", "Edwin Hubble"], "He also shared photos and music from space with people on Earth.", "👨‍🚀"),
  q("Which space-related job studies stars, planets and galaxies?", "astronomer", ["geologist", "paleontologist", "meteorologist"], "Astronomers use telescopes and data to learn about the universe.", "🔭"),
  q("Which job involves designing spacecraft and robotic arms?", "aerospace engineer", ["astronomer", "botanist", "chef"], "Engineers design and test the machines that go into space.", "🛠️"),
  q("Why are astronauts trained for long time in water or simulators before flying?", "to practise working safely in weightlessness and emergencies", ["because they live underwater in space", "to make them taller", "to learn to fly aeroplanes only"], "Training prepares them for the real mission.", "🏊"),
  q("What is a challenge of long human space flights?", "bone and muscle loss in weightlessness", ["too much gravity", "too much oxygen", "daylight all year"], "Astronauts exercise every day to stay strong.", "💪"),
  q("Which everyday technology depends on satellites?", "GPS navigation", ["a bicycle", "a paper map", "a pencil"], "GPS receivers use signals from several satellites to find your position.", "📍"),
  q("How does space exploration also help life on Earth?", "it leads to new technologies and better understanding of our planet", ["it makes the weather warmer", "it removes the need for science", "it stops the seasons"], "Satellite images help track weather, farmland and forests.", "🌍"),
  hq("Why might a space agency choose a robotic probe over a crewed mission to a very distant planet?", "the trip is very long and dangerous for people", ["robots are tired of travelling", "people can fly faster than light", "probes need food and sleep"], "Probes do not need air, food or a trip home.", "🚀"),
  hq("Why do space agencies from many countries work together on projects like the International Space Station?", "they can share costs, skills and ideas", ["no country can build anything alone, ever", "it makes space smaller", "rockets only fit in one country"], "Large missions are expensive and need many kinds of experts.", "🤝"),
  hq("Why do astronomers use telescopes that detect different kinds of light, such as radio, infrared and visible?", "each kind of light shows different information about an object", ["all kinds show the same thing", "only visible light is real", "the telescopes would otherwise be too heavy"], "Combining them gives a fuller picture of the universe.", "🌈"),
];

export const units: Unit[] = [
  {
    id: "sk-universe-motion",
    title: "Motion in Our Universe",
    emoji: "🪐",
    blurb: "Orbits, gravity, planets, stars and galaxies",
    standards: { "ca-sk": sk("EU9.1", "the motion and characteristics of astronomical bodies in the solar system and the universe") },
    parentNote: "How gravity keeps planets in orbit, rotation and revolution, the seasons, the Moon, the planets, stars, galaxies, and how light-years measure huge distances.",
    generate: bankUnit(MOTION, { sorts: [PLANET_SORT], orders: [PLANET_ORDER, SCALE_ORDER] }),
  },
  {
    id: "sk-universe-origins",
    title: "Origins of the Universe",
    emoji: "💥",
    blurb: "The Big Bang, the life of stars, and star stories",
    standards: { "ca-sk": sk("EU9.2, EU9.3", "scientific explanations of how the solar system and universe formed, and how cultures including First Nations and Métis understand the sky") },
    parentNote: "The Big Bang and the evidence for it, how the solar system formed, star life cycles, and how different cultures, including First Nations and Métis communities, understand and represent the sky.",
    generate: bankUnit(ORIGINS, { sorts: [STAR_SORT], orders: [STAR_ORDER, UNIVERSE_ORDER] }),
  },
  {
    id: "sk-space-exploration",
    title: "Exploring Space",
    emoji: "🚀",
    blurb: "Telescopes, probes, satellites and Canadians in space",
    standards: { "ca-sk": sk("EU9.4", "human capabilities, technologies and programs for exploring and understanding the universe") },
    parentNote: "Telescopes, satellites, space probes and rovers, the Canadarm, Canadian astronauts such as Roberta Bondar and Chris Hadfield, how space science helps life on Earth, and space careers.",
    generate: bankUnit(EXPLORE, { sorts: [TOOL_SORT], orders: [SPACE_ORDER] }),
  },
];
