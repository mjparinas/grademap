"use client";

import type { FamilyInfo } from "./model";
import { useStore } from "./store";
import { syncNow } from "./sync";

// Parent account actions. All of these need a connection; the kids' side
// keeps working offline regardless.

async function post<T>(url: string, body?: unknown, method = "POST"): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("You're offline. Connect to the internet and try again.");
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Something went wrong (${res.status}).`);
  return data;
}

function adopt(family: FamilyInfo) {
  useStore.getState().setFamily(family, true);
  useStore.getState().setSync({ status: "idle" });
}

export async function signUp(email: string, password: string) {
  const { family } = await post<{ family: FamilyInfo }>("/api/auth/signup/", {
    email,
    password,
    trialEndsAt: useStore.getState().family.trialEndsAt,
  });
  adopt(family);
  await syncNow();
}

export async function signIn(email: string, password: string) {
  const { family } = await post<{ family: FamilyInfo }>("/api/auth/login/", { email, password });
  // A fresh sign-in downloads the whole family history.
  useStore.getState().setSync({ cursor: 0 });
  adopt(family);
  await syncNow();
}

export async function forgotPassword(email: string): Promise<string> {
  const { message } = await post<{ message: string }>("/api/auth/forgot/", { email });
  return message;
}

export async function resendVerification() {
  await post("/api/auth/resend-verification/");
}

export async function signOut() {
  await syncNow().catch(() => {});
  await post("/api/auth/logout/").catch(() => {});
  useStore.getState().setFamily({ account: undefined }, true);
  useStore.getState().setSync({ status: "signed-out" });
}

export interface BillingInfo {
  stripe: boolean;
  dev: boolean;
}

export async function refreshAccount(): Promise<BillingInfo | null> {
  try {
    const res = await fetch("/api/auth/me/", { credentials: "same-origin" });
    if (res.status === 401) {
      if (useStore.getState().family.account) useStore.getState().setFamily({ account: undefined }, true);
      return null;
    }
    if (!res.ok) return null;
    const data = (await res.json()) as { family: FamilyInfo; billing: BillingInfo };
    adopt(data.family);
    return data.billing;
  } catch {
    return null;
  }
}

export async function startCheckout(interval: "month" | "year") {
  const { url } = await post<{ url: string }>("/api/billing/checkout/", { interval });
  window.location.href = url;
}

export async function openBillingPortal() {
  const { url } = await post<{ url: string }>("/api/billing/portal/");
  window.location.href = url;
}

export async function devBilling(action: "subscribe" | "cancel", interval: "month" | "year" = "month") {
  const { family } = await post<{ family: FamilyInfo }>("/api/billing/dev/", { action, interval });
  adopt(family);
}

export async function deleteAccount() {
  await post("/api/account/", undefined, "DELETE");
  await useStore.getState().wipeDevice();
}
