import type { Framework, ProficiencyLevel, ScoringScheme } from "../frameworks";
import type { GradeId } from "../types";

// Manitoba. Standards are the learning outcomes in Manitoba's curriculum (Education and Early Childhood
// Learning, edu.gov.mb.ca). Achievement levels and report-card rules come from the Manitoba Provincial
// Report Card Policy (2026–2027 templates). Sources and the checking record are in docs/research/manitoba/.

interface LevelText {
  id: string;
  label: string;
  kidLabel: string;
  icon: string;
  colour: string;
  description: string;
  atHome: string;
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
      "Limited understanding and application of concepts and skills. The student understands some key concepts and skills and rarely makes connections to similar ones.",
    atHome: "Just getting started with this idea. Short, regular practice with lots of support helps most.",
    percent: "50–59%",
  },
  {
    id: "level-2",
    label: "Level 2",
    kidLabel: "Sprout",
    icon: "🌿",
    colour: "#f5b301",
    description:
      "Basic understanding and application of concepts and skills. The student understands most concepts and skills and occasionally makes connections to similar ones.",
    atHome: "Understands parts of it and is building confidence. Keep practising the tricky parts.",
    percent: "60–69%",
  },
  {
    id: "level-3",
    label: "Level 3",
    kidLabel: "Tree",
    icon: "🌳",
    colour: "#25b47e",
    description:
      "Good understanding and application of concepts and skills. The student understands most concepts and skills, often makes connections to similar ones and sometimes applies them to their own life and to new learning.",
    atHome: "Has it! Mixed review now and then keeps it strong.",
    percent: "70–79%",
  },
  {
    id: "level-4",
    label: "Level 4",
    kidLabel: "Star",
    icon: "⭐",
    colour: "#4f8ef7",
    description:
      "Very good to excellent understanding and application of concepts and skills. The student thoroughly understands all or nearly all concepts and skills, routinely makes connections to similar ones and applies them creatively to their own life and to new learning.",
    atHome: "Applies it confidently, even in new or harder situations. Try challenge mode and real-life problems.",
    percent: "80–100%",
  },
];

function scheme(id: string, name: string, marks: boolean): ScoringScheme {
  return {
    id,
    name,
    source: "Manitoba Provincial Report Card Policy",
    levels: LEVELS.map(({ percent, ...level }): ProficiencyLevel => ({ ...level, marks: marks ? percent : undefined })),
  };
}

// Kindergarten has no provincial report card. Grades 1 to 6 report levels only. Grades 7 to 9 add percentages.
const K_SCHEME = scheme("mb-levels-k", "Levels (practice only)", false);
const LEVELS_SCHEME = scheme("mb-levels", "Levels 1 to 4", false);
const PERCENT_SCHEME = scheme("mb-levels-percent", "Levels 1 to 4 and percentages", true);

export const MANITOBA: Framework = {
  id: "ca-mb",
  slug: "manitoba",
  name: "Manitoba",
  shortName: "Manitoba",
  country: "CA",
  curriculumName: "Manitoba Curriculum",
  region: "Manitoba",
  overviewLabel: "Learning focus",
  standardLabel: "Learning outcome",
  sourceName: "Manitoba Education and Early Childhood Learning",
  sourceUrl: "https://www.edu.gov.mb.ca/k12/framework/",
  grades: ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  subjects: ["math", "language", "science", "social", "immersion", "core-french"],
  scoringFor: (grade: GradeId) => (grade === "k" ? K_SCHEME : grade === "7" || grade === "8" || grade === "9" ? PERCENT_SCHEME : LEVELS_SCHEME),
  reportCard: {
    title: "Understanding Manitoba report cards",
    intro:
      "The Manitoba provincial report card describes how a student is doing on the learning outcomes of the Manitoba curriculum. Teachers use four levels, and Level 3 describes a good understanding of the concepts and skills. The report card is written in plain language and adds the teacher's own comments about strengths and next steps.",
    facts: [
      {
        title: "Four levels, plus Not Yet Demonstrated",
        body: "Level 4 is very good to excellent, Level 3 is good, Level 2 is basic and Level 1 is limited. NYD (Not Yet Demonstrated) is used in rare cases when a student has not yet shown the required understanding.",
      },
      {
        title: "Levels in Grades 1 to 6, percentages from Grade 7",
        body: "In Grades 1 to 6 each part of a subject gets a level and there are no percentage marks. In Grades 7 and 8 the levels are joined by an overall percentage, and in Grade 9 and up the report card uses percentages (Level 3 is 70 to 79 per cent). Kindergarten does not use the provincial report card.",
      },
      {
        title: "Three reports a year",
        body: "In most schools, families get a Term 1 report, a Term 2 report and a final June report. Some Grade 9 courses are semestered, with a midterm and a final report in each semester.",
      },
      {
        title: "Learning skills are reported separately",
        body: "Personal management, active participation in learning and social responsibility are rated Consistently, Usually, Sometimes or Rarely. French Immersion report cards add engagement in using French. These ratings are separate from the academic levels, and effort and behaviour are not part of the levels.",
      },
      {
        title: "Early reading screening",
        body: "From Kindergarten to Grade 4, Term 1 and Term 2 report cards can also show early reading screening as meeting the benchmark or not yet meeting it. It helps teachers plan support and is not a diagnosis.",
      },
    ],
    faqs: [
      {
        q: "Is Level 1 a failing grade?",
        a: "No. Level 1 means your child shows a limited understanding of the concepts right now, and teachers add comments about the support that will help. It tells you where extra practice and a conversation with the teacher are worthwhile.",
      },
      {
        q: "What does Level 3 mean?",
        a: "Level 3 means a good understanding and application of the concepts and skills for the grade. In Grades 7 and 8 and in Grade 9 it matches a mark of 70 to 79 per cent.",
      },
      {
        q: "What is the difference between Level 3 and Level 4?",
        a: "Level 4 means a very good to excellent understanding: your child makes connections routinely and applies learning creatively to new situations. It is not expected in every area.",
      },
      {
        q: "Does Gradelings give a Level?",
        a: "No. Gradelings shows how practice is going on the same four steps, so you can see where your child is strong and where to practise. Your child's teacher decides their level on the report card.",
      },
      {
        q: "How can I help at home?",
        a: "Ask your child's teacher which learning outcomes to focus on, then try short, regular practice (10 to 15 minutes). Celebrate effort and progress, not just results.",
      },
    ],
  },
};
