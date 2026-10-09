import { appOrigin, createAuthToken, error, getSession, json, rateLimited, sameOrigin } from "@/server/auth";
import { sendEmail } from "@/server/email";
import { verifyEmail } from "@/server/emailTemplates";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  if (session.verified) return json({ ok: true, alreadyVerified: true });
  if (await rateLimited(`resend-verify:${session.parentId}`, 3, 60 * 60_000)) return error(429, "We've sent a few already. Please check your inbox and spam folder, or try again in an hour.");
  await sendEmail(verifyEmail(session.email, appOrigin(req), await createAuthToken(session.parentId, "verify", 3 * 86_400_000)));
  return json({ ok: true });
}
