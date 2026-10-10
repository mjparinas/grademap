import type { Framework, ProficiencyLevel, ScoringScheme } from "../frameworks";
import type { GradeId } from "../types";

// Ontario. Standards are the expectations in the Ontario Curriculum (Ministry of
// Education, dcp.edu.gov.on.ca). Achievement levels and report-card rules come from
// Growing Success (2010). Sources and the checking record are in docs/research/ontario/.

interface LevelText {
  id: string;
  label: string;
  kidLabel: string;
  icon: string;
  colour: string;
  description: string;
  atHome: string;
  /** Grades 1–6: letter grade. Grades 7–8: percentage range. */
  letter: string;
  percent: string;
}

const LEVELS: LevelText[] = [
  {
    id: "level-1",
    label: "Level 1",
    kidLabel: "Seedling",
    icon: "🌱",
    colour: "#ff9636",
    description:
      "Achievement falls much below the provincial standard. The student demonstrates the specified knowledge and skills with limited effectiveness.",
    atHome: "Just getting started with this idea. Short, regular practice with lots of support helps most.",
    letter: "D range",
    percent: "50–59%",
  },
  {
    id: "level-2",
    label: "Level 2",
    kidLabel: "Sprout",
    icon: "🌿",
    colour: "#f5b301",
    description:
      "Achievement approaches the provincial standard. The student demonstrates the specified knowledge and skills with some effectiveness.",
    atHome: "Understands parts of it and is building confidence. Keep practising the tricky parts.",
    letter: "C range",
    percent: "60–69%",
  },
  {
    id: "level-3",
    label: "Level 3",
    kidLabel: "Tree",
    icon: "🌳",
    colour: "#25b47e",
    description:
      "Achievement is at the provincial standard. The student demonstrates the specified knowledge and skills with considerable effectiveness.",
    atHome: "Has it! Level 3 is the provincial standard. Mixed review now and then keeps it strong.",
    letter: "B range",
    percent: "70–79%",
  },
  {
    id: "level-4",
    label: "Level 4",
    kidLabel: "Star",
    icon: "⭐",
    colour: "#4f8ef7",
    description:
      "Achievement surpasses the provincial standard. The student demonstrates the specified knowledge and skills with a high degree of effectiveness.",
    atHome: "Applies it confidently, even in new or harder situations. Try challenge mode and real-life problems.",
    letter: "A range",
    percent: "80–100%",
  },
];

function scheme(id: string, name: string, marks: "none" | "letter" | "percent"): ScoringScheme {
  return {
    id,
    name,
    source: "Growing Success: Assessment, Evaluation, and Reporting in Ontario Schools (2010)",
    levels: LEVELS.map(
      ({ letter, percent, ...level }): ProficiencyLevel => ({
        ...level,
        marks: marks === "letter" ? letter : marks === "percent" ? percent : undefined,
      }),
    ),
  };
}

const K_SCHEME = scheme("on-levels-k", "Achievement levels (practice only)", "none");
const LETTER_SCHEME = scheme("on-levels-letter", "Four levels of achievement", "letter");
const PERCENT_SCHEME = scheme("on-levels-percent", "Four levels of achievement", "percent");

export const ONTARIO: Framework = {
  id: "ca-on",
  slug: "ontario",
  name: "Ontario",
  shortName: "Ontario",
  country: "CA",
  curriculumName: "Ontario Curriculum",
  region: "Ontario",
  overviewLabel: "Overall expectations",
  standardLabel: "Expectation",
  sourceName: "Ontario Ministry of Education, Curriculum and Resources",
  sourceUrl: "https://www.dcp.edu.gov.on.ca/en/curriculum",
  grades: ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  subjects: ["math", "language", "science", "social", "immersion", "core-french"],
  scoringFor: (grade: GradeId) => (grade === "k" ? K_SCHEME : grade === "7" || grade === "8" || grade === "9" ? PERCENT_SCHEME : LETTER_SCHEME),
  reportCard: {
    title: "Understanding Ontario report cards",
    intro:
      "Ontario report cards describe how well a student is meeting the expectations of the Ontario Curriculum for their grade. Teachers use four levels of achievement. Level 3 is the provincial standard, and parents of students at Level 3 can be confident their child is prepared for work in the next grade.",
    facts: [
      {
        title: "Four levels, with Level 3 as the standard",
        body: "Level 1 is much below the provincial standard, Level 2 approaches it, Level 3 meets it and Level 4 surpasses it. Level 4 doesn't mean your child went beyond the expectations for the grade.",
      },
      {
        title: "Letter grades in Grades 1 to 6, percentages in Grades 7 to 9",
        body: "In Grades 1 to 6 the levels are reported as letter grades (Level 3 is a B). In Grades 7 to 9 they are reported as percentage marks (Level 3 is 70 to 79 per cent). Kindergarten doesn't use grades or marks.",
      },
      {
        title: "Three reports a year",
        body: "Families get a progress report card in the fall, then a provincial report card in winter and another near the end of June. Kindergarten families get written communications of learning instead.",
      },
      {
        title: "Learning skills are reported separately",
        body: "Six learning skills and work habits are rated apart from the marks: responsibility, organization, independent work, collaboration, initiative and self-regulation.",
      },
      {
        title: "Province-wide assessments",
        body: "The Education Quality and Accountability Office (EQAO) runs assessments in reading, writing and math in Grades 3 and 6. They are separate from report cards.",
      },
    ],
    faqs: [
      {
        q: "Is Level 1 a failing grade?",
        a: "No. Level 1 means your child is working well below the standard right now and needs more support in that area. It tells you where extra practice and a talk with the teacher will help.",
      },
      {
        q: "Is Level 3 an average grade?",
        a: "Level 3 is the provincial standard, which is the goal for every student. It is a B in Grades 1 to 6 and 70 to 79 per cent in Grades 7 to 9, and it means your child is on track.",
      },
      {
        q: "What is the difference between Level 3 and Level 4?",
        a: "Level 4 means your child shows the learning with a high degree of effectiveness. It doesn't mean they've learned things beyond their grade, and it isn't expected in every area.",
      },
      {
        q: "Does Gradelings give a Level?",
        a: "No. Gradelings shows how practice is going on the same four steps, so you can see where your child is strong and where to practise. Your child's teacher decides their level on the report card.",
      },
      {
        q: "How can I help at home?",
        a: "Ask your child's teacher which expectations to focus on, then try short, regular practice (10 to 15 minutes). Celebrate effort and progress, not just results.",
      },
    ],
  },
};
