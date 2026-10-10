import type { Framework, ProficiencyLevel, ScoringScheme } from "../frameworks";

// Saskatchewan. Standards are the outcomes in the Saskatchewan Curriculum (Ministry of Education,
// curriculum.gov.sk.ca). Saskatchewan has no single provincial report-card scale: each school division
// chooses its own wording, and four levels are the common pattern, so the labels here follow that pattern.
// Sources and the checking record are in docs/research/saskatchewan/.

const LEVELS: ProficiencyLevel[] = [
  {
    id: "beginning",
    label: "Beginning",
    kidLabel: "Seedling",
    icon: "🌱",
    colour: "#ff9636",
    description:
      "The student is at the start of learning the outcomes and shows an initial understanding, usually with a lot of support.",
    atHome: "Just getting started with this idea. Short, regular practice with lots of support helps most.",
  },
  {
    id: "approaching",
    label: "Approaching",
    kidLabel: "Sprout",
    icon: "🌿",
    colour: "#f5b301",
    description:
      "The student is working towards the outcomes and shows a partial understanding that is still growing.",
    atHome: "Understands parts of it and is building confidence. Keep practising the tricky parts.",
  },
  {
    id: "meeting",
    label: "Meeting",
    kidLabel: "Tree",
    icon: "🌳",
    colour: "#25b47e",
    description: "The student meets the outcomes for the grade and shows a solid, consistent understanding.",
    atHome: "Has it! Meeting is the goal for every outcome. Mixed review now and then keeps it strong.",
  },
  {
    id: "exemplary",
    label: "Exemplary",
    kidLabel: "Star",
    icon: "⭐",
    colour: "#4f8ef7",
    description:
      "The student goes beyond the outcomes for the grade and applies the learning with confidence, even in new situations.",
    atHome: "Applies it confidently, even in new or harder situations. Try challenge mode and real-life problems.",
  },
];

const SCHEME: ScoringScheme = {
  id: "sk-levels",
  name: "Four levels of achievement (the common Saskatchewan pattern)",
  source: "Saskatchewan school division reporting practice; check your division's report card for its exact words",
  levels: LEVELS,
};

export const SASKATCHEWAN: Framework = {
  id: "ca-sk",
  slug: "saskatchewan",
  name: "Saskatchewan",
  shortName: "Saskatchewan",
  country: "CA",
  curriculumName: "Saskatchewan Curriculum",
  region: "Saskatchewan",
  overviewLabel: "Strands and outcomes",
  standardLabel: "Outcome",
  sourceName: "Saskatchewan Ministry of Education",
  sourceUrl: "https://curriculum.gov.sk.ca/",
  grades: ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  // French is not built for Saskatchewan yet (see docs/research/saskatchewan/README.md).
  subjects: ["math", "language", "science", "social"],
  scoringFor: () => SCHEME,
  reportCard: {
    title: "Understanding Saskatchewan report cards",
    intro:
      "In Saskatchewan, each school division decides how its report cards look and what the levels are called. Most Kindergarten to Grade 9 report cards describe how your child is doing on the outcomes in the Saskatchewan Curriculum using about four levels, often with written comments and learning goals.",
    facts: [
      {
        title: "Your division sets the words",
        body: "There isn't one province-wide scale. Divisions use labels such as Beginning, Approaching, Meeting and Exemplary (or Exceeding). The idea is the same: where your child is on the outcomes right now.",
      },
      {
        title: "Outcomes and indicators",
        body: "Teachers report on the outcomes in each subject. Each outcome has indicators, which are examples of what a student might show when they are meeting it.",
      },
      {
        title: "Reports go home a few times a year",
        body: "Many divisions send progress reports or report cards two or three times a year, with parent-teacher conferences and student-led conferences in between.",
      },
      {
        title: "Broad areas of learning and cross-curricular competencies",
        body: "Saskatchewan's curriculum also looks at broad areas of learning (lifelong learners, sense of self and community, and engaged citizens) and four cross-curricular competencies. Teachers often comment on them separately from subject marks.",
      },
      {
        title: "Provincial assessments are separate",
        body: "The province is rolling out provincial assessments in English language arts and mathematics in some grades. They are separate from report cards.",
      },
    ],
    faqs: [
      {
        q: "Is “Beginning” a failing level?",
        a: "No. It means your child is early in learning that outcome. It's common at the start of a unit and tells you where extra practice and support will help.",
      },
      {
        q: "What does “Meeting” mean?",
        a: "Meeting means your child is doing what is expected for the grade on that outcome. It's the goal for every outcome.",
      },
      {
        q: "What's the difference between Meeting and Exemplary?",
        a: "Exemplary means your child goes beyond what is expected, applying the learning confidently and flexibly. It isn't expected in every area.",
      },
      {
        q: "My division uses different words. Does Gradelings still help?",
        a: "Yes. Gradelings shows practice on four steps, from Beginning to Exemplary, which line up with the levels most divisions use. Match them to your division's words with your child's teacher.",
      },
      {
        q: "Does Gradelings give a report card level?",
        a: "No. It shows how practice is going so you can see strengths and next steps. Your child's teacher decides their level on the report card.",
      },
      {
        q: "How can I help at home?",
        a: "Ask your child's teacher which outcomes to focus on, then use short, regular practice (10 to 15 minutes). Celebrate effort and progress, not just results.",
      },
    ],
  },
};
