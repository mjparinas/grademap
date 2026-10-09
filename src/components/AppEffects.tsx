"use client";

import { useEffect } from "react";
import { replay, warmConfetti } from "@/lib/juice";
import { cacheLoadedScripts } from "@/lib/offline";
import { sounds } from "@/lib/sound";

/** Registers the offline service worker and makes every button juicy. */
export function AppEffects() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is a bonus; the site works without it.
    });
    // On a first visit, lessons load before the worker takes control; hand them over once it does.
    navigator.serviceWorker.addEventListener("controllerchange", cacheLoadedScripts);
    cacheLoadedScripts();
  }, []);

  // Public pages never celebrate, so only the apps warm the confetti library.
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/play") || path.startsWith("/parents")) warmConfetti();
  }, []);

  // Every .btn gets a little click sound on press and a jelly spring on release.
  useEffect(() => {
    const target = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.(".btn");
      return el instanceof HTMLButtonElement && el.disabled ? null : el;
    };
    const down = (e: PointerEvent) => {
      const el = target(e);
      if (el && !el.hasAttribute("data-quiet")) sounds.tap();
    };
    const up = (e: PointerEvent) => replay(target(e) ?? null, "jelly");
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
    };
  }, []);

  return null;
}
