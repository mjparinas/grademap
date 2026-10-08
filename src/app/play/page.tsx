import type { Metadata } from "next";
import { PlayApp } from "@/components/play/PlayApp";

export const metadata: Metadata = {
  title: "Play",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PlayApp />;
}
