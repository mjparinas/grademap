import { error, getSession, json, sameOrigin } from "@/server/auth";
import { query, run } from "@/server/db";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const rows = await query<{ weekly_report: number; practice_reminders: number }>("SELECT weekly_report, practice_reminders FROM parents WHERE id = ?", [session.parentId]);
  return json({ weeklyReport: Boolean(rows[0]?.weekly_report), practiceReminders: Boolean(rows[0]?.practice_reminders) });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const body = (await req.json().catch(() => null)) as { weeklyReport?: unknown; practiceReminders?: unknown } | null;
  const { weeklyReport, practiceReminders } = body ?? {};
  if (weeklyReport === undefined && practiceReminders === undefined) return error(400, "Bad request");
  if ((weeklyReport !== undefined && typeof weeklyReport !== "boolean") || (practiceReminders !== undefined && typeof practiceReminders !== "boolean")) return error(400, "Bad request");
  if ((weeklyReport || practiceReminders) && !session.verified) return error(403, "Please confirm your email first, so the emails reach the right person.");
  if (typeof weeklyReport === "boolean") await run("UPDATE parents SET weekly_report = ? WHERE id = ?", [weeklyReport ? 1 : 0, session.parentId]);
  if (typeof practiceReminders === "boolean") await run("UPDATE parents SET practice_reminders = ? WHERE id = ?", [practiceReminders ? 1 : 0, session.parentId]);
  const rows = await query<{ weekly_report: number; practice_reminders: number }>("SELECT weekly_report, practice_reminders FROM parents WHERE id = ?", [session.parentId]);
  return json({ weeklyReport: Boolean(rows[0]?.weekly_report), practiceReminders: Boolean(rows[0]?.practice_reminders) });
}
