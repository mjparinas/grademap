import { fromBank, type BankItem } from "../bank";
import { shuffle } from "../random";
import type { Question, Unit } from "../types";
import { on, type Passage, passageQuestions } from "./kit";

// Ontario Grade 4 language (2023 curriculum). BC's reading, point of view, figurative language and
// word-building units are shared; these units cover the grammar, sentence structure, punctuation and
// text features Ontario names for Grade 4.

// ---------- Grammar ----------

const GRAMMAR: BankItem[] = [
  { prompt: "Which word completes the sentence? The girl ___ won the race is my cousin.", right: "who", wrong: ["which", "whose"], hint: "Use who to tell more about a person." },
  { prompt: "Which word completes the sentence? The book ___ I borrowed is funny.", right: "that", wrong: ["who", "whom"], hint: "Use that or which for things. Who is for people." },
  { prompt: "Which word completes the sentence? The boy ___ bike was stolen called the police.", right: "whose", wrong: ["who", "that"], hint: "Whose shows who owns something." },
  { prompt: "Which word is the relative pronoun? Ana has a dog that loves to swim.", right: "that", wrong: ["dog", "swim"], hint: "A relative pronoun joins a describing part to a noun." },
  { prompt: "Which sentence uses the correct relative pronoun?", right: "The teacher who reads to us is kind.", wrong: ["The teacher which reads to us is kind.", "The teacher whose reads to us is kind."], hint: "Who tells about a person." },
  { prompt: "Which sentence is in the present perfect tense?", right: "She has finished her homework.", wrong: ["She finishes her homework.", "She will finish her homework."], hint: "Present perfect uses has or have with a past-tense verb." },
  { prompt: "Which completes the sentence? They ___ lived here for three years.", right: "have", wrong: ["has", "had been"], hint: "Use have with they." },
  { prompt: "Which completes the sentence? Mia ___ eaten lunch already.", right: "has", wrong: ["have", "is"], hint: "Use has with one person, plus the verb eaten." },
  { prompt: "Which sentence is in the past perfect tense?", right: "He had packed before we arrived.", wrong: ["He has packed since we arrived.", "He packs before we arrive."], hint: "Past perfect uses had plus a past-tense verb, for something that happened before another past event." },
  { prompt: "Which is the correct form? I have ___ my project.", right: "finished", wrong: ["finish", "finishing"], hint: "Have needs a past-tense verb: finished." },
  { prompt: "Which sentence is a command?", right: "Close the door.", wrong: ["Do you close the door?", "She closes the door."], hint: "A command tells someone to do something. The verb is an imperative verb." },
  { prompt: "Which sentence asks a question?", right: "Does Lena play the drums?", wrong: ["Lena plays the drums.", "Play the drums, Lena."], hint: "A question often starts with a helping verb like do, does or did." },
  { prompt: "Which word is a possessive pronoun used like an adjective? Sam fed his dog.", right: "his", wrong: ["Sam", "fed"], hint: "His tells whose dog it is." },
  { prompt: "Which word completes the sentence? The students packed ___ lunches.", right: "their", wrong: ["there", "they're"], hint: "Their shows that the lunches belong to the students." },
  { prompt: "Which word completes the sentence? ___ shoes are on the mat. (the ones close to me)", right: "These", wrong: ["That", "This"], hint: "These points to more than one thing that is near." },
  { prompt: "Which word completes the sentence? Look at ___ bird over there. (one far away)", right: "that", wrong: ["this", "these"], hint: "That points to one thing that is far away." },
  { prompt: "Which pair is correct? ___ coat is on the hook and ___ boots are by the door.", right: "My, your", wrong: ["Me, you", "I, you"], hint: "My and your tell who owns something. They work like adjectives." },
  { prompt: "Which word completes the sentence? The neighbour ___ waters our plants is away.", right: "who", wrong: ["whose", "which"], hint: "Use who to tell more about a person." },
  { prompt: "Which word completes the sentence? The jacket ___ I wore was too warm.", right: "that", wrong: ["who", "whose"], hint: "Use that for things." },
  { prompt: "Which word completes the sentence? The girl ___ drawing won the prize is my friend.", right: "whose", wrong: ["who", "which"], hint: "Whose shows who owns the drawing." },
  { prompt: "Which sentence is in the present perfect tense?", right: "We have planted the seeds.", wrong: ["We plant the seeds.", "We will plant the seeds."], hint: "Present perfect uses has or have with a past-tense verb." },
  { prompt: "Which completes the sentence? Noah ___ visited the museum twice.", right: "has", wrong: ["have", "had been"], hint: "Use has with one person." },
  { prompt: "Which sentence is in the past perfect tense?", right: "She had finished before the bell rang.", wrong: ["She has finished since the bell rang.", "She finishes before the bell rings."], hint: "Past perfect uses had plus a past-tense verb." },
  { prompt: "Which is the correct form? We have ___ the book.", right: "read", wrong: ["reading", "reads"], hint: "Have needs a past-tense verb: read." },
  { prompt: "Which sentence is a command?", right: "Please wash your hands.", wrong: ["Did you wash your hands?", "He washes his hands."], hint: "A command tells someone to do something." },
  { prompt: "Which sentence asks a question?", right: "Did Priya bring the map?", wrong: ["Priya brought the map.", "Bring the map, Priya."], hint: "A question often starts with do, does or did." },
  { prompt: "Which word completes the sentence? ___ cookies on the plate are warm. (the ones near me)", right: "These", wrong: ["That", "This"], hint: "These points to more than one thing that is near." },
  { prompt: "Which word completes the sentence? ___ mountain far away is tall.", right: "That", wrong: ["These", "This"], hint: "That points to one thing that is far away." },
  { prompt: "Which pair is correct? ___ turn is next, and ___ turn is after.", right: "Her, your", wrong: ["She, you", "Hers, yours"], hint: "Her and your work like adjectives and come before a noun." },
];

function grammar(): Question[] {
  return fromBank(GRAMMAR, 8);
}

// ---------- Sentences ----------

const SENTENCES: BankItem[] = [
  { prompt: "Which part is an independent clause? We went inside because it started to rain.", right: "We went inside", wrong: ["because it started to rain", "to rain"], hint: "An independent clause can stand alone as a sentence." },
  { prompt: "Which part is a dependent clause? We went inside because it started to rain.", right: "because it started to rain", wrong: ["We went inside", "went inside"], hint: "A dependent clause cannot stand alone. It begins with a joining word like because." },
  { prompt: "Which is a prepositional phrase? The cat slept under the warm blanket.", right: "under the warm blanket", wrong: ["The cat slept", "slept under"], hint: "A prepositional phrase starts with a preposition (under) and ends with a noun." },
  { prompt: "Which sentence has a prepositional phrase?", right: "We ate lunch on the porch.", wrong: ["We ate lunch.", "Lunch was good."], hint: "On the porch begins with the preposition on." },
  { prompt: "Which is a compound sentence?", right: "Jay plays the flute, and Aiyana plays the drums.", wrong: ["Jay plays the flute in the band.", "Jay plays the flute because he loves music."], hint: "A compound sentence joins two independent clauses with and, but or so." },
  { prompt: "Which is a complex sentence?", right: "When the bell rang, the students left the room.", wrong: ["The bell rang, and the students left the room.", "The students left the room."], hint: "A complex sentence has an independent clause and a dependent clause." },
  { prompt: "Which word joins two independent clauses? I wanted a snack, but the fridge was empty.", right: "but", wrong: ["wanted", "empty"], hint: "But joins the two complete ideas." },
  { prompt: "Which is a sentence fragment?", right: "After the long walk home.", wrong: ["We walked home.", "The walk was long."], hint: "A fragment is missing the main idea. What happened after the long walk?" },
  { prompt: "Which is a run-on sentence?", right: "We saw a deer it ran into the woods.", wrong: ["We saw a deer, and it ran into the woods.", "We saw a deer."], hint: "A run-on has two complete ideas squished together with no joining word or punctuation." },
  { prompt: "How can you fix this run-on? The sun set we went home.", right: "The sun set, so we went home.", wrong: ["The sun set we, went home.", "The sun set so we went, home."], hint: "Add a comma and a joining word between the two ideas." },
  { prompt: "Which sentence is the best combination of these two? Ravi was tired. He kept walking.", right: "Ravi was tired, but he kept walking.", wrong: ["Ravi was tired because he kept walking.", "Ravi was tired, or he kept walking."], hint: "The second idea is a surprise, so use but." },
  { prompt: "Which sentence has two prepositional phrases?", right: "The dog ran across the yard to the gate.", wrong: ["The dog ran fast.", "The dog barked at the mail carrier."], hint: "Across the yard and to the gate each begin with a preposition." },
  { prompt: "Which joining word shows a reason? We stayed in ___ it was freezing.", right: "because", wrong: ["but", "or"], hint: "Because gives the reason." },
  { prompt: "Which joining word starts a dependent clause? ___ the movie ended, we went home.", right: "After", wrong: ["And", "So"], hint: "After makes the first part depend on the main idea." },
  { prompt: "Which sentence is complete?", right: "The trail winds up the mountain.", wrong: ["Winding up the mountain.", "Up the mountain on the trail."], hint: "A complete sentence has a subject and a verb that tells what the subject does." },
  { prompt: "Which sentence has the dependent clause at the end?", right: "I will wait here until you come back.", wrong: ["Until you come back, I will wait here.", "I will wait here."], hint: "Find the clause that begins with until." },
  { prompt: "Which part is an independent clause? Since the path was icy, we walked slowly.", right: "we walked slowly", wrong: ["Since the path was icy", "the path was icy"], hint: "An independent clause can stand alone as a sentence." },
  { prompt: "Which part is a dependent clause? Maya smiled when she saw the cake.", right: "when she saw the cake", wrong: ["Maya smiled", "smiled when"], hint: "A dependent clause begins with a joining word like when and cannot stand alone." },
  { prompt: "Which is a prepositional phrase? The kitten hid behind the sofa.", right: "behind the sofa", wrong: ["The kitten hid", "hid behind"], hint: "It starts with a preposition (behind) and ends with a noun." },
  { prompt: "Which sentence has a prepositional phrase?", right: "The bus stopped at the corner.", wrong: ["The bus stopped.", "The bus was late."], hint: "At the corner begins with the preposition at." },
  { prompt: "Which is a compound sentence?", right: "Lena sings, and Kenji plays the piano.", wrong: ["Lena sings in the choir.", "Because Lena sings, Kenji plays."], hint: "Two independent clauses joined by and." },
  { prompt: "Which is a complex sentence?", right: "Although it was cold, we played outside.", wrong: ["It was cold, so we stayed inside.", "We played outside."], hint: "Although begins a dependent clause joined to a main idea." },
  { prompt: "Which is a sentence fragment?", right: "Under the old wooden bridge.", wrong: ["The river flows under the bridge.", "We crossed the bridge."], hint: "A fragment is missing a subject and a verb for the main idea." },
  { prompt: "How can you fix this run-on? It rained we stayed in.", right: "It rained, so we stayed in.", wrong: ["It rained we, stayed in.", "It rained so we stayed, in."], hint: "Add a comma and a joining word." },
  { prompt: "Which sentence is the best combination of these two? Zoe was nervous. She sang loudly.", right: "Zoe was nervous, but she sang loudly.", wrong: ["Zoe was nervous, or she sang loudly.", "Zoe was nervous because she sang loudly."], hint: "The second idea is a surprise, so use but." },
  { prompt: "Which joining word shows a choice? We can walk, ___ we can ride.", right: "or", wrong: ["because", "although"], hint: "Or gives two choices." },
  { prompt: "Which sentence has two prepositional phrases?", right: "The ball rolled down the hill into the pond.", wrong: ["The ball rolled quickly.", "The ball splashed loudly."], hint: "Down the hill and into the pond each begin with a preposition." },
];

function sentences(): Question[] {
  return fromBank(SENTENCES, 8);
}

// ---------- Punctuation ----------

const PUNCTUATION: BankItem[] = [
  { prompt: "Which phrase uses a capital letter correctly?", right: "Canadian geese", wrong: ["canadian geese", "Canadian Geese"], hint: "A proper adjective comes from a proper noun, like Canada, so it starts with a capital letter. The noun geese does not." },
  { prompt: "Which phrase is written correctly?", right: "French bread", wrong: ["french bread", "French Bread"], hint: "French comes from France, so it is capitalized. Bread is a common noun." },
  { prompt: "Which phrase is written correctly?", right: "an Ontario park", wrong: ["an ontario park", "an Ontario Park"], hint: "Ontario is a proper name, so keep the capital letter." },
  { prompt: "Which sentence uses a comma correctly?", right: "Maya, please sit down.", wrong: ["Maya please, sit down.", "Maya please sit, down."], hint: "Put a comma after the name when you speak directly to someone." },
  { prompt: "Which sentence uses commas correctly?", right: "Thank you, Mr. Singh, for your help.", wrong: ["Thank you Mr. Singh, for your help.", "Thank, you Mr. Singh for your help."], hint: "Set off the name of the person you are talking to with commas." },
  { prompt: "Which sentence uses a comma correctly?", right: "Can you help me, Leo?", wrong: ["Can you help, me Leo?", "Can you help me Leo?"], hint: "Put a comma before a name at the end of a question." },
  { prompt: "Which title is written correctly?", right: "We read the poem “Autumn Leaves” in class.", wrong: ["We read the poem Autumn Leaves in class.", "We read the poem ‘Autumn Leaves” in class."], hint: "Put quotation marks around the title of a short work, like a poem or a song." },
  { prompt: "Which sentence uses quotation marks for a title correctly?", right: "My favourite song is “Hand in Hand.”", wrong: ["My favourite song is Hand in Hand.", "My “favourite” song is Hand in Hand."], hint: "Quotation marks go around the whole title." },
  { prompt: "Which sentence is punctuated correctly?", right: "Chapter 3 is called “The Lost Key.”", wrong: ["Chapter 3 is called The “Lost Key.”", "Chapter 3 is “called” The Lost Key."], hint: "A chapter title is a short work, so put it in quotation marks." },
  { prompt: "Which kind of title gets quotation marks?", right: "a short poem", wrong: ["a whole chapter book", "a movie"], hint: "Short works like poems, songs and short stories use quotation marks." },
  { prompt: "Which sentence has the right capital letters?", right: "In July, we visited the Rocky Mountains.", wrong: ["In july, we visited the Rocky mountains.", "in July we visited the rocky mountains."], hint: "Capitalize months and the names of places." },
  { prompt: "Which sentence is punctuated correctly?", right: "“Please pass the salt,” said Dad.", wrong: ["“Please pass the salt” said Dad.", "“Please pass the salt.” said Dad."], hint: "A comma goes inside the quotation marks when the speaker comes after." },
  { prompt: "Which sentence has the right punctuation?", right: "Aiyana asked, “Is it time to go?”", wrong: ["Aiyana asked “Is it time to go”?", "Aiyana asked, “is it time to go?”"], hint: "A question mark goes inside the quotes if the quoted words are a question." },
  { prompt: "Which phrase is written correctly?", right: "the Canadian flag", wrong: ["the canadian flag", "the Canadian Flag"], hint: "Canadian comes from Canada. Capitalize it." },
  { prompt: "Which phrase is written correctly?", right: "Italian pasta", wrong: ["italian pasta", "Italian Pasta"], hint: "Italian comes from Italy, so it is capitalized." },
  { prompt: "Which phrase is written correctly?", right: "a Chinese lantern", wrong: ["a chinese lantern", "a Chinese Lantern"], hint: "Chinese comes from China, so it begins with a capital." },
  { prompt: "Which phrase is written correctly?", right: "Indian music", wrong: ["indian music", "Indian Music"], hint: "A proper adjective gets a capital letter, but the noun music does not." },
  { prompt: "Which sentence uses a comma correctly?", right: "Sam, come and see this.", wrong: ["Sam come, and see this.", "Sam come and see, this."], hint: "Put a comma after the name when you speak directly to someone." },
  { prompt: "Which sentence uses a comma correctly?", right: "I am ready, Ms. Lee.", wrong: ["I am ready Ms. Lee.", "I am, ready Ms. Lee."], hint: "Put a comma before the name of the person you are talking to." },
  { prompt: "Which sentence uses commas correctly?", right: "Yes, Priya, I will help.", wrong: ["Yes Priya, I will help.", "Yes, Priya I will help."], hint: "Set off the name with commas." },
  { prompt: "Which sentence uses quotation marks for a title correctly?", right: "We sang “Row, Row, Row Your Boat.”", wrong: ["We sang Row, Row, Row Your Boat.", "We “sang” Row, Row, Row Your Boat."], hint: "Songs are short works. Put the whole title in quotation marks." },
  { prompt: "Which kind of title gets quotation marks?", right: "a song", wrong: ["a long novel", "a magazine"], hint: "Short works like songs and poems use quotation marks." },
  { prompt: "Which sentence is punctuated correctly?", right: "The short story “The Red Kite” is my favourite.", wrong: ["The short story The “Red Kite” is my favourite.", "The short story “The Red Kite is my favourite.”"], hint: "Put the whole title in quotation marks." },
  { prompt: "Which sentence has the right capital letters?", right: "We drove through Manitoba in August.", wrong: ["We drove through manitoba in august.", "We drove through Manitoba in august."], hint: "Capitalize months and names of provinces." },
  { prompt: "Which sentence is punctuated correctly?", right: "Leo said, “It is time to eat.”", wrong: ["Leo said “It is time to eat”.", "Leo said, “it is time to eat.”"], hint: "A comma after said, then a capital letter, with the end mark inside the quotes." },
];

function punctuation(): Question[] {
  return fromBank(PUNCTUATION, 8);
}

// ---------- Text features and perspective ----------

const FEATURES: BankItem[] = [
  { prompt: "In an online article, a word in blue that you can click is called a…", right: "hyperlink", wrong: ["caption", "glossary"], hint: "A hyperlink takes you to another page when you click it." },
  { prompt: "Why might an author put a word in bold type?", right: "to show it is important or in the glossary", wrong: ["because it is spelled wrong", "to make the page longer"], hint: "Type styles like bold help the reader notice key words." },
  { prompt: "Why might an author put a title in italics?", right: "to set it apart from the rest of the text", wrong: ["to hide it", "to show it is a question"], hint: "Italic type slants. It can show titles or stress a word." },
  { prompt: "What does a caption do?", right: "explains a picture or photo", wrong: ["lists the chapters", "gives the page number"], hint: "A caption is the small text under or beside a picture." },
  { prompt: "A map shows a school with a park to its east. Where is the park?", right: "to the right of the school", wrong: ["to the left of the school", "above the school"], hint: "On a map, east is to the right." },
  { prompt: "In a diagram, how can you tell what each part is?", right: "by reading the labels", wrong: ["by counting the pages", "by reading the index"], hint: "Labels name the parts of a diagram." },
  { prompt: "Where would you look first to find the meaning of a bold word?", right: "the glossary", wrong: ["the table of contents", "the cover"], hint: "A glossary lists key words and what they mean." },
  { prompt: "A graphic text shows steps in a circle with arrows. What does the order show?", right: "the steps happen again and again", wrong: ["the steps are in alphabetical order", "the steps do not matter"], hint: "A circle means the pattern repeats." },
  { prompt: "A picture shows a tall tree at the top and roots at the bottom. What kind of order is this?", right: "top to bottom", wrong: ["smallest to largest", "alphabetical"], hint: "Spatial order tells where things are in space, like top to bottom or left to right." },
  { prompt: "Which words show spatial order?", right: "above, beside, below", wrong: ["first, next, last", "because, so, then"], hint: "Spatial order uses words about where things are." },
  { prompt: "A bar graph has a title and labels. What do labels help you do?", right: "know what each bar stands for", wrong: ["know who drew the graph", "know when the graph was drawn"], hint: "Labels tell what the bars and numbers mean." },
  { prompt: "Where in a book would you look to find which page a topic is on?", right: "the index", wrong: ["the caption", "the cover"], hint: "An index lists topics in alphabetical order with page numbers." },
  { prompt: "What does a heading do in an article?", right: "tells what the next part is about", wrong: ["shows the author's name", "gives the page number"], hint: "Headings help readers find parts of a text." },
];

const PASSAGES: Passage[] = [
  {
    title: "The Clever Crow",
    text: [
      "Crow was thirsty. She found a tall jug with a little water at the bottom. “My beak is too short,” she grumbled.",
      "She thought hard. Then she dropped pebbles into the jug, one by one. The water slowly rose, and at last Crow took a long, cool drink.",
    ],
    questions: [
      { prompt: "Which part of this story is anthropomorphism, where an animal acts like a person?", right: "Crow grumbled and thought hard.", wrong: ["Crow found a jug.", "Crow took a drink."], hint: "Real crows do not talk or plan like people." },
      { prompt: "Why did the water rise in the jug?", right: "Crow dropped pebbles into it.", wrong: ["It rained.", "Crow poured more water in."], hint: "Look for the cause: the pebbles took up space." },
      { prompt: "What does the story teach?", right: "Clever thinking can solve a problem.", wrong: ["Crows are afraid of jugs.", "Water is always at the bottom."], hint: "Think about how Crow solved her problem." },
    ],
  },
  {
    title: "The Angry Storm",
    text: [
      "The wind howled and slammed the shutters. Thunder grumbled across the sky like a hungry giant.",
      "By morning the storm had run out of breath. The sun peeked over the hills as if nothing had happened.",
    ],
    questions: [
      { prompt: "Which phrase is an example of personification?", right: "The wind howled and slammed the shutters.", wrong: ["The sun came up in the morning.", "The storm lasted all night."], hint: "Personification gives human actions to things that are not people." },
      { prompt: "What does “the storm had run out of breath” mean?", right: "The storm was over.", wrong: ["The storm got stronger.", "A person was out of breath."], hint: "A person who runs out of breath stops. So did the storm." },
      { prompt: "What did the storm do first?", right: "The wind howled.", wrong: ["The sun peeked out.", "The shutters opened."], hint: "Read the first paragraph." },
    ],
  },
  {
    title: "A Trip to the Lake",
    text: [
      "You pull on your boots and grab the paddle. The canoe is waiting at the dock.",
      "You step in carefully. It wobbles, and you hold your breath. Then the water goes still, and you glide out across the lake.",
    ],
    questions: [
      { prompt: "What point of view is this story told in?", right: "second person", wrong: ["first person", "third person"], hint: "The story speaks to you, so it uses the word you." },
      { prompt: "Which word is the clue?", right: "you", wrong: ["I", "they"], hint: "A story told to the reader uses you." },
      { prompt: "Why does the canoe wobble?", right: "because you step in", wrong: ["because the wind is strong", "because it has no paddle"], hint: "The wobble happens right after you step in." },
    ],
  },
  {
    title: "Two Plans",
    text: [
      "Kenji wanted to build a treehouse. First, he drew a plan and collected boards. Because he had measured twice, the boards fit.",
      "Meanwhile, his sister Hana planted a garden below the tree. She watered it every morning, so the seedlings grew fast.",
    ],
    questions: [
      { prompt: "Why did the boards fit?", right: "Kenji measured twice.", wrong: ["Hana helped him.", "He bought them at a shop."], hint: "Look for because in the first paragraph." },
      { prompt: "Why did the seedlings grow fast?", right: "Hana watered them every morning.", wrong: ["Kenji built a treehouse.", "It rained every day."], hint: "The word so shows the effect of the watering." },
      { prompt: "What is the second plot in this passage about?", right: "Hana's garden", wrong: ["Kenji's plan", "a trip to the lake"], hint: "The passage tells about two things that were happening at once." },
    ],
  },
];

function textFeatures(): Question[] {
  return shuffle([...fromBank(FEATURES, 4), ...passageQuestions(PASSAGES, "passage", 4)]);
}

export const units: Unit[] = [
  {
    id: "grammar-4",
    title: "Grammar Gears",
    emoji: "⚙️",
    blurb: "Who, which, have and has",
    standards: on("B3.2", "relative pronouns, the perfect tense, questions and commands, and pronouns used as adjectives"),
    parentNote: "Choosing who, which, that and whose, using have, has and had with the right verb form, telling questions from commands, and using my, your, their, this and these.",
    generate: grammar,
  },
  {
    id: "sentences-4",
    title: "Sentence Builders",
    emoji: "🧱",
    blurb: "Clauses and phrases",
    standards: on("B3.1", "simple and compound sentences with prepositional phrases and independent and dependent clauses"),
    parentNote: "Spotting independent and dependent clauses and prepositional phrases, joining ideas into compound and complex sentences, and fixing run-ons and fragments.",
    generate: sentences,
  },
  {
    id: "punctuation-4",
    title: "Punctuation Power",
    emoji: "❝",
    blurb: "Proper adjectives, names and titles",
    standards: on("B3.3", "capital letters for proper adjectives, commas for direct address and quotation marks for short titles"),
    parentNote: "Capitalizing words like Canadian and French, using commas when talking to someone by name, and putting quotation marks around the titles of poems, songs and chapters.",
    generate: punctuation,
  },
  {
    id: "text-features-4",
    title: "Clues in Texts",
    emoji: "🔎",
    blurb: "Features, perspective and cause",
    standards: on("C1.3, C1.6, C3.1, C3.3", "text features and graphic texts, point of view, personification and anthropomorphism, and cause and effect"),
    parentNote: "Understanding hyperlinks, bold and italic type, labels and captions, telling who is narrating, spotting personification, and tracing causes and effects.",
    generate: textFeatures,
  },
];
