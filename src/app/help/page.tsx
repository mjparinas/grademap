import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/brand";
import { JsonLd } from "@/lib/site";
import { ALL_FAQS, HELP } from "./faqs";

export const metadata: Metadata = {
  title: "Help and questions",
  description: `Answers about getting started, accounts and syncing, how ${APP_NAME} scores practice, calm and focus options, plans and billing.`,
  alternates: { canonical: "/help/" },
};

export default function HelpPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Help" }];
  return (
    <SitePage>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(ALL_FAQS)]} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">Help and questions</h1>
      <p className="mt-2 max-w-2xl font-read text-lg text-ink-soft">
        Can’t find what you need? Email <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and a person will reply.
      </p>
      <nav aria-label="Help topics" className="mt-4 flex flex-wrap gap-2">
        {HELP.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-full border border-line bg-white px-4 py-2 font-semibold hover:bg-black/5">
            {s.title}
          </a>
        ))}
      </nav>
      <div className="mt-8 flex max-w-3xl flex-col gap-10">
        {HELP.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24">
            <h2 id={`${s.id}-h`} className="mb-3 text-2xl font-bold">
              {s.title}
            </h2>
            <div className="flex flex-col gap-2">
              {s.faqs.map((f) => (
                <details key={f.q} className="rounded-2xl border border-line bg-white p-4">
                  <summary className="cursor-pointer text-lg font-semibold">{f.q}</summary>
                  <p className="mt-2 font-read text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm text-ink-soft">
        See also our <Link className="underline" href="/privacy/">privacy policy</Link>, <Link className="underline" href="/terms/">terms of use</Link> and <Link className="underline" href="/pricing/">pricing</Link>.
      </p>
    </SitePage>
  );
}
