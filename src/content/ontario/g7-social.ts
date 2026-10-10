import { sortQuestion, type SortSet } from "../bank";
import { pick, sample, shuffle, textChoice } from "../random";
import type { GenerateOptions, Question, Unit, Visual } from "../types";
import { type Item, levelled, orderQuestion } from "./g7-bank";
import { levelOf, on, typeIn } from "./kit";

// Ontario Grade 7 Social Studies (2023): Geography (Physical Patterns in a Changing World; Natural Resources
// Around the World) and History (New France and British North America, 1713 to 1800; Canada, 1800 to 1850).
// Strands A and B repeat across Geography and History, so standards say which set a code belongs to.
// The deeper First Nations, Métis and Inuit expectations are deliberately left for partner review.

/** A "which year" question with hand-picked wrong years (so no wrong choice is defensibly right). */
function yearQuestion(prompt: string, year: number, wrong: number[], hint: string): Question {
  return textChoice(prompt, String(year), wrong.map(String), hint);
}

// ======================= GEOGRAPHY =======================

// ---------- Landforms and the processes that shape them ----------

const PROCESS_SORT: SortSet = {
  prompt: "Weathering, erosion or deposition? Sort each example.",
  hint: "Weathering breaks rock down where it is. Erosion carries material away. Deposition is when moving water, wind or ice drops what it was carrying.",
  bins: [
    { id: "weathering", label: "weathering", emoji: "🪨" },
    { id: "erosion", label: "erosion", emoji: "🌊" },
    { id: "deposition", label: "deposition", emoji: "🏜️" },
  ],
  items: [
    { label: "water freezing in a crack and splitting a rock", emoji: "🧊", bin: "weathering" },
    { label: "tree roots widening a crack in rock", emoji: "🌳", bin: "weathering" },
    { label: "acid rain slowly dissolving limestone", emoji: "🌧️", bin: "weathering" },
    { label: "a river carrying soil downstream", emoji: "🏞️", bin: "erosion" },
    { label: "wind blowing loose sand away", emoji: "🌬️", bin: "erosion" },
    { label: "a glacier dragging rocks along its bed", emoji: "🧊", bin: "erosion" },
    { label: "a river dropping silt to build a delta", emoji: "🌾", bin: "deposition" },
    { label: "wind piling sand into a dune", emoji: "🏜️", bin: "deposition" },
    { label: "a melting glacier leaving boulders behind", emoji: "🪨", bin: "deposition" },
  ],
};

const MOUNTAINS = [
  { label: "Mount Everest", value: 8849 },
  { label: "Aconcagua", value: 6961 },
  { label: "Denali", value: 6190 },
  { label: "Mount Logan", value: 5959 },
  { label: "Kilimanjaro", value: 5895 },
];

function mountainQuestion(d: 1 | 2 | 3): Question {
  const bars: Visual = { type: "bars", title: "Height above sea level (m)", bars: MOUNTAINS };
  if (d === 1 || pick([true, false])) {
    return textChoice("Which mountain in the graph is the highest?", "Mount Everest", ["Aconcagua", "Mount Logan", "Kilimanjaro"], "Find the longest bar.", bars);
  }
  const [a, b] = sample(MOUNTAINS, 2).sort((x, y) => y.value - x.value);
  return typeIn(`How many metres higher is ${a.label} than ${b.label}?`, a.value - b.value, `Subtract: ${a.value} − ${b.value}.`, bars, { suffix: "m" });
}

function contourQuestion(): Question {
  const interval = pick([10, 20, 25, 50]);
  const n = pick([3, 4, 5, 6, 7]);
  return typeIn(
    `A topographic map has a contour interval of ${interval} m. A hiker walks straight uphill and crosses ${n} contour lines. How many metres higher is the hiker at the end?`,
    interval * n,
    `Each line crossed is one interval of ${interval} m higher: ${n} × ${interval}.`,
    undefined,
    { suffix: "m" },
  );
}

const LANDFORM_BANK: Item[] = [
  { prompt: "Which landform is high, flat-topped land?", right: "a plateau", wrong: ["a mountain", "a valley", "a plain"], hint: "A plateau rises above the land around it but has a broad, flat top." },
  { prompt: "What is a plain?", right: "A large area of mostly flat land", wrong: ["A steep, high area of rock", "A deep, narrow cut in the land", "A body of water"], hint: "Plains are low and flat. Many are good for farming." },
  { prompt: "What is a valley?", right: "Low land between hills or mountains", wrong: ["The top of a mountain", "A high, flat area", "A large body of salt water"], hint: "Rivers often flow through valleys." },
  { prompt: "How is a mountain different from a hill?", right: "A mountain is higher and usually steeper", wrong: ["A hill is higher", "A mountain always has snow", "A hill is made of water"], hint: "Both are raised landforms, but mountains rise much higher." },
  { prompt: "What is weathering?", right: "The breaking down of rock where it is", wrong: ["The movement of rock by a river", "The building of mountains by plates", "The dropping of sand in a delta"], hint: "Weathering does not move the pieces. Erosion does." },
  { prompt: "What is erosion?", right: "The carrying away of weathered material by water, wind or ice", wrong: ["The breaking of rock by frost where it sits", "The melting of rock inside Earth", "The building of a dam"], hint: "Erosion moves material from one place to another." },
  { prompt: "Fold mountains such as the Himalayas formed when…", right: "tectonic plates collided and pushed rock upward and into folds", wrong: ["wind piled up sand", "a river dropped silt", "a glacier melted"], hint: "The Indian plate pushed into the Eurasian plate and the land crumpled upward." },
  { prompt: "Earthquakes and volcanoes happen most often…", right: "along the edges of tectonic plates", wrong: ["in the middle of the largest plains", "only at the equator", "only beside lakes"], hint: "Plates move against one another at their edges." },
  { prompt: "A river slows where it meets the sea and drops the sediment it carried. This builds a…", right: "delta", wrong: ["plateau", "fold mountain", "canyon"], hint: "Deposition at a river mouth builds a fan of new land." },
  { prompt: "A glacier carves a valley with a rounded, U-shaped cross-section. A river tends to carve a…", right: "V-shaped valley", wrong: ["U-shaped valley", "flat plateau", "volcano"], hint: "Flowing water cuts downward in a narrow V. Thick ice scrapes the sides too." },
  { prompt: "The basins of the Great Lakes were deepened mainly by…", right: "glaciers during the last ice age", wrong: ["volcanic eruptions", "a giant meteor", "the ocean flooding the land"], hint: "Thick sheets of moving ice scoured out the land." },
  { prompt: "The Canadian Shield is a huge region of very old rock. Which describes it best?", right: "Rolling rocky land with many lakes, worn down by weathering and glaciers", wrong: ["Tall, young fold mountains", "A flat plain of deep soil", "A chain of active volcanoes"], hint: "Ice scraped the Shield, leaving thin soil, bare rock and thousands of lakes." },
  { prompt: "Which human activity changes a landform?", right: "blasting a hill to build a highway", wrong: ["an earthquake along a fault", "a glacier melting", "a river flooding"], hint: "The other choices are natural processes." },
  { prompt: "Open-pit mining changes the land by…", right: "removing rock and soil to make a large pit", wrong: ["building a delta", "raising a new mountain", "creating a glacier"], hint: "The ore is dug out from the surface, leaving a large hole." },
  { prompt: "The Netherlands built dikes and pumped out water to create new farmland, called polders. This is an example of…", right: "land reclamation", wrong: ["a glacier retreating", "a volcano erupting", "weathering"], hint: "Reclamation turns sea or lake bed into dry land." },
  { prompt: "On a topographic map, contour lines that are very close together show…", right: "a steep slope", wrong: ["a flat plain", "a lake", "a road"], hint: "Many lines in a short distance means the land rises quickly." },
  { prompt: "On a topographic map, rings inside rings with the smallest at the centre show…", right: "a hill or peak that gets higher toward the middle", wrong: ["a river", "a flat plain", "a coastline"], hint: "Each ring joins points of the same height. The smallest ring is the highest." },
  { prompt: "What does a contour line connect?", right: "points of equal elevation", wrong: ["places with the same name", "towns of the same size", "points of equal temperature"], hint: "Every point on one contour line is the same height above sea level." },
  { prompt: "What does a cross-section of a landform show?", right: "A side view of the height of the land along a line", wrong: ["The colours of the soil", "Where the rivers will flood", "The name of every town"], hint: "You can draw one by plotting the heights where a line crosses the contours." },
  { prompt: "Why does the Grand Canyon have such steep walls?", right: "A river has been cutting down through rock for millions of years", wrong: ["A glacier filled it with ice", "Wind blew the rock into walls", "It was dug by people"], hint: "The Colorado River has slowly eroded layers of rock.", hard: true },
  { prompt: "How can freeze-thaw weathering break a rock?", right: "Water seeps into cracks, freezes and expands, then forces the crack wider", wrong: ["Ice melts the rock into a liquid", "Frost makes rock grow larger", "Cold air turns rock into sand at once"], hint: "Ice takes up more space than water.", hard: true },
  { prompt: "Why do tectonic plates move?", right: "Heat inside Earth slowly moves the hot rock beneath them", wrong: ["The oceans push them", "The Moon pulls them apart", "Strong winds shift them"], hint: "Currents in the hot mantle drag the plates a few centimetres a year.", hard: true },
  { prompt: "Why do large deserts often have sand dunes on their downwind side?", right: "Wind carries sand and drops it where it slows down", wrong: ["Rivers deposit sand there", "Glaciers push sand in", "Plates collide there"], hint: "Deposition happens where moving wind loses energy.", hard: true },
];

function landforms(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(PROCESS_SORT, 2), mountainQuestion(d), contourQuestion(), ...levelled(LANDFORM_BANK, 5, d)]);
}

// ---------- Water systems and climate ----------

const MONTHS = ["January", "March", "May", "July", "September", "November"];

interface Climate {
  id: string;
  label: string;
  temp: number[];
  rain: number[];
  hint: string;
}

const CLIMATES: Climate[] = [
  { id: "tropical", label: "tropical", temp: [27, 27, 27, 26, 26, 27], rain: [250, 260, 220, 180, 200, 230], hint: "Warm all year with heavy rain points to a tropical climate near the equator." },
  { id: "dry", label: "dry", temp: [14, 20, 29, 35, 31, 20], rain: [5, 3, 2, 0, 1, 3], hint: "Very little rain in every month points to a dry climate." },
  { id: "continental", label: "continental", temp: [-14, -5, 10, 21, 13, -3], rain: [30, 35, 60, 80, 70, 45], hint: "Cold winters, warm summers and a large temperature range point to a continental climate." },
  { id: "polar", label: "polar", temp: [-30, -28, -10, 2, -9, -24], rain: [8, 8, 10, 25, 15, 10], hint: "Below freezing for most of the year with little precipitation points to a polar climate." },
  { id: "temperate", label: "temperate", temp: [6, 9, 14, 20, 16, 9], rain: [110, 95, 70, 40, 70, 120], hint: "Mild winters, warm summers and plenty of rain, mostly in the cool months, point to a temperate climate." },
];

const sgn = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));

function climateTable(c: Climate): Visual {
  return {
    type: "table",
    title: "A climate graph's numbers for six months at one place",
    headers: ["Month", "Temp (°C)", "Rain (mm)"],
    rows: MONTHS.map((m, i) => [m, sgn(c.temp[i]), c.rain[i]]),
  };
}

function climateRegion(c: Climate, pool: Climate[]): Question {
  const others = sample(
    pool.filter((x) => x.id !== c.id),
    3,
  );
  return textChoice("Which climate region does this data best match?", c.label, others.map((o) => o.label), c.hint, climateTable(c));
}

function temperatureRange(c: Climate): Question {
  const range = Math.max(...c.temp) - Math.min(...c.temp);
  return typeIn(`What is the temperature range (warmest month minus coldest month) in the table?`, range, "Subtract the lowest temperature from the highest. With a negative number, add: for example 21 − (−14) = 35.", climateTable(c), { suffix: "°C" });
}

function wettestMonth(c: Climate): Question {
  const i = c.rain.indexOf(Math.max(...c.rain));
  const wrong = sample(
    MONTHS.filter((_, k) => k !== i),
    3,
  );
  return textChoice("Which of these months has the most rain in the table?", MONTHS[i], wrong, "Look down the rain column for the biggest number.", climateTable(c));
}

function rainTotal(c: Climate): Question {
  return typeIn("What is the total rain for the six months in the table?", c.rain.reduce((a, b) => a + b, 0), "Add the six rainfall numbers in the last column.", climateTable(c), { suffix: "mm" });
}

const WATER_CLIMATE_BANK: Item[] = [
  { prompt: "Which is the largest ocean?", right: "the Pacific Ocean", wrong: ["the Atlantic Ocean", "the Indian Ocean", "the Arctic Ocean"], hint: "The Pacific covers more of Earth than all of the land combined." },
  { prompt: "Which is the smallest ocean?", right: "the Arctic Ocean", wrong: ["the Pacific Ocean", "the Atlantic Ocean", "the Indian Ocean"], hint: "It lies around the North Pole and is partly covered by sea ice." },
  { prompt: "What is a drainage basin (watershed)?", right: "The area of land that drains into a river and its tributaries", wrong: ["A lake at the bottom of a valley", "A pipe that carries water to a city", "The deepest part of an ocean"], hint: "All the rain and melted snow that falls there flows toward the same river." },
  { prompt: "Water that falls in the Great Lakes basin flows out mainly through the…", right: "St. Lawrence River to the Atlantic Ocean", wrong: ["Mississippi River to the Gulf of Mexico", "Fraser River to the Pacific Ocean", "Nile River to the Mediterranean Sea"], hint: "The St. Lawrence River links Lake Ontario to the Atlantic." },
  { prompt: "The Great Lakes hold about what share of the world's surface fresh water?", right: "about one fifth", wrong: ["about one hundredth", "about one half", "almost all of it"], hint: "Together they are one of the largest fresh water systems on Earth.", hard: true },
  { prompt: "Which river carries the greatest volume of water to the sea?", right: "the Amazon", wrong: ["the St. Lawrence", "the Thames", "the Fraser"], hint: "The Amazon's huge basin in tropical South America gets heavy rain." },
  { prompt: "What is an aquifer?", right: "An underground layer of rock or sand that holds water", wrong: ["A lake at the top of a mountain", "A pipe that carries water to farms", "A wave caused by an earthquake"], hint: "Wells draw water from aquifers." },
  { prompt: "What is one purpose of building a dam?", right: "To store water and produce electricity", wrong: ["To make a river flow faster everywhere", "To increase floods downstream", "To dry out a valley"], hint: "A dam makes a reservoir. Water released through turbines makes hydroelectric power." },
  { prompt: "River water was diverted to irrigate crops, and the Aral Sea shrank greatly. What does this show?", right: "Human water use can change a large body of water", wrong: ["Seas cannot be changed by people", "Irrigation adds water to lakes", "Rivers do not flow into seas"], hint: "Less river water reached the sea, so it dried out." },
  { prompt: "Melting glaciers raise sea level because…", right: "water that was stored as ice on land flows into the ocean", wrong: ["glaciers are made of salt", "melting ice makes oceans cooler", "glaciers float on land"], hint: "Land ice adds new water to the sea. (Floating sea ice does not raise it much.)" },
  { prompt: "Why are places near the equator generally warmer?", right: "The Sun's rays strike more directly there", wrong: ["They are closer to the Sun's surface", "They have no clouds", "The ocean is always warmer"], hint: "Direct rays spread over a smaller area, so heating is stronger." },
  { prompt: "How does elevation affect temperature?", right: "Temperatures usually drop as elevation increases", wrong: ["Temperatures rise as elevation increases", "Elevation has no effect", "Mountains are always warmer than valleys"], hint: "The air is thinner and cooler higher up." },
  { prompt: "Why do coastal cities often have milder winters than places far inland at the same latitude?", right: "Water warms and cools slowly, which moderates the air", wrong: ["Oceans produce more sunlight", "Coasts are higher up", "There is more land near coasts"], hint: "Large bodies of water act like heat stores." },
  { prompt: "The Gulf Stream carries warm water toward Western Europe. How does this affect the climate there?", right: "It makes the region milder than other places at the same latitude", wrong: ["It makes the region much colder", "It stops all rain", "It has no effect on the air"], hint: "Ocean currents move heat around Earth." },
  { prompt: "A mountain range blocks moist winds, so the far side is dry. This is a…", right: "rain shadow", wrong: ["delta", "rift valley", "ice sheet"], hint: "Air rises, cools and drops its rain on the windward side." },
  { prompt: "Which climate region has very little precipitation all year?", right: "dry", wrong: ["tropical", "temperate", "continental"], hint: "Deserts are in dry climate regions." },
  { prompt: "Continental climates have big temperature differences between seasons. Why?", right: "They are far from the moderating effect of oceans", wrong: ["They are always close to the equator", "They have no seasons", "They are underwater"], hint: "Land heats and cools faster than water." },
  { prompt: "On a climate graph, what do the bars usually show?", right: "monthly precipitation", wrong: ["monthly temperature", "elevation", "ocean currents"], hint: "The line shows temperature. The bars show rain and snow." },
  { prompt: "Which two human activities can add greenhouse gases to the atmosphere?", right: "burning fossil fuels and clearing forests", wrong: ["planting trees and cycling", "building dams and reading", "swimming and farming flowers"], hint: "Both release carbon dioxide.", hard: true },
  { prompt: "Rainfall decreases over decades in one region while temperatures rise. A climate graph would likely show…", right: "a trend toward a hotter, drier climate", wrong: ["a trend toward more snow", "no change at all", "a wetter climate"], hint: "Comparing graphs from different decades reveals trends.", hard: true },
];

function waterClimate(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const pool = d === 1 ? CLIMATES.filter((c) => c.id !== "temperate") : CLIMATES;
  const [a, b, c] = sample(pool, 3);
  const second = pick([() => temperatureRange(b), () => rainTotal(b)])();
  const third = wettestMonth(c);
  return shuffle([climateRegion(a, pool), second, third, ...levelled(WATER_CLIMATE_BANK, 5, d)]);
}

// ---------- Vegetation regions and people ----------

const VEG_SORT: SortSet = {
  prompt: "Which vegetation region fits each description?",
  hint: "Tundra: very cold, no trees, permafrost. Boreal forest: long cold winters and cone-bearing trees. Tropical rainforest: hot and wet all year, with tall trees and huge variety of life.",
  bins: [
    { id: "tundra", label: "tundra", emoji: "❄️" },
    { id: "boreal", label: "boreal forest", emoji: "🌲" },
    { id: "rainforest", label: "tropical rainforest", emoji: "🌴" },
  ],
  items: [
    { label: "frozen ground (permafrost) and no tall trees", emoji: "🧊", bin: "tundra" },
    { label: "low mosses, lichens and small shrubs", emoji: "🌿", bin: "tundra" },
    { label: "spruce, fir and pine trees with cones", emoji: "🌲", bin: "boreal" },
    { label: "the largest forest region across Canada", emoji: "🍁", bin: "boreal" },
    { label: "hot all year with rain almost every day", emoji: "🌧️", bin: "rainforest" },
    { label: "layers of tall trees and a huge variety of species", emoji: "🦜", bin: "rainforest" },
  ],
};

const VEG_BANK: Item[] = [
  { prompt: "Why are there no tall trees in the tundra?", right: "It is very cold, the growing season is short and the ground is frozen", wrong: ["There is too much rain", "It is too hot", "The soil is too deep"], hint: "Roots cannot grow deep in permafrost, and summers are short." },
  { prompt: "What is a savanna?", right: "A tropical grassland with scattered trees and wet and dry seasons", wrong: ["A frozen plain with no plants", "A forest of tall evergreens", "A swamp with salt water"], hint: "Parts of Africa have famous savannas." },
  { prompt: "Which vegetation region covers most of southern Ontario's natural landscape?", right: "temperate deciduous (broadleaf) and mixed forest", wrong: ["tropical rainforest", "tundra", "desert"], hint: "Maple, oak and beech trees lose their leaves in fall." },
  { prompt: "Why is deforestation of tropical rainforests a concern?", right: "It destroys habitat for many species and removes trees that take in carbon dioxide", wrong: ["It adds more rain", "It makes the soil richer for a century", "It creates more trees"], hint: "Rainforests hold a large share of Earth's species." },
  { prompt: "What is overgrazing?", right: "Too many animals eat plants faster than they can regrow", wrong: ["Planting too many trees", "Watering crops too often", "Fishing too much"], hint: "Bare soil is easily blown or washed away." },
  { prompt: "What is desertification?", right: "Fertile land turning into desert, often from drought and overuse", wrong: ["A desert turning into a lake", "Rain filling a desert", "Planting palm trees in a desert"], hint: "Overgrazing and clearing plants can leave dry land bare." },
  { prompt: "Why is topsoil important?", right: "It is the nutrient-rich layer where most plants grow", wrong: ["It is the deepest rock layer", "It is a layer of ice", "It is made only of sand"], hint: "Topsoil takes a very long time to form but can be lost quickly." },
  { prompt: "In the 1930s, ploughed prairie fields dried out in a long drought and topsoil blew away. What was this?", right: "the Dust Bowl", wrong: ["a polder", "a rain shadow", "a monsoon"], hint: "The deep-rooted prairie grass that held the soil had been removed." },
  { prompt: "In a desert, little rain means…", right: "sparse vegetation and thin, exposed soil", wrong: ["thick forests", "deep, rich soil everywhere", "constant flooding"], hint: "Climate, vegetation and soil are linked." },
  { prompt: "Going up a tall mountain, vegetation usually changes from forest to…", right: "low alpine plants and then bare rock", wrong: ["tropical rainforest", "farmland", "swamp"], hint: "It gets colder and windier with elevation." },
  { prompt: "Farmers cut steps into a steep hillside to grow rice. These are called…", right: "terraces", wrong: ["dikes", "levees", "deltas"], hint: "Terraces slow the flow of water and reduce soil erosion." },
  { prompt: "What is a dike?", right: "A wall or bank built to hold back water", wrong: ["A tunnel through a mountain", "A ditch for planting", "A kind of grass"], hint: "Dikes protect low land from flooding." },
  { prompt: "In flood-prone areas, some families build homes on stilts. This is a response to…", right: "regular flooding", wrong: ["earthquakes only", "drought", "snowstorms only"], hint: "Raising the house keeps floodwater out." },
  { prompt: "How do terraced fields protect farmland?", right: "They slow runoff so less soil washes down the slope", wrong: ["They make the slope steeper", "They remove all water", "They stop plants from growing"], hint: "Flat steps hold water and soil in place." },
  { prompt: "Which response to a dry climate is the least sustainable?", right: "pumping groundwater faster than rain refills it", wrong: ["planting windbreaks of trees", "growing crops that need little water", "collecting rainwater in tanks"], hint: "Sustainable means it can continue without using up the resource.", hard: true },
  { prompt: "Two peoples live in similar flood-prone river deltas. One builds high dikes; the other builds raised homes and flood shelters. What is a fair way to compare these responses?", right: "Look at the costs, who benefits and whether each can last over time", wrong: ["Decide the one with more concrete is better", "Say that both must be the same", "Choose the oldest idea"], hint: "Assess sustainability with clear criteria.", hard: true },
  { prompt: "A farmer plants rows of trees at the edge of a field. What problem can this help with?", right: "Wind carrying away topsoil", wrong: ["Too much sunshine", "Too many earthworms", "Rising sea levels"], hint: "Windbreaks slow the wind.", hard: true },
  { prompt: "Growing the same crop year after year with chemical fertilizers can cause what problem?", right: "Soil health can decline and fertilizer can pollute nearby water", wrong: ["Soil becomes richer forever", "Rain stops falling", "Rivers flow uphill"], hint: "Nutrients and chemicals can wash into streams and lakes.", hard: true },
  { prompt: "What is a biome?", right: "A large region with a similar climate, plants and animals", wrong: ["A single tree", "A kind of rock", "A map scale"], hint: "Tundra, boreal forest and grassland are all biomes." },
  { prompt: "Which vegetation region has a very short growing season and plants such as lichens and mosses?", right: "tundra", wrong: ["tropical rainforest", "savanna", "temperate forest"], hint: "Think of the cold, treeless north." },
  { prompt: "Which vegetation region is hot and wet all year, with the most variety of species?", right: "tropical rainforest", wrong: ["tundra", "boreal forest", "desert"], hint: "Heavy rain and heat help plants grow all year." },
  { prompt: "Grasslands such as the Canadian Prairies have rich soil. Why is it good for farming?", right: "Grass roots and decay build thick, nutrient-rich topsoil", wrong: ["Rocks add nutrients", "It rains every day", "It is covered in ice"], hint: "Soil quality comes from many years of plant growth." },
  { prompt: "Why are there few plants in a hot desert?", right: "There is very little rain", wrong: ["There is too much water", "The ground is frozen", "The air is too cold"], hint: "Plants need water to grow." },
  { prompt: "Mangrove forests grow along some tropical coasts. How do they help people?", right: "Their roots protect shorelines from waves and storms", wrong: ["They create deserts", "They make the tide rise", "They cause earthquakes"], hint: "Dense roots slow the water." },
  { prompt: "Wildfires can change vegetation. What can happen after a fire in a boreal forest?", right: "New plants grow back over time", wrong: ["The forest becomes a rainforest", "The soil becomes permanent ice", "No plant ever returns"], hint: "Natural fire is part of the cycle in some forests." },
  { prompt: "Which human activity can cause soil erosion?", right: "Clearing plants from a steep slope", wrong: ["Planting trees on a slope", "Keeping roots in the ground", "Building terraces"], hint: "Roots hold soil in place." },
  { prompt: "Why do vegetation regions change from south to north across Canada?", right: "Temperature and growing season change with latitude", wrong: ["The ocean moves", "The Moon pulls the plants", "All soil is the same"], hint: "It gets colder as you go north." },
  { prompt: "A farmer uses no-till farming, leaving crop stubble on the field. What is a benefit?", right: "It helps hold soil and moisture", wrong: ["It removes all water", "It makes soil blow away", "It melts permafrost"], hint: "Cover keeps soil from blowing or washing away.", hard: true },
];

function vegetation(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(VEG_SORT, 2), ...levelled(VEG_BANK, 7, d)]);
}

// ---------- Natural resources ----------

const RESOURCE_SORT: SortSet = {
  prompt: "Renewable, non-renewable or flow resource? Sort each one.",
  hint: "Renewable resources can be replaced naturally if they are not overused (forests, fish stocks). Non-renewable resources take millions of years to form (oil, coal, metals). Flow resources keep arriving (sunlight, wind, tides, running water).",
  bins: [
    { id: "renewable", label: "renewable", emoji: "🌳" },
    { id: "nonrenewable", label: "non-renewable", emoji: "⛏️" },
    { id: "flow", label: "flow", emoji: "🌊" },
  ],
  items: [
    { label: "forests", emoji: "🌲", bin: "renewable" },
    { label: "wild fish stocks", emoji: "🐟", bin: "renewable" },
    { label: "coal", emoji: "⚫", bin: "nonrenewable" },
    { label: "nickel ore", emoji: "⛏️", bin: "nonrenewable" },
    { label: "natural gas", emoji: "🔥", bin: "nonrenewable" },
    { label: "sunlight", emoji: "☀️", bin: "flow" },
    { label: "wind", emoji: "🌬️", bin: "flow" },
    { label: "ocean tides", emoji: "🌊", bin: "flow" },
  ],
};

const RESOURCE_BANK: Item[] = [
  { prompt: "What is a non-renewable resource?", right: "A resource that cannot be replaced in a human lifetime once used", wrong: ["A resource that grows back every year", "A resource that arrives in a flow", "A resource that is found only in Canada"], hint: "Fossil fuels and metal ores formed over millions of years." },
  { prompt: "Why are fossil fuels non-renewable?", right: "They take millions of years to form", wrong: ["They can be made in a factory in a day", "They fall from the sky", "They are not made of carbon"], hint: "Oil, coal and natural gas formed from ancient living things." },
  { prompt: "Which of these is a flow resource?", right: "wind", wrong: ["oil", "iron ore", "diamonds"], hint: "Flow resources, such as wind and tides, keep coming and cannot be used up." },
  { prompt: "A forest can be a renewable resource only if…", right: "trees are cut more slowly than they regrow", wrong: ["all the trees are cut at once", "no seeds are ever planted", "it is never visited"], hint: "Sustainable harvesting leaves time for the forest to recover." },
  { prompt: "Open-pit mining is mostly used when…", right: "the ore is close to the surface", wrong: ["the ore is far underground", "the ore is underwater", "the ore has already been mined"], hint: "Deep ore needs shafts and tunnels instead." },
  { prompt: "Underground mining is mostly used when…", right: "the ore is deep below the surface", wrong: ["the ore is near the surface", "the ore is in the air", "no one needs the ore"], hint: "The method matches where the resource is found." },
  { prompt: "Rock is quarried and made into…", right: "building materials and road base", wrong: ["drinking water", "sunlight", "wind power"], hint: "Gravel, crushed stone and cement come from quarries." },
  { prompt: "Canada is one of the world's biggest producers of potash. What is potash mostly used for?", right: "fertilizer", wrong: ["jewellery", "fuel", "building bridges"], hint: "Potash is mined in Saskatchewan and shipped around the world." },
  { prompt: "Burning coal releases sulphur dioxide that can mix with moisture and cause…", right: "acid rain", wrong: ["rain shadows", "tides", "glaciers"], hint: "Acid rain harms lakes, soils and forests." },
  { prompt: "What is smog?", right: "A haze of air pollution, often from vehicles and industry, reacting in sunlight", wrong: ["A kind of fog made of pure water", "A layer of ocean salt", "A cloud made of dust from space"], hint: "Smog makes breathing harder for many people." },
  { prompt: "Wind turbines produce electricity without burning fuel. Which trade-off might communities weigh?", right: "Turbines can affect birds and change the view of the land", wrong: ["Turbines give off sulphur dioxide", "Turbines use up the wind for good", "Turbines need coal to run"], hint: "Every energy source has benefits and costs." },
  { prompt: "A dam makes hydroelectric power. What is one cost to people or the environment?", right: "Land behind the dam is flooded, which can affect habitats and communities", wrong: ["The river is made of oil", "The dam adds air pollution through the turbines", "Rivers stop flowing everywhere"], hint: "Reservoirs cover forests, farmland and sometimes homes." },
  { prompt: "In 1992, Canada closed the northern cod fishery. Why?", right: "Cod stocks had collapsed from overfishing and other pressures", wrong: ["Cod became too large to catch", "Fishing boats were banned from the ocean", "Cod moved to lakes"], hint: "A renewable resource can still be used up if it is harvested too fast." },
  { prompt: "A town was built around one mine. What may happen when the ore runs out?", right: "Jobs may disappear and people may move away", wrong: ["The town will grow forever", "The mine will fill with ore again", "New ore appears each year"], hint: "Towns that depend on one resource can have a boom and bust." },
  { prompt: "Which is a short-term benefit and a possible long-term cost of mining?", right: "Jobs now, but damaged land and water later", wrong: ["Damaged land now, but jobs never", "Cleaner water now and later", "No benefit at all"], hint: "Short-term effects happen soon. Long-term effects can last for generations." },
  { prompt: "Near Sudbury, Ontario, smelters once left hills bare. Since the 1970s, liming and tree planting have helped plants return. What does this show?", right: "Damaged land can sometimes be partly restored, though it takes decades", wrong: ["Damage from industry is always permanent", "Plants grow back without any help in a year", "Mining does not affect land"], hint: "Recovery is possible but slow and costly.", hard: true },
  { prompt: "A GIS map has one layer showing mines and another showing rivers. What can you learn by turning on both layers?", right: "Which mines are near rivers that could be affected by pollution", wrong: ["The colour of every mine", "How tall the trees are", "The names of all the rivers' fish"], hint: "GIS layers let you see relationships between places.", hard: true },
  { prompt: "A map shows that a forest company and a river both cross the same area. Why might that matter?", right: "Logging near the river can affect water, fish and soil", wrong: ["Trees make the river flow backwards", "Logging only matters in deserts", "Rivers cannot be harmed by logging"], hint: "Cut trees no longer hold soil or shade the water.", hard: true },
  { prompt: "Which is the best example of how location affects how a resource is used?", right: "Offshore oil needs drilling platforms at sea, so it is harder and costlier to reach", wrong: ["All oil is found on the beach", "Resources are equally easy to reach everywhere", "Location never affects costs"], hint: "Access shapes the method and the cost.", hard: true },
  { prompt: "Which is an example of a flow resource being used?", right: "tidal turbines in the Bay of Fundy", wrong: ["a coal mine in Alberta", "an oil well in the ocean", "a quarry for crushed rock"], hint: "The Bay of Fundy has some of the highest tides in the world.", hard: true },
];

function resources(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(RESOURCE_SORT, 2), ...levelled(RESOURCE_BANK, 7, d)]);
}

// ---------- Sustainability and perspectives ----------

const REUSE_STEPS = [
  { id: "reduce", label: "Reduce: use less in the first place", emoji: "➖" },
  { id: "reuse", label: "Reuse: use it again", emoji: "🔁" },
  { id: "recycle", label: "Recycle: turn it into something new", emoji: "♻️" },
];

const SUSTAIN_BANK: Item[] = [
  { prompt: "What does sustainability mean?", right: "Using resources so that future generations can meet their needs too", wrong: ["Using up resources as fast as possible", "Never using any resource", "Using only imported resources"], hint: "Think about both today and the future." },
  { prompt: "Which action reduces the demand for natural resources the most?", right: "using less in the first place", wrong: ["throwing items away sooner", "buying new items often", "recycling instead of reusing"], hint: "Reduce comes first because using less saves materials and energy." },
  { prompt: "What does an FSC label on wood mean?", right: "The wood comes from a forest managed to environmental and social standards", wrong: ["The wood is the cheapest available", "The wood is from a single tree", "The wood has been painted"], hint: "FSC stands for Forest Stewardship Council." },
  { prompt: "Which statement best matches an environmental organization's perspective on a wetland?", right: "It should be protected because many species depend on it", wrong: ["It should be drained to maximize profit", "It has no value to anyone", "It should be paved quickly"], hint: "Environmental groups often focus on protecting habitat and ecosystems." },
  { prompt: "A mining company wants to open a mine near a town. Which statement best matches the company's perspective?", right: "The mine will create jobs and supply a mineral that is in demand", wrong: ["The land should never be touched by anyone", "The town will be harmed no matter what", "The mineral has no uses"], hint: "Companies often focus on jobs, profit and supplying a market." },
  { prompt: "Why can't we say that all Indigenous peoples think the same way about a mine?", right: "Each Nation and community has its own history, knowledge and viewpoints", wrong: ["Indigenous peoples have no views about land", "All Indigenous peoples always agree", "Their views never matter"], hint: "First Nations, Métis and Inuit communities are many different peoples. Their views on a project can differ, and each speaks for itself." },
  { prompt: "In Canada, governments have a legal duty to consult Indigenous peoples when…", right: "a decision or project may affect their rights", wrong: ["a hockey game is scheduled", "a person moves to a new street", "the weather changes"], hint: "Courts have said that consultation is part of the Crown's responsibilities." },
  { prompt: "A report on a mine is written by the mining company. What should a careful reader ask?", right: "Whose interests does the writer have, and what do other sources say?", wrong: ["Is it printed in colour?", "Is it longer than other reports?", "How many pages does it have?"], hint: "Check the source and look for other perspectives." },
  { prompt: "Why should a good investigation use sources that reflect more than one perspective?", right: "Different groups can be affected in different ways and see the same issue differently", wrong: ["All sources say the same thing", "Opinions never matter", "Facts change for each person"], hint: "Looking at only one view can give an unfair picture." },
  { prompt: "Which is the best personal action plan?", right: "Bring a reusable water bottle every day for a month and track the bottles saved", wrong: ["Try to be greener sometime", "Think about recycling someday", "Tell others that the planet matters"], hint: "A good plan is specific, measurable and has a time frame." },
  { prompt: "The Bay of Fundy has some of the highest tides in the world. Why does that make it a place for tidal energy?", right: "Strong moving water can turn turbines", wrong: ["High tides produce coal", "Tides stop at night", "Tides are the same everywhere"], hint: "Tidal energy is a flow resource." },
  { prompt: "What is the United Nations Environment Programme (UNEP)?", right: "A United Nations agency that coordinates environmental action around the world", wrong: ["A national hockey league", "A company that sells fuel", "A group that makes maps of cities"], hint: "International groups work together on shared problems such as climate and pollution." },
  { prompt: "A marine protected area limits fishing in part of the ocean. How can this help fish stocks?", right: "Fish can grow and reproduce there, and some can move into nearby waters", wrong: ["It guarantees that fishers catch more every day", "It removes all fish from the ocean", "It stops the ocean from moving"], hint: "Protected areas give populations time to recover.", hard: true },
  { prompt: "The Paris Agreement (2015) is an agreement among countries to…", right: "limit global warming by cutting greenhouse gas emissions", wrong: ["ban all travel", "share the same laws", "stop all mining"], hint: "Countries set their own targets to reduce emissions.", hard: true },
  { prompt: "A town debates a wind farm. Residents who live near it worry about noise and views, while others want clean power. What is the best way to decide?", right: "Gather evidence and listen to the concerns and benefits for all groups", wrong: ["Only listen to the loudest group", "Ignore the people who live nearby", "Decide before asking anyone"], hint: "Fair decisions weigh evidence and perspectives.", hard: true },
  { prompt: "Which pair of words best describes a trade-off in resource use?", right: "a benefit for some groups, and a cost for others", wrong: ["a benefit for everyone, and no costs", "a cost for everyone, and no benefits", "a benefit that never changes"], hint: "Most resource decisions help some people and affect others.", hard: true },
  { prompt: "Which is an example of a renewable resource when managed well?", right: "Timber from a replanted forest", wrong: ["Coal", "Oil", "Natural gas"], hint: "Trees can regrow if the forest is looked after." },
  { prompt: "Which is an example of reducing?", right: "Choosing a product with less packaging", wrong: ["Throwing out a good jacket", "Buying a new phone every month", "Using a plastic bag once"], hint: "Reducing means using less." },
  { prompt: "A town builds a solar farm. What is one benefit?", right: "It makes electricity without burning fuel", wrong: ["It uses no land", "It makes electricity at night with no storage", "It has no costs"], hint: "Sunlight is a renewable resource." },
  { prompt: "Why do some people choose to repair items instead of replacing them?", right: "It saves resources and reduces waste", wrong: ["It always costs more", "It makes the item disappear", "It adds new landfill"], hint: "Reuse and repair keep items in use longer." },
  { prompt: "Who might support a plan to log a forest to create jobs?", right: "A forestry company and nearby workers", wrong: ["Only the animals in the forest", "No one at all", "Only people who do not live nearby"], hint: "Different groups have different priorities." },
  { prompt: "Who might oppose clear-cutting a forest near a salmon stream?", right: "Groups worried about wildlife and clean water", wrong: ["Nobody", "Only the logging company", "Only people far away"], hint: "Logging can affect streams and habitats." },
  { prompt: "What is the role of a government when it sets rules about fishing quotas?", right: "To protect fish stocks so that fishing can continue", wrong: ["To stop all fishing forever", "To help overfishing", "To raise the price of nets"], hint: "A quota limits how much can be caught." },
  { prompt: "Which action would help conserve water at home?", right: "Taking shorter showers", wrong: ["Leaving taps running", "Watering the lawn at noon", "Filling the tub for no reason"], hint: "Small habits add up." },
  { prompt: "A group in your community runs a repair café. Which of the 3 Rs does it best support?", right: "Reuse", wrong: ["Recycle only", "Reduce only", "None of them"], hint: "Fixing items lets people use them again." },
  { prompt: "What does it mean to say a decision has 'short-term' and 'long-term' effects?", right: "Some effects are seen soon, and others appear years later", wrong: ["All effects last one day", "There are no effects", "Only long-term effects matter"], hint: "Good decisions think about both." },
];

function sustainability(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([orderQuestion("Put the 3 Rs in the order that saves the most resources, first to last.", "Reduce first, then reuse, then recycle.", REUSE_STEPS, 3), ...levelled(SUSTAIN_BANK, 7, d)]);
}

// ======================= HISTORY =======================

// ---------- New France: daily life and the fur trade ----------

const POPULATION: Visual = {
  type: "bars",
  title: "Approximate population around 1760",
  bars: [
    { label: "New France", value: 70000 },
    { label: "British colonies to the south", value: 1500000 },
  ],
};

const NEWFRANCE_BANK: Item[] = [
  { prompt: "In New France, what was a seigneur?", right: "A landholder who was granted land and rented parcels to habitants", wrong: ["A fur trader who lived inland", "A soldier in the king's army", "A priest in a mission"], hint: "The seigneurial system divided land along the St. Lawrence River." },
  { prompt: "In New France, what was a habitant?", right: "A farmer who rented land from a seigneur", wrong: ["A governor", "A fur trade company", "A ship's captain"], hint: "Habitants paid rent and owed some work to the seigneur." },
  { prompt: "Why were farms in New France long and narrow along the river?", right: "So each family could reach the river for transportation", wrong: ["So each farm had a view of the sea", "So farms could be closer to the mountains", "So fewer families needed land"], hint: "Rivers were the roads." },
  { prompt: "Which institution ran most schools and hospitals in New France?", right: "the Catholic Church", wrong: ["the fur companies", "the British army", "the seigneurs' sons"], hint: "Religious orders ran many schools, hospitals and charities." },
  { prompt: "What was the colonial capital of New France?", right: "Quebec City", wrong: ["Toronto", "Halifax", "Winnipeg"], hint: "Quebec City sits on a high point above the St. Lawrence River." },
  { prompt: "Louisbourg, a fortified French town, was built after 1713 on…", right: "Île Royale (Cape Breton Island)", wrong: ["Vancouver Island", "Lake Ontario's shore", "Prince Edward Island"], hint: "France built it after giving up Acadia and Newfoundland in the Treaty of Utrecht." },
  { prompt: "Why were beaver pelts in high demand in Europe?", right: "They were made into fashionable felt hats", wrong: ["They were used for rope", "They were eaten as food", "They were burned for fuel"], hint: "Beaver fur made warm, waterproof felt." },
  { prompt: "Why did the fur trade depend on First Nations?", right: "First Nations trapped furs, knew the land and travel routes, and were trading partners", wrong: ["Europeans trapped all the furs themselves", "First Nations had no part in the trade", "The trade took place only in cities"], hint: "Trade and alliances connected Indigenous nations and Europeans." },
  { prompt: "What were voyageurs?", right: "Canoe travellers who carried furs and trade goods for fur trade companies", wrong: ["Farmers on the St. Lawrence", "Soldiers in forts", "Priests in missions"], hint: "They paddled long routes between trading posts and Montreal." },
  { prompt: "Who were the Métis, historically?", right: "A distinct Indigenous people whose roots lie in relationships between First Nations and European fur traders, with their own language and culture", wrong: ["Soldiers sent from France", "A group of settlers from Britain", "People who lived only in cities"], hint: "The Métis Nation has its own identity, and Métis communities continue today." },
  { prompt: "Which company received a royal charter in 1670 to trade furs from the Hudson Bay region?", right: "the Hudson's Bay Company", wrong: ["the North West Company", "the Canada Company", "the Bank of Montreal"], hint: "The Hudson's Bay Company is one of the oldest companies in North America." },
  { prompt: "The North West Company, started by Montreal merchants in 1779, was…", right: "a fur trade company that competed with the Hudson's Bay Company", wrong: ["a railway company", "a French navy unit", "a school for fur traders"], hint: "Competition between the two led to more inland trading posts." },
  { prompt: "Each summer, fishers from Europe came to the coast of Newfoundland to…", right: "catch cod and dry it on shore, then return home in the fall", wrong: ["build cities that stayed all year", "farm wheat", "mine gold"], hint: "Migrant fishers did not live there year-round at first." },
  { prompt: "Around 1760, about 70 000 people lived in New France. The British colonies to the south had more than a million people. What difference did this make?", right: "Britain could send far more people and resources against New France", wrong: ["New France had the larger army", "It had no effect on the balance of power", "The British colonies were much poorer"], hint: "The population gap helped shape who held power.", hard: true },
  { prompt: "Which is a key difference between life in New France and life in Canada today?", right: "Most people then lived in rural communities and farmed; today most Canadians live in towns and cities", wrong: ["Most people had cars then", "Most people then worked in offices", "Everyone voted in elections"], hint: "In New France, about four in five people lived outside the main towns.", hard: true },
  { prompt: "In winter in New France, frozen rivers and snow meant travellers could…", right: "use them as roads, with snowshoes, sleighs and sleds", wrong: ["use trains", "not travel at all", "only travel by air"], hint: "Winter changed how people moved about." },
  { prompt: "What did the corvée require of habitants?", right: "A few days of work each year for the community or the seigneur", wrong: ["A yearly voyage to France", "Serving as a priest", "Sailing on a ship"], hint: "Habitants owed labour as well as rent.", hard: true },
  { prompt: "Pemmican, made from dried meat and fat, was important to fur trade travellers because…", right: "it was light, lasted a long time and gave plenty of energy", wrong: ["it spoiled quickly", "it had to be eaten fresh", "it was heavy and bulky"], hint: "Long journeys needed food that kept well.", hard: true },
  { prompt: "Which river was the main highway of New France?", right: "the St. Lawrence River", wrong: ["the Fraser River", "the Red River", "the Mackenzie River"], hint: "Most towns and farms stood along it." },
  { prompt: "Which was an important settlement in New France in the 1600s and 1700s?", right: "Montréal", wrong: ["Calgary", "Whitehorse", "Saskatoon"], hint: "It began as a fur trade and mission settlement on an island in the St. Lawrence." },
  { prompt: "What did habitants often grow and make for themselves on their farms?", right: "Wheat, vegetables and woven cloth", wrong: ["Rubber and coffee", "Steel and glass", "Cars and radios"], hint: "Most families supplied their own needs." },
  { prompt: "Why did the French and many First Nations form trading partnerships?", right: "Both groups gained from trading furs and goods", wrong: ["Neither group wanted trade", "They both wanted only land", "It was required by hockey rules"], hint: "Trade was mutual, though it also created pressures." },
  { prompt: "What was a coureur des bois?", right: "A person who travelled inland to trade furs, often without a licence", wrong: ["A court judge", "A town baker", "A school teacher"], hint: "The name means 'runner of the woods'." },
  { prompt: "Which language did most people speak in New France?", right: "French", wrong: ["Spanish", "Dutch", "German"], hint: "The colony was settled mostly by people from France." },
  { prompt: "What did the Treaty of Utrecht (1713) do?", right: "France gave Britain control of Acadia (mainland Nova Scotia), Newfoundland and Hudson Bay", wrong: ["It gave Britain the Prairies", "It ended the fur trade", "It created Nunavut"], hint: "It was a peace treaty after a European war." },
];

function newFrance(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const bars = textChoice(
    "Which statement is supported by the graph?",
    "The British colonies had many more people than New France",
    ["New France had more people than the British colonies", "The two had about the same population", "Neither had any people in 1760"],
    "Compare the bars: the colonies to the south were far larger.",
    POPULATION,
  );
  return shuffle([bars, yearQuestion("In what year did the Hudson's Bay Company receive its royal charter?", 1670, [1608, 1713, 1759], "The charter was granted by King Charles II."), ...levelled(NEWFRANCE_BANK, 6, d)]);
}

// ---------- Power and conflict, 1713 to 1800 ----------

const POWER_STEPS = [
  { id: "utrecht", label: "Treaty of Utrecht gives Acadia to Britain", emoji: "📜" },
  { id: "acadia", label: "The expulsion of the Acadians begins", emoji: "⛵" },
  { id: "plains", label: "Battle of the Plains of Abraham", emoji: "⚔️" },
  { id: "proc", label: "Royal Proclamation of 1763", emoji: "📜" },
  { id: "quebec", label: "Quebec Act", emoji: "⚖️" },
  { id: "const", label: "Constitutional Act creates Upper and Lower Canada", emoji: "🗺️" },
];

const POWER_BANK: Item[] = [
  { prompt: "What did Britain gain from France in the Treaty of Utrecht (1713)?", right: "Acadia, along with claims to Newfoundland and the Hudson Bay region", wrong: ["All of New France, including Quebec City", "Louisbourg and the rest of Île Royale", "The Ohio Valley"], hint: "France kept the St. Lawrence colony and Île Royale at this time." },
  { prompt: "Which two generals died after the Battle of the Plains of Abraham in 1759?", right: "James Wolfe and the Marquis de Montcalm", wrong: ["Isaac Brock and Tecumseh", "Pontiac and Joseph Brant", "James Wolfe and Pontiac"], hint: "Both commanders were mortally wounded." },
  { prompt: "What was the Seven Years' War?", right: "A global war between Britain and France and their allies, including in North America", wrong: ["A civil war within New France", "A war between two First Nations", "A war that lasted exactly seven weeks"], hint: "Many First Nations were allies of one side or the other, or tried to stay neutral." },
  { prompt: "Why did many First Nations choose sides in the Seven Years' War?", right: "Each Nation acted according to its own interests, including trade, alliances and defending its lands", wrong: ["All First Nations agreed on one side", "They did not care about the outcome", "They were ordered to by France"], hint: "Nations made their own decisions. There was no single First Nations view." },
  { prompt: "Under the Treaty of Paris (1763), France handed over to Britain…", right: "most of its North American colonies, including New France", wrong: ["only Louisbourg", "Spain's colonies in Mexico", "nothing at all"], hint: "France kept the small islands of Saint-Pierre and Miquelon." },
  { prompt: "What did the Royal Proclamation of 1763 say about land?", right: "Only the Crown could buy land from First Nations, which settlers could not buy directly", wrong: ["Settlers could take any land they wanted", "All land belonged to the settlers", "First Nations could never sell land"], hint: "Many First Nations point to it as recognition that they held rights to their lands." },
  { prompt: "Why did Pontiac and allied Nations resist the British in 1763?", right: "The British took over forts, reduced gift-giving and trade, and settlers moved onto their lands", wrong: ["They wanted to join the British army", "France ordered them to make peace", "They wanted to move to Europe"], hint: "After the French left, many Nations had to deal with new British policies." },
  { prompt: "What did the Quebec Act (1774) do?", right: "It protected French civil law and the Catholic religion in Quebec", wrong: ["It ended French language rights", "It made Quebec part of the United States", "It banned all trade"], hint: "Britain wanted the loyalty of the French-speaking majority." },
  { prompt: "What did the Constitutional Act (1791) do?", right: "It divided Quebec into Upper Canada and Lower Canada", wrong: ["It joined all colonies into one", "It gave every adult the vote", "It ended the fur trade"], hint: "Upper Canada used British law and Lower Canada kept French civil law." },
  { prompt: "Why did the Loyalists leave the United States?", right: "They stayed loyal to Britain during the American Revolution and often faced hostility", wrong: ["They wanted to join the revolution", "They wanted to find gold", "They were sent by France"], hint: "Many Loyalists settled in Nova Scotia, New Brunswick and what became Upper Canada." },
  { prompt: "Many Acadians had stayed neutral in the war between Britain and France. How did British officials justify the expulsion?", right: "They feared Acadians who would not swear an unconditional oath might help France", wrong: ["The Acadians asked to leave", "The Acadians had attacked London", "The Acadians had too many schools"], hint: "That was the British view. It is not the only one, and many historians judge the expulsion to have been harsh and unjust." },
  { prompt: "Which statement describes the Acadian perspective?", right: "Many wanted to stay neutral and keep their farms, faith and community", wrong: ["All Acadians wanted to leave", "All Acadians fought for Britain", "They had no connection to the land"], hint: "Acadians had lived on their farms for generations." },
  { prompt: "What happened to many Acadian farms after the expulsion?", right: "They were taken over by new settlers, including New England Planters", wrong: ["They were left empty for 100 years", "They were handed to the Acadians' neighbours in France", "They were turned into towns for the Acadians"], hint: "Britain wanted to settle the land with people loyal to the Crown." },
  { prompt: "Acadians were scattered after 1755. Where did some of them eventually go?", right: "France, other British colonies, Quebec and later Louisiana, and some returned to the Maritimes", wrong: ["Only to Asia", "Only to Antarctica", "Only to Australia"], hint: "Acadian communities exist today in the Maritimes, Quebec and Louisiana." },
  { prompt: "A British officer wrote a letter in 1755 explaining why Acadians had to be removed. How should we treat this source?", right: "As one perspective from someone with an interest in justifying the action", wrong: ["As proof that no other view exists", "As a neutral report by an outsider", "As useless because it is old"], hint: "Always ask who wrote it, why, and what other sources say." },
  { prompt: "A well-known painting of General Wolfe's death was painted years after the battle by an artist who was not there. What should historians keep in mind?", right: "The artist may have shown the scene to honour Wolfe, not as an exact record", wrong: ["Paintings always show exact events", "Only photographs can be evidence", "It proves Wolfe won by himself"], hint: "Check when, by whom and why a source was made.", hard: true },
  { prompt: "The Treaty of Niagara (1764) was sealed with wampum belts. Why were wampum belts used?", right: "They recorded and reminded people of the promises made in an agreement", wrong: ["They were used as money for shops", "They were used to pay taxes", "They were only decorations"], hint: "Wampum belts hold the meaning of agreements and are kept and read by Nations.", hard: true },
  { prompt: "Which Treaty ended the American Revolutionary War in 1783 and set a new border between the United States and British North America?", right: "the Treaty of Paris (1783)", wrong: ["the Treaty of Utrecht", "the Quebec Act", "the Treaty of Ghent"], hint: "It recognized the independence of the United States.", hard: true },
  { prompt: "Which was a long-term effect of the American Revolution on British North America?", right: "Thousands of Loyalists arrived, changing the population and leading to new colonies", wrong: ["The colonies joined the United States", "French rule was restored", "The fur trade ended forever"], hint: "New Brunswick and Upper Canada grew from Loyalist settlement.", hard: true },
];

function powerConflict(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const years = pick([
    () => yearQuestion("In what year was the Battle of the Plains of Abraham fought?", 1759, [1756, 1763, 1775], "The battle took place outside Quebec City in September 1759."),
    () => yearQuestion("In what year was the Royal Proclamation issued?", 1763, [1759, 1774, 1791], "It followed the Treaty of Paris of 1763."),
    () => yearQuestion("In what year was the Quebec Act passed?", 1774, [1763, 1791, 1812], "It came a few years before the American Revolution."),
    () => yearQuestion("In what year did the Constitutional Act create Upper and Lower Canada?", 1791, [1774, 1812, 1840], "It was passed by the British Parliament in 1791."),
    () => yearQuestion("In what year did the expulsion of the Acadians begin?", 1755, [1713, 1763, 1775], "It began in 1755 and continued for several years."),
    () => yearQuestion("In what year was the Treaty of Utrecht signed?", 1713, [1670, 1759, 1774], "It ended a European war and gave Britain control of Acadia."),
  ])();
  return shuffle([
    orderQuestion("Put these events in the order they happened.", "Utrecht 1713, expulsion of the Acadians begins 1755, Plains of Abraham 1759, Royal Proclamation 1763, Quebec Act 1774, Constitutional Act 1791.", POWER_STEPS, d),
    years,
    ...levelled(POWER_BANK, 6, d),
  ]);
}

// ---------- Black communities in Canada ----------

const BLACK_STEPS = [
  { id: "loyalist", label: "Black Loyalists settle in Nova Scotia", emoji: "⛵" },
  { id: "act", label: "Upper Canada limits slavery", emoji: "📜" },
  { id: "maroon", label: "Jamaican Maroons are sent to Nova Scotia", emoji: "⛵" },
  { id: "abolish", label: "The Slavery Abolition Act takes effect", emoji: "🗽" },
  { id: "buxton", label: "The Elgin Settlement (Buxton) is founded", emoji: "🏡" },
];

const BLACK_BANK: Item[] = [
  { prompt: "Was slavery legal in New France and early British North America?", right: "Yes, enslaved Indigenous and African people were held there", wrong: ["No, it was never allowed", "Only in Newfoundland", "Only after 1900"], hint: "Slavery was part of Canada's history. People resisted it in many ways." },
  { prompt: "Marie-Josèphe Angélique was an enslaved woman in Montreal. Why is she remembered?", right: "As a symbol of resistance to slavery, after being convicted in a trial in 1734", wrong: ["As a governor of New France", "As the founder of a school", "As a fur trade company owner"], hint: "Historians still discuss what happened, but her story is part of Black history in Canada." },
  { prompt: "Why did Black Loyalists come to Nova Scotia after the American Revolution?", right: "They had supported Britain, which promised them freedom and land", wrong: ["They wanted to join the American army", "They were sent by France", "They came to find gold"], hint: "Britain promised freedom to people enslaved by Patriots who joined the British side." },
  { prompt: "Birchtown, Nova Scotia, became…", right: "one of the largest free Black communities in North America at the time", wrong: ["a fur trade fort", "a French capital", "a mining town"], hint: "Many Black Loyalists settled there, though they often faced discrimination and delayed land grants." },
  { prompt: "Why did many Black Loyalists wait years for land promised to them?", right: "They faced discrimination from officials and settlers", wrong: ["They did not want land", "There was no land left in Canada", "They were too young"], hint: "Many received poorer land, or none, and some later left for Sierra Leone." },
  { prompt: "What did the 1793 Act to Limit Slavery in Upper Canada do?", right: "It stopped more enslaved people from being brought in and set a path to freedom for children of the enslaved", wrong: ["It freed everyone immediately", "It made slavery legal for the first time", "It created the Underground Railroad"], hint: "It did not free those already enslaved, but it began to end slavery in Upper Canada." },
  { prompt: "In 1793, Chloe Cooley, an enslaved woman, was forced across the Niagara River and sold. Why is her story important?", right: "It helped lead to the Act to Limit Slavery in Upper Canada", wrong: ["It ended slavery everywhere in Canada", "It started the War of 1812", "It created the Constitutional Act"], hint: "Peter Martin, a Black Loyalist, reported what happened to the government." },
  { prompt: "When did the Slavery Abolition Act take effect across the British Empire, including British North America?", right: "August 1, 1834", wrong: ["August 1, 1793", "August 1, 1867", "August 1, 1900"], hint: "Many Black communities in Canada still mark Emancipation Day on August 1." },
  { prompt: "What was the Underground Railroad?", right: "A network of secret routes and helpers that supported people escaping slavery to freedom", wrong: ["An actual subway system", "A fur trade railway", "A railway built by the British army"], hint: "Many freedom seekers reached what is now Ontario, Nova Scotia and Quebec." },
  { prompt: "Wilberforce (1830), Dawn (1841) and Elgin or Buxton (1849) were…", right: "settlements in Upper Canada built by and for Black families", wrong: ["British army forts", "French missions", "fur trade posts"], hint: "Families built farms, churches and schools to create community." },
  { prompt: "How did Black communities foster pride and belonging?", right: "By building churches, schools and newspapers and celebrating Emancipation Day", wrong: ["By avoiding all gatherings", "By hiding their culture", "By leaving Canada"], hint: "Communities supported one another and kept traditions alive." },
  { prompt: "Josiah Henson helped found the Dawn Settlement. What did the community try to provide?", right: "Land, a school and work for families who escaped slavery", wrong: ["A ship for travel to Europe", "A gold mine", "A military fort"], hint: "Dawn was near present-day Dresden, Ontario.", hard: true },
  { prompt: "Black people in British North America faced barriers such as segregated schools and unequal treatment. How did many respond?", right: "They built their own institutions and spoke out for equal rights", wrong: ["They accepted every unfair rule", "They had no responses", "They were not affected"], hint: "Communities organized for fairness and opportunity.", hard: true },
  { prompt: "Why do historians include the stories of enslaved and free Black people when describing early Canada?", right: "They were part of the country's economy, communities and struggles from the beginning", wrong: ["They were only visitors", "They are not mentioned in any records", "They did not work or build communities"], hint: "A full picture of the past includes many voices.", hard: true },
  { prompt: "Who escaped slavery and then helped others build a community in Upper Canada?", right: "Josiah Henson", wrong: ["Isaac Brock", "William Lyon Mackenzie", "Pontiac"], hint: "He became a leader of the Dawn Settlement.", hard: true },
];

function blackHistory(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const year = pick([
    () => yearQuestion("In what year did the Act to Limit Slavery in Upper Canada pass?", 1793, [1783, 1812, 1837], "John Graves Simcoe's government passed it in 1793."),
    () => yearQuestion("In what year did the Slavery Abolition Act take effect across the British Empire?", 1834, [1793, 1812, 1867], "It took effect on August 1, 1834."),
  ])();
  return shuffle([
    orderQuestion("Put these events in the order they happened.", "Black Loyalists 1783 to 1785, Upper Canada's Act to Limit Slavery 1793, the Maroons arrive in 1796, the Abolition Act takes effect 1834, the Elgin Settlement is founded in 1849.", BLACK_STEPS, d),
    year,
    ...levelled(BLACK_BANK, 6, d),
  ]);
}

// ---------- Loyalists, the War of 1812 and a growing colony ----------

const WAR_STEPS = [
  { id: "grand", label: "The Haldimand grant at the Grand River", emoji: "🗺️" },
  { id: "const", label: "Upper Canada is created", emoji: "🗺️" },
  { id: "war", label: "The War of 1812 begins", emoji: "⚔️" },
  { id: "ghent", label: "The Treaty of Ghent is signed", emoji: "📜" },
  { id: "merge", label: "The Hudson's Bay and North West Companies merge", emoji: "🦫" },
  { id: "rideau", label: "The Rideau Canal opens", emoji: "🚤" },
];

const WAR_BANK: Item[] = [
  { prompt: "Which was one cause of the War of 1812?", right: "British limits on American trade and the taking of sailors from American ships", wrong: ["The discovery of gold in Upper Canada", "The Quebec Act", "A dispute about the fur trade in the Yukon"], hint: "Britain was at war with France and was stopping neutral ships." },
  { prompt: "Many First Nations allied with the British in the War of 1812. Why?", right: "They wanted to protect their lands from American expansion", wrong: ["They wanted to rule England", "They had no land to protect", "They were paid in gold"], hint: "Each Nation made its own decisions. Some also stayed neutral or sided with the United States." },
  { prompt: "Tecumseh, a Shawnee leader, worked to…", right: "unite Nations to defend Indigenous homelands against American expansion", wrong: ["bring settlers to the Great Lakes", "found a British colony", "sell land to the United States"], hint: "He was killed at the Battle of the Thames in 1813." },
  { prompt: "Major-General Isaac Brock was killed at the Battle of Queenston Heights in…", right: "1812", wrong: ["1759", "1837", "1867"], hint: "The battle was fought in October 1812 near Niagara." },
  { prompt: "What did Laura Secord do in 1813?", right: "She walked through the countryside to warn British officers of a planned American attack", wrong: ["She led the American army", "She signed the Treaty of Ghent", "She founded the North West Company"], hint: "Her warning helped the British and their allies win at Beaver Dams." },
  { prompt: "At the Battle of Châteauguay in 1813, a smaller force of mostly Canadian militia, Mohawk warriors and British regulars…", right: "turned back a larger American army", wrong: ["captured Washington", "surrendered at once", "burned York"], hint: "Charles de Salaberry led the defence." },
  { prompt: "In 1813, American troops burned some buildings in York (Toronto). In 1814, British troops burned public buildings in…", right: "Washington", wrong: ["Montreal", "Quebec City", "Halifax"], hint: "Both sides burned buildings during the war." },
  { prompt: "What did the Treaty of Ghent (1814) do?", right: "It ended the war and returned borders to what they were before it", wrong: ["It gave Upper Canada to the United States", "It gave all land to Britain", "It created Canada"], hint: "Neither side gained territory." },
  { prompt: "What did the Treaty of Ghent mean for many First Nations allies?", right: "It did not secure the independent homeland Tecumseh had worked for, and settlement continued", wrong: ["It gave them all of Upper Canada", "It made them citizens overnight", "It ended all trade"], hint: "Their role was important, but the treaty did not protect their territory the way they had hoped." },
  { prompt: "Joseph Brant, a Mohawk leader, led many Haudenosaunee people who had allied with Britain to…", right: "land along the Grand River in what is now Ontario", wrong: ["the Yukon", "the coast of Labrador", "the island of Montreal"], hint: "The Six Nations of the Grand River community is there today." },
  { prompt: "The Haudenosaunee Confederacy members did not all take the same side in the American Revolution. What does this show?", right: "Nations made their own decisions, so a single viewpoint cannot speak for all", wrong: ["The Confederacy had no members", "All Nations always agree", "They took no part"], hint: "Some Nations allied with Britain and others with the American side." },
  { prompt: "Why was the Rideau Canal (1826 to 1832) built?", right: "To give the military a safe supply route away from the American border", wrong: ["To dry out a swamp for farming", "To connect the Pacific to the Atlantic", "To bring water to Montreal"], hint: "The war had shown how risky the St. Lawrence route was." },
  { prompt: "The Welland Canal (1829) allowed ships to…", right: "bypass Niagara Falls between Lake Ontario and Lake Erie", wrong: ["cross the Rocky Mountains", "reach the Pacific Ocean", "travel from Hudson Bay to the Gulf of Mexico"], hint: "Locks lift ships up and down the Niagara Escarpment." },
  { prompt: "In 1821 the Hudson's Bay Company and the North West Company…", right: "merged into one company", wrong: ["went to war", "were closed by the government", "moved to the United States"], hint: "Competition had become costly for both." },
  { prompt: "At Seven Oaks in 1816, conflict broke out at the Red River between…", right: "Métis, allied with the North West Company, and settlers backed by the Hudson's Bay Company", wrong: ["British and American soldiers", "French and British navies", "Loyalists and Acadians"], hint: "The Red River settlement was disputed ground in a competition over trade and land.", hard: true },
  { prompt: "Cuthbert Grant is remembered as…", right: "a Métis leader at Seven Oaks", wrong: ["a British general", "an Acadian governor", "a Loyalist judge"], hint: "The Métis Nation developed a distinct identity on the plains.", hard: true },
  { prompt: "Many historians say the War of 1812 helped British North Americans feel distinct from the United States. How could that be?", right: "Shared defence against invasion strengthened local identity and loyalty to Britain", wrong: ["The war made everyone join the United States", "The war ended all fears of invasion", "It had no effect on local feelings"], hint: "This is an interpretation. Historians do not all agree on how large the effect was.", hard: true },
  { prompt: "In 1850, the Robinson Treaties were made between the Crown and Anishinaabe Nations of the areas north of which lakes?", right: "Lake Huron and Lake Superior", wrong: ["Lake Ontario and Lake Erie", "Lake Champlain and Lake George", "Lake Winnipeg and Lake Athabasca"], hint: "Treaty rights and promises from these agreements are still discussed and upheld today.", hard: true },
];

function warOf1812(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const year = pick([
    () => yearQuestion("In what year was the Treaty of Ghent signed?", 1814, [1812, 1837, 1763], "It was signed in December 1814."),
    () => yearQuestion("In what year did the War of 1812 begin?", 1812, [1791, 1837, 1867], "The United States declared war on Britain in June 1812."),
  ])();
  return shuffle([
    orderQuestion("Put these events in the order they happened.", "Grand River grant 1784, Upper Canada created 1791, War of 1812 begins 1812, Treaty of Ghent 1814, company merger 1821, Rideau Canal opens 1832.", WAR_STEPS, d),
    year,
    ...levelled(WAR_BANK, 6, d),
  ]);
}

// ---------- Reform, rebellions and responsible government ----------

const REFORM_STEPS = [
  { id: "ninety", label: "Ninety-Two Resolutions in Lower Canada", emoji: "📜" },
  { id: "rebel", label: "Rebellions in Lower and Upper Canada", emoji: "⚔️" },
  { id: "durham", label: "Lord Durham's report", emoji: "📄" },
  { id: "union", label: "The Act of Union is passed", emoji: "🗺️" },
  { id: "resp", label: "Responsible government in the Province of Canada", emoji: "🏛️" },
  { id: "losses", label: "The Rebellion Losses Bill and the burning of Parliament", emoji: "🔥" },
];

const GROUP_TABLE: Visual = {
  type: "table",
  title: "Groups in the 1830s and what they wanted",
  headers: ["Group", "Main goal"],
  rows: [
    ["Patriotes (Lower Canada)", "Elected government and protection of French language and laws"],
    ["Reformers (Upper Canada)", "A government that answers to the elected assembly"],
    ["Family Compact", "Keep the existing order and close ties to Britain"],
    ["Château Clique", "Keep power and protect British commercial interests"],
  ],
};

function groupQuestion(): Question {
  const rows = (GROUP_TABLE as { rows: string[][] }).rows;
  const r = pick(rows);
  const wrong = rows.filter((x) => x !== r).map((x) => x[0]);
  return textChoice(`Which group's main goal was this? "${r[1]}"`, r[0], wrong, "Match the goal to the group in the table.", GROUP_TABLE);
}

const REFORM_BANK: Item[] = [
  { prompt: "In Upper Canada, which body was elected by voters?", right: "the Legislative Assembly", wrong: ["the Executive Council", "the Legislative Council", "the governor's staff"], hint: "The governor and councils were appointed. Only the Assembly was elected." },
  { prompt: "Who could vote in the 1830s?", right: "Mostly men who owned property", wrong: ["All adults", "Only children", "Only people born in Britain"], hint: "Most adults could not vote, including most women and many working people." },
  { prompt: "What was the Family Compact?", right: "A small group of wealthy and powerful men who dominated Upper Canada's government", wrong: ["A group of families who farmed together", "A religious order", "A union of workers"], hint: "Critics said they held power without being elected." },
  { prompt: "What was the Château Clique?", right: "A small group of English-speaking officials and merchants who dominated Lower Canada's government", wrong: ["A club of French-speaking farmers", "A group of fur traders in the north", "A military unit"], hint: "They held more power than the elected Assembly with its French-speaking majority." },
  { prompt: "William Lyon Mackenzie is known as…", right: "a newspaper publisher and Reformer who led the Upper Canada Rebellion in 1837", wrong: ["a Loyalist general", "a fur trader", "the founder of Nova Scotia"], hint: "He criticized the Family Compact in his newspaper." },
  { prompt: "Louis-Joseph Papineau is known as…", right: "a leading figure of the Patriotes in Lower Canada", wrong: ["a Governor General", "a leader of the Family Compact", "a Loyalist settler"], hint: "He spoke for the elected Assembly's powers." },
  { prompt: "What was a major reason for the Rebellions of 1837 and 1838?", right: "Many people wanted an elected government that had real power", wrong: ["Britain had banned all trade", "Everyone wanted to join the United States", "Farmers stopped planting crops"], hint: "The appointed councils and governors could overrule the Assembly." },
  { prompt: "Which statement is the fairest about the rebels of 1837 and 1838?", right: "People at the time and since have judged them differently, so historians weigh their goals and their methods", wrong: ["Everyone agreed that they were heroes", "Everyone agreed that they were criminals", "Nobody has ever disagreed about them"], hint: "Perspectives differ. Good history looks at goals, actions and consequences." },
  { prompt: "What did Lord Durham recommend in his report (1839)?", right: "Responsible government, and uniting the two Canadas", wrong: ["Making Canada part of the United States", "Giving full independence at once", "Closing the Assembly"], hint: "He also suggested that French Canadians should be assimilated, which many opposed." },
  { prompt: "How did many French Canadians respond to the idea of assimilation in the Durham Report?", right: "They saw it as a threat to their language, laws and culture", wrong: ["They welcomed it", "They did not read it", "They asked to move to England"], hint: "Different groups saw the same report very differently." },
  { prompt: "The Act of Union joined which two colonies into the Province of Canada?", right: "Upper Canada and Lower Canada", wrong: ["Nova Scotia and New Brunswick", "Upper Canada and Nova Scotia", "Lower Canada and Newfoundland"], hint: "The Act passed in 1840 and took effect in 1841." },
  { prompt: "What is responsible government?", right: "The government must have the support of the majority of the elected assembly", wrong: ["The governor makes all decisions", "The government is appointed for life", "Only the Crown can pass laws"], hint: "Ministers answer to the elected members." },
  { prompt: "Robert Baldwin and Louis-Hippolyte LaFontaine are known for…", right: "working together as Reformers to win responsible government", wrong: ["leading the Family Compact", "fighting in the War of 1812", "founding the Hudson's Bay Company"], hint: "They represented Reformers from Canada West and Canada East." },
  { prompt: "The Rebellion Losses Bill (1849) paid people for property damaged in the rebellions. Why did it spark riots in Montreal?", right: "Some English-speaking opponents were angry it might help people tied to the rebels", wrong: ["Nobody was affected", "It banned the use of English", "It ended elections"], hint: "A crowd burned the Parliament building in 1849. The bill still became law." },
  { prompt: "Great numbers of Irish people came to British North America in the 1840s. What was one reason?", right: "The Great Famine in Ireland left many starving", wrong: ["Gold was found in Ontario", "They were sent as soldiers", "Ireland was joined to Canada"], hint: "Potato crops failed in Ireland from 1845 to 1849." },
  { prompt: "In 1847, ships carrying Irish famine emigrants arrived at Grosse Île near Quebec City. What was the main danger?", right: "Typhus and other diseases spread among crowded, sick passengers", wrong: ["Gold fever", "Floods from the St. Lawrence", "Wolves"], hint: "The quarantine station was overwhelmed. Many people died, and many were cared for by local families." },
  { prompt: "A global recession in the late 1830s affected colonists by…", right: "making jobs and money harder to find", wrong: ["making everything free", "ending the need for work", "increasing wheat prices forever"], hint: "Hard times added to unhappiness with government." },
  { prompt: "Peter Jones (Kahkewāquonāby), a Mississauga leader and Methodist minister, travelled to Britain in the 1830s to…", right: "speak for his community's rights to its land", wrong: ["buy a ship", "open a bank", "fight in the army"], hint: "He asked the British government to recognize his people's title to land.", hard: true },
  { prompt: "A newspaper owned by William Lyon Mackenzie said the government was corrupt. How should a historian use this source?", right: "As evidence of what reformers thought, checked against other sources", wrong: ["As a complete record of the facts", "As worthless because it is old", "As a report by neutral observers"], hint: "Newspapers had owners who held strong views.", hard: true },
  { prompt: "Why did colonists have to wait until 1848 for responsible government in the Province of Canada?", right: "Britain had been reluctant, and it took reform movements and political change to win it", wrong: ["The idea was never asked for", "There were no elections", "It had existed since 1791"], hint: "Nova Scotia was first in early 1848. The Province of Canada followed.", hard: true },
];

function reform(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const year = pick([
    () => yearQuestion("In what year did the rebellions begin in Lower Canada and then Upper Canada?", 1837, [1812, 1848, 1867], "The fighting began in November and December 1837."),
    () => yearQuestion("In what year was the Act of Union passed?", 1840, [1791, 1837, 1867], "It was passed in 1840 and took effect in 1841."),
    () => yearQuestion("In what year was responsible government achieved in the Province of Canada?", 1848, [1791, 1837, 1867], "Baldwin and LaFontaine formed the first responsible government in 1848."),
  ])();
  return shuffle([
    orderQuestion("Put these events in the order they happened.", "Ninety-Two Resolutions 1834, rebellions 1837 to 1838, Durham Report 1839, Act of Union 1840, responsible government 1848, Rebellion Losses Bill 1849.", REFORM_STEPS, d),
    groupQuestion(),
    year,
    ...levelled(REFORM_BANK, 5, d),
  ]);
}

// ---------- The units ----------

export const units: Unit[] = [
  {
    id: "landforms-processes-7",
    title: "Landforms & Change",
    emoji: "⛰️",
    blurb: "How Earth's surface is shaped",
    parentNote: "Landforms, the natural processes (tectonic forces, weathering, erosion, deposition, glaciation) and human activities that change them, and how to read topographic maps with contour lines.",
    standards: on("Geography A3.1–A3.3", "landforms, the processes that change them, and topographic maps"),
    generate: landforms,
  },
  {
    id: "water-climate-7",
    title: "Water & Climate",
    emoji: "🌦️",
    blurb: "Oceans, rivers and climate regions",
    parentNote: "Major water bodies and drainage basins, how people and natural events change them, the world's climate regions and the factors behind them, and how to read climate-graph data.",
    standards: on("Geography A3.4–A3.8", "water bodies and systems; climate regions and climate graphs"),
    generate: waterClimate,
  },
  {
    id: "vegetation-people-7",
    title: "Plants, Land & People",
    emoji: "🌿",
    blurb: "Vegetation regions and responses",
    parentNote: "Natural vegetation regions, how landforms, climate and vegetation interact, how human activities such as overgrazing and deforestation change them, and how people have responded to challenges in their physical environments.",
    standards: on("Geography A1.1, A1.4, A3.9–A3.11", "vegetation regions, interactions in the physical environment, and human responses"),
    generate: vegetation,
  },
  {
    id: "natural-resources-7",
    title: "Natural Resources",
    emoji: "⛏️",
    blurb: "Renewable, non-renewable and flow",
    parentNote: "Renewable, non-renewable and flow resources, how a resource's location shapes how it is taken and used, and the short- and long-term effects on people and the environment, including reading GIS map layers.",
    standards: on("Geography B1.1, B1.2, B3.1–B3.3, B3.6", "types of natural resources, how they are extracted and used, and their effects"),
    generate: resources,
  },
  {
    id: "sustainability-7",
    title: "Sustainable Choices",
    emoji: "♻️",
    blurb: "Perspectives and taking action",
    parentNote: "Different groups' perspectives on resource use, responses such as renewable energy and certification, the roles of governments and organizations, and making a specific personal action plan. Includes checking sources for bias.",
    standards: on("Geography B1.3, B1.4, B2.2, B3.4, B3.5, A1.2", "perspectives on resource use, sustainability efforts and personal action"),
    generate: sustainability,
  },
  {
    id: "new-france-7",
    title: "New France & the Fur Trade",
    emoji: "🦫",
    blurb: "Life in the colony",
    parentNote: "Daily life in New France (seigneurs and habitants, towns, Church), the fur trade and its partnerships with First Nations, the Métis, and migrant fishers, compared with life in Canada today.",
    standards: on("History A1.1, A3.4, A3.5, A3.6, A3.9", "daily life and communities in Canada between 1713 and 1800, and the fur trade"),
    generate: newFrance,
  },
  {
    id: "power-conflict-7",
    title: "Power & Conflict, 1713 to 1800",
    emoji: "⚔️",
    blurb: "From France to Britain",
    parentNote: "The Treaty of Utrecht, the expulsion of the Acadians, the Seven Years' War, the Royal Proclamation of 1763, the Quebec Act, the Loyalists and the Constitutional Act, with attention to the perspectives of different groups and to checking sources.",
    standards: on("History A1.2, A1.3, A2.3, A3.1–A3.3, A3.8", "events, treaties and changes in Canada between 1713 and 1800, including the displacement of the Acadians"),
    generate: powerConflict,
  },
  {
    id: "black-history-7",
    title: "Black History in Canada",
    emoji: "🌟",
    blurb: "Slavery, freedom and community",
    parentNote: "Slavery in early Canada and how people resisted it, Black Loyalists, the Act to Limit Slavery in Upper Canada, the Slavery Abolition Act, the Underground Railroad, and Black settlements that built a sense of belonging and pride up to 1850.",
    standards: on("History A3.7, B3.3, B3.5", "Black individuals and communities in Canada up to 1850"),
    generate: blackHistory,
  },
  {
    id: "war-1812-7",
    title: "Loyalists & the War of 1812",
    emoji: "🛶",
    blurb: "Conflict and a changing colony",
    parentNote: "Loyalist settlement, the causes, key people and outcome of the War of 1812 (including the roles of First Nations allies and the Treaty of Ghent), and growth after the war: canals, the fur trade companies and the Red River.",
    standards: on("History B1.2, B1.3, B3.1–B3.3, B3.6, B3.7", "the War of 1812 and its consequences in Canada between 1800 and 1850"),
    generate: warOf1812,
  },
  {
    id: "reform-rebellions-7",
    title: "Reform & Rebellion",
    emoji: "🏛️",
    blurb: "Fights for self-government",
    parentNote: "Government in Upper and Lower Canada, the Family Compact and Château Clique, the Rebellions of 1837 to 1838 from several points of view, the Durham Report, the Act of Union, immigration and hardship, and responsible government in 1848.",
    standards: on("History B1.1, B1.2, B2.3, B2.5, B3.1, B3.3, B3.4, B3.7", "reform movements, rebellions and political change in Canada between 1800 and 1850"),
    generate: reform,
  },
];
