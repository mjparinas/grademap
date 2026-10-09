import { fromBank, type BankItem } from "../bank";
import { shuffle } from "../random";
import type { Question, Unit } from "../types";
import { on, type Passage, passageQuestions } from "./kit";

// Ontario Grade 7 language (2023 curriculum). BC's literary devices, close reading, tone, persuasion,
// source-checking, clause, modifier and punctuation units are shared; these units cover the
// grammar, punctuation, text patterns and point of view Ontario names for Grade 7.

// ---------- Grammar ----------

const GRAMMAR: BankItem[] = [
  { prompt: "Which word is the indirect object? Maya gave her cousin a gift.", right: "cousin", wrong: ["gift", "gave"], hint: "The indirect object tells who receives the direct object. Ask: gave a gift to whom?" },
  { prompt: "Which word is the direct object? Leo handed Ana the map.", right: "map", wrong: ["Ana", "handed"], hint: "The direct object is the thing that is handed. Ana receives it." },
  { prompt: "Which word is the indirect object? The coach showed the team a new play.", right: "team", wrong: ["play", "showed"], hint: "Ask: showed a new play to whom?" },
  { prompt: "Which sentence has an indirect object?", right: "Mom bought Sam new boots.", wrong: ["Mom bought new boots.", "Mom bought boots for the winter."], hint: "Sam receives the boots, and there is no word like to or for before Sam." },
  { prompt: "Which word is a predicate noun? Ms. Kaur is our principal.", right: "principal", wrong: ["Ms. Kaur", "is"], hint: "A predicate noun comes after a linking verb and renames the subject." },
  { prompt: "Which word is a predicate adjective? The soup smells delicious.", right: "delicious", wrong: ["soup", "smells"], hint: "A predicate adjective follows a linking verb and describes the subject." },
  { prompt: "Which word is a predicate adjective? The sky grew dark.", right: "dark", wrong: ["sky", "grew"], hint: "Grew links the subject to a word that describes it." },
  { prompt: "Which word is a predicate noun? Her brother became a pilot.", right: "pilot", wrong: ["brother", "became"], hint: "Pilot renames the brother after the linking verb became." },
  { prompt: "Which sentence has a predicate adjective?", right: "The lake looks calm.", wrong: ["The lake is in Ontario.", "We swam in the lake."], hint: "Calm describes the lake after the linking verb looks." },
  { prompt: "Which word is a participle? The sleeping baby smiled.", right: "sleeping", wrong: ["baby", "smiled"], hint: "A participle is a verb form used as an adjective. Here it describes the baby." },
  { prompt: "Which word is a participle? We found the broken window.", right: "broken", wrong: ["found", "window"], hint: "Broken is a verb form that describes the window." },
  { prompt: "Which phrase is a participial phrase? Running down the hill, Jay waved.", right: "Running down the hill", wrong: ["Jay waved", "down the hill, Jay"], hint: "It begins with a participle and describes Jay." },
  { prompt: "Which word does the participial phrase describe? Tired from the long hike, Noor fell asleep.", right: "Noor", wrong: ["hike", "asleep"], hint: "Who was tired? The phrase describes the person." },
  { prompt: "Which part is an adverbial phrase? We left after the storm ended.", right: "after the storm ended", wrong: ["We left", "the storm"], hint: "An adverbial phrase tells when, where, how or why." },
  { prompt: "What does the adverbial phrase tell? The team practised in the gym.", right: "where", wrong: ["when", "why"], hint: "In the gym tells the place." },
  { prompt: "What does the adverbial phrase tell? She spoke with great care.", right: "how", wrong: ["where", "when"], hint: "With great care tells the way she spoke." },
  { prompt: "What does the adverbial phrase tell? We stayed inside because of the rain.", right: "why", wrong: ["where", "how"], hint: "Because of the rain gives the reason." },
  { prompt: "Which word is a linking verb? The bread tastes fresh.", right: "tastes", wrong: ["bread", "fresh"], hint: "Here tastes links the subject to a word that describes it." },
  { prompt: "Which word is the indirect object? Priya sent her grandmother a postcard.", right: "grandmother", wrong: ["postcard", "sent"], hint: "Ask: sent a postcard to whom?" },
  { prompt: "Which word is the direct object? The teacher gave the class a quiz.", right: "quiz", wrong: ["class", "gave"], hint: "The direct object is the thing that was given." },
  { prompt: "Which word is a predicate adjective? The gym felt warm.", right: "warm", wrong: ["gym", "felt"], hint: "Felt links the gym to a word that describes it." },
  { prompt: "Which word is a predicate noun? Zoe remained the team captain.", right: "captain", wrong: ["Zoe", "remained"], hint: "Captain renames Zoe after the linking verb remained." },
  { prompt: "Which word is a participle? The burning log crackled.", right: "burning", wrong: ["log", "crackled"], hint: "Burning describes the log, so it works as an adjective." },
  { prompt: "Which word does the participial phrase describe? Waving to the crowd, Kenji walked on stage.", right: "Kenji", wrong: ["crowd", "stage"], hint: "Who was waving? The phrase describes the person." },
  { prompt: "What does the adverbial phrase tell? Ana arrived before the bell rang.", right: "when", wrong: ["where", "how"], hint: "Before the bell rang tells the time." },
  { prompt: "What does the adverbial phrase tell? They hung the banner above the door.", right: "where", wrong: ["when", "why"], hint: "Above the door tells the place." },
  { prompt: "Which word is a linking verb? The night became cold.", right: "became", wrong: ["night", "cold"], hint: "Became links the subject to a word that describes it." },
  { prompt: "Which phrase is a participial phrase? Frightened by the thunder, the dog hid.", right: "Frightened by the thunder", wrong: ["the dog hid", "by the thunder, the dog"], hint: "It begins with a participle and describes the dog." },
  { prompt: "Which sentence has a direct object and an indirect object?", right: "Lena told Amir a joke.", wrong: ["Lena laughed loudly.", "Lena is funny."], hint: "A joke is told, and Amir receives it." },
  { prompt: "Which sentence has a predicate noun?", right: "Noah is a talented drummer.", wrong: ["Noah drums loudly.", "Noah is in the band room."], hint: "Drummer renames Noah after the linking verb." },
];

function grammar(): Question[] {
  return fromBank(GRAMMAR, 8);
}

// ---------- Punctuation ----------

const PUNCTUATION: BankItem[] = [
  { prompt: "Which sentence introduces a quotation correctly?", right: "Her answer was clear: “I will not give up.”", wrong: ["Her answer was clear; “I will not give up.”", "Her answer was: “I will not give up.”"], hint: "Use a colon after a complete sentence to introduce a quotation." },
  { prompt: "Which sentence uses a colon correctly to introduce a quotation?", right: "The poster said it best: “Be kind.”", wrong: ["The poster said, it best: “Be kind.”", "The poster said it best; “Be kind.”"], hint: "The words before the colon must be a complete sentence." },
  { prompt: "Which sentence joins two independent clauses correctly?", right: "The bus was late; we missed the start.", wrong: ["The bus was late; because we missed the start.", "The bus was late; and missed the start."], hint: "A semicolon separates two complete sentences. Each side must be able to stand alone." },
  { prompt: "Which sentence uses a semicolon correctly?", right: "Rain fell all day; the game was cancelled.", wrong: ["Rain fell all day; cancelled.", "Rain; fell all day, the game was cancelled."], hint: "Both sides of a semicolon are complete sentences." },
  { prompt: "Which sentence punctuates the conjunctive adverb correctly?", right: "I studied hard; however, the test was tough.", wrong: ["I studied hard; however the test was tough.", "I studied hard, however, the test was tough."], hint: "Put a semicolon before however and a comma after it when it joins two sentences." },
  { prompt: "Which sentence uses commas around the conjunctive adverb correctly?", right: "The trail, therefore, was closed.", wrong: ["The trail therefore, was closed.", "The trail, therefore was closed."], hint: "Set off a word like therefore with commas on both sides when it interrupts a sentence." },
  { prompt: "Which sentence is punctuated correctly?", right: "We were tired; nevertheless, we kept going.", wrong: ["We were tired, nevertheless, we kept going.", "We were tired nevertheless; we kept going."], hint: "A semicolon comes before nevertheless and a comma comes after." },
  { prompt: "What does the ellipsis (…) show here? “I think … we should go,” said Kai.", right: "a pause or something left out", wrong: ["a question", "a title"], hint: "Three dots show words left out or a pause." },
  { prompt: "What do the dashes show? The answer—if there is one—is not easy.", right: "an interruption or break in the sentence", wrong: ["a list of items", "the end of the sentence"], hint: "A pair of dashes sets off an interrupting thought." },
  { prompt: "Which sentence uses a dash to show a sudden break?", right: "I was sure it was—wait, listen!", wrong: ["I was sure—it was wait listen!", "I was—sure it—was wait, listen."], hint: "A dash marks the place where a thought breaks off." },
  { prompt: "A writer leaves out part of a quotation. Which mark shows the omission?", right: "an ellipsis", wrong: ["a colon", "a semicolon"], hint: "Three dots stand for the missing words." },
  { prompt: "Which word is a conjunctive adverb?", right: "however", wrong: ["because", "and"], hint: "Conjunctive adverbs link ideas between sentences. Because and and are conjunctions." },
  { prompt: "Which is a conjunctive adverb?", right: "meanwhile", wrong: ["although", "but"], hint: "Meanwhile links two sentences and is followed by a comma." },
  { prompt: "Which sentence is punctuated correctly?", right: "It was late; still, we stayed.", wrong: ["It was late: still we stayed.", "It was late, still; we stayed."], hint: "Semicolon before the conjunctive adverb, comma after it." },
  { prompt: "Which sentence introduces a list correctly?", right: "Pack these items: a flashlight, a map and a snack.", wrong: ["Pack these items; a flashlight, a map and a snack.", "Pack: these items a flashlight, a map and a snack."], hint: "A colon follows a complete statement before a list." },
  { prompt: "Which sentence uses a semicolon correctly?", right: "Maya loves art; her sister prefers music.", wrong: ["Maya loves art; and her sister prefers music.", "Maya; loves art her sister prefers music."], hint: "A semicolon joins two related independent clauses." },
  { prompt: "Which sentence is punctuated correctly?", right: "The path was icy; therefore, we walked slowly.", wrong: ["The path was icy, therefore, we walked slowly.", "The path was icy therefore; we walked slowly."], hint: "Use a semicolon before the conjunctive adverb and a comma after it." },
  { prompt: "Which sentence uses a dash to add emphasis?", right: "She had one wish—to win.", wrong: ["She had one wish to—win.", "She—had one wish to win."], hint: "A dash can set off a final, emphasized idea." },
  { prompt: "What does the ellipsis show? “Well … maybe,” said Jay.", right: "a hesitation", wrong: ["a list", "a title"], hint: "Three dots can show a pause." },
  { prompt: "Which sentence uses a colon correctly?", right: "Remember this rule: always read the question twice.", wrong: ["Remember: this rule always read the question twice.", "Remember this: rule always read: the question twice."], hint: "A colon comes after a full independent clause." },
  { prompt: "Which sentence is punctuated correctly?", right: "The movie was long; however, I enjoyed it.", wrong: ["The movie was long; however I enjoyed it.", "The movie was long however; I enjoyed it."], hint: "Put a semicolon before however and a comma after it." },
  { prompt: "Which sentence shows an interruption with dashes?", right: "My cousin—the one who plays hockey—is visiting.", wrong: ["My cousin—the one who plays hockey is visiting.", "My—cousin the one who plays hockey—is visiting."], hint: "A pair of dashes goes on both sides of the interruption." },
  { prompt: "Which pair of sentences can be joined with a semicolon?", right: "The store was closed. We went home.", wrong: ["Because the store was closed. We went home.", "The store. Closed."], hint: "Each part must be a complete sentence on its own." },
  { prompt: "Which word is a conjunctive adverb?", right: "consequently", wrong: ["since", "or"], hint: "A conjunctive adverb links two independent clauses and shows the relationship." },
  { prompt: "Which mark best shows a trailing-off voice? “I just thought …”", right: "ellipsis", wrong: ["colon", "semicolon"], hint: "Three dots show the voice fading." },
  { prompt: "Which sentence is punctuated correctly?", right: "The room was quiet; everyone was reading.", wrong: ["The room was quiet, everyone was reading.", "The room was; quiet everyone was reading."], hint: "A semicolon links two related complete ideas." },
  { prompt: "Which sentence uses a colon to introduce a quotation correctly?", right: "Coach said one thing: “Never stop trying.”", wrong: ["Coach said; one thing “Never stop trying.”", "Coach said one thing “Never: stop trying.”"], hint: "A colon follows the complete clause that introduces the quotation." },
  { prompt: "Which sentence uses commas around a conjunctive adverb correctly?", right: "Our team, however, won the game.", wrong: ["Our team however, won the game.", "Our, team however won the game."], hint: "Set off a conjunctive adverb in the middle of a sentence with commas." },
];

function punctuation(): Question[] {
  return fromBank(PUNCTUATION, 8);
}

// ---------- Text patterns and features ----------

const FEATURES: BankItem[] = [
  { prompt: "What does a bibliography list?", right: "the sources the writer used", wrong: ["the main characters", "the words in the glossary"], hint: "It usually comes at the end of a report." },
  { prompt: "Why do writers include a bibliography?", right: "to give credit and let readers find the sources", wrong: ["to make the report longer", "to add pictures"], hint: "It shows where the information came from." },
  { prompt: "Why might a text use a large, simple, clear font?", right: "so more people can read it easily", wrong: ["to hide the meaning", "to make it look old"], hint: "Accessible fonts help readers, including those who find reading hard." },
  { prompt: "Which feature helps readers who have low vision?", right: "large print with strong contrast", wrong: ["small decorative letters", "light grey text on white"], hint: "Strong contrast makes letters easy to see." },
  { prompt: "Which word often signals a cause?", right: "because", wrong: ["however", "finally"], hint: "Because tells why something happened." },
  { prompt: "Which word often signals an effect?", right: "as a result", wrong: ["for example", "in contrast"], hint: "As a result tells what happened because of something." },
  { prompt: "Which pattern shows why something happens and what happens next?", right: "cause and effect", wrong: ["compare and contrast", "chronological order"], hint: "A cause makes an effect happen." },
  { prompt: "In this sentence, what is the effect? Heavy rain flooded the road, so the bus was late.", right: "The bus was late.", wrong: ["Heavy rain fell.", "The road was built."], hint: "The effect is what happened because of the cause. So points to it." },
  { prompt: "In this sentence, what is the cause? The lights went out because a branch hit the power line.", right: "A branch hit the power line.", wrong: ["The lights went out.", "It was dark."], hint: "The cause comes after because." },
  { prompt: "Which text feature would help you find a topic quickly in a long book?", right: "the index", wrong: ["the cover colour", "the dedication"], hint: "It lists topics with page numbers in alphabetical order." },
  { prompt: "What is a glossary?", right: "a list of key words with meanings", wrong: ["a list of sources", "a map of the book"], hint: "It is like a small dictionary for the text." },
  { prompt: "Which pattern are these signal words for? first, next, then, finally", right: "sequence", wrong: ["cause and effect", "compare and contrast"], hint: "They put events in order." },
];

const PATTERN_PASSAGES: Passage[] = [
  {
    title: "Why Wetlands Matter",
    text: [
      "When a wetland is drained, rain has nowhere to soak in. As a result, nearby streets and fields flood more often.",
      "Wetlands also clean water. Plants hold the soil, so less mud washes into rivers. Because of this, fish and frogs have clearer water to live in.",
    ],
    questions: [
      { prompt: "What text pattern does this passage mostly use?", right: "cause and effect", wrong: ["compare and contrast", "chronological order"], hint: "It shows what happens because of something else." },
      { prompt: "What happens when a wetland is drained?", right: "Nearby areas flood more often.", wrong: ["Fish grow larger.", "Rivers dry up completely."], hint: "Look at the second sentence." },
      { prompt: "Which phrase signals an effect?", right: "As a result", wrong: ["Wetlands also", "rain"], hint: "It points to what happens next." },
      { prompt: "Why do fish and frogs have clearer water?", right: "Plants hold the soil.", wrong: ["Wetlands are drained.", "More rain falls."], hint: "The plants keep mud from washing into rivers." },
    ],
  },
  {
    title: "Less Sleep, Lower Scores",
    text: [
      "A school survey found that students who slept fewer than seven hours had more trouble paying attention. Because they were tired, many missed instructions and made careless errors.",
      "Therefore, the council suggests a later start time. Sources for this report are listed in the bibliography below.",
    ],
    questions: [
      { prompt: "What is the cause of students making careless errors?", right: "being tired", wrong: ["a later start time", "the survey"], hint: "Because they were tired, many made careless errors." },
      { prompt: "What does the word Therefore introduce?", right: "a conclusion based on the evidence", wrong: ["a list of sources", "a joke"], hint: "It tells what follows from what came before." },
      { prompt: "What does the bibliography show?", right: "where the information came from", wrong: ["how long students slept", "who is on the council"], hint: "Sources for the report are listed there." },
      { prompt: "What pattern does the first paragraph use?", right: "cause and effect", wrong: ["sequence", "compare and contrast"], hint: "Tiredness causes errors." },
    ],
  },
  {
    title: "The Great Lakes Freeze",
    text: [
      "In cold winters, ice forms first in shallow bays. Next, it spreads across open water when the wind is calm. Finally, by February, much of Lake Erie can be covered.",
      "Lake Erie freezes more than Lake Ontario because it is shallower and holds less heat.",
    ],
    questions: [
      { prompt: "Which word shows time order?", right: "Next", wrong: ["because", "more"], hint: "Next, first and finally put events in order." },
      { prompt: "Why does Lake Erie freeze more than Lake Ontario?", right: "It is shallower and holds less heat.", wrong: ["It is much longer.", "It has less wind."], hint: "The last sentence gives the cause." },
      { prompt: "Where does ice form first?", right: "in shallow bays", wrong: ["in open water", "in the deepest part"], hint: "The first sentence says it." },
      { prompt: "Which two patterns are used in this text?", right: "sequence, and cause and effect", wrong: ["problem and solution, and description", "compare only, and list"], hint: "The first paragraph orders events. The second explains a cause." },
    ],
  },
  {
    title: "Reading Made Easier",
    text: [
      "The library redesigned its posters. It chose a large, plain font and dark text on a light background. Headings are bold, and short lines are left-aligned.",
      "Since the change, more readers, including people with dyslexia and low vision, say the posters are easy to read.",
    ],
    questions: [
      { prompt: "Why did the library choose a plain font?", right: "to make the posters easier to read", wrong: ["to save ink", "to look old-fashioned"], hint: "The passage says readers find them easier." },
      { prompt: "Which is an accessible text feature in the passage?", right: "dark text on a light background", wrong: ["small curly letters", "pale yellow text on white"], hint: "Strong contrast helps readers." },
      { prompt: "What effect did the redesign have?", right: "More readers find the posters easy to read.", wrong: ["The library closed.", "The posters were removed."], hint: "Look at the second paragraph." },
      { prompt: "Which word signals a cause-and-effect link?", right: "Since", wrong: ["bold", "left-aligned"], hint: "Since can mean because." },
    ],
  },
];

function patterns(): Question[] {
  return shuffle([...fromBank(FEATURES, 4), ...passageQuestions(PATTERN_PASSAGES, "passage", 4)]);
}

// ---------- Point of view ----------

const VIEW_PASSAGES: Passage[] = [
  {
    title: "The Last Bus",
    text: [
      "I ran as fast as I could, but the bus doors closed in front of me. My heart sank. I would have to walk home in the dark.",
    ],
    questions: [
      { prompt: "What point of view is this?", right: "first person", wrong: ["second person", "third person"], hint: "The narrator says I and my." },
      { prompt: "Which words show the point of view?", right: "I and my", wrong: ["you and your", "she and her"], hint: "First person uses I, me and my." },
      { prompt: "How would the story change if the bus driver told it?", right: "We might learn why the driver did not wait.", wrong: ["Nothing would change.", "It would be told by you."], hint: "A different narrator shows different thoughts." },
    ],
  },
  {
    title: "Pack Your Bag",
    text: [
      "You open your suitcase and stare at it. You have only an hour before the car arrives. You fold your jacket and wonder what you are forgetting.",
    ],
    questions: [
      { prompt: "What point of view is this?", right: "second person", wrong: ["first person", "third person"], hint: "The narrator speaks to you." },
      { prompt: "Which words show the point of view?", right: "you and your", wrong: ["I and my", "he and his"], hint: "Second person uses you and your." },
      { prompt: "How does second person affect the reader?", right: "It makes the reader feel part of the story.", wrong: ["It makes the story shorter.", "It hides the characters."], hint: "The reader is addressed directly." },
    ],
  },
  {
    title: "A Quiet Morning",
    text: [
      "Kiona woke before the others. She tiptoed past the sleeping dog, filled the kettle, and watched the sun climb above the trees. She did not yet know that today would change everything.",
    ],
    questions: [
      { prompt: "What point of view is this?", right: "third person", wrong: ["first person", "second person"], hint: "The narrator tells about Kiona using she." },
      { prompt: "Which sentence shows the narrator knows more than Kiona?", right: "She did not yet know that today would change everything.", wrong: ["She tiptoed past the sleeping dog.", "She filled the kettle."], hint: "Kiona does not know what will happen, but the narrator does." },
      { prompt: "If Kiona told this story herself, which pronoun would change?", right: "She would become I.", wrong: ["The dog would become we.", "Nothing would change."], hint: "First person uses I." },
    ],
  },
  {
    title: "The Referee",
    text: [
      "From the middle of the court, Mr. Alvarez blew his whistle. He saw the ball touch the line, but the crowd groaned. He was sure he had made the right call.",
    ],
    questions: [
      { prompt: "What point of view is this?", right: "third person", wrong: ["first person", "second person"], hint: "The narrator uses he and his." },
      { prompt: "Whose thoughts do we learn?", right: "Mr. Alvarez's", wrong: ["the crowd's", "the narrator's own"], hint: "He was sure he had made the right call." },
      { prompt: "How might a player telling this story differ?", right: "The player might think the call was unfair.", wrong: ["The ball would not exist.", "It would have no ending."], hint: "Different characters see events differently." },
    ],
  },
  {
    title: "The Science Fair",
    text: [
      "I carried my volcano model carefully down the hall. My hands were shaking, and I worried that the baking soda would spill before the judges arrived.",
    ],
    questions: [
      { prompt: "What point of view is this?", right: "first person", wrong: ["second person", "third person"], hint: "The narrator says I and my." },
      { prompt: "What does the reader learn about the narrator?", right: "The narrator is nervous.", wrong: ["The narrator is bored.", "The narrator is angry."], hint: "Shaking hands and worry show how the narrator feels." },
      { prompt: "Which change would put this in third person?", right: "Change I and my to she and her.", wrong: ["Change the volcano to a rocket.", "Add the word you."], hint: "Third person uses he, she or they." },
    ],
  },
  {
    title: "Lost in the Market",
    text: [
      "You push through the crowded market, searching for your sister's red scarf. The smell of fresh bread and spices makes you hungry, but you keep walking.",
    ],
    questions: [
      { prompt: "What point of view is this?", right: "second person", wrong: ["first person", "third person"], hint: "The narrator speaks to you." },
      { prompt: "Which detail is told in second person?", right: "You keep walking.", wrong: ["Sam keeps walking.", "I keep walking."], hint: "Look for you." },
      { prompt: "Why might an author use second person here?", right: "To pull the reader into the scene", wrong: ["To describe the narrator's past", "To make the market quiet"], hint: "The reader feels like the character." },
    ],
  },
];

const VIEW: BankItem[] = [
  { prompt: "A story is told with the words I, me and my. What point of view is it?", right: "first person", wrong: ["second person", "third person"], hint: "The narrator is a character in the story." },
  { prompt: "A story is told with the words he, she and they. What point of view is it?", right: "third person", wrong: ["first person", "second person"], hint: "The narrator tells about others." },
  { prompt: "A story speaks to the reader as you. What point of view is it?", right: "second person", wrong: ["first person", "third person"], hint: "You and your are the clues." },
  { prompt: "Why might an author choose first person?", right: "to share one character's thoughts closely", wrong: ["to describe every character's thoughts", "to avoid using pronouns"], hint: "The reader sees through one narrator's eyes." },
  { prompt: "Which sentence is written in second person?", right: "You hear a strange sound behind the door.", wrong: ["I hear a strange sound behind the door.", "Sam hears a strange sound behind the door."], hint: "Look for you." },
  { prompt: "Which sentence is written in first person?", right: "I opened the door slowly.", wrong: ["She opened the door slowly.", "You opened the door slowly."], hint: "Look for I." },
  { prompt: "A story is told by a narrator who knows what every character thinks. What is this called?", right: "omniscient third person", wrong: ["second person", "first person"], hint: "Omniscient means all-knowing." },
  { prompt: "A story is told by a narrator who only knows one character's thoughts. What is this called?", right: "limited third person", wrong: ["omniscient third person", "second person"], hint: "The narrator sticks to one character's mind." },
  { prompt: "Which sentence is written in third person?", right: "Ravi stared at the door.", wrong: ["I stared at the door.", "You stared at the door."], hint: "Look for a name or he/she/they." },
  { prompt: "How does first person help readers connect with a narrator?", right: "They hear the narrator's own voice and feelings.", wrong: ["They learn every character's secrets.", "The story becomes a list."], hint: "First person is the narrator's own telling." },
];

function view(): Question[] {
  return shuffle([...fromBank(VIEW, 3), ...passageQuestions(VIEW_PASSAGES, "passage", 5)]);
}

export const units: Unit[] = [
  {
    id: "grammar-7",
    title: "Grammar Gears",
    emoji: "⚙️",
    blurb: "Objects, participles and phrases",
    standards: on("B3.2", "indirect objects, predicate nouns and adjectives, participles, and adverbial phrases"),
    parentNote: "Finding the person who receives something (indirect object), words after linking verbs that rename or describe the subject, -ing and -ed describing words (participles), and phrases that tell when, where, how or why.",
    generate: grammar,
  },
  {
    id: "punctuation-7",
    title: "Punctuation Power",
    emoji: "✒️",
    blurb: "Colons, however and ellipses",
    standards: on("B3.3", "colons to introduce a quotation, semicolons, commas with conjunctive adverbs, and ellipses and dashes"),
    parentNote: "Using a colon before a quotation, a semicolon with words like however and therefore, and ellipses or dashes to show a pause, an omission or a break.",
    generate: punctuation,
  },
  {
    id: "text-patterns-7",
    title: "Patterns & Features",
    emoji: "🔗",
    blurb: "Cause and effect, bibliographies",
    standards: on("C1.3", "cause and effect in expository text, and features such as a bibliography and accessible fonts"),
    parentNote: "Spotting causes and effects, using signal words, and explaining why features like a bibliography, index or clear fonts help readers.",
    generate: patterns,
  },
  {
    id: "point-of-view-7",
    title: "Whose Story?",
    emoji: "🎭",
    blurb: "First, second and third person",
    standards: on("C1.6", "the narrator's point of view and how an alternative point of view would change a story"),
    parentNote: "Telling first, second and third person apart, finding the clues, and imagining how a different narrator would change the story.",
    generate: view,
  },
];
