import { loadChildReport, familyProfileIds } from "@/server/reportData";
import { unsubscribeToken } from "@/server/auth";
import { query, run } from "@/server/db";
import { sendEmail } from "@/server/email";
import { trialEndingEmail, weeklyEmail, type WeeklyChild } from "@/server/emailTemplates";

// Runs once a day (see vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`.
// Every day: a "trial ends soon" notice to confirmed parents, once. On Sundays: the weekly report
// to parents who opted in.

const DAY = 86_400_000;
export const maxDuration = 300;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "") || new URL(req.url).origin;
  const now = Date.now();
  const result = { trialNotices: 0, weekly: 0 };

  // Trial ending within 3 days, not subscribed, not told yet.
  const trials = await query<{ id: string; email: string; trial_ends_at: number }>(
    `SELECT p.id, p.email, f.trial_ends_at FROM parents p JOIN families f ON f.id = p.family_id
     WHERE p.email_verified_at IS NOT NULL AND p.trial_notice_at IS NULL AND f.plan = 'trial'
       AND f.subscription_status IS NULL AND f.trial_ends_at > ? AND f.trial_ends_at <= ?`,
    [now, now + 3 * DAY],
  );
  for (const t of trials) {
    const daysLeft = Math.max(1, Math.ceil((Number(t.trial_ends_at) - now) / DAY));
    const sent = await sendEmail(trialEndingEmail(t.email, origin, daysLeft));
    if (sent.ok) {
      await run("UPDATE parents SET trial_notice_at = ? WHERE id = ?", [now, t.id]);
      result.trialNotices++;
    }
  }

  if (new Date(now).getUTCDay() === 0) {
    const parents = await query<{ id: string; email: string; family_id: string }>(
      `SELECT id, email, family_id FROM parents
       WHERE weekly_report = 1 AND email_verified_at IS NOT NULL AND (last_weekly_at IS NULL OR last_weekly_at < ?)`,
      [now - 5 * DAY],
    );
    for (const p of parents) {
      // One family's bad data must never stop everyone else's email.
      try {
        const children: WeeklyChild[] = [];
        for (const id of await familyProfileIds(p.family_id)) {
          const r = await loadChildReport(p.family_id, id, 7, now);
          if (!r) continue;
          const t = r.report.totals;
          children.push({
            name: r.profile.name,
            minutes: Math.round(t.minutes),
            answers: t.answers,
            accuracy: t.answers ? Math.round((t.correct / t.answers) * 100) : null,
            strength: r.report.strengths[0]?.ref.unit.title,
            next: r.report.needs[0]?.ref.unit.title,
          });
        }
        if (!children.length) continue;
        const sent = await sendEmail(weeklyEmail(p.email, origin, children, await unsubscribeToken(p.id)));
        if (sent.ok) {
          await run("UPDATE parents SET last_weekly_at = ? WHERE id = ?", [now, p.id]);
          result.weekly++;
        }
      } catch (e) {
        console.error("[weekly] failed for one family", (e as Error).message);
      }
    }
  }
  return Response.json(result);
}
