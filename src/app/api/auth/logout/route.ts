import { clearCookie, endSession, json, sameOrigin, error } from "@/server/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  await endSession(req);
  return json({ ok: true }, { cookie: clearCookie() });
}
