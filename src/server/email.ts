import "server-only";

// Email goes out through Resend over plain HTTPS (no SDK). Set RESEND_API_KEY and EMAIL_FROM
// (for example `Gradelings <hello@gradelings.com>`). Without a key, emails are logged in
// development and skipped in production, so the rest of the app keeps working.

export interface Email {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Adds the one-click unsubscribe header to bulk mail like the weekly report. */
  unsubscribeUrl?: string;
}

export interface SentEmail extends Email {
  at: number;
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

/** In development and tests, emails are kept here instead of being sent. */
export function outbox(): SentEmail[] {
  const g = globalThis as unknown as { __gmOutbox?: SentEmail[] };
  return (g.__gmOutbox ??= []);
}

export async function sendEmail(email: Email): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!emailConfigured()) {
    if (process.env.NODE_ENV === "production") return { ok: false, skipped: true };
    outbox().push({ ...email, at: Date.now() });
    if (process.env.NODE_ENV !== "test") console.log(`[email] to ${email.to}: ${email.subject}\n${email.text}`);
    return { ok: true, skipped: true };
  }
  try {
    const res = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(email.unsubscribeUrl
          ? { headers: { "List-Unsubscribe": `<${email.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } }
          : {}),
      }),
    });
    if (!res.ok) console.error(`[email] Resend answered ${res.status}`);
    return { ok: res.ok };
  } catch (e) {
    console.error("[email] could not reach Resend", (e as Error).message);
    return { ok: false };
  }
}
