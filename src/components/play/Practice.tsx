"use client";

import { onColour } from "@/lib/contrast";
import { useState, type CSSProperties } from "react";
import { coursesForGrade, unitKey } from "@/content";
import { getSubjectMeta } from "@/content/subjects";
import type { SubjectId } from "@/content/types";
import { canUse } from "@/lib/plan";
import { levelInfo, nextStep, unitLevel } from "@/lib/proficiency";
import { go, href } from "@/lib/router";
import { useActiveProfile, useChildSettings, useDerived, useStore } from "@/lib/store";
import { useBand } from "../band";
import { Critter, SpeechBubble } from "../Critter";
import { Dialog, Page, ProgressBar, subjectVars } from "../ui";
import { useAllowed } from "./useAllowed";

export function BackButton({ to = "/", label = "Back" }: { to?: string; label?: string }) {
  return (
    <button type="button" className="btn h-14 w-14 shrink-0 text-2xl" aria-label={label} onClick={() => go(to)}>
      ←
    </button>
  );
}

/** A small proficiency chip: 🌱 Emerging, 🌿 Developing, 🌳 Proficient, ⭐ Extending. */
export function LevelChip({ level, compact = false }: { level: number; compact?: boolean }) {
  const profile = useActiveProfile()!;
  const info = levelInfo(profile.framework, profile.grade, level);
  if (!info) {
    return <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-sm font-semibold text-ink-soft">New</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-bold" style={{ background: `${info.colour}22`, color: info.colour }}>
      {info.icon} {compact ? info.kidLabel : info.label}
    </span>
  );
}

export function SubjectPicker() {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const d = useDerived();
  const band = useBand();
  const courses = coursesForGrade(profile.grade).filter((c) => (settings?.enabledSubjects ?? []).includes(c.subject));
  return (
    <Page className="gap-6">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-3xl font-bold sm:text-4xl">{band === "little" ? "Lessons" : "Practice"}</h1>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((c, i) => {
          const meta = getSubjectMeta(c.subject);
          const started = c.units.filter((u) => d.units[unitKey(c.grade, c.subject, u.id)]).length;
          const proficient = c.units.filter((u) => unitLevel(d.units[unitKey(c.grade, c.subject, u.id)]) >= 2).length;
          return (
            <div key={c.subject} className="animate-rise-in" style={{ animationDelay: `${i * 80}ms` }}>
              <a
                href={href(`/practice/${c.subject}`)}
                className="btn w-full flex-col items-stretch gap-3 p-5 text-left"
                style={{ ...subjectVars(meta), "--btn-bg": meta.colour, "--btn-edge": meta.colourDark, "--btn-fg": onColour(meta.colour) } as CSSProperties}
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-20 w-20 shrink-0 animate-float items-center justify-center rounded-3xl bg-white p-1.5 shadow-[0_4px_0_rgba(0,0,0,0.12)]" style={{ animationDelay: `${i * -0.8}s` }}>
                    <Critter id={meta.mascot} size={68} />
                  </span>
                  <span>
                    <span className="block text-3xl font-bold">{meta.title[band]}</span>
                    <span className="block text-lg">{meta.tagline[band]}</span>
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="flex-1 rounded-full bg-white/30 p-1" style={{ "--c": "#ffffff" } as CSSProperties}>
                    <ProgressBar value={proficient} max={c.units.length} height={14} track="transparent" label={`${meta.title[band]} units mastered`} />
                  </span>
                  <span className="text-base font-semibold">
                    🌳 {proficient}/{c.units.length}
                    {started > proficient ? ` · ${started - proficient} growing` : ""}
                  </span>
                </span>
              </a>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

export function UnitList({ subject }: { subject: SubjectId }) {
  const profile = useActiveProfile()!;
  const d = useDerived();
  const band = useBand();
  const family = useStore((s) => s.family);
  const allowed = useAllowed();
  const course = coursesForGrade(profile.grade).find((c) => c.subject === subject);
  const meta = getSubjectMeta(subject);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  if (!course) return null;
  const nextUp = course.units.find((u) => !d.units[unitKey(course.grade, subject, u.id)]);

  const start = (id: string) => {
    const key = unitKey(course.grade, subject, id);
    const ref = { key, course, unit: course.units.find((u) => u.id === id)! };
    if (!allowed(ref)) return setLocked(true);
    // Little kids go straight in; older kids see their level and the Challenge option first.
    if (band === "little") go("/session", { mode: "practice", scope: key });
    else setSelected(key);
  };

  const sel = selected ? course.units.find((u) => unitKey(course.grade, subject, u.id) === selected) : undefined;
  const selStat = selected ? d.units[selected] : undefined;

  return (
    <Page style={subjectVars(meta)} className="gap-6">
      <header className="flex items-center gap-3">
        <BackButton to="/practice" />
        <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: meta.colourDark }}>
          {meta.emoji} {meta.title[band]}
        </h1>
      </header>
      <div className="flex items-center gap-3">
        <Critter id={meta.mascot} mood="happy" size={92} />
        <SpeechBubble className="flex-1">
          <p className="font-read text-xl font-bold sm:text-2xl">{nextUp ? `Pick a lesson! I think “${nextUp.title}” would be fun.` : "You've tried them all! Keep growing every one."}</p>
        </SpeechBubble>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {course.units.map((u, i) => {
          const key = unitKey(course.grade, subject, u.id);
          const level = unitLevel(d.units[key]);
          const isNext = u.id === nextUp?.id;
          const open = allowed({ key, course, unit: u });
          return (
            <div key={u.id} className="animate-rise-in" style={{ animationDelay: `${i * 50}ms` }}>
              <button
                type="button"
                onClick={() => start(u.id)}
                className={`btn relative h-full w-full flex-col gap-1 px-3 pt-6 pb-4 text-center ${level >= 0 ? "btn-soft" : ""} ${isNext ? "animate-pulse-soft" : ""}`}
                style={isNext ? { borderColor: meta.colour, boxShadow: `0 6px 0 ${meta.colourDark}` } : undefined}
              >
                {isNext && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-sm font-bold whitespace-nowrap" style={{ background: meta.colour, color: onColour(meta.colour) }}>
                    Up next!
                  </span>
                )}
                {!open && <span className="absolute top-2 right-3 text-lg">🔒</span>}
                <span className="text-6xl leading-tight">{u.emoji}</span>
                <span className="text-xl leading-tight font-bold sm:text-2xl">{u.title}</span>
                <span className="font-read text-base leading-snug text-ink-soft">{u.blurb}</span>
                <span className="mt-1">
                  <LevelChip level={level} compact={band === "little"} />
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <Dialog open={!!sel} title={sel ? `${sel.emoji} ${sel.title}` : ""} onClose={() => setSelected(null)}>
        {sel && selected && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <LevelChip level={unitLevel(selStat)} />
            </div>
            <p className="font-read text-lg text-ink-soft">{nextStep(selStat)}</p>
            {selStat && (
              <p className="text-sm text-ink-soft">
                {selStat.firstTry} of {selStat.attempts} right on the first try
              </p>
            )}
            <button type="button" className="btn btn-good min-h-16 text-2xl" onClick={() => go("/session", { mode: "practice", scope: selected })}>
              ▶ Practice
            </button>
            <button
              type="button"
              className="btn min-h-14 text-xl"
              onClick={() => {
                if (!canUse(family, "challenge")) {
                  setSelected(null);
                  setLocked(true);
                } else go("/session", { mode: "challenge", scope: selected });
              }}
            >
              🛡️ Challenge <span className="text-sm text-ink-soft">(10 hard questions, no hints)</span>
            </button>
          </div>
        )}
      </Dialog>

      <Dialog open={locked} title="Ask a grown-up" onClose={() => setLocked(false)}>
        <p className="mb-5 font-read text-lg text-ink-soft">This lesson opens with a family membership. A grown-up can turn it on in the grown-ups area.</p>
        <button type="button" className="btn btn-good min-h-14 w-full text-xl" onClick={() => setLocked(false)}>
          OK
        </button>
      </Dialog>
    </Page>
  );
}

export function SpeedPicker() {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const d = useDerived();
  const band = useBand();
  const courses = coursesForGrade(profile.grade).filter((c) => (settings?.enabledSubjects ?? []).includes(c.subject));
  const options = [{ scope: "mix", title: "Mix it up", icon: "🎲", colour: "#7c4fe0", dark: "#5d34c4" }].concat(
    courses.map((c) => {
      const m = getSubjectMeta(c.subject);
      return { scope: c.subject, title: m.title[band], icon: m.emoji, colour: m.colour, dark: m.colourDark };
    }),
  );
  return (
    <Page className="gap-6">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-3xl font-bold sm:text-4xl">⚡ Speed Run</h1>
      </header>
      <p className="font-read text-xl text-ink-soft">Answer as many as you can before the timer runs out. No hints, so trust yourself!</p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {options.map((o, i) => (
          <div key={o.scope} className="animate-rise-in" style={{ animationDelay: `${i * 60}ms` }}>
            <button
              type="button"
              onClick={() => go("/session", { mode: "speed", scope: o.scope })}
              className="btn min-h-36 w-full flex-col gap-1 p-4"
              style={{ "--btn-bg": o.colour, "--btn-edge": o.dark, "--btn-fg": onColour(o.colour) } as CSSProperties}
            >
              <span className="text-5xl">{o.icon}</span>
              <span className="text-2xl font-bold">{o.title}</span>
              <span className="text-sm font-semibold">Best: {d.speedBest[o.scope] ?? 0}</span>
            </button>
          </div>
        ))}
      </div>
    </Page>
  );
}
