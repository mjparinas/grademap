import { createHash, randomBytes } from "node:crypto";
import { appOrigin, error, getSession, json, rateLimited, sameOrigin } from "@/server/auth";
import { query, run } from "@/server/db";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");
const DAYS = [7, 14, 30, 90];
const LINK_LIFETIME_MS = 30 * 86_400_000;
const MAX_LINKS = 10;

/** Creates a read-only link to one child's report. The link works for 30 days or until it is stopped. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Sign in to share a report.");
  if (await rateLimited(`share:${session.parentId}`, 20, 60 * 60_000)) return error(429, "Too many links created. Try again later.");
  const body = (await req.json().catch(() => null)) as { profileId?: unknown; days?: unknown } | null;
  const days = Number(body?.days);
  if (typeof body?.profileId !== "string" || !DAYS.includes(days)) return error(400, "Bad request");
  const owns = await query("SELECT 1 FROM profiles WHERE id = ? AND family_id = ?", [body.profileId, session.familyId]);
  if (!owns.length) return error(404, "That child isn’t synced to your account yet. Sync, then try again.");

  const now = Date.now();
  await run("DELETE FROM report_shares WHERE family_id = ? AND expires_at < ?", [session.familyId, now]);
  const active = await query<{ n: number }>("SELECT COUNT(*) AS n FROM report_shares WHERE family_id = ?", [session.familyId]);
  if (Number(active[0].n) >= MAX_LINKS) return error(409, "You have a lot of active links. Stop sharing some first.");

  const token = randomBytes(24).toString("base64url");
  await run("INSERT INTO report_shares (token_hash, family_id, profile_id, days, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)", [
    sha(token),
    session.familyId,
    body.profileId,
    days,
    now,
    now + LINK_LIFETIME_MS,
  ]);
  return json({ url: `${appOrigin(req)}/shared/${token}/`, expiresAt: now + LINK_LIFETIME_MS });
}

/** How many links are active for this child. */
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const profileId = new URL(req.url).searchParams.get("profileId") ?? "";
  const rows = await query<{ n: number }>("SELECT COUNT(*) AS n FROM report_shares WHERE family_id = ? AND profile_id = ? AND expires_at > ?", [session.familyId, profileId, Date.now()]);
  return json({ active: Number(rows[0].n) });
}

/** Stops every shared link for a child. */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const profileId = new URL(req.url).searchParams.get("profileId") ?? "";
  const removed = await run("DELETE FROM report_shares WHERE family_id = ? AND profile_id = ?", [session.familyId, profileId]);
  return json({ removed });
}
