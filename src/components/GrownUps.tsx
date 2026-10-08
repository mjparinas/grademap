"use client";

import { useState } from "react";
import { GRADE_LABEL, PROVINCE_LABEL, SUBJECTS, TOTAL_UNITS, unitKey } from "@/lib/curriculum";
import { randInt } from "@/lib/random";
import { useHydrated, useStore, type Settings } from "@/lib/store";
import { BackLink, Dialog, LoadingScreen, Page, ProgressBar, Stars, subjectVars } from "./ui";

const PROFICIENCY = [
  {
    level: "Emerging",
    colour: "#ff9636",
    meaning: "The student demonstrates an initial understanding of the concepts and competencies relevant to the expected learning.",
  },
  {
    level: "Developing",
    colour: "#f5b301",
    meaning: "The student demonstrates a partial understanding of the concepts and competencies relevant to the expected learning.",
  },
  {
    level: "Proficient",
    colour: "#25b47e",
    meaning: "The student demonstrates a complete understanding of the concepts and competencies relevant to the expected learning.",
  },
  {
    level: "Extending",
    colour: "#4f8ef7",
    meaning: "The student demonstrates a sophisticated understanding of the concepts and competencies relevant to the expected learning.",
  },
];

export function GrownUps() {
  const hydrated = useHydrated();
  const [unlocked, setUnlocked] = useState(false);
  if (!hydrated) return <LoadingScreen />;
  return unlocked ? <Dashboard /> : <Gate onPass={() => setUnlocked(true)} />;
}

// A simple check that a grown-up is here: Grade 2s haven't learned these facts yet.
function Gate({ onPass }: { onPass: () => void }) {
  const [[a, b]] = useState(() => [randInt(6, 9), randInt(6, 9)]);
  const [entry, setEntry] = useState("");
  const [wrong, setWrong] = useState(false);

  const press = (key: string) => {
    setWrong(false);
    if (key === "⌫") setEntry((e) => e.slice(0, -1));
    else if (entry.length < 3) setEntry((e) => e + key);
  };

  const submit = () => {
    if (Number(entry) === a * b) onPass();
    else {
      setWrong(true);
      setEntry("");
    }
  };

  return (
    <Page className="items-center justify-center gap-5 text-center">
      <div className="self-start">
        <BackLink href="/" label="Back" />
      </div>
      <h1 className="text-3xl font-bold">🔒 Grown-ups only</h1>
      <p className="font-read text-xl text-ink-soft">To continue, what is</p>
      <p className="text-5xl font-bold">
        {a} × {b} = <span className="inline-block min-w-[2ch] border-b-4 border-ink/30">{entry || " "}</span>
      </p>
      {wrong && <p className="animate-shake text-lg font-semibold text-nudge-dark">That&apos;s not it. Try again.</p>}
      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map((k) => (
          <button
            key={k}
            type="button"
            className={`btn h-16 w-20 text-2xl ${k === "OK" ? "btn-good" : ""}`}
            onClick={() => (k === "OK" ? submit() : press(k))}
          >
            {k}
          </button>
        ))}
      </div>
    </Page>
  );
}

function Toggle({ label, detail, value, onChange }: { label: string; detail: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-paper px-4 py-3 text-left"
    >
      <span>
        <span className="block text-lg font-semibold">{label}</span>
        <span className="block font-read text-sm text-ink-soft">{detail}</span>
      </span>
      <span
        className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${value ? "bg-good" : "bg-ink/20"}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all duration-300 ${value ? "left-8" : "left-1"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.3, 1.6, 0.5, 1)" }}
        />
      </span>
    </button>
  );
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function Dashboard() {
  const profiles = useStore((s) => s.profiles);
  const progressAll = useStore((s) => s.progress);
  const settings = useStore((s) => s.settings);
  const setSetting = useStore((s) => s.setSetting);
  const resetProgress = useStore((s) => s.resetProgress);
  const removeProfile = useStore((s) => s.removeProfile);
  const [selectedId, setSelectedId] = useState<string | null>(profiles[0]?.id ?? null);
  const [confirm, setConfirm] = useState<null | "reset" | "remove">(null);

  const child = profiles.find((p) => p.id === selectedId) ?? profiles[0];
  const progress = (child && progressAll[child.id]) || {};
  const doneCount = Object.keys(progress).length;
  const stars = Object.values(progress).reduce((n, u) => n + u.stars, 0);

  const settingRows: { key: keyof Settings; label: string; detail: string }[] = [
    { key: "sound", label: "Sounds", detail: "Little clicks, chimes and celebrations." },
    { key: "autoRead", label: "Read questions out loud", detail: "Great for early readers. Uses your device's voice." },
  ];

  return (
    <Page className="gap-6 pb-12">
      <header className="flex items-center gap-4">
        <BackLink href="/" label="Back to kids' area" />
        <div>
          <h1 className="text-3xl font-bold">For grown-ups</h1>
          <p className="font-read text-ink-soft">
            {GRADE_LABEL} · {PROVINCE_LABEL}
          </p>
        </div>
      </header>

      {child ? (
        <>
          {profiles.length > 1 && (
            <div className="flex flex-wrap gap-2" role="tablist">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={p.id === child.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`btn h-12 px-4 text-lg ${p.id === child.id ? "btn-soft" : ""}`}
                >
                  {p.avatar} {p.name}
                </button>
              ))}
            </div>
          )}

          <section className="card grid gap-4 p-5 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-4xl" style={{ background: child.colour }}>
                {child.avatar}
              </span>
              <div>
                <p className="text-2xl font-bold">{child.name}</p>
                <p className="font-read text-ink-soft">⭐ {stars} stars</p>
              </div>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-1 font-semibold">
                {doneCount} of {TOTAL_UNITS} lessons completed
              </p>
              <ProgressBar value={doneCount} max={TOTAL_UNITS} />
              <p className="mt-2 font-read text-sm text-ink-soft">
                Stars show how many answers were right on the first try (3 stars = 85% or more). They only ever go up, and
                they aren&apos;t a report card mark.
              </p>
            </div>
          </section>

          {SUBJECTS.map((s) => {
            const count = s.units.filter((u) => progress[unitKey(s.id, u.id)]).length;
            return (
              <section key={s.id} className="card overflow-hidden" style={subjectVars(s)}>
                <div className="flex items-center gap-3 px-5 py-4" style={{ background: s.colourSoft }}>
                  <span className="text-3xl">{s.emoji}</span>
                  <h2 className="flex-1 text-2xl font-bold" style={{ color: s.colourDark }}>
                    {s.title}
                  </h2>
                  <span className="font-semibold text-ink-soft">
                    {count}/{s.units.length}
                  </span>
                </div>
                <ul className="divide-y divide-line">
                  {s.units.map((u) => {
                    const p = progress[unitKey(s.id, u.id)];
                    return (
                      <li key={u.id} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex flex-1 items-start gap-3">
                          <span className="text-2xl">{u.emoji}</span>
                          <div>
                            <p className="text-lg font-semibold">{u.title}</p>
                            <p className="font-read text-sm text-ink-soft">{u.parentNote}</p>
                            <p className="mt-0.5 font-read text-xs text-ink-soft/80">
                              <b>BC learning standard:</b> {u.standard}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pl-9 sm:pl-0">
                          <Stars count={p?.stars ?? 0} size={20} />
                          <span className="w-24 text-sm text-ink-soft">
                            {p ? `Last: ${formatDate(p.lastPlayed)}` : "Not started"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <details className="border-t border-line px-5 py-3">
                  <summary className="cursor-pointer font-semibold">Big Ideas for {GRADE_LABEL} {s.title}</summary>
                  <ul className="mt-2 list-disc space-y-1 pl-5 font-read text-sm text-ink-soft">
                    {s.bigIdeas.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </details>
              </section>
            );
          })}
        </>
      ) : (
        <p className="card p-5 font-read text-lg">No players yet. Add one from the home screen.</p>
      )}

      <section className="card p-5">
        <h2 className="mb-2 text-2xl font-bold">Understanding BC report cards</h2>
        <p className="mb-4 font-read text-ink-soft">
          From Kindergarten to Grade 9, BC report cards use a four-point proficiency scale instead of letter grades. Here is
          what each level means:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROFICIENCY.map((p) => (
            <div key={p.level} className="rounded-2xl bg-paper p-4" style={{ borderLeft: `8px solid ${p.colour}` }}>
              <p className="text-xl font-bold" style={{ color: p.colour }}>
                {p.level}
              </p>
              <p className="font-read text-sm">{p.meaning}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-read text-sm text-ink-soft">
          “Emerging” and “Developing” are normal places to be partway through the year. They describe where your child is
          now, not a failing grade. Your child&apos;s teacher decides proficiency; practice here helps build the skills
          behind it.
        </p>
      </section>

      <section className="card flex flex-col gap-3 p-5">
        <h2 className="text-2xl font-bold">Settings</h2>
        {settingRows.map((r) => (
          <Toggle
            key={r.key}
            label={r.label}
            detail={r.detail}
            value={settings[r.key]}
            onChange={(v) => setSetting(r.key, v)}
          />
        ))}
        <p className="font-read text-sm text-ink-soft">
          Progress is saved on this device only. No account, no ads, and nothing is sent anywhere.
        </p>
      </section>

      {child && (
        <section className="card flex flex-col gap-3 p-5">
          <h2 className="text-2xl font-bold">Manage {child.name}</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn min-h-12 px-4 text-lg" onClick={() => setConfirm("reset")}>
              ↺ Reset progress
            </button>
            <button type="button" className="btn btn-nudge min-h-12 px-4 text-lg" onClick={() => setConfirm("remove")}>
              Remove player
            </button>
          </div>
        </section>
      )}

      <Dialog
        open={confirm !== null && !!child}
        title={confirm === "reset" ? `Reset ${child?.name}'s progress?` : `Remove ${child?.name}?`}
        onClose={() => setConfirm(null)}
      >
        <p className="mb-5 font-read text-lg text-ink-soft">
          {confirm === "reset" ? "All stars and stickers for this player will be cleared." : "This player and all their progress will be deleted."}
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-nudge min-h-14 text-xl"
            onClick={() => {
              if (!child) return;
              if (confirm === "reset") resetProgress(child.id);
              else {
                removeProfile(child.id);
                setSelectedId(profiles.find((p) => p.id !== child.id)?.id ?? null);
              }
              setConfirm(null);
            }}
          >
            Yes, {confirm === "reset" ? "reset" : "remove"}
          </button>
          <button type="button" className="btn min-h-14 text-xl" onClick={() => setConfirm(null)}>
            Cancel
          </button>
        </div>
      </Dialog>
    </Page>
  );
}
