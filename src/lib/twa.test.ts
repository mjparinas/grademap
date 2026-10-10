// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { isAndroidApp } from "./twa";

describe("isAndroidApp", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState({}, "", "/parents/");
  });
  it("is false in an ordinary browser", () => {
    expect(isAndroidApp()).toBe(false);
  });
  it("is true for the app's start URL, and stays true on later pages", () => {
    window.history.replaceState({}, "", "/play/?app=android");
    expect(isAndroidApp()).toBe(true);
    window.history.replaceState({}, "", "/parents/");
    expect(isAndroidApp()).toBe(true);
  });
});
