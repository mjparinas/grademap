import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { curriculumPath, resolve } from "@/components/site/curriculum";
import { guidePath } from "@/components/site/guides";
import { guidesFor, GUIDE_FRAMEWORKS } from "@/content/guides";
import { GRADE_LABEL } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_FRAMEWORKS.map((f) => ({ framework: f.slug }));
}

type Props = PageProps<"/guides/[framework]/fsa">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const a = guidesFor(r.framework.id).assessment;
  return {
    title: `The ${a.short} explained: ${a.name} for Grade ${a.grades.join(" and Grade ")} parents`,
    description: `What the ${a.name} is, who takes it, what it covers, how results are described, and how to help your child feel ready. A plain-language guide for ${r.framework.shortName} parents.`,
    alternates: { canonical: guidePath.assessment(r.framework) },
  };
}

export default async function AssessmentPage({ params }: Props) {
  const r = resolve(await params);
  if (!r) notFound();
  const f = r.framework;
  const a = guidesFor(f.id).assessment;
  const crumbs = [{ label: "Home", href: "/" }, { label: `${f.shortName} parent guides`, href: guidePath.hub(f) }, { label: a.short }];
  const title = `The ${a.short} explained for ${f.shortName} parents`;

  return (
    <SitePage>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(a.faqs), articleJsonLd({ headline: title, description: a.intro, path: guidePath.assessment(f) })]} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">{a.intro}</p>

      <section aria-labelledby="facts" className="mt-8 max-w-3xl">
        <h2 id="facts" className="mb-3 text-2xl font-bold">
          The {a.short} at a glance
        </h2>
        <dl className="flex flex-col gap-3">
          {a.facts.map((x) => (
            <div key={x.title} className="rounded-2xl border border-line bg-white p-4">
              <dt className="font-bold">{x.title}</dt>
              <dd className="font-read">{x.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-read text-sm text-ink-soft">
          Dates and details change from year to year. Your school and the Ministry of Education and Child Care have the current information.
        </p>
      </section>

      <section aria-labelledby="prepare" className="mt-10 max-w-3xl">
        <h2 id="prepare" className="text-2xl font-bold">
          How to help your child feel ready
        </h2>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 font-read text-lg">
          {a.prepare.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-3 font-read text-lg">
          Practise the grade-level skills with {APP_NAME}:
          {a.grades.map((g, i) => (
            <span key={g}>
              {i === 0 ? " " : " and "}
              <Link href={curriculumPath.grade(f, g)} className="font-semibold text-[#2f6fd6] underline">
                {GRADE_LABEL[g]}
              </Link>
            </span>
          ))}
          .
        </p>
      </section>

      <section aria-labelledby="faq" className="mt-10 max-w-3xl">
        <h2 id="faq" className="mb-3 text-2xl font-bold">
          Common questions
        </h2>
        <div className="flex flex-col gap-2">
          {a.faqs.map((q) => (
            <details key={q.q} className="rounded-2xl border border-line bg-white p-4">
              <summary className="cursor-pointer font-bold">{q.q}</summary>
              <p className="mt-2 font-read">{q.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-8 font-read text-ink-soft">
        Also see:{" "}
        <Link href={`/report-cards/${f.slug}/`} className="font-semibold text-[#2f6fd6] underline">
          {f.shortName} report cards explained
        </Link>{" "}
        and{" "}
        <Link href={guidePath.competencies(f)} className="font-semibold text-[#2f6fd6] underline">
          Core Competencies
        </Link>
        .
      </p>
    </SitePage>
  );
}
