import { chance, pick, randInt, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, Visual } from "../../types";

// ---------- Shared helpers ----------

type Level = 1 | 2 | 3;

/** A hand-written multiple-choice item. `wrong` may hold extras; three are sampled. */
interface Item {
  level: Level;
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
  visual?: Visual;
}

function levelOf(opts?: GenerateOptions): Level {
  return opts?.difficulty ?? 2;
}

/** Pick `count` items, mostly at level `d`, topping up from nearby levels. */
function byLevel<T extends { level: Level }>(items: readonly T[], count: number, d: Level): T[] {
  const exact = shuffle(items.filter((i) => i.level === d));
  const near = shuffle(items.filter((i) => Math.abs(i.level - d) === 1));
  const far = shuffle(items.filter((i) => Math.abs(i.level - d) === 2));
  const keep = count - Math.floor(count / 4);
  return [...exact.slice(0, keep), ...shuffle([...exact.slice(keep), ...near]), ...far].slice(0, count);
}

function ask(item: Item): Question {
  return textChoice(item.prompt, item.right, sample(item.wrong, 3), item.hint, item.visual);
}

/** Take `n` items from each pool (by level) and shuffle them together. */
function mix(d: Level, parts: [readonly Item[], number][]): Question[] {
  return shuffle(parts.flatMap(([pool, n]) => byLevel(pool, n, d).map(ask)));
}

const say = (...lines: string[]): Visual => ({ type: "story", lines });
const cap = (w: string) => w[0].toUpperCase() + w.slice(1);

/** Fill the ___ blank, capitalizing when it starts the sentence. */
function fill(sentence: string, word: string): string {
  return sentence.startsWith("___") ? cap(word) + sentence.slice(3) : sentence.replace("___", word);
}

// ---------- Reading Detectives ----------

interface Passage {
  level: Level;
  title: string;
  paragraphs: string[];
  questions: Omit<Item, "level" | "visual">[];
}

const PASSAGES: Passage[] = [
  {
    level: 1,
    title: "The Window Garden",
    paragraphs: [
      "Ana's class wanted to make their classroom brighter. Ana had an idea: they could grow a garden on the wide window ledge.",
      "Each student planted one seed in a paper cup. They set the cups in a sunny row and took turns watering them. Ravi made a chart to track how tall each plant grew.",
      "After three weeks, the ledge was full of green leaves. Some plants even had tiny yellow flowers. The class agreed that the room felt cheerful, and they decided to plant herbs next.",
    ],
    questions: [
      {
        prompt: "What is this passage mostly about?",
        right: "A class grows a garden to brighten their room",
        wrong: ["How to make a paper cup", "Ravi learns to draw charts", "Why yellow flowers are the prettiest"],
        hint: "The main idea is what the WHOLE passage is about, not just one small part.",
      },
      {
        prompt: "What did Ravi do?",
        right: "He made a chart to track how tall the plants grew",
        wrong: ["He planted all the seeds by himself", "He picked the yellow flowers", "He painted the window ledge"],
        hint: "Look in the second paragraph for Ravi's name.",
      },
      {
        prompt: "Why do you think the class put the cups in a sunny row?",
        right: "Plants need sunlight to grow",
        wrong: ["To keep the cups from tipping over", "The teacher wanted them out of the way", "So the cups would stay cold"],
        hint: "Use what you know: what do plants need to grow? Sunlight is one thing!",
      },
      {
        prompt: "In this passage, what is a “ledge”?",
        right: "a narrow shelf, like the bottom edge of a window",
        wrong: ["a kind of seed", "a garden tool", "a chart for measuring plants"],
        hint: "Reread the first paragraph. The garden grew on the window ledge, so it's a place you can set cups.",
      },
      {
        prompt: "Which sentence is the best summary of the passage?",
        right: "Ana's class planted seeds by the window, cared for them and made their room more cheerful.",
        wrong: [
          "Ravi made a chart.",
          "Plants have leaves, and some have flowers.",
          "Ana's class read books about gardens.",
        ],
        hint: "A summary tells the most important ideas from the beginning, middle and end in just a few words.",
      },
      {
        prompt: "How did the class feel about their garden at the end?",
        right: "pleased with it",
        wrong: ["bored with it", "worried about it", "angry about it"],
        hint: "The class said the room felt cheerful and wanted to plant more. How would that make you feel?",
      },
    ],
  },
  {
    level: 1,
    title: "Sea Otters Stay Cozy",
    paragraphs: [
      "Sea otters live in the cold waters of the North Pacific Ocean. Unlike seals and whales, they do not have a thick layer of fat called blubber. Instead, they have very thick fur that keeps them warm.",
      "Sea otters spend a lot of time cleaning and fluffing their fur. This traps tiny bubbles of air, which help keep the cold water away from their skin.",
      "When they rest, sea otters often float on their backs. Sometimes they wrap themselves in long seaweed called kelp so they don't drift away while they sleep.",
    ],
    questions: [
      {
        prompt: "What is this passage mostly about?",
        right: "How sea otters stay warm and rest in the ocean",
        wrong: ["How to swim in cold water", "Why kelp grows so tall", "Animals that have blubber"],
        hint: "Think about what EVERY paragraph talks about. Each one is about sea otters and how they live in cold water.",
      },
      {
        prompt: "What keeps a sea otter warm?",
        right: "its very thick fur",
        wrong: ["a thick layer of blubber", "warm water near the shore", "a blanket of sand"],
        hint: "Reread the first paragraph. The word “Instead” tells you what otters have in place of blubber.",
      },
      {
        prompt: "In this passage, what is “kelp”?",
        right: "a long seaweed",
        wrong: ["a kind of fur", "a baby otter", "a layer of fat"],
        hint: "Look at the last paragraph. The words right after “kelp” and before it explain what it is.",
      },
      {
        prompt: "Why do sea otters wrap themselves in kelp?",
        right: "So they don't drift away while they sleep",
        wrong: ["To hide from the sun", "To keep their fur clean", "To save it for dinner"],
        hint: "The answer is in the last sentence. Look for the word “so”.",
      },
      {
        prompt: "Why is it important for a sea otter to keep its fur clean and fluffy?",
        right: "Fluffy fur traps air that keeps the cold water off its skin",
        wrong: ["So other otters will play with it", "So it can swim faster than fish", "So its fur changes colour"],
        hint: "Reread the second paragraph. What do the tiny air bubbles do?",
      },
      {
        prompt: "Which sentence is the best summary of the passage?",
        right: "Sea otters stay warm with thick, well-groomed fur and rest by floating on their backs.",
        wrong: ["Sea otters sleep in kelp.", "The ocean is very cold.", "Sea otters have blubber like whales."],
        hint: "A good summary includes the big ideas from the whole passage, not just one detail.",
      },
    ],
  },
  {
    level: 2,
    title: "Kenji's Early Morning",
    paragraphs: [
      "Kenji tiptoed into the kitchen before anyone else was awake. He took a bowl from the cupboard as quietly as he could, then held his breath when the door squeaked.",
      "He washed a handful of strawberries, sliced a banana with a butter knife and arranged the fruit in the shape of a smiling face. Then he folded a sheet of paper in half and drew a cake with candles on the front.",
      "When his grandmother came downstairs, the bowl and the card were waiting at her place at the table. She read the card, laughed, and gave Kenji a long hug.",
    ],
    questions: [
      {
        prompt: "Why did Kenji try to be so quiet?",
        right: "He wanted to keep his plan a surprise",
        wrong: ["He was afraid of the dark", "He wasn't allowed in the kitchen", "His grandmother asked him to be quiet"],
        hint: "Kenji was making something for someone. Why would you sneak around while making a gift?",
      },
      {
        prompt: "What was most likely the special occasion?",
        right: "his grandmother's birthday",
        wrong: ["the first day of school", "Kenji's birthday", "a class picnic"],
        hint: "Kenji drew a cake with candles and left the card at his grandmother's place. Put those clues together.",
      },
      {
        prompt: "What did Kenji draw on the card?",
        right: "a cake with candles",
        wrong: ["a smiling face", "a bowl of fruit", "a sleeping cat"],
        hint: "Careful! The smiling face was made of fruit. Look for what he drew on the paper.",
      },
      {
        prompt: "Which word best describes Kenji?",
        right: "thoughtful",
        wrong: ["lazy", "rude", "forgetful"],
        hint: "Think about what Kenji did for his grandmother. What does that show about him?",
      },
      {
        prompt: "“Kenji tiptoed into the kitchen.” What does “tiptoed” mean?",
        right: "walked quietly on his toes",
        wrong: ["ran very fast", "jumped up and down", "crawled on his knees"],
        hint: "Break it apart: tip + toe. Walking on the tips of your toes is a quiet way to move.",
      },
      {
        prompt: "How did Kenji's grandmother feel at the end?",
        right: "happy and loved",
        wrong: ["confused and upset", "tired and grumpy", "worried and nervous"],
        hint: "She laughed and gave Kenji a long hug. What feelings do those actions show?",
      },
      {
        prompt: "Which sentence is the best summary of the story?",
        right: "Kenji quietly made fruit and a card to surprise his grandmother.",
        wrong: ["Kenji's grandmother made him breakfast.", "Kenji sliced a banana.", "Kenji woke up early and went back to bed."],
        hint: "A summary tells who the story is about, what they did and how it turned out.",
      },
    ],
  },
  {
    level: 2,
    title: "Nature's Engineers",
    paragraphs: [
      "Beavers are sometimes called nature's engineers. An engineer is someone who designs and builds things, and beavers are amazing builders.",
      "Using their strong front teeth, beavers cut down small trees and branches. They pile the wood across a stream and pack the gaps with mud and stones. This dam slows the water and makes a deep pond.",
      "In the pond, beavers build a home called a lodge. Its entrance is underwater, which helps keep the family safe from predators such as wolves.",
      "Beaver ponds help other living things, too. Ducks, frogs, fish and moose often visit or live in the wetlands that beavers create.",
    ],
    questions: [
      {
        prompt: "What is the main idea of this passage?",
        right: "Beavers are skilled builders whose work changes the land around them",
        wrong: ["Beavers have strong front teeth", "Wolves are predators", "Ducks and frogs live in ponds"],
        hint: "The other choices are details. The main idea is the big idea that all the paragraphs support.",
      },
      {
        prompt: "Why does the author call beavers “engineers”?",
        right: "Because they design and build things",
        wrong: ["Because they drive trains", "Because they live underwater", "Because they eat wood"],
        hint: "The first paragraph tells you what an engineer is.",
      },
      {
        prompt: "What happens when beavers build a dam?",
        right: "The water slows down and forms a deep pond",
        wrong: ["The stream dries up forever", "The trees grow faster", "The fish swim away to the ocean"],
        hint: "This is cause and effect. Find the sentence that starts with “This dam…”.",
      },
      {
        prompt: "Why is an underwater entrance useful for a beaver lodge?",
        right: "Predators like wolves can't easily get in",
        wrong: ["It lets sunlight into the lodge", "It makes the lodge easy to find", "It keeps the pond from freezing"],
        hint: "Reread the third paragraph. It says the entrance helps keep the family safe.",
      },
      {
        prompt: "Which animals does the passage say use beaver ponds?",
        right: "ducks, frogs, fish and moose",
        wrong: ["wolves, bears and eagles", "cats, dogs and horses", "whales, seals and otters"],
        hint: "The last paragraph lists the animals.",
      },
      {
        prompt: "Which sentence is the best summary of the passage?",
        right: "Beavers build dams and lodges that make ponds, which help many animals.",
        wrong: ["Beavers have teeth.", "Moose like to visit ponds.", "Wolves live in the forest."],
        hint: "A summary covers the important ideas from the whole passage: what beavers build and why it matters.",
      },
    ],
  },
  {
    level: 2,
    title: "The Rainy-Day Plan",
    paragraphs: [
      "Priya and Leo had planned a lemonade stand to raise money for the animal shelter. On Saturday morning, dark clouds rolled in and rain began to pour.",
      "Leo groaned. “Nobody will buy lemonade in the rain.” Priya looked out at the wet street, then grinned. “Then let's sell something warm.”",
      "With permission, they set up a table in the lobby of the community centre. They sold warm cocoa and oatmeal cookies to people coming in from the storm. By the afternoon, they had raised more money than they had hoped.",
    ],
    questions: [
      {
        prompt: "What was the problem in the story?",
        right: "Rain spoiled their plan for a lemonade stand",
        wrong: ["They ran out of cookies", "The animal shelter was closed", "Leo forgot the lemons"],
        hint: "The problem usually shows up early in a story. Look at the first paragraph.",
      },
      {
        prompt: "How did Priya and Leo solve the problem?",
        right: "They sold warm treats inside the community centre",
        wrong: ["They waited for the rain to stop", "They gave up and went home", "They sold lemonade in the rain"],
        hint: "The solution is how the characters fix the problem. Reread the last paragraph.",
      },
      {
        prompt: "What does Priya's idea show about her?",
        right: "She is creative and doesn't give up easily",
        wrong: ["She doesn't like animals", "She is shy and quiet", "She is careless"],
        hint: "When the plan went wrong, Priya grinned and thought of a new plan. What does that tell you?",
      },
      {
        prompt: "Why did people want to buy cocoa and cookies?",
        right: "They wanted something warm on a cold, rainy day",
        wrong: ["The treats were free", "It was lunchtime at school", "Leo said the rain would stop soon"],
        hint: "Think about the weather. What would you want after coming in from a storm?",
      },
      {
        prompt: "“Leo groaned.” What does this tell you about how Leo felt?",
        right: "He felt disappointed",
        wrong: ["He felt excited", "He felt proud", "He felt sleepy"],
        hint: "A groan is a low sound people make when something goes wrong. Read what Leo says next.",
      },
      {
        prompt: "Why were Priya and Leo selling things?",
        right: "to raise money for the animal shelter",
        wrong: ["to buy new bikes", "to pay for a trip", "to win a contest"],
        hint: "The very first sentence tells you why.",
      },
    ],
  },
  {
    level: 3,
    title: "Why Leaves Change Colour",
    paragraphs: [
      "All summer long, the leaves of trees such as maples and birches are green. They get their colour from chlorophyll, a substance that helps leaves use sunlight to make food for the tree.",
      "In autumn, the days grow shorter and cooler. Many trees stop making chlorophyll, and the green colour slowly fades. As it disappears, yellow and orange colours that were hidden in the leaf all summer begin to show.",
      "Some leaves, like many maple leaves, also turn bright red. The red colour forms in autumn, especially when there are sunny days and cool nights.",
      "Eventually, the trees drop their leaves. Without leaves, they can rest through the winter and save energy until spring.",
    ],
    questions: [
      {
        prompt: "What is this passage mostly about?",
        right: "Why many trees' leaves change colour and fall in autumn",
        wrong: ["How to tell a maple from a birch", "What trees need to grow in spring", "Why winter is colder than summer"],
        hint: "Look at the title and ask what every paragraph is explaining.",
      },
      {
        prompt: "What gives leaves their green colour?",
        right: "chlorophyll",
        wrong: ["sunlight", "rainwater", "soil"],
        hint: "The first paragraph names the substance that makes leaves green.",
      },
      {
        prompt: "Why do yellow and orange colours appear in autumn?",
        right: "The green chlorophyll fades, so hidden colours can show",
        wrong: ["The tree makes yellow colour only in autumn", "Cold rain washes the green away", "The leaves soak up orange sunlight"],
        hint: "Reread the second paragraph. The yellow and orange were there all summer. What was covering them?",
      },
      {
        prompt: "An autumn has many sunny days and cool nights. What will you probably see?",
        right: "very bright red leaves",
        wrong: ["leaves that stay green all winter", "no leaf colours at all", "trees growing new leaves"],
        hint: "The third paragraph tells when red colours form best.",
      },
      {
        prompt: "In the last paragraph, what does “eventually” mean?",
        right: "after some time",
        wrong: ["right away", "never", "every day"],
        hint: "Leaves change colour first. Then, later on, they fall. “Eventually” tells you it happens later.",
      },
      {
        prompt: "Which sentence is the best summary of the passage?",
        right: "In autumn, trees stop making chlorophyll, so other colours show before the leaves fall.",
        wrong: [
          "Maple leaves are red.",
          "Leaves make food from sunlight in summer.",
          "Trees rest in winter and wake up in spring.",
        ],
        hint: "The best summary connects the most important ideas, not just one paragraph.",
      },
    ],
  },
  {
    level: 3,
    title: "The Mural",
    paragraphs: [
      "When Ms. Ortiz announced that the class would paint a mural on the school fence, Zoe's heart sank. Everyone knew Amir was the best artist in the class, and Zoe was sure her work would look messy next to his.",
      "On the first painting day, Zoe stood at the back holding a dry brush. Amir noticed. “Could you help me with the sky?” he asked. “You always pick the best colours.”",
      "Zoe mixed three shades of blue and swept them across the fence in long, wavy strokes. Soon other students were asking her which colours to use.",
      "When the mural was finished, Ms. Ortiz stepped back. “Every single person's work made this better,” she said. Zoe looked at her sky and decided she agreed.",
    ],
    questions: [
      {
        prompt: "How did Zoe feel at the beginning of the story?",
        right: "worried that her work wasn't good enough",
        wrong: ["excited to show off her art", "angry at Amir", "bored with painting"],
        hint: "Reread the first paragraph. Zoe compares her work to Amir's.",
      },
      {
        prompt: "“Zoe's heart sank.” What does this mean?",
        right: "Zoe suddenly felt disappointed or worried",
        wrong: ["Zoe felt very excited", "Zoe dropped her paintbrush", "Zoe was out of breath"],
        hint: "This is an expression, not a real sinking. When your heart “sinks,” your feelings drop.",
      },
      {
        prompt: "Why do you think Amir asked Zoe for help?",
        right: "He saw her standing apart and knew she was good with colours",
        wrong: ["He didn't know how to paint", "Ms. Ortiz told him to", "He wanted her to clean the brushes"],
        hint: "Amir “noticed” Zoe at the back. Then look at what he says about her colours.",
      },
      {
        prompt: "What is a lesson (theme) of this story?",
        right: "Everyone has something valuable to share",
        wrong: ["The best artist should do all the work", "Painting is easy for everyone", "It's better to work alone"],
        hint: "Ms. Ortiz says it at the end. A theme is a lesson the story teaches about life.",
      },
      {
        prompt: "How did Zoe change from the beginning to the end?",
        right: "She went from feeling unsure to feeling proud",
        wrong: ["She went from loving art to disliking it", "She went from being Amir's friend to being upset with him", "She did not change at all"],
        hint: "Compare how Zoe felt in the first paragraph with how she felt looking at her sky at the end.",
      },
      {
        prompt: "Which word best describes Amir in this story?",
        right: "kind",
        wrong: ["bossy", "careless", "jealous"],
        hint: "Amir noticed Zoe was left out and invited her to help. What kind of person does that?",
      },
    ],
  },
];

function reading(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return byLevel(PASSAGES, 2, d).flatMap((p) => {
    const visual: Visual = { type: "passage", title: p.title, paragraphs: p.paragraphs };
    // Keep the chosen questions in reading order (main idea first, summary last).
    const chosen = new Set(sample(p.questions, 4));
    return p.questions.filter((q) => chosen.has(q)).map((q) => ask({ ...q, level: p.level, visual }));
  });
}

// ---------- Text Features ----------

interface Toc {
  book: string;
  chapters: { name: string; page: number; about: string }[];
}

const TOCS: Toc[] = [
  {
    book: "Amazing Oceans",
    chapters: [
      { name: "Waves and Tides", page: 3, about: "to learn why the water at the beach rises and falls each day" },
      { name: "Life in the Shallows", page: 9, about: "to learn about crabs and sea stars that live near the shore" },
      { name: "The Deep Sea", page: 16, about: "to learn about creatures that live far below, where it is always dark" },
      { name: "Coral Reefs", page: 22, about: "to learn about colourful underwater structures built by tiny animals" },
      { name: "Protecting Our Oceans", page: 28, about: "to learn ways people can keep beaches clean" },
      { name: "Glossary", page: 33, about: "to find out what the word “plankton” means" },
      { name: "Index", page: 35, about: "to find every page that mentions whales" },
    ],
  },
  {
    book: "Wild Weather",
    chapters: [
      { name: "Sun and Seasons", page: 2, about: "to learn why summer days are longer than winter days" },
      { name: "Clouds", page: 8, about: "to learn about the white and grey shapes that float across the sky" },
      { name: "Rain and Snow", page: 13, about: "to learn what falls from the sky when water droplets get heavy" },
      { name: "Wind", page: 19, about: "to learn about moving air that can spin a pinwheel" },
      { name: "Thunderstorms", page: 24, about: "to learn why lightning flashes and thunder booms" },
      { name: "Glossary", page: 30, about: "to find out what the word “forecast” means" },
      { name: "Index", page: 32, about: "to find every page that mentions hail" },
    ],
  },
  {
    book: "Busy Bees",
    chapters: [
      { name: "Meet the Bees", page: 4, about: "to learn about different kinds of bees, such as bumblebees" },
      { name: "Inside the Hive", page: 10, about: "to learn about the wax rooms where young bees are raised" },
      { name: "Making Honey", page: 15, about: "to learn what bees do with the nectar they collect" },
      { name: "Bees and Flowers", page: 21, about: "to learn how bees carry pollen from plant to plant" },
      { name: "Helping Bees", page: 26, about: "to learn what people can do to keep bees safe" },
      { name: "Glossary", page: 30, about: "to find out what the word “pollinate” means" },
      { name: "Index", page: 31, about: "to find every page that mentions queen bees" },
    ],
  },
];

const tocVisual = (t: Toc): Visual => ({
  type: "table",
  title: `${t.book}: Table of Contents`,
  headers: ["Chapter", "Page"],
  rows: t.chapters.map((c) => [c.name, c.page]),
});

function tocQuestion(t: Toc, kind: "start" | "about" | "range"): Question {
  const visual = tocVisual(t);
  const content = t.chapters.filter((c) => c.name !== "Glossary" && c.name !== "Index");
  if (kind === "start") {
    const c = pick(content);
    return textChoice(
      `Look at the table of contents. On what page does “${c.name}” begin?`,
      String(c.page),
      sample(t.chapters.filter((o) => o !== c), 3).map((o) => String(o.page)),
      `Find “${c.name}” in the Chapter column, then read straight across to the page number.`,
      visual,
    );
  }
  if (kind === "about") {
    const c = pick(t.chapters);
    return textChoice(
      `Which part of this book should you use ${c.about}?`,
      c.name,
      sample(t.chapters.filter((o) => o !== c), 3).map((o) => o.name),
      "Read each title and ask which one fits the topic. Remember: a glossary explains words, and an index lists every page a topic is on.",
      visual,
    );
  }
  const i = randInt(0, content.length - 1);
  const c = content[i];
  const next = t.chapters[t.chapters.indexOf(c) + 1];
  const page = randInt(c.page + 1, next.page - 1);
  return textChoice(
    `Look at the table of contents. Page ${page} is part of which chapter?`,
    c.name,
    sample(t.chapters.filter((o) => o !== c), 3).map((o) => o.name),
    `A chapter runs from its start page until the next chapter begins. “${c.name}” starts on page ${c.page}, and the next chapter starts on page ${next.page}.`,
    visual,
  );
}

const WEATHER_INDEX: [string, string][] = [
  ["clouds", "8–12"],
  ["fog", "11"],
  ["hail", "17"],
  ["lightning", "24, 26"],
  ["rainbows", "15"],
  ["snowflakes", "16–17"],
  ["thunder", "25"],
  ["tornadoes", "28–29"],
];

const INDEX_ITEMS: Item[] = WEATHER_INDEX.map(([topic, pages]) => ({
  level: 2,
  prompt: `Use the index. Which page or pages tell about ${topic}?`,
  right: pages,
  wrong: WEATHER_INDEX.filter(([t]) => t !== topic).map(([, p]) => p),
  hint: `An index lists topics in ABC order. Find “${topic}” in the Topic column and read across to the pages.`,
  visual: {
    type: "table",
    title: "Wild Weather: Index",
    headers: ["Topic", "Pages"],
    rows: WEATHER_INDEX.map(([t, p]) => [t, p]),
  },
}));

const FEATURE_BANK: Item[] = [
  {
    level: 1,
    prompt: "Where in a book would you look to find what a word means?",
    right: "the glossary",
    wrong: ["the table of contents", "a caption", "a heading"],
    hint: "A glossary is like a small dictionary at the back of a book.",
  },
  {
    level: 1,
    prompt: "Which text feature tells you what a picture or photo shows?",
    right: "a caption",
    wrong: ["the glossary", "the index", "the table of contents"],
    hint: "A caption is the short line of words right beside or under a picture.",
  },
  {
    level: 1,
    prompt: "Which text feature at the front of a book lists the chapters and their page numbers?",
    right: "the table of contents",
    wrong: ["the index", "the glossary", "a caption"],
    hint: "It's at the FRONT of the book and shows the chapters in order.",
  },
  {
    level: 1,
    prompt: "A word in a nonfiction book is printed in dark, bold letters. What does that usually mean?",
    right: "It is an important word, often explained in the glossary",
    wrong: ["It is spelled wrong", "It is the author's name", "It is a word you can skip"],
    hint: "Authors use bold print to make key words stand out.",
  },
  {
    level: 1,
    prompt: "Which text feature shows where places are?",
    right: "a map",
    wrong: ["a glossary", "a caption", "a timeline"],
    hint: "This feature is a drawing of an area, showing places such as rivers, towns and roads.",
  },
  {
    level: 2,
    prompt: "What is the job of a heading?",
    right: "It tells what a section of the text is about",
    wrong: ["It explains what a word means", "It lists every page in the book", "It tells who wrote the book"],
    hint: "Headings are like titles for small parts of a text.",
  },
  {
    level: 2,
    prompt: "Why do authors add labels to a diagram?",
    right: "To name the parts of the picture",
    wrong: ["To show the page numbers", "To list the chapters", "To make the picture bigger"],
    hint: "Labels are words with lines pointing to parts of a picture.",
  },
  {
    level: 2,
    prompt: "You want to find every page that mentions volcanoes in a big science book. Where is the best place to look?",
    right: "the index",
    wrong: ["the table of contents", "the glossary", "the first caption"],
    hint: "The index is at the back. It lists topics in ABC order with ALL the pages where they appear.",
  },
  {
    level: 2,
    prompt: "Which sentence would make the best caption for a photo of a beaver dam?",
    right: "Beavers pile sticks and mud across a stream to build a dam.",
    wrong: ["Chapter 3: Forest Animals", "dam: a wall that holds back water", "beavers, 12, 15–17"],
    hint: "A caption is a sentence or two that tells about the picture. The others are a chapter title, a glossary entry and an index entry.",
  },
  {
    level: 2,
    prompt: "Which of these is a glossary entry?",
    right: "nectar: a sweet liquid made by flowers",
    wrong: ["Chapter 4: Making Honey", "Bees visit hundreds of flowers each day.", "nectar, 15, 18"],
    hint: "A glossary entry gives a word followed by what it means.",
  },
  {
    level: 2,
    prompt: "What does a chart or table help readers do?",
    right: "compare information quickly",
    wrong: ["find the meaning of a word", "learn who wrote the book", "see where a place is"],
    hint: "Tables put facts in rows and columns so you can look across and compare them.",
  },
  {
    level: 3,
    prompt: "What is the difference between a glossary and an index?",
    right: "A glossary gives meanings; an index gives page numbers",
    wrong: [
      "A glossary gives page numbers; an index gives meanings",
      "A glossary is at the front; an index is in the middle",
      "A glossary lists chapters; an index lists pictures",
    ],
    hint: "Both are at the back of the book. One explains words, and one tells you where to find topics.",
  },
  {
    level: 3,
    prompt: "Which of these is an index entry?",
    right: "pollen, 21–23",
    wrong: ["pollen: a yellow powder made by flowers", "Chapter 4: Bees and Flowers", "A bee covered in pollen visits a sunflower."],
    hint: "An index entry is a topic followed by page numbers.",
  },
  {
    level: 3,
    prompt: "What does a sidebar (a box beside the main text) usually give you?",
    right: "extra facts about the topic",
    wrong: ["a list of the chapters", "the page numbers for every topic", "the author's name"],
    hint: "A sidebar adds bonus information that connects to the main text.",
  },
  {
    level: 3,
    prompt: "A timeline is the best text feature for showing…",
    right: "events in the order they happened",
    wrong: ["the meanings of hard words", "the parts of a plant", "where places are on Earth"],
    hint: "A timeline is a line marked with dates from earliest to latest.",
  },
  {
    level: 3,
    prompt: "Why are the topics in an index listed in ABC order?",
    right: "So readers can find a topic quickly",
    wrong: ["So the chapters stay in order", "So the book looks longer", "So the most important topic is first"],
    hint: "Think about how you look up a name in a list. ABC order makes searching fast.",
  },
];

const HEADING_BANK: Item[] = [
  {
    level: 2,
    prompt: "Which heading best fits this section?",
    right: "What Pandas Eat",
    wrong: ["Where Pandas Live", "Baby Pandas", "How Pandas Sleep"],
    hint: "A good heading tells what the whole section is about. What does every sentence describe?",
    visual: {
      type: "passage",
      paragraphs: [
        "Giant pandas spend many hours each day eating. Almost all of their food is bamboo, and they munch on its stems, shoots and leaves.",
      ],
    },
  },
  {
    level: 2,
    prompt: "Which heading best fits this section?",
    right: "Life Under the Snow",
    wrong: ["How Snowflakes Form", "Winter Sports", "Birds That Fly South"],
    hint: "A good heading tells what the whole section is about. Where do the mice and voles spend the winter?",
    visual: {
      type: "passage",
      paragraphs: [
        "Snow can be like a blanket for small animals. Under the snow, mice and voles dig tunnels where they stay warm and hidden all winter.",
      ],
    },
  },
  {
    level: 2,
    prompt: "Which heading best fits this section?",
    right: "How to Make a Compass",
    wrong: ["The History of Maps", "Why Magnets Stick to Fridges", "Floating and Sinking"],
    hint: "These are steps for making something. What are you making?",
    visual: {
      type: "passage",
      paragraphs: [
        "Rub a sewing needle with a magnet about twenty times in the same direction. Push the needle through a small piece of cork. Float the cork in a bowl of water and watch the needle turn to point north and south.",
      ],
    },
  },
  {
    level: 3,
    prompt: "Which heading best fits this section?",
    right: "Built for Snow and Water",
    wrong: ["Moose Calves", "Amazing Antlers", "What Moose Sound Like"],
    hint: "Both sentences explain how a moose's body helps it move through its habitat.",
    visual: {
      type: "passage",
      paragraphs: [
        "A moose's long legs help it step through deep snow. Those same legs let it wade into lakes to eat water plants, and it can even swim across rivers.",
      ],
    },
  },
  {
    level: 3,
    prompt: "Which heading best fits this section?",
    right: "Cubs in the Den",
    wrong: ["What Bears Eat in Summer", "How Bears Catch Fish", "Bears Around the World"],
    hint: "Look for the main topic of both sentences: the cubs and where they are born.",
    visual: {
      type: "passage",
      paragraphs: [
        "A mother black bear usually gives birth in the middle of winter, inside a warm den. The tiny cubs drink milk and grow quickly until they are ready to leave the den in spring.",
      ],
    },
  },
];

function textFeatures(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const kinds: ("start" | "about" | "range")[] =
    d === 1 ? ["start", "start"] : d === 2 ? ["start", "about"] : ["about", "range"];
  const books = sample(TOCS, 2);
  const toc = kinds.map((k, i) => tocQuestion(books[i], k));
  return shuffle([...toc, ...mix(d, [[FEATURE_BANK, 4], [INDEX_ITEMS, 1], [HEADING_BANK, 1]])]);
}

// ---------- Figurative Language ----------

type Fig = "simile" | "metaphor" | "personification" | "onomatopoeia" | "alliteration" | "hyperbole";

const FIG_LABEL: Record<Fig, string> = {
  simile: "simile",
  metaphor: "metaphor",
  personification: "personification",
  onomatopoeia: "onomatopoeia",
  alliteration: "alliteration",
  hyperbole: "hyperbole (exaggeration)",
};

const FIG_ASK: Record<Fig, string> = {
  simile: "a simile",
  metaphor: "a metaphor",
  personification: "personification",
  onomatopoeia: "onomatopoeia",
  alliteration: "alliteration",
  hyperbole: "hyperbole (a big exaggeration)",
};

const FIG_HINT: Record<Fig, string> = {
  simile: "A simile compares two different things using “like” or “as”.",
  metaphor: "A metaphor compares by saying one thing IS another, without “like” or “as”.",
  personification: "Personification gives human actions or feelings to something that isn't human.",
  onomatopoeia: "Onomatopoeia is a word that sounds like the noise it names, like “sizzle” or “splash”.",
  alliteration: "Alliteration repeats the same beginning sound in words that are close together.",
  hyperbole: "Hyperbole is a huge exaggeration that isn't meant to be taken literally.",
};

const FIG_EXAMPLES: Record<Fig, string[]> = {
  simile: [
    "The snow was as soft as a pillow.",
    "Leo ran like a cheetah to catch the bus.",
    "The kitten's fur felt like warm velvet.",
    "The lake was as smooth as glass.",
    "My little brother is as busy as a squirrel in autumn.",
    "The icicles hung like glass fingers from the roof.",
  ],
  metaphor: [
    "The classroom was a zoo on the last day of school.",
    "The stars were diamonds in the night sky.",
    "Maya is a walking dictionary.",
    "The frozen pond was a mirror.",
    "The fog was a grey blanket over the town.",
    "Grandpa's garden is a rainbow of flowers.",
  ],
  personification: [
    "The sun smiled down on our picnic.",
    "The leaves danced in the autumn breeze.",
    "My alarm clock shouted at me to get up.",
    "The flowers nodded their heads in the rain.",
    "The trees waved their arms in the storm.",
    "The moon peeked out from behind a cloud.",
  ],
  onomatopoeia: [
    "The onions sizzled in the pan.",
    "Splash! Kenji jumped into the pool.",
    "The door creaked open slowly.",
    "The fire crackled and popped all night.",
    "Buzz! An insect zoomed past my ear.",
    "Woof! Our dog heard the doorbell.",
  ],
  alliteration: [
    "Seven silly seals slid down the slippery slope.",
    "Penny picked pretty purple petunias.",
    "Tiny turtles tumbled toward the tide.",
    "Lena likes lemon lollipops.",
    "Clever Carlos carried a crate of carrots.",
    "Fluffy feathers floated from the fence.",
  ],
  hyperbole: [
    "I'm so hungry I could eat a horse!",
    "This backpack weighs a ton!",
    "I've told you a million times to tie your shoes.",
    "We waited in line forever.",
    "I have a hundred things to do today!",
  ],
};

const FIG_TYPES: Record<Level, Fig[]> = {
  1: ["simile", "personification", "onomatopoeia", "alliteration"],
  2: ["simile", "metaphor", "personification", "onomatopoeia", "alliteration"],
  3: ["simile", "metaphor", "personification", "onomatopoeia", "alliteration", "hyperbole"],
};

/** Other kinds that can't be mistaken for `answer` (comparisons and exaggerations can overlap). */
function figOthers(answer: Fig, d: Level): Fig[] {
  const others = FIG_TYPES[d].filter((t) => t !== answer);
  const comparisons: Fig[] = ["simile", "metaphor"];
  if (answer === "hyperbole") return others.filter((t) => !comparisons.includes(t));
  if (comparisons.includes(answer)) return others.filter((t) => t !== "hyperbole");
  return others;
}

function figIdentify(type: Fig, d: Level): Question {
  return textChoice(
    "What kind of figurative language is in this sentence?",
    FIG_LABEL[type],
    sample(figOthers(type, d), 3).map((t) => FIG_LABEL[t]),
    FIG_HINT[type],
    say(pick(FIG_EXAMPLES[type])),
  );
}

function figWhich(type: Fig, d: Level): Question {
  return textChoice(
    `Which sentence uses ${FIG_ASK[type]}?`,
    pick(FIG_EXAMPLES[type]),
    sample(figOthers(type, d), 3).map((t) => pick(FIG_EXAMPLES[t])),
    FIG_HINT[type],
  );
}

const FIG_MEANING: Item[] = [
  {
    level: 1,
    prompt: "What does this simile mean?",
    visual: say("The lake was as smooth as glass."),
    right: "The water was very calm and flat.",
    wrong: ["The lake was made of glass.", "The water was very cold.", "The lake was full of boats."],
    hint: "Think about how glass feels: flat and smooth. The lake had no waves.",
  },
  {
    level: 1,
    prompt: "What does this simile mean?",
    visual: say("Leo ran like a cheetah to catch the bus."),
    right: "Leo ran very fast.",
    wrong: ["Leo ran on four legs.", "Leo ran slowly.", "Leo was chasing a cheetah."],
    hint: "Cheetahs are famous for being fast. What does that say about Leo?",
  },
  {
    level: 1,
    prompt: "What does this simile mean?",
    visual: say("The kitten's fur felt like warm velvet."),
    right: "The kitten's fur was very soft.",
    wrong: ["The kitten's fur was wet.", "The kitten was wearing clothes.", "The kitten's fur was prickly."],
    hint: "Velvet is a very soft cloth.",
  },
  {
    level: 1,
    prompt: "Which word is an example of onomatopoeia?",
    right: "crunch",
    wrong: ["happy", "table", "quickly"],
    hint: "Say each word out loud. Which one sounds like the noise it names?",
  },
  {
    level: 2,
    prompt: "What does this metaphor mean?",
    visual: say("The fog was a grey blanket over the town."),
    right: "Thick fog covered the whole town.",
    wrong: ["Someone put a blanket over the town.", "The town was painted grey.", "The fog was warm and cozy."],
    hint: "A blanket covers things. How is the fog like a blanket?",
  },
  {
    level: 2,
    prompt: "What does this metaphor mean?",
    visual: say("Maya is a walking dictionary."),
    right: "Maya knows the meanings of many words.",
    wrong: ["Maya carries a dictionary everywhere.", "Maya walks a lot.", "Maya writes dictionaries."],
    hint: "A dictionary is full of word meanings. What does that say about Maya?",
  },
  {
    level: 2,
    prompt: "What does this metaphor mean?",
    visual: say("The classroom was a zoo on the last day of school."),
    right: "The classroom was loud and wild.",
    wrong: ["There were animals in the classroom.", "The class went on a trip to the zoo.", "The classroom was quiet and calm."],
    hint: "Think about what a zoo is like: noisy and full of busy animals.",
  },
  {
    level: 2,
    prompt: "What is the difference between a simile and a metaphor?",
    right: "A simile uses “like” or “as”; a metaphor does not",
    wrong: [
      "A metaphor uses “like” or “as”; a simile does not",
      "A simile is about sounds; a metaphor is about colours",
      "A simile is always funny; a metaphor is always sad",
    ],
    hint: "Both compare two things. Only one uses the clue words “like” or “as”.",
  },
  {
    level: 3,
    prompt: "What does this metaphor mean?",
    visual: say("Grandpa's garden is a rainbow of flowers."),
    right: "The garden has flowers of many colours.",
    wrong: ["There is a rainbow over the garden.", "The garden has only one kind of flower.", "Grandpa painted his flowers."],
    hint: "A rainbow has many colours. What does that tell you about the flowers?",
  },
  {
    level: 3,
    prompt: "What does this sentence mean?",
    visual: say("Kai's good news was music to my ears."),
    right: "I was very happy to hear what Kai said.",
    wrong: ["Kai was singing a song.", "Kai spoke too loudly.", "I couldn't hear what Kai said."],
    hint: "Music is pleasant to listen to. How did the news make the listener feel?",
  },
  {
    level: 3,
    prompt: "What does this hyperbole mean?",
    visual: say("I'm so hungry I could eat a horse!"),
    right: "I am very, very hungry.",
    wrong: ["I want to eat a horse.", "I am not hungry at all.", "I am going horseback riding."],
    hint: "Hyperbole stretches the truth to make a point. The speaker is just really hungry!",
  },
  {
    level: 3,
    prompt: "What does this personification mean?",
    visual: say("Time crawled during the long car ride."),
    right: "The car ride felt very slow.",
    wrong: ["The clock fell on the floor.", "The car ride went by quickly.", "Someone crawled inside the car."],
    hint: "Time can't really crawl. Crawling is slow, so the ride felt slow.",
  },
];

function figurative(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const idTypes = sample(FIG_TYPES[d], 3);
  const whichTypes = sample(FIG_TYPES[d], 2);
  return shuffle([
    ...idTypes.map((t) => figIdentify(t, d)),
    ...whichTypes.map((t) => figWhich(t, d)),
    ...byLevel(FIG_MEANING, 3, d).map(ask),
  ]);
}

// ---------- Point of View ----------

interface Excerpt {
  level: Level;
  pov: "first" | "third";
  lines: string[];
  clue: string;
  hint?: string;
}

const EXCERPTS: Excerpt[] = [
  { level: 1, pov: "first", clue: "I", lines: ["I grabbed my skates and raced to the frozen pond.", "My friends were already gliding in circles."] },
  { level: 1, pov: "first", clue: "I", lines: ["I opened the box and gasped.", "Inside was a puppy with floppy ears!"] },
  { level: 1, pov: "first", clue: "we", lines: ["We set up our tent just before sunset.", "My sister and I could hear frogs singing by the lake."] },
  { level: 1, pov: "third", clue: "his", lines: ["Amir grabbed his skates and raced to the frozen pond.", "His friends were already gliding in circles."] },
  { level: 1, pov: "third", clue: "she", lines: ["Lena opened the box and gasped.", "Inside was a puppy with floppy ears!", "She hugged it right away."] },
  { level: 1, pov: "third", clue: "they", lines: ["The twins set up their tent just before sunset.", "They could hear frogs singing by the lake."] },
  {
    level: 2,
    pov: "first",
    clue: "I",
    lines: ["My stomach fluttered as I stepped onto the stage.", "I took a deep breath and began to sing.", "When the song ended, the audience clapped, and I grinned."],
  },
  {
    level: 2,
    pov: "first",
    clue: "I",
    lines: ["Our class planted a maple tree last spring.", "I got to pat down the soil around its roots.", "Now I check on it every morning."],
  },
  {
    level: 2,
    pov: "third",
    clue: "he",
    lines: ["Ravi's stomach fluttered as he stepped onto the stage.", "He took a deep breath and began to sing.", "When the song ended, the audience clapped, and he grinned."],
  },
  {
    level: 2,
    pov: "third",
    clue: "it",
    lines: ["The fox crept along the edge of the field.", "It sniffed the cool morning air, then trotted off toward the trees."],
  },
  {
    level: 2,
    pov: "third",
    clue: "they",
    lines: ["Noah and his grandfather fished from the dock all morning.", "They didn't catch a single fish, but they laughed the whole time."],
  },
  {
    level: 3,
    pov: "first",
    clue: "I",
    lines: ["My cousin Priya is the fastest runner I know.", "She won every race at the picnic, and I cheered the loudest."],
    hint: "The narrator talks about Priya using “she”, but the narrator also says “I cheered”. The narrator is in the story, so it's first person.",
  },
  {
    level: 3,
    pov: "first",
    clue: "me",
    lines: ["Grandma told me about the farm where she grew up.", "I loved hearing about her goats, especially the one that nibbled her hat."],
    hint: "The narrator says “told me” and “I loved”. The narrator is a character in the story, so it's first person.",
  },
  {
    level: 3,
    pov: "third",
    clue: "her",
    lines: ["“I can't find my library book!” Zoe called.", "Her brother helped her search under the couch until they found it."],
    hint: "The words inside quotation marks are what Zoe says. Outside the quotation marks, the narrator uses “her” and “they”, so it's third person.",
  },
  {
    level: 3,
    pov: "third",
    clue: "his",
    lines: ["“We should build a fort,” said Kenji.", "His cousins cheered and ran to get blankets."],
    hint: "“We” is inside quotation marks, so Kenji is the one saying it. The narrator says “said Kenji” and “His cousins”, so it's third person.",
  },
];

const POV_HINT = {
  first: "The narrator uses I, me, my or we and is a character in the story. That's first person.",
  third: "The narrator uses names and he, she, it or they and is not part of the story. That's third person.",
};

const POV_LABEL = { first: "first person", second: "second person", third: "third person" };

function povIdentify(e: Excerpt): Question {
  return textChoice(
    "From which point of view is this passage told?",
    POV_LABEL[e.pov],
    [POV_LABEL[e.pov === "first" ? "third" : "first"], POV_LABEL.second],
    e.hint ?? POV_HINT[e.pov],
    say(...e.lines),
  );
}

function povClue(e: Excerpt): Question {
  const others = e.pov === "first" ? ["he", "she", "they", "his"] : ["I", "me", "my", "we"];
  return textChoice(
    `This passage is told in ${POV_LABEL[e.pov]}. Which word is a clue?`,
    e.clue,
    sample(others, 3),
    e.pov === "first"
      ? "First-person clue words are I, me, my, we and our. They show the narrator is in the story."
      : "Third-person clue words are he, she, it, they, his and her (outside of quotation marks).",
    say(...e.lines),
  );
}

const REWRITES: { first: string; third: string; second: string }[] = [
  {
    first: "I packed my lunch and walked to school.",
    third: "Ana packed her lunch and walked to school.",
    second: "You packed your lunch and walked to school.",
  },
  {
    first: "We cheered when our team scored a goal.",
    third: "They cheered when their team scored a goal.",
    second: "You cheered when your team scored a goal.",
  },
  {
    first: "I fed my cat before I left for the park.",
    third: "Leo fed his cat before he left for the park.",
    second: "You fed your cat before you left for the park.",
  },
  {
    first: "My grandmother taught me how to knit a scarf.",
    third: "Priya's grandmother taught her how to knit a scarf.",
    second: "Your grandmother taught you how to knit a scarf.",
  },
  {
    first: "I tripped on the stairs, but I wasn't hurt.",
    third: "Sam tripped on the stairs, but he wasn't hurt.",
    second: "You tripped on the stairs, but you weren't hurt.",
  },
  {
    first: "We built a snow fort in our backyard.",
    third: "Kenji and Zoe built a snow fort in their backyard.",
    second: "You built a snow fort in your backyard.",
  },
];

function povRewrite(r: (typeof REWRITES)[number]): Question {
  const want = chance(0.5) ? "first" : "third";
  return textChoice(
    `Which sentence is written in ${POV_LABEL[want]}?`,
    r[want],
    [r[want === "first" ? "third" : "first"], r.second],
    POV_HINT[want],
  );
}

const POV_BANK: Item[] = [
  {
    level: 1,
    prompt: "In a story told in first person, the narrator…",
    right: "is a character who tells the story using I and me",
    wrong: ["is someone outside the story who uses he, she and they", "talks to the reader using you and your", "never says how they feel"],
    hint: "First person = the narrator is IN the story, telling about their own experiences.",
  },
  {
    level: 1,
    prompt: "Which pronouns does a third-person narrator use for the characters?",
    right: "he, she, they",
    wrong: ["I, me, my", "we, us, our", "you, your, yours"],
    hint: "A third-person narrator is outside the story, telling about other people.",
  },
  {
    level: 2,
    prompt: "A story says: “She waved goodbye to her friends.” Who is telling it?",
    right: "a narrator outside the story",
    wrong: ["the girl who is waving", "one of her friends", "the reader"],
    hint: "The narrator says “she” and “her”, not “I” or “my”. So the narrator isn't the girl.",
  },
  {
    level: 2,
    prompt: "A character's diary is usually written from which point of view?",
    right: "first person",
    wrong: ["third person", "second person"],
    hint: "In a diary, the writer tells about their own day using I and me.",
  },
  {
    level: 2,
    prompt: "A news story about a soccer game is usually written from which point of view?",
    right: "third person",
    wrong: ["first person", "second person"],
    hint: "A news reporter tells about what other people did, using names and he, she or they.",
  },
  {
    level: 3,
    prompt: "An autobiography is the story of the writer's own life. Which point of view does it use?",
    right: "first person",
    wrong: ["third person", "second person"],
    hint: "“Auto” means self. The writer tells their own story with I and me.",
  },
  {
    level: 3,
    prompt: "Why might an author choose to write a story in first person?",
    right: "To let readers see events through one character's eyes",
    wrong: ["So the story can have more characters", "So the story is shorter", "So the narrator can't share feelings"],
    hint: "In first person, readers hear the narrator's own thoughts and feelings.",
  },
  {
    level: 3,
    prompt: "You rewrite a first-person story in third person. What happens to words like “I” and “my”?",
    right: "They change to words like “she” and “her”",
    wrong: ["They change to words like “you” and “your”", "They stay the same", "They change to words like “we” and “our”"],
    hint: "Third person uses he, she, they, his, her and their.",
  },
];

function pointOfView(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const ex = byLevel(EXCERPTS, 4, d);
  return shuffle([
    ...ex.slice(0, 3).map(povIdentify),
    povClue(ex[3]),
    ...sample(REWRITES, 2).map(povRewrite),
    ...byLevel(POV_BANK, 2, d).map(ask),
  ]);
}

// ---------- Parts of Speech ----------

type Pos = "noun" | "verb" | "adjective" | "adverb" | "pronoun" | "preposition" | "conjunction";

const POS_ALL: Pos[] = ["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction"];
const POS_EASY: Pos[] = ["noun", "verb", "adjective", "pronoun"];
const POS_FOCUS: Pos[] = ["pronoun", "adverb", "preposition", "conjunction"];

const POS_A: Record<Pos, string> = {
  noun: "a noun",
  verb: "a verb",
  adjective: "an adjective",
  adverb: "an adverb",
  pronoun: "a pronoun",
  preposition: "a preposition",
  conjunction: "a conjunction",
};

const POS_HINT: Record<Pos, string> = {
  noun: "A noun names a person, place, thing or idea.",
  verb: "A verb is an action word, like run, eat or laughed.",
  adjective: "An adjective describes a noun. It tells what kind, how many or which one.",
  adverb: "An adverb describes a verb or an adjective. It often tells how, when or where, and many end in -ly.",
  pronoun: "A pronoun takes the place of a noun, like I, he, she, it, we, they or them.",
  preposition: "A preposition links a noun to the rest of the sentence, often telling where or when: under, behind, during.",
  conjunction: "A conjunction joins words or ideas: and, but, or, so, yet, because.",
};

interface Tagged {
  level: Level;
  sentence: string;
  words: [string, Pos][];
}

const TAGGED: Tagged[] = [
  { level: 1, sentence: "The tall girl kicked the ball.", words: [["tall", "adjective"], ["girl", "noun"], ["kicked", "verb"], ["ball", "noun"]] },
  { level: 1, sentence: "She painted a bright rainbow.", words: [["She", "pronoun"], ["painted", "verb"], ["bright", "adjective"], ["rainbow", "noun"]] },
  { level: 1, sentence: "My brother eats crunchy apples.", words: [["brother", "noun"], ["eats", "verb"], ["crunchy", "adjective"], ["apples", "noun"]] },
  { level: 1, sentence: "They built a huge snowman.", words: [["They", "pronoun"], ["built", "verb"], ["huge", "adjective"], ["snowman", "noun"]] },
  { level: 1, sentence: "We watched a funny movie.", words: [["We", "pronoun"], ["watched", "verb"], ["funny", "adjective"], ["movie", "noun"]] },
  { level: 1, sentence: "Leo found a shiny coin.", words: [["Leo", "noun"], ["found", "verb"], ["shiny", "adjective"], ["coin", "noun"]] },
  { level: 1, sentence: "He swam in the cold lake.", words: [["He", "pronoun"], ["swam", "verb"], ["in", "preposition"], ["cold", "adjective"], ["lake", "noun"]] },
  { level: 1, sentence: "It rolled under the big table.", words: [["It", "pronoun"], ["rolled", "verb"], ["under", "preposition"], ["big", "adjective"], ["table", "noun"]] },
  { level: 1, sentence: "Grandma bakes delicious bread.", words: [["Grandma", "noun"], ["bakes", "verb"], ["delicious", "adjective"], ["bread", "noun"]] },
  { level: 2, sentence: "Maya quietly opened the heavy door.", words: [["Maya", "noun"], ["quietly", "adverb"], ["opened", "verb"], ["heavy", "adjective"], ["door", "noun"]] },
  { level: 2, sentence: "The cat slept under the warm blanket.", words: [["cat", "noun"], ["slept", "verb"], ["under", "preposition"], ["warm", "adjective"], ["blanket", "noun"]] },
  {
    level: 2,
    sentence: "Ravi wanted pancakes, but we had waffles.",
    words: [["Ravi", "noun"], ["wanted", "verb"], ["pancakes", "noun"], ["but", "conjunction"], ["we", "pronoun"], ["had", "verb"], ["waffles", "noun"]],
  },
  { level: 2, sentence: "The children ran quickly across the field.", words: [["children", "noun"], ["ran", "verb"], ["quickly", "adverb"], ["across", "preposition"], ["field", "noun"]] },
  { level: 2, sentence: "Ana and Sam carried the box carefully.", words: [["Ana", "noun"], ["and", "conjunction"], ["carried", "verb"], ["box", "noun"], ["carefully", "adverb"]] },
  { level: 2, sentence: "We can walk to the park or ride our bikes.", words: [["We", "pronoun"], ["walk", "verb"], ["park", "noun"], ["or", "conjunction"], ["bikes", "noun"]] },
  { level: 2, sentence: "The bird sang loudly from the top of the tree.", words: [["bird", "noun"], ["sang", "verb"], ["loudly", "adverb"], ["from", "preposition"], ["tree", "noun"]] },
  { level: 2, sentence: "Kenji hid the present behind the couch.", words: [["Kenji", "noun"], ["hid", "verb"], ["present", "noun"], ["behind", "preposition"], ["couch", "noun"]] },
  { level: 2, sentence: "The sky was dark, so we stayed inside.", words: [["sky", "noun"], ["dark", "adjective"], ["so", "conjunction"], ["we", "pronoun"], ["stayed", "verb"]] },
  { level: 2, sentence: "Zoe gently placed the kitten in the basket.", words: [["Zoe", "noun"], ["gently", "adverb"], ["placed", "verb"], ["kitten", "noun"], ["in", "preposition"], ["basket", "noun"]] },
  { level: 2, sentence: "They laughed because the puppy sneezed.", words: [["They", "pronoun"], ["laughed", "verb"], ["because", "conjunction"], ["puppy", "noun"], ["sneezed", "verb"]] },
  { level: 2, sentence: "She waited patiently for her turn.", words: [["She", "pronoun"], ["waited", "verb"], ["patiently", "adverb"], ["for", "preposition"], ["turn", "noun"]] },
  { level: 3, sentence: "Priya ran fast during the race.", words: [["Priya", "noun"], ["ran", "verb"], ["fast", "adverb"], ["during", "preposition"], ["race", "noun"]] },
  {
    level: 3,
    sentence: "Amir woke up early, yet he still missed the bus.",
    words: [["Amir", "noun"], ["woke", "verb"], ["early", "adverb"], ["yet", "conjunction"], ["he", "pronoun"], ["missed", "verb"], ["bus", "noun"]],
  },
  {
    level: 3,
    sentence: "The very small kitten hid between two boxes.",
    words: [["very", "adverb"], ["small", "adjective"], ["kitten", "noun"], ["hid", "verb"], ["between", "preposition"], ["boxes", "noun"]],
  },
  {
    level: 3,
    sentence: "Before lunch, Noah read a story to them.",
    words: [["Before", "preposition"], ["lunch", "noun"], ["Noah", "noun"], ["read", "verb"], ["story", "noun"], ["them", "pronoun"]],
  },
  { level: 3, sentence: "The light from the lantern glowed softly.", words: [["light", "noun"], ["from", "preposition"], ["lantern", "noun"], ["glowed", "verb"], ["softly", "adverb"]] },
  {
    level: 3,
    sentence: "Lena's grandmother always tells wonderful stories.",
    words: [["grandmother", "noun"], ["always", "adverb"], ["tells", "verb"], ["wonderful", "adjective"], ["stories", "noun"]],
  },
  {
    level: 3,
    sentence: "We searched everywhere, but nobody found the key.",
    words: [["searched", "verb"], ["everywhere", "adverb"], ["but", "conjunction"], ["nobody", "pronoun"], ["key", "noun"]],
  },
];

function posWhatIs(t: Tagged, d: Level): Question {
  const allowed = d === 1 ? POS_EASY : POS_ALL;
  const options = t.words.filter(([, p]) => allowed.includes(p));
  const focus = options.filter(([, p]) => POS_FOCUS.includes(p));
  const [word, pos] = d > 1 && focus.length > 0 && chance(0.7) ? pick(focus) : pick(options);
  return textChoice(
    `In this sentence, what part of speech is “${word}”?`,
    pos,
    sample(allowed.filter((p) => p !== pos), 3),
    `Ask yourself what job “${word}” does in the sentence. ${POS_HINT[pos]}`,
    say(t.sentence),
  );
}

function posWhich(t: Tagged, d: Level): Question {
  const allowed = d === 1 ? POS_EASY : POS_ALL;
  const present = [...new Set(t.words.map(([, p]) => p))].filter((p) => allowed.includes(p));
  const focus = present.filter((p) => POS_FOCUS.includes(p));
  const pos = focus.length > 0 && chance(0.6) ? pick(focus) : pick(present);
  const [word] = pick(t.words.filter(([, p]) => p === pos));
  // One wrong word per other part of speech where possible, so choices are clearly different.
  const byPos = new Map<Pos, string>();
  for (const [w, p] of shuffle(t.words)) if (p !== pos && !byPos.has(p)) byPos.set(p, w);
  const wrong = sample([...byPos.values()], 3);
  return textChoice(
    `Which word in this sentence is ${POS_A[pos]}?`,
    word,
    wrong,
    POS_HINT[pos],
    say(t.sentence),
  );
}

const POS_BANK: Item[] = [
  {
    level: 1,
    prompt: "A pronoun takes the place of a…",
    right: "noun",
    wrong: ["verb", "adjective", "adverb"],
    hint: "Instead of saying “Maya” again, you can say “she”. Maya is a noun.",
  },
  {
    level: 1,
    prompt: "Which word is a pronoun?",
    right: "they",
    wrong: ["table", "jump", "green"],
    hint: POS_HINT.pronoun,
  },
  {
    level: 1,
    prompt: "Which word is an adjective?",
    right: "fuzzy",
    wrong: ["kitten", "purr", "sofa"],
    hint: POS_HINT.adjective,
  },
  {
    level: 2,
    prompt: "An adverb often tells…",
    right: "how, when or where something happens",
    wrong: ["the name of a person, place or thing", "what kind of thing a noun is", "which two ideas are joined together"],
    hint: "Adverbs like quickly, soon and outside describe actions.",
  },
  {
    level: 2,
    prompt: "Which word is a conjunction?",
    right: "because",
    wrong: ["beside", "beautiful", "began"],
    hint: POS_HINT.conjunction,
  },
  {
    level: 2,
    prompt: "Which word is a preposition?",
    right: "underneath",
    wrong: ["unhappy", "unpack", "uncle"],
    hint: POS_HINT.preposition,
  },
  {
    level: 2,
    prompt: "Which word is an adverb?",
    right: "slowly",
    wrong: ["sleepy", "snail", "sleep"],
    hint: POS_HINT.adverb,
  },
  {
    level: 3,
    prompt: "Which pronoun could replace “Maya and I” in “Maya and I walked home”?",
    right: "We",
    wrong: ["They", "Us", "She"],
    hint: "Maya and I = two people, and one of them is me. The pronoun for that group is “we”.",
  },
  {
    level: 3,
    prompt: "Which pronoun best completes the sentence? “The coach gave the medals to ___.”",
    right: "them",
    wrong: ["they", "we", "he"],
    hint: "After words like “to”, use object pronouns: me, him, her, us, them.",
  },
  {
    level: 3,
    prompt: "Which word best completes the sentence? “The baby is sleeping, so please talk ___.”",
    right: "quietly",
    wrong: ["loudly", "quiet", "quietness"],
    hint: "You need an adverb that tells HOW to talk. Many adverbs end in -ly.",
  },
  {
    level: 3,
    prompt: "In “The dog ran across the yard,” which word is a preposition?",
    right: "across",
    wrong: ["dog", "ran", "yard"],
    hint: "A preposition shows where: the dog ran ACROSS the yard.",
  },
];

function partsOfSpeech(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const sentences = byLevel(TAGGED, 6, d);
  return shuffle([
    ...sentences.slice(0, 4).map((t) => posWhatIs(t, d)),
    ...sentences.slice(4).map((t) => posWhich(t, d)),
    ...byLevel(POS_BANK, 2, d).map(ask),
  ]);
}

// ---------- Super Sentences ----------

const CONJ_HINT = "Think about how the two ideas connect: “and” adds, “but” and “yet” show a surprise or contrast, “or” gives a choice, “so” shows a result.";

const CONJ_BANK: Item[] = [
  {
    level: 1,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("Jay wanted to go swimming, ___ the pool was closed."),
    right: "but",
    wrong: ["and", "or", "so"],
    hint: CONJ_HINT,
  },
  {
    level: 1,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("Amir set the table, ___ Priya poured the juice."),
    right: "and",
    wrong: ["but", "or", "so"],
    hint: CONJ_HINT,
  },
  {
    level: 1,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("Do you want to read a book, ___ would you rather draw?"),
    right: "or",
    wrong: ["and", "but", "so"],
    hint: CONJ_HINT,
  },
  {
    level: 1,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("The road was icy, ___ Dad drove slowly."),
    right: "so",
    wrong: ["but", "or"],
    hint: CONJ_HINT,
  },
  {
    level: 2,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("Ravi forgot his umbrella, ___ he got wet in the rain."),
    right: "so",
    wrong: ["but", "or"],
    hint: CONJ_HINT,
  },
  {
    level: 2,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("Ana likes carrots, ___ she does not like peas."),
    right: "but",
    wrong: ["or", "so"],
    hint: CONJ_HINT,
  },
  {
    level: 2,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("We could eat lunch now, ___ we could wait until after the hike."),
    right: "or",
    wrong: ["so", "because"],
    hint: CONJ_HINT,
  },
  {
    level: 3,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("The puppy was tiny, ___ it barked like a big dog."),
    right: "yet",
    wrong: ["so", "or", "for"],
    hint: "“Yet” works like “but”: it shows something surprising. A tiny puppy with a big bark is a surprise!",
  },
  {
    level: 3,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("Kenji doesn't like spiders, ___ does he like snakes."),
    right: "nor",
    wrong: ["or", "so", "yet"],
    hint: "“Nor” adds a second “not” idea: he doesn't like spiders, and he doesn't like snakes either.",
  },
  {
    level: 3,
    prompt: "Which conjunction best completes this compound sentence?",
    visual: say("We packed extra sweaters, ___ the night would be cold."),
    right: "for",
    wrong: ["or", "yet", "nor"],
    hint: "Here “for” means “because”. Why did they pack sweaters? Because the night would be cold.",
  },
];

const COMPLETE_HINT = "A complete sentence has a subject (who or what) and a verb (what they do or are), and it shares a complete thought.";

const FRAGMENT_BANK: Item[] = [
  {
    level: 1,
    prompt: "Which is a complete sentence?",
    right: "The puppy chased the ball.",
    wrong: ["Chased the ball across the yard.", "The fluffy little puppy.", "Across the yard and over the fence."],
    hint: COMPLETE_HINT,
  },
  {
    level: 1,
    prompt: "Which is a complete sentence?",
    right: "My aunt bakes bread on Sundays.",
    wrong: ["Bakes bread on Sundays.", "My aunt in the kitchen.", "Every Sunday morning."],
    hint: COMPLETE_HINT,
  },
  {
    level: 1,
    prompt: "Which is a fragment (not a complete sentence)?",
    right: "The green frog on the lily pad.",
    wrong: ["The green frog jumped.", "A frog sat on the lily pad.", "The frog croaked loudly."],
    hint: "A fragment is missing a subject or a verb. What did the frog DO? The fragment doesn't say.",
  },
  {
    level: 2,
    prompt: "Which is a fragment (not a complete sentence)?",
    right: "Because the bus was late.",
    wrong: ["The bus was late.", "We waited because the bus was late.", "The bus came at last."],
    hint: "A group of words starting with “because” needs another part to finish the thought. Because the bus was late… what happened?",
  },
  {
    level: 2,
    prompt: "Which is a fragment (not a complete sentence)?",
    right: "Running down the hallway.",
    wrong: ["Sam ran down the hallway.", "The hallway was quiet.", "We walked down the hallway."],
    hint: "Who was running? A fragment is missing a subject or doesn't finish the thought.",
  },
  {
    level: 2,
    prompt: "Which is a complete sentence?",
    right: "The students cheered loudly.",
    wrong: ["The students in the gym.", "Cheering loudly in the gym.", "When the students cheered."],
    hint: COMPLETE_HINT,
  },
  {
    level: 3,
    prompt: "Which is a complete sentence?",
    right: "Wait here.",
    wrong: ["After the game ends.", "The players on the bench.", "Waiting by the door."],
    hint: "A command is complete even when it's short. In “Wait here,” the subject “you” is understood.",
  },
  {
    level: 3,
    prompt: "Which is the best way to fix this fragment: “After school ended.”?",
    right: "After school ended, we played tag.",
    wrong: ["After school, ended.", "After school ended, and.", "After. School ended we."],
    hint: "The fragment needs a second part that tells what happened after school ended.",
  },
  {
    level: 3,
    prompt: "Which is a fragment (not a complete sentence)?",
    right: "The tall tree beside the river.",
    wrong: ["Stop!", "The tall tree swayed.", "It rained."],
    hint: "Short sentences can still be complete. Look for the one with no verb: what did the tree do?",
  },
];

const COMPOUND_HINT = "A compound sentence joins two complete sentences with a comma and a joining word like and, but, or or so.";
const RUNON_HINT = "A run-on squishes two complete sentences together without a joining word or a period between them.";

const COMPOUND_BANK: Item[] = [
  {
    level: 1,
    prompt: "Which is a compound sentence?",
    right: "The bell rang, and the students lined up.",
    wrong: ["The students lined up at the door.", "Lining up at the door.", "The bell rang loudly."],
    hint: COMPOUND_HINT,
  },
  {
    level: 1,
    prompt: "Which is a simple sentence (one complete thought)?",
    right: "Our cat sleeps in the sun.",
    wrong: ["Our cat sleeps, and our dog plays.", "Our cat was tired, so she slept in the sun.", "Our cat likes naps, but she also likes to play."],
    hint: "A simple sentence has just one complete thought. The others join two thoughts with and, so or but.",
  },
  {
    level: 2,
    prompt: "Which is a compound sentence?",
    right: "I wanted to play, but it was too dark.",
    wrong: ["I wanted to play outside after dinner.", "Maya and Leo played tag.", "Because it was too dark."],
    hint: COMPOUND_HINT,
  },
  {
    level: 2,
    prompt: "Which is a run-on sentence?",
    right: "The movie ended we walked home.",
    wrong: ["The movie ended, so we walked home.", "The movie ended. We walked home.", "We walked home after the movie."],
    hint: RUNON_HINT,
  },
  {
    level: 2,
    prompt: "Which is a run-on sentence?",
    right: "Sam likes art he paints every day.",
    wrong: ["Sam likes art, and he paints every day.", "Sam likes art. He paints every day.", "Sam paints every day."],
    hint: RUNON_HINT,
  },
  {
    level: 2,
    prompt: "Which is the best way to fix this run-on: “It was snowing we built a snowman.”?",
    right: "It was snowing, so we built a snowman.",
    wrong: ["It was snowing we, built a snowman.", "It, was snowing we built a snowman.", "It was snowing and, we built a snowman."],
    hint: "Fix a run-on by adding a comma plus a joining word (and, but, so) between the two complete thoughts.",
  },
  {
    level: 3,
    prompt: "Which is a run-on sentence?",
    right: "The sun came out, we went to the beach.",
    wrong: ["The sun came out, so we went to the beach.", "When the sun came out, we went to the beach.", "The sun came out. We went to the beach."],
    hint: "A comma alone can't join two complete sentences. They need a joining word like so, or a period.",
  },
  {
    level: 3,
    prompt: "Which is a simple sentence (one complete thought)?",
    right: "Maya and her brother rode their bikes to the park.",
    wrong: ["Maya rode her bike, and her brother walked.", "Maya rode her bike, but her brother stayed home.", "Maya wanted to ride, so she found her helmet."],
    hint: "A sentence can have two people in its subject and still be simple. Look for the one that is NOT two sentences joined together.",
  },
];

const AGREEMENT_BANK: Item[] = [
  {
    level: 1,
    prompt: "Which verb correctly completes the sentence?",
    visual: say("The dogs ___ in the yard."),
    right: "play",
    wrong: ["plays", "playing"],
    hint: "“Dogs” means more than one, so use the verb without -s: the dogs play.",
  },
  {
    level: 1,
    prompt: "Which verb correctly completes the sentence?",
    visual: say("My sister ___ to school."),
    right: "walks",
    wrong: ["walk", "walking"],
    hint: "“My sister” is one person, so the verb needs an -s: she walks.",
  },
  {
    level: 1,
    prompt: "Which verb correctly completes the sentence?",
    visual: say("Yesterday, we ___ to the museum."),
    right: "went",
    wrong: ["go", "will go", "goes"],
    hint: "“Yesterday” means it already happened, so you need the past tense.",
  },
  {
    level: 2,
    prompt: "Which verb correctly completes the sentence?",
    visual: say("Ana and Leo ___ in the choir."),
    right: "sing",
    wrong: ["sings", "singing"],
    hint: "Ana and Leo are two people, so use the verb without -s: they sing.",
  },
  {
    level: 2,
    prompt: "Which verb correctly completes the sentence?",
    visual: say("Tomorrow, Ravi ___ his grandparents."),
    right: "will visit",
    wrong: ["visited", "has visited"],
    hint: "“Tomorrow” hasn't happened yet, so use the future tense with “will”.",
  },
  {
    level: 2,
    prompt: "Which verb correctly completes the sentence?",
    visual: say("Last winter, the lake ___ solid."),
    right: "froze",
    wrong: ["freezes", "will freeze"],
    hint: "“Last winter” is in the past, so use the past tense.",
  },
  {
    level: 3,
    prompt: "Which sentence uses the correct verb?",
    right: "The box of crayons is on the shelf.",
    wrong: ["The box of crayons are on the shelf.", "The box of crayons were on the shelf."],
    hint: "What is on the shelf? The BOX (one box), so use “is”. “Of crayons” just describes the box.",
  },
  {
    level: 3,
    prompt: "Which sentence uses the correct verb?",
    right: "Each of the students has a pencil.",
    wrong: ["Each of the students have a pencil.", "Each of the students having a pencil."],
    hint: "“Each” means each one, so it takes a singular verb: each has.",
  },
  {
    level: 3,
    prompt: "Which sentence is written in the future tense?",
    right: "We will plant tulips in the fall.",
    wrong: ["We planted tulips in the fall.", "We plant tulips every fall.", "We were planting tulips."],
    hint: "The future tense tells what is going to happen. Look for the helping word “will”.",
  },
  {
    level: 3,
    prompt: "Which sentence is written in the past tense?",
    right: "Zoe caught the ball with one hand.",
    wrong: ["Zoe catches the ball with one hand.", "Zoe will catch the ball with one hand."],
    hint: "The past tense tells what already happened.",
  },
];

function sentences(opts?: GenerateOptions): Question[] {
  return mix(levelOf(opts), [
    [CONJ_BANK, 2],
    [FRAGMENT_BANK, 2],
    [COMPOUND_BANK, 2],
    [AGREEMENT_BANK, 2],
  ]);
}

// ---------- Punctuation Power ----------

const OWNERS_ONE: [string, string][] = [
  ["dog", "bone"],
  ["teacher", "desk"],
  ["bird", "nest"],
  ["baby", "blanket"],
  ["coach", "whistle"],
  ["farmer", "tractor"],
];

const NAMES_ONE: [string, string][] = [
  ["Maya", "backpack"],
  ["Ravi", "kite"],
  ["Lena", "scooter"],
  ["Noah", "drum"],
];

const OWNERS_MANY: [string, string][] = [
  ["girls", "bikes"],
  ["players", "jerseys"],
  ["students", "projects"],
  ["cousins", "sleeping bags"],
  ["teachers", "coffee mugs"],
];

const OWNERS_IRREGULAR: [string, string, string][] = [
  ["child", "children", "toys"],
  ["woman", "women", "bikes"],
  ["person", "people", "ideas"],
  ["mouse", "mice", "tails"],
  ["goose", "geese", "feathers"],
];

function possessiveName(): Question {
  const [name, thing] = pick(NAMES_ONE);
  return textChoice(
    `Which correctly shows the ${thing} that belongs to ${name}?`,
    `${name}'s ${thing}`,
    [`${name}s ${thing}`, `${name}s' ${thing}`],
    `To show that something belongs to one person, add an apostrophe and s: ${name}'s.`,
  );
}

function possessiveOne(): Question {
  const [owner, thing] = pick(OWNERS_ONE);
  const plural = owner.endsWith("ch") ? `${owner}es` : `${owner === "baby" ? "babie" : owner}s`;
  return textChoice(
    `Which correctly shows the ${thing} that belongs to one ${owner}?`,
    `the ${owner}'s ${thing}`,
    [`the ${plural} ${thing}`, `the ${plural}' ${thing}`],
    `For ONE owner, add an apostrophe and s: the ${owner}'s ${thing}.`,
  );
}

function possessiveMany(): Question {
  const [owners, things] = pick(OWNERS_MANY);
  const one = owners.slice(0, -1);
  return textChoice(
    `Which correctly shows the ${things} that belong to the ${owners} (more than one)?`,
    `the ${owners}' ${things}`,
    [`the ${one}'s ${things}`, `the ${owners} ${things}`],
    `When a plural owner already ends in s, just add an apostrophe after the s: the ${owners}' ${things}.`,
  );
}

function possessiveIrregular(): Question {
  const [one, many, things] = pick(OWNERS_IRREGULAR);
  return textChoice(
    `Which correctly shows the ${things} that belong to the ${many}?`,
    `the ${many}'s ${things}`,
    [`the ${many}s' ${things}`, `the ${one}s' ${things}`, `the ${many} ${things}`],
    `“${cap(many)}” is already plural but doesn't end in s, so add an apostrophe and s: the ${many}'s ${things}.`,
  );
}

/** Two possessive questions of different kinds (singular, plural or irregular plural). */
function possessives(d: Level): Question[] {
  if (d === 1) return [possessiveName(), possessiveOne()];
  if (d === 2) return [chance(0.4) ? possessiveName() : possessiveOne(), possessiveMany()];
  return [possessiveMany(), possessiveIrregular()];
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const PLACES: [string, string][] = [
  ["Halifax", "Nova Scotia"],
  ["Regina", "Saskatchewan"],
  ["Winnipeg", "Manitoba"],
  ["Iqaluit", "Nunavut"],
  ["Whitehorse", "Yukon"],
  ["Charlottetown", "Prince Edward Island"],
  ["Fredericton", "New Brunswick"],
  ["Edmonton", "Alberta"],
  ["Toronto", "Ontario"],
  ["Yellowknife", "Northwest Territories"],
];

const PLACE_STARTS: [string, string][] = [
  ["My aunt", "lives in"],
  ["Our pen pals", "live in"],
  ["Kenji", "was born in"],
  ["The team", "flew to"],
];

function dateOrPlace(d: Level, which: "date" | "place"): Question {
  if (which === "place") {
    const [city, prov] = pick(PLACES);
    const [who, verb] = pick(PLACE_STARTS);
    return textChoice(
      "Which sentence uses a comma correctly?",
      `${who} ${verb} ${city}, ${prov}.`,
      [`${who} ${verb} ${city} ${prov}.`, `${who} ${verb}, ${city} ${prov}.`, `${who}, ${verb} ${city} ${prov}.`],
      `Put a comma between the name of a city and its province or territory: ${city}, ${prov}.`,
    );
  }
  const month = pick(MONTHS);
  const day = randInt(1, 28);
  if (d === 1) {
    const year = randInt(2015, 2026);
    return textChoice(
      "Which date is written correctly?",
      `${month} ${day}, ${year}`,
      [`${month}, ${day} ${year}`, `${month} ${day} ${year}`, `${month}, ${day}, ${year}`],
      `In a date, put a comma between the day and the year: ${month} ${day}, ${year}.`,
    );
  }
  const weekday = pick(WEEKDAYS);
  return textChoice(
    "Which is written correctly?",
    `${weekday}, ${month} ${day}`,
    [`${weekday} ${month}, ${day}`, `${weekday} ${month} ${day}`, `${weekday}, ${month}, ${day}`],
    `Put a comma after the day of the week, but not between the month and the date: ${weekday}, ${month} ${day}.`,
  );
}

const DIALOGUE_BANK: Item[] = [
  {
    level: 1,
    prompt: "Why do writers use quotation marks in a story?",
    right: "To show the exact words a character says",
    wrong: ["To show who owns something", "To end a question", "To separate items in a list"],
    hint: "Quotation marks go around spoken words, like a speech bubble in a comic.",
  },
  {
    level: 2,
    prompt: "Which sentence uses quotation marks correctly?",
    right: "“Let's go to the park,” said Jay.",
    wrong: ["“Let's go to the park, said Jay.”", "Let's go to the park, “said Jay.”", "“Let's go” to the park, said Jay."],
    hint: "Put quotation marks around only the words Jay says. The comma goes inside the closing quotation mark.",
  },
  {
    level: 2,
    prompt: "Which sentence is punctuated correctly?",
    right: "Ana said, “I love this song.”",
    wrong: ["Ana said, I love this song.", "Ana said “I love this song.”", "“Ana said, I love this song.”"],
    hint: "Put a comma after “said”, then put quotation marks around Ana's exact words.",
  },
  {
    level: 2,
    prompt: "Which sentence uses quotation marks correctly?",
    right: "“Please pass the salt,” said Grandpa.",
    wrong: ["“Please pass the salt, said Grandpa.”", "Please pass the salt, “said Grandpa.”", "“Please pass” the salt, said Grandpa."],
    hint: "Only Grandpa's spoken words go inside the quotation marks.",
  },
  {
    level: 3,
    prompt: "Which sentence is punctuated correctly?",
    right: "“Can I help?” asked Ravi.",
    wrong: ["“Can I help,” asked Ravi?", "“Can I help”? asked Ravi.", "Can I help? “asked Ravi.”"],
    hint: "Ravi's words are a question, so the question mark goes INSIDE the quotation marks, right after “help”.",
  },
  {
    level: 3,
    prompt: "Which sentence is punctuated correctly?",
    right: "“Watch out for the puddle!” shouted Maya.",
    wrong: ["“Watch out for the puddle”! shouted Maya.", "Watch out for the puddle! “shouted Maya.”", "“Watch out for the puddle! shouted Maya.”"],
    hint: "The exclamation mark belongs to Maya's words, so it goes inside the quotation marks.",
  },
  {
    level: 3,
    prompt: "Which sentence is punctuated correctly?",
    right: "Leo asked, “Where is my hat?”",
    wrong: ["Leo asked “Where is my hat?”", "Leo, asked “Where is my hat?”", "Leo asked, “Where is my hat”?"],
    hint: "Put a comma after “asked”, and keep the question mark inside the quotation marks.",
  },
];

const MISC_PUNCT_BANK: Item[] = [
  {
    level: 1,
    prompt: "Which is the contraction for “can not”?",
    right: "can't",
    wrong: ["ca'nt", "cant"],
    hint: "In a contraction, the apostrophe goes where letters were taken out. “Can not” drops the “no”: can't.",
  },
  {
    level: 1,
    prompt: "Which is the contraction for “do not”?",
    right: "don't",
    wrong: ["do'nt", "dont"],
    hint: "The apostrophe takes the place of the missing letter “o”: don't.",
  },
  {
    level: 1,
    prompt: "Which sentence uses commas correctly?",
    right: "We packed apples, cheese and crackers.",
    wrong: ["We packed apples cheese and crackers.", "We packed, apples cheese, and crackers.", "We, packed apples cheese and crackers."],
    hint: "Use commas to separate items in a list.",
  },
  {
    level: 2,
    prompt: "Which sentence uses commas correctly?",
    right: "Zoe's favourite colours are red, green and purple.",
    wrong: ["Zoe's favourite colours are red green and purple.", "Zoe's, favourite colours are red green and purple.", "Zoe's favourite colours, are red green, and purple."],
    hint: "Use commas to separate items in a list: red, green and purple.",
  },
  {
    level: 2,
    prompt: "What does the apostrophe in “Sam's hat” show?",
    right: "The hat belongs to Sam.",
    wrong: ["There is more than one Sam.", "There is more than one hat.", "Sam is asking a question."],
    hint: "An apostrophe and s after a name shows ownership.",
  },
  {
    level: 2,
    prompt: "Which is the contraction for “they are”?",
    right: "they're",
    wrong: ["their", "there"],
    hint: "The apostrophe replaces the missing letter “a”: they + are = they're.",
  },
  {
    level: 3,
    prompt: "Which sentence uses an apostrophe correctly?",
    right: "The dog wagged its tail because it's happy.",
    wrong: ["The dog wagged it's tail because its happy.", "The dog wagged its' tail because its happy.", "The dog wagged it's tail because it's happy."],
    hint: "“It's” always means “it is”. “Its” (no apostrophe) shows ownership, like its tail.",
  },
  {
    level: 3,
    prompt: "Which sentence uses commas correctly?",
    right: "On March 3, 2025, our class visited the museum.",
    wrong: ["On March, 3 2025 our class visited the museum.", "On March 3 2025 our class, visited the museum.", "On, March 3 2025, our class visited the museum."],
    hint: "Put a comma between the day and the year, and another after the year when the sentence keeps going.",
  },
];

function punctuation(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([
    ...possessives(d),
    dateOrPlace(d, "date"),
    dateOrPlace(d, "place"),
    ...mix(d, [
      [DIALOGUE_BANK, 2],
      [MISC_PUNCT_BANK, 2],
    ]),
  ]);
}

// ---------- Word Builders ----------

type Prefix = "re" | "dis" | "mis" | "pre";

const PREFIX_GLOSS: Record<Prefix, string> = { re: "again", dis: "not", mis: "wrongly", pre: "before" };
const PREFIX_MEANING: Record<Prefix, (base: string) => string> = {
  re: (b) => `to ${b} again`,
  dis: (b) => `to not ${b}`,
  mis: (b) => `to ${b} wrongly`,
  pre: (b) => `to ${b} before`,
};

const PREFIX_WORDS: { level: Level; prefix: Prefix; base: string }[] = [
  { level: 1, prefix: "re", base: "read" },
  { level: 1, prefix: "re", base: "build" },
  { level: 1, prefix: "re", base: "fill" },
  { level: 1, prefix: "re", base: "tell" },
  { level: 1, prefix: "dis", base: "agree" },
  { level: 1, prefix: "dis", base: "like" },
  { level: 2, prefix: "re", base: "heat" },
  { level: 2, prefix: "dis", base: "obey" },
  { level: 2, prefix: "mis", base: "spell" },
  { level: 2, prefix: "mis", base: "read" },
  { level: 2, prefix: "mis", base: "place" },
  { level: 2, prefix: "pre", base: "heat" },
  { level: 2, prefix: "pre", base: "view" },
  { level: 3, prefix: "dis", base: "trust" },
  { level: 3, prefix: "dis", base: "approve" },
  { level: 3, prefix: "mis", base: "understand" },
  { level: 3, prefix: "mis", base: "behave" },
  { level: 3, prefix: "pre", base: "pay" },
];

const PREFIXES: Prefix[] = ["re", "dis", "mis", "pre"];

const PREFIX_MEANING_ITEMS: Item[] = PREFIX_WORDS.map(({ level, prefix, base }) => ({
  level,
  prompt: `What does “${prefix}${base}” mean?`,
  right: PREFIX_MEANING[prefix](base),
  wrong: PREFIXES.filter((p) => p !== prefix).map((p) => PREFIX_MEANING[p](base)),
  hint: `The prefix ${prefix}- means “${PREFIX_GLOSS[prefix]}”. Put it together with the base word “${base}”.`,
}));

const WHICH_PREFIX_ITEMS: Item[] = PREFIX_WORDS.map(({ level, prefix, base }) => ({
  level,
  prompt: `Which prefix turns “${base}” into a word that means “${PREFIX_MEANING[prefix](base)}”?`,
  right: `${prefix}-`,
  wrong: PREFIXES.filter((p) => p !== prefix).map((p) => `${p}-`),
  hint: "re- means again, dis- means not, mis- means wrongly and pre- means before.",
}));

const SUFFIX_BANK: Item[] = [
  {
    level: 1,
    prompt: "What does “unkind” mean?",
    right: "not kind",
    wrong: ["very kind", "kind again", "kind before"],
    hint: "The prefix un- means “not”.",
  },
  {
    level: 1,
    prompt: "What does “fearless” mean?",
    right: "without fear",
    wrong: ["full of fear", "afraid again", "able to be feared"],
    hint: "The suffix -less means “without”.",
  },
  {
    level: 1,
    prompt: "What does “helpful” mean?",
    right: "full of help; ready to help",
    wrong: ["without help", "to help again", "to help wrongly"],
    hint: "The suffix -ful means “full of”.",
  },
  {
    level: 2,
    prompt: "What does “washable” mean?",
    right: "able to be washed",
    wrong: ["washed again", "not washed", "without washing"],
    hint: "The suffix -able means “able to be”.",
  },
  {
    level: 2,
    prompt: "Which suffix means “without”?",
    right: "-less",
    wrong: ["-ful", "-able", "-ment"],
    hint: "Think of “careless”: without care.",
  },
  {
    level: 2,
    prompt: "What does “payment” mean?",
    right: "money that is paid",
    wrong: ["able to pay", "to pay again", "without pay"],
    hint: "The suffix -ment turns a verb into a noun: pay → payment, the thing that is paid.",
  },
  {
    level: 2,
    prompt: "Which word means “the act of moving”?",
    right: "movement",
    wrong: ["movable", "removed", "moved"],
    hint: "The suffix -ment makes a noun that names an action or result.",
  },
  {
    level: 3,
    prompt: "Which word means “the act of creating”?",
    right: "creation",
    wrong: ["creative", "creator", "recreate"],
    hint: "The suffix -tion turns a verb into a noun that names the action: create → creation.",
  },
  {
    level: 3,
    prompt: "Which word means “the act of celebrating”?",
    right: "celebration",
    wrong: ["celebrated", "celebrating", "celebrity"],
    hint: "Look for the noun made with the suffix -tion.",
  },
  {
    level: 3,
    prompt: "The suffix -able means “able to be”. Which word means “able to be read”?",
    right: "readable",
    wrong: ["reread", "reader", "misread"],
    hint: "Add -able to the base word: read + able.",
  },
];

const AFFIX_WORDS: { level: Level; word: string; prefix: string; base: string; suffix: string; mid: string; note?: string }[] = [
  { level: 2, word: "unbreakable", prefix: "un", base: "break", suffix: "able", mid: "breakable" },
  { level: 2, word: "unhelpful", prefix: "un", base: "help", suffix: "ful", mid: "helpful" },
  { level: 2, word: "disagreement", prefix: "dis", base: "agree", suffix: "ment", mid: "agreement" },
  { level: 2, word: "unkindness", prefix: "un", base: "kind", suffix: "ness", mid: "kindness" },
  { level: 3, word: "replacement", prefix: "re", base: "place", suffix: "ment", mid: "placement" },
  { level: 3, word: "rearrangement", prefix: "re", base: "arrange", suffix: "ment", mid: "arrangement" },
  { level: 3, word: "uncomfortable", prefix: "un", base: "comfort", suffix: "able", mid: "comfortable" },
  { level: 3, word: "disrespectful", prefix: "dis", base: "respect", suffix: "ful", mid: "respectful" },
  { level: 3, word: "reusable", prefix: "re", base: "use", suffix: "able", mid: "usable", note: " (The e in “use” was dropped before -able.)" },
  { level: 3, word: "unbelievable", prefix: "un", base: "believe", suffix: "able", mid: "believable", note: " (The e in “believe” was dropped before -able.)" },
];

const BASE_ITEMS: Item[] = AFFIX_WORDS.map((w) => ({
  level: w.level,
  prompt: `What is the base word in “${w.word}”?`,
  right: w.base,
  wrong: [w.mid, `${w.prefix}-`, `-${w.suffix}`],
  hint: `Cover the prefix ${w.prefix}- and the suffix -${w.suffix}. What's left is the base word.${w.note ?? ""}`,
}));

const ROOT_BANK: Item[] = [
  {
    level: 1,
    prompt: "What does “unsafe” mean?",
    right: "not safe",
    wrong: ["very safe", "safe again", "full of safety"],
    hint: "The prefix un- means “not”.",
  },
  {
    level: 1,
    prompt: "Which prefix means “again”?",
    right: "re-",
    wrong: ["un-", "dis-", "mis-"],
    hint: "Think of “redo”: to do again.",
  },
  {
    level: 2,
    prompt: "Which prefix means “wrongly”?",
    right: "mis-",
    wrong: ["re-", "pre-", "un-"],
    hint: "Think of “misspell”: to spell wrongly.",
  },
  {
    level: 3,
    prompt: "The root “port” means “carry”. What does “portable” mean?",
    right: "able to be carried",
    wrong: ["able to be seen", "able to be heard", "able to be written"],
    hint: "port (carry) + able (able to be) = able to be carried.",
  },
  {
    level: 3,
    prompt: "The root “tele” means “far”. Which word names a tool for seeing things that are far away?",
    right: "telescope",
    wrong: ["microscope", "telephone", "stethoscope"],
    hint: "Look for “tele” (far) plus “scope” (look at). A telephone carries sounds, not pictures.",
  },
  {
    level: 3,
    prompt: "The root “graph” means “write” or “draw”. Which word has this root?",
    right: "autograph",
    wrong: ["transport", "visible", "telescope"],
    hint: "Find the word that contains the letters “graph”. An autograph is a name you write yourself.",
  },
  {
    level: 3,
    prompt: "The root “vis” means “see”. What does “visible” mean?",
    right: "able to be seen",
    wrong: ["able to be carried", "able to be heard", "not able to move"],
    hint: "vis (see) + ible (able to be) = able to be seen.",
  },
  {
    level: 3,
    prompt: "The root “phon” means “sound”. Which word is about sound?",
    right: "headphones",
    wrong: ["photograph", "transport", "invisible"],
    hint: "Look for the root “phon” inside the word.",
  },
];

function wordBuilders(opts?: GenerateOptions): Question[] {
  return mix(levelOf(opts), [
    [PREFIX_MEANING_ITEMS, 3],
    [WHICH_PREFIX_ITEMS, 1],
    [SUFFIX_BANK, 2],
    [BASE_ITEMS, 1],
    [ROOT_BANK, 1],
  ]);
}

// ---------- Sound-Alikes ----------

const TRIPLE_HINT: Record<string, string> = {
  to: "“to” shows direction or goes with a verb, like “to the park” or “to run”.",
  too: "“too” means “also” or “more than enough”.",
  two: "“two” is the number 2.",
  there: "“there” tells about a place (over there), or starts sentences like “There is…”.",
  their: "“their” shows something belongs to them.",
  "they're": "“they're” is a contraction for “they are”.",
};

interface Triple {
  level: Level;
  words: string[];
  sentence: string;
  answer: string;
}

const TRIPLES: Triple[] = [
  ...(
    [
      ["We walked ___ the library after lunch.", "to"],
      ["Ana has ___ pet rabbits.", "two"],
      ["Can I come ___?", "too"],
      ["This soup is ___ hot to eat right now.", "too"],
      ["Kenji gave a card ___ his teacher.", "to"],
      ["The puppy is only ___ months old.", "two"],
    ] as const
  ).map(([sentence, answer]) => ({ level: 1 as Level, words: ["to", "too", "two"], sentence, answer })),
  ...(
    [
      ["The students hung ___ coats on the hooks.", "their"],
      ["Put the books over ___, on the shelf.", "there"],
      ["___ going to the park after school.", "they're"],
      ["Is ___ any milk left?", "there"],
      ["My cousins said ___ excited about the trip.", "they're"],
      ["The twins brought ___ new puppy to the park.", "their"],
    ] as const
  ).map(([sentence, answer]) => ({ level: 2 as Level, words: ["there", "their", "they're"], sentence, answer })),
  ...(
    [
      ["When the campers reached the lake, ___ tents were already set up.", "their"],
      ["___ is a rule about wearing helmets on the trail.", "there"],
      ["I think ___ the best team in the league this year.", "they're"],
      ["Two students and ___ teacher planted a tree.", "their"],
    ] as const
  ).map(([sentence, answer]) => ({ level: 3 as Level, words: ["there", "their", "they're"], sentence, answer })),
];

function tripleQuestion(t: Triple): Question {
  const start = t.sentence.startsWith("___");
  const show = (w: string) => (start ? cap(w) : w);
  return textChoice(
    "Which word correctly completes the sentence?",
    show(t.answer),
    t.words.filter((w) => w !== t.answer).map(show),
    `Try each word in the blank. ${TRIPLE_HINT[t.answer]}`,
    say(t.sentence),
  );
}

interface Pair {
  level: Level;
  words: [string, string];
  sentences: [string, string][];
  hint: string;
}

const PAIRS: Pair[] = [
  {
    level: 1,
    words: ["sea", "see"],
    sentences: [["Whales swim in the ___.", "sea"], ["Can you ___ the moon tonight?", "see"]],
    hint: "A sea is a big body of salt water. To see is what you do with your eyes.",
  },
  {
    level: 1,
    words: ["tail", "tale"],
    sentences: [["The puppy wagged its ___.", "tail"], ["Grandpa told us a funny ___ about his first bike.", "tale"]],
    hint: "A tail is on an animal. A tale is a story.",
  },
  {
    level: 1,
    words: ["blew", "blue"],
    sentences: [["The wind ___ my hat away.", "blew"], ["The sky is bright ___ today.", "blue"]],
    hint: "“Blew” is the past tense of blow. “Blue” is a colour.",
  },
  {
    level: 1,
    words: ["pair", "pear"],
    sentences: [["Noah ate a juicy ___.", "pear"], ["I need a new ___ of socks.", "pair"]],
    hint: "A pear is a fruit. A pair is a set of two.",
  },
  {
    level: 1,
    words: ["new", "knew"],
    sentences: [["Leo got ___ skates for his birthday.", "new"], ["Maya ___ all the answers on the quiz.", "knew"]],
    hint: "“New” is the opposite of old. “Knew” is the past tense of know.",
  },
  {
    level: 1,
    words: ["flour", "flower"],
    sentences: [["We need two cups of ___ to make bread.", "flour"], ["A bee landed on the ___.", "flower"]],
    hint: "Flour is a powder used for baking. A flower grows in a garden.",
  },
  {
    level: 2,
    words: ["hole", "whole"],
    sentences: [["Ana ate the ___ sandwich.", "whole"], ["The squirrel dug a ___ to hide its acorn.", "hole"]],
    hint: "“Whole” means all of something. A hole is an opening or a gap.",
  },
  {
    level: 2,
    words: ["piece", "peace"],
    sentences: [["May I have a ___ of cake?", "piece"], ["The library is a place of ___ and quiet.", "peace"]],
    hint: "A piece is a part of something (think: a PIEce of PIE). Peace means calm.",
  },
  {
    level: 2,
    words: ["rode", "road"],
    sentences: [["Ravi ___ his bike to school.", "rode"], ["The ___ was covered in snow.", "road"]],
    hint: "“Rode” is the past tense of ride. A road is a street.",
  },
  {
    level: 2,
    words: ["wait", "weight"],
    sentences: [["Please ___ for the green light.", "wait"], ["The vet checked the puppy's ___.", "weight"]],
    hint: "To wait is to stay until something happens. Weight is how heavy something is.",
  },
  {
    level: 2,
    words: ["hour", "our"],
    sentences: [["We waited for an ___ at the dentist.", "hour"], ["This is ___ new classroom.", "our"]],
    hint: "An hour is 60 minutes. “Our” means it belongs to us.",
  },
  {
    level: 2,
    words: ["write", "right"],
    sentences: [["Please ___ your name at the top.", "write"], ["Turn ___ at the corner.", "right"]],
    hint: "You write with a pencil. “Right” is a direction (or means correct).",
  },
  {
    level: 2,
    words: ["week", "weak"],
    sentences: [["Our class trip is next ___.", "week"], ["The baby bird was too ___ to fly.", "weak"]],
    hint: "A week is seven days. “Weak” is the opposite of strong.",
  },
  {
    level: 3,
    words: ["your", "you're"],
    sentences: [["Is this ___ backpack?", "your"], ["___ going to love this book!", "you're"]],
    hint: "“You're” is short for “you are”. “Your” shows something belongs to you.",
  },
  {
    level: 3,
    words: ["its", "it's"],
    sentences: [["The bird flapped ___ wings.", "its"], ["___ raining, so bring an umbrella.", "it's"]],
    hint: "“It's” is short for “it is”. “Its” (no apostrophe) shows ownership.",
  },
  {
    level: 3,
    words: ["whose", "who's"],
    sentences: [["___ jacket is on the floor?", "whose"], ["___ coming to the picnic?", "who's"]],
    hint: "“Who's” is short for “who is”. “Whose” asks who something belongs to.",
  },
  {
    level: 3,
    words: ["by", "buy"],
    sentences: [["We will ___ apples at the market.", "buy"], ["The bus drove ___ the school.", "by"]],
    hint: "To buy is to pay for something. “By” means near or past.",
  },
];

/** A sentence from pair `p` with the wrong homophone in the blank. */
function wrongFill(p: Pair, [s, a]: [string, string]): string {
  return fill(s, p.words[0] === a ? p.words[1] : p.words[0]);
}

function pairQuestion(p: Pair, extra: Pair): Question {
  const i = randInt(0, 1);
  const s1 = p.sentences[i];
  const s2 = p.sentences[1 - i];
  // Either compare both spellings in one sentence, or mix in another homophone pair,
  // so the right answer isn't always one of two look-alike sentences.
  const wrong = chance(0.5) ? [wrongFill(p, s1), wrongFill(p, s2)] : [wrongFill(p, s2), wrongFill(extra, pick(extra.sentences))];
  return textChoice("Which sentence uses the right homophone?", fill(s1[0], s1[1]), wrong, p.hint);
}

const HOMOGRAPH_BANK: Item[] = [
  {
    level: 1,
    prompt: "What does “bat” mean in this sentence?",
    visual: say("A bat flew out of the cave at sunset."),
    right: "a small flying animal",
    wrong: ["a stick used to hit a ball", "to blink your eyes", "a kind of bird nest"],
    hint: "Look for clues: it flew out of a cave at sunset.",
  },
  {
    level: 1,
    prompt: "What does “bark” mean in this sentence?",
    visual: say("The bark on the old tree was rough and bumpy."),
    right: "the outer covering of a tree",
    wrong: ["the sound a dog makes", "a kind of leaf", "a tree's roots"],
    hint: "The clue words are “on the old tree”.",
  },
  {
    level: 1,
    prompt: "What does “wave” mean in this sentence?",
    visual: say("Jay saw his grandma and gave her a big wave."),
    right: "moving your hand to say hello",
    wrong: ["water rising up in the ocean", "a curl in your hair", "a loud sound"],
    hint: "What do you do with your hand when you see someone you know?",
  },
  {
    level: 1,
    prompt: "What does “ring” mean in this sentence?",
    visual: say("Did you hear the phone ring?"),
    right: "to make a bell-like sound",
    wrong: ["a piece of jewellery for your finger", "a circle drawn on paper", "a place for a boxing match"],
    hint: "The clue is “hear”. What does a phone do that you can hear?",
  },
  {
    level: 2,
    prompt: "What does “rose” mean in this sentence?",
    visual: say("The sun rose over the hills."),
    right: "came up; went higher",
    wrong: ["a flower with thorns", "a pink colour", "fell down"],
    hint: "What does the sun do in the morning?",
  },
  {
    level: 2,
    prompt: "What does “trunk” mean in this sentence?",
    visual: say("The elephant sprayed water with its trunk."),
    right: "an elephant's long nose",
    wrong: ["the main stem of a tree", "a big storage box", "the back of a car"],
    hint: "Which body part does an elephant use to spray water?",
  },
  {
    level: 2,
    prompt: "What does “light” mean in this sentence?",
    visual: say("This box is light enough for me to carry."),
    right: "not heavy",
    wrong: ["brightness from the sun or a lamp", "pale in colour", "to start a fire"],
    hint: "The clue is “enough for me to carry”.",
  },
  {
    level: 2,
    prompt: "In which sentence does “match” mean “a game or contest”?",
    right: "Our team won the soccer match.",
    wrong: ["Do these two socks match?", "Can you match each word to its picture?"],
    hint: "Look for the sentence about a game.",
  },
  {
    level: 2,
    prompt: "In which sentence does “fair” mean “an event with rides and games”?",
    right: "We rode the Ferris wheel at the fair.",
    wrong: ["It's not fair if only one person gets a turn.", "Lena has fair hair and freckles."],
    hint: "Which sentence talks about rides?",
  },
  {
    level: 3,
    prompt: "In which sentence does “wind” rhyme with “find” and mean “to turn or twist”?",
    right: "Wind the string around the spool.",
    wrong: ["The wind blew the leaves away.", "A cold wind came from the north."],
    hint: "You can twist string around a spool. Air that blows is the other kind of wind.",
  },
  {
    level: 3,
    prompt: "What does “tear” mean in this sentence?",
    visual: say("Be careful not to tear the page."),
    right: "to rip",
    wrong: ["a drop of water from your eye", "to fold neatly", "to read quickly"],
    hint: "This “tear” rhymes with “bear”. What could happen to a page if you aren't careful?",
  },
  {
    level: 3,
    prompt: "What does “bow” mean in this sentence?",
    visual: say("The actors took a bow at the end of the play."),
    right: "bending forward to thank the audience",
    wrong: ["a ribbon tied in loops", "the front of a ship", "a stick used to play a violin"],
    hint: "What do actors do at the end of a show when people clap?",
  },
  {
    level: 3,
    prompt: "What does “present” mean in this sentence?",
    visual: say("Our group will present our project to the class."),
    right: "to show or share with others",
    wrong: ["a gift", "right now; not the past", "here; not absent"],
    hint: "This “present” is a verb (say pre-SENT). What will the group do with the project?",
  },
  {
    level: 2,
    prompt: "Words that sound the same but have different spellings and meanings are called…",
    right: "homophones",
    wrong: ["homographs", "synonyms", "antonyms"],
    hint: "“Phone” means sound. Homophones SOUND the same.",
  },
  {
    level: 3,
    prompt: "Words that are spelled the same but have different meanings are called…",
    right: "homographs",
    wrong: ["homophones", "synonyms", "antonyms"],
    hint: "“Graph” means write. Homographs are WRITTEN (spelled) the same.",
  },
];

function soundAlikes(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  const pairs = byLevel(PAIRS, 4, d);
  return shuffle([
    ...byLevel(TRIPLES, 3, d).map(tripleQuestion),
    pairQuestion(pairs[0], pairs[2]),
    pairQuestion(pairs[1], pairs[3]),
    ...byLevel(HOMOGRAPH_BANK, 3, d).map(ask),
  ]);
}

// ---------- Paragraph Power ----------

const TOPIC_HINT = "A topic sentence tells the main idea of the WHOLE paragraph. It shouldn't be just one detail, and it must be on topic.";

const TOPIC_BANK: Item[] = [
  {
    level: 1,
    prompt: "Which is the best topic sentence for these details?",
    visual: say(
      "Ants can carry things many times heavier than their own bodies.",
      "They work together to build huge underground homes.",
      "Some ants even grow their own food!",
    ),
    right: "Ants are amazing insects.",
    wrong: ["Ants can carry heavy things.", "Spiders spin webs to catch food.", "There are many animals in the world."],
    hint: TOPIC_HINT,
  },
  {
    level: 1,
    prompt: "Which is the best topic sentence for these details?",
    visual: say(
      "Our class collected cans and bottles for recycling.",
      "We planted flowers by the front doors.",
      "We also painted a bright mural on the fence.",
    ),
    right: "Our class worked hard to make our school a better place.",
    wrong: ["We planted flowers.", "Painting is my favourite thing to do.", "Schools have many classrooms."],
    hint: TOPIC_HINT,
  },
  {
    level: 2,
    prompt: "Which is the best topic sentence for these details?",
    visual: say(
      "Some people like adventure stories full of exciting action.",
      "Others enjoy funny books that make them laugh out loud.",
      "Many readers love mysteries that keep them guessing until the end.",
    ),
    right: "Readers enjoy many different kinds of books.",
    wrong: ["Mysteries keep readers guessing.", "The library opens at nine o'clock.", "Books are made of paper."],
    hint: TOPIC_HINT,
  },
  {
    level: 2,
    prompt: "Which is the best topic sentence for these details?",
    visual: say(
      "You can recycle paper, cans and plastic bottles.",
      "You can reuse jars to store crayons or buttons.",
      "You can also bring a cloth bag when you shop.",
    ),
    right: "There are many simple ways to reduce waste at home.",
    wrong: ["Jars are made of glass.", "Shopping is fun on weekends.", "You can recycle paper."],
    hint: TOPIC_HINT,
  },
  {
    level: 2,
    prompt: "Which is the best concluding sentence for this paragraph?",
    visual: say(
      "Bats are amazing animals.",
      "Many bats eat huge numbers of insects each night.",
      "Some bats help spread seeds and pollinate flowers.",
    ),
    right: "Clearly, bats are important to the world around us.",
    wrong: ["Bats sleep hanging upside down.", "First, bats eat insects.", "Owls also fly at night."],
    hint: "A concluding sentence wraps up the paragraph by restating the main idea in a new way. It doesn't add a brand-new detail.",
  },
  {
    level: 3,
    prompt: "Which is the best topic sentence for these details?",
    visual: say(
      "During the day, most owls rest quietly in trees.",
      "At night, their large eyes help them see in the dark.",
      "Their soft feathers let them fly almost silently as they hunt.",
    ),
    right: "Owls are well suited to life at night.",
    wrong: ["Owls have large eyes.", "Many birds fly south for the winter.", "Owls are birds."],
    hint: TOPIC_HINT,
  },
  {
    level: 3,
    prompt: "Which is the best topic sentence for these details?",
    visual: say(
      "Playing on a team teaches you to work with others.",
      "It helps keep your body strong and healthy.",
      "You can also make new friends on your team.",
    ),
    right: "Joining a sports team has many benefits.",
    wrong: ["Soccer is played with a round ball.", "Team sports help keep you healthy.", "Some people like to swim alone."],
    hint: TOPIC_HINT,
  },
  {
    level: 3,
    prompt: "Which is the best concluding sentence for this paragraph?",
    visual: say(
      "Libraries are wonderful places for everyone.",
      "You can borrow books, movies and music for free.",
      "Many libraries also have story times, clubs and computers to use.",
    ),
    right: "With so much to offer, a library is worth visiting often.",
    wrong: ["Some libraries have computers.", "Next, you can borrow a movie.", "Bookstores sell books and magazines."],
    hint: "A concluding sentence sums up the main idea. It doesn't add a new detail or start a new topic.",
  },
];

const BELONG_HINT = "Every sentence in a paragraph should support the main idea. Find the one that talks about something else.";

const BELONG_BANK: Item[] = [
  {
    level: 1,
    prompt: "Which sentence does NOT belong in this paragraph?",
    visual: {
      type: "passage",
      paragraphs: ["Penguins are birds that cannot fly. They use their wings like flippers to swim. My cousin has a pet hamster. Penguins can dive deep to catch fish."],
    },
    right: "My cousin has a pet hamster.",
    wrong: ["Penguins are birds that cannot fly.", "They use their wings like flippers to swim.", "Penguins can dive deep to catch fish."],
    hint: BELONG_HINT,
  },
  {
    level: 1,
    prompt: "Which sentence does NOT belong in this paragraph?",
    visual: {
      type: "passage",
      paragraphs: ["Kenji loves to bake. On weekends, he makes muffins with his dad. The school bus is yellow. Kenji's favourite muffins have blueberries in them."],
    },
    right: "The school bus is yellow.",
    wrong: ["Kenji loves to bake.", "On weekends, he makes muffins with his dad.", "Kenji's favourite muffins have blueberries in them."],
    hint: BELONG_HINT,
  },
  {
    level: 2,
    prompt: "Which sentence does NOT belong in this paragraph?",
    visual: {
      type: "passage",
      paragraphs: ["Our community garden is a busy place in summer. Neighbours grow tomatoes, beans and squash. Winter is my favourite season because I love to skate. Children help water the plants each morning."],
    },
    right: "Winter is my favourite season because I love to skate.",
    wrong: ["Our community garden is a busy place in summer.", "Neighbours grow tomatoes, beans and squash.", "Children help water the plants each morning."],
    hint: BELONG_HINT,
  },
  {
    level: 3,
    prompt: "Which sentence does NOT belong in this paragraph?",
    visual: {
      type: "passage",
      paragraphs: ["Bike helmets help keep riders safe. A helmet should fit snugly on your head. Bicycles were invented a long time ago. Always buckle the strap before you ride."],
    },
    right: "Bicycles were invented a long time ago.",
    wrong: ["Bike helmets help keep riders safe.", "A helmet should fit snugly on your head.", "Always buckle the strap before you ride."],
    hint: "This paragraph is about helmet safety. One sentence is about bikes, but not about safety.",
  },
  {
    level: 3,
    prompt: "Which sentence does NOT belong in this paragraph?",
    visual: {
      type: "passage",
      paragraphs: ["A volcano forms where melted rock from deep underground rises to the surface. When a volcano erupts, lava can flow down its sides. Some mountains are covered in snow all year. Over time, layers of cooled lava can build a volcano taller."],
    },
    right: "Some mountains are covered in snow all year.",
    wrong: [
      "A volcano forms where melted rock from deep underground rises to the surface.",
      "When a volcano erupts, lava can flow down its sides.",
      "Over time, layers of cooled lava can build a volcano taller.",
    ],
    hint: "The paragraph explains how volcanoes form and grow. Which sentence isn't about that?",
  },
];


const TRANSITION_BANK: Item[] = [
  {
    level: 1,
    prompt: "Which transition word best fills the blank?",
    visual: say("First, we mixed the paint.", "___, we painted the birdhouse.", "Finally, we let it dry."),
    right: "Next",
    wrong: ["Finally", "However", "For example"],
    hint: "This is a list of steps in order. What word comes between “First” and “Finally”?",
  },
  {
    level: 1,
    prompt: "Which transition word best fills the blank?",
    visual: say("Lena wanted to play outside.", "___, it was raining too hard."),
    right: "However",
    wrong: ["Next", "For example", "First"],
    hint: "The second idea is the opposite of what Lena wanted. Which word shows a contrast?",
  },
  {
    level: 2,
    prompt: "Which transition best fills the blank?",
    visual: say("We forgot to water our plant for two weeks.", "___, its leaves turned brown and droopy."),
    right: "As a result",
    wrong: ["However", "For example", "First"],
    hint: "The droopy leaves happened BECAUSE nobody watered the plant. Which words show an effect?",
  },
  {
    level: 2,
    prompt: "Which transition best fills the blank?",
    visual: say("Many animals sleep through most of the winter.", "___, groundhogs hibernate in underground burrows."),
    right: "For example",
    wrong: ["However", "Finally", "As a result"],
    hint: "Groundhogs are one example of animals that sleep through winter.",
  },
  {
    level: 2,
    prompt: "Which transition word best fills the blank?",
    visual: say("Jay practised his song every day.", "___, he still felt nervous before the concert."),
    right: "However",
    wrong: ["As a result", "For example", "Next"],
    hint: "You'd expect practising to make Jay calm, but he still felt nervous. That's a contrast.",
  },
  {
    level: 3,
    prompt: "Which transition best fills the blank?",
    visual: say("Recycling saves materials, and it keeps litter out of our parks.", "___, recycling is something everyone in our community can do to help."),
    right: "In conclusion",
    wrong: ["For example", "First", "However"],
    hint: "This sentence wraps up the paragraph. Which words signal an ending?",
  },
  {
    level: 3,
    prompt: "Which transition best fills the blank?",
    visual: say("Read the directions on the seed package.", "___ the seeds are in the soil, water them gently."),
    right: "After",
    wrong: ["However", "For example", "In conclusion"],
    hint: "The seeds go in the soil first, then you water. Which word shows time order?",
  },
];

const CAUSE_BANK: Item[] = [
  {
    level: 1,
    prompt: "What is the CAUSE in this sentence?",
    visual: say("Because it snowed all night, school started late."),
    right: "It snowed all night.",
    wrong: ["School started late.", "The snow melted.", "The buses came early."],
    hint: "The cause is WHY something happens. The word “because” comes right before the cause.",
  },
  {
    level: 1,
    prompt: "What is the EFFECT in this sentence?",
    visual: say("Maya studied her spelling words, so she did well on the test."),
    right: "Maya did well on the test.",
    wrong: ["Maya studied her spelling words.", "Maya forgot her pencil.", "The test was cancelled."],
    hint: "The effect is WHAT happened. The word “so” comes right before the effect.",
  },
  {
    level: 1,
    prompt: "Which word is often a clue that a sentence shows cause and effect?",
    right: "because",
    wrong: ["however", "first", "also"],
    hint: "Cause-and-effect clue words include because, so and as a result.",
  },
  {
    level: 2,
    prompt: "What is the CAUSE in this sentence?",
    visual: say("The puppy chewed the shoe because it was teething."),
    right: "The puppy was teething.",
    wrong: ["The puppy chewed the shoe.", "The shoe was brand new.", "The puppy was hungry."],
    hint: "Ask: WHY did the puppy chew the shoe? Look after the word “because”.",
  },
  {
    level: 2,
    prompt: "Ravi left the gate open. What is a likely EFFECT?",
    right: "The dog could get out of the yard.",
    wrong: ["The grass would grow faster.", "It would start to rain.", "Ravi's shoes would come untied."],
    hint: "Think about what an open gate lets happen.",
  },
  {
    level: 3,
    prompt: "What caused the families to go skating?",
    visual: say("The lake froze solid, so families went skating.", "Soon the skaters got hungry, so a neighbour sold hot cocoa."),
    right: "The lake froze solid.",
    wrong: ["A neighbour sold hot cocoa.", "The skaters got hungry.", "The families wanted cocoa."],
    hint: "One effect can cause another! Find the sentence part that comes right before “so families went skating”.",
  },
  {
    level: 3,
    prompt: "What is the EFFECT in this sentence?",
    visual: say("Since the library got new computers, more students visit at lunch."),
    right: "More students visit at lunch.",
    wrong: ["The library got new computers.", "Students eat lunch in the library.", "The computers are old."],
    hint: "“Since” can mean “because”. The part after the comma tells what happened as a result.",
  },
  {
    level: 3,
    prompt: "Which sentence shows cause and effect?",
    right: "The power went out, so we read by flashlight.",
    wrong: ["We read by flashlight and ate popcorn.", "The flashlight is blue and silver.", "First we read, and then we slept."],
    hint: "Look for a sentence where one thing makes another thing happen. The clue word “so” helps!",
  },
];

const ORDER_SETS: { topic: string; steps: string[] }[] = [
  {
    topic: "Making a pine cone bird feeder is easy.",
    steps: [
      "First, tie a long string to the top of a pine cone.",
      "Next, spread sunflower seed butter all over the pine cone.",
      "Then, roll the sticky pine cone in birdseed.",
      "Finally, hang your feeder from a tree branch.",
    ],
  },
  {
    topic: "Growing a bean plant takes just a few steps.",
    steps: [
      "First, fill a cup with soil.",
      "Next, push a bean seed into the soil.",
      "Then, water it and set it in a sunny spot.",
      "Finally, watch for a green sprout to appear.",
    ],
  },
  {
    topic: "A paper snowflake is a fun winter craft.",
    steps: [
      "First, fold a square of paper in half to make a triangle.",
      "Next, fold the triangle in half two more times.",
      "Then, cut small shapes along the edges.",
      "Finally, unfold the paper to see your snowflake.",
    ],
  },
  {
    topic: "Last Saturday, Leo had an exciting day at the park.",
    steps: [
      "First, he flew his new kite high above the trees.",
      "Next, a strong gust of wind pulled the string from his hand.",
      "Then, Leo and his sister chased the kite across the field.",
      "Finally, they found it in a bush and carried it home.",
    ],
  },
];

function orderParagraph(d: Level): OrderQuestion {
  const set = pick(ORDER_SETS);
  const lines = d === 1 ? set.steps : [set.topic, ...set.steps];
  return {
    kind: "order",
    prompt: d === 1 ? "Put the sentences in order." : "Put the sentences in order to make a paragraph.",
    hint:
      d === 1
        ? "Follow the clue words: First, Next, Then, Finally."
        : "Start with the topic sentence that tells what the paragraph is about. Then follow the clue words: First, Next, Then, Finally.",
    items: lines.map((label, i) => ({ id: `p${i}`, label })),
  };
}

function paragraphs(opts?: GenerateOptions): Question[] {
  const d = levelOf(opts);
  return shuffle([
    orderParagraph(d),
    ...mix(d, [
      [TOPIC_BANK, 2],
      [BELONG_BANK, 1],
      [TRANSITION_BANK, 2],
      [CAUSE_BANK, 2],
    ]),
  ]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "4",
  subject: "language",
  bigIdeas: {
    "ca-bc": [
      "Language and text can be a source of creativity and joy.",
      "Exploring stories and other texts helps us understand ourselves and make connections to others and to the world.",
      "Texts can be understood from different perspectives.",
      "Using language in creative and playful ways helps us understand how language works.",
      "Questioning what we hear, read, and view contributes to our ability to be educated and engaged citizens.",
    ],
  },
  units: [
    {
      id: "reading-detectives",
      title: "Reading Detectives",
      emoji: "🔎",
      blurb: "Main idea, clues and summaries",
      standards: {
        "ca-bc": "Reading strategies (main idea, making inferences, summarizing); literary elements (character, problem, theme); supporting evidence",
      },
      parentNote:
        "Reading short original stories and articles, then finding the main idea and key details, making inferences from clues, working out word meanings and choosing the best summary.",
      generate: reading,
    },
    {
      id: "text-features",
      title: "Text Features",
      emoji: "📑",
      blurb: "Headings, glossaries and indexes",
      standards: {
        "ca-bc": "Text features (table of contents, headings, captions, glossary, index, diagrams); forms, functions and genres of text",
      },
      parentNote:
        "Using the parts of a nonfiction book to find information: reading a table of contents and index, knowing what glossaries, captions, labels and timelines are for, and choosing headings.",
      generate: textFeatures,
    },
    {
      id: "figurative-language",
      title: "Figurative Language",
      emoji: "🎨",
      blurb: "Similes, metaphors and more",
      standards: {
        "ca-bc": "Literary devices: figurative language and imagery (simile, metaphor, personification, onomatopoeia, alliteration, hyperbole)",
      },
      parentNote:
        "Spotting similes, metaphors, personification, onomatopoeia and alliteration (plus hyperbole at the stretch level), and explaining what figurative phrases really mean.",
      generate: figurative,
    },
    {
      id: "point-of-view",
      title: "Point of View",
      emoji: "👀",
      blurb: "Who is telling the story?",
      standards: {
        "ca-bc": "Literary elements and perspective: narrator and point of view (first and third person)",
      },
      parentNote:
        "Telling first-person stories (I, me, we) from third-person stories (he, she, they), finding pronoun clues, and noticing when dialogue uses “I” in a third-person story.",
      generate: pointOfView,
    },
    {
      id: "parts-of-speech",
      title: "Parts of Speech",
      emoji: "🧩",
      blurb: "Pronouns, adverbs and more",
      standards: {
        "ca-bc": "Sentence structure and grammar: parts of speech (nouns, verbs, adjectives, pronouns, adverbs, prepositions, conjunctions)",
      },
      parentNote:
        "Naming the job each word does in a sentence, with a focus on Grade 4's pronouns, adverbs, prepositions and conjunctions. Easier levels stick to nouns, verbs, adjectives and pronouns.",
      generate: partsOfSpeech,
    },
    {
      id: "super-sentences",
      title: "Super Sentences",
      emoji: "✍️",
      blurb: "Compound sentences, fragments, run-ons",
      standards: {
        "ca-bc": "Sentence structure and grammar: simple and compound sentences, coordinating conjunctions, fragments and run-ons, subject–verb agreement and verb tenses",
      },
      parentNote:
        "Joining sentences with and, but, or and so; spotting and fixing fragments and run-ons; and choosing verbs that agree with the subject and match the tense.",
      generate: sentences,
    },
    {
      id: "punctuation-power",
      title: "Punctuation Power",
      emoji: "❗",
      blurb: "Apostrophes, commas and quotes",
      standards: {
        "ca-bc": "Conventions: apostrophes (possessives and contractions), commas in dates, places and lists, and quotation marks for dialogue",
      },
      parentNote:
        "Writing possessives (the dog's bone, the girls' bikes, the children's toys), placing commas in dates, places and lists, and punctuating dialogue with quotation marks.",
      generate: punctuation,
    },
    {
      id: "word-builders",
      title: "Word Builders",
      emoji: "🧱",
      blurb: "Prefixes, suffixes and roots",
      standards: {
        "ca-bc": "Reading strategies and vocabulary: word structure, including prefixes (re-, dis-, mis-, pre-, un-), suffixes (-able, -ment, -tion, -ful, -less) and roots",
      },
      parentNote:
        "Using word parts to work out meanings: prefixes like re- and mis-, suffixes like -able and -ment, finding the base word, and (at the stretch level) roots such as port and tele.",
      generate: wordBuilders,
    },
    {
      id: "sound-alikes",
      title: "Sound-Alikes",
      emoji: "👂",
      blurb: "Homophones and homographs",
      standards: {
        "ca-bc": "Language features and conventions: homophones and homographs; using context to choose word meaning and spelling",
      },
      parentNote:
        "Choosing between words that sound alike (there/their/they're, to/too/two, its/it's) and using context to tell which meaning of a word like “bark” or “bow” is meant.",
      generate: soundAlikes,
    },
    {
      id: "paragraph-power",
      title: "Paragraph Power",
      emoji: "📝",
      blurb: "Topic sentences and transitions",
      standards: {
        "ca-bc": "Paragraph structure (topic sentence, supporting details, concluding sentence), transition words and cause and effect; writing processes",
      },
      parentNote:
        "Choosing topic and concluding sentences, finding the sentence that doesn't belong, using transition words, identifying cause and effect, and putting sentences in order.",
      generate: paragraphs,
    },
  ],
};
