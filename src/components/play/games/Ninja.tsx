"use client";

import { useEffect, useRef, useState } from "react";
import { chance, pick } from "@/content/random";
import { burstFrom, floatText } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { ninjaRound, type NinjaRound } from "./content";
import type { GameProps } from "./types";

// Words fly up from the bottom. Swipe through (or tap) the right ones.

interface Flyer {
  id: number;
  text: string;
  good: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  sliced: number | null;
}

const GRAVITY = 900;

export function Ninja({ grade, band, onScore, onLevel, onOver }: GameProps) {
  const arena = useRef<HTMLDivElement>(null);
  const [round, setRound] = useState<NinjaRound>(() => ninjaRound(grade));
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [trail, setTrail] = useState<{ x: number; y: number; t: number }[]>([]);
  const [hits, setHits] = useState(0);
  const nextId = useRef(1);
  const slicing = useRef(false);
  const level = 1 + Math.floor(hits / 8);
  const slow = band === "little" ? 0.75 : 1;

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

  // Spawning.
  useEffect(() => {
    const t = setInterval(() => {
      const el = arena.current;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const count = chance(0.35 + level * 0.05) ? 2 : 1;
      const made: Flyer[] = [];
      for (let i = 0; i < count; i++) {
        const good = chance(0.45);
        const x = 60 + Math.random() * (w - 120);
        made.push({
          id: nextId.current++,
          text: good ? pick(round.targets) : pick(round.decoys),
          good,
          x,
          y: h + 40,
          vx: (w / 2 - x) * (0.25 + Math.random() * 0.3) * slow,
          vy: -(Math.sqrt(2 * GRAVITY * h * (0.62 + Math.random() * 0.25))) * Math.sqrt(slow),
          rot: (Math.random() - 0.5) * 40,
          sliced: null,
        });
      }
      setFlyers((f) => [...f, ...made]);
    }, Math.max(650, 1300 - level * 90) / slow);
    return () => clearInterval(t);
  }, [round, level, slow]);

  // Physics.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * slow;
      last = now;
      const h = arena.current?.clientHeight ?? 600;
      setFlyers((list) =>
        list
          .map((f) => ({ ...f, x: f.x + f.vx * dt, y: f.y + f.vy * dt, vy: f.vy + GRAVITY * dt }))
          .filter((f) => f.y < h + 80 || f.vy < 0)
          .filter((f) => f.sliced === null || now - f.sliced < 450),
      );
      setTrail((t) => t.filter((p) => now - p.t < 180));
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [slow]);

  const slice = (f: Flyer, el: Element | null) => {
    if (f.sliced !== null) return;
    setFlyers((list) => list.map((x) => (x.id === f.id ? { ...x, sliced: performance.now() } : x)));
    if (f.good) {
      const c = combo + 1;
      setCombo(c);
      const pts = 10 * Math.min(5, c);
      setScore((s) => s + pts);
      setHits((h) => h + 1);
      sounds.pop(Math.min(8, c));
      burstFrom(el, 16);
      floatText(el, c > 1 ? `+${pts} ×${Math.min(5, c)}` : `+${pts}`);
      // Sight words: a new word after each hit. Categories: a new one every 6 hits.
      if (round.targets.length === 1 || (hits + 1) % 6 === 0) setTimeout(() => setRound(ninjaRound(grade)), 350);
    } else {
      setCombo(0);
      sounds.boop();
      floatText(el, "✗", "#e57a12");
      setLives((l) => l - 1);
    }
  };

  const hitTest = (x: number, y: number) => {
    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      const id = (el as HTMLElement).dataset?.flyer;
      if (id) {
        const f = flyers.find((ff) => ff.id === Number(id));
        if (f) slice(f, el);
      }
    }
  };

  const point = (e: React.PointerEvent) => {
    const r = arena.current!.getBoundingClientRect();
    setTrail((t) => [...t.slice(-14), { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }]);
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full max-w-3xl items-center justify-between gap-2">
        <button type="button" onClick={() => speak(round.speak)} className="btn min-h-14 px-4 text-xl sm:text-2xl">
          🔊 <span className="font-read">{round.targets.length === 1 ? `Slice: ${round.title}` : round.title}</span>
        </button>
        <p className="text-2xl" aria-label={`${lives} lives`}>
          {"❤️".repeat(Math.max(0, lives))}
          <span className="opacity-30">{"🤍".repeat(Math.max(0, 3 - lives))}</span>
        </p>
      </div>
      <div
        ref={arena}
        data-testid="game-board"
        className="relative h-[58vh] min-h-[360px] short:h-[calc(100dvh-11rem)] short:min-h-[150px] w-full max-w-3xl touch-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#2a1f4f] via-[#3b2a6b] to-[#ff7eb3]/60 select-none"
        onPointerDown={(e) => {
          slicing.current = true;
          point(e);
          hitTest(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!slicing.current && e.pointerType !== "mouse") return;
          if (e.buttons || e.pointerType !== "mouse") {
            point(e);
            hitTest(e.clientX, e.clientY);
          }
        }}
        onPointerUp={() => (slicing.current = false)}
        onPointerLeave={() => (slicing.current = false)}
      >
        {combo >= 3 && <p className="absolute top-3 left-1/2 -translate-x-1/2 animate-pop-in text-3xl font-bold text-[#ffe59a] drop-shadow">Combo ×{Math.min(5, combo)}!</p>}
        {flyers.map((f) => (
          <div
            key={f.id}
            data-flyer={f.id}
            className="absolute rounded-2xl bg-white px-4 py-2 font-read text-2xl font-bold text-ink shadow-lg sm:text-3xl"
            style={{
              left: f.x,
              top: f.y,
              transform: `translate(-50%, -50%) rotate(${f.rot + (f.sliced ? 25 : 0)}deg) scale(${f.sliced ? 1.3 : 1})`,
              opacity: f.sliced ? 0 : 1,
              transition: f.sliced ? "transform .4s, opacity .4s" : undefined,
              background: f.sliced ? (f.good ? "#7fe0b5" : "#ffb37a") : undefined,
            }}
          >
            {f.text}
          </div>
        ))}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {trail.length > 1 && <polyline points={trail.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />}
        </svg>
      </div>
      <p className="font-read text-lg text-ink-soft">Swipe through the right words. Wrong words cost a heart!</p>
    </div>
  );
}
