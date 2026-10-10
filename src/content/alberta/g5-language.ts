import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { levelled, withSort, type Item } from "../ontario/g56-bank";
import { ab } from "./kit";

// Alberta Grade 5 English language arts (2022 curriculum). BC and Ontario units that fit are shared (see g5.ts).
// These three cover parts of the Alberta Grade 5 snapshot they leave out: writing for a purpose and audience,
// spelling, and working with others in discussion.

// ---------- Writing for different audiences and purposes ----------

const WRITING: Item[] = [
  { prompt: "Mina is writing to persuade her principal to add a bike rack. Which opening fits best?", right: "Our school needs a bike rack, and here are three reasons why.", wrong: ["Once upon a time there was a bike.", "Bikes have two wheels and a chain.", "Hey whatever, bikes are cool lol."], hint: "To persuade, state your opinion clearly and promise reasons." },
  { prompt: "Which is the best purpose for a recipe card?", right: "to explain how to do something", wrong: ["to make people laugh", "to tell a made-up story", "to describe a feeling"], hint: "A recipe gives steps so a reader can make something." },
  { prompt: "You are writing a thank-you note to your grandmother. Which greeting fits?", right: "Dear Grandma,", wrong: ["To whom it may concern,", "Attention all customers,", "Greetings, valued reader,"], hint: "Match your words to the person who will read them. A warm note to family sounds friendly." },
  { prompt: "Which sentence is better for a formal letter to the city council?", right: "I am writing to ask the council to repair the crosswalk on Maple Street.", wrong: ["Hey council, fix the crosswalk already!", "The crosswalk is like totally broken, ugh.", "Crosswalk. Maple. Fix it."], hint: "A formal letter uses complete sentences, polite words and a clear request." },
  { prompt: "Which text is written to entertain?", right: "A funny story about a moose who learns to skateboard", wrong: ["A list of bus times", "A science report on rainfall", "The rules of a board game"], hint: "Stories, jokes and poems are often written to entertain." },
  { prompt: "A writer wants to inform kids about how bees make honey. Which detail belongs?", right: "Worker bees collect nectar and turn it into honey in the hive.", wrong: ["Bees are my least favourite insect, so avoid them.", "You must buy the biggest jar of honey today!", "Once, a bee named Buzz went on an adventure."], hint: "To inform, include facts that answer the reader's questions." },
  { prompt: "Which word choice would help young children understand a story about space?", right: "The rocket zoomed up, up, up into the dark sky.", wrong: ["The vehicle underwent vertical propulsion.", "The apparatus achieved orbital trajectory.", "Ascension was commenced."], hint: "Choose simple, lively words that your audience knows." },
  { prompt: "What should a writer do first before starting a piece of writing?", right: "Think about the purpose and who will read it", wrong: ["Choose the font", "Add the title page", "Hand it in"], hint: "Knowing your audience and purpose helps you decide what to say and how." },
  { prompt: "Which closing sentence best finishes a persuasive paragraph?", right: "For these reasons, please add more recycling bins to our school.", wrong: ["The end.", "Bins are made of plastic.", "I also like lunch."], hint: "A strong ending repeats your request or main idea." },
  { prompt: "Which is an example of informal writing?", right: "Hi Sam! Can't wait for the sleepover. See you soon!", wrong: ["Dear Mayor Lopez, I respectfully request a meeting.", "Report on the water cycle, Section 2.", "Minutes of the student council meeting."], hint: "Informal writing sounds like friendly talking, with short phrases and exclamation marks." },
  { prompt: "Zoe writes: 'The rink is a fun place.' Which revision adds a precise detail?", right: "The rink is cold and echoing, and the ice smells like fresh snow.", wrong: ["The rink is a nice place.", "The rink is a place that is fun.", "It is a fun place, the rink."], hint: "Specific sensory details are more interesting than general words." },
  { prompt: "Which title best suits a news article about a school food drive?", right: "Students Collect 500 Cans for the Food Bank", wrong: ["Cans Are Round", "What I Did Last Summer", "A Poem About Soup"], hint: "A news title tells readers the most important fact." },
  { prompt: "Which sentence best matches the voice of a friendly e-mail to a classmate?", right: "I found a cool book about whales you might like.", wrong: ["The undersigned has located a volume of cetacean interest.", "Whales: A Study in Marine Biology, Third Edition.", "Whales are mammals (see Table 4)."], hint: "Choose a voice that sounds natural for the reader.", hard: true },
  { prompt: "Amir wants to convince readers to visit Elk Island National Park. Which fact would help most?", right: "The park is home to a large herd of plains bison that visitors can see.", wrong: ["The park exists.", "Parks have trees.", "Amir has a hat."], hint: "Choose evidence that gives readers a reason to act.", hard: true },
  { prompt: "A paragraph jumps between pizza, hockey and homework. What should the writer fix?", right: "Keep the paragraph about one main idea", wrong: ["Add more topics", "Make the sentences shorter", "Take out all the periods"], hint: "Each paragraph should stay focused on one idea.", hard: true },
  { prompt: "Which pair of words shows the writer's purpose is to persuade?", right: "should and must", wrong: ["once and then", "bark and meow", "red and blue"], hint: "Strong words like 'should' and 'must' show the writer wants the reader to act.", hard: true },
];

const WRITING_SORT: SortSet = {
  prompt: "Is the writing formal or informal? Tap an item, then tap its basket.",
  hint: "Formal writing is polite and careful, for people we do not know well. Informal writing sounds like friendly talk.",
  bins: [
    { id: "formal", label: "Formal", emoji: "👔" },
    { id: "informal", label: "Informal", emoji: "😊" },
  ],
  items: [
    { label: "Dear Principal Singh,", emoji: "✉️", bin: "formal" },
    { label: "Thank you for your time and consideration.", emoji: "🙏", bin: "formal" },
    { label: "I am writing to request permission for a field trip.", emoji: "📝", bin: "formal" },
    { label: "Sincerely, Maya Lee", emoji: "✍️", bin: "formal" },
    { label: "Hey Jay, what's up?", emoji: "👋", bin: "informal" },
    { label: "That game was so awesome!!", emoji: "🎮", bin: "informal" },
    { label: "See ya later, alligator!", emoji: "🐊", bin: "informal" },
    { label: "Can't wait for the weekend!", emoji: "🎉", bin: "informal" },
  ],
};

// ---------- Spelling ----------

const SPELLING: Item[] = [
  { prompt: "Which spelling is correct?", right: "neighbour", wrong: ["nieghbour", "nayber", "naybour"], hint: "In Canadian spelling, 'neighbour' keeps the 'u'. Remember 'ei' sounds like 'ay' here." },
  { prompt: "Which spelling is correct?", right: "favourite", wrong: ["favorit", "favourit", "favoryte"], hint: "Canadian spelling keeps the 'u' in 'our' words, and ends with 'ite'." },
  { prompt: "Which is the plural of 'knife'?", right: "knives", wrong: ["knifes", "knifs", "knifies"], hint: "Many words that end in 'f' or 'fe' change to 'ves' in the plural." },
  { prompt: "Which is the plural of 'city'?", right: "cities", wrong: ["citys", "cityes", "citis"], hint: "When a word ends in a consonant plus 'y', change the 'y' to 'i' and add 'es'." },
  { prompt: "Add 'ing' to 'hope'. Which is correct?", right: "hoping", wrong: ["hopeing", "hopping", "hopeng"], hint: "Drop the silent 'e' before adding 'ing'." },
  { prompt: "Add 'ed' to 'hop'. Which is correct?", right: "hopped", wrong: ["hoped", "hopeed", "hopd"], hint: "A short word with one vowel and one final consonant doubles the consonant: hop, hopped." },
  { prompt: "Which word is spelled correctly?", right: "centre", wrong: ["senter", "centr", "sentre"], hint: "Canadian spelling uses 're' at the end of 'centre', 'metre' and 'theatre'." },
  { prompt: "Which spelling is correct?", right: "theatre", wrong: ["theatr", "thaetre", "theeter"], hint: "Canadian spelling uses 're' at the end of 'theatre', 'metre' and 'centre'." },
  { prompt: "Which word completes the sentence? The team lost ___ last game.", right: "its", wrong: ["it’s", "its’", "it’s’"], hint: "'Its' shows belonging. 'It's' means 'it is'." },
  { prompt: "Which word completes the sentence? ___ going to the park after school.", right: "We’re", wrong: ["Were", "Where", "Wear"], hint: "'We're' is a short form of 'we are'." },
  { prompt: "Which word means 'to put clothes on'?", right: "wear", wrong: ["where", "were", "ware"], hint: "'Wear' is about clothes. 'Where' asks about a place." },
  { prompt: "Which spelling is correct?", right: "receive", wrong: ["recieve", "receve", "receeve"], hint: "Remember: 'i' before 'e' except after 'c'." },
  { prompt: "Which spelling is correct?", right: "separate", wrong: ["seperate", "seprate", "separete"], hint: "There is 'a rat' in 'separate'." },
  { prompt: "Which spelling is correct?", right: "necessary", wrong: ["neccessary", "necesary", "necessery"], hint: "It has one collar (c) and two sleeves (ss).", hard: true },
  { prompt: "Which word is spelled correctly?", right: "government", wrong: ["goverment", "govermant", "govenment"], hint: "Sound it out: gov-ern-ment. The 'n' is easy to forget.", hard: true },
  { prompt: "Which spelling is correct?", right: "colour", wrong: ["colur", "coulour", "culor"], hint: "In Canada we keep the 'u' in 'colour', 'honour' and 'harbour'.", hard: true },
  { prompt: "The word 'unhappy' has a prefix. Which is it?", right: "un-", wrong: ["-happy", "-py", "hap-"], hint: "A prefix comes at the start of a word and changes its meaning.", hard: true },
];

// ---------- Working with others in discussion ----------

const TALK: Item[] = [
  { prompt: "A classmate is speaking. What is the best way to show you are listening?", right: "Look at them and wait until they finish", wrong: ["Whisper to a friend", "Finish their sentences", "Look at the clock"], hint: "Good listeners face the speaker and wait their turn." },
  { prompt: "Your group disagrees with you. What is a respectful way to respond?", right: "I see your point. Here is another idea.", wrong: ["That's a silly idea.", "I won't listen to you.", "You are wrong."], hint: "Respectful disagreement acknowledges the other person's idea first." },
  { prompt: "Which phrase builds on another person's idea?", right: "I agree with Priya, and I would also add that…", wrong: ["I do not care about that.", "Let's change the subject.", "Nobody asked you."], hint: "Building on an idea connects what you say to what someone else has said." },
  { prompt: "Why do groups choose roles like timekeeper and recorder?", right: "So everyone has a job and the work gets done", wrong: ["So one person does everything", "So nobody has to talk", "So the teacher can decide"], hint: "Clear roles help a group work together." },
  { prompt: "A group has to choose a topic. What is a fair way to decide?", right: "Take turns sharing ideas, then vote or reach agreement together", wrong: ["The loudest person picks", "Pick whichever topic you like alone", "Skip the decision"], hint: "Everyone should have a say in the decision." },
  { prompt: "Which question helps a speaker explain more?", right: "Can you tell us more about that?", wrong: ["Are you done yet?", "Why would anyone think that?", "Is this on the test?"], hint: "Open questions invite more detail." },
  { prompt: "Which of these is a good way to share a problem you cannot solve alone?", right: "Explain where you are stuck and ask the group for ideas", wrong: ["Keep quiet and hope no one notices", "Take over someone else's work", "Give up"], hint: "Problem solving is easier together." },
  { prompt: "A group member is quiet. What could you do?", right: "Invite them to share: 'What do you think?'", wrong: ["Speak for them", "Ignore them", "Tell them to hurry"], hint: "Inviting others makes sure all voices are heard." },
  { prompt: "Which sentence restates what someone said to check you understood?", right: "So you are saying that we should start with the map, right?", wrong: ["I was not listening.", "That is boring.", "Let's do mine instead."], hint: "Restating a point in your own words shows you listened." },
  { prompt: "You want to share a different idea in a discussion. When is a good time?", right: "After the current speaker finishes", wrong: ["In the middle of their sentence", "Never", "While others are writing"], hint: "Wait for a pause and then add your idea." },
  { prompt: "Which tone is best for a group discussion?", right: "calm and friendly", wrong: ["angry and loud", "sarcastic", "silent"], hint: "Tone of voice is part of how people understand you." },
  { prompt: "A group needs to make a decision but is split 50-50. What could help?", right: "Look for a compromise that includes ideas from both sides", wrong: ["Flip a coin without talking", "Make one side leave", "Give up on the task"], hint: "A compromise means each side gives a little.", hard: true },
  { prompt: "Which is a fact you could use to support your point in a discussion?", right: "Our class recycled 120 kg of paper last month.", wrong: ["Recycling is the best.", "Everyone loves recycling.", "I think paper is boring."], hint: "Facts can be checked. Opinions cannot.", hard: true },
  { prompt: "Another speaker's idea is different from yours but has good evidence. What should you do?", right: "Be open to changing your mind", wrong: ["Argue louder", "Ignore the evidence", "Change the topic"], hint: "Good thinkers can change their mind when they hear strong reasons.", hard: true },
];

const TALK_SORT: SortSet = {
  prompt: "Does it help a discussion or get in the way? Tap an item, then tap its basket.",
  hint: "Helpful habits include listening and taking turns. Habits that get in the way stop others from sharing.",
  bins: [
    { id: "help", label: "Helps", emoji: "👍" },
    { id: "block", label: "Gets in the way", emoji: "🚫" },
  ],
  items: [
    { label: "waiting for your turn", emoji: "⏳", bin: "help" },
    { label: "asking a question", emoji: "❓", bin: "help" },
    { label: "giving a reason", emoji: "💬", bin: "help" },
    { label: "thanking someone for an idea", emoji: "🙏", bin: "help" },
    { label: "interrupting", emoji: "✋", bin: "block" },
    { label: "talking over others", emoji: "📢", bin: "block" },
    { label: "rolling your eyes", emoji: "🙄", bin: "block" },
    { label: "ignoring a quiet member", emoji: "🙈", bin: "block" },
  ],
};

export const units: Unit[] = [
  {
    id: "writing-audience-ab",
    title: "Write for Your Reader",
    emoji: "✍️",
    blurb: "Match your words to who is reading",
    standards: ab("Analyze and reflect on ways to write effectively for different audiences and purposes.", "choosing words, tone and details for the reader and the purpose"),
    parentNote: "Writing to inform, persuade or entertain; formal and informal voice; and picking details, openings and word choices that suit the reader.",
    generate: ({ difficulty = 2 } = {}) => withSort(WRITING, WRITING_SORT, difficulty),
  },
  {
    id: "spelling-ab",
    title: "Spelling Smarts",
    emoji: "🔤",
    blurb: "Plurals, endings and tricky words",
    standards: ab("Experiment with and apply grammar, spelling, and punctuation to develop precise written communication.", "spelling patterns, plurals, suffix rules, homophones and Canadian spellings"),
    parentNote: "Spelling rules (plurals, dropping the silent e, doubling a final consonant), homophones such as its and it's, commonly misspelled words and Canadian spellings like colour and centre.",
    generate: ({ difficulty = 2 } = {}) => levelled(SPELLING, 8, difficulty),
  },
  {
    id: "group-talk-ab",
    title: "Talking Together",
    emoji: "🗣️",
    blurb: "Share ideas and solve problems as a team",
    standards: ab("Engage in collaborative dialogue to share ideas, solve problems, and make decisions.", "listening, building on ideas, respectful disagreement and group decisions"),
    parentNote: "Speaking and listening in a group: taking turns, building on ideas, asking questions, disagreeing respectfully and reaching decisions together.",
    generate: ({ difficulty = 2 } = {}) => withSort(TALK, TALK_SORT, difficulty),
  },
];
