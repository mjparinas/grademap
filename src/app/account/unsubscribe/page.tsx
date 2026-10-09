import type { Metadata } from "next";
import { UnsubscribeView } from "./UnsubscribeView";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

export default function UnsubscribePage() {
  return <UnsubscribeView />;
}
