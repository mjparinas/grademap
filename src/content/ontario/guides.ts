import type { FrameworkGuides } from "../guides";

// Parent guides for Ontario. Sources: the Ontario Curriculum (Mathematics 2020, Language 2023,
// The Kindergarten Program 2016), Growing Success (2010) for learning skills and report cards,
// and EQAO (eqao.com) for the provincial assessments. Ontario wording needs a teacher review.

export const ONTARIO_GUIDES: FrameworkGuides = {
  competencies: {
    slug: "learning-skills",
    label: "Learning skills and work habits",
    hubBlurb: "The six learning skills on the Ontario report card, in plain words.",
    description:
      "What the six Ontario learning skills and work habits mean (responsibility, organization, independent work, collaboration, initiative and self-regulation), how they appear on the report card, and simple ways to build them at home.",
    gradeLine: "Learning skills and work habits are reported in every grade.",
    closing: "Learning skills grow through routines, projects, teamwork and play.",
    title: "Ontario learning skills and work habits on the report card, explained for parents",
    intro:
      "Alongside the marks for each subject, Ontario report cards rate six learning skills and work habits: responsibility, organization, independent work, collaboration, initiative and self-regulation. They are reported separately from achievement, so a student can do well in math and still be working on organization, or the other way around. Teachers rate each skill as Excellent, Good, Satisfactory or Needs Improvement and may add a comment.",
    items: [
      {
        id: "responsibility",
        name: "Responsibility",
        blurb: "Doing what you said you would do, and owning your choices.",
        parts: [],
        atHome: [
          "Give your child one regular job at home and let them keep track of it.",
          "When something goes wrong, ask “What can we do to fix it?” instead of “Whose fault is it?”",
          "Let them pack their own school bag the night before.",
        ],
      },
      {
        id: "organization",
        name: "Organization",
        blurb: "Making a plan, using time well and keeping track of materials.",
        parts: [],
        atHome: [
          "Use a simple weekly calendar or checklist for homework and activities.",
          "Break a big project into small steps, and set a mini-deadline for each one.",
          "Pick a home for school things (a hook, a bin) so they are easy to find.",
        ],
      },
      {
        id: "independent-work",
        name: "Independent Work",
        blurb: "Working on a task without needing constant reminders.",
        parts: [],
        atHome: [
          "Start a task together, then step away and check back in a few minutes.",
          "Let your child try a tricky problem first, and ask “What have you tried?” before helping.",
          "Praise the habit: “You stuck with that on your own.”",
        ],
      },
      {
        id: "collaboration",
        name: "Collaboration",
        blurb: "Working well with others, sharing ideas and solving disagreements kindly.",
        parts: [],
        atHome: [
          "Cook, build or play a board game together and talk about how you shared the jobs.",
          "Ask your child how they would feel if the roles were switched when there is a disagreement.",
          "Invite a friend over for a shared project, such as a fort, a poster or a recipe.",
        ],
      },
      {
        id: "initiative",
        name: "Initiative",
        blurb: "Being curious, trying new things and starting without being told.",
        parts: [],
        atHome: [
          "Follow your child's questions. Look the answer up together or try a small experiment.",
          "Let them choose a new thing to try each month, such as a recipe, a book or a game.",
          "Celebrate a try, even when it does not work the first time.",
        ],
      },
      {
        id: "self-regulation",
        name: "Self-Regulation",
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
        q: "Are learning skills part of my child's marks?",
        a: "No. They are reported separately from achievement in each subject. The marks show how well your child is meeting the curriculum expectations, and the learning skills show how they go about their learning.",
      },
      {
        q: "What are the Ontario learning skills and work habits?",
        a: "There are six: responsibility, organization, independent work, collaboration, initiative and self-regulation. Teachers rate each one as Excellent (E), Good (G), Satisfactory (S) or Needs Improvement (N).",
      },
      {
        q: "Are learning skills reported in Kindergarten?",
        a: "Kindergarten families receive written communications of learning, which describe how a child is growing in areas such as belonging, self-regulation and problem solving, instead of the rating scale used in Grades 1 to 8.",
      },
      {
        q: "Does GradeMap measure learning skills?",
        a: "No. GradeMap practises subject skills and shows how they match the four Ontario levels. Learning skills grow through routines, conversation and teamwork, so we suggest home activities rather than scores.",
      },
      {
        q: "How can I help if my child gets a Needs Improvement?",
        a: "Ask the teacher for one specific example and one thing to try at home, then pick a single skill to work on. A small, steady habit, such as a packing checklist or a daily ten-minute start-up routine, works better than trying to fix everything at once.",
      },
    ],
  },
  assessment: {
    slug: "eqao",
    short: "EQAO",
    source: "EQAO and the Ontario Ministry of Education",
    hubBlurb: "The Grade 3 and Grade 6 provincial assessments of reading, writing and math.",
    name: "Education Quality and Accountability Office (EQAO) assessments",
    intro:
      "EQAO (the Education Quality and Accountability Office) runs Ontario's province-wide assessments of reading, writing and math. Students write them in Grade 3 and Grade 6 in elementary school, and again in math in Grade 9. They are separate from the report card and from class marks.",
    grades: ["3", "6"],
    facts: [
      { title: "Who takes it", body: "Students in Grades 3 and 6, and in Grade 9 math. Parents can ask their school if they have questions about their child taking part." },
      { title: "What it covers", body: "Reading, writing and math, in line with the Ontario Curriculum for the grade." },
      { title: "When", body: "Schools schedule the assessments in the spring. EQAO publishes the dates and format each year, so check eqao.com or ask your school." },
      { title: "How results are described", body: "Results use the same four levels as the report card. Level 3 is the provincial standard. Some students receive a result below Level 1, which means there was not enough evidence to give a level." },
      { title: "Report card link", body: "EQAO results do not change a student's report card marks. Families receive an individual student report from the school, which gives one more snapshot of reading, writing and math." },
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
        q: "What does EQAO stand for?",
        a: "The Education Quality and Accountability Office. It is the agency that runs Ontario's province-wide assessments of reading, writing and math.",
      },
      {
        q: "Is EQAO part of my child's report card?",
        a: "No. It is separate from the report card. Your child's report card describes classroom learning through the year using the four levels of achievement.",
      },
      {
        q: "Should my child study for EQAO?",
        a: "Cramming is not needed. The assessments check skills built over years. Short, regular practice in reading, writing and math is more helpful than a last-minute push, and so is a calm, positive attitude.",
      },
      {
        q: "What do EQAO levels mean?",
        a: "Results use Levels 1 to 4, and Level 3 is the provincial standard. Level 2 approaches the standard and Level 4 surpasses it. Talk with your child's teacher about what the result means for your child.",
      },
      {
        q: "Can GradeMap help my child get ready?",
        a: "GradeMap practises the math and language skills taught in Grades 3 and 6 with kind feedback and no timers unless you want them. It isn't a copy of the EQAO assessments and doesn't predict a result.",
      },
    ],
  },
  gradeNotes: {
    k: {
      overview:
        "Kindergarten in Ontario is play-based and inquiry-based. The Kindergarten Program looks at belonging and contributing, self-regulation and well-being, demonstrating literacy and math behaviours, and problem solving and innovating. Children learn through exploring, talking, building and drawing.",
      lookFor:
        "Kindergarten families receive written communications of learning, not marks. Expect comments about friendships, listening, early letters and sounds, counting, and how your child shares ideas.",
    },
    "1": {
      overview:
        "Grade 1 is where reading, writing and number sense start to grow quickly. Children learn how letters and sounds fit together, read short books, write simple sentences and work with numbers to 50 in the Ontario Curriculum.",
      lookFor:
        "Look for comments on reading simple texts, spelling common words, counting and adding, and taking part in class. Grade 1 report cards use letter grades linked to the four levels.",
    },
    "2": {
      overview:
        "In Grade 2, reading becomes smoother and writing gets longer. Math moves into numbers to 200, adding and subtracting, equal sharing and measuring, along with early coding and money.",
      lookFor:
        "Look for fluent reading, longer writing, adding and subtracting with larger numbers, and the ability to explain thinking.",
    },
    "3": {
      overview:
        "Grade 3 is a bridge year. Students read to learn as well as learning to read, start multiplication and division, work with numbers to 1000 and fractions, and practise cursive writing. Grade 3 students also write the EQAO assessments.",
      lookFor:
        "Look for comments about reading comprehension, paragraph writing, understanding multiplication and division, and fractions. The EQAO assessments are separate from the report card.",
    },
    "4": {
      overview:
        "Grade 4 raises the pace on reading, writing and number work with numbers to 10 000, multiplication and division, fractions and decimals. Students also write longer pieces and do more research.",
      lookFor:
        "Look for comments on reading for meaning, organized paragraphs, fractions and decimals, and showing steps in math.",
    },
    "5": {
      overview:
        "In Grade 5, students deepen their number sense with numbers to 100 000, decimals, fractions and multi-digit operations, and take on longer reading and writing tasks, including research.",
      lookFor:
        "Look for comments on problem solving, supporting ideas with evidence, and independent work.",
    },
    "6": {
      overview:
        "Grade 6 pushes towards more abstract thinking: numbers to 1 000 000, fractions, ratios and percents, algebra with patterns and equations, and longer writing with more independent study. Grade 6 students also write the EQAO assessments.",
      lookFor:
        "Look for comments about organization, explaining reasoning in math (including ratios and percents) and writing with evidence. The EQAO assessments are separate from the report card.",
    },
    "7": {
      overview:
        "Grade 7 is the first year of the intermediate division, and report cards switch to percentage marks. Students work with integers, fractions, ratios, percents, equations and volume, and analyse what they read more deeply.",
      lookFor:
        "Look for comments on independence, study habits and confidence with the harder math and reading ahead. Level 3 is 70 to 79 per cent.",
    },
  },
};
