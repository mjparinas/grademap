import { query, run } from "@/server/db";
import { verifyWebhook } from "@/server/stripe";

// Stripe tells us when a subscription starts, renews, changes or ends.
// Configure the endpoint in Stripe for: checkout.session.completed,
// customer.subscription.created, customer.subscription.updated, customer.subscription.deleted.

interface StripeEvent {
  id?: string;
  created?: number;
  type: string;
  data: { object: Record<string, unknown> };
}

export async function POST(req: Request) {
  const payload = await req.text();
  if (!verifyWebhook(payload, req.headers.get("stripe-signature"))) {
    return new Response("Bad signature", { status: 400 });
  }
  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return new Response("Bad payload", { status: 400 });
  }
  const obj = event.data?.object;
  if (!event.id || !obj) return new Response("ok");
  const now = Date.now();
  // Stripe redelivers events: handle each id once.
  if ((await run("INSERT OR IGNORE INTO stripe_events (id, created_at) VALUES (?, ?)", [event.id, now])) === 0) return new Response("ok");
  try {
    await apply(event, obj, now);
  } catch (e) {
    await run("DELETE FROM stripe_events WHERE id = ?", [event.id]); // let Stripe retry
    throw e;
  }
  return new Response("ok");
}

/** Events can arrive out of order. An older one never overwrites what a newer one already set. */
async function isStale(event: StripeEvent, familyId: string | undefined, customer: string | undefined): Promise<boolean> {
  const at = (event.created ?? 0) * 1000;
  const rows = familyId
    ? await query<{ billing_event_at: number }>("SELECT billing_event_at FROM families WHERE id = ?", [familyId])
    : await query<{ billing_event_at: number }>("SELECT billing_event_at FROM families WHERE stripe_customer = ?", [customer ?? ""]);
  return !!rows[0] && at < Number(rows[0].billing_event_at);
}

async function apply(event: StripeEvent, obj: Record<string, unknown>, now: number) {
  const at = (event.created ?? 0) * 1000;

  if (event.type === "checkout.session.completed") {
    const familyId = (obj.client_reference_id as string) ?? (obj.metadata as Record<string, string>)?.family_id;
    // Only a paid checkout grants premium; a delayed payment method sends a later event when it clears.
    const paid = obj.payment_status === "paid" || obj.payment_status === "no_payment_required";
    if (familyId && paid && !(await isStale(event, familyId, undefined))) {
      await run("UPDATE families SET stripe_customer = ?, subscription_status = 'active', plan = 'premium', updated_at = ?, billing_event_at = ? WHERE id = ?", [
        obj.customer as string,
        now,
        at,
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
    if (await isStale(event, familyId, obj.customer as string)) return;
    const args = [status, interval, periodEnd, premium ? "premium" : "free", now, at];
    if (familyId) {
      await run(
        "UPDATE families SET subscription_status = ?, subscription_interval = ?, current_period_end = ?, plan = ?, updated_at = ?, billing_event_at = ?, stripe_customer = COALESCE(stripe_customer, ?) WHERE id = ?",
        [...args, obj.customer as string, familyId],
      );
    } else {
      await run(
        "UPDATE families SET subscription_status = ?, subscription_interval = ?, current_period_end = ?, plan = ?, updated_at = ?, billing_event_at = ? WHERE stripe_customer = ?",
        [...args, obj.customer as string],
      );
    }
  }
}
