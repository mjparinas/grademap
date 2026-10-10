"use client";

import { useState, type CSSProperties } from "react";
import { coursesForGrade, unitKey } from "@/content";
import { getSubjectMeta } from "@/content/subjects";
import type { SubjectId } from "@/content/types";
import { onColour } from "@/lib/contrast";
import { levelInfo, unitLevel } from "@/lib/proficiency";
import { go } from "@/lib/router";
import { useActiveProfile, useChildSettings, useDerived } from "@/lib/store";
import { useBand } from "../band";
import { Critter, CritterSvg, SpeechBubble } from "../Critter";
import { Dialog, Page, ProgressBar, subjectVars } from "../ui";
import { BackButton, LevelChip, UnitDialog } from "./Practice";
import { useAllowed } from "./useAllowed";

// The trail map: each subject is a winding path of lessons. Every lesson lights up as the child
// grows in it, and a marker shows where to go next. It only reads progress, so it adds no new
// data, no timers and nothing to lose.

/** Gentle left-right wiggle for node `i`, as a percentage of the trail's width. */
const wiggle = (i: number) => Math.round(Math.sin(i * 1.25) * 24);

export function TrailMap() {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const d = useDerived();
  const band = useBand();
  const allowed = useAllowed();
  const courses = coursesForGrade(profile.grade).filter((c) => (settings?.enabledSubjects ?? []).includes(c.subject));
  const [subject, setSubject] = useState<SubjectId | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const course = courses.find((c) => c.subject === subject) ?? courses[0];
  if (!course) {
    return (
      <Page className="gap-6">
        <header className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-3xl font-bold sm:text-4xl">Trail Map</h1>
        </header>
        <p className="font-read text-xl text-ink-soft">Ask a grown-up to turn on a subject to see your trail.</p>
      </Page>
    );
  }
  const meta = getSubjectMeta(course.subject);
  const levels = course.units.map((u) => unitLevel(d.units[unitKey(course.grade, course.subject, u.id)]));
  const grown = levels.filter((l) => l >= 2).length;
  const nextIndex = levels.findIndex((l) => l < 2);
  const finished = nextIndex === -1;
  const little = band === "little";

  const open = (key: string) => {
    const ref = { key, course, unit: course.units.find((u) => unitKey(course.grade, course.subject, u.id) === key)! };
    if (!allowed(ref)) return setLocked(true);
    if (little) go("/session", { mode: "practice", scope: key });
    else setSelected(key);
  };

  return (
    <Page style={subjectVars(meta)} className="gap-5">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-3xl font-bold sm:text-4xl">🧭 Trail Map</h1>
      </header>

      <div role="tablist" aria-label="Subjects" className="flex flex-wrap gap-2 narrow:flex-nowrap narrow:gap-1.5">
        {courses.map((c) => {
          const m = getSubjectMeta(c.subject);
          const on = c.subject === course.subject;
          return (
            <button
              key={c.subject}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setSubject(c.subject)}
              aria-label={m.title[band]}
              className={`btn h-14 gap-2 px-4 text-lg narrow:min-w-14 narrow:flex-1 narrow:px-2 ${on ? "" : "btn-soft"}`}
              style={on ? ({ "--btn-bg": m.colour, "--btn-edge": m.colourDark, "--btn-fg": onColour(m.colour) } as CSSProperties) : undefined}
            >
              <span aria-hidden="true" className="narrow:text-2xl">{m.emoji}</span> <span className="narrow:hidden">{m.title[band]}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Critter id={meta.mascot} mood={finished ? "cheer" : "happy"} size={84} className="short:hidden" />
        <SpeechBubble className="flex-1">
          <p className="font-read text-lg font-bold sm:text-xl">
            {finished ? "You've grown a tree in every lesson here. Amazing!" : `Next stop: “${course.units[nextIndex].title}”`}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar value={grown} max={course.units.length} className="flex-1" label={`${meta.title[band]} lessons grown to a tree`} />
            <span className="text-sm font-semibold whitespace-nowrap text-ink-soft">
              🌳 {grown}/{course.units.length}
            </span>
          </div>
        </SpeechBubble>
      </div>

      <ol className="relative mx-auto flex w-full max-w-md flex-col items-center gap-6 py-4">
        {/* The path itself, behind the stops. */}
        <span aria-hidden="true" className="absolute top-6 bottom-12 left-1/2 w-1.5 -translate-x-1/2 rounded-full border-l-4 border-dotted" style={{ borderColor: `${meta.colour}88` }} />
        {course.units.map((u, i) => {
          const key = unitKey(course.grade, course.subject, u.id);
          const level = levels[i];
          const info = levelInfo(profile.framework, profile.grade, level);
          const here = i === nextIndex;
          const ringColour = info?.colour ?? "#c9c6d6";
          return (
            <li key={u.id} className="relative z-10 flex flex-col items-center" style={{ transform: `translateX(${wiggle(i)}%)` }}>
              {here && (
                <span className="mb-1 flex items-center gap-1 rounded-full px-3 py-0.5 text-sm font-bold whitespace-nowrap" style={{ background: meta.colour, color: onColour(meta.colour) }}>
                  <span className="inline-block h-6 w-6 rounded-full bg-white p-0.5">
                    <CritterSvg id={profile.avatar} />
                  </span>
                  You are here
                </span>
              )}
              <button
                type="button"
                onClick={() => open(key)}
                aria-label={`${u.title}. ${info ? info.label : "Not started yet"}${here ? ". Next stop" : ""}`}
                className={`flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl shadow-[0_5px_0_rgba(0,0,0,0.12)] ${here ? "animate-pulse-soft" : ""}`}
                style={{ border: `5px ${info ? "solid" : "dashed"} ${ringColour}` }}
              >
                <span aria-hidden="true" className={info ? "" : "opacity-60 grayscale"}>
                  {u.emoji}
                </span>
              </button>
              <span className="mt-1 max-w-[9rem] text-center text-base leading-tight font-bold">{u.title}</span>
              <LevelChip level={level} compact />
            </li>
          );
        })}
        <li className="relative z-10 flex flex-col items-center gap-1 pt-2 text-center">
          <span aria-hidden="true" className={`text-6xl ${finished ? "animate-float" : "opacity-40 grayscale"}`}>
            🏁
          </span>
          <span className="font-read text-lg font-bold text-ink-soft">{finished ? "You finished this trail!" : "Finish line"}</span>
        </li>
      </ol>

      <UnitDialog unitKey={selected} onClose={() => setSelected(null)} onLocked={() => setLocked(true)} />
      <Dialog open={locked} title="Ask a grown-up" onClose={() => setLocked(false)}>
        <p className="mb-5 font-read text-lg text-ink-soft">This lesson opens with a family membership. A grown-up can turn it on in the grown-ups area.</p>
        <button type="button" className="btn btn-good min-h-14 w-full text-xl" onClick={() => setLocked(false)}>
          OK
        </button>
      </Dialog>
    </Page>
  );
}
