import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Critter } from "@/components/Critter";
import { ReportCardGuide } from "@/components/ReportCardGuide";
import { breadcrumbJsonLd, faqJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { curriculumPath, frameworkBySlug } from "@/components/site/curriculum";
import { guidePath } from "@/components/site/guides";
import { guidesFor } from "@/content/guides";
import { FRAMEWORKS } from "@/content/frameworks";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return FRAMEWORKS.map((f) => ({ framework: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/report-cards/[framework]">): Promise<Metadata> {
  const f = frameworkBySlug((await params).framework);
  if (!f) return {};
  const levels = f.scoringFor("3").levels.map((l) => l.label);
  return {
    title: `${f.shortName} report cards explained: ${levels.join(", ")}`,
    description: `What ${levels.join(", ")} mean on a ${f.name} report card, in plain words, with what each level looks like at home and how to help your child move up.`,
    alternates: { canonical: `/report-cards/${f.slug}/` },
  };
}

export default async function ReportCardsPage({ params }: PageProps<"/report-cards/[framework]">) {
  const f = frameworkBySlug((await params).framework);
  if (!f) notFound();
  const crumbs = [{ label: "Home", href: "/" }, { label: "Report cards", href: "/report-cards/" }, { label: f.name }];

  return (
    <SitePage>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(f.reportCard.faqs)]} />
      <Crumbs items={crumbs} />
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <ReportCardGuide framework={f} grade="3" headingLevel={1} />
        <aside className="flex flex-col gap-4">
          <div className="card flex flex-col items-center gap-3 p-5 text-center lg:sticky lg:top-24">
            <Critter id="ollie" mood="wave" size={110} />
            <p className="text-xl font-bold">See it skill by skill</p>
            <p className="font-read text-ink-soft">
              {APP_NAME} tracks every unit on the same four levels, so you know exactly which skills are Proficient and which need a little more practice before the next report card.
            </p>
            <Link href="/play/" className="btn btn-good min-h-14 w-full text-xl">
              Try it free
            </Link>
            <Link href={curriculumPath.framework(f)} className="font-semibold text-[#2f6fd6] underline">
              Browse the {f.curriculumName}
            </Link>
            <Link href={guidePath.competencies(f)} className="font-semibold text-[#2f6fd6] underline">
              {guidesFor(f.id).competencies.label} explained
            </Link>
            <Link href={guidePath.hub(f)} className="font-semibold text-[#2f6fd6] underline">
              More {f.shortName} parent guides
            </Link>
          </div>
        </aside>
      </div>
    </SitePage>
  );
}
