"use client";

import { useEffect, useSyncExternalStore } from "react";
import { AVAILABLE_GRADES, gradeLoadFailed, isGradeLoaded, loadGrade, loadGrades, subscribeToContent, type ContentTarget } from "@/content";
import type { FrameworkId, GradeId } from "@/content/types";
import { cacheLoadedScripts } from "./offline";

export type GradeStatus = "ready" | "loading" | "failed";

const encode = (targets: ContentTarget[]) => [...new Set(targets.map((t) => `${t.framework}:${t.grade}`))].sort().join(",");
const decode = (key: string): ContentTarget[] =>
  key
    ? key.split(",").map((part) => {
        const [framework, grade] = part.split(":");
        return { framework: framework as FrameworkId, grade: grade as GradeId };
      })
    : [];

function statusOf(targets: ContentTarget[]): GradeStatus {
  if (targets.every((t) => isGradeLoaded(t.grade, t.framework))) return "ready";
  return targets.some((t) => gradeLoadFailed(t.grade, t.framework)) ? "failed" : "loading";
}

/**
 * Loads these grades' content (once) and reports when it's ready. A grade that
 * fails (usually offline before it was ever downloaded) reports "failed";
 * call `retry` to try again.
 */
export function useGradeContent(targets: ContentTarget[]): { status: GradeStatus; retry: () => void } {
  const key = encode(targets);
  const status = useSyncExternalStore(
    subscribeToContent,
    () => statusOf(decode(key)),
    () => "loading" as const,
  );
  const retry = () => void loadGrades(decode(key)).catch(() => {});
  useEffect(() => {
    if (!key) return;
    void loadGrades(decode(key)).catch(() => {});
  }, [key]);
  return { status, retry };
}

/**
 * Downloads these grades and the grades either side of them in the background once
 * the app is idle, so switching players, moving a child up a grade or fixing a wrong
 * grade still works offline later.
 */
export function prefetchGrades(targets: ContentTarget[]) {
  const wanted = new Map<string, ContentTarget>();
  for (const t of targets) {
    const i = AVAILABLE_GRADES.indexOf(t.grade);
    for (const j of [i - 1, i, i + 1]) {
      const grade = AVAILABLE_GRADES[j];
      if (grade) wanted.set(`${t.framework}:${grade}`, { grade, framework: t.framework });
    }
  }
  const run = () => {
    void Promise.allSettled([...wanted.values()].map((t) => loadGrade(t.grade, t.framework))).then(cacheLoadedScripts);
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 10_000 });
  else setTimeout(run, 3000);
}
