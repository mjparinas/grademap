import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent, resolve, subjectSeoTitle, subjectTitle } from "@/components/site/curriculum";
import { FRAMEWORKS } from "@/content/frameworks";
import { GRADE_LABEL, getSubjectMeta, gradeSlug } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return FRAMEWORKS.flatMap((f) => gradesWithContent(f).map((g) => ({ framework: f.slug, grade: gradeSlug(g) })));
}

export async function generateMetadata({ params }: PageProps<"/curriculum/[framework]/[grade]">): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const { framework: f, grade } = r;
  const subjects = coursesFor(f, grade).map((c) => subjectSeoTitle(c.subject).toLowerCase());
  return {
    title: `${GRADE_LABEL[grade]} ${f.shortName} curriculum practice`,
    description: `What kids learn in ${GRADE_LABEL[grade]} in ${f.name}: ${subjects.join(", ")}. Every unit explained for parents, with free sample questions matched to the ${f.curriculumName}.`,
    alternates: { canonical: curriculumPath.grade(f, grade) },
  };
}

export default async function GradePage({ params }: PageProps<"/curriculum/[framework]/[grade]">) {
  const r = resolve(await params);
  if (!r) notFound();
  const { framework: f, grade } = r;
  const courses = coursesFor(f, grade);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Curriculum", href: curriculumPath.index() },
    { label: f.curriculumName, href: curriculumPath.framework(f) },
    { label: GRADE_LABEL[grade] },
  ];
  const grades = gradesWithContent(f);
  const i = grades.indexOf(grade);

  return (
    <SitePage>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">
        {GRADE_LABEL[grade]} {f.shortName} curriculum
      </h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">
        What {GRADE_LABEL[grade]} students practise in {APP_NAME}, unit by unit, matched to the {f.curriculumName}. Tap any unit to see what it covers and try sample questions.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {courses.map((c) => {
          const meta = getSubjectMeta(c.subject);
          return (
            <section key={c.subject} className="card overflow-hidden" style={{ borderColor: meta.colour }}>
              <h2 className="flex items-center gap-2 px-5 py-3 text-2xl font-bold" style={{ background: meta.colourSoft }}>
                <span aria-hidden="true">{meta.emoji}</span>
                <Link href={curriculumPath.subject(f, grade, c.subject)} className="hover:underline">
                  {subjectSeoTitle(c.subject)}
                </Link>
                {subjectTitle(c.subject, grade) !== subjectSeoTitle(c.subject) && (
                  <span className="text-base font-semibold text-ink-soft">(“{subjectTitle(c.subject, grade)}” in the app)</span>
                )}
              </h2>
              <ul className="divide-y divide-line">
                {c.units.map((u) => (
                  <li key={u.id}>
                    <Link href={curriculumPath.unit(f, grade, c.subject, u.id)} className="flex items-start gap-3 px-5 py-3 hover:bg-paper">
                      <span className="text-2xl" aria-hidden="true">
                        {u.emoji}
                      </span>
                      <span>
                        <span className="block font-bold">{u.title}</span>
                        <span className="block font-read text-sm text-ink-soft">{u.blurb}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <nav aria-label="Other grades" className="mt-8 flex flex-wrap justify-between gap-3">
        {i > 0 ? (
          <Link href={curriculumPath.grade(f, grades[i - 1])} className="btn min-h-12 px-4 text-lg">
            ← {GRADE_LABEL[grades[i - 1]]}
          </Link>
        ) : (
          <span />
        )}
        {i < grades.length - 1 && (
          <Link href={curriculumPath.grade(f, grades[i + 1])} className="btn min-h-12 px-4 text-lg">
            {GRADE_LABEL[grades[i + 1]]} →
          </Link>
        )}
      </nav>
    </SitePage>
  );
}
