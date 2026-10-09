"use client";

import { useEffect } from "react";
import { createKonamiMatcher, stepForGesture, stepForKey, TAP_MAX } from "@/lib/konami";
import { useStore } from "@/lib/store";

/** Listens for the Konami code (arrow keys + B A, or eight swipes + two taps) and logs it as a secret. */
export function KonamiListener() {
  const log = useStore((s) => s.log);
  useEffect(() => {
    const feed = createKonamiMatcher();
    const found = () => log([{ type: "secret", code: "konami" }]);
    const onKey = (e: KeyboardEvent) => {
      const step = stepForKey(e.key);
      if (step && feed(step)) found();
    };
    let start: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") start = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = null;
      const swipe = stepForGesture(dx, dy);
      if (swipe) {
        if (feed(swipe)) found();
      } else if (Math.hypot(dx, dy) <= TAP_MAX) {
        // Two taps after the swipes stand in for B and A.
        if (feed("tap")) found();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [log]);
  return null;
}
