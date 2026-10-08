"use client";

import { useState } from "react";
import { getSubjectMeta, SUBJECTS } from "@/content/subjects";
import type { SubjectId } from "@/content/types";
import { defaultChildSettings, type ChildSettings } from "@/lib/model";
import { useStore } from "@/lib/store";
import { ChildTabs, NoChildren, PageTitle, Panel, useChild } from "./common";
import { VoicePicker } from "./VoicePicker";

function Slider({ label, value, min, max, step = 1, unit, onChange, help }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void; help?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex justify-between font-semibold">
        {label}
        <span className="tabular-nums">
          {value} {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="accent-[#4f8ef7]" />
      {help && <span className="text-sm text-ink-soft">{help}</span>}
    </label>
  );
}

function Switch({ label, help, value, onChange }: { label: string; help?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} className="flex w-full items-center justify-between gap-4 rounded-xl bg-paper px-4 py-3 text-left">
      <span>
        <span className="block font-semibold">{label}</span>
        {help && <span className="block text-sm text-ink-soft">{help}</span>}
      </span>
      <span className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${value ? "bg-good" : "bg-ink/20"}`} aria-hidden="true">
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${value ? "left-7" : "left-1"}`} />
      </span>
    </button>
  );
}

export function SettingsPage({ childId }: { childId?: string }) {
  const child = useChild(childId);
  const stored = useStore((s) => (child ? s.settings[child.id] : undefined));
  const update = useStore((s) => s.updateSettings);
  const setPin = useStore((s) => s.setPin);
  const [newPin, setNewPin] = useState("");
  const [pinSaved, setPinSaved] = useState(false);
  if (!child) return <NoChildren />;
  const s: ChildSettings = stored ?? defaultChildSettings(child.id, child.grade === "k" || child.grade === "1");
  const set = (patch: Partial<ChildSettings>) => update(child.id, patch);
  const focusOn = Boolean(s.calmMotion && s.quietSounds && s.hideTimers && s.quietToasts && s.shortSessions);
  const toggleSubject = (id: SubjectId) => {
    const next = s.enabledSubjects.includes(id) ? s.enabledSubjects.filter((x) => x !== id) : [...s.enabledSubjects, id];
    if (next.length) set({ enabledSubjects: next });
  };

  return (
    <>
      <PageTitle title="Settings" sub="Changes save automatically and sync to your other devices." />
      <ChildTabs base="settings" current={child} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={`⏱️ ${child.name}'s daily goal`}>
          <Slider label="Daily learning goal" value={s.dailyGoalMinutes} min={5} max={60} step={5} unit="min" onChange={(v) => set({ dailyGoalMinutes: v })} help="Shown as a progress bar on the home screen." />
          <div className="mt-4">
            <Switch label="Show a timer during lessons" value={s.showTimer} onChange={(v) => set({ showTimer: v })} help="Timed modes (Speed Run, Challenge) always show their countdown." />
          </div>
        </Panel>

        <Panel title="🌤️ Calm and focus">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-soft">
              Options for children who find lots of motion, noise or time pressure hard to handle, including many children with ADHD. They only change how things look and sound; scoring is the same.
            </p>
            <button type="button" className="btn btn-soft min-h-12 px-4 font-semibold" onClick={() => set(focusOn ? { calmMotion: false, quietSounds: false, hideTimers: false, quietToasts: false, shortSessions: false } : { calmMotion: true, quietSounds: true, hideTimers: true, quietToasts: true, shortSessions: true })}>
              {focusOn ? "Turn all calm options off" : "Turn on all calm options"}
            </button>
            <Switch label="Calm motion" value={Boolean(s.calmMotion)} onChange={(v) => set({ calmMotion: v })} help="No confetti, bursts, floating text or screen shakes." />
            <Switch label="Quiet sounds" value={Boolean(s.quietSounds)} onChange={(v) => set({ quietSounds: v })} help="Keeps gentle taps and feedback; no fanfares, chimes or countdown ticks." />
            <Switch label="Hide timers" value={Boolean(s.hideTimers)} onChange={(v) => set({ hideTimers: v })} help="Hides clocks and countdown numbers. Speed Run and Challenge show a quiet bar instead and still end on time." />
            <Switch label="Hold trophy pop-ups until after the lesson" value={Boolean(s.quietToasts)} onChange={(v) => set({ quietToasts: v })} help="Nothing appears on screen while your child is working on a question." />
            <Switch label="Shorter sessions" value={Boolean(s.shortSessions)} onChange={(v) => set({ shortSessions: v })} help="Five questions at a time in Adventure (with a break screen) and Review." />
          </div>
        </Panel>

        <Panel title="🎮 Learn-to-play timer">
          <div className="flex flex-col gap-4">
            <Switch label="Arcade games" value={s.gamesEnabled} onChange={(v) => set({ gamesEnabled: v })} help="Educational games for math, reading, science and memory." />
            {s.gamesEnabled && (
              <>
                <Switch label="Free play" value={s.freePlay} onChange={(v) => set({ freePlay: v })} help="Games are open without earning time first (still limited to the daily maximum)." />
                {!s.freePlay && (
                  <>
                    <Slider label="Learning needed" value={s.learnMinutesPerReward} min={5} max={60} step={5} unit="min" onChange={(v) => set({ learnMinutesPerReward: v })} />
                    <Slider label="Game time earned" value={s.rewardGameMinutes} min={1} max={30} unit="min" onChange={(v) => set({ rewardGameMinutes: v })} />
                  </>
                )}
                <Slider label="Most game time per day" value={s.maxGameMinutesPerDay} min={5} max={120} step={5} unit="min" onChange={(v) => set({ maxGameMinutesPerDay: v })} />
                <p className="rounded-xl bg-[#eef4ff] p-3 text-sm">
                  {s.freePlay ? `Up to ${s.maxGameMinutesPerDay} minutes of games a day.` : `Every ${s.learnMinutesPerReward} minutes of learning unlocks ${s.rewardGameMinutes} minutes of games, up to ${s.maxGameMinutesPerDay} minutes a day.`}
                </p>
              </>
            )}
          </div>
        </Panel>

        <Panel title="📚 Subjects">
          <p className="mb-3 text-sm text-ink-soft">Choose what shows up in lessons, Adventure and the Daily Challenge.</p>
          <div className="grid grid-cols-2 gap-2">
            {SUBJECTS.map((sub) => (
              <label key={sub.id} className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2 font-semibold">
                <input type="checkbox" checked={s.enabledSubjects.includes(sub.id)} onChange={() => toggleSubject(sub.id)} className="h-5 w-5 accent-[#4f8ef7]" />
                {getSubjectMeta(sub.id).emoji} {sub.title.big}
              </label>
            ))}
          </div>
        </Panel>

        <Panel title="🔊 Sound & reading">
          <div className="flex flex-col gap-3">
            <Switch label="Sounds" value={s.sound} onChange={(v) => set({ sound: v })} help="Clicks, chimes and celebrations." />
            <Switch label="Read questions out loud" value={s.autoRead} onChange={(v) => set({ autoRead: v })} help="On by default for Kindergarten and Grade 1. Kids can always tap 🔊 to hear a question." />
          </div>
        </Panel>

        <VoicePicker />

        <Panel title="🔒 Parent PIN">
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1">
              <span className="font-semibold">New PIN (4–6 digits)</span>
              <input
                inputMode="numeric"
                value={newPin}
                onChange={(e) => {
                  setPinSaved(false);
                  setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                }}
                className="rounded-xl border-2 border-line px-3 py-2 text-lg tracking-widest"
              />
            </label>
            <button
              type="button"
              disabled={newPin.length < 4}
              className="rounded-xl bg-[#253047] px-4 py-2.5 font-bold text-white disabled:opacity-40"
              onClick={() => void setPin(newPin).then(() => {
                setNewPin("");
                setPinSaved(true);
              })}
            >
              Change PIN
            </button>
            {pinSaved && <span className="font-semibold text-good-dark">Saved ✓</span>}
          </div>
          <p className="mt-2 text-sm text-ink-soft">The PIN is stored on this device only.</p>
        </Panel>
      </div>
    </>
  );
}
