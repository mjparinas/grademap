"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState, type CSSProperties } from "react";
import { gameTime } from "@/lib/gametime";
import { celebrate } from "@/lib/juice";
import { go } from "@/lib/router";
import { getItem } from "@/lib/shop";
import { sounds } from "@/lib/sound";
import { stopSpeaking } from "@/lib/speech";
import { useActiveProfile, useChildSettings, useDerived, useStore } from "@/lib/store";
import { useBand } from "../band";
import { Critter, SpeechBubble } from "../Critter";
import { Page, ProgressBar } from "../ui";
import { Bubbles } from "./games/Bubbles";
import { Catch } from "./games/Catch";
import { Memory } from "./games/Memory";
import { Munchers } from "./games/Munchers";
import { Ninja } from "./games/Ninja";
import { GAMES, type GameProps } from "./games/types";
import { BackButton } from "./Practice";

const COMPONENTS: Record<string, (p: GameProps) => React.ReactElement> = {
  munchers: Munchers,
  ninja: Ninja,
  catch: Catch,
  bubbles: Bubbles,
  memory: Memory,
};

function mmss(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function TimeBank() {
  const settings = useChildSettings();
  const d = useDerived();
  const t = gameTime(settings, d);
  const per = (settings?.learnMinutesPerReward ?? 20) * 60;
  if (!t.enabled) {
    return <p className="card p-4 font-read text-lg">Games are turned off right now. A grown-up can turn them on.</p>;
  }
  return (
    <section className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <span className="text-5xl">{t.availableSeconds > 0 ? "🎮" : "🔒"}</span>
      <div className="flex-1">
        {t.freePlay ? (
          <p className="text-xl font-bold">Free play is on! {mmss(t.availableSeconds)} left today.</p>
        ) : t.availableSeconds > 0 ? (
          <p className="text-xl font-bold">
            You have <span className="text-[#6d3fd6]">{mmss(t.availableSeconds)}</span> of game time!
          </p>
        ) : t.nextInSeconds > 0 ? (
          <p className="text-xl font-bold">Learn {Math.ceil(t.nextInSeconds / 60)} more minutes to unlock {settings?.rewardGameMinutes ?? 5} minutes of games.</p>
        ) : (
          <p className="text-xl font-bold">That&apos;s all the game time for today. See you tomorrow!</p>
        )}
        {!t.freePlay && t.nextInSeconds > 0 && <ProgressBar value={per - t.nextInSeconds} max={per} className="mt-2" height={14} />}
        <p className="mt-1 font-read text-sm text-ink-soft">
          Every {settings?.learnMinutesPerReward ?? 20} minutes of learning earns {settings?.rewardGameMinutes ?? 5} minutes of games (up to {settings?.maxGameMinutesPerDay ?? 20} a day).
        </p>
      </div>
      {t.availableSeconds <= 0 && t.nextInSeconds > 0 && (
        <button type="button" className="btn btn-good min-h-14 px-5 text-xl" onClick={() => go("/session", { mode: "adventure", scope: "mix" })}>
          Go learn →
        </button>
      )}
    </section>
  );
}

export function Arcade() {
  const settings = useChildSettings();
  const d = useDerived();
  const band = useBand();
  const t = gameTime(settings, d);
  const canPlay = t.enabled && t.availableSeconds > 0;
  return (
    <Page className="gap-5">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-3xl font-bold sm:text-4xl">🕹️ {band === "little" ? "Games" : "Arcade"}</h1>
      </header>
      <TimeBank />
      <div className="grid gap-4 sm:grid-cols-2">
        {GAMES.map((g, i) => (
          <div key={g.id} className="animate-rise-in" style={{ animationDelay: `${i * 70}ms` }}>
            <button
              type="button"
              disabled={!canPlay}
              onClick={() => go(`/arcade/${g.id}`)}
              className={`btn h-full w-full items-start justify-start gap-4 p-4 text-left ${canPlay ? "" : "opacity-60"}`}
              style={{ "--btn-bg": g.colour, "--btn-edge": g.dark, "--btn-fg": "#fff" } as CSSProperties}
            >
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/25 text-5xl">{canPlay ? g.icon : "🔒"}</span>
              <span>
                <span className="block text-sm font-semibold opacity-80">{g.subject}</span>
                <span className="block text-2xl font-bold">{g.title}</span>
                <span className="block font-read text-sm opacity-90">{g.desc}</span>
                <span className="mt-1 block text-sm font-bold">Best: {d.gameBest[g.id] ?? 0}</span>
              </span>
            </button>
          </div>
        ))}
      </div>
    </Page>
  );
}

export function GameScreen({ id }: { id: string }) {
  const profile = useActiveProfile()!;
  const settings = useChildSettings();
  const band = useBand();
  const d = useDerived();
  const log = useStore((s) => s.log);
  const info = GAMES.find((g) => g.id === id);
  const Game = COMPONENTS[id];
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [round, setRound] = useState(0);
  const [why, setWhy] = useState<"lives" | "time">("lives");
  const score = useRef(0);
  const level = useRef(1);
  const [shownScore, setShownScore] = useState(0);
  const pending = useRef(0);
  const [unflushed, setUnflushed] = useState(0);
  const [bestBefore, setBestBefore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const available = gameTime(settings, d).availableSeconds;
  const left = available - unflushed;

  const flush = useCallback(() => {
    const seconds = Math.round(pending.current);
    if (seconds > 0) log([{ type: "play", game: id, seconds }]);
    pending.current = 0;
    setUnflushed(0);
  }, [id, log]);

  const end = useCallback(
    (reason: "lives" | "time") => {
      if (phase !== "playing") return;
      stopSpeaking();
      flush();
      log([{ type: "game", game: id, score: score.current, level: level.current }]);
      setFinalScore(score.current);
      setWhy(reason);
      setPhase("over");
      sounds.complete();
      if (score.current > bestBefore && score.current > 0) celebrate(getItem(profile.confetti)?.confetti ?? []);
    },
    [phase, flush, log, id, profile.confetti, bestBefore],
  );

  // Checked once a second by the play clock below.
  const tick = useEffectEvent(() => {
    if (document.visibilityState !== "visible") return;
    pending.current += 1;
    setUnflushed((u) => u + 1);
    if (available - (unflushed + 1) <= 0) end("time");
    else if (pending.current >= 15) flush();
  });

  // Count play time while the game is on screen, and save it every 15 seconds.
  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => () => flush(), [flush]);

  const onScore = useCallback((s: number) => {
    score.current = s;
    setShownScore(s);
  }, []);
  const onLevel = useCallback((l: number) => {
    level.current = l;
  }, []);
  const onOver = useCallback(() => end("lives"), [end]);

  if (!info || !Game) return null;

  if (phase === "ready" || phase === "over") {
    const best = Math.max(d.gameBest[id] ?? 0, phase === "over" ? finalScore : 0);
    const newBest = phase === "over" && finalScore > bestBefore && finalScore > 0;
    return (
      <Page className="items-center justify-center gap-5 text-center">
        <Critter id={profile.companion} mood={phase === "over" ? "cheer" : "wave"} size={130} />
        <h1 className="text-4xl font-bold">
          {info.icon} {info.title}
        </h1>
        {phase === "over" ? (
          <>
            <p className="text-2xl font-bold">{newBest ? "🏆 New best score!" : why === "time" ? "Game time is up!" : "Game over!"}</p>
            <p className="text-5xl font-bold">{finalScore}</p>
            <p className="text-lg text-ink-soft">Best: {best}</p>
          </>
        ) : (
          <SpeechBubble className="max-w-md text-left">
            <p className="font-read text-xl font-bold">{info.desc}</p>
          </SpeechBubble>
        )}
        <div className="flex w-full max-w-sm flex-col gap-3">
          {left > 0 ? (
            <button
              type="button"
              className="btn btn-good min-h-18 text-2xl"
              onClick={() => {
                setBestBefore(d.gameBest[id] ?? 0);
                score.current = 0;
                setShownScore(0);
                setRound((r) => r + 1);
                setPhase("playing");
              }}
            >
              {phase === "over" ? "Play again" : "Play!"} <span className="text-base">({mmss(left)} left)</span>
            </button>
          ) : (
            <button type="button" className="btn btn-good min-h-18 text-2xl" onClick={() => go("/session", { mode: "adventure", scope: "mix" })}>
              Learn to earn more time →
            </button>
          )}
          <button type="button" className="btn min-h-14 text-xl" onClick={() => go("/arcade")}>
            Back to {band === "little" ? "games" : "the arcade"}
          </button>
        </div>
      </Page>
    );
  }

  return (
    <Page className="gap-3">
      <header className="flex items-center gap-3">
        <button type="button" className="btn h-14 w-14 shrink-0 text-2xl" aria-label="Stop game" onClick={() => end("lives")}>
          ✕
        </button>
        <span className="flex-1 text-2xl font-bold">
          {info.icon} <span key={shownScore} className="inline-block animate-pop-in">{shownScore}</span>
        </span>
        <span className={`flex h-14 items-center rounded-2xl px-4 text-xl font-bold tabular-nums ${left <= 30 ? "animate-pulse-soft bg-nudge text-white" : "bg-white shadow-[0_4px_0_var(--color-line)]"}`}>
          🎮 {mmss(left)}
        </span>
      </header>
      <Game key={round} grade={profile.grade} band={band} onScore={onScore} onLevel={onLevel} onOver={onOver} />
    </Page>
  );
}
