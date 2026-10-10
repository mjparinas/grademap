import "server-only";
import { createPrivateKey, createSign } from "node:crypto";
import { CONTACT_EMAIL } from "@/lib/brand";
import { query, run } from "./db";

// Web Push over plain HTTPS, with no SDK (like Stripe). Messages carry no payload: the browser wakes our
// service worker, which shows fixed text. So nothing about a child ever passes through a push service.
// Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY (see docs/DEPLOY.md) to turn this on.

export function pushConfigured(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

export const vapidPublicKey = () => process.env.VAPID_PUBLIC_KEY ?? "";

/** Only the push services browsers use, so a stored address can never point the server at anything else. */
const PUSH_HOSTS = [/(^|\.)googleapis\.com$/, /(^|\.)push\.services\.mozilla\.com$/, /(^|\.)push\.apple\.com$/, /(^|\.)notify\.windows\.com$/];

export function validEndpoint(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== "string" || endpoint.length > 600) return false;
  try {
    const u = new URL(endpoint);
    return u.protocol === "https:" && !u.port && !u.username && PUSH_HOSTS.some((re) => re.test(u.hostname));
  } catch {
    return false;
  }
}

const b64 = (b: Buffer | string) => Buffer.from(b).toString("base64url");

/** A VAPID token (RFC 8292): a short-lived ES256 JWT naming the push service as audience. */
export function vapidAuthorization(endpoint: string, now = Date.now()): string {
  const pub = Buffer.from(process.env.VAPID_PUBLIC_KEY!, "base64url");
  const jwk = { kty: "EC", crv: "P-256", x: b64(pub.subarray(1, 33)), y: b64(pub.subarray(33, 65)), d: process.env.VAPID_PRIVATE_KEY! };
  const key = createPrivateKey({ key: jwk, format: "jwk" });
  const header = b64(JSON.stringify({ typ: "JWT", alg: "ES256" }));
  const claims = b64(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(now / 1000) + 12 * 3600, sub: `mailto:${CONTACT_EMAIL}` }));
  const signature = createSign("SHA256").update(`${header}.${claims}`).sign({ key, dsaEncoding: "ieee-p1363" });
  return `vapid t=${header}.${claims}.${b64(signature)}, k=${process.env.VAPID_PUBLIC_KEY}`;
}

/** Wakes one browser. Returns false when the subscription is gone and should be forgotten. */
export async function sendPush(endpoint: string): Promise<boolean> {
  try {
    const res = await fetch(endpoint, { method: "POST", headers: { authorization: vapidAuthorization(endpoint), ttl: String(2 * 86_400), urgency: "low", "content-length": "0" } });
    return res.status !== 404 && res.status !== 410;
  } catch {
    return true; // a network blip is not a reason to forget it
  }
}

export async function saveSubscription(parentId: string, endpoint: string, id: string): Promise<void> {
  await run("DELETE FROM push_subscriptions WHERE endpoint = ?", [endpoint]);
  await run("INSERT INTO push_subscriptions (id, parent_id, endpoint, created_at) VALUES (?, ?, ?, ?)", [id, parentId, endpoint, Date.now()]);
}

/** Wakes every browser a parent allowed, and forgets the ones that no longer exist. Returns how many were sent. */
export async function pushToParent(parentId: string): Promise<number> {
  const subs = await query<{ id: string; endpoint: string }>("SELECT id, endpoint FROM push_subscriptions WHERE parent_id = ?", [parentId]);
  let sent = 0;
  for (const s of subs) {
    if (await sendPush(s.endpoint)) sent++;
    else await run("DELETE FROM push_subscriptions WHERE id = ?", [s.id]);
  }
  return sent;
}
