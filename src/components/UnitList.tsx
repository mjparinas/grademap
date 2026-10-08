"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSubject, unitKey } from "@/lib/curriculum";
import { useActiveProfile, useActiveProgress, useHydrated } from "@/lib/store";
import { Mascot, SpeechBubble } from "./Mascot";
import { BackLink, LoadingScreen, Page, ProgressBar, Stars, subjectVars } from "./ui";

export function UnitList({ subjectId }: { subjectId: string }) {
  const hydrated = useHydrated();
  const profile = useActiveProfile();
  const progress = useActiveProgress();
  const router = useRouter();
  const subject = getSubject(subjectId);

  useEffect(() => {
    if (hydrated && !profile) router.replace("/");
  }, [hydrated, profile, router]);

  if (!subject) return null;
  if (!hydrated || !profile) return <LoadingScreen />;

  const doneCount = subject.units.filter((u) => progress[unitKey(subject.id, u.id)]).length;
  const nextUp = subject.units.find((u) => !progress[unitKey(subject.id, u.id)]);

  return (
    <Page style={subjectVars(subject)} className="gap-6">
      <header className="flex items-center gap-4">
        <BackLink href="/" label="Back to subjects" />
        <span className="text-5xl">{subject.emoji}</span>
        <div className="flex-1">
          <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: subject.colourDark }}>
            {subject.title}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <ProgressBar value={doneCount} max={subject.units.length} className="max-w-xs flex-1" />
            <span className="text-lg font-semibold text-ink-soft">
              {doneCount}/{subject.units.length}
            </span>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-3">
        <Mascot mood={doneCount === subject.units.length ? "cheer" : "happy"} size={92} />
        <SpeechBubble className="flex-1">
          <p className="font-read text-xl font-bold sm:text-2xl">
            {doneCount === subject.units.length
              ? `Wow, you finished every ${subject.title} lesson! Play any one again to earn more stars.`
              : nextUp
                ? `Pick a lesson! I think “${nextUp.title}” would be fun.`
                : "Pick a lesson!"}
          </p>
        </SpeechBubble>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {subject.units.map((u, i) => {
          const p = progress[unitKey(subject.id, u.id)];
          const isNext = u.id === nextUp?.id;
          return (
            <div key={u.id} className="animate-rise-in" style={{ animationDelay: `${i * 60}ms` }}>
              <Link
                href={`/learn/${subject.id}/${u.id}/`}
                className={`btn relative h-full w-full flex-col gap-1 px-3 pt-6 pb-4 text-center ${p ? "btn-soft" : ""} ${
                  isNext ? "animate-pulse-soft" : ""
                }`}
                style={isNext ? { borderColor: subject.colour, boxShadow: `0 6px 0 ${subject.colourDark}` } : undefined}
              >
                {isNext && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-sm font-bold whitespace-nowrap text-white"
                    style={{ background: subject.colour }}
                  >
                    Up next!
                  </span>
                )}
                <span className="absolute top-2 left-3 text-sm font-bold opacity-50">{i + 1}</span>
                <span className="text-6xl leading-tight">{u.emoji}</span>
                <span className="text-xl leading-tight font-bold sm:text-2xl">{u.title}</span>
                <span className="font-read text-base leading-snug text-ink-soft">{u.blurb}</span>
                <span className="mt-1">
                  <Stars count={p?.stars ?? 0} size={26} />
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </Page>
  );
}
