import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleJsonLd, breadcrumbJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent, resolve, subjectSeoTitle } from "@/components/site/curriculum";
import { guidePath } from "@/components/site/guides";
import { FRAMEWORKS } from "@/content/frameworks";
import { GRADE_LABEL, getSubjectMeta } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return FRAMEWORKS.map((f) => ({ framework: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[framework]">): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const f = r.framework;
  return {
    title: `${f.name} parent guides and free printable practice sheets`,
    description: `Free guides for ${f.shortName} parents: what each grade learns in the ${f.curriculumName}, how to help at home, Core Competencies, the FSA and printable practice sheets for Kindergarten to Grade 9.`,
    alternates: { canonical: guidePath.hub(r.framework) },
  };
}

export default async function GuidesHub({ params }: PageProps<"/guides/[framework]">) {
  const r = resolve(await params);
  if (!r) notFound();
  const f = r.framework;
  const crumbs = [{ label: "Home", href: "/" }, { label: `${f.shortName} parent guides` }];
  const title = `${f.name} parent guides and free practice sheets`;
  const description = `Plain-language guides for parents following the ${f.curriculumName}, plus free printable practice sheets.`;

  return (
    <SitePage>
      <JsonLd data={[breadcrumbJsonLd(crumbs), articleJsonLd({ headline: title, description, path: guidePath.hub(f) })]} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">{f.shortName} parent guides and free practice sheets</h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">
        {description} Every guide follows the {f.curriculumName}, and each practice sheet has an answer key.
      </p>

      <section aria-labelledby="understand" className="mt-8">
        <h2 id="understand" className="mb-3 text-2xl font-bold">
          Understand your child’s school year
        </h2>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <li className="card p-5">
            <Link href={`/report-cards/${f.slug}/`} className="text-xl font-bold hover:underline">
              Understanding {f.shortName} report cards
            </Link>
            <p className="mt-1 font-read text-ink-soft">What Emerging, Developing, Proficient and Extending mean.</p>
          </li>
          <li className="card p-5">
            <Link href={guidePath.competencies(f)} className="text-xl font-bold hover:underline">
              {f.shortName} Core Competencies
            </Link>
            <p className="mt-1 font-read text-ink-soft">Communication, Thinking, and Personal and Social, in plain words.</p>
          </li>
          <li className="card p-5">
            <Link href={guidePath.assessment(f)} className="text-xl font-bold hover:underline">
              The FSA explained
            </Link>
            <p className="mt-1 font-read text-ink-soft">The Grade 4 and Grade 7 Foundation Skills Assessment.</p>
          </li>
          <li className="card p-5">
            <Link href={guidePath.french(f)} className="text-xl font-bold hover:underline">
              Core French and French Immersion
            </Link>
            <p className="mt-1 font-read text-ink-soft">How they differ, when they start and how to help at home.</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="grades" className="mt-10">
        <h2 id="grades" className="mb-3 text-2xl font-bold">
          What kids learn in each grade
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gradesWithContent(f).map((g) => (
            <section key={g} className="card flex flex-col gap-2 p-5">
              <h3 className="text-2xl font-bold">
                <Link href={guidePath.grade(f, g)} className="hover:underline">
                  {GRADE_LABEL[g]}
                </Link>
              </h3>
              <ul className="flex flex-col gap-1">
                {coursesFor(f, g).map((c) => (
                  <li key={c.subject} className="flex flex-wrap items-center gap-x-3 font-read">
                    <Link href={guidePath.subject(f, g, c.subject)} className="hover:underline">
                      {getSubjectMeta(c.subject).emoji} {subjectSeoTitle(c.subject)} at home
                    </Link>
                    <Link href={guidePath.worksheet(f, g, c.subject)} className="ml-auto text-sm font-semibold text-[#2f6fd6] underline">
                      Printable sheet
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <p className="mt-10 font-read text-ink-soft">
        Want the full unit list with learning standards? See the{" "}
        <Link href={curriculumPath.framework(f)} className="font-semibold text-[#2f6fd6] underline">
          {f.curriculumName} on {APP_NAME}
        </Link>
        .
      </p>
    </SitePage>
  );
}
