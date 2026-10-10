import { sortQuestion, type SortSet } from "../bank";
import { shuffle } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { type Item, levelled } from "../ontario/g7-bank";
import { ab, levelOf } from "./kit";

// Alberta Grade 7 science (2003): Unit B, Plants for Food and Fibre, and parts of Unit E, Planet Earth, that
// the shared units do not cover. Written from the program of studies' unit descriptions (needs and uses of
// plants, plant structure and processes, soils and nutrients, plant breeding, rocks and minerals, the rock
// cycle, fossils and geological time).

// ---------- Plants: structure and life processes (Unit B) ----------

const PLANT_PARTS: Item[] = [
  { prompt: "What is the main job of a plant's roots?", right: "Anchor the plant and take in water and nutrients", wrong: ["Make seeds", "Take in sunlight", "Give off oxygen"], hint: "Roots hold the plant in the soil and absorb water." },
  { prompt: "Which part of a plant mostly makes food by photosynthesis?", right: "The leaves", wrong: ["The roots", "The seeds", "The bark"], hint: "Leaves are green because they hold chlorophyll." },
  { prompt: "What does a plant need for photosynthesis?", right: "Light, water and carbon dioxide", wrong: ["Soil, oxygen and sugar", "Darkness, water and nitrogen", "Light, sugar and oxygen"], hint: "Light, water and carbon dioxide go in. Sugar and oxygen come out." },
  { prompt: "What does photosynthesis make?", right: "Sugar (food for the plant) and oxygen", wrong: ["Carbon dioxide and water", "Soil and sugar", "Water and nitrogen"], hint: "The plant stores the sugar as food and releases oxygen." },
  { prompt: "What does the stem do?", right: "Holds up the plant and carries water and food between roots and leaves", wrong: ["Only makes the flowers", "Only stores seeds", "Takes in carbon dioxide"], hint: "Think of the stem as the plant's pipes and support." },
  { prompt: "Tiny openings on the underside of leaves let carbon dioxide in and oxygen and water vapour out. What are they called?", right: "Stomata", wrong: ["Root hairs", "Petals", "Seeds"], hint: "Gas exchange happens through stomata." },
  { prompt: "A dandelion has one thick, deep root that goes straight down. What kind of root is this?", right: "A taproot", wrong: ["A fibrous root", "A stem root", "A flower root"], hint: "A taproot is a single main root; a fibrous root system is a mass of thin roots.", hard: true },
  { prompt: "Grasses have many thin roots that spread out near the surface. How does this help on the Prairies?", right: "The roots hold the soil in place and catch rain near the surface", wrong: ["They reach water far below the ground", "They make the soil blow away", "They let the plant move to new places"], hint: "Fibrous roots form a net that holds soil.", hard: true },
  { prompt: "Water moves from the soil into a root hair mostly by…", right: "osmosis", wrong: ["photosynthesis", "pollination", "decomposition"], hint: "Osmosis is the movement of water across a thin membrane.", hard: true },
  { prompt: "Plants lose water vapour through their leaves. This process is called…", right: "transpiration", wrong: ["pollination", "germination", "fertilization"], hint: "Transpiration helps pull water up from the roots." },
  { prompt: "What happens during pollination?", right: "Pollen is moved to the female part of a flower", wrong: ["A seed grows into a seedling", "Roots take in water", "Leaves make sugar"], hint: "Bees, wind and other animals can carry pollen." },
  { prompt: "After pollen reaches a flower and fertilizes it, what grows from the flower?", right: "Fruit with seeds inside", wrong: ["New roots", "A bigger stem", "More chlorophyll"], hint: "Seeds form inside the fruit." },
  { prompt: "A cactus has thick stems that store water and few leaves. How does this help it?", right: "It lets the plant survive in a dry place", wrong: ["It lets the plant grow in the shade", "It lets the plant live under water", "It makes the plant eat insects"], hint: "Plants have structures suited to where they grow." },
  { prompt: "Which plant is best suited to a very dry, windy field?", right: "One with deep taproots and narrow leaves", wrong: ["One with wide, thin leaves and shallow roots", "One that needs flooded soil", "One that needs shade all day"], hint: "Deep roots reach water and narrow leaves lose less of it.", hard: true },
  { prompt: "Which part of a flower makes pollen?", right: "The stamen", wrong: ["The pistil", "The petal", "The root"], hint: "The stamen is the male part. The anther on it holds the pollen." },
  { prompt: "Which part of a flower receives pollen?", right: "The stigma, at the top of the pistil", wrong: ["The anther", "The sepal", "The stem"], hint: "The stigma is often sticky so pollen stays on it." },
  { prompt: "What is the main job of a flower's bright petals?", right: "To attract pollinators such as bees", wrong: ["To make sugar for the plant", "To take in water", "To hold the plant in the soil"], hint: "Colour and scent bring insects close to the flower." },
  { prompt: "Which gas do plants take in through their stomata for photosynthesis?", right: "Carbon dioxide", wrong: ["Oxygen", "Nitrogen", "Hydrogen"], hint: "Plants take in carbon dioxide and give off oxygen." },
  { prompt: "Why are most leaves flat and thin?", right: "This gives a large surface to catch light", wrong: ["It helps them store water for years", "It keeps pollen away", "It helps them grow downward"], hint: "More surface means more sunlight can be caught." },
  { prompt: "What gives leaves their green colour?", right: "Chlorophyll", wrong: ["Stomata", "Pollen", "Sugar"], hint: "Chlorophyll captures light energy for photosynthesis." },
  { prompt: "Which tubes in a stem carry water up from the roots?", right: "Xylem", wrong: ["Phloem", "Stomata", "Petals"], hint: "Xylem moves water up. Phloem carries sugar around the plant." },
  { prompt: "Which tubes in a plant carry sugar made in the leaves to other parts?", right: "Phloem", wrong: ["Xylem", "Root hairs", "Sepals"], hint: "Phloem moves food from where it is made to where it is used." },
  { prompt: "What is the job of tiny root hairs?", right: "To take in water and minerals from the soil", wrong: ["To make seeds", "To catch sunlight", "To attract insects"], hint: "Root hairs give the root a larger surface for absorbing water." },
  { prompt: "What is the job of a seed?", right: "To hold a tiny new plant and its food supply", wrong: ["To make sugar from sunlight", "To carry water up the stem", "To attract bees"], hint: "A seed can wait until conditions are right to grow." },
  { prompt: "What are the three things a seed usually needs in order to germinate?", right: "Water, warmth and air", wrong: ["Light, sugar and salt", "Frost, darkness and wind", "Pollen, petals and roots"], hint: "Germination is when a seed starts to grow into a seedling." },
  { prompt: "Pine trees have needle-shaped leaves with a waxy coating. How does this help in a cold, dry winter?", right: "It reduces water loss from the leaves", wrong: ["It lets them catch more rain", "It helps them grow flowers", "It makes the leaves fall off"], hint: "A small surface and a wax layer slow transpiration.", hard: true },
  { prompt: "On a hot, dry day, many plants close their stomata. What does this do?", right: "Saves water, but slows photosynthesis", wrong: ["Speeds up photosynthesis", "Makes more roots grow", "Lets more pollen in"], hint: "Closed stomata lose less water but also take in less carbon dioxide.", hard: true },
  { prompt: "A student covers half of a green leaf with black paper for a week. What will she most likely find?", right: "The covered part is paler because it got no light", wrong: ["The covered part is greener", "The whole leaf has fallen off", "The covered part made more sugar"], hint: "Without light, a leaf cannot make food or chlorophyll well.", hard: true },
];

function plantParts(opts?: GenerateOptions): Question[] {
  return shuffle(levelled(PLANT_PARTS, 8, levelOf(opts)));
}

// ---------- Plants: needs and uses (Unit B) ----------

const PLANT_USES: Item[] = [
  { prompt: "Which of these is a plant used for fibre?", right: "Flax, which is made into linen", wrong: ["Wheat grain", "Carrots", "Apples"], hint: "Fibre plants give us threads and fabrics." },
  { prompt: "Which crop gives oil for cooking and is grown on many Alberta farms?", right: "Canola", wrong: ["Cotton", "Rice", "Coffee"], hint: "Canola's yellow flowers cover fields on the Prairies in summer." },
  { prompt: "Wheat is mainly grown for…", right: "its grain, which is ground into flour", wrong: ["its roots", "its bark", "its fibre for clothing"], hint: "Bread, pasta and noodles often start as wheat." },
  { prompt: "Why do all living things depend on plants?", right: "Plants make food and oxygen from sunlight", wrong: ["Plants make water", "Plants produce all the soil", "Plants make carbon dioxide for animals only"], hint: "Plants are producers at the start of food chains." },
  { prompt: "Trees in a forest also help the environment by…", right: "holding soil, giving habitat and taking in carbon dioxide", wrong: ["making the air colder", "preventing all rain", "removing all oxygen"], hint: "Forests do many jobs besides giving wood." },
  { prompt: "Which of these is a plant product that is not food?", right: "Cotton cloth", wrong: ["Bread", "Maple syrup", "Peanut butter"], hint: "Cotton is a fibre from the cotton plant." },
  { prompt: "People have used plants as medicines for a long time. One example is…", right: "willow bark, an early source of the medicine in aspirin", wrong: ["wheat flour", "cotton threads", "canola oil"], hint: "Many medicines were first found in plants." },
  { prompt: "Much of the Prairies was once natural grassland. What is it mostly used for now?", right: "Farms and ranches", wrong: ["Rainforest", "Ocean fishing", "Glaciers"], hint: "Land use has changed from natural grassland to managed fields.", hard: true },
  { prompt: "A greenhouse lets growers…", right: "control light, heat and water to grow plants in a short growing season", wrong: ["stop plants from needing light", "grow plants with no water", "make winter last longer"], hint: "A managed environment helps where the season is short." },
  { prompt: "Irrigation is…", right: "watering crops by adding water from rivers, canals or wells", wrong: ["spraying crops to kill insects", "adding fertilizer to soil", "harvesting wheat"], hint: "Irrigation helps crops in dry areas, such as southern Alberta." },
  { prompt: "A farmer grows only one kind of crop on a very large area. What is this called?", right: "A monoculture", wrong: ["Crop rotation", "A greenhouse", "A shelterbelt"], hint: "Mono means one.", hard: true },
  { prompt: "Which is a possible problem of growing the same crop on the same field for many years?", right: "Pests and diseases can build up and soil nutrients can run low", wrong: ["The crop gets less sunlight", "The soil turns into rock", "The crop needs no water"], hint: "Variety helps keep soil and plants healthy.", hard: true },
  { prompt: "Hemp, flax and cotton are all grown mainly for…", right: "fibre to make cloth and rope", wrong: ["oil for cars", "fruit", "medicine only"], hint: "Fibre is the thread-like material in the plant." },
  { prompt: "Which plant gives the sugar used to make maple syrup?", right: "The sap of the sugar maple tree", wrong: ["The seeds of wheat", "The flowers of canola", "The roots of carrots"], hint: "Sap is boiled down to make syrup." },
  { prompt: "Which of these crops is a cereal grain?", right: "Barley", wrong: ["Lentils", "Flax", "Potatoes"], hint: "Barley is a grass grown for its grain and is common in Alberta." },
  { prompt: "Which crop is a pulse (a legume) grown in Alberta?", right: "Field peas", wrong: ["Barley", "Hemp", "Sugar beets"], hint: "Pulses such as peas and lentils grow seeds in pods." },
  { prompt: "Why do farmers often plant crops in spring and harvest them in fall?", right: "Alberta's growing season is limited by frost", wrong: ["Plants only grow in the dark", "Fall is the warmest season", "Seeds cannot grow in summer"], hint: "Crops must ripen between the last spring frost and the first fall frost." },
  { prompt: "A farm uses part of its land for hay to feed cattle. This is an example of using plants for…", right: "feed for animals", wrong: ["clothing", "medicine only", "building roads"], hint: "Many plants are grown as feed, not only for people." },
  { prompt: "Which is a way that wood from trees is used?", right: "To build houses and make paper", wrong: ["To make wool", "To make glass", "To make salt"], hint: "Forests give lumber and fibre for paper." },
  { prompt: "Which statement about weeds in a field is true?", right: "They compete with crops for light, water and nutrients", wrong: ["They always help crops grow", "They give off poison to people", "They stop all insects"], hint: "Farmers manage weeds so crops get what they need." },
  { prompt: "Why might a town plant native grasses and flowers in a park?", right: "They are suited to the local climate and support local insects", wrong: ["They never need sunlight", "They are always larger", "They grow only in greenhouses"], hint: "Native plants have adapted to the local weather and soil." },
  { prompt: "Which is an example of a plant that is grown for its oil?", right: "Sunflower", wrong: ["Wheat", "Potato", "Cotton"], hint: "Oil is pressed from the seeds." },
  { prompt: "Why do some people say a farm field is not the same as a natural prairie?", right: "A field has mostly one planted crop, but a prairie has many kinds of plants", wrong: ["A field has no plants", "A prairie has no grass", "A prairie has only crops"], hint: "Natural grassland has many species living together.", hard: true },
  { prompt: "Wetlands and grasslands in Alberta have been drained or ploughed for farms. What can happen to wildlife that lived there?", right: "It can lose its habitat and decline", wrong: ["It always increases", "Nothing changes", "It all moves to the city"], hint: "Changing land use changes who can live there.", hard: true },
  { prompt: "Why do some farmers leave strips of natural plants along a stream?", right: "They filter runoff and give habitat to wildlife", wrong: ["They make the stream flow faster", "They stop all rain", "They make the water saltier"], hint: "Plants along waterways hold soil and trap extra nutrients.", hard: true },
  { prompt: "How have farmers' choices about land use changed over time?", right: "They balance growing food with protecting soil, water and wildlife", wrong: ["They no longer grow any food", "They plough more and more with no limits", "Only governments grow crops"], hint: "Land use decisions weigh several needs at once.", hard: true },
];

function plantUses(opts?: GenerateOptions): Question[] {
  return shuffle(levelled(PLANT_USES, 8, levelOf(opts)));
}

// ---------- Growing plants well: soil, nutrients, breeding and sustainability (Unit B) ----------

const GROWING: Item[] = [
  { prompt: "Which three nutrients are listed on a bag of plant fertilizer?", right: "Nitrogen, phosphorus and potassium", wrong: ["Oxygen, hydrogen and carbon", "Iron, copper and zinc only", "Calcium, sugar and salt"], hint: "N, P and K are the main nutrients plants take from soil." },
  { prompt: "What is the main purpose of fertilizer?", right: "To add nutrients to the soil that plants need", wrong: ["To kill insects", "To give plants light", "To keep soil dry"], hint: "Plants take nutrients up through their roots." },
  { prompt: "Too much fertilizer runs off a field into a stream. What can happen?", right: "Algae grow too much and can harm other life in the water", wrong: ["The stream becomes cleaner", "Fish grow faster everywhere", "The soil gets better in the stream"], hint: "Extra nutrients are not only taken up by crops.", hard: true },
  { prompt: "What is selective breeding?", right: "Choosing plants with useful traits and breeding them to pass the traits on", wrong: ["Planting seeds at random", "Spraying plants with fertilizer", "Digging up wild plants"], hint: "Farmers have chosen the best plants for thousands of years." },
  { prompt: "Canola was developed in Canada from rapeseed by breeding plants that gave a better oil. This is an example of…", right: "selective breeding", wrong: ["irrigation", "pollination only", "composting"], hint: "Plant breeders chose the plants with the best qualities each generation." },
  { prompt: "A farmer plants peas one year and wheat the next in the same field. What is this called?", right: "Crop rotation", wrong: ["Monoculture", "Irrigation", "Pollination"], hint: "Rotating crops helps keep soil healthy." },
  { prompt: "Peas and lentils have bacteria on their roots that put nitrogen back into the soil. Why is this useful?", right: "The next crop has more nitrogen to use", wrong: ["The soil becomes more salty", "The crop needs less water", "The field gets more weeds"], hint: "Nitrogen is a key plant nutrient.", hard: true },
  { prompt: "Ladybugs eat aphids that damage crops. Using ladybugs this way is a…", right: "biological control", wrong: ["chemical control", "fertilizer", "monoculture"], hint: "Biological controls use living things to control pests." },
  { prompt: "A pesticide is sprayed on a crop to kill insects. This is a…", right: "chemical control", wrong: ["biological control", "crop rotation", "selective breeding"], hint: "Chemical controls use substances made to kill pests." },
  { prompt: "Which is a possible problem with spraying chemicals on crops?", right: "They can harm helpful insects and spread to water", wrong: ["They make the crop have no roots", "They always increase rainfall", "They remove all weeds forever"], hint: "Chemicals don't always stay where they were sprayed.", hard: true },
  { prompt: "Rows of trees planted along the edge of a field are called shelterbelts. What do they do?", right: "Slow the wind, which helps keep soil and snow on the field", wrong: ["Make soil more salty", "Remove all insects", "Water the crop"], hint: "Wind can blow away dry topsoil." },
  { prompt: "In the 1930s, drought and wind blew away topsoil on parts of the Prairies. How do farmers now help prevent this?", right: "Leave crop stubble in the field and avoid turning over the soil as much", wrong: ["Remove every plant after harvest", "Grow only on bare soil", "Never plant anything"], hint: "Covered soil is held in place.", hard: true },
  { prompt: "A bag of potatoes sprouts in a cupboard. A gardener cuts the pieces with eyes and plants them. This is…", right: "growing new plants from a part of a plant instead of from seeds", wrong: ["pollination", "photosynthesis", "using fertilizer"], hint: "Plants can be grown from stems, tubers and cuttings as well as seeds." },
  { prompt: "Which is a good way to make farming more sustainable?", right: "Use methods that keep soil healthy and use water carefully", wrong: ["Use as much water as possible", "Leave soil bare all year", "Grow one crop and never change it"], hint: "Sustainable means it can continue for a long time without harming the land." },
  { prompt: "Which of these is organic matter that can enrich soil?", right: "Compost made from rotted plants", wrong: ["Sand only", "Plastic bags", "Pebbles"], hint: "Compost adds nutrients and helps soil hold water." },
  { prompt: "Why do farmers test their soil?", right: "To find out which nutrients are low so they add only what is needed", wrong: ["To count the worms for a prize", "To make the soil heavier", "To change its colour"], hint: "Soil tests help farmers use fertilizer wisely." },
  { prompt: "What does it mean when a field is 'fallow'?", right: "It is rested and not planted for a season", wrong: ["It is planted twice", "It is flooded on purpose", "It is covered with a greenhouse"], hint: "Resting land gives it time to recover moisture." },
  { prompt: "What is a weed?", right: "A plant growing where people do not want it", wrong: ["A plant that never needs water", "A kind of fertilizer", "A plant with no roots"], hint: "A weed in a wheat field might be a useful plant elsewhere." },
  { prompt: "Why can erosion of topsoil be a problem for farmers?", right: "Topsoil holds the most nutrients and organic matter", wrong: ["Topsoil is made of rock only", "Topsoil does not hold seeds", "Erosion adds nutrients"], hint: "Losing topsoil means losing the richest part of the soil." },
  { prompt: "Earthworms in soil help plants by…", right: "loosening the soil and mixing in organic matter", wrong: ["eating all the roots", "making the soil dry", "blocking out the light"], hint: "Their tunnels let air and water reach roots." },
  { prompt: "A farmer plants a different crop in each field each year, on a three-year cycle. What is one benefit?", right: "It can break the life cycle of pests and spread out nutrient use", wrong: ["It makes all pests multiply", "It removes the need for sunlight", "It makes soil less healthy"], hint: "Pests that like one crop have less to eat the next year." },
  { prompt: "Why might a farmer choose a canola variety bred to resist a disease?", right: "The crop is less likely to be damaged, so less spraying may be needed", wrong: ["It will not need water", "It will grow with no soil", "It will turn into wheat"], hint: "Breeding can add helpful traits." },
  { prompt: "Drip irrigation puts water right at the roots of plants. Why can this be better than spraying water high in the air?", right: "Less water is lost to evaporation and wind", wrong: ["It uses much more water", "It makes plants grow upside down", "It adds fertilizer to the air"], hint: "Using water carefully is part of sustainable farming." },
  { prompt: "What is an integrated pest management plan?", right: "Using several methods, such as monitoring, natural predators and, if needed, small amounts of spray", wrong: ["Spraying the whole farm every day", "Doing nothing about pests", "Planting only weeds"], hint: "It aims to reduce harm to the environment.", hard: true },
  { prompt: "Why do some farmers avoid tilling (turning over) the soil?", right: "Untilled soil keeps its structure, holds moisture and is less likely to blow away", wrong: ["Tilling adds more water to soil", "Plants cannot grow in untilled soil", "Tilling stops weeds forever"], hint: "No-till farming protects soil on the Prairies.", hard: true },
  { prompt: "Seed companies sell improved seeds. Why might a farmer still save some of their own seed?", right: "It can lower costs and keep traits that suit the farm", wrong: ["Saved seed never grows", "Seeds can only be bought", "Seed companies do not exist"], hint: "Farmers weigh costs, benefits and risks when they decide.", hard: true },
];

function growing(opts?: GenerateOptions): Question[] {
  return shuffle(levelled(GROWING, 8, levelOf(opts)));
}

// ---------- Rocks and minerals (Unit E) ----------

const ROCK_SORT: SortSet = {
  prompt: "Igneous, sedimentary or metamorphic? Sort each rock.",
  hint: "Igneous rock forms from cooled magma or lava. Sedimentary rock forms from layers of sediment pressed together. Metamorphic rock is changed by heat and pressure.",
  bins: [
    { id: "igneous", label: "igneous", emoji: "🌋" },
    { id: "sedimentary", label: "sedimentary", emoji: "🏖️" },
    { id: "metamorphic", label: "metamorphic", emoji: "🔥" },
  ],
  items: [
    { label: "granite", emoji: "🪨", bin: "igneous" },
    { label: "basalt", emoji: "🪨", bin: "igneous" },
    { label: "obsidian", emoji: "🪨", bin: "igneous" },
    { label: "pumice", emoji: "🪨", bin: "igneous" },
    { label: "sandstone", emoji: "🪨", bin: "sedimentary" },
    { label: "limestone", emoji: "🪨", bin: "sedimentary" },
    { label: "shale", emoji: "🪨", bin: "sedimentary" },
    { label: "coal", emoji: "🪨", bin: "sedimentary" },
    { label: "marble", emoji: "🪨", bin: "metamorphic" },
    { label: "slate", emoji: "🪨", bin: "metamorphic" },
    { label: "gneiss", emoji: "🪨", bin: "metamorphic" },
    { label: "quartzite", emoji: "🪨", bin: "metamorphic" },
  ],
};

const ROCKS: Item[] = [
  { prompt: "What is the difference between a rock and a mineral?", right: "A mineral is a single natural solid with a set chemical makeup; a rock is usually made of one or more minerals", wrong: ["A rock is always a single mineral", "Minerals are made by living things", "Rocks are always soft"], hint: "Granite is a rock made of several minerals, such as quartz and feldspar." },
  { prompt: "Which rock forms when magma or lava cools and hardens?", right: "Igneous rock", wrong: ["Sedimentary rock", "Metamorphic rock", "Fossil rock"], hint: "Igneous comes from a word for fire." },
  { prompt: "Which type of rock is most likely to contain fossils?", right: "Sedimentary rock", wrong: ["Igneous rock", "Metamorphic rock formed by great heat", "Lava"], hint: "Hot magma would destroy remains. Sediments bury them gently." },
  { prompt: "What is needed to change limestone into marble?", right: "Heat and pressure", wrong: ["Wind only", "Cold water only", "Fossils"], hint: "Metamorphic means changed in form." },
  { prompt: "Sand, mud and shells settle in layers and are pressed and cemented together over time. What kind of rock forms?", right: "Sedimentary rock", wrong: ["Igneous rock", "Metamorphic rock", "Lava rock"], hint: "Sediments are small pieces of rock, shells and other material." },
  { prompt: "Which words describe a mineral's lustre?", right: "Shiny (metallic) or dull", wrong: ["Heavy or light", "Hot or cold", "Round or flat"], hint: "Lustre is the way a mineral's surface shines in light." },
  { prompt: "On the Mohs scale of hardness, which mineral is hardest?", right: "Diamond", wrong: ["Talc", "Quartz", "Calcite"], hint: "Talc is 1 and diamond is 10.", hard: true },
  { prompt: "Quartz can scratch calcite but calcite cannot scratch quartz. Which is harder?", right: "Quartz", wrong: ["Calcite", "They are equally hard", "You cannot tell"], hint: "The harder mineral scratches the softer one." },
  { prompt: "Which is the softest mineral on the Mohs scale?", right: "Talc", wrong: ["Quartz", "Topaz", "Feldspar"], hint: "Talc is the main ingredient in some powders." },
  { prompt: "What is weathering?", right: "The breaking down of rock into smaller pieces", wrong: ["The moving of sediment by water", "The melting of rock inside Earth", "The formation of a fossil"], hint: "Weathering breaks; erosion carries away." },
  { prompt: "A river carries sand and gravel downstream. This is an example of…", right: "erosion", wrong: ["weathering only", "melting", "metamorphism"], hint: "Erosion is the movement of weathered material." },
  { prompt: "In the rock cycle, what happens to a metamorphic rock that melts completely?", right: "It can cool again and become an igneous rock", wrong: ["It becomes a fossil", "It is destroyed forever", "It always becomes sediment at once"], hint: "The rock cycle has no beginning or end.", hard: true },
  { prompt: "Hoodoos in the Alberta Badlands are tall columns shaped over a long time by…", right: "weathering and erosion by rain, wind and frost", wrong: ["volcanoes erupting last year", "people carving them", "magma cooling beneath them"], hint: "Soft layers wear away faster than a hard cap rock." },
  { prompt: "The Rocky Mountains have layers of rock that are bent and folded. What probably caused the folding?", right: "Huge forces squeezing Earth's crust over a very long time", wrong: ["Wind blowing for a year", "Rivers pushing rock upward", "Rain filling the valleys"], hint: "Fold mountains form when crust is pushed together.", hard: true },
];

function rocks(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([sortQuestion(ROCK_SORT, 2), ...levelled(ROCKS, 7, d)]);
}

// ---------- Fossils and geological time (Unit E) ----------

const FOSSILS: Item[] = [
  { prompt: "What is a fossil?", right: "The preserved remains or traces of a living thing from long ago", wrong: ["Any old rock", "A living plant", "A kind of mineral"], hint: "Fossils can be bones, shells, leaves or footprints." },
  { prompt: "Which part of an animal is most likely to become a fossil?", right: "Hard parts such as bones, teeth and shells", wrong: ["Skin", "Muscles", "Blood"], hint: "Soft parts usually rot away quickly." },
  { prompt: "A dinosaur footprint hardened in mud and was later buried. What kind of fossil is it?", right: "A trace fossil", wrong: ["A bone fossil", "A mineral", "A volcano"], hint: "Trace fossils show activity, like footprints or burrows." },
  { prompt: "Water rich in minerals slowly replaces the material in a buried log with stone. This forms…", right: "petrified wood", wrong: ["coal in a day", "a mineral crystal", "a volcano"], hint: "Petrified means turned to stone." },
  { prompt: "A shell dissolves away after it is buried, leaving a hollow shape in the rock. This is a…", right: "mould", wrong: ["cast", "trace fossil", "mineral"], hint: "A mould is the empty space; a cast fills it." },
  { prompt: "In undisturbed layers of sedimentary rock, which layer is usually the oldest?", right: "The bottom layer", wrong: ["The top layer", "The middle layer", "They are always the same age"], hint: "New layers settle on top of older ones." },
  { prompt: "Dinosaur fossils are found in Alberta, including at Dinosaur Provincial Park. What does this tell us?", right: "Alberta was once covered with different environments, such as warm swamps and rivers", wrong: ["Dinosaurs live in Alberta today", "Alberta has always been cold and dry", "Dinosaurs were never on land"], hint: "Fossils give clues about the past environment." },
  { prompt: "The geological time scale organizes Earth's history into…", right: "long periods based on rock layers and the fossils found in them", wrong: ["hours and days", "only the last 100 years", "the seasons"], hint: "Earth is about 4.5 billion years old." },
  { prompt: "Which came first on Earth?", right: "Simple ocean life", wrong: ["Mammals", "Flowering plants", "Humans"], hint: "The fossil record shows simple life long before complex animals.", hard: true },
  { prompt: "Dinosaurs lived long before humans. About how long ago did most non-bird dinosaurs die out?", right: "About 66 million years ago", wrong: ["About 6 000 years ago", "About 66 000 years ago", "About 660 million years ago"], hint: "That is millions of years, not thousands.", hard: true },
  { prompt: "Why do scientists need many fossils, not just one, before they draw a conclusion?", right: "One fossil can be incomplete or hard to interpret, and more evidence adds confidence", wrong: ["Scientists only like large collections", "One fossil is always enough", "Fossils change when they are counted"], hint: "Accumulated evidence builds accepted scientific ideas.", hard: true },
  { prompt: "Paleontologists often study living animals to help them rebuild an extinct animal from its fossils. Why?", right: "Living relatives show how bones and muscles fit together", wrong: ["Living animals look just like dinosaurs", "Fossils have no information", "They can't ever compare animals"], hint: "Scientists use clues from living relatives." },
  { prompt: "Seismographs and coring drills are tools scientists use to…", right: "study Earth's interior and layers of rock", wrong: ["measure the weather on Mars", "count fossils in a museum", "make maps of the sky"], hint: "Seismographs measure earthquake waves; coring drills pull up samples of rock layers." },
  { prompt: "Which is an example of sudden change to Earth's surface?", right: "An earthquake", wrong: ["Mountains slowly wearing down", "A river slowly carving a valley", "Glaciers slowly moving"], hint: "Sudden changes happen quickly. Gradual changes take a very long time." },
  { prompt: "Which is an example of gradual change to Earth's surface?", right: "A river slowly cutting a canyon", wrong: ["A volcanic eruption", "A landslide", "An earthquake"], hint: "Gradual changes happen a little at a time over a long time." },
  { prompt: "Which kind of rock most often contains fossils?", right: "Sedimentary rock", wrong: ["Igneous rock", "Metamorphic rock formed deep underground", "Volcanic glass"], hint: "Sediment can bury living things gently. Heat from magma would destroy them." },
  { prompt: "What is a fossil fuel such as coal made from?", right: "The remains of ancient plants and other living things", wrong: ["Melted glass", "Volcanic ash only", "Sand and salt"], hint: "Coal formed from plants buried for millions of years." },
  { prompt: "A scientist finds a seashell fossil high in the Rocky Mountains. What does this suggest?", right: "The area was once under a sea", wrong: ["Seashells grow on mountains today", "A tourist dropped it last week", "Mountains never change"], hint: "Rock that was once sea floor was lifted up as mountains formed." },
  { prompt: "What is a paleontologist?", right: "A scientist who studies fossils and ancient life", wrong: ["A scientist who studies the weather", "A scientist who studies stars", "A scientist who studies the ocean tides"], hint: "Palaeo means ancient." },
  { prompt: "A buried leaf leaves a thin dark print in a rock. What kind of fossil is this?", right: "An impression", wrong: ["A mineral", "A volcano", "A living fossil"], hint: "The leaf shape is pressed into the rock." },
  { prompt: "Which of these would NOT usually become a fossil?", right: "A jellyfish that dries up on a beach", wrong: ["A clam shell buried quickly", "A tooth buried in mud", "A bone buried by a flood"], hint: "Soft bodies rot quickly. Hard parts buried fast last the longest." },
  { prompt: "Why is quick burial important for fossil formation?", right: "It protects the remains from scavengers and decay", wrong: ["It makes the remains grow", "It turns the remains to gold", "It keeps the remains hot"], hint: "Buried quickly, remains can be preserved." },
  { prompt: "Scientists use 'index fossils' to help match rock layers in different places. What makes a good index fossil?", right: "A living thing that was common, widespread and lived for a short time", wrong: ["A plant that is rare and hid underground", "A fossil found in only one cave", "A fossil that has no shape"], hint: "If two layers hold the same index fossil, they are about the same age.", hard: true },
  { prompt: "Fossils show that some living things have gone extinct. What does extinct mean?", right: "No members of the species are left alive", wrong: ["The species lives only in zoos", "The species has moved away", "The species is very large"], hint: "Dinosaurs (apart from birds) are extinct." },
  { prompt: "Which is a better description of the geological time scale?", right: "A calendar of Earth's history marked by major changes in rocks and life", wrong: ["A list of famous scientists", "A map of Alberta", "A clock that tells the time today"], hint: "Eras and periods are named for changes seen in the rock record." },
  { prompt: "The Royal Tyrrell Museum in Drumheller displays many fossils. Why are museums like this useful?", right: "They store and study evidence about Earth's past", wrong: ["They make new dinosaurs", "They stop rocks from forming", "They keep the weather warm"], hint: "The Royal Tyrrell Museum is a research centre for palaeontology." },
  { prompt: "A river cuts down through layers of rock and shows the layers on a cliff. What can scientists learn from this?", right: "The order and types of past environments", wrong: ["The exact day each layer formed", "The name of every extinct animal", "Nothing at all"], hint: "Rock layers record changes through time.", hard: true },
  { prompt: "Why is it hard to know exactly what colour a dinosaur was?", right: "Colour is usually not preserved in bones", wrong: ["Dinosaurs had no colour", "Fossils are always painted", "Nobody has studied dinosaurs"], hint: "Scientists use rare fossils and clues from living animals to make careful guesses.", hard: true },
];

function fossils(opts?: GenerateOptions): Question[] {
  return shuffle(levelled(FOSSILS, 8, levelOf(opts)));
}

export const units: Unit[] = [
  {
    id: "plant-parts-ab",
    title: "How Plants Work",
    emoji: "🌱",
    blurb: "Roots, leaves, flowers and photosynthesis",
    parentNote: "The parts of seed plants and what they do, photosynthesis, gas exchange, transpiration and pollination, and how plant structures suit where a plant grows.",
    standards: ab("Unit B: Plants for Food and Fibre", "the structure and life processes of seed plants and how they suit their environment"),
    generate: plantParts,
  },
  {
    id: "plant-uses-ab",
    title: "Plants We Use",
    emoji: "🌾",
    blurb: "Food, fibre and farms",
    parentNote: "How people use plants for food, fibre and medicine, crops grown in Alberta such as wheat and canola, changing land use and the effects of growing only one crop.",
    standards: ab("Unit B: Plants for Food and Fibre", "human uses of plants, crops and changing land use"),
    generate: plantUses,
  },
  {
    id: "growing-crops-ab",
    title: "Growing Crops Well",
    emoji: "🚜",
    blurb: "Soil, nutrients and care for the land",
    parentNote: "Fertilizers and soil nutrients, selective breeding, crop rotation, chemical and biological pest control and farming practices that protect soil and water.",
    standards: ab("Unit B: Plants for Food and Fibre", "soil nutrients, plant breeding, pest control and sustainable growing methods"),
    generate: growing,
  },
  {
    id: "rocks-minerals-ab",
    title: "Rocks & Minerals",
    emoji: "🪨",
    blurb: "The rock cycle",
    parentNote: "Rocks and minerals, describing minerals (lustre, hardness), the three main kinds of rock, the rock cycle, weathering and erosion and how mountains form.",
    standards: ab("Unit E: Planet Earth", "rocks and minerals, the rock cycle, weathering and erosion and mountain building"),
    generate: rocks,
  },
  {
    id: "fossils-time-ab",
    title: "Fossils & Earth's History",
    emoji: "🦕",
    blurb: "Clues from long ago",
    parentNote: "How fossils form, what they tell scientists, the order of rock layers, the geological time scale and the difference between sudden and gradual change.",
    standards: ab("Unit E: Planet Earth", "fossil formation, the geological time scale and evidence for sudden and gradual change"),
    generate: fossils,
  },
];
