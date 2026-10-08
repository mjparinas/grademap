"use client";

import Link from "next/link";
import { useState } from "react";
import { AVAILABLE_GRADES } from "@/content";
import { DEFAULT_FRAMEWORK, getFramework } from "@/content/frameworks";
import { GRADE_LABEL, GRADE_SHORT } from "@/content/subjects";
import type { GradeId } from "@/content/types";
import { APP_NAME } from "@/lib/brand";
import { MAX_CHILDREN } from "@/lib/plan";
import { sounds } from "@/lib/sound";
import { useDerived, useProfiles, useStore } from "@/lib/store";
import type { Profile } from "@/lib/model";
import { Critter, CritterSvg, CRITTERS, SpeechBubble } from "../Critter";
import { Page } from "../ui";

export const AVATAR_COLOURS = ["#ff9636", "#4f8ef7", "#25b47e", "#e9559a", "#8b5cf6", "#06b6d4", "#f5b301", "#ef4444"];

export function Logo({ size = "text-5xl sm:text-6xl" }: { size?: string }) {
  const colours = ["#4f8ef7", "#e9559a", "#25b47e", "#ff9636", "#8b5cf6", "#06b6d4"];
  return (
    <h1 className={`${size} font-bold tracking-tight`} aria-label={APP_NAME}>
      {APP_NAME.split("").map((ch, i) => (
        <span key={i} aria-hidden="true" className="inline-block animate-drop-in" style={{ color: colours[i % colours.length], animationDelay: `${i * 60}ms` }}>
          {ch}
        </span>
      ))}
    </h1>
  );
}

function GrownUpsLink() {
  return (
    <Link href="/parents/" className="btn h-12 px-4 text-base text-ink-soft">
      🔒 Grown-ups
    </Link>
  );
}

/** First visit: meet the cast, then set up the first child. */
export function FirstRun() {
  const [step, setStep] = useState(0);
  if (step === 0) {
    return (
      <Page className="items-center justify-center gap-6 text-center short:gap-3">
        <Logo size="text-5xl sm:text-6xl short:text-4xl" />
        <div className="flex items-end justify-center gap-1 sm:gap-3 short:hidden">
          {["hoot", "ruby", "ollie", "bolt", "juniper"].map((id, i) => (
            <div key={id} className="animate-drop-in" style={{ animationDelay: `${300 + i * 120}ms` }}>
              <Critter id={id} mood={id === "ollie" ? "wave" : "happy"} size={id === "ollie" ? 150 : 92} />
            </div>
          ))}
        </div>
        <SpeechBubble className="max-w-md animate-pop-in text-left">
          <p className="font-read text-2xl font-bold leading-snug short:text-lg">Hi! I&apos;m Ollie the Otter. My friends and I can&apos;t wait to learn and play with you!</p>
        </SpeechBubble>
        <button type="button" className="btn btn-good min-h-20 w-full max-w-sm animate-pulse-soft text-3xl short:min-h-14 short:text-2xl" onClick={() => setStep(1)}>
          Let&apos;s go! →
        </button>
        <GrownUpsLink />
      </Page>
    );
  }
  return <NewChild onDone={() => {}} first />;
}

/** Name, grade and avatar. Used on first run, from the picker, and in the parent area. */
export function NewChild({ onDone, onCancel, first = false }: { onDone: (id: string) => void; onCancel?: () => void; first?: boolean }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<GradeId | null>(null);
  const [avatar, setAvatar] = useState(CRITTERS[0].id);
  const addProfile = useStore((s) => s.addProfile);
  const ready = name.trim().length > 0 && grade !== null;
  const framework = getFramework(DEFAULT_FRAMEWORK);

  return (
    <Page className="items-center justify-center gap-6 text-center">
      <div className="flex items-center gap-3">
        <Critter id="ollie" mood="happy" size={100} />
        <SpeechBubble>
          <p className="font-read text-2xl font-bold">{first ? "What's your name?" : "Who's joining us?"}</p>
        </SpeechBubble>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 16))}
        placeholder="Type a name"
        aria-label="Name"
        autoComplete="off"
        className="w-full max-w-md rounded-2xl border-4 border-line bg-white px-5 py-4 text-center font-read text-3xl font-bold outline-none focus:border-[#4f8ef7]"
      />

      <div className="w-full max-w-2xl">
        <p className="mb-3 text-2xl font-semibold">What grade?</p>
        <div className="flex flex-wrap justify-center gap-2">
          {AVAILABLE_GRADES.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={grade === g}
              onClick={() => setGrade(g)}
              className={`btn h-16 min-w-16 px-4 text-2xl ${grade === g ? "btn-good scale-110" : ""}`}
              aria-label={GRADE_LABEL[g]}
            >
              {GRADE_SHORT[g]}
            </button>
          ))}
        </div>
        <p className="mt-2 font-read text-sm text-ink-soft">
          {grade ? `${GRADE_LABEL[grade]} · ${framework.curriculumName}` : "K means Kindergarten."}
        </p>
      </div>

      <div>
        <p className="mb-3 text-2xl font-semibold">Pick your animal</p>
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
          {CRITTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-label={`${c.name} the ${c.species}`}
              aria-pressed={c.id === avatar}
              onClick={() => setAvatar(c.id)}
              className={`btn h-20 w-20 p-1 sm:h-24 sm:w-24 ${c.id === avatar ? "scale-110" : ""}`}
              style={c.id === avatar ? { background: AVATAR_COLOURS[i % AVATAR_COLOURS.length] } : undefined}
            >
              <CritterSvg id={c.id} mood={c.id === avatar ? "cheer" : "happy"} />
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
            if (!grade) return;
            const idx = CRITTERS.findIndex((c) => c.id === avatar);
            const id = addProfile({ name, avatar, colour: AVATAR_COLOURS[idx % AVATAR_COLOURS.length], grade });
            sounds.complete();
            onDone(id);
          }}
        >
          Start!
        </button>
        {onCancel && (
          <button type="button" className="btn min-h-14 text-xl" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </Page>
  );
}

function PlayerTile({ p, onPick }: { p: Profile; onPick: () => void }) {
  const d = useDerived(p.id);
  return (
    <button type="button" className="btn w-full flex-col gap-1 p-4" onClick={onPick}>
      <span className="flex h-24 w-24 items-center justify-center rounded-full p-1" style={{ background: p.colour }}>
        <CritterSvg id={p.avatar} />
      </span>
      <span className="text-2xl font-bold">{p.name}</span>
      <span className="text-base text-ink-soft">
        {GRADE_LABEL[p.grade]} · Lv {d.level}
      </span>
    </button>
  );
}

export function Picker() {
  const profiles = useProfiles();
  const setActive = useStore((s) => s.setActive);
  const [adding, setAdding] = useState(false);
  if (adding) return <NewChild onDone={() => setAdding(false)} onCancel={() => setAdding(false)} />;
  return (
    <Page className="items-center justify-center gap-8 text-center">
      <Logo />
      <div className="flex items-center gap-3">
        <Critter id="ollie" mood="wave" size={110} />
        <SpeechBubble>
          <p className="font-read text-2xl font-bold">Who&apos;s learning today?</p>
        </SpeechBubble>
      </div>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {profiles.map((p, i) => (
          <div key={p.id} className="animate-rise-in" style={{ animationDelay: `${i * 80}ms` }}>
            <PlayerTile p={p} onPick={() => setActive(p.id)} />
          </div>
        ))}
        {profiles.length < MAX_CHILDREN && (
          <div className="animate-rise-in" style={{ animationDelay: `${profiles.length * 80}ms` }}>
            <button type="button" className="btn h-full min-h-48 w-full flex-col gap-2 border-dashed p-4 text-ink-soft" onClick={() => setAdding(true)}>
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
