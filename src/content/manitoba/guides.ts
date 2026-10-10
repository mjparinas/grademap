import { APP_NAME } from "@/lib/brand";
import type { FrameworkGuides } from "../guides";

// Parent guides for Manitoba. Sources: Manitoba Education and Early Childhood Learning (edu.gov.mb.ca), including
// the Manitoba curriculum frameworks, the Provincial Report Card Policy and the provincial assessment program.
// Dates and grades of provincial assessments change, so the copy points parents to the Department's website.
// The wording needs a Manitoba teacher's review.

export const MANITOBA_GUIDES: FrameworkGuides = {
  french: {
    metaTail: "Core French starts in Grade 4; French Immersion usually starts in Kindergarten or Grade 1.",
    browse: ["4", "1"],
    title: "Core French and French Immersion in Manitoba: a guide for parents",
    intro: `Manitoba families often wonder how Core French and French Immersion differ, when each starts, and how to help at home without speaking French. Both follow Manitoba's French curricula, and ${APP_NAME} practises both as optional subjects you can switch on for each child.`,
    compare: [
      { title: "What it is", core: "French as one school subject, taught every week alongside classes in English.", immersion: "A program where most of the school day, including other subjects, is taught in French." },
      { title: "When it starts", core: "Core French is taught from Grade 4 in English-language schools.", immersion: "Early French Immersion usually begins in Kindergarten or Grade 1. Some divisions also offer later entry. Entry points differ by school division." },
      { title: "Who it suits", core: "Every child can learn some French. No earlier French is needed.", immersion: "Families who want their child to become fluent. Programs differ by division, so check with yours." },
      { title: "Name in the curriculum", core: "Core French (Français de base)", immersion: "French Immersion (Français – immersion)" },
      { title: `In ${APP_NAME}`, core: "Grades 4 to 9. Prompts are in English, with French words and sentences to read, choose and build.", immersion: "Kindergarten to Grade 9. Prompts and stories are in French, with English hints for parents." },
    ],
    sections: [
      { title: "What Core French children learn", body: "Core French builds everyday communication: greetings, numbers, family, school, food, weather and hobbies. In the upper grades children write short texts, use common verbs and ask and answer questions. The aim is confidence with simple, real conversations." },
      { title: "What French Immersion children learn", body: "In immersion, children learn to listen, speak, read and write in French, and learn other subjects in French too. Younger children start with songs, stories and routines, then move on to sentences, paragraphs and longer texts. English language arts is added in later grades. How much is in French in each grade depends on the school division." },
      { title: "How report cards describe French", body: `French is reported with the same four levels as other subjects. French Immersion report cards also show engagement in using French. ${APP_NAME} shows practice, not a report card mark, so ask your child's teacher what the level means for your child.` },
      { title: "Helping if you don't speak French", body: "You don't need French to help. Ask your child to teach you a word each day, listen while they read aloud, and celebrate effort over accuracy. Mistakes are a normal part of learning a language." },
      { title: `How ${APP_NAME} fits in`, body: "French is off by default. A parent can switch on Immersion, Core French or both for each child in Settings, under Subjects. French is not counted toward the Grade Champion trophy, and French lessons are read aloud with a French voice from your device. You can pick that voice in Settings." },
    ],
    atHome: [
      "Pick one new French word each day and use it at dinner or on the way to school.",
      "Label a few household objects with sticky notes in French.",
      "Listen to French songs or watch a short French video together and talk about what you noticed.",
      "Ask your child to read a page aloud in French, then retell it to you in English.",
      "Play a French game: count stairs, name colours, or spell a word out loud.",
    ],
    faqs: [
      { q: "When does Core French start in Manitoba?", a: "Core French is taught from Grade 4 in English-language schools. Your school or division can tell you how much time it gets each week." },
      { q: "Can my child start French Immersion later?", a: "Some divisions offer later entry, and some have limited spaces. Entry rules differ, so ask your school division." },
      { q: "Will French Immersion hurt my child's English?", a: "English language arts is still taught in immersion, and research has generally found that immersion students do well in English. If you are worried, talk with your child's teacher." },
      { q: `Do French marks count toward the Grade Champion trophy in ${APP_NAME}?`, a: "No. French is a separate, optional set of subjects. Children earn their own French trophies instead." },
      { q: `Does ${APP_NAME} replace French class?`, a: "No. It gives short, kind practice that matches the topics in the Manitoba curriculum. It doesn't replace a teacher, and its levels are not a report card mark." },
    ],
  },
  competencies: {
    slug: "learning-skills",
    label: "Learning skills",
    hubBlurb: "The learning skills on the Manitoba report card, in plain words.",
    description:
      "What the learning skills on a Manitoba report card mean (personal management, active participation in learning and social responsibility), and simple ways to build them at home.",
    gradeLine: "Learning skills are reported separately from the subject levels in every grade.",
    closing: "These skills grow through everyday routines, projects, play and helping others.",
    title: "Manitoba learning skills on the report card, explained for parents",
    intro:
      "Alongside the subject levels, the Manitoba provincial report card rates learning skills as Consistently, Usually, Sometimes or Rarely. They describe how a student goes about learning, and they are reported separately so that effort and behaviour do not change the academic level. Teachers add comments with examples.",
    items: [
      {
        id: "personal-management",
        name: "Personal management",
        blurb: "Getting started, staying organized, using time well and asking for help when needed.",
        parts: [],
        atHome: [
          "Make a short routine for homework time and let your child choose the order of the tasks.",
          "Use a simple checklist or calendar for the week.",
          "Ask “What will you do first, and what will you do if you get stuck?”",
        ],
      },
      {
        id: "active-participation",
        name: "Active participation in learning",
        blurb: "Taking part, trying new things, asking questions and sharing ideas.",
        parts: [],
        atHome: [
          "Ask a question at dinner that has no single right answer and listen to each person's idea.",
          "Praise trying a hard problem, not only getting it right.",
          "Let your child teach you something they learned this week.",
        ],
      },
      {
        id: "social-responsibility",
        name: "Social responsibility",
        blurb: "Working well with others, respecting differences and caring for the community.",
        parts: [],
        atHome: [
          "Help with a family or community job, such as a clean-up or a food drive.",
          "Talk about how a rule or a choice affects other people.",
          "Learn about the Treaties and the First Nations, Métis and Inuit communities in Manitoba.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are the learning skills part of the subject levels?",
        a: "No. They are reported separately, so effort and behaviour do not raise or lower a subject level.",
      },
      {
        q: "What do Consistently, Usually, Sometimes and Rarely mean?",
        a: "They describe how often your child shows the skill. If you see Sometimes or Rarely, ask the teacher for one specific example and one thing to try at home.",
      },
      {
        q: `Does ${APP_NAME} measure learning skills?`,
        a: `No. ${APP_NAME} practises subject outcomes and shows how practice is going. Learning skills grow through routines, talk and community, so we suggest home activities rather than scores.`,
      },
      {
        q: "How can I help if my child is working on one of them?",
        a: "Pick a single skill to focus on and keep the habit small and steady. Small habits work better than trying to change everything at once.",
      },
    ],
  },
  assessment: {
    slug: "provincial-assessments",
    short: "Provincial assessments",
    source: "Manitoba Education and Early Childhood Learning (edu.gov.mb.ca)",
    hubBlurb: "Manitoba's provincial assessments, and how they differ from report cards.",
    name: "Manitoba provincial assessments",
    intro:
      "Manitoba runs provincial assessments to see how well students are meeting the learning outcomes in the curriculum. They give schools, divisions and the province information that helps guide teaching. The grades and subjects have changed over the years, so check Manitoba Education's website or ask your school for the current schedule. Provincial assessments are separate from report cards.",
    grades: ["3", "8"],
    facts: [
      { title: "Who takes it", body: "Provincial assessments have been given in the early years (around Grade 3) and in Grade 8. Ask your school which grades take part this year." },
      { title: "What it covers", body: "They look at skills such as reading, writing and numeracy that are built over several years of the curriculum." },
      { title: "When", body: "Dates and grades can change from year to year. Your school will tell you when your child's grade takes part." },
      { title: "Why", body: "The aim is to understand how students are doing across the province, to guide teaching and help schools plan support." },
      { title: "Report card link", body: "The assessments are separate from report cards. Your school will tell you how results are shared." },
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
        q: "Which grades write the provincial assessments?",
        a: "It has varied over time, with assessments in the early years and in Grade 8. Check with your school or Manitoba Education for this year.",
      },
      {
        q: "Are the provincial assessments part of my child's report card?",
        a: "They are separate from report cards. Ask your child's teacher how results are shared.",
      },
      {
        q: "Should my child study for them?",
        a: "Cramming is not needed. The assessments check skills built over years, so short, regular practice in reading, writing and math is more helpful than a last-minute push.",
      },
      {
        q: "Where can I find the current schedule?",
        a: "Manitoba Education publishes information at edu.gov.mb.ca. Your school will also tell you when your child's grade takes part.",
      },
      {
        q: `Can ${APP_NAME} help my child get ready?`,
        a: `${APP_NAME} practises the math and language outcomes taught in these grades with kind feedback and no timers unless you want them. It isn't a copy of the provincial assessments and doesn't predict a result.`,
      },
    ],
  },
  gradeNotes: {
    k: {
      overview:
        "Kindergarten in Manitoba builds early learning through play in English language arts, mathematics, science and social studies. Children count, spot patterns, compare objects, and explore living things, materials and their community.",
      lookFor: "Look for comments on listening, early letters and sounds, counting and comparing, sharing ideas, and getting along with classmates.",
    },
    "1": {
      overview:
        "Grade 1 is where reading, writing and number sense start to grow quickly. Children work with numbers to 20, patterns and shapes, and study the senses, materials, the seasons and their community.",
      lookFor: "Look for comments on reading simple texts, writing a few sentences, counting and adding, and taking part in class.",
    },
    "2": {
      overview:
        "In Grade 2, reading becomes smoother and writing gets longer. Math moves to numbers to 100, addition and subtraction, patterns and graphs. Science covers animal growth, liquids and solids, and air and water, and social studies looks at communities near and far.",
      lookFor: "Look for fluent reading, longer writing, comfort with adding and subtracting, and the ability to explain thinking.",
    },
    "3": {
      overview:
        "Grade 3 is a bridge year. Students read to learn as well as learning to read, work with numbers to 1000, multiplication, fractions and measurement, and study plants, structures and soils. Social studies looks at communities around the world.",
      lookFor: "Look for comments about reading comprehension, paragraph writing, early multiplication and fractions, and working with others. Grade 3 students may take part in a provincial early years assessment.",
    },
    "4": {
      overview:
        "Grade 4 raises the pace on reading, writing and number work, with numbers to 10 000, multiplication and division, fractions and decimals. Social studies explores Canada's regions and Manitoba. Science covers habitats, light, sound and rocks and minerals.",
      lookFor: "Look for comments on reading for meaning, organized paragraphs, fractions and decimals, and understanding Manitoba and its communities. Core French begins this year.",
    },
    "5": {
      overview:
        "In Grade 5, students deepen number sense with numbers to a million, decimals and fractions, and take on longer reading and writing tasks. Social studies looks at the mosaic of Canada and its diverse peoples.",
      lookFor: "Look for comments on problem solving, supporting ideas with evidence, and independent work.",
    },
    "6": {
      overview:
        "Grade 6 pushes towards more abstract thinking: large numbers, factors, ratio and percent, integers, and algebra with patterns and equations. Social studies follows how Canada has changed since Confederation.",
      lookFor: "Look for comments about organization, explaining reasoning in math and writing with evidence.",
    },
    "7": {
      overview:
        "Grade 7 starts the middle years. Report cards add an overall percentage. Students work with decimals, fractions, percents, integers and equations, and study ecosystems, mixtures, heat and Earth. Social studies looks at Canada in the contemporary world.",
      lookFor: "Look for comments on independence, study habits and confidence with the harder math and reading ahead.",
    },
    "8": {
      overview:
        "Grade 8 is the last year before high school. Students work with squares and roots, rates and ratios, linear relations, the Pythagorean theorem, surface area and volume. Social studies explores the origins of western society.",
      lookFor: "Look for comments on managing a heavier workload, showing steps in math and supporting an argument with evidence. Grade 8 students may take part in a provincial assessment.",
    },
    "9": {
      overview:
        "Grade 9 begins high school credit courses and percentage marks on the report card. Students work with powers, rational numbers, polynomials and linear relations, and study atoms and elements, electricity and the universe. Social studies looks at Canada in the contemporary world.",
      lookFor: "Look for comments on planning ahead for course choices, explaining reasoning in math and weighing perspectives in social studies and English.",
    },
  },
};
