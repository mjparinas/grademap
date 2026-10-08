"use client";

import { useCallback } from "react";
import type { UnitRef } from "@/content";
import { unitOpen } from "@/lib/plan";
import { useStore } from "@/lib/store";

/** Which units the family's plan opens (all of them on premium or during the trial). */
export function useAllowed(): (ref: UnitRef) => boolean {
  const family = useStore((s) => s.family);
  return useCallback((ref: UnitRef) => unitOpen(family, ref.course.units.indexOf(ref.unit)), [family]);
}
