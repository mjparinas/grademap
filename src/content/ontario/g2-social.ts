import { pick } from "../random";
import type { Unit } from "../types";
import { on } from "./kit";
import { order, q, sorter, unitOf, type Item } from "./k-g2-kit";

// Ontario Grade 2 social studies (2023): A. Heritage and Identity, Changing Family and Community
// Traditions; B. People and Environments, Global Communities. BC's needs-and-wants and
// caring-citizens units are shared (see g2.ts); BC's Canada-regions unit is not, because it names
// British Columbia. Expectations about First Nations, Métis and Inuit traditions and communities
// (A1.1 and A1.4 in part, A3.4 and A3.7 in part, B3.7) are left for writing with Indigenous partners.

// ---------- Families ----------

const FAMILIES: Item[] = [
  q("Which is true about families?", "Families come in many shapes and sizes", ["All families look the same", "Only big families are real"], "Some families have one parent, two parents, grandparents, guardians or foster parents, and many different mixes."),
  q("Ravi lives with his grandmother and his aunt. Is that a family?", "Yes", ["No", "Only on holidays"], "A family is people who care for each other."),
  q("Maya has two moms. Leo has a mom and a dad. Both are…", "families", ["not families", "classrooms"], "Families can have different kinds of parents or caregivers."),
  q("A multigenerational family is one where…", "grandparents, parents and kids live together", ["only pets live", "only teachers live"], "Multigenerational means more than two generations.", { d: 2 }),
  q("A blended family is one where…", "two families join together", ["a family has only one child", "everyone has the same name"], "Sometimes parents and children join to make a new, bigger family.", { d: 2 }),
  q("Sam has foster parents. Foster parents are…", "adults who care for a child for a time", ["pretend families", "visitors who never help"], "Foster families take care of children who need a safe home.", { d: 2 }),
  q("A friend is adopted. This means…", "their parents chose to make them part of the family", ["they are a visitor", "they live at school"], "Adoption is one way families form.", { d: 2 }),
  q("Which is a good way to ask about a friend's family?", "“Who is in your family?”", ["“Your family is weird.”", "“You do not have a real family.”"], "Be curious and kind. Every family is real."),
  q("Priya's family eats dinner together each Sunday. This is…", "a family routine", ["a school rule", "a game"], "Routines and traditions are part of family life.", { d: 2 }),
  q("Families may speak different languages at home. This makes our community…", "richer and more interesting", ["confusing for no reason", "less friendly"], "Many languages mean many ways of sharing ideas and stories.", { d: 2 }),
  q("Kenji's family has two homes because his parents live apart. Is that okay?", "Yes, families can live in different ways", ["No, it is wrong", "Only one home counts"], "Families arrange their lives in different ways, and all can be loving.", { d: 3 }),
  q("What do all families need to do?", "Care for each other", ["Look alike", "Eat the same food"], "Caring for each other is what families share."),
];

// ---------- Traditions and Celebrations ----------

const TRADITIONS: Item[] = [
  q("What is a tradition?", "Something a family or group does again and again", ["Something you do only once", "A kind of weather"], "Traditions are practices passed from one time to the next."),
  q("Diwali is called the festival of…", "lights", ["snow", "kites"], "Many families celebrate Diwali with lamps, lights, sweets and rangoli.", { emoji: "🪔" }),
  q("Lunar New Year is celebrated with…", "family meals, lanterns and red decorations", ["only a long swim", "only skiing"], "Lunar New Year is an important celebration in many communities.", { emoji: "🏮" }),
  q("Which celebration takes place on July 1?", "Canada Day", ["Remembrance Day", "Halloween"], "Canada Day marks the anniversary of Confederation in 1867.", { emoji: "🇨🇦" }),
  q("Which day do many people in Canada remember those who served in wars?", "Remembrance Day (November 11)", ["Valentine's Day", "Canada Day"], "We pause at 11 a.m. on November 11 to remember.", { d: 2 }),
  q("Eid al-Fitr is a celebration for many Muslim families. It comes at the end of…", "Ramadan", ["summer", "the school year"], "Families share meals, prayers, gifts and time together.", { d: 2 }),
  q("Hanukkah is a Jewish celebration. A candleholder used then is called a…", "menorah (or hanukkiah)", ["trumpet", "snowman"], "Candles are lit for eight nights.", { emoji: "🕎", d: 2 }),
  q("Kwanzaa is a celebration of African heritage. It begins on…", "December 26", ["July 1", "October 31"], "Kwanzaa is observed for seven days from December 26 to January 1.", { d: 3 }),
  q("Many families in Canada share a big meal for Thanksgiving. It is held in…", "October", ["April", "July"], "Thanksgiving in Canada is on the second Monday of October.", { d: 2 }),
  q("A recipe passed from grandmother to grandchild is a way to pass on…", "heritage", ["weather", "homework"], "Food, songs, stories and languages carry our heritage.", { d: 2 }),
  q("Which of these is a way to pass on heritage?", "Teaching a song in your family language", ["Throwing away old photos", "Forgetting your stories"], "Songs, stories and language keep traditions alive.", { d: 2 }),
  q("Your friend's family celebrates something you do not. What is a respectful question?", "“Can you tell me about it?”", ["“Why is that silly?”", "“Stop celebrating.”"], "Asking with respect helps us learn about each other."),
  q("Families may change a tradition over time. One reason could be…", "they moved to a new place", ["the Sun is blue", "they forgot their names"], "Moving, new ideas and new people can change how we celebrate.", { d: 3 }),
  q("Birthdays are celebrated by people all over the world. What is common?", "People mark growing another year", ["Everyone has the same cake", "Everyone sings the same song"], "Different cultures celebrate birthdays in different ways.", { d: 3 }),
  q("Which is a celebration, not a regular day?", "a wedding", ["a Tuesday lunch", "a bus ride"], "A celebration is a special event.", { d: 2 }),
];

// ---------- Then and Now ----------

const GENERATIONS = order("Put the generations in order, from oldest to youngest.", "Great-grandparent, grandparent, parent, child.", [
  ["great-grandparent", "👵"],
  ["grandparent", "🧓"],
  ["parent", "🧑"],
  ["child", "🧒"],
]);

const OLDER_YOUNGER = order("Put the family from the youngest to the oldest.", "A baby is younger than a child, and a child is younger than a parent, then a grandparent.", [
  ["baby", "👶"],
  ["child", "🧒"],
  ["parent", "🧑"],
  ["grandparent", "🧓"],
]);

const THENNOW: Item[] = [
  q("A generation is…", "people of about the same age in a family", ["a kind of food", "a tool"], "Your grandparents are one generation, your parents another, and you another."),
  q("Which person is from an older generation than your parents?", "your grandparent", ["your sibling", "your classmate"], "Grandparents were born before parents."),
  q("Long ago, how did families keep in touch when far apart?", "They wrote letters", ["They sent video chats", "They used text messages"], "Technology changes how we share news.", { d: 2 }),
  q("Today, how can families far apart talk and see each other?", "Video calls", ["Pigeon post only", "They cannot"], "Technology has changed how we celebrate together.", { d: 2 }),
  q("Which tells about the past?", "an old photo album", ["tomorrow's weather", "a new toy"], "Photos and stories help us learn about the past.", { emoji: "📷" }),
  q("How can you learn what life was like when your grandparents were young?", "Ask them questions", ["Guess only", "Ask a pet"], "Interviews are a good way to learn about the past.", { d: 2 }),
  q("A timeline shows…", "events in order of time", ["only colours", "only weather"], "Timelines show what happened first, next and last."),
  q("Which came first? A rotary phone or a smartphone?", "rotary phone", ["smartphone", "They came together"], "Technology changes over time.", { d: 2 }),
  q("Your family has made the same dish for many years. This is a…", "tradition", ["mistake", "storm"], "A tradition lasts across generations."),
  q("A family moves to a new country. How might traditions change?", "They may add new foods and keep old ones", ["They must stop all traditions", "Nothing changes ever"], "Families often blend old and new ways.", { d: 3 }),
  q("Long ago many clothes were made at home. Today many are…", "bought from stores", ["grown from seeds", "made by the Moon"], "Ways of living change over time.", { d: 2 }),
  q("Past and present both describe time. “Present” means…", "now", ["long ago", "never"], "The present is today. The past is before now.", { d: 2 }),
  q("A great-grandparent is a parent of your…", "grandparent", ["sibling", "neighbour"], "Great-grandparents are two generations before you.", { d: 3 }),
  q("When does a family often use a family tree?", "to show who is related", ["to measure rain", "to tell time"], "A family tree shows relatives from different generations.", { d: 3 }),
];

// ---------- Groups and Places We Come From ----------

const GROUPS: Item[] = [
  q("Our community has people from many cultures. This is called…", "diversity", ["a rule", "a map"], "Diverse means many different kinds of people."),
  q("Which could be a group in a community?", "a soccer team", ["a puddle", "a hill"], "Groups are people who share an interest, a place or a background."),
  q("People may come to Canada from other countries for…", "many different reasons", ["only one reason", "no reason"], "Families may move for safety, work, school or to join family.", { d: 2 }),
  q("A newcomer family arrives in your town. What can you do?", "Welcome them kindly", ["Ignore them", "Laugh at their words"], "Welcoming new neighbours builds a strong community."),
  q("A globe is…", "a model of the whole Earth", ["a model of the Moon", "a kind of ball game"], "A globe shows the shape of Earth with lands and oceans."),
  q("You can find the place your grandparents came from on…", "a map or a globe", ["a clock", "a calendar"], "Maps and globes help us find places in the world.", { d: 2 }),
  q("Your friend's family came from Jamaica. Where is Jamaica?", "In the Caribbean Sea", ["In the Arctic", "In the Sahara Desert"], "Jamaica is an island country in the Caribbean.", { d: 3 }),
  q("Your classmate's family is from Poland. Poland is in…", "Europe", ["Asia", "South America"], "Poland is a country in central Europe.", { d: 3 }),
  q("A friend's family is from India. India is in…", "Asia", ["Europe", "Africa"], "India is a large country in South Asia.", { d: 3 }),
  q("A language is…", "words people use to talk and write", ["a kind of bird", "a kind of game"], "Many languages are spoken in our community."),
  q("Why do many places in Canada have signs in more than one language?", "Because many people speak different languages", ["Because signs like colour", "Because it is a rule for pets"], "Canada has two official languages, English and French, and many other languages are spoken.", { d: 2 }),
  q("Which could be a group in a school?", "a choir", ["a thunderstorm", "a pencil"], "People who share an activity form a group.", { d: 2 }),
  q("People celebrate heritage by sharing…", "food, music and stories", ["homework", "traffic"], "Heritage is passed on through traditions.", { d: 2 }),
];

// ---------- Globe and Continents ----------

const GLOBE: Item[] = [
  q("How many continents are there?", "7", ["3", "12"], "The seven continents are Africa, Antarctica, Asia, Australia (Oceania), Europe, North America and South America."),
  q("Which continent do we live on in Canada?", "North America", ["Asia", "Europe"], "Canada is in North America."),
  q("Which continent is the biggest?", "Asia", ["Europe", "Australia"], "Asia is the largest continent.", { d: 2 }),
  q("Which continent is very cold and covered in ice at the South Pole?", "Antarctica", ["Africa", "Asia"], "Antarctica is at the South Pole.", { d: 2 }),
  q("Egypt is on which continent?", "Africa", ["Europe", "South America"], "Egypt is in northeastern Africa.", { d: 2 }),
  q("Brazil is on which continent?", "South America", ["Africa", "Asia"], "Brazil is the largest country in South America.", { d: 2 }),
  q("Japan is on which continent?", "Asia", ["Africa", "Europe"], "Japan is a group of islands in East Asia.", { d: 2 }),
  q("France is on which continent?", "Europe", ["Asia", "North America"], "France is in western Europe.", { d: 2 }),
  q("Which line goes around the middle of Earth?", "the equator", ["the Arctic Circle", "the horizon"], "The equator is an imaginary line halfway between the poles."),
  q("Is it usually warmer near the equator or near the poles?", "near the equator", ["near the poles", "It is always the same"], "The Sun's rays hit the equator most directly, so it is warmer there."),
  q("Which two points are at the very top and bottom of Earth?", "the North Pole and South Pole", ["the equator and the oceans", "Canada and Mexico"], "The poles are the coldest places on Earth.", { d: 2 }),
  q("The equator splits Earth into…", "two hemispheres", ["three oceans", "four seasons"], "The Northern Hemisphere and Southern Hemisphere.", { d: 2 }),
  q("Which ocean is the largest?", "Pacific Ocean", ["Arctic Ocean", "Atlantic Ocean"], "The Pacific is the biggest and deepest ocean.", { d: 3 }),
  q("Canada touches three oceans. One is the…", "Atlantic Ocean", ["Indian Ocean", "Southern Ocean"], "Canada touches the Atlantic, Pacific and Arctic oceans.", { d: 3 }),
  q("On a map, N, S, E and W mean…", "north, south, east and west", ["no, so, easy and warm", "new, soft, early and wet"], "These are the cardinal directions."),
  q("Going north on a map takes you toward the…", "North Pole", ["equator", "South Pole"], "North points to the top of most maps.", { d: 2 }),
  q("If you travel east from Toronto, you could reach…", "Montreal", ["Vancouver", "Victoria"], "Montréal is east of Toronto. Vancouver and Victoria are far to the west.", { d: 3 }),
];

const CONTINENT_SORT = sorter({
  prompt: "Which continent is it in? Tap a place, then its basket.",
  hint: "Think about a map: Egypt and Kenya are in Africa. Japan and India are in Asia. France and Italy are in Europe.",
  bins: [
    { id: "africa", label: "Africa", emoji: "🌍" },
    { id: "asia", label: "Asia", emoji: "🌏" },
    { id: "europe", label: "Europe", emoji: "🗼" },
  ],
  items: [
    { label: "Egypt", emoji: "🏜️", bin: "africa" },
    { label: "Kenya", emoji: "🦁", bin: "africa" },
    { label: "Japan", emoji: "🗾", bin: "asia" },
    { label: "India", emoji: "🪷", bin: "asia" },
    { label: "France", emoji: "🥐", bin: "europe" },
    { label: "Italy", emoji: "🍕", bin: "europe" },
  ],
});

// ---------- Climate and Ways of Life ----------

const CLIMATE: Item[] = [
  q("Climate means…", "the usual weather in a place over many years", ["today's lunch", "the time of day"], "Climate is the weather that is typical over a long time."),
  q("In a hot, sunny place, people often wear…", "light clothes", ["heavy snowsuits", "ski boots"], "People dress for their weather."),
  q("A place with lots of rain and warmth, like a rainforest, has…", "many plants and trees", ["no plants at all", "only ice"], "Warm and wet places grow lots of plants."),
  q("A desert gets very little…", "rain", ["sun", "sand"], "Deserts are dry places.", { emoji: "🏜️" }),
  q("Why might a house in a rainy place have a steep roof?", "so rain runs off", ["to grow bananas", "for fun only"], "People build homes that suit the weather.", { d: 2 }),
  q("Where might people wear thick coats most of the year?", "near the poles", ["near the equator", "in a rainforest"], "Polar regions have cold weather.", { d: 2 }),
  q("People who live by the ocean often work as…", "fishers and port workers", ["only miners", "only skiers"], "Jobs often depend on the land and water nearby.", { emoji: "🎣" }),
  q("In a place with deep winter snow, people might…", "plow roads and use snow tires", ["swim all winter", "use no coats"], "People adapt to their climate.", { d: 2 }),
  q("People in dry places save water. Why?", "There is not much of it", ["It is too sweet", "It tastes like juice"], "Where water is scarce, people take special care of it.", { d: 3 }),
  q("A photo shows people in light clothes, a beach and palm trees. The climate is probably…", "warm", ["freezing", "icy"], "We can find clues about climate in photos.", { d: 3 }),
  q("A photo shows snow-covered mountains and people in parkas. The climate is probably…", "cold", ["hot", "dry desert"], "Snow and warm coats are clues about cold weather.", { d: 3 }),
  q("In flat farming lands with lots of sun and rain, many people grow…", "crops", ["icebergs", "snowmen"], "Farmers grow food where the land and weather help plants grow.", { d: 2 }),
  q("People who live in mountains sometimes build terraces. Why?", "To grow food on steep slopes", ["To keep rain away from houses only", "To make a swimming pool"], "Terraces are flat steps cut into a slope for farming.", { d: 3 }),
  q("Which of these is a physical feature?", "a mountain", ["a school", "a store"], "Mountains, rivers and lakes are physical features.", { d: 2 }),
  q("Which map symbol could show a river?", "a blue line", ["a red square", "a green circle"], "Maps often use blue for water.", { d: 2 }),
];

// ---------- Communities Compared ----------

const COMPARED: Item[] = [
  q("A community is…", "a place where people live, work and play together", ["a kind of food", "a type of weather"], "Communities can be big cities or tiny villages."),
  q("Two communities can be different. How might they differ?", "in size, climate and food", ["in nothing", "in the number of Moons"], "Communities can look and feel different."),
  q("What do all communities need?", "food, water, shelter and clothing", ["TV and toys only", "snow"], "Everyone has basic needs."),
  q("In a big city, how do many people get around?", "buses, trains and subways", ["only boats", "only horses"], "Cities often have public transit."),
  q("In a small village, how might people travel?", "walking, bikes or a car", ["only a subway", "only an airplane"], "Villages are often small enough to walk.", { d: 2 }),
  q("Two communities, one hot and one cold. How might homes differ?", "The cold one needs warm walls", ["Both need ice roofs", "Neither needs a roof"], "People build homes to suit their weather.", { d: 2 }),
  q("A fishing village is by the sea. A farming town is in the plains. What is different?", "the main jobs", ["the number of Suns", "the colour of the sky only"], "Jobs often fit what the land and water offer.", { d: 2 }),
  q("What is the same in every community?", "People need clean water", ["It always snows", "Everyone speaks English"], "Clean water is a basic need everywhere.", { d: 2 }),
  q("Which could be a way your community is similar to a community far away?", "People go to school and play", ["Everyone owns a boat", "It has the same weather"], "Communities share many things, even when they look different.", { d: 3 }),
  q("Which question helps you compare two communities?", "How do people get food there?", ["What is the Moon's name?", "How many cars can fly?"], "A good comparing question looks at needs and ways of living.", { d: 3 }),
  q("A city has tall apartment buildings. Why do cities build up?", "Many people live close together", ["Buildings like clouds", "To block the Sun"], "Tall buildings use less land for more people.", { d: 3 }),
  q("In a rural community, you might see…", "farms and open land", ["a skyscraper in every block", "a subway under every house"], "Rural means in the countryside.", { d: 2 }),
  q("In an urban community, you might see…", "many people, buildings and busy streets", ["only farm fields", "only forest"], "Urban means in a town or city.", { d: 2 }),
];

// ---------- Social Studies Detectives ----------

const DETECTIVES: Item[] = [
  q("Which is a good question for investigating traditions?", "How did my grandparents celebrate?", ["How tall is the moon?", "What is 5 + 5?"], "Good questions are about the topic we are studying."),
  q("Where could you find information about a community far away?", "A book, a map or a trusted website", ["A guess", "A rock"], "Different sources give different information."),
  q("A photo from long ago is an example of a…", "primary source", ["a made-up story", "a dream"], "A primary source is a record made at the time or from someone who was there.", { d: 2 }),
  q("An interview with your grandparent is a…", "primary source", ["rumour", "toy"], "Hearing from a person who lived it is a primary source.", { d: 2 }),
  q("A class graph shows favourite celebrations. What can you tell from it?", "which one is chosen most", ["what the weather is", "how far away the Sun is"], "Graphs show information at a glance."),
  q("You have a map of the world. You can find…", "oceans and continents", ["what you had for lunch", "who is tallest"], "Maps show where places are."),
  q("A word to describe a story passed down from grandparents is…", "heritage", ["recess", "gym"], "Heritage means what is passed down to us.", { d: 2 }),
  q("A round model of Earth is called a…", "globe", ["glove", "compass"], "A globe is a model of Earth.", { d: 2 }),
  q("After collecting facts, what is next?", "Decide what they tell us", ["Forget them", "Burn them"], "We analyse what we learn and draw conclusions."),
  q("When you share your results, you can use…", "pictures, words and maps", ["only silence", "only numbers you made up"], "People share what they learn in many ways.", { d: 2 }),
  q("Which is a good source for learning about weather in another country?", "photos and weather reports", ["a made-up story", "a toy"], "Photos and reports give evidence about climate.", { d: 3 }),
  q("Why do we compare more than one source?", "To check if the information agrees", ["To make more work", "To get lost"], "Using several sources makes our findings stronger.", { d: 3 }),
];

// ---------- Units ----------

export const units: Unit[] = [
  {
    id: "families-and-caring",
    title: "Families Near & Far",
    emoji: "🏠",
    blurb: "Every kind of family",
    standards: on("A1.2, A3.1", "different types of families, and how family structures and traditions compare"),
    parentNote: "Families come in many forms (one parent, two parents, grandparents, blended, adoptive and foster families). What makes a family is caring for each other.",
    generate: unitOf(FAMILIES),
  },
  {
    id: "traditions-and-celebrations",
    title: "Traditions & Celebrations",
    emoji: "🎉",
    blurb: "How we celebrate and pass it on",
    standards: on("A1.2, A3.4, A3.6, A3.7", "traditions and celebrations in different families and communities, and how heritage is passed on"),
    parentNote: "Well-known celebrations in Canada (such as Canada Day, Diwali, Lunar New Year, Eid, Hanukkah and Thanksgiving), and how food, songs, stories and language pass on heritage. First Nations, Métis and Inuit traditions are not covered here yet.",
    generate: unitOf(TRADITIONS),
  },
  {
    id: "then-and-now",
    title: "Then & Now",
    emoji: "📜",
    blurb: "Generations and change over time",
    standards: on("A1.1, A1.3, A2.4, A3.5", "how traditions and ways of life change over generations, and ordering events and people in time"),
    parentNote: "Generations in a family, using photos, interviews and timelines, and how technology and traditions change from the past to the present.",
    generate: unitOf(THENNOW, [(d) => pick([GENERATIONS, OLDER_YOUNGER])(d)]),
  },
  {
    id: "groups-in-our-community",
    title: "Groups in Our Community",
    emoji: "🤝",
    blurb: "Many cultures, languages and places",
    standards: on("A3.2, A3.3", "groups and cultures in the community, and places of family significance on a globe or map"),
    parentNote: "The many groups and languages in a community, why families move, welcoming newcomers, and finding the places families come from on a globe or map.",
    generate: unitOf(GROUPS),
  },
  {
    id: "globe-and-continents",
    title: "Globe & Continents",
    emoji: "🌍",
    blurb: "Continents, oceans and directions",
    standards: on("B3.1–B3.4", "continents, oceans, the equator, poles and hemispheres, cardinal directions, and where selected countries are"),
    parentNote: "The seven continents, the oceans, the equator and poles, north, south, east and west, and where a few well-known countries are on a globe.",
    generate: unitOf(GLOBE, [CONTINENT_SORT]),
  },
  {
    id: "climate-and-ways-of-life",
    title: "Climate & Ways of Life",
    emoji: "🌦️",
    blurb: "Weather, land and how people live",
    standards: on("B1.2, B2.3, B3.5", "how climate and landforms shape the way communities live, and reading photos and maps for clues"),
    parentNote: "How people dress, build, farm and work to suit their weather and land, and reading photos and maps for clues about climate.",
    generate: unitOf(CLIMATE),
  },
  {
    id: "communities-compared",
    title: "Communities Compared",
    emoji: "🏙️",
    blurb: "City, village, rural and urban",
    standards: on("B1.1, B3.8", "comparing our community with communities in other parts of the world"),
    parentNote: "Comparing communities around the world: what they share (basic needs, school, play) and how they differ (size, climate, jobs, travel).",
    generate: unitOf(COMPARED),
  },
  {
    id: "social-studies-detectives",
    title: "Social Studies Detectives",
    emoji: "🕵️",
    blurb: "Ask, gather, think and share",
    standards: on("A2.1, A2.2, A2.4, A2.6, B2.1, B2.2, B2.4, B2.6", "asking questions, using sources, interpreting information and sharing results with the right words"),
    parentNote: "The inquiry process: asking good questions, using people, photos, maps and graphs as sources, drawing conclusions and sharing results.",
    generate: unitOf(DETECTIVES),
  },
];
