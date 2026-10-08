import "server-only";
import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { query, run } from "./db";

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

const COOKIE = "gm_session";
const SESSION_DAYS = 180;

export interface SessionInfo {
  parentId: string;
  familyId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, keyHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !keyHex) return false;
  const key = await scryptAsync(password, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(keyHex, "hex");
  return key.length === expected.length && timingSafeEqual(key, expected);
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export async function createSession(parentId: string, familyId: string): Promise<{ token: string; maxAge: number }> {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  const maxAge = SESSION_DAYS * 86_400;
  await run("INSERT INTO sessions (token_hash, parent_id, family_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)", [
    sha(token),
    parentId,
    familyId,
    now + maxAge * 1000,
    now,
  ]);
  return { token, maxAge };
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export async function getSession(req: Request): Promise<SessionInfo | null> {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  const rows = await query<{ parent_id: string; family_id: string; expires_at: number; email: string }>(
    `SELECT s.parent_id, s.family_id, s.expires_at, p.email FROM sessions s JOIN parents p ON p.id = s.parent_id WHERE s.token_hash = ?`,
    [sha(token)],
  );
  const row = rows[0];
  if (!row || Number(row.expires_at) < Date.now()) return null;
  return { parentId: row.parent_id, familyId: row.family_id, email: row.email };
}

export async function endSession(req: Request): Promise<void> {
  const token = readCookie(req, COOKIE);
  if (token) await run("DELETE FROM sessions WHERE token_hash = ?", [sha(token)]);
}

export function sessionCookie(token: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function newId(): string {
  return randomUUID();
}

// ---------- Request safety ----------

/** Blocks cross-site form posts: state-changing requests must come from our own origin. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin fetches from some browsers, and server-to-server calls
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

const attempts = new Map<string, { count: number; reset: number }>();

/** A simple in-memory limiter for login and signup. */
export function rateLimited(key: string, limit = 10, windowMs = 10 * 60_000): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.reset < now) {
    attempts.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}

export function json(data: unknown, init: ResponseInit & { cookie?: string } = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  headers.set("cache-control", "no-store");
  if (init.cookie) headers.append("set-cookie", init.cookie);
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function error(status: number, message: string): Response {
  return json({ error: message }, { status });
}
