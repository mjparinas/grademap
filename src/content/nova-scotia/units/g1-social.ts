import { bankUnit, type Q } from "../own";

// Grade 1 social studies: Mi'kmaw communities in Nova Scotia (light, present tense, needs partner review) and
// needs and wants.

const MIKMAW: Q[] = [
  ["Who are the First People of this land, Mi’kma’ki?", "the Mi’kmaq", ["the Vikings", "the astronauts"], "Mi’kma’ki is the Mi’kmaw name for their homeland."],
  ["Which word names the Mi’kmaw homeland?", "Mi’kma’ki", ["Halifax", "Canada Day"], "Mi’kma’ki includes Nova Scotia and nearby lands."],
  ["Are there Mi’kmaw communities in Nova Scotia today?", "yes", ["no", "only long ago"], "Mi’kmaw people live in Nova Scotia now."],
  ["How many Mi’kmaw communities are in Nova Scotia?", "13", ["2", "100"], "There are thirteen communities across the province."],
  ["The Mi’kmaq have a language. Do people speak it today?", "yes", ["no", "only in books"], "Mi’kmaw is spoken today, and children learn it in school."],
  ["Which island has Eskasoni?", "Cape Breton Island", ["Prince Edward Island", "Sable Island"], "Eskasoni is a Mi’kmaw community on Cape Breton Island."],
  ["Is Membertou on Cape Breton Island?", "yes", ["no", "only in Halifax"], "Membertou is a Mi’kmaw community in Sydney."],
  ["Nova Scotia is almost an island. We call it a…", "peninsula", ["volcano", "desert"], "A peninsula has water on almost all sides."],
  ["Cape Breton is surrounded by water. It is an…", "island", ["peninsula", "mountain"], "An island has water all around it."],
  ["A map is a picture of…", "a place from above", ["a person's face", "a dream"], "Maps help us find places."],
  ["On a map, blue usually shows…", "water", ["forests", "roads only"], "Lakes, rivers and oceans are blue."],
  ["Which direction is up on most maps?", "north", ["south", "west"], "North is at the top."],
  ["Many Mi’kmaw communities are near…", "the coast, rivers or towns", ["only deserts", "only space"], "People often live near water."],
  ["Millbrook is a Mi’kmaw community near which town?", "Truro", ["Sydney", "Yarmouth"], "Millbrook is close to Truro."],
  ["Mi’kmaw communities have…", "schools and businesses", ["no buildings", "only tents"], "They are modern communities with many kinds of work.", true],
  ["Sipekne’katik is a Mi’kmaw community. Another name for it is…", "Indian Brook", ["Cape Breton", "Halifax"], "Sipekne’katik is also called Indian Brook.", true],
  ["Which sea is next to Nova Scotia?", "the Atlantic Ocean", ["the Pacific Ocean", "the Arctic Ocean"], "Nova Scotia is on Canada's east coast.", true],
  ["To find a community on a map, we can look at the map's…", "key or labels", ["colour of the paper", "page number"], "Labels name the places.", true],
  ["Why is it good to learn about Mi’kmaw communities?", "to respect our neighbours", ["to tease others", "to forget them"], "Learning helps us be kind.", true],
  ["Wagmatcook and Waycobah are Mi’kmaw communities on…", "Cape Breton Island", ["Prince Edward Island", "Newfoundland"], "Several Mi’kmaw communities are on Cape Breton Island.", true],
  ["A compass rose on a map shows…", "directions", ["colours", "the weather"], "It shows north, south, east and west."],
  ["Which direction is at the bottom of most maps?", "south", ["north", "up"], "North is at the top and south is at the bottom."],
  ["Cape Breton Island is part of which province?", "Nova Scotia", ["New Brunswick", "Newfoundland and Labrador"], "Cape Breton Island is in Nova Scotia."],
  ["On a map, a small dot often shows a…", "town or community", ["storm", "sandwich"], "Dots mark places, and labels tell us their names."],
  ["How can we learn about Mi’kmaw communities?", "ask, read and listen with respect", ["make fun of them", "guess without learning"], "Good learners are curious and respectful.", true],
  ["A map's title tells us…", "what the map is about", ["who lost it", "how old it is"], "The title is a clue to what the map shows.", true],
  ["We are guests in Mi’kma’ki. Good guests are…", "respectful", ["rude", "careless"], "We care for the land and the people who live here.", true],
];

export const mikmawCommunities = bankUnit({
  id: "ns-mikmaq-communities-1",
  title: "Mi’kmaw Communities",
  emoji: "🗺️",
  blurb: "Find Mi’kmaw communities on a map of Nova Scotia.",
  parentNote:
    "Practises simple map reading and learning that the Mi’kmaq are the First People of Mi’kma’ki and live in 13 communities in Nova Scotia today. It follows the Grade 1 outcome on the locations of Mi’kmaq communities. The content is light and kept in the present tense.",
  standards: ["Investigate the locations of Mi’kmaq communities in Nova Scotia", "Learn where Mi’kmaw communities are and read simple maps"],
  items: MIKMAW,
});

const NEEDS: Q[] = [
  ["Which one do we need to live and grow?", "food", ["a toy", "a game"], "We need food to live and grow."],
  ["Which is a need we drink every day?", "water", ["candy", "a video game"], "Everyone needs clean water."],
  ["Which one is a want, not a need?", "a toy", ["shelter", "water"], "A toy is fun but we can live without it."],
  ["Which is a want we can live without?", "a treat", ["a home", "clean water"], "We do not need treats to live."],
  ["A need is something we must have to…", "stay alive and healthy", ["have fun", "be the best"], "Needs keep us safe and well."],
  ["A want is something we would…", "like to have", ["die without", "always need"], "Wants are nice, but we can live without them."],
  ["Which is a need that keeps us warm and safe?", "a safe home", ["a new bike", "a pet robot"], "Shelter keeps us warm and safe."],
  ["It is a cold winter day in Nova Scotia. Which is a need?", "a warm coat", ["a new toy", "a sticker"], "A warm coat keeps us from getting too cold."],
  ["Which is a need that comes from the people around us?", "love and care", ["a big toy", "a game"], "Everyone needs people who love them."],
  ["Which is a want and just for fun?", "a game", ["food", "clothes"], "Games are fun but not a need."],
  ["Which is a need for a baby?", "milk", ["a rattle", "a toy bunny"], "Babies need food to grow."],
  ["What do we need to wear to stay warm?", "clothes", ["toys", "candy"], "Clothes keep us warm."],
  ["Which one helps keep us safe?", "a helmet", ["a toy", "candy"], "We wear a helmet when we bike.", true],
  ["You have one cookie and a friend has none. What can you do?", "share", ["hide it", "eat it fast"], "Sharing is kind.", true],
  ["You can pick a coat or a toy before winter. What is the best choice?", "the coat", ["the toy", "neither"], "A coat is a need in the cold.", true],
  ["Can a want ever be fun?", "yes", ["no", "never"], "Wants can be fun but are not needs.", true],
  ["Which is a want and not a need?", "a toy car", ["bread", "water"], "A toy car is a want.", true],
  ["Why do we save money?", "to get things we need or want later", ["to lose it", "to hide it forever"], "Saving helps us buy things later.", true],
  ["Which is a need at night?", "a safe place to sleep", ["a tablet", "a party hat"], "Sleep keeps our bodies healthy."],
  ["Which one is a want?", "a pretty sticker", ["a warm bed", "healthy food"], "A sticker is nice, but we can live without it."],
  ["Which is a need when we feel sick?", "care from a doctor or nurse", ["a new toy", "a movie"], "Health care helps us get better."],
  ["Which is a need for a pet dog?", "food and water", ["a tiny hat", "a squeaky ball"], "Pets need food and water to live."],
  ["Which keeps our hands clean?", "soap and water", ["a toy boat", "a sticker"], "Clean hands help us stay healthy."],
  ["A friend has no mittens in winter. What can you do?", "help find some", ["laugh", "hide yours"], "Helping a friend is kind.", true],
  ["You have some money. What should you spend on first?", "needs", ["wants", "nothing at all"], "Needs come first, then wants.", true],
  ["Why do many grown-ups go to work?", "to earn money for needs", ["to be bored", "to hide"], "Work helps families pay for food and a home.", true],
  ["Boots for walking in snow are a…", "need", ["want", "treat"], "Boots keep feet warm and dry in the snow.", true],
];

export const needsWants = bankUnit({
  id: "ns-needs-wants-1",
  title: "Needs & Wants",
  emoji: "🧥",
  blurb: "Is it something we need, or something we want?",
  parentNote:
    "Practises telling needs (food, water, shelter, clothing, safety, love) from wants (toys, treats, games), with local examples such as a warm coat in a Nova Scotia winter. It follows the Grade 1 outcome on needs and wants.",
  standards: ["Analyse the difference between needs and wants", "Tell needs from wants and choose between two things"],
  items: NEEDS,
});
