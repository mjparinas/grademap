import { error, getSession, json, sameOrigin } from "@/server/auth";
import { query, run } from "@/server/db";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const rows = await query<{ weekly_report: number }>("SELECT weekly_report FROM parents WHERE id = ?", [session.parentId]);
  return json({ weeklyReport: Boolean(rows[0]?.weekly_report) });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const body = (await req.json().catch(() => null)) as { weeklyReport?: unknown } | null;
  if (typeof body?.weeklyReport !== "boolean") return error(400, "Bad request");
  if (body.weeklyReport && !session.verified) return error(403, "Please confirm your email first, so the weekly report reaches the right person.");
  await run("UPDATE parents SET weekly_report = ? WHERE id = ?", [body.weeklyReport ? 1 : 0, session.parentId]);
  return json({ weeklyReport: body.weeklyReport });
}
