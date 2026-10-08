"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { APP_NAME, MASCOT_NAME } from "@/lib/brand";
import { GRADE_LABEL, PROVINCE_LABEL, SUBJECTS, TOTAL_UNITS, unitKey } from "@/lib/curriculum";
import { sounds } from "@/lib/sound";
import {
  AVATAR_COLOURS,
  AVATARS,
  MAX_PROFILES,
  useActiveProfile,
  useActiveProgress,
  useHydrated,
  useStore,
  type UnitProgress,
} from "@/lib/store";
import { Mascot, SpeechBubble } from "./Mascot";
import { LoadingScreen, Page, ProgressBar, subjectVars } from "./ui";

export function Home() {
  const hydrated = useHydrated();
  const profiles = useStore((s) => s.profiles);
  const profile = useActiveProfile();
  const [adding, setAdding] = useState(false);

  if (!hydrated) return <LoadingScreen />;
  if (profiles.length === 0 || adding) {
    return <Onboarding firstTime={profiles.length === 0} onDone={() => setAdding(false)} />;
  }
  if (!profile) return <ProfilePicker onAdd={() => setAdding(true)} />;
  return <SubjectMap />;
}

function Logo() {
  const colours = ["#4f8ef7", "#e9559a", "#25b47e", "#ff9636", "#8b5cf6", "#06b6d4"];
  return (
    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl" aria-label={APP_NAME}>
      {APP_NAME.split("").map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block animate-drop-in"
          style={{ color: colours[i % colours.length], animationDelay: `${i * 60}ms` }}
        >
          {ch}
        </span>
      ))}
    </h1>
  );
}

function GrownUpsLink() {
  return (
    <Link href="/grown-ups/" className="btn h-12 px-4 text-base text-ink-soft">
      🔒 Grown-ups
    </Link>
  );
}

// ---------- First visit / add a player ----------

function Onboarding({ firstTime, onDone }: { firstTime: boolean; onDone: () => void }) {
  const [step, setStep] = useState(firstTime ? 0 : 1);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const addProfile = useStore((s) => s.addProfile);

  if (step === 0) {
    return (
      <Page className="items-center justify-center gap-6 text-center">
        <Logo />
        <p className="text-xl font-semibold text-ink-soft">
          {GRADE_LABEL} · {PROVINCE_LABEL}
        </p>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <Mascot mood="wave" size={190} />
          <SpeechBubble className="max-w-sm animate-pop-in text-left">
            <p className="font-read text-2xl font-bold leading-snug">
              Hi! I&apos;m {MASCOT_NAME} the Otter. Let&apos;s learn and play together!
            </p>
          </SpeechBubble>
        </div>
        <button type="button" className="btn btn-good min-h-20 w-full max-w-sm animate-pulse-soft text-3xl" onClick={() => setStep(1)}>
          Let&apos;s go! →
        </button>
        <GrownUpsLink />
      </Page>
    );
  }

  const colour = AVATAR_COLOURS[AVATARS.indexOf(avatar)];
  const ready = name.trim().length > 0;
  return (
    <Page className="items-center justify-center gap-6 text-center">
      <div className="flex items-center gap-3">
        <Mascot mood="happy" size={110} />
        <SpeechBubble>
          <p className="font-read text-2xl font-bold">What&apos;s your name?</p>
        </SpeechBubble>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 16))}
        placeholder="Type your name"
        aria-label="Your name"
        autoComplete="off"
        className="w-full max-w-md rounded-2xl border-4 border-line bg-white px-5 py-4 text-center font-read text-3xl font-bold outline-none focus:border-[#4f8ef7]"
      />

      <div>
        <p className="mb-3 text-2xl font-semibold">Pick your animal</p>
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map((a, i) => (
            <button
              key={a}
              type="button"
              aria-label={`Animal ${i + 1}`}
              aria-pressed={a === avatar}
              onClick={() => setAvatar(a)}
              className={`btn h-20 w-20 text-5xl sm:h-24 sm:w-24 ${a === avatar ? "scale-110" : ""}`}
              style={
                a === avatar
                  ? ({ "--btn-bg": AVATAR_COLOURS[i], "--btn-edge": "#00000033" } as CSSProperties)
                  : undefined
              }
            >
              <span className={a === avatar ? "animate-wiggle" : ""}>{a}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col gap-3">
        <button
          type="button"
          disabled={!ready}
          className={`btn btn-good min-h-20 text-3xl ${ready ? "" : "opacity-50"}`}
          onClick={() => {
            addProfile(name, avatar, colour);
            sounds.complete();
            onDone();
          }}
        >
          Start! {ready && avatar}
        </button>
        {!firstTime && (
          <button type="button" className="btn min-h-14 text-xl" onClick={onDone}>
            Cancel
          </button>
        )}
      </div>
    </Page>
  );
}

// ---------- Who's playing? ----------

function countStars(p: Record<string, UnitProgress> | undefined): number {
  return Object.values(p ?? {}).reduce((n, u) => n + u.stars, 0);
}

function ProfilePicker({ onAdd }: { onAdd: () => void }) {
  const profiles = useStore((s) => s.profiles);
  const progress = useStore((s) => s.progress);
  const setActive = useStore((s) => s.setActive);
  return (
    <Page className="items-center justify-center gap-8 text-center">
      <Logo />
      <div className="flex items-center gap-3">
        <Mascot mood="wave" size={110} />
        <SpeechBubble>
          <p className="font-read text-2xl font-bold">Who&apos;s learning today?</p>
        </SpeechBubble>
      </div>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {profiles.map((p, i) => (
          <div key={p.id} className="animate-rise-in" style={{ animationDelay: `${i * 80}ms` }}>
            <button type="button" className="btn w-full flex-col gap-1 p-4" onClick={() => setActive(p.id)}>
              <span
                className="flex h-24 w-24 items-center justify-center rounded-full text-6xl"
                style={{ background: p.colour }}
              >
                {p.avatar}
              </span>
              <span className="text-2xl font-bold">{p.name}</span>
              <span className="text-lg text-ink-soft">⭐ {countStars(progress[p.id])}</span>
            </button>
          </div>
        ))}
        {profiles.length < MAX_PROFILES && (
          <div className="animate-rise-in" style={{ animationDelay: `${profiles.length * 80}ms` }}>
            <button type="button" className="btn h-full min-h-48 w-full flex-col gap-2 border-dashed p-4 text-ink-soft" onClick={onAdd}>
              <span className="text-5xl">＋</span>
              <span className="text-xl font-bold">Add player</span>
            </button>
          </div>
        )}
      </div>
      <GrownUpsLink />
    </Page>
  );
}

// ---------- Subject map ----------

function SubjectMap() {
  const profile = useActiveProfile()!;
  const progress = useActiveProgress();
  const setActive = useStore((s) => s.setActive);
  const totalStars = countStars(progress);
  const done = (subjectId: string, unitId: string) => Boolean(progress[unitKey(subjectId, unitId)]);

  // Suggest the next lesson in the subject they've done least of.
  const suggestion = [...SUBJECTS]
    .map((s) => ({ s, ratio: s.units.filter((u) => done(s.id, u.id)).length / s.units.length }))
    .sort((a, b) => a.ratio - b.ratio)
    .map(({ s }) => ({ subject: s, unit: s.units.find((u) => !done(s.id, u.id)) }))
    .find((x) => x.unit);

  const stickers = SUBJECTS.flatMap((s) => s.units.map((u) => ({ s, u, earned: done(s.id, u.id) })));
  const earned = stickers.filter((x) => x.earned).length;

  return (
    <Page className="gap-6">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn h-14 gap-2 pl-1.5 pr-4 text-xl"
          onClick={() => setActive(null)}
          aria-label={`${profile.name}. Switch player`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl text-3xl" style={{ background: profile.colour }}>
            {profile.avatar}
          </span>
          {profile.name}
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-14 items-center gap-1 rounded-2xl bg-white px-4 text-2xl font-bold shadow-[0_4px_0_var(--color-line)]">
            ⭐ <span key={totalStars} className="inline-block animate-pop-in">{totalStars}</span>
          </span>
          <GrownUpsLink />
        </div>
      </header>

      <div className="flex items-center gap-3">
        <Mascot mood="wave" size={104} />
        <SpeechBubble className="flex-1">
          <p className="font-read text-2xl font-bold leading-snug sm:text-3xl">
            Hi {profile.name}! What do you want to learn today?
          </p>
        </SpeechBubble>
      </div>

      {suggestion?.unit && (
        <Link
          href={`/learn/${suggestion.subject.id}/${suggestion.unit.id}/`}
          className="btn btn-primary min-h-20 animate-rise-in justify-between gap-3 px-5 text-left"
          style={subjectVars(suggestion.subject)}
        >
          <span className="flex items-center gap-3">
            <span className="animate-float text-5xl">{suggestion.unit.emoji}</span>
            <span>
              <span className="block text-base font-semibold opacity-90">Try next · {suggestion.subject.title}</span>
              <span className="block text-2xl font-bold">{suggestion.unit.title}</span>
            </span>
          </span>
          <span className="text-3xl">▶</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {SUBJECTS.map((s, i) => {
          const count = s.units.filter((u) => done(s.id, u.id)).length;
          return (
            <div key={s.id} className="animate-rise-in" style={{ animationDelay: `${120 + i * 90}ms` }}>
              <Link
                href={`/learn/${s.id}/`}
                className="btn w-full items-stretch p-0 text-left"
                style={{ ...subjectVars(s), "--btn-bg": s.colour, "--btn-edge": s.colourDark, "--btn-fg": "#fff" } as CSSProperties}
              >
                <span className="flex w-full flex-col gap-3 p-5">
                  <span className="flex items-center gap-4">
                    <span
                      className="flex h-20 w-20 shrink-0 animate-float items-center justify-center rounded-3xl bg-white text-5xl shadow-[0_4px_0_rgba(0,0,0,0.12)]"
                      style={{ animationDelay: `${i * -0.8}s` }}
                    >
                      {s.emoji}
                    </span>
                    <span>
                      <span className="block text-3xl font-bold">{s.title}</span>
                      <span className="block text-lg opacity-90">{s.tagline}</span>
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="flex-1 rounded-full bg-white/30 p-1" style={{ "--c": "#ffffff" } as CSSProperties}>
                      <ProgressBar value={count} max={s.units.length} height={16} track="transparent" />
                    </span>
                    <span className="text-lg font-semibold">
                      {count}/{s.units.length}
                    </span>
                  </span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      <section className="card p-5">
        <h2 className="mb-3 flex items-center justify-between text-2xl font-bold">
          <span>📒 My sticker book</span>
          <span className="text-lg text-ink-soft">
            {earned} / {TOTAL_UNITS}
          </span>
        </h2>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
          {stickers.map(({ s, u, earned: got }) => (
            <span
              key={`${s.id}-${u.id}`}
              title={got ? u.title : "Not yet!"}
              className={`flex aspect-square items-center justify-center rounded-full text-3xl ${got ? "animate-pop-in" : "text-xl font-bold text-ink/25"}`}
              style={got ? { background: s.colourSoft, outline: `3px solid ${s.colour}` } : { background: "#f1efe9" }}
            >
              {got ? u.emoji : "?"}
            </span>
          ))}
        </div>
      </section>
    </Page>
  );
}
