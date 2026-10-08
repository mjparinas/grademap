"use client";

/**
 * Asks the service worker to keep every build file this page has loaded, including
 * grade content downloaded on demand before the worker took control of the page
 * (the very first visit). Safe to call often; the worker skips files it already has.
 */
export function cacheLoadedScripts() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !navigator.serviceWorker.controller) return;
  const urls = performance
    .getEntriesByType("resource")
    .map((e) => e.name)
    .filter((u) => u.startsWith(`${location.origin}/_next/static/`));
  if (urls.length) navigator.serviceWorker.controller.postMessage({ type: "cache-urls", urls });
}
