import { error, getSession, json, sameOrigin } from "@/server/auth";
import { run } from "@/server/db";
import { getFamilyRow, toFamilyInfo } from "@/server/family";
import { devBillingAllowed } from "@/server/stripe";

/** Development only: pretend to subscribe or cancel, so the flow can be tested without Stripe. */
export async function POST(req: Request) {
  if (!devBillingAllowed()) return error(404, "Not found");
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Please sign in first.");
  if (session.coParent) return error(403, "Only the account owner can do this.");
  const body = (await req.json().catch(() => ({}))) as { action?: string; interval?: string };
  const now = Date.now();
  if (body.action === "cancel") {
    await run("UPDATE families SET subscription_status = 'canceled', plan = 'free', updated_at = ? WHERE id = ?", [now, session.familyId]);
  } else {
    const interval = body.interval === "year" ? "year" : "month";
    const end = now + (interval === "year" ? 365 : 30) * 86_400_000;
    await run(
      "UPDATE families SET subscription_status = 'active', subscription_interval = ?, current_period_end = ?, plan = 'premium', updated_at = ? WHERE id = ?",
      [interval, end, now, session.familyId],
    );
  }
  const row = await getFamilyRow(session.familyId);
  return json({ family: toFamilyInfo(row!, session.email, session.verified, false, session.coParent) });
}
