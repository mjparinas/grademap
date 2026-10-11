import { APP_NAME } from "@/lib/brand";
import type { FrameworkGuides } from "../guides";

// Parent guides for New Brunswick's anglophone sector. Sources: the New Brunswick Department of Education and Early Childhood
// Development (curriculum.nbed.ca, gnb.ca) and its guidelines for assessing, evaluating and reporting. Programs, entry points
// and the provincial assessment schedule change, so the copy points parents to their school and to gnb.ca. The wording needs a
// New Brunswick teacher's review.

export const NEW_BRUNSWICK_GUIDES: FrameworkGuides = {
  french: {
    metaTail: "Intensive French starts in Grade 4, and Early French Immersion starts in Grade 1.",
    browse: ["4", "1"],
    title: "Intensive French and French Immersion in New Brunswick: a guide for parents",
    intro: `New Brunswick families often wonder how the French programs differ, when each starts, and how to help at home without speaking French. In English-language schools, children learn French through Intensive French and Post-Intensive French (called Core French in ${APP_NAME}) or through French Immersion. ${APP_NAME} practises both as optional subjects you can switch on for each child.`,
    compare: [
      { title: "What it is", core: "French as a school subject, taught alongside classes in English. Intensive French is a focused program for non-immersion learners, and Post-Intensive French builds on it.", immersion: "A program where much of the school day, including other subjects, is taught in French, with French Immersion Language Arts as the language course." },
      { title: "When it starts", core: "Intensive French is for non-immersion learners in Grades 4 and 5. Post-Intensive French follows from Grade 6.", immersion: "Early French Immersion begins in Grade 1. A later entry point is available in Grade 6. Programs can change, so check with your school district." },
      { title: "Who it suits", core: "Every child can learn some French. No earlier French is needed.", immersion: "Families who want their child to become fluent in French and are happy to have much of the day in French." },
      { title: "Name in the curriculum", core: "Intensive French and Post-Intensive French (French Second Language)", immersion: "French Immersion Language Arts" },
      { title: `In ${APP_NAME}`, core: "Grades 4 to 9. Prompts are in English, with French words and sentences to read, choose and build.", immersion: "Grades 1 to 9. Prompts and stories are in French, with English hints for parents." },
    ],
    sections: [
      { title: "What Intensive and Post-Intensive French children learn", body: "These courses have three strands: oral communication, reading and viewing, and writing and representing. Children learn to ask for and share information, read and understand simple texts, and produce short texts on familiar topics. In the upper grades, the texts grow longer and more connected." },
      { title: "What French Immersion children learn", body: "In French Immersion Language Arts, children listen, speak, read and write in French, and learn about francophone cultures and their own identities as speakers of more than one language. Younger children start with sounds, songs and stories, then move on to sentences, paragraphs and longer texts. How much of the day is in French depends on the grade and the school." },
      { title: "Francophone sector schools are different", body: `New Brunswick also has a francophone school sector, where French is the first language of instruction. This guide is about French as a second language in English-language schools. ${APP_NAME} is not a French first-language program.` },
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
      { q: "When does French start in New Brunswick?", a: "Early French Immersion starts in Grade 1 for families who choose it. For other learners, Intensive French is taught in Grades 4 and 5 and Post-Intensive French from Grade 6. Your school can tell you how much time it gets each week." },
      { q: "Can my child start French Immersion later?", a: "There is a later entry point in Grade 6. Entry rules and spaces differ by district, so ask your school or school district." },
      { q: "Will French Immersion hurt my child's English?", a: "English language arts is still taught alongside immersion, and research has generally found that immersion students do well in English. If you are worried, talk with your child's teacher." },
      { q: `Do French marks count toward the Grade Champion trophy in ${APP_NAME}?`, a: "No. French is a separate, optional set of subjects. Children earn their own French trophies instead." },
      { q: `Does ${APP_NAME} replace French class?`, a: "No. It gives short, kind practice that matches the topics in the New Brunswick curriculum. It doesn't replace a teacher, and its levels are not a report card mark." },
    ],
  },
  competencies: {
    slug: "global-competencies",
    label: "Global competencies",
    hubBlurb: "New Brunswick's six Global Competencies, in plain words.",
    description:
      "What the New Brunswick Global Competencies mean (collaboration, communication, critical thinking and problem solving, innovation, creativity and entrepreneurship, self-awareness and self-management, and sustainability and global citizenship), and simple ways to build them at home.",
    gradeLine: "The Global Competencies grow through every subject from Kindergarten to Grade 12.",
    closing: "These competencies grow through everyday routines, projects, play and helping others.",
    title: "New Brunswick's Global Competencies, explained for parents",
    intro:
      "New Brunswick's curriculum is built around six Global Competencies. They describe the skills, knowledge and attitudes learners build over their school years, and they are woven through every subject, so teachers work on them in each grade. In the curriculum documents, each skill descriptor is tagged with the competencies it helps to build. They are not marked as separate subjects.",
    items: [
      { id: "collaboration", name: "Collaboration", blurb: "Working with others, with different roles and perspectives, to build ideas together.", parts: [], atHome: ["Cook a meal together, with each person taking a job.", "Ask your child to plan a family game night and share the roles.", "Talk about what made a group project go well."] },
      { id: "communication", name: "Communication", blurb: "Sharing and receiving meaning in different ways, with different audiences and purposes.", parts: [], atHome: ["Ask your child to explain a game or a story to you without showing it.", "Read together and talk about what you each noticed.", "Write a note or postcard to a relative."] },
      { id: "critical-thinking-problem-solving", name: "Critical thinking and problem solving", blurb: "Asking questions, weighing evidence and making reasoned choices.", parts: [], atHome: ["Ask “How do you know?” about something in the news or an ad.", "Compare two sources about the same topic.", "Talk through pros and cons before a family choice."] },
      { id: "innovation-creativity-entrepreneurship", name: "Innovation, creativity and entrepreneurship", blurb: "Turning ideas into action to meet a need, and learning from what does not work.", parts: [], atHome: ["Build something from recycled materials and improve it together.", "Ask “What else could we try?”", "Praise a brave try, even when it didn't work."] },
      { id: "self-awareness-self-management", name: "Self-awareness and self-management", blurb: "Knowing yourself as a learner, setting goals and looking after your well-being.", parts: [], atHome: ["Make a short routine for homework time and let your child choose the order of the tasks.", "Use a simple checklist or calendar for the week.", "Ask “What will you do first, and what will you do if you get stuck?”"] },
      { id: "sustainability-global-citizenship", name: "Sustainability and global citizenship", blurb: "Caring for communities and the environment, and appreciating different worldviews.", parts: [], atHome: ["Help with a family or community job, such as a clean-up or a food drive.", "Talk about how a choice affects other people and the land.", "Learn about the Wolastoqey, Mi'kmaq and Peskotomuhkati nations and the other communities in your area."] },
    ],
    faqs: [
      { q: "Are the competencies part of the subject levels?", a: "They are woven through subjects rather than graded as a separate subject. Ask your child's teacher how they show up on the report card." },
      { q: "How do they connect to what my child practises?", a: "Every subject builds them, for example critical thinking and problem solving in math problems and communication in language arts." },
      { q: `Does ${APP_NAME} measure the competencies?`, a: `No. ${APP_NAME} practises subject skill descriptors and shows how practice is going. The competencies grow through routines, talk and community, so we suggest home activities rather than scores.` },
      { q: "How are learning habits different?", a: "Learning habits (independence, initiative, interactions, organization and responsibility) are reported on the report card from Kindergarten to Grade 8. The Global Competencies are the wider skills the curriculum builds across all subjects." },
    ],
  },
  assessment: {
    slug: "provincial-assessments",
    short: "Provincial assessments",
    source: "New Brunswick Department of Education and Early Childhood Development (gnb.ca)",
    hubBlurb: "New Brunswick's provincial assessments, and how they differ from report cards.",
    name: "New Brunswick provincial assessments",
    intro:
      "The anglophone sector monitors student achievement through annual provincial assessments. They give schools, districts and the province information that helps guide teaching. In 2026-2027, the department lists assessments in Grades 4 to 8, with each grade covering particular subjects. The grades, subjects and schedule change, so check gnb.ca or ask your school for the current plan. Provincial assessments are separate from report cards.",
    grades: ["4", "5", "6", "7", "8"],
    facts: [
      { title: "Who takes it", body: "For 2026-2027, the department lists assessments in Grades 4, 5, 6, 7 and 8 (and Grade 10 in high school). Ask your school which grades take part this year." },
      { title: "What it covers", body: "It varies by grade. For 2026-2027, Grades 4 and 6 list scientific literacy and English reading, Grade 5 lists mathematics and French Immersion reading, Grade 7 lists mathematics and French reading, and Grade 8 lists scientific literacy." },
      { title: "When", body: "The department publishes an assessment timetable each year. Your school will tell you when your child's grade takes part." },
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
      { q: "Which grades write the provincial assessments?", a: "The grades and subjects change from year to year. For 2026-2027 the department lists Grades 4 to 8 in the anglophone sector. Check gnb.ca or ask your school for this year." },
      { q: "Are the provincial assessments part of my child's report card?", a: "They are separate from report cards. Ask your child's teacher how results are shared." },
      { q: "Should my child study for them?", a: "Cramming is not needed. The assessments check skills built over years, so short, regular practice in reading, writing, math and science is more helpful than a last-minute push." },
      { q: "Where can I find the current schedule?", a: "The Department of Education and Early Childhood Development publishes the assessment timetable and information bulletins for parents at gnb.ca. Your school will also tell you when your child's grade takes part." },
      { q: `Can ${APP_NAME} help my child get ready?`, a: `${APP_NAME} practises the math, language and science skills taught in these grades with kind feedback and no timers unless you want them. It isn't a copy of the provincial assessments and doesn't predict a result.` },
    ],
  },
  gradeNotes: {
    k: {
      overview: "Kindergarten in New Brunswick builds early learning through play. Children explore language and literacy, early mathematics, and the inquiry, well-being and community learning in Explore Your World. There are no separate science and social studies courses in Kindergarten to Grade 2.",
      lookFor: "Look for comments on listening, early letters and sounds, counting and comparing, sharing ideas, and getting along with classmates.",
    },
    "1": {
      overview: "Grade 1 is where reading, writing and number sense start to grow quickly. Children work with numbers to 20, patterns and shapes, and explore nature, community and well-being through Explore Your World. Early French Immersion starts this year for families who choose it.",
      lookFor: "Look for comments on reading simple texts, writing a few sentences, counting and adding, and taking part in class.",
    },
    "2": {
      overview: "In Grade 2, reading becomes smoother and writing gets longer. Math moves to numbers to 100, addition and subtraction, patterns and graphs. Explore Your World continues to build inquiry, belonging and care for the environment.",
      lookFor: "Look for fluent reading, longer writing, comfort with adding and subtracting, and the ability to explain thinking.",
    },
    "3": {
      overview: "Grade 3 is a bridge year, and science and social studies become courses of their own. Students study their local environment, weather and climate, habitats, plants and animals, and in social studies they learn about New Brunswick: its location, its peoples (including the Wolastoqey, Mi'kmaq and Peskotomuhkati nations), its governments and the Peace and Friendship treaties.",
      lookFor: "Look for comments about reading comprehension, paragraph writing, early multiplication and fractions, and using evidence in science and social studies.",
    },
    "4": {
      overview: "Grade 4 raises the pace on reading, writing and number work. Science looks at Earth materials: rocks, minerals, soil and the forces that change Earth's surface. Social studies explores explorers and their impacts, Canada's regions and Wabanaki cultures. Intensive French begins for non-immersion learners, and a Grade 4 provincial assessment is listed.",
      lookFor: "Look for comments on reading for meaning, organized paragraphs, fractions and decimals, and using sources to explain exploration and its impacts.",
    },
    "5": {
      overview: "In Grade 5, students deepen number sense and take on longer reading and writing tasks. Science looks at human body systems and simple machines. Social studies looks at Atlantic Canada, interactions among first and founding peoples, the Wabanaki Confederacy and worldviews.",
      lookFor: "Look for comments on problem solving, supporting ideas with evidence, and independent work. A Grade 5 mathematics assessment is listed for 2026-2027.",
    },
    "6": {
      overview: "Grade 6 pushes towards more abstract thinking: ratio, percent, decimals and fractions, and patterns and equations. Science explores how the senses and the brain help us find our way. Social studies looks at the Atlantic region and the world: cultures, cross-cultural understanding, politics and trade.",
      lookFor: "Look for comments about organization, explaining reasoning in math and writing with evidence. Grade 6 students may take part in a provincial assessment.",
    },
    "7": {
      overview: "Grade 7 starts deeper work with integers, fractions, decimals, percents and equations. Science covers matter, energy, weather and climate. Social studies explores worldview and culture, human rights, global citizenship and historically diverse regions of the world.",
      lookFor: "Look for comments on independence, study habits and confidence with the harder math and reading ahead. A Grade 7 mathematics assessment is listed for 2026-2027.",
    },
    "8": {
      overview: "Grade 8 is the last year before high school courses. Students work with rates and ratios, linear relations, the Pythagorean theorem, surface area and volume. Science looks at motion, forces and human presence in space. Social studies looks at empowerment in Canada's history, including Confederation, rights movements and Wabanaki governance.",
      lookFor: "Look for comments on managing a heavier workload, showing steps in math and supporting an argument with evidence. A Grade 8 science assessment is listed for 2026-2027.",
    },
    "9": {
      overview: "Grade 9 is the start of the high school block. Students work with powers, rational numbers, polynomials and linear relations, and in science they bring together ideas from earlier grades (ecosystems, matter, cells and the universe). Social Studies 9 explores Canadian identities, governance and rights.",
      lookFor: "Look for comments on planning ahead for course choices, explaining reasoning in math and weighing perspectives in social studies and English. Grade 9 courses receive a numerical grade.",
    },
  },
};
