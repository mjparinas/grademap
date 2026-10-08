"use client";

import { getItem } from "@/lib/shop";
import { go } from "@/lib/router";
import { useActiveProfile, useDerived, useStore } from "@/lib/store";
import { CritterSvg } from "../Critter";

/** A level badge with an XP ring around it, like a console profile. */
export function LevelBadge({ level, progress, size = 56 }: { level: number; progress: number; size?: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-label={`Level ${level}`}>
      <svg viewBox="0 0 50 50" className="absolute inset-0 -rotate-90">
        <circle cx="25" cy="25" r={r} fill="#fff" stroke="#ece8f8" strokeWidth="5" />
        <circle
          cx="25"
          cy="25"
          r={r}
          fill="none"
          stroke="url(#xp-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, progress))}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.3,1.4,0.5,1)" }}
        />
        <defs>
          <linearGradient id="xp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#6d3fd6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="relative text-lg font-bold text-[#6d3fd6]">{level}</span>
    </span>
  );
}

export function Hud() {
  const profile = useActiveProfile()!;
  const d = useDerived();
  const setActive = useStore((s) => s.setActive);
  const title = getItem(profile.title);
  const trophies = Object.keys(d.trophies).length;

  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <button
        type="button"
        className="btn h-16 gap-2 pr-4 pl-1.5 text-left"
        onClick={() => setActive(null)}
        aria-label={`${profile.name}. Switch player`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl p-0.5" style={{ background: profile.colour }}>
          <CritterSvg id={profile.avatar} />
        </span>
        <span className="leading-tight">
          <span className="block text-xl font-bold">{profile.name}</span>
          {title && (
            <span className="block text-xs font-semibold text-ink-soft">
              {title.icon} {title.name}
            </span>
          )}
        </span>
      </button>
      <div className="flex items-center gap-2">
        <span className="flex h-16 items-center gap-2 rounded-2xl bg-white pr-3 pl-1 shadow-[0_4px_0_var(--color-line)]" title={`${d.levelXp} / ${d.levelNeed} XP`}>
          <LevelBadge level={d.level} progress={d.levelXp / d.levelNeed} size={52} />
          <span className="hidden text-sm leading-tight font-semibold text-ink-soft sm:block">
            {d.levelXp}/{d.levelNeed}
            <br />
            XP
          </span>
        </span>
        <span className="flex h-16 items-center gap-1 rounded-2xl bg-white px-3 text-xl font-bold shadow-[0_4px_0_var(--color-line)]" aria-label={`${d.coins} coins`}>
          🪙 <span key={d.coins} className="inline-block animate-pop-in">{d.coins}</span>
        </span>
        <span
          className={`flex h-16 items-center gap-1 rounded-2xl px-3 text-xl font-bold shadow-[0_4px_0_var(--color-line)] ${
            d.streak.activeToday ? "bg-nudge-soft text-nudge-dark" : "bg-white text-ink-soft"
          }`}
          aria-label={`${d.streak.current} day streak`}
        >
          <span className={d.streak.activeToday ? "animate-wiggle" : "grayscale"}>🔥</span>
          {d.streak.current}
        </span>
        <button type="button" className="btn h-16 gap-1 px-3 text-xl" onClick={() => go("/trophies")} aria-label={`${trophies} trophies`}>
          🏆 {trophies}
        </button>
      </div>
    </header>
  );
}
