import { fromBank, type BankItem } from "../bank";
import { shuffle } from "../random";
import type { Question, Unit } from "../types";
import { on, type Passage, passageQuestions } from "./kit";

// Ontario Grade 5 language (2023 curriculum). BC's reading, plot, figurative language, text structure
// and word-study units are shared; these units cover the grammar, sentence structure, punctuation,
// style and perspective work Ontario names for Grade 5.

// ---------- Grammar ----------

const GRAMMAR: BankItem[] = [
  { prompt: "Which word is the direct object? Mia kicked the ball.", right: "ball", wrong: ["Mia", "kicked"], hint: "The direct object receives the action. Ask: kicked what?" },
  { prompt: "Which word is the direct object? The chef baked a pie.", right: "pie", wrong: ["chef", "baked"], hint: "Ask: baked what?" },
  { prompt: "Which word is the direct object? Leo found his keys under the couch.", right: "keys", wrong: ["Leo", "couch"], hint: "Ask: found what? Under the couch tells where." },
  { prompt: "Which sentence has a direct object?", right: "The dog chased the squirrel.", wrong: ["The dog slept.", "The dog ran quickly."], hint: "Only the first verb is followed by a noun that receives the action." },
  { prompt: "Which word completes the sentence? Aiyana made the cake ___.", right: "herself", wrong: ["hisself", "theirselves"], hint: "Reflexive and intensive pronouns end in -self or -selves and match the subject." },
  { prompt: "Which word completes the sentence? The boys fixed the bikes ___.", right: "themselves", wrong: ["themself", "theirselves"], hint: "Use themselves with more than one person." },
  { prompt: "Which word completes the sentence? I taught ___ to whistle.", right: "myself", wrong: ["me", "mine"], hint: "The subject and object are the same person, so use a reflexive pronoun." },
  { prompt: "In which sentence is “myself” used to add emphasis?", right: "I built the shelf myself.", wrong: ["I looked at myself in the mirror.", "I hurt myself on the step."], hint: "An intensive pronoun stresses who did it. It could be removed and the sentence still works." },
  { prompt: "Which phrase has a proper adjective?", right: "a Canadian song", wrong: ["a happy song", "a long song"], hint: "A proper adjective comes from a proper noun, like Canada, and is capitalized." },
  { prompt: "Which proper adjective comes from Japan?", right: "Japanese", wrong: ["Japan's", "japanese"], hint: "Proper adjectives begin with a capital letter." },
  { prompt: "Which pair completes the sentence? ___ Tom ___ Maya plays hockey.", right: "Neither … nor", wrong: ["Either … nor", "Both … or"], hint: "Neither goes with nor." },
  { prompt: "Which pair completes the sentence? You can ___ walk ___ take the bus.", right: "either … or", wrong: ["either … nor", "neither … or"], hint: "Either goes with or." },
  { prompt: "Which pair completes the sentence? ___ the soup ___ the salad was delicious.", right: "Both … and", wrong: ["Both … or", "Either … and"], hint: "Both goes with and." },
  { prompt: "Which sentence uses correlative conjunctions correctly?", right: "Not only did we win, but we also had fun.", wrong: ["Not only did we win, and we also had fun.", "Not only did we win nor we also had fun."], hint: "Not only goes with but also." },
  { prompt: "Which words are correlative conjunctions? Both the lion and the tiger are big cats.", right: "Both … and", wrong: ["lion … tiger", "the … are"], hint: "Correlative conjunctions come in pairs." },
  { prompt: "Which sentence has a reflexive pronoun?", right: "She taught herself to juggle.", wrong: ["She taught him to juggle.", "She likes to juggle."], hint: "Herself refers back to the subject, she." },
  { prompt: "Which word is the direct object? Zoe painted a mural.", right: "mural", wrong: ["Zoe", "painted"], hint: "Ask: painted what?" },
  { prompt: "Which word is the direct object? The farmer planted rows of corn.", right: "rows", wrong: ["farmer", "planted"], hint: "Ask: planted what? Rows of corn is the thing that was planted." },
  { prompt: "Which word is the direct object? Ravi carried the groceries inside.", right: "groceries", wrong: ["Ravi", "inside"], hint: "Ask: carried what? Inside tells where." },
  { prompt: "Which sentence does NOT have a direct object?", right: "The baby giggled loudly.", wrong: ["The baby grabbed the spoon.", "The baby threw the ball."], hint: "Giggled does not act on anything. Look for a verb with no what." },
  { prompt: "Which word completes the sentence? Lena wrote the whole story ___.", right: "herself", wrong: ["her", "hers"], hint: "A reflexive or intensive pronoun points back to the subject, Lena." },
  { prompt: "Which word completes the sentence? We reminded ___ to drink water on the hike.", right: "ourselves", wrong: ["ourself", "us's"], hint: "Use ourselves for more than one person, including the speaker." },
  { prompt: "Which word completes the sentence? The cat cleaned ___ in the sun.", right: "itself", wrong: ["themselves", "himself"], hint: "A cat is one animal, so choose the one-animal form." },
  { prompt: "Which phrase has a proper adjective?", right: "an Italian recipe", wrong: ["a delicious recipe", "a family recipe"], hint: "Italian comes from the proper noun Italy, so it is capitalized." },
  { prompt: "Which proper adjective comes from France?", right: "French", wrong: ["france", "Frenchly"], hint: "Proper adjectives begin with a capital letter." },
  { prompt: "Which pair completes the sentence? ___ Amir ___ Priya forgot a lunch.", right: "Neither … nor", wrong: ["Neither … or", "Both … nor"], hint: "Neither goes with nor." },
  { prompt: "Which sentence uses correlative conjunctions correctly?", right: "Either we leave now, or we miss the bus.", wrong: ["Either we leave now, nor we miss the bus.", "Either we leave now, and we miss the bus."], hint: "Either goes with or." },
  { prompt: "Which pair completes the sentence? She is ___ clever ___ kind.", right: "both … and", wrong: ["both … or", "neither … and"], hint: "Both goes with and." },
  { prompt: "Which sentence has an intensive pronoun?", right: "The mayor herself visited our class.", wrong: ["The mayor visited our class.", "The mayor thanked us."], hint: "An intensive pronoun adds emphasis. Herself stresses that it was the mayor." },
  { prompt: "Which sentence has a reflexive pronoun?", right: "Noah surprised himself with his high score.", wrong: ["Noah surprised his friends with his high score.", "Noah had a high score."], hint: "Himself refers back to the subject, Noah." },
];

function grammar(): Question[] {
  return fromBank(GRAMMAR, 8);
}

// ---------- Sentences ----------

const SENTENCES: BankItem[] = [
  { prompt: "Which is a compound-complex sentence?", right: "When the storm ended, we went outside, and we built a snowman.", wrong: ["We went outside, and we built a snowman.", "When the storm ended, we went outside."], hint: "A compound-complex sentence has two independent clauses and at least one dependent clause." },
  { prompt: "Which is a compound-complex sentence?", right: "Because it was late, Ana packed up, but Sam stayed to read.", wrong: ["Ana packed up, but Sam stayed to read.", "Because it was late, Ana packed up."], hint: "Look for two complete ideas joined by but, and a dependent clause starting with because." },
  { prompt: "Which is a complex sentence?", right: "Although he was tired, Jay finished the race.", wrong: ["Jay was tired, but he finished the race.", "Jay finished the race."], hint: "One dependent clause plus one independent clause makes a complex sentence." },
  { prompt: "Which is a compound sentence?", right: "I like skating, but my brother prefers skiing.", wrong: ["I like skating.", "Because I like skating, I go every week."], hint: "Two independent clauses joined by but." },
  { prompt: "Which is a sentence fragment?", right: "Walking home from school in the rain.", wrong: ["We walked home from school in the rain.", "It rained."], hint: "A fragment is missing a complete idea. Who was walking?" },
  { prompt: "Which is a run-on sentence?", right: "The bus was late we waited in the cold.", wrong: ["The bus was late, so we waited in the cold.", "The bus was late."], hint: "Two complete ideas are jammed together without punctuation or a joining word." },
  { prompt: "Which fixes this run-on? The movie ended the lights came on.", right: "When the movie ended, the lights came on.", wrong: ["The movie ended the lights, came on.", "The movie ended, the lights came on."], hint: "Make one idea depend on the other with a joining word like when." },
  { prompt: "Which fixes this fragment? After we finished dinner.", right: "After we finished dinner, we did the dishes.", wrong: ["After we finished dinner, and the dishes.", "After we finished dinner we."], hint: "Add the main idea: what happened after dinner?" },
  { prompt: "Which sentence is a comma splice (two ideas joined only with a comma)?", right: "It was cold, we wore our coats.", wrong: ["It was cold, so we wore our coats.", "It was cold."], hint: "A comma alone cannot join two complete ideas. Add a joining word." },
  { prompt: "Which is a complete sentence?", right: "The river floods every spring.", wrong: ["Flooding every spring.", "Every spring along the river."], hint: "A complete sentence has a subject and a verb and a complete idea." },
  { prompt: "Which sentence joins these ideas best? The trail was muddy. We kept hiking. We were having fun.", right: "Although the trail was muddy, we kept hiking because we were having fun.", wrong: ["The trail was muddy we kept hiking we were having fun.", "The trail was muddy, we kept hiking, we were having fun."], hint: "Use joining words to show how the ideas connect." },
  { prompt: "How many independent clauses does this sentence have? We packed lunches, and Dad drove us to the lake.", right: "2", wrong: ["1", "3"], hint: "Each part can stand alone as a sentence." },
  { prompt: "How many dependent clauses does this sentence have? When it rains, I read, but when it is sunny, I bike.", right: "2", wrong: ["1", "0"], hint: "When it rains and when it is sunny cannot stand alone." },
  { prompt: "Which is a compound-complex sentence?", right: "After the bell rang, Kenji grabbed his bag, and Maya held the door.", wrong: ["Kenji grabbed his bag, and Maya held the door.", "After the bell rang, Kenji grabbed his bag."], hint: "Two complete ideas joined by and, plus a dependent clause starting with after." },
  { prompt: "Which is a complex sentence?", right: "Since the lake was frozen, we skated all afternoon.", wrong: ["The lake was frozen, so we skated all afternoon.", "We skated all afternoon."], hint: "Since the lake was frozen cannot stand alone, and it is joined to a full idea." },
  { prompt: "Which is a compound sentence?", right: "Ana plays the drums, and Leo plays the flute.", wrong: ["When Ana plays the drums, Leo plays the flute.", "Ana plays the drums."], hint: "Two independent clauses joined by and." },
  { prompt: "Which is a sentence fragment?", right: "The tall girl with the red backpack.", wrong: ["The tall girl waved.", "She has a red backpack."], hint: "What did the tall girl do? The idea is not finished." },
  { prompt: "Which is a sentence fragment?", right: "Because the power went out.", wrong: ["The power went out.", "We lit a candle."], hint: "Because makes you wait for the rest of the idea." },
  { prompt: "Which is a run-on sentence?", right: "I love autumn the leaves are bright.", wrong: ["I love autumn because the leaves are bright.", "I love autumn."], hint: "Two complete ideas are joined with no punctuation or joining word." },
  { prompt: "Which fixes this run-on? We were hungry we made pancakes.", right: "Because we were hungry, we made pancakes.", wrong: ["We were hungry we, made pancakes.", "We were hungry, we made pancakes."], hint: "Use a joining word like because to link the ideas." },
  { prompt: "Which fixes this comma splice? The snow was deep, we stayed home.", right: "The snow was deep, so we stayed home.", wrong: ["The snow was deep, we stayed, home.", "The snow was deep, we stayed home."], hint: "Add a joining word like so after the comma." },
  { prompt: "Which fixes this fragment? Until the rain stopped.", right: "We waited until the rain stopped.", wrong: ["Until the rain stopped, and.", "Until the rain stopped waiting."], hint: "Add a main idea that can stand alone." },
  { prompt: "How many independent clauses does this sentence have? Sam sang, Jay danced, and Zoe clapped.", right: "3", wrong: ["1", "2"], hint: "Count the parts that could each stand alone as a sentence." },
  { prompt: "How many dependent clauses does this sentence have? Although it was windy, we flew the kite.", right: "1", wrong: ["0", "2"], hint: "Although it was windy cannot stand alone." },
  { prompt: "Which sentence is a complete sentence?", right: "Dolphins leap out of the waves.", wrong: ["Leaping out of the waves.", "Dolphins in the waves."], hint: "Check for a subject, a verb and a finished idea." },
  { prompt: "Which sentence joins these ideas best? The path was steep. Priya kept climbing. She wanted the view.", right: "Although the path was steep, Priya kept climbing because she wanted the view.", wrong: ["The path was steep Priya kept climbing she wanted the view.", "The path was steep, Priya kept climbing, she wanted the view."], hint: "Use joining words to show how the ideas connect." },
];

function sentences(): Question[] {
  return fromBank(SENTENCES, 8);
}

// ---------- Punctuation ----------

const PUNCTUATION: BankItem[] = [
  { prompt: "Which sentence uses commas correctly for an appositive?", right: "My cousin, a talented artist, painted our fence.", wrong: ["My cousin a talented artist, painted our fence.", "My cousin, a talented artist painted our fence."], hint: "An appositive renames a noun. Set it off with a pair of commas." },
  { prompt: "Which sentence is punctuated correctly?", right: "Ottawa, the capital of Canada, is on the Ottawa River.", wrong: ["Ottawa the capital of Canada, is on the Ottawa River.", "Ottawa, the capital of Canada is on the Ottawa River."], hint: "The extra information about Ottawa goes between two commas." },
  { prompt: "Which sentence is punctuated correctly?", right: "Our dog, a golden retriever, loves the snow.", wrong: ["Our dog a golden retriever loves the snow.", "Our dog, a golden retriever loves the snow."], hint: "Commas go before and after the appositive." },
  { prompt: "Which sentence uses a comma correctly after a participial phrase?", right: "Running down the hill, Sam lost his hat.", wrong: ["Running down the hill Sam lost his hat.", "Running, down the hill Sam lost his hat."], hint: "A phrase that starts with an -ing verb is followed by a comma when it comes first." },
  { prompt: "Which sentence is punctuated correctly?", right: "Tired from the long hike, we fell asleep early.", wrong: ["Tired from the long hike we fell asleep early.", "Tired, from the long hike we fell asleep early."], hint: "Put a comma after an opening phrase that describes the subject." },
  { prompt: "Which sentence uses a colon correctly?", right: "Pack these items: a flashlight, a map and a snack.", wrong: ["Pack: these items a flashlight, a map and a snack.", "Pack these items a flashlight: a map and a snack."], hint: "A colon comes after a complete statement and introduces a list." },
  { prompt: "Which sentence uses a colon correctly?", right: "We need three things: patience, practice and courage.", wrong: ["We need: three things patience, practice and courage.", "We need three things patience: practice and courage."], hint: "A colon follows a complete idea and introduces what follows." },
  { prompt: "Which is correct?", right: "Bring the following: boots, mittens and a scarf.", wrong: ["Bring the following boots: mittens and a scarf.", "Bring: the following boots, mittens and a scarf."], hint: "The colon comes right after “the following”." },
  { prompt: "Which sentence uses commas correctly?", right: "My sister, who lives in Halifax, is visiting.", wrong: ["My sister who lives in Halifax, is visiting.", "My sister, who lives in Halifax is visiting."], hint: "Extra information is set off with commas on both sides." },
  { prompt: "Which sentence uses commas correctly?", right: "Mr. Chen, our principal, welcomed us.", wrong: ["Mr. Chen our principal, welcomed us.", "Mr. Chen, our principal welcomed us."], hint: "Our principal renames Mr. Chen, so put commas around it." },
  { prompt: "Which sentence is punctuated correctly?", right: "Walking into the room, Priya turned on the light.", wrong: ["Walking into the room Priya, turned on the light.", "Walking into the room Priya turned on the light."], hint: "A comma follows the opening participial phrase." },
  { prompt: "Which sentence is punctuated correctly?", right: "Toronto, the largest city in Ontario, has a busy harbour.", wrong: ["Toronto the largest city in Ontario, has a busy harbour.", "Toronto, the largest city in Ontario has a busy harbour."], hint: "Put commas on both sides of the extra information." },
  { prompt: "Which sentence is punctuated correctly?", right: "Our teacher, Ms. Singh, plays the guitar.", wrong: ["Our teacher Ms. Singh, plays the guitar.", "Our teacher, Ms. Singh plays the guitar."], hint: "Ms. Singh renames the teacher, so use a pair of commas." },
  { prompt: "Which sentence is punctuated correctly?", right: "The moose, a gentle giant, wandered past the cabin.", wrong: ["The moose a gentle giant, wandered past the cabin.", "The moose, a gentle giant wandered past the cabin."], hint: "An appositive renames a noun and is set off with commas." },
  { prompt: "Which sentence is punctuated correctly?", right: "Humming a quiet tune, Leo set the table.", wrong: ["Humming a quiet tune Leo set the table.", "Humming, a quiet tune Leo set the table."], hint: "A comma follows an opening phrase that starts with an -ing verb." },
  { prompt: "Which sentence is punctuated correctly?", right: "Surprised by the thunder, the puppy hid under the bed.", wrong: ["Surprised by the thunder the puppy hid under the bed.", "Surprised, by the thunder the puppy hid under the bed."], hint: "Put a comma after the opening phrase." },
  { prompt: "Which sentence is punctuated correctly?", right: "Grinning from ear to ear, Noah accepted his medal.", wrong: ["Grinning from ear to ear Noah, accepted his medal.", "Grinning from ear to ear Noah accepted his medal."], hint: "The comma goes right after the opening phrase, before the subject." },
  { prompt: "Which sentence uses a colon correctly?", right: "We visited three provinces: Ontario, Quebec and Manitoba.", wrong: ["We visited: three provinces Ontario, Quebec and Manitoba.", "We visited three provinces Ontario: Quebec and Manitoba."], hint: "A colon follows a complete statement and introduces a list." },
  { prompt: "Which sentence uses a colon correctly?", right: "Bring these supplies: paper, glue and scissors.", wrong: ["Bring: these supplies paper, glue and scissors.", "Bring these supplies paper, glue: and scissors."], hint: "A colon follows a complete statement and introduces the list." },
  { prompt: "Which is correct?", right: "The recipe needs four ingredients: flour, eggs, milk and butter.", wrong: ["The recipe needs: four ingredients flour, eggs, milk and butter.", "The recipe needs four ingredients flour, eggs: milk and butter."], hint: "Complete idea first, then the colon, then the list." },
  { prompt: "Which sentence uses commas correctly?", right: "Her brother, who loves chess, joined the club.", wrong: ["Her brother who loves chess, joined the club.", "Her brother, who loves chess joined the club."], hint: "Extra information goes between two commas." },
  { prompt: "Which sentence uses commas correctly?", right: "The library, which opens at nine, is across the street.", wrong: ["The library which opens at nine, is across the street.", "The library, which opens at nine is across the street."], hint: "If a comma opens the extra information, another comma must close it." },
  { prompt: "Which sentence uses commas correctly?", right: "Dr. Okafor, our family doctor, visited the school.", wrong: ["Dr. Okafor our family doctor, visited the school.", "Dr. Okafor, our family doctor visited the school."], hint: "Our family doctor renames Dr. Okafor, so set it off with commas." },
  { prompt: "Which sentence is punctuated correctly?", right: "Waving her flag, Ana cheered for the runners.", wrong: ["Waving her flag Ana cheered for the runners.", "Waving her flag Ana, cheered for the runners."], hint: "Place a comma after the participial phrase." },
  { prompt: "Which sentence is punctuated correctly?", right: "Maple Leaf Gardens, an old arena, is a famous building.", wrong: ["Maple Leaf Gardens an old arena, is a famous building.", "Maple Leaf Gardens, an old arena is a famous building."], hint: "An old arena renames the place, so put commas around it." },
];

function punctuation(): Question[] {
  return fromBank(PUNCTUATION, 8);
}

// ---------- Style and perspective ----------

const STYLE: BankItem[] = [
  { prompt: "Which sentence uses imagery?", right: "The cold wind stung my cheeks and the snow crunched under my boots.", wrong: ["It was winter.", "I went outside."], hint: "Imagery uses the senses: touch, sound, sight, smell or taste." },
  { prompt: "Which phrase uses imagery for sound?", right: "the sizzle and pop of bacon in the pan", wrong: ["the food on the stove", "a very hot pan"], hint: "Sizzle and pop help you hear the scene." },
  { prompt: "Which phrase uses imagery for smell?", right: "the sweet, warm scent of cinnamon buns", wrong: ["buns on a tray", "a bakery"], hint: "Scent words help you smell the scene." },
  { prompt: "Which sentence is meant to be funny?", right: "My cat thinks he is the boss of the whole house, and honestly, he's right.", wrong: ["My cat is grey.", "My cat sleeps in the afternoon."], hint: "Humour surprises or amuses the reader." },
  { prompt: "Which sentence uses exaggeration for humour?", right: "I'm so hungry I could eat a whole moose!", wrong: ["I am hungry.", "I had a sandwich."], hint: "Exaggeration stretches the truth to be funny." },
  { prompt: "Which sentence has the strongest, most exact word choice?", right: "The comet blazed across the midnight sky.", wrong: ["The comet went across the sky.", "The comet was in the sky at night."], hint: "Strong, exact words make a clear picture." },
  { prompt: "A writer uses short sentences. “Run. Hide. Wait.” What effect does this have?", right: "It makes the scene feel fast and tense.", wrong: ["It makes the scene feel slow and calm.", "It makes the scene feel silly."], hint: "Short sentences speed up the reading." },
  { prompt: "A writer uses a long, flowing sentence about a lazy river. What effect might it have?", right: "It can make the scene feel slow and peaceful.", wrong: ["It can make the scene feel tense.", "It makes the story shorter."], hint: "Long sentences can slow the reader down." },
  { prompt: "What is a writer's voice?", right: "the way the writing sounds, with its own personality", wrong: ["how loudly the writer reads aloud", "the title of the text"], hint: "Voice is the personality that comes through the words." },
  { prompt: "Which text has a friendly, casual voice?", right: "Hey there! Ready for the coolest facts about frogs?", wrong: ["Amphibians are cold-blooded vertebrates.", "Frogs: 4,900 species."], hint: "Casual words and questions make a friendly voice." },
  { prompt: "A text uses repeated words: “Never give up. Never back down. Never stop.” What is this word pattern for?", right: "to emphasize an idea", wrong: ["to confuse the reader", "to make the text shorter"], hint: "Repeating a word makes an idea stronger." },
  { prompt: "How does a photograph in a news article help the reader?", right: "It adds details and helps show what the words describe.", wrong: ["It takes the place of the text.", "It tells the reader what to think."], hint: "Images and graphics add meaning to the words." },
];

const PASSAGES: Passage[] = [
  {
    title: "Why Our School Needs a Garden",
    text: [
      "Our school should build a vegetable garden. Everyone knows gardens are the best thing a school can have, and nobody could possibly disagree.",
      "A garden would teach students where food comes from. Because students would care for plants, they would learn patience. Also, fresh vegetables could be shared at lunch.",
    ],
    questions: [
      { prompt: "What is the writer trying to do?", right: "persuade readers to build a garden", wrong: ["tell a made-up story", "explain how to cook"], hint: "The writer says what the school “should” do." },
      { prompt: "Which phrase shows bias, a one-sided opinion?", right: "nobody could possibly disagree", wrong: ["a vegetable garden", "fresh vegetables could be shared"], hint: "A strong word like nobody ignores other points of view." },
      { prompt: "Which sentence shows cause and effect?", right: "Because students would care for plants, they would learn patience.", wrong: ["Our school should build a vegetable garden.", "Also, fresh vegetables could be shared at lunch."], hint: "Because shows the reason and what happens as a result." },
    ],
  },
  {
    title: "The Great Lakes Report",
    text: [
      "The Great Lakes hold about one fifth of the world's fresh surface water. They are shared by Canada and the United States.",
      "Many people use the lakes for drinking water, shipping and fishing. Some people think boats harm the lakes, but others say careful rules can protect them.",
    ],
    questions: [
      { prompt: "Which sentence gives two points of view?", right: "Some people think boats harm the lakes, but others say careful rules can protect them.", wrong: ["The Great Lakes hold about one fifth of the world's fresh surface water.", "They are shared by Canada and the United States."], hint: "Some people and others show different views." },
      { prompt: "What is the main idea?", right: "The Great Lakes are important and shared, and people want to protect them.", wrong: ["Boats are bad.", "Canada is bigger than the United States."], hint: "The main idea covers the whole passage." },
      { prompt: "Which text feature would help a reader find the meaning of “fresh surface water”?", right: "a glossary", wrong: ["a title page", "a caption"], hint: "A glossary lists key words and their meanings." },
    ],
  },
  {
    title: "Wolf and Hare",
    text: [
      "“I will catch you by sunrise,” Wolf growled.",
      "Hare laughed and twitched her long ears. “You are as slow as a cloud,” she said, “and just as noisy.”",
    ],
    questions: [
      { prompt: "What does “as slow as a cloud” show?", right: "Hare is joking about how slow Wolf is.", wrong: ["Wolf is made of cloud.", "Hare is afraid of Wolf."], hint: "This is a funny comparison from Hare." },
      { prompt: "How does Hare feel?", right: "bold and playful", wrong: ["scared", "sleepy"], hint: "She laughed and joked." },
      { prompt: "Which words from the passage show voice and attitude?", right: "“You are as slow as a cloud”", wrong: ["“twitched her long ears”", "“by sunrise”"], hint: "Hare's own words show her personality." },
    ],
  },
];

const PREFACE: BankItem[] = [
  { prompt: "Where in a book would you find an introduction to why the author wrote it?", right: "the preface", wrong: ["the index", "the glossary"], hint: "A preface comes at the front of a book." },
  { prompt: "Where in a book would you look to find the meaning of a bold word?", right: "the glossary", wrong: ["the preface", "the cover"], hint: "A glossary lists key words and meanings." },
  { prompt: "What does a text feature such as a preface help a reader do?", right: "know what the book is about and why it was written", wrong: ["find a word's spelling", "see the page numbers"], hint: "A preface sets up the book." },
];

function perspective(): Question[] {
  return shuffle([...fromBank(STYLE, 3), ...fromBank(PREFACE, 1), ...passageQuestions(PASSAGES, "passage", 4)]);
}

export const units: Unit[] = [
  {
    id: "grammar-5",
    title: "Grammar Gears",
    emoji: "⚙️",
    blurb: "Objects, -self words and pairs",
    standards: on("B3.2", "direct objects, intensive and reflexive pronouns, proper adjectives and correlative conjunctions"),
    parentNote: "Finding the direct object, choosing herself, themselves and myself, capitalizing words like Canadian, and using pairs like either/or and not only/but also.",
    generate: grammar,
  },
  {
    id: "sentences-5",
    title: "Sentence Builders",
    emoji: "🧱",
    blurb: "Compound-complex and repairs",
    standards: on("B3.1", "compound-complex sentences, and fixing fragments and run-on sentences"),
    parentNote: "Building and spotting compound-complex sentences, and fixing fragments, run-ons and comma splices.",
    generate: sentences,
  },
  {
    id: "punctuation-5",
    title: "Punctuation Power",
    emoji: "✒️",
    blurb: "Commas and colons",
    standards: on("B3.3", "commas around appositives and participial phrases, and colons before lists"),
    parentNote: "Setting off extra information with commas, adding commas after opening phrases, and using colons to introduce lists.",
    generate: punctuation,
  },
  {
    id: "style-and-perspective",
    title: "Style & Perspective",
    emoji: "🎨",
    blurb: "Imagery, voice and bias",
    standards: on("C1.3–C1.5, C3.1, C3.5", "imagery, humour and voice, word patterns, visual elements, text features, and perspectives and bias in texts"),
    parentNote: "Noticing imagery, humour, voice and sentence length, using book parts like the preface and glossary, and spotting one-sided opinions in persuasive writing.",
    generate: perspective,
  },
];
