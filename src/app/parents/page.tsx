import type { Metadata } from "next";
import { ParentApp } from "@/components/parents/ParentApp";

export const metadata: Metadata = {
  title: "For parents",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ParentApp />;
}
