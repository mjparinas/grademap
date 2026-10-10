// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { INSTALL_SNOOZE_DAYS, KIDS_SNOOZE_DAYS, isIos, isMobile, isSnoozed, snooze, snoozeKids } from "./install";

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

  it("only counts phones and tablets as mobile", () => {
    expect(isMobile("Mozilla/5.0 (Linux; Android 14; Pixel 7) Mobile", 5)).toBe(true);
    expect(isMobile("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)", 5)).toBe(true);
    expect(isMobile("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 5)).toBe(true);
    expect(isMobile("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", 0)).toBe(false);
  });

  it("keeps the kids' snooze separate and shorter", () => {
    const t = Date.UTC(2026, 0, 1);
    snoozeKids(t);
    expect(isSnoozed(t, "grademap.install.dismissed")).toBe(false);
    expect(isSnoozed(t + 86_400_000, "grademap.install.kids.dismissed", KIDS_SNOOZE_DAYS)).toBe(true);
    expect(isSnoozed(t + 8 * 86_400_000, "grademap.install.kids.dismissed", KIDS_SNOOZE_DAYS)).toBe(false);
  });
});
