import { bankUnit, type Q } from "../own";

// Grade 5 social studies, Nova Scotia: how First Nations and Inuit societies made decisions, and how Indigenous
// peoples, the French and the British met in what later became Atlantic Canada. Indigenous content is light, in the
// present tense for living communities, and needs partner review.

const DECIDE: Q[] = [
  ["The Mi’kmaq are the First People of which territory?", "Mi’kma’ki", ["Nunatsiavut", "Rupert’s Land"], "Mi’kma’ki is the Mi’kmaw name for their territory, which includes what is now Nova Scotia."],
  ["Long before Europeans arrived, the Mi’kmaq governed Mi’kma’ki through a council called the…", "Grand Council", ["Legislative Assembly", "School Board"], "The Grand Council is called Sante’ Mawio’mi in Mi’kmaw."],
  ["What is the Mi’kmaw name for the Grand Council?", "Sante’ Mawio’mi", ["Netukulimk", "Mi’kma’ki"], "Sante’ Mawio’mi is the Grand Council. Netukulimk is a way of caring for the land and sea."],
  ["When people talk until everyone can agree on a decision, they are using…", "consensus", ["a vote", "a coin toss"], "Consensus means finding an answer that the whole group can accept."],
  ["In a vote, what usually decides the result?", "the choice with the most votes", ["whoever speaks first", "the oldest person only"], "Voting counts the choices. Consensus keeps talking until the group agrees."],
  ["How is consensus different from voting?", "The group keeps talking until it agrees", ["The group picks the choice with the most hands", "One person decides for everyone"], "With consensus, people look for an answer that everyone can live with."],
  ["Who are Elders in many Indigenous communities?", "respected people who hold knowledge and wisdom", ["children learning to read", "visitors from far away"], "Elders share teachings, stories and guidance with the community."],
  ["Why do many communities listen closely to Elders when making decisions?", "Elders hold knowledge from many years", ["Elders are always the youngest", "Elders are paid to vote"], "Knowledge passed down over a long time helps people decide wisely."],
  ["Before Europeans arrived, where did the Mi’kmaq often spend the summers?", "near the coast", ["high in the mountains", "far north on the ice"], "Summers by the coast meant fishing, shellfish and gathering."],
  ["Where did the Mi’kmaq often spend the winters?", "inland, in sheltered places", ["on open ocean beaches", "on boats at sea"], "Inland winter camps were closer to forests and animals such as moose."],
  ["Moving with the seasons helped Mi’kmaw families to…", "use food and materials when they were plentiful", ["avoid ever seeing neighbours", "stay in one spot all year"], "Different foods are available at different times of year."],
  ["Many First Nations and Inuit communities share resources so that…", "everyone in the community has enough", ["only the strongest people eat", "nothing is ever caught"], "Sharing food and materials helped communities stay healthy."],
  ["Which Inuit region is in the northern part of Newfoundland and Labrador?", "Nunatsiavut", ["Mi’kma’ki", "Cape Breton"], "Nunatsiavut means “our beautiful land” in Inuktitut."],
  ["Inuit in Nunatsiavut are known to rely on Elders and…", "family groups when making decisions", ["a single king", "a school principal"], "Families and Elders have long guided choices about hunting and travel.", true],
  ["For Inuit, why were shared decisions about hunting important?", "Food had to be found and shared safely", ["Hunting was only a game", "Each person hunted alone and told no one"], "In a harsh climate, hunters planned and shared so that everyone ate.", true],
  ["A community leader in a council usually…", "listens to others and helps the group reach agreement", ["decides alone and ends the talking", "never speaks in meetings"], "Good leaders help people hear one another.", true],
  ["Which statement about Mi’kmaw governance today is best?", "Many Mi’kmaw communities still have chiefs, councils and Elders", ["It ended and nobody practises it now", "Only one person in the world takes part"], "Mi’kmaw communities are living communities with leaders and traditions today.", true],
  ["Why might a group choose consensus over a quick vote?", "So that no one feels left out of the decision", ["Because it always takes less time", "Because nobody needs to talk"], "Consensus can take longer, but it helps people feel heard.", true],
  ["Which is an example of sharing a resource in a community?", "dividing a big catch of fish among families", ["hiding food from neighbours", "throwing extra food away"], "Sharing is a way of caring for everyone in the group.", true],
  ["What is a council?", "a group that meets to talk and make decisions", ["a type of boat", "a kind of food"], "Many communities use councils to make choices together."],
  ["Netukulimk is the Mi’kmaw way of…", "taking what is needed from the land and sea in a way that sustains it", ["taking as much as possible", "keeping out all visitors"], "It helps keep the land and sea healthy for the future."],
  ["Inuit homelands include…", "parts of the far north, including Nunatsiavut", ["only Prince Edward Island", "only southern Ontario"], "Inuit have lived in the Arctic and northern Labrador for a very long time."],
  ["Why is it important to listen when others speak in a group decision?", "everyone’s ideas matter", ["only loud voices matter", "talking is a waste of time"], "Listening helps a group choose well."],
  ["A good group decision thinks about…", "what everyone in the group needs", ["only one person’s wish", "nothing at all"], "Fair decisions care about the whole group."],
  ["A group votes 6 to 4. What decision method was used?", "a majority vote", ["consensus", "a coin toss"], "In a vote, the choice with more votes wins.", true],
  ["Oral tradition means teachings are passed on by…", "telling and speaking", ["only writing", "only text messages"], "Stories and knowledge are shared by telling them to the next generation.", true],
  ["Which is a strength of voting?", "it can be quick when there are many people", ["it always makes everyone agree", "it needs no counting"], "Voting can settle a choice fast, but some may disagree.", true],
];

const MEET: Q[] = [
  ["Which European country built the settlement of Port-Royal, begun in 1605?", "France", ["Spain", "Germany"], "Port-Royal was a French settlement in what is now Nova Scotia."],
  ["Port-Royal was started by the French in which year?", "1605", ["1749", "1867"], "Port-Royal began in 1605 and was one of the first European settlements in the region."],
  ["Which people already lived in Mi’kma’ki when the French arrived at Port-Royal?", "the Mi’kmaq", ["the Vikings", "the Loyalists"], "The Mi’kmaq had lived here for thousands of years."],
  ["The French and the Mi’kmaq at Port-Royal often…", "traded and cooperated", ["refused to meet", "built no homes at all"], "Furs, food and tools were traded, and people helped one another."],
  ["The French settlers who made their homes in the region became known as…", "Acadians", ["Loyalists", "Vikings"], "The name Acadian comes from Acadia, the French name for the region."],
  ["Acadians and the Mi’kmaq lived near each other and…", "traded and shared knowledge", ["never spoke to each other", "fought every day"], "Many Acadians and Mi’kmaq had friendly relationships."],
  ["France and Britain both wanted control of the region because…", "it had good land, fish and trade routes", ["it had no people", "it was too small to see"], "Rivalry between the two countries shaped the history of Atlantic Canada."],
  ["Louisbourg was a large fortress built by which country?", "France", ["Britain", "Portugal"], "Louisbourg was a French fortified town."],
  ["Where is Louisbourg?", "on Cape Breton Island", ["on Prince Edward Island", "in Labrador"], "Louisbourg is on the eastern coast of Cape Breton Island."],
  ["Why did the French build Louisbourg as a fortress?", "to protect their fishing and trade", ["to grow wheat only", "to hide from the Mi’kmaq"], "A fortress helped protect an important place for fishing and trade."],
  ["The city of Halifax was founded by the British in which year?", "1749", ["1605", "1917"], "The British founded Halifax in 1749."],
  ["What were the Peace and Friendship Treaties?", "agreements between the Mi’kmaq and the British Crown", ["rules for building ships", "maps of the ocean"], "The treaties were signed between 1725 and 1779."],
  ["In which years were the Peace and Friendship Treaties made?", "1725 to 1779", ["1605 to 1620", "1900 to 1950"], "They were made over many years in the 1700s."],
  ["The Peace and Friendship Treaties were about…", "peace, trade and how to live side by side", ["moving all Mi’kmaq away", "ending all fishing forever"], "Treaties are agreements about how people will live together."],
  ["The Expulsion of the Acadians began in which year?", "1755", ["1605", "1867"], "Thousands of Acadians were forced from their homes starting in 1755.", true],
  ["What happened to many Acadians during the Expulsion?", "They were forced to leave their homes", ["They were given new houses", "They were asked to vote"], "Families were separated, and many were sent far away.", true],
  ["Many Mi’kmaw people understand the treaties as agreements to share the land rather than to…", "give it away", ["trade for fish", "build roads"], "Different groups can understand the same agreement in different ways.", true],
  ["Why is it helpful to look at how each group saw the land?", "People may see the same event in different ways", ["So everyone agrees on every detail", "So we can forget the past"], "Listening to many views gives a fuller story.", true],
  ["An archaeologist learns about the past by studying…", "objects and sites left behind", ["only today’s newspapers", "weather forecasts"], "Tools, pottery and building remains are called artifacts and evidence.", true],
  ["Which of these is a written record?", "a letter or journal from the 1700s", ["a stone arrowhead", "a shell necklace"], "Written records are documents that people wrote at the time.", true],
  ["You can visit the Fortress of Louisbourg today. It is a…", "National Historic Site", ["volcano park", "shopping mall"], "Visitors can learn about life in the 1700s there."],
  ["Acadian farmers used dykes to hold back the tides of the Bay of Fundy and make…", "farmland", ["ice rinks", "harbours"], "The dyked marshland grew rich crops."],
  ["Treaty Day in Nova Scotia is on…", "1 October", ["1 July", "6 December"], "It reminds us of the treaties between the Mi’kmaq and the Crown."],
  ["At Port-Royal, Mi’kmaw hunters traded furs for…", "metal tools and cloth", ["computers", "plastic toys"], "Both sides wanted goods the other had."],
  ["Halifax was founded in 1749 to be a British…", "military and naval base", ["wheat farm", "school"], "It had a deep harbour that suited warships.", true],
  ["After the Expulsion, some Acadians came back to Nova Scotia. Acadian communities today include…", "Clare and Chéticamp", ["Calgary and Regina", "Victoria and Kelowna"], "Acadian culture is alive in parts of Nova Scotia.", true],
  ["Why is a diary from the 1700s useful to historians?", "it shows what one person saw and thought", ["it proves every view", "it is always correct"], "A diary is one person’s view, so we compare it with others.", true],
];

export const decisionMaking = bankUnit({
  id: "ns-decision-making-5",
  title: "Deciding Together",
  emoji: "🤝",
  blurb: "How did people decide things together long ago, and how do they now?",
  parentNote:
    "Practises how First Nations and Inuit societies in what later became Atlantic Canada made decisions, including Mi’kmaw governance, consensus and the role of Elders. Content is light, in the present tense, and will be reviewed with community partners.",
  standards: [
    "Investigate decision-making practices in First Nations and Inuit societies in what later became Atlantic Canada",
    "how Mi’kmaw and Inuit communities decide together: Elders, consensus, sharing and the seasons",
  ],
  items: DECIDE,
});

export const atlanticInteractions = bankUnit({
  id: "ns-atlantic-interactions-5",
  title: "Meeting in Atlantic Canada",
  emoji: "⛵",
  blurb: "How did the Mi’kmaq, the French and the British meet and live side by side?",
  parentNote:
    "Practises how British, French, First Nations and Inuit peoples interacted in what later became Atlantic Canada: trade, rivalry, the Peace and Friendship Treaties, and the Expulsion of the Acadians. Questions are neutral and factual, and show that groups saw events differently.",
  standards: [
    "Analyse interactions between British and French and First Nations and Inuit in what later became Atlantic Canada",
    "trade, treaties, rivalry and the Acadians, seen from more than one point of view",
  ],
  items: MEET,
});
