import { appOrigin, clientIp, createAuthToken, createSession, error, hashPassword, json, newId, rateLimited, sameOrigin, sessionCookie } from "@/server/auth";
import { batch, query } from "@/server/db";
import { sendEmail } from "@/server/email";
import { verifyEmail } from "@/server/emailTemplates";
import { getFamilyRow, toFamilyInfo } from "@/server/family";
import { TRIAL_DAYS } from "@/lib/plan";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  if (await rateLimited(`signup:${clientIp(req)}`, 5)) return error(429, "Too many attempts. Try again in a few minutes.");
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string; trialEndsAt?: number } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return error(400, "Please enter a valid email.");
  if (password.length < 8 || password.length > 200) return error(400, "Use a password of at least 8 characters.");
  if ((await query("SELECT id FROM parents WHERE email = ?", [email])).length) {
    return error(409, "That email already has an account. Try signing in.");
  }

  const now = Date.now();
  const maxTrial = now + TRIAL_DAYS * 86_400_000;
  // Keep the trial this device already started, so signing up doesn't restart it.
  const trialEndsAt = Math.min(maxTrial, Math.max(now, Number(body?.trialEndsAt) || maxTrial));
  const familyId = newId();
  const parentId = newId();
  const hash = await hashPassword(password);
  try {
    // Both rows or neither, so a duplicate email can't leave an empty family behind.
    await batch([
      { sql: "INSERT INTO families (id, created_at, trial_ends_at, plan, updated_at) VALUES (?, ?, ?, 'trial', ?)", args: [familyId, now, trialEndsAt, now] },
      { sql: "INSERT INTO parents (id, family_id, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)", args: [parentId, familyId, email, hash, now] },
    ]);
  } catch (e) {
    if (/UNIQUE|constraint/i.test(String((e as Error).message))) return error(409, "That email already has an account. Try signing in.");
    throw e;
  }
  const { token, maxAge } = await createSession(parentId, familyId);
  const family = toFamilyInfo((await getFamilyRow(familyId))!, email, false);
  // A failed email never blocks signup; the parent can ask for another from the Account page.
  await sendEmail(verifyEmail(email, appOrigin(req), await createAuthToken(parentId, "verify", 3 * 86_400_000)));
  return json({ family }, { cookie: sessionCookie(token, maxAge) });
}
