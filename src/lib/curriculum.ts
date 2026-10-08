import { math } from "./content/math";
import { reading } from "./content/reading";
import { science } from "./content/science";
import { world } from "./content/world";
import type { Subject, SubjectId, Unit } from "./types";

export const GRADE_LABEL = "Grade 2";
export const PROVINCE_LABEL = "BC Curriculum";

export const SUBJECTS: Subject[] = [math, reading, science, world];

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getUnit(subjectId: string, unitId: string): { subject: Subject; unit: Unit } | undefined {
  const subject = getSubject(subjectId);
  const unit = subject?.units.find((u) => u.id === unitId);
  return subject && unit ? { subject, unit } : undefined;
}

/** Progress is stored per unit under "subject/unit". */
export function unitKey(subjectId: SubjectId | string, unitId: string): string {
  return `${subjectId}/${unitId}`;
}

export const TOTAL_UNITS = SUBJECTS.reduce((n, s) => n + s.units.length, 0);
