import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { TeacherCta } from "@/components/site/TeacherCta";
import { coursesFor, curriculumPath, gradesWithContent, resolve, subjectSeoTitle } from "@/components/site/curriculum";
import { TEACHER_FRAMEWORKS, teacherPath } from "@/components/site/teachers";
import { GRADE_LABEL, getSubjectMeta, gradeSlug } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEACHER_FRAMEWORKS.flatMap((f) => gradesWithContent(f).map((g) => ({ framework: f.slug, grade: gradeSlug(g) })));
}

type Props = PageProps<"/for-teachers/[framework]/[grade]">;

async function find(params: Props["params"]) {
  const r = resolve(await params);
  return r && TEACHER_FRAMEWORKS.includes(r.framework) ? r : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await find(params);
  if (!r) return {};
  const { framework: f, grade } = r;
  const subjects = coursesFor(f, grade).map((c) => subjectSeoTitle(c.subject).toLowerCase());
  return {
    title: `${GRADE_LABEL[grade]} ${f.shortName} units to assign to your class`,
    description: `${GRADE_LABEL[grade]} ${f.curriculumName} units for teachers: ${subjects.join(", ")}. Assign them to your class in ${APP_NAME} and see each student's practice.`,
    alternates: { canonical: teacherPath.grade(f, grade) },
  };
}

export default async function TeacherGradePage({ params }: Props) {
  const r = await find(params);
  if (!r) notFound();
  const { framework: f, grade } = r;
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "For teachers", href: teacherPath.hub() },
    { label: f.region, href: teacherPath.framework(f) },
    { label: GRADE_LABEL[grade] },
  ];
  const grades = gradesWithContent(f);
  const i = grades.indexOf(grade);

  return (
    <SitePage>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">
        {GRADE_LABEL[grade]} {f.shortName} units to assign
      </h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">
        Every {GRADE_LABEL[grade]} unit in {APP_NAME}, matched to the {f.curriculumName}. Open a unit to read what it covers and try sample questions, then assign it to your class.
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {coursesFor(f, grade).map((c) => {
          const meta = getSubjectMeta(c.subject);
          return (
            <section key={c.subject} className="card overflow-hidden" style={{ borderColor: meta.colour }}>
              <h2 className="flex items-center gap-2 px-5 py-3 text-2xl font-bold" style={{ background: meta.colourSoft }}>
                <span aria-hidden="true">{meta.emoji}</span>
                {subjectSeoTitle(c.subject)}
              </h2>
              <ul className="divide-y divide-line">
                {c.units.map((u) => (
                  <li key={u.id}>
                    <Link href={curriculumPath.unit(f, grade, c.subject, u.id)} className="flex items-start gap-3 px-5 py-3 hover:bg-paper">
                      <span className="text-2xl" aria-hidden="true">
                        {u.emoji}
                      </span>
                      <span>
                        <span className="block font-bold">{u.title}</span>
                        <span className="block font-read text-sm text-ink-soft">{u.blurb}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <nav aria-label="Other grades" className="mt-8 flex flex-wrap justify-between gap-3">
        {i > 0 ? (
          <Link href={teacherPath.grade(f, grades[i - 1])} className="btn min-h-12 px-4 text-lg">
            ← {GRADE_LABEL[grades[i - 1]]}
          </Link>
        ) : (
          <span />
        )}
        {i < grades.length - 1 && (
          <Link href={teacherPath.grade(f, grades[i + 1])} className="btn min-h-12 px-4 text-lg">
            {GRADE_LABEL[grades[i + 1]]} →
          </Link>
        )}
      </nav>
      <TeacherCta />
    </SitePage>
  );
}
