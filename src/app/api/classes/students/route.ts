import { error, getSession, json, rateLimited, sameOrigin } from "@/server/auth";
import { ownedClass } from "@/server/classroom";
import { addStudents, cleanStudentName, removeStudent, resetStudentCode } from "@/server/students";

// A teacher adds students to a class they own. Each gets a login code; there is no email or password.

const MAX_BATCH = 40;

async function teacherClass(req: Request, classId: string) {
  if (!sameOrigin(req)) return { fail: error(403, "Bad origin") };
  const session = await getSession(req);
  if (!session) return { fail: error(401, "Not signed in") };
  const cls = await ownedClass(classId, session.parentId);
  if (!cls) return { fail: error(404, "Class not found") };
  return { session, cls };
}

/** Adds students by first name or nickname. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { classId?: unknown; names?: unknown } | null;
  const found = await teacherClass(req, typeof body?.classId === "string" ? body.classId : "");
  if (found.fail) return found.fail;
  const { session, cls } = found;
  if (!session!.verified) return error(403, "Please confirm your email first. Student accounts hold children's practice, so we only allow them for confirmed accounts.");
  if (await rateLimited(`students:${session!.parentId}`, 30, 60 * 60_000)) return error(429, "Too many students added. Try again later.");
  const raw = Array.isArray(body?.names) ? body.names : [];
  const names = raw.slice(0, MAX_BATCH).map(cleanStudentName).filter(Boolean);
  if (!names.length) return error(400, "Type at least one first name.");
  const students = await addStudents(cls!, names);
  if (!students.length) return error(409, "This class is full.");
  return json({ students, skipped: names.length - students.length });
}

/** Removes a student and deletes everything stored about them. */
export async function DELETE(req: Request) {
  const params = new URL(req.url).searchParams;
  const found = await teacherClass(req, params.get("classId") ?? "");
  if (found.fail) return found.fail;
  const removed = await removeStudent(found.cls!.id, params.get("studentId") ?? "");
  return removed ? json({ removed: true }) : error(404, "Student not found");
}

/** Gives a student a new login code and signs them out everywhere. */
export async function PATCH(req: Request) {
  const params = new URL(req.url).searchParams;
  const found = await teacherClass(req, params.get("classId") ?? "");
  if (found.fail) return found.fail;
  const code = await resetStudentCode(found.cls!.id, params.get("studentId") ?? "");
  return code ? json({ loginCode: code }) : error(404, "Student not found");
}
