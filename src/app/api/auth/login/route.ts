import { burnPasswordCheck, appOrigin, clientIp, createSession, deviceLabel, error, json, rateLimited, sameOrigin, sessionCookie, verifyPassword } from "@/server/auth";
import { query } from "@/server/db";
import { sendEmail } from "@/server/email";
import { newSignInEmail } from "@/server/emailTemplates";
import { getFamilyRow, toFamilyInfo } from "@/server/family";

const TOO_MANY = "Too many attempts. Try again in a few minutes.";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const ip = clientIp(req);
  if (await rateLimited(`login:${ip}`, 10)) return error(429, TOO_MANY);
  const body = (await req.json().catch(() => null)) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (email.length > 200 || password.length > 200) return error(401, "That email and password don't match.");
  if (email) {
    // Per address and device, so a stranger can't lock a parent out; a looser cap on the address
    // alone still stops guessing spread across many devices.
    if (await rateLimited(`login-email-ip:${email}:${ip}`, 10)) return error(429, TOO_MANY);
    if (await rateLimited(`login-email:${email}`, 60, 60 * 60_000)) return error(429, TOO_MANY);
  }
  const rows = await query<{ id: string; family_id: string; password_hash: string; email_verified_at: number | null; role: string }>(
    "SELECT id, family_id, password_hash, email_verified_at, role FROM parents WHERE email = ?",
    [email],
  );
  const parent = rows[0];
  if (!parent) await burnPasswordCheck(password); // same response time as a wrong password
  if (!parent || !(await verifyPassword(password, parent.password_hash))) {
    return error(401, "That email and password don't match.");
  }
  const { token, maxAge } = await createSession(parent.id, parent.family_id, req);
  const family = toFamilyInfo((await getFamilyRow(parent.family_id))!, email, Boolean(parent.email_verified_at), false, parent.role === "coparent");
  // A heads-up for the parent; a failed email never blocks signing in.
  if (parent.email_verified_at) await sendEmail(newSignInEmail(email, appOrigin(req), deviceLabel(req.headers.get("user-agent") ?? "")));
  return json({ family }, { cookie: sessionCookie(token, maxAge) });
}
