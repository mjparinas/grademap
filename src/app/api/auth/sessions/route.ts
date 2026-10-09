import { error, getSession, json, listSessions, revokeSessions, sameOrigin } from "@/server/auth";

/** The devices signed in to this account. */
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  return json({ sessions: await listSessions(req, session.parentId) });
}

/** Signs out one device (?id=) or every device except this one. */
export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const id = new URL(req.url).searchParams.get("id") ?? undefined;
  return json({ removed: await revokeSessions(req, session.parentId, id) });
}
