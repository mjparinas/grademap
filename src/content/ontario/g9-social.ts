import { sortQuestion, type SortSet } from "../bank";
import { pick, randInt, shuffle, textChoice } from "../random";
import type { GenerateOptions, OrderQuestion, Question, Unit } from "../types";
import { levelOf, on, spaced, typeIn, type Maker } from "./kit";
import { q, unitSet, type Item } from "./g9-science";

// Ontario Grade 9 Canadian and World Studies: Geography of Canada, CGC1W (2023 de-streamed course).
// BC's Grade 9 social studies is a history course (revolutions, industrialization, the First World War),
// so no BC units are shared. Every unit here is written for the Ontario expectations: geographic
// inquiry, physical geography, resources and industries, population, and liveable communities.
//
// Not written yet, because they need First Nations, Métis and Inuit partners to shape them:
// C1.8 (land tenure, Indigenous land rights and economic reconciliation), B2.5 (how communities value
// and protect the natural environment) and E2.5 (culturally informed community design).

const kmFmt = (n: number): string => spaced(n);

// ---------- A: Geographic inquiry and skills ----------

const INQUIRY: Item[] = [
  q(1, "Which question has a single, checkable answer (a factual question)?", "How many territories does Canada have?", ["Should Canada build more pipelines?", "What is the best way to reduce traffic?", "Is urban sprawl fair to farmers?"], "Factual questions can be answered by looking up evidence. Debatable questions ask for opinions backed by reasons."),
  q(1, "Which is a debatable question?", "Should new housing be allowed on farmland near cities?", ["What is the population of Ottawa?", "How many provinces does Canada have?", "Where is Lake Superior?"], "A debatable question has more than one reasonable answer, so you need evidence from several perspectives."),
  q(1, "What does a map legend show?", "what the symbols and colours mean", ["how far apart places are", "which way is north", "who made the map"], "A scale shows distance and a north arrow shows direction."),
  q(1, "What does a map scale do?", "relates distances on the map to real distances", ["shows what the colours mean", "names the mapmaker", "shows the temperature"], "A scale such as 1 cm = 25 km lets you measure real distances."),
  q(1, "Lines of latitude run…", "east–west and measure distance north or south of the equator", ["north–south and measure distance east or west", "diagonally across Canada", "only through the Arctic"], "Longitude lines run north–south."),
  q(1, "Which technology uses satellites to find an exact position on Earth?", "GPS", ["a thermometer", "a barometer", "a compass rose"], "GPS receivers work out their location from satellite signals."),
  q(1, "Which career uses maps and data to plan where roads, transit and parks should go?", "urban planner", ["baker", "lifeguard", "musician"], "Planners use geography and geospatial technology to make decisions."),
  q(2, "Which is a primary source of data?", "traffic counts you collect yourself at an intersection", ["a textbook chapter about traffic", "an encyclopedia article", "a documentary summarizing other people's research"], "Primary sources are first-hand evidence. Secondary sources describe or interpret it."),
  q(2, "Which is a secondary source?", "a magazine article that summarizes a study", ["a field survey you carry out", "a photograph you take on a field trip", "an interview you record"], "A secondary source is made by someone who did not collect the original evidence."),
  q(2, "A student studies how the population of the Prairies has changed over 30 years. Which geographic thinking concept is the focus?", "patterns and trends", ["spatial significance", "geographic perspective", "interrelationships"], "Patterns and trends look at how things change over time and place."),
  q(2, "A student asks how a river and the farms and cities along it affect one another. Which concept is this?", "interrelationships", ["patterns and trends", "spatial significance", "geographic perspective"], "Interrelationships are the connections between natural and human features."),
  q(2, "A student compares how a farmer, a developer and a city planner see the same issue. Which concept is this?", "geographic perspective", ["spatial significance", "patterns and trends", "interrelationships"], "Perspective is the point of view of people with different roles and values."),
  q(2, "Spatial significance asks…", "why a place, feature or event matters, based on where it is and its importance", ["how a trend has changed", "who disagrees with whom", "how many people live there"], "Location and importance are what make a place spatially significant."),
  q(2, "A photo of a flood is posted online with no source or date. What is the best next step?", "Check where it came from and look for other reports before trusting it", ["Share it right away", "Assume it is true if it looks real", "Assume it is false if it has no caption"], "AI tools can make realistic images that never happened, so confirm the source."),
  q(2, "Which source is most reliable for Canada's population numbers?", "Statistics Canada census data", ["a post by an unknown account", "an advertisement", "a rumour in a chat"], "Check who made the data, how they collected it and whether they show their methods."),
  q(2, "What is a GIS (geographic information system) used for?", "layering and analysing data on digital maps", ["printing newspapers", "measuring sound", "growing crops"], "Planners use GIS to compare, for example, flood zones with where homes are."),
  q(2, "What does remote sensing mean?", "collecting information about Earth from a distance, such as from satellites", ["using only handwritten maps", "visiting every place in person", "listening to the radio"], "Satellite images show forests, ice, floods and cities."),
  q(2, "Why should you list your sources when you present a geography investigation?", "to give credit and let others check your evidence", ["to make the report longer", "to hide where the data came from", "because maps must have them"], "Documentation shows where information came from."),
  q(2, "A graph's vertical axis starts at 50 instead of 0, making a small change look huge. This is an example of…", "a misleading way of presenting data", ["a more accurate graph", "a primary source", "a map scale"], "Check the axes and labels before drawing conclusions."),
  q(3, "Why is it important to look for sources with multiple and diverse perspectives?", "A single viewpoint can leave out important people or evidence", ["Diverse sources always agree", "Perspectives never affect data", "It saves time"], "Different communities may see an issue, and its effects, differently."),
  q(3, "Which career in a skilled trade is likely to use GPS and digital maps on the job?", "heavy equipment operator", ["restaurant host", "lifeguard", "violinist"], "Machines for construction and mining are increasingly guided by GPS."),
  q(3, "Canada has six time zones. Why does the country need them?", "It is so wide that the Sun is overhead at different clock times in the east and west", ["Each province wanted its own time", "Because the Earth tilts", "Because Canada has six oceans"], "Earth rotates 15° of longitude each hour, so time zones follow longitude."),
];

function scaleQ(): Question {
  const perCm = pick([5, 10, 20, 25, 50, 100]);
  const cm = randInt(2, 9);
  if (randInt(0, 1) === 0) {
    return typeIn(`On a map, 1 cm represents ${perCm} km. Two cities are ${cm} cm apart. What is the real distance, in km?`, cm * perCm, `Multiply the map distance by the scale: ${cm} × ${perCm} = ${cm * perCm} km.`, undefined, { suffix: "km" });
  }
  return typeIn(`On a map, 1 cm represents ${perCm} km. Two towns are ${kmFmt(cm * perCm)} km apart. How far apart are they on the map, in cm?`, cm, `Divide the real distance by the scale: ${kmFmt(cm * perCm)} ÷ ${perCm} = ${cm} cm.`, undefined, { suffix: "cm" });
}

function timeZoneQ(): Question {
  const h = randInt(4, 8);
  const zones: [string, string, number][] = [["Halifax", "Atlantic", 1], ["Winnipeg", "Central", -1], ["Calgary", "Mountain", -2], ["Vancouver", "Pacific", -3]];
  const [city, zone, off] = pick(zones);
  const label = (x: number) => `${x}:00 p.m.`;
  const right = label(h + off);
  const wrong = [-3, -2, -1, 1, 2].map((o) => label(h + o)).filter((l) => l !== right);
  return textChoice(
    `It is ${h}:00 p.m. in Toronto (Eastern Time). What time is it in ${city} (${zone} Time)?`,
    right,
    shuffle(wrong).slice(0, 3),
    `${zone} Time is ${Math.abs(off)} hour${Math.abs(off) === 1 ? "" : "s"} ${off > 0 ? "ahead of" : "behind"} Eastern Time. ${off > 0 ? "Add" : "Subtract"} ${Math.abs(off)}.`,
  );
}

function inquiry(opts?: GenerateOptions): Question[] {
  return unitSet(INQUIRY, levelOf(opts), [scaleQ, levelOf(opts) === 1 ? scaleQ : timeZoneQ]);
}

// ---------- B: Landform regions ----------

const REGIONS: Item[] = [
  q(1, "Which landform region has some of the oldest exposed rock in the world?", "Canadian Shield", ["Western Cordillera", "Interior Plains", "Appalachian Region"], "The Shield is made of ancient Precambrian rock, billions of years old."),
  q(1, "Which region is rich in minerals such as nickel, gold and copper?", "Canadian Shield", ["Interior Plains", "Great Lakes–St. Lawrence Lowlands", "Hudson Bay Lowlands"], "Sudbury, Ontario grew around nickel and copper mines on the Shield."),
  q(1, "Which region is mostly flat, with fertile soil that is good for growing wheat?", "Interior Plains", ["Western Cordillera", "Canadian Shield", "Arctic Lands"], "The Prairies are part of this region."),
  q(1, "Which region has Canada's youngest and highest mountains?", "Western Cordillera", ["Appalachian Region", "Canadian Shield", "Interior Plains"], "The Rockies and Coast Mountains are still being shaped by plate movement."),
  q(1, "Which region has worn-down, rounded mountains in Atlantic Canada and southern Quebec?", "Appalachian Region", ["Western Cordillera", "Interior Plains", "Arctic Lands"], "These mountains are very old and have been eroded for hundreds of millions of years."),
  q(1, "Which region is small but has the most people in Canada because of its fertile soil and mild climate?", "Great Lakes–St. Lawrence Lowlands", ["Arctic Lands", "Canadian Shield", "Hudson Bay Lowlands"], "Southern Ontario and the St. Lawrence valley are in this region."),
  q(1, "Which region includes permafrost, tundra and islands in the Arctic Ocean?", "Arctic Lands", ["Great Lakes–St. Lawrence Lowlands", "Interior Plains", "Appalachian Region"], "Cold temperatures keep the ground frozen for most of the year."),
  q(1, "Which Great Lake has the largest surface area?", "Lake Superior", ["Lake Erie", "Lake Ontario", "Lake Huron"], "Superior is the largest freshwater lake in the world by surface area."),
  q(2, "Why is the Canadian Shield poor for farming?", "Glaciers scraped away most of the soil, leaving thin soil and bare rock", ["It is too flat", "It has too much volcanic ash", "It is always flooded"], "Thin, rocky soil cannot grow many crops."),
  q(2, "Why are the Appalachians lower than the Rocky Mountains?", "They are much older and have been worn down by erosion for longer", ["They are much younger", "They were never uplifted", "They are underwater"], "Rock wears away over time."),
  q(2, "Mount Logan, Canada's highest peak, is in which region?", "Western Cordillera", ["Canadian Shield", "Interior Plains", "Appalachian Region"], "It is in the St. Elias Mountains of Yukon."),
  q(2, "The Niagara Escarpment, a long cliff of layered rock that Niagara Falls spills over, is in which region?", "Great Lakes–St. Lawrence Lowlands", ["Western Cordillera", "Arctic Lands", "Canadian Shield"], "The escarpment is a ridge of layered rock that has been eroded."),
  q(2, "Why is the Interior Plains region well suited to farming?", "It is flat with deep, fertile soil", ["It is covered in ice", "It has the oldest rock", "It has the highest mountains"], "Flat land and good soil make large-scale farming possible."),
  q(2, "The Hudson Bay Lowlands are mostly…", "flat, wet land with bogs and wetlands", ["tall mountains", "dry desert", "rolling farmland"], "The land is flat and drains poorly."),
  q(2, "Why are earthquakes and volcanoes more common in the Western Cordillera than in the Canadian Shield?", "The Cordillera is near the boundaries of tectonic plates", ["The Shield is much newer", "The Cordillera has no rock", "There are no plates under Canada"], "The Shield is in the stable middle of a plate."),
  q(2, "The beaver, loon and maple leaf appear on Canadian coins and flags. They connect Canadian identity to…", "wildlife and forests of the natural environment", ["the Arctic only", "imported goods", "city skylines"], "National symbols often come from a country's landscape and living things."),
  q(3, "Which process created the thousands of lakes on the Canadian Shield?", "Glaciers scraped basins in the rock and left water behind when they melted", ["Volcanoes filled with water", "Winds blew sand into holes", "People dug the lakes"], "Ice sheets gouged the surface during the last ice age."),
  q(3, "Why were many of Canada's largest cities built in the Great Lakes–St. Lawrence Lowlands?", "Fertile land, a mild climate and water routes for trade", ["Tall mountains and permafrost", "Thin soil and few rivers", "No access to water"], "Physical geography influenced where people settled and traded."),
  q(3, "Which pair describes the two regions with the oldest rock and the youngest mountains?", "Canadian Shield and Western Cordillera", ["Interior Plains and Appalachians", "Arctic Lands and Lowlands", "Appalachians and Shield"], "Precambrian rock is oldest. The Cordillera is still rising."),
];

const REGION_SORT: SortSet = {
  prompt: "Which region fits each description?",
  hint: "Canadian Shield: ancient rock, minerals, lakes. Interior Plains: flat farmland and oil and gas. Western Cordillera: young, tall mountains.",
  bins: [
    { id: "shield", label: "Canadian Shield", emoji: "🪨" },
    { id: "plains", label: "Interior Plains", emoji: "🌾" },
    { id: "cordillera", label: "Western Cordillera", emoji: "🏔️" },
  ],
  items: [
    { label: "Ancient Precambrian rock", emoji: "🪨", bin: "shield" },
    { label: "Thousands of lakes and thin soil", emoji: "🏞️", bin: "shield" },
    { label: "Nickel and gold mines", emoji: "⛏️", bin: "shield" },
    { label: "Flat grassland used for wheat", emoji: "🌾", bin: "plains" },
    { label: "Deep, fertile soil", emoji: "🌱", bin: "plains" },
    { label: "Large oil and gas deposits", emoji: "🛢️", bin: "plains" },
    { label: "Youngest, highest mountains", emoji: "🏔️", bin: "cordillera" },
    { label: "Near the edge of tectonic plates", emoji: "🌋", bin: "cordillera" },
    { label: "Pacific coast and glaciers", emoji: "🌊", bin: "cordillera" },
  ],
};

function regions(opts?: GenerateOptions): Question[] {
  return unitSet(REGIONS, levelOf(opts), [() => sortQuestion(REGION_SORT, 2)]);
}

// ---------- B: Physical processes ----------

const PROCESSES: Item[] = [
  q(1, "What is weathering?", "the breaking down of rock into smaller pieces", ["the moving of sediment by water", "the building of mountains", "the melting of ice"], "Erosion moves the pieces. Deposition drops them in a new place."),
  q(1, "What is erosion?", "the wearing away and moving of rock and soil by water, ice, wind or gravity", ["the freezing of water", "the formation of clouds", "the growth of plants"], "Rivers, glaciers and waves all erode land."),
  q(1, "What is deposition?", "the dropping of sediment in a new place", ["the melting of snow", "the breaking of rock", "the heating of air"], "Sediment settles when water, ice or wind slows down."),
  q(1, "During the last ice age, huge ice sheets covered much of Canada. What did they do to the land?", "scraped and carved it, and left deposits behind", ["built volcanoes", "dried up all rivers", "made the land flatter by melting only"], "Glaciers carved valleys and basins and left moraines and other deposits."),
  q(1, "Which feature was formed by glacial deposits near Toronto?", "the Oak Ridges Moraine", ["the Rocky Mountains", "the Arctic tundra", "Mount Logan"], "A moraine is a ridge of rock and sand left at the edge of a glacier."),
  q(1, "What is climate?", "the average weather of a place over many years", ["the weather today", "a storm", "the temperature at noon"], "Climate is the long-term pattern of weather."),
  q(2, "Why do many earthquakes occur off the coast of British Columbia?", "Ocean plates slide beneath the North American plate", ["Glaciers are melting", "The Shield is rising", "The wind is eroding the coast"], "Plate boundaries are where Earth's crust moves, creating earthquakes."),
  q(2, "Vancouver's winter is milder than Winnipeg's mainly because…", "the Pacific Ocean moderates temperatures", ["Vancouver is much closer to the equator", "Winnipeg is on a mountain", "Vancouver has no wind"], "Water warms and cools slowly, so coastal climates are milder than inland ones."),
  q(2, "Mountains cause a 'rain shadow'. What does this mean?", "The side of the mountains away from the wind is drier", ["Rain falls the same on both sides", "The windy side gets no rain", "Rain only falls at night"], "Air loses moisture as it rises over mountains, so the far side gets less rain."),
  q(2, "A chinook is…", "a warm, dry wind that blows down the eastern side of the Rockies", ["a type of glacier", "a cold ocean current", "a kind of tornado"], "Chinooks can raise temperatures quickly in Alberta in winter."),
  q(2, "Snowbelts near Georgian Bay and Lake Huron get heavy snow because…", "cold air picks up moisture as it crosses the warmer lake water", ["the lakes are frozen solid", "the Rockies force air upward", "there is no wind"], "Lake-effect snow falls downwind of large lakes in late fall and early winter."),
  q(2, "Why do rivers in the Prairies often flood in spring?", "Snowmelt and rain run over flat land that is still frozen", ["The Prairies have no rivers", "Glaciers move quickly", "Earthquakes shake the land"], "Frozen ground cannot absorb meltwater. Flat land spreads the water out."),
  q(2, "The Red River in Manitoba flows north. Why does that increase flood risk?", "The southern part thaws first, while ice can still block the river downstream", ["The river flows uphill", "The river is a lake", "The river has no banks"], "Water from the thawed south piles up behind ice in the north."),
  q(2, "Where in Canada are tornadoes most common?", "southern Ontario and the Prairies in summer", ["the high Arctic in winter", "the Pacific coast in winter", "the top of the Rocky Mountains in spring"], "Warm, humid air meeting cold air in summer creates the right conditions."),
  q(2, "The jet stream is…", "a fast current of air high in the atmosphere that steers weather systems", ["a river in Ontario", "an ocean current", "a type of cloud"], "Its path decides which regions get storms or dry spells."),
  q(2, "El Niño is a warming of surface water in the Pacific Ocean. It often means a milder winter for…", "much of western and central Canada", ["only the Arctic", "the Atlantic provinces only", "all of Canada, with no change"], "A global system like this changes weather patterns thousands of kilometres away."),
  q(2, "Where the cold Labrador Current meets the warm Gulf Stream off Newfoundland, there are often…", "fog and rich fishing grounds", ["tornadoes", "earthquakes", "deserts"], "Mixing waters bring nutrients up, so fish feed there."),
  q(3, "A trend shows more days above 30 °C each summer in many Canadian cities. This is evidence of…", "a warming climate", ["a single hot summer", "a colder climate", "the weather being unpredictable"], "Trends across many years show climate change, not weather."),
  q(3, "Which physical process most likely carved the Great Lakes basins?", "glaciers", ["earthquakes only", "wind", "the ocean"], "Ice sheets scoured deep basins, which filled with meltwater."),
  q(3, "Why is wildfire risk greatest in summer in the boreal forest?", "Warm, dry weather and lightning dry out the fuel and start fires", ["Rain is heaviest in summer", "Trees grow only in winter", "Snow covers the forest"], "Dry fuel, heat, wind and lightning combine."),
];

function rangeQ(): Question {
  const jul = randInt(18, 26);
  const jan = randInt(5, 28);
  return typeIn(`A city's average temperature is ${jul} °C in July and −${jan} °C in January. What is the annual temperature range, in °C?`, jul + jan, `Range = highest − lowest = ${jul} − (−${jan}) = ${jul + jan} °C.`, undefined, { suffix: "°C" });
}

function elevationQ(): Question {
  const valley = randInt(15, 25);
  const km = 2;
  return typeIn(`Air cools about 6.5 °C for every 1 000 m of elevation. A valley is ${valley} °C. About what is the temperature on a peak ${spaced(km * 1000)} m higher, in °C?`, valley - 6.5 * km, `Drop = ${km} × 6.5 = ${6.5 * km} °C, so ${valley} − ${6.5 * km} = ${valley - 6.5 * km} °C.`, undefined, { suffix: "°C" });
}

function processes(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return unitSet(PROCESSES, level, level === 1 ? [rangeQ] : [rangeQ, elevationQ]);
}

// ---------- B: Nature and people ----------

const NATURE: Item[] = [
  q(1, "Why do many towns on the Canadian Shield, like Sudbury, depend on mining?", "The rock holds valuable minerals", ["The soil is deep and fertile", "There are no lakes", "The land is flat"], "Physical features and resources shape how communities earn a living."),
  q(1, "Why is farming a major activity on the Prairies?", "The land is flat and the soil is fertile", ["The land is covered in ice", "There are tall mountains", "There is permafrost"], "Landscape and soil support communities' work."),
  q(1, "Which natural hazard is most common along the Pacific coast of Canada?", "earthquakes", ["tornadoes", "permafrost thaw", "lake-effect snow"], "The coast lies near tectonic plate boundaries."),
  q(1, "A hurricane's remnants are most likely to affect which part of Canada?", "Atlantic Canada", ["the Prairies", "the Arctic islands", "Yukon"], "Hurricanes form over the warm Atlantic and often weaken as they move north."),
  q(2, "Paving over land with roads and parking lots can raise flood risk because…", "rain cannot soak in, so more water runs off quickly", ["pavement absorbs water", "pavement makes it rain more", "pavement removes water from the air"], "Natural soil and plants absorb rainwater. Hard surfaces do not."),
  q(2, "Draining wetlands removes…", "natural flood storage and water filtering", ["roads", "pollution", "all hazards"], "Wetlands soak up floodwater and clean water slowly."),
  q(2, "Clearing trees from steep slopes increases the risk of…", "landslides and erosion", ["tornadoes", "earthquakes", "deeper snow"], "Roots help hold soil in place."),
  q(2, "How can building a dam change a river?", "It changes the flow, the sediment carried downstream and the habitat for fish", ["It stops the river from ever flowing", "It makes the river saltier", "It has no effect"], "People change natural systems when they modify them."),
  q(2, "In Ontario, conservation authorities help reduce flood damage by…", "mapping floodplains and regulating building in them", ["building shopping malls", "stopping the rain", "removing rivers"], "Keeping homes out of floodplains lowers risk."),
  q(2, "Which is an adaptation to wildfire risk for a community?", "clearing brush near homes and preparing evacuation plans", ["planting more dry grass beside houses", "ignoring the weather forecast", "building in the forest without any plan"], "Programs such as FireSmart help homeowners and towns reduce their risk."),
  q(2, "What is an urban heat island?", "a city that is warmer than nearby rural areas because of pavement and buildings", ["an island in a lake", "a heat wave on a farm", "an ocean current"], "Dark surfaces absorb heat, and there are fewer plants to cool the air."),
  q(2, "Which strategy helps a city adapt to hotter summers?", "planting trees and opening cooling centres", ["removing all shade", "paving more roads", "turning off public pools"], "Shade and cool spaces help protect people."),
  q(2, "Which is a mitigation strategy that lowers greenhouse gas emissions in a city?", "expanding public transit and bike lanes", ["building a sea wall", "moving homes away from the coast", "widening floodplains"], "Mitigation reduces the causes of climate change. Adaptation reduces its harm."),
  q(2, "Coastal communities in Atlantic Canada face a higher risk of flooding from storms as sea levels rise. What is a local adaptation?", "restoring dunes and marshes that absorb waves", ["building homes right at the water's edge", "removing all protective barriers", "ignoring flood maps"], "Natural barriers soften storm surges."),
  q(2, "Melting sea ice in the Arctic may open shipping routes. What is one possible consequence?", "more ship traffic that could bring both economic opportunities and environmental risks", ["no change for communities", "less need for any planning", "the Arctic becomes a desert"], "Changes in physical processes have environmental, economic, social and political consequences."),
  q(3, "Thawing permafrost matters to northern communities because it…", "can shift the ground under buildings, roads and pipelines", ["freezes the ground harder", "makes land more fertile everywhere", "raises mountains"], "Permafrost is frozen ground that supports northern infrastructure."),
  q(3, "A town builds a new subdivision on a floodplain. Which statement shows good geographic thinking?", "It raises the risk to people and property, and the town should weigh that risk against the benefits", ["Floodplains never flood", "Rivers do not affect land use", "Risk is the same everywhere"], "Weigh the physical risk, the economic benefit and the long-term cost."),
  q(3, "A disaster is worse for a community when…", "many people live in a hazard zone and have few resources to prepare", ["no one lives there", "there is a strong warning system", "buildings are made to resist the hazard"], "Risk depends on the hazard, who is exposed and how prepared they are."),
];

function percentOfQ(): Question {
  const homes = pick([100, 200, 400, 500, 800]);
  const pct = pick([10, 20, 25, 30, 40, 50]);
  return typeIn(`A town has ${homes} homes. ${pct}% of them are in a flood zone. How many homes are in the flood zone?`, (homes * pct) / 100, `${pct}% of ${homes} = ${homes} × ${pct / 100} = ${(homes * pct) / 100}.`);
}

function percentIncreaseQ(): Question {
  const from = pick([1000, 2000, 4000, 5000]);
  const pct = pick([25, 50, 100]);
  const to = from + (from * pct) / 100;
  return typeIn(`A region burned ${spaced(from)} hectares in one wildfire season and ${spaced(to)} hectares in the next. By what percent did the area burned increase?`, pct, `Increase = ${spaced(to)} − ${spaced(from)} = ${spaced(to - from)}. ${spaced(to - from)} ÷ ${spaced(from)} × 100 = ${pct}%.`, undefined, { suffix: "%" });
}

function nature(opts?: GenerateOptions): Question[] {
  return unitSet(NATURE, levelOf(opts), [percentOfQ, percentIncreaseQ]);
}

// ---------- C: Resources ----------

const RESOURCES: Item[] = [
  q(1, "Which resource is renewable if it is managed well?", "forests", ["coal", "oil", "iron ore"], "Trees can regrow if harvesting is planned."),
  q(1, "Which resource is non-renewable?", "natural gas", ["wind", "sunlight", "fish stocks that are well managed"], "Natural gas takes millions of years to form."),
  q(1, "Which is a flow resource?", "wind", ["coal", "nickel", "forests"], "Flow resources are always moving and are not used up, such as wind, sunlight, flowing water and tides."),
  q(1, "Which resource is a flow resource used for electricity?", "flowing river water", ["uranium", "natural gas", "gold"], "Hydroelectric dams use the flow of water."),
  q(1, "Where are Canada's largest oil sands deposits?", "Alberta", ["Nova Scotia", "Prince Edward Island", "Nunavut"], "They lie under northern Alberta in the Interior Plains."),
  q(1, "Which province is the world's largest producer of potash (used in fertilizer)?", "Saskatchewan", ["Newfoundland and Labrador", "New Brunswick", "Yukon"], "Potash is mined from deep underground in the Prairies."),
  q(2, "Why are many of Canada's mineral mines on the Canadian Shield?", "The ancient rock holds metals such as nickel, copper, gold and iron", ["It has fertile soil", "It has the most people", "It has deep oceans"], "Physical geography determines where resources are found."),
  q(2, "Which type of mining removes ore close to the surface?", "open-pit mining", ["underground mining", "drilling", "tidal power"], "Shallow ore bodies can be dug from the surface. Deep ones need shafts and tunnels."),
  q(2, "A deep oil sands deposit that is too far underground to dig from the surface may be reached by…", "in situ (drilling) methods", ["open-pit mining", "wind power", "selective logging"], "In situ means 'in place': steam is used to make the oil flow to wells."),
  q(2, "Canada has many rivers with steep drops, in places like Quebec and British Columbia. How does this help the economy?", "It supports hydroelectric power", ["It produces coal", "It makes oil", "It stops all floods"], "Falling water spins turbines to make electricity."),
  q(2, "Why are wind farms often built on open plains, hills and shorelines?", "Winds are stronger and steadier there", ["The wind never blows inland", "They need to be near mines", "They must be underwater"], "A flow resource is only useful where it is strong and reliable."),
  q(2, "Ontario generates much of its electricity from nuclear power. Which fuel do nuclear plants use?", "uranium", ["coal", "wood", "natural gas"], "Canada also mines uranium, in northern Saskatchewan."),
  q(2, "Which is a way of harvesting forests that can protect habitat and soil?", "selective logging", ["clear-cutting a whole slope", "burning the forest", "never replanting"], "Selective logging removes some trees and leaves the rest."),
  q(2, "Which resource would be affected by the cod collapse of the early 1990s?", "fish", ["potash", "uranium", "wind"], "Overfishing caused cod stocks to collapse, and the fishery was closed in 1992."),
  q(2, "A large share of the world's fresh water is in Canada. Where is most of it found?", "in lakes, rivers, glaciers and groundwater", ["only in the oceans", "only in clouds", "only in swimming pools"], "Fresh water is spread unevenly across the country."),
  q(2, "Why does location matter for solar power?", "Some regions get more hours of strong sunlight than others", ["Solar power works only underground", "Sunlight is the same everywhere in Canada all year", "Panels run on wind"], "Southern Alberta and Saskatchewan get a lot of sunlight."),
  q(3, "Why is extracting resources in the North often more expensive?", "Remote locations, permafrost and harsh climate raise transport and building costs", ["There are no resources", "The land is too fertile", "It has too many roads"], "Accessibility affects whether a resource can be used."),
  q(3, "Small modular reactors are being developed. Why are they described as innovative clean-energy technology?", "They are smaller than traditional plants and can produce low-emission electricity", ["They burn coal", "They need no fuel at all", "They are powered by wind"], "Nuclear plants do not emit carbon dioxide while operating, but they raise waste and safety questions."),
  q(3, "Which pair best shows that the location of a resource affects how it is used?", "Hydroelectric dams on steep rivers and wind farms on open plains", ["Gold mines on the ocean floor and fish farms in the desert", "Solar farms underground and mines on glaciers", "Oil wells on rooftops"], "Each resource is used where its physical conditions allow."),
];

const RESOURCE_SORT: SortSet = {
  prompt: "Renewable, non-renewable or flow resource? Sort each.",
  hint: "Renewable resources can regrow or be replaced if managed well. Non-renewable ones take millions of years to form. Flow resources are always moving and are not used up.",
  bins: [
    { id: "renewable", label: "Renewable", emoji: "🌳" },
    { id: "nonrenewable", label: "Non-renewable", emoji: "⛏️" },
    { id: "flow", label: "Flow", emoji: "🌬️" },
  ],
  items: [
    { label: "Forests", emoji: "🌲", bin: "renewable" },
    { label: "Fish stocks", emoji: "🐟", bin: "renewable" },
    { label: "Farm soil", emoji: "🌾", bin: "renewable" },
    { label: "Coal", emoji: "⚫", bin: "nonrenewable" },
    { label: "Crude oil", emoji: "🛢️", bin: "nonrenewable" },
    { label: "Nickel ore", emoji: "⛏️", bin: "nonrenewable" },
    { label: "Wind", emoji: "🌬️", bin: "flow" },
    { label: "Sunlight", emoji: "☀️", bin: "flow" },
    { label: "Tides", emoji: "🌊", bin: "flow" },
  ],
};

function windQ(): Question {
  const turbines = pick([10, 20, 25, 40, 50]);
  const mw = pick([2, 3, 4]);
  return typeIn(`A wind farm has ${turbines} turbines. Each can produce ${mw} megawatts (MW) at most. What is the farm's maximum output, in MW?`, turbines * mw, `${turbines} × ${mw} = ${turbines * mw} MW.`, undefined, { suffix: "MW" });
}

function resources(opts?: GenerateOptions): Question[] {
  return unitSet(RESOURCES, levelOf(opts), [() => sortQuestion(RESOURCE_SORT, 2), windQ]);
}

// ---------- C: Industries ----------

const INDUSTRIES: Item[] = [
  q(1, "Which sector turns raw materials into finished goods?", "secondary (manufacturing)", ["primary", "tertiary", "quaternary"], "Making cars, paper or steel is manufacturing."),
  q(1, "Which sector gathers raw materials from nature?", "primary", ["secondary", "tertiary", "quaternary"], "Farming, fishing, forestry and mining are primary industries."),
  q(1, "Which sector provides services?", "tertiary", ["primary", "secondary", "quaternary"], "Teaching, banking, retail and tourism are services."),
  q(1, "Which sector is based on knowledge, research and technology?", "quaternary", ["primary", "secondary", "tertiary"], "Software development, research and data science are examples."),
  q(1, "Which job is in the primary sector?", "commercial fisher", ["bank teller", "car assembler", "software developer"], "A commercial fisher harvests a natural resource."),
  q(1, "Which job is in the tertiary sector?", "nurse", ["miner", "steelworker", "forest harvester"], "Health care is a service."),
  q(1, "Which country is Canada's largest trading partner?", "the United States", ["Brazil", "Australia", "Kenya"], "Most of Canada's exports go to the United States."),
  q(2, "Which is a knowledge-based industry?", "artificial intelligence research", ["logging", "fishing", "farming"], "Knowledge-based industries depend on highly skilled people (human capital) more than on raw materials."),
  q(2, "Why is human capital important to a knowledge-based industry?", "Its main resource is the skills and ideas of its workers", ["It needs huge areas of land", "It is made of minerals", "It does not need workers"], "Companies locate where there are universities and skilled workers."),
  q(2, "Why did the auto industry grow in southern Ontario?", "Good transportation links, skilled workers and closeness to the large US market", ["There are no highways", "The region has no workers", "It is far from the border"], "Industries often choose a location by weighing several factors."),
  q(2, "Steel mills grew in Hamilton, Ontario because…", "ships and trains could bring iron ore and coal to the Great Lakes shore", ["there is no water nearby", "iron ore is mined in the city centre", "it is far from any market"], "Transportation and access to materials are location factors."),
  q(2, "Why are pulp and paper mills often built near forests and rivers?", "They need a lot of wood and water", ["They are made of fish", "They need mountains", "They need an airport"], "Raw material and water supply are location factors."),
  q(2, "Which location factor is about the cost of land, wages and taxes?", "economic costs", ["physical features only", "weather forecasts", "tourist attractions only"], "Companies compare costs of operating at different locations."),
  q(2, "A Canadian lumber company sells wood to builders in the United States. This shows…", "that Canadian industries are connected to those of other countries", ["that trade is not important", "that lumber is a service", "that exports do not exist"], "Trade links economies together."),
  q(2, "Most Canadian workers are employed in which sector?", "tertiary (services)", ["primary", "secondary", "no sector"], "Services such as health care, retail and education employ the largest share of workers."),
  q(2, "Which career in the marine sector relies on GPS and electronic charts?", "ship navigator", ["baker", "dentist", "carpenter"], "Geospatial technologies help ships navigate safely."),
  q(2, "A forester uses GIS to plan where to harvest and replant. This shows…", "that geospatial technology is useful in natural resource careers", ["that GIS is only for games", "that forestry has no use for maps", "that GIS replaces foresters"], "Maps and satellite images help manage large areas."),
  q(2, "Tourism is in the tertiary sector because it…", "provides services such as guiding, hotels and food", ["extracts raw materials", "manufactures goods", "does not employ people"], "Tourism depends on natural and cultural attractions and the people who serve visitors."),
  q(3, "An industry that loses much weight when raw material is processed, like ore, will usually locate…", "near the source of the raw material", ["far from the source", "only near big cities", "only near airports"], "Moving the heavy raw material costs more than moving the lighter product."),
  q(3, "A car part crosses the Canada–US border several times before a car is finished. This shows…", "that the industries of the two countries are closely interconnected", ["that borders do not exist", "that the car industry is primary", "that trade is declining"], "Supply chains link factories in different countries."),
];

const SECTOR_SORT: SortSet = {
  prompt: "Primary, secondary or tertiary? Sort each job.",
  hint: "Primary: gather raw materials. Secondary: make things. Tertiary: provide services.",
  bins: [
    { id: "primary", label: "Primary", emoji: "⛏️" },
    { id: "secondary", label: "Secondary", emoji: "🏭" },
    { id: "tertiary", label: "Tertiary", emoji: "🧑‍🏫" },
  ],
  items: [
    { label: "Farmer", emoji: "🌾", bin: "primary" },
    { label: "Miner", emoji: "⛏️", bin: "primary" },
    { label: "Tree harvester", emoji: "🌲", bin: "primary" },
    { label: "Car assembly worker", emoji: "🚗", bin: "secondary" },
    { label: "Sawmill worker", emoji: "🪵", bin: "secondary" },
    { label: "Bakery production worker", emoji: "🍞", bin: "secondary" },
    { label: "Teacher", emoji: "🧑‍🏫", bin: "tertiary" },
    { label: "Bus driver", emoji: "🚌", bin: "tertiary" },
    { label: "Store clerk", emoji: "🛒", bin: "tertiary" },
  ],
};

function sectorCountQ(): Question {
  const total = pick([200, 500, 1000]);
  const p = pick([10, 20, 50]);
  const s = pick([40, 100, 150]);
  return typeIn(`A town has ${spaced(total)} jobs. ${p} are primary and ${s} are secondary, and the rest are tertiary or quaternary. How many are tertiary or quaternary?`, total - p - s, `${spaced(total)} − ${p} − ${s} = ${spaced(total - p - s)}.`);
}

function industries(opts?: GenerateOptions): Question[] {
  return unitSet(INDUSTRIES, levelOf(opts), [() => sortQuestion(SECTOR_SORT, 2), sectorCountQ]);
}

// ---------- C: Sustainable development ----------

const LIFE_CYCLE: OrderQuestion = {
  kind: "order",
  prompt: "Put the life cycle of a phone in order, from start to finish.",
  hint: "A product starts as raw materials, is made, shipped and used, and ends as waste or is recycled.",
  items: [
    { id: "l1", label: "Minerals are mined" },
    { id: "l2", label: "Parts are manufactured and assembled" },
    { id: "l3", label: "The phone is shipped to stores" },
    { id: "l4", label: "The phone is used by a person" },
    { id: "l5", label: "The phone is recycled or thrown out" },
  ],
};

const SUSTAINABLE: Item[] = [
  q(1, "Sustainable development means…", "meeting today's needs without harming the ability of future generations to meet theirs", ["using everything now", "stopping all industry", "making the most profit this year"], "It balances the environment, society and the economy."),
  q(1, "The three parts of sustainability are…", "environment, society and economy", ["rivers, lakes and oceans", "primary, secondary and tertiary", "past, present and future only"], "A sustainable plan has to work for all three."),
  q(1, "Which action is an example of reducing waste?", "repairing something instead of throwing it out", ["buying a new one each time", "putting recyclables in the trash", "leaving lights on"], "Reduce, reuse and recycle, in that order."),
  q(1, "What is recycling?", "turning used materials into new products", ["burying waste", "burning waste for no reason", "throwing items away"], "Recycling keeps materials in use and saves energy."),
  q(2, "A fishing quota sets…", "a limit on how much fish may be caught", ["a minimum catch", "the price of fish", "the number of boats allowed to travel"], "Quotas aim to keep fish populations from being overfished."),
  q(2, "The cod fishery off Newfoundland was closed in 1992 because…", "overfishing had caused cod stocks to collapse", ["there were too many cod", "ships were too small", "the ocean had dried up"], "The closure affected thousands of workers and shows why sustainable management matters."),
  q(2, "A mining company is required to reclaim a mine site. This means…", "restoring the land when mining is done", ["leaving open pits unchanged", "selling the land", "moving the mine somewhere else"], "Reclamation reduces long-term damage to the environment."),
  q(2, "A circular economy tries to…", "keep products and materials in use as long as possible", ["use each item once and discard it", "increase waste", "avoid all recycling"], "Repair, reuse, remanufacture and recycling reduce the need for new resources."),
  q(2, "Which group is most likely to stress jobs and profit when a new mine is proposed?", "the mining company", ["an environmental advocacy group concerned about habitat", "a conservation scientist", "a school group studying the river"], "Different stakeholders have different perspectives."),
  q(2, "Which group is most likely to stress protecting a wetland from a new development?", "an environmental advocacy group", ["the developer who owns the land", "a company that wants to sell building materials", "a bank lending for the project"], "Advocacy groups try to influence decisions to protect something they value."),
  q(2, "How can governments influence sustainable resource use?", "by making laws, setting limits and offering incentives", ["by ignoring all industries", "by stopping all science", "by increasing waste"], "Governments set rules for industries and communities."),
  q(2, "Which is a sustainable forestry practice?", "replanting trees after harvesting", ["harvesting without replanting", "clearing every tree near a river", "burning the slash for no reason"], "Forest certification systems check that forests are managed responsibly."),
  q(2, "What does a product's life cycle include?", "getting raw materials, making, shipping, using and disposing of it", ["only buying it", "only throwing it out", "only the shop"], "Every stage uses energy and materials and can affect the environment."),
  q(2, "Which life-cycle stage of a phone creates e-waste?", "disposal", ["mining", "shipping", "using it as a camera"], "Old electronics hold valuable metals that should be recycled."),
  q(2, "A city offers rebates for installing solar panels and charges a fee for sending waste to the landfill. Which type of strategy is this?", "a government strategy using incentives and fees", ["an individual's shopping choice only", "a natural process", "an industry's secret plan"], "Governments can encourage sustainable choices through money."),
  q(2, "A student chooses a reusable water bottle and secondhand clothes. What influence does this show?", "the influence of individuals on sustainability", ["the influence of governments only", "no influence", "the influence of industries only"], "Many small decisions add up."),
  q(3, "A company promises 'carbon neutral' products. What should a thoughtful consumer do?", "ask how the claim was measured and whether it covers the whole life cycle", ["accept every claim", "reject all products", "ignore the label"], "Check evidence, not just words."),
  q(3, "A new mine will create jobs but may harm a river. What does sustainable development ask people to do?", "weigh economic, social and environmental effects and look for ways to reduce harm", ["only count the jobs", "only count the river", "avoid making any decision"], "Different perspectives must be balanced."),
  q(3, "Run-of-river hydroelectric projects divert some of a river's flow instead of building a large dam. A possible benefit is…", "less flooding of land than with a large reservoir", ["no effect on fish ever", "more flooding than a large dam", "using no water at all"], "Every energy project has trade-offs, so evaluate each one."),
];

function diversionQ(): Question {
  const total = pick([200, 400, 500, 1000, 2000]);
  const pct = pick([20, 30, 40, 50, 60, 70, 80]);
  const diverted = (total * pct) / 100;
  return typeIn(`A town produces ${spaced(total)} tonnes of waste and keeps ${spaced(diverted)} tonnes out of the landfill by recycling and composting. What is its diversion rate, as a percent?`, pct, `${spaced(diverted)} ÷ ${spaced(total)} × 100 = ${pct}%.`, undefined, { suffix: "%" });
}

function quotaQ(): Question {
  const stock = pick([20000, 40000, 50000, 80000]);
  const pct = pick([5, 10, 15, 20]);
  const t = (stock * pct) / 100;
  return typeIn(`Scientists estimate a fish stock at ${spaced(stock)} tonnes. A quota allows ${pct}% to be caught each year. How many tonnes is that?`, t, `${pct}% of ${spaced(stock)} = ${spaced(stock)} × ${pct / 100} = ${spaced(t)} tonnes.`, undefined, { suffix: "t" });
}

function sustainable(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const makers: Maker[] = [diversionQ, quotaQ];
  if (level !== 3) makers.push(lifeCycleQ);
  return unitSet(SUSTAINABLE, level, makers);
}

function lifeCycleQ(): Question {
  return { ...LIFE_CYCLE, items: LIFE_CYCLE.items.map((i) => ({ ...i })) };
}

// ---------- D: Population patterns ----------

const POPULATION: Item[] = [
  q(1, "What is population density?", "the number of people per unit of area", ["the total number of people in a country", "the number of births in a year", "the age of the oldest person"], "Density is population divided by area, for example people per square kilometre."),
  q(1, "What is the birth rate?", "the number of births per 1 000 people in a year", ["the number of deaths per year", "the number of people who move in", "the average age"], "It is a rate, so places of different sizes can be compared."),
  q(1, "Which province has the most people?", "Ontario", ["Prince Edward Island", "Saskatchewan", "Nova Scotia"], "Ontario has about 15 million people."),
  q(1, "Which province has the highest population density?", "Prince Edward Island", ["Saskatchewan", "Manitoba", "Alberta"], "PEI is small, so its people are close together."),
  q(1, "Where do most Canadians live?", "in the south, in or near cities", ["in the Arctic", "on the mountains' peaks", "evenly across the country"], "Climate, farmland and jobs draw people to the south."),
  q(1, "Why do so few people live in the far North?", "The climate is harsh and the settlements are far apart", ["It is too warm", "There is too much farmland", "There are too many roads"], "Physical conditions and access limit population there."),
  q(1, "A population pyramid with a wide top and narrow base shows…", "an aging population with few young people", ["a very young, fast-growing population", "an empty country", "a population with no seniors"], "More older people than children means the population is aging."),
  q(2, "The 'baby boom' of 1946 to 1965 is important to Canada's demographics because…", "that large group of people is now getting older, so the population is aging", ["it caused a drop in the population", "it created Canada's first cities", "it ended immigration"], "Large generations move through the age structure."),
  q(2, "Canada's fertility rate is below the replacement level of about 2.1 children per woman. What does this mean?", "Without immigration, the population would eventually shrink", ["The population will grow quickly by births alone", "Everyone has two children", "Canada has no immigration"], "Immigration is the main source of Canada's population growth."),
  q(2, "What is natural increase?", "births minus deaths", ["births plus immigration", "deaths plus emigration", "immigrants minus emigrants"], "It leaves out migration."),
  q(2, "What is net migration?", "the number of people moving in minus the number moving out", ["births minus deaths", "the number of immigrants only", "the number of children"], "It can be positive or negative."),
  q(2, "A 'pull factor' for migration is…", "job opportunities in a new place", ["a lack of work at home", "a war at home", "a lack of services at home"], "Push factors drive people away. Pull factors attract them."),
  q(2, "Which is a 'push factor' for migration?", "conflict or a shortage of jobs at home", ["good schools in a new place", "a warm climate in a new place", "a job offer elsewhere"], "Push factors make staying in a place hard."),
  q(2, "The movement of people from rural areas to cities is called…", "urbanization", ["emigration", "natural increase", "population density"], "More than eight in ten Canadians live in urban areas."),
  q(2, "Which factors affect where people settle?", "climate, water, soil, jobs and transportation", ["only the colour of buildings", "only the time zone", "only the name of the place"], "Physical and human factors combine."),
  q(2, "Which quality of life indicator measures health?", "life expectancy", ["literacy rate", "average rent", "number of malls"], "Life expectancy is how long people are expected to live."),
  q(2, "Which indicator measures education?", "literacy rate", ["life expectancy", "median age", "birth rate"], "Literacy is the share of people who can read and write."),
  q(2, "Why can quality of life differ between communities in Canada?", "Access to jobs, housing, health care, education and services is not the same everywhere", ["Every community has identical services", "Quality of life is only about money", "Geography has no effect"], "Many factors interrelate, such as income, housing and services."),
  q(3, "Canada's population density is low, about 4 people per km². Which statement explains this?", "Most of the country's land is northern, rocky or mountainous, with few people", ["Most people live in the Arctic", "Canada has a very small area", "Every region is densely settled"], "Overall density hides large differences between regions."),
  q(3, "Compared with Bangladesh, which has a very high population density, Canada has…", "a much lower density but a very concentrated population in a few regions", ["a higher density", "the same density", "no cities"], "Density depends on both people and land area."),
];

function densityQ(): Question {
  const area = pick([10, 20, 25, 40, 50, 100]);
  const dens = pick([20, 40, 50, 100, 200, 300]);
  return typeIn(`A town covers ${area} km² and has ${spaced(area * dens)} people. What is its population density, in people per km²?`, dens, `Density = population ÷ area = ${spaced(area * dens)} ÷ ${area} = ${dens} people per km².`, undefined, { suffix: "/km²" });
}

function naturalIncreaseQ(): Question {
  const death = randInt(5, 12);
  const birth = death + randInt(1, 8);
  return typeIn(`A region has a birth rate of ${birth} per 1 000 people and a death rate of ${death} per 1 000. What is its natural increase, per 1 000 people?`, birth - death, `Natural increase = birth rate − death rate = ${birth} − ${death} = ${birth - death} per 1 000.`);
}

function netMigrationQ(): Question {
  const out = pick([1000, 2000, 3000, 5000]);
  const inn = out + pick([1000, 2000, 4000, 5000]);
  return typeIn(`In one year, ${spaced(inn)} people moved into a city and ${spaced(out)} moved out. What was its net migration?`, inn - out, `Net migration = people in − people out = ${spaced(inn)} − ${spaced(out)} = ${spaced(inn - out)}.`);
}

function populationTableQ(): Question {
  const kids = pick([20, 30, 40, 50]);
  const seniors = pick([30, 40, 50, 60]);
  const workers = pick([100, 200, 500]);
  const ratio = ((kids + seniors) * 100) / workers;
  return {
    ...typeIn(`The table shows a region's population by age (in thousands). The dependency ratio is (ages 0 to 14 plus 65 and over) ÷ ages 15 to 64 × 100. What is it?`, ratio, `(${kids} + ${seniors}) ÷ ${workers} × 100 = ${ratio}.`),
    visual: { type: "table", headers: ["Age group", "Population (thousands)"], rows: [["0 to 14", kids], ["15 to 64", workers], ["65 and over", seniors]] },
  };
}

function population(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const makers: Maker[] = [densityQ, naturalIncreaseQ, netMigrationQ];
  if (level === 3) makers.push(populationTableQ);
  return unitSet(POPULATION, level, makers);
}

// ---------- D: Population issues ----------

const ISSUES: Item[] = [
  q(1, "What does an aging population mean?", "a growing share of the population is older", ["a growing share of the population is young", "the population is not changing", "everyone is the same age"], "Low birth rates and longer lives make the average age higher."),
  q(1, "About how many people live on Earth today?", "8 billion", ["800 million", "80 billion", "8 million"], "The world population passed 8 billion in 2022."),
  q(1, "What is a refugee?", "a person forced to leave their country because of danger, such as war or persecution", ["a tourist on holiday", "a student who chose to study abroad", "a person who moved for a better view"], "Canada welcomes refugees through government and private sponsorship."),
  q(2, "An aging population puts new pressure on…", "health care and pensions", ["only schools", "only highways", "nothing at all"], "Older people often need more health care, and fewer workers pay taxes per retiree."),
  q(2, "How might an aging population create opportunities?", "Older people can volunteer, mentor and keep working, and new services and jobs for seniors are needed", ["There are no opportunities", "Seniors cannot contribute", "There are fewer needs for housing"], "Demographic change brings both challenges and opportunities."),
  q(2, "Many small towns lose young people who move to cities for school and work. What is a possible result?", "schools and services may close", ["more schools open", "the town grows quickly", "taxes always fall"], "A smaller, older population can make services hard to keep."),
  q(2, "A fast-growing city can face which challenge?", "housing costs, traffic and pressure on services", ["too few people", "empty roads", "falling demand for homes"], "Growth brings jobs, but it also strains infrastructure."),
  q(2, "Why does Canada rely on immigration for growth?", "Its birth rate is below replacement level and its population is aging", ["Its birth rate is the highest in the world", "Canada has no jobs", "Nobody wants to leave their country"], "Immigrants help fill jobs and add to the working-age population."),
  q(2, "A program encourages newcomers to settle in smaller communities that need workers. This is an example of…", "a government strategy to address regional population needs", ["a natural disaster", "a decrease in birth rates", "a physical process"], "Governments can use immigration and incentives to support communities."),
  q(2, "Which is a way governments help families in a changing population?", "affordable child care and paid parental leave", ["closing all schools", "raising rent", "ending health care"], "Strategies for different age groups include child care, education, pensions and senior care."),
  q(2, "Why is recognizing newcomers' foreign credentials (training and degrees) useful?", "It helps skilled newcomers work in their fields", ["It stops people moving", "It lowers wages for everyone", "It closes schools"], "Using people's skills benefits individuals and the economy."),
  q(2, "A country's birth rate usually falls as...", "health care, education and incomes improve", ["health care gets worse", "schools close", "income falls"], "Many countries have seen this pattern."),
  q(2, "Which is a global population issue that people in Canada may be concerned about?", "refugees and hunger in other countries", ["the colour of a school bus", "local weather today", "a favourite team"], "Canadians respond through aid, sponsorship and organizations."),
  q(2, "How can an individual in Canada help with a global population issue like hunger?", "donate or volunteer with a trusted organization", ["ignore the issue", "waste food", "avoid learning about it"], "Individuals, organizations and governments all play roles."),
  q(3, "Japan has one of the oldest populations in the world. Which challenge is likely there?", "a shrinking workforce supporting many retired people", ["too many children for the schools", "a very young workforce", "no need for health care"], "Aging is a global issue, not just a Canadian one."),
  q(3, "Which region has the world's fastest-growing population?", "sub-Saharan Africa", ["Western Europe", "Japan", "Eastern Europe"], "Birth rates remain high there. Rapid growth can put pressure on jobs, schools and food."),
  q(3, "Which statement about a rapidly growing city is most accurate?", "Planners must expand housing, transit, water and schools to keep up", ["Nothing needs to change", "Planning is not necessary", "Cities cannot grow"], "Growth must be planned for in advance."),
];

function doublingQ(): Question {
  const rate = pick([1, 2, 5, 7, 10]);
  return typeIn(`The 'rule of 70' estimates doubling time: 70 ÷ the growth rate (as a percent). About how many years does a population growing ${rate}% a year take to double?`, 70 / rate, `70 ÷ ${rate} = ${70 / rate} years.`, undefined, { suffix: "years" });
}

function projectionQ(): Question {
  const start = pick([20000, 30000, 50000]);
  const add = pick([500, 1000, 1500]);
  const years = pick([4, 6, 8, 10]);
  return typeIn(`A town of ${spaced(start)} people grows by ${spaced(add)} people each year. How many people will it have after ${years} years?`, start + add * years, `${spaced(start)} + ${years} × ${spaced(add)} = ${spaced(start + add * years)}.`);
}

function dependentShareQ(): Question {
  const total = pick([200, 500, 1000]);
  const seniors = (total * pick([10, 20, 25])) / 100;
  return typeIn(`In a community of ${spaced(total)} people, ${seniors} are 65 or older. What percent of the community is 65 or older?`, (seniors / total) * 100, `${seniors} ÷ ${spaced(total)} × 100 = ${(seniors / total) * 100}%.`, undefined, { suffix: "%" });
}

function issues(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return unitSet(ISSUES, level, level === 1 ? [dependentShareQ, projectionQ] : [dependentShareQ, projectionQ, doublingQ]);
}

// ---------- E: Land use ----------

const LAND_USE: Item[] = [
  q(1, "Which land use includes houses and apartments?", "residential", ["industrial", "commercial", "agricultural"], "People live on residential land."),
  q(1, "Which land use includes stores and offices?", "commercial", ["residential", "industrial", "institutional"], "Commercial land is used to buy, sell and provide services."),
  q(1, "Which land use includes factories and warehouses?", "industrial", ["residential", "institutional", "recreational"], "Industrial land is for making and storing goods."),
  q(1, "Which land use includes schools, hospitals and libraries?", "institutional", ["industrial", "residential", "commercial"], "These serve the public."),
  q(1, "Which land use includes parks and trails?", "recreational and open space", ["industrial", "commercial", "residential"], "Green spaces serve people and nature."),
  q(1, "A city that spreads out into surrounding farmland with low-density housing is experiencing…", "urban sprawl", ["compact growth", "reforestation", "succession"], "Sprawl is low-density growth that takes up a lot of land."),
  q(2, "What is a zoning bylaw?", "a rule that says how land in an area can be used", ["a map of the weather", "a tax on food", "a speed limit"], "Zoning is one tool of land-use planning."),
  q(2, "What does an official plan do?", "sets out a municipality's goals and policies for how land will be used and how the community will grow", ["lists the weather each day", "sets the price of gas", "names streets only"], "Municipal plans guide where homes, jobs, parks and services go."),
  q(2, "Why should homes generally not be built in a floodplain?", "The land will be flooded from time to time, which puts people and property at risk", ["Floodplains never get wet", "The soil is too fertile", "There is no water nearby"], "The natural environment affects land use decisions."),
  q(2, "Why is farmland on the edge of a growing city under pressure?", "Developers see it as land for housing and the city is expanding", ["Nobody values the farmland", "Farmland is not flat", "It is full of mountains"], "Sprawl can permanently remove good farmland."),
  q(2, "Ontario's Greenbelt around the Golden Horseshoe was created to…", "protect farmland and natural areas from development", ["encourage sprawl", "build highways only", "remove forests"], "It limits urban growth in the protected areas."),
  q(2, "Compact urban growth means…", "building higher-density, mixed-use neighbourhoods close to transit and services", ["spreading homes farther apart", "building only on farmland", "avoiding apartments"], "Compact growth uses less land for the same number of people."),
  q(2, "Which is an impact of urban sprawl?", "more car trips, longer commutes and the loss of farmland and natural areas", ["fewer roads", "shorter commutes for all", "more farmland protected"], "Sprawl spreads people out, which makes services costly to deliver."),
  q(2, "Infill development means…", "building on unused or underused land within a built-up area", ["building on farmland far from the city", "moving a city", "removing all buildings"], "It makes better use of existing roads, pipes and transit."),
  q(2, "What is a brownfield?", "a former industrial site that may need cleaning before it is redeveloped", ["a farmer's field", "a park", "an untouched forest"], "Redeveloping brownfields can reduce pressure on green space."),
  q(2, "Which could reduce the urban heat island effect?", "green roofs and more trees", ["more dark parking lots", "removing parks", "building without shade"], "Plants cool the air and absorb rainwater."),
  q(2, "A community votes to protect a heritage district from demolition. This shows the influence of…", "cultural and social forces on land use", ["only physical processes", "only the weather", "only global warming"], "Values, history and politics all shape land use."),
  q(2, "A new factory brings jobs, so the city rezones land nearby for housing and shops. This shows the influence of…", "economic forces on land use", ["tides", "earthquakes", "glaciers"], "Jobs and money affect where and how a community grows."),
  q(3, "Why do transit-oriented developments reduce sprawl?", "They place homes, jobs and shops close to transit so more land and trips are used efficiently", ["They keep everyone far from transit", "They build only on farmland", "They remove sidewalks"], "Higher density near stations makes transit work and lowers car use."),
  q(3, "An urban growth boundary is a line outside which most development is not allowed. Its main aim is to…", "direct growth inward and protect surrounding land", ["spread development outward", "remove all roads", "increase sprawl"], "Strategies to control sprawl include boundaries, greenbelts and incentives for infill."),
];

const LAND_SORT: SortSet = {
  prompt: "Which land use is each building or place?",
  hint: "Residential: where people live. Commercial: buy, sell and offices. Industrial: make and store goods.",
  bins: [
    { id: "residential", label: "Residential", emoji: "🏠" },
    { id: "commercial", label: "Commercial", emoji: "🛍️" },
    { id: "industrial", label: "Industrial", emoji: "🏭" },
  ],
  items: [
    { label: "Apartment building", emoji: "🏢", bin: "residential" },
    { label: "Townhouses", emoji: "🏘️", bin: "residential" },
    { label: "Single-family houses", emoji: "🏠", bin: "residential" },
    { label: "Shopping mall", emoji: "🛍️", bin: "commercial" },
    { label: "Office tower", emoji: "🏙️", bin: "commercial" },
    { label: "Restaurant", emoji: "🍽️", bin: "commercial" },
    { label: "Factory", emoji: "🏭", bin: "industrial" },
    { label: "Warehouse", emoji: "📦", bin: "industrial" },
    { label: "Recycling plant", emoji: "♻️", bin: "industrial" },
  ],
};

function landPercentQ(): Question {
  const res = pick([30, 35, 40]);
  const com = pick([10, 15]);
  const ind = pick([5, 10]);
  const park = pick([10, 15]);
  const rest = 100 - res - com - ind - park;
  return typeIn(`A city's land is ${res}% residential, ${com}% commercial, ${ind}% industrial and ${park}% parks. The rest is roads and other uses. What percent is that?`, rest, `Add the shares: ${res} + ${com} + ${ind} + ${park} = ${res + com + ind + park}. Then 100 − ${res + com + ind + park} = ${rest}.`, undefined, { suffix: "%" });
}

function unitsPerHectareQ(): Question {
  const ha = pick([2, 4, 5, 10, 20]);
  const per = pick([10, 20, 40, 60, 100]);
  return typeIn(`A neighbourhood of ${ha} hectares has ${spaced(ha * per)} homes. What is its density, in homes per hectare?`, per, `${spaced(ha * per)} ÷ ${ha} = ${per} homes per hectare.`, undefined, { suffix: "/ha" });
}

function landUse(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return unitSet(LAND_USE, level, [() => sortQuestion(LAND_SORT, 2), landPercentQ, unitsPerHectareQ].slice(0, level === 1 ? 2 : 3));
}

// ---------- E: Sustainable communities ----------

const COMMUNITIES: Item[] = [
  q(1, "What is food insecurity?", "not having reliable access to enough healthy food", ["having too many farms", "eating only at restaurants", "growing food at home"], "It can happen when food is costly or far away."),
  q(1, "Which way of travelling makes the least greenhouse gas emissions per person?", "walking or cycling", ["driving alone in a car", "flying", "a diesel truck"], "Active transportation produces no tailpipe emissions and is healthy."),
  q(1, "What is a community garden?", "a shared plot where neighbours grow food", ["a garden only for one family", "a factory", "a grocery store chain"], "Community gardens increase access to fresh food."),
  q(1, "Public transit is more sustainable than driving alone because it…", "moves many people at once and often produces less pollution per person", ["uses more roads", "carries one person each", "has no engines"], "Fewer vehicles mean less traffic and fewer emissions."),
  q(2, "Food miles are…", "the distance food travels from where it is grown to where it is eaten", ["the number of meals you eat in a day", "the price of food per kilogram", "the number of grocery stores in a town"], "Long distances use fuel, but how food is grown and moved also matters."),
  q(2, "Which is a way to reduce food waste?", "planning meals and composting scraps", ["buying much more than needed", "throwing out food at its best-before date automatically", "leaving food on the counter"], "Wasted food also wastes the energy, water and land used to produce it."),
  q(2, "Why are food prices often much higher in remote northern communities?", "Food must be flown in over long distances", ["Food grows easily there", "There are many farms nearby", "Roads are everywhere"], "Programs such as Nutrition North Canada help lower the cost."),
  q(2, "Which strategy shortens the distance between farms and consumers?", "farmers' markets and community-supported agriculture", ["importing everything", "closing all farms", "building longer supply chains"], "Local food systems keep more money in the community."),
  q(2, "Climate change may affect Canada's food system by…", "changing growing seasons and increasing droughts, floods and pests", ["ending all farming forever", "making every region wetter", "having no effect on crops"], "Farmers are adapting by changing crops and water use."),
  q(2, "Light rail transit (LRT) such as Ottawa's O-Train or Waterloo's ION helps sustainability by…", "moving many people with less pollution per trip than cars", ["adding more cars to the road", "increasing sprawl", "removing stations"], "Transit works best along busy routes with dense neighbourhoods."),
  q(2, "Why is shipping freight by train often more sustainable than by truck?", "A train can move a lot of freight using less fuel per tonne", ["Trains use more fuel per tonne", "Trains cannot carry freight", "Trucks never use fuel"], "Rail generally has lower emissions per tonne-kilometre."),
  q(2, "A 'complete street' is designed for…", "walking, cycling, transit and cars", ["only cars", "only trucks", "only parking"], "It makes it safe and convenient to get around in different ways."),
  q(2, "Ontario ended coal-fired electricity in 2014. Which kind of decision was this?", "a government policy on energy production", ["an individual's habit", "a natural event", "a school rule"], "Government policies shape the sustainability of communities."),
  q(2, "A building code that requires better insulation helps sustainability by…", "reducing the energy needed to heat and cool buildings", ["increasing heat loss", "making buildings use more fuel", "removing windows"], "Policies and individual choices both change energy use."),
  q(2, "An individual decision that cuts a household's energy use is…", "installing a smart thermostat and sealing drafts", ["leaving windows open in winter", "leaving lights on all day", "using more space heaters"], "Small decisions add up."),
  q(2, "Which is an example of social sustainability in a community?", "affordable housing and access to health care", ["a single large factory", "closing all libraries", "removing public parks"], "Social sustainability is about well-being, fairness and access."),
  q(2, "Which is an example of environmental sustainability?", "protecting wetlands that clean water", ["draining all wetlands", "dumping waste in rivers", "removing all trees"], "Environmental sustainability protects the natural systems that support life."),
  q(2, "A repair café or tool library helps a community by…", "letting people reuse and share items instead of buying new ones", ["increasing waste", "making tools harder to get", "ending the need for sharing"], "Community-based programs can address environmental, social and economic goals together."),
  q(3, "Electric vehicles reduce tailpipe emissions. Why do planners still support transit and walkable neighbourhoods?", "Cars still need roads and parking, take energy to build and keep traffic and sprawl going", ["Electric vehicles are not real", "Transit makes more pollution than cars", "Walking is unhealthy"], "A sustainable transportation system looks at the whole system, not one vehicle."),
  q(3, "Why can high-speed rail between big cities be both a benefit and a challenge?", "It can cut car and air travel, but it costs a lot and uses land and money", ["It is free to build", "It has no environmental effect", "It makes travel slower"], "Large projects need to be evaluated from environmental, economic and social views."),
  q(3, "A community wants to cut energy use by moving to renewable power. Which consideration matters most when evaluating a plan?", "its effects on cost, reliability, jobs and emissions", ["only its colour", "only the name of the project", "only what neighbouring towns decided"], "Sustainability means weighing many effects at once."),
];

function carEmissionsQ(): Question {
  const g = pick([100, 120, 150, 200]);
  const km = pick([10, 20]);
  const total = (g * km * 10) / 1000;
  return typeIn(`A car emits ${g} g of CO₂ per km. Someone drives ${km} km to work and ${km} km home, 5 days a week. How many kg of CO₂ is that each week?`, total, `${g} g × ${km * 2} km × 5 days = ${spaced(g * km * 10)} g, which is ${total} kg.`, undefined, { suffix: "kg" });
}

function homesSavingQ(): Question {
  const homes = pick([200, 400, 500, 800]);
  const kwh = pick([1000, 1500, 2000]);
  const mwh = (homes * kwh) / 1000;
  return typeIn(`A program helps ${homes} homes each save ${spaced(kwh)} kWh a year. How many megawatt-hours (MWh) is that in total? (1 MWh = 1 000 kWh)`, mwh, `${homes} × ${spaced(kwh)} = ${spaced(homes * kwh)} kWh, and ${spaced(homes * kwh)} ÷ 1 000 = ${mwh} MWh.`, undefined, { suffix: "MWh" });
}

function communities(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return unitSet(COMMUNITIES, level, [carEmissionsQ, homesSavingQ]);
}

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "geo-inquiry-9",
    title: "Geographer's Toolkit",
    emoji: "🧭",
    blurb: "Questions, maps and sources",
    standards: on("A1.1, A1.2, A1.3, A1.4, A1.5, A1.6, A2.1, A2.2, A2.3, A2.4", "the geographic inquiry process, geographic thinking concepts, maps and geospatial technology, assessing sources, and geography careers"),
    parentNote: "Asking factual and debatable questions, primary and secondary sources, judging whether a source or an AI-made image can be trusted, the four geographic thinking concepts, map scale, latitude, time zones, GIS and GPS, and careers that use geography.",
    generate: inquiry,
  },
  {
    id: "landform-regions-9",
    title: "Canada's Landform Regions",
    emoji: "🏔️",
    blurb: "Shield, plains, mountains and more",
    standards: on("B1.1, B1.2, B1.5", "Canada's physical regions and landforms, how they formed, and how physical features contribute to Canadian identity"),
    parentNote: "The Canadian Shield, Interior Plains, Western Cordillera, Great Lakes–St. Lawrence Lowlands, Appalachian Region, Hudson Bay Lowlands and Arctic Lands, how glaciers and plate movement shaped them, and how landscapes appear in Canadian symbols.",
    generate: regions,
  },
  {
    id: "physical-processes-9",
    title: "Weather, Climate & Landscape",
    emoji: "🌦️",
    blurb: "How Canada's physical processes work",
    standards: on("B1.2, B1.3, B1.4", "geological, hydrological and climatic processes, and patterns and trends in weather and global physical systems"),
    parentNote: "Weathering, erosion and deposition, glaciation, plate tectonics, what shapes climate (ocean, mountains, latitude, elevation), patterns of hazards such as tornadoes and floods, and global systems such as the jet stream and El Niño.",
    generate: processes,
  },
  {
    id: "nature-people-9",
    title: "People & the Natural World",
    emoji: "🌊",
    blurb: "Risks, hazards and adapting",
    standards: on("B2.1, B2.2, B2.3, B2.4", "how physical features support communities, how human activities change physical processes, natural hazards and risks, and climate change adaptation and mitigation"),
    parentNote: "How landscapes support work and communities, how paving, draining wetlands and building dams change natural systems, hazards such as floods, wildfires and earthquakes, and local ways to adapt to and reduce climate change.",
    generate: nature,
  },
  {
    id: "resources-9",
    title: "Canada's Resources",
    emoji: "⛏️",
    blurb: "Renewable, non-renewable and flow",
    standards: on("C1.1, C1.2, C1.3", "renewable, non-renewable and flow resources, how they are distributed, and how they are extracted, harvested and used"),
    parentNote: "Types of natural resources, where key resources such as potash, oil, minerals, forests, fish and hydroelectric power are found and why, and ways of extracting them, including clean-energy methods such as wind, solar and nuclear.",
    generate: resources,
  },
  {
    id: "industries-9",
    title: "Industries & Jobs",
    emoji: "🏭",
    blurb: "Sectors, location and trade",
    standards: on("C1.4, C1.5, C1.6, C1.7", "knowledge-based and other industries, location factors, the importance of industries and trade, and careers"),
    parentNote: "Primary, secondary, tertiary and quaternary industries, why companies choose certain locations, how Canadian industries connect to other countries, and careers in the marine, resource and tourism sectors.",
    generate: industries,
  },
  {
    id: "sustainable-development-9",
    title: "Using Resources Wisely",
    emoji: "♻️",
    blurb: "Sustainability and everyday products",
    standards: on("C2.1, C2.2, C2.3, C2.4, C2.5", "sustainable development of resources and industries, strategies by governments and industries, and the life cycle of everyday products"),
    parentNote: "What sustainable development means, quotas and reclamation, the circular economy, how governments, industries, advocacy groups and individuals influence resource use, and the life cycle of everyday products such as a phone.",
    generate: sustainable,
  },
  {
    id: "population-patterns-9",
    title: "Canada's People",
    emoji: "👥",
    blurb: "Density, migration and settlement",
    standards: on("D1.1, D1.2, D1.3, D1.4, D1.5", "demographic characteristics and trends, quality of life, migration and immigration, and patterns of settlement"),
    parentNote: "Population density, birth rate, natural increase and net migration, population pyramids, why Canadians settle where they do, quality of life indicators, and comparing Canada's settlement patterns with other places.",
    generate: population,
  },
  {
    id: "population-issues-9",
    title: "A Changing Population",
    emoji: "🌍",
    blurb: "Aging, growth and global issues",
    standards: on("D2.1, D2.2, D2.3, D2.4", "effects of population change, strategies to address Canada's changing population, and global population issues"),
    parentNote: "How an aging population, small-town decline and city growth affect people, government strategies on immigration and families, the 'rule of 70', and how people in Canada respond to global population issues.",
    generate: issues,
  },
  {
    id: "land-use-9",
    title: "How Land Is Used",
    emoji: "🏘️",
    blurb: "Land use, planning and sprawl",
    standards: on("E1.1, E1.2, E1.3, E1.4", "land uses in communities, the influence of the environment and economic, social and political forces, and urban sprawl and compact growth"),
    parentNote: "Residential, commercial, industrial, institutional and open-space land uses, official plans and zoning, why floodplains need care, the Greenbelt, urban sprawl compared with compact growth, and ways to control sprawl.",
    generate: landUse,
  },
  {
    id: "sustainable-communities-9",
    title: "Liveable Communities",
    emoji: "🚲",
    blurb: "Food, transport and energy",
    standards: on("E2.1, E2.2, E2.3, E2.4", "sustainability of the food system, transportation and energy, and the social, environmental and economic sustainability of communities"),
    parentNote: "Food miles, food waste and food costs in remote communities, sustainable transportation such as transit, rail and cycling, how government policies and personal choices affect energy use, and community programs that support sustainability.",
    generate: communities,
  },
];
