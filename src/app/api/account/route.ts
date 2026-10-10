import { appOrigin, clearCookie, clientIp, error, getSession, json, rateLimited, sameOrigin, verifyPassword } from "@/server/auth";
import { batch, query } from "@/server/db";
import { sendEmail } from "@/server/email";
import { accountDeletedEmail } from "@/server/emailTemplates";
import { getFamilyRow } from "@/server/family";
import { cancelSubscriptions, stripeCancellationConfigured } from "@/server/stripe";
import { removeStudentsOfOwner } from "@/server/students";

/** Deletes the family's account and every piece of data stored on the server. */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  if (session.coParent) return error(403, "Only the account owner can do this.");
  const f = session.familyId;
  // Deleting is permanent, so it asks for the password again.
  if (await rateLimited(`delete:${session.parentId}:${clientIp(req)}`, 5, 60 * 60_000)) return error(429, "Too many attempts. Try again later.");
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  const stored = await query<{ password_hash: string }>("SELECT password_hash FROM parents WHERE id = ?", [session.parentId]);
  if (!stored[0] || password.length > 200 || !(await verifyPassword(password, stored[0].password_hash))) return error(403, "Please type your password to confirm.");
  // Stop billing first. If Stripe can't be reached, keep the account so the parent can try again.
  const family = await getFamilyRow(f);
  if (family?.stripe_customer && stripeCancellationConfigured()) {
    try {
      await cancelSubscriptions(family.stripe_customer);
    } catch {
      return error(502, "We couldn't cancel your subscription just now, so your account was not deleted. Please try again in a moment.");
    }
  }
  // Teacher accounts: every student account in their classes goes too.
  await removeStudentsOfOwner((await query<{ id: string }>("SELECT id FROM parents WHERE family_id = ?", [f])).map((p) => p.id));
  await batch([
    { sql: "DELETE FROM auth_tokens WHERE parent_id IN (SELECT id FROM parents WHERE family_id = ?)", args: [f] },
    { sql: "DELETE FROM report_shares WHERE family_id = ?", args: [f] },
    // Classroom mode: unlink this family's children, and remove any classes this account's teachers owned.
    { sql: "DELETE FROM class_members WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM class_members WHERE class_id IN (SELECT id FROM classes WHERE owner_parent_id IN (SELECT id FROM parents WHERE family_id = ?))", args: [f] },
    { sql: "DELETE FROM class_assignments WHERE class_id IN (SELECT id FROM classes WHERE owner_parent_id IN (SELECT id FROM parents WHERE family_id = ?))", args: [f] },
    { sql: "DELETE FROM classes WHERE owner_parent_id IN (SELECT id FROM parents WHERE family_id = ?)", args: [f] },
    { sql: "DELETE FROM question_reports WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM events WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM child_settings WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM profiles WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM sessions WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM parents WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM families WHERE id = ?", args: [f] },
  ]);
  if (session.verified) await sendEmail(accountDeletedEmail(session.email, appOrigin(req)));
  return json({ ok: true }, { cookie: clearCookie() });
}
