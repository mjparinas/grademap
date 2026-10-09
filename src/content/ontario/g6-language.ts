import { fromBank, type BankItem } from "../bank";
import { shuffle } from "../random";
import type { GenerateOptions, Question, Unit } from "../types";
import { on, type Passage, passageQuestions } from "./kit";

// Ontario Grade 6 language (2023 curriculum). BC's close reading, point of view, figurative language,
// tone, bias, clause and word-root units are shared; these units cover the grammar, sentence building,
// punctuation and text forms Ontario names for Grade 6.

// ---------- Grammar ----------

const GRAMMAR: BankItem[] = [
  { prompt: "Which word is a gerund (an -ing word used as a noun)? Swimming is good exercise.", right: "Swimming", wrong: ["good", "exercise"], hint: "A gerund names an action as a thing. It is the subject of the sentence." },
  { prompt: "Which sentence uses a gerund?", right: "Reading helps me relax.", wrong: ["I am reading a book.", "She was reading when I called."], hint: "In the first sentence, Reading is the subject, a thing. In the others, reading is part of the verb." },
  { prompt: "Which word is a gerund? My favourite hobby is baking.", right: "baking", wrong: ["favourite", "hobby"], hint: "Baking names the hobby, so it works as a noun." },
  { prompt: "Which word completes the sentence with a gerund? ___ is Aiyana's favourite activity.", right: "Drawing", wrong: ["Draw", "Drawn"], hint: "A gerund ends in -ing and acts as the subject." },
  { prompt: "Which sentence is in the passive voice?", right: "The window was broken by the ball.", wrong: ["The ball broke the window.", "The ball is round."], hint: "In the passive voice, the thing receiving the action is the subject." },
  { prompt: "Which sentence is in the active voice?", right: "The chef cooked the soup.", wrong: ["The soup was cooked by the chef.", "The soup was cooked."], hint: "In the active voice, the doer of the action is the subject." },
  { prompt: "Change to active voice: The race was won by Maya.", right: "Maya won the race.", wrong: ["The race won Maya.", "Maya was winning the race."], hint: "Put the doer first, then the verb, then what was acted on." },
  { prompt: "Change to passive voice: The dog chased the ball.", right: "The ball was chased by the dog.", wrong: ["The dog was chased by the ball.", "The ball chased the dog."], hint: "Put the thing acted on first, then was or were with the verb, then by and the doer." },
  { prompt: "Change to passive voice: Leo painted the fence.", right: "The fence was painted by Leo.", wrong: ["Leo was painted by the fence.", "The fence painted Leo."], hint: "The fence receives the action, so it becomes the subject." },
  { prompt: "Which sentence is in the passive voice?", right: "The cake was eaten.", wrong: ["Ana ate the cake.", "The cake looks tasty."], hint: "Was eaten shows the cake received the action, even without a doer." },
  { prompt: "Why might a writer choose the passive voice?", right: "to focus on what happened instead of who did it", wrong: ["to make sentences shorter every time", "to avoid using verbs"], hint: "Passive voice puts the receiver of the action first." },
  { prompt: "Which sentence has a gerund as the object?", right: "Jay enjoys skating.", wrong: ["Jay is skating now.", "Jay skated yesterday."], hint: "Skating tells what Jay enjoys. It is a noun here." },
  { prompt: "Which of these sentences is in the active voice?", right: "Mia painted a mural on the wall.", wrong: ["A mural was painted on the wall by Mia.", "A mural was painted."], hint: "Mia, the doer, is the subject." },
  { prompt: "Which sentence changes the active voice sentence into passive? Sam read the book.", right: "The book was read by Sam.", wrong: ["Sam was read by the book.", "The book read Sam."], hint: "The book is the thing that received the action." },
];

function grammar(_opts?: GenerateOptions): Question[] {
  return fromBank(GRAMMAR, 8);
}

// ---------- Sentences ----------

const SENTENCES: BankItem[] = [
  { prompt: "Which part is the adjective (relative) clause? The girl who won the race is my cousin.", right: "who won the race", wrong: ["The girl", "is my cousin"], hint: "A relative clause starts with a word like who or which and describes a noun." },
  { prompt: "Which part is the relative clause? The book that I borrowed was funny.", right: "that I borrowed", wrong: ["The book", "was funny"], hint: "It describes the book and starts with that." },
  { prompt: "Which sentence has an adjective clause?", right: "The park, which has a big slide, is near my house.", wrong: ["The park is near my house.", "The park near my house has a slide."], hint: "Which has a big slide is a clause that describes the park." },
  { prompt: "Which sentence combines these two correctly? Mr. Singh is our coach. He lives next door.", right: "Mr. Singh, who lives next door, is our coach.", wrong: ["Mr. Singh, who lives next door is our coach.", "Mr. Singh lives next door, who is our coach."], hint: "Use who to join a clause about a person, with commas around the extra information." },
  { prompt: "Which sentence combines these two correctly? The bike is red. It belongs to Aiyana.", right: "The bike that belongs to Aiyana is red.", wrong: ["The bike that belongs to Aiyana, it is red.", "Aiyana is red that belongs to the bike."], hint: "Use that to tell which bike." },
  { prompt: "Which word starts the relative clause? The town where I was born is small.", right: "where", wrong: ["town", "small"], hint: "Where, who, which, that and whose can start a relative clause." },
  { prompt: "Which sentence is complex?", right: "The student who finished first helped the others.", wrong: ["The student finished first.", "The student finished, and the others waited."], hint: "A complex sentence has a main clause and a clause that depends on it." },
  { prompt: "Which word should replace the blank? The author ___ wrote this book lives in Calgary.", right: "who", wrong: ["which", "where"], hint: "Use who for a person." },
  { prompt: "Which word should replace the blank? The movie ___ we watched was long.", right: "that", wrong: ["who", "whose"], hint: "Use that or which for things." },
  { prompt: "Which word should replace the blank? The family ___ house is yellow just moved in.", right: "whose", wrong: ["who", "which"], hint: "Whose shows belonging." },
  { prompt: "Which sentence uses a relative clause to give extra information?", right: "My grandmother, who is 80, still skis.", wrong: ["My grandmother skis.", "My grandmother is 80 and skis."], hint: "Who is 80 gives extra information about the grandmother." },
  { prompt: "Which sentence is best? The tree fell. The tree was old.", right: "The tree that fell was old.", wrong: ["The tree fell was old.", "The tree, fell, was old."], hint: "Join the ideas with that." },
];

function sentences(_opts?: GenerateOptions): Question[] {
  return fromBank(SENTENCES, 8);
}

// ---------- Punctuation ----------

const PUNCTUATION: BankItem[] = [
  { prompt: "Which greeting is correct in a formal letter?", right: "Dear Ms. Patel:", wrong: ["Dear Ms. Patel,", "Dear Ms. Patel;"], hint: "In a formal or business letter, use a colon after the greeting." },
  { prompt: "Which greeting is correct in a formal letter?", right: "Dear Principal Brown:", wrong: ["Dear Principal Brown;", "Dear Principal Brown."], hint: "A colon follows the greeting in a formal letter." },
  { prompt: "Which memo line is correct?", right: "To: All Grade 6 Students", wrong: ["To; All Grade 6 Students", "To, All Grade 6 Students"], hint: "A colon follows labels like To and From in a memo." },
  { prompt: "Which line of a script is punctuated correctly to show a new speaker?", right: "MAYA: Where did you put my hat?", wrong: ["MAYA, Where did you put my hat?", "MAYA; Where did you put my hat?"], hint: "In a script, a colon follows the speaker's name." },
  { prompt: "Which sentence uses a comma after a transitional word correctly?", right: "However, the game was cancelled.", wrong: ["However the game was cancelled.", "However; the game was cancelled."], hint: "Put a comma after a transitional word at the start of a sentence." },
  { prompt: "Which sentence uses a comma after a transitional phrase correctly?", right: "For example, owls hunt at night.", wrong: ["For example owls hunt at night.", "For, example owls hunt at night."], hint: "Put a comma after a transitional phrase like for example." },
  { prompt: "Which sentence is punctuated correctly?", right: "Finally, we reached the summit.", wrong: ["Finally we, reached the summit.", "Finally we reached, the summit."], hint: "A comma goes right after the transitional word." },
  { prompt: "Which sentence is punctuated correctly?", right: "In addition, the museum offers free tours.", wrong: ["In addition the museum, offers free tours.", "In, addition the museum offers free tours."], hint: "Put a comma after the transitional phrase in addition." },
  { prompt: "Which sentence is punctuated correctly?", right: "As a result, the road was closed.", wrong: ["As a result the road, was closed.", "As, a result the road was closed."], hint: "Put a comma after the transitional phrase as a result." },
  { prompt: "Which transitional word shows a contrast?", right: "However", wrong: ["Therefore", "Furthermore"], hint: "However shows that the next idea is different." },
  { prompt: "Which transitional word shows a result?", right: "Therefore", wrong: ["However", "Meanwhile"], hint: "Therefore shows that something happened because of what came before." },
  { prompt: "Which formal letter closing is correct?", right: "Sincerely,", wrong: ["Sincerely:", "Sincerely;"], hint: "Closings end with a comma, even in formal letters." },
];

function punctuation(_opts?: GenerateOptions): Question[] {
  return fromBank(PUNCTUATION, 8);
}

// ---------- Text forms and patterns ----------

const FORMS: BankItem[] = [
  { prompt: "A report names a problem, then gives possible fixes. What text pattern is it?", right: "problem and solution", wrong: ["compare and contrast", "chronological order"], hint: "Signal words are problem, solution, one way to fix this." },
  { prompt: "Which signal words are often used in a problem and solution text?", right: "the problem is, one solution, as a result", wrong: ["first, next, then", "on the other hand, both, similarly"], hint: "Look for words that name a difficulty and a fix." },
  { prompt: "What is the purpose of a subheading?", right: "to tell what a section is about", wrong: ["to name the author", "to list the sources"], hint: "Subheadings break a text into parts so you can find information." },
  { prompt: "On a website, a pull-down menu helps a reader…", right: "choose from a list of pages or options", wrong: ["see the author's photo", "read the glossary"], hint: "Click the menu and a list drops down." },
  { prompt: "A website has a menu bar at the top. What does it help readers do?", right: "move to different parts of the site", wrong: ["see how long the text is", "find the author's age"], hint: "A menu is for navigation." },
  { prompt: "A script has stage directions in brackets. What are they for?", right: "to tell actors what to do or how to speak", wrong: ["to name the audience", "to give the title of the play"], hint: "Stage directions are instructions inside the script." },
  { prompt: "Which text form is written to be performed?", right: "a script", wrong: ["an encyclopedia entry", "a recipe"], hint: "Scripts have speakers' names and stage directions." },
  { prompt: "A graph, a photo and a map all appear in one article. What do they help the reader do?", right: "understand ideas that are hard to explain in words alone", wrong: ["skip reading the text", "know who the author is"], hint: "Images and graphics add to the meaning of the text." },
  { prompt: "A photo of a flooded street is placed beside an article on storms. How does it help?", right: "It shows the effects the writer describes.", wrong: ["It proves the writer is correct.", "It replaces the title."], hint: "The image connects to the words and makes them real." },
  { prompt: "Two images show the same park in summer and in winter. What is the likely purpose?", right: "to compare how it changes", wrong: ["to confuse the reader", "to hide the name of the park"], hint: "Seeing both side by side shows the difference." },
  { prompt: "Which text form is mostly written to convince the reader?", right: "an editorial", wrong: ["a weather report", "a dictionary entry"], hint: "An editorial gives an opinion and tries to persuade." },
  { prompt: "Which text form tells about a real person's life?", right: "a biography", wrong: ["a fable", "a science fiction story"], hint: "A biography is the true story of someone's life." },
];

const PASSAGES: Passage[] = [
  {
    title: "Too Much Plastic",
    text: [
      "The problem is clear: our lunch room produces a huge amount of plastic waste. Every day, hundreds of wrappers go into the garbage.",
      "One solution is to bring reusable containers. Another is to set up a recycling station. As a result, the school could cut its garbage in half.",
    ],
    questions: [
      { prompt: "What text pattern does this passage use?", right: "problem and solution", wrong: ["compare and contrast", "chronological order"], hint: "It states a problem and then solutions." },
      { prompt: "Which phrase signals a solution?", right: "One solution is", wrong: ["The problem is clear", "every day"], hint: "Look for the words that introduce a fix." },
      { prompt: "What is the likely result if the school uses reusable containers?", right: "less garbage", wrong: ["more wrappers", "no lunch at all"], hint: "The last sentence says the garbage could be cut in half." },
    ],
  },
  {
    title: "The Mystery Light",
    text: [
      "SCENE 1: A dark kitchen. A single flashlight beam moves across the floor.",
      "ZOE: (whispering) Did you hear that?",
      "LEO: (looking up) It's only the fridge, Zoe.",
      "ZOE: (nervously) The fridge doesn't giggle.",
    ],
    questions: [
      { prompt: "What text form is this?", right: "a script", wrong: ["a poem", "a news report"], hint: "It has speakers' names, colons and stage directions." },
      { prompt: "What do the words in brackets tell the actors?", right: "how to say the lines", wrong: ["who wrote the play", "when the play ends"], hint: "These are stage directions." },
      { prompt: "How does Zoe most likely feel?", right: "nervous", wrong: ["bored", "angry"], hint: "She whispers and speaks nervously." },
    ],
  },
];

function forms(_opts?: GenerateOptions): Question[] {
  return shuffle([...fromBank(FORMS, 5), ...passageQuestions(PASSAGES, "passage", 3)]);
}

export const units: Unit[] = [
  {
    id: "grammar-6",
    title: "Grammar Gears",
    emoji: "⚙️",
    blurb: "Gerunds and active or passive",
    standards: on("B3.2", "gerunds, and active and passive voice"),
    parentNote: "Spotting -ing words that act as nouns (gerunds), telling active sentences from passive ones, and changing a sentence from one voice to the other.",
    generate: grammar,
  },
  {
    id: "sentences-6",
    title: "Sentence Builders",
    emoji: "🧱",
    blurb: "Who, which and that clauses",
    standards: on("B3.1", "complex sentences with adjective or relative clauses"),
    parentNote: "Using clauses that start with who, which, that, whose and where to add detail and join short sentences.",
    generate: sentences,
  },
  {
    id: "punctuation-6",
    title: "Punctuation Power",
    emoji: "✒️",
    blurb: "Colons, scripts and transitions",
    standards: on("B3.3", "colons in formal letters and memos and for script speakers, and commas after transitional words and phrases"),
    parentNote: "Using a colon in a formal greeting or after a speaker's name in a script, and putting a comma after words like However and phrases like For example.",
    generate: punctuation,
  },
  {
    id: "text-forms-6",
    title: "Text Forms & Features",
    emoji: "📑",
    blurb: "Patterns, scripts and visuals",
    standards: on("C1.2–C1.4", "text forms, text patterns and features such as subheadings and menus, and how images and graphics add meaning"),
    parentNote: "Recognizing problem-and-solution reports, scripts, and web features like menus, and explaining how pictures and graphics add to a text.",
    generate: forms,
  },
];
