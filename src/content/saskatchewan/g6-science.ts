import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { sk } from "./kit";

// Saskatchewan Grade 6 Science, Physical Science: Understanding Electricity (EL6.1).

const SOURCE_SORT: SortSet = {
  prompt: "Is the energy source renewable or non-renewable? Tap a source, then tap its basket.",
  hint: "Renewable sources, such as flowing water, wind and sunlight, are naturally replaced. Coal, natural gas and uranium are used up.",
  bins: [
    { id: "renew", label: "renewable", emoji: "♻️" },
    { id: "non", label: "non-renewable", emoji: "⛏️" },
  ],
  items: [
    { label: "wind", emoji: "💨", bin: "renew" },
    { label: "sunlight", emoji: "☀️", bin: "renew" },
    { label: "flowing river water", emoji: "🌊", bin: "renew" },
    { label: "heat from inside Earth", emoji: "🌋", bin: "renew" },
    { label: "coal", emoji: "⛏️", bin: "non" },
    { label: "natural gas", emoji: "🔥", bin: "non" },
    { label: "uranium", emoji: "☢️", bin: "non" },
    { label: "oil", emoji: "🛢️", bin: "non" },
  ],
};

const SAVE_SORT: SortSet = {
  prompt: "Does the action save electricity or use more of it? Tap an action, then tap its basket.",
  hint: "Turning things off and using efficient bulbs saves electricity. Leaving devices running when nobody needs them uses more.",
  bins: [
    { id: "save", label: "saves electricity", emoji: "💡" },
    { id: "use", label: "uses more", emoji: "🔌" },
  ],
  items: [
    { label: "turning off lights when leaving a room", emoji: "💡", bin: "save" },
    { label: "using LED bulbs", emoji: "🔆", bin: "save" },
    { label: "unplugging a charger that is not in use", emoji: "🔌", bin: "save" },
    { label: "hanging laundry to dry", emoji: "👕", bin: "save" },
    { label: "leaving the TV on in an empty room", emoji: "📺", bin: "use" },
    { label: "leaving every light on all night", emoji: "🌙", bin: "use" },
    { label: "running the dryer for one small item", emoji: "🧺", bin: "use" },
    { label: "keeping a game console on all day", emoji: "🎮", bin: "use" },
  ],
};

const HYDRO_ORDER = order("Put the steps of making hydroelectricity at a dam in order.", "A dam stores water. The water flows through a turbine, the turbine spins a generator, and wires carry the electricity to homes.", [
  ["A dam holds back water in a reservoir", "🏞️"],
  ["Water rushes through a pipe in the dam", "🌊"],
  ["The moving water spins a turbine", "🌀"],
  ["A generator makes electricity", "⚡"],
  ["Power lines carry it to homes and farms", "🏠"],
]);

const ELECTRICITY: Item[] = [
  q("Which company makes and delivers most of the electricity in Saskatchewan?", "SaskPower", ["a school board", "the post office", "a grain elevator"], "SaskPower is the province's electric utility, owned by the people of Saskatchewan.", "⚡"),
  q("Which of these sources has long been used to make a large share of Saskatchewan's electricity?", "coal", ["tides", "volcanoes", "bananas"], "Coal is mined in the southeast and burned in power stations.", "⛏️"),
  q("What is Gardiner Dam used for?", "it holds back Lake Diefenbaker and makes hydroelectricity", ["it grows potash", "it stores uranium", "it makes wind"], "The Coteau Creek power station is part of Gardiner Dam on the South Saskatchewan River.", "🏞️"),
  q("Which river does Lake Diefenbaker sit on?", "the South Saskatchewan River", ["the Red River", "the Fraser River", "the St. Lawrence River"], "Lake Diefenbaker is a large reservoir on this river.", "🌊"),
  q("What spins a turbine at a hydroelectric station?", "moving water", ["moving shadows", "cold air", "melted snow only"], "The water pushes against the turbine blades.", "🌀"),
  q("What spins a turbine on a wind farm?", "moving air", ["running water", "burning coal", "sunlight on a panel"], "Wind pushes against the blades.", "💨"),
  q("What do solar panels use to make electricity?", "sunlight", ["wind", "running water", "coal"], "Solar cells change light energy into electrical energy.", "☀️"),
  q("Saskatchewan has many sunny days each year. Why is that useful for electricity?", "it suits solar panels", ["it makes dams bigger", "it makes coal grow", "it makes wind stop"], "More sunshine means more electricity from solar panels.", "☀️"),
  q("Why is wind a good energy source on the prairies?", "the land is open and often windy", ["there are tall mountains", "there is no air", "it is always still"], "Open, flat land gives wind plenty of room to blow.", "🌾"),
  q("What is a renewable energy source?", "one that nature replaces, such as wind or sunlight", ["one that can only be used once", "one that has to be mined", "one that costs nothing to build"], "Wind and sunlight will keep coming.", "♻️"),
  q("What is a non-renewable energy source?", "one that gets used up and is not replaced quickly", ["one that is always windy", "one that is free", "one that is clean"], "Coal and natural gas took millions of years to form.", "⛏️"),
  q("Which fuel is mined in northern Saskatchewan and used in nuclear power stations?", "uranium", ["potash", "salt", "gold"], "Saskatchewan is a major producer of uranium. Most of it is sold to other places.", "☢️"),
  q("What can burning coal to make electricity add to the air?", "carbon dioxide, a greenhouse gas", ["clean oxygen only", "more snow", "fresh water"], "Greenhouse gases trap heat and are linked to climate change.", "🏭"),
  q("Which choice is an environmental impact of a large dam?", "it can flood land and change the river's flow", ["it makes the air heavier", "it stops the Sun", "it removes all water"], "A reservoir covers land that was dry before.", "🏞️"),
  q("Which is a positive impact of electricity for people?", "it powers lights, heat and hospitals", ["it makes winter longer", "it stops all noise", "it replaces sleep"], "Electricity is used in homes, schools, farms and businesses.", "🏥"),
  q("What happens in a power outage during a prairie winter?", "homes can lose heat and light", ["the cold goes away", "snow stops falling", "batteries stop working in flashlights"], "People plan for outages with blankets, flashlights and a safe heat source.", "🥶"),
  q("What is the unit used to measure how much electricity a home uses?", "kilowatt hours", ["kilometres per hour", "litres", "kilograms"], "Electricity bills are based on kilowatt hours (kWh).", "🧾"),
  q("Which action saves electricity at home?", "turning off lights in empty rooms", ["leaving the fridge door open", "using more lamps", "running a fan with no one there"], "Using less electricity lowers the bill and the impact on the environment.", "💡"),
  q("LED bulbs are better than old incandescent bulbs because they…", "give the same light using much less electricity", ["use more electricity", "cannot be switched off", "need to be burned"], "An LED turns less of the energy into wasted heat.", "🔆"),
  q("Why does it help to wear a sweater and turn the heat down a little?", "less energy is used for heating", ["more energy is made", "the house gets colder in summer", "it increases the bill"], "Heating a home takes a lot of energy in a Saskatchewan winter.", "🧥"),
  q("Why do people plug block heaters into outlets for cars on very cold nights?", "to keep the engine warm enough to start", ["to make the car faster", "to charge the radio", "to make the snow melt"], "Many prairie drivers use a block heater with a timer to save electricity.", "🚗"),
  q("Why is a timer on a block heater a good idea?", "the heater only runs for the hours it is needed", ["it makes the car colder", "it uses more energy", "it speeds the engine up"], "A timer avoids heating all night when it is not needed.", "⏰"),
  q("Which of these is an economic impact of electricity use?", "families and businesses pay for the electricity they use", ["it makes the Sun hotter", "it changes the weather", "it grows trees"], "The cost of power matters to households, farms and industry.", "💰"),
  q("Potash mines in Saskatchewan use a lot of electricity. What does that show?", "industry depends on a steady supply of power", ["mines make wind", "potash makes electricity", "mines never need power"], "Large machines, pumps and elevators run on electricity.", "⛏️"),
  q("Which energy source makes electricity without burning a fuel?", "wind", ["coal", "natural gas", "wood in a boiler"], "Turbines turn in the wind with no burning.", "💨"),
  q("A family wants to cut its electricity use. Which is the best first step?", "find which devices use the most and switch off the ones not needed", ["buy more devices", "leave everything on", "stop using a fridge in a hot summer"], "Knowing where electricity goes helps people make a plan.", "📋"),
  hq("Why does SaskPower use a mix of sources and not just one?", "a mix keeps power steady when one source is low", ["one source is always enough", "mixing makes wind stronger", "rules say no more than one"], "Wind and sun change from day to day, while hydro and fuel plants can add steady power.", "🔁"),
  hq("A cloudy, calm week reduces solar and wind power. What helps keep the lights on?", "other sources such as hydro, gas or coal", ["turning off all the dams", "more clouds", "ignoring the problem"], "A balanced supply covers the gaps.", "🔋"),
  hq("Why would a farm in Saskatchewan consider adding solar panels?", "to lower its power bill and use a renewable source", ["to stop the wind", "to grow potash", "to make rain"], "Solar panels can lower the electricity a farm must buy.", "🌾"),
  hq("Which action would reduce the impact of electricity use the most over a year?", "using less electricity every day", ["buying a larger TV", "using more light bulbs", "only saving on one day"], "Small habits repeated each day add up to a big effect.", "📆"),
  hq("A town debates a new wind farm. Which concern could neighbours raise?", "the look of the turbines and the noise they make", ["the wind will stop blowing", "turbines use up the sunlight", "wind makes coal"], "Weighing benefits and concerns helps communities decide.", "🗣️"),
  hq("Some northern communities are far from the main power grid. What is one way they can get power?", "local diesel generators, solar panels or small hydro", ["a power line to every hill", "moon light", "batteries that never run out"], "Remote places use local sources when the grid is far away.", "🏘️"),
];

export const units: Unit[] = [
  {
    id: "sk-electricity-use",
    title: "Electricity Use in Saskatchewan",
    emoji: "⚡",
    blurb: "Where our power comes from and how to use less",
    standards: { "ca-sk": sk("EL6.1", "personal, societal, economic and environmental impacts of electricity use in Saskatchewan, energy sources and ways to conserve electricity") },
    parentNote: "Where Saskatchewan's electricity comes from (coal, natural gas, hydro such as Gardiner Dam, wind, solar), renewable and non-renewable sources, how electricity use affects people, costs and the environment, and everyday ways to save electricity.",
    generate: bankUnit(ELECTRICITY, { sorts: [SOURCE_SORT, SAVE_SORT], orders: [HYDRO_ORDER] }),
  },
];
