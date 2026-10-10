import { clientIp, createSession, error, hashPassword, json, newId, rateLimited, sameOrigin, sessionCookie } from "@/server/auth";
import { query, run } from "@/server/db";
import { getFamilyRow, toFamilyInfo } from "@/server/family";
import { consumeInvite } from "@/server/familyMembers";

/** An invited adult chooses a password and joins the family. The emailed link proves the address. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  if (await rateLimited(`join:${clientIp(req)}`, 10)) return error(429, "Too many attempts. Try again in a few minutes.");
  const body = (await req.json().catch(() => null)) as { token?: string; password?: string } | null;
  const password = body?.password ?? "";
  if (password.length < 8 || password.length > 200) return error(400, "Use a password of at least 8 characters.");
  const invite = await consumeInvite(body?.token ?? "");
  if (!invite) return error(400, "This invitation has expired or was already used. Please ask for a new one.");
  if ((await query("SELECT id FROM parents WHERE email = ?", [invite.email])).length) return error(409, "That email already has an account. Try signing in.");
  const parentId = newId();
  const now = Date.now();
  await run("INSERT INTO parents (id, family_id, email, password_hash, created_at, email_verified_at, role) VALUES (?, ?, ?, ?, ?, ?, 'coparent')", [parentId, invite.familyId, invite.email, await hashPassword(password), now, now]);
  const { token, maxAge } = await createSession(parentId, invite.familyId, req);
  const family = toFamilyInfo((await getFamilyRow(invite.familyId))!, invite.email, true, false, true);
  return json({ family }, { cookie: sessionCookie(token, maxAge) });
}
