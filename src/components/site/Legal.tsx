import type { ReactNode } from "react";
import { LEGAL_UPDATED } from "@/lib/brand";
import { Crumbs, SitePage } from "./SiteChrome";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <SitePage>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <article className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">Last updated {LEGAL_UPDATED}</p>
        <p className="mt-4 font-read text-lg">{intro}</p>
        <div className="mt-6 flex flex-col gap-6">{children}</div>
      </article>
    </SitePage>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-2 flex flex-col gap-3 font-read text-lg leading-relaxed [&_a]:text-[#2f6fd6] [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">{children}</div>
    </section>
  );
}
