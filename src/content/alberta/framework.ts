import type { Framework, ProficiencyLevel, ScoringScheme } from "../frameworks";

// Alberta. Standards are the learning outcomes in the Alberta programs of study (Alberta Education,
// alberta.ca/curriculum): the new K–6 curriculum for mathematics, English language arts and literature,
// science, social studies and French immersion language arts and literature, and the existing
// Grades 7–9 programs of study. Alberta has no single provincial report-card scale, so the four steps
// below are a plain practice scale, not an Alberta Education scale. Sources and the checking record are in
// docs/research/alberta/.

const LEVELS: ProficiencyLevel[] = [
  {
    id: "beginning",
    label: "Beginning",
    kidLabel: "Seedling",
    icon: "🌱",
    colour: "#ff9636",
    description: "Practice shows a first understanding of the learning outcomes. Most answers still need a hint or a second try.",
    atHome: "Just getting started with this idea. Short, regular practice with lots of support helps most.",
  },
  {
    id: "approaching",
    label: "Approaching",
    kidLabel: "Sprout",
    icon: "🌿",
    colour: "#f5b301",
    description: "Practice shows a partial understanding of the learning outcomes. Some answers are right on the first try.",
    atHome: "Understands parts of it and is building confidence. Keep practising the tricky parts.",
  },
  {
    id: "meeting",
    label: "Meeting",
    kidLabel: "Tree",
    icon: "🌳",
    colour: "#25b47e",
    description: "Practice shows a solid understanding of the learning outcomes. Most answers are right on the first try.",
    atHome: "Has it! Mixed review now and then keeps it strong.",
  },
  {
    id: "exceeding",
    label: "Exceeding",
    kidLabel: "Star",
    icon: "⭐",
    colour: "#4f8ef7",
    description: "Practice shows a deep understanding of the learning outcomes, including harder, unfamiliar questions.",
    atHome: "Applies it confidently, even in new or harder situations. Try challenge mode and real-life problems.",
  },
];

const SCHEME: ScoringScheme = {
  id: "ab-practice-steps",
  name: "Four practice steps",
  source: "Alberta has no provincial report-card scale. School authorities choose their own, and many use four levels like these.",
  levels: LEVELS,
};

export const ALBERTA: Framework = {
  id: "ca-ab",
  slug: "alberta",
  name: "Alberta",
  shortName: "Alberta",
  country: "CA",
  curriculumName: "Alberta Curriculum",
  region: "Alberta",
  overviewLabel: "Organizing ideas",
  standardLabel: "Learning outcome",
  sourceName: "Alberta Education",
  sourceUrl: "https://www.alberta.ca/curriculum",
  grades: ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  subjects: ["math", "language", "science", "social", "immersion", "core-french"],
  scoringFor: () => SCHEME,
  reportCard: {
    title: "Understanding Alberta report cards",
    intro:
      "Alberta doesn't use one provincial report card. Each school authority (a public, Catholic, francophone or charter board) decides how it reports, so the words and numbers on your child's report depend on the school. Many use a four-step scale for Kindergarten to Grade 9, and some add letter grades or percentages in the upper grades.",
    facts: [
      {
        title: "Your school decides how marks look",
        body: "Alberta Education sets the programs of study, which say what students are expected to learn. The school authority chooses the report card format, the scale and how often families hear from the school.",
      },
      {
        title: "Many schools use four steps",
        body: "A common pattern is four levels that run from just beginning, to approaching the outcomes, to meeting them, to going beyond. The exact names differ by school, so read your child's report card key.",
      },
      {
        title: "Parent-teacher conferences matter",
        body: "Most schools hold conferences, often with student-led portfolios, in the fall and spring. They are a good moment to ask which learning outcomes to practise at home.",
      },
      {
        title: "Provincial assessments are separate",
        body: "Alberta runs Provincial Achievement Tests in Grades 6 and 9 and literacy and numeracy screening in the early grades. They are separate from the report card, and the schedule changes, so check alberta.ca for the current one.",
      },
      {
        title: "New K–6 curriculum",
        body: "Alberta has brought in a new Kindergarten to Grade 6 curriculum in mathematics, English language arts and literature, science and social studies. Grades 7 to 9 are in the middle of the change, so your child's school may be using the older or the newer program.",
      },
    ],
    faqs: [
      {
        q: "Does Alberta have a provincial scale like Emerging to Extending?",
        a: "No. Alberta leaves the scale to each school authority. Gradelings uses four plain practice steps (Beginning, Approaching, Meeting and Exceeding) so you can see where practice stands. Match them to the words on your child's own report card.",
      },
      {
        q: "Is “Beginning” a failing grade?",
        a: "No. Beginning means practice shows only a first understanding so far. It tells you where extra practice and a talk with the teacher will help.",
      },
      {
        q: "What is the difference between Meeting and Exceeding?",
        a: "Meeting means a solid grasp of the outcomes for the grade. Exceeding means your child also does well on harder, unfamiliar questions. It isn't expected in every area.",
      },
      {
        q: "Does Gradelings give my child a grade?",
        a: "No. Gradelings shows how practice is going. Your child's teacher decides how they are doing on the report card.",
      },
      {
        q: "How can I help at home?",
        a: "Ask your child's teacher which learning outcomes to focus on, then try short, regular practice (10 to 15 minutes). Celebrate effort and progress, not just results.",
      },
    ],
  },
};
