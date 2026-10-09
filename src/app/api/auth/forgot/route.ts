import { appOrigin, clientIp, createAuthToken, error, json, rateLimited, sameOrigin } from "@/server/auth";
import { query } from "@/server/db";
import { sendEmail } from "@/server/email";
import { resetEmail } from "@/server/emailTemplates";

/** Always answers the same way, so it can't be used to find out which emails have accounts. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  if (await rateLimited(`forgot-ip:${clientIp(req)}`, 5, 60 * 60_000)) return error(429, "Too many requests. Try again later.");
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const reply = json({ ok: true, message: "If that email has an account, we've sent a link to reset the password." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return reply;
  if (await rateLimited(`forgot-email:${email}`, 3, 60 * 60_000)) return reply;
  const rows = await query<{ id: string }>("SELECT id FROM parents WHERE email = ?", [email]);
  if (rows[0]) await sendEmail(resetEmail(email, appOrigin(req), await createAuthToken(rows[0].id, "reset", 60 * 60_000)));
  return reply;
}
