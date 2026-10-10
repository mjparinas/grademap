import type { Unit } from "../types";
import { bankUnit, hq, q, type Item } from "../ontario/g3-4-kit";
import { ab } from "./kit";

// Alberta Grade 4 English language arts: two units written for outcomes the BC course does not cover
// (listening and speaking, and sharing information ethically). The reading, grammar and writing units are shared.

const LISTENING: Item[] = [
  q("What does a good listener do while a classmate is speaking?", "looks at the speaker and waits for a turn", ["talks to a friend at the same time", "looks at the floor and hums", "finishes the speaker's sentences"], "Good listening shows respect and helps you understand.", "👂"),
  q("Your partner finishes talking. Which is a good way to show you listened?", "say it again in your own words", ["change the subject", "start a different story", "walk away"], "Retelling shows you understood.", "🗣️"),
  q("You do not understand what a classmate said. What can you do?", "politely ask a question", ["roll your eyes", "pretend you understood", "say it was boring"], "Questions help everyone understand.", "❓"),
  q("In a group talk, three students want to speak at once. What is the kindest way to solve this?", "take turns, one person at a time", ["the loudest person goes first", "everyone talks together", "nobody talks"], "Taking turns lets every voice be heard.", "🤝"),
  q("Which opening is a respectful way to disagree?", "“I see it a different way. Can I share my idea?”", ["“That is a silly idea.”", "“You are wrong.”", "“Nobody cares.”"], "You can disagree without hurting feelings.", "💬"),
  q("When you speak to the class, how should your voice sound?", "clear, and loud enough for everyone to hear", ["very quiet, to the floor", "as loud as a shout", "fast and mumbled"], "Speak clearly and at a steady pace.", "🎤"),
  q("When you give a talk, why is it a good idea to look up at your audience?", "it shows you are speaking to them", ["it makes the talk shorter", "it hides your notes", "it makes your voice quiet"], "Eye contact helps listeners stay connected.", "👀"),
  q("A friend tells you about a hard day. Which reply helps most?", "“That sounds hard. Do you want to talk about it?”", ["“Just get over it.”", "“Hmm, anyway…”", "“Mine was worse.”"], "Kind listening builds friendships.", "💛"),
  q("Where should a reader pause when reading “After lunch, we went to the park.” aloud?", "after “lunch”, at the comma", ["after “we”", "after “went”", "after “the”"], "A comma is a signal to take a small pause.", "📖"),
  q("What should your voice do at a full stop (period)?", "come down and stop", ["go up high", "get louder", "speed up"], "A period tells you the thought is finished.", "📖"),
  q("Which sentence should end with your voice going up?", "Are you coming to the game?", ["We are going to the game.", "The game was great.", "Come to the game."], "Many questions end with a rising voice.", "❓"),
  q("How should you read “Hooray! We won!” aloud?", "with excitement", ["in a sleepy voice", "very quietly and sadly", "in a whisper"], "An exclamation mark shows strong feeling.", "🎉"),
  q("Reading in a flat voice with no pauses does what?", "makes it harder to understand the meaning", ["makes the text easier to understand", "shows great expression", "makes the story shorter"], "Pauses and expression help the listener follow.", "📖"),
  q("To show it was Maya who won, not someone else, which word do you stress? “Maya won the race.”", "Maya", ["won", "the", "race"], "Stress the word that carries the important idea.", "🏆"),
  q("Reading in short, natural chunks of words instead of one word at a time is called…", "phrasing", ["spelling", "printing", "rhyming"], "Good phrasing sounds like talking.", "📖"),
  hq("A speaker says, “We meet at the library at three.” Which reply checks that you understood?", "“So we meet at the library at three o'clock?”", ["“What is your favourite book?”", "“I like the park better.”", "“Is it time for lunch?”"], "Repeating the key details checks understanding.", "👂"),
  hq("Which is the best way to build on a classmate's idea?", "“I agree with Sam, and I would add…”", ["“Sam is wrong, so listen to me.”", "“I will say something unrelated.”", "“I do not need to listen.”"], "Building on others' ideas keeps a discussion going.", "🔗"),
  hq("Which word do you stress to ask for the blue book, not the red one? “Please pass me the blue book.”", "blue", ["pass", "book", "please"], "Stress the word that carries the important idea.", "📘"),
  q("A classmate shares an idea you do not agree with. What is a respectful reply?", "“I understand your idea. Here is another way to see it.”", ["“That idea is dumb.”", "“Stop talking.”", "“I won't listen.”"], "You can disagree and still be kind.", "🤝"),
  q("You are the speaker in a group talk. How can you invite others in?", "ask, “What do you think?”", ["keep talking without a pause", "turn your back", "say, “Nobody else can talk.”"], "Inviting others makes a good discussion.", "💬"),
  q("A good listener keeps their eyes on the speaker and…", "thinks about what is being said", ["thinks about lunch only", "draws a picture of something else", "whispers to a friend"], "Active listening means thinking along with the speaker.", "🧠"),
  q("Which sentence stem helps you ask a question about what you heard?", "“Can you tell me more about…?”", ["“I don't care about…”", "“Be quiet about…”", "“Stop talking about…”"], "Questions show you are interested.", "🙋"),
  q("When you read “Wow!” in a story aloud, your voice should…", "show surprise or excitement", ["go flat and slow", "sound bored", "whisper"], "Expression shows the feeling in the words.", "🎉"),
  q("How should you read a comma in a list, such as “apples, pears, plums”?", "with a very small pause after each item", ["without any pause", "with a long stop", "by shouting each word"], "A comma tells readers to take a tiny pause.", "📖"),
  q("A listener says, “I heard you say the park is closed.” This is called…", "paraphrasing what you heard", ["interrupting", "ignoring", "forgetting"], "Saying it in your own words checks you understood.", "👂"),
  q("A teammate is nervous about speaking. How can you help?", "listen kindly and say something encouraging", ["laugh", "talk over them", "look away"], "Kind responses build confidence.", "💛"),
  q("Reading aloud, you see a question mark at the end of a sentence. Your voice should…", "go up a little", ["drop to a whisper", "go silent", "speed up"], "A question often ends on a rising tone.", "❓"),
  q("Which clue in a text tells a reader to stress a word?", "the word is in italics or bold", ["the word is long", "the word is first on the page", "the word has a vowel"], "Text features can show which words matter.", "🔤"),
  hq("Why does a speaker slow down when explaining something tricky?", "listeners get time to follow each step", ["to run out the clock", "to confuse the audience", "because they are tired"], "A steady pace helps people understand hard ideas.", "🐢"),
  hq("In a discussion, two students say almost the same thing. What is a good way to add to it?", "“I agree, and I also think…”", ["“Repeat that.”", "“That was already said.”", "“I'll say nothing.”"], "Building on others' ideas moves the discussion forward.", "🔗"),
];

const SHARING: Item[] = [
  q("You use facts from a library book in your report. What should you do?", "write the book's title and author", ["say you thought of the facts", "hide the book", "copy the book's pages"], "Giving credit to your source is honest and fair.", "📚"),
  q("What does it mean to put information in your own words?", "explain it in a new way, not copy it exactly", ["copy it word for word", "make up new facts", "leave out the topic"], "Copying someone's exact words as your own is not fair.", "✍️"),
  q("Which is a private detail you should NOT share online?", "your home address", ["your favourite colour", "your favourite food", "a joke you like"], "Keep personal details like your address and passwords private.", "🔒"),
  q("Who should you share a password with?", "only a trusted adult in your family", ["your classmates", "anyone who asks", "people you meet online"], "A password protects your information.", "🔑"),
  q("Before you post a photo of a friend, what should you do?", "ask for permission", ["post it quickly", "change their name", "hide it from them"], "Other people have a say in how their picture is shared.", "📷"),
  q("A website has no author, no date and lots of spelling mistakes. Is it a good source?", "probably not; look for a more trusted source", ["yes, any website is fine", "yes, if it has pictures", "yes, if it is long"], "Good sources name who wrote them and when.", "🔍"),
  q("Which place is a trusted source for facts about animals?", "a library book or a school-approved website", ["a rumour from a friend", "a post with no author", "an advertisement"], "Librarians and teachers can help you find trusted sources.", "🏫"),
  q("You find a great picture online for your poster. What should you check?", "whether you may use it and who made it", ["nothing, all pictures are free", "only the size", "only the colour"], "Artists and photographers own their work, so give credit.", "🖼️"),
  q("When you finish a document on the computer, what helps you find it later?", "save it with a clear name in the right folder", ["name it “asdf” and leave it", "never save it", "print it and delete it"], "A clear file name helps you find your work.", "💾"),
  q("Why do we keep a second copy (a backup) of important work?", "so it is not lost if something goes wrong", ["so it takes more space", "so no one can read it", "so it loads slower"], "A backup is a safety copy.", "🗂️"),
  q("If a message online makes you feel uncomfortable, what should you do?", "tell a trusted adult", ["reply right away", "share it with everyone", "ignore the feeling and keep chatting"], "Trusted adults can help you stay safe online.", "🤝"),
  q("Which note shows you shared information ethically?", "“Facts from Wild Animals of Canada, by A. Singh”", ["“I thought of all this myself.”", "“Some website.”", "“Copied from my friend.”"], "A good note names the title and who wrote it.", "📝"),
  q("Which of these is a kind thing to do when you share a post online?", "write something respectful", ["tease someone", "share a rumour", "use mean words"], "Online words are read by real people.", "💬"),
  q("You researched bison. Which is the best way to share your learning?", "make a poster or give a short talk in your own words", ["copy a page from a website", "have a friend write it", "say nothing"], "Sharing in your own words shows what you understand.", "🦬"),
  q("Where could a student keep school work safe if they work offline?", "in a folder or binder with a name on it", ["loose at the bottom of a bag", "in the recycling", "under the bed"], "Organizing work keeps it safe, in paper or digital form.", "📁"),
  hq("Why is copying a classmate's writing and putting your name on it unfair?", "it takes credit for someone else's work", ["it makes the page look neat", "it is faster, so it is fine", "it helps the other person"], "Your name on work means you made it.", "⚖️"),
  hq("A source says one thing and another trusted source says something different. What is a good next step?", "check more trusted sources", ["pick the one you like", "stop researching", "make up an answer"], "Comparing sources helps find what is accurate.", "🔎"),
  hq("Which is the strongest password?", "a mix of random words, numbers and symbols", ["your first name", "1234", "the word “password”"], "Strong passwords are hard to guess and kept private.", "🔐"),
  q("Where can you find a trusted answer about how bison live?", "a book from the school library", ["a random comment", "an ad for toys", "a chain message"], "Library books are checked by experts.", "📖"),
  q("Why should you tell who made the picture you use?", "to give the creator credit", ["to make the page longer", "so no one sees it", "to hide the picture"], "Credit is a way of saying thank you.", "🎨"),
  q("Which of these is OK to share online with a trusted adult's permission?", "a school project you made", ["your password", "your home address", "your locker combination"], "Ask an adult before sharing anything online.", "🧑‍🏫"),
  q("A note says “Information from ‘Animals of the Prairie’ by Z. Okafor.” This is…", "giving credit to a source", ["a title", "a math question", "a rule"], "It names the book and the author.", "📝"),
  q("What should you do before using a classmate's drawing in your poster?", "ask them for permission", ["use it and say nothing", "erase their name", "copy it exactly and sign it"], "Everyone owns their own work.", "🖍️"),
  q("A sentence from a book is copied exactly into your report. What should you do?", "put it in quotation marks and name the source", ["leave it as if you wrote it", "change one word", "hide the book"], "Quotation marks show someone else's words.", "💬"),
  q("A friend asks for your password “just to see.” You should…", "say no and tell a trusted adult if they keep asking", ["share it", "post it online", "write it on a poster"], "Passwords are private.", "🔐"),
  q("Why is it a good idea to log out of a shared computer?", "so others cannot see or change your work", ["so it gets faster", "to waste time", "so the screen turns blue"], "Logging out protects your information.", "💻"),
  q("An unfamiliar person online asks where you live. What should you do?", "not answer and tell a trusted adult", ["tell them quickly", "send a photo", "give your phone number"], "Keep personal details private.", "🚫"),
  q("Which is an example of a digital folder name that is easy to understand?", "“Bison Report”", ["“zzz”", "“stuff3”", "“new new new”"], "Clear names help you find your work.", "📁"),
  hq("You want to share a classmate's idea in your group. What is the fair thing to do?", "say it was their idea", ["act like it was yours", "hide it", "change their words and keep it"], "Credit goes to the person who thought of it.", "🌟"),
  hq("A website is full of ads and has no author. Which of these should you do?", "check a more trusted source before using the facts", ["use it anyway", "share it with the class right away", "copy it all"], "Trusted sources show who made them and why.", "🛑"),
];

export const units: Unit[] = [
  {
    id: "listening-speaking-ab",
    title: "Listen, Speak & Read Aloud",
    emoji: "🎤",
    blurb: "Listening well, speaking clearly and reading with expression",
    standards: ab(
      "Demonstrate listening and speaking that build relationships and understanding; Demonstrate appropriate emphasis on words, pausing, phrasing, and intonation that reflect comprehension of text.",
      "listening, speaking in a group, and reading aloud with pauses and expression",
    ),
    parentNote: "Good listening and speaking habits (taking turns, asking questions, speaking clearly) and reading aloud with pauses at punctuation, stress on key words and a voice that rises or falls with the meaning.",
    generate: bankUnit(LISTENING),
  },
  {
    id: "sharing-information-ab",
    title: "Sharing Information Fairly",
    emoji: "🔗",
    blurb: "Finding good sources, giving credit and staying safe online",
    standards: ab(
      "Access, share, and store information ethically in a variety of digital or non-digital forms.",
      "using trusted sources, giving credit, keeping personal information private and saving work",
    ),
    parentNote: "How to find trusted sources, put ideas in your own words, give credit, ask permission before sharing, keep personal information private and save work safely, on paper or on a device.",
    generate: bankUnit(SHARING),
  },
];
