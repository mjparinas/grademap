"use client";

import { useRef, useState } from "react";
import { burstFrom, replay } from "@/lib/juice";
import { sounds } from "@/lib/sound";
import type { SortQuestion as Q } from "@/content/types";
import { isLocked, type QuestionProps } from "./types";

export function SortQuestion({ q, status, onAttempt, onSlip, onSpeak }: QuestionProps<Q>) {
  const [sorted, setSorted] = useState<Record<string, string>>({});
  const remaining = q.items.filter((i) => !sorted[i.id]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Always have something picked so a child can just tap a basket.
  const selected = remaining.find((i) => i.id === selectedId) ?? remaining[0];
  const binRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const locked = isLocked(status);

  const drop = (binId: string) => {
    if (!selected || locked) return;
    onSpeak?.(q.bins.find((b) => b.id === binId)?.label ?? "");
    const el = binRefs.current[binId];
    if (selected.bin !== binId) {
      replay(el, "animate-shake");
      onSlip(el);
      return;
    }
    const next = { ...sorted, [selected.id]: binId };
    setSorted(next);
    setSelectedId(null);
    replay(el, "animate-gulp");
    if (Object.keys(next).length === q.items.length) {
      onAttempt(true, el);
    } else {
      sounds.pop(Object.keys(next).length);
      burstFrom(el, 10);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
      <div className="flex min-h-24 flex-wrap justify-center gap-3">
        {remaining.map((item, i) => {
          const isSel = item.id === selected?.id;
          return (
            <div key={item.id} className="animate-pop-in" style={{ animationDelay: `${i * 50}ms` }}>
              <button
                type="button"
                data-testid="sort-item"
                onClick={() => {
                  setSelectedId(item.id);
                  onSpeak?.(item.label);
                }}
                aria-pressed={isSel}
                className={`btn min-h-20 px-4 font-read text-xl transition-transform sm:text-2xl ${
                  isSel ? "btn-soft -translate-y-2 scale-105 ring-4 ring-[color:var(--c)]/50" : ""
                }`}
              >
                <span className={`text-4xl ${isSel ? "animate-wiggle" : ""}`}>{item.emoji}</span>
                {item.label}
              </button>
            </div>
          );
        })}
        {remaining.length === 0 && <p className="self-center text-2xl font-semibold text-good">All sorted! 🎉</p>}
      </div>

      {selected && !locked && (
        <p className="font-read text-xl text-ink-soft">
          Where does <b className="text-ink">{selected.label}</b> go? Tap a basket.
        </p>
      )}

      <div className={`grid w-full gap-4 ${q.bins.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {q.bins.map((bin) => {
          const inside = q.items.filter((i) => sorted[i.id] === bin.id);
          return (
            <button
              key={bin.id}
              ref={(el) => {
                binRefs.current[bin.id] = el;
              }}
              type="button"
              data-quiet
              data-testid="bin"
              disabled={locked}
              onClick={() => drop(bin.id)}
              className="btn btn-soft min-h-52 flex-col justify-start gap-2 p-4"
            >
              <span className="text-5xl">{bin.emoji}</span>
              <span className="text-2xl font-bold capitalize sm:text-3xl">{bin.label}</span>
              <span className="flex flex-wrap justify-center gap-1.5">
                {inside.map((i) => (
                  <span key={i.id} className="animate-drop-in rounded-xl bg-white px-2 py-1 text-3xl shadow-sm" title={i.label}>
                    {i.emoji}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
