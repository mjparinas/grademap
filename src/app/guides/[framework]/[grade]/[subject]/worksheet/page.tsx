import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/site/PrintButton";
import { SampleQuestion, answerText } from "@/components/site/SampleQuestion";
import { breadcrumbJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { coursesFor, curriculumPath, gradesWithContent, resolve, subjectSeoTitle, unitKey } from "@/components/site/curriculum";
import { guidePath } from "@/components/site/guides";
import { hashSeed, withSeed } from "@/content/random";
import { GUIDE_FRAMEWORKS } from "@/content/guides";
import { GRADE_LABEL, getSubjectMeta, gradeSlug } from "@/content/subjects";
import type { Course, Question } from "@/content/types";
import { APP_NAME } from "@/lib/brand";
import { JsonLd, absolute } from "@/lib/site";

export const dynamicParams = false;

const SHEET_QUESTIONS = 10;

export function generateStaticParams() {
  return GUIDE_FRAMEWORKS.flatMap((f) =>
    gradesWithContent(f).flatMap((g) => coursesFor(f, g).map((c) => ({ framework: f.slug, grade: gradeSlug(g), subject: c.subject }))),
  );
}

type Props = PageProps<"/guides/[framework]/[grade]/[subject]/worksheet">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve(await params);
  if (!r?.course) return {};
  const { framework: f, grade, course } = r;
  const name = subjectSeoTitle(course.subject);
  return {
    title: `Free printable ${GRADE_LABEL[grade]} ${name} practice sheet (${f.shortName})`,
    description: `A free ${GRADE_LABEL[grade]} ${name.toLowerCase()} practice sheet with an answer key, matched to the ${f.curriculumName}. Print it or work through it on screen.`,
    alternates: { canonical: guidePath.worksheet(f, grade, course.subject) },
  };
}

/** One question per unit, round-robin, seeded so the sheet is identical on every build. */
function sheetQuestions(course: Course): { q: Question; unit: string; seed: string }[] {
  const picked: { q: Question; unit: string; seed: string }[] = [];
  const pools = course.units.map((u) => {
    const key = unitKey(course.grade, course.subject, u.id);
    return { u, key, qs: withSeed(hashSeed(`sheet:${key}`), () => u.generate({ difficulty: 2 })) };
  });
  for (let round = 0; picked.length < SHEET_QUESTIONS && round < 3; round++) {
    for (const p of pools) {
      if (picked.length >= SHEET_QUESTIONS) break;
      const q = p.qs[round];
      if (q) picked.push({ q, unit: p.u.title, seed: `${p.key}#sheet${round}` });
    }
  }
  return picked;
}

export default async function WorksheetPage({ params }: Props) {
  const r = resolve(await params);
  if (!r?.course) notFound();
  const { framework: f, grade, course } = r;
  const label = GRADE_LABEL[grade];
  const name = subjectSeoTitle(course.subject);
  const meta = getSubjectMeta(course.subject);
  const items = sheetQuestions(course);
  const path = guidePath.worksheet(f, grade, course.subject);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: `${f.shortName} parent guides`, href: guidePath.hub(f) },
    { label, href: guidePath.grade(f, grade) },
    { label: `${name} at home`, href: guidePath.subject(f, grade, course.subject) },
    { label: "Practice sheet" },
  ];

  return (
    <SitePage>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: `${label} ${name} practice sheet (${f.shortName})`,
            description: `Free ${label} ${name.toLowerCase()} practice questions with an answer key, matched to the ${f.curriculumName}.`,
            url: absolute(path),
            inLanguage: "en-CA",
            learningResourceType: "Worksheet",
            educationalUse: "practice",
            isAccessibleForFree: true,
            educationalLevel: label,
            about: name,
            provider: { "@type": "Organization", name: APP_NAME },
          },
        ]}
      />
      <div className="print:hidden">
        <Crumbs items={crumbs} />
      </div>
      <header className="flex flex-col gap-3 rounded-3xl p-6 sm:flex-row sm:items-center print:rounded-none print:p-0" style={{ background: meta.colourSoft }}>
        <span className="text-5xl print:hidden" aria-hidden="true">
          {meta.emoji}
        </span>
        <div className="flex-1">
          <h1 className="text-4xl font-bold print:text-3xl">
            {label} {name} practice sheet
          </h1>
          <p className="font-read text-lg">
            {f.curriculumName} · from {APP_NAME} · Name: ______________________
          </p>
        </div>
        <PrintButton />
      </header>

      <ol className="mt-6 grid items-start gap-4 md:grid-cols-2 print:block print:space-y-4">
        {items.map((it, i) => (
          <SampleQuestion key={i} q={it.q} n={i + 1} seedText={it.seed} className="print:break-inside-avoid" />
        ))}
      </ol>

      <section aria-labelledby="key" className="mt-10 rounded-3xl bg-white p-6 print:break-before-page">
        <h2 id="key" className="text-2xl font-bold">
          Answer key
        </h2>
        <ol className="mt-3 grid gap-x-8 gap-y-1 font-read text-lg sm:grid-cols-2">
          {items.map((it, i) => (
            <li key={i}>
              <b>{i + 1}.</b> {answerText(it.q)} <span className="text-sm text-ink-soft">({it.unit})</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card mt-10 flex flex-col gap-3 p-6 print:hidden sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-xl font-bold">Want more than 10 questions?</p>
          <p className="font-read text-ink-soft">
            In {APP_NAME} the questions change every time and adjust to your child, with hints and kind feedback.{" "}
            <Link href={curriculumPath.subject(f, grade, course.subject)} className="font-semibold text-[#2f6fd6] underline">
              See all {name.toLowerCase()} units
            </Link>
            .
          </p>
        </div>
        <Link href="/play/" className="btn btn-good min-h-12 px-6 text-lg">
          Try it free
        </Link>
      </section>
    </SitePage>
  );
}
