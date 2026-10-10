import type { SortSet } from "../bank";
import { shuffle } from "../random";
import type { OrderQuestion, Question, Unit } from "../types";
import { levelled, withSort, type Item, type Level } from "./g56-bank";
import { on } from "./kit";

// Ontario Grade 5 Science and Technology (2022). BC's digestion and breathing, heart/bones/muscles
// and natural resources units are shared; these units cover the rest of Life Systems (health,
// body systems), Matter and Energy (states, changes, energy), Structures and Mechanisms (forces on
// structures) and the STEM skills strand.

// ---------- Healthy choices (B1) ----------

const HEALTH: Item[] = [
  { prompt: "Which habit helps keep your heart and muscles healthy?", right: "Being active most days", wrong: ["Sitting still all day", "Skipping meals every day"], hint: "Regular movement makes your heart and muscles stronger." },
  { prompt: "About how much sleep does a child aged 5 to 13 need each night?", right: "9 to 11 hours", wrong: ["4 to 5 hours", "6 to 7 hours"], hint: "Growing bodies and brains need more sleep than adults do. Canadian guidelines suggest 9 to 11 hours." },
  { prompt: "What does sunscreen help protect your skin from?", right: "Harmful ultraviolet (UV) rays from the Sun", wrong: ["Germs in the air", "Loud noise"], hint: "UV rays can burn skin. Sunscreen blocks or absorbs some of them." },
  { prompt: "The sky is full of wildfire smoke. Which choice best protects your lungs?", right: "Stay indoors with the windows closed", wrong: ["Run a long race outside", "Open every window wide"], hint: "Smoke makes the air unhealthy to breathe, so limit how much of it you take in." },
  { prompt: "Listening to very loud music through earbuds for hours can harm which part of your body?", right: "Your hearing", wrong: ["Your sense of smell", "Your bones"], hint: "Loud sound can damage the tiny parts inside your ears." },
  { prompt: "Which technology helps people who have trouble seeing clearly?", right: "Eyeglasses", wrong: ["A bike helmet", "Headphones"], hint: "Lenses bend light so that it focuses properly in the eye." },
  { prompt: "Why do doctors use X-rays?", right: "To see bones and other parts inside the body", wrong: ["To measure how fast you can run", "To listen to your heartbeat"], hint: "X-rays pass through soft tissue but are blocked by bone, making a picture of the inside." },
  { prompt: "What does a Nutrition Facts table on a food package tell you?", right: "How much of each nutrient is in one serving", wrong: ["Where the food was grown", "When you should eat it"], hint: "It lists things like sugar, sodium and fibre for a set serving size." },
  { prompt: "Which meal gives the body more fibre and vitamins?", right: "Vegetables and fruit with whole grains", wrong: ["Candy and pop", "Chips and fries"], hint: "Plant foods such as vegetables, fruit and whole grains are full of fibre and vitamins." },
  { prompt: "Canada's Food Guide suggests filling about half your plate with…", right: "vegetables and fruits", wrong: ["meat", "bread"], hint: "Vegetables and fruits should take up the biggest part of the plate." },
  { prompt: "Which is a healthy way to handle feeling stressed?", right: "Talk to a trusted adult or go for a walk", wrong: ["Keep every worry secret", "Stay up all night"], hint: "Mental health is part of your health. Sharing worries and moving your body can help." },
  { prompt: "Why is it helpful to read an ingredient list?", right: "You can choose foods that suit your health needs, such as allergies", wrong: ["It tells you the price of the food", "It tells you how long the food took to make"], hint: "Ingredients are listed so people can avoid foods that could harm them." },
  { prompt: "Too much screen time right before bed can make it harder to…", right: "fall asleep", wrong: ["grow taller", "digest your dinner"], hint: "Bright screens and exciting content keep the brain alert when it should be winding down.", hard: true },
  { prompt: "An ad shows a sugary snack with cartoon characters. Which food-literacy skill helps most?", right: "Asking what the ad wants me to do, then checking the label", wrong: ["Buying whatever is shown most often", "Choosing the brightest package"], hint: "Ads are made to sell things. The label gives facts you can compare.", hard: true },
  { prompt: "A patient in a remote community video-calls a doctor in a city. How does this technology help health?", right: "She gets advice without a long, costly trip", wrong: ["The doctor can give her a vaccine through the screen", "It replaces all medicine she needs"], hint: "Telehealth uses technology to bring health care to people who live far from clinics.", hard: true },
  { prompt: "Sitting hunched over a tablet for hours can strain which body parts?", right: "Neck and back", wrong: ["Teeth and ears", "Knees and ankles only"], hint: "A bent posture holds the neck and back muscles in one position for too long.", hard: true },
  { prompt: "Traffic fumes build up near a school. Which action could reduce the harm?", right: "More students walk, bike or carpool", wrong: ["Cars wait with engines running", "Build a parking lot next to the doors"], hint: "Fewer idling vehicles means cleaner air for everyone.", hard: true },
];

const HEALTH_SORT: SortSet = {
  prompt: "Does it help health or can it harm health? Tap an item, then tap its basket.",
  hint: "Think about whether the habit supports your body and mind, or puts them at risk.",
  bins: [
    { id: "help", label: "Helps health", emoji: "🙂" },
    { id: "harm", label: "Can harm health", emoji: "⚠️" },
  ],
  items: [
    { label: "Getting enough sleep", emoji: "😴", bin: "help" },
    { label: "Eating vegetables", emoji: "🥦", bin: "help" },
    { label: "Playing outside", emoji: "🏃", bin: "help" },
    { label: "Wearing sunscreen", emoji: "🧴", bin: "help" },
    { label: "Breathing wildfire smoke", emoji: "🌫️", bin: "harm" },
    { label: "Very loud music", emoji: "🔊", bin: "harm" },
    { label: "Staying up late on a screen", emoji: "📱", bin: "harm" },
    { label: "Sugary drinks all day", emoji: "🥤", bin: "harm" },
  ],
};

// ---------- Body teamwork (B2) ----------

const BODY: Item[] = [
  { prompt: "Which system sends messages between the brain and the rest of the body?", right: "Nervous system", wrong: ["Digestive system", "Skeletal system"], hint: "Nerves carry signals to and from the brain and spinal cord." },
  { prompt: "Which organ is the control centre of the nervous system?", right: "Brain", wrong: ["Heart", "Stomach"], hint: "The brain receives messages and decides how the body responds." },
  { prompt: "The kidneys are part of which system?", right: "Excretory (urinary) system", wrong: ["Respiratory system", "Nervous system"], hint: "This system removes liquid wastes from the body." },
  { prompt: "What do the kidneys do?", right: "Filter wastes out of the blood to make urine", wrong: ["Pump blood around the body", "Break down food with acid"], hint: "Blood passes through the kidneys, which clean it." },
  { prompt: "When you run, your muscles need more oxygen. Which two systems work together to deliver it?", right: "Respiratory and circulatory", wrong: ["Digestive and nervous", "Skeletal and excretory"], hint: "The lungs take in oxygen and the heart and blood carry it to the muscles." },
  { prompt: "You touch something hot and pull your hand away. Which two systems work together?", right: "Nervous and muscular", wrong: ["Digestive and respiratory", "Excretory and circulatory"], hint: "Nerves send the warning and muscles move your hand." },
  { prompt: "Asthma mainly affects which organs?", right: "The lungs and airways", wrong: ["The kidneys", "The stomach"], hint: "In asthma, the airways in the lungs can narrow, making it hard to breathe." },
  { prompt: "Diabetes affects how the body uses sugar. Which organ is involved in controlling blood sugar?", right: "Pancreas", wrong: ["Lungs", "Brain stem"], hint: "The pancreas makes insulin, which helps the body use sugar from food." },
  { prompt: "A broken arm is a problem with which body system?", right: "Skeletal system", wrong: ["Excretory system", "Nervous system"], hint: "Bones make up the skeleton." },
  { prompt: "Heart disease is a medical condition that affects which system?", right: "Circulatory system", wrong: ["Respiratory system", "Excretory system"], hint: "The heart and blood vessels make up the circulatory system." },
  { prompt: "Which senses and body part work together when you read a book?", right: "Eyes and brain", wrong: ["Ears and kidneys", "Skin and stomach"], hint: "The eyes take in the page and the brain makes sense of it." },
  { prompt: "A cold is an infection that mainly affects which system?", right: "Respiratory system", wrong: ["Skeletal system", "Excretory system"], hint: "Cold germs mostly make the nose, throat and airways sore and stuffy." },
  { prompt: "Why do your heart and breathing both speed up when you exercise?", right: "Your muscles need more oxygen delivered faster", wrong: ["Your bones need more food", "Your kidneys are working harder"], hint: "Moving muscles use oxygen quickly, so two systems speed up to supply it.", hard: true },
  { prompt: "A person's kidneys no longer work well, so a dialysis machine is used. What does the machine do?", right: "Filters wastes from the blood like the kidneys do", wrong: ["Pumps blood like the heart", "Helps the lungs take in oxygen"], hint: "Dialysis does the kidneys' job of cleaning the blood.", hard: true },
  { prompt: "Epilepsy is a medical disorder that affects which organ?", right: "Brain", wrong: ["Liver", "Lungs"], hint: "It is caused by unusual bursts of electrical activity in the brain.", hard: true },
  { prompt: "Which system lets you feel a cold floor and then decide to put on socks?", right: "Nervous system", wrong: ["Excretory system", "Skeletal system"], hint: "Nerves in the skin send the message and the brain decides what to do.", hard: true },
];

const BODY_SORT: SortSet = {
  prompt: "Nervous system or excretory system? Tap an item, then tap its basket.",
  hint: "The nervous system carries messages. The excretory system removes wastes.",
  bins: [
    { id: "nervous", label: "Nervous system", emoji: "🧠" },
    { id: "excretory", label: "Excretory system", emoji: "🚰" },
  ],
  items: [
    { label: "Brain", emoji: "🧠", bin: "nervous" },
    { label: "Spinal cord", emoji: "🦴", bin: "nervous" },
    { label: "Nerves", emoji: "⚡", bin: "nervous" },
    { label: "Sensory messages", emoji: "📨", bin: "nervous" },
    { label: "Kidneys", emoji: "🩸", bin: "excretory" },
    { label: "Bladder", emoji: "🎈", bin: "excretory" },
    { label: "Urine", emoji: "💧", bin: "excretory" },
    { label: "Ureters", emoji: "🧵", bin: "excretory" },
  ],
};

// ---------- States of matter (C2.1, C2.2, C2.7) ----------

const MATTER: Item[] = [
  { prompt: "Matter is anything that…", right: "has mass and takes up space", wrong: ["can be seen", "is alive"], hint: "Even air is matter: it has mass and takes up space, even though you cannot see it." },
  { prompt: "Which of these is NOT matter?", right: "A beam of light", wrong: ["Air in a balloon", "A puff of smoke", "A drop of juice"], hint: "Matter has mass and volume. Light is a form of energy." },
  { prompt: "What does volume measure?", right: "How much space something takes up", wrong: ["How heavy something feels", "How hot something is"], hint: "Volume is the amount of space matter occupies." },
  { prompt: "Which tool measures the mass of an object?", right: "A balance", wrong: ["A graduated cylinder", "A thermometer"], hint: "A balance compares masses. A graduated cylinder measures the volume of a liquid." },
  { prompt: "Which state of matter has a definite shape and a definite volume?", right: "Solid", wrong: ["Liquid", "Gas"], hint: "A solid keeps its own shape." },
  { prompt: "Which state of matter takes the shape of its container but keeps the same volume?", right: "Liquid", wrong: ["Solid", "Gas"], hint: "Water in a glass fills the bottom of the glass and keeps its volume." },
  { prompt: "Which state of matter spreads out to fill its whole container?", right: "Gas", wrong: ["Solid", "Liquid"], hint: "The particles of a gas move freely and spread out." },
  { prompt: "In which state are particles packed closely and only vibrate in place?", right: "Solid", wrong: ["Liquid", "Gas"], hint: "A solid's particles are held in fixed positions." },
  { prompt: "Why can you pour water but not a rock?", right: "Water particles can slide past one another", wrong: ["Water has no mass", "Water particles are far apart"], hint: "Liquid particles are close together but are free to flow." },
  { prompt: "Why is steel used to build bridges?", right: "It is a strong, hard solid", wrong: ["It is a lightweight gas", "It is a runny liquid"], hint: "A material's properties make it useful for a job." },
  { prompt: "Bicycle tires are filled with air. Which property of a gas makes this useful?", right: "A gas can be squeezed, so the tire cushions bumps", wrong: ["A gas is much heavier than a solid", "A gas keeps a fixed shape"], hint: "Gas particles are far apart, so a gas can be compressed." },
  { prompt: "Which is a gas at room temperature?", right: "The helium in a party balloon", wrong: ["Milk", "A wooden spoon"], hint: "Helium floats in a balloon because it is a gas." },
  { prompt: "A gas can be squeezed into a smaller space, but a solid cannot. Why?", right: "There is a lot of empty space between gas particles", wrong: ["Gas particles are bigger than solid particles", "Solid particles do not move at all"], hint: "Gas particles are far apart, so they can be pushed closer.", hard: true },
  { prompt: "Juice is poured from a tall glass into a wide bowl. What happens to its volume?", right: "It stays the same", wrong: ["It gets bigger", "It gets smaller"], hint: "The shape of a liquid changes but the amount of space it takes up does not.", hard: true },
  { prompt: "Sand can be poured like a liquid. Why is each grain still a solid?", right: "Each grain keeps its own shape and volume", wrong: ["Sand has no mass", "Sand grains are made of liquid"], hint: "The pile flows, but each tiny grain is a solid.", hard: true },
  { prompt: "Hydraulic lifts use liquids to push heavy loads. Which property of liquids helps?", right: "They are very hard to squeeze into a smaller volume", wrong: ["They keep a fixed shape", "They are easy to compress"], hint: "A liquid's particles are close together, so pushing on one part moves the rest.", hard: true },
  { prompt: "A plastic bottle holds 500 mL of water. The cap is on. If you squeeze the sides, what happens to the volume of the water?", right: "It stays about 500 mL", wrong: ["It doubles", "It drops to about 250 mL"], hint: "Liquids are almost impossible to compress.", hard: true },
];

const MATTER_SORT: SortSet = {
  prompt: "Solid or liquid? Tap an item, then tap its basket.",
  hint: "A solid keeps its shape. A liquid flows and takes the shape of its container.",
  bins: [
    { id: "solid", label: "Solid", emoji: "🧱" },
    { id: "liquid", label: "Liquid", emoji: "💧" },
  ],
  items: [
    { label: "Brick", emoji: "🧱", bin: "solid" },
    { label: "Wooden spoon", emoji: "🥄", bin: "solid" },
    { label: "Ice cube", emoji: "🧊", bin: "solid" },
    { label: "Rock", emoji: "🪨", bin: "solid" },
    { label: "Milk", emoji: "🥛", bin: "liquid" },
    { label: "Orange juice", emoji: "🧃", bin: "liquid" },
    { label: "Cooking oil", emoji: "🫒", bin: "liquid" },
    { label: "Honey", emoji: "🍯", bin: "liquid" },
  ],
};

// ---------- Changes of state (C2.3, C2.6) ----------

const STATE_CHANGES: Item[] = [
  { prompt: "What is it called when a solid becomes a liquid?", right: "Melting", wrong: ["Freezing", "Condensing"], hint: "Ice melts into water." },
  { prompt: "What is it called when a liquid becomes a solid?", right: "Freezing", wrong: ["Melting", "Evaporating"], hint: "Water freezes into ice." },
  { prompt: "What is it called when a liquid becomes a gas?", right: "Evaporation", wrong: ["Condensation", "Freezing"], hint: "Water evaporates into water vapour." },
  { prompt: "What is it called when a gas becomes a liquid?", right: "Condensation", wrong: ["Evaporation", "Melting"], hint: "Water vapour condenses into droplets." },
  { prompt: "Drops of water form on the outside of a cold glass on a hot day. Which change is this?", right: "Condensation", wrong: ["Evaporation", "Melting"], hint: "Water vapour in the air cools against the glass and turns into liquid." },
  { prompt: "Wet laundry dries on a clothesline. Which change of state is this?", right: "Evaporation", wrong: ["Condensation", "Freezing"], hint: "The liquid water turns into a gas and goes into the air." },
  { prompt: "A puddle freezes on a cold night. What happens to the thermal energy of the water?", right: "The water releases thermal energy", wrong: ["The water absorbs thermal energy", "The water gains mass"], hint: "To become a solid, matter has to lose thermal energy." },
  { prompt: "A chocolate bar melts in a warm pocket. What does the chocolate do?", right: "Absorbs thermal energy", wrong: ["Releases thermal energy", "Loses all its mass"], hint: "Melting needs energy to be added." },
  { prompt: "At what temperature does pure water freeze at sea level?", right: "0 °C", wrong: ["10 °C", "100 °C"], hint: "Ice melts and water freezes at 0 °C." },
  { prompt: "At what temperature does pure water boil at sea level?", right: "100 °C", wrong: ["0 °C", "50 °C"], hint: "Boiling is fast evaporation at 100 °C." },
  { prompt: "In the water cycle, which change of state helps form clouds?", right: "Condensation", wrong: ["Melting", "Freezing"], hint: "Water vapour cools high in the air and condenses into tiny droplets." },
  { prompt: "What happens to particles of a liquid as they are heated and become a gas?", right: "They move faster and spread far apart", wrong: ["They slow down and pack together", "They disappear"], hint: "More thermal energy means faster-moving particles.", hard: true },
  { prompt: "The white cloud above a boiling kettle is made of…", right: "tiny droplets of liquid water", wrong: ["invisible water vapour", "tiny pieces of ice"], hint: "Water vapour is invisible. Right after leaving the spout it cools and condenses into droplets.", hard: true },
  { prompt: "When matter changes state, what stays the same?", right: "The kind of matter it is", wrong: ["The arrangement of its particles", "How fast its particles move"], hint: "Ice, water and water vapour are all the same substance.", hard: true },
  { prompt: "A cold window pane fogs up on the inside of a warm kitchen. What happened to the water vapour in the air?", right: "It lost thermal energy and condensed", wrong: ["It gained thermal energy and evaporated", "It melted"], hint: "Warm, moist air cooling against cold glass condenses.", hard: true },
  { prompt: "A frozen juice bar drips in the sun. Which change of state is this?", right: "Melting", wrong: ["Freezing", "Condensation"], hint: "A solid turns into a liquid when it absorbs thermal energy." },
  { prompt: "Ice cubes form in a tray in the freezer. Which change of state is this?", right: "Freezing", wrong: ["Melting", "Evaporation"], hint: "A liquid turns into a solid when it releases thermal energy." },
  { prompt: "A puddle slowly disappears on a warm, sunny day. Where did the water go?", right: "It evaporated into the air as water vapour", wrong: ["It froze into the ground", "It turned into a solid"], hint: "Liquid water changed into a gas." },
  { prompt: "Which change of state takes thermal energy away from matter?", right: "Condensation", wrong: ["Melting", "Evaporation"], hint: "A gas has to lose thermal energy to become a liquid." },
  { prompt: "Which change of state needs thermal energy to be added?", right: "Evaporation", wrong: ["Freezing", "Condensation"], hint: "A liquid needs extra energy to become a gas." },
  { prompt: "Butter softens and melts in a hot frying pan. What is happening to its particles?", right: "They gain energy and move more freely", wrong: ["They stop moving", "They are destroyed"], hint: "More thermal energy lets particles slide past each other." },
  { prompt: "On a cold morning, grass has tiny drops of water on it. What change of state made them?", right: "Condensation of water vapour in the air", wrong: ["Melting of the grass", "Freezing of the air"], hint: "Vapour cooled against the cold grass and became liquid." },
  { prompt: "A bowl of water is left on a counter for days and the level goes down. What is the cause?", right: "Evaporation", wrong: ["Condensation", "Melting"], hint: "Water slowly changes into water vapour and mixes with the air." },
  { prompt: "At about what temperature does ice melt?", right: "0 °C", wrong: ["50 °C", "100 °C"], hint: "Water freezes and ice melts at 0 °C." },
  { prompt: "Snow on a roof melts as the weather warms. What happens to the thermal energy of the snow?", right: "It absorbs thermal energy", wrong: ["It releases thermal energy", "It gains mass"], hint: "Melting needs energy to be added.", hard: true },
  { prompt: "Which of these is a physical change of state that is NOT water?", right: "Wax melting near a candle flame", wrong: ["A match burning", "Bread being toasted"], hint: "A change of state keeps the same substance. Burning and toasting make new substances.", hard: true },
];

const STATE_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put these in order from LEAST thermal energy to MOST.",
  hint: "A solid has the least energy and its particles move the least. A gas has the most.",
  items: [
    { id: "ice", label: "Ice (solid water)", emoji: "🧊" },
    { id: "water", label: "Liquid water", emoji: "💧" },
    { id: "vapour", label: "Water vapour (gas)", emoji: "♨️" },
  ],
};

// ---------- Matter changes (C2.4, C2.5, C1) ----------

const CHANGES: Item[] = [
  { prompt: "Cutting paper into small pieces is a…", right: "physical change", wrong: ["chemical change", "change that makes a new substance"], hint: "The pieces are still paper. No new substance forms." },
  { prompt: "Which is a physical change?", right: "Melting an ice cube", wrong: ["Burning a match", "Rusting a bike chain"], hint: "Ice and water are the same substance." },
  { prompt: "Which is a chemical change?", right: "Baking bread dough", wrong: ["Cutting bread", "Freezing bread"], hint: "Baking creates new substances that were not in the dough." },
  { prompt: "Which is a sign of a chemical change?", right: "A new gas forms and bubbles appear", wrong: ["A solid is cut into smaller pieces", "A liquid is poured into a new container"], hint: "Gas bubbles, colour changes, light, heat or a new smell can show a new substance." },
  { prompt: "Baking soda and vinegar are mixed and fizz. What does this show?", right: "A chemical change made a new gas", wrong: ["Only a physical change happened", "Nothing happened"], hint: "A gas formed that was not there before." },
  { prompt: "Sugar is stirred into tea and seems to disappear. This is a…", right: "physical change", wrong: ["chemical change", "change of state to a gas"], hint: "The sugar is still there, and you could taste it. No new substance formed." },
  { prompt: "Iron turns reddish-brown rust. This is a…", right: "chemical change", wrong: ["physical change", "change of state"], hint: "Rust is a new substance." },
  { prompt: "A banana peel turns brown. What kind of change is this?", right: "Chemical change", wrong: ["Physical change", "Change of state"], hint: "A colour change that you cannot undo shows a new substance." },
  { prompt: "A student crushes a can. This is a…", right: "physical change", wrong: ["chemical change", "change of state"], hint: "The shape changed, but it is still the same metal." },
  { prompt: "Which change is hard to reverse?", right: "Burning wood", wrong: ["Folding paper", "Freezing water"], hint: "Burning makes ash and gases, which are new substances." },
  { prompt: "Plastic bags can take hundreds of years to break down. Which action helps reduce this harm?", right: "Reuse cloth bags", wrong: ["Use a new plastic bag every time", "Bury plastic bags in a park"], hint: "Reusing a bag means fewer new ones need to be made and thrown away." },
  { prompt: "Which of these is NOT a good sign of a chemical change?", right: "Something gets bigger", wrong: ["A new colour appears", "Heat or light is given off", "A new smell appears"], hint: "A change in size alone can happen in a physical change." },
  { prompt: "Why is making new aluminum cans from recycled cans better for the environment than from new aluminum?", right: "It uses much less energy and avoids mining", wrong: ["It makes the cans heavier", "It uses more water and energy"], hint: "Recycled metal does not have to be mined and processed from the ground again.", hard: true },
  { prompt: "A factory burns fuel to make a product. What is one possible effect of this process on the environment?", right: "It can release gases that pollute the air", wrong: ["It always cleans the air", "It uses no energy at all"], hint: "Burning fuel can release greenhouse gases and other pollutants.", hard: true },
  { prompt: "Ice is melted, then the water is boiled. Which statement is correct?", right: "Both are physical changes", wrong: ["Both are chemical changes", "Melting is chemical and boiling is physical"], hint: "Ice, water and steam are all the same substance, so no new substance formed.", hard: true },
  { prompt: "Wax melts near a candle flame, while the wick burns. Why is only the burning a chemical change?", right: "Burning makes new substances; melting does not", wrong: ["Burning does not change the wick", "Melting makes new gases"], hint: "Look for whether a new substance forms.", hard: true },
];

const CHANGES_SORT: SortSet = {
  prompt: "Physical change or chemical change? Tap an item, then tap its basket.",
  hint: "A chemical change makes a new substance. A physical change does not.",
  bins: [
    { id: "physical", label: "Physical change", emoji: "✂️" },
    { id: "chemical", label: "Chemical change", emoji: "🔥" },
  ],
  items: [
    { label: "Melting butter", emoji: "🧈", bin: "physical" },
    { label: "Tearing paper", emoji: "📄", bin: "physical" },
    { label: "Dissolving sugar in tea", emoji: "🍵", bin: "physical" },
    { label: "Crushing a can", emoji: "🥫", bin: "physical" },
    { label: "A banana turning brown", emoji: "🍌", bin: "chemical" },
    { label: "Burning a match", emoji: "🔥", bin: "chemical" },
    { label: "Rusting a bike chain", emoji: "🚲", bin: "chemical" },
    { label: "Baking bread", emoji: "🍞", bin: "chemical" },
  ],
};

// ---------- Forces on structures (D1, D2) ----------

const FORCES: Item[] = [
  { prompt: "Which internal force squeezes a material together?", right: "Compression", wrong: ["Tension", "Torsion"], hint: "Compression pushes particles together, like standing on a post." },
  { prompt: "Which internal force pulls a material apart?", right: "Tension", wrong: ["Compression", "Shear"], hint: "Tension stretches, like a rope in a tug-of-war." },
  { prompt: "A column that holds up a roof is mainly under…", right: "compression", wrong: ["tension", "torsion"], hint: "The weight above is pushing down on it." },
  { prompt: "A suspension cable on a bridge is mainly under…", right: "tension", wrong: ["compression", "torsion"], hint: "The cable is pulled by the weight it holds." },
  { prompt: "Wringing out a wet cloth by twisting it is an example of…", right: "torsion", wrong: ["tension only", "compression only"], hint: "Torsion is a twisting force." },
  { prompt: "Scissors cutting paper use which force?", right: "Shear", wrong: ["Torsion", "Compression only"], hint: "Shear makes parts of a material slide past each other in opposite directions." },
  { prompt: "Is wind an internal force or an external force on a building?", right: "External force", wrong: ["Internal force", "No force at all"], hint: "External forces come from outside the structure." },
  { prompt: "The weight of a bridge itself is called its…", right: "dead load", wrong: ["live load", "torsion"], hint: "A dead load is the permanent weight of the structure." },
  { prompt: "The cars and trucks crossing a bridge are called its…", right: "live load", wrong: ["dead load", "shear"], hint: "A live load is a weight that comes and goes." },
  { prompt: "Many roofs in snowy places are steeply sloped. Why?", right: "Snow slides off, so the load on the roof is smaller", wrong: ["It makes the snow heavier", "It stops the wind"], hint: "Less snow staying on the roof means less force pushing down." },
  { prompt: "Which feature helps a building resist the shaking of an earthquake?", right: "Cross-bracing", wrong: ["A heavier roof", "A very thin, tall frame with no supports"], hint: "Diagonal braces stop a frame from twisting or collapsing sideways." },
  { prompt: "A turtle's shell helps protect it from which kind of force?", right: "Being pressed or crushed", wrong: ["Being stretched like a rubber band", "Being heated by the Sun"], hint: "The domed, hard shell spreads out a squeezing force." },
  { prompt: "A cycling helmet protects your head by…", right: "absorbing and spreading out the force of an impact", wrong: ["making you fall more slowly", "stopping all forces from acting"], hint: "Protective equipment lessens the force that reaches your body." },
  { prompt: "A dam is built much thicker at the bottom than at the top. Why?", right: "Water pressure is greatest at the bottom", wrong: ["Water is lighter at the bottom", "It uses less concrete that way"], hint: "The deeper the water, the bigger the force it pushes with.", hard: true },
  { prompt: "A tall palm tree bends a lot in a hurricane but often does not break. How does that help?", right: "Its flexible trunk bends with the force instead of snapping", wrong: ["Its trunk is made of solid steel", "It has no weight"], hint: "Flexible materials can absorb a force by bending.", hard: true },
  { prompt: "Some buildings in the North are raised on posts above frozen ground. Why?", right: "Heat from the building would otherwise thaw the ground and make it sink", wrong: ["To make the roof lighter", "To keep wind from touching the walls"], hint: "Permafrost is frozen ground. Thawing makes it soft and unstable.", hard: true },
  { prompt: "A flood-prone community builds its homes on stilts. How does this help?", right: "Floodwater can pass underneath, so less force pushes on the house", wrong: ["It makes the house heavier", "It stops the rain from falling"], hint: "Moving the structure above the water cuts the damage from the flood.", hard: true },
  { prompt: "Which pair is correct?", right: "Torsion twists a beam; shear slides one part past another", wrong: ["Torsion stretches a beam; shear squeezes it", "Torsion slides parts; shear twists them"], hint: "Torsion is a twist. Shear is a slide in opposite directions.", hard: true },
];

const FORCES_SORT: SortSet = {
  prompt: "Internal or external force on a structure? Tap an item, then tap its basket.",
  hint: "Internal forces act inside the materials. External forces push or pull on the structure from outside.",
  bins: [
    { id: "internal", label: "Internal force", emoji: "🔩" },
    { id: "external", label: "External force", emoji: "🌬️" },
  ],
  items: [
    { label: "Tension", emoji: "↔️", bin: "internal" },
    { label: "Compression", emoji: "⬇️", bin: "internal" },
    { label: "Torsion", emoji: "🌀", bin: "internal" },
    { label: "Shear", emoji: "✂️", bin: "internal" },
    { label: "Wind", emoji: "🌬️", bin: "external" },
    { label: "Heavy snow on a roof", emoji: "❄️", bin: "external" },
    { label: "Earthquake shaking", emoji: "🌋", bin: "external" },
    { label: "Traffic on a bridge", emoji: "🚚", bin: "external" },
  ],
};

// ---------- Forms of energy (E2.1–E2.4) ----------

const ENERGY: Item[] = [
  { prompt: "Energy stored in food and fuel is called…", right: "chemical energy", wrong: ["sound energy", "light energy"], hint: "Chemical energy is stored in the bonds of substances." },
  { prompt: "The energy of motion is called…", right: "kinetic energy", wrong: ["potential energy", "chemical energy"], hint: "Anything that moves has kinetic energy." },
  { prompt: "A stretched elastic band has…", right: "stored (potential) energy", wrong: ["no energy", "only sound energy"], hint: "Stretching stores energy that can be released." },
  { prompt: "Which has more gravitational potential energy?", right: "A book on a high shelf", wrong: ["The same book on the floor", "A book that is moving along the floor"], hint: "The higher an object is lifted, the more energy it stores." },
  { prompt: "A solar panel changes light energy into…", right: "electrical energy", wrong: ["sound energy", "chemical energy only"], hint: "Solar cells make electricity from sunlight." },
  { prompt: "A speaker changes electrical energy into mostly…", right: "sound energy", wrong: ["chemical energy", "gravitational potential energy"], hint: "A speaker's cone vibrates and makes sound." },
  { prompt: "A toaster changes electrical energy into mostly…", right: "thermal (heat) energy", wrong: ["sound energy", "chemical energy"], hint: "The wires glow and give off heat to toast the bread." },
  { prompt: "What does the law of conservation of energy say?", right: "Energy cannot be created or destroyed, only changed from one form to another", wrong: ["Energy is used up when things move", "Energy can be made from nothing"], hint: "Energy changes form, but the total amount stays the same." },
  { prompt: "You rub your hands together and they feel warm. Kinetic energy changed into…", right: "thermal energy", wrong: ["light energy", "chemical energy"], hint: "Friction turns motion into heat." },
  { prompt: "At the top of the first hill, a roller coaster has mostly…", right: "potential energy", wrong: ["kinetic energy", "no energy"], hint: "It is high up and about to roll down." },
  { prompt: "A roller coaster speeds along the bottom of a hill. It now has mostly…", right: "kinetic energy", wrong: ["potential energy", "no energy"], hint: "Stored energy has been changed into motion." },
  { prompt: "A plant uses light energy to make sugar. What form of energy is stored in the sugar?", right: "Chemical energy", wrong: ["Sound energy", "Thermal energy only"], hint: "Plants store energy from the Sun in the sugars they make." },
  { prompt: "An old-style light bulb gives off light and a lot of heat. What does the heat show?", right: "Some energy was not changed into the light we wanted", wrong: ["Energy was destroyed", "Heat is a form of matter"], hint: "Some energy dissipates as heat into the surroundings.", hard: true },
  { prompt: "A ball is dropped and bounces a little lower each time. Where does some of its energy go?", right: "Into thermal and sound energy in the ball, floor and air", wrong: ["It is destroyed", "It turns back into mass"], hint: "Energy is conserved. It spreads into the surroundings.", hard: true },
  { prompt: "A wind-up toy stops after its spring unwinds. What happened to the spring's stored energy?", right: "It changed to motion, then to heat and sound", wrong: ["It disappeared", "It is still in the spring"], hint: "Stored energy changed form as the toy moved.", hard: true },
  { prompt: "In a hydroelectric station, which is the correct chain of energy changes?", right: "Gravitational potential → kinetic → electrical", wrong: ["Electrical → kinetic → chemical", "Light → sound → electrical"], hint: "Water high up flows down (kinetic) and spins a turbine that makes electricity.", hard: true },
  { prompt: "A moving swing has kinetic energy. When it pauses at the top of its path, it has mostly…", right: "potential energy", wrong: ["sound energy", "chemical energy"], hint: "At the highest point, the swing stops for a moment and its energy is stored." },
  { prompt: "A battery in a flashlight stores which form of energy?", right: "Chemical energy", wrong: ["Sound energy", "Kinetic energy"], hint: "Batteries store energy in chemicals." },
  { prompt: "A flashlight changes chemical energy first into…", right: "electrical energy", wrong: ["sound energy", "potential energy"], hint: "The battery makes electricity, which lights the bulb." },
  { prompt: "A campfire gives off which two forms of energy that you can feel and see?", right: "Heat and light", wrong: ["Sound and gravity", "Electricity and magnetism"], hint: "You feel the warmth and see the glow." },
  { prompt: "A bike rolls down a hill and speeds up. What kind of energy is increasing?", right: "Kinetic energy", wrong: ["Chemical energy", "Sound energy only"], hint: "The faster it goes, the more kinetic energy it has." },
  { prompt: "You clap your hands and hear a sound. Kinetic energy changed into…", right: "sound energy", wrong: ["chemical energy", "gravitational energy"], hint: "The motion makes the air vibrate." },
  { prompt: "A wind turbine changes the kinetic energy of the wind into…", right: "electrical energy", wrong: ["chemical energy", "sound energy only"], hint: "Spinning blades turn a generator." },
  { prompt: "A rock sits at the top of a cliff. If it falls, what happens to its potential energy?", right: "It changes into kinetic energy", wrong: ["It is destroyed", "It becomes mass"], hint: "Stored energy changes into motion." },
  { prompt: "A mixer changes electrical energy into mostly…", right: "kinetic energy", wrong: ["chemical energy", "potential energy"], hint: "The blades spin." },
  { prompt: "Which object has the most kinetic energy?", right: "A fast-moving car", wrong: ["A parked car", "A closed book on a desk"], hint: "The faster something moves, the more kinetic energy it has." },
  { prompt: "A wound-up toy car is ready to go. What kind of energy does the spring have?", right: "Potential energy", wrong: ["Kinetic energy", "Sound energy"], hint: "The spring is storing energy." },
  { prompt: "Why do your hands feel warm after you rub them?", right: "Friction changes motion into thermal energy", wrong: ["Energy is created from nothing", "The air gets colder"], hint: "Rubbing turns kinetic energy into heat.", hard: true },
  { prompt: "A light bulb is 10% efficient and wastes most energy as heat. What does that mean?", right: "Only a little of the electrical energy becomes light", wrong: ["All of the energy becomes light", "The bulb makes more energy than it uses"], hint: "Efficiency compares useful energy to total energy used.", hard: true },
];

const ENERGY_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "In a flashlight, put the energy changes in order.",
  hint: "The battery stores chemical energy. Electricity then flows to the bulb, which shines.",
  items: [
    { id: "chem", label: "Chemical energy stored in the battery", emoji: "🔋" },
    { id: "elec", label: "Electrical energy flows through the wires", emoji: "⚡" },
    { id: "light", label: "Light energy shines from the bulb", emoji: "💡" },
  ],
};

// ---------- Energy sources (E2.5, E2.6, E1) ----------

const SOURCES: Item[] = [
  { prompt: "Which energy source is renewable?", right: "Wind", wrong: ["Coal", "Oil"], hint: "Wind will keep blowing as long as the Sun heats the Earth." },
  { prompt: "Which of these is a fossil fuel?", right: "Coal", wrong: ["Wind", "Sunlight"], hint: "Fossil fuels formed from ancient plants and animals." },
  { prompt: "Why are coal, oil and natural gas called non-renewable?", right: "They take millions of years to form, so we use them faster than they form", wrong: ["They are made from metal", "They can be made again each week"], hint: "Renewable means replaced naturally within a short time." },
  { prompt: "What does it mean for an energy source to be renewable?", right: "It is replaced by nature in a short time", wrong: ["It can never be harmful", "It is always free"], hint: "Sunlight, wind and flowing water are renewed all the time." },
  { prompt: "Which gas, released when fossil fuels burn, traps heat in the atmosphere?", right: "Carbon dioxide", wrong: ["Helium", "Oxygen"], hint: "Carbon dioxide is a greenhouse gas." },
  { prompt: "Why is burning fossil fuels linked to climate change?", right: "It adds greenhouse gases that trap more heat in the atmosphere", wrong: ["It makes the Sun hotter", "It removes oxygen from space"], hint: "More greenhouse gases keep more heat near Earth." },
  { prompt: "Hydroelectric stations make electricity using…", right: "flowing water", wrong: ["burning coal", "nuclear reactions"], hint: "Moving water spins a turbine." },
  { prompt: "Which technology uses less energy to give the same amount of light?", right: "LED bulb", wrong: ["Old-style incandescent bulb", "Candle"], hint: "LEDs turn more of the electricity into light and less into heat." },
  { prompt: "Which action uses technology to reduce energy use at home?", right: "A programmable thermostat that lowers the heat when no one is home", wrong: ["Leaving lights on all day", "Opening the window in winter while heating"], hint: "It heats only when the heat is needed." },
  { prompt: "Geothermal energy comes from…", right: "heat inside the Earth", wrong: ["burning wood", "the Moon's pull"], hint: "'Geo' means Earth and 'thermal' means heat." },
  { prompt: "Which is a way an individual can conserve energy?", right: "Turn off lights when leaving a room", wrong: ["Leave the TV on while out", "Run the dishwasher half-empty"], hint: "Using less electricity saves energy and resources." },
  { prompt: "Solar panels don't make electricity at night. What helps solve this?", right: "Batteries that store extra energy for later", wrong: ["Using fewer panels", "Painting the panels black"], hint: "Stored energy can be used when the Sun is down.", hard: true },
  { prompt: "In Canada, which renewable source provides the most electricity?", right: "Hydroelectric power", wrong: ["Solar power", "Tidal power"], hint: "Canada has many large rivers, and about 60% of its electricity comes from falling water.", hard: true },
  { prompt: "A phone charger left plugged in with no phone attached still uses a small amount of electricity. What can you do?", right: "Unplug it when it isn't in use", wrong: ["Plug in more chargers", "Wrap the charger in cloth"], hint: "Small amounts of wasted energy add up over time.", hard: true },
  { prompt: "Which pair are both non-renewable?", right: "Natural gas and uranium", wrong: ["Natural gas and wind", "Uranium and sunlight"], hint: "Natural gas is a fossil fuel. Uranium is mined and can run out.", hard: true },
];

const SOURCES_SORT: SortSet = {
  prompt: "Renewable or non-renewable? Tap an item, then tap its basket.",
  hint: "Renewable sources are replaced naturally. Non-renewable ones can run out.",
  bins: [
    { id: "renew", label: "Renewable", emoji: "♻️" },
    { id: "non", label: "Non-renewable", emoji: "⛽" },
  ],
  items: [
    { label: "Sunlight", emoji: "☀️", bin: "renew" },
    { label: "Wind", emoji: "🌬️", bin: "renew" },
    { label: "Flowing water", emoji: "🌊", bin: "renew" },
    { label: "Heat from inside Earth", emoji: "🌋", bin: "renew" },
    { label: "Coal", emoji: "🪨", bin: "non" },
    { label: "Oil", emoji: "🛢️", bin: "non" },
    { label: "Natural gas", emoji: "🔥", bin: "non" },
    { label: "Uranium", emoji: "⚛️", bin: "non" },
  ],
};

// ---------- STEM skills (A1–A3) ----------

const SKILLS: Item[] = [
  { prompt: "In a fair test, how many variables should you change at a time?", right: "One", wrong: ["Two", "As many as possible"], hint: "Change one thing so you know what caused the result." },
  { prompt: "A student tests how the amount of light affects how fast beans sprout. What should stay the same?", right: "Type of seed, water and soil", wrong: ["Amount of light", "Nothing"], hint: "Everything except the thing you change should be controlled." },
  { prompt: "Why do scientists repeat a trial several times?", right: "To check that the results are reliable", wrong: ["To make the experiment last longer", "To change the question"], hint: "A result that happens again and again is easier to trust." },
  { prompt: "What should you wear when you heat something in class?", right: "Safety goggles", wrong: ["Sunglasses", "Oven mitts on your head"], hint: "Goggles protect your eyes from splashes and sparks." },
  { prompt: "You are not sure if a material is safe to touch. What should you do?", right: "Ask your teacher before touching it", wrong: ["Taste a tiny bit", "Smell it up close"], hint: "Never taste or sniff unknown materials. Ask an adult." },
  { prompt: "Which graph best shows how a temperature changed over a whole afternoon?", right: "A line graph", wrong: ["A pictograph", "A circle graph"], hint: "Line graphs show change over time." },
  { prompt: "A list of step-by-step instructions that a computer follows is called…", right: "a program (or algorithm)", wrong: ["a variable", "a bug"], hint: "A program is a sequence of steps." },
  { prompt: "In coding, a loop is used to…", right: "repeat a set of steps", wrong: ["stop the program for good", "name a variable"], hint: "A loop saves writing the same step many times." },
  { prompt: "In code, what does points = points + 1 do?", right: "Adds 1 to the number stored in the variable points", wrong: ["Sets points to 1 every time", "Makes the program stop"], hint: "A variable stores a value. This line updates it." },
  { prompt: "An error in a program that makes it do something unexpected is a…", right: "bug", wrong: ["loop", "variable"], hint: "Finding and fixing bugs is called debugging." },
  { prompt: "A smart thermostat uses sensors and code to…", right: "adjust the temperature without being told each time", wrong: ["cool the house by itself using no energy", "decide who lives in the house"], hint: "Sensors give data and code makes decisions using that data." },
  { prompt: "Which skilled trade uses knowledge of electricity every day?", right: "An electrician", wrong: ["A baker", "A librarian"], hint: "Electricians install and repair wiring." },
  { prompt: "In an engineering design process, what do you do after building a prototype?", right: "Test it and look for ways to improve it", wrong: ["Throw it away", "Skip to the final report"], hint: "Designers test, then improve." },
  { prompt: "The thing you change in an experiment is called the…", right: "independent (changed) variable", wrong: ["dependent (measured) variable", "conclusion"], hint: "The measured result depends on what you change.", hard: true },
  { prompt: "In an experiment on how salt affects the time water takes to freeze, which is the measured variable?", right: "The time it takes to freeze", wrong: ["The amount of salt", "The size of the cup"], hint: "The thing measured at the end is the dependent variable.", hard: true },
  { prompt: "A team wants to share findings with younger students. What is the best format?", right: "A short, clear poster with pictures and simple words", wrong: ["A long report full of technical terms", "A table of raw numbers only"], hint: "Match the format and vocabulary to the audience.", hard: true },
  { prompt: "A sensor reading temperature once a minute stores the numbers in a list. Why is a list useful?", right: "The program can store and process many values in order", wrong: ["Lists make the sensor more accurate", "Lists stop the program from needing data"], hint: "A list holds many data values that code can loop through.", hard: true },
  { prompt: "Why do scientists record their results in a table?", right: "To organize data so patterns are easy to see", wrong: ["To hide the results", "To make the test shorter"], hint: "Tables show measurements clearly." },
  { prompt: "Which tool measures the mass of an object?", right: "A balance or scale", wrong: ["A thermometer", "A ruler"], hint: "Mass is measured in grams and kilograms." },
  { prompt: "Which tool measures temperature?", right: "A thermometer", wrong: ["A balance", "A metre stick"], hint: "Thermometers show degrees Celsius." },
  { prompt: "Why should you tie back long hair during a science investigation?", right: "So it does not catch in equipment or a flame", wrong: ["So it looks tidy", "So it stays cool"], hint: "Loose hair is a safety risk near equipment and heat." },
  { prompt: "A coding program has a step that repeats ten times. Which idea does it use?", right: "A loop", wrong: ["A variable only", "A bug"], hint: "Loops repeat steps." },
  { prompt: "In code, what is a variable?", right: "A named place to store a value", wrong: ["A mistake in the code", "A step that never runs"], hint: "Variables hold values that can change, like a score." },
  { prompt: "Two plants get different amounts of water, but one gets more light too. Why is this not a fair test?", right: "More than one thing was changed", wrong: ["Plants cannot be tested", "Water does not matter"], hint: "Change only one variable at a time." },
  { prompt: "What is the first step of the engineering design process?", right: "Define the problem and who needs help", wrong: ["Test the final product", "Share a finished poster"], hint: "Designers begin by understanding the problem." },
  { prompt: "Which job might use science and technology to design safer bridges?", right: "A civil engineer", wrong: ["A florist", "A bus driver"], hint: "Civil engineers plan and design buildings and bridges." },
  { prompt: "Why do scientists share their results with others?", right: "So others can check and build on their ideas", wrong: ["To avoid being checked", "Because they have to be quiet"], hint: "Sharing helps everyone learn.", hard: true },
];

const DESIGN_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the steps of the engineering design process in order.",
  hint: "Start with the problem, plan and build, then test and improve.",
  items: [
    { id: "define", label: "Define the problem", emoji: "❓" },
    { id: "plan", label: "Plan and design a solution", emoji: "📐" },
    { id: "build", label: "Build a prototype", emoji: "🔨" },
    { id: "test", label: "Test it", emoji: "🧪" },
    { id: "improve", label: "Improve and share", emoji: "🔁" },
  ],
};

function withOrder(bank: Item[], order: OrderQuestion, d: Level): Question[] {
  return shuffle([...levelled(bank, 7, d), order]);
}

export const units: Unit[] = [
  {
    id: "healthy-choices-5",
    title: "Healthy Choices",
    emoji: "🥗",
    blurb: "Food, sleep, air and technology",
    standards: on("B1.1–B1.3", "factors and technologies that affect health, and food literacy"),
    parentNote: "How sleep, activity, air quality, sun, sound and food choices affect health, how technologies help or harm, and reading labels.",
    generate: ({ difficulty = 2 } = {}) => withSort(HEALTH, HEALTH_SORT, difficulty),
  },
  {
    id: "body-teamwork-5",
    title: "Body Teamwork",
    emoji: "🧠",
    blurb: "Systems that work together",
    standards: on("B2.1, B2.3, B2.4", "the nervous and excretory systems, how systems interact, and common diseases and disorders"),
    parentNote: "The nervous and excretory systems, how body systems depend on each other, and which organs some common diseases and disorders affect.",
    generate: ({ difficulty = 2 } = {}) => withSort(BODY, BODY_SORT, difficulty),
  },
  {
    id: "states-of-matter-5",
    title: "Solid, Liquid, Gas",
    emoji: "🧊",
    blurb: "Mass, volume and particles",
    standards: on("C2.1, C2.2, C2.7", "matter, mass and volume, the states of matter, and why properties make materials useful"),
    parentNote: "Matter as anything with mass and volume, how particles are arranged in solids, liquids and gases, and why materials are chosen for their properties.",
    generate: ({ difficulty = 2 } = {}) => withSort(MATTER, MATTER_SORT, difficulty),
  },
  {
    id: "changes-of-state-5",
    title: "Changes of State",
    emoji: "♨️",
    blurb: "Melting, freezing and more",
    standards: on("C2.3, C2.6", "melting, freezing, evaporation and condensation, and thermal energy"),
    parentNote: "Melting, freezing, evaporation and condensation at home and outdoors, and how matter absorbs or releases thermal energy when it changes state.",
    generate: ({ difficulty = 2 } = {}) => withOrder(STATE_CHANGES, STATE_ORDER, difficulty),
  },
  {
    id: "matter-changes-5",
    title: "Physical or Chemical?",
    emoji: "🧪",
    blurb: "Changes that make new things",
    standards: on("C1.1, C1.2, C2.4, C2.5", "physical and chemical changes, signs of a chemical change, and the impact of making common products"),
    parentNote: "Telling a physical change from a chemical change, spotting the signs of a new substance, and how making and throwing away everyday products affects the environment.",
    generate: ({ difficulty = 2 } = {}) => withSort(CHANGES, CHANGES_SORT, difficulty),
  },
  {
    id: "forces-on-structures-5",
    title: "Forces on Structures",
    emoji: "🌉",
    blurb: "Tension, compression and more",
    standards: on("D1.1, D1.2, D2.1–D2.5", "internal and external forces, loads, and how structures, living things and protective equipment withstand forces"),
    parentNote: "Tension, compression, torsion and shear, loads and natural forces such as wind, snow and earthquakes, and how buildings, animals and safety gear cope with them.",
    generate: ({ difficulty = 2 } = {}) => withSort(FORCES, FORCES_SORT, difficulty),
  },
  {
    id: "forms-of-energy-5",
    title: "Forms of Energy",
    emoji: "💡",
    blurb: "Energy changes form",
    standards: on("E2.1–E2.4", "forms of energy, potential and kinetic energy, and the conservation of energy"),
    parentNote: "Kinetic and potential energy, how energy changes from one form to another, and why some energy always escapes as heat, light or sound.",
    generate: ({ difficulty = 2 } = {}) => withOrder(ENERGY, ENERGY_ORDER, difficulty),
  },
  {
    id: "energy-sources-5",
    title: "Energy Sources",
    emoji: "🌬️",
    blurb: "Renewable or not?",
    standards: on("E1.1, E1.2, E2.5, E2.6", "renewable and non-renewable energy, fossil fuels and climate change, and saving energy with technology"),
    parentNote: "Renewable and non-renewable sources, how burning fossil fuels contributes to climate change, and everyday ways to use less energy.",
    generate: ({ difficulty = 2 } = {}) => withSort(SOURCES, SOURCES_SORT, difficulty),
  },
  {
    id: "science-skills-5",
    title: "Think Like a Scientist",
    emoji: "🔬",
    blurb: "Fair tests, safety and coding",
    standards: on("A1.1–A1.5, A2.1, A2.2, A3.1", "investigation skills, safety, communicating results, coding and careers"),
    parentNote: "Planning a fair test, working safely, choosing how to show results, the steps of engineering design, and basic coding ideas such as loops and variables.",
    generate: ({ difficulty = 2 } = {}) => withOrder(SKILLS, DESIGN_ORDER, difficulty),
  },
];
