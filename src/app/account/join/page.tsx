import type { Metadata } from "next";
import { JoinForm } from "./JoinForm";

export const metadata: Metadata = { title: "Join your family", robots: { index: false, follow: false } };

export default function JoinPage() {
  return <JoinForm />;
}
