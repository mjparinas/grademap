import type { ErrorEvent } from "@sentry/nextjs";

// Error reports are for fixing bugs, never for learning about families. Everything that could
// identify a person or a child is removed before a report leaves the server or the browser.

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const TOKEN = /(\btoken=)[^&#\s]+/gi;

export function scrubText(text: string): string {
  return text.replace(EMAIL, "[email]").replace(TOKEN, "$1[removed]");
}

export function scrubEvent(event: ErrorEvent): ErrorEvent | null {
  delete event.user;
  delete event.server_name;
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.query_string;
    if (event.request.url) event.request.url = scrubText(event.request.url);
  }
  if (event.message) event.message = scrubText(event.message);
  for (const ex of event.exception?.values ?? []) if (ex.value) ex.value = scrubText(ex.value);
  event.breadcrumbs = (event.breadcrumbs ?? [])
    // Request bodies and tap targets can contain names; keep only that something happened.
    .filter((b) => b.category !== "ui.click" && b.category !== "ui.input")
    .map((b) => ({ ...b, message: b.message ? scrubText(b.message) : b.message, data: undefined }));
  delete event.contexts?.device;
  return event;
}
