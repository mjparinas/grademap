import type { Metadata } from "next";
import Link from "next/link";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent } from "@/components/site/curriculum";
import { FRAMEWORKS } from "@/content/frameworks";
import { GRADE_LABEL } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Curriculum: what kids practise in each grade",
  description: `Browse every unit ${APP_NAME} covers from Kindergarten to Grade 9, by curriculum, grade and subject, with sample questions and the learning standards each one matches.`,
  alternates: { canonical: curriculumPath.index() },
};

export default function CurriculumIndex() {
  return (
    <SitePage cta>
      <Crumbs items={[{ label: "Home", href: "/" }, { label: "Curriculum" }]} />
      <h1 className="text-4xl font-bold">Curriculum</h1>
      <p className="mt-2 max-w-2xl font-read text-lg text-ink-soft">Pick a curriculum to see the units for each grade and subject, with sample questions.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {FRAMEWORKS.map((f) => (
          <section key={f.id} className="card p-6">
            <h2 className="text-2xl font-bold">
              <Link href={curriculumPath.framework(f)} className="hover:underline">
                {f.curriculumName}
              </Link>
            </h2>
            <p className="font-read text-ink-soft">{f.name}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {gradesWithContent(f).map((g) => (
                <li key={g}>
                  <Link href={curriculumPath.grade(f, g)} className="inline-flex rounded-full bg-paper px-3 py-1.5 font-semibold hover:bg-[#e6f0ff]">
                    {GRADE_LABEL[g]} <span className="ml-1 text-ink-soft">({coursesFor(f, g).reduce((n, c) => n + c.units.length, 0)})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="rounded-3xl border-2 border-dashed border-line p-6">
          <h2 className="text-2xl font-bold">More coming</h2>
          <p className="font-read text-ink-soft">Other provinces and US states are on the way. The same lessons, matched to your local curriculum and report card.</p>
        </section>
      </div>
    </SitePage>
  );
}
