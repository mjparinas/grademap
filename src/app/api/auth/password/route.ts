import { appOrigin, clientIp, error, getSession, hashPassword, json, rateLimited, readCookieToken, sameOrigin, verifyPassword } from "@/server/auth";
import { query, run } from "@/server/db";
import { sendEmail } from "@/server/email";
import { passwordChangedEmail } from "@/server/emailTemplates";

/** Changes the password. Needs the current one; every other device is signed out and the parent is emailed. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  if (await rateLimited(`password:${session.parentId}:${clientIp(req)}`, 5, 60 * 60_000)) return error(429, "Too many attempts. Try again later.");
  const body = (await req.json().catch(() => null)) as { current?: unknown; password?: unknown } | null;
  const current = typeof body?.current === "string" ? body.current : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (password.length < 8 || password.length > 200) return error(400, "Use a password of at least 8 characters.");
  const rows = await query<{ password_hash: string }>("SELECT password_hash FROM parents WHERE id = ?", [session.parentId]);
  if (!rows[0] || current.length > 200 || !(await verifyPassword(current, rows[0].password_hash))) return error(403, "Your current password isn't right.");
  await run("UPDATE parents SET password_hash = ? WHERE id = ?", [await hashPassword(password), session.parentId]);
  await run("DELETE FROM sessions WHERE parent_id = ? AND token_hash != ?", [session.parentId, readCookieToken(req)]);
  await sendEmail(passwordChangedEmail(session.email, appOrigin(req)));
  return json({ ok: true });
}
