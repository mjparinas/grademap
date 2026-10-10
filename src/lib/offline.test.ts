// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cacheLoadedScripts } from "./offline";

describe("cacheLoadedScripts", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: undefined });
  });

  it("does nothing until a controlling service worker exists", () => {
    Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: { controller: null } });
    expect(() => cacheLoadedScripts()).not.toThrow();
  });

  it("sends only loaded Next.js build resources to the service worker", () => {
    const postMessage = vi.fn();
    Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: { controller: { postMessage } } });
    vi.spyOn(performance, "getEntriesByType").mockReturnValue([
      { name: `${location.origin}/_next/static/chunks/app.js` } as PerformanceResourceTiming,
      { name: `${location.origin}/api/sync/` } as PerformanceResourceTiming,
      { name: "https://cdn.example/image.png" } as PerformanceResourceTiming,
    ]);

    cacheLoadedScripts();

    expect(postMessage).toHaveBeenCalledWith({
      type: "cache-urls",
      urls: [`${location.origin}/_next/static/chunks/app.js`],
    });
  });
});
