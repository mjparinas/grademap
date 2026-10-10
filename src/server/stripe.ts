import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Stripe over plain HTTPS: no SDK needed. Set these environment variables:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
//   STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY (recurring Price ids)

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_MONTHLY && process.env.STRIPE_PRICE_YEARLY);
}

/** Cancellation only needs the secret key; price ids are needed to start billing. */
export function stripeCancellationConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Lets you click through the subscription flow without Stripe while developing. */
export function devBillingAllowed(): boolean {
  // Never on the real production deployment, even with the flag: it grants premium without payment.
  if (process.env.VERCEL_ENV === "production") return false;
  return !stripeConfigured() && (process.env.NODE_ENV !== "production" || process.env.ALLOW_DEV_BILLING === "1");
}

function form(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

async function stripe<T>(path: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: form(params),
  });
  const data = (await res.json()) as T & { error?: { message: string } };
  if (!res.ok) throw new Error(data.error?.message ?? `Stripe error ${res.status}`);
  return data;
}

/** Ends every live subscription for a customer, immediately. Throws if Stripe refuses. */
export async function cancelSubscriptions(customer: string): Promise<number> {
  const headers = { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` };
  let cancelled = 0;
  let startingAfter: string | undefined;
  while (true) {
    const params = new URLSearchParams({ customer, status: "all", limit: "100" });
    if (startingAfter) params.set("starting_after", startingAfter);
    const res = await fetch(`https://api.stripe.com/v1/subscriptions?${params}`, { headers });
    const data = (await res.json()) as { data?: { id: string; status: string }[]; has_more?: boolean; error?: { message: string } };
    if (!res.ok) throw new Error(data.error?.message ?? `Stripe error ${res.status}`);
    const subscriptions = data.data ?? [];
    for (const sub of subscriptions) {
      if (sub.status === "canceled" || sub.status === "incomplete_expired") continue;
      const del = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(sub.id)}`, { method: "DELETE", headers });
      if (!del.ok) throw new Error(((await del.json()) as { error?: { message: string } }).error?.message ?? `Stripe error ${del.status}`);
      cancelled++;
    }
    if (!data.has_more || subscriptions.length === 0) break;
    startingAfter = subscriptions[subscriptions.length - 1].id;
  }
  return cancelled;
}

export async function createCheckout(opts: {
  interval: "month" | "year";
  familyId: string;
  email: string;
  customer?: string | null;
  origin: string;
}): Promise<string> {
  const price = opts.interval === "year" ? process.env.STRIPE_PRICE_YEARLY! : process.env.STRIPE_PRICE_MONTHLY!;
  const params: Record<string, string> = {
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    client_reference_id: opts.familyId,
    "subscription_data[metadata][family_id]": opts.familyId,
    "metadata[family_id]": opts.familyId,
    allow_promotion_codes: "true",
    success_url: `${opts.origin}/parents/#/subscription?checkout=success`,
    cancel_url: `${opts.origin}/parents/#/subscription?checkout=cancelled`,
  };
  if (opts.customer) params.customer = opts.customer;
  else params.customer_email = opts.email;
  const session = await stripe<{ url: string }>("checkout/sessions", params);
  return session.url;
}

export async function createPortal(customer: string, origin: string): Promise<string> {
  const session = await stripe<{ url: string }>("billing_portal/sessions", {
    customer,
    return_url: `${origin}/parents/#/subscription`,
  });
  return session.url;
}

/** Verifies the Stripe-Signature header (v1 scheme, 5-minute tolerance). */
export function verifyWebhook(payload: string, header: string | null, secret = process.env.STRIPE_WEBHOOK_SECRET): boolean {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  const signatures = header
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  return signatures.some((sig) => sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
}
