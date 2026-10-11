import type { Framework, ProficiencyLevel, ScoringScheme } from "../frameworks";
import type { GradeId } from "../types";

// New Brunswick (anglophone sector). Standards are the skill descriptors of the New Brunswick curriculum (Department of
// Education and Early Childhood Development, curriculum.nbed.ca), cited by strand and big idea. Report-card levels come from
// the department's guidelines "Assessing, Evaluating, Reporting" for Kindergarten to Grade 8 and for Grades 9 to 12.
// Sources and the checking record are in docs/research/new-brunswick/.

interface LevelText {
  id: string;
  kidLabel: string;
  icon: string;
  colour: string;
  atHome: string;
}

// The four practice steps are the same in every grade; only the report-card wording changes with the grade.
const STEPS: LevelText[] = [
  { id: "step-1", kidLabel: "Seedling", icon: "🌱", colour: "#ff9636", atHome: "Just getting started with this idea. Short, regular practice with lots of support helps most." },
  { id: "step-2", kidLabel: "Sprout", icon: "🌿", colour: "#f5b301", atHome: "Understands parts of it and is building confidence. Keep practising the tricky parts." },
  { id: "step-3", kidLabel: "Tree", icon: "🌳", colour: "#25b47e", atHome: "Has it! Mixed review now and then keeps it strong." },
  { id: "step-4", kidLabel: "Star", icon: "⭐", colour: "#4f8ef7", atHome: "Applies it confidently, even in new or harder situations. Try challenge mode and real-life problems." },
];

type Wording = [label: string, description: string, marks?: string];

function scheme(id: string, name: string, source: string, wording: [Wording, Wording, Wording, Wording]): ScoringScheme {
  return {
    id,
    name,
    source,
    levels: STEPS.map(
      (step, i): ProficiencyLevel => ({ ...step, label: wording[i][0], description: wording[i][1], marks: wording[i][2] }),
    ),
  };
}

// Kindergarten to Grade 8: the provincial four-point achievement scale. A "+" (3+ and 4+) marks more consistent work.
const K8 = scheme("nb-k8", "Provincial four-point scale", "New Brunswick Department of Education and Early Childhood Development: Assessing, Evaluating, Reporting K–8", [
  ["Working below", "Has a limited understanding of the skill descriptors so far and rarely applies learning. Significant improvement is needed in specific areas, and interventions are necessary.", "1"],
  ["Approaching", "Has some understanding of the skill descriptors so far and, with support, applies learning to familiar situations. Work on identified learning gaps is needed.", "2"],
  ["Meeting", "Has a solid understanding of the skill descriptors so far and often applies learning to familiar situations. On track to reach the end-of-year learning goals.", "3 or 3+"],
  ["Excelling", "Has a thorough understanding of the skill descriptors so far and consistently applies learning to new situations.", "4 or 4+"],
]);

// Grade 9: high school reporting. Each course gets a numerical grade; comments describe how the learner is doing against the outcomes.
const HIGH_SCHOOL = scheme("nb-912", "Curriculum expectations", "New Brunswick Department of Education and Early Childhood Development: Assessing, Evaluating, Reporting Grades 9–12", [
  ["Working below", "Has a limited understanding of the outcomes so far and rarely applies learning. Significant improvement is needed to be successful in the course."],
  ["Approaching", "Has some understanding of the outcomes so far and, with support, applies learning to familiar situations. Work on identified learning gaps is needed."],
  ["Meeting", "Meets the learning expectations, applying the key concepts, processes and skills independently to familiar situations."],
  ["Exceeding", "Has a thorough understanding of the outcomes so far and consistently applies learning to new situations. Work goes beyond the descriptors for “meeting”."],
]);

export const NEW_BRUNSWICK: Framework = {
  id: "ca-nb",
  slug: "new-brunswick",
  name: "New Brunswick",
  shortName: "New Brunswick",
  country: "CA",
  curriculumName: "New Brunswick Curriculum",
  region: "New Brunswick",
  overviewLabel: "Learning focus",
  standardLabel: "Skill descriptor",
  sourceName: "New Brunswick Department of Education and Early Childhood Development",
  sourceUrl: "https://curriculum.nbed.ca/",
  grades: ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  subjects: ["math", "language", "science", "social", "immersion", "core-french"],
  scoringFor: (grade: GradeId) => (grade === "9" ? HIGH_SCHOOL : K8),
  reportCard: {
    title: "Understanding New Brunswick report cards",
    intro:
      "Anglophone-sector report cards from Kindergarten to Grade 8 use one four-point scale for every subject, reported three times a year (November, March and June). A separate section reports five learning habits. In Grade 9 and beyond, each course also receives a numerical grade.",
    facts: [
      {
        title: "A four-point scale, Kindergarten to Grade 8",
        body: "4 means excelling, 3 means meeting, 2 means approaching and 1 means working below the learning goals for the grade. A “+” on a 3 or a 4 (3+ and 4+) shows work that is more consistent or independent. The scale is reported by strand, such as Number or Reading, so you can see where your child is strong.",
      },
      {
        title: "Skill descriptors and learning goals",
        body: "The curriculum describes what learners can do in skill descriptors that sit under big ideas in each strand. The levels on the report card show how your child is doing against these skill descriptors so far and whether they are on track to reach the end-of-year learning goals.",
      },
      {
        title: "Learning habits",
        body: "Independence, initiative, interactions, organization and responsibility are reported from Kindergarten to Grade 8. Each has observable indicators, such as asking for help when needed, working well with others and completing work on time. They are not part of the subject levels.",
      },
      {
        title: "NA, a blank box and learning plans",
        body: "NA means there is not enough evidence yet to give a level. A blank box means the strand has not been taught in that reporting period. PLP-ADJ and IND show that a personalized learning plan adjusts or individualizes the goals.",
      },
      {
        title: "Grades 9 to 12",
        body: "High school report cards give each course a numerical grade each quarter or semester, with comments such as meeting or approaching curriculum expectations. Check your school’s report card for how Grade 9 is reported.",
      },
    ],
    faqs: [
      {
        q: "What is the difference between a 4 and a 4+?",
        a: "A 4 is very strong work for the grade level, applied to new situations. A 4+ means that, in addition, the learner’s work goes beyond grade-level expectations.",
      },
      {
        q: "What does a 3+ mean?",
        a: "Both 3 and 3+ show appropriate learning for the grade. A 3+ means your child is doing it more consistently and independently in familiar situations.",
      },
      {
        q: "Does Gradelings give a grade?",
        a: "No. Gradelings shows how practice is going on four steps that line up with the report card for your child’s grade, so you can see where your child is strong and where to practise. Your child’s teacher decides the level.",
      },
      {
        q: "What if there is an NA or a blank box?",
        a: "NA means there was not enough evidence to give a level yet, for example in a subject taught once a week. A blank box means the strand has not been taught in that reporting period.",
      },
      {
        q: "How can I help at home?",
        a: "Ask your child’s teacher which skill descriptors to focus on, then try short, regular practice (10 to 15 minutes). Celebrate effort and progress, not just results.",
      },
    ],
  },
};
