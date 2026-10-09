import { error, getSession, json, sameOrigin } from "@/server/auth";
import { MAX_ASSIGNMENTS, ownedClass, validUnit } from "@/server/classroom";
import { query, run } from "@/server/db";

/** Assigns a BC unit to a class. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const body = (await req.json().catch(() => null)) as { classId?: unknown; unitKey?: unknown } | null;
  const cls = typeof body?.classId === "string" ? await ownedClass(body.classId, session.parentId) : undefined;
  if (!cls) return error(404, "Class not found");
  const key = typeof body?.unitKey === "string" ? body.unitKey : "";
  if (!(await validUnit(key, cls.grade))) return error(400, "That unit isn’t part of this class’s grade.");
  const have = await query<{ n: number }>("SELECT COUNT(*) AS n FROM class_assignments WHERE class_id = ?", [cls.id]);
  if (Number(have[0].n) >= MAX_ASSIGNMENTS) return error(409, "That’s a lot of assigned units. Remove some first.");
  await run("INSERT OR IGNORE INTO class_assignments (class_id, unit_key, created_at) VALUES (?, ?, ?)", [cls.id, key, Date.now()]);
  return json({ ok: true });
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
