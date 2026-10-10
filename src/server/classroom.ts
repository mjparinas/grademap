import "server-only";
import { randomInt } from "node:crypto";
import { getCourse, loadGrade, parseUnitKey } from "@/content";
import { FRAMEWORKS } from "@/content/frameworks";
import type { FrameworkId, GradeId } from "@/content/types";
import { unitLevel } from "@/lib/proficiency";
import { query } from "./db";
import { loadChildReport } from "./reportData";

// Classroom mode. A teacher owns a class and shares its join code. A parent chooses to link a
// child with that code (and can unlink at any time). The teacher then sees that child's first name,
// grade and practice results for the units they assigned, and nothing else.

export const MAX_CLASSES = 10;
export const MAX_STUDENTS = 40;
export const MAX_ASSIGNMENTS = 60;

// No 0/O or 1/I/L, so a code is easy to read off a whiteboard.
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function newJoinCode(): string {
  return Array.from({ length: 6 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");
}

export const normalizeCode = (v: unknown): string => String(v ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

export interface ClassRow {
  id: string;
  owner_parent_id: string;
  name: string;
  grade: GradeId;
  framework: FrameworkId;
  join_code: string;
  created_at: number;
  closed_at: number | null;
}

export async function ownedClass(id: string, parentId: string): Promise<ClassRow | undefined> {
  return (await query<ClassRow>("SELECT * FROM classes WHERE id = ? AND owner_parent_id = ? AND closed_at IS NULL", [id, parentId]))[0];
}

export const isFramework = (v: unknown): v is FrameworkId => FRAMEWORKS.some((f) => f.id === v);

/** A unit key that exists in this class's grade and province. */
export async function validUnit(key: string, grade: GradeId, framework: FrameworkId): Promise<boolean> {
  const parsed = parseUnitKey(key);
  if (!parsed || parsed.grade !== grade) return false;
  await loadGrade(grade, framework);
  return !!getCourse(grade, parsed.subject, framework)?.units.some((u) => u.id === parsed.unitId);
}

export async function assignmentKeys(classId: string): Promise<string[]> {
  const rows = await query<{ unit_key: string }>("SELECT unit_key FROM class_assignments WHERE class_id = ? ORDER BY created_at, unit_key", [classId]);
  return rows.map((r) => r.unit_key);
}

export interface Classwork {
  profileId: string;
  classId: string;
  className: string;
  unitKeys: string[];
  /** Due dates the teacher set (ms since epoch), by unit key. Units without one are not listed. */
  due: Record<string, number>;
}

/** Due dates a teacher set on this class's assigned units. */
export async function assignmentDue(classId: string): Promise<Record<string, number>> {
  const rows = await query<{ unit_key: string; due_at: number | null }>("SELECT unit_key, due_at FROM class_assignments WHERE class_id = ? AND due_at IS NOT NULL", [classId]);
  return Object.fromEntries(rows.map((r) => [r.unit_key, Number(r.due_at)]));
}

/** A due date from the browser: a time within the next year or the last month, or null for none. */
export function cleanDueAt(v: unknown, now = Date.now()): number | null | undefined {
  if (v === null) return null;
  if (typeof v !== "number" || !Number.isFinite(v)) return undefined;
  return v > now - 30 * 86_400_000 && v < now + 366 * 86_400_000 ? Math.round(v) : undefined;
}

/** What each of a family's linked children has been assigned. Sent only to that family's own devices. */
export async function familyClasswork(familyId: string): Promise<Classwork[]> {
  const rows = await query<{ profile_id: string; class_id: string; name: string; unit_key: string | null; due_at: number | null }>(
    `SELECT m.profile_id, m.class_id, c.name, a.unit_key, a.due_at FROM class_members m
     JOIN classes c ON c.id = m.class_id AND c.closed_at IS NULL
     LEFT JOIN class_assignments a ON a.class_id = m.class_id
     WHERE m.family_id = ? ORDER BY m.joined_at, a.created_at, a.unit_key`,
    [familyId],
  );
  const out = new Map<string, Classwork>();
  for (const r of rows) {
    const k = `${r.profile_id}/${r.class_id}`;
    const entry = out.get(k) ?? { profileId: r.profile_id, classId: r.class_id, className: r.name, unitKeys: [], due: {} };
    if (r.unit_key) entry.unitKeys.push(r.unit_key);
    if (r.unit_key && r.due_at != null) entry.due[r.unit_key] = Number(r.due_at);
    out.set(k, entry);
  }
  return [...out.values()];
}

export interface StudentProgress {
  profileId: string;
  name: string;
  avatar: string;
  grade: GradeId;
  lastActive: number | null;
  /** One entry per assigned unit, in assignment order. level -1 = not started. */
  units: { key: string; level: number; attempts: number; accuracy: number }[];
}

/** Progress for linked students on the assigned units only. Never includes an email or other family details. */
export async function classProgress(classId: string): Promise<StudentProgress[]> {
  const members = await query<{ profile_id: string; family_id: string }>("SELECT profile_id, family_id FROM class_members WHERE class_id = ? ORDER BY joined_at", [classId]);
  const keys = await assignmentKeys(classId);
  const out: StudentProgress[] = [];
  for (const m of members) {
    const data = await loadChildReport(m.family_id, m.profile_id, 90);
    if (!data) continue;
    const byKey = new Map(data.report.units.map((u) => [u.ref.key, u]));
    out.push({
      profileId: m.profile_id,
      name: data.profile.name,
      avatar: data.profile.avatar,
      grade: data.profile.grade,
      lastActive: data.report.units.reduce<number | null>((t, u) => (u.lastT && (t === null || u.lastT > t) ? u.lastT : t), null),
      units: keys.map((key) => {
        const u = byKey.get(key);
        return { key, level: u ? u.level : unitLevel(undefined), attempts: u?.attempts ?? 0, accuracy: u?.accuracy ?? 0 };
      }),
    });
  }
  return out;
}
