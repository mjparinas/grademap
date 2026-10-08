import type { Metadata } from "next";
import { UnitList } from "@/components/UnitList";
import { getSubject, SUBJECTS } from "@/lib/curriculum";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBJECTS.map((s) => ({ subject: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[subject]">): Promise<Metadata> {
  const { subject } = await params;
  return { title: `Grade 2 ${getSubject(subject)?.title ?? ""}` };
}

export default async function Page({ params }: PageProps<"/learn/[subject]">) {
  const { subject } = await params;
  return <UnitList subjectId={subject} />;
}
