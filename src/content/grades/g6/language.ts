import { chance, pick, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, SortQuestion, Visual } from "../../types";

// Grade 6 Language Arts. Most units draw from hand-written banks tagged with a
// level (1 easier, 2 on grade level, 3 stretch). generate() leans on the
// requested difficulty and shows 3, 4 or 5 choices to match.

type Level = 1 | 2 | 3;
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

/** How many choices to show at each level (when the item has enough). */
const CHOICES: Record<Level, number> = { 1: 3, 2: 4, 3: 5 };

interface Item {
  level: Level;
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
  visual?: Visual;
}

/** One or more sentences in a reading card. */
const line = (...lines: string[]): Visual => ({ type: "story", lines });
/** A reading passage. */
const text = (title: string | undefined, ...paragraphs: string[]): Visual => ({ type: "passage", title, paragraphs });

/** A choice question with as many wrong answers as the level allows. */
function choose(prompt: string, right: string, wrong: string[], hint: string, level: Level, visual?: Visual): Question {
  const count = Math.min(CHOICES[level], wrong.length + 1) - 1;
  return textChoice(prompt, right, sample(wrong, count), hint, visual);
}

const ask = (item: Item, level: Level): Question => choose(item.prompt, item.right, item.wrong, item.hint, level, item.visual);

/** Pick `count` items, mostly at `level`, with a couple from neighbouring levels for variety. */
function draw<T extends { level: Level }>(items: readonly T[], count: number, level: Level): T[] {
  const exact = shuffle(items.filter((i) => i.level === level));
  const near = shuffle(items.filter((i) => Math.abs(i.level - level) === 1));
  const far = shuffle(items.filter((i) => Math.abs(i.level - level) === 2));
  const mix = Math.min(near.length, Math.floor(count / 4));
  const main = exact.slice(0, count - mix);
  return [...main, ...near, ...exact.slice(main.length), ...far].slice(0, count);
}

const askSome = (items: readonly Item[], count: number, level: Level): Question[] =>
  draw(items, count, level).map((i) => ask(i, level));

interface Bin {
  id: string;
  label: string;
  emoji: string;
}

function sortOf(prompt: string, hint: string, bins: Bin[], items: { label: string; bin: string }[], emoji = "📝"): SortQuestion {
  return {
    kind: "sort",
    prompt,
    hint,
    bins,
    items: shuffle(items).map((item, i) => ({ id: `s${i}`, label: item.label, emoji, bin: item.bin })),
  };
}

function orderOf(prompt: string, hint: string, lines: string[]): OrderQuestion {
  return { kind: "order", prompt, hint, items: lines.map((label, i) => ({ id: `o${i}`, label })) };
}

// ---------- Close Reading ----------

interface PassageQuestion {
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
}

interface Passage {
  kind: "fiction" | "info";
  /** The difficulties this passage is used at. */
  levels: Level[];
  title: string;
  paragraphs: string[];
  questions: PassageQuestion[];
}

const PASSAGES: Passage[] = [
  {
    kind: "fiction",
    levels: [1, 2],
    title: "The Practice Lot",
    paragraphs: [
      "Every afternoon, Priya carried her skateboard to the empty lot behind the community centre. She had been trying to land the same trick for three weeks.",
      "Today, a younger kid named Leo sat on the curb and watched her fall again and again. Priya's face went hot. She almost packed up and went home.",
      "Instead, she brushed the gravel off her knees and tried once more. This time the board flipped, spun and landed right under her feet.",
      "Leo cheered so loudly that a pigeon flapped off the fence. “Can you teach me?” he asked. Priya grinned. “Only if you're ready to fall a lot.”",
    ],
    questions: [
      {
        prompt: "Which statement best expresses the theme of this story?",
        right: "Sticking with something hard can lead to success.",
        wrong: ["Skateboarding is the best sport.", "Younger kids are always annoying.", "You should only practise when nobody is watching."],
        hint: "A theme is a lesson about life, not just the topic. What happened because Priya didn't give up?",
      },
      {
        prompt: "Why did Priya's face go hot?",
        right: "She felt embarrassed falling while someone watched.",
        wrong: ["She was angry because Leo laughed at her.", "The afternoon sun was too strong.", "She had just won a skateboarding contest."],
        hint: "Look at what happens just before: Leo was watching her fall again and again. How would you feel?",
      },
      {
        prompt: "Why does Priya try the trick “once more” instead of going home?",
        right: "She doesn't want to give up on the trick.",
        wrong: ["Leo tells her she has to keep going.", "Her coach is timing her.", "The community centre is about to close."],
        hint: "Leo doesn't speak until the end. Think about how long Priya has worked on this trick.",
      },
      {
        prompt: "Which sentence best shows that Priya is persistent?",
        right: "She had been trying to land the same trick for three weeks.",
        wrong: ["Leo cheered so loudly that a pigeon flapped off the fence.", "Priya's face went hot.", "Today, a younger kid named Leo sat on the curb."],
        hint: "Persistent means you keep trying for a long time. Which sentence shows effort over many days?",
      },
      {
        prompt: "What does Priya's last line, “Only if you're ready to fall a lot,” suggest?",
        right: "Learning a trick takes many tries and mistakes.",
        wrong: ["She doesn't want to teach Leo.", "Leo has already fallen many times.", "The lot is too slippery for skating."],
        hint: "Think about what Priya just went through before she finally landed her trick.",
      },
    ],
  },
  {
    kind: "fiction",
    levels: [1, 2],
    title: "Two Ideas, One Project",
    paragraphs: [
      "Lena wanted their science fair project to be about bees. Ravi wanted it to be about bridges. For two days, they barely spoke during work time.",
      "On the third day, Ms. Chen asked how their plan was going. Lena looked at the blank poster board and sighed. “We don't have one,” she admitted.",
      "That night, Ravi watched a video about how bees build honeycomb out of six-sided cells. He sat straight up. The shape was strong and light, and it used very little wax. Those were exactly the things a good bridge needed.",
      "The next morning, he met Lena at the door with a sketch. “What if we test whether honeycomb shapes make stronger bridges?” Lena stared at the paper, then laughed. “Why didn't we think of that two days ago?”",
    ],
    questions: [
      {
        prompt: "Which statement best expresses the theme of this story?",
        right: "Combining different ideas can lead to a better solution.",
        wrong: ["Bees are more interesting than bridges.", "Science fair projects should be done alone.", "Arguing with a partner always ruins a project."],
        hint: "A theme is a lesson the characters learn. How did Lena and Ravi finally solve their problem?",
      },
      {
        prompt: "Why did Lena sigh when she looked at the poster board?",
        right: "She was frustrated that they had made no progress.",
        wrong: ["She was bored by Ms. Chen's question.", "She had finished the poster and was tired.", "She didn't like the colour of the board."],
        hint: "The board was blank, and she admits, “We don't have one.” How does that feel after two days?",
      },
      {
        prompt: "Which sentence shows that Ravi suddenly had a new idea?",
        right: "He sat straight up.",
        wrong: ["For two days, they barely spoke during work time.", "Ravi wanted it to be about bridges.", "Lena stared at the paper, then laughed."],
        hint: "Look for a body-language clue in paragraph 3, right after Ravi learns about honeycomb.",
      },
      {
        prompt: "Why did Ravi bring a sketch to school?",
        right: "He wanted to show Lena a plan that mixed both of their ideas.",
        wrong: ["He wanted to prove that bridges were better than bees.", "Ms. Chen had asked him to draw a honeycomb.", "He wanted to quit the science fair."],
        hint: "His question links honeycomb (bees) with bridges. Whose ideas are in it?",
      },
      {
        prompt: "What does Lena's question at the end suggest?",
        right: "She likes the new idea and wishes they had found it sooner.",
        wrong: ["She is angry that Ravi didn't ask her first.", "She thinks the idea will never work.", "She wants to switch partners."],
        hint: "She laughs before she asks it. What does “Why didn't we think of that…?” usually mean?",
      },
    ],
  },
  {
    kind: "fiction",
    levels: [2, 3],
    title: "Lines on Paper",
    paragraphs: [
      "During his first week at the new school, Amir ate lunch at the end of the long table and kept his sketchbook closed on his lap. At his old school, everyone had known him as “the map kid.” Here, nobody knew him at all.",
      "On Thursday, the sketchbook slid off his knees and fell open. Zoe picked it up before he could reach it. Inside was a hand-drawn map of an island, with mountain ridges shaded in pencil and tiny labels in careful capital letters.",
      "“You made this?” Zoe asked. Amir shrugged and held out his hand for the book, staring at the floor.",
      "“Our group needs someone to draw the setting for our class story,” she said. “We've been arguing about it for days.” She slid onto the bench beside him. For the first time all week, Amir opened the sketchbook on purpose.",
    ],
    questions: [
      {
        prompt: "Which statement best expresses a theme of the story?",
        right: "Sharing what you care about can help you connect with others.",
        wrong: ["Moving to a new school is always easy.", "Maps are more useful than stories.", "It is rude to pick up someone else's things.", "Group projects always lead to arguments."],
        hint: "Think about how Amir changes. What happens once someone sees his maps?",
      },
      {
        prompt: "Why does Amir keep his sketchbook closed at first?",
        right: "He feels unsure about how his new classmates will see him.",
        wrong: ["His teacher told him not to draw at lunch.", "The sketchbook is empty.", "He is upset with Zoe.", "He has lost his pencil."],
        hint: "He's new, and “nobody knew him at all.” How might that make someone act?",
      },
      {
        prompt: "Which detail best shows that Amir has changed by the end?",
        right: "For the first time all week, Amir opened the sketchbook on purpose.",
        wrong: ["Amir shrugged and held out his hand for the book, staring at the floor.", "Here, nobody knew him at all.", "Zoe picked it up before he could reach it.", "Inside was a hand-drawn map of an island."],
        hint: "Compare the beginning (sketchbook closed) with the last sentence.",
      },
      {
        prompt: "Why does Zoe sit down beside Amir?",
        right: "She wants him to help her group draw the story's setting.",
        wrong: ["She wants to borrow some of his lunch.", "She is new to the school too.", "She wants to hand his sketchbook to the teacher.", "She wants to copy his homework."],
        hint: "Read what Zoe says just before she sits down.",
      },
      {
        prompt: "What does the nickname “the map kid” tell you about Amir?",
        right: "At his old school, he was known for drawing maps.",
        wrong: ["He gets lost easily.", "He wants to be a sailor.", "He doesn't like his old school.", "He has never drawn before."],
        hint: "A nickname often comes from something a person is known for doing.",
      },
    ],
  },
  {
    kind: "fiction",
    levels: [3],
    title: "The Blue Sweater",
    paragraphs: [
      "Grandpa Teo knitted slowly now. His fingers were stiffer than they used to be, and he had to stop often to rest them. Still, every evening that winter, he worked on a blue sweater for Noah.",
      "Noah had noticed that none of his friends wore hand-knit sweaters. When Grandpa held the half-finished sweater up to his shoulders to check the size, Noah said, “You don't have to finish it, you know.” Grandpa just smiled and kept counting stitches.",
      "On the morning of the class trip, the sweater lay folded on Noah's chair. One sleeve was a little longer than the other. Noah stood looking at it for a long time.",
      "Then he pulled it over his head, rolled up the long sleeve and went downstairs. Grandpa looked up from his tea and did not say a word, but he did not stop smiling for the rest of the morning.",
    ],
    questions: [
      {
        prompt: "Why does Noah say, “You don't have to finish it, you know”?",
        right: "He worries his friends might find a hand-knit sweater unusual.",
        wrong: ["He thinks the sweater is the wrong colour.", "He wants Grandpa to knit a scarf instead.", "He already owns the same sweater.", "He is angry that the sweater is taking so long."],
        hint: "Look at the sentence just before he says it: what had Noah noticed about his friends?",
      },
      {
        prompt: "Why does Grandpa keep knitting even though it is hard for him?",
        right: "Making the sweater is a way to show his love for Noah.",
        wrong: ["He plans to sell it at a market.", "Noah asked him to hurry.", "He needs a sweater for himself.", "His doctor told him to knit every day."],
        hint: "He works on it every evening, for Noah, even with stiff fingers. What does that effort say?",
      },
      {
        prompt: "Which sentence best shows that Noah has mixed feelings on the morning of the trip?",
        right: "Noah stood looking at it for a long time.",
        wrong: ["One sleeve was a little longer than the other.", "Grandpa Teo knitted slowly now.", "Grandpa looked up from his tea.", "Still, every evening that winter, he worked on a blue sweater for Noah."],
        hint: "Mixed feelings make it hard to decide. Which sentence shows Noah hesitating?",
      },
      {
        prompt: "Which theme does the story suggest?",
        right: "A gift made with love can matter more than fitting in.",
        wrong: ["Hand-knit clothes are always better than store-bought ones.", "Older people should not do hard work.", "It is important to be on time for class trips.", "Sweaters should always fit perfectly."],
        hint: "Noah worried about what his friends would think, but what did he choose in the end, and why?",
      },
      {
        prompt: "Why does Grandpa smile for the rest of the morning?",
        right: "He is touched that Noah chose to wear the sweater.",
        wrong: ["He has finished his tea.", "He thinks the long sleeve looks funny.", "Noah thanked him with a long speech.", "He is glad the knitting is over."],
        hint: "Grandpa sees Noah come downstairs. What is Noah wearing?",
      },
    ],
  },
  {
    kind: "info",
    levels: [1, 2],
    title: "Nature's Engineers",
    paragraphs: [
      "Beavers are sometimes called nature's engineers. Using their strong front teeth, they cut down small trees and drag the branches to a stream. Then they pile up branches, mud and stones to build a dam.",
      "The dam slows the water and creates a pond. In the pond, beavers build a home called a lodge. Its entrances are underwater, which helps keep predators out.",
      "A beaver's front teeth never stop growing. Chewing on wood keeps them from getting too long. The teeth are orange because they contain iron, which makes them extra tough.",
      "Beaver ponds help many other living things. Ducks, frogs, fish and insects find food and shelter in the calm water. In this way, one busy animal can change a whole habitat.",
    ],
    questions: [
      {
        prompt: "What is the main idea of this text?",
        right: "Beavers build dams and lodges that change their habitat.",
        wrong: ["Beavers have orange teeth.", "Ducks and frogs live in ponds.", "Predators cannot swim."],
        hint: "The main idea covers the whole text, not just one detail. What is every paragraph about?",
      },
      {
        prompt: "Why are a lodge's entrances underwater?",
        right: "to help keep predators out",
        wrong: ["to keep the lodge dry", "so beavers can store mud", "because beavers cannot climb"],
        hint: "Paragraph 2 gives the reason in the same sentence.",
      },
      {
        prompt: "Which sentence supports the idea that beavers help other animals?",
        right: "Ducks, frogs, fish and insects find food and shelter in the calm water.",
        wrong: ["Chewing on wood keeps them from getting too long.", "Its entrances are underwater, which helps keep predators out.", "Beavers are sometimes called nature's engineers."],
        hint: "Look for a sentence that names animals other than beavers.",
      },
      {
        prompt: "Why does the author call beavers “nature's engineers”?",
        right: "They design and build structures, as engineers do.",
        wrong: ["They work for the government.", "They study nature in a lab.", "They are the largest animals in the forest."],
        hint: "Engineers plan and build things like dams and bridges. What do beavers build?",
      },
      {
        prompt: "What would most likely happen if a beaver could not chew wood?",
        right: "Its front teeth would grow too long.",
        wrong: ["Its teeth would turn white.", "It would no longer need a lodge.", "Its pond would get bigger."],
        hint: "Paragraph 3 explains what chewing wood does for a beaver's teeth.",
      },
    ],
  },
  {
    kind: "info",
    levels: [1],
    title: "Why Leaves Change Colour",
    paragraphs: [
      "In summer, most leaves are green because they are full of chlorophyll. Chlorophyll is a chemical that helps a plant use sunlight to make its food.",
      "Leaves also contain yellow and orange colours. During the summer, there is so much green chlorophyll that these colours stay hidden.",
      "In the fall, the days get shorter and cooler. Many trees stop making chlorophyll and get ready to rest for the winter. As the green fades, the yellow and orange colours finally show through.",
      "Some trees, such as many maples, also make bright red colours in the fall. A sunny autumn with cool nights can make these reds even stronger.",
    ],
    questions: [
      {
        prompt: "What is this text mostly about?",
        right: "why many leaves change colour in the fall",
        wrong: ["how to rake leaves", "why maple trees are the tallest trees", "how plants drink water"],
        hint: "Check the title and the first sentence of each paragraph.",
      },
      {
        prompt: "What causes the yellow and orange colours to show in the fall?",
        right: "The green chlorophyll fades away.",
        wrong: ["The tree starts making more chlorophyll.", "The leaves get more sunlight in the fall.", "The leaves dry out in the summer heat."],
        hint: "Paragraph 3 says what happens “as the green fades.”",
      },
      {
        prompt: "According to the text, what is chlorophyll?",
        right: "a chemical that helps plants use sunlight to make food",
        wrong: ["a yellow colour hidden in leaves", "a kind of maple tree", "a type of cool autumn weather"],
        hint: "The author defines it right after the word first appears.",
      },
      {
        prompt: "Which sentence shows that the yellow colours were in the leaf all along?",
        right: "During the summer, there is so much green chlorophyll that these colours stay hidden.",
        wrong: ["In the fall, the days get shorter and cooler.", "Some trees, such as many maples, also make bright red colours in the fall.", "In summer, most leaves are green because they are full of chlorophyll."],
        hint: "If a colour “stays hidden,” it must already be there.",
      },
      {
        prompt: "Which kind of fall weather would most likely give the brightest red maple leaves?",
        right: "sunny days and cool nights",
        wrong: ["cloudy days and warm nights", "rainy days and hot nights", "dark, snowy days"],
        hint: "The last sentence tells you what makes the reds stronger.",
      },
    ],
  },
  {
    kind: "info",
    levels: [2, 3],
    title: "Lights in the Northern Sky",
    paragraphs: [
      "On clear winter nights in northern Canada, curtains of green light sometimes ripple across the sky. These lights are called the aurora borealis, or northern lights. For a long time, people wondered what caused them.",
      "Scientists now know that the story begins at the Sun. The Sun constantly sends out a stream of tiny charged particles called the solar wind. When these particles reach Earth, our planet's magnetic field steers many of them toward the North and South poles.",
      "High above the ground, the particles crash into gases in the atmosphere. The collisions give the gases extra energy, which they release as light. Oxygen usually glows green, while nitrogen can add touches of blue and purple.",
      "Because the magnetic field guides the particles toward the poles, the lights are seen most often in places far to the north or far to the south. A similar display near the South Pole is called the aurora australis.",
    ],
    questions: [
      {
        prompt: "How is most of this text organized?",
        right: "cause and effect: it explains what makes the lights happen",
        wrong: ["problem and solution: it explains how to fix a problem", "compare and contrast: it compares two planets", "time order: it tells the life story of a scientist", "description of a place: it describes a northern town"],
        hint: "Paragraphs 2 and 3 explain a chain of events: the Sun, then particles, then collisions, then light.",
      },
      {
        prompt: "According to the text, what makes the gases give off light?",
        right: "Particles from the Sun crash into them and give them extra energy.",
        wrong: ["They reflect moonlight off the snow.", "They freeze in the cold winter air.", "They mix together near the ground.", "They are heated by city lights."],
        hint: "Paragraph 3 describes what happens “high above the ground.”",
      },
      {
        prompt: "Why are the northern lights rarely seen near the equator?",
        right: "Earth's magnetic field steers most of the particles toward the poles.",
        wrong: ["The Sun does not shine near the equator.", "There is no oxygen near the equator.", "The equator is always cloudy.", "The solar wind only blows in winter."],
        hint: "The last paragraph begins with “Because…”. That's your cause.",
      },
      {
        prompt: "In paragraph 2, what does the word “steers” mean?",
        right: "guides in a direction",
        wrong: ["stops completely", "heats up", "breaks apart", "hides from view"],
        hint: "Try each choice in the sentence: the magnetic field ___ the particles toward the poles.",
      },
      {
        prompt: "Which sentence best supports the idea that auroras happen in the south too?",
        right: "A similar display near the South Pole is called the aurora australis.",
        wrong: ["On clear winter nights in northern Canada, curtains of green light sometimes ripple across the sky.", "Oxygen usually glows green, while nitrogen can add touches of blue and purple.", "For a long time, people wondered what caused them.", "The Sun constantly sends out a stream of tiny charged particles called the solar wind."],
        hint: "Look for the sentence that names the South Pole.",
      },
    ],
  },
  {
    kind: "info",
    levels: [2, 3],
    title: "When the City Stays Bright",
    paragraphs: [
      "Every spring and fall, millions of songbirds migrate between their summer and winter homes. Many of them travel at night, when the air is cooler and there are fewer predators. Scientists believe these birds use the stars, along with Earth's magnetic field, to help find their way.",
      "Bright city lights can throw them off course. Birds flying over a brightly lit city may become confused and circle the glowing buildings until they are worn out. Some are hurt when they fly into windows that reflect the lights or the sky.",
      "The good news is that this problem has a simple solution. Some cities now encourage “Lights Out” nights during migration season. Office towers dim their lights after work hours, and families switch off outdoor lights they don't need.",
      "Turning off lights has another benefit, too: it saves electricity. A small change in our habits can help birds complete journeys that may cover thousands of kilometres.",
    ],
    questions: [
      {
        prompt: "What is the author's main purpose?",
        right: "to explain how city lights affect migrating birds and what people can do",
        wrong: ["to tell an entertaining story about one bird's journey", "to sell energy-saving light bulbs", "to teach readers how to build a birdhouse", "to compare songbirds with seabirds"],
        hint: "Think about the whole text: a problem in paragraph 2 and actions people can take in paragraphs 3 and 4.",
      },
      {
        prompt: "How is paragraph 3 connected to paragraph 2?",
        right: "Paragraph 2 describes a problem, and paragraph 3 gives a solution.",
        wrong: ["Paragraph 3 tells what happened before paragraph 2.", "Paragraph 3 disagrees with paragraph 2.", "Paragraph 3 compares birds to insects.", "Paragraph 3 repeats paragraph 2 in different words."],
        hint: "Paragraph 3 starts with “The good news is that this problem has a simple solution.”",
      },
      {
        prompt: "Why might a brightly lit window be especially dangerous for a bird?",
        right: "The bird may be drawn toward the light and not notice the glass.",
        wrong: ["Light from windows makes birds fall asleep.", "Birds look for food inside windows at night.", "Windows block Earth's magnetic field.", "The glass makes the air too warm."],
        hint: "Combine two clues: birds are drawn to the glowing buildings, and windows reflect light.",
      },
      {
        prompt: "Which sentence best supports the claim that the solution is simple?",
        right: "Office towers dim their lights after work hours, and families switch off outdoor lights they don't need.",
        wrong: ["Many of them travel at night, when the air is cooler and there are fewer predators.", "Scientists believe these birds use the stars, along with Earth's magnetic field, to help find their way.", "Some are hurt when they fly into windows that reflect the lights or the sky.", "Every spring and fall, millions of songbirds migrate between their summer and winter homes."],
        hint: "Find the sentence that describes easy actions people can take.",
      },
      {
        prompt: "In paragraph 2, what does “throw them off course” mean?",
        right: "make them lose their way",
        wrong: ["help them fly faster", "push them to the ground", "make them land on a boat", "teach them a new route"],
        hint: "Read the next sentence: the birds become confused and circle the buildings.",
      },
    ],
  },
];

function closeReading(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const choosePassage = (kind: Passage["kind"]) => pick(PASSAGES.filter((p) => p.kind === kind && p.levels.includes(level)));
  return shuffle([choosePassage("fiction"), choosePassage("info")]).flatMap((p) => {
    const visual = text(p.title, ...p.paragraphs);
    return sample(p.questions, 4).map((q) => choose(q.prompt, q.right, q.wrong, q.hint, level, visual));
  });
}

// ---------- Point of View ----------

type Pov = "first" | "second" | "limited" | "omniscient";

const POV_LABEL: Record<Pov, string> = {
  first: "First person",
  second: "Second person",
  limited: "Third person limited",
  omniscient: "Third person omniscient",
};

const POV_HINT: Record<Pov, string> = {
  first: "Look at the narration's pronouns. “I”, “my” or “we” means the narrator is a character telling the story: first person.",
  second: "The narrator speaks to the reader as “you,” as if you are the character. That's second person.",
  limited: "The narrator uses he, she or they and shares only one character's thoughts. Everyone else is seen from the outside: third person limited.",
  omniscient: "The narrator uses he, she or they and tells us what more than one character thinks or knows. That all-knowing view is third person omniscient.",
};

const EXCERPTS: { level: Level; pov: Pov; text: string }[] = [
  { level: 1, pov: "first", text: "I gripped the edge of the diving board and looked down at the water. My stomach flipped. Behind me, my cousin Ana called, “You've got this!”" },
  { level: 1, pov: "first", text: "When the power went out, my family lit candles and played cards until midnight. I had never heard my dad laugh so hard." },
  { level: 1, pov: "first", text: "My sister says I worry too much. Maybe she's right, but I still checked my backpack three times before the field trip." },
  { level: 1, pov: "limited", text: "Zoe could hear the rain drumming on the tent. She pulled her sleeping bag up to her chin and tried not to think about the leak she had spotted earlier." },
  { level: 1, pov: "limited", text: "Amir laced up his skates and stepped onto the ice. He hoped the coach would let him play forward this time. His heart pounded as she skated toward him." },
  { level: 1, pov: "omniscient", text: "The whole class was nervous about the spelling bee. Kenji was worried about long words, Ana was secretly excited, and Mr. Patel was hoping everyone would have fun." },
  { level: 2, pov: "limited", text: "Maya wondered whether anyone would notice her new haircut. When Jay glanced at her and quickly looked away, her cheeks burned. Did he hate it?" },
  { level: 2, pov: "limited", text: "Sam stared at the math test. He had studied for hours, but now every formula seemed to slip away. Across the room, Priya was already writing quickly." },
  { level: 2, pov: "omniscient", text: "Ravi was sure he had lost the race. Noah, standing at the finish line, knew Ravi had won by a step. Their coach was already thinking about how proud she felt of them both." },
  { level: 2, pov: "omniscient", text: "Lena hoped her grandmother would like the painting. Her grandmother, unwrapping it, thought it was the most beautiful gift she had ever received. Neither of them noticed the cat sneaking off with the ribbon." },
  { level: 2, pov: "first", text: "We waited at the bus stop for almost an hour before we realized the buses weren't running. Our breath made little clouds in the cold air." },
  { level: 3, pov: "first", text: "Ana was the fastest runner in our school. Everyone expected her to win the race, and honestly, so did I." },
  { level: 3, pov: "limited", text: "Leo watched his grandfather tie the fishing knot with quick, steady fingers. Leo tried to copy him, but his own line tangled into a hopeless mess. He was sure he would never get it right. Grandpa chuckled and handed him a fresh piece of line." },
  { level: 3, pov: "limited", text: "From her window, Zoe watched the new neighbours carry boxes into the house next door. A girl about her age dropped a lamp, then laughed. Zoe smiled. Maybe this summer wouldn't be so boring after all." },
  { level: 3, pov: "omniscient", text: "Neither Priya nor Kenji knew that the missing library book was under the back seat of the bus. Priya blamed herself. Kenji, meanwhile, was quietly planning to pay for it with his allowance." },
  { level: 3, pov: "second", text: "You step onto the frozen lake and listen. The ice creaks under your boots, and you hold your breath." },
  { level: 3, pov: "second", text: "You open the small wooden box slowly. Inside, you find a key you have never seen before." },
  { level: 1, pov: "first", text: "I tiptoed into the kitchen and lifted the lid of the cookie jar. My heart was racing, but I couldn't stop grinning." },
  { level: 1, pov: "limited", text: "Jay stared at the soccer ball sitting on the penalty spot. He took a deep breath and wondered if his legs would stop shaking." },
  { level: 1, pov: "omniscient", text: "At the bake sale, Lena worried that nobody would buy her muffins. The customer at her table was thinking about how delicious they smelled, and Lena's mom was proud of her." },
  { level: 2, pov: "first", text: "My brother and I built a fort out of couch cushions. I was sure it was the best one ever, though he kept saying the roof was too low." },
  { level: 2, pov: "limited", text: "Noah noticed the empty chair beside him. He wished Amir had come to the party, and he wondered whether he had said something wrong the day before." },
  { level: 2, pov: "omniscient", text: "Sam thought the surprise would be perfect. His sister Zoe had already guessed it, but she was pretending not to know. Their dad, hiding in the hallway, was trying not to laugh." },
  { level: 3, pov: "first", text: "Looking back, I see that nobody at the table was really listening to me that night, though at the time I convinced myself they were." },
  { level: 3, pov: "limited", text: "Priya wasn't sure why the old clock in the hallway kept stopping at 3:15. She tapped it twice and held it to her ear. Behind her, the floorboards creaked, but she was too curious to turn around." },
  { level: 3, pov: "omniscient", text: "Ana believed the lost kitten had run away for good. Leo, watching from the window, knew it was asleep in the garden shed. The kitten itself dreamed only of warm milk." },
  { level: 3, pov: "second", text: "You tighten your helmet and push off down the hill. The wind roars in your ears, and you laugh out loud." },
];

const POV_CONCEPTS: Item[] = [
  {
    level: 1,
    prompt: "Which pronouns in the narration are the biggest clue that a story is told in first person?",
    right: "I, me, my, we",
    wrong: ["he, she, they", "you, your", "it, its"],
    hint: "In first person, the narrator is a character, so they talk about themselves.",
  },
  {
    level: 1,
    prompt: "In third person limited, the narrator shares the thoughts and feelings of…",
    right: "one character",
    wrong: ["every character", "no characters at all", "the reader"],
    hint: "“Limited” means the narrator stays with just one character's mind.",
  },
  {
    level: 1,
    prompt: "In third person omniscient, the narrator…",
    right: "knows what many characters think and feel",
    wrong: ["only knows what one character thinks", "is a character telling their own story", "speaks to the reader as “you”"],
    hint: "Omniscient means all-knowing.",
  },
  {
    level: 2,
    prompt: "What is something a first-person narrator can NOT know for sure?",
    right: "what other characters are secretly thinking",
    wrong: ["how they feel themselves", "what they see and hear", "what they remember from yesterday"],
    hint: "A first-person narrator is one character. Can you read other people's minds?",
  },
  {
    level: 2,
    prompt: "Which sentence is written in first person?",
    right: "I grabbed my umbrella and ran for the bus.",
    wrong: ["Kenji grabbed his umbrella and ran for the bus.", "You grab your umbrella and run for the bus.", "They grabbed their umbrellas and ran for the bus."],
    hint: "First person uses I, me or my.",
  },
  {
    level: 2,
    prompt: "Retell this in first person from Priya's point of view: “Priya packed her lunch and hurried out the door.”",
    right: "I packed my lunch and hurried out the door.",
    wrong: ["She packed her lunch and hurried out the door.", "You pack your lunch and hurry out the door.", "Priya packed my lunch and hurried out the door."],
    hint: "Priya becomes “I” and her lunch becomes “my lunch.”",
  },
  {
    level: 2,
    prompt: "Why might an author choose to write in first person?",
    right: "to let readers experience events through one character's own voice and thoughts",
    wrong: ["to show every character's secret thoughts", "to give the reader step-by-step instructions", "to make sure the story has no narrator"],
    hint: "First person puts you inside the narrator's head.",
  },
  {
    level: 3,
    prompt: "Why might an author use third person omniscient for a story about a family disagreement?",
    right: "to show how each family member sees the disagreement differently",
    wrong: ["to keep readers from knowing anyone's feelings", "so only one family member can tell the story", "to make the reader feel like a character called “you”"],
    hint: "An omniscient narrator can move between many characters' thoughts.",
  },
  {
    level: 3,
    prompt: "A story is told in third person limited, through Maya's eyes. Which sentence could NOT appear in it?",
    right: "Jay secretly thought Maya's haircut looked great.",
    wrong: ["Maya wondered if anyone noticed her haircut.", "Jay glanced at Maya and looked away.", "Maya felt her cheeks grow warm."],
    hint: "A limited narrator only knows Maya's thoughts. Other characters' private thoughts are off limits.",
  },
  {
    level: 3,
    prompt: "How does first-person narration affect what readers learn?",
    right: "Readers learn only what the narrator notices, thinks or chooses to share.",
    wrong: ["Readers learn every character's thoughts equally.", "Readers can never learn the narrator's feelings.", "Readers learn only facts, never opinions."],
    hint: "Everything comes through one character's eyes and opinions.",
  },
  {
    level: 3,
    prompt: "Instructions often speak straight to the reader: “Mix the flour, then add your eggs.” Which point of view is that?",
    right: "Second person",
    wrong: ["First person", "Third person limited", "Third person omniscient"],
    hint: "Instructions are aimed at “you,” even when the word is only understood.",
  },
  {
    level: 1,
    prompt: "Which sentence is written in third person?",
    right: "Zoe opened her lunch and smiled.",
    wrong: ["I opened my lunch and smiled.", "You open your lunch and smile.", "We opened our lunches and smiled."],
    hint: "Third person uses names and he, she or they.",
  },
  {
    level: 2,
    prompt: "Retell this in third person from Kenji's point of view: “I left my skates by the door.”",
    right: "Kenji left his skates by the door.",
    wrong: ["I left Kenji's skates by the door.", "You left your skates by the door.", "Kenji left my skates by the door."],
    hint: "“I” becomes Kenji, and “my skates” becomes “his skates.”",
  },
  {
    level: 2,
    prompt: "Which narrator would be best to show us only what a nervous new student feels?",
    right: "first person, told by the new student",
    wrong: ["third person omniscient", "second person speaking to the reader", "a narrator who only describes the weather"],
    hint: "A single character telling their own story lets readers feel their nerves up close.",
  },
  {
    level: 3,
    prompt: "A story switches back and forth between what a teacher and a student are thinking. It is most likely…",
    right: "third person omniscient",
    wrong: ["first person", "third person limited", "second person"],
    hint: "Moving between more than one character's thoughts means the narrator knows more than any one character.",
  },
  {
    level: 3,
    prompt: "Why might an author choose third person limited instead of omniscient for a mystery?",
    right: "so readers only know what the detective knows, and the clues stay hidden",
    wrong: ["so every suspect's secret thoughts are revealed at once", "so the story has no characters", "so the narrator can speak directly to “you”"],
    hint: "Staying with one mind keeps some facts a surprise.",
  },
];

function pointOfView(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const excerpts = draw(EXCERPTS, 5, level).map((e) => {
    const options: Pov[] =
      level === 3 || e.pov === "second" ? ["first", "second", "limited", "omniscient"] : ["first", "limited", "omniscient"];
    return textChoice(
      "From which point of view is this passage told?",
      POV_LABEL[e.pov],
      options.filter((p) => p !== e.pov).map((p) => POV_LABEL[p]),
      POV_HINT[e.pov],
      text(undefined, e.text),
    );
  });
  return shuffle([...excerpts, ...askSome(POV_CONCEPTS, 3, level)]);
}

// ---------- Figurative Language ----------

type Device = "simile" | "metaphor" | "personification" | "hyperbole" | "onomatopoeia" | "alliteration" | "idiom";

const DEVICE_LABEL: Record<Device, string> = {
  simile: "Simile",
  metaphor: "Metaphor",
  personification: "Personification",
  hyperbole: "Hyperbole",
  onomatopoeia: "Onomatopoeia",
  alliteration: "Alliteration",
  idiom: "Idiom",
};

const DEVICE_HINT: Record<Device, string> = {
  simile: "A simile compares two different things using “like” or “as.”",
  metaphor: "A metaphor compares two things by saying one thing IS another, without “like” or “as.”",
  personification: "Personification gives human actions or feelings to something that isn't human.",
  hyperbole: "Hyperbole is a huge exaggeration that isn't meant to be taken literally.",
  onomatopoeia: "Onomatopoeia is a word that imitates a sound, like sizzle, crash or buzz.",
  alliteration: "Alliteration repeats the same beginning sound in words that are close together.",
  idiom: "An idiom is a common saying whose meaning is different from the meanings of its words.",
};

const DEVICES: { level: Level; text: string; device: Device; avoid?: Device[] }[] = [
  { level: 1, device: "simile", text: "The lake was as smooth as glass this morning." },
  { level: 1, device: "simile", text: "Maya's laugh sounded like wind chimes." },
  { level: 1, device: "simile", text: "The kitten's fur was as soft as a cotton ball." },
  { level: 2, device: "simile", text: "The stars glittered like tiny jewels on a dark blanket." },
  { level: 1, device: "metaphor", text: "After the fire drill, the classroom was a zoo.", avoid: ["hyperbole", "idiom"] },
  { level: 2, device: "metaphor", text: "The highway was a river of glowing tail lights." },
  { level: 2, device: "metaphor", text: "Grandpa's backyard is a rainbow of flowers in July." },
  { level: 3, device: "metaphor", text: "Hope is a small lamp glowing in a dark room." },
  { level: 3, device: "metaphor", text: "The old library was a treasure chest of stories." },
  { level: 1, device: "personification", text: "The flowers nodded their heads in the breeze." },
  { level: 1, device: "personification", text: "The moon peeked out from behind the clouds." },
  { level: 2, device: "personification", text: "The fallen leaves danced across the parking lot." },
  { level: 2, device: "personification", text: "My alarm clock nagged me to get out of bed." },
  { level: 3, device: "personification", text: "The old house sighed as the storm pushed against it." },
  { level: 1, device: "hyperbole", text: "I've asked you a million times to close the door!" },
  { level: 2, device: "hyperbole", text: "The lineup at the pool was ten kilometres long." },
  { level: 2, device: "hyperbole", text: "This backpack weighs a ton.", avoid: ["idiom"] },
  { level: 3, device: "hyperbole", text: "We waited so long for the bus that the seasons changed." },
  { level: 1, device: "onomatopoeia", text: "The bacon sizzled in the pan." },
  { level: 1, device: "onomatopoeia", text: "Crash! The tray of cups hit the floor." },
  { level: 2, device: "onomatopoeia", text: "The rain went drip, drip, drip on the metal roof.", avoid: ["alliteration"] },
  { level: 3, device: "onomatopoeia", text: "Buzz! A bee zipped past my ear.", avoid: ["alliteration"] },
  { level: 1, device: "alliteration", text: "Seven silly seals slid down the slope." },
  { level: 2, device: "alliteration", text: "Priya picked a pack of purple pencils." },
  { level: 2, device: "alliteration", text: "Big brown bears bumbled by the brook." },
  { level: 3, device: "alliteration", text: "Lena's lime-green lizard lounged lazily in the light." },
  { level: 2, device: "idiom", text: "Don't worry, the quiz was a piece of cake.", avoid: ["metaphor"] },
  { level: 2, device: "idiom", text: "It's raining cats and dogs out there!", avoid: ["metaphor", "hyperbole"] },
  { level: 2, device: "idiom", text: "Break a leg in the play tonight!", avoid: ["metaphor", "hyperbole"] },
  { level: 3, device: "idiom", text: "Ana let the cat out of the bag about the surprise party.", avoid: ["metaphor"] },
  { level: 3, device: "idiom", text: "Ravi was feeling under the weather, so he stayed home.", avoid: ["metaphor"] },
];

type Sense = "Sight" | "Sound" | "Smell" | "Taste" | "Touch";
const SENSES: Sense[] = ["Sight", "Sound", "Smell", "Taste", "Touch"];

const IMAGERY: { text: string; sense: Sense; clue: string }[] = [
  { text: "The scent of warm cinnamon buns drifted out of the bakery.", sense: "Smell", clue: "scent" },
  { text: "After the rain, the air smelled of wet earth and pine needles.", sense: "Smell", clue: "smelled of wet earth" },
  { text: "The icy metal railing stung my bare fingers.", sense: "Touch", clue: "stung my bare fingers" },
  { text: "The wool sweater felt scratchy against my neck.", sense: "Touch", clue: "felt scratchy" },
  { text: "Waves crashed against the rocks while gulls shrieked overhead.", sense: "Sound", clue: "crashed, shrieked" },
  { text: "Somewhere down the hall, a phone buzzed and a door clicked shut.", sense: "Sound", clue: "buzzed, clicked" },
  { text: "The lemonade was so sour that it made my cheeks pucker.", sense: "Taste", clue: "sour" },
  { text: "The salty, buttery popcorn melted on my tongue.", sense: "Taste", clue: "salty, buttery … on my tongue" },
  { text: "Orange and pink streaks spread across the evening sky.", sense: "Sight", clue: "orange and pink streaks" },
  { text: "Sunlight sparkled on the frost-covered windows.", sense: "Sight", clue: "sparkled" },
];

const FIGURATIVE_MEANING: Item[] = [
  {
    level: 1,
    prompt: "What does this metaphor mean?",
    visual: line("After the long hike, Amir's legs were wet noodles."),
    right: "His legs felt weak and wobbly.",
    wrong: ["His legs were soaked from the rain.", "He ate noodles after the hike.", "His legs were long and thin."],
    hint: "Think about how a cooked noodle behaves. How would legs like that feel after a hike?",
  },
  {
    level: 1,
    prompt: "What does this metaphor suggest about Jay?",
    visual: line("Jay is a walking dictionary."),
    right: "Jay knows a lot of words.",
    wrong: ["Jay walks to school every day.", "Jay carries a heavy book.", "Jay likes to read while walking."],
    hint: "What is a dictionary full of?",
  },
  {
    level: 1,
    prompt: "What does the writer want you to understand?",
    visual: line("By the afternoon, the classroom was an oven."),
    right: "The classroom was very hot.",
    wrong: ["The class was baking cookies.", "The classroom had a new stove.", "The afternoon went by quickly."],
    hint: "The room isn't really an oven. What do ovens and the room have in common?",
  },
  {
    level: 2,
    prompt: "What does the idiom in this sentence mean?",
    visual: line("With the test on Friday, it was time to hit the books."),
    right: "to study hard",
    wrong: ["to knock books off a shelf", "to throw old books away", "to write a new book"],
    hint: "Idioms don't mean what their words say. What do people do before a test?",
  },
  {
    level: 2,
    prompt: "What does “on thin ice” mean in this sentence?",
    visual: line("After forgetting his chores again, Leo was on thin ice."),
    right: "in a risky situation where he might get in trouble",
    wrong: ["skating on a frozen pond", "feeling very cold", "standing perfectly still"],
    hint: "Thin ice could crack at any moment. What might happen if Leo forgets his chores once more?",
  },
  {
    level: 2,
    prompt: "What does the bracelet most likely symbolize?",
    visual: text(
      undefined,
      "After their argument, Lena and Priya didn't speak for a whole week. On Friday, Priya left a friendship bracelet on Lena's desk. It had the same pattern the two of them had made together at camp.",
    ),
    right: "their friendship and Priya's wish to make up",
    wrong: ["Priya's love of crafts", "the rules of summer camp", "Lena's favourite colour"],
    hint: "A symbol is an object that stands for a bigger idea. Why would Priya give this bracelet right after an argument?",
  },
  {
    level: 2,
    prompt: "What does the sunlight most likely symbolize?",
    visual: text(
      undefined,
      "All winter, Maya's family worried about Grandma, who was in the hospital. On the morning Grandma finally came home, the clouds parted and sunlight poured through the kitchen window.",
    ),
    right: "relief and the start of a happier time",
    wrong: ["the start of a heat wave", "a need to close the curtains", "Maya's worry about the hospital"],
    hint: "The sunlight appears at the exact moment the family's worry ends. What feeling does it stand for?",
  },
  {
    level: 3,
    prompt: "What does this metaphor mean?",
    visual: line("Time is a thief."),
    right: "Time seems to take things from us without our noticing.",
    wrong: ["Someone stole a clock.", "Being late is against the law.", "Time moves very slowly."],
    hint: "What does a thief do, and how could time do something similar?",
  },
  {
    level: 3,
    prompt: "What effect does this metaphor create?",
    visual: line("Her kind words were a warm blanket on a cold day."),
    right: "It shows that her words were comforting.",
    wrong: ["It shows that she was talking about the weather.", "It shows that her words were too long.", "It shows that she was sleepy."],
    hint: "How does a warm blanket make you feel on a cold day?",
  },
  {
    level: 3,
    prompt: "What do the pencil marks most likely symbolize?",
    visual: text(
      undefined,
      "Every September, Noah's family marks his height on the kitchen door frame. This year, Noah noticed the pencil marks climbing higher and higher, the oldest ones faded almost to nothing.",
    ),
    right: "how much Noah has grown and changed over time",
    wrong: ["the family's need to repaint the kitchen", "Noah's worry about being too short", "a rule about where to draw"],
    hint: "Old marks fade and new marks climb higher each year. What bigger idea does that show?",
  },
  {
    level: 3,
    prompt: "What does the seedling most likely symbolize?",
    visual: text(
      undefined,
      "All year, Ravi struggled with reading. One spring morning, he noticed a tiny green seedling pushing up through a crack in the school sidewalk. He checked on it every day.",
    ),
    right: "hope and the ability to grow in a tough place",
    wrong: ["the school's need for a new sidewalk", "Ravi's plan to become a gardener", "the start of the summer holidays"],
    hint: "Ravi is struggling, and so is the seedling, growing through concrete. What might it mean to him?",
  },
  {
    level: 3,
    prompt: "What does the key most likely symbolize?",
    visual: text(
      undefined,
      "When Amir's family moved to Canada, his grandmother gave him the key to their old home far away. Even though it no longer opened any door he could reach, Amir wore it on a string around his neck.",
    ),
    right: "his connection to his family's past and first home",
    wrong: ["his fear of being locked out", "the front door of his new house", "a gift he plans to sell"],
    hint: "The key can't open anything now, yet he keeps it close. What does it help him hold on to?",
  },
];

function figurative(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const [nDevice, nImagery, nMeaning] = level === 1 ? [4, 2, 2] : level === 2 ? [3, 2, 3] : [3, 1, 4];

  const devices = draw(DEVICES, nDevice, level).map((d) => {
    const others = (Object.keys(DEVICE_LABEL) as Device[]).filter((x) => x !== d.device && !d.avoid?.includes(x));
    return choose(
      "What kind of figurative language is used here?",
      DEVICE_LABEL[d.device],
      others.map((x) => DEVICE_LABEL[x]),
      DEVICE_HINT[d.device],
      level,
      line(d.text),
    );
  });

  const imagery = sample(IMAGERY, nImagery).map((im) =>
    choose(
      "Which sense does this imagery mostly appeal to?",
      im.sense,
      SENSES.filter((s) => s !== im.sense),
      `Find the key words (“${im.clue}”). Which sense would notice that?`,
      level,
      line(im.text),
    ),
  );

  return shuffle([...devices, ...imagery, ...askSome(FIGURATIVE_MEANING, nMeaning, level)]);
}

// ---------- Connotation & Tone ----------

/** Words with the same denotation but positive, neutral and negative connotations. */
const SHADES: { level: Level; pos: string; neu: string; neg: string; meaning: string }[] = [
  { level: 1, pos: "aroma", neu: "smell", neg: "stench", meaning: "a smell" },
  { level: 1, pos: "slender", neu: "thin", neg: "scrawny", meaning: "not wide or heavy" },
  { level: 1, pos: "cozy", neu: "small", neg: "cramped", meaning: "little in size" },
  { level: 1, pos: "home", neu: "house", neg: "shack", meaning: "a building where people live" },
  { level: 2, pos: "unique", neu: "unusual", neg: "weird", meaning: "not common or ordinary" },
  { level: 2, pos: "youthful", neu: "young", neg: "childish", meaning: "like a young person" },
  { level: 2, pos: "stroll", neu: "walk", neg: "trudge", meaning: "to move along on foot" },
  { level: 3, pos: "renowned", neu: "well-known", neg: "notorious", meaning: "known by many people" },
  { level: 3, pos: "vintage", neu: "old", neg: "outdated", meaning: "made a long time ago" },
];

/** Positive / negative pairs that share a meaning. */
const PAIRS: [string, string][] = [
  ["thrifty", "stingy"],
  ["confident", "arrogant"],
  ["curious", "nosy"],
  ["determined", "stubborn"],
  ["relaxed", "lazy"],
  ["assertive", "pushy"],
  ["bold", "reckless"],
];

const WORD_CHOICE: Item[] = [
  {
    level: 1,
    prompt: "What is a word's denotation?",
    right: "its dictionary meaning",
    wrong: ["the feelings it suggests", "how many syllables it has", "the language it came from"],
    hint: "Denotation is the plain, exact meaning. Connotation is the feeling that comes with it.",
  },
  {
    level: 1,
    prompt: "What is a word's connotation?",
    right: "the feelings or ideas it suggests",
    wrong: ["its exact dictionary meaning", "its opposite", "the way it is spelled"],
    hint: "“Home” and “house” have the same dictionary meaning, but “home” feels warmer. That feeling is connotation.",
  },
  {
    level: 2,
    prompt: "A travel website wants its cabin to sound appealing. Which word fits best? “Our _____ cabin sleeps four.”",
    right: "cozy",
    wrong: ["cramped", "small"],
    hint: "All three mean “not big.” Which one makes you want to stay there?",
  },
  {
    level: 2,
    prompt: "A reviewer wants readers to dislike a character. Which word fits best? “The hero was _____ and refused to listen to anyone's advice.”",
    right: "stubborn",
    wrong: ["determined", "cheerful"],
    hint: "“Determined” and “stubborn” both mean not giving up, but one sounds negative.",
  },
  {
    level: 2,
    prompt: "A writer wants readers to admire a scientist. Which word fits best? “Dr. Okafor is a _____ scientist.”",
    right: "renowned",
    wrong: ["notorious", "well-known"],
    hint: "All three mean famous. “Notorious” means famous for something bad; “renowned” means famous and respected.",
  },
  {
    level: 2,
    prompt: "Which sentence makes the room sound unpleasant?",
    right: "The room was cramped and dim.",
    wrong: ["The room was cozy and softly lit.", "The room was small and had one lamp."],
    hint: "Look for words with negative connotations.",
  },
  {
    level: 2,
    prompt: "Which sentence shows that the writer admires Leo?",
    right: "Leo is confident and speaks up in class.",
    wrong: ["Leo is arrogant and talks over everyone.", "Leo talks in class."],
    hint: "“Confident” and “arrogant” are close in meaning, but only one is a compliment.",
  },
  {
    level: 3,
    prompt: "Two news reports describe the same event. One says “a crowd gathered.” The other says “a mob gathered.” What does the word “mob” suggest?",
    right: "The group was unruly and out of control.",
    wrong: ["The group was small and quiet.", "The group was very well organized.", "The group gathered by accident."],
    hint: "“Crowd” is neutral. “Mob” carries a negative connotation. What picture does it create?",
  },
  {
    level: 3,
    prompt: "A store describes its old furniture as “vintage.” Why choose that word instead of “old”?",
    right: "“Vintage” makes the furniture sound stylish and valuable.",
    wrong: ["“Vintage” means the furniture is brand new.", "“Vintage” makes the furniture sound worn out.", "“Vintage” is shorter and easier to spell."],
    hint: "Stores want things to sound appealing. What feeling does “vintage” add?",
  },
  {
    level: 3,
    prompt: "A writer wants to make someone who saves money sound unpleasant. Which word should they use?",
    right: "stingy",
    wrong: ["thrifty", "sensible", "careful"],
    hint: "Which word suggests someone is unwilling to share, not just careful with money?",
  },
];

const TONES: Item[] = [
  {
    level: 1,
    prompt: "What is the tone of this passage?",
    visual: line("Finally! After months of practice, our team won the championship!"),
    right: "excited",
    wrong: ["bored", "worried", "gloomy"],
    hint: "Look at the exclamation marks and the words “Finally!” and “won.”",
  },
  {
    level: 1,
    prompt: "What is the tone of this note?",
    visual: line("Thank you for staying late to help us set up. We couldn't have done it without you."),
    right: "grateful",
    wrong: ["annoyed", "suspicious", "bored"],
    hint: "The writer says “Thank you” and gives credit to the reader.",
  },
  {
    level: 1,
    prompt: "What is the tone of this passage?",
    visual: line("My dog thinks he is a lion. He “guards” the house by sleeping on the front mat and snoring loudly."),
    right: "humorous",
    wrong: ["angry", "frightened", "sorrowful"],
    hint: "A snoring “guard” dog who thinks he's a lion. Is the writer trying to make you laugh?",
  },
  {
    level: 2,
    prompt: "What is the tone of this message?",
    visual: line("Please be careful near the edge. The rocks are slippery, and the water is deeper than it looks."),
    right: "cautious",
    wrong: ["playful", "furious", "bored"],
    hint: "The writer gives a warning about possible danger.",
  },
  {
    level: 2,
    prompt: "What is the tone of this description?",
    visual: line("The empty playground was silent. A single swing creaked in the wind, and the gate hung open."),
    right: "lonely",
    wrong: ["cheerful", "silly", "excited"],
    hint: "Empty, silent, a single swing: what mood do these details create?",
  },
  {
    level: 2,
    prompt: "What is the tone of this comment?",
    visual: line("Pool fees went up again this year, and once again nobody asked the families who actually use the pool."),
    right: "frustrated",
    wrong: ["joyful", "grateful", "amused"],
    hint: "Notice “again” and “once again nobody asked.” How does the writer feel about it?",
  },
  {
    level: 3,
    prompt: "What is the tone of this passage?",
    visual: line("I can still picture Grandma's kitchen: warm bread, the radio humming, her flour-dusted hands. Those Sunday mornings were the best."),
    right: "nostalgic",
    wrong: ["furious", "anxious", "sarcastic", "indifferent"],
    hint: "Nostalgic means looking back fondly on the past.",
  },
  {
    level: 3,
    prompt: "What is the tone of Leo's words?",
    visual: line("Leo rolled his eyes. “Oh, wonderful. I just love cleaning the garage on the first sunny day of summer.”"),
    right: "sarcastic",
    wrong: ["sincere", "grateful", "fearful", "nostalgic"],
    hint: "Leo rolls his eyes, so he means the opposite of what he says. That's sarcasm.",
  },
  {
    level: 3,
    prompt: "What is the tone of this passage?",
    visual: line("What was that noise? Kenji held his breath and listened. Slowly, the closet door began to creak open…"),
    right: "suspenseful",
    wrong: ["relaxed", "humorous", "sorrowful", "admiring"],
    hint: "A mystery noise, held breath and a slowly opening door all make you wonder what happens next.",
  },
  {
    level: 3,
    prompt: "What is the writer's tone toward Dr. Okafor?",
    visual: line("Dr. Okafor spent twenty years studying wetlands, and her careful work helped protect three of them for future generations."),
    right: "admiring",
    wrong: ["mocking", "bored", "fearful", "sarcastic"],
    hint: "Words like “careful work” and “helped protect” show how the writer feels about her.",
  },
];

function connotation(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const shades = draw(SHADES, 4, level);
  const nShade = level === 1 ? 3 : level === 2 ? 2 : 1;
  // Word sets used by the questions below stay out of the sort.
  const unused = SHADES.filter((s) => !shades.slice(0, nShade + 1).includes(s));

  // Sort: positive vs negative (plus neutral at level 3).
  const posNeg = shuffle([
    ...PAIRS.map(([pos, neg]) => ({ pos, neg })),
    ...unused.filter((s) => s.level <= Math.max(level, 2)).map((s) => ({ pos: s.pos, neg: s.neg })),
  ]);
  const sort =
    level === 3
      ? sortOf(
          "Sort each word by its connotation.",
          "Neutral words just state the meaning. Positive words sound pleasant; negative words sound unpleasant.",
          [
            { id: "pos", label: "Positive", emoji: "😊" },
            { id: "neu", label: "Neutral", emoji: "😐" },
            { id: "neg", label: "Negative", emoji: "😒" },
          ],
          shuffle(unused).slice(0, 6).map((s, i) => {
            const bin = (["pos", "neu", "neg"] as const)[i % 3];
            return { label: s[bin], bin };
          }),
          "🔤",
        )
      : sortOf(
          "Sort each word: positive or negative connotation?",
          "Ask yourself: would you feel pleased or upset if someone used this word to describe you?",
          [
            { id: "pos", label: "Positive", emoji: "😊" },
            { id: "neg", label: "Negative", emoji: "😒" },
          ],
          posNeg.slice(0, 6).map((p, i) => (i % 2 === 0 ? { label: p.pos, bin: "pos" } : { label: p.neg, bin: "neg" })),
          "🔤",
        );

  const shadeQs = shades.slice(0, nShade).map((s) => {
    const positive = level === 1 || chance(0.5);
    return textChoice(
      `Which word has the most ${positive ? "positive" : "negative"} connotation?`,
      positive ? s.pos : s.neg,
      positive ? [s.neu, s.neg] : [s.neu, s.pos],
      `All three words mean about the same thing (${s.meaning}). Which one sounds the most ${positive ? "pleasant" : "unpleasant"}?`,
    );
  });

  const denote: Question[] =
    level === 3
      ? []
      : [shades[nShade]].map((s) =>
          choose(
            `“${s.pos}” and “${s.neg}” have the same denotation (dictionary meaning). What is it?`,
            s.meaning,
            SHADES.filter((o) => o !== s).map((o) => o.meaning),
            `Ignore the feelings for a moment. “${s.neu}” is the plain word that means the same thing.`,
            level,
          ),
        );

  const [nChoice, nTone] = level === 1 ? [1, 2] : level === 2 ? [2, 2] : [3, 3];
  return [
    sort,
    ...shuffle([...shadeQs, ...denote, ...askSome(WORD_CHOICE, nChoice, level), ...askSome(TONES, nTone, level)]),
  ];
}

// ---------- Persuasive Writing ----------

const COMPOST = text(
  "Let's Compost!",
  "Our school should start a composting program. Every day, our cafeteria throws away bags of fruit peels and vegetable scraps. Compost would turn that waste into rich soil for the school garden. Some people worry that compost bins will smell. However, a covered bin that is turned regularly has very little odour. Starting a program now would help our school waste less and grow more.",
);

const OUTSIDE = text(
  "More Time Outside",
  "Students should get more outdoor time during the school day. Time outside gives students a chance to move, which can help them focus afterward. In our class survey, 22 of 27 students said they felt calmer after recess. Some teachers argue that more outdoor time means less time for learning. However, students who come back focused may learn more in less time. A little more time outside is an investment in learning.",
);

const BIKE_LANE = text(
  "A Safer Street",
  "Our town should add a bike lane on Maple Street. Right now, students who bike to school must ride beside fast-moving cars. A painted lane would give riders their own safe space. Some neighbours worry that a bike lane will take away parking spots. However, most homes on the street have driveways, and the lane would remove only six spots. A bike lane would make the street safer for everyone.",
);

const claim = (c: string): Visual => text("Claim", c);

const TECHNIQUES = {
  bandwagon: "Bandwagon (everyone's doing it)",
  expert: "Expert opinion",
  emotion: "Emotional appeal",
  stats: "Facts and statistics",
  question: "Rhetorical question",
};

function technique(level: Level, example: string, key: keyof typeof TECHNIQUES, hint: string): Item {
  return {
    level,
    prompt: "Which persuasive technique does this use?",
    visual: line(example),
    right: TECHNIQUES[key],
    wrong: Object.entries(TECHNIQUES)
      .filter(([k]) => k !== key)
      .map(([, v]) => v),
    hint,
  };
}

const PERSUADE: Item[] = [
  {
    level: 1,
    prompt: "What is the main purpose of persuasive writing?",
    right: "to convince readers to agree or take action",
    wrong: ["to tell a made-up story", "to explain how to do something step by step", "to describe a person's life"],
    hint: "To persuade means to convince.",
  },
  {
    level: 1,
    prompt: "What is the writer's claim (main argument)?",
    visual: COMPOST,
    right: "Our school should start a composting program.",
    wrong: ["Every day, our cafeteria throws away bags of fruit peels and vegetable scraps.", "Some people worry that compost bins will smell.", "Compost would turn that waste into rich soil for the school garden."],
    hint: "The claim is the position the whole paragraph argues for. It's often the first sentence.",
  },
  {
    level: 1,
    prompt: "Which evidence best supports this claim?",
    visual: claim("Our school needs a covered bike shelter."),
    right: "Last month, 40 students biked to school, and their bikes sat out in the rain.",
    wrong: ["Bikes come in many colours.", "My cousin has a red bike.", "Riding a bike is fun."],
    hint: "Good evidence connects directly to the claim. Which fact shows a shelter is needed?",
  },
  {
    level: 1,
    prompt: "Which evidence best supports this claim?",
    visual: claim("The school library should stay open until 5:00."),
    right: "Many students wait for rides until 5:00 and have nowhere quiet to do homework.",
    wrong: ["The library was built more than 50 years ago.", "Some people prefer reading at home.", "Libraries have many shelves."],
    hint: "Which reason explains why later hours would help students?",
  },
  {
    level: 1,
    prompt: "Which is the best hook to start a speech about reducing food waste?",
    right: "Imagine filling three grocery bags and then dropping one straight into the garbage.",
    wrong: ["My name is Sam and this is my speech about food.", "Food is something people eat.", "In conclusion, food waste is bad."],
    hint: "A hook grabs the audience's attention and makes them want to hear more.",
  },
  {
    level: 2,
    prompt: "Which sentence presents a counterargument?",
    visual: COMPOST,
    right: "Some people worry that compost bins will smell.",
    wrong: ["Our school should start a composting program.", "However, a covered bin that is turned regularly has very little odour.", "Compost would turn that waste into rich soil for the school garden."],
    hint: "A counterargument is what someone on the other side might say.",
  },
  {
    level: 2,
    prompt: "Which sentence is the writer's rebuttal (the answer to the other side)?",
    visual: COMPOST,
    right: "However, a covered bin that is turned regularly has very little odour.",
    wrong: ["Some people worry that compost bins will smell.", "Our school should start a composting program.", "Every day, our cafeteria throws away bags of fruit peels and vegetable scraps."],
    hint: "A rebuttal answers the counterargument. Look for a signal word like “However.”",
  },
  {
    level: 2,
    prompt: "Which sentence uses data from the writer's own research?",
    visual: OUTSIDE,
    right: "In our class survey, 22 of 27 students said they felt calmer after recess.",
    wrong: ["Students should get more outdoor time during the school day.", "Some teachers argue that more outdoor time means less time for learning.", "A little more time outside is an investment in learning."],
    hint: "Data means numbers collected by counting or surveying.",
  },
  {
    level: 2,
    prompt: "Which evidence best supports this claim?",
    visual: claim("Students should learn to cook at school."),
    right: "Cooking teaches measuring, planning and food safety, skills people use all their lives.",
    wrong: ["My favourite food is pasta.", "Cooking shows are popular on TV.", "Some kitchens are very small."],
    hint: "Choose the reason that explains why cooking is worth learning at school.",
  },
  {
    level: 2,
    prompt: "Which evidence best supports this claim?",
    visual: claim("Our school should install water bottle refill stations."),
    right: "One refill station can keep thousands of plastic bottles out of the garbage each year.",
    wrong: ["Water is made of hydrogen and oxygen.", "Some students prefer juice.", "Plastic bottles come in many sizes."],
    hint: "Which fact shows a real benefit of having refill stations?",
  },
  {
    level: 2,
    prompt: "Which sentence is a counterargument to this claim?",
    visual: claim("Our school should have a longer lunch break."),
    right: "Some people say a longer lunch would make the school day end later.",
    wrong: ["A longer lunch would give students time to eat and play.", "Students who eat slowly often can't finish their food.", "In conclusion, our school needs a longer lunch break."],
    hint: "A counterargument is a reason someone might disagree with the claim.",
  },
  {
    level: 2,
    prompt: "Who is the best audience for a letter asking for a crosswalk near the school?",
    right: "local council members, who can approve it",
    wrong: ["kindergarten students", "a cookbook author", "people living in another country"],
    hint: "Write to the people who have the power to make the change.",
  },
  technique(2, "Join the thousands of students who already use this homework app!", "bandwagon", "The ad says lots of other people are doing it, so you should too."),
  technique(
    2,
    "Picture a shy puppy waiting at the shelter for someone to take it home. Your donation can give it a warm bed tonight.",
    "emotion",
    "The writer wants you to feel sympathy for the puppy.",
  ),
  technique(2, "Dr. Ana Ruiz, a children's dentist, recommends brushing your teeth twice a day.", "expert", "The writer quotes someone with special knowledge on the topic."),
  {
    level: 3,
    prompt: "Which is the STRONGEST evidence for this claim?",
    visual: claim("Our community should build a skate park."),
    right: "A survey of 300 local youth found that 180 would use a skate park every week.",
    wrong: ["My friends and I think a skate park would be cool.", "Skate parks look nice.", "Everyone wants a skate park.", "Some people already skateboard on sidewalks."],
    hint: "Specific numbers from a real survey are stronger than personal opinions or “everyone” claims.",
  },
  {
    level: 3,
    prompt: "Which is the STRONGEST support for this claim?",
    visual: claim("Students should have a longer lunch break."),
    right: "Lunch supervisors report that many students throw away half-eaten lunches when the bell rings.",
    wrong: ["I think lunch is the best part of the day.", "Longer lunches would be more fun.", "Everyone wants a longer lunch.", "Lunch comes after morning classes."],
    hint: "Look for evidence from a reliable source that shows a real problem.",
  },
  {
    level: 3,
    prompt: "Which is the strongest rebuttal to this counterargument?",
    visual: text("Counterargument", "A homework club would cost too much to run."),
    right: "Parent volunteers and older students could run the club at no cost.",
    wrong: ["Homework is boring anyway.", "Clubs are fun for everyone.", "Some people don't like clubs.", "Other schools have clubs too."],
    hint: "A strong rebuttal answers the exact worry. This worry is about cost.",
  },
  {
    level: 3,
    prompt: "Which is the strongest rebuttal to this counterargument?",
    visual: text("Counterargument", "A class pet would be too much work."),
    right: "A weekly job chart could share the feeding and cleaning among all the students.",
    wrong: ["Pets are cute.", "Work is good for you.", "Other classes have pets.", "Hamsters are small."],
    hint: "Answer the worry directly: how could the work be made manageable?",
  },
  {
    level: 3,
    prompt: "What is the purpose of the sentence “Some teachers argue that more outdoor time means less time for learning”?",
    visual: OUTSIDE,
    right: "It presents the other side so the writer can respond to it.",
    wrong: ["It states the writer's main claim.", "It gives data from a survey.", "It sums up the argument at the end.", "It tells a personal story."],
    hint: "Read the next sentence. It starts with “However.”",
  },
  technique(3, "Our survey found that 87% of students ate more of their lunch when recess came first.", "stats", "The writer uses a number from a survey as proof."),
  technique(3, "Who wouldn't want an extra hour of reading time each week?", "question", "It's a question that isn't meant to be answered. The answer is supposed to seem obvious."),
  {
    level: 1,
    prompt: "What does the conclusion of a persuasive piece do?",
    right: "sums up the argument and leaves a strong final thought",
    wrong: ["introduces a brand new topic", "lists the characters in the story", "gives step-by-step instructions"],
    hint: "The conclusion is the last chance to remind readers of your claim.",
  },
  {
    level: 1,
    prompt: "Which evidence best supports this claim?",
    visual: claim("Our class should have a reading corner."),
    right: "A quiet corner gives students a calm place to enjoy books and practise reading.",
    wrong: ["A corner is where two walls meet.", "Some classrooms are painted blue.", "Pillows are soft."],
    hint: "Choose the reason that explains why a reading corner would help students.",
  },
  {
    level: 1,
    prompt: "What is the writer's claim (main argument)?",
    visual: BIKE_LANE,
    right: "Our town should add a bike lane on Maple Street.",
    wrong: ["Some neighbours worry that a bike lane will take away parking spots.", "Right now, students who bike to school must ride beside fast-moving cars.", "Most homes on the street have driveways."],
    hint: "The claim is the position the whole paragraph argues for. It's often the first sentence.",
  },
  {
    level: 1,
    prompt: "Which technique is this?",
    visual: line("Everybody is wearing these boots, so you need a pair too!"),
    right: TECHNIQUES.bandwagon,
    wrong: [TECHNIQUES.expert, TECHNIQUES.stats, TECHNIQUES.question],
    hint: "The ad says everyone is doing it, so you should join in.",
  },
  {
    level: 2,
    prompt: "Which sentence presents a counterargument?",
    visual: BIKE_LANE,
    right: "Some neighbours worry that a bike lane will take away parking spots.",
    wrong: ["Our town should add a bike lane on Maple Street.", "A painted lane would give riders their own safe space.", "A bike lane would make the street safer for everyone."],
    hint: "A counterargument is what someone on the other side might say.",
  },
  {
    level: 2,
    prompt: "Which sentence is the writer's rebuttal (the answer to the other side)?",
    visual: BIKE_LANE,
    right: "However, most homes on the street have driveways, and the lane would remove only six spots.",
    wrong: ["Some neighbours worry that a bike lane will take away parking spots.", "Our town should add a bike lane on Maple Street.", "Right now, students who bike to school must ride beside fast-moving cars."],
    hint: "A rebuttal answers the worry. Look for a signal word like “However.”",
  },
  {
    level: 2,
    prompt: "Which evidence best supports this claim?",
    visual: claim("Our school should plant a vegetable garden."),
    right: "Gardening teaches students where food comes from, and the harvest can be shared with the cafeteria.",
    wrong: ["Tomatoes are red.", "Some students like to play inside.", "Shovels are made of metal."],
    hint: "Choose the reason that explains why a garden would help the school.",
  },
  {
    level: 2,
    prompt: "Who is the best audience for a speech asking the school to start a recycling program?",
    right: "the principal and the student council, who can approve it",
    wrong: ["a baby sibling", "people in another country", "a hockey team"],
    hint: "Write or speak to the people who have the power to make the change.",
  },
  technique(2, "A recent study found that schools with gardens saw 15% more students choosing vegetables at lunch.", "stats", "The writer uses a number from a study as proof."),
  technique(2, "Isn't it time we made our playground safe for every child?", "question", "It's a question that isn't meant to be answered. The answer is supposed to seem obvious."),
  {
    level: 3,
    prompt: "Which is the STRONGEST evidence for this claim?",
    visual: claim("Our town should keep the public pool open in the evenings."),
    right: "A count on three weekdays showed about 90 swimmers arrived after 6:00.",
    wrong: ["I like swimming at night.", "Pools have lanes.", "Everybody loves pools.", "Water feels cool."],
    hint: "Specific numbers from a real count are stronger than personal opinions or “everybody” claims.",
  },
  {
    level: 3,
    prompt: "What does the last sentence of this paragraph do?",
    visual: BIKE_LANE,
    right: "It sums up the writer's position.",
    wrong: ["It gives data from a survey.", "It presents the other side.", "It tells a personal story.", "It states a new claim about parking."],
    hint: "The last sentence repeats the main idea in a final, strong way.",
  },
  technique(3, "Park ranger Mei Lin says that feeding wildlife hurts the animals, so please keep your snacks to yourself.", "expert", "The writer quotes a person with special knowledge of the topic."),
  technique(3, "Think of a child walking to school in the dark every morning. Please help us light the way.", "emotion", "The writer wants you to feel sympathy so you will act."),
];

const ORDERS: string[][] = [
  [
    "Our school should start a walking club at lunch.",
    "One reason is that walking is an easy way to stay active.",
    "For example, a brisk twenty-minute walk gets your heart pumping without any special equipment.",
    "Another reason is that a club helps students make new friends.",
    "In conclusion, a walking club would keep us healthy and connected.",
  ],
  [
    "Every classroom should have a class pet.",
    "First, caring for a pet teaches responsibility.",
    "For instance, students can take turns feeding the pet and cleaning its home.",
    "Second, watching an animal can help people feel calm.",
    "For these reasons, a class pet would be a great addition to any classroom.",
  ],
  [
    "Our school should add more bike racks.",
    "To begin with, more racks mean more students can bike to school.",
    "For example, right now 30 bikes are locked to the fence because the racks are full.",
    "In addition, bikes locked to a fence can block the walkway.",
    "In conclusion, new bike racks would help students and keep our walkways clear.",
  ],
  [
    "Our class should have a quiet reading time every day.",
    "First, reading every day helps students become stronger readers.",
    "For instance, students who read for twenty minutes meet thousands of new words each year.",
    "Also, quiet time gives busy students a calm break.",
    "For these reasons, daily reading time is a smart choice for our class.",
  ],
];

function persuasive(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  if (level === 1) return shuffle(askSome(PERSUADE, 8, level));
  const order = orderOf(
    "Put this persuasive paragraph in a logical order.",
    "Start with the claim, give each reason followed by its example, and finish with the conclusion. Signal words like “First,” “For example” and “In conclusion” help.",
    pick(ORDERS),
  );
  return shuffle([...askSome(PERSUADE, 7, level), order]);
}

// ---------- Sources & Bias ----------

const FACTS = [
  "Water freezes at 0°C.",
  "A spider has eight legs.",
  "Canada has three territories.",
  "The Moon orbits Earth.",
  "Maple syrup is made from tree sap.",
  "Bees make honey from nectar.",
  "A week has seven days.",
  "Our class has 27 students.",
  "The library opens at 9:00 a.m.",
];

const OPINIONS = [
  "Winter is the best season.",
  "Math is more fun than art.",
  "That movie was too long.",
  "Cats make better pets than dogs.",
  "Pizza tastes better cold.",
  "Soccer is the most exciting sport.",
  "Reading is the best way to relax.",
  "Blue is the nicest colour.",
  "Homework is a waste of time.",
];

const SOURCES: Item[] = [
  {
    level: 1,
    prompt: "You need accurate facts about how volcanoes form. Which source is most reliable?",
    right: "a science museum website written by geologists",
    wrong: ["a comment under an online video", "an ad for a volcano board game", "a fantasy novel about a fire mountain"],
    hint: "Reliable sources are written by experts whose job is to inform, not to sell or entertain.",
  },
  {
    level: 1,
    prompt: "What is the main purpose of an advertisement?",
    right: "to persuade people to buy or do something",
    wrong: ["to tell a made-up story for fun", "to give balanced facts on both sides", "to record what happened in history"],
    hint: "Think about who pays for ads and what they want you to do.",
  },
  {
    level: 1,
    prompt: "You read a surprising claim online. What is the best next step?",
    right: "Check whether several reliable sources say the same thing.",
    wrong: ["Share it right away so your friends know.", "Believe it if the post has lots of likes.", "Assume it's true because it's in a headline."],
    hint: "Likes and headlines don't make something true. Cross-check it.",
  },
  {
    level: 2,
    prompt: "Which detail makes a website more trustworthy for a research project?",
    right: "It names its authors and their expertise and lists its sources.",
    wrong: ["It has lots of bright pictures.", "It appears first in the search results.", "It uses many exclamation marks."],
    hint: "Trustworthy sources tell you who wrote them and where their information came from.",
  },
  {
    level: 2,
    prompt: "Which headline is the most neutral (least biased)?",
    right: "Council Votes 5–4 to Build New Skate Park",
    wrong: ["Council Wastes Money on Pointless Skate Park", "Amazing Council Gives Kids the Best Gift Ever", "Noisy Skaters Get Their Way Again"],
    hint: "A neutral headline reports what happened without words that show the writer's feelings.",
  },
  {
    level: 2,
    prompt: "Which words show the writer's bias? “The ridiculous new parking rule is ruining downtown.”",
    right: "ridiculous, ruining",
    wrong: ["new, parking", "rule, downtown", "the, is"],
    hint: "Bias often shows up in loaded words: words that carry strong feelings.",
  },
  {
    level: 2,
    prompt: "A website praising a juice's health benefits is run by the company that sells the juice. What should a careful reader keep in mind?",
    right: "The company may be biased because it wants to sell more juice.",
    wrong: ["Companies always tell the whole story.", "Health websites can't be biased.", "The site must be reliable because it has lots of information."],
    hint: "Ask: who made this, and what do they gain if I believe it?",
  },
  {
    level: 2,
    prompt: "Why should you check the date on an article about new technology?",
    right: "Information about technology can go out of date quickly.",
    wrong: ["Older articles are always wrong.", "The date tells you who wrote it.", "Newer articles are always longer."],
    hint: "Technology changes fast. Is the information still current?",
  },
  {
    level: 3,
    prompt: "A news story about a debate over a new bike lane only quotes people who are against it. What is the problem?",
    right: "It is one-sided, so readers don't get the full picture.",
    wrong: ["It is too short to be useful.", "It quotes too many experts.", "News stories should never quote people.", "Bike lanes are not important news."],
    hint: "Fair reporting includes more than one point of view.",
  },
  {
    level: 3,
    prompt: "An ad shows kids laughing as they play with a toy, but it never mentions the price. Why might the ad leave the price out?",
    right: "to focus viewers on good feelings instead of the cost",
    wrong: ["because the toy is free", "because ads are not allowed to show prices", "because the price is the most exciting part", "because the kids in the ad chose the price"],
    hint: "Ads choose what to show and what to leave out so you'll want the product.",
  },
  {
    level: 3,
    prompt: "Which is a primary source about what school was like in 1955?",
    right: "a diary written by a student in 1955",
    wrong: ["a textbook chapter written last year", "an encyclopedia article about the 1950s", "a movie about the 1950s made in 2020", "a website summary of school history"],
    hint: "A primary source was created at the time by someone who was there.",
  },
  {
    level: 3,
    prompt: "Who would most likely give a biased review of a new restaurant?",
    right: "the owner's best friend",
    wrong: ["a food critic who paid for their own meal", "a group of diners chosen at random", "a reviewer who visited three times without saying who they were"],
    hint: "Bias comes from a personal connection or something to gain.",
  },
  {
    level: 3,
    prompt: "One article calls a protest “a lively crowd of families.” Another calls it “a noisy mob.” What does this show?",
    right: "Word choice can reveal a writer's point of view.",
    wrong: ["Both writers saw completely different events.", "One article must be about a different city.", "Writers must use the same words for the same event.", "Both descriptions are completely neutral."],
    hint: "Compare the connotations: “lively crowd of families” versus “noisy mob.”",
  },
  {
    level: 3,
    prompt: "Which statement is an opinion, even though it is written like a fact?",
    right: "Everyone knows that summer is the best season.",
    wrong: ["Summer begins in June in Canada.", "Summer has the longest days of the year in Canada.", "Many students have time off school in July."],
    hint: "“Everyone knows” doesn't make it a fact. Can “best season” be proven?",
  },
  {
    level: 3,
    prompt: "Which statement could be checked and proven true or false?",
    right: "The tallest tree in the park is about 30 metres tall.",
    wrong: ["The park is the most beautiful place in town.", "Trees make the best kind of shade.", "Everyone should visit the park more often."],
    hint: "Facts can be measured, counted or looked up.",
  },
];

const FACT_HINT = "A fact can be proven true, for example by measuring, counting or checking a reliable source.";
const OPINION_HINT = "An opinion tells what someone thinks or feels and can't be proven. Watch for words like best, better, too or should.";

function sourcesBias(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const facts = shuffle(FACTS);
  const opinions = shuffle(OPINIONS);
  const perBin = level === 3 ? 4 : 3;
  const sort = sortOf(
    "Sort each statement: fact or opinion?",
    "Ask: could I prove this by measuring, counting or checking a reliable source? If yes, it's a fact.",
    [
      { id: "fact", label: "Fact", emoji: "🔎" },
      { id: "opinion", label: "Opinion", emoji: "💭" },
    ],
    [
      ...facts.slice(0, perBin).map((label) => ({ label, bin: "fact" })),
      ...opinions.slice(0, perBin).map((label) => ({ label, bin: "opinion" })),
    ],
  );
  const restFacts = facts.slice(perBin);
  const restOpinions = opinions.slice(perBin);
  const nPick = level === 3 ? 1 : 2;
  const picks = shuffle(["opinion", "fact"]).slice(0, nPick).map((kind) =>
    kind === "opinion"
      ? choose("Which statement is an opinion?", pick(restOpinions), restFacts, OPINION_HINT, level)
      : choose("Which statement is a fact?", pick(restFacts), restOpinions, FACT_HINT, level),
  );
  return [sort, ...shuffle([...picks, ...askSome(SOURCES, 7 - nPick, level)])];
}

// ---------- Agreement ----------

const SV_PROMPT = "Which verb correctly completes the sentence?";
const PRONOUN_PROMPT = "Which pronoun correctly completes the sentence?";

const blank = (level: Level, prompt: string, sentence: string, right: string, wrong: string[], hint: string): Item => ({
  level,
  prompt,
  visual: line(sentence),
  right,
  wrong,
  hint,
});

const AGREEMENT: Item[] = [
  blank(1, SV_PROMPT, "The dogs in the yard _____ barking at a squirrel.", "are", ["is", "was", "be"], "The subject is “dogs,” which is plural. Plural subjects take plural verbs: the dogs are."),
  blank(1, SV_PROMPT, "My sister _____ the piano every day.", "practises", ["practise", "practising", "are practising"], "“My sister” is one person, so the verb ends in -s: she practises."),
  blank(1, SV_PROMPT, "Maya and Jay _____ in the school band.", "play", ["plays", "playing", "is playing"], "Two subjects joined by “and” make a plural subject: Maya and Jay play."),
  blank(1, SV_PROMPT, "The bus _____ at 8:15 every morning.", "arrives", ["arrive", "arriving", "are arriving"], "“The bus” is singular, so the verb ends in -s: the bus arrives."),
  blank(1, SV_PROMPT, "They _____ ready for the class trip.", "are", ["is", "was", "am"], "“They” is plural, so use the plural verb: they are."),
  blank(1, SV_PROMPT, "The birds _____ south every fall.", "fly", ["flies", "flying", "is flying"], "“Birds” is plural, so the verb has no -s: the birds fly."),
  blank(1, PRONOUN_PROMPT, "The puppy chased _____ own tail.", "its", ["it's", "their", "they're"], "One puppy owns the tail. “Its” (no apostrophe) shows ownership; “it's” means “it is.”"),
  blank(1, PRONOUN_PROMPT, "The trees lost all of _____ leaves in October.", "their", ["its", "there", "they're"], "“Trees” is plural, so the possessive pronoun is “their.”"),
  blank(1, PRONOUN_PROMPT, "The books were heavy, so Zoe carried _____ one at a time.", "them", ["it", "they", "its"], "The pronoun replaces “the books,” which is plural, and it receives the action: them."),
  blank(2, SV_PROMPT, "The box of crayons _____ on the top shelf.", "is", ["are", "were", "be"], "Ignore the phrase “of crayons.” The subject is “box,” which is singular."),
  blank(2, SV_PROMPT, "The leaves on the maple tree _____ turning red.", "are", ["is", "was", "has"], "Ignore “on the maple tree.” The subject is “leaves,” which is plural."),
  blank(2, SV_PROMPT, "One of my friends _____ a pet snake.", "has", ["have", "having", "are having"], "The subject is “one,” not “friends.” One has."),
  blank(2, SV_PROMPT, "Everyone in the stands _____ cheering.", "was", ["were", "are", "be"], "“Everyone” is singular, even though it refers to many people."),
  blank(2, SV_PROMPT, "Each of the players _____ a water bottle.", "has", ["have", "having", "are having"], "“Each” is singular. Ignore “of the players.”"),
  blank(2, SV_PROMPT, "Both of the puppies _____ asleep on the rug.", "are", ["is", "was", "has"], "“Both” always means two, so it's plural."),
  blank(2, SV_PROMPT, "The students in Mr. Diaz's class _____ a spelling test today.", "have", ["has", "having", "is having"], "Ignore “in Mr. Diaz's class.” The subject is “students,” which is plural."),
  blank(2, PRONOUN_PROMPT, "When the bike got a flat tire, Leo fixed _____ before school.", "it", ["them", "they", "its"], "The pronoun stands for “the bike,” which is one thing: it."),
  blank(2, PRONOUN_PROMPT, "Ravi and Amir forgot _____ lunches at home.", "their", ["there", "they're", "its"], "“Ravi and Amir” is plural, and the lunches belong to them: their."),
  blank(2, PRONOUN_PROMPT, "The geese flew south because _____ needed warmer weather.", "they", ["it", "them", "its"], "“Geese” is plural and is the subject of “needed”: they."),
  {
    level: 2,
    prompt: "Which sentence has correct subject–verb agreement?",
    right: "The girls in my class play soccer at recess.",
    wrong: ["The girls in my class plays soccer at recess.", "The girls in my class is playing soccer at recess.", "The girls in my class was playing soccer at recess."],
    hint: "Find the subject (“girls”). It's plural, so the verb must be plural too.",
  },
  blank(3, SV_PROMPT, "Either the twins or Noah _____ going to read first.", "is", ["are", "were", "be"], "With “either…or,” the verb agrees with the closer subject: Noah is."),
  blank(3, SV_PROMPT, "Neither Ana nor her cousins _____ home yet.", "are", ["is", "was", "has"], "With “neither…nor,” the verb agrees with the closer subject: cousins are."),
  blank(3, SV_PROMPT, "Mathematics _____ my favourite subject.", "is", ["are", "were", "have been"], "Some subjects end in -s but are singular, like mathematics."),
  blank(3, SV_PROMPT, "The news about the field trip _____ better than we expected.", "was", ["were", "are", "have been"], "“News” looks plural but is singular. Ignore “about the field trip.”"),
  blank(3, SV_PROMPT, "There _____ three apples left in the bowl.", "are", ["is", "was", "has"], "When a sentence starts with “There,” the subject comes after the verb. “Apples” is plural."),
  blank(3, SV_PROMPT, "Here _____ the library books you asked for.", "are", ["is", "was", "has"], "The subject comes after the verb: “books,” which is plural."),
  {
    level: 3,
    prompt: "Which sentence has correct subject–verb agreement?",
    right: "The list of chores is on the fridge.",
    wrong: ["The list of chores are on the fridge.", "The lists of chores is on the fridge.", "The list of chores were on the fridge."],
    hint: "The subject is “list” (or “lists”), not “chores.” Match the verb to it.",
  },
  {
    level: 3,
    prompt: "Which sentence has a clear pronoun reference?",
    right: "Maya was nervous when she talked to Lena.",
    wrong: ["When Maya talked to Lena, she was nervous.", "Maya told Lena that she had won the prize.", "Lena and Maya hugged after she won."],
    hint: "A pronoun should point to only one possible person. In the clear sentence, “she” can only mean Maya.",
  },
  {
    level: 3,
    prompt: "Which sentence has a clear pronoun reference?",
    right: "When the glass hit the plate, the glass broke.",
    wrong: ["When the glass hit the plate, it broke.", "The glass and the plate fell, and it broke.", "It broke when the glass hit the plate."],
    hint: "If “it” could mean either the glass or the plate, the reader can't tell what broke.",
  },
  {
    level: 3,
    prompt: "Which sentence uses pronouns correctly?",
    right: "The team members packed their gear after the game.",
    wrong: ["The team members packed its gear after the game.", "The team members packed there gear after the game.", "The team members packed they're gear after the game."],
    hint: "“Members” is plural, so use the plural possessive “their.” (“There” is a place; “they're” means “they are.”)",
  },
];

function agreement(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle(askSome(AGREEMENT, 8, level));
}

// ---------- Sentence Repair ----------

type Boundary = "complete" | "fragment" | "runon" | "splice";

const BOUNDARY_LABEL: Record<Boundary, string> = {
  complete: "Complete sentence",
  fragment: "Fragment",
  runon: "Run-on (fused) sentence",
  splice: "Comma splice",
};

const BOUNDARY_HINT: Record<Boundary, string> = {
  complete: "It has a subject and a verb and expresses one complete thought.",
  fragment: "It's missing a subject, a verb or a complete thought, so it can't stand alone. That's a fragment.",
  runon: "Two complete sentences are jammed together with no punctuation between them. That's a run-on (fused) sentence.",
  splice: "Two complete sentences are joined with only a comma. That's a comma splice.",
};

const BOUNDARIES: { level: Level; kind: Boundary; text: string; hint?: string }[] = [
  { level: 1, kind: "complete", text: "The hikers reached the top before noon." },
  { level: 1, kind: "complete", text: "My little brother loves dinosaurs." },
  { level: 2, kind: "complete", text: "Because it was raining, we played board games inside." },
  { level: 2, kind: "complete", text: "Although Kenji was tired, he finished the race." },
  { level: 3, kind: "complete", text: "Close the window.", hint: "Commands have an understood subject (you), so “Close the window.” is a complete sentence." },
  { level: 3, kind: "complete", text: "The music teacher, who loves jazz, plays the saxophone." },
  { level: 1, kind: "fragment", text: "Running down the hallway with a backpack." },
  { level: 1, kind: "fragment", text: "Because the bus was late." },
  { level: 1, kind: "fragment", text: "After the game on Saturday." },
  { level: 2, kind: "fragment", text: "The tall girl with the green scarf." },
  { level: 2, kind: "fragment", text: "Whenever it snows in the mountains." },
  { level: 3, kind: "fragment", text: "Which made everyone laugh." },
  { level: 3, kind: "fragment", text: "For example, the bright red maple leaves." },
  { level: 1, kind: "runon", text: "The bell rang everyone rushed outside." },
  { level: 1, kind: "runon", text: "I love pancakes my brother prefers waffles." },
  { level: 2, kind: "runon", text: "The power went out we lit some candles." },
  { level: 2, kind: "runon", text: "Ana finished her book she started another one right away." },
  { level: 3, kind: "runon", text: "The score was tied the crowd stood up the clock ticked down." },
  { level: 2, kind: "splice", text: "It was cold outside, I wore my warmest coat." },
  { level: 2, kind: "splice", text: "Leo forgot his lunch, his friend shared a sandwich." },
  { level: 3, kind: "splice", text: "The movie was long, however, it was exciting." },
  { level: 3, kind: "splice", text: "We missed the bus, we had to walk to school." },
];

/** Broken sentences, with several correct fixes and several incorrect ones. */
const FIXES: { level: Level; kind: Boundary; broken: string; right: string[]; wrong: string[] }[] = [
  {
    level: 1,
    kind: "runon",
    broken: "The bell rang everyone rushed outside.",
    right: ["The bell rang, and everyone rushed outside.", "The bell rang. Everyone rushed outside.", "When the bell rang, everyone rushed outside."],
    wrong: ["The bell rang, everyone rushed outside.", "The bell, rang everyone rushed outside.", "When the bell rang."],
  },
  {
    level: 1,
    kind: "fragment",
    broken: "Because the bus was late.",
    right: ["Because the bus was late, we missed the assembly.", "We missed the assembly because the bus was late."],
    wrong: ["Because, the bus was late.", "Because the bus was late and we missed the assembly.", "The bus because it was late."],
  },
  {
    level: 1,
    kind: "fragment",
    broken: "Running down the hallway with a backpack.",
    right: ["Kenji was running down the hallway with a backpack.", "Running down the hallway with a backpack, Kenji almost tripped."],
    wrong: ["Running down the hallway, with a backpack.", "Running down the hallway with a backpack and a lunch bag.", "Running, down the hallway with a backpack."],
  },
  {
    level: 2,
    kind: "splice",
    broken: "It was cold outside, I wore my warmest coat.",
    right: ["It was cold outside, so I wore my warmest coat.", "It was cold outside. I wore my warmest coat.", "It was cold outside; I wore my warmest coat.", "Because it was cold outside, I wore my warmest coat."],
    wrong: ["It was cold outside I wore my warmest coat.", "It was cold outside, and, I wore my warmest coat.", "Because it was cold outside."],
  },
  {
    level: 2,
    kind: "runon",
    broken: "Ana finished her book she started another one right away.",
    right: ["Ana finished her book, and she started another one right away.", "Ana finished her book. She started another one right away.", "After Ana finished her book, she started another one right away."],
    wrong: ["Ana finished her book, she started another one right away.", "Ana finished, her book she started another one right away.", "After Ana finished her book."],
  },
  {
    level: 2,
    kind: "splice",
    broken: "Leo forgot his lunch, his friend shared a sandwich.",
    right: ["Leo forgot his lunch, so his friend shared a sandwich.", "Leo forgot his lunch. His friend shared a sandwich.", "Leo forgot his lunch; his friend shared a sandwich."],
    wrong: ["Leo forgot his lunch his friend shared a sandwich.", "Leo forgot, his lunch, his friend shared a sandwich.", "Because Leo forgot his lunch."],
  },
  {
    level: 2,
    kind: "fragment",
    broken: "The tall girl with the green scarf.",
    right: ["The tall girl with the green scarf is my cousin.", "I waved to the tall girl with the green scarf."],
    wrong: ["The tall girl, with the green scarf.", "The tall girl with the green scarf and the red hat.", "With the green scarf, the tall girl."],
  },
  {
    level: 3,
    kind: "splice",
    broken: "The movie was long, however, it was exciting.",
    right: ["The movie was long; however, it was exciting.", "The movie was long. However, it was exciting.", "The movie was long, but it was exciting."],
    wrong: ["The movie was long however it was exciting.", "The movie was long, however it was exciting.", "However, the movie was long it was exciting."],
  },
  {
    level: 3,
    kind: "fragment",
    broken: "Which made everyone laugh.",
    right: ["The puppy sneezed, which made everyone laugh.", "The puppy's loud sneeze made everyone laugh."],
    wrong: ["Which, made everyone laugh.", "Which made everyone laugh and smile.", "The puppy sneezed. Which made everyone laugh."],
  },
  {
    level: 3,
    kind: "runon",
    broken: "We missed the bus we had to walk to school.",
    right: ["We missed the bus, so we had to walk to school.", "We missed the bus. We had to walk to school.", "Because we missed the bus, we had to walk to school."],
    wrong: ["We missed the bus, we had to walk to school.", "We missed, the bus we had to walk to school.", "Because we missed the bus."],
  },
];

const FIX_HINT: Record<Boundary, string> = {
  complete: "",
  fragment: "Add the missing part so the sentence has a subject, a verb and a complete thought.",
  runon: "Separate the two sentences with a period, or join them with a comma plus a joining word (and, but, so), or make one part dependent (when, because…).",
  splice: "A comma alone can't join two sentences. Use a period, a semicolon, a comma plus a joining word (and, but, so), or make one part dependent.",
};

const FIX_NAME: Record<Boundary, string> = {
  complete: "sentence",
  fragment: "fragment",
  runon: "run-on sentence",
  splice: "comma splice",
};

function sentenceRepair(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const binKinds: Boundary[] = level === 1 ? ["complete", "fragment"] : ["complete", "fragment", "runon"];
  const perBin = level === 1 ? 3 : 2;
  const sortItems = binKinds.flatMap((kind) =>
    sample(BOUNDARIES.filter((b) => b.kind === kind && b.level <= Math.max(level, 2)), perBin),
  );
  const sort = sortOf(
    level === 1 ? "Sort each one: complete sentence or fragment?" : "Sort each one: complete sentence, fragment or run-on?",
    "A complete sentence has a subject, a verb and a complete thought. A run-on jams two sentences together with no punctuation.",
    [
      { id: "complete", label: "Complete", emoji: "✅" },
      { id: "fragment", label: "Fragment", emoji: "🧩" },
      { id: "runon", label: "Run-on", emoji: "🚂" },
    ].filter((b) => binKinds.includes(b.id as Boundary)),
    sortItems.map((b) => ({ label: b.text, bin: b.kind })),
  );

  const pool = BOUNDARIES.filter((b) => !sortItems.includes(b) && (level > 1 || b.kind !== "splice"));
  const classify = draw(pool, 4, level).map((b) => {
    const kinds: Boundary[] = level === 1 && b.kind !== "splice" ? ["complete", "fragment", "runon"] : ["complete", "fragment", "runon", "splice"];
    return textChoice(
      "Is this a complete sentence, or does it have a problem?",
      BOUNDARY_LABEL[b.kind],
      kinds.filter((k) => k !== b.kind).map((k) => BOUNDARY_LABEL[k]),
      b.hint ?? BOUNDARY_HINT[b.kind],
      line(b.text),
    );
  });

  const fixes = draw(FIXES, 3, level).map((f) =>
    choose(
      `Which is a correct way to fix this ${FIX_NAME[f.kind]}?`,
      pick(f.right),
      f.wrong,
      FIX_HINT[f.kind],
      level,
      line(f.broken),
    ),
  );

  return [sort, ...shuffle([...classify, ...fixes])];
}

// ---------- Commas & Clauses ----------

type SentenceType = "simple" | "compound" | "complex" | "compoundComplex";

const TYPE_LABEL: Record<SentenceType, string> = {
  simple: "Simple",
  compound: "Compound",
  complex: "Complex",
  compoundComplex: "Compound-complex",
};

const TYPE_HINT: Record<SentenceType, string> = {
  simple: "It has just one independent clause, even if it has two subjects or two verbs.",
  compound: "It joins two independent clauses (with a comma and a conjunction, or a semicolon) and has no dependent clause.",
  complex: "It has one independent clause plus a dependent clause that starts with a word like when, because, if, who or which.",
  compoundComplex: "It has two independent clauses AND at least one dependent clause.",
};

const SENTENCE_TYPES: { level: Level; type: SentenceType; text: string }[] = [
  { level: 1, type: "simple", text: "The cat slept on the sunny windowsill." },
  { level: 2, type: "simple", text: "After lunch, the class walked to the library." },
  { level: 3, type: "simple", text: "Zoe and Ravi built a snow fort and decorated it with pinecones." },
  { level: 1, type: "compound", text: "I wanted to go swimming, but the pool was closed." },
  { level: 1, type: "compound", text: "We can walk to the park, or we can ride our bikes." },
  { level: 2, type: "compound", text: "Kenji set the table, and his sister made the salad." },
  { level: 3, type: "compound", text: "The trail was steep; the view at the top was worth it." },
  { level: 1, type: "complex", text: "After we ate dinner, we went for a walk." },
  { level: 2, type: "complex", text: "Maya laughed when the puppy sneezed." },
  { level: 2, type: "complex", text: "If it snows tomorrow, we will build a snowman." },
  { level: 3, type: "complex", text: "The student who found the wallet returned it to the office." },
  { level: 3, type: "compoundComplex", text: "When the bell rang, Sam grabbed his coat, and Lena packed her bag." },
  { level: 3, type: "compoundComplex", text: "Ana wanted to stay because the game was close, but her dad said it was time to go." },
];

const CLAUSES: Item[] = [
  {
    level: 1,
    prompt: "Which part is the dependent (subordinate) clause?",
    visual: line("When the lights went out, we found a flashlight."),
    right: "When the lights went out",
    wrong: ["we found a flashlight", "the lights", "found a flashlight"],
    hint: "A dependent clause has a subject and verb but can't stand alone. It often starts with a word like when, because or if.",
  },
  {
    level: 1,
    prompt: "Which part is the dependent (subordinate) clause?",
    visual: line("Kenji smiled because he had finally solved the puzzle."),
    right: "because he had finally solved the puzzle",
    wrong: ["Kenji smiled", "the puzzle", "Kenji smiled because"],
    hint: "Look for the part that starts with “because.” Could it stand alone as a sentence?",
  },
  {
    level: 2,
    prompt: "Which part is the dependent (subordinate) clause?",
    visual: line("If it snows tomorrow, the field trip will be postponed."),
    right: "If it snows tomorrow",
    wrong: ["the field trip will be postponed", "tomorrow", "the field trip"],
    hint: "Which part starts with a subordinating word and leaves you waiting for more?",
  },
  {
    level: 2,
    prompt: "Which part is the dependent (subordinate) clause?",
    visual: line("We stayed inside until the storm passed."),
    right: "until the storm passed",
    wrong: ["We stayed inside", "the storm", "stayed inside until"],
    hint: "Dependent clauses can come at the end too. Look for “until.”",
  },
  {
    level: 2,
    prompt: "Which part is the dependent (subordinate) clause?",
    visual: line("Although the water was cold, Priya jumped right in."),
    right: "Although the water was cold",
    wrong: ["Priya jumped right in", "the water", "jumped right in"],
    hint: "“Although…” has a subject and verb, but it can't stand alone.",
  },
  {
    level: 3,
    prompt: "Which part is the dependent (subordinate) clause?",
    visual: line("The book that Ana recommended was amazing."),
    right: "that Ana recommended",
    wrong: ["The book", "was amazing", "The book was amazing"],
    hint: "Some dependent clauses sit in the middle and describe a noun. Which words tell you which book?",
  },
  {
    level: 3,
    prompt: "Which part is the dependent (subordinate) clause?",
    visual: line("Leo, who loves astronomy, set up the telescope."),
    right: "who loves astronomy",
    wrong: ["Leo set up the telescope", "set up the telescope", "the telescope"],
    hint: "A clause starting with “who” can describe a person. Which part describes Leo?",
  },
  {
    level: 1,
    prompt: "Which word is the subordinating conjunction?",
    visual: line("Leo stayed up late because the meteor shower was tonight."),
    right: "because",
    wrong: ["stayed", "shower", "late", "tonight"],
    hint: "A subordinating conjunction starts a dependent clause: because, when, if, since, until, although…",
  },
  {
    level: 2,
    prompt: "Which word is the subordinating conjunction?",
    visual: line("Since the gym was busy, we practised outside."),
    right: "Since",
    wrong: ["gym", "busy", "practised", "outside"],
    hint: "Which word makes “the gym was busy” unable to stand alone?",
  },
  {
    level: 2,
    prompt: "Which word is the subordinating conjunction?",
    visual: line("Although Noah was nervous, he gave a great speech."),
    right: "Although",
    wrong: ["nervous", "gave", "great", "speech"],
    hint: "Which word starts the dependent clause?",
  },
];

const COMMAS: Item[] = [
  {
    level: 1,
    prompt: "Which sentence uses commas correctly in a list?",
    right: "We packed sandwiches, apples, and juice.",
    wrong: ["We packed, sandwiches apples and juice.", "We packed sandwiches apples, and, juice.", "We packed sandwiches, apples, and, juice."],
    hint: "Put commas between the items in a list, not after the verb or after “and.” (The comma before “and” is optional.)",
  },
  {
    level: 1,
    prompt: "Which sentence uses a comma correctly?",
    right: "Yes, I would like to join the team.",
    wrong: ["Yes I, would like to join the team.", "Yes I would like, to join the team.", "Yes I would like to join, the team."],
    hint: "Put a comma after an introductory word like yes, no or well.",
  },
  {
    level: 1,
    prompt: "Which sentence uses a comma correctly?",
    right: "Kenji, please pass the markers.",
    wrong: ["Kenji please, pass the markers.", "Kenji please pass, the markers.", "Kenji please pass the, markers."],
    hint: "When you speak directly to someone by name, set the name off with a comma.",
  },
  {
    level: 2,
    prompt: "Which sentence uses a comma correctly?",
    right: "When the movie ended, everyone clapped.",
    wrong: ["When the movie ended everyone, clapped.", "When, the movie ended everyone clapped.", "When the movie, ended everyone clapped."],
    hint: "Put a comma after an introductory dependent clause, right before the main clause begins.",
  },
  {
    level: 2,
    prompt: "Which sentence uses a comma correctly?",
    right: "I studied for the test, and I felt ready.",
    wrong: ["I studied, for the test and I felt ready.", "I studied for the test and, I felt ready.", "I, studied for the test and I felt ready."],
    hint: "In a compound sentence, the comma goes before the joining word (and, but, so).",
  },
  {
    level: 2,
    prompt: "Why does this sentence need a comma? “Although it was late, we kept reading.”",
    right: "It sets off an introductory dependent clause.",
    wrong: ["It separates items in a list.", "It joins two complete sentences with no conjunction.", "It sets off a speaker's exact words."],
    hint: "“Although it was late” can't stand alone, and it comes first.",
  },
  {
    level: 2,
    prompt: "Why is there a comma in this sentence? “Ravi made dinner, and Ana washed the dishes.”",
    right: "It comes before “and” to join two independent clauses.",
    wrong: ["It separates items in a list.", "It sets off an introductory word.", "It separates a dependent clause at the end."],
    hint: "Both “Ravi made dinner” and “Ana washed the dishes” could stand alone.",
  },
  {
    level: 3,
    prompt: "Which sentence uses commas correctly?",
    right: "My neighbour, a retired pilot, tells great stories.",
    wrong: ["My neighbour a retired pilot, tells great stories.", "My neighbour, a retired pilot tells great stories.", "My, neighbour a retired pilot tells great stories."],
    hint: "An appositive renames a noun. Put a comma on both sides of it.",
  },
  {
    level: 3,
    prompt: "Which sentence uses commas correctly?",
    right: "Our school library, which opened last year, has a reading nook.",
    wrong: ["Our school library which opened last year, has a reading nook.", "Our school library, which opened last year has a reading nook.", "Our school, library which opened last year has a reading nook."],
    hint: "Extra information in the middle of a sentence needs a comma before it and after it.",
  },
  {
    level: 3,
    prompt: "What do the commas set off in this sentence? “My cousin, a talented painter, sold her first piece.”",
    right: "an appositive that renames “my cousin”",
    wrong: ["a list of three items", "two independent clauses", "an introductory word"],
    hint: "“A talented painter” is another name for “my cousin.”",
  },
  {
    level: 3,
    prompt: "Combine these with “because”: “The road was icy. The buses were late.”",
    right: "The buses were late because the road was icy.",
    wrong: ["The road was icy because the buses were late.", "Because the road was icy.", "The buses were late, because, the road was icy."],
    hint: "Which event caused the other? “Because” goes in front of the cause.",
  },
  {
    level: 3,
    prompt: "Combine these with “although”: “Kenji was tired. He finished the race.”",
    right: "Although Kenji was tired, he finished the race.",
    wrong: ["Although Kenji was tired.", "Although Kenji was tired he, finished the race.", "Kenji was tired, although, he finished the race."],
    hint: "Start with the “although” clause, add a comma, then the main clause.",
  },
];

function commasClauses(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const types = draw(SENTENCE_TYPES.filter((s) => level === 3 || s.type !== "compoundComplex"), 2, level).map((s) => {
    const options: SentenceType[] =
      level === 3 ? ["simple", "compound", "complex", "compoundComplex"] : ["simple", "compound", "complex"];
    return textChoice(
      "What type of sentence is this?",
      TYPE_LABEL[s.type],
      options.filter((t) => t !== s.type).map((t) => TYPE_LABEL[t]),
      TYPE_HINT[s.type],
      line(s.text),
    );
  });
  return shuffle([...types, ...askSome(CLAUSES, 3, level), ...askSome(COMMAS, 3, level)]);
}

// ---------- Roots & Analogies ----------

interface Root {
  level: Level;
  meaning: string;
  /** Roots with the same idea (like hydr and aqua) share a group, so they never compete as answers. */
  group: string;
  from: "Greek" | "Latin";
}

const ROOTS: Record<string, Root> = {
  bio: { level: 1, meaning: "life", group: "life", from: "Greek" },
  geo: { level: 1, meaning: "earth", group: "earth", from: "Greek" },
  terr: { level: 2, meaning: "land", group: "earth", from: "Latin" },
  graph: { level: 1, meaning: "write", group: "write", from: "Greek" },
  scrib: { level: 2, meaning: "write", group: "write", from: "Latin" },
  tele: { level: 1, meaning: "far", group: "far", from: "Greek" },
  photo: { level: 1, meaning: "light", group: "light", from: "Greek" },
  micro: { level: 1, meaning: "small", group: "small", from: "Greek" },
  scope: { level: 2, meaning: "look at", group: "see", from: "Greek" },
  spect: { level: 2, meaning: "look", group: "see", from: "Latin" },
  vis: { level: 1, meaning: "see", group: "see", from: "Latin" },
  phon: { level: 1, meaning: "sound", group: "sound", from: "Greek" },
  aud: { level: 1, meaning: "hear", group: "sound", from: "Latin" },
  port: { level: 2, meaning: "carry", group: "carry", from: "Latin" },
  rupt: { level: 2, meaning: "break", group: "break", from: "Latin" },
  struct: { level: 2, meaning: "build", group: "build", from: "Latin" },
  dict: { level: 2, meaning: "say", group: "say", from: "Latin" },
  therm: { level: 2, meaning: "heat", group: "heat", from: "Greek" },
  hydr: { level: 2, meaning: "water", group: "water", from: "Greek" },
  aqua: { level: 1, meaning: "water", group: "water", from: "Latin" },
  chron: { level: 3, meaning: "time", group: "time", from: "Greek" },
  meter: { level: 2, meaning: "measure", group: "measure", from: "Greek" },
  auto: { level: 2, meaning: "self", group: "self", from: "Greek" },
  tract: { level: 3, meaning: "pull", group: "pull", from: "Latin" },
  ject: { level: 3, meaning: "throw", group: "throw", from: "Latin" },
  ped: { level: 3, meaning: "foot", group: "foot", from: "Latin" },
  cent: { level: 2, meaning: "hundred", group: "hundred", from: "Latin" },
  astro: { level: 1, meaning: "star", group: "star", from: "Greek" },
  logy: { level: 2, meaning: "study of", group: "study", from: "Greek" },
  mono: { level: 2, meaning: "one", group: "one", from: "Greek" },
  cred: { level: 3, meaning: "believe", group: "believe", from: "Latin" },
  bene: { level: 3, meaning: "good", group: "good", from: "Latin" },
  cycl: { level: 3, meaning: "circle or wheel", group: "circle", from: "Greek" },
  vac: { level: 3, meaning: "empty", group: "empty", from: "Latin" },
  path: { level: 3, meaning: "feeling", group: "feeling", from: "Greek" },
};

/** Words and every listed root they contain. */
const ROOT_WORDS: Record<string, string[]> = {
  biology: ["bio", "logy"],
  biography: ["bio", "graph"],
  geography: ["geo", "graph"],
  geology: ["geo", "logy"],
  territory: ["terr"],
  terrain: ["terr"],
  terrarium: ["terr"],
  autograph: ["auto", "graph"],
  paragraph: ["graph"],
  graphic: ["graph"],
  scribble: ["scrib"],
  describe: ["scrib"],
  inscribe: ["scrib"],
  telescope: ["tele", "scope"],
  telephone: ["tele", "phon"],
  television: ["tele", "vis"],
  photograph: ["photo", "graph"],
  photosynthesis: ["photo"],
  microscope: ["micro", "scope"],
  microphone: ["micro", "phon"],
  microwave: ["micro"],
  periscope: ["scope"],
  inspect: ["spect"],
  spectator: ["spect"],
  spectacles: ["spect"],
  visible: ["vis"],
  vision: ["vis"],
  symphony: ["phon"],
  phonics: ["phon"],
  saxophone: ["phon"],
  audience: ["aud"],
  audio: ["aud"],
  audible: ["aud"],
  auditorium: ["aud"],
  transport: ["port"],
  portable: ["port"],
  export: ["port"],
  erupt: ["rupt"],
  interrupt: ["rupt"],
  rupture: ["rupt"],
  construct: ["struct"],
  structure: ["struct"],
  instruct: ["struct"],
  dictionary: ["dict"],
  predict: ["dict"],
  dictate: ["dict"],
  contradict: ["dict"],
  thermometer: ["therm", "meter"],
  thermos: ["therm"],
  thermal: ["therm"],
  hydrant: ["hydr"],
  dehydrated: ["hydr"],
  hydroelectric: ["hydr"],
  aquarium: ["aqua"],
  aquatic: ["aqua"],
  chronological: ["chron", "logy"],
  synchronize: ["chron"],
  chronicle: ["chron"],
  speedometer: ["meter"],
  perimeter: ["meter"],
  barometer: ["meter"],
  automatic: ["auto"],
  autobiography: ["auto", "bio", "graph"],
  tractor: ["tract"],
  attract: ["tract"],
  subtract: ["tract"],
  project: ["ject"],
  eject: ["ject"],
  reject: ["ject"],
  pedal: ["ped"],
  pedestrian: ["ped"],
  centipede: ["cent", "ped"],
  century: ["cent"],
  percent: ["cent"],
  astronaut: ["astro"],
  astronomy: ["astro"],
  monorail: ["mono"],
  monotone: ["mono"],
  credible: ["cred"],
  incredible: ["cred"],
  credit: ["cred"],
  benefit: ["bene"],
  beneficial: ["bene"],
  bicycle: ["cycl"],
  cyclone: ["cycl"],
  recycle: ["cycl"],
  vacant: ["vac"],
  vacuum: ["vac"],
  evacuate: ["vac"],
  sympathy: ["path"],
  empathy: ["path"],
};

/** Words that never make fair distractors for these meanings (e.g. “tone” sounds like “sound”). */
const RELATED: Record<string, string[]> = {
  monotone: ["sound"],
  perimeter: ["circle"],
  periscope: ["circle"],
};

const groupsOf = (w: string) => [...ROOT_WORDS[w].map((r) => ROOTS[r].group), ...(RELATED[w] ?? [])];
const wordsWith = (root: string) => Object.keys(ROOT_WORDS).filter((w) => ROOT_WORDS[w].includes(root));
const rootList = (level: Level) => Object.keys(ROOTS).filter((r) => ROOTS[r].level <= level);

const WORD_MEANINGS: Item[] = [
  {
    level: 1,
    prompt: "Use the roots: what does “microscope” mean?",
    right: "a tool for looking at very small things",
    wrong: ["a tool for hearing faraway sounds", "a tool for measuring heat", "a small kind of telephone"],
    hint: "micro = small, scope = look at.",
  },
  {
    level: 1,
    prompt: "Use the roots: what does “autograph” mean?",
    right: "a person's own signature",
    wrong: ["a car's mileage chart", "a photograph of a car", "a map of a city"],
    hint: "auto = self, graph = write. Something you write yourself: your own name.",
  },
  {
    level: 2,
    prompt: "Use the roots: what does “audible” most likely mean?",
    right: "loud enough to be heard",
    wrong: ["easy to see", "able to be carried", "hard to believe"],
    hint: "aud = hear, and -ible means “able to be.”",
  },
  {
    level: 2,
    prompt: "Use the roots: what does “portable” most likely mean?",
    right: "easy to carry",
    wrong: ["easy to break", "able to be heard", "built to stay in one place"],
    hint: "port = carry, and -able means “able to be.”",
  },
  {
    level: 2,
    prompt: "Use the roots: what is a “spectator”?",
    right: "a person who watches an event",
    wrong: ["a person who builds stadiums", "a person who speaks at an event", "a person who carries equipment"],
    hint: "spect = look, and -or means “a person who.”",
  },
  {
    level: 2,
    prompt: "Use the roots: what does “chronological” order mean?",
    right: "arranged in time order",
    wrong: ["arranged by size", "arranged in alphabetical order", "arranged by colour"],
    hint: "chron = time.",
  },
  {
    level: 2,
    prompt: "Use the roots: what does “thermometer” mean?",
    right: "a tool that measures heat (temperature)",
    wrong: ["a tool that measures distance", "a tool that measures sound", "a tool that measures water"],
    hint: "therm = heat, meter = measure.",
  },
  {
    level: 3,
    prompt: "Use the roots: what does “hydrology” most likely mean?",
    right: "the study of water",
    wrong: ["the study of heat", "the study of rocks", "the study of stars", "the study of living things"],
    hint: "hydr = water, logy = study of.",
  },
  {
    level: 3,
    prompt: "Use the roots: what does a “pedometer” measure?",
    right: "how many steps you take",
    wrong: ["how hot it is", "how loud a sound is", "how long a song is", "how much water you drink"],
    hint: "ped = foot, meter = measure.",
  },
  {
    level: 3,
    prompt: "Use the roots: what is “geothermal” energy?",
    right: "heat from inside the earth",
    wrong: ["power from moving water", "energy from sunlight", "power from the wind", "energy from burning wood"],
    hint: "geo = earth, therm = heat.",
  },
  {
    level: 3,
    prompt: "Use the roots: what does “incredible” mean?",
    right: "hard to believe",
    wrong: ["easy to carry", "not able to be heard", "very small", "full of light"],
    hint: "in- = not, cred = believe, -ible = able to be.",
  },
  {
    level: 3,
    prompt: "Use the roots: what is a “monorail”?",
    right: "a train that runs on a single rail",
    wrong: ["a train with a hundred cars", "a train that runs underground", "a train that drives itself", "a train with many tracks"],
    hint: "mono = one.",
  },
  {
    level: 3,
    prompt: "Use the roots: what does “evacuate” mean?",
    right: "to empty a place by moving people out",
    wrong: ["to fill a place with people", "to build a new place", "to look closely at a place", "to carry heavy things"],
    hint: "vac = empty.",
  },
  {
    level: 3,
    prompt: "Use the roots: what is “empathy”?",
    right: "understanding and sharing another person's feelings",
    wrong: ["the study of living things", "fear of other people", "a written record of a life", "the ability to see far away"],
    hint: "path = feeling.",
  },
];

const analogy = (level: Level, puzzle: string, right: string, wrong: string[], hint: string): Item => ({
  level,
  prompt: "Complete the analogy.",
  visual: { type: "equation", text: puzzle },
  right,
  wrong,
  hint,
});

const ANALOGIES: Item[] = [
  analogy(1, "hot : cold :: early : ☐", "late", ["soon", "warm", "morning"], "Hot and cold are opposites. What is the opposite of early?"),
  analogy(1, "wheel : bicycle :: wing : ☐", "airplane", ["feather", "fly", "sky"], "A wheel is part of a bicycle. A wing is part of…?"),
  analogy(1, "chef : kitchen :: teacher : ☐", "classroom", ["lesson", "student", "chalk"], "A chef works in a kitchen. Where does a teacher work?"),
  analogy(1, "pen : write :: scissors : ☐", "cut", ["paper", "sharp", "glue"], "A pen is used to write. What are scissors used to do?"),
  analogy(1, "puppy : dog :: kitten : ☐", "cat", ["milk", "mouse", "yarn"], "A puppy is a young dog. A kitten is a young…?"),
  analogy(2, "happy : joyful :: tired : ☐", "sleepy", ["awake", "bed", "yawn"], "Happy and joyful are synonyms. Which word means about the same as tired?"),
  analogy(2, "brave : cowardly :: generous : ☐", "selfish", ["kind", "gift", "rich"], "Brave and cowardly are opposites. What is the opposite of generous?"),
  analogy(2, "carrot : vegetable :: salmon : ☐", "fish", ["river", "pink", "swim"], "A carrot is a kind of vegetable. A salmon is a kind of…?"),
  analogy(2, "author : novel :: composer : ☐", "symphony", ["piano", "audience", "concert hall"], "An author creates a novel. What does a composer create?"),
  analogy(2, "exercise : fitness :: study : ☐", "knowledge", ["library", "test", "pencil"], "Exercise leads to fitness. What does studying lead to?"),
  analogy(2, "warm : hot :: cool : ☐", "cold", ["breeze", "sweater", "warm"], "Hot is a stronger form of warm. What is a stronger form of cool?"),
  analogy(3, "whisper : shout :: drizzle : ☐", "downpour", ["cloud", "umbrella", "puddle", "thunder"], "A shout is a much stronger whisper. What is a much stronger drizzle?"),
  analogy(3, "biology : life :: geology : ☐", "earth", ["life", "time", "stars", "water"], "bio = life and geo = earth. Each “-logy” word is the study of its root."),
  analogy(3, "audible : hear :: visible : ☐", "see", ["loud", "light", "eyes", "shine"], "Audible means able to be heard. Visible means able to be…?"),
  analogy(3, "scarce : plentiful :: ancient : ☐", "modern", ["old", "history", "ruins", "museum"], "Scarce and plentiful are opposites. What is the opposite of ancient?"),
  analogy(3, "nervous : terrified :: pleased : ☐", "thrilled", ["angry", "smile", "calm", "upset"], "Terrified is a much stronger form of nervous. What is a much stronger form of pleased?"),
  analogy(3, "thermometer : temperature :: odometer : ☐", "distance", ["weight", "time", "fuel", "volume"], "A thermometer measures temperature. An odometer in a car measures distance travelled."),
];

function rootsAnalogies(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const [nMeaning, nFind, nWord, nAnalogy] = level === 1 ? [3, 2, 1, 2] : level === 2 ? [2, 2, 2, 2] : [1, 2, 2, 3];
  const roots = sample(rootList(level), nMeaning + nFind);

  const meaning = roots.slice(0, nMeaning).map((r) => {
    const root = ROOTS[r];
    const examples = sample(wordsWith(r), 2);
    const others = [...new Set(Object.values(ROOTS).filter((o) => o.group !== root.group).map((o) => o.meaning))];
    return choose(
      `The ${root.from} root “${r}” appears in ${examples.join(" and ")}. What does it mean?`,
      root.meaning,
      others,
      `Think about what ${examples.join(" and ")} have in common. “${r}” means “${root.meaning}.”`,
      level,
      { type: "letter", text: r, caption: examples.join(" · ") },
    );
  });

  const find = roots.slice(nMeaning).map((r) => {
    const root = ROOTS[r];
    const right = pick(wordsWith(r));
    const wrong = Object.keys(ROOT_WORDS).filter((w) => !groupsOf(w).includes(root.group));
    return choose(
      `Which word has a root that means “${root.meaning}”?`,
      right,
      wrong,
      `The root “${r}” means “${root.meaning},” and it's hiding in “${right}.”`,
      level,
    );
  });

  return shuffle([...meaning, ...find, ...askSome(WORD_MEANINGS, nWord, level), ...askSome(ANALOGIES, nAnalogy, level)]);
}

// ---------- Course ----------

export const course: Course = {
  grade: "6",
  subject: "language",
  bigIdeas: {
    "ca-bc": [
      "Language and text can be a source of creativity and joy.",
      "Exploring stories and other texts helps us understand ourselves and make connections to others and to the world.",
      "Exploring and sharing multiple perspectives extends our thinking.",
      "Developing our understanding of how language works allows us to use it purposefully.",
      "Questioning what we hear, read, and view contributes to our ability to be educated and engaged citizens.",
    ],
  },
  units: [
    {
      id: "close-reading",
      title: "Close Reading",
      emoji: "📖",
      blurb: "Theme, inference and evidence",
      parentNote:
        "Reading original stories and information texts, then finding the theme or main idea, making inferences, explaining why characters act as they do and choosing the sentence that best supports an answer.",
      standards: {
        "ca-bc": "Reading strategies; literary elements (theme, character); text structures; using evidence from texts to support ideas",
      },
      generate: closeReading,
    },
    {
      id: "point-of-view",
      title: "Point of View",
      emoji: "👁️",
      blurb: "Who is telling the story?",
      parentNote:
        "Telling first person, third person limited and third person omniscient apart, and thinking about what each narrator can and can't know.",
      standards: { "ca-bc": "Literary elements: narrative point of view (first person, third person limited, third person omniscient)" },
      generate: pointOfView,
    },
    {
      id: "figurative-language",
      title: "Figurative Language",
      emoji: "🎨",
      blurb: "Metaphors, imagery and symbols",
      parentNote:
        "Naming similes, metaphors, personification, hyperbole, onomatopoeia, alliteration and idioms, explaining what they mean, finding the sense an image appeals to and working out what a symbol stands for.",
      standards: { "ca-bc": "Literary devices: simile, metaphor, personification, hyperbole, idiom, imagery and symbolism" },
      generate: figurative,
    },
    {
      id: "connotation-tone",
      title: "Connotation & Tone",
      emoji: "🎭",
      blurb: "Word choice changes meaning",
      parentNote:
        "Words can share a dictionary meaning (denotation) but carry different feelings (connotation), like “cozy” and “cramped.” Students choose words for effect and identify a writer's tone.",
      standards: { "ca-bc": "Language features: word choice, connotation and denotation; how language shapes tone and meaning" },
      generate: connotation,
    },
    {
      id: "persuasive-writing",
      title: "Make Your Case",
      emoji: "📣",
      blurb: "Claims, evidence and counterarguments",
      parentNote:
        "Building an argument: stating a claim, choosing the strongest evidence, recognizing counterarguments and rebuttals, spotting persuasive techniques and ordering a persuasive paragraph.",
      standards: { "ca-bc": "Forms, functions and genres of text: persuasive writing (claim, reasons, evidence, counterargument); writing processes" },
      generate: persuasive,
    },
    {
      id: "sources-bias",
      title: "Sources & Bias",
      emoji: "🔎",
      blurb: "Facts, opinions and reliable sources",
      parentNote:
        "Separating fact from opinion, judging whether a source is reliable, spotting loaded words and one-sided reporting, and asking who made a message and why.",
      standards: {
        "ca-bc": "Accessing information from a variety of sources and evaluating its relevance, accuracy and reliability; fact, opinion and bias in media",
      },
      generate: sourcesBias,
    },
    {
      id: "agreement",
      title: "Agreement",
      emoji: "🤝",
      blurb: "Subjects, verbs and pronouns match",
      parentNote:
        "Making verbs agree with their subjects (even with tricky phrases, “each,” “everyone” and “either…or”) and choosing pronouns that clearly match the nouns they replace.",
      standards: { "ca-bc": "Language features, structures and conventions: subject–verb and pronoun–antecedent agreement" },
      generate: agreement,
    },
    {
      id: "sentence-repair",
      title: "Sentence Repair",
      emoji: "🔧",
      blurb: "Fragments, run-ons and comma splices",
      parentNote:
        "Spotting sentence fragments, run-on sentences and comma splices, and choosing correct ways to fix them with periods, semicolons, joining words or dependent clauses.",
      standards: { "ca-bc": "Syntax and sentence fluency: complete sentences; correcting fragments, run-ons and comma splices" },
      generate: sentenceRepair,
    },
    {
      id: "commas-clauses",
      title: "Commas & Clauses",
      emoji: "🧩",
      blurb: "Clauses, sentence types and commas",
      parentNote:
        "Finding dependent clauses, telling simple, compound and complex sentences apart, and using commas in lists, compound sentences, introductions and appositives.",
      standards: { "ca-bc": "Language features, structures and conventions: independent and dependent clauses, sentence types and comma use" },
      generate: commasClauses,
    },
    {
      id: "roots-analogies",
      title: "Roots & Analogies",
      emoji: "🌱",
      blurb: "Greek and Latin word parts",
      parentNote:
        "Using Greek and Latin roots (like “geo,” “aud” and “port”) to work out unfamiliar words, and completing analogies that compare word relationships.",
      standards: { "ca-bc": "Language features: Greek and Latin roots and word relationships (analogies) as vocabulary and word-solving strategies" },
      generate: rootsAnalogies,
    },
  ],
};
