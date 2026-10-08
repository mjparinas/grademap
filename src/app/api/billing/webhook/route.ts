import { run } from "@/server/db";
import { verifyWebhook } from "@/server/stripe";

// Stripe tells us when a subscription starts, renews, changes or ends.
// Configure the endpoint in Stripe for: checkout.session.completed,
// customer.subscription.created, customer.subscription.updated, customer.subscription.deleted.

interface StripeEvent {
  type: string;
  data: { object: Record<string, unknown> };
}

export async function POST(req: Request) {
  const payload = await req.text();
  if (!verifyWebhook(payload, req.headers.get("stripe-signature"))) {
    return new Response("Bad signature", { status: 400 });
  }
  const event = JSON.parse(payload) as StripeEvent;
  const obj = event.data.object;
  const now = Date.now();

  if (event.type === "checkout.session.completed") {
    const familyId = (obj.client_reference_id as string) ?? (obj.metadata as Record<string, string>)?.family_id;
    if (familyId) {
      await run("UPDATE families SET stripe_customer = ?, subscription_status = 'active', plan = 'premium', updated_at = ? WHERE id = ?", [
        obj.customer as string,
        now,
        familyId,
      ]);
    }
  }

  if (event.type.startsWith("customer.subscription.")) {
    const status = event.type === "customer.subscription.deleted" ? "canceled" : (obj.status as string);
    const items = (obj.items as { data?: { current_period_end?: number; price?: { recurring?: { interval?: string } } }[] })?.data ?? [];
    const interval = items[0]?.price?.recurring?.interval ?? null;
    // Newer Stripe API versions report the period end per subscription item.
    const periodEnd = Number(obj.current_period_end ?? items[0]?.current_period_end ?? 0) * 1000 || null;
    const premium = ["active", "trialing", "past_due"].includes(status);
    const familyId = (obj.metadata as Record<string, string>)?.family_id;
    const args = [status, interval, periodEnd, premium ? "premium" : "free", now];
    if (familyId) {
      await run(
        "UPDATE families SET subscription_status = ?, subscription_interval = ?, current_period_end = ?, plan = ?, updated_at = ?, stripe_customer = COALESCE(stripe_customer, ?) WHERE id = ?",
        [...args, obj.customer as string, familyId],
      );
    } else {
      await run(
        "UPDATE families SET subscription_status = ?, subscription_interval = ?, current_period_end = ?, plan = ?, updated_at = ? WHERE stripe_customer = ?",
        [...args, obj.customer as string],
      );
    }
  }

  return new Response("ok");
}
