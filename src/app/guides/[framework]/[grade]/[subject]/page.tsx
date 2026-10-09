import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent, resolve, subjectSeoTitle } from "@/components/site/curriculum";
import { guidePath } from "@/components/site/guides";
import { FRAMEWORKS } from "@/content/frameworks";
import { HOME_TIPS } from "@/content/guides";
import { GRADE_LABEL, ageBandFor, getSubjectMeta, gradeSlug } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return FRAMEWORKS.flatMap((f) =>
    gradesWithContent(f).flatMap((g) => coursesFor(f, g).map((c) => ({ framework: f.slug, grade: gradeSlug(g), subject: c.subject }))),
  );
}

type Props = PageProps<"/guides/[framework]/[grade]/[subject]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve(await params);
  if (!r?.course) return {};
  const { framework: f, grade, course } = r;
  const name = subjectSeoTitle(course.subject);
  return {
    title: `${GRADE_LABEL[grade]} ${name} help at home (${f.shortName} curriculum)`,
    description: `How to help your ${GRADE_LABEL[grade]} child with ${name.toLowerCase()} at home in ${f.name}: what they learn this year, simple activities, and what the report card levels mean.`,
    alternates: { canonical: guidePath.subject(f, grade, course.subject) },
  };
}

export default async function SubjectGuide({ params }: Props) {
  const r = resolve(await params);
  if (!r?.course) notFound();
  const { framework: f, grade, course } = r;
  const label = GRADE_LABEL[grade];
  const name = subjectSeoTitle(course.subject);
  const meta = getSubjectMeta(course.subject);
  const bigIdeas = course.bigIdeas[f.id] ?? [];
  const tips = HOME_TIPS[course.subject][ageBandFor(grade)];
  const levels = f.scoringFor(grade).levels;
  const faqs = [
    {
      q: `How can I help my ${label} child with ${name.toLowerCase()}?`,
      a: `${tips.slice(0, 2).join(" ")} Keep sessions short, about 10 to 15 minutes, and stop on a success.`,
    },
    {
      q: `What does my child learn in ${label} ${name.toLowerCase()} in ${f.shortName}?`,
      a: `The ${f.curriculumName} ${label} ${name.toLowerCase()} units include ${course.units
        .slice(0, 6)
        .map((u) => u.title.toLowerCase())
        .join(", ")}.`,
    },
  ];
  const crumbs = [
    { label: "Home", href: "/" },
    { label: `${f.shortName} parent guides`, href: guidePath.hub(f) },
    { label, href: guidePath.grade(f, grade) },
    { label: `${name} at home` },
  ];

  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          faqJsonLd(faqs),
          articleJsonLd({
            headline: `${label} ${name} help at home (${f.shortName})`,
            description: `How to help a ${label} child with ${name.toLowerCase()} at home in ${f.name}.`,
            path: guidePath.subject(f, grade, course.subject),
          }),
        ]}
      />
      <Crumbs items={crumbs} />
      <h1 className="flex items-center gap-3 text-4xl font-bold">
        <span aria-hidden="true">{meta.emoji}</span> {label} {name}: how to help at home
      </h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">
        What your child learns in {label} {name.toLowerCase()} in the {f.curriculumName}, and simple things to try at home.
      </p>

      {bigIdeas.length > 0 && (
        <section aria-labelledby="ideas" className="mt-6 rounded-3xl p-5 sm:p-6" style={{ background: meta.colourSoft }}>
          <h2 id="ideas" className="text-2xl font-bold">
            The Big Ideas this year
          </h2>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 font-read text-lg">
            {bigIdeas.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="tips" className="mt-8 max-w-3xl">
        <h2 id="tips" className="text-2xl font-bold">
          Easy ways to practise {name.toLowerCase()} at home
        </h2>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 font-read text-lg">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="units" className="mt-8">
        <h2 id="units" className="mb-3 text-2xl font-bold">
          What each unit covers
        </h2>
        <ol className="grid gap-4 md:grid-cols-2">
          {course.units.map((u) => (
            <li key={u.id} className="card flex flex-col gap-1 p-5">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <span aria-hidden="true">{u.emoji}</span>
                <Link href={curriculumPath.unit(f, grade, course.subject, u.id)} className="hover:underline">
                  {u.title}
                </Link>
              </h3>
              <p className="font-read text-ink-soft">{u.parentNote}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="levels" className="mt-10 max-w-3xl">
        <h2 id="levels" className="text-2xl font-bold">
          What the report card levels look like at home
        </h2>
        <dl className="mt-3 flex flex-col gap-3">
          {levels.map((l) => (
            <div key={l.id} className="rounded-2xl border border-line bg-white p-4">
              <dt className="font-bold">{l.label}</dt>
              <dd className="font-read">{l.atHome}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-read text-ink-soft">
          Your child’s teacher decides the level on the report card.{" "}
          <Link href={`/report-cards/${f.slug}/`} className="font-semibold text-[#2f6fd6] underline">
            Read the {f.shortName} report card guide
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="faq" className="mt-10 max-w-3xl">
        <h2 id="faq" className="mb-3 text-2xl font-bold">
          Common questions
        </h2>
        <div className="flex flex-col gap-2">
          {faqs.map((q) => (
            <details key={q.q} className="rounded-2xl border border-line bg-white p-4">
              <summary className="cursor-pointer font-bold">{q.q}</summary>
              <p className="mt-2 font-read">{q.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="card mt-10 flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-xl font-bold">Free printable {label} {name.toLowerCase()} practice sheet</p>
          <p className="font-read text-ink-soft">Questions from every unit, with an answer key.</p>
        </div>
        <Link href={guidePath.worksheet(f, grade, course.subject)} className="btn min-h-12 px-6 text-lg">
          Get the sheet
        </Link>
        <Link href="/play/" className="btn btn-good min-h-12 px-6 text-lg">
          Practise in {APP_NAME}
        </Link>
      </section>
    </SitePage>
  );
}
