import { APP_NAME } from "@/lib/brand";
import type { FrameworkGuides } from "../guides";

// Parent guides for Nova Scotia. Sources: the Nova Scotia Department of Education and Early Childhood Development
// (curriculum.novascotia.ca, ednet.ns.ca) and the family guides to assessment and reporting. Dates and grades of provincial
// assessments change, so the copy points parents to the department's website. The wording needs a Nova Scotia teacher's review.

export const NOVA_SCOTIA_GUIDES: FrameworkGuides = {
  french: {
    metaTail: "Core French starts in Grade 4; French Immersion has early entry from Primary and late entry later on.",
    browse: ["4", "1"],
    title: "Core French and French Immersion in Nova Scotia: a guide for parents",
    intro: `Nova Scotia families often wonder how Core French and French Immersion differ, when each starts, and how to help at home without speaking French. Both follow Nova Scotia's French curricula, and ${APP_NAME} practises both as optional subjects you can switch on for each child.`,
    compare: [
      { title: "What it is", core: "French as one school subject, taught every week alongside classes in English.", immersion: "A program where much of the school day, including other subjects, is taught in French (Français arts langagiers and other subjects in French)." },
      { title: "When it starts", core: "Core French is taught from Grade 4 in English-language schools.", immersion: "Early French Immersion begins in Primary (Kindergarten). Some regions also offer late entry. Entry points differ by region, so check with your school." },
      { title: "Who it suits", core: "Every child can learn some French. No earlier French is needed.", immersion: "Families who want their child to become fluent. Programs differ by region, so check with yours." },
      { title: "Name in the curriculum", core: "Core French", immersion: "French Immersion (Français arts langagiers)" },
      { title: `In ${APP_NAME}`, core: "Grades 4 to 9. Prompts are in English, with French words and sentences to read, choose and build.", immersion: "Kindergarten to Grade 9. Prompts and stories are in French, with English hints for parents." },
    ],
    sections: [
      { title: "What Core French children learn", body: "Core French builds everyday communication: greetings, numbers, family, school, food, weather and hobbies. In the upper grades children write short texts, use common verbs and ask and answer questions. The aim is confidence with simple, real conversations." },
      { title: "What French Immersion children learn", body: "In immersion, children learn to listen, speak, read and write in French, and learn other subjects in French too. Younger children start with songs, stories and routines, then move on to sentences, paragraphs and longer texts. English language arts is added in later grades. How much is in French in each grade depends on the school and region." },
      { title: "Acadian and francophone schools are different", body: `The Conseil scolaire acadien provincial runs Acadian and francophone schools, where French is the first language of instruction. This guide is about French as a second language. ${APP_NAME} is not a French first-language program.` },
      { title: "How report cards describe French", body: `${APP_NAME} shows practice, not a report card mark, so ask your child's teacher what the report card says about French for your child.` },
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
      { q: "When does Core French start in Nova Scotia?", a: "Core French is taught from Grade 4 in English-language schools. Your school can tell you how much time it gets each week." },
      { q: "Can my child start French Immersion later?", a: "Some regions offer late entry, and some have limited spaces. Entry rules differ, so ask your school or regional centre for education." },
      { q: "Will French Immersion hurt my child's English?", a: "English language arts is still taught in immersion, and research has generally found that immersion students do well in English. If you are worried, talk with your child's teacher." },
      { q: `Do French marks count toward the Grade Champion trophy in ${APP_NAME}?`, a: "No. French is a separate, optional set of subjects. Children earn their own French trophies instead." },
      { q: `Does ${APP_NAME} replace French class?`, a: "No. It gives short, kind practice that matches the topics in the Nova Scotia curriculum. It doesn't replace a teacher, and its levels are not a report card mark." },
    ],
  },
  competencies: {
    slug: "graduation-competencies",
    label: "Graduation competencies",
    hubBlurb: "Nova Scotia's Essential Graduation Competencies, in plain words.",
    description:
      "What the Essential Graduation Competencies mean in Nova Scotia (citizenship, communication, creativity and innovation, critical thinking, personal career development and technological fluency), and simple ways to build them at home.",
    gradeLine: "The Essential Graduation Competencies grow through every subject from Primary to Grade 12.",
    closing: "These competencies grow through everyday routines, projects, play and helping others.",
    title: "Nova Scotia's Essential Graduation Competencies, explained for parents",
    intro:
      "Nova Scotia's curriculum is built around six Essential Graduation Competencies. They describe what students are able to do by the end of Grade 12, and they are woven through every subject from Primary on, so teachers work on them in each grade. They are not marked as separate subjects.",
    items: [
      { id: "citizenship", name: "Citizenship", blurb: "Understanding the world, caring for communities and taking part respectfully.", parts: [], atHome: ["Help with a family or community job, such as a clean-up or a food drive.", "Talk about how a rule or a choice affects other people.", "Learn about the Mi'kmaq, Acadian, African Nova Scotian and Gaelic communities in your area."] },
      { id: "communication", name: "Communication", blurb: "Sharing ideas by speaking, listening, reading, writing and other forms.", parts: [], atHome: ["Ask your child to explain a game or a story to you without showing it.", "Read together and talk about what you each noticed.", "Write a note or postcard to a relative."] },
      { id: "creativity-innovation", name: "Creativity and innovation", blurb: "Trying new ideas, solving problems in fresh ways and learning from mistakes.", parts: [], atHome: ["Build something from recycled materials and improve it together.", "Ask “What else could we try?”", "Praise a brave try, even when it didn't work."] },
      { id: "critical-thinking", name: "Critical thinking", blurb: "Asking questions, weighing evidence and making reasoned choices.", parts: [], atHome: ["Ask “How do you know?” about something in the news or an ad.", "Compare two sources about the same topic.", "Talk through pros and cons before a family choice."] },
      { id: "personal-career-development", name: "Personal and career development", blurb: "Setting goals, managing time and building healthy habits.", parts: [], atHome: ["Make a short routine for homework time and let your child choose the order of the tasks.", "Use a simple checklist or calendar for the week.", "Ask “What will you do first, and what will you do if you get stuck?”"] },
      { id: "technological-fluency", name: "Technological fluency", blurb: "Using digital tools safely, wisely and creatively.", parts: [], atHome: ["Agree on screen time and talk about online safety together.", "Let your child teach you how an app or tool works.", "Look at how a photo or video can be edited and ask what that means for trust."] },
    ],
    faqs: [
      { q: "Are the competencies part of the subject marks?", a: "They are woven through subjects rather than graded as a separate subject. Ask your child's teacher how they show up on the report card." },
      { q: "How do they connect to what my child practises?", a: "Every subject builds them, for example critical thinking in math problems and communication in language arts." },
      { q: `Does ${APP_NAME} measure the competencies?`, a: `No. ${APP_NAME} practises subject outcomes and shows how practice is going. The competencies grow through routines, talk and community, so we suggest home activities rather than scores.` },
      { q: "How can I help if my child is working on one of them?", a: "Pick a single competency to focus on and keep the habit small and steady. Small habits work better than trying to change everything at once." },
    ],
  },
  assessment: {
    slug: "provincial-assessments",
    short: "Provincial assessments",
    source: "Nova Scotia Department of Education and Early Childhood Development (ednet.ns.ca)",
    hubBlurb: "Nova Scotia's provincial assessments, and how they differ from report cards.",
    name: "Nova Scotia provincial assessments",
    intro:
      "Nova Scotia runs provincial assessments to see how well students are meeting the curriculum outcomes. They give schools and the province information that helps guide teaching. The grades, subjects and schedule can change, so check the department's website or ask your school for the current plan. Provincial assessments are separate from report cards.",
    grades: ["3", "6", "8"],
    facts: [
      { title: "Who takes it", body: "Provincial assessments have been given in Grade 3, Grade 6 and Grade 8. Ask your school which grades take part this year." },
      { title: "What it covers", body: "They look at skills such as reading, writing and mathematics that are built over several years of the curriculum." },
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
      { q: "Which grades write the provincial assessments?", a: "It has varied over time, with assessments in Grades 3, 6 and 8. Check with your school or the department's website for this year." },
      { q: "Are the provincial assessments part of my child's report card?", a: "They are separate from report cards. Ask your child's teacher how results are shared." },
      { q: "Should my child study for them?", a: "Cramming is not needed. The assessments check skills built over years, so short, regular practice in reading, writing and math is more helpful than a last-minute push." },
      { q: "Where can I find the current schedule?", a: "The Department of Education and Early Childhood Development publishes information at ednet.ns.ca. Your school will also tell you when your child's grade takes part." },
      { q: `Can ${APP_NAME} help my child get ready?`, a: `${APP_NAME} practises the math and language outcomes taught in these grades with kind feedback and no timers unless you want them. It isn't a copy of the provincial assessments and doesn't predict a result.` },
    ],
  },
  gradeNotes: {
    k: {
      overview: "Primary (Kindergarten) in Nova Scotia builds early learning through play in language and literacy, mathematics, science and social studies. Children count, spot patterns, compare objects, and explore living things, materials and their community.",
      lookFor: "Look for comments on listening, early letters and sounds, counting and comparing, sharing ideas, and getting along with classmates.",
    },
    "1": {
      overview: "Grade 1 is where reading, writing and number sense start to grow quickly. Children work with numbers to 20, patterns and shapes, and study the senses, materials, seasons and their community, including the Mi'kmaq.",
      lookFor: "Look for comments on reading simple texts, writing a few sentences, counting and adding, and taking part in class.",
    },
    "2": {
      overview: "In Grade 2, reading becomes smoother and writing gets longer. Math moves to numbers to 100, addition and subtraction, patterns and graphs. Science covers growth, liquids and solids, and social studies looks at communities and what people contribute.",
      lookFor: "Look for fluent reading, longer writing, comfort with adding and subtracting, and the ability to explain thinking.",
    },
    "3": {
      overview: "Grade 3 is a bridge year. Students read to learn as well as learning to read, work with numbers to 1000, multiplication, fractions and measurement, and study plants and soils. Social studies looks at Atlantic Canada, cultures and democracy.",
      lookFor: "Look for comments about reading comprehension, paragraph writing, early multiplication and fractions, and working with others. Grade 3 students may take part in a provincial assessment.",
    },
    "4": {
      overview: "Grade 4 raises the pace on reading, writing and number work, with numbers to 10 000, multiplication and division, fractions and decimals. Social studies explores early exploration of the land that became Canada. Science covers habitats, light, sound and rocks.",
      lookFor: "Look for comments on reading for meaning, organized paragraphs, fractions and decimals, and understanding exploration and its impacts. Core French begins this year.",
    },
    "5": {
      overview: "In Grade 5, students deepen number sense with numbers to a million, decimals and fractions, and take on longer reading and writing tasks. Social studies looks at ancient societies, First Peoples and how people made decisions in Atlantic Canada.",
      lookFor: "Look for comments on problem solving, supporting ideas with evidence, and independent work.",
    },
    "6": {
      overview: "Grade 6 pushes towards more abstract thinking: large numbers, factors, ratio and percent, integers, and patterns and equations. Social studies looks at culture, cross-cultural understanding and children's rights. Grade 6 students may take part in a provincial assessment.",
      lookFor: "Look for comments about organization, explaining reasoning in math and writing with evidence.",
    },
    "7": {
      overview: "Grade 7 starts the middle years. Students work with integers, fractions, decimals, percents and equations, and study ecosystems, structures and Earth's history. Social studies follows the history of the Maritimes, from Mi'kmaw treaties to World War I.",
      lookFor: "Look for comments on independence, study habits and confidence with the harder math and reading ahead.",
    },
    "8": {
      overview: "Grade 8 is the last year before high school. Students work with squares and roots, rates and ratios, linear relations, the Pythagorean theorem, surface area and volume. Science covers cells, fluids and climate change, and social studies follows Canada from 1920.",
      lookFor: "Look for comments on managing a heavier workload, showing steps in math and supporting an argument with evidence. Grade 8 students may take part in a provincial assessment.",
    },
    "9": {
      overview: "Grade 9 is the last year of junior high. Students work with powers, rational numbers, polynomials and linear relations, and study reproduction, atoms and elements, electricity and space. Citizenship 9 looks at rights, governance, finances and global issues.",
      lookFor: "Look for comments on planning ahead for course choices, explaining reasoning in math and weighing perspectives in social studies and English.",
    },
  },
};
