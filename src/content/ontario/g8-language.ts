import { fromBank, type BankItem } from "../bank";
import { shuffle } from "../random";
import type { OrderQuestion, Question, Unit } from "../types";
import { on, type Passage, passageQuestions } from "./kit";

// Ontario Grade 8 language (2023 curriculum). BC's close reading, literary devices, argument and media,
// grammar and style, and word study units are shared (see g8.ts). These units cover the irony, satire and
// allusion, narrator's point of view, text forms and features, reading strategies, digital media literacy
// and writing process that Ontario names for Grade 8. All passages are original.

// ---------- Irony, satire and allusion ----------

const IRONY: BankItem[] = [
  { prompt: "A fire station burns down while the firefighters are away at a fire-safety workshop. What kind of irony is this?", right: "situational irony", wrong: ["verbal irony", "dramatic irony"], hint: "Situational irony is when what happens is the opposite of what we expect." },
  { prompt: "It is pouring rain, and Dev says, “What lovely weather for a picnic.” What kind of irony is this?", right: "verbal irony", wrong: ["situational irony", "dramatic irony"], hint: "In verbal irony, a speaker says the opposite of what they mean." },
  { prompt: "In a play, the audience knows the cake is spoiled, but the character happily takes a big bite. What kind of irony is this?", right: "dramatic irony", wrong: ["verbal irony", "situational irony"], hint: "In dramatic irony, the audience knows something that a character does not." },
  { prompt: "What is the main purpose of satire?", right: "to use humour or exaggeration to criticize people, ideas or society", wrong: ["to explain a science idea in simple words", "to describe a setting in detail", "to tell the life story of a real person"], hint: "Satire pokes fun at something in order to make people think about it." },
  { prompt: "Which techniques does satire often use?", right: "exaggeration, irony and humour", wrong: ["rhyme, metre and refrains", "maps, charts and captions", "dates, names and places"], hint: "Satirists make something seem silly so readers notice a problem." },
  { prompt: "A news article reports that a city has passed a law making every clock run five minutes slow “to give residents more time.” What is the article most likely doing?", right: "poking fun at rules that do not make sense", wrong: ["informing readers of a real law", "teaching readers about time zones", "advertising clocks"], hint: "The reasoning is so silly that it is meant to be funny and to criticize." },
  { prompt: "A cartoon shows a mayor “saving” a park by paving it for parking. What is the cartoonist most likely doing?", right: "using irony to criticize a decision", wrong: ["describing the park's history", "using a rhyme scheme", "foreshadowing a storm"], hint: "Saving a park by paving it is the opposite of what saving should mean. That is irony used to criticize." },
  { prompt: "Why might an author choose satire instead of a direct argument?", right: "Humour can draw readers in and help them see a problem in a new way.", wrong: ["Satire is always shorter than an argument.", "Satire never criticizes anything.", "Satire only uses facts and numbers."], hint: "Laughter can make people more open to a new idea." },
  { prompt: "What is an allusion?", right: "a brief reference to a well-known person, place, event or work", wrong: ["a comparison that uses like or as", "a word that sounds like its meaning", "a repeated beginning sound"], hint: "Writers use allusions to bring in the meaning of something readers already know." },
  { prompt: "A coach says, “Our defence is our Achilles' heel.” What does she mean?", right: "It is our biggest weakness.", wrong: ["It is our greatest strength.", "It is brand new.", "It is the only part of the team that is injured."], hint: "In an old Greek story, the hero Achilles could be hurt only in his heel. The phrase means a hidden weakness." },
  { prompt: "A writer says, “Opening the box of old letters was like opening Pandora's box.” What does the allusion suggest?", right: "Opening it let loose many troubles.", wrong: ["It held something very valuable.", "It was empty.", "It was easy to close again."], hint: "In the Greek myth, Pandora opened a jar and released troubles into the world." },
  { prompt: "A friend says the free game was a Trojan horse because it hid ads and viruses. What does the allusion suggest?", right: "something that looks like a gift but hides a danger", wrong: ["something very large and slow", "something very old", "something very popular"], hint: "In the ancient story, soldiers hid inside a wooden horse that was given as a gift." },
  { prompt: "Reporters call the unknown team's championship win “a Cinderella story.” What does the allusion suggest?", right: "an unlikely success after being overlooked", wrong: ["a loss after a great start", "a story about shoes", "a sudden disappearance at midnight"], hint: "Cinderella is overlooked and then unexpectedly succeeds." },
  { prompt: "A small bakery's court case against a giant chain is called “a David-and-Goliath battle.” What does that suggest?", right: "a small side facing a much bigger opponent", wrong: ["two equally matched sides", "a fight between friends", "a case that is already finished"], hint: "David was a small shepherd who faced a giant warrior." },
  { prompt: "Which sentence contains an allusion?", right: "She had the Midas touch, and every shop she opened thrived.", wrong: ["She opened three shops, and they all thrived.", "Her shops were as busy as beehives.", "Her shops thrived, thrived, thrived."], hint: "King Midas turned everything he touched to gold. The phrase refers to that story." },
  { prompt: "Which sentence is an example of verbal irony?", right: "“Great job,” Sana said after he dropped the whole tray.", wrong: ["“Great job,” Sana said after he carried the tray safely.", "Sana said the tray was heavy.", "Sana carried the tray to the kitchen."], hint: "Sana says the opposite of what she means." },
  { prompt: "A character laughs, “I'm so glad my phone died right before the big photo.” What does the irony show?", right: "She is actually upset.", wrong: ["She is truly happy.", "She was bored by the photo.", "She wanted the phone to stay dead."], hint: "When a speaker says the opposite of what is true, think about how they really feel." },
];

const IRONY_PASSAGES: Passage[] = [
  {
    title: "Notice from Town Hall",
    text: [
      "ATTENTION CITIZENS: To reduce crowding on sidewalks, the Department of Walking now requires all pedestrians to apply for a Walking Permit. Applications take six to eight weeks to process. Until your permit arrives, residents are asked to stay where they are.",
      "A spokesperson called the system “simple and efficient.” The permit office is open on alternate Tuesdays from 2:00 to 2:15 p.m., on the fifth floor of a building with no elevator.",
    ],
    questions: [
      { prompt: "What is the author's main purpose?", right: "to poke fun at rules that make simple things complicated", wrong: ["to explain how to apply for a real permit", "to describe the history of a town", "to persuade readers to walk more"], hint: "The rule is so silly that the notice cannot be serious." },
      { prompt: "Which detail makes the notice the most absurd?", right: "Residents must wait weeks for permission to walk.", wrong: ["The notice begins with “Attention Citizens.”", "A spokesperson commented on the system.", "The department has an office."], hint: "Look for the detail that is the most exaggerated." },
      { prompt: "Why is calling the system “simple and efficient” ironic?", right: "The process is slow and complicated.", wrong: ["The process is quick and easy.", "Nobody uses the system.", "The spokesperson is a child."], hint: "The words say one thing, but the details show the opposite." },
      { prompt: "What does this satire suggest about some government systems?", right: "They can become so complicated that they stop being useful.", wrong: ["They are always fast and helpful.", "They should never have offices.", "They are written for children."], hint: "Satire criticizes something by making it look ridiculous." },
    ],
  },
  {
    title: "Dev's Big Day",
    text: [
      "Dev had spent a month preparing for the school's Be On Time Award. He set three alarms, packed his bag the night before and left home an hour early. He reached the school gate at 7:15 a.m., ready to be the first one there.",
      "The gate was locked. A sign taped to it read: “School closed today for Professional Development Day.”",
    ],
    questions: [
      { prompt: "What kind of irony is the ending?", right: "situational irony", wrong: ["verbal irony", "dramatic irony"], hint: "What happens is the opposite of what Dev and the reader expect." },
      { prompt: "What does the reader expect from the first paragraph?", right: "that Dev will arrive first and win the award", wrong: ["that Dev will oversleep", "that Dev will quit the contest", "that the school will move"], hint: "Dev prepares carefully and arrives early." },
      { prompt: "Why is the ending ironic?", right: "Dev worked hard to be early, but the school was closed.", wrong: ["Dev was late for school.", "The gate was open.", "Dev forgot his bag."], hint: "His effort leads to a result that nobody expected." },
    ],
  },
  {
    title: "The Underdog",
    text: [
      "“It's a David and Goliath matchup,” the announcer said as the Grade 8 team lined up against the high school varsity squad. Nobody expected the Hawks to last a quarter.",
      "But Priya dribbled around her tall opponent with the calm of a champion, and by halftime the Hawks were ahead. The crowd rose to its feet. The underdog had slung its stone.",
    ],
    questions: [
      { prompt: "What does the allusion “David and Goliath” suggest about the game?", right: "A small team faces a much stronger one.", wrong: ["The two teams are equally strong.", "The game will be cancelled.", "The announcer knows the players well."], hint: "David was small and Goliath was a giant." },
      { prompt: "What does “the underdog had slung its stone” suggest?", right: "The smaller team had a surprising success.", wrong: ["Someone threw a stone at the crowd.", "The game had ended in a tie.", "The team lost badly."], hint: "In the story, David defeats Goliath with a stone from a sling." },
      { prompt: "Why might the author use an allusion here?", right: "to quickly show readers how big the challenge is", wrong: ["to confuse readers", "to introduce a new setting", "to add a new character"], hint: "An allusion lets readers bring in what they already know." },
    ],
  },
];

function irony(): Question[] {
  return shuffle([...fromBank(IRONY, 4), ...passageQuestions(IRONY_PASSAGES, "passage", 4)]);
}

// ---------- Narrator's point of view ----------

const VIEW: BankItem[] = [
  { prompt: "A narrator tells the story using he, she and they, and can see into only one character's mind. What point of view is this?", right: "third-person limited", wrong: ["third-person omniscient", "first person", "second person"], hint: "Third person uses he, she and they. Limited means we know the thoughts of only one character." },
  { prompt: "A narrator who tells the thoughts and feelings of every character is…", right: "omniscient", wrong: ["limited", "unreliable", "a character in the story"], hint: "Omniscient means all-knowing." },
  { prompt: "What is an unreliable narrator?", right: "a narrator who may not tell the truth or may not understand events accurately", wrong: ["a narrator who always knows everything", "a narrator who never uses the word I", "a narrator who speaks to the reader as you"], hint: "Readers have to look for clues to decide what is really happening." },
  { prompt: "Which clue best suggests a narrator is unreliable?", right: "The narrator's description often contradicts what other characters say and do.", wrong: ["The narrator uses the word I.", "The narrator describes the setting.", "The narrator tells events in order."], hint: "If the details do not match the narrator's claims, be suspicious." },
  { prompt: "Why might an author choose an unreliable narrator?", right: "to make readers question what is true and look for clues", wrong: ["to make the plot shorter", "to avoid using characters", "to explain facts clearly"], hint: "The reader has to work out the truth." },
  { prompt: "Which sentence is told from a third-person limited point of view?", right: "Mia wondered why the room had gone so quiet.", wrong: ["Mia wondered why the room had gone quiet, while her father worried and her brother hid a grin.", "Mia, her father and her brother each had a different thought about the silence, and the narrator knew them all."], hint: "Limited means we only get one character's thoughts." },
  { prompt: "Which sentence shows an omniscient narrator?", right: "Leo smiled politely, though he secretly dreaded the speech, and his teacher, watching him, hoped he would be brave.", wrong: ["Leo smiled politely, though he secretly dreaded the speech.", "I smiled politely, though I secretly dreaded the speech."], hint: "The omniscient narrator knows what more than one character thinks." },
  { prompt: "A story is told about a dog and shares only what the dog thinks and feels. What point of view is it?", right: "third-person limited", wrong: ["third-person omniscient", "first person", "second person"], hint: "The narrator stays with the thoughts of one character and uses he, she or it." },
  { prompt: "If a story is retold from a different character's point of view, what mostly changes?", right: "which details and feelings are shown", wrong: ["the setting only", "the title only", "nothing at all"], hint: "Different characters notice and care about different things." },
  { prompt: "A story is told with I, but the narrator only describes things that happened to other people. What can a reader still learn?", right: "the narrator's opinions, even when describing others", wrong: ["nothing about the narrator", "every character's thoughts", "the author's address"], hint: "First-person narrators always show their own view." },
  { prompt: "Which pronouns suggest a first-person narrator?", right: "I, me and my", wrong: ["she, her and hers", "they, them and their", "you only"], hint: "First person is the narrator speaking as a character." },
  { prompt: "A writer wants readers to know a secret that a character does not know. Which point of view works best?", right: "third-person omniscient", wrong: ["first person", "second person", "third-person limited"], hint: "An omniscient narrator knows more than the characters." },
];

const VIEW_PASSAGES: Passage[] = [
  {
    title: "The Best Soup Ever",
    text: [
      "I want everyone to know that my soup was a triumph. The kitchen was a bit smoky, but that is what chefs call atmosphere. My brother coughed and left the room, probably to tell the neighbours how delicious it smelled.",
      "Dad said, “Let's order a pizza,” which shows how impatient he gets when he is hungry. I ate the whole bowl myself. Well, most of it. Some of it may have gone into the plant.",
    ],
    questions: [
      { prompt: "What point of view is used?", right: "first person", wrong: ["second person", "third-person limited", "third-person omniscient"], hint: "The narrator uses I and is a character." },
      { prompt: "What does the reader understand that the narrator will not admit?", right: "The soup was not good.", wrong: ["Dad loves soup more than pizza.", "The brother is a professional chef.", "The plant needs more water."], hint: "Look at how the others react." },
      { prompt: "How does the narrator explain the smoky kitchen?", right: "by calling it atmosphere", wrong: ["by blaming the neighbours", "by saying the stove broke", "by opening a window"], hint: "Find the sentence about the smoke." },
      { prompt: "Is the narrator reliable?", right: "No, the details suggest the soup was probably bad.", wrong: ["Yes, everyone loved the soup.", "Yes, because the narrator says I.", "No, because the narrator never mentions soup."], hint: "Compare what the narrator says with what the details show." },
    ],
  },
  {
    title: "Outside the Doors",
    text: [
      "Amara stood outside the hospital doors, her backpack heavy on her shoulder. She wondered whether her grandmother would remember her today. Nurses hurried past, and she could not tell what any of them were thinking; their faces gave nothing away.",
    ],
    questions: [
      { prompt: "What point of view is used?", right: "third-person limited", wrong: ["third-person omniscient", "first person", "second person"], hint: "The narrator uses she and tells only Amara's thoughts." },
      { prompt: "Whose thoughts does the reader learn?", right: "Amara's", wrong: ["her grandmother's", "the nurses'", "everyone's"], hint: "She wondered…" },
      { prompt: "What can the reader NOT learn from this passage?", right: "what the nurses are thinking", wrong: ["that Amara is worried", "where Amara is standing", "that Amara carries a backpack"], hint: "A limited narrator cannot see into other minds." },
    ],
  },
  {
    title: "The Surprise Party",
    text: [
      "Everyone at the table was thinking about Jin's birthday. Jin thought his friends had forgotten, and he pretended not to care. His mother, in the kitchen, checked the cake for the third time. Outside the window, his cousins crouched behind the hedge, trying not to laugh.",
    ],
    questions: [
      { prompt: "What point of view is used?", right: "third-person omniscient", wrong: ["third-person limited", "first person", "second person"], hint: "We learn what Jin, his mother and his cousins are doing and thinking." },
      { prompt: "How does the narrator add humour and suspense?", right: "by letting the reader know what Jin does not", wrong: ["by hiding every character's thoughts", "by switching to first person", "by describing only Jin's thoughts"], hint: "The reader knows about the party before Jin does." },
      { prompt: "How would the passage change if it were told only from Jin's view?", right: "The reader would not know about the cake or the cousins.", wrong: ["The reader would know even more about the cake.", "It would be told in second person.", "Nothing would change."], hint: "Jin cannot see the kitchen or the hedge." },
    ],
  },
  {
    title: "The Fence",
    text: [
      "Kai watched the new neighbour's fence go up and saw it as a wall between them. Each board seemed to say, “Keep out.”",
      "Across the yard, the neighbour hammered in the last nail. She felt proud. At last, her dog could play safely.",
    ],
    questions: [
      { prompt: "Why does the narrator show both Kai's and the neighbour's thoughts?", right: "to show that one event can mean different things to different people", wrong: ["to hide the fence from the reader", "to make the story shorter", "to prove that Kai is wrong"], hint: "The same fence means a wall to one and safety to the other." },
      { prompt: "How does Kai see the fence?", right: "as a wall that says to keep out", wrong: ["as a safe place for a dog", "as a gift", "as something to be proud of"], hint: "Look at the first paragraph." },
      { prompt: "What point of view is used?", right: "third-person omniscient", wrong: ["third-person limited", "first person", "second person"], hint: "The narrator tells the thoughts of two characters." },
    ],
  },
];

function pointOfView(): Question[] {
  return shuffle([...fromBank(VIEW, 3), ...passageQuestions(VIEW_PASSAGES, "passage", 5)]);
}

// ---------- Text forms, patterns and features ----------

const FORMS: BankItem[] = [
  { prompt: "A letter to the editor often follows which text pattern?", right: "problem and solution", wrong: ["a list of steps in order", "a description of a place", "a rhyme scheme"], hint: "The writer describes a problem and suggests how to fix it." },
  { prompt: "How is an editorial different from a news report?", right: "An editorial gives the writer's opinion; a news report presents facts.", wrong: ["A news report gives opinions; an editorial presents only facts.", "An editorial is always longer than a news report.", "A news report never has a headline."], hint: "Editorials argue a position. News reports tell what happened." },
  { prompt: "Which text form is most likely to have a byline, a headline and a lead paragraph?", right: "a news article", wrong: ["a poem", "a diary entry", "a recipe"], hint: "These are features of newspaper writing." },
  { prompt: "Which text form uses stanzas, line breaks and imagery to communicate meaning?", right: "a poem", wrong: ["an editorial", "a user manual", "a timeline"], hint: "Poets use the shape of the lines and the words together." },
  { prompt: "A graphic novel tells its story using…", right: "sequenced panels of images and words", wrong: ["only paragraphs of text", "only graphs and tables", "stanzas and rhymes only"], hint: "The pictures carry meaning along with the words." },
  { prompt: "Which text feature shows data as a picture so readers can see it at a glance?", right: "an infographic", wrong: ["a glossary", "an index", "a table of contents"], hint: "An infographic combines data, images and short text." },
  { prompt: "What does a glossary do?", right: "defines key words used in the text", wrong: ["lists the sources used", "tells where each topic is found by page", "introduces the author"], hint: "It is like a small dictionary for the text." },
  { prompt: "What does a caption do?", right: "explains or adds information about a picture or graphic", wrong: ["lists the sources at the end", "names the author", "introduces a new chapter"], hint: "It sits next to or under an image." },
  { prompt: "A news story about a flood uses a photo of a calm, sunny lake. What problem could this cause?", right: "The image does not match the message and could confuse readers.", wrong: ["The photo is too colourful.", "Photos are not allowed in news stories.", "It makes the story longer."], hint: "Images and words should work together." },
  { prompt: "Why do designers use a large, bold font for a headline?", right: "to catch attention and show that it is important", wrong: ["to hide the text", "to make it harder to read", "to save space"], hint: "Size and weight tell readers what to read first." },
  { prompt: "A poster uses red and black with sharp, angular letters. What mood does the design most likely create?", right: "urgent or intense", wrong: ["calm and gentle", "sleepy", "silly and playful"], hint: "Colours and shapes carry feelings." },
  { prompt: "A line graph in an article shows bike riders increasing each year. How does it support the text?", right: "It gives visual evidence for the writer's claim.", wrong: ["It replaces all of the writing.", "It tells a completely different story.", "It makes the topic less important."], hint: "Graphs can back up the words." },
  { prompt: "Which signal words are common in a compare-and-contrast text?", right: "similarly, in contrast, however", wrong: ["first, next, finally", "because, as a result", "for instance, such as"], hint: "These words show how things are alike or different." },
  { prompt: "In a problem-and-solution text, what usually comes after the problem is described?", right: "one or more proposed solutions", wrong: ["a list of unrelated facts", "the author's biography", "an index only"], hint: "The writer tells how the problem might be fixed." },
  { prompt: "A sidebar in a textbook usually…", right: "gives extra information related to the main text", wrong: ["replaces the main text", "lists every source", "is the title page"], hint: "It is a boxed section beside the main reading." },
  { prompt: "A book has a title page, table of contents, chapters, a glossary and an index. It is most likely…", right: "a non-fiction book", wrong: ["a poem", "a text message", "a letter to a friend"], hint: "These features help readers find and understand facts." },
  { prompt: "In many cultures, stories are shared aloud and passed from person to person. What kind of text form is this?", right: "an oral story", wrong: ["a table", "a bibliography", "a caption"], hint: "Oral texts are spoken or told rather than written." },
];

const FORM_PASSAGES: Passage[] = [
  {
    title: "A Letter to the Editor",
    text: [
      "Dear Editor,",
      "Every morning, dozens of students cross Maple Road to reach our school, but there is no crosswalk. Last month, a driver nearly hit a boy who was running late. A painted crosswalk with a flashing light would cost the town little and could save a life. I urge the council to approve one before someone is hurt.",
      "Sincerely, R. Ahmed",
    ],
    questions: [
      { prompt: "What is the problem described in the letter?", right: "There is no crosswalk on Maple Road.", wrong: ["The school is too far away.", "Students are always late.", "Drivers must pay for crosswalks."], hint: "Look at the first sentences." },
      { prompt: "What solution does the writer suggest?", right: "a painted crosswalk with a flashing light", wrong: ["a new school", "a lower speed limit for students", "a permit for walking"], hint: "Find the sentence that says what would help." },
      { prompt: "Which text pattern does the letter mainly use?", right: "problem and solution", wrong: ["compare and contrast", "sequence", "description"], hint: "The writer states a problem, then offers a fix." },
      { prompt: "Which words show the writer's purpose?", right: "I urge the council to approve one", wrong: ["Dear Editor", "Every morning", "Sincerely, R. Ahmed"], hint: "Which words ask the reader to take action?" },
    ],
  },
  {
    title: "Paper or Screen?",
    text: [
      "Printed books and e-books both let readers enjoy stories. A printed book has pages that you hold and turn, and it does not need a battery. An e-book, in contrast, can hold hundreds of titles on one device and lets readers change the size of the text.",
      "However, many readers find that they remember more of what they read on paper. E-books are easier to carry; printed books are easier on the eyes for some people.",
    ],
    questions: [
      { prompt: "Which text pattern does the passage mainly use?", right: "compare and contrast", wrong: ["cause and effect", "sequence", "problem and solution"], hint: "It shows how printed books and e-books are alike and different." },
      { prompt: "Which word signals a contrast?", right: "However", wrong: ["Printed", "enjoy", "pages"], hint: "Signal words such as however point out a difference." },
      { prompt: "According to the passage, which is an advantage of an e-book?", right: "It can hold hundreds of titles on one device.", wrong: ["It does not need a battery.", "It has pages you can turn.", "It is easier on the eyes for everyone."], hint: "Find the sentence about e-books holding titles." },
    ],
  },
];

function forms(): Question[] {
  return shuffle([...fromBank(FORMS, 4), ...passageQuestions(FORM_PASSAGES, "passage", 4)]);
}

// ---------- Reading strategies ----------

const STRATEGIES: BankItem[] = [
  { prompt: "You reach a word you do not know in a science article. Which strategy should you try first?", right: "reread the sentence for context clues, then check the glossary", wrong: ["skip the whole article", "guess any meaning", "stop reading"], hint: "Use the text first, then a reference." },
  { prompt: "What is a prediction?", right: "an informed guess about what will happen, based on clues", wrong: ["a summary of what has happened", "a fact from the glossary", "a question for the author"], hint: "Predictions use the text plus what you already know." },
  { prompt: "While reading, you realize you cannot explain the last page. What should you do?", right: "reread and ask yourself questions", wrong: ["read faster", "skip to the end", "memorize the words"], hint: "Monitor your understanding and fix problems." },
  { prompt: "Which sentence is an inference?", right: "Because Maya packed a raincoat, she must expect wet weather.", wrong: ["Maya packed a raincoat.", "Maya packed her bag.", "The raincoat is yellow."], hint: "An inference uses clues in the text to work out something that is not stated." },
  { prompt: "What is a global inference?", right: "a conclusion about the text as a whole, such as the theme or the author's purpose", wrong: ["a guess about one word", "a fact stated in the text", "a spelling rule"], hint: "Global means the whole text." },
  { prompt: "What is a local inference?", right: "a conclusion about a specific word, phrase or sentence", wrong: ["a conclusion about the whole text", "the title of the text", "a summary of the whole chapter"], hint: "Local means one small part of the text." },
  { prompt: "After reading, you connect a story to something that happened to you. Which strategy is that?", right: "making connections", wrong: ["predicting", "skimming", "proofreading"], hint: "Connecting links the text to your own experience or other texts." },
  { prompt: "Which question helps you check a prediction?", right: "Did what happened match what I thought would happen, and why?", wrong: ["How many pages are there?", "Who published the book?", "What colour is the cover?"], hint: "Compare your guess with what the text says." },
  { prompt: "What does it mean to skim a text?", right: "to read quickly to get the main idea or find a topic", wrong: ["to read every word slowly", "to copy it by hand", "to memorize it"], hint: "Skimming looks at headings, first sentences and key words." },
  { prompt: "What does scanning a text help you do?", right: "find a specific fact, name or date", wrong: ["decide the theme", "predict the ending", "write a new paragraph"], hint: "Your eyes search for key words." },
  { prompt: "While reading a story, you stop and say, “I think the author is trying to teach us about honesty.” What are you making?", right: "a global inference", wrong: ["a local inference", "a spelling check", "a direct quotation"], hint: "A global inference is about the text as a whole." },
];

const STRATEGY_PASSAGES: Passage[] = [
  {
    title: "Maple Syrup Season",
    text: [
      "In early spring, when nights are still freezing but days are warm, sap begins to rise in maple trees. Producers tap the trees and collect the clear, watery sap in buckets or tubing.",
      "It takes about forty litres of sap to make just one litre of syrup, so the sap is boiled for hours until most of the water has evaporated. Once the syrup is thick and golden, it is filtered and bottled.",
    ],
    questions: [
      { prompt: "Which is the best summary of the passage?", right: "Maple syrup is made by collecting sap in spring and boiling it until most of the water is gone.", wrong: ["Maple trees grow best in freezing weather.", "Sap is thick and golden when it comes out of a tree.", "Producers use tubing because buckets are unsafe."], hint: "A summary gives the main ideas in a few sentences." },
      { prompt: "Why must the sap be boiled for hours?", right: "to remove most of the water", wrong: ["to make it colder", "to tap the trees", "to turn it into buckets"], hint: "Look for the reason in the second paragraph." },
      { prompt: "What can the reader conclude?", right: "Making syrup takes a lot of sap for a small amount of syrup.", wrong: ["Syrup can be made in any season.", "Sap and syrup are the same thing.", "Producers keep the sap for forty days."], hint: "Compare the forty litres of sap to the one litre of syrup." },
    ],
  },
  {
    title: "The Letter",
    text: [
      "Noor read the letter twice, folded it into a small square and slipped it into her pocket. At dinner she pushed her peas around the plate and answered every question with one word. When her little brother asked her to play, she shook her head and stared out of the window.",
    ],
    questions: [
      { prompt: "Which inference is best supported by the passage?", right: "The letter gave Noor news that worried or upset her.", wrong: ["The letter was a party invitation she was excited about.", "The letter was about her dinner.", "The letter was written by her brother."], hint: "Use her actions as clues to her feelings." },
      { prompt: "Which detail best supports that inference?", right: "She pushed her peas around the plate and answered with one word.", wrong: ["Dinner included peas.", "Her brother asked a question.", "The window was in the kitchen."], hint: "Which detail shows how she feels?" },
      { prompt: "What will most likely happen next?", right: "Someone will notice she is upset and ask what is wrong.", wrong: ["Noor will win a prize.", "Her brother will leave home.", "The window will break."], hint: "Predict using the clues about her mood." },
    ],
  },
  {
    title: "Why Bees Matter",
    text: [
      "Bees spend their days moving from flower to flower, collecting nectar. As they travel, grains of pollen stick to their bodies and are carried to the next flower. This process, called pollination, allows many plants to make fruit and seeds.",
      "Without pollinators, farmers would grow far fewer apples, blueberries and almonds. That is why many communities plant wildflowers and avoid certain sprays that harm bees.",
    ],
    questions: [
      { prompt: "What is the main idea of the passage?", right: "Bees pollinate plants, which helps food grow.", wrong: ["Bees make honey in the winter.", "Wildflowers are bigger than apples.", "Farmers do not need pollinators."], hint: "The main idea covers the whole passage." },
      { prompt: "What does the word pollination mean here?", right: "the carrying of pollen from flower to flower", wrong: ["the making of honey", "the planting of wildflowers", "the spraying of crops"], hint: "The sentence that follows the word explains it." },
      { prompt: "Why do communities plant wildflowers?", right: "to help bees and other pollinators", wrong: ["to cover the farm roads", "to keep bees away", "to grow almonds"], hint: "Look at the last sentence." },
    ],
  },
  {
    title: "The Hike",
    text: [
      "The sky had turned grey by noon, and the wind was picking up. Tomás checked his phone: no signal. Mia pulled out the trail map and frowned.",
      "“We still have two hours to the summit,” she said. Far off, something rumbled.",
    ],
    questions: [
      { prompt: "What is the best prediction about what happens next?", right: "The weather will get worse and the hikers will have to decide whether to turn back.", wrong: ["The hikers will reach the summit before noon.", "The hikers will find a signal and cancel the hike.", "The wind will stop and the sky will clear."], hint: "Use the clues in the setting." },
      { prompt: "Which detail best supports your prediction?", right: "The sky had turned grey and the wind was picking up.", wrong: ["Tomás checked his phone.", "Mia pulled out the map.", "They have a trail map."], hint: "Which clue points to the weather?" },
      { prompt: "What mood does the passage create?", right: "tense", wrong: ["cheerful", "silly", "sleepy"], hint: "Think about the weather, the frown and the rumble." },
    ],
  },
  {
    title: "The Night Market",
    text: [
      "Stalls glowed under strings of lanterns, and the air smelled of grilled corn and sweet dough. Ana held her brother's hand tightly as the crowd pushed past.",
      "“Stay close,” she said. A moment later, the lights flickered, and the music stopped.",
    ],
    questions: [
      { prompt: "Which detail best shows Ana is careful?", right: "She held her brother's hand tightly.", wrong: ["The air smelled of grilled corn.", "Lanterns hung over the stalls.", "The music played."], hint: "Look for an action that shows she wants to keep him safe." },
      { prompt: "What is the best prediction about what happens next?", right: "The lights go out or something unexpected happens, and Ana must keep her brother close.", wrong: ["Ana leaves the market for the day.", "The market becomes a library.", "Ana forgets about her brother."], hint: "Use the clues at the end of the passage." },
      { prompt: "What does the flickering light most likely signal?", right: "a change or problem is coming", wrong: ["the market is closing for the season", "Ana is winning a prize", "the corn is ready"], hint: "Authors use sudden changes to build suspense." },
    ],
  },
];

function strategies(): Question[] {
  return shuffle([...fromBank(STRATEGIES, 3), ...passageQuestions(STRATEGY_PASSAGES, "passage", 5)]);
}

// ---------- Digital media literacy ----------

const DIGITAL: BankItem[] = [
  { prompt: "Misinformation is…", right: "false information that is shared without meaning to cause harm", wrong: ["false information made up on purpose to deceive", "true information that is old", "a private message"], hint: "Mis- information is a mistake. Dis- information is on purpose." },
  { prompt: "Disinformation is…", right: "false information created and shared on purpose to mislead", wrong: ["an honest mistake", "a correct statistic", "a news headline"], hint: "Dis- information is deliberate." },
  { prompt: "You see a shocking post with no source. What should you do before sharing it?", right: "check other reliable sources to see if it is true", wrong: ["share it quickly so others know", "trust it because it has many likes", "trust it because it uses capital letters"], hint: "Likes and loud writing do not make a post true." },
  { prompt: "Why might your feed show mostly posts that match your interests and views?", right: "The platform curates content based on what you click and watch.", wrong: ["Everyone online thinks the same way.", "Posts are chosen at random.", "The platform shows only true posts."], hint: "Algorithms choose what to show you." },
  { prompt: "What does it mean that content is curated?", right: "Someone or something selected and arranged it.", wrong: ["It is always false.", "It has no author.", "It was made by a robot."], hint: "A curator chooses what to show, like in a museum." },
  { prompt: "Which password is the safest?", right: "a long phrase with letters, numbers and symbols that you use for only one account", wrong: ["your name and birth year", "password123", "the same short password for every account"], hint: "Long, unique passwords are harder to guess." },
  { prompt: "A website asks for your home address and phone number to enter a contest. What is the best response?", right: "ask a trusted adult and check whether the site is legitimate before sharing", wrong: ["fill it in, because contests are always safe", "post the contest for friends before you decide", "use a made-up name but your real address"], hint: "Protect your personal information." },
  { prompt: "Your digital footprint is…", right: "the trail of information about you that is left online", wrong: ["the size of your device", "a password", "the speed of your internet"], hint: "Everything you post or do online can leave a trace." },
  { prompt: "Before posting a photo of a friend, you should…", right: "ask for their permission", wrong: ["assume it is fine", "tag everyone automatically", "post it and delete it later if they object"], hint: "Respect other people's privacy." },
  { prompt: "Someone sends you a hurtful message online. Which is a good first step?", right: "do not reply, save the message and tell a trusted adult", wrong: ["reply with an insult", "delete it and tell no one", "forward it to the whole class"], hint: "Keep evidence and get help." },
  { prompt: "Which source is the most credible for information about a health topic?", right: "a hospital or public health agency website", wrong: ["an anonymous forum", "a celebrity's post", "an advertisement for a product"], hint: "Look for experts with no reason to mislead you." },
  { prompt: "What does copyright protect?", right: "a creator's rights to their original work", wrong: ["any text posted publicly", "only paper books", "the reader's right to copy anything online"], hint: "Creators own their work and can decide how it is used." },
  { prompt: "When you use a quote from a website in a report, you should…", right: "put it in quotation marks and cite the source", wrong: ["paraphrase it without credit", "remove the author's name", "say it was your idea"], hint: "Always give credit." },
  { prompt: "A toy commercial that airs during cartoons is most likely aimed at which audience?", right: "children and their families", wrong: ["retired people", "toy factory workers", "science teachers"], hint: "Think about who watches cartoons." },
  { prompt: "What is the purpose of most advertisements?", right: "to persuade people to buy something or support an idea", wrong: ["to give unbiased news", "to teach a school subject", "to keep people from paying attention"], hint: "Ads are made to influence." },
  { prompt: "A video uses fast cuts and loud music. How might this affect the audience?", right: "It can create excitement or make events feel urgent.", wrong: ["It makes the facts more accurate.", "It removes the creator's message.", "It makes the video silent."], hint: "Techniques shape how viewers feel." },
  { prompt: "A message meant for classmates is posted publicly. Who might be an unintended audience?", right: "strangers, or people who might see it years later", wrong: ["only the classmates", "nobody", "only the teacher"], hint: "Public means anyone can see it." },
  { prompt: "A clickbait headline is designed to…", right: "attract clicks, sometimes by exaggerating", wrong: ["give a complete summary", "avoid attention", "provide citations"], hint: "It makes you want to click." },
  { prompt: "Which action best shows respect when you collaborate in an online group?", right: "use polite language and listen to different views", wrong: ["write in all capital letters", "ignore messages you disagree with", "share other people's ideas as your own"], hint: "Respect others online as you would in person." },
  { prompt: "A reverse image search can help you…", right: "find where a picture came from and whether it was changed", wrong: ["make a picture larger", "add filters", "write captions automatically"], hint: "It is a way to check images." },
  { prompt: "Which is a sign that a website might be unreliable?", right: "It has no author, no date and no sources.", wrong: ["It names the author and gives the date.", "It links to its sources.", "It has a contact page."], hint: "Credible sites tell who wrote them, when and where the information came from." },
];

const DIGITAL_PASSAGES: Passage[] = [
  {
    title: "A Post That Spread",
    text: [
      "Last Tuesday, a photo went around the school group chat: a long line of people outside an electronics store, with the caption “Free phones tomorrow! Share now!” Within an hour it had 400 shares.",
      "Nobody checked the store's website, which said nothing about a giveaway. The photo was actually from a sale three years earlier.",
    ],
    questions: [
      { prompt: "What kind of information is this post?", right: "false information that spread quickly", wrong: ["a verified announcement", "an official advertisement", "a curated news report"], hint: "The giveaway did not exist." },
      { prompt: "What should the students have done first?", right: "checked the store's official website", wrong: ["shared it to be first", "counted the shares", "waited for more shares"], hint: "Check the source." },
      { prompt: "Why did the post spread so fast?", right: "People shared it without checking because it was exciting.", wrong: ["The store paid for it.", "Its facts had been checked.", "Social media shows only true posts."], hint: "Strong feelings make people share quickly." },
    ],
  },
  {
    title: "Why Your Feed Looks Like That",
    text: [
      "Video apps keep track of what you watch, like and skip. Then they use that information to choose what to show you next. If you watch three skateboarding videos, you will probably see more.",
      "This can be helpful, because you find topics you enjoy. But it also means each person sees a different, curated version of the app, and you may rarely see views that differ from your own.",
    ],
    questions: [
      { prompt: "Why do the apps track what you watch?", right: "to choose what to show you next", wrong: ["to delete videos you skip", "to teach you to skateboard", "to stop you from watching"], hint: "Look at the second sentence." },
      { prompt: "What is one downside of a curated feed?", right: "You may rarely see views different from your own.", wrong: ["You never find topics you enjoy.", "Every person sees exactly the same videos.", "The app stops working."], hint: "Read the last sentence." },
      { prompt: "What does “curated” mean in this passage?", right: "selected and arranged for you", wrong: ["made by hand", "deleted", "free of cost"], hint: "Someone or something chooses what you see." },
    ],
  },
];

function digital(): Question[] {
  return shuffle([...fromBank(DIGITAL, 4), ...passageQuestions(DIGITAL_PASSAGES, "passage", 4)]);
}

// ---------- Writing process ----------

const WRITING: BankItem[] = [
  { prompt: "You want to ask the principal to start a recycling program. Which text form best suits your purpose and audience?", right: "a formal letter", wrong: ["a text message to a friend", "a rhyming poem", "a comic strip"], hint: "Match the form to the audience and the purpose." },
  { prompt: "You want to share holiday news with a close friend. Which tone fits best?", right: "friendly and casual", wrong: ["formal and legal", "scientific and technical", "stiff and distant"], hint: "Voice changes with the audience." },
  { prompt: "Which sentence has the right voice for a letter to a city councillor?", right: "I am writing to request that the city install a crosswalk on Maple Road.", wrong: ["Hey, you guys need to put a crosswalk on Maple Road!!", "Crosswalk. Maple Road. Do it.", "Yo, can u fix that road thing?"], hint: "A letter to an official should be polite and clear." },
  { prompt: "Which sentence is the most precise?", right: "The kitten pounced on the red yarn.", wrong: ["The animal did something to the thing.", "A small creature moved near an object.", "The pet did stuff."], hint: "Specific nouns and verbs make writing clearer." },
  { prompt: "Which revision removes the wordiness? “Due to the fact that it was raining, the game was postponed.”", right: "Because it was raining, the game was postponed.", wrong: ["Because of the fact that rain was falling, the game ended up being postponed.", "The game, because of rain, postponed.", "It rained and postponed."], hint: "Say the same thing in fewer words without losing meaning." },
  { prompt: "Which sentence is edited correctly?", right: "Their team won the final, and they celebrated at Ravi's house.", wrong: ["There team won the final, and they celebrated at Ravi's house.", "Their team won the final, and they celebrated at Ravis house."], hint: "Check homophones and apostrophes." },
  { prompt: "What is the best way to give credit when you use someone else's idea?", right: "name the source in your text and list it in your sources", wrong: ["change a few words and skip the credit", "mention it only if you copy exact words", "use it without mentioning it, because ideas are free"], hint: "Citing sources applies to ideas as well as words." },
  { prompt: "Which source is the most reliable for a report on climate science?", right: "a national science agency's website", wrong: ["a blog by an anonymous writer", "a social media post with many likes", "an advertisement for a product"], hint: "Check who is behind the information and whether it is accurate." },
  { prompt: "When you revise a draft, you should mostly…", right: "improve the ideas, organization and clarity", wrong: ["only fix spelling", "only change the font", "only make it longer"], hint: "Revision is about the big picture. Proofreading fixes the details." },
  { prompt: "What does proofreading focus on?", right: "spelling, punctuation, grammar and format", wrong: ["the main idea and structure", "the purpose and audience", "the topic"], hint: "Proofreading comes last." },
  { prompt: "A writer adds the sentence “For example, 70% of students walk to school.” What does this revision do?", right: "adds supporting evidence", wrong: ["fixes a spelling error", "changes the text form", "removes repeated words"], hint: "Facts and numbers support a claim." },
  { prompt: "Your essay argues for a longer recess. A reader suggests you think about teachers' concerns. What is the reader asking you to do?", right: "acknowledge other perspectives", wrong: ["fix the grammar", "choose a new font", "add a title"], hint: "A fair text considers other viewpoints." },
  { prompt: "Which sentence shows bias?", right: "Anyone who disagrees with this plan simply does not care about students.", wrong: ["Some people disagree with this plan because of its cost.", "The plan costs $2 000.", "Many students support the plan, according to a survey."], hint: "Biased writing judges people unfairly instead of using evidence." },
  { prompt: "How can a writer reduce bias in a text?", right: "include different perspectives and support claims with evidence", wrong: ["use stronger emotional words", "leave out sources", "quote only people who agree"], hint: "Fairness means weighing more than one side." },
  { prompt: "Which revision best improves the flow? “I like soccer. I like soccer a lot. Soccer is my favourite sport.”", right: "I love soccer; it is my favourite sport.", wrong: ["I like soccer. I like soccer a lot.", "Soccer. I like it. Favourite.", "I like soccer and I like soccer and soccer is a sport."], hint: "Combine repeated ideas into a smooth sentence." },
  { prompt: "Which is the best topic sentence for a paragraph about the benefits of walking to school?", right: "Walking to school gives students exercise, fresh air and time with friends.", wrong: ["Some students take the bus.", "I woke up late today.", "Schools have many rooms."], hint: "A topic sentence states the main idea of the paragraph." },
  { prompt: "Which sentence has a strong, personal voice?", right: "My stomach did flips as I walked on stage, and my knees felt like jelly.", wrong: ["I was nervous and went on stage.", "There was a stage, and I went on it.", "A person walked onto a stage."], hint: "Voice shows personality through word choice and detail." },
  { prompt: "Which sentence is the strongest thesis for a persuasive essay?", right: "Schools should start later because teens need more sleep to learn well.", wrong: ["Schools start in the morning.", "I like sleeping.", "There are many schools."], hint: "A thesis states your position and reason." },
  { prompt: "Which edit fixes the run-on? “It was cold we wore jackets.”", right: "It was cold, so we wore jackets.", wrong: ["It was cold we wore, jackets.", "It was, cold we wore jackets.", "It was cold we wore jackets,"], hint: "Join two complete ideas with a comma and a conjunction." },
  { prompt: "A writer reads a draft aloud. Why?", right: "To hear awkward sentences and missing words", wrong: ["To change the topic", "To skip revising", "To make it longer"], hint: "Reading aloud helps you notice problems." },
  { prompt: "Which concluding sentence best wraps up an essay on recycling?", right: "By recycling more, our community can protect resources for the future.", wrong: ["Also, aluminum is a metal.", "Recycling bins are blue.", "That is all I have to say about lunch."], hint: "A conclusion returns to the main idea." },
  { prompt: "Which source should you cite in a report?", right: "A book you used to learn the facts", wrong: ["Only your own opinion", "A friend's guess", "Nothing at all"], hint: "Cite the sources whose ideas you used." },
  { prompt: "Which sentence uses a precise verb?", right: "The team sprinted across the field.", wrong: ["The team went across the field.", "The team did a thing across the field.", "The team moved over the field."], hint: "Precise verbs create a clear picture." },
  { prompt: "What is the main purpose of an outline?", right: "To organize ideas before writing a draft", wrong: ["To check spelling", "To print the final copy", "To choose a font"], hint: "Planning makes drafting easier." },
];

const SEQUENCES: string[][] = [
  ["Walking to school has many benefits.", "First, it gives students daily exercise.", "Second, fresh air helps them feel awake.", "Finally, walking with friends makes the trip fun."],
  ["The alarm rang before sunrise.", "Zoe grabbed her gear and ran to the rink.", "She laced her skates and stepped onto the ice.", "By the end of practice, her legs were shaking and she was grinning."],
  ["Choose a topic and a question to answer.", "Find reliable sources and take notes.", "Organize your notes into an outline.", "Write a draft, then revise and proofread it."],
];

function sequence(): Question {
  const items = shuffle(SEQUENCES)[0];
  const q: OrderQuestion = {
    kind: "order",
    prompt: "Tap the sentences in the best order.",
    hint: "Look for the opening idea, then words like first, second and finally, and a closing sentence.",
    items: items.map((label, i) => ({ id: `s${i}`, label })),
  };
  return q;
}

function writing(): Question[] {
  return shuffle([...fromBank(WRITING, 7), sequence()]);
}

export const units: Unit[] = [
  {
    id: "irony-satire-8",
    title: "Irony, Satire & Allusion",
    emoji: "🎭",
    blurb: "When words mean more than they say",
    standards: on("C3.1", "irony, satire and allusion, and how they help create meaning"),
    parentNote: "Telling verbal, situational and dramatic irony apart, spotting how satire uses exaggeration to criticize, and explaining what an allusion to a well-known story adds to a text.",
    generate: irony,
  },
  {
    id: "narrator-8",
    title: "Whose Story Is It?",
    emoji: "🗣️",
    blurb: "Limited, omniscient and unreliable narrators",
    standards: on("C1.6", "the narrator's point of view (limited, omniscient or unreliable) and alternative points of view"),
    parentNote: "Recognizing third-person limited and omniscient narrators, spotting clues that a narrator is unreliable, and thinking about how a story would change from another character's point of view.",
    generate: pointOfView,
  },
  {
    id: "forms-features-8",
    title: "Forms, Patterns & Visuals",
    emoji: "📰",
    blurb: "Text forms, patterns and visual design",
    standards: on("C1.2, C1.3, C1.4", "text forms and genres, text patterns such as problem-solution, text features, and how images and design add meaning"),
    parentNote: "Comparing text forms such as editorials, news articles, poems and graphic novels, spotting text patterns like problem-solution and compare-contrast, and judging how features, images and design add to meaning.",
    generate: forms,
  },
  {
    id: "strategies-8",
    title: "Reading Detective",
    emoji: "🔎",
    blurb: "Predict, infer and summarize",
    standards: on("C2.3, C2.4, C2.6, C3.2", "making predictions, checking understanding, summarizing, and making local and global inferences"),
    parentNote: "Making and checking predictions, choosing a strategy when reading gets tricky, drawing local and global inferences from clues, and summarizing the main ideas of complex texts.",
    generate: strategies,
  },
  {
    id: "digital-8",
    title: "Digital Citizens",
    emoji: "📱",
    blurb: "Safe, smart and respectful online",
    standards: on("A2.1–A2.5", "digital rights and responsibilities, online safety and privacy, misinformation and disinformation, and media forms and audiences"),
    parentNote: "Staying safe and respectful online, protecting privacy, spotting misinformation and disinformation, understanding how feeds are curated, and thinking about audience and purpose in digital and media texts.",
    generate: digital,
  },
  {
    id: "writing-8",
    title: "Write It Better",
    emoji: "✍️",
    blurb: "Voice, revising and proofreading",
    standards: on("D1.1, D1.3, D2.3–D2.6", "choosing form and audience, reliable sources, voice, perspective and bias, revising, editing and proofreading"),
    parentNote: "Choosing the right form and tone for an audience, using reliable sources and giving credit, building voice, acknowledging other perspectives, and revising, editing and proofreading drafts.",
    generate: writing,
  },
];
