"use client";

import { useEffect, useRef, useState } from "react";
import { burstFrom, floatText } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import { memoryPairs, shuffled } from "./content";
import type { GameProps } from "./types";

// Classic pairs: flip two cards; matching pairs stay face up.

interface Card {
  id: number;
  pair: number;
  text: string;
}

function deal(grade: GameProps["grade"], pairs: number): Card[] {
  const list = memoryPairs(grade, pairs);
  return shuffled(list.flatMap((p, i) => [
    { id: i * 2, pair: i, text: p.a },
    { id: i * 2 + 1, pair: i, text: p.b },
  ]));
}

export function Memory({ grade, band, onScore, onLevel, onOver }: GameProps) {
  const pairs = band === "little" ? 4 : band === "middle" ? 6 : 8;
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<Card[]>(() => deal(grade, pairs));
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const refs = useRef<Record<number, HTMLButtonElement | null>>({});

  useEffect(() => onScore(score), [score, onScore]);
  useEffect(() => onLevel(level), [level, onLevel]);

  const flip = (c: Card) => {
    if (open.length === 2 || open.includes(c.id) || matched.includes(c.pair)) return;
    sounds.tap();
    const next = [...open, c.id];
    setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next.map((id) => cards.find((x) => x.id === id)!);
    if (a.pair === b.pair) {
      setTimeout(() => {
        sounds.pop(5);
        burstFrom(refs.current[b.id], 14);
        floatText(refs.current[b.id], "+20");
        setScore((s) => s + 20);
        const m = [...matched, a.pair];
        setMatched(m);
        setOpen([]);
        if (m.length === pairs) {
          // Fewer moves, bigger bonus. Then deal a fresh board.
          const bonus = Math.max(0, (pairs * 2 - (moves + 1)) * 5);
          setScore((s) => s + 30 + bonus);
          sounds.complete();
          setTimeout(() => {
            setCards(deal(grade, pairs));
            setMatched([]);
            setMoves(0);
            setLevel((l) => l + 1);
          }, 900);
        }
      }, 350);
    } else {
      setTimeout(() => {
        sounds.boop();
        setOpen([]);
      }, 850);
    }
  };

  // Memory has no lives; it ends when game time runs out (or the child stops).
  void onOver;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <p className="rounded-2xl bg-white px-4 py-2 text-xl font-bold shadow-[0_4px_0_var(--color-line)]">Find the matching pairs</p>
        <p className="text-lg font-semibold text-ink-soft">Moves: {moves}</p>
      </div>
      <div className={`grid w-full max-w-3xl gap-2.5 sm:gap-3 ${pairs <= 4 ? "grid-cols-4" : pairs <= 6 ? "grid-cols-4" : "grid-cols-4"}`}>
        {cards.map((c) => {
          const up = open.includes(c.id) || matched.includes(c.pair);
          return (
            <button
              key={c.id}
              ref={(el) => {
                refs.current[c.id] = el;
              }}
              type="button"
              onClick={() => flip(c)}
              className="relative aspect-[3/4] [perspective:600px]"
              aria-label={up ? c.text : "hidden card"}
            >
              <span
                className="absolute inset-0 rounded-2xl transition-transform duration-300 [transform-style:preserve-3d]"
                style={{ transform: up ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                <span className="absolute inset-0 flex items-center justify-center rounded-2xl border-4 border-[#e57a12] bg-gradient-to-br from-[#ffb05c] to-[#ff7f3f] text-4xl [backface-visibility:hidden]">
                  ❓
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center rounded-2xl border-4 bg-white p-1 text-center font-read font-bold [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    matched.includes(c.pair) ? "border-good" : "border-line"
                  } ${[...c.text].length <= 3 ? "text-4xl sm:text-5xl" : c.text.length <= 8 ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}
                >
                  {c.text}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
