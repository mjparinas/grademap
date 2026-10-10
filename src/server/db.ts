import "server-only";
import { createClient, type Client, type InValue } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

// One SQLite-compatible database: a local file in development, or a hosted
// libSQL/Turso database in production (set DATABASE_URL + DATABASE_AUTH_TOKEN).

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS families (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    trial_ends_at INTEGER NOT NULL,
    plan TEXT NOT NULL DEFAULT 'trial',
    stripe_customer TEXT,
    subscription_status TEXT,
    subscription_interval TEXT,
    current_period_end INTEGER,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS parents (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    family_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS profiles_family ON profiles (family_id)`,
  `CREATE TABLE IF NOT EXISTS child_settings (
    profile_id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS events (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    id TEXT NOT NULL UNIQUE,
    family_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    t INTEGER NOT NULL,
    data TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS events_family_seq ON events (family_id, seq)`,
  `CREATE INDEX IF NOT EXISTS events_profile ON events (profile_id, t)`,
  // One-time tokens for password reset and email confirmation. Only a hash is stored.
  `CREATE TABLE IF NOT EXISTS auth_tokens (
    token_hash TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used_at INTEGER
  )`,
  `CREATE INDEX IF NOT EXISTS auth_tokens_parent ON auth_tokens (parent_id)`,
  // Shared across serverless instances, unlike an in-memory counter.
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    reset_at INTEGER NOT NULL
  )`,
  // Read-only report links a parent can share and revoke.
  `CREATE TABLE IF NOT EXISTS report_shares (
    token_hash TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    days INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS report_shares_family ON report_shares (family_id)`,
  // "Report a problem" on a question: fixed reasons only, no free text from children.
  `CREATE TABLE IF NOT EXISTS question_reports (
    id TEXT PRIMARY KEY,
    family_id TEXT,
    unit_key TEXT NOT NULL,
    prompt TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  // Classroom mode. A teacher is an ordinary account; a class never stores anything about a child
  // beyond the link a parent chose to make with the join code.
  `CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    owner_parent_id TEXT NOT NULL,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    join_code TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    closed_at INTEGER
  )`,
  `CREATE INDEX IF NOT EXISTS classes_owner ON classes (owner_parent_id)`,
  `CREATE TABLE IF NOT EXISTS class_members (
    class_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    family_id TEXT NOT NULL,
    joined_at INTEGER NOT NULL,
    PRIMARY KEY (class_id, profile_id)
  )`,
  `CREATE INDEX IF NOT EXISTS class_members_family ON class_members (family_id)`,
  // Stripe events already handled, so a redelivered webhook is a no-op.
  `CREATE TABLE IF NOT EXISTS stripe_events (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS class_assignments (
    class_id TEXT NOT NULL,
    unit_key TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (class_id, unit_key)
  )`,
  // Students a teacher added to a class. Each one has their own hidden family record (a profile
  // and its events), owned by the class: it is deleted when the student is removed or the class closes.
  `CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    class_id TEXT NOT NULL,
    family_id TEXT NOT NULL,
    parent_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    login_code TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    UNIQUE (class_id, login_code)
  )`,
  `CREATE INDEX IF NOT EXISTS students_class ON students (class_id)`,
];

/** Columns added after the first release. SQLite has no "ADD COLUMN IF NOT EXISTS". */
const PARENT_COLUMNS: [string, string][] = [
  ["email_verified_at", "INTEGER"],
  ["weekly_report", "INTEGER NOT NULL DEFAULT 0"],
  ["unsub_token", "TEXT"],
  ["last_weekly_at", "INTEGER"],
  ["trial_notice_at", "INTEGER"],
  ["practice_reminders", "INTEGER NOT NULL DEFAULT 0"],
  ["last_nudge_at", "INTEGER"],
  // 'parent' for ordinary accounts, 'student' for a class-owned student account (no email, no password).
  ["role", "TEXT NOT NULL DEFAULT 'parent'"],
];

/** Which province's curriculum a class assigns units from. Classes made before Ontario are BC. */
const CLASS_COLUMNS: [string, string][] = [["framework", "TEXT NOT NULL DEFAULT 'ca-bc'"]];
/** A due date a teacher can set on an assigned unit (ms since epoch). */
const ASSIGNMENT_COLUMNS: [string, string][] = [["due_at", "INTEGER"]];
const SESSION_COLUMNS: [string, string][] = [["user_agent", "TEXT"]];
const FAMILY_COLUMNS: [string, string][] = [["billing_event_at", "INTEGER NOT NULL DEFAULT 0"]];

async function addColumns(c: Client, table: string, columns: [string, string][]) {
  const have = new Set((await c.execute(`PRAGMA table_info(${table})`)).rows.map((r) => String(r.name)));
  for (const [name, type] of columns) if (!have.has(name)) await c.execute(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`);
}

async function migrate(c: Client) {
  await addColumns(c, "sessions", SESSION_COLUMNS);
  await addColumns(c, "families", FAMILY_COLUMNS);
  await addColumns(c, "classes", CLASS_COLUMNS);
  await addColumns(c, "class_assignments", ASSIGNMENT_COLUMNS);
  const have = new Set((await c.execute("PRAGMA table_info(parents)")).rows.map((r) => String(r.name)));
  for (const [name, type] of PARENT_COLUMNS) {
    if (!have.has(name)) await c.execute(`ALTER TABLE parents ADD COLUMN ${name} ${type}`);
  }
}

let client: Client | null = null;
let ready: Promise<void> | null = null;

export function databaseUrl(): string {
  return process.env.DATABASE_URL ?? "file:./data/grademap.db";
}

export async function db(): Promise<Client> {
  if (!client) {
    const url = databaseUrl();
    if (url.startsWith("file:")) mkdirSync(dirname(url.slice(5)), { recursive: true });
    client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
    ready = (async () => {
      for (const sql of SCHEMA) await client!.execute(sql);
      await migrate(client!);
    })();
  }
  await ready;
  return client;
}

export async function query<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T[]> {
  const res = await (await db()).execute({ sql, args });
  return res.rows as unknown as T[];
}

export async function run(sql: string, args: InValue[] = []): Promise<number> {
  const res = await (await db()).execute({ sql, args });
  return res.rowsAffected;
}

export async function batch(statements: { sql: string; args: InValue[] }[]): Promise<void> {
  if (!statements.length) return;
  await (await db()).batch(statements, "write");
}
