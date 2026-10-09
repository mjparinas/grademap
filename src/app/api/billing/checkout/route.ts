import { appOrigin, error, getSession, json, sameOrigin } from "@/server/auth";
import { getFamilyRow } from "@/server/family";
import { createCheckout, stripeConfigured } from "@/server/stripe";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Please sign in first.");
  if (!session.verified) return error(403, "Please confirm your email first. We sent a link when you signed up; you can ask for another under Account & sync.");
  if (!stripeConfigured()) return error(503, "Payments aren't set up yet.");
  const body = (await req.json().catch(() => ({}))) as { interval?: string };
  const interval = body.interval === "year" ? "year" : "month";
  const family = await getFamilyRow(session.familyId);
  const origin = appOrigin(req);
  try {
    const url = await createCheckout({ interval, familyId: session.familyId, email: session.email, customer: family?.stripe_customer, origin });
    return json({ url });
  } catch (e) {
    return error(502, (e as Error).message);
  }
}
