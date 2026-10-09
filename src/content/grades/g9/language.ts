import { sample, shuffle } from "../../random";
import type { SortSet } from "../../bank";
import type { Course, GenerateOptions, Question, Visual } from "../../types";
import { ask, choose, fromParts, levelOf, q, qe, type Item, type Level } from "../kit";

// Grade 9 English language arts: close reading, literary elements, argument and rhetoric,
// grammar and style, and voices and perspectives. Passages are original.

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
    title: "Night Shift",
    paragraphs: [
      "At 2 a.m., the only light in the hospital cafeteria came from the vending machine. Priya sat alone with a cup of tea gone cold, her hospital badge flipped backward on her lanyard so no one could see her name.",
      "Down the hall, a baby was crying. Priya had been a nurse for three years, and she still could not decide whether the sound meant someone needed her or reminded her that she was needed too much. Her mother called it “the weight of a good heart.” Priya thought of it as the weight of an unfinished list.",
      "She finished the tea anyway, cold and bitter, and rinsed the cup. Then she flipped her badge around, squared her shoulders and walked toward the sound.",
    ],
    questions: [
      { prompt: "What does flipping the badge back around at the end suggest?", right: "Priya is choosing to face her responsibilities.", wrong: ["Priya is quitting her job.", "Priya has lost her badge.", "Priya is hiding from her mother."], hint: "She hid her name earlier. Turning it around shows she is ready to be seen and to help." },
      { prompt: "Which phrase best shows Priya's feeling of being overwhelmed?", right: "“the weight of an unfinished list”", wrong: ["“the only light in the hospital cafeteria”", "“a cup of tea gone cold”", "“rinsed the cup”"], hint: "A “weight” and a list that never ends suggest pressure and exhaustion." },
      { prompt: "What is the effect of the author's detail about the tea?", right: "It reflects Priya's tiredness and the lack of comfort in the moment.", wrong: ["It shows she enjoys tea.", "It proves the cafeteria is closing.", "It shows she dislikes her mother."], hint: "Cold, bitter tea mirrors a cold, lonely moment." },
      { prompt: "What is the mood of the opening paragraph?", right: "quiet and lonely", wrong: ["cheerful and lively", "angry and tense", "silly and playful"], hint: "Notice the time, the single light and Priya alone with cold tea." },
    ],
  },
  {
    level: 2,
    title: "The Quiet Season",
    paragraphs: [
      "Every winter, the town of Alder Creek went quiet. The loggers headed south, the tourists vanished, and the only sound along Main Street was snow sliding off tin roofs.",
      "Some people called it boring. Odile called it honest. In summer, the town performed: banners on lampposts, a fiddler in the park, shopkeepers smiling at strangers. In winter, you saw what the town was when nobody was watching: a handful of neighbours shovelling each other's walks, a lit window at the library, a pot of soup passed over a fence.",
      "“You can't see a place properly when it's showing off,” Odile liked to say. She had lived there for seventy years and had never once wanted to leave during the quiet season.",
    ],
    questions: [
      { prompt: "What does Odile mean by calling the quiet season “honest”?", right: "The town shows its true character when it isn't performing for visitors.", wrong: ["The town never tells lies.", "Nobody speaks in winter.", "Winter is the cheapest season."], hint: "She contrasts summer's “performance” with winter, when the town isn't “showing off.”" },
      { prompt: "The word “performed” in the second paragraph is used to suggest that the town in summer…", right: "puts on a show for visitors", wrong: ["acts in a play", "is dishonest with the law", "works more slowly"], hint: "Banners, fiddlers and smiling shopkeepers are presented as a display for outsiders." },
      { prompt: "Which theme is best supported by the passage?", right: "The most meaningful parts of a community may be found in quiet, everyday kindness.", wrong: ["Tourists ruin small towns.", "Summers are better than winters.", "Small towns should be left."], hint: "Look at the details Odile values: neighbours shovelling, a lit library window, soup passed over a fence." },
      { prompt: "What does the author reveal about Odile in the last sentence?", right: "She is deeply attached to the town and its quiet season.", wrong: ["She plans to move away.", "She dislikes winter.", "She works for the tourist office."], hint: "Seventy years and “never once wanted to leave” show strong attachment." },
    ],
  },
  {
    level: 2,
    title: "Is a Four-Day School Week Worth It?",
    paragraphs: [
      "Some school districts in North America have tried a four-day week, usually with longer days on Monday to Thursday. Supporters claim the change saves money on transportation and heating, and gives students and teachers a day for appointments, work or rest.",
      "Critics point out that research is mixed. Several studies found small drops in test scores, especially in math, while others found no change at all. Parents who work on Fridays may struggle to find child care, and the longer days can leave younger students tired by the afternoon.",
      "The strongest case for the change may be in rural districts, where long bus rides make every school day expensive. In larger cities with many working parents, the costs may outweigh the benefits. A decision like this probably depends less on a single rule than on the needs of the community.",
    ],
    questions: [
      { prompt: "Which sentence best states the author's overall position?", right: "The four-day week may suit some communities better than others, depending on their needs.", wrong: ["Every school should switch to four days.", "A four-day week never works.", "Test scores always go up."], hint: "The last paragraph says the decision “depends … on the needs of the community.”" },
      { prompt: "What kind of evidence does the author use in the second paragraph?", right: "Research findings that disagree with each other", wrong: ["A single personal story", "A famous quotation", "A joke"], hint: "“Several studies found small drops… others found no change.”" },
      { prompt: "Why does the author mention rural districts?", right: "To show where the benefits are strongest", wrong: ["To prove cities are better", "To list all school districts", "To criticize bus drivers"], hint: "The passage says the case is strongest where “long bus rides make every school day expensive.”" },
      { prompt: "The tone of this passage is best described as…", right: "balanced and thoughtful", wrong: ["angry and one-sided", "silly and sarcastic", "bored and uninterested"], hint: "The author presents both supporters and critics and avoids strong emotions." },
    ],
  },
  {
    level: 3,
    title: "Inheritance of Water",
    paragraphs: [
      "My grandfather measured the year by the river. When the ice cracked in March, he said spring had finally cleared its throat. When the water fell and the stones showed their pale backs in August, he said the river was “sleeping with her eyes open.”",
      "I used to think this was only his way of making a small thing sound grand. But when he died, and I stood alone on the bank in a coat too big for me, I began to hear the water saying the things he used to say. It was cracking, it was clearing its throat. It was, I realized, still keeping the year for him.",
      "I am not sure what I believe about the dead. But I know this: some people leave us a language, and we go on speaking it long after they stop.",
    ],
    questions: [
      { prompt: "What does “spring had finally cleared its throat” mean in the context of the passage?", right: "Spring was starting, as the ice began to break up", wrong: ["The grandfather had a cold", "The river was polluted", "Spring was ending"], hint: "It's a metaphor using a human action for the first sounds of spring." },
      { prompt: "What does the narrator realize at the end of the second paragraph?", right: "The river carries on the way of seeing the world that the grandfather taught.", wrong: ["The grandfather was wrong about the river.", "The river is dangerous.", "The coat is too big."], hint: "“It was, I realized, still keeping the year for him.”" },
      { prompt: "Which statement best describes the narrator's change over the passage?", right: "From dismissing the grandfather's sayings to understanding their lasting meaning", wrong: ["From loving the river to fearing it", "From ignoring the dead to joining them", "From being young to being old"], hint: "At first the narrator thought it was just grand language. At the end, it becomes a language they carry on." },
      { prompt: "What does the last sentence suggest about the grandfather's influence?", right: "His way of speaking and seeing continues in the people he leaves behind.", wrong: ["He should have taught more languages.", "He is still alive.", "People forget the dead quickly."], hint: "“We go on speaking it long after they stop.”" },
    ],
  },
];

function closeReading(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return choose(READINGS, level, 2).flatMap((r) => {
    const visual: Visual = { type: "passage", title: r.title, paragraphs: r.paragraphs };
    return sample(r.questions, 4).map((item) => ask({ ...item, visual }));
  });
}

// ---------- Literary Elements ----------

const DEVICE = "Which literary device does this excerpt use?";
const dev = (level: Level, text: string, right: string, wrong: string[], hint: string): Item => qe(level, text, DEVICE, right, wrong, hint);

const ELEMENTS: Item[] = [
  dev(1, "The sun was a coin of pale gold, flipped into the sky.", "Metaphor", ["Simile", "Onomatopoeia", "Hyperbole"], "The sun is said to BE a coin, with no “like” or “as.”"),
  dev(1, "The leaves danced and the wind sang its low, lonely song.", "Personification", ["Simile", "Irony", "Symbolism"], "Wind can't sing and leaves can't dance. Human actions are given to nature."),
  dev(1, "The ancient oak stood for generations as a symbol of the family's strength.", "Symbolism", ["Hyperbole", "Flashback", "Alliteration"], "An object that stands for a larger idea is a symbol."),
  dev(2, "Throughout the novel, the sound of a ticking clock returns whenever Marcus makes a hard choice.", "Motif", ["Foil", "Hyperbole", "Allusion"], "A repeated image, sound or idea that supports the theme is a motif."),
  dev(2, "Whispering winds wove wildly through the willow trees.", "Alliteration", ["Onomatopoeia", "Simile", "Irony"], "Repeating the same starting sound (here “w”) is alliteration."),
  dev(2, "He was a modern-day Romeo, sneaking messages to a girl across town.", "Allusion", ["Simile", "Foreshadowing", "Hyperbole"], "A reference to a well-known person, story or event is an allusion. Here, to Shakespeare's Romeo."),
  dev(2, "The fire station burned to the ground on the night of the town's biggest fire-safety fair.", "Situational irony", ["Verbal irony", "Metaphor", "Alliteration"], "The opposite of what is expected happens: a fire station burns during a fire-safety event."),
  dev(2, "The trembling candle flickered as the stranger walked in, and every shadow in the room seemed to lean toward him.", "Foreshadowing", ["Flashback", "Simile", "Onomatopoeia"], "Hints at danger or change to come, such as the lean of the shadows, foreshadow later events."),
  dev(3, "Elena is cautious and kind. Her brother Damien is reckless and selfish, and his behaviour shows how admirable her patience is.", "Foil", ["Allusion", "Symbolism", "Irony"], "A foil is a character whose contrasting traits highlight those of another."),
  dev(3, "“What a lovely day for a picnic,” she muttered, as the storm clouds rolled in.", "Verbal irony", ["Situational irony", "Personification", "Alliteration"], "She says the opposite of what she means. That's verbal irony."),
  dev(3, "The audience knew the killer was hiding in the cellar, but the detective strolled calmly toward it.", "Dramatic irony", ["Verbal irony", "Foil", "Motif"], "The audience knows something a character doesn't. That gap is dramatic irony."),
  dev(3, "Silence hung in the room like a heavy winter coat, and every word fell into it and disappeared.", "Simile", ["Metaphor", "Hyperbole", "Allusion"], "“Like a heavy winter coat” makes an explicit comparison with “like.”"),
];

const TONE_MOOD: Item[] = [
  qe(1, "The rain tapped on the window as Mei read the letter a third time, her hands shaking.", "What is the mood?", "tense and uneasy", ["joyful and carefree", "silly and playful", "calm and peaceful"], "Shaking hands and rereading suggest nervousness and worry."),
  qe(1, "Sunlight spilled across the kitchen, and the whole house smelled of cinnamon and fresh bread.", "What is the mood?", "warm and cheerful", ["tense and scary", "gloomy and lonely", "angry and bitter"], "Sunlight and bread are cosy, welcoming images."),
  qe(2, "“Oh, wonderful,” Noor sighed, staring at the third flat tyre of the week. “Just what I needed.”", "What is the tone of Noor's words?", "sarcastic", ["grateful", "sincere", "confused"], "She does not mean “wonderful.” Her words are sarcastic."),
  qe(2, "The report notes that the experiment was performed on three separate occasions and that the results were consistent.", "What is the tone of this sentence?", "formal and objective", ["emotional and personal", "playful and silly", "angry"], "It reports facts in a neutral, formal way with no personal feelings."),
  qe(3, "For one brief moment, the stadium held its breath, and then the world fell apart in joy.", "Which best describes the shift in the mood?", "from suspense to celebration", ["from sadness to anger", "from joy to fear", "from boredom to disgust"], "“Held its breath” builds suspense, then the release is “joy.”"),
  qe(3, "She folded the note and slipped it into her pocket, and nothing in her face gave a hint of what it said.", "What does the author's description suggest about her?", "She is hiding her feelings.", ["She is relieved.", "She is bored.", "She has forgotten the note."], "A face that shows nothing, while hiding a note, suggests she is concealing something."),
];

// ---------- Argument & Rhetoric ----------

const RHETORIC: Item[] = [
  q(1, "A thesis statement is…", "the main claim an essay sets out to prove", ["a list of sources", "a summary of the story", "a description of the author"], "A thesis says what you will argue and signals the direction of the essay."),
  q(1, "Which is the strongest thesis?", "Schools should start later because sleep-deprived students learn less.", ["Schools exist.", "I like sleeping.", "Many students go to school."], "A strong thesis takes a position and gives a reason."),
  q(1, "What does ethos mean?", "Appealing to the credibility or character of the speaker", ["Appealing to emotions", "Appealing to logic", "Appealing to humour"], "Ethos builds trust: “I am an expert, so you can rely on me.”"),
  q(1, "What does pathos mean?", "Appealing to the emotions of the audience", ["Appealing to credibility", "Appealing to logic and facts", "Appealing to the clock"], "Pathos aims at feelings, such as sympathy, fear or hope."),
  q(1, "What does logos mean?", "Appealing to logic, reasons and evidence", ["Appealing to emotions", "Appealing to fame", "Appealing to fear"], "Logos relies on facts, statistics and clear reasoning."),
  q(2, "“You can't trust his argument about school funding. He didn't even finish high school!” This is…", "an ad hominem fallacy", ["a logical argument", "a statistic", "a fair comparison"], "Ad hominem attacks the person instead of the argument."),
  q(2, "“Either we ban all phones, or students will never learn anything.” This is…", "a false dilemma", ["a balanced claim", "a survey result", "a fair rebuttal"], "A false dilemma presents only two options when more exist."),
  q(2, "A speaker says her opponent “wants to abolish all homework” when he only suggested less of it. This is…", "a straw man", ["a slippery slope", "ethos", "a statistic"], "A straw man twists someone's argument into something easier to attack."),
  q(2, "“Everyone's using this app, so it must be safe.” This is…", "a bandwagon appeal", ["a logical claim", "ad hominem", "a rebuttal"], "Popularity doesn't prove that something is true or safe."),
  q(2, "Which phrase is loaded language?", "“the greedy corporation’s shameful scheme”", ["“the company’s plan”", "“the proposal on page 3”", "“the new policy”"], "Loaded words like “greedy” and “shameful” push feelings instead of presenting neutral facts."),
  q(2, "What is a counterargument?", "A point made by someone with an opposing view", ["Evidence supporting your claim", "Your conclusion", "A source list"], "Good writers address counterarguments and respond to them with a rebuttal."),
  q(3, "Which response is a strong rebuttal to “Homework is useless”?", "Research suggests that short, well-designed homework can improve learning in some subjects.", ["Everyone does homework.", "Teachers say so.", "You are wrong."], "A strong rebuttal responds to the claim with evidence."),
  q(3, "A news story quotes only people who support a new highway. What is the problem?", "It leaves out other perspectives, so it may be biased.", ["It is too short.", "It uses facts.", "It cites a source."], "Balanced reporting includes different viewpoints."),
  q(3, "Which source is the most credible for a claim about the effects of sleep on teens?", "A peer-reviewed study by sleep researchers", ["A social media post", "An advertisement for pillows", "A friend’s opinion"], "Credible sources are based on evidence, expertise and review by others."),
  q(3, "What does it mean to “consider the purpose” of a media message?", "Ask why it was made, such as to inform, persuade or sell", ["Check how many colours it uses", "Check its length", "Check who liked it"], "Knowing the purpose helps you judge how the message tries to influence you."),
  q(3, "An influencer says she “loves” a drink in a video but does not mention she was paid. What is the problem?", "The audience may not realize it is advertising.", ["She is lying about her name.", "The video is too short.", "Drinks cannot be advertised."], "Hidden sponsorship can mislead viewers about the speaker's motives."),
];

const APPEALS: SortSet = {
  prompt: "Ethos, pathos or logos? Sort each persuasive statement.",
  hint: "Ethos: credibility (“I’m a doctor”). Pathos: emotion (“Imagine how scared they feel”). Logos: logic and evidence (“Studies show 80%…”).",
  bins: [
    { id: "ethos", label: "Ethos", emoji: "🎓" },
    { id: "pathos", label: "Pathos", emoji: "💗" },
    { id: "logos", label: "Logos", emoji: "📊" },
  ],
  items: [
    { label: "As a doctor for twenty years, I recommend it.", emoji: "🩺", bin: "ethos" },
    { label: "Our award-winning team has helped thousands.", emoji: "🏆", bin: "ethos" },
    { label: "Picture a lonely puppy waiting for a home.", emoji: "🐶", bin: "pathos" },
    { label: "No child should ever go to bed hungry.", emoji: "🌙", bin: "pathos" },
    { label: "Studies show 82% of students improved.", emoji: "📈", bin: "logos" },
    { label: "If A is more than B and B is more than C, A is more than C.", emoji: "🧮", bin: "logos" },
  ],
};

// ---------- Grammar & Style ----------

const GRAMMAR: Item[] = [
  q(1, "Which sentence uses a semicolon correctly?", "The bus was late; we walked.", ["The bus was late; and we walked.", "The bus; was late we walked.", "The bus was; late, we walked."], "A semicolon joins two related, complete sentences."),
  q(1, "Which sentence uses a colon correctly?", "You will need three things: a pencil, an eraser and paper.", ["You will need: a pencil, an eraser and paper.", "You will: need three things a pencil, an eraser and paper.", "You will need three things a pencil: an eraser and paper."], "A colon follows a complete statement and introduces a list."),
  q(1, "Choose the correct word: “The committee made __ decision.”", "its", ["it's", "their's", "its'"], "A committee acts as one unit here, so use the singular possessive “its.”"),
  q(1, "Which sentence has correct subject-verb agreement?", "Each of the players is ready.", ["Each of the players are ready.", "Each of the players were ready.", "Each of the players be ready."], "“Each” is singular and takes “is.”"),
  q(2, "Which sentence has a misplaced modifier?", "Walking down the street, the trees looked beautiful.", ["Walking down the street, I thought the trees looked beautiful.", "The trees looked beautiful as I walked down the street.", "I walked down the street and admired the trees."], "The trees aren't walking. The modifier should be next to “I.”"),
  q(2, "Which sentence has parallel structure?", "She enjoys painting, hiking and cooking.", ["She enjoys painting, to hike and cooking.", "She enjoys to paint, hiking and cook.", "She enjoys painting, hiking and to cook."], "List items in the same form: painting, hiking, cooking."),
  q(2, "Which is a complete sentence?", "Although the rain stopped, we stayed inside.", ["Although the rain stopped.", "Because we stayed inside.", "When the rain stopped, and we."], "A complete sentence needs an independent clause. “Although the rain stopped” alone is a fragment."),
  q(2, "Which pronoun fits? “Between you and __, the test was easy.”", "me", ["I", "myself", "mine"], "After a preposition like “between,” use an object pronoun."),
  q(2, "Which sentence uses a dash correctly for emphasis?", "She had only one goal — to win.", ["She had — only one goal to win.", "She — had only one goal to win.", "She had only — one goal to win."], "A dash can set off a strong, emphasized addition."),
  q(2, "Which sentence uses the active voice?", "The committee approved the plan.", ["The plan was approved by the committee.", "The plan was approved.", "The plan has been approved."], "In active voice, the subject (the committee) does the action."),
  q(3, "Which sentence is a run-on?", "I studied all night I still felt nervous.", ["I studied all night, yet I still felt nervous.", "I studied all night; I still felt nervous.", "I studied all night. I still felt nervous."], "Two complete sentences are joined with no punctuation or connecting word."),
  q(3, "Which sentence uses commas correctly?", "My cousin, who lives in Nanaimo, plays hockey.", ["My cousin who lives in Nanaimo, plays hockey.", "My cousin, who lives in Nanaimo plays hockey.", "My, cousin who lives, in Nanaimo plays hockey."], "Commas set off extra information that isn't needed to identify the noun."),
  q(3, "Choose the correct word: “The box of pencils __ on the desk.”", "is", ["are", "were", "be"], "The subject is “box” (singular), not “pencils.” Use “is.”"),
  q(3, "Which sentence is written in a formal register?", "I would appreciate your reply by Friday.", ["Hit me back by Friday.", "Lemme know ASAP, ok?", "Reply whenever, no biggie."], "Formal writing avoids slang and uses polite, complete wording."),
  q(3, "Which sentence correctly shows that the lockers belong to several students?", "The students' lockers were repainted.", ["The student's lockers were repainted.", "The students lockers' were repainted.", "The students locker's were repainted."], "For a plural noun ending in s, put the apostrophe after the s: students'."),
  q(3, "Which transition best shows contrast? “I wanted to go; __, I had homework.”", "however", ["therefore", "similarly", "for example"], "“However” shows a contrast between two ideas."),
];

const PUNCTUATION_SORT: SortSet = {
  prompt: "Complete sentence or fragment? Sort each group of words.",
  hint: "A complete sentence has a subject and a verb and expresses a complete thought. A fragment is missing one of them or leaves the thought unfinished.",
  bins: [
    { id: "sentence", label: "Complete sentence", emoji: "✅" },
    { id: "fragment", label: "Fragment", emoji: "✂️" },
  ],
  items: [
    { label: "The bell rang.", emoji: "🔔", bin: "sentence" },
    { label: "After the game ended, we went home.", emoji: "🏟️", bin: "sentence" },
    { label: "Close the door!", emoji: "🚪", bin: "sentence" },
    { label: "She hummed while she worked.", emoji: "🎵", bin: "sentence" },
    { label: "Because the road was icy.", emoji: "🧊", bin: "fragment" },
    { label: "Running across the field.", emoji: "🏃", bin: "fragment" },
    { label: "The tall man in the red coat.", emoji: "🧥", bin: "fragment" },
    { label: "Although we tried our best.", emoji: "💪", bin: "fragment" },
  ],
};

// ---------- Voices & Perspectives ----------

const VOICES: Item[] = [
  q(1, "What is point of view in a text?", "The perspective from which a story or message is told", ["The number of pages", "The title", "The setting"], "Point of view affects what readers know and how they feel about events."),
  q(1, "Why might two people describe the same event differently?", "They may have different experiences, values and information.", ["One of them must be lying.", "Events never happen the same way twice.", "They have different handwriting."], "Our backgrounds and experiences shape what we notice and how we tell it."),
  q(1, "What is oral storytelling?", "Sharing stories by speaking them aloud, passed from generation to generation", ["Writing a novel", "Reading silently", "Making a film"], "Oral traditions carry history, knowledge and values through spoken words."),
  q(2, "Why is it respectful to name the specific Nation or community a story comes from, rather than saying “Aboriginal legend”?", "Indigenous peoples in Canada are many distinct nations with their own languages, stories and protocols.", ["All Indigenous peoples share the same stories.", "Nations are not important.", "It makes text shorter."], "Naming the Nation recognizes diversity and gives credit to the source."),
  q(2, "In many First Peoples cultures, some knowledge and stories are shared only by those who have permission. What does this tell us?", "Stories and knowledge can belong to families or communities, and sharing them involves responsibility.", ["All stories are free to retell however we like.", "Stories are not valuable.", "Permission is only for books."], "Respecting protocols is part of respecting the people and the knowledge."),
  q(2, "“Learning is embedded in memory, history, and story” is one of the…", "First Peoples Principles of Learning", ["Core Competencies for Grade 3", "Rules of grammar", "Parts of a poem"], "The First Peoples Principles of Learning are guiding ideas about how learning works that are used in BC schools."),
  q(2, "A text says “Everyone knows teenagers don’t care about the environment.” What is the problem?", "It is a stereotype that makes a sweeping claim about a whole group.", ["It uses statistics.", "It is a good thesis.", "It quotes an expert."], "Words like “everyone” and “don't” ignore individual differences."),
  q(2, "Why is it important to ask whose voice is missing from a text?", "Leaving out some perspectives can give an incomplete picture.", ["It makes the text longer.", "Every text has all voices.", "It is not important."], "Asking who is absent helps us find a fuller understanding."),
  q(3, "A history textbook written long ago describes the arrival of settlers only from the settlers' view. What is a good next step for a reader?", "Look for sources from other perspectives, including those of people who were already living there.", ["Assume the textbook is complete.", "Stop reading history.", "Only read newer books."], "Comparing perspectives gives a fuller picture."),
  q(3, "Why does the cultural background of an author matter when reading?", "It can shape the stories they tell, the language they use and what they see as important.", ["It doesn't matter at all.", "It determines the book's length.", "It decides the grammar."], "Understanding context helps us read with more insight."),
  q(3, "Which is an example of a text being shaped by its time and place?", "A story that reflects the attitudes of the period in which it was written", ["A dictionary entry for a new word", "A list of numbers", "A recipe"], "Texts often reflect the values and assumptions of their world."),
  q(3, "When you quote someone, what is the most respectful way to use their words?", "Quote them accurately, in context, and credit them.", ["Change the words to suit your point.", "Use the words without a source.", "Quote only part to change the meaning."], "Accuracy, context and credit respect the speaker and your readers."),
];

// ---------- Language & Style ----------

const STYLE: Item[] = [
  q(1, "What is the denotation of a word?", "Its dictionary meaning", ["The feeling it suggests", "Its sound", "Its length"], "Denotation is the literal meaning. Connotation is the feeling or idea attached to it."),
  q(1, "What is the connotation of a word?", "The feelings or ideas it suggests beyond its dictionary meaning", ["Its spelling", "Its part of speech", "Its pronunciation"], "“Home” and “house” both name a building, but “home” suggests warmth and belonging."),
  q(1, "Which word has the most positive connotation?", "determined", ["stubborn", "pigheaded", "bullheaded"], "All describe someone who doesn't give up, but “determined” sounds admirable."),
  q(1, "Which word has the most negative connotation?", "cheap", ["thrifty", "economical", "frugal"], "“Cheap” can suggest poor quality or stinginess. The others sound careful and positive."),
  q(2, "Why do English words change over time?", "People borrow words, invent new ones and use old ones differently.", ["Dictionaries forbid change.", "Words never change.", "Only teachers change them."], "Language change is natural. For example, “awful” once meant “full of awe.”"),
  q(2, "“Selfie” and “emoji” are examples of…", "new words that entered English recently", ["words that no longer exist", "words from Old English", "words with no meaning"], "New technology and culture create new words."),
  q(2, "Many English words, like “moccasin” and “moose,” came from…", "Indigenous languages of North America", ["Latin only", "Chinese only", "French only"], "English has borrowed words from languages all over the world, including Indigenous languages of Canada."),
  q(2, "A writer repeats the opening words of several sentences: “We shall not give up. We shall not give in. We shall not turn back.” This rhetorical device is called…", "anaphora", ["alliteration", "a pun", "hyperbole"], "Anaphora repeats words at the start of lines for emphasis."),
  q(2, "“Do we really want our children to inherit a polluted planet?” What is this?", "A rhetorical question", ["A fact", "A statistic", "A thesis"], "A rhetorical question is asked for effect, not for an answer."),
  q(2, "Which sentence uses a formal register?", "We would like to request your assistance with this matter.", ["Hey, can you help out?", "We need you to chip in, ok?", "Gimme a hand here."], "Formal writing uses complete, polite wording without slang."),
  q(2, "Which sentence has a more concise style?", "We left because it rained.", ["We made the decision to leave on account of the fact that it was raining.", "It was raining so we left in order to do so.", "The reason we left was due to the rain."], "Concise writing says the same thing in fewer words."),
  q(2, "Which sentence shows varied sentence length for rhythm?", "The storm broke. Rain hammered the roof, rattled the windows and swept across the empty street in grey sheets.", ["The storm broke. Rain fell. Wind blew. Leaves moved.", "The storm broke and rain hammered the roof and rattled the windows and swept across the street.", "The storm broke, it rained, it blew."], "Mixing short and long sentences creates rhythm and emphasis."),
  q(3, "A writer calls a rival’s plan a “reckless gamble” and her own a “bold step.” What technique is this?", "Loaded language that colours the reader's view", ["A neutral comparison", "A statistic", "A definition"], "Words with strong connotations can sway readers."),
  q(3, "Which is the best revision for clarity? “The thing was done by them in a quick way.”", "They finished quickly.", ["The thing was done by them quickly.", "They did the thing in a quick way.", "Quickly by them was done."], "Active voice and precise words make writing clearer."),
  q(3, "A speaker says “I came, I saw, I conquered.” The pattern of three parallel parts is called…", "a triad (rule of three)", ["a simile", "a footnote", "onomatopoeia"], "Groups of three create rhythm and make ideas memorable."),
  q(3, "Why might a writer choose the word “slender” instead of “skinny”?", "“Slender” has a more positive connotation.", ["They mean something totally different.", "“Slender” is slang.", "There is no difference at all."], "Connotation changes how readers feel about the person described."),
];

const REGISTER: SortSet = {
  prompt: "Formal or informal language? Sort each phrase.",
  hint: "Formal language is polite and complete, used in essays, letters and presentations. Informal language is casual, used with friends.",
  bins: [
    { id: "formal", label: "Formal", emoji: "👔" },
    { id: "informal", label: "Informal", emoji: "🧢" },
  ],
  items: [
    { label: "I am writing to request an extension.", emoji: "✉️", bin: "formal" },
    { label: "Thank you for your consideration.", emoji: "🤝", bin: "formal" },
    { label: "The results indicate a significant increase.", emoji: "📊", bin: "formal" },
    { label: "We regret to inform you that the event is cancelled.", emoji: "📣", bin: "formal" },
    { label: "Hey, what's up?", emoji: "👋", bin: "informal" },
    { label: "That test was super hard, no cap.", emoji: "😅", bin: "informal" },
    { label: "Gonna grab some food, brb.", emoji: "🍔", bin: "informal" },
    { label: "Totally! See ya later!", emoji: "✌️", bin: "informal" },
  ],
};

// ---------- Unit builders ----------

function literaryElements(opts?: GenerateOptions): Question[] {
  const level = levelOf(opts);
  return shuffle([...choose(ELEMENTS, level, 6), ...choose(TONE_MOOD, level, 2)]).map(ask);
}

const rhetoric = (opts?: GenerateOptions): Question[] => fromParts({ items: RHETORIC, sorts: [APPEALS] }, opts);
const grammar = (opts?: GenerateOptions): Question[] => fromParts({ items: GRAMMAR, sorts: [PUNCTUATION_SORT] }, opts);
const voices = (opts?: GenerateOptions): Question[] => fromParts({ items: VOICES }, opts);
const style = (opts?: GenerateOptions): Question[] => fromParts({ items: STYLE, sorts: [REGISTER] }, opts);

// ---------- Course ----------

export const course: Course = {
  grade: "9",
  subject: "language",
  bigIdeas: {
    "ca-bc": [
      "Language and story can be a source of creativity and joy.",
      "Exploring stories and other texts helps us understand ourselves and make connections to others and to the world.",
      "People understand text differently depending on their worldviews and perspectives.",
      "Texts are socially, culturally, and historically constructed.",
      "Questioning what we hear, read, and view contributes to our ability to be educated and engaged citizens.",
    ],
  },
  units: [
    {
      id: "close-reading",
      title: "Close Reading",
      emoji: "🔍",
      blurb: "Inference, theme and author's craft",
      standards: { "ca-bc": "Reading closely: inference, theme, tone and the author's craft in short fiction and non-fiction texts" },
      parentNote:
        "Reading original short passages and answering questions about theme, tone, word choice, structure and the author's purpose, using evidence from the text.",
      generate: closeReading,
    },
    {
      id: "literary-elements",
      title: "Literary Elements",
      emoji: "🎭",
      blurb: "Irony, motif, tone and mood",
      standards: { "ca-bc": "Literary elements and devices: irony, symbolism, motif, allusion, foil, tone and mood" },
      parentNote:
        "Recognizing devices such as irony, symbolism, motif, allusion and foils in short excerpts, and describing tone and mood.",
      generate: literaryElements,
    },
    {
      id: "argument-and-rhetoric",
      title: "Argument & Rhetoric",
      emoji: "📣",
      blurb: "Appeals, fallacies and credible sources",
      standards: { "ca-bc": "Persuasive techniques and critical thinking: rhetorical appeals, logical fallacies, bias and the credibility of sources" },
      parentNote:
        "Spotting ethos, pathos and logos, common fallacies such as straw man and false dilemma, loaded language and bias, and judging whether a source or media message can be trusted.",
      generate: rhetoric,
    },
    {
      id: "grammar-and-style",
      title: "Grammar & Style",
      emoji: "✏️",
      blurb: "Punctuation, agreement and register",
      standards: { "ca-bc": "Conventions of Canadian English: sentence structure, punctuation, agreement, parallelism and formal register" },
      parentNote:
        "Semicolons, colons, dashes, commas and apostrophes, subject-verb agreement, pronoun case, misplaced modifiers, run-ons and fragments, and choosing a formal or informal register.",
      generate: grammar,
    },
    {
      id: "language-and-style",
      title: "Language & Style",
      emoji: "🖋️",
      blurb: "Connotation, register and rhetorical devices",
      standards: { "ca-bc": "Language change, connotation and denotation, elements of style, register and rhetorical devices" },
      parentNote:
        "How word choice shapes feeling (connotation and denotation), how English changes and borrows words, formal and informal register, concise and varied sentences, and devices such as anaphora and rhetorical questions.",
      generate: style,
    },
    {
      id: "voices-and-perspectives",
      title: "Voices & Perspectives",
      emoji: "🗣️",
      blurb: "Whose story is it?",
      standards: { "ca-bc": "Perspectives and First Peoples texts: point of view, oral storytelling, bias and respectful use of sources" },
      parentNote:
        "How point of view and background shape a text, why oral traditions and the protocols around them matter, and asking whose voices are present or missing. This unit introduces ideas only; teachers and local First Peoples communities lead deeper learning.",
      generate: voices,
    },
  ],
};
