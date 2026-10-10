import type { FrameworkGuides } from "../guides";

// Parent guides for Alberta. Sources: Alberta Education (alberta.ca/curriculum) for the new Kindergarten to
// Grade 6 curriculum and the Grades 7 to 9 programs of study, alberta.ca/provincial-achievement-tests for the
// provincial tests, and the French as a Second Language nine-year program of studies. Alberta has no
// provincial report card scale, so the report card wording is kept general. Alberta wording needs a teacher
// review, and the assessment details change often, so each page says to check alberta.ca.

export const ALBERTA_GUIDES: FrameworkGuides = {
  french: {
    metaTail: "Alberta's French as a Second Language program starts in Grade 4; French Immersion usually starts in Kindergarten or Grade 1.",
    browse: ["4", "1"],
    title: "Core French and French Immersion in Alberta: a guide for parents",
    intro:
      "Many Alberta families wonder how French as a Second Language and French Immersion differ, when each starts, and how to help at home if you don't speak French. Gradelings practises both as optional subjects you can switch on for each child. Programs and entry points are set by each school authority, so check with yours.",
    compare: [
      { title: "What it is", core: "French as one school subject, taught every week alongside classes in English. In Alberta this is the French as a Second Language (FSL) program.", immersion: "A program where a large share of the school day, including other subjects, is taught in French." },
      { title: "When it starts", core: "The Alberta FSL program of studies begins in Grade 4 and runs through high school where a school offers it.", immersion: "Early French Immersion usually begins in Kindergarten or Grade 1. Some school authorities also offer a later entry point. Check with your school authority." },
      { title: "Who it suits", core: "Every child can learn some French. No earlier French is needed.", immersion: "Families who want their child to become fluent. Spaces and entry points differ, so ask your school authority." },
      { title: "Name in the curriculum", core: "French as a Second Language (Grades 4 to 12)", immersion: "French Immersion language arts and literature (new curriculum for Kindergarten to Grade 6)" },
      { title: "In Gradelings", core: "Grades 4 to 9. Prompts are in English, with French words and sentences to read, choose and build.", immersion: "Kindergarten to Grade 9. Prompts and stories are in French, with English hints for parents." },
    ],
    sections: [
      { title: "What Core French children learn", body: "The FSL program builds everyday communication: greetings, numbers, family, school, food, weather, hobbies and describing people and places. Its four general outcomes are Applications (using French), Language competence (the sounds, words and sentences), Global citizenship (learning about French-speaking communities) and Strategies (ways to learn a language). The aim is confidence with simple, real conversations." },
      { title: "What French Immersion children learn", body: "In immersion, children learn to listen, speak, read and write in French, and learn other subjects in French too. Younger children start with songs, stories and routines, then move on to sentences, paragraphs and longer texts. English language arts is taught as well, and how much of the day is in French depends on the school authority." },
      { title: "How report cards describe French", body: "Each school authority decides how French appears on the report card. Teachers usually look at listening, speaking, reading and writing together. Gradelings shows practice, not a report card mark, so ask your child's teacher what the words on the report card mean for your child." },
      { title: "French in junior and senior high", body: "Students can continue French as a Second Language or French Immersion courses through high school, and there are credits and, in some schools, exams. Ask your school's counsellor about the pathway that suits your child." },
      { title: "Helping if you don't speak French", body: "You don't need French to help. Ask your child to teach you a word each day, listen while they read aloud, and celebrate effort over accuracy. Mistakes are a normal part of learning a language." },
      { title: "How Gradelings fits in", body: "French is off by default. A parent can switch on Immersion, Core French or both for each child in Settings, under Subjects. French is not counted toward the Grade Champion trophy, and French lessons are read aloud with a French voice from your device. You can pick that voice in Settings." },
    ],
    atHome: [
      "Pick one new French word each day and use it at dinner or on the way to school.",
      "Label a few household objects with sticky notes in French.",
      "Listen to French songs or watch a short French video together and talk about what you noticed.",
      "Ask your child to read a page aloud in French, then retell it to you in English.",
      "Play a French game: count stairs, name colours, or spell a word out loud.",
    ],
    faqs: [
      { q: "When does Core French start in Alberta?", a: "The Alberta French as a Second Language program of studies begins in Grade 4. Your school or school authority can tell you whether it is offered and how much time it gets each week." },
      { q: "Can my child start French Immersion later?", a: "Some school authorities offer a later entry point, and some have limited spaces. Entry rules differ, so ask yours." },
      { q: "Will French Immersion hurt my child's English?", a: "English language arts is still taught in immersion, and research has generally found that immersion students do well in English. If you are worried, talk with your child's teacher." },
      { q: "Do French marks count toward the Grade Champion trophy in Gradelings?", a: "No. French is a separate, optional set of subjects. Children earn their own French trophies instead." },
      { q: "Does Gradelings replace French class?", a: "No. It gives short, kind practice that matches the topics in the Alberta programs of study. It doesn't replace a teacher, and its levels are not a report card mark." },
    ],
  },
  competencies: {
    slug: "competencies",
    label: "Competencies",
    hubBlurb: "The competencies Alberta students build alongside subject learning, in plain words.",
    description:
      "What the competencies in Alberta's Ministerial Order on Student Learning look like at school (critical thinking, problem solving, managing information, creativity, communication, collaboration, citizenship and personal growth) and simple ways to build them at home.",
    gradeLine: "Competencies grow alongside subject learning in every grade.",
    closing: "Competencies grow through projects, conversation, teamwork and play.",
    title: "Alberta competencies, explained for parents",
    intro:
      "Alongside the subject outcomes, Alberta's Ministerial Order on Student Learning describes competencies that students build in every grade. They are not marked as a subject, and schools report on them in different ways. Teachers weave them into projects and everyday classroom routines. The list below is a plain-language summary; check alberta.ca for the current wording.",
    items: [
      {
        id: "thinking",
        name: "Critical thinking and problem solving",
        blurb: "Asking good questions, weighing evidence and trying different ways to solve a problem.",
        parts: [],
        atHome: [
          "Ask “How do you know?” and “What else could we try?” about everyday puzzles.",
          "Let your child fix a small problem before you step in, such as a wobbly shelf or a jammed zipper.",
          "Compare two ways to do the same thing and talk about which is better.",
        ],
      },
      {
        id: "information",
        name: "Managing information",
        blurb: "Finding, sorting, checking and using information from different sources.",
        parts: [],
        atHome: [
          "Look something up together in two places and compare the answers.",
          "Ask who wrote a page and why. Talk about how to tell facts from opinions.",
          "Make a simple chart or list together before a trip or a purchase.",
        ],
      },
      {
        id: "creativity",
        name: "Creativity and innovation",
        blurb: "Imagining new ideas, making things and improving them.",
        parts: [],
        atHome: [
          "Give your child a box of recycled materials and a challenge, such as a bridge for a toy.",
          "Ask for three different ideas before choosing one.",
          "Celebrate drafts and changes: “What would you change next time?”",
        ],
      },
      {
        id: "communication",
        name: "Communication and collaboration",
        blurb: "Sharing ideas clearly, listening well and working with others.",
        parts: [],
        atHome: [
          "Cook, build or play a board game together and talk about how you shared the jobs.",
          "Ask your child to explain a game or a topic to someone who has never seen it.",
          "Invite a friend over for a shared project, such as a fort, a poster or a recipe.",
        ],
      },
      {
        id: "citizenship",
        name: "Cultural and global citizenship",
        blurb: "Respecting different people and cultures, including First Nations, Métis and Inuit peoples and Alberta's francophone communities, and caring for our shared world.",
        parts: [],
        atHome: [
          "Read or watch stories from different communities and talk about what is the same and different.",
          "Learn the story of the land you live on, including the Treaty area (6, 7 or 8) and the Métis settlements and Nations of your region.",
          "Take part in a small community act together, such as a food drive or a clean-up.",
        ],
      },
      {
        id: "well-being",
        name: "Personal growth and well-being",
        blurb: "Setting goals, noticing how you are doing, asking for help and not giving up.",
        parts: [],
        atHome: [
          "Help your child set one small goal for the week and check in on it together.",
          "Name the feeling and the plan: “You are frustrated. What could help?”",
          "Talk about what to do when stuck, such as taking a break, trying a different way or asking for help.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are competencies part of my child's marks?",
        a: "Not as a subject. Teachers build them into projects and lessons, and each school authority decides how, and whether, to report on them. The marks show how well your child is meeting the learning outcomes for each subject.",
      },
      {
        q: "Where do the competencies come from?",
        a: "Alberta's Ministerial Order on Student Learning describes what students are expected to know, do and be by the end of their schooling, including competencies. The list on this page is a plain-language summary, so check alberta.ca for the current wording.",
      },
      {
        q: "Does the new curriculum still teach these?",
        a: "Yes, though the new Kindergarten to Grade 6 curriculum puts more weight on specific knowledge, skills and procedures in each subject. Teachers still use projects and discussion to build thinking, communication and citizenship.",
      },
      {
        q: "Does Gradelings measure competencies?",
        a: "No. Gradelings practises subject skills and shows how they stack up on four practice steps. Competencies grow through routines, conversation and teamwork, so we suggest home activities rather than scores.",
      },
      {
        q: "How can I help if the teacher says my child needs to work on one?",
        a: "Ask the teacher for one specific example and one thing to try at home, then pick a single skill to work on. A small, steady habit works better than trying to fix everything at once.",
      },
    ],
  },
  assessment: {
    slug: "pat",
    short: "PAT",
    source: "Alberta Education",
    hubBlurb: "The Grade 6 and Grade 9 Provincial Achievement Tests, and early literacy and numeracy screening.",
    name: "Provincial Achievement Tests (PATs) and screening",
    intro:
      "Alberta Education runs Provincial Achievement Tests (PATs) in Grades 6 and 9, and literacy and numeracy screening in the early grades. They are separate from the report card and from class marks. The subjects, schedule and format change from year to year (including a move to digital delivery), so check alberta.ca or ask your school for the current plan.",
    grades: ["6", "9"],
    facts: [
      { title: "Who writes them", body: "Students in Grade 6 and Grade 9. Students may have a chance to be excused in some situations, so ask your school if you have questions." },
      { title: "What they cover", body: "Core subjects such as English language arts and literature, mathematics, science and social studies, and French language arts for students in French Immersion. Which tests run in which year depends on the curriculum changes, so check the current list." },
      { title: "Early screening", body: "Alberta has literacy and numeracy screening for students in the early elementary grades. It is a quick check that helps schools offer support early, and the grades and timing have been expanding." },
      { title: "How results are described", body: "PAT results are described as meeting the acceptable standard or the standard of excellence. Your school can share your child's individual results." },
      { title: "Report card link", body: "PAT results are a snapshot on one day. They do not change a student's report card, which describes learning over the year." },
    ],
    prepare: [
      "Keep routines simple: regular sleep, a good breakfast and a calm morning.",
      "Read together often, then ask your child to retell what happened and explain why.",
      "Encourage short, regular writing: a journal line, a note or a postcard.",
      "Practise math with real problems, such as shopping, cooking and travel times, as well as number facts.",
      "Tell your child it is a check of what they know, not a test they can fail.",
    ],
    faqs: [
      {
        q: "What does PAT stand for?",
        a: "Provincial Achievement Test. These are the province-wide tests Alberta runs in Grade 6 and Grade 9.",
      },
      {
        q: "Is the PAT part of my child's report card?",
        a: "No. It is separate from the report card. Your child's report card describes classroom learning through the year.",
      },
      {
        q: "Should my child study for the PAT?",
        a: "Cramming is not needed. The tests check skills built over years. Short, regular practice in reading, writing and math is more helpful than a last-minute push, and so is a calm, positive attitude.",
      },
      {
        q: "What is the literacy and numeracy screening?",
        a: "It is a short check in the early grades that shows which children may need extra help with reading, writing or number sense. Your school will tell you the dates and share the results.",
      },
      {
        q: "Can Gradelings help my child get ready?",
        a: "Gradelings practises the math and language skills taught in each grade with kind feedback and no timers unless you want them. It isn't a copy of the PATs and doesn't predict a result.",
      },
    ],
  },
  gradeNotes: {
    k: {
      overview:
        "Kindergarten in Alberta is a play-based year of listening, speaking, early letters and counting. The new curriculum focuses on quantity to 10, shapes, simple patterns, the five senses, and culture, tradition and community.",
      lookFor:
        "Expect comments about friendships, listening, early letters and sounds, counting to 10 and how your child shares ideas.",
    },
    "1": {
      overview:
        "Grade 1 is where reading, writing and number sense start to grow quickly. Children connect letters to sounds, retell stories, write complete sentences, and work with numbers to 100 and addition and subtraction within 20 in the new curriculum. Alberta also screens literacy and numeracy in the early grades.",
      lookFor:
        "Look for comments on reading simple texts, spelling common words, counting and adding, and taking part in class.",
    },
    "2": {
      overview:
        "In Grade 2, reading becomes smoother and writing gets longer. Math moves to numbers to 1000 and adding and subtracting within 100, and science looks at materials, light and sound. Social studies explores Canada's communities and heritage.",
      lookFor:
        "Look for fluent reading, longer writing, adding and subtracting with larger numbers, and the ability to explain thinking.",
    },
    "3": {
      overview:
        "Grade 3 is a bridge year. Students read to learn as well as learning to read, start multiplication and division facts, work with numbers to 100 000, and study Alberta and the prairies in social studies.",
      lookFor:
        "Look for comments about reading comprehension, paragraph writing, understanding multiplication and division, and what your child knows about Alberta.",
    },
    "4": {
      overview:
        "Grade 4 raises the pace on reading, writing and number work: decimals to hundredths, percent, prime and composite numbers, and adding and subtracting within 10 000. Social studies turns to colonial Canada and Confederation.",
      lookFor:
        "Look for comments on reading for meaning, organized paragraphs, decimals and fractions, and showing steps in math.",
    },
    "5": {
      overview:
        "In Grade 5, students deepen their number sense with numbers to 10 000 000, decimals to thousandths and divisibility, and take on longer reading and writing tasks. Social studies explores ancient civilizations.",
      lookFor:
        "Look for comments on problem solving, supporting ideas with evidence, and independent work.",
    },
    "6": {
      overview:
        "Grade 6 pushes towards more abstract thinking: integers, prime factorization, exponents and standard algorithms, with longer writing and more independent study. Social studies explores democracy. Grade 6 is also a year of Provincial Achievement Tests.",
      lookFor:
        "Look for comments about organization, explaining reasoning in math and writing with evidence. The Provincial Achievement Tests are separate from the report card.",
    },
    "7": {
      overview:
        "Grade 7 is the first year of junior high in many Alberta school authorities. Students work with decimals, percents, fractions, integers, linear relations and circles, study ecosystems, heat and structures in science, and learn about Confederation and Canadian expansion in social studies.",
      lookFor:
        "Look for comments on independence, study habits and confidence with harder math and reading. Report cards may use letters or percentages, depending on the school.",
    },
    "8": {
      overview:
        "Grade 8 builds on Grade 7 with squares and roots, ratios and rates, percent, the Pythagorean theorem, surface area and volume. Science covers matter, cells, light, machines and water systems, and social studies looks at Japan, Renaissance Europe and the Spanish and the Aztecs.",
      lookFor:
        "Look for comments on managing a heavier workload, showing steps in math and supporting an argument with evidence.",
    },
    "9": {
      overview:
        "Grade 9 is the last year of junior high and builds towards senior high. Students work with rational numbers, exponents, polynomials and linear relations, explore biological diversity, chemical change, electricity and space, and study governance, rights and economic systems. Grade 9 is also a year of Provincial Achievement Tests.",
      lookFor:
        "Look for comments on planning ahead for senior high course choices, explaining reasoning in math and weighing perspectives in social studies and English. The Provincial Achievement Tests are separate from the report card.",
    },
  },
};
