import { bankUnit, type Q } from "../own";

// Grade 6 social studies, New Brunswick: the Atlantic region, its places and its economy.

const REGION: Q[] = [
  ["Which four provinces make up the Atlantic region?", "New Brunswick, Nova Scotia, Prince Edward Island, and Newfoundland and Labrador", ["New Brunswick, Quebec, Ontario and Manitoba", "Nova Scotia, Ontario, Alberta and Yukon", "Prince Edward Island, Quebec, Nunavut and Alberta"], "The Atlantic provinces all border the Atlantic Ocean."],
  ["Which three provinces are the Maritimes?", "New Brunswick, Nova Scotia and Prince Edward Island", ["New Brunswick, Quebec and Ontario", "Newfoundland and Labrador, Quebec and Ontario", "Manitoba, Saskatchewan and Alberta"], "Newfoundland and Labrador is Atlantic but not in the Maritimes."],
  ["What is the capital of Newfoundland and Labrador?", "St. John’s", ["Halifax", "Charlottetown", "Fredericton"], "St. John’s is one of the oldest cities in North America."],
  ["What is the capital of Nova Scotia?", "Halifax", ["Charlottetown", "St. John’s", "Fredericton"], "Halifax has a large harbour."],
  ["What is the capital of Prince Edward Island?", "Charlottetown", ["Halifax", "Fredericton", "St. John’s"], "The Charlottetown Conference of 1864 was an early step to Confederation."],
  ["Which Atlantic province is the only one that is entirely an island?", "Prince Edward Island", ["Nova Scotia", "New Brunswick", "Labrador"], "Newfoundland and Labrador has an island part and a mainland part."],
  ["Which part of Newfoundland and Labrador is on the mainland?", "Labrador", ["Cape Breton", "Grand Manan", "Gaspé"], "Labrador borders Quebec."],
  ["Which strait lies between Prince Edward Island and New Brunswick and Nova Scotia?", "the Northumberland Strait", ["the Strait of Georgia", "the Hudson Strait", "Davis Strait"], "The Confederation Bridge crosses it."],
  ["The Appalachian Mountains cross which region of Canada?", "the Atlantic region", ["the Prairies", "the Arctic", "British Columbia"], "They are old, worn mountains."],
  ["Which ocean current brings cold water to the coast of Newfoundland and Labrador?", "the Labrador Current", ["the Gulf Stream", "the Pacific Current", "the Equator Current"], "Where it meets warm water, fog often forms."],
  ["Why is there often fog in the Atlantic region?", "Warm and cold air and water meet over the ocean", ["The sun is hotter there", "There are no clouds there", "Rivers freeze all year"], "Fog forms when moist air cools."],
  ["Compared with the middle of Canada, the weather on the Atlantic coast is usually…", "milder because of the ocean", ["much hotter", "always dry", "frozen all year"], "Large bodies of water change nearby temperatures."],
  ["Which bay is famous for the highest tides in the world?", "the Bay of Fundy", ["Hudson Bay", "Georgian Bay", "Placentia Bay"], "Tides rise and fall by more than ten metres."],
  ["Which cultural groups have helped shape the Atlantic region?", "Wabanaki Peoples, Acadians, Black communities, British, Irish and Scottish settlers, and newcomers", ["only one group", "no groups", "only people from far away"], "Many groups have made the region what it is today."],
  ["Which language group is found in Atlantic Canada besides English and French?", "Mi’kmaw", ["Latin", "Japanese", "Greek"], "Mi’kmaw is spoken in many communities in the region.", true],
  ["Which Atlantic province is Canada’s only officially bilingual province?", "New Brunswick", ["Nova Scotia", "Prince Edward Island", "Newfoundland and Labrador"], "Both English and French are official languages."],
  ["Which Atlantic city has a famous port and is New Brunswick’s oldest incorporated city?", "Saint John", ["Moncton", "Bathurst", "Edmundston"], "Saint John was incorporated in 1785.", true],
  ["On a map, which direction is the Atlantic region from the Prairies?", "east", ["west", "north", "south"], "The Atlantic region is on Canada’s east coast."],
  ["On a map, what does a scale bar help you find?", "the real distance between places", ["the age of a city", "the direction of the wind", "the weather"], "A scale shows how map distances match real distances."],
  ["Which type of map shows mountains and rivers?", "a physical map", ["a political map", "a weather chart", "a bar graph"], "Political maps show borders."],
  ["Which type of map shows borders between provinces?", "a political map", ["a physical map", "a population graph", "a tide chart"], "Provinces and capitals are shown on political maps."],
  ["What can you learn from a population map?", "where more or fewer people live", ["how deep the ocean is", "how tall the trees are", "when a holiday is"], "Cities appear as dense areas on population maps."],
  ["Most people in the Atlantic region live…", "near the coast", ["in the middle of the ocean", "only on mountain peaks", "in the desert"], "Many cities and towns are on bays and harbours.", true],
  ["How might fog affect people who work at sea?", "It can make it harder and less safe to see", ["It makes the sea warmer", "It makes boats faster", "It has no effect"], "Fishers rely on radar, charts and weather reports.", true],
  ["Which two bodies of water border New Brunswick to the north and south?", "Chaleur Bay and the Bay of Fundy", ["Hudson Bay and James Bay", "Lake Erie and Lake Huron", "Georgian Bay and the Arctic Ocean"], "Both open to the Atlantic.", true],
];

const ECONOMY: Q[] = [
  ["What is an economy?", "the way people make, trade and use goods and services", ["a kind of bank", "a type of weather", "a school subject"], "An economy includes jobs, businesses and trade."],
  ["Which of these is a natural resource of the Atlantic region?", "fish", ["rice", "bananas", "coffee"], "Lobster, crab and fish are important."],
  ["Which seafood is a major export from the Atlantic region?", "lobster", ["tuna from the Pacific", "saltwater crocodile", "shrimp from the tropics"], "Lobster is caught in cold Atlantic waters."],
  ["Why did the cod fishery in Newfoundland and Labrador close in 1992?", "There were too few cod left", ["There was too much cod", "People stopped liking fish", "The ocean dried up"], "A moratorium (pause) was put in place so cod could recover."],
  ["Which industry uses the forests of New Brunswick?", "forestry", ["pearl diving", "oil drilling only", "gold mining only"], "Lumber and paper are made from trees."],
  ["Which crop is a major crop on Prince Edward Island?", "potatoes", ["bananas", "coffee", "tea"], "PEI’s red soil is great for potatoes."],
  ["What is a primary industry?", "an industry that gets natural resources, like fishing or farming", ["an industry that makes toys", "an industry that sells items", "an industry that teaches"], "Primary industries include farming, forestry, mining and fishing."],
  ["What is a manufacturing (secondary) industry?", "an industry that makes products from raw materials", ["an industry that grows food", "an industry that guards forests", "an industry that sells tickets"], "A sawmill turns logs into lumber."],
  ["What is a service industry?", "a business that does things for people, like tourism or health care", ["a business that mines salt", "a business that grows wheat", "a factory"], "Teachers, nurses and tourism workers are in service industries."],
  ["Tourism is important in the Atlantic region because people visit to see…", "coasts, history and culture", ["deserts", "volcanoes", "rainforests"], "Visitors come for the sea, music and festivals."],
  ["Which famous trail is a popular driving route in Nova Scotia?", "the Cabot Trail", ["the Trans-Canada Highway only", "the Silk Road", "Route 66"], "It circles northern Cape Breton Island."],
  ["Which famous bridge links New Brunswick and Prince Edward Island?", "the Confederation Bridge", ["the Golden Gate Bridge", "the Brooklyn Bridge", "Tower Bridge"], "It is nearly 13 kilometres long."],
  ["What do the words import and export mean?", "bring goods in and send goods out", ["make goods and break goods", "buy goods and burn goods", "sell goods only to neighbours"], "Countries and provinces trade goods."],
  ["Why do places trade with each other?", "Each place has resources or products others need", ["Everything is the same everywhere", "Trade is against the law", "To avoid money"], "Trade lets people get things they cannot make."],
  ["Saint John is an important port because…", "ships can load and unload goods there", ["it has no water", "it is far inland", "it is on a desert"], "Ports connect provinces to global markets."],
  ["Which of these is a problem some Atlantic communities face?", "fewer young people staying because of fewer jobs", ["too many mountains", "no ocean", "no winters"], "Some rural places have lost jobs when industries changed."],
  ["What does sustainable mean in fishing?", "taking fish in a way that lets populations recover", ["catching every fish", "never fishing at all", "using bigger nets each year"], "Quotas and seasons help protect fish."],
  ["A quota in fishing is…", "a limit on how much can be caught", ["a type of fishing boat", "a kind of net", "a sea creature"], "Quotas protect fish populations."],
  ["Which renewable energy can be made from the Bay of Fundy’s tides?", "tidal power", ["coal power", "natural gas power", "oil power"], "Turbines are tested in the Bay of Fundy.", true],
  ["Why is aquaculture (fish farming) growing in the Atlantic region?", "It provides food and jobs while wild fish are limited", ["Wild fish are unlimited", "Farms use no water", "It makes oceans bigger"], "Salmon and mussels are raised in coastal waters.", true],
  ["What is a global market?", "a place where goods are bought and sold around the world", ["a kind of grocery store", "a local fair only", "a school"], "Goods from the Atlantic region are sold to many countries."],
  ["Which country buys many of the Atlantic region’s exports?", "the United States", ["Antarctica", "the Vatican", "Greenland"], "Canada’s biggest trade partner is the United States.", true],
  ["A decision about the economy can affect…", "jobs, prices and communities", ["only the weather", "only animals", "nothing"], "Choices about resources can change many lives."],
  ["Why do some people leave small Atlantic communities for bigger cities?", "to find work", ["to avoid the ocean", "to escape the snow only", "to find fewer people"], "Changes in industries can make people move.", true],
];

export const atlanticRegion = bankUnit({
  id: "nb-atlantic-region-6",
  title: "The Atlantic Region",
  emoji: "🧭",
  blurb: "Provinces, coasts, weather and people.",
  parentNote:
    "Practises where the Atlantic region is, its physical features and weather, and the cultural, ethnic and linguistic groups who live there. It follows the Grade 6 social studies skill descriptors on geography in the New Brunswick curriculum.",
  standards: ["Geography: Methods and Tools, Geography: Human Systems and Interactions", "locating the Atlantic region, its physical features and weather, and its cultural groups"],
  items: REGION,
});

export const atlanticEconomy = bankUnit({
  id: "nb-atlantic-economy-6",
  title: "Working in the Atlantic Region",
  emoji: "🐟",
  blurb: "Fishing, farming, forests and trade.",
  parentNote:
    "Practises the role of economics in the Atlantic region, from primary industries to trade and sustainability. It follows the Grade 6 social studies skill descriptors on economics in the New Brunswick curriculum.",
  standards: ["Economics: Systems, Economics: Sustainability", "the role of economics in the Atlantic region, local and global economic patterns, and sustainable resource use"],
  items: ECONOMY,
});
