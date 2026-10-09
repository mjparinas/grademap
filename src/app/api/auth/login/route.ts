import { clientIp, createSession, error, json, rateLimited, sameOrigin, sessionCookie, verifyPassword } from "@/server/auth";
import { query } from "@/server/db";
import { getFamilyRow, toFamilyInfo } from "@/server/family";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  if (await rateLimited(`login:${clientIp(req)}`, 10)) return error(429, "Too many attempts. Try again in a few minutes.");
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  if (email && (await rateLimited(`login-email:${email}`, 10))) return error(429, "Too many attempts. Try again in a few minutes.");
  const rows = await query<{ id: string; family_id: string; password_hash: string; email_verified_at: number | null }>(
    "SELECT id, family_id, password_hash, email_verified_at FROM parents WHERE email = ?",
    [email],
  );
  const parent = rows[0];
  if (!parent || !(await verifyPassword(body?.password ?? "", parent.password_hash))) {
    return error(401, "That email and password don't match.");
  }
  const { token, maxAge } = await createSession(parent.id, parent.family_id);
  const family = toFamilyInfo((await getFamilyRow(parent.family_id))!, email, Boolean(parent.email_verified_at));
  return json({ family }, { cookie: sessionCookie(token, maxAge) });
}
