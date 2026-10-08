"use client";

import { useEffect, useRef, useState } from "react";
import { chance, pick } from "@/content/random";
import { burstFrom, floatText } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { bubbleRound, type BubbleRound } from "./content";
import type { GameProps } from "./types";

// Bubbles float up. Pop the ones that match the sound or rule.

interface Bubble {
  id: number;
  text: string;
  good: boolean;
  x: number;
  y: number;
  speed: number;
  wobble: number;
  size: number;
  popped: number | null;
}

const HUES = ["#7fd3ff", "#b49bff", "#ff9ccd", "#8ff0c4", "#ffd47f"];

export function Bubbles({ grade, band, onScore, onLevel, onOver }: GameProps) {
  const arena = useRef<HTMLDivElement>(null);
  const [round, setRound] = useState<BubbleRound>(() => bubbleRound(grade));
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [pops, setPops] = useState(0);
  const nextId = useRef(1);
  const level = 1 + Math.floor(pops / 8);
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
      const h = arena.current?.clientHeight ?? 500;
      const good = chance(0.45);
      setBubbles((b) => [
        ...b,
        {
          id: nextId.current++,
          text: good ? pick(round.good) : pick(round.bad),
          good,
          x: 0.1 + Math.random() * 0.8,
          y: h + 60,
          speed: (55 + level * 10 + Math.random() * 30) * slow,
          wobble: Math.random() * Math.PI * 2,
          size: 84 + Math.random() * 26,
          popped: null,
        },
      ]);
    }, Math.max(650, 1200 - level * 70) / slow);
    return () => clearInterval(t);
  }, [round, level, slow]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setBubbles((list) =>
        list
          .map((b) => (b.popped ? b : { ...b, y: b.y - b.speed * dt, wobble: b.wobble + dt * 2 }))
          .filter((b) => (b.popped ? now - b.popped < 300 : b.y > -120)),
      );
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  const pop = (b: Bubble, el: Element) => {
    if (b.popped) return;
    setBubbles((list) => list.map((x) => (x.id === b.id ? { ...x, popped: performance.now() } : x)));
    if (b.good) {
      sounds.pop(Math.min(8, (pops % 8) + 1));
      burstFrom(el, 14);
      floatText(el, "+10");
      setScore((s) => s + 10);
      setPops((p) => p + 1);
      if ((pops + 1) % 6 === 0) setTimeout(() => setRound(bubbleRound(grade)), 300);
    } else {
      sounds.boop();
      floatText(el, "✗", "#e57a12");
      setLives((l) => l - 1);
    }
  };

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
      <div ref={arena} className="relative h-[58vh] min-h-[360px] w-full max-w-3xl touch-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#0b3a63] to-[#1fa2c9] select-none">
        {bubbles.map((b) => (
          <button
            key={b.id}
            type="button"
            onPointerDown={(e) => pop(b, e.currentTarget)}
            className="absolute flex items-center justify-center rounded-full font-read font-bold text-ink"
            style={{
              left: `calc(${b.x * 100}% + ${Math.sin(b.wobble) * 14}px)`,
              top: b.y,
              width: b.size,
              height: b.size,
              transform: `translate(-50%, -50%) scale(${b.popped ? 1.5 : 1})`,
              opacity: b.popped ? 0 : 1,
              transition: b.popped ? "transform .25s, opacity .25s" : undefined,
              background: `radial-gradient(circle at 32% 28%, #ffffffee 0 12%, ${HUES[b.id % HUES.length]}cc 45%, ${HUES[b.id % HUES.length]}88)`,
              boxShadow: "inset 0 0 12px #ffffff99, 0 4px 14px #0003",
              fontSize: b.text.length > 7 ? 15 : b.text.length > 3 ? 20 : 34,
            }}
            aria-label={b.text}
          >
            {b.text}
          </button>
        ))}
      </div>
      <p className="font-read text-lg text-ink-soft">Tap the bubbles that match. Wrong bubbles cost a heart!</p>
    </div>
  );
}
