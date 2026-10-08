"use client";

import { useRef, useState } from "react";
import { COIN_NAMES } from "@/lib/content/math";
import { replay } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import type { CoinsQuestion as Q } from "@/lib/types";
import { Coin } from "../visuals";
import { isLocked, type QuestionProps } from "./types";

const MAX_COINS = 14;

/** Fewest coins for an amount, used to show the answer. */
function makeChange(target: number, coins: number[]): number[] {
  const out: number[] = [];
  let left = target;
  for (const c of [...coins].sort((a, b) => b - a)) {
    while (left >= c) {
      out.push(c);
      left -= c;
    }
  }
  return out;
}

export function CoinsQuestion({ q, status, onAttempt }: QuestionProps<Q>) {
  const [purse, setPurse] = useState<{ id: number; cents: number }[]>([]);
  const nextId = useRef(0);
  const purseRef = useRef<HTMLDivElement>(null);
  const locked = isLocked(status);

  const shown = status === "revealed" ? makeChange(q.target, q.coins).map((cents, id) => ({ id, cents })) : purse;
  const total = shown.reduce((s, c) => s + c.cents, 0);

  const add = (cents: number) => {
    if (purse.length >= MAX_COINS) {
      replay(purseRef.current, "animate-shake");
      return;
    }
    sounds.clink();
    replay(purseRef.current, "animate-gulp");
    setPurse((p) => [...p, { id: nextId.current++, cents }]);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
      <div ref={purseRef} className="card flex min-h-[200px] w-full flex-col items-center justify-between gap-2 p-4">
        <div className="flex min-h-[120px] flex-wrap items-center justify-center gap-2">
          {shown.length === 0 && <p className="font-read text-xl text-ink-soft">Tap the coins below to put them here.</p>}
          {shown.map((c) => (
            <button
              key={c.id}
              type="button"
              data-quiet
              disabled={locked}
              aria-label={`Take out ${COIN_NAMES[c.cents]}`}
              className="animate-drop-in rounded-full"
              onClick={() => {
                sounds.whoosh();
                setPurse((p) => p.filter((x) => x.id !== c.id));
              }}
            >
              <Coin cents={c.cents} scale={0.95} />
            </button>
          ))}
        </div>
        <p className="text-2xl font-semibold text-ink-soft">
          You have{" "}
          <span key={total} className="inline-block animate-pop-in text-4xl font-bold text-ink">
            {total}¢
          </span>
          {shown.length > 0 && !locked && <span className="ml-2 text-base">(tap a coin to take it out)</span>}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {q.coins.map((c) => (
          <button
            key={c}
            type="button"
            data-quiet
            disabled={locked}
            onClick={() => add(c)}
            className="btn min-h-28 min-w-28 flex-col px-4 py-2 text-lg"
          >
            <Coin cents={c} scale={1.1} />
            <span className="font-read">{COIN_NAMES[c]}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        data-quiet
        disabled={locked || total === 0}
        onClick={(e) => onAttempt(total === q.target, e.currentTarget)}
        className={`btn btn-good min-h-18 w-full max-w-sm text-3xl ${locked || total === 0 ? "opacity-50" : ""}`}
      >
        Check ✓
      </button>
    </div>
  );
}
