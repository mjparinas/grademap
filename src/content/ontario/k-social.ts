import type { Unit } from "../types";
import { on } from "./kit";
import { e, order, q, sorter, unitOf, type Item } from "./k-g2-kit";

// Ontario Kindergarten social studies strands from the Kindergarten Curriculum (2026), Belonging and
// Contributing: D19 identity, D20 perspectives, D21 self-confidence, D22 people and places, D23 caring
// for nature. Indigenous content beyond the BC helpers unit is left for review with First Nations,
// Métis and Inuit partners.

// ---------- I Am Me ----------

const ME: Item[] = [
  q("Maya loves to draw. Drawing is something she…", "likes to do", ["is afraid of", "cannot see"], "An interest is something you like to do or learn about.", { emoji: "🎨" }),
  q("Which sentence tells what you like?", "I like painting.", ["It is raining.", "The bus is yellow."], "When we say what we like, we share our interests."),
  q("Jay learned to tie his shoes. How might he feel?", e("proud", "😊"), [e("sleepy", "😴"), e("cold", "🥶")], "Learning something new can make us feel proud."),
  q("Zoe finished a puzzle all by herself. What can she say?", "I did it!", ["I am nothing.", "Puzzles are bad."], "We can feel good about things we have done.", { emoji: "🧩" }),
  q("Sam likes soccer. Ana likes reading. Is that okay?", "Yes, people like different things", ["No, we must all like the same", "Only soccer is okay"], "Everyone has their own interests."),
  q("Which one is a way to share how you feel?", "Say, “I feel happy.”", ["Hide under a table", "Hit a friend"], "Words help others know how we feel.", { emoji: "🗣️" }),
  q("Noah is kind and always shares. That is one of his…", "strengths", ["worries", "colds"], "A strength is something you are good at or good for."),
  q("Which one is something to be proud of?", "Helping a friend", ["Taking a toy away", "Telling a fib"], "We can be proud when we do kind and helpful things."),
  q("It is show and tell. Lena shares her favourite book. She is…", "sharing something about herself", ["taking a nap", "going home"], "Show and tell lets us share what we like."),
  q("Priya says, “I can try again.” This helps her feel…", "brave", ["tiny", "frozen"], "Trying again helps us feel good about ourselves.", { d: 2 }),
  q("Which is a good thing to say to yourself?", "I can learn new things.", ["I can't do anything.", "I am worse than everyone."], "Kind words to ourselves help us keep trying.", { d: 2 }),
  q("Amir tells about a trip to the lake. What is he sharing?", "an experience", ["a rule", "a meal"], "An experience is something you did or saw.", { emoji: "🏞️", d: 2 }),
  q("You are good at singing. A friend is good at building. So…", "we each have strengths", ["only one of us is good", "neither of us is good"], "Everyone is good at something.", { d: 3 }),
  q("A friend says, “Tell me about your drawing.” What could you say?", "I drew my dog at the park.", ["Nothing.", "Go away."], "Telling about what we made helps us share our ideas.", { d: 3 }),
  q("Leo loves dinosaurs and reads about them. Dinosaurs are his…", "interest", ["weather", "shoe"], "An interest is something you like to learn about.", { emoji: "🦕" }),
  q("Kenji practised swimming and now floats. How might he feel?", e("proud", "😊"), [e("sleepy", "😴"), e("hungry", "🍽️")], "Learning something new can make us feel proud."),
  q("What can you say after you try something new?", "I tried my best.", ["I am no good at anything.", "I give up forever."], "Kind words to ourselves help us keep trying."),
  q("Which one is a strength?", "Zoe is good at counting.", ["Zoe has a red coat.", "Zoe has a cold."], "A strength is something you are good at."),
  q("Ana feels nervous about singing. What can help?", "Take a deep breath and try", ["Never sing again", "Hide forever"], "Deep breaths help us feel calm and brave.", { d: 2 }),
  q("Your drawing looks different from a friend's. That means…", "we each have our own ideas", ["yours is wrong", "drawing is bad"], "Everyone has their own ideas.", { emoji: "🖍️" }),
  q("Priya reads a new word. What can she say?", "I am getting better!", ["I will never learn.", "Reading is not for me."], "Practice helps us learn, one step at a time.", { d: 2 }),
  q("Which sentence tells about your family?", "I live with my grandma and dad.", ["The moon is round.", "Snow is cold."], "We can share who is in our family.", { d: 2 }),
  q("It is circle time. How can you share your idea?", "Raise your hand and speak", ["Shout over others", "Say nothing and frown"], "We share ideas by taking turns to talk."),
  q("Sam made a clay bowl and shows his class. He is sharing…", "something he made", ["a weather report", "a bus ticket"], "Showing what we make is a way to share about ourselves.", { emoji: "🏺" }),
  q("Noah falls while learning to skate. What does a brave kid do?", "Get up and try again", ["Say skating is bad", "Never go back"], "Trying again helps us grow.", { emoji: "⛸️", d: 3 }),
  q("A friend made a picture. What is a kind thing to say?", "I like your colours!", ["That is ugly.", "Give it to me."], "Kind words help people feel proud.", { d: 3 }),
];

// ---------- We Belong ----------

const BELONG: Item[] = [
  q("Which one is a group you can belong to?", "your class", ["a cloud", "a rock"], "Groups are people who do things together, like a class, a team or a family."),
  q("Kenji is in a family, a class and a soccer team. How many groups is that?", "3", ["1", "2"], "Count: family, class, team.", { d: 2 }),
  q("Which one is a way to help your class?", "Tidy up the books", ["Hide the crayons", "Take someone's seat"], "Helping makes our group better for everyone."),
  q("Who belongs to a family?", "Everyone", ["Only grown-ups", "Only kids"], "Every person belongs to a family. Families can be big or small."),
  q("Two kids look at one picture. One loves it. One does not. Why?", "People see things differently", ["One of them is wrong", "The picture is magic"], "Everyone can think and feel differently, and that is okay."),
  q("Zoe likes quiet games. Sam likes loud games. What can they do?", "Take turns choosing", ["Argue", "Stop playing forever"], "Taking turns is a fair way to include both ideas."),
  q("Your class paints a big mural. Each child paints a part. The mural is…", "better because everyone helped", ["only for one child", "ruined"], "Each person adds something special to the group.", { emoji: "🖼️" }),
  q("A friend is talking. How do you show respect?", "Listen", ["Cover your ears", "Walk away"], "Listening shows we care about what others think.", { emoji: "👂" }),
  q("People in our class speak many languages. That makes our class…", "full of many voices", ["too loud for school", "boring"], "Canada has people from many places and many languages."),
  q("Which is a way you help at home?", "Put away my toys", ["Draw on the walls", "Hide the shoes"], "Helping at home is a way to give to your family."),
  q("What do people in a group share?", "Time and ideas", ["Nothing at all", "Only snacks"], "Groups share time, ideas and things.", { d: 2 }),
  q("A new child joins your class. How can you help them feel part of the group?", "Say hello and invite them to play", ["Ignore them", "Tell them to leave"], "Welcoming others helps everyone belong.", { d: 2 }),
  q("A friend celebrates in a different way than your family. You can…", "listen and ask kind questions", ["say it is silly", "laugh at them"], "Respecting differences helps us learn from each other.", { d: 2 }),
  q("Your friend has a different idea about how to build. What do you do?", "Listen to the idea", ["Say “That is dumb”", "Break the tower"], "Listening to different ideas helps teams build better things.", { d: 3 }),
  q("What do all the people in Canada have in common?", "They live in the same country", ["They all look the same", "They all eat the same food"], "People in Canada are different in many ways, and we all share the same country.", { d: 3 }),
  q("Maya plays on a soccer team. Who is in her group?", "her teammates", ["the stars", "the clouds"], "A team is a group of people who play together.", { emoji: "⚽" }),
  q("A group has a rule: line up quietly. Why?", "So everyone can move safely", ["To make it boring", "To be mean"], "Group rules help everyone feel safe."),
  q("Who can be part of your community?", "Neighbours and friends", ["Only one person", "Nobody"], "A community is the people who live, work and play near each other."),
  q("Jay has one idea. Lena has a different one. What is a fair way?", "Try both ideas", ["Say Lena is wrong", "Stop playing"], "Trying both ideas lets everyone take part.", { d: 2 }),
  q("Your class has a job chart. Why?", "So everyone can help", ["So one child does it all", "To hide the jobs"], "Everyone helps make the class a good place."),
  q("A class has 20 children. A school has many classes. Which has more people?", "the school", ["the class", "They are the same"], "A school is a bigger group than one class.", { d: 2 }),
  q("Zoe sits alone at lunch. What can you do?", "Ask her to sit with you", ["Ignore her", "Take her lunch"], "Inviting someone helps them belong.", { emoji: "🍎" }),
  q("How can you include everyone in a game?", "Change the rules so all can play", ["Pick only your best friend", "Let only fast kids play"], "Good groups make room for everybody.", { d: 2 }),
  q("Sam and Ana have different ideas for a story. What can they do?", "Mix their ideas together", ["Fight", "Stop the story"], "Putting ideas together can make something new.", { d: 3 }),
  q("What can you say if you see things differently?", "I see it another way.", ["You are silly.", "Be quiet."], "We can disagree in a kind way.", { d: 3 }),
];

// ---------- Fair and Kind ----------

const FAIR: Item[] = [
  q("Which one is fair?", "Everyone gets a turn", ["Only my friends get a turn", "The biggest kid goes first, always"], "Fair means everyone is treated well and gets a chance."),
  q("A child is left out of the game. What is a kind thing to do?", "Invite them to play", ["Ignore them", "Laugh"], "Inviting someone in helps them feel they belong.", { emoji: "🧒" }),
  q("Someone says, “Girls can't be firefighters.” Is that true?", "No, anyone can", ["Yes, always", "Only on Tuesdays"], "A person's job does not depend on being a girl or a boy.", { emoji: "🚒" }),
  q("A friend is crying. What can you do?", "Ask, “Are you okay?”", ["Walk away", "Laugh"], "Showing care helps a friend feel better.", { emoji: "😢" }),
  q("Which words are kind?", "May I join you?", ["You can't play.", "Go away!"], "Kind words make friends."),
  q("Someone is teasing a child about their lunch. What can you say?", "Please stop. Everyone eats different foods.", ["Ha ha!", "Nothing, and join in"], "Speaking up kindly can stop teasing.", { d: 2 }),
  q("Someone takes your pencil. What can you say?", "Please give it back. It is mine.", ["Nothing, ever", "Hit them"], "We can stand up for ourselves with calm, strong words."),
  q("If you see someone being hurt, what is a good choice?", "Tell a grown-up", ["Watch and smile", "Join in"], "Getting help is a good and brave choice.", { d: 2 }),
  q("Is it fair if only some kids get to use the swings?", "No", ["Yes", "It depends on their hair"], "Fair means everyone gets a chance.", { d: 2 }),
  q("A kid has an accent. A classmate copies it to be mean. Is that okay?", "No, it is unkind", ["Yes, it is funny", "Yes, if no one tells"], "Making fun of how someone talks is hurtful.", { d: 2 }),
  q("You and a friend both want the red crayon. What is a fair idea?", "Take turns using it", ["Grab it", "Break it"], "Sharing and taking turns are fair."),
  q("A friend says, “You can't play because you look different.” This is…", "unfair", ["fair", "a rule"], "It is not fair to leave someone out because of how they look.", { d: 2 }),
  q("How can you help someone who is being treated unfairly?", "Stand up with them and tell a grown-up", ["Stay quiet", "Make it worse"], "Standing up with others shows kindness and courage.", { d: 3 }),
  q("You are kind to a classmate. How might they feel?", e("happy", "😊"), [e("sad", "😢"), e("left out", "😞")], "Kindness helps people feel safe and happy.", { d: 2 }),
  q("Is it okay to say, “That's not nice. Please stop.”?", "Yes, it is a good way to speak up", ["No, never", "Only to grown-ups"], "We can use our voice to stand up for ourselves and for others.", { d: 3 }),
  q("Two kids want the same swing. What is fair?", "Take turns", ["The bigger kid always wins", "Pull it apart"], "Taking turns gives everyone a chance.", { emoji: "🎠" }),
  q("One child gets many more stickers than everyone else. Is it fair?", "No, it is not fair", ["Yes, it is fair", "Only if you are tall"], "Fair means everyone gets the same chance.", { d: 2 }),
  q("You spilled paint by mistake. What is kind to do?", "Say sorry and help clean up", ["Blame a friend", "Hide it"], "Owning up and helping fix it is kind.", { emoji: "🎨" }),
  q("A friend shares a snack with you. What do you say?", "Thank you!", ["Not enough.", "Nothing."], "Saying thank you shows kindness."),
  q("Which one is a kind action?", "Holding the door for someone", ["Shutting it on a friend", "Pushing in line"], "Small kind acts make a big difference."),
  q("A classmate uses a wheelchair. How can you include them in a game?", "Pick a game everyone can play", ["Leave them out", "Pick a game they can't join"], "Fair games make room for everyone.", { d: 2 }),
  q("Someone says something hurtful. How might the other child feel?", e("sad", "😢"), [e("proud", "😊"), e("sleepy", "😴")], "Hurtful words can make people feel sad."),
  q("A child dropped their books. What is kind?", "Help pick them up", ["Walk by laughing", "Kick them"], "Helping out is a kind choice.", { emoji: "📚" }),
  q("Every child in the class gets a turn to hold the class pet. This is…", "fair", ["unfair", "a secret"], "Fair means everyone gets a chance.", { d: 2 }),
  q("A friend says, “I don't like it when you do that.” What do you do?", "Stop and say sorry", ["Do it more", "Laugh"], "Listening to a friend's feelings is kind.", { d: 3 }),
  q("A child does not understand the game. A kind friend will…", "explain it gently", ["tease them", "leave them"], "Kind friends help others join in.", { d: 3 }),
];

// ---------- Places Near Me ----------

const PLACES: Item[] = [
  q("Where can you borrow books?", e("library", "📚"), [e("bakery", "🥖"), e("fire hall", "🚒")], "You can borrow books at the library."),
  q("Where do families buy food?", e("grocery store", "🛒"), [e("library", "📚"), e("park", "🌳")], "Grocery stores sell food."),
  q("Where can you go to learn?", e("school", "🏫"), [e("pool", "🏊"), e("bank", "🏦")], "Children go to school to learn."),
  q("Where do people go when they are sick or hurt?", e("hospital", "🏥"), [e("bakery", "🥖"), e("park", "🌳")], "Doctors and nurses help at the hospital."),
  q("Where can you slide and swing?", e("park", "🛝"), [e("hospital", "🏥"), e("grocery store", "🛒")], "A park has a playground for play."),
  q("Where does a fire truck come from?", e("fire hall", "🚒"), [e("library", "📚"), e("school", "🏫")], "Firefighters work at the fire hall."),
  q("Which one is a natural place in a community?", e("a river", "🏞️"), [e("a store", "🏪"), e("a bus stop", "🚏")], "Rivers, lakes and forests are natural places.", { d: 2 }),
  q("Which one is a built place in a community?", e("a post office", "📮"), [e("a lake", "🏞️"), e("a forest", "🌲")], "People built the post office.", { d: 2 }),
  q("Who works at a school?", "teachers", ["only pilots", "only farmers"], "Teachers and other helpers work at schools.", { emoji: "🧑‍🏫" }),
  q("Who delivers letters and packages?", "a mail carrier", ["a baker", "a dentist"], "Mail carriers bring mail to our homes.", { emoji: "📬" }),
  q("Who keeps our teeth healthy?", "a dentist", ["a pilot", "a bus driver"], "A dentist takes care of teeth.", { emoji: "🦷" }),
  q("A park and a pond are both near your home. What do they have in common?", "Both are outdoors", ["Both are inside", "Both sell food"], "Parks and ponds are places outside.", { d: 3 }),
  q("Which place helps people send a letter?", e("post office", "📮"), [e("pool", "🏊"), e("library", "📚")], "At the post office, we can mail letters.", { d: 2 }),
  q("A place in your community has ice, and people skate. It is a…", e("rink", "⛸️"), [e("bakery", "🥖"), e("bank", "🏦")], "People skate and play hockey in an arena or rink.", { d: 2 }),
  q("Which person helps keep us safe on the road?", "a crossing guard", ["a baker", "a clown"], "A crossing guard helps children cross the street.", { emoji: "🚸" }),
];

const PLACES_SORT = sorter({
  prompt: "Nature or built? Tap a place, then its basket.",
  hint: "Natural places were not made by people. Built places were.",
  bins: [
    { id: "nature", label: "Nature", emoji: "🌿" },
    { id: "built", label: "Built", emoji: "🏗️" },
  ],
  items: [
    { label: "forest", emoji: "🌲", bin: "nature" },
    { label: "lake", emoji: "🏞️", bin: "nature" },
    { label: "hill", emoji: "⛰️", bin: "nature" },
    { label: "meadow", emoji: "🌾", bin: "nature" },
    { label: "library", emoji: "📚", bin: "built" },
    { label: "store", emoji: "🏪", bin: "built" },
    { label: "school", emoji: "🏫", bin: "built" },
    { label: "bridge", emoji: "🌉", bin: "built" },
  ],
});

// ---------- Caring for Nature ----------

const NATURE: Item[] = [
  q("Which one helps keep nature clean?", "Put litter in the bin", ["Drop litter on the ground", "Throw trash in the pond"], "Litter can harm animals and water.", { emoji: "🗑️" }),
  q("How can you care for a plant?", "Give it water and light", ["Pick all its leaves", "Put it in a dark closet"], "Plants need water, light and air.", { emoji: "🪴" }),
  q("What if all the trees in a park were cut down?", "Birds and squirrels would lose homes", ["Nothing would change", "More snow would fall"], "Many animals live in trees.", { emoji: "🌳" }),
  q("What if a pond dried up?", "Fish and frogs would need a new home", ["Nothing would change", "The ducks would be happier"], "Animals that live in water need the water.", { emoji: "🐸" }),
  q("What can you do when you brush your teeth to save water?", "Turn off the tap", ["Leave the water running", "Fill the sink with soap"], "Saving water helps the Earth.", { emoji: "🚰" }),
  q("A forest and a beach are both outdoors. What is different?", "A beach has sand", ["A forest has sand", "Neither has plants"], "Beaches have sand and water. Forests have many trees."),
  q("What is the same in a forest and a park?", "They both have plants and animals", ["They both have a roof", "They both have desks"], "Many places have living things.", { d: 2 }),
  q("Which is a way to show respect for animals outside?", "Watch them quietly", ["Chase them", "Throw stones at them"], "We can look at wildlife from a distance and be gentle."),
  q("What can you do with a paper you do not need?", "Put it in the recycling bin", ["Throw it in a river", "Bury it in a garden"], "Recycling paper helps trees.", { emoji: "♻️", d: 2 }),
  q("Why should we not pick all the wildflowers?", "Bees and butterflies need them", ["They are too heavy", "They make noise"], "Flowers give food to insects.", { emoji: "🌼", d: 2 }),
  q("If there is no rain for a long time, what happens to a garden?", "The plants get dry", ["The plants grow taller", "The plants sing"], "Plants need water to grow.", { d: 2 }),
  q("What can you do with a plastic bottle you finish?", "Put it in the recycling bin", ["Leave it at the beach", "Hide it in a bush"], "Recycling helps keep nature clean.", { d: 2 }),
  q("If the weather turns very cold, what might a bird need?", "A warm place and food", ["A swimsuit", "A bicycle"], "Animals need shelter and food when it is cold.", { d: 3 }),
  q("A big tree is in the school yard. What can you do to care for it?", "Not break its branches", ["Climb to the very top", "Peel off its bark"], "Trees are alive. We can be gentle with them.", { d: 3 }),
  q("A lake and a river are the same because they both have…", "water", ["sand only", "snow only"], "Both are bodies of fresh water.", { d: 3 }),
];

const CARE_SORT = sorter({
  prompt: "Helps nature or hurts nature? Tap, then tap a basket.",
  hint: "Think: is it kind to plants, animals and water?",
  bins: [
    { id: "help", label: "Helps", emoji: "💚" },
    { id: "hurt", label: "Hurts", emoji: "💔" },
  ],
  items: [
    { label: "planting a tree", emoji: "🌱", bin: "help" },
    { label: "recycling paper", emoji: "♻️", bin: "help" },
    { label: "turning off the tap", emoji: "🚰", bin: "help" },
    { label: "picking up litter", emoji: "🧤", bin: "help" },
    { label: "dropping garbage", emoji: "🗑️", bin: "hurt" },
    { label: "pouring paint in a pond", emoji: "🎨", bin: "hurt" },
    { label: "leaving the water on", emoji: "💦", bin: "hurt" },
    { label: "breaking tree branches", emoji: "🪵", bin: "hurt" },
  ],
});

const GROW = order("Put the plant's growing in order.", "A seed is planted, a sprout comes up, then a plant grows and makes flowers.", [
  ["Plant a seed", "🌰"],
  ["A sprout grows", "🌱"],
  ["A plant grows", "🪴"],
  ["A flower blooms", "🌸"],
]);

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "i-am-me",
    title: "I Am Me",
    emoji: "🌟",
    blurb: "My interests and strengths",
    standards: on("D19.1–D19.3", "recognizing interests, strengths and accomplishments, and sharing thoughts and experiences"),
    parentNote: "Noticing what we like and are good at, feeling proud of things we have done, and finding words to share our thoughts and experiences.",
    generate: unitOf(ME),
  },
  {
    id: "we-belong",
    title: "We Belong",
    emoji: "🤝",
    blurb: "Groups, ideas and ways to help",
    standards: on("D20.1–D20.3", "belonging to groups, contributing to them, and respecting other points of view"),
    parentNote: "Seeing that everyone belongs to several groups (family, class, team, community), how each person helps, and respecting ideas that differ from our own.",
    generate: unitOf(BELONG),
  },
  {
    id: "fair-and-kind",
    title: "Fair & Kind",
    emoji: "💛",
    blurb: "Speak up and be kind",
    standards: on("D21.1–D21.3", "standing up for ourselves and others, noticing what is fair and unfair, and acting with kindness"),
    parentNote: "Noticing fair and unfair choices, using kind words, standing up for ourselves and others, and getting a grown-up to help.",
    generate: unitOf(FAIR),
  },
  {
    id: "places-near-me",
    title: "Places Near Me",
    emoji: "🏘️",
    blurb: "Buildings, nature and what they are for",
    standards: on("D22.2, D23.1", "natural and built places in the community and what they are for; how local places are alike and different"),
    parentNote: "Naming places in the community (library, park, school, hospital), what they are used for, and whether they are natural or built.",
    generate: unitOf(PLACES, [PLACES_SORT]),
  },
  {
    id: "caring-for-nature",
    title: "Caring for Nature",
    emoji: "🌳",
    blurb: "What would happen if it changed?",
    standards: on("D23.1–D23.3", "similarities and differences between local environments, what changes could do, and ways to care for nature"),
    parentNote: "Thinking about what happens when a local place changes, and simple ways to care for plants, animals, water and the land.",
    generate: unitOf(NATURE, [CARE_SORT, GROW]),
  },
];
