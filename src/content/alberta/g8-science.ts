import type { SortSet } from "../bank";
import { orderOf, typed } from "../grades/kit";
import { pick, randInt } from "../random";
import type { Unit } from "../types";
import { ab } from "./kit";
import { partsPlus, q } from "./g8-bank";

// Alberta Grade 8 science units written for the Alberta Science 7–9 program (2003), Units A to E.
// Ontario's fluids, machines and work units and BC's cells unit are shared where they fit (see g8.ts).
// These units cover the parts of the Alberta units that those do not. All content is original.

// ---------- Unit A: Mix and Flow of Matter ----------

const MIXTURES = [
  q(1, "What does WHMIS stand for?", "Workplace Hazardous Materials Information System", ["Water Hazard Monitoring and Inspection Service", "Workplace Health Measures for Indoor Safety", "World Handling of Materials in Schools"], "WHMIS labels tell workers and students how to handle hazardous products safely."),
  q(1, "A WHMIS symbol shows a flame. What does it warn about?", "The material can catch fire.", ["The material is a good conductor.", "The material is safe to eat.", "The material must be kept in sunlight."], "A flame means the product is flammable. Keep it away from heat and sparks."),
  q(1, "A WHMIS symbol shows a skull and crossbones. What does it warn about?", "The material is poisonous and can be deadly.", ["The material is very old.", "The material is a pirate toy.", "The material is slippery."], "This symbol means serious toxicity. Handle it only with the proper safety steps."),
  q(1, "Which of these is a pure substance?", "distilled water", ["salt water", "orange juice", "soil"], "A pure substance is made of only one kind of material."),
  q(1, "In salt water, which part is the solute?", "the salt", ["the water", "the cup", "the air"], "The solute is what dissolves. The solvent is the material that does the dissolving."),
  q(1, "In a solution, the material that does the dissolving is called the…", "solvent", ["solute", "precipitate", "mixture"], "In sugar water, the water is the solvent."),
  q(2, "Which is a mechanical mixture?", "trail mix", ["clear apple juice", "tap water with dissolved salt", "air in a sealed jar"], "In a mechanical mixture you can see the different parts."),
  q(2, "Which is a solution?", "sugar completely dissolved in water", ["sand stirred into water", "oil floating on vinegar", "pebbles in a bucket"], "A solution looks like one material because the solute is spread evenly through the solvent."),
  q(2, "A solution holds as much solute as it can at a given temperature. What is it called?", "saturated", ["diluted", "filtered", "evaporated"], "A saturated solution cannot dissolve any more solute at that temperature."),
  q(2, "Which change speeds up how fast sugar dissolves in water?", "stirring", ["using a bigger cup", "cooling the water", "using bigger lumps of sugar"], "Stirring brings fresh solvent to the solute. Smaller pieces and warmer water also help."),
  q(2, "A student crushes a sugar cube before adding it to water. What does this change?", "The sugar dissolves faster because there is more surface touching the water.", ["The sugar can never dissolve.", "The water gets heavier.", "The sugar changes into salt."], "Smaller particles give the solvent more surface to work on."),
  q(2, "For most solids, what usually happens to solubility when the water is heated?", "More solute can dissolve.", ["Less solute can dissolve.", "Nothing dissolves.", "The solute turns into a gas."], "Warm water can usually hold more dissolved solid than cold water."),
  q(3, "According to the particle model, why does sugar stay mixed in water?", "The sugar particles are attracted to the water particles and spread out between them.", ["The sugar disappears completely.", "The water particles stop moving.", "The sugar turns into water."], "The attraction between solute and solvent particles helps keep the solute in solution."),
  q(3, "A fish tank is moved from a cool room to a warm room. What can happen to the oxygen dissolved in the water?", "Less oxygen can stay dissolved, because gases dissolve less in warm water.", ["More oxygen dissolves.", "The oxygen turns into salt.", "Nothing can change."], "Unlike most solids, gases are less soluble in warm liquids."),
  q(3, "Which describes a good way to compare the solubility of two solids fairly?", "Use the same amount and temperature of water for each solid.", ["Use hot water for one and cold for the other.", "Use different amounts of water each time.", "Stir one and not the other."], "A fair test changes only one variable at a time."),
  q(3, "Why do workers wear a mask and gloves when WHMIS labels show a corrosion symbol?", "The product can burn skin or damage eyes and metals.", ["The product is magnetic.", "The product is very cold.", "The product makes noise."], "A corrosion symbol warns of burns and damage. Follow the label and the safety data sheet."),
];

const MIX_SORT: SortSet = {
  prompt: "Pure substance, mechanical mixture or solution? Sort each material.",
  hint: "A pure substance is one material. A mechanical mixture has parts you can see. A solution is evenly mixed, with a solute dissolved in a solvent.",
  bins: [
    { id: "mix", label: "Mechanical mixture", emoji: "🥗" },
    { id: "solution", label: "Solution", emoji: "🧂" },
  ],
  items: [
    { label: "trail mix", emoji: "🥜", bin: "mix" },
    { label: "fruit salad", emoji: "🍓", bin: "mix" },
    { label: "gravel and sand", emoji: "🪨", bin: "mix" },
    { label: "granola", emoji: "🥣", bin: "mix" },
    { label: "salt in water", emoji: "🧂", bin: "solution" },
    { label: "sugar in tea", emoji: "🍵", bin: "solution" },
    { label: "air", emoji: "💨", bin: "solution" },
    { label: "windshield washer fluid", emoji: "🚗", bin: "solution" },
  ],
};

const concentration = () => {
  const c = pick([4, 6, 8, 10, 12, 20, 25]);
  const V = pick([100, 200, 250, 500]);
  const g = (c * V) / 100;
  return typed(`A solution has ${g} g of sugar dissolved in ${V} mL of solution. What is the concentration, in g per 100 mL?`, String(c), `Divide by the volume, then scale to 100 mL: ${g} ÷ ${V} × 100 = ${c} g/100 mL.`, "number", { suffix: "g/100 mL" });
};

// ---------- Unit B: Cells and Systems ----------

const CELLS = [
  q(1, "What is the basic unit of life?", "the cell", ["the organ", "the tissue", "the atom"], "All living things are made of one or more cells."),
  q(1, "Which of these is a single-celled organism?", "an amoeba", ["a grizzly bear", "a poplar tree", "a goldfish"], "An amoeba is one cell that does all the jobs of living."),
  q(1, "Which of these is multicellular?", "a poplar tree", ["an amoeba", "a bacterium", "a yeast cell"], "Multicellular organisms are made of many cells that work together."),
  q(1, "A cell part found in plant cells but not animal cells is the…", "cell wall", ["cell membrane", "nucleus", "cytoplasm"], "Plant cells have a stiff cell wall outside the membrane. Animal cells do not."),
  q(2, "Which part of a plant cell captures light energy for making food?", "chloroplast", ["nucleus", "cell wall", "vacuole"], "Chloroplasts contain the green chlorophyll that captures light energy."),
  q(2, "Diffusion is the movement of particles from…", "an area of higher concentration to an area of lower concentration", ["an area of lower concentration to higher concentration", "a hot area to a cold area only", "the nucleus to the membrane only"], "Particles spread out until they are evenly mixed."),
  q(2, "Osmosis is the movement of which material through a cell membrane?", "water", ["salt", "sugar", "oxygen only"], "Osmosis is the diffusion of water across a membrane."),
  q(2, "Which of these shows how living things are organized, from small to large?", "cell, tissue, organ, organ system, organism", ["organ, cell, tissue, organism, organ system", "tissue, cell, organism, organ, organ system", "organism, organ system, cell, tissue, organ"], "Cells form tissues, tissues form organs, organs form systems and systems form an organism."),
  q(2, "A group of similar cells working together is called a…", "tissue", ["organ", "system", "nucleus"], "Muscle tissue, for example, is made of many muscle cells."),
  q(2, "Which cells carry oxygen around the body?", "red blood cells", ["skin cells", "nerve cells", "bone cells"], "Red blood cells pick up oxygen in the lungs and deliver it to the body."),
  q(3, "Why are nerve cells long and thin?", "They carry messages quickly over long distances.", ["They store fat.", "They carry oxygen.", "They make bone."], "A cell's shape often matches its job."),
  q(3, "A slice of celery placed in salty water goes limp. What is the best explanation?", "Water moves out of the cells by osmosis.", ["Salt moves out of the cells.", "The cells split in two.", "The celery makes more water."], "Water moves toward the side with more dissolved material, which here is the outside."),
  q(3, "How is a plant cell different from an animal cell?", "A plant cell has a cell wall and chloroplasts.", ["A plant cell has no nucleus.", "An animal cell has a cell wall.", "A plant cell has no membrane."], "Cell walls and chloroplasts are two structures that plants have and animals do not."),
  q(3, "Why do multicellular organisms need specialized cells?", "Different cells can do different jobs, so the whole organism works better.", ["Every cell must do exactly the same job.", "Specialized cells never work together.", "Only single cells can do jobs."], "Specialization lets cells, tissues and organs share the work."),
];

const ORGANIZATION = orderOf(
  "Put these levels of organization in order from smallest to largest.",
  "Cells make tissues, tissues make organs, organs work in systems, and systems make up an organism.",
  [
    { id: "cell", label: "Cell", emoji: "🔬" },
    { id: "tissue", label: "Tissue", emoji: "🧵" },
    { id: "organ", label: "Organ", emoji: "🫀" },
    { id: "system", label: "Organ system", emoji: "🫁" },
    { id: "organism", label: "Organism", emoji: "🧍" },
  ],
);

const magnification = () => {
  const eye = pick([10, 15]);
  const obj = pick([4, 10, 40]);
  return typed(`A microscope has a ${eye}× eyepiece and a ${obj}× objective lens. What is the total magnification?`, String(eye * obj), `Multiply the two lenses: ${eye} × ${obj} = ${eye * obj}.`, "number", { suffix: "×" });
};

const SYSTEMS = [
  q(1, "Which body system brings oxygen into the body?", "the respiratory system", ["the digestive system", "the excretory system", "the skeletal system"], "The lungs take in oxygen and release carbon dioxide."),
  q(1, "Which organ pumps blood around the body?", "the heart", ["the lungs", "the stomach", "the kidneys"], "The heart is a muscle that keeps blood moving."),
  q(1, "Where does most digestion of food happen and nutrients get absorbed?", "the small intestine", ["the lungs", "the kidneys", "the heart"], "The small intestine is long and folded to absorb nutrients into the blood."),
  q(1, "Which organs filter wastes from the blood and make urine?", "the kidneys", ["the lungs", "the liver only", "the heart"], "The kidneys are the main organs of the excretory system."),
  q(2, "Which vessels carry blood away from the heart?", "arteries", ["veins", "alveoli", "nerves"], "Arteries carry blood away from the heart, and veins return it."),
  q(2, "Where in the lungs does oxygen pass into the blood?", "the alveoli", ["the trachea", "the stomach", "the esophagus"], "Alveoli are tiny air sacs surrounded by capillaries."),
  q(2, "Why does your heart beat faster when you exercise?", "Your muscles need more oxygen and nutrients delivered faster.", ["Your heart is trying to cool the air.", "Your lungs need to rest.", "Your blood needs to stop."], "The body responds to changing conditions by changing how fast it circulates blood."),
  q(2, "A hand touches a hot pot and pulls away before the person feels pain. What is this quick response called?", "a reflex", ["digestion", "circulation", "excretion"], "A reflex is a fast, automatic response that protects the body."),
  q(2, "Which body parts are sense organs?", "eyes, ears, nose, tongue and skin", ["heart, lungs and kidneys", "stomach and intestines", "bones and muscles only"], "Sense organs pick up information from the environment and send it to the brain."),
  q(2, "Which system includes the brain, spinal cord and nerves?", "the nervous system", ["the respiratory system", "the digestive system", "the excretory system"], "The nervous system carries messages between the body and the brain."),
  q(3, "On a smoky day during wildfire season, why might some people have trouble breathing?", "Smoke particles can irritate the airways and lungs.", ["Smoke makes the stomach grow.", "Smoke slows the heart to a stop.", "Smoke fills the kidneys."], "Air quality affects the healthy function of the respiratory system."),
  q(3, "How do the respiratory and circulatory systems work together?", "The lungs add oxygen to the blood, and the blood carries it to every cell.", ["The lungs pump the blood.", "The heart breathes air in and out.", "They do not interact."], "Each cell needs oxygen, and the two systems team up to deliver it."),
  q(3, "Why is the small intestine lined with many tiny folds?", "They give more surface for absorbing nutrients.", ["They make food taste better.", "They keep the food from moving.", "They store air."], "More surface area means more nutrients can pass into the blood."),
  q(3, "How have immunization programs improved human health?", "They help the body protect itself against certain diseases.", ["They replace the circulatory system.", "They make bones bigger.", "They stop all illnesses."], "Medical research on cells and body systems has led to new ways to prevent illness."),
];

const SYSTEM_SORT: SortSet = {
  prompt: "Which body system does each organ belong to?",
  hint: "The lungs and trachea help us breathe. The stomach and intestines digest food.",
  bins: [
    { id: "resp", label: "Respiratory", emoji: "🫁" },
    { id: "dig", label: "Digestive", emoji: "🍽️" },
  ],
  items: [
    { label: "lungs", emoji: "🫁", bin: "resp" },
    { label: "trachea (windpipe)", emoji: "🌬️", bin: "resp" },
    { label: "diaphragm", emoji: "↕️", bin: "resp" },
    { label: "alveoli", emoji: "🫧", bin: "resp" },
    { label: "stomach", emoji: "🍽️", bin: "dig" },
    { label: "small intestine", emoji: "🌀", bin: "dig" },
    { label: "esophagus", emoji: "⬇️", bin: "dig" },
    { label: "large intestine", emoji: "💧", bin: "dig" },
  ],
};

const DIGESTION = orderOf(
  "Put the path of food through the digestive system in order.",
  "Food is chewed in the mouth, travels down the esophagus, is mixed in the stomach, has nutrients absorbed in the small intestine and has water absorbed in the large intestine.",
  [
    { id: "mouth", label: "Mouth", emoji: "👄" },
    { id: "esophagus", label: "Esophagus", emoji: "⬇️" },
    { id: "stomach", label: "Stomach", emoji: "🍽️" },
    { id: "small", label: "Small intestine", emoji: "🌀" },
    { id: "large", label: "Large intestine", emoji: "💧" },
  ],
);

// ---------- Unit C: Light and Optical Systems ----------

const LIGHT = [
  q(1, "Which of these is a source of light?", "the Sun", ["the Moon", "a mirror", "a window"], "The Sun makes its own light. The Moon only reflects sunlight."),
  q(1, "Light travels in…", "straight lines", ["curves", "zigzags", "circles"], "The ray model shows light as straight lines called rays."),
  q(1, "Which kind of material lets light pass through so you can see clearly?", "transparent", ["opaque", "translucent", "reflective"], "Clear glass is transparent."),
  q(1, "Which kind of material blocks light completely?", "opaque", ["transparent", "translucent", "clear"], "Opaque materials, such as wood, make shadows."),
  q(1, "Frosted glass lets some light through but you cannot see clearly. It is…", "translucent", ["transparent", "opaque", "luminous"], "Translucent materials scatter the light that passes through."),
  q(2, "A ray of light strikes a flat mirror. The angle it hits at is equal to the angle it…", "reflects at", ["refracts at", "absorbs at", "disappears at"], "The law of reflection: the angle of incidence equals the angle of reflection."),
  q(2, "What is refraction?", "the bending of light as it passes from one material to another", ["the bouncing of light off a surface", "the soaking up of light by a surface", "the making of light"], "Light changes speed in a new material, so it changes direction."),
  q(2, "A straw in a glass of water looks bent at the water's surface. Why?", "Light bends as it passes from water to air.", ["The straw really bends.", "The glass is curved like a mirror.", "Water absorbs the straw."], "Refraction makes the straw look broken."),
  q(2, "Which surface absorbs the most light?", "a rough, dark surface", ["a smooth mirror", "a white sheet", "polished metal"], "Dark, rough surfaces absorb more light and reflect less."),
  q(2, "How can you tell that light travels in straight lines when it passes through dusty air?", "You can see a straight beam.", ["The dust makes the light round.", "The beam always curves.", "The beam disappears."], "A beam through dust or fog shows the straight path of light."),
  q(3, "A ray of light hits a mirror at 35° to the normal (the line at right angles to the mirror). At what angle does it reflect?", "35° to the normal", ["55° to the normal", "70° to the normal", "90° to the normal"], "The angle of reflection equals the angle of incidence."),
  q(3, "When light moves from air into water, what happens?", "It slows down and bends toward the normal.", ["It speeds up and bends away from the normal.", "It stops completely.", "It does not change direction."], "Light travels more slowly in water than in air, so it bends toward the normal."),
  q(3, "How do rainbows form?", "Sunlight is refracted and split into colours by raindrops.", ["Rain makes its own coloured light.", "Clouds paint colours on the sky.", "Mirrors in the sky reflect colours."], "Water droplets bend different colours by slightly different amounts."),
  q(3, "A plane mirror shows your image. How far behind the mirror does the image seem to be if you stand 2 m in front of it?", "2 m", ["1 m", "4 m", "0 m"], "A plane mirror forms an image as far behind the mirror as you are in front."),
  q(3, "On a hot highway, drivers sometimes see what looks like water on the road. This is a…", "mirage, caused by light refracting through layers of air at different temperatures", ["puddle of water vapour", "reflection from the Moon", "shadow of the sky"], "Hot and cooler air layers bend light differently."),
];

const mirrorDistance = () => {
  const d = randInt(2, 9);
  return typed(`You stand ${d} m in front of a plane mirror. How far are you from your image, in metres?`, String(d * 2), `The image is ${d} m behind the mirror, so you are ${d} + ${d} = ${d * 2} m from it.`, "number", { suffix: "m" });
};
const reflectAngle = () => {
  const a = pick([20, 25, 30, 35, 40, 45, 50, 55, 60]);
  return typed(`A ray hits a flat mirror and makes an angle of ${a}° with the normal. What is the angle of reflection?`, String(a), `The angle of reflection equals the angle of incidence, so it is ${a}°.`, "number", { suffix: "°" });
};

const OPTICS = [
  q(1, "A magnifying glass is made with a…", "convex lens", ["concave lens", "plane mirror", "prism"], "A convex lens is thicker in the middle and bends light together."),
  q(1, "Which part of the eye lets light in?", "the pupil", ["the retina", "the optic nerve", "the eyelid"], "The pupil is the opening in the iris."),
  q(1, "Which part of the eye is the light-sensitive screen at the back?", "the retina", ["the cornea", "the iris", "the pupil"], "The retina receives the image and sends signals to the brain."),
  q(1, "What does a microscope help us see?", "very small things", ["very distant things", "things in the dark", "sound waves"], "A microscope uses lenses to magnify tiny objects, such as cells."),
  q(2, "What does a convex lens do to parallel rays of light?", "It brings them together at a point.", ["It spreads them apart.", "It stops them.", "It turns them into sound."], "A convex lens is a converging lens."),
  q(2, "What does a concave lens do to parallel rays of light?", "It spreads them apart.", ["It brings them together at a point.", "It stops them.", "It makes them stronger."], "A concave lens is thinner in the middle and diverges light."),
  q(2, "The image formed on the retina is…", "upside down, and the brain turns it the right way up", ["right side up and bigger", "a sound", "not made by the eye"], "The lens makes an inverted image, and the brain interprets it."),
  q(2, "Which part of a camera works like the iris and pupil of the eye?", "the aperture", ["the memory card", "the flash", "the battery"], "The aperture controls how much light gets in."),
  q(2, "Which part of a digital camera works like the retina?", "the image sensor", ["the shutter button", "the strap", "the screen cover"], "The sensor captures the image, like the retina does."),
  q(2, "What does a refracting telescope use to bring distant objects closer?", "lenses", ["only mirrors", "only prisms", "microphones"], "Galileo built an early refracting telescope with lenses in 1609."),
  q(3, "A microscope has two convex lenses. What are they called?", "the objective lens and the eyepiece", ["the cornea and the retina", "the iris and the pupil", "the shutter and the flash"], "The objective lens is close to the object. The eyepiece is the one you look through."),
  q(3, "Eyeglasses with concave lenses help someone who is nearsighted. What do they do?", "Spread the light slightly before it enters the eye so it focuses on the retina.", ["Make the image smaller and blurry.", "Block most of the light.", "Replace the retina."], "Nearsighted eyes focus light in front of the retina. A concave lens fixes this."),
  q(3, "An insect such as a housefly has compound eyes. What does this mean?", "Each eye is made of many tiny lenses.", ["The eye has no lens.", "The eye sees only in black.", "The eye is part of the antenna."], "A compound eye is made of thousands of tiny units."),
  q(3, "How do digital cameras store images?", "as numbers in a file", ["as tiny prints inside the lens", "as sound waves", "as heat"], "A digital camera turns the light on its sensor into digital data."),
  q(3, "How has the invention of the microscope helped science?", "It let scientists see cells and tiny organisms for the first time.", ["It made stars brighter.", "It replaced eyes.", "It stopped diseases at once."], "Microscopes opened up the study of cells, bacteria and other tiny living things."),
];

// ---------- Unit D: Mechanical Systems ----------

const MECH = [
  q(1, "What does a gear do?", "It transmits motion and force by turning.", ["It stores electricity.", "It makes light.", "It cools air."], "Gears have teeth that mesh to pass turning motion from one shaft to another."),
  q(1, "Two meshed gears turn in…", "opposite directions", ["the same direction", "no direction", "straight lines"], "When one gear turns clockwise, the gear it meshes with turns counterclockwise."),
  q(1, "Which machine was used long ago to lift water to higher ground?", "Archimedes' screw", ["a wind turbine", "a computer", "a jet engine"], "A turning screw inside a tube lifts water as it spins."),
  q(1, "A bicycle chain connects two gears. Which system is this?", "a chain drive, which transmits motion between shafts", ["a hydraulic lift", "a pneumatic drill", "an electric circuit"], "Belts and chains carry motion from one wheel or gear to another."),
  q(2, "A small gear drives a large gear. What happens to the speed of the large gear?", "It turns more slowly than the small gear.", ["It turns faster than the small gear.", "It turns at the same speed.", "It does not turn."], "The larger gear has more teeth, so it makes fewer turns."),
  q(2, "A small gear drives a large gear. What happens to the force?", "The force increases and the speed decreases.", ["The force decreases and the speed increases.", "Both increase.", "Both stay exactly the same."], "A driver with fewer teeth turning a driven gear with more teeth trades speed for force."),
  q(2, "Why do bikes have a low gear for climbing hills?", "It gives more force at the pedals, but more turns are needed.", ["It makes the bike lighter.", "It gives more speed with less effort.", "It makes the road flat."], "Low gears trade speed for force."),
  q(2, "A fixed single pulley mainly…", "changes the direction of the force", ["doubles the force", "halves the distance", "removes friction"], "A fixed pulley lets you pull down to lift up, but the force stays about the same."),
  q(2, "What does a grain auger use to move grain up a tube?", "a rotating screw", ["a magnet", "a mirror", "a lens"], "The same idea as Archimedes' screw: turning a screw moves material along a tube."),
  q(2, "Which source of energy powers an old mill wheel?", "moving water", ["natural gas", "sunlight on solar panels", "a battery"], "Moving water pushes the wheel's blades and turns the shaft."),
  q(3, "Why is the actual force advantage of a machine less than the theoretical one?", "Friction between parts wastes some energy.", ["Gravity switches off.", "Pulleys get lighter.", "The load becomes smaller."], "Friction turns some input energy into heat."),
  q(3, "How can a machine's efficiency be improved?", "Reduce friction, for example with oil or grease.", ["Add rust to the gears.", "Make the surfaces rougher.", "Remove all lubricants."], "Lubricants let parts slide past each other more easily."),
  q(3, "A pulley system has 4 rope sections supporting the load. About what is its ideal mechanical advantage?", "4", ["1", "2", "8"], "Each supporting section shares the load, so the ideal mechanical advantage matches the number of supporting sections."),
  q(3, "Why should a mechanical device be evaluated for its impact on the environment as well as its efficiency?", "A very efficient device might still cause pollution or use up resources.", ["Efficiency is the only thing that matters.", "The environment is not affected by machines.", "Impact cannot be measured."], "Good design considers cost, safety, efficiency and effects on people and nature."),
];

const gearTurns = () => {
  const dr = pick([10, 12, 15, 20]);
  const dn = dr * pick([2, 3, 4]);
  const turns = pick([2, 3, 4, 6]) * (dn / dr);
  const out = (turns * dr) / dn;
  return typed(`A driver gear with ${dr} teeth turns a driven gear with ${dn} teeth. The driver makes ${turns} full turns. How many full turns does the driven gear make?`, String(out), `The driven gear has ${dn / dr} times as many teeth, so it turns ${dn / dr} times as slowly: ${turns} ÷ ${dn / dr} = ${out}.`, "number");
};
const efficiency = () => {
  const input = pick([100, 200, 250, 400, 500]);
  const pct = pick([50, 60, 70, 75, 80, 90]);
  const output = (input * pct) / 100;
  return typed(`A machine takes in ${input} J of work and delivers ${output} J of useful work. What is its efficiency, in percent?`, String(pct), `Efficiency = output ÷ input × 100 = ${output} ÷ ${input} × 100 = ${pct}%.`, "number", { suffix: "%" });
};

// ---------- Unit E: Freshwater and Saltwater Systems ----------

const QUALITY = [
  q(1, "About how much of Earth's water is fresh water?", "about 3%", ["about 50%", "about 97%", "about 25%"], "Most of Earth's water is salt water in the oceans."),
  q(1, "Where is most of Earth's fresh water stored?", "in glaciers and ice caps", ["in rivers", "in the air", "in the soil only"], "Most fresh water is frozen in ice, so it is not easy to use."),
  q(1, "Water that is safe to drink is called…", "potable", ["saline", "turbid", "brackish"], "Potable water is safe for drinking."),
  q(1, "Which of these does a clarity test of water check?", "how clear or cloudy the water is", ["how warm the water is", "how much the water weighs", "how loudly it flows"], "Cloudy water has particles floating in it."),
  q(2, "Which is a way to make fresh water from salt water?", "distillation", ["adding more salt", "stirring it quickly", "shining a flashlight on it"], "Distillation boils water and collects the vapour, leaving the salt behind."),
  q(2, "Reverse osmosis cleans water by…", "forcing it through a very fine membrane under pressure", ["freezing it", "adding more salt", "letting it settle for a day"], "The membrane lets water through but holds back dissolved salt."),
  q(2, "What does salinity measure?", "how much salt is dissolved in water", ["how clear the water is", "how acidic the water is", "how warm the water is"], "Ocean water is about 3.5% salt, while fresh water has very little."),
  q(2, "Which test of water quality checks for tiny living things that could make people sick?", "a test for bacteria", ["a test for colour", "a test for size", "a test for noise"], "Drinking water is tested to make sure it is free of harmful bacteria."),
  q(2, "Which is a physical characteristic of a water sample?", "its clarity", ["the number of fish in the lake", "the name of the river", "the age of the pipe"], "Clarity, colour, smell and temperature are physical characteristics."),
  q(3, "Water from the Columbia Icefield in the Rocky Mountains flows toward which three places?", "The Pacific Ocean, the Arctic Ocean and Hudson Bay", ["Only the Pacific Ocean", "Lake Superior, the Gulf of Mexico and the Pacific Ocean", "The Atlantic Ocean only"], "A high point in the Rockies sends meltwater in three different directions through different river systems."),
  q(3, "Why can dissolved minerals make water 'hard'?", "Calcium and magnesium dissolved in it build up in kettles and pipes.", ["They make the water heavier than air.", "They remove oxygen from the water.", "They turn the water to ice."], "Hard water leaves mineral scale, which is why water treatment may soften it."),
  q(3, "A town gets its water from a river. Which is the best reason to test the river water regularly?", "Water quality can change with pollution, runoff and season.", ["Water never changes.", "Testing makes the water cleaner by itself.", "River water is always unsafe."], "Regular monitoring helps protect people and living things."),
  q(3, "Why must water for drinking be treated even if it looks clear?", "Clear water can still contain harmful germs or dissolved chemicals.", ["Clear water is always safe.", "Treatment makes water dirtier.", "Only cloudy water has germs."], "Clarity does not tell you everything about water quality."),
];

const SHORES = [
  q(1, "What is erosion?", "the wearing away and moving of rock and soil", ["the dropping of material in a new place", "the freezing of water", "the building of a dam"], "Water, wind and ice can wear down land and carry material away."),
  q(1, "What is deposition?", "the dropping of material that was carried by water, wind or ice", ["the wearing away of rock", "the melting of ice", "the freezing of a lake"], "When moving water slows down, it drops what it carries."),
  q(1, "What causes most ocean waves?", "wind blowing over the water", ["fish swimming", "the Moon's light", "volcanoes"], "Wind pushes the surface and makes waves."),
  q(1, "What mainly causes the tides?", "the pull of the Moon's gravity (and the Sun's)", ["the wind", "the speed of the Earth's spin only", "fish migrating"], "The Moon's gravity pulls ocean water, so the water rises and falls twice a day in most places."),
  q(2, "Where does a river flow fastest?", "down a steep slope", ["across a flat plain", "into a lake", "through a wide, shallow bend"], "A steeper slope means faster flow and more erosion."),
  q(2, "On a river bend (meander), where does the water erode the most?", "on the outside of the bend", ["on the inside of the bend", "exactly in the middle", "nowhere"], "Water moves fastest on the outside, so it wears the bank away there and drops sediment on the inside."),
  q(2, "What is a delta?", "land built up from sediment where a river meets a larger body of water", ["a mountain", "a kind of fish", "a deep ocean trench"], "When a river slows down at its mouth, it drops its sediment."),
  q(2, "Which feature is found on the ocean floor?", "a deep trench", ["a tall glacier", "a sand dune", "a prairie"], "Ocean basins have shelves, slopes, trenches and ridges."),
  q(2, "What is a glacier?", "a large, slow-moving mass of ice on land", ["a frozen lake", "a floating iceberg", "a block of snow in a freezer"], "Glaciers form where more snow falls than melts."),
  q(2, "The Gulf Stream is an ocean current that carries warm water. What effect does it have?", "It helps keep the climate of northwestern Europe milder.", ["It makes Europe colder.", "It stops the tides.", "It causes earthquakes."], "Ocean currents carry heat from one region to another."),
  q(3, "The Columbia Icefield is shrinking. What is the most likely reason?", "Warmer temperatures are melting more ice than the snowfall adds.", ["More snow is falling than ever.", "The Sun is moving away.", "People are carrying ice away by hand."], "A glacier shrinks when it loses more ice than it gains."),
  q(3, "Why might a river carry more sediment after a heavy rain?", "Fast, high water has more energy to pick up and carry material.", ["The sediment gets lighter.", "The river gets shorter.", "The river flows backward."], "More flow means more erosion and a bigger sediment load."),
  q(3, "The Peace-Athabasca Delta in northern Alberta is one of the world's largest inland freshwater deltas. How did it form?", "Rivers drop sediment where they flow into a lake, building land over time.", ["A volcano erupted under the water.", "A glacier dug a hole in the ground.", "Wind blew soil into a pile."], "Deposition at a river's mouth slowly builds a delta."),
  q(3, "How does a cold ocean current like the Labrador Current affect nearby coastal climate?", "It tends to cool the air along the coast.", ["It always warms the coast.", "It has no effect on climate.", "It stops rain completely."], "Water temperature affects the temperature of the air above it."),
];

const ERODE_SORT: SortSet = {
  prompt: "Erosion or deposition? Sort each example.",
  hint: "Erosion wears away and carries material off. Deposition drops material in a new place.",
  bins: [
    { id: "erosion", label: "Erosion", emoji: "🌊" },
    { id: "deposition", label: "Deposition", emoji: "🏖️" },
  ],
  items: [
    { label: "a river cuts a deep canyon", emoji: "🏞️", bin: "erosion" },
    { label: "waves wear away a cliff", emoji: "🌊", bin: "erosion" },
    { label: "a glacier scrapes a valley", emoji: "🧊", bin: "erosion" },
    { label: "a spring flood carries away riverbank soil", emoji: "💦", bin: "erosion" },
    { label: "a delta builds up at a river mouth", emoji: "🌾", bin: "deposition" },
    { label: "a sandbar forms in a calm bend", emoji: "🏖️", bin: "deposition" },
    { label: "silt settles in a quiet lake", emoji: "🪨", bin: "deposition" },
    { label: "waves pile sand onto a beach", emoji: "🏝️", bin: "deposition" },
  ],
};

const AQUATIC = [
  q(1, "Why do fish have gills?", "to take oxygen from the water", ["to taste the food", "to stay warm", "to hear sounds"], "Gills pull dissolved oxygen out of the water."),
  q(1, "Which fish is the provincial fish of Alberta?", "the bull trout", ["the sockeye salmon", "the goldfish", "the shark"], "The bull trout lives in cold, clean streams in the foothills and mountains."),
  q(1, "Why do many fish have a streamlined body?", "so they can move through water easily", ["so they can climb trees", "so they can fly", "so they can hide in the sand"], "A smooth, tapered shape cuts through water."),
  q(1, "Cold, fast-flowing water usually holds more…", "dissolved oxygen", ["salt", "plastic", "sand"], "Oxygen dissolves better in cold water and moving water mixes in air."),
  q(2, "A pond turns green and slimy in the summer, and fish die. What is a likely cause?", "too many nutrients from fertilizer, which cause an algal bloom", ["too much oxygen", "too many stars", "not enough sand"], "When algae die and rot, the bacteria that break them down use up the oxygen in the water."),
  q(2, "Which animals living in a creek show that the water is clean?", "stoneflies and mayfly nymphs", ["leeches and bloodworms", "no animals at all", "only algae"], "Some insects need clean, oxygen-rich water. Others can live in poor water."),
  q(2, "How is a whale adapted to cold ocean water?", "It has a thick layer of blubber.", ["It has thin skin.", "It has gills that sense heat.", "It has feathers."], "Blubber insulates the whale and stores energy."),
  q(2, "A fish that lives in the ocean must handle salty water. A fish that lives in a lake handles…", "fresh water with very little salt", ["only ice", "much saltier water", "no water"], "Freshwater and saltwater fish have different adaptations for keeping salts in balance."),
  q(2, "What can happen if a fishery takes too many fish too quickly?", "The fish population can collapse.", ["There will be more fish next year.", "Nothing changes.", "The water gets saltier."], "Overfishing, such as the collapse of Atlantic cod stocks in the early 1990s, shows why limits are needed."),
  q(3, "Why does Alberta inspect boats at watercraft inspection stations?", "To stop invasive mussels from being moved into Alberta lakes and rivers.", ["To collect fishing licences only.", "To count the boats.", "To clean the boats' paint."], "Invasive mussels can harm ecosystems and block water pipes, so people are asked to clean, drain and dry their boats."),
  q(3, "Which human activity can affect water quality downstream?", "irrigating farmland with fertilizer runoff", ["a cloud passing overhead", "a leaf floating on a creek", "snow falling on a mountain"], "Runoff can carry nutrients and chemicals into streams."),
  q(3, "Which is the best example of a way scientists monitor a watershed?", "Testing water samples and counting small animals at the same sites every year", ["Guessing the water's age", "Painting the riverbed", "Moving the river"], "Regular testing shows how a stream changes over time."),
  q(3, "A lake has few kinds of living things and low oxygen. What can you infer about its water quality?", "It is probably poor.", ["It is excellent.", "It is perfect for all fish.", "It has no pollution."], "Healthy water usually supports many kinds of life."),
  q(3, "Why can't every water issue be solved with science and technology alone?", "People also have to choose to prevent pollution and protect water.", ["Science cannot test water.", "Technology cannot filter water.", "Water is not important."], "Choices by people, communities and governments matter as much as technology."),
];

export const units: Unit[] = [
  {
    id: "mixtures-solutions-ab",
    title: "Mixtures, Solutions & WHMIS",
    emoji: "🧪",
    blurb: "Dissolving, concentration and safe handling",
    standards: ab("Unit A: Mix and Flow of Matter", "WHMIS symbols, pure substances, mixtures and solutions, solubility and concentration, using the particle model"),
    parentNote: "Safety symbols on hazardous products, telling pure substances, mechanical mixtures and solutions apart, what changes how fast and how much a solid dissolves, and measuring concentration in grams per 100 mL.",
    generate: partsPlus({ items: MIXTURES, sorts: [MIX_SORT] }, [concentration]),
  },
  {
    id: "cells-diffusion-ab",
    title: "Cells, Tissues & Organs",
    emoji: "🔬",
    blurb: "Single cells, specialized cells, diffusion and osmosis",
    standards: ab("Unit B: Cells and Systems", "the role of cells, single-celled and multicelled organisms, plant and animal cells, diffusion and osmosis, and cells, tissues and organs"),
    parentNote: "Why cells are the basic unit of life, how plant and animal cells differ, how materials move into and out of cells, and how cells form tissues, organs and systems. Includes working out microscope magnification.",
    generate: partsPlus({ items: CELLS, orders: [ORGANIZATION] }, [magnification]),
  },
  {
    id: "body-systems-ab",
    title: "Human Body Systems",
    emoji: "🫀",
    blurb: "Breathing, blood, digestion and how the body responds",
    standards: ab("Unit B: Cells and Systems", "body systems for respiration, circulation, digestion, excretion and sensory awareness, and how the body responds to changing conditions"),
    parentNote: "The main jobs of the respiratory, circulatory, digestive, excretory and nervous systems, how they work together, and what affects healthy function, such as exercise and air quality.",
    generate: partsPlus({ items: SYSTEMS, sorts: [SYSTEM_SORT], orders: [DIGESTION] }),
  },
  {
    id: "light-behaviour-ab",
    title: "How Light Behaves",
    emoji: "🔦",
    blurb: "Reflection, refraction and the ray model",
    standards: ab("Unit C: Light and Optical Systems", "transmission, reflection, absorption and refraction of light, and the ray model of light"),
    parentNote: "Light as rays that travel in straight lines, how materials reflect, absorb or transmit it, the law of reflection and why light bends (refracts) between materials.",
    generate: partsPlus({ items: LIGHT }, [reflectAngle, mirrorDistance]),
  },
  {
    id: "optics-vision-ab",
    title: "Lenses, Eyes & Optical Devices",
    emoji: "🔭",
    blurb: "Microscopes, telescopes, cameras and the eye",
    standards: ab("Unit C: Light and Optical Systems", "convex and concave lenses, image formation, vision and the eye, microscopes, telescopes, cameras and digital imaging"),
    parentNote: "How lenses form images, how the eye and a camera are alike, how microscopes and telescopes extended what scientists could see, and how technology helps vision and stores images.",
    generate: partsPlus({ items: OPTICS }),
  },
  {
    id: "gears-efficiency-ab",
    title: "Gears, Pulleys & Efficiency",
    emoji: "⚙️",
    blurb: "Speed ratios, force ratios and why friction matters",
    standards: ab("Unit D: Mechanical Systems", "gears, belts and pulleys that transmit force and motion, speed and force ratios, efficiency, and how mechanical devices have changed over time"),
    parentNote: "How gears trade speed for force, how pulleys and screws are used, how to calculate efficiency, and how designers weigh efficiency against effects on people and the environment.",
    generate: partsPlus({ items: MECH }, [gearTurns, efficiency]),
  },
  {
    id: "water-quality-ab",
    title: "Fresh Water, Salt Water & Water Quality",
    emoji: "🚰",
    blurb: "Where water is, and how we test and clean it",
    standards: ab("Unit E: Freshwater and Saltwater Systems", "the distribution of water in Alberta, Canada and the world, water quality tests, and making fresh water from salt water"),
    parentNote: "How much of Earth's water is fresh, where it is stored, what makes water safe to drink, simple water quality tests, and ways to turn salt water into fresh water.",
    generate: partsPlus({ items: QUALITY }),
  },
  {
    id: "shores-streams-ab",
    title: "Waves, Streams & Glaciers",
    emoji: "🌊",
    blurb: "How moving water and ice shape the land",
    standards: ab("Unit E: Freshwater and Saltwater Systems", "erosion and deposition by waves, streams and glaciers, tides, ocean basins and ocean currents"),
    parentNote: "How water and ice wear away and rebuild land, what causes waves and tides, how streams and deltas form, what ocean basins look like, and how ocean currents affect climate.",
    generate: partsPlus({ items: SHORES, sorts: [ERODE_SORT] }),
  },
  {
    id: "aquatic-life-ab",
    title: "Life in Water & Our Impact",
    emoji: "🐟",
    blurb: "Aquatic adaptations, indicators and caring for water",
    standards: ab("Unit E: Freshwater and Saltwater Systems", "life in freshwater and saltwater environments, adaptations, water quality and living things, and human impacts on aquatic systems"),
    parentNote: "How animals are adapted to water, what living things tell us about water quality, how nutrients and fishing can harm aquatic systems, and how people monitor and protect them.",
    generate: partsPlus({ items: AQUATIC }),
  },
];
