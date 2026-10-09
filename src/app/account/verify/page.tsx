import type { Metadata } from "next";
import { VerifyView } from "./VerifyView";

export const metadata: Metadata = { title: "Confirm your email", robots: { index: false, follow: false } };

export default function VerifyPage() {
  return <VerifyView />;
}
