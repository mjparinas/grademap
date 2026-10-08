"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { pick, randInt, shuffle } from "@/content/random";
import { burstFrom, floatText } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import { CritterSvg } from "../../Critter";
import { muncherRules, type MuncherRule } from "./content";
import type { GameProps } from "./types";

// A grid of numbers. Move the muncher (tap a square, or use the arrow keys)
// and munch everything that fits the rule. Grumbles wander the board.

const COLS = 6;
const ROWS = 5;

interface Cell {
  text: string;
  good: boolean;
  eaten: boolean;
}

function makeBoard(rule: MuncherRule): Cell[] {
  const goodCount = randInt(8, 11);
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ ...rule.cell(i < goodCount), eaten: false }));
  return shuffle(cells);
}

/** Send any Grumble on the muncher's square back to a far corner. */
function sendHome(enemies: { current: number[] }, pos: number): number[] {
  enemies.current = enemies.current.map((x) => (x === pos ? (pos === 0 ? COLS * ROWS - 1 : 0) : x));
  return enemies.current;
}

export function Munchers({ grade, band, onScore, onLevel, onOver }: GameProps) {
  const [level, setLevel] = useState(1);
  const [rule, setRule] = useState<MuncherRule>(() => pick(muncherRules(grade)));
  const [board, setBoard] = useState<Cell[]>(() => makeBoard(rule));
  const [pos, setPos] = useState(0);
  const [enemies, setEnemies] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [hurt, setHurt] = useState(false);
  const target = useRef<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const enemyCount = band === "little" ? 0 : Math.min(3, Math.floor((level - 1) / 2) + (level > 1 ? 1 : 0));

  const lose = useCallback(
    (why: string) => {
      sounds.boop();
      setMsg(why);
      setHurt(true);
      setTimeout(() => setHurt(false), 500);
      setLives((l) => l - 1);
    },
    [],
  );

  useEffect(() => {
    if (lives > 0) return;
    const t = setTimeout(onOver, 700);
    return () => clearTimeout(t);
  }, [lives, onOver]);

  const munch = useCallback(
    (i: number) => {
      const cell = board[i];
      if (!cell || cell.eaten) return;
      if (cell.good) {
        sounds.pop(Math.min(8, score / 30));
        burstFrom(cellRefs.current[i], 12);
        floatText(cellRefs.current[i], "+10");
        const next = board.map((c, j) => (j === i ? { ...c, eaten: true } : c));
        setBoard(next);
        setScore((s) => s + 10);
        setMsg(null);
        if (next.every((c) => !c.good || c.eaten)) {
          // Board cleared: bonus, then a new rule.
          sounds.complete();
          setScore((s) => s + 50);
          setTimeout(() => {
            const r = pick(muncherRules(grade));
            setRule(r);
            setBoard(makeBoard(r));
            setLevel((l) => l + 1);
            enemiesRef.current = [];
            setEnemies([]);
          }, 700);
        }
      } else {
        lose(rule.why(cell.text));
        setBoard(board.map((c, j) => (j === i ? { ...c, eaten: true } : c)));
      }
    },
    [board, grade, lose, rule, score],
  );

  useEffect(() => onScore(score), [score, onScore]);
  useEffect(() => onLevel(level), [level, onLevel]);

  // Step toward a tapped square, then munch it.
  const posRef = useRef(pos);
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);
  // Grumbles live in a ref too, so collisions are checked in one place.
  const enemiesRef = useRef<number[]>([]);
  const caught = useEffectEvent(() => {
    lose("A Grumble got you!");
    setEnemies(sendHome(enemiesRef, posRef.current));
  });
  const moveTo = useEffectEvent((next: number) => {
    posRef.current = next;
    setPos(next);
    if (enemiesRef.current.includes(next)) caught();
  });

  // Step toward a tapped square, then munch it.
  useEffect(() => {
    const t = setInterval(() => {
      const goal = target.current;
      if (goal === null) return;
      const p = posRef.current;
      if (p === goal) {
        target.current = null;
        munch(goal);
        return;
      }
      const [r, c] = [Math.floor(p / COLS), p % COLS];
      const [gr, gc] = [Math.floor(goal / COLS), goal % COLS];
      sounds.tap();
      moveTo(c !== gc ? r * COLS + c + Math.sign(gc - c) : (r + Math.sign(gr - r)) * COLS + c);
    }, 110);
    return () => clearInterval(t);
  }, [munch]);

  // Grumbles.
  useEffect(() => {
    if (enemies.length < enemyCount) {
      const spawn = setTimeout(() => {
        const corners = [0, COLS - 1, COLS * ROWS - 1, COLS * (ROWS - 1)].filter((c) => c !== posRef.current);
        enemiesRef.current = [...enemiesRef.current, pick(corners)];
        setEnemies(enemiesRef.current);
      }, 1500);
      return () => clearTimeout(spawn);
    }
    const t = setInterval(() => {
      enemiesRef.current = enemiesRef.current.map((e) => {
        const [r, c] = [Math.floor(e / COLS), e % COLS];
        const moves = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ].filter(([rr, cc]) => rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS);
        const [nr, nc] = pick(moves);
        return nr * COLS + nc;
      });
      setEnemies(enemiesRef.current);
      if (enemiesRef.current.includes(posRef.current)) caught();
    }, Math.max(450, 1100 - level * 80));
    return () => clearInterval(t);
  }, [enemies.length, enemyCount, level]);

  // Keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const [r, c] = [Math.floor(pos / COLS), pos % COLS];
      const moves: Record<string, [number, number]> = { ArrowUp: [r - 1, c], ArrowDown: [r + 1, c], ArrowLeft: [r, c - 1], ArrowRight: [r, c + 1] };
      if (moves[e.key]) {
        e.preventDefault();
        const [nr, nc] = moves[e.key];
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) moveTo(nr * COLS + nc);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        munch(pos);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pos, munch]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full max-w-3xl items-center justify-between gap-2">
        <p className="rounded-2xl bg-white px-4 py-2 text-xl font-bold shadow-[0_4px_0_var(--color-line)] sm:text-2xl">{rule.title}</p>
        <p className="text-2xl" aria-label={`${lives} lives`}>
          {"❤️".repeat(Math.max(0, lives))}
          <span className="opacity-30">{"🤍".repeat(Math.max(0, 3 - lives))}</span>
        </p>
      </div>
      <div className={`grid w-full max-w-3xl gap-1.5 rounded-3xl bg-[#1d2a4d] p-2 sm:gap-2 sm:p-3 ${hurt ? "animate-shake" : ""}`} style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {board.map((cell, i) => {
          const here = pos === i;
          const enemy = enemies.includes(i);
          return (
            <button
              key={i}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              type="button"
              onClick={() => (here ? munch(i) : (target.current = i))}
              className={`relative flex aspect-[4/3] items-center justify-center rounded-xl text-lg font-bold transition-colors sm:text-2xl ${
                cell.eaten ? "bg-[#26355f] text-transparent" : "bg-[#2f4377] text-white hover:bg-[#3a5290]"
              } ${here ? "ring-4 ring-[#7fe0b5]" : ""}`}
              aria-label={cell.eaten ? "empty" : cell.text}
            >
              <span className="font-read">{cell.eaten ? "" : cell.text}</span>
              {here && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="h-[88%] w-[88%] animate-pulse-soft">
                    <CritterSvg id="shelly" mood="cheer" />
                  </span>
                </span>
              )}
              {enemy && !here && <span className="pointer-events-none absolute inset-0 flex animate-wiggle items-center justify-center text-3xl sm:text-4xl">👾</span>}
            </button>
          );
        })}
      </div>
      <p className="min-h-8 text-center font-read text-lg font-bold text-nudge-dark" aria-live="polite">
        {msg ?? (band === "little" ? "Tap a square to move there and munch!" : "Tap a square to move and munch · arrow keys + space work too")}
      </p>
    </div>
  );
}
