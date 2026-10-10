import { bankUnit, type Q } from "../own";

// Grade 3 social studies, Connecting and Belonging: citizenship (3-KC-001 to 3-KC-004) and groups, leaders and
// getting along (3-KP-032 to 3-KP-034, 3-S-101).

const CITIZEN: Q[] = [
  ["Being a citizen of Canada means you are…", "a member of the Canadian community", ["a visitor on a short trip", "the leader of the country"], "Citizenship means belonging to a community, here the Canadian community."],
  ["A citizen is a person who…", "belongs to a country as a member", ["lives alone", "never goes to school"], "Citizens are members of their country."],
  ["Which is a responsibility of a Canadian citizen?", "Follow the laws", ["Ignore the rules", "Keep all the fun for yourself"], "Responsibilities are things we should do."],
  ["Which is a responsibility of a student?", "Be respectful to classmates", ["Take things without asking", "Leave a mess for others"], "Being respectful is part of belonging to a class."],
  ["Which is a right of children in Canada?", "To go to school", ["To skip all rules", "To be the boss of a class"], "A right is something every person is allowed to have or do."],
  ["A right is something that…", "people are allowed to have or do", ["people must pay for", "only adults get"], "Rights protect people."],
  ["A responsibility is something you…", "should do", ["can never do", "get for free"], "Responsibilities are jobs and duties we take care of."],
  ["Which is a right?", "To be safe", ["To make a mess", "To talk during a story"], "Everyone has a right to be safe."],
  ["Picking up garbage in a park is an example of…", "a responsibility", ["a right only", "a punishment"], "Caring for shared places is a responsibility."],
  ["Voting for leaders is something Canadian adults can do. It is a…", "right and a responsibility", ["game", "holiday"], "Voting lets citizens have a say in who leads."],
  ["Which words are in the first line of “O Canada” in English?", "O Canada! Our home and native land!", ["Happy birthday to you", "Twinkle, twinkle, little star"], "The anthem begins “O Canada! Our home and native land!”"],
  ["“O Canada” is Canada's…", "national anthem", ["flag", "capital"], "An anthem is a song that stands for a country."],
  ["Which two official languages is “O Canada” sung in?", "English and French", ["English and Spanish", "French and Latin"], "The anthem is sung in English and in French."],
  ["Some communities also sing “O Canada” in…", "a local Indigenous language", ["a secret code", "a made-up language"], "In some places the anthem is sung in a local First Nations, Métis or Inuit language too."],
  ["What is a respectful way to listen to the anthem?", "Stand quietly", ["Talk to a friend", "Run around"], "We show respect by being still and listening."],
  ["The French words that begin the anthem are…", "O Canada! Terre de nos aïeux!", ["Bonjour, mon ami!", "Joyeux Anniversaire!"], "The French version begins “Ô Canada! Terre de nos aïeux!”"],
  ["Remembrance Day is a time to think about…", "peace and war", ["summer sports", "new clothes"], "We remember people who served and think about peace."],
  ["When is Remembrance Day?", "November 11", ["July 1", "February 14"], "We remember on the 11th day of November."],
  ["What do many people wear to remember?", "a red poppy", ["a blue ribbon", "a yellow hat"], "A red poppy is a sign of remembering."],
  ["What do people do at 11:00 a.m. on Remembrance Day?", "Pause for a moment of silence", ["Cheer loudly", "Start a race"], "Silence is a way to show respect and to remember."],
  ["Remembrance Day helps us…", "value peace", ["forget the past", "plan a party"], "Remembering people who served can help us care about peace."],
  ["Which holiday is on July 1?", "Canada Day", ["Remembrance Day", "Halloween"], "Canada Day celebrates our country."],
  ["Which is an example of a citizen helping the community?", "Volunteering at a food bank", ["Throwing litter", "Breaking a rule"], "Volunteers give their time to help others."],
  ["Why do communities need rules and laws?", "To keep people safe and treated fairly", ["To stop everyone having fun", "So nobody can ever help"], "Laws help people live together fairly and safely."],
  ["Both Canadians born here and new Canadians can be…", "citizens of Canada", ["only visitors", "only students"], "People can become Canadian citizens in more than one way.", true],
  ["“Responsibilities and rights go together” means…", "when we have rights we also have jobs to do", ["rights are only for adults", "responsibilities are only for kids"], "Rights and responsibilities are two sides of belonging.", true],
  ["Which pair shows a right and a matching responsibility?", "The right to be safe, and the responsibility to keep others safe", ["The right to be safe, and the right to be loud", "The responsibility to share, and the right to take everything"], "Rights come with ways we must treat others.", true],
  ["Why do we remember on Remembrance Day instead of just one person?", "Many people served and were affected by war", ["Only one person was ever in a war", "It was a sports holiday"], "We remember everyone who served, and think of peace.", true],
];

export const citizenship = bankUnit({
  id: "mb-citizenship",
  title: "Canadian Citizens",
  emoji: "🍁",
  blurb: "Belonging to Canada: rights, responsibilities, the anthem and Remembrance Day.",
  parentNote:
    "Practises what it means to be a citizen of Canada: examples of rights and responsibilities, the national anthem in English and French (and sometimes a local Indigenous language), and Remembrance Day as a time to think about peace and war.",
  standards: ["3-KC-001, 3-KC-002, 3-KC-003, 3-KC-004, 3-VP-011", "citizenship, rights and responsibilities, the national anthem and Remembrance Day"],
  items: CITIZEN,
});

const GROUPS: Q[] = [
  ["A leader who is chosen as the class helper for the week is…", "a formal leader", ["not allowed to lead", "a stranger"], "A formal leader has a job or title everyone knows about."],
  ["A mayor is a leader of…", "a town or city", ["a whole country", "one family only"], "Mayors lead towns and cities."],
  ["A prime minister is the leader of…", "the government of Canada", ["one school", "a sports team"], "The prime minister leads Canada's government."],
  ["A friend who always suggests fair rules at recess is…", "an informal leader", ["a formal leader with a title", "not a leader"], "Informal leaders guide others without a title."],
  ["Which is a formal leader?", "A school principal", ["A kind classmate", "A friend on the playground"], "A principal has an official job leading the school."],
  ["Which is an informal leader?", "A teammate who encourages others", ["A king", "A mayor"], "Informal leaders earn respect by how they act."],
  ["Which is a good quality in a leader?", "Listens to others", ["Ignores everyone", "Always shouts"], "Good leaders listen and are fair."],
  ["A group needs to choose a game. A fair way to decide is to…", "take a vote", ["let the loudest kid pick", "pick the same thing every day"], "A vote gives everyone a say."],
  ["Voting means…", "each person gets a say in a decision", ["only one person decides", "nobody chooses"], "Voting is one way groups decide together."],
  ["Elders in many communities are leaders because they…", "share wisdom and teachings", ["have the loudest voice", "are the youngest"], "Elders are respected for what they know and teach."],
  ["How should we treat the teachings of Elders and community members?", "With respect", ["With laughter", "By ignoring them"], "We listen and show respect."],
  ["Two children both want the same toy. A peaceful way to solve it is to…", "take turns", ["grab it", "yell at each other"], "Taking turns is fair for both."],
  ["Which is a way to solve a conflict?", "Talk about it calmly", ["Hit", "Call names"], "Calm talk helps people understand each other."],
  ["A good first step in solving a conflict is to…", "stop and take a breath", ["say something mean", "walk away angrily"], "Calming down helps you think."],
  ["Using “I feel…” words helps to…", "tell how you feel without blaming", ["win the argument", "hurt feelings"], "“I feel sad when…” explains without blaming."],
  ["When someone shares a different idea in a conflict you should…", "listen to their side", ["stop listening", "tell them they are wrong at once"], "Listening is part of solving a conflict peacefully."],
  ["Compromise means…", "each person gives up a little", ["one person gets everything", "nobody gets anything"], "In a compromise both people give something."],
  ["Bullying is…", "hurting or scaring someone again and again", ["one friendly joke", "a disagreement that is settled"], "Bullying is repeated and unkind."],
  ["If someone is bullied, one good thing to do is…", "tell a trusted adult", ["keep it secret forever", "bully back"], "Adults can help make it stop."],
  ["If you see someone being bullied, you can…", "be kind to them and get help", ["join in", "pretend not to see and laugh"], "Standing up safely and getting help is kind."],
  ["Which is bullying?", "Leaving someone out on purpose, again and again", ["Taking turns", "Sharing your pencil"], "Leaving people out on purpose can be bullying."],
  ["Who can help if you are being bullied?", "A teacher or parent", ["Nobody can help", "Only the bully"], "Trusted adults can help."],
  ["Why is it important to contribute to your group?", "Everyone's help makes the group work well", ["Groups never need help", "Only one person should do all the work"], "A group is stronger when everyone helps."],
  ["In a group project, you finish your job early. What can you do?", "Offer to help someone else", ["Distract others", "Take over their work without asking"], "Offering help shows willingness to contribute."],
  ["A leader should treat each person…", "fairly and with respect", ["based on who they like most", "with no kindness"], "Respectful leaders treat everyone fairly."],
  ["Leaders in Canada make rules by…", "talking and deciding together in a government", ["guessing", "flipping a coin only"], "Leaders and governments meet to make decisions.", true],
  ["A group votes 8 to 5. Which choice wins?", "The choice with 8 votes", ["The choice with 5 votes", "Neither"], "More votes win in a vote.", true],
  ["Why can an informal leader be important?", "They can help others get along without a title", ["They are always the oldest", "They make the laws"], "Leading can be done by how you act.", true],
];

export const groups = bankUnit({
  id: "mb-groups-and-leaders",
  title: "Groups, Leaders & Getting Along",
  emoji: "🤝",
  blurb: "Leaders, fair decisions, solving conflicts and standing up to bullying.",
  parentNote:
    "Practises formal and informal leadership, fair group decisions, peaceful ways of solving conflicts and what to do about bullying, including respect for the teachings of Elders and community members.",
  standards: ["3-KP-032, 3-KP-033, 3-KP-034, 3-VC-002, 3-VP-011A, 3-S-101", "leadership in groups, resolving conflict and dealing with bullying"],
  items: GROUPS,
});
