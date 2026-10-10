import type { FrameworkGuides } from "../guides";

// Parent guides for Saskatchewan. Sources: the Saskatchewan Curriculum (curriculum.gov.sk.ca), including its
// broad areas of learning and cross-curricular competencies, and the Ministry of Education's announcement of the
// provincial student assessment program (saskatchewan.ca, November 2024). Saskatchewan has no single provincial
// report card, so the report-card wording is general. The wording needs a Saskatchewan teacher's review.

export const SASKATCHEWAN_GUIDES: FrameworkGuides = {
  competencies: {
    slug: "cross-curricular-competencies",
    label: "Cross-curricular competencies",
    hubBlurb: "The four competencies and three broad areas of learning in Saskatchewan classrooms.",
    description:
      "What Saskatchewan's four cross-curricular competencies (thinking, identity and interdependence, literacies, and social responsibility) and three broad areas of learning mean, and simple ways to build them at home.",
    gradeLine: "The cross-curricular competencies are woven into every subject and grade.",
    closing: "These competencies grow through everyday talk, projects, play and helping others.",
    title: "Saskatchewan's cross-curricular competencies and broad areas of learning, explained for parents",
    intro:
      "The Saskatchewan Curriculum aims to help students become lifelong learners, build a sense of self and community, and become engaged citizens. These are the three broad areas of learning. Four cross-curricular competencies, which teachers weave into every subject, help students get there: developing thinking, developing identity and interdependence, developing literacies, and developing social responsibility. Teachers often comment on them separately from subject outcomes.",
    items: [
      {
        id: "thinking",
        name: "Developing Thinking",
        blurb: "Understanding, questioning, problem solving and thinking creatively and critically.",
        parts: [],
        atHome: [
          "Ask “What do you think will happen, and why?” before a game, a recipe or an experiment.",
          "When your child is stuck, ask what they have tried and what else they could try.",
          "Look for more than one way to solve the same problem and compare them.",
        ],
      },
      {
        id: "identity",
        name: "Developing Identity and Interdependence",
        blurb: "Understanding who you are, taking care of yourself and working well with others and the land.",
        parts: [],
        atHome: [
          "Talk about family stories, traditions and languages.",
          "Let your child make age-appropriate choices and explain them.",
          "Spend time outdoors and talk about how people, animals and the land depend on each other.",
        ],
      },
      {
        id: "literacies",
        name: "Developing Literacies",
        blurb: "Making sense of the world through language, numbers, images, technology and the arts.",
        parts: [],
        atHome: [
          "Read together every day, and also read maps, recipes, signs and charts.",
          "Ask your child to explain a graph, a price or a game score in their own words.",
          "Draw, build or perform something to show what they learned.",
        ],
      },
      {
        id: "social-responsibility",
        name: "Developing Social Responsibility",
        blurb: "Taking part in the community, respecting differences and caring for the environment.",
        parts: [],
        atHome: [
          "Help with a family or community job, such as a clean-up or a food drive.",
          "Talk about how a rule or a choice affects other people.",
          "Learn about the Treaties and the First Nations and Métis communities near you.",
        ],
      },
    ],
    faqs: [
      {
        q: "What are the broad areas of learning?",
        a: "There are three: lifelong learners, sense of self and community, and engaged citizens. They describe the big goals of a Saskatchewan education.",
      },
      {
        q: "Are the competencies graded?",
        a: "Teachers comment on them alongside the subject outcomes. How they are shown on a report card is up to each school division, so ask your child's teacher.",
      },
      {
        q: "Do the competencies replace subjects?",
        a: "No. They are woven into math, English language arts, science, social studies and the other subjects instead of being taught separately.",
      },
      {
        q: "Does Gradelings measure the competencies?",
        a: "No. Gradelings practises subject outcomes and shows how practice is going. The competencies grow through talk, projects and community, so we suggest home activities rather than scores.",
      },
      {
        q: "How can I help if my child is working on one of them?",
        a: "Ask the teacher for one specific example and one thing to try at home, then pick a single competency to focus on. Small, steady habits work better than trying to change everything at once.",
      },
    ],
  },
  assessment: {
    slug: "provincial-assessments",
    short: "Provincial assessments",
    source: "the Saskatchewan Ministry of Education (saskatchewan.ca)",
    hubBlurb: "Saskatchewan's new provincial assessments in English language arts and mathematics.",
    name: "Saskatchewan provincial student assessments",
    intro:
      "Saskatchewan is bringing in a provincial student assessment program based on the Saskatchewan Curriculum. The plan is for students in Grades 5 and 9 to write a mathematics assessment and students in Grades 4, 7 and 10 to write an English language arts assessment. The program is being introduced in stages, starting with field testing, so check the Ministry's website for the current schedule. The assessments are separate from report cards, and the Ministry has said teachers may choose to use them as part of a student's grades.",
    grades: ["4", "5", "7", "9"],
    facts: [
      { title: "Who takes it", body: "The announced plan is Grade 5 and Grade 9 mathematics, and Grade 4, Grade 7 and Grade 10 English language arts." },
      { title: "What it covers", body: "The Ministry says the assessments are developed with Saskatchewan teachers and based on the Saskatchewan Curriculum students are already learning." },
      { title: "When", body: "The program is being introduced in stages, starting with the 2025–26 school year. Dates and grades can change, so ask your school or check saskatchewan.ca." },
      { title: "Why", body: "The Ministry describes the aim as a fair and objective measure of how students are doing, to guide teaching and help schools and divisions improve." },
      { title: "Report card link", body: "The assessments are separate from report cards. Your school will tell you how results are shared and whether teachers use them." },
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
        a: "The announced plan is Grade 5 and Grade 9 mathematics, and Grade 4, Grade 7 and Grade 10 English language arts. The rollout is in stages, so check with your school for this year.",
      },
      {
        q: "Are the provincial assessments part of my child's report card?",
        a: "They are separate from report cards. The Ministry has said teachers may choose to use them as part of a student's grades, so ask your child's teacher how they will be used.",
      },
      {
        q: "Should my child study for them?",
        a: "Cramming is not needed. The assessments check skills built over years, so short, regular practice in reading, writing and math is more helpful than a last-minute push.",
      },
      {
        q: "Where can I find the current schedule?",
        a: "The Ministry of Education publishes the schedule and family information at saskatchewan.ca. Your school will also tell you when your child's grade takes part.",
      },
      {
        q: "Can Gradelings help my child get ready?",
        a: "Gradelings practises the math and language outcomes taught in these grades with kind feedback and no timers unless you want them. It isn't a copy of the provincial assessments and doesn't predict a result.",
      },
    ],
  },
  gradeNotes: {
    k: {
      overview:
        "Kindergarten in Saskatchewan builds early learning in English language arts, mathematics, science, social studies, health, arts and physical education. Children count to 10, spot patterns, compare objects, and explore living things, forces, materials and their natural surroundings.",
      lookFor:
        "Look for comments on listening, early letters and sounds, counting and comparing, sharing ideas, and getting along with classmates.",
    },
    "1": {
      overview:
        "Grade 1 is where reading, writing and number sense start to grow quickly. Children work with numbers to 100 (and add and subtract to 20), repeating patterns and shapes, and study families, the senses, materials and daily and seasonal changes.",
      lookFor:
        "Look for comments on reading simple texts, writing a few sentences, counting and adding, and taking part in class.",
    },
    "2": {
      overview:
        "In Grade 2, reading becomes smoother and writing gets longer. Math moves to numbers to 100, addition and subtraction, patterns, shapes and graphs. Science covers animal growth, liquids and solids, motion, and air and water, and social studies looks at the local community.",
      lookFor:
        "Look for fluent reading, longer writing, comfort with adding and subtracting to 100, and the ability to explain thinking.",
    },
    "3": {
      overview:
        "Grade 3 is a bridge year. Students read to learn as well as learning to read, work with numbers to 1000, multiplication to 5 × 5, fractions and measurement, and study plants, structures, magnets and static electricity, and soils. Social studies looks at communities around the world.",
      lookFor:
        "Look for comments about reading comprehension, paragraph writing, early multiplication and fractions, and working with others.",
    },
    "4": {
      overview:
        "Grade 4 raises the pace on reading, writing and number work, with numbers to 10 000, multiplication and division, fractions and decimals. Social studies focuses on Saskatchewan: its people, land, treaties, government and resources. Science covers habitats, light, sound, and rocks and minerals.",
      lookFor:
        "Look for comments on reading for meaning, organized paragraphs, fractions and decimals, and understanding how Saskatchewan communities work. Grade 4 students may write a provincial English language arts assessment.",
    },
    "5": {
      overview:
        "In Grade 5, students deepen number sense with numbers to a million, decimals and fractions, and take on longer reading and writing tasks. Science covers human body systems, properties of materials, forces and simple machines, and weather. Social studies looks at Canada, its heritage, governance and treaty relationship.",
      lookFor:
        "Look for comments on problem solving, supporting ideas with evidence, and independent work. Grade 5 students may write a provincial mathematics assessment.",
    },
    "6": {
      overview:
        "Grade 6 pushes towards more abstract thinking: place value beyond a million, factors, percent, integers, ratio, algebra with patterns and equations, and angles, area and volume. Science covers diversity of living things, electricity, flight and the solar system.",
      lookFor:
        "Look for comments about organization, explaining reasoning in math and writing with evidence.",
    },
    "7": {
      overview:
        "Grade 7 starts the intermediate years. Students work with decimals, fractions, percents, integers, linear equations and circles, and study ecosystems, mixtures and solutions, heat, and Earth's crust. Social studies looks at Canada, the circumpolar world and Pacific Rim countries.",
      lookFor:
        "Look for comments on independence, study habits and confidence with the harder math and reading ahead. Grade 7 students may write a provincial English language arts assessment.",
    },
    "8": {
      overview:
        "Grade 8 is the last year before high school. Students work with squares and roots, rates and ratios, linear relations, the Pythagorean theorem, surface area and volume. They study cells and organ systems, light, fluids, and water systems, and explore Canadian identity and citizenship.",
      lookFor:
        "Look for comments on managing a heavier workload, showing steps in math and supporting an argument with evidence.",
    },
    "9": {
      overview:
        "Grade 9 builds towards the Level 10, 20 and 30 courses. Students work with powers, rational numbers, polynomials, linear relations and inequalities, and study reproduction, atoms and elements, electricity, and the universe. Social studies examines societies of the past and their influence on Canada.",
      lookFor:
        "Look for comments on planning ahead for course choices, explaining reasoning in math and weighing perspectives in social studies and English. Grade 9 students may write a provincial mathematics assessment.",
    },
  },
};
