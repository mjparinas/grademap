import { clientIp, consumeAuthToken, createSession, error, hashPassword, json, rateLimited, sameOrigin, sessionCookie } from "@/server/auth";
import { query, run } from "@/server/db";
import { getFamilyRow, toFamilyInfo } from "@/server/family";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  if (await rateLimited(`reset:${clientIp(req)}`, 10)) return error(429, "Too many attempts. Try again in a few minutes.");
  const body = (await req.json().catch(() => null)) as { token?: string; password?: string } | null;
  const password = body?.password ?? "";
  if (password.length < 8 || password.length > 200) return error(400, "Use a password of at least 8 characters.");
  const parentId = await consumeAuthToken(body?.token ?? "", "reset");
  if (!parentId) return error(400, "This link has expired or was already used. Please ask for a new one.");
  const rows = await query<{ family_id: string; email: string }>("SELECT family_id, email FROM parents WHERE id = ?", [parentId]);
  const parent = rows[0];
  if (!parent) return error(400, "This link has expired or was already used. Please ask for a new one.");
  await run("UPDATE parents SET password_hash = ?, email_verified_at = COALESCE(email_verified_at, ?) WHERE id = ?", [await hashPassword(password), Date.now(), parentId]);
  // Anyone signed in with the old password is signed out everywhere.
  await run("DELETE FROM sessions WHERE parent_id = ?", [parentId]);
  const { token, maxAge } = await createSession(parentId, parent.family_id, req);
  const family = toFamilyInfo((await getFamilyRow(parent.family_id))!, parent.email, true);
  return json({ family }, { cookie: sessionCookie(token, maxAge) });
}
