import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent, resolve, subjectSeoTitle, subjectTitle } from "@/components/site/curriculum";
import { FRAMEWORKS } from "@/content/frameworks";
import { GRADE_LABEL, getSubjectMeta, gradeSlug } from "@/content/subjects";
import { JsonLd, absolute } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return FRAMEWORKS.flatMap((f) =>
    gradesWithContent(f).flatMap((g) => coursesFor(f, g).map((c) => ({ framework: f.slug, grade: gradeSlug(g), subject: c.subject }))),
  );
}

export async function generateMetadata({ params }: PageProps<"/curriculum/[framework]/[grade]/[subject]">): Promise<Metadata> {
  const r = resolve(await params);
  if (!r?.course) return {};
  const { framework: f, grade, course } = r;
  const name = subjectSeoTitle(course.subject);
  return {
    title: `${GRADE_LABEL[grade]} ${name}: ${f.shortName} curriculum practice`,
    description: `${GRADE_LABEL[grade]} ${name.toLowerCase()} in ${f.name}: ${course.units
      .slice(0, 5)
      .map((u) => u.title.toLowerCase())
      .join(", ")} and more. ${f.overviewLabel}, ${f.standardLabel.toLowerCase()}s and free sample questions.`,
    alternates: { canonical: curriculumPath.subject(f, grade, course.subject) },
  };
}

export default async function SubjectPage({ params }: PageProps<"/curriculum/[framework]/[grade]/[subject]">) {
  const r = resolve(await params);
  if (!r?.course) notFound();
  const { framework: f, grade, course } = r;
  const meta = getSubjectMeta(course.subject);
  const name = subjectSeoTitle(course.subject);
  const bigIdeas = course.bigIdeas[f.id] ?? [];
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Curriculum", href: curriculumPath.index() },
    { label: f.curriculumName, href: curriculumPath.framework(f) },
    { label: GRADE_LABEL[grade], href: curriculumPath.grade(f, grade) },
    { label: name },
  ];

  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${GRADE_LABEL[grade]} ${name} units`,
            itemListElement: course.units.map((u, i) => ({ "@type": "ListItem", position: i + 1, name: u.title, url: absolute(curriculumPath.unit(f, grade, course.subject, u.id)) })),
          },
        ]}
      />
      <Crumbs items={crumbs} />
      <h1 className="flex items-center gap-3 text-4xl font-bold">
        <span aria-hidden="true">{meta.emoji}</span> {GRADE_LABEL[grade]} {name}
      </h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">
        {course.units.length} units matched to the {f.curriculumName}
        {subjectTitle(course.subject, grade) !== name ? `. Kids see this subject as “${subjectTitle(course.subject, grade)}”.` : "."}
      </p>

      {bigIdeas.length > 0 && (
        <section aria-labelledby="big-ideas" className="mt-6 rounded-3xl p-5 sm:p-6" style={{ background: meta.colourSoft }}>
          <h2 id="big-ideas" className="text-2xl font-bold">
            {f.overviewLabel}
          </h2>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 font-read text-lg">
            {bigIdeas.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="units" className="mt-8">
        <h2 id="units" className="mb-4 text-2xl font-bold">
          Units
        </h2>
        <ol className="grid gap-4 md:grid-cols-2">
          {course.units.map((u, i) => (
            <li key={u.id} className="card flex flex-col gap-2 p-5">
              <p className="text-sm font-semibold text-ink-soft">Unit {i + 1}</p>
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <span aria-hidden="true">{u.emoji}</span>
                <Link href={curriculumPath.unit(f, grade, course.subject, u.id)} className="hover:underline">
                  {u.title}
                </Link>
              </h3>
              <p className="font-read text-ink-soft">{u.parentNote}</p>
              {u.standards[f.id] && (
                <p className="text-sm">
                  <b>{f.standardLabel}:</b> {u.standards[f.id]}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </SitePage>
  );
}
