import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { TeacherCta } from "@/components/site/TeacherCta";
import { TEACHER_FRAMEWORKS, TEACHER_SIGNUP, teacherPath } from "@/components/site/teachers";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

const curricula = TEACHER_FRAMEWORKS.map((f) => f.curriculumName).join(" or ");
const regions = TEACHER_FRAMEWORKS.map((f) => f.region).join(" and ");

export const metadata: Metadata = {
  title: `${APP_NAME} for teachers: classroom practice matched to the ${curricula}`,
  description: `Create a class, assign curriculum-matched units and see how each student is practising. Free for teachers for now, ad-free, and families stay in control of what is shared.`,
  alternates: { canonical: teacherPath.hub() },
};

const STEPS = [
  { title: "Create a class", body: "Sign up as a teacher, name your class and choose its grade. You get a short join code." },
  { title: "Families join", body: "A parent enters the code under Children → Join a class. Nothing about a child is shared until they do, and they can leave at any time." },
  { title: "Assign units", body: `Choose your province when you create the class, then pick units from its curriculum. Assigned units appear as “From your teacher” on each child's home screen, even offline.` },
  { title: "See practice results", body: "See each linked student's level, accuracy and attempts on the units you assigned. It shows practice, not a report-card mark." },
];

const FAQS = [
  { q: "Does it cost anything for teachers?", a: `Classes are free for now. Students whose family has no plan can still open the units you assign.` },
  { q: "What can I see about my students?", a: "Only what a parent has chosen to share by linking their child to your class: first name, avatar, grade, and level, accuracy and attempts on the units you assigned. Nothing else." },
  { q: "Do I have to enter students myself?", a: "No. Parents link their own child with your join code, so you never type in student details, and there are no student passwords to manage." },
  { q: "Is this a report-card mark?", a: `No. ${APP_NAME} shows how a student is practising. The teacher decides proficiency, as on the report card.` },
  { q: "Which curriculum does it follow?", a: `Each class follows one province: ${regions}. Units are matched to the ${curricula}, from Kindergarten to Grade 9. Other provinces are on the way.` },
  { q: "Are there ads?", a: "No ads, no tracking pixels and no selling of data. Kids cannot buy anything." },
];

export default function TeachersHub() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "For teachers" }];
  return (
    <SitePage>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(FAQS)]} />
      <Crumbs items={crumbs} />
      <section className="py-4">
        <p className="mb-3 inline-flex rounded-full bg-[#fff4cc] px-3 py-1 text-sm font-bold text-[#8a6400]">For teachers · Kindergarten to Grade 9</p>
        <h1 className="text-4xl leading-tight font-bold sm:text-5xl">Classroom practice your students will want to do</h1>
        <p className="mt-4 max-w-2xl font-read text-lg text-ink-soft">
          Assign {regions} curriculum units, see how your students are practising, and let learning games be the reward for focused work. No ads, no student passwords, and families stay in control.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={TEACHER_SIGNUP} className="btn btn-good min-h-14 px-6 text-xl">
            Create a free teacher account
          </Link>
          {TEACHER_FRAMEWORKS.map((f) => (
            <Link key={f.id} href={teacherPath.framework(f)} className="btn min-h-14 px-6 text-xl">
              See {f.region} units
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="how" className="py-8">
        <h2 id="how" className="mb-4 text-3xl font-bold">
          How classes work
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card p-5">
              <p className="text-3xl font-bold text-[#4f8ef7]" aria-hidden="true">
                {i + 1}
              </p>
              <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
              <p className="mt-1 font-read text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="faq" className="py-8">
        <h2 id="faq" className="mb-4 text-3xl font-bold">
          Questions from teachers
        </h2>
        <div className="flex flex-col gap-2">
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-2xl border border-line bg-white p-4">
              <summary className="cursor-pointer text-lg font-semibold">{f.q}</summary>
              <p className="mt-2 font-read text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 font-read text-sm text-ink-soft">
          Using {APP_NAME} for a whole school? See the{" "}
          <Link href="/privacy/" className="underline">
            privacy policy
          </Link>{" "}
          and <Link href="/contact/" className="underline">get in touch</Link> first.
        </p>
      </section>
      <TeacherCta showHub={false} />
    </SitePage>
  );
}
