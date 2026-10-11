import { describe, expect, it } from "vitest";
import { canUse, FREE_UNITS_PER_COURSE, isPremium, PRICES, trialDaysLeft, unitOpen } from "./plan";
import type { FamilyInfo } from "./model";

const family = (overrides: Partial<FamilyInfo> = {}) => ({
  plan: "free",
  trialEndsAt: 0,
  ...overrides,
}) as FamilyInfo;

describe("family plan access", () => {
  it("recognizes premium plans and active subscriptions", () => {
    for (const plan of [family({ plan: "premium" }), family({ subscription: { status: "active" } as never }), family({ subscription: { status: "trialing" } as never }), family({ subscription: { status: "past_due" } as never })]) {
      expect(isPremium(plan, 1_000)).toBe(true);
      expect(canUse(plan, "arcade", 1_000)).toBe(true);
      expect(unitOpen(plan, 10, 1_000)).toBe(true);
    }
  });

  it("keeps access during trial and rounds remaining days up", () => {
    const trial = family({ trialEndsAt: 86_400_000 + 2 });
    expect(isPremium(trial, 1)).toBe(true);
    expect(trialDaysLeft(trial, 1)).toBe(2);
    expect(unitOpen(trial, 10, 1)).toBe(true);
  });

  it("limits expired free plans to the first units in each course", () => {
    const expired = family({ trialEndsAt: 100 });
    expect(isPremium(expired, 100)).toBe(false);
    expect(trialDaysLeft(expired, 100)).toBe(0);
    expect(canUse(expired, "fullReports", 100)).toBe(false);
    expect([0, 1, 2, FREE_UNITS_PER_COURSE].map((index) => unitOpen(expired, index, 100))).toEqual([true, true, false, false]);
  });

  it("charges C$14.99 a month or C$119.99 a year, saving 33%", () => {
    expect(PRICES).toEqual({
      month: { amount: 14.99, currency: "CAD", label: "$14.99/month" },
      year: { amount: 119.99, currency: "CAD", label: "$119.99/year", note: "Save 33%" },
    });
    expect(Math.round((1 - PRICES.year.amount / (PRICES.month.amount * 12)) * 100)).toBe(33);
  });
});
