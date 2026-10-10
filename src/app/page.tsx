import { onColour } from "@/lib/contrast";
import { PricingCards } from "@/components/site/Pricing";
import type { Metadata } from "next";
import Link from "next/link";
import { Critter } from "@/components/Critter";
import { SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent, subjectSeoTitle } from "@/components/site/curriculum";
import { GAMES } from "@/components/play/games/types";
import { DEFAULT_FRAMEWORK, FRAMEWORKS, getFramework } from "@/content/frameworks";
import { GRADE_LABEL, SUBJECTS, isCoreSubject } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { FREE_UNITS_PER_COURSE, MAX_CHILDREN, PRICES, TRIAL_DAYS } from "@/lib/plan";
import { TEACHER_FRAMEWORKS, TEACHER_SIGNUP, teacherPath } from "@/components/site/teachers";
import { JsonLd, ORG_JSON_LD, SITE_URL, absolute } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${APP_NAME} · Curriculum practice and learning games for Kindergarten to Grade 9` },
  description: `Ad-free practice for Kindergarten to Grade 9 that follows the curriculum. An adaptive Adventure mode, learning games earned with focused practice, trophies, offline play, and progress reports in the same language as the report card. Free for ${TRIAL_DAYS} days.`,
  alternates: { canonical: "/" },
};

const FEATURES = [
  { icon: "🗺️", title: "Adventure mode", body: "No menus to dig through. One tap starts a mix of questions from every subject, weighted toward the skills that need practice or haven't been tried yet." },
  { icon: "⏱️", title: "Learn first, then play", body: "Focused practice earns arcade time. You choose the ratio (20 minutes of learning unlocks 5 minutes of games by default) and a daily cap." },
  { icon: "🏆", title: "Trophies, levels & quests", body: "Bronze to platinum trophies with console-style pop-ups, XP and levels, daily quests, streaks and a shop of critter companions." },
  { icon: "🎯", title: "Modes for every mood", body: "Practice, Review for tricky spots, Speed Run against the clock, a Daily Challenge, and a timed Challenge to show mastery." },
  { icon: "📈", title: "Reports you can read", body: "Progress is described with the same four levels as the report card, with weekly trends, strengths, next steps and printable summaries." },
  { icon: "📶", title: "Works offline", body: "Install it on a tablet or phone and it keeps working with no internet. Progress, scores and trophies sync when you're back online." },
  { icon: "🙈", title: "No ads, ever", body: "No ads, no tracking pixels and no selling data. Kids see a first name and an avatar, nothing more." },
  { icon: "👨‍👩‍👧", title: "One plan, whole family", body: `Up to ${MAX_CHILDREN} children on one family plan, each with their own grade, settings and progress.` },
];

const FAQS = [
  {
    q: `Which grades does ${APP_NAME} cover?`,
    a: "Kindergarten to Grade 9, in math, English language arts, science and social studies. The text, buttons and read-aloud adapt to the child's age: big pictures and spoken prompts for Kindergarten and Grade 1, more independence for older kids.",
  },
  {
    q: "Is it matched to our provincial curriculum?",
    a: "Yes. Choose British Columbia, Ontario, Saskatchewan or Manitoba. Every unit is tagged with the learning standard it practises, and parent reports use your province's report-card levels (in BC: Emerging, Developing, Proficient, Extending; in Ontario: Levels 1 to 4; in Saskatchewan: Beginning, Approaching, Meeting, Exemplary; in Manitoba: Levels 1 to 4). Ontario and Manitoba cover math, language, science, social studies and French (Core and Immersion) from Kindergarten to Grade 9. Saskatchewan covers math, language, science and social studies. More provinces and states are on the way.",
  },
  {
    q: "Does it work without internet?",
    a: "Yes. Once it has been opened, it works offline on tablets, phones and computers. Practice is saved on the device and syncs to your account automatically when the connection comes back, so nothing is lost.",
  },
  {
    q: "How does the learning-to-games timer work?",
    a: "Time spent answering questions earns arcade time. By default every 20 minutes of learning unlocks 5 minutes of learning games, with a daily maximum. Parents can change both numbers, turn games off, or allow free play.",
  },
  {
    q: "How much does it cost?",
    a: `The first ${TRIAL_DAYS} days are free with everything included, no card needed. After that the family plan is ${PRICES.month.label} or ${PRICES.year.label} (CAD) for up to ${MAX_CHILDREN} children. Without a plan, the first ${FREE_UNITS_PER_COURSE} units of every subject stay free.`,
  },
  {
    q: "Are there ads or in-app purchases for kids?",
    a: "No. There are no ads, and kids can't buy anything. Coins earned by practising are spent in a pretend shop on critter companions and confetti styles.",
  },
];

export default function Home() {
  const framework = getFramework(DEFAULT_FRAMEWORK);
  const grades = gradesWithContent(framework);
  const unitCount = grades.reduce((n, g) => n + coursesFor(framework, g).reduce((m, c) => m + c.units.length, 0), 0);
  const scheme = framework.scoringFor("3");

  return (
    <SitePage>
      <JsonLd
        data={[
          ORG_JSON_LD,
          { "@context": "https://schema.org", "@type": "WebSite", name: APP_NAME, url: SITE_URL },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: APP_NAME,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web, Android, iOS, Windows, macOS, ChromeOS",
            url: absolute("/play/"),
            audience: { "@type": "EducationalAudience", educationalRole: "student" },
            offers: [
              { "@type": "Offer", name: "Family plan (monthly)", price: PRICES.month.amount, priceCurrency: PRICES.month.currency },
              { "@type": "Offer", name: "Family plan (yearly)", price: PRICES.year.amount, priceCurrency: PRICES.year.currency },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />

      {/* Hero */}
      <section className="grid items-center gap-8 py-6 md:grid-cols-[1.1fr_1fr] md:py-12">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-[#fff4cc] px-3 py-1 text-sm font-bold text-[#8a6400]">{FRAMEWORKS.map((f) => f.region).join(" and ")} curriculum · Kindergarten to Grade 9</p>
          <h1 className="text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
            Practice that feels like play. <span className="text-[#4f8ef7]">Progress you can read.</span>
          </h1>
          <p className="mt-4 max-w-xl font-read text-lg text-ink-soft sm:text-xl">
            Short, friendly lessons in math, reading, science, social studies and French that follow the curriculum, learning games your kids earn with focused practice, and parent reports that speak the same language as the report card.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/play/" className="btn btn-good min-h-14 px-6 text-xl">
              Start free for {TRIAL_DAYS} days
            </Link>
            <Link href={curriculumPath.framework(framework)} className="btn min-h-14 px-6 text-xl">
              See what&apos;s covered
            </Link>
          </div>
          <p className="mt-4 max-w-xl font-read text-ink-soft">
            Choose your province when you add a child:{" "}
            {FRAMEWORKS.map((f, i) => (
              <span key={f.id}>
                {i > 0 && " and "}
                <Link href={curriculumPath.framework(f)} className="font-semibold text-[#2f6fd6] underline">
                  {f.region}
                </Link>{" "}
                ({f.subjects.map((s) => subjectSeoTitle(s).toLowerCase()).join(", ")}, up to {GRADE_LABEL[f.grades[f.grades.length - 1]]})
              </span>
            ))}
            . More provinces and states are coming.
          </p>
          <p className="mt-3 text-sm text-ink-soft">No card needed · No ads · Works offline</p>
          <p className="mt-3 font-read text-ink-soft">
            Teacher?{" "}
            <Link href={TEACHER_SIGNUP} className="font-semibold text-[#2f6fd6] underline">
              Create a free teacher account
            </Link>
            .
          </p>
        </div>
        <div className="relative mx-auto grid max-w-md grid-cols-3 items-end gap-2" aria-hidden="true">
          <Critter id="hoot" mood="wave" size={120} className="justify-self-center" />
          <Critter id="ollie" mood="cheer" size={170} className="justify-self-center" />
          <Critter id="ruby" mood="happy" size={120} className="justify-self-center" />
          <Critter id="bolt" mood="think" size={110} className="col-start-1 justify-self-center" />
          <div className="rounded-3xl bg-white p-3 text-center shadow-sm">
            <p className="text-3xl">🏆</p>
            <p className="text-sm font-bold">Trophy unlocked!</p>
          </div>
          <Critter id="juniper" mood="happy" size={110} className="justify-self-center" />
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features" className="py-8">
        <h2 id="features" className="mb-2 text-3xl font-bold sm:text-4xl">
          Built so kids want to come back
        </h2>
        <p className="mb-6 max-w-2xl font-read text-lg text-ink-soft">The pull of a good video game, pointed at the skills on the report card.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <p className="text-4xl" aria-hidden="true">
                {f.icon}
              </p>
              <h3 className="mt-2 text-xl font-bold">{f.title}</h3>
              <p className="mt-1 font-read text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Games */}
      <section aria-labelledby="games" className="py-8">
        <h2 id="games" className="mb-6 text-3xl font-bold sm:text-4xl">
          Learning games, earned with practice
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {GAMES.map((g) => (
            <div key={g.id} className="rounded-3xl p-5" style={{ background: g.colour, color: onColour(g.colour) }}>
              <p className="text-4xl" aria-hidden="true">
                {g.icon}
              </p>
              <h3 className="mt-2 text-xl font-bold">{g.title}</h3>
              <p className="text-sm font-semibold opacity-90">{g.subject}</p>
              <p className="mt-1 font-read text-sm">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section aria-labelledby="coverage" className="py-8">
        <h2 id="coverage" className="mb-2 text-3xl font-bold sm:text-4xl">
          Every grade, every subject
        </h2>
        <p className="mb-6 font-read text-lg text-ink-soft">
          {unitCount} units across {grades.length} grades, each matched to a {framework.curriculumName} learning standard.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {grades.map((g) => (
            <Link key={g} href={curriculumPath.grade(framework, g)} className="card flex flex-col gap-1 p-4 hover:border-[#4f8ef7]">
              <span className="text-xl font-bold">{GRADE_LABEL[g]}</span>
              <span className="text-sm text-ink-soft">{coursesFor(framework, g).reduce((n, c) => n + c.units.length, 0)} units</span>
              <span className="text-lg" aria-hidden="true">
                {SUBJECTS.filter((s) => isCoreSubject(s.id)).map((s) => s.emoji).join(" ")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Report cards */}
      <section aria-labelledby="report" className="my-8 rounded-3xl bg-white p-6 sm:p-10">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            <h2 id="report" className="text-3xl font-bold sm:text-4xl">
              Speaks report-card language
            </h2>
            <p className="mt-3 font-read text-lg text-ink-soft">
              {framework.name} report cards don&apos;t use letter grades until high school. {APP_NAME} tracks each skill on the same four-level scale, so you can see what your child&apos;s report card means and exactly what to practise next.
            </p>
            <Link href={`/report-cards/${framework.slug}/`} className="btn mt-5 min-h-12 px-5 text-lg">
              Read the report card guide
            </Link>
          </div>
          <ol className="grid grid-cols-2 gap-3">
            {scheme.levels.map((l) => (
              <li key={l.id} className="rounded-2xl bg-paper p-4">
                <p className="text-3xl" aria-hidden="true">
                  {l.icon}
                </p>
                <p className="text-lg font-bold">{l.label}</p>
                <p className="font-read text-sm text-ink-soft">{l.atHome}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Teachers */}
      <section aria-labelledby="teachers" className="my-8 rounded-3xl bg-[#e8f1ff] p-6 sm:p-10">
        <div className="grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="teachers" className="text-3xl font-bold sm:text-4xl">
              Teaching a class?
            </h2>
            <p className="mt-3 font-read text-lg text-ink-soft">
              Create a class, assign {TEACHER_FRAMEWORKS.map((f) => f.curriculumName).join(" and ")} units and see how each student is practising. Families join with a code and choose what is shared. Classes are free for now.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={TEACHER_SIGNUP} className="btn btn-good min-h-12 px-5 text-lg">
                Create a free teacher account
              </Link>
              <Link href={teacherPath.hub()} className="btn min-h-12 px-5 text-lg">
                See how classes work
              </Link>
            </div>
          </div>
          <ul className="grid gap-2 font-read text-ink">
            <li className="rounded-2xl bg-white p-3">📋 Assign units in a few taps</li>
            <li className="rounded-2xl bg-white p-3">📈 See level, accuracy and attempts</li>
            <li className="rounded-2xl bg-white p-3">🔒 Parents decide what is shared</li>
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section aria-labelledby="pricing" className="py-8">
        <h2 id="pricing" className="mb-6 text-3xl font-bold sm:text-4xl">
          Simple pricing for the whole family
        </h2>
        <PricingCards />
        <div className="mt-6 flex justify-center">
          <Link href="/play/" className="btn btn-good min-h-14 px-8 text-xl">
            Start learning
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="py-8">
        <h2 id="faq" className="mb-4 text-3xl font-bold sm:text-4xl">
          Questions from parents
        </h2>
        <div className="flex flex-col gap-2">
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-2xl border border-line bg-white p-4">
              <summary className="cursor-pointer text-lg font-semibold">{f.q}</summary>
              <p className="mt-2 font-read text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </SitePage>
  );
}
