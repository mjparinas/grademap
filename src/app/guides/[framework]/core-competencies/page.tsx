import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { resolve } from "@/components/site/curriculum";
import { guidePath } from "@/components/site/guides";
import { guidesFor, GUIDE_FRAMEWORKS } from "@/content/guides";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_FRAMEWORKS.map((f) => ({ framework: f.slug }));
}

type Props = PageProps<"/guides/[framework]/core-competencies">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const g = guidesFor(r.framework.id).competencies;
  return {
    title: `${r.framework.shortName} Core Competencies explained for parents`,
    description: `What the three ${r.framework.name} Core Competencies mean (Communication, Thinking, and Personal and Social), how they show up on the report card, and simple ways to support them at home.`,
    alternates: { canonical: guidePath.competencies(r.framework) },
    openGraph: { title: g.title },
  };
}

export default async function CompetenciesPage({ params }: Props) {
  const r = resolve(await params);
  if (!r) notFound();
  const f = r.framework;
  const g = guidesFor(f.id).competencies;
  const crumbs = [{ label: "Home", href: "/" }, { label: `${f.shortName} parent guides`, href: guidePath.hub(f) }, { label: "Core Competencies" }];

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
            <ul className="flex flex-col gap-2">
              {c.parts.map((p) => (
                <li key={p.name} className="rounded-2xl bg-paper p-3 font-read">
                  <b>{p.name}.</b> {p.blurb}
                </li>
              ))}
            </ul>
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
        . {APP_NAME} practises subject skills; Core Competencies grow through conversation, projects and play.
      </p>
    </SitePage>
  );
}
