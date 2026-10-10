import { ALBERTA } from "./alberta/framework";
import { MANITOBA } from "./manitoba/framework";
import { ONTARIO } from "./ontario/framework";
import { SASKATCHEWAN } from "./saskatchewan/framework";
import type { FrameworkId, GradeId, SubjectId } from "./types";

// Everything that differs between provinces/states lives here: names, which
// grades exist, how report cards grade students, and the report-card guide.

export interface ProficiencyLevel {
  id: string;
  label: string;
  /** Official description, shown to parents. */
  description: string;
  /** A short, friendly version for kids. */
  kidLabel: string;
  icon: string;
  colour: string;
  /** What this usually looks like at home, in plain words. */
  atHome: string;
  /** How the report card records this level, if it uses marks (e.g. "B range" or "70–79%"). */
  marks?: string;
}

export interface ScoringScheme {
  id: string;
  name: string;
  /** Lowest to highest. */
  levels: ProficiencyLevel[];
  source: string;
}

export interface ReportCardGuide {
  title: string;
  intro: string;
  facts: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export interface Framework {
  id: FrameworkId;
  /** URL slug, e.g. /curriculum/bc/ */
  slug: string;
  name: string;
  shortName: string;
  country: "CA" | "US";
  curriculumName: string;
  /** The place name used in sentences, e.g. "Ontario". */
  region: string;
  /** What this framework calls the big picture of a course, shown to parents. */
  overviewLabel: string;
  /** What this framework calls one learning standard, e.g. "Learning standard" or "Expectation". */
  standardLabel: string;
  /** Where the standards come from, shown on public pages. */
  sourceName: string;
  sourceUrl: string;
  grades: GradeId[];
  /** Subjects with content for this framework. */
  subjects: SubjectId[];
  scoringFor: (grade: GradeId) => ScoringScheme;
  reportCard: ReportCardGuide;
}

const BC_PROFICIENCY: ScoringScheme = {
  id: "bc-proficiency",
  name: "Provincial Proficiency Scale",
  source: "BC K–12 Student Reporting Policy",
  levels: [
    {
      id: "emerging",
      label: "Emerging",
      kidLabel: "Seedling",
      icon: "🌱",
      colour: "#ff9636",
      description:
        "The student demonstrates an initial understanding of the concepts and competencies relevant to the expected learning.",
      atHome: "Just getting started with this idea. Short, regular practice with lots of support helps most.",
    },
    {
      id: "developing",
      label: "Developing",
      kidLabel: "Sprout",
      icon: "🌿",
      colour: "#f5b301",
      description:
        "The student demonstrates a partial understanding of the concepts and competencies relevant to the expected learning.",
      atHome: "Understands parts of it and is building confidence. Keep practising the tricky parts.",
    },
    {
      id: "proficient",
      label: "Proficient",
      kidLabel: "Tree",
      icon: "🌳",
      colour: "#25b47e",
      description:
        "The student demonstrates a complete understanding of the concepts and competencies relevant to the expected learning.",
      atHome: "Has it! Mixed review now and then keeps it strong.",
    },
    {
      id: "extending",
      label: "Extending",
      kidLabel: "Star",
      icon: "⭐",
      colour: "#4f8ef7",
      description:
        "The student demonstrates a sophisticated understanding of the concepts and competencies relevant to the expected learning.",
      atHome: "Applies it confidently, even in new or harder situations. Try challenge mode and real-life problems.",
    },
  ],
};

export const FRAMEWORKS: Framework[] = [
  {
    id: "ca-bc",
    slug: "bc",
    name: "British Columbia",
    shortName: "BC",
    country: "CA",
    curriculumName: "BC Curriculum",
    region: "British Columbia",
    overviewLabel: "Big Ideas",
    standardLabel: "Learning standard",
    sourceName: "BC Ministry of Education and Child Care",
    sourceUrl: "https://curriculum.gov.bc.ca/",
    grades: ["k", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    subjects: ["math", "language", "science", "social", "immersion", "core-french"],
    scoringFor: () => BC_PROFICIENCY,
    reportCard: {
      title: "Understanding BC report cards",
      intro:
        "From Kindergarten to Grade 9, BC report cards describe learning with a four-point proficiency scale instead of letter grades. Each level describes where a student is right now in their learning, not a pass or fail.",
      facts: [
        {
          title: "Four levels, not letter grades",
          body: "Kindergarten to Grade 9 use Emerging, Developing, Proficient and Extending. Letter grades and percentages start in Grade 10.",
        },
        {
          title: "Several updates a year",
          body: "Families receive five communications of student learning during the year, including written learning updates and a summary report at the end of the year.",
        },
        {
          title: "Written comments matter",
          body: "Teachers add descriptive feedback: what your child can do, what they're working on, and how you can support them.",
        },
        {
          title: "Core Competencies",
          body: "Each year students reflect on the Core Competencies (Communication, Thinking, and Personal and Social) and set goals.",
        },
        {
          title: "FSA is separate",
          body: "The Foundation Skills Assessment in Grades 4 and 7 is a separate provincial check of literacy and numeracy. It isn't part of the report card.",
        },
      ],
      faqs: [
        {
          q: "Is “Emerging” a failing grade?",
          a: "No. Emerging means your child has an initial understanding and is early in their learning for that area. It's common, especially early in the year, and it tells you where extra practice will help.",
        },
        {
          q: "Is “Developing” the same as a C?",
          a: "Not exactly. The proficiency scale describes understanding, not a percentage. Developing means a partial understanding: your child can do some of it and is building toward a complete understanding.",
        },
        {
          q: "What does “Proficient” mean?",
          a: "Proficient means a complete understanding of the expected learning for the grade. It's the goal for every learning area.",
        },
        {
          q: "How is “Extending” different from Proficient?",
          a: "Extending means a sophisticated understanding: your child applies the learning confidently and flexibly, often in new situations. It isn't expected in every area.",
        },
        {
          q: "How can I help at home?",
          a: "Ask your child's teacher which learning areas to focus on, then use short, regular practice (10–15 minutes) on those skills. Celebrate effort and progress, not just results.",
        },
      ],
    },
  },
  ONTARIO,
  ALBERTA,
  SASKATCHEWAN,
  MANITOBA,
];

export const DEFAULT_FRAMEWORK: FrameworkId = "ca-bc";

export function getFramework(id: FrameworkId | string = DEFAULT_FRAMEWORK): Framework {
  return FRAMEWORKS.find((f) => f.id === id || f.slug === id) ?? FRAMEWORKS[0];
}
