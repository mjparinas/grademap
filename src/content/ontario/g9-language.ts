import { fromBank, type BankItem } from "../bank";
import { shuffle } from "../random";
import type { Question, Unit } from "../types";
import { on, type Passage, passageQuestions } from "./kit";

// Ontario Grade 9 English, ENL1W (2023 de-streamed course). BC's close reading, argument and rhetoric,
// grammar and style, language and style, and voices units are shared; these units cover the word
// study, literary devices, digital literacy, revising and editing, and text features Ontario names
// for Grade 9. All passages are original.

// ---------- Word parts and vocabulary ----------

const WORDS: BankItem[] = [
  { prompt: "What does the prefix anti- mean in antifreeze?", right: "against", wrong: ["with", "before", "under"], hint: "Antifreeze works against freezing." },
  { prompt: "What does the base port mean in transport and export?", right: "carry", wrong: ["see", "write", "say"], hint: "To transport is to carry across; to export is to carry out." },
  { prompt: "What does the base spect mean in inspect and spectator?", right: "look", wrong: ["hear", "carry", "build"], hint: "An inspector looks closely; a spectator looks on." },
  { prompt: "What does the base dict mean in predict and dictate?", right: "say", wrong: ["write", "walk", "break"], hint: "To predict is to say before; to dictate is to say aloud for someone else to write." },
  { prompt: "What does the base scrib or script mean in describe and manuscript?", right: "write", wrong: ["look", "carry", "hear"], hint: "A manuscript is written by hand." },
  { prompt: "What does the prefix tele- mean in telescope?", right: "far", wrong: ["small", "under", "again"], hint: "A telescope lets you see things that are far away." },
  { prompt: "What does the base chron mean in chronology?", right: "time", wrong: ["life", "earth", "word"], hint: "A chronology lists events in the order of time." },
  { prompt: "Which word could mean a study of living things?", right: "biology", wrong: ["geology", "chronology", "astronomy"], hint: "Bio means life, and -ology means the study of." },
  { prompt: "The suffix -less in fearless means…", right: "without", wrong: ["full of", "one who", "able to be"], hint: "Fearless means without fear." },
  { prompt: "What does unbreakable mean? (un- + break + -able)", right: "not able to be broken", wrong: ["able to be broken again", "full of breaks", "someone who breaks"], hint: "Un- means not, and -able means able to be." },
  { prompt: "Which word has a prefix that means again?", right: "rewrite", wrong: ["pretend", "dislike", "mistake"], hint: "Re- means again. Pre- means before, dis- means not and mis- means wrongly." },
  { prompt: "What is the base word in unhelpfulness?", right: "help", wrong: ["unhelp", "helpful", "ness"], hint: "Remove the prefix un- and the suffixes -ful and -ness." },
  { prompt: "Inaudible combines in- (not) and audi (hear). What does it mean?", right: "not able to be heard", wrong: ["able to be heard clearly", "hearing again", "full of hearing"], hint: "Put the parts together: not + hear + able." },
  { prompt: "Choose the best meaning of meticulous. “She was meticulous, checking every figure twice.”", right: "very careful about details", wrong: ["careless", "quick and sloppy", "angry"], hint: "Checking every figure twice shows great care." },
  { prompt: "Choose the best meaning of reluctant. “He was reluctant to jump, and kept stepping back from the edge.”", right: "unwilling", wrong: ["eager", "skilful", "tired"], hint: "Stepping back shows he did not want to do it." },
  { prompt: "Choose the best meaning of scarce. “Fresh water was scarce in the dry valley.”", right: "hard to find", wrong: ["everywhere", "unsafe", "cold"], hint: "A dry valley would have very little fresh water." },
  { prompt: "Choose the best meaning of candid. “Her candid answer surprised us, because she told us exactly what she thought.”", right: "honest and open", wrong: ["secretive", "polite but false", "rude and loud"], hint: "She told exactly what she thought, so she was open and honest." },
  { prompt: "Choose the best meaning of resilient. “The resilient team bounced back after losing three games in a row.”", right: "able to recover from difficulty", wrong: ["easily upset", "very competitive", "poorly organized"], hint: "Bouncing back is the clue." },
  { prompt: "In math class, what does the word product mean?", right: "the result of multiplying", wrong: ["the result of adding", "a store item", "a group of numbers"], hint: "Domain-specific words can mean something different from everyday use." },
  { prompt: "In science, what is mass?", right: "the amount of matter in an object", wrong: ["how heavy it feels on a hill", "how tall it is", "how quickly it moves"], hint: "Mass is measured in grams and kilograms." },
  { prompt: "On a map, what does the scale tell you?", right: "how map distances compare with real distances", wrong: ["which way is north", "how old the map is", "the name of the mapmaker"], hint: "A scale such as 1 cm = 5 km connects the map to real life." },
];

function words(): Question[] {
  return fromBank(WORDS, 8);
}

// ---------- Literary devices ----------

const DEVICES: BankItem[] = [
  { prompt: "A writer says, “Her generosity was Robin Hood–like,” referring to a well-known character from a legend. What is this device?", right: "allusion", wrong: ["flashback", "juxtaposition", "analogy"], hint: "An allusion is a brief reference to a well-known person, story or event." },
  { prompt: "“A library is to a town what a heart is to a body.” What is this device?", right: "analogy", wrong: ["allusion", "flashback", "juxtaposition"], hint: "An analogy explains one thing by comparing its relationship to another relationship." },
  { prompt: "A poem describes a glittering ballroom and, in the very next line, people waiting in line for bread, with no comment. What is this device?", right: "juxtaposition", wrong: ["allusion", "analogy", "flashback"], hint: "Juxtaposition places two contrasting things side by side so the reader notices the difference." },
  { prompt: "In the middle of a scene, the narrator suddenly describes a summer years earlier when she first met her neighbour. What is this device?", right: "flashback", wrong: ["allusion", "analogy", "juxtaposition"], hint: "A flashback interrupts the present story to show an earlier event." },
  { prompt: "A character says she opened the box “like Pandora,” and a reader who knows the Greek myth understands that something unwise was released. What is this device?", right: "allusion", wrong: ["flashback", "analogy", "juxtaposition"], hint: "The writer refers to a well-known myth to add meaning in just a few words." },
  { prompt: "Why might a writer use a flashback?", right: "To give background that explains a character's present choices", wrong: ["To confuse the reader on purpose", "To repeat the same event", "To skip the ending"], hint: "Showing the past can explain why a character acts as they do now." },
  { prompt: "Why might a writer use juxtaposition?", right: "To highlight a contrast so the reader notices a difference", wrong: ["To make two ideas sound identical", "To shorten the story", "To change the narrator"], hint: "Putting opposites together makes each stand out more." },
  { prompt: "Why might an author use an analogy in an explanation?", right: "To explain an unfamiliar idea through a familiar one", wrong: ["To avoid explaining anything", "To make the text rhyme", "To hide the main idea"], hint: "A familiar comparison helps the reader understand something new." },
  { prompt: "Why might a writer allude to a well-known story?", right: "To add meaning quickly by drawing on what readers already know", wrong: ["To prove the story is true", "To avoid using description", "To make the text shorter than a sentence"], hint: "A single reference can bring a whole story's feelings along with it." },
  { prompt: "“Learning to code is like learning to cook: you start with simple recipes and slowly build your own.” What is this device?", right: "analogy", wrong: ["flashback", "allusion", "juxtaposition"], hint: "The writer explains one process by comparing it to another process." },
  { prompt: "A story shows a cramped, noisy apartment on one page and a silent mansion on the next. Which device is at work?", right: "juxtaposition", wrong: ["flashback", "analogy", "allusion"], hint: "Two settings are set side by side so the reader compares them." },
  { prompt: "A chapter opens on a stormy night, then jumps to “three years earlier,” when the characters were laughing at a picnic. What is this device?", right: "flashback", wrong: ["juxtaposition", "allusion", "analogy"], hint: "The jump back in time is a flashback." },
];

const DEVICE_PASSAGES: Passage[] = [
  {
    title: "The Key",
    text: [
      "Noor held the brass key in the palm of her hand and felt the cold go up her arm.",
      "She was suddenly eight again, standing on her grandmother's porch in the rain. Back then, the key had belonged to a gate that never seemed to open. Her grandmother had said, “Some things are only locked until you are ready.”",
      "Now Noor stood in front of the same gate, older and quieter. The garden beyond it was overgrown. Beside the broken fountain, a single new tulip stood bright red.",
    ],
    questions: [
      { prompt: "Which device does the paragraph beginning “She was suddenly eight again” show?", right: "flashback", wrong: ["analogy", "juxtaposition", "allusion"], hint: "The story jumps back to an earlier time." },
      { prompt: "Why does the writer include the flashback?", right: "It shows why the key and the gate matter to Noor", wrong: ["It changes the story's setting for good", "It introduces a new narrator", "It makes the story funnier"], hint: "The memory gives the key emotional meaning." },
      { prompt: "What does the bright tulip beside the broken fountain suggest?", right: "A sign of new life in a place that has been neglected", wrong: ["The garden is dangerous", "Noor wants to leave", "The gate is locked forever"], hint: "A single bright flower is set against the broken, overgrown garden." },
      { prompt: "The new tulip next to the broken fountain is an example of which device?", right: "juxtaposition", wrong: ["flashback", "analogy", "allusion"], hint: "Two contrasting images sit side by side." },
    ],
  },
  {
    title: "Lunch Rush",
    text: [
      "In the cafeteria, a hundred voices bounced off the walls. Trays clattered. Somebody laughed too loudly.",
      "At the corner table, Ravi sat with an untouched sandwich and watched the door. The noise rushed past him like traffic past a bus shelter.",
      "In the quiet hallway outside, Lena's sneakers squeaked once, twice. She paused, and then went in.",
    ],
    questions: [
      { prompt: "“The noise rushed past him like traffic past a bus shelter” compares which two things?", right: "the noise around Ravi and traffic going by someone who is standing still", wrong: ["the noise and the cafeteria walls", "Ravi and his sandwich", "Lena and the hallway"], hint: "The comparison shows Ravi staying still while everything moves around him." },
      { prompt: "What does the writer set side by side in the first and third paragraphs?", right: "a loud cafeteria and a quiet hallway", wrong: ["a sandwich and a tray", "two different schools", "the past and the future"], hint: "One place is full of noise and the other is quiet." },
      { prompt: "What is the main effect of the comparison to a bus shelter?", right: "It shows how still and apart Ravi feels", wrong: ["It shows he is late for a bus", "It makes the cafeteria seem calm", "It tells us the ending"], hint: "A bus shelter stays put while traffic moves." },
    ],
  },
];

function devices(): Question[] {
  return shuffle([...fromBank(DEVICES, 5), ...passageQuestions(DEVICE_PASSAGES, "passage", 3)]);
}

// ---------- Digital and media literacy ----------

const DIGITAL: BankItem[] = [
  { prompt: "Misinformation is…", right: "false information shared without meaning to mislead", wrong: ["false information spread on purpose to mislead", "information that is always true", "private information about a person"], hint: "Misinformation is a mistake. Disinformation is false information shared on purpose." },
  { prompt: "Disinformation is…", right: "false information spread on purpose to mislead", wrong: ["a mistake someone made by accident", "a true story told with humour", "advertising for a product"], hint: "The word to look for is on purpose." },
  { prompt: "You read a startling claim on a site you do not know. What is the best first step?", right: "Search for what other trusted sources say about the claim and the site", wrong: ["Share it right away so others can check it", "Trust it because it has many likes", "Trust it because the site looks professional"], hint: "Checking what others say about a source before you trust it is a strong habit." },
  { prompt: "A social media feed shows you posts based on what you liked before. This is an example of…", right: "curated information", wrong: ["a random sample of all posts", "a printed encyclopedia", "an unbiased news report"], hint: "Curated content has been chosen and ordered for you, and may leave out other views." },
  { prompt: "Which password is the strongest?", right: "Blue!Canoe7Maple", wrong: ["password123", "Jay2010", "12345678"], hint: "A longer mix of words, symbols and numbers is harder to guess than a name, a year or a simple sequence." },
  { prompt: "An email says your account will close unless you click a link and enter your password. What should you do?", right: "Not click, and contact the company through its official app or website", wrong: ["Click the link and enter your password quickly", "Forward it to all your friends", "Reply with your password to be safe"], hint: "This is a typical phishing message. Never enter your password from an unexpected link." },
  { prompt: "Which of these is safest to put on a public profile?", right: "Your favourite book", wrong: ["Your home address", "Your password", "Your full birth date and phone number"], hint: "Personal details can be used to find or impersonate you." },
  { prompt: "Why should you cite your sources?", right: "To credit the creators and let readers check the information", wrong: ["To make the project longer", "To hide where you found things", "Only because teachers ask"], hint: "Citing is both fair to the creator and helpful to your reader." },
  { prompt: "You want to use a photo from the internet in a class presentation. What should you check?", right: "Its licence or permission to use it", wrong: ["Whether it is the biggest photo you can find", "Whether it has a watermark", "Nothing: anything online is free to use"], hint: "Creators have rights to their work. A licence says how it may be used." },
  { prompt: "Which detail helps you decide whether a web page is current?", right: "The date it was published or last updated", wrong: ["The number of ads on it", "The colour of its menu", "The length of its web address"], hint: "Old information may no longer be accurate." },
  { prompt: "A chatbot gives you a statistic for your report. What is the best next step?", right: "Check it against a reliable source before using it", wrong: ["Use it because it sounds confident", "Delete the rest of your research", "Assume it is correct if it has a number"], hint: "Tools can sound sure while being wrong. Verify facts before you use them." },
  { prompt: "A headline reads “SHOCKING!” and the article has no author, date or sources. What does this suggest?", right: "It may not be credible and should be checked", wrong: ["It must be true because it is exciting", "It is the newest information", "It is written by an expert"], hint: "Missing author, date and sources are warning signs." },
  { prompt: "Before you post a photo of a friend, what should you do?", right: "Ask for their permission", wrong: ["Post it first and ask later", "Assume it is fine if they smiled", "Tag everyone you can"], hint: "A friend's image and privacy are theirs to decide about." },
  { prompt: "Which source is most reliable for facts about vaccine safety?", right: "A public health agency page that lists its studies", wrong: ["An anonymous forum post", "A company's advertisement", "A friend's short video"], hint: "Reliable sources show their evidence and are accountable for accuracy." },
];

function digital(): Question[] {
  return fromBank(DIGITAL, 8);
}

// ---------- Revising and editing ----------

const REVISE: BankItem[] = [
  { prompt: "Which revision is the most concise? “Due to the fact that it was raining, the game was cancelled.”", right: "Because it was raining, the game was cancelled.", wrong: ["The game was cancelled due to the fact that it was raining outside.", "Because of the fact that rain was falling, the game was cancelled.", "It was raining outside, which is the reason why the game was cancelled."], hint: "Replace wordy phrases like due to the fact that with a single word." },
  { prompt: "Choose the best transition. “The trail was steep. ____, we reached the summit before noon.”", right: "Even so", wrong: ["For example", "Similarly", "In addition"], hint: "The second sentence is a surprise given the first, so the transition shows contrast." },
  { prompt: "Choose the best transition. “She trained every morning for six months. ____, she won the race.”", right: "As a result", wrong: ["On the other hand", "For instance", "Meanwhile"], hint: "Her winning is an effect of her training." },
  { prompt: "Why is this sentence unclear? “When Leo met Sam, he smiled.”", right: "The word he could refer to either boy", wrong: ["The verb is in the wrong tense", "A comma is missing after smiled", "Leo should not be capitalized"], hint: "An unclear pronoun reference confuses the reader." },
  { prompt: "Which sentence would make the best topic sentence for a paragraph about the benefits of walking to school?", right: "Walking to school gives students exercise, fresh air and time with friends.", wrong: ["I walk to school.", "There are many schools in my city.", "My shoes were new last week."], hint: "A topic sentence states the main idea the rest of the paragraph supports." },
  { prompt: "A peer says your conclusion feels rushed. Which revision would help most?", right: "Add a sentence that sums up your main point and why it matters", wrong: ["Add a new topic that you have not discussed", "Delete the introduction", "Repeat your title three times"], hint: "A strong conclusion reminds readers of your main idea and leaves them with something to think about." },
  { prompt: "A spell-checker did not flag “I went to there house.” Why not?", right: "There is a real word, so it must be caught by reading carefully", wrong: ["The spell-checker is always broken", "House is spelled wrong", "Spell-checkers only check capital letters"], hint: "Spell-checkers miss words that are spelled correctly but used incorrectly." },
  { prompt: "Which sentence uses its and it's correctly?", right: "It's clear that the dog wagged its tail.", wrong: ["Its clear that the dog wagged it's tail.", "It's clear that the dog wagged it's tail.", "Its clear that the dog wagged its' tail."], hint: "It's means it is. Its shows ownership." },
  { prompt: "Which sentence uses effect or affect correctly?", right: "The new schedule will affect the effect of the lesson.", wrong: ["The new schedule will effect the affect of the lesson.", "The new schedule will affect the affect of the lesson.", "The new schedule will effect the effect of the lesson."], hint: "Affect is usually a verb meaning to influence. Effect is usually a noun meaning a result." },
  { prompt: "Which is the standard Canadian spelling?", right: "neighbour", wrong: ["neighbor", "nieghbour", "naybour"], hint: "Canadian English keeps the u in words such as colour, neighbour and favour." },
  { prompt: "Which is the standard Canadian spelling?", right: "centre", wrong: ["center", "centr", "cetre"], hint: "Canadian English uses -re in words such as centre, metre and theatre." },
  { prompt: "Which sentence uses practise or practice correctly in Canadian English?", right: "I need to practise my piano before band practice.", wrong: ["I need to practice my piano before band practise.", "I need to practise my piano before band practise.", "I need to practice my piano before band practice."], hint: "In Canada, practise is the verb and practice is the noun." },
  { prompt: "Which sentence uses a licence or license correctly in Canadian English?", right: "She needs a licence to license the software.", wrong: ["She needs a license to licence the software.", "She needs a licence to licence the software.", "She needs a license to license the software."], hint: "In Canada, licence is the noun and license is the verb." },
  { prompt: "Which revision fixes the tense shift and keeps the story in the past? “Jay opens the door and walked inside.”", right: "Jay opened the door and walked inside.", wrong: ["Jay opens the door and walks inside.", "Jay opened the door and walks inside.", "Jay is opening the door and walked inside."], hint: "Keep the verbs in one tense. Opened and walked are both past tense." },
  { prompt: "Which sentence is a run-on?", right: "The bus was late we missed the start.", wrong: ["The bus was late, so we missed the start.", "The bus was late; we missed the start.", "Because the bus was late, we missed the start."], hint: "A run-on joins two complete sentences with no punctuation or conjunction." },
];

function revise(): Question[] {
  return fromBank(REVISE, 8);
}

// ---------- Text forms and features ----------

const FORMS: BankItem[] = [
  { prompt: "Which feature of a nonfiction book helps readers find a topic quickly?", right: "The index", wrong: ["The dedication", "The copyright page", "The cover blurb"], hint: "An index lists topics alphabetically with page numbers." },
  { prompt: "What is a footnote used for?", right: "To give extra information or a source at the bottom of the page", wrong: ["To show the title of the book", "To list every chapter", "To thank the author"], hint: "A footnote sits at the foot of the page and is linked by a small number." },
  { prompt: "Where would you find the year a book was published and who holds its rights?", right: "On the copyright page", wrong: ["In the table of contents", "In the glossary", "In the index"], hint: "Copyright information appears near the front of a book." },
  { prompt: "Which pair of signal words shows a compare and contrast pattern?", right: "similarly, however", wrong: ["first, next", "because, as a result", "for example, such as"], hint: "Similarly points to likeness and however points to difference." },
  { prompt: "Which pair of signal words shows a cause and effect pattern?", right: "because, as a result", wrong: ["first, next", "similarly, however", "on the other hand, in contrast"], hint: "These words link a reason with what happened." },
  { prompt: "Which feature is typical of an expository essay?", right: "A thesis statement supported by evidence", wrong: ["Dialogue between characters", "Rhyming couplets", "Stage directions"], hint: "Expository writing explains a main idea using facts and examples." },
  { prompt: "Which text form is made up of dialogue and stage directions?", right: "A script", wrong: ["A news article", "A biography", "A recipe"], hint: "A script is written to be performed." },
  { prompt: "Which statement about cultural text forms is accurate?", right: "Some communities share knowledge through spoken stories, songs and art, and these are valid texts", wrong: ["Only printed books count as real texts", "Oral stories cannot be analysed", "Songs and art are never text forms"], hint: "A text is anything that communicates meaning, including oral, visual and musical forms." },
  { prompt: "A bar graph in a news article is mainly used to…", right: "show and compare data at a glance", wrong: ["tell a story with characters", "give the author's biography", "list the sources alphabetically"], hint: "Graphics can present numbers more clearly than a paragraph can." },
  { prompt: "Why might a designer choose a close-up photo of a worried face for an article?", right: "To draw attention to emotion", wrong: ["To show the whole setting", "To make the text easier to read", "To list the facts"], hint: "A close-up focuses the viewer on a person's feelings." },
  { prompt: "A website for young children uses bright colours and rounded fonts. What tone does this design create?", right: "Friendly and inviting", wrong: ["Formal and serious", "Cold and technical", "Threatening"], hint: "Colours and fonts send messages about tone, just as word choice does." },
  { prompt: "What does a caption do?", right: "Explains or adds information about an image", wrong: ["Replaces the title of the article", "Lists the author's sources", "Shows where the page ends"], hint: "A caption sits beside or below a picture to explain it." },
  { prompt: "What is a hyperlink in an online article used for?", right: "To connect readers to related information or a source", wrong: ["To change the font", "To count the words", "To hide the author's name"], hint: "Clicking a link takes you to another page." },
  { prompt: "Two news sites report the same event with different headlines. What is the most likely reason?", right: "They have different purposes or target audiences", wrong: ["Only one of them is a real website", "Headlines are chosen at random", "One of them has no photos"], hint: "Creators shape their message for a particular audience and purpose." },
  { prompt: "Which pattern organizes information in time order?", right: "Sequence (chronological order)", wrong: ["Compare and contrast", "Problem and solution", "Cause and effect"], hint: "Sequence follows events from first to last." },
];

function forms(): Question[] {
  return fromBank(FORMS, 8);
}

export const units: Unit[] = [
  {
    id: "word-parts-9",
    title: "Word Detective",
    emoji: "🧩",
    blurb: "Roots, prefixes and meaning in context",
    standards: on("B2.1, B2.2", "word parts (bases, prefixes and suffixes) and vocabulary in context and in other subjects"),
    parentNote: "Using prefixes, suffixes and Latin and Greek bases to work out new words, choosing a meaning from the sentence around a word, and subject words like product, mass and scale.",
    generate: words,
  },
  {
    id: "devices-9",
    title: "Literary Devices",
    emoji: "🎬",
    blurb: "Allusion, analogy, juxtaposition, flashback",
    standards: on("C3.1", "allusion, analogy, juxtaposition and flashback"),
    parentNote: "Spotting allusion (a reference to something well known), analogy, juxtaposition (contrasts side by side) and flashback in short original excerpts, and explaining why a writer chooses them.",
    generate: devices,
  },
  {
    id: "digital-9",
    title: "Digital Smarts",
    emoji: "🔒",
    blurb: "Trust, privacy and credible sources",
    standards: on("A2.2, A2.3, D1.3", "online safety and privacy, misinformation and disinformation, and judging sources"),
    parentNote: "Telling misinformation from disinformation, checking sources before trusting them, managing passwords and privacy, spotting phishing, and citing and using other people's work respectfully.",
    generate: digital,
  },
  {
    id: "revise-edit-9",
    title: "Revise & Edit",
    emoji: "🖍️",
    blurb: "Clear, concise and correct",
    standards: on("D2.5, D2.6", "revising for clarity and coherence, and editing for spelling, punctuation and grammar"),
    parentNote: "Making sentences more concise, choosing transitions, fixing unclear pronouns and tense shifts, catching errors a spell-checker misses, and Canadian spelling such as colour, centre, practise and licence.",
    generate: revise,
  },
  {
    id: "forms-features-9",
    title: "Forms & Features",
    emoji: "📰",
    blurb: "Text patterns, visuals and media",
    standards: on("C1.2, C1.3, C1.4, A2.4", "text forms, patterns and features, and how visuals and design help create meaning"),
    parentNote: "Knowing what each text form does, how features such as an index, footnote or caption help readers, how signal words show a text's pattern, and how images, colour and design shape meaning.",
    generate: forms,
  },
];
