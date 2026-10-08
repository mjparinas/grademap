"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { chance, pick } from "@/content/random";
import { burstFrom, floatText } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { catchRounds, type CatchRound } from "./content";
import type { GameProps } from "./types";

// Things fall from the sky. Slide the basket to catch the ones that fit.

interface Drop {
  id: number;
  emoji: string;
  label: string;
  good: boolean;
  x: number;
  y: number;
  speed: number;
}

export function Catch({ grade, band, onScore, onLevel, onOver }: GameProps) {
  const arena = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const [rounds] = useState(() => catchRounds(grade));
  const [roundIdx, setRoundIdx] = useState(0);
  const round: CatchRound = rounds[roundIdx % rounds.length];
  const [drops, setDrops] = useState<Drop[]>([]);
  const [basket, setBasket] = useState(0.5);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [caught, setCaught] = useState(0);
  const [gulp, setGulp] = useState(0);
  const nextId = useRef(1);
  const dropsRef = useRef<Drop[]>([]);
  const basketX = useRef(0.5);
  useEffect(() => {
    basketX.current = basket;
  }, [basket]);
  const level = 1 + Math.floor(caught / 8);
  const slow = band === "little" ? 0.7 : 1;

  useEffect(() => onScore(score), [score, onScore]);
  useEffect(() => onLevel(level), [level, onLevel]);
  useEffect(() => {
    speak(round.speak);
  }, [round]);
  useEffect(() => {
    if (lives > 0) return;
    const t = setTimeout(onOver, 600);
    return () => clearTimeout(t);
  }, [lives, onOver]);

  useEffect(() => {
    const t = setInterval(() => {
      const good = chance(0.5);
      const item = good ? pick(round.good) : pick(round.bad);
      dropsRef.current = [
        ...dropsRef.current,
        { id: nextId.current++, ...item, good, x: 0.08 + Math.random() * 0.84, y: -60, speed: (140 + level * 22 + Math.random() * 60) * slow },
      ];
    }, Math.max(600, 1250 - level * 80) / slow);
    return () => clearInterval(t);
  }, [round, level, slow]);

  const catchEvent = useEffectEvent((d: Drop) => {
    setGulp((g) => g + 1);
    if (d.good) {
      sounds.pop(4);
      burstFrom(basketRef.current, 12);
      floatText(basketRef.current, `+10 ${d.emoji}`);
      setScore((s) => s + 10);
      setCaught((c) => c + 1);
      // A new category every 10 catches.
      if ((caught + 1) % 10 === 0) setRoundIdx((i) => i + 1);
    } else {
      sounds.boop();
      floatText(basketRef.current, `✗ ${d.label}`, "#e57a12");
      setLives((l) => l - 1);
    }
  });

  // The physics loop works on a ref so catches are counted exactly once.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const el = arena.current;
      if (el) {
        const h = el.clientHeight;
        const w = el.clientWidth;
        const catchY = h - 70;
        const keep: Drop[] = [];
        for (const d of dropsRef.current) {
          const y = d.y + d.speed * dt;
          if (d.y < catchY && y >= catchY && Math.abs(d.x - basketX.current) * w < 70) {
            catchEvent(d);
            continue;
          }
          if (y < h + 60) keep.push({ ...d, y });
        }
        dropsRef.current = keep;
        setDrops(keep);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);



  const move = (clientX: number) => {
    const r = arena.current!.getBoundingClientRect();
    setBasket(Math.min(0.95, Math.max(0.05, (clientX - r.left) / r.width)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setBasket((b) => Math.max(0.05, b - 0.08));
      if (e.key === "ArrowRight") setBasket((b) => Math.min(0.95, b + 0.08));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full max-w-3xl items-center justify-between gap-2">
        <button type="button" onClick={() => speak(round.speak)} className="btn min-h-14 px-4 text-xl sm:text-2xl">
          🔊 {round.title}
        </button>
        <p className="text-2xl" aria-label={`${lives} lives`}>
          {"❤️".repeat(Math.max(0, lives))}
          <span className="opacity-30">{"🤍".repeat(Math.max(0, 3 - lives))}</span>
        </p>
      </div>
      <div
        ref={arena}
        data-testid="game-board"
        className="relative h-[58vh] min-h-[360px] short:h-[calc(100dvh-11rem)] short:min-h-[150px] w-full max-w-3xl touch-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#bfe8ff] to-[#d9f7d6] select-none"
        onPointerDown={(e) => move(e.clientX)}
        onPointerMove={(e) => (e.buttons || e.pointerType !== "mouse" ? move(e.clientX) : move(e.clientX))}
      >
        <div className="absolute inset-x-0 bottom-0 h-12 bg-[#7ccf6b]" />
        {drops.map((d) => (
          <div key={d.id} className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: `${d.x * 100}%`, top: d.y }}>
            <span className="text-5xl drop-shadow">{d.emoji}</span>
            <span className="rounded-full bg-white/85 px-2 text-sm font-bold text-ink">{d.label}</span>
          </div>
        ))}
        <div ref={basketRef} key={gulp} className="absolute bottom-6 -translate-x-1/2 animate-gulp text-7xl" style={{ left: `${basket * 100}%` }}>
          🧺
        </div>
      </div>
      <p className="font-read text-lg text-ink-soft">Drag or slide your finger to move the basket.</p>
    </div>
  );
}
