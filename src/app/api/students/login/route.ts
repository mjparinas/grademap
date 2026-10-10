import { clientIp, createSession, error, json, rateLimited, sameOrigin, sessionCookie } from "@/server/auth";
import { normalizeCode } from "@/server/classroom";
import { query, run } from "@/server/db";
import { getFamilyRow, toFamilyInfo } from "@/server/family";
import { normalizeStudentCode } from "@/server/students";

// A student signs in with the class code and their own code. Both are short, so this is rate
// limited per device and per class to make guessing impractical.

const TOO_MANY = "Too many tries. Ask your teacher to check your codes.";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const ip = clientIp(req);
  if (await rateLimited(`student-login:${ip}`, 15)) return error(429, TOO_MANY);
  const body = (await req.json().catch(() => null)) as { classCode?: unknown; studentCode?: unknown } | null;
  const classCode = normalizeCode(body?.classCode);
  const studentCode = normalizeStudentCode(body?.studentCode);
  if (classCode.length < 6 || studentCode.length < 6) return error(400, "Type both codes from your teacher.");
  if (await rateLimited(`student-login-class:${classCode}`, 200, 60 * 60_000)) return error(429, TOO_MANY);
  const rows = await query<{ parent_id: string; family_id: string; class_id: string }>(
    `SELECT s.parent_id, s.family_id, s.class_id FROM students s JOIN classes c ON c.id = s.class_id AND c.closed_at IS NULL
     WHERE c.join_code = ? AND s.login_code = ?`,
    [classCode, studentCode],
  );
  const student = rows[0];
  if (!student) return error(401, "Those codes don’t match. Check them with your teacher.");
  await run("UPDATE classes SET last_activity_at = ?, inactive_warning_at = NULL WHERE id = ? AND closed_at IS NULL", [Date.now(), student.class_id]);
  const { token, maxAge } = await createSession(student.parent_id, student.family_id, req);
  const family = toFamilyInfo((await getFamilyRow(student.family_id))!, "", false, true);
  return json({ family }, { cookie: sessionCookie(token, maxAge) });
}
