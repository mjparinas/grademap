"use client";

import { useState } from "react";
import { TIER_STYLE, TROPHIES, type Tier, type Trophy, type TrophyCategory } from "@/lib/trophies";
import { useActiveProfile, useDerived } from "@/lib/store";
import { Page, ProgressBar } from "../ui";
import { LevelBadge } from "./Hud";
import { BackButton } from "./Practice";

const TIERS: Tier[] = ["platinum", "gold", "silver", "bronze"];
const CATEGORIES: TrophyCategory[] = ["Getting started", "Practice", "Streaks", "Mastery", "Modes", "Arcade", "Collector", "Secret"];

export function TrophyIcon({ trophy, earned, size = 64 }: { trophy: Trophy; earned: boolean; size?: number }) {
  const s = TIER_STYLE[trophy.tier];
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-full ${earned ? "" : "grayscale"}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.48,
        background: earned ? `radial-gradient(circle at 35% 30%, ${s.glow}, ${s.colour})` : "#e8e6ef",
        boxShadow: earned ? `0 0 0 3px ${s.dark}, 0 4px 0 ${s.dark}` : "0 0 0 3px #d4d1dd",
        opacity: earned ? 1 : 0.7,
      }}
    >
      {trophy.hidden && !earned ? "❔" : trophy.icon}
    </span>
  );
}

export function TrophyRoom() {
  const profile = useActiveProfile()!;
  const d = useDerived();
  const [filter, setFilter] = useState<"all" | "earned" | "todo">("all");
  const earned = TROPHIES.filter((t) => d.trophies[t.id]);
  const pct = Math.round((earned.length / TROPHIES.length) * 100);
  const ctx = { grade: profile.grade };

  return (
    <Page className="gap-5">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-3xl font-bold sm:text-4xl">🏆 Trophies</h1>
      </header>

      {/* Profile card, console style. */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a2f45] to-[#1b1f2e] p-5 text-white shadow-xl">
        <div className="flex flex-wrap items-center gap-4">
          <LevelBadge level={d.level} progress={d.levelXp / d.levelNeed} size={72} />
          <div className="flex-1">
            <p className="text-2xl font-bold">{profile.name}</p>
            <p className="text-white/70">
              {d.trophyPoints} trophy points · {earned.length}/{TROPHIES.length} trophies
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-gradient-to-r from-[#8fd3f0] to-[#4f8ef7]" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-sm font-bold">{pct}%</span>
            </div>
          </div>
          <div className="flex gap-3">
            {TIERS.map((tier) => (
              <div key={tier} className="flex flex-col items-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full text-xl" style={{ background: `radial-gradient(circle at 35% 30%, ${TIER_STYLE[tier].glow}, ${TIER_STYLE[tier].colour})` }}>
                  🏆
                </span>
                <span className="mt-1 text-lg font-bold">{earned.filter((t) => t.tier === tier).length}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex gap-2" role="tablist">
        {(["all", "earned", "todo"] as const).map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={`btn h-12 px-4 text-lg ${filter === f ? "btn-soft" : ""}`}>
            {f === "all" ? "All" : f === "earned" ? "Earned" : "To do"}
          </button>
        ))}
      </div>

      {CATEGORIES.map((cat) => {
        const list = TROPHIES.filter((t) => t.category === cat).filter((t) =>
          filter === "all" ? true : filter === "earned" ? d.trophies[t.id] : !d.trophies[t.id],
        );
        if (!list.length) return null;
        return (
          <section key={cat}>
            <h2 className="mb-2 text-xl font-bold text-ink-soft">{cat}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((t) => {
                const got = d.trophies[t.id];
                const p = t.progress(d, ctx);
                return (
                  <div key={t.id} className="card flex items-center gap-3 p-3">
                    <TrophyIcon trophy={t} earned={!!got} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-lg font-bold">
                        {t.hidden && !got ? "Secret trophy" : t.name}
                        <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: `${TIER_STYLE[t.tier].colour}33`, color: TIER_STYLE[t.tier].text }}>
                          {TIER_STYLE[t.tier].label}
                        </span>
                      </p>
                      <p className="font-read text-sm text-ink-soft">{t.hidden && !got ? "Keep playing to discover it!" : t.description}</p>
                      {got ? (
                        <p className="text-xs font-semibold text-good-dark">Earned {new Date(got).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}</p>
                      ) : (
                        !t.hidden && (
                          <div className="mt-1 flex items-center gap-2">
                            <ProgressBar value={p.value} max={p.target} height={10} className="flex-1" label={`Progress towards ${t.name}`} />
                            <span className="text-xs font-semibold text-ink-soft">
                              {p.value}/{p.target}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </Page>
  );
}
