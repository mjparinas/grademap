import { FRAMEWORKS } from "./frameworks";
import { ONTARIO_GUIDES } from "./ontario/guides";
import type { AgeBand, FrameworkId, GradeId, SubjectId } from "./types";

// Parent-facing guide copy that differs by province. Like frameworks.ts, this is
// the only place BC-specific guide wording lives; the pages read it from here.

export interface Competency {
  id: string;
  name: string;
  blurb: string;
  /** The official sub-competencies, if the framework has them. */
  parts: { name: string; blurb: string }[];
  atHome: string[];
}

export interface Assessment {
  /** URL segment, e.g. "fsa" or "eqao". */
  slug: string;
  /** Short name used in links and headings, e.g. "FSA". */
  short: string;
  /** Who runs it and where the current dates are published, for the "dates change" note. */
  source: string;
  /** One line for the guides hub. */
  hubBlurb: string;
  name: string;
  intro: string;
  /** Grades that write it. */
  grades: GradeId[];
  facts: { title: string; body: string }[];
  prepare: string[];
  faqs: { q: string; a: string }[];
}

export interface GradeNote {
  /** One or two sentences on what the year feels like. */
  overview: string;
  /** What parents commonly see on the report card or notice at home. */
  lookFor: string;
}

export interface FrenchGuide {
  title: string;
  intro: string;
  /** Finishes the meta description, e.g. when each program starts. */
  metaTail: string;
  /** Grades to link for "browse the French lessons". */
  browse: GradeId[];
  /** Core French and French Immersion side by side. */
  compare: { title: string; core: string; immersion: string }[];
  sections: { title: string; body: string }[];
  atHome: string[];
  faqs: { q: string; a: string }[];
}

export interface FrameworkGuides {
  /** Not every province has a French guide yet. */
  french?: FrenchGuide;
  competencies: {
    /** URL segment, e.g. "core-competencies" or "learning-skills". */
    slug: string;
    /** Short name used in links and breadcrumbs, e.g. "Core Competencies". */
    label: string;
    /** One line for the guides hub. */
    hubBlurb: string;
    /** Meta description. */
    description: string;
    /** Sentence for grade pages, ending in a link to the guide. */
    gradeLine: string;
    /** Closing note on the guide page. */
    closing: string;
    title: string;
    intro: string;
    items: Competency[];
    faqs: { q: string; a: string }[];
  };
  assessment: Assessment;
  /** Only for grades the framework covers. */
  gradeNotes: Partial<Record<GradeId, GradeNote>>;
}

/** Short home activities, by subject and age band. Not tied to a province. */
export const HOME_TIPS: Record<SubjectId, Record<AgeBand, string[]>> = {
  math: {
    little: [
      "Count everyday things out loud: stairs, grapes, steps to the car.",
      "Sort laundry or toys into groups, then ask which group has more.",
      "Spot shapes on a walk: circles on signs, rectangles on doors.",
      "Make patterns with snacks or blocks (red, blue, red, blue) and let your child continue them.",
    ],
    middle: [
      "Practise math facts in short bursts, such as five minutes while dinner cooks.",
      "Let your child handle small cash purchases, working out the change in multiples of 5¢.",
      "Cook together and double or halve a recipe.",
      "Ask “How do you know?” after an answer, even when it is right.",
    ],
    big: [
      "Look for fractions, decimals and percentages in sale signs, sports statistics and recipes.",
      "Ask your child to explain a problem to you as if you were the student.",
      "Estimate first (the bill, the trip time), then check with a calculator.",
      "Keep a tricky-problems list and revisit it every few days instead of re-doing everything.",
    ],
  },
  language: {
    little: [
      "Read aloud every day and let your child finish familiar phrases.",
      "Play with sounds: “What starts with /b/? What rhymes with cat?”",
      "Point out letters on signs, cereal boxes and the street.",
      "Ask your child to tell you a story about their drawing, and write down a sentence or two.",
    ],
    middle: [
      "Take turns reading a page aloud, and chat about what happened and why.",
      "Keep a short journal, with one or two sentences a day to start.",
      "Hunt for a new word a day and use it at dinner.",
      "Ask for a prediction before turning the page: “What do you think happens next?”",
    ],
    big: [
      "Read what they are interested in: graphic novels, sports pages, series. Then talk about it.",
      "Ask for the main idea and one piece of evidence from the text.",
      "Have them write real messages: a thank-you note, a short review, a note to a relative.",
      "Read their writing aloud to them; they often spot their own mistakes by ear.",
    ],
  },
  science: {
    little: [
      "Go on a nature walk and name what you see: leaves, bugs, clouds, puddles.",
      "Plant a bean seed and check it together each day.",
      "Ask “What do you notice?” before you explain anything.",
      "Talk about the weather each morning and what to wear for it.",
    ],
    middle: [
      "Try a kitchen experiment, such as what dissolves in water and what floats or sinks.",
      "Keep a simple weather or moon log for a month.",
      "Ask “What do you think will happen?” and then test it.",
      "Visit a park, beach or creek and look for living things and their habitats.",
    ],
    big: [
      "Turn everyday questions into investigations: “Which paper towel holds the most water?”",
      "Read a science news story together and ask what evidence it gives.",
      "Look up how a household machine works, such as a bike gear, a lamp or a fridge.",
      "Have your child draw and label a diagram of something they just learned.",
    ],
  },
  social: {
    little: [
      "Talk about your family, your neighbourhood and the people who help in it.",
      "Make a simple map of your home or street together.",
      "Share a family tradition or story and ask your child to share one back.",
      "Practise taking turns and sharing, and talk about why fairness matters.",
    ],
    middle: [
      "Look at a map of your community and find places you visit.",
      "Ask an older relative or neighbour what the area was like when they were young.",
      "Read stories from many communities, including Indigenous authors, and talk about what is the same and different.",
      "Talk about how rules and jobs help a community work.",
    ],
    big: [
      "Follow a current event together and ask who is affected and why people see it differently.",
      "Build a timeline of a family event or a historical topic they are studying.",
      "Use an atlas or online map to trace a trade or travel route.",
      "Ask “Whose voice is missing from this story?” when reading about the past.",
    ],
  },
  immersion: {
    little: [
      "Read French picture books together, even if you are learning too. Let your child tell you what is happening.",
      "Sing French songs and nursery rhymes in the car or at bath time.",
      "Name things around the house in French, and ask your child to teach you the words.",
      "Clap the syllables in French words and play “What rhymes with chat?”",
    ],
    middle: [
      "Read a short French book or comic together a few times a week, and talk about it in either language.",
      "Ask your child to teach you one new French word or grammar rule a day.",
      "Watch a French show with the French subtitles on, then retell the story.",
      "Keep a short French journal: one or two sentences a day.",
    ],
    big: [
      "Read French novels, comics or articles on topics your child enjoys.",
      "Ask your child to explain a grammar rule to you, with an example.",
      "Have your child write a short French note or message to a relative or pen pal.",
      "Use a French dictionary or conjugation tool together when revising a draft.",
    ],
  },
  "core-french": {
    little: [
      "Learn a few French words together, like bonjour, merci and au revoir.",
      "Sing a French song and clap along.",
      "Name colours and animals in French.",
      "Greet each other in French at breakfast.",
    ],
    middle: [
      "Learn a few French words together, like bonjour, merci and au revoir.",
      "Label things around the house with French sticky notes.",
      "Count in French while climbing the stairs.",
      "Play a French game or watch a short French video together.",
    ],
    big: [
      "Practise a few minutes a day: greetings, numbers, then simple sentences about yourself.",
      "Say your answers out loud in French, even if you are not sure. Speaking is how it sticks.",
      "Watch French videos with subtitles and spot words that look like English (cognates).",
      "Look up a Francophone festival or community in Canada and share one thing you learned.",
    ],
  },
};

const BC_GUIDES: FrameworkGuides = {
  competencies: {
    slug: "core-competencies",
    label: "Core Competencies",
    hubBlurb: "Communication, Thinking, and Personal and Social, in plain words.",
    description:
      "What the three BC Core Competencies mean (Communication, Thinking, and Personal and Social), how they show up on the report card, and simple ways to support them at home.",
    gradeLine: "Core Competencies are part of every grade.",
    closing: "Core Competencies grow through conversation, projects and play.",
    title: "BC Core Competencies on the report card, explained for parents",
    intro:
      "Alongside subjects like math and science, the BC curriculum has three Core Competencies: Communication, Thinking, and Personal and Social. They are the skills students use to learn anything. Students think about their own growth in them, usually with a short self-assessment, and teachers refer to them in report card comments.",
    items: [
      {
        id: "communication",
        name: "Communication",
        blurb: "Sharing ideas and information, and working with others.",
        parts: [
          { name: "Communicating", blurb: "Explaining, listening, asking questions and sharing ideas in speech, writing, art or other ways." },
          { name: "Collaborating", blurb: "Working with others to plan, share jobs and solve problems together." },
        ],
        atHome: [
          "Ask your child to explain how they got an answer, not only what it was.",
          "Give them a real audience: a family update, a grocery list, a short talk at dinner.",
          "Play a board game or build something together, and talk about how you shared the jobs.",
        ],
      },
      {
        id: "thinking",
        name: "Thinking",
        blurb: "Having ideas, asking questions and judging information.",
        parts: [
          { name: "Creative Thinking", blurb: "Coming up with new ideas, trying them out and building on the ideas of others." },
          { name: "Critical and Reflective Thinking", blurb: "Questioning, weighing evidence, and thinking about what worked and what to change." },
        ],
        atHome: [
          "Ask “What else could we try?” when something doesn't work.",
          "Ask how they know something is true, and where they could check.",
          "After a project or game, ask what went well and what they'd do differently.",
        ],
      },
      {
        id: "personal-social",
        name: "Personal and Social",
        blurb: "Knowing yourself, looking after yourself and caring about others.",
        parts: [
          { name: "Positive Personal and Cultural Identity", blurb: "Knowing your strengths, your story and the communities you belong to." },
          { name: "Personal Awareness and Responsibility", blurb: "Setting goals, managing feelings and staying with a challenge." },
          { name: "Social Awareness and Responsibility", blurb: "Caring about others, respecting differences and helping make things better." },
        ],
        atHome: [
          "Let your child set a small goal for the week and check in on it together.",
          "Name the effort you see: “You kept going even when it was hard.”",
          "Talk about family stories and traditions, and ask how others see things differently.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are Core Competencies graded?",
        a: "No. Students reflect on them, often with a short self-assessment and a goal, and teachers may comment on them. They aren't marked on the Emerging to Extending scale the way subject learning is.",
      },
      {
        q: "What are the BC Core Competencies?",
        a: "There are three: Communication, Thinking, and Personal and Social. Each has smaller parts. Communication includes Communicating and Collaborating. Thinking includes Creative Thinking and Critical and Reflective Thinking. Personal and Social includes Positive Personal and Cultural Identity, Personal Awareness and Responsibility, and Social Awareness and Responsibility.",
      },
      {
        q: "Does GradeMap measure Core Competencies?",
        a: "No. GradeMap practises subject skills in math, language arts, science and social studies and shows how they match the report card scale. Core Competencies grow through conversation, projects, teamwork and play, so we suggest home activities rather than scores.",
      },
      {
        q: "How can I help my child with their self-assessment?",
        a: "Ask open questions: What are you proud of? What was tricky? What is one thing you want to get better at? Then let your child use their own words. Teachers care more about honest reflection than a polished answer.",
      },
    ],
  },
  french: {
    metaTail: "Core French starts in Grade 5; French Immersion usually starts in Kindergarten or Grade 1.",
    browse: ["5", "k"],
    title: "Core French and French Immersion in BC: a guide for parents",
    intro:
      "Many BC families wonder how Core French and French Immersion differ, when each starts, and how to help at home if you don't speak French. Both follow the BC curriculum, and GradeMap practises both as optional subjects you can switch on for each child.",
    compare: [
      { title: "What it is", core: "French as one school subject, taught a few times a week alongside classes in English.", immersion: "A program where much of the school day, including subjects such as math and science, is taught in French." },
      { title: "When it starts", core: "Core French starts in Grade 5 in BC.", immersion: "Early French Immersion usually begins in Kindergarten or Grade 1. Some districts also offer late immersion, often in Grade 6." },
      { title: "Who it suits", core: "Every child can learn some French. No earlier French is needed.", immersion: "Families who want their child to become fluent. Programs and entry points differ by district, so check with yours." },
      { title: "Name in the curriculum", core: "BC Core French", immersion: "Français langue seconde – immersion" },
      { title: "In GradeMap", core: "Grades 5 to 9. Prompts are in English, with French words and sentences to read, choose and build.", immersion: "Kindergarten to Grade 9. Prompts and stories are in French, with English hints for parents." },
    ],
    sections: [
      { title: "What Core French children learn", body: "Core French builds everyday communication: greetings, numbers, family, school, food, weather, hobbies and describing people and places. In the upper grades children start to write short texts, use common verbs and ask and answer questions. The aim is confidence with simple, real conversations." },
      { title: "What French Immersion children learn", body: "In immersion, children learn to listen, speak, read and write in French, and learn other subjects in French too. Younger children start with songs, stories and routines, then move on to sentences, paragraphs and longer texts as the grades go on. English reading and writing are taught as well. How much is in French in each grade depends on the school district." },
      { title: "How report cards describe French", body: "French is reported on the same four-level scale as other subjects: Emerging, Developing, Proficient and Extending. Teachers look at listening, speaking, reading and writing together. GradeMap shows practice, not a report card mark, so ask your child's teacher what the level means for your child." },
      { title: "Helping if you don't speak French", body: "You don't need French to help. Ask your child to teach you a word each day, listen while they read aloud, and celebrate effort over accuracy. Mistakes are a normal part of learning a language." },
      { title: "How GradeMap fits in", body: "French is off by default. A parent can switch on Immersion, Core French or both for each child in Settings, under Subjects. French is not counted toward the Grade Champion trophy, and French lessons are read aloud with a French voice from your device. You can pick that voice in Settings." },
    ],
    atHome: [
      "Pick one new French word each day and use it at dinner or on the way to school.",
      "Label a few household objects with sticky notes in French.",
      "Listen to French songs or watch a short French video together and talk about what you noticed.",
      "Ask your child to read a page aloud in French, then retell it to you in English.",
      "Play a French game: count stairs, name colours, or spell a word out loud.",
    ],
    faqs: [
      { q: "When does Core French start in BC?", a: "Core French begins in Grade 5. Your school or district can tell you how much time it gets each week." },
      { q: "Can my child start French Immersion later?", a: "Some districts offer late immersion, often starting in Grade 6, and some have limited spaces in other grades. Entry rules differ, so ask your district office." },
      { q: "Will French Immersion hurt my child's English?", a: "English reading and writing are still taught in immersion, and research has generally found that immersion students do well in English. If you are worried, talk with your child's teacher." },
      { q: "Do French marks count toward the Grade Champion trophy in GradeMap?", a: "No. French is a separate, optional set of subjects. Children earn their own French trophies instead." },
      { q: "Does GradeMap replace French class?", a: "No. It gives short, kind practice that matches the topics in the BC curriculum. It doesn't replace a teacher, and its levels are not a report card mark." },
    ],
  },
  assessment: {
    slug: "fsa",
    short: "FSA",
    source: "the Ministry of Education and Child Care",
    hubBlurb: "The Grade 4 and Grade 7 Foundation Skills Assessment.",
    name: "Foundation Skills Assessment (FSA)",
    intro:
      "The Foundation Skills Assessment is an annual provincial check of literacy and numeracy that students in Grades 4 and 7 take in BC. For many students it is the first provincial assessment they write. It is separate from the report card and from class marks.",
    grades: ["4", "7"],
    facts: [
      { title: "Who takes it", body: "Students in Grades 4 and 7. Parents can ask their school if they have questions about their child taking part." },
      { title: "What it covers", body: "Literacy (reading and writing) and numeracy, in line with the BC curriculum." },
      { title: "When", body: "Most students write it in the fall. Schools set their own dates within a window the Ministry of Education and Child Care announces each year (for example, early October to mid-November in 2025)." },
      { title: "How results are described", body: "Results are reported in three levels: Emerging, On Track and Extending. They are not the four report card levels, and they are not letter grades or percentages." },
      { title: "Report card link", body: "FSA results do not change a student's report card. They give families and schools one more snapshot of reading, writing and numeracy." },
    ],
    prepare: [
      "Keep routines simple: regular sleep, a good breakfast and a calm morning.",
      "Read together often, then ask your child to retell what happened and explain why.",
      "Encourage short daily writing: a journal line, a note or a postcard.",
      "Practise numeracy with real problems (shopping, cooking, travel times) as well as number facts.",
      "Tell your child it is a check of what they know, not a test they can fail.",
    ],
    faqs: [
      {
        q: "What does FSA stand for?",
        a: "Foundation Skills Assessment. It is BC's annual provincial check of literacy and numeracy for Grade 4 and Grade 7 students.",
      },
      {
        q: "Is the FSA part of my child's report card?",
        a: "No. It is separate from the report card. Your child's report card describes learning in the classroom through the year using the four-level proficiency scale.",
      },
      {
        q: "Should my child study for the FSA?",
        a: "Cramming isn't needed. The FSA checks skills built over years. Short, regular practice in reading, writing and math is more helpful than a last-minute push, and so is a calm, positive attitude.",
      },
      {
        q: "What do FSA levels mean?",
        a: "Results use Emerging, On Track and Extending. On Track means your child is meeting expectations for the grade in that area. Emerging means they're still building the skill. Extending means they're going beyond. Talk with your child's teacher about what the result means for your child.",
      },
      {
        q: "Can GradeMap help my child get ready?",
        a: "GradeMap practises the numeracy and language arts skills taught in Grades 4 and 7 with kind feedback and no timers unless you want them. It isn't a copy of the FSA and doesn't predict a result.",
      },
    ],
  },
  gradeNotes: {
    k: {
      overview: "Kindergarten in BC is play-based. Children learn through exploring, talking, building and drawing, and teachers describe learning through observations and portfolios as well as written comments.",
      lookFor: "Expect comments about friendships, listening, early letters and sounds, counting, and how your child shares ideas. It's a time to see what your child is curious about.",
    },
    "1": {
      overview: "Grade 1 is where reading, writing and number sense start to grow quickly. Children connect letters to sounds, read short books, write simple sentences and work with numbers to 20 and beyond.",
      lookFor: "Look for comments on reading simple texts, spelling common words, counting and adding, and taking part in class.",
    },
    "2": {
      overview: "In Grade 2, reading becomes smoother and writing gets longer. Math moves into place value, adding and subtracting to 100, and measuring. Science and social studies build on local places and living things.",
      lookFor: "Look for fluent reading, longer writing, adding and subtracting with trading, and the ability to explain thinking.",
    },
    "3": {
      overview: "Grade 3 is a bridge year. Students read to learn as well as learning to read, start multiplication and division, and work with fractions, in the context of communities and the natural world.",
      lookFor: "Look for comments about reading comprehension, paragraph writing, understanding multiplication and division, and fractions. (Memorizing multiplication facts isn’t expected until later grades.)",
    },
    "4": {
      overview: "Grade 4 raises the pace on reading, writing and number work with larger numbers, multiplication, fractions and decimals. Students in Grade 4 also take the Foundation Skills Assessment.",
      lookFor: "Look for comments on reading for meaning, organized paragraphs, fractions and decimals, and the FSA, which is separate from the report card.",
    },
    "5": {
      overview: "In Grade 5, students deepen their number sense with decimals, fractions and multi-digit operations, write longer pieces and do more research in science and social studies.",
      lookFor: "Look for comments on problem solving, supporting ideas with evidence, and independent research.",
    },
    "6": {
      overview: "Grade 6 pushes towards more abstract thinking: an introduction to ratios and percents, multiplying and dividing decimals, factors and multiples, one-step equations, longer writing and more independent study.",
      lookFor: "Look for comments about organization, explaining reasoning in math (including ratios and percents) and writing with evidence.",
    },
    "7": {
      overview: "Grade 7 is the last elementary year in many BC schools and prepares students for secondary school. Students take the Foundation Skills Assessment, and work on integers, the links between decimals, fractions, ratios and percents, two-step equations, circles and deeper analysis of what they read.",
      lookFor: "Look for comments on independence, study habits and confidence with the harder math and reading ahead.",
    },
    "8": {
      overview: "Grade 8 is the first year of secondary school in many BC districts. Students work with fraction operations, squares and roots, ratios and rates, linear equations, the Pythagorean theorem and surface area and volume, and they study cells, particles and plate tectonics.",
      lookFor: "Look for comments on managing a heavier workload, showing steps in math and supporting an argument with evidence from a text.",
    },
    "9": {
      overview: "Grade 9 builds towards the graduation years. Students work with rational numbers, exponent laws, polynomials, multi-step equations and linear relations, explore atoms, electric current and ecosystems, and study the Enlightenment, industrialization and Canada's story.",
      lookFor: "Look for comments on planning ahead for course choices, explaining reasoning in math and weighing perspectives in social studies and English.",
    },
  },
};

/** Guides are written per jurisdiction. Frameworks without an entry have no guide pages yet. */
export const GUIDES: Partial<Record<FrameworkId, FrameworkGuides>> = { "ca-bc": BC_GUIDES, "ca-on": ONTARIO_GUIDES };

export const GUIDE_FRAMEWORKS = FRAMEWORKS.filter((f) => GUIDES[f.id]);

export function guidesFor(id: FrameworkId): FrameworkGuides {
  const g = GUIDES[id];
  if (!g) throw new Error(`No parent guides for ${id}`);
  return g;
}
