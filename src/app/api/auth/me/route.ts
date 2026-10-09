import { error, getSession, json } from "@/server/auth";
import { getFamilyRow, toFamilyInfo } from "@/server/family";
import { devBillingAllowed, stripeConfigured } from "@/server/stripe";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return error(401, "Not signed in");
  const row = await getFamilyRow(session.familyId);
  if (!row) return error(401, "Not signed in");
  return json({ family: toFamilyInfo(row, session.email, session.verified), billing: { stripe: stripeConfigured(), dev: devBillingAllowed() } });
}
