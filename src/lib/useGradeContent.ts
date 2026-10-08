"use client";

import { useEffect, useSyncExternalStore } from "react";
import { AVAILABLE_GRADES, gradeLoadFailed, isGradeLoaded, loadGrade, loadGrades, subscribeToContent } from "@/content";
import type { GradeId } from "@/content/types";
import { cacheLoadedScripts } from "./offline";

export type GradeStatus = "ready" | "loading" | "failed";

function statusOf(grades: GradeId[]): GradeStatus {
  if (grades.every(isGradeLoaded)) return "ready";
  return grades.some(gradeLoadFailed) ? "failed" : "loading";
}

/**
 * Loads these grades' content (once) and reports when it's ready. A grade that
 * fails (usually offline before it was ever downloaded) reports "failed";
 * call `retry` to try again.
 */
export function useGradeContent(grades: GradeId[]): { status: GradeStatus; retry: () => void } {
  const key = [...new Set(grades)].sort().join(",");
  const status = useSyncExternalStore(
    subscribeToContent,
    () => statusOf(key ? (key.split(",") as GradeId[]) : []),
    () => "loading" as const,
  );
  const retry = () => void loadGrades(key ? (key.split(",") as GradeId[]) : []).catch(() => {});
  useEffect(() => {
    if (!key) return;
    void loadGrades(key.split(",") as GradeId[]).catch(() => {});
  }, [key]);
  return { status, retry };
}

/**
 * Downloads these grades and the grades either side of them in the background once
 * the app is idle, so switching players, moving a child up a grade or fixing a wrong
 * grade still works offline later.
 */
export function prefetchGrades(grades: GradeId[]) {
  const wanted = new Set<GradeId>();
  for (const g of grades) {
    const i = AVAILABLE_GRADES.indexOf(g);
    for (const j of [i - 1, i, i + 1]) if (AVAILABLE_GRADES[j]) wanted.add(AVAILABLE_GRADES[j]);
  }
  const run = () => {
    void Promise.allSettled([...wanted].map(loadGrade)).then(cacheLoadedScripts);
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 10_000 });
  else setTimeout(run, 3000);
}
