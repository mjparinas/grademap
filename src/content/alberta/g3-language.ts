import type { SortSet } from "../bank";
import type { Unit } from "../types";
import { bankUnit, hq, order, q, type Item } from "../ontario/g3-4-kit";
import { ab } from "./kit";

// Alberta Grade 3 English language arts. The units below cover the parts of the Alberta Grade 3 ELA
// outcomes that the existing Grade 3 units do not: oral traditions, speaking and listening, connecting
// reading to your own life, and finding ideas for writing. Indigenous oral traditions are described as
// living practices of many different communities, with no stories retold and nothing sacred.

// ---------- Oral traditions ----------

const ORAL: Item[] = [
  q("Many First Nations, Métis and Inuit communities pass on knowledge through oral traditions. What does that mean?", "sharing stories, songs and teachings by speaking", ["only writing in books", "only drawing maps", "only using computers"], "Oral means spoken. Oral traditions are knowledge shared out loud, from one generation to the next.", "🗣️"),
  q("Who often shares oral teachings in a community?", "Elders and Knowledge Keepers", ["strangers on the street", "only visitors", "nobody"], "Elders and Knowledge Keepers are respected people who carry knowledge and share it.", "🧓"),
  q("An Elder is telling a story to your class. What is a respectful way to listen?", "listen quietly and look at the speaker", ["talk with a friend", "walk around the room", "play with a toy"], "Respectful listening shows you value what is being shared.", "👂"),
  q("Why do we thank a guest who shares a story?", "to show respect for their time and knowledge", ["because we have to leave", "to make the story shorter", "so they will stop"], "Saying thank you is a way to show respect.", "🙏"),
  q("A storyteller shares knowledge that belongs to their family or community. Before retelling it, you should…", "ask for permission", ["change the ending and tell it as your own", "sell it to someone", "skip asking"], "Some stories belong to families or communities. We ask before we share them.", "🤝"),
  q("Oral traditions are important because they…", "keep knowledge, history and values alive", ["are only for fun", "are only about the past", "replace every school subject"], "They are living ways of learning and remembering.", "🌱"),
  q("Which of these is a way knowledge is passed on orally?", "an Elder tells a teaching to children", ["a text message", "a sign on a road", "a shopping list"], "The knowledge is spoken from person to person.", "🧒"),
  q("When we listen to a storyteller, we should…", "pay attention and keep our questions for the end", ["interrupt with questions", "leave in the middle", "make jokes"], "Waiting politely shows respect.", "✋"),
  q("Oral traditions are still part of life today. That means they are…", "living", ["only in museums", "finished", "forgotten"], "Many communities share stories and teachings every day.", "🌿"),
  q("Why might a story be told differently by different storytellers?", "each storyteller shares in their own voice and community", ["because someone made a mistake", "because the story is not true", "because it was written down"], "Storytellers use their own voice, and communities have their own teachings.", "🎙️"),
  q("Which action shows you value shared knowledge?", "remembering it and using it kindly", ["laughing at it", "ignoring it", "making fun of it"], "Valuing means taking it seriously and using it with care.", "💚"),
  q("A visitor to your class shares a story about the land. You can show thanks by…", "saying thank you and listening carefully", ["asking for something in return", "taking photos without asking", "leaving early"], "Respectful guests ask before taking photos or recordings.", "📸"),
  hq("Why do we ask permission before recording an Elder's story?", "the story and the knowledge belong to the speaker and their community", ["recordings are always allowed", "it is only about the camera", "stories belong to everybody"], "Asking shows respect for who owns and cares for the knowledge.", "🎙️"),
  hq("What is one way oral traditions and written books are alike?", "both can keep and share knowledge", ["both need electricity", "both are only for adults", "both must be silent"], "Different ways of recording knowledge can all be valuable.", "📖"),
  hq("Why is it a mistake to say that every Nation has the same stories?", "each First Nation, Métis community and Inuit community has its own", ["because stories do not exist", "because all stories are written", "because they are all the same"], "There are many different peoples with their own languages and teachings.", "🗺️"),
  hq("The Blackfoot, Cree, Dene and Nakoda (Stoney) peoples all live in Alberta. What does this tell us?", "Alberta is home to many distinct First Nations", ["there is only one Nation", "all use the same language", "they live in the same place"], "Many Nations have their own cultures and languages.", "🏔️"),
  q("Oral traditions are passed down by…", "speaking, from person to person", ["only printing", "only email", "only television"], "Knowledge is shared out loud, often for many generations.", "🗣️"),
  q("An Elder visits and sits at the front. How can you show respect when they arrive?", "greet them kindly and listen carefully", ["ignore them", "ask them to hurry", "race to the front"], "Kind greetings and careful listening show respect.", "🙂"),
  q("Why do many communities share stories with children?", "to help them learn their language, history and values", ["to keep them awake", "to stop them asking questions", "because there are no books"], "Stories teach and connect people.", "👧"),
  q("When a storyteller pauses, a good listener…", "waits quietly", ["fills in the words", "starts talking", "gets up"], "Pauses are part of telling a story well.", "⏸️"),
  q("A storyteller invites you to ask questions at the end. What is a good question?", "What did you want us to remember?", ["Can I go now?", "Is this almost over?", "Why is it so long?"], "Thoughtful questions show you were listening.", "❓"),
  q("Which is an oral tradition?", "a song passed down in a family or community", ["a store receipt", "a road sign", "a text from a friend"], "Songs can carry teachings and history.", "🎶"),
  q("Elders are often respected because they…", "carry knowledge and experience", ["know every word of every language", "are the youngest", "can read minds"], "Elders have lived long and learned much.", "🧓"),
  q("Which is a kind way to thank a Knowledge Keeper?", "say thank you and tell what you learned", ["walk out without a word", "ask for more homework", "take their things"], "Showing thanks is a way to show respect.", "💐"),
  q("Why can listening to a story be a way of learning?", "you hear ideas, feelings and lessons told in the speaker's own voice", ["you do not need to think", "you can't remember it", "it never teaches anything"], "Storytelling is a way to learn.", "👂"),
  q("Some stories are meant to be told only at certain times, or only by certain people. What should we do?", "respect the rules of the community that owns them", ["tell them anyway", "change the rules", "ignore the rules"], "The community decides who can share its stories.", "🤝"),
  hq("Why can a story told out loud change a little each time it is told?", "each telling is shared in a living voice for a particular audience", ["the story is broken", "somebody wants to trick people", "the words are not important"], "Oral traditions are living, and storytellers care for the teachings they carry.", "🎙️"),
  hq("Which sentence respects that First Nations, Métis and Inuit peoples are living cultures?", "Many communities share oral traditions today.", ["They did this long ago and stopped.", "These stories are only in museums.", "All Nations tell the same stories."], "Use the present tense for living cultures.", "🌿"),
];

// ---------- Speaking and listening ----------

const SPEAK_SORT: SortSet = {
  prompt: "Does the action help or get in the way of listening? Tap an item, then tap its basket.",
  hint: "Good listeners look at the speaker, stay still and think about what they hear.",
  bins: [
    { id: "help", label: "good listening", emoji: "👂" },
    { id: "block", label: "hard to listen", emoji: "🙉" },
  ],
  items: [
    { label: "looking at the speaker", emoji: "👀", bin: "help" },
    { label: "sitting still", emoji: "🧘", bin: "help" },
    { label: "nodding to show you understand", emoji: "🙂", bin: "help" },
    { label: "waiting for your turn", emoji: "✋", bin: "help" },
    { label: "talking at the same time", emoji: "🗯️", bin: "block" },
    { label: "looking out the window", emoji: "🪟", bin: "block" },
    { label: "tapping loudly on your desk", emoji: "🥁", bin: "block" },
    { label: "turning your back", emoji: "🙈", bin: "block" },
  ],
};

const SPEAK: Item[] = [
  q("When you give a talk, where should you look?", "at your audience", ["at the floor the whole time", "at the ceiling", "at your shoes"], "Eye contact shows you are talking to your listeners.", "👀"),
  q("Which way of standing helps you talk to a group?", "standing tall with your feet steady", ["hiding behind a chair", "turning your back", "lying on the floor"], "Good posture helps your voice carry and shows confidence.", "🧍"),
  q("What does it mean to speak clearly?", "to say your words so others can understand", ["to whisper so no one hears", "to talk as fast as you can", "to shout"], "Clear speaking is not too fast, not too quiet and not too loud.", "🗣️"),
  q("A speaker is telling a funny part of a story. A gesture could be…", "showing with your hands how big the thing was", ["covering your mouth", "folding your arms and looking away", "closing your eyes"], "Gestures are hand and body movements that help show meaning.", "🙌"),
  q("What can a smile and a friendly face show?", "that you are happy to share", ["that you are bored", "that you are cross", "that you want to stop"], "Your face can add to your words.", "😊"),
  q("What should you do with your voice when you tell a sad part of a story?", "make it softer and slower", ["shout it", "sing it", "talk faster"], "You can change your voice to match the feeling.", "🎭"),
  q("When a classmate is speaking, a good listener…", "waits for a turn before talking", ["interrupts to share", "talks to a friend", "looks away"], "Waiting shows respect.", "✋"),
  q("Your friend finished a talk. Which is a kind comment?", "I liked how you showed the size with your hands.", ["That was boring.", "You talked too much.", "I wasn't listening."], "Kind comments say something specific and helpful.", "👏"),
  q("If you do not understand something someone said, you can…", "ask a polite question", ["pretend you understand", "walk away", "tease the speaker"], "Asking helps you learn.", "🙋"),
  q("Why do speakers pause between big ideas?", "to give listeners time to think", ["because they forgot", "to make the talk longer", "to fall asleep"], "A short pause helps listeners follow the ideas.", "⏸️"),
  q("A good speaker speaks in a voice that is…", "loud enough for everyone to hear", ["too quiet to hear", "so loud it hurts", "full of giggles"], "Match your voice to the room.", "📣"),
  q("A gesture is…", "a movement of your hands, face or body that adds meaning", ["a loud sound", "a long word", "a silent letter"], "Pointing or nodding are gestures.", "👋"),
  hq("You are sharing news with the whole class. How can your body language help?", "stand facing the class and use calm gestures", ["stay behind the desk and look down", "turn to the wall", "wave your arms wildly"], "Calm, open movements help people listen.", "🧑‍🏫"),
  hq("A listener nods and says “I see.” What does this show?", "they are following what you say", ["they want you to stop", "they are leaving", "they are bored"], "Small signals show a listener is paying attention.", "🙂"),
  hq("Why is it respectful to look at a speaker in many classrooms?", "it shows you are paying attention", ["it is always a rule everywhere", "it keeps them quiet", "it means you agree"], "In some cultures and families, other ways of showing respect are used too, such as looking down. We can respect both.", "👁️"),
  hq("A classmate speaks very quietly. What is a polite way to help?", "ask kindly if they can speak a little louder", ["shout at them", "laugh", "walk away"], "Kind requests help everyone.", "🔈"),
];

// ---------- Connecting to texts ----------

const CONNECT: Item[] = [
  q("A story is about a boy who loses his mitten at recess. You once lost a mitten too. This is a…", "connection to the story", ["new character", "mistake in the story", "kind of poem"], "A text-to-self connection links the story to your own life.", "🧤"),
  q("Which sentence makes a connection to your own life?", "This reminds me of when I went skating with my cousin.", ["The story has 5 pages.", "The author wrote it last year.", "There is a picture of a tree."], "Connections start with “This reminds me of…”.", "⛸️"),
  q("Why do readers make connections?", "to understand a story better", ["to read faster", "to skip pages", "to avoid reading"], "Connections help us understand how characters feel.", "💭"),
  q("A poem is about the first snowfall. You remember the first snow where you live. What do you do?", "tell how the poem matches your memory", ["close the book", "change the poem", "cover the pictures"], "Linking a poem to a memory helps you feel it.", "❄️"),
  q("In a play, a character is nervous before a show. You were nervous before a recital. What can you say?", "I know how that feels.", ["I never get nervous.", "This play is long.", "Who painted the set?"], "Connections can be about feelings.", "🎭"),
  q("A book about a farm in Alberta reminds you of a trip to a farm. This is a connection to…", "your own experience", ["another country", "a different century", "a rule of grammar"], "You linked the book to something you did.", "🚜"),
  q("Which question can help you connect a book to your life?", "Has something like this ever happened to me?", ["How many words are there?", "What colour is the cover?", "Who printed it?"], "Ask how the story is like your life.", "❓"),
  q("You read an information book about owls. You saw an owl last summer. How can this help you read?", "you can picture what the book describes", ["it cannot help", "you can skip reading", "it changes the facts"], "What you know helps you understand new information.", "🦉"),
  q("When a character is sad and you felt sad too, you share…", "a feeling", ["a title", "an author", "an index"], "Sharing feelings helps you understand the character.", "😢"),
  q("A friend says, “That makes me think of my grandma's kitchen.” What did your friend do?", "made a personal connection", ["asked a fact question", "changed the story", "corrected a spelling mistake"], "A connection links the text to a person's life.", "🏠"),
  q("What can you do before reading a book about bison?", "think about what you already know about bison", ["close your eyes and sleep", "read the last page only", "skip the title"], "Thinking about what you know helps you read.", "🦬"),
  q("A poem says “The moon is a silver coin.” You say, “I saw the moon last night, and it did look like a coin.” You…", "linked the poem to what you saw", ["fixed a spelling mistake", "wrote a new title", "counted the lines"], "That is a connection.", "🌙"),
  hq("Two readers read the same story. One connects to a lost pet and one to a new school. Is that okay?", "Yes, each reader has different experiences", ["No, they must be the same", "No, one is wrong", "Yes, but only the teacher can choose"], "Different people connect to stories in different ways.", "📚"),
  hq("Which connection helps you understand a character the most?", "I felt brave like her when I rode a bike for the first time.", ["I like the cover.", "The book is blue.", "It has a lot of words."], "A feeling you share helps you understand the character.", "🚲"),
  hq("A text-to-text connection is when a story reminds you of…", "another book, poem or play you have read", ["a lunch you ate", "a game you played", "a place you visited"], "A text-to-text connection is between two texts.", "📖"),
  hq("You read about a character who helps a neighbour shovel snow. How might you connect it to your community?", "I help my neighbours too, by raking leaves.", ["I do not like winter.", "The story is short.", "The author is kind."], "Linking a story to your community shows what you understand.", "🏘️"),
  q("A story says “Lena felt nervous on the first day of school.” You felt that way too. This is a…", "connection to your feelings", ["new title", "end of the story", "mistake"], "You share a feeling with the character.", "🎒"),
  q("Which question helps you make a text-to-text connection?", "Does this remind me of another book?", ["Who painted the cover?", "How many pages are there?", "What is the price?"], "Thinking of other books helps you compare.", "📚"),
  q("A book about the Rocky Mountains reminds you of your family trip. This is a connection to…", "a place you have been", ["a different language", "a rule", "a number"], "Places can make strong connections.", "🏔️"),
  q("Why do connections help you remember a story?", "they link new ideas to things you already know", ["they make the book shorter", "they hide the ending", "they stop you reading"], "Linked ideas are easier to remember.", "🧠"),
  q("You read about a boy who learns to skate. You are learning to skate too. You can say…", "I know how it feels to wobble on the ice.", ["I do not like books.", "This is a cover.", "Skating is cold."], "Share how the story matches your own life.", "⛸️"),
  q("A poem about the wind makes you think of flying a kite. What did you just do?", "made a connection", ["lost your place", "changed the poem", "skipped a line"], "A memory linked to the poem is a connection.", "🪁"),
  q("A play has a character who shares with a friend. This reminds you of when you shared snacks. This is a…", "text-to-self connection", ["map", "title", "chapter"], "A connection to your own life is text-to-self.", "🍎"),
  q("What can you do if a story is about something you know nothing about?", "use pictures and words to learn, and ask questions", ["stop reading", "pretend you know", "skip the book"], "Reading and asking questions build new knowledge.", "🔍"),
  q("An information book says bison eat grass. You have seen bison eating. How does this help?", "it helps you understand the facts", ["it changes the facts", "it makes the book longer", "it hides the page"], "What you have seen helps you picture it.", "🦬"),
  q("Which is a good sentence starter for a connection?", "This reminds me of…", ["Turn the page…", "The end…", "Once upon a time…"], "Sentence starters help you share your thinking.", "💬"),
  hq("Two classmates make different connections to the same poem. What does this show?", "readers bring their own experiences to a text", ["one of them read wrong", "poems have no meaning", "the poem is broken"], "Each person's life gives them different ideas.", "🤔"),
  hq("Which connection gives the most help understanding why a character is excited?", "I felt just as excited when I got to visit my cousins.", ["I like the colour red.", "The book has many pages.", "I read it on Tuesday."], "A shared feeling helps you understand.", "🎉"),
];

// ---------- Ideas for writing ----------

const IDEAS: Item[] = [
  q("Where can a writer find ideas?", "from memories, nature, books, pictures and conversations", ["only from a dictionary", "only from the teacher's desk", "nowhere"], "Writers draw on many sources of inspiration.", "💡"),
  q("You walked in a coulee and heard a meadowlark. This could be an idea for…", "a poem or story", ["a math test", "a map key", "a spelling list"], "What you notice outdoors can inspire writing.", "🐦"),
  q("Which of these helps a writer plan before writing?", "making a web or a list of ideas", ["erasing everything", "closing the notebook", "skipping to the end"], "Planning helps your writing make sense.", "📝"),
  q("A picture of a prairie sunset could inspire…", "a descriptive paragraph", ["a recipe for cookies", "a bus schedule", "a phone number"], "Describing what you see is a writing strategy.", "🌅"),
  q("A good first sentence…", "makes the reader want to read more", ["has no punctuation", "is very long", "says nothing"], "A strong beginning hooks the reader.", "✨"),
  q("After you write a draft, you should…", "read it again and improve it", ["throw it away", "never look at it again", "only count the words"], "Revising makes writing clearer.", "🔍"),
  q("You read a book about a brave moose. Which can you do to write your own story?", "use the idea of bravery in a new story with new characters", ["copy every sentence", "write the same story word for word", "give up"], "Take inspiration from a book, then make something new.", "🫎"),
  q("What should you check at the end?", "capital letters, spelling and punctuation", ["the colour of the paper", "the length of your pencil", "how loud you can read"], "Editing makes your writing easy to read.", "✅"),
  q("Which describes using your senses to get writing ideas?", "writing what you see, hear, smell, taste and feel", ["only copying others", "guessing the weather", "counting letters"], "Details from your senses make writing vivid.", "👃"),
  q("A story needs a beginning, a middle and…", "an end", ["a recipe", "a map", "a number"], "Most stories have a clear beginning, middle and end.", "📖"),
  q("A writer wants to write about a grandparent's story. What should they do first?", "ask the grandparent and take notes", ["make up everything", "skip the story", "wait until the story is forgotten"], "Interviews can give strong ideas, and asking permission shows respect.", "👵"),
  q("A word web helps you…", "collect and group ideas before writing", ["draw a spider", "spell words", "count syllables"], "A web shows ideas linked to a main topic.", "🕸️"),
  hq("Which topic is more focused for a short piece of writing?", "my first hockey practice", ["everything about sports", "all of Alberta's history", "all animals in the world"], "A small topic lets you add clear details.", "🏒"),
  hq("Why do writers use strong, exact words?", "they paint a clearer picture for the reader", ["so the story is shorter", "so no one understands", "to fill the page"], "Exact words help readers imagine.", "🎨"),
  hq("You can turn a photograph of a snowy field into a poem by…", "describing what you see and feel", ["copying a poem you know", "writing the date only", "drawing a map"], "Use details and feelings from the image.", "📷"),
  hq("Which is the best way to keep a list of writing ideas?", "a notebook or idea jar you add to often", ["a single word", "your memory only", "a blank page"], "Many writers collect ideas for later.", "📓"),
  q("A writer keeps a notebook to write down…", "ideas, words and things they notice", ["only spelling tests", "only answers", "only phone numbers"], "A notebook is a good place to save ideas.", "📓"),
  q("Which question can help you find a writing idea?", "What is something I will never forget?", ["What is on the lunch menu?", "How many chairs are in the room?", "What time is it?"], "Memories can be rich ideas.", "💭"),
  q("Walking around the school yard, you notice a gust of leaves. This could inspire…", "a poem about autumn", ["a math question", "a phone number", "a tax form"], "Things you notice can become writing.", "🍂"),
  q("Looking at a family photo can give you ideas for…", "a story about a special day", ["a spelling bee", "a weather map", "a bus route"], "Photos help you remember details.", "📷"),
  q("Which of these is a good way to plan a story?", "decide who, where and what happens", ["write the last word first", "pick random letters", "close the book"], "Planning characters, setting and events helps you write.", "📝"),
  q("What is a draft?", "a first try at writing that you can improve", ["the final copy", "a window breeze", "a title"], "Drafts are for ideas, and you can fix them later.", "✏️"),
  q("When you revise, you…", "make your writing clearer and better", ["only fix the spelling", "throw the page away", "make the font bigger"], "Revising changes ideas, words and order.", "🔍"),
  q("Which sentence is more interesting?", "The enormous moose crashed through the icy creek.", ["The moose went.", "A thing happened.", "It was a day."], "Strong words make pictures in the reader's mind.", "🫎"),
  q("You talk with a friend about a game and get a great writing idea. This shows that ideas can come from…", "conversations", ["only books", "only the weather", "only dictionaries"], "People can inspire your writing.", "💬"),
  q("A good ending for a story…", "wraps up what happened", ["introduces many new characters", "has no words", "ends in the middle of a word"], "An ending lets the reader feel finished.", "🏁"),
  hq("You want to write about your pet but it is too big a topic. How can you make it smaller?", "pick one funny thing it did", ["write about every pet in the world", "write the dictionary", "skip the details"], "Narrowing a topic helps you add details.", "🐶"),
  hq("Why do writers often read their work aloud while revising?", "they can hear what sounds clear or confusing", ["to scare the cat", "to hide mistakes", "because writing is always loud"], "Reading aloud helps you hear mistakes and awkward places.", "📢"),
];

const ordered = order("Put these steps of writing in order.", "Plan first, then draft, revise, edit and share.", [
  ["Get an idea and plan", "💡"],
  ["Write a first draft", "✏️"],
  ["Revise to improve it", "🔍"],
  ["Edit spelling and punctuation", "✅"],
  ["Share your writing", "📚"],
]);

export const units: Unit[] = [
  {
    id: "oral-traditions-ab",
    title: "Oral Traditions",
    emoji: "🗣️",
    blurb: "Listen with respect to stories, songs and teachings.",
    parentNote: "Oral traditions are a way many First Nations, Métis and Inuit communities share knowledge. Questions focus on respectful listening and asking permission. No stories are retold here, and each Nation has its own teachings.",
    standards: ab("Explore how oral traditions show respect for traditional shared knowledge.", "respecting oral traditions and shared knowledge"),
    generate: bankUnit(ORAL),
  },
  {
    id: "speak-listen-ab",
    title: "Speaking & Listening",
    emoji: "🎤",
    blurb: "Eye contact, posture, gestures and movements.",
    parentNote: "How a speaker's eyes, posture, gestures and movements help communicate, and what good listening looks like. Some families show respect in other ways, such as looking down, and the questions note this.",
    standards: ab("Use eye contact, posture, gestures, and movements to enhance communication.", "using eye contact, posture and gestures to speak and listen well"),
    generate: bankUnit(SPEAK, { sorts: [SPEAK_SORT] }),
  },
  {
    id: "connect-texts-ab",
    title: "Connecting to What You Read",
    emoji: "💭",
    blurb: "Link books, poems and plays to your own life.",
    parentNote: "Relating personal experiences to stories, poems, plays and information books helps children understand what they read.",
    standards: ab("Relate personal experiences to interactions with people or information in books, poems, or plays.", "connecting personal experiences to books, poems and plays"),
    generate: bankUnit(CONNECT),
  },
  {
    id: "writing-ideas-ab",
    title: "Ideas for Writing",
    emoji: "💡",
    blurb: "Find ideas, plan and improve your writing.",
    parentNote: "Writers draw on memories, nature, pictures, books and conversations. Children practise planning, drafting, revising and editing.",
    standards: ab("Apply writing strategies to create texts that draw upon a variety of sources of inspiration.", "finding ideas and using writing strategies"),
    generate: bankUnit(IDEAS, { orders: [ordered] }),
  },
];
