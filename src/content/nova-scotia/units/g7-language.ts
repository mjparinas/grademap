import { bankUnit, type Q } from "../own";

// Grade 7 English language arts, cultural expressions: communication forms, first-voice texts, perspectives and
// the choices creators make. Mi’kmaw, Acadian, African Nova Scotian and Gaelic examples are factual and light;
// Indigenous content is in the present tense and needs partner review.

const CULTURAL: Q[] = [
  ["A cultural expression is a way a community shares its…", "ideas, stories and identity", ["bank records", "weather reports"], "Songs, stories, art and plays all show what a community values."],
  ["Which is an oral form of communication?", "A story told aloud", ["A printed map", "A painted wall"], "Oral means spoken. Many cultures share knowledge by telling it aloud."],
  ["A first-voice text is created by…", "someone from inside the culture it is about", ["a tourist who visited once", "a reviewer who read about it"], "First voice means the people who live the experience tell it themselves."],
  ["Which is a first-voice text about Mi’kmaw life?", "A poem by Mi’kmaw poet Rita Joe", ["A travel diary written by a visitor", "An encyclopedia entry by a stranger"], "Rita Joe is a Mi’kmaw poet, so her poems come from inside the culture."],
  ["Rita Joe, a Mi’kmaw poet who lived in Eskasoni, used her poems to share…", "Mi’kmaw voices and ways of seeing the world", ["recipes for travellers", "sports scores"], "Her poetry gave readers a way to listen to Mi’kmaw perspectives."],
  ["Mi’kmaw Elders share stories aloud with younger people. This is an example of…", "oral tradition", ["written news", "video games"], "Oral tradition passes knowledge from person to person by speaking and listening."],
  ["Acadian writer Antonine Maillet wrote La Sagouine using…", "Acadian French", ["Scottish Gaelic", "Old English"], "Her writing uses the way many Acadians speak, which keeps their voice alive."],
  ["African Nova Scotian poet George Elliott Clarke writes about African Nova Scotian history and community, which he calls…", "Africadia", ["Scotiana", "Nova Africa"], "He created the word Africadia to name a home of African Canadian life in the Maritimes."],
  ["Gaelic songs and fiddle music in Cape Breton are often shared at gatherings called…", "ceilidhs", ["hockey games", "science fairs"], "A ceilidh is a social gathering with music, dance and stories."],
  ["Alistair MacLeod's stories, set in Cape Breton, often show…", "family, work and Scottish Gaelic heritage", ["space travel and robots", "big-city office life"], "He wrote about communities he knew, with respect for their language and history."],
  ["Which communication form uses images and movement together to tell a story?", "film", ["a printed list", "a phone number"], "Film combines pictures, sound and action."],
  ["People inside one culture can have…", "different views on the same topic", ["exactly the same view on everything", "no views at all"], "A culture is made of many people, and each has their own ideas."],
  ["A play can show culture through…", "costumes, language, setting and music", ["page numbers only", "the weather forecast"], "Creators choose many details to show who the characters are and where they come from."],
  ["A song is written in Gaelic and performed at a ceilidh. Who is the likely audience?", "A community that shares or values that language and music", ["Only people who live far away", "No one in particular"], "Creators think about who will listen, and what they will understand."],
  ["A writer uses Mi’kmaw words in an English poem. What does this choice tell us?", "Language is an important part of the writer's identity", ["The writer cannot speak English", "The poem is not about culture"], "Mixing languages can show pride, connection and respect for a heritage.", true],
  ["A video uses a fiddle tune as the background music. What might the producer want?", "To link the story to a musical tradition", ["To make the video silent", "To hide the setting"], "Music is a choice that sets a place and mood.", true],
  ["Many cultures tell stories aloud, sing songs and make art. This shows that…", "forms can be similar across cultures while the content differs", ["only one culture tells stories", "all stories must be identical"], "A form, like a song, can be shared, while each culture fills it with its own meaning.", true],
  ["Why is a first-voice text often a stronger source on a culture than an outsider's text?", "It comes from people who live the experience", ["It is always longer", "It has more pictures"], "Insiders know details and meanings outsiders can miss.", true],
  ["A social media post can be a cultural expression because it can…", "share language, ideas and identity with others", ["only show the weather", "only sell products"], "Posts, videos and images can carry the same kinds of messages as older forms.", true],
  ["A poem uses short, strong lines and repeated words. This is a choice about…", "how the writer wants the poem to sound and feel", ["how many pages the book has", "what city the writer lives in"], "Writers choose form and style to create a certain feeling.", true],
  ["Which is a visual form of communication?", "A painting", ["A radio interview", "A spoken riddle"], "Visual forms use images that you look at."],
  ["Which is a written form of communication?", "A novel", ["A dance", "A painting"], "Written forms use words on a page or screen."],
  ["Why might a creator choose a podcast instead of a printed book?", "Listeners can hear voices and tone", ["Podcasts have page numbers", "Podcasts cannot tell stories"], "Sound lets an audience hear how something is said.", true],
  ["The Acadian flag has a gold star. The star sits on the…", "blue stripe", ["red stripe", "white stripe"], "The Acadian flag is a blue, white and red tricolour with a gold star on the blue stripe."],
  ["Which instrument is closely linked to Cape Breton ceilidh music?", "fiddle", ["tuba", "xylophone"], "Fiddle tunes brought from Scotland are still played at Cape Breton gatherings."],
  ["What is a perspective?", "A person's way of seeing a topic, shaped by their experiences", ["A page number in a book", "The title of a poem"], "Two people can look at the same thing and notice different parts of it."],
  ["Mi’kmaw artists today continue traditions such as…", "porcupine quillwork and basket making", ["stock market trading", "hockey card collecting"], "These art forms are carried on by Mi’kmaw artists in the present."],
  ["A poet wants readers to feel proud of a language. Which choice helps most?", "Using that language in the poem", ["Using only numbers", "Leaving the title blank"], "Using a language on the page shows that it matters.", true],
  ["Two reviewers read the same poem and take away different meanings. What is the best response?", "Support each reading with evidence from the poem", ["Decide only one person can read poems", "Ignore the poem and vote"], "Good readers point to words and images that back up their ideas.", true],
];

export const culturalExpressions7 = bankUnit({
  id: "ns-cultural-expressions-7",
  title: "Cultures & Communication Forms",
  emoji: "🎭",
  blurb: "See how stories, songs and art show who we are.",
  parentNote:
    "Practises how oral stories, songs, poems, plays, film and social media express culture, what first-voice texts are, and how creators' choices shape meaning, with Mi’kmaw, Acadian, African Nova Scotian and Gaelic examples. Ties to the Nova Scotia Grade 7 English language arts outcome on cultural expressions.",
  standards: ["Cultural expressions", "Explore how communication forms express culture, identity and different voices"],
  items: CULTURAL,
});
