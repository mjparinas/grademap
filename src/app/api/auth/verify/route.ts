import { clientIp, consumeAuthToken, error, json, rateLimited, sameOrigin } from "@/server/auth";
import { run } from "@/server/db";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  if (await rateLimited(`verify:${clientIp(req)}`, 20)) return error(429, "Too many attempts. Try again in a few minutes.");
  const body = (await req.json().catch(() => null)) as { token?: string } | null;
  const parentId = await consumeAuthToken(body?.token ?? "", "verify");
  if (!parentId) return error(400, "This link has expired or was already used. You can ask for a new one in the Parent area, under Account & sync.");
  await run("UPDATE parents SET email_verified_at = COALESCE(email_verified_at, ?) WHERE id = ?", [Date.now(), parentId]);
  return json({ ok: true });
}
