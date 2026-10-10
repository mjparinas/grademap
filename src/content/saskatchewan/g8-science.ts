import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 8 Science, Earth and Space Science: Water Systems on Earth (WS8.1–WS8.3).

// ---------- Changes to water ----------

const CHANGE_SORT: SortSet = {
  prompt: "Is the change natural or caused by people? Tap a change, then tap its basket.",
  hint: "Natural changes happen without people, such as spring snowmelt. Human-induced changes come from what people do, such as draining wetlands.",
  bins: [
    { id: "nat", label: "natural change", emoji: "🌦️" },
    { id: "hum", label: "human-induced change", emoji: "🚜" },
  ],
  items: [
    { label: "spring snowmelt fills a creek", emoji: "❄️", bin: "nat" },
    { label: "a long dry spell lowers a lake", emoji: "☀️", bin: "nat" },
    { label: "heavy rain makes a river rise", emoji: "🌧️", bin: "nat" },
    { label: "a beaver dam floods a meadow", emoji: "🦫", bin: "nat" },
    { label: "a wetland is drained for farmland", emoji: "🚜", bin: "hum" },
    { label: "a dam creates a reservoir", emoji: "🏞️", bin: "hum" },
    { label: "water is piped for irrigation", emoji: "💧", bin: "hum" },
    { label: "pavement stops rain soaking in", emoji: "🛣️", bin: "hum" },
  ],
};

const WATERSHED_ORDER = order("Put these in order along the path of water from the land to Hudson Bay.", "Water runs downhill from small streams into rivers and lakes, and then toward the sea.", [
  ["Rain and snowmelt run off the prairie", "🌧️"],
  ["Small creeks collect the water", "🏞️"],
  ["The South Saskatchewan River carries it", "🌊"],
  ["It flows into the Saskatchewan River and Lake Winnipeg", "🛶"],
  ["It reaches Hudson Bay", "🌐"],
]);

const WATER: Item[] = [
  q("What is a watershed?", "all the land that drains into one river or lake", ["a shed beside a lake", "a type of cloud", "water stored in a barrel"], "Rain and snowmelt anywhere in a watershed flow to the same place.", "🏞️"),
  q("What is the water cycle?", "the continuous movement of water between land, air and bodies of water", ["a bicycle for boats", "water that never moves", "the cycle of the Moon"], "The Sun powers evaporation, condensation and precipitation.", "♻️"),
  q("Which part of the water cycle puts water vapour into the air from lakes?", "evaporation", ["condensation", "precipitation", "runoff"], "Heat changes liquid water into a gas.", "☀️"),
  q("What is runoff?", "water that flows over the ground into streams and rivers", ["water in the clouds", "water in a glacier", "water vapour"], "Runoff carries melted snow and rain downhill.", "🌊"),
  q("What is groundwater?", "water held in soil and rock under the ground", ["water in a cloud", "water in a bottle", "salt water in the ocean"], "Many farms and towns in Saskatchewan draw drinking water from wells.", "🕳️"),
  q("What is a prairie pothole?", "a small, shallow wetland left by glaciers", ["a hole in a road", "a type of lake in the north", "a mine"], "Potholes hold snowmelt and rain and are important to ducks and other wildlife.", "🦆"),
  q("Why are prairie wetlands useful in spring?", "they hold extra water and slow flooding", ["they stop snow from melting", "they make rivers disappear", "they create wind"], "A wetland works like a sponge.", "🧽"),
  q("What happens to flooding downstream when many wetlands are drained?", "there is more runoff, so floods can be worse", ["floods always stop", "rivers freeze", "the wind stops"], "Less storage means more water reaches rivers at once.", "🌊"),
  q("What is a drought?", "a long period with less water than normal", ["a very big flood", "a strong wind", "a type of cloud"], "Drought can affect crops, grass for cattle and water supplies.", "☀️"),
  q("In the 1930s, much of southern Saskatchewan had years of drought. What was it called?", "the Dirty Thirties", ["the Wet Fifties", "the Ice Age", "the Great Flood"], "Dry soil blew away in dust storms and many crops failed.", "🌾"),
  q("Which kind of change can cause a spring flood on the prairies?", "fast snowmelt with frozen ground", ["a dry autumn", "a drought", "a windless winter"], "Frozen ground cannot soak up meltwater, so it runs off.", "❄️"),
  q("Why can a long drought lower the water level of a lake?", "more water evaporates than flows in", ["the lake runs uphill", "rain turns to snow", "fish drink it all"], "Without enough inflow, the lake shrinks.", "📉"),
  q("A farmer builds a dugout to catch spring runoff. What is it for?", "to store water for animals or crops", ["to stop snowfall", "to cause a drought", "to grow wheat in the water"], "A dugout is a pond dug in the ground.", "🐄"),
  q("What is a reservoir?", "an artificial lake that stores water", ["a kind of cloud", "a glacier", "a desert"], "Lake Diefenbaker is a reservoir held by Gardiner Dam.", "🏞️"),
  q("Which of these is used to bring water to crops in dry southern Saskatchewan?", "irrigation", ["erosion", "condensation", "evaporation"], "Irrigation moves water to fields with canals, pipes or sprinklers.", "💧"),
  q("What does the Saskatchewan River system eventually flow to?", "Hudson Bay", ["the Pacific Ocean", "the Gulf of Mexico", "the Atlantic by the St. Lawrence"], "The water flows through Lake Winnipeg and the Nelson River to Hudson Bay.", "🌐"),
  q("What is a glacier?", "a large mass of ice that moves slowly over land", ["a fast river", "a sandy desert", "a thick cloud"], "Glaciers store a lot of Earth's fresh water.", "🧊"),
  q("Where is most of Earth's fresh water stored?", "in ice and in groundwater", ["in rivers", "in the clouds", "in lakes"], "Only a small share of fresh water is in rivers and lakes.", "🌍"),
  q("What can happen if people take too much groundwater out of a well?", "the water table drops", ["it fills with ice", "the well becomes a lake", "the rain stops for ever"], "The water table is the top of the groundwater.", "🕳️"),
  q("When a river's watershed is covered with pavement, rain…", "runs off quickly and can cause flooding", ["soaks into the ground", "turns into snow", "disappears"], "Pavement does not let water soak in.", "🛣️"),
  q("A city builds storm ponds. What do they do?", "hold heavy rain so it flows out slowly", ["make storms stronger", "dry up rivers", "make more pavement"], "Ponds reduce the chance of flooding after heavy rain.", "🌧️"),
  q("What is one human action that can pollute a watershed?", "fertilizer or waste washing into streams", ["planting trees", "protecting a wetland", "picking up litter"], "What is on the land can end up in the water.", "⚠️"),
  q("Which action helps protect water?", "keeping plants along the shore of a lake", ["dumping oil in a ditch", "draining every wetland", "using more water than needed"], "Shoreline plants filter runoff and hold soil.", "🌿"),
  q("Which of these is a way to conserve water at home?", "taking shorter showers", ["leaving a tap running", "watering the street", "washing a car every day"], "Using less water protects a limited supply.", "🚿"),
  q("In 2011, spring flooding affected places along the Souris River, including Estevan. What caused it?", "heavy snowmelt and rain", ["a long drought", "an earthquake", "a volcano"], "Floods happen when more water arrives than a river can carry.", "🌊"),
  q("How do Indigenous peoples in Saskatchewan relate to water today?", "many communities care for and rely on lakes and rivers", ["they do not use water", "they live far from water", "water does not matter to them"], "Water is part of everyday life and decisions in many communities.", "🛶"),
  hq("A watershed has lost half of its wetlands. What change would you predict in spring?", "faster runoff and higher peak river levels", ["slower runoff", "no snowmelt", "a cooler summer"], "Wetlands store water, so losing them leads to quicker, bigger flows.", "📈"),
  hq("Why does a drought on the prairies affect people far from farms?", "less crop and less water affects food prices and supplies", ["rain moves to cities", "drought stops the Sun", "it makes rivers longer"], "Water shortages spread through the economy.", "🛒"),
  hq("Climate change is warming the Earth. How could this change Saskatchewan's water?", "less snow pack, earlier melt and more dry spells", ["permanent floods only", "more glaciers on the prairies", "no change at all"], "Warmer winters change when and how much water arrives.", "🌡️"),
  hq("Two towns share the same river. One adds a dam. What could the other town notice?", "a change in how much and when water arrives", ["nothing could change", "the river runs backwards", "the river turns salty"], "A dam changes the river's flow downstream.", "🏞️"),
  hq("A map shows arrows for flowing water. Which arrow direction shows the right flow?", "from high land toward low land", ["from low land to high land", "toward the nearest town", "toward the north only"], "Gravity pulls runoff downhill.", "🗺️"),
];

// ---------- Landscape shaped by wind, water and ice ----------

const SHAPER_SORT: SortSet = {
  prompt: "Which one shaped it: wind, flowing water or glacier ice? Tap a feature, then tap its basket.",
  hint: "Wind builds dunes. Flowing water cuts valleys and builds deltas. Glaciers leave moraines, eskers and large boulders called erratics.",
  bins: [
    { id: "wind", label: "wind", emoji: "💨" },
    { id: "water", label: "flowing water", emoji: "🌊" },
    { id: "ice", label: "glacier ice", emoji: "🧊" },
  ],
  items: [
    { label: "sand dunes", emoji: "🏜️", bin: "wind" },
    { label: "dust blown into a drift", emoji: "🌬️", bin: "wind" },
    { label: "a river valley", emoji: "🏞️", bin: "water" },
    { label: "a delta", emoji: "🌊", bin: "water" },
    { label: "a floodplain", emoji: "🌾", bin: "water" },
    { label: "an erratic boulder", emoji: "🪨", bin: "ice" },
    { label: "an esker", emoji: "🧊", bin: "ice" },
    { label: "a moraine", emoji: "⛰️", bin: "ice" },
  ],
};

const GLACIER_ORDER = order("Put the life of a glacier on the prairies in order.", "Snow piles up and turns to ice, the ice flows and carries rock, and when it melts it leaves the rock behind.", [
  ["Snow builds up faster than it melts", "❄️"],
  ["The snow packs into thick ice", "🧊"],
  ["The ice slowly flows, scraping the land", "⛰️"],
  ["The climate warms and the ice melts", "🌡️"],
  ["Rock and gravel are left behind as till", "🪨"],
]);

const LANDSCAPE: Item[] = [
  q("What is erosion?", "wearing away of rock and soil by wind, water or ice", ["building new mountains", "making clouds", "melting snow only"], "Erosion moves material from one place to another.", "🌬️"),
  q("What is deposition?", "dropping of eroded material in a new place", ["wearing away rock", "freezing of a lake", "a type of cloud"], "Eroded material is deposited when wind, water or ice slows or melts.", "⛰️"),
  q("What do we call the process that breaks rock into smaller pieces?", "weathering", ["deposition", "evaporation", "melting"], "Freezing, thawing, wind and water all weather rock.", "🪨"),
  q("Which of these is made by moving water?", "a river valley", ["a sand dune", "an erratic", "an esker"], "A river carves its valley over a long time.", "🏞️"),
  q("Where is the largest area of sand dunes in Saskatchewan?", "near the south shore of Lake Athabasca", ["on the Qu'Appelle Valley floor", "beside Regina", "at the Quill Lakes"], "The Athabasca Sand Dunes are among the most northerly dunes in the world.", "🏜️"),
  q("How do wind-blown sand dunes form?", "wind carries sand and drops it when it slows", ["glaciers carve them", "rivers pile them up", "earthquakes lift them"], "Wind sorts and moves loose sand.", "🏜️"),
  q("Which kind of landscape is made when a glacier drops the rock and gravel it carried?", "a moraine", ["a delta", "a sand dune", "a canyon"], "A moraine is a ridge or pile of material left by a glacier.", "⛰️"),
  q("What is an erratic?", "a large boulder carried by a glacier and left far from its source", ["a type of cloud", "a fast stream", "a wind-blown seed"], "Erratics sit on the prairie where no rock like them naturally grows.", "🪨"),
  q("What is till?", "a mix of clay, sand, gravel and boulders left by a glacier", ["rain on the ground", "layers of salt", "ice on a river"], "Till makes up much of the soil on the prairies.", "🌱"),
  q("An esker is a long winding ridge. What formed it?", "a stream running under or inside a glacier", ["wind in the desert", "a volcano", "an earthquake"], "Streams in glaciers drop sand and gravel in their tunnels.", "🧊"),
  q("What is a kettle lake?", "a lake in a hollow left by a melted block of ice", ["a lake made by wind", "a lake made by a volcano", "a lake in a crater"], "Big blocks of ice buried in till melted and left hollows.", "🫖"),
  q("How did glaciers help create the many shallow lakes and potholes on the prairies?", "they scraped and left uneven land", ["they covered the land in sand", "they carved mountains", "they warmed the ground"], "The uneven land collects water.", "🦆"),
  q("The Qu'Appelle Valley was carved by…", "huge flows of meltwater from glaciers", ["a nearby volcano", "an earthquake", "wind alone"], "Glacial meltwater cut a wide valley across southern Saskatchewan.", "🏞️"),
  q("About how long ago did the last glaciers melt from Saskatchewan?", "more than ten thousand years ago", ["last century", "only a few years ago", "last week"], "The glaciers have been gone for thousands of years.", "⏳"),
  q("What was Glacial Lake Agassiz?", "a huge lake formed by melting glacial ice", ["a mountain range", "a type of rock", "a desert"], "It once covered land in parts of Manitoba and Saskatchewan.", "🌊"),
  q("A flat plain of rich soil beside a river that floods is called a…", "floodplain", ["moraine", "dune", "glacier"], "Floods leave soil behind in layers.", "🌾"),
  q("What is the main way a river builds a delta?", "it drops sand and silt where it slows entering a lake", ["it freezes", "it flows uphill", "it burns off water"], "Slowing water cannot carry as much material.", "🌊"),
  q("The Great Sand Hills in Saskatchewan show…", "wind moving sand into hills", ["rivers making canyons", "glaciers moving rock", "volcanoes erupting"], "Sand dunes can be partly held in place by grass.", "🏜️"),
  q("Why do plants and grasses help protect soil?", "roots hold it in place against wind and water", ["they make the wind stronger", "they dry the soil to dust", "they melt ice"], "Bare soil blows or washes away more easily.", "🌱"),
  q("What happened to many fields during the Dirty Thirties?", "the dry topsoil blew away", ["rivers rose over them", "glaciers covered them", "the soil turned to rock"], "Wind erosion carried away soil that was not held by plants.", "🌪️"),
  q("How do farmers reduce wind erosion?", "leaving crop stubble and planting shelterbelts", ["ploughing bare soil in dry weather", "burning fields", "removing all plants"], "Stubble and trees slow the wind and protect soil.", "🌳"),
  q("Water freezes in a crack in a rock. What happens next?", "the ice expands and widens the crack", ["the rock gets stronger", "the crack seals", "the water disappears"], "Frost wedging is a kind of weathering.", "❄️"),
  q("Which of these shows a fast change to a landscape?", "a flash flood cutting a gully", ["a glacier forming", "a mountain wearing down", "a river valley widening over ages"], "Floods can change land in hours.", "🌊"),
  q("Which of these shows a slow change to a landscape?", "a river valley deepening over thousands of years", ["a gully after a flood", "a dust storm", "a landslide"], "Valley-cutting takes a very long time.", "⏳"),
  q("Which feature is made when a river flows around a curve and slowly moves sideways?", "a meander", ["a moraine", "a dune", "an esker"], "Rivers erode the outside of bends and deposit on the inside.", "〰️"),
  q("Which are both landscape changes made by ice?", "grooves in rock and moraines", ["dunes and deltas", "deltas and canyons", "dunes and gullies"], "Glaciers scrape and drop material.", "🧊"),
  hq("A farmer finds a large granite boulder in a field with no granite nearby. What is the best explanation?", "a glacier carried it there", ["a volcano shot it out", "a river made it", "the wind rolled it over the mountains"], "Erratics are carried long distances by ice.", "🪨"),
  hq("Why are glacial deposits good for prairie farming?", "they left deep, mixed soil", ["they left bare rock", "they left only ice", "they left salt flats only"], "Till and lake clay form fertile soils.", "🌾"),
  hq("A dune in the Athabasca region slowly moves with the wind. What does this show?", "landscapes are still changing today", ["landscapes never change", "only ice changes land", "water cannot move sand"], "Wind, water and ice keep shaping land.", "🏜️"),
  hq("Which evidence best tells scientists that a glacier once covered an area?", "scratches in bedrock and erratics", ["a modern town", "a thick forest", "a wide beach"], "Glaciers leave scratches and scattered boulders.", "🔍"),
];

// ---------- Aquatic ecosystems ----------

const FACTOR_SORT: SortSet = {
  prompt: "Is it a natural factor or a human practice? Tap a factor, then tap its basket.",
  hint: "Sunlight, water temperature and a river's nutrients are natural. Fertilizer runoff, overfishing and dams are human practices.",
  bins: [
    { id: "nat", label: "natural factor", emoji: "🌿" },
    { id: "hum", label: "human practice", emoji: "🎣" },
  ],
  items: [
    { label: "amount of sunlight", emoji: "☀️", bin: "nat" },
    { label: "water temperature", emoji: "🌡️", bin: "nat" },
    { label: "dissolved oxygen", emoji: "🫧", bin: "nat" },
    { label: "nutrients from rivers", emoji: "🏞️", bin: "nat" },
    { label: "overfishing", emoji: "🎣", bin: "hum" },
    { label: "fertilizer runoff", emoji: "🧪", bin: "hum" },
    { label: "building a dam", emoji: "🏗️", bin: "hum" },
    { label: "releasing invasive species", emoji: "🐟", bin: "hum" },
  ],
};

const CHAIN_ORDER = order("Put this lake food chain in order, starting with the producer.", "Algae make food using sunlight. Small animals eat algae, fish eat the small animals, and larger fish and birds eat the fish.", [
  ["Algae in the sunlit water", "🌿"],
  ["Tiny animals that eat algae", "🦐"],
  ["Small fish", "🐟"],
  ["Walleye", "🎣"],
  ["An osprey", "🦅"],
]);

const AQUATIC: Item[] = [
  q("What does productivity mean in a lake or ocean?", "how much living matter the ecosystem makes", ["how deep the water is", "how many boats use it", "how cold the water feels"], "A highly productive ecosystem supports lots of plants and animals.", "🌿"),
  q("Which living things are the main producers in a lake?", "algae and water plants", ["walleye", "ospreys", "frogs"], "They use sunlight to make food.", "🌿"),
  q("Why do aquatic plants and algae grow mostly near the surface?", "that is where sunlight reaches", ["deep water is warm", "fish push them up", "the surface has no air"], "Light is needed for photosynthesis.", "☀️"),
  q("What are nutrients, such as phosphorus and nitrogen, to algae?", "materials needed to grow", ["predators", "pollution only", "salt"], "More nutrients can mean more algae growth.", "🧪"),
  q("What can too many nutrients in a lake cause?", "a large algae bloom", ["clearer water", "more ice", "more sunlight"], "Fertilizer and sewage can wash nutrients into lakes.", "🟢"),
  q("What happens to oxygen in the water when a big algae bloom dies and decays?", "the oxygen drops", ["the oxygen increases a lot", "nothing changes", "the water turns to ice"], "Decay uses oxygen that fish need.", "🫧"),
  q("What is winterkill?", "fish dying under ice when oxygen runs low", ["fish migrating south", "a fishing contest", "a type of snowstorm"], "Shallow prairie lakes can lose oxygen under thick ice and snow.", "🥶"),
  q("Which kind of lake is more likely to have winterkill?", "a shallow lake", ["a very deep lake", "a lake in the mountains", "a lake with a moving current"], "A shallow lake has less water holding oxygen.", "🧊"),
  q("Why can fish in warm water be stressed?", "warm water holds less dissolved oxygen", ["warm water has more ice", "warm water has no fish food", "warm water is too clear"], "Oxygen dissolves better in cooler water.", "🌡️"),
  q("Which fish is a cold-water species often found in deep northern lakes?", "lake trout", ["goldfish", "clownfish", "tuna"], "Lake trout need cold, well-oxygenated water.", "🐟"),
  q("Which of these fish is common in many Saskatchewan lakes?", "walleye", ["clownfish", "great white shark", "seahorse"], "Walleye and northern pike are popular for angling in the province.", "🎣"),
  q("What is the main difference between fresh water and ocean water?", "ocean water has much more dissolved salt", ["fresh water is warmer", "ocean water has no fish", "fresh water is salty"], "Fresh water has very little salt.", "🧂"),
  q("Why can fresh-water fish not usually live in the ocean?", "their bodies are adapted to low salt", ["the ocean has no water", "oceans are too clear", "they are too big"], "Different species are suited to different salt levels.", "🐠"),
  q("What is a food web?", "many food chains linked together", ["a spider's web", "a fishing net", "a list of lakes"], "Most animals eat more than one kind of food.", "🕸️"),
  q("What is overfishing?", "catching fish faster than the population can recover", ["fishing in cold weather", "fishing with a rod", "counting fish"], "Overfishing can shrink a fish population.", "🎣"),
  q("What happened to cod on the Grand Banks off Atlantic Canada?", "overfishing caused a collapse", ["they moved to Saskatchewan", "they grew in number", "they turned to algae"], "A fishing ban began in the 1990s.", "🐟"),
  q("How do fish limits help a lake?", "they keep enough fish to breed and replace themselves", ["they stop the lake from freezing", "they make fish bigger every year", "they cool the water"], "Rules on size and number caught protect fish populations.", "📏"),
  q("What is an invasive species?", "a plant or animal from elsewhere that harms the ecosystem it enters", ["a native animal", "a rare bird", "a fossil"], "Invasive species can outcompete local species.", "⚠️"),
  q("Why should boaters clean and drain their boats before moving to another lake?", "to avoid carrying invasive species", ["to make the boat faster", "to save fuel", "to warm the lake"], "Plants and tiny animals can hitch a ride.", "🚤"),
  q("What is a dam's effect on fish that swim upstream to spawn?", "it can block their path", ["it helps them swim faster", "it gives them a ladder every time", "it has no effect"], "Dams can block fish passage unless there are special passages.", "🏗️"),
  q("The Quill Lakes in Saskatchewan are important for…", "migrating birds", ["whales", "coral reefs", "polar bears"], "They are a stop on bird migration routes and are saline.", "🦆"),
  q("Why do many birds stop at prairie potholes in spring?", "they find food and shelter in wetlands", ["there is no water", "the wetlands are warm all winter", "they need salt"], "Wetlands are rich in insects and plants.", "🦆"),
  q("What is an estuary?", "where a river meets the sea and fresh and salt water mix", ["a high mountain", "a dry desert", "the middle of a lake"], "Estuaries are very productive places.", "🌊"),
  q("What kind of ecosystem in the ocean has very high productivity?", "a coral reef", ["a desert", "a glacier", "a gravel pit"], "Reefs shelter a huge number of species in warm shallow water.", "🪸"),
  q("In the ocean, what is plankton?", "tiny floating plants and animals", ["a kind of whale", "a seabed rock", "a fishing net"], "Plankton are the base of many ocean food webs.", "🔬"),
  q("What is upwelling?", "cold nutrient-rich water rising toward the surface", ["warm water sinking", "a type of wave", "ice melting"], "Upwelling feeds plankton and the fish that eat them.", "⬆️"),
  hq("A lake has heavy algae growth every summer. Which action could help?", "reduce fertilizer running into the lake", ["add more fertilizer", "remove shoreline plants", "drain the wetlands"], "Cutting nutrients slows algae growth.", "🧪"),
  hq("Why can adding shoreline plants help a lake's health?", "they filter runoff and give fish and birds shelter", ["they heat the water", "they stop the wind", "they make algae"], "Shore plants act as natural filters.", "🌿"),
  hq("If walleye are overfished, what could happen to the smaller fish they eat?", "their numbers could rise at first", ["they would vanish at once", "they would turn into walleye", "nothing could change"], "Removing a predator affects the whole food web.", "🕸️"),
  hq("Lake Athabasca is deep and cold. Which statement is most likely true?", "it supports cold-water fish such as lake trout", ["it supports only tropical fish", "it has no fish", "it is warmer than a prairie pond"], "Cold, deep northern lakes favour cold-water species.", "🐟"),
  hq("A prairie lake dries out in a drought. What happens to the species that live in it?", "many lose their habitat or die", ["they all move easily", "they grow bigger", "they turn into land animals"], "Habitat loss is a big threat to aquatic species.", "🏜️"),
];

export const units: Unit[] = [
  {
    id: "sk-water-changes",
    title: "Changes to Our Water",
    emoji: "🌊",
    blurb: "Watersheds, droughts, floods and what people change",
    standards: { "ca-sk": sk("WS8.1", "natural and human-induced changes to the characteristics and distribution of water: watersheds, the water cycle, drought and flooding") },
    parentNote: "Watersheds, the water cycle, groundwater and wetlands, droughts and floods in Saskatchewan, and the ways natural events and human actions (dams, drainage, irrigation, pavement) change where water goes.",
    generate: bankUnit(WATER, { sorts: [CHANGE_SORT], orders: [WATERSHED_ORDER] }),
  },
  {
    id: "sk-landscape-8",
    title: "Wind, Water & Ice Shape the Land",
    emoji: "🏜️",
    blurb: "Glaciers, rivers, dunes and the prairie landscape",
    standards: { "ca-sk": sk("WS8.2", "how wind, water and ice have shaped and continue to shape the Canadian landscape") },
    parentNote: "Weathering, erosion and deposition; features made by glaciers (moraines, eskers, erratics, kettle lakes), rivers (valleys, floodplains, deltas) and wind (dunes), with Saskatchewan examples such as the Qu'Appelle Valley and the Athabasca sand dunes.",
    generate: bankUnit(LANDSCAPE, { sorts: [SHAPER_SORT], orders: [GLACIER_ORDER] }),
  },
  {
    id: "sk-aquatic-8",
    title: "Life in Lakes & Oceans",
    emoji: "🐟",
    blurb: "What helps and harms life in fresh and salt water",
    standards: { "ca-sk": sk("WS8.3", "natural factors and human practices that affect productivity and species distribution in marine and fresh water environments") },
    parentNote: "Producers, food webs, nutrients, oxygen, light and temperature in lakes and oceans, how fishing, fertilizer runoff, dams and invasive species change aquatic life, with Saskatchewan lake examples.",
    generate: bankUnit(AQUATIC, { sorts: [FACTOR_SORT], orders: [CHAIN_ORDER] }),
  },
];
