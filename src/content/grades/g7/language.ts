import { sortQuestion, type SortSet } from "../../bank";
import { chance, pick, sample, shuffle, textChoice } from "../../random";
import type { Course, GenerateOptions, OrderQuestion, Question, Visual } from "../../types";

type Level = 1 | 2 | 3;
const levelOf = (opts?: GenerateOptions): Level => opts?.difficulty ?? 2;

/** A hand-written multiple-choice question with a difficulty level. The first answer is right. */
interface Item {
  level: Level;
  prompt: string;
  right: string;
  wrong: string[];
  hint: string;
  visual?: Visual;
}

/** Up to 4 wrong answers, so never more than 5 choices. */
function ask(item: Omit<Item, "level">): Question {
  return textChoice(item.prompt, item.right, sample(item.wrong, Math.min(4, item.wrong.length)), item.hint, item.visual);
}

/** Pick `count` items: mostly at `level`, the rest from neighbouring levels. */
function choose<T extends { level: Level }>(items: readonly T[], level: Level, count: number): T[] {
  const main = shuffle(items.filter((i) => i.level === level));
  const near = shuffle(items.filter((i) => Math.abs(i.level - level) === 1));
  const take = Math.min(main.length, Math.ceil(count * 0.65));
  const picked = [...main.slice(0, take), ...near.slice(0, count - take)];
  if (picked.length < count) {
    picked.push(...shuffle(items.filter((i) => !picked.includes(i))).slice(0, count - picked.length));
  }
  return shuffle(picked);
}

/** A short excerpt shown in a reading box. */
const excerpt = (text: string): Visual => ({ type: "passage", paragraphs: [text] });
/** A single sentence on its own line. */
const line = (text: string): Visual => ({ type: "story", lines: [text] });

// A paragraph holding a non-breaking space draws a blank line between stanzas.
const STANZA_BREAK = " ";
function poemVisual(title: string, stanzas: string[][]): Visual {
  return { type: "passage", title, paragraphs: stanzas.flatMap((s, i) => (i === 0 ? s : [STANZA_BREAK, ...s])) };
}

// ---------- Close Reading ----------

interface Reading {
  level: Level;
  title: string;
  paragraphs: string[];
  questions: Omit<Item, "level" | "visual">[];
}

const READINGS: Reading[] = [
  {
    level: 1,
    title: "The Bus Stop Garden",
    paragraphs: [
      "Every morning, Amir waited for the bus beside an empty patch of dirt. Weeds poked through the cracked pavement, and a bent shopping cart leaned against the fence.",
      "In April, Amir asked his neighbour, Mrs. Okafor, if he could plant something there. She laughed and handed him an old trowel. “Nothing grows in that corner,” she said. “But you're welcome to try.”",
      "For weeks, Amir watered his seeds before the bus came. Some mornings he was nearly late. By August, sunflowers stood taller than the bus stop sign, and people waiting for the bus began talking to each other about them. Mrs. Okafor started bringing a folding chair so she could sit beside the flowers in the afternoon.",
    ],
    questions: [
      {
        prompt: "Which statement best expresses the theme of the story?",
        right: "Small, steady efforts can change a place and bring people together.",
        wrong: [
          "Gardening is too difficult for young people.",
          "You should never take advice from neighbours.",
          "Waiting for the bus is a waste of time.",
        ],
        hint: "A theme is a message about life. Think about what changed because of Amir's work, for the place and for the people.",
      },
      {
        prompt: "How have Mrs. Okafor's feelings about the corner changed by the end?",
        right: "She doubted anything would grow, but now she enjoys spending time there.",
        wrong: [
          "She liked the corner at first, but now she wants it cleared.",
          "She always believed the corner was the best spot for a garden.",
          "She is annoyed that people gather there now.",
        ],
        hint: "Compare what she says in paragraph 2 with what she does in paragraph 3.",
      },
      {
        prompt: "Why does the author describe the weeds and the bent shopping cart in the first paragraph?",
        right: "To show how neglected the spot was before Amir changed it",
        wrong: [
          "To explain why Amir was nearly late",
          "To show that Mrs. Okafor owns the land",
          "To describe the seeds Amir planted",
        ],
        hint: "Authors often paint a “before” picture so readers notice the change later.",
      },
      {
        prompt: "Which detail best supports the idea that the garden brought people together?",
        right: "People waiting for the bus began talking to each other about them.",
        wrong: [
          "Weeds poked through the cracked pavement.",
          "She laughed and handed him an old trowel.",
          "Some mornings he was nearly late.",
        ],
        hint: "Look for a sentence where people connect with each other because of the flowers.",
      },
      {
        prompt: "What does Amir's choice to keep watering, even when he was nearly late, show about him?",
        right: "He is committed to his project.",
        wrong: ["He does not care about the bus.", "He is afraid of Mrs. Okafor.", "He wants to win a gardening prize."],
        hint: "Actions reveal character. What kind of person keeps going even when it's inconvenient?",
      },
    ],
  },
  {
    level: 1,
    title: "Why Do Leaves Change Colour?",
    paragraphs: [
      "Each fall, many trees across Canada trade their green leaves for shades of yellow, orange and red. The new colours don't appear out of nowhere. Most of them were there all along.",
      "In spring and summer, leaves are packed with chlorophyll, a green pigment that helps trees make food from sunlight. There is so much chlorophyll that it hides other pigments, such as yellow and orange carotenoids.",
      "As the days grow shorter and cooler, trees stop making chlorophyll. The green fades, and the hidden yellows and oranges finally show. Some trees, such as many maples, also make new red pigments in the fall. That is why their leaves can turn a brilliant red.",
    ],
    questions: [
      {
        prompt: "What is the main idea of this passage?",
        right: "Fall colours appear mostly because green chlorophyll fades and reveals other pigments.",
        wrong: [
          "Trees make all of their fall colours overnight.",
          "Maples are the only trees that change colour.",
          "Chlorophyll is a yellow pigment that appears in the fall.",
        ],
        hint: "The main idea is what the whole passage explains, not just one detail.",
      },
      {
        prompt: "Which text structure does the author mainly use?",
        right: "Cause and effect",
        wrong: ["Problem and solution", "Step-by-step instructions", "Personal narrative"],
        hint: "The passage explains why something happens. Which structure explains causes and their results?",
      },
      {
        prompt: "As it is used in the passage, what does “packed with” mean?",
        right: "Full of",
        wrong: ["Wrapped in", "Missing", "Coloured by"],
        hint: "Read the next sentence: there is so much chlorophyll that it hides other colours.",
      },
      {
        prompt: "Why does the author write, “Most of them were there all along”?",
        right: "To hint that yellow and orange pigments are already in the leaf during summer",
        wrong: [
          "To suggest that leaves never really change colour",
          "To argue that red leaves are not real",
          "To explain why trees grow new leaves in spring",
        ],
        hint: "Paragraph 2 explains what was hiding in the leaf all summer.",
      },
      {
        prompt: "Which question does the passage NOT answer?",
        right: "Why do evergreen trees keep their needles all winter?",
        wrong: [
          "What makes leaves green in summer?",
          "Why can maple leaves turn red?",
          "What happens to chlorophyll as days get shorter?",
        ],
        hint: "Check each question against the passage. Which one is never discussed?",
      },
    ],
  },
  {
    level: 1,
    title: "Free Throws",
    paragraphs: [
      "Zoe had practised free throws every night for a month, but when the coach called her name at tryouts, her hands felt like they belonged to someone else.",
      "Her first shot bounced off the rim. Her second missed everything. Someone on the bench laughed, and her face burned.",
      "Then she remembered what her grandfather always told her: “Breathe first, then shoot.” Zoe took one slow breath, bent her knees and let the ball go. It dropped through the net without touching the rim. She made the next three in a row.",
    ],
    questions: [
      {
        prompt: "What does “her hands felt like they belonged to someone else” suggest?",
        right: "She was so nervous that her hands felt hard to control.",
        wrong: [
          "She had injured her hands at practice.",
          "She was wearing someone else's gloves.",
          "She was bored and wanted to leave.",
        ],
        hint: "This is figurative language. How might nerves make your body feel?",
      },
      {
        prompt: "What is the turning point (climax) of the story?",
        right: "Zoe remembers her grandfather's advice and makes a shot.",
        wrong: ["Zoe practises every night for a month.", "Someone on the bench laughs.", "The coach calls Zoe's name."],
        hint: "The climax is the moment when things change direction for the main character.",
      },
      {
        prompt: "Which statement best expresses the theme?",
        right: "Staying calm under pressure helps you show what you can really do.",
        wrong: [
          "Practice is pointless if you get nervous.",
          "Only grandparents give good advice about sports.",
          "People who laugh at others always lose.",
        ],
        hint: "Think about what finally helped Zoe succeed.",
      },
      {
        prompt: "How does Zoe most likely feel after her second missed shot?",
        right: "Embarrassed",
        wrong: ["Proud", "Bored", "Relieved"],
        hint: "Look for clues: someone laughs, and “her face burned.”",
      },
      {
        prompt: "Why does the author mention that Zoe practised every night for a month?",
        right: "To show that her early misses came from nerves, not lack of skill",
        wrong: [
          "To explain why the coach picked her right away",
          "To show that she didn't care about the tryout",
          "To prove that her grandfather was her coach",
        ],
        hint: "If she practised that much, what must have caused the misses?",
      },
    ],
  },
  {
    level: 2,
    title: "Give Readers a Choice",
    paragraphs: [
      "In many classrooms, every student reads the same assigned novel. Sharing a book has real value, but schools should also give students regular time to read books they choose for themselves.",
      "Choice builds motivation. When students pick books that match their interests, they are more likely to finish them and to keep reading outside of school. A student who would love graphic novels or sports biographies may never discover that love if every book is assigned.",
      "Some people worry that students will only choose easy books. Teachers can prevent this by helping students set reading goals and try a new genre each term. Choice does not mean giving up on challenge; it means giving students a reason to read.",
    ],
    questions: [
      {
        prompt: "What is the author's main claim?",
        right: "Schools should give students regular time to read books they choose.",
        wrong: [
          "Schools should stop assigning shared novels completely.",
          "Graphic novels are better than all other books.",
          "Students will only choose easy books.",
        ],
        hint: "The claim is the main point the author argues (see paragraph 1). Careful: the author still sees value in shared books.",
      },
      {
        prompt: "Which sentence presents a counterargument that the author responds to?",
        right: "Some people worry that students will only choose easy books.",
        wrong: [
          "Choice builds motivation.",
          "Teachers can prevent this by helping students set reading goals.",
          "A student who would love graphic novels may never discover that love.",
        ],
        hint: "A counterargument is the other side's point. Look for what “some people worry” about.",
      },
      {
        prompt: "How does the author respond to the concern about easy books?",
        right: "By suggesting that teachers help students set goals and try new genres",
        wrong: [
          "By agreeing that choice should be cancelled",
          "By ignoring the concern completely",
          "By saying that easy books are the best books",
        ],
        hint: "Read the sentence right after the concern is mentioned.",
      },
      {
        prompt: "What is the main purpose of the second paragraph?",
        right: "To give a reason that supports the claim",
        wrong: ["To present the opposing view", "To tell a personal story", "To summarize the whole essay"],
        hint: "Paragraph 2 begins, “Choice builds motivation.” Is that for or against the author's claim?",
      },
      {
        prompt: "Which word best describes the author's tone?",
        right: "Reasonable",
        wrong: ["Furious", "Sarcastic", "Unsure"],
        hint: "Notice that the author admits shared books have value and answers a concern calmly.",
      },
    ],
  },
  {
    level: 2,
    title: "Citizen Scientists",
    paragraphs: [
      "You don't need a lab coat to do real science. Every year, thousands of volunteers count birds, track butterflies and record when the first flowers bloom in their neighbourhoods. They are called citizen scientists.",
      "Scientists can't be everywhere at once. By collecting observations from many places, volunteers help researchers spot large patterns, such as changes in when some birds arrive each spring.",
      "Of course, data from volunteers must be checked. Many projects train participants, ask for photos and compare reports to catch mistakes. With these steps, a single backyard observation can become part of a study that spans a whole continent.",
    ],
    questions: [
      {
        prompt: "What is the main idea of this passage?",
        right: "Volunteers can collect useful scientific data, especially when projects check it carefully.",
        wrong: [
          "Only scientists in labs can do real science.",
          "Birds arrive at exactly the same time every spring.",
          "Citizen science projects never contain mistakes.",
        ],
        hint: "The main idea covers the whole passage: who citizen scientists are, why they help and how their data is checked.",
      },
      {
        prompt: "According to the passage, why are citizen scientists helpful to researchers?",
        right: "They can make observations in many more places than researchers can alone.",
        wrong: [
          "They are better trained than most scientists.",
          "Their data never needs to be checked.",
          "They work only in laboratories.",
        ],
        hint: "Look at paragraph 2: “Scientists can't be everywhere at once.”",
      },
      {
        prompt: "What is the purpose of the third paragraph?",
        right: "To address a possible weakness and explain how projects handle it",
        wrong: [
          "To introduce the topic for the first time",
          "To list the kinds of birds people count",
          "To argue that citizen science should stop",
        ],
        hint: "“Of course” signals that the author is about to deal with a concern.",
      },
      {
        prompt: "What does “spans” mean in “a study that spans a whole continent”?",
        right: "Stretches across",
        wrong: ["Ignores", "Divides in half", "Describes"],
        hint: "Try each choice in the sentence. Which one makes sense with “a whole continent”?",
      },
      {
        prompt: "How does the author hook the reader in the first sentence?",
        right: "By challenging a common idea about who can do science",
        wrong: [
          "By sharing a surprising statistic",
          "By quoting a famous scientist",
          "By asking the reader a question",
        ],
        hint: "Reread the first sentence. What idea about scientists does it push back against?",
      },
    ],
  },
  {
    level: 2,
    title: "The New Kid",
    paragraphs: [
      "When Lena joined our class in October, I decided right away that she thought she was better than everyone else. She sat at the back, answered questions in two or three words and spent every lunch hour bent over a sketchbook.",
      "In November, Ms. Varga paired us for a project on local birds. I expected to do all the work. Instead, Lena opened her sketchbook and slid it across the table. Every page was full of birds: chickadees, crows, a heron standing on one leg, each one labelled in tiny, careful letters.",
      "“I didn't know anyone here,” she said, not looking up. “Drawing is easier than talking.” I thought about all the lunches I had walked right past her table. “Could you show me how you drew the heron?” I asked. She looked up then, and for the first time, she smiled.",
    ],
    questions: [
      {
        prompt: "From which point of view is this story told?",
        right: "First person, by one of Lena's classmates",
        wrong: [
          "Third person, by an outside narrator",
          "First person, by Lena",
          "Second person, speaking to the reader",
        ],
        hint: "Look at the pronouns: “I decided,” “I expected.” Who is the “I”?",
      },
      {
        prompt: "Why should readers be careful about the narrator's description of Lena in the first paragraph?",
        right: "It is based on assumptions the narrator made before getting to know her.",
        wrong: [
          "The narrator is describing a different student.",
          "The narrator was not in the class in October.",
          "Lena asked the narrator to describe her that way.",
        ],
        hint: "Notice the words “I decided right away.” Did the narrator know Lena yet?",
      },
      {
        prompt: "What causes the narrator to change their opinion of Lena?",
        right: "Seeing her sketchbook and learning why she was quiet",
        wrong: [
          "Ms. Varga telling the class to be kind",
          "Lena winning a drawing contest",
          "Lena moving to a seat at the front",
        ],
        hint: "Look at what happens during the bird project.",
      },
      {
        prompt: "What does “I thought about all the lunches I had walked right past her table” suggest?",
        right: "The narrator regrets not reaching out to Lena sooner.",
        wrong: [
          "The narrator is hungry.",
          "The narrator is proud of avoiding Lena.",
          "The narrator wants to sit at a different table.",
        ],
        hint: "Why would someone think back on those lunches right after hearing Lena explain herself?",
      },
      {
        prompt: "Which statement best expresses the theme?",
        right: "First impressions can be wrong, so it's worth getting to know people.",
        wrong: ["Quiet people don't want friends.", "Group projects are always unfair.", "Art is more important than science."],
        hint: "What did the narrator learn about judging people?",
      },
    ],
  },
  {
    level: 3,
    title: "Aim the Light",
    paragraphs: [
      "Walk outside in most cities at midnight and you'll see more streetlights than stars. Bright lighting can help streets feel safer, but much of it is wasted: it shines up into the sky instead of down onto the sidewalk.",
      "This wasted light has costs. It uses electricity that someone has to pay for. It can confuse migrating birds, which may circle brightly lit buildings until they are exhausted. It can even disrupt our sleep. Shielded lights, which point downward, can light the ground just as well while sending far less light into the sky.",
      "Critics argue that dimmer cities will be more dangerous. That concern deserves attention, but it confuses brightness with good design. The goal is not darkness; it is light that goes where people actually need it.",
    ],
    questions: [
      {
        prompt: "Which statement best expresses the author's claim?",
        right: "Cities should aim outdoor lights where they are needed and cut wasted light.",
        wrong: [
          "Cities should turn off all streetlights at night.",
          "Brighter lighting always makes streets safer.",
          "Saving birds is the only reason to change city lighting.",
        ],
        hint: "Watch out for choices that go further than the author does. Reread the last sentence.",
      },
      {
        prompt: "How does the author handle the critics' concern?",
        right: "Acknowledges it, then argues that well-designed lighting solves the problem",
        wrong: ["Agrees with it and drops the argument", "Mocks the critics as foolish", "Ignores it completely"],
        hint: "The author says the concern “deserves attention,” then adds “but…”.",
      },
      {
        prompt:
          "In the final sentence, the author contrasts “darkness” with “light that goes where people actually need it.” What does this contrast do?",
        right: "It clarifies that the author wants better-aimed light, not less safety.",
        wrong: [
          "It shows that the author wants cities to be completely dark.",
          "It changes the topic to electricity prices.",
          "It admits that the argument is weak.",
        ],
        hint: "The author is answering the critics. What misunderstanding is the author clearing up?",
      },
      {
        prompt: "Which evidence would MOST strengthen the second paragraph?",
        right: "Data comparing bird collisions near shielded and unshielded lights",
        wrong: [
          "A story about the author's favourite constellation",
          "A list of the tallest buildings in Canada",
          "A poem about the beauty of the night sky",
        ],
        hint: "Strong evidence is specific, measurable and directly connected to the point being made.",
      },
      {
        prompt: "Which action would the author most likely support?",
        right: "Replacing old streetlights with downward-facing ones",
        wrong: [
          "Banning all outdoor lights after 10 p.m.",
          "Adding floodlights that point at the sky",
          "Removing streetlights from busy sidewalks",
        ],
        hint: "The author wants light aimed at the ground, not more darkness.",
      },
    ],
  },
  {
    level: 3,
    title: "The Blue Kite",
    paragraphs: [
      "Every spring, Priya and her grandmother flew the blue kite on the hill behind the community centre. Her grandmother always held the string. Priya's job was to run with the kite and let it go.",
      "This spring, her grandmother watched from a bench with a blanket over her knees. “Your turn to hold the string,” she said. Priya hesitated. The wind tugged hard, and the kite was older now, its tail patched with tape.",
      "Priya ran, let the kite rise and felt the string pull against her palms. For a moment she was sure it would get away from her. Then she remembered how her grandmother leaned back, gave a little line and pulled it in. The kite steadied, high and bright against the clouds. On the bench, her grandmother closed her eyes and smiled, as if she could feel the wind too.",
    ],
    questions: [
      {
        prompt: "What does holding the kite string most likely symbolize in this story?",
        right: "Taking on a role that once belonged to her grandmother",
        wrong: [
          "Winning a competition against her grandmother",
          "Wanting to get away from her family",
          "Being afraid of the wind",
        ],
        hint: "Who used to hold the string? Who holds it now? What does that change suggest?",
      },
      {
        prompt: "What can you infer about the grandmother?",
        right: "She can no longer do some things she once did, and she trusts Priya to carry on.",
        wrong: [
          "She is upset that Priya took the string.",
          "She has never flown a kite before.",
          "She wants to buy a newer kite.",
        ],
        hint: "Notice the bench, the blanket and her smile at the end.",
      },
      {
        prompt: "Why does the author mention that the kite's tail is “patched with tape”?",
        right: "To show that the kite is old and has been cared for over many years",
        wrong: [
          "To explain why the kite cannot fly",
          "To show that Priya is careless with her things",
          "To suggest that the kite was bought recently",
        ],
        hint: "A patched object has been repaired instead of replaced. What does that say about how people feel about it?",
      },
      {
        prompt: "Which sentence shows Priya using what she learned from her grandmother?",
        right: "Then she remembered how her grandmother leaned back, gave a little line and pulled it in.",
        wrong: ["Priya hesitated.", "Her grandmother always held the string.", "The wind tugged hard."],
        hint: "Look for the moment Priya copies her grandmother's technique.",
      },
      {
        prompt: "Which statement best expresses the theme?",
        right: "Traditions continue when skills and trust are passed between generations.",
        wrong: [
          "Kites are dangerous on windy days.",
          "Older people shouldn't go outside in spring.",
          "It's better to watch than to take part.",
        ],
        hint: "Think about what passes from the grandmother to Priya, beyond the string itself.",
      },
    ],
  },
  {
    level: 3,
    title: "Moving Day",
    paragraphs: [
      "Kenji taped the last box shut and wrote KITCHEN on it in thick black marker. The apartment echoed now. Without the couch and the bookshelves, it looked smaller, not bigger, which made no sense.",
      "His sister, Ana, found him sitting on the floor of his empty room, tracing the pencil lines on the door frame. Each line had a date beside it. The oldest one barely reached the doorknob.",
      "“We can't take the door frame,” Ana said gently. Kenji nodded. Then he pulled a pencil from his pocket, stood straight against the wood and made one last mark. “Now it knows how tall I got,” he said.",
    ],
    questions: [
      {
        prompt: "What do the pencil lines on the door frame most likely record?",
        right: "Kenji's height at different ages",
        wrong: ["The dates the family painted the room", "Measurements for the moving boxes", "Ana's school marks"],
        hint: "Lines with dates, starting low near the doorknob... What grows over time?",
      },
      {
        prompt: "Why does Kenji make one last mark before leaving?",
        right: "He wants to leave a piece of his story in the home he is leaving.",
        wrong: [
          "He wants to prove he is taller than Ana.",
          "He plans to come back and repaint the door.",
          "He is checking whether the boxes will fit.",
        ],
        hint: "Read his last line: “Now it knows how tall I got.”",
      },
      {
        prompt: "Which word best describes the mood of the passage?",
        right: "Bittersweet",
        wrong: ["Terrifying", "Silly", "Furious"],
        hint: "Mood is the feeling the passage creates. There's sadness here, but also warmth.",
      },
      {
        prompt: "The apartment “looked smaller, not bigger, which made no sense.” What does this detail suggest?",
        right: "Kenji's feelings are shaping how he sees the empty rooms.",
        wrong: [
          "The movers knocked down a wall.",
          "Kenji doesn't know how to measure rooms.",
          "The apartment was always very tiny.",
        ],
        hint: "An empty room should look bigger. Why might it feel smaller to someone who is leaving?",
      },
      {
        prompt: "Which statement best expresses the theme?",
        right: "The places we live hold memories, which can make leaving them hard.",
        wrong: [
          "Moving is always exciting and fun.",
          "Younger siblings should do the packing.",
          "Old apartments should never be sold.",
        ],
        hint: "Think about why the door frame matters so much to Kenji.",
      },
    ],
  },
];

function closeReading(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return choose(READINGS, level, 2).flatMap((r) => {
    const visual: Visual = { type: "passage", title: r.title, paragraphs: r.paragraphs };
    return sample(r.questions, 4).map((q) => ask({ ...q, visual }));
  });
}

// ---------- Literary Devices ----------

const DEVICE_PROMPT = "Which literary device does this excerpt use?";

function device(level: Level, text: string, right: string, wrong: string[], hint: string): Item {
  return { level, prompt: DEVICE_PROMPT, right, wrong, hint, visual: excerpt(text) };
}

const DEVICES: Item[] = [
  device(1, "Her voice was as soft as falling snow.", "Simile", ["Metaphor", "Onomatopoeia", "Flashback"], "A simile compares two things using “like” or “as.” Look for “as soft as.”"),
  device(
    1,
    "Before the bell, the classroom was a beehive of noise and motion.",
    "Metaphor",
    ["Simile", "Onomatopoeia", "Flashback"],
    "A metaphor says one thing IS another, with no “like” or “as.” The classroom isn't really a beehive.",
  ),
  device(
    1,
    "The stars were diamonds scattered across the dark sky.",
    "Metaphor",
    ["Simile", "Onomatopoeia", "Flashback"],
    "The stars are called diamonds directly, without “like” or “as.” That's a metaphor.",
  ),
  device(
    1,
    "The old floorboards groaned and complained under every step.",
    "Personification",
    ["Simile", "Hyperbole", "Flashback"],
    "Floorboards can't really complain. Giving human actions to objects is personification.",
  ),
  device(1, "I've told you a million times to shut the door!", "Hyperbole", ["Simile", "Personification", "Foreshadowing"], "Nobody has really said it a million times. A huge exaggeration for effect is hyperbole."),
  device(1, "This backpack weighs a ton!", "Hyperbole", ["Simile", "Onomatopoeia", "Flashback"], "A backpack can't weigh a ton. That exaggeration is hyperbole."),
  device(
    1,
    "Crunch, crunch, crunch went the frozen leaves under Ravi's boots.",
    "Onomatopoeia",
    ["Metaphor", "Hyperbole", "Flashback"],
    "“Crunch” sounds like the noise it names. Words that imitate sounds are onomatopoeia.",
  ),
  device(
    1,
    "Six slippery seals slid silently into the sea.",
    "Alliteration",
    ["Simile", "Flashback", "Hyperbole"],
    "Listen to the beginnings of the words: s, s, s… Repeating the first sound is alliteration.",
  ),
  {
    level: 1,
    prompt: "Which device gives human qualities to something that is not human?",
    right: "Personification",
    wrong: ["Simile", "Alliteration", "Hyperbole"],
    hint: "Look inside the word: personification makes a thing act like a person.",
  },
  {
    level: 1,
    prompt: "What is a simile?",
    right: "A comparison that uses “like” or “as”",
    wrong: ["An exaggeration for effect", "A word that imitates a sound", "A scene from an earlier time"],
    hint: "“As busy as a bee” and “ran like the wind” are both similes.",
  },
  device(
    2,
    "As the hikers set out under clear skies, Maya noticed a thin line of dark clouds behind the mountain. She decided not to mention it.",
    "Foreshadowing",
    ["Flashback", "Onomatopoeia", "Hyperbole"],
    "The dark clouds hint that trouble may come later. Hints about future events are foreshadowing.",
  ),
  device(
    2,
    "Leo tucked the spare key into his backpack. “I won't need this,” he said, “but just in case.”",
    "Foreshadowing",
    ["Flashback", "Alliteration", "Simile"],
    "When a story makes a point of saying something won't be needed, it often will be. That's a hint about later events.",
  ),
  device(
    2,
    "Standing at the finish line, Ana suddenly remembered the first time she tried to run a lap, three years earlier, gasping and red-faced before she was even halfway around the track.",
    "Flashback",
    ["Foreshadowing", "Onomatopoeia", "Personification"],
    "The story jumps back three years to show an earlier scene. That's a flashback.",
  ),
  device(
    2,
    "The smell of fresh bread carried Jay back to his grandfather's kitchen, where he once stood on a stool to help knead the dough.",
    "Flashback",
    ["Foreshadowing", "Hyperbole", "Onomatopoeia"],
    "A smell sends Jay back to a scene from his past. Interrupting the present to show the past is a flashback.",
  ),
  device(
    2,
    "Since his best friend moved away, Sam has carried a broken compass in his pocket. Its needle spins and spins, never settling on a direction.",
    "Symbolism",
    ["Hyperbole", "Onomatopoeia", "Flashback"],
    "The compass stands for something bigger: Sam feels lost without his friend. An object that represents an idea is a symbol.",
  ),
  device(
    2,
    "After their argument, the two friends planted a small cedar tree together. Each year, as the tree grew taller and stronger, so did their friendship.",
    "Symbolism",
    ["Hyperbole", "Onomatopoeia", "Flashback"],
    "The growing tree represents the growing friendship. That's symbolism.",
  ),
  device(
    2,
    "The pond was glassy and still, the air smelled of pine, and the dock felt cool and damp beneath our bare feet.",
    "Imagery",
    ["Flashback", "Hyperbole", "Foreshadowing"],
    "The description appeals to sight, smell and touch. Language that paints a sensory picture is imagery.",
  ),
  {
    level: 2,
    prompt: "A writer gives hints about events that will happen later in a story. What is this called?",
    right: "Foreshadowing",
    wrong: ["Flashback", "Symbolism", "Imagery"],
    hint: "Fore- means before. The writer shows a shadow of what's coming.",
  },
  {
    level: 2,
    prompt: "A scene interrupts the present action to show something that happened earlier. What is this called?",
    right: "Flashback",
    wrong: ["Foreshadowing", "Symbolism", "Personification"],
    hint: "The story “flashes back” to the past.",
  },
  {
    level: 2,
    prompt: "In a story, a dove appears whenever the characters make peace. What device is the dove an example of?",
    right: "Symbolism",
    wrong: ["Flashback", "Onomatopoeia", "Hyperbole"],
    hint: "The dove stands for a bigger idea: peace. An object that represents an idea is a symbol.",
  },
  device(
    3,
    "Noah spent all weekend building a robot to tidy his room. By Sunday night, his room was messier than ever, covered in robot parts.",
    "Situational irony",
    ["Verbal irony", "Dramatic irony", "Flashback"],
    "The result is the opposite of what Noah expected. When events turn out opposite to expectations, that's situational irony.",
  ),
  device(
    3,
    "The town's new “Keep Our Parks Clean” banner blew off its pole and ended up floating in the duck pond.",
    "Situational irony",
    ["Verbal irony", "Dramatic irony", "Foreshadowing"],
    "A clean-parks banner became litter in the park. An outcome opposite to what you'd expect is situational irony.",
  ),
  device(
    3,
    "Stepping into the freezing rain without an umbrella, Priya muttered, “What lovely weather we're having.”",
    "Verbal irony",
    ["Situational irony", "Dramatic irony", "Flashback"],
    "Priya says the opposite of what she means. That's verbal irony.",
  ),
  device(
    3,
    "After Leo tripped over his own shoelaces in front of the whole class, his friend grinned and said, “Smooth move. Very graceful.”",
    "Verbal irony",
    ["Situational irony", "Dramatic irony", "Symbolism"],
    "The friend means the opposite of “graceful.” Saying the opposite of what you mean is verbal irony.",
  ),
  device(
    3,
    "Readers know that Kenji's friends are hiding in his living room for a surprise party. Kenji, grumbling that everyone forgot his birthday, unlocks the front door.",
    "Dramatic irony",
    ["Verbal irony", "Situational irony", "Flashback"],
    "Readers know something Kenji doesn't. When the audience knows more than a character, that's dramatic irony.",
  ),
  device(
    3,
    "In the play, the audience watched the twins swap name tags. Now the teacher, unaware, praises “Amir” for a project that his brother finished.",
    "Dramatic irony",
    ["Verbal irony", "Situational irony", "Symbolism"],
    "The audience knows about the swap, but the teacher doesn't. That gap in knowledge is dramatic irony.",
  ),
  {
    level: 3,
    prompt: "When the audience knows something that a character does not, it is called…",
    right: "Dramatic irony",
    wrong: ["Verbal irony", "Situational irony", "Foreshadowing"],
    hint: "Think of a play (a drama) where the audience can see what the character can't.",
  },
  {
    level: 3,
    prompt: "A character says the opposite of what they really mean. What is this called?",
    right: "Verbal irony",
    wrong: ["Situational irony", "Dramatic irony", "Hyperbole"],
    hint: "Verbal means spoken in words. The irony is in what the character says.",
  },
  {
    level: 3,
    prompt: "How does foreshadowing usually affect a reader?",
    right: "It builds suspense by hinting at what might happen.",
    wrong: [
      "It explains events that already happened.",
      "It proves that the narrator is lying.",
      "It makes the story shorter.",
    ],
    hint: "Hints about the future make readers wonder what's coming, and keep them reading.",
  },
  {
    level: 3,
    prompt: "Why might an author use a flashback?",
    right: "To reveal past events that explain a character's present feelings or actions",
    wrong: [
      "To hint at what will happen at the end",
      "To make a character say the opposite of what they mean",
      "To create a rhyme scheme",
    ],
    hint: "A flashback looks back in time. How might the past help explain the present?",
  },
  {
    level: 3,
    prompt:
      "In a story about a girl who moves to a new country, she keeps a jar of soil from her grandmother's garden on her windowsill. What does the jar most likely symbolize?",
    right: "Her connection to her family and the home she left",
    wrong: ["Her plan to become a scientist", "Her plan to start a business", "Her fear of plants"],
    hint: "Where did the soil come from? What would that place mean to someone far away?",
  },
];

function plotOrder(): OrderQuestion {
  const parts = [
    "Exposition: characters and setting are introduced",
    "Rising action: the conflict builds",
    "Climax: the turning point",
    "Falling action: events after the turning point",
    "Resolution: the conflict is settled",
  ];
  return {
    kind: "order",
    prompt: "Put the parts of a plot in order, from beginning to end.",
    hint: "Picture a mountain: the story introduces its people, climbs as the conflict builds, peaks at the turning point, then comes down to an ending.",
    items: parts.map((label, i) => ({ id: `p${i}`, label })),
  };
}

function literaryDevices(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const withOrder = level < 3 && chance(0.5);
  const qs = choose(DEVICES, level, withOrder ? 7 : 8).map(ask);
  return withOrder ? shuffle([...qs, plotOrder()]) : qs;
}

// ---------- Tone & Mood ----------

const MOOD_PROMPT = "Which word best describes the mood of this passage?";
const TONE_PROMPT = "Which word best describes the writer's tone?";

const TONE_MOOD: Item[] = [
  {
    level: 1,
    prompt: "What is the difference between tone and mood?",
    right: "Tone is the writer's attitude; mood is the feeling the reader gets.",
    wrong: [
      "Tone is the reader's feeling; mood is the writer's attitude.",
      "Tone and mood both mean the topic of a text.",
      "Tone is the setting; mood is the plot.",
    ],
    hint: "Tone comes from the writer (like a tone of voice). Mood is the atmosphere the reader feels.",
  },
  {
    level: 1,
    prompt: MOOD_PROMPT,
    visual: excerpt("Sunlight spilled across the kitchen table. Music played from the radio, and the smell of warm pancakes drifted through the open window."),
    right: "Cheerful",
    wrong: ["Gloomy", "Tense", "Angry"],
    hint: "Notice the sunlight, music and warm pancakes. How do those details make you feel?",
  },
  {
    level: 1,
    prompt: MOOD_PROMPT,
    visual: excerpt("Grey rain dripped from the gutters all afternoon. The empty swings creaked back and forth, and nobody came outside to play."),
    right: "Gloomy",
    wrong: ["Joyful", "Silly", "Excited"],
    hint: "Grey rain, empty swings, nobody outside... What feeling do these details create?",
  },
  {
    level: 1,
    prompt: MOOD_PROMPT,
    visual: excerpt("The hallway lights flickered. Behind a closed door, a phone rang and rang. Maya held her breath and reached for the handle."),
    right: "Tense",
    wrong: ["Relaxed", "Playful", "Bored"],
    hint: "Flickering lights and a held breath make readers wonder what will happen next.",
  },
  {
    level: 1,
    prompt: MOOD_PROMPT,
    visual: excerpt("The lake was still. A loon called once across the water, and the last light of evening turned the clouds pink."),
    right: "Peaceful",
    wrong: ["Frantic", "Angry", "Silly"],
    hint: "Still water, one quiet call, soft pink light... The details are calm and gentle.",
  },
  {
    level: 1,
    prompt: TONE_PROMPT,
    visual: excerpt("This was hands down the best science fair our school has ever held! Every project was creative, and the volcano demo had the whole gym cheering."),
    right: "Enthusiastic",
    wrong: ["Bitter", "Bored", "Fearful"],
    hint: "Look at “hands down the best” and the exclamation mark. How does the writer feel about the fair?",
  },
  {
    level: 1,
    prompt: "Which word would make this sentence feel the most peaceful?",
    visual: line("The river _____ past the cabin."),
    right: "drifted",
    wrong: ["roared", "raged", "crashed"],
    hint: "Read the sentence with each word. Which one sounds slow and gentle?",
  },
  {
    level: 1,
    prompt: "Which word has the most positive connotation?",
    right: "confident",
    wrong: ["arrogant", "cocky", "smug"],
    hint: "All four describe someone sure of themselves. Connotation is the feeling a word carries. Which one sounds like a compliment?",
  },
  {
    level: 2,
    prompt: TONE_PROMPT,
    visual: excerpt("Oh, wonderful. The bus is late again. I just love standing in the rain for twenty minutes."),
    right: "Sarcastic",
    wrong: ["Sincere", "Joyful", "Fearful"],
    hint: "Does the writer really love standing in the rain? Saying the opposite of what you mean, with an edge, is sarcasm.",
  },
  {
    level: 2,
    prompt: TONE_PROMPT,
    visual: excerpt("I still remember the summer we built the treehouse: the long afternoons, the sticky lemonade, the feeling that summer would never end. I miss those days."),
    right: "Nostalgic",
    wrong: ["Angry", "Sarcastic", "Fearful"],
    hint: "The writer looks back fondly and misses the past. That longing is called nostalgia.",
  },
  {
    level: 2,
    prompt: TONE_PROMPT,
    visual: excerpt("Please read this carefully. If you see a fallen power line, stay at least ten metres away and call 911 right away."),
    right: "Urgent",
    wrong: ["Playful", "Nostalgic", "Sarcastic"],
    hint: "Words like “carefully” and “right away” show the writer wants quick, serious action.",
  },
  {
    level: 2,
    prompt: TONE_PROMPT,
    visual: excerpt("The movie's plot was predictable, the jokes fell flat, and the ending dragged on for twenty minutes too long."),
    right: "Critical",
    wrong: ["Admiring", "Nostalgic", "Fearful"],
    hint: "List what the writer says about the plot, jokes and ending. Is it praise or complaint?",
  },
  {
    level: 2,
    prompt: TONE_PROMPT,
    visual: excerpt("The city council voted 6 to 3 on Tuesday to extend library hours. The change will take effect next month."),
    right: "Objective",
    wrong: ["Sentimental", "Sarcastic", "Outraged"],
    hint: "The writer only reports facts, with no feelings or opinions. That's an objective tone.",
  },
  {
    level: 2,
    prompt: TONE_PROMPT,
    visual: excerpt("My little brother's idea of “helping” in the kitchen is eating the chocolate chips before they reach the bowl. So far, he has helped with zero cookies and about four hundred chocolate chips."),
    right: "Humorous",
    wrong: ["Tragic", "Furious", "Formal"],
    hint: "The writer exaggerates and jokes about the “help.” What tone does that create?",
  },
  {
    level: 2,
    prompt: "Which word has the most negative connotation?",
    right: "stingy",
    wrong: ["thrifty", "economical", "frugal"],
    hint: "All four describe someone careful with money. Which one sounds like an insult?",
  },
  {
    level: 2,
    prompt: "Which description of the same person sounds the most admiring?",
    right: "Lena is determined and never gives up on an idea.",
    wrong: [
      "Lena is stubborn and never lets go of an idea.",
      "Lena is pushy about her ideas.",
      "Lena is obsessed with her own ideas.",
    ],
    hint: "Compare the describing words: determined, stubborn, pushy, obsessed. Which one is a compliment?",
  },
  {
    level: 2,
    prompt: "A writer changes “The dog walked toward us” to “The dog bounded toward us.” What effect does the new verb have?",
    right: "It makes the dog seem energetic and excited.",
    wrong: [
      "It makes the dog seem tired and slow.",
      "It makes the sentence more formal.",
      "It changes the setting of the scene.",
    ],
    hint: "Picture a dog bounding. How is that different from walking?",
  },
  {
    level: 3,
    prompt: TONE_PROMPT,
    visual: excerpt("Looking back, I realize the argument was never really about the soccer game. We were both afraid that changing schools would change our friendship."),
    right: "Reflective",
    wrong: ["Giddy", "Hostile", "Panicked"],
    hint: "“Looking back, I realize…” shows the writer thinking carefully about the past.",
  },
  {
    level: 3,
    prompt: "Which sentence has the most formal tone?",
    right: "We respectfully request that the meeting be moved to Thursday.",
    wrong: [
      "Can we move the meeting? Thursday's way better.",
      "Ugh, fine, Thursday works, I guess.",
      "Thursday, yeah? Let's just do that.",
    ],
    hint: "Formal writing avoids slang and contractions and sounds polite and serious.",
  },
  {
    level: 3,
    prompt: "How does the feeling of this passage shift?",
    visual: excerpt("For weeks, Jay bragged that he would win the chess tournament easily. He barely practised. Then, in the first round, a quiet younger player checkmated him in eleven moves. Jay stared at the board for a long time."),
    right: "From cocky confidence to stunned humility",
    wrong: ["From sadness to joy", "From fear to boredom", "From anger to silliness"],
    hint: "Compare the beginning (bragging) with the ending (staring at the board). The word “Then” marks the turn.",
  },
  {
    level: 3,
    prompt: "A story describes a long, hard winter. Which final sentence would leave readers feeling most hopeful?",
    right: "On the windowsill, the first green shoot pushed up through the soil.",
    wrong: [
      "The snow kept falling, and no one remembered what spring looked like.",
      "The furnace rattled once and went silent.",
      "Everyone stayed inside, staring at the grey sky.",
    ],
    hint: "Which detail suggests that something new is beginning?",
  },
  {
    level: 3,
    prompt: "Which sentence would best create an eerie mood?",
    right: "Fog curled around the empty swings, and they swayed though there was no wind.",
    wrong: [
      "Children laughed as they raced to the swings.",
      "The swings were freshly painted bright yellow.",
      "A parent gently pushed a toddler on a swing.",
    ],
    hint: "Eerie means strange and a little unsettling. Which sentence has something that can't be easily explained?",
  },
  {
    level: 3,
    prompt: "A writer calls a new skate park “a noisy concrete eyesore.” What tone does this word choice create?",
    right: "Disapproving",
    wrong: ["Admiring", "Neutral", "Joyful"],
    hint: "An “eyesore” is something ugly to look at. How does the writer feel about the park?",
  },
  {
    level: 3,
    prompt:
      "Writer A: “Rain drummed cozily on the roof as we read by the fire.” Writer B: “Rain hammered the roof, and the cold crept in through every crack.” How do their moods differ?",
    right: "A feels cozy; B feels harsh and uncomfortable.",
    wrong: ["A feels harsh; B feels cozy.", "Both feel joyful.", "Both feel neutral and factual."],
    hint: "Compare the verbs and details: “drummed cozily” and “by the fire” versus “hammered” and “the cold crept in.”",
  },
];

const CONNOTATION_SORT: SortSet = {
  prompt: "Sort the words by connotation. Does each word sound positive or negative?",
  hint: "Pairs like confident/arrogant mean almost the same thing, but one is a compliment and one is a put-down.",
  bins: [
    { id: "pos", label: "Positive", emoji: "👍" },
    { id: "neg", label: "Negative", emoji: "👎" },
  ],
  items: [
    { label: "curious", emoji: "🔍", bin: "pos" },
    { label: "confident", emoji: "😎", bin: "pos" },
    { label: "thrifty", emoji: "🪙", bin: "pos" },
    { label: "determined", emoji: "🎯", bin: "pos" },
    { label: "relaxed", emoji: "😌", bin: "pos" },
    { label: "youthful", emoji: "🌱", bin: "pos" },
    { label: "nosy", emoji: "👃", bin: "neg" },
    { label: "arrogant", emoji: "😤", bin: "neg" },
    { label: "stingy", emoji: "🔒", bin: "neg" },
    { label: "stubborn", emoji: "🐂", bin: "neg" },
    { label: "lazy", emoji: "🛋️", bin: "neg" },
    { label: "childish", emoji: "🍼", bin: "neg" },
  ],
};

function toneMood(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle([...choose(TONE_MOOD, level, 7).map(ask), sortQuestion(CONNOTATION_SORT, 3)]);
}

// ---------- Persuasive Power ----------

const ETHOS = "Ethos (credibility)";
const PATHOS = "Pathos (emotion)";
const LOGOS = "Logos (logic and evidence)";
const APPEAL_PROMPT = "Which persuasive appeal does this mostly use?";

function appeal(text: string, right: string, hint: string): Item {
  return { level: 1, prompt: APPEAL_PROMPT, visual: excerpt(text), right, wrong: [ETHOS, PATHOS, LOGOS].filter((a) => a !== right), hint };
}

const BANDWAGON = "Bandwagon";
const FALSE_CAUSE = "False cause";
const AD_HOMINEM = "Attacking the person (ad hominem)";
const EITHER_OR = "Either-or (false dilemma)";
const HASTY = "Hasty generalization";
const SLIPPERY = "Slippery slope";
const FALLACY_PROMPT = "Which logical fallacy does this argument use?";

function fallacy(level: Level, text: string, right: string, wrong: string[], hint: string): Item {
  return { level, prompt: FALLACY_PROMPT, visual: excerpt(text), right, wrong, hint };
}

const PERSUASION: Item[] = [
  appeal(
    "As a veterinarian with twenty years of experience, I can tell you that regular checkups keep pets healthier.",
    ETHOS,
    "The speaker builds trust by mentioning their job and experience. Appeals to credibility are ethos.",
  ),
  appeal(
    "Dr. Chen, who has studied children's teeth for more than thirty years, recommends brushing for two full minutes.",
    ETHOS,
    "The argument leans on an expert's background. That's an appeal to credibility: ethos.",
  ),
  appeal(
    "Imagine a puppy shivering alone in the cold, waiting for someone who never comes. You can give a dog like this a warm home today.",
    PATHOS,
    "This tries to make you feel sympathy. Appeals to emotion are pathos.",
  ),
  appeal(
    "Picture the empty playground, the silent swings, the kids with nowhere to play. Vote to keep our park open!",
    PATHOS,
    "The sad image is meant to stir your feelings. That's pathos.",
  ),
  appeal(
    "A reusable water bottle costs about $15. If you would otherwise buy a $2 bottle of water three times a week, it pays for itself in less than three weeks.",
    LOGOS,
    "The argument uses numbers and reasoning. Appeals to logic and evidence are logos.",
  ),
  appeal(
    "In a district report, schools that added a second recess saw 15% fewer classroom behaviour problems. Adding a second recess here could have a similar effect.",
    LOGOS,
    "A statistic plus reasoning is an appeal to logic: logos.",
  ),
  {
    level: 1,
    prompt: "Which appeal relies mostly on facts, statistics and reasoning?",
    right: LOGOS,
    wrong: [ETHOS, PATHOS],
    hint: "Logos is related to the word “logic.”",
  },
  {
    level: 1,
    prompt: "A speaker mentions years of coaching experience so the audience will trust their advice. Which appeal is this?",
    right: ETHOS,
    wrong: [PATHOS, LOGOS],
    hint: "Ethos is about the speaker's character and credibility: why should we trust them?",
  },
  {
    level: 1,
    prompt: "Which appeal tries to make the audience feel strong emotions, like sympathy or excitement?",
    right: PATHOS,
    wrong: [ETHOS, LOGOS],
    hint: "Pathos is related to words like “sympathy” and “empathy”: it targets feelings.",
  },
  fallacy(
    2,
    "Everyone in our grade already has the new game. You should get it too.",
    BANDWAGON,
    [FALSE_CAUSE, AD_HOMINEM, SLIPPERY],
    "“Everyone has it” isn't a reason it's good. Telling people to join the crowd is the bandwagon fallacy.",
  ),
  fallacy(
    2,
    "Millions of people use this app, so it must be the best one.",
    BANDWAGON,
    [FALSE_CAUSE, AD_HOMINEM, EITHER_OR],
    "Being popular doesn't make something the best. Arguing from popularity is the bandwagon fallacy.",
  ),
  fallacy(
    2,
    "I wore my blue socks and our team won. The socks must be lucky.",
    FALSE_CAUSE,
    [BANDWAGON, AD_HOMINEM, EITHER_OR],
    "Just because one thing happened before another doesn't mean it caused it. That's a false cause.",
  ),
  fallacy(
    2,
    "Ever since the new principal arrived, it has rained more often. The principal must be bringing bad weather.",
    FALSE_CAUSE,
    [BANDWAGON, AD_HOMINEM, SLIPPERY],
    "Two things happening at the same time doesn't prove one caused the other. That's a false cause.",
  ),
  fallacy(
    2,
    "Why should we listen to Ravi's idea for the fundraiser? He can't even keep his locker tidy.",
    AD_HOMINEM,
    [BANDWAGON, FALSE_CAUSE, SLIPPERY],
    "The argument attacks Ravi instead of his idea. That's ad hominem (Latin for “to the person”).",
  ),
  fallacy(
    2,
    "You're either with us on the new uniform plan, or you don't care about the school at all.",
    EITHER_OR,
    [BANDWAGON, FALSE_CAUSE, HASTY],
    "It pretends there are only two options when there are many more. That's a false dilemma.",
  ),
  {
    level: 2,
    prompt: "Which persuasive technique is used here?",
    visual: excerpt("Do we really want our children breathing dirty air every day?"),
    right: "Rhetorical question",
    wrong: ["Statistic", "Expert opinion", "Personal anecdote"],
    hint: "The speaker doesn't expect an answer; the answer is obvious. That's a rhetorical question.",
  },
  {
    level: 2,
    prompt: "Which persuasive technique is used here?",
    visual: excerpt("We will learn. We will grow. We will succeed together."),
    right: "Repetition",
    wrong: ["Statistic", "Expert opinion", "Counterargument"],
    hint: "Notice “We will” three times. Repeating words makes an idea memorable and powerful.",
  },
  {
    level: 2,
    prompt: "Which sentence is a claim, not evidence?",
    right: "Our city should build more bike lanes.",
    wrong: [
      "A survey found that 62% of residents would bike more if lanes were safer.",
      "The city's two bike lanes each carry about 800 riders a day.",
      "Bike traffic on Elm Street doubled after a lane was added.",
    ],
    hint: "A claim is the opinion being argued (often with “should”). Evidence is facts or data that support it.",
  },
  fallacy(
    3,
    "If we let students use phones at lunch, next they'll use them in class, then during tests, and soon no one will learn anything.",
    SLIPPERY,
    [BANDWAGON, AD_HOMINEM, HASTY],
    "One small step is said to lead to a chain of worse and worse results, with no proof. That's a slippery slope.",
  ),
  fallacy(
    3,
    "I tried one vegetable I didn't like, so all vegetables must taste bad.",
    HASTY,
    [BANDWAGON, AD_HOMINEM, EITHER_OR],
    "One example is too few to judge every vegetable. A big conclusion from too little evidence is a hasty generalization.",
  ),
  fallacy(
    3,
    "The first two books I read in that series were boring, so the whole series must be boring.",
    HASTY,
    [BANDWAGON, FALSE_CAUSE, SLIPPERY],
    "Two books aren't enough to judge a whole series. That's a hasty generalization.",
  ),
  fallacy(
    3,
    "We can either ban all snacks from the school or accept that students will never eat healthy food.",
    EITHER_OR,
    [BANDWAGON, AD_HOMINEM, HASTY],
    "Are those really the only two choices? Ignoring the middle options is a false dilemma.",
  ),
  {
    level: 3,
    prompt: "Which evidence best supports the claim “Our school should start a composting program”?",
    right: "A waste audit found that food scraps make up about a third of the school's garbage.",
    wrong: [
      "Lots of cool schools are doing composting these days.",
      "Our principal really enjoys gardening.",
      "If we don't compost, the whole planet will be ruined by next year.",
    ],
    hint: "Strong evidence is specific and relevant. Watch for bandwagon appeals and exaggeration.",
  },
  {
    level: 3,
    prompt: "You're writing an essay arguing for a longer lunch break. Which counterclaim is most important to address?",
    right: "A longer lunch might make the school day end later.",
    wrong: [
      "Lunch is a meal eaten in the middle of the day.",
      "Some students prefer sandwiches to soup.",
      "Lunch breaks have existed for a long time.",
    ],
    hint: "A counterclaim is a real reason someone might disagree with you. Which choice is an actual objection?",
  },
  {
    level: 3,
    prompt: "Which sentence best rebuts the counterclaim “School uniforms cost families too much money”?",
    right: "The school could run a free uniform swap so families pay little or nothing.",
    wrong: [
      "Uniforms come in many different colours.",
      "Some people really like uniforms.",
      "Uniforms are worn at many schools around the world.",
    ],
    hint: "A rebuttal answers the specific concern. The concern here is cost.",
  },
  {
    level: 3,
    prompt: "Which sentence uses loaded language to persuade?",
    right: "The greedy developers want to bulldoze our beloved forest.",
    wrong: [
      "The developers plan to clear 3 hectares of forest.",
      "The town council will vote on the plan in May.",
      "The forest covers about 12 hectares.",
    ],
    hint: "Loaded language uses emotional words (like “greedy” and “beloved”) to push readers to feel a certain way.",
  },
  {
    level: 3,
    prompt: "This argument goes in a circle: “Homework is bad because it is bad for students.” Which revision gives an actual reason?",
    right: "Homework is less useful when it cuts into sleep, which students need to focus and remember what they learn.",
    wrong: [
      "Homework is bad because it is really, really bad.",
      "Homework is bad, and everyone knows it.",
      "Homework is bad because I said so.",
    ],
    hint: "A real reason explains WHY. Repeating the claim louder, or saying everyone agrees, isn't a reason.",
  },
];

function persuasion(opts?: GenerateOptions): Question[] {
  return choose(PERSUASION, levelOf(opts), 8).map(ask);
}

// ---------- Source Check ----------

const SOURCES: Item[] = [
  {
    level: 1,
    prompt: "You're writing a report on how bees make honey. Which source is most likely to be credible?",
    right: "An article from a university's biology department",
    wrong: [
      "A comment under an online video",
      "An advertisement for a honey brand",
      "A post from a stranger on social media",
    ],
    hint: "Credible sources come from experts who have no reason to mislead you.",
  },
  {
    level: 1,
    prompt: "Which statement is a fact?",
    right: "Honeybees have six legs.",
    wrong: ["Bees are the most interesting insects.", "Honey tastes better than jam.", "Everyone should keep bees."],
    hint: "A fact can be checked and proven. Opinions use words like “most interesting,” “better” or “should.”",
  },
  {
    level: 1,
    prompt: "Which statement is an opinion?",
    right: "Hiking is the most relaxing way to spend a weekend.",
    wrong: ["The trail is 6 kilometres long.", "The park opens at 8 a.m.", "The trail climbs about 300 metres."],
    hint: "An opinion is a belief or feeling that can't be proven. Which one could people reasonably disagree about?",
  },
  {
    level: 1,
    prompt: "What is plagiarism?",
    right: "Presenting someone else's words or ideas as your own",
    wrong: [
      "Quoting a source and citing it",
      "Summarizing a source and giving credit",
      "Using a dictionary to check spelling",
    ],
    hint: "Plagiarism is about taking credit for work that isn't yours.",
  },
  {
    level: 1,
    prompt: "Which is a primary source about school life in the 1920s?",
    right: "A diary written by a student in 1925",
    wrong: [
      "A textbook chapter written in 2015",
      "An encyclopedia article about the 1920s",
      "A recent movie set in the 1920s",
    ],
    hint: "A primary source was created by someone who was there, at the time.",
  },
  {
    level: 1,
    prompt: "Why do writers cite their sources?",
    right: "To give credit and let readers check the information",
    wrong: ["To make the writing longer", "To prove they used the internet", "To avoid writing a conclusion"],
    hint: "Citing shows where ideas came from, so others can find and check them.",
  },
  {
    level: 1,
    prompt: "You find a surprising claim on one website. What is the best next step?",
    right: "Check whether other reliable sources say the same thing",
    wrong: [
      "Share it with friends right away",
      "Believe it because it's online",
      "Use it only if it has bright pictures",
    ],
    hint: "Good researchers cross-check: if a claim is true, other trustworthy sources should confirm it.",
  },
  {
    level: 2,
    prompt: "You're researching the latest advice on bike helmet safety. Which detail makes a source less useful for this topic?",
    right: "It was published 25 years ago.",
    wrong: [
      "It names the author and their expertise.",
      "It lists the sources it used.",
      "It comes from a recognized safety organization.",
    ],
    hint: "For “latest advice,” how recent the source is matters a lot.",
  },
  {
    level: 2,
    prompt: "A website claiming that sugary drinks are healthy is paid for by a soft drink company. What is the biggest concern?",
    right: "The source may be biased because it profits from the claim.",
    wrong: [
      "The website is probably too old.",
      "The website uses too many photos.",
      "The author isn't famous enough.",
    ],
    hint: "Ask: who benefits if readers believe this? A source that profits from a claim may be biased.",
  },
  {
    level: 2,
    prompt: "Which detail is NOT usually part of a citation for a book?",
    right: "The colour of the cover",
    wrong: ["The author's name", "The title", "The year it was published"],
    hint: "A citation includes what someone needs to find the exact source: who, what, when and where.",
  },
  {
    level: 2,
    prompt: "When you use an author's exact words in your report, what must you do?",
    right: "Put them in quotation marks and cite the source",
    wrong: [
      "Change a few words so they look like yours",
      "Put them in bold letters",
      "Nothing, as long as the passage is short",
    ],
    hint: "Exact words always need quotation marks AND credit, no matter how short.",
  },
  {
    level: 2,
    prompt: "An article praising a new running shoe was written by the company that makes it. What is its main purpose most likely?",
    right: "To persuade readers to buy the shoe",
    wrong: [
      "To compare all running shoes fairly",
      "To tell an entertaining story",
      "To explain the history of running",
    ],
    hint: "Think about what the company wants readers to do after reading.",
  },
  {
    level: 2,
    prompt: "Which is a secondary source?",
    right: "A magazine article that summarizes several scientists' studies",
    wrong: [
      "A photo taken at the event",
      "A letter written by someone who was there",
      "A recorded interview with an eyewitness",
    ],
    hint: "A secondary source describes or explains information that others gathered first-hand.",
  },
  {
    level: 2,
    prompt: "Which sentence from a news story shows bias?",
    right: "The reckless council wasted money on a useless new park.",
    wrong: [
      "The council approved $2 million for a new park.",
      "Construction on the park will begin in May.",
      "The park will include a playground and a garden.",
    ],
    hint: "Biased writing uses judging words like “reckless” and “useless” instead of just reporting.",
  },
  {
    level: 3,
    prompt: "Which is the best paraphrase, with credit given?",
    visual: excerpt("Original: “Many monarch butterflies travel thousands of kilometres each fall to spend the winter in Mexico.” (Rivera, 2020)"),
    right: "Each autumn, many monarchs fly thousands of kilometres to reach their winter home in Mexico (Rivera, 2020).",
    wrong: [
      "Many monarch butterflies travel thousands of kilometres each fall to spend the winter in Mexico.",
      "Many monarch butterflies travel thousands of kilometres each fall to spend the winter in Mexico (Rivera, 2020).",
      "Monarchs stay in Canada all winter long (Rivera, 2020).",
    ],
    hint: "A paraphrase uses your own words, keeps the meaning and still gives credit. Copying exact words without quotation marks is plagiarism, even with a citation.",
  },
  {
    level: 3,
    prompt: "Which of these usually would NOT need a citation in a school report, because it's common knowledge?",
    right: "Canada has ten provinces and three territories.",
    wrong: [
      "The results of a recent student survey",
      "A scientist's estimate of how many bee species exist",
      "A statistic from a government report on reading",
    ],
    hint: "Common knowledge is widely known and easy to find in many places. Specific data and someone's estimate need credit.",
  },
  {
    level: 3,
    prompt: "Which question is LEAST helpful when judging whether a website is credible?",
    right: "Is the website's design colourful?",
    wrong: [
      "Who wrote it, and what are their qualifications?",
      "When was it published or last updated?",
      "Does it cite sources that I can check?",
    ],
    hint: "Credibility is about who, when and what evidence, not how the page looks.",
  },
  {
    level: 3,
    prompt: "A blog post says, “Studies show this game improves memory,” but doesn't name any studies. What is the best response?",
    right: "Look for the actual studies before trusting the claim.",
    wrong: [
      "Trust it, since it mentions studies.",
      "Share it, because memory is important.",
      "Ignore all research about games forever.",
    ],
    hint: "“Studies show” means little if you can't check the studies yourself.",
  },
  {
    level: 3,
    prompt:
      "Two articles describe the same council meeting. One uses words like “heroic” and “disastrous”; the other just reports the votes. Which is more likely to be objective?",
    right: "The article that just reports the votes",
    wrong: ["The article that uses “heroic” and “disastrous”", "Both are equally objective", "Neither one can ever be checked"],
    hint: "Objective writing sticks to facts. Strong emotional words are a sign of opinion or bias.",
  },
  {
    level: 3,
    prompt: "What can a website's “About Us” page help you figure out?",
    right: "Who runs the site and what its purpose might be",
    wrong: ["How many people visited today", "Whether your report is finished", "What mark you will get"],
    hint: "Knowing who is behind a source helps you judge its purpose and possible bias.",
  },
  {
    level: 3,
    prompt: "Amir copies a paragraph from a website, changes three words and doesn't cite it. Is this plagiarism?",
    right: "Yes, because the writing and ideas are still mostly someone else's and aren't credited",
    wrong: [
      "No, because he changed some words",
      "No, because websites are free to use",
      "Only if the paragraph is longer than a page",
    ],
    hint: "Swapping a few words doesn't make writing yours. Ideas and wording from a source always need credit.",
  },
];

const FACT_OPINION_SORT: SortSet = {
  prompt: "Sort each statement: fact or opinion?",
  hint: "A fact can be checked and proven. An opinion is what someone thinks or feels, and people can disagree.",
  bins: [
    { id: "fact", label: "Fact", emoji: "📋" },
    { id: "opinion", label: "Opinion", emoji: "💭" },
  ],
  items: [
    { label: "A week has seven days.", emoji: "📅", bin: "fact" },
    { label: "Water freezes at 0°C.", emoji: "🧊", bin: "fact" },
    { label: "Canada has three ocean coastlines.", emoji: "🌊", bin: "fact" },
    { label: "Spiders have eight legs.", emoji: "🕷️", bin: "fact" },
    { label: "The Moon orbits Earth.", emoji: "🌙", bin: "fact" },
    { label: "A metre is 100 centimetres.", emoji: "📏", bin: "fact" },
    { label: "Winter is the best season.", emoji: "❄️", bin: "opinion" },
    { label: "Math is the hardest subject.", emoji: "➗", bin: "opinion" },
    { label: "Cats make better pets than dogs.", emoji: "🐱", bin: "opinion" },
    { label: "Pizza is the tastiest food.", emoji: "🍕", bin: "opinion" },
    { label: "Rainy days are boring.", emoji: "🌧️", bin: "opinion" },
    { label: "Hockey is more exciting than soccer.", emoji: "🏒", bin: "opinion" },
  ],
};

function sources(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle([...choose(SOURCES, level, 7).map(ask), sortQuestion(FACT_OPINION_SORT, 3)]);
}

// ---------- Clauses & Sentences ----------

type SentenceType = "simple" | "compound" | "complex" | "compound-complex";

const TYPE_LABEL: Record<SentenceType, string> = {
  simple: "Simple",
  compound: "Compound",
  complex: "Complex",
  "compound-complex": "Compound-complex",
};

const TYPE_HINT: Record<SentenceType, string> = {
  simple: "Count the clauses. This has just one independent clause (one subject–verb unit that can stand alone).",
  compound: "Two independent clauses joined by a comma and a conjunction (and, but, or, so) or by a semicolon make a compound sentence.",
  complex: "One independent clause plus a dependent clause (starting with a word like because, when, although, if or that) makes a complex sentence.",
  "compound-complex": "Two or more independent clauses plus at least one dependent clause make a compound-complex sentence.",
};

interface Sentence {
  text: string;
  type: SentenceType;
  /** Looks harder than it is (compound subjects, compound verbs, opening phrases). */
  trap?: string;
}

const SENTENCES: Sentence[] = [
  { text: "The library opens early on Saturdays.", type: "simple" },
  { text: "The wind rattled the windows all night.", type: "simple" },
  { text: "Our class planted tomatoes in the school garden.", type: "simple" },
  {
    text: "Maya and her cousin hiked the coastal trail.",
    type: "simple",
    trap: "“Maya and her cousin” is a compound subject doing one action, so there's still only one clause. That makes it simple.",
  },
  {
    text: "After lunch, the class planted tomatoes in the garden.",
    type: "simple",
    trap: "“After lunch” is a phrase, not a clause: it has no subject and verb. There's only one clause, so it's simple.",
  },
  {
    text: "Kenji practised his speech and recorded it on his tablet.",
    type: "simple",
    trap: "One subject (Kenji) with two verbs is a compound predicate, still just one clause. That makes it simple.",
  },
  {
    text: "Before the game, Zoe stretched and drank some water.",
    type: "simple",
    trap: "“Before the game” is a phrase with no verb, and Zoe is the only subject. One clause means simple.",
  },
  { text: "The bus was late, so we walked to school.", type: "compound" },
  { text: "Ravi likes mystery novels, but his sister prefers poetry.", type: "compound" },
  { text: "The lights went out; everyone stayed calm.", type: "compound" },
  { text: "Lena finished her project early, and she helped her friends with theirs.", type: "compound" },
  { text: "We could take the ferry, or we could drive around the lake.", type: "compound" },
  { text: "Because the trail was muddy, we wore our boots.", type: "complex" },
  { text: "The students cheered when the bell rang.", type: "complex" },
  { text: "Although Zoe was nervous, she gave a clear presentation.", type: "complex" },
  { text: "The book that Amir recommended was excellent.", type: "complex" },
  { text: "If it snows tomorrow, the game will be cancelled.", type: "complex" },
  { text: "Leo smiled as he opened the letter.", type: "complex" },
  { text: "When the rain stopped, the kids ran outside, and the dog followed them.", type: "compound-complex" },
  { text: "Priya wanted to join the choir, but she worried that she couldn't sing the high notes.", type: "compound-complex" },
  { text: "Although the movie was long, Noah enjoyed it, and he wants to see it again.", type: "compound-complex" },
  { text: "The team practised every day, so they were ready when the tournament began.", type: "compound-complex" },
  { text: "Ana packed snacks because the trip was long, and Leo brought a map.", type: "compound-complex" },
];

interface ClauseSplit {
  text: string;
  dependent: string;
  /** The independent clause, when it's one unbroken piece of the sentence. */
  independent?: string;
  phrase: string;
}

const CLAUSE_SPLITS: ClauseSplit[] = [
  { text: "Because the trail was muddy, we wore our boots.", dependent: "Because the trail was muddy", independent: "we wore our boots", phrase: "our boots" },
  { text: "The students cheered when the bell rang.", dependent: "when the bell rang", independent: "The students cheered", phrase: "the bell" },
  { text: "Although Zoe was nervous, she gave a clear presentation.", dependent: "Although Zoe was nervous", independent: "she gave a clear presentation", phrase: "a clear presentation" },
  { text: "The book that Amir recommended was excellent.", dependent: "that Amir recommended", phrase: "The book" },
  { text: "If it snows tomorrow, the game will be cancelled.", dependent: "If it snows tomorrow", independent: "the game will be cancelled", phrase: "tomorrow" },
  { text: "Leo smiled as he opened the letter.", dependent: "as he opened the letter", independent: "Leo smiled", phrase: "the letter" },
  { text: "Since the library was closed, Jay studied at home.", dependent: "Since the library was closed", independent: "Jay studied at home", phrase: "at home" },
  { text: "We waited inside until the storm passed.", dependent: "until the storm passed", independent: "We waited inside", phrase: "inside" },
];

const SUBORDINATING = ["because", "although", "unless", "whenever", "while", "if", "since"];
const COORDINATING = ["and", "but", "or", "so", "yet"];

interface Splice {
  splice: string;
  fixes: string[];
  runOn: string;
  misplaced: string;
  fragment: string;
}

const SPLICES: Splice[] = [
  {
    splice: "The movie ended, we walked home.",
    fixes: ["The movie ended, and we walked home.", "The movie ended; we walked home.", "After the movie ended, we walked home."],
    runOn: "The movie ended we walked home.",
    misplaced: "The movie ended and, we walked home.",
    fragment: "After the movie ended.",
  },
  {
    splice: "The power went out, we lit candles.",
    fixes: ["The power went out, so we lit candles.", "The power went out; we lit candles.", "When the power went out, we lit candles."],
    runOn: "The power went out we lit candles.",
    misplaced: "The power went out so, we lit candles.",
    fragment: "When the power went out.",
  },
  {
    splice: "Noah wanted to swim, the pool was closed.",
    fixes: ["Noah wanted to swim, but the pool was closed.", "Noah wanted to swim; the pool was closed.", "Although Noah wanted to swim, the pool was closed."],
    runOn: "Noah wanted to swim the pool was closed.",
    misplaced: "Noah wanted to swim but, the pool was closed.",
    fragment: "Although Noah wanted to swim.",
  },
  {
    splice: "The test was hard, Priya felt prepared.",
    fixes: ["The test was hard, but Priya felt prepared.", "The test was hard; Priya felt prepared.", "Although the test was hard, Priya felt prepared."],
    runOn: "The test was hard Priya felt prepared.",
    misplaced: "The test was hard but, Priya felt prepared.",
    fragment: "Although the test was hard.",
  },
  {
    splice: "It started to hail, the players ran for cover.",
    fixes: ["It started to hail, so the players ran for cover.", "It started to hail; the players ran for cover.", "When it started to hail, the players ran for cover."],
    runOn: "It started to hail the players ran for cover.",
    misplaced: "It started to hail so, the players ran for cover.",
    fragment: "When it started to hail.",
  },
];

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

function classify(s: Sentence, types: SentenceType[]): Question {
  return textChoice(
    "What type of sentence is this?",
    TYPE_LABEL[s.type],
    types.filter((t) => t !== s.type).map((t) => TYPE_LABEL[t]),
    s.trap ?? TYPE_HINT[s.type],
    line(s.text),
  );
}

function dependentClauseQ(c: ClauseSplit): Question {
  return textChoice(
    "Which part of this sentence is the dependent clause?",
    c.dependent,
    [c.independent ?? "was excellent", c.phrase],
    "A dependent clause has a subject and a verb but can't stand alone. It usually starts with a word like because, when, if, although or that.",
    line(c.text),
  );
}

function independentClauseQ(c: ClauseSplit): Question {
  return textChoice(
    "Which part of this sentence is the independent clause?",
    c.independent ?? "",
    [c.dependent, c.phrase],
    "An independent clause has a subject and a verb and makes sense on its own as a sentence.",
    line(c.text),
  );
}

function conjunctionQ(): Question {
  return textChoice(
    "Which word is a subordinating conjunction?",
    pick(SUBORDINATING),
    sample(COORDINATING, 3),
    "Subordinating conjunctions (because, although, if, while…) begin dependent clauses. And, but, or, so and yet are coordinating conjunctions.",
  );
}

function fragmentQ(): Question {
  const c = pick(CLAUSE_SPLITS.filter((x) => x.independent));
  const others = sample(
    SENTENCES.filter((s) => !s.trap && s.type !== "compound-complex"),
    3,
  ).map((s) => s.text);
  return textChoice(
    "Which of these is a sentence fragment?",
    `${capitalize(c.dependent)}.`,
    others,
    "A fragment is missing part of a complete thought. A dependent clause on its own (like “When the bell rang.”) leaves the reader asking “…then what?”",
  );
}

function spliceQ(): Question {
  const s = pick(SPLICES);
  return textChoice(
    "Which sentence is a comma splice?",
    s.splice,
    s.fixes,
    "A comma splice joins two complete sentences with only a comma. Look for a comma with no joining word after it.",
  );
}

function runOnQ(): Question {
  const s = pick(SPLICES);
  return textChoice(
    "Which revision correctly fixes this run-on sentence?",
    pick(s.fixes),
    [s.splice, s.misplaced, s.fragment],
    "Fix a run-on with a comma plus a joining word (and, but, so), a semicolon, or by making one part a dependent clause. A comma alone isn't enough.",
    line(s.runOn),
  );
}

function compoundComplexQ(): Question {
  const pickType = (t: SentenceType) => pick(SENTENCES.filter((s) => s.type === t && !s.trap)).text;
  return textChoice(
    "Which sentence is compound-complex?",
    pickType("compound-complex"),
    [pickType("simple"), pickType("compound"), pickType("complex")],
    TYPE_HINT["compound-complex"],
  );
}

function sentenceTypes(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const splits = shuffle(CLAUSE_SPLITS.filter((c) => c.independent));
  if (level === 1) {
    const types: SentenceType[] = ["simple", "compound", "complex"];
    const pool = SENTENCES.filter((s) => !s.trap && types.includes(s.type));
    return shuffle([
      ...sample(pool, 4).map((s) => classify(s, types)),
      conjunctionQ(),
      dependentClauseQ(splits[0]),
      independentClauseQ(splits[1]),
      fragmentQ(),
    ]);
  }
  const all: SentenceType[] = ["simple", "compound", "complex", "compound-complex"];
  if (level === 2) {
    const pool = SENTENCES.filter((s) => !s.trap);
    return shuffle([
      ...sample(pool, 4).map((s) => classify(s, all)),
      dependentClauseQ(pick(CLAUSE_SPLITS)),
      independentClauseQ(splits[0]),
      chance(0.5) ? fragmentQ() : conjunctionQ(),
      spliceQ(),
    ]);
  }
  const tricky = SENTENCES.filter((s) => s.trap || s.type === "compound-complex" || s.type === "complex");
  return shuffle([
    ...sample(tricky, 4).map((s) => classify(s, all)),
    compoundComplexQ(),
    dependentClauseQ(pick(CLAUSE_SPLITS)),
    spliceQ(),
    runOnQ(),
  ]);
}

// ---------- Modifiers & Parallelism ----------

const MODIFIERS: Item[] = [
  {
    level: 1,
    prompt: "What is a modifier?",
    right: "A word or phrase that describes another part of the sentence",
    wrong: ["A word that joins two sentences", "A punctuation mark", "The main verb of a sentence"],
    hint: "Modifiers modify (change or add detail to) other words, like adjectives and describing phrases.",
  },
  {
    level: 1,
    prompt: "Who or what does “Exhausted after the long hike” describe?",
    visual: line("Exhausted after the long hike, the campers fell asleep quickly."),
    right: "the campers",
    wrong: ["the long hike", "asleep", "quickly"],
    hint: "An opening describing phrase should describe the noun that comes right after the comma.",
  },
  {
    level: 1,
    prompt: "Who or what does “Covered in frosting” describe?",
    visual: line("Covered in frosting, the birthday cake sat on the counter."),
    right: "the birthday cake",
    wrong: ["the counter", "sat"],
    hint: "Look right after the comma. What is covered in frosting?",
  },
  {
    level: 1,
    prompt: "Which sentence has a misplaced modifier?",
    right: "Ana found a gold ring walking along the beach.",
    wrong: [
      "Walking along the beach, Ana found a gold ring.",
      "Ana found a gold ring while she was walking along the beach.",
      "While walking along the beach, Ana found a gold ring.",
    ],
    hint: "Read each sentence literally. In one of them, it sounds like the ring was out for a walk!",
  },
  {
    level: 1,
    prompt: "Which sentence uses parallel structure?",
    right: "At camp, we swam, hiked and canoed.",
    wrong: [
      "At camp, we swam, hiked and went canoeing.",
      "At camp, we swam, were hiking and canoed.",
      "At camp, we went swimming, hiked and to canoe.",
    ],
    hint: "In a parallel list, every item has the same form. Look for three verbs that match.",
  },
  {
    level: 1,
    prompt: "What does parallel structure mean?",
    right: "Using the same grammatical form for items in a list or pair",
    wrong: [
      "Writing two sentences that mean the same thing",
      "Putting every sentence in the past tense",
      "Starting each paragraph with the same word",
    ],
    hint: "Think of parallel lines: they run side by side, matching. Items in a list should match in form, like running, jumping and swimming.",
  },
  {
    level: 2,
    prompt: "Which revision fixes the misplaced modifier?",
    visual: line("We saw a moose driving to the cabin."),
    right: "While driving to the cabin, we saw a moose.",
    wrong: [
      "We saw a moose that was driving to the cabin.",
      "Driving to the cabin, a moose was seen.",
      "A moose driving to the cabin was seen by us.",
    ],
    hint: "The moose wasn't driving! Put the modifier next to the people who were driving: we.",
  },
  {
    level: 2,
    prompt: "Which revision fixes the misplaced modifier?",
    visual: line("Leo bought a bike from a neighbour with a squeaky bell."),
    right: "Leo bought a bike with a squeaky bell from a neighbour.",
    wrong: [
      "With a squeaky bell, Leo bought a bike from a neighbour.",
      "Leo, with a squeaky bell, bought a bike from a neighbour.",
    ],
    hint: "Does the neighbour have the squeaky bell, or the bike? Move the modifier next to the word it describes.",
  },
  {
    level: 2,
    prompt: "Which revision fixes the misplaced modifier?",
    visual: line("Jay put the cake on the table that he baked."),
    right: "Jay put the cake that he baked on the table.",
    wrong: ["Jay put the cake on the table, that he baked.", "That he baked, Jay put the cake on the table."],
    hint: "Jay baked the cake, not the table. Place “that he baked” right after “cake.”",
  },
  {
    level: 2,
    prompt: "Which sentence has a dangling modifier?",
    right: "Walking into the gym, the noise was deafening.",
    wrong: [
      "Walking into the gym, we heard deafening noise.",
      "As we walked into the gym, the noise was deafening.",
      "The noise was deafening as we walked into the gym.",
    ],
    hint: "A dangling modifier has nobody in the sentence to describe. Who is “walking into the gym”? Not the noise!",
  },
  {
    level: 2,
    prompt: "Which revision fixes the dangling modifier?",
    visual: line("After finishing the homework, the TV was turned on."),
    right: "After finishing her homework, Zoe turned on the TV.",
    wrong: [
      "After finishing the homework, the TV was on.",
      "The TV was turned on after finishing the homework.",
      "After finishing, the homework turned on the TV.",
    ],
    hint: "Someone finished the homework, but that person is missing. The fix names who did it, right after the comma.",
  },
  {
    level: 2,
    prompt: "Which revision makes the sentence parallel?",
    visual: line("Zoe would rather read a book than watching TV."),
    right: "Zoe would rather read a book than watch TV.",
    wrong: ["Zoe would rather reading a book than watch TV.", "Zoe would rather read a book than to watching TV."],
    hint: "Both sides of “than” should match: read… watch.",
  },
  {
    level: 2,
    prompt: "Which revision makes the sentence parallel?",
    visual: line("The coach told us to stretch, to drink water and that we should rest."),
    right: "The coach told us to stretch, to drink water and to rest.",
    wrong: [
      "The coach told us stretching, to drink water and that we should rest.",
      "The coach told us to stretch, drinking water and to rest.",
    ],
    hint: "Make every item in the list match: to stretch, to drink, to…",
  },
  {
    level: 2,
    prompt: "Which revision makes the list parallel?",
    visual: line("Our class rules: be kind, listen carefully and homework should be done on time."),
    right: "Our class rules: be kind, listen carefully and finish homework on time.",
    wrong: [
      "Our class rules: being kind, listen carefully and homework on time.",
      "Our class rules: be kind, listening carefully and finishing homework on time.",
    ],
    hint: "The first two rules start with a command verb (be, listen). The third should too.",
  },
  {
    level: 3,
    prompt: "Which revision makes the sentence parallel?",
    visual: line("Ravi is not only a strong swimmer but also runs fast."),
    right: "Ravi is not only a strong swimmer but also a fast runner.",
    wrong: [
      "Ravi is not only a strong swimmer but also running fast.",
      "Ravi is not only strong at swimming but also runs fast.",
    ],
    hint: "What follows “not only” and “but also” should match in form: a strong swimmer… a fast runner.",
  },
  {
    level: 3,
    prompt: "Which revision makes the list parallel?",
    visual: line("The job requires patience, creativity and being on time."),
    right: "The job requires patience, creativity and punctuality.",
    wrong: [
      "The job requires being patient, creativity and punctuality.",
      "The job requires patience, being creative and on time.",
    ],
    hint: "Patience and creativity are nouns. The third item should be a noun too.",
  },
  {
    level: 3,
    prompt: "Which sentence clearly says that Maya ate most, but not all, of the pizza?",
    right: "Maya ate almost the whole pizza.",
    wrong: ["Maya almost ate the whole pizza.", "Almost Maya ate the whole pizza."],
    hint: "Limiting words like “almost” and “only” modify the word right after them. “Almost ate” suggests she nearly ate but didn't.",
  },
  {
    level: 3,
    prompt: "Which sentence means that Kenji was the one person who passed the test?",
    right: "Only Kenji passed the test.",
    wrong: ["Kenji only passed the test.", "Kenji passed only the test.", "Kenji passed the test only."],
    hint: "“Only” limits the word right after it. To say Kenji was the only one, put “only” right before “Kenji.”",
  },
  {
    level: 3,
    prompt: "Which sentence has a dangling modifier?",
    right: "Hoping to win, the practice lasted three hours.",
    wrong: [
      "Hoping to win, the team practised for three hours.",
      "The team practised for three hours because they hoped to win.",
      "Because the team hoped to win, practice lasted three hours.",
    ],
    hint: "Ask who is “hoping to win.” A practice can't hope! The doer is missing from that sentence.",
  },
  {
    level: 3,
    prompt: "Which revision fixes the dangling modifier?",
    visual: line("While brushing my teeth, the doorbell rang."),
    right: "While I was brushing my teeth, the doorbell rang.",
    wrong: [
      "While brushing my teeth, the doorbell was ringing.",
      "The doorbell rang while brushing my teeth.",
      "Brushing my teeth, the doorbell rang loudly.",
    ],
    hint: "The doorbell wasn't brushing teeth. Add who was: “While I was brushing…”",
  },
  {
    level: 3,
    prompt: "Which sentence uses parallel structure?",
    right: "Learning to skate is harder than learning to ski.",
    wrong: [
      "Learning to skate is harder than to ski.",
      "To skate is harder than learning to ski.",
      "Learning to skate is harder than skis.",
    ],
    hint: "Things being compared should match in form: learning to… learning to…",
  },
  {
    level: 3,
    prompt: "Which revision makes the sentence parallel?",
    visual: line("You can either take the bus or you can be walking."),
    right: "You can either take the bus or walk.",
    wrong: ["You can either take the bus or walking.", "You can either be taking the bus or walk."],
    hint: "What follows “either” and “or” should match: take… walk.",
  },
];

const HOBBIES: { name: string; verb: string; pronoun: string; acts: [string, string][] }[] = [
  { name: "Lena", verb: "likes", pronoun: "she", acts: [["hiking", "to hike"], ["swimming", "to swim"], ["biking", "to bike"]] },
  { name: "Amir", verb: "loves", pronoun: "he", acts: [["drawing", "to draw"], ["painting", "to paint"], ["building models", "to build models"]] },
  { name: "Noah", verb: "likes", pronoun: "he", acts: [["reading", "to read"], ["writing stories", "to write stories"], ["playing chess", "to play chess"]] },
  { name: "Ana", verb: "loves", pronoun: "she", acts: [["dancing", "to dance"], ["singing", "to sing"], ["playing the drums", "to play the drums"]] },
  { name: "Kenji", verb: "likes", pronoun: "he", acts: [["cooking", "to cook"], ["baking bread", "to bake bread"], ["trying new recipes", "to try new recipes"]] },
];

function parallelList(): Question {
  const h = pick(HOBBIES);
  const [a, b, c] = h.acts;
  const say = (x: string, y: string, z: string) => `${h.name} ${h.verb} ${x}, ${y} and ${z}.`;
  return textChoice(
    "Which sentence uses parallel structure?",
    say(a[0], b[0], c[0]),
    [say(a[0], b[0], c[1]), say(a[1], b[0], c[0]), say(a[0], b[1], c[0])],
    "Items in a list should share the same form. Find the sentence where all three activities are -ing words.",
  );
}

function modifiers(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  if (level === 3) return choose(MODIFIERS, level, 8).map(ask);
  return shuffle([...choose(MODIFIERS, level, 7).map(ask), parallelList()]);
}

// ---------- Semicolons, Colons & Dashes ----------

const SEMI = "; (semicolon)";
const COLON = ": (colon)";
const COMMA = ", (comma)";
const DASH = "— (dash)";
const SEMIS = "; ; (semicolons)";
const COLONS = ": : (colons)";
const COMMAS = ", , (commas)";
const DASHES = "— — (a pair of dashes)";
const MARK_PROMPT = "Which punctuation mark belongs in the blank?";
const MARKS_PROMPT = "Which punctuation belongs in both blanks?";

function blank(level: Level, text: string, right: string, wrong: string[], hint: string): Item {
  return { level, prompt: text.split("___").length > 2 ? MARKS_PROMPT : MARK_PROMPT, visual: line(text), right, wrong, hint };
}

const SEMICOLON_JOIN = "Two complete sentences that are closely related can be joined with a semicolon. A comma alone would make a comma splice.";
const COLON_LIST = "A colon can introduce a list, but only after a complete sentence.";

const PUNCTUATION: Item[] = [
  blank(1, "Priya loves mystery novels ___ her brother prefers comics.", SEMI, [COMMA, COLON], SEMICOLON_JOIN),
  blank(1, "Zoe wanted to go skating ___ the rink was closed for repairs.", SEMI, [COMMA, COLON], SEMICOLON_JOIN),
  blank(1, "Pack three things for the hike ___ water, a map and a jacket.", COLON, [SEMI, COMMA], COLON_LIST),
  blank(1, "The recipe needs only four ingredients ___ flour, eggs, milk and butter.", COLON, [SEMI, COMMA], COLON_LIST),
  blank(1, "The bus leaves at 7___45 a.m.", COLON, [SEMI, COMMA], "When writing the time, a colon separates the hours from the minutes."),
  {
    level: 1,
    prompt: "Which sentence uses a semicolon correctly?",
    right: "The library was quiet; everyone was reading.",
    wrong: [
      "The library was quiet; because everyone was reading.",
      "The library; was quiet and calm.",
      "We need three books; a novel, a dictionary and an atlas.",
    ],
    hint: "A semicolon joins two complete sentences. Check: could the words on each side stand alone?",
  },
  {
    level: 1,
    prompt: "Which sentence uses a colon correctly?",
    right: "We saw three animals: a deer, a fox and an owl.",
    wrong: [
      "We saw: a deer, a fox and an owl.",
      "We saw three animals; a deer, a fox and an owl.",
      "We saw three animals, a deer: a fox and an owl.",
    ],
    hint: COLON_LIST + " “We saw” isn't complete on its own; “We saw three animals” is.",
  },
  {
    level: 1,
    prompt: "Which sentence correctly joins two complete thoughts?",
    right: "It was raining; we stayed inside.",
    wrong: ["It was raining, we stayed inside.", "It was raining we stayed inside.", "It was; raining we stayed inside."],
    hint: SEMICOLON_JOIN,
  },
  blank(
    2,
    "The trail was icy ___ however, we reached the top.",
    SEMI,
    [COMMA, COLON],
    "Use a semicolon before a linking word like however or therefore when it joins two complete sentences.",
  ),
  blank(
    2,
    "Ravi studied for hours ___ as a result, he aced the quiz.",
    SEMI,
    [COMMA, COLON],
    "“As a result” links two complete sentences, so a semicolon goes before it. A comma alone would make a comma splice.",
  ),
  blank(
    2,
    "My brother ___ who never eats vegetables ___ asked for more salad.",
    DASHES,
    [SEMIS, COLONS],
    "A pair of dashes can set off an interruption in the middle of a sentence. Semicolons and colons can't do that job.",
  ),
  blank(
    2,
    "The answer ___ believe it or not ___ was hidden on the first page.",
    DASHES,
    [SEMIS, COLONS],
    "“Believe it or not” interrupts the sentence. Dashes set off interruptions.",
  ),
  blank(
    2,
    "I opened the gift box and found ___ nothing at all.",
    DASH,
    [SEMI, COMMA],
    "A dash creates a dramatic pause before a surprise.",
  ),
  {
    level: 2,
    prompt: "Which sentence uses a colon correctly?",
    right: "Bring these supplies: a pencil, an eraser and a ruler.",
    wrong: [
      "My favourite sports are: hockey, soccer and tennis.",
      "Bring these supplies; a pencil, an eraser and a ruler.",
      "Because it rained: we stayed inside.",
    ],
    hint: "A colon must come after a complete sentence. “My favourite sports are” can't stand alone.",
  },
  {
    level: 2,
    prompt: "Which sentence uses dashes correctly?",
    right: "The prize—a brand-new telescope—went to Ana.",
    wrong: [
      "The prize; a brand-new telescope; went to Ana.",
      "The prize: a brand-new telescope: went to Ana.",
      "The prize—a brand-new telescope went—to Ana.",
    ],
    hint: "Dashes go around the extra information. Read the sentence without it: “The prize went to Ana.”",
  },
  {
    level: 2,
    prompt: "Why is a colon used in this sentence?",
    visual: line("Leo had one goal for the summer: to learn to juggle."),
    right: "To introduce an explanation of what came before",
    wrong: ["To join two equal complete sentences", "To set off an interruption", "To show a time of day"],
    hint: "What comes after the colon tells us exactly what the goal was.",
  },
  blank(
    3,
    "The club meets on Monday, May 5 ___ Tuesday, June 10 ___ and Friday, July 4.",
    SEMIS,
    [COMMAS, COLONS],
    "When items in a list already contain commas, use semicolons between the items so readers can tell where each one ends.",
  ),
  blank(
    3,
    "Three friends ___ Amir, Lena and Noah ___ volunteered to clean up.",
    DASHES,
    [SEMIS, COLONS],
    "Dashes can set off a list in the middle of a sentence, especially when the list has its own commas.",
  ),
  blank(
    3,
    "We thanked three people: Ms. Lee, the coach ___ Mr. Diaz, the librarian ___ and Ms. Park, the principal.",
    SEMIS,
    [COMMAS, COLONS],
    "Each item already has a comma inside it (name, job). Semicolons separate items like these.",
  ),
  {
    level: 3,
    prompt: "Why are semicolons used in this sentence?",
    visual: line("We visited Halifax, Nova Scotia; Regina, Saskatchewan; and Victoria, British Columbia."),
    right: "To separate list items that already contain commas",
    wrong: ["To introduce a list", "To show a sudden break in thought", "To join two dependent clauses"],
    hint: "Each place name has a comma inside it. What would happen if commas separated the items too?",
  },
  {
    level: 3,
    prompt: "Which sentence is punctuated correctly?",
    right: "Kenji had a plan; unfortunately, it didn't work.",
    wrong: [
      "Kenji had a plan, unfortunately, it didn't work.",
      "Kenji had a plan; unfortunately it, didn't work.",
      "Kenji had a plan: unfortunately; it didn't work.",
    ],
    hint: "Two complete sentences joined by a linking word: semicolon before it, comma after it.",
  },
  {
    level: 3,
    prompt: "Which sentence uses a colon correctly?",
    right: "There's only one thing left to do: celebrate!",
    wrong: [
      "The things left to do are: clean and celebrate.",
      "We need to: clean up and celebrate.",
      "Since we won: let's celebrate!",
    ],
    hint: "The words before a colon must form a complete sentence. Check each one by stopping at the colon.",
  },
  {
    level: 3,
    prompt: "What does the dash do in this sentence?",
    visual: line("After three hours of searching, we found the keys—in my own coat pocket."),
    right: "It creates a pause before a surprising detail.",
    wrong: ["It introduces a formal list.", "It joins two complete sentences.", "It shows the time of day."],
    hint: "Read it aloud. The dash makes you pause, which sets up the surprise.",
  },
];

function punctuation(opts?: GenerateOptions): Question[] {
  return choose(PUNCTUATION, levelOf(opts), 8).map(ask);
}

// ---------- Word Mix-Ups ----------

type WordGroup =
  | "its"
  | "their"
  | "your"
  | "than"
  | "lose"
  | "whose"
  | "affect"
  | "accept"
  | "principal"
  | "compliment"
  | "fewer";

const GROUP_HINT: Record<WordGroup, string> = {
  its: "It's = it is (or it has). Its shows ownership, like his or her. Try saying “it is” in the blank.",
  their: "They're = they are. Their shows ownership. There points to a place, or starts “there is” or “there are.”",
  your: "You're = you are. Your shows ownership. Try saying “you are” in the blank.",
  than: "Than compares (taller than). Then is about time or order (first… then…).",
  lose: "Lose (one o) means to misplace or not win. Loose (two o's) means not tight.",
  whose: "Who's = who is (or who has). Whose asks or tells who owns something.",
  affect: "Affect is usually a verb (to influence). Effect is usually a noun (a result). Tip: the effect is the end result.",
  accept: "Accept means to receive or agree to. Except means “not including.”",
  principal: "A principal is a school leader, or something main. A principle is a rule or belief.",
  compliment: "A compliment is a kind remark. A complement completes something or goes well with it.",
  fewer: "Use fewer for things you can count (people, books). Use less for amounts you can't count (juice, time).",
};

interface WordItem {
  level: Level;
  group: WordGroup;
  text: string;
  right: string;
  wrong: string[];
}

const w = (level: Level, group: WordGroup, text: string, right: string, wrong: string[]): WordItem => ({ level, group, text, right, wrong });

const WORD_ITEMS: WordItem[] = [
  w(1, "its", "The cat curled up in ___ basket.", "its", ["it's"]),
  w(1, "its", "I think ___ too cold to swim today.", "it's", ["its"]),
  w(1, "its", "The tree dropped all of ___ leaves.", "its", ["it's"]),
  w(1, "its", "Let me know when ___ your turn.", "it's", ["its"]),
  w(1, "their", "The twins said ___ bringing snacks to the party.", "they're", ["their", "there"]),
  w(1, "their", "Please put the boxes over ___.", "there", ["their", "they're"]),
  w(1, "their", "The students finished ___ projects early.", "their", ["there", "they're"]),
  w(1, "their", "I hope ___ is enough pizza for everyone.", "there", ["their", "they're"]),
  w(1, "their", "Ask Ana and Leo if ___ coming with us.", "they're", ["their", "there"]),
  w(1, "your", "Don't forget ___ water bottle.", "your", ["you're"]),
  w(1, "your", "Tell me when ___ ready to leave.", "you're", ["your"]),
  w(1, "than", "Kenji is taller ___ his older brother.", "than", ["then"]),
  w(1, "than", "First we stretched, and ___ we ran two laps.", "then", ["than"]),
  w(2, "than", "I would rather walk ___ take the bus.", "than", ["then"]),
  w(2, "than", "Finish your homework, and ___ you can play.", "then", ["than"]),
  w(2, "lose", "Keep your keys in your pocket so you don't ___ them.", "lose", ["loose"]),
  w(2, "lose", "My tooth is so ___ that it wiggles when I talk.", "loose", ["lose"]),
  w(2, "lose", "If we ___ this game, we're out of the tournament.", "lose", ["loose"]),
  w(2, "lose", "These jeans are too ___, so I need a belt.", "loose", ["lose"]),
  w(2, "whose", "Do you know ___ jacket this is?", "whose", ["who's"]),
  w(2, "whose", "I wonder ___ coming to the meeting.", "who's", ["whose"]),
  w(2, "whose", "Zoe is the student ___ painting won first prize.", "whose", ["who's"]),
  w(2, "whose", "Ravi is the one ___ organizing the bake sale.", "who's", ["whose"]),
  w(2, "affect", "Lack of sleep can ___ your mood.", "affect", ["effect"]),
  w(2, "affect", "The new rule had a big ___ on the school.", "effect", ["affect"]),
  w(2, "affect", "How will the rain ___ our plans?", "affect", ["effect"]),
  w(2, "affect", "The music had a calming ___ on the audience.", "effect", ["affect"]),
  w(2, "accept", "Everyone ___ Noah went on the field trip.", "except", ["accept"]),
  w(2, "accept", "Please ___ my apology.", "accept", ["except"]),
  w(3, "accept", "The store will ___ returns until Friday.", "accept", ["except"]),
  w(3, "affect", "The side ___ of the medicine were mild.", "effects", ["affects"]),
  w(3, "principal", "The ___ announced a snow day over the speakers.", "principal", ["principle"]),
  w(3, "principal", "Honesty is an important ___ to live by.", "principle", ["principal"]),
  w(3, "principal", "Saving water was the ___ reason for the new rule.", "principal", ["principle"]),
  w(3, "compliment", "Lena gave Ravi a ___ on his speech.", "compliment", ["complement"]),
  w(3, "compliment", "The red scarf is a perfect ___ to her green coat.", "complement", ["compliment"]),
  w(3, "fewer", "This line has ___ people than that one.", "fewer", ["less"]),
  w(3, "fewer", "I drink ___ juice than I used to.", "less", ["fewer"]),
  w(3, "their", "___ backpacks are over ___ by the door.", "Their … there", ["There … their", "They're … their", "Their … they're"]),
  w(3, "its", "The dog wagged ___ tail because ___ happy to see us.", "its … it's", ["it's … its", "its … its", "it's … it's"]),
  w(3, "your", "If ___ ready, grab ___ coat.", "you're … your", ["your … you're", "your … your", "you're … you're"]),
  w(3, "than", "Leo was taller ___ Ana, but ___ she grew five centimetres.", "than … then", ["then … than", "then … then", "than … than"]),
  w(3, "whose", "___ the person ___ notebook was left behind?", "Who's … whose", ["Whose … who's", "Whose … whose", "Who's … who's"]),
];

const ERROR_ITEMS: Item[] = [
  {
    level: 3,
    prompt: "Which sentence contains a word-choice error?",
    right: "Their going to the library after school.",
    wrong: [
      "They're going to the library after school.",
      "Their library is open after school.",
      "There is a library near the school.",
    ],
    hint: GROUP_HINT.their,
  },
  {
    level: 3,
    prompt: "Which sentence contains a word-choice error?",
    right: "The storm had a huge affect on the town.",
    wrong: ["The storm had a huge effect on the town.", "The storm affected the whole town.", "The town was affected by the storm."],
    hint: GROUP_HINT.affect,
  },
  {
    level: 3,
    prompt: "Which sentence contains a word-choice error?",
    right: "I'd rather read then watch TV.",
    wrong: ["I'd rather read than watch TV.", "We read, and then we watched TV.", "Reading is more fun than watching TV."],
    hint: GROUP_HINT.than,
  },
];

function wordQ(item: WordItem): Question {
  const blanks = item.text.split("___").length - 1;
  return textChoice(
    blanks > 1 ? "Which words complete the sentence, in order?" : "Which word correctly completes the sentence?",
    item.right,
    item.wrong,
    GROUP_HINT[item.group],
    line(item.text.split("___").join("_____")),
  );
}

function wordMixUps(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  if (level < 3) return choose(WORD_ITEMS, level, 8).map(wordQ);
  return shuffle([...choose(WORD_ITEMS, level, 7).map(wordQ), ask(pick(ERROR_ITEMS))]);
}

// ---------- Poetry Lab ----------

interface Poem {
  level: Level;
  title: string;
  stanzas: string[][];
  questions: Omit<Item, "level" | "visual">[];
}

const RHYME_HINT =
  "Look at the last word of each line. Give the first end sound the letter A, the next new sound B, and so on. Lines that rhyme share a letter.";

const POEMS: Poem[] = [
  {
    level: 1,
    title: "The Lost Mitten",
    stanzas: [["I lost a mitten in the snow,", "Just where it went I'll never know.", "Perhaps it warms a squirrel's paw", "Or hides beneath a pile of straw."]],
    questions: [
      { prompt: "What is the rhyme scheme of this poem?", right: "AABB", wrong: ["ABAB", "ABCB", "ABBA"], hint: RHYME_HINT },
      {
        prompt: "How many rhyming couplets does this poem contain?",
        right: "2",
        wrong: ["1", "3", "4"],
        hint: "A couplet is a pair of lines in a row that rhyme. Check lines 1–2, then lines 3–4.",
      },
      {
        prompt: "Which word best describes the tone of this poem?",
        right: "Playful",
        wrong: ["Angry", "Mournful", "Formal"],
        hint: "The speaker imagines a squirrel wearing the mitten. Is that serious or light-hearted?",
      },
      {
        prompt: "This poem is one stanza with four lines. What is a four-line stanza called?",
        right: "Quatrain",
        wrong: ["Couplet", "Tercet", "Sonnet"],
        hint: "Quat- means four, like in “quarter.”",
      },
    ],
  },
  {
    level: 1,
    title: "Harbour Morning",
    stanzas: [["The harbour wakes in silver light,", "The gulls are calling, sharp and loud,", "The fog lets go its hold on night", "And drifts away, a fading cloud."]],
    questions: [
      { prompt: "What is the rhyme scheme of this poem?", right: "ABAB", wrong: ["AABB", "ABCB", "ABBA"], hint: RHYME_HINT },
      {
        prompt: "Which line uses personification?",
        right: "The fog lets go its hold on night",
        wrong: ["The gulls are calling, sharp and loud,", "And drifts away, a fading cloud."],
        hint: "Personification gives human actions to non-human things. Can fog really hold on or let go?",
      },
      {
        prompt: "What time of day does the poem describe?",
        right: "Early morning",
        wrong: ["Midnight", "Late afternoon", "Sunset"],
        hint: "Check the title, and notice that the fog “lets go its hold on night.”",
      },
      {
        prompt: "Which sense does “The gulls are calling, sharp and loud” appeal to?",
        right: "Hearing",
        wrong: ["Taste", "Smell", "Touch"],
        hint: "Calling and loud are both about sound.",
      },
    ],
  },
  {
    level: 1,
    title: "Heron",
    stanzas: [["Cold pond at sunrise—", "one heron, still as a post,", "waits for the ripples"]],
    questions: [
      {
        prompt: "What form of poem is this?",
        right: "Haiku",
        wrong: ["Limerick", "Sonnet", "Ballad"],
        hint: "This short form has three lines of 5, 7 and 5 syllables and often captures a moment in nature.",
      },
      {
        prompt: "How many syllables are in the second line?",
        right: "7",
        wrong: ["5", "6", "8"],
        hint: "Clap it out: one / her / on / still / as / a / post.",
      },
      {
        prompt: "“Still as a post” is an example of which device?",
        right: "Simile",
        wrong: ["Metaphor", "Onomatopoeia", "Hyperbole"],
        hint: "It compares the heron to a post using “as.”",
      },
      {
        prompt: "Which phrase best describes the mood of this poem?",
        right: "Calm and watchful",
        wrong: ["Loud and chaotic", "Angry and bitter", "Silly and goofy"],
        hint: "A cold, quiet pond and a bird standing perfectly still... What feeling does that create?",
      },
    ],
  },
  {
    level: 2,
    title: "Saturday Market",
    stanzas: [["The baker stacks her golden bread,", "The farmer weighs a pear,", "A fiddle's music twirls and spins", "Like ribbons through the air."]],
    questions: [
      { prompt: "What is the rhyme scheme of this poem?", right: "ABCB", wrong: ["AABB", "ABAB", "ABBA"], hint: RHYME_HINT },
      {
        prompt: "Which line contains a simile?",
        right: "Like ribbons through the air.",
        wrong: ["The baker stacks her golden bread,", "The farmer weighs a pear,"],
        hint: "A simile compares using “like” or “as.” Which line has one of those words?",
      },
      {
        prompt: "What is the setting of this poem?",
        right: "A busy market",
        wrong: ["A quiet library", "A snowy forest", "A school gym"],
        hint: "Bakers, farmers and a fiddler... and the title is a big clue.",
      },
      {
        prompt: "Which senses does the poem mainly appeal to?",
        right: "Sight and hearing",
        wrong: ["Taste and smell", "Touch and taste", "Smell and touch"],
        hint: "“Golden bread” is something you see. Fiddle music is something you hear.",
      },
    ],
  },
  {
    level: 2,
    title: "The Library Is an Ocean",
    stanzas: [["The library is an ocean,", "And every shelf a wave;", "I dive in every afternoon", "And surface feeling brave."]],
    questions: [
      { prompt: "What is the rhyme scheme of this poem?", right: "ABCB", wrong: ["AABB", "ABAB", "ABBA"], hint: RHYME_HINT },
      {
        prompt: "What two things does the poem compare?",
        right: "A library and an ocean",
        wrong: ["A shelf and a lunch tray", "A book and a boat", "A reader and a fish"],
        hint: "Look at the very first line.",
      },
      {
        prompt: "What type of comparison is “The library is an ocean”?",
        right: "Metaphor",
        wrong: ["Simile", "Onomatopoeia", "Alliteration"],
        hint: "It says the library IS an ocean, without using “like” or “as.”",
      },
      {
        prompt: "What does the speaker mean by “surface feeling brave”?",
        right: "Reading leaves the speaker feeling stronger and more confident.",
        wrong: [
          "The speaker is learning to swim.",
          "The speaker is scared of the library.",
          "The speaker gets wet after lunch.",
        ],
        hint: "Diving and surfacing are part of the ocean comparison. What is the speaker really doing in the library?",
      },
    ],
  },
  {
    level: 2,
    title: "Pete",
    stanzas: [
      [
        "There once was a puppy named Pete",
        "Who snatched every sock off your feet.",
        "He'd tiptoe and creep",
        "While you were asleep,",
        "Then nap on the pile, looking sweet.",
      ],
    ],
    questions: [
      {
        prompt: "What form of poem is this?",
        right: "Limerick",
        wrong: ["Haiku", "Free verse", "Sonnet"],
        hint: "This is a funny five-line poem where lines 1, 2 and 5 rhyme, and the short lines 3 and 4 rhyme.",
      },
      { prompt: "What is the rhyme scheme of this poem?", right: "AABBA", wrong: ["ABABA", "AAAAA", "ABBAA"], hint: RHYME_HINT },
      {
        prompt: "Which word best describes the tone of this poem?",
        right: "Humorous",
        wrong: ["Gloomy", "Furious", "Serious"],
        hint: "A sneaky sock-stealing puppy napping on its loot... Is that meant to be funny or serious?",
      },
      {
        prompt: "Which two lines rhyme with each other?",
        right: "Lines 3 and 4",
        wrong: ["Lines 1 and 3", "Lines 2 and 4", "Lines 1 and 4"],
        hint: "Read the last word of each line in the pair out loud. Do they sound alike?",
      },
    ],
  },
  {
    level: 3,
    title: "Bottom Bunk",
    stanzas: [
      ["Above me, my brother snores", "like a small engine", "that never quite starts."],
      ["He thinks I don't know", "he still falls asleep", "with the old stuffed bear", "tucked under his chin."],
      ["I won't tell anyone.", "Some nights", "I'm glad he's up there."],
    ],
    questions: [
      {
        prompt: "What form of poem is this?",
        right: "Free verse",
        wrong: ["Haiku", "Limerick", "Sonnet"],
        hint: "This poem has no regular rhyme scheme or rhythm.",
      },
      {
        prompt: "How many stanzas does this poem have?",
        right: "3",
        wrong: ["1", "4", "10"],
        hint: "A stanza is a group of lines. Count the groups separated by blank space, not the lines.",
      },
      {
        prompt: "Who is the speaker of this poem?",
        right: "A sibling who sleeps in the bunk below the brother",
        wrong: ["The brother who snores", "A parent checking on the kids", "The stuffed bear"],
        hint: "The speaker says “Above me, my brother snores.” Where must the speaker be?",
      },
      {
        prompt: "What can you infer about the speaker's feelings toward the brother?",
        right: "The speaker cares about him and finds comfort in having him near.",
        wrong: [
          "The speaker wants to embarrass him.",
          "The speaker is afraid of him.",
          "The speaker wishes he would move out.",
        ],
        hint: "The speaker keeps his secret and says, “Some nights I'm glad he's up there.”",
      },
      {
        prompt: "Which lines contain a simile?",
        right: "“my brother snores / like a small engine”",
        wrong: ["“He thinks I don't know”", "“I won't tell anyone.”", "“Some nights / I'm glad he's up there.”"],
        hint: "A simile compares two things using “like” or “as.”",
      },
    ],
  },
  {
    level: 3,
    title: "Roots",
    stanzas: [
      ["Nobody claps for roots.", "They work in the dark,", "holding on,", "reaching for water", "no one else can see."],
      ["But every tall tree", "began like this—", "quiet,", "patient,", "underground."],
    ],
    questions: [
      {
        prompt: "Which statement best expresses the theme of this poem?",
        right: "Important growth often happens quietly, before anyone notices.",
        wrong: [
          "Trees need more sunlight than water.",
          "People should clap more at concerts.",
          "Gardening is boring and difficult.",
        ],
        hint: "The roots work unseen, yet every tall tree starts with them. What might that say about people?",
      },
      {
        prompt: "What do the roots most likely symbolize?",
        right: "Hidden effort that makes later success possible",
        wrong: ["Fear of the dark", "An argument between friends", "The end of a journey"],
        hint: "Roots do work no one sees, and that work lets a tree grow tall.",
      },
      {
        prompt: "Which line gives the roots human qualities?",
        right: "They work in the dark,",
        wrong: ["But every tall tree", "underground."],
        hint: "Personification gives human actions to non-human things. Which line has roots doing a job?",
      },
      {
        prompt: "How many stanzas does this poem have?",
        right: "2",
        wrong: ["1", "3", "10"],
        hint: "Count the groups of lines separated by blank space, not the lines themselves.",
      },
      {
        prompt: "Which phrase best describes the tone of this poem?",
        right: "Quietly encouraging",
        wrong: ["Angry and bitter", "Silly and joking", "Panicked"],
        hint: "The poem praises patience and hidden effort. How might a reader who feels unnoticed feel after reading it?",
      },
    ],
  },
];

const POETRY_TERMS: Item[] = [
  {
    level: 1,
    prompt: "What is a stanza?",
    right: "A group of lines in a poem, like a paragraph in prose",
    wrong: ["The title of a poem", "A word that rhymes with another word", "The last line of a poem"],
    hint: "Stanzas are separated by blank space, the way paragraphs are.",
  },
  {
    level: 1,
    prompt: "What is a pair of rhyming lines in a row called?",
    right: "Couplet",
    wrong: ["Quatrain", "Tercet", "Haiku"],
    hint: "A couple is two of something.",
  },
  {
    level: 1,
    prompt: "What does a rhyme scheme describe?",
    right: "The pattern of rhyming sounds at the ends of lines",
    wrong: ["The number of syllables in a line", "The topic of the poem", "The order of the stanzas"],
    hint: "Rhyme schemes are written with letters, like AABB or ABAB.",
  },
  {
    level: 2,
    prompt: "Who is the speaker of a poem?",
    right: "The voice talking in the poem, which may not be the poet",
    wrong: [
      "Always the poet, talking about their own life",
      "The person reading the poem aloud",
      "The first character named in the title",
    ],
    hint: "Poets can write in the voice of anyone or anything, like a child, a tree or a river.",
  },
  {
    level: 2,
    prompt: "What is free verse?",
    right: "Poetry without a regular rhyme scheme or rhythm",
    wrong: [
      "Poetry that must have exactly three lines",
      "Poetry that is free to read online",
      "Poetry that always rhymes in couplets",
    ],
    hint: "Free verse is “free” from fixed patterns of rhyme and rhythm.",
  },
  {
    level: 2,
    prompt: "Which line uses alliteration?",
    right: "Bright blue boats bob in the bay",
    wrong: ["The evening light is fading", "Gulls call as the tide rolls in", "A cold wind moves across the field"],
    hint: "Alliteration repeats the same beginning sound in nearby words. Listen for b, b, b…",
  },
  {
    level: 3,
    prompt: "What is the difference between rhyme and rhythm?",
    right: "Rhyme is matching end sounds; rhythm is the pattern of stressed and unstressed beats.",
    wrong: [
      "Rhyme is the beat; rhythm is matching end sounds.",
      "They mean exactly the same thing.",
      "Rhyme is only for songs; rhythm is only for poems.",
    ],
    hint: "Rhyme: cat/hat. Rhythm: da-DUM da-DUM, the beat you could tap along to.",
  },
  {
    level: 3,
    prompt: "Why might a poet use line breaks in free verse?",
    right: "To control the pace and draw attention to certain words",
    wrong: [
      "To make sure every line rhymes",
      "To fit exactly 17 syllables",
      "Because free verse must use short lines",
    ],
    hint: "A line break makes the reader pause. Where a poet pauses changes what stands out.",
  },
  {
    level: 3,
    prompt: "A poem is written from the point of view of an old oak tree. Who is the speaker?",
    right: "The oak tree",
    wrong: ["The poet, speaking as themselves", "The reader", "A woodcutter"],
    hint: "The speaker is whoever (or whatever) is talking in the poem, even if it isn't a person.",
  },
];

function poetry(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  const poemQs = choose(POEMS, level, 2).flatMap((p) => {
    const visual = poemVisual(p.title, p.stanzas);
    return sample(p.questions, 3).map((q) => ask({ ...q, visual }));
  });
  return [...poemQs, ...choose(POETRY_TERMS, level, 2).map(ask)];
}

// ---------- Course ----------

export const course: Course = {
  grade: "7",
  subject: "language",
  bigIdeas: {
    "ca-bc": [
      "Language and text can be a source of creativity and joy.",
      "Exploring stories and other texts helps us understand ourselves and make connections to others and to the world.",
      "Exploring and sharing multiple perspectives extends our thinking.",
      "Questioning what we hear, read, and view contributes to our ability to be educated and engaged citizens.",
      "Developing our understanding of how language works allows us to use it purposefully.",
    ],
  },
  units: [
    {
      id: "close-reading",
      title: "Close Reading",
      emoji: "📖",
      blurb: "Theme, inference and author's craft",
      standards: {
        "ca-bc":
          "Story/text: forms, functions and genres of text; text features; reading and viewing strategies (inferring, identifying theme, claims and counterarguments, analyzing author's craft)",
      },
      parentNote:
        "Reading original stories, arguments and informational passages, then identifying theme and main idea, making inferences, spotting claims and counterarguments, and explaining why an author made certain choices.",
      generate: closeReading,
    },
    {
      id: "literary-devices",
      title: "Literary Devices",
      emoji: "🎭",
      blurb: "Irony, foreshadowing and symbolism",
      standards: {
        "ca-bc": "Story/text: literary elements and literary devices (irony, foreshadowing, flashback, symbolism, imagery, figurative language)",
      },
      parentNote:
        "Recognizing the tools writers use: figurative language, foreshadowing, flashback, symbolism and the three kinds of irony (verbal, situational and dramatic), plus the parts of a plot.",
      generate: literaryDevices,
    },
    {
      id: "tone-mood",
      title: "Tone & Mood",
      emoji: "🌦️",
      blurb: "How writing feels and sounds",
      standards: {
        "ca-bc": "Story/text: literary elements (tone and mood); language features: word choice, connotation and formal vs. informal language",
      },
      parentNote:
        "Telling the writer's attitude (tone) apart from the reader's feeling (mood), and seeing how word choice and connotation shape both.",
      generate: toneMood,
    },
    {
      id: "persuasion",
      title: "Persuasive Power",
      emoji: "📣",
      blurb: "Ethos, pathos, logos and fallacies",
      standards: {
        "ca-bc":
          "Language features, structures and conventions: rhetorical techniques and elements of persuasion; evaluating claims, evidence, counterclaims and logical fallacies",
      },
      parentNote:
        "Identifying appeals to credibility, emotion and logic; spotting weak reasoning like bandwagon, false cause and slippery slope; and judging which evidence and rebuttals are strongest.",
      generate: persuasion,
    },
    {
      id: "source-check",
      title: "Source Check",
      emoji: "🔎",
      blurb: "Credibility, bias and citing",
      standards: {
        "ca-bc":
          "Strategies and processes: evaluating the credibility, bias and purpose of sources; fact and opinion; primary and secondary sources; citation, paraphrasing and avoiding plagiarism",
      },
      parentNote:
        "Researching responsibly: judging whether a source is trustworthy and current, noticing bias, separating fact from opinion, and giving credit through quotation, paraphrase and citation.",
      generate: sources,
    },
    {
      id: "clauses-sentences",
      title: "Clauses & Sentences",
      emoji: "🧩",
      blurb: "Simple, compound, complex and more",
      standards: {
        "ca-bc":
          "Language features, structures and conventions: independent and dependent clauses; simple, compound, complex and compound-complex sentences; avoiding fragments, run-ons and comma splices",
      },
      parentNote:
        "Finding independent and dependent clauses, naming the four sentence types, and fixing fragments, run-ons and comma splices, the building blocks of varied, clear sentences.",
      generate: sentenceTypes,
    },
    {
      id: "modifiers-parallelism",
      title: "Modifiers & Parallelism",
      emoji: "⚖️",
      blurb: "Clear, balanced sentences",
      standards: {
        "ca-bc":
          "Language features, structures and conventions: placement of modifiers and parallel structure; writing processes (revising sentences for clarity)",
      },
      parentNote:
        "Revising sentences so describing phrases sit next to what they describe (no misplaced or dangling modifiers) and list items match in form (parallel structure).",
      generate: modifiers,
    },
    {
      id: "semicolons-colons-dashes",
      title: "Semicolons, Colons & Dashes",
      emoji: "✒️",
      blurb: "Punctuation with power",
      standards: {
        "ca-bc": "Language features, structures and conventions: punctuation conventions (semicolons, colons and dashes) used in context",
      },
      parentNote:
        "Using semicolons to join related sentences and separate complex lists, colons to introduce lists and explanations, and dashes to add emphasis or interruptions.",
      generate: punctuation,
    },
    {
      id: "word-mix-ups",
      title: "Word Mix-Ups",
      emoji: "🔀",
      blurb: "Affect or effect? Its or it's?",
      standards: {
        "ca-bc": "Language features, structures and conventions: commonly confused words (homophones and near-homophones) and spelling conventions in context",
      },
      parentNote:
        "Choosing correctly between commonly confused words: its/it's, their/there/they're, then/than, lose/loose, who's/whose, affect/effect, accept/except and more.",
      generate: wordMixUps,
    },
    {
      id: "poetry-lab",
      title: "Poetry Lab",
      emoji: "🖋️",
      blurb: "Rhyme, stanzas and speakers",
      standards: {
        "ca-bc":
          "Story/text: forms and genres of text (haiku, limerick, free verse); literary elements and devices in poetry (stanza, rhyme scheme, speaker, metaphor, simile, personification)",
      },
      parentNote:
        "Reading short original poems to find rhyme schemes, count stanzas, identify the speaker, recognize forms like haiku, limerick and free verse, and interpret figurative language and theme.",
      generate: poetry,
    },
  ],
};
