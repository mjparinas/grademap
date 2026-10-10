import { error, getSession, json, newId, rateLimited, sameOrigin } from "@/server/auth";
import { query, run } from "@/server/db";
import { pushConfigured, saveSubscription, validEndpoint, vapidPublicKey } from "@/server/push";

/** Whether notifications are available, and whether this browser has one. */
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const subscribed = new URL(req.url).searchParams.get("endpoint");
  const rows = subscribed && validEndpoint(subscribed) ? await query("SELECT id FROM push_subscriptions WHERE parent_id = ? AND endpoint = ?", [session.parentId, subscribed]) : [];
  return json({ configured: pushConfigured(), publicKey: pushConfigured() ? vapidPublicKey() : "", subscribed: rows.length > 0 });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  if (!pushConfigured()) return error(503, "Notifications aren't set up yet.");
  if (await rateLimited(`push:${session.parentId}`, 20, 60 * 60_000)) return error(429, "Too many attempts. Try again later.");
  const body = (await req.json().catch(() => null)) as { endpoint?: unknown } | null;
  if (!validEndpoint(body?.endpoint)) return error(400, "That browser can't receive notifications.");
  const count = (await query<{ n: number }>("SELECT COUNT(*) AS n FROM push_subscriptions WHERE parent_id = ?", [session.parentId]))[0];
  if (Number(count?.n ?? 0) >= 10) return error(409, "Turn notifications off on a device you no longer use first.");
  await saveSubscription(session.parentId, body.endpoint, newId());
  return json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const body = (await req.json().catch(() => null)) as { endpoint?: unknown } | null;
  if (typeof body?.endpoint !== "string") return error(400, "Bad request");
  await run("DELETE FROM push_subscriptions WHERE parent_id = ? AND endpoint = ?", [session.parentId, body.endpoint]);
  return json({ ok: true });
}
