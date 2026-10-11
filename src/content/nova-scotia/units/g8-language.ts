import { bankUnit, type Q } from "../own";

// Grade 8 English language arts, cultural expressions: influence between cultures, language and culture, point of
// view and audience, and respectful interpretation. Mi’kmaw and Acadian content is light and needs partner review.

const CULTURAL: Q[] = [
  ["When cultures meet, their communication forms often…", "borrow ideas from each other", ["stay completely unchanged", "disappear within a day"], "Music, stories and art can mix and grow when people share them."],
  ["Why is language revitalization important to many communities?", "A language carries stories, knowledge and identity", ["Language has no link to culture", "It stops people from learning other languages"], "When a language is strong, the culture it carries stays strong too."],
  ["Many Mi’kmaw communities run programs to teach Mi’kmaw to children. This is an example of…", "language revitalization", ["language loss", "a menu translation"], "Revitalization means bringing a language back into everyday use."],
  ["A road sign shows names in English and French, or English and Mi’kmaw. This shows that…", "more than one language is valued in the community", ["the road is closed", "the sign was made by mistake"], "Bilingual signs make languages visible."],
  ["Two articles describe the same event with different words and details. This is because of the writers'…", "points of view", ["shoe sizes", "favourite colours"], "Point of view is the position or view someone writes from."],
  ["A writer chooses simple words and short sentences for young readers. This choice is shaped by the…", "audience", ["weather", "title font"], "Writers think about who will read their work."],
  ["Before interpreting a cultural expression from a culture you do not belong to, you should…", "learn the context and listen to voices from that culture", ["assume it means what it would in your culture", "skip it because it is different"], "Meaning depends on context, and the people who made it can explain it best."],
  ["Two members of the same community disagree about how to share a tradition. This shows…", "cultures include many perspectives", ["one of them is not really part of the culture", "cultures never change"], "Communities are made of individuals, and they do not all think alike."],
  ["Scottish Gaelic fiddle tunes came to Cape Breton with settlers and are now played by people of many backgrounds. This shows…", "a tradition can travel and grow in a new place", ["a tradition can never change", "fiddles belong to one family only"], "Traditions are living things that change as people share them."],
  ["The Acadian flag has a gold star on a French tricolour. Symbols like this help a community show…", "its own identity", ["its weather", "its tax rules"], "Flags and symbols can express pride and belonging."],
  ["Hip-hop began in the United States and is now made in many countries and languages. This shows how cultures…", "influence one another", ["never meet", "avoid each other's art"], "Art travels, and each place adds its own voice."],
  ["What is a stereotype?", "An oversimplified idea about a group of people", ["A fact checked by experts", "A kind of poem"], "Stereotypes ignore the many differences among people in a group."],
  ["A Mi’kmaw poet writes in English for readers across Canada. What does this choice do?", "It shares the culture with a wider audience", ["It hides the culture", "It means only the poet's family can understand"], "Choosing a language is a choice about who will read.", true],
  ["A tourist posts a video of a Mi’kmaw craft without asking the artist. What would be more respectful?", "Ask the artist, credit them and let them share their own story", ["Say nothing about who made it", "Share only the parts you find interesting"], "Respect means asking permission and giving credit.", true],
  ["Which sentence best analyses point of view?", "The author uses words that make the fishers seem brave, so the text favours their side.", ["The text is about fishers.", "The author wrote ten sentences."], "Analysing point of view means linking word choices to the position the writer takes.", true],
  ["Why can translating a poem lose some meaning?", "Words carry cultural references that may not match exactly", ["Translators never read the poem", "Poems cannot be translated at all"], "Some ideas depend on a culture's history, humour or sounds.", true],
  ["A text speaks about a culture without including anyone from it. What question should a reader ask?", "Whose voice is missing, and how might that change the message?", ["How long is the text?", "Does it have a title?"], "Asking who is not included helps you notice bias.", true],
  ["Bilingual signs can help revitalize a language by…", "making the language visible and normal in daily life", ["replacing the other language", "making signs harder to read"], "Seeing a language every day shows that it matters.", true],
  ["A film about a community is made by people from outside it. How can a viewer judge it fairly?", "Compare it with first-voice sources from that community", ["Assume it is perfectly accurate", "Ignore the people in the film"], "Checking more than one source helps you see what might be missing.", true],
  ["A museum label for an artifact is written by the community that made it. Why does this matter?", "The community explains its own meaning", ["It makes the artifact older", "Museums may not use other labels"], "First-voice labels let people speak for themselves."],
  ["Borrowing from a culture respectfully means…", "learning about it, giving credit and asking permission when needed", ["copying it and claiming it", "ignoring where it came from"], "Respect means knowing the source and honouring it."],
  ["Acadian French is a variety of French that has…", "its own words and sounds shaped by Acadian history", ["no link to Acadia", "a written form but no speakers"], "Language changes in each community that uses it."],
  ["Which text shows its audience?", "A comic for young readers with bright pictures and short sentences", ["A page with a number", "A ship's log with a date"], "Writers choose words and images to fit the readers they have in mind."],
  ["Which sentence is an opinion?", "This is the best festival in the province.", ["The festival ran for three days.", "The festival was held in July."], "An opinion says what someone thinks. Facts can be checked."],
  ["Social media can spread a cultural expression quickly. One risk is that it…", "is shared without the creator's credit or context", ["makes the expression disappear", "can be read by only one person"], "Sharing without context can change what a work means.", true],
  ["What is a loanword?", "A word one language borrows from another", ["A word on a library card", "A word that cannot be spoken"], "English borrowed ballet from French, for example."],
  ["A play is performed in Mi’kmaw with English subtitles. What choice is the creator making?", "Keeping the language central while helping others follow", ["Hiding the language", "Making the play shorter"], "Subtitles let a wider audience take part.", true],
  ["Two reviewers read the same poem and find different meanings. What is a fair response?", "Support each reading with evidence from the poem", ["Say only one person can read poems", "Ignore the poem and vote"], "Strong readings point to words and images in the text.", true],
];

export const culturalExpressions8 = bankUnit({
  id: "ns-cultural-expressions-8",
  title: "Voices & Cultural Expressions",
  emoji: "🗣️",
  blurb: "Explore how language, point of view and audience shape what we share.",
  parentNote:
    "Practises how cultures influence each other, how language and culture are connected, how point of view and audience shape a text, and how to interpret cultural expressions respectfully, with Mi’kmaw, Acadian and Gaelic examples. Ties to the Nova Scotia Grade 8 English language arts outcome on cultural expressions.",
  standards: ["Cultural expressions", "Analyse how language, point of view and audience shape cultural expressions and interpret them respectfully"],
  items: CULTURAL,
});
