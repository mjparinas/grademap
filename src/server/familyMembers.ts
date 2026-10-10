import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { query, run } from "./db";

// Other adults in a family: the owner (role 'parent') invites up to two (role 'coparent') by email.

export const MAX_CO_PARENTS = 2;
const INVITE_DAYS = 7;
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export interface Member {
  id: string;
  email: string;
  role: "owner" | "coparent";
}

export async function listMembers(familyId: string): Promise<{ members: Member[]; invites: { email: string }[] }> {
  const rows = await query<{ id: string; email: string; role: string }>("SELECT id, email, role FROM parents WHERE family_id = ? AND role != 'student' ORDER BY created_at", [familyId]);
  const invites = await query<{ email: string }>("SELECT email FROM family_invites WHERE family_id = ? AND used_at IS NULL AND expires_at > ? ORDER BY created_at", [familyId, Date.now()]);
  return { members: rows.map((r) => ({ id: r.id, email: r.email, role: r.role === "coparent" ? "coparent" : "owner" })), invites };
}

/** Makes an invite link for an email, replacing any open invite for that address. Returns null when the family is full. */
export async function createInvite(familyId: string, invitedBy: string, email: string): Promise<string | null> {
  const { members, invites } = await listMembers(familyId);
  const others = invites.filter((i) => i.email !== email).length;
  if (members.filter((m) => m.role === "coparent").length + others >= MAX_CO_PARENTS) return null;
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  await run("DELETE FROM family_invites WHERE family_id = ? AND email = ? AND used_at IS NULL", [familyId, email]);
  await run("INSERT INTO family_invites (token_hash, family_id, email, invited_by, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)", [sha(token), familyId, email, invitedBy, now, now + INVITE_DAYS * 86_400_000]);
  return token;
}

/** Uses an invite once. Returns the family and address it was for, or null if it is wrong, used or expired. */
export async function consumeInvite(token: string): Promise<{ familyId: string; email: string } | null> {
  if (!token || token.length > 200) return null;
  const hash = sha(token);
  const now = Date.now();
  const claimed = await run("UPDATE family_invites SET used_at = ? WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?", [now, hash, now]);
  if (!claimed) return null;
  const row = (await query<{ family_id: string; email: string }>("SELECT family_id, email FROM family_invites WHERE token_hash = ?", [hash]))[0];
  return row ? { familyId: row.family_id, email: row.email } : null;
}

export async function revokeInvite(familyId: string, email: string): Promise<void> {
  await run("DELETE FROM family_invites WHERE family_id = ? AND email = ? AND used_at IS NULL", [familyId, email]);
}

/** Removes a co-parent's login. Their children's data stays: it belongs to the family. */
export async function removeCoParent(familyId: string, parentId: string): Promise<boolean> {
  const row = (await query<{ id: string }>("SELECT id FROM parents WHERE id = ? AND family_id = ? AND role = 'coparent'", [parentId, familyId]))[0];
  if (!row) return false;
  await run("DELETE FROM sessions WHERE parent_id = ?", [parentId]);
  await run("DELETE FROM auth_tokens WHERE parent_id = ?", [parentId]);
  await run("DELETE FROM parents WHERE id = ?", [parentId]);
  return true;
}
