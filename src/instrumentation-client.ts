import { scrubEvent } from "@/lib/sentry-scrub";

// Browser error reporting. Off unless NEXT_PUBLIC_SENTRY_DSN is set. The library is loaded after
// the page is ready, so it never slows the first load of the kids' app or the public pages.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn && typeof window !== "undefined") {
  const start = () =>
    void import("@sentry/nextjs").then((Sentry) =>
      Sentry.init({
        dsn,
        environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
        tracesSampleRate: 0,
        // Only the error handlers: no replay, no profiling, no breadcrumbs of taps.
        integrations: (defaults) => defaults.filter((i) => ["GlobalHandlers", "Dedupe", "InboundFilters", "FunctionToString", "LinkedErrors"].includes(i.name)),
        beforeSend: scrubEvent,
      }),
    );
  if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 5000 });
  else setTimeout(start, 2000);
}
