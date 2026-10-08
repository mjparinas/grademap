"use client";

import { useSyncExternalStore } from "react";

// The current time, rounded to `stepMs`, without calling Date.now() during render.
export function useNow(stepMs = 60_000): number {
  return useSyncExternalStore(
    (onChange) => {
      const t = setInterval(onChange, Math.min(stepMs, 30_000));
      return () => clearInterval(t);
    },
    () => Math.floor(Date.now() / stepMs) * stepMs,
    () => 0,
  );
}
