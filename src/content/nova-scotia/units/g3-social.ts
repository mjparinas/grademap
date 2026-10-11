import { bankUnit, type Q } from "../own";

// Grade 3 social studies, Nova Scotia: where we live in Atlantic Canada, the cultures of the province and the
// rights and responsibilities of citizens. Indigenous, African Nova Scotian, Acadian and Gaelic content is light,
// factual and in the present tense, and needs partner review.

const ATLANTIC: Q[] = [
  ["Which four provinces make up Atlantic Canada?", "Nova Scotia, New Brunswick, Prince Edward Island, Newfoundland and Labrador", ["Nova Scotia, Quebec, Ontario, Manitoba", "New Brunswick, Quebec, Alberta, Newfoundland and Labrador"], "Atlantic Canada is the group of provinces on the Atlantic coast."],
  ["What is the capital city of Nova Scotia?", "Halifax", ["Fredericton", "Charlottetown"], "Halifax is on the Atlantic coast and is where our provincial government meets."],
  ["What is the capital city of New Brunswick?", "Fredericton", ["Halifax", "St. John’s"], "Fredericton is the capital of our neighbour New Brunswick."],
  ["What is the capital city of Prince Edward Island?", "Charlottetown", ["Fredericton", "Halifax"], "Charlottetown is the capital of Canada’s smallest province."],
  ["What is the capital city of Newfoundland and Labrador?", "St. John’s", ["Charlottetown", "Fredericton"], "St. John’s is the capital of the easternmost province."],
  ["Which ocean is along the coast of Nova Scotia?", "Atlantic Ocean", ["Pacific Ocean", "Arctic Ocean"], "Atlantic Canada is named for the Atlantic Ocean."],
  ["Nova Scotia is a province of which country?", "Canada", ["the United States", "England"], "Nova Scotia is one of Canada’s ten provinces."],
  ["Which province shares a land border with Nova Scotia?", "New Brunswick", ["Prince Edward Island", "Newfoundland and Labrador"], "New Brunswick is the only province you can drive to from Nova Scotia."],
  ["Which narrow strip of land joins Nova Scotia to New Brunswick?", "the Chignecto Isthmus", ["the Canso Causeway", "the Bay of Fundy"], "An isthmus is a thin piece of land with water on both sides that joins two larger areas."],
  ["A narrow stretch of water between two pieces of land is called a…", "a strait", ["a mountain", "a prairie"], "A strait is a narrow stretch of water between two pieces of land."],
  ["Which body of water is between Nova Scotia and Prince Edward Island?", "Northumberland Strait", ["Bay of Fundy", "Hudson Bay"], "The strait runs along Nova Scotia’s northern shore."],
  ["Which bay lies between Nova Scotia and New Brunswick?", "Bay of Fundy", ["Hudson Bay", "Georgian Bay"], "The Bay of Fundy is famous for its very high tides."],
  ["Cape Breton is…", "an island that is part of Nova Scotia", ["a city in New Brunswick", "a lake in Prince Edward Island"], "Cape Breton Island is in the northeast of Nova Scotia."],
  ["Which is a way that Nova Scotia is connected to the rest of Canada by land?", "by road through New Brunswick", ["by a tunnel under the ocean", "by a bridge from Newfoundland"], "The Chignecto Isthmus carries the road and rail to the rest of the country."],
  ["On most maps, which direction is at the top?", "north", ["south", "east"], "North is usually at the top of a map."],
  ["Prince Edward Island is north of Nova Scotia across a strait. Which direction is Nova Scotia from PEI?", "south", ["north", "west"], "If PEI is north of Nova Scotia, Nova Scotia is the opposite way."],
  ["Which of these is a way the ocean helps people in Nova Scotia?", "fishing and shipping", ["growing wheat on the plains", "mining in the mountains"], "Boats catch seafood and carry goods to and from ports."],
  ["A place where ships load and unload goods is called a…", "port", ["peak", "prairie"], "Halifax is a busy port on the Atlantic Ocean."],
  ["Which of these seafoods is caught off the coast of Nova Scotia?", "lobster", ["kangaroo", "wheat"], "Lobster is a well-known seafood from Atlantic Canada.", true],
  ["Which part of a map explains what its symbols mean?", "a legend", ["a compass", "a strait"], "A legend, or key, explains the symbols on a map.", true],
  ["Which Atlantic province is made up of an island and a mainland part?", "Newfoundland and Labrador", ["Prince Edward Island", "New Brunswick"], "Newfoundland is an island, and Labrador is on the mainland.", true],
  ["Which large gulf lies north of Prince Edward Island?", "Gulf of St. Lawrence", ["Bay of Fundy", "Lake Ontario"], "A gulf is a large part of the sea that is partly surrounded by land.", true],
  ["Why are many Nova Scotia towns built along the coast?", "The ocean gave people food and a way to travel and trade", ["There is no land inland", "Coasts are always warmer than everywhere else"], "For hundreds of years, boats were the easiest way to get around and to trade.", true],
  ["Which Atlantic province is the smallest?", "Prince Edward Island", ["New Brunswick", "Nova Scotia"], "Prince Edward Island is the smallest province in Canada."],
  ["The Canso Causeway joins Cape Breton Island to…", "the mainland of Nova Scotia", ["Prince Edward Island", "Newfoundland"], "You can drive across it between Cape Breton and the rest of Nova Scotia."],
  ["What does a compass rose on a map show?", "directions", ["prices", "names of people"], "It shows north, south, east and west."],
  ["The Confederation Bridge joins Prince Edward Island to which province?", "New Brunswick", ["Nova Scotia", "Newfoundland and Labrador"], "The bridge crosses the Northumberland Strait to New Brunswick.", true],
  ["Which Atlantic province is farthest east?", "Newfoundland and Labrador", ["New Brunswick", "Nova Scotia"], "It sits farther into the Atlantic than its neighbours.", true],
];

const CULTURES: Q[] = [
  ["Language, music, food, art and stories are all…", "ways that people share their culture", ["kinds of weather", "types of maps"], "These are called expressions of culture."],
  ["Which of these is an expression of culture?", "a traditional song", ["a rainstorm", "a mountain"], "Songs, dances and stories are shared by people in a culture."],
  ["Which is an expression of culture?", "a language", ["a rock", "the tide"], "People who share a language often share stories and songs too."],
  ["The Mi’kmaq are the First People of Nova Scotia. What is the name of their territory?", "Mi’kma’ki", ["Acadia", "Scotland"], "Mi’kma’ki is the Mi’kmaw name for their homeland, which includes Nova Scotia."],
  ["Many Mi’kmaw people today speak and teach which language?", "Mi’kmaw", ["Gaelic", "Latin"], "Mi’kmaw is a living language, taught in some schools and communities."],
  ["Some Mi’kmaw artists make baskets and quillwork. These are…", "expressions of culture", ["kinds of weather", "types of maps"], "Art made by hand is one way a culture is shared."],
  ["Acadians are people whose families have lived in Acadia and the Maritimes for hundreds of years. Which language do many Acadians speak?", "French", ["Gaelic", "Spanish"], "Many Acadian communities in Nova Scotia speak French."],
  ["The Acadian flag has the French tricolour with what extra symbol?", "a gold star", ["a red maple leaf", "a blue whale"], "The gold star is the special symbol on the Acadian flag."],
  ["The Tintamarre is an Acadian celebration where people…", "make lots of noise with pots, horns and drums as they parade", ["sit very quietly in a library", "race sailboats"], "Tintamarre means a happy racket. Families march together on Acadian National Day."],
  ["Gaelic is a language that came to Nova Scotia from…", "Scotland", ["Australia", "Mexico"], "Many Gaelic speakers settled in Cape Breton and other parts of Nova Scotia."],
  ["Cape Breton is well known for which kind of music?", "fiddle music", ["opera", "drum machines"], "Fiddle tunes and step dancing are an important part of Cape Breton culture."],
  ["A ceilidh (KAY-lee) is…", "a gathering with music, dancing and stories", ["a type of boat", "a kind of fish"], "Ceilidhs come from Gaelic tradition and are still held today."],
  ["February is African Heritage Month in Nova Scotia. What do people do?", "learn about and celebrate African Nova Scotian history and culture", ["go sailing on the Bay of Fundy", "close all of the schools"], "Communities share music, stories and history during African Heritage Month."],
  ["African Nova Scotian communities have a long tradition of which kind of music?", "gospel singing", ["bagpipes only", "polka only"], "Gospel choirs are an important part of many African Nova Scotian churches."],
  ["Families from many places around the world also live in Nova Scotia. What does this give our province?", "many languages, foods and celebrations", ["only one way of doing things", "fewer neighbours"], "New communities bring new foods, music and traditions.", true],
  ["Why is it good to learn about other people’s cultures?", "It helps us understand and respect each other", ["It makes everyone act the same", "It means we should keep to ourselves"], "Learning about each other helps us get along and enjoy differences.", true],
  ["Which statement is fair about a culture?", "Many people in a group share traditions, but each person is different", ["Everyone in a group is exactly the same", "A culture never changes"], "We should never think that all people in a group do everything the same way.", true],
  ["Which pairing matches a group with one of its expressions of culture?", "Acadians and the Tintamarre", ["Mi’kmaq and the Tintamarre", "Gaels and the Acadian flag"], "Check that each group goes with its own tradition.", true],
  ["What is the best way to learn about a culture?", "Listen to people from that culture tell about it in their own words", ["Guess from a cartoon", "Decide you already know"], "People are the best experts on their own culture.", true],
  ["Mi’kmaw is a living language. This means people…", "still speak it today", ["only read it in books", "have forgotten it"], "Children and adults learn and speak Mi’kmaw now."],
  ["Bagpipes are an instrument linked to which culture in Nova Scotia?", "Scottish Gaelic", ["Mi’kmaw", "African Nova Scotian"], "Bagpipes came with Scottish settlers and are still played."],
  ["A tradition is…", "a custom passed down in a family or group", ["a new rule each day", "a kind of weather"], "Traditions are shared from one generation to the next."],
  ["Which is a way that food is part of culture?", "sharing a family recipe", ["watching a hailstorm", "reading a map"], "Recipes carry a family’s history and tastes."],
  ["When is Acadian National Day?", "15 August", ["25 December", "1 July"], "Acadians celebrate it with parades and music."],
  ["Chéticamp is a well-known Acadian community on…", "Cape Breton Island", ["Prince Edward Island", "Sable Island"], "French is spoken in Chéticamp, which is known for its music and hooked rugs.", true],
  ["Why do cultures change over time?", "people share and learn new ideas", ["people stop talking", "the sea dries up"], "Cultures keep growing as people meet and learn.", true],
  ["Someone says, 'Everyone in one culture likes the same music.' What is wrong with that?", "people in a group are all different", ["nothing, it is always true", "music has no culture"], "Each person has their own tastes.", true],
];

const DEMOCRACY: Q[] = [
  ["In a democracy, how are leaders chosen?", "People vote for them", ["The strongest person decides", "Leaders are picked by chance"], "Voting gives everyone a say in who leads."],
  ["Which of these is a right that children have in Canada?", "to be safe", ["to skip all rules", "to be the boss of others"], "Everyone has the right to be safe and cared for."],
  ["Which is another right children have?", "to go to school", ["to stay up all night every night", "to take whatever they want"], "In Canada, children have the right to learn."],
  ["A responsibility is…", "something we should do", ["something we get for free", "a type of prize"], "Rights and responsibilities go together."],
  ["Which is a responsibility of a good citizen?", "following rules", ["breaking rules", "ignoring others"], "Following rules helps everyone get along."],
  ["Which is a responsibility at school?", "treating others with respect", ["leaving a mess", "calling people names"], "Respect makes school a good place for everyone."],
  ["Who is the leader of a town or city?", "the mayor", ["the Prime Minister", "the Premier"], "A mayor leads a town or city."],
  ["Who is the leader of the government of Nova Scotia?", "the Premier", ["the mayor", "the Prime Minister"], "A Premier leads a province."],
  ["Who is the leader of the Government of Canada?", "the Prime Minister", ["the mayor", "the Premier"], "The Prime Minister leads the country."],
  ["Adults in Canada have the right to do what in elections?", "vote", ["skip paying all taxes", "make their own laws alone"], "Voting is how citizens choose leaders."],
  ["Why do we have rules and laws?", "to keep people safe and treat them fairly", ["to stop people from having fun", "to make life harder"], "Good rules protect everyone."],
  ["A class cannot agree on a game. What is a fair way to decide?", "talk about it, then vote", ["let the loudest person pick", "never play"], "Voting gives everyone a say."],
  ["Which of these is fair?", "everyone gets a turn", ["the same person always goes first", "only friends get a turn"], "Fairness means treating people in a way that is just."],
  ["Which is a way to help your community?", "pick up litter at a park", ["throw garbage on the ground", "ignore a neighbour who needs help"], "Helping out is a responsibility for all citizens."],
  ["A new playground rule is made after the whole class talks and votes. Which idea does this show?", "democracy", ["rule by one person", "a game with no rules"], "In a democracy, people share in decisions.", true],
  ["When you disagree with a friend, what is a good first step?", "listen to each other and try to find a solution", ["shout until they give in", "stop talking to everyone"], "Solving problems with words is part of being a good citizen.", true],
  ["Which pair shows a right and a matching responsibility?", "the right to be heard and the responsibility to listen to others", ["the right to be heard and the right to ignore everyone", "the right to play and no rules at all"], "Rights work best when everyone respects other people’s rights too.", true],
  ["Why is voting important in a democracy?", "It lets people choose leaders and have a say", ["It means only one person decides", "It is a way to avoid rules"], "Votes are how citizens speak up.", true],
  ["Which level of government makes laws for the whole country?", "the federal government", ["the town council", "the school council"], "The federal government meets in Ottawa.", true],
  ["What is a ballot?", "a paper used to vote", ["a type of dance", "a soccer ball"], "People mark their choice on a ballot."],
  ["Where does the Nova Scotia government meet?", "Halifax", ["Sydney", "Ottawa"], "The provincial legislature meets at Province House in Halifax."],
  ["Where does the Government of Canada meet?", "Ottawa", ["Halifax", "Toronto"], "Ottawa is Canada’s capital city."],
  ["A classmate is left out at recess. A good citizen would…", "invite them to join", ["laugh at them", "walk away"], "Including others builds a kind community."],
  ["Which is a responsibility at home?", "helping with chores", ["breaking things", "hiding from everyone"], "Everyone in a family can pitch in."],
  ["In Canada, how old must a person be to vote in an election?", "18", ["8", "30"], "People who are 18 or older and are citizens can vote.", true],
  ["Why should rules apply to everyone?", "so it is fair for all", ["so some people can break them", "so no one has to follow them"], "Fair rules treat people equally.", true],
  ["In a class vote, 3 of 5 students want soccer and 2 want tag. What does the class choose?", "soccer", ["tag", "neither"], "In most votes the choice with more votes wins.", true],
];

export const atlanticCanada = bankUnit({
  id: "ns-atlantic-canada-3",
  title: "Nova Scotia in Atlantic Canada",
  emoji: "🗺️",
  blurb: "Find Nova Scotia and its neighbours on the map.",
  parentNote:
    "Practises where Nova Scotia is in Atlantic Canada: the four provinces and capitals, nearby waters, directions and why the ocean matters. It follows the Grade 3 Nova Scotia social studies outcome on the location of Nova Scotia.",
  standards: ["Investigate the location of Nova Scotia in Atlantic Canada", "Atlantic provinces, capitals, waters and map directions"],
  items: ATLANTIC,
});

export const cultures = bankUnit({
  id: "ns-cultures-3",
  title: "Cultures of Nova Scotia",
  emoji: "🎶",
  blurb: "Songs, stories, food and fun from the people of Nova Scotia.",
  parentNote:
    "Practises how groups in Nova Scotia, including the Mi’kmaq, Acadians, African Nova Scotians and Gaels, share their cultures. It follows the Grade 3 Nova Scotia social studies outcome on expressions of culture. Content about First Nations is light and written for partner review.",
  standards: ["Investigate various groups through their expressions of culture", "language, music, art and celebrations of cultures in Nova Scotia"],
  items: CULTURES,
});

export const democracy = bankUnit({
  id: "ns-democracy-3",
  title: "Rights & Responsibilities",
  emoji: "🗳️",
  blurb: "What it means to be a good citizen.",
  parentNote:
    "Practises the rights and responsibilities of citizens in a democracy: voting, fair rules, local and national leaders, and solving problems together. It follows the Grade 3 Nova Scotia social studies outcome on citizenship.",
  standards: ["Investigate the rights and responsibilities of citizens in a democracy", "rights, responsibilities, leaders, rules and voting"],
  items: DEMOCRACY,
});
