"use client";

import { useMemo } from "react";
import { getUnitRef, type UnitRef } from "@/content";
import { useActiveProfile, useStore } from "@/lib/store";

export interface Assigned {
  ref: UnitRef;
  className: string;
}

/**
 * Units the active child's teacher assigned, in the teacher's order. Comes from the last sync, so it
 * works offline. Units from a grade that hasn't loaded are skipped rather than guessed at.
 */
export function useClasswork(): Assigned[] {
  const profile = useActiveProfile();
  const classwork = useStore((s) => s.classwork);
  return useMemo(() => {
    const seen = new Set<string>();
    const out: Assigned[] = [];
    for (const c of classwork) {
      if (c.profileId !== profile?.id) continue;
      for (const key of c.unitKeys) {
        const ref = getUnitRef(key);
        if (!ref || seen.has(key)) continue;
        seen.add(key);
        out.push({ ref, className: c.className });
      }
    }
    return out;
  }, [classwork, profile?.id]);
}
