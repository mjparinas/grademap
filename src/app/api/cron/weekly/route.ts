import { loadChildReport, familyProfileIds } from "@/server/reportData";
import { secretsMatch, unsubscribeToken } from "@/server/auth";
import { query, run } from "@/server/db";
import { sendEmail } from "@/server/email";
import { inactiveClassEmail, reminderEmail, trialEndingEmail, trialRecapEmail, weeklyEmail, type ReminderChild, type TrialChild, type WeeklyChild } from "@/server/emailTemplates";
import { pushConfigured, pushToParent } from "@/server/push";
import { deleteInactiveClass } from "@/server/students";

// Runs once a day (see vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`.
// Every day: a one-time trial recap 4 to 10 days before the trial ends, and a "trial ends soon" notice to confirmed parents, once. On Sundays: the weekly report
// to parents who opted in (with a month summary on the first Sunday of the month). Every day: a gentle practice reminder, to opted-in parents only, at most once a week.

const DAY = 86_400_000;
const YEAR = 365.25 * DAY;
const MONTH = YEAR / 12;
const INACTIVE_WARNING_AGE = (11 / 12) * YEAR;
const INACTIVE_DELETE_AGE = YEAR;
export const maxDuration = 300;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !secretsMatch(req.headers.get("authorization") ?? "", `Bearer ${secret}`)) return new Response("Unauthorized", { status: 401 });
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "") || new URL(req.url).origin;
  const now = Date.now();
  const result = { trialNotices: 0, trialRecaps: 0, weekly: 0, reminders: 0, inactiveClassWarnings: 0, inactiveClassesDeleted: 0, pushes: 0, studentsDeleted: 0 };

  // Warn teachers after 11 months without a sign-in. Only mark a warning as sent when email
  // delivery succeeds, so a missing mail provider cannot silently bypass the warning.
  const inactiveForWarning = await query<{ id: string; name: string; email: string; owner_parent_id: string; delete_at: number }>(
    `SELECT c.id, c.name, p.email, c.owner_parent_id, c.last_activity_at + ? AS delete_at
     FROM classes c JOIN parents p ON p.id = c.owner_parent_id
     WHERE c.closed_at IS NULL AND c.inactive_warning_at IS NULL AND p.email_verified_at IS NOT NULL
       AND c.last_activity_at <= ?`,
    [INACTIVE_DELETE_AGE, now - INACTIVE_WARNING_AGE],
  );
  for (const cls of inactiveForWarning) {
    // Give already-expired classes a full month's notice when this policy is first deployed.
    const deleteAt = Math.max(Number(cls.delete_at), now + MONTH);
    const deleteDate = new Date(deleteAt).toISOString().slice(0, 10);
    const claimed = await run(
      `UPDATE classes SET inactive_warning_at = ? WHERE id = ? AND closed_at IS NULL
         AND inactive_warning_at IS NULL AND last_activity_at <= ?`,
      [now, cls.id, now - INACTIVE_WARNING_AGE],
    );
    if (!claimed) continue;
    const sent = await sendEmail(inactiveClassEmail(cls.email, origin, cls.name, deleteDate));
    if (!sent.ok) {
      // Let tomorrow's run retry, unless a sign-in already reset the inactivity window.
      await run("UPDATE classes SET inactive_warning_at = NULL WHERE id = ? AND inactive_warning_at = ? AND last_activity_at <= ?", [cls.id, now, now - INACTIVE_WARNING_AGE]);
    } else {
      result.inactiveClassWarnings++;
    }
  }

  // Only delete after a warning was successfully sent and the full 12-month period has elapsed.
  const inactiveToDelete = await query<{ id: string }>(
    `SELECT id FROM classes WHERE closed_at IS NULL AND inactive_warning_at IS NOT NULL
       AND inactive_warning_at <= ? AND last_activity_at <= ?`,
    [now - MONTH, now - INACTIVE_DELETE_AGE],
  );
  for (const cls of inactiveToDelete) {
    const deleted = await deleteInactiveClass(cls.id, now - INACTIVE_DELETE_AGE, now - MONTH);
    if (deleted.deleted) {
      result.studentsDeleted += deleted.students;
      result.inactiveClassesDeleted++;
    }
  }

  // What each child did during the trial (first name and totals only).
  const trialChildren = async (familyId: string): Promise<TrialChild[]> => {
    const out: TrialChild[] = [];
    for (const id of await familyProfileIds(familyId)) {
      const r = await loadChildReport(familyId, id, 30, now);
      if (!r) continue;
      const t = r.report.totals;
      out.push({ name: r.profile.name, answers: t.answers, activeDays: t.activeDays, minutes: Math.round(t.minutes), strength: r.report.strengths[0]?.ref.unit.title });
    }
    return out;
  };

  // Mid-trial recap, once, 4 to 10 days before the trial ends, only when a child has practised.
  const recaps = await query<{ id: string; email: string; family_id: string; trial_ends_at: number }>(
    `SELECT p.id, p.email, p.family_id, f.trial_ends_at FROM parents p JOIN families f ON f.id = p.family_id
     WHERE p.role = 'parent' AND p.email_verified_at IS NOT NULL AND p.trial_recap_at IS NULL AND p.trial_notice_at IS NULL AND f.plan = 'trial'
       AND f.subscription_status IS NULL AND f.trial_ends_at > ? AND f.trial_ends_at <= ?`,
    [now + 3 * DAY, now + 10 * DAY],
  );
  for (const t of recaps) {
    try {
      const children = await trialChildren(t.family_id);
      if (!children.some((c) => c.answers > 0)) continue;
      const daysLeft = Math.max(1, Math.ceil((Number(t.trial_ends_at) - now) / DAY));
      const sent = await sendEmail(trialRecapEmail(t.email, origin, daysLeft, children));
      if (sent.ok) {
        await run("UPDATE parents SET trial_recap_at = ? WHERE id = ?", [now, t.id]);
        result.trialRecaps++;
      }
    } catch (e) {
      console.error("[trial recap] failed for one family", (e as Error).message);
    }
  }

  // Trial ending within 3 days, not subscribed, not told yet.
  const trials = await query<{ id: string; email: string; family_id: string; trial_ends_at: number }>(
    `SELECT p.id, p.email, p.family_id, f.trial_ends_at FROM parents p JOIN families f ON f.id = p.family_id
     WHERE p.role = 'parent' AND p.email_verified_at IS NOT NULL AND p.trial_notice_at IS NULL AND f.plan = 'trial'
       AND f.subscription_status IS NULL AND f.trial_ends_at > ? AND f.trial_ends_at <= ?`,
    [now, now + 3 * DAY],
  );
  for (const t of trials) {
    const daysLeft = Math.max(1, Math.ceil((Number(t.trial_ends_at) - now) / DAY));
    const children = await trialChildren(t.family_id).catch(() => []);
    const sent = await sendEmail(trialEndingEmail(t.email, origin, daysLeft, children));
    if (sent.ok) {
      await run("UPDATE parents SET trial_notice_at = ? WHERE id = ?", [now, t.id]);
      result.trialNotices++;
    }
  }

  // A child who practised in the last 30 days but not in the last 3 gets one friendly nudge to the parent.
  const nudgeParents = await query<{ id: string; email: string; family_id: string }>(
    `SELECT id, email, family_id FROM parents
     WHERE practice_reminders = 1 AND email_verified_at IS NOT NULL AND (last_nudge_at IS NULL OR last_nudge_at < ?)`,
    [now - 6 * DAY],
  );
  for (const p of nudgeParents) {
    try {
      const quiet: ReminderChild[] = [];
      for (const id of await familyProfileIds(p.family_id)) {
        const r = await loadChildReport(p.family_id, id, 30, now);
        if (!r) continue;
        const days = r.report.days;
        const last = days.findLastIndex((d) => d.answers > 0);
        const daysQuiet = last < 0 ? -1 : days.length - 1 - last;
        if (daysQuiet >= 3) quiet.push({ name: r.profile.name, daysQuiet });
      }
      if (!quiet.length) continue;
      const sent = await sendEmail(reminderEmail(p.email, origin, quiet, await unsubscribeToken(p.id)));
      if (sent.ok) {
        await run("UPDATE parents SET last_nudge_at = ? WHERE id = ?", [now, p.id]);
        result.reminders++;
      }
    } catch (e) {
      console.error("[reminders] failed for one family", (e as Error).message);
    }
  }

  if (new Date(now).getUTCDay() === 0) {
    const parents = await query<{ id: string; email: string; family_id: string }>(
      `SELECT id, email, family_id FROM parents
       WHERE weekly_report = 1 AND email_verified_at IS NOT NULL AND (last_weekly_at IS NULL OR last_weekly_at < ?)`,
      [now - 5 * DAY],
    );
    // On the first Sunday of the month the weekly email also carries a short month summary.
    const firstSunday = new Date(now).getUTCDate() <= 7;
    for (const p of parents) {
      // One family's bad data must never stop everyone else's email.
      try {
        const children: WeeklyChild[] = [];
        for (const id of await familyProfileIds(p.family_id)) {
          const r = await loadChildReport(p.family_id, id, 7, now);
          if (!r) continue;
          const t = r.report.totals;
          const month = firstSunday ? (await loadChildReport(p.family_id, id, 30, now))?.report : undefined;
          children.push({
            name: r.profile.name,
            month: month && { minutes: Math.round(month.totals.minutes), answers: month.totals.answers, previousAnswers: month.previous.answers, activeDays: month.totals.activeDays },
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

  // Notification addresses of accounts that no longer exist (a removed co-parent) are dropped.
  await run("DELETE FROM push_subscriptions WHERE parent_id NOT IN (SELECT id FROM parents)");

  // Sundays: wake the browsers a parent allowed. The notification text is fixed; nothing about a child is sent.
  if (pushConfigured() && new Date(now).getUTCDay() === 0) {
    const targets = await query<{ id: string }>(
      `SELECT id FROM parents WHERE role != 'student' AND (last_push_at IS NULL OR last_push_at < ?)
         AND id IN (SELECT parent_id FROM push_subscriptions)`,
      [now - 5 * DAY],
    );
    for (const t of targets) {
      try {
        await run("UPDATE parents SET last_push_at = ? WHERE id = ?", [now, t.id]);
        if ((await pushToParent(t.id)) > 0) result.pushes++;
      } catch (e) {
        console.error("[push] failed for one parent", (e as Error).message);
      }
    }
  }
  return Response.json(result);
}
