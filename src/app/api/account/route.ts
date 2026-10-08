import { clearCookie, error, getSession, json, sameOrigin } from "@/server/auth";
import { batch } from "@/server/db";

/** Deletes the family's account and every piece of data stored on the server. */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const f = session.familyId;
  await batch([
    { sql: "DELETE FROM events WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM child_settings WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM profiles WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM sessions WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM parents WHERE family_id = ?", args: [f] },
    { sql: "DELETE FROM families WHERE id = ?", args: [f] },
  ]);
  return json({ ok: true }, { cookie: clearCookie() });
}
