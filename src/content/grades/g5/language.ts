import { sortQuestion } from "../../bank";
import { pick, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, Visual } from "../../types";

type Level = 1 | 2 | 3;

const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

/** Wrong answers to show: 3 choices at level 1, 4 at level 2, up to 5 at level 3. */
const wrongFor = (level: Level): number => level + 1;

/** A hand-written multiple-choice question. */
interface Item {
  level: Level;
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
  /** Sentence(s) shown above the question. */
  text?: string | string[];
}

const lines = (text: string | string[]): Visual => ({ type: "story", lines: Array.isArray(text) ? text : [text] });

function ask(item: Omit<Item, "level">, level: Level, visual?: Visual): Question {
  return textChoice(
    item.prompt,
    item.right,
    sample(item.wrong, wrongFor(level)),
    item.hint,
    visual ?? (item.text === undefined ? undefined : lines(item.text)),
  );
}

/** `count` items, mostly at `level`, topped up from the nearest levels. */
function levelled<T extends { level: Level }>(items: readonly T[], level: Level, count: number): T[] {
  const exact = shuffle(items.filter((i) => i.level === level));
  const near = shuffle(items.filter((i) => Math.abs(i.level - level) === 1));
  const far = shuffle(items.filter((i) => Math.abs(i.level - level) === 2));
  const main = Math.ceil(count * 0.75);
  return shuffle([...exact.slice(0, main), ...near, ...exact.slice(main), ...far].slice(0, count));
}

/** All items, shuffled, with those at `level` first, then the nearest levels. */
function byLevel<T extends { level: Level }>(items: readonly T[], level: Level): T[] {
  const at = (d: number) => shuffle(items.filter((i) => Math.abs(i.level - level) === d));
  return [...at(0), ...at(1), ...at(2)];
}

/** `count` items spread evenly across groups (one from each group, then a second from each…), keeping each group's order. */
function spread<T>(items: readonly T[], key: (item: T) => string, count: number): T[] {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
  const order = shuffle([...groups.values()]);
  const out: T[] = [];
  for (let round = 0; out.length < count && order.some((g) => g.length > round); round++) {
    for (const g of order) if (round < g.length && out.length < count) out.push(g[round]);
  }
  return shuffle(out);
}

const capitalize = (s: string): string => s[0].toUpperCase() + s.slice(1);

// ---------- 1. Reading Detectives ----------

type PassageQ = Omit<Item, "level" | "text">;

interface Passage {
  level: Level;
  title: string;
  paragraphs: string[];
  questions: PassageQ[];
  /** Key events in order, for a sequencing question. */
  events?: string[];
}

const PASSAGES: Passage[] = [
  // ----- Level 1 -----
  {
    level: 1,
    title: "The Rainy-Day Bake Sale",
    paragraphs: [
      "Amir wanted to raise money for new books for the school library. He decided to hold a bake sale on Friday. On Thursday night, he and his grandmother baked three trays of oatmeal cookies.",
      "On Friday morning, rain poured down. Amir worried that nobody would stop at his table outside. Then he had an idea. He moved the table inside, next to the gym doors, and made a big, bright sign.",
      "By the end of lunch, every cookie was gone. Amir had raised forty-two dollars for the library.",
    ],
    questions: [
      {
        prompt: "Why did Amir hold a bake sale?",
        right: "To raise money for new library books",
        wrong: ["To win a baking contest", "To use up his grandmother's oatmeal", "To make the gym look brighter"],
        hint: "Look at the very first sentence of the passage.",
      },
      {
        prompt: "Which word best describes Amir?",
        right: "determined",
        wrong: ["careless", "boastful", "lazy"],
        hint: "Think about what Amir did when the rain caused a problem. Did he give up?",
      },
      {
        prompt: "What problem did Amir face on Friday morning?",
        right: "The rain might keep people away from his table.",
        wrong: ["He forgot to bake the cookies.", "The library was closed.", "His grandmother needed the oven."],
        hint: "Reread the second paragraph. What made Amir worry?",
      },
      {
        prompt: "Which sentence best summarizes the passage?",
        right: "Amir solved a rainy-day problem and raised money for the library with a bake sale.",
        wrong: [
          "Amir and his grandmother baked oatmeal cookies.",
          "It rained hard on Friday morning.",
          "Amir made a big, bright sign.",
        ],
        hint: "A summary tells the most important ideas from the beginning, middle and end, not just one detail.",
      },
      {
        prompt: "In this passage, what does “raise” mean?",
        right: "collect",
        wrong: ["lift up high", "grow taller", "wake up"],
        hint: "Amir wanted to raise money. Which meaning makes sense with money?",
      },
    ],
    events: [
      "Amir and his grandmother baked cookies.",
      "Rain poured down on Friday morning.",
      "Amir moved his table inside.",
      "Every cookie was sold by the end of lunch.",
    ],
  },
  {
    level: 1,
    title: "The Next Big Rock",
    paragraphs: [
      "Zoe had never hiked a mountain trail before. Halfway up, her legs ached and she wanted to turn back. Her older cousin Ravi handed her a water bottle. “Let's just get to that next big rock,” he said.",
      "At the rock, they picked another goal: the bend in the trail. Then a tall pine tree. Then a wooden sign. One small goal at a time, they kept climbing.",
      "Finally, they reached the top. Zoe looked out over the valley and grinned. “I'm glad I didn't quit,” she said.",
    ],
    questions: [
      {
        prompt: "What lesson does this story teach?",
        right: "Breaking a big job into small steps can help you finish it.",
        wrong: [
          "Mountain views are the best part of a hike.",
          "Older cousins always know the way.",
          "It's best to hike as fast as you can.",
        ],
        hint: "Think about how Zoe made it to the top. What did she and Ravi keep doing?",
      },
      {
        prompt: "How did Zoe most likely feel at the top?",
        right: "proud",
        wrong: ["bored", "angry", "confused"],
        hint: "She grinned and said she was glad she didn't quit.",
      },
      {
        prompt: "Why did Ravi suggest walking to “that next big rock”?",
        right: "To give Zoe a small goal that felt possible",
        wrong: ["Because he was lost", "To start a race to the top", "Because he had left his bag there"],
        hint: "Zoe wanted to give up. How would a small, close goal help her?",
      },
      {
        prompt: "Which word best describes Ravi?",
        right: "encouraging",
        wrong: ["impatient", "selfish", "forgetful"],
        hint: "Look at what Ravi said and did when Zoe wanted to turn back.",
      },
      {
        prompt: "What does “ached” mean in this story?",
        right: "hurt",
        wrong: ["danced", "grew stronger", "froze"],
        hint: "Zoe's legs ached, and she wanted to turn back. How do legs feel after a hard climb?",
      },
    ],
    events: [
      "Zoe's legs ached halfway up.",
      "Ravi suggested walking to the next big rock.",
      "They kept picking small goals.",
      "Zoe reached the top and grinned.",
    ],
  },
  {
    level: 1,
    title: "Warm in Cold Water",
    paragraphs: [
      "Sea otters live in the cold waters of the northern Pacific Ocean. Most sea mammals, such as seals and whales, have a thick layer of fat called blubber to keep them warm. Sea otters do not. Instead, they have the thickest fur of any animal on Earth.",
      "Sea otters spend hours every day grooming, or cleaning, their fur. Clean fur traps tiny bubbles of air. The air keeps cold water away from the otter's skin, so the otter stays warm and dry.",
      "When sea otters rest, they float on their backs. Sometimes they wrap themselves in long strands of kelp so they won't drift away while they sleep.",
    ],
    questions: [
      {
        prompt: "What is the main idea of this passage?",
        right: "Sea otters have special ways to stay warm and safe in cold water.",
        wrong: ["Seals and whales have blubber.", "Kelp grows in long strands.", "Sea otters float on their backs."],
        hint: "The main idea is what the whole passage is mostly about, not one small detail.",
      },
      {
        prompt: "Why do sea otters spend so much time grooming?",
        right: "Clean fur traps air that keeps them warm and dry.",
        wrong: [
          "They want to look nice for other otters.",
          "Grooming helps them grow blubber.",
          "Clean fur helps them sink to the bottom.",
        ],
        hint: "Reread the second paragraph. What does clean fur do?",
      },
      {
        prompt: "What does “grooming” mean?",
        right: "cleaning",
        wrong: ["swimming", "sleeping", "hunting"],
        hint: "The author explains the word right after it, between two commas.",
      },
      {
        prompt: "How are sea otters different from most sea mammals?",
        right: "They don't have a thick layer of blubber.",
        wrong: ["They live in the ocean.", "They breathe air.", "They swim in cold water."],
        hint: "Look at the first paragraph. What do seals and whales have that sea otters don't?",
      },
      {
        prompt: "Why might a sea otter wrap itself in kelp?",
        right: "So it won't drift away while it sleeps",
        wrong: ["To hide from the sun", "To build a nest on the beach", "To keep its fur clean"],
        hint: "The last sentence tells you why.",
      },
    ],
  },
  {
    level: 1,
    title: "Lunch in Space",
    paragraphs: [
      "On the International Space Station, astronauts float, and so does everything around them, including their food. That makes mealtime tricky!",
      "Bread makes crumbs, and floating crumbs could drift into equipment or into someone's eyes. So astronauts often use tortillas instead of bread for their sandwiches.",
      "Salt and pepper are a problem too, because loose grains would drift around the cabin. Instead, salt is mixed into water and pepper is mixed into oil, and astronauts squirt them onto their food. Drinks come in sealed pouches with straws.",
    ],
    questions: [
      {
        prompt: "Why do astronauts often use tortillas instead of bread?",
        right: "Bread crumbs could float into equipment.",
        wrong: ["Tortillas taste better in space.", "Bread is too heavy to bring.", "Tortillas stay warm longer."],
        hint: "Reread the second paragraph. What's the problem with bread?",
      },
      {
        prompt: "What is the main idea of this passage?",
        right: "Astronauts have clever ways to eat when everything floats.",
        wrong: ["Drinks come in pouches with straws.", "Tortillas are a kind of flatbread.", "The space station is very large."],
        hint: "The main idea is what the whole passage is about, not one detail.",
      },
      {
        prompt: "How do astronauts use salt in space?",
        right: "It is mixed into water and squirted onto food.",
        wrong: ["They sprinkle it from a shaker.", "They don't use salt at all.", "It is baked into the tortillas."],
        hint: "Look at the last paragraph.",
      },
      {
        prompt: "What does “tricky” mean in this passage?",
        right: "hard to do",
        wrong: ["very fun", "very quick", "against the rules"],
        hint: "Floating food would make eating more difficult. Which meaning fits?",
      },
      {
        prompt: "How is this passage mainly organized?",
        right: "problem and solution",
        wrong: ["compare and contrast", "sequence", "a story with characters"],
        hint: "The author names problems that floating causes, then explains how astronauts deal with them.",
      },
    ],
  },
  // ----- Level 2 -----
  {
    level: 2,
    title: "Tomatoes for a Neighbour",
    paragraphs: [
      "When the empty lot on Birch Street became a community garden, Priya signed up for a plot right away. Her neighbour, Mr. Okafor, signed up too. “Kids will trample everything,” he grumbled.",
      "All spring, Priya watered her beans before school. One hot week in July, Mr. Okafor went away to visit his sister. Priya noticed his tomato plants drooping in the sun, so she filled her watering can and soaked them too, every single day.",
      "When Mr. Okafor came home, his tomatoes were tall and healthy. The next morning, Priya found a basket of ripe tomatoes on her doorstep with a note: “Thank you, neighbour. I was wrong about kids.”",
    ],
    questions: [
      {
        prompt: "What is the theme of this story?",
        right: "Kind actions can change how people see us.",
        wrong: ["Gardening takes too much time.", "Tomatoes grow best in hot weather.", "It's best to keep to yourself."],
        hint: "Think about how Mr. Okafor's opinion of kids changed, and what caused it.",
      },
      {
        prompt: "At the start of the story, what can you infer about Mr. Okafor?",
        right: "He didn't trust kids to be careful in the garden.",
        wrong: ["He was Priya's grandfather.", "He didn't like tomatoes.", "He had never gardened before."],
        hint: "Reread what he grumbled in the first paragraph.",
      },
      {
        prompt: "Which word best describes Priya?",
        right: "thoughtful",
        wrong: ["jealous", "boastful", "forgetful"],
        hint: "Priya noticed a problem that wasn't hers and fixed it without being asked.",
      },
      {
        prompt: "Why did Mr. Okafor leave tomatoes on Priya's doorstep?",
        right: "To thank her for caring for his plants",
        wrong: ["To ask her to water them again", "Because he was moving away", "Because the tomatoes were not ripe"],
        hint: "Read his note. What two things does it say?",
      },
      {
        prompt: "What does “trample” most likely mean?",
        right: "step on and crush",
        wrong: ["plant seeds in", "water carefully", "pick and eat"],
        hint: "Mr. Okafor was worried kids would harm the garden. What could careless feet do to plants?",
      },
    ],
    events: [
      "Priya and Mr. Okafor sign up for garden plots.",
      "Mr. Okafor leaves to visit his sister.",
      "Priya waters his drooping tomato plants.",
      "Mr. Okafor leaves tomatoes and a thank-you note.",
    ],
  },
  {
    level: 2,
    title: "Why Leaves Change Colour",
    paragraphs: [
      "Every autumn, the leaves of many trees turn from green to yellow, orange and red. This change happens because of what is going on inside each leaf.",
      "In spring and summer, leaves are full of chlorophyll, a green substance that helps trees make food from sunlight. Chlorophyll is so plentiful that its green colour hides the other colours in the leaf, such as yellow and orange.",
      "As the days get shorter and cooler in autumn, trees stop making chlorophyll. The green fades away, and the yellow and orange that were there all along can finally be seen. Some trees, such as maples, also make new red colours in the fall.",
    ],
    questions: [
      {
        prompt: "What causes many leaves to change colour in autumn?",
        right: "Trees stop making green chlorophyll.",
        wrong: ["Cold rain paints the leaves.", "Leaves soak up colour from the soil.", "The sun turns the leaves orange."],
        hint: "Look at the first sentence of the last paragraph.",
      },
      {
        prompt: "What is chlorophyll?",
        right: "A green substance that helps trees make food",
        wrong: ["A yellow colour that appears in spring", "A kind of maple tree", "The stem that holds a leaf"],
        hint: "The author explains the word right after it, following a comma.",
      },
      {
        prompt: "How is this passage mainly organized?",
        right: "cause and effect",
        wrong: ["compare and contrast", "problem and solution", "a story with characters"],
        hint: "The passage explains why something happens. Which structure explains causes and their results?",
      },
      {
        prompt: "What does “plentiful” mean?",
        right: "in large amounts",
        wrong: ["very rare", "bright red", "dried out"],
        hint: "If there's so much of it that it hides other colours, is there a little or a lot?",
      },
      {
        prompt: "Where do the yellow and orange colours come from?",
        right: "They were in the leaf all along, hidden by green.",
        wrong: ["Trees make them on the first cold night.", "They come from autumn sunlight.", "Only maple trees make them."],
        hint: "Reread the last paragraph. Which colours were “there all along”?",
      },
    ],
  },
  {
    level: 2,
    title: "Partners",
    paragraphs: [
      "Kenji and Lena were partners for the science fair. Kenji wanted to build a robot arm. Lena wanted to test which kind of paper towel soaked up the most water. They argued for two days and got nothing done.",
      "On the third day, their teacher, Ms. Duarte, asked them one question: “What do you each enjoy most?” Kenji said he liked building things. Lena said she liked measuring things carefully.",
      "Together, they built a robot arm that dipped paper towels into water at exactly the same speed every time. Then Lena measured how much water each towel soaked up. Their project won a ribbon for Best Teamwork.",
    ],
    questions: [
      {
        prompt: "What was the main conflict in this story?",
        right: "Kenji and Lena couldn't agree on a project.",
        wrong: ["The robot arm kept breaking.", "Ms. Duarte was upset with them.", "They ran out of paper towels."],
        hint: "What problem kept them from getting anything done for two days?",
      },
      {
        prompt: "How did Kenji and Lena solve their problem?",
        right: "They combined both of their ideas into one project.",
        wrong: ["They each did a separate project.", "Ms. Duarte chose a project for them.", "Lena gave up her idea completely."],
        hint: "Look at the last paragraph. Whose ideas ended up in the project?",
      },
      {
        prompt: "What is the theme of this story?",
        right: "Working together can turn a disagreement into a better idea.",
        wrong: [
          "Science fairs are too hard for partners.",
          "Robots are more useful than paper towels.",
          "Winning a ribbon is all that matters.",
        ],
        hint: "Think about what happened when they stopped arguing and listened to each other.",
      },
      {
        prompt: "Why did the robot arm dip each towel at exactly the same speed?",
        right: "To make the test fair for every towel",
        wrong: ["Because the arm could only go one speed", "To make the robot look impressive", "So the towels would dry faster"],
        hint: "In a fair test, you change only one thing at a time. What should stay the same for every towel?",
      },
      {
        prompt: "How did Ms. Duarte's question help the partners?",
        right: "It made them think about what they each enjoyed.",
        wrong: ["It made them pick new partners.", "It told them which idea was better.", "It ended the science fair early."],
        hint: "Reread the second paragraph. What did Kenji and Lena realize after her question?",
      },
    ],
    events: [
      "Kenji and Lena argued about their project.",
      "Ms. Duarte asked what they each enjoyed.",
      "They built a robot arm to dip the towels.",
      "Their project won a ribbon.",
    ],
  },
  {
    level: 2,
    title: "Dock at Dawn (a poem)",
    paragraphs: [
      "The lake is a flat grey mirror.",
      "Nothing moves",
      "except one loon,",
      "drawing a silver line behind it.",
      "The mist yawns and stretches,",
      "then slips away between the trees.",
      "My toes touch the water,",
      "cold enough to make me laugh.",
      "By the time Grandma calls me in for breakfast,",
      "the sun has painted the whole lake gold.",
    ],
    questions: [
      {
        prompt: "Which line from the poem uses personification?",
        right: "“The mist yawns and stretches”",
        wrong: ["“The lake is a flat grey mirror”", "“Nothing moves”", "“My toes touch the water”"],
        hint: "Personification gives human actions to something that isn't human. Which non-human thing does something people do?",
      },
      {
        prompt: "What is the setting of the poem?",
        right: "a lake early in the morning",
        wrong: ["a beach at sunset", "a forest at midnight", "a city park at noon"],
        hint: "Look at the title and the clues: mist, a loon and breakfast.",
      },
      {
        prompt: "What does “drawing a silver line behind it” describe?",
        right: "the trail the loon makes on the water",
        wrong: ["a pencil drawing of the lake", "a fishing line in the water", "lightning in the sky"],
        hint: "Picture a loon swimming across very still water. What would you see behind it?",
      },
      {
        prompt: "How does the speaker most likely feel?",
        right: "calm and happy",
        wrong: ["frightened and lonely", "bored and grumpy", "rushed and angry"],
        hint: "The lake is still and quiet, and the cold water makes the speaker laugh.",
      },
      {
        prompt: "“The lake is a flat grey mirror” is an example of…",
        right: "a metaphor",
        wrong: ["a simile", "onomatopoeia", "hyperbole"],
        hint: "It says the lake IS a mirror, without using “like” or “as.”",
      },
    ],
  },
  // ----- Level 3 -----
  {
    level: 3,
    title: "The Solo",
    paragraphs: [
      "Noah had played the violin for three years, but only ever with his bedroom door closed. When Ms. Bell announced the spring concert, he stared at his shoes and hoped she wouldn't call his name.",
      "She did. “Noah, would you play a solo?” His stomach flipped. That night he practised the piece twenty times, each time a little louder, until his little sister, Mira, knocked and asked if she could listen. When he finished, she gave him two thumbs up from the doorway.",
      "On concert night, Noah's hands trembled as he lifted his bow. He searched the crowd and found Mira in the third row. She held up two thumbs. He took a slow breath and began.",
      "When the last note faded, the gym was silent for a heartbeat. Then the applause rolled in like a wave.",
    ],
    questions: [
      {
        prompt: "What is Noah's main conflict?",
        right: "He is nervous about playing in front of other people.",
        wrong: ["He doesn't know how to play the violin.", "He is angry with his sister.", "His violin is broken."],
        hint: "Think about why he only played with his door closed and stared at his shoes.",
      },
      {
        prompt: "Why did Noah look for Mira in the crowd?",
        right: "Her support reminded him that he could do it.",
        wrong: ["She was going to play with him.", "He wanted her to leave early.", "She was holding his sheet music."],
        hint: "Mira had cheered him on at home. What did seeing her thumbs up do for him on stage?",
      },
      {
        prompt: "What does “each time a little louder” suggest about Noah?",
        right: "He was slowly becoming more confident.",
        wrong: ["He was trying to annoy his sister.", "His violin was getting quieter.", "He was forgetting the notes."],
        hint: "He used to play quietly behind a closed door. What does playing louder show about how he feels?",
      },
      {
        prompt: "What is a theme of this story?",
        right: "Courage can grow with practice and support.",
        wrong: ["Concerts are always too loud.", "Music is best kept private.", "Little sisters can be annoying."],
        hint: "Think about how Noah changed from the beginning to the end, and what helped him.",
      },
      {
        prompt: "Why was the gym “silent for a heartbeat” before the applause?",
        right: "The audience was moved and paused before clapping.",
        wrong: ["Everyone had already left.", "The lights went out.", "Noah forgot to finish the piece."],
        hint: "Right after, the applause “rolled in like a wave.” What does a short silence before big applause usually mean?",
      },
      {
        prompt: "What does “trembled” mean?",
        right: "shook slightly",
        wrong: ["grew warm", "clapped loudly", "stayed perfectly still"],
        hint: "His hands trembled because he was nervous. What do nervous hands sometimes do?",
      },
    ],
    events: [
      "Ms. Bell asked Noah to play a solo.",
      "Mira listened to Noah practise.",
      "Noah found Mira in the third row.",
      "The audience applauded.",
    ],
  },
  {
    level: 3,
    title: "Ten More Minutes",
    paragraphs: [
      "Right now, morning recess at our school lasts fifteen minutes. Many students feel that is not enough time. I believe recess should be extended to twenty-five minutes.",
      "First, active play is good for the brain. Studies have found that students who get breaks for physical activity often pay better attention in class afterward. Second, a longer recess gives students time to work out problems with friends on their own, which builds important social skills.",
      "Some people worry that a longer recess means less time for learning. However, if students return to class focused and ready, the time they spend learning will be more useful. Ten extra minutes outside is a small change that could make a big difference.",
    ],
    questions: [
      {
        prompt: "What is the author's main purpose?",
        right: "to persuade readers that recess should be longer",
        wrong: ["to entertain readers with a funny story", "to explain how recess began", "to describe a school playground"],
        hint: "Look for the sentence that begins “I believe.” What does the author want readers to agree with?",
      },
      {
        prompt: "Which sentence from the passage is an opinion?",
        right: "I believe recess should be extended to twenty-five minutes.",
        wrong: [
          "Right now, morning recess at our school lasts fifteen minutes.",
          "Studies have found that students who get breaks for physical activity often pay better attention in class afterward.",
        ],
        hint: "A fact can be checked. An opinion tells what someone thinks or believes.",
      },
      {
        prompt: "How does the author respond to people who disagree?",
        right: "By explaining that focused students make better use of learning time",
        wrong: ["By saying their worries are silly", "By agreeing that recess should be shorter", "By ignoring their worries"],
        hint: "Reread the paragraph that starts with “Some people worry.”",
      },
      {
        prompt: "What evidence does the author give that active play helps the brain?",
        right: "Studies found students pay better attention after active breaks.",
        wrong: ["Recess now lasts fifteen minutes.", "Many students feel recess is too short.", "Ten minutes is a small change."],
        hint: "Evidence is information that supports a reason. Look in the second paragraph.",
      },
      {
        prompt: "What does “extended” mean in this passage?",
        right: "made longer",
        wrong: ["cancelled", "moved indoors", "made shorter"],
        hint: "The author wants recess to go from fifteen to twenty-five minutes.",
      },
    ],
  },
  {
    level: 3,
    title: "The Map in the Box",
    paragraphs: [
      "Ana's grandfather kept a wooden box on a high shelf in the attic, and no one was allowed to open it. When he asked her to help clean the attic one Saturday, she kept glancing at the shelf.",
      "Late in the afternoon, he lifted the box down and set it on her lap. Inside was a hand-drawn map of a small town, with tiny houses, a bakery and a curving river. “This is where I grew up,” he said quietly. “I drew it from memory the year I moved to Canada, so I would never forget.”",
      "Ana traced the river with her finger. “Will you tell me about the bakery?” she asked. Her grandfather smiled for the first time all day. “I'll do better than that,” he said. “I'll teach you how to make my mother's bread.”",
    ],
    questions: [
      {
        prompt: "Why did Ana keep glancing at the shelf?",
        right: "She was curious about the box.",
        wrong: ["She wanted to throw the box away.", "She was afraid the shelf would fall.", "She thought the box belonged to her."],
        hint: "No one was allowed to open the box. How might that make Ana feel?",
      },
      {
        prompt: "Why did her grandfather draw the map?",
        right: "To remember the town where he grew up",
        wrong: ["To find hidden treasure", "To sell it to a museum", "To plan a new bakery"],
        hint: "He explains this himself in the second paragraph.",
      },
      {
        prompt: "What made her grandfather smile “for the first time all day”?",
        right: "Ana showing interest in his childhood memories",
        wrong: ["Finishing the attic cleaning", "Finding a lost bread recipe", "Ana asking to go home"],
        hint: "Look at what Ana asked just before he smiled.",
      },
      {
        prompt: "What is a theme of this story?",
        right: "Sharing family memories can bring people closer.",
        wrong: ["Attics should always be kept tidy.", "Old maps are worth a lot of money.", "It's wrong to be curious."],
        hint: "Think about how Ana and her grandfather feel about each other by the end.",
      },
      {
        prompt: "Which detail best shows that the map is very important to her grandfather?",
        right: "He kept it in a box no one was allowed to open.",
        wrong: ["He asked Ana to help clean the attic.", "The map shows a curving river.", "Ana traced the river with her finger."],
        hint: "Which detail shows that he protected the map carefully?",
      },
    ],
    events: [
      "Ana helped clean the attic.",
      "Her grandfather showed her the map.",
      "Ana asked about the bakery.",
      "Her grandfather offered to teach her to make bread.",
    ],
  },
  {
    level: 3,
    title: "Black Bear or Grizzly?",
    paragraphs: [
      "Black bears and grizzly bears both live in parts of Canada, and both eat a mix of plants and animals. Still, there are clear ways to tell them apart.",
      "A grizzly bear has a large hump of muscle on its shoulders, which helps it dig for roots and dig out dens. Black bears do not have this hump. Grizzlies also have short, rounded ears, while black bears have taller, pointed ears.",
      "Colour is not a reliable clue. Despite their name, black bears can be brown, cinnamon or even nearly white. That is why wildlife experts look at body shape, not fur colour, to identify a bear.",
    ],
    questions: [
      {
        prompt: "How is this passage mainly organized?",
        right: "compare and contrast",
        wrong: ["sequence", "problem and solution", "a story with characters"],
        hint: "The passage shows how two animals are alike and how they are different.",
      },
      {
        prompt: "According to the passage, what is the best way to tell the two bears apart?",
        right: "Look at body shape, like the shoulder hump and ears.",
        wrong: ["Look at the colour of the fur.", "Watch what the bear eats.", "Check whether it lives in Canada."],
        hint: "Reread the last sentence. What do wildlife experts look at?",
      },
      {
        prompt: "Why does the author say colour is “not a reliable clue”?",
        right: "Black bears can have fur in many colours.",
        wrong: ["Grizzly bears change colour every season.", "Bears are hard to see in the forest.", "All bears are the same colour."],
        hint: "Read the sentence that starts with “Despite their name.”",
      },
      {
        prompt: "What does the hump on a grizzly's shoulders help it do?",
        right: "dig for roots and dig out dens",
        wrong: ["swim across rivers", "climb tall trees", "store water"],
        hint: "Look at the second paragraph.",
      },
      {
        prompt: "What does “reliable” mean?",
        right: "able to be trusted",
        wrong: ["easy to see", "very colourful", "hard to find"],
        hint: "Colour can fool you, so you can't count on it. What word means you can count on something?",
      },
    ],
  },
];

function passageQuestions(p: Passage, level: Level): Question[] {
  const visual: Visual = { type: "passage", title: p.title, paragraphs: p.paragraphs };
  const qs: Question[] = p.questions.map((q) => ask(q, level, visual));
  if (p.events) {
    const order: OrderQuestion = {
      kind: "order",
      prompt: "Put these events from the story in the order they happened.",
      hint: "Reread from the beginning. Which event happens first, and what happens because of it?",
      visual,
      items: p.events.map((label, i) => ({ id: `e${i}`, label })),
    };
    qs.push(order);
  }
  return sample(qs, 4);
}

function reading(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return levelled(PASSAGES, level, 2).flatMap((p) => passageQuestions(p, level));
}

// ---------- 2. Plot and Conflict ----------

const STAGES = ["exposition", "rising action", "climax", "falling action", "resolution"] as const;
type Stage = (typeof STAGES)[number];

const STAGE_HINT: Record<Stage, string> = {
  exposition: "The exposition comes first. It introduces the characters, the setting and the situation.",
  "rising action": "In the rising action, a problem appears and the tension builds.",
  climax: "The climax is the turning point: the most exciting or tense moment of the story.",
  "falling action": "The falling action comes right after the climax, as the excitement settles down.",
  resolution: "The resolution comes last. It shows how things end up once the problem is solved.",
};

/** Five events, one per stage, in plot order. */
const PLOTS: { title: string; events: string[] }[] = [
  {
    title: "The Storm on the Lake",
    events: [
      "Leo loves fishing on the lake with his aunt every Saturday.",
      "One morning, dark clouds roll in while they're far from shore, and the motor won't start.",
      "Leo grabs the oars and rows with all his strength as the waves grow bigger.",
      "At last, the boat bumps against the dock, and his aunt ties it up tight.",
      "That night, Leo decides to learn how to read the weather before every trip.",
    ],
  },
  {
    title: "The New Player",
    events: [
      "Maya has just moved to a new town and doesn't know anyone at her school.",
      "She asks to join the lunchtime chess games, but the players tell her the boards are full.",
      "At the school chess tournament, Maya faces the best player in the final game and wins.",
      "The other players crowd around and ask her how she planned her moves.",
      "Maya starts a chess club, and soon it has twelve members.",
    ],
  },
  {
    title: "The Missing Calf",
    events: [
      "Priya and her brother Jay are spending the summer at their grandparents' farm.",
      "A calf goes missing, and dark clouds gather as they search the fields.",
      "Just as the rain starts, Priya hears a faint moo and finds the calf stuck behind a gate in the old barn.",
      "They free the calf and lead it back to its mother.",
      "Their grandfather thanks them and lets them name the calf Thunder.",
    ],
  },
  {
    title: "The Shootout",
    events: [
      "Kenji is the goalie for his soccer team, and penalty shots make him nervous.",
      "His team reaches the final, and the game ends in a tie.",
      "In the shootout, Kenji dives and stops the very last shot.",
      "His teammates cheer and lift him onto their shoulders.",
      "Kenji realizes he can be brave even when he feels nervous.",
    ],
  },
  {
    title: "The Spelling Bee",
    events: [
      "Zoe has practised for the school spelling bee for months.",
      "She makes it to the final round, but her mind goes blank on a word she knows.",
      "She takes a deep breath, pictures her flashcard and spells the word correctly to win.",
      "Her classmates clap as the principal hands her the trophy.",
      "Zoe puts the trophy on her shelf, right next to her flashcards.",
    ],
  },
  {
    title: "The Butterfly Watch",
    events: [
      "Sam's class is raising monarch caterpillars in a tank by the window.",
      "One caterpillar stops eating and hangs upside down, and the class worries that it is sick.",
      "As the class watches, its skin splits open and a green chrysalis appears.",
      "Every day, the students check on the chrysalis as it slowly darkens.",
      "A monarch butterfly comes out, and the class releases it in the school garden.",
    ],
  },
];

type Conflict = "person vs. person" | "person vs. nature" | "person vs. self";
const CONFLICT_KINDS: Conflict[] = ["person vs. person", "person vs. nature", "person vs. self"];

const CONFLICT_HINT: Record<Conflict, string> = {
  "person vs. person": "The struggle is between two characters who want different things.",
  "person vs. nature": "The character struggles against weather, animals or the natural world.",
  "person vs. self": "The struggle happens inside the character's own mind: a fear, a feeling or a hard choice.",
};

const CONFLICT_BINS = [
  { id: "person vs. person", label: "Person vs. person", emoji: "👥" },
  { id: "person vs. nature", label: "Person vs. nature", emoji: "🌪️" },
  { id: "person vs. self", label: "Person vs. self", emoji: "💭" },
];

const CONFLICTS: { kind: Conflict; text: string; emoji: string }[] = [
  { kind: "person vs. person", emoji: "💻", text: "Ravi and his older brother both need the family computer for projects due tomorrow." },
  { kind: "person vs. person", emoji: "🙋", text: "Lena's teammate keeps taking credit for Lena's ideas." },
  { kind: "person vs. person", emoji: "🎨", text: "Ana and her cousin both want the same art prize, and neither will back down." },
  { kind: "person vs. person", emoji: "📚", text: "Jay wants to play outside, but his babysitter insists he finish his homework first." },
  { kind: "person vs. nature", emoji: "❄️", text: "A blizzard traps Priya's family in their cabin until the roads are cleared." },
  { kind: "person vs. nature", emoji: "🛶", text: "Kenji's canoe is pushed off course by a strong river current." },
  { kind: "person vs. nature", emoji: "☀️", text: "A long drought dries up the pond where Zoe's ducks swim." },
  { kind: "person vs. nature", emoji: "⛈️", text: "Leo must find shelter before a thunderstorm reaches the mountain ridge." },
  { kind: "person vs. self", emoji: "🎭", text: "Maya wants to try out for the play, but she's afraid of forgetting her lines." },
  { kind: "person vs. self", emoji: "💵", text: "Noah finds a twenty-dollar bill and must decide whether to keep it or turn it in." },
  { kind: "person vs. self", emoji: "😟", text: "Sam feels jealous when his best friend wins, and he struggles with his own feelings." },
  { kind: "person vs. self", emoji: "⏰", text: "Amir keeps putting off his project and must convince himself to start." },
];

type Pov = "first person" | "second person" | "third person";

const POV_HINT =
  "First person uses I, me, my or we. Second person speaks to the reader as “you.” Third person uses names and he, she or they.";

const POVS: { level: Level; pov: Pov; text: string }[] = [
  { level: 2, pov: "first person", text: "I grabbed my backpack and raced to catch the bus." },
  { level: 2, pov: "first person", text: "We set up our tent just as the sun went down." },
  { level: 2, pov: "first person", text: "My brother and I built a snow fort in the yard." },
  { level: 2, pov: "third person", text: "She grabbed her backpack and raced to catch the bus." },
  { level: 2, pov: "third person", text: "Kenji peered into the tide pool, searching for crabs." },
  { level: 2, pov: "third person", text: "They set up their tent just as the sun went down." },
  { level: 3, pov: "third person", text: "Lena wondered whether anyone would notice the missing cookie." },
  { level: 3, pov: "second person", text: "You step into the dark cave and hear water dripping." },
  { level: 3, pov: "second person", text: "You open the door and find a box waiting on your bed." },
];

const STORY_TERMS: Item[] = [
  {
    level: 1,
    prompt: "Which part of a plot introduces the characters and the setting?",
    right: "exposition",
    wrong: ["climax", "falling action", "resolution"],
    hint: STAGE_HINT.exposition,
  },
  {
    level: 1,
    prompt: "Which part of a plot is the turning point, when the tension is highest?",
    right: "climax",
    wrong: ["exposition", "rising action", "resolution"],
    hint: STAGE_HINT.climax,
  },
  {
    level: 1,
    prompt: "Which part of a plot shows how things end up after the problem is solved?",
    right: "resolution",
    wrong: ["exposition", "rising action", "climax"],
    hint: STAGE_HINT.resolution,
  },
  {
    level: 2,
    prompt: "Which part of a plot builds tension as the problem grows?",
    right: "rising action",
    wrong: ["exposition", "resolution", "falling action"],
    hint: STAGE_HINT["rising action"],
  },
  {
    level: 2,
    prompt: "What is the conflict in a story?",
    right: "the main problem or struggle the characters face",
    wrong: ["the place where the story happens", "the lesson the reader learns", "the person telling the story"],
    hint: "Every story has a problem to solve. That struggle is the conflict.",
  },
  {
    level: 3,
    prompt: "Which part of a plot comes right after the climax, as the tension eases?",
    right: "falling action",
    wrong: ["exposition", "rising action", "resolution"],
    hint: STAGE_HINT["falling action"],
  },
  {
    level: 3,
    prompt: "What do we call the main character of a story?",
    right: "the protagonist",
    wrong: ["the antagonist", "the setting", "the climax"],
    hint: "The protagonist is the main character, the one the story follows.",
  },
  {
    level: 3,
    prompt: "What do we call a character or force that works against the main character?",
    right: "the antagonist",
    wrong: ["the protagonist", "the setting", "the resolution"],
    hint: "The antagonist creates problems for the main character (the protagonist).",
  },
];

function stageQuestion(plot: { events: string[] }, i: number, level: Level): Question {
  const stage = STAGES[i];
  const options: readonly Stage[] = level === 1 ? ["exposition", "climax", "resolution"] : STAGES;
  return textChoice(
    `Which part of the plot is this event? “${plot.events[i]}”`,
    stage,
    sample(
      options.filter((s) => s !== stage),
      wrongFor(level),
    ),
    STAGE_HINT[stage],
    lines(plot.events),
  );
}

function whichEvent(plot: { title: string; events: string[] }, stage: Stage, level: Level): Question {
  const i = STAGES.indexOf(stage);
  return textChoice(
    `In “${plot.title},” which event is the ${stage}?`,
    plot.events[i],
    sample(
      plot.events.filter((_, j) => j !== i),
      wrongFor(level),
    ),
    STAGE_HINT[stage],
  );
}

function orderPlot(plot: { title: string; events: string[] }): OrderQuestion {
  return {
    kind: "order",
    prompt: `Put the events of “${plot.title}” in order, from the exposition to the resolution.`,
    hint: "Start with the event that introduces the characters. End with how things turn out.",
    items: plot.events.map((label, i) => ({ id: `p${i}`, label })),
  };
}

function conflictQuestion(c: { kind: Conflict; text: string }): Question {
  return textChoice(
    "What type of conflict is this?",
    c.kind,
    CONFLICT_KINDS.filter((k) => k !== c.kind),
    CONFLICT_HINT[c.kind],
    lines(c.text),
  );
}

function povQuestion(p: { pov: Pov; text: string }, level: Level): Question {
  const options: Pov[] = level === 3 ? ["first person", "second person", "third person"] : ["first person", "third person"];
  return textChoice(
    "From which point of view is this sentence told?",
    p.pov,
    options.filter((o) => o !== p.pov),
    POV_HINT,
    lines(p.text),
  );
}

function plotUnit(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const [a, b, c] = sample(PLOTS, 3);
  const conflicts = spread(CONFLICTS, (x) => x.kind, 3).map(conflictQuestion);
  const terms = levelled(STORY_TERMS, level, 2).map((t) => ask(t, level));

  if (level === 1) {
    const stages = sample([0, 2, 4], 2).map((i) => stageQuestion(b, i, level));
    return [orderPlot(a), ...stages, ...shuffle([...terms, ...conflicts])];
  }

  if (level === 2) {
    const stages = sample([0, 1, 2, 3, 4], 2).map((i) => stageQuestion(b, i, level));
    const pov = povQuestion(pick(POVS.filter((p) => p.level === 2)), level);
    return [
      orderPlot(a),
      ...stages,
      whichEvent(c, "climax", level),
      ...shuffle([terms[0], ...conflicts.slice(0, 2), pov]),
    ];
  }

  const stages = sample([1, 2, 3], 2).map((i) => stageQuestion(a, i, level));
  const sort = sortQuestion(
    {
      prompt: "Sort each situation by its type of conflict.",
      hint: "Is the character struggling with another person, with nature, or with their own thoughts and feelings?",
      bins: CONFLICT_BINS,
      items: CONFLICTS.map((x) => ({ label: x.text, emoji: x.emoji, bin: x.kind })),
    },
    2,
  );
  const povs = spread(POVS, (p) => p.pov, 2).map((p) => povQuestion(p, level));
  return [
    ...stages,
    whichEvent(b, pick(["climax", "rising action", "falling action"] as Stage[]), level),
    ...shuffle([terms[0], conflicts[0], sort, ...povs]),
  ];
}

// ---------- 3. Figurative Language ----------

type Device = "simile" | "metaphor" | "personification" | "hyperbole" | "onomatopoeia" | "alliteration";

const BASIC_DEVICES: Device[] = ["simile", "metaphor", "personification", "onomatopoeia"];
const ALL_DEVICES: Device[] = [...BASIC_DEVICES, "hyperbole", "alliteration"];

const DEVICE_HINT: Record<Device, string> = {
  simile: "A simile compares two things using “like” or “as.”",
  metaphor: "A metaphor compares two things by saying one thing IS another, without “like” or “as.”",
  personification: "Personification gives human actions or feelings to something that isn't human.",
  hyperbole: "Hyperbole is a huge exaggeration that isn't meant to be taken literally.",
  onomatopoeia: "Onomatopoeia is a word that imitates a sound, like buzz, crash or sizzle.",
  alliteration: "Alliteration repeats the same beginning sound in several words close together.",
};

const FIGURES: { device: Device; level: Level; text: string }[] = [
  { device: "simile", level: 1, text: "The clouds were fluffy, like scoops of vanilla ice cream." },
  { device: "simile", level: 1, text: "The frosty grass sparkled like tiny diamonds." },
  { device: "simile", level: 2, text: "The old map was as fragile as a dry leaf." },
  { device: "simile", level: 2, text: "Lena's voice was as calm as a still pond." },
  { device: "simile", level: 3, text: "After swimming, Ravi stretched out on the warm dock like a seal." },
  { device: "metaphor", level: 1, text: "The snow was a thick blanket over the town." },
  { device: "metaphor", level: 1, text: "The calm lake was a mirror reflecting the trees." },
  { device: "metaphor", level: 2, text: "Kenji's notebook is a treasure chest of ideas." },
  { device: "metaphor", level: 2, text: "In summer, Grandpa's yard is a rainbow of flowers." },
  { device: "metaphor", level: 3, text: "At night, the highway was a glowing ribbon of car lights." },
  { device: "personification", level: 1, text: "The flowers danced in the breeze." },
  { device: "personification", level: 1, text: "The sun peeked out from behind the clouds." },
  { device: "personification", level: 2, text: "The old car refused to start on the cold morning." },
  { device: "personification", level: 2, text: "The stars winked at us from the dark sky." },
  { device: "personification", level: 3, text: "The hungry campfire swallowed the dry logs one by one." },
  { device: "onomatopoeia", level: 1, text: "Crash! The stack of plates hit the floor." },
  { device: "onomatopoeia", level: 1, text: "The bacon sizzled in the hot pan." },
  { device: "onomatopoeia", level: 2, text: "Splash! Lena jumped into the pool." },
  { device: "onomatopoeia", level: 2, text: "Beep! The microwave timer went off." },
  { device: "onomatopoeia", level: 3, text: "The logs crackled and popped in the fireplace." },
  { device: "hyperbole", level: 2, text: "I'm so hungry I could eat a mountain of pancakes." },
  { device: "hyperbole", level: 2, text: "My backpack weighs more than an elephant!" },
  { device: "hyperbole", level: 2, text: "I've told you a million times to close the door." },
  { device: "hyperbole", level: 3, text: "Our family stood in that line forever." },
  { device: "hyperbole", level: 3, text: "Zoe's smile was so bright it could light up the whole city." },
  { device: "alliteration", level: 2, text: "Seven slippery seals slid off the sunny rock." },
  { device: "alliteration", level: 2, text: "Priya picked a pail of plump purple plums." },
  { device: "alliteration", level: 2, text: "Gentle grey geese glided over the green grass." },
  { device: "alliteration", level: 3, text: "Tiny turtles tumbled toward the tide." },
  { device: "alliteration", level: 3, text: "Daring divers dove deep down into the dark water." },
];

const IDIOMS: { level: Level; text: string; phrase: string; right: string; wrong: string[]; hint: string }[] = [
  {
    level: 1,
    text: "That math quiz was a piece of cake.",
    phrase: "a piece of cake",
    right: "very easy",
    wrong: ["a kind of dessert", "very confusing", "very long"],
    hint: "An idiom doesn't mean exactly what its words say. Would a quiz really be cake? Think about how easy cake is to eat.",
  },
  {
    level: 1,
    text: "Amir is feeling under the weather today.",
    phrase: "under the weather",
    right: "a little sick",
    wrong: ["standing outside in the rain", "very excited", "ready for a test"],
    hint: "People say this when they stay home and rest. It isn't about real weather.",
  },
  {
    level: 1,
    text: "It's late, so it's time to hit the hay.",
    phrase: "hit the hay",
    right: "go to bed",
    wrong: ["feed the horses", "start a pillow fight", "clean the barn"],
    hint: "The sentence says it's late. What do people do when it's late?",
  },
  {
    level: 1,
    text: "Zoe was over the moon about her new puppy.",
    phrase: "over the moon",
    right: "extremely happy",
    wrong: ["confused", "floating in space", "a little worried"],
    hint: "How would you feel about a new puppy? Jumping over the moon would take a lot of joy!",
  },
  {
    level: 1,
    text: "Don't spill the beans about the surprise party!",
    phrase: "spill the beans",
    right: "tell the secret",
    wrong: ["drop your food", "arrive late", "forget the party"],
    hint: "A surprise party has to stay secret. What shouldn't you do?",
  },
  {
    level: 2,
    text: "Let's play a game to break the ice.",
    phrase: "break the ice",
    right: "help everyone feel comfortable together",
    wrong: ["smash frozen water", "end the party early", "start an argument"],
    hint: "People play a game at the start of a gathering when they don't know each other well yet.",
  },
  {
    level: 2,
    text: "Those concert tickets cost an arm and a leg.",
    phrase: "cost an arm and a leg",
    right: "were very expensive",
    wrong: ["were free", "were hard to find", "caused an injury"],
    hint: "Arms and legs are very valuable to you. So something that “costs” them must cost a lot!",
  },
  {
    level: 2,
    text: "It snows here only once in a blue moon.",
    phrase: "once in a blue moon",
    right: "very rarely",
    wrong: ["every night", "when the moon is full", "every winter"],
    hint: "A blue moon is something that hardly ever happens.",
  },
  {
    level: 2,
    text: "Ravi is on the fence about joining the choir.",
    phrase: "on the fence",
    right: "unable to decide",
    wrong: ["sitting outside", "very excited", "already a member"],
    hint: "Picture sitting on top of a fence, not on either side. Which side will Ravi choose?",
  },
  {
    level: 2,
    text: "Ana hit the books all weekend before her test.",
    phrase: "hit the books",
    right: "studied hard",
    wrong: ["knocked books off a shelf", "returned her library books", "forgot about the test"],
    hint: "She had a test coming up. What would she be doing with her books?",
  },
  {
    level: 2,
    text: "Jay is in hot water for forgetting his chores.",
    phrase: "in hot water",
    right: "in trouble",
    wrong: ["taking a bath", "feeling proud", "very busy"],
    hint: "What happens when you forget your chores?",
  },
  {
    level: 3,
    text: "Leo bit off more than he could chew when he joined four clubs.",
    phrase: "bit off more than he could chew",
    right: "took on more than he could handle",
    wrong: ["ate too much lunch", "chose the wrong clubs", "made new friends quickly"],
    hint: "Four clubs is a lot! Think about having too much in your mouth at once.",
  },
  {
    level: 3,
    text: "I've made my offer. Now the ball is in your court.",
    phrase: "the ball is in your court",
    right: "it's your turn to decide",
    wrong: ["you need to go play tennis", "the game is over", "you lost the ball"],
    hint: "In tennis, when the ball is on your side, it's your turn to act.",
  },
  {
    level: 3,
    text: "Priya got cold feet the night before her speech.",
    phrase: "got cold feet",
    right: "became nervous about doing it",
    wrong: ["forgot to wear socks", "felt very confident", "caught a cold"],
    hint: "How might someone feel the night before giving a speech?",
  },
  {
    level: 3,
    text: "Stop beating around the bush and tell me what happened.",
    phrase: "beating around the bush",
    right: "avoiding the main point",
    wrong: ["gardening carefully", "speaking too loudly", "telling the truth"],
    hint: "The speaker wants to hear what happened. What is the other person doing instead?",
  },
  {
    level: 3,
    text: "Kenji had to face the music after missing practice.",
    phrase: "face the music",
    right: "accept the consequences",
    wrong: ["play in the band", "listen to a song", "hide from the coach"],
    hint: "What happens when you miss practice? You have to deal with it.",
  },
];

const HYPERBOLE_MEANINGS: Item[] = [
  {
    level: 2,
    text: "I've told you a million times to close the door.",
    prompt: "What does this hyperbole really mean?",
    right: "I've told you many times.",
    wrong: ["I've told you exactly one million times.", "I've never told you.", "I told you once, quietly."],
    hint: "Hyperbole exaggerates. Nobody has said anything a million times, but they may have said it a lot!",
  },
  {
    level: 2,
    text: "My backpack weighs more than an elephant!",
    prompt: "What does this hyperbole really mean?",
    right: "My backpack is very heavy.",
    wrong: ["My backpack is as big as an elephant.", "My backpack is empty.", "My backpack is very light."],
    hint: "No backpack weighs more than an elephant. The speaker is exaggerating how heavy it feels.",
  },
  {
    level: 3,
    text: "Our family stood in that line forever.",
    prompt: "What does this hyperbole really mean?",
    right: "We waited a very long time.",
    wrong: ["We are still in line today.", "We waited a few seconds.", "We left the line right away."],
    hint: "They didn't really wait forever. What is the speaker exaggerating?",
  },
  {
    level: 3,
    text: "Noah's homework took about a thousand years to finish.",
    prompt: "What does this hyperbole really mean?",
    right: "Noah's homework took a very long time.",
    wrong: ["Noah's homework was finished quickly.", "Noah's homework was about history.", "Noah's homework was very easy."],
    hint: "Nobody lives for a thousand years! The speaker is exaggerating how long it felt.",
  },
];

const METAPHOR_PAIRS: Item[] = [
  {
    level: 3,
    text: "Kenji's notebook is a treasure chest of ideas.",
    prompt: "Which two things does this metaphor compare?",
    right: "a notebook and a treasure chest",
    wrong: ["Kenji and a pirate", "ideas and gold coins", "a notebook and a pencil"],
    hint: "Find the word “is.” The thing before it is being compared to the thing after it.",
  },
  {
    level: 3,
    text: "The calm lake was a mirror reflecting the trees.",
    prompt: "Which two things does this metaphor compare?",
    right: "a lake and a mirror",
    wrong: ["a mirror and the trees", "a lake and the sky", "the trees and the wind"],
    hint: "Find the word “was.” What is the lake said to be?",
  },
  {
    level: 3,
    text: "The snow was a thick blanket over the town.",
    prompt: "Which two things does this metaphor compare?",
    right: "snow and a blanket",
    wrong: ["a town and a bed", "snow and rain", "a blanket and a pillow"],
    hint: "Find the word “was.” What is the snow said to be?",
  },
  {
    level: 3,
    text: "At night, the highway was a glowing ribbon of car lights.",
    prompt: "Which two things does this metaphor compare?",
    right: "a highway and a ribbon",
    wrong: ["cars and the moon", "night and day", "a ribbon and a present"],
    hint: "Find the word “was.” What is the highway said to be?",
  },
];

function classifyFigure(f: { device: Device; text: string }, level: Level): Question {
  const options = level === 1 ? BASIC_DEVICES : ALL_DEVICES;
  return textChoice(
    "What kind of figurative language is this?",
    f.device,
    sample(
      options.filter((d) => d !== f.device),
      wrongFor(level),
    ),
    DEVICE_HINT[f.device],
    lines(f.text),
  );
}

function whichSentence(device: Device, level: Level): Question {
  const right = pick(FIGURES.filter((f) => f.device === device && f.level <= level));
  const others = sample(
    ALL_DEVICES.filter((d) => d !== device),
    wrongFor(level),
  );
  const wrong = others.map((d) => pick(FIGURES.filter((f) => f.device === d)).text);
  const name = device === "simile" || device === "metaphor" ? `a ${device}` : device;
  return textChoice(`Which sentence uses ${name}?`, right.text, wrong, DEVICE_HINT[device]);
}

function idiomQuestion(i: (typeof IDIOMS)[number], level: Level): Question {
  return textChoice(
    `What does the idiom “${i.phrase}” mean in this sentence?`,
    i.right,
    sample(i.wrong, wrongFor(level)),
    i.hint,
    lines(i.text),
  );
}

function figurative(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const byDevice = (f: { device: Device }) => f.device;
  if (level === 1) {
    const figs = spread(
      byLevel(
        FIGURES.filter((f) => f.level <= 2 && BASIC_DEVICES.includes(f.device)),
        1,
      ),
      byDevice,
      4,
    ).map((f) => classifyFigure(f, level));
    const idioms = sample(
      IDIOMS.filter((i) => i.level === 1),
      4,
    ).map((i) => idiomQuestion(i, level));
    return shuffle([...figs, ...idioms]);
  }
  if (level === 2) {
    const figs = spread(
      shuffle(FIGURES.filter((f) => f.level <= 2)),
      byDevice,
      3,
    ).map((f) => classifyFigure(f, level));
    const which = whichSentence(pick(ALL_DEVICES), level);
    const idioms = levelled(IDIOMS, 2, 2).map((i) => idiomQuestion(i, level));
    const hyper = sample(HYPERBOLE_MEANINGS, 2).map((h) => ask(h, level));
    return shuffle([...figs, which, ...idioms, ...hyper]);
  }
  const figs = spread(byLevel(FIGURES, 3), byDevice, 2).map((f) => classifyFigure(f, level));
  const which = sample(ALL_DEVICES, 2).map((d) => whichSentence(d, level));
  const idioms = levelled(IDIOMS, 3, 2).map((i) => idiomQuestion(i, level));
  return shuffle([...figs, ...which, ...idioms, ask(pick(METAPHOR_PAIRS), level), ask(pick(HYPERBOLE_MEANINGS), level)]);
}

// ---------- 4. Author's Purpose and Text Structure ----------

type Purpose = "to inform" | "to persuade" | "to entertain";
const PURPOSES: Purpose[] = ["to inform", "to persuade", "to entertain"];

const PURPOSE_HINT: Record<Purpose, string> = {
  "to inform": "Does the text teach facts or explain how to do something? Then its purpose is to inform.",
  "to persuade": "Is the author trying to get you to think, buy or do something? Then the purpose is to persuade.",
  "to entertain": "Is it a made-up story or something meant to be fun or funny? Then the purpose is to entertain.",
};

const PURPOSE_TEXTS: { purpose: Purpose; level: Level; text: string }[] = [
  {
    purpose: "to inform",
    level: 1,
    text: "The Pacific Ocean is the largest and deepest ocean on Earth. It covers about one-third of the planet's surface.",
  },
  {
    purpose: "to inform",
    level: 1,
    text: "To plant a bean seed, fill a pot with soil. Push the seed about two centimetres deep, then water it gently.",
  },
  {
    purpose: "to inform",
    level: 2,
    text: "Hummingbirds can flap their wings more than fifty times per second. This lets them hover in one spot while they drink nectar.",
  },
  {
    purpose: "to inform",
    level: 3,
    text: "Bats are the only mammals that can truly fly. Many bats find insects in the dark by making high sounds and listening for the echoes.",
  },
  {
    purpose: "to persuade",
    level: 1,
    text: "Every family should start a compost bin. It's easy, it cuts down on garbage, and it makes great soil for your garden!",
  },
  {
    purpose: "to persuade",
    level: 1,
    text: "Don't miss the best concert of the year! Tickets are going fast, so get yours today.",
  },
  {
    purpose: "to persuade",
    level: 2,
    text: "Our town needs a new skate park. Kids need a safe place to be active, and the old tennis courts are hardly used. Please sign our petition!",
  },
  {
    purpose: "to persuade",
    level: 3,
    text: "Imagine a lunchroom with no plastic wrappers in the garbage. If every student packed a reusable container, we could make that happen this year.",
  },
  {
    purpose: "to entertain",
    level: 1,
    text: "Gus the goat had one dream: to win the town's pie-baking contest. There was just one problem. Gus had no idea how to turn on an oven.",
  },
  {
    purpose: "to entertain",
    level: 1,
    text: "Once upon a time, a little cloud named Nimbus was too shy to rain.",
  },
  {
    purpose: "to entertain",
    level: 2,
    text: "“Who left their socks in the fridge?” Dad shouted. Everyone looked at the dog, and the dog looked at the ceiling.",
  },
  {
    purpose: "to entertain",
    level: 3,
    text: "The spaceship's map was upside down, which explained why Captain Ana had landed on a giant birthday cake instead of Mars.",
  },
];

const PURPOSE_SORT = {
  prompt: "Sort each text by the author's main purpose.",
  hint: "Inform = teach facts. Persuade = convince you. Entertain = tell a story or make you laugh.",
  bins: [
    { id: "inform", label: "Inform", emoji: "📘" },
    { id: "persuade", label: "Persuade", emoji: "📢" },
    { id: "entertain", label: "Entertain", emoji: "🎭" },
  ],
  items: [
    { label: "A news report about a new bike path", emoji: "📰", bin: "inform" },
    { label: "A science book about volcanoes", emoji: "🌋", bin: "inform" },
    { label: "Instructions for building a birdhouse", emoji: "🔨", bin: "inform" },
    { label: "A poster asking you to vote for Sam", emoji: "🗳️", bin: "persuade" },
    { label: "A TV ad for a new cereal", emoji: "📺", bin: "persuade" },
    { label: "A letter asking the city to build a park", emoji: "✉️", bin: "persuade" },
    { label: "A comic about a dog who wants to be an astronaut", emoji: "🐶", bin: "entertain" },
    { label: "A funny poem about a snowman", emoji: "⛄", bin: "entertain" },
    { label: "A mystery novel about a missing painting", emoji: "🔍", bin: "entertain" },
  ],
};

type Structure = "description" | "sequence" | "compare and contrast" | "cause and effect" | "problem and solution";
const STRUCTURES: Structure[] = ["description", "sequence", "compare and contrast", "cause and effect", "problem and solution"];

const STRUCTURE_HINT: Record<Structure, string> = {
  description: "The text describes one thing in detail: what it looks like, sounds like or feels like.",
  sequence: "Signal words like first, next, then and finally show steps or events in order.",
  "compare and contrast": "Words like both, however, while and unlike show how two things are alike and different.",
  "cause and effect": "Words like because, so and as a result show why something happened and what happened next.",
  "problem and solution": "The text names a problem and then explains how it was, or could be, solved.",
};

const SIGNALS: Record<Structure, string> = {
  description: "for example, such as, looks like",
  sequence: "first, next, then, finally",
  "compare and contrast": "both, however, unlike",
  "cause and effect": "because, so, as a result",
  "problem and solution": "the problem is, to fix this, one solution",
};

const STRUCTURE_TEXTS: { structure: Structure; level: Level; text: string }[] = [
  {
    structure: "compare and contrast",
    level: 1,
    text: "Frogs and toads are both amphibians, and both lay their eggs in water. However, frogs usually have smooth, damp skin, while toads have dry, bumpy skin. Frogs have long back legs for leaping, but toads have shorter legs for hopping.",
  },
  {
    structure: "compare and contrast",
    level: 2,
    text: "Ice hockey and soccer are both team sports where players try to score in a net. Unlike soccer, hockey is played on ice, and players use sticks to move a puck. Soccer players, on the other hand, mostly use their feet to move a ball.",
  },
  {
    structure: "compare and contrast",
    level: 3,
    text: "Alligators and crocodiles are both large reptiles that live near water. An alligator has a wide, U-shaped snout, while a crocodile's snout is narrower and V-shaped. Alligators are also usually darker in colour than crocodiles.",
  },
  {
    structure: "cause and effect",
    level: 1,
    text: "Heavy rain fell for three days. As a result, the river rose over its banks. Because the water covered several roads, schools in the area closed on Monday.",
  },
  {
    structure: "cause and effect",
    level: 2,
    text: "When the town planted hundreds of trees along Main Street, the street became much shadier. Because it was cooler, more people started walking there in the summer. As a result, the shops on Main Street had more visitors.",
  },
  {
    structure: "cause and effect",
    level: 3,
    text: "Beavers build dams across streams. The dams cause water to back up and form ponds. These ponds become new homes for fish, frogs and ducks, so one beaver family can change a whole habitat.",
  },
  {
    structure: "problem and solution",
    level: 1,
    text: "Our classroom had a problem: the recycling bin was always overflowing with paper. To fix this, we started writing on both sides of every sheet and saving scraps for art. Now the bin is only half full each week.",
  },
  {
    structure: "problem and solution",
    level: 2,
    text: "Many birds fly into large windows because they see the sky reflected in the glass. One solution is to put stickers or patterns on the window. The markings help birds see that the glass is a solid surface.",
  },
  {
    structure: "problem and solution",
    level: 3,
    text: "Every winter, the sidewalk outside the community centre turned icy, and people had trouble walking safely. The volunteers came up with a plan. They set out buckets of sand and asked everyone who passed by to sprinkle a scoop. Within days, the path was much safer.",
  },
  {
    structure: "sequence",
    level: 1,
    text: "First, a monarch caterpillar hatches from a tiny egg. Next, it eats milkweed leaves and grows for about two weeks. Then it forms a chrysalis. Finally, after about ten days, an adult butterfly comes out.",
  },
  {
    structure: "sequence",
    level: 2,
    text: "To make a paper airplane, start by folding a sheet of paper in half the long way. After that, fold the top corners down to the centre crease. Then fold each side down again to make the wings. Last, give it a gentle throw.",
  },
  {
    structure: "sequence",
    level: 3,
    text: "Early in the morning, the bakers mix flour, water and yeast. Later, they let the dough rise for two hours. In the afternoon, they shape the loaves and bake them. By evening, the shelves are full of fresh bread.",
  },
  {
    structure: "description",
    level: 1,
    text: "The giant Pacific octopus is the largest octopus in the world. Its soft body is reddish-brown, and it can change colour to blend in with rocks. Its eight long arms are covered in hundreds of suckers.",
  },
  {
    structure: "description",
    level: 2,
    text: "The desert at night is cool and quiet. Sand stretches in every direction, silver under the moon. Tall cacti stand still against the stars, and the air smells faintly of dust.",
  },
  {
    structure: "description",
    level: 3,
    text: "A snowy owl is a large owl with bright yellow eyes and a round head. Its thick white feathers cover even its toes, which keeps it warm in the Arctic. Dark speckles dot its wings and chest.",
  },
];

const TEXT_FEATURES: Item[] = [
  {
    level: 1,
    prompt: "Which text feature at the front of a book lists the chapters and their page numbers?",
    right: "table of contents",
    wrong: ["glossary", "index", "caption"],
    hint: "You check this at the very front of a book to see what each chapter is called and where it starts.",
  },
  {
    level: 1,
    prompt: "Which text feature tells you what a photo or picture shows?",
    right: "caption",
    wrong: ["glossary", "table of contents", "index"],
    hint: "Look for the small words printed right under or beside a picture.",
  },
  {
    level: 2,
    prompt: "In a nonfiction book, where would you look up the meaning of a word printed in bold?",
    right: "the glossary",
    wrong: ["the table of contents", "a caption", "a heading"],
    hint: "The glossary is like a small dictionary at the back of the book.",
  },
  {
    level: 2,
    prompt: "Which text feature at the back of a book lists topics in ABC order with page numbers?",
    right: "index",
    wrong: ["table of contents", "caption", "heading"],
    hint: "The index helps you find every page where a topic is mentioned.",
  },
  {
    level: 2,
    prompt: "Which text feature shows events along a line in the order they happened?",
    right: "timeline",
    wrong: ["glossary", "caption", "index"],
    hint: "Think of a line with dates marked along it, from earliest to latest.",
  },
  {
    level: 3,
    prompt: "Which text feature shows the parts of something using a drawing with labels?",
    right: "labelled diagram",
    wrong: ["timeline", "index", "table of contents"],
    hint: "Labels point to each part of a picture so you can see what it's called.",
  },
  {
    level: 3,
    prompt: "Which text feature, printed in large bold type, tells you what a section will be about?",
    right: "heading",
    wrong: ["caption", "glossary", "index"],
    hint: "It sits at the top of a section, like a title for that part of the text.",
  },
  {
    level: 3,
    prompt: "You want to find every page in a book that mentions volcanoes. Which text feature should you use?",
    right: "the index",
    wrong: ["the glossary", "a caption", "a timeline"],
    hint: "This feature at the back of the book lists topics with all the page numbers where they appear.",
  },
];

function purposeQuestion(p: (typeof PURPOSE_TEXTS)[number]): Question {
  return textChoice(
    "What is the author's main purpose?",
    p.purpose,
    PURPOSES.filter((x) => x !== p.purpose),
    PURPOSE_HINT[p.purpose],
    lines(p.text),
  );
}

function structureQuestion(s: (typeof STRUCTURE_TEXTS)[number], level: Level): Question {
  return textChoice(
    "How is this text organized?",
    s.structure,
    sample(
      STRUCTURES.filter((x) => x !== s.structure),
      wrongFor(level),
    ),
    STRUCTURE_HINT[s.structure],
    { type: "passage", paragraphs: [s.text] },
  );
}

function signalQuestion(s: Structure, level: Level): Question {
  return textChoice(
    `Which signal words often appear in a ${s} text?`,
    SIGNALS[s],
    sample(
      STRUCTURES.filter((x) => x !== s),
      wrongFor(level),
    ).map((x) => SIGNALS[x]),
    STRUCTURE_HINT[s],
  );
}

function purposeStructure(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const feature = ask(levelled(TEXT_FEATURES, level, 1)[0], level);
  const structures = spread(byLevel(STRUCTURE_TEXTS, level), (s) => s.structure, 3).map((s) => structureQuestion(s, level));
  const purposes = spread(byLevel(PURPOSE_TEXTS, level), (p) => p.purpose, level === 1 ? 3 : 2).map(purposeQuestion);
  if (level === 1) {
    return shuffle([...purposes, sortQuestion(PURPOSE_SORT, 2), ...structures, feature]);
  }
  if (level === 2) {
    return shuffle([...purposes, sortQuestion(PURPOSE_SORT, 2), ...structures, signalQuestion(pick(STRUCTURES), level), feature]);
  }
  const signals = sample(STRUCTURES, 2).map((s) => signalQuestion(s, level));
  return shuffle([...purposes, ...structures, ...signals, feature]);
}

// ---------- 5. Context Clues ----------

function clue(level: Level, text: string, word: string, right: string, wrong: string[], hint: string): Item {
  return { level, text, prompt: `What does “${word}” mean in this sentence?`, right, wrong, hint };
}

const CONTEXT_CLUES: Item[] = [
  clue(1, "The puppy was so drowsy after its long walk that it fell asleep on the mat.", "drowsy", "sleepy", ["hungry", "excited", "muddy"], "The puppy fell asleep. That's a big clue!"),
  clue(1, "The ancient castle was built more than eight hundred years ago.", "ancient", "very old", ["very tall", "brand new", "very small"], "Something built eight hundred years ago has been around a long time."),
  clue(1, "Leo was famished after the long hike, so he ate two sandwiches and an apple.", "famished", "very hungry", ["very tired", "very cold", "very lost"], "Look at what Leo did next: he ate a lot of food."),
  clue(1, "The glass vase is fragile, so please carry it carefully with both hands.", "fragile", "easy to break", ["very heavy", "brightly coloured", "full of water"], "Why would you need to carry glass carefully?"),
  clue(1, "Unlike her timid little brother, Ana was bold and spoke up right away.", "timid", "shy", ["loud", "tall", "funny"], "“Unlike” tells you timid is the opposite of bold and speaking up."),
  clue(1, "The hikers were exhausted, or very tired, after climbing all day.", "exhausted", "worn out", ["thrilled", "lost", "freezing"], "The meaning is given right after the word, between commas: “or very tired.”"),
  clue(2, "Water is scarce in the desert, so plants there store every drop they can.", "scarce", "hard to find", ["very cold", "salty", "everywhere"], "If plants must save every drop, is there a lot of water or only a little?"),
  clue(2, "The garden was full of vibrant flowers in bright reds, oranges and purples.", "vibrant", "bright and full of life", ["dull and faded", "tiny", "dried up"], "The sentence describes the colours as bright. What does that tell you?"),
  clue(2, "Priya was elated when she heard she had won the art contest; she jumped up and cheered.", "elated", "very happy", ["confused", "worried", "sleepy"], "She jumped up and cheered. How do people feel when they do that?"),
  clue(2, "Kenji was persistent. Even after his kite crashed six times, he kept trying until it flew.", "persistent", "not giving up", ["easily bored", "very careless", "always late"], "He kept trying after six crashes. What kind of person does that?"),
  clue(2, "The cautious cyclist slowed down and looked both ways before crossing the busy street.", "cautious", "careful", ["speedy", "forgetful", "noisy"], "Slowing down and looking both ways are things a careful person does."),
  clue(2, "Owls are nocturnal animals; they sleep during the day and hunt at night.", "nocturnal", "active at night", ["living in water", "eating only plants", "active in winter"], "The part after the semicolon explains when owls are awake."),
  clue(2, "The window was so transparent that the bird thought it was open sky.", "transparent", "clear enough to see through", ["covered in dirt", "painted blue", "very thick"], "The bird could see the sky through the window. What does that tell you about the glass?"),
  clue(2, "Instead of being stingy, Amir was generous and shared his snacks with the whole team.", "generous", "happy to share", ["unwilling to share", "always hungry", "very fast"], "Amir shared his snacks with everyone. “Instead of being stingy” points to the opposite of stingy."),
  clue(2, "The new apartment was spacious, with plenty of room for a piano and two bookcases.", "spacious", "having lots of room", ["very crowded", "very old", "close to school"], "Look at the words right after the comma: “plenty of room.”"),
  clue(3, "The old barn was dilapidated: its roof sagged, its boards were rotting and its doors hung loose.", "dilapidated", "falling apart", ["freshly painted", "very large", "full of animals"], "The details after the colon describe the barn's condition."),
  clue(3, "Many desert animals, such as camels, lizards and fennec foxes, are adapted to arid climates.", "arid", "very dry", ["very wet", "very cold", "very windy"], "These animals live in deserts. What is the weather like in a desert?"),
  clue(3, "Zoe tried to conceal the surprise gift by hiding it under a pile of towels.", "conceal", "hide", ["wrap", "open", "buy"], "The sentence tells you exactly what she did with the gift."),
  clue(3, "The diligent students worked carefully on their projects every day for a month.", "diligent", "hard-working", ["lazy", "noisy", "new"], "They worked carefully every day for a month. What kind of workers are they?"),
  clue(3, "The directions were so ambiguous that half the class went to the gym and the other half went to the library.", "ambiguous", "unclear", ["very short", "written in pencil", "easy to follow"], "If students understood the directions in two different ways, were the directions clear?"),
  clue(3, "After the long drought, the river was just a meagre trickle instead of a rushing stream.", "meagre", "small in amount", ["loud and fast", "deep and cold", "full of fish"], "A trickle is very little water, the opposite of a rushing stream."),
  clue(3, "Noah was baffled by the puzzle; he turned it around and around but could not figure it out.", "baffled", "confused", ["angry", "bored", "delighted"], "He couldn't figure it out. How does that feel?"),
  clue(3, "Maya hesitated at the edge of the creek, unsure whether the rocks were safe to step on.", "hesitated", "paused before acting", ["ran quickly", "shouted loudly", "fell asleep"], "She was unsure. What do people do when they aren't sure about stepping forward?"),
  clue(3, "The hungry hockey team devoured six pizzas in ten minutes, leaving only crumbs.", "devoured", "ate quickly and completely", ["cooked slowly", "shared politely", "threw away"], "Six pizzas in ten minutes, with only crumbs left. How did they eat?"),
];

const CLUE_TYPES = ["definition (the meaning is explained)", "antonym (an opposite is given)", "examples (examples are listed)"] as const;

function clueType(level: Level, text: string, word: string, type: 0 | 1 | 2, hint: string): Item {
  return {
    level,
    text,
    prompt: `What kind of context clue helps you understand “${word}”?`,
    right: CLUE_TYPES[type],
    wrong: CLUE_TYPES.filter((_, i) => i !== type),
    hint,
  };
}

const CLUE_TYPE_ITEMS: Item[] = [
  clueType(2, "A herbivore is an animal that eats only plants.", "herbivore", 0, "The sentence tells you exactly what a herbivore is."),
  clueType(2, "Lava, melted rock that flows out of a volcano, glows orange and red.", "lava", 0, "The words between the commas explain what lava is."),
  clueType(3, "The botanist, a scientist who studies plants, examined the rare flower.", "botanist", 0, "The words between the commas explain what a botanist is."),
  clueType(2, "Ana's room was always tidy, but her brother's room was cluttered.", "cluttered", 1, "“But” signals a contrast. Cluttered is the opposite of tidy."),
  clueType(3, "Unlike his cheerful sister, Leo was sullen all morning.", "sullen", 1, "“Unlike” signals a contrast. Sullen is the opposite of cheerful."),
  clueType(3, "The first puzzle was simple, but the second one was perplexing.", "perplexing", 1, "“But” signals a contrast with simple."),
  clueType(2, "Ravi loves citrus fruits, such as oranges, lemons and limes.", "citrus", 2, "“Such as” introduces a list of examples."),
  clueType(3, "Our town has many kinds of public transit, including buses, trains and ferries.", "transit", 2, "“Including” introduces a list of examples."),
  clueType(3, "Precipitation, such as rain, snow and hail, fell all week.", "precipitation", 2, "“Such as” introduces a list of examples."),
];

function meaning(level: Level, text: string, word: string, right: string, wrong: string[]): Item {
  return {
    level,
    text,
    prompt: `Which meaning of “${word}” is used in this sentence?`,
    right,
    wrong,
    hint: `“${word}” has more than one meaning. Read the whole sentence, then try each meaning in its place.`,
  };
}

const MULTI_MEANING: Item[] = [
  meaning(1, "The bat flew out of the cave at dusk.", "bat", "a small flying mammal", ["a stick for hitting a ball", "to blink your eyes"]),
  meaning(1, "Kenji will train for the race all summer.", "train", "to practise to get better", ["a line of railway cars", "the long back of a gown"]),
  meaning(1, "We sat on the bank of the river to watch the ducks.", "bank", "the land along the side of a river", ["a place that keeps money", "to tilt while turning"]),
  meaning(2, "The pitcher threw the ball across home plate.", "pitcher", "a baseball player who throws the ball", ["a jug for pouring drinks", "a person who sets up a tent"]),
  meaning(2, "Please file your worksheets in the blue folder.", "file", "to put in order and store", ["a tool for smoothing nails", "a line of people, one behind another"]),
  meaning(2, "Lena's grandmother knitted a scarf from soft blue yarn.", "yarn", "thread used for knitting", ["a long, made-up story", "a sailor's knot"]),
];

function contextClues(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const [nWords, nMulti, nTypes] = level === 1 ? [6, 2, 0] : level === 2 ? [5, 2, 1] : [6, 0, 2];
  const items = [
    ...levelled(CONTEXT_CLUES, level, nWords),
    ...sample(MULTI_MEANING, nMulti),
    ...levelled(CLUE_TYPE_ITEMS, level, nTypes),
  ];
  return shuffle(items.map((i) => ask(i, level)));
}

// ---------- 6. Greek and Latin Roots ----------

interface Root {
  root: string;
  meaning: string;
  /** Roots in the same group share a meaning, so they never appear as wrong answers for each other. */
  group: string;
  level: Level;
  examples: [string, string, string];
}

const ROOTS: Root[] = [
  { root: "tele", meaning: "far", group: "far", level: 1, examples: ["telephone", "telescope", "television"] },
  { root: "graph", meaning: "write or draw", group: "write", level: 1, examples: ["autograph", "paragraph", "photograph"] },
  { root: "port", meaning: "carry", group: "carry", level: 1, examples: ["transport", "portable", "export"] },
  { root: "aqua", meaning: "water", group: "water", level: 1, examples: ["aquarium", "aquatic", "aquamarine"] },
  { root: "bio", meaning: "life", group: "life", level: 1, examples: ["biology", "biography", "biome"] },
  { root: "micro", meaning: "small", group: "small", level: 1, examples: ["microscope", "microphone", "microwave"] },
  { root: "auto", meaning: "self", group: "self", level: 1, examples: ["autograph", "automatic", "autobiography"] },
  { root: "cycl", meaning: "circle or wheel", group: "circle", level: 1, examples: ["bicycle", "cyclone", "recycle"] },
  { root: "phon", meaning: "sound", group: "sound", level: 1, examples: ["telephone", "microphone", "symphony"] },
  { root: "geo", meaning: "earth", group: "earth", level: 1, examples: ["geography", "geology", "geode"] },
  { root: "struct", meaning: "build", group: "build", level: 2, examples: ["construct", "structure", "destruction"] },
  { root: "rupt", meaning: "break", group: "break", level: 2, examples: ["erupt", "interrupt", "rupture"] },
  { root: "dict", meaning: "say or speak", group: "say", level: 2, examples: ["dictionary", "predict", "contradict"] },
  { root: "spect", meaning: "look", group: "see", level: 2, examples: ["inspect", "spectator", "spectacular"] },
  { root: "scope", meaning: "look at", group: "see", level: 2, examples: ["telescope", "microscope", "periscope"] },
  { root: "vis", meaning: "see", group: "see", level: 2, examples: ["visible", "vision", "visual"] },
  { root: "aud", meaning: "hear", group: "sound", level: 2, examples: ["audience", "audio", "audible"] },
  { root: "photo", meaning: "light", group: "light", level: 2, examples: ["photograph", "photocopy", "photosynthesis"] },
  { root: "therm", meaning: "heat", group: "heat", level: 2, examples: ["thermometer", "thermal", "geothermal"] },
  { root: "ped", meaning: "foot", group: "foot", level: 2, examples: ["pedal", "pedestrian", "centipede"] },
  { root: "ject", meaning: "throw", group: "throw", level: 3, examples: ["eject", "project", "reject"] },
  { root: "tract", meaning: "pull", group: "pull", level: 3, examples: ["tractor", "attract", "subtract"] },
  { root: "terr", meaning: "land", group: "earth", level: 3, examples: ["territory", "terrain", "terrarium"] },
  { root: "chron", meaning: "time", group: "time", level: 3, examples: ["chronological", "chronicle", "synchronize"] },
  { root: "manu", meaning: "hand", group: "hand", level: 3, examples: ["manual", "manuscript", "manufacture"] },
  { root: "scrib", meaning: "write", group: "write", level: 3, examples: ["describe", "scribble", "inscribe"] },
  { root: "hydr", meaning: "water", group: "water", level: 3, examples: ["hydrant", "hydrate", "dehydrated"] },
  { root: "logy", meaning: "study of", group: "study", level: 3, examples: ["biology", "geology", "zoology"] },
  { root: "meter", meaning: "measure", group: "measure", level: 3, examples: ["thermometer", "speedometer", "barometer"] },
  { root: "mit", meaning: "send", group: "send", level: 3, examples: ["transmit", "submit", "emit"] },
];

const ROOT_BY_NAME = new Map(ROOTS.map((r) => [r.root, r]));

/** Words and every root (from ROOTS) hiding inside them. */
const ROOT_WORDS: { word: string; roots: string[] }[] = [
  { word: "telephone", roots: ["tele", "phon"] },
  { word: "telescope", roots: ["tele", "scope"] },
  { word: "television", roots: ["tele", "vis"] },
  { word: "autograph", roots: ["auto", "graph"] },
  { word: "paragraph", roots: ["graph"] },
  { word: "photograph", roots: ["photo", "graph"] },
  { word: "biography", roots: ["bio", "graph"] },
  { word: "geography", roots: ["geo", "graph"] },
  { word: "transport", roots: ["port"] },
  { word: "portable", roots: ["port"] },
  { word: "export", roots: ["port"] },
  { word: "aquarium", roots: ["aqua"] },
  { word: "aquatic", roots: ["aqua"] },
  { word: "biology", roots: ["bio", "logy"] },
  { word: "geology", roots: ["geo", "logy"] },
  { word: "zoology", roots: ["logy"] },
  { word: "microscope", roots: ["micro", "scope"] },
  { word: "microwave", roots: ["micro"] },
  { word: "microphone", roots: ["micro", "phon"] },
  { word: "automatic", roots: ["auto"] },
  { word: "bicycle", roots: ["cycl"] },
  { word: "recycle", roots: ["cycl"] },
  { word: "cyclone", roots: ["cycl"] },
  { word: "symphony", roots: ["phon"] },
  { word: "construct", roots: ["struct"] },
  { word: "structure", roots: ["struct"] },
  { word: "erupt", roots: ["rupt"] },
  { word: "interrupt", roots: ["rupt"] },
  { word: "dictionary", roots: ["dict"] },
  { word: "predict", roots: ["dict"] },
  { word: "inspect", roots: ["spect"] },
  { word: "spectator", roots: ["spect"] },
  { word: "visible", roots: ["vis"] },
  { word: "vision", roots: ["vis"] },
  { word: "audience", roots: ["aud"] },
  { word: "audible", roots: ["aud"] },
  { word: "photocopy", roots: ["photo"] },
  { word: "thermometer", roots: ["therm", "meter"] },
  { word: "thermal", roots: ["therm"] },
  { word: "speedometer", roots: ["meter"] },
  { word: "pedal", roots: ["ped"] },
  { word: "pedestrian", roots: ["ped"] },
  { word: "centipede", roots: ["ped"] },
  { word: "eject", roots: ["ject"] },
  { word: "project", roots: ["ject"] },
  { word: "tractor", roots: ["tract"] },
  { word: "attract", roots: ["tract"] },
  { word: "territory", roots: ["terr"] },
  { word: "terrain", roots: ["terr"] },
  { word: "chronological", roots: ["chron", "logy"] },
  { word: "manual", roots: ["manu"] },
  { word: "manuscript", roots: ["manu", "scrib"] },
  { word: "describe", roots: ["scrib"] },
  { word: "scribble", roots: ["scrib"] },
  { word: "hydrant", roots: ["hydr"] },
  { word: "dehydrated", roots: ["hydr"] },
  { word: "transmit", roots: ["mit"] },
  { word: "submit", roots: ["mit"] },
];

/** Words to figure out from their parts. */
const WORD_PARTS: { level: Level; word: string; parts: string; meaning: string }[] = [
  { level: 1, word: "telescope", parts: "tele (far) + scope (look at)", meaning: "a tool for seeing things that are far away" },
  { level: 1, word: "biology", parts: "bio (life) + logy (study of)", meaning: "the study of living things" },
  { level: 1, word: "autograph", parts: "auto (self) + graph (write)", meaning: "a person's own handwritten signature" },
  { level: 1, word: "portable", parts: "port (carry) + able (can be)", meaning: "easy to carry" },
  { level: 1, word: "aquatic", parts: "aqua (water) + tic (having to do with)", meaning: "living or growing in water" },
  { level: 1, word: "microscope", parts: "micro (small) + scope (look at)", meaning: "a tool for looking at very tiny things" },
  { level: 1, word: "bicycle", parts: "bi (two) + cycl (wheel)", meaning: "a vehicle with two wheels" },
  { level: 2, word: "geology", parts: "geo (earth) + logy (study of)", meaning: "the study of the earth and its rocks" },
  { level: 2, word: "audible", parts: "aud (hear) + ible (able to be)", meaning: "loud enough to be heard" },
  { level: 2, word: "visible", parts: "vis (see) + ible (able to be)", meaning: "able to be seen" },
  { level: 2, word: "interrupt", parts: "inter (between) + rupt (break)", meaning: "to break into a conversation or activity" },
  { level: 2, word: "predict", parts: "pre (before) + dict (say)", meaning: "to say what will happen before it happens" },
  { level: 2, word: "spectator", parts: "spect (look) + ator (one who)", meaning: "a person who watches an event" },
  { level: 2, word: "thermometer", parts: "therm (heat) + meter (measure)", meaning: "a tool that measures how hot or cold something is" },
  { level: 3, word: "pedestrian", parts: "ped (foot) + estrian (one who goes)", meaning: "a person travelling on foot" },
  { level: 3, word: "eject", parts: "e (out) + ject (throw)", meaning: "to throw or push something out" },
  { level: 3, word: "tractor", parts: "tract (pull) + or (thing that)", meaning: "a vehicle that pulls heavy loads" },
  { level: 3, word: "manual", parts: "manu (hand) + al (having to do with)", meaning: "done by hand" },
  { level: 3, word: "chronological", parts: "chron (time) + logical (in order)", meaning: "arranged in time order" },
  { level: 3, word: "transmit", parts: "trans (across) + mit (send)", meaning: "to send something from one place to another" },
  { level: 3, word: "dehydrated", parts: "de (remove) + hydr (water)", meaning: "having lost too much water" },
];

/** One root per group, never from `group`. */
function otherGroups(group: string, count: number, pool: readonly Root[]): Root[] {
  const seen = new Set([group]);
  const out: Root[] = [];
  for (const r of shuffle(pool)) {
    if (out.length >= count) break;
    if (seen.has(r.group)) continue;
    seen.add(r.group);
    out.push(r);
  }
  return out;
}

function rootMeaning(r: Root, level: Level): Question {
  return textChoice(
    `What does the root “${r.root}” mean?`,
    r.meaning,
    otherGroups(r.group, wrongFor(level), ROOTS).map((o) => o.meaning),
    `Think about what these words have in common: ${r.examples.join(", ")}. The root “${r.root}” means “${r.meaning}.”`,
    { type: "letter", text: r.root, caption: r.examples.join(" · ") },
  );
}

function findWord(r: Root, level: Level): Question {
  const words = ROOT_WORDS.filter((w) => w.roots.every((x) => ROOT_BY_NAME.get(x)!.level <= level));
  const right = pick(words.filter((w) => w.roots.includes(r.root)));
  const wrong = sample(
    words.filter((w) => !w.roots.some((x) => ROOT_BY_NAME.get(x)!.group === r.group)),
    wrongFor(level),
  );
  return textChoice(
    `Which word has a root that means “${r.meaning}”?`,
    right.word,
    wrong.map((w) => w.word),
    `The root “${r.root}” means “${r.meaning}.” Look for “${r.root}” hiding inside one of the words.`,
  );
}

function wordFromParts(w: (typeof WORD_PARTS)[number], level: Level): Question {
  return textChoice(
    `Use the word parts. What does “${w.word}” mean?`,
    w.meaning,
    sample(
      WORD_PARTS.filter((o) => o !== w),
      wrongFor(level),
    ).map((o) => o.meaning),
    `Put the meanings of the parts together: ${w.parts}.`,
    lines([w.word, w.parts]),
  );
}

function sharedRoot(r: Root, level: Level): Question {
  const pool = ROOTS.filter((o) => o !== r && !r.examples.some((e) => e.includes(o.root)));
  return textChoice(
    "Which root do all three words share?",
    r.root,
    sample(pool, wrongFor(level)).map((o) => o.root),
    `Look for the letters that appear in all three words. Then think: what do ${r.examples.join(", ")} have in common in meaning?`,
    lines(r.examples.join("   •   ")),
  );
}

function roots(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const allowed = ROOTS.filter((r) => r.level <= level);
  const [nMeaning, nFind, nParts, nShared] = level === 1 ? [3, 3, 2, 0] : level === 2 ? [3, 2, 2, 1] : [2, 2, 2, 2];
  const focus = levelled(allowed, level, nMeaning + nFind + nShared);
  return shuffle([
    ...focus.slice(0, nMeaning).map((r) => rootMeaning(r, level)),
    ...focus.slice(nMeaning, nMeaning + nFind).map((r) => findWord(r, level)),
    ...focus.slice(nMeaning + nFind).map((r) => sharedRoot(r, level)),
    ...levelled(WORD_PARTS, level, nParts).map((w) => wordFromParts(w, level)),
  ]);
}

// ---------- 7. Verb Tenses and Agreement ----------

function pastTense(level: Level, base: string, sentence: string, right: string, wrong: string[]): Item {
  return {
    level,
    text: sentence,
    prompt: `Which past-tense form of “${base}” completes the sentence?`,
    right,
    wrong,
    hint: `“${base}” is an irregular verb, so its past tense doesn't just add -ed. Today I ${base}; yesterday I ${right}.`,
  };
}

const IRREGULAR: Item[] = [
  pastTense(1, "bring", "Yesterday, Maya ____ her guitar to school.", "brought", ["bringed", "brang", "bring"]),
  pastTense(1, "catch", "Last week, Jay ____ the winning fly ball.", "caught", ["catched", "cought", "catch"]),
  pastTense(1, "write", "Yesterday, Leo ____ a letter to his grandmother.", "wrote", ["writed", "written", "write"]),
  pastTense(1, "go", "Yesterday, we ____ to the science museum.", "went", ["goed", "gone", "go"]),
  pastTense(1, "eat", "Last night, Sam ____ two bowls of soup.", "ate", ["eated", "eaten", "eat"]),
  pastTense(1, "ride", "On Saturday, Zoe ____ her bike to the library.", "rode", ["rided", "ridden", "ride"]),
  pastTense(1, "find", "Yesterday, Amir ____ his lost key under the couch.", "found", ["finded", "find", "finding"]),
  pastTense(1, "take", "This morning, Jay ____ the bus to school.", "took", ["taked", "taken", "take"]),
  pastTense(2, "swim", "Last summer, Priya ____ across the lake.", "swam", ["swimmed", "swammed", "swim"]),
  pastTense(2, "teach", "Last year, Mr. Haddad ____ our class how to play chess.", "taught", ["teached", "taughted", "teach"]),
  pastTense(2, "choose", "Last week, Amir ____ a book about volcanoes.", "chose", ["choosed", "chosen", "choose"]),
  pastTense(2, "think", "Yesterday, Ravi ____ about his science project all afternoon.", "thought", ["thinked", "thoughted", "think"]),
  pastTense(2, "buy", "Last weekend, Ana ____ a new pair of skates.", "bought", ["buyed", "brought", "buy"]),
  pastTense(2, "fly", "Yesterday, a hawk ____ over our school.", "flew", ["flyed", "flown", "fly"]),
  pastTense(2, "draw", "Last week, Kenji ____ a map of his neighbourhood.", "drew", ["drawed", "drawn", "draw"]),
  pastTense(2, "throw", "At recess yesterday, Noah ____ the ball to Sam.", "threw", ["throwed", "thrown", "through"]),
  pastTense(2, "keep", "Last year, Priya ____ a journal every day.", "kept", ["keeped", "kepted", "keep"]),
  pastTense(2, "wear", "Yesterday, Lena ____ her new raincoat.", "wore", ["weared", "worn", "wear"]),
  pastTense(3, "freeze", "The pond ____ solid during the cold snap last January.", "froze", ["freezed", "frozen", "frozed"]),
  pastTense(3, "grow", "Last summer, our sunflowers ____ taller than the fence.", "grew", ["growed", "grown", "grewed"]),
  pastTense(3, "shake", "After the rainstorm, the dog ____ water all over us.", "shook", ["shaked", "shaken", "shooked"]),
  pastTense(3, "hide", "Yesterday, Amir ____ the birthday present under his bed.", "hid", ["hided", "hidden", "hide"]),
  pastTense(3, "blow", "Last night, the wind ____ the recycling bin over.", "blew", ["blowed", "blown", "blue"]),
  pastTense(3, "know", "Last year, Zoe already ____ the names of all the provinces.", "knew", ["knowed", "known", "new"]),
  pastTense(3, "lead", "Yesterday, Ms. Diaz ____ our class on a nature walk.", "led", ["leaded", "lead", "leaden"]),
];

function agree(level: Level, sentence: string, right: string, wrong: string[], hint: string): Item {
  return { level, text: sentence, prompt: "Which verb agrees with the subject?", right, wrong, hint };
}

const AGREEMENT: Item[] = [
  agree(1, "The dogs in the park ____ at the squirrels.", "bark", ["barks", "barking"], "The subject is “dogs,” more than one. Plural subjects use the verb without -s."),
  agree(1, "My sister ____ the piano every evening.", "plays", ["play", "playing"], "The subject is “my sister,” just one person. One person takes a verb ending in -s."),
  agree(1, "Maya and Leo ____ to school together.", "walk", ["walks", "walking"], "“Maya and Leo” is two people, so use the plural verb (no -s)."),
  agree(1, "That robin ____ a nest in our tree every spring.", "builds", ["build", "building"], "The subject is one robin, so the verb ends in -s."),
  agree(1, "They ____ soccer after school.", "play", ["plays", "playing"], "“They” is plural, so the verb has no -s."),
  agree(1, "The baby ____ when she is hungry.", "cries", ["cry", "crys"], "One baby takes a verb ending in -s. For verbs ending in consonant + y, change y to i and add -es."),
  agree(2, "The box of crayons ____ on the shelf.", "is", ["are", "were"], "The subject is “box,” not “crayons.” One box needs “is.”"),
  agree(2, "Each of the students ____ a library card.", "has", ["have", "having"], "“Each” means each one, so it's singular and needs “has.”"),
  agree(2, "One of my friends ____ in a band.", "plays", ["play", "are playing"], "The subject is “one,” not “friends.” One person needs a verb ending in -s."),
  agree(2, "The flowers in the garden ____ blooming.", "are", ["is", "was"], "The subject is “flowers,” more than one, so use “are.”"),
  agree(2, "Everyone in our class ____ pizza day.", "loves", ["love", "are loving"], "“Everyone” is singular, so it takes a verb ending in -s."),
  agree(2, "The children on the bus ____ a song.", "sing", ["sings", "is singing"], "“Children” is plural, so the verb has no -s."),
  agree(3, "Neither Sam nor his cousins ____ been to the coast.", "have", ["has", "is"], "With “neither…nor,” the verb agrees with the closer subject: “cousins,” which is plural."),
  agree(3, "Either my parents or my aunt ____ picking us up today.", "is", ["are", "were"], "With “either…or,” the verb agrees with the closer subject: “my aunt,” which is singular."),
  agree(3, "There ____ three apples left in the bowl.", "are", ["is", "was"], "The subject comes after the verb here: “three apples.” That's plural."),
  agree(3, "Here ____ the books you asked for.", "are", ["is", "was"], "The subject comes after the verb: “the books.” That's plural."),
  agree(3, "The news about the field trip ____ exciting.", "is", ["are", "were"], "“News” looks plural but is singular, and the subject is “news,” not “field trip.”"),
  agree(3, "The students in Ms. Lee's class ____ planting a garden.", "are", ["is", "was"], "Ignore “in Ms. Lee's class.” The subject is “students,” which is plural."),
  agree(3, "Everybody on both teams ____ a medal.", "gets", ["get", "are getting"], "“Everybody” is singular, even though it describes many people."),
];

type Tense = "past" | "present" | "future";

const TENSE_HINT: Record<Tense, string> = {
  past: "Past tense tells about something that already happened, often with -ed or an irregular form.",
  present: "Present tense tells about something that happens now or happens regularly.",
  future: "Future tense tells about something that will happen, often using “will.”",
};

const TENSES: { level: Level; text: string; tense: Tense }[] = [
  { level: 1, text: "Our class will plant tulips next week.", tense: "future" },
  { level: 1, text: "The geese flew south last fall.", tense: "past" },
  { level: 1, text: "My brother walks the dog every morning.", tense: "present" },
  { level: 2, text: "The bus arrives at 8:15 each day.", tense: "present" },
  { level: 2, text: "Ravi will start piano lessons in January.", tense: "future" },
  { level: 2, text: "Lena painted a mural on the fence.", tense: "past" },
  { level: 3, text: "The river freezes over every winter.", tense: "present" },
  { level: 3, text: "By tomorrow night, the snow will melt.", tense: "future" },
  { level: 3, text: "We visited our cousins during the summer.", tense: "past" },
];

/** [subject, [past, present], middle, [past, present], end] */
const CONSISTENCY: [string, [string, string], string, [string, string], string][] = [
  ["Kenji", ["opened", "opens"], "the door and", ["walked", "walks"], "inside."],
  ["Lena", ["finished", "finishes"], "her homework and then", ["called", "calls"], "her friend."],
  ["The puppy", ["chased", "chases"], "the ball and", ["dropped", "drops"], "it at my feet."],
  ["Amir", ["grabbed", "grabs"], "his coat and", ["hurried", "hurries"], "to the bus stop."],
  ["Zoe", ["mixed", "mixes"], "the paint and", ["started", "starts"], "her mural."],
];

function tenseQuestion(t: (typeof TENSES)[number]): Question {
  return textChoice(
    "What is the tense of the verb in this sentence?",
    t.tense,
    (["past", "present", "future"] as Tense[]).filter((x) => x !== t.tense),
    TENSE_HINT[t.tense],
    lines(t.text),
  );
}

function consistencyQuestion([subj, v1, mid, v2, end]: (typeof CONSISTENCY)[number]): Question {
  const make = (a: string, b: string) => `${subj} ${a} ${mid} ${b} ${end}`;
  return textChoice(
    "Which sentence keeps the verb tense the same all the way through?",
    make(v1[0], v2[0]),
    [make(v1[0], v2[1]), make(v1[1], v2[0])],
    "Both actions happened at the same time, so both verbs should be in the same tense.",
  );
}

function verbs(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const [nPast, nAgree, nTense, nSame] = level === 1 ? [3, 3, 2, 0] : level === 2 ? [3, 3, 1, 1] : [3, 3, 0, 2];
  return shuffle([
    ...levelled(IRREGULAR, level, nPast).map((i) => ask(i, level)),
    ...levelled(AGREEMENT, level, nAgree).map((i) => ask(i, level)),
    ...spread(byLevel(TENSES, level), (t) => t.tense, nTense).map(tenseQuestion),
    ...sample(CONSISTENCY, nSame).map(consistencyQuestion),
  ]);
}

// ---------- 8. Complex Sentences ----------

function conj(level: Level, sentence: string, right: string, wrong: string[], hint: string): Item {
  return { level, text: sentence, prompt: "Which subordinating conjunction makes the most sense?", right, wrong, hint };
}

const CONJUNCTIONS: Item[] = [
  conj(1, "We stayed inside ____ it was pouring rain.", "because", ["although", "unless"], "The rain is the reason they stayed inside. Which word gives a reason?"),
  conj(1, "Brush your teeth ____ you go to bed.", "before", ["although", "unless"], "Which comes first, brushing or bed? Pick the word that shows time order."),
  conj(1, "Priya waited at the corner ____ the light turned green.", "until", ["although", "because"], "She waited, and then the light changed. Which word means “up to the time when”?"),
  conj(1, "Noah read a book ____ he waited for the dentist.", "while", ["unless", "although"], "Both things happened at the same time. Which word shows that?"),
  conj(1, "____ the bell rings, put your books away.", "When", ["Although", "Unless"], "The bell ringing tells you the time to put books away."),
  conj(2, "____ the movie was long, Kenji enjoyed every minute.", "Although", ["Because", "Until", "Unless"], "You might expect a long movie to be boring, but he enjoyed it. Which word shows a surprising contrast?"),
  conj(2, "You won't see the stars tonight ____ the clouds clear.", "unless", ["because", "although", "since"], "The stars will only show if the clouds go away. Which word means “if not”?"),
  conj(2, "____ you finish your chores, you can go to the park.", "If", ["Although", "Until", "Unless"], "Going to the park depends on finishing chores. Which word shows a condition?"),
  conj(2, "The team celebrated ____ they won the championship.", "after", ["unless", "although", "until"], "First they won, then they celebrated. Which word shows time order?"),
  conj(2, "Zoe kept practising ____ she could play the song perfectly.", "until", ["although", "unless", "since"], "She practised up to the point when she could play it perfectly."),
  conj(3, "____ Amir had never flown before, he felt nervous at the airport.", "Since", ["Although", "Unless", "Until"], "Never flying before is the reason he felt nervous. “Since” can mean “because.”"),
  conj(3, "Lena wore her raincoat ____ the sky was clear.", "even though", ["because", "so that", "since"], "Wearing a raincoat on a clear day is surprising. Which choice shows contrast?"),
  conj(3, "____ the wind was so strong, the sailboats stayed in the harbour.", "Because", ["Although", "Unless", "Until"], "The strong wind is the reason the boats stayed in. Which word shows a cause?"),
  conj(3, "Leave the cookies on the tray ____ they cool down.", "until", ["although", "because", "unless"], "The cookies stay on the tray up to the time they cool."),
  conj(3, "Jay finished his project early ____ he could help his friends.", "so that", ["although", "unless", "until"], "Helping his friends was his purpose. Which choice shows purpose?"),
  conj(3, "____ Ravi practised every day, he still found the song tricky.", "Although", ["Because", "Since", "Unless"], "Practising every day should make it easy, but it was still tricky. That's a contrast."),
];

/** A dependent clause, an independent clause, and whether the dependent clause comes first. */
const CLAUSES: { dep: string; ind: string; first: boolean }[] = [
  { dep: "because the bus was late", ind: "we missed the start of the assembly", first: false },
  { dep: "after the snow melted", ind: "the first crocuses bloomed", first: true },
  { dep: "although Leo was tired", ind: "he finished his chapter", first: true },
  { dep: "when the timer beeped", ind: "Ana took the muffins out of the oven", first: true },
  { dep: "if it is sunny on Saturday", ind: "we will go to the beach", first: true },
  { dep: "while the kettle heated up", ind: "Ravi set the table", first: true },
  { dep: "until the rain stopped", ind: "the hikers waited under a tree", first: false },
  { dep: "before the game started", ind: "the players stretched", first: false },
  { dep: "since the library was closed", ind: "Maya studied at home", first: false },
  { dep: "unless you water them", ind: "the plants will wilt", first: false },
];

const clauseSentence = (c: (typeof CLAUSES)[number]): string =>
  c.first ? `${capitalize(c.dep)}, ${c.ind}.` : `${capitalize(c.ind)} ${c.dep}.`;

const CLAUSE_HINT =
  "A dependent clause starts with a word like because, when, if or although. It can't stand alone as a sentence. The independent clause can.";

function dependentQuestion(c: (typeof CLAUSES)[number]): Question {
  return textChoice("Which part of this sentence is the dependent clause?", c.dep, [c.ind], CLAUSE_HINT, lines(clauseSentence(c)));
}

function independentQuestion(c: (typeof CLAUSES)[number]): Question {
  return textChoice(
    "Which part of this sentence could stand alone as a complete sentence?",
    c.ind,
    [c.dep],
    CLAUSE_HINT,
    lines(clauseSentence(c)),
  );
}

function findConjunction(c: (typeof CLAUSES)[number], level: Level): Question {
  const word = c.dep.split(" ")[0];
  const others = [...new Set(`${c.dep} ${c.ind}`.split(" ").filter((w) => w.length >= 4 && w !== word))];
  return textChoice(
    "Which word is the subordinating conjunction?",
    word,
    sample(others, wrongFor(level)),
    "A subordinating conjunction begins the dependent clause and links it to the rest of the sentence.",
    lines(clauseSentence(c)),
  );
}

type SentenceType = "simple sentence" | "compound sentence" | "complex sentence";

const SENTENCE_TYPE_HINT: Record<SentenceType, string> = {
  "simple sentence": "A simple sentence has just one independent clause (one subject–verb idea), even if it has two subjects or two verbs.",
  "compound sentence": "A compound sentence joins two independent clauses with a comma and a word like and, but, or or so.",
  "complex sentence": "A complex sentence has an independent clause plus a dependent clause that starts with a word like because, when or although.",
};

const SENTENCE_TYPES: { level: Level; text: string; type: SentenceType }[] = [
  { level: 1, text: "My cat sleeps on the windowsill.", type: "simple sentence" },
  { level: 1, text: "The wind blew the leaves across the yard.", type: "simple sentence" },
  { level: 3, text: "Kenji and his dad built a birdhouse.", type: "simple sentence" },
  { level: 3, text: "After lunch, the class went to the gym.", type: "simple sentence" },
  { level: 3, text: "Zoe sang and danced in the school play.", type: "simple sentence" },
  { level: 1, text: "Lena wanted to swim, but the pool was closed.", type: "compound sentence" },
  { level: 2, text: "We can walk to the park, or we can ride our bikes.", type: "compound sentence" },
  { level: 2, text: "Sam finished his project, so he helped his friend.", type: "compound sentence" },
  { level: 3, text: "The wind blew hard, and the leaves scattered across the yard.", type: "compound sentence" },
  { level: 1, text: "Lena couldn't swim because the pool was closed.", type: "complex sentence" },
  { level: 1, text: "When the wind blew, the leaves scattered across the yard.", type: "complex sentence" },
  { level: 2, text: "Although the hill was steep, Ana rode her bike to the top.", type: "complex sentence" },
  { level: 3, text: "We will leave for the park after we eat lunch.", type: "complex sentence" },
];

function sentenceTypeQuestion(s: (typeof SENTENCE_TYPES)[number]): Question {
  return textChoice(
    "What kind of sentence is this?",
    s.type,
    (["simple sentence", "compound sentence", "complex sentence"] as SentenceType[]).filter((t) => t !== s.type),
    SENTENCE_TYPE_HINT[s.type],
    lines(s.text),
  );
}

function combine(level: Level, a: string, b: string, word: string, right: string, wrong: string[]): Item {
  return {
    level,
    text: [a, b],
    prompt: `Which sentence correctly combines these two sentences using “${word}”?`,
    right,
    wrong,
    hint: "The combined sentence must make sense, and when the dependent clause comes first, a comma goes right after it.",
  };
}

const COMBINE: Item[] = [
  combine(2, "Noah wore a hat.", "The sun was very strong.", "because", "Noah wore a hat because the sun was very strong.", [
    "The sun was very strong because Noah wore a hat.",
    "Because Noah wore a hat the sun was very strong.",
    "Noah wore, a hat because the sun was very strong.",
  ]),
  combine(2, "The movie ended.", "We walked home.", "after", "After the movie ended, we walked home.", [
    "After the movie ended we, walked home.",
    "After, the movie ended we walked home.",
    "We walked home, after. The movie ended.",
  ]),
  combine(2, "The trail was muddy.", "We finished the hike.", "although", "Although the trail was muddy, we finished the hike.", [
    "Although the trail was muddy we, finished the hike.",
    "Although, the trail was muddy we finished the hike.",
    "The trail was muddy although. We finished the hike.",
  ]),
  combine(3, "You practise every day.", "Your skating will improve.", "if", "If you practise every day, your skating will improve.", [
    "If your skating will improve, you practise every day.",
    "If you practise every day your, skating will improve.",
    "You practise every day if. Your skating will improve.",
  ]),
  combine(3, "Ravi was nervous.", "He gave a great speech.", "although", "Although Ravi was nervous, he gave a great speech.", [
    "Ravi was nervous although, he gave a great speech.",
    "Although Ravi was nervous he gave, a great speech.",
    "Although. Ravi was nervous, he gave a great speech.",
  ]),
  combine(3, "The power went out.", "We played board games by candlelight.", "when", "When the power went out, we played board games by candlelight.", [
    "When we played board games by candlelight, the power went out.",
    "When the power went out we played, board games by candlelight.",
    "When, the power went out we played board games by candlelight.",
  ]),
];

function complexSentences(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const conjunctions = levelled(CONJUNCTIONS, level, level === 1 ? 3 : 2).map((i) => ask(i, level));
  const clauses = sample(CLAUSES, 3);
  const types = spread(byLevel(SENTENCE_TYPES, level), (s) => s.type, 2).map(sentenceTypeQuestion);
  if (level === 1) return shuffle([...conjunctions, ...clauses.map(dependentQuestion), ...types]);
  const combines = levelled(COMBINE, level, level === 2 ? 1 : 2).map((i) => ask(i, level));
  if (level === 2) {
    return shuffle([
      ...conjunctions,
      dependentQuestion(clauses[0]),
      independentQuestion(clauses[1]),
      findConjunction(clauses[2], level),
      ...types,
      ...combines,
    ]);
  }
  return shuffle([...conjunctions, independentQuestion(clauses[0]), findConjunction(clauses[1], level), ...types, ...combines]);
}

// ---------- 9. Punctuation Power ----------

const CORRECT = "Which sentence is punctuated correctly?";

function punct(level: Level, right: string, wrong: string[], hint: string, prompt = CORRECT, text?: string): Item {
  return { level, prompt, right, wrong, hint, text };
}

const PUNCTUATION: Item[] = [
  // Commas after introductory words and in direct address
  punct(1, "Yes, I would like to join the team.", ["Yes I, would like to join the team.", "Yes I would like, to join the team.", "Yes I would like to join, the team."], "Put a comma right after an introductory word like yes, no or well."),
  punct(1, "After school, we walked to the library.", ["After, school we walked to the library.", "After school we, walked to the library.", "After school we walked, to the library."], "Put the comma right after the introductory phrase “After school.”"),
  punct(1, "Sam, please close the window.", ["Sam please, close the window.", "Sam please close, the window.", "Sam please close the, window."], "When you speak directly to someone by name, put a comma right after their name."),
  punct(2, "However, the bus was late.", ["However the, bus was late.", "However the bus, was late.", "However the bus was, late."], "Put a comma right after a transition word like however."),
  punct(2, "When the rain stopped, we went outside.", ["When the rain, stopped we went outside.", "When, the rain stopped we went outside.", "When the rain stopped we, went outside."], "Put the comma at the end of the whole introductory clause, “When the rain stopped.”"),
  // Commas in a list
  punct(1, "We packed apples, crackers, cheese and water.", ["We packed, apples crackers cheese and water.", "We packed apples crackers, cheese, and, water.", "We, packed apples crackers cheese and water."], "Use commas to separate the items in a list, not between the verb and the list."),
  // Colons
  punct(1, "The movie starts at 7:30.", ["The movie starts at 7,30.", "The movie starts at 7;30."], "A colon separates the hours from the minutes when you write the time.", "Which sentence writes the time correctly?"),
  punct(2, "Bring three things to class: a pencil, an eraser and a ruler.", ["Bring three things to class; a pencil, an eraser and a ruler.", "Bring: three things to class a pencil, an eraser and a ruler.", "Bring three things: to class a pencil, an eraser and a ruler."], "A colon comes after a complete sentence to introduce a list."),
  punct(2, "Our garden grows four vegetables: beans, peas, carrots and squash.", ["Our garden grows: four vegetables beans, peas, carrots and squash.", "Our garden grows four vegetables, beans: peas, carrots and squash.", "Our garden: grows four vegetables beans, peas, carrots and squash."], "A colon comes right before the list begins, after a complete sentence."),
  punct(2, "The recipe needs only three ingredients: flour, water and salt.", ["The recipe needs: only three ingredients flour, water and salt.", "The recipe needs only three ingredients flour: water and salt.", "The recipe: needs only three ingredients flour, water and salt."], "A colon comes right before the list begins, after a complete sentence."),
  punct(3, "Before the trip, pack these items: a hat, sunscreen and a water bottle.", ["Before the trip pack, these items: a hat, sunscreen and a water bottle.", "Before the trip, pack: these items a hat, sunscreen and a water bottle.", "Before, the trip pack these items; a hat, sunscreen and a water bottle."], "Use a comma after the introductory phrase, and a colon right before the list."),
  // Apostrophes: possession
  punct(1, "the girl's bike", ["the girls bike", "the girls' bike"], "For one owner, add 's to the end of the word.", "Which shows a bike that belongs to one girl?"),
  punct(1, "the bird's nest", ["the birds nest", "the birds' nest"], "For one owner, add 's to the end of the word.", "Which shows a nest that belongs to one bird?"),
  punct(2, "the students' classroom", ["the student's classroom", "the students classroom", "the students's classroom"], "For a plural word that already ends in s, just add an apostrophe after the s.", "Which shows a classroom that belongs to many students?"),
  punct(2, "the children's toys", ["the childrens' toys", "the childrens toys", "the childrens's toys"], "“Children” is already plural and doesn't end in s, so add 's.", "Which shows toys that belong to the children?"),
  punct(2, "the dogs' ball", ["the dog's ball", "the dogs ball", "the dogs's ball"], "For a plural word that already ends in s, just add an apostrophe after the s.", "Which shows a ball that belongs to several dogs?"),
  // Apostrophes: contractions
  punct(1, "don't", ["do'nt", "dont'", "dont"], "The apostrophe goes where the missing letter was: do + not = don't (the o in not is gone).", "Which is the correct contraction for “do not”?"),
  punct(1, "shouldn't", ["should'nt", "shouldnt'", "shouldnt"], "The apostrophe takes the place of the missing o in “not.”", "Which is the correct contraction for “should not”?"),
  punct(2, "they're", ["their", "theyr'e", "there"], "The apostrophe replaces the missing a in “are”: they + are = they're.", "Which is the correct contraction for “they are”?"),
  // Its/it's and their/there/they're
  punct(3, "its", ["it's", "its'"], "“It's” always means “it is.” The cat's paw belongs to it, so use “its” with no apostrophe.", "Which word correctly completes the sentence?", "The cat licked ____ paw."),
  punct(3, "It's", ["Its", "Its'"], "Try “it is” in the blank: “It is going to snow tonight.” That works, so use “It's.”", "Which word correctly completes the sentence?", "____ going to snow tonight."),
  punct(3, "Their", ["There", "They're"], "“Their” shows that something belongs to them.", "Which word correctly completes the sentence?", "____ coats are hanging by the door."),
  punct(3, "there", ["their", "they're"], "“There” tells about a place. (Hint: it has “here” inside it!)", "Which word correctly completes the sentence?", "Put the boxes over ____."),
  punct(3, "They're", ["Their", "There"], "Try “they are” in the blank: “They are leaving at noon.” That works, so use “They're.”", "Which word correctly completes the sentence?", "____ leaving for the airport at noon."),
  // Quotation marks
  punct(3, "“Let's go to the park,” said Priya.", ["“Let's go to the park, said Priya.”", "Let's go to the park,” said Priya.", "“Let's go to the park” said, Priya."], "Put quotation marks around only the words that are spoken. The comma goes inside the closing quotation mark."),
  punct(3, "Jay asked, “Where is my backpack?”", ["Jay asked, “Where is my backpack”?", "Jay asked “Where, is my backpack?”", "Jay asked, Where is my backpack?”"], "Quotation marks go around the exact words spoken. The question mark belongs to the question, so it goes inside."),
  // Compound sentences
  punct(3, "Kenji wanted to play outside, but it was raining.", ["Kenji wanted to play outside but, it was raining.", "Kenji wanted, to play outside but it was raining.", "Kenji, wanted to play outside but it was raining."], "In a compound sentence, the comma goes before the joining word (and, but, so)."),
];

/** Which rule an item practises, so each set mixes several rules. */
const punctKind = (i: Item): string =>
  i.prompt.includes("contraction")
    ? "contraction"
    : i.prompt.startsWith("Which shows")
      ? "possessive"
      : i.text
        ? "homophone"
        : i.right.includes("“")
          ? "quotes"
          : i.right.includes(":")
            ? "colon"
            : "comma";

function punctuation(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const pool = PUNCTUATION.filter((i) => i.level <= level + 1);
  return spread(byLevel(pool, level), punctKind, 8).map((i) => ask(i, level));
}

// ---------- 10. Media Smarts ----------

type Technique = "bandwagon" | "testimonial" | "exaggeration" | "emotional appeal" | "repetition" | "facts and figures";

const TECHNIQUE_LEVEL: Record<Technique, Level> = {
  bandwagon: 1,
  testimonial: 1,
  exaggeration: 1,
  "emotional appeal": 2,
  repetition: 2,
  "facts and figures": 3,
};
const TECHNIQUES = Object.keys(TECHNIQUE_LEVEL) as Technique[];

const TECHNIQUE_HINT: Record<Technique, string> = {
  bandwagon: "Bandwagon says everyone is doing it, so you should join in too.",
  testimonial: "A testimonial uses a famous or trusted person to say they like the product.",
  exaggeration: "Exaggeration makes claims so big they can't possibly be true.",
  "emotional appeal": "An emotional appeal tries to make you feel something strong, like love, worry or excitement.",
  repetition: "Repetition says the same word or slogan again and again so you'll remember it.",
  "facts and figures": "Facts and figures use numbers and measurements to make a product sound convincing.",
};

const ADS: { technique: Technique; text: string }[] = [
  { technique: "bandwagon", text: "Everyone at school is reading this book. Don't be the only one who hasn't!" },
  { technique: "bandwagon", text: "All your friends already have light-up sneakers. Get yours today!" },
  { technique: "bandwagon", text: "Join all the families in town who start their day with this cereal!" },
  { technique: "testimonial", text: "“I eat these granola bars before every game,” says a famous hockey star." },
  { technique: "testimonial", text: "A popular singer says, “This toothpaste gives me my bright smile.”" },
  { technique: "testimonial", text: "“I take this backpack on every climb,” says a well-known mountain climber." },
  { technique: "exaggeration", text: "This backpack is so strong it will last forever!" },
  { technique: "exaggeration", text: "The most delicious pizza in the entire universe!" },
  { technique: "exaggeration", text: "These running shoes will make you faster than a race car!" },
  { technique: "emotional appeal", text: "Puppies at the shelter are waiting for a loving home. Will you give one a family?" },
  { technique: "emotional appeal", text: "Imagine your whole family laughing together on game night. This board game brings you closer." },
  { technique: "emotional appeal", text: "Don't let your grandparents feel lonely. Call them every week with this easy video phone." },
  { technique: "repetition", text: "Fresh, fresh, fresh! Our bread is always fresh!" },
  { technique: "repetition", text: "Crunchy crackers. Crunchy fun. Crunchy every time!" },
  { technique: "repetition", text: "Clean teeth. Clean smile. Clean start!" },
  { technique: "facts and figures", text: "This water bottle keeps drinks cold for 24 hours and holds 750 mL." },
  { technique: "facts and figures", text: "This bike helmet passed 12 safety tests and weighs only 300 grams." },
  { technique: "facts and figures", text: "Our juice now has 30% less sugar than before." },
];

const TECHNIQUE_DEFS: Record<Technique, string> = {
  bandwagon: "Which technique tries to convince you because “everyone is doing it”?",
  testimonial: "Which technique uses a famous or trusted person to sell a product?",
  exaggeration: "Which technique makes claims so big they can't be true?",
  "emotional appeal": "Which technique tries to make you feel a strong emotion, like love or worry?",
  repetition: "Which technique repeats a word or slogan so you'll remember it?",
  "facts and figures": "Which technique uses numbers and data to seem convincing?",
};

/** Pairs on the same topic: [fact, opinion]. */
const FACT_OPINION: { emoji: string; fact: string; opinion: string }[] = [
  { emoji: "🚲", fact: "This bike has 21 gears.", opinion: "This is the coolest bike ever." },
  { emoji: "🎲", fact: "The game is for ages 8 and up.", opinion: "This game is the most fun you'll ever have." },
  { emoji: "🥣", fact: "The cereal box holds 500 grams.", opinion: "Our cereal tastes better than any other." },
  { emoji: "🏪", fact: "The store opens at 9:00 a.m.", opinion: "Our store has the friendliest staff in town." },
  { emoji: "🧥", fact: "This jacket comes in three colours.", opinion: "This jacket looks amazing on everyone." },
  { emoji: "📖", fact: "The book has 240 pages.", opinion: "This is the best book of the year." },
];

const MEDIA_THINKING: Item[] = [
  {
    level: 1,
    prompt: "What is the main goal of most advertisements?",
    right: "to get people to buy or do something",
    wrong: ["to teach a science lesson", "to share the news of the day", "to tell a true story about the past"],
    hint: "Companies pay for ads. What do they hope you'll do after seeing one?",
  },
  {
    level: 1,
    prompt: "An ad says a toy is “the best toy in the world.” Why should you be careful?",
    right: "It's an opinion that can't be proven.",
    wrong: ["It's a fact that has been checked.", "Toys can't be sold in stores.", "The ad is too short."],
    hint: "Can anyone measure or check which toy is “the best”? That makes it an opinion.",
  },
  {
    level: 2,
    prompt: "An ad says a famous athlete loves a certain cereal. What's the best question to ask?",
    right: "Was the athlete paid to say this?",
    wrong: ["What is the athlete's favourite colour?", "How tall is the athlete?", "Does the box have a picture on it?"],
    hint: "Think about why a famous person might appear in an ad.",
  },
  {
    level: 2,
    prompt: "An ad shows kids laughing as they play a new video game. It plays during a cartoon show. Who is the target audience?",
    right: "kids",
    wrong: ["grandparents", "business owners", "farmers"],
    hint: "Who watches cartoon shows, and who is shown having fun in the ad?",
  },
  {
    level: 3,
    prompt: "An ad says, “Everyone has one!” What's the smartest thing to ask yourself?",
    right: "Is that really true, and do I actually need it?",
    wrong: ["How fast can I buy one?", "Which colour do my friends have?", "Why don't I have two?"],
    hint: "Bandwagon ads want you to follow the crowd without thinking. Stop and check the claim.",
  },
  {
    level: 3,
    prompt: "Why might an ad use a famous person instead of an ordinary one?",
    right: "People may admire them and want to copy them.",
    wrong: ["Famous people always know which products work best.", "Ordinary people aren't allowed in ads.", "Famous people make products cheaper."],
    hint: "Think about how people feel about stars they admire.",
  },
  {
    level: 3,
    prompt: "A snack ad shows only how tasty the snack is and never mentions that it's very high in sugar. What is the ad doing?",
    right: "leaving out information that might change your mind",
    wrong: ["giving a complete and balanced picture", "using a testimonial", "telling a story just for fun"],
    hint: "Ads choose what to show you, and what not to show you.",
  },
];

function techniqueQuestion(ad: (typeof ADS)[number], level: Level): Question {
  const options = TECHNIQUES.filter((t) => TECHNIQUE_LEVEL[t] <= level && t !== ad.technique);
  return textChoice(
    "Which persuasive technique does this ad use?",
    ad.technique,
    sample(options, wrongFor(level)),
    TECHNIQUE_HINT[ad.technique],
    lines(ad.text),
  );
}

function definitionQuestion(t: Technique, level: Level): Question {
  const options = TECHNIQUES.filter((x) => TECHNIQUE_LEVEL[x] <= Math.max(level, 2) && x !== t);
  return textChoice(TECHNIQUE_DEFS[t], t, sample(options, wrongFor(level)), TECHNIQUE_HINT[t]);
}

function factPick(level: Level): Question {
  const [main, ...rest] = sample(FACT_OPINION, wrongFor(level) + 1);
  return textChoice(
    "Which statement from an ad is a fact that could be checked?",
    main.fact,
    rest.map((r) => r.opinion),
    "A fact can be measured, counted or checked. Words like best, coolest and amazing usually signal an opinion.",
  );
}

function factSort(perBin: number) {
  return sortQuestion(
    {
      prompt: "Sort these ad statements into facts and opinions.",
      hint: "A fact can be checked or measured. An opinion is what someone thinks or feels.",
      bins: [
        { id: "fact", label: "Fact", emoji: "📏" },
        { id: "opinion", label: "Opinion", emoji: "💬" },
      ],
      items: FACT_OPINION.flatMap((p) => [
        { label: p.fact, emoji: p.emoji, bin: "fact" },
        { label: p.opinion, emoji: p.emoji, bin: "opinion" },
      ]),
    },
    perBin,
  );
}

function media(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const ads = (count: number) =>
    spread(
      shuffle(ADS.filter((a) => TECHNIQUE_LEVEL[a.technique] <= level)),
      (a) => a.technique,
      count,
    ).map((a) => techniqueQuestion(a, level));
  const thinking = levelled(MEDIA_THINKING, level, level === 3 ? 2 : 1).map((i) => ask(i, level));
  if (level === 1) {
    const defs = sample(
      TECHNIQUES.filter((t) => TECHNIQUE_LEVEL[t] === 1),
      2,
    ).map((t) => definitionQuestion(t, level));
    return shuffle([...ads(4), ...defs, factSort(2), ...thinking]);
  }
  if (level === 2) {
    const def = definitionQuestion(pick(TECHNIQUES.filter((t) => TECHNIQUE_LEVEL[t] <= 2)), level);
    return shuffle([...ads(4), def, factSort(3), factPick(level), ...thinking]);
  }
  const def = definitionQuestion(pick(TECHNIQUES), level);
  return shuffle([...ads(3), def, factSort(3), factPick(level), ...thinking]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "5",
  subject: "language",
  bigIdeas: {
    "ca-bc": [
      "Language and story can be a source of creativity and joy.",
      "Exploring stories and other texts helps us understand ourselves and make connections to others and to the world.",
      "Using language in creative and playful ways helps us understand how language works.",
      "Questioning what we hear, read, and view contributes to our ability to be educated and engaged citizens.",
      "Developing our understanding of how language works allows us to use it purposefully.",
    ],
  },
  units: [
    {
      id: "reading-detectives",
      title: "Reading Detectives",
      emoji: "🔎",
      blurb: "Theme, inference and summaries",
      standards: {
        "ca-bc":
          "Reading strategies (inferring, summarizing, finding the main idea) and literary elements such as theme and character; forms and genres of text including stories, poems and nonfiction",
      },
      parentNote:
        "Reading original stories, a poem and nonfiction passages, then finding the theme and main idea, making inferences, describing characters, summarizing and working out word meanings.",
      generate: reading,
    },
    {
      id: "plot-and-conflict",
      title: "Plot and Conflict",
      emoji: "🎢",
      blurb: "How stories rise and fall",
      standards: {
        "ca-bc":
          "Literary elements: plot (exposition, rising action, climax, falling action, resolution), conflict, protagonist and antagonist, and point of view",
      },
      parentNote:
        "The five parts of a plot, types of conflict (person vs. person, nature or self), and telling first-, second- and third-person point of view apart.",
      generate: plotUnit,
    },
    {
      id: "figurative-language",
      title: "Figurative Language",
      emoji: "🎨",
      blurb: "Similes, metaphors, idioms and more",
      standards: {
        "ca-bc": "Literary devices: simile, metaphor, personification, hyperbole, idiom, onomatopoeia and alliteration",
      },
      parentNote:
        "Spotting similes, metaphors, personification, hyperbole, onomatopoeia and alliteration, and explaining what common idioms really mean.",
      generate: figurative,
    },
    {
      id: "purpose-and-structure",
      title: "Purpose and Structure",
      emoji: "🧭",
      blurb: "Why and how authors write",
      standards: {
        "ca-bc":
          "Forms, functions and genres of text; text features; text structures (description, sequence, compare and contrast, cause and effect, problem and solution)",
      },
      parentNote:
        "Deciding whether a text informs, persuades or entertains, recognizing five common text structures and their signal words, and using text features like the glossary and index.",
      generate: purposeStructure,
    },
    {
      id: "context-clues",
      title: "Context Clues",
      emoji: "🧩",
      blurb: "Crack the meaning of new words",
      standards: {
        "ca-bc":
          "Reading and metacognitive strategies: using context clues (definition, antonym, examples) to work out unfamiliar and multiple-meaning words",
      },
      parentNote:
        "Using the words around an unfamiliar word to figure out what it means, naming the type of clue, and choosing the right meaning of words like “bat” or “bank.”",
      generate: contextClues,
    },
    {
      id: "word-roots",
      title: "Greek and Latin Roots",
      emoji: "🌱",
      blurb: "Word parts that unlock meaning",
      standards: {
        "ca-bc": "Language features: word patterns and word families, including Greek and Latin roots (tele, graph, port, bio, struct, rupt…)",
      },
      parentNote:
        "Learning common Greek and Latin roots (like tele = far, port = carry, rupt = break) and using them to figure out long words such as “spectator” or “interrupt.”",
      generate: roots,
    },
    {
      id: "verb-tenses",
      title: "Verb Tenses",
      emoji: "⏳",
      blurb: "Past, present, future and agreement",
      standards: {
        "ca-bc": "Language features, structures and conventions: verb tenses, irregular verbs, consistent tense and subject–verb agreement",
      },
      parentNote:
        "Choosing irregular past-tense verbs (brought, swam, froze), making verbs agree with their subjects, naming tenses and keeping tense consistent within a sentence.",
      generate: verbs,
    },
    {
      id: "complex-sentences",
      title: "Complex Sentences",
      emoji: "🔗",
      blurb: "Clauses and conjunctions",
      standards: {
        "ca-bc":
          "Language features, structures and conventions: sentence structure (simple, compound, complex), independent and dependent clauses, subordinating conjunctions; writing processes",
      },
      parentNote:
        "Choosing conjunctions like although, because and unless, finding dependent and independent clauses, telling simple, compound and complex sentences apart, and combining sentences.",
      generate: complexSentences,
    },
    {
      id: "punctuation-power",
      title: "Punctuation Power",
      emoji: "✒️",
      blurb: "Commas, colons and apostrophes",
      standards: {
        "ca-bc": "Conventions: commas (introductory words, lists, direct address), colons, apostrophes (possessives and contractions) and quotation marks",
      },
      parentNote:
        "Placing commas after introductory words, using colons before lists, writing possessives and contractions, choosing its/it's and their/there/they're, and punctuating dialogue.",
      generate: punctuation,
    },
    {
      id: "media-smarts",
      title: "Media Smarts",
      emoji: "📺",
      blurb: "See through persuasive ads",
      standards: {
        "ca-bc":
          "Persuasive techniques in media (bandwagon, testimonial, exaggeration, emotional appeal, repetition, facts and figures); questioning what we read and view; fact and opinion",
      },
      parentNote:
        "Spotting the tricks ads use, telling facts from opinions, and asking smart questions about who made a message and why.",
      generate: media,
    },
  ],
};
