import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd } from "@/components/site/jsonld";
import { Crumbs, SitePage } from "@/components/site/SiteChrome";
import { TeacherCta } from "@/components/site/TeacherCta";
import { coursesFor, frameworkBySlug, gradesWithContent, subjectSeoTitle } from "@/components/site/curriculum";
import { TEACHER_FRAMEWORKS, teacherPath } from "@/components/site/teachers";
import { GRADE_LABEL, SUBJECTS, isCoreSubject } from "@/content/subjects";
import { APP_NAME } from "@/lib/brand";
import { JsonLd } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return TEACHER_FRAMEWORKS.map((f) => ({ framework: f.slug }));
}

type Props = PageProps<"/for-teachers/[framework]">;

async function find(params: Props["params"]) {
  const f = frameworkBySlug((await params).framework);
  return f && TEACHER_FRAMEWORKS.includes(f) ? f : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = await find(params);
  if (!f) return {};
  return {
    title: `${f.region} classroom practice for teachers, Kindergarten to Grade 9`,
    description: `Assign ${f.curriculumName} units to your class in ${APP_NAME}: math, English language arts, science and social studies for every grade, with a free sample question for each unit.`,
    alternates: { canonical: teacherPath.framework(f) },
  };
}

export default async function TeacherFrameworkPage({ params }: Props) {
  const f = await find(params);
  if (!f) notFound();
  const crumbs = [{ label: "Home", href: "/" }, { label: "For teachers", href: teacherPath.hub() }, { label: f.region }];
  const grades = gradesWithContent(f);

  return (
    <SitePage>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Crumbs items={crumbs} />
      <h1 className="text-4xl font-bold">{f.region} classroom practice, Kindergarten to Grade 9</h1>
      <p className="mt-2 max-w-3xl font-read text-lg text-ink-soft">
        Every unit is matched to a {f.curriculumName} learning standard, so you can assign practice that lines up with what you are teaching. Choose your grade to see the units.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {grades.map((g) => (
          <Link key={g} href={teacherPath.grade(f, g)} className="card flex flex-col gap-1 p-4 hover:border-[#4f8ef7]">
            <span className="text-xl font-bold">{GRADE_LABEL[g]}</span>
            <span className="text-sm text-ink-soft">{coursesFor(f, g).reduce((n, c) => n + c.units.length, 0)} units</span>
            <span className="text-lg" aria-hidden="true">
              {SUBJECTS.filter((s) => isCoreSubject(s.id) && coursesFor(f, g).some((c) => c.subject === s.id)).map((s) => s.emoji).join(" ")}
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-6 max-w-3xl font-read text-ink-soft">
        Subjects include {f.subjects.map((s) => subjectSeoTitle(s)).join(", ")}. Practice results describe how a student is practising, not a report-card mark.
      </p>
      <TeacherCta />
    </SitePage>
  );
}
