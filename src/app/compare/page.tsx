import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { guidePath } from "@/components/site/guides";
import { COMPETITORS } from "@/content/compare";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: `${APP_NAME} compared with IXL, Khan Academy and Prodigy`,
  description: `A fair, plain comparison of ${APP_NAME} with other learning apps for Canadian families: price, curriculum match, how progress is shown and what kids see.`,
  alternates: { canonical: guidePath.compareIndex() },
};

export default function CompareIndex() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Compare" }];
  return (
    <SitePage cta>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">{APP_NAME} compared with other learning apps</h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">
        Every app is good at something. These pages say what each one does well, where {APP_NAME} is different, and who each is best for.
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {COMPETITORS.map((c) => (
          <li key={c.slug} className="card flex flex-col gap-2 p-5">
            <Link href={guidePath.compare(c.slug)} className="text-xl font-bold hover:underline">
              {APP_NAME} vs {c.name}
            </Link>
            <p className="font-read text-ink-soft">{c.summary}</p>
          </li>
        ))}
      </ul>
    </SitePage>
  );
}
