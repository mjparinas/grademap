import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { curriculumPath, resolve } from "@/components/site/curriculum";
import { guidePath } from "@/components/site/guides";
import { guidesFor, GUIDE_FRAMEWORKS } from "@/content/guides";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_FRAMEWORKS.map((f) => ({ framework: f.slug }));
}

type Props = PageProps<"/guides/[framework]/french">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const g = guidesFor(r.framework.id).french;
  return {
    title: g.title,
    description: `${g.intro.split(". ")[0]}. Core French starts in Grade 5; French Immersion usually starts in Kindergarten or Grade 1. How to help at home, even if you don't speak French.`,
    alternates: { canonical: guidePath.french(r.framework) },
  };
}

export default async function FrenchGuidePage({ params }: Props) {
  const r = resolve(await params);
  if (!r) notFound();
  const f = r.framework;
  const g = guidesFor(f.id).french;
  const crumbs = [{ label: "Home", href: "/" }, { label: `${f.shortName} parent guides`, href: guidePath.hub(f) }, { label: "Core French and French Immersion" }];

  return (
    <SitePage cta>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(g.faqs), articleJsonLd({ headline: g.title, description: g.intro, path: guidePath.french(f) })]} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">{g.title}</h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">{g.intro}</p>

      <section aria-labelledby="compare" className="mt-8 max-w-4xl">
        <h2 id="compare" className="mb-3 text-2xl font-bold">
          Core French and French Immersion side by side
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[34rem] text-left font-read">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-3">
                  &nbsp;
                </th>
                <th scope="col" className="p-3">
                  Core French
                </th>
                <th scope="col" className="p-3">
                  French Immersion
                </th>
              </tr>
            </thead>
            <tbody>
              {g.compare.map((row) => (
                <tr key={row.title} className="border-b border-line last:border-0 align-top">
                  <th scope="row" className="p-3 font-bold">
                    {row.title}
                  </th>
                  <td className="p-3">{row.core}</td>
                  <td className="p-3">{row.immersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-read text-sm text-ink-soft">Programs differ by school district. Your school and district have the current details.</p>
      </section>

      {g.sections.map((s) => (
        <section key={s.title} className="mt-8 max-w-3xl">
          <h2 className="text-2xl font-bold">{s.title}</h2>
          <p className="mt-2 font-read text-lg">{s.body}</p>
        </section>
      ))}

      <section aria-labelledby="home" className="mt-10 max-w-3xl">
        <h2 id="home" className="text-2xl font-bold">
          Ways to practise French at home
        </h2>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 font-read text-lg">
          {g.atHome.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-3 font-read text-lg">
          Browse the French lessons by grade:{" "}
          <Link href={curriculumPath.grade(f, "5")} className="font-semibold text-[#2f6fd6] underline">
            Grade 5
          </Link>
          ,{" "}
          <Link href={curriculumPath.grade(f, "k")} className="font-semibold text-[#2f6fd6] underline">
            Kindergarten
          </Link>
          .
        </p>
      </section>

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
        Also see:{" "}
        <Link href={`/report-cards/${f.slug}/`} className="font-semibold text-[#2f6fd6] underline">
          {f.shortName} report cards explained
        </Link>
        .
      </p>
    </SitePage>
  );
}
