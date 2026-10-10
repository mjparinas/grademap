import { error, getSession, json, sameOrigin } from "@/server/auth";
import { listMembers, removeCoParent, revokeInvite } from "@/server/familyMembers";

/** The adults on this family, and invites still waiting. */
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const { members, invites } = await listMembers(session.familyId);
  return json({ members: members.map((m) => ({ ...m, you: m.id === session.parentId })), invites, owner: !session.coParent });
}

/** The owner removes a co-parent or cancels an invite; a co-parent can leave (remove themselves). */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const body = (await req.json().catch(() => null)) as { id?: unknown; inviteEmail?: unknown } | null;
  if (typeof body?.inviteEmail === "string") {
    if (session.coParent) return error(403, "Only the account owner can do this.");
    await revokeInvite(session.familyId, body.inviteEmail.trim().toLowerCase());
    return json({ ok: true });
  }
  const id = typeof body?.id === "string" ? body.id : "";
  if (session.coParent && id !== session.parentId) return error(403, "Only the account owner can do this.");
  if (!(await removeCoParent(session.familyId, id))) return error(404, "That person isn't on this family.");
  return json({ ok: true });
}
