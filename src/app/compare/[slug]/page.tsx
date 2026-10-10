import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { guidePath } from "@/components/site/guides";
import { COMPETITORS, PRICE_CHECKED, competitorBySlug } from "@/content/compare";
import { APP_NAME } from "@/lib/brand";
import { FREE_UNITS_PER_COURSE, PRICES, TRIAL_DAYS } from "@/lib/plan";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

type Props = PageProps<"/compare/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = competitorBySlug((await params).slug);
  if (!c) return {};
  return {
    title: `${APP_NAME} vs ${c.name} for BC and Ontario families`,
    description: `${APP_NAME} compared with ${c.name}: price, curriculum match, how progress is shown and what kids see. A fair look at who each is best for.`,
    alternates: { canonical: guidePath.compare(c.slug) },
  };
}

export default async function ComparePage({ params }: Props) {
  const c = competitorBySlug((await params).slug);
  if (!c) notFound();
  const crumbs = [{ label: "Home", href: "/" }, { label: "Compare", href: guidePath.compareIndex() }, { label: `${APP_NAME} vs ${c.name}` }];
  const title = `${APP_NAME} vs ${c.name} for BC and Ontario families`;

  return (
    <SitePage>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(c.faqs), articleJsonLd({ headline: title, description: c.summary, path: guidePath.compare(c.slug) })]} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">{c.summary}</p>

      <section aria-labelledby="good" className="mt-8 max-w-3xl">
        <h2 id="good" className="text-2xl font-bold">
          What {c.name} does well
        </h2>
        <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 font-read text-lg">
          {c.goodAt.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="diff" className="mt-10">
        <h2 id="diff" className="mb-3 text-2xl font-bold">
          How they differ
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[40rem] text-left font-read">
            <caption className="sr-only">
              {APP_NAME} compared with {c.name}
            </caption>
            <thead className="bg-paper">
              <tr>
                <th scope="col" className="p-3">
                  &nbsp;
                </th>
                <th scope="col" className="p-3">
                  {c.name}
                </th>
                <th scope="col" className="p-3">
                  {APP_NAME}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.differences.map((d) => (
                <tr key={d.topic} className="border-t border-line align-top">
                  <th scope="row" className="p-3 font-bold">
                    {d.topic}
                  </th>
                  <td className="p-3">{d.them}</td>
                  <td className="p-3">{d.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-read text-sm text-ink-soft">
          {APP_NAME} family plan: {PRICES.month.label} or {PRICES.year.label}, with a {TRIAL_DAYS}-day free trial and the first {FREE_UNITS_PER_COURSE} units of every course free afterwards. Facts about {c.name} are from its public pages, checked {PRICE_CHECKED}. Prices and features change, so please confirm on their site.
        </p>
      </section>

      <section aria-labelledby="choose" className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="card p-5">
          <h2 id="choose" className="text-xl font-bold">
            {c.name} may suit you if
          </h2>
          <ul className="mt-2 list-disc pl-5 font-read">
            {c.chooseThem.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-xl font-bold">{APP_NAME} may suit you if</h2>
          <ul className="mt-2 list-disc pl-5 font-read">
            {c.chooseUs.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq" className="mt-10 max-w-3xl">
        <h2 id="faq" className="mb-3 text-2xl font-bold">
          Common questions
        </h2>
        <div className="flex flex-col gap-2">
          {c.faqs.map((q) => (
            <details key={q.q} className="rounded-2xl border border-line bg-white p-4">
              <summary className="cursor-pointer font-bold">{q.q}</summary>
              <p className="mt-2 font-read">{q.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="sources" className="mt-10 max-w-3xl">
        <h2 id="sources" className="text-xl font-bold">
          Sources
        </h2>
        <ul className="mt-2 list-disc pl-5 font-read">
          {c.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} rel="noopener noreferrer nofollow" className="text-[#2f6fd6] underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-read text-sm text-ink-soft">
          {APP_NAME} is not affiliated with {c.name}. Product names belong to their owners.
        </p>
      </section>

      <section className="card mt-10 flex flex-col gap-2 p-6">
        <p className="text-xl font-bold">Try {APP_NAME} free for {TRIAL_DAYS} days</p>
        <p className="font-read text-ink-soft">No card needed. Everything is on, and your child’s progress is reported in your province’s report-card levels.</p>
        <Link href="/play/" className="btn btn-good min-h-14 w-fit px-8 text-xl">
          Try it free
        </Link>
      </section>
    </SitePage>
  );
}
