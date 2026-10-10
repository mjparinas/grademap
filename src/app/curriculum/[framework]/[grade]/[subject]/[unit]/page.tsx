import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd } from "@/components/site/jsonld";
import { SampleQuestion } from "@/components/site/SampleQuestion";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent, resolve, subjectSeoTitle, unitKey } from "@/components/site/curriculum";
import { FRAMEWORKS } from "@/content/frameworks";
import { hashSeed, withSeed } from "@/content/random";
import { GRADE_LABEL, getSubjectMeta, gradeSlug } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { JsonLd, absolute } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return FRAMEWORKS.flatMap((f) =>
    gradesWithContent(f).flatMap((g) =>
      coursesFor(f, g).flatMap((c) =>
        c.units.filter((u) => u.standards[f.id]).map((u) => ({ framework: f.slug, grade: gradeSlug(g), subject: c.subject, unit: u.id })),
      ),
    ),
  );
}

type Props = PageProps<"/curriculum/[framework]/[grade]/[subject]/[unit]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve(await params);
  if (!r?.course || !r.unit) return {};
  const { framework: f, grade, course, unit } = r;
  return {
    title: `${unit.title}: ${GRADE_LABEL[grade]} ${subjectSeoTitle(course.subject)} practice (${f.shortName})`,
    description: `${unit.parentNote} Free ${GRADE_LABEL[grade]} sample questions with answers, matched to the ${f.curriculumName}.`,
    alternates: { canonical: curriculumPath.unit(f, grade, course.subject, unit.id) },
  };
}

export default async function UnitPage({ params }: Props) {
  const r = resolve(await params);
  if (!r?.course || !r.unit) notFound();
  const { framework: f, grade, course, unit } = r;
  const key = unitKey(grade, course.subject, unit.id);
  const meta = getSubjectMeta(course.subject);
  const name = subjectSeoTitle(course.subject);
  // Seeded, so the page is the same on every build (good for caching and search engines).
  const questions = withSeed(hashSeed(key), () => unit.generate({ difficulty: 2 })).slice(0, 6);
  const index = course.units.indexOf(unit);
  const prev = course.units[index - 1];
  const next = course.units[index + 1];
  const path = curriculumPath.unit(f, grade, course.subject, unit.id);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Curriculum", href: curriculumPath.index() },
    { label: f.curriculumName, href: curriculumPath.framework(f) },
    { label: GRADE_LABEL[grade], href: curriculumPath.grade(f, grade) },
    { label: name, href: curriculumPath.subject(f, grade, course.subject) },
    { label: unit.title },
  ];

  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: `${unit.title} (${GRADE_LABEL[grade]} ${name})`,
            description: unit.parentNote,
            url: absolute(path),
            inLanguage: "en-CA",
            learningResourceType: "Practice problems",
            interactivityType: "active",
            isAccessibleForFree: true,
            educationalLevel: GRADE_LABEL[grade],
            about: name,
            provider: { "@type": "Organization", name: APP_NAME },
            educationalAlignment: unit.standards[f.id]
              ? [
                  {
                    "@type": "AlignmentObject",
                    alignmentType: "teaches",
                    educationalFramework: f.curriculumName,
                    targetName: unit.standards[f.id],
                  },
                ]
              : undefined,
          },
        ]}
      />
      <Crumbs items={crumbs} />

      <header className="flex flex-col gap-3 rounded-3xl p-6 sm:flex-row sm:items-center" style={{ background: meta.colourSoft }}>
        <span className="text-6xl" aria-hidden="true">
          {unit.emoji}
        </span>
        <div>
          <p className="font-semibold text-ink-soft">
            {GRADE_LABEL[grade]} · {name} · Unit {index + 1} of {course.units.length}
          </p>
          <h1 className="text-4xl font-bold">{unit.title}</h1>
          <p className="mt-1 font-read text-lg">{unit.blurb}</p>
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="about">
          <h2 id="about" className="text-2xl font-bold">
            What your child practises
          </h2>
          <p className="mt-2 font-read text-lg">{unit.parentNote}</p>
          {unit.standards[f.id] && (
            <p className="mt-3 rounded-2xl bg-white p-4 font-read">
              <b>{f.curriculumName} {f.standardLabel.toLowerCase()}:</b> {unit.standards[f.id]}
            </p>
          )}
        </section>
        <aside className="card flex flex-col gap-3 p-5">
          <p className="text-lg font-bold">Practise this unit</p>
          <p className="font-read text-ink-soft">New questions every time, with hints, read-aloud and rewards. Works offline.</p>
          <Link href="/play/" className="btn btn-good min-h-14 text-xl">
            Play free
          </Link>
        </aside>
      </div>

      <section aria-labelledby="samples" className="mt-8">
        <h2 id="samples" className="mb-1 text-2xl font-bold">
          Sample questions
        </h2>
        <p className="mb-4 font-read text-ink-soft">A taste of this unit. In the app, questions change every time and get easier or harder to match your child.</p>
        <ol className="grid items-start gap-4 md:grid-cols-2">
          {questions.map((q, i) => (
            <SampleQuestion key={i} q={q} n={i + 1} seedText={`${key}#${i}`} />
          ))}
        </ol>
      </section>

      <nav aria-label="More units" className="mt-8 flex flex-wrap justify-between gap-3">
        {prev ? (
          <Link href={curriculumPath.unit(f, grade, course.subject, prev.id)} className="btn min-h-12 px-4 text-lg">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={curriculumPath.unit(f, grade, course.subject, next.id)} className="btn min-h-12 px-4 text-lg">
            {next.title} →
          </Link>
        )}
      </nav>

      <section aria-labelledby="related" className="mt-8">
        <h2 id="related" className="mb-3 text-xl font-bold">
          More {GRADE_LABEL[grade]}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {coursesFor(f, grade)
            .filter((c) => c.subject !== course.subject)
            .map((c) => (
              <li key={c.subject}>
                <Link href={curriculumPath.subject(f, grade, c.subject)} className="inline-flex rounded-full bg-white px-3 py-1.5 font-semibold hover:bg-[#e6f0ff]">
                  {getSubjectMeta(c.subject).emoji} {subjectSeoTitle(c.subject)}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </SitePage>
  );
}
