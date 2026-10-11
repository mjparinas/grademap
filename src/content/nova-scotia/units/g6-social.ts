import { bankUnit, type Q } from "../own";

// Grade 6 social studies, Nova Scotia: cross-cultural understanding, traditions and beliefs around the world, and
// the rights of children. Indigenous content is light, in the present tense, and needs partner review. Religions
// and cultures are described respectfully and never ranked.

const CROSS: Q[] = [
  ["Which best describes culture?", "the shared ways, beliefs, language and traditions of a group", ["the weather in a place", "a person’s height"], "Culture includes things like language, food, music, celebrations and values."],
  ["A stereotype is…", "a fixed, simple idea about a whole group of people", ["a question asked with care", "a friendly handshake"], "Stereotypes ignore that every person is different."],
  ["Which is an example of respectful curiosity?", "asking kindly, “Would you tell me about your tradition?”", ["saying, “Your food looks weird.”", "guessing what everyone in a group thinks"], "Respectful curiosity means asking and listening instead of assuming."],
  ["Which of these is a stereotype?", "“All people from that country like the same things.”", ["“My neighbour loves hockey.”", "“Tell me about your favourite song.”"], "A stereotype treats everyone in a group as if they were alike."],
  ["Which people have lived in Mi’kma’ki, the land we now call Nova Scotia, for thousands of years?", "the Mi’kmaq", ["the Acadians", "the Gaels"], "The Mi’kmaq are the First People of this land, and their communities are here today."],
  ["Which group in Nova Scotia has French roots and celebrates Tintamarre?", "Acadians", ["Gaels", "Mi’kmaq"], "Tintamarre is a lively Acadian parade with noisemakers, flags and costumes."],
  ["Which group brought the Gaelic language to Nova Scotia?", "Scottish Gaels", ["Acadians", "Mi’kmaq"], "Gaelic is still taught and sung in Nova Scotia, especially in Cape Breton."],
  ["African Nova Scotian communities have lived in Nova Scotia for…", "more than 200 years", ["only a few years", "about 10 years"], "Black Loyalists arrived after the American Revolution, and many families have been here for generations."],
  ["Learning a few words of a neighbour’s language can help build…", "trust and friendship", ["a bigger map", "less talking"], "Showing interest in someone’s language shows respect."],
  ["Why do people share traditions, like food and music, with others?", "It helps people learn about and enjoy each other’s cultures", ["It makes everyone become the same", "It stops people from being friends"], "Sharing lets people celebrate what makes them different and what they have in common."],
  ["A new classmate speaks a different language at home. A kind way to help is to…", "be friendly and learn how to say their name", ["avoid talking to them", "laugh at how they speak"], "A welcoming smile and the correct name make a big difference."],
  ["Two friends misunderstand each other’s customs. A good first step to repair it is to…", "listen to each other and explain without blaming", ["stop talking forever", "tell others they were wrong"], "Calm listening helps people understand each other’s view."],
  ["Which sentence shows listening to different perspectives?", "“I see it differently. Can you explain how you see it?”", ["“You are wrong, so be quiet.”", "“I don’t care what you think.”"], "Hearing other points of view helps everyone learn."],
  ["Newcomers to Nova Scotia often bring…", "new foods, music and ideas", ["nothing at all", "only one way of doing things"], "New traditions can enrich a whole community.", true],
  ["Why can cross-cultural understanding make schools stronger?", "Students feel included and can learn from each other", ["Everyone must follow only one tradition", "Differences are hidden"], "A school where everyone belongs is a better place to learn.", true],
  ["Someone says, “I have never met anyone from that culture, so I know nothing.” What is a good next step?", "Be curious, read, and ask respectful questions", ["Make a joke about it", "Assume the worst"], "Learning with respect is better than guessing.", true],
  ["Which action best repairs a hurtful remark about someone’s culture?", "Apologize and listen to how it felt", ["Pretend it never happened", "Say it was only a joke"], "A sincere apology and listening help rebuild trust.", true],
  ["Why is it important to hear from members of a community rather than only about them?", "They know their own experiences best", ["They never want to talk", "Books always say everything"], "Voices from inside a community give the fullest picture.", true],
  ["Multiculturalism means…", "valuing and respecting many cultures", ["only one culture counts", "no cultures at all"], "Canada is home to people from many cultures."],
  ["Diversity means having…", "many different people, ideas and ways of life", ["everyone exactly alike", "only one language"], "A diverse community has a rich mix of people."],
  ["Saying a classmate’s name correctly shows…", "respect", ["boredom", "a mistake"], "Names are important and part of who we are."],
  ["Viola Desmond is remembered in Nova Scotia for standing up against…", "racial segregation", ["a hockey rule", "a fishing law"], "In 1946 she refused to leave a whites-only section of a theatre."],
  ["Which is a respectful way to greet someone from another culture?", "ask how they would like to be greeted", ["laugh at their greeting", "refuse to greet them"], "Asking shows you care."],
  ["Bias is…", "leaning for or against something without being fair", ["a fair look at all sides", "a compass direction"], "Noticing our bias helps us be fairer.", true],
  ["Why should we avoid saying “those people” about a group?", "it treats everyone in the group as if they are the same", ["it uses too many words", "it is a polite greeting"], "Every person is an individual.", true],
  ["Two classmates celebrate different holidays. How can the class learn from both?", "invite each to share if they want to", ["choose only one", "ban all holidays"], "Sharing is best when it is a choice.", true],
  ["Africville’s story shows why communities should be…", "listened to and treated fairly", ["ignored", "hidden away"], "Africville was a Black community in Halifax whose people were not treated fairly.", true],
];

const TRADITIONS: Q[] = [
  ["Lunar New Year is celebrated by many families with roots in…", "East and Southeast Asia", ["South America only", "Northern Europe only"], "Lunar New Year follows the moon’s calendar and is celebrated by many communities."],
  ["Diwali is a festival of…", "lights", ["snow", "harvest moons only"], "Diwali is celebrated by many Hindu, Sikh and Jain families and communities."],
  ["Eid al-Fitr is celebrated by Muslims at the end of…", "Ramadan", ["Diwali", "a school year"], "Eid marks the end of the month of fasting."],
  ["Hanukkah is a Jewish festival that is also known as…", "the Festival of Lights", ["the Harvest Festival", "the Day of the Dead"], "Families light candles on a menorah over eight nights."],
  ["Christmas is celebrated by many Christians to remember…", "the birth of Jesus", ["the new moon", "the harvest"], "Christmas is celebrated by many people in Canada, in different ways."],
  ["Nowruz marks the beginning of…", "spring and the new year in Persian tradition", ["winter only", "the school year"], "Nowruz is celebrated around the spring equinox in March."],
  ["Obon is a Japanese tradition in which families…", "remember their ancestors", ["race boats", "plant crops"], "Obon is often celebrated with dances and lanterns."],
  ["The Day of the Dead (Día de los Muertos) is a Mexican celebration to…", "remember and honour family who have died", ["welcome the new year", "celebrate the end of school"], "Families make colourful altars and share memories."],
  ["Which of these can shape the traditions of a region?", "geography, history and beliefs", ["only the price of food", "only the colour of buildings"], "Climate, land, past events and beliefs all influence customs."],
  ["Why might a coastal region have traditions about fishing?", "The sea gives people food and work", ["Fish cannot be eaten", "There is no water nearby"], "Where people live shapes what they eat and celebrate."],
  ["Highland games in Nova Scotia come from which tradition?", "Scottish", ["Acadian", "Persian"], "Highland games include piping, dancing and feats of strength."],
  ["A ceilidh in Cape Breton is a gathering with…", "music, dancing and storytelling", ["a silent meal", "a long exam"], "A ceilidh is a lively social evening with Gaelic and Celtic music."],
  ["Tintamarre is an Acadian celebration where people parade with…", "noisemakers, flags and costumes", ["silent candles", "large kites"], "Tintamarre is held on 15 August, Acadian National Day."],
  ["When people move to a new country, their traditions often…", "travel with them and mix with new ones", ["disappear forever", "stay unchanged for everyone"], "Traditions can blend as people share them in new places."],
  ["A family blends a holiday meal with dishes from two cultures. This shows how traditions can…", "mix and grow", ["end", "be ranked"], "Food is one of the easiest ways to share cultures.", true],
  ["Why do many religious festivals include special foods?", "Food helps families and communities come together", ["Food has no meaning", "Everyone must eat the same meal daily"], "Shared meals are part of many traditions.", true],
  ["Which statement shows respect about religion?", "“People celebrate in different ways, and each has its own meaning.”", ["“One festival is better than all the others.”", "“Those traditions are silly.”"], "Describing traditions fairly means not ranking them.", true],
  ["Clothing often reflects culture. A person might wear traditional clothing to…", "show pride in their heritage", ["hide who they are", "avoid festivals"], "Clothing can carry history and family stories.", true],
  ["Why do some traditions change over time?", "People move, learn new things and adapt", ["Nobody tells stories", "Traditions never change"], "Living traditions grow and change as communities do.", true],
  ["Passover is a Jewish festival that remembers…", "freedom from slavery in ancient Egypt", ["the harvest moon", "the end of winter"], "Families share a special meal called a Seder."],
  ["Thanksgiving in Canada is celebrated in…", "October", ["March", "July"], "It is held on the second Monday of October."],
  ["Holi is a festival of…", "colours", ["snow", "silence"], "Many Hindu families celebrate Holi in the spring."],
  ["A harvest festival celebrates…", "gathering crops", ["the first snow", "a new school year"], "Many cultures give thanks for the food that grows."],
  ["Canada Day is celebrated on…", "1 July", ["1 June", "25 December"], "It marks the date of Confederation in 1867."],
  ["Vesak is a day when many Buddhists remember…", "the Buddha", ["the harvest", "a new year"], "It is celebrated in many countries with flowers, lanterns and kind acts.", true],
  ["During Ramadan, many Muslims who are able to fast do so from…", "dawn to sunset", ["sunset to dawn", "only on Sundays"], "Families eat before sunrise and break the fast after sunset.", true],
  ["The Mid-Autumn Festival is celebrated with the full moon and…", "mooncakes", ["snowmen", "Easter eggs"], "Families gather to share mooncakes and lanterns.", true],
];

const RIGHTS: Q[] = [
  ["What is the United Nations Convention on the Rights of the Child?", "an agreement about the rights of all children", ["a school timetable", "a type of passport"], "It lists rights that every child should have."],
  ["In which year was the Convention on the Rights of the Child adopted by the United Nations?", "1989", ["1867", "2005"], "Nearly all countries in the world have agreed to it."],
  ["Canada agreed to follow the Convention in which year?", "1991", ["1989", "1867"], "Canada promised in 1991 to respect children’s rights."],
  ["Which of these is a right of every child?", "to go to school", ["to skip every class", "to choose a king"], "Education is one of the rights in the Convention."],
  ["Every child has the right to…", "be safe from harm", ["be left alone with no help", "avoid all rules"], "Children have the right to be protected."],
  ["Every child has the right to health care and…", "clean water and healthy food", ["a new phone every year", "unlimited toys"], "Health and basic needs are part of children’s rights."],
  ["Every child has the right to rest and…", "play", ["work all day", "stay silent"], "Play is important for growing and learning."],
  ["A child’s right to a name and nationality means…", "they belong to a family and a country", ["they must change names often", "they may not speak"], "Having a name and a country helps children be recognized."],
  ["Children have the right to be heard, which means…", "adults should listen to their ideas about things that affect them", ["children make all the rules", "children never ask questions"], "Children’s views matter when decisions are made."],
  ["Child labour is when children…", "are made to do hard work instead of going to school", ["help with small chores at home", "play sports"], "Child labour can harm a child’s health and learning."],
  ["Some children cannot go to school because of…", "poverty, conflict or distance", ["too many books", "too much sunshine"], "Many reasons can keep children out of school in different places."],
  ["Who is Malala Yousafzai?", "a young woman who spoke up for girls’ right to go to school", ["a hockey player", "a Canadian prime minister"], "She won the Nobel Peace Prize for her work."],
  ["A refugee child is a child who…", "has had to leave their home country to be safe", ["is on a school trip", "moves to a bigger house"], "Refugees flee danger, such as war."],
  ["Which of these is a way children can help others’ rights?", "speak up kindly and support causes they care about", ["ignore what is happening", "tease people who are different"], "Even young people can make a difference by helping.", true],
  ["Why do children need special rights?", "They are growing and may need extra care and protection", ["They are never right", "They do not need food"], "The Convention recognizes that children have special needs.", true],
  ["In Canada, the rights of Indigenous children include…", "learning their language and culture and being cared for in their community", ["being kept away from their families", "learning nothing about their heritage"], "Children’s rights include keeping their culture and language.", true],
  ["Which group helps children around the world through the United Nations?", "UNICEF", ["FIFA", "the Olympic Committee"], "UNICEF works on health, education and safety for children.", true],
  ["Adults can help protect children’s rights by…", "making laws, listening and providing care", ["ignoring problems", "giving children dangerous jobs"], "Adults and governments share responsibility for children’s rights.", true],
  ["Which statement about a right is true?", "A right is something every child should have, no matter who they are", ["Only some children have rights", "Rights are earned by being rich"], "The rights in the Convention belong to every child.", true],
  ["UNICEF is part of the…", "United Nations", ["Olympic Games", "Canadian government"], "UNICEF works for children’s rights around the world."],
  ["Which is a right of every child?", "to be treated fairly no matter who they are", ["to rule over adults", "to skip meals"], "Fair treatment belongs to everyone."],
  ["Each student shares an idea at a class meeting. This is a way to…", "respect the right to be heard", ["break the right to be heard", "ignore children’s ideas"], "Listening to children’s ideas respects their rights."],
  ["If a child feels unsafe, a good thing to do is to…", "tell a trusted adult", ["tell no one", "talk to a stranger online"], "Trusted adults can help keep children safe."],
  ["Children have the right to use their own language and enjoy their own…", "culture", ["debt", "passport"], "The Convention says children can enjoy their own culture and language."],
  ["Why do countries sign the Convention on the Rights of the Child?", "to promise to protect children’s rights", ["to win a prize", "to close schools"], "Signing is a promise to follow the rights it lists.", true],
  ["A child with a disability has the right to…", "take part fully in school and community", ["stay home alone", "be left out"], "Everyone should be included.", true],
  ["Some children live far from a school. A helpful action is to…", "support groups that help build schools and supply books", ["pretend it is not real", "tease them"], "Caring people can help children get an education.", true],
];

export const crossCultural = bankUnit({
  id: "ns-cross-cultural-6",
  title: "Understanding Each Other",
  emoji: "🌍",
  blurb: "How do listening and sharing help people understand each other?",
  parentNote:
    "Practises how cross-cultural understanding builds friendships, schools and communities, using examples from Nova Scotia such as the Mi’kmaq, Acadians, African Nova Scotians and Gaels. Content is respectful and factual.",
  standards: [
    "Analyse the impact of cross-cultural understanding",
    "what culture is, stereotypes and respectful curiosity, and how listening and sharing build understanding",
  ],
  items: CROSS,
});

export const traditionsBeliefs = bankUnit({
  id: "ns-traditions-beliefs-6",
  title: "Traditions & Beliefs Around the World",
  emoji: "🎎",
  blurb: "Festivals, food and customs from many places, and how they travel and mix.",
  parentNote:
    "Practises how geography, history and beliefs shape the traditions of a region, with respectful, factual questions about festivals and customs from around the world and in Nova Scotia. No tradition or religion is ranked above another.",
  standards: [
    "Analyse how traditions and beliefs relate to culture in a region",
    "how geography, history and beliefs shape festivals, food and customs, and how traditions travel",
  ],
  items: TRADITIONS,
});

export const childRights = bankUnit({
  id: "ns-child-rights-6",
  title: "Rights of Children",
  emoji: "🕊️",
  blurb: "What every child should have, and how people speak up for it.",
  parentNote:
    "Practises the United Nations Convention on the Rights of the Child and selected child rights issues around the world, including those of Indigenous children in Canada. Questions are gentle and focus on what people can do to help.",
  standards: [
    "Investigate selected examples of child rights issues around the world",
    "children’s rights, issues such as child labour and access to school, and people who speak up",
  ],
  items: RIGHTS,
});
