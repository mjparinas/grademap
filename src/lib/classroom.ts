// Browser calls for classroom mode (teachers and parents). All need a connection and a signed-in account.

export interface ClassSummary {
  id: string;
  name: string;
  grade: string;
  framework: string;
  joinCode: string;
  students: number;
}

export interface StudentRow {
  profileId: string;
  name: string;
  avatar: string;
  grade: string;
  lastActive: number | null;
  units: { key: string; level: number; attempts: number; accuracy: number }[];
}

export interface RosterEntry {
  id: string;
  profileId: string;
  loginCode: string;
}

export interface ClassLink {
  classId: string;
  profileId: string;
  className: string;
  grade: string;
}

/** Units a teacher assigned to one child, as sent down by sync and kept on the device for offline use. */
export interface Classwork {
  profileId: string;
  classId: string;
  className: string;
  unitKeys: string[];
  /** Due dates (ms since epoch) by unit key, for the units that have one. */
  due?: Record<string, number>;
}

export async function call<T>(url: string, method = "GET", body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("You’re offline. Connect to the internet and try again.");
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Something went wrong (${res.status}).`);
  return data;
}

// ---------- What a teacher should look at next ----------

/** Fewer attempts than this say too little to call a unit tricky for a student. */
export const MIN_ATTEMPTS = 4;
/** First-try accuracy under this on a unit means the student may want a hand with it. */
export const NEEDS_HAND_BELOW = 0.6;
const WEEK = 7 * 86_400_000;

export interface UnitInsight {
  key: string;
  /** Students with any practice on this unit. */
  started: number;
  notStarted: number;
  /** Students who reached Proficient or higher (level 2+). */
  proficient: number;
  /** Students with enough attempts and low first-try accuracy. */
  needHand: string[];
  /** First-try accuracy across everyone's attempts, or null when nobody has started. */
  accuracy: number | null;
}

export interface StudentInsight {
  profileId: string;
  name: string;
  /** Plain-language reasons, ready to show. */
  reasons: string[];
}

export interface ClassInsights {
  units: UnitInsight[];
  /** Units where a good share of the students who tried it are finding it tricky, trickiest first. */
  focusUnits: UnitInsight[];
  /** Students to check in with: tricky units, or no practice for a week. */
  checkIn: StudentInsight[];
}

/** Turns the class table into "reteach this" and "check in with these students". Practice only, never a mark. */
export function classInsights(students: StudentRow[], assignments: string[], unitName: (key: string) => string, now = Date.now()): ClassInsights {
  const units: UnitInsight[] = assignments.map((key) => {
    let attempts = 0;
    let right = 0;
    const row: UnitInsight = { key, started: 0, notStarted: 0, proficient: 0, needHand: [], accuracy: null };
    for (const s of students) {
      const u = s.units.find((x) => x.key === key);
      if (!u || u.attempts === 0) {
        row.notStarted++;
        continue;
      }
      row.started++;
      attempts += u.attempts;
      right += u.accuracy * u.attempts;
      if (u.level >= 2) row.proficient++;
      if (u.attempts >= MIN_ATTEMPTS && u.accuracy < NEEDS_HAND_BELOW) row.needHand.push(s.profileId);
    }
    row.accuracy = attempts ? right / attempts : null;
    return row;
  });
  const focusUnits = units
    .filter((u) => u.needHand.length > 0 && u.needHand.length / u.started >= 0.3)
    .sort((a, b) => b.needHand.length / b.started - a.needHand.length / a.started || b.needHand.length - a.needHand.length);
  const checkIn: StudentInsight[] = [];
  for (const s of students) {
    const reasons: string[] = [];
    const tricky = units.filter((u) => u.needHand.includes(s.profileId)).map((u) => unitName(u.key));
    if (tricky.length) reasons.push(`Finding ${tricky.slice(0, 2).join(" and ")}${tricky.length > 2 ? ` and ${tricky.length - 2} more` : ""} tricky`);
    if (assignments.length && (s.lastActive === null || now - s.lastActive > WEEK)) reasons.push(s.lastActive === null ? "Hasn’t started yet" : "No practice this week");
    if (reasons.length) checkIn.push({ profileId: s.profileId, name: s.name, reasons });
  }
  return { units, focusUnits, checkIn };
}
