import { error, getSession, json, newId, rateLimited, sameOrigin } from "@/server/auth";
import { assignmentDue, assignmentKeys, classProgress, isFramework, MAX_CLASSES, newJoinCode, ownedClass } from "@/server/classroom";
import { query, run } from "@/server/db";
import { classRoster, removeClassStudents } from "@/server/students";
import { GRADE_ORDER } from "@/content/subjects";

// A teacher's classes. Ownership is always checked against the signed-in account.

/** Lists the teacher's classes, or one class with its assignments and students' progress (?id=). */
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const id = new URL(req.url).searchParams.get("id");
  if (id) {
    // Building a class view reads every student's history, so it is rate limited.
    if (await rateLimited(`classview:${session.parentId}`, 60, 10 * 60_000)) return error(429, "Too many refreshes. Try again in a minute.");
    const cls = await ownedClass(id, session.parentId);
    if (!cls) return error(404, "Class not found");
    return json({
      class: { id: cls.id, name: cls.name, grade: cls.grade, framework: cls.framework, joinCode: cls.join_code },
      assignments: await assignmentKeys(cls.id),
      due: await assignmentDue(cls.id),
      students: await classProgress(cls.id),
      roster: await classRoster(cls.id),
    });
  }
  const rows = await query<{ id: string; name: string; grade: string; framework: string; join_code: string; students: number }>(
    `SELECT c.id, c.name, c.grade, c.framework, c.join_code, (SELECT COUNT(*) FROM class_members m WHERE m.class_id = c.id) AS students
     FROM classes c WHERE c.owner_parent_id = ? AND c.closed_at IS NULL ORDER BY c.created_at`,
    [session.parentId],
  );
  return json({ classes: rows.map((r) => ({ id: r.id, name: r.name, grade: r.grade, framework: r.framework, joinCode: r.join_code, students: Number(r.students) })) });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Sign in to create a class.");
  // Teachers see children's first names and results, so the account's email has to be confirmed first.
  if (!session.verified) return error(403, "Please confirm your email first. Classes show children's progress, so we only allow them for confirmed accounts.");
  if (await rateLimited(`class:${session.parentId}`, 20, 60 * 60_000)) return error(429, "Too many classes created. Try again later.");
  const body = (await req.json().catch(() => null)) as { name?: unknown; grade?: unknown; framework?: unknown } | null;
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 60) : "";
  const grade = String(body?.grade ?? "");
  const framework = body?.framework === undefined ? "ca-bc" : body.framework;
  if (!isFramework(framework)) return error(400, "Choose a province.");
  if (!name) return error(400, "Give the class a name.");
  if (!(GRADE_ORDER as string[]).includes(grade)) return error(400, "Choose a grade.");
  const mine = await query<{ n: number }>("SELECT COUNT(*) AS n FROM classes WHERE owner_parent_id = ? AND closed_at IS NULL", [session.parentId]);
  if (Number(mine[0].n) >= MAX_CLASSES) return error(409, "You have the maximum number of classes. Close one first.");

  const id = newId();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newJoinCode();
    try {
      const now = Date.now();
      await run("INSERT INTO classes (id, owner_parent_id, name, grade, framework, join_code, created_at, last_activity_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [id, session.parentId, name, grade, framework, code, now, now]);
      return json({ class: { id, name, grade, framework, joinCode: code, students: 0 } });
    } catch {
      // Join code collision: try another.
    }
  }
  return error(500, "Couldn’t create the class. Try again.");
}

/** Replaces the class's join code (?id=), for when it has been shared more widely than intended. Linked students stay linked. */
export async function PATCH(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const cls = await ownedClass(id, session.parentId);
  if (!cls) return error(404, "Class not found");
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newJoinCode();
    try {
      await run("UPDATE classes SET join_code = ? WHERE id = ?", [code, id]);
      return json({ joinCode: code });
    } catch {
      // Collision: try another.
    }
  }
  return error(500, "Couldn’t make a new code. Try again.");
}

/** Closes a class. Links to students are removed, so the teacher no longer sees anyone's progress. */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const cls = await ownedClass(id, session.parentId);
  if (!cls) return error(404, "Class not found");
  await removeClassStudents(id);
  await run("DELETE FROM class_members WHERE class_id = ?", [id]);
  await run("DELETE FROM class_assignments WHERE class_id = ?", [id]);
  await run("UPDATE classes SET closed_at = ?, join_code = ? WHERE id = ?", [Date.now(), `X${id.slice(0, 10)}`, id]);
  return json({ closed: true });
}
