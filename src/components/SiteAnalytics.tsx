"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

// Cookieless page-view counts for the public site only. The kids' app, the parent area and
// shared reports are never measured, so nothing a child does reaches analytics.
const PRIVATE_PREFIXES = ["/play", "/parents", "/shared", "/account", "/api"];

function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  const { pathname } = new URL(event.url, "https://example.invalid");
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ? null : event;
}

export function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
