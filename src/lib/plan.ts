import type { FamilyInfo } from "./model";

// Subscription plans and what each one unlocks. Tune these numbers freely:
// the whole app reads them from here.

export const TRIAL_DAYS = 30;
export const FREE_UNITS_PER_COURSE = 2;
export const MAX_CHILDREN = 4;

export const PRICES = {
  month: { amount: 14.99, currency: "CAD", label: "$14.99/month" },
  year: { amount: 119.99, currency: "CAD", label: "$119.99/year", note: "Save 33%" },
};

export type Feature = "allUnits" | "adventure" | "review" | "speed" | "challenge" | "arcade" | "fullReports";

const ACTIVE = new Set(["active", "trialing", "past_due"]);

export function isPremium(family: FamilyInfo, now = Date.now()): boolean {
  if (family.plan === "premium") return true;
  if (family.subscription && ACTIVE.has(family.subscription.status)) return true;
  return now < family.trialEndsAt;
}

export function trialDaysLeft(family: FamilyInfo, now = Date.now()): number {
  return Math.max(0, Math.ceil((family.trialEndsAt - now) / 86_400_000));
}

export function canUse(family: FamilyInfo, _feature: Feature, now = Date.now()): boolean {
  // Every premium feature is currently on the same plan.
  return isPremium(family, now);
}

/** On the free plan, the first few units of each course stay open. */
export function unitOpen(family: FamilyInfo, unitIndex: number, now = Date.now()): boolean {
  return isPremium(family, now) || unitIndex < FREE_UNITS_PER_COURSE;
}
