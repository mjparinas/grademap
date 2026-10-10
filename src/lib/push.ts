"use client";

// Browser side of weekly-report notifications for grown-ups. Everything here needs a connection
// and a service worker (production builds only); callers show it only when `pushSupported()`.

export function pushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

const toKey = (b64: string): Uint8Array<ArrayBuffer> => {
  const raw = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
};

async function currentSubscription(): Promise<PushSubscription | null> {
  const reg = await navigator.serviceWorker.getRegistration();
  return (await reg?.pushManager.getSubscription()) ?? null;
}

export interface PushState {
  /** The server has notification keys set. */
  available: boolean;
  /** This browser is subscribed. */
  on: boolean;
  /** The browser blocked notifications for this site. */
  blocked: boolean;
}

export async function pushState(): Promise<PushState> {
  const sub = await currentSubscription();
  const res = await fetch(`/api/push/${sub ? `?endpoint=${encodeURIComponent(sub.endpoint)}` : ""}`, { credentials: "same-origin" });
  if (!res.ok) return { available: false, on: false, blocked: false };
  const data = (await res.json()) as { configured: boolean; subscribed: boolean };
  return { available: data.configured, on: Boolean(sub) && data.subscribed, blocked: Notification.permission === "denied" };
}

export async function enablePush(): Promise<void> {
  const keyRes = await fetch("/api/push/", { credentials: "same-origin" });
  const { publicKey } = (await keyRes.json()) as { publicKey: string };
  if (!publicKey) throw new Error("Notifications aren't set up yet.");
  if ((await Notification.requestPermission()) !== "granted") throw new Error("Notifications are blocked for this site. Allow them in your browser settings, then try again.");
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(publicKey) }));
  const res = await fetch("/api/push/", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ endpoint: sub.endpoint }),
  });
  if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Couldn't turn notifications on.");
}

export async function disablePush(): Promise<void> {
  const sub = await currentSubscription();
  if (!sub) return;
  await fetch("/api/push/", {
    method: "DELETE",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ endpoint: sub.endpoint }),
  });
  await sub.unsubscribe();
}
