import type { Framework, ProficiencyLevel, ScoringScheme } from "../frameworks";
import type { GradeId } from "../types";

// Nova Scotia. Standards are the outcomes in the Nova Scotia curriculum (Department of Education and Early Childhood
// Development, curriculum.novascotia.ca). Report-card grades come from the department's family guide "How Students
// Are Assessed". Sources and the checking record are in docs/research/nova-scotia/.

interface LevelText {
  id: string;
  kidLabel: string;
  icon: string;
  colour: string;
  atHome: string;
}

// The four practice steps are the same in every grade; only the report-card wording and marks change with the grade.
const STEPS: LevelText[] = [
  { id: "step-1", kidLabel: "Seedling", icon: "🌱", colour: "#ff9636", atHome: "Just getting started with this idea. Short, regular practice with lots of support helps most." },
  { id: "step-2", kidLabel: "Sprout", icon: "🌿", colour: "#f5b301", atHome: "Understands parts of it and is building confidence. Keep practising the tricky parts." },
  { id: "step-3", kidLabel: "Tree", icon: "🌳", colour: "#25b47e", atHome: "Has it! Mixed review now and then keeps it strong." },
  { id: "step-4", kidLabel: "Star", icon: "⭐", colour: "#4f8ef7", atHome: "Applies it confidently, even in new or harder situations. Try challenge mode and real-life problems." },
];

type Wording = [label: string, description: string, marks?: string];

function scheme(id: string, name: string, wording: [Wording, Wording, Wording, Wording]): ScoringScheme {
  return {
    id,
    name,
    source: "Nova Scotia Department of Education and Early Childhood Development",
    levels: STEPS.map(
      (step, i): ProficiencyLevel => ({ ...step, label: wording[i][0], description: wording[i][1], marks: wording[i][2] }),
    ),
  };
}

// Primary (Kindergarten) report cards use comments only, so the steps carry no marks.
const PRIMARY = scheme("ns-primary", "Practice steps (comments only)", [
  ["Beginning", "Is just starting to show this understanding and these skills, usually with a lot of support."],
  ["Developing", "Shows some of this understanding and these skills and is growing in confidence."],
  ["Meeting", "Shows the understanding and skills expected for this stage of learning."],
  ["Exceeding", "Shows the understanding and skills confidently and in new situations."],
]);

// Grades 1 to 3: WD, DE and ND. The top two steps both sit in "well developed".
const EARLY = scheme("ns-wd-de-nd", "Well developed, developing, needs development", [
  ["Needs development", "Needs development with understanding and application of concepts and skills.", "ND"],
  ["Developing as expected", "Developing as expected with understanding and application of concepts and skills.", "DE"],
  ["Well developed", "Well-developed understanding and application of concepts and skills.", "WD"],
  ["Well developed and extending", "Well-developed understanding and application of concepts and skills, used confidently in new situations.", "WD"],
]);

// Grades 4 to 6: letter grades A to D in the second and third terms (the first term uses WD, DE and ND).
const MIDDLE = scheme("ns-letters", "Letter grades A to D", [
  ["Limited", "Limited understanding and application of concepts and skills.", "D"],
  ["Basic", "Basic understanding and application of concepts and skills.", "C"],
  ["Good", "Good understanding and application of concepts and skills.", "B"],
  ["Thorough", "Thorough understanding and application of concepts and skills.", "A"],
]);

// Grades 7 to 9: percentages. Below 50 per cent has not met the minimum requirements of the course.
const PERCENT = scheme("ns-percent", "Percentages", [
  ["Minimal", "Demonstrates minimal understanding and application of concepts and skills in relation to the learning outcomes.", "50–59%"],
  ["Satisfactory", "Demonstrates satisfactory understanding and application of concepts and skills in relation to the learning outcomes.", "60–69%"],
  ["Good", "Demonstrates good understanding and application of concepts and skills in relation to the learning outcomes.", "70–79%"],
  ["Very good to excellent", "Demonstrates very good to excellent understanding and application of concepts and skills in relation to the learning outcomes.", "80–100%"],
]);

export const NOVA_SCOTIA: Framework = {
  id: "ca-ns",
  slug: "nova-scotia",
  name: "Nova Scotia",
  shortName: "Nova Scotia",
  country: "CA",
  curriculumName: "Nova Scotia Curriculum",
  region: "Nova Scotia",
  overviewLabel: "Learning focus",
  standardLabel: "Learning outcome",
  sourceName: "Nova Scotia Department of Education and Early Childhood Development",
  sourceUrl: "https://curriculum.novascotia.ca/",
  grades: ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  subjects: ["math", "language", "science", "social", "immersion", "core-french"],
  scoringFor: (grade: GradeId) => (grade === "k" ? PRIMARY : grade === "1" || grade === "2" || grade === "3" ? EARLY : grade === "4" || grade === "5" || grade === "6" ? MIDDLE : PERCENT),
  reportCard: {
    title: "Understanding Nova Scotia report cards",
    intro:
      "Nova Scotia report cards from Primary to Grade 12 have two parts: the Learner Profile, which describes social skills and work habits, and the Student Achievement section, which tells you whether your child is meeting the learning outcomes for their grade. The wording changes as children move up, from comments in Primary to percentages in Grade 7.",
    facts: [
      {
        title: "Primary has comments, not grades",
        body: "In Primary (Kindergarten), report cards describe your child's progress in language arts and mathematics in words. Pre-primary children do not receive report cards, and their early childhood educator shares updates instead.",
      },
      {
        title: "WD, DE and ND in Grades 1 to 3",
        body: "WD means a well-developed understanding and application of concepts and skills. DE means developing as expected. ND means needs development. INS means there is insufficient evidence to report. Language arts and mathematics carry comments, and science, social studies, health and the arts are woven into them.",
      },
      {
        title: "Grades 4 to 6 add letters",
        body: "In Grades 4 to 6 the first-term report uses WD, DE and ND. The second and third terms use A (thorough), B (good), C (basic) and D (limited), and add grades for Core French (or Mi'kmaw or Gaelic where offered), music and physical education.",
      },
      {
        title: "Percentages from Grade 7",
        body: "In Grades 7 to 12, each course is reported as a percentage with a description: 90 to 100 is excellent, 80 to 89 is very good, 70 to 79 is good, 60 to 69 is satisfactory and 50 to 59 is minimal. Below 50 means the minimum requirements of the course have not been met.",
      },
      {
        title: "Provincial assessments in Grades 3, 6 and 8",
        body: "Students in Grades 3, 6 and 8 write provincial assessments of reading, writing and mathematics. They show what children have learned over several years, so there is nothing to study for, and the results come in a report a few months later.",
      },
    ],
    faqs: [
      {
        q: "Is ND a failing grade?",
        a: "No. ND means your child needs development with that learning right now. It tells you where extra practice and a conversation with the teacher will help most.",
      },
      {
        q: "What is the difference between DE and WD?",
        a: "DE means your child is developing as expected, and WD means the understanding is well developed. Teachers decide using conversations, observations and the work your child creates, not one test.",
      },
      {
        q: "Does Gradelings give a grade?",
        a: "No. Gradelings shows how practice is going on four steps that line up with the report card for your child's grade, so you can see where your child is strong and where to practise. Your child's teacher decides the grade.",
      },
      {
        q: "What do provincial assessments mean for my child?",
        a: "They give teachers and the department a picture of reading, writing and mathematics in Grades 3, 6 and 8. Children do not need to study for them, and they are separate from report card grades.",
      },
      {
        q: "How can I help at home?",
        a: "Ask your child's teacher which outcomes to focus on, then try short, regular practice (10 to 15 minutes). Celebrate effort and progress, not just results.",
      },
    ],
  },
};
