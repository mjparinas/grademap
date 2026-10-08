import { sortQuestion, type SortSet } from "../../bank";
import { chance, pick, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, Visual } from "../../types";

type Level = 1 | 2 | 3;

const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

/** A hand-written multiple-choice question: `right` is correct. */
interface Item {
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
}

/** One sentence shown in a reading card. */
const line = (text: string): Visual => ({ type: "story", lines: [text] });

const ask = (it: Item, visual?: Visual): Question => textChoice(it.prompt, it.right, it.wrong, it.hint, visual);

// ---------- Read and Think (reading comprehension) ----------

interface Passage {
  level: Level;
  title: string;
  paragraphs: string[];
  questions: Item[];
  /** Events or steps in the order they happen, for a sequencing question. */
  events?: string[];
}

const PASSAGES: Passage[] = [
  // ----- Level 1 -----
  {
    level: 1,
    title: "The Lost Mitten",
    paragraphs: [
      "On a snowy morning, Priya walked to school with her little brother, Dev. Dev was wearing his new red mittens.",
      "At recess, Dev ran up to Priya. He had only one mitten! His other hand was cold and pink.",
      "Priya and Dev looked by the slide. They looked under the bench. Then Priya saw something red poking out of a snowbank. It was the mitten!",
      "Dev pulled it on and smiled. “Thanks for helping me look,” he said.",
    ],
    questions: [
      {
        prompt: "Who lost a mitten?",
        right: "Dev",
        wrong: ["Priya", "Their teacher"],
        hint: "Read the second paragraph. Who had only one mitten?",
      },
      {
        prompt: "Where did Priya find the mitten?",
        right: "In a snowbank",
        wrong: ["Under the bench", "By the slide"],
        hint: "They looked in a few places. Where did Priya see something red poking out?",
      },
      {
        prompt: "What colour were Dev's mittens?",
        right: "Red",
        wrong: ["Pink", "Blue"],
        hint: "Look at the first paragraph. It tells you about Dev's new mittens.",
      },
      {
        prompt: "Why was Dev's hand cold?",
        right: "He lost one of his mittens.",
        wrong: ["He was holding a snowball.", "He left his coat at home."],
        hint: "Dev had only one mitten. What was his other hand missing?",
      },
      {
        prompt: "How did Dev feel at the end of the story?",
        right: "Happy and thankful",
        wrong: ["Cold and grumpy", "Scared and worried"],
        hint: "Dev smiled and said thanks. What feelings do those clues show?",
      },
      {
        prompt: "What is this story mostly about?",
        right: "Finding a lost mitten",
        wrong: ["Building a snowman", "Playing on the slide"],
        hint: "Think about the whole story, not just one part. What problem did Priya and Dev solve?",
      },
    ],
    events: [
      "Dev wore his new mittens to school.",
      "Dev lost a mitten at recess.",
      "Priya and Dev looked by the slide.",
      "Priya found the mitten in a snowbank.",
    ],
  },
  {
    level: 1,
    title: "Busy Beavers",
    paragraphs: [
      "Beavers are animals that live in and near ponds and streams. They have thick brown fur and a wide, flat tail.",
      "Beavers have strong front teeth. They use their teeth to chew through branches and even whole trees!",
      "Beavers use sticks and mud to build a home called a lodge. The door to the lodge is under the water. This helps keep the beavers safe.",
    ],
    questions: [
      {
        prompt: "What does the passage call a beaver's home?",
        right: "A lodge",
        wrong: ["A nest", "A hive"],
        hint: "Look at the last paragraph. It names the home that beavers build.",
      },
      {
        prompt: "What do beavers use to chew through trees?",
        right: "Their strong front teeth",
        wrong: ["Their wide, flat tail", "Their thick brown fur"],
        hint: "Read the second paragraph. What do beavers chew with?",
      },
      {
        prompt: "What does a beaver's tail look like?",
        right: "Wide and flat",
        wrong: ["Long and thin", "Short and fluffy"],
        hint: "The first paragraph describes the beaver's fur and tail.",
      },
      {
        prompt: "What is this passage mostly about?",
        right: "How beavers live and build",
        wrong: ["How to swim in a pond", "Why trees grow tall"],
        hint: "Every paragraph tells something about beavers. What is the big idea?",
      },
      {
        prompt: "Why is the door to the lodge under the water?",
        right: "It helps keep the beavers safe.",
        wrong: ["It lets the sun shine in.", "It helps the lodge float."],
        hint: "Read the last two sentences of the passage.",
      },
      {
        prompt: "In the passage, what does “chew” mean?",
        right: "Bite again and again",
        wrong: ["Swim very fast", "Build with mud"],
        hint: "Beavers use their teeth to chew. What do teeth do?",
      },
      {
        prompt: "Is this passage fiction or non-fiction?",
        right: "Non-fiction: it teaches real facts",
        wrong: ["Fiction: it is a made-up story", "A poem that rhymes"],
        hint: "Does it tell a made-up story, or does it teach true facts about a real animal?",
      },
    ],
  },
  {
    level: 1,
    title: "Pepper the Class Pet",
    paragraphs: [
      "Ms. Ortiz's class has a pet guinea pig named Pepper. Each week, a different student helps take care of her.",
      "This week it was Amir's turn. Every morning, he gave Pepper fresh water and some crunchy carrots. On Friday morning, he cleaned her cage.",
      "On Friday afternoon, Pepper squeaked loudly whenever Amir walked by. “I think she is saying thank you,” Ms. Ortiz laughed.",
    ],
    questions: [
      {
        prompt: "What kind of animal is Pepper?",
        right: "A guinea pig",
        wrong: ["A hamster", "A rabbit"],
        hint: "Look at the very first sentence.",
      },
      {
        prompt: "Whose turn was it to take care of Pepper?",
        right: "Amir's",
        wrong: ["Ms. Ortiz's", "Zoe's"],
        hint: "Read the second paragraph. Whose turn was it this week?",
      },
      {
        prompt: "What did Amir give Pepper every morning?",
        right: "Fresh water and carrots",
        wrong: ["Apples and lettuce", "A new toy"],
        hint: "Find the words “every morning” in the passage.",
      },
      {
        prompt: "When did Amir clean the cage?",
        right: "On Friday morning",
        wrong: ["Every morning", "On Friday afternoon"],
        hint: "Look for the word “cleaned” in the second paragraph.",
      },
      {
        prompt: "Why did Ms. Ortiz think Pepper was saying thank you?",
        right: "Pepper squeaked whenever Amir walked by.",
        wrong: ["Pepper ate all of her carrots.", "Pepper fell asleep in her cage."],
        hint: "What did Pepper do on Friday afternoon when Amir came near?",
      },
      {
        prompt: "What is the main idea of this story?",
        right: "Amir takes good care of the class pet.",
        wrong: ["Pepper runs away from the classroom.", "Ms. Ortiz buys a new pet."],
        hint: "Think about what most of the story tells about.",
      },
    ],
    events: [
      "Amir's week to care for Pepper started.",
      "Amir cleaned Pepper's cage on Friday morning.",
      "Pepper squeaked at Amir.",
      "Ms. Ortiz said Pepper was saying thank you.",
    ],
  },
  // ----- Level 2 -----
  {
    level: 2,
    title: "The Indoor Picnic",
    paragraphs: [
      "Zoe and her grandpa had planned a picnic at the park for Saturday. But when Zoe woke up, rain was drumming on her window.",
      "“Our picnic is ruined,” Zoe sighed, pressing her nose against the cold glass.",
      "Grandpa smiled. “Who says a picnic has to be outside?” He spread a blanket on the living room floor. Zoe packed sandwiches, grapes and lemonade into the basket, just as they had planned.",
      "They ate on the blanket and listened to the rain. After lunch, they built a blanket fort and read stories inside it. “This was even better than the park,” Zoe said with a grin.",
    ],
    questions: [
      {
        prompt: "What was the problem in this story?",
        right: "Rain spoiled their plan for a picnic at the park.",
        wrong: ["Zoe forgot to pack the sandwiches.", "Grandpa lost the picnic blanket."],
        hint: "What went wrong at the very beginning of the story?",
      },
      {
        prompt: "How did Zoe feel when she first saw the rain?",
        right: "Disappointed",
        wrong: ["Excited", "Proud"],
        hint: "Zoe sighed and said the picnic was ruined. What feeling do those clues show?",
      },
      {
        prompt: "Where did Zoe and Grandpa have their picnic?",
        right: "On the living room floor",
        wrong: ["At the park", "On the front steps"],
        hint: "Read the third paragraph. Where did Grandpa spread the blanket?",
      },
      {
        prompt: "The rain was “drumming” on the window. What does that tell you?",
        right: "The rain was tapping hard and loudly.",
        wrong: ["Someone was playing a drum.", "The rain had stopped."],
        hint: "Think about the sound a drum makes. How would rain sound if it was drumming?",
      },
      {
        prompt: "What did Zoe and Grandpa do after lunch?",
        right: "Built a blanket fort and read stories",
        wrong: ["Walked to the park", "Baked cookies"],
        hint: "Find the words “After lunch” in the last paragraph.",
      },
      {
        prompt: "What lesson does this story show?",
        right: "A change of plans can still be fun.",
        wrong: ["Picnics are only fun at the park.", "Always stay inside on Saturdays."],
        hint: "Zoe thought the day was ruined, but how did she feel at the end?",
      },
    ],
    events: [
      "Zoe saw rain on her window.",
      "Grandpa spread a blanket on the floor.",
      "Zoe and Grandpa ate their picnic.",
      "Zoe and Grandpa built a blanket fort.",
    ],
  },
  {
    level: 2,
    title: "From Tree to Syrup",
    paragraphs: [
      "Maple syrup comes from the sap of maple trees. Sap is a clear, watery liquid that moves through a tree.",
      "In early spring, the nights are still freezing, but the days are warmer. This is when sap flows best. People drill a small hole in the tree's trunk and put in a spout called a tap. The sap drips out into a bucket or flows through a tube.",
      "Fresh sap is only a little bit sweet. It must be boiled for a long time so that most of the water goes away. It takes about 40 litres of sap to make just 1 litre of maple syrup!",
    ],
    questions: [
      {
        prompt: "What is this passage mostly about?",
        right: "How maple syrup is made",
        wrong: ["Why maple leaves change colour", "How to plant a maple tree"],
        hint: "The title is a clue. What does each paragraph explain?",
      },
      {
        prompt: "When does sap flow best?",
        right: "In early spring",
        wrong: ["In the middle of summer", "In late fall"],
        hint: "Read the start of the second paragraph.",
      },
      {
        prompt: "In this passage, what is a tap?",
        right: "A spout put into a tree",
        wrong: ["A kind of bucket", "A sweet liquid"],
        hint: "Find the word “tap.” The words right before it explain what it is.",
      },
      {
        prompt: "Why is the sap boiled for a long time?",
        right: "So most of the water goes away",
        wrong: ["So the tree grows faster", "So the sap turns clear"],
        hint: "Read the last paragraph. It tells why the sap is boiled.",
      },
      {
        prompt: "About how much sap does it take to make 1 litre of syrup?",
        right: "About 40 litres",
        wrong: ["About 4 litres", "About 1 litre"],
        hint: "Look for a number in the last sentence.",
      },
      {
        prompt: "Which word from the passage means a clear, watery liquid inside a tree?",
        right: "sap",
        wrong: ["syrup", "spout"],
        hint: "The first paragraph tells what this word means.",
      },
      {
        prompt: "Is this passage fiction or non-fiction?",
        right: "Non-fiction: it teaches real facts",
        wrong: ["Fiction: it is a made-up story", "A poem that rhymes"],
        hint: "Does it tell a made-up story, or does it explain how something really happens?",
      },
    ],
    events: ["Drill a small hole in the tree.", "Put in a tap.", "Collect the sap.", "Boil the sap for a long time."],
  },
  {
    level: 2,
    title: "Ravi's Rocks",
    paragraphs: [
      "Ravi was going to share his rock collection at show and tell on Monday. All weekend, his stomach felt fluttery whenever he thought about talking in front of the whole class.",
      "On Sunday, Ravi practised his talk for his mom. Then he practised for his little sister. Last of all, he practised for the cat, who yawned. Each time, Ravi spoke a little more clearly.",
      "On Monday, Ravi held up a shiny piece of quartz. His voice wobbled at first, but then he remembered his practice. He told the class where he had found each rock. When he finished, so many hands went up with questions that the bell rang before he could answer them all.",
    ],
    questions: [
      {
        prompt: "Why did Ravi's stomach feel fluttery?",
        right: "He was nervous about talking to the class.",
        wrong: ["He ate too much breakfast.", "He lost one of his rocks."],
        hint: "His stomach felt fluttery when he thought about talking in front of the class. What feeling is that?",
      },
      {
        prompt: "Who did Ravi practise for last?",
        right: "The cat",
        wrong: ["His mom", "His little sister"],
        hint: "Look for the words “Last of all” in the second paragraph.",
      },
      {
        prompt: "What did Ravi share at show and tell?",
        right: "His rock collection",
        wrong: ["His pet cat", "A book about rocks"],
        hint: "Read the first sentence of the story.",
      },
      {
        prompt: "What helped Ravi speak clearly on Monday?",
        right: "Remembering his practice",
        wrong: ["Reading from a book", "Having his mom talk for him"],
        hint: "His voice wobbled at first. What did he remember?",
      },
      {
        prompt: "How can you tell the class liked Ravi's talk?",
        right: "Many classmates had questions.",
        wrong: ["The bell rang.", "Ravi's voice wobbled."],
        hint: "When people enjoy a talk, they often want to know more. What did the class do?",
      },
      {
        prompt: "In this story, what does “wobbled” mean?",
        right: "Shook a little",
        wrong: ["Got very loud", "Stopped completely"],
        hint: "Ravi was nervous. How might a nervous voice sound at first?",
      },
    ],
    events: [
      "Ravi practised for his mom.",
      "Ravi practised for his little sister.",
      "Ravi practised for the cat.",
      "Ravi held up a piece of quartz.",
    ],
  },
  // ----- Level 3 -----
  {
    level: 3,
    title: "The Arctic Fox",
    paragraphs: [
      "The Arctic fox lives in the far north, where winters are long and very cold. To survive there, this small fox has special features called adaptations.",
      "In winter, the Arctic fox grows a thick white coat. The white fur helps it blend in with the snow, so it can sneak up on its prey. In summer, the fox sheds its winter coat. Its new, thinner coat is brown or grey, which matches the rocks and plants.",
      "The Arctic fox also has fur on the bottoms of its paws, which keeps its feet warm on snow and ice. When it sleeps, it curls up and wraps its bushy tail around its body like a blanket.",
      "Food can be hard to find in winter. Sometimes an Arctic fox follows a polar bear and eats the scraps the bear leaves behind.",
    ],
    questions: [
      {
        prompt: "What is the main idea of this passage?",
        right: "The Arctic fox has adaptations that help it live in the cold.",
        wrong: ["Arctic foxes and polar bears are best friends.", "Arctic foxes change colour to look pretty."],
        hint: "The main idea fits the whole passage, not just one paragraph. Look at the first paragraph for a clue.",
      },
      {
        prompt: "Using clues in the passage, what is an adaptation?",
        right: "A special feature that helps an animal survive",
        wrong: ["A warm coat that people wear", "The place where an animal lives"],
        hint: "The first paragraph explains this word right before it is used.",
      },
      {
        prompt: "Why is the fox's summer coat brown or grey?",
        right: "To match the rocks and plants",
        wrong: ["To stay warm in the snow", "To scare away polar bears"],
        hint: "Read the end of the second paragraph.",
      },
      {
        prompt: "How does the Arctic fox keep its feet warm?",
        right: "It has fur on the bottoms of its paws.",
        wrong: ["It walks only on warm rocks.", "It sleeps all winter long."],
        hint: "Read the third paragraph about the fox's paws.",
      },
      {
        prompt: "The author says the fox's tail is like a blanket. What does this mean?",
        right: "The tail keeps the fox warm.",
        wrong: ["The tail is made of cloth.", "The tail is very heavy."],
        hint: "Think about what a blanket does for you at night.",
      },
      {
        prompt: "Why might an Arctic fox follow a polar bear?",
        right: "To eat food scraps the bear leaves behind",
        wrong: ["To play with the bear", "To keep the bear warm"],
        hint: "Read the last paragraph. Why is winter hard for the fox?",
      },
      {
        prompt: "What does “sheds” mean in this passage?",
        right: "Loses or drops",
        wrong: ["Grows bigger", "Hides under"],
        hint: "In summer the fox sheds its winter coat, and a new, thinner coat grows in. What happens to the old one?",
      },
    ],
  },
  {
    level: 3,
    title: "The Tallest Tower",
    paragraphs: [
      "Every spring, Lena's school held a building challenge. This year, each team had to build the tallest tower they could, using only paper cups and tape. Lena and Noah were on the same team, but they could not agree on anything.",
      "“We should make it as tall and skinny as possible,” Noah insisted. Lena shook her head. “If it's too skinny, it will topple over,” she warned.",
      "Noah built his skinny tower anyway. When it reached his shoulders, it began to sway. Then it crashed to the floor, and cups rolled everywhere.",
      "Noah's cheeks turned red. “Maybe we should try your idea,” he mumbled. Together, they built a wide, sturdy base and made the tower narrower as it went up. Their tower did not win first place, but it was still standing when the timer buzzed, and they were proud of it.",
    ],
    questions: [
      {
        prompt: "What problem did Lena and Noah have at the start?",
        right: "They could not agree on how to build.",
        wrong: ["They ran out of paper cups.", "They were put on different teams."],
        hint: "Read the last sentence of the first paragraph.",
      },
      {
        prompt: "What does “topple” most likely mean?",
        right: "Fall over",
        wrong: ["Grow taller", "Spin around"],
        hint: "Lena warned the skinny tower would topple. What happened to Noah's skinny tower later?",
      },
      {
        prompt: "Why did Noah's cheeks turn red?",
        right: "He felt embarrassed that his tower fell.",
        wrong: ["He was cold from the wind.", "He had just run a race."],
        hint: "His tower had just crashed, and he mumbled that they should try Lena's idea. How did he feel?",
      },
      {
        prompt: "How did the team solve their problem?",
        right: "They worked together using Lena's idea.",
        wrong: ["They asked the teacher to build it.", "They built another skinny tower."],
        hint: "Read the last paragraph. What kind of base did they build together?",
      },
      {
        prompt: "Which sentence best tells the lesson of this story?",
        right: "Listening to others can help a team succeed.",
        wrong: ["The tallest tower always wins.", "It is better to work alone."],
        hint: "What changed when Noah listened to Lena?",
      },
      {
        prompt: "Did Lena and Noah's team tower win first place?",
        right: "No, but it was still standing at the end.",
        wrong: ["Yes, it was the tallest tower.", "No, it crashed to the floor."],
        hint: "Read the last sentence carefully. Only Noah's first skinny tower crashed.",
      },
    ],
    events: [
      "Lena and Noah disagreed about the plan.",
      "Noah built a tall, skinny tower.",
      "The skinny tower crashed.",
      "They built a tower with a wide base.",
    ],
  },
  {
    level: 3,
    title: "Why Leaves Change Colour",
    paragraphs: [
      "In summer, the leaves on many trees are green. They get their colour from chlorophyll, a green material that helps leaves use sunlight to make food for the tree.",
      "In the fall, the days get shorter and the air gets cooler. Trees slowly stop making chlorophyll. As the green fades, yellow and orange colours begin to show. These colours were hiding in the leaves all summer long!",
      "Some trees, such as many maples, also make bright red colours in the fall. Soon, the leaves dry up and drop to the ground. The tree rests through the winter, and in spring it grows brand-new green leaves.",
    ],
    questions: [
      {
        prompt: "What is chlorophyll?",
        right: "A green material that helps leaves make food",
        wrong: ["A red colour made in winter", "A kind of tree that loses its leaves"],
        hint: "The first paragraph explains this word right after it is used.",
      },
      {
        prompt: "What makes trees stop making chlorophyll?",
        right: "Shorter days and cooler air",
        wrong: ["Too much rain", "Animals eating the leaves"],
        hint: "Read the start of the second paragraph.",
      },
      {
        prompt: "Where were the yellow and orange colours during the summer?",
        right: "Hidden in the leaves",
        wrong: ["In the tree's roots", "In the soil"],
        hint: "Read the last sentence of the second paragraph.",
      },
      {
        prompt: "What is this passage mostly about?",
        right: "Why leaves change colour in the fall",
        wrong: ["How to rake leaves into a pile", "Why maple trees grow so tall"],
        hint: "The title gives a big clue about the main idea.",
      },
      {
        prompt: "What does the tree do in winter?",
        right: "It rests.",
        wrong: ["It grows new leaves.", "It makes more chlorophyll."],
        hint: "Read the last sentence of the passage.",
      },
      {
        prompt: "Which word from the passage means “slowly becomes less bright”?",
        right: "fades",
        wrong: ["shows", "rests"],
        hint: "Find the sentence about the green colour going away.",
      },
    ],
    events: [
      "The leaves are green in summer.",
      "The days get shorter and cooler.",
      "The green colour fades.",
      "The leaves drop to the ground.",
    ],
  },
];

function passageQuestions(p: Passage): Question[] {
  const visual: Visual = {
    type: "passage",
    title: p.title,
    paragraphs: p.paragraphs,
  };
  const withOrder = p.events !== undefined && chance(0.5);
  const qs: Question[] = sample(p.questions, withOrder ? 3 : 4).map((q) => ask(q, visual));
  if (withOrder && p.events) {
    const order: OrderQuestion = {
      kind: "order",
      prompt: "Put these in order, from first to last.",
      hint: "Look back at the passage. Find each part, then see which one comes first.",
      visual,
      items: p.events.map((label, i) => ({ id: `e${i}`, label })),
    };
    qs.push(order);
  }
  return shuffle(qs);
}

function readAndThink(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return sample(
    PASSAGES.filter((p) => p.level === level),
    2,
  ).flatMap(passageQuestions);
}

// ---------- Story Elements ----------

interface StoryEl {
  lines: string[];
  character: [string, string[]];
  setting: { prompt: string; right: string; wrong: string[] };
  problem: [string, string[]];
  solution: [string, string[]];
  feeling: Item;
  trait: Item;
  lesson: [string, string[]];
}

type ElementKind = "character" | "setting" | "problem" | "solution" | "feeling" | "trait" | "lesson";

const SETTING_PROMPT = "What is the setting of this story?";

const STORY_ELS: StoryEl[] = [
  {
    lines: [
      "On a sunny afternoon at the park, Ana tried to ride her bike without training wheels.",
      "She wobbled and tipped over again and again.",
      "Her friend Jay held the back of her seat while she pedalled.",
      "After many tries, Jay let go, and Ana rode all the way to the pond by herself!",
    ],
    character: ["Ana", ["A park ranger", "A duck at the pond"]],
    setting: {
      prompt: SETTING_PROMPT,
      right: "At the park on a sunny afternoon",
      wrong: ["At school on a snowy morning", "At the beach at night"],
    },
    problem: ["Ana kept tipping over on her bike.", ["Ana's bike had a flat tire.", "Ana could not find the park."]],
    solution: [
      "Jay held her seat until she could ride alone.",
      ["Ana put her training wheels back on.", "Ana walked her bike home."],
    ],
    feeling: {
      prompt: "How did Ana most likely feel at the end?",
      right: "Proud",
      wrong: ["Bored", "Grumpy"],
      hint: "Ana finally rode all by herself after many tries. How would you feel?",
    },
    trait: {
      prompt: "Which word best describes Ana?",
      right: "Determined",
      wrong: ["Lazy", "Rude"],
      hint: "Ana tipped over again and again, but she kept on trying.",
    },
    lesson: [
      "If you keep practising, you can learn new things.",
      ["Bikes are only for grown-ups.", "You should never ask for help."],
    ],
  },
  {
    lines: [
      "On Friday morning, Kenji had to return a library book about dinosaurs.",
      "But the book was missing! He searched his backpack, his desk and under his bed.",
      "Then Kenji remembered reading in the car after soccer practice.",
      "He checked the car and found the book under a seat.",
      "Kenji got to school just in time to return it.",
    ],
    character: ["Kenji", ["The librarian", "A dinosaur"]],
    setting: {
      prompt: "When does this story happen?",
      right: "On a Friday morning",
      wrong: ["On a Sunday night", "On a summer afternoon"],
    },
    problem: ["Kenji could not find his library book.", ["Kenji did not like dinosaurs.", "The library was closed."]],
    solution: [
      "He remembered reading in the car and found the book there.",
      ["He bought a brand-new book.", "His teacher found it in the classroom."],
    ],
    feeling: {
      prompt: "How did Kenji most likely feel when the book was missing?",
      right: "Worried",
      wrong: ["Sleepy", "Proud"],
      hint: "The book was due that day, and he couldn't find it anywhere!",
    },
    trait: {
      prompt: "Which word best describes Kenji?",
      right: "Responsible",
      wrong: ["Lazy", "Unkind"],
      hint: "Kenji worked hard to find the book and return it on time.",
    },
    lesson: [
      "Thinking back on where you have been can help you find lost things.",
      ["Library books are not worth borrowing.", "Dinosaur books are the best books."],
    ],
  },
  {
    lines: [
      "Leo was spending the night at his grandma's farmhouse.",
      "When the lights went out, he heard a strange “hoo-hoo” sound outside his window.",
      "Leo pulled the blanket over his head. He could not fall asleep.",
      "Grandma came in with a flashlight and shone it on the tree outside. A fluffy owl blinked back at them!",
      "Leo smiled, whispered goodnight to the owl and soon fell fast asleep.",
    ],
    character: ["Leo", ["A farmer", "A cat"]],
    setting: {
      prompt: SETTING_PROMPT,
      right: "At Grandma's farmhouse at night",
      wrong: ["At school during lunch", "At a city park in the morning"],
    },
    problem: ["A strange sound kept Leo awake.", ["Leo lost his flashlight.", "Grandma could not find the owl."]],
    solution: [
      "Grandma showed him the sound came from an owl.",
      ["Leo moved to a different room.", "Leo turned on the radio."],
    ],
    feeling: {
      prompt: "How did Leo most likely feel when he first heard the sound?",
      right: "Nervous",
      wrong: ["Proud", "Hungry"],
      hint: "Leo pulled the blanket over his head and could not fall asleep.",
    },
    trait: {
      prompt: "Which word best describes Grandma?",
      right: "Caring",
      wrong: ["Bossy", "Forgetful"],
      hint: "Grandma came to help Leo when he couldn't sleep.",
    },
    lesson: [
      "Finding out what something really is can make a worry go away.",
      ["Owls should live inside houses.", "You should never sleep at a farm."],
    ],
  },
  {
    lines: [
      "Priya and her dad baked lemon muffins for the school bake sale.",
      "When they got to the gym, Priya saw that another family had brought lemon muffins too.",
      "Priya frowned. “Now nobody will buy ours,” she said.",
      "Then Priya had an idea. She asked the other family to share one big table with a sign that said “Lemon Muffin Corner.”",
      "By noon, every muffin was gone!",
    ],
    character: ["Priya", ["The principal", "A baker at a shop"]],
    setting: {
      prompt: SETTING_PROMPT,
      right: "At a bake sale in the school gym",
      wrong: ["At a farm in the country", "At the library after school"],
    },
    problem: [
      "Another family brought the same kind of muffins.",
      ["Priya and her dad burned the muffins.", "The bake sale was cancelled."],
    ],
    solution: [
      "The two families shared a table and a sign.",
      ["Priya took her muffins back home.", "Priya's dad baked a cake instead."],
    ],
    feeling: {
      prompt: "How did Priya feel when she saw the other lemon muffins?",
      right: "Worried",
      wrong: ["Excited", "Sleepy"],
      hint: "Priya frowned and said nobody would buy their muffins.",
    },
    trait: {
      prompt: "Which word best describes Priya?",
      right: "Creative",
      wrong: ["Selfish", "Lazy"],
      hint: "Priya thought of a clever new idea to fix the problem.",
    },
    lesson: [
      "Working together can turn a problem into a success.",
      ["Lemon muffins are the only good muffins.", "Never bring food to a bake sale."],
    ],
  },
  {
    lines: [
      "On a windy Saturday, Amir flew his new green kite in the field behind his school.",
      "A strong gust pushed the kite into a tall tree.",
      "Amir tugged hard on the string, but the kite stayed stuck.",
      "His big sister, Nora, gently wiggled the string back and forth. Slowly, the kite slid free and floated down.",
      "Amir thanked Nora, and they took turns flying the kite all afternoon.",
    ],
    character: ["Amir", ["A bird in the tree", "The school principal"]],
    setting: {
      prompt: SETTING_PROMPT,
      right: "In a field on a windy Saturday",
      wrong: ["In a kitchen on a rainy day", "On a boat at night"],
    },
    problem: ["Amir's kite got stuck in a tree.", ["Amir's kite was too small.", "Nora did not want to play."]],
    solution: [
      "Nora wiggled the string until the kite slid free.",
      ["Amir climbed to the top of the tree.", "They bought a brand-new kite."],
    ],
    feeling: {
      prompt: "How did Amir most likely feel at the end?",
      right: "Thankful",
      wrong: ["Angry", "Lonely"],
      hint: "Amir thanked Nora, and they played together all afternoon.",
    },
    trait: {
      prompt: "Which word best describes Nora?",
      right: "Helpful",
      wrong: ["Mean", "Careless"],
      hint: "Nora used a gentle trick to help her brother.",
    },
    lesson: [
      "Being patient and gentle can fix a tricky problem.",
      ["Kites should be kept indoors.", "Pulling harder always works best."],
    ],
  },
  {
    lines: [
      "It was Zoe's first day at a new school, and she did not know anyone.",
      "At recess, she stood by the fence and watched the other kids play.",
      "A boy named Ravi walked over. “We need one more player for tag. Do you want to join us?”",
      "Zoe grinned and ran to play. By the end of recess, she had three new friends.",
    ],
    character: ["Zoe", ["The teacher", "A crossing guard"]],
    setting: {
      prompt: SETTING_PROMPT,
      right: "At a new school during recess",
      wrong: ["At home on a Sunday", "At the grocery store"],
    },
    problem: ["Zoe was new and did not know anyone.", ["Zoe forgot her lunch.", "It was raining at recess."]],
    solution: ["Ravi invited her to play tag.", ["Zoe went back inside to read.", "Zoe moved to a different school."]],
    feeling: {
      prompt: "How did Zoe most likely feel at the start of recess?",
      right: "Lonely",
      wrong: ["Proud", "Silly"],
      hint: "Zoe stood by herself and watched the others play.",
    },
    trait: {
      prompt: "Which word best describes Ravi?",
      right: "Friendly",
      wrong: ["Rude", "Bossy"],
      hint: "Ravi walked over and invited Zoe to play.",
    },
    lesson: [
      "A small act of kindness can make a big difference.",
      ["Tag is the only fun game.", "New schools are always lonely."],
    ],
  },
  {
    lines: [
      "Lena grew lettuce in her backyard garden.",
      "One morning, she found that half of the leaves had been nibbled away.",
      "She waited quietly by the window and spotted a hungry rabbit hopping out of the garden.",
      "Lena and her mom put a small fence around the lettuce.",
      "The lettuce grew big and leafy again, and Lena planted some clover near the back fence just for the rabbit.",
    ],
    character: ["Lena", ["A farmer", "A squirrel"]],
    setting: {
      prompt: SETTING_PROMPT,
      right: "In Lena's backyard garden",
      wrong: ["At a busy grocery store", "In a school classroom"],
    },
    problem: [
      "A rabbit was eating Lena's lettuce.",
      ["Lena's lettuce needed more sun.", "Lena's mom did not like lettuce."],
    ],
    solution: [
      "Lena and her mom put a fence around the lettuce.",
      ["Lena stopped growing lettuce.", "Lena chased the rabbit every day."],
    ],
    feeling: {
      prompt: "How did Lena most likely feel when she saw the nibbled leaves?",
      right: "Upset",
      wrong: ["Delighted", "Sleepy"],
      hint: "Half of her lettuce was gone!",
    },
    trait: {
      prompt: "Which word best describes Lena?",
      right: "Kind",
      wrong: ["Mean", "Careless"],
      hint: "Lena protected her lettuce, but she also planted clover for the rabbit.",
    },
    lesson: [
      "You can solve a problem and still be kind.",
      ["Rabbits should never eat plants.", "Gardens are too much work."],
    ],
  },
];

function elementQuestion(s: StoryEl, kind: ElementKind): Question {
  const visual: Visual = { type: "story", lines: s.lines };
  switch (kind) {
    case "character":
      return textChoice(
        "Who is the main character in this story?",
        s.character[0],
        s.character[1],
        "The main character is the person or animal the story is mostly about.",
        visual,
      );
    case "setting":
      return textChoice(
        s.setting.prompt,
        s.setting.right,
        s.setting.wrong,
        "The setting is where and when a story happens. Look for clues about the place and the time.",
        visual,
      );
    case "problem":
      return textChoice(
        "What is the problem in this story?",
        s.problem[0],
        s.problem[1],
        "The problem is the trouble a character needs to fix. It usually shows up near the beginning.",
        visual,
      );
    case "solution":
      return textChoice(
        "How is the problem solved?",
        s.solution[0],
        s.solution[1],
        "The solution is how the problem gets fixed. Look near the end of the story.",
        visual,
      );
    case "feeling":
      return ask(s.feeling, visual);
    case "trait":
      return ask(s.trait, visual);
    case "lesson":
      return textChoice(
        "What lesson does this story teach?",
        s.lesson[0],
        s.lesson[1],
        "Think about what the character learned. What could a reader learn from it too?",
        visual,
      );
  }
}

const STORY_CONCEPTS: Record<Level, Item[]> = {
  1: [
    {
      prompt: "In a story, what is the setting?",
      right: "Where and when the story happens",
      wrong: ["Who the story is about", "How the problem gets fixed"],
      hint: "Setting means the place and the time of a story.",
    },
    {
      prompt: "What are the characters in a story?",
      right: "The people or animals the story is about",
      wrong: ["The place where the story happens", "The last page of the book"],
      hint: "Characters are who the story is about. They can be people or animals.",
    },
    {
      prompt: "Which of these could be a setting?",
      right: "A snowy forest at night",
      wrong: ["A brave girl named Ana", "A lost puppy"],
      hint: "A setting is a place and time, not a person or an animal.",
    },
    {
      prompt: "Which of these could be a character?",
      right: "A curious turtle named Sol",
      wrong: ["A sandy beach at sunset", "The next morning"],
      hint: "A character is a person or animal in the story.",
    },
  ],
  2: [
    {
      prompt: "What is the problem in a story?",
      right: "The trouble a character has to deal with",
      wrong: ["The name of the author", "The happy ending"],
      hint: "Most stories have something go wrong. That is the problem.",
    },
    {
      prompt: "What is the solution in a story?",
      right: "How the problem gets fixed",
      wrong: ["Where the story happens", "The first thing that happens"],
      hint: "The solution solves, or fixes, the problem.",
    },
    {
      prompt: "Which of these could be a story problem?",
      right: "A boy's kite gets stuck in a tree.",
      wrong: ["A girl lives in a big city.", "It is a sunny day."],
      hint: "A problem is something that goes wrong and needs fixing.",
    },
    {
      prompt: "In which part of a story is the problem usually solved?",
      right: "The end",
      wrong: ["The beginning", "The title"],
      hint: "Stories have a beginning, a middle and an end. The problem gets fixed last.",
    },
  ],
  3: [
    {
      prompt: "Which word describes how a character feels?",
      right: "Nervous",
      wrong: ["Tall", "Curly-haired"],
      hint: "A feeling is about the inside, not about how someone looks.",
    },
    {
      prompt: "A character trait tells what a character is like inside. Which is a character trait?",
      right: "Honest",
      wrong: ["Red-haired", "Eight years old"],
      hint: "A trait is about how someone acts and thinks, not how they look.",
    },
    {
      prompt: "What is the plot of a story?",
      right: "The events that happen, in order",
      wrong: ["The place where it happens", "The people in the story"],
      hint: "The plot is what happens: the beginning, the middle and the end.",
    },
    {
      prompt: "A story says, “I grabbed my boots and ran outside.” Who is telling the story?",
      right: "A character in the story",
      wrong: ["The reader", "Someone who is not in the story"],
      hint: "The words “I” and “my” tell you the storyteller is part of the story.",
    },
  ],
};

const ELEMENT_KINDS: Record<Level, ElementKind[]> = {
  1: ["character", "setting", "problem", "feeling"],
  2: ["setting", "problem", "solution", "feeling"],
  3: ["problem", "solution", "trait", "lesson"],
};

function storyElements(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const stories = sample(STORY_ELS, 2).flatMap((s) =>
    sample(ELEMENT_KINDS[level], 3).map((kind) => elementQuestion(s, kind)),
  );
  const concepts = sample(STORY_CONCEPTS[level], 2).map((it) => ask(it));
  return [...stories, ...concepts];
}

// ---------- Parts of Speech ----------

type Pos = "noun" | "verb" | "adj" | "adv";

const POS_NAME: Record<Pos, string> = {
  noun: "a noun",
  verb: "a verb",
  adj: "an adjective",
  adv: "an adverb",
};

const POS_LABEL: Record<Pos, string> = {
  noun: "Noun (names a person, place, animal or thing)",
  verb: "Verb (shows an action)",
  adj: "Adjective (describes a noun)",
  adv: "Adverb (tells how an action happens)",
};

const POS_HINT: Record<Pos, string> = {
  noun: "A noun names a person, place, animal or thing. Ask: which word is something you could name or point to?",
  verb: "A verb is an action word. Ask: what is someone or something doing?",
  adj: "An adjective describes a noun. Ask: what kind? Which word tells more about a thing?",
  adv: "An adverb tells how an action happens. Many adverbs end in -ly, like slowly.",
};

interface Tagged {
  text: string;
  words: Record<Pos, string[]>;
}

const T = (text: string, noun: string[], verb: string[], adj: string[], adv: string[] = []): Tagged => ({
  text,
  words: { noun, verb, adj, adv },
});

const TAGGED: Tagged[] = [
  T("The fluffy kitten chased a red ball.", ["kitten", "ball"], ["chased"], ["fluffy", "red"]),
  T("Maya quickly packed her heavy backpack.", ["Maya", "backpack"], ["packed"], ["heavy"], ["quickly"]),
  T(
    "The tall giraffe slowly stretched its long neck.",
    ["giraffe", "neck"],
    ["stretched"],
    ["tall", "long"],
    ["slowly"],
  ),
  T("Two noisy crows sat on the fence.", ["crows", "fence"], ["sat"], ["noisy"]),
  T("Jay carefully carried the hot soup.", ["Jay", "soup"], ["carried"], ["hot"], ["carefully"]),
  T("The brave firefighter climbed the long ladder.", ["firefighter", "ladder"], ["climbed"], ["brave", "long"]),
  T("Our class happily sang a cheerful song.", ["class", "song"], ["sang"], ["cheerful"], ["happily"]),
  T("A tiny ant lifted a huge crumb.", ["ant", "crumb"], ["lifted"], ["tiny", "huge"]),
  T("The wind blew loudly through the dark forest.", ["wind", "forest"], ["blew"], ["dark"], ["loudly"]),
  T("Grandpa gently watered the thirsty tomatoes.", ["Grandpa", "tomatoes"], ["watered"], ["thirsty"], ["gently"]),
  T("Leo proudly kicked the muddy ball.", ["Leo", "ball"], ["kicked"], ["muddy"], ["proudly"]),
  T("The sleepy bear crawled into a cozy den.", ["bear", "den"], ["crawled"], ["sleepy", "cozy"]),
  T("The playful puppy barked loudly at the squirrel.", ["puppy", "squirrel"], ["barked"], ["playful"], ["loudly"]),
  T("Ravi quietly read a funny book.", ["Ravi", "book"], ["read"], ["funny"], ["quietly"]),
  T("Bright stars twinkled in the sky.", ["stars", "sky"], ["twinkled"], ["Bright"]),
  T("Lena swiftly swam across the cold lake.", ["Lena", "lake"], ["swam"], ["cold"], ["swiftly"]),
  T("The hungry children ate warm pancakes.", ["children", "pancakes"], ["ate"], ["hungry", "warm"]),
  T("Zoe painted a colourful rainbow.", ["Zoe", "rainbow"], ["painted"], ["colourful"]),
];

const POS_BINS: Record<Pos, { id: string; label: string; emoji: string }> = {
  noun: { id: "noun", label: "Nouns", emoji: "🏷️" },
  verb: { id: "verb", label: "Verbs", emoji: "🏃" },
  adj: { id: "adj", label: "Adjectives", emoji: "🎨" },
  adv: { id: "adv", label: "Adverbs", emoji: "⏱️" },
};

const POS_WORDS: Record<Pos, { label: string; emoji: string }[]> = {
  noun: [
    { label: "teacher", emoji: "🧑‍🏫" },
    { label: "kitten", emoji: "🐱" },
    { label: "library", emoji: "📚" },
    { label: "pencil", emoji: "✏️" },
    { label: "mountain", emoji: "⛰️" },
    { label: "sandwich", emoji: "🥪" },
    { label: "bicycle", emoji: "🚲" },
    { label: "octopus", emoji: "🐙" },
  ],
  verb: [
    { label: "jumped", emoji: "🦘" },
    { label: "laughed", emoji: "😂" },
    { label: "wrote", emoji: "✍️" },
    { label: "sang", emoji: "🎤" },
    { label: "threw", emoji: "⚾" },
    { label: "climbed", emoji: "🧗" },
    { label: "whispered", emoji: "🤫" },
    { label: "swam", emoji: "🏊" },
  ],
  adj: [
    { label: "fluffy", emoji: "🐑" },
    { label: "tiny", emoji: "🐜" },
    { label: "noisy", emoji: "📢" },
    { label: "shiny", emoji: "✨" },
    { label: "enormous", emoji: "🐘" },
    { label: "sleepy", emoji: "😴" },
    { label: "gentle", emoji: "🕊️" },
    { label: "bumpy", emoji: "🪨" },
  ],
  adv: [
    { label: "quickly", emoji: "⚡" },
    { label: "softly", emoji: "🪶" },
    { label: "loudly", emoji: "📣" },
    { label: "slowly", emoji: "🐢" },
    { label: "carefully", emoji: "🧐" },
    { label: "happily", emoji: "😄" },
    { label: "gently", emoji: "🤲" },
    { label: "bravely", emoji: "🦁" },
  ],
};

function posSort(bins: Pos[], perBin: number): Question {
  const set: SortSet = {
    prompt: `Sort the words: ${bins
      .map((b) => POS_BINS[b].label.toLowerCase())
      .join(", ")
      .replace(/, ([^,]*)$/, " or $1")}.`,
    hint: bins.map((b) => POS_HINT[b].split(".")[0] + ".").join(" "),
    bins: bins.map((b) => POS_BINS[b]),
    items: bins.flatMap((b) => POS_WORDS[b].map((w) => ({ ...w, bin: POS_BINS[b].id }))),
  };
  return sortQuestion(set, perBin);
}

function partsOfSpeech(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const levelPos: Pos[] = level === 3 ? ["noun", "verb", "adj", "adv"] : ["noun", "verb", "adj"];
  const findTargets: Pos[] =
    level === 1
      ? ["noun", "noun", "verb", "verb", pick<Pos>(["noun", "verb"])]
      : level === 2
        ? ["noun", "verb", "adj", "adj", pick<Pos>(["noun", "verb"])]
        : ["adv", "adv", "adj", "verb", "noun"];
  const nWrong = level === 3 ? 3 : 2;

  // Each sentence is used once per set.
  const pool = shuffle(TAGGED);
  const take = (fits: (s: Tagged) => boolean): Tagged => {
    const i = Math.max(0, pool.findIndex(fits));
    return pool.splice(i, 1)[0];
  };

  const finds: Question[] = findTargets.map((target) => {
    const s = take((t) => t.words[target].length > 0);
    const others = (Object.keys(s.words) as Pos[]).filter((p) => p !== target).flatMap((p) => s.words[p]);
    return textChoice(
      `Which word in this sentence is ${POS_NAME[target]}?`,
      pick(s.words[target]),
      sample(others, Math.min(nWrong, others.length)),
      POS_HINT[target],
      line(s.text),
    );
  });

  const kinds: Question[] = [0, 1].map(() => {
    const s = take(() => true);
    const pos = pick(levelPos.filter((p) => s.words[p].length > 0));
    const word = pick(s.words[pos]);
    return textChoice(
      `In this sentence, what kind of word is “${word}”?`,
      POS_LABEL[pos],
      levelPos.filter((p) => p !== pos).map((p) => POS_LABEL[p]),
      `Look at how “${word}” is used. ${POS_HINT[pos]}`,
      line(s.text),
    );
  });

  const sort =
    level === 1
      ? posSort(["noun", "verb"], 3)
      : level === 2
        ? posSort(["noun", "verb", "adj"], 2)
        : posSort(["adj", "adv"], 3);

  return [...shuffle([...finds, ...kinds]), sort];
}

// ---------- Punctuation Power ----------

type EndMark = "." | "?" | "!";

const END_MARK_SENTENCES: Record<EndMark, string[]> = {
  "?": [
    "Where did you put the glue",
    "How many legs does a crab have",
    "Can we bake cookies after school",
    "Why do cats purr",
    "When does the library open",
    "Who wants to read first",
  ],
  "!": [
    "Wow, we won the game",
    "What a huge pumpkin that is",
    "Hooray, the rain finally stopped",
    "How beautiful the sunset is",
    "Yay, it's my birthday",
    "Oh no, I dropped my ice cream",
  ],
  ".": [
    "My cousin lives near a lake",
    "The library has new computers",
    "We have art class on Tuesday",
    "Bats sleep during the day",
    "Our class planted beans in cups",
    "The bus was a little late today",
  ],
};

const END_MARK_HINT: Record<EndMark, string> = {
  "?": "Is the sentence asking something? Questions end with a question mark (?).",
  "!": "Does the sentence show a strong feeling, like surprise or excitement? Use an exclamation mark (!).",
  ".": "Is the sentence calmly telling something? Telling sentences end with a period (.).",
};

function endMarkQuestion(mark: EndMark): Question {
  return {
    kind: "choice",
    prompt: "Which end mark belongs in the box?",
    hint: END_MARK_HINT[mark],
    visual: { type: "equation", text: `${pick(END_MARK_SENTENCES[mark])}☐` },
    answer: mark,
    choices: [
      { id: ".", label: ".", speak: "period" },
      { id: "?", label: "?", speak: "question mark" },
      { id: "!", label: "!", speak: "exclamation mark" },
    ],
  };
}

/** A list sentence: a start and three or four items. */
const LISTS: { start: string; items: string[] }[] = [
  { start: "Maya packed", items: ["apples", "grapes", "crackers"] },
  { start: "Our class planted", items: ["beans", "peas", "carrots"] },
  { start: "I need", items: ["glue", "scissors", "paper"] },
  { start: "Ana's favourite colours are", items: ["blue", "orange", "yellow"] },
  { start: "The bakery sells", items: ["bread", "muffins", "bagels"] },
  { start: "Lena's garden has", items: ["roses", "tulips", "daisies"] },
  { start: "Ravi found", items: ["rocks", "shells", "feathers"] },
  { start: "We saw", items: ["a moose", "a heron", "two frogs"] },
];

const LONG_LISTS: { start: string; items: string[] }[] = [
  { start: "We need", items: ["flour", "sugar", "eggs", "butter"] },
  {
    start: "Kenji's bag holds",
    items: ["a book", "a pencil", "a ruler", "an apple"],
  },
  { start: "The zoo has", items: ["lions", "zebras", "otters", "owls"] },
  { start: "Zoe likes to", items: ["swim", "skate", "draw", "sing"] },
  {
    start: "Our town has",
    items: ["a library", "a park", "a pool", "a museum"],
  },
];

function listCommaQuestion(list: { start: string; items: string[] }, nWrong: number): Question {
  const { start, items } = list;
  const front = items.slice(0, -1);
  const last = items[items.length - 1];
  const right = `${start} ${front.join(", ")}, and ${last}.`;
  const missingMiddle = [...front.slice(0, -2), `${front[front.length - 2]} ${front[front.length - 1]}`];
  const wrong = [
    `${start} ${front.join(" ")} and ${last}.`,
    `${start}, ${front.join(" ")} and ${last}.`,
    `${start} ${front.join(", ")}, and, ${last}.`,
    `${start} ${missingMiddle.join(", ")}, and ${last}.`,
  ];
  return textChoice(
    "Which sentence uses commas correctly?",
    right,
    sample(wrong, nWrong),
    `Put commas between the items in a list: ${front.join(", ")}, and ${last}. No comma before the list starts or after “and.”`,
  );
}

/** [two words, contraction, wrong spellings] */
const CONTRACTIONS: [string, string, string[]][] = [
  ["do not", "don't", ["dont", "do'nt"]],
  ["cannot", "can't", ["cant", "ca'nt"]],
  ["I am", "I'm", ["Im", "I'am"]],
  ["it is", "it's", ["its", "i'ts"]],
  ["we are", "we're", ["were", "w'ere"]],
  ["they will", "they'll", ["theyll", "they'ill"]],
  ["she is", "she's", ["shes", "sh'es"]],
  ["did not", "didn't", ["didnt", "did'nt"]],
  ["was not", "wasn't", ["wasnt", "was'nt"]],
  ["let us", "let's", ["lets", "le'ts"]],
  ["you are", "you're", ["your", "youre"]],
  ["is not", "isn't", ["isnt", "is'nt"]],
  ["have not", "haven't", ["havent", "have'nt"]],
  ["we have", "we've", ["weve", "we'ave"]],
  ["they are", "they're", ["theyre", "their"]],
  ["she will", "she'll", ["shell", "she'l"]],
];

/** [contraction, the two words, wrong word pairs] */
const EXPANSIONS: [string, string, string[]][] = [
  ["won't", "will not", ["want not", "would not"]],
  ["they're", "they are", ["there are", "they were"]],
  ["I'll", "I will", ["I would", "I am"]],
  ["we've", "we have", ["we are", "we will"]],
  ["didn't", "did not", ["do not", "does not"]],
  ["can't", "cannot", ["could not", "did not"]],
  ["let's", "let us", ["let is", "let it"]],
  ["you're", "you are", ["you were", "you will"]],
  ["wasn't", "was not", ["were not", "will not"]],
  ["aren't", "are not", ["am not", "were not"]],
  ["shouldn't", "should not", ["could not", "would not"]],
  ["I'm", "I am", ["I was", "I will"]],
];

function contractionQuestions(n: number): Question[] {
  return sample(CONTRACTIONS, n).map(([words, short, wrong]) =>
    textChoice(
      `What is the contraction for “${words}”?`,
      short,
      wrong,
      `A contraction squeezes two words together. An apostrophe (') takes the place of the missing letters: ${words} → ${short}.`,
    ),
  );
}

function expansionQuestions(n: number): Question[] {
  return sample(EXPANSIONS, n).map(([short, words, wrong]) =>
    textChoice(
      `Which two words make the contraction “${short}”?`,
      words,
      wrong,
      short === "won't"
        ? "“Won't” is a tricky one! It is short for “will not.”"
        : `Put back the missing letters where the apostrophe is: ${short} → ${words}.`,
    ),
  );
}

interface Quote {
  said: string;
  end: "," | "?" | "!";
  who: string;
  verb: string;
}

const QUOTES: Quote[] = [
  { said: "Let's play tag", end: ",", who: "Maya", verb: "said" },
  { said: "Can I help you", end: "?", who: "Leo", verb: "asked" },
  { said: "I found a frog", end: "!", who: "Zoe", verb: "shouted" },
  { said: "It is time for lunch", end: ",", who: "Mr. Chen", verb: "said" },
  { said: "Where are my boots", end: "?", who: "Amir", verb: "asked" },
  { said: "We won the game", end: "!", who: "Priya", verb: "cheered" },
  { said: "The bus is here", end: ",", who: "Grandma", verb: "called" },
  { said: "May I borrow a pencil", end: "?", who: "Kenji", verb: "asked" },
];

const QUOTE_HINT = "Quotation marks go around only the exact words someone says, like a speech bubble.";

function quoteAfterQuestion(q: Quote): Question {
  const words = q.said.split(" ");
  const k = Math.ceil(words.length / 2);
  const tag = `${q.verb} ${q.who}`;
  return textChoice(
    "Which sentence uses quotation marks correctly?",
    `“${q.said}${q.end}” ${tag}.`,
    [
      `“${q.said}${q.end} ${tag}.”`,
      `${q.said}${q.end} “${tag}.”`,
      `“${words.slice(0, k).join(" ")}” ${words.slice(k).join(" ")}${q.end} ${tag}.`,
    ],
    `${QUOTE_HINT} ${q.who}'s exact words are: ${q.said}${q.end === "," ? "." : q.end}`,
  );
}

function quoteBeforeQuestion(q: Quote): Question {
  const end = q.end === "," ? "." : q.end;
  const tag = `${q.who} ${q.verb}`;
  return textChoice(
    "Which sentence uses quotation marks correctly?",
    `${tag}, “${q.said}${end}”`,
    [`“${tag}, ${q.said}${end}”`, `${tag}, ${q.said}${end}`, `${q.who} “${q.verb}, ${q.said}${end}”`],
    `${QUOTE_HINT} ${q.who}'s exact words are: ${q.said}${end}`,
  );
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function dateQuestion(nWrong: number): Question {
  const month = pick(MONTHS);
  const day = pick([2, 3, 5, 9, 12, 14, 18, 21, 25, 28]);
  const year = pick([2024, 2025, 2026, 2027]);
  return textChoice(
    "Which date is written correctly?",
    `${month} ${day}, ${year}`,
    sample([`${month.toLowerCase()} ${day}, ${year}`, `${month}, ${day} ${year}`, `${month} ${day} ${year}`], nWrong),
    "Start the month with a capital letter, and put a comma between the day and the year.",
  );
}

const GREETING_NAMES = ["Grandma", "Grandpa", "Aunt Rosa", "Uncle Ben", "Mr. Patel", "Ms. Lee"];

function greetingQuestion(): Question {
  const name = pick(GREETING_NAMES);
  return textChoice(
    "Which letter greeting is written correctly?",
    `Dear ${name},`,
    [`dear ${name},`, `Dear, ${name}`, `Dear ${name}.`],
    "A letter greeting starts with a capital letter and ends with a comma after the name.",
  );
}

const OWNERS: [string, string][] = [
  ["Jay", "bike"],
  ["Ana", "backpack"],
  ["the cat", "toy"],
  ["Leo", "drum"],
  ["my sister", "book"],
  ["the bird", "nest"],
];

function possessiveQuestion(): Question {
  const [owner, thing] = pick(OWNERS);
  return textChoice(
    `Which shows that the ${thing} belongs to ${owner}?`,
    `${owner}'s ${thing}`,
    [`${owner}s ${thing}`, `${owner}s' ${thing}`],
    `To show that something belongs to one person or animal, add an apostrophe and s: ${owner}'s ${thing}.`,
  );
}

function punctuation(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const marks = shuffle<EndMark>([".", "?", "!"]);
  if (level === 1) {
    return shuffle([
      ...marks.map(endMarkQuestion),
      ...contractionQuestions(3),
      ...sample(LISTS, 2).map((l) => listCommaQuestion(l, 2)),
    ]);
  }
  if (level === 2) {
    const quotes = sample(QUOTES, 2);
    return shuffle([
      endMarkQuestion(marks[0]),
      ...contractionQuestions(2),
      ...sample(LISTS, 2).map((l) => listCommaQuestion(l, 2)),
      ...quotes.map(quoteAfterQuestion),
      chance(0.5) ? dateQuestion(2) : greetingQuestion(),
    ]);
  }
  const quotes = sample(QUOTES, 2);
  return shuffle([
    ...expansionQuestions(2),
    ...sample(LONG_LISTS, 2).map((l) => listCommaQuestion(l, 3)),
    quoteAfterQuestion(quotes[0]),
    quoteBeforeQuestion(quotes[1]),
    possessiveQuestion(),
    chance(0.5) ? dateQuestion(3) : greetingQuestion(),
  ]);
}

// ---------- Spelling Patterns ----------

interface TeamPic {
  emoji: string;
  word: string;
  team: string;
  /** Vowel teams that would misspell the word (never a real word). */
  wrong: string[];
  level: Level;
}

const TEAM_PICS: TeamPic[] = [
  { emoji: "🚆", word: "train", team: "ai", wrong: ["ay", "oa"], level: 1 },
  { emoji: "🌧️", word: "rain", team: "ai", wrong: ["ay", "ee"], level: 1 },
  { emoji: "🐌", word: "snail", team: "ai", wrong: ["ay", "ee"], level: 1 },
  { emoji: "🎨", word: "paint", team: "ai", wrong: ["ay", "ea"], level: 1 },
  { emoji: "🌳", word: "tree", team: "ee", wrong: ["ea", "ai"], level: 1 },
  { emoji: "🐑", word: "sheep", team: "ee", wrong: ["ea", "ai"], level: 1 },
  { emoji: "⛵", word: "boat", team: "oa", wrong: ["ow", "oe"], level: 1 },
  { emoji: "🐐", word: "goat", team: "oa", wrong: ["ow", "oe"], level: 1 },
  { emoji: "🧼", word: "soap", team: "oa", wrong: ["ow", "oe"], level: 1 },
  { emoji: "🛣️", word: "road", team: "oa", wrong: ["ow", "oe"], level: 1 },
  { emoji: "🍑", word: "peach", team: "ea", wrong: ["ee", "ai"], level: 2 },
  { emoji: "🍃", word: "leaf", team: "ea", wrong: ["ee", "ai"], level: 2 },
  { emoji: "🦭", word: "seal", team: "ea", wrong: ["ee", "oa"], level: 2 },
  { emoji: "🌾", word: "wheat", team: "ea", wrong: ["ee", "ai"], level: 2 },
  { emoji: "❄️", word: "snow", team: "ow", wrong: ["oa", "oe"], level: 2 },
  { emoji: "🥣", word: "bowl", team: "ow", wrong: ["oa", "oe"], level: 2 },
  { emoji: "🌙", word: "night", team: "igh", wrong: ["ie", "y"], level: 2 },
  { emoji: "💡", word: "light", team: "igh", wrong: ["ie", "y"], level: 2 },
  { emoji: "🥧", word: "pie", team: "ie", wrong: ["y", "igh"], level: 2 },
  { emoji: "👔", word: "tie", team: "ie", wrong: ["y", "igh"], level: 2 },
  { emoji: "🖍️", word: "crayon", team: "ay", wrong: ["ai", "ea"], level: 2 },
];

function teamFillQuestion(p: TeamPic): Question {
  const gap = p.word.replace(p.team, "__");
  return textChoice(
    "Which letters finish the word for the picture?",
    p.team,
    p.wrong,
    `Say “${p.word}” slowly and listen for the long vowel sound. In this word it is spelled ${p.team}: ${p.word}.`,
    { type: "emoji", emoji: p.emoji, caption: gap },
  );
}

/** Words grouped by vowel team, and teams that make the same sound. */
const TEAM_WORDS: Record<string, string[]> = {
  ai: ["rain", "paint", "snail", "train", "mail", "wait"],
  ay: ["play", "day", "stay", "tray", "spray"],
  ee: ["tree", "sheep", "green", "sleep", "feet"],
  ea: ["leaf", "peach", "team", "beach", "seal"],
  oa: ["boat", "goat", "road", "soap", "coat"],
  ow: ["snow", "grow", "slow", "bowl", "show"],
  igh: ["night", "light", "high", "bright", "sight"],
  ie: ["pie", "tie", "cried", "dried"],
};

const SOUND_TWIN: Record<string, string> = {
  ai: "ay",
  ay: "ai",
  ee: "ea",
  ea: "ee",
  oa: "ow",
  ow: "oa",
  igh: "ie",
  ie: "igh",
};

function sameTeamQuestion(team: string): Question {
  const [target, right] = sample(TEAM_WORDS[team], 2);
  const twin = SOUND_TWIN[team];
  const others = Object.keys(TEAM_WORDS).filter((t) => t !== team && t !== twin);
  return textChoice(
    `Which word has the same vowel team as “${target}”?`,
    right,
    [pick(TEAM_WORDS[twin]), pick(TEAM_WORDS[pick(others)])],
    `A vowel team is two or more letters that spell one vowel sound. “${target}” uses ${team}. Look for the word spelled with ${team}: ${right}.`,
  );
}

type Rule = "double" | "drop" | "add";

/** [base, ending, correct spelling, wrong spellings] */
const ENDINGS: Record<Rule, [string, string, string, string[]][]> = {
  double: [
    ["hop", "ing", "hopping", ["hoping", "hopeing"]],
    ["run", "ing", "running", ["runing", "runeing"]],
    ["sit", "ing", "sitting", ["siting", "siteing"]],
    ["swim", "ing", "swimming", ["swiming", "swimeing"]],
    ["skip", "ing", "skipping", ["skiping", "skipeing"]],
    ["shop", "ing", "shopping", ["shoping", "shopeing"]],
    ["stop", "ed", "stopped", ["stoped", "stopt"]],
    ["clap", "ed", "clapped", ["claped", "clapt"]],
    ["drop", "ed", "dropped", ["droped", "dropt"]],
    ["hug", "ed", "hugged", ["huged", "hugd"]],
    ["grab", "ed", "grabbed", ["grabed", "grabd"]],
    ["plan", "ed", "planned", ["planed", "pland"]],
  ],
  drop: [
    ["bake", "ing", "baking", ["bakeing", "bakking"]],
    ["smile", "ing", "smiling", ["smileing", "smilling"]],
    ["ride", "ing", "riding", ["rideing", "ridding"]],
    ["make", "ing", "making", ["makeing", "makking"]],
    ["hope", "ing", "hoping", ["hopeing", "hopping"]],
    ["write", "ing", "writing", ["writeing", "writting"]],
    ["skate", "ing", "skating", ["skateing", "skatting"]],
    ["bake", "ed", "baked", ["bakeed", "bakked"]],
    ["smile", "ed", "smiled", ["smileed", "smilled"]],
    ["wave", "ed", "waved", ["waveed", "wavved"]],
    ["share", "ed", "shared", ["shareed", "sharred"]],
  ],
  add: [
    ["jump", "ing", "jumping", ["jumpping", "jumpeing"]],
    ["play", "ed", "played", ["playyed", "plaied"]],
    ["rain", "ing", "raining", ["rainning", "raineing"]],
    ["help", "ed", "helped", ["helpped", "helpt"]],
    ["look", "ed", "looked", ["lookked", "lookt"]],
    ["sleep", "ing", "sleeping", ["sleepping", "sleepeing"]],
    ["rest", "ing", "resting", ["restting", "resteing"]],
    ["cook", "ed", "cooked", ["cookked", "cookt"]],
    ["read", "ing", "reading", ["readding", "readeing"]],
    ["paint", "ed", "painted", ["paintted", "painteed"]],
  ],
};

function endingQuestion(rule: Rule, entry: [string, string, string, string[]]): Question {
  const [base, end, right, wrong] = entry;
  const hint = {
    double: `“${base}” has one short vowel and ends with one consonant. Double the last letter, then add -${end}: ${right}.`,
    drop: `“${base}” ends with a silent e. Drop the e, then add -${end}: ${right}.`,
    add: `“${base}” has no silent e to drop, and it doesn't end in one short vowel plus one consonant. So just add -${end}: ${right}.`,
  }[rule];
  return textChoice(`Add “-${end}” to “${base}”. Which spelling is correct?`, right, wrong, hint, {
    type: "equation",
    text: `${base} + ${end}`,
  });
}

function endingQuestions(rules: Rule[]): Question[] {
  const used = new Set<string>();
  return rules.map((rule) => {
    const entry = pick(ENDINGS[rule].filter((e) => !used.has(e[2])));
    used.add(entry[2]);
    return endingQuestion(rule, entry);
  });
}

function spellingPatterns(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  if (level === 1) {
    return shuffle([
      ...sample(
        TEAM_PICS.filter((p) => p.level === 1),
        5,
      ).map(teamFillQuestion),
      ...endingQuestions(["add", "add", "drop"]),
    ]);
  }
  if (level === 2) {
    return shuffle([
      ...sample(
        TEAM_PICS.filter((p) => p.level === 2),
        2,
      ).map(teamFillQuestion),
      teamFillQuestion(pick(TEAM_PICS.filter((p) => p.level === 1))),
      ...sample(Object.keys(TEAM_WORDS), 2).map(sameTeamQuestion),
      ...endingQuestions(shuffle<Rule>(["double", "drop", "add"])),
    ]);
  }
  return shuffle([
    ...sample(Object.keys(TEAM_WORDS), 2).map(sameTeamQuestion),
    ...endingQuestions(["double", "double", "drop", "drop", "add", pick<Rule>(["double", "drop"])]),
  ]);
}

// ---------- Prefixes & Suffixes ----------

const AFFIX_MEANINGS: Record<Level, Item[]> = {
  1: [
    {
      prompt: "Which prefix means “again”?",
      right: "re-",
      wrong: ["un-", "pre-"],
      hint: "Think of “redo”: to do again.",
    },
    {
      prompt: "Which prefix means “not”?",
      right: "un-",
      wrong: ["re-", "pre-"],
      hint: "Think of “unhappy”: not happy.",
    },
    {
      prompt: "Which suffix means “without”?",
      right: "-less",
      wrong: ["-ful", "-er"],
      hint: "Think of “fearless”: without fear.",
    },
    {
      prompt: "Which suffix means “full of”?",
      right: "-ful",
      wrong: ["-less", "-ly"],
      hint: "Think of “joyful”: full of joy.",
    },
    {
      prompt: "What does the prefix “re-” mean in “reread”?",
      right: "again",
      wrong: ["not", "before"],
      hint: "When you reread a book, you read it again.",
    },
    {
      prompt: "What does the prefix “un-” mean in “unkind”?",
      right: "not",
      wrong: ["again", "before"],
      hint: "Someone who is unkind is not kind.",
    },
  ],
  2: [
    {
      prompt: "Which prefix means “before”?",
      right: "pre-",
      wrong: ["re-", "un-"],
      hint: "Think of “preheat”: to heat before cooking.",
    },
    {
      prompt: "Which suffix can mean “a person who”?",
      right: "-er",
      wrong: ["-less", "-ful"],
      hint: "Think of “teacher”: a person who teaches.",
    },
    {
      prompt: "What does the prefix “dis-” mean in “dislike”?",
      right: "not",
      wrong: ["again", "before"],
      hint: "If you dislike something, you do not like it.",
    },
    {
      prompt: "What does the suffix “-ful” mean in “thankful”?",
      right: "full of",
      wrong: ["without", "a person who"],
      hint: "Someone who is thankful is full of thanks.",
    },
    {
      prompt: "What does the suffix “-less” mean in “spotless”?",
      right: "without",
      wrong: ["full of", "again"],
      hint: "A spotless shirt has no spots: it is without spots.",
    },
  ],
  3: [
    {
      prompt: "What does the suffix “-ly” do in “slowly”?",
      right: "It tells how something is done.",
      wrong: ["It means “without.”", "It means “a person who.”"],
      hint: "“She walked slowly” tells how she walked: in a slow way.",
    },
    {
      prompt: "In “taller,” what does “-er” mean?",
      right: "more",
      wrong: ["a person who", "without"],
      hint: "Taller means more tall. The -er here compares two things.",
    },
    {
      prompt: "In “painter,” what does “-er” mean?",
      right: "a person who",
      wrong: ["more", "again"],
      hint: "A painter is a person who paints.",
    },
    {
      prompt: "In “disappear,” which prefix means “the opposite of”?",
      right: "dis-",
      wrong: ["re-", "pre-"],
      hint: "To disappear is the opposite of to appear.",
    },
  ],
};

/** [word, meaning, wrong meanings, level] */
const AFFIX_WORDS: [string, string, string[], Level][] = [
  ["unhappy", "not happy", ["happy again", "very happy"], 1],
  ["unkind", "not kind", ["kind again", "very kind"], 1],
  ["unsafe", "not safe", ["safe again", "very safe"], 1],
  ["redo", "do again", ["not do", "do before"], 1],
  ["reread", "read again", ["not read", "read before"], 1],
  ["refill", "fill again", ["not fill", "fill before"], 1],
  ["helpful", "full of help", ["without help", "help again"], 1],
  ["careful", "full of care", ["without care", "care again"], 1],
  ["fearless", "without fear", ["full of fear", "fear again"], 1],
  ["colourless", "without colour", ["full of colour", "colour again"], 1],
  ["preheat", "heat before", ["heat again", "not heat"], 2],
  ["prepay", "pay before", ["pay again", "not pay"], 2],
  ["dislike", "not like", ["like again", "like before"], 2],
  ["disagree", "not agree", ["agree again", "agree before"], 2],
  ["dishonest", "not honest", ["honest again", "very honest"], 2],
  ["painter", "a person who paints", ["paints again", "without paint"], 2],
  ["teacher", "a person who teaches", ["teaches again", "does not teach"], 2],
  ["builder", "a person who builds", ["builds again", "does not build"], 2],
  ["retell", "tell again", ["not tell", "tell before"], 2],
  ["hopeless", "without hope", ["full of hope", "hope again"], 2],
  ["slowly", "in a slow way", ["not slow", "slow again"], 3],
  ["bravely", "in a brave way", ["not brave", "brave again"], 3],
  ["quietly", "in a quiet way", ["not quiet", "quiet again"], 3],
  ["smaller", "more small", ["not small", "small again"], 3],
  ["rewrite", "write again", ["not write", "a person who writes"], 3],
  ["careless", "without care", ["full of care", "in a caring way"], 3],
  ["playful", "full of play", ["without play", "a person who plays"], 3],
  ["unlucky", "not lucky", ["lucky again", "full of luck"], 3],
];

/** What the prefix or suffix in `word` means, for hints. */
function wordPartNote(word: string, meaning: string): string {
  if (word.startsWith("un")) return "The prefix un- means not.";
  if (word.startsWith("dis")) return "The prefix dis- means not, or the opposite of.";
  if (word.startsWith("pre")) return "The prefix pre- means before.";
  if (word.startsWith("re")) return "The prefix re- means again.";
  if (word.endsWith("ful")) return "The suffix -ful means full of.";
  if (word.endsWith("less")) return "The suffix -less means without.";
  if (word.endsWith("ly")) return "The suffix -ly tells how: in a ___ way.";
  if (meaning.startsWith("more")) return "The suffix -er can mean more.";
  return "The suffix -er can mean a person who does something.";
}

function affixWordQuestion([word, meaning, wrong]: [string, string, string[], Level]): Question {
  return textChoice(
    `What does “${word}” mean?`,
    meaning,
    wrong,
    `${wordPartNote(word, meaning)} So “${word}” means “${meaning}.”`,
    { type: "equation", text: word },
  );
}

/** [meaning, word, wrong words, level] */
const WHICH_WORD: [string, string, string[], Level][] = [
  ["full of help", "helpful", ["helpless", "helper"], 1],
  ["without help", "helpless", ["helpful", "helper"], 1],
  ["full of fear", "fearful", ["fearless", "careful"], 1],
  ["without fear", "fearless", ["fearful", "careless"], 1],
  ["play again", "replay", ["player", "playful"], 1],
  ["not happy", "unhappy", ["happily", "happier"], 1],
  ["a person who helps", "helper", ["helpful", "helpless"], 2],
  ["a person who plays", "player", ["replay", "playful"], 2],
  ["paint again", "repaint", ["painter", "painted"], 2],
  ["heat before", "preheat", ["reheat", "heater"], 2],
  ["heat again", "reheat", ["preheat", "heater"], 2],
  ["in a kind way", "kindly", ["unkind", "kinder"], 2],
  ["full of colour", "colourful", ["colourless", "recolour"], 3],
  ["without colour", "colourless", ["colourful", "recolour"], 3],
  ["not kind", "unkind", ["kindly", "kinder"], 3],
  ["full of care", "careful", ["careless", "carefully"], 3],
];

function whichWordQuestion([meaning, word, wrong]: [string, string, string[], Level]): Question {
  return textChoice(
    `Which word means “${meaning}”?`,
    word,
    wrong,
    `Look at the word parts. ${wordPartNote(word, meaning)} So “${word}” means “${meaning}.”`,
  );
}

/** [word, base word, wrong answers] */
const BASE_WORDS: [string, string, string[]][] = [
  ["unhelpful", "help", ["unhelp", "helpful"]],
  ["repainted", "paint", ["repaint", "painted"]],
  ["unkindly", "kind", ["unkind", "kindly"]],
  ["replayed", "play", ["replay", "played"]],
  ["retelling", "tell", ["retell", "telling"]],
  ["unlocked", "lock", ["unlock", "locked"]],
  ["preheated", "heat", ["preheat", "heated"]],
  ["disagreed", "agree", ["disagree", "agreed"]],
  ["carefully", "care", ["careful", "fully"]],
  ["rebuilding", "build", ["rebuild", "building"]],
  ["unpacked", "pack", ["unpack", "packed"]],
  ["thankfully", "thank", ["thankful", "fully"]],
];

function baseWordQuestion([word, base, wrong]: [string, string, string[]]): Question {
  return textChoice(
    `What is the base word in “${word}”?`,
    base,
    wrong,
    `Take off the prefix and the suffix. The word left in the middle is the base word: ${word} → ${base}.`,
    { type: "equation", text: word },
  );
}

const AFFIX_SENTENCES: Item[] = [
  {
    prompt: "Be ___ when you carry a full glass of water.",
    right: "careful",
    wrong: ["careless", "helpless"],
    hint: "You want to be full of care so you don't spill. Which word means full of care?",
  },
  {
    prompt: "The ___ bakes fresh bread every morning.",
    right: "baker",
    wrong: ["baking", "bakes"],
    hint: "The blank needs a person. Which word means a person who bakes?",
  },
  {
    prompt: "I made a mistake, so I will ___ my sentence.",
    right: "rewrite",
    wrong: ["writer", "written"],
    hint: "You want to write it again. Which prefix means again?",
  },
  {
    prompt: "The ___ puppy chased its tail all day.",
    right: "playful",
    wrong: ["player", "replay"],
    hint: "The blank describes the puppy. Which word means full of play?",
  },
  {
    prompt: "It is ___ to cross the street without looking.",
    right: "unsafe",
    wrong: ["safely", "safety"],
    hint: "Crossing without looking is not safe. Which word means not safe?",
  },
  {
    prompt: "Kenji is ___, so he is not afraid of big waves.",
    right: "fearless",
    wrong: ["fearful", "fear"],
    hint: "He is not afraid. Which word means without fear?",
  },
  {
    prompt: "Please ___ the oven before you put the muffins in.",
    right: "preheat",
    wrong: ["heater", "heated"],
    hint: "You heat the oven before baking. Which prefix means before?",
  },
  {
    prompt: "The old shed fell down, so we will ___ it.",
    right: "rebuild",
    wrong: ["builder", "built"],
    hint: "You need to build it again. Which prefix means again?",
  },
  {
    prompt: "I ___ broccoli, but I love carrots.",
    right: "dislike",
    wrong: ["unlike", "liking"],
    hint: "The word “but” tells you the feeling about broccoli is different. Which word means not like?",
  },
  {
    prompt: "Ravi tiptoed ___ past the sleeping baby.",
    right: "quietly",
    wrong: ["quietness", "quieted"],
    hint: "The blank tells how Ravi tiptoed. Which word means in a quiet way?",
  },
  {
    prompt: "My little brother was ___ when his tower fell down.",
    right: "unhappy",
    wrong: ["happily", "happiness"],
    hint: "His tower fell, so he was not happy. Which word means not happy?",
  },
];

function prefixesSuffixes(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const wordsAt = (l: Level) => AFFIX_WORDS.filter((w) => w[3] === l);
  const whichAt = (l: Level) => WHICH_WORD.filter((w) => w[3] === l);
  if (level === 1) {
    return shuffle([
      ...sample(AFFIX_MEANINGS[1], 3).map((it) => ask(it)),
      ...sample(wordsAt(1), 3).map(affixWordQuestion),
      ...sample(whichAt(1), 2).map(whichWordQuestion),
    ]);
  }
  if (level === 2) {
    return shuffle([
      ...sample(AFFIX_MEANINGS[2], 2).map((it) => ask(it)),
      ...sample(wordsAt(2), 3).map(affixWordQuestion),
      ...sample([...whichAt(2), ...whichAt(3)], 2).map(whichWordQuestion),
      baseWordQuestion(pick(BASE_WORDS)),
    ]);
  }
  return shuffle([
    ask(pick(AFFIX_MEANINGS[3])),
    ...sample(wordsAt(3), 2).map(affixWordQuestion),
    ...sample(BASE_WORDS, 2).map(baseWordQuestion),
    ...sample(AFFIX_SENTENCES, 3).map((it) =>
      textChoice("Which word best completes the sentence?", it.right, it.wrong, it.hint, line(it.prompt)),
    ),
  ]);
}

// ---------- Word Pairs: synonyms, antonyms, homophones ----------

/** [word, answer, wrong answers] */
type Pair = [string, string, string[]];

const SYNONYMS: Record<Level, Pair[]> = {
  1: [
    ["big", "large", ["small", "soft"]],
    ["happy", "glad", ["sad", "tall"]],
    ["fast", "quick", ["slow", "loud"]],
    ["small", "little", ["big", "wet"]],
    ["shut", "close", ["open", "push"]],
    ["start", "begin", ["finish", "jump"]],
    ["shout", "yell", ["whisper", "sleep"]],
    ["gift", "present", ["party", "ribbon"]],
  ],
  2: [
    ["smart", "clever", ["silly", "sleepy"]],
    ["scared", "afraid", ["brave", "hungry"]],
    ["tired", "sleepy", ["awake", "thirsty"]],
    ["rock", "stone", ["stick", "leaf"]],
    ["easy", "simple", ["difficult", "noisy"]],
    ["pretty", "lovely", ["plain", "muddy"]],
    ["jump", "leap", ["crawl", "sit"]],
    ["quiet", "silent", ["noisy", "bright"]],
  ],
  3: [
    ["enormous", "gigantic", ["tiny", "ancient"]],
    ["angry", "furious", ["calm", "curious"]],
    ["sad", "gloomy", ["cheerful", "hungry"]],
    ["fast", "speedy", ["sluggish", "sturdy"]],
    ["funny", "hilarious", ["serious", "hollow"]],
    ["watch", "observe", ["ignore", "obey"]],
    ["shiny", "gleaming", ["dull", "sticky"]],
    ["brave", "courageous", ["timid", "careless"]],
  ],
};

const ANTONYMS: Record<Level, Pair[]> = {
  1: [
    ["hot", "cold", ["warm", "sunny"]],
    ["full", "empty", ["stuffed", "round"]],
    ["wet", "dry", ["damp", "blue"]],
    ["up", "down", ["high", "over"]],
    ["day", "night", ["morning", "sunny"]],
    ["push", "pull", ["shove", "kick"]],
    ["happy", "sad", ["glad", "funny"]],
    ["win", "lose", ["play", "beat"]],
  ],
  2: [
    ["early", "late", ["soon", "first"]],
    ["loud", "quiet", ["noisy", "bright"]],
    ["asleep", "awake", ["sleepy", "tired"]],
    ["before", "after", ["earlier", "during"]],
    ["float", "sink", ["drift", "swim"]],
    ["smooth", "rough", ["flat", "shiny"]],
    ["always", "never", ["often", "forever"]],
    ["deep", "shallow", ["low", "wide"]],
  ],
  3: [
    ["ancient", "modern", ["old", "broken"]],
    ["generous", "selfish", ["kind", "grateful"]],
    ["arrive", "depart", ["reach", "wander"]],
    ["whisper", "shout", ["murmur", "sing"]],
    ["polite", "rude", ["kind", "shy"]],
    ["expand", "shrink", ["grow", "stretch"]],
    ["include", "exclude", ["invite", "collect"]],
    ["victory", "defeat", ["prize", "success"]],
  ],
};

/** [sentence with a blank, answer, wrong words, what the answer means] */
const HOMOPHONES: Record<Level, [string, string, string[], string][]> = {
  1: [
    ["I can ___ a rainbow in the sky.", "see", ["sea"], "means to look with your eyes"],
    ["Fish and whales swim in the ___.", "sea", ["see"], "is a big body of salty water"],
    ["We ___ soup for lunch.", "ate", ["eight"], "means had food"],
    ["A spider has ___ legs.", "eight", ["ate"], "is the number 8"],
    ["The sky is bright ___ today.", "blue", ["blew"], "is a colour"],
    ["The wind ___ my hat off.", "blew", ["blue"], "means pushed with air"],
    ["Please ___ your name on the paper.", "write", ["right"], "means to put words on paper"],
    ["Turn ___ at the big tree.", "right", ["write"], "is a direction, the opposite of left"],
  ],
  2: [
    ["Can you ___ the birds singing?", "hear", ["here"], "means to listen with your ears"],
    ["Please put your boots over ___.", "here", ["hear"], "means in this place"],
    ["I picked a ___ for my mom.", "flower", ["flour"], "is a plant that blooms"],
    ["We need ___ to bake the bread.", "flour", ["flower"], "is a powder used for baking"],
    ["We ___ our bikes to the park.", "rode", ["road"], "means travelled on something"],
    ["Look both ways before you cross the ___.", "road", ["rode"], "is a street for cars"],
    ["There are seven days in a ___.", "week", ["weak"], "is seven days"],
    ["I need a new ___ of mittens.", "pair", ["pear"], "means two things that go together"],
    ["I ate a juicy green ___.", "pear", ["pair"], "is a fruit"],
    ["The ___ is in the mailbox.", "mail", ["male"], "is letters and packages"],
  ],
  3: [
    ["The children hung ___ coats on the hooks.", "their", ["there", "they're"], "means belonging to them"],
    ["___ going to the library after lunch.", "They're", ["There", "Their"], "is short for “they are”"],
    ["Please put the books over ___.", "there", ["their", "they're"], "means in that place"],
    ["I have ___ pet fish.", "two", ["to", "too"], "is the number 2"],
    ["We walked ___ the park.", "to", ["two", "too"], "shows where you are going"],
    ["This soup is ___ hot to eat.", "too", ["to", "two"], "means more than you want"],
    ["I ___ the answer!", "know", ["no"], "means to understand or have learned something"],
    ["The ___ ate berries in the forest.", "bear", ["bare"], "is a big furry animal"],
    ["The ___ was dark, and the stars were out.", "night", ["knight"], "is the time when it is dark"],
  ],
};

function synonymQuestion([word, right, wrong]: Pair, level: Level): Question {
  return textChoice(
    level === 1 ? `Which word means almost the same as “${word}”?` : `Which word is a synonym for “${word}”?`,
    right,
    wrong,
    `Synonyms are words that mean almost the same thing. You could swap “${word}” for “${right}” in a sentence.`,
  );
}

function antonymQuestion([word, right, wrong]: Pair, level: Level): Question {
  return textChoice(
    level === 1 ? `Which word means the opposite of “${word}”?` : `Which word is an antonym for “${word}”?`,
    right,
    wrong,
    `Antonyms are words with opposite meanings, like ${word} and ${right}.`,
  );
}

function homophoneQuestion([sentence, right, wrong, meaning]: [string, string, string[], string]): Question {
  return textChoice(
    "Which word correctly completes the sentence?",
    right,
    wrong,
    `Homophones sound the same but are spelled differently and mean different things. “${right}” ${meaning}.`,
    line(sentence),
  );
}

const PAIR_KINDS: Record<"homophones" | "synonyms" | "antonyms", { pairs: string[]; hint: string }> = {
  homophones: {
    pairs: ["night / knight", "sea / see", "flour / flower", "week / weak", "road / rode"],
    hint: "Homophones sound the same but have different spellings and meanings.",
  },
  synonyms: {
    pairs: ["glad / happy", "big / large", "shout / yell", "start / begin"],
    hint: "Synonyms are words that mean almost the same thing.",
  },
  antonyms: {
    pairs: ["early / late", "hot / cold", "push / pull", "float / sink"],
    hint: "Antonyms are words with opposite meanings.",
  },
};

function whichPairQuestion(): Question {
  const kinds = ["homophones", "synonyms", "antonyms"] as const;
  const kind = pick(kinds);
  return textChoice(
    `Which pair of words are ${kind}?`,
    pick(PAIR_KINDS[kind].pairs),
    kinds.filter((k) => k !== kind).map((k) => pick(PAIR_KINDS[k].pairs)),
    PAIR_KINDS[kind].hint,
  );
}

function wordPairs(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  // Never ask about the same word twice in one set.
  const syn = sample(SYNONYMS[level], 3);
  const ant = sample(
    ANTONYMS[level].filter(([w]) => !syn.some(([s]) => s === w)),
    3,
  );
  const [nSyn, nAnt, nHom] = level === 1 ? [3, 3, 2] : level === 2 ? [2, 2, 4] : [2, 2, 3];
  return shuffle([
    ...syn.slice(0, nSyn).map((p) => synonymQuestion(p, level)),
    ...ant.slice(0, nAnt).map((p) => antonymQuestion(p, level)),
    ...sample(HOMOPHONES[level], nHom).map(homophoneQuestion),
    ...(level === 3 ? [whichPairQuestion()] : []),
  ]);
}

// ---------- Sentence Smarts ----------

type SentenceType = "statement" | "question" | "exclamation" | "command";

const SENTENCE_TYPES: Record<SentenceType, { label: string; hint: string; examples: string[] }> = {
  statement: {
    label: "Statement (tells something)",
    hint: "It calmly tells a fact or an idea and ends with a period. That makes it a statement.",
    examples: [
      "My cousin lives near a lake.",
      "The library has new computers.",
      "We have art class on Tuesday.",
      "Bats sleep during the day.",
      "Our class planted beans in cups.",
      "The bus was a little late today.",
    ],
  },
  question: {
    label: "Question (asks something)",
    hint: "It asks something and ends with a question mark. That makes it a question.",
    examples: [
      "Where did you put the glue?",
      "How many legs does a crab have?",
      "Do you want to play soccer?",
      "Why do cats purr?",
      "When does the movie start?",
      "Who wants to read first?",
    ],
  },
  exclamation: {
    label: "Exclamation (shows strong feeling)",
    hint: "It shows a strong feeling, like excitement or surprise, and ends with an exclamation mark.",
    examples: [
      "What a huge pumpkin that is!",
      "Wow, we won the game!",
      "Hooray, the rain finally stopped!",
      "How beautiful the sunset is!",
      "Yay, it's my birthday!",
      "Oh no, I dropped my ice cream!",
    ],
  },
  command: {
    label: "Command (tells someone to do something)",
    hint: "It tells someone to do something. The person doing it is “you,” even though the word isn't written.",
    examples: [
      "Please hang up your coat.",
      "Put the paintbrushes in the sink.",
      "Close the door quietly.",
      "Wash your hands before lunch.",
      "Line up at the door, please.",
      "Take out your reading books.",
    ],
  },
};

function sentenceTypeQuestions(types: SentenceType[], choices: SentenceType[]): Question[] {
  const used = new Set<string>();
  return types.map((type) => {
    const t = SENTENCE_TYPES[type];
    const example = pick(t.examples.filter((e) => !used.has(e)));
    used.add(example);
    return textChoice(
      "What kind of sentence is this?",
      t.label,
      choices.filter((c) => c !== type).map((c) => SENTENCE_TYPES[c].label),
      t.hint,
      line(example),
    );
  });
}

/** [complete sentence, missing the naming part, missing the action part] */
const FRAGMENTS: [string, string, string][] = [
  ["The puppy chewed on a bone.", "Chewed on a bone.", "The puppy on a bone."],
  ["My sister plays the drums.", "Plays the drums.", "My sister and the drums."],
  ["The bright moon lit up the sky.", "Lit up the sky.", "The bright moon in the sky."],
  ["Our class visited a farm.", "Visited a farm.", "Our class at a farm."],
  ["Leo built a sandcastle.", "Built a sandcastle.", "Leo and a sandcastle."],
  ["The kettle whistled loudly.", "Whistled loudly.", "The noisy kettle on the stove."],
  ["A gentle rain fell all night.", "Fell all night.", "A gentle rain all night."],
  ["The ducks swam across the pond.", "Swam across the pond.", "The ducks across the pond."],
  ["Grandma knitted a warm scarf.", "Knitted a warm scarf.", "Grandma's warm scarf."],
  ["Two squirrels raced up the tree.", "Raced up the tree.", "Two squirrels up the tree."],
];

const COMPLETE_HINT =
  "A complete sentence needs two parts: who or what it is about (the subject) and what happens (the action).";

function completeQuestion(f: [string, string, string]): Question {
  return textChoice("Which is a complete sentence?", f[0], [f[1], f[2]], COMPLETE_HINT);
}

function notCompleteQuestion(f: [string, string, string], others: [string, string, string][]): Question {
  return textChoice(
    "Which is NOT a complete sentence?",
    pick([f[1], f[2]]),
    others.map((o) => o[0]),
    `${COMPLETE_HINT} Find the one with a part missing.`,
  );
}

const MISSING_SUBJECT = "Who or what it is about (the subject)";
const MISSING_ACTION = "What happens (the action)";

function missingPartQuestion(f: [string, string, string]): Question {
  const noSubject = chance(0.5);
  return textChoice(
    "What is missing from this group of words?",
    noSubject ? MISSING_SUBJECT : MISSING_ACTION,
    [noSubject ? MISSING_ACTION : MISSING_SUBJECT, "Nothing: it is a complete sentence"],
    noSubject
      ? "Ask: who or what did this? The words don't say, so the subject is missing."
      : "Ask: what did they do? There's no action word, so the action is missing.",
    line(noSubject ? f[1] : f[2]),
  );
}

/** [sentence with a blank, joining word, wrong words] */
const JOINERS: [string, string, string[]][] = [
  ["It started to rain, ___ we went inside.", "so", ["but", "or"]],
  ["I wanted to swim, ___ the pool was closed.", "but", ["so", "or"]],
  ["Would you like milk ___ juice?", "or", ["but", "so"]],
  ["Jay was hungry, ___ he made a sandwich.", "so", ["but", "or"]],
  ["The water was cold, ___ Zoe jumped in anyway.", "but", ["so", "or"]],
  ["Should we play outside ___ stay inside?", "or", ["so", "but"]],
  ["Priya likes carrots, ___ she does not like peas.", "but", ["so", "or"]],
  ["My plant was drooping, ___ I gave it water.", "so", ["but", "or"]],
  ["We wore our coats ___ it was cold outside.", "because", ["but", "or"]],
  ["Leo smiled ___ he found his lost mitten.", "because", ["but", "or"]],
];

const JOINER_HINT: Record<string, string> = {
  so: "“So” tells what happened as a result.",
  but: "“But” shows that the second part is different or surprising.",
  or: "“Or” gives a choice.",
  because: "“Because” gives a reason.",
};

function joinerQuestion([sentence, right, wrong]: [string, string, string[]]): Question {
  return textChoice(
    "Which joining word best completes the sentence?",
    right,
    wrong,
    `Read the sentence with each word. ${JOINER_HINT[right]}`,
    line(sentence),
  );
}

function sentenceSmarts(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const all: SentenceType[] = ["statement", "question", "exclamation", "command"];
  const frags = shuffle(FRAGMENTS);
  if (level === 1) {
    const three: SentenceType[] = ["statement", "question", "exclamation"];
    const types = [...shuffle(three), ...sample(three, 2)];
    return shuffle([...sentenceTypeQuestions(types, three), ...frags.slice(0, 3).map(completeQuestion)]);
  }
  if (level === 2) {
    return shuffle([
      ...sentenceTypeQuestions(shuffle(all), all),
      ...frags.slice(0, 2).map(completeQuestion),
      notCompleteQuestion(frags[2], [frags[3], frags[4]]),
      notCompleteQuestion(frags[5], [frags[6], frags[7]]),
    ]);
  }
  return shuffle([
    ...sentenceTypeQuestions(sample(all, 3), all),
    ...frags.slice(0, 2).map(missingPartQuestion),
    ...sample(JOINERS, 3).map(joinerQuestion),
  ]);
}

// ---------- Fact or Opinion ----------

interface Topic {
  name: string;
  emoji: string;
  fact: string;
  opinion: string;
  /** The word that shows `opinion` is an opinion, and two other words from it. */
  signal: string;
  others: [string, string];
  opinion2: string;
}

const TOPICS: Topic[] = [
  {
    name: "spiders",
    emoji: "🕷️",
    fact: "A spider has eight legs.",
    opinion: "Spiders are the creepiest animals.",
    signal: "creepiest",
    others: ["Spiders", "animals"],
    opinion2: "Spiders are more interesting than ants.",
  },
  {
    name: "penguins",
    emoji: "🐧",
    fact: "Penguins are birds that cannot fly.",
    opinion: "Penguins are the cutest birds.",
    signal: "cutest",
    others: ["Penguins", "birds"],
    opinion2: "Penguins look silly when they waddle.",
  },
  {
    name: "whales",
    emoji: "🐋",
    fact: "Whales are mammals.",
    opinion: "Whales are the most amazing animals.",
    signal: "amazing",
    others: ["Whales", "animals"],
    opinion2: "Whale watching is the best thing to do on a boat.",
  },
  {
    name: "winter",
    emoji: "❄️",
    fact: "In Canada, winter starts in December.",
    opinion: "Winter is the best season.",
    signal: "best",
    others: ["Winter", "season"],
    opinion2: "Winter is too cold to enjoy.",
  },
  {
    name: "strawberries",
    emoji: "🍓",
    fact: "Strawberries grow on low plants.",
    opinion: "Strawberries are the yummiest fruit.",
    signal: "yummiest",
    others: ["Strawberries", "fruit"],
    opinion2: "Strawberry jam is better than grape jam.",
  },
  {
    name: "soccer",
    emoji: "⚽",
    fact: "A soccer ball is round.",
    opinion: "Soccer is the most fun sport.",
    signal: "fun",
    others: ["Soccer", "sport"],
    opinion2: "Soccer is more exciting than basketball.",
  },
  {
    name: "rain",
    emoji: "🌧️",
    fact: "Rain is water that falls from clouds.",
    opinion: "Rainy days are boring.",
    signal: "boring",
    others: ["Rainy", "days"],
    opinion2: "Puddles are the best part of a rainy day.",
  },
  {
    name: "the moon",
    emoji: "🌕",
    fact: "The Moon moves around the Earth.",
    opinion: "The full moon is the most beautiful sight.",
    signal: "beautiful",
    others: ["moon", "sight"],
    opinion2: "A half moon is prettier than a full moon.",
  },
  {
    name: "cats",
    emoji: "🐱",
    fact: "Cats have whiskers.",
    opinion: "Cats make better pets than dogs.",
    signal: "better",
    others: ["Cats", "pets"],
    opinion2: "Orange cats are the friendliest cats.",
  },
  {
    name: "pizza",
    emoji: "🍕",
    fact: "Pizza is usually baked in an oven.",
    opinion: "Pizza is the tastiest lunch.",
    signal: "tastiest",
    others: ["Pizza", "lunch"],
    opinion2: "Pineapple tastes great on pizza.",
  },
  {
    name: "the alphabet",
    emoji: "🔤",
    fact: "There are 26 letters in the English alphabet.",
    opinion: "Z is the most interesting letter.",
    signal: "interesting",
    others: ["Z", "letter"],
    opinion2: "The letter A is the easiest letter to write.",
  },
  {
    name: "Canada",
    emoji: "🍁",
    fact: "Canada has ten provinces and three territories.",
    opinion: "Canada has the prettiest lakes in the world.",
    signal: "prettiest",
    others: ["Canada", "lakes"],
    opinion2: "Fall is the most colourful time of year in Canada.",
  },
  {
    name: "reading",
    emoji: "📚",
    fact: "A library lends books to people.",
    opinion: "Reading is more fun than drawing.",
    signal: "fun",
    others: ["Reading", "drawing"],
    opinion2: "Comic books are the most exciting books.",
  },
  {
    name: "the sun",
    emoji: "☀️",
    fact: "The sun rises in the east.",
    opinion: "Sunny days are the nicest days.",
    signal: "nicest",
    others: ["Sunny", "days"],
    opinion2: "Sunsets are prettier than sunrises.",
  },
];

const FACT_HINT = "A fact can be checked and proven true, for example in a book or by measuring.";
const OPINION_HINT = "An opinion tells what someone thinks or feels. Other people might not agree.";

function factOrOpinionQuestion(t: Topic): Question {
  const isFact = chance(0.5);
  const fact = { label: "Fact", emoji: "🔎" };
  const opinion = { label: "Opinion", emoji: "💭" };
  return textChoice(
    "Is this a fact or an opinion?",
    isFact ? fact : opinion,
    [isFact ? opinion : fact],
    isFact ? FACT_HINT : OPINION_HINT,
    line(isFact ? t.fact : pick([t.opinion, t.opinion2])),
  );
}

function whichFactQuestion(t: Topic, others: Topic[]): Question {
  return textChoice(
    "Which sentence is a fact?",
    t.fact,
    others.map((o) => o.opinion),
    `${FACT_HINT} The other sentences tell what someone thinks.`,
  );
}

function whichOpinionQuestion(t: Topic, others: Topic[]): Question {
  return textChoice(
    "Which sentence is an opinion?",
    pick([t.opinion, t.opinion2]),
    others.map((o) => o.fact),
    `${OPINION_HINT} The other sentences can be checked and proven.`,
  );
}

function sameTopicQuestion(t: Topic): Question {
  return textChoice(
    `Which sentence about ${t.name} is a fact?`,
    t.fact,
    [t.opinion, t.opinion2],
    `${FACT_HINT} Words like best, cutest and better are clues to an opinion.`,
  );
}

function signalWordQuestion(t: Topic): Question {
  return textChoice(
    "Which word shows that this sentence is an opinion?",
    t.signal,
    t.others,
    `Look for a word that shows a feeling or a judgment. Not everyone would agree that it's “${t.signal}.”`,
    line(t.opinion),
  );
}

function factSort(topics: Topic[], perBin: number): Question {
  const set: SortSet = {
    prompt: "Sort the sentences: fact or opinion?",
    hint: `${FACT_HINT} ${OPINION_HINT}`,
    bins: [
      { id: "fact", label: "Fact", emoji: "🔎" },
      { id: "opinion", label: "Opinion", emoji: "💭" },
    ],
    items: topics.flatMap((t) => [
      { label: t.fact, emoji: t.emoji, bin: "fact" },
      { label: t.opinion, emoji: t.emoji, bin: "opinion" },
    ]),
  };
  return sortQuestion(set, perBin);
}

function factOrOpinion(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const ts = shuffle(TOPICS);
  // ts[0..5] for single questions, ts[6..] for choices and the sort.
  const rest = ts.slice(6);
  if (level === 1) {
    return [
      ...shuffle([
        ...ts.slice(0, 5).map(factOrOpinionQuestion),
        whichFactQuestion(ts[5], rest.slice(0, 2)),
        whichOpinionQuestion(rest[2], rest.slice(3, 5)),
      ]),
      factSort(rest.slice(5), 2),
    ];
  }
  if (level === 2) {
    return [
      ...shuffle([
        ...ts.slice(0, 3).map(factOrOpinionQuestion),
        whichFactQuestion(ts[3], rest.slice(0, 2)),
        whichFactQuestion(ts[4], rest.slice(2, 4)),
        whichOpinionQuestion(ts[5], rest.slice(4, 6)),
        whichOpinionQuestion(rest[6], [rest[7], ts[0]]),
      ]),
      factSort(ts.slice(6), 3),
    ];
  }
  return [
    ...shuffle([
      ...ts.slice(0, 2).map(factOrOpinionQuestion),
      ...ts.slice(2, 4).map(sameTopicQuestion),
      ...ts.slice(4, 7).map(signalWordQuestion),
    ]),
    factSort(ts.slice(7), 3),
  ];
}

// ---------- ABC Order & Dictionary ----------

/** Words that share their first two letters, each with a different third letter. */
const ABC_GROUPS: string[][] = [
  ["bake", "ball", "band", "bat"],
  ["brave", "bread", "brick", "broom", "brush"],
  ["cabin", "camp", "car", "cat", "cave"],
  ["shark", "shell", "ship", "shoe", "shut"],
  ["stamp", "step", "stick", "storm", "stump"],
  ["paddle", "paint", "panda", "park", "path"],
  ["magnet", "map", "market", "mask", "maze"],
  ["train", "tree", "trick", "trophy", "truck"],
  ["flag", "flea", "flower", "flute", "fly"],
  ["grape", "green", "grin", "group", "grub"],
  ["space", "spell", "spider", "spoon", "spun"],
  ["plant", "plenty", "plot", "plum"],
];

const ABC_SINGLES = [
  "apple",
  "cloud",
  "dog",
  "duck",
  "egg",
  "fox",
  "goat",
  "hat",
  "igloo",
  "island",
  "jam",
  "jelly",
  "kite",
  "kettle",
  "lemon",
  "lion",
  "moon",
  "nest",
  "octopus",
  "owl",
  "queen",
  "rabbit",
  "rain",
  "sun",
  "tiger",
  "umbrella",
  "van",
  "whale",
  "yarn",
  "zebra",
];

const ABC_WORDS = [...ABC_GROUPS.flat(), ...ABC_SINGLES];

const byLetter = (letter: string) => ABC_WORDS.filter((w) => w[0] === letter);
const LETTERS = [...new Set(ABC_WORDS.map((w) => w[0]))].sort();
const abcSort = (words: string[]) => [...words].sort();

/** Two words with the same first letter but different second letters. */
function sameFirstPair(letters: string[]): [string, string] {
  const letter = pick(letters);
  const w1 = pick(byLetter(letter));
  const w2 = pick(byLetter(letter).filter((w) => w[1] !== w1[1]));
  return [w1, w2];
}

/** Letters that have at least two words with different second letters. */
const PAIR_LETTERS = LETTERS.filter((l) => new Set(byLetter(l).map((w) => w[1])).size >= 2);

/** One word from each of `count` different letters, none of them in `skip`. */
function differentLetters(count: number, skip: string[] = [], allowed: string[] = LETTERS): string[] {
  return sample(
    allowed.filter((l) => !skip.includes(l)),
    count,
  ).map((l) => pick(byLetter(l)));
}

function firstOrLastQuestion(words: string[], which: "first" | "last", level: Level): Question {
  const sorted = abcSort(words);
  const right = which === "first" ? sorted[0] : sorted[sorted.length - 1];
  const hint =
    level === 1
      ? "Look at the first letter of each word. Which letter comes " +
        (which === "first" ? "closest to A" : "closest to Z") +
        " in the alphabet?"
      : level === 2
        ? "When two words start with the same letter, look at the second letter to break the tie."
        : "These words start with the same two letters, so compare the third letter.";
  return textChoice(
    `Which word comes ${which} in ABC order?`,
    right,
    words.filter((w) => w !== right),
    `${hint} The answer is “${right}.”`,
  );
}

function abcOrderQuestion(words: string[], level: Level): OrderQuestion {
  return {
    kind: "order",
    prompt: "Put these words in ABC order.",
    hint:
      level === 1
        ? "Look at the first letter of each word, then sing through the alphabet."
        : level === 2
          ? "Start with the first letters. If two words start the same, look at the second letter."
          : "These words start the same way. Keep going letter by letter until they are different.",
    items: abcSort(words).map((label, i) => ({ id: `w${i}`, label })),
  };
}

function guideWordQuestion(pool: string[]): Question {
  const s = abcSort(sample(pool, 5));
  return textChoice(
    `A dictionary page has the guide words “${s[1]}” and “${s[3]}.” Which word is on that page?`,
    s[2],
    [s[0], s[4]],
    `Words on the page come between the guide words in ABC order: ${s[1]} … ${s[2]} … ${s[3]}.`,
  );
}

const DICTIONARY_PARTS: { word: string; part: string }[] = [
  { word: "apple", part: "Near the beginning" },
  { word: "bread", part: "Near the beginning" },
  { word: "cabin", part: "Near the beginning" },
  { word: "lemon", part: "In the middle" },
  { word: "magnet", part: "In the middle" },
  { word: "nest", part: "In the middle" },
  { word: "whale", part: "Near the end" },
  { word: "yarn", part: "Near the end" },
  { word: "zebra", part: "Near the end" },
];

function dictionaryPartQuestion(): Question {
  const { word, part } = pick(DICTIONARY_PARTS);
  return textChoice(
    `Where in a dictionary would you find the word “${word}”?`,
    part,
    ["Near the beginning", "In the middle", "Near the end"].filter((p) => p !== part),
    `A dictionary goes from A to Z. “${word}” starts with ${word[0]}, so it is ${part.toLowerCase()}.`,
  );
}

const DICTIONARY_FACTS: Item[] = [
  {
    prompt: "How are the words in a dictionary listed?",
    right: "In ABC order",
    wrong: ["From shortest to longest", "In no special order"],
    hint: "Dictionaries list words alphabetically, from A to Z, so they are easy to find.",
  },
  {
    prompt: "What do the guide words at the top of a dictionary page show?",
    right: "The first and last words on that page",
    wrong: ["The hardest words on the page", "The words that rhyme"],
    hint: "Guide words help you find the right page quickly. They match the first and last entries.",
  },
  {
    prompt: "Which of these can a dictionary tell you about a word?",
    right: "What it means and how to spell it",
    wrong: ["Who said it first", "What colour it is"],
    hint: "Dictionaries give each word's spelling and meaning, and often how to say it.",
  },
  {
    prompt: "Why are dictionary words in ABC order?",
    right: "So you can find words quickly",
    wrong: ["So the words rhyme", "So the book looks pretty"],
    hint: "Think about how long it would take to find a word if they were all mixed up!",
  },
];

function abcDictionary(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  if (level === 1) {
    return shuffle([
      firstOrLastQuestion(differentLetters(3), "first", 1),
      firstOrLastQuestion(differentLetters(3), "first", 1),
      firstOrLastQuestion(differentLetters(3), "first", 1),
      firstOrLastQuestion(differentLetters(3), "last", 1),
      firstOrLastQuestion(differentLetters(3), "last", 1),
      abcOrderQuestion(differentLetters(4), 1),
      abcOrderQuestion(differentLetters(4), 1),
      dictionaryPartQuestion(),
    ]);
  }
  if (level === 2) {
    // The pair shares a first letter; the third word sorts after (for "first") or before (for "last").
    const pairFirst = (): Question => {
      const pair = sameFirstPair(PAIR_LETTERS.filter((l) => LETTERS.some((m) => m > l)));
      const later = LETTERS.filter((m) => m > pair[0][0]);
      return firstOrLastQuestion([...pair, ...differentLetters(1, [], later)], "first", 2);
    };
    const pairLast = (): Question => {
      const pair = sameFirstPair(PAIR_LETTERS.filter((l) => LETTERS.some((m) => m < l)));
      const earlier = LETTERS.filter((m) => m < pair[0][0]);
      return firstOrLastQuestion([...pair, ...differentLetters(1, [], earlier)], "last", 2);
    };
    const orderSet = (): Question => {
      const pair = sameFirstPair(PAIR_LETTERS);
      return abcOrderQuestion([...pair, ...differentLetters(2, [pair[0][0]])], 2);
    };
    const bigLetters = LETTERS.filter((l) => byLetter(l).length >= 5);
    return shuffle([
      pairFirst(),
      pairFirst(),
      pairLast(),
      orderSet(),
      orderSet(),
      ...sample(bigLetters, 2).map((l) => guideWordQuestion(byLetter(l))),
      ask(pick(DICTIONARY_FACTS)),
    ]);
  }
  const groups = shuffle(ABC_GROUPS);
  const fives = groups.filter((g) => g.length >= 5);
  return shuffle([
    firstOrLastQuestion(sample(groups[0], 3), "first", 3),
    firstOrLastQuestion(sample(groups[1], 3), "last", 3),
    abcOrderQuestion(sample(groups[2], 4), 3),
    abcOrderQuestion(sample(groups[3], 4), 3),
    ...sample(fives, 3).map(guideWordQuestion),
    ask(pick(DICTIONARY_FACTS)),
  ]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "3",
  subject: "language",
  bigIdeas: {
    "ca-bc": [
      "Language and story can be a source of creativity and joy.",
      "Stories and other texts help us learn about ourselves, our families, and our communities.",
      "Stories and other texts can be shared through pictures and words.",
      "Everyone has a unique story to share.",
      "Through listening and speaking, we connect with others and share our world.",
      "Playing with language helps us discover how language works.",
      "Curiosity and wonder lead us to new discoveries about ourselves and the world around us.",
    ],
  },
  units: [
    {
      id: "read-and-think",
      title: "Read and Think",
      emoji: "📚",
      blurb: "Stories and true facts",
      parentNote:
        "Reading short original stories and non-fiction passages, then finding the main idea, details and order of events, making inferences and working out word meanings from context.",
      standards: {
        "ca-bc":
          "Reading strategies and metacognitive strategies; forms, functions and genres of stories and other texts (fiction and non-fiction)",
      },
      generate: readAndThink,
    },
    {
      id: "story-elements",
      title: "Story Elements",
      emoji: "🎭",
      blurb: "Characters, settings and plots",
      parentNote:
        "Naming the characters, setting, problem and solution of a story, describing how characters feel and what they are like, and finding a story's lesson.",
      standards: {
        "ca-bc": "Story/text: elements of story (character, setting, plot, problem and solution); literary elements",
      },
      generate: storyElements,
    },
    {
      id: "word-jobs",
      title: "Word Jobs",
      emoji: "🧩",
      blurb: "Nouns, verbs, adjectives, adverbs",
      parentNote:
        "Finding nouns (naming words), verbs (action words), adjectives (describing words) and adverbs (words that tell how) in sentences.",
      standards: {
        "ca-bc": "Language features, structures and conventions: sentence structure and grammar (parts of speech)",
      },
      generate: partsOfSpeech,
    },
    {
      id: "punctuation-power",
      title: "Punctuation Power",
      emoji: "✒️",
      blurb: "Commas, apostrophes and quotes",
      parentNote:
        "Choosing end marks, using commas in lists and dates, writing contractions and possessives with apostrophes, and putting quotation marks around speech.",
      standards: {
        "ca-bc":
          "Language features, structures and conventions: punctuation (end marks, commas, apostrophes, quotation marks)",
      },
      generate: punctuation,
    },
    {
      id: "spelling-patterns",
      title: "Spelling Patterns",
      emoji: "🐝",
      blurb: "Vowel teams and word endings",
      parentNote:
        "Spelling long vowel sounds with vowel teams (ai, ay, ee, ea, oa, ow, igh, ie) and adding -ed and -ing by doubling a letter, dropping a silent e or just adding the ending.",
      standards: {
        "ca-bc": "Language features, structures and conventions: spelling patterns (vowel teams; adding -ed and -ing)",
      },
      generate: spellingPatterns,
    },
    {
      id: "prefixes-suffixes",
      title: "Prefixes & Suffixes",
      emoji: "🔧",
      blurb: "Word parts that change meaning",
      parentNote:
        "Learning what prefixes (un-, re-, pre-, dis-) and suffixes (-ful, -less, -er, -ly) mean, finding base words and using new words in sentences.",
      standards: {
        "ca-bc": "Language features: word patterns (prefixes, suffixes and base words)",
      },
      generate: prefixesSuffixes,
    },
    {
      id: "word-pairs",
      title: "Word Pairs",
      emoji: "🔁",
      blurb: "Same, opposite and sound-alike",
      parentNote:
        "Synonyms (words that mean the same), antonyms (opposites) and homophones (words that sound alike but are spelled differently, like their, there and they're).",
      standards: {
        "ca-bc": "Language features: vocabulary and word patterns (synonyms, antonyms, homophones)",
      },
      generate: wordPairs,
    },
    {
      id: "sentence-smarts",
      title: "Sentence Smarts",
      emoji: "📝",
      blurb: "Kinds of sentences",
      parentNote:
        "Telling statements, questions, exclamations and commands apart, spotting incomplete sentences and joining ideas with so, but, or and because.",
      standards: {
        "ca-bc":
          "Language features, structures and conventions: sentence structure (sentence types, complete sentences, joining words)",
      },
      generate: sentenceSmarts,
    },
    {
      id: "fact-or-opinion",
      title: "Fact or Opinion?",
      emoji: "🤔",
      blurb: "Proven true or just a feeling?",
      parentNote:
        "Telling facts (which can be checked) from opinions (what someone thinks), and spotting opinion words like best and cutest.",
      standards: {
        "ca-bc": "Forms, functions and genres of texts; reading and thinking strategies (telling fact from opinion)",
      },
      generate: factOrOpinion,
    },
    {
      id: "abc-dictionary",
      title: "ABC Order & Dictionary",
      emoji: "🔤",
      blurb: "Find words fast",
      parentNote:
        "Putting words in alphabetical order to the first, second and third letter, and using dictionary guide words to find the right page.",
      standards: {
        "ca-bc": "Reading and metacognitive strategies: alphabetical order and dictionary skills",
      },
      generate: abcDictionary,
    },
  ],
};
