import { clientIp, error, json, rateLimited } from "@/server/auth";
import { run } from "@/server/db";

/**
 * Turns off the weekly report for the account that owns the token. It accepts a plain POST, which is
 * also what mail apps send for one-click unsubscribe, so it can't require a sign-in or same-origin.
 */
export async function POST(req: Request) {
  if (await rateLimited(`unsub:${clientIp(req)}`, 30)) return error(429, "Too many attempts. Try again later.");
  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token || token.length > 100) return error(400, "This link isn’t valid.");
  const changed = await run("UPDATE parents SET weekly_report = 0 WHERE unsub_token = ?", [token]);
  if (!changed) return error(400, "This link isn’t valid.");
  return json({ ok: true });
}
