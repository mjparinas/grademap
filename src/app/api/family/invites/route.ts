import { appOrigin, clientIp, error, getSession, json, rateLimited, sameOrigin } from "@/server/auth";
import { query } from "@/server/db";
import { sendEmail } from "@/server/email";
import { coParentInviteEmail } from "@/server/emailTemplates";
import { createInvite, MAX_CO_PARENTS } from "@/server/familyMembers";

/** The account owner invites another adult by email. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  if (session.coParent) return error(403, "Only the account owner can do this.");
  if (!session.verified) return error(403, "Please confirm your email first.");
  if (await rateLimited(`invite:${session.parentId}:${clientIp(req)}`, 10, 60 * 60_000)) return error(429, "Too many invitations. Try again later.");
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return error(400, "Please enter a valid email.");
  if ((await query("SELECT id FROM parents WHERE email = ?", [email])).length) return error(409, "That email already has an account, so it can't be invited. They can sign in on their own, or use a different email.");
  const token = await createInvite(session.familyId, session.parentId, email);
  if (!token) return error(409, `You can add up to ${MAX_CO_PARENTS} other adults.`);
  const sent = await sendEmail(coParentInviteEmail(email, appOrigin(req), session.email, token));
  if (!sent.ok && !sent.skipped) return error(502, "We couldn't send the invitation just now. Please try again.");
  return json({ ok: true });
}
