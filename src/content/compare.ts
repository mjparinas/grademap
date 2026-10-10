// "Gradelings vs X" pages. Facts about other products come from their public pages
// and app store listings (see docs/research/competitors.md) and are dated, because
// prices and features change. Keep the wording factual and fair, and re-check
// every figure when you change PRICE_CHECKED.

export const PRICE_CHECKED = "October 2026";

export interface Competitor {
  slug: string;
  name: string;
  /** One line for lists and search snippets. */
  summary: string;
  who: string;
  goodAt: string[];
  /** How they differ from us, written as plain facts. */
  differences: { topic: string; them: string; us: string }[];
  /** Pick them if... / pick us if... */
  chooseThem: string[];
  chooseUs: string[];
  sources: { label: string; url: string }[];
  faqs: { q: string; a: string }[];
}

export const COMPETITORS: Competitor[] = [
  {
    slug: "ixl",
    name: "IXL",
    summary: "IXL is a large, paid skill-practice site for Math, English, Science and more, with a SmartScore for each skill.",
    who: "Families who want a very large bank of skills to practise, and who are comfortable with a score that rises with correct streaks.",
    goodAt: [
      "A very large library of skills across many grades.",
      "Standards pages that list its skills by province, including British Columbia.",
      "Detailed analytics for parents and teachers.",
    ],
    differences: [
      {
        topic: "Price",
        them: `IXL Canada lists C$12.95 a month for one subject, C$19.95 for Math and English together, and C$24.95 for All Access, as of ${PRICE_CHECKED}. The free tier limits how many questions a child can answer each day.`,
        us: "One family plan covers up to 4 children and every subject. There is a 30-day free trial with no card, and the first 2 units of every course stay free afterwards.",
      },
      {
        topic: "How progress is shown",
        them: "SmartScore rises as kids answer correctly in a row and falls on mistakes. Common Sense Media notes that some children find this stressful.",
        us: "Wrong answers get a hint and another try. Only first-try answers count towards accuracy, and stars never go down. Progress is reported in your province's report-card levels (BC: Emerging, Developing, Proficient and Extending; Ontario: Levels 1 to 4; Alberta: four practice steps, since the province has no single scale).",
      },
      {
        topic: "Report card language",
        them: "Reports are organized around skills and scores.",
        us: "Reports use the words on your province's report card (BC, Ontario or Alberta), with a plain-language “at home” note for each level.",
      },
      {
        topic: "Games and offline use",
        them: "Practice is on the website and in its apps.",
        us: "Learning earns time in built-in games. The kids' app works offline once opened.",
      },
    ],
    chooseThem: ["You want the widest range of skills and grades in one place.", "Your child likes working towards a score."],
    chooseUs: [
      "You want practice that follows the BC, Ontario or Alberta curriculum and speaks the language of your child's report card.",
      "You'd like a gentler feel, with hints, retries and no scores that go down.",
      "You have more than one child and want one price.",
    ],
    sources: [
      { label: "IXL Canada family pricing", url: "https://ca.ixl.com/membership/family/pricing" },
      { label: "IXL British Columbia math standards", url: "https://ca.ixl.com/standards/british-columbia/math" },
      { label: "Common Sense Media review of IXL", url: "https://www.commonsensemedia.org/website-reviews/ixl" },
    ],
    faqs: [
      {
        q: "Is Gradelings a good alternative to IXL for BC, Ontario and Alberta families?",
        a: "It can be, depending on what you want. IXL has a much larger skill library. Gradelings is smaller and built around the BC, Ontario and Alberta curricula, their report-card levels, a gentler hint-and-retry style and one family price.",
      },
      {
        q: "Does Gradelings have a SmartScore?",
        a: "No. Gradelings shows each unit on your province's report-card scale (BC: Emerging, Developing, Proficient, Extending; Ontario: Levels 1 to 4; Alberta: four practice steps) based on recent first-try accuracy. It says clearly that this reflects practice, not a report card mark.",
      },
    ],
  },
  {
    slug: "khan-academy",
    name: "Khan Academy",
    summary: "Khan Academy is a free nonprofit with video lessons and practice, and a separate Kids app for ages 2 to 8.",
    who: "Families who want free, high-quality lessons and are happy to follow a US-based course order.",
    goodAt: [
      "It is free, with no ads.",
      "Clear video lessons, especially for older students.",
      "Khan Academy Kids is a well-loved free app for the early years.",
    ],
    differences: [
      {
        topic: "Price",
        them: "Free.",
        us: "A family plan after a 30-day free trial. The first 2 units of every course stay free forever.",
      },
      {
        topic: "Curriculum",
        them: "Course order follows US standards. A 2015 mapping linked some Grade 4 to 6 content to Ontario and BC, but it hasn't been updated for the current BC curriculum, as far as we could find.",
        us: "Every unit is matched to a BC Curriculum learning standard, an Ontario Curriculum expectation or an Alberta learning outcome, with the Big Ideas or strands listed for parents.",
      },
      {
        topic: "Parent guidance",
        them: "Learning is largely self-directed, with limited guidance for parents.",
        us: "Reports for parents in your province's report-card levels, strengths and next steps, and a guide to the BC, Ontario and Alberta report cards.",
      },
      {
        topic: "Games",
        them: "Lessons and exercises, plus the Kids app for little ones.",
        us: "Learning games, trophies and a pretend shop, with coins earned only by learning.",
      },
    ],
    chooseThem: ["Budget is the main concern.", "Your child likes watching video lessons and working independently."],
    chooseUs: [
      "You want practice that lines up with what your child's BC, Ontario or Alberta teacher is covering.",
      "You want to see progress in the language of your child's report card.",
      "You want a kids' app with learning games and parent controls.",
    ],
    sources: [
      { label: "Khan Academy: does it cost money?", url: "https://support.khanacademy.org/hc/en-us/articles/202260114-Does-it-cost-money-to-use-Khan-Academy" },
      { label: "Khan Academy blog, 2015: Ontario and BC mapping", url: "https://blog.khanacademy.org/the-learning-partnership-helps-bring-khan-academy/" },
    ],
    faqs: [
      {
        q: "Is Khan Academy aligned to the BC curriculum?",
        a: "Khan Academy's courses follow US standards. We found a 2015 mapping to Ontario and BC for some Grade 4 to 6 content, but nothing current for BC. Check with your child's teacher if you want to be sure a topic is taught in their grade.",
      },
      {
        q: "Can I use Khan Academy and Gradelings together?",
        a: "Yes. Many families use a free resource for videos and a curriculum-matched app for practice and reports. Use whichever your child enjoys.",
      },
    ],
  },
  {
    slug: "prodigy",
    name: "Prodigy",
    summary: "Prodigy is a fantasy role-playing game where kids battle monsters by answering math questions.",
    who: "Kids who are motivated by a long, story-style game and are fine with in-game membership offers.",
    goodAt: [
      "A big game world that many kids love.",
      "Free core math play.",
      "Strong adoption in schools, especially in Ontario.",
    ],
    differences: [
      {
        topic: "Price",
        them: `The core game is free. On the Canadian App Store, memberships were C$12.99 to C$25.99 a month, or C$74.99 to C$154.99 a year, as of ${PRICE_CHECKED}.`,
        us: "A family plan, with no in-game purchases. Kids can never buy anything; coins are earned only by learning.",
      },
      {
        topic: "Selling inside the game",
        them: "The game shows kids membership offers, and parents have reported children asking them to upgrade.",
        us: "No ads and no upsells to children, ever.",
      },
      {
        topic: "Curriculum",
        them: "Canadian content follows the Ontario curriculum, with no BC alignment found.",
        us: "Matched to the BC, Ontario and Alberta curricula.",
      },
      {
        topic: "Subjects",
        them: "Mostly math.",
        us: "Math, language arts, science and social studies from Kindergarten to Grade 9.",
      },
    ],
    chooseThem: ["Your child will only practise inside a big, story-driven game.", "You want a free math option to try."],
    chooseUs: [
      "You want BC-, Ontario- or Alberta-matched practice in four subjects.",
      "You don't want your child to see ads or purchase offers.",
      "You want clear reports in your province's report-card language.",
    ],
    sources: [
      { label: "Prodigy on the Canadian App Store", url: "https://apps.apple.com/ca/app/id950795722" },
      { label: "Prodigy math curriculum standards", url: "https://www.prodigygame.com/main-en/math-curriculum-standards/" },
    ],
    faqs: [
      {
        q: "Does Gradelings have a game like Prodigy?",
        a: "Gradelings has quick learning games, such as Number Munchers and Word Ninja, and a coin-and-trophy system. They are shorter than a full role-playing game and unlock through learning time you choose.",
      },
      {
        q: "Does Gradelings show ads or sell things to kids?",
        a: "Never. There are no ads, no tracking pixels and no in-app purchases for kids. Parents control the plan.",
      },
    ],
  },
];

export function competitorBySlug(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}
