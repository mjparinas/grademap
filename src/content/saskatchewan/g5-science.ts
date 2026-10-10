import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 5 Science, Earth and Space Science: Weather (WE5.1–WE5.3). Neither BC nor Ontario
// teaches weather in Grade 5, so these two units are written for Saskatchewan.

// ---------- Measuring weather ----------

const TOOL_SORT: SortSet = {
  prompt: "What does the tool measure? Tap a tool, then tap its basket.",
  hint: "A thermometer measures temperature. A rain gauge measures how much rain fell. An anemometer measures wind speed.",
  bins: [
    { id: "temp", label: "temperature", emoji: "🌡️" },
    { id: "wind", label: "wind", emoji: "💨" },
    { id: "water", label: "rain or snow", emoji: "🌧️" },
  ],
  items: [
    { label: "thermometer", emoji: "🌡️", bin: "temp" },
    { label: "weather station sensor for temperature", emoji: "📟", bin: "temp" },
    { label: "anemometer", emoji: "🌀", bin: "wind" },
    { label: "wind vane", emoji: "🧭", bin: "wind" },
    { label: "windsock", emoji: "🎏", bin: "wind" },
    { label: "rain gauge", emoji: "🪣", bin: "water" },
    { label: "snow ruler", emoji: "📏", bin: "water" },
    { label: "weather radar (rain and snow)", emoji: "📡", bin: "water" },
  ],
};

const CLOUD_ORDER = order("Put these cloud types in order from the highest in the sky to the lowest.", "Cirrus clouds are high and wispy, cumulus are puffy and in the middle, and stratus are low, flat layers.", [
  ["cirrus (high, wispy)", "🌤️"],
  ["cumulus (puffy)", "⛅"],
  ["stratus (low, flat)", "☁️"],
]);

const MEASURE: Item[] = [
  q("What does a thermometer measure?", "temperature", ["wind speed", "rain", "air pressure"], "In Canada, temperature is measured in degrees Celsius (°C).", "🌡️"),
  q("In which unit do we measure temperature in Canada?", "degrees Celsius", ["kilograms", "litres", "kilometres"], "Water freezes at 0 °C and boils at 100 °C.", "🌡️"),
  q("At what temperature does water freeze?", "0 °C", ["10 °C", "50 °C", "100 °C"], "Water changes from a liquid to a solid at 0 °C.", "🧊"),
  q("Which tool measures wind speed?", "an anemometer", ["a thermometer", "a rain gauge", "a barometer"], "The cups on an anemometer spin faster when the wind is stronger.", "🌀"),
  q("Which tool shows which direction the wind is coming from?", "a wind vane", ["a ruler", "a clock", "a rain gauge"], "A wind vane points into the wind.", "🧭"),
  q("A wind vane points west. The wind is blowing from the…", "west", ["east", "north", "south"], "Wind directions are named for where the wind comes from.", "🧭"),
  q("What does a rain gauge measure?", "how much rain has fallen", ["how strong the wind is", "how cold it is", "how many clouds there are"], "Rain is measured in millimetres.", "🪣"),
  q("What does a barometer measure?", "air pressure", ["rainfall", "temperature", "wind direction"], "Changes in air pressure help forecasters predict weather.", "⏱️"),
  q("A hygrometer measures…", "how much water vapour is in the air", ["wind speed", "temperature", "snow depth"], "This is called humidity.", "💧"),
  q("What are cirrus clouds like?", "high, thin and wispy", ["low and flat", "dark and heavy", "puffy like cotton balls"], "Cirrus clouds are made of ice crystals high in the sky.", "🌤️"),
  q("Which clouds look like white, puffy cotton balls on a fair day?", "cumulus", ["cirrus", "stratus", "nimbus"], "Cumulus clouds often bring fair weather.", "⛅"),
  q("Which clouds form low, flat grey layers across the sky?", "stratus", ["cirrus", "cumulus", "cumulonimbus"], "Stratus clouds can bring drizzle or an overcast day.", "☁️"),
  q("Which tall, dark clouds bring thunderstorms?", "cumulonimbus", ["cirrus", "stratus", "altocumulus"], "Cumulonimbus clouds grow very tall and can bring heavy rain, hail and lightning.", "⛈️"),
  q("Why is it important to measure weather at the same time each day?", "so the numbers can be compared fairly", ["so the weather stays the same", "to save paper", "because clocks cannot be moved"], "A fair comparison needs measurements taken in the same way.", "⏰"),
  q("Where should a thermometer be placed to measure air temperature?", "in the shade, away from direct sun", ["in full sun on dark rock", "inside a hot car", "in a freezer"], "Direct sunlight makes the thermometer read hotter than the air.", "🌳"),
  q("A weather station records 5 mm of rain. What does that mean?", "5 millimetres of rain fell", ["5 centimetres of snow", "5 degrees of heat", "5 kilometres of wind"], "Rainfall is measured as a depth.", "🌧️"),
  q("Wind chill is…", "how cold the air feels on your skin when the wind blows", ["the speed of the wind", "the depth of snow", "a cloud type"], "A cold wind makes the air feel colder than the temperature shows.", "🥶"),
  q("Why do weather forecasters in Saskatchewan often warn about wind chill in winter?", "it can be dangerous to be outside in extreme cold", ["it makes the snow melt", "it stops the wind", "it helps crops grow"], "Frostbite can happen quickly in very cold wind.", "⚠️"),
  q("Which type of graph is a good way to show temperature changing over a week?", "a line graph", ["a map of Canada", "a pictograph of cars", "a calendar of birthdays"], "A line graph shows change over time.", "📈"),
  q("A student records the high temperature each day for a week. Which one is the highest?", "the biggest number on the graph", ["the smallest number", "the middle day only", "the first day always"], "The highest temperature is the largest value.", "📊"),
  q("Which clouds are most likely to bring a thunderstorm to the prairies on a hot afternoon?", "cumulonimbus", ["cirrus", "stratus", "fog"], "Hot air rises and cumulonimbus clouds can grow very tall.", "⛈️"),
  q("A weather forecast says 70 % chance of rain. What does it mean?", "rain is likely, but not certain", ["it will rain for 70 minutes", "it will rain on 70 days", "it is raining now"], "It is a measure of how likely rain is.", "🌦️"),
  hq("Why do scientists use instruments to measure weather and not just their senses?", "instruments give accurate numbers that can be compared", ["senses are never useful", "instruments make weather", "it saves time only"], "Measurements can be shared and compared by many people.", "🔬"),
  hq("A student's thermometer reads 3 °C warmer in the sun than in the shade. What should they do?", "move it to the shade and measure again", ["take the higher number only", "ignore it", "put it in the fridge"], "A fair test measures air temperature, not sunlight.", "🌳"),
  hq("Why do meteorologists use satellites and radar as well as ground stations?", "they show weather over large areas", ["they stop storms", "they only measure snow", "they replace the Sun"], "Satellites and radar can track storms moving across the province.", "📡"),
  hq("The wind speed rises from 10 km/h to 60 km/h in an hour. What is probably happening?", "a storm or front is arriving", ["the Moon is full", "the weather is getting calmer", "the day is ending"], "Rapid changes in wind show changing weather.", "🌬️"),
  hq("Cirrus clouds thicken and lower into stratus clouds. What might follow?", "rain or snow", ["a heat wave", "a dry week", "no change at all"], "Clouds that thicken and lower are often a sign of a coming front.", "🌧️"),
];

// ---------- Weather patterns and its impact ----------

const FRONT_SORT: SortSet = {
  prompt: "Does it describe a high pressure or a low pressure system? Tap an item, then tap its basket.",
  hint: "High pressure usually brings clear skies. Low pressure usually brings clouds and precipitation.",
  bins: [
    { id: "high", label: "high pressure", emoji: "☀️" },
    { id: "low", label: "low pressure", emoji: "🌧️" },
  ],
  items: [
    { label: "usually clear skies", emoji: "☀️", bin: "high" },
    { label: "air sinks", emoji: "⬇️", bin: "high" },
    { label: "calm, dry weather", emoji: "😎", bin: "high" },
    { label: "cool, clear nights", emoji: "🌙", bin: "high" },
    { label: "clouds and precipitation", emoji: "☁️", bin: "low" },
    { label: "air rises", emoji: "⬆️", bin: "low" },
    { label: "stormy weather", emoji: "⛈️", bin: "low" },
    { label: "windy conditions", emoji: "💨", bin: "low" },
  ],
};

const WATER_ORDER = order("Put the steps of the water cycle in order.", "Water evaporates, rises and condenses into clouds, then falls as precipitation and collects again.", [
  ["Water evaporates from lakes and oceans", "☀️"],
  ["Water vapour rises and cools", "⬆️"],
  ["Clouds form (condensation)", "☁️"],
  ["Rain or snow falls (precipitation)", "🌧️"],
  ["Water collects in rivers and lakes", "🏞️"],
]);

const PATTERNS: Item[] = [
  q("What drives most of our weather?", "heat from the Sun", ["the Moon's light only", "volcanoes", "ocean tides"], "The Sun heats Earth's surface and air unevenly, which moves air and water.", "☀️"),
  q("What is wind?", "air that is moving", ["a type of cloud", "a kind of rain", "a solid"], "Air moves from areas of high pressure to low pressure.", "💨"),
  q("Why does warm air rise?", "warm air is lighter than cold air", ["warm air is heavier", "the Moon pulls it", "it is magic"], "Warm air is less dense, so it moves up.", "🔥"),
  q("What happens when warm, moist air cools high in the sky?", "water vapour condenses into clouds", ["the air disappears", "it turns into a rock", "it freezes the ground"], "Condensation forms tiny water droplets.", "☁️"),
  q("What is precipitation?", "water that falls from the sky, such as rain, snow or hail", ["only fog", "only dew", "only wind"], "Rain, snow, sleet and hail are all precipitation.", "🌧️"),
  q("What is a cold front?", "the leading edge of a mass of cold air moving in", ["a place where it is always cold", "a snow shovel", "a type of cloud"], "A cold front often brings a change in temperature and sometimes storms.", "❄️"),
  q("After a cold front passes through, the temperature usually…", "drops", ["rises quickly", "stays the same forever", "turns to sunshine only"], "Cold air has moved in behind the front.", "🌡️"),
  q("Which weather is most often linked to high pressure?", "clear, dry skies", ["thunderstorms", "blizzards", "floods"], "Sinking air tends to clear the sky.", "☀️"),
  q("Which weather is most often linked to low pressure?", "clouds and precipitation", ["clear, calm days", "no wind", "no clouds"], "Rising air forms clouds.", "🌧️"),
  q("A prairie winter storm with strong winds and blowing snow is called a…", "blizzard", ["tornado", "monsoon", "hurricane"], "Blizzards can make travel dangerous.", "❄️"),
  q("What is a tornado?", "a rotating column of air that touches the ground", ["a type of snow", "a warm breeze", "a flood"], "Tornadoes can form during severe thunderstorms in Saskatchewan in summer.", "🌪️"),
  q("What should you do if a tornado warning is issued?", "go to the lowest floor of a sturdy building, away from windows", ["go outside to watch", "stand by a window", "drive toward it"], "Staying low and away from windows protects people.", "🏠"),
  q("What is hail?", "balls of ice that fall during some thunderstorms", ["soft snow", "warm rain", "fog"], "Hail can damage crops, cars and roofs.", "🧊"),
  q("How can a hailstorm affect a farmer?", "it can destroy a crop", ["it helps wheat grow faster", "it makes the wheat taller", "it has no effect"], "Hail can flatten crops in a few minutes.", "🌾"),
  q("How can a drought affect people on the prairies?", "crops and water supplies can be low", ["it floods the roads", "it makes extra snow", "it grows more grass"], "Drought is a long time without enough rain.", "☀️"),
  q("How do weather forecasts help people?", "they help them plan and stay safe", ["they control the weather", "they stop the rain", "they change the seasons"], "Forecasts help people decide what to wear, when to travel and how to prepare for severe weather.", "📺"),
  q("Which technology helps predict where a storm will go?", "weather radar and satellites", ["a kitchen blender", "a skateboard", "a telephone book"], "Radar shows where precipitation is, and satellites show clouds from space.", "🛰️"),
  q("What is a flood?", "too much water covering land that is usually dry", ["a long period without rain", "a strong wind", "a very high temperature"], "Spring snowmelt and heavy rain can cause floods.", "🌊"),
  q("A heat wave is…", "a stretch of unusually hot weather", ["a cold front", "a long storm of snow", "a type of cloud"], "Heat waves can be unsafe, so people should drink water and stay cool.", "🥵"),
  q("Why is it unsafe to be outside during a thunderstorm?", "lightning can strike", ["rain is not allowed", "thunder is too loud only", "the wind turns off"], "“When thunder roars, go indoors.”", "⚡"),
  q("Which of these is a way weather affects society?", "storms can close roads and schools", ["weather never affects people", "it makes homework easier", "it only affects animals"], "Weather affects travel, work, farming and safety.", "🚧"),
  hq("Why is the weather on the prairies often windy?", "the land is flat and open, so there is little to slow the wind", ["there are tall mountains in the way", "the sea is nearby", "the Moon is closer"], "There are few hills and forests to block the wind across the open prairie.", "🌾"),
  hq("Why do clouds form when air rises?", "rising air cools, and water vapour condenses", ["rising air gets hotter", "clouds are dust only", "air is pulled in by the Sun"], "Cooler air holds less water vapour.", "☁️"),
  hq("How does the water cycle connect to weather?", "evaporation and condensation move water and form clouds and precipitation", ["it has nothing to do with weather", "it only happens in oceans", "it stops in winter"], "The Sun powers the water cycle, which makes clouds and precipitation.", "♻️"),
  hq("Snow melts quickly in spring and rivers rise. What could be a result?", "flooding in low-lying areas", ["a drought", "a heat wave", "a tornado"], "More water than the river can carry spills over its banks.", "🌊"),
  hq("Why do farmers check weather forecasts so closely at harvest?", "rain can delay harvest and damage a ripe crop", ["farmers do not need to know", "rain makes the harvest quicker", "wind turns wheat into corn"], "Dry weather is needed to cut, dry and store grain.", "🌾"),
];

export const units: Unit[] = [
  {
    id: "sk-weather-measuring",
    title: "Measuring Weather",
    emoji: "🌡️",
    blurb: "Thermometers, wind vanes, rain gauges and clouds",
    standards: { "ca-sk": sk("WE5.1", "measuring and representing local weather: temperature, wind speed and direction, precipitation and cloud type") },
    parentNote: "The tools that measure weather (thermometer, anemometer, wind vane, rain gauge, barometer), cloud types, fair measuring, and reading graphs of weather data.",
    generate: bankUnit(MEASURE, { sorts: [TOOL_SORT], orders: [CLOUD_ORDER] }),
  },
  {
    id: "sk-weather-patterns",
    title: "Weather Patterns & Impacts",
    emoji: "🌪️",
    blurb: "Wind, fronts, storms and staying safe",
    standards: { "ca-sk": sk("WE5.2, WE5.3", "how air movement and solar energy create weather, and the impact of weather on society and the environment") },
    parentNote: "How the Sun's heat moves air and water, high and low pressure, fronts, the water cycle, severe prairie weather (blizzards, hail, tornadoes, drought, floods), and how forecasts and technology help people stay safe.",
    generate: bankUnit(PATTERNS, { sorts: [FRONT_SORT], orders: [WATER_ORDER] }),
  },
];
