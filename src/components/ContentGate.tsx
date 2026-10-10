"use client";

import { useEffect, type ReactNode } from "react";
import { GRADE_LABEL } from "@/content/subjects";
import type { ContentTarget } from "@/content";
import { cacheLoadedScripts } from "@/lib/offline";
import { useGradeContent } from "@/lib/useGradeContent";
import { Critter } from "./Critter";
import { LoadingScreen } from "./ui";

/**
 * Renders its children once these grades' lessons have downloaded. If a download
 * fails (offline before that grade was ever loaded), kids get a friendly screen;
 * with `optional`, the children render anyway under a notice (the parent area).
 */
export function ContentGate({
  targets,
  children,
  optional = false,
  onSwitch,
}: {
  targets: ContentTarget[];
  children: ReactNode;
  optional?: boolean;
  /** Offered on the offline screen, e.g. to pick another player. */
  onSwitch?: () => void;
}) {
  const { status, retry } = useGradeContent(targets);

  useEffect(() => {
    if (status === "ready") cacheLoadedScripts();
  }, [status]);

  if (status === "ready") return children;
  if (status === "loading") return <LoadingScreen />;

  const names = [...new Set(targets.map((t) => t.grade))].map((g) => GRADE_LABEL[g]).join(" and ");
  if (optional) {
    return (
      <>
        <div role="status" className="bg-nudge-soft px-4 py-2 text-center text-sm font-semibold text-nudge-dark">
          {names} lessons haven&apos;t downloaded to this device yet, so some reports are incomplete. Connect to the internet once to fix this.{" "}
          <button type="button" className="underline" onClick={retry}>
            Try again
          </button>
        </div>
        {children}
      </>
    );
  }
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <Critter id="ollie" mood="think" size={140} />
      <h1 className="text-3xl font-bold">We need the internet for a moment</h1>
      <p className="max-w-md font-read text-xl text-ink-soft">
        Ask a grown-up to connect to the internet once, so we can download the {names} lessons. After that they work offline.
      </p>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <button type="button" className="btn btn-good min-h-16 text-2xl" onClick={retry}>
          Try again
        </button>
        {onSwitch && (
          <button type="button" className="btn min-h-14 text-xl" onClick={onSwitch}>
            Choose another player
          </button>
        )}
      </div>
    </main>
  );
}
