import { error, getSession, json, rateLimited, sameOrigin } from "@/server/auth";
import { MAX_STUDENTS, normalizeCode } from "@/server/classroom";
import { query, run } from "@/server/db";

// A parent links one of their children to a class with the teacher's join code. This is the
// parent's consent: nothing is shared until they do it, and they can unlink at any time.

/** Classes this family's children are linked to. */
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const rows = await query<{ class_id: string; profile_id: string; name: string; grade: string }>(
    `SELECT m.class_id, m.profile_id, c.name, c.grade FROM class_members m JOIN classes c ON c.id = m.class_id
     WHERE m.family_id = ? AND c.closed_at IS NULL`,
    [session.familyId],
  );
  return json({ links: rows.map((r) => ({ classId: r.class_id, profileId: r.profile_id, className: r.name, grade: r.grade })) });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Sign in to join a class.");
  if (await rateLimited(`join:${session.parentId}`, 10, 60 * 60_000)) return error(429, "Too many tries. Try again later.");
  const body = (await req.json().catch(() => null)) as { code?: unknown; profileId?: unknown } | null;
  const code = normalizeCode(body?.code);
  const profileId = typeof body?.profileId === "string" ? body.profileId : "";
  const owns = await query<{ data: string }>("SELECT data FROM profiles WHERE id = ? AND family_id = ?", [profileId, session.familyId]);
  if (!owns.length) return error(404, "That child isn’t synced to your account yet. Sync, then try again.");
  const cls = (await query<{ id: string; name: string; grade: string; framework: string }>("SELECT id, name, grade, framework FROM classes WHERE join_code = ? AND closed_at IS NULL", [code]))[0];
  if (!cls) return error(404, "We couldn’t find a class with that code. Check it with the teacher.");
  const child = JSON.parse(owns[0].data) as { grade?: string; framework?: string };
  if (child.grade !== cls.grade) return error(409, "This class is for a different grade than your child’s profile.");
  if ((child.framework ?? "ca-bc") !== cls.framework) return error(409, "This class follows a different province’s curriculum than your child’s profile.");
  const size = await query<{ n: number }>("SELECT COUNT(*) AS n FROM class_members WHERE class_id = ?", [cls.id]);
  if (Number(size[0].n) >= MAX_STUDENTS) return error(409, "This class is full.");
  await run("INSERT OR IGNORE INTO class_members (class_id, profile_id, family_id, joined_at) VALUES (?, ?, ?, ?)", [cls.id, profileId, session.familyId, Date.now()]);
  return json({ link: { classId: cls.id, profileId, className: cls.name, grade: cls.grade } });
}

/** Unlinks a child from a class. The teacher stops seeing their progress straight away. */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const params = new URL(req.url).searchParams;
  const removed = await run("DELETE FROM class_members WHERE class_id = ? AND profile_id = ? AND family_id = ?", [params.get("classId") ?? "", params.get("profileId") ?? "", session.familyId]);
  return json({ removed });
}
