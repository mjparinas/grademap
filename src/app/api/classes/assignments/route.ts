import { error, getSession, json, sameOrigin } from "@/server/auth";
import { cleanDueAt, MAX_ASSIGNMENTS, ownedClass, validUnit } from "@/server/classroom";
import { query, run } from "@/server/db";

/** Assigns a unit from the class’s province to a class. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const body = (await req.json().catch(() => null)) as { classId?: unknown; unitKey?: unknown; dueAt?: unknown } | null;
  const cls = typeof body?.classId === "string" ? await ownedClass(body.classId, session.parentId) : undefined;
  if (!cls) return error(404, "Class not found");
  const key = typeof body?.unitKey === "string" ? body.unitKey : "";
  if (!(await validUnit(key, cls.grade, cls.framework))) return error(400, "That unit isn’t part of this class’s grade.");
  const have = await query<{ n: number }>("SELECT COUNT(*) AS n FROM class_assignments WHERE class_id = ?", [cls.id]);
  if (Number(have[0].n) >= MAX_ASSIGNMENTS) return error(409, "That’s a lot of assigned units. Remove some first.");
  const dueAt = cleanDueAt(body?.dueAt);
  await run("INSERT OR IGNORE INTO class_assignments (class_id, unit_key, created_at, due_at) VALUES (?, ?, ?, ?)", [cls.id, key, Date.now(), dueAt ?? null]);
  return json({ ok: true });
}

/** Sets or clears the due date on an assigned unit. */
export async function PATCH(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const body = (await req.json().catch(() => null)) as { classId?: unknown; unitKey?: unknown; dueAt?: unknown } | null;
  const cls = typeof body?.classId === "string" ? await ownedClass(body.classId, session.parentId) : undefined;
  if (!cls) return error(404, "Class not found");
  const dueAt = cleanDueAt(body?.dueAt);
  if (dueAt === undefined) return error(400, "Choose a due date within the next year.");
  const changed = await run("UPDATE class_assignments SET due_at = ? WHERE class_id = ? AND unit_key = ?", [dueAt, cls.id, typeof body?.unitKey === "string" ? body.unitKey : ""]);
  return changed ? json({ ok: true }) : error(404, "That unit isn’t assigned.");
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const params = new URL(req.url).searchParams;
  const cls = await ownedClass(params.get("classId") ?? "", session.parentId);
  if (!cls) return error(404, "Class not found");
  await run("DELETE FROM class_assignments WHERE class_id = ? AND unit_key = ?", [cls.id, params.get("unitKey") ?? ""]);
  return json({ ok: true });
}
