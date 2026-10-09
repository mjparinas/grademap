"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Cookieless page-view counts and page-speed measurements for the public site only. The kids' app, the parent area and
// shared reports are never measured, so nothing a child does reaches analytics.
const PRIVATE_PREFIXES = ["/play", "/parents", "/shared", "/account", "/api"];

function isPublic(url: string): boolean {
  const { pathname } = new URL(url, "https://example.invalid");
  return !PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function viewsBeforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  return isPublic(event.url) ? event : null;
}

function speedBeforeSend<T extends { url: string }>(event: T): T | null {
  return isPublic(event.url) ? event : null;
}

export function SiteAnalytics() {
  if (!process.env.NEXT_PUBLIC_ON_VERCEL) return null;
  return (
    <>
      <Analytics beforeSend={viewsBeforeSend} />
      <SpeedInsights beforeSend={speedBeforeSend} />
    </>
  );
}
