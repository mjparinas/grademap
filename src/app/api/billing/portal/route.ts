import { appOrigin, error, getSession, json, sameOrigin } from "@/server/auth";
import { getFamilyRow } from "@/server/family";
import { createPortal, stripeConfigured } from "@/server/stripe";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return error(403, "Bad origin");
  const session = await getSession(req);
  if (!session) return error(401, "Please sign in first.");
  if (session.coParent) return error(403, "Only the account owner can do this.");
  if (!stripeConfigured()) return error(503, "Payments aren't set up yet.");
  const family = await getFamilyRow(session.familyId);
  if (!family?.stripe_customer) return error(400, "No subscription to manage yet.");
  try {
    return json({ url: await createPortal(family.stripe_customer, appOrigin(req)) });
  } catch (e) {
    return error(502, (e as Error).message);
  }
}
