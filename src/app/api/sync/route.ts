import type { InValue } from "@libsql/client";
import type { AppEvent, ChildSettings, Profile } from "@/lib/model";
import { error, getSession, json, rateLimited, sameOrigin } from "@/server/auth";
import { batch, query } from "@/server/db";
import { familyClasswork } from "@/server/classroom";
import { getFamilyRow, toFamilyInfo } from "@/server/family";

// Two-way sync. Devices upload events they haven't sent yet, plus any profile
// or settings changes, and download everything new since their cursor.
// Events are append-only with unique ids, so uploads are idempotent.

const MAX_EVENTS = 1000;
const PAGE = 2000;
/** Most events one family can store; a real child makes a few thousand a year. */
const MAX_FAMILY_EVENTS = 250_000;
const MAX_JSON = 4000;
const EVENT_TYPES = new Set(["answer", "session", "play", "game", "trophy", "secret", "buy", "quest", "placement"]);

interface SyncBody {
  cursor?: number;
  events?: AppEvent[];
  profiles?: Profile[];
  settings?: ChildSettings[];
}

const isId = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length <= 64;

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req, { student: true });
  if (!session) return error(401, "Not signed in");
  const family = session.familyId;
  // The app syncs every couple of minutes and after changes; this is far above that.
  if (await rateLimited(`sync:${family}`, 300, 10 * 60_000)) return error(429, "Syncing too often. Try again in a few minutes.");
  const body = (await req.json().catch(() => null)) as SyncBody | null;
  if (!body) return error(400, "Bad request");
  const list = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const incomingEvents = list<AppEvent>(body.events).slice(0, MAX_EVENTS);
  const incomingProfiles = list<Profile>(body.profiles).slice(0, 20);
  const incomingSettings = list<ChildSettings>(body.settings).slice(0, 20);

  // Which profiles belong to this family (and which belong to someone else).
  const existing = await query<{ id: string; family_id: string; updated_at: number; data: string }>(
    `SELECT id, family_id, updated_at, data FROM profiles WHERE family_id = ? OR id IN (${incomingProfiles.map(() => "?").join(",") || "''"})`,
    [family, ...incomingProfiles.map((p) => p?.id ?? "")],
  );
  const owner = new Map(existing.map((r) => [r.id, r]));
  const writes: { sql: string; args: InValue[] }[] = [];
  const mine = new Set(existing.filter((r) => r.family_id === family).map((r) => r.id));
  // Children who were deleted or reset: events they still hold from before must not come back.
  const gone = new Map<string, { deleted: boolean; resetAt: number }>();
  for (const r of existing) {
    if (r.family_id !== family) continue;
    try {
      const old = JSON.parse(r.data) as Profile;
      gone.set(r.id, { deleted: Boolean(old.deleted), resetAt: old.resetAt ?? 0 });
    } catch {
      /* unreadable record: treat as a normal child */
    }
  }

  for (const incoming of incomingProfiles) {
    if (!incoming || !isId(incoming.id) || typeof incoming.updatedAt !== "number") continue;
    const row = owner.get(incoming.id);
    if (row && row.family_id !== family) continue;
    let p = incoming;
    if (session.student) {
      // A class account has exactly the child the teacher made. The child can change what they
      // wear, but not their name, grade or province, and can't add or delete anyone.
      if (!row) continue;
      try {
        const kept = JSON.parse(row.data) as Profile;
        p = { ...incoming, name: kept.name, grade: kept.grade, framework: kept.framework, birthYear: undefined, deleted: false, resetAt: kept.resetAt };
      } catch {
        continue;
      }
    }
    mine.add(p.id);
    if (!row || p.updatedAt > Number(row.updated_at)) {
      gone.set(p.id, { deleted: Boolean(p.deleted), resetAt: p.resetAt ?? 0 });
      const data = JSON.stringify(p);
      if (data.length > MAX_JSON) continue; // never store half a JSON document
      writes.push({
        sql: `INSERT INTO profiles (id, family_id, data, updated_at) VALUES (?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
        args: [p.id, family, data, p.updatedAt],
      });
      // Deleting a child removes their history from the server too.
      if (p.deleted) {
        writes.push({ sql: "DELETE FROM events WHERE profile_id = ? AND family_id = ?", args: [p.id, family] });
        writes.push({ sql: "DELETE FROM class_members WHERE profile_id = ? AND family_id = ?", args: [p.id, family] });
      }
      else if (p.resetAt) {
        writes.push({ sql: "DELETE FROM events WHERE profile_id = ? AND family_id = ? AND t <= ?", args: [p.id, family, p.resetAt] });
      }
    }
  }

  for (const s of incomingSettings) {
    if (!isId(s?.profileId) || !mine.has(s.profileId) || typeof s.updatedAt !== "number") continue;
    const settingsJson = JSON.stringify(s);
    if (settingsJson.length > MAX_JSON) continue;
    writes.push({
      sql: `INSERT INTO child_settings (profile_id, family_id, data, updated_at) VALUES (?, ?, ?, ?)
            ON CONFLICT(profile_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
            WHERE excluded.updated_at > child_settings.updated_at`,
      args: [s.profileId, family, settingsJson, s.updatedAt],
    });
  }

  const accepted: string[] = [];
  // A family at its storage cap can still read and sync its profiles, just not add more events.
  const used = incomingEvents.length ? Number((await query<{ n: number }>("SELECT COUNT(*) AS n FROM events WHERE family_id = ?", [family]))[0].n) : 0;
  const room = Math.max(0, MAX_FAMILY_EVENTS - used);
  let stored = 0;
  for (const e of incomingEvents) {
    if (!isId(e?.id) || !isId(e.profileId) || !mine.has(e.profileId) || !EVENT_TYPES.has(e.type)) continue;
    if (typeof e.t !== "number" || e.t > Date.now() + 86_400_000) continue;
    const data = JSON.stringify(e);
    if (data.length > 2000) continue;
    const state = gone.get(e.profileId);
    if (state && (state.deleted || e.t <= state.resetAt)) {
      // Acknowledge it so the device stops resending, but don't store it.
      accepted.push(e.id);
      continue;
    }
    if (stored++ >= room) continue;
    writes.push({
      sql: "INSERT OR IGNORE INTO events (id, family_id, profile_id, t, data) VALUES (?, ?, ?, ?, ?)",
      args: [e.id, family, e.profileId, e.t, data],
    });
    accepted.push(e.id);
  }
  await batch(writes);

  // Download: everything new for this family since the device's cursor.
  const cursor = Math.max(0, Number(body.cursor) || 0);
  const rows = await query<{ seq: number; data: string }>(
    "SELECT seq, data FROM events WHERE family_id = ? AND seq > ? ORDER BY seq LIMIT ?",
    [family, cursor, PAGE],
  );
  const profiles = await query<{ data: string }>("SELECT data FROM profiles WHERE family_id = ?", [family]);
  const settings = await query<{ data: string }>("SELECT data FROM child_settings WHERE family_id = ?", [family]);
  const famRow = await getFamilyRow(family);

  return json({
    accepted,
    cursor: rows.length ? Number(rows[rows.length - 1].seq) : cursor,
    more: rows.length === PAGE,
    events: rows.map((r) => JSON.parse(r.data)),
    profiles: profiles.map((r) => JSON.parse(r.data)),
    settings: settings.map((r) => JSON.parse(r.data)),
    classwork: await familyClasswork(family),
    family: famRow ? toFamilyInfo(famRow, session.email, session.verified, session.student, session.coParent) : undefined,
  });
}
