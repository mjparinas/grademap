import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, InputQuestion, OrderQuestion, Question, Visual } from "../../types";
import { sortQuestion, type BankItem, type SortSet } from "../../bank";

// Grade 5 science: body systems, solutions and mixtures, simple machines,
// the rock cycle and natural resources. Bank items marked `hard` are stretch
// questions: difficulty 1 uses only the core items, 2 mixes in about a third,
// 3 is mostly stretch. Data questions get harder with difficulty too.

type Level = NonNullable<GenerateOptions["difficulty"]>;
type Item = BankItem & { hard?: true; visual?: Visual };

const NAMES = ["Maya", "Jay", "Sam", "Amir", "Lena", "Kenji", "Zoe", "Ravi", "Ana", "Noah", "Priya", "Leo"];

function toQuestion(b: Item): Question {
  const visual: Visual | undefined =
    b.visual ?? (b.emoji ? { type: "emoji", emoji: b.emoji, caption: b.caption } : undefined);
  const q = textChoice(b.prompt, b.right, b.wrong, b.hint, visual);
  if (b.speak) q.speak = b.speak;
  return q;
}

function levelled(bank: Item[], count: number, difficulty: Level): Question[] {
  const easy = bank.filter((b) => !b.hard);
  const hard = bank.filter((b) => b.hard);
  const want = difficulty === 1 ? 0 : difficulty === 2 ? Math.ceil(count / 3) : Math.ceil((count * 2) / 3);
  const nHard = Math.min(want, hard.length);
  return [...sample(easy, count - nHard), ...sample(hard, nHard)].map(toQuestion);
}

/** Two-basket sorts grow with difficulty (4, 6 or 8 items). */
const perBin = (d: Level) => (d === 1 ? 2 : d === 2 ? 3 : 4);

function input(prompt: string, answer: number, hint: string, visual?: Visual, suffix?: string): InputQuestion {
  return { kind: "input", prompt, hint, visual, answer: String(answer), keypad: "number", suffix };
}

// ---------- Digestion & Breathing ----------

const DIGESTION_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the parts of the digestive system in the order food travels through them.",
  hint: "Food is chewed in the mouth, squeezed down the esophagus, churned in the stomach, then moves through the small intestine and finally the large intestine.",
  items: [
    { id: "mouth", label: "Mouth: teeth chew and saliva mixes in", emoji: "👄" },
    { id: "esophagus", label: "Esophagus: muscles squeeze food down", emoji: "⬇️" },
    { id: "stomach", label: "Stomach: acid and juices churn the food", emoji: "🌀" },
    { id: "small", label: "Small intestine: nutrients pass into the blood", emoji: "🩸" },
    { id: "large", label: "Large intestine: water is absorbed", emoji: "💧" },
  ],
};

const AIR_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Trace the path of a breath of air. Put the steps in order.",
  hint: "Air enters through the nose or mouth, goes down the trachea, splits into the two bronchi, and reaches tiny air sacs where oxygen passes into the blood.",
  items: [
    { id: "nose", label: "Air enters through the nose or mouth", emoji: "👃" },
    { id: "trachea", label: "Air travels down the trachea (windpipe)", emoji: "⬇️" },
    { id: "bronchi", label: "Air splits into the two bronchi, one for each lung", emoji: "🫁" },
    { id: "alveoli", label: "Air reaches the alveoli (tiny air sacs)", emoji: "🎈" },
    { id: "blood", label: "Oxygen passes into the blood", emoji: "🩸" },
  ],
};

const DIGEST_BREATHE_SORT: SortSet = {
  prompt: "Digestive system or respiratory system? Tap an item, then tap its basket.",
  hint: "The digestive system breaks down food. The respiratory system brings in oxygen and gets rid of carbon dioxide.",
  bins: [
    { id: "digestive", label: "digestive", emoji: "🍽️" },
    { id: "respiratory", label: "respiratory", emoji: "🫁" },
  ],
  items: [
    { label: "teeth grind food", emoji: "🦷", bin: "digestive" },
    { label: "esophagus pushes food down", emoji: "⬇️", bin: "digestive" },
    { label: "stomach churns food", emoji: "🌀", bin: "digestive" },
    { label: "small intestine absorbs nutrients", emoji: "🍞", bin: "digestive" },
    { label: "large intestine absorbs water", emoji: "💧", bin: "digestive" },
    { label: "liver makes bile", emoji: "🧪", bin: "digestive" },
    { label: "lungs fill with air", emoji: "🫁", bin: "respiratory" },
    { label: "nose warms and filters air", emoji: "👃", bin: "respiratory" },
    { label: "diaphragm helps pull air in", emoji: "🌬️", bin: "respiratory" },
    { label: "trachea carries air to the lungs", emoji: "💨", bin: "respiratory" },
    { label: "alveoli swap oxygen and carbon dioxide", emoji: "🔄", bin: "respiratory" },
  ],
};

const DIGEST_BREATHE_BANK: Item[] = [
  {
    prompt: "Where does digestion begin?",
    right: "in the mouth",
    wrong: ["in the stomach", "in the small intestine", "in the large intestine"],
    hint: "Your teeth start breaking food into smaller pieces, and saliva starts breaking down starch, right in your mouth.",
    emoji: "👄",
  },
  {
    prompt: "What is the main job of the digestive system?",
    right: "breaking food down into nutrients the body can use",
    wrong: ["pumping blood around the body", "moving air into and out of the lungs", "holding the body upright"],
    hint: "Digestion turns the food you eat into nutrients small enough to pass into your blood.",
    emoji: "🍎",
  },
  {
    prompt: "Which gas do your cells need from the air you breathe in?",
    right: "oxygen",
    wrong: ["carbon dioxide", "helium", "hydrogen"],
    hint: "Every cell uses oxygen to release energy from food. Your lungs bring it in.",
    emoji: "🌬️",
  },
  {
    prompt: "Which waste gas do you breathe out?",
    right: "carbon dioxide",
    wrong: ["oxygen", "helium", "hydrogen"],
    hint: "Your cells make carbon dioxide as waste. The blood carries it to the lungs, and you breathe it out.",
    emoji: "💨",
  },
  {
    prompt: "Which organ absorbs most of the nutrients from food into the blood?",
    right: "the small intestine",
    wrong: ["the stomach", "the large intestine", "the esophagus"],
    hint: "The small intestine is long and lined with tiny finger-like bumps that pass nutrients into the blood.",
  },
  {
    prompt: "What is the esophagus?",
    right: "the tube that carries food from the mouth to the stomach",
    wrong: ["the tube that carries air to the lungs", "the muscle under the lungs", "the organ that makes bile"],
    hint: "When you swallow, muscles in the esophagus squeeze food down to your stomach.",
  },
  {
    prompt: "What happens in the lungs?",
    right: "oxygen moves into the blood and carbon dioxide moves out",
    wrong: [
      "carbon dioxide moves into the blood and oxygen moves out",
      "food is broken down by acid",
      "bones are made stronger",
    ],
    hint: "The lungs are where your blood trades gases: it picks up oxygen and drops off carbon dioxide.",
    emoji: "🫁",
  },
  {
    prompt: "Why does your breathing speed up when you run?",
    right: "your muscles need more oxygen",
    wrong: ["your lungs are getting smaller", "your stomach needs more air", "your body needs to breathe out more oxygen"],
    hint: "Working muscles use oxygen quickly, so you breathe faster and deeper to bring more in.",
    emoji: "🏃",
  },
  {
    prompt: "What does the stomach do?",
    right: "mixes food with acid and juices to break it down",
    wrong: ["absorbs most of the water from food", "carries air to the lungs", "pumps blood to the body"],
    hint: "The stomach is a stretchy, muscular bag that churns food with strong acid and digestive juices.",
  },
  {
    prompt: "Tiny hairs and sticky mucus in your nose help by…",
    right: "trapping dust and germs before they reach the lungs",
    wrong: ["breaking down food", "making the air colder", "pumping oxygen into the heart"],
    hint: "Your nose cleans, warms and moistens air before it travels to your lungs.",
    emoji: "👃",
  },
  {
    prompt: "What is another name for the trachea?",
    right: "the windpipe",
    wrong: ["the food pipe", "the voice box", "the air sac"],
    hint: "The trachea is the tube that carries air from your throat down toward your lungs.",
  },
  {
    hard: true,
    prompt: "What is the diaphragm, and what does it do?",
    right: "a dome-shaped muscle under the lungs that helps you breathe",
    wrong: [
      "a flap that covers the windpipe when you swallow",
      "a tube that carries food to the stomach",
      "an organ that makes digestive juices",
    ],
    hint: "When the diaphragm tightens and moves down, the chest gets bigger and air rushes into the lungs.",
  },
  {
    hard: true,
    prompt: "When you swallow, what stops food from going down your windpipe?",
    right: "the epiglottis, a flap that covers the windpipe",
    wrong: ["the diaphragm", "the stomach", "the alveoli"],
    hint: "The epiglottis is a small flap at the top of the windpipe. It closes when you swallow, so food goes down the esophagus.",
  },
  {
    hard: true,
    prompt: "What is the main job of the large intestine?",
    right: "absorbing water from leftover food",
    wrong: ["absorbing most of the nutrients", "making saliva", "mixing food with acid"],
    hint: "By the time food reaches the large intestine, most nutrients are gone. The large intestine takes back water.",
  },
  {
    hard: true,
    prompt: "Which part of digestion is a chemical change, not just a physical one?",
    right: "saliva breaking starch down into sugars",
    wrong: ["teeth grinding food into small pieces", "the stomach churning food", "esophagus muscles pushing food down"],
    hint: "Chewing and churning only make pieces smaller. Saliva actually changes starch into a new substance: sugar.",
  },
  {
    hard: true,
    prompt: "The liver makes bile. What does bile help the body digest?",
    right: "fats",
    wrong: ["water", "salt", "oxygen"],
    hint: "Bile breaks fat into tiny droplets, so digestive juices in the small intestine can work on them.",
  },
  {
    hard: true,
    prompt: "Your lungs hold millions of tiny air sacs called alveoli. Why is it helpful to have so many?",
    right: "they make a huge surface for oxygen to pass into the blood",
    wrong: ["they make the lungs heavier", "they store food for later", "they pump blood to the heart"],
    hint: "More tiny sacs means more surface touching blood vessels, so more oxygen can pass into the blood at once.",
  },
  {
    hard: true,
    prompt: "Smoking damages the alveoli. What problem would that cause?",
    right: "less oxygen gets into the blood",
    wrong: ["food can't reach the stomach", "bones grow longer", "the heart no longer needs oxygen"],
    hint: "Oxygen passes into the blood through the alveoli. Damaged air sacs mean less oxygen for the body.",
  },
];

function breathingData(d: Level): Question {
  const name = pick(NAMES);
  const rest = randInt(16, 22);
  const walk = rest + randInt(5, 9);
  const run = walk + randInt(10, 18);
  const visual: Visual = {
    type: "table",
    title: `${name}'s breathing rate`,
    headers: ["Activity", "Breaths per minute"],
    rows: [
      ["Sitting still", rest],
      ["After walking", walk],
      ["After running", run],
    ],
  };
  if (d === 1) {
    return textChoice(
      `${name} counted breaths after each activity. When was ${name} breathing fastest?`,
      "after running",
      ["while sitting still", "after walking"],
      "Find the biggest number in the table. Hard exercise makes muscles need more oxygen, so you breathe faster.",
      visual,
    );
  }
  if (d === 2) {
    return input(
      `How many more breaths per minute did ${name} take after running than while sitting still?`,
      run - rest,
      `Subtract the smaller number from the bigger one: ${run} − ${rest} = ${run - rest}.`,
      visual,
      "breaths",
    );
  }
  const in15 = randInt(9, 13);
  return input(
    `After running, ${name} counted ${in15} breaths in 15 seconds. At that rate, how many breaths would that be in one minute?`,
    in15 * 4,
    `One minute is four 15-second parts, so multiply by 4: ${in15} × 4 = ${in15 * 4}.`,
    { type: "emoji", emoji: "⏱️", caption: `${in15} breaths in 15 seconds` },
    "breaths",
  );
}

function digestBreathe({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    pick([DIGESTION_ORDER, AIR_ORDER]),
    ...shuffle([
      sortQuestion(DIGEST_BREATHE_SORT, perBin(difficulty)),
      breathingData(difficulty),
      ...levelled(DIGEST_BREATHE_BANK, 5, difficulty),
    ]),
  ];
}

// ---------- Heart, Bones & Muscles ----------

const BLOOD_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Follow one drop of blood. Start when the heart pumps it to the lungs.",
  hint: "Blood goes from the heart to the lungs for oxygen, back to the heart, out to the body, and then back to the heart again.",
  items: [
    { id: "to-lungs", label: "The heart pumps blood to the lungs", emoji: "🫀" },
    { id: "oxygen", label: "Blood picks up oxygen in the lungs", emoji: "🫁" },
    { id: "back", label: "Oxygen-rich blood returns to the heart", emoji: "↩️" },
    { id: "body", label: "The heart pumps it out to the body", emoji: "💪" },
    { id: "cells", label: "Cells take the oxygen and blood heads back", emoji: "🔄" },
  ],
};

const ARM_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the steps of bending your arm in order.",
  hint: "Your brain sends the message first. Then the biceps contracts, its tendon pulls the bone, and the arm bends at the elbow joint.",
  items: [
    { id: "brain", label: "The brain sends a signal to the biceps", emoji: "🧠" },
    { id: "contract", label: "The biceps contracts (gets shorter)", emoji: "💪" },
    { id: "tendon", label: "A tendon pulls on a forearm bone", emoji: "🦴" },
    { id: "bend", label: "The arm bends at the elbow joint", emoji: "↪️" },
  ],
};

const HEART_BONE_SORT: SortSet = {
  prompt: "Circulatory system or musculoskeletal system? Tap an item, then tap its basket.",
  hint: "The circulatory system moves blood. The musculoskeletal system (bones and muscles) supports and moves your body.",
  bins: [
    { id: "circulatory", label: "circulatory", emoji: "🫀" },
    { id: "musculo", label: "musculoskeletal", emoji: "🦴" },
  ],
  items: [
    { label: "heart", emoji: "🫀", bin: "circulatory" },
    { label: "arteries", emoji: "🩸", bin: "circulatory" },
    { label: "veins", emoji: "🩸", bin: "circulatory" },
    { label: "capillaries", emoji: "🩸", bin: "circulatory" },
    { label: "red blood cells", emoji: "🔴", bin: "circulatory" },
    { label: "skull", emoji: "🦴", bin: "musculo" },
    { label: "biceps", emoji: "💪", bin: "musculo" },
    { label: "femur (thigh bone)", emoji: "🦵", bin: "musculo" },
    { label: "rib cage", emoji: "🦴", bin: "musculo" },
    { label: "tendons", emoji: "🔗", bin: "musculo" },
  ],
};

const HEART_BONE_BANK: Item[] = [
  {
    prompt: "What is the main job of the heart?",
    right: "pumping blood all around the body",
    wrong: ["breaking down food", "filtering the air", "holding up the skeleton"],
    hint: "The heart is a strong muscle that pumps blood through your blood vessels all day and night.",
    emoji: "🫀",
  },
  {
    prompt: "Which blood vessels carry blood away from the heart?",
    right: "arteries",
    wrong: ["veins", "capillaries", "alveoli"],
    hint: "A memory trick: Arteries carry blood Away from the heart.",
  },
  {
    prompt: "What does your skeleton do for your body?",
    right: "supports it, protects organs and helps it move",
    wrong: ["pumps blood to the lungs", "digests food", "takes in oxygen"],
    hint: "Bones give your body its shape, guard soft organs, and work with muscles so you can move.",
    emoji: "🦴",
  },
  {
    prompt: "Which organs does the rib cage protect?",
    right: "the heart and lungs",
    wrong: ["the brain", "the small intestine", "the leg muscles"],
    hint: "Your ribs curve around your chest like a cage, guarding the heart and lungs inside.",
  },
  {
    prompt: "Which bones protect your brain?",
    right: "the skull",
    wrong: ["the ribs", "the pelvis", "the femur"],
    hint: "The skull is a hard case of bone around your brain.",
    emoji: "🧠",
  },
  {
    prompt: "How do muscles move bones?",
    right: "by contracting and pulling on them",
    wrong: ["by pushing the bones away", "by growing longer", "by filling up with blood"],
    hint: "Muscles can only pull. When a muscle contracts (gets shorter), it pulls the bone it is attached to.",
    emoji: "💪",
  },
  {
    prompt: "What is a joint?",
    right: "a place where two bones meet",
    wrong: ["a muscle in the heart", "a type of blood vessel", "the soft centre of a bone"],
    hint: "Knees, elbows, shoulders and knuckles are joints: places where bones meet and can move.",
  },
  {
    prompt: "What do red blood cells carry around the body?",
    right: "oxygen",
    wrong: ["bile", "saliva", "stomach acid"],
    hint: "Red blood cells pick up oxygen in the lungs and deliver it to every cell in your body.",
    emoji: "🔴",
  },
  {
    prompt: "What happens to your heart rate when you exercise hard?",
    right: "it goes up",
    wrong: ["it goes down", "it stays exactly the same"],
    hint: "Working muscles need more oxygen, so your heart beats faster to deliver more blood.",
    emoji: "🏃",
  },
  {
    prompt: "Where is a good place to feel your pulse?",
    right: "on the inside of your wrist",
    wrong: ["on the tip of your nose", "on your kneecap", "on your fingernail"],
    hint: "You can feel your pulse where an artery is close to the skin, like the inside of your wrist or the side of your neck.",
  },
  {
    hard: true,
    prompt: "What do veins do?",
    right: "carry blood back to the heart",
    wrong: ["carry blood away from the heart", "swap gases in the lungs", "connect muscles to bones"],
    hint: "Arteries carry blood away from the heart. Veins bring it back.",
  },
  {
    hard: true,
    prompt: "What are capillaries?",
    right: "tiny blood vessels where oxygen and nutrients pass into cells",
    wrong: ["the biggest arteries in the body", "the four chambers of the heart", "the air sacs in the lungs"],
    hint: "Capillaries are so thin that oxygen and nutrients can pass right through their walls into nearby cells.",
  },
  {
    hard: true,
    prompt: "What connects a muscle to a bone?",
    right: "a tendon",
    wrong: ["a ligament", "a capillary", "a joint"],
    hint: "Tendons are tough cords that attach muscles to bones. Ligaments join bone to bone.",
  },
  {
    hard: true,
    prompt: "What holds one bone to another bone at a joint?",
    right: "a ligament",
    wrong: ["a tendon", "an artery", "a vein"],
    hint: "Ligaments are strong bands that hold bones together at joints. Tendons attach muscles to bones.",
  },
  {
    hard: true,
    prompt: "Muscles work in pairs. When your biceps contracts to bend your arm, what does your triceps do?",
    right: "it relaxes",
    wrong: ["it contracts at the same time", "it pushes the bone up", "it pumps blood into the arm"],
    hint: "Muscles can only pull. One muscle in a pair pulls while its partner relaxes. To straighten your arm, they switch jobs.",
  },
  {
    hard: true,
    prompt: "Your heart is made of cardiac muscle. What makes it special?",
    right: "it works all the time without you thinking about it",
    wrong: ["it only works when you exercise", "you control it the way you move your arm", "it pulls on bones to move them"],
    hint: "Cardiac muscle keeps beating your whole life, even while you sleep. You don't have to think about it.",
  },
  {
    hard: true,
    prompt: "Which type of joint lets your shoulder swing your arm in a full circle?",
    right: "ball-and-socket joint",
    wrong: ["hinge joint", "pivot joint", "fixed joint"],
    hint: "In a ball-and-socket joint, a rounded end of bone fits into a cup, so it can move in many directions.",
  },
  {
    hard: true,
    prompt: "Bone marrow, inside some bones, has an important job. What is it?",
    right: "making new blood cells",
    wrong: ["storing air", "digesting fat", "making saliva"],
    hint: "Soft marrow inside bones like the hip and ribs makes red blood cells, white blood cells and platelets.",
  },
  {
    hard: true,
    prompt: "How do the circulatory and digestive systems work together?",
    right: "blood carries nutrients from digested food to the body's cells",
    wrong: [
      "the stomach pumps blood to the body",
      "the heart breaks food into nutrients",
      "the intestines make oxygen for the heart",
    ],
    hint: "Nutrients pass from the small intestine into the blood, and the heart pumps that blood to every cell.",
  },
];

function pulseData(d: Level): Question {
  const name = pick(NAMES);
  const rest = randInt(70, 88);
  const walk = rest + randInt(10, 20);
  const jump = walk + randInt(25, 40);
  const visual: Visual = {
    type: "bars",
    title: `${name}'s heart rate (beats per minute)`,
    bars: [
      { label: "Resting", value: rest, emoji: "🪑" },
      { label: "Walking", value: walk, emoji: "🚶" },
      { label: "Jumping jacks", value: jump, emoji: "🤸" },
    ],
  };
  if (d === 1) {
    return textChoice(
      `After which activity was ${name}'s heart beating fastest?`,
      "jumping jacks",
      ["resting", "walking"],
      "Look for the tallest bar. The harder your muscles work, the faster your heart beats.",
      visual,
    );
  }
  if (d === 2) {
    return input(
      `How many more beats per minute was ${name}'s heart rate after jumping jacks than at rest?`,
      jump - rest,
      `Subtract the resting rate from the jumping-jacks rate: ${jump} − ${rest} = ${jump - rest}.`,
      visual,
      "beats",
    );
  }
  const in15 = randInt(18, 24);
  return input(
    `${name} counted ${in15} pulse beats in 15 seconds while resting. How many beats per minute is that?`,
    in15 * 4,
    `One minute is four 15-second parts, so multiply by 4: ${in15} × 4 = ${in15 * 4}.`,
    { type: "emoji", emoji: "⏱️", caption: `${in15} beats in 15 seconds` },
    "beats",
  );
}

function heartBones({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    pick([BLOOD_ORDER, ARM_ORDER]),
    ...shuffle([
      sortQuestion(HEART_BONE_SORT, perBin(difficulty)),
      pulseData(difficulty),
      ...levelled(HEART_BONE_BANK, 5, difficulty),
    ]),
  ];
}

// ---------- Solutions & Mixtures ----------

const SEPARATE_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Kenji has a dry mix of iron filings, sand and salt. Put his separation steps in order.",
  hint: "Use the magnet while the mix is still dry. Then dissolve the salt, filter out the sand, and evaporate the water to get the salt back.",
  items: [
    { id: "magnet", label: "Run a magnet through the dry mix to pull out the iron", emoji: "🧲" },
    { id: "dissolve", label: "Add water and stir until the salt dissolves", emoji: "🥄" },
    { id: "filter", label: "Pour it through a filter to catch the sand", emoji: "☕" },
    { id: "evaporate", label: "Let the water evaporate to leave the salt", emoji: "☀️" },
  ],
};

const DISTIL_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "How can you get pure water back from salt water? Put the steps in order.",
  hint: "Heat makes the water evaporate and leave the salt behind. Then the water vapour cools, condenses and drips into a clean container.",
  items: [
    { id: "heat", label: "Heat the salt water", emoji: "🔥" },
    { id: "evaporate", label: "Water evaporates and the salt stays behind", emoji: "♨️" },
    { id: "condense", label: "The vapour touches a cold surface and condenses", emoji: "❄️" },
    { id: "collect", label: "Drops of pure water drip into a clean cup", emoji: "💧" },
  ],
};

const SOLUTION_SORT: SortSet = {
  prompt: "Solution or mechanical mixture? Tap an item, then tap its basket.",
  hint: "A solution looks the same all the way through. In a mechanical mixture, you can see the different parts.",
  bins: [
    { id: "solution", label: "solution", emoji: "🧪" },
    { id: "mechanical", label: "mechanical mixture", emoji: "🥗" },
  ],
  items: [
    { label: "salt dissolved in water", emoji: "🧂", bin: "solution" },
    { label: "sugar dissolved in tea", emoji: "🍵", bin: "solution" },
    { label: "air", emoji: "🌬️", bin: "solution" },
    { label: "vinegar", emoji: "🍶", bin: "solution" },
    { label: "clear apple juice", emoji: "🧃", bin: "solution" },
    { label: "trail mix", emoji: "🥜", bin: "mechanical" },
    { label: "garden salad", emoji: "🥗", bin: "mechanical" },
    { label: "sand and water", emoji: "🏖️", bin: "mechanical" },
    { label: "cereal and milk", emoji: "🥣", bin: "mechanical" },
    { label: "gravel", emoji: "🪨", bin: "mechanical" },
  ],
};

const SOLUBLE_SORT: SortSet = {
  prompt: "Soluble or insoluble in water? Tap an item, then tap its basket.",
  hint: "A soluble substance dissolves and seems to disappear in water. An insoluble one stays visible, sinks or floats.",
  bins: [
    { id: "soluble", label: "soluble", emoji: "💧" },
    { id: "insoluble", label: "insoluble", emoji: "🚫" },
  ],
  items: [
    { label: "table salt", emoji: "🧂", bin: "soluble" },
    { label: "sugar", emoji: "🍬", bin: "soluble" },
    { label: "drink crystals", emoji: "🧃", bin: "soluble" },
    { label: "baking soda", emoji: "🧁", bin: "soluble" },
    { label: "honey", emoji: "🍯", bin: "soluble" },
    { label: "sand", emoji: "🏖️", bin: "insoluble" },
    { label: "pebbles", emoji: "🪨", bin: "insoluble" },
    { label: "cooking oil", emoji: "🫒", bin: "insoluble" },
    { label: "iron filings", emoji: "🧲", bin: "insoluble" },
    { label: "uncooked rice", emoji: "🍚", bin: "insoluble" },
  ],
};

const SOLUTION_BANK: Item[] = [
  {
    prompt: "What is a solution?",
    right: "a mixture that looks the same all the way through",
    wrong: ["a mixture where you can see the different parts", "a single pure substance", "a solid that won't dissolve"],
    hint: "In a solution, one substance dissolves evenly into another, so every part looks the same. Scientists call this homogeneous.",
    emoji: "🧪",
  },
  {
    prompt: "When salt dissolves in water, which part is the solute?",
    right: "the salt",
    wrong: ["the water", "the salt water"],
    hint: "The solute is what dissolves (salt). The solvent does the dissolving (water). Together they make a solution (salt water).",
    emoji: "🧂",
  },
  {
    prompt: "Which one is a mechanical mixture?",
    right: "trail mix",
    wrong: ["salt water", "air", "vinegar"],
    hint: "In a mechanical mixture, you can see and pick out the different parts, like nuts and raisins.",
  },
  {
    prompt: "Which substance will dissolve in water?",
    right: "sugar",
    wrong: ["sand", "cooking oil", "pebbles"],
    hint: "Sugar is soluble: it dissolves and spreads evenly through the water.",
  },
  {
    prompt: "Which tool would best separate sand from water?",
    right: "a filter, like a coffee filter",
    wrong: ["a magnet", "a thermometer", "a ruler"],
    hint: "A filter lets water through but catches the bigger, undissolved sand grains.",
  },
  {
    prompt: "How could you get the salt back out of salt water?",
    right: "let the water evaporate",
    wrong: ["pour it through a filter", "run a magnet through it", "stir it faster"],
    hint: "When the water evaporates into the air, the dissolved salt is left behind.",
    emoji: "☀️",
  },
  {
    prompt: "Which tool would separate iron filings from sand?",
    right: "a magnet",
    wrong: ["a filter", "a thermometer", "a measuring cup"],
    hint: "Iron is attracted to magnets. Sand is not.",
    emoji: "🧲",
  },
  {
    prompt: "Which would make sugar dissolve faster in water?",
    right: "stirring",
    wrong: ["using colder water", "using bigger sugar cubes", "keeping the water perfectly still"],
    hint: "Stirring, warmer water and smaller pieces all help a solid dissolve faster.",
    emoji: "🥄",
  },
  {
    prompt: "A sieve separates the parts of a mixture by their…",
    right: "size",
    wrong: ["colour", "magnetism", "temperature"],
    hint: "Small pieces fall through the holes in a sieve; bigger pieces stay on top.",
  },
  {
    prompt: "Oil and water are shaken in a jar and left to sit. What happens?",
    right: "they separate into layers, with oil on top",
    wrong: ["the oil dissolves completely", "the water floats on top of the oil", "they turn into a solid"],
    hint: "Oil is insoluble in water and less dense, so it rises and floats as a layer on top.",
  },
  {
    prompt: "Water is called the 'universal solvent.' Why?",
    right: "it can dissolve many different substances",
    wrong: ["it can dissolve every substance", "it never mixes with anything", "it is only found on Earth"],
    hint: "Water dissolves more substances than almost any other liquid, but not everything. Oil and sand don't dissolve in it.",
  },
  {
    hard: true,
    prompt: "What is a saturated solution?",
    right: "a solution that can't dissolve any more solute",
    wrong: ["a solution with no solute at all", "a solution that has frozen", "a mixture with visible pieces"],
    hint: "Keep adding salt to water and eventually it stops dissolving and piles up on the bottom. The solution is saturated.",
  },
  {
    hard: true,
    prompt: "What does solubility mean?",
    right: "how much of a substance can dissolve in a solvent",
    wrong: ["how fast a substance melts", "how heavy a substance is", "how well a substance floats"],
    hint: "Solubility is the amount of solute that can dissolve in a certain amount of solvent at a certain temperature.",
  },
  {
    hard: true,
    prompt: "Air is a solution of gases. Which gas is the solvent in air?",
    right: "nitrogen",
    wrong: ["oxygen", "carbon dioxide", "water vapour"],
    hint: "The solvent is the substance there is the most of. Air is about 78% nitrogen and 21% oxygen.",
    emoji: "🌬️",
  },
  {
    hard: true,
    prompt: "Why can't a filter separate salt from salt water?",
    right: "the dissolved salt particles are tiny enough to pass through",
    wrong: ["salt is attracted to magnets", "filters only work with hot water", "the salt has turned into water"],
    hint: "Dissolved salt is spread out as tiny particles mixed among the water, so it flows right through a filter.",
  },
  {
    hard: true,
    prompt: "A fizzy drink goes flat faster when it is warm. What does this tell you?",
    right: "gases dissolve better in cold liquids",
    wrong: ["gases dissolve better in warm liquids", "sugar escapes as a gas", "warm drinks hold more fizz"],
    hint: "Unlike most solids, gases are less soluble in warm liquids, so the bubbles escape faster.",
    emoji: "🥤",
  },
  {
    hard: true,
    prompt: "A dot of black marker on wet paper spreads out into several colours. What is this separation method called?",
    right: "chromatography",
    wrong: ["filtration", "evaporation", "sieving"],
    hint: "In chromatography, water carries each ink colour a different distance up the paper, separating the mixture.",
    emoji: "🖊️",
  },
  {
    hard: true,
    prompt: "Brass is made by melting copper and zinc together. It looks the same all the way through. What is it?",
    right: "a solid solution (an alloy)",
    wrong: ["a mechanical mixture", "a pure element", "a liquid solution"],
    hint: "Solutions aren't only liquids. Metals blended evenly together, called alloys, are solid solutions.",
  },
  {
    hard: true,
    prompt: "Is dissolving sugar in water a change that can be reversed?",
    right: "yes, if the water evaporates the sugar is left",
    wrong: ["no, the sugar is destroyed", "no, it becomes a brand-new substance", "only if you freeze it"],
    hint: "Dissolving is a physical change. The sugar is still there, and evaporating the water brings it back.",
  },
];

function solubilityData(d: Level): Question {
  if (d >= 2 && chance(0.4)) {
    const visual: Visual = {
      type: "table",
      title: "Sugar that dissolves in 100 mL of water (about)",
      headers: ["Water temperature", "Sugar dissolved"],
      rows: [
        ["20 °C", "200 g"],
        ["40 °C", "240 g"],
        ["60 °C", "290 g"],
        ["80 °C", "360 g"],
      ],
    };
    return textChoice(
      "What pattern does this table show?",
      "the warmer the water, the more sugar dissolves",
      [
        "the warmer the water, the less sugar dissolves",
        "temperature doesn't change how much dissolves",
        "sugar dissolves only in cold water",
      ],
      "Read down both columns. As the temperature goes up, the grams of sugar go up too, so solubility increases.",
      visual,
    );
  }
  const powders = ["Powder A", "Powder B", "Powder C", "Powder D"];
  const amounts = sample([4, 9, 12, 18, 25, 33, 40, 47], 4);
  const visual: Visual = {
    type: "table",
    title: "Grams that dissolved in 100 mL of water at room temperature",
    headers: ["Substance", "Amount dissolved"],
    rows: powders.map((p, i) => [p, `${amounts[i]} g`]),
  };
  const most = amounts.indexOf(Math.max(...amounts));
  const least = amounts.indexOf(Math.min(...amounts));
  if (d === 1) {
    return textChoice(
      "A class tested four powders. Which powder is the most soluble in water?",
      powders[most],
      powders.filter((_, i) => i !== most),
      "The most soluble substance is the one that dissolved the most. Find the biggest number.",
      visual,
    );
  }
  if (d === 2) {
    return textChoice(
      "A class tested four powders. Which powder is the least soluble in water?",
      powders[least],
      powders.filter((_, i) => i !== least),
      "The least soluble substance dissolved the smallest amount. Find the smallest number.",
      visual,
    );
  }
  return input(
    `How many more grams of ${powders[most]} dissolved than ${powders[least]}?`,
    amounts[most] - amounts[least],
    `Subtract the smallest amount from the largest: ${amounts[most]} − ${amounts[least]} = ${amounts[most] - amounts[least]}.`,
    visual,
    "g",
  );
}

function solutions({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    pick([SEPARATE_ORDER, DISTIL_ORDER]),
    ...shuffle([
      sortQuestion(pick([SOLUTION_SORT, SOLUBLE_SORT]), perBin(difficulty)),
      solubilityData(difficulty),
      ...levelled(SOLUTION_BANK, 5, difficulty),
    ]),
  ];
}

// ---------- Simple Machines ----------

function rampOrder(d: Level): OrderQuestion {
  const n = d === 1 ? 3 : d === 2 ? 4 : 5;
  const lengths = sample([1, 2, 3, 4, 5, 6], n).sort((a, b) => b - a);
  return {
    kind: "order",
    prompt: "These ramps all lift a box to the same height. Order them from LEAST force needed to MOST.",
    hint: "For the same height, a longer ramp is gentler, so it needs less force. The trade-off: you push the box a longer distance.",
    items: lengths.map((len) => ({ id: `r${len}`, label: `${len} m ramp`, emoji: "📐" })),
  };
}

const MACHINE_SORT: SortSet = {
  prompt: "Lever, wedge, or wheel and axle? Tap an item, then tap its basket.",
  hint: "A lever turns on a fulcrum. A wedge is thin at one edge to split, cut or hold. A wheel and axle is a wheel joined to a rod that turns with it.",
  bins: [
    { id: "lever", label: "lever", emoji: "⚖️" },
    { id: "wedge", label: "wedge", emoji: "🔺" },
    { id: "wheel", label: "wheel and axle", emoji: "⚙️" },
  ],
  items: [
    { label: "seesaw", emoji: "⚖️", bin: "lever" },
    { label: "crowbar", emoji: "🔧", bin: "lever" },
    { label: "bottle opener", emoji: "🍾", bin: "lever" },
    { label: "axe blade", emoji: "🪓", bin: "wedge" },
    { label: "knife", emoji: "🔪", bin: "wedge" },
    { label: "doorstop", emoji: "🚪", bin: "wedge" },
    { label: "doorknob", emoji: "🎛️", bin: "wheel" },
    { label: "steering wheel", emoji: "🚗", bin: "wheel" },
    { label: "Ferris wheel", emoji: "🎡", bin: "wheel" },
  ],
};

const PULLEY_SCREW_SORT: SortSet = {
  prompt: "Pulley or screw? Tap an item, then tap its basket.",
  hint: "A pulley is a grooved wheel with a rope. A screw is a ramp (inclined plane) wrapped around a post.",
  bins: [
    { id: "pulley", label: "pulley", emoji: "🏗️" },
    { id: "screw", label: "screw", emoji: "🔩" },
  ],
  items: [
    { label: "flagpole rope", emoji: "🚩", bin: "pulley" },
    { label: "window blinds cord", emoji: "🪟", bin: "pulley" },
    { label: "construction crane", emoji: "🏗️", bin: "pulley" },
    { label: "clothesline that runs on two wheels", emoji: "🧺", bin: "pulley" },
    { label: "elevator cable", emoji: "🛗", bin: "pulley" },
    { label: "jar lid", emoji: "🥫", bin: "screw" },
    { label: "light bulb base", emoji: "💡", bin: "screw" },
    { label: "bolt", emoji: "🔩", bin: "screw" },
    { label: "corkscrew", emoji: "🍾", bin: "screw" },
    { label: "twist-off bottle cap", emoji: "🧴", bin: "screw" },
  ],
};

const MACHINE_BANK: Item[] = [
  {
    prompt: "A ramp that helps a wheelchair into a building is which simple machine?",
    right: "inclined plane",
    wrong: ["pulley", "lever", "screw"],
    hint: "An inclined plane is a flat, sloping surface. It lets you raise something with less force.",
    emoji: "♿",
  },
  {
    prompt: "A seesaw is which simple machine?",
    right: "lever",
    wrong: ["pulley", "wedge", "wheel and axle"],
    hint: "A lever is a stiff bar that turns on a point called the fulcrum. A seesaw turns on its middle.",
  },
  {
    prompt: "An axe splitting wood is which simple machine?",
    right: "wedge",
    wrong: ["lever", "screw", "pulley"],
    hint: "A wedge is thick at one end and thin at the other. It pushes things apart when it is forced in.",
    emoji: "🪓",
  },
  {
    prompt: "The rope and wheel used to raise a flag up a flagpole is a…",
    right: "pulley",
    wrong: ["wedge", "screw", "inclined plane"],
    hint: "A pulley is a wheel with a groove for a rope. Pulling down on the rope lifts the flag up.",
    emoji: "🚩",
  },
  {
    prompt: "A doorknob is which simple machine?",
    right: "wheel and axle",
    wrong: ["wedge", "pulley", "inclined plane"],
    hint: "The knob (the wheel) turns a rod (the axle) that moves the latch. A small turn of the big knob does the job easily.",
    emoji: "🚪",
  },
  {
    prompt: "A jar lid twists on and off using which simple machine?",
    right: "screw",
    wrong: ["pulley", "lever", "wedge"],
    hint: "Look at the spiral ridges (threads) inside the lid and on the jar. That spiral is a screw.",
  },
  {
    prompt: "How do simple machines make work easier?",
    right: "they change the size or direction of a force",
    wrong: ["they create energy out of nothing", "they make objects weigh less", "they remove all friction"],
    hint: "Machines can't make energy. They let you use a smaller force over a longer distance, or push in a more useful direction.",
    emoji: "⚙️",
  },
  {
    prompt: "What is the fulcrum of a lever?",
    right: "the point the lever turns on",
    wrong: ["the load being lifted", "the push you give", "the rope you pull"],
    hint: "Every lever has a fulcrum (the pivot), a load (what moves) and an effort (your push or pull).",
  },
  {
    prompt: "In science, work is done when…",
    right: "a force moves an object over a distance",
    wrong: ["you think hard about a problem", "you push on a wall that doesn't move", "an object stays perfectly still"],
    hint: "Work needs both a force and movement. Pushing a wall that doesn't move does no work, even if you get tired!",
  },
  {
    prompt: "A doorstop holds a door open. Which simple machine is it?",
    right: "wedge",
    wrong: ["screw", "pulley", "wheel and axle"],
    hint: "A doorstop is a wedge: its thin edge slides under the door and holds it in place.",
    emoji: "🚪",
  },
  {
    prompt: "Which simple machines are in a pair of scissors?",
    right: "levers and wedges",
    wrong: ["pulleys and screws", "wheels and axles", "inclined planes only"],
    hint: "Each half of the scissors is a lever turning on the pivot in the middle, and the sharp blades are wedges.",
    emoji: "✂️",
  },
  {
    hard: true,
    prompt: "A screw is really another simple machine wrapped around a post. Which one?",
    right: "an inclined plane",
    wrong: ["a lever", "a pulley", "a wheel and axle"],
    hint: "Cut a paper triangle (a ramp) and roll it around a pencil. The edge makes a spiral, just like a screw's threads.",
    emoji: "🔩",
  },
  {
    hard: true,
    prompt: "What is a wedge made of?",
    right: "two inclined planes back to back",
    wrong: ["two levers joined at a fulcrum", "a wheel attached to a rod", "a rope over a grooved wheel"],
    hint: "Look at an axe head from the side: two sloping surfaces meet at a sharp edge. Each slope is an inclined plane.",
  },
  {
    hard: true,
    prompt: "A single fixed pulley at the top of a flagpole doesn't reduce the force you need. How does it help?",
    right: "it changes the direction of the force, so you pull down to lift up",
    wrong: ["it makes the flag lighter", "it doubles your force", "it makes the rope shorter"],
    hint: "Pulling down is easier than climbing up and lifting. A fixed pulley changes the direction of your force.",
    emoji: "🚩",
  },
  {
    hard: true,
    prompt: "Ramp A (2 m long) and Ramp B (6 m long) reach the same loading dock. Which is true?",
    right: "Ramp B needs less force, but you push the box farther",
    wrong: [
      "Ramp A needs less force and less distance",
      "both ramps need exactly the same force",
      "Ramp B needs more force because it is longer",
    ],
    hint: "Machines trade force for distance. The longer, gentler ramp needs less force over a longer path.",
  },
  {
    hard: true,
    prompt: "You use a lever to lift a heavy rock. Where should the fulcrum go so you need the least effort?",
    right: "close to the rock",
    wrong: ["close to your hands", "always exactly in the middle", "it doesn't matter"],
    hint: "The closer the fulcrum is to the load, the longer your side of the lever, and the less force you need.",
    emoji: "🪨",
  },
  {
    hard: true,
    prompt: "A bicycle uses several simple machines working together. What is a machine like this called?",
    right: "a compound machine",
    wrong: ["a simple machine", "a fixed pulley", "an inclined plane"],
    hint: "A compound machine is made of two or more simple machines. A bike has wheels and axles, levers and more.",
    emoji: "🚲",
  },
  {
    hard: true,
    prompt: "Machines transfer energy. When you ride a bike, where does the energy that moves it come from?",
    right: "your leg muscles pushing the pedals",
    wrong: ["the chain, which makes its own energy", "the tires", "the handlebars"],
    hint: "Your muscles push the pedals. The pedals, chain and wheels transfer that energy to move the bike forward.",
    emoji: "🚲",
  },
  {
    hard: true,
    prompt: "A movable pulley lets you lift a heavy box with about half the force. What is the trade-off?",
    right: "you have to pull about twice as much rope",
    wrong: ["the box becomes heavier", "you need twice the force", "the box rises twice as high"],
    hint: "Machines never give something for nothing: less force means you pull over a longer distance.",
  },
  {
    hard: true,
    prompt: "A screwdriver is a wheel and axle. Which part acts as the wheel?",
    right: "the wide handle",
    wrong: ["the thin metal shaft", "the tip", "the screw's threads"],
    hint: "The wheel is the wider part you turn. A small turning force on the wide handle makes a bigger turning force on the thin shaft.",
    emoji: "🪛",
  },
];

function rampData(d: Level): Question {
  const k = pick([12, 24]);
  const visual: Visual = {
    type: "table",
    title: "Force needed to pull a cart up ramps that are all 50 cm high",
    headers: ["Ramp length", "Force needed (N = newtons)"],
    rows: [1, 2, 3, 4].map((len) => [`${len} m`, `${k / len} N`]),
  };
  if (d === 1) {
    return textChoice(
      "Which ramp needed the least force?",
      "4 m ramp",
      ["1 m ramp", "2 m ramp", "3 m ramp"],
      "Find the smallest force in the table. Then look across to see which ramp it belongs to.",
      visual,
    );
  }
  if (d === 2) {
    return textChoice(
      "What pattern does this data show?",
      "longer ramps need less force",
      ["longer ramps need more force", "ramp length doesn't change the force", "shorter ramps are always easier"],
      "As you read down the table, the ramps get longer and the force gets smaller.",
      visual,
    );
  }
  return input(
    "Following the same pattern, how much force would a 6 m ramp need?",
    k / 6,
    `Length × force is always ${k} here (for example, 2 × ${k / 2} = ${k}). So 6 × ? = ${k}, and ? = ${k / 6}.`,
    visual,
    "N",
  );
}

function machines({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const sort =
    difficulty === 1 ? sortQuestion(MACHINE_SORT, 2) : pick([sortQuestion(MACHINE_SORT, 2), sortQuestion(PULLEY_SCREW_SORT, perBin(difficulty))]);
  return [
    rampOrder(difficulty),
    ...shuffle([sort, rampData(difficulty), ...levelled(MACHINE_BANK, 5, difficulty)]),
  ];
}

// ---------- The Rock Cycle ----------

const SEDIMENTARY_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the steps that make sedimentary rock in order.",
  hint: "First rock breaks down (weathering), then the pieces are moved (erosion), dropped in layers (deposition), and finally pressed and cemented together.",
  items: [
    { id: "weather", label: "Weathering breaks rock into small pieces", emoji: "🌧️" },
    { id: "erode", label: "Erosion carries the pieces away", emoji: "🌊" },
    { id: "deposit", label: "The sediment settles in layers", emoji: "🟫" },
    { id: "cement", label: "Layers are pressed and cemented into rock", emoji: "🪨" },
  ],
};

const IGNEOUS_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the steps that make an igneous rock like basalt in order.",
  hint: "Rock melts into magma deep underground, the magma rises, erupts as lava, then cools and hardens.",
  items: [
    { id: "melt", label: "Rock deep underground melts into magma", emoji: "🔥" },
    { id: "rise", label: "Magma rises toward the surface", emoji: "⬆️" },
    { id: "erupt", label: "It erupts from a volcano as lava", emoji: "🌋" },
    { id: "cool", label: "The lava cools and hardens into rock", emoji: "🪨" },
  ],
};

const JOURNEY_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Follow one rock's long journey. Put the steps in order.",
  hint: "Igneous granite is weathered into sand, the sand becomes sedimentary sandstone, and heat and pressure turn sandstone into metamorphic quartzite.",
  items: [
    { id: "granite", label: "Magma cools slowly underground into granite", emoji: "🔥" },
    { id: "weather", label: "The granite is weathered into grains of sand", emoji: "🌧️" },
    { id: "layers", label: "The sand settles in layers and becomes sandstone", emoji: "🏖️" },
    { id: "quartzite", label: "Heat and pressure change it into quartzite", emoji: "💎" },
  ],
};

const ROCK_SORT: SortSet = {
  prompt: "Igneous, sedimentary or metamorphic? Tap a rock, then tap its basket.",
  hint: "Igneous rock forms from cooled magma or lava. Sedimentary rock forms from pressed layers. Metamorphic rock is changed by heat and pressure.",
  bins: [
    { id: "igneous", label: "igneous", emoji: "🌋" },
    { id: "sedimentary", label: "sedimentary", emoji: "🟫" },
    { id: "metamorphic", label: "metamorphic", emoji: "🔥" },
  ],
  items: [
    { label: "granite", emoji: "🪨", bin: "igneous" },
    { label: "basalt", emoji: "⚫", bin: "igneous" },
    { label: "obsidian", emoji: "🪞", bin: "igneous" },
    { label: "pumice", emoji: "⚪", bin: "igneous" },
    { label: "sandstone", emoji: "🟤", bin: "sedimentary" },
    { label: "limestone", emoji: "🐚", bin: "sedimentary" },
    { label: "shale", emoji: "🟫", bin: "sedimentary" },
    { label: "conglomerate", emoji: "🪨", bin: "sedimentary" },
    { label: "marble", emoji: "⬜", bin: "metamorphic" },
    { label: "slate", emoji: "⬛", bin: "metamorphic" },
    { label: "quartzite", emoji: "💎", bin: "metamorphic" },
    { label: "gneiss", emoji: "🪨", bin: "metamorphic" },
  ],
};

const WEATHER_ERODE_SORT: SortSet = {
  prompt: "Weathering or erosion? Tap an item, then tap its basket.",
  hint: "Weathering breaks rock down where it is. Erosion moves the broken pieces somewhere else.",
  bins: [
    { id: "weathering", label: "weathering (breaking)", emoji: "🔨" },
    { id: "erosion", label: "erosion (moving)", emoji: "➡️" },
  ],
  items: [
    { label: "ice freezes in a crack and splits a rock", emoji: "🧊", bin: "weathering" },
    { label: "tree roots grow into cracks and break rock", emoji: "🌳", bin: "weathering" },
    { label: "slightly acidic rain slowly dissolves limestone", emoji: "🌧️", bin: "weathering" },
    { label: "hot days and cold nights make rock flake apart", emoji: "🌡️", bin: "weathering" },
    { label: "a river carries sand downstream", emoji: "🏞️", bin: "erosion" },
    { label: "wind blows sand across a desert", emoji: "🌬️", bin: "erosion" },
    { label: "a glacier drags rocks downhill", emoji: "🏔️", bin: "erosion" },
    { label: "waves carry pebbles along a beach", emoji: "🌊", bin: "erosion" },
  ],
};

const ROCK_PASSAGE: Visual = {
  type: "passage",
  title: "A Pebble's Long Trip",
  paragraphs: [
    "Long ago, magma deep under a mountain cooled very slowly and hardened into granite. Because it cooled so slowly, its crystals had time to grow large enough to see.",
    "Over millions of years, the mountain wore down and the granite reached the surface. Each winter, water froze in its cracks and split off small pieces. A river carried the pieces downstream, tumbling them until they were smooth pebbles and grains of sand.",
    "Where the river met a lake, the sand settled in layers on the bottom. More layers piled on top. Over a very long time, the weight pressed the layers together, and minerals in the water cemented the grains into sandstone.",
  ],
};

const ROCK_PASSAGE_ITEMS: Item[] = [
  {
    prompt: "In the passage, which process moved the pieces of granite downstream?",
    right: "erosion by a river",
    wrong: ["melting", "cementing", "cooling"],
    hint: "Moving rock pieces from one place to another is erosion. Look for what carried the pieces.",
    visual: ROCK_PASSAGE,
  },
  {
    prompt: "What kind of rock did the sand finally become?",
    right: "sedimentary rock (sandstone)",
    wrong: ["igneous rock (granite)", "metamorphic rock (marble)", "magma"],
    hint: "Layers of sand pressed and cemented together make sedimentary rock. Check the last paragraph.",
    visual: ROCK_PASSAGE,
  },
  {
    prompt: "Why did the granite have large crystals?",
    right: "it cooled slowly deep underground",
    wrong: ["it cooled quickly in the air", "it was tumbled by the river", "it was cemented by minerals"],
    hint: "The first paragraph explains it: slow cooling gives crystals time to grow.",
    visual: ROCK_PASSAGE,
  },
  {
    prompt: "What split small pieces off the granite each winter?",
    right: "water freezing and expanding in cracks",
    wrong: ["lava flowing over it", "minerals cementing it", "magma melting it"],
    hint: "Water expands when it freezes, pushing cracks wider. This is a kind of weathering.",
    visual: ROCK_PASSAGE,
  },
];

const ROCK_BANK: Item[] = [
  {
    prompt: "How does igneous rock form?",
    right: "melted rock (magma or lava) cools and hardens",
    wrong: [
      "layers of sediment are pressed together",
      "heat and pressure change other rock",
      "shells pile up on the sea floor",
    ],
    hint: "'Igneous' comes from a Latin word for fire. These rocks start as melted rock.",
    emoji: "🌋",
  },
  {
    prompt: "How does sedimentary rock form?",
    right: "layers of sediment are pressed and cemented together",
    wrong: ["lava cools quickly", "heat and pressure change rock without melting it", "magma cools underground"],
    hint: "Sediment is bits of sand, mud, pebbles and shells. Over time, layers of it harden into rock.",
    emoji: "🟫",
  },
  {
    prompt: "How does metamorphic rock form?",
    right: "heat and pressure change rock that already exists",
    wrong: ["lava cools on the surface", "sand settles in a lake", "wind wears rocks down"],
    hint: "'Metamorphic' means 'changed form.' Deep underground, heat and pressure change rock without fully melting it.",
  },
  {
    prompt: "Which kind of rock is most likely to contain fossils?",
    right: "sedimentary",
    wrong: ["igneous", "metamorphic"],
    hint: "Plants and animals can be buried in layers of mud or sand that slowly become sedimentary rock.",
    emoji: "🐚",
  },
  {
    prompt: "What is the difference between magma and lava?",
    right: "magma is underground; lava has reached the surface",
    wrong: ["magma is cool; lava is hot", "magma is solid; lava is liquid", "they are made of different materials"],
    hint: "Both are melted rock. It's called magma below ground and lava once it erupts out.",
    emoji: "🌋",
  },
  {
    prompt: "What is weathering?",
    right: "breaking rock down into smaller pieces",
    wrong: ["moving rock pieces to a new place", "melting rock into magma", "cooling lava into rock"],
    hint: "Water, ice, wind and plant roots can all break rock apart. That's weathering.",
  },
  {
    prompt: "What is erosion?",
    right: "moving rock pieces by water, wind or ice",
    wrong: ["rock cracking apart where it sits", "lava hardening into rock", "rock changing under heat"],
    hint: "Erosion is the moving part: rivers, wind, waves and glaciers carry broken rock away.",
    emoji: "🌊",
  },
  {
    prompt: "Granite is an igneous rock with large crystals. How did it form?",
    right: "magma cooled slowly underground",
    wrong: ["lava cooled in seconds in the air", "mud was pressed into layers", "limestone was heated and squeezed"],
    hint: "Slow cooling underground gives crystals time to grow big.",
    emoji: "🪨",
  },
  {
    prompt: "What are rocks made of?",
    right: "one or more minerals",
    wrong: ["tiny living cells", "frozen water", "only sand"],
    hint: "Minerals are natural solid substances, like quartz and feldspar. Rocks are made of one or more of them.",
    emoji: "💎",
  },
  {
    prompt: "Does the rock cycle have one starting point?",
    right: "no, any type of rock can change into another type",
    wrong: ["yes, it always starts with sedimentary rock", "yes, it always starts with metamorphic rock"],
    hint: "It's a cycle, like a circle. Igneous, sedimentary and metamorphic rocks can each change into the others.",
    emoji: "🔄",
  },
  {
    hard: true,
    prompt: "Basalt has tiny crystals, but granite has large ones. Why?",
    right: "basalt cooled quickly; granite cooled slowly underground",
    wrong: [
      "basalt cooled slowly; granite cooled quickly",
      "basalt is a sedimentary rock",
      "granite was squeezed by glaciers",
    ],
    hint: "Lava at the surface cools fast, leaving tiny crystals. Magma deep underground cools slowly, growing big crystals.",
  },
  {
    hard: true,
    prompt: "Limestone is heated and squeezed deep underground. What does it become?",
    right: "marble",
    wrong: ["granite", "sandstone", "pumice"],
    hint: "Marble is the metamorphic form of limestone. Both are made mostly of the same mineral, calcite.",
  },
  {
    hard: true,
    prompt: "Shale is changed by heat and pressure. Which metamorphic rock does it become?",
    right: "slate",
    wrong: ["basalt", "marble", "conglomerate"],
    hint: "Soft, muddy shale becomes hard, flat slate, which can split into thin sheets.",
  },
  {
    hard: true,
    prompt: "Pumice is an igneous rock that can float on water. Why?",
    right: "it is full of holes left by gas bubbles",
    wrong: ["it is made of wood", "it formed from ocean sediment", "it is made of ice"],
    hint: "Pumice forms from frothy lava full of gas. The bubbles leave tiny holes that trap air.",
    emoji: "⚪",
  },
  {
    hard: true,
    prompt: "Obsidian looks like black glass. What does that tell you about how it formed?",
    right: "lava cooled so fast that crystals had no time to grow",
    wrong: ["it formed from layers of mud", "it was squeezed for millions of years", "it cooled slowly underground"],
    hint: "The faster melted rock cools, the smaller the crystals. Obsidian cooled so fast it has almost none, so it looks like glass.",
  },
  {
    hard: true,
    prompt: "A metamorphic rock is pushed deep underground and melts. What happens next in the rock cycle?",
    right: "it becomes magma, which can cool into igneous rock",
    wrong: ["it becomes sedimentary rock right away", "it turns into a fossil", "it can never change again"],
    hint: "Any rock that melts becomes magma. When magma cools, it forms igneous rock.",
  },
  {
    hard: true,
    prompt: "Sedimentary rock often has layers. In undisturbed layers, which one is usually the oldest?",
    right: "the bottom layer",
    wrong: ["the top layer", "the middle layer", "they are all the same age"],
    hint: "Layers pile up over time, so the first layer to form is at the bottom.",
  },
  {
    hard: true,
    prompt: "Which two processes turn loose sediment into solid sedimentary rock?",
    right: "compaction and cementation",
    wrong: ["melting and cooling", "weathering and erosion", "evaporation and condensation"],
    hint: "Compaction squeezes the layers tight. Cementation glues the grains together with minerals.",
  },
];

function rocks({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  const order = difficulty === 3 ? pick([JOURNEY_ORDER, SEDIMENTARY_ORDER, IGNEOUS_ORDER]) : pick([SEDIMENTARY_ORDER, IGNEOUS_ORDER]);
  const sort =
    difficulty === 1 ? sortQuestion(WEATHER_ERODE_SORT, 2) : pick([sortQuestion(ROCK_SORT, 2), sortQuestion(WEATHER_ERODE_SORT, perBin(difficulty))]);
  return [order, ...shuffle([sort, toQuestion(pick(ROCK_PASSAGE_ITEMS)), ...levelled(ROCK_BANK, 5, difficulty)])];
}

// ---------- Natural Resources ----------

const FOSSIL_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "How do fossil fuels form? Put the steps in order.",
  hint: "Living things died, were buried, and then heat and pressure acted on them over millions of years.",
  items: [
    { id: "live", label: "Ancient plants and tiny sea creatures live and die", emoji: "🌿" },
    { id: "bury", label: "Their remains are buried under layers of sediment", emoji: "🟫" },
    { id: "press", label: "Heat and pressure act on them for millions of years", emoji: "🔥" },
    { id: "fuel", label: "They slowly become coal, oil or natural gas", emoji: "🛢️" },
  ],
};

const PAPER_ORDER: OrderQuestion = {
  kind: "order",
  prompt: "Put the steps of recycling paper in order.",
  hint: "Paper is collected, sorted, broken down into pulp with water, and then pressed and dried into new paper.",
  items: [
    { id: "bin", label: "Used paper goes into a recycling bin", emoji: "♻️" },
    { id: "sort", label: "It is sorted at a recycling plant", emoji: "🏭" },
    { id: "pulp", label: "It is mixed with water to make pulp", emoji: "💧" },
    { id: "press", label: "The pulp is pressed and dried into new paper", emoji: "📄" },
  ],
};

const RENEWABLE_SORT: SortSet = {
  prompt: "Renewable or non-renewable? Tap a resource, then tap its basket.",
  hint: "Renewable resources can be replaced by nature in a human lifetime. Non-renewable ones took millions of years to form and are limited.",
  bins: [
    { id: "renewable", label: "renewable", emoji: "🔄" },
    { id: "non", label: "non-renewable", emoji: "⛏️" },
  ],
  items: [
    { label: "sunlight", emoji: "☀️", bin: "renewable" },
    { label: "wind", emoji: "🌬️", bin: "renewable" },
    { label: "trees", emoji: "🌲", bin: "renewable" },
    { label: "fish", emoji: "🐟", bin: "renewable" },
    { label: "flowing water", emoji: "💧", bin: "renewable" },
    { label: "oil", emoji: "🛢️", bin: "non" },
    { label: "coal", emoji: "⚫", bin: "non" },
    { label: "natural gas", emoji: "🔥", bin: "non" },
    { label: "copper ore", emoji: "🪨", bin: "non" },
    { label: "gold", emoji: "🪙", bin: "non" },
  ],
};

const USE_SORT: SortSet = {
  prompt: "Responsible use or wasteful? Tap an item, then tap its basket.",
  hint: "Responsible use means taking only what we need and letting resources renew. Waste uses up resources for nothing.",
  bins: [
    { id: "responsible", label: "responsible", emoji: "💚" },
    { id: "wasteful", label: "wasteful", emoji: "🗑️" },
  ],
  items: [
    { label: "replanting trees after logging", emoji: "🌱", bin: "responsible" },
    { label: "recycling aluminium cans", emoji: "🥫", bin: "responsible" },
    { label: "following fishing limits", emoji: "🎣", bin: "responsible" },
    { label: "biking instead of driving short trips", emoji: "🚲", bin: "responsible" },
    { label: "using both sides of paper", emoji: "📄", bin: "responsible" },
    { label: "leaving lights on in empty rooms", emoji: "💡", bin: "wasteful" },
    { label: "letting a car idle for a long time", emoji: "🚗", bin: "wasteful" },
    { label: "throwing cans in the garbage", emoji: "🗑️", bin: "wasteful" },
    { label: "catching more fish than allowed", emoji: "🐟", bin: "wasteful" },
    { label: "letting the tap run while brushing", emoji: "🚰", bin: "wasteful" },
  ],
};

const RESOURCE_BANK: Item[] = [
  {
    prompt: "What is a natural resource?",
    right: "something from nature that people use",
    wrong: ["anything made in a factory", "a type of computer program", "only things found in the ocean"],
    hint: "Water, soil, trees, fish, minerals, oil, wind and sunlight are all natural resources.",
    emoji: "🌍",
  },
  {
    prompt: "Which resource is renewable?",
    right: "wind",
    wrong: ["coal", "oil", "natural gas"],
    hint: "Wind keeps blowing, so it can't be used up. Coal, oil and natural gas took millions of years to form.",
    emoji: "🌬️",
  },
  {
    prompt: "Which resource is non-renewable?",
    right: "oil",
    wrong: ["sunlight", "trees", "wind"],
    hint: "Oil formed over millions of years. Once we use it, it's gone for any time that matters to people.",
    emoji: "🛢️",
  },
  {
    prompt: "Why are fossil fuels called non-renewable?",
    right: "they take millions of years to form",
    wrong: ["they can be replanted every year", "they come straight from the sun", "they never run out"],
    hint: "Coal, oil and natural gas formed from ancient living things over millions of years. We use them much faster than that.",
  },
  {
    prompt: "Which action helps keep forests a renewable resource?",
    right: "planting new trees after logging",
    wrong: ["cutting every tree in an area", "leaving garbage in the forest", "building roads through every forest"],
    hint: "Trees are renewable only if new ones are given the chance to grow back.",
    emoji: "🌲",
  },
  {
    prompt: "Which Earth material is the main ingredient used to make cement for buildings?",
    right: "limestone",
    wrong: ["obsidian", "diamond", "pumice"],
    hint: "Cement is made by heating crushed limestone with clay. Cement is then used to make concrete.",
    emoji: "🏗️",
  },
  {
    prompt: "Copper is mined from rocks. What is it often used for?",
    right: "electrical wires",
    wrong: ["window glass", "cooking oil", "paper"],
    hint: "Copper carries electricity very well, so it's used in wires in homes and electronics.",
    emoji: "🔌",
  },
  {
    prompt: "Which is an example of reducing (not reusing or recycling)?",
    right: "using a refillable water bottle instead of buying bottled water",
    wrong: ["putting a can in the recycling bin", "turning an old jar into a pencil holder"],
    hint: "Reduce means using less in the first place. Reuse means using something again. Recycle means making it into something new.",
    emoji: "♻️",
  },
  {
    prompt: "Hydroelectric power plants use which resource to make electricity?",
    right: "moving water",
    wrong: ["coal", "natural gas", "uranium"],
    hint: "'Hydro' means water. Falling or flowing water spins turbines to make electricity.",
    emoji: "⚡",
  },
  {
    prompt: "A renewable resource can still run out if…",
    right: "people use it faster than nature can replace it",
    wrong: ["it rains too much", "people use it carefully", "people recycle"],
    hint: "Fish and forests renew, but only if we leave enough to grow back.",
  },
  {
    hard: true,
    prompt: "In 1992, Canada closed the northern cod fishery off Newfoundland and Labrador because cod numbers had crashed. What lesson does this teach?",
    right: "even renewable resources can be used up if too many are taken",
    wrong: ["fish are a non-renewable resource", "oceans never change", "fishing has no effect on fish numbers"],
    hint: "Too many cod were caught for too long, and the population couldn't recover. Renewable doesn't mean unlimited.",
    emoji: "🐟",
  },
  {
    hard: true,
    prompt: "Fishing limits set how many fish can be caught. Why do they matter?",
    right: "they leave enough fish to reproduce and keep the population healthy",
    wrong: ["they make fish grow bigger right away", "they stop all fishing forever", "they turn fish into a non-renewable resource"],
    hint: "If enough adult fish are left, they can lay eggs and replace the ones that were caught.",
    emoji: "🎣",
  },
  {
    hard: true,
    prompt: "Burning fossil fuels releases carbon dioxide. Why is this a concern?",
    right: "it adds to climate change",
    wrong: ["it makes the air colder", "it creates more oil underground", "it makes trees stop growing"],
    hint: "Carbon dioxide traps heat in the atmosphere. Adding a lot of it is warming Earth's climate.",
    emoji: "🏭",
  },
  {
    hard: true,
    prompt: "Recycling an aluminium can uses about 95% less energy than making a new can from ore. What does this show?",
    right: "recycling saves both resources and energy",
    wrong: ["new cans are better for the planet", "aluminium is a renewable resource", "recycling uses more energy"],
    hint: "Recycled aluminium skips the mining and processing of new ore, which takes a lot of energy.",
    emoji: "🥫",
  },
  {
    hard: true,
    prompt: "Many First Peoples have long followed the idea of taking only what is needed. How does this help resources?",
    right: "it leaves enough for plants and animals to renew",
    wrong: ["it uses resources up faster", "it means resources are never used at all", "it only matters for non-renewable resources"],
    hint: "Taking only what you need means there's enough left to grow back for future generations.",
    emoji: "🌿",
  },
  {
    hard: true,
    prompt: "Some First Nations on the Pacific coast harvest strips of bark from living cedar trees. Why is this a sustainable practice?",
    right: "the tree stays alive and keeps growing",
    wrong: ["the whole tree is cut down quickly", "it uses a non-renewable resource", "it stops the tree from growing"],
    hint: "Careful harvesting takes only part of the bark, so the tree can heal and live on.",
    emoji: "🌲",
  },
  {
    hard: true,
    prompt: "Which way of making electricity uses a renewable resource and burns no fuel?",
    right: "solar panels",
    wrong: ["a coal power plant", "a natural gas power plant", "a diesel generator"],
    hint: "Solar panels turn sunlight straight into electricity. Coal, gas and diesel are fossil fuels that must be burned.",
    emoji: "☀️",
  },
  {
    hard: true,
    prompt: "Sand and gravel are important Earth materials. What are they mostly used for?",
    right: "making concrete and building roads",
    wrong: ["burning for heat", "feeding farm animals", "making electricity"],
    hint: "Huge amounts of sand and gravel go into concrete, roads and building foundations.",
    emoji: "🛣️",
  },
  {
    hard: true,
    prompt: "Uranium is mined to fuel nuclear power plants. Is it renewable?",
    right: "no, there is a limited amount in the Earth",
    wrong: ["yes, it grows back every year", "yes, it comes from sunlight"],
    hint: "Uranium is a mineral resource. Like metals and fossil fuels, the supply in the ground is limited.",
  },
];

function wasteData(d: Level): Question {
  const name = pick(NAMES);
  const kinds = [
    { label: "Paper", emoji: "📄" },
    { label: "Food scraps", emoji: "🍎" },
    { label: "Plastic", emoji: "🥤" },
    { label: "Metal cans", emoji: "🥫" },
  ];
  const values = sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 4);
  const visual: Visual = {
    type: "bars",
    title: `${name}'s class: one week of school waste (kg)`,
    bars: kinds.map((k, i) => ({ label: k.label, value: values[i], emoji: k.emoji })),
  };
  if (d === 1) {
    const top = values.indexOf(Math.max(...values));
    return textChoice(
      `${name}'s class weighed a week of school waste. Which type was heaviest?`,
      kinds[top].label.toLowerCase(),
      kinds.filter((_, i) => i !== top).map((k) => k.label.toLowerCase()),
      "Find the tallest bar. That type of waste weighed the most.",
      visual,
    );
  }
  if (d === 2) {
    const total = values[0] + values[3];
    return input(
      "Paper and metal cans can both be recycled. How many kilograms of those two types did the class collect altogether?",
      total,
      `Add the paper and metal cans bars: ${values[0]} + ${values[3]} = ${total}.`,
      visual,
      "kg",
    );
  }
  const total = values.reduce((a, b) => a + b, 0);
  return input(
    "How many kilograms of waste did the class collect in all?",
    total,
    `Add all four bars: ${values.join(" + ")} = ${total}.`,
    visual,
    "kg",
  );
}

function resources({ difficulty = 2 }: GenerateOptions = {}): Question[] {
  return [
    pick([FOSSIL_ORDER, PAPER_ORDER]),
    ...shuffle([
      sortQuestion(pick([RENEWABLE_SORT, USE_SORT]), perBin(difficulty)),
      wasteData(difficulty),
      ...levelled(RESOURCE_BANK, 5, difficulty),
    ]),
  ];
}

export const course: Course = {
  grade: "5",
  subject: "science",
  bigIdeas: {
    "ca-bc": [
      "Multicellular organisms have organ systems that enable them to survive and interact within their environment.",
      "Solutions are homogeneous.",
      "Machines are devices that transfer force and energy.",
      "Earth materials change as they move through the rock cycle and can be used as natural resources.",
    ],
  },
  units: [
    {
      id: "digestion-and-breathing",
      title: "Digestion & Breathing",
      emoji: "🫁",
      blurb: "Your digestive and respiratory systems",
      standards: { "ca-bc": "Basic structures and functions of body systems: digestive and respiratory" },
      parentNote:
        "How food travels through the digestive system and air through the respiratory system, plus reading a breathing-rate table.",
      generate: digestBreathe,
    },
    {
      id: "heart-bones-muscles",
      title: "Heart, Bones & Muscles",
      emoji: "🫀",
      blurb: "Circulation, bones and muscles",
      standards: { "ca-bc": "Basic structures and functions of body systems: circulatory and musculoskeletal" },
      parentNote:
        "The heart and blood vessels, bones, joints, muscles and tendons, how body systems work together, and heart-rate data.",
      generate: heartBones,
    },
    {
      id: "solutions-and-mixtures",
      title: "Solutions & Mixtures",
      emoji: "🧪",
      blurb: "Dissolving and separating mixtures",
      standards: { "ca-bc": "Solutions and solubility; mixtures and separation techniques" },
      parentNote:
        "Solutions versus mechanical mixtures, solutes and solvents, what affects dissolving, and ways to separate mixtures (filtering, evaporation, magnets, chromatography).",
      generate: solutions,
    },
    {
      id: "simple-machines",
      title: "Simple Machines",
      emoji: "⚙️",
      blurb: "Levers, ramps, pulleys and more",
      standards: {
        "ca-bc": "Simple machines (lever, wedge, pulley, wheel and axle, inclined plane, screw) and how they make work easier",
      },
      parentNote:
        "The six simple machines, how machines trade force for distance, compound machines, and reading data from a ramp experiment.",
      generate: machines,
    },
    {
      id: "rock-cycle",
      title: "The Rock Cycle",
      emoji: "🌋",
      blurb: "Igneous, sedimentary and metamorphic",
      standards: { "ca-bc": "Local types of earth materials; the rock cycle (igneous, sedimentary and metamorphic rock)" },
      parentNote:
        "How igneous, sedimentary and metamorphic rocks form and change into one another, weathering and erosion, and a short reading passage.",
      generate: rocks,
    },
    {
      id: "natural-resources",
      title: "Natural Resources",
      emoji: "🌲",
      blurb: "Renewable, non-renewable, used wisely",
      standards: {
        "ca-bc": "Earth's natural resources (renewable and non-renewable); sustainable practices, including First Peoples knowledge",
      },
      parentNote:
        "Renewable and non-renewable resources, Earth materials we use, responsible use (including First Peoples' sustainable practices), and a school waste-audit graph.",
      generate: resources,
    },
  ],
};
