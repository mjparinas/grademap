import type { Metadata } from "next";
import { Player } from "@/components/Player";
import { getUnit, SUBJECTS } from "@/lib/curriculum";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBJECTS.flatMap((s) => s.units.map((u) => ({ subject: s.id, unit: u.id })));
}

export async function generateMetadata({ params }: PageProps<"/learn/[subject]/[unit]">): Promise<Metadata> {
  const { subject, unit } = await params;
  const found = getUnit(subject, unit);
  return {
    title: found ? `${found.unit.title} · Grade 2 ${found.subject.title}` : "Lesson",
    description: found ? `${found.unit.parentNote} BC learning standard: ${found.unit.standard}.` : undefined,
  };
}

export default async function Page({ params }: PageProps<"/learn/[subject]/[unit]">) {
  const { subject, unit } = await params;
  return <Player subjectId={subject} unitId={unit} />;
}
