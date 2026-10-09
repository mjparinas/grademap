import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent, resolve, subjectTitle } from "@/components/site/curriculum";
import { FRAMEWORKS } from "@/content/frameworks";
import { GRADE_LABEL, getSubjectMeta } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";

export const dynamicParams = false;

export function generateStaticParams() {
  return FRAMEWORKS.map((f) => ({ framework: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/curriculum/[framework]">): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const f = r.framework;
  return {
    title: `${f.curriculumName} practice, Kindergarten to Grade 7`,
    description: `Kid-friendly practice for the ${f.curriculumName} (${f.name}): math, English language arts, science and social studies from Kindergarten to Grade 7, with sample questions for every unit.`,
    alternates: { canonical: curriculumPath.framework(f) },
  };
}

export default async function FrameworkPage({ params }: PageProps<"/curriculum/[framework]">) {
  const r = resolve(await params);
  if (!r) notFound();
  const f = r.framework;
  return (
    <SitePage>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: "Curriculum", href: curriculumPath.index() }, { label: f.curriculumName }]} />
      <h1 className="text-4xl font-bold">{f.curriculumName}: Kindergarten to Grade 7</h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">
        Every {APP_NAME} unit is matched to a learning standard in the {f.curriculumName}. Choose a grade to see the units and try sample questions.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gradesWithContent(f).map((g) => (
          <section key={g} className="card flex flex-col gap-2 p-5">
            <h2 className="text-2xl font-bold">
              <Link href={curriculumPath.grade(f, g)} className="hover:underline">
                {GRADE_LABEL[g]}
              </Link>
            </h2>
            <ul className="flex flex-col gap-1">
              {coursesFor(f, g).map((c) => (
                <li key={c.subject}>
                  <Link href={curriculumPath.subject(f, g, c.subject)} className="flex items-center gap-2 font-read hover:underline">
                    <span aria-hidden="true">{getSubjectMeta(c.subject).emoji}</span>
                    {subjectTitle(c.subject, g)}
                    <span className="ml-auto text-sm text-ink-soft">{c.units.length} units</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-8 font-read text-ink-soft">
        Wondering what “Proficient” means on a report card?{" "}
        <Link href={`/report-cards/${f.slug}/`} className="font-semibold text-[#2f6fd6] underline">
          Read our {f.shortName} report card guide
        </Link>
        . New to the {f.shortName} curriculum? Start with our{" "}
        <Link href={`/guides/${f.slug}/`} className="font-semibold text-[#2f6fd6] underline">
          parent guides and free practice sheets
        </Link>
        .
      </p>
    </SitePage>
  );
}
