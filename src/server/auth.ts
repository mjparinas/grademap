import "server-only";
import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { query, run } from "./db";

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

// In production the cookie carries the __Host- prefix: browsers then refuse it unless it is Secure,
// has Path=/ and no Domain, so a sibling subdomain can't plant or overwrite it.
const COOKIE = process.env.NODE_ENV === "production" ? "__Host-gm_session" : "gm_session";
const SESSION_DAYS = 90;

export interface SessionInfo {
  parentId: string;
  familyId: string;
  email: string;
  verified: boolean;
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

export async function createSession(parentId: string, familyId: string, req?: Request): Promise<{ token: string; maxAge: number }> {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  const maxAge = SESSION_DAYS * 86_400;
  await run("INSERT INTO sessions (token_hash, parent_id, family_id, expires_at, created_at, user_agent) VALUES (?, ?, ?, ?, ?, ?)", [
    sha(token),
    parentId,
    familyId,
    now + maxAge * 1000,
    now,
    (req?.headers.get("user-agent") ?? "").slice(0, 200),
  ]);
  // Expired sessions and rate-limit counters are cleaned up now and then, so the tables stay small.
  if (Math.random() < 0.05) {
    await run("DELETE FROM sessions WHERE expires_at < ?", [now]).catch(() => {});
    await run("DELETE FROM rate_limits WHERE reset_at < ?", [now]).catch(() => {});
  }
  return { token, maxAge };
}

export interface SessionSummary {
  id: string;
  createdAt: number;
  device: string;
  current: boolean;
}

/** A short, readable label for a User-Agent string. */
export function deviceLabel(ua: string): string {
  const os = /iPhone|iPad/.test(ua) ? "iPhone/iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X|Macintosh/.test(ua) ? "Mac" : /CrOS/.test(ua) ? "Chromebook" : /Linux/.test(ua) ? "Linux" : "Unknown device";
  const browser = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "";
  return browser ? `${browser} on ${os}` : os;
}

const sessionId = (tokenHash: string) => tokenHash.slice(0, 16);

export async function listSessions(req: Request, parentId: string): Promise<SessionSummary[]> {
  const token = readCookie(req, COOKIE);
  const mine = token ? sha(token) : "";
  const rows = await query<{ token_hash: string; created_at: number; user_agent: string | null }>(
    "SELECT token_hash, created_at, user_agent FROM sessions WHERE parent_id = ? AND expires_at > ? ORDER BY created_at DESC LIMIT 50",
    [parentId, Date.now()],
  );
  return rows.map((r) => ({ id: sessionId(r.token_hash), createdAt: Number(r.created_at), device: deviceLabel(r.user_agent ?? ""), current: r.token_hash === mine }));
}

/** Signs out one session by its short id, or every session except this one when no id is given. */
export async function revokeSessions(req: Request, parentId: string, id?: string): Promise<number> {
  const token = readCookie(req, COOKIE);
  const mine = token ? sha(token) : "";
  if (id) return run("DELETE FROM sessions WHERE parent_id = ? AND substr(token_hash, 1, 16) = ? AND token_hash != ?", [parentId, id.slice(0, 16), mine]);
  return run("DELETE FROM sessions WHERE parent_id = ? AND token_hash != ?", [parentId, mine]);
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

/** The hash of this request's session token, or "" when there is none. */
export function readCookieToken(req: Request): string {
  const token = readCookie(req, COOKIE);
  return token ? sha(token) : "";
}

export async function getSession(req: Request): Promise<SessionInfo | null> {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  const rows = await query<{ parent_id: string; family_id: string; expires_at: number; email: string; email_verified_at: number | null }>(
    `SELECT s.parent_id, s.family_id, s.expires_at, p.email, p.email_verified_at FROM sessions s JOIN parents p ON p.id = s.parent_id WHERE s.token_hash = ?`,
    [sha(token)],
  );
  const row = rows[0];
  if (!row || Number(row.expires_at) < Date.now()) return null;
  return { parentId: row.parent_id, familyId: row.family_id, email: row.email, verified: Boolean(row.email_verified_at) };
}

export async function endSession(req: Request): Promise<void> {
  const token = readCookie(req, COOKIE);
  if (token) await run("DELETE FROM sessions WHERE token_hash = ?", [sha(token)]);
}

export function sessionCookie(token: string, maxAge: number): string {
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag()}`;
}

export function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag()}`;
}

const secureFlag = () => (process.env.NODE_ENV === "production" ? "; Secure" : "");

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

/**
 * A limiter for login, signup and email-sending routes. The counters live in the database,
 * so they hold across serverless instances and restarts. Returns true when over the limit.
 */
export async function rateLimited(key: string, limit = 10, windowMs = 10 * 60_000): Promise<boolean> {
  const now = Date.now();
  const rows = await query<{ count: number }>(
    `INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN reset_at < ? THEN 1 ELSE count + 1 END,
       reset_at = CASE WHEN reset_at < ? THEN ? ELSE reset_at END
     RETURNING count`,
    [key, now + windowMs, now, now, now + windowMs],
  );
  return Number(rows[0]?.count ?? 1) > limit;
}

// ---------- One-time tokens (password reset, email confirmation) ----------

export type TokenKind = "reset" | "verify";

export async function createAuthToken(parentId: string, kind: TokenKind, ttlMs: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await run("DELETE FROM auth_tokens WHERE parent_id = ? AND kind = ?", [parentId, kind]);
  await run("INSERT INTO auth_tokens (token_hash, parent_id, kind, expires_at) VALUES (?, ?, ?, ?)", [sha(token), parentId, kind, Date.now() + ttlMs]);
  return token;
}

/** Uses a token once. Returns the parent id, or null if it is wrong, used or expired. */
export async function consumeAuthToken(token: string, kind: TokenKind): Promise<string | null> {
  if (!token || token.length > 200) return null;
  const hash = sha(token);
  const claimed = await run(
    "UPDATE auth_tokens SET used_at = ? WHERE token_hash = ? AND kind = ? AND used_at IS NULL AND expires_at > ?",
    [Date.now(), hash, kind, Date.now()],
  );
  if (!claimed) return null;
  const rows = await query<{ parent_id: string }>("SELECT parent_id FROM auth_tokens WHERE token_hash = ?", [hash]);
  return rows[0]?.parent_id ?? null;
}

/**
 * The public origin to put in emailed links. Uses NEXT_PUBLIC_SITE_URL when it is set, so a forged
 * Host header can never point a reset link at another site.
 */
export function appOrigin(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return configured || new URL(req.url).origin;
}

/**
 * The caller's address, for rate limits. Never the first X-Forwarded-For entry: a client can write
 * anything there. Vercel's own header is trusted when present; otherwise the entry added by the last
 * trusted proxy is used (TRUSTED_PROXY_HOPS, default 1, counted from the right).
 */
export function clientIp(req: Request): string {
  const vercel = req.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim();
  if (vercel) return vercel;
  const chain = (req.headers.get("x-forwarded-for") ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  const hops = Math.max(1, Number(process.env.TRUSTED_PROXY_HOPS) || 1);
  return chain[Math.max(0, chain.length - hops)] ?? req.headers.get("x-real-ip") ?? "local";
}

/** Timing-safe string comparison for shared secrets. */
export function secretsMatch(a: string, b: string): boolean {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}

/** A password check that takes the same time whether or not the account exists. */
const DUMMY_HASH = `scrypt$${"00".repeat(16)}$${"00".repeat(64)}`;
export async function burnPasswordCheck(password: string): Promise<void> {
  await verifyPassword(password, DUMMY_HASH);
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

/** A long-lived secret that lets an email's unsubscribe link work without signing in. */
export async function unsubscribeToken(parentId: string): Promise<string> {
  const rows = await query<{ unsub_token: string | null }>("SELECT unsub_token FROM parents WHERE id = ?", [parentId]);
  if (rows[0]?.unsub_token) return rows[0].unsub_token;
  const token = randomBytes(24).toString("base64url");
  await run("UPDATE parents SET unsub_token = ? WHERE id = ? AND unsub_token IS NULL", [token, parentId]);
  return (await query<{ unsub_token: string }>("SELECT unsub_token FROM parents WHERE id = ?", [parentId]))[0].unsub_token;
}
