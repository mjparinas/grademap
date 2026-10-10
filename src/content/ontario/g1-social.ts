import type { Unit } from "../types";
import { on } from "./kit";
import { e, order, q, sorter, unitOf, type Item } from "./k-g2-kit";

// Ontario Grade 1 social studies (2023): A. Heritage and Identity, Our Changing Roles and
// Responsibilities; B. People and Environments, The Local Community. BC's community, difference,
// land and map units are shared (see g1.ts). Expectations about First Nations, Métis and Inuit
// territories and reclaiming identity (A1.5, B3.1) are left for writing with local partners.

// ---------- My Roles and Responsibilities ----------

const ROLES: Item[] = [
  q("At school, what is your role?", "a student", ["a pilot", "a firefighter"], "A role is the part you play, like student, friend or family member."),
  q("Which one is a responsibility you can have at home?", "Feed the pet", ["Drive the car", "Pay the rent"], "A responsibility is a job you do for others or for the world."),
  q("Which person helps you in your family?", "a parent or caregiver", ["a stranger", "a cloud"], "Family members care for us and we help them too."),
  q("A friend is a person who…", "plays with you and is kind", ["takes your things", "never talks"], "A friend is one of the relationships you have."),
  q("Jay is a big brother now. What is his new role?", "sibling", ["firefighter", "teacher"], "When a baby joins a family, big brothers and sisters have a new role.", { emoji: "👶" }),
  q("Ana has a new puppy. What is her new responsibility?", "helping feed and walk it", ["driving to work", "painting a house"], "Pets need food, water and walks.", { emoji: "🐕" }),
  q("Who might you ask for help if you are lost at the park?", "a safe adult, like a police officer", ["someone you do not know who offers a ride", "nobody"], "Look for a helper such as a police officer, teacher or parent.", { emoji: "🧭", d: 2 }),
  q("A teacher helps a student find an answer. How did the teacher help?", "by giving a hint", ["by taking the pencil", "by leaving"], "People help each other in many ways.", { d: 2 }),
  q("A child upsets another child. What can the first child do?", "Say sorry and be kind", ["Laugh", "Walk away and say nothing"], "What we do can change how someone feels.", { d: 2 }),
  q("Sam is a student, a friend and a soccer player. Those are…", "different roles", ["all the same", "rules"], "A person can have many roles at once.", { d: 2 }),
  q("At school you are a student. At the library you are a…", "visitor who borrows books", ["firefighter", "mailbox"], "Our roles change in different places.", { d: 3 }),
  q("When you are at home you may be a helper. At a game, you may be a…", "team member", ["bus driver", "doctor"], "We have different roles in different places.", { d: 3 }),
  q("Which one shows you are being responsible?", "putting your coat on the hook", ["leaving it in the hall", "hiding it in the bin"], "Being responsible means doing your part.", { d: 2 }),
  q("Who is a community helper who keeps us safe?", "a police officer", ["a clown", "a baker only"], "Police officers, firefighters and paramedics keep us safe.", { emoji: "👮" }),
  q("Who might be an important person in your life?", "someone who cares for you", ["someone who takes your toys", "someone you have never met"], "People who care for us are important in our lives.", { d: 2 }),
  q("A crossing guard's role is to…", "help kids cross safely", ["bake bread", "paint walls"], "Crossing guards keep children safe on the road.", { emoji: "🚸" }),
  q("Lena sets the table for supper. What is that?", "a responsibility", ["a holiday", "a storm"], "A responsibility is a job you do to help others."),
  q("At home you tidy your toys. Why is this a good job?", "It keeps the home safe and neat", ["It makes more mess", "It hides your shoes"], "Doing our part helps everyone at home."),
  q("Maya is a daughter, a sister and a friend. These are her…", "roles", ["shoes", "seasons"], "A person can have many roles.", { d: 2 }),
  q("Who can help you if you feel sad at school?", "a teacher you trust", ["a stranger on the street", "no one"], "Trusted adults can help us when we feel sad.", { d: 2 }),
  q("What can a classmate do?", "share and take turns", ["take all the toys", "say mean words"], "Good classmates are kind and fair."),
  q("Kenji's grandmother tells him a story. She is helping by…", "sharing what she knows", ["hiding the book", "taking his toy"], "Family members share stories and ideas.", { d: 2 }),
  q("Which job could you do to help at school?", "hand out papers", ["drive the school bus", "fix the roof"], "Students can do small jobs that help the class.", { d: 2 }),
  q("Your friend is sad. What is your role as a friend?", "listen and be kind", ["tease", "leave"], "Friends care about how others feel.", { d: 3 }),
  q("Noah forgets to feed the fish. What may happen?", "The fish get hungry", ["The fish learn to read", "Nothing at all"], "Pets depend on us to do our jobs.", { emoji: "🐟", d: 3 }),
  q("When you follow the class rules, you are being a good…", "classmate", ["tree", "cloud"], "Following rules is part of the student role.", { d: 3 }),
];

// ---------- Changes in My Life ----------

const CHANGES: Item[] = [
  q("Which is a big event in a family?", "a new baby is born", ["breakfast", "a Tuesday"], "Big events change our families."),
  q("Which event came first in your life?", "being a baby", ["starting Grade 1", "learning to read"], "We start as babies and then grow.", { emoji: "👶" }),
  q("Leo moved to a new home. How might he feel?", "excited and a little nervous", ["only angry", "nothing at all"], "Moving brings new things and mixed feelings.", { emoji: "🏠" }),
  q("Starting school is a big change. What can help?", "meeting your teacher and new friends", ["staying home forever", "hiding"], "Talking and meeting people helps new things feel easier."),
  q("Which event might be special for your family?", "a birthday party", ["a rainy afternoon", "a nap"], "Birthdays and celebrations are special events."),
  q("Priya got a pet cat. What changed?", "She has a new job: caring for the cat", ["She turned into a cat", "Nothing changed"], "A new pet brings new responsibilities.", { emoji: "🐈" }),
  q("Zoe and Kenji both started school this year. What is the same?", "They both began something new", ["They are the same age exactly", "They sit in the same chair"], "Many people share big events, even if they are different.", { d: 2 }),
  q("Maya lost her first tooth. Her friend did not yet. Is that okay?", "Yes, everyone grows differently", ["No, something is wrong", "It means they are not friends"], "Every child grows and changes at their own time.", { d: 2 }),
  q("We keep photos of big events. What do they help us do?", "remember what happened", ["forget everything", "fly"], "Photos and timelines help us remember events in order.", { d: 2 }),
  q("A timeline shows events in…", "order", ["colours", "sizes only"], "A timeline puts things in the order they happened."),
  q("What happens to a baby as it grows?", "It learns to walk and talk", ["It shrinks", "It turns into a pet"], "Children change and learn as they grow.", { emoji: "🧒" }),
  q("Before you started Grade 1, you were in…", "Kindergarten", ["Grade 5", "university"], "We move up one grade at a time.", { d: 2 }),
  q("Which came first?", "crawling", ["walking", "running a race"], "Babies learn to crawl before they walk.", { emoji: "👶" }),
  q("Which is a big event in a child's life?", "losing a first tooth", ["brushing teeth today", "eating toast"], "A first tooth falling out is a big event."),
  q("Amir's family moved to a new town. What is new?", "his home and neighbours", ["his name", "his birth date"], "A move changes where we live and who is near us.", { emoji: "🚚" }),
  q("A photo album helps a family…", "remember special days", ["lose things", "stop time"], "Photos help us remember events in order."),
  q("Sam is 6 now. How old was he last year?", "5", ["7", "4"], "Last year means one year before.", { d: 2 }),
  q("Ana started swimming lessons. What did she start to learn?", "a new skill", ["a new colour", "a new street"], "We learn new skills as we grow.", { emoji: "🏊", d: 2 }),
  q("Ravi learned to ride a bike. How might he feel?", "proud and happy", ["cold and dusty", "sleepy only"], "Learning something new can feel great.", { emoji: "🚲", d: 2 }),
  q("Which event is a celebration?", "a birthday", ["a sneeze", "a puddle"], "Birthdays are a happy event."),
  q("A new baby comes home. What changes for the family?", "Everyone helps care for the baby", ["Nobody changes", "The house disappears"], "A new baby changes the roles in a family.", { d: 2 }),
  q("Which of these already happened?", "when you were a baby", ["next year's holiday", "tomorrow's lunch"], "The past is what already happened.", { d: 2 }),
  q("What can you use to show your life in order?", "a timeline", ["a hammer", "a whistle"], "A timeline puts events in order.", { d: 3 }),
  q("Priya's friend moved away. How can they stay in touch?", "send a letter or call", ["forget each other", "hide"], "We can keep friendships when people move.", { d: 3 }),
];

const LIFE_ORDER = order("Put these events from your life in order. What came first?", "A baby is born, learns to walk, goes to Kindergarten, then Grade 1.", [
  ["Baby", "👶"],
  ["Learn to walk", "🚶"],
  ["Kindergarten", "🎒"],
  ["Grade 1", "📚"],
]);

// ---------- Respect and Inclusion ----------

const RESPECT: Item[] = [
  q("Which one is a way to be kind to a new classmate?", "Invite them to play", ["Ignore them", "Laugh at them"], "Including others helps everyone belong.", { emoji: "🤝" }),
  q("What does sharing mean?", "letting others use something too", ["keeping it all", "hiding it"], "Sharing is an inclusive, kind behaviour."),
  q("Taking turns is…", "a fair way to play", ["a way to win", "a secret"], "Everyone gets a chance when we take turns."),
  q("You want to say something. Another child is talking. You…", "wait and listen first", ["talk louder", "interrupt"], "Waiting for your turn shows respect.", { emoji: "👂" }),
  q("A classmate is trying to do something hard. How can you help?", "Say, “You can do it.”", ["Say, “That is easy.”", "Laugh"], "Encouraging words help."),
  q("Why should we say please and thank you?", "It shows respect", ["It is a secret rule", "It makes toys fly"], "Courteous words show we care."),
  q("Which way of caring for the school garden is respectful?", "Water the plants gently", ["Pull up the flowers", "Walk across the beds"], "We show respect for plants and the environment too.", { emoji: "🌻" }),
  q("A child in your class speaks another language at home. You can…", "ask them to teach you a word", ["say it is strange", "ignore them"], "Learning about each other is respectful.", { d: 2 }),
  q("You do not agree with a friend. What is a respectful thing to do?", "Say so calmly and listen", ["Shout", "Break their toy"], "We can disagree and still be kind.", { d: 2 }),
  q("You borrow a pencil. What do you do when you finish?", "Give it back", ["Keep it", "Hide it"], "Taking care of others' things shows respect.", { d: 2 }),
  q("Which is NOT a respectful thing to do?", "Take something without asking", ["Ask before using", "Say thank you"], "Respect means asking and caring about others.", { d: 2 }),
  q("At the park there is litter. Which choice is respectful to the park?", "Pick it up and put it in the bin", ["Leave it for someone else", "Hide it in the sand"], "Looking after the places we share is respectful.", { d: 3 }),
  q("Everyone in class helps tidy up. What is this called?", "cooperating", ["fighting", "sleeping"], "Cooperating means working together."),
  q("A friend feels left out. A kind and inclusive action is to…", "ask them to join the game", ["tell them the game is full", "play somewhere else"], "Inclusion means making room for others.", { d: 3 }),
  q("Someone is sad. What is a respectful thing to do?", "Be gentle and listen", ["Say “Stop crying!”", "Walk away laughing"], "Gentle words show we care."),
  q("Why do we ask before touching someone's art?", "It belongs to them", ["It is magic", "It is boring"], "Asking shows respect for other people's things.", { emoji: "🎨" }),
  q("Which is a respectful way to use a library book?", "Turn pages gently", ["Draw on the pages", "Rip out a page"], "Taking care of shared things shows respect.", { emoji: "📖" }),
  q("A friend's family has a different culture. How can you show respect?", "Be curious and kind", ["Make fun of it", "Say it is wrong"], "Learning about others is respectful.", { d: 2 }),
  q("A classmate wears glasses. Which is respectful?", "Treat them like anyone else", ["Tease them", "Hide their glasses"], "Everyone deserves to be treated well.", { d: 2 }),
  q("When a teacher speaks, you…", "listen with your ears and eyes", ["talk to a friend", "hide in a corner"], "Listening is a way to show respect."),
  q("Which is a polite way to ask?", "May I please have a turn?", ["Give me it!", "Move over!"], "Polite words show respect."),
  q("A friend's lunch is new to you. What can you say?", "That looks interesting. What is it?", ["Yuck!", "That is gross."], "Being curious is kinder than judging.", { emoji: "🍱", d: 2 }),
  q("You both want the computer. Which is inclusive?", "Take turns or work together", ["Push them away", "Hide the mouse"], "Including others means sharing.", { d: 2 }),
  q("A new child speaks little English. How can you include them?", "Smile and show them games", ["Ignore them", "Laugh at their words"], "A friendly smile helps people feel welcome.", { d: 3 }),
  q("You bump into someone by accident. What do you say?", "Sorry!", ["Move!", "Nothing, run away"], "Saying sorry shows we care.", { d: 3 }),
  q("Treating others kindly and fairly is called being…", "respectful", ["rude", "sleepy"], "Respect means caring about others and their things.", { d: 3 }),
];

// ---------- Places in My Community ----------

const PLACES: Item[] = [
  q("Which one is a natural feature of a community?", e("a river", "🏞️"), [e("a bus stop", "🚏"), e("a store", "🏪")], "Rivers, lakes, forests and hills are natural features."),
  q("Which one is a built feature of a community?", e("a bridge", "🌉"), [e("a lake", "🏞️"), e("a forest", "🌲")], "People build bridges, roads and buildings."),
  q("Where do people live?", "a residential area", ["a farm only", "the sky"], "Homes are in residential areas.", { emoji: "🏘️" }),
  q("Where do people shop?", "a commercial area", ["a quiet forest", "a library only"], "Stores and offices are in commercial areas.", { emoji: "🏬" }),
  q("A busy street with many cars is a…", "high-traffic area", ["quiet pond", "tiny garden"], "Busy roads are high-traffic areas.", { emoji: "🚗" }),
  q("Your school is near the park. What does near mean?", "close by", ["very far away", "on the moon"], "Near means a short way off."),
  q("The library is far from the school. What does far mean?", "a long way away", ["right beside", "inside"], "Far means a long way.", { d: 2 }),
  q("The mailbox is beside the school. Beside means…", "next to", ["very far away", "under the ground"], "Beside means right next to.", { d: 2 }),
  q("The fire hall is across the street from the school. It is…", "on the other side of the road", ["on the roof", "inside the school"], "Across means on the opposite side.", { d: 2 }),
  q("The store is 2 blocks away. The park is 10 blocks. Which is closer?", "the store", ["the park", "They are the same"], "Fewer blocks means closer.", { d: 3 }),
  q("Which one is a natural place you can play in?", "a forest trail", ["a parking lot", "a mall"], "Some natural places are open for everyone to enjoy.", { d: 2 }),
  q("What can you find in a park?", "trees and a playground", ["a hospital", "an airport"], "Parks have natural and built features together.", { emoji: "🛝" }),
  q("A community has houses, shops and parks. Those are different…", "areas", ["colours", "animals"], "Different parts of a community are used in different ways.", { d: 2 }),
  q("Which two words tell where something is?", "beside, behind", ["red, blue", "hot, cold"], "Location words tell where things are.", { d: 3 }),
];

const NB_SORT = sorter({
  prompt: "Natural or built? Tap a feature, then its basket.",
  hint: "Natural features were not made by people. Built ones were.",
  bins: [
    { id: "nature", label: "Natural", emoji: "🌿" },
    { id: "built", label: "Built", emoji: "🏗️" },
  ],
  items: [
    { label: "river", emoji: "🏞️", bin: "nature" },
    { label: "forest", emoji: "🌲", bin: "nature" },
    { label: "hill", emoji: "⛰️", bin: "nature" },
    { label: "lake", emoji: "💧", bin: "nature" },
    { label: "road", emoji: "🛣️", bin: "built" },
    { label: "school", emoji: "🏫", bin: "built" },
    { label: "bridge", emoji: "🌉", bin: "built" },
    { label: "store", emoji: "🏪", bin: "built" },
  ],
});

// ---------- Community Services ----------

const SERVICES: Item[] = [
  q("Who puts out fires?", e("firefighter", "🧑‍🚒"), [e("baker", "🥖"), e("librarian", "📚")], "Firefighters put out fires and help in emergencies."),
  q("Who collects garbage and recycling?", "sanitation workers", ["pilots", "dentists"], "Sanitation workers keep our community clean.", { emoji: "🚛" }),
  q("Who drives the school bus or city bus?", "a bus driver", ["a baker", "a vet"], "Bus drivers help people get around.", { emoji: "🚌" }),
  q("Who helps you when you are sick?", e("doctor or nurse", "🧑‍⚕️"), [e("bus driver", "🚌"), e("baker", "🥖")], "Doctors and nurses care for sick people."),
  q("Who helps you find a book?", e("librarian", "📚"), [e("firefighter", "🧑‍🚒"), e("farmer", "🧑‍🌾")], "A librarian helps people find books and information."),
  q("Who takes care of sick pets?", "a veterinarian", ["a mail carrier", "a judge"], "Vets help animals stay healthy.", { emoji: "🐾" }),
  q("Who plows snow from the roads in winter?", "a snowplow driver", ["a lifeguard", "a pilot"], "Snowplows help keep roads safe in winter.", { emoji: "❄️" }),
  q("A lifeguard works at the pool. What do they do?", "keep swimmers safe", ["bake bread", "grow corn"], "Lifeguards watch and rescue people in the water.", { d: 2 }),
  q("Who keeps your teeth healthy?", "a dentist", ["a pilot", "a driver"], "Dentists look after our teeth.", { emoji: "🦷" }),
  q("The city or town runs the library. A service the government runs is for…", "everyone in the community", ["only one family", "only grown-ups"], "Many community services are paid for together.", { d: 2 }),
  q("Which service is usually run by the city?", "garbage pick-up", ["a shoe store", "a toy shop"], "Garbage pick-up is a service the city organizes.", { d: 2 }),
  q("Which service is usually run by the government?", "public schools", ["a bakery", "a movie theatre"], "Schools are a service the government provides.", { d: 2 }),
  q("Which job helps keep people safe on the road?", "crossing guard", ["baker", "farmer"], "Crossing guards help children cross.", { emoji: "🚸" }),
  q("A police officer helps with…", "keeping people safe", ["making bread", "planting seeds"], "Police help keep the community safe.", { emoji: "🚓", d: 2 }),
  q("Without garbage pick-up, what might happen in a town?", "Garbage would pile up", ["Nothing", "More snow"], "Services keep a community healthy.", { d: 3 }),
  q("Who builds roads and fixes potholes?", "road workers", ["bakers", "teachers"], "Road workers keep streets in good shape.", { emoji: "🚧" }),
  q("Which number do you call in an emergency?", "9-1-1", ["1-2-3", "5-5-5"], "In an emergency, call 9-1-1 for help.", { emoji: "☎️" }),
  q("Who brings letters to your home?", "a mail carrier", ["a firefighter", "a dentist"], "Mail carriers bring letters and parcels.", { emoji: "📬" }),
  q("Who drives an ambulance?", "a paramedic", ["a baker", "a clown"], "Paramedics help people who are hurt or sick.", { emoji: "🚑" }),
  q("Where can everyone borrow books for free?", "the public library", ["a shoe store", "a car wash"], "A public library is a service for the whole community.", { emoji: "📚", d: 2 }),
  q("Who keeps water clean and safe to drink?", "water treatment workers", ["bakers", "pilots"], "These workers clean the water before it reaches our taps.", { emoji: "🚰", d: 2 }),
  q("Who teaches children at school?", "a teacher", ["a lifeguard", "a pilot"], "Teachers help students learn.", { emoji: "🧑‍🏫" }),
  q("Why do towns have parks?", "so everyone can play and relax", ["so no one can go", "only for cars"], "Parks are a service for the whole community.", { d: 2 }),
  q("Who gives check-ups and shots at a clinic?", "a nurse", ["a plumber", "a baker"], "Nurses help keep us healthy.", { emoji: "💉", d: 2 }),
  q("A bus stop is part of which service?", "public transit", ["garbage pick-up", "the library"], "Buses and trains are public transit.", { emoji: "🚏", d: 3 }),
  q("Many people pay together for city services. This money is called…", "taxes", ["marbles", "candy"], "Taxes pay for things like roads, parks and libraries.", { d: 3 }),
];

// ---------- Measure and Draw Maps ----------

const MEASURE: Item[] = [
  q("You count steps from the door to the desk. You are using…", "footsteps as a unit", ["a clock", "a mirror"], "Footsteps are a non-standard unit of measure.", { emoji: "👣" }),
  q("Which one could you use to measure a table?", "your hands", ["your eyebrows", "a cloud"], "Hands, blocks and paper clips can be non-standard units.", { emoji: "🖐️" }),
  q("A rug is 5 blocks long. The shelf is 3 blocks long. Which is longer?", "the rug", ["the shelf", "They are the same"], "5 is more than 3.", { emoji: "🧱" }),
  q("Priya has bigger hands than Sam. Sam counts 6 hands. Priya counts…", "fewer than 6", ["more than 6", "exactly 6"], "Bigger units mean you need fewer of them.", { d: 3 }),
  q("On a map, a little tree can stand for…", "a park", ["a school bus", "a river"], "Maps use symbols. The legend tells what each one means."),
  q("A legend on a map tells you…", "what the symbols mean", ["the weather", "the time"], "The legend, or key, explains the map's symbols."),
  q("A map needs a title. What does a title do?", "tells what the map is about", ["tells a joke", "shows the time"], "A title names the map."),
  q("To make a map of your classroom, you first…", "decide what to show", ["close your eyes", "cut the desks"], "A good map shows the main parts in the right place.", { d: 2 }),
  q("Which symbol would you use for a school?", e("a school building", "🏫"), [e("a cow", "🐄"), e("a boat", "⛵")], "Symbols should look like or remind us of the thing.", { d: 2 }),
  q("How can you tell north on a map?", "Look for the compass rose", ["Count the trees", "Smell the paper"], "A compass rose shows the directions.", { emoji: "🧭", d: 2 }),
  q("You walk 10 steps to the sink and 4 steps to the board. Which is closer?", "the board", ["the sink", "They are the same"], "Fewer steps means closer.", { d: 2 }),
  q("Your book is 8 clips long, but 5 crayons long. Why?", "Clips and crayons are different sizes", ["The book changed", "Clips are magic"], "Different units give different numbers.", { d: 3 }),
  q("A pencil is 7 clips long. A crayon is 4 clips long. Which is shorter?", "the crayon", ["the pencil", "They are the same"], "4 is less than 7.", { emoji: "🖍️" }),
  q("On many maps, a blue wavy line means a…", "river", ["road", "school"], "Blue usually shows water on a map."),
  q("A compass rose has N, S, E and W. N means…", "north", ["nest", "never"], "N stands for north."),
  q("A compass rose has N, S, E and W. W means…", "west", ["wind", "water"], "W stands for west."),
  q("What is a map for?", "showing where places are", ["telling jokes", "baking bread"], "A map helps us find places."),
  q("A map is a drawing as if you look from…", "above", ["underneath", "inside a box"], "Maps show a bird's-eye view from above.", { d: 2 }),
  q("Which unit is best to measure a small book?", "paper clips", ["school buses", "kilometres"], "Small units fit small things.", { d: 2 }),
  q("Which unit could you use to measure the gym floor?", "big steps", ["paper clips", "grains of rice"], "Bigger units are better for bigger spaces.", { d: 2 }),
  q("Which symbol shows a place to swim?", e("a pool", "🏊"), [e("a bus", "🚌"), e("a book", "📚")], "A good symbol looks like the place.", { d: 2 }),
  q("To measure a table with blocks, you…", "line them up end to end", ["stack them high", "scatter them"], "No gaps and no overlaps makes a fair measure.", { d: 2 }),
  q("Two kids measure a mat. One gets 6 hands and one gets 8. Why?", "Their hands are different sizes", ["The mat shrank", "The mat is magic"], "Hand sizes are different, so the numbers are different.", { d: 3 }),
  q("It takes 12 of your steps. Sam takes smaller steps. Sam needs…", "more steps", ["fewer steps", "no steps"], "Smaller steps mean you need more of them.", { d: 3 }),
  q("The park is next to the library. On a map they are…", "side by side", ["far apart", "in different cities"], "Next to means side by side.", { d: 3 }),
];

// ---------- Social Studies Detectives ----------

const DETECTIVES: Item[] = [
  q("A detective asks questions. Which is a good question about our community?", "Where is the library?", ["Why is cheese yellow?", "Are dogs cute?"], "A good social studies question is about people or places.", { emoji: "🕵️" }),
  q("Where can you find out about your community?", "Ask a helper or look at a map", ["Never ask", "Look at your shoes"], "We can ask people, read books, look at photos and maps."),
  q("A photo from long ago shows an old school. What can you learn?", "how the school looked before", ["what the weather is today", "who won a race"], "Old photos are clues about the past.", { emoji: "📷" }),
  q("A graph shows how kids get to school. What can you find out?", "how many walk, bike or ride", ["what they eat", "what they dream"], "Charts show information.", { d: 2 }),
  q("Which word means a person's job or part in a group?", "role", ["rock", "roof"], "A role is a part someone plays."),
  q("Which word means a job you are trusted to do?", "responsibility", ["tomorrow", "balloon"], "A responsibility is a duty or job."),
  q("A community is…", "a group of people who live, work or play together", ["a type of cheese", "a kind of weather"], "A community can be a town, a school or a neighbourhood."),
  q("After you gather information, what is next?", "Think about what it tells you", ["Throw it away", "Forget it"], "We draw conclusions from the evidence.", { d: 2 }),
  q("A class makes a chart of favourite parks. What is this called?", "gathering and organizing information", ["a recess", "a trip"], "Collecting facts helps us answer questions.", { d: 2 }),
  q("You ask your neighbour about the old bakery. They are a…", "source of information", ["tree", "game"], "People can tell us what they know.", { d: 3 }),
  q("You draw a picture of your community and tell the class. You are…", "sharing your results", ["hiding your work", "taking a nap"], "We share what we learn using pictures and words.", { d: 2 }),
  q("A timeline of your life helps you see…", "when events happened", ["how tall a tree is", "what the weather is"], "Timelines put events in order.", { d: 2 }),
  q("Which question can an old photo help answer?", "What did our street look like long ago?", ["What is Tuesday's lunch?", "Who is taller than the Moon?"], "Old photos are clues about the past.", { emoji: "📷" }),
  q("Who could you ask about your school's past?", "a long-time teacher", ["a toaster", "a puddle"], "People who were there can tell us about the past."),
  q("A graph shows 5 kids walk and 3 ride. Which is more?", "walk", ["ride", "They are the same"], "5 is more than 3.", { d: 2 }),
  q("To learn about a place far away, you can…", "look at a map or a book", ["guess without looking", "ask a rock"], "Books, maps and photos give us information."),
  q("A good detective uses their…", "eyes and ears to notice clues", ["pillow", "snack"], "Noticing carefully helps us find answers."),
  q("Which tool shows a whole community from above?", "a map", ["a spoon", "a clock"], "A map shows where things are."),
  q("The word “neighbourhood” means…", "the area around where you live", ["a type of cake", "a day of the week"], "Your neighbourhood is the part of the community near your home."),
  q("What is a good first step in an inquiry?", "Ask a question", ["Say the answer", "Stop looking"], "Inquiry begins with a good question.", { d: 2 }),
  q("You ask 5 friends their favourite park and make a tally. This is…", "collecting data", ["cleaning a desk", "hiding facts"], "Collecting facts helps us answer questions.", { d: 2 }),
  q("Which source is best to learn how a fire hall works?", "talking to a firefighter", ["guessing", "a cartoon about space"], "People who do the job know it best.", { d: 2 }),
  q("What is a conclusion?", "what you decide after looking at clues", ["the first clue", "a broken pencil"], "A conclusion is what the evidence tells us.", { d: 3 }),
  q("10 kids like swings and 4 like slides. What can you say?", "More kids like swings", ["More kids like slides", "All kids like both"], "10 is more than 4.", { d: 3 }),
  q("Which one is a fact about a library?", "It has a story corner.", ["It is the best place.", "Everyone must love it."], "A fact can be checked. An opinion is what someone thinks.", { d: 3 }),
];

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "my-roles",
    title: "My Roles & Responsibilities",
    emoji: "🧒",
    blurb: "Who I am at home, school and play",
    standards: on("A1.1, A1.4, A3.1, A3.2", "roles, relationships and responsibilities in different places, the people who matter to us, and how we affect each other"),
    parentNote: "Seeing that we have different roles (student, friend, sibling, helper), that these change from place to place, and how our actions affect others.",
    generate: unitOf(ROLES),
  },
  {
    id: "changes-in-my-life",
    title: "Changes in My Life",
    emoji: "📆",
    blurb: "Big events and putting them in order",
    standards: on("A1.2, A1.3, A3.3", "significant events in our lives, comparing them with other people's, and putting events in order"),
    parentNote: "Big life events (a new sibling, a move, starting school), how people's experiences are alike and different, and ordering events as a simple timeline.",
    generate: unitOf(CHANGES, [LIFE_ORDER]),
  },
  {
    id: "respect-and-inclusion",
    title: "Respect & Inclusion",
    emoji: "🤝",
    blurb: "Sharing, turns and caring for places",
    standards: on("A3.4, A3.5", "positive and inclusive behaviour, and treating people and the environment with respect"),
    parentNote: "Sharing, taking turns, listening, including others, and showing respect for people, belongings and the places we share.",
    generate: unitOf(RESPECT),
  },
  {
    id: "places-in-my-community",
    title: "Places in My Community",
    emoji: "🏘️",
    blurb: "Natural, built, near and far",
    standards: on("B3.2–B3.4", "natural and built features, different areas of a community, and where places are using words like near, far and beside"),
    parentNote: "Natural and built features, residential and commercial areas, and describing where places are with relative location words (near, far, beside, across).",
    generate: unitOf(PLACES, [NB_SORT]),
  },
  {
    id: "community-services",
    title: "Community Services",
    emoji: "🚒",
    blurb: "Helpers and who runs what",
    standards: on("B1.2, B3.8", "services and service jobs in the community, and which ones the government or community looks after"),
    parentNote: "Jobs that serve the community (fire, health, sanitation, libraries, transit) and services the government or community provides for everyone.",
    generate: unitOf(SERVICES),
  },
  {
    id: "measure-and-map",
    title: "Measure & Draw Maps",
    emoji: "👣",
    blurb: "Steps, hands and map symbols",
    standards: on("B3.5–B3.7, B2.3", "measuring with non-standard units, reading map parts and drawing a simple map"),
    parentNote: "Measuring distance with footsteps, blocks and hands, map titles, symbols and legends, and making a simple map of a familiar place.",
    generate: unitOf(MEASURE),
  },
  {
    id: "social-studies-detectives",
    title: "Social Studies Detectives",
    emoji: "🕵️",
    blurb: "Ask, gather, think and share",
    standards: on("A2.1, A2.2, A2.4, A2.6, B2.1, B2.2, B2.4, B2.6", "asking questions, gathering and interpreting information, and sharing results with the right words"),
    parentNote: "The inquiry process: asking good questions, finding clues in people, photos, maps and charts, thinking about what they show and sharing what we learned.",
    generate: unitOf(DETECTIVES),
  },
];
