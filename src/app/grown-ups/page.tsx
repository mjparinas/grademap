import type { Metadata } from "next";
import { GrownUps } from "@/components/GrownUps";

export const metadata: Metadata = { title: "For grown-ups" };

export default function Page() {
  return <GrownUps />;
}
