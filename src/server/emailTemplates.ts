import "server-only";
import { APP_NAME, CONTACT_EMAIL } from "@/lib/brand";
import type { Email } from "./email";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

interface Parts {
  to: string;
  subject: string;
  heading: string;
  /** Plain paragraphs. */
  body: string[];
  button?: { label: string; url: string };
  /** Small print under the button. */
  footnote?: string;
  unsubscribeUrl?: string;
  origin: string;
}

/** One simple layout for every email: no images, no tracking pixels. */
function layout(p: Parts): Email {
  const button = p.button
    ? `<p style="margin:24px 0"><a href="${esc(p.button.url)}" style="background:#25b47e;color:#fff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:12px;display:inline-block">${esc(p.button.label)}</a></p>`
    : "";
  const html = `<!doctype html><html><body style="margin:0;background:#f7f5f0;font-family:system-ui,Segoe UI,Arial,sans-serif;color:#1d2233">
<div style="max-width:520px;margin:0 auto;padding:24px">
<p style="font-size:22px;font-weight:700;margin:0 0 16px"><span style="color:#4f8ef7">Grade</span><span style="color:#e9559a">Map</span></p>
<div style="background:#fff;border-radius:16px;padding:24px;line-height:1.55">
<h1 style="font-size:22px;margin:0 0 12px">${esc(p.heading)}</h1>
${p.body.map((t) => `<p style="margin:0 0 12px">${esc(t)}</p>`).join("")}
${button}
${p.footnote ? `<p style="font-size:13px;color:#5b6478;margin:0">${esc(p.footnote)}</p>` : ""}
</div>
<p style="font-size:12px;color:#5b6478;margin:16px 4px 0">${esc(APP_NAME)} has no ads and never sells your information. <a href="${esc(p.origin)}/privacy/" style="color:#5b6478">Privacy</a> · Questions? ${esc(CONTACT_EMAIL)}${p.unsubscribeUrl ? ` · <a href="${esc(p.unsubscribeUrl)}" style="color:#5b6478">Unsubscribe</a>` : ""}</p>
</div></body></html>`;
  const text = [
    p.heading,
    "",
    ...p.body,
    ...(p.button ? ["", `${p.button.label}: ${p.button.url}`] : []),
    ...(p.footnote ? ["", p.footnote] : []),
    "",
    `${APP_NAME} has no ads and never sells your information. Privacy: ${p.origin}/privacy/`,
    ...(p.unsubscribeUrl ? [`Unsubscribe: ${p.unsubscribeUrl}`] : []),
  ].join("\n");
  return { to: p.to, subject: p.subject, html, text, unsubscribeUrl: p.unsubscribeUrl };
}

export function verifyEmail(to: string, origin: string, token: string): Email {
  return layout({
    to,
    origin,
    subject: `Confirm your email for ${APP_NAME}`,
    heading: `Welcome to ${APP_NAME}!`,
    body: ["Please confirm your email address so we can reach you about your account, and so you can reset your password if you ever forget it."],
    button: { label: "Confirm my email", url: `${origin}/account/verify/?token=${encodeURIComponent(token)}` },
    footnote: "This link works for 3 days. If you didn't create an account, you can ignore this email.",
  });
}

export function resetEmail(to: string, origin: string, token: string): Email {
  return layout({
    to,
    origin,
    subject: `Reset your ${APP_NAME} password`,
    heading: "Reset your password",
    body: ["We received a request to reset the password for your account. Use the button below to choose a new one."],
    button: { label: "Choose a new password", url: `${origin}/account/reset/?token=${encodeURIComponent(token)}` },
    footnote: "This link works for 1 hour and can be used once. If you didn't ask for this, you can ignore this email; your password hasn't changed.",
  });
}

export function trialEndingEmail(to: string, origin: string, daysLeft: number, unsubscribeUrl: string): Email {
  return layout({
    to,
    origin,
    unsubscribeUrl,
    subject: `Your ${APP_NAME} free trial ends in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`,
    heading: `Your free trial ends in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`,
    body: [
      "After the trial, the first 2 units of every course stay free forever. The family plan keeps everything unlocked for up to 4 children.",
      "There's nothing to do if you'd like to stay on the free units. No card was needed to start.",
    ],
    button: { label: "See plans", url: `${origin}/parents/#/subscription` },
  });
}

export interface WeeklyChild {
  name: string;
  minutes: number;
  answers: number;
  accuracy: number | null;
  strength?: string;
  next?: string;
}

export function weeklyEmail(to: string, origin: string, children: WeeklyChild[], unsubscribeUrl: string): Email {
  const lines = children.flatMap((c) => [
    c.answers
      ? `${c.name}: ${c.minutes} min of practice, ${c.answers} questions${c.accuracy === null ? "" : `, ${c.accuracy}% right on the first try`}.`
      : `${c.name} didn't practise this week. A short session today is a great restart.`,
    ...(c.strength ? [`  Going well: ${c.strength}`] : []),
    ...(c.next ? [`  Next up: ${c.next}`] : []),
  ]);
  return layout({
    to,
    origin,
    unsubscribeUrl,
    subject: `${APP_NAME}: your week in learning`,
    heading: "Your week in learning",
    body: [...lines, "This reflects practice in the app. It isn't a report-card mark; your child's teacher decides proficiency."],
    button: { label: "Open full reports", url: `${origin}/parents/#/reports` },
  });
}

export function questionReportEmail(to: string, p: { unitKey: string; prompt: string; reason: string }, origin: string): Email {
  return layout({
    to,
    origin,
    subject: `Question reported: ${p.unitKey}`,
    heading: "A question was reported",
    body: [`Unit: ${p.unitKey}`, `Reason: ${p.reason}`, `Question: ${p.prompt}`],
  });
}
