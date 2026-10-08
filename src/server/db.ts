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
];

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
