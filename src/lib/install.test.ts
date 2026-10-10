// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { INSTALL_SNOOZE_DAYS, isIos, isSnoozed, snooze } from "./install";

describe("install nudge helpers", () => {
  beforeEach(() => localStorage.clear());

  it("spots iPhones and iPads, including iPadOS posing as a Mac", () => {
    expect(isIos("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)", 5)).toBe(true);
    expect(isIos("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 5)).toBe(true);
    expect(isIos("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0)).toBe(false);
    expect(isIos("Mozilla/5.0 (Linux; Android 14; Pixel 7)", 5)).toBe(false);
  });

  it("stays quiet for 30 days after Not now", () => {
    const t = Date.UTC(2026, 0, 1);
    expect(isSnoozed(t)).toBe(false);
    snooze(t);
    expect(isSnoozed(t + 86_400_000)).toBe(true);
    expect(isSnoozed(t + INSTALL_SNOOZE_DAYS * 86_400_000 + 1)).toBe(false);
  });
});
