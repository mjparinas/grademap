import { clearCookie, error, getSession, json, sameOrigin } from "@/server/auth";
import { batch } from "@/server/db";

/** Deletes the family's account and every piece of data stored on the server. */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const f = session.familyId;
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
  return json({ ok: true }, { cookie: clearCookie() });
}
