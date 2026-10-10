import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { levelled, withSort, type Item } from "../ontario/g56-bank";
import { ab } from "./kit";

// Alberta Grade 6 Social Studies: Democracy, its history, principles and operation. Written for the
// Alberta snapshot topics; BC and Ontario social units are not shared because they cover other topics.
// Facts about Athens and Rome are well-established history. The Haudenosaunee unit states only widely
// shared, non-ceremonial facts in the present tense and should be reviewed with Haudenosaunee partners.

// ---------- Principles of democracy ----------

const PRINCIPLES: Item[] = [
  { prompt: "The word democracy comes from the Greek words demos and kratos. What do they mean?", right: "people and power", wrong: ["king and army", "law and court"], hint: "Democracy means rule by the people." },
  { prompt: "In a democracy, who holds the power?", right: "The people", wrong: ["One king", "Only the army"], hint: "Citizens choose their leaders and have a say." },
  { prompt: "What does majority rule mean?", right: "The choice with more than half the votes wins", wrong: ["The loudest person decides", "The leader always decides"], hint: "A majority is more than half." },
  { prompt: "Why should a democracy protect the rights of minorities?", right: "So the majority cannot take away the rights of smaller groups", wrong: ["So minorities always win votes", "So that voting is not needed"], hint: "Everyone's rights count, even when they are outnumbered." },
  { prompt: "What does the rule of law mean?", right: "Everyone, even leaders, must follow the same laws", wrong: ["Leaders may ignore the laws", "Only some people must obey laws"], hint: "No one is above the law." },
  { prompt: "What is a direct democracy?", right: "Citizens vote on decisions themselves", wrong: ["Citizens elect people to decide for them", "One person makes every decision"], hint: "Direct means without anyone in between." },
  { prompt: "What is a representative democracy?", right: "Citizens elect people to make decisions for them", wrong: ["Every citizen votes on every law", "A king chooses the leaders"], hint: "Representatives speak and vote on behalf of the people who elected them." },
  { prompt: "A dictatorship is different from a democracy because…", right: "one person or a small group holds all the power", wrong: ["citizens elect the leader", "the laws apply to everyone equally"], hint: "In a democracy, power is shared with citizens." },
  { prompt: "What is a secret ballot?", right: "A vote that no one else can see", wrong: ["A vote with no candidates", "A vote only leaders can see"], hint: "It lets people vote freely without pressure." },
  { prompt: "Why do democracies hold free and fair elections?", right: "So citizens can choose their leaders and replace them", wrong: ["So leaders can stay forever", "So only one party can run"], hint: "Elections give citizens a way to hold leaders to account." },
  { prompt: "What is a citizen?", right: "A member of a country with rights and responsibilities", wrong: ["A ruler of a country", "A person who has never voted"], hint: "Citizens have a say in how their country is run." },
  { prompt: "Which of these does a democracy NOT have?", right: "Leaders who can never be replaced", wrong: ["Free elections", "Freedom to share your opinion"], hint: "Citizens can vote leaders out." },
  { prompt: "Equality in a democracy means…", right: "every person's vote and rights count equally", wrong: ["wealthy people get more votes", "leaders get extra votes"], hint: "One person, one vote." },
  { prompt: "A class of 24 votes on a topic. What is the smallest number of votes that makes a majority?", right: "13", wrong: ["12", "14", "24"], hint: "A majority is more than half of 24.", hard: true },
  { prompt: "A group makes a decision by consensus. What does that mean?", right: "They talk until everyone can agree", wrong: ["They count votes and the biggest group wins", "One leader decides alone"], hint: "Consensus is agreement, not a count of votes.", hard: true },
  { prompt: "Why is it important that people can disagree peacefully with their leaders?", right: "Problems can be pointed out and leaders can be held to account", wrong: ["Leaders never make mistakes", "Disagreement ends all elections"], hint: "Free speech helps a democracy fix its mistakes.", hard: true },
  { prompt: "A government that is accountable…", right: "has to explain its decisions to the people", wrong: ["keeps its decisions secret", "never has to change"], hint: "Accountable means answerable.", hard: true },
  { prompt: "Which is a risk of majority rule with no protection for minorities?", right: "A group could lose its rights because it has fewer votes", wrong: ["Everyone's rights are protected", "Elections become more fair"], hint: "That is why democracies also have laws that protect rights.", hard: true },
  { prompt: "Which best describes the rule of law in action?", right: "A prime minister must obey the same laws as a student", wrong: ["A prime minister may break the law in secret", "A student's rights depend on their family's money"], hint: "Laws apply to everyone.", hard: true },
];

const PRINCIPLES_SORT: SortSet = {
  prompt: "Direct or representative democracy? Tap an item, then tap its basket.",
  hint: "In direct democracy people decide themselves. In representative democracy they elect people to decide.",
  bins: [
    { id: "direct", label: "Direct", emoji: "🙋" },
    { id: "rep", label: "Representative", emoji: "🏛️" },
  ],
  items: [
    { label: "Class votes by raising hands", emoji: "✋", bin: "direct" },
    { label: "A town votes in a referendum", emoji: "🗳️", bin: "direct" },
    { label: "Athenian Assembly", emoji: "🏺", bin: "direct" },
    { label: "Whole school votes on a school rule", emoji: "🏫", bin: "direct" },
    { label: "Student council", emoji: "🎒", bin: "rep" },
    { label: "A city council", emoji: "🏙️", bin: "rep" },
    { label: "House of Commons", emoji: "🍁", bin: "rep" },
    { label: "Alberta Legislature", emoji: "🏛️", bin: "rep" },
  ],
};

// ---------- Athens ----------

const ATHENS: Item[] = [
  { prompt: "Athens was one of the city-states of which ancient land?", right: "Greece", wrong: ["Rome", "Egypt"], hint: "Ancient Greece was made up of many city-states." },
  { prompt: "What was Athens' kind of government called?", right: "Direct democracy", wrong: ["Rule by one king", "Rule by the army"], hint: "Citizens voted on decisions themselves." },
  { prompt: "Athens' democracy took shape around 500 BCE. Which leader's reforms are often credited with starting it?", right: "Cleisthenes", wrong: ["Julius Caesar", "Cleopatra"], hint: "Cleisthenes is sometimes called the father of Athenian democracy." },
  { prompt: "What was the Assembly in Athens?", right: "A meeting where citizens debated and voted on laws and decisions", wrong: ["A group of kings", "An army camp"], hint: "Any citizen could speak and vote." },
  { prompt: "Who could vote in the Athenian Assembly?", right: "Adult male citizens born to Athenian families", wrong: ["Everyone who lived in Athens", "Only the richest people"], hint: "Many residents were left out." },
  { prompt: "Which people could NOT vote in ancient Athens?", right: "Women, enslaved people and foreigners", wrong: ["Adult male citizens", "Every farmer"], hint: "Athenian democracy was limited." },
  { prompt: "The Athenian Assembly met on a hill called the…", right: "Pnyx", wrong: ["Colosseum", "Nile"], hint: "Citizens gathered outdoors, in the open air." },
  { prompt: "In Athens, many officials were chosen by lot. How was that done?", right: "Names were drawn at random", wrong: ["The strongest person won", "The oldest person always won"], hint: "Drawing lots gave every eligible citizen the same chance." },
  { prompt: "Why did Athenians choose many officials by lot?", right: "They thought it gave everyone an equal chance to serve", wrong: ["They did not trust numbers", "They wanted the same people each year"], hint: "It also stopped rich people from buying positions." },
  { prompt: "What was ostracism in Athens?", right: "Citizens could vote to send a person away for ten years", wrong: ["A yearly festival", "A tax on farmers"], hint: "Votes were written on pieces of broken pottery." },
  { prompt: "Citizens wrote names on pieces of broken pottery to vote in ostracism. What were these pieces called?", right: "Ostraka", wrong: ["Scrolls", "Coins"], hint: "The word ostracize comes from this word." },
  { prompt: "Pericles was a famous leader in Athens. How did he help poorer citizens take part?", right: "Public jobs, such as jury duty, were paid", wrong: ["He moved the Assembly to Rome", "He hid the laws from them"], hint: "Pay let people who were not rich take part." },
  { prompt: "Athenian courts used large juries. Who served on them?", right: "Citizens", wrong: ["Kings", "Foreign soldiers"], hint: "Citizens helped decide court cases." },
  { prompt: "The Athenian Council of 500 prepared the topics for the Assembly. How were most of its members picked?", right: "By lot, from citizens", wrong: ["By the biggest army", "By a king"], hint: "Many citizens got a turn to serve.", hard: true },
  { prompt: "Why do historians say Athens' democracy was limited?", right: "Only a minority of the people living there could take part", wrong: ["Nobody was allowed to vote", "It had no laws"], hint: "Women, enslaved people and foreigners were excluded.", hard: true },
  { prompt: "How is Athens' democracy different from Canada's?", right: "Athenian citizens voted directly, but Canadians mostly elect representatives", wrong: ["Canadians vote on every law themselves", "Athens had a prime minister"], hint: "Canada is a representative democracy.", hard: true },
  { prompt: "How is Canada's voting right different from Athens'?", right: "Canadian citizens aged 18 and older, of any gender, can vote", wrong: ["Only men can vote in Canada", "Only landowners can vote in Canada"], hint: "Canada's voting rights are much wider than Athens'.", hard: true },
  { prompt: "Athenian generals were elected, not chosen by lot. Why might that make sense?", right: "Leading an army takes skill and experience", wrong: ["Generals did not need any skills", "Lots were too expensive"], hint: "Some jobs needed particular skills.", hard: true },
  { prompt: "The Greek word 'demokratia' is the root of which English word?", right: "Democracy", wrong: ["Diplomacy", "Dictator"], hint: "Demos means people and kratos means power." },
];

// ---------- Roman Republic ----------

const ROME: Item[] = [
  { prompt: "According to Roman tradition, Rome became a republic in 509 BCE. What happened then?", right: "The last king was driven out", wrong: ["The first king was crowned", "A new empire began"], hint: "Romans then chose leaders instead of kings." },
  { prompt: "The Latin words 'res publica' mean…", right: "public matter, or the people's affair", wrong: ["king's palace", "army leader"], hint: "The English word republic comes from it." },
  { prompt: "How many consuls did the Roman Republic elect each year?", right: "Two", wrong: ["One", "Five"], hint: "Two leaders shared power." },
  { prompt: "Why did Rome have two consuls with the same power?", right: "So that no one person had too much power", wrong: ["Because one was the king", "To save money"], hint: "Each consul could stop the other." },
  { prompt: "How long was a consul's term?", right: "One year", wrong: ["Ten years", "For life"], hint: "Short terms limited power." },
  { prompt: "What was the Roman Senate?", right: "A council of experienced leaders who advised on laws and money", wrong: ["A group of enslaved workers", "An army of foreign soldiers"], hint: "Senators held great influence." },
  { prompt: "Who were the plebeians?", right: "Ordinary Roman citizens", wrong: ["Kings of Rome", "Foreign rulers"], hint: "Most Romans were plebeians." },
  { prompt: "Who were the patricians?", right: "Members of wealthy, powerful families", wrong: ["Enslaved people", "Traders from far away"], hint: "At first they held most of the power." },
  { prompt: "Plebeians won the right to elect tribunes. What did tribunes do?", right: "Protected plebeians and could block unfair acts", wrong: ["Led the army into battle", "Collected taxes for the king"], hint: "Tribunes spoke up for ordinary people." },
  { prompt: "The Twelve Tables were Rome's first…", right: "written laws shown in public", wrong: ["armies", "temples"], hint: "People could see the laws for themselves." },
  { prompt: "Why were written laws important for fairness?", right: "Everyone could know what the law said", wrong: ["Only judges could read them", "They stopped all elections"], hint: "Written laws are harder to change in secret." },
  { prompt: "Rome's Republic was a representative democracy of a kind. Citizens did what?", right: "Voted for officials to lead for them", wrong: ["Voted on every law in one big meeting", "Had no vote at all"], hint: "Elected magistrates led the government." },
  { prompt: "Who could NOT vote in the Roman Republic?", right: "Women and enslaved people", wrong: ["Male citizens", "Elected consuls"], hint: "Like Athens, voting was limited." },
  { prompt: "In an emergency, Rome could appoint a dictator. How long could a dictator rule?", right: "Up to six months", wrong: ["For life", "Ten years"], hint: "It was meant to be only for emergencies.", hard: true },
  { prompt: "Roman government had checks and balances. What does that mean?", right: "Different parts of government limited each other's power", wrong: ["One leader decided everything", "Only the army made laws"], hint: "Veto powers were an example.", hard: true },
  { prompt: "Under the Republic, what could one consul do to the other's decision?", right: "Veto it", wrong: ["Make it a law", "Send it to a king"], hint: "Veto means 'I forbid'.", hard: true },
  { prompt: "The Republic gave way to rule by emperors. Which leader became the first emperor, in 27 BCE?", right: "Augustus", wrong: ["Pericles", "Hannibal"], hint: "He was Julius Caesar's heir.", hard: true },
  { prompt: "Which of these is a difference between Athens and the Roman Republic?", right: "Rome had a Senate and elected officials, while Athens' Assembly decided directly", wrong: ["Rome had no laws", "Athens had two consuls"], hint: "Athens was direct. Rome had more elected officials.", hard: true },
  { prompt: "Is Canada a republic?", right: "No. The King is Canada's head of state", wrong: ["Yes. Canada has an elected president", "Yes. Canada has two consuls"], hint: "Canada is a parliamentary democracy and a constitutional monarchy." },
];

// ---------- Haudenosaunee Confederacy ----------

const HAUDENOSAUNEE: Item[] = [
  { prompt: "What does Haudenosaunee mean?", right: "People of the Longhouse", wrong: ["People of the Mountains", "People of the Sea"], hint: "The longhouse is a symbol for the nations joined together." },
  { prompt: "The Haudenosaunee Confederacy joined nations together. What is a confederacy?", right: "A group of nations that work together under shared agreements", wrong: ["A single big city", "An army"], hint: "Each nation keeps its own identity." },
  { prompt: "Which nation is one of the original five of the Haudenosaunee Confederacy?", right: "Mohawk (Kanien'kehá:ka)", wrong: ["Cree", "Blackfoot"], hint: "The original five were Mohawk, Oneida, Onondaga, Cayuga and Seneca." },
  { prompt: "A sixth nation joined the Confederacy in the early 1700s. Which one?", right: "Tuscarora", wrong: ["Haida", "Dene"], hint: "That is why people also say Six Nations." },
  { prompt: "What is the Great Law of Peace?", right: "The Haudenosaunee Confederacy's founding law and way of governing", wrong: ["A European treaty", "A list of sports rules"], hint: "It is a constitution passed down in oral tradition." },
  { prompt: "How was the Great Law of Peace remembered and shared?", right: "Through speaking and wampum belts", wrong: ["Through newspapers", "Through radio"], hint: "Wampum belts hold records of agreements." },
  { prompt: "How does the Confederacy make decisions at its Grand Council?", right: "By discussing until they reach agreement (consensus)", wrong: ["By one leader ordering", "By a quick vote of a few chiefs"], hint: "Consensus means working together until agreement is reached." },
  { prompt: "Where does the Grand Council of the Confederacy meet?", right: "At Onondaga", wrong: ["At Ottawa", "At Edmonton"], hint: "Onondaga is the 'firekeeper' nation." },
  { prompt: "Clan mothers play an important role in Haudenosaunee governance. What do they do?", right: "They choose the chiefs and can remove one who does not serve well", wrong: ["They command the army", "They collect taxes"], hint: "Women hold real authority in the system." },
  { prompt: "In Haudenosaunee society, family clans are passed down through…", right: "the mother's line", wrong: ["the king's line", "the oldest brother"], hint: "This is called a matrilineal system." },
  { prompt: "Is the Haudenosaunee Confederacy only part of the past?", right: "No. Its councils and communities continue today", wrong: ["Yes. It ended long ago", "Yes. It only lived on in books"], hint: "Haudenosaunee communities exist across Canada and the United States." },
  { prompt: "Which of these is a Haudenosaunee community in Ontario?", right: "Six Nations of the Grand River", wrong: ["Fort McMurray", "Banff"], hint: "It is the largest First Nations community in Canada by population." },
  { prompt: "Why is consensus a good way to make decisions?", right: "Every voice is heard and the decision has wide support", wrong: ["It is always the quickest way", "It needs no discussion"], hint: "People often feel more bound to a decision they helped shape." },
  { prompt: "How is Haudenosaunee decision making different from majority rule?", right: "It aims for agreement, not just more than half the votes", wrong: ["It has no discussion", "It lets one nation decide for all"], hint: "Majority rule can leave a large group unhappy.", hard: true },
  { prompt: "Each nation in the Confederacy keeps its own…", right: "council and local decisions, while sharing the Great Law", wrong: ["language only", "king"], hint: "Like provinces in Canada, each has a say in its own matters.", hard: true },
  { prompt: "The Haudenosaunee Confederacy began long before Europeans came to this part of North America. What does this show?", right: "Indigenous peoples had complex governments of their own", wrong: ["Indigenous peoples had no laws", "Governments only began in Europe"], hint: "Democratic ideas developed in many places.", hard: true },
  { prompt: "What does the 'longhouse' picture show about the Confederacy?", right: "Nations living and working together like families under one roof", wrong: ["A house for one family", "A building for an army"], hint: "The idea of a shared house is a symbol of unity.", hard: true },
  { prompt: "Which statement is most accurate?", right: "Haudenosaunee peoples are living nations with their own governments today", wrong: ["All Indigenous nations govern the same way", "The Haudenosaunee Confederacy is only history"], hint: "Each Indigenous nation has its own traditions of governance.", hard: true },
];

// ---------- Provincial and federal governments ----------

const GOVERNMENTS: Item[] = [
  { prompt: "What are Canada's three orders (levels) of government?", right: "Federal, provincial or territorial, and municipal", wrong: ["Royal, army and church", "School, hospital and library"], hint: "Each order looks after different things." },
  { prompt: "Where does the federal Parliament meet?", right: "Ottawa", wrong: ["Edmonton", "Calgary"], hint: "Ottawa is the capital of Canada." },
  { prompt: "Where does the Alberta Legislature meet?", right: "Edmonton", wrong: ["Ottawa", "Lethbridge"], hint: "Edmonton is Alberta's capital city." },
  { prompt: "Who do Albertans elect to the Legislative Assembly of Alberta?", right: "Members of the Legislative Assembly (MLAs)", wrong: ["Members of Parliament (MPs)", "Senators"], hint: "MLA means Member of the Legislative Assembly." },
  { prompt: "Who do Canadians elect to the House of Commons?", right: "Members of Parliament (MPs)", wrong: ["Members of the Legislative Assembly (MLAs)", "Mayors"], hint: "MPs represent ridings across the country." },
  { prompt: "Who is the head of the government in a province?", right: "The premier", wrong: ["The mayor", "The governor general"], hint: "The premier usually leads the party with the most seats." },
  { prompt: "Who is the head of the federal government?", right: "The prime minister", wrong: ["The premier", "The mayor"], hint: "The prime minister usually leads the party with the most seats in the House of Commons." },
  { prompt: "What is a riding (electoral district)?", right: "An area whose voters elect one representative", wrong: ["A kind of horse trail", "A government building"], hint: "Voters in each riding choose an MP or an MLA." },
  { prompt: "Which of these is mainly a federal responsibility?", right: "National defence", wrong: ["Public schools", "Garbage pickup"], hint: "The federal government looks after matters that affect the whole country." },
  { prompt: "Which of these is mainly a provincial responsibility?", right: "Public school education", wrong: ["Canadian money", "Passports"], hint: "Provinces run schools, hospitals and highways." },
  { prompt: "Which of these is mainly a municipal responsibility?", right: "Garbage collection in a city", wrong: ["Canada's armed forces", "A province's health care"], hint: "Cities and towns look after local services." },
  { prompt: "Who does the Lieutenant Governor represent in Alberta?", right: "The King", wrong: ["The premier", "The mayor"], hint: "The Governor General does the same job for all of Canada." },
  { prompt: "Alberta has a Legislative Assembly of one chamber. What does this mean?", right: "There is no Senate in the Alberta government", wrong: ["Alberta has no laws", "Alberta has two assemblies"], hint: "Only the federal Parliament has a Senate." },
  { prompt: "What is the Official Opposition?", right: "The party with the second-most seats, which questions the government", wrong: ["The army", "The party with the most seats"], hint: "It checks the government's work." },
  { prompt: "What is a bill?", right: "A proposed law", wrong: ["A tax receipt", "An election poster"], hint: "It becomes a law only after it passes through the steps." },
  { prompt: "How many years can pass at most between federal elections?", right: "Five", wrong: ["Ten", "One"], hint: "The Constitution sets a maximum of five years.", hard: true },
  { prompt: "Where do cities and towns in Alberta get their powers?", right: "From the provincial government", wrong: ["From the federal Senate", "From the Governor General"], hint: "Provinces give powers to municipalities.", hard: true },
  { prompt: "A federal bill becomes law after passing the House of Commons and the Senate, then getting…", right: "Royal Assent", wrong: ["A school vote", "A mayor's approval"], hint: "The Governor General gives Royal Assent.", hard: true },
  { prompt: "Alberta became a province in 1905. How is that connected to Confederation?", right: "It joined Canada, which had been formed in 1867", wrong: ["It created Canada", "It was part of Canada from 1867"], hint: "Alberta and Saskatchewan both joined in 1905.", hard: true },
  { prompt: "A cabinet is…", right: "a group of ministers chosen to lead government departments", wrong: ["a group of judges", "a building for votes"], hint: "The prime minister or premier chooses them.", hard: true },
];

const GOV_SORT: SortSet = {
  prompt: "Federal or provincial? Tap an item, then tap its basket.",
  hint: "Federal matters affect the whole country. Provinces run schools, hospitals and highways.",
  bins: [
    { id: "federal", label: "Federal", emoji: "🍁" },
    { id: "provincial", label: "Provincial", emoji: "🏔️" },
  ],
  items: [
    { label: "Armed forces", emoji: "🎖️", bin: "federal" },
    { label: "Passports", emoji: "🛂", bin: "federal" },
    { label: "Canadian money", emoji: "💵", bin: "federal" },
    { label: "Canada Post", emoji: "📮", bin: "federal" },
    { label: "Public schools", emoji: "🏫", bin: "provincial" },
    { label: "Hospitals", emoji: "🏥", bin: "provincial" },
    { label: "Driver's licences", emoji: "🚗", bin: "provincial" },
    { label: "Provincial highways", emoji: "🛣️", bin: "provincial" },
  ],
};

// ---------- Charter ----------

const CHARTER: Item[] = [
  { prompt: "What is the Canadian Charter of Rights and Freedoms?", right: "Part of Canada's Constitution that protects people's rights", wrong: ["A list of Canadian cities", "A treaty with France"], hint: "It protects rights from being taken away by governments." },
  { prompt: "In what year did the Charter become part of the Constitution?", right: "1982", wrong: ["1867", "1905"], hint: "It was part of the Constitution Act, 1982." },
  { prompt: "Which of these is a fundamental freedom in the Charter?", right: "Freedom of peaceful assembly", wrong: ["Freedom from homework", "Freedom to skip school"], hint: "Fundamental freedoms include expression, religion and association." },
  { prompt: "Freedom of expression means people may…", right: "share their thoughts and opinions", wrong: ["say anything with no limits at all", "ignore the law"], hint: "Reasonable limits still apply." },
  { prompt: "Which group has the democratic right to vote in federal elections?", right: "Canadian citizens aged 18 and older", wrong: ["Only landowners", "Only men"], hint: "The Charter protects the right to vote." },
  { prompt: "Mobility rights let Canadian citizens…", right: "live and work in any province or territory", wrong: ["live only where they were born", "travel only by train"], hint: "Mobility means moving." },
  { prompt: "Which Charter idea says people are innocent until proven guilty?", right: "Legal rights", wrong: ["Language rights", "Mobility rights"], hint: "Legal rights protect people accused of crimes." },
  { prompt: "Equality rights in the Charter mean every person is…", right: "equal before and under the law", wrong: ["above the law", "better than others"], hint: "People must not be treated unfairly because of who they are." },
  { prompt: "Which of these is protected by the Charter's equality rights?", right: "Being treated fairly regardless of race or religion", wrong: ["Getting free ice cream", "Choosing a flavour for the whole class"], hint: "The Charter lists grounds like race, religion and disability." },
  { prompt: "Canada's two official languages are protected in the Charter. Which are they?", right: "English and French", wrong: ["English and Cree", "French and Spanish"], hint: "Official language rights are in the Charter." },
  { prompt: "Which court has the last word on how the Charter applies?", right: "The Supreme Court of Canada", wrong: ["A town council", "The school board"], hint: "Courts decide when rights are in question." },
  { prompt: "Rights come with responsibilities. Which is a responsibility of a citizen?", right: "Obeying the law and respecting others' rights", wrong: ["Choosing which laws to follow", "Taking away others' freedoms"], hint: "Rights and responsibilities go together." },
  { prompt: "Section 1 of the Charter says rights can be limited only if limits are…", right: "reasonable and justified in a free and democratic society", wrong: ["decided by one person", "kept secret from citizens"], hint: "For example, your freedom of speech does not allow you to harm others.", hard: true },
  { prompt: "The Charter protects Aboriginal and treaty rights of First Nations, Inuit and Métis. What does it not do?", right: "It does not take those rights away", wrong: ["It cancels all treaties", "It bans Indigenous languages"], hint: "Section 25 and Section 35 deal with Indigenous rights.", hard: true },
  { prompt: "Which is an example of a legal right?", right: "The right to speak with a lawyer if you are arrested", wrong: ["The right to be given a prize", "The right to skip taxes"], hint: "Legal rights apply when someone is dealing with the justice system.", hard: true },
  { prompt: "Who must follow the Charter?", right: "Governments and public institutions", wrong: ["Only the prime minister", "Only teachers"], hint: "It limits what governments can do to people.", hard: true },
  { prompt: "Section 33 of the Charter, the notwithstanding clause, lets a government…", right: "pass a law that overrides some Charter rights for up to five years", wrong: ["cancel the Constitution", "end elections"], hint: "It is rarely used and can be renewed.", hard: true },
  { prompt: "A student gives a peaceful speech about a school rule. Which freedom is this?", right: "Freedom of expression", wrong: ["Mobility rights", "Language rights"], hint: "Expression is sharing thoughts and opinions." },
];

// ---------- Civic participation ----------

const CIVIC: Item[] = [
  { prompt: "What is civic participation?", right: "Taking part in your community or government", wrong: ["Staying away from community life", "Only watching TV news"], hint: "Active citizens help shape their communities." },
  { prompt: "Which is a formal way to take part in democracy?", right: "Voting in an election", wrong: ["Chatting at lunch", "Playing a video game"], hint: "Formal ways are set out by law or official rules." },
  { prompt: "Which is an informal way to take part in your community?", right: "Volunteering at a food bank", wrong: ["Voting for a mayor", "Serving on a jury"], hint: "Informal ways are everyday actions people take to help." },
  { prompt: "What is serving on a jury?", right: "A citizen helps decide a court case", wrong: ["Making a school rule", "Counting votes"], hint: "Jury duty is a responsibility of citizens." },
  { prompt: "What is a petition?", right: "A request signed by many people asking for a change", wrong: ["A loud song", "A type of tax"], hint: "A petition shows how many people care." },
  { prompt: "Peaceful protest is protected by which Charter freedom?", right: "Peaceful assembly", wrong: ["Mobility", "Language rights"], hint: "People may gather peacefully to speak out." },
  { prompt: "Which is a way kids can take part in civic life?", right: "Joining student council or volunteering", wrong: ["Voting in a federal election", "Becoming prime minister"], hint: "Young people can contribute before they can vote." },
  { prompt: "In Alberta, how old must you be to vote in an election?", right: "18", wrong: ["12", "16"], hint: "Canadian citizens aged 18 and older can vote." },
  { prompt: "Why does voting matter?", right: "It gives citizens a say in who leads and what happens", wrong: ["It makes taxes disappear", "It is only for leaders"], hint: "Votes are how citizens choose representatives." },
  { prompt: "Which is a good step before voting?", right: "Learn about the candidates and their ideas", wrong: ["Guess a name", "Ask nobody anything"], hint: "Informed voters make better choices." },
  { prompt: "What does it mean to run for office?", right: "To be a candidate and ask people to elect you", wrong: ["To exercise outdoors", "To count the ballots"], hint: "Candidates share their ideas with voters." },
  { prompt: "Writing to your MLA or MP is a way to…", right: "tell a representative what you think", wrong: ["vote twice", "make a law yourself"], hint: "Representatives want to hear from people they represent." },
  { prompt: "Which is a responsibility of a good citizen?", right: "Following the law and respecting others", wrong: ["Ignoring the law when it is inconvenient", "Making fun of people who are different"], hint: "Citizens share duties as well as rights." },
  { prompt: "Which is an example of informal civic participation?", right: "Organizing a neighbourhood clean-up", wrong: ["Voting in a provincial election", "Running for city council"], hint: "No formal government process is required.", hard: true },
  { prompt: "Which is an example of formal civic participation?", right: "Running for city council", wrong: ["Starting a community garden", "Sharing an idea with friends"], hint: "It follows official election rules.", hard: true },
  { prompt: "Why might a low voter turnout be a problem?", right: "Fewer people's voices decide who governs", wrong: ["Elections become cheaper", "Everyone is represented fairly"], hint: "Turnout is the share of eligible voters who vote.", hard: true },
  { prompt: "How often are municipal elections held in Alberta?", right: "Every four years", wrong: ["Every year", "Every ten years"], hint: "Alberta cities and towns elect councils on a regular schedule.", hard: true },
  { prompt: "Which action is a respectful way to disagree with a decision?", right: "Writing a letter or speaking at a public meeting", wrong: ["Harassing the people involved", "Damaging public property"], hint: "Democracies value peaceful, lawful disagreement.", hard: true },
];

const CIVIC_SORT: SortSet = {
  prompt: "Formal or informal civic participation? Tap an item, then tap its basket.",
  hint: "Formal ways follow official rules, like voting. Informal ways are everyday actions to help a community.",
  bins: [
    { id: "formal", label: "Formal", emoji: "🗳️" },
    { id: "informal", label: "Informal", emoji: "🤝" },
  ],
  items: [
    { label: "Voting in an election", emoji: "🗳️", bin: "formal" },
    { label: "Running for city council", emoji: "🏙️", bin: "formal" },
    { label: "Serving on a jury", emoji: "⚖️", bin: "formal" },
    { label: "Being a school council trustee", emoji: "🏫", bin: "formal" },
    { label: "Helping at a food bank", emoji: "🥫", bin: "informal" },
    { label: "Cleaning up a park", emoji: "🧹", bin: "informal" },
    { label: "Starting a community garden", emoji: "🥕", bin: "informal" },
    { label: "Joining a peaceful walk for a cause", emoji: "🚶", bin: "informal" },
  ],
};

// ---------- Discrimination and racism ----------

const DISCRIMINATION: Item[] = [
  { prompt: "What is prejudice?", right: "An unfair opinion about people formed before knowing them", wrong: ["A fair opinion based on facts", "A kind of law"], hint: "Prejudice means 'pre-judging'." },
  { prompt: "What is a stereotype?", right: "An oversimplified belief about a whole group", wrong: ["A detailed personal story", "A school rule"], hint: "Stereotypes treat all people in a group as the same." },
  { prompt: "What is discrimination?", right: "Treating people unfairly because of a group they belong to", wrong: ["Treating everyone equally", "Choosing a favourite colour"], hint: "It can be based on race, religion, gender, disability or age." },
  { prompt: "What is racism?", right: "Treating people unfairly or believing some races are better than others", wrong: ["Respecting all cultures", "Learning about languages"], hint: "Racism harms people and communities." },
  { prompt: "What is an upstander?", right: "Someone who speaks up or helps when others are treated unfairly", wrong: ["Someone who watches and does nothing", "Someone who joins in"], hint: "Upstanders act safely and kindly." },
  { prompt: "What is a bystander?", right: "Someone who sees something happen but does not act", wrong: ["Someone who leads a protest", "A judge"], hint: "A bystander can choose to become an upstander." },
  { prompt: "A student hears someone make a hurtful joke about a culture. What is a safe, helpful step?", right: "Tell a trusted adult and support the person who was hurt", wrong: ["Laugh along", "Spread the joke"], hint: "Support and safety matter." },
  { prompt: "Which law protects Albertans from discrimination in jobs, housing and services?", right: "The Alberta Human Rights Act", wrong: ["The Highway Traffic Act", "The Weather Act"], hint: "Alberta's human rights law covers things like race, religion, gender and disability." },
  { prompt: "Inclusion means…", right: "making everyone feel welcome and part of the group", wrong: ["leaving some people out", "ignoring differences"], hint: "Inclusive communities value everyone." },
  { prompt: "Which is a reason people may be treated unfairly that human rights laws protect against?", right: "Race or religion", wrong: ["Liking soccer", "Wearing a blue shirt"], hint: "These are called protected grounds." },
  { prompt: "Which is an example of a stereotype?", right: "Assuming all kids from one country love the same sport", wrong: ["Asking a classmate about their favourite sport", "Learning about a country on a map"], hint: "A stereotype assumes everyone in a group is the same." },
  { prompt: "Empathy is…", right: "understanding how others feel", wrong: ["being the best at games", "knowing all the laws"], hint: "Empathy helps us respond kindly." },
  { prompt: "From 1885 to 1923 Canada charged a fee only to Chinese immigrants. What was it called?", right: "The head tax", wrong: ["The goods tax", "The fur tax"], hint: "The government apologized in 2006." },
  { prompt: "What is the difference between prejudice and discrimination?", right: "Prejudice is an attitude, and discrimination is an unfair action", wrong: ["They mean exactly the same thing", "Prejudice is a law and discrimination is a feeling"], hint: "Prejudice can lead to discrimination.", hard: true },
  { prompt: "Systemic racism means…", right: "unfair rules or practices in institutions that disadvantage some groups", wrong: ["only mean words from one person", "a rule that treats everyone alike"], hint: "It can exist even when no one means harm.", hard: true },
  { prompt: "During the Second World War, Japanese Canadians were forced from their homes on the West Coast. Why is this remembered as discrimination?", right: "They were treated as a threat only because of their ancestry", wrong: ["They asked to move", "They had committed crimes"], hint: "The Government of Canada apologized in 1988.", hard: true },
  { prompt: "Canada's Truth and Reconciliation Commission looked at the harm of…", right: "the residential school system for Indigenous children", wrong: ["the building of the Rocky Mountain trail", "the first elections"], hint: "Reconciliation means building respectful relationships.", hard: true },
  { prompt: "Which action best builds a more inclusive school?", right: "Learning about different cultures and including everyone in activities", wrong: ["Staying only in your own group", "Making rules that apply to some students only"], hint: "Everyone belongs.", hard: true },
  { prompt: "Why do the Charter's equality rights matter?", right: "They say governments cannot discriminate unfairly against people", wrong: ["They stop people from voting", "They remove freedom of speech"], hint: "Section 15 of the Charter protects equality.", hard: true },
];

export const units: Unit[] = [
  {
    id: "democracy-principles-ab",
    title: "Principles of Democracy",
    emoji: "🗳️",
    blurb: "Power to the people",
    standards: ab("principles of democracy", "what democracy means, majority rule, minority rights, the rule of law and the difference between direct and representative democracy"),
    parentNote: "The word democracy, who holds power, majority rule with protection for minorities, the rule of law, accountability, consensus and direct versus representative democracy.",
    generate: ({ difficulty = 2 } = {}) => withSort(PRINCIPLES, PRINCIPLES_SORT, difficulty),
  },
  {
    id: "athens-ab",
    title: "Athens: Direct Democracy",
    emoji: "🏺",
    blurb: "Citizens vote for themselves",
    standards: ab("ancient Athenian direct democracy", "how the Athenian Assembly, councils chosen by lot and ostracism worked, and who was left out"),
    parentNote: "Athens around 500 BCE: Cleisthenes, the Assembly, officials chosen by lot, jury courts and ostracism, and why this democracy was limited to adult male citizens. Compared with Canada's democracy.",
    generate: ({ difficulty = 2 } = {}) => levelled(ATHENS, 8, difficulty),
  },
  {
    id: "rome-republic-ab",
    title: "The Roman Republic",
    emoji: "🏛️",
    blurb: "Consuls, Senate and the people",
    standards: ab("Roman Republic representative democracy", "how Rome elected officials, shared power between two consuls and a Senate, and gave plebeians a voice"),
    parentNote: "The Roman Republic from 509 BCE (traditional date): two consuls, the Senate, patricians and plebeians, tribunes, the Twelve Tables, checks and balances, and the end of the Republic under Augustus.",
    generate: ({ difficulty = 2 } = {}) => levelled(ROME, 8, difficulty),
  },
  {
    id: "haudenosaunee-ab",
    title: "Haudenosaunee Confederacy",
    emoji: "🌳",
    blurb: "Deciding by consensus",
    standards: ab("Haudenosaunee Confederacy decision making", "how the Great Law of Peace, clan mothers and consensus guide the Confederacy"),
    parentNote: "The Haudenosaunee Confederacy (Mohawk, Oneida, Onondaga, Cayuga, Seneca and Tuscarora), its Great Law of Peace, clan mothers and consensus decisions, in the present tense as living nations. Needs review with Haudenosaunee partners before launch.",
    generate: ({ difficulty = 2 } = {}) => levelled(HAUDENOSAUNEE, 8, difficulty),
  },
  {
    id: "governments-canada-ab",
    title: "Governments in Canada",
    emoji: "🍁",
    blurb: "Federal, provincial and local",
    standards: ab("provincial and federal governments in Canada", "how Parliament, the Alberta Legislature and municipal councils work and what each level looks after"),
    parentNote: "The three orders of government, MPs and MLAs, the prime minister and premier, the Governor General and Lieutenant Governor, how a bill becomes law, and which government looks after what.",
    generate: ({ difficulty = 2 } = {}) => withSort(GOVERNMENTS, GOV_SORT, difficulty),
  },
  {
    id: "charter-ab",
    title: "The Charter of Rights and Freedoms",
    emoji: "📜",
    blurb: "Rights, freedoms and limits",
    standards: ab("the Canadian Charter of Rights and Freedoms", "fundamental freedoms, democratic, mobility, legal, equality and language rights, and their reasonable limits"),
    parentNote: "The Charter (1982): fundamental freedoms, democratic, mobility, legal, equality and language rights, reasonable limits, Indigenous rights, and the link between rights and responsibilities.",
    generate: ({ difficulty = 2 } = {}) => levelled(CHARTER, 8, difficulty),
  },
  {
    id: "civic-participation-ab",
    title: "Taking Part",
    emoji: "🙋",
    blurb: "Formal and informal civic action",
    standards: ab("formal and informal civic participation", "voting, running for office, volunteering, petitions, peaceful protest and other ways to take part"),
    parentNote: "Formal ways to take part (voting, running for office, jury duty) and informal ways (volunteering, petitions, peaceful protest), what young people can do now, and civic responsibilities.",
    generate: ({ difficulty = 2 } = {}) => withSort(CIVIC, CIVIC_SORT, difficulty),
  },
  {
    id: "discrimination-racism-ab",
    title: "Fairness and Respect",
    emoji: "🤝",
    blurb: "Prejudice, racism and inclusion",
    standards: ab("discrimination and racism", "prejudice, stereotypes, discrimination and racism, past wrongs and apologies, human rights law and ways to be an upstander"),
    parentNote: "Defines prejudice, stereotypes, discrimination and racism, looks at examples such as the Chinese head tax and the internment of Japanese Canadians with apologies, and shows how human rights law, the Charter and upstander actions help. Factual and age-appropriate, with no graphic detail.",
    generate: ({ difficulty = 2 } = {}) => levelled(DISCRIMINATION, 8, difficulty),
  },
];
