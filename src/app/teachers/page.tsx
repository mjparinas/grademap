import type { Metadata } from "next";
import { TeacherApp } from "@/components/teachers/TeacherApp";

export const metadata: Metadata = {
  title: "For teachers",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <TeacherApp />;
}
