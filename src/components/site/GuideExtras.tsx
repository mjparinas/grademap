import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { curriculumPath, resolve } from "@/components/site/curriculum";
import { guidePath } from "@/components/site/guides";
import { guidesFor } from "@/content/guides";
import { GRADE_LABEL } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

// The two province-specific guide pages (competencies/learning skills and the provincial
// assessment). Each province serves them at its own URL (see guidePath), so the route files
// are thin wrappers around these.

type Params = Promise<{ framework: string }>;

export async function competenciesMetadata(params: Params): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const g = guidesFor(r.framework.id).competencies;
  return {
    title: `${r.framework.shortName} ${g.label} explained for parents`,
    description: g.description,
    alternates: { canonical: guidePath.competencies(r.framework) },
    openGraph: { title: g.title },
  };
}

export async function CompetenciesView({ params }: { params: Params }) {
  const r = resolve(await params);
  if (!r) notFound();
  const f = r.framework;
  const g = guidesFor(f.id).competencies;
  const crumbs = [{ label: "Home", href: "/" }, { label: `${f.shortName} parent guides`, href: guidePath.hub(f) }, { label: g.label }];

  return (
    <SitePage>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(g.faqs), articleJsonLd({ headline: g.title, description: g.intro, path: guidePath.competencies(f) })]} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">{g.title}</h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">{g.intro}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {g.items.map((c) => (
          <section key={c.id} aria-labelledby={c.id} className="card flex flex-col gap-3 p-5">
            <h2 id={c.id} className="text-2xl font-bold">
              {c.name}
            </h2>
            <p className="font-read text-lg">{c.blurb}</p>
            {c.parts.length > 0 && (
              <ul className="flex flex-col gap-2">
                {c.parts.map((p) => (
                  <li key={p.name} className="rounded-2xl bg-paper p-3 font-read">
                    <b>{p.name}.</b> {p.blurb}
                  </li>
                ))}
              </ul>
            )}
            <p className="font-bold">Ideas for home</p>
            <ul className="list-disc pl-5 font-read">
              {c.atHome.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section aria-labelledby="faq" className="mt-10 max-w-3xl">
        <h2 id="faq" className="mb-3 text-2xl font-bold">
          Common questions
        </h2>
        <div className="flex flex-col gap-2">
          {g.faqs.map((q) => (
            <details key={q.q} className="rounded-2xl border border-line bg-white p-4">
              <summary className="cursor-pointer font-bold">{q.q}</summary>
              <p className="mt-2 font-read">{q.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-8 font-read text-ink-soft">
        Next:{" "}
        <Link href={`/report-cards/${f.slug}/`} className="font-semibold text-[#2f6fd6] underline">
          understand the {f.shortName} report card levels
        </Link>{" "}
        or{" "}
        <Link href={guidePath.hub(f)} className="font-semibold text-[#2f6fd6] underline">
          browse all {f.shortName} parent guides
        </Link>
        . {APP_NAME} practises subject skills; {g.closing}
      </p>
    </SitePage>
  );
}

export async function assessmentMetadata(params: Params): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const a = guidesFor(r.framework.id).assessment;
  return {
    title: `The ${a.short} explained: ${a.name} for Grade ${a.grades.join(" and Grade ")} parents`,
    description: `What the ${a.name} is, who takes it, what it covers, how results are described, and how to help your child feel ready. A plain-language guide for ${r.framework.shortName} parents.`,
    alternates: { canonical: guidePath.assessment(r.framework) },
  };
}

export async function AssessmentView({ params }: { params: Params }) {
  const r = resolve(await params);
  if (!r) notFound();
  const f = r.framework;
  const guides = guidesFor(f.id);
  const a = guides.assessment;
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
          Dates and details change from year to year. Your school and {a.source} have the current information.
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
          {guides.competencies.label}
        </Link>
        .
      </p>
    </SitePage>
  );
}
